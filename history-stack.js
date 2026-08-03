// ============================================================
// history-stack.js — FEAT-5: History-back для PWA.
// Системa перехвата браузерной кнопки «Назад»: при наличии открытых
// модалок/экранов закрывает верхний слой; на корне (#screen-characters
// без модалок) показывает confirm «Выйти из приложения?».
// ============================================================

(function(){
  if (window._historyStackInited) return;
  window._historyStackInited = true;

  var layers = [];           // [{ name, closeFn }]
  var suppressNext = false;  // ignore следующий popstate (внутренний go)
  var exiting = false;       // флаг подтверждённого выхода

  // Добавляем sentinel-state «корень» поверх естественной точки истории.
  // Это даёт нам одну запасную позицию: пользователь может нажать Back из
  // корня → попадаем в предыдущую запись (или null), там показываем confirm
  // на выход; при отказе пушим dndRoot обратно.
  try { history.pushState({ dndRoot: true, depth: 0 }, ""); } catch(e) {}

  function pushLayer(name, closeFn) {
    layers.push({ name: name, closeFn: closeFn });
    try { history.pushState({ dndLayer: name, depth: layers.length }, ""); } catch(e) {}
  }

  // Вызывается из close-обёрток когда пользователь закрывает слой явно
  // (через ✕, клик-вне, Escape) — синхронизируем history.
  function syncCloseLayer(name) {
    for (var i = layers.length - 1; i >= 0; i--) {
      if (layers[i].name === name) {
        var n = layers.length - i;
        layers.splice(i);
        suppressNext = true;
        try { history.go(-n); } catch(e) {}
        return true;
      }
    }
    return false;
  }

  window.addEventListener("popstate", function(e) {
    if (suppressNext) { suppressNext = false; return; }
    if (exiting) return;

    // 1) Есть открытые слои — закрываем верхний
    if (layers.length > 0) {
      var top = layers.pop();
      try { top.closeFn(); } catch(err) { try { console.error(err); } catch(_){} }
      return;
    }

    // 2) Слоёв нет — пользователь нажал Back на корне. Confirm на выход.
    if (confirm("Выйти из приложения?")) {
      exiting = true;
      return; // даём браузеру выйти (мы уже на entry ниже sentinel-а)
    }
    // Отмена — пушим sentinel обратно, чтобы следующий Back снова спросил
    try { history.pushState({ dndRoot: true, depth: 0 }, ""); } catch(e) {}
  });

  // ── Обёртки open/close для пар функций ───────────────────────────
  function wrapPair(name, openFnName, closeFnName) {
    var origOpen = window[openFnName];
    var origClose = window[closeFnName];
    if (typeof origOpen !== "function" || typeof origClose !== "function") return false;
    window[openFnName] = function() {
      var r = origOpen.apply(this, arguments);
      pushLayer(name, function(){ try { origClose.call(window); } catch(e){} });
      return r;
    };
    window[closeFnName] = function() {
      var r = origClose.apply(this, arguments);
      syncCloseLayer(name);
      return r;
    };
    return true;
  }

  // Обёртка для showScreen. MENU-8: экранов три (home → characters → character),
  // поэтому слой истории пушим на любом движении ВПЕРЁД (по глубине), а не только
  // на characters → character. Назад (Back браузера / кнопка «←») слоёв не создаёт —
  // иначе стек рос бы при каждом возврате и Back застревал.
  // STYLE-8M-2: копия глубин из app-core.js — страницы сервиса («Данные»,
  // «Настройки», «О версии») стали экранами и обязаны пушить слой истории,
  // иначе браузерный Back с них уводил бы сразу из приложения.
  // STYLE-8M-2b: справка, пикер билдов, гайд и план развития — тоже экраны.
  var SCREEN_DEPTH = { home: 0, characters: 1, character: 2, data: 3, settings: 3, about: 3,
                       help: 3, builds: 3, buildguide: 4, buildplan: 4 };
  function wrapShowScreen() {
    var orig = window.showScreen;
    if (typeof orig !== "function") return false;
    window.showScreen = function(name) {
      var prev = null;
      var prevEl = document.querySelector('div[id^="screen-"]:not(.hidden):not(.screen-ghost)');
      if (prevEl) prev = prevEl.id.replace("screen-", "");
      var r = orig.apply(this, arguments);
      var from = SCREEN_DEPTH[prev], to = SCREEN_DEPTH[name];
      if (from != null && to != null && to > from) {
        pushLayer("screen:" + name, function(){
          try { orig.call(window, prev); } catch(e){}
        });
      }
      return r;
    };
    return true;
  }

  // Обёртка для openModal/closeModal — общий хелпер для большинства модалок
  function wrapGenericModal() {
    var origOpen = window.openModal;
    var origClose = window.closeModal;
    if (typeof origOpen !== "function" || typeof origClose !== "function") return false;
    window.openModal = function(id) {
      var r = origOpen.apply(this, arguments);
      pushLayer("modal:" + id, function(){ try { origClose.call(window, id); } catch(e){} });
      return r;
    };
    window.closeModal = function(id) {
      var r = origClose.apply(this, arguments);
      syncCloseLayer("modal:" + id);
      return r;
    };
    return true;
  }

  // Применяем все обёртки после загрузки всех модулей
  function applyWraps() {
    var applied = [];
    if (wrapShowScreen()) applied.push("showScreen");
    if (wrapGenericModal()) applied.push("openModal/closeModal");
    [
      // STYLE-8M-2: пара настроек снята — это экран, слой пушит wrapShowScreen.
      ["drawer",        "openDrawer",          "closeDrawer"],
      ["dice",          "openDiceModal",       "closeDiceModal"],
      ["spellSearch",   "openSpellSearch",     "closeSpellSearch"],
      ["rest",          "openRestModal",       "closeRestModal"],
      ["hpHistory",     "openHPHistory",       "closeHPHistory"]
    ].forEach(function(p){
      if (wrapPair(p[0], p[1], p[2])) applied.push(p[1]);
    });
    window._historyStackApplied = applied;
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(applyWraps, 0);
  } else {
    document.addEventListener("DOMContentLoaded", applyWraps);
  }

  // Экспорт публичного API
  window.pushHistoryLayer = pushLayer;
  window.syncCloseLayer = syncCloseLayer;
  window.getHistoryLayers = function(){ return layers.slice(); };
})();
