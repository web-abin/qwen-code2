# 💞 恋爱飞行棋 Pro - 微信小程序

## 项目结构

```
miniprogram/
├── app.js                 # 小程序入口文件（包含题库数据）
├── app.json              # 小程序全局配置
├── project.config.json   # 项目配置文件（已配置 appid: wx263f28168ac7a3a1）
├── sitemap.json          # 站点地图配置
└── pages/
    ├── home/             # 首页（模式选择）
    │   ├── index.js
    │   ├── index.json
    │   ├── index.wxml
    │   └── index.wxss
    └── game/             # 游戏页面
        ├── index.js
        ├── index.json
        ├── index.wxml
        └── index.wxss
```

## 发布步骤

### 方法一：使用微信开发者工具（推荐）

1. **下载并安装微信开发者工具**
   - 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 下载对应操作系统的版本并安装

2. **导入项目**
   - 打开微信开发者工具
   - 点击「+」或「导入项目」
   - 选择 `/workspace/miniprogram` 目录
   - 项目 APPID 已配置为 `wx263f28168ac7a3a1`

3. **登录开发者账号**
   - 使用微信小程序管理员账号扫码登录
   - 确保你有该 APPID 的开发权限

4. **编译预览**
   - 点击工具栏的「编译」按钮
   - 在模拟器中测试所有功能

5. **上传代码**
   - 点击右上角的「上传」按钮
   - 填写版本号和项目备注
   - 点击上传

6. **提交审核**
   - 登录微信公众平台 https://mp.weixin.qq.com
   - 进入「版本管理」
   - 找到刚上传的开发版本，点击「提交审核」
   - 填写审核信息并提交

### 方法二：命令行上传（需要安装 CLI）

```bash
# 安装微信小程序 CLI
npm install -g miniprogram-simulate

# 使用 CI 工具上传（需要配置）
# 详见 https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
```

## 功能说明

### 游戏模式
- 🍭 甜蜜互动（心动瞬间）
- 🎨 甜蜜互动（浓情蜜意）
- 🎈 甜蜜互动（深情默契）
- 🔞 羞羞飞行棋
- ⚙️ 自定义飞行棋

### 核心功能
1. **掷骰子移动**：随机 1-6 点，棋子逐格移动动画
2. **任务触发**：到达不同格子触发对应类型任务
3. **双人回合制**：女生/男生轮流进行
4. **自定义编辑**：可自定义每个格子的任务内容
5. **本地存储**：自定义任务自动保存到本地

### 技术特点
- ✅ 所有 DOM 操作改为 setData 驱动
- ✅ 样式单位全部使用 rpx 适配移动端
- ✅ 交互逻辑 1:1 像素级还原原 HTML 版本
- ✅ 使用 wx.setStorage 替代 localStorage
- ✅ 保留所有动画效果（呼吸灯、弹跳、缩放等）

## 注意事项

1. **APPID 权限**：确保你有权使用 `wx263f28168ac7a3a1` 这个 APPID
2. **内容审核**：部分亲密互动内容可能需要在提交审核时说明
3. **字体加载**：Google Fonts 在国内可能加载较慢，建议考虑替换或使用系统字体
4. **真机测试**：务必在真机上测试动画性能和触摸反馈

## 常见问题

**Q: 如何修改 APPID？**
A: 编辑 `project.config.json` 文件中的 `appid` 字段

**Q: 自定义任务保存在哪里？**
A: 使用微信小程序的本地存储 API (wx.setStorage)，数据保存在用户设备上

**Q: 如何添加更多任务？**
A: 在 `app.js` 的 `globalData.libraries` 对象中添加新的任务数组

## 开发文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/)
- [小程序设计指南](https://developers.weixin.qq.com/miniprogram/design/)
