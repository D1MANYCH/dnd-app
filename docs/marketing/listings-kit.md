# Листинги-кит (Трек 4B) — бесплатные «вечные» точки

Готовые тексты для самостоятельной подачи в каталоги/листинги. Цель — **постоянный SEO-трафик и находимость** (в отличие от разовых посевов). Все пункты требуют твоего GitHub/аккаунта, поэтому подаёшь сам — здесь точные тексты для копипасты. `expanded-channels.md` — это стратегия «зачем», а здесь — «что именно вставить».

**Ревизия 06.07.2026:** статусы площадок перепроверены веб-поиском; числа обновлены до v3.33.0; добавлены две новые площадки — itch.io (§5) и RPGLinks (§6).

- **Приложение:** https://d1manych.github.io/dnd-app/
- **Репозиторий:** https://github.com/D1MANYCH/dnd-app
- **Числа (сверены с кодом, v3.33.0 от 06.07.2026):** 36 готовых билдов · 719 заклинаний · 12 классов · 42 черты (все PHB 2014) · 37 позиций оружия · 193 маг. предмета
- **Совет для всех подач:** к ссылке на приложение добавляй UTM-метку вида `https://d1manych.github.io/dnd-app/?utm_source=alternativeto` — Яндекс.Метрика уже стоит, будет видно, какая площадка приводит людей. Приложению query-string не мешает.

---

## 1. GitHub topics — ✅ СДЕЛАНО (проверено 06.07.2026)

На репо проставлены 14 topics (dnd, pwa, offline, dungeons-and-dragons, vanilla-js, russian, character-sheet, tabletop, dnd-tools, ttrpg, dnd-character-sheets, dnd5e-tools, character-sheets, dnd-5e), About-описание и Website заполнены. Репо находится через `github.com/topics/dnd-tools`, `/character-sheet` и т.д. Действий не требуется.

---

## 2. awesome-dnd — PR, ~15 минут (проверено 06.07.2026: репо живо, 297★, PR приветствуются)

Репо: https://github.com/flamableconcrete/awesome-dnd (ветка `master`, файл `readme.md`, лицензия CC0, PR приветствуются — «feel free to fork and make pull requests»).
Секция: **Character Building** (там `D&D Beyond: Characters`, `Dungeon Master's Vault`). Запасной вариант — **Character Manager**.

Строка для вставки (формат списка совпадает — `- [Имя](url) - описание`):

```markdown
- [DnD-Лист](https://d1manych.github.io/dnd-app/) - Free Russian D&D 5e character sheet & manager (PWA, offline, no signup): 36 ready-made builds with 1–20 level-up guides, 719 spells, all 42 PHB feats, full weapon catalog, 3D dice, combat tracker with SRD monsters.
```

Как подать: открой `readme.md` на GitHub → карандаш ✏️ **Edit** → GitHub сам форкнет → добавь строку в секцию (по алфавиту или в конец списка) → **Commit changes** → **Create pull request**.

- **Заголовок PR:** `Add DnD-Лист (free Russian D&D 5e character sheet, PWA)`
- **Тело PR:** Free, open-source, offline-first character sheet & manager for D&D 5e in Russian. Installable PWA, no signup. 36 ready-made builds with level-up guides, the full PHB spell list, all 42 PHB feats, a full weapon catalog linked to inventory, 3D dice and a combat/party tracker with SRD monsters. All data stays on the device.

---

## 3. alternativeto.net — аккаунт + форма, ~10 минут (проверено 06.07.2026: DnD-Лист в каталоге НЕТ, страница D&D Beyond живая)

Подать как **бесплатную альтернативу**. На сайте: страница https://alternativeto.net/software/dndbeyond/ → «Suggest as alternative», либо «Add application». На той же странице уже висят Fight Club 5e и Aurora Builder — наш профиль вписывается.

- **Name:** DnD-Лист (DnD-List)
- **URL:** https://d1manych.github.io/dnd-app/
- **Description:** Free, open-source D&D 5e character sheet and manager in Russian. Installable PWA that works fully offline with no signup. Includes 36 ready-made character builds with 1–20 level-up guides, the full PHB spell list (719 spells), all 42 PHB feats, a full weapon catalog linked to inventory, 3D dice and a combat/party tracker with SRD monsters. All data stays on your device — no cloud, no account.
- **Licensing:** Free / Open Source
- **Platforms:** Online / Web (+ works offline as PWA)
- **Alternative to:** D&D Beyond, Roll20 (character sheets), Aurora Builder, Fight Club 5e
- **Tags:** dnd, dnd5e, ttrpg, character-sheet, pwa, offline, russian

Эффект: запрос «D&D Beyond alternatives» → каталог → постоянный поиск-трафик.

---

## 4. PWA-каталоги — по желанию, низкий приоритет

