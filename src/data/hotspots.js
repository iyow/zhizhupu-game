// ===== 纸扎铺 - 热区配置 =====

window.HOTSPOT_CONFIG = {
  'town-entrance': [
    {
      id: 'hs-flower',
      label: '七个花圈',
      style: 'left:10%;top:50%;width:15%;height:20%',
      action: () => {
        if (!G.flags.flowers_clicked) G.flags.flowers_clicked = 0;
        G.flags.flowers_clicked++;
        if (G.flags.flowers_clicked === 1) {
          showDialogues(DIALOGS.ch1_flowers);
        } else if (G.flags.flowers_clicked >= 3) {
          showNotify('一共七个花圈……');
          setTimeout(onFlowersExplored, 1500);
        } else {
          showNotify(`这是第${G.flags.flowers_clicked}个花圈……`);
        }
        changeSanity(-3);
      }
    },
    {
      id: 'hs-tree',
      label: '老槐树',
      style: 'left:60%;top:30%;width:18%;height:40%',
      action: () => showDialogues([{ speaker: '陈安（内心）', text: '被雷劈过，一半焦黑，一半还活着。就那么站在那里，已经不知道多少年了。' }])
    },
    {
      id: 'hs-lamp',
      label: '路灯',
      style: 'left:45%;top:40%;width:8%;height:25%',
      action: () => showDialogues([{ speaker: '陈安（内心）', text: '昏黄的灯光，照出溺水前的颜色。整个镇子都像是被泡在水底，透不过气来。' }])
    },
  ],
  'old-house-yard': [
    {
      id: 'hs-doll',
      label: '纸人',
      style: 'left:60%;top:40%;width:12%;height:30%',
      action: () => {
        if (!G.flags.paperdoll_clicked) {
          G.flags.paperdoll_clicked = true;
          showDialogues(DIALOGS.ch1_paperdoll);
        }
      }
    },
    {
      id: 'hs-shrine',
      label: '供台',
      style: 'left:15%;top:60%;width:15%;height:20%',
      action: () => {
        changeHope(5);
        showDialogues([{ speaker: '陈安（内心）', text: '在供台前默默地拜了拜。奶奶，我来了。' }]);
      }
    },
    {
      id: 'hs-jar',
      label: '水缸',
      style: 'left:75%;top:50%;width:14%;height:25%',
      action: () => showDialogues([{ speaker: '陈安（内心）', text: '缸里是细沙，不是水。细沙下面隐约露出一个木盒的边角……（第三章会用到）' }])
    },
  ],
  'old-house-hall': [
    {
      id: 'hs-portrait',
      label: '奶奶遗像',
      style: 'left:35%;top:25%;width:30%;height:30%',
      action: () => {
        changeHope(10);
        showDialogues([{ speaker: '陈安（内心）', text: '照片里的她表情严肃，一如生前。奶奶，你为什么不直接告诉我？……因为你知道，有些事，必须亲眼看见才会相信。' }]);
      }
    },
    {
      id: 'hs-candle',
      label: '灵烛',
      style: 'left:25%;top:40%;width:10%;height:20%',
      action: () => showDialogues([{ speaker: '陈安（内心）', text: '烛火跳动，光影在四壁老旧的木板上晃动。就在这样的光里，张意第一次出现。' }])
    },
  ],
};

function buildHotspots(sceneId) {
  if (G._hotspotsBuilt[sceneId]) return;

  const cfg = HOTSPOT_CONFIG[sceneId];
  if (!cfg) return;

  const scene = document.getElementById('scene-' + sceneId);
  if (!scene) return;

  cfg.forEach(h => {
    const existing = document.getElementById(h.id);
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'hotspot';
    el.id = h.id;
    el.style.cssText = h.style + ';position:absolute;';
    const lbl = document.createElement('span');
    lbl.className = 'hotspot-label';
    lbl.textContent = h.label;
    el.appendChild(lbl);
    el.addEventListener('click', h.action);
    scene.appendChild(el);
  });

  G._hotspotsBuilt[sceneId] = true;
}

function activateHotspots(scene) {
  document.querySelectorAll('#scene-' + scene + ' .hotspot').forEach(h => {
    h.style.pointerEvents = 'all';
  });
}

function clearHotspots(sceneId) {
  const scene = document.getElementById('scene-' + sceneId);
  if (scene) {
    scene.querySelectorAll('.hotspot').forEach(h => h.remove());
  }
  delete G._hotspotsBuilt[sceneId];
}
