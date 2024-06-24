## 自己实现一个sentry webpack 插件

* `build` 后上传`sourcemap` 到sentry
* `build` 之前删除`sourcemap`

## Task.js

`task.js` 实现一个异步并行的任务。可以设置最大并行数

## 配置

```js
new SentryUploadPlugin({
  /** 内网sentry */
  domain: 'https://sentry.guanmai.cn',
  /** sentry 登录token */
  token: '8c47388015df4aa0b35257ba16fcd4a952379795f0f142fdb65c7530743e0e45',
  organization: 'guanmai',
  /** 项目名 */
  project: 'demo-test',
  /** 版本号， 我们可以通过 git commitid 作为版本号 */
  release: '7.1.2',
}),
```