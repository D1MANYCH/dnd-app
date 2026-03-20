# 🎲 D&D 5e — Лист Персонажа

PWA-приложение для управления персонажем Dungeons & Dragons 5e. Работает офлайн, данные хранятся в браузере.

**Сайт:** https://d1manych.github.io/dnd-app/

---

## 📁 Структура файлов

```
dnd-app/
├── index.html       — разметка всего приложения (все экраны и модалки)
├── app.js           — вся логика: состояние, функции, обработчики (~4000 строк)
├── data.js          — статические данные: классы, расы, заклинания, черты (~1200 строк)
├── style.css        — все стили (~3900 строк)
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
| Новое заклинание | `data.js` | `SPELL_DATABASE` (или импорт через UI) |
| Новую черту (feat) | `data.js` | массив `FEATS_DATA` |
| Новое состояние/эффект | `data.js` | `CONDITIONS` или `EFFECTS_DATA` |
| Новую вкладку | `index.html` + `app.js` | таб-кнопка в `#character-tabs`, блок `#tab-XXX`, функция в `switchTab()` |
| Новую модалку | `index.html` + `app.js` | div с классом `modal` или `confirm-modal-overlay`, open/close функции |
| Новый UI-элемент | `index.html` + `style.css` | разметка + стили |
| Уведомление | `app.js` | `showToast("текст", "success"/"error"/"warn"/"info")` |

### Ключевые функции app.js

| Функция | Что делает |
|---|---|
| `saveToLocal()` | Сохраняет всё в localStorage |
| `getCurrentChar()` | Возвращает объект текущего персонажа |
| `updateChar()` | Считывает поля формы → сохраняет |
| `calcStats()` | Пересчитывает все бонусы характеристик |
| `calculateAC()` | Пересчитывает КД |
| `recalculateHP()` | Пересчитывает макс. ХП |
| `loadCharacter(id)` | Загружает персонажа в UI |
| `showToast(msg, type)` | Показывает уведомление |
| `showConfirmModal(title, text, fn)` | Модалка подтверждения |
| `showHPToast(delta, msg)` | Toast изменения ХП |
| `addJournalEntry(type, title, desc)` | Запись в журнал |

### Структура персонажа (объект в `characters[]`)

```js
{
  id, name, level, exp, class, subclass, race, background,
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
  notes, features, appearance, magicItems
}
```

---

## 🔧 Версия

`v1.4.0` — март 2026