- **store.app** — https://store.app/list. Рабочий каталог. Не «вставь URL и всё»: нужен аккаунт → запрос developer-доступа → claim/verify ownership приложения в дашборде → кастомизация листинга → publish. Манифест уже с реальными скриншотами — листинг выглядит прилично. Ownership чаще всего подтверждается мета-тегом/файлом на сайте; для GitHub Pages добавляется в `index.html` (по инструкции их дашборда).
- ~~**Appscope** (appsco.pe)~~ — **не работает** (проверено 28.06.2026: 503 Service Unavailable на `/` и `/submit`, Heroku-бэкенд упал, каталог заброшен). Не подавать; перепроверить позже, если воскреснет.

Трафика с PWA-каталогов мало — это «по желанию». Высокоценные точки — awesome-dnd PR, alternativeto.net, itch.io и RPGLinks (ниже).

---

## 5. itch.io — страница-инструмент, ~20 минут (НОВОЕ, проверено 06.07.2026)

Что это: у itch.io есть живой раздел бесплатных веб-инструментов с тегами — [itch.io/tools/newest/free/platform-web/tag-dnd](https://itch.io/tools/newest/free/platform-web/tag-dnd) и [tag-dungeons-and-dragons](https://itch.io/tools/tag-dungeons-and-dragons). Туда выкладывают TTRPG-инструменты; пользователи собирают их в коллекции — это даёт постоянную находимость и SEO. Аудитория маленькая, но качественная (мастера, инди-игроки).

Как подать: аккаунт → **Dashboard → Create new project**.
- **Kind of project:** Tools (не Game).
- **Kind of project → «This will be played in the browser»** можно НЕ включать (движок грузить необязательно). Проще: залить как проект со ссылкой наружу — в описании крупная кнопка-ссылка на приложение. Либо мини-встраивание (iframe твоего URL) — но офлайн-PWA лучше открывать в своей вкладке, так что достаточно ссылки.
- **Title:** DnD-Лист — free offline D&D 5e character sheet (RU)
- **Short description / tagline:** Free, offline, no-signup D&D 5e character sheet in Russian (PWA)
- **Classification:** Tools
- **Pricing:** No payments (Free)
- **Ссылка в тело описания:** 👉 https://d1manych.github.io/dnd-app/?utm_source=itchio
- **Теги:** `dnd`, `dnd5e`, `character-sheet`, `tabletop`, `ttrpg`, `pwa`, `tool`
- **Описание (EN, для копипасты):**

```
DnD-Лист is a free, open-source character sheet & manager for D&D 5e in Russian.
It's an installable PWA that works fully offline with no signup — all data stays on your device.

• 36 ready-made builds with 1–20 level-up guides
• The full PHB spell list (719 spells), searchable and filterable
• All 42 PHB feats and a full weapon catalog linked to inventory
• 3D dice (d4–d20, d100)
• Combat/party tracker with initiative and SRD monsters
• Import/export as a single JSON file

Open in any browser, add to your phone's home screen, play offline.
👉 https://d1manych.github.io/dnd-app/
```

---

## 6. RPGLinks (ImaginariaRU) — PR/issue, ~15 минут (НОВОЕ, проверено 06.07.2026)

Что это: [github.com/ImaginariaRU/RPGLinks](https://github.com/ImaginariaRU/RPGLinks) — русскоязычный каталог ролевых ресурсов РФ (клубы, форумы, вики, сообщества, генераторы). Принимает вклад: «Проще всего через Pull request или issues на гитхабе». **Прямая ЦА** — русскоговорящие ролевики. Сейчас отдельной секции «Инструменты» (цифровые приложения) нет — можно предложить её создать и добавить DnD-Лист.

Как подать (проще — issue, если не хочешь возиться с форматом):
- **Issue заголовок:** Предложение: секция «Инструменты» + DnD-Лист (лист персонажа D&D 5e)
- **Issue тело:**

```
Привет! Каталог отличный. Заметил, что нет секции под цифровые инструменты
(листы персонажа, трекеры, приложения). Предлагаю завести «Инструменты»
и добавить туда, для начала, мой бесплатный проект:

DnD-Лист — https://d1manych.github.io/dnd-app/
Бесплатный лист персонажа D&D 5e на русском. PWA, работает офлайн,
без регистрации, данные только на устройстве. 36 готовых билдов с гайдами
1–20, 719 заклинаний, каталог оружия и черт, 3D-кубики, боевой трекер.
Открыт исходник: https://github.com/D1MANYCH/dnd-app

Если формат секции подскажете — оформлю PR сам.
```

- Если предпочитаешь PR: добавь строку в подходящий раздел `README`/каталога в формате их списка (посмотри соседние строки) — `[DnD-Лист](url) — краткое описание`.

---

## Трекинг

Каждую поданную площадку → дата + ссылка/реакция (Яндекс.Метрика ловит переходы, если ставил UTM). Стратегия и расширенный пул — `expanded-channels.md`, целевые сообщества для посевов (Трек 4C) — `seeding-targets.md`.
