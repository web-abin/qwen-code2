// Auto-Control-Miniprogram 配置文件
// 完整文档：https://www.npmjs.com/package/auto-control-miniprogram

/** @type {import('auto-control-miniprogram').AcmpConfig} */
module.exports = {
  // 必填：小程序 / 小游戏 AppID
  appid: 'wx33c8a193766be345',

  // 类型：'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin'
  type: 'miniProgram',

  // 待上传代码目录
  projectPath: './miniprogram',

  // 上传私钥（默认 ./.keys/private.<appid>.key）
  // 也可以使用 privateKey 字段直接传内容（适合 CI 注入环境变量）
  // privateKeyPath: './.keys/private.wxYOUR_APPID_HERE.key',

  // 上传 / 预览前自动执行的构建命令；不需要可设为 false
  build: false,

  // 二维码格式：'terminal' | 'image' | 'base64'
  qrcodeFormat: 'terminal',
  qrcodeOutput: './qrcode.jpg',

  // 编译设置
  setting: {
    es6: true,
    es7: true,
    minify: true,
    codeProtect: false,
    autoPrefixWXSS: true,
  },

  // 忽略不上传的文件
  ignores: ['node_modules/**/*'],
}
