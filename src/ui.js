// ===== 纸扎铺 - UI组件 =====

'use strict';

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
    gameContainer: document.getElementById('game-container'),
  };
}

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
  updateInventory();
}

function updateInventory() {
  const items = ['lantern', 'coin', 'key', 'photo', 'note'];
  items.forEach(k => {
    const el = document.getElementById('inv-' + k);
    if (el) {
      if (G.items[k]) {
        el.classList.add('has-item');
      } else {
        el.classList.remove('has-item');
      }
    }
  });
}

let notifyTimer = null;
function showNotify(msg, type = 'default') {
  if (!dom.notification) return;
  dom.notification.textContent = msg;
  dom.notification.className = 'notification show';
  if (type === 'item') dom.notification.classList.add('notification-item');
  if (type === 'warning') dom.notification.classList.add('notification-warning');
  if (notifyTimer) clearTimeout(notifyTimer);
  notifyTimer = setTimeout(() => {
    dom.notification.classList.remove('show');
  }, 2000);
}

function typeText(el, text, cb) {
  if (G.typeTimer) {
    clearInterval(G.typeTimer);
    G.typeTimer = null;
  }
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

function showPortrait(type) {
  if (!type) {
    dom.portraitContainer.classList.remove('show');
    return;
  }
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
      parts.forEach(p => {
        const d = document.createElement('div');
        d.className = p;
        el.appendChild(d);
      });
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

function flashWhite(cb) {
  dom.flashOverlay.style.opacity = '1';
  setTimeout(() => {
    dom.flashOverlay.style.opacity = '0';
    if (cb) cb();
  }, 200);
}

function fadeToScene(sceneId, cb) {
  dom.fadeOverlay.style.opacity = '1';
  setTimeout(() => {
    switchScene(sceneId);
    if (cb) cb();
    setTimeout(() => {
      dom.fadeOverlay.style.opacity = '0';
    }, 100);
  }, 650);
}

function toggleMenu() {
  dom.systemMenu.classList.toggle('show');
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

function hideChoices() {
  dom.choicesBox.classList.remove('show');
}

function triggerBadEnding() {
  G.gameOver = true;
  stopBGM();
  stopRainSound();
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

function triggerEnding() {
  stopBGM();
  stopRainSound();
  playDispelSound();
  const hasKey = G.items.key;
  const s = G.sanity;
  const h = G.hope;
  let title;
  let text;
  let color = 'var(--gold)';

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

function restartGame() {
  resetGameState();
  dom.endingScreen.classList.remove('show');
  dom.systemMenu.classList.remove('show');
  stopBGM();
  stopRainSound();
  updateStatus();
  startTitle();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initDOM, updateStatus, updateInventory, showNotify,
    typeText, showPortrait, showChapterTitle, flashWhite,
    fadeToScene, toggleMenu, showChoices, hideChoices,
    triggerBadEnding, triggerEnding, restartGame
  };
}
