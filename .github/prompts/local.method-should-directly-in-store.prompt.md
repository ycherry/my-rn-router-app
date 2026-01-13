组件的方法应该直接在store中定义并且直接从store中获取出来传递给组件

Good Example:

```tsx
useStore(store) {
  const { config, handleWebhookUrlChange } = useStore(store);


  return (
    <input
      type="url"
      placeholder="https://hooks.slack.com/..."
      value={config.notificationConfig.webhookUrl || ""}
      onChange={handleWebhookUrlChange}
    />
  );
}
```

Bad Example1:

```tsx
useStore(store) {
  const { config, updateNotificationConfig } = useStore(store);
  return (
    <input
      type="url"
      placeholder="https://hooks.slack.com/..."
      value={config.notificationConfig.webhookUrl || ""}
      onChange={(e) =>
        updateNotificationConfig({ webhookUrl: e.target.value })
      }
    />
  );
}
```
Bad Example2:

```tsx
useStore(store) {
  const { config, updateNotificationConfig } = useStore(store);
  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNotificationConfig({ webhookUrl: e.target.value });
  };

  return (
    <input
      type="url"
      placeholder="https://hooks.slack.com/..."
      value={config.notificationConfig.webhookUrl || ""}
      onChange={handleWebhookUrlChange}
    />
  );
}
```
