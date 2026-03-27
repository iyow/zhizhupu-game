// ===== 纸扎铺 - 音效系统 =====

'use strict';

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

function toggleMute() {
  G.muted = !G.muted;
  if (G.muted) {
    stopBGM();
    stopRainSound();
  }
  return G.muted;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playCoinSound, playPaperSound, playRainSound, stopRainSound,
    playBGM, stopBGM, playSanitySound, playHopeSound,
    playUnlockSound, playDispelSound, toggleMute
  };
}
