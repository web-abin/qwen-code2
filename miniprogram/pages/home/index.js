Page({
  data: {
    modes: [
      { key: 't1', name: '甜蜜互动（心动瞬间）', icon: '🍭' },
      { key: 't2', name: '甜蜜互动（浓情蜜意）', icon: '🎨' },
      { key: 't3', name: '甜蜜互动（深情默契）', icon: '🎈' },
      { key: 'naughty', name: '羞羞飞行棋', icon: '🔞' },
      { key: 'custom', name: '自定义飞行棋', icon: '⚙️' }
    ]
  },

  onLoad: function () {
    // 页面加载
  },

  initGame: function (e) {
    const mode = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/game/index?mode=' + mode
    });
  }
});
