// GitHub API Service
export interface GitHubFileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha?: string;
  size?: number;
  children?: GitHubFileNode[];
}

export interface GitHubFileContent {
  name: string;
  path: string;
  content: string;
  encoding: string;
  size: number;
}

export interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * 检查仓库是否为私有仓库（通过尝试获取仓库基本信息）
 * @param owner - 仓库拥有者
 * @param repo - 仓库名称
 * @param userToken - 用户提供的token
 * @returns 'private' | 'not_found' | 'public' | 'unknown'
 */
export const checkRepositoryStatus = async function(
  owner: string,
  repo: string,
  userToken?: string | null
): Promise<'private' | 'not_found' | 'public' | 'unknown'> {
  try {
    // 尝试获取仓库基本信息
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      { headers: getGitHubHeaders(userToken) }
    );

    if (response.ok) {
      const data = await response.json();
      return data.private ? 'private' : 'public';
    }

    if (response.status === 404) {
      // 检查是否有 Token
      const hasToken = !!userToken;
      
      if (hasToken) {
        // 有 Token 但仍返回 404，有两种可能：
        // 1. 仓库真的不存在
        // 2. Token 权限不足（私有仓库但 Token 没有访问权限）
        // 无法区分这两种情况，返回 'not_found' 但调用方需要考虑可能是权限问题
        return 'not_found';
      } else {
        // 无 Token 情况下的 404，假设可能是私有仓库
        return 'private';
      }
    }

    if (response.status === 403) {
      // 403 通常意味着 Token 权限不足或 API 限流
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || '';
      
      // 检查是否是权限问题
      if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('access')) {
        return 'private';
      }
    }

    return 'unknown';
  } catch (error) {
    console.error('Error checking repository status:', error);
    return 'unknown';
  }
}

/**
 * 验证 GitHub Token 是否有效
 * @param token - 要验证的token
 * @returns { valid: boolean, error?: string, login?: string } 验证结果
 */
export const verifyGitHubToken = async function(
  token: string | null
): Promise<{ valid: boolean; error?: string; login?: string }> {
  if (!token || token.trim() === '' || token === 'your_github_personal_access_token_here') {
    return { valid: false, error: 'TOKEN_EMPTY:Token 不能为空' };
  }

  try {
    // 使用 /user 端点验证 token，这是最轻量的验证方式
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: getGitHubHeaders(token),
    });

    if (response.ok) {
      const userData = await response.json();
      return { valid: true, login: userData.login };
    }

    if (response.status === 401) {
      return { valid: false, error: 'AUTH_FAILED:Token 无效或已过期，请重新配置' };
    }

    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || '';
      
      // 检查是否是限流问题
      if (message.toLowerCase().includes('rate limit')) {
        return { valid: false, error: 'RATE_LIMIT:GitHub API 已达到限流，请稍后再试' };
      }
      
      return { valid: false, error: 'AUTH_FAILED:Token 权限不足或被禁用' };
    }

    return { valid: false, error: `AUTH_FAILED:验证 Token 失败 (状态码: ${response.status})` };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false, error: 'NETWORK_ERROR:网络错误，无法验证 Token' };
  }
};

/**
 * 检查分支是否存在
 * @param owner - 仓库拥有者
 * @param repo - 仓库名称
 * @param branch - 分支名称
 * @param userToken - 用户提供的token
 * @returns 'exists' | 'not_found' | 'no_access' | 'unknown'
 */
