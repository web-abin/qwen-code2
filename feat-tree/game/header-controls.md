---
type: og-feature
kind: ui
feature: header-controls
module: game
schema: 1
code:
  - miniprogram/pages/game/index.wxml
  - miniprogram/pages/game/index.js
  - miniprogram/pages/game/index.wxss
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 顶部控制条

游戏页顶部的水平条，左侧返回首页，中间显示当前模式名，右侧仅在自定义模式下出现「编辑 / 完成」按钮。其他模式下右侧用占位元素填空，保持中间标签居中。

## 线稿

```
┌──────────────────────────────────────┐
│ ┌──┐    ┌────────────────┐    ┌──┐  │
│ │🏠│    │  甜蜜互动（…）│    │··│  │   ← 非自定义模式：右侧为占位
│ └──┘    └────────────────┘    └──┘  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ┌──┐    ┌────────────────┐  ┌────┐  │
│ │🏠│    │  自定义飞行棋   │  │编辑│  │   ← 自定义模式：右侧出现按钮
│ └──┘    └────────────────┘  └────┘  │
└──────────────────────────────────────┘                ↑
                                              编辑中切换为「完成」（绿色）
```

## 入口

- 进入 `pages/game/index` 后立即渲染，`onLoad` 中 `initGame(options.mode)` 写入 `modeName` 后即对中间徽章生效。

## 布局

- `.header`：宽度 100%，水平 flex，`justify-content: space-between`，`align-items: center`，`z-index: 10`，与下方棋盘容器之间留 32rpx 间距。
- `.back-btn`：80×80rpx 的圆形白底按钮，正中央显示 🏠 emoji。
- `.mode-badge`：胶囊形半透明白底徽章，内嵌一段 28rpx 的玫瑰红文字（`modeName`）。
- 右侧二选一：
  - `mode === 'custom'` → `.edit-btn`：玫瑰红填充按钮，文案 `编辑`；进入编辑态后追加 `.edit-active` 类，背景变绿且文案改为 `完成`。
  - 其他模式 → `.placeholder`：80rpx 宽透明占位。

## 交互

1. **🏠 返回按钮（`.back-btn`）**：`bindtap="goHome"`。
   - 当前不在编辑态：直接 `wx.navigateBack`。
   - 当前处于编辑态：先弹原生 `wx.showModal`，标题「提示」、内容「内容未保存，确定退出？」，确认后 `wx.navigateBack`，取消则停留。
2. **模式徽章（`.mode-badge`）**：纯展示，无点击行为。
3. **编辑/完成按钮（`.edit-btn`，仅 `mode === 'custom'`）**：`bindtap="toggleEditMode"`。点击切换 `isEditing`，并把 `playerPos` 重置为 `[0, 0]`、`currentPlayer` 重置为 `0`（仅在进入编辑态时重置；退出编辑态保留当前位置）。详见 [../custom/edit-mode.md](../custom/edit-mode.md)。

## 业务逻辑

- 模式名解析：`onLoad` 中 `initGame(mode)` 从 `data.modes[mode].name` 读出，写入 `modeName`。
- 「未保存退出」判断仅基于 `isEditing` 这一布尔值，不比较实际是否有未保存改动。

## 状态

| 状态 | 触发条件 | 界面表现 |
|------|----------|----------|
| 非自定义模式 | URL `mode !== 'custom'` | 右侧显示 `.placeholder`，无编辑按钮 |
| 自定义 - 浏览态 | `mode === 'custom' && !isEditing` | 右侧显示玫瑰红「编辑」按钮 |
| 自定义 - 编辑态 | `mode === 'custom' && isEditing` | 右侧按钮变绿，文案为「完成」 |

## 动效

- `.edit-btn` 切换 `.edit-active` 时由 `transition: all 0.3s` 平滑过渡背景色。
- `.back-btn`、`.edit-btn` 都有玫瑰红投影 box-shadow，没有悬浮 / 按下额外动画。

## 跨功能链路

- → [../home/mode-selection.md](../home/mode-selection.md)：返回按钮通过 `wx.navigateBack` 回到首页。
- → [../custom/edit-mode.md](../custom/edit-mode.md)：编辑/完成按钮是该功能的唯一外部入口。
- ← [../home/navigation.md](../home/navigation.md)：本控件随 `pages/game/index` 一同被该跳转挂载。

## 边界情况

- `mode` 参数缺失：`onLoad` 内 `if (options.mode)` 守卫，缺失时 `initGame` 不执行，`modeName` 保持空字符串、徽章空白。
- 编辑态点击返回 → 弹窗确认 → 取消：状态完全保留，玩家可以继续编辑。
- 非自定义模式下 `isEditing` 不可能为 true（`toggleEditMode` 在该状态下没有入口被点击）。

## 关联代码

- miniprogram/pages/game/index.wxml
- miniprogram/pages/game/index.js
- miniprogram/pages/game/index.wxss
