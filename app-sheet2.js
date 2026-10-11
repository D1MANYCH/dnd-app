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
  var pool = {}; // кубы, набранные нажатиями: { грани: количество }
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
    // цвета — наши: действие = заливка акцентом темы, переход/справка = акцент текстом с подчёркиванием
    "#sheet2,#s2-pop{--s2-action:var(--accent);--s2-action-hi:var(--accent-hi);--s2-action-lo:var(--accent-lo);--s2-on-action:var(--on-accent);",
    "--s2-line:var(--border-soft)}",
    "#sheet2{color:var(--text);font-size:15px;line-height:1.35;margin:0 0 24px}",
    "body.sheet2-on #tab-sheet>:not(#sheet2):not(#sheet2-bar){display:none!important}",
    // на ПК #tab-sheet — flex-ряд колонок: демо занимает всю ширину, а не узкую колонку
    "#tab-sheet>#sheet2,#tab-sheet>#sheet2-bar{flex:0 0 100%;grid-column:1/-1;width:100%;min-width:0}",
    // хиты/КД/ячейки уже есть в демо — правая панель на вкладке листа их дублирует
    "body.sheet2-tab .app-right-rail{display:none!important}",
    // ПК: правая колонка — настоящая боковая панель, как .app-right-rail (закреплена, своя граница и фон)
    "@media (min-width:1024px){body.sheet2-tab{padding-right:296px!important}",
    // анимация появления оставляет transform у предков — fixed-панель тогда привязывается к ним, а не к окну
    "body.sheet2-tab #tab-sheet,body.sheet2-tab #sheet2,body.sheet2-tab #screen-character:not(.screen-ghost){animation:none!important;transform:none!important}",
    // уходящий экран (призрак перехода) летит вместе с панелью — её fixed тут не нужен
    ".screen-ghost #sheet2 aside{display:none!important}",
    "#sheet2 .s2-body{grid-template-columns:minmax(0,1fr)!important}",
    "#sheet2 aside{position:fixed;top:72px;right:0;bottom:0;width:296px;box-sizing:border-box;padding:16px 20px 32px!important;overflow-y:auto;overflow-x:hidden;z-index:40;",
    "border-left:1px solid var(--border-soft);background:var(--surface-sticky,rgba(20,22,30,.55));backdrop-filter:blur(var(--sticky-blur,12px));-webkit-backdrop-filter:blur(var(--sticky-blur,12px))}",
    ":root[data-theme='light'] #sheet2 aside{background:var(--bg-1)}",
    "#sheet2 aside h3:first-of-type{margin-top:14px}}",
    "#sheet2-bar{display:flex;gap:12px;align-items:center;font-size:13px;color:var(--text-mute);margin:4px 0 12px}",
    "#sheet2-bar button{background:none;border:0;color:var(--accent-ink);cursor:pointer;font:inherit;padding:4px 0;text-decoration:underline}",
    "#sheet2 h2,#sheet2 h3{font-family:var(--font-display);font-weight:600;margin:0;color:var(--text)}",
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
    "#sheet2 .s2-xp i{display:block;height:100%;background:var(--text-dim)}",
    "#sheet2 .s2-num{width:3.2em;background:none;border:0;border-bottom:1px dashed var(--s2-line);color:inherit;font:inherit;text-align:right;padding:0 2px}",
    "#sheet2 .s2-num:focus{outline:none!important;box-shadow:none!important;background:none!important;border-color:transparent transparent var(--s2-action)!important}",
    "#sheet2 .s2-lvl .s2-big .s2-num{width:1.6em;text-align:center}",
    "#sheet2 .s2-num.w{width:5em}",
    "#sheet2 .s2-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:36px;padding:0 16px;border:0;border-radius:6px;",
    "background:var(--s2-action);color:var(--s2-on-action);font:600 15px var(--font-display);cursor:pointer;transition:background .12s,transform .06s}",
    "#sheet2 .s2-btn:hover{background:var(--s2-action-hi)}",
    "#sheet2 .s2-btn:active{background:var(--s2-action-lo);transform:translateY(1px) scale(.97)}",
    "#sheet2 .s2-btn:focus-visible,#sheet2 .s2-link:focus-visible,#sheet2 .s2-row:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}",
    "#sheet2 .s2-link{background:none;border:0;padding:2px 0;color:var(--accent-ink);font:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px}",
    "#sheet2 .s2-link:hover{color:var(--accent-hover)}",
    "#sheet2 .s2-link:active{color:var(--s2-action-lo)}",
    "#sheet2 .s2-link:disabled{color:var(--text-mute);cursor:default;text-decoration:none}",
    "#sheet2 .s2-body{display:grid;grid-template-columns:minmax(0,1fr) 264px;gap:0 32px}",
    "#sheet2 .s2-head,#sheet2 .s2-main{grid-column:1}",
    "#sheet2 .s2-line{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:14px;color:var(--text-dim);margin:14px 0 0}",
    "#sheet2 .s2-line b{color:var(--text);font-weight:600}",
    "#sheet2 .s2-line .s2-link{padding:0}",
    "#sheet2 .s2-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr) minmax(0,1.3fr);gap:0 48px}",
    "#sheet2 table{width:100%;border-collapse:collapse;font-size:15px}",
    "#sheet2 th{font-weight:400;font-size:12px;color:var(--text-mute);text-align:left;padding:4px 6px;border-bottom:1px solid var(--s2-line)}",
    "#sheet2 td{padding:8px 6px}",
    "#sheet2 td.n{text-align:right;font-variant-numeric:tabular-nums}",
    // главное число — модификатор, значение приглушено
    "#sheet2 td.v{color:var(--text-mute)}",
    "#sheet2 td.m{font-weight:700;font-size:16px}",
    "#sheet2 .s2-row{cursor:pointer;transition:color .12s,background .12s;border-radius:4px}",
    "#sheet2 .s2-row:hover,#sheet2 .s2-row.s2-anchor{background:var(--accent-soft);color:var(--accent-hover)}",
    "#sheet2 .s2-row:active{background:var(--bg-3);color:var(--s2-action)}",
    "#sheet2 .s2-feats{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:14px}",
    "#sheet2 .s2-res{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;font-size:14px}",
    "#sheet2 .s2-res>span:first-child{min-width:0;overflow-wrap:anywhere}",
    "#sheet2 .s2-pips{display:flex;flex-wrap:wrap;gap:2px;flex-shrink:0}",
    "#sheet2 .s2-cnt{display:flex;align-items:center;gap:6px;flex-shrink:0;font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-atk{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:2px 0;border-bottom:1px solid var(--s2-line)}",
    "#sheet2 .s2-atk button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:5px 4px;border-radius:4px}",
    "#sheet2 .s2-atk button:hover{background:var(--accent-soft);color:var(--accent-hover)}",
    "#sheet2 .s2-atk .s2-atk-n{text-align:left;flex:1;min-width:0}",
    "#sheet2 .s2-atk .s2-atk-d{color:var(--text-dim);font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-rolls{margin:8px 0 0;font-size:14px}",
    "#sheet2 .s2-roll{display:flex;justify-content:space-between;gap:8px;padding:3px 0;color:var(--text-dim)}",
    "#sheet2 .s2-roll>span{min-width:0;overflow-wrap:anywhere}",
    "#sheet2 .s2-roll b{flex:none;font-family:var(--font-display);font-size:17px;color:var(--text);font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-roll:first-child b{font-size:22px}",
    "#sheet2 .s2-roll.crit b{color:var(--success)}",
    "#sheet2 .s2-roll.fail b{color:var(--danger)}",
    "#sheet2 .s2-roll small{color:var(--text-mute)}",
    // всплывающий выбор режима броска рядом со строкой
    "#s2-pop{position:fixed;z-index:1200;min-width:240px;max-width:400px;padding:12px 14px;border-radius:8px;background:var(--surface-modal,var(--bg-1));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);",
    "border:1px solid var(--border);box-shadow:0 10px 28px rgba(0,0,0,.45);color:var(--text);font-size:14px}",
    "#s2-pop .t{display:flex;justify-content:space-between;gap:12px;font:600 16px var(--font-display)}",
    "#s2-pop .b{color:var(--text-mute);font-size:13px;margin:2px 0 10px}",
    "#s2-pop .r{display:flex;gap:6px;align-items:center}",
    "#s2-pop button{white-space:nowrap;font:600 14px var(--font-display);cursor:pointer;border-radius:6px;min-height:34px;padding:0 12px}",
    "#s2-pop .go{background:var(--s2-action);color:var(--s2-on-action);border:0}",
    "#s2-pop .go:hover{background:var(--s2-action-hi)}",
    "#s2-pop .o{background:none;border:1px solid var(--border);color:var(--text-dim)}",
    "#s2-pop .o:hover{border-color:var(--accent);color:var(--text)}",
    "#s2-pop .o.adv{color:var(--success)}",
    "#s2-pop .o.dis{color:var(--danger)}",
    "#s2-pop .o.sug{border-color:var(--danger)}",
    "#s2-pop .n{margin-top:8px;font-size:12px;color:var(--danger)}",
    "#sheet2 .s2-prof{display:inline-block;width:17px;color:var(--text);font-size:11px}",
    "#sheet2 .s2-noprof{display:inline-block;width:17px}",
    "#sheet2 .s2-skills{columns:3;column-gap:40px}",
    "#sheet2 .s2-sg{break-inside:avoid;margin-bottom:10px}",
    "#sheet2 .s2-sg h4{font:600 12px var(--font-display);color:var(--text-mute);margin:0 0 2px;text-transform:uppercase;letter-spacing:.04em}",
    "#sheet2 .s2-sk{display:flex;justify-content:space-between;padding:4px 6px;border-bottom:1px solid var(--s2-line);font-size:15px}",
    "#sheet2 .s2-sk span:last-child{font-variant-numeric:tabular-nums}",
    "#sheet2 .s2-kv{font-size:14px;margin:3px 0;color:var(--text-dim)}",
    "#sheet2 .s2-kv b{color:var(--text);font-weight:600}",
    "#sheet2 aside{grid-column:2;grid-row:1/span 2;border-left:1px solid var(--s2-line);padding-left:24px}",
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
    "#sheet2 .s2-pip.on{color:var(--s2-action)}",
    "#sheet2 .s2-dice{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0}",
    "#sheet2 .s2-die{min-height:36px;border:1px solid var(--s2-action);border-radius:4px;background:none;color:var(--s2-action);font:600 15px var(--font-display);cursor:pointer;transition:background .12s,color .12s}",
    "#sheet2 .s2-die:hover{border-color:var(--s2-action-hi);color:var(--s2-action-hi)}",
    "#sheet2 .s2-die.on{background:var(--s2-action);color:var(--s2-on-action)}",
    "#sheet2 .s2-die:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}",
    "#sheet2 .s2-acts{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;margin:6px 0}",
    "#sheet2 .s2-acts .s2-kv{margin:0}",
    "#sheet2 .s2-pool{margin:2px 0 0;overflow-wrap:anywhere}",
    "@media (max-width:760px){",
    "#sheet2 .s2-head{grid-template-columns:auto minmax(0,1fr)}",
    "#sheet2 .s2-lvl{grid-column:1/-1;text-align:left;display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:center}",
    "#sheet2 .s2-lvl .s2-xp{grid-column:1/-1;margin:0}",
    "#sheet2 .s2-facts{grid-template-columns:1fr}",
    "#sheet2 .s2-body{grid-template-columns:1fr}",
    "#sheet2 .s2-head{order:-2}",
    "#sheet2 aside{order:-1;grid-column:1;grid-row:auto;border-left:0;padding-left:0;border-bottom:1px solid var(--s2-line);padding-bottom:12px}",
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
    var scr = document.getElementById("screen-character");
    var scrOn = !scr || (!scr.classList.contains("hidden") && !scr.classList.contains("screen-ghost"));
    document.body.classList.toggle("sheet2-tab", on && scrOn && tabEl.classList.contains("active"));
    nodes.root.style.display = on ? "" : "none";
    nodes.bar.innerHTML = !char ? "" : !locked
      ? "Демо нового листа: зафиксируйте лист, чтобы увидеть его"
      : "Демо нового листа · <button type='button' onclick='sheet2Toggle()'>" + (showOld ? "Показать новый" : "Показать старый") + "</button>";
    if (!on) return;
    // правая панель прокручивается сама — перерисовка не должна сбрасывать её наверх
    var side = nodes.root.querySelector("aside"), sideTop = side ? side.scrollTop : 0;
    nodes.root.innerHTML = build(char);
    side = nodes.root.querySelector("aside");
    if (side && sideTop) side.scrollTop = sideTop;
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
    h.push("<div class='s2-lvl'><div class='s2-big'><input class='s2-num' type='number' min='1' max='20' inputmode='numeric' value='" + lvl + "' onchange=\"sheet2Set('char-level',this.value)\" aria-label='Уровень'> уровень</div>");
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
    if (c.spells && c.spells.stat && typeof rulesSpellStats === "function") {
      var sst = rulesSpellStats(c, lvl);
      h.push("<span>Сл заклинаний <b>" + sst.dc + "</b> · атака <b>" + fm(sst.attack) + "</b></span>");
    }
    if (c.concentration) h.push("<span>Концентрация: <b>" + esc(c.concentration) + "</b> <button type='button' class='s2-link' onclick='endConcentration()'>Снять</button></span>");
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
      var tip = fm(getMod((c.stats && c.stats[a.k]) || 10)) + " " + a.s + (prof ? " · " + fm(pb) + " мастерство" : "");
      h.push("<tr class='s2-row' tabindex='0' data-t='Спасбросок: " + a.n + "' data-v='" + fm(b) + "' data-b='" + esc(tip) + "' onclick=\"sheet2Roll(this,'rollSavingThrow','" + a.k + "')\"><td>" + (prof ? "<span class='s2-prof'>◆</span>" : "<span class='s2-noprof'></span>") + a.n + "</td><td class='n'>" + fm(b) + "</td></tr>");
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
        rows.push("<div class='s2-sk s2-row' tabindex='0' data-t='" + esc(s.name) + "' data-v='" + fm(b) + "' data-b='" + esc(tip) + "' onclick=\"sheet2Roll(this,'rollSkillCheck'," + i + ")\"><span>" + (prof ? "<span class='s2-prof'>" + (exp ? "◆◆" : "◆") + "</span>" : "<span class='s2-noprof'></span>") + s.name + "</span><span>" + fm(b) + "</span></div>");
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
    h.push("<div class='s2-hpctl'><input id='s2-hp-n' type='number' min='0' inputmode='numeric' placeholder='урон / лечение' aria-label='Сколько хитов'>");
    h.push("<button type='button' class='s2-btn' onclick='sheet2HP(-1)' title='Урон'>−</button><button type='button' class='s2-btn' onclick='sheet2HP(1)' title='Лечение'>+</button></div>");
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

    h.push("<h3>Отдых</h3><div class='s2-acts'><button type='button' class='s2-btn' onclick='openRestModal();showShortRestInfo()'>Короткий</button><button type='button' class='s2-btn' onclick='openRestModal();showLongRestInfo()'>Длинный</button></div>");
    h.push("<div class='s2-acts'><button type='button' class='s2-btn' onclick='rollHitDieQuick()'" + (hdLeft ? "" : " disabled") + ">Кость хитов</button><span class='s2-kv'>осталось " + hdLeft + " из " + lvl + " (" + esc(rulesHitDiceLabel(c)) + ")</span></div>");

    // ── Ресурсы класса (ярость, наложение рук, божественный канал…)
    var resRows = classResources(c);
    if (resRows) h.push("<h3>Умения класса</h3>" + resRows);

    // ── Атаки: название — бросок атаки, урон — бросок урона
    var wsShown = 0;
    (c.weapons || []).forEach(function (w, wi) {
      if (!w || !w.name || wsShown >= 6) return;
      if (!wsShown) h.push("<h3>Атаки</h3>");
      wsShown++;
      var m = rulesWeaponMods(c, w, lvl);
      h.push("<div class='s2-atk'><button type='button' class='s2-atk-n' data-t='Атака: " + esc(w.name) + "' data-v='" + fm(m.attack) + "' data-b='урон " + esc(w.damage || "") + (m.damageMod ? fm(m.damageMod) : "") + "' onclick=\"sheet2Roll(this,'rollWeaponAttack'," + wi + ")\" title='Бросок атаки'>" + esc(w.name) + " <b>" + fm(m.attack) + "</b></button>" +
        "<button type='button' class='s2-atk-d' onclick='rollWeaponDamage(" + wi + ")' title='Бросок урона'>" + esc(w.damage || "") + (m.damageMod ? fm(m.damageMod) : "") + "</button></div>");
    });

    // ── Кубы
    h.push("<h3>Кубы</h3><div class='s2-dice'>");
    DICE.forEach(function (d) { var n = pool[d] || 0; h.push("<button type='button' class='s2-die" + (n ? " on" : "") + "' onclick='sheet2Die(" + d + ")'>" + (n > 1 ? n : "") + "к" + d + "</button>"); });
    var poolF = poolFormula();
    h.push("</div><div class='s2-kv s2-pool'>" + (poolF ? esc(poolF) : "Нажатия складываются в один бросок") + "</div><div class='s2-acts'><button type='button' class='s2-btn' onclick='sheet2DiceRoll()'" + (poolF ? "" : " disabled") + ">Бросить</button>" + (poolF ? "<button type='button' class='s2-link' onclick='sheet2DiceClear()'>Сбросить</button>" : "") + "</div>");
    h.push(rollsHtml());

    // ── Ячейки: ромб ◆ — свободна (нажать — потратить), ◇ — потрачена (нажать — вернуть)
    var sl = (c.spells && c.spells.slots) || {}, su = (c.spells && c.spells.slotsUsed) || {};
    var slotParts = Object.keys(sl).filter(function (k) { return sl[k] > 0; }).map(function (k) {
      var left = Math.max(0, sl[k] - (su[k] || 0));
      var p = "";
      for (var i = 0; i < sl[k]; i++) {
        var free = i < left;
        p += "<button type='button' class='s2-pip" + (free ? " on" : "") + "' onclick='sheet2Slot(" + k + "," + (free ? 1 : -1) + ")' title='" + (free ? "Потратить" : "Вернуть") + "'>" + (free ? "◆" : "◇") + "</button>";
      }
      return "<div class='s2-res'><span>" + k + " круг <small class='s2-kv'>" + left + "/" + sl[k] + "</small></span><span class='s2-pips'>" + p + "</span></div>";
    });
    if (slotParts.length) h.push("<h3>Ячейки заклинаний</h3>" + slotParts.join(""));

    var conds = (c.conditions || []).length;
    h.push("<h3>Состояния</h3><div class='s2-acts'><span class='s2-kv'>" + (conds ? "активно: " + conds : "нет") + "</span><button type='button' class='s2-link' onclick='toggleConditionsPopup()'>Изменить</button></div>");
    h.push("</aside></div>");
    return h.join("");
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
    var a = document.querySelector("#sheet2 .s2-anchor");
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
    if ((e.key === "Enter" || e.key === " ") && e.target && e.target.classList && e.target.classList.contains("s2-row") && e.target.closest("#sheet2")) {
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
  ["showScreen", "calcStats", "updateHPDisplay", "loadCharacter", "loadDeathSaves", "toggleInspiration",
   "applySheetLockUI", "switchTab", "recalculateHP", "calculateAC", "saveToLocal",
   "renderClassResources", "renderDiceHistory", "renderQuickRollStrip", "setConcentration", "endConcentration"].forEach(function (name) {
    var orig = window[name];
    if (typeof orig !== "function") return;
    window[name] = function () { var r = orig.apply(this, arguments); schedule(); return r; };
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
  else schedule();
})();
