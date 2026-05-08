---
type: og-root
schema: 1
last_synced_commit: bf5cd33f7f83af0568ace7e6aefc99fbf14a2cfa
---

# 💞 恋爱飞行棋 Pro 功能树

> 由 [OpenGeno](https://github.com/web-abin/OpenGeno) 维护。
> AI 在改动用户可见行为之前必须先读这份索引；
> 改动行为之后必须更新对应的功能文档。

## 模块

| 模块 | 说明 | 路径 |
|------|------|------|
| home | 首页模式选择，作为小程序入口承担五种玩法的导航 | [home/](home/index.md) |
| game | 游戏核心，负责棋盘、骰子、棋子移动、回合切换与任务弹窗 | [game/](game/index.md) |
| library | 题库数据，提供四种内置模式下 task/test/truth/wish 四类题目 | [library/](library/index.md) |
| custom | 自定义飞行棋的编辑模式、任务输入、本地存储与清空操作 | [custom/](custom/index.md) |

## 不在文档树范围内的内容

下列内容**不**在文档树中记录，因为它们是横切基础设施而不是用户可见的功能。
它们应该写在代码注释、ADR 或 CLAUDE.md 里，不进文档树：

- 国际化 / 翻译
- 数据埋点、用户行为分析、A/B 实验
- 构建工具、CI/CD、发版脚本
- 异常上报（Sentry、Crashlytics 等）
- 日志
- 纯工具方法、纯样式 widget
- 主题原语（颜色、字体 token）

## 约定

- 模块和功能 slug 一律用 `kebab-case`。
- 一个流程的多个子步骤放进同一个子目录下，子目录有自己的 `index.md`。
- 跨功能依赖在每份 L3 文档的「跨功能链路」一节中用相对路径声明。
