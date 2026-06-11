# Архитектура DnD-Листа

Техническая документация для разработчиков и Claude. Пользовательское описание проекта → [README.md](../README.md).

---

## Структура файлов

```
dnd-app/
├── index.html              — разметка приложения (все экраны и модалки, ~2300 строк)
├── style.css               — все стили (~11100 строк)
│
│   # Данные (статические БД, грузятся как глобалы)
├── data.js                 — классы, расы, черты, состояния/эффекты, APP_VERSION + changelog (~3100 строк)
├── spells.js               — база заклинаний D&D 5e: 706 заклинаний PH14/PH24 (~12300 строк)
├── character-builds.js     — 36 готовых билдов PHB (3 на класс): стат-блоки, гайды 1–20 (~1880 строк)
├── build-notes-data.js     — автозаметки билдов (~1620 строк) — ленивая, грузится при применении билда (PERF-2)
├── class-choices.js        — выборы классов (боевые стили, метамагия, пакты и т.п.)
├── subclass-choices-data.js— выборы подклассов
├── monsters-srd.js         — бестиарий SRD 5e (FEAT-4)
├── npc-srd.js              — архетипы NPC SRD (FEAT-4)
│
│   # Модули приложения (логика по вкладкам/функциям)
├── app-core.js             — ядро: хелперы, состояние, навигация, персонажи, импорт/экспорт, applyBuild
├── app-backup.js           — авто-бэкапы в IndexedDB: снапшот экспорт-конверта раз в день/перед импортом, ротация 7 шт. (DATA-2)
├── app-log.js              — лог сессии: кольцевой буфер + корреляционные ID, панель Ctrl+Shift+L, persist в localStorage (FEAT-LOG)
├── app-combat.js           — боевая система: характеристики, спасброски, навыки, КД, состояния
├── app-hp.js               — система ХП: отдых, повышение уровня, спасброски от смерти
├── app-inventory.js        — инвентарь: предметы, сумки, оружие, вес снаряжения
├── app-party.js            — группа и трекер боя: союзники, NPC, монстры, инициатива
├── app-spells.js           — заклинания: ячейки, поиск, добавление/удаление
├── app-ui.js               — интерфейс: аватар, кости, аккордеоны, ресурсы класса, компаньоны/фамильяры (FEAT-6)
├── app-notes.js            — записи кампании (notesV2): NPC, квесты, локации, теги, экспорт .md/.json
├── app-desktop.js          — десктоп-раскладка
├── app-pdf.js              — PDF-экспорт листа персонажа (FEAT-3) — ленивый, грузится по первому клику 📄 вместе с vendor/jspdf (PERF-1)
├── history-stack.js        — стек истории для отмены действий
├── bg-orbits.js            — фоновая анимация (орбиты)
├── dice-arena-bg.js        — фон арены 3D-кубиков
├── dev-verify-builds.js    — verifyAllBuilds() — консольный verifier билдов (DevTools)
│
├── manifest.json           — PWA-манифест
├── sw.js                   — Service Worker (офлайн-кеш; CACHE_NAME dnd-sheet-vN)
├── icons/                  — icon-192.png, icon-512.png
├── assets/                 — иконки классов/школ/состояний, фоны (webp, ~3.5 МБ)
├── vendor/                 — dice-box (3D-кубики, WebGL) + jspdf (PDF, ленивый стек)
├── tools/                  — bump-version.js, gen-changelog.js, check-invariant.js, run-tests-hook.js
├── .github/workflows/      — tests.yml: CI (headless-тесты + check-invariant) на каждый push/PR
└── tests/                  — headless-node.js (Node), runner.html + headless.js (браузер), fixtures.js
```

> Порядок подключения скриптов задан в `index.html` (низ файла). Все модули — обычные (не-ES-module) скрипты, экспонирующие функции в глобальную область; исключение — `vendor/dice-box` (ES-модуль, оборачивается в `window.DiceBox`).

> **Ленивая загрузка** — инлайн-загрузчик в низу `index.html`: `loadScript(src)` с мемоизацией промиса per-src (упавший src сбрасывается → ретрай при следующем вызове). Через него грузятся два блока: PDF-стек ~600 КБ (`vendor/jspdf/jspdf.umd.min.js` + `roboto-base64.js` + `app-pdf.js`) по первому клику 📄 — заглушка `window.exportCharacterPDF` подменяется настоящей функцией (PERF-1); и `build-notes-data.js` ~530 КБ через `ensureBuildNotes()`, который вызывается из `applyBuild` (app-core.js) и после загрузки зовёт `attachBuildNotes()` (PERF-2). `?v=`-токены ленивых URL живут прямо в `index.html` — их бампает `tools/bump-version.js` вместе с остальными. Оба блока остаются в `FILES_TO_CACHE` sw.js, офлайн работает.

---

## Где что добавлять

| Хочу добавить | Файл | Что делать |
|---|---|---|
| Новый класс | `data.js` | `CLASS_FEATURES`, `CLASS_HIT_DICE`, `SUBCLASSES`, `CLASS_SAVE_PROFICIENCIES`, `CLASS_ARMOR_PROFS`, `CLASS_RESOURCES`, `SPELL_SLOTS_BY_LEVEL` |
| Новую расу | `data.js` | `RACE_DATA` + `<option>` в `index.html` секция `char-race` |
| Новое заклинание в базу | `spells.js` | добавить объект в массив `SPELLS_BASE` |
| Новую черту (feat) | `data.js` | массив `FEATS_DATA` |
| Новое состояние/эффект | `data.js` | `CONDITIONS` или `EFFECTS_DATA` |
| Новую вкладку | `index.html` + `app-core.js` | таб-кнопка в `#character-tabs`, блок `#tab-XXX`, функция в `switchTab()` |
| Новую модалку | `index.html` + `app-core.js` | div с классом `modal` или `confirm-modal-overlay`, open/close функции |
| Новый UI-элемент | `index.html` + `style.css` | разметка + стили |
| Уведомление | `app-core.js` | `showToast("текст", "success"/"error"/"warn"/"info")` |

