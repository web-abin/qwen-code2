const app = getApp();

Page({
  data: {
    currentMode: '',
    modeName: '',
    board: [],
    playerPos: [0, 0],
    currentPlayer: 0,
    diceValue: 1,
    isRolling: false,
    isEditing: false,
    diceIcons: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],
    modal: { show: false, title: '', content: '', icon: '' },
    customInput: { show: false, index: null, text: '' },
    modes: {
      t1: { name: '甜蜜互动（心动瞬间）', icon: '🍭' },
      t2: { name: '甜蜜互动（浓情蜜意）', icon: '🎨' },
      t3: { name: '甜蜜互动（深情默契）', icon: '🎈' },
      naughty: { name: '羞羞飞行棋', icon: '🔞' },
      custom: { name: '自定义飞行棋', icon: '⚙️' }
    }
  },

  onLoad: function (options) {
    if (options.mode) {
      this.initGame(options.mode);
    }
  },

  initBoard: function () {
    const path = [];
    const startX = 580, startY = 20, gap = 92; // px 转 rpx (乘以 2)
    
    // 螺旋路径算法
    for (let i = 0; i < 7; i++) path.push({ x: startX - i * gap, y: startY });
    for (let i = 1; i < 9; i++) path.push({ x: startX - 6 * gap, y: startY + i * gap });
    for (let i = 1; i < 7; i++) path.push({ x: startX - 6 * gap + i * gap, y: startY + 8 * gap });
    for (let i = 1; i < 7; i++) path.push({ x: startX, y: startY + 8 * gap - i * gap });
    for (let i = 1; i < 5; i++) path.push({ x: startX - i * gap, y: startY + 2 * gap });
    for (let i = 1; i < 5; i++) path.push({ x: startX - 4 * gap, y: startY + 2 * gap + i * gap });
    for (let i = 1; i < 3; i++) path.push({ x: startX - 4 * gap + i * gap, y: startY + 6 * gap });
    for (let i = 1; i < 3; i++) path.push({ x: startX - 2 * gap, y: startY + 6 * gap - i * gap });
    path.push({ x: startX - 3 * gap, y: startY + 4 * gap });

    const types = [
      ...Array(23).fill('task'),
      ...Array(4).fill('test'),
      ...Array(8).fill('truth'),
      ...Array(3).fill('wish')
    ];
    
    // 洗牌算法
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    const board = path.map((c, i) => ({
      index: i,
      x: c.x,
      y: c.y,
      type: i === 0 ? 'start' : i === 39 ? 'end' : types.pop(),
      task: ''
    }));

    this.setData({ board });
  },

  initGame: function (mode) {
    const modeInfo = this.data.modes[mode];
    
    this.setData({
      currentMode: mode,
      modeName: modeInfo.name,
      playerPos: [0, 0],
      currentPlayer: 0,
      isEditing: false,
      diceValue: 1,
      isRolling: false
    });

    this.initBoard();

    if (mode === 'custom') {
      wx.getStorage({
        key: 'couple_board_v3',
        success: (res) => {
          const savedTasks = res.data;
          const board = this.data.board.map((cell, i) => {
            if (savedTasks[i]) {
              cell.task = savedTasks[i];
            }
            return cell;
          });
          this.setData({ board });
          
          // 如果没有任务，进入编辑模式
          if (!board.some(c => c.task)) {
            this.setData({ isEditing: true });
          }
        },
        fail: () => {
          // 没有保存的数据，进入编辑模式
          this.setData({ isEditing: true });
        }
      });
    }
  },

  getCellBg: function (index) {
    const { board, currentMode } = this.data;
    const cell = board[index];
    
    if (index === 0) return 'bg-rose';
    if (index === 39) return 'bg-rose-dark';
    
    if (currentMode === 'custom') {
      return cell.task ? 'bg-rose' : 'bg-white';
    }
    
    const colors = {
      task: 'bg-purple',
      test: 'bg-emerald',
      truth: 'bg-pink',
      wish: 'bg-amber'
    };
    
    return colors[cell.type] || 'bg-white';
  },

  roll: function () {
    if (this.data.isRolling) return;
    
    this.setData({ isRolling: true });
    
    let count = 0;
    const interval = setInterval(() => {
      const newDice = Math.floor(Math.random() * 6) + 1;
      this.setData({ diceValue: newDice });
      
      if (++count > 12) {
        clearInterval(interval);
        this.setData({ isRolling: false });
        this.move();
      }
    }, 70);
  },

  move: async function () {
    const { currentPlayer, playerPos, diceValue } = this.data;
    const steps = diceValue;
    
    for (let i = 0; i < steps; i++) {
      if (playerPos[currentPlayer] >= 39) break;
      
      const newPos = [...playerPos];
      newPos[currentPlayer]++;
      this.setData({ playerPos: newPos });
      
      // 每步停顿 300ms
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setTimeout(() => {
      this.triggerEvent(playerPos[currentPlayer]);
    }, 200);
  },

  triggerEvent: function (pos) {
    const { board, currentMode, currentPlayer, modes } = this.data;
    const cell = board[pos];
    const activePlayer = currentPlayer === 0 ? '女生' : '男生';

    if (pos === 39) {
      this.setData({
        modal: {
          show: true,
          title: '🎉 到达终点！',
          content: `恭喜 ${activePlayer} 获得最终胜利！\n对方要接受一个终极愿望惩罚哦~`,
          icon: '🏆'
        }
      });
      return;
    }

    if (currentMode === 'custom') {
      if (cell.task) {
        this.setData({
          modal: {
            show: true,
            title: `${activePlayer}的任务`,
            content: cell.task,
            icon: '📝'
          },
          currentPlayer: currentPlayer === 0 ? 1 : 0
        });
      } else {
        // 自定义模式空格子：直接切下一个人
        this.setData({
          currentPlayer: currentPlayer === 0 ? 1 : 0
        });
      }
    } else {
      const lib = app.globalData.libraries[currentMode];
      const list = lib[cell.type] || lib.task;
      const task = list[Math.floor(Math.random() * list.length)];
      const icons = { task: '💜', test: '💚', truth: '💗', wish: '💛' };
      
      this.setData({
        modal: {
          show: true,
          title: `${activePlayer}的任务`,
          content: task,
          icon: icons[cell.type] || '✨'
        },
        currentPlayer: currentPlayer === 0 ? 1 : 0
      });
    }
  },

  handleCellClick: function (e) {
    const { currentMode, isEditing, board } = this.data;
    const index = e.currentTarget.dataset.index;
    
    if (currentMode === 'custom' && isEditing && index !== 0 && index !== 39) {
      const cell = board[index];
      this.setData({
        customInput: {
          show: true,
          index: index,
          text: cell.task || ''
        }
      });
    }
  },

  onInput: function (e) {
    this.setData({
      'customInput.text': e.detail.value
    });
  },

  saveCustom: function () {
    const { customInput, board } = this.data;
    
    board[customInput.index].task = customInput.text;
    this.setData({ 
      board,
      'customInput.show': false
    });
    
    // 保存到本地存储
    const tasks = board.map(c => c.task);
    wx.setStorage({
      key: 'couple_board_v3',
      data: tasks
    });
  },

  clearCustomBoard: function () {
    wx.showModal({
      title: '确认清空',
      content: '确定清空所有自定义内容吗？',
      success: (res) => {
        if (res.confirm) {
          const board = this.data.board.map(cell => {
            cell.task = '';
            return cell;
          });
          this.setData({ board });
          wx.removeStorage({ key: 'couple_board_v3' });
        }
      }
    });
  },

  toggleEditMode: function () {
    const { isEditing } = this.data;
    const newEditingState = !isEditing;
    
    this.setData({ 
      isEditing: newEditingState,
      playerPos: newEditingState ? [0, 0] : this.data.playerPos,
      currentPlayer: newEditingState ? 0 : this.data.currentPlayer
    });
  },

  goHome: function () {
    const { isEditing } = this.data;
    
    if (isEditing) {
      wx.showModal({
        title: '提示',
        content: '内容未保存，确定退出？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  closeModal: function () {
    this.setData({
      'modal.show': false
    });
  },

  closeCustomInput: function () {
    this.setData({
      'customInput.show': false
    });
  },

  stopPropagation: function () {
    // 阻止事件冒泡
  }
});
