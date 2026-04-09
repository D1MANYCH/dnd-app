// ============================================================
// app-ui.js — Интерфейс: аватар, кубики, аккордеоны,
// ресурсы класса, ASI, журнал, спутники, черты, профили
// ============================================================

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
      preview.innerHTML = "<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>";
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
  if (preview) preview.innerHTML = "<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>";
  renderSheetAvatar();
  renderCharacterList();
  showToast("Аватар удалён", "info");
}

/** Обновить аватар в шапке листа персонажа */
function renderSheetAvatar() {
  const el = $("sheet-avatar");
  if (!el) return;
  const char = getCurrentChar();
  if (char && char.avatar) {
    el.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\" onclick=\"openAvatarModal(event)\">";
    el.classList.add("has-avatar");
  } else {
    const icon = char ? getClassIcon(char.class) : "🎭";
    el.innerHTML = "<span onclick=\"openAvatarModal(event)\">" + icon + "</span>";
    el.classList.remove("has-avatar");
  }
}

function openDiceModal() {
const modal = $("dice-modal");
if (modal) modal.classList.add("active");
drawDiceSVG(20);
var numEl = $("dice-svg-num");
if (numEl) numEl.textContent = "?";
}
function closeDiceModal() {
const modal = $("dice-modal");
if (modal) modal.classList.remove("active");
const display = $("dice-result-display");
if (display) display.classList.remove("crit-success", "crit-fail", "normal");
}
function rollDice(sides, mode) {
const r1 = Math.floor(Math.random() * sides) + 1;
const r2 = (mode === 'adv' || mode === 'dis') ? Math.floor(Math.random() * sides) + 1 : null;
let result, resultLabel;
if (mode === 'adv') {
  result = Math.max(r1, r2);
  resultLabel = "Преимущество: " + r1 + " и " + r2;
} else if (mode === 'dis') {
  result = Math.min(r1, r2);
  resultLabel = "Помеха: " + r1 + " и " + r2;
} else {
  result = r1;
  resultLabel = "d" + sides;
}
const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// 3D dice animation
animateDice3d(sides, result, function() {
  var resultBig = $("dice-result-big");
  var resultInfo = $("dice-result-info");
  var resultBox = $("dice3d-result");
  // Show dual dice for adv/dis
  if (typeof showDualDice === 'function') {
    showDualDice({ mode: mode || 'normal', roll: result, r1: r1, r2: r2 });
  }
  if (resultBig) resultBig.textContent = result;
  if (resultBox) {
    resultBox.classList.remove("crit-success","crit-fail","normal");
    if (sides === 20 && result === 20) {
      resultBox.classList.add("crit-success");
      if (resultInfo) resultInfo.textContent = "🎉 КРИТИЧЕСКИЙ УСПЕХ!";
      createParticles();
    } else if (sides === 20 && result === 1) {
      resultBox.classList.add("crit-fail");
      if (resultInfo) resultInfo.textContent = "💀 КРИТИЧЕСКИЙ ПРОВАЛ!";
    } else {
      resultBox.classList.add("normal");
      if (resultInfo) resultInfo.textContent = resultLabel + " · " + timestamp;
    }
    resultBox.classList.add("pop");
    setTimeout(function(){ if(resultBox) resultBox.classList.remove("pop"); }, 400);
  }
});
diceHistory.unshift({ sides: sides, result: result, mode: mode || 'normal', time: timestamp, r1: r1, r2: r2 });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}

