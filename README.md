# D&D 5e — Лист Персонажа

Мобильное PWA-приложение для D&D 5e.

## Структура проекта

```
dnd-app/
├── index.html      ← HTML разметка (структура страниц, модалы)
├── style.css       ← Все стили (CSS переменные, компоненты, анимации)
├── data.js         ← Данные игры (заклинания, классы, условия, оружие)
├── app.js          ← Логика (функции, обработчики, localStorage)
├── manifest.json   ← PWA манифест (иконка, имя, цвета)
├── sw.js           ← Service Worker (офлайн-режим)
└── icons/
    ├── icon-192.svg
    └── icon-512.svg
```

## Как вайбкодить с несколькими файлами

**Если меняешь логику** → закидывай Claude `app.js` (+ `data.js` если нужно)
**Если меняешь стили** → закидывай Claude `style.css`
**Если добавляешь данные** → закидывай Claude `data.js`
**Если меняешь структуру страниц** → закидывай Claude `index.html`

## Установка как PWA на Android

1. Открой `index.html` через локальный сервер (или размести на GitHub Pages)
2. В Chrome: меню → "Добавить на главный экран"
3. Готово — иконка появится на рабочем столе!

## Быстрый локальный запуск (для разработки)

```bash
# Python (обычно уже установлен)
python3 -m http.server 8080
# Открой http://localhost:8080
```

## Следующий шаг → Android APK через Capacitor

```bash
npm install -g @capacitor/cli
npm init @capacitor/app
npx cap add android
npx cap sync
npx cap open android
```
