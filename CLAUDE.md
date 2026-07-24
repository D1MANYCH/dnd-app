# CLAUDE.md

Контекст для ассистента. Читать первым в каждом новом чате.

## Стек
- Vanilla JS + HTML + CSS, **без сборщика** и npm-runtime-зависимостей (npm — только для тулов).
- PWA: `sw.js` (`CACHE_NAME` формата `dnd-sheet-vN` + `FILES_TO_CACHE`) + `manifest.json`.
- Вендорено: `vendor/dice-box/` (3D-кубики, WebGL), `vendor/jspdf/` (PDF).

## Карта файлов (корень)
Полная структура, ключевые функции, схема персонажа, миграции — [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

- `index.html` — единственная страница: разметка, порядок скриптов, ленивый загрузчик.
- Ядро и вкладки: `app-core.js` (состояние, навигация, персонажи, импорт/экспорт), `app-combat.js`, `app-hp.js`, `app-inventory.js`, `app-spells.js`, `app-party.js`, `app-notes.js`, `app-ui.js`, `app-desktop.js`, `app-help.js` (справка и туры), `history-stack.js`, `app-backup.js` (IndexedDB), `app-log.js` (панель Ctrl+Shift+L), `app-pdf.js`.
- Данные: `data.js` (классы/расы/черты + `APP_VERSION`/`APP_VERSION_DATE`/`APP_CHANGELOG`), `data-2024.js` (edition-слой), `spells.js`, `spell-effects.js` (механика кнопки «Использовать»), `character-builds.js` + `build-notes-data.js`, `class-choices.js` + `subclass-choices-data.js`, `magic-items.js`, `gear-catalog.js`, `glossary-data.js`, `monsters-srd.js` + `npc-srd.js`.
- Прочее: `icons.js` (SVG-иконки), `bg-space.js` + `dice-arena-bg.js` (фоны), `dev-verify-builds.js` (`verifyAllBuilds()`).
- `tools/` — `bump-version.js`, `gen-changelog.js`, `check-invariant.js`, `check-theme.js`, `run-tests-hook.js`. `tests/` — `headless-node.js`, `runner.html` + `headless.js`, `fixtures.js`. CI — `.github/workflows/tests.yml` (тесты + инвариант + темы), `pages.yml` (деплой).

## Соглашения по коду
- Модули — обычные `<script src>` внизу `index.html` в **жёстком порядке**: `app-log` → `icons` → фоны → данные → `app-core` → вкладки → `app-ui`/`app-notes`/`app-desktop`/`app-help`. Единственный `type="module"` — обёртка dice-box (`index.html:2998`).
- Обмен — через глобалы: функции объявляются на верхнем уровне файла (`function f()`), экспортов нет. В `index.html` ~460 inline-обработчиков (`onclick=`, `oninput=`) зовут их по имени — обернуть такой файл в IIFE значит сломать вкладку. IIFE только у самодостаточных `app-log.js` / `icons.js` / `history-stack.js` / `bg-space.js` / `dice-arena-bg.js` — они публикуют API через `window.X`.
- Стиль — ES5: `var` (стрелки и шаблонные строки в коде почти не встречаются), писать по соседнему коду.
- Тяжёлое грузится лениво через `loadScript()` в низу `index.html`: `app-pdf` + `vendor/jspdf`, `build-notes-data`, `monsters-srd` + `npc-srd`, `magic-items`, `gear-catalog`, `data-2024`. Их `?v=` токены живут там же.
- Новый js/css-файл → подключение в `index.html` (`<script src>` или `loadScript`) + `?v=` токен + строка в `FILES_TO_CACHE` (`sw.js`).
- UI и термины — русские, эталон — книги D&D 5e 2014; редакция 2024 живёт за `char.edition` (`EDITION_DATA`/`edData`).

## Запуск и тесты
- Превью — конфиг `dnd-app` в `.claude/launch.json` (`preview_start`, порт 3017) либо любой статический сервер из корня; PWA требует `https` или `localhost`.
- `/test` (= `node tests/headless-node.js`) — логика; `tests/runner.html` — те же тесты в браузере; `verifyAllBuilds()` в DevTools-консоли — билды, сейчас 36/36 fullPass.

## Версионирование
Инвариант релиза — пять величин меняются синхронно одной командой:

```
APP_VERSION ↔ APP_CHANGELOG[0].version ↔ CACHE_NAME (dnd-sheet-vN) ↔ все ?v=vN токены js/css в index.html ↔ CHANGELOG.md
```

Правит их `/bump <patch|minor|major> "<changelog>" [--type chore|feat|fix]`, дальше `/preflight`. Пошаговая механика, сбои и push — скилл `release`.

## Хуки (`.claude/settings.json`, `PostToolUse` на Edit|Write|MultiEdit)
Блокируют (exit 2): правку `sw.js` без bump `CACHE_NAME`; рассинхрон `APP_VERSION` ↔ `APP_CHANGELOG[0].version`. Предупреждают: `tools/run-tests-hook.js` на правку `*.js`, `tools/check-theme.js --hook` на правку `style.css`. Отключить — убрать блок из `hooks.PostToolUse`; источник истины — сам `settings.json`.

## Процедуры
- Slash-команды — `.claude/commands/*.md`, скиллы — `.claude/skills/*/SKILL.md`. **Скилл читать ДО задачи, а не после.** Контент (класс, заклинание, билд, магпредмет, черта, оружие) — скилл `add-content`, там же файлы и миграции `schemaVersion`.
- Планы: фазы — в `~/.claude/projects/.../memory/project_*_plan.md`, индекс — `MEMORY.md`; старт нового чата — «начать фазу X-N», после закрытия фазы отметить `**done**`.

## Конвенции коммитов
Формат `тип(scope): описание` на русском, типы `feat` / `fix` / `chore`, релизы — префикс `vX.Y.Z:`. Коммиты создавать **только по запросу пользователя**.

## Что НЕ делать
- Не подключать сборщик и npm-runtime-зависимости — всё vanilla.
- Не менять `assets/` или статику без bump `CACHE_NAME` в `sw.js`.
- Не коммитить без явного запроса пользователя.