export const checkBranchExists = async function(
  owner: string,
  repo: string,
  branch: string,
  userToken?: string | null
): Promise<'exists' | 'not_found' | 'no_access' | 'unknown'> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`,
      { headers: getGitHubHeaders(userToken) }
    );

    if (response.ok) {
      return 'exists';
    }

    if (response.status === 404) {
      return 'not_found';
    }

    if (response.status === 403) {
      return 'no_access';
    }

    if (response.status === 401) {
      return 'no_access';
    }

    return 'unknown';
  } catch (error) {
    console.error('Error checking branch:', error);
    return 'unknown';
  }
};

/**
 * 获取 GitHub API 请求头
 * @param userToken - 用户提供的token（必需）
 */
export const getGitHubHeaders = (userToken?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  // 只使用用户提供的token
  if (userToken && userToken !== 'your_github_personal_access_token_here') {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  return headers;
};

/**
 * 获取仓库的文件树结构
 * @param owner - 仓库拥有者
 * @param repo - 仓库名称
 * @param branch - 分支名称
 * @param userToken - 用户提供的GitHub token
 */
export const getRepositoryTree = async function(
  owner: string,
  repo: string,
  branch: string = 'main',
  userToken?: string | null
): Promise<GitHubFileNode[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: getGitHubHeaders(userToken) }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `HTTP ${response.status}`;
      const hasToken = !!userToken;
      
      if (response.status === 403) {
        const errorMessage = errorData.message || '';
        // 检查是否是权限相关的 403
        if (errorMessage.toLowerCase().includes('permission') || 
            errorMessage.toLowerCase().includes('access') ||
            errorMessage.toLowerCase().includes('forbidden')) {
          throw new Error(`PRIVATE_REPO:无权访问此仓库。这可能是一个私有仓库，请配置具有访问权限的 GitHub Token。`);
        }
        
        // API 限流
        if (hasToken) {
          throw new Error(`RATE_LIMIT:GitHub API 限流: ${message}. 请稍后重试。`);
        } else {
          throw new Error(`RATE_LIMIT:GitHub API 限流。请配置 GitHub Token 后重试。`);
        }
      } else if (response.status === 404) {
        // 对于 404，先检查仓库状态，然后检查分支状态
        const repoStatus = await checkRepositoryStatus(owner, repo, userToken);
        
        if (repoStatus === 'private') {
          throw new Error(`PRIVATE_REPO:无法访问此仓库。这是一个私有仓库，请配置具有访问权限的 GitHub Token。`);
        } else if (repoStatus === 'public') {
          // 仓库存在且是公共的，检查分支是否存在
          const branchStatus = await checkBranchExists(owner, repo, branch, userToken);
          
          if (branchStatus === 'not_found') {
            throw new Error(`NOT_FOUND:分支 "${branch}" 不存在。请检查分支名称（常见：main、master、develop）。\n\n如果分支名称包含特殊字符或斜杠（如 feature/test-workflow），请确认分支名称完全正确。`);
          } else if (branchStatus === 'no_access') {
            throw new Error(`PRIVATE_REPO:分支 "${branch}" 存在但无访问权限。这可能是受保护的分支，请配置具有适当权限的 GitHub Token。`);
          } else {
            throw new Error(`NOT_FOUND:无法访问分支 "${branch}" 的文件树。分支可能为空或存在其他问题。`);
          }
        } else if (repoStatus === 'not_found') {
          // 有 Token 但仍然返回 404，进一步检查是否是分支问题
          if (hasToken) {
            const branchStatus = await checkBranchExists(owner, repo, branch, userToken);
            
            if (branchStatus === 'not_found') {
              throw new Error(`NOT_FOUND:仓库 ${owner}/${repo} 存在，但分支 "${branch}" 不存在。\n\n请检查：\n• 分支名称是否正确（如：feature/test-workflow）\n• 分支是否已被删除或重命名\n• 常见分支名：main、master、develop`);
            } else if (branchStatus === 'no_access') {
              throw new Error(`PRIVATE_REPO:无法访问仓库 ${owner}/${repo} 的分支 "${branch}"。可能原因：\n1. 这是私有仓库但您的 Token 没有访问权限\n2. 分支存在但您没有访问权限\n3. 您不是该仓库的协作者\n\n请确认：\n• Token 有 'repo' 权限（可访问私有仓库）\n• 您是该仓库的所有者或协作者\n• 分支名称正确（如：feature/test-workflow）`);
            } else {
              throw new Error(`PRIVATE_REPO:无法访问仓库 ${owner}/${repo} 的分支 "${branch}"。可能原因：\n1. 仓库或分支不存在\n2. 这是私有仓库但您的 Token 没有访问权限\n3. 您不是该仓库的协作者\n\n请确认：\n• Token 有 'repo' 权限（可访问私有仓库）\n• 您是该仓库的所有者或协作者\n• 分支名称正确（如：feature/test-workflow）`);
            }
          } else {
            throw new Error(`NOT_FOUND:仓库 ${owner}/${repo} 不存在。请检查仓库地址是否正确。`);
          }
        } else {
          // 无法确定，给出通用提示
          if (hasToken) {
            throw new Error(`PRIVATE_REPO:无法访问此仓库的分支 "${branch}"。请检查 Token 权限、仓库访问权限和分支名称。`);
          } else {
            throw new Error(`PRIVATE_REPO:仓库不存在、分支错误，或这是一个私有仓库。如果是私有仓库，请配置 GitHub Token。`);
          }
        }
      } else if (response.status === 401) {
        // 401 表示认证失败
        throw new Error(`AUTH_FAILED:认证失败。请检查 Token 是否有效或是否已过期。`);
      }
      
      throw new Error(`GitHub API 错误 (${response.status}): ${message}`);
    }

    const data = await response.json();
    
    // 构建树形结构
    const tree = buildTree(data.tree);
    return tree;
  } catch (error) {
    console.error('Error fetching repository tree:', error);
    throw error;
  }
}

/**
 * 获取文件内容
 * @param owner - 仓库拥有者
 * @param repo - 仓库名称
 * @param path - 文件路径
 * @param branch - 分支名称
 * @param userToken - 用户提供的GitHub token
 */
export const getFileContent = async function(
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main',
  userToken?: string | null
): Promise<GitHubFileContent> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers: getGitHubHeaders(userToken) }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `HTTP ${response.status}`;
      const hasToken = !!userToken;
      
      if (response.status === 403) {
        const errorMessage = errorData.message || '';
        // 检查是否是权限相关的 403
        if (errorMessage.toLowerCase().includes('permission') || 
            errorMessage.toLowerCase().includes('access') ||
            errorMessage.toLowerCase().includes('forbidden')) {
          throw new Error(`PRIVATE_REPO:无权访问此文件。这可能是私有仓库的文件，请配置具有访问权限的 GitHub Token。`);
        }
        
        // API 限流
        if (hasToken) {
          throw new Error(`RATE_LIMIT:GitHub API 限流: ${message}. 请稍后重试。`);
        } else {
          throw new Error(`RATE_LIMIT:GitHub API 限流。请配置 GitHub Token 后重试。`);
        }
      } else if (response.status === 404) {
        // 对于文件的 404，我们假设如果能到达这里，仓库是可访问的
        // 所以 404 更可能是文件真的不存在
        throw new Error(`NOT_FOUND:文件不存在: ${path}`);
      } else if (response.status === 401) {
        // 401 表示认证失败
        throw new Error(`AUTH_FAILED:认证失败。请检查 Token 是否有效或是否已过期。`);
      }
      
      throw new Error(`GitHub API 错误 (${response.status}): ${message}`);
    }

    const data = await response.json();
    
    // 解码base64内容 - 正确处理 UTF-8 编码
    let content = '';
    if (data.content) {
      try {
        // 移除换行符
        const base64 = data.content.replaceAll('\n', '');
        // 使用 TextDecoder 正确解码 UTF-8
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.codePointAt(i) || 0;
        }
        content = new TextDecoder('utf8').decode(bytes);
      } catch (error) {
        console.error('Error decoding content:', error);
        // 降级到简单的 atob
        content = atob(data.content.replaceAll('\n', ''));
      }
    }
    
    return {
      name: data.name,
      path: data.path,
      content,
      encoding: data.encoding,
      size: data.size,
    };
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

/**
 * 从扁平的文件列表构建树形结构
 */
export const buildTree = function(items: GitHubTreeItem[]): GitHubFileNode[] {
  const root: GitHubFileNode[] = [];
  const map = new Map<string, GitHubFileNode>();

  // 排序：文件夹在前，文件在后
  items.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'tree' ? -1 : 1;
    }
    return a.path.localeCompare(b.path);
  });

  items.forEach(item => {
    const node: GitHubFileNode = {
      name: item.path.split('/').pop() || item.path,
      path: item.path,
      type: item.type === 'tree' ? 'dir' : 'file',
      sha: item.sha,
      size: item.size,
      children: item.type === 'tree' ? [] : undefined,
    };

    map.set(item.path, node);

    const pathParts = item.path.split('/');
    if (pathParts.length === 1) {
      // 根目录项
      root.push(node);
    } else {
      // 子项
      const parentPath = pathParts.slice(0, -1).join('/');
      const parent = map.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  });

  return root;
}

/**
 * 获取文件的原始内容（适用于图片等二进制文件）
 * @param owner - 仓库拥有者
 * @param repo - 仓库名称
 * @param path - 文件路径
 * @param branch - 分支名称
 * @param userToken - 用户提供的GitHub token
 * @returns Blob对象
 */
export const getFileBlob = async function(
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main',
  userToken?: string | null
): Promise<Blob> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers: getGitHubHeaders(userToken) }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `HTTP ${response.status}`;
      
      if (response.status === 403) {
        throw new Error(`PRIVATE_REPO:无权访问此文件。这可能是私有仓库的文件，请配置具有访问权限的 GitHub Token。`);
      } else if (response.status === 404) {
        throw new Error(`NOT_FOUND:文件不存在: ${path}`);
      } else if (response.status === 401) {
        throw new Error(`AUTH_FAILED:认证失败。请检查 Token 是否有效或是否已过期。`);
      }
      
      throw new Error(`GitHub API 错误 (${response.status}): ${message}`);
    }

    const data = await response.json();
    
    // 解码base64内容为二进制
    if (data.content) {
      const base64 = data.content.replaceAll('\n', '');
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.codePointAt(i) || 0;
      }
      
      // 根据文件扩展名确定MIME类型
      const extension = path.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
        'ico': 'image/x-icon',
        'bmp': 'image/bmp',
        'apng': 'image/apng',
      };
      const mimeType = mimeTypes[extension || ''] || 'application/octet-stream';
      
      return new Blob([bytes], { type: mimeType });
    }
    
    throw new Error('文件内容为空');
  } catch (error) {
    console.error('Error fetching file blob:', error);
    throw error;
  }
}

/**
 * 解析GitHub URL
 */
export const parseGitHubUrl = function(url: string): { owner: string; repo: string; branch?: string } | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'github.com') {
      return null;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return null;
    }

    const owner = pathParts[0]!;
    const repo = pathParts[1]!;
    let branch: string | undefined;

    // 检查是否有 /tree/branch
    if (pathParts.length >= 4 && pathParts[2] === 'tree') {
      // 分支名可能包含斜杠（如 feature/test-workflow），需要重新组合
      branch = pathParts.slice(3).join('/');
    }

    return { owner, repo, branch };
  } catch {
    return null;
  }
};
