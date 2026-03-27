// ===== 纸扎铺 v5.0 - 模块化重构版 =====
// 主入口文件，整合所有模块

'use strict';

// ===== 按依赖顺序加载模块 =====
// 1. 状态管理 (无依赖)
let dom = {};

// 2. 音效 (依赖 G)
let AC = null;
let _rainNode = null;
let _bgmTimer = null;

function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  return AC;
}

function playTone(freq, type, dur, vol = 0.15, delay = 0) {
  if (G.muted) return;
  try {
    const ac = getAC();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
    o.start(ac.currentTime + delay);
    o.stop(ac.currentTime + delay + dur + 0.05);
  } catch (e) {}
}

function playCoinSound() {
  if (G.muted) return;
  try {
    const ac = getAC();
    [880, 1100, 660].forEach((f, i) => playTone(f, 'sine', 0.3, 0.18, i * 0.06));
    playTone(440, 'triangle', 0.5, 0.08, 0.1);
  } catch (e) {}
}

function playPaperSound() {
  if (G.muted) return;
  try {
    const ac = getAC();
    const buf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const src = ac.createBufferSource();
    const g = ac.createGain();
    const f = ac.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 2000;
    f.Q.value = 0.5;
    src.buffer = buf;
    src.connect(f);
    f.connect(g);
    g.connect(ac.destination);
    g.gain.setValueAtTime(0.2, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
    src.start();
    src.stop(ac.currentTime + 0.55);
  } catch (e) {}
}

function playRainSound() {
  if (G.muted || _rainNode) return;
  try {
    const ac = getAC();
    const buf = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    const src = ac.createBufferSource();
    const g = ac.createGain();
    const f = ac.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1200;
    src.buffer = buf;
    src.loop = true;
    src.connect(f);
    f.connect(g);
    g.connect(ac.destination);
    g.gain.value = 0.12;
    src.start();
    _rainNode = { src, g };
  } catch (e) {}
}

function stopRainSound() {
  if (_rainNode) {
    try { _rainNode.src.stop(); } catch (e) {}
    _rainNode = null;
  }
}

function playBGM(type) {
  stopBGM();
  if (G.muted) return;
  try {
    const ac = getAC();
    const notes = type === 'shop'
      ? [220, 196, 220, 165, 220, 196, 175]
      : type === 'dream'
      ? [330, 294, 262, 294, 330, 392, 330]
      : [261, 220, 196, 220, 261, 294, 261];
    let t = ac.currentTime;
    notes.forEach((f, i) => {
      playTone(f, 'sine', 0.6, 0.06, t - ac.currentTime + i * 0.7);
    });
    _bgmTimer = setInterval(() => {
      if (G.muted) return;
      let tt = ac.currentTime;
      notes.forEach((f, i) => playTone(f, 'sine', 0.6, 0.06, tt - ac.currentTime + i * 0.7));
    }, notes.length * 700 + 500);
  } catch (e) {}
}

function stopBGM() {
  if (_bgmTimer) {
    clearInterval(_bgmTimer);
    _bgmTimer = null;
  }
}

function playSanitySound() {
  playTone(80, 'sawtooth', 0.8, 0.06);
  playTone(60, 'sawtooth', 1.0, 0.04, 0.1);
}

function playHopeSound() {
  playTone(523, 'sine', 0.2, 0.08);
  playTone(659, 'sine', 0.2, 0.06, 0.1);
}

function playUnlockSound() {
  [440, 494, 523, 587, 659].forEach((f, i) => playTone(f, 'sine', 0.2, 0.1, i * 0.1));
}

function playDispelSound() {
  for (let i = 0; i < 8; i++) {
    playTone(880 + i * 110, 'sine', 0.3 + i * 0.05, 0.07, i * 0.08);
  }
  playTone(440, 'sine', 1.5, 0.12, 0.3);
}

// ===== DOM引用 =====
function initDOM() {
  dom = {
    sanityFill: document.getElementById('sanity-fill'),
    hopeFill: document.getElementById('hope-fill'),
    sanityVal: document.getElementById('sanity-val'),
    hopeVal: document.getElementById('hope-val'),
    dialogueBox: document.getElementById('dialogue-box'),
    speakerName: document.getElementById('speaker-name'),
    dialogueText: document.getElementById('dialogue-text'),
    dialogueArrow: document.getElementById('dialogue-arrow'),
    choicesBox: document.getElementById('choices-box'),
    chapterTitle: document.getElementById('chapter-title'),
    chapterNum: document.getElementById('chapter-num'),
    chapterName: document.getElementById('chapter-name'),
    chapterSub: document.getElementById('chapter-sub'),
    notification: document.getElementById('notification'),
    systemMenu: document.getElementById('system-menu'),
    endingScreen: document.getElementById('ending-screen'),
    endingTitle: document.getElementById('ending-title'),
    endingText: document.getElementById('ending-text'),
    portraitContainer: document.getElementById('portrait-container'),
    portraitEl: document.getElementById('portrait-el'),
    puzzleOverlay: document.getElementById('puzzle-overlay'),
    puzzleTitle: document.getElementById('puzzle-title'),
    puzzleArea: document.getElementById('puzzle-area'),
    rainContainer: document.getElementById('rain-container'),
    flashOverlay: document.getElementById('flash-overlay'),
    fadeOverlay: document.getElementById('fade-overlay'),
    screenCrack: document.getElementById('screen-crack'),
    gameContainer: document.getElementById('game-container'),
  };
}

// ===== 状态更新 =====
function updateStatus() {
  G.sanity = Math.max(0, Math.min(100, G.sanity));
  G.hope = Math.max(0, Math.min(100, G.hope));
  if (dom.sanityFill) {
    dom.sanityFill.style.width = G.sanity + '%';
    dom.hopeFill.style.width = G.hope + '%';
    dom.sanityVal.textContent = G.sanity;
    dom.hopeVal.textContent = G.hope;
  }
  if (G.sanity < 30 && dom.screenCrack) {
    dom.screenCrack.classList.add('show');
  } else if (dom.screenCrack) {
    dom.screenCrack.classList.remove('show');
  }
  if (G.sanity <= 0 && !G.gameOver) triggerBadEnding();
  updateInventory();
}

function updateInventory() {
  const items = ['lantern', 'coin', 'key', 'photo', 'note'];
  items.forEach(k => {
    const el = document.getElementById('inv-' + k);
    if (el) {
      if (G.items[k]) el.classList.add('has-item');
      else el.classList.remove('has-item');
    }
  });
}

function changeSanity(delta) {
  G.sanity += delta;
  if (delta < 0) {
    playSanitySound();
    showNotify(`理智 ${delta}`);
    document.getElementById('game-container').classList.add('sanity-low');
    setTimeout(() => document.getElementById('game-container').classList.remove('sanity-low'), 500);
  }
  updateStatus();
}

function changeHope(delta) {
  G.hope += delta;
  if (delta > 0) {
    playHopeSound();
    showNotify(`希望 +${delta}`);
  }
  updateStatus();
}

function addItem(key, name) {
  G.items[key] = true;
  showNotify(`获得：${name}`, 'item');
  playCoinSound();
  updateInventory();
}

// ===== 通知 =====
let notifyTimer = null;
function showNotify(msg, type = 'default') {
  if (!dom.notification) return;
  dom.notification.textContent = msg;
  dom.notification.className = 'notification show';
  if (type === 'item') dom.notification.classList.add('notification-item');
  if (type === 'warning') dom.notification.classList.add('notification-warning');
  if (notifyTimer) clearTimeout(notifyTimer);
  notifyTimer = setTimeout(() => dom.notification.classList.remove('show'), 2000);
}

// ===== 打字机效果 =====
function typeText(el, text, cb) {
  if (G.typeTimer) { clearInterval(G.typeTimer); G.typeTimer = null; }
  el.textContent = '';
  G.typing = true;
  let i = 0;
  G.typeTimer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(G.typeTimer);
      G.typeTimer = null;
      G.typing = false;
      if (cb) cb();
    }
  }, 38);
}

