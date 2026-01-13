把当前的组件入库

入库指的是，如组件名字为XxxSection.tsx, 则

查找sections文件夹
sections文件夹下应该是Style[index]Section的文件组件的形式

把XxxSection转化为Style[index + 1]Section的形式的文件组件并且添加stories文件
其余参照其他的Style[index]Section的文件组件和stories文件

如果是别的种类的组件 比如Hero, Footer, Header等
则查找对应的文件夹

在入库后 移除原来的组件
但要保障原来引用这个组件的地方不报错，必须把引用的地方改为新的组件名
