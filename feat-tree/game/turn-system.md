---
type: og-feature
kind: logic
feature: turn-system
module: game
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 双人回合切换

维护「当前回合方」（女生 / 男生）的简单状态机。回合切换发生在每次任务弹窗弹出时（即玩家完成一格任务后下一轮属于对方），终点胜利与未填空格各有一条特殊路径。

## 触发条件

- `triggerEvent(pos)` 被 [piece-move.md](piece-move.md) 在棋子停下后调用：
  - 普通格命中 → 弹任务窗时同时切换 `currentPlayer`。
  - 自定义模式空格子 → 不弹窗但切换 `currentPlayer`。
  - `pos === 39` → 终点胜利，**不切换** `currentPlayer`。

## 输入

- `data.currentPlayer`（`0` = 女生，`1` = 男生）。
- `data.currentMode`（决定是否走自定义分支）。
- `board[pos]`（决定是否为空格子或终点）。

## 输出

- 写 `data.currentPlayer = currentPlayer === 0 ? 1 : 0`，由 WXML 通过 class 绑定立刻反映到头像与标签的高亮 / 灰度状态。

## 逻辑流程

1. 棋子停下，`triggerEvent(pos)` 被调用。
2. 若 `pos === 39`：进入 [end-game.md](end-game.md) 分支，**结束流程，不切换**。
3. 若 `currentMode === 'custom'`：
   - 该格 `task` 非空：弹任务窗，同时 `currentPlayer = 1 - currentPlayer`。
   - 该格 `task` 为空：不弹窗，仅 `currentPlayer = 1 - currentPlayer`，回合直接交还。
4. 其他模式：从 `library/task-library` 中按 `cell.type` 抽题、弹任务窗，同时 `currentPlayer = 1 - currentPlayer`。

## 状态

| 状态 | 含义 | 视觉表现 |
|------|------|----------|
| `currentPlayer === 0` | 女生回合 | 女生头像呼吸缩放高亮、玫瑰红「女生回合」文字；男生头像灰度 50% |
| `currentPlayer === 1` | 男生回合 | 男生头像高亮、天蓝「男生回合」文字；女生头像灰度 |

## 失败模式

| 失败 | 检测方式 | 恢复策略 |
|------|----------|----------|
| 终点胜利后再次掷骰子 | `playerPos[currentPlayer] >= 39` 导致 `move()` 内 break，`triggerEvent(39)` 再次进入 end-game 分支 | 玩家只能通过左上角 🏠 返回首页结束游戏。本逻辑无自动重置。 |
| 自定义空格子连续被同一玩家命中（罕见） | 日志可见 `currentPlayer` 仍按预期切换 | 无需恢复，视觉上头像高亮的瞬间切换可能让玩家误以为没轮换；属设计取舍。 |

## 不变量

- `currentPlayer` 永远是 `0` 或 `1`，不会出现其他取值。
- 任意一方走到 39 后，`currentPlayer` 不再被本逻辑修改（除非通过返回首页 + 重新进入游戏页才重置）。
- 编辑态切换会重置 `currentPlayer = 0`（详见 [../custom/edit-mode.md](../custom/edit-mode.md)）。

## 跨功能链路

- ← [piece-move.md](piece-move.md)：通过 `triggerEvent` 调用本逻辑。
- → [task-trigger.md](task-trigger.md)：弹窗内文案 `"<回合方>的任务"` 直接读取 `currentPlayer`。
- → [end-game.md](end-game.md)：终点判定优先于回合切换。
- ← [../custom/edit-mode.md](../custom/edit-mode.md)：进入编辑态会强制把回合方重置为女生（`0`）。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
