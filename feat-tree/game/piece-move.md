---
type: og-feature
kind: ui
feature: piece-move
module: game
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 棋子分步移动

骰子定格后，当前回合方的棋子（👧 或 👦）沿螺旋路径"逐格"前进。每跳一格 300ms，让玩家直观感知行进过程；走到目标格后短暂停顿，再触发该格的任务弹窗。

## 线稿

```
●──●──●──●──●──●──● GO          每 300ms 跳一格：
                  │                ⓪ → ① → ② → … → ⑤
●─                ↓                ↑       ↑
   每跳一格 300ms                  起点    终点（按骰子点数）
●─    ●──●──●──●──●─●
                          再隔 200ms 弹出任务弹窗
●─    ●     ╔═════╗  ●
            ║👧 在 ║
●─    ●     ║此格 ║  ●
            ╚═════╝
```

## 入口

- 由 [dice-roll.md](dice-roll.md) 在 `setInterval` 结束时调用 `this.move()`。

## 布局

- 棋子 `.piece` 是 `.cell` 的子元素，绝对定位偏移到格子左上 / 右下：
  - `.piece-girl`：`top: -32rpx; left: -16rpx`。
  - `.piece-boy`：`bottom: -32rpx; right: -16rpx`。
- 棋子大小 60rpx emoji，带玫瑰红投影（`drop-shadow`），`z-index: 100` 确保盖在格子之上。

## 交互

1. **观赏型动画**：玩家在此期间不能掷骰、不能点击格子（编辑模式被禁用，掷骰按钮 `disabled`）。

## 业务逻辑

- `move()`（`miniprogram/pages/game/index.js:150-168`）：
  1. 从 `this.data` 读取 `currentPlayer`、`playerPos`、`diceValue`。
  2. `for (i=0; i<diceValue; i++)`：若 `playerPos[currentPlayer] >= 39` 则提前 break，否则把对应玩家的位置 +1 并 `setData`，然后 `await` 300ms。
  3. 循环结束后再 `setTimeout` 200ms 调用 `this.triggerEvent(playerPos[currentPlayer])`（详见 [task-trigger.md](task-trigger.md) 与 [end-game.md](end-game.md)）。
- 棋子从一格"跳"到下一格的视觉是通过 `.cell` 的位置由 `setData` 重新挂载棋子完成的（棋子是格子的子元素，按 `wx:if` 条件渲染）。
- `.piece` 元素本身有 `transition: all 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28)`：当棋子在格子间被重新挂载且偏移坐标差异不大时，瞬时呈现；视觉上的"逐格感"主要由 `for` 循环的 300ms 节奏制造。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| idle | 初始 / 任务弹窗已关闭 | 棋子静止在 `playerPos[currentPlayer]` 所在格 |
| moving | `move()` 执行中 | 棋子按 300ms 节奏切换格子 |
| arrived | `for` 循环结束、200ms 等待中 | 棋子停留目标格，无动画 |

## 动效

- 移动节奏：每步 300ms `setTimeout`。
- 弹窗前的"短暂停顿"：200ms `setTimeout`。
- `.piece` CSS transition 0.6s 弹性曲线（仅在视觉位置真实变更时生效）。

## 跨功能链路

- ← [dice-roll.md](dice-roll.md) 触发本逻辑。
- → [task-trigger.md](task-trigger.md)：到达目标格后用 `triggerEvent` 弹任务窗。
- → [end-game.md](end-game.md)：当目标格 = 39 时改走终点胜利分支。
- → [turn-system.md](turn-system.md)：任务弹窗内会写入下一回合的 `currentPlayer`。

## 边界情况

- **越过终点**：`for` 循环内每次都检查 `>= 39`，到达后立刻 break，超出步数被丢弃（不会反弹也不会卡住）。
- **闭包陷阱**：`move()` 在循环开头一次性解构 `playerPos`，`[...playerPos]` 每轮都基于这个本地引用展开。这意味着每一次循环写入的 `newPos` 实际只比"开始时的位置"前进 1 步——表现上等价于"无论骰子几点，棋子只前进 1 格"。这是从 HTML 版本转换过来的隐藏问题，新功能/重构时需特别注意。
- **重入保护**：`isRolling` 在 `roll()` 中已挡住二次调用，`move()` 自身没有再加锁；但骰子按钮在 `isRolling=false` 之后才能再次点击，因此实际不会并发。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.wxss
