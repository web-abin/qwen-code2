---
type: og-feature
kind: ui
feature: task-input
module: custom
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 任务输入弹窗

编辑态下点击棋盘任意非起终点格时弹出的居中输入弹窗。玩家在 textarea 里写下专属任务，点击「保存」后写入 `board` 并落盘到本地存储。

## 线稿

```
┌──────────────────── modal-overlay ────────────────────┐
│                                                       │
│       ┌────────────────────────────────────┐          │
│       │       第 N 格任务                   │          │
│       │                                    │          │
│       │  ┌────────────────────────────┐    │          │
│       │  │ 在此输入你的创意任务...    │    │          │
│       │  │ （textarea，maxlength=200）│    │          │
│       │  │                            │    │          │
│       │  └────────────────────────────┘    │          │
│       │                                    │          │
│       │  ┌────────┐    ┌────────┐          │          │
│       │  │  取消  │    │  保存  │          │          │
│       │  └────────┘    └────────┘          │          │
│       └────────────────────────────────────┘          │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## 入口

- `bindtap="handleCellClick"`，仅当 `mode === 'custom' && isEditing && index !== 0 && index !== 39` 时触发（详见 [../game/board-render.md](../game/board-render.md)）。
- 进入弹窗时把当前格已有的 `task` 文本预填到 textarea。

## 布局

- 与任务弹窗共用 `.modal-overlay`（半透明黑底 + 模糊）。
- `.custom-input-content`：640rpx 宽白卡，圆角 40rpx，无玫瑰红边框。
- 内部纵向：`.custom-title`（玫瑰红「第 N 格任务」）→ `.custom-textarea`（256rpx 高粉底输入区）→ `.custom-buttons`（取消 / 保存横向 1:1）。

## 交互

1. **textarea（`bindinput="onInput"`）**：输入即写入 `customInput.text`，`maxlength=200`，`focus` 时边框由浅粉变深粉。
2. **取消按钮（`.cancel-btn`）**：`bindtap="closeCustomInput"`，仅关闭弹窗，不写 `board` 也不写存储；`customInput.text` 仍然保留在内存中（下次再点同一格如果不重新读会沿用，但 `handleCellClick` 每次都会用 `cell.task` 重置 `text`，不会复活旧输入）。
3. **保存按钮（`.save-btn`）**：`bindtap="saveCustom"`，把 `customInput.text` 写入 `board[customInput.index].task`，关闭弹窗，并触发 [task-persist.md](task-persist.md) 写盘。
4. **遮罩层点击**：`bindtap="closeCustomInput"`，等价于取消。
5. **卡片本身（`.custom-input-content`）**：`catchtap="stopPropagation"` 拦截冒泡。

## 业务逻辑

- `handleCellClick`（`miniprogram/pages/game/index.js:222-236`）：守卫通过后 `setData({ customInput: { show: true, index, text: cell.task || '' } })`。
- `saveCustom`（`miniprogram/pages/game/index.js:244-259`）：
  1. `board[customInput.index].task = customInput.text`
  2. `setData({ board, 'customInput.show': false })`
  3. `wx.setStorage({ key: 'couple_board_v3', data: board.map(c => c.task) })`
- 没有"必填校验"：保存空字符串等价于把该格清空。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| hidden | `customInput.show === false` | 不渲染 |
| shown | 编辑态点击非起终点格 | 弹窗入场，textarea 预填已有任务 |

## 动效

- 入场：`@keyframes scaleUp`，0.6s 缓出（与 [../game/task-trigger.md](../game/task-trigger.md) 共用）。
- 关闭：直接卸载，无动画。
- textarea `:focus` 时 border 变色（`#ffe4e6 → #fda4af`）。

## 跨功能链路

- ← [../game/board-render.md](../game/board-render.md) 触发本弹窗。
- ← [edit-mode.md](edit-mode.md)：仅在编辑态下入口可用。
- → [task-persist.md](task-persist.md)：保存即落盘。
- → [../game/board-render.md](../game/board-render.md)：保存后该格底色由白变玫瑰红，叠加白色五角星。

## 边界情况

- maxlength 200：textarea 自身硬截断。
- 保存空字符串：`board[i].task` 变 `""`；`board-render` 视作未填，恢复白底。
- 同时按下「保存」与「取消」（不可能并发）：小程序事件单线程，先收到的事件赢。
- 起点 / 终点格点击：被 `handleCellClick` 内的 `index !== 0 && index !== 39` 守卫直接忽略。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.wxss
