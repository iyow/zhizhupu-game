// ===== 纸扎铺 完整版 v4.0 =====
// 基于小说原著忠实还原

'use strict';

// ===== 游戏状态 =====
const G = {
  sanity: 80, hope: 60,
  items: { lantern:true, note:false, coin:false, key:false, photo:false },
  flags: {},
  chapter: 0, scene: 'title',
  dialogIdx: 0, currentDialogs: [],
  inPuzzle: false, puzzleState: {},
  brickSelected: null, brickMoveCount: 0,
  bloodSteps: 0,
  atticFound: { photo:false, letter:false, key:false },
  gameOver: false,
  muted: false,
  typing: false, typeTimer: null,
};

// ===== 音效系统 (Web Audio API) =====
let AC = null;
function getAC() { if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)(); return AC; }

function playTone(freq, type, dur, vol=0.15, delay=0) {
  if(G.muted) return;
  try {
    const ac = getAC();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime+delay);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime+delay+0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+delay+dur);
    o.start(ac.currentTime+delay);
    o.stop(ac.currentTime+delay+dur+0.05);
  } catch(e){}
}

function playCoinSound() {
  if(G.muted) return;
  try {
    const ac = getAC();
    // 铜钱清脆落地声
    [880,1100,660].forEach((f,i) => playTone(f,'sine',0.3,0.18,i*0.06));
    playTone(440,'triangle',0.5,0.08,0.1);
  } catch(e){}
}

function playPaperSound() {
  if(G.muted) return;
  try {
    const ac = getAC();
    // 纸张沙沙声：白噪音
    const buf = ac.createBuffer(1, ac.sampleRate*0.5, ac.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*0.3;
    const src = ac.createBufferSource();
    const g = ac.createGain();
    const f = ac.createBiquadFilter();
    f.type='bandpass'; f.frequency.value=2000; f.Q.value=0.5;
    src.buffer=buf; src.connect(f); f.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0.2,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.5);
    src.start(); src.stop(ac.currentTime+0.55);
  } catch(e){}
}

