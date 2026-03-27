// ===== 纸扎铺 - 章节流程 =====

function startTitle() {
  switchScene('title');
  dom.dialogueBox.style.display = 'none';
}

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

function startCh2End() {
  startChapter3();
}

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

function useLantern() {
  if (G.items.lantern) {
    changeSanity(5);
    showNotify('灯笼温暖了你的心——理智+5');
  }
}

function startOpenLock() {
  if (!G.items.key) {
    showNotify('你需要归魂钥匙');
    return;
  }
  showDialogues(DIALOGS.ch3_open_lock, () => {
    flashWhite(() => {
      fadeToScene('shop-interior', () => {
        showDialogues(DIALOGS.ch3_run_out, () => startChapter4());
      });
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    startTitle, startChapter1, onFlowersExplored,
    startChapter2, startCh2End, startChapter3, startCh3ZhangYi,
    startDarkRoom, startChapter4, startEpilogue,
    useLantern, startOpenLock
  };
}
