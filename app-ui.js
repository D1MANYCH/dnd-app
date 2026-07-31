// ============================================================
// app-ui.js — Интерфейс: аватар, кубики, аккордеоны,
// ресурсы класса, ASI, журнал, спутники, черты, профили
// ============================================================

// ============================================
// UI-10. Skeleton-лоадеры + подсветка поиска
// ============================================

/** Заполняет контейнер мерцающими skeleton-плашками.
 *  variant: "list" (заклинания/инвентарь) | "card" (билды). */
function injectSkeletons(containerId, count, variant) {
  var c = document.getElementById(containerId);
  if (!c) return;
  var isCard = variant === "card";
  var rowCls = "skel-row" + (isCard ? " skel-card" : "");
  var row = '<div class="' + rowCls + '">' +
              '<div class="skel-line skel-line-title"></div>' +
              '<div class="skel-line skel-line-sub"></div>' +
              (isCard ? '<div class="skel-line skel-line-mini"></div>' : '') +
            '</div>';
  c.innerHTML = '<div class="skeleton-list" aria-hidden="true">' + row.repeat(count) + '</div>';
}

/** Показывает skeleton один раз за сессию для данного ключа, затем
 *  через delay вызывает renderFn (который рендерит реальный список).
 *  Возвращает true, если skeleton показан (вызывающий должен сделать return). */
function firstLoadSkeleton(key, containerId, count, variant, renderFn, delay) {
  if (!window._skelDone) window._skelDone = {};
  if (window._skelDone[key]) return false;
  window._skelDone[key] = true;
  injectSkeletons(containerId, count, variant);
  setTimeout(renderFn, delay || 300);
  return true;
}

/** Экранирует text и оборачивает вхождения query в <mark class="search-hl">.
 *  Регистронезависимо. Возвращает безопасный HTML. */
function highlightMatch(text, query) {
  var safe = escapeHtml(text == null ? "" : String(text));
  var q = (query == null ? "" : String(query)).trim();
  if (!q) return safe;
  var safeQ = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var rx = new RegExp("(" + safeQ + ")", "ig");
  return safe.replace(rx, '<mark class="search-hl">$1</mark>');
}

/** FIN-10: заполняет datalist подсказок божеств из DEITIES_DATA.
 *  Значение опции = имя божества (попадает в поле), текст-подсказка =
 *  «титул · мировоззрение · рекомендуемые домены». Список статичен →
 *  достаточно вызвать один раз при загрузке (app-core onload). */
function renderDeityDatalist() {
  var dl = document.getElementById("deity-datalist");
  if (!dl || typeof DEITIES_DATA === "undefined") return;
  var labels = (typeof DEITY_ALIGN_LABELS !== "undefined") ? DEITY_ALIGN_LABELS : {};
  var html = "";
  DEITIES_DATA.forEach(function(d) {
    var al = labels[d.alignment] || d.alignment;
    var hint = [d.title, al, d.domains].filter(Boolean).join(" · ");
    html += '<option value="' + escapeHtml(d.name) + '">' + escapeHtml(hint) + '</option>';
  });
  dl.innerHTML = html;
}

// ============================================
// АВАТАР ПЕРСОНАЖА
// ============================================

/** Открыть модалку аватара для текущего персонажа */
function openAvatarModal(event) {
  if (event) event.stopPropagation();
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  // Показать текущий аватар в превью
  const preview = $("avatar-modal-preview");
  if (preview) {
    if (char.avatar) {
      preview.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\">";
    } else {
      preview.innerHTML = char.class ? ("<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>") : AVATAR_FALLBACK_IMG;
    }
  }
  const urlInput = $("avatar-url-input");
  if (urlInput) urlInput.value = "";
  openModal("avatar-modal");
}

function closeAvatarModal() { closeModal("avatar-modal"); }

