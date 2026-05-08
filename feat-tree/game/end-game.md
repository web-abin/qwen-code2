---
type: og-feature
kind: ui
feature: end-game
module: game
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 终点胜利弹窗

任意一方棋子走到第 39 格时，弹出的胜利庆祝弹窗。复用 [task-trigger.md](task-trigger.md) 的 `modal` 数据结构与样式，但内容固定为奖杯 + 胜利文案，并且不再切换回合。

## 线稿

```
┌──────────────────────── modal-overlay ────────────────────────┐
│                                                               │
│            ┌────────────────────────────────┐                 │
│            │              🏆                │                 │
│            │        🎉 到达终点！           │                 │
│            │                                │                 │
│            │  恭喜 女生/男生 获得最终胜利！ │                 │
│            │  对方要接受一个终极愿望惩罚~   │                 │
│            │                                │                 │
│            │      ┌──────────────────┐      │                 │
│            │      │     任务完成     │      │                 │
│            │      └──────────────────┘      │                 │
│            └────────────────────────────────┘                 │
└───────────────────────────────────────────────────────────────┘
```

## 入口

- `triggerEvent(pos)` 中 `pos === 39` 分支（`miniprogram/pages/game/index.js:175-185`）。

## 布局

- 与 [task-trigger.md](task-trigger.md) 完全相同，因为复用的是 `.modal-overlay` / `.modal-content` 这套样式与 `data.modal` 字段；区别仅在于 `icon`、`title`、`content` 的取值。

## 交互

1. **任务完成按钮**：`bindtap="closeModal"` 仅把 `modal.show` 置 false。**不会**重置棋子位置或回合方。
2. **遮罩点击**：同上，关闭弹窗。

## 业务逻辑

- `setData`：
  ```js
  modal: {
    show: true,
    title: '🎉 到达终点！',
    content: `恭喜 ${activePlayer} 获得最终胜利！\n对方要接受一个终极愿望惩罚哦~`,
    icon: '🏆'
  }
  ```
- `activePlayer = currentPlayer === 0 ? '女生' : '男生'`。
- **特殊**：本分支 `return`，不修改 `currentPlayer`。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| hidden | 初始 | 不渲染 |
| shown | 任意一方走到第 39 格 | 显示奖杯弹窗 |
| post-shown | 玩家关闭弹窗后 | `modal.show=false`，但游戏处于"已结束"状态——`playerPos[winner]=39`、回合方仍是赢家 |

## 动效

- 与 [task-trigger.md](task-trigger.md) 一致：入场 `scaleUp` 0.6s 缓出。

## 跨功能链路

- ← [piece-move.md](piece-move.md) → [turn-system.md](turn-system.md)：从胜负判定分支跳进本功能。
- → [../home/mode-selection.md](../home/mode-selection.md)：玩家通过左上角 🏠（[header-controls.md](header-controls.md)）回到首页是结束本对局的唯一出口。

## 边界情况

- 玩家关闭弹窗后再次点击「掷骰子」：`isRolling=false` 所以可点；`move()` 因 `playerPos[winner] >= 39` break，进入 200ms 后的 `triggerEvent(39)`，弹窗再次出现。这是已知的"软卡住"行为，需要返回首页才能重玩。
- 双方同时到达 39（不可能发生）：单线程交替回合制，每次只有一方在动，本边界条件不会触发。
- 弹窗关闭后玩家若回首页再选同模式：`onLoad → initGame → initBoard` 重新洗牌，棋子归零，状态全部重置。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
