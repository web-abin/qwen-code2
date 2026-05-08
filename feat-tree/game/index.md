---
type: og-module
module: game
schema: 1
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
---

# game

游戏核心模块，负责飞行棋的全部对局体验：螺旋棋盘渲染、掷骰子动画、棋子分步移动、女生/男生回合切换、到达格子时的任务弹窗、终点胜利弹窗，以及顶部的返回 / 编辑按钮。本模块依赖 `library` 模块提供四种内置模式的题库；自定义模式下空格子的任务来自 `custom` 模块。

## 功能

| 功能 | 类型 | 路径 |
|------|------|------|
| 顶部控制条 | UI | [header-controls.md](header-controls.md) |
| 螺旋棋盘渲染 | UI | [board-render.md](board-render.md) |
| 掷骰子动画 | UI | [dice-roll.md](dice-roll.md) |
| 棋子分步移动 | UI | [piece-move.md](piece-move.md) |
| 双人回合切换 | 逻辑 | [turn-system.md](turn-system.md) |
| 任务触发弹窗 | UI | [task-trigger.md](task-trigger.md) |
| 终点胜利弹窗 | UI | [end-game.md](end-game.md) |

## 跨模块依赖

- ← 入向：`home/navigation` 通过 URL query `mode` 唤起本模块。
- → 读取：`library/task-library` 提供 `t1` / `t2` / `t3` / `naughty` 四种模式下的 task / test / truth / wish 题库。
- ↔ 联动：`custom/edit-mode` 由本模块顶部「编辑」按钮唤起；`custom/task-persist` 在 `mode === 'custom'` 时为 `board` 注入已保存的格子任务；`custom/task-input` 与 `custom/clear-data` 都直接修改本模块的 `data.board`。

## 模块级不变量

- `board` 数组长度恒为 40，索引 0 是 `start`、索引 39 是 `end`，中间 38 个格子的 `type` 在 `initBoard` 中通过 Fisher-Yates 洗牌打乱（共 23 task / 4 test / 8 truth / 3 wish）。
- 同一时刻最多有一个弹窗可见：`modal.show` 与 `customInput.show` 不会同时为 true（编辑模式下棋子被隐藏，掷骰按钮也不显示，触发 `modal` 的入口被关闭）。
- `currentPlayer ∈ {0, 1}`：0 表示女生回合，1 表示男生回合。终点胜利弹窗显示后 `currentPlayer` 不再切换。
