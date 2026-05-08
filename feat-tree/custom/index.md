---
type: og-module
module: custom
schema: 1
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
---

# custom

自定义飞行棋模块，覆盖玩家在「⚙️ 自定义飞行棋」模式下编辑棋盘内容的全流程：编辑模式开关、单格任务输入弹窗、本地存储持久化、清空数据确认。本模块只在 `mode === 'custom'` 时生效；进入对局后实际的格子触发逻辑由 [../game/task-trigger.md](../game/task-trigger.md) 处理（自定义任务为空时会自动跳过弹窗，仅切换回合）。

## 功能

| 功能 | 类型 | 路径 |
|------|------|------|
| 编辑模式切换 | UI | [edit-mode.md](edit-mode.md) |
| 任务输入弹窗 | UI | [task-input.md](task-input.md) |
| 本地存储持久化 | 逻辑 | [task-persist.md](task-persist.md) |
| 清空数据确认 | UI | [clear-data.md](clear-data.md) |

## 跨模块依赖

- ↔ 共用 `game` 模块的 `data.board`：本模块的所有功能直接修改 `board[i].task`；`game/board-render` 据此计算格子底色与五角星标记。
- ← `game/header-controls` 的「编辑/完成」按钮是本模块的唯一入口。
- → `wx.setStorage / wx.getStorage`（key=`couple_board_v3`）：本模块独占该存储 key。

## 模块级不变量

- 存储 key 固定为 `couple_board_v3`；升级数据结构必须改 key 否则会读到旧版数据。
- 自定义模式下 `board[0]`（起点）与 `board[39]`（终点）始终不可被点击编辑，由 `handleCellClick` 内 `index !== 0 && index !== 39` 守卫。
- 编辑态进入时强制重置 `playerPos = [0, 0]` 和 `currentPlayer = 0`；退出编辑态不重置。
