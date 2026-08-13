// ============================================================
// app-home.js — Встречающий экран: плашка последнего героя и главное меню
// (Продолжить / Новый персонаж / Выбор персонажа / Данные / Настройки / О версии).
//
// Файл намеренно БЕЗ IIFE: функции зовутся из inline-onclick в index.html,
// как и весь остальной код проекта.
//
// ВАЖНО: на верхнем уровне файла нет ни одного обращения к DOM — файл
// подключается в tests/headless-node.js, где документа почти нет.
// Всё, что трогает DOM, живёт внутри функций.
// ============================================================

// ─── Данные плашки (чистые хелперы, без DOM — покрыты тестами) ───

/**
 * Последний персонаж — тот, которого правили свежее всех.
 * Ключ тот же, что у сортировки списка "Изменён" (app-core.js:786),
 * поэтому плашка и первая карточка списка всегда согласованы.
 * НЕ зависит от charSortMode/charSearchQuery: поиск по списку не должен
 * менять того, кого предлагает кнопка «Продолжить».
 */
function getLastCharacter() {
  if (typeof characters === "undefined" || !characters || !characters.length) return null;
  var best = null;
  for (var i = 0; i < characters.length; i++) {
    var c = characters[i];
    if (!c) continue;
    if (!best || ((c.updatedAt || c.id || 0) > (best.updatedAt || best.id || 0))) best = c;
  }
  return best;
}

/** Сколько у персонажа заговоров (заклинаний 0-го круга). */
function _homeCantripCount(char) {
  if (!char || !char.spells || !char.spells.mySpells) return 0;
  var n = 0;
  for (var i = 0; i < char.spells.mySpells.length; i++) {
    if (char.spells.mySpells[i] && char.spells.mySpells[i].level === 0) n++;
  }
  return n;
}

/**
 * Три чипа плашки: хиты, КД и третий — заговоры у заклинателя,
 * иначе уровень (чтобы чип был осмысленным и у Воина с Варваром).
 * aria отдельно от текста: на глифы ♥/🛡️/✦ скринридер полагаться не даёт.
 */
function _homeHeroChips(char) {
  if (!char) return [];
  var cb = char.combat || {};
  var hpCur = (cb.hpCurrent != null ? cb.hpCurrent : 0);
  var hpMax = (cb.hpMax != null ? cb.hpMax : 0);
  var chips = [
    { ico: "" + dndIcoHtml("heart", 13) + "", text: hpCur + "/" + hpMax, aria: "Хиты " + hpCur + " из " + hpMax },
    { ico: "" + dndIcoHtml("shield", 13) + "", text: "КД " + (cb.ac != null ? cb.ac : 10), aria: "Класс доспеха " + (cb.ac != null ? cb.ac : 10) }
  ];
  var cantrips = _homeCantripCount(char);
  if (cantrips > 0) {
    chips.push({ ico: dndIcoHtml("sparkle", 13), text: cantrips + " " + _homePlural(cantrips, "заговор", "заговора", "заговоров"), aria: "Заговоров: " + cantrips });
  } else {
    var lvl = char.level || 1;
    chips.push({ ico: "" + dndIcoHtml("star", 13) + "", text: lvl + " ур.", aria: "Уровень " + lvl });
  }
  return chips;
}

/** Русское склонение по числу: 1 заговор / 2 заговора / 5 заговоров. */
function _homePlural(n, one, few, many) {
  var n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
  return many;
}

/**
 * Сигнатура плашки. Без неё renderHomeHero перерисовывал бы DOM на КАЖДЫЙ
 * символ, введённый в поиск по списку персонажей (хук стоит в
 * renderCharacterList), и плашка мигала бы.
 */
function _homeHeroSig(char) {
  if (!char) return "empty";
  var cb = char.combat || {};
  return [
    char.id, char.name, char.class, char.race, char.level,
    cb.hpCurrent, cb.hpMax, cb.ac, char.avatar ? "a" : "-",
    _homeCantripCount(char), char.updatedAt,
    (typeof characters !== "undefined" && characters) ? characters.length : 0
  ].join("|");
}