// 3D polyhedra face data for each die type
var DICE_3D = {
  4: {
    // Tetrahedron — 3 visible faces
    faces: [
      { points: "60,14 22,96 60,68", shade: 0.95 },
      { points: "60,14 98,96 60,68", shade: 0.6 },
      { points: "22,96 98,96 60,68", shade: 0.3 }
    ],
    color: "#c0392b", glow: "#e74c3c", numY: 58, animClass: "dsvg-roll-d4"
  },
  6: {
    // Cube — isometric 3 visible faces
    faces: [
      { points: "60,14 102,36 60,56 18,36", shade: 1.0 },
      { points: "18,36 60,56 60,100 18,80", shade: 0.6 },
      { points: "60,56 102,36 102,80 60,100", shade: 0.35 }
    ],
    color: "#2980b9", glow: "#3498db", numY: 62, animClass: "dsvg-roll-d6"
  },
  8: {
    // Octahedron — 4 visible triangular faces
    faces: [
      { points: "60,6 18,58 60,54", shade: 1.0 },
      { points: "60,6 102,58 60,54", shade: 0.75 },
      { points: "18,58 60,54 56,114", shade: 0.5 },
      { points: "102,58 60,54 64,114", shade: 0.28 }
    ],
    color: "#27ae60", glow: "#2ecc71", numY: 40, animClass: "dsvg-roll-d8"
  },
  10: {
    // Pentagonal trapezohedron — kite faces
    faces: [
      { points: "60,8 96,36 60,58 24,36", shade: 1.0 },
      { points: "24,36 60,58 36,100 8,60", shade: 0.72 },
      { points: "60,58 96,36 112,60 84,100", shade: 0.42 },
      { points: "36,100 84,100 60,58", shade: 0.22 }
    ],
    color: "#8e44ad", glow: "#9b59b6", numY: 46, animClass: "dsvg-roll-d10"
  },
  12: {
    // Dodecahedron — pentagon faces
    faces: [
      { points: "60,10 94,30 100,66 60,82 20,66 26,30", shade: 1.0 },
      { points: "20,66 60,82 46,112 12,92", shade: 0.58 },
      { points: "60,82 100,66 108,92 74,112", shade: 0.34 },
      { points: "46,112 74,112 60,82", shade: 0.18 }
    ],
    color: "#e67e22", glow: "#f39c12", numY: 50, animClass: "dsvg-roll-d12"
  },
  20: {
    // Icosahedron — multiple triangular faces
    faces: [
      { points: "60,6 94,24 60,50", shade: 1.0 },
      { points: "60,6 26,24 60,50", shade: 0.88 },
      { points: "26,24 10,58 42,56", shade: 0.72 },
      { points: "94,24 110,58 78,56", shade: 0.62 },
      { points: "26,24 60,50 42,56", shade: 0.8 },
      { points: "94,24 60,50 78,56", shade: 0.7 },
      { points: "10,58 42,56 34,90", shade: 0.48 },
      { points: "110,58 78,56 86,90", shade: 0.36 },
      { points: "42,56 78,56 60,88", shade: 0.55 },
      { points: "42,56 34,90 60,88", shade: 0.42 },
      { points: "78,56 86,90 60,88", shade: 0.3 },
      { points: "34,90 60,114 60,88", shade: 0.22 },
      { points: "86,90 60,114 60,88", shade: 0.15 }
    ],
    color: "#c9a040", glow: "#f1c40f", numY: 38, animClass: "dsvg-roll-d20"
  },
  100: {
    faces: [],
    color: "#16a085", glow: "#1abc9c", numY: 64, animClass: "dsvg-roll-d100",
    isCircle: true
  }
};