/** Загрузить аватар с устройства — сжимаем до 400×400 через canvas */
function handleAvatarFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { showToast("Выберите файл изображения", "error"); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      applyAvatar(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  // Сбросить input чтобы можно было выбрать тот же файл повторно
  input.value = "";
}

/** Сохранить аватар по URL */
function applyAvatarFromUrl() {
  const url = ($("avatar-url-input")?.value || "").trim();
  if (!url) { showToast("Введите ссылку на изображение", "warn"); return; }
  // Проверяем что ссылка похожа на картинку
  applyAvatar(url);
}

/** Применить аватар (base64 или URL) — сохранить и перерисовать */
function applyAvatar(src) {
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  char.avatar = src;
  char.updatedAt = Date.now();
  saveToLocal();
  // Обновить превью в модалке
  const preview = $("avatar-modal-preview");
  if (preview) preview.innerHTML = "<img src=\"" + src + "\" alt=\"Аватар\">";
  // Обновить аватар в шапке листа
  renderSheetAvatar();
  // Перерисовать карточку в списке
  renderCharacterList();
  showToast("Аватар сохранён", "success");
}

/** Удалить аватар */
function removeAvatar(event) {
  if (event) event.stopPropagation();
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  char.avatar = null;
  char.updatedAt = Date.now();
  saveToLocal();
  const preview = $("avatar-modal-preview");
  if (preview) preview.innerHTML = char.class ? ("<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>") : AVATAR_FALLBACK_IMG;
  renderSheetAvatar();
  renderCharacterList();
  showToast("Аватар удалён", "info");
}

/** HTML-помощник для placeholder-аватара (без билда/без класса) */
const AVATAR_FALLBACK_IMG = '<img class="avatar-modal-fallback" src="assets/avatar-fallback.webp" alt="">';

/** Обновить аватар в шапке листа персонажа */
function renderSheetAvatar() {
  const el = $("sheet-avatar");
  if (!el) return;
  const char = getCurrentChar();
  if (char && char.avatar) {
    el.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\" onclick=\"openAvatarModal(event)\">";
    el.classList.add("has-avatar");
  } else {
    const inner = (char && char.class) ? getClassIcon(char.class) : AVATAR_FALLBACK_IMG;
    el.innerHTML = "<button type=\"button\" class=\"avatar-icon-btn\" onclick=\"openAvatarModal(event)\" aria-label=\"Сменить аватар\">" + inner + "</button>";
    el.classList.remove("has-avatar");
  }
}


function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// UI-11: count-up числа в элементе от from к to (ease-out cubic).
// reduced-motion / нечисловые / равные значения → мгновенная установка.
function animateCountUp(el, from, to, duration) {
  if (!el) return;
  from = Number(from); to = Number(to);
  if (!isFinite(from) || !isFinite(to)) { el.textContent = to; return; }
  if (from === to || prefersReducedMotion()) { el.textContent = to; return; }
  duration = duration || 400;
  if (el._countRaf) cancelAnimationFrame(el._countRaf);
  var t0 = performance.now();
  function tick(now) {
    var t = Math.min(1, (now - t0) / duration);
    var k = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * k);
    if (t < 1) { el._countRaf = requestAnimationFrame(tick); }
    else { el.textContent = to; el._countRaf = null; }
  }
  el._countRaf = requestAnimationFrame(tick);
}
window.animateCountUp = animateCountUp;

// ============================================
// АСИ — Улучшение характеристик
// ============================================
// openASIModal и closeASIModal определены ниже

// ============================================================
// BUGFIX-5: глобальный onerror-toast для uncaught ошибок
// Чтобы пользователь увидел сбой сразу, а не «приложение зависло».
// Лог в console.error остаётся для DevTools, toast — для UX.
// ============================================================
(function() {
  var _lastErrAt = 0;
  function _reportError(label, detail) {
    var now = Date.now();
    if (now - _lastErrAt < 1500) return; // throttle: не спамить toast при каскаде
    _lastErrAt = now;
    if (typeof showToast === 'function') {
      showToast("⚠️ Ошибка: " + (detail || label || 'неизвестно'), "error");
    }
  }
  window.addEventListener('error', function(e) {
    var msg = (e && e.message) ? String(e.message) : '';
    if (e && e.error) console.error('[uncaught]', e.error);
    else if (msg) console.error('[uncaught]', msg);
    _reportError('Uncaught', msg.slice(0, 80));
  });
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e && e.reason;
    var msg = reason && reason.message ? reason.message : String(reason || '');
    console.error('[unhandled-rejection]', reason);
    _reportError('Promise rejection', msg.slice(0, 80));
  });
})();

// ============================================================
// Регистрация Service Worker + автообнаружение обновлений
// ============================================================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    checkWhatsNew();
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        if (reg.waiting) {
          showUpdateModal(reg.waiting);
          updateVersionBlock(true, reg.waiting);
        } else {
          updateVersionBlock(false);
        }
        reg.addEventListener('updatefound', function() {
          var newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateModal(newWorker);
              updateVersionBlock(true, newWorker);
            }
          });
        });
      })
      .catch(function(err) {
        console.error('[PWA] SW ошибка:', err);
        updateVersionBlock(false);
      });
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (!refreshing) { refreshing = true; window.location.reload(); }
    });
  });
} else {
  window.addEventListener('load', function() { updateVersionBlock(false); });
}

// ── Блок Telegram-канала для окон обновления (анонсы + новости) ──
function swTelegramBlock() {
  var tgUrl = (typeof APP_TELEGRAM_URL === 'string' && APP_TELEGRAM_URL) ? APP_TELEGRAM_URL : 'https://t.me/dndlistru';
  return '<a class="sw-update-tg" href="' + escapeHtml(tgUrl) + '" target="_blank" rel="noopener">' +
      '<span class="sw-update-tg-icon">' + dndIcoHtml("chat", 16) + '</span>' +
      '<span class="sw-update-tg-text"><b>Telegram-канал @dndlistru</b>' +
        '<span class="sw-update-tg-sub">Анонсы обновлений, опросы, новости</span></span>' +
      '<span class="sw-update-tg-arrow">→</span>' +
    '</a>';
}

