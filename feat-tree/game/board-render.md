---
type: og-feature
kind: ui
feature: board-render
module: game
schema: 1
code:
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 螺旋棋盘渲染

游戏页中央的螺旋棋盘，由 40 个格子绝对定位排出"由外向内、顺时针螺旋"的路径。起点（0）位于右上、终点（39）在棋盘内圈中部。每个格子按其 `type` 渲染不同底色，用于把任务类别（task / test / truth / wish）一眼可读地传达给玩家。

## 线稿

```
                右上 ↘ 起点 GO
┌─────────────────────────────────────┐
│  ●─●─●─●─●─●─●  GO                  │
│  ●               ↓                  │
│  ●     ●─●─●─●─●─●                  │
│  ●     ●               ●            │
│  ●     ●     ●─●─●     ●            │
│  ●     ●     ●         ●            │   每个 ● 是一个 80×80rpx 圆角格
│  ●     ●     ●  🏁     ●            │   颜色按 type 区分：
│  ●     ●     ●         ●            │     紫=task, 绿=test
│  ●     ●─●─●─●─●─●─●─●─●            │     粉=truth, 黄=wish
│  ●─●─●─●─●─●─●─●─●─●─●─●            │     起点深玫红 / 终点暗玫红
└─────────────────────────────────────┘
```

## 入口

- `onLoad → initGame(mode) → initBoard()` 在每次进入游戏页时被调用一次。
- 切换编辑态、保存自定义任务、清空自定义数据都不会重新洗牌，仅修改格子内容。

## 布局

- `.board-container`：680×960rpx 半透明白底的圆角面板，作为绝对定位的坐标系。
- `.cell`（×40）：80×80rpx 圆角块，`position: absolute`，`left/top` 由 `initBoard` 计算。
- 每个格子内部根据 `index` 渲染：
  - `index === 0`：显示 `GO` 文本（白色 20rpx，加粗）。
  - `index === 39`：显示 🏁 emoji（48rpx）。
  - 其他：显示格子序号 + （仅自定义模式且已填写时）一个白色五角星图标。
- 棋子（女生 👧 / 男生 👦）作为子元素挂在「玩家所在格」上，`piece-girl` 偏移到格子左上、`piece-boy` 偏移到格子右下。

## 交互

1. **格子点击（`bindtap="handleCellClick"`）**：
   - 仅当 `mode === 'custom' && isEditing && index !== 0 && index !== 39` 时打开自定义输入弹窗（详见 [../custom/task-input.md](../custom/task-input.md)）。
   - 其他状态下无视点击。
2. **`:active` 视觉反馈**：所有格子按下时缩放到 0.9（0.1s 过渡）。

## 业务逻辑

- **路径生成**（`initBoard`，`miniprogram/pages/game/index.js:31-67`）：以 `startX=580, startY=20, gap=92` 的网格按 9 段 `for` 循环依次推入 40 个 `{x, y}` 坐标，构成由外向内的螺旋。
- **类型分配**：先用 `[...Array(23).fill('task'), ...Array(4).fill('test'), ...Array(8).fill('truth'), ...Array(3).fill('wish')]` 拼出 38 个类型，再用 Fisher-Yates 洗牌；最终 `board[0].type = 'start'`、`board[39].type = 'end'`，其余从 `types.pop()` 取出。
- **底色映射**（`getCellBg`，`miniprogram/pages/game/index.js:111-130`）：
  - `index === 0`：`bg-rose`（玫瑰红）。
  - `index === 39`：`bg-rose-dark`（暗玫红）。
  - 自定义模式：填了任务 → `bg-rose`，未填 → `bg-white` 带粉边。
  - 其他模式：`task → bg-purple`、`test → bg-emerald`、`truth → bg-pink`、`wish → bg-amber`。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| 浏览（内置模式） | `mode !== 'custom'` | 五色格子 + 棋子可见 |
| 浏览（自定义模式，已填） | `mode === 'custom' && !isEditing` | 已填格子玫瑰红、未填格子白色，棋子可见 |
| 编辑（自定义模式） | `mode === 'custom' && isEditing` | 同上但棋子隐藏，未填格子保留白底 |

## 动效

- 单格按下：`transform: scale(0.9)`，0.1s 缓动。
- 棋盘整体无入场动画。

## 跨功能链路

- → [piece-move.md](piece-move.md)：渲染时为当前 `playerPos[*]` 所对应的格子挂上棋子；位置变化触发棋子的 transition 动画（在棋盘容器的坐标系下）。
- → [../custom/task-input.md](../custom/task-input.md)：编辑态下格子点击的唯一去处。
- → [../custom/edit-mode.md](../custom/edit-mode.md)：编辑态布尔值控制棋子隐藏与点击行为。

## 边界情况

- 内置模式下的 `getCellBg` 在意外 `type`（例如 `start` / `end` 落到中段格子上）会回落到 `bg-white` —— 当前 `initBoard` 不会产生此情况，但保留了兜底分支。
- 棋盘容器宽 680rpx 但路径起点 `startX=580 + 80rpx` 格宽近右边界；屏幕宽度异常窄时格子可能被裁切（小程序最低支持机型 iPhone 5/SE 已 EOL，实际触发概率低）。
- WXML 直接调用 `getCellBg(item.index)` 作为 class 表达式：本项目依赖编译期支持，未走 WXS。

## 关联代码

- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.wxss