// ===== 对话系统 =====
function showDialogues(dialogs, onFinish) {
  G.currentDialogs = dialogs;
  G.dialogIdx = 0;
  G._dialogFinish = onFinish || null;
  nextDialogue();
}

function nextDialogue() {
  if (G.typing) {
    if (G.typeTimer) clearInterval(G.typeTimer);
    G.typing = false;
    const d = G.currentDialogs[G.dialogIdx - 1];
    if (d) dom.dialogueText.textContent = d.text;
    return;
  }
  if (G.dialogIdx >= G.currentDialogs.length) {
    hideChoices();
    if (G._dialogFinish) { const f = G._dialogFinish; G._dialogFinish = null; f(); }
    return;
  }
  const d = G.currentDialogs[G.dialogIdx];
  G.dialogIdx++;

  if (d.sanity) changeSanity(d.sanity);
  if (d.hope) changeHope(d.hope);
  if (d.item) addItem(d.item[0], d.item[1]);
  if (d.flag) G.flags[d.flag] = true;
  if (d.flag2) G.flags[d.flag2] = true;
  if (d.sfx === 'paper') playPaperSound();
  if (d.sfx === 'coin') playCoinSound();
  if (d.sfx === 'unlock') playUnlockSound();

  showPortrait(d.portrait || null);
  dom.speakerName.textContent = d.speaker || '';

  if (d.choices) {
    dom.dialogueText.textContent = d.text;
    dom.dialogueArrow.textContent = '';
    showChoices(d.choices);
  } else {
    dom.dialogueArrow.textContent = '▼ 点击继续';
    typeText(dom.dialogueText, d.text);
    hideChoices();
  }
}