function playRainSound() {
  if(G.muted || G._rainNode) return;
  try {
    const ac = getAC();
    const buf = ac.createBuffer(1, ac.sampleRate*3, ac.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
    const src = ac.createBufferSource();
    const g = ac.createGain();
    const f = ac.createBiquadFilter();
    f.type='lowpass'; f.frequency.value=1200;
    src.buffer=buf; src.loop=true;
    src.connect(f); f.connect(g); g.connect(ac.destination);
    g.gain.value=0.12;
    src.start();
    G._rainNode={src,g};
  } catch(e){}
}

function stopRainSound() {
  if(G._rainNode) {
    try { G._rainNode.src.stop(); } catch(e){}
    G._rainNode=null;
  }
}

function playBGM(type) {
  stopBGM();
  if(G.muted) return;
  try {
    const ac = getAC();
    const notes = type==='shop'
      ? [220,196,220,165,220,196,175]
      : type==='dream'
      ? [330,294,262,294,330,392,330]
      : [261,220,196,220,261,294,261];
    let t = ac.currentTime;
    notes.forEach((f,i) => {
      playTone(f,'sine',0.6,0.06, t-ac.currentTime+i*0.7);
    });
    G._bgmTimer = setInterval(()=>{
      if(G.muted) return;
      let tt = ac.currentTime;
      notes.forEach((f,i) => playTone(f,'sine',0.6,0.06,tt-ac.currentTime+i*0.7));
    }, notes.length*700+500);
  } catch(e){}
}

function stopBGM() {
  if(G._bgmTimer) { clearInterval(G._bgmTimer); G._bgmTimer=null; }
}

function playSanitySound() {
  playTone(80,'sawtooth',0.8,0.06);
  playTone(60,'sawtooth',1.0,0.04,0.1);
}

function playHopeSound() {
  playTone(523,'sine',0.2,0.08);
  playTone(659,'sine',0.2,0.06,0.1);
}

function playUnlockSound() {
  [440,494,523,587,659].forEach((f,i)=>playTone(f,'sine',0.2,0.1,i*0.1));
}

function playDispelSound() {
  // 煞消散：清脆扩散
  for(let i=0;i<8;i++) {
    playTone(880+i*110,'sine',0.3+i*0.05,0.07,i*0.08);
  }
  playTone(440,'sine',1.5,0.12,0.3);
}

// ===== DOM引用 =====
let dom = {};
function initDOM() {
  dom = {
    sanityFill: document.getElementById('sanity-fill'),
    hopeFill: document.getElementById('hope-fill'),
    sanityVal: document.getElementById('sanity-val'),
    hopeVal: document.getElementById('hope-val'),
    invLantern: document.getElementById('inv-lantern'),
    invCoin: document.getElementById('inv-coin'),
    invKey: document.getElementById('inv-key'),
    invPhoto: document.getElementById('inv-photo'),
    invNote: document.getElementById('inv-note'),
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
  };
}

// ===== 状态更新 =====
function updateStatus() {
  G.sanity = Math.max(0, Math.min(100, G.sanity));
  G.hope = Math.max(0, Math.min(100, G.hope));
  if(dom.sanityFill) {
    dom.sanityFill.style.width = G.sanity+'%';
    dom.hopeFill.style.width = G.hope+'%';
    dom.sanityVal.textContent = G.sanity;
    dom.hopeVal.textContent = G.hope;
  }
  // 裂缝效果
  if(G.sanity < 30 && dom.screenCrack) dom.screenCrack.classList.add('show');
  else if(dom.screenCrack) dom.screenCrack.classList.remove('show');
  // 坏结局检查
  if(G.sanity <= 0 && !G.gameOver) triggerBadEnding();
  // 物品栏
  updateInventory();
}

function updateInventory() {
  const items = ['lantern','coin','key','photo','note'];
  items.forEach(k => {
    const el = document.getElementById('inv-'+k);
    if(el) {
      if(G.items[k]) el.classList.add('has-item');
      else el.classList.remove('has-item');
    }
  });
}

function changeSanity(delta) {
  G.sanity += delta;
  if(delta < 0) {
    playSanitySound();
    if(dom.notification) showNotify(`理智 ${delta}`);
    document.getElementById('game-container').classList.add('sanity-low');
    setTimeout(()=>document.getElementById('game-container').classList.remove('sanity-low'),500);
  }
  updateStatus();
}

function changeHope(delta) {
  G.hope += delta;
  if(delta > 0) {
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

// ===== 通知 =====
let notifyTimer = null;
function showNotify(msg) {
  if(!dom.notification) return;
  dom.notification.textContent = msg;
  dom.notification.classList.add('show');
  if(notifyTimer) clearTimeout(notifyTimer);
  notifyTimer = setTimeout(()=>dom.notification.classList.remove('show'), 2000);
}

// ===== 打字机效果 =====
function typeText(el, text, cb) {
  if(G.typeTimer) { clearInterval(G.typeTimer); G.typeTimer=null; }
  el.textContent = '';
  G.typing = true;
  let i = 0;
  G.typeTimer = setInterval(()=>{
    el.textContent += text[i];
    i++;
    if(i >= text.length) {
      clearInterval(G.typeTimer);
      G.typeTimer = null;
      G.typing = false;
      if(cb) cb();
    }
  }, 38);
}

// ===== 对话系统 =====
// 对话格式: {speaker, text, portrait, choices, onEnd, sanity, hope, item, flag, puzzle}
function showDialogues(dialogs, onFinish) {
  G.currentDialogs = dialogs;
  G.dialogIdx = 0;
  G._dialogFinish = onFinish || null;
  nextDialogue();
}

function nextDialogue() {
  if(G.typing) {
    // 跳过打字
    if(G.typeTimer) clearInterval(G.typeTimer);
    G.typing = false;
    const d = G.currentDialogs[G.dialogIdx-1];
    if(d) dom.dialogueText.textContent = d.text;
    return;
  }
  if(G.dialogIdx >= G.currentDialogs.length) {
    // 对话结束
    hideChoices();
    if(G._dialogFinish) { const f=G._dialogFinish; G._dialogFinish=null; f(); }
    return;
  }
  const d = G.currentDialogs[G.dialogIdx];
  G.dialogIdx++;

  // 状态效果
  if(d.sanity) changeSanity(d.sanity);
  if(d.hope) changeHope(d.hope);
  if(d.item) addItem(d.item[0], d.item[1]);
  if(d.flag) G.flags[d.flag] = true;
  if(d.sfx === 'paper') playPaperSound();
  if(d.sfx === 'coin') playCoinSound();
  if(d.sfx === 'unlock') playUnlockSound();

  // 立绘
  showPortrait(d.portrait || null);

  // 说话者
  dom.speakerName.textContent = d.speaker || '';

  // 文字
  if(d.choices) {
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
      if(c.sanity) changeSanity(c.sanity);
      if(c.hope) changeHope(c.hope);
      if(c.flag) G.flags[c.flag] = true;
      if(c.next) showDialogues(c.next, G._dialogFinish);
      else nextDialogue();
    };
    dom.choicesBox.appendChild(btn);
  });
}

function hideChoices() { dom.choicesBox.classList.remove('show'); }

// ===== 立绘 =====
function showPortrait(type) {
  if(!type) { dom.portraitContainer.classList.remove('show'); return; }
  dom.portraitContainer.classList.add('show');
  const el = dom.portraitEl;
  el.innerHTML = '';
  el.className = 'char-portrait cp-'+type;
  const parts = getPortraitParts(type);
  parts.forEach(p => {
    const d = document.createElement('div');
    d.className = p;
    el.appendChild(d);
  });
}

function getPortraitParts(type) {
  if(type==='chengan') return ['head','hair','neck','eyes','mouth','body'];
  if(type==='zhanglaotou') return ['head','hair','neck','eyes','beard','body'];
  if(type==='zhangyi') return ['head','hair','pin','neck','seal','eyes','mouth','body'];
  if(type==='grandpa') return ['glow','head','hair','neck','eyes','body'];
  return [];
}

// ===== 场景切换 =====
function fadeToScene(sceneId, cb) {
  dom.fadeOverlay.style.opacity = '1';
  setTimeout(()=>{
    switchScene(sceneId);
    if(cb) cb();
    setTimeout(()=>{ dom.fadeOverlay.style.opacity='0'; }, 100);
  }, 650);
}

function switchScene(id) {
  document.querySelectorAll('.scene').forEach(s=>s.classList.remove('active'));
  const s = document.getElementById('scene-'+id);
  if(s) s.classList.add('active');
  G.scene = id;
  // 雨效果
  if(id==='old-tree') { startRain(); playRainSound(); }
  else { stopRain(); stopRainSound(); }
  // BGM
  if(['shop-exterior','shop-interior','shop-basement','dark-room','shop-secret'].includes(id)) playBGM('shop');
  else if(id==='dream-street') playBGM('dream');
  else stopBGM();
}

// ===== 雨效果 =====
function startRain() {
  dom.rainContainer.classList.add('active');
  if(dom.rainContainer.children.length>0) return;
  for(let i=0;i<60;i++) {
    const d=document.createElement('div');
    d.className='raindrop';
    d.style.left=Math.random()*100+'%';
    d.style.animationDuration=(0.6+Math.random()*0.8)+'s';
    d.style.animationDelay=(-Math.random()*2)+'s';
    d.style.opacity=0.3+Math.random()*0.5;
    d.style.height=(10+Math.random()*15)+'px';
    dom.rainContainer.appendChild(d);
  }
}
function stopRain() { dom.rainContainer.classList.remove('active'); }

// ===== 章节标题 =====
function showChapterTitle(num, name, sub, cb) {
  dom.chapterNum.textContent = num;
  dom.chapterName.textContent = name;
  dom.chapterSub.textContent = sub||'';
  dom.chapterTitle.classList.add('show');
  dom.chapterTitle.onclick = ()=>{
    dom.chapterTitle.classList.remove('show');
    dom.chapterTitle.onclick=null;
    if(cb) cb();
  };
}

// ===== 闪白 =====
function flashWhite(cb) {
  dom.flashOverlay.style.opacity='1';
  setTimeout(()=>{ dom.flashOverlay.style.opacity='0'; if(cb) cb(); },200);
}

// ===== 系统菜单 =====
function toggleMenu() {
  dom.systemMenu.classList.toggle('show');
}
function saveGame() {
  localStorage.setItem('zzp_save', JSON.stringify({
    sanity:G.sanity, hope:G.hope, items:G.items,
    flags:G.flags, chapter:G.chapter, scene:G.scene
  }));
  showNotify('游戏已存档');
}
function loadGame() {
  const s = localStorage.getItem('zzp_save');
  if(!s) { showNotify('没有存档'); return; }
  const d = JSON.parse(s);
  Object.assign(G, d);
  updateStatus();
  dom.systemMenu.classList.remove('show');
  fadeToScene(G.scene, ()=>{ showNotify('读档成功'); });
}

// ===== 坏结局 =====
function triggerBadEnding() {
  G.gameOver = true;
  stopBGM(); stopRainSound();
  playSanitySound();
  setTimeout(()=>{
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
      <p style="color:#cc0000;margin-top:16px;">——他成为了纸扎铺的一部分。</p>
    `;
  }, 1000);
}

// ===== 三大结局 =====
function triggerEnding() {
  stopBGM(); stopRainSound();
  playDispelSound();
  const hasKey = G.items.key;
  const s = G.sanity, h = G.hope;
  let title, text, color='var(--gold)';

  if(s >= 80 && h >= 80 && hasKey) {
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
      <span style="color:var(--lantern)">——灯笼的光，从此没有熄灭过。</span>`;
    color = '#ffd700';
  } else if(h >= 60) {
    title = '结局二：留下';
    text = `陈安请了长假，住进老宅，开始整理奶奶留下的东西。<br><br>
      他和张老头学了一些纸扎的手艺，笨拙但认真。<br>
      他没有想太多未来，只是每天早上，院子里会多一杯茶——<br>
      放在门口的石阶上，没有说是谁放的，<br>
      但那杯茶永远是热的。<br><br>
      <span style="color:var(--lantern)">——清溪镇的溪还是干的，但院子里的彼岸花，年年都开。</span>`;
    color = '#55aaff';
  } else if(s >= 80 && h < 40) {
    title = '结局一：离开';
    text = `陈安处理完一切，选择回到城市。<br><br>
      清溪镇的事是一段插曲，他把铜钱留在了槐树下，<br>
      在火车上不再回头看。<br><br>
      只是偶尔，他会想起某个人颈后的符文，<br>
      想起某个伞举在他头顶的雨夜。<br>
      他不知道他遗落在那里的，是不是有些什么。<br><br>
      深夜里，他有时候会听见纸张的声音——<br>
      <span style="color:#888">没有风，但纸在动。</span>`;
    color = '#aaaaaa';
  } else {
    // 默认：留下
    title = '结局二：留下';
    text = `陈安留了下来。<br><br>
      没有很多理由，只是觉得，这里还有事没完。<br>
      每天早上院子里多一杯茶，没人说是谁放的，但那杯茶永远是热的。<br><br>
      <span style="color:var(--lantern)">——清溪镇还在，灯还亮着。</span>`;
    color = '#55aaff';
  }

  setTimeout(()=>{
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

function buildPuzzle(type) {
  dom.puzzleArea.innerHTML = '';
  if(type==='lantern') buildLanternPuzzle();
  else if(type==='brick') buildBrickPuzzle();
  else if(type==='blood') buildBloodPuzzle();
  else if(type==='attic') buildAtticPuzzle();
}

// 谜题1：铜钱挂灯
function buildLanternPuzzle() {
  dom.puzzleTitle.textContent = '梦境·灯笼';
  const wrap = document.createElement('div');
  wrap.id = 'lantern-puzzle';
  wrap.innerHTML = `
    <p style="color:#888;font-size:13px">梦境街道上，一盏旧灯笼在风中摇动……</p>
    <div id="dream-lantern" onclick="useCoinOnLantern()">
      <div class="lantern-body"></div>
      <div class="lantern-tassel"></div>
    </div>
    <div id="coin-hint">${G.items.coin ? '🪙 使用铜钱（渡）' : '⚠ 你没有铜钱'}</div>
    <button class="brick-btn" onclick="closePuzzle()">放弃离开（理智-10）</button>
  `;
  dom.puzzleArea.appendChild(wrap);
  if(!G.items.coin) {
    document.getElementById('dream-lantern').style.cursor='default';
    document.getElementById('dream-lantern').onclick=null;
  }
}

function useCoinOnLantern() {
  if(!G.items.coin) {
    showNotify('你没有铜钱');
    changeSanity(-10);
    closePuzzle();
    return;
  }
  flashWhite();
  playCoinSound();
  document.getElementById('coin-hint').innerHTML = '<span class="coin-on-lantern">🪙</span> 铜钱触到灯笼穗……';
  setTimeout(()=>{
    G.flags.lantern_solved = true;
    closePuzzle();
    changeSanity(-5);
    changeHope(15);
    // 继续第二章梦境对话
    showDialogues(DIALOGS.ch2_dream_solved, ()=>fadeToScene('old-house-hall', ()=>startCh2End()));
  }, 1200);
}

// 谜题2：七块砖
function buildBrickPuzzle() {
  dom.puzzleTitle.textContent = '地下室·七块砖机关';
  G.puzzleState = { selected:null, moved:0, phase:'select' };
  const wrap = document.createElement('div');
  wrap.id='brick-puzzle';
  const row = document.createElement('div');
  row.id='brick-row';
  for(let i=1;i<=10;i++) {
    const b=document.createElement('div');
    b.className='brick'+(i===7?' glow':'');
    b.dataset.idx=i;
    b.textContent=i;
    b.onclick=()=>selectBrick(i,b);
    row.appendChild(b);
  }
  const inst=document.createElement('div');
  inst.id='brick-instruction';
  inst.textContent='砖缝里透着蓝光……数一数，哪块砖不一样？';
  const btn=document.createElement('button');
  btn.className='brick-btn'; btn.textContent='放弃';
  btn.onclick=()=>{ changeSanity(-5); closePuzzle(); };
  wrap.appendChild(row); wrap.appendChild(inst); wrap.appendChild(btn);
  dom.puzzleArea.appendChild(wrap);
}

function selectBrick(idx,el) {
  const phase=G.puzzleState.phase;
  if(phase==='select') {
    if(idx===7) {
      document.querySelectorAll('.brick').forEach(b=>b.classList.remove('selected'));
      el.classList.add('selected');
      G.puzzleState.selected=idx;
      G.puzzleState.phase='move';
      document.getElementById('brick-instruction').textContent='第七块！现在，向右移动几格？';
      // 换成移动按钮
      const row=document.getElementById('brick-row');
      row.innerHTML='';
      [1,2,3,4,5].forEach(n=>{
        const b=document.createElement('div');
        b.className='brick'; b.textContent=n+'格';
        b.onclick=()=>moveBrick(n);
        row.appendChild(b);
      });
    } else {
      changeSanity(-5);
      showNotify('不对，重来');
    }
  }
}

function moveBrick(n) {
  if(n===3) {
    G.puzzleState.phase='press';
    document.getElementById('brick-instruction').textContent='对了！向右三格。现在——按下去。';
    document.getElementById('brick-row').innerHTML='';
    const b=document.createElement('div');
    b.className='brick'; b.style.width='120px'; b.textContent='▼ 按下去';
    b.onclick=pressBrick;
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
  G.flags.brick_solved=true;
  closePuzzle();
  changeHope(10);
  showDialogues(DIALOGS.ch3_darkroom_enter, ()=>startDarkRoom());
}

// 谜题3：认亲血符
function buildBloodPuzzle() {
  dom.puzzleTitle.textContent = '老槐树下·认亲血符';
  G.bloodSteps=0;
  const wrap=document.createElement('div');
  wrap.id='blood-puzzle';
  wrap.innerHTML=`
    <p style="color:#888;font-size:13px">煞就在身后……用血，在地上画认亲符。</p>
    <div id="blood-steps"></div>
    <canvas id="blood-canvas" width="200" height="200"></canvas>
    <button class="brick-btn" onclick="closePuzzle();changeSanity(-20)">逃跑（放弃）</button>
  `;
  dom.puzzleArea.appendChild(wrap);
  renderBloodSteps();
  initBloodCanvas();
}

function renderBloodSteps() {
  const steps=[
    '① 划破手心',
    '② 画：一横一竖',
    '③ 画：一个圆，中间写「家」',
    '④ 呼唤：太太太爷爷，我是陈安'
  ];
  const el=document.getElementById('blood-steps');
  if(!el) return;
  el.innerHTML='';
  steps.forEach((s,i)=>{
    const d=document.createElement('div');
    d.className='blood-step'+(i<G.bloodSteps?' done':i===G.bloodSteps?' active':'');
    d.textContent=s;
    if(i===G.bloodSteps) d.onclick=()=>doBloodStep(i);
    el.appendChild(d);
  });
}

function initBloodCanvas() {
  const c=document.getElementById('blood-canvas');
  if(!c) return;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#0a0a08';
  ctx.fillRect(0,0,200,200);
  ctx.strokeStyle='rgba(204,0,0,0.3)';
  ctx.strokeRect(0,0,200,200);
}

function doBloodStep(i) {
  G.bloodSteps++;
  renderBloodSteps();
  const c=document.getElementById('blood-canvas');
  if(!c) return;
  const ctx=c.getContext('2d');
  ctx.strokeStyle='#cc0000'; ctx.lineWidth=2;
  ctx.shadowColor='#ff0000'; ctx.shadowBlur=8;
  if(i===0) { // 划手心
    ctx.beginPath(); ctx.moveTo(80,100); ctx.lineTo(120,100); ctx.stroke();
    playCoinSound();
  } else if(i===1) { // 一横一竖
    ctx.beginPath(); ctx.moveTo(60,100); ctx.lineTo(140,100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(100,60); ctx.lineTo(100,140); ctx.stroke();
  } else if(i===2) { // 圆+家
    ctx.beginPath(); ctx.arc(100,100,50,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#cc0000'; ctx.font='24px serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('家',100,100);
  } else if(i===3) { // 呼唤
    completeBloodPuzzle();
    return;
  }
  if(G.bloodSteps>=4) completeBloodPuzzle();
}

function completeBloodPuzzle() {
  flashWhite();
  playDispelSound();
  G.flags.blood_solved=true;
  closePuzzle();
  showDialogues(DIALOGS.epilogue_dispel, ()=>triggerEnding());
}

// 谜题4：阁楼寻物
function buildAtticPuzzle() {
  dom.puzzleTitle.textContent = '老宅阁楼·翻找旧物';
  const wrap=document.createElement('div');
  wrap.id='attic-puzzle';
  wrap.innerHTML=`
    <p style="color:#888;font-size:13px">阁楼里落满灰尘的木箱……翻找三次。</p>
    <div class="attic-boxes" id="attic-boxes"></div>
    <div id="attic-msg" style="color:var(--text);font-size:13px;text-align:center;min-height:40px"></div>
    <button class="brick-btn" onclick="closePuzzle()">离开阁楼</button>
  `;
  dom.puzzleArea.appendChild(wrap);
  renderAtticBoxes();
}

function renderAtticBoxes() {
  const el=document.getElementById('attic-boxes');
  if(!el) return;
  el.innerHTML='';
  const items=[
    {k:'photo',label:'旧照片',found:G.atticFound.photo,msg:'一张泛黄的黑白照片——陈志明，1967年，清溪。他和你有一双一模一样的眼睛。',sfx:'paper'},
    {k:'letter',label:'残信',found:G.atticFound.letter,msg:'信纸已经脆到轻碰即碎，隐约辨认出：张记、契约、三代……'},
    {k:'key',label:'铜钥匙',found:G.atticFound.key,msg:'一把铜制钥匙，錾着莲花纹样，刻着两个字：归魂。'},
  ];
  items.forEach(it=>{
    const d=document.createElement('div');
    d.className='attic-box';
    d.textContent=it.found?'✓'+it.label:'?';
    if(!it.found) d.onclick=()=>findAtticItem(it);
    else d.style.opacity='0.5';
    el.appendChild(d);
  });
}

function findAtticItem(it) {
  if(it.sfx) playPaperSound();
  G.atticFound[it.k]=true;
  document.getElementById('attic-msg').textContent=it.msg;
  if(it.k==='photo') { G.items.photo=true; addItem('photo','爷爷照片'); G.flags.found_photo=true; }
  if(it.k==='key') { G.items.key=true; addItem('key','归魂钥匙'); G.flags.found_key=true; changeSanity(-5); }
  renderAtticBoxes();
  if(G.atticFound.photo && G.atticFound.letter && G.atticFound.key) {
    setTimeout(()=>{
      closePuzzle();
      showDialogues(DIALOGS.ch3_attic_done, ()=>fadeToScene('shop-interior',()=>startCh3ZhangYi()));
    },1200);
  }
}

// ===== 灯笼互动 =====
function useLantern() {
  if(G.items.lantern) { changeSanity(5); showNotify('灯笼温暖了你的心——理智+5'); }
}

// ===== 对话数据 =====
const DIALOGS = {

// 第一章：归乡
ch1_train: [
  {speaker:'', text:'高铁在傍晚驶入醴陵境内，窗外的天色已经压得很低。一排排水杉从视野里掠过，叶子是那种沉闷的暗绿，像是被什么东西捂死了颜色。'},
  {speaker:'陈安（内心）', text:'奶奶从来不生病。她能在院子里扛起一袋五十斤的稻谷，能在三伏天里不喝水劳作半天。然后……突发心疾，安详离世。', sanity:-0},
  {speaker:'陈安（内心）', text:'安详。我默念这个词，舌根发苦。'},
  {speaker:'叔父（电话）', text:'你回来一趟吧，有些东西得你来处理。……纸扎的事。', portrait:null},
  {speaker:'陈安（内心）', text:'纸扎的事。这四个字让我想起童年时的一个傍晚——那年七岁，跟着奶奶去张记纸扎铺……'},
  {speaker:'奶奶（记忆）', text:'开了光的东西，你就当没看见。'},
],

ch1_town: [
  {speaker:'', text:'清溪镇。这名字骗了许多外地人，以为是山清水秀之地。其实清溪的溪早已干了十几年，只剩一条浅浅的泥沟。'},
  {speaker:'陈安（内心）', text:'路灯是旧式的黄钨灯，光圈昏黄模糊，把地面照出一种溺水前的颜色。叔父没来接我。'},
],

ch1_flowers: [
  {speaker:'陈安（内心）', text:'奇怪……这短短一段路上，竟有七个花圈，挂在七户人家门口。', sanity:-5},
  {speaker:'陈安（内心）', text:'中元节还有三天，花圈是正常的，但……七个，连续七户。我在心里划了一条线——这条线通向某个还不知道的答案。'},
],

ch1_yard: [
  {speaker:'', text:'老宅的大门开着。院子里的气味扑面而来——香灰、旧木、还有一种说不清楚的甜腻，像是什么东西在腐烂前散发出的最后气息。'},
  {speaker:'陈安（内心）', text:'堂屋里点着灵烛，奶奶的遗像摆在正中，黑白照片里的她表情严肃，一如生前。'},
],

ch1_meet_zhangyi: [
  {speaker:'张意', text:'你来了。', portrait:'zhangyi'},
  {speaker:'陈安', text:'你是……', portrait:'chengan'},
  {speaker:'张意', text:'我是张意。张老头是我爷爷。陈奶奶去世前几个月，一直是我在帮着照应。你叔父……不大方便。', portrait:'zhangyi'},
  {speaker:'陈安', text:'不大方便是什么意思？', portrait:'chengan'},
  {speaker:'张意', text:'你叔父这几个月精神一直不太好，你明天见到他就知道了。', portrait:'zhangyi'},
  {speaker:'陈安（内心）', text:'她转身去拨弄灵烛，细白的手指捏住烛剪，动作利落。烛火跳了一下——她颈后，竹簪下方，有一个很小的符文，朱砂所写，只有铜钱大小。', flag:'found_seal'},
  {speaker:'陈安（内心）', text:'我以为我看错了。'},
],

ch1_night_shadow: [
  {speaker:'', text:'老屋的木床很旧，被子有一股阳光和艾草的气味。陈安把脸埋进去，想起小时候常常钻进这被子里躲猫猫——', sanity:-0},
  {speaker:'', text:'梦里只有一扇门。红漆的，门缝里透着红色的光，不像灯，像是里面有什么东西在烧。门上有字，是刻的——'},
  {speaker:'', text:'门轰然洞开了。里面是一片白。白得没有边际，白得像一张铺开的宣纸。那片宣纸上，有一个人影，蜷缩着……', sanity:-5},
  {speaker:'', text:'那个人影抬起头。是奶奶的脸。但那张脸是纸做的。', sanity:-10},
  {speaker:'陈安（内心）', text:'惊叫着坐起来，汗把睡衣浸透了。窗外深夜，月光冷白照进来，照在门缝里——'},
  {speaker:'', text:'门缝里有一条阴影。细长的，不动的。像是有人贴着门站在外面。', sanity:-15, flag:'first_night_shadow', sfx:'paper'},
  {speaker:'陈安（内心）', text:'我盯着那条阴影看了很久很久，直到月亮转过去，光消失，阴影也跟着消失。整个夜晚没有风，但有纸张被吹动的声音。'},
],

ch1_paperdoll: [
  {speaker:'', text:'第二天一早，院子里发现了一个纸人——放在水缸旁边，就那么站着，像是趁夜放进来的。', sanity:-10, sfx:'paper'},
  {speaker:'陈安（内心）', text:'诡异的是，这个纸人穿的衣服，和奶奶遗像里的那件一模一样。纸人手里夹着一张小纸条……'},
  {speaker:'奶奶的字条', text:'「安儿，莫要进那铺子。」', item:['note','奶奶的字条']},
  {speaker:'陈安（内心）', text:'我握着那张纸条站起来，背后有什么东西凉凉地爬上了脊梁。远处，张记纸扎铺的招牌隐约可见，红灯笼在无风的清晨里，轻轻地摇。'},
],

// 第二章：纸人入梦
ch2_uncle: [
  {speaker:'', text:'陈安找到叔父的时候，他正坐在堂屋角落里叠纸。不是叠元宝，是叠人。'},
  {speaker:'陈安（内心）', text:'一个一个的纸人，叠好了就摆在地板上，已经有七八个了，排列得整齐到令人不安。', sanity:-5},
  {speaker:'陈安', text:'叔父。', portrait:'chengan'},
  {speaker:'叔父陈国生', text:'安儿。你来了。', portrait:null},
  {speaker:'陈安', text:'你怎么了？', portrait:'chengan'},
  {speaker:'叔父陈国生', text:'没事。睡不好，就叠叠纸，心里踏实些。'},
  {speaker:'陈安', text:'院子里出现了一个纸人，是你放的吗？', portrait:'chengan'},
  {speaker:'叔父陈国生', text:'不是我，是张老头。'},
  {speaker:'陈安', text:'为什么他要在院子里放纸人？', portrait:'chengan'},
  {speaker:'叔父陈国生', text:'……安儿，你奶奶死得不对。'},
  {speaker:'陈安', text:'你说什么？', portrait:'chengan'},
  {speaker:'叔父陈国生', text:'她死之前，来找过我。她说她看见了东西。夜里，院子里，有纸人在走。不是摆着的，是……走着的。'},
  {speaker:'陈安（内心）', text:'空气突然变凉了几度。', sanity:-5},
  {speaker:'叔父陈国生', text:'然后我说她老糊涂了，让她别多想。然后过了三天，她死了。'},
  {speaker:'叔父陈国生', text:'张老头知道些什么。你去找他，但你要小心。那个铺子……夜里不要进去。'},
  {speaker:'陈安', text:'为什么？', portrait:'chengan'},
  {speaker:'叔父陈国生', text:'因为夜里那里头的东西会醒着。'},
],

ch2_shop_enter: [
  {speaker:'', text:'张记纸扎铺，大白天。陈安告诉自己，大白天没什么好怕的。'},
  {speaker:'', text:'铺子里的陈设和记忆里没有本质的区别，只是更旧、更满。香灰、糊浆、还有一种说不清楚的陈旧，像是时间的尸体泡在这个空间里慢慢发酵。', sfx:'paper'},
  {speaker:'张老头', text:'进来吧，陈安。', portrait:'zhanglaotou'},
  {speaker:'陈安（内心）', text:'他没有转头——怎么知道是我？走进去，绕到正面，低头去看他手里那个纸人……体型、身高，和我一模一样，脸还是白茫茫的。'},
  {speaker:'陈安', text:'这是……', portrait:'chengan'},
  {speaker:'张老头', text:'练手的。坐。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'我奶奶是怎么死的？', portrait:'chengan'},
  {speaker:'张老头', text:'心疾。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'您和我叔父说的不一样。', portrait:'chengan'},
  {speaker:'张老头', text:'你叔父说什么了？', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'他说她死前看见院子里有会走路的纸人。', portrait:'chengan'},
  {speaker:'张老头', text:'那不是幻觉。', portrait:'zhanglaotou'},
  {speaker:'陈安（内心）', text:'这四个字把我钉在了椅子上。', sanity:-5},
  {speaker:'陈安', text:'您的意思是，纸人真的会走？', portrait:'chengan'},
  {speaker:'张老头', text:'不是所有的。只有开了光的。', portrait:'zhanglaotou'},
  {speaker:'陈安（内心）', text:'那个词——开了光。奶奶说的话从记忆深处浮上来：「开了光的东西，你就当没看见。」'},
  {speaker:'陈安', text:'谁给它们开的光？', portrait:'chengan'},
],

ch2_shop_coin: [
  {speaker:'陈安', text:'张爷爷，奶奶留字条让我不要来这铺子，但字条是用纸人传的——说明她不怕纸人，是在借纸人给我传话。这说明……她和您有约定。', portrait:'chengan'},
  {speaker:'张老头', text:'你比我预料的聪明些。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'告诉我真相。', portrait:'chengan'},
  {speaker:'张老头', text:'不是现在。', portrait:'zhanglaotou'},
  {speaker:'陈安（内心）', text:'他站起来，走到货架旁边，从抽屉里取出一个用黑布包着的东西，递给我……里面是一枚铜钱，穿着红线，正面年号模糊，背面刻着一个字：渡。', item:['coin','铜钱（渡）'], sfx:'coin'},
  {speaker:'张老头', text:'今晚你会做梦，梦里有一盏灯，你把这个挂在灯上，你就能出来。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'这是什么？', portrait:'chengan'},
  {speaker:'张老头', text:'救命的东西。走吧，天黑之前离开这里。', portrait:'zhanglaotou'},
],

ch2_meet_zhangyi2: [
  {speaker:'', text:'离开铺子时，在门口遇见了张意。她换了件衣服，还是素净的颜色，手里捧着一盏小灯笼，里面点着细蜡烛。'},
  {speaker:'张意', text:'出来了？', portrait:'zhangyi'},
  {speaker:'陈安', text:'出来了。你也住在铺子附近？', portrait:'chengan'},
  {speaker:'张意', text:'我住在铺子后面，陪我爷爷。', portrait:'zhangyi'},
  {speaker:'张意', text:'陈安。昨晚那个纸人……是我放的。字条是陈奶奶生前给我的，她说，如果她先走了，就让我想办法传给你。我只是在完成她的托付。', portrait:'zhangyi'},
  {speaker:'陈安', text:'谢谢。', portrait:'chengan'},
  {speaker:'陈安（内心）', text:'她的眼神很平静，但那平静的后面有什么东西在流动，深的，不该在这种场合出现的东西。'},
  {speaker:'', text:'那天夜里，陈安果然做梦了。而这一次，梦里出现的不是奶奶，是一整个世界。'},
],

ch2_dream: [
  {speaker:'', text:'梦境是一条街道，但不是清溪镇的街道。街道两边是纸做的建筑，全部白色，但白色里透着光，像是有火在里面燃烧，把纸照成了半透明的琥珀色。'},
  {speaker:'陈安（内心）', text:'街道上有纸人，但这些纸人有动作，有节奏，有某种精确的、类似生命的东西在驱动着它们。', sanity:-5},
  {speaker:'陈安（内心）', text:'我站在街道中央，知道自己在做梦，却走不动。然后我看见了那盏灯——就像张老头说的，一盏灯，挂在一根木杆上，在风里摇。'},
  {speaker:'陈安（内心）', text:'灯笼是红色的，破旧的，火苗在里面跳。我握着铜钱，走过去……'},
],

ch2_dream_solved: [
  {speaker:'', text:'铜钱触到灯笼穗子的瞬间，整个梦境轰然震动——', sfx:'coin'},
  {speaker:'', text:'那些纸人同时停下来，同时转过头，同时看向陈安——一百张白色的脸，一百双黑色的眼睛。', sanity:-10},
  {speaker:'', text:'一个纸人从人群里走出来，缓缓地，走向陈安……那张脸是真实的，不是纸。'},
  {speaker:'奶奶', text:'安儿，你找到了对的人。但那个铺子里有个秘密，是张家欠我们陈家的债。你爷爷……你爷爷没有死透。', hope:20, flag:'grandpa_not_dead'},
  {speaker:'陈安', text:'奶奶，爷爷在哪里——', portrait:'chengan'},
  {speaker:'', text:'梦醒了。窗外，鸡叫了第一声。手心里那枚铜钱烫得像刚从火里取出来。', sanity:-5, sfx:'coin'},
  {speaker:'陈安（内心）', text:'「你爷爷没有死透」——这句话在空荡荡的老屋里回响，撞在墙壁上，撞进骨髓里。'},
],

// 第三章：阴宅
ch3_attic_enter: [
  {speaker:'', text:'老宅阁楼，低矮，只有一扇小窗透光。满地灰尘，若干旧木箱落满了蛛网。'},
  {speaker:'陈安（内心）', text:'那个最旧的木箱，在最深处……'},
],

ch3_attic_done: [
  {speaker:'陈安（内心）', text:'照片里那双眼睛——那是我自己的眼睛，一模一样的眼睛。陈志明，1967年，清溪。', hope:10, flag:'found_photo'},
  {speaker:'陈安（内心）', text:'残信辨认出几个词——「张记」、「契约」、「三代」。拼图开始拼出形状了，但形状让我不寒而栗。'},
  {speaker:'陈安（内心）', text:'归魂钥匙。拿着这把钥匙，我去找了张意——不是张老头，而是张意。不知为何，我觉得她说的是真话。'},
],

ch3_zhangyi_secret: [
  {speaker:'张意', text:'坐下，我跟你说。这要从六十年前说起。', portrait:'zhangyi'},
  {speaker:'张意', text:'你爷爷陈志明，和我曾祖父张德昌，是结拜兄弟。', portrait:'zhangyi'},
  {speaker:'张意', text:'那时候镇上来了一个煞——不是比喻，就是那种老人说的、能害人的东西。连续三年，镇子里死了十几个人，没有病因，人就这样没了。', portrait:'zhangyi'},
  {speaker:'张意', text:'我曾祖父懂些民俗，知道怎么压——但代价是，要用人的魂魄来锁。不是死人的魂魄，是活人的一缕魂。', portrait:'zhangyi'},
  {speaker:'陈安', text:'……', portrait:'chengan'},
  {speaker:'张意', text:'你爷爷自愿的。他说他是结拜兄哥，这种事他来。他让出了自己的一缕魂，被封进了一个纸扎的宅子里——就是我曾祖父亲手做的那个阴宅。', portrait:'zhangyi'},
  {speaker:'张意', text:'然后……他用剩下的魂撑着活了大概三年，就走了。走得不完整，那一缕魂还在里面。', portrait:'zhangyi'},
  {speaker:'陈安', text:'那把钥匙——能开那个纸宅的锁。', portrait:'chengan'},
  {speaker:'张意', text:'对。钥匙原本在你奶奶手里。她临终前藏了起来，留给你。', portrait:'zhangyi'},
  {speaker:'陈安', text:'那个纸宅在哪里？', portrait:'chengan'},
  {speaker:'张意', text:'陈安，那个纸宅里的东西，不只是你爷爷的魂。还有那个煞——它一直在里面，等着出来。如果你打开那把锁，它会跟着你爷爷一起出来。', portrait:'zhangyi'},
  {speaker:'陈安', text:'……我想见我爷爷。', portrait:'chengan'},
],

ch3_basement: [
  {speaker:'', text:'张记纸扎铺地下室，深夜。低矮空间，石砖地面，潮湿发凉。砖缝里透着幽蓝的磷光，不像火，更像是荧光菌，幽微而持续。', sfx:'paper'},
  {speaker:'陈安（内心）', text:'张意给的线索：数第七块砖，右移三格，按下去。'},
  {speaker:'陈安（内心）', text:'只有灯笼的光圈照着……砖墙前，我数了一遍又一遍。'},
],

ch3_darkroom_enter: [
  {speaker:'', text:'机关古老而精准。砖墙的一角转开，露出一道窄门。', sfx:'unlock'},
  {speaker:'', text:'暗室不大，但里面的东西让人喉咙发紧——满屋子的纸宅，大大小小，摞得很高，每一个贴着名字和年份。', sanity:-5},
  {speaker:'陈安（内心）', text:'最新的纸宅，黄纸上的日期是三个月前——陈桂英。奶奶的名字。'},
  {speaker:'陈安（内心）', text:'不是封存，是……登记。有人在给那个煞喂魂。', sanity:-20, flag:'found_feihun'},
  {speaker:'陈安（内心）', text:'那个最旧的纸宅，比别的都要精细，门窗俱全，甚至有雕花……黄纸上写着：陈志明，一九七一年。'},
],

ch3_open_lock: [
  {speaker:'陈安', text:'（将归魂钥匙插入莲花铜锁）', portrait:'chengan', sfx:'unlock'},
  {speaker:'', text:'钥匙入锁的瞬间，暗室温度骤降，呼出来的气变成白雾。灯笼里的火苗几乎熄灭，然后重新燃起——但光的颜色变了，从暖黄变成了冷蓝。'},
  {speaker:'', text:'纸宅的门，自己开了。里面什么都没有，只有黑暗。但那黑暗是会呼吸的。', sanity:-10},
  {speaker:'陈安', text:'爷爷。是我，陈安。奶奶让我来的。', portrait:'chengan'},
  {speaker:'', text:'黑暗里什么都没有发生……他等了很久，久到以为什么都不会发生了——'},
  {speaker:'爷爷陈志明', text:'……出去，快跑。', portrait:'grandpa', hope:10, flag:'grandpa_appeared'},
  {speaker:'', text:'暗室的墙壁开始颤抖。那些摞得很高的纸宅开始摇晃，黄纸如雪飘落。那种沙沙声——不是轻微的，是巨大的，像一千张纸同时被揉皱。', sanity:-10, sfx:'paper', flag:'sha_escaped'},
  {speaker:'陈安（内心）', text:'出去，快跑。不是警告，是保护。'},
],

ch3_run_out: [
  {speaker:'', text:'他转身跑——跑过暗室，跑上台阶，跑出地下室，跑进铺子里——'},
  {speaker:'', text:'铺子里所有的纸人，都转过来面对着他。全部的。货架上的，地面上的，大的小的，全部转过来，用那些画出来的眼睛，看着他。', sanity:-15},
  {speaker:'陈安（内心）', text:'脚本能地要停下来，但意识一遍遍地喊：跑，跑，快跑。'},
  {speaker:'', text:'冲出铺子，跑到街道中央，大口喘气。身后，铺子里的灯一盏一盏地灭了。然后，黑暗里，两盏门口的红灯笼，在无风的夜里，轻轻地往他的方向摇了摇。'},
  {speaker:'陈安（内心）', text:'像是在跟他打招呼。', hope:5},
  {speaker:'陈安（内心）', text:'他低下头，发现自己已经泪流满面，不知道从什么时候开始的。'},
],

// 第四章：真相
ch4_morning: [
  {speaker:'', text:'他在铺子外面的石阶上坐到天亮。没有地方可以去，不想回老宅，不敢进铺子，就那么坐着，看着黑暗一点一点地被灰白的天光稀释。'},
  {speaker:'张意', text:'你打开了？', portrait:'zhangyi'},
  {speaker:'陈安', text:'打开了。纸人全都转过来看我。', portrait:'chengan'},
  {speaker:'张意', text:'它跑出来了。那个煞。但你爷爷也跑出来了——他是保护你的，不是害你的。那四个字，是他帮你挡住了煞，给你争取了时间。', portrait:'zhangyi'},
  {speaker:'陈安', text:'现在那个煞在哪里？', portrait:'chengan'},
  {speaker:'张意', text:'……', portrait:'zhangyi'},
  {speaker:'陈安', text:'张意，你脖子后面的符文还在吗？', portrait:'chengan'},
  {speaker:'张意', text:'在的。', portrait:'zhangyi'},
  {speaker:'陈安', text:'那个符文是做什么用的？', portrait:'chengan'},
  {speaker:'张意', text:'是封印符，贴在颈后，是为了让里面的东西出不来。', portrait:'zhangyi'},
  {speaker:'陈安', text:'里面，是什么东西？', portrait:'chengan'},
],

ch4_truth_room: [
  {speaker:'', text:'陈安走进铺子最深处，推开那扇总是关着的内门。里面是一间密室，四壁全是纸，上面密密麻麻写满了字——都是名字，都是年份。', sanity:-10},
  {speaker:'张老头', text:'你都想清楚了？', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'差不多。那个煞，不是从外面来的，是你们自己造的——每次封存一个魂，就需要喂那个东西，让它不闹事。那些名字，那些纸宅，不是无辜死去的人，是被喂给它的……', portrait:'chengan'},
  {speaker:'张老头', text:'是祭品。自愿的，没有一个是强迫的。每一个都知道，每一个都签了字。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'我奶奶也是。', portrait:'chengan'},
  {speaker:'张老头', text:'是。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'你们维持了这么多年，为了什么？', portrait:'chengan'},
  {speaker:'张老头', text:'当时我曾祖父以为，封住它，再慢慢找驱散它的办法。但那个东西学会了跟它封进去的魂粘连，粘得太深，你要驱散它，就要同时毁掉那些魂，包括你爷爷的。', portrait:'zhanglaotou'},
  {speaker:'陈安（内心）', text:'所以后来，没有人敢动它。而我奶奶，一辈子都在等一个两全其美的办法。'},
  {speaker:'张老头', text:'你奶奶的名字在那堵墙上——不是封存，是她最后一步棋。她主动选择了死亡，把所有线索留给你，让你走完全程。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'钥匙是她藏的，但不是要阻止我——是要让我来，让我在知道全部真相之后，再做选择。', portrait:'chengan'},
  {speaker:'张老头', text:'你奶奶说，驱散之法是化解执念。那个煞的本质是执念，找到它的本体，让它的执念得到回应——让它被看见。', portrait:'zhanglaotou'},
],

ch4_sha_origin: [
  {speaker:'张老头', text:'那个煞，是你曾祖父的老友——一个教私塾的先生，因为家人在战乱里失散，带着执念死在了这条街上，死不瞑目，执念化煞。', portrait:'zhanglaotou'},
  {speaker:'张老头', text:'你曾祖父认识他，压它，是因为不忍心驱散他，只想把他关住，等……等找到他的家人。', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'他的家人，找到了吗？', portrait:'chengan'},
  {speaker:'张老头', text:'找到了，又没找到。他的女儿当年走散了，辗转回来，但他已经化煞了，认不出她，只是对所有靠近的人放煞气。她后来嫁到清溪镇，生了孩子……', portrait:'zhanglaotou'},
  {speaker:'陈安', text:'那个女儿的后代，在这里。', portrait:'chengan'},
  {speaker:'张老头', text:'在这间屋子里。你奶奶查了三十年，最后查明白了。那个煞，是你爷爷他奶奶的父亲——就是陈家的祖上。', portrait:'zhanglaotou'},
  {speaker:'陈安（内心）', text:'整个世界转了一圈，在脑子里重新落定。', sanity:-5, hope:20, flag:'know_truth', flag2:'sha_is_family'},
  {speaker:'陈安（内心）', text:'陈安，是那个煞的血脉。他们是一家人。'},
  {speaker:'', text:'现在，是否相信这一切？',
    choices:[
      {text:'「我相信你。」', hope:10, flag:'trust_truth'},
      {text:'「我……不确定。但我会去做。」', sanity:-10},
    ]
  },
],

// 终章：选择
epilogue_rain: [
  {speaker:'', text:'中元节那天，清溪镇下了雨。不是大雨，是那种细密的、连绵的、江南特有的雨，把整座镇子罩在一层灰白的雾气里。'},
  {speaker:'', text:'空气里有烧纸的烟——镇子里好几家门口都点着火盆，纸钱的灰在雨里飞旋，像是无处安放的魂魄在找方向。'},
  {speaker:'张意', text:'方案很简单：分头走，把镇子夹在中间，往槐树方向靠拢。遇见那个东西，就把铜钱丢出去，声音对方能听见。', portrait:'zhangyi'},
  {speaker:'陈安', text:'你不用去，这是我的事。', portrait:'chengan'},
  {speaker:'张意', text:'你不知道那个东西的形态，你一个人出去，遇见它都不一定认得出来。', portrait:'zhangyi'},
  {speaker:'陈安', text:'那它是什么形态？', portrait:'chengan'},
  {speaker:'张意', text:'不定，它会模仿它见过的人。遇见任何人都不能信——只有一个方法能辨认它：它模仿不了符文，看颈后。没有符文的，就是它。', portrait:'zhangyi'},
  {speaker:'陈安', text:'好。', portrait:'chengan'},
],

epilogue_sha_encounter: [
  {speaker:'', text:'陈安走进雨里，衣服很快就湿了。走过老宅，走过药材铺，走过好几户挂着花圈的门口——'},
  {speaker:'', text:'迎面遇见了叔父。他呆呆地站在雨里，雨水顺着头发流下来，他也不躲，眼神空洞。'},
  {speaker:'叔父陈国生（？）', text:'安儿。'},
  {speaker:'陈安（内心）', text:'那个笑——嘴角上翘的弧度，不像笑，像是什么东西被钉在了笑的形状里。'},
  {speaker:'陈安', text:'叔父，你认识我吗？', portrait:'chengan'},
  {speaker:'叔父陈国生（？）', text:'认识，你是安儿，你是陈安。'},
  {speaker:'陈安', text:'那你说，你叫什么名字？', portrait:'chengan'},
  {speaker:'', text:'停顿了太长时间。那个叔父的形态慢慢偏了，脸上的笑拉长到人脸不该有的角度，眼睛里的瞳孔扩开，扩成一片黑……', sanity:-10},
  {speaker:'陈安（内心）', text:'这是煞。颈后空的，没有符文。是它。'},
  {speaker:'', text:'陈安把铜钱丢了出去——清脆的一声响在雨里传开。', sfx:'coin'},
  {speaker:'陈安（内心）', text:'然后转身跑。'},
],

epilogue_run: [
  {speaker:'', text:'那个东西追上来的速度很快，不像人跑，更像是空间在身后折叠——每次回头，它就离近了一截，但身后一片空旷，什么都看不见。', sanity:-5},
  {speaker:'', text:'陈安没有停，一直跑，往槐树的方向跑。雨水打在脸上，脚踩在湿滑的青石板上打滑，摔了一跤，爬起来继续跑。'},
  {speaker:'', text:'槐树近了——雨中的老槐树，半截焦黑，半截苍绿，像是分裂成了两个时态的存在。'},
  {speaker:'陈安（内心）', text:'他跑到树下，停下来，转过身。那个东西停了，就停在几步之外，没有形态，但感觉到它在那里——沉的，湿的，充满了某种绵延了六十年的悲哀。'},
],

epilogue_blood_prompt: [
  {speaker:'陈安（内心）', text:'把手心划开，用鲜血在地面上画符。张老头写给我的，我背下来的：一横一竖一个圆，中间是一个「家」字。最古老的符，不是驱邪，是认亲。'},
],

epilogue_dispel: [
  {speaker:'陈安', text:'太太太爷爷，我是陈安，陈志明的孙子，陈家的后代，我在这里。', portrait:'chengan'},
  {speaker:'', text:'雨声很大，声音几乎被淹没了。然后空气里有什么东西变了——'},
  {speaker:'', text:'那个沉重慢慢地松动，像一块压了很久的石头开始移动。那种悲哀的气息开始从重变轻，从浓变淡，像是晨雾遇见了太阳……', hope:30, sanity:10},
  {speaker:'', text:'不是消失，是散开——化进空气里，化进雨里，化进这片他们都生活过的土地里。', flag:'sha_dispersed'},
  {speaker:'张意', text:'成了。', portrait:'zhangyi'},
  {speaker:'陈安', text:'成了。', portrait:'chengan'},
  {speaker:'陈安（内心）', text:'然后他想起了那个漏洞——那个他在出发前没想清楚的逻辑漏洞。'},
  {speaker:'陈安', text:'张意，你颈后的符文，你说是封住里面的东西的。但那个东西在纸宅里，是我打开钥匙才让它跑出来的——那之前，你颈后封住的是什么？', portrait:'chengan'},
  {speaker:'张意', text:'是我自己。', portrait:'zhangyi'},
  {speaker:'陈安', text:'……', portrait:'chengan'},
  {speaker:'张意', text:'我告诉你，张德昌把那个三岁女孩的魂封在了纸人里……那个纸人，就是我。我活了很多年，后来找到了宿体，就是我现在这个形态。颈后的符，是我爷爷刻的，防止我的本质散出来。', portrait:'zhangyi'},
  {speaker:'陈安', text:'那你是……', portrait:'chengan'},
  {speaker:'张意', text:'我是活着的，陈安。我吃饭，我睡觉，我感觉冷和热，我感觉……很多东西。我和你不一样，但我活着。', portrait:'zhangyi'},
  {speaker:'陈安（内心）', text:'她的皮肤是那种半透明的白，她的手是凉的，她在傍晚提着灯笼，她在认真地给纸房子糊云朵形的屋顶，她在夜里把伞举在他头顶……'},
  {speaker:'陈安（内心）', text:'他想了很多，想来想去，最后发现他想到的全部都是她这个人，而不是她的本质。'},
  {speaker:'陈安', text:'我知道。你活着。', portrait:'chengan'},
],
};

// ===== 章节流程 =====

// 标题画面
function startTitle() {
  switchScene('title');
  dom.dialogueBox.style.display='none';
}

// 第一章开始
function startChapter1() {
  dom.dialogueBox.style.display='';
  showChapterTitle('第一章','归　乡','奶奶突然去世，清溪镇五年后再归', ()=>{
    fadeToScene('town-entrance', ()=>{
      showDialogues(DIALOGS.ch1_train, ()=>{
        showDialogues(DIALOGS.ch1_town, ()=>{
          // 开放探索
          activateHotspots('town-entrance');
        });
      });
    });
  });
}

function activateHotspots(scene) {
  document.querySelectorAll('#scene-'+scene+' .hotspot').forEach(h=>h.style.pointerEvents='all');
}

// 七个花圈探索完成
function onFlowersExplored() {
  G.flags.flowers_explored = true;
  fadeToScene('old-house-yard', ()=>{
    showDialogues(DIALOGS.ch1_yard, ()=>{
      showDialogues(DIALOGS.ch1_meet_zhangyi, ()=>{
        // 夜晚：门缝阴影
        setTimeout(()=>{
          showDialogues(DIALOGS.ch1_night_shadow, ()=>{
            // 次日早晨：纸人
            showDialogues(DIALOGS.ch1_paperdoll, ()=>{
              // 第一章结束，进入第二章
              startChapter2();
            });
          });
        }, 800);
      });
    });
  });
}

// 第二章
function startChapter2() {
  showChapterTitle('第二章','纸人入梦','铜钱与梦境的秘密', ()=>{
    fadeToScene('uncle-room', ()=>{
      showDialogues(DIALOGS.ch2_uncle, ()=>{
        fadeToScene('shop-exterior', ()=>{
          showDialogues(DIALOGS.ch2_shop_enter, ()=>{
            showDialogues(DIALOGS.ch2_shop_coin, ()=>{
              fadeToScene('shop-exterior', ()=>{
                showDialogues(DIALOGS.ch2_meet_zhangyi2, ()=>{
                  // 入夜，梦境
                  fadeToScene('dream-street', ()=>{
                    showDialogues(DIALOGS.ch2_dream, ()=>{
                      // 触发铜钱挂灯谜题
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

function startCh2End() {
  startChapter3();
}

// 第三章
function startChapter3() {
  showChapterTitle('第三章','阴　宅','阁楼的秘密，七块砖后的真相', ()=>{
    fadeToScene('attic', ()=>{
      showDialogues(DIALOGS.ch3_attic_enter, ()=>{
        openPuzzle('attic');
      });
    });
  });
}

function startCh3ZhangYi() {
  showDialogues(DIALOGS.ch3_zhangyi_secret, ()=>{
    fadeToScene('shop-basement', ()=>{
      showDialogues(DIALOGS.ch3_basement, ()=>{
        openPuzzle('brick');
      });
    });
  });
}

function startDarkRoom() {
  fadeToScene('dark-room', ()=>{
    showDialogues(DIALOGS.ch3_open_lock, ()=>{
      // 煞逃脱，跑出去
      flashWhite(()=>{
        fadeToScene('shop-interior', ()=>{
          showDialogues(DIALOGS.ch3_run_out, ()=>{
            startChapter4();
          });
        });
      });
    });
  });
}

// 第四章
function startChapter4() {
  showChapterTitle('第四章','真　相','六十年的秘密，一家人的执念', ()=>{
    fadeToScene('shop-secret', ()=>{
      showDialogues(DIALOGS.ch4_morning, ()=>{
        showDialogues(DIALOGS.ch4_truth_room, ()=>{
          showDialogues(DIALOGS.ch4_sha_origin, ()=>{
            startEpilogue();
          });
        });
      });
    });
  });
}

// 终章
function startEpilogue() {
  showChapterTitle('终　章','选　择','中元节，雨，槐树下的认亲', ()=>{
    fadeToScene('old-tree', ()=>{
      showDialogues(DIALOGS.epilogue_rain, ()=>{
        showDialogues(DIALOGS.epilogue_sha_encounter, ()=>{
          showDialogues(DIALOGS.epilogue_run, ()=>{
            showDialogues(DIALOGS.epilogue_blood_prompt, ()=>{
              openPuzzle('blood');
            });
          });
        });
      });
    });
  });
}

// ===== 场景热区配置 =====
const HOTSPOT_CONFIG = {
  'town-entrance': [
    { id:'hs-flower', label:'七个花圈', style:'left:10%;top:50%;width:15%;height:20%',
      action: ()=>{
        if(!G.flags.flowers_clicked) G.flags.flowers_clicked=0;
        G.flags.flowers_clicked++;
        if(G.flags.flowers_clicked===1) showDialogues(DIALOGS.ch1_flowers);
        else if(G.flags.flowers_clicked>=3) {
          showNotify('一共七个花圈……');
          setTimeout(onFlowersExplored, 1500);
        } else showNotify(`这是第${G.flags.flowers_clicked}个花圈……`);
        changeSanity(-3);
      }
    },
    { id:'hs-tree', label:'老槐树', style:'left:60%;top:30%;width:18%;height:40%',
      action: ()=>showDialogues([{speaker:'陈安（内心）',text:'被雷劈过，一半焦黑，一半还活着。就那么站在那里，已经不知道多少年了。'}])
    },
    { id:'hs-lamp', label:'路灯', style:'left:45%;top:40%;width:8%;height:25%',
      action: ()=>showDialogues([{speaker:'陈安（内心）',text:'昏黄的灯光，照出溺水前的颜色。整个镇子都像是被泡在水底，透不过气来。'}])
    },
  ],
  'old-house-yard': [
    { id:'hs-doll', label:'纸人', style:'left:60%;top:40%;width:12%;height:30%',
      action: ()=>{ if(!G.flags.paperdoll_clicked){ G.flags.paperdoll_clicked=true; showDialogues(DIALOGS.ch1_paperdoll); } }
    },
    { id:'hs-shrine', label:'供台', style:'left:15%;top:60%;width:15%;height:20%',
      action: ()=>{ changeHope(5); showDialogues([{speaker:'陈安（内心）',text:'在供台前默默地拜了拜。奶奶，我来了。'}]); }
    },
    { id:'hs-jar', label:'水缸', style:'left:75%;top:50%;width:14%;height:25%',
      action: ()=>showDialogues([{speaker:'陈安（内心）',text:'缸里是细沙，不是水。细沙下面隐约露出一个木盒的边角……（第三章会用到）'}])
    },
  ],
  'old-house-hall': [
    { id:'hs-portrait', label:'奶奶遗像', style:'left:35%;top:25%;width:30%;height:30%',
      action: ()=>{ changeHope(10); showDialogues([{speaker:'陈安（内心）',text:'照片里的她表情严肃，一如生前。奶奶，你为什么不直接告诉我？……因为你知道，有些事，必须亲眼看见才会相信。',hope:0}]); }
    },
    { id:'hs-candle', label:'灵烛', style:'left:25%;top:40%;width:10%;height:20%',
      action: ()=>showDialogues([{speaker:'陈安（内心）',text:'烛火跳动，光影在四壁老旧的木板上晃动。就在这样的光里，张意第一次出现。'}])
    },
  ],
};

function buildHotspots(sceneId) {
  const cfg = HOTSPOT_CONFIG[sceneId];
  if(!cfg) return;
  const scene = document.getElementById('scene-'+sceneId);
  if(!scene) return;
  scene.querySelectorAll('.hotspot').forEach(h=>h.remove());
  cfg.forEach(h=>{
    const el = document.createElement('div');
    el.className='hotspot'; el.id=h.id;
    el.setAttribute('style', h.style+';position:absolute;');
    const lbl = document.createElement('span');
    lbl.className='hotspot-label'; lbl.textContent=h.label;
    el.appendChild(lbl);
    el.addEventListener('click', h.action);
    scene.appendChild(el);
  });
}

// 场景切换时自动构建热区
const _origSwitch = switchScene;
// 重写为包含热区构建
function switchSceneWithHotspots(id) {
  _origSwitch(id);
  buildHotspots(id);
}

// ===== 存档/读档/重置 =====
function restartGame() {
  G.sanity=80; G.hope=60;
  G.items={lantern:true,note:false,coin:false,key:false,photo:false};
  G.flags={}; G.chapter=0; G.gameOver=false;
  G.atticFound={photo:false,letter:false,key:false};
  G.bloodSteps=0;
  dom.endingScreen.classList.remove('show');
  dom.systemMenu.classList.remove('show');
  stopBGM(); stopRainSound();
  updateStatus();
  startTitle();
}

// ===== 键盘快捷键 =====
document.addEventListener('keydown', e=>{
  if(e.key==='Escape') toggleMenu();
  if(e.ctrlKey && e.key==='s') { e.preventDefault(); saveGame(); }
  if(e.ctrlKey && e.key==='l') { e.preventDefault(); loadGame(); }
  if(e.key==='m'||e.key==='M') {
    G.muted=!G.muted;
    showNotify(G.muted?'音效已关闭':'音效已开启');
    if(G.muted){stopBGM();stopRainSound();}
  }
  if(e.key===' '||e.key==='Enter') {
    if(!G.inPuzzle) nextDialogue();
  }
});

// ===== 初始化 =====
window.addEventListener('load', ()=>{
  initDOM();
  updateStatus();

  // 菜单按钮
  document.getElementById('menu-btn').onclick = toggleMenu;
  document.getElementById('btn-save').onclick = saveGame;
  document.getElementById('btn-load').onclick = loadGame;
  document.getElementById('btn-restart').onclick = restartGame;
  document.getElementById('btn-mute').onclick = ()=>{
    G.muted=!G.muted;
    document.getElementById('btn-mute').textContent=G.muted?'开启音效':'关闭音效';
    showNotify(G.muted?'音效已关闭':'音效已开启');
  };
  document.getElementById('btn-close-menu').onclick = ()=>dom.systemMenu.classList.remove('show');
  document.getElementById('ending-restart').onclick = restartGame;

  // 灯笼互动
  document.getElementById('inv-lantern').onclick = useLantern;

  // 对话框点击
  dom.dialogueBox.addEventListener('click', ()=>{
    if(!G.inPuzzle) nextDialogue();
  });

  // 章节标题点击
  dom.chapterTitle.addEventListener('click', ()=>{
    if(dom.chapterTitle.classList.contains('show')) {
      dom.chapterTitle.classList.remove('show');
    }
  });

  startTitle();
});