// ── Окно "Установить обновление" (до установки — без changelog) ──
function showUpdateModal(worker) {
  if ($('sw-update-modal')) return;
  var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '?';
  try { localStorage.setItem('dnd_pre_update_version', ver); } catch(e) {}
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">' + dndIcoHtml("dice", 28) + '</div>' +
        '<div class="sw-update-title">Доступно обновление!</div>' +
        '<div class="sw-update-version">Текущая версия: v' + escapeHtml(ver) + '</div>' +
      '</div>' +
      '<div class="sw-update-safe">' + dndIcoHtml("lock", 13) + ' <b>Персонажи и данные сохранятся</b> — обновление меняет только код приложения, данные хранятся отдельно в браузере</div>' +
      swTelegramBlock() +
      '<div class="sw-update-btns"><button id="sw-update-later">Позже</button><button id="sw-update-now">' + dndIcoHtml("zap", 14) + ' Установить обновление</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  requestAnimationFrame(function() { modal.classList.add('sw-update-visible'); });
  $('sw-update-now').addEventListener('click', function() {
    $('sw-update-now').textContent = '⏳ Обновляем...';
    $('sw-update-now').disabled = true;
    $('sw-update-later').disabled = true;
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  $('sw-update-later').addEventListener('click', function() {
    modal.classList.remove('sw-update-visible');
    setTimeout(function() { if (modal.parentNode) modal.remove(); }, 300);
  });
}

// ── Проверка "Что нового" после перезагрузки ──
function checkWhatsNew() {
  try {
    var prevVer = localStorage.getItem('dnd_pre_update_version');
    if (!prevVer) return;
    var curVer = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : null;
    if (!curVer || prevVer === curVer) return;
    localStorage.removeItem('dnd_pre_update_version');
    showWhatsNewModal(prevVer, curVer);
  } catch(e) {}
}

// ── Окно "Что нового" (после установки — с changelog) ──
function showWhatsNewModal(prevVer, newVer) {
  if ($('sw-update-modal')) return;
  var latest = (typeof APP_CHANGELOG !== 'undefined' && APP_CHANGELOG.length > 0) ? APP_CHANGELOG[0] : null;
  var typeIcon  = { feat:'✨', fix:'🐛', improve:'⚡', data:'📦', chore:'🔧' };
  var typeColor = { feat:'#4da843', fix:'#e74c3c', improve:'#5b9bd5', data:'#d4a843', chore:'#9a9ab0' };
  var changesList = latest ? latest.changes.map(function(c) {
    return '<div class="sw-change-item"><span class="sw-change-icon" style="color:' + (typeColor[c.type] || '#9a9ab0') + '">' + (typeIcon[c.type] || '•') + '</span><span class="sw-change-text">' + escapeHtml(c.text) + '</span></div>';
  }).join('') : '<div class="sw-change-item">Улучшения и исправления</div>';
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">' + dndIcoHtml("star", 28) + '</div>' +
        '<div class="sw-update-title">Обновлено!</div>' +
        '<div class="sw-update-version">v' + escapeHtml(prevVer) + ' → v' + escapeHtml(newVer) + (latest ? ' · ' + escapeHtml(latest.date) : '') + '</div>' +
      '</div>' +
      '<div class="sw-update-changes"><div class="sw-changes-title">' + dndIcoHtml("sheet", 14) + ' Что нового (' + (latest ? latest.changes.length : 0) + '):</div>' + changesList +
        (latest ? '<a class="cl-version-link" style="display:inline-block;margin-top:8px" href="' + RELEASES_URL + '#v' + encodeURIComponent(latest.version) + '" target="_blank" rel="noopener">подробно: что менялось в коде ↗</a>' : '') +
      '</div>' +
      '<div class="sw-update-safe">' + dndIcoHtml("lock", 13) + ' <b>Все данные сохранены</b> — ваши персонажи и заклинания на месте</div>' +
      swTelegramBlock() +
      '<div class="sw-update-btns"><button id="sw-update-now" style="flex:1">' + dndIcoHtml("check", 14) + ' Отлично!</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  requestAnimationFrame(function() { modal.classList.add('sw-update-visible'); });
  $('sw-update-now').addEventListener('click', function() {
    modal.classList.remove('sw-update-visible');
    setTimeout(function() { if (modal.parentNode) modal.remove(); }, 300);
  });
}


// ============================================================
// АККОРДЕОН — сворачиваемые секции
// ============================================================
function toggleAccordion(btn) {
  var body = btn.nextElementSibling;
  if (!body) return;
  var isOpen = btn.getAttribute("aria-expanded") === "true";
  // UI5-6: шеврон ▸ поворачивается через CSS от [aria-expanded] (см. .accordion-arrow в style.css),
  // JS больше не свопает символ — только переключает aria-expanded.
  if (isOpen) {
    body.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
  } else {
    body.style.display = "";
    btn.setAttribute("aria-expanded", "true");
    // FB-2: line-clamp-детект состояний требует видимой секции (scrollHeight) —
    // повторяем при раскрытии любого аккордеона (дёшево, no-op если состояний нет).
    if (typeof detectConditionOverflow === "function") setTimeout(detectConditionOverflow, 50);
  }
}

// ============================================================
// КЛАССОВЫЕ РЕСУРСЫ — трекер + АСИ
// ============================================================

// Инициализация resources в персонаже если отсутствуют
function initCharResources(char) {
  if (!char.resources) char.resources = {};
}

// Вычислить максимум ресурса по уровню и характеристикам
function getResourceMax(res, char) {
  var level = char.level || 1;
  var raw = res.maxByLevel ? (res.maxByLevel[level] !== undefined ? res.maxByLevel[level] : 0) : 0;
  if (raw === "level")       return level;
  if (raw === "cha")         return Math.max(1, getMod(char.stats.cha));
  if (raw === "cha_plus1")   return Math.max(1, getMod(char.stats.cha) + 1);
  if (raw === "level5")      return level * 5;  // Наложение рук — пул ХП
  if (raw === 99)            return 99; // Безлимит (Ярость 20 ур.)
  return parseInt(raw, 10) || 0;
}

// SDR-1: объединить ресурсы класса и подкласса в один список.
// Базовые ресурсы — CLASS_RESOURCES[char.class]; ресурсы подкласса (если есть запись
// в SUBCLASS_RESOURCES[char.subclass]) добавляются следом. Одноклассовый кейс — как и весь
// resource-код. Возвращает {resources, passive} либо null, если ресурсов нет вовсе.
function getCharResourceDefs(char) {
  if (!char) return null;
  var cls = char.class || "";
  var base = (typeof CLASS_RESOURCES !== "undefined" && CLASS_RESOURCES[cls]) ? CLASS_RESOURCES[cls] : null;
  var resources = (base && Array.isArray(base.resources)) ? base.resources.slice() : [];
  var sub = char.subclass || "";
  if (sub && typeof SUBCLASS_RESOURCES !== "undefined" && SUBCLASS_RESOURCES[sub] &&
      Array.isArray(SUBCLASS_RESOURCES[sub].resources)) {
    resources = resources.concat(SUBCLASS_RESOURCES[sub].resources);
  }
  // SDR-2: списки заклинаний подкласса (домены/клятвы/покровители) — для отображения
  var subSpells = (sub && typeof SUBCLASS_RESOURCES !== "undefined" && SUBCLASS_RESOURCES[sub] &&
      SUBCLASS_RESOURCES[sub].passive) ? SUBCLASS_RESOURCES[sub].passive.subclassSpells : null;
  if (!resources.length && !subSpells) return null;
  return { resources: resources, passive: base ? base.passive : null, subclassSpells: subSpells };
}

// SDR-1: текущий размер кости ресурса по dieSizeByLevel (ближайшее значение ≤ уровня).
// Для ресурсов без dieSizeByLevel возвращает "" (ничего не показываем).
function currentDieSize(res, level) {
  if (!res || !res.dieSizeByLevel) return "";
  var best = "";
  Object.keys(res.dieSizeByLevel).map(Number).sort(function(a, b){ return a - b; }).forEach(function(lv){
    if (level >= lv) best = res.dieSizeByLevel[lv];
  });
  return best;
}

// Рендер блока ресурсов
function renderClassResources() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);

  var section = $("class-resources-section");
  var grid = $("class-resources-grid");
  if (!section || !grid) return;

  var cls = char.class || "";
  var data = getCharResourceDefs(char);

  if (!data || ((!data.resources || data.resources.length === 0) && !data.subclassSpells)) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  grid.innerHTML = "";

  // Passive notes card
  if (data.passive && data.passive.notes) {
    var notesEl = document.createElement("div");
    notesEl.className = "resource-passive-card";
    notesEl.innerHTML = '<div class="resource-passive-title">' + dndIcoHtml("book", 14) + ' Пассивные умения ' + escapeHtml(cls) + '</div>' +
      '<pre class="resource-passive-text">' + escapeHtml(data.passive.notes) + '</pre>';
    grid.appendChild(notesEl);
  }

  // SDR-2: карточка заклинаний подкласса (домены/клятвы/покровители) — открытые по уровню
  if (data.subclassSpells && data.subclassSpells.byLevel) {
    var ss = data.subclassSpells;
    var lvl = char.level || 1;
    var ssLines = [];
    Object.keys(ss.byLevel).map(Number).sort(function(a, b){ return a - b; }).forEach(function(k){
      if (lvl < k) return; // ещё не открыто на текущем уровне
      var names = ss.byLevel[k].map(function(s){ return s.replace(/\s*\([^)]*\)\s*$/, ""); }).join(", ");
      ssLines.push(k + " ур.: " + names);
    });
    if (ssLines.length) {
      var ssEl = document.createElement("div");
      ssEl.className = "resource-passive-card";
      ssEl.innerHTML = '<div class="resource-passive-title">' + escapeHtml((ss.icon ? ss.icon + " " : "") + (ss.label || "Заклинания подкласса")) + '</div>' +
        '<pre class="resource-passive-text">' + escapeHtml(ssLines.join("\n")) + '</pre>';
      grid.appendChild(ssEl);
    }
  }

  // Resource cards
  data.resources.forEach(function(res) {
    var max = getResourceMax(res, char);
    if (max === 0) return; // не доступно на этом уровне

    var used = char.resources[res.id] || 0;
    if (used > max) { used = max; char.resources[res.id] = used; }
    var remaining = max - used;
    var dieSize = currentDieSize(res, char.level || 1); // SDR-1: к8/к10/к12 у костей превосходства

    var card = document.createElement("div");
    card.className = "resource-card";
    card.style.setProperty("--res-color", res.color || "#c9a227");

    var isPool = res.isPool; // Наложение рук — пул ХП а не заряды

    // Build pips (max 20, beyond that just show number)
    var pipsHtml = "";
    if (!isPool && max <= 20) {
      pipsHtml = '<div class="resource-pips">';
      for (var p = 0; p < max; p++) {
        pipsHtml += '<div class="resource-pip' + (p < remaining ? ' full' : '') + '" onclick="toggleResourcePip(\'' + res.id + '\',' + p + ')"></div>';
      }
      pipsHtml += '</div>';
    }

    var restLabel = res.restoreOn === "short" ? "" + dndIcoHtml("coffee", 12) + " Кор." : res.restoreOn === "long" || res.restoreOn === "long_once" ? "" + dndIcoHtml("bed", 12) + " Длин." : res.restoreOn === "turn" ? "" + dndIcoHtml("reset", 12) + " Каждый ход" : "–";

    card.innerHTML =
      '<div class="resource-header">' +
        '<span class="resource-icon">' + res.icon + '</span>' +
        '<span class="resource-name">' + escapeHtml(res.name) +
          (dieSize ? ' <span class="resource-die">(' + escapeHtml(dieSize) + ')</span>' : '') + '</span>' +
        '<span class="resource-restore-badge">' + restLabel + '</span>' +
      '</div>' +
      (isPool
        ? '<div class="resource-pool-row">' +
            '<div class="resource-pool-val" id="res-pool-' + res.id + '">' + (max - used) + ' / ' + max + '</div>' +
            '<div class="resource-pool-btns">' +
              '<button class="res-btn" onclick="spendResource(\'' + res.id + '\',1)">−1</button>' +
              '<button class="res-btn" onclick="spendResource(\'' + res.id + '\',-1)">+1</button>' +
            '</div>' +
          '</div>'
        : '<div class="resource-counter-row">' +
            '<button class="res-btn res-btn-use" onclick="spendResource(\'' + res.id + '\',1)" ' + (remaining <= 0 ? 'disabled' : '') + '>Использовать</button>' +
            '<span class="resource-count" id="res-count-' + res.id + '">' + remaining + ' / ' + (max === 99 ? '∞' : max) + '</span>' +
            '<button class="res-btn res-btn-reset" onclick="resetResource(\'' + res.id + '\')">Сброс</button>' +
          '</div>'
      ) +
      pipsHtml +
      '<div class="resource-desc">' + escapeHtml(res.desc) + '</div>';

    grid.appendChild(card);
  });
}

