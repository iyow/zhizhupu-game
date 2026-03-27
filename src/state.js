// ===== 纸扎铺 - 游戏状态管理 v5.0 =====

'use strict';

// ===== 游戏状态对象 =====
window.G = {
  // 基础属性
  sanity: 80,
  hope: 60,
  
  // 物品栏
  items: {
    lantern: true,  // 初始就有
    note: false,    // 奶奶的字条
    coin: false,    // 铜钱（渡）
    key: false,     // 归魂钥匙
    photo: false,   // 爷爷照片
  },
  
  // 游戏标志
  flags: {},
  
  // 章节和场景
  chapter: 0,
  scene: 'title',
  
  // 对话系统状态
  dialogIdx: 0,
  currentDialogs: [],
  _dialogFinish: null,
  
  // 谜题状态
  inPuzzle: false,
  puzzleState: {},
  
  // 七块砖谜题
  brickSelected: null,
  brickMoveCount: 0,
  
  // 血符谜题
  bloodSteps: 0,
  
  // 阁楼谜题
  atticFound: { photo: false, letter: false, key: false },
  
  // 游戏结局
  gameOver: false,
  
  // 音效开关
  muted: false,
  
  // 打字机效果
  typing: false,
  typeTimer: null,
  
  // 热区追踪（防止重复创建）
  _hotspotsBuilt: {},
};

// ===== 状态重置 =====
function resetGameState() {
  G.sanity = 80;
  G.hope = 60;
  G.items = {
    lantern: true,
    note: false,
    coin: false,
    key: false,
    photo: false,
  };
  G.flags = {};
  G.chapter = 0;
  G.scene = 'title';
  G.dialogIdx = 0;
  G.currentDialogs = [];
  G._dialogFinish = null;
  G.inPuzzle = false;
  G.puzzleState = {};
  G.brickSelected = null;
  G.brickMoveCount = 0;
  G.bloodSteps = 0;
  G.atticFound = { photo: false, letter: false, key: false };
  G.gameOver = false;
  G.muted = false;
  G.typing = false;
  if (G.typeTimer) {
    clearInterval(G.typeTimer);
    G.typeTimer = null;
  }
  G._hotspotsBuilt = {};
}

// ===== 属性修改 =====
function changeSanity(delta) {
  G.sanity += delta;
  G.sanity = Math.max(0, Math.min(100, G.sanity));
  
  if (delta < 0) {
    playSanitySound();
    showNotify(`理智 ${delta}`);
    document.getElementById('game-container').classList.add('sanity-low');
    setTimeout(() => {
      document.getElementById('game-container').classList.remove('sanity-low');
    }, 500);
  }
  
  updateStatus();
  
  // 坏结局检查
  if (G.sanity <= 0 && !G.gameOver) {
    triggerBadEnding();
  }
}

function changeHope(delta) {
  G.hope += delta;
  G.hope = Math.max(0, Math.min(100, G.hope));
  
  if (delta > 0) {
    playHopeSound();
    showNotify(`希望 +${delta}`);
  }
  
  updateStatus();
}

function addItem(key, name) {
  G.items[key] = true;
  showNotify(`获得：${name}`);
  playCoinSound();
  updateInventory();
}

// ===== 存档/读档 =====
function saveGame() {
  const saveData = {
    sanity: G.sanity,
    hope: G.hope,
    items: G.items,
    flags: G.flags,
    chapter: G.chapter,
    scene: G.scene,
    atticFound: G.atticFound,
    bloodSteps: G.bloodSteps,
  };
  localStorage.setItem('zzp_save', JSON.stringify(saveData));
  showNotify('游戏已存档');
}

function loadGame() {
  const s = localStorage.getItem('zzp_save');
  if (!s) {
    showNotify('没有存档');
    return false;
  }
  
  try {
    const d = JSON.parse(s);
    G.sanity = d.sanity;
    G.hope = d.hope;
    G.items = d.items;
    G.flags = d.flags || {};
    G.chapter = d.chapter;
    G.scene = d.scene;
    G.atticFound = d.atticFound || { photo: false, letter: false, key: false };
    G.bloodSteps = d.bloodSteps || 0;
    
    updateStatus();
    dom.systemMenu.classList.remove('show');
    fadeToScene(G.scene, () => {
      showNotify('读档成功');
    });
    return true;
  } catch (e) {
    showNotify('读档失败');
    return false;
  }
}

function hasSavedGame() {
  return !!localStorage.getItem('zzp_save');
}

// ===== 导出模块 =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { G, resetGameState, changeSanity, changeHope, addItem, saveGame, loadGame, hasSavedGame };
}
