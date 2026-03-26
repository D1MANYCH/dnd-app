# 🎲 D&D 5e — Лист Персонажа

PWA-приложение для управления персонажем Dungeons & Dragons 5e. Работает офлайн, данные хранятся в браузере.

**Сайт:** https://d1manych.github.io/dnd-app/

---

## 📁 Структура файлов

```
dnd-app/
├── index.html       — разметка всего приложения (все экраны и модалки)
├── app.js           — вся логика: состояние, функции, обработчики (~4100 строк)
├── data.js          — статические данные: классы, расы, черты, changelog (~1230 строк)
├── spells.js        — база заклинаний D&D 5e: 190 заклинаний PH14/PH24/XGE (~93 КБ)
├── style.css        — все стили (~3950 строк)
├── manifest.json    — PWA-манифест
├── sw.js            — Service Worker (офлайн-кеш)
└── icons/
    ├── icon-192.png — иконка приложения 192×192
    └── icon-512.png — иконка приложения 512×512
```

---

## 🧠 Архитектура для Claude

### Где что добавлять

| Хочу добавить | Файл | Что делать |
|---|---|---|
| Новый класс | `data.js` | `CLASS_FEATURES`, `CLASS_HIT_DICE`, `SUBCLASSES`, `CLASS_SAVE_PROFICIENCIES`, `CLASS_ARMOR_PROFS`, `CLASS_RESOURCES`, `SPELL_SLOTS_BY_LEVEL` |
| Новую расу | `data.js` | `RACE_DATA` + `<option>` в `index.html` секция `char-race` |
| Новое заклинание в базу | `spells.js` | добавить объект в массив `SPELLS_BASE` |
| Новую черту (feat) | `data.js` | массив `FEATS_DATA` |
| Новое состояние/эффект | `data.js` | `CONDITIONS` или `EFFECTS_DATA` |
| Новую вкладку | `index.html` + `app.js` | таб-кнопка в `#character-tabs`, блок `#tab-XXX`, функция в `switchTab()` |
| Новую модалку | `index.html` + `app.js` | div с классом `modal` или `confirm-modal-overlay`, open/close функции |
| Новый UI-элемент | `index.html` + `style.css` | разметка + стили |
| Уведомление | `app.js` | `showToast("текст", "success"/"error"/"warn"/"info")` |

### Структура заклинания в spells.js

```js
{
  id: 191,                    // уникальный номер (следующий после последнего)
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

### Ключевые функции app.js

| Функция | Что делает |
|---|---|
| `saveToLocal()` | Сохраняет персонажей и пользовательские заклинания в localStorage |
| `getCurrentChar()` | Возвращает объект текущего персонажа |
| `updateChar()` | Считывает поля формы → сохраняет (debounce 300мс) |
| `calcStats()` | Пересчитывает все бонусы характеристик |
| `calculateAC()` | Пересчитывает КД |
| `recalculateHP()` | Пересчитывает макс. ХП |
| `loadCharacter(id)` | Загружает персонажа в UI |
| `migrateCharacter(char)` | Мигрирует старые сохранения до актуальной схемы |
| `showToast(msg, type)` | Показывает уведомление (success/error/warn/info) |
| `showConfirmModal(title, text, fn)` | Модалка подтверждения с коллбеком |
| `showHPToast(delta, msg)` | Toast изменения ХП |
| `showUpdateModal(worker)` | Модалка обновления PWA |
| `addJournalEntry(type, title, desc)` | Запись в журнал персонажа |

### Структура персонажа (объект в `characters[]`)

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

## 🔄 Миграции схемы данных

При изменении структуры персонажа (добавление нового поля) нужно:

**1. В `data.js`** — увеличь `SCHEMA_VERSION` на 1:
```js
const SCHEMA_VERSION = 2; // было 1
```

**2. В `app.js`** — добавь блок миграции в функцию `migrateCharacter()`:
```js
if (v < 2) {
  char.newField = "defaultValue";
  char.schemaVersion = 2;
}
```

**3. В `data.js`** — добавь поле в `DEFAULT_CHARACTER`:
```js
const DEFAULT_CHARACTER = {
  // ...
  newField: "defaultValue",
  schemaVersion: 2,   // ← обновить и здесь
};
```

> Миграция применяется автоматически при каждой загрузке из localStorage — старые сохранения тихо получат новые поля с дефолтными значениями.

---

## 🔧 Версия

`v1.6.1` — март 2026