function diceFaceColor(color, glow, shade) {
  var r1 = parseInt(color.slice(1,3),16), g1 = parseInt(color.slice(3,5),16), b1 = parseInt(color.slice(5,7),16);
  var r2 = parseInt(glow.slice(1,3),16), g2 = parseInt(glow.slice(3,5),16), b2 = parseInt(glow.slice(5,7),16);
  var r, g, b;
  if (shade > 0.7) {
    var t = (shade - 0.7) / 0.3;
    r = Math.round(r1 + (r2 - r1) * t);
    g = Math.round(g1 + (g2 - g1) * t);
    b = Math.round(b1 + (b2 - b1) * t);
  } else {
    var f = shade / 0.7;
    r = Math.round(r1 * f);
    g = Math.round(g1 * f);
    b = Math.round(b1 * f);
  }
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function drawDiceSVG(sides) {
  var svgEl = $("dice-svg");
  var shape = $("dice-svg-shape");
  var numEl = $("dice-svg-num");
  var typeEl = $("dice-svg-type");
  if (!svgEl || !shape) return;
  var d = DICE_3D[sides] || DICE_3D[20];
  svgEl.style.setProperty("--dice-glow", d.glow);

  var highlightId = "diceHL" + sides;
  var html =
    '<defs>' +
      '<radialGradient id="' + highlightId + '" cx="35%" cy="25%" r="55%">' +
        '<stop offset="0%" stop-color="white" stop-opacity="0.38"/>' +
        '<stop offset="100%" stop-color="white" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>';

  if (d.isCircle) {
    html += '<circle cx="60" cy="60" r="52" fill="' + diceFaceColor(d.color, d.glow, 0.7) + '" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>';
    html += '<circle cx="60" cy="60" r="52" fill="url(#' + highlightId + ')"/>';
    html += '<ellipse cx="60" cy="60" rx="52" ry="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.8"/>';
    html += '<ellipse cx="60" cy="60" rx="20" ry="52" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="0.8"/>';
    html += '<ellipse cx="60" cy="60" rx="42" ry="42" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.6" transform="rotate(30,60,60)"/>';
  } else {
    for (var i = 0; i < d.faces.length; i++) {
      var face = d.faces[i];
      html += '<polygon points="' + face.points + '" fill="' + diceFaceColor(d.color, d.glow, face.shade) + '" stroke="rgba(255,255,255,0.18)" stroke-width="0.8" stroke-linejoin="round"/>';
    }
    if (d.faces.length > 0) {
      html += '<polygon points="' + d.faces[0].points + '" fill="url(#' + highlightId + ')"/>';
    }
  }

  shape.innerHTML = html;
  if (numEl) { numEl.setAttribute("y", d.numY || 64); }
  if (typeEl) typeEl.textContent = "d" + sides;

  // Update table shadow color
  var container = document.querySelector('.dsvg-container');
  if (container) container.setAttribute('data-glow', d.glow);
}

function animateDice3d(sides, result, callback) {
  var svgContainer = document.querySelector(".dsvg-container");
  var dieEl = document.getElementById("dice-3d-die");
  var numEl = $("dice-svg-num");
  if (!svgContainer || !dieEl) { callback(); return; }
  drawDiceSVG(sides);
  var d = DICE_3D[sides] || DICE_3D[20];
  // Hide number during roll
  if (numEl) { numEl.style.opacity = "0.6"; }
  // Rapidly cycling numbers
  var rollSpeed = 50;
  var rollInterval = setInterval(function() {
    if (numEl) numEl.textContent = Math.floor(Math.random() * sides) + 1;
  }, rollSpeed);
  // Slow down numbers near the end
  var slowDown = setTimeout(function() {
    clearInterval(rollInterval);
    rollInterval = setInterval(function() {
      if (numEl) numEl.textContent = Math.floor(Math.random() * sides) + 1;
    }, 120);
  }, 550);
  // Remove old animation classes
  var allRollClasses = ["dsvg-shake", "dsvg-land",
    "dsvg-roll-d4","dsvg-roll-d6","dsvg-roll-d8","dsvg-roll-d10","dsvg-roll-d12","dsvg-roll-d20","dsvg-roll-d100"];
  allRollClasses.forEach(function(c) { svgContainer.classList.remove(c); dieEl.classList.remove(c); });
  void svgContainer.offsetWidth;
  // Apply die-specific roll animation
  dieEl.classList.add(d.animClass);
  svgContainer.classList.add("dsvg-shake");
  setTimeout(function() {
    clearTimeout(slowDown);
    clearInterval(rollInterval);
    svgContainer.classList.remove("dsvg-shake");
    dieEl.classList.remove(d.animClass);
    if (numEl) {
      numEl.textContent = result;
      numEl.style.opacity = "1";
    }
    // Land with bounce
    svgContainer.classList.add("dsvg-land");
    setTimeout(function() {
      svgContainer.classList.remove("dsvg-land");
      callback();
    }, 400);
  }, 800);
}

function rollCustomFormula() {
const input = $("dice-custom-input");
if (!input) return;
const formula = input.value.trim().toLowerCase().replace(/к/g,"d").replace(/\s/g,"");
if (!formula) return;
// Parse NdX+M or NdX-M or just NdX
const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/);
if (!match) { 
  const display = $("dice-result-display");
  const resultInfo = $("dice-result-info");
  if (display) { display.classList.remove("crit-success","crit-fail","normal"); display.classList.add("normal"); }
  if (resultInfo) resultInfo.textContent = "Неверный формат (пример: 2к6+3)";
  return; 
}
const count = Math.min(parseInt(match[1]) || 1, 20);
const sides = Math.min(parseInt(match[2]) || 6, 100);
const bonus = parseInt(match[3] || "0");
let rolls = [], total = 0;
for (let i = 0; i < count; i++) { const r = Math.floor(Math.random() * sides)+1; rolls.push(r); total += r; }
total += bonus;
total = Math.max(1, total);
const timestamp = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const display = $("dice-result-display");
const resultBig = $("dice-result-big");
const resultInfo = $("dice-result-info");
if (!display||!resultBig||!resultInfo) return;
display.classList.remove("crit-success","crit-fail","normal"); void display.offsetWidth;
display.classList.add("normal");
resultBig.textContent = total;
const rollStr = rolls.join("+") + (bonus !== 0 ? (bonus>0?"+":"")+bonus : "");
resultInfo.textContent = formula.replace(/d/g,"к") + " = " + rollStr + (count>1||bonus!==0?" = "+total:"");
diceHistory.unshift({ sides: sides, result: total, mode: "custom", formula: formula.replace(/d/g,"к"), time: timestamp });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}
function renderDiceHistory() {
const container = $("dice-history");
if (!container) return;
container.innerHTML = "";
diceHistory.forEach(function(record) {
const div = document.createElement("div");
div.className = "dice-history-item";
if (record.sides === 20) {
if (record.result === 20) div.classList.add("crit-success");
else if (record.result === 1) div.classList.add("crit-fail");
}
const modeTag = record.mode === 'adv' ? ' ▲' : record.mode === 'dis' ? ' ▼' : '';
const label = record.mode === 'custom' ? (record.formula || "custom") : ("d" + record.sides + modeTag);
div.innerHTML = "<span>" + label + " (" + record.time + ")</span><span>" + record.result + "</span>";
container.appendChild(div);
});
}
function createParticles() {
const display = $("dice-result-display");
if (!display) return;
for (let i = 0; i < 20; i++) {
const particle = document.createElement("div");
particle.className = "particle";
particle.style.left = (Math.random() * 100) + "%";
particle.style.top = (Math.random() * 100) + "%";
particle.style.animationDelay = (Math.random() * 0.5) + "s";
display.appendChild(particle);
setTimeout(() => particle.remove(), 1000);
}
}

