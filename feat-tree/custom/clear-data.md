---
type: og-feature
kind: ui
feature: clear-data
module: custom
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 清空数据确认

编辑态下编辑提示条里的「清空数据」入口。点击后弹出微信原生 `wx.showModal` 二次确认；确认后清空内存中所有格子的 `task` 字段，并删除 `couple_board_v3` 本地存储。

## 线稿

```
（编辑态控制面板）
┌────────────────────────┐         ┌─────────────────────────┐
│ 🛠 点击棋盘格设置专属  │         │      确认清空           │
│      任务              │         │                         │
│                        │   →     │ 确定清空所有自定义内容? │
│   清空数据 (下划线)    │ 点击    │                         │
│        ↑               │         │   [取消]   [确定]       │
└────────────────────────┘         └─────────────────────────┘
```

## 入口

- 仅在编辑态下渲染（`wx:if="{{isEditing}}"` → `.edit-hint > .clear-btn`）。
- 入口本身在 [edit-mode.md](edit-mode.md) 描述的提示条里。

## 布局

- `.clear-btn`：24rpx 灰色文本，下划线，无背景。
- 二次确认窗使用微信原生 `wx.showModal`，标题「确认清空」、内容「确定清空所有自定义内容吗？」，包含取消与确定两个按钮。

## 交互

1. **「清空数据」文本（`bindtap="clearCustomBoard"`）**：调用 `wx.showModal`。
2. **原生弹窗的「取消」**：`res.confirm === false`，什么也不做。
3. **原生弹窗的「确定」**：`res.confirm === true`，把 `board` 中每个 `cell.task` 重置为 `''`，触发 `setData({ board })`，并调用 `wx.removeStorage({ key: 'couple_board_v3' })`。

## 业务逻辑

- `clearCustomBoard`（`miniprogram/pages/game/index.js:261-276`）：
  ```js
  wx.showModal({
    title: '确认清空',
    content: '确定清空所有自定义内容吗？',
    success: (res) => {
      if (res.confirm) {
        const board = data.board.map(cell => { cell.task = ''; return cell; });
        this.setData({ board });
        wx.removeStorage({ key: 'couple_board_v3' });
      }
    }
  })
  ```
- 不重置 `playerPos` 或 `currentPlayer`，但因为本入口仅在编辑态可见，且编辑态进入时已经把这两者重置过，实际无影响。
- 不触发任何弹窗动画，由微信原生组件接管视觉。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| idle | 初始 | 编辑提示条上"清空数据"可点 |
| confirming | 点击后 | 微信原生 modal 阻塞输入，提示条灰化 |
| cleared | 玩家点击确定后 | 所有格子恢复白底，提示条仍在 |

## 动效

- 由微信原生 `wx.showModal` 控制；本功能未自定义动画。

## 跨功能链路

- ← [edit-mode.md](edit-mode.md) 提供入口。
- → [task-persist.md](task-persist.md)：通过 `wx.removeStorage` 删除存储。
- → [../game/board-render.md](../game/board-render.md)：所有 `cell.task` 清空后底色全部回到白底。

## 边界情况

- 玩家在原生 modal 期间按 home：原生 modal 被系统挂起，回到前台后仍可点击。
- 数据已经全空时点击清空：执行写入空数组的 setData + removeStorage 仍然成功，无副作用。
- 清空后未退出编辑态：玩家可继续编辑，下次保存会重新建立 `couple_board_v3`。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
