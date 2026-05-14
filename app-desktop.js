// app-desktop.js — Desktop right-rail (≥1200px)
// Минимальный widget: HP-полоска + урон/лечение, быстрые dice, ссылка на conditions.
// Использует существующие глобальные функции (rollDice, applyCustomHP, openConditionsPopup).

(function () {
  const RAIL_HTML = `
    <div class="rr-card rr-stats-card">
      <div class="rr-stats-row">
        <div class="rr-stat-mini rr-ac" title="Класс доспеха">🛡️ <span id="rr-ac">10</span></div>
        <div class="rr-stat-mini rr-level" title="Уровень">⭐ <span id="rr-level">1</span></div>
        <div class="rr-stat-mini rr-insp is-empty" id="rr-insp-mini" title="Вдохновение (клик — переключить)">✨</div>
      </div>
    </div>
    <div class="rr-card rr-hp">
      <div class="rr-card-head">
        <span>❤️ Хиты</span>
        <span class="rr-hp-num"><span id="rr-hp-current">10</span>/<span id="rr-hp-max">10</span></span>
      </div>
      <div class="rr-hp-bar"><div id="rr-hp-bar-fill" class="rr-hp-bar-fill" style="width:100%"></div></div>
      <input type="number" id="rr-hp-input" class="rr-hp-input" placeholder="0" min="1" autocomplete="off">
      <div class="rr-hp-buttons">
        <button type="button" class="btn btn-danger" id="rr-btn-dmg">− Урон</button>
        <button type="button" class="btn btn-success" id="rr-btn-heal">+ Лечение</button>
      </div>
    </div>
    <div class="rr-card rr-dice">
      <div class="rr-card-head"><span>🎲 Быстрые броски</span></div>
      <div class="rr-dice-grid">
        <button type="button" class="btn btn-secondary btn-sm" data-dice="4">d4</button>
        <button type="button" class="btn btn-secondary btn-sm" data-dice="6">d6</button>
        <button type="button" class="btn btn-secondary btn-sm" data-dice="8">d8</button>
        <button type="button" class="btn btn-secondary btn-sm" data-dice="10">d10</button>
        <button type="button" class="btn btn-secondary btn-sm" data-dice="12">d12</button>
      </div>
      <button type="button" class="btn-block rr-d20-btn" id="rr-btn-d20" aria-label="Бросить d20"><img src="assets/d20-fab.webp" alt="" class="rr-d20-icon"><span class="rr-d20-label">d20</span></button>
    </div>
    <div class="rr-card rr-conditions">
      <div class="rr-card-head">
        <span>⚡ Состояния</span>
        <span class="rr-hp-num" id="rr-cond-count" style="color:var(--accent)">0</span>
      </div>
      <div id="rr-cond-list" class="rr-cond-list"></div>
      <div id="rr-cond-empty" class="rr-cond-empty">Нет активных состояний</div>
      <button type="button" class="btn btn-ghost btn-block btn-sm" id="rr-btn-cond">⚙ Управление</button>
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
    try { renderRrConditions(); } catch (e) {}

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

    // Изначально мы на экране выбора персонажа — выставим маркер,
    // если showScreen ещё не вызывался к моменту инициализации
    if (!window.currentId) {
      document.body.classList.add('no-character');
    }

    syncFromStatusBar();
    renderRrConditions();

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