function showChoices(choices) {
  dom.choicesBox.innerHTML = '';
  dom.choicesBox.classList.add('show');
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c.text;
    btn.onclick = () => {
      hideChoices();
      if (c.sanity) changeSanity(c.sanity);
      if (c.hope) changeHope(c.hope);
      if (c.flag) G.flags[c.flag] = true;
      if (c.next) showDialogues(c.next, G._dialogFinish);
      else nextDialogue();
    };
    dom.choicesBox.appendChild(btn);
  });
}

function hideChoices() { dom.choicesBox.classList.remove('show'); }

// ===== 立绘 =====
function showPortrait(type) {
  if (!type) { dom.portraitContainer.classList.remove('show'); return; }
  dom.portraitContainer.classList.add('show');
  const el = dom.portraitEl;
  el.innerHTML = '';
  el.className = 'char-portrait cp-' + type;

  const PORTRAIT_IMAGES = {
    chengan: 'images/char-chen-an.jpg',
    zhangyi: 'images/char-zhang-yi.jpg',
    zhanglaotou: 'images/char-zhang-lao.jpg',
  };

  if (PORTRAIT_IMAGES[type]) {
    const img = document.createElement('img');
    img.src = PORTRAIT_IMAGES[type];
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:4px;';
    img.onerror = function () {
      el.innerHTML = '';
      const parts = getPortraitParts(type);
      parts.forEach(p => { const d = document.createElement('div'); d.className = p; el.appendChild(d); });
    };
    el.appendChild(img);
    return;
  }

  const parts = getPortraitParts(type);
  parts.forEach(p => {
    const d = document.createElement('div');
    d.className = p;
    el.appendChild(d);
  });
}

function getPortraitParts(type) {
  if (type === 'chengan') return ['head', 'hair', 'neck', 'eyes', 'mouth', 'body'];
  if (type === 'zhanglaotou') return ['head', 'hair', 'neck', 'eyes', 'beard', 'body'];
  if (type === 'zhangyi') return ['head', 'hair', 'pin', 'neck', 'seal', 'eyes', 'mouth', 'body'];
  if (type === 'grandpa') return ['glow', 'head', 'hair', 'neck', 'eyes', 'body'];
  return [];
}

// ===== 场景切换 =====
function fadeToScene(sceneId, cb) {
  dom.fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    switchScene(sceneId);
    if (cb) cb();
    setTimeout(() => { dom.fadeOverlay.style.opacity = '0'; }, 100);
  }, 650);
}

function switchScene(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('scene-' + id);
  if (s) s.classList.add('active');
  G.scene = id;

  if (id === 'old-tree') { startRain(); playRainSound(); }
  else { stopRain(); stopRainSound(); }

  const shopScenes = ['shop-exterior', 'shop-interior', 'shop-basement', 'dark-room', 'shop-secret'];
  if (shopScenes.includes(id)) playBGM('shop');
  else if (id === 'dream-street') playBGM('dream');
  else stopBGM();

  buildHotspots(id);
}

// ===== 雨效果 =====
function startRain() {
  dom.rainContainer.classList.add('active');
  if (dom.rainContainer.children.length > 0) return;
  for (let i = 0; i < 60; i++) {
    const d = document.createElement('div');
    d.className = 'raindrop';
    d.style.left = Math.random() * 100 + '%';
    d.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';
    d.style.animationDelay = (-Math.random() * 2) + 's';
    d.style.opacity = 0.3 + Math.random() * 0.5;
    d.style.height = (10 + Math.random() * 15) + 'px';
    dom.rainContainer.appendChild(d);
  }
}
function stopRain() { dom.rainContainer.classList.remove('active'); }

// ===== 章节标题 =====
function showChapterTitle(num, name, sub, cb) {
  dom.chapterNum.textContent = num;
  dom.chapterName.textContent = name;
  dom.chapterSub.textContent = sub || '';
  dom.chapterTitle.classList.add('show');
  const handler = () => {
    dom.chapterTitle.classList.remove('show');
    dom.chapterTitle.removeEventListener('click', handler);
    if (cb) cb();
  };
  dom.chapterTitle.addEventListener('click', handler);
}

// ===== 闪白 =====
function flashWhite(cb) {
  dom.flashOverlay.style.opacity = '1';
  setTimeout(() => { dom.flashOverlay.style.opacity = '0'; if (cb) cb(); }, 200);
}

