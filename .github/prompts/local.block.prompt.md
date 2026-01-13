请参照 `CursorCTABlock` 的实现模式，在项目中添加一个新的 Payload CMS Block。请严格按照以下步骤生成代码：

1.  **创建 Block 配置 (`src/blocks/<BlockName>/config.ts`)**:
    *   定义一个 Payload `Block` 对象。
    *   设置 `slug` (驼峰命名) 和 `interfaceName`。
    *   定义所需的 `fields` (例如 title, subtitle 等) 和 `labels`。

2.  **重新生成 Payload 类型**:
    *   运行 `npx payload generate:types` 命令来重新生成 TypeScript 类型定义。
    *   这将确保新创建的 Block 类型在 `@/payload-types` 中可用。

3.  **创建 Block 组件 (`src/blocks/<BlockName>/Component.tsx`)**:
    *   创建一个 React 组件。
    *   从 `@nidavellir/components-react/sections` (或其他路径) 导入对应的 UI 组件。
    *   从 `@/payload-types` 导入生成的类型 (例如 `<BlockName>Props`)。
    *   将 Payload 传递的 props 映射并渲染到 UI 组件中。

4.  **注册组件渲染 (`src/blocks/RenderBlocks.tsx`)**:
    *   导入新创建的组件。
    *   在 `blockComponents` 对象中添加映射：Key 为 block 的 `slug`，Value 为组件本身。

5.  **添加到 Pages 集合 (`src/collections/Pages/index.ts`)**:
    *请参照 `CursorCTABlock` 的实现模式，在项目中添加一个新的 Payload CMS Block。请严格按照以下步骤生成代码：

1.  **创建 Block 配置 (`src/blocks/<BlockName>/config.ts`)**:
    *   定义一个 Payload `Block` 对象。
    *   设置 `slug` (驼峰命名) 和 `interfaceName`。
    *   定义所需的 `fields` (例如 title, subtitle 等) 和 `labels`。

2.  **重新生成 Payload 类型**:
    *   运行 `npx payload generate:types` 命令来重新生成 TypeScript 类型定义。
    *   这将确保新创建的 Block 类型在 `@/payload-types` 中可用。

3.  **创建 Block 组件 (`src/blocks/<BlockName>/Component.tsx`)**:
    *   创建一个 React 组件。
    *   从 `@nidavellir/components-react/sections` (或其他路径) 导入对应的 UI 组件。
    *   从 `@/payload-types` 导入生成的类型 (例如 `<BlockName>Props`)。
    *   将 Payload 传递的 props 映射并渲染到 UI 组件中。

4.  **注册组件渲染 (`src/blocks/RenderBlocks.tsx`)**:
    *   导入新创建的组件。
    *   在 `blockComponents` 对象中添加映射：Key 为 block 的 `slug`，Value 为组件本身。

5.  **添加到 Pages 集合 (`src/collections/Pages/index.ts`)**:
    *   导入 Block 的配置对象。
    *   在 `Pages` 集合配置中，找到 `layout` 字段的 `blocks` 数组，并将新 Block 配置添加进去。

请确保代码风格与项目中现有的  保持一致。