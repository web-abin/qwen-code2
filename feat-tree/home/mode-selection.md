---
type: og-feature
kind: ui
feature: mode-selection
module: home
schema: 1
code:
  - miniprogram/pages/home/index.js
  - miniprogram/pages/home/index.wxml
  - miniprogram/pages/home/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 模式选择卡片

小程序的入口页。粉色背景上方是「恋爱飞行棋 / ROMANTIC GAME V3.0」标题，下方是一列五张玩法卡片，玩家点击其中任意一张即进入对应模式的游戏页。

## 线稿

```
┌──────────────────────────────────────┐
│                                      │
│            恋爱飞行棋                │
│        ROMANTIC GAME V3.0            │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🍭  甜蜜互动（心动瞬间）    ❯ │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🎨  甜蜜互动（浓情蜜意）    ❯ │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🎈  甜蜜互动（深情默契）    ❯ │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🔞  羞羞飞行棋             ❯ │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ⚙️  自定义飞行棋           ❯ │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

## 入口

- 小程序冷启动后默认页面（`app.json` 的 `pages` 数组首项 `pages/home/index`）。
- 游戏页顶部「🏠」返回按钮也会回到本页（见 `game/header-controls`）。

## 布局

- `.container`：纵向 flex，居中，padding 40rpx。
- `.header`：标题区，包含 `.title`（恋爱飞行棋，100rpx 红玫瑰色斜体）+ `.subtitle`（ROMANTIC GAME V3.0，24rpx 浅粉）。
- `.mode-list`：五张 `.mode-item` 卡片纵向排列，每张含 `.mode-icon`（emoji 图标）+ `.mode-name`（模式名）+ `.arrow`（右尖角 ❯）。

## 交互

1. **模式卡片**：`bindtap="initGame"`，`data-key` 携带 `t1` / `t2` / `t3` / `naughty` / `custom`。点击时卡片下沿底色阴影压缩（`translateY(4rpx)`、`border-bottom-width: 0`）模拟按下，随即触发 `initGame`，由其调用 `wx.navigateTo` 跳到 `pages/game/index?mode=<key>`。

## 业务逻辑

- 模式列表来自 Page `data.modes`，是常量数组（`miniprogram/pages/home/index.js:4-10`）：5 项，每项 `{ key, name, icon }`。
- 列表的 `key` 必须与 `game/index.js` 中 `data.modes` 字典以及 `library` 模块的 key 严格对齐。
- 不发起任何 API、不读写本地存储。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| idle | 页面加载完成 | 五张卡片正常显示 |
| pressing | 任意卡片被点击且未抬起 | 该卡片下沉 4rpx，下沿阴影消失 |

## 动效

- 卡片按下：`transition: all 0.2s` + `:active` 状态下 `transform: translateY(4rpx)` 与 `border-bottom-width: 0`，形成轻微"按下去"的物理感。
- 无加载/淡入动画。

## 跨功能链路

- → [navigation.md](navigation.md)：点击事件直接调用同页面的 `initGame`，由其完成跳转。
- ← 由 `game/header-controls` 返回时回到本页。

## 边界情况

- 快速连点同一卡片：`wx.navigateTo` 在跳转期间被再次调用会抛错，但小程序会自动忽略，不影响最终落点。
- 横屏 / 小屏适配：所有尺寸用 `rpx`，但卡片高度未限制，超长模式名（中文 8 字以上）可能把 `.arrow` 挤出右侧——目前内置五项均不会触发。

## 关联代码

- miniprogram/pages/home/index.js
- miniprogram/pages/home/index.wxml
- miniprogram/pages/home/index.wxss
