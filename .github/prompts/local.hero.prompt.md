# CursorStyleHero 集成到 code-forge-site

## 任务概述

在 `code-forge-site` 应用中集成 `CursorStyleHero` 组件，实现一个新的英雄样式选项。该组件来自 `@nidavellir/components-react` 包，提供了一个带有代码预览的现代化英雄区域。

## 背景信息

- **项目结构**: 这是一个使用 Payload CMS 的 Next.js 应用
- **组件来源**: `CursorStyleHero` 位于 `@nidavellir/components-react` 包中
- **目标**: 在 CMS 中添加 "Cursor Style" 英雄类型，允许用户配置徽章、标题、副标题、CTA按钮和代码内容

## 涉及文件

### 1. 英雄配置 (`apps/code-forge-site/src/heros/config.ts`)
```typescript
// 添加 cursorStyle 到英雄类型选项
{
  label: "Cursor Style",
  value: "cursorStyle",
}

// 添加特定字段（仅在 type === "cursorStyle" 时显示）
- cursorStyleBadge: text
- cursorStyleTitle: text  
- cursorStyleSubtitle: textarea
- cursorStylePrimaryCta: text
- cursorStyleSecondaryCta: text
- cursorStyleCodeFileName: text
- cursorStyleCodeContent: code
```

### 2. 英雄包装器 (`apps/code-forge-site/src/heros/CursorStyleHero/index.tsx`)
```typescript
import { CursorStyleHero } from "@nidavellir/components-react/heroes";

export const CursorStyleHeroWrapper: React.FC<Page["hero"]> = (props) => {
  // 从 CMS 字段映射到组件 props
  const codeContent = cursorStyleCodeContent?.code || "";
  
  return (
    <CursorStyleHero
      badgeText={cursorStyleBadge || ""}
      title={cursorStyleTitle || ""}
      subtitle={cursorStyleSubtitle || ""}
      primaryCtaText={cursorStylePrimaryCta || ""}
      secondaryCtaText={cursorStyleSecondaryCta || ""}
      codeFileName={cursorStyleCodeFileName || ""}
      codeContent={codeContent}
    />
  );
};
```

### 3. 英雄渲染器 (`apps/code-forge-site/src/heros/RenderHero.tsx`)
```typescript
import { CursorStyleHeroWrapper } from "@/heros/CursorStyleHero";

const heroes = {
  // ... 其他英雄
  cursorStyle: CursorStyleHeroWrapper,
};
```

### 4. 组件实现 (`packages/components-react/src/components/heroes/CursorStyleHero/CursorStyleHero.tsx`)
- 使用 Framer Motion 实现动画效果
- 包含代码预览区域，模拟 VS Code 编辑器界面
- 支持响应式设计
- 代码内容以 `<pre><code>` 格式渲染

## 实现步骤

### 步骤 1: 更新英雄配置
1. 在 `config.ts` 中添加 "Cursor Style" 选项到英雄类型选择器
2. 添加条件字段，仅在选择 cursorStyle 时显示
3. 确保现有字段的条件逻辑正确（richText 和 media 字段对其他类型隐藏）

### 步骤 2: 创建包装器组件
1. 创建 `CursorStyleHero/index.tsx` 文件
2. 导入 `CursorStyleHero` 组件
3. 实现字段映射逻辑
4. 处理代码字段的特殊格式（从 `{code, language}` 对象提取 `code` 字符串）

### 步骤 3: 注册新英雄
1. 在 `RenderHero.tsx` 中导入包装器
2. 添加到 `heroes` 对象中

### 步骤 4: 测试和验证
1. 重启开发服务器
2. 在 Payload CMS 中创建/编辑页面
3. 选择 "Cursor Style" 英雄类型
4. 填写所有字段并预览效果

## 技术细节

### CMS 字段映射
| CMS 字段 | 组件 Props | 类型 | 说明 |
|---------|-----------|------|------|
| cursorStyleBadge | badgeText | string | 徽章文本 |
| cursorStyleTitle | title | string | 主标题 |
| cursorStyleSubtitle | subtitle | string | 副标题 |
| cursorStylePrimaryCta | primaryCtaText | string | 主要CTA按钮文本 |
| cursorStyleSecondaryCta | secondaryCtaText | string | 次要CTA按钮文本 |
| cursorStyleCodeFileName | codeFileName | string | 代码文件名 |
| cursorStyleCodeContent | codeContent | string | 代码内容（从 code 字段提取） |

### 依赖关系
- `@nidavellir/components-react`: 提供 `CursorStyleHero` 组件
- `framer-motion`: 动画库
- `@payloadcms/richtext-lexical`: 富文本编辑器

### 注意事项
1. 代码内容字段使用 Payload 的 `code` 类型，返回 `{code: string, language: string}` 对象
2. 组件使用 `"use client"` 指令，因为包含 React hooks
3. 代码预览区域模拟 VS Code 界面，包括窗口控制按钮和文件名显示

## 测试用例

### 示例配置
```json
{
  "type": "cursorStyle",
  "cursorStyleBadge": "New Feature",
  "cursorStyleTitle": "Build Amazing Apps",
  "cursorStyleSubtitle": "Create stunning user interfaces with our powerful tools",
  "cursorStylePrimaryCta": "Get Started",
  "cursorStyleSecondaryCta": "Learn More",
  "cursorStyleCodeFileName": "App.tsx",
  "cursorStyleCodeContent": {
    "code": "import React from 'react';\n\nconst App = () => {\n  return <h1>Hello World</h1>;\n};\n\nexport default App;",
    "language": "typescript"
  }
}
```

## 验收标准

- [ ] 在 CMS 中可以选择 "Cursor Style" 英雄类型
- [ ] 所有特定字段正确显示和隐藏
- [ ] 英雄组件正确渲染所有内容
- [ ] 代码预览显示正确的语法高亮和格式
- [ ] 响应式设计在不同屏幕尺寸下正常工作
- [ ] 动画效果流畅

## 相关链接

- [CursorStyleHero 组件文档](../packages/components-react/src/components/heroes/CursorStyleHero/README.md)
- [Payload CMS 字段配置](https://payloadcms.com/docs/fields/overview)
- [Framer Motion 文档](https://www.framer.com/motion/)</content>
<parameter name="filePath">c:\projects\nidavellir\cursor-style-hero-github-prompt.md