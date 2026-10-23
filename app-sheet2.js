// РОСТ-8 (демо): лист персонажа по макету дизайнера (Figma «Заполненный лист»).
// РД-2: работает только в тестовом режиме редизайна (?rd=1), стили — в redesign.css. Показывается только
// у зафиксированного листа; старый лист остаётся в DOM скрытым и считает всё как раньше (РД-5: так и оставлен
// до РД-Ф — его поля читают calcStats/updateChar, опыт пишется через sheet2Set).
(function () {
  if (!isRedesign()) return;

  var showOld = false;
  var pool = {}; // кубы, набранные нажатиями: { грани: количество }
  var AB = [
    { k: "str", n: "Сила", s: "Сил" }, { k: "dex", n: "Ловкость", s: "Лов" },
    { k: "con", n: "Телосложение", s: "Тел" }, { k: "int", n: "Интеллект", s: "Инт" },
    { k: "wis", n: "Мудрость", s: "Мдр" }, { k: "cha", n: "Харизма", s: "Хар" }
  ];
  var SKILL_GROUPS = ["str", "dex", "int", "wis", "cha"];
  var DICE = [2, 4, 6, 8, 10, 12, 20, 100];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fm(n) { return (n >= 0 ? "+" : "−") + Math.abs(n); }
  function abName(k) { for (var i = 0; i < AB.length; i++) if (AB[i].k === k) return AB[i]; return AB[0]; }
  function listText(arr) {
    if (!arr) return "";
    if (!Array.isArray(arr)) return String(arr);
    return arr.map(function (x) { return typeof x === "string" ? x : (x && (x.name || x.label)) || ""; })
      .filter(Boolean).join(", ");
  }


  function ensureNodes() {
    var tab = document.getElementById("tab-sheet");
    if (!tab) return null;
    var bar = document.getElementById("sheet2-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sheet2-bar";
      tab.insertBefore(bar, tab.firstChild);
    }
    var root = document.getElementById("sheet2");
    if (!root) {
      root = document.createElement("div");
      root.id = "sheet2";
      tab.insertBefore(root, bar.nextSibling);
    }
    // РД-6: блок боя наверху «Боя» и свой блок в правой панели ПК
    var bt = document.getElementById("tab-battle");
    var battle = document.getElementById("rd-battle");
    if (!battle && bt) {
      battle = document.createElement("div");
      battle.id = "rd-battle";
      battle.className = "s2-box";
      var help = bt.querySelector(".tab-help-row");
      bt.insertBefore(battle, help ? help.nextSibling : bt.firstChild);
    }
    var railHost = document.getElementById("app-right-rail");
    var rail = document.getElementById("rd-rail");
    if (!rail && railHost) {
      rail = document.createElement("div");
      rail.id = "rd-rail";
      rail.className = "s2-box";
      railHost.appendChild(rail);
    }
    return { bar: bar, root: root, battle: battle, rail: rail };
  }

  function render() {
    var nodes = ensureNodes();
    if (!nodes) return;
    var char = (typeof currentId !== "undefined" && currentId) ? getCurrentChar() : null;
    var locked = !!(char && typeof isSheetLocked === "function" && isSheetLocked(char));
    var on = locked && !showOld;
    document.body.classList.toggle("sheet2-on", on);
    var tabEl = document.getElementById("tab-sheet");
    var scr = document.getElementById("screen-character");
    var scrOn = !scr || (!scr.classList.contains("hidden") && !scr.classList.contains("screen-ghost"));
    document.body.classList.toggle("sheet2-tab", on && scrOn && tabEl.classList.contains("active"));
    nodes.root.style.display = on ? "" : "none";
    nodes.bar.innerHTML = !char ? "" : !locked
      ? "Демо нового листа: зафиксируйте лист, чтобы увидеть его"
      : "Демо нового листа · <button type='button' onclick='sheet2Toggle()'>" + (showOld ? "Показать новый" : "Показать старый") + "</button>";
    [nodes.battle, nodes.rail].forEach(function (n) { if (n) { n.style.display = on ? "" : "none"; if (!on) n.innerHTML = ""; } });
    if (!on) return;
    nodes.root.innerHTML = build(char);
    if (nodes.battle) nodes.battle.innerHTML = buildBattle(char);
    if (nodes.rail) nodes.rail.innerHTML = buildRail(char);
  }

  function build(c) {
    var lvl = c.level || 1;
    var pb = getProficiencyBonus(lvl);
    var cm = c.combat || {};
    var xp = (typeof charXpNext === "function") ? charXpNext(c) : { need: 0, have: c.exp || 0 };
    var xpPct = xp.need ? Math.min(100, Math.round(100 * (xp.have || 0) / xp.need)) : 100;
    var initial = (c.name || "?").trim().charAt(0).toUpperCase();
    var avaSrc = typeof safeImageSrc === "function" ? safeImageSrc(c.avatar) : "";
    var avaHtml = avaSrc ? "<img src=\"" + esc(avaSrc) + "\" alt=''>" : (typeof getClassIcon === "function" && c.class ? getClassIcon(c.class) : esc(initial));
    var h = [];

    // ── Шапка
    h.push("<div class='s2-body'><div class='s2-head'>");
    h.push("<div class='s2-ava'>" + avaHtml + "</div>");
    h.push("<div><h2 class='s2-name'>" + esc(c.name || "Без\u00a0имени") + "</h2><div class='s2-facts'>");
    // РД-5: класс, мультикласс, билд; раса и предыстория — строкой (уйдут в «Личность», РД-11)
    var multi = isMulticlass(c);
    h.push("<div class='s2-cls'>" + (multi
      ? "<button type='button' class='s2-link' onclick='openProgress()' title='Классы и уровни'>" + esc(getClassLabel(c)) + "</button>"
      : esc(c.class || "—") + (c.subclass ? " · " + esc(c.subclass) : "")) +
      (c.edition === "2024" ? " <small class='s2-ed'>2024</small>" : "") + "</div>");
    h.push("<div class='s2-sub'>" + esc([c.race, c.background, c.alignment].filter(Boolean).join(" · ") || "—") + "</div>");
    var spd = parseInt(cm.speed, 10) || 30;
    if (typeof rulesEffectiveSpeed === "function") spd = rulesEffectiveSpeed(c, spd).speed;
    var bld = c.buildId && window.getBuildById ? window.getBuildById(c.buildId) : null;
    var hacts = [];
    if (c.class && lvl < 20) hacts.push("<button type='button' class='s2-link' onclick='pgAddClass()'>" + (multi ? "+ Ещё класс" : "+ Второй класс") + "</button>");
    if (bld) hacts.push("<button type='button' class='s2-link' onclick='openBuildBadgeMenu()' title='Гайд по билду'>Билд: " + esc(bld.title) + "</button>");
    if (hacts.length) h.push("<div class='s2-hacts'>" + hacts.join("") + "</div>");
    h.push("</div></div>");
    // уровень — только текстом, меняется через «Повысить» (П-11)
    h.push("<div class='s2-lvl'><div class='s2-big'>" + lvl + " уровень</div>");
    h.push("<div class='s2-kv'>Опыт <input class='s2-num w' type='number' min='0' inputmode='numeric' value='" + (xp.have || 0) + "' onchange=\"sheet2Set('char-exp',this.value)\" aria-label='Опыт'>" + (xp.need ? " / " + xp.need : "") + "</div>");
    h.push("<div class='s2-xp'><i style='width:" + xpPct + "%'></i></div>");
    h.push("<button type='button' class='s2-btn' onclick='openLevelUpModal()'>↑ Повысить</button></div>");
    h.push("</div>");

    h.push("<div class='s2-main'>");

    // ── Строка общих чисел
    var pp = rulesPassivePerception(c, lvl, !!(c.skills && c.skills[3]));
    h.push("<div class='s2-line'><span>Бонус мастерства <b>" + fm(pb) + "</b></span>");
    h.push("<span>Вдохновение: <button type='button' class='s2-link' onclick='toggleInspiration()'>" + (c.inspiration ? "есть" : "нет") + "</button></span>");
    h.push("<span>Пассивная Внимательность <b>" + pp + "</b></span>");
    h.push("</div>");

    // ── Характеристики + спасброски
    h.push("<div class='s2-two'><div><h3>Характеристики</h3><table><tr><th>Хар.</th><th class='n'>Значение</th><th class='n'>Мод.</th></tr>");
    AB.forEach(function (a) {
      var v = (c.stats && c.stats[a.k]) || 10;
      h.push("<tr class='s2-row' tabindex='0' data-t='Проверка: " + a.n + "' data-v='" + fm(getMod(v)) + "' data-b='" + v + " → " + fm(getMod(v)) + " " + a.s + "' onclick=\"sheet2Roll(this,'rollAbilityCheck','" + a.k + "')\"><td>" + a.n + "</td><td class='n v'>" + v + "</td><td class='n m'>" + fm(getMod(v)) + "</td></tr>");
    });
    h.push("</table></div><div><h3>Спасброски</h3><table><tr><th>Хар.</th><th class='n'>Бонус</th></tr>");
    AB.forEach(function (a) {
      var prof = !!(c.saves && c.saves[a.k]);
      var b = rulesSaveBonus(c, a.k, lvl, prof);
      var tip = fm(getMod((c.stats && c.stats[a.k]) || 10)) + " " + a.s + (prof ? " · " + fm(pb) + " мастерство" : "") + (rulesAuraOfProtection(c) ? " · " + fm(rulesAuraOfProtection(c)) + " аура защиты" : "");
      h.push("<tr class='s2-row' tabindex='0' data-t='Спасбросок: " + a.n + "' data-v='" + fm(b) + "' data-b='" + esc(tip) + "' onclick=\"sheet2Roll(this,'rollSavingThrow','" + a.k + "')\"><td>" + (prof ? "<span class='s2-prof'>◆</span>" : "<span class='s2-noprof'>◇</span>") + a.n + "</td><td class='n'>" + fm(b) + "</td></tr>");
    });
    h.push("</table></div><div>");
    var sideAt = h.length;
    h.push("</div></div>");

    // ── Навыки по характеристикам
    h.push("<h3>Навыки</h3><div class='s2-skills'>");
    SKILL_GROUPS.forEach(function (k) {
      var rows = [];
      skills.forEach(function (s, i) {
        if (s.stat !== k) return;
        var prof = !!(c.skills && c.skills[i]);
        var exp = prof && rulesHasExpertise(c, i);
        var b = rulesSkillBonus(c, i, lvl, prof);
        var mod = getMod((c.stats && c.stats[k]) || 10);
        var tip = fm(mod) + " " + abName(k).s + (prof ? " · " + fm(exp ? pb * 2 : pb) + (exp ? " компетентность" : " мастерство") : (b !== mod ? " · " + fm(b - mod) + " мастер на все руки" : ""));
        rows.push("<div class='s2-sk s2-row' tabindex='0' data-t='" + esc(s.name) + "' data-v='" + fm(b) + "' data-b='" + esc(tip) + "' onclick=\"sheet2Roll(this,'rollSkillCheck'," + i + ")\"><span>" + (prof ? "<span class='s2-prof'>" + (exp ? "◆◆" : "◆") + "</span>" : "<span class='s2-noprof'>◇</span>") + s.name + "</span><span>" + fm(b) + "</span></div>");
      });
      h.push("<div class='s2-sg'><h4>" + abName(k).n + "</h4>" + rows.join("") + "</div>");
    });
    h.push("</div>");

    var sideAt0 = h.length;
    // ── Владения
    var pr = c.proficiencies || {};
    var profList = function (lists, labels) {
      var out = [];
      lists.forEach(function (arr) {
        (Array.isArray(arr) ? arr : []).forEach(function (x) {
          var t = typeof x === "string" ? x : (x && (x.name || x.label)) || "";
          t = (labels && labels[t]) || t;
          if (t && out.indexOf(t) === -1) out.push(t);
        });
      });
      return out.join(", ");
    };
    var armLbl = typeof ARMOR_TYPE_LABELS !== "undefined" ? ARMOR_TYPE_LABELS : null;
    var wpnLbl = typeof WEAPON_TYPE_LABELS !== "undefined" ? WEAPON_TYPE_LABELS : null;
    h.push("<h3>Владения</h3>");
    h.push("<div class='s2-kv'><b>Доспехи:</b> " + esc(profList([pr.armor, pr.armorCustom], armLbl) || "нет") + "</div>");
    h.push("<div class='s2-kv'><b>Оружие:</b> " + esc(profList([pr.weapon, pr.weaponCustom, pr.specificWeapons], wpnLbl) || "нет") + "</div>");
    h.push("<div class='s2-kv'><b>Инструменты:</b> " + esc(listText(pr.tools) || "нет") + "</div>");
    h.push("<div class='s2-kv'><b>Языки:</b> " + esc(listText(pr.languages) || "—") + "</div>");

    // ── Умения класса и подкласса: названия, описание — по нажатию
    var fts = classFeatures(c);
    if (fts.length) {
      h.push("<h3>Умения</h3><div class='s2-feats'>");
      fts.forEach(function (f) {
        h.push("<button type='button' class='s2-link' data-c='" + esc(f.cls) + "' data-s='" + esc(f.sub) + "' data-l='" + f.lvl + "' data-n='" + esc(f.name) + "' onclick='sheet2Feat(this)'>" + esc(f.name) + "</button>");
      });
      h.push("</div>");
    }
    // владения и умения — третья колонка рядом с характеристиками
    var side = h.splice(sideAt0);
    h.splice(sideAt, 0, side.join(""));
    h.push("</div>");

    // ── Правая колонка: хиты и отдых (РД-6: остальное — на «Бое» и в правой панели ПК)
    h.push("<aside>" + hpBlock(c) + restBlock(c) + "</aside></div>");
    return h.join("");
  }

  // ── РД-6: блоки боя — общие для листа, вкладки «Бой» и правой панели ПК
  function hpBlock(c) {
    var lvl = c.level || 1, cm = c.combat || {}, h = [];
    var spd = parseInt(cm.speed, 10) || 30;
    if (typeof rulesEffectiveSpeed === "function") spd = rulesEffectiveSpeed(c, spd).speed;
    var hpMax = (typeof rulesEffectiveHpMax === "function" ? rulesEffectiveHpMax(c) : cm.hpMax) || cm.hpMax || 1;
    var hpCur = cm.hpCurrent || 0;
    var ac = rulesAC(c);
    var acVal = (cm.armorId === "custom" && cm.ac) ? cm.ac : (ac && ac.ac) || cm.ac || 10;
    h.push("<div class='s2-trio'><div><small>КД</small><b>" + acVal + "</b></div><div><small>Инициатива</small><b>" + fm(getInitiativeMod(c, lvl)) + "</b></div><div><small>Скорость</small><b>" + spd + "</b></div></div>");
    if (c.concentration) h.push("<div class='s2-acts'><span class='s2-kv'>Концентрация: <b>" + esc(c.concentration) + "</b></span><button type='button' class='s2-link' onclick='endConcentration()'>Снять</button></div>");
    h.push("<div class='s2-hp'><span>Хиты" + (cm.hpTemp ? " <small style='color:var(--info)'>+" + cm.hpTemp + " врем.</small>" : "") + "</span><span class='s2-big'>" + hpCur + "<small> / " + hpMax + "</small></span></div>");
    h.push("<div class='s2-hpbar'><i style='width:" + Math.max(0, Math.min(100, Math.round(100 * hpCur / hpMax))) + "%'></i></div>");
    h.push("<div class='s2-hpctl'><input type='number' min='0' inputmode='numeric' placeholder='урон / лечение' aria-label='Сколько хитов' onkeydown=\"if(event.key==='Enter')sheet2HP(this,-1)\">");
    h.push("<button type='button' class='s2-btn s2-glow' onclick='sheet2HP(this,-1)' title='Урон' aria-label='Урон'>−</button><button type='button' class='s2-btn s2-glow' onclick='sheet2HP(this,1)' title='Лечение' aria-label='Лечение'>+</button></div>");
    h.push("<div class='s2-acts'><span class='s2-kv'>Временные хиты: <b>" + (cm.hpTemp || 0) + "</b></span></div>");
    if (hpCur <= 0) {
      var ds = c.deathSaves || { successes: [], failures: [] };
      var pips = function (arr, type) {
        var o = "";
        for (var i = 0; i < 3; i++) o += "<button type='button' class='s2-pip" + (arr[i] ? " on" : "") + "' onclick=\"toggleDeathSave('" + type + "'," + i + ")\">" + (arr[i] ? "◆" : "◇") + "</button>";
        return o;
      };
      h.push("<div class='s2-ds'><span>Успехи " + pips(ds.successes || [], "success") + "</span><span>Провалы " + pips(ds.failures || [], "failure") + "</span></div>");
    }
    return h.join("");
  }

  function restBlock(c) {
    var lvl = c.level || 1;
    var hdLeft = Math.max(0, lvl - ((c.combat && c.combat.hpDiceSpent) || 0));
    return "<h3>Отдых</h3><div class='s2-acts'><button type='button' class='s2-btn' onclick='openRestModal();showShortRestInfo()'>Короткий</button><button type='button' class='s2-btn' onclick='openRestModal();showLongRestInfo()'>Длинный</button></div>" +
      "<div class='s2-acts'><button type='button' class='s2-btn' onclick='rollHitDieQuick()'" + (hdLeft ? "" : " disabled") + ">Кость хитов</button><span class='s2-kv'>осталось " + hdLeft + " из " + lvl + " (" + esc(rulesHitDiceLabel(c)) + ")</span></div>";
  }

  // Атака строкой: название с бонусом — бросок атаки (режим — всплывашкой у строки), урон — бросок урона
  function atkRow(c, w, wi, lvl) {
    var m = rulesWeaponMods(c, w, lvl);
    var dmg = esc(w.damage || "") + (m.damageMod ? fm(m.damageMod) : "");
    var smite = wi >= 0 && typeof _canDivineSmite === "function" && _canDivineSmite(c, w)
      ? "<button type='button' class='s2-link' onclick='openDivineSmite(" + wi + ")' title='Божественная кара'>Кара</button>" : "";
    return "<div class='s2-atk'><button type='button' class='s2-atk-n' data-t='Атака: " + esc(w.name) + "' data-v='" + fm(m.attack) + "' data-b='урон " + dmg + "' onclick=\"sheet2Roll(this,'rollWeaponAttack'," + wi + ")\" title='Бросок атаки'>" + esc(w.name) + " <b>" + fm(m.attack) + "</b></button>" +
      smite + "<button type='button' class='s2-atk-d' onclick='rollWeaponDamage(" + wi + ")' title='Бросок урона'>" + dmg + "</button></div>";
  }

  function weaponsBlock(c) {
    var lvl = c.level || 1, h = [];
    var resRows = classResources(c);
    if (resRows) h.push("<h3>Ресурсы класса</h3>" + resRows);
    h.push("<h3>Оружие</h3>");
    (c.weapons || []).forEach(function (w, wi) { if (w && w.name) h.push(atkRow(c, w, wi, lvl)); });
    if (typeof _unarmedStrike === "function") h.push(atkRow(c, _unarmedStrike(c), UNARMED_WEAPON_INDEX, lvl));
    h.push("<div class='s2-acts'><button type='button' class='s2-link' onclick='openWeaponModal()'>+ Добавить оружие</button>" +
      ((c.weapons || []).length ? "<button type='button' class='s2-link' onclick='sheet2WeaponsEdit()'>" + (document.body.classList.contains("rd-wpn-edit") ? "Скрыть правку" : "Правка и мастерство") + "</button>" : "") + "</div>");
    return h.join("");
  }

  function diceBlock() {
    var h = ["<h3>Кубы</h3><div class='s2-dice'>"];
    DICE.forEach(function (d) { var n = pool[d] || 0; h.push("<button type='button' class='s2-die" + (n ? " on" : "") + "' onclick='sheet2Die(" + d + ")' aria-pressed='" + (n ? "true" : "false") + "'>" + (n > 1 ? n : "") + "к" + d + "</button>"); });
    var poolF = poolFormula();
    h.push("</div><div class='s2-acts'><button type='button' class='s2-btn s2-glow' onclick='sheet2DiceRoll()'" + (poolF ? "" : " disabled") + ">Бросить" + (poolF ? " " + esc(poolF) : "") + "</button>" + (poolF ? "<button type='button' class='s2-link' onclick='sheet2DiceClear()'>Сбросить</button>" : "<span class='s2-kv'>нажатия складываются</span>") + "</div>");
    h.push(rollsHtml());
    return h.join("");
  }

  // Ячейки: ромб ◆ — свободна (нажать — потратить), ◇ — потрачена (нажать — вернуть); в заголовке — свободно из всех
  function slotsBlock(c) {
    var sl = (c.spells && c.spells.slots) || {}, su = (c.spells && c.spells.slotsUsed) || {};
    var all = 0, free = 0;
    var rows = Object.keys(sl).filter(function (k) { return sl[k] > 0; }).map(function (k) {
      var left = Math.max(0, sl[k] - (su[k] || 0));
      all += sl[k]; free += left;
      var p = "";
      for (var i = 0; i < sl[k]; i++) {
        var on = i < left;
        p += "<button type='button' class='s2-pip" + (on ? " on" : "") + "' onclick='sheet2Slot(" + k + "," + (on ? 1 : -1) + ")' title='" + (on ? "Потратить" : "Вернуть") + "'>" + (on ? "◆" : "◇") + "</button>";
      }
      return "<div class='s2-res'><span>" + k + " круг <small class='s2-kv'>" + left + "/" + sl[k] + "</small></span><span class='s2-pips'>" + p + "</span></div>";
    });
    return rows.length ? "<h3>Ячейки <small class='s2-kv'>" + free + "/" + all + "</small></h3>" + rows.join("") : "";
  }

  function condBlock(c) {
    var conds = (c.conditions || []).length;
    return "<h3>Состояния</h3><div class='s2-acts'><span class='s2-kv'>" + (conds ? "активно: " + conds : "нет") + "</span><button type='button' class='s2-link' onclick='toggleConditionsPopup()'>Изменить</button></div>";
  }

  // «Бой»: на телефоне — всё; на ПК при открытой панели хиты, кубы, ячейки и состояния — в ней (.rd-b-rail)
  function buildBattle(c) {
    return "<div class='rd-b-rail'>" + hpBlock(c) + "</div>" + weaponsBlock(c) +
      "<div class='rd-b-rail'>" + diceBlock() + slotsBlock(c) + condBlock(c) + "</div>";
  }
  function buildRail(c) {
    return hpBlock(c) + restBlock(c) + diceBlock() + slotsBlock(c) + condBlock(c);
  }

  // Умения класса и подкласса до текущего уровня класса (мультикласс — по каждому)
  function classFeatures(c) {
    if (typeof edData !== "function") return [];
    var ed = edData(c), out = [], seen = {};
    var list = typeof _pgClassList === "function" ? _pgClassList(c) : [{ cls: c.class, level: c.level || 1, sub: c.subclass }];
    list.forEach(function (e) {
      var add = function (table, sub) {
        if (!table) return;
        for (var l = 1; l <= (e.level || 1); l++) {
          (table[l] || []).forEach(function (f) {
            if (!f || !f.name || seen[f.name]) return;
            seen[f.name] = 1;
            out.push({ cls: e.cls, sub: sub || "", lvl: l, name: f.name });
          });
        }
      };
      add(ed.CLASS_FEATURES && ed.CLASS_FEATURES[e.cls]);
      if (e.sub) add(ed.SUBCLASS_FEATURES && ed.SUBCLASS_FEATURES[e.sub], e.sub);
    });
    return out;
  }
  window.sheet2Feat = function (b) {
    openFeatureInfo(b.getAttribute("data-c"), b.getAttribute("data-s") || null, parseInt(b.getAttribute("data-l"), 10), b.getAttribute("data-n"));
  };

  // Заряды ресурсов класса: до 8 — ромбами, больше — счётчиком
  function classResources(c) {
    if (typeof getCharResourceDefs !== "function") return "";
    if (typeof initCharResources === "function") initCharResources(c);
    var data = getCharResourceDefs(c);
    if (!data || !data.resources) return "";
    var o = "";
    data.resources.forEach(function (r) {
      var max = getResourceMax(r, c);
      if (!max) return;
      var left = Math.max(0, max - ((c.resources && c.resources[r.id]) || 0));
      var id = esc(r.id), ctl = "";
      if (max <= 8) {
        ctl = "<span class='s2-pips'>";
        for (var i = 0; i < max; i++) ctl += "<button type='button' class='s2-pip" + (i < left ? " on" : "") + "' onclick=\"toggleResourcePip('" + id + "'," + i + ")\">" + (i < left ? "◆" : "◇") + "</button>";
        ctl += "</span>";
      } else {
        ctl = "<span class='s2-cnt'><button type='button' class='s2-link' onclick=\"spendResource('" + id + "',1)\"" + (left ? "" : " disabled") + ">−</button>" + left + " / " + max +
          "<button type='button' class='s2-link' onclick=\"spendResource('" + id + "',-1)\"" + (left < max ? "" : " disabled") + ">+</button></span>";
      }
      o += "<div class='s2-res'><span>" + esc(r.name) + "</span>" + ctl + "</div>";
    });
    return o;
  }

  // Последние броски из общей истории — вместо всплывашки «Последний бросок»
  function rollsHtml() {
    var hist = typeof diceHistory !== "undefined" && Array.isArray(diceHistory) ? diceHistory : [];
    if (!hist.length) return "";
    return "<div class='s2-rolls'>" + hist.slice(0, 3).map(function (r) {
      var lbl = r.label ? r.label : (r.mode === "custom" ? (r.formula || "формула") : ("к" + r.sides));
      var cls = "";
      if (r.sides === 20 && r.mode !== "custom") {
        var nat = typeof r.natural === "number" ? r.natural : (r.result - (r.mod || 0));
        cls = nat === 20 ? " crit" : nat === 1 ? " fail" : "";
      }
      var tag = r.mode === "adv" ? " <small>преим.</small>" : r.mode === "dis" ? " <small>помеха</small>" : "";
      return "<div class='s2-roll" + cls + "'><span>" + esc(lbl) + tag + "</span><b>" + esc(r.result) + "</b></div>";
    }).join("") + "</div>";
  }

  // Выбор режима броска — рядом со строкой, а не окном посреди экрана
  var anchor = null;
  window.sheet2Roll = function (el, fn, arg) {
    anchor = el;
    if (typeof window[fn] === "function") window[fn](arg);
  };
  function closePop() {
    var p = document.getElementById("s2-pop");
    if (p) p.remove();
    var a = document.querySelector(".s2-anchor");
    if (a) a.classList.remove("s2-anchor");
    document.removeEventListener("mousedown", outside, true);
    document.removeEventListener("keydown", onKey, true);
  }
  function outside(e) { var p = document.getElementById("s2-pop"); if (p && !p.contains(e.target)) closePop(); }
  function onKey(e) { if (e.key === "Escape") closePop(); }
  function openPop(el, cb, hint) {
    closePop();
    el.classList.add("s2-anchor");
    var p = document.createElement("div");
    p.id = "s2-pop";
    p.setAttribute("role", "dialog");
    var note = typeof rollHintText === "function" ? rollHintText(hint) : "";
    var sug = hint && hint.dis && hint.dis.length;
    p.innerHTML = "<div class='t'><span>" + esc(el.getAttribute("data-t")) + "</span><span>" + esc(el.getAttribute("data-v")) + "</span></div>" +
      "<div class='b'>" + esc(el.getAttribute("data-b") || "") + "</div>" +
      "<div class='r'><button type='button' class='go' data-mode='normal'>Бросить к20</button>" +
      "<button type='button' class='o adv' data-mode='adv'>▲ Преим.</button>" +
      "<button type='button' class='o dis" + (sug ? " sug" : "") + "' data-mode='dis'>▼ Помеха</button></div>" +
      (note ? "<div class='n'>" + esc(note) + "</div>" : "");
    p.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () { closePop(); cb(b.getAttribute("data-mode")); };
    });
    document.body.appendChild(p);
    var r = el.getBoundingClientRect(), pw = p.offsetWidth, ph = p.offsetHeight;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - pw - 8));
    var top = r.bottom + 6 + ph > window.innerHeight ? r.top - ph - 6 : r.bottom + 6;
    p.style.left = left + "px";
    p.style.top = Math.max(8, top) + "px";
    p.querySelector(".go").focus();
    setTimeout(function () {
      document.addEventListener("mousedown", outside, true);
      document.addEventListener("keydown", onKey, true);
    }, 0);
  }
  var origPopup = window.showRollModePopup;
  if (typeof origPopup === "function") {
    window.showRollModePopup = function (cb, hint) {
      var a = anchor;
      anchor = null;
      if (!a || !document.body.contains(a)) return origPopup.apply(this, arguments);
      openPop(a, cb, hint);
    };
  }
  // строки листа открываются и с клавиатуры
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList && e.target.classList.contains("s2-row") && e.target.closest("#sheet2, .s2-box")) {
      e.preventDefault();
      e.target.click();
    }
  });

  window.sheet2Toggle = function () { showOld = !showOld; render(); };
  // правка поля старого листа: его oninput пересчитывает и сохраняет
  window.sheet2Set = function (id, v) {
    var el = document.getElementById(id);
    if (!el) return;
    var n = parseInt(v, 10) || 0;
    if (id === "char-level") n = Math.max(1, Math.min(20, n || 1));
    el.value = Math.max(0, n);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    schedule();
  };
  function poolFormula() {
    return DICE.slice().reverse().filter(function (d) { return pool[d]; })
      .map(function (d) { return pool[d] + "к" + d; }).join("+");
  }
  window.sheet2Die = function (d) { pool[d] = Math.min(20, (pool[d] || 0) + 1); render(); };
  window.sheet2DiceClear = function () { pool = {}; render(); };
  window.sheet2DiceRoll = function () {
    var f = poolFormula();
    if (!f) return;
    pool = {};
    render();
    rollFormula(f, { label: f, openArena: true, noMin: true });
  };
  window.sheet2HP = function (btn, sign) {
    var el = btn.parentNode.querySelector("input");
    var n = parseInt(el && el.value, 10);
    if (!n || n < 0) return;
    quickHP(sign * n);
  };
  // sign 1 — потратить ячейку, -1 — вернуть (лист зафиксирован: adjustSpellSlots меняет slotsUsed)
  window.sheet2Slot = function (level, sign) { adjustSpellSlots(level, -sign); };
  // старая карточка оружия (правка, удаление, мастерство, второе оружие) — по запросу
  window.sheet2WeaponsEdit = function () { document.body.classList.toggle("rd-wpn-edit"); render(); };

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; try { render(); } catch (e) { console.error("sheet2", e); } }, 0);
  }
  ["showScreen", "calcStats", "updateHPDisplay", "loadCharacter", "loadDeathSaves", "toggleInspiration",
   "applySheetLockUI", "switchTab", "recalculateHP", "calculateAC", "saveToLocal",
   "renderClassResources", "renderDiceHistory", "renderWeapons", "renderQuickRollStrip", "setConcentration", "endConcentration"].forEach(function (name) {
    var orig = window[name];
    if (typeof orig !== "function") return;
    window[name] = function () { var r = orig.apply(this, arguments); schedule(); return r; };
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
})();
