import { parseGitHubUrl, checkBranchExists } from './githubService';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

// Mock fetch
globalThis.fetch = vi.fn();

describe('parseGitHubUrl', () => {
  it('should parse URL with feature branch correctly', () => {
    const url = 'https://github.com/forge-town/code-arena/tree/feature/test-workflow';
    const result = parseGitHubUrl(url);
    
    expect(result).toEqual({
      owner: 'forge-town',
      repo: 'code-arena',
      branch: 'feature/test-workflow'
    });
  });

  it('should parse URL with simple branch correctly', () => {
    const url = 'https://github.com/forge-town/code-arena/tree/main';
    const result = parseGitHubUrl(url);
    
    expect(result).toEqual({
      owner: 'forge-town',
      repo: 'code-arena',
      branch: 'main'
    });
  });

  it('should parse URL without branch correctly', () => {
    const url = 'https://github.com/forge-town/code-arena';
    const result = parseGitHubUrl(url);
    
    expect(result).toEqual({
      owner: 'forge-town',
      repo: 'code-arena'
    });
  });

  it('should handle complex branch names with multiple slashes', () => {
    const url = 'https://github.com/forge-town/code-arena/tree/feature/very/complex/branch';
    const result = parseGitHubUrl(url);
    
    expect(result).toEqual({
      owner: 'forge-town',
      repo: 'code-arena',
      branch: 'feature/very/complex/branch'
    });
  });

  it('should return null for invalid URLs', () => {
    const url = 'https://gitlab.com/forge-town/code-arena';
    const result = parseGitHubUrl(url);
    
    expect(result).toBeNull();
  });
});

describe('checkBranchExists', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return "exists" when branch exists', async () => {
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'feature/test-workflow' })
    });

    const result = await checkBranchExists('forge-town', 'code-arena', 'feature/test-workflow', 'token');
    
    expect(result).toBe('exists');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/forge-town/code-arena/branches/feature%2Ftest-workflow',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer token'
        })
      })
    );
  });

  it('should return "not_found" when branch does not exist', async () => {
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const result = await checkBranchExists('forge-town', 'code-arena', 'nonexistent', 'token');
    
    expect(result).toBe('not_found');
  });

  it('should return "no_access" for 403 status', async () => {
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 403
    });

    const result = await checkBranchExists('forge-town', 'code-arena', 'feature/test-workflow', 'token');
    
    expect(result).toBe('no_access');
  });

  it('should encode branch name properly in URL', async () => {
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'feature/test-workflow' })
    });

    await checkBranchExists('forge-town', 'code-arena', 'feature/test-workflow', 'token');
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/forge-town/code-arena/branches/feature%2Ftest-workflow',
      expect.any(Object)
    );
  });
});