---
type: og-feature
kind: ui
feature: task-trigger
module: game
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 任务触发弹窗

棋子停下后弹出的居中模态窗，根据格子类型从题库随机抽一条任务（或显示玩家自定义内容），玩家阅读后点击「任务完成」关闭。这是整个对局的核心反馈环节。

## 线稿

```
┌──────────────────────── modal-overlay ────────────────────────┐
│ （半透明黑底 + backdrop-blur 20rpx）                          │
│                                                               │
│            ┌────────────────────────────────┐                 │
│            │              💜                │                 │
│            │      女生的任务 / 男生的任务   │                 │
│            │                                │                 │
│            │  ┌──────────────────────────┐  │                 │
│            │  │  这里显示具体任务内容…  │  │                 │
│            │  │  scroll-view 最多 384rpx │  │                 │
│            │  └──────────────────────────┘  │                 │
│            │                                │                 │
│            │      ┌──────────────────┐      │                 │
│            │      │     任务完成     │      │                 │
│            │      └──────────────────┘      │                 │
│            └────────────────────────────────┘                 │
└───────────────────────────────────────────────────────────────┘
```

## 入口

- [piece-move.md](piece-move.md) 在 `move()` 结束 200ms 后调用 `triggerEvent(pos)`。
- 若 `pos === 39`，本弹窗被 [end-game.md](end-game.md) 接管，使用同一个 `modal` 数据结构但内容为终点祝贺。

## 布局

- `.modal-overlay`：固定全屏，`z-index: 200`，半透明黑 + 模糊背景。
- `.modal-content`：640rpx 宽白底圆角 50rpx 卡片，玫瑰红 8rpx 边框。
- 内部纵向：`modal-icon`（120rpx emoji）→ `modal-title`（40rpx 加粗）→ `scroll-view.modal-scroll`（封装 `modal-text`，最高 384rpx，超出滚动）→ `modal-btn`（玫瑰红大按钮）。

## 交互

1. **任务完成按钮（`.modal-btn`）**：`bindtap="closeModal"`，把 `modal.show` 置 false，关闭弹窗。
2. **遮罩层（`.modal-overlay`）**：`bindtap="closeModal"`，点击空白区域同样关闭。
3. **卡片本身（`.modal-content`）**：`catchtap="stopPropagation"` 拦截冒泡，避免点到内容区误关。

## 业务逻辑

- 抽题在 `triggerEvent`（`miniprogram/pages/game/index.js:170-220`）中完成：
  - 自定义模式 + 已填任务：直接展示 `cell.task`，icon 固定 `📝`。
  - 自定义模式 + 空任务：跳过弹窗，仅切换 `currentPlayer`（详见 [turn-system.md](turn-system.md)）。
  - 内置模式：`lib = app.globalData.libraries[currentMode]`；`list = lib[cell.type] || lib.task`；`task = list[Math.floor(Math.random()*list.length)]`。
  - icon 映射：`task → 💜`、`test → 💚`、`truth → 💗`、`wish → 💛`，未知类型回落到 ✨。
- 标题文案统一为「<回合方>的任务」，回合方按 `currentPlayer === 0 ? '女生' : '男生'` 推导（**注意**：标题中的回合方是"刚走完任务的玩家"，因为 `currentPlayer` 此刻还未切换；切换在同一次 `setData` 中一并完成，渲染时 WXML 用的是 `data.currentPlayer` 的最新值——也就是**下一回合方**）。
- 仅在 `!isEditing` 时弹出（`triggerEvent` 的入口 `move()` 在编辑态没有触发路径）。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| hidden | `modal.show === false` | 不渲染遮罩与卡片 |
| shown | 棋子在非终点格停下后由 `triggerEvent` 写入 | 卡片缩放入场，玩家可读、可关闭 |

## 动效

- 入场：`@keyframes scaleUp`，0.6s 缓出，从 `scale(0.8)` + `opacity 0` 到 `scale(1)` + `opacity 1`。
- 关闭：直接卸载，无收回动画。

## 跨功能链路

- ← [piece-move.md](piece-move.md) 触发本弹窗。
- ← [turn-system.md](turn-system.md)：弹窗显示与回合切换在同一 `setData` 内完成。
- ← [../library/task-library.md](../library/task-library.md)：内置模式下任务文本由它提供。
- ← [../custom/task-input.md](../custom/task-input.md)：自定义模式下任务文本由 `data.board[pos].task` 提供。

## 边界情况

- 题库分类对当前模式不存在该类（如 `naughty.test` 仅 2 条）：随机抽题永远落在已有数组里，不会越界。
- 标题渲染时 `currentPlayer` 已切换：玩家看到"女生的任务"时，呼吸高亮的其实已经是男生头像，这与原 HTML 设计保持一致。
- 任务文本含换行符：`white-space: pre-wrap` 保留换行。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.wxss
