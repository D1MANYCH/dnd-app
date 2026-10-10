// РОСТ-8 (демо): лист персонажа по макету дизайнера (Figma «Заполненный лист»).
// Включается ?sheet2=1 (запоминается), выключается ?sheet2=0. Показывается только
// у зафиксированного листа; старый лист остаётся в DOM и считает всё как раньше.
(function () {
  var KEY = "dnd_sheet2";
  try {
    var q = new URLSearchParams(location.search).get("sheet2");
    if (q === "1") localStorage.setItem(KEY, "1");
    if (q === "0") localStorage.removeItem(KEY);
    if (localStorage.getItem(KEY) !== "1") return;
  } catch (e) { return; }

  var showOld = false;
  var AB = [
    { k: "str", n: "Сила", s: "Сил" }, { k: "dex", n: "Ловкость", s: "Лов" },
    { k: "con", n: "Телосложение", s: "Тел" }, { k: "int", n: "Интеллект", s: "Инт" },
    { k: "wis", n: "Мудрость", s: "Мдр" }, { k: "cha", n: "Харизма", s: "Хар" }
  ];
  var SKILL_GROUPS = ["str", "dex", "int", "wis", "cha"];
  var DICE = [4, 6, 8, 10, 12, 20, 100];

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

  var css = [
    "#sheet2{--s2-action:#3ba0f0;--s2-action-hi:#62b4f4;--s2-action-lo:#1f7fcc;--s2-on-action:#04121f;",
    "--s2-line:var(--border-soft);color:var(--text);font-size:15px;line-height:1.35;margin:0 0 24px}",
    ":root[data-theme='light'] #sheet2{--s2-action:#1f6fb8;--s2-action-hi:#2a7fcc;--s2-action-lo:#185a96;--s2-on-action:#fff}",
    "body.sheet2-on #tab-sheet>:not(#sheet2):not(#sheet2-bar){display:none!important}",
    // на ПК #tab-sheet — flex-ряд колонок: демо занимает всю ширину, а не узкую колонку
    "#tab-sheet>#sheet2,#tab-sheet>#sheet2-bar{flex:0 0 100%;grid-column:1/-1;width:100%;min-width:0}",
    // хиты/КД/ячейки уже есть в демо — правая панель на вкладке листа их дублирует
    "body.sheet2-tab .app-right-rail{display:none!important}",
    "@media (min-width:1024px){body.sheet2-tab{padding-right:0!important}}",
    "#sheet2-bar{display:flex;gap:12px;align-items:center;font-size:13px;color:var(--text-mute);margin:4px 0 12px}",
    "#sheet2-bar button{background:none;border:0;color:var(--accent-ink);cursor:pointer;font:inherit;padding:4px 0;text-decoration:underline}",
    "#sheet2 h2,#sheet2 h3{font-family:var(--font-display);font-weight:600;margin:0}",
    "#sheet2 h3{font-size:19px;margin:22px 0 8px}",
    "#sheet2 .s2-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:16px 24px;align-items:start;padding-bottom:16px;border-bottom:1px solid var(--s2-line)}",
    "#sheet2 .s2-ava{width:60px;height:60px;border-radius:50%;background:var(--bg-3) center/cover;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:24px;color:var(--accent-ink);overflow:hidden}",
    "#sheet2 .s2-ava img{width:100%;height:100%;object-fit:cover}",
    "#sheet2 .s2-name{font-size:24px;line-height:1.15;overflow-wrap:anywhere}",
    "#sheet2 .s2-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 24px;margin-top:8px;font-size:14px}",
    "#sheet2 .s2-facts b{font-weight:600;color:var(--text-dim)}",
    "#sheet2 .s2-lvl{text-align:right;min-width:170px}",
    "#sheet2 .s2-lvl .s2-big{font-family:var(--font-display);font-size:20px}",
    "#sheet2 .s2-xp{height:3px;background:var(--bg-3);margin:6px 0 10px;border-radius:2px;overflow:hidden}",
    "#sheet2 .s2-xp i{display:block;height:100%;background:var(--accent)}",
    "#sheet2 .s2-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:36px;padding:0 16px;border:0;border-radius:6px;",
    "background:var(--s2-action);color:var(--s2-on-action);font:600 15px var(--font-display);cursor:pointer;transition:background .12s,transform .06s}",
    "#sheet2 .s2-btn:hover{background:var(--s2-action-hi)}",
    "#sheet2 .s2-btn:active{background:var(--s2-action-lo);transform:translateY(1px) scale(.97)}",
    "#sheet2 .s2-btn:focus-visible,#sheet2 .s2-link:focus-visible,#sheet2 .s2-row:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}",
    "#sheet2 .s2-link{background:none;border:0;padding:2px 0;color:var(--accent-ink);font:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px}",
    "#sheet2 .s2-link:hover{color:var(--accent-hover)}",
    "#sheet2 .s2-link:active{color:var(--accent-lo)}",
    "#sheet2 .s2-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:0 32px}",
    "#sheet2 .s2-line{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:14px;color:var(--text-dim);margin:14px 0 0}",
    "#sheet2 .s2-line b{color:var(--text);font-weight:600}",
    "#sheet2 .s2-line .s2-link{padding:0}",
    "#sheet2 .s2-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 28px}",
    "#sheet2 table{width:100%;border-collapse:collapse;font-size:15px}",
    "#sheet2 th{font-weight:400;font-size:12px;color:var(--text-mute);text-align:left;padding:4px 6px;border-bottom:1px solid var(--s2-line)}",
    "#sheet2 td{padding:6px;border-bottom:1px solid var(--s2-line)}",
    "#sheet2 td.n{text-align:right;font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-row{cursor:pointer;transition:color .12s,background .12s}",
    "#sheet2 .s2-row:hover{color:var(--s2-action-hi)}",
    "#sheet2 .s2-row:active{background:var(--bg-3);color:var(--s2-action)}",
    "#sheet2 .s2-prof{display:inline-block;width:17px;color:var(--accent);font-size:11px}",
    "#sheet2 .s2-noprof{display:inline-block;width:17px}",
    "#sheet2 .s2-skills{columns:2;column-gap:28px}",
    "#sheet2 .s2-sg{break-inside:avoid;margin-bottom:10px}",
    "#sheet2 .s2-sg h4{font:600 12px var(--font-display);color:var(--text-mute);margin:0 0 2px;text-transform:uppercase;letter-spacing:.04em}",
    "#sheet2 .s2-sk{display:flex;justify-content:space-between;padding:4px 6px;border-bottom:1px solid var(--s2-line);font-size:15px}",
    "#sheet2 .s2-sk span:last-child{font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-kv{font-size:14px;margin:3px 0;color:var(--text-dim)}",
    "#sheet2 .s2-kv b{color:var(--text);font-weight:600}",
    "#sheet2 aside{border-left:1px solid var(--s2-line);padding-left:24px}",
    "#sheet2 .s2-hp{display:flex;align-items:baseline;justify-content:space-between;margin-top:14px}",
    "#sheet2 .s2-hp .s2-big{font-family:var(--font-display);font-size:28px;font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-hpbar{height:4px;background:var(--bg-3);border-radius:2px;overflow:hidden;margin:4px 0 10px}",
    "#sheet2 .s2-hpbar i{display:block;height:100%;background:var(--success)}",
    "#sheet2 .s2-hpctl{display:flex;gap:6px}",
    "#sheet2 .s2-hpctl input{flex:1;min-width:0;height:36px;background:var(--bg-2);border:1px solid var(--border);border-radius:6px;color:var(--text);font:inherit;padding:0 10px}",
    "#sheet2 .s2-hpctl .s2-btn{min-width:44px;padding:0 10px}",
    "#sheet2 .s2-trio{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;margin:14px 0 4px;border-top:1px solid var(--s2-line);border-bottom:1px solid var(--s2-line)}",
    "#sheet2 .s2-trio div{padding:8px 0}",
    "#sheet2 .s2-trio small{display:block;font-size:12px;color:var(--text-mute)}",
    "#sheet2 .s2-trio b{font-family:var(--font-display);font-size:20px}",
    "#sheet2 .s2-ds{display:flex;gap:14px;font-size:14px;color:var(--text-dim);margin:8px 0}",
    "#sheet2 .s2-pip{background:none;border:0;padding:2px;cursor:pointer;color:var(--text-mute);font-size:15px}",
    "#sheet2 .s2-pip.on{color:var(--accent)}",
    "#sheet2 .s2-dice{display:flex;flex-wrap:wrap;gap:4px 12px;margin:6px 0}",
    "#sheet2 .s2-acts{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;margin:6px 0}",
    "#sheet2 .s2-acts .s2-kv{margin:0}",
    "@media (max-width:760px){",
    "#sheet2 .s2-head{grid-template-columns:auto minmax(0,1fr)}",
    "#sheet2 .s2-lvl{grid-column:1/-1;text-align:left;display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:center}",
    "#sheet2 .s2-lvl .s2-xp{grid-column:1/-1;margin:0}",
    "#sheet2 .s2-facts{grid-template-columns:1fr}",
    "#sheet2 .s2-body{grid-template-columns:1fr}",
    "#sheet2 aside{order:-1;border-left:0;padding-left:0;border-bottom:1px solid var(--s2-line);padding-bottom:12px}",
    "#sheet2 .s2-two{grid-template-columns:1fr}",
    "#sheet2 .s2-skills{columns:1}",
    "}"
  ].join("\n");

  function ensureNodes() {
    var tab = document.getElementById("tab-sheet");
    if (!tab) return null;
    if (!document.getElementById("sheet2-style")) {
      var st = document.createElement("style");
      st.id = "sheet2-style";
      st.textContent = css;
      document.head.appendChild(st);
    }
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
    return { bar: bar, root: root };
  }

  function render() {
    var nodes = ensureNodes();
    if (!nodes) return;
    var char = (typeof currentId !== "undefined" && currentId) ? getCurrentChar() : null;
    var locked = !!(char && typeof isSheetLocked === "function" && isSheetLocked(char));
    var on = locked && !showOld;
    document.body.classList.toggle("sheet2-on", on);
    var tabEl = document.getElementById("tab-sheet");
    document.body.classList.toggle("sheet2-tab", on && tabEl.classList.contains("active"));
    nodes.root.style.display = on ? "" : "none";
    nodes.bar.innerHTML = !char ? "" : !locked
      ? "Демо нового листа: зафиксируйте лист, чтобы увидеть его"
      : "Демо нового листа · <button type='button' onclick='sheet2Toggle()'>" + (showOld ? "Показать новый" : "Показать старый") + "</button>";
    if (!on) return;
    nodes.root.innerHTML = build(char);
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
    h.push("<div class='s2-head'>");
    h.push("<div class='s2-ava'>" + avaHtml + "</div>");
    h.push("<div><h2 class='s2-name'>" + esc(c.name || "Без имени") + "</h2><div class='s2-facts'>");
    h.push("<div><b>Класс:</b> " + esc(isMulticlass(c) ? getClassLabel(c) : c.class) + "</div>");
    h.push("<div><b>Подкласс:</b> " + esc(c.subclass || "нет") + "</div>");
    h.push("<div><b>Раса:</b> " + esc(c.race || "—") + "</div>");
    var spd = parseInt(cm.speed, 10) || 30;
    if (typeof rulesEffectiveSpeed === "function") spd = rulesEffectiveSpeed(c, spd).speed;
    h.push("<div><b>Скорость:</b> " + spd + " фт</div>");
    h.push("<div><b>Предыстория:</b> " + esc(c.background || "—") + "</div>");
    h.push("<div><b>Мировоззрение:</b> " + esc(c.alignment || "—") + "</div>");
    h.push("</div></div>");
    h.push("<div class='s2-lvl'><div class='s2-big'>" + lvl + " уровень</div>");
    h.push("<div class='s2-kv'>Опыт " + (xp.have || 0) + (xp.need ? " / " + xp.need : "") + "</div>");
    h.push("<div class='s2-xp'><i style='width:" + xpPct + "%'></i></div>");
    h.push("<button type='button' class='s2-btn' onclick='openLevelUpModal()'>↑ Повысить</button></div>");
    h.push("</div>");

    h.push("<div class='s2-body'><div>");

    // ── Строка общих чисел
    var pp = rulesPassivePerception(c, lvl, !!(c.skills && c.skills[3]));
    h.push("<div class='s2-line'><span>Бонус мастерства <b>" + fm(pb) + "</b></span>");
    h.push("<span>Вдохновение: <button type='button' class='s2-link' onclick='toggleInspiration()'>" + (c.inspiration ? "есть" : "нет") + "</button></span>");
    h.push("<span>Пассивная Внимательность <b>" + pp + "</b></span></div>");

    // ── Характеристики + спасброски
    h.push("<div class='s2-two'><div><h3>Характеристики</h3><table><tr><th>Хар.</th><th class='n'>Значение</th><th class='n'>Мод.</th></tr>");
    AB.forEach(function (a) {
      var v = (c.stats && c.stats[a.k]) || 10;
      h.push("<tr class='s2-row' tabindex='0' onclick=\"rollAbilityCheck('" + a.k + "')\" title='Бросить проверку'><td>" + a.n + "</td><td class='n'>" + v + "</td><td class='n'>" + fm(getMod(v)) + "</td></tr>");
    });
    h.push("</table></div><div><h3>Спасброски</h3><table><tr><th>Хар.</th><th class='n'>Бонус</th></tr>");
    AB.forEach(function (a) {
      var prof = !!(c.saves && c.saves[a.k]);
      var b = rulesSaveBonus(c, a.k, lvl, prof);
      var tip = fm(getMod((c.stats && c.stats[a.k]) || 10)) + " " + a.s + (prof ? " · " + fm(pb) + " мастерство" : "");
      h.push("<tr class='s2-row' tabindex='0' onclick=\"rollSavingThrow('" + a.k + "')\" title='" + esc(tip) + "'><td>" + (prof ? "<span class='s2-prof'>◆</span>" : "<span class='s2-noprof'></span>") + a.n + "</td><td class='n'>" + fm(b) + "</td></tr>");
    });
    h.push("</table></div></div>");

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
        rows.push("<div class='s2-sk s2-row' tabindex='0' onclick='rollSkillCheck(" + i + ")' title='" + esc(tip) + "'><span>" + (prof ? "<span class='s2-prof'>" + (exp ? "◆◆" : "◆") + "</span>" : "<span class='s2-noprof'></span>") + s.name + "</span><span>" + fm(b) + "</span></div>");
      });
      h.push("<div class='s2-sg'><h4>" + abName(k).n + "</h4>" + rows.join("") + "</div>");
    });
    h.push("</div>");

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
    h.push("</div>");

    // ── Правая колонка: бой
    var hpMax = (typeof rulesEffectiveHpMax === "function" ? rulesEffectiveHpMax(c) : cm.hpMax) || cm.hpMax || 1;
    var hpCur = cm.hpCurrent || 0;
    var ac = rulesAC(c);
    var acVal = (cm.armorId === "custom" && cm.ac) ? cm.ac : (ac && ac.ac) || cm.ac || 10;
    var hdLeft = Math.max(0, lvl - (cm.hpDiceSpent || 0));
    h.push("<aside>");
    h.push("<div class='s2-trio'><div><small>КД</small><b>" + acVal + "</b></div><div><small>Инициатива</small><b>" + fm(getInitiativeMod(c, lvl)) + "</b></div><div><small>Скорость</small><b>" + spd + "</b></div></div>");
    h.push("<div class='s2-hp'><span>Хиты" + (cm.hpTemp ? " <small style='color:var(--info)'>+" + cm.hpTemp + " врем.</small>" : "") + "</span><span class='s2-big'>" + hpCur + " / " + hpMax + "</span></div>");
    h.push("<div class='s2-hpbar'><i style='width:" + Math.max(0, Math.min(100, Math.round(100 * hpCur / hpMax))) + "%'></i></div>");
    h.push("<div class='s2-hpctl'><input id='s2-hp-n' type='number' min='0' inputmode='numeric' placeholder='0' aria-label='Сколько хитов'>");
    h.push("<button type='button' class='s2-btn' onclick='sheet2HP(-1)' title='Урон'>−</button><button type='button' class='s2-btn' onclick='sheet2HP(1)' title='Лечение'>+</button></div>");
    if (hpCur <= 0) {
      var ds = c.deathSaves || { successes: [], failures: [] };
      var pips = function (arr, type) {
        var o = "";
        for (var i = 0; i < 3; i++) o += "<button type='button' class='s2-pip" + (arr[i] ? " on" : "") + "' onclick=\"toggleDeathSave('" + type + "'," + i + ")\">" + (arr[i] ? "◆" : "◇") + "</button>";
        return o;
      };
      h.push("<div class='s2-ds'><span>Успехи " + pips(ds.successes || [], "success") + "</span><span>Провалы " + pips(ds.failures || [], "failure") + "</span></div>");
    }

    h.push("<h3>Отдых</h3><div class='s2-acts'><button type='button' class='s2-link' onclick='openRestModal();showShortRestInfo()'>Короткий</button><button type='button' class='s2-link' onclick='openRestModal();showLongRestInfo()'>Длинный</button></div>");
    h.push("<div class='s2-acts'><button type='button' class='s2-btn' onclick='rollHitDieQuick()'" + (hdLeft ? "" : " disabled") + ">Кость хитов</button><span class='s2-kv'>осталось " + hdLeft + " из " + lvl + " (" + esc(rulesHitDiceLabel(c)) + ")</span></div>");

    // ── Атаки
    var ws = (c.weapons || []).filter(function (w) { return w && w.name; });
    if (ws.length) {
      h.push("<h3>Атаки</h3>");
      ws.slice(0, 6).forEach(function (w) {
        var m = rulesWeaponMods(c, w, lvl);
        h.push("<div class='s2-sk'><span>" + esc(w.name) + "</span><span>" + fm(m.attack) + " · " + esc(w.damage || "") + (m.damageMod ? fm(m.damageMod) : "") + "</span></div>");
      });
    }

    // ── Кубы
    h.push("<h3>Кубы</h3><div class='s2-dice'>");
    DICE.forEach(function (d) { h.push("<button type='button' class='s2-link' onclick='quickRoll({sides:" + d + "})'>к" + d + "</button>"); });
    h.push("</div>");

    // ── Ячейки
    var sl = (c.spells && c.spells.slots) || {}, su = (c.spells && c.spells.slotsUsed) || {};
    var slotParts = Object.keys(sl).filter(function (k) { return sl[k] > 0; }).map(function (k) {
      var left = Math.max(0, sl[k] - (su[k] || 0));
      return "<div class='s2-acts'><span class='s2-kv'>" + k + " круг " + left + "/" + sl[k] + "</span>" +
        "<button type='button' class='s2-link' onclick='sheet2Slot(" + k + ",1)'" + (left ? "" : " disabled") + ">Потратить</button>" +
        "<button type='button' class='s2-link' onclick='sheet2Slot(" + k + ",-1)'" + (su[k] ? "" : " disabled") + ">Вернуть</button></div>";
    });
    if (slotParts.length) h.push("<h3>Ячейки заклинаний</h3>" + slotParts.join(""));

    var conds = (c.conditions || []).length;
    h.push("<h3>Состояния</h3><div class='s2-acts'><span class='s2-kv'>" + (conds ? "активно: " + conds : "нет") + "</span><button type='button' class='s2-link' onclick='toggleConditionsPopup()'>Изменить</button></div>");
    h.push("</aside></div>");
    return h.join("");
  }

  window.sheet2Toggle = function () { showOld = !showOld; render(); };
  window.sheet2HP = function (sign) {
    var el = document.getElementById("s2-hp-n");
    var n = parseInt(el && el.value, 10);
    if (!n || n < 0) return;
    quickHP(sign * n);
  };
  // sign 1 — потратить ячейку, -1 — вернуть (лист зафиксирован: adjustSpellSlots меняет slotsUsed)
  window.sheet2Slot = function (level, sign) { adjustSpellSlots(level, -sign); };

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; try { render(); } catch (e) { console.error("sheet2", e); } }, 0);
  }
  ["calcStats", "updateHPDisplay", "loadCharacter", "loadDeathSaves", "toggleInspiration",
   "applySheetLockUI", "switchTab", "recalculateHP", "calculateAC", "saveToLocal"].forEach(function (name) {
    var orig = window[name];
    if (typeof orig !== "function") return;
    window[name] = function () { var r = orig.apply(this, arguments); schedule(); return r; };
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
})();
