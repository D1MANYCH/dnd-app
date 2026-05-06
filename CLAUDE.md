# CLAUDE.md

Контекст для ассистента. Читать первым в каждом новом чате.

## Стек
- Vanilla JS + HTML + CSS, **без сборщика** и npm-runtime-зависимостей.
- PWA: `sw.js` + `manifest.json`.
- 3D-кубики: `vendor/dice-box/` (WebGL, @3d-dice/dice-box).

## Карта файлов (корень)
- `index.html` — единственная страница.
- `app.js` — главный модуль (~250 КБ, инициализация и связки вкладок).
- `app-core.js` / `app-combat.js` / `app-hp.js` / `app-inventory.js` / `app-spells.js` / `app-notes.js` / `app-party.js` / `app-ui.js` — модули по вкладкам.
- `data.js` — классы, расы, `APP_VERSION` (сейчас `"3.0.0"`), `APP_CHANGELOG`.
- `spells.js` — БД заклинаний.
- `character-builds.js` + `build-notes-data.js` — 36 готовых билдов PHB 2014 + варианты автозаметок.
- `class-choices.js` + `subclass-choices-data.js` — выборы классов/подклассов.
- `dev-verify-builds.js` — `verifyAllBuilds()` (консольный verifier билдов).
- `sw.js` — service worker, `CACHE_NAME` (сейчас `'dnd-sheet-v51'`).
- `vendor/dice-box/` — 3D-кубики (вендорено).
- `assets/` — иконки и фоны (PNG, ~27 МБ — кандидат на оптимизацию OPT-5).
- `tests/` — `headless-node.js` (Node), `headless.js` + `runner.html` (браузерные), `fixtures.js`.

## Запуск
- Preview MCP (`preview_start`) или любой статический сервер из корня.
- PWA требует `https` либо `localhost`.

## Версионирование
После релизных правок:
1. Bump `APP_VERSION` и добавить запись в `APP_CHANGELOG` в `data.js`.
2. Bump `CACHE_NAME` в `sw.js` — иначе клиенты не подтянут новые файлы.

## Тесты
- `node tests/headless-node.js` — логика.
- Открыть `tests/runner.html` — браузерные.
- `verifyAllBuilds()` в DevTools-консоли — текущий результат **36/36 fullPass**.

## Конвенции коммитов
Формат `тип(scope): описание` на русском. Типы из истории: `feat`, `fix`, `chore`. Релизы — префикс `vX.Y.Z:`. Коммиты создавать **только по запросу пользователя**.

## Соглашения по работе с планами
- Фазы хранятся в `~/.claude/projects/.../memory/project_*.md`, индекс — `MEMORY.md`.
- Новый чат стартует триггером «начать фазу X-N» (X = код плана: OPT, UI, BUGFIX, FEAT и т.п.).
- После закрытия фазы — отметить done в соответствующем `project_*_plan.md`.

## Что НЕ делать
- Не подключать сборщик и npm-runtime-зависимости — всё vanilla.
- Не менять `assets/` или статические файлы без bump `CACHE_NAME` в `sw.js`.
- Не коммитить без явного запроса пользователя.
