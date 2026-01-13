为给出的组件创建Storybook的stories文件，按照以下的范式:

XxxCard.tsx
XxxCard.stories.tsx

这个XxxCard.stories.tsx就是需要创建的文件

这个stories文件应该包含以下Cases:

1. Base: 展示组件的基本用法，就是每个props都传入一个典型值
2. Default: 展示组件的默认样式，也就是什么都不传props时的样子，必须什么都不传，严格按照这个要求执行
3. BaseUsage: 展示组件的基本用法，就是这个组件最常见的使用方式，要结合一些别的组件来展示这个组件在实际使用中的样子 
3. 其他Cases: 根据组件的不同，创建一些有代表性的stories case，展示组件的不同用法和状态

目前只需要给主组件本身创建stories文件，不需要给子组件创建stories文件
