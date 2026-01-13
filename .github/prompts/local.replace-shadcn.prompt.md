## 目标

在项目中尽可能使用 shadcn/ui 组件替换现有的自定义UI元素，以提升代码一致性、可维护性和设计系统的一致性。shadcn/ui 基于 Radix UI 和 Tailwind CSS，提供高质量的组件。

shadcn ui一共有以下组件:Accordion
Alert Dialog
Alert
Aspect Ratio
Avatar
Badge
Breadcrumb
Button Group
Button
Calendar
Card
Carousel
Chart
Checkbox
Collapsible
Combobox
Command
Context Menu
Data Table
Date Picker
Dialog
Drawer
Dropdown Menu
Empty
Field
Form
Hover Card
Input Group
Input OTP
Input
Item
Kbd
Label
Menubar
Native Select
Navigation Menu
Pagination
Popover
Progress
Radio Group
Resizable
Scroll Area
Select
Separator
Sheet
Sidebar
Skeleton
Slider
Sonner
Spinner
Switch
Table
Tabs
Textarea
Toast
Toggle Group
Toggle
Tooltip
Typography

## 流程要求

按以下步骤进行替换，每步必须包含具体要求、步骤和示范。确保代码可直接运行，无语法错误。

### 1. 检查可用组件

**要求**：首先检查 @code-arena/ui 中已有的 shadcn/ui 组件，避免重复安装。
**步骤**：

1. 查看 packages/ui/src/components/index.ts 文件，确认已导出的组件。
2. 如果需要新组件，检查是否已在列表中。
3. 如果不存在，请先不必在意，直接去替换，替换完成后整理需要安装的新组件，然后列出需要安装的新组件。
   **示范**：

```bash
# 检查现有组件
cat packages/ui/src/components/index.ts

```

### 2. 替换组件

**要求**：在目标文件中替换自定义UI为 shadcn/ui 组件。
**步骤**：

1. 导入必要的 shadcn/ui 组件。
2. 替换自定义 div/button 等为对应组件，注意只要作用相同都要用shadcn组件去替换，如select、form。
3. 移除不必要的 cn 和 theme 逻辑，因为 shadcn/ui 组件有内置样式。
4. 更新测试以匹配新结构。
   **示范**：

```typescript
// 替换前
<div className={cn("border rounded-lg p-4", themeClasses)}>
  <button className="custom-button">Click</button>
</div>

// 替换后
import { Card, Button } from "@code-arena/ui";

<Card className="p-4">
  <Button>Click</Button>
</Card>
```

### 3. 更新测试（如果没有相应test文件请跳过）

**要求**：替换组件后，更新相关测试以匹配新的DOM结构。
**步骤**：

1. 检查测试是否因DOM变化失败。
2. 更新断言，使用 data-testid 或更具体的选择器。
3. 确保所有测试通过。
   **示范**：

```typescript
// 更新前
expect(screen.getByText("Custom Button")).toBeInTheDocument();

// 更新后
expect(screen.getByRole("button", { name: /click/i })).toBeInTheDocument();
```

## 注意事项

- 移除不必要的：cn 函数调用、theme 条件逻辑（shadcn/ui 组件自适应）。
- 如果组件需要自定义样式，使用 className prop。
- 确保测试数据类型正确（如日期为字符串）。
- 如果不确定，输出"请提供更多组件细节"。

## 示例完整替换

以 OverviewSection.tsx 为例：

```typescript
// 导入
import { Card, Button } from "@code-arena/ui";

// 替换容器
<Card className="p-6">
  <h3>标题</h3>
  <Button onClick={handleClick}>导出</Button>
</Card>

// 移除
// import { cn } from "@/lib/utils";
// import { useTheme } from "@/hooks/useTheme";
```
