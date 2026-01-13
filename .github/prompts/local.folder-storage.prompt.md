查看给出的文件夹

文件夹可能是一组文件仓库的集合，也可能是单个文件仓库

文件仓库必须按照以下格式，如：

cards
  ├── KindACard
  │   ├── xxx
  │   └── xxx
  ├── KindBCard
  │   ├── xxx
  │   └── xxx
  └── KindCCard
      ├── xxx
      └── xxx

类似，也就是说，在某个大的类别下面（当前case就是card类别），必须存储的是XxxCard这种格式的文件组件

如果不是的话，请直接把错误的组件移动到正确的位置

如果遇到文件仓库集合，如：
set
  ├── cards
  │   ├── KindACard
  │   │   ├── xxx
  │   │   └── xxx
  │   ├── KindBCard
  │   │   ├── xxx
  │   │   └── xxx
  │   └── KindCCard
  │       ├── xxx
  │       └── xxx
  ├── widgets
  │   ├── KindAWidget
  │   │   ├── xxx
  │   │   └── xxx
  │   ├── KindBWidget
  │   │   ├── xxx
  │   │   └── xxx
  │   └── KindCWidget
  │       ├── xxx
  │       └── xxx
  └── modules
      ├── KindAModule
      │   ├── xxx
      │   └── xxx
      ├── KindBModule
      │   ├── xxx
      │   └── xxx
      └── KindCModule
          ├── xxx
          └── xxx

你需要分别检查每个子文件夹下面的文件仓库格式是否正确