// ===== 系统菜单 =====
function toggleMenu() { dom.systemMenu.classList.toggle('show'); }
function saveGame() {
  localStorage.setItem('zzp_save', JSON.stringify({
    sanity: G.sanity, hope: G.hope, items: G.items,
    flags: G.flags, chapter: G.chapter, scene: G.scene,
    atticFound: G.atticFound, bloodSteps: G.bloodSteps
  }));
  showNotify('游戏已存档');
}
function loadGame() {
  const s = localStorage.getItem('zzp_save');
  if (!s) { showNotify('没有存档'); return; }
  try {
    const d = JSON.parse(s);
    G.sanity = d.sanity; G.hope = d.hope; G.items = d.items;
    G.flags = d.flags || {}; G.chapter = d.chapter; G.scene = d.scene;
    G.atticFound = d.atticFound || { photo: false, letter: false, key: false };
    G.bloodSteps = d.bloodSteps || 0;
    updateStatus();
    dom.systemMenu.classList.remove('show');
    fadeToScene(G.scene, () => { showNotify('读档成功'); });
  } catch (e) { showNotify('读档失败'); }
}

// ===== 坏结局 =====
function triggerBadEnding() {
  G.gameOver = true;
  stopBGM(); stopRainSound();
  playSanitySound();
  setTimeout(() => {
    dom.endingScreen.classList.add('show');
    dom.endingTitle.textContent = '坏结局：融入虚无';
    dom.endingTitle.style.color = '#cc0000';
    dom.endingText.innerHTML = `
      <p>理智耗尽。</p>
      <p>分不清哪个是纸人，哪个是人。</p>
      <p>陈安站在纸扎铺门口，手里拿着一张白纸，不知道从什么时候开始的。</p>
      <p>张老头看了他一眼，没有说话，转过身去，在工作台上取了一支毛笔，</p>
      <p>在白纸上画了一张脸。</p>
      <p>那张脸是陈安的脸。</p>
      <p class="ending-bad">——他成为了纸扎铺的一部分。</p>
    `;
  }, 1000);
}

// ===== 三大结局 =====
function triggerEnding() {
  stopBGM(); stopRainSound();
  playDispelSound();
  const hasKey = G.items.key;
  const s = G.sanity, h = G.hope;
  let title, text, color = 'var(--gold)';

  if (s >= 80 && h >= 80 && hasKey) {
    title = '结局三：守护者';
    text = `陈安继承了那把归魂钥匙，成为张记纸扎铺新的"知情人"。<br><br>
      他回城市处理好工作，然后回来，把老宅收拾出来住着。<br>
      清溪镇还有些旧账没有彻底清算，还有些魂还在路上，需要有人在这里，点着灯，等着。<br><br>
      张意说，这份差事又苦又不挣钱。<br>
      他说，我知道。<br>
      她说，那你为什么——<br>
      他说，<strong>你在这里。</strong><br><br>
      她看了他很久，说了一个字：傻。<br>
      然后转身进了铺子，没有关门。<br><br>
      <span class="ending-good">——灯笼的光，从此没有熄灭过。</span>`;
    color = '#ffd700';
  } else if (h >= 60) {
    title = '结局二：留下';
    text = `陈安请了长假，住进老宅，开始整理奶奶留下的东西。<br><br>
      他和张老头学了一些纸扎的手艺，笨拙但认真。<br>
      他没有想太多未来，只是每天早上，院子里会多一杯茶——<br>
      放在门口的石阶上，没有说是谁放的，<br>
      但那杯茶永远是热的。<br><br>
      <span class="ending-good">——清溪镇的溪还是干的，但院子里的彼岸花，年年都开。</span>`;
    color = '#55aaff';
  } else if (s >= 80 && h < 40) {
    title = '结局一：离开';
    text = `陈安处理完一切，选择回到城市。<br><br>
      清溪镇的事是一段插曲，他把铜钱留在了槐树下，<br>
      在火车上不再回头看。<br><br>
      只是偶尔，他会想起某个人颈后的符文，<br>
      想起某个伞举在他头顶的雨夜。<br>
      他不知道他遗落在那里的，是不是有些什么。<br><br>
      深夜里，他有时候会听见纸张的声音——<br>
      <span class="ending-neutral">没有风，但纸在动。</span>`;
    color = '#aaaaaa';
  } else {
    title = '结局二：留下';
    text = `陈安留了下来。<br><br>
      没有很多理由，只是觉得，这里还有事没完。<br>
      每天早上院子里多一杯茶，没人说是谁放的，但那杯茶永远是热的。<br><br>
      <span class="ending-good">——清溪镇还在，灯还亮着。</span>`;
    color = '#55aaff';
  }

  setTimeout(() => {
    dom.endingScreen.classList.add('show');
    dom.endingTitle.textContent = title;
    dom.endingTitle.style.color = color;
    dom.endingText.innerHTML = text;
  }, 1500);
}

