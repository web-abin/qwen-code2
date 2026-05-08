---
type: og-module
module: home
schema: 1
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
---

# home

首页模块负责小程序的入口体验：以卡片形式呈现五种玩法（三档甜蜜互动、羞羞飞行棋、自定义飞行棋），点击后跳转到游戏页。本模块不包含任何棋盘渲染、骰子、任务触发等游戏逻辑，那些属于 `game` 模块。

## 功能

| 功能 | 类型 | 路径 |
|------|------|------|
| 模式选择卡片 | UI | [mode-selection.md](mode-selection.md) |
| 跳转游戏页 | 逻辑 | [navigation.md](navigation.md) |

## 跨模块依赖

- → 写入 URL query：`navigation` 通过 `wx.navigateTo` 把 `mode` 参数透传给 `game` 模块的入口 `pages/game/index`，`game/header-controls` 通过 `wx.navigateBack` 反向回到本模块。

## 模块级不变量

- 本模块自身不持有任何长存状态：模式列表是页面级常量，`globalData.libraries`（题库）由 `library` 模块拥有，自定义内容由 `custom/task-persist` 拥有。
- 五个模式 key（`t1` / `t2` / `t3` / `naughty` / `custom`）必须与 `game/index.js` 中 `data.modes` 以及 `library` 模块导出的 key 完全一致；新增模式必须三处同步。