---

## Структура заклинания в spells.js

```js
{
  id: 713,                    // уникальный номер (следующий после последнего)
  name: "Огненный шар",       // название на русском
  level: 3,                   // 0 = заговор, 1–9 = уровень заклинания
  school: "эвокация",         // школа магии
  source: "PH14",             // PH14 | PH24 | XGE | SCAG | EGW
  class: "wizard",            // wizard | druid | both
  time: "1 действие",
  range: "150 фт",
  components: "V,S,M",
  duration: "Мгновенно",
  desc: "Описание заклинания...",
  higherLevel: "На больших уровнях: ..."
}
```

---

## Ключевые функции по модулям

| Функция | Файл | Что делает |
|---|---|---|
| `getCurrentChar()` | `app-core.js` | Возвращает объект текущего персонажа |
| `saveToLocal()` | `app-core.js` | Сохраняет персонажей и заклинания в localStorage |
| `loadCharacter(id)` | `app-core.js` | Загружает персонажа в UI |
| `migrateCharacter(char)` | `app-core.js` | Мигрирует старые сохранения до актуальной схемы |
| `showToast(msg, type)` | `app-core.js` | Показывает уведомление (success/error/warn/info) |
| `showConfirmModal(title, text, fn)` | `app-core.js` | Модалка подтверждения с коллбеком |
| `updateChar()` | `app-combat.js` | Считывает поля формы → сохраняет (debounce 300мс) |
| `calcStats()` | `app-combat.js` | Пересчитывает все бонусы характеристик |
| `calculateAC()` | `app-combat.js` | Пересчитывает КД |
| `recalculateHP()` | `app-combat.js` | Пересчитывает макс. ХП |

---

## Структура персонажа (объект в `characters[]`)

```js
{
  id, name, level, exp, class, subclass, race, background,
  schemaVersion,              // версия схемы для миграций
  stats: { str, dex, con, int, wis, cha },
  combat: { ac, hpMax, hpCurrent, hpTemp, hpDice, hpDiceSpent, speed, armorId, hasShield },
  saves: { str, dex, con, int, wis, cha },      // true/false — владение
  skills: { 0..17 },                             // true/false — владение по индексу
  proficiencies: { armor[], weapon[], tools, languages },
  spells: { slots{}, slotsUsed{}, mySpells[], stat, dc, attack },
  inventory: { weapon[], armor[], potion[], scroll[], tool[], material[], other[] },
  weapons: [],
  coins: { cp, sp, ep, gp, pp },
  conditions: [],    // id условий из CONDITIONS
  effects: [],       // id эффектов из EFFECTS_DATA
  companions: [],
  feats: [],
  asiUsedLevels: [],
  deathSaves: { successes[], failures[] },
  party: { allies[], monsters[], npcs[] },
  battle: { active, participants[], currentTurn },
  journal: [],
  updatedAt,
  notes, features, appearance, magicItems
}
```

---

## Миграции схемы данных

При изменении структуры персонажа (добавление нового поля) нужно:

**1. В `data.js`** — увеличь `SCHEMA_VERSION` на 1:
```js
const SCHEMA_VERSION = 3; // было 2
```

**2. В `app-core.js`** — добавь блок миграции в функцию `migrateCharacter()`:
```js
if (v < 3) {
  char.newField = "defaultValue";
  char.schemaVersion = 3;
}
```

**3. В `data.js`** — добавь поле в `DEFAULT_CHARACTER`:
```js
const DEFAULT_CHARACTER = {
  // ...
  newField: "defaultValue",
  schemaVersion: 3,   // обновить и здесь
};
```

> Миграция применяется автоматически при каждой загрузке из localStorage — старые сохранения тихо получат новые поля с дефолтными значениями.

---

## Версионирование

Инвариант релиза — пять величин меняются синхронно: `APP_VERSION` ↔ `APP_CHANGELOG[0].version` (data.js) ↔ `CACHE_NAME` `dnd-sheet-vN` (sw.js) ↔ все `?v=vN` токены js/css в index.html ↔ `CHANGELOG.md`.

- Bump — командой `/bump <patch|minor|major> "<changelog>"` (`tools/bump-version.js`), правит всё за один проход; `CHANGELOG.md` генерируется из `APP_CHANGELOG` (`tools/gen-changelog.js`).
- Сверка инварианта — `node tools/check-invariant.js`; гоняется и в CI (`.github/workflows/tests.yml`) на каждый push/PR.
- Детали процесса — CLAUDE.md, раздел «Версионирование».

Текущая версия и changelog — `APP_CHANGELOG` в [`../data.js`](../data.js).

---

## Тесты

- `node tests/headless-node.js` — headless-тесты логики (слоты, выборы классов, фичи подклассов, билды, импорт/экспорт, инвентарь); сейчас **203/203**.
- `tests/runner.html` — те же тесты в браузере (`tests/headless.js`), фикстуры — `tests/fixtures.js`.
- `verifyAllBuilds()` в DevTools-консоли — verifier 36 билдов (`dev-verify-builds.js`), текущий результат 36/36 fullPass.
- CI: `.github/workflows/tests.yml` — тесты + `check-invariant.js` на каждый push/PR.