// ===== 谜题系统 =====
function openPuzzle(type) {
  G.inPuzzle = true;
  dom.puzzleOverlay.classList.add('show');
  buildPuzzle(type);
}

function closePuzzle() {
  G.inPuzzle = false;
  dom.puzzleOverlay.classList.remove('show');
  dom.puzzleArea.innerHTML = '';
}

function closePuzzleCancel() {
  if (G.inPuzzle) { changeSanity(-5); closePuzzle(); }
}

function buildPuzzle(type) {
  dom.puzzleArea.innerHTML = '';
  if (type === 'lantern') buildLanternPuzzle();
  else if (type === 'brick') buildBrickPuzzle();
  else if (type === 'blood') buildBloodPuzzle();
  else if (type === 'attic') buildAtticPuzzle();
}

// 谜题1：铜钱挂灯
function buildLanternPuzzle() {
  dom.puzzleTitle.textContent = '梦境·灯笼';
  const wrap = document.createElement('div');
  wrap.id = 'lantern-puzzle';
  wrap.innerHTML = `
    <div class="lantern-container">
      <div class="lantern-glow"></div>
      <div id="dream-lantern" class="lantern-body ${G.items.coin ? 'can-use' : ''}" onclick="useCoinOnLantern()">
        <div class="lantern-top"></div>
        <div class="lantern-middle"></div>
        <div class="lantern-bottom"></div>
        <div class="lantern-tassel"></div>
      </div>
    </div>
    <p class="puzzle-hint">${G.items.coin ? '铜钱在手中……将它挂上灯笼' : '你没有铜钱，无法点亮前路'}</p>
    <button class="brick-btn puzzle-giveup" onclick="closePuzzleCancel()">放弃离开（理智-10）</button>
  `;
  dom.puzzleArea.appendChild(wrap);
}

function useCoinOnLantern() {
  if (!G.items.coin) { showNotify('你没有铜钱'); changeSanity(-10); closePuzzle(); return; }
  flashWhite();
  playCoinSound();
  const hint = document.querySelector('.puzzle-hint');
  if (hint) hint.innerHTML = '<span class="coin-animate">🪙</span> 铜钱触到灯笼穗……';
  setTimeout(() => {
    G.flags.lantern_solved = true;
    closePuzzle();
    changeSanity(-5);
    changeHope(15);
    showDialogues(DIALOGS.ch2_dream_solved, () => fadeToScene('old-house-hall', () => startCh2End()));
  }, 1200);
}

// 谜题2：七块砖
function buildBrickPuzzle() {
  dom.puzzleTitle.textContent = '地下室·七块砖机关';
  G.puzzleState = { selected: null, moved: 0, phase: 'select' };
  const wrap = document.createElement('div');
  wrap.id = 'brick-puzzle';
  const row = document.createElement('div');
  row.id = 'brick-row';
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement('div');
    b.className = 'brick' + (i === 7 ? ' glow' : '');
    b.dataset.idx = i;
    b.textContent = i;
    b.onclick = () => selectBrick(i, b);
    row.appendChild(b);
  }
  const inst = document.createElement('div');
  inst.id = 'brick-instruction';
  inst.textContent = '砖缝里透着蓝光……数一数，哪块砖不一样？';
  const btn = document.createElement('button');
  btn.className = 'brick-btn'; btn.textContent = '放弃';
  btn.onclick = () => { changeSanity(-5); closePuzzle(); };
  wrap.appendChild(row); wrap.appendChild(inst); wrap.appendChild(btn);
  dom.puzzleArea.appendChild(wrap);
}

function selectBrick(idx, el) {
  const phase = G.puzzleState.phase;
  if (phase === 'select') {
    if (idx === 7) {
      document.querySelectorAll('.brick').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      G.puzzleState.selected = idx;
      G.puzzleState.phase = 'move';
      document.getElementById('brick-instruction').textContent = '第七块！现在，向右移动几格？';
      const row = document.getElementById('brick-row');
      row.innerHTML = '';
      [1, 2, 3, 4, 5].forEach(n => {
        const b = document.createElement('div');
        b.className = 'brick brick-move'; b.textContent = n + '格';
        b.onclick = () => moveBrick(n);
        row.appendChild(b);
      });
    } else {
      changeSanity(-5);
      showNotify('不对，重来');
    }
  }
}

