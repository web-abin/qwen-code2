---
type: og-feature
kind: ui
feature: dice-roll
module: game
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 掷骰子动画

游戏页底部控制面板上的「掷骰子」按钮 + 中央骰子显示。点击按钮后骰子图标快速滚动约 0.9 秒，随后定格在 1–6 中的某个点数，并立即触发棋子前进。

## 线稿

```
┌─────────────────────────────────────┐
│  ┌─────┐        🎲       ┌─────┐    │
│  │ 👧  │   （滚动中）    │ 👦  │    │   ← 角色头像 + 骰子（players-info）
│  │女生 │                 │男生 │    │
│  └─────┘                 └─────┘    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      正在掷骰子...  /  掷骰子 │  │   ← 大块玫瑰红按钮
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 入口

- 仅在 `!isEditing`（即非编辑态）时渲染 `.control-panel`，按钮才存在。
- 编辑态下整个控制面板被替换为编辑提示条（详见 [../custom/edit-mode.md](../custom/edit-mode.md)）。

## 布局

- `.dice-display`：纵向 flex，唯一子元素 `.dice-icon`（100rpx emoji 字号）。
- `.roll-btn`：充满 `.control-panel` 宽度的玫瑰红圆角大按钮，下沿 8rpx 暗红边模拟立体感。

## 交互

1. **掷骰子按钮（`.roll-btn`，`bindtap="roll"`）**：
   - `isRolling` 为 false 时可点击，文案 `掷骰子`。
   - 点击立即把 `isRolling` 置为 true，按钮 `disabled` 且 `opacity: 0.5`，文案改为 `正在掷骰子...`。
   - 0.91 秒后定格点数，调用 `move()`。
2. **按钮按下视觉**：`:active` 时 `transform: scale(0.95)`，仅在未禁用时生效。

## 业务逻辑

- `roll()`（`miniprogram/pages/game/index.js:132-148`）：
  1. 若 `isRolling` 为 true，直接返回（防重入）。
  2. 设 `isRolling = true`。
  3. `setInterval` 每 70ms 把 `diceValue` 设为新的 `Math.floor(Math.random()*6)+1`，制造"乱跳"。
  4. 第 13 次（即 ~910ms）后清除 interval，把 `isRolling` 置 false，调用 `move()`（详见 [piece-move.md](piece-move.md)）。
- 定格点数 = 最后一次随机值，按 `data.diceIcons[diceValue - 1]`（即 `⚀ ⚁ ⚂ ⚃ ⚄ ⚅`）渲染。
- 滚动期间渲染 `🎲` emoji 并加 `.animate-bounce` 类，造成上下蹦跳动画（0.5s 循环、`translateY(-20rpx)`）。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| idle | 初始 / 上一回合任务完成关闭弹窗后 | 显示当前 `diceValue` 对应的点骰 emoji，按钮可点 |
| rolling | 点击掷骰子直至 setInterval 结束 | 🎲 emoji 蹦跳，按钮变灰 + 文案变化 |

## 动效

- `@keyframes bounce`：`translateY(0 → -20rpx → 0)`，0.5s 无限循环，附加于 `.animate-bounce`。
- 点骰图标定格时直接切换 `text` 内容，无淡入。
- 按钮 `:active` 缩放 0.95，0.2s 回弹（线性）。

## 跨功能链路

- → [piece-move.md](piece-move.md)：滚动结束后必然调用一次 `move()`。
- ← [task-trigger.md](task-trigger.md)：任务弹窗关闭后玩家通常会再次按下本按钮。

## 边界情况

- 滚动中再点击：被 `if (this.data.isRolling) return` 拦截，无事发生。
- 滚动期间快速切到后台再回前台：`setInterval` 由小程序维持，回到前台后继续完成剩余 tick；`isRolling` 仍能正确归位。
- 终点胜利后再次点击：`isRolling` 为 false 所以可点，但 `move()` 会因 `playerPos[currentPlayer] >= 39` 而跳过移动，进入 [end-game.md](end-game.md) 的"再次弹窗"分支。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.wxss