/** Подзаголовок плашки: "Воин 5 / Плут 3 · Человек · 8 ур." */
function _homeHeroSubtitle(char) {
  var parts = [];
  var cls = (typeof getClassLabel === "function") ? getClassLabel(char) : (char.class || "");
  if (cls) parts.push(cls);
  if (char.race) parts.push(char.race);
  if (!(char.classes && char.classes.length > 1)) parts.push((char.level || 1) + " ур.");
  return parts.join(" · ");
}

// ─── Рендер плашки ──────────────────────────────────────────────

/**
 * Перерисовать плашку героя. Единственная точка вызова — первая строка
 * renderCharacterList() (app-core.js): она покрывает все 13 мест, где
 * список перерисовывается, И оба ранних return внутри неё.
 */
function renderHomeHero() {
  var hero = document.getElementById("home-hero");
  if (!hero) return;

  var char = getLastCharacter();
  var sig = _homeHeroSig(char);
  if (hero.getAttribute("data-sig") === sig) return;   // ничего не изменилось
  hero.setAttribute("data-sig", sig);

  var emblem = document.getElementById("home-hero-emblem");
  var capEl  = document.getElementById("home-hero-cap");
  var nameEl = document.getElementById("home-hero-name");
  var subEl  = document.getElementById("home-hero-sub");
  var chipEl = document.getElementById("home-hero-chips");

  // ── Пустое состояние: героев ещё нет
  if (!char) {
    hero.style.removeProperty("--home-accent");
    if (emblem) emblem.innerHTML = '<img class="home-hero-img" src="assets/avatar-fallback.webp" alt="" aria-hidden="true">';
    if (capEl)  { capEl.textContent = ""; capEl.hidden = true; }
    if (nameEl) nameEl.textContent = "Приключение ждёт";
    if (subEl)  subEl.textContent = "Ещё нет героев — начните новую кампанию";
    if (chipEl) chipEl.innerHTML = "";
    _homeSyncContinue(null);
    _homeSyncMenu();
    return;
  }

  // ── Есть герой
  if (typeof getClassColor === "function" && char.class) {
    hero.style.setProperty("--home-accent", getClassColor(char.class));
  } else {
    hero.style.removeProperty("--home-accent");
  }

  if (emblem) {
    if (char.avatar) {
      emblem.innerHTML = '<img class="home-hero-img" src="' + char.avatar + '" alt="" aria-hidden="true">';
    } else if (char.class && typeof getClassIcon === "function") {
      emblem.innerHTML = '<span class="home-hero-img">' + getClassIcon(char.class) + '</span>';
    } else {
      emblem.innerHTML = '<img class="home-hero-img" src="assets/avatar-fallback.webp" alt="" aria-hidden="true">';
    }
  }

  // Капшн «Последний герой» — только когда персонажей больше одного,
  // иначе он ничего не сообщает.
  if (capEl) {
    var many = (typeof characters !== "undefined" && characters && characters.length > 1);
    capEl.textContent = many ? "Последний герой" : "";
    capEl.hidden = !many;
  }

  if (nameEl) nameEl.textContent = char.name || "Без имени";
  if (subEl)  subEl.textContent  = _homeHeroSubtitle(char);

  if (chipEl) {
    chipEl.innerHTML = _homeHeroChips(char).map(function(c) {
      return '<span class="home-chip" aria-label="' + escapeHtml(c.aria) + '">' +
             '<i class="home-chip-ico" aria-hidden="true">' + c.ico + '</i>' +
             escapeHtml(c.text) + '</span>';
    }).join("");
  }

  _homeSyncContinue(char);
  _homeSyncMenu();
}

