切割给出的页面组件

查看components-react/src/components下的文件组成方式
以 [text](local.standardization.prompt.md) 这个文档中的标准化方式进行切割

比如，页面组件的名字是 FakeApplePage，那么应该将这个页面切割为：
- components
  - FakeApplePage
  - headers
    - FakeAppleHeader
      - FakeAppleHeader.tsx
      - FakeAppleHeader.stories.tsx
  - footers
    - FakeAppleFooter
      - FakeAppleFooter.tsx
      - FakeAppleFooter.stories.tsx
  - sections
    - FakeAppleSectionOne
      - FakeAppleSectionOne.tsx
      - FakeAppleSectionOne.stories.tsx
    - FakeAppleSectionTwo
      - FakeAppleSectionTwo.tsx
      - FakeAppleSectionTwo.stories.tsx

然后FakeApplePage从components文件夹中引入这些子组件进行组合
