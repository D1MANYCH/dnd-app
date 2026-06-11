# CLAUDE.md

Контекст для ассистента. Читать первым в каждом новом чате.

## Стек
- Vanilla JS + HTML + CSS, **без сборщика** и npm-runtime-зависимостей.
- PWA: `sw.js` + `manifest.json`.
- 3D-кубики: `vendor/dice-box/` (WebGL, @3d-dice/dice-box).

## Карта файлов (корень)
- `index.html` — единственная страница.
- `app-core.js` — ядро: инициализация, состояние, навигация, персонажи, импорт/экспорт.
- `app-combat.js` / `app-hp.js` / `app-inventory.js` / `app-spells.js` / `app-notes.js` / `app-party.js` / `app-ui.js` / `app-desktop.js` / `history-stack.js` — модули по вкладкам/функциям.
- `app-backup.js` — автобэкапы в IndexedDB.
- `app-log.js` — лог сессии (панель Ctrl+Shift+L).
- `app-pdf.js` — PDF-экспорт листа (PERF-1: грузится по требованию из инлайн-загрузчика `index.html` вместе с `vendor/jspdf/`).
- `data.js` — классы, расы, `APP_VERSION` + `APP_VERSION_DATE` + `APP_CHANGELOG`.
- `spells.js` — БД заклинаний.
- `character-builds.js` — 36 готовых билдов PHB 2014.
- `build-notes-data.js` — варианты автозаметок билдов (PERF-2: грузится по требованию из инлайн-загрузчика `index.html`).
- `class-choices.js` + `subclass-choices-data.js` — выборы классов/подклассов.
- `dev-verify-builds.js` — `verifyAllBuilds()` (консольный verifier билдов).
- `sw.js` — service worker, `CACHE_NAME` формата `dnd-sheet-vN` + `FILES_TO_CACHE`.
- `vendor/dice-box/` — 3D-кубики (вендорено).
- `assets/` — иконки и фоны (webp, ~3.5 МБ).
- `tests/` — `headless-node.js` (Node), `headless.js` + `runner.html` (браузерные), `fixtures.js`.
- `tools/` — `bump-version.js`, `gen-changelog.js`, `check-invariant.js` (сверка инварианта релиза), `run-tests-hook.js`.
- `.github/workflows/tests.yml` — CI: headless-тесты + `check-invariant.js` на каждый push/PR.

## Запуск
- Preview MCP (`preview_start`) или любой статический сервер из корня.
- PWA требует `https` либо `localhost`.

## Версионирование

**Инвариант релиза** — пять величин должны меняться синхронно одной командой:

```
APP_VERSION  ↔  APP_CHANGELOG[0].version  ↔  CACHE_NAME (dnd-sheet-vN)  ↔  все ?v=vN токены js/css в index.html  ↔  CHANGELOG.md
```

Команда — `/bump <patch|minor|major> "<changelog>" [--type chore|feat|fix]` (под капотом `tools/bump-version.js`):

1. **`checkRemote()`** — `git fetch origin main` + сверка локальных `APP_VERSION`/`CACHE_NAME` с remote; если origin опережает → `exit 1` с подсказкой `git pull` (чтобы не получить дубль номера). Soft-fail при отсутствии git/сети/origin — релиз офлайн не блокируется.
2. **`data.js`** — bump `APP_VERSION` + `APP_VERSION_DATE` + добавляет запись в `APP_CHANGELOG` (предыдущая badge `new` → `old`).
3. **`sw.js`** — bump `CACHE_NAME` `dnd-sheet-vN` → `dnd-sheet-v(N+1)`.
4. **`index.html`** — все `?v=...` токены js/css перезаписываются на `v(N+1)`. Webp/png ассеты не трогаются (свой редкий цикл).
5. **`CHANGELOG.md`** — перегенерируется из `APP_CHANGELOG` через `tools/gen-changelog.js`. Soft-fail: если генератор упал, bump уже записан (data/sw/index), CHANGELOG чинится вручную `node tools/gen-changelog.js`.

Любая частичная ошибка (пп. 2–4) → `exit 1` без записи. После bump — `/preflight` (тесты + сверка инварианта) → коммит **только по запросу пользователя**. Хуки `PostToolUse` дополнительно валидируют инвариант на каждой правке (см. ниже).

## Тесты
- `node tests/headless-node.js` — логика.
- Открыть `tests/runner.html` — браузерные.
- `verifyAllBuilds()` в DevTools-консоли — текущий результат **36/36 fullPass**.

## Slash-команды (`.claude/commands/`)
- `/test` — `node tests/headless-node.js`, выводит одну строку итога; при FAIL — desc первых 3.
- `/preflight` — тесты + сверка `APP_VERSION` ↔ `APP_CHANGELOG[0].version` + проверка bump `CACHE_NAME`.
- `/bump <patch|minor|major> "<changelog>" [--type chore|feat|fix]` — синхронный bump через `tools/bump-version.js` (правит `data.js`, `sw.js`, `index.html` и регенерирует `CHANGELOG.md` за один проход).
- `/phase <X-N>` — стартовать фазу из `memory/MEMORY.md` (например `/phase DEV-4`).
- `/done <X-N>` — пометить фазу `**done**` в соответствующем `project_*_plan.md`.

## Hooks (`.claude/settings.json`, PostToolUse на Edit|Write|MultiEdit)
1. **sw.js guard** — при правке `sw.js` печатает текущий `CACHE_NAME` и напоминает бампнуть (exit 2 → блокирует).
2. **data.js version sync** — если `APP_VERSION !== APP_CHANGELOG[0].version`, exit 2 → блокирует.
3. **auto-tests** — `node tools/run-tests-hook.js` прогоняет `tests/headless-node.js` на правки `*.js` (кроме `tests/`, `vendor/`, `assets/`). Warn-режим (exit 0), не блокирует.

Отключить временно — закомментировать/убрать соответствующий блок из `hooks.PostToolUse` в `.claude/settings.json`.

## Типовые задачи (где править)
- **Новый класс** → `data.js` (`CLASSES`), `class-choices.js`, опц. `subclass-choices-data.js`. Verify: `/test`.
- **Новое заклинание** → `spells.js` (схема — по соседним записям). Если затрагивает UI — bump `CACHE_NAME`.
- **Новый билд** → `character-builds.js` + `build-notes-data.js`. Verify: `verifyAllBuilds()` в DevTools.
- **Релиз** → `/bump <уровень> "<changelog>"` → `/preflight` → коммит по запросу пользователя.
- **Новая фаза плана** → скелет `.claude/templates/phase-plan.md`, индекс в `memory/MEMORY.md`.

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
