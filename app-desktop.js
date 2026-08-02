// app-desktop.js — Desktop right-rail (≥1200px)
// Минимальный widget: HP-полоска + урон/лечение, быстрые dice, ссылка на conditions.
// Использует существующие глобальные функции (rollDice, applyCustomHP, openConditionsPopup).

(function () {
  // STYLE-8R: язык встречающего экрана — ни одной коробки. Всегда видны хиты
  // и бросок d20, остальное — четыре строки-сводки со значением справа,
  // раскрывающиеся на месте.
  const RAIL_HTML = `
    <div class="rr-hp">
      <div class="rr-group">Хиты</div>
      <div class="rr-hp-big"><span id="rr-hp-current">10</span><span class="rr-hp-big-sep">/</span><span id="rr-hp-max">10</span></div>
      <div class="rr-hp-bar"><div id="rr-hp-bar-fill" class="rr-hp-bar-fill" style="width:100%"></div></div>
      <div class="rr-hp-quick">
        <button type="button" class="btn btn-secondary btn-sm" data-hp="-5">−5</button>
        <button type="button" class="btn btn-secondary btn-sm" data-hp="-1">−1</button>
        <button type="button" class="btn btn-secondary btn-sm" data-hp="1">+1</button>
        <button type="button" class="btn btn-secondary btn-sm" data-hp="5">+5</button>
      </div>
      <input type="number" id="rr-hp-input" class="rr-hp-input" placeholder="0" min="1" autocomplete="off">
      <div class="rr-hp-buttons">
        <button type="button" class="btn btn-danger" id="rr-btn-dmg">− Урон</button>
        <button type="button" class="btn btn-success" id="rr-btn-heal">+ Лечение</button>
      </div>
    </div>
    <div class="rr-rows">
      <div class="rr-line rr-line-primary">
        <button type="button" class="rr-row" id="rr-btn-d20" aria-label="Бросить d20">
          <span class="home-bullet home-bullet--sm"></span>
          <span class="rr-row-label">Бросок d20</span>
        </button>
        <button type="button" class="rr-more" data-rr-toggle="rr-panel-dice" aria-controls="rr-panel-dice" aria-expanded="false">d4–d12</button>
      </div>
      <div class="rr-panel" id="rr-panel-dice" hidden>
        <div class="rr-dice-grid">
          <button type="button" class="btn btn-secondary btn-sm" data-dice="4">d4</button>
          <button type="button" class="btn btn-secondary btn-sm" data-dice="6">d6</button>
          <button type="button" class="btn btn-secondary btn-sm" data-dice="8">d8</button>
          <button type="button" class="btn btn-secondary btn-sm" data-dice="10">d10</button>
          <button type="button" class="btn btn-secondary btn-sm" data-dice="12">d12</button>
        </div>
      </div>

      <div class="rr-line">
        <div class="rr-row rr-row-static">
          <span class="home-bullet home-bullet--sm"></span>
          <span class="rr-row-label">Класс доспеха</span>
          <span class="rr-row-val" id="rr-ac">10</span>
        </div>
      </div>

      <div class="rr-line">
        <button type="button" class="rr-row is-empty" id="rr-insp-mini" aria-pressed="false" title="Вдохновение (клик — переключить)">
          <span class="home-bullet home-bullet--sm"></span>
          <span class="rr-row-label">Уровень</span>
          <span class="rr-row-val" id="rr-level">1</span>
        </button>
      </div>

      <div class="rr-line" id="rr-slots-line" style="display:none">
        <button type="button" class="rr-row" data-rr-toggle="rr-panel-slots" aria-controls="rr-panel-slots" aria-expanded="false">
          <span class="home-bullet home-bullet--sm"></span>
          <span class="rr-row-label">Ячейки</span>
          <span class="rr-row-val" id="rr-slots-sum">0/0</span>
        </button>
      </div>
      <div class="rr-panel" id="rr-panel-slots" hidden>
        <div id="rr-slots-list" class="rr-slots-list"></div>
      </div>

      <div class="rr-line">
        <button type="button" class="rr-row" data-rr-toggle="rr-panel-cond" aria-controls="rr-panel-cond" aria-expanded="false">
          <span class="home-bullet home-bullet--sm"></span>
          <span class="rr-row-label">Состояния</span>
          <span class="rr-row-val" id="rr-cond-count">0</span>
        </button>
      </div>
      <div class="rr-panel" id="rr-panel-cond" hidden>
        <div id="rr-cond-list" class="rr-cond-list"></div>
        <div id="rr-cond-empty" class="rr-cond-empty">Нет активных состояний</div>
        <button type="button" class="rr-panel-action" id="rr-btn-cond">Управление состояниями</button>
      </div>
    </div>
  `;

  function syncFromStatusBar() {
    const cur = document.getElementById('status-hp-current');
    const max = document.getElementById('status-hp-max');
    const rrCur = document.getElementById('rr-hp-current');
    const rrMax = document.getElementById('rr-hp-max');
    if (cur && rrCur) rrCur.textContent = cur.textContent;
    if (max && rrMax) rrMax.textContent = max.textContent;

    const fill = document.getElementById('rr-hp-bar-fill');
    if (fill) {
      const cv = parseInt(cur && cur.textContent, 10) || 0;
      const mv = parseInt(max && max.textContent, 10) || 1;
      const pct = Math.max(0, Math.min(100, (cv / mv) * 100));
      fill.style.width = pct + '%';
    }

    const cnt = document.getElementById('conditions-btn-count');
    const condBtn = document.getElementById('status-conditions-btn');
    const rrC = document.getElementById('rr-cond-count');
    if (rrC) {
      const hidden = condBtn && condBtn.classList.contains('hidden');
      rrC.textContent = (hidden || !cnt) ? '0' : (cnt.textContent || '0');
    }

    // Перерисовать inline-баджи (на случай переключения персонажа)
    try { renderRrConditions(); } catch (e) { window.__catchLog && window.__catchLog('desktop:renderRr', e); }
    try { renderRailSlots(); } catch (e) { window.__catchLog && window.__catchLog('desktop:renderSlots', e); }

    // AC и Level из status-bar
    const ac = document.getElementById('status-ac');
    const lvl = document.getElementById('status-level');
    const rrAc = document.getElementById('rr-ac');
    const rrLvl = document.getElementById('rr-level');
    if (ac && rrAc) {
      const inner = ac.querySelector('span');
      rrAc.textContent = inner ? inner.textContent : (ac.textContent || '').replace(/\D+/g, '') || '10';
    }
    if (lvl && rrLvl) {
      const inner = lvl.querySelector('span');
      rrLvl.textContent = inner ? inner.textContent : (lvl.textContent || '').replace(/\D+/g, '') || '1';
    }

    // Inspiration — по наличию active-class или непустого innerText
    const insp = document.getElementById('status-inspiration');
    const rrInsp = document.getElementById('rr-insp-mini');
    if (insp && rrInsp) {
      const isOn = insp.classList.contains('active') || insp.classList.contains('is-on') || insp.dataset.on === '1';
      rrInsp.classList.toggle('is-empty', !isOn);
      rrInsp.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    }
  }

  function _esc(s) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(s);
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
    });
  }
  function _stripEmoji(s) {
    if (typeof window.stripLeadingEmoji === 'function') return window.stripLeadingEmoji(s);
    return String(s || '');
  }
  function _condIcon(id) {
    if (typeof window.getConditionIcon === 'function') return window.getConditionIcon(id);
    return '';
  }
  // STYLE-8R: строка-сводка раскрывается на месте — панель ищется по
  // aria-controls, состояние держит aria-expanded.
  function setRowExpanded(btn, open) {
    if (!btn) return;
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) panel.hidden = !open;
  }
  function collapseRow(btn) { setRowExpanded(btn, false); }

  function renderRrConditions() {
    var list = document.getElementById('rr-cond-list');
    var empty = document.getElementById('rr-cond-empty');
    if (!list) return;
    var data = (typeof window.getActiveConditionsForRender === 'function')
      ? window.getActiveConditionsForRender()
      : { baseConditions: [], exhLevel: 0, buffs: [], debuffs: [] };
    list.innerHTML = '';
    var any = data.baseConditions.length || data.exhLevel || data.buffs.length || data.debuffs.length;
    if (!any) {
      if (empty) empty.style.display = '';
      return;
    }
    if (empty) empty.style.display = 'none';
    function addBadge(html, cls) {
      var b = document.createElement('span');
      b.className = 'condition-badge' + (cls ? ' ' + cls : '');
      b.innerHTML = html;
      b.addEventListener('click', function() {
        if (typeof window.toggleConditionsPopup === 'function') window.toggleConditionsPopup();
      });
      list.appendChild(b);
    }
    data.baseConditions.forEach(function(c) {
      addBadge(_condIcon(c.id) + '<span>' + _esc(_stripEmoji(c.name)) + '</span>');
    });
    if (data.exhLevel > 0) {
      addBadge(
        _condIcon('exhaustion_' + data.exhLevel) +
        '<span>Истощение ' + data.exhLevel + (data.exhLevel >= 6 ? ' — смерть' : '/6') + '</span>',
        'exhaustion'
      );
    }
    data.buffs.forEach(function(e) {
      var name = (e.name || '').split(' ').slice(1).join(' ') || e.name;
      addBadge(_esc(name), 'buff');
    });
    data.debuffs.forEach(function(e) {
      var name = (e.name || '').split(' ').slice(1).join(' ') || e.name;
      addBadge(_esc(name), 'debuff');
    });
  }
  window.refreshConditionsRightRail = renderRrConditions;

  // Дымка v5: «Ячейки» — полоски свободных ячеек по кругам (те же сторы,
  // что и вкладка «Заклинания»; renderSpellSlots дёргает refreshRailSlots).
  function renderRailSlots() {
    var line = document.getElementById('rr-slots-line');
    var list = document.getElementById('rr-slots-list');
    if (!line || !list) return;
    var char = (typeof window.getCurrentChar === 'function' && window.currentId) ? window.getCurrentChar() : null;
    var rows = '', sumFree = 0, sumTotal = 0;
    if (char && char.spells) {
      var slots = char.spells.slots || {}, used = char.spells.slotsUsed || {};
      for (var i = 1; i <= 9; i++) {
        var total = slots[i] || 0;
        if (!total) continue;
        var free = total - (used[i] || 0);
        sumFree += free; sumTotal += total;
        rows += '<div class="rr-slot-row" title="' + i + ' круг: свободно ' + free + ' из ' + total + '">' +
          '<span class="rr-slot-lvl">' + i + '</span>' +
          '<span class="rr-slot-bar"><span class="rr-slot-fill' + (free === 0 ? ' empty' : '') + '" style="width:' + Math.round((free / total) * 100) + '%"></span></span>' +
          '<span class="rr-slot-num">' + free + '/' + total + '</span>' +
        '</div>';
      }
      var pactTotal = char.spells.pactSlots || 0;
      if (pactTotal > 0) {
        var pactFree = pactTotal - (char.spells.pactUsed || 0);
        sumFree += pactFree; sumTotal += pactTotal;
        rows += '<div class="rr-slot-row rr-slot-pact" title="Ячейки пакта: свободно ' + pactFree + ' из ' + pactTotal + '">' +
          '<span class="rr-slot-lvl">П</span>' +
          '<span class="rr-slot-bar"><span class="rr-slot-fill' + (pactFree === 0 ? ' empty' : '') + '" style="width:' + Math.round((pactFree / pactTotal) * 100) + '%"></span></span>' +
          '<span class="rr-slot-num">' + pactFree + '/' + pactTotal + '</span>' +
        '</div>';
      }
    }
    list.innerHTML = rows;
    line.style.display = rows ? '' : 'none';
    var sum = document.getElementById('rr-slots-sum');
    if (sum) sum.textContent = sumFree + '/' + sumTotal;
    // Строка спряталась (сменили персонажа на неколдующего) — панель под ней
    // обязана свернуться вместе с ней, иначе полоски повиснут без заголовка.
    if (!rows) collapseRow(line.querySelector('[data-rr-toggle]'));
  }
  window.refreshRailSlots = renderRailSlots;

  function rrApplyHP(mode) {
    const inp = document.getElementById('rr-hp-input');
    if (!inp) return;
    const v = parseInt(inp.value, 10);
    if (!v || v < 1) { inp.focus(); return; }
    const mainInput = document.getElementById('hp-custom-input');
    if (mainInput && typeof window.applyCustomHP === 'function') {
      mainInput.value = v;
      window.applyCustomHP(mode);
    }
    inp.value = '';
  }

  function init() {
    const rail = document.getElementById('app-right-rail');
    if (!rail) return;
    rail.innerHTML = RAIL_HTML;

    const btnDmg = document.getElementById('rr-btn-dmg');
    const btnHeal = document.getElementById('rr-btn-heal');
    const btnD20 = document.getElementById('rr-btn-d20');
    const btnCond = document.getElementById('rr-btn-cond');
    if (btnDmg) btnDmg.addEventListener('click', () => rrApplyHP('dmg'));
    if (btnHeal) btnHeal.addEventListener('click', () => rrApplyHP('heal'));
    if (btnD20) btnD20.addEventListener('click', () => {
      if (typeof window.openDiceModal === 'function') window.openDiceModal();
      if (typeof window.rollDiceWithSelectedMode === 'function') window.rollDiceWithSelectedMode(20);
      else if (typeof window.rollDice === 'function') window.rollDice(20);
    });
    if (btnCond) btnCond.addEventListener('click', () => {
      if (typeof window.toggleConditionsPopup === 'function') window.toggleConditionsPopup();
      else if (typeof window.openConditionsPopup === 'function') window.openConditionsPopup();
    });

    const inspEl = document.getElementById('rr-insp-mini');
    if (inspEl) inspEl.addEventListener('click', () => {
      if (typeof window.toggleInspiration === 'function') window.toggleInspiration();
    });

    rail.querySelectorAll('[data-dice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-dice'), 10);
        if (!d) return;
        if (typeof window.openDiceModal === 'function') window.openDiceModal();
        if (typeof window.rollDice === 'function') window.rollDice(d);
      });
    });

    // Дымка v5: быстрые ±1/±5 к хитам (зеркалит лист через quickHP)
    rail.querySelectorAll('[data-hp]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.getAttribute('data-hp'), 10);
        if (!delta) return;
        if (typeof window.quickHP === 'function') { window.quickHP(delta, 'Панель'); return; }
        const mainInput = document.getElementById('hp-custom-input');
        if (mainInput && typeof window.applyCustomHP === 'function') {
          mainInput.value = Math.abs(delta);
          window.applyCustomHP(delta < 0 ? 'dmg' : 'heal');
        }
      });
    });

    // STYLE-8R: раскрытие строк-сводок (кубики, ячейки, состояния)
    rail.querySelectorAll('[data-rr-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        setRowExpanded(btn, btn.getAttribute('aria-expanded') !== 'true');
      });
    });

    // Изначально мы на экране выбора персонажа — выставим маркер,
    // если showScreen ещё не вызывался к моменту инициализации
    if (!window.currentId) {
      document.body.classList.add('no-character');
    }

    syncFromStatusBar();
    renderRrConditions();
    renderRailSlots();

    const statusBar = document.querySelector('.status-bar');
    if (statusBar) {
      const obs = new MutationObserver(syncFromStatusBar);
      obs.observe(statusBar, { subtree: true, characterData: true, childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
