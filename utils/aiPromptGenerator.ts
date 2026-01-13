import { type CodeImplementation } from "@/lib/types";
import { format } from "date-fns";

export interface AIPrompt {
  id: string;
  implementationId: string;
  title: string;
  prompt: string;
  category: string;
  difficulty: string;
  createdAt: string;
}

export class AIPromptGenerator {
  static generatePrompt(
    implementation: CodeImplementation,
    category: string
  ): AIPrompt {
    const basePrompt = this.generateBasePrompt(implementation, category);
    const enhancedPrompt = this.enhancePrompt(basePrompt, category);

    return {
      id: `prompt-${implementation.id}-${Date.now()}`,
      implementationId: implementation.id.toString(),
      title: `${implementation.title} - AI代码生成提示`,
      prompt: enhancedPrompt,
      category: category,
      difficulty: "intermediate",
      createdAt: new Date().toISOString(),
    };
  }

  private static generateBasePrompt(
    implementation: CodeImplementation,
    category: string
  ): string {
    const codeBlock = "```";
    const lang = category.toLowerCase().includes("react")
      ? "tsx"
      : category.toLowerCase().includes("vue")
        ? "vue"
        : "javascript";

    return [
      "# AI代码生成提示词",
      "",
      "## 🎯 目标",
      `你是一个专业的**${category}**开发工程师，需要按照以下代码范式和原则，生成高质量的代码实现。`,
      "",
      "## 📋 代码范式参考",
      codeBlock + lang,
      implementation.code,
      codeBlock,
      "",
      "## ✅ 核心原则",
      ...implementation.pros.map((pro: string) => `- **${pro}**`),
      "",
      "## ⚠️ 需要避免的问题",
      ...implementation.cons.map((con: string) => `- **${con}**`),
      "",
      "## 📝 生成要求",
      "1. **保持相同的编程范式和风格**",
      "2. **遵循上述核心原则**",
      "3. **避免列出的问题**",
      "4. **代码要简洁高效**",
      "5. **添加适当的注释说明**",
      "6. **考虑可读性和维护性**",
      "",
      "## 🚀 输出格式",
      "请以以下格式回复：",
      "",
      "### 💡 代码实现",
      codeBlock + lang,
      "// 你的高质量代码实现",
      codeBlock,
      "",
      "### 📖 简要说明",
      "**设计思路**：",
      "- 简要解释你的实现思路",
      "",
      "**性能考虑**：",
      "- 说明性能优化点",
      "",
      "**使用示例**：",
      "- 提供简单的使用示例",
    ].join("\n");
  }

  private static enhancePrompt(basePrompt: string, category: string): string {
    const enhancements = {
      javascript: this.getJavaScriptEnhancements(),
      react: this.getReactEnhancements(),
      vue: this.getVueEnhancements(),
      "node.js": this.getNodeEnhancements(),
    };

    const specificEnhancement =
      enhancements[category.toLowerCase() as keyof typeof enhancements] || "";

    return (
      basePrompt +
      "\n\n" +
      "## 技术栈特定要求" +
      specificEnhancement +
      "\n\n" +
      "## 输出格式\n" +
      "请以以下格式回复：\n\n" +
      "### 💡 代码实现\n" +
      "```javascript\n" +
      "// 你的高质量代码实现\n" +
      "```\n\n" +
      "### 📖 简要说明\n" +
      "**设计思路**：\n" +
      "- 简要解释你的实现思路\n\n" +
      "**性能考虑**：\n" +
      "- 说明性能优化点\n\n" +
      "**使用示例**：\n" +
      "- 提供简单的使用示例"
    );
  }

  private static getJavaScriptEnhancements(): string {
    return `
- 使用现代ES6+语法
- 考虑性能优化
- 保持函数纯度
- 添加类型检查（如使用JSDoc）`;
  }

  private static getReactEnhancements(): string {
    return `
- 使用React Hooks
- 遵循组件化原则
- 考虑性能优化（useMemo, useCallback）
- 保持组件可复用性`;
  }

  private static getVueEnhancements(): string {
    return `
- 使用Composition API
- 遵循Vue 3最佳实践
- 保持响应式数据流
- 组件逻辑清晰分离`;
  }

  private static getNodeEnhancements(): string {
    return `
- 使用异步/等待模式
- 错误处理完善
- 模块化设计
- 考虑并发性能`;
  }

  static generateCopyFriendlyPrompt(prompt: AIPrompt): string {
    return `# 🤖 AI代码生成提示词

## 📋 提示词信息
- **标题**：${prompt.title}
- **技术栈**：${prompt.category}
- **难度**：${prompt.difficulty}
- **生成时间**：${format(new Date(prompt.createdAt), "yyyy/M/d HH:mm:ss")}

## 📝 提示词内容
${prompt.prompt}

## 💡 使用说明
1. **复制**上面的提示词内容
2. **粘贴**到你喜欢的AI助手（如ChatGPT、Claude、Gemini等）
3. **获取**AI按照代码范式生成的新实现
4. **优化**生成的代码以满足具体需求

## 🎯 适用场景
- ${prompt.category}开发
- 代码重构和优化
- 学习最佳实践
- 代码审查参考

---
*由组件竞技场AI提示词生成器自动生成*`;
  }
}