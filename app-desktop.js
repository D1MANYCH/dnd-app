// app-desktop.js — Desktop right-rail (≥1200px)
// Минимальный widget: HP-полоска + урон/лечение, быстрые dice, ссылка на conditions.
// Использует существующие глобальные функции (rollDice, applyCustomHP, openConditionsPopup).

(function () {
  const RAIL_HTML = `
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
      <button type="button" class="btn btn-primary btn-block" id="rr-btn-d20">🎲 d20</button>
    </div>
    <div class="rr-card rr-conditions">
      <div class="rr-card-head">
        <span>⚡ Состояния</span>
        <span class="rr-hp-num" id="rr-cond-count" style="color:var(--accent)">0</span>
      </div>
      <button type="button" class="btn btn-ghost btn-block" id="rr-btn-cond">+ Открыть</button>
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
    const rrC = document.getElementById('rr-cond-count');
    if (cnt && rrC) rrC.textContent = cnt.textContent || '0';
  }

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
      if (typeof window.rollDiceWithSelectedMode === 'function') window.rollDiceWithSelectedMode(20);
      else if (typeof window.rollDice === 'function') window.rollDice(20);
    });
    if (btnCond) btnCond.addEventListener('click', () => {
      if (typeof window.toggleConditionsPopup === 'function') window.toggleConditionsPopup();
      else if (typeof window.openConditionsPopup === 'function') window.openConditionsPopup();
    });

    rail.querySelectorAll('[data-dice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-dice'), 10);
        if (typeof window.rollDice === 'function' && d) window.rollDice(d);
      });
    });

    syncFromStatusBar();

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
