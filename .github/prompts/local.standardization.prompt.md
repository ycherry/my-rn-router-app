一致化文件组件的名字，我给出的可能是一个文件组件，也可能是一个文件组件的集合的文件夹
如果是单个文件组件，就修改单个
如果是文件组件集合的文件夹，就修改里面所有不一致的文件组件

比如文件组件的结构是

Card
 - Card.tsx
 - Card.stories.tsx
 - index.ts

这个是一致的，但是有些文件组件的结构是

Card
 - CardComponent.tsx
 - CardComponent.stories.tsx
 - index.ts

这个就不一致了，需要把CardComponent改成Card

把CardComponent.tsx
CardComponent.stories.tsx
改成
Card.tsx
Card.stories.tsx 

然后如果名字是有前缀的和有拆分的 比如
SmartCard
  - SmartCard.tsx
  - SmartCard.stories.tsx
  - SmartCardContent.tsx
  - index.ts

这种是正确的

错误的情况有：
SmartCard
  - SmartCard.tsx
  - SmartCard.stories.tsx
  - SmartCardContent.tsx
  - SmartCardContent.stories.tsx
  - index.ts

这种就是错误的，因为子组件不应该有自己的 stories 文件
需要把 SmartCardContent.stories.tsx 删除掉

SmartCard
  - Card.tsx
  - Card.stories.tsx
  - CardContent.tsx
  - index.ts

这种也是错误的，因为子组件的名字不对
需要把 Card.tsx 改成 SmartCard.tsx
Card.stories.tsx 改成 SmartCard.stories.tsx
CardContent.tsx 改成 SmartCardContent.tsx

同时 子组件不允许有文件化的情况 必须是文件组件而不是文件化组件
同时 .stories.tsx 只能有一个 不要有很多个 stories文件

并且修改文件内容里面的组件名字
还有stories里面的title字段也要检查

然后index.ts里面的导出统一导出的东西是 export * from './Card';
不要导出其余任何的东西

也就是说
export { Card } from "./Card";
export type { CardProps } from "./Card";
这种是是决定错的

必须改成
export * from "./Card";
并且只保留这样的导出 其余的要去掉

必须原地修改当前的文件组件
而不是新增或者删除文件组件

请帮我完成这些改名工作
