// ===== 纸扎铺 - 场景系统 =====

'use strict';

function switchScene(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('scene-' + id);
  if (s) s.classList.add('active');
  G.scene = id;

  if (id === 'old-tree') {
    startRain();
    playRainSound();
  } else {
    stopRain();
    stopRainSound();
  }

  const shopScenes = ['shop-exterior', 'shop-interior', 'shop-basement', 'dark-room', 'shop-secret'];
  if (shopScenes.includes(id)) {
    playBGM('shop');
  } else if (id === 'dream-street') {
    playBGM('dream');
  } else {
    stopBGM();
  }
}

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

function stopRain() {
  dom.rainContainer.classList.remove('active');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { switchScene, startRain, stopRain };
}
