// ============================================================
// app-wildshape.js — РОСТ-6: Дикий облик. Экран выбора зверя, плашки облика
// на «Бое» и в блоке хитов, стат-блок облика. Правила — в rules.js
// (rulesWildShapeLimits, rulesFormStart, rulesFormDamage), урон — в quickHP.
// Значения облика только показываются: в поля листа (#combat-ac, #hp-current)
// не пишутся, иначе updateChar сохранил бы их как настоящие.
// ============================================================

var _wsQuery = "";
var _wsLoading = false;

function wsBeast(slug) {
  var list = window.BEAST_FORMS || [];
  for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
  return null;
}

function wsChargesLeft(char) {
  if (typeof initCharResources !== "function") return 0;
  initCharResources(char);
  var d = getCharResourceDefs(char);
  var res = d && (d.resources || []).filter(function(r) { return r.id === "wild_shape"; })[0];
  if (!res) return 0;
  return Math.max(0, getResourceMax(res, char) - (char.resources.wild_shape || 0));
}

function wsSpeedText(sp) {
  sp = sp || {};
  var out = [(sp.walk || 0) + " фт"];
  if (sp.climb) out.push("лазание " + sp.climb);
  if (sp.swim) out.push("плавание " + sp.swim);
  if (sp.fly) out.push("полёт " + sp.fly);
  return out.join(", ");
}

function wsCrText(cr) {
  return "ПО " + cr;
}

function wsLimitsText(lim, char) {
  var parts = ["ПО до " + (lim.maxCr === 0.25 ? "1/4" : lim.maxCr === 0.5 ? "1/2" : lim.maxCr)];
  if (lim.noFly && lim.noSwim) parts.push("без полёта и плавания");
  else if (lim.noFly) parts.push("без полёта");
  parts.push("до " + lim.durationH + " ч");
  parts.push(lim.action === "bonus" ? "бонусным действием" : "действием");
  parts.push("зарядов " + wsChargesLeft(char));
  return parts.join(" · ");
}

// Стат-блок облика для monsterStatBlockHtml: телесные характеристики зверя,
// ментальные — свои; владения спасбросками — свои и зверя, бонус мастерства —
// свой (2014 — больший из своего и зверя, PHB стр.67).
function wildShapeStatBlock() {
  var char = currentId ? getCurrentChar() : null;
  var f = char && char.form;
  if (!f) return null;
  var b = wsBeast(f.slug);
  if (!b) { wsEnsureBeasts(); return null; }
  var st = char.stats || {};
  var stats = { str: b.stats.str, dex: b.stats.dex, con: b.stats.con, int: st.int || 10, wis: st.wis || 10, cha: st.cha || 10 };
  var prof = (b.saveProf || []).slice();
  Object.keys(char.saves || {}).forEach(function(k) { if (char.saves[k] && prof.indexOf(k) < 0) prof.push(k); });
  var pb = getProficiencyBonus(char.level || 1);
  if (f.edition !== "2024") pb = Math.max(pb, rulesCrToProf(b.cr) || 2);
  return { formName: b.name, name: b.name, cr: b.cr, profBonus: pb, stats: stats, saveProf: prof,
    attacks: b.attacks, traits: b.traits, senses: b.senses };
}

function wsEnsureBeasts() {
  if (window.BEAST_FORMS || _wsLoading || typeof window.ensureBeastForms !== "function") return;
  _wsLoading = true;
  window.ensureBeastForms().then(function() { _wsLoading = false; renderWildShape(); })
    .catch(function() { _wsLoading = false; showToast("Список зверей не загрузился", "error"); });
}

// Строка облика: имя, хиты (2014), КД, скорости
function wsFormLine(char) {
  var f = char.form, b = wsBeast(f.slug);
  var parts = ["<b>" + escapeHtml(f.name || "Облик") + "</b>"];
  if (f.edition !== "2024") parts.push("хиты " + f.hpCurrent + "/" + f.hpMax);
  parts.push("КД " + f.ac);
  if (b) parts.push(escapeHtml(wsSpeedText(b.speed)));
  return parts.join(' <span class="hp-dot">·</span> ');
}

