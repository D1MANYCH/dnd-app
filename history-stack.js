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

  // ── PERF-6: фокус для клавиатуры и экранного диктора ─────────────
  // При открытии окна фокус уходит внутрь, Tab/Shift+Tab ходят по кругу
  // внутри верхнего слоя, при закрытии фокус возвращается на кнопку-источник.
  var openers = [];          // [{ key, el }]
  var FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]';

  function isShown(el) {
    if (!el || !el.getClientRects().length) return false;
    var cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none";
  }
  function focusables(root) {
    var all = root.querySelectorAll(FOCUSABLE), out = [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.disabled || el.getAttribute("tabindex") === "-1") continue;
      if (el.tagName === "INPUT" && el.type === "hidden") continue;
      if (isShown(el)) out.push(el);
    }
    return out;
  }
  function zOf(el) { var z = parseInt(getComputedStyle(el).zIndex, 10); return isNaN(z) ? 0 : z; }
  // Верхний слой: видимая модалка с наибольшим z-index (при равенстве —
  // последняя в DOM), затем открытая шторка, затем страница сервиса.
  function topLayer() {
    var m = document.querySelectorAll('.modal.active:not(.closing), .confirm-modal-overlay.active, #dice-modal.active');
    var best = null;
    for (var i = 0; i < m.length; i++) {
      if (!isShown(m[i])) continue;
      if (!best || zOf(m[i]) >= zOf(best)) best = m[i];
    }
    if (best) return best;
    var d = document.getElementById("side-drawer");
    if (d && d.classList.contains("open") && isShown(d)) return d;
    var cur = document.querySelector('div[id^="screen-"]:not(.hidden):not(.screen-ghost)');
    if (cur && window.PAGE_SCREENS && PAGE_SCREENS.indexOf(cur.id.replace("screen-", "")) >= 0 && isShown(cur)) return cur;
    return null;
  }
  function rememberOpener(key) {
    for (var i = 0; i < openers.length; i++) if (openers[i].key === key) return;
    var a = document.activeElement;
    openers.push({ key: key, el: (a && a !== document.body) ? a : null });
  }
  // Первый элемент без клавиатуры на телефоне (не поле ввода), иначе сам контейнер.
  function focusInto(root) {
    if (!root) return;
    setTimeout(function () {
      if (!isShown(root) || root.contains(document.activeElement)) return;
      var list = focusables(root), target = null;
      for (var i = 0; i < list.length; i++) {
        var t = list[i].tagName;
        if (t !== "INPUT" && t !== "TEXTAREA" && t !== "SELECT" && !list[i].isContentEditable) { target = list[i]; break; }
      }
      if (!target) {
        if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");
        target = root;
      }
      try { target.focus({ preventScroll: true }); } catch (e) {}
    }, 50);
  }
  function restoreOpener(key) {
    for (var i = openers.length - 1; i >= 0; i--) {
      if (openers[i].key !== key) continue;
      var el = openers[i].el;
      openers.splice(i);
      if (el && document.contains(el) && isShown(el)) {
        try { el.focus({ preventScroll: true }); } catch (e) {}
      }
      return;
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
    var root = topLayer();
    if (!root) return;
    var list = focusables(root);
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1], a = document.activeElement;
    if (!root.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
    if (e.shiftKey && (a === first || a === root)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  });

  // ── Обёртки open/close для пар функций ───────────────────────────
  function wrapPair(name, openFnName, closeFnName, rootId) {
    var origOpen = window[openFnName];
    var origClose = window[closeFnName];
    if (typeof origOpen !== "function" || typeof origClose !== "function") return false;
    window[openFnName] = function() {
      rememberOpener(name);
      var r = origOpen.apply(this, arguments);
      pushLayer(name, function(){ try { origClose.call(window); } catch(e){} restoreOpener(name); });
      focusInto(document.getElementById(rootId));
      return r;
    };
    window[closeFnName] = function() {
      var r = origClose.apply(this, arguments);
      syncCloseLayer(name);
      restoreOpener(name);
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
  // STYLE-8M-3: повышение уровня, отдых и два каталога — тоже экраны.
  var SCREEN_DEPTH = { home: 0, characters: 1, character: 2, data: 3, settings: 3, about: 3,
                       help: 3, builds: 3, buildguide: 4, buildplan: 4, abilityinfo: 3,
                       featureinfo: 4, levelup: 3, rest: 3, magiccatalog: 3, gearcatalog: 3 };
  function wrapShowScreen() {
    var orig = window.showScreen;
    if (typeof orig !== "function") return false;
    window.showScreen = function(name) {
      var prev = null;
      var prevEl = document.querySelector('div[id^="screen-"]:not(.hidden):not(.screen-ghost)');
      if (prevEl) prev = prevEl.id.replace("screen-", "");
      var depth = window.SCREEN_DEPTH || SCREEN_DEPTH;
      var from = depth[prev], to = depth[name];
      var fwd = from != null && to != null && to > from;
      if (fwd) rememberOpener("screen:" + name);
      var r = orig.apply(this, arguments);
      if (fwd) {
        pushLayer("screen:" + name, function(){
          try { orig.call(window, prev); } catch(e){}
          restoreOpener("screen:" + name);
        });
        focusInto(document.getElementById("screen-" + name));
      } else if (from != null && to != null && to < from) {
        restoreOpener("screen:" + prev);
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
      rememberOpener("modal:" + id);
      var r = origOpen.apply(this, arguments);
      pushLayer("modal:" + id, function(){ try { origClose.call(window, id); } catch(e){} restoreOpener("modal:" + id); });
      focusInto(document.getElementById(id));
      return r;
    };
    window.closeModal = function(id) {
      var r = origClose.apply(this, arguments);
      syncCloseLayer("modal:" + id);
      restoreOpener("modal:" + id);
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
      ["drawer",        "openDrawer",          "closeDrawer",    "side-drawer"],
      // STYLE-8M-4: поиск заклинаний и история ХП — тоже экраны.
      ["dice",          "openDiceModal",       "closeDiceModal", "dice-modal"]
    ].forEach(function(p){
      if (wrapPair(p[0], p[1], p[2], p[3])) applied.push(p[1]);
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
