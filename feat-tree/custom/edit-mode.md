---
type: og-feature
kind: ui
feature: edit-mode
module: custom
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 编辑模式切换

控制自定义飞行棋的"浏览态"与"编辑态"切换。编辑态下棋子隐藏、控制面板被替换为编辑提示条，玩家可点击非起终点格子打开输入弹窗；退出编辑态后棋盘恢复对局状态。

## 线稿

```
浏览态                                  编辑态
┌──────────────────────────┐    ┌──────────────────────────┐
│  🏠   自定义飞行棋  编辑 │    │  🏠  自定义飞行棋   完成 │
│                          │    │                          │
│  ●●●●●●●● GO             │    │  ●●●●●●●● GO             │
│  ●●●...●●● 🏁            │    │  ●●●...●●● 🏁            │
│  ●●●●●●●●                │    │  （棋子被隐藏）          │
│                          │    │                          │
│  ┌─────┐  🎲   ┌─────┐   │    │  ┌────────────────────┐  │
│  │👧女 │      │👦男 │   │    │  │ 🛠 点击棋盘格设置  │  │
│  └─────┘      └─────┘   │    │  │      专属任务      │  │
│  [    掷骰子           ] │    │  │   清空数据(下划线) │  │
│                          │    │  └────────────────────┘  │
└──────────────────────────┘    └──────────────────────────┘
```

## 入口

- 自定义模式下点击顶部「编辑」按钮（详见 [../game/header-controls.md](../game/header-controls.md)）。
- 进入自定义模式时若本地无存储或存储中所有格子均无内容，`initGame` 会自动把 `isEditing` 设为 true，立即落入编辑态。

## 布局

- 编辑态 WXML 通过 `wx:if="{{!isEditing}}"` 隐藏棋子与控制面板，并通过 `wx:if="{{isEditing}}"` 显示 `.edit-hint`：
  - `.hint-text`：玫瑰红 28rpx「🛠️ 点击棋盘格设置专属任务」。
  - `.clear-btn`：灰色 24rpx 下划线「清空数据」（详见 [clear-data.md](clear-data.md)）。
- 顶部按钮文案随状态切换：`{{isEditing ? '完成' : '编辑'}}`，并附加 `.edit-active` 类把背景从玫瑰红变成绿色。

## 交互

1. **「编辑」/「完成」按钮**（`bindtap="toggleEditMode"`）：切换 `isEditing`。进入编辑态时同步把 `playerPos = [0, 0]`、`currentPlayer = 0`；退出时保留当前位置。
2. **格子点击**：仅在编辑态下生效。详见 [task-input.md](task-input.md) 与 [../game/board-render.md](../game/board-render.md) 中 `handleCellClick`。
3. **🏠 返回（编辑态）**：弹 `wx.showModal` 二次确认（详见 [../game/header-controls.md](../game/header-controls.md)）。
4. **`.edit-hint` 上的「清空数据」**：详见 [clear-data.md](clear-data.md)。

## 业务逻辑

- `toggleEditMode`（`miniprogram/pages/game/index.js:278-287`）：
  ```js
  setData({
    isEditing: !isEditing,
    playerPos: 进入编辑 ? [0,0] : 当前值,
    currentPlayer: 进入编辑 ? 0 : 当前值
  })
  ```
- 自动进入编辑态：`initGame` 中读取 `couple_board_v3` 失败，或读取成功但 `!board.some(c => c.task)` 时 `setData({ isEditing: true })`。
- 编辑态不调用 `initBoard`：棋盘类型 / 颜色保留首次进入时的洗牌结果（自定义模式下底色仅看 `task` 是否非空，洗牌结果其实不影响视觉）。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| viewing | `isEditing === false` | 棋子可见，控制面板显示骰子与回合 |
| editing-empty | 自定义模式首次进入且无本地任务 | 自动进入；棋子隐藏，提示条显示 |
| editing | 玩家手动点编辑 | 同上，棋子隐藏，提示条显示 |

## 动效

- 编辑提示条 `@keyframes pulse` 2 秒淡入淡出循环。
- 顶部按钮 `transition: all 0.3s` 平滑切换玫瑰红↔绿色背景。
- 棋子隐藏 / 显示无过渡，由 `wx:if` 卸载 / 装载完成。

## 跨功能链路

- ← [../game/header-controls.md](../game/header-controls.md)：编辑按钮入口。
- → [task-input.md](task-input.md)：编辑态下点击格子的去处。
- → [clear-data.md](clear-data.md)：编辑提示条上的清空入口。
- → [task-persist.md](task-persist.md)：保存任务时实际写盘。
- ↔ [../game/turn-system.md](../game/turn-system.md)：进入编辑态会强制把 `currentPlayer` 重置为 `0`。

## 边界情况

- 退出编辑态时不强制保存：玩家在 textarea 里输入但未点保存就直接按「完成」，输入会丢失（textarea 数据只在 `customInput.text` 中，未写入 `board`）。
- 退出编辑态后骰子重新可用：玩家可在已保存的格子上正常对局。
- 切回编辑态再切回浏览态会让玩家位置回到起点：因为进入编辑态时 `playerPos` 被重置为 `[0,0]`，退出编辑态保留这个 `[0,0]`，相当于"硬重开"。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.wxss
