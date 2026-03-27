// ===== 纸扎铺 - 对话系统 =====

'use strict';

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
    if (G._dialogFinish) {
      const f = G._dialogFinish;
      G._dialogFinish = null;
      f();
    }
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { showDialogues, nextDialogue };
}