function renderWildShape() {
  var char = currentId ? getCurrentChar() : null;
  var banner = $("ws-hp-banner"), card = $("ws-card");
  if (!char) return;
  var lim = rulesWildShapeLimits(char);
  var f = char.form;
  var rrForm = $("rr-hp-form");
  if (rrForm) rrForm.textContent = f ? " · облик: " + (f.name || "") + (f.edition !== "2024" ? " " + f.hpCurrent + "/" + f.hpMax : "") +
    ((char.combat.hpTemp || 0) > 0 ? " · врем. " + char.combat.hpTemp : "") : "";
  if (banner) {
    banner.style.display = f ? "" : "none";
    banner.innerHTML = f ? '<span>🐾 Облик:</span> ' + wsFormLine(char) +
      ' <button type="button" class="hp-act" onclick="wildShapeExit()">Выйти</button>' : "";
  }
  if (!card) return;
  card.style.display = (lim || f) ? "" : "none";
  if (!lim && !f) return;
  var h = '<div class="bt-head"><h3>Дикий облик</h3>' +
    (lim ? '<button type="button" class="bt-act" onclick="openWildShapePicker()">' + (f ? "Сменить облик" : "Принять облик") + '</button>' : "") + '</div>';
  if (!f) {
    h += '<p class="hp-row-hint">' + escapeHtml(wsLimitsText(lim, char)) + '</p>';
  } else {
    var sb = wildShapeStatBlock();
    h += '<div class="ws-banner">' + wsFormLine(char) + '</div>';
    h += '<p class="hp-row-hint">' + (f.durationH ? "До " + f.durationH + " ч · " : "") +
      (f.edition === "2024" ? "хиты свои, временные хиты при входе" : "урон снимает хиты облика, остаток переходит на персонажа") +
      " · Инт, Мдр, Хар и владения — свои</p>";
    if (sb) {
      h += '<div class="mon-sbv" id="ws-sb">' + monsterStatBlockHtml(sb) + '</div>';
      if (sb.senses) h += '<p class="hp-row-hint">' + escapeHtml(sb.senses) + '</p>';
      (sb.traits || []).forEach(function(t) {
        h += '<p class="hp-row-hint"><b>' + escapeHtml(t.name) + '.</b> ' + escapeHtml(t.desc) + '</p>';
      });
    }
    h += '<div class="hp-row-line"><button type="button" class="hp-act" onclick="wildShapeExit()">Выйти из облика</button></div>';
  }
  card.innerHTML = h;
  // Кнопки стат-блока читают _monSbCurrent — ставим облик до их onclick
  var sbEl = $("ws-sb");
  if (sbEl) sbEl.addEventListener("click", function() {
    var s = wildShapeStatBlock();
    _monSbCurrent = s ? { name: s.name, cr: s.cr, profBonus: s.profBonus, stats: s.stats, saveProf: s.saveProf, attacks: s.attacks } : null;
  }, true);
}

// ── Экран выбора ──
function openWildShapePicker() {
  var char = currentId ? getCurrentChar() : null;
  if (!char || !rulesWildShapeLimits(char)) return;
  var go = function() { _wsQuery = ""; var s = $("ws-search"); if (s) s.value = ""; renderWildShapePicker(); showScreen("wildshape"); };
  if (window.BEAST_FORMS) return go();
  if (typeof window.ensureBeastForms !== "function") return;
  window.ensureBeastForms().then(go).catch(function() { showToast("Список зверей не загрузился", "error"); });
}
function closeWildShapePicker() {
  if (currentScreenName() === "wildshape") screenBack();
}
function wsSetSearch(v) { _wsQuery = String(v || "").toLowerCase().trim(); renderWildShapePicker(); }

function wsPickRow(b, btns) {
  return '<div class="ws-pick-row"><div class="ws-pick-main"><div>' + escapeHtml(b.name) + '</div>' +
    '<div class="ws-pick-meta">' + wsCrText(b.cr) + ' · КД ' + b.ac + ' · хиты ' + b.hp + ' · ' + escapeHtml(wsSpeedText(b.speed)) + '</div></div>' +
    btns + '</div>';
}
function wsBtn(label, fn, slug, disabled) {
  return '<button type="button" class="hp-act"' + (disabled ? " disabled" : "") + ' onclick="' + fn + '(\'' + escapeHtml(slug) + '\')">' + label + '</button>';
}