function moveBrick(n) {
  if (n === 3) {
    G.puzzleState.phase = 'press';
    document.getElementById('brick-instruction').textContent = '对了！向右三格。现在——按下去。';
    document.getElementById('brick-row').innerHTML = '';
    const b = document.createElement('div');
    b.className = 'brick brick-press'; b.textContent = '▼ 按下去';
    b.onclick = pressBrick;
    document.getElementById('brick-row').appendChild(b);
  } else {
    changeSanity(-5);
    showNotify('格数不对，重来');
    buildBrickPuzzle();
  }
}

function pressBrick() {
  playUnlockSound();
  flashWhite();
  G.flags.brick_solved = true;
  closePuzzle();
  changeHope(10);
  showDialogues(DIALOGS.ch3_darkroom_enter, () => startDarkRoom());
}

// 谜题3：认亲血符
function buildBloodPuzzle() {
  dom.puzzleTitle.textContent = '老槐树下·认亲血符';
  G.bloodSteps = 0;
  const wrap = document.createElement('div');
  wrap.id = 'blood-puzzle';
  wrap.innerHTML = `
    <p class="blood-hint">煞就在身后……用血，在地上画认亲符。</p>
    <div id="blood-steps"></div>
    <canvas id="blood-canvas" width="220" height="220"></canvas>
    <button class="brick-btn puzzle-giveup" onclick="closePuzzle();changeSanity(-20)">逃跑（放弃）</button>
  `;
  dom.puzzleArea.appendChild(wrap);
  renderBloodSteps();
  initBloodCanvas();
}

function renderBloodSteps() {
  const steps = [
    '① 划破手心',
    '② 画：一横一竖',
    '③ 画：一个圆，中间写「家」',
    '④ 呼唤：太太太爷爷，我是陈安'
  ];
  const el = document.getElementById('blood-steps');
  if (!el) return;
  el.innerHTML = '';
  steps.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'blood-step';
    if (i < G.bloodSteps) d.classList.add('done');
    else if (i === G.bloodSteps) d.classList.add('active');
    d.textContent = s;
    if (i === G.bloodSteps) d.onclick = () => doBloodStep(i);
    el.appendChild(d);
  });
}

