---
type: og-module
module: library
schema: 1
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
---

# library

题库数据模块，集中维护四种内置玩法（`t1` 心动瞬间 / `t2` 浓情蜜意 / `t3` 深情默契 / `naughty` 羞羞飞行棋）下的 `task` / `test` / `truth` / `wish` 四类题目内容。`game` 模块在棋子停下时按当前模式与格子类型从这里随机抽题。本模块不包含自定义模式题目（属于 `custom` 模块）。

## 功能

| 功能 | 类型 | 路径 |
|------|------|------|
| 内置题库 | 逻辑 | [task-library.md](task-library.md) |

## 跨模块依赖

- → 提供给 `game/task-trigger`：通过 `app.globalData.libraries[mode]` 暴露题库，由 `game` 模块在抽题时读取。
- ← 入向：`home/mode-selection` 中的 `key` 值与本模块 key 必须严格一致；新增模式需要同步 home / game / library 三处。

## 模块级不变量

- 题库定义在 `App({ globalData })` 中（`miniprogram/app.js`），全程只读；运行时不变。
- 每种模式必须包含 `task` / `test` / `truth` / `wish` 四个非空数组；`game/task-trigger` 用 `lib[cell.type] || lib.task` 兜底，但若 `task` 数组也为空则会抽到 `undefined`。
- `icon` 字段冗余存在但未被消费（`game/index.js` 的 `data.modes` 自带 icon），两处需同步维护。
