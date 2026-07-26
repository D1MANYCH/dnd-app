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
├── data.js                 — классы, расы, черты, состояния/эффекты, навыки, APP_VERSION + changelog
├── data-2024.js            — edition-слой редакции 2024 (EDITION_DATA) — ленивый, грузится при переключении редакции (E24-0)
├── spells.js               — база заклинаний D&D 5e: 719 заклинаний PH14/PH24 (~12300 строк)
├── spell-effects.js        — механика кнопки «Использовать»: 164 ключа SPELL_EFFECTS (CAST)
├── magic-items.js          — магические предметы — ленивый
├── gear-catalog.js         — каталог снаряжения — ленивый
├── glossary-data.js        — глоссарий терминов для тултипов (UX-4)
├── character-builds.js     — 36 готовых билдов PHB (3 на класс): стат-блоки, гайды 1–20 (~1880 строк)
├── build-notes-data.js     — автозаметки билдов (~1620 строк) — ленивая, грузится при применении билда (PERF-2)
├── class-choices.js        — выборы классов (боевые стили, метамагия, пакты и т.п.)
├── subclass-choices-data.js— выборы подклассов
├── monsters-srd.js         — бестиарий SRD 5e (FEAT-4) — ленивый, грузится при открытии SRD-пикеров отряда (PERF-3)
├── npc-srd.js              — архетипы NPC SRD (FEAT-4) — ленивый, грузится вместе с monsters-srd (PERF-3)
│
│   # Модули приложения (логика по вкладкам/функциям)
├── rules.js                — чистые расчёты правил без DOM: модификаторы, БМ, владения/экспертиза, КД, ячейки, отдых, концентрация (SETUP-5)
├── app-core.js             — ядро: хелперы, состояние, навигация, персонажи
├── app-migrate.js          — миграции сохранений (migrateCharacter) — отпочковалась от app-core (SETUP-6)
├── app-builds.js           — билды: пикер, applyBuild, гайды 1–20, глоссарий-тултипы (SETUP-6)
├── app-io.js               — экспорт/импорт персонажей и конвертов (SETUP-6)
├── app-backup.js           — авто-бэкапы в IndexedDB: снапшот экспорт-конверта раз в день/перед импортом, ротация 7 шт. (DATA-2)
├── app-log.js              — лог сессии: кольцевой буфер + корреляционные ID, панель Ctrl+Shift+L, persist в localStorage (FEAT-LOG)
├── app-combat.js           — боевая система: характеристики, спасброски, навыки, КД
├── app-conditions.js       — сопротивления, состояния, истощение, карточки эффектов (SETUP-6)
├── app-cast-effects.js     — эффекты кастов: откат, концентрация, панель и тик длительностей (SETUP-6)
├── app-proficiencies.js    — владения: языки, инструменты, доспехи, оружие (SETUP-6)
├── app-hp.js               — система ХП: отдых, повышение уровня, спасброски от смерти
├── app-inventory.js        — инвентарь: предметы, сумки, оружие, вес снаряжения
├── app-party.js            — группа и трекер боя: союзники, NPC, монстры, инициатива
├── app-spells.js           — заклинания: ячейки, поиск, добавление/удаление
├── app-ui.js               — интерфейс: аватар, аккордеоны, ресурсы класса, компаньоны/фамильяры (FEAT-6)
├── app-dice.js             — броски: модалка, rollDice/quickRoll, 3D/2D-кубики, парсер формул (SETUP-6)
├── app-settings.js         — настройки: тема, акцент, редакция, раскладка, плотность, шрифт, стекло, фон (SETUP-6)
├── app-asi.js              — повышение характеристик и черты (SETUP-6)
├── app-help.js             — справка и интерактивные туры (HELP, Tab Tours)
├── app-notes.js            — записи кампании (notesV2): NPC, квесты, локации, теги, экспорт .md/.json
├── app-desktop.js          — десктоп-раскладка
├── app-pdf.js              — PDF-экспорт листа персонажа (FEAT-3) — ленивый, грузится по первому клику 📄 вместе с vendor/jspdf (PERF-1)
├── history-stack.js        — стек истории для отмены действий
├── icons.js                — SVG-иконки (window.Icons)
├── bg-space.js             — космос-фон «Дымка» (initSpaceBg: off/calm/lively, light/dark)
├── dice-arena-bg.js        — фон арены 3D-кубиков
├── dev-verify-builds.js    — verifyAllBuilds() — консольный verifier билдов (DevTools)
│
├── manifest.json           — PWA-манифест
├── sw.js                   — Service Worker (офлайн-кеш; CACHE_NAME dnd-sheet-vN)
├── tests.html              — страница проверок правил: грузит data.js + rules.js + tests/rules-cases.js (SETUP-5)
├── icons/                  — icon-192.png, icon-512.png
├── assets/                 — иконки классов/школ/состояний, фоны (webp, ~3.5 МБ)
├── vendor/                 — dice-box (3D-кубики, WebGL) + jspdf (PDF, ленивый стек)
├── tools/                  — bump-version.js, gen-changelog.js, gen-release-log.js, gen-release-post.js, check-invariant.js, check-theme.js, run-tests-hook.js, check-syntax-hook.js, check-sw-hook.js, phb-search.py
├── .github/workflows/      — tests.yml: CI (headless-тесты + check-invariant + check-theme) на каждый push/PR
└── tests/                  — headless-node.js (Node), runner.html + headless.js (браузер), fixtures.js, rules-cases.js
```

> Порядок подключения скриптов задан в `index.html` (низ файла). Все модули — обычные (не-ES-module) скрипты, экспонирующие функции в глобальную область; исключение — `vendor/dice-box` (ES-модуль, оборачивается в `window.DiceBox`).

> **Ленивая загрузка** — инлайн-загрузчик в низу `index.html`: `loadScript(src)` с мемоизацией промиса per-src (упавший src сбрасывается → ретрай при следующем вызове). Через него грузятся три блока: PDF-стек ~600 КБ (`vendor/jspdf/jspdf.umd.min.js` + `roboto-base64.js` + `app-pdf.js`) по первому клику 📄 — заглушка `window.exportCharacterPDF` подменяется настоящей функцией (PERF-1); `build-notes-data.js` ~530 КБ через `ensureBuildNotes()`, который вызывается из `applyBuild` (app-core.js) и после загрузки зовёт `attachBuildNotes()` (PERF-2); и бестиарий `monsters-srd.js` + `npc-srd.js` ~61 КБ через `ensureBestiary()`, который вызывается из SRD-пикеров вкладки отряда (app-party.js) (PERF-3). Тем же загрузчиком идут `magic-items.js`, `gear-catalog.js` и `data-2024.js`. `?v=`-токены ленивых URL живут прямо в `index.html` — их бампает `tools/bump-version.js` вместе с остальными. Все блоки остаются в `FILES_TO_CACHE` sw.js, офлайн работает.

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
| `migrateCharacter(char)` | `app-migrate.js` | Мигрирует старые сохранения до актуальной схемы |
| `showToast(msg, type)` | `app-core.js` | Показывает уведомление (success/error/warn/info) |
| `showConfirmModal(title, text, fn)` | `app-core.js` | Модалка подтверждения с коллбеком |
| `updateChar()` | `app-combat.js` | Считывает поля формы → сохраняет (debounce 300мс) |
| `calcStats()` | `app-combat.js` | Рендер бонусов характеристик поверх ядер `rules.js` |
| `calculateAC()` | `app-combat.js` | Рендер КД поверх `rulesAC(char)` |
| `recalculateHP()` | `app-combat.js` | Пересчитывает макс. ХП (`calculateMaxHP` в `rules.js`) |
| `rulesAC(char)` | `rules.js` | КД без DOM: `{mode, ac, formula[], modifiers[]}` |
| `rulesShortRest(char, opts)` / `rulesLongRest(char, opts)` | `rules.js` | Отдых по книге: мутирует персонажа, возвращает сводку для рендера |
| `concSaveParams(char, dmg)` | `rules.js` | СЛ и модификатор спасброска концентрации |

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

**2. В `app-migrate.js`** — добавь блок миграции в функцию `migrateCharacter()`:
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

### Три уровня описания релиза

| Уровень | Файл | Чем наполняется | Для кого |
|---|---|---|---|
| Короткий | `CHANGELOG.md` + окно «История версий» | `APP_CHANGELOG` в data.js | игрок |
| Подробный | `docs/RELEASES.md` | `tools/gen-release-log.js`: APP_CHANGELOG + git (коммиты, файлы, +/− строк) | тот, кто хочет деталей |
| Полный патч | ссылка `compare/<пред. релиз>...<этот>` на GitHub | git | тот, кто читает код |

Оба генератора идемпотентны и вызываются из `tools/bump-version.js` — вести руками нечего. Границей релиза считается коммит с сабжектом `vX.Y.Z: …`, поэтому запись свежей версии собирается по рабочему дереву (релизного коммита ещё нет) и уточняется при следующем bump. Краткий пост-анонс релиза со всеми тремя ссылками — `node tools/gen-release-post.js [версия] [--out <slug>]`.

Текущая версия и changelog — `APP_CHANGELOG` в [`../data.js`](../data.js).

---

## Тесты

- `node tests/headless-node.js` — headless-тесты логики (слоты, выборы классов, фичи подклассов, билды, импорт/экспорт, инвентарь, правила); сейчас **655/655**.
- `tests/runner.html` — те же тесты в браузере (`tests/headless.js`), фикстуры — `tests/fixtures.js`.
- `tests.html` в корне — только кейсы правил (`tests/rules-cases.js`, файл общий с node-раннером: БЛОК 50 в `headless.js` гоняет их тем же движком). Тёмная тема, фильтр «только упавшие», кнопка сброса Service Worker.
- `verifyAllBuilds()` в DevTools-консоли — verifier 36 билдов (`dev-verify-builds.js`), текущий результат 36/36 fullPass.
- CI: `.github/workflows/tests.yml` — тесты + `check-invariant.js` на каждый push/PR.