/** Подстрочники пунктов, не зависящих от конкретного героя. */
function _homeSyncMenu() {
  var n = (typeof characters !== "undefined" && characters) ? characters.length : 0;
  var pick = document.getElementById("home-pick-sub");
  if (pick) pick.textContent = n
    ? (n + " " + _homePlural(n, "герой", "героя", "героев"))
    : "пока пусто";
  var pickBtn = document.getElementById("home-menu-pick");
  if (pickBtn) pickBtn.disabled = (n === 0);

  var about = document.getElementById("home-about-sub");
  if (about && typeof APP_VERSION !== "undefined") {
    // Если SW принёс обновление — говорим об этом прямо в меню: полоса версии
    // с кнопкой «Установить» теперь спрятана внутри модалки «О версии», и без
    // этой подписи пользователь про обновление просто не узнал бы.
    about.textContent = window._swUpdateWorker ? "доступно обновление" : ("v" + APP_VERSION);
    about.classList.toggle("is-update", !!window._swUpdateWorker);
  }
}

// ─── Меню приключения ───────────────────────────────────────────

/**
 * Раскрыть/свернуть секцию меню, закрыв соседние.
 * Саму механику раскрытия делает штатный toggleAccordion (app-ui.js):
 * он работает по nextElementSibling и переключает aria-expanded.
 */
function toggleHomeSection(btn) {
  if (!btn) return;
  var menu = btn.closest ? btn.closest(".home-menu") : null;
  if (menu) {
    var open = menu.querySelectorAll('.home-menu-item[aria-expanded="true"]');
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== btn && typeof toggleAccordion === "function") toggleAccordion(open[i]);
    }
  }
  if (typeof toggleAccordion === "function") toggleAccordion(btn);
}

/**
 * «Продолжить» — открыть последнего героя.
 * Стабильная функция вместо onclick="loadCharacter(<id>)": id последнего
 * меняется при каждой правке, инлайн-обработчик пришлось бы переписывать.
 */
function homeContinue() {
  var c = getLastCharacter();
  if (!c) return;
  try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) {}
  if (typeof loadCharacter === "function") loadCharacter(c.id);
}

// ─── Экраны меню ────────────────────────────────────────────────
// STYLE-8M-2: «Данные» и «О версии» стали экранами, а не модалками — переход
// такой же, как у «Продолжить», а браузерный Back ловит showScreen-обёртка
// history-stack (глубина экрана в SCREEN_DEPTH).

function openDataModal() {
  // Статус хранилища считается лениво — показываем актуальный при открытии.
  if (typeof updateStorageStatus === "function") updateStorageStatus();
  if (typeof showScreen === "function") showScreen("data");
}
function closeDataModal() {
  if (typeof screenBack === "function") screenBack();
}

/**
 * «Печать / PDF» на экране «Данные»: печатает лист открытого героя, а если с
 * главного экрана никто не открыт — последнего правленого (того же, кого
 * предлагает «Продолжить»). Сам PDF-стек ленивый: window.exportCharacterPDF —
 * заглушка из index.html, она догружает jsPDF и app-pdf.js по первому клику.
 */
function homeExportPdf(ev) {
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char) char = getLastCharacter();
  if (!char) {
    if (typeof showToast === "function") showToast("Нет персонажа для печати", "error");
    return;
  }
  if (typeof window.exportCharacterPDF !== "function") {
    if (typeof showToast === "function") showToast("PDF-модуль недоступен", "error");
    return;
  }
  window.exportCharacterPDF(char.id, ev);
}

function openAboutModal() {
  // Полоса версии живёт внутри экрана, поэтому наполняем её перед показом
  // (в т.ч. кнопкой «Установить», если SW принёс обновление).
  if (typeof updateVersionBlock === "function") updateVersionBlock(false);
  if (typeof renderChangelog === "function") renderChangelog();
  if (typeof showScreen === "function") showScreen("about");
}
function closeAboutModal() {
  if (typeof screenBack === "function") screenBack();
}

/** Подстрочник и доступность пункта «Продолжить». */
function _homeSyncContinue(char) {
  var btn = document.getElementById("home-menu-continue");
  var sub = document.getElementById("home-continue-sub");
  if (!btn) return;
  if (!char) {
    btn.disabled = true;
    if (sub) sub.textContent = "нет сохранённых героев";
    return;
  }
  btn.disabled = false;
  if (sub) {
    var when = (char.updatedAt && typeof formatTimeAgo === "function") ? formatTimeAgo(char.updatedAt) : "";
    sub.textContent = "«" + (char.name || "Без имени") + "»" + (when ? " · " + when : "");
  }
}