function spendResource(id, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var data = getCharResourceDefs(char);
  if (!data) return;
  var res = data.resources.find(function(r) { return r.id === id; });
  if (!res) return;
  var max = getResourceMax(res, char);
  var used = char.resources[id] || 0;
  used = Math.min(max, Math.max(0, used + delta));
  char.resources[id] = used;
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderClassResources();
}

function resetResource(id) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  char.resources[id] = 0;
  saveToLocal();
  renderClassResources();
}

function toggleResourcePip(id, pipIdx) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var data = getCharResourceDefs(char);
  if (!data) return;
  var res = data.resources.find(function(r) { return r.id === id; });
  if (!res) return;
  var max = getResourceMax(res, char);
  var used = char.resources[id] || 0;
  var remaining = max - used;
  // pip 0..remaining-1 = full, click to use; remaining..max-1 = empty, click to restore
  if (pipIdx < remaining) {
    used = Math.min(max, used + (remaining - pipIdx));
  } else {
    used = Math.max(0, pipIdx);
  }
  char.resources[id] = used;
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderClassResources();
}

// Сбросить ресурсы по типу отдыха
function resetResourcesByRest(restType) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var data = getCharResourceDefs(char);
  if (!data || !data.resources) return;
  data.resources.forEach(function(res) {
    if (restType === "long") {
      char.resources[res.id] = 0;
    } else if (restType === "short" && (res.restoreOn === "short")) {
      char.resources[res.id] = 0;
    }
  });
  saveToLocal();
  renderClassResources();
}

