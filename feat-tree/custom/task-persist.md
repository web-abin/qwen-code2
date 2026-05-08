---
type: og-feature
kind: logic
feature: task-persist
module: custom
schema: 1
code:
  - miniprogram/pages/game/index.js
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 本地存储持久化

把自定义飞行棋 40 个格子的任务文本数组以 `couple_board_v3` 为 key 写入 `wx.storage`，并在下次进入自定义模式时读回 `data.board`。

## 触发条件

- **写入**：`saveCustom` 在玩家点击「保存」时被调用。
- **读取**：`initGame` 在 `mode === 'custom'` 时通过 `wx.getStorage` 读回。
- **清除**：`clearCustomBoard` 在玩家确认清空后调用 `wx.removeStorage`（详见 [clear-data.md](clear-data.md)）。

## 输入

- 写入：`board.map(c => c.task)` —— 长度 40 的字符串数组（含起点 / 终点位置的空字符串）。
- 读取：`couple_board_v3` 对应的数组（缺失则进入失败回调）。

## 输出

- 写入：覆盖 `couple_board_v3`。
- 读取：把数组中非空项依索引回填到 `data.board[i].task`，并触发 `setData({ board })`；若所有项都为空则 `setData({ isEditing: true })` 自动进入编辑态。
- 清除：删除 key。

## 逻辑流程

1. **写入**（`saveCustom`，`miniprogram/pages/game/index.js:244-259`）：
   - 修改内存 `board` 后立即落盘，无防抖。
2. **读取**（`initGame`，`miniprogram/pages/game/index.js:85-108`）：
   ```js
   wx.getStorage({
     key: 'couple_board_v3',
     success: ({data: savedTasks}) => {
       const board = this.data.board.map((cell, i) => {
         if (savedTasks[i]) cell.task = savedTasks[i];
         return cell;
       });
       this.setData({ board });
       if (!board.some(c => c.task)) this.setData({ isEditing: true });
     },
     fail: () => this.setData({ isEditing: true })
   })
   ```
3. **清除**：见 [clear-data.md](clear-data.md)。

## 状态

- 不维护内存状态机，全靠 `wx.storage` 当前值。

## 失败模式

| 失败 | 检测方式 | 恢复策略 |
|------|----------|----------|
| `wx.getStorage` fail（key 不存在或 IO 错误） | 进入 `fail` 回调 | 自动进入编辑态让玩家从零开始填 |
| 存储空间满 | `wx.setStorage` 抛错（当前未捕获） | 默默失败；下次保存重试 |
| 数据格式损坏（非数组或长度 ≠ 40） | `savedTasks[i]` 取到 `undefined` 时 `if (savedTasks[i])` 为 false，原 cell 保留空字符串 | 不会崩溃，等价于"部分空格" |
| 同设备不同微信号切换 | `wx.storage` 按账号隔离 | 各账号独立保存，无串数据 |

## 不变量

- key 名 `couple_board_v3` 全局唯一；变更需要写迁移逻辑。
- 数组长度等于 `board` 长度（40），起 / 终点位置永远是空字符串（编辑入口被守卫）。
- 不存任何敏感数据；纯字符串数组，无玩家身份信息。

## 跨功能链路

- ← [task-input.md](task-input.md)：保存按钮触发写入。
- ← [clear-data.md](clear-data.md)：确认按钮触发清除。
- ← [edit-mode.md](edit-mode.md)：通过自动进入编辑态间接关联。
- → [../game/board-render.md](../game/board-render.md)：读出的数据填回 `board` 后立即影响渲染。

## 关联代码

- miniprogram/pages/game/index.js