function initBloodCanvas() {
  const c = document.getElementById('blood-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a0a08';
  ctx.fillRect(0, 0, 220, 220);
  ctx.strokeStyle = 'rgba(204, 0, 0, 0.3)';
  ctx.strokeRect(2, 2, 216, 216);
}

function doBloodStep(i) {
  G.bloodSteps++;
  renderBloodSteps();
  const c = document.getElementById('blood-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 3;
  ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 10;
  if (i === 0) {
    ctx.beginPath(); ctx.moveTo(90, 110); ctx.lineTo(130, 110); ctx.stroke();
    playCoinSound();
  } else if (i === 1) {
    ctx.beginPath(); ctx.moveTo(60, 110); ctx.lineTo(160, 110); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(110, 60); ctx.lineTo(110, 160); ctx.stroke();
  } else if (i === 2) {
    ctx.beginPath(); ctx.arc(110, 110, 55, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#cc0000'; ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('家', 110, 110);
  } else if (i === 3) {
    completeBloodPuzzle();
    return;
  }
  if (G.bloodSteps >= 4) completeBloodPuzzle();
}

function completeBloodPuzzle() {
  flashWhite();
  playDispelSound();
  const seal = document.getElementById('blood-seal');
  if (seal) seal.style.display = 'block';
  G.flags.blood_solved = true;
  closePuzzle();
  showDialogues(DIALOGS.epilogue_dispel, () => triggerEnding());
}

// 谜题4：阁楼寻物
function buildAtticPuzzle() {
  dom.puzzleTitle.textContent = '老宅阁楼·翻找旧物';
  const wrap = document.createElement('div');
  wrap.id = 'attic-puzzle';
  wrap.innerHTML = `
    <p class="attic-hint">阁楼里落满灰尘的木箱……翻找三次。</p>
    <div class="attic-boxes" id="attic-boxes"></div>
    <div id="attic-msg" class="attic-msg"></div>
    <button class="brick-btn" onclick="closePuzzle()">离开阁楼</button>
  `;
  dom.puzzleArea.appendChild(wrap);
  renderAtticBoxes();
}

function renderAtticBoxes() {
  const el = document.getElementById('attic-boxes');
  if (!el) return;
  el.innerHTML = '';
  const items = [
    { k: 'photo', label: '旧照片', found: G.atticFound.photo, msg: '一张泛黄的黑白照片——陈志明，1967年，清溪。他和你有一双一模一样的眼睛。', sfx: 'paper' },
    { k: 'letter', label: '残信', found: G.atticFound.letter, msg: '信纸已经脆到轻碰即碎，隐约辨认出：张记、契约、三代……', sfx: null },
    { k: 'key', label: '铜钥匙', found: G.atticFound.key, msg: '一把铜制钥匙，錾着莲花纹样，刻着两个字：归魂。', sfx: 'coin' },
  ];
  items.forEach(it => {
    const d = document.createElement('div');
    d.className = 'attic-box' + (it.found ? ' found' : '');
    d.textContent = it.found ? '✓' + it.label : '?';
    if (!it.found) d.onclick = () => findAtticItem(it);
    el.appendChild(d);
  });
}

function findAtticItem(it) {
  if (it.sfx === 'paper') playPaperSound();
  if (it.sfx === 'coin') playCoinSound();
  G.atticFound[it.k] = true;
  const msgEl = document.getElementById('attic-msg');
  if (msgEl) msgEl.textContent = it.msg;
  if (it.k === 'photo') { G.items.photo = true; addItem('photo', '爷爷照片'); G.flags.found_photo = true; }
  if (it.k === 'key') { G.items.key = true; addItem('key', '归魂钥匙'); G.flags.found_key = true; changeSanity(-5); }
  renderAtticBoxes();
  if (G.atticFound.photo && G.atticFound.letter && G.atticFound.key) {
    setTimeout(() => {
      closePuzzle();
      showDialogues(DIALOGS.ch3_attic_done, () => fadeToScene('shop-interior', () => startCh3ZhangYi()));
    }, 1200);
  }
}

// ===== 灯笼互动 =====
function useLantern() {
  if (G.items.lantern) { changeSanity(5); showNotify('灯笼温暖了你的心——理智+5'); }
}

// ===== 对话数据 =====
const DIALOGS = window.DIALOGS;

// ===== 热区系统 =====
const HOTSPOT_CONFIG = window.HOTSPOT_CONFIG;

function buildHotspots(sceneId) {
  if (G._hotspotsBuilt && G._hotspotsBuilt[sceneId]) return;
  const cfg = HOTSPOT_CONFIG[sceneId];
  if (!cfg) return;
  const scene = document.getElementById('scene-' + sceneId);
  if (!scene) return;
  cfg.forEach(h => {
    const existing = document.getElementById(h.id);
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'hotspot'; el.id = h.id;
    el.style.cssText = h.style + ';position:absolute;';
    const lbl = document.createElement('span');
    lbl.className = 'hotspot-label'; lbl.textContent = h.label;
    el.appendChild(lbl);
    el.addEventListener('click', h.action);
    scene.appendChild(el);
  });
  if (!G._hotspotsBuilt) G._hotspotsBuilt = {};
  G._hotspotsBuilt[sceneId] = true;
}

function activateHotspots(scene) {
  document.querySelectorAll('#scene-' + scene + ' .hotspot').forEach(h => {
    h.style.pointerEvents = 'all';
  });
}

// ===== 章节流程 =====
function startTitle() { switchScene('title'); dom.dialogueBox.style.display = 'none'; }

function startChapter1() {
  dom.dialogueBox.style.display = '';
  showChapterTitle('第一章', '归　乡', '奶奶突然去世，清溪镇五年后再归', () => {
    fadeToScene('town-entrance', () => {
      showDialogues(DIALOGS.ch1_train, () => {
        showDialogues(DIALOGS.ch1_town, () => {
          activateHotspots('town-entrance');
        });
      });
    });
  });
}

function onFlowersExplored() {
  G.flags.flowers_explored = true;
  fadeToScene('old-house-yard', () => {
    showDialogues(DIALOGS.ch1_yard, () => {
      showDialogues(DIALOGS.ch1_meet_zhangyi, () => {
        setTimeout(() => {
          showDialogues(DIALOGS.ch1_night_shadow, () => {
            showDialogues(DIALOGS.ch1_paperdoll, () => {
              startChapter2();
            });
          });
        }, 800);
      });
    });
  });
}

function startChapter2() {
  showChapterTitle('第二章', '纸人入梦', '铜钱与梦境的秘密', () => {
    fadeToScene('uncle-room', () => {
      showDialogues(DIALOGS.ch2_uncle, () => {
        fadeToScene('shop-exterior', () => {
          showDialogues(DIALOGS.ch2_shop_enter, () => {
            showDialogues(DIALOGS.ch2_shop_coin, () => {
              fadeToScene('shop-exterior', () => {
                showDialogues(DIALOGS.ch2_meet_zhangyi2, () => {
                  fadeToScene('dream-street', () => {
                    showDialogues(DIALOGS.ch2_dream, () => {
                      openPuzzle('lantern');
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function startCh2End() { startChapter3(); }

function startChapter3() {
  showChapterTitle('第三章', '阴　宅', '阁楼的秘密，七块砖后的真相', () => {
    fadeToScene('attic', () => {
      showDialogues(DIALOGS.ch3_attic_enter, () => {
        openPuzzle('attic');
      });
    });
  });
}

function startCh3ZhangYi() {
  showDialogues(DIALOGS.ch3_zhangyi_secret, () => {
    fadeToScene('shop-basement', () => {
      showDialogues(DIALOGS.ch3_basement, () => {
        openPuzzle('brick');
      });
    });
  });
}

function startDarkRoom() {
  fadeToScene('dark-room', () => {
    showDialogues(DIALOGS.ch3_open_lock, () => {
      flashWhite(() => {
        fadeToScene('shop-interior', () => {
          showDialogues(DIALOGS.ch3_run_out, () => {
            startChapter4();
          });
        });
      });
    });
  });
}

function startChapter4() {
  showChapterTitle('第四章', '真　相', '六十年的秘密，一家人的执念', () => {
    fadeToScene('shop-secret', () => {
      showDialogues(DIALOGS.ch4_morning, () => {
        showDialogues(DIALOGS.ch4_truth_room, () => {
          showDialogues(DIALOGS.ch4_sha_origin, () => {
            startEpilogue();
          });
        });
      });
    });
  });
}

function startEpilogue() {
  showChapterTitle('终　章', '选　择', '中元节，雨，槐树下的认亲', () => {
    fadeToScene('old-tree', () => {
      showDialogues(DIALOGS.epilogue_rain, () => {
        showDialogues(DIALOGS.epilogue_sha_encounter, () => {
          showDialogues(DIALOGS.epilogue_run, () => {
            showDialogues(DIALOGS.epilogue_blood_prompt, () => {
              openPuzzle('blood');
            });
          });
        });
      });
    });
  });
}

function startOpenLock() {
  if (!G.items.key) { showNotify('你需要归魂钥匙'); return; }
  showDialogues(DIALOGS.ch3_open_lock, () => {
    flashWhite(() => {
      fadeToScene('shop-interior', () => {
        showDialogues(DIALOGS.ch3_run_out, () => startChapter4());
      });
    });
  });
}

// ===== 重置游戏 =====
function restartGame() {
  G.sanity = 80; G.hope = 60;
  G.items = { lantern: true, note: false, coin: false, key: false, photo: false };
  G.flags = {}; G.chapter = 0; G.gameOver = false;
  G.atticFound = { photo: false, letter: false, key: false };
  G.bloodSteps = 0;
  G._hotspotsBuilt = {};
  dom.endingScreen.classList.remove('show');
  dom.systemMenu.classList.remove('show');
  stopBGM(); stopRainSound();
  updateStatus();
  startTitle();
}

// ===== 键盘快捷键 =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleMenu();
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveGame(); }
  if (e.ctrlKey && e.key === 'l') { e.preventDefault(); loadGame(); }
  if (e.key === 'm' || e.key === 'M') {
    G.muted = !G.muted;
    showNotify(G.muted ? '音效已关闭' : '音效已开启');
    if (G.muted) { stopBGM(); stopRainSound(); }
  }
  if ((e.key === ' ' || e.key === 'Enter') && !G.inPuzzle) {
    nextDialogue();
  }
});

// ===== 初始化 =====
window.addEventListener('load', () => {
  initDOM();
  updateStatus();

  document.getElementById('menu-btn').onclick = toggleMenu;
  document.getElementById('btn-save').onclick = saveGame;
  document.getElementById('btn-load').onclick = loadGame;
  document.getElementById('btn-restart').onclick = restartGame;
  document.getElementById('btn-mute').onclick = () => {
    G.muted = !G.muted;
    document.getElementById('btn-mute').textContent = G.muted ? '开启音效' : '关闭音效';
    showNotify(G.muted ? '音效已关闭' : '音效已开启');
  };
  document.getElementById('btn-close-menu').onclick = () => dom.systemMenu.classList.remove('show');
  document.getElementById('ending-restart').onclick = restartGame;
  document.getElementById('inv-lantern').onclick = useLantern;

  dom.dialogueBox.addEventListener('click', (e) => {
    e.preventDefault();
    if (!G.inPuzzle) nextDialogue();
  });

  dom.chapterTitle.addEventListener('click', (e) => {
    e.preventDefault();
    if (dom.chapterTitle.classList.contains('show')) {
      dom.chapterTitle.classList.remove('show');
    }
  });

  // 阁楼点击进入谜题
  document.getElementById('scene-attic').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('attic-box') || e.target.closest('.attic-box')) return;
    if (!G.inPuzzle && G.scene === 'attic' && !G.flags.attic_done) {
      openPuzzle('attic');
    }
  });

  startTitle();
});
