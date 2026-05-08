---
type: og-feature
kind: logic
feature: task-library
module: library
schema: 1
code:
  - miniprogram/app.js
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
last_reviewed: 2026-05-06
---

# 内置题库

把四种内置玩法的全部题目以纯字面量形式挂载到 `App.globalData.libraries`，由 `game` 模块在棋子停下后按 `(mode, type)` 随机抽题。本身不含任何运行时逻辑。

## 触发条件

- 小程序启动时 `App({ globalData })` 被微信框架同步求值，`libraries` 立即可用。
- `game/task-trigger` 在 `mode !== 'custom'` 且非终点格的情况下读取 `app.globalData.libraries[mode][cell.type]`。

## 输入

- 无运行时输入。题库本身就是输入。

## 输出

- `App.globalData.libraries`：4 个键 (`t1` / `t2` / `t3` / `naughty`)，每个键值结构如下：
  ```ts
  {
    task: string[];   // 行为类任务（拥抱、对视、亲吻等）
    test: string[];   // 测试题（默契考察）
    truth: string[];  // 真心话
    wish: string[];   // 愿望/惩罚
    icon: string;     // 单字符 emoji（与 home/game 模块的 icon 重复，仅冗余）
  }
  ```

## 逻辑流程

1. `App` 实例化时由微信框架把 `globalData` 整体挂到 `getApp()`。
2. `game/index.js` 中 `const app = getApp()`；任务弹出时执行：
   - `lib = app.globalData.libraries[currentMode]`
   - `list = lib[cell.type] || lib.task`
   - `task = list[Math.floor(Math.random()*list.length)]`

## 状态

- 全程只读，不维护状态机。

## 失败模式

| 失败 | 检测方式 | 恢复策略 |
|------|----------|----------|
| 新增模式忘记同步 `globalData.libraries` | 进入新模式后 `lib` 为 `undefined`，访问其属性抛运行时错误 | 新增模式时在 home/game/library 三处同步 |
| 数组中某条任务被改成空字符串 | 弹窗内容为空白 | 校对题库时禁止留空字符串 |
| 模式 key 大小写或拼写错位 | `lib === undefined` | 用常量集中维护 mode key（当前未抽出常量，靠人工对齐） |

## 不变量

- 数据完全静态，不写盘、不发请求。
- 同模式下 `task` 数组保证非空（用作 `lib[cell.type] || lib.task` 的兜底分支）。
- 全部内容为简体中文字符串，不含格式化占位符或模板变量。

## 跨功能链路

- ← [../game/task-trigger.md](../game/task-trigger.md) 是唯一消费方。
- ← [../home/mode-selection.md](../home/mode-selection.md)：模式 key 一致性约束。

## 关联代码

- miniprogram/app.js
