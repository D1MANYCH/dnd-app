# D&D 5e — Лист Персонажа

PWA-приложение для управления персонажем Dungeons & Dragons 5e. Работает офлайн, данные хранятся в браузере.

**Сайт:** https://d1manych.github.io/dnd-app/

---

## Структура файлов

```
dnd-app/
├── index.html          — разметка приложения (все экраны и модалки, ~1730 строк)
├── style.css           — все стили (~5770 строк)
├── data.js             — статические данные: классы, расы, черты, changelog (~1315 строк)
├── spells.js           — база заклинаний D&D 5e: 712 заклинаний PH14/PH24 (~12400 строк)
├── app.js              — скомпилированная версия всей логики (~5030 строк)
├── app-core.js         — ядро: хелперы, состояние, навигация, персонажи, импорт/экспорт
├── app-combat.js       — боевая система: характеристики, спасброски, навыки, КД, состояния
├── app-hp.js           — система ХП: отдых, повышение уровня, спасброски от смерти
├── app-inventory.js    — инвентарь: предметы, сумки, оружие, вес снаряжения
├── app-party.js        — группа и трекер боя: союзники, NPC, монстры, инициатива
├── app-spells.js       — заклинания: ячейки, поиск, добавление/удаление
├── app-ui.js           — интерфейс: аватар, кости, аккордеоны, ресурсы класса, журнал
├── manifest.json       — PWA-манифест
├── sw.js               — Service Worker (офлайн-кеш)
└── icons/
    ├── icon-192.png    — иконка 192x192
    └── icon-512.png    — иконка 512x512
```

---

## Архитектура для Claude

### Где что добавлять

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

### Структура заклинания в spells.js

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

### Ключевые функции по модулям

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

## Версия

`v1.9.0` — апрель 2026

### Changelog

**v1.9.0** (09.04.2026)
- Колдун: ячейки Пакта восстанавливаются после короткого отдыха
- Мистическое Арканум: внеслотовые заклинания высоких уровней
- Ритуальное колдовство: таймер 10 мин для Волшебника, Жреца, Друида, Барда
- Подготовка заклинаний: Жрец/Друид (МУД+ур.), Паладин (ХАР+½ур.), Волшебник (ИНТ+ур.)
- Счётчик «Подготовлено: X/Y» и кнопка подготовки на каждом заклинании
- Неподготовленные заклинания визуально приглушены; заговоры не требуют подготовки

**v1.8.0**
- Экспертиза, концентрация, истощение, исправления PHB 2014

`v1.7.0` — апрель 2026
