# D&D 5e Character Sheet

## Структура проекта

```
dnd-app/
├── index.html      — HTML разметка (структура страниц)
├── style.css       — Все стили и CSS переменные
├── data.js         — Статические данные: классы, заклинания, условия, пресеты
├── app.js          — Вся логика приложения
├── manifest.json   — PWA манифест (для установки на телефон)
├── sw.js           — Service Worker (офлайн-режим)
└── README.md       — Этот файл
```

## Как запустить локально

Просто открой `index.html` в браузере. Всё работает без сервера.

## Как установить как PWA на Android

1. Открой `index.html` в Chrome на Android
2. Нажми три точки → «Добавить на главный экран»
3. Приложение установится и будет работать офлайн

## Как правильно вайбкодить с этим проектом

Когда идёшь к Claude — **прикрепляй нужные файлы**:

- Хочешь изменить внешний вид? → прикрепи `style.css`
- Хочешь добавить новую механику? → прикрепи `app.js`
- Хочешь добавить новый класс/заклинание? → прикрепи `data.js`
- Хочешь изменить структуру страницы? → прикрепи `index.html`

Например: *"Вот мой app.js — добавь систему смерти (death saving throws)"*

## Как упаковать в Android APK (через Capacitor)

```bash
npm install -g @ionic/cli
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "DnD Sheet" "com.yourname.dndsheet"
npx cap add android
npx cap copy
npx cap open android
```
Потом в Android Studio: Build → Generate Signed APK

## Что где лежит в data.js

- `escapeHtml()` — защита от XSS
- `SAVES_DATA` — данные спасбросков
- `CONDITIONS` — условия (Ослеплён, Испуган и т.д.)
- `EFFECTS_DATA` — временные эффекты (Ярость, Доспех мага...)
- `CLASS_FEATURES` — умения классов по уровням
- `CLASS_SAVE_PROFICIENCIES` — владения спасбросками по классу
- `SPELL_SLOTS_BY_LEVEL` — таблица ячеек заклинаний
- `CLASS_HIT_DICE` — кость хитов каждого класса
- `SUBCLASSES` — подклассы
- `WEAPON_PRESETS` — пресеты оружия

## Что где лежит в app.js

- Глобальные переменные состояния (`characters`, `currentId`...)
- `window.onload` — инициализация
- Функции расчёта (`calcStats`, `calculateAC`, `getMod`...)
- Функции персонажа (`createNewCharacter`, `loadCharacter`, `updateChar`...)
- Функции UI (`showScreen`, `switchTab`, модалки...)
- Функции инвентаря, заклинаний, оружия
- Экспорт/импорт данных
