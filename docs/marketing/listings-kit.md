# Листинги-кит (Трек 4B) — бесплатные «вечные» точки

Готовые тексты для самостоятельной подачи в каталоги/листинги. Цель — **постоянный SEO-трафик и находимость** (в отличие от разовых посевов). Все пункты требуют твоего GitHub/аккаунта, поэтому подаёшь сам — здесь точные тексты для копипасты. `expanded-channels.md` — это стратегия «зачем», а здесь — «что именно вставить».

- **Приложение:** https://d1manych.github.io/dnd-app/
- **Репозиторий:** https://github.com/D1MANYCH/dnd-app
- **Числа (сверены с README, v3.28.70):** 36 готовых билдов · 719 заклинаний · 12 классов

---

## 1. GitHub topics — 5 минут, самое дешёвое

Где: страница репо → блок **About** (справа вверху) → шестерёнка ⚙️ → поле **Topics**.

Вставить (по одному, GitHub подсветит валидные):

```
dnd  dnd5e  dungeons-and-dragons  dnd-tools  dnd5e-tools  character-sheet  dnd-character-sheet  ttrpg  tabletop  pwa  offline  vanilla-js  russian
```

Эффект: репо попадает в `github.com/topics/dnd-tools`, `/character-sheet`, `/pwa` и т.д. — постоянная находимость. Заодно в **About** проверь, что заполнены **Description** и **Website** (= ссылка на приложение).

---

## 2. awesome-dnd — PR, ~15 минут

Репо: https://github.com/flamableconcrete/awesome-dnd (ветка `master`, файл `readme.md`, лицензия CC0, PR приветствуются).
Секция: **Character Building** (там `D&D Beyond: Characters`, `Dungeon Master's Vault`). Запасной вариант — **Character Manager**.

Строка для вставки (формат списка совпадает — `- [Имя](url) - описание`):

```markdown
- [DnD-Лист](https://d1manych.github.io/dnd-app/) - Free Russian D&D 5e character sheet & manager (PWA, offline, no signup): 36 ready-made builds with 1–20 level-up guides, 719 spells, 3D dice, combat tracker.
```

Как подать: открой `readme.md` на GitHub → карандаш ✏️ **Edit** → GitHub сам форкнет → добавь строку в секцию (по алфавиту или в конец списка) → **Commit changes** → **Create pull request**.

- **Заголовок PR:** `Add DnD-Лист (free Russian D&D 5e character sheet, PWA)`
- **Тело PR:** Free, open-source, offline-first character sheet & manager for D&D 5e in Russian. Installable PWA, no signup. 36 ready-made builds with level-up guides, the full PHB spell list, 3D dice and a combat/party tracker. All data stays on the device.

---

## 3. alternativeto.net — аккаунт + форма, ~10 минут

Подать как **бесплатную альтернативу**. На сайте: страница D&D Beyond → «Suggest as alternative», либо «Add application».

- **Name:** DnD-Лист (DnD-List)
- **URL:** https://d1manych.github.io/dnd-app/
- **Description:** Free, open-source D&D 5e character sheet and manager in Russian. Installable PWA that works fully offline with no signup. Includes 36 ready-made character builds with 1–20 level-up guides, the full PHB spell list (719 spells), 3D dice and a combat/party tracker. All data stays on your device — no cloud, no account.
- **Licensing:** Free / Open Source
- **Platforms:** Online / Web (+ works offline as PWA)
- **Alternative to:** D&D Beyond, Roll20 (character sheets), Aurora Builder, Fight Club 5e
- **Tags:** dnd, dnd5e, ttrpg, character-sheet, pwa, offline, russian

Эффект: запрос «D&D Beyond alternatives» → каталог → постоянный поиск-трафик.

---

## 4. PWA-каталоги — по желанию, низкий приоритет

- **store.app** — https://store.app/list. Рабочий каталог. Не «вставь URL и всё»: нужен аккаунт → запрос developer-доступа → claim/verify ownership приложения в дашборде → кастомизация листинга → publish. Манифест уже с реальными скриншотами (v3.28.70) — листинг выглядит прилично. Ownership чаще всего подтверждается мета-тегом/файлом на сайте; для GitHub Pages добавляется в `index.html` (по инструкции их дашборда).
- ~~**Appscope** (appsco.pe)~~ — **не работает** (проверено 28.06.2026: 503 Service Unavailable на `/` и `/submit`, Heroku-бэкенд упал, каталог заброшен). Не подавать; перепроверить позже, если воскреснет.

Трафика с PWA-каталогов мало — это «по желанию». Высокоценные точки — GitHub topics, awesome-dnd PR и alternativeto.net.

---

## Трекинг

Каждую поданную площадку → дата + ссылка/реакция (пока нет аналитики). Стратегия и расширенный пул — `expanded-channels.md`, целевые сообщества для посевов (Трек 4C) — `seeding-targets.md`.
