import { type UserVotingRecord } from "@/lib/types";
import { format } from "date-fns";

const calculatePercentage = (count: number, total: number): number =>
  total > 0 ? Math.round((count / total) * 100) : 0;

export const generateVotingHistoryMarkdown = (
  votingHistory: UserVotingRecord[],
  categoryPreferences: Record<string, number>,
  tagPreferences: Record<string, number>
): string => {
  const totalVotes = votingHistory.length;
  const mostVotedCategory =
    Object.entries(categoryPreferences).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    "暂无";
  const mostVotedTag =
    Object.entries(tagPreferences).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || "暂无";

  let markdown = `# 🎨 我的代码审美偏好报告

> 生成时间：${format(new Date(), "yyyy/M/d HH:mm:ss")}
> 
> 这是一个基于我在代码竞技场的投票历史生成的个性化分析报告

## 📊 投票统计概览

- **总投票数**：${totalVotes} 次
- **最偏好技术栈**：${mostVotedCategory}
- **最偏好标签**：${mostVotedTag}

## 🔍 技术栈偏好分布

`;

  if (Object.keys(categoryPreferences).length === 0) {
    markdown += `暂无投票记录

`;
  } else {
    Object.entries(categoryPreferences)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        const percentage = calculatePercentage(count, totalVotes);
        markdown += `### ${category}
- **投票次数**：${count} 次
- **占比**：${percentage}%

`;
      });
  }

  markdown += `## 🎯 标签偏好分布

`;

  if (Object.keys(tagPreferences).length === 0) {
    markdown += `暂无投票记录

`;
  } else {
    Object.entries(tagPreferences)
      .sort(([, a], [, b]) => b - a)
      .forEach(([tag, count]) => {
        const percentage = calculatePercentage(count, totalVotes);
        markdown += `### #${tag}
- **投票次数**：${count} 次  
- **占比**：${percentage}%

`;
      });
  }

  markdown += `## 💡 我的审美选择详情

`;

  if (votingHistory.length === 0) {
    markdown += `> 我还没有参与任何代码对决，快去竞技场投票吧！

`;
  } else {
    votingHistory.forEach((item, index) => {
      const { battle, implementation } = item;
      markdown += `### ${index + 1}. ${battle.title}

**对战描述**：${battle.description}

**技术栈**：${battle.category} | **标签**：${implementation.tags.map(tag => `#${tag}`).join(", ")}

**我的选择**：${implementation.title}

**选择理由**：
${implementation.pros.map((pro: string) => `- ${pro}`).join("\n")}

**实现代码**：
\`\`\`${battle.category.toLowerCase()}
${implementation.code}
\`\`\`

**投票时间**：${item.votedAt}

---

`;
    });
  }

  markdown += `## 🌟 个性化代码风格建议

基于我的投票偏好，以下是一些代码风格建议：

### 主要偏好特征
`;

  if (mostVotedCategory !== "暂无") {
    markdown += `- 我偏爱 **${mostVotedCategory}** 技术栈的解决方案
`;
  }

  if (mostVotedTag !== "暂无") {
    markdown += `- 我倾向于 **${mostVotedTag}** 风格的代码实现
`;
  }

  if (votingHistory.length > 0) {
    markdown += `- 我在选择时注重代码的 ${
      votingHistory[0]?.implementation.pros.join("、") || "可读性和性能"
    }
`;
  }

  markdown += `
### 推荐学习方向

1. **深入 ${mostVotedCategory} 生态**：继续深耕我最偏好的技术栈
2. **关注 ${mostVotedTag} 标签**：多参与此类风格的代码挑战，提升审美品味
3. **代码风格一致性**：将我在投票中体现出的审美偏好应用到实际项目中

### 代码审查建议

在审查他人代码时，我可以关注：
- 代码结构是否符合我偏好的组织方式
- 是否具备我在投票中看重的优点（如可读性、性能、简洁性等）
- 是否有我在投票中避免的缺点（如过度复杂、性能问题等）

---

*这份报告基于我的投票历史生成，随着我参与更多代码对决，我的偏好可能会发生变化。建议定期重新生成报告以了解我的审美演变。*

**生成工具**：代码竞技场 - 组件竞技场项目
**报告类型**：个人审美偏好分析
`;

  return markdown;
};

export const downloadMarkdownFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