function renderWildShapePicker() {
  var char = currentId ? getCurrentChar() : null;
  var box = $("ws-results"), limEl = $("ws-limits");
  if (!char || !box) return;
  var lim = rulesWildShapeLimits(char);
  if (!lim) { box.innerHTML = ""; return; }
  if (limEl) limEl.textContent = wsLimitsText(lim, char);
  var q = _wsQuery;
  var match = function(b) { return !q || b.name.toLowerCase().indexOf(q) >= 0 || String(b.nameEn).toLowerCase().indexOf(q) >= 0; };
  var allowed = (window.BEAST_FORMS || []).filter(function(b) { return rulesBeastAllowed(b, lim); })
    .sort(function(a, b) { return rulesCrValue(a.cr) - rulesCrValue(b.cr) || a.name.localeCompare(b.name, "ru"); });
  var h = "";
  if (char.edition === "2024") {
    if (!Array.isArray(char.formsKnown)) char.formsKnown = [];
    var known = allowed.filter(function(b) { return char.formsKnown.indexOf(b.slug) >= 0; });
    var full = known.length >= lim.known;
    h += '<div class="mon-sbv-title">Известные облики · ' + known.length + ' из ' + lim.known + '</div>';
    h += known.length ? known.map(function(b) {
      return wsPickRow(b, wsBtn("Принять", "wildShapeAssume", b.slug) + wsBtn("Забыть", "wildShapeForget", b.slug));
    }).join("") : '<p class="hp-row-hint">Выучите облики из списка ниже — сменить их можно после долгого отдыха.</p>';
    var rest = allowed.filter(function(b) { return char.formsKnown.indexOf(b.slug) < 0 && match(b); });
    h += '<div class="mon-sbv-title">Можно выучить</div>' + rest.map(function(b) {
      return wsPickRow(b, wsBtn("Выучить", "wildShapeLearn", b.slug, full));
    }).join("");
  } else {
    var list = allowed.filter(match);
    h += list.map(function(b) { return wsPickRow(b, wsBtn("Принять", "wildShapeAssume", b.slug)); }).join("");
    if (!list.length) h = '<p class="hp-row-hint">Ничего не найдено.</p>';
  }
  box.innerHTML = h;
}

function wildShapeLearn(slug) {
  var char = getCurrentChar(), lim = char && rulesWildShapeLimits(char);
  if (!lim || !Array.isArray(char.formsKnown) || char.formsKnown.indexOf(slug) >= 0) return;
  if (char.formsKnown.length >= lim.known) { showToast("Известно обликов: " + lim.known + " — сначала забудьте один", "warn"); return; }
  char.formsKnown.push(slug);
  saveToLocal();
  renderWildShapePicker();
}
function wildShapeForget(slug) {
  var char = getCurrentChar();
  if (!char || !Array.isArray(char.formsKnown)) return;
  char.formsKnown = char.formsKnown.filter(function(s) { return s !== slug; });
  saveToLocal();
  renderWildShapePicker();
}

function wildShapeAssume(slug) {
  var char = getCurrentChar();
  if (!char) return;
  var lim = rulesWildShapeLimits(char), b = wsBeast(slug);
  if (!lim || !rulesBeastAllowed(b, lim)) { showToast("Этот зверь недоступен", "warn"); return; }
  if ((char.combat.hpCurrent || 0) <= 0) { showToast("0 хитов — облик принять нельзя", "warn"); return; }
  if (wsChargesLeft(char) <= 0) { showToast("Зарядов Дикого облика нет — нужен отдых", "warn"); return; }
  spendResource("wild_shape", 1);
  rulesFormStart(char, b, lim, Date.now());
  if (window.AppLog) AppLog.action("combat", "Дикий облик: " + b.name);
  saveToLocal();
  closeWildShapePicker();
  updateHPDisplay();
  showToast("🐾 Облик: " + b.name + (char.edition === "2024" && lim.tempHp ? " · временные хиты " + char.combat.hpTemp : ""), "success");
  if (typeof BATTLE_DATA !== "undefined" && BATTLE_DATA.active && typeof renderBattleTracker === "function") renderBattleTracker();
}

function wildShapeExit() {
  var char = getCurrentChar();
  if (!char || !char.form) return;
  if (window.AppLog) AppLog.action("combat", "Дикий облик: выход из «" + char.form.name + "»");
  char.form = null;
  saveToLocal();
  updateHPDisplay();
  showToast("Облик снят", "info");
  if (typeof BATTLE_DATA !== "undefined" && BATTLE_DATA.active && typeof renderBattleTracker === "function") renderBattleTracker();
}