// ============================================
// АСИ — Улучшение характеристик
// ============================================
// openASIModal и closeASIModal определены ниже

// ============================================================
// Регистрация Service Worker + автообнаружение обновлений
// ============================================================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    checkWhatsNew();
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('[PWA] SW зарегистрирован:', reg.scope);
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
        console.log('[PWA] SW ошибка:', err);
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
        '<div class="sw-update-icon">🎲</div>' +
        '<div class="sw-update-title">Доступно обновление!</div>' +
        '<div class="sw-update-version">Текущая версия: v' + escapeHtml(ver) + '</div>' +
      '</div>' +
      '<div class="sw-update-safe">🔒 <b>Персонажи и данные сохранятся</b> — обновление меняет только код приложения, данные хранятся отдельно в браузере</div>' +
      '<div class="sw-update-btns"><button id="sw-update-later">Позже</button><button id="sw-update-now">⚡ Установить обновление</button></div>' +
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
  var typeIcon  = { feat:'✨', fix:'🐛', improve:'⚡', data:'📦' };
  var typeColor = { feat:'#4da843', fix:'#e74c3c', improve:'#5b9bd5', data:'#d4a843' };
  var changesList = latest ? latest.changes.map(function(c) {
    return '<div class="sw-change-item"><span class="sw-change-icon" style="color:' + (typeColor[c.type] || '#9a9ab0') + '">' + (typeIcon[c.type] || '•') + '</span><span class="sw-change-text">' + escapeHtml(c.text) + '</span></div>';
  }).join('') : '<div class="sw-change-item">Улучшения и исправления</div>';
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">🎉</div>' +
        '<div class="sw-update-title">Обновлено!</div>' +
        '<div class="sw-update-version">v' + escapeHtml(prevVer) + ' → v' + escapeHtml(newVer) + (latest ? ' · ' + escapeHtml(latest.date) : '') + '</div>' +
      '</div>' +
      '<div class="sw-update-changes"><div class="sw-changes-title">📋 Что нового (' + (latest ? latest.changes.length : 0) + '):</div>' + changesList + '</div>' +
      '<div class="sw-update-safe">🔒 <b>Все данные сохранены</b> — ваши персонажи и заклинания на месте</div>' +
      '<div class="sw-update-btns"><button id="sw-update-now" style="flex:1">👍 Отлично!</button></div>' +
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
  var arrow = btn.querySelector(".accordion-arrow");
  if (isOpen) {
    body.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
    if (arrow) arrow.textContent = "▸";
  } else {
    body.style.display = "";
    btn.setAttribute("aria-expanded", "true");
    if (arrow) arrow.textContent = "▾";
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
  return parseInt(raw) || 0;
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
  var data = (typeof CLASS_RESOURCES !== "undefined") && CLASS_RESOURCES[cls];

  if (!data || !data.resources || data.resources.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  grid.innerHTML = "";

  // Passive notes card
  if (data.passive && data.passive.notes) {
    var notesEl = document.createElement("div");
    notesEl.className = "resource-passive-card";
    notesEl.innerHTML = '<div class="resource-passive-title">📖 Пассивные умения ' + escapeHtml(cls) + '</div>' +
      '<pre class="resource-passive-text">' + escapeHtml(data.passive.notes) + '</pre>';
    grid.appendChild(notesEl);
  }

  // Resource cards
  data.resources.forEach(function(res) {
    var max = getResourceMax(res, char);
    if (max === 0) return; // не доступно на этом уровне

    var used = char.resources[res.id] || 0;
    if (used > max) { used = max; char.resources[res.id] = used; }
    var remaining = max - used;

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

    var restLabel = res.restoreOn === "short" ? "☕ Кор." : res.restoreOn === "long" || res.restoreOn === "long_once" ? "🛏️ Длин." : res.restoreOn === "turn" ? "🔄 Каждый ход" : "–";

    card.innerHTML =
      '<div class="resource-header">' +
        '<span class="resource-icon">' + res.icon + '</span>' +
        '<span class="resource-name">' + escapeHtml(res.name) + '</span>' +
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
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
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
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
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
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
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

// ============================================================
// АСИ — модалка выбора характеристик
// ============================================================
var asiSelectedStats = [];
var asiPendingPoints = 0; // сколько осталось распределить

var asiCurrentLevel = null; // уровень для которого применяется АСИ

function openASIModalForLevel(level) {
  asiCurrentLevel = level;
  openASIModal();
}

function openASIModal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  asiSelectedStats = [];
  asiFeatSelected = null;
  var modal = $("asi-modal");
  if (!modal) { showToast("Ошибка: АСИ модалка не найдена", "error"); return; }

  // Reset radio to plus2
  var r = modal.querySelector('input[value="plus2"]');
  if (r) r.checked = true;

  // Show level info in title if level is set
  var title = modal.querySelector("h4");
  if (title) {
    title.textContent = asiCurrentLevel
      ? "📈 Увеличение характеристик · " + asiCurrentLevel + " ур."
      : "📈 Увеличение характеристик";
  }

  buildASIStatGrid(char);
  updateASIPreview();
  modal.classList.add("active");
}

function closeASIModal() {
  var modal = $("asi-modal");
  if (modal) modal.classList.remove("active");
  asiSelectedStats = [];
  asiFeatSelected = null;
  asiCurrentLevel = null;
}

function buildASIStatGrid(char) {
  var grid = $("asi-stat-grid");
  if (!grid) return;
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var statIcons = {str:"💪",dex:"🏃",con:"❤️",int:"🧠",wis:"👁️",cha:"🎭"};
  grid.innerHTML = Object.keys(statNames).map(function(k) {
    var val = char.stats[k] || 10;
    var mod = getMod(val);
    return '<div class="asi-stat-item" id="asi-stat-' + k + '" onclick="toggleASIStat(\'' + k + '\')">' +
      '<span class="asi-stat-icon">' + statIcons[k] + '</span>' +
      '<span class="asi-stat-name">' + statNames[k] + '</span>' +
      '<span class="asi-stat-cur">' + val + ' (' + formatMod(mod) + ')</span>' +
      '<span class="asi-stat-delta" id="asi-delta-' + k + '"></span>' +
    '</div>';
  }).join("");
}

function getASIMode() {
  var r = document.querySelector('input[name="asi-mode"]:checked');
  return r ? r.value : "plus2";
}

function toggleASIStat(statKey) {
  var mode = getASIMode();
  var maxPicks = mode === "plus2" ? 1 : 2;

  var idx = asiSelectedStats.indexOf(statKey);
  if (idx > -1) {
    asiSelectedStats.splice(idx, 1);
  } else {
    if (asiSelectedStats.length >= maxPicks) {
      asiSelectedStats.shift(); // remove oldest
    }
    asiSelectedStats.push(statKey);
  }
  updateASIPreview();
}

function updateASIPreview() {
  var mode = getASIMode();
  var preview = $("asi-preview");
  var applyBtn = $("asi-apply-btn");
  var statGrid = $("asi-stat-grid");
  var featListEl = $("asi-feat-list");

  // ── Режим: выбор черты ───────────────────────────────────
  if (mode === "feat") {
    if (statGrid) statGrid.style.display = "none";
    if (featListEl) { featListEl.style.display = "block"; buildFeatList(); }
    if (preview) {
      if (asiFeatSelected) {
        var feat = typeof FEATS_DATA !== "undefined" && FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
        preview.textContent = "✅ Черта: " + (feat ? feat.name : asiFeatSelected);
        preview.className = "asi-preview ready";
      } else {
        preview.textContent = "Выберите черту из списка";
        preview.className = "asi-preview";
      }
    }
    if (applyBtn) applyBtn.disabled = !asiFeatSelected;
    return;
  }

  // ── Режим: характеристики ────────────────────────────────
  if (statGrid) statGrid.style.display = "";
  if (featListEl) featListEl.style.display = "none";
  asiFeatSelected = null;

  var maxPicks = mode === "plus2" ? 1 : 2;
  var bonus = mode === "plus2" ? 2 : 1;

  if (statGrid) {
    statGrid.querySelectorAll(".asi-stat-item").forEach(function(el) {
      el.classList.remove("selected");
      var deltaEl = $("asi-delta-" + el.id.replace("asi-stat-",""));
      if (deltaEl) deltaEl.textContent = "";
    });
    asiSelectedStats.forEach(function(k) {
      var el = $("asi-stat-" + k);
      if (el) el.classList.add("selected");
      var deltaEl = $("asi-delta-" + k);
      if (deltaEl) deltaEl.textContent = "+" + bonus;
    });
  }

  if (preview) {
    if (asiSelectedStats.length === 0) {
      preview.textContent = "Выберите характеристику";
      preview.className = "asi-preview";
    } else if (asiSelectedStats.length < maxPicks && mode === "plus1each") {
      preview.textContent = "Выберите ещё одну характеристику";
      preview.className = "asi-preview";
    } else {
      var char = getCurrentChar();
      var abbr = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
      preview.textContent = "✅ " + asiSelectedStats.map(function(k) {
        return abbr[k] + ": " + char.stats[k] + " → " + (char.stats[k] + bonus);
      }).join("   ");
      preview.className = "asi-preview ready";
    }
  }

  var ready = (mode === "plus2" && asiSelectedStats.length === 1) ||
              (mode === "plus1each" && asiSelectedStats.length === 2);
  if (applyBtn) applyBtn.disabled = !ready;
}

// applyASI определена ниже (обрабатывает и стат-режим и черты)

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
    list.innerHTML = '<div class="journal-empty">📭 Нет записей' + (journalFilter !== "all" ? " в этой категории" : "") + '</div>';
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
      list.innerHTML = '<div class="party-empty">📭 Нет прихвостней</div>';
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
          (c.attack ? '<div class="pcard-desc">⚔️ ' + escapeHtml(c.attack) + '</div>' : '') +
          '<div class="companion-hp-row">' +
            '<span style="color:' + hpColor + ';font-size:0.8em;font-weight:700;">❤️ ' + c.hpCurrent + '/' + c.hpMax + '</span>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',-1)">-1</button>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',1)">+1</button>' +
          '</div>' +
        '</div>' +
        '<div class="pcard-actions">' +
          '<button class="pcard-edit-btn" onclick="openEditCompanionModal(' + i + ')">✏️</button>' +
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

function openAddCompanionModal() {
  $("companion-modal-title").textContent = "🐾 Добавить прихвостня";
  $("companion-edit-index").value = "-1";
  $("companion-name-inp").value = "";
  $("companion-type-sel").value = "familiar";
  $("companion-hp-inp").value = "10";
  $("companion-ac-inp").value = "10";
  $("companion-attack-inp").value = "";
  $("companion-desc-inp").value = "";
  $("add-companion-modal")?.classList.add("active");
}
function openEditCompanionModal(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var c = getCompanions(char)[i];
  if (!c) return;
  $("companion-modal-title").textContent = "✏️ Редактировать прихвостня";
  $("companion-edit-index").value = i;
  $("companion-name-inp").value = c.name || "";
  $("companion-type-sel").value = c.type || "other";
  $("companion-hp-inp").value = c.hpMax || 10;
  $("companion-ac-inp").value = c.ac || 10;
  $("companion-attack-inp").value = c.attack || "";
  $("companion-desc-inp").value = c.desc || "";
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
  var idx = parseInt($("companion-edit-index").value);
  var companions = getCompanions(char);
  var hpMax = parseInt($("companion-hp-inp")?.value) || 10;
  var data = {
    id: idx >= 0 ? (companions[idx].id || Date.now()) : Date.now(),
    name: name,
    type: $("companion-type-sel")?.value || "other",
    hpMax: hpMax,
    hpCurrent: idx >= 0 ? companions[idx].hpCurrent : hpMax,
    ac: parseInt($("companion-ac-inp")?.value) || 10,
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

// asiFeatSelected и feat-режим обрабатываются в updateASIPreview ниже
var asiFeatSelected = null;

function buildFeatList() {
  var el = $("asi-feat-list");
  if (!el || typeof FEATS_DATA === "undefined") return;
  if (!currentId) return;
  var char = getCurrentChar();
  var takenFeats = char ? (char.feats || []) : [];

  el.innerHTML = '<div class="feat-search-wrap"><input type="text" class="feat-search-inp" placeholder="🔍 Поиск черты..." oninput="filterFeatList(this.value)"></div>' +
    '<div class="feat-list" id="feat-list-items">' +
    FEATS_DATA.map(function(feat) {
      var taken = takenFeats.some(function(f) { return f.id === feat.id; });
      var selected = asiFeatSelected === feat.id;
      return '<div class="feat-item' + (selected ? " selected" : "") + (taken ? " taken" : "") + '" onclick="selectFeat(\'' + feat.id + '\')" data-name="' + escapeHtml(feat.name.toLowerCase()) + '">' +
        '<div class="feat-item-header">' +
          '<span class="feat-item-name">' + escapeHtml(feat.name) + '</span>' +
          (feat.prereq ? '<span class="feat-prereq">' + escapeHtml(feat.prereq) + '</span>' : '') +
          (taken ? '<span class="feat-taken-badge">Уже взята</span>' : '') +
        '</div>' +
        '<div class="feat-item-desc">' + escapeHtml(feat.desc) + '</div>' +
      '</div>';
    }).join("") +
    '</div>';
}

function filterFeatList(query) {
  var q = query.toLowerCase();
  document.querySelectorAll("#feat-list-items .feat-item").forEach(function(el) {
    var name = el.dataset.name || "";
    el.style.display = name.includes(q) ? "" : "none";
  });
}

function selectFeat(id) {
  asiFeatSelected = asiFeatSelected === id ? null : id;
  buildFeatList();
  var preview = $("asi-preview");
  var applyBtn = $("asi-apply-btn");
  if (asiFeatSelected) {
    var feat = FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
    if (!feat) return;
    if (preview) { preview.textContent = "✅ Черта: " + feat.name; preview.className = "asi-preview ready"; }
    if (applyBtn) applyBtn.disabled = false;
  } else {
    if (preview) { preview.textContent = "Выберите черту"; preview.className = "asi-preview"; }
    if (applyBtn) applyBtn.disabled = true;
  }
}

function applyASI() {
  var mode = getASIMode();
  if (mode !== "feat") {
    // stat mode
    if (!currentId || asiSelectedStats.length === 0) return;
    var char = getCurrentChar();
    if (!char) return;
    var bonus = mode === "plus2" ? 2 : 1;
    var statNames2 = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
    asiSelectedStats.forEach(function(k) {
      char.stats[k] = Math.min(20, (char.stats[k] || 10) + bonus);
      safeSet("val-" + k, char.stats[k]);
      updateStatDisplay(k);
    });
    var msg = "📈 АСИ (ур." + (asiCurrentLevel||"?") + "): " + asiSelectedStats.map(function(k) { return statNames2[k] + " +" + bonus; }).join(", ");
    // Mark ASI level as used
    if (asiCurrentLevel) {
      if (!char.asiUsedLevels) char.asiUsedLevels = [];
      if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
    }
    asiCurrentLevel = null;
    addJournalEntry("stat", msg);
    saveToLocal(); calcStats(); recalculateHP(); calculateAC();
    closeASIModal();
    updateClassFeatures();
    showHPToast(0, msg);
    renderJournal();
    return;
  }

  if (!asiFeatSelected || !currentId) return;
  var char = getCurrentChar();
  if (!char) return;

  var feat = FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
  if (!feat) return;

  if (!char.feats) char.feats = [];

  // Apply effects
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var appliedDesc = [];

  (feat.effects || []).forEach(function(eff) {
    if (eff.type === "stat") {
      char.stats[eff.key] = Math.min(20, (char.stats[eff.key] || 10) + eff.value);
      safeSet("val-" + eff.key, char.stats[eff.key]);
      updateStatDisplay(eff.key);
      appliedDesc.push("+" + eff.value + " " + statNames[eff.key]);
    }
    else if (eff.type === "stat_choice" || eff.type === "stat_choice_save") {
      // Pick first available stat that isn't at 20
      var picked = eff.keys.find(function(k) { return (char.stats[k] || 10) < 20; });
      if (picked) {
        char.stats[picked] = Math.min(20, (char.stats[picked] || 10) + eff.value);
        safeSet("val-" + picked, char.stats[picked]);
        updateStatDisplay(picked);
        appliedDesc.push("+" + eff.value + " " + statNames[picked]);
        if (eff.type === "stat_choice_save") {
          if (!char.saves) char.saves = {};
          char.saves[picked] = true;
          safeSetChecked("save-prof-" + picked, true);
        }
      }
    }
    else if (eff.type === "armor") {
      if (!char.proficiencies.armor) char.proficiencies.armor = [];
      if (!char.proficiencies.armor.includes(eff.value)) {
        char.proficiencies.armor.push(eff.value);
        safeSetChecked("armor-" + eff.value, true);
        appliedDesc.push("Владение: " + eff.value);
      }
    }
    else if (eff.type === "hp_per_level") {
      // Крепкий — +2 ХП за уровень ретроактивно
      var bonus = eff.value * (char.level || 1);
      char.combat.hpMax = (char.combat.hpMax || 10) + bonus;
      char.combat.hpCurrent = Math.min(char.combat.hpCurrent + bonus, char.combat.hpMax);
      appliedDesc.push("+" + bonus + " ХП (×" + (char.level||1) + " ур.)");
    }
    else if (eff.type === "initiative_bonus") {
      if (!char.bonuses) char.bonuses = {};
      char.bonuses.initiative = (char.bonuses.initiative || 0) + eff.value;
      appliedDesc.push("+" + eff.value + " к Инициативе");
    }
  });

  // Record feat
  char.feats.push({ id: feat.id, name: feat.name, level: char.level });

  saveToLocal();
  calcStats();
  recalculateHP();
  calculateAC();
  updateHPDisplay();

  // Journal entry
  addJournalEntry("feat", "Черта: " + feat.name, appliedDesc.length > 0 ? "Применено: " + appliedDesc.join(", ") : feat.desc.slice(0, 80));

  // Mark ASI level as used BEFORE closeASIModal (which resets asiCurrentLevel)
  if (asiCurrentLevel) {
    if (!char.asiUsedLevels) char.asiUsedLevels = [];
    if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
  }
  asiCurrentLevel = null;
  closeASIModal();
  asiFeatSelected = null;
  showHPToast(0, "🎯 Черта «" + feat.name + "» получена!" + (appliedDesc.length ? " " + appliedDesc.join(", ") : ""));
  renderJournal();
  renderTakenFeats();
  updateClassFeatures();
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

function renderChangelog() {
  var list = $("changelog-list");
  if (!list || typeof APP_CHANGELOG === "undefined") return;

  var typeIcon  = { feat:"✨", fix:"🐛", improve:"⚡" };
  var typeLabel = { feat:"Новое", fix:"Исправлено", improve:"Улучшено" };
  var typeColor = { feat:"#4da843", fix:"#e74c3c", improve:"#5b9bd5" };
  var badgeHtml = { new:'<span class="cl-badge cl-badge-new">НОВОЕ</span>' };

  list.innerHTML = APP_CHANGELOG.map(function(ver, idx) {
    var items = ver.changes.map(function(c) {
      var icon  = typeIcon[c.type]  || "•";
      var color = typeColor[c.type] || "#9a9ab0";
      return '<div class="cl-item"><span class="cl-item-icon" style="color:' + color + '">' + icon + '</span><span class="cl-item-text">' + escapeHtml(c.text) + '</span></div>';
    }).join("");

    var isLatest = idx === 0;
    return '<div class="cl-version' + (isLatest ? " cl-version-latest" : "") + '">' +
      '<div class="cl-version-header">' +
        '<span class="cl-version-num">v' + escapeHtml(ver.version) + '</span>' +
        (isLatest ? '<span class="cl-badge cl-badge-new">Текущая</span>' : '') +
        '<span class="cl-version-date">' + escapeHtml(ver.date) + '</span>' +
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

// ============================================================
// ОТОБРАЖЕНИЕ ВЗЯТЫХ ЧЕРТ
// ============================================================
function renderTakenFeats() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;

  var section = $("taken-feats-section");
  var list    = $("taken-feats-list");
  var count   = $("taken-feats-count");
  if (!section || !list) return;

  var feats = char.feats || [];
  if (feats.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  if (count) count.textContent = feats.length;

  list.innerHTML = feats.map(function(f, i) {
    // Find feat data for description
    var data = typeof FEATS_DATA !== "undefined"
      ? FEATS_DATA.find(function(d) { return d.id === f.id; })
      : null;
    var desc = data ? data.desc : "";
    var lvlBadge = f.level ? '<span class="feat-taken-lvl">ур. ' + f.level + '</span>' : "";
    return '<div class="feat-taken-card">' +
      '<div class="feat-taken-row">' +
        '<span class="feat-taken-icon">🎯</span>' +
        '<span class="feat-taken-name">' + escapeHtml(f.name || f.id) + '</span>' +
        lvlBadge +
        '<button class="feat-taken-del" onclick="removeFeat(' + i + ')" title="Убрать черту">✕</button>' +
      '</div>' +
      (desc ? '<div class="feat-taken-desc">' + escapeHtml(desc) + '</div>' : '') +
    '</div>';
  }).join("");
}

function removeFeat(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.feats) return;
  var name = char.feats[i] ? char.feats[i].name : "черту";
  showConfirmModal("Убрать черту?",
    "«" + name + "» будет удалена из списка. Бонусы к характеристикам НЕ откатятся.",
    function() {
      char.feats.splice(i, 1);
      saveToLocal();
      renderTakenFeats();
    }
  );
}

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