// showHPToast already supports customMsg (patched in place above)

// ============================================================
// ВЕРСИЯ ПРИЛОЖЕНИЯ
// ============================================================
(function() {
  var el = $("app-version-badge");
  if (el && typeof APP_VERSION !== "undefined") {
    el.textContent = "v" + APP_VERSION + " (" + APP_VERSION_DATE + ")";
  }
})();

// ============================================================
// ЖУРНАЛ ПЕРСОНАЖА — история изменений
// ============================================================

function getJournal(char) {
  if (!char.journal) char.journal = [];
  return char.journal;
}

function addJournalEntry(type, text, details) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var journal = getJournal(char);
  var now = new Date();
  var dateStr = now.toLocaleDateString("ru-RU", { day:"numeric", month:"short", year:"numeric" });
  var timeStr = now.toLocaleTimeString("ru-RU", { hour:"2-digit", minute:"2-digit" });
  journal.unshift({
    id: Date.now(),
    type: type,        // levelup | rest | stat | feat | note | combat | story | loot | death
    text: text,
    details: details || "",
    date: dateStr,
    time: timeStr,
    level: char.level || 1
  });
  if (journal.length > 200) journal.pop();
  saveToLocal();
}

var journalFilter = "all";
function filterJournal(type, btn) {
  journalFilter = type;
  document.querySelectorAll(".jfilter-btn").forEach(function(b) { b.classList.remove("active"); });
  if (btn) btn.classList.add("active");
  renderJournal();
}

function renderJournal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var list = $("journal-list");
  if (!list) return;
  var journal = getJournal(char);
  var filtered = journalFilter === "all" ? journal : journal.filter(function(e) { return e.type === journalFilter; });

  if (filtered.length === 0) {
    list.innerHTML = '<div class="journal-empty">' + dndIcoHtml("inbox", 22) + ' Нет записей' + (journalFilter !== "all" ? " в этой категории" : "") + '</div>';
    return;
  }

  var typeIcons = { levelup:"📈", rest:"🛏️", stat:"⚡", feat:"🎯", note:"📝", combat:"⚔️", story:"📖", loot:"💎", death:"💀" };
  var typeColors = { levelup:"#4da843", rest:"#5b9bd5", stat:"#d4a843", feat:"#9b59b6", note:"#9a9ab0", combat:"#e74c3c", story:"#d4ac0d", loot:"#f39c12", death:"#7f8c8d" };

  list.innerHTML = filtered.map(function(entry) {
    var icon = typeIcons[entry.type] || "📝";
    var color = typeColors[entry.type] || "#9a9ab0";
    return '<div class="journal-entry" style="border-left-color:' + color + '">' +
      '<div class="journal-entry-header">' +
        '<span class="journal-icon">' + icon + '</span>' +
        '<span class="journal-text">' + escapeHtml(entry.text) + '</span>' +
        '<button class="journal-del-btn" onclick="deleteJournalEntry(' + entry.id + ')">✕</button>' +
      '</div>' +
      (entry.details ? '<div class="journal-details">' + escapeHtml(entry.details) + '</div>' : '') +
      '<div class="journal-meta">' + escapeHtml(entry.date) + ' ' + escapeHtml(entry.time) + ' · ' + (entry.level || 1) + ' ур.</div>' +
    '</div>';
  }).join("");
}

