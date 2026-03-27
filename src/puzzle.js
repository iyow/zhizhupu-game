// ===== 纸扎铺 - 谜题系统 =====

'use strict';

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
  if (G.inPuzzle) {
    changeSanity(-5);
    closePuzzle();
  }
}

function buildPuzzle(type) {
  dom.puzzleArea.innerHTML = '';
  if (type === 'lantern') buildLanternPuzzle();
  else if (type === 'brick') buildBrickPuzzle();
  else if (type === 'blood') buildBloodPuzzle();
  else if (type === 'attic') buildAtticPuzzle();
}

// ===== 谜题1：铜钱挂灯 =====
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
  if (!G.items.coin) {
    showNotify('你没有铜钱');
    changeSanity(-10);
    closePuzzle();
    return;
  }
  flashWhite();
  playCoinSound();

  const coinHint = document.querySelector('.puzzle-hint');
  if (coinHint) coinHint.innerHTML = '<span class="coin-animate">🪙</span> 铜钱触到灯笼穗……';

  setTimeout(() => {
    G.flags.lantern_solved = true;
    closePuzzle();
    changeSanity(-5);
    changeHope(15);
    showDialogues(DIALOGS.ch2_dream_solved, () => fadeToScene('old-house-hall', () => startCh2End()));
  }, 1200);
}

// ===== 谜题2：七块砖 =====
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
  btn.className = 'brick-btn';
  btn.textContent = '放弃';
  btn.onclick = () => {
    changeSanity(-5);
    closePuzzle();
  };

  wrap.appendChild(row);
  wrap.appendChild(inst);
  wrap.appendChild(btn);
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
        b.className = 'brick brick-move';
        b.textContent = n + '格';
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
    b.className = 'brick brick-press';
    b.textContent = '▼ 按下去';
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

// ===== 谜题3：认亲血符 =====
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
  ctx.strokeStyle = '#cc0000';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 10;

  if (i === 0) {
    ctx.beginPath();
    ctx.moveTo(90, 110);
    ctx.lineTo(130, 110);
    ctx.stroke();
    playCoinSound();
  } else if (i === 1) {
    ctx.beginPath();
    ctx.moveTo(60, 110);
    ctx.lineTo(160, 110);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(110, 60);
    ctx.lineTo(110, 160);
    ctx.stroke();
  } else if (i === 2) {
    ctx.beginPath();
    ctx.arc(110, 110, 55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
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

// ===== 谜题4：阁楼寻物 =====
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
    {
      k: 'photo',
      label: '旧照片',
      found: G.atticFound.photo,
      msg: '一张泛黄的黑白照片——陈志明，1967年，清溪。他和你有一双一模一样的眼睛。',
      sfx: 'paper'
    },
    {
      k: 'letter',
      label: '残信',
      found: G.atticFound.letter,
      msg: '信纸已经脆到轻碰即碎，隐约辨认出：张记、契约、三代……',
      sfx: null
    },
    {
      k: 'key',
      label: '铜钥匙',
      found: G.atticFound.key,
      msg: '一把铜制钥匙，錾着莲花纹样，刻着两个字：归魂。',
      sfx: 'coin'
    },
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

  if (it.k === 'photo') {
    G.items.photo = true;
    addItem('photo', '爷爷照片');
    G.flags.found_photo = true;
  }
  if (it.k === 'key') {
    G.items.key = true;
    addItem('key', '归魂钥匙');
    G.flags.found_key = true;
    changeSanity(-5);
  }

  renderAtticBoxes();

  if (G.atticFound.photo && G.atticFound.letter && G.atticFound.key) {
    setTimeout(() => {
      closePuzzle();
      showDialogues(DIALOGS.ch3_attic_done, () => fadeToScene('shop-interior', () => startCh3ZhangYi()));
    }, 1200);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openPuzzle, closePuzzle, closePuzzleCancel, buildPuzzle,
    buildLanternPuzzle, useCoinOnLantern,
    buildBrickPuzzle, selectBrick, moveBrick, pressBrick,
    buildBloodPuzzle, renderBloodSteps, doBloodStep, completeBloodPuzzle,
    buildAtticPuzzle, renderAtticBoxes, findAtticItem
  };
}
