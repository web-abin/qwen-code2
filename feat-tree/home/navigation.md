---
type: og-feature
kind: logic
feature: navigation
module: home
schema: 1
code:
  - miniprogram/pages/home/index.js
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 跳转游戏页

把首页选中的模式 key 通过 URL query 透传给游戏页，是首页与游戏页之间唯一的数据通道。

## 触发条件

- 用户在首页点击任意一张 `.mode-item` 卡片，触发 `bindtap="initGame"`（`miniprogram/pages/home/index.js:16-21`）。

## 输入

- `e.currentTarget.dataset.key`：被点击卡片的 `data-key`，取值范围 `t1` / `t2` / `t3` / `naughty` / `custom`。

## 输出

- 调用 `wx.navigateTo({ url: '/pages/game/index?mode=' + mode })`，小程序压栈一个游戏页实例，并在其 `onLoad(options)` 中收到 `options.mode`，由 `game/index.js` 的 `initGame()` 进一步初始化。

## 逻辑流程

1. 从事件对象读取 `data-key`。
2. 拼接 URL：`/pages/game/index?mode=<key>`。
3. 调用 `wx.navigateTo`，无成功/失败回调。
4. 不写入任何本地存储或全局状态。

## 状态

- 无状态，纯一次性副作用。

## 失败模式

| 失败 | 检测方式 | 恢复策略 |
|------|----------|----------|
| `wx.navigateTo` 因页面栈达到 10 层而失败 | 控制台报错 `MAX_NAVIGATE_DEEP` | 当前未处理。实际从首页进入只会有 2 层，触发概率极低。 |
| `mode` 参数被篡改成未知 key | 进入游戏后 `modes[mode]` 为 `undefined`，`modeName` / `icon` 渲染为 `undefined` | 当前未处理。从首页正常路径进入不会发生。 |

## 不变量

- 本逻辑只生产 URL query，不直接读写小程序本地存储；任何持久化都由 `custom/task-persist` 在游戏页内部独立完成。
- 同一时刻最多只发起一次跳转（小程序会忽略导航期间的重复 `navigateTo` 请求）。

## 跨功能链路

- ← [mode-selection.md](mode-selection.md) 触发本逻辑。
- → 跳转目标 `pages/game/index`，由 [../game/header-controls.md](../game/header-controls.md) 在游戏页接收 `mode` 并初始化整个游戏模块。

## 关联代码

- miniprogram/pages/home/index.js