function deleteJournalEntry(id) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.journal) return;
  char.journal = char.journal.filter(function(e) { return e.id !== id; });
  saveToLocal();
  renderJournal();
}

function openAddJournalEntry() {
  $("add-journal-modal")?.classList.add("active");
  $("journal-entry-text").value = "";
}
function closeAddJournalEntry() {
  $("add-journal-modal")?.classList.remove("active");
}
function saveJournalEntry() {
  var type = $("journal-entry-type")?.value || "note";
  var text = $("journal-entry-text")?.value.trim() || "";
  if (!text) { showToast("Введите описание события", "warn"); return; }
  var typeNames = { note:"Заметка", combat:"Бой", story:"Сюжет", loot:"Добыча", death:"Смерть" };
  addJournalEntry(type, typeNames[type] + ": " + text);
  closeAddJournalEntry();
  renderJournal();
}

// ============================================================
// ПРИХВОСТНИ / КОМПАНЬОНЫ
// ============================================================
var COMPANION_TYPE_ICONS = {
  familiar:"🦅", mount:"🐴", summoned:"✨", beast:"🐺", construct:"🤖", other:"🐾"
};
var COMPANION_TYPE_NAMES = {
  familiar:"Фамильяр", mount:"Скакун", summoned:"Призванный", beast:"Зверь", construct:"Конструкт", other:"Прочее"
};

function getCompanions(char) {
  if (!char.companions) char.companions = [];
  return char.companions;
}

function renderCompanions() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var companions = getCompanions(char);

  // Update counts
  var countEl = $("companions-count");
  if (countEl) countEl.textContent = companions.length > 0 ? companions.length : "";

  // Render in both sheet and world tab
  ["companions-list-sheet", "companions-list-world"].forEach(function(elId) {
    var list = $(elId);
    if (!list) return;
    if (companions.length === 0) {
      list.innerHTML = '<div class="party-empty">' + dndIcoHtml("inbox", 22) + ' Нет прихвостней</div>';
      return;
    }
    list.innerHTML = companions.map(function(c, i) {
      var icon = COMPANION_TYPE_ICONS[c.type] || "🐾";
      var hpPct = c.hpMax > 0 ? Math.round((c.hpCurrent / c.hpMax) * 100) : 100;
      var hpColor = hpPct > 60 ? "#4da843" : hpPct > 30 ? "#e67e22" : "#e74c3c";
      return '<div class="pcard pcard-companion">' +
        '<div class="pcard-icon" style="background:rgba(155,89,182,0.15);color:#9b59b6">' + icon + '</div>' +
        '<div class="pcard-body">' +
          '<div class="pcard-name">' + escapeHtml(c.name) + '</div>' +
          '<div class="pcard-sub">' + escapeHtml(COMPANION_TYPE_NAMES[c.type] || c.type) + ' · КД ' + (c.ac || 10) + '</div>' +
          (c.attack ? '<div class="pcard-desc">' + dndIcoHtml("sword", 12) + ' ' + escapeHtml(c.attack) + '</div>' : '') +
          '<div class="companion-hp-row">' +
            '<span style="color:' + hpColor + ';font-size:0.8em;font-weight:700;">' + dndIcoHtml("heart", 12) + ' ' + c.hpCurrent + '/' + c.hpMax + '</span>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',-1)">-1</button>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',1)">+1</button>' +
          '</div>' +
        '</div>' +
        '<div class="pcard-actions">' +
          '<button class="pcard-edit-btn" onclick="openEditCompanionModal(' + i + ')">' + dndIcoHtml("edit", 14) + '</button>' +
          '<button class="pcard-del-btn" onclick="deleteCompanion(' + i + ')">✕</button>' +
        '</div>' +
      '</div>';
    }).join("");
  });
}

function companionHP(i, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var companions = getCompanions(char);
  if (!companions[i]) return;
  companions[i].hpCurrent = Math.max(0, Math.min(companions[i].hpMax, (companions[i].hpCurrent || 0) + delta));
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderCompanions();
}

// Однократно наполняет <select> формами фамильяра из таблицы FAMILIAR_FORMS
function buildFamiliarFormOptions() {
  var sel = $("companion-familiar-form-sel");
  if (!sel || sel.dataset.built === "1" || typeof FAMILIAR_FORMS === "undefined") return;
  var html = '<option value="">— своя форма —</option>';
  FAMILIAR_FORMS.forEach(function(f) {
    html += '<option value="' + f.id + '">' + (f.icon ? f.icon + ' ' : '') + escapeHtml(f.name) + '</option>';
  });
  sel.innerHTML = html;
  sel.dataset.built = "1";
}

