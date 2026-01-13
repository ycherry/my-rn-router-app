首先用Curl爬取我给出的网页
然后按照组件的功能对网页进行拆分并且按照React的风格写代码并入库

具体地入库的结构请严格按照下面的格式：

## 核心组织原则
层次化分组：组件按功能领域（如UI元素、布局区块、交互效果）进行分类，每个领域形成独立的目录层级。
组件封装：每个具体组件独立成文件夹，确保代码隔离和可维护性。
统一导出模式：每个目录层级（根目录和子目录）均包含 index.ts 文件，作为该层级的统一导出入口，实现树摇优化和模块化导入。

## 文件模式共性
标准三件套：每个组件文件夹通常包含：
index.ts：桶导出文件。
*.tsx：React组件的实现文件，包含核心逻辑和渲染。
*.stories.tsx：Storybook故事文件，用于组件的视觉展示、交互测试和文档化。
扩展文件：部分组件根据功能需求添加辅助文件，如：
面组件（Face）：用于复杂组件的子元素（如骰子面）。
项目组件（Item）：用于列表或集合型组件的子项。

## 命名和变体模式
样式变体：布局相关组件（如页头、页脚、区块）采用 Style[数字] 的命名模式，表示不同的视觉风格变体。
一致性前缀：组件文件名与文件夹名保持一致，便于快速定位和引用。

## 组件分类结构示例

```
/components
  /cards
    /Style1Card
      index.ts
      Style1Card.tsx
      Style1Card.stories.tsx
  /sections
    /Style1Section
      index.ts
      Style1Section.tsx
      Style1Section.stories.tsx
    /Style2Section
      index.ts
      Style2Section.tsx
      Style2Section.stories.tsx

以这样的格式在 packages/components-react/src/components/ 下进行入库

最后，要在pages目录下创建一个对应的演示页面，把所有的组件都引入进去，形成一个完整的组件演示页面

当然 这个页面的格式也必须按照下面的格式来
```
/pages
  /XxxPage
    index.ts
    XxxPage.stories.tsx
    XxxPage.tsx

```

如果只要求爬取网站的部分内容，我会明确指出需要爬取的具体内容或组件类型，否则请完整爬取整个网站的组件内容。
而这个page你也必须把已经爬取的组件全部引入进去，形成一个完整的演示页面

千万一定不要自己随意生成组件或者代码
务必严格按照爬取到的网页内容进行拆分和入库
