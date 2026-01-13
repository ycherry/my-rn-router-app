我希望你能够直接使用store中的method，而不是在组件中重新定义一遍，或者说转手一遍。

比如：

```tsx
const setIsUploadOpen = useStore(store, (state) => state.setIsUploadOpen);
  
const handleDialogOpenChange = (open: boolean) => {
  setIsUploadOpen(open);
};

return (
  <Dialog open={isOpen} onOpenChange={handleDialogOpenChange} />
)
``` 
应该改成：

```tsx
const handleDialogOpenChange = useStore(
  store,
  (state) => state.handleDialogOpenChange
);

return (
  <Dialog open={isOpen} onOpenChange={handleDialogOpenChange} />
)
```

通过这样的写法 可以减少不必要的中间变量和函数定义，使代码更加简洁和易读。