// Показывает пикер формы только для типа «Фамильяр»
function onCompanionTypeChange() {
  var row = $("companion-familiar-row");
  if (!row) return;
  var isFamiliar = ($("companion-type-sel")?.value === "familiar");
  row.style.display = isFamiliar ? "" : "none";
}

// Автозаполнение статов из выбранной формы фамильяра
function applyFamiliarForm() {
  var sel = $("companion-familiar-form-sel");
  if (!sel || !sel.value || typeof familiarFormById === "undefined") return;
  var f = familiarFormById(sel.value);
  if (!f) return;
  $("companion-name-inp").value = f.name;
  $("companion-hp-inp").value = f.hp;
  $("companion-ac-inp").value = f.ac;
  $("companion-attack-inp").value = f.attack === "—" ? "" : f.attack;
  $("companion-desc-inp").value = f.desc;
}

function openAddCompanionModal(presetType) {
  buildFamiliarFormOptions();
  $("companion-modal-title").innerHTML = dndIcoHtml("wolf", 16) + " Добавить прихвостня";
  $("companion-edit-index").value = "-1";
  $("companion-name-inp").value = "";
  $("companion-type-sel").value = presetType || "familiar";
  $("companion-hp-inp").value = "10";
  $("companion-ac-inp").value = "10";
  $("companion-attack-inp").value = "";
  $("companion-desc-inp").value = "";
  var fs = $("companion-familiar-form-sel"); if (fs) fs.value = "";
  onCompanionTypeChange();
  $("add-companion-modal")?.classList.add("active");
}

// Призыв фамильяра из карточки заклинания «Поиск фамильяра»
function summonFamiliar() {
  if (!currentId) { showToast("Сначала выберите персонажа", "warn"); return; }
  openAddCompanionModal("familiar");
  $("companion-modal-title").innerHTML = dndIcoHtml("wolf", 16) + " Призвать фамильяра";
}

// CAST-5: модалка спутника, предзаполненная дескриптором призыва
// (buildCompanionPrefill, spell-effects.js). Поверх openAddCompanionModal;
// saveCompanion не меняется — игрок может поправить любые поля и сохранить
// спутника обычным путём.
function openPrefilledCompanionModal(prefill, title) {
  if (!currentId) { showToast("Сначала выберите персонажа", "warn"); return; }
  openAddCompanionModal(prefill && prefill.type);
  $("companion-modal-title").innerHTML = title ? escapeHtml(title) : (dndIcoHtml("sparkle", 16) + " Призыв существа");
  if (!prefill) return;
  if (prefill.name != null)   $("companion-name-inp").value = prefill.name;
  if (prefill.hp != null)     $("companion-hp-inp").value = prefill.hp;
  if (prefill.ac != null)     $("companion-ac-inp").value = prefill.ac;
  if (prefill.attack != null) $("companion-attack-inp").value = prefill.attack;
  if (prefill.desc != null)   $("companion-desc-inp").value = prefill.desc;
}
function openEditCompanionModal(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var c = getCompanions(char)[i];
  if (!c) return;
  buildFamiliarFormOptions();
  $("companion-modal-title").innerHTML = dndIcoHtml("edit", 16) + " Редактировать прихвостня";
  $("companion-edit-index").value = i;
  $("companion-name-inp").value = c.name || "";
  $("companion-type-sel").value = c.type || "other";
  $("companion-hp-inp").value = c.hpMax || 10;
  $("companion-ac-inp").value = c.ac || 10;
  $("companion-attack-inp").value = c.attack || "";
  $("companion-desc-inp").value = c.desc || "";
  var fs = $("companion-familiar-form-sel"); if (fs) fs.value = "";
  onCompanionTypeChange();
  $("add-companion-modal")?.classList.add("active");
}
function closeAddCompanionModal() {
  $("add-companion-modal")?.classList.remove("active");
}
function saveCompanion() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var name = $("companion-name-inp")?.value.trim() || "";
  if (!name) { showToast("Введите имя", "warn"); return; }
  var idx = parseInt($("companion-edit-index").value, 10);
  var companions = getCompanions(char);
  var hpMax = parseInt($("companion-hp-inp")?.value, 10) || 10;
  var data = {
    id: idx >= 0 ? (companions[idx].id || Date.now()) : Date.now(),
    name: name,
    type: $("companion-type-sel")?.value || "other",
    hpMax: hpMax,
    hpCurrent: idx >= 0 ? companions[idx].hpCurrent : hpMax,
    ac: parseInt($("companion-ac-inp")?.value, 10) || 10,
    attack: $("companion-attack-inp")?.value.trim() || "",
    desc: $("companion-desc-inp")?.value.trim() || "",
    status: "healthy"
  };
  if (idx >= 0) companions[idx] = data; else companions.push(data);
  saveToLocal();
  renderCompanions();
  closeAddCompanionModal();
}
function deleteCompanion(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var name = char.companions[i] ? char.companions[i].name : "прихвостня";
  showConfirmModal("Удалить прихвостня?", "«" + name + "» будет удалён.", function() {
    char.companions.splice(i, 1);
    saveToLocal();
    renderCompanions();
  });
}


// ============================================================
// ЭКРАН ПРОФИЛЕЙ — вкладки и чейнджлог
// ============================================================
function switchProfilesTab(tab, btn) {
  document.querySelectorAll(".ptab-btn").forEach(function(b) { b.classList.remove("active"); });
  document.querySelectorAll(".ptab-content").forEach(function(c) { c.style.display = "none"; });
  if (btn) btn.classList.add("active");
  var el = $("ptab-" + tab);
  if (el) el.style.display = "";
  if (tab === "changelog") renderChangelog();
}

// Подробный лог релизов — docs/RELEASES.md (генерится tools/gen-release-log.js):
// коммиты, изменённые файлы и ссылка на полный патч. Якорь версии — "v" + номер.
var RELEASES_URL = "https://github.com/D1MANYCH/dnd-app/blob/main/docs/RELEASES.md";

// В списке версий держим смысл одной-двумя строками: длинные записи режем по границе
// предложения или слова, полный текст открывается кнопкой «ещё».
function clipChangelogText(text) {
  var LIMIT = 130;
  if (text.length <= LIMIT) return null;
  var cut = text.slice(0, LIMIT);
  var dot = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  if (dot > 70) return cut.slice(0, dot + 1);
  var sp = cut.lastIndexOf(" ");
  return (sp > 70 ? cut.slice(0, sp) : cut) + "…";
}

// Разворачивает обрезанную запись на месте: полный текст лежит в data-full.
function expandChangelogItem(btn) {
  var wrap = btn.parentNode;
  if (!wrap) return;
  wrap.textContent = btn.getAttribute("data-full") || wrap.textContent;
}

function renderChangelog() {
  var list = $("changelog-list");
  if (!list || typeof APP_CHANGELOG === "undefined") return;

  var typeIcon  = { feat:"✨", fix:"🐛", improve:"⚡", chore:"🔧" };
  var typeLabel = { feat:"Новое", fix:"Исправлено", improve:"Улучшено", chore:"Под капотом" };
  var typeColor = { feat:"#4da843", fix:"#e74c3c", improve:"#5b9bd5", chore:"#9a9ab0" };
  var badgeHtml = { new:'<span class="cl-badge cl-badge-new">НОВОЕ</span>' };

  list.innerHTML = APP_CHANGELOG.map(function(ver, idx) {
    var items = ver.changes.map(function(c) {
      var icon  = typeIcon[c.type]  || "•";
      var color = typeColor[c.type] || "#9a9ab0";
      var text  = String(c.text);
      var short = clipChangelogText(text);
      var body  = short
        ? escapeHtml(short) + ' <button type="button" class="cl-more" data-full="' + escapeHtml(text) + '" onclick="expandChangelogItem(this)">ещё</button>'
        : escapeHtml(text);
      return '<div class="cl-item"><span class="cl-item-icon" style="color:' + color + '">' + icon + '</span><span class="cl-item-text">' + body + '</span></div>';
    }).join("");

    var isLatest = idx === 0;
    return '<div class="cl-version' + (isLatest ? " cl-version-latest" : "") + '">' +
      '<div class="cl-version-header">' +
        '<span class="cl-version-num">v' + escapeHtml(ver.version) + '</span>' +
        (isLatest ? '<span class="cl-badge cl-badge-new">Текущая</span>' : '') +
        '<span class="cl-version-date">' + escapeHtml(ver.date) + '</span>' +
        '<a class="cl-version-link" href="' + RELEASES_URL + '#v' + encodeURIComponent(ver.version) + '" target="_blank" rel="noopener" title="Что менялось в коде: коммиты, файлы, полный патч">подробно ↗</a>' +
      '</div>' +
      '<div class="cl-items">' + items + '</div>' +
    '</div>';
  }).join("");
}

// Рендерим при старте
(function() {
  var versionBadge = $("app-version-badge");
  if (versionBadge && typeof APP_VERSION !== "undefined") {
    versionBadge.textContent = "v" + APP_VERSION;
  }
  renderChangelog();
})();

// ── Item Reference Modal ──
function openItemRef(tab) {
  var modal = $("item-ref-modal");
  if (modal) modal.classList.add("active");
  switchItemRef(tab || 'weight', null);
}
function closeItemRef() {
  var modal = $("item-ref-modal");
  if (modal) modal.classList.remove("active");
}
function switchItemRef(tab, btnEl) {
  [$("item-ref-weight"), $("item-ref-slots")].forEach(function(el) {
    if (el) el.classList.add("hidden");
  });
  document.querySelectorAll(".item-ref-tab").forEach(function(b) { b.classList.remove("active"); });
  var section = $("item-ref-" + tab);
  if (section) section.classList.remove("hidden");
  if (btnEl) btnEl.classList.add("active");
  else {
    var btn = document.querySelector(".item-ref-tab[onclick*=\"'" + tab + "'\"]");
    if (btn) btn.classList.add("active");
  }
}

// UI-fix: держим CSS-переменную --header-h равной реальной высоте <header>.
// Статус-бар стакается под шапкой (top:var(--header-h)); высота шапки меняется
// от контента (подзаголовок класс·раса), масштаба шрифта и ширины — поэтому
// синхронизируем через ResizeObserver, а не магической константой.
function _syncHeaderHeight() {
  var h = document.querySelector("header");
  if (!h) return;
  var px = Math.round(h.getBoundingClientRect().height);
  if (px > 0) document.documentElement.style.setProperty("--header-h", px + "px");
}
document.addEventListener("DOMContentLoaded", function () {
  _syncHeaderHeight();
  var h = document.querySelector("header");
  if (h && typeof ResizeObserver === "function") {
    try { new ResizeObserver(_syncHeaderHeight).observe(h); } catch (e) {}
  }
  window.addEventListener("resize", _syncHeaderHeight);
});
