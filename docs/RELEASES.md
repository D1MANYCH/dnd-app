# Подробный лог релизов

Что именно вошло в каждую версию: коммиты, изменённые файлы со счётчиком строк и ссылка на полный дифф на GitHub.
Сгенерировано автоматически из `data.js` + git-истории (`node tools/gen-release-log.js`) — не редактировать вручную.

Актуальная версия — **v3.61.0**.

📋 [Короткий changelog](../CHANGELOG.md) — то же самое человеческим языком, без технических подробностей.
🎲 [Открыть приложение](https://d1manych.github.io/dnd-app/)

---

<a id="v3.61.0"></a>
## v3.61.0 — 30 июля 2026

✨ Единый стиль интерфейса: serif-заголовки с ромбовидными маркерами вместо эмодзи, облегчённые карточки, одинаковые оболочка и анимация у всех модальных окон, плавное подчёркивание пунктов меню; в светлой теме затемнение под модалками больше не чернит страницу

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1a865611...main) · 17 файлов, +1710 −181

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`e25e6d2e`](https://github.com/D1MANYCH/dnd-app/commit/e25e6d2e) chore(dev): агенты releaser/relpost/content, команда /ship и Stop-хук
- [`61aea109`](https://github.com/D1MANYCH/dnd-app/commit/61aea109) chore(dev): /ship разбирает изменения сам, releaser умеет коммит без bump

**Файлы (17):**

- `tests/style-kit.html` +627 −0
- `index.html` +112 −112
- `.claude/agents/releaser.md` +200 −4
- `style.css` +168 −21
- `.claude/commands/ship.md` +142 −20
- `tools/check-uncommitted-hook.js` +130 −0
- `.claude/agents/content.md` +128 −0
- `.claude/agents/relpost.md` +108 −0
- `.claude/skills/faza/SKILL.md` +26 −8
- `CLAUDE.md` +19 −7
- `.claude/settings.json` +22 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `icons.js` +5 −1
- `app-notes.js` +3 −1
- `tools/theme-baseline.json` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.60.0"></a>
## v3.60.0 — 27 июля 2026

✨ Встречающий экран во всё окно: меню Продолжить / Новый персонаж / Выбор персонажа / Данные / Настройки / О версии, список персонажей отдельным экраном

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/cf9b583b...1a865611) · 18 файлов, +1261 −104

<details><summary>Коммиты и файлы</summary>

**Коммиты (5):**

- [`96b3e6f3`](https://github.com/D1MANYCH/dnd-app/commit/96b3e6f3) chore(dev): авторевью пул-реквестов в GitHub Actions
- [`f53c327c`](https://github.com/D1MANYCH/dnd-app/commit/f53c327c) chore(dev): ревьюер PR сам гоняет тесты и инвариант
- [`31f35571`](https://github.com/D1MANYCH/dnd-app/commit/31f35571) chore(dev): инвариант ловит подключения без ?v= и вне FILES_TO_CACHE
- [`d6ca34fb`](https://github.com/D1MANYCH/dnd-app/commit/d6ca34fb) chore(dev): генератор релиз-поста — патч первой ссылкой, без дубля
- [`1a865611`](https://github.com/D1MANYCH/dnd-app/commit/1a865611) v3.60.0: feat(ui): встречающий экран во всё окно

**Файлы (18):**

- `style.css` +371 −0
- `app-home.js` +266 −0
- `index.html` +174 −55
- `.github/workflows/claude-code-review.yml` +107 −3
- `tests/headless.js` +95 −0
- `app-core.js` +60 −12
- `tools/check-invariant.js` +62 −1
- `docs/RELEASES.md` +47 −4
- `app-help.js` +22 −13
- `data.js` +19 −3
- `history-stack.js` +10 −5
- `CHANGELOG.md` +11 −1
- `app-party.js` +7 −0
- `tools/gen-release-post.js` +4 −3
- `CLAUDE.md` +2 −2
- `sw.js` +2 −1
- `.github/workflows/tests.yml` +1 −1
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.59.0"></a>
## v3.59.0 — 27 июля 2026

✨ Новый стартовый экран: плашка последнего героя и меню приключения — продолжить, создать по билду или с нуля, бестиарий, кости, данные

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.58.20"></a>
## v3.58.20 — 26 июля 2026

🐛 Короткий отдых не даёт потратить костей хитов больше, чем осталось в запасе (PHB стр. 186). Истощение снижается длинным отдыхом только если персонаж поел и попил (PHB стр. 291) — в окне отдыха появился флажок, он виден только при истощении.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0803f7c9...cf9b583b) · 10 файлов, +224 −79

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`c5518982`](https://github.com/D1MANYCH/dnd-app/commit/c5518982) chore(docs): точная запись v3.58.19 в подробном логе
- [`cf9b583b`](https://github.com/D1MANYCH/dnd-app/commit/cf9b583b) v3.58.20: fix(rules): короткий отдых по остатку костей, истощение при еде и питье

**Файлы (10):**

- `index.html` +48 −44
- `docs/ARCHITECTURE.md` +37 −15
- `docs/RELEASES.md` +40 −5
- `tests/rules-cases.js` +39 −0
- `rules.js` +19 −4
- `app-hp.js` +19 −3
- `data.js` +10 −2
- `CLAUDE.md` +5 −4
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.19"></a>
## v3.58.19 — 26 июля 2026

🐛 Длинный отдых на 0 хитов больше не даёт преимуществ (PHB стр. 186): rulesLongRest возвращает отказ и не меняет персонажа — ХП, кости хитов, ячейки, истощение и спасброски от смерти остаются как были. В окне отдыха кнопка подтверждения гаснет с причиной, в confirmRest продублирована страховка. Короткий отдых не гейтится: требование «хотя бы 1 хит в начале» книга предъявляет только к продолжительному отдыху. Тесты 650 → 653.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9778ee01...0803f7c9) · 13 файлов, +344 −55

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`85dbda8e`](https://github.com/D1MANYCH/dnd-app/commit/85dbda8e) chore(docs): точная запись v3.58.18 в подробном логе
- [`8adba1e7`](https://github.com/D1MANYCH/dnd-app/commit/8adba1e7) chore(dev): сабагент-судья правил dnd-rules + команда /rules
- [`0803f7c9`](https://github.com/D1MANYCH/dnd-app/commit/0803f7c9) v3.58.19: fix(rules): длинный отдых требует хотя бы 1 хит в начале (PHB стр. 186)

**Файлы (13):**

- `.claude/agents/dnd-rules.md` +97 −0
- `index.html` +44 −44
- `tools/phb-search.py` +69 −0
- `tests/rules-cases.js` +38 −0
- `docs/RELEASES.md` +32 −4
- `app-hp.js` +18 −3
- `rules.js` +21 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `.claude/commands/rules.md` +5 −0
- `.claude/skills/faza/SKILL.md` +2 −0
- `sw.js` +1 −1
- `CLAUDE.md` +1 −0

</details>

<a id="v3.58.18"></a>
## v3.58.18 — 26 июля 2026

✨ Вкладка «Изменения»: длинные записи сворачиваются с раскрытием по кнопке «ещё», у каждой версии появилась ссылка на подробный лог релизов — коммиты, изменённые файлы и полный патч

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/88fa813e...9778ee01) · 16 файлов, +8162 −63

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`9778ee01`](https://github.com/D1MANYCH/dnd-app/commit/9778ee01) v3.58.18: feat(ui): краткие записи в «Изменениях» + подробный лог релизов

**Файлы (16):**

- `docs/RELEASES.md` +7555 −0
- `tools/gen-release-log.js` +287 −0
- `tools/gen-release-post.js` +98 −0
- `index.html` +48 −44
- `style.css` +55 −0
- `app-ui.js` +38 −7
- `.claude/skills/release/SKILL.md` +19 −4
- `data.js` +10 −2
- `docs/ARCHITECTURE.md` +11 −1
- `tools/bump-version.js` +11 −0
- `.claude/commands/relpost.md` +10 −0
- `CLAUDE.md` +8 −1
- `CHANGELOG.md` +7 −1
- `README.md` +2 −1
- `tools/gen-changelog.js` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.17"></a>
## v3.58.17 — 26 июля 2026

🔧 Код разбит на модули: миграции, билды, импорт/экспорт, броски, оформление, АСИ, состояния, эффекты кастов, владения — вынесены из app-core.js, app-ui.js и app-combat.js в 9 отдельных файлов. Поведение не менялось.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/68a088d2...88fa813e) · 18 файлов, +6622 −6424

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`d3d47e42`](https://github.com/D1MANYCH/dnd-app/commit/d3d47e42) chore(tests): браузерный раннер догнал node — 650/650 вместо 468 при 14 красных
- [`88fa813e`](https://github.com/D1MANYCH/dnd-app/commit/88fa813e) v3.58.17: chore(code): дробление app-core/app-ui/app-combat на 9 модулей

**Файлы (18):**

- `app-core.js` +0 −2799
- `app-ui.js` +0 −2179
- `app-builds.js` +1590 −0
- `app-combat.js` +0 −1404
- `app-dice.js` +1134 −0
- `app-migrate.js` +853 −0
- `app-settings.js` +644 −0
- `app-proficiencies.js` +619 −0
- `app-conditions.js` +453 −0
- `app-asi.js` +416 −0
- `app-io.js` +368 −0
- `app-cast-effects.js` +347 −0
- `tests/runner.html` +119 −3
- `index.html` +44 −35
- `data.js` +10 −2
- `sw.js` +10 −1
- `tests/headless-node.js` +9 −0
- `CHANGELOG.md` +6 −1

</details>

<a id="v3.58.16"></a>
## v3.58.16 — 26 июля 2026

🐛 Отдых по книге: у мультикласса с Колдуном короткий отдых возвращает только ячейки пакта, длинный отдых восстанавливает минимум одну кость хитов и гасит временные ХП, кость при отрицательном Телосложении лечит минимум 0. Страница проверок — 49 кейсов, те же проверки идут в тестах

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/2475140c...68a088d2) · 10 файлов, +452 −47

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`68a088d2`](https://github.com/D1MANYCH/dnd-app/commit/68a088d2) v3.58.16: fix(rules): отдых по книге + проверки ломавшихся механик

**Файлы (10):**

- `tests/rules-cases.js` +373 −0
- `index.html` +35 −35
- `rules.js` +11 −6
- `data.js` +11 −3
- `tests/headless.js` +10 −0
- `CHANGELOG.md` +6 −1
- `tests/runner.html` +3 −1
- `sw.js` +1 −1
- `tests.html` +1 −0
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.58.15"></a>
## v3.58.15 — 25 июля 2026

🔧 Расчёты правил вынесены в rules.js: модификаторы, бонус мастерства, навыки и экспертиза, КД, инициатива, владения, отдых, ячейки. Добавлена страница проверок tests.html

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c2bb3831...2475140c) · 13 файлов, +1217 −623

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`2475140c`](https://github.com/D1MANYCH/dnd-app/commit/2475140c) v3.58.15: chore(rules): фаза 5 — чистые расчёты в rules.js + страница проверок

**Файлы (13):**

- `rules.js` +642 −0
- `app-combat.js` +21 −440
- `tests.html` +266 −0
- `tests/rules-cases.js` +199 −0
- `app-hp.js` +15 −95
- `index.html` +36 −34
- `app-core.js` +0 −50
- `data.js` +20 −2
- `.claude/launch.json` +7 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1
- `tests/runner.html` +2 −0
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.58.14"></a>
## v3.58.14 — 25 июля 2026

🐛 Инициатива: лист персонажа и трекер боя считают её одинаково. В листе теперь учитывается бонус от черт (например, «Бдительный» +5), в бою — половина бонуса мастерства Барда («Мастер на все руки»). Расчёт один на оба места.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4588f25a...c2bb3831) · 7 файлов, +113 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`c2bb3831`](https://github.com/D1MANYCH/dnd-app/commit/c2bb3831) v3.58.14: fix(combat): единый расчёт инициативы для листа и трекера боя

**Файлы (7):**

- `index.html` +34 −34
- `tests/headless.js` +50 −0
- `app-combat.js` +9 −3
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `app-party.js` +3 −2
- `sw.js` +1 −1

</details>

<a id="v3.58.13"></a>
## v3.58.13 — 25 июля 2026

🐛 Валидатор билдов: убрана вторая копия таблицы алиасов предысторий (ложный warn на 13 билдов в консоли). Единый источник — BACKGROUND_ALIASES в data.js.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8a31c2e7...4588f25a) · 22 файлов, +572 −135

<details><summary>Коммиты и файлы</summary>

**Коммиты (6):**

- [`6d88a44e`](https://github.com/D1MANYCH/dnd-app/commit/6d88a44e) chore(docs): SETUP-PLAN.md — план настройки проекта (фазы 0–8)
- [`3f849853`](https://github.com/D1MANYCH/dnd-app/commit/3f849853) chore(docs): CLAUDE.md 98 → 53 строки + блок «Соглашения по коду»
- [`7ea90cc7`](https://github.com/D1MANYCH/dnd-app/commit/7ea90cc7) chore(hooks): хук node --check + условный sw-guard, конфиг .claude в репо
- [`6cdaac93`](https://github.com/D1MANYCH/dnd-app/commit/6cdaac93) chore(claude): скилл «фаза» — процедура работы над фазой
- [`3adf09fe`](https://github.com/D1MANYCH/dnd-app/commit/3adf09fe) chore(claude): фаза 4 — превью на autoPort:false, находки скриншота в verify-ui
- [`4588f25a`](https://github.com/D1MANYCH/dnd-app/commit/4588f25a) v3.58.13: fix(builds): единая таблица алиасов предысторий BACKGROUND_ALIASES

**Файлы (22):**

- `CLAUDE.md` +32 −77
- `SETUP-PLAN.md` +101 −0
- `.claude/skills/faza/SKILL.md` +78 −0
- `index.html` +34 −34
- `tools/check-sw-hook.js` +58 −0
- `.claude/settings.json` +55 −0
- `tools/check-syntax-hook.js` +53 −0
- `tests/headless.js` +31 −0
- `data.js` +26 −3
- `.claude/templates/phase-plan.md` +24 −0
- `.claude/skills/verify-ui/SKILL.md` +14 −1
- `character-builds.js` +6 −9
- `.claude/launch.json` +13 −1
- `.claude/commands/preflight.md` +12 −0
- `app-core.js` +4 −8
- `CHANGELOG.md` +6 −1
- `.claude/commands/bump.md` +5 −0
- `.claude/commands/done.md` +5 −0
- `.claude/commands/phase.md` +5 −0
- `.gitignore` +5 −0
- `.claude/commands/test.md` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.58.12"></a>
## v3.58.12 — 24 июля 2026

✨ 9 подклассов Tasha's на полную глубину: Путь зверя (Варвар), Коллегия созидания и Коллегия красноречия (Бард), Домен порядка/мира/сумерек (Жрец), Псионический воин и Рунический рыцарь (Воин), Путь милосердия (Монах) — фичи по уровням, заклинания доменов, выбор рун, метка источника Tasha's

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ba8519f7...8a31c2e7) · 5 файлов, +188 −46

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`8a31c2e7`](https://github.com/D1MANYCH/dnd-app/commit/8a31c2e7) v3.58.12: feat(subclasses): 9 подклассов Tasha's (партия 1) на полную глубину

**Файлы (5):**

- `data.js` +93 −10
- `index.html` +34 −34
- `subclass-choices-data.js` +54 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.11"></a>
## v3.58.11 — 24 июля 2026

✨ метка источника подкласса (PHB/дополнение/авторский) в выборе, повышении уровня и плане класса; +20 подклассов из «Всё о Ксанафаре» (XGtE) — фичи по уровням, заклинания и владения

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9faa426b...ba8519f7) · 9 файлов, +420 −54

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`ba8519f7`](https://github.com/D1MANYCH/dnd-app/commit/ba8519f7) v3.58.11: feat(subclasses): метка источника подкласса + 20 подклассов XGtE

**Файлы (9):**

- `data.js` +237 −14
- `subclass-choices-data.js` +127 −0
- `index.html` +34 −34
- `app-combat.js` +6 −1
- `CHANGELOG.md` +6 −1
- `app-core.js` +3 −2
- `app-hp.js` +4 −1
- `style.css` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.58.10"></a>
## v3.58.10 — 24 июля 2026

✨ плавающий чип активных эффектов заклинаний на всех вкладках: снятие эффекта (✕) и кнопки хода «Ход» (6с) / «Минута» с тиком длительностей и авто-снятием истёкших; окно «Повышение уровня» прокручивается на телефоне (низ с кнопками больше не обрезается)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1afd2292...9faa426b) · 9 файлов, +326 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`9faa426b`](https://github.com/D1MANYCH/dnd-app/commit/9faa426b) v3.58.10: feat(ui): плавающий чип активных эффектов заклинаний (снятие ✕ + кнопки «Ход»/«Минута» с тиком длительностей) + окно «Повышение уровня» прокручивается на телефоне

**Файлы (9):**

- `app-combat.js` +124 −0
- `style.css` +121 −2
- `index.html` +54 −34
- `data.js` +11 −3
- `app-party.js` +5 −2
- `CHANGELOG.md` +6 −1
- `app-core.js` +2 −0
- `app-spells.js` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.58.9"></a>
## v3.58.9 — 23 июля 2026

✨ HB-7 — экспорт/импорт своих заклинаний: своё заклинание уезжает с персонажем и доливается при импорте в другой профиль (ремап id при коллизии, перепривязка mySpells/prepared); импорт файла заклинаний больше не затирает книжную базу, а доливает только своё; нормализация импорта (кламп уровня 0–9, source по умолчанию PH14)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/849ff1d9...1afd2292) · 6 файлов, +289 −50

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`1afd2292`](https://github.com/D1MANYCH/dnd-app/commit/1afd2292) v3.58.9: feat(spells): HB-7 — экспорт/импорт своих заклинаний: перенос с персонажем + долив при импорте (ремап id при коллизии), importSpells не затирает базу

**Файлы (6):**

- `app-core.js` +135 −12
- `tests/headless.js` +103 −0
- `index.html` +34 −34
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.8"></a>
## v3.58.8 — 23 июля 2026

✨ HB-6 — конструктор своего оружия: создать/править/удалить, сохранение в свой каталог

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ab34ec4e...849ff1d9) · 7 файлов, +409 −74

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`849ff1d9`](https://github.com/D1MANYCH/dnd-app/commit/849ff1d9) v3.58.8: feat(inventory): HB-6 — конструктор своего оружия: создать/править/удалить, сохранение в свой каталог

**Файлы (7):**

- `app-inventory.js` +150 −34
- `tests/headless.js` +159 −0
- `index.html` +60 −36
- `style.css` +23 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.7"></a>
## v3.58.7 — 23 июля 2026

✨ Задел под своё оружие: хранилище в персонаже (схема 33), каталог пикера сливает своё оружие с книжным, фильтр «Мои» и признак «Своё» на карточке; владение своим оружием считается по его категории

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/69b23e3d...ab34ec4e) · 8 файлов, +250 −52

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`ab34ec4e`](https://github.com/D1MANYCH/dnd-app/commit/ab34ec4e) v3.58.7: feat(inventory): HB-5 — хранилище своего оружия (схема 33) + каталог на чтении

**Файлы (8):**

- `tests/headless.js` +143 −3
- `index.html` +37 −34
- `app-inventory.js` +39 −8
- `data.js` +13 −4
- `app-core.js` +7 −0
- `CHANGELOG.md` +6 −1
- `style.css` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.6"></a>
## v3.58.6 — 21 июля 2026

✨ HB-4: у своих заклинаний заработала кнопка «Использовать» — урон, лечение и временные ХП с апкастом, типом урона, спасброском или броском атаки

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b282771d...69b23e3d) · 7 файлов, +483 −41

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`69b23e3d`](https://github.com/D1MANYCH/dnd-app/commit/69b23e3d) v3.58.6: feat(spells): HB-4 — рабочее «Использовать» у своих заклинаний

**Файлы (7):**

- `tests/headless.js` +211 −0
- `app-spells.js` +143 −2
- `index.html` +85 −34
- `spell-effects.js` +26 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.5"></a>
## v3.58.5 — 20 июля 2026

✨ HB-3 — правка и удаление своих заклинаний

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b6a77251...b282771d) · 7 файлов, +524 −55

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`b282771d`](https://github.com/D1MANYCH/dnd-app/commit/b282771d) v3.58.5: feat(spells): HB-3 — правка и удаление своих заклинаний

**Файлы (7):**

- `tests/headless.js` +282 −1
- `app-spells.js` +158 −16
- `index.html` +34 −34
- `style.css` +33 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.4"></a>
## v3.58.4 — 20 июля 2026

✨ HB-2: форма своего заклинания — выбор школы и нескольких классов, сброс всех полей, ограничение длины и предупреждение о совпадении имени

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/2dbe882b...b6a77251) · 8 файлов, +358 −57

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`b6a77251`](https://github.com/D1MANYCH/dnd-app/commit/b6a77251) v3.58.4: feat(spells): HB-2 — школа, классы и валидация в форме своего заклинания

**Файлы (8):**

- `tests/headless.js` +169 −0
- `index.html` +69 −47
- `app-spells.js` +80 −6
- `.claude/skills/verify-ui/SKILL.md` +16 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +7 −0
- `sw.js` +1 −1

</details>

<a id="v3.58.3"></a>
## v3.58.3 — 20 июля 2026

✨ HB-1: свои заклинания помечены бейджем «🏠 Своё» в поиске и в списке персонажа — признак проставляется и ранее созданным; запись без поля source больше не роняет поиск

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ae55d031...2dbe882b) · 8 файлов, +237 −42

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`2dbe882b`](https://github.com/D1MANYCH/dnd-app/commit/2dbe882b) v3.58.3: feat(spells): HB-1 — признак «своё» у хомбрю-заклинаний

**Файлы (8):**

- `tests/headless.js` +144 −0
- `index.html` +34 −34
- `app-core.js` +21 −0
- `app-spells.js` +14 −4
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +7 −0
- `sw.js` +1 −1

</details>

<a id="v3.58.2"></a>
## v3.58.2 — 20 июля 2026

🐛 Мета-теги: убран амперсанд из title/og:title/description — часть площадок дважды экранировала его и показывала «D&amp;D» в карточке ссылки

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/34d70744...ae55d031) · 4 файла, +60 −47

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`ae55d031`](https://github.com/D1MANYCH/dnd-app/commit/ae55d031) v3.58.2: fix(meta): убран амперсанд из мета-тегов превью

**Файлы (4):**

- `index.html` +42 −42
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.1"></a>
## v3.58.1 — 19 июля 2026

🐛 Кошель: показатель веса монет подписан «Вес:» — раньше голое число рядом с монетами читалось как денежная сумма

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/12410380...34d70744) · 7 файлов, +60 −44

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b091fc29`](https://github.com/D1MANYCH/dnd-app/commit/b091fc29) chore(docs): README — актуализация до v3.58.0
- [`34d70744`](https://github.com/D1MANYCH/dnd-app/commit/34d70744) v3.58.1: fix(inventory): подпись «Вес:» у показателя веса монет

**Файлы (7):**

- `index.html` +35 −35
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `README.md` +4 −2
- `app-inventory.js` +2 −2
- `tests/headless.js` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.58.0"></a>
## v3.58.0 — 19 июля 2026

✨ CAST-11 — добивка дескрипторов: таблица заклинаний 111 → 164 ключа. Кары и райдеры оружия (Гневная/Громовая/Палящая/Клеймящая/Ослепляющая/Оглушающая/Изгоняющая кара, Опутывающий удар, Поглощение стихий, Град шипов, Молниевая стрела, Мантия крестоносца, Стихийное оружие, Источник лунного света, Корона звёзд) — урон бросается кнопкой по попаданию, а не в момент каста. Зоны с повторным тиком (Завеса стрел, Шипы, Голод Хадара, Стена ветров, Эвардовы чёрные щупальца, Нашествие насекомых, Стена клинков, Терновая стена, Запрет, Замедленный огненный шар, Воспламеняющая туча, Смертный ужас). Клинки-конструкты (Горящий клинок, Теневой клинок, Длань Бигби, Меч Морденкайнена, Дуговой клинок). Прямой урон (Призыв заграждения, Охранные руны, Кислотная сфера, Призыв залпа, Разрушительная волна, Отилюков ледяной шар, Ледяная стена, Радужные брызги, Солнечный ожог, Цунами, Слово Силы: смерть в PH24). Заговоры Звёздная искра и Чародейский взрыв (7 вариантов типа урона). Чипы дебаффов: Паутина, Смятение, Воображаемая сила, Усыпление, Заражение, Слабоумие. Призыв Верного пса Морденкайнена. Поля repeat.icon/repeat.label — подпись «⚔️ … · по попаданию» вместо «🔁 … · повтор». Тесты 508.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/bfe6469b...12410380) · 8 файлов, +506 −51

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`12410380`](https://github.com/D1MANYCH/dnd-app/commit/12410380) v3.58.0: feat(spells): CAST-11 — добивка дескрипторов, план CAST закрыт

**Файлы (8):**

- `spell-effects.js` +277 −2
- `tests/headless.js` +169 −8
- `index.html` +34 −34
- `data.js` +10 −2
- `app-spells.js` +5 −2
- `CHANGELOG.md` +6 −1
- `app-party.js` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.57.0"></a>
## v3.57.0 — 19 июля 2026

✨ CAST-10 — дебаффы чипом на участнике трекера боя: слой «эффект на цели» (p.debuffs в BATTLE_DATA) — карточка EFFECTS_DATA вешалась только на себя, теперь участник боя получает чип под строкой ХП; поле debuff в дескрипторе spell-effects.js (id/name/icon/color/save/attack/hint/targets/targetsUpcast) + чистый хелпер debuffTargetCount, 9 ключей (Порча 3 цели +1 за уровень, Сглаз, Огонь фей, Метка охотника, Замедление, Проклятие + новые Луч слабости с броском атаки, Глухота/слепота с выбором варианта, Удержание личности) — таблица 111 ключей; пикер целей (мультивыбор с лимитом от уровня ячейки, одна цель — клик применяет сразу), снятие по концентрации/раундам/отдыху вместе с экземпляром каста и вручную кликом по чипу; остаток ⏳ живёт в экземпляре, второго таймера нет

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/66498cd8...bfe6469b) · 12 файлов, +696 −57

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`bfe6469b`](https://github.com/D1MANYCH/dnd-app/commit/bfe6469b) v3.57.0: feat(spells): CAST-10 — дебаффы чипом на участнике трекера боя

**Файлы (12):**

- `tests/headless.js` +208 −2
- `app-party.js` +204 −0
- `app-spells.js` +83 −10
- `spell-effects.js` +66 −6
- `index.html` +34 −34
- `tests/theme-audit-fixture.html` +43 −0
- `style.css` +36 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `app-combat.js` +4 −0
- `CLAUDE.md` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.56.0"></a>
## v3.56.0 — 19 июля 2026

✨ CAST-9 — повторные тики урона по ходам: заклинания, бьющие каждый раунд («Ведьмин снаряд», «Раскалённый металл», «Пылающий шар», «Божественное оружие», зоны «Духовные стражи»/«Огненная стена»/«Облако смерти»), получают кнопку повтора в шапке трекера боя; остаток концентрации чипом рядом с «Раунд N»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/64bcd45e...66498cd8) · 11 файлов, +475 −69

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`66498cd8`](https://github.com/D1MANYCH/dnd-app/commit/66498cd8) v3.56.0: feat(spells): CAST-9 — повторные тики урона по ходам и концентрация в шапке боя

**Файлы (11):**

- `tests/headless.js` +209 −1
- `app-spells.js` +75 −11
- `spell-effects.js` +58 −16
- `index.html` +36 −34
- `app-party.js` +44 −0
- `tests/theme-audit-fixture.html` +19 −0
- `data.js` +11 −3
- `style.css` +12 −2
- `CHANGELOG.md` +6 −1
- `app-combat.js` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.55.0"></a>
## v3.55.0 — 18 июля 2026

✨ CAST-8 — варианты каста и добивка дескрипторов урона: мини-чузер варианта после выбора ячейки у «Защиты от энергии» (тип урона), «Огненного щита» (тёплый/холодный), «Увеличения/уменьшения» (режим), «Проклятия» (эффект) и «Цветного шарика» (тип урона) — выбор пишется в экземпляр каста и виден в бейдже карточки, сетке эффектов и подписи броска урона; +15 дескрипторов урона (Брызги кислоты, Терновый кнут, Сотворение пламени, Цветной шарик, Руки Хадара, Раскалённый металл, Пылающий шар, Мельфова кислотная стрела, Духовные стражи, Огненная стена, Воображаемый убийца, Небесный огонь, Облако смерти, Распад, Солнечный луч) — таблица 107 ключей; тесты 484 (БЛОК 42)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b8115309...64bcd45e) · 11 файлов, +397 −59

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`64bcd45e`](https://github.com/D1MANYCH/dnd-app/commit/64bcd45e) v3.55.0: feat(spells): CAST-8 — варианты каста и добивка дескрипторов урона

**Файлы (11):**

- `tests/headless.js` +159 −0
- `app-spells.js` +83 −13
- `index.html` +34 −34
- `spell-effects.js` +60 −4
- `tests/theme-audit-fixture.html` +22 −0
- `style.css` +14 −0
- `data.js` +10 −2
- `app-combat.js` +7 −3
- `CHANGELOG.md` +6 −1
- `CLAUDE.md` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.54.0"></a>
## v3.54.0 — 18 июля 2026

✨ CAST-7: боевой цикл до конца — бросок атаки заклинанием (флаг attack, d20 + бонус атаки заклинаний, нат. 1 — промах без урона, нат. 20 — удвоение кубов через critFormula; volley — один бросок на мультилучевой залп; 11 заклинаний-атак, «Ядовитые брызги» атака только в PH24) и применение урона к цели трекера боя (пикер участника после броска, минус ХП в BATTLE_DATA + авто-статус wounded/heavy/dying/dead по шкале % ХП, при halfOnSave — переключатель «полный/половина» с живым превью ХП; вне боя бросок остаётся информационным)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/bd2ac22e...b8115309) · 11 файлов, +432 −62

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`b8115309`](https://github.com/D1MANYCH/dnd-app/commit/b8115309) v3.54.0: feat(spells): CAST-7 — боевой цикл до конца: бросок атаки заклинанием и урон в цель трекера

**Файлы (11):**

- `tests/headless.js` +128 −0
- `app-party.js` +121 −0
- `index.html` +34 −34
- `spell-effects.js` +35 −17
- `app-spells.js` +45 −6
- `style.css` +29 −0
- `tests/theme-audit-fixture.html` +22 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `CLAUDE.md` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.53.0"></a>
## v3.53.0 — 18 июля 2026

✨ CAST-6 — добивка эффектов кастов: +20 карточек EFFECTS_DATA (Щит веры +2 КД через generic-ветку calculateAC, Невидимость, Высшая невидимость, Полёт, Каменная кожа, Защита от энергии, Дубовая кора, Свобода перемещения, Защита от смерти, Огненный щит, Паучье лазание, Тёмное зрение, Видение невидимого, Скороход, Поспешное отступление, Защита от яда, Подводное дыхание, Хождение по воде, Газообразная форма, Увеличение/уменьшение) с маппингом заклинаний в spell-effects.js — таблица 93 ключа; бейдж «Активно · ⏳N рд» на карточке заклинания с живым эффектом каста (ставится при касте, обновляется на месте при тике раундов/снятии/отдыхе без перерисовки списка — updateSpellActiveBadges); spell-effects.js в карте файлов CLAUDE.md

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/fda951ef...bd2ac22e) · 11 файлов, +236 −39

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`bd2ac22e`](https://github.com/D1MANYCH/dnd-app/commit/bd2ac22e) v3.53.0: feat(spells): CAST-6 — добивка эффектов кастов: +20 карточек EFFECTS_DATA (Щит веры +2 КД через generic-ветку calculateAC, Невидимость, Высшая невидимость, Полёт, Каменная кожа, Защита от энергии, Дубовая кора, Свобода перемещения, Защита от смерти, Огненный щит, Паучье лазание, Тёмное зрение, Видение невидимого, Скороход, Поспешное отступление, Защита от яда, Подводное дыхание, Хождение по воде, Газообразная форма, Увеличение/уменьшение) с маппингом заклинаний в spell-effects.js — таблица 93 ключа; бейдж «Активно · ⏳N рд» на карточке заклинания с живым эффектом каста (ставится при касте, обновляется на месте при тике раундов/снятии/отдыхе без перерисовки списка — updateSpellActiveBadges); spell-effects.js в карте файлов CLAUDE.md; тесты 469 (БЛОК 40, 5 шт.)

**Файлы (11):**

- `tests/headless.js` +87 −0
- `index.html` +34 −34
- `app-spells.js` +33 −0
- `data.js` +31 −2
- `spell-effects.js` +24 −0
- `style.css` +15 −0
- `CHANGELOG.md` +6 −1
- `CLAUDE.md` +2 −1
- `app-combat.js` +2 −0
- `sw.js` +1 −1
- `app-party.js` +1 −0

</details>

<a id="v3.52.0"></a>
## v3.52.0 — 18 июля 2026

✨ CAST-5 — призывы от кастов: «Использовать» открывает модалку спутника с предзаполнением (openPrefilledCompanionModal), источники — пикер форм фамильяра, SRD-бестиарий с ленивой загрузкой и статичные префиллы с byLevel-оверрайдами по уровню ячейки (buildCompanionPrefill); конец/смена концентрации и экспирация — тост «существо исчезает», спутник из списка не удаляется; +10 заклинаний-призывов: Поиск скакуна («Потусторонний скакун» PH24 — КД 10+N, ХП 5+10×N, урон 1к8+N от ячейки, полёт с 4+), Призрачный скакун, Невидимый слуга, Восставший труп, Призыв животных/лесных обитателей/малых элементалей/элементаля/феи/небожителя; переработанные в PH24 «Призыв …» без модалки (bySource)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6ee3c4fa...fda951ef) · 9 файлов, +341 −47

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`fda951ef`](https://github.com/D1MANYCH/dnd-app/commit/fda951ef) v3.52.0: feat(spells): CAST-5 — призывы от кастов: «Использовать» открывает модалку спутника с предзаполнением (openPrefilledCompanionModal), источники — пикер форм фамильяра, SRD-бестиарий с ленивой загрузкой и статичные префиллы с byLevel-оверрайдами по уровню ячейки (buildCompanionPrefill); конец/смена концентрации и экспирация — тост «существо исчезает», спутник из списка не удаляется; +10 заклинаний-призывов: Поиск скакуна («Потусторонний скакун» PH24 — КД 10+N, ХП 5+10×N, урон 1к8+N от ячейки, полёт с 4+), Призрачный скакун, Невидимый слуга, Восставший труп, Призыв животных/лесных обитателей/малых элементалей/элементаля/феи/небожителя; переработанные в PH24 «Призыв …» без модалки (bySource)

**Файлы (9):**

- `tests/headless.js` +123 −0
- `spell-effects.js` +106 −4
- `index.html` +34 −34
- `app-spells.js` +37 −3
- `app-ui.js` +16 −0
- `data.js` +11 −3
- `app-combat.js` +7 −1
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.51.0"></a>
## v3.51.0 — 17 июля 2026

✨ CAST-4 — броски урона от кастов: «Использовать» бросает формулу урона 3D-кубами с подписью уровня ячейки, заговоры растут по уровню персонажа (тиры 5/11/17), при спасброске — тост «Спасбросок ЛОВ/ТЕЛ/…, СЛ N, половина при успехе»; чистая damageFormulaFor + 33 заклинания урона с расхождениями редакций через bySource (Нанесение ран, Ведьмин снаряд, Леденящее прикосновение, Злая насмешка, Ядовитые брызги PH24)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/65b380a0...6ee3c4fa) · 7 файлов, +232 −40

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`6ee3c4fa`](https://github.com/D1MANYCH/dnd-app/commit/6ee3c4fa) v3.51.0: feat(spells): CAST-4 — броски урона от кастов: «Использовать» бросает формулу урона 3D-кубами с подписью уровня ячейки, заговоры растут по уровню персонажа (тиры 5/11/17), при спасброске — тост «Спасбросок ЛОВ/ТЕЛ/…, СЛ N, половина при успехе»; чистая damageFormulaFor + 33 заклинания урона с расхождениями редакций через bySource (Нанесение ран, Ведьмин снаряд, Леденящее прикосновение, Злая насмешка, Ядовитые брызги PH24)

**Файлы (7):**

- `spell-effects.js` +84 −2
- `tests/headless.js` +70 −0
- `index.html` +34 −34
- `app-spells.js` +27 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.50.0"></a>
## v3.50.0 — 17 июля 2026

✨ CAST-3 — лечение и временные ХП от кастов: «Использовать» бросает формулу лечения 3D-кубами (апкаст ячейкой + модификатор заклинательной характеристики, плоские без броска — «Полное исцеление») и применяет к ХП; временные ХП по правилу max («Псевдожизнь», «Доспех Агатиса»), «Подмога» +5/ур. к максимуму и текущим ХП с откатом на длинном отдыхе; 10 заклинаний лечения/врем. ХП с формулами обеих редакций (bySource PH14/PH24); универсальный rollFormula поверх арены

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/34df7d03...65b380a0) · 11 файлов, +481 −84

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`65b380a0`](https://github.com/D1MANYCH/dnd-app/commit/65b380a0) v3.50.0: feat(spells): CAST-3 — лечение и временные ХП от кастов: «Использовать» бросает формулу лечения 3D-кубами (апкаст ячейкой + мод. заклинательной характеристики, плоские без броска — «Полное исцеление»), временные ХП по правилу max («Псевдожизнь», «Доспех Агатиса»), «Подмога» +5/ур. к максимуму и текущим ХП с откатом на длинном отдыхе; 10 заклинаний с формулами обеих редакций (bySource PH14/PH24); rollFormula на window; фикс recalculateHP — живые бонусы максимума поверх авто-расчёта

**Файлы (11):**

- `tests/headless.js` +172 −9
- `app-spells.js` +115 −15
- `index.html` +34 −34
- `app-ui.js` +39 −14
- `app-combat.js` +49 −1
- `spell-effects.js` +37 −3
- `app-hp.js` +11 −4
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `tests/headless-node.js` +7 −0
- `sw.js` +1 −1

</details>

<a id="v3.49.0"></a>
## v3.49.0 — 17 июля 2026

✨ CAST-2 — счётчик раундов боя: бейдж «Раунд N» в трекере, смена круга инициативы тикает длительности кастов (минутные эффекты истекают с тостом и гашением концентрации), короткий отдых снимает раундовые/минутные эффекты — часовые переживают, шаг назад откатывает раунд не ниже 1

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/009e7eca...34df7d03) · 11 файлов, +256 −47

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`34df7d03`](https://github.com/D1MANYCH/dnd-app/commit/34df7d03) v3.49.0: feat(combat): CAST-2 — счётчик раундов боя: бейдж «Раунд N» в трекере, смена круга инициативы тикает длительности кастов (минутные эффекты истекают с гашением концентрации), короткий отдых снимает раундовые/минутные эффекты (часовые переживают), шаг назад откатывает раунд не ниже 1

**Файлы (11):**

- `tests/headless.js` +95 −0
- `index.html` +35 −34
- `app-party.js` +53 −5
- `app-combat.js` +23 −0
- `tests/theme-audit-fixture.html` +20 −0
- `data.js` +11 −3
- `app-hp.js` +7 −2
- `CHANGELOG.md` +6 −1
- `app-core.js` +3 −1
- `style.css` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.48.0"></a>
## v3.48.0 — 16 июля 2026

✨ CAST-1 — заклинания вешают эффекты: «Использовать» применяет карточку эффекта (18 заклинаний: Доспехи мага, Ускорение, Благословение, Сглаз, Замедление и др.) и открывает призыв фамильяра; смена/конец концентрации и длинный отдых снимают свои эффекты; ручное снятие карточки синхронно чистит трекер; в сетке эффектов — остаток «⏳ N рд»; фикс: КД больше не задваивается от «Доспеха мага» без брони (13+ЛОВ+3)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/7a3fe577...009e7eca) · 9 файлов, +348 −44

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`009e7eca`](https://github.com/D1MANYCH/dnd-app/commit/009e7eca) v3.48.0: feat(spells): CAST-1 — мост баффов: «Использовать» вешает эффекты (18 заклинаний + фамильяр), снятие по смене/концу концентрации и длинному отдыху, остаток в раундах в сетке эффектов; фикс двойного КД «Доспеха мага» без брони

**Файлы (9):**

- `tests/headless.js` +167 −0
- `index.html` +34 −34
- `app-combat.js` +54 −3
- `app-spells.js` +49 −1
- `spell-effects.js` +23 −2
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `app-hp.js` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.47.0"></a>
## v3.47.0 — 16 июля 2026

🔧 CAST-0 — фундамент механики применения заклинаний: таблица spell-effects.js («заклинание → эффект», хелперы формул и длительностей), поле activeSpellEffects у персонажа (схема 32)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0c50b4fd...7a3fe577) · 8 файлов, +256 −57

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`7a3fe577`](https://github.com/D1MANYCH/dnd-app/commit/7a3fe577) v3.47.0: chore(core): CAST-0 — фундамент механики применения заклинаний (spell-effects.js, activeSpellEffects, схема 32)

**Файлы (8):**

- `tests/headless.js` +112 −19
- `spell-effects.js` +82 −0
- `index.html` +34 −33
- `data.js` +12 −3
- `app-core.js` +7 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.46.0"></a>
## v3.46.0 — 16 июля 2026

✨ Вкладка заклинаний: кнопка «Использовать» — заговор без ячейки, уровневое заклинание тратит ячейку с выбором уровня при апкасте (учёт пакт-ячеек колдуна), для prep-классов только подготовленные, авто-концентрация; фикс: ряд кнопок карточки заклинания переносится на телефоне (кнопка «Подготовить» обрезалась)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ecda84ed...0c50b4fd) · 8 файлов, +302 −40

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`0c50b4fd`](https://github.com/D1MANYCH/dnd-app/commit/0c50b4fd) v3.46.0: feat(spells): кнопка «Использовать» в карточке заклинания — трата ячейки с выбором уровня; фикс обрезанных кнопок на телефоне

**Файлы (8):**

- `app-spells.js` +106 −0
- `tests/headless.js` +77 −0
- `index.html` +41 −33
- `style.css` +44 −2
- `tests/theme-audit-fixture.html` +16 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.45.0"></a>
## v3.45.0 — 13 июля 2026

✨ E24-1 — правила и состояния редакции 2024: CONDITIONS_2024 (истощение единым счётчиком −2×степень/−5 фт, смерть на 6; переписаны состояния), вкладка Бой по редакции персонажа, «Героическое вдохновение», глоссарий и справка edition-aware

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c81a19b2...ecda84ed) · 11 файлов, +312 −75

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`ecda84ed`](https://github.com/D1MANYCH/dnd-app/commit/ecda84ed) v3.45.0: feat(core): E24-1 — правила и состояния редакции 2024

**Файлы (11):**

- `index.html` +64 −33
- `tests/headless.js` +86 −5
- `app-core.js` +44 −26
- `data-2024.js` +42 −2
- `app-combat.js` +31 −3
- `glossary-data.js` +24 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `app-party.js` +3 −1
- `app-help.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.44.2"></a>
## v3.44.2 — 13 июля 2026

🐛 Окно последнего броска (лента вне модалки, #quick-roll-strip) переоформлено: вместо безымянной пилюли — карточка с заголовком «Последний бросок», крупным чипом последнего результата (метка + число) и рядом компактных чипов недавних бросков; крит (нат.20) зелёным, провал (нат.1) красным в обеих темах. Фикс: чипы-кнопки наследовали глобальный button{width:100%} и первый растягивался на всю ширину, выталкивая остальные в overflow — добавлен сброс width:auto.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4a8e5d34...c81a19b2) · 5 файлов, +99 −64

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`c81a19b2`](https://github.com/D1MANYCH/dnd-app/commit/c81a19b2) v3.44.2: fix(ui): окно последнего броска — карточка с заголовком «Последний бросок» вместо безымянной пилюли

**Файлы (5):**

- `index.html` +41 −37
- `style.css` +41 −23
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.44.1"></a>
## v3.44.1 — 13 июля 2026

🐛 Свёрнутая карточка заклинания на телефоне: возвращена подпись школы рядом с цветной иконкой (пряталась с UI5-5, но ряд бейджей теперь на отдельной строке под именем — место есть), иконки классов 20→22px, ряд бейджей переносится при переполнении. Модалка кубиков на ПК: 9 чипов формулы (6 костей + 3 оператора) в один ряд равной ширины вместо переноса ⌫ на вторую строку; кнопка × стала кругом 36×36 (был эллипс 40×36 — базовый .modal-close задавал min-width:40px, а dice-правило переопределяло только width). Счётчик «Подготовлено» у паладина: подсказка «ХАР + ½ ур.» вместо «ХАР + ур.» (паладин готовит мод + половину уровня по PHB 2014; сам расчёт был верным).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/efd9aa6f...4a8e5d34) · 6 файлов, +82 −49

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`4a8e5d34`](https://github.com/D1MANYCH/dnd-app/commit/4a8e5d34) v3.44.1: fix(ui): подпись школы в свёрнутой карточке заклинания на телефоне; чипы формулы кубиков в один ряд + круглая кнопка × на ПК; подсказка подготовки паладина «½ ур.»

**Файлы (6):**

- `index.html` +33 −33
- `style.css` +27 −10
- `data.js` +10 −2
- `app-spells.js` +5 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.44.0"></a>
## v3.44.0 — 13 июля 2026

✨ E24-0 (фундамент редакции 2024): редакция стала свойством персонажа — char.edition '2014'|'2024'. Реестр EDITION_DATA + резолвер edData(char) с ленивой сборкой набора 2014 (обход порядка загрузки: CLASS_CHOICES/SUBCLASS_CHOICES грузятся после data.js); registerEdition2024() наполняет '2024' в будущих фазах, call-sites переводятся на edData по мере расхождения таблиц. Миграция schema 30→31: существующим персонажам edition='2014'. Тумблер редакции на главной = редакция по умолчанию для новых персонажей; выбор 2024 за dev-флагом localStorage.dnd_e24_beta='1' (без флага кнопка «в разработке»). Бейдж «2024» в списке и шапке листа (только для 2024-персонажей). Скелет data-2024.js (lazy, ensureEdition2024) — в E24-0 '2024' ≡ '2014'. Тесты 411 (БЛОК 32).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/595696ec...efd9aa6f) · 10 файлов, +410 −64

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`efd9aa6f`](https://github.com/D1MANYCH/dnd-app/commit/efd9aa6f) v3.44.0: feat(core): E24-0 — фундамент редакции 2024 (char.edition, EDITION_DATA/edData, тумблер за dev-флагом)

**Файлы (10):**

- `tests/headless.js` +137 −18
- `data.js` +86 −3
- `index.html` +43 −32
- `app-ui.js` +33 −9
- `app-core.js` +40 −0
- `data-2024.js` +39 −0
- `style.css` +23 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.43.10"></a>
## v3.43.10 — 13 июля 2026

🐛 Дозаполнены панели доп-заклинаний ещё 3 подклассов в SUBCLASS_RESOURCES (источник dnd.su, имена сверены с spells.js PH14): Клятва смотрителя (Tasha's — 3/5/9/13/17), Договор с Гением (Tasha's — общий список + добавки видов Дао/Джинн/Ифрит/Марид по кругам 1–5), Договор с Безгласным (Van Richten's — круги 1–5). Теперь панели заклинаний есть у всех клятв паладина и всех покровителей колдуна.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/93be9459...595696ec) · 192 файлов, +102 −7084

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9040f3a6`](https://github.com/D1MANYCH/dnd-app/commit/9040f3a6) chore(docs): убрать внутренние рабочие материалы из репозитория и Pages-деплоя
- [`595696ec`](https://github.com/D1MANYCH/dnd-app/commit/595696ec) v3.43.10: fix(content): панели доп-заклинаний ещё 3 подклассов (Смотритель/Гений/Безгласный)

**Файлы (192):**

- `docs/spell-audit/_L3_progress.md` +0 −390
- `docs/marketing/expanded-channels.md` +0 −263
- `docs/marketing/seeding-plan.md` +0 −239
- `docs/marketing/promo/gen_promo.py` +0 −220
- `docs/spell-audit/_L5_progress.md` +0 −218
- `docs/marketing/first-week-posts.md` +0 −209
- `docs/spell-audit/_L2_progress.md` +0 −202
- `docs/naming-audit.md` +0 −170
- `docs/phases/req-5f-mechanical.md` +0 −165
- `docs/spell-audit/L_XEDITION.md` +0 −153
- `docs/phases/req-5e-class-features.md` +0 −147
- `docs/spell-audit/_L1_progress.md` +0 −125
- `docs/marketing/listings-kit.md` +0 −123
- `docs/spell-audit/L0_PH24.md` +0 −116
- `docs/marketing/seeding-targets.md` +0 −115
- `docs/spell-audit/_L7_progress.md` +0 −108
- `docs/spell-audit/L0_PILOT.md` +0 −103
- `docs/spell-audit/L0_PH14.md` +0 −100
- `docs/marketing/promo/preview.html` +0 −98
- `docs/spell-audit/README.md` +0 −98
- `docs/marketing/README.md` +0 −96
- `docs/css-usage-report.md` +0 −92
- `docs/marketing/promo/post-dtf-vc.md` +0 −79
- `docs/phases/req-5b-spells.md` +0 −74
- `docs/marketing/group-content.md` +0 −71
- `docs/spell-audit/L2_PH24.md` +0 −69
- `docs/spell-audit/_L6_progress.md` +0 −66
- `index.html` +32 −32
- `docs/marketing/posts/94-mechanics-wizard.txt` +0 −60
- `docs/spell-audit/L1_PH24.md` +0 −49
- `docs/spell-audit/L2_PH14.md` +0 −49
- `subclass-choices-data.js` +45 −0
- `docs/spell-audit/L4_PH24.md` +0 −43
- `docs/marketing/promo/README.md` +0 −41
- `docs/spell-audit/L1_PH14.md` +0 −41
- `docs/spell-audit/L3_PH24.md` +0 −38
- `docs/spell-audit/L4_PH14.md` +0 −37
- `docs/spell-audit/L5_PH24.md` +0 −36
- `docs/marketing/posts/91-mechanics-rogue.txt` +0 −35
- `docs/marketing/posts/90-mechanics-paladin-ranger.txt` +0 −34
- …и ещё 152 файлов — см. полный патч

</details>

<a id="v3.43.9"></a>
## v3.43.9 — 12 июля 2026

🐛 Плут: «Компетентность» перенесена с 3 на 1 уровень (PHB 2014: экспертиза на 1 и 6) — фича теперь показывается на 1 ур. в «Плане класса» и level-up, синхронно с пикером экспертизы (был minLevel 1). Добавлена панель доп-заклинаний подкласса «Клятва нарушителя» (Отступник, DMG 2014) в SUBCLASS_RESOURCES (5 уровней, эталон PHantom). Косметика: убран дубль «Избранный враг +1» в desc «Исчезновения» Следопыта; поправлены смещённые секц-комментарии в subclass-choices-data.js.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/94ee5dea...93be9459) · 6 файлов, +81 −41

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`fd91ca38`](https://github.com/D1MANYCH/dnd-app/commit/fd91ca38) chore(docs): релиз-пост 130 (v3.43.8 — HP-чип светлой темы по состоянию)
- [`93be9459`](https://github.com/D1MANYCH/dnd-app/commit/93be9459) v3.43.9: fix(ui): классовые умения 2014 — Плут «Компетентность» на 1 ур. + панель заклинаний Клятвы нарушителя

**Файлы (6):**

- `index.html` +32 −32
- `subclass-choices-data.js` +17 −2
- `data.js` +13 −5
- `docs/marketing/posts/130-light-hp-chip-states.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.43.8"></a>
## v3.43.8 — 12 июля 2026

🐛 светлая тема — HP-чип статус-бара отражает состояние ok/low/critical (как тёмная): 3 per-state light-правила вместо плоского красного, low-янтарь #8a6510 (5.07:1 на light bg-1), ok=--success, critical=--danger. Ратчет-базы подняты +5 хардкодов/+6 !important (1025/159) — документированный осадок пост-финала THEME.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4b3cd049...94ee5dea) · 7 файлов, +80 −41

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f9a39d26`](https://github.com/D1MANYCH/dnd-app/commit/f9a39d26) chore(docs): релиз-пост 129 (v3.43.7 — светлая тема до WCAG 4.5)
- [`94ee5dea`](https://github.com/D1MANYCH/dnd-app/commit/94ee5dea) v3.43.8: fix(ui): светлая тема — HP-чип статус-бара отражает состояние ok/low/critical (как тёмная): три per-state light-правила вместо плоского красного, low-янтарь #8a6510 (5.07:1 на light bg-1), ok=--success (4.78), critical=--danger (4.98). Нужен !important — перебивает нейтральный .status-chip; тёмная база не тронута. Ратчет-базы подняты +5 хардкодов/+6 !important (1025/159) — документированный осадок пост-финала THEME.

**Файлы (7):**

- `index.html` +32 −32
- `style.css` +14 −1
- `data.js` +11 −3
- `docs/marketing/posts/129-light-theme-wcag.txt` +13 −0
- `CHANGELOG.md` +6 −1
- `tools/theme-baseline.json` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.43.7"></a>
## v3.43.7 — 11 июля 2026

🐛 светлая тема — вторичный текст, семантика и школы магии до контраста WCAG 4.5 (THEME-6, финал плана тем): в light+auto-блоках затемнены --text-mute #898b94→#67686f (2.95→4.8:1 на кремовом фоне), --success #2e8a54→#2a7e4c (4.11→4.84), --necro/--divin/--charm (3.9–4.5→4.8); тон сохранён, тёмная палитра не тронута. Пороги в theme-contrast-pairs.json подняты min→4.5 (сняты minLight/target), все текстовые пары обеих тем ≥4.5; акценты оставлены на large-text AA 3.0 (--on-accent красит крупные метки на заливке). Базлайны хардкодов 1020 цветов / 153 light-!important зафиксированы как документированный осадок; verify-ui пополнен приёмами контраст-пробы и свотч-проверки. План THEME закрыт (6/6).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/a05fa68f...4b3cd049) · 9 файлов, +107 −60

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b0ac9d2f`](https://github.com/D1MANYCH/dnd-app/commit/b0ac9d2f) chore(docs): релиз-пост 128 (v3.43.6 — токенизация фичевых зон)
- [`4b3cd049`](https://github.com/D1MANYCH/dnd-app/commit/4b3cd049) v3.43.7: fix(ui): светлая тема до WCAG 4.5 (THEME-6, финал плана тем) — в light+auto-блоках затемнены --text-mute #898b94→#67686f (2.95→4.8:1 на cream), --success →#2a7e4c (4.11→4.84), --necro/--divin/--charm (3.9–4.5→4.8); тон сохранён, тёмная палитра не тронута. Пороги theme-contrast-pairs.json подняты min→4.5 (сняты minLight/target) — все текстовые пары обеих тем ≥4.5; акценты оставлены на large-text AA 3.0 (--on-accent красит крупные метки на заливке). Базлайны 1020 цветов / 153 light-!important зафиксированы как документированный осадок. verify-ui +3 приёма (контраст-проба через экспорты check-theme.js, свотч-страница надёжнее app для цвет-токенов, live setProperty A/B). План THEME закрыт (6/6).

**Файлы (9):**

- `index.html` +32 −32
- `tools/theme-contrast-pairs.json` +13 −14
- `style.css` +11 −9
- `.claude/skills/verify-ui/SKILL.md` +19 −0
- `docs/marketing/posts/128-tokenize-feature-zones.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1
- `tools/theme-baseline.json` +1 −1

</details>

<a id="v3.43.6"></a>
## v3.43.6 — 11 июля 2026

🐛 токенизация фичевых зон (THEME-5) — журнал/заметки (.journal-entry/.notes-entry-card+pinned/.notes-entry-btn/.filter-chip), кластер фильтра классов заклинаний (.class-filter-*/.edition-btn/.version-btn/легенда/свой-чужой), build-picker и гайды билдов (diff-цвета/pro-con/шкала сложности) переведены на компонентные токены --pin-bg/--pin-edge, --cf-wrap/group/btn/legend, --cf-own-*/--cf-foreign-*, --pro-color/--con-color/--diff-1/2/3 в 3 блоках dark/light/auto; яд/болезнь получили светлые варианты (--poison-color/--disease-color), сняты из PARITY_DARK_ONLY; удалены мёртвые light-!important-переопределения. Хардкоды 1081 в 1020, light-!important 193 в 153, ratchet-база опущена. Исправлены битые комментарии THEME-4 (opt и res-tag закрывали комментарий досрочно), из-за которых в v3.43.5 молча выпадали правила select option/optgroup и сопротивлений. Чекер тем 4/4 зелёный, node 399/399

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3bbe1343...a05fa68f) · 9 файлов, +181 −181

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`8f39f9f2`](https://github.com/D1MANYCH/dnd-app/commit/8f39f9f2) chore(docs): релиз-пост 127 (v3.43.5 — токенизация базового хрома)
- [`a05fa68f`](https://github.com/D1MANYCH/dnd-app/commit/a05fa68f) v3.43.6: fix(ui): токенизация фичевых зон (THEME-5) — журнал/заметки (.journal-entry/.notes-entry-card+pinned/.notes-entry-btn/.filter-chip), кластер фильтра классов заклинаний (.class-filter-*/.edition-btn/.version-btn/легенда/свой-чужой), build-picker и гайды билдов (diff-цвета/pro-con/шкала сложности) переведены на компонентные токены --pin-bg/--pin-edge, --cf-wrap/group/btn/legend, --cf-own-*/--cf-foreign-*, --pro-color/--con-color/--diff-1/2/3 в 3 блоках dark/light/auto; яд/болезнь получили светлые варианты (--poison-color/--disease-color), сняты из PARITY_DARK_ONLY; удалены мёртвые light-!important журнала и фильтра классов. Хардкоды 1081→1020, light-!important 193→153, ratchet-база опущена.

**Файлы (9):**

- `style.css` +104 −141
- `index.html` +32 −32
- `docs/marketing/posts/127-tokenize-base-chrome.txt` +14 −0
- `data.js` +10 −2
- `.claude/skills/verify-ui/SKILL.md` +11 −0
- `CHANGELOG.md` +6 −1
- `tools/theme-baseline.json` +2 −2
- `tools/check-theme.js` +1 −2
- `sw.js` +1 −1

</details>

<a id="v3.43.5"></a>
## v3.43.5 — 11 июля 2026

🐛 токенизация базового хрома (THEME-4) — select-попап, сопротивления, пилюли-фильтры (jfilter/notes-pill), строки боя/трекера, чипы главной (sort/edition) переведены на компонентные токены --opt-*/--res-*/--chip-bg/--list-solid*/--accent-fill (заведены в 3 блоках dark/light/auto); удалены ставшие мёртвыми light-!important; хардкоды 1177 в 1081 цветов и 266 в 193 !important; ratchet-база опущена; чекер тем зелёный, node 399/399

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/bdc305bb...3bbe1343) · 7 файлов, +158 −233

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`d4d2cf7b`](https://github.com/D1MANYCH/dnd-app/commit/d4d2cf7b) chore(docs): релиз-пост 126 (v3.43.4 — ревизия тёмной темы)
- [`3bbe1343`](https://github.com/D1MANYCH/dnd-app/commit/3bbe1343) v3.43.5: fix(ui): токенизация базового хрома (THEME-4) — select-попап, сопротивления, пилюли-фильтры (jfilter/notes-pill), строки боя/трекера, чипы главной (sort/edition) переведены на компонентные токены --opt-*/--res-*/--chip-bg/--list-solid*/--accent-fill в 3 блоках dark/light/auto; сняты дубли и мёртвые light-!important; хардкоды 1177→1081 цветов и 266→193 !important; ratchet-база опущена; чекер тем зелёный, node 399/399

**Файлы (7):**

- `style.css` +92 −195
- `index.html` +32 −32
- `docs/marketing/posts/126-dark-theme-revision.txt` +15 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `tools/theme-baseline.json` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.43.4"></a>
## v3.43.4 — 11 июля 2026

🐛 Тёмная тема (THEME-3): вторичный текст ярче (--text-dim #c9d2e8, --text-mute #a8b2cb), границы и блик карточек заметнее (0.16/0.10), дефолт непрозрачности стекла 60%→66%; пороги WCAG-чекера ужесточены (minDark), фикстура аудита тем tests/theme-audit-fixture.html

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c9210d7d...bdc305bb) · 10 файлов, +178 −66

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ba0ff98f`](https://github.com/D1MANYCH/dnd-app/commit/ba0ff98f) chore(docs): релиз-пост 125 (v3.43.3 — автопроверки тем)
- [`bdc305bb`](https://github.com/D1MANYCH/dnd-app/commit/bdc305bb) v3.43.4: fix(ui): тёмная тема (THEME-3) — вторичный текст ярче (--text-dim #c9d2e8, --text-mute #a8b2cb), границы/блик карточек 0.16/0.10, дефолт стекла 60%→66% (style.css+app-ui+index синхронно); пороги WCAG-чекера залочены (minDark); фикстура tests/theme-audit-fixture.html

**Файлы (10):**

- `tests/theme-audit-fixture.html` +80 −0
- `index.html` +35 −35
- `tools/theme-contrast-pairs.json` +19 −19
- `style.css` +9 −6
- `data.js` +10 −2
- `docs/marketing/posts/125-theme-autochecks.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `.claude/skills/verify-ui/SKILL.md` +5 −1
- `app-ui.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.43.3"></a>
## v3.43.3 — 11 июля 2026

🐛 Автопроверки тем: tools/check-theme.js (синхрон light/auto-блоков, паритет dark↔light, WCAG-контраст, ratchet хардкодов) в CI и PostToolUse-hook; фикс дрейфа auto-блока — 8 токенов категорий предметов (--weapon-color…--highlight-color)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f809e372...c9210d7d) · 12 файлов, +810 −40

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9e57ac32`](https://github.com/D1MANYCH/dnd-app/commit/9e57ac32) chore(docs): релиз-пост 124 (v3.43.2 — фикс подсветки тура)
- [`c9210d7d`](https://github.com/D1MANYCH/dnd-app/commit/c9210d7d) v3.43.3: fix(ui): автопроверки тем — tools/check-theme.js (синхрон light/auto-блоков, паритет dark↔light, WCAG-контраст 48 пар, ratchet хардкодов) в CI; фикс дрейфа auto-блока — 8 токенов категорий предметов

**Файлы (12):**

- `tools/check-theme.js` +678 −0
- `index.html` +32 −32
- `tools/theme-contrast-pairs.json` +34 −0
- `.claude/skills/verify-ui/SKILL.md` +20 −1
- `data.js` +11 −3
- `docs/marketing/posts/124-tour-spotlight-fix.txt` +13 −0
- `CHANGELOG.md` +6 −1
- `CLAUDE.md` +3 −2
- `style.css` +5 −0
- `tools/theme-baseline.json` +5 −0
- `.github/workflows/tests.yml` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.43.2"></a>
## v3.43.2 — 10 июля 2026

🐛 Тур: панели затемнения стыкуются без швов (тёмные полосы на светлой теме), вырез подсветки скруглён угловыми заплатками, затемнение светлой темы 0.55→0.5

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/46135376...f809e372) · 12 файлов, +312 −55

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`f809e372`](https://github.com/D1MANYCH/dnd-app/commit/f809e372) v3.43.2: fix(ui): тур — панели затемнения стыкуются без швов (тёмные полосы на светлой теме), вырез подсветки скруглён угловыми заплатками, затемнение светлой темы 0.55→0.5

**Файлы (12):**

- `app-help.js` +86 −16
- `tests/headless.js` +65 −0
- `index.html` +32 −32
- `tests/tour-fixture.html` +53 −0
- `style.css` +21 −2
- `.claude/skills/tours/SKILL.md` +21 −0
- `.claude/skills/verify-ui/SKILL.md` +14 −1
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1
- `tests/runner.html` +2 −0
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.43.1"></a>
## v3.43.1 — 10 июля 2026

🐛 Светлая тема: исправлено окно «Что нового» (оставались цвета тёмной темы), усилено затемнение подсветки в турах обучения, карточка шага тура не уходит за край экрана

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3f7c6653...46135376) · 7 файлов, +98 −39

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ebcfb8fd`](https://github.com/D1MANYCH/dnd-app/commit/ebcfb8fd) chore(docs): релиз-пост 123 (v3.43.0 — редизайн «Дымка»)
- [`46135376`](https://github.com/D1MANYCH/dnd-app/commit/46135376) v3.43.1: fix(ui): светлая тема — окно «Что нового» на токенах темы, затемнение подсветки туров (--tour-dim 0.55), страховочный кламп карточки шага тура в экран

**Файлы (7):**

- `index.html` +32 −32
- `style.css` +21 −3
- `docs/marketing/posts/123-dymka-redesign.txt` +17 −0
- `data.js` +10 −2
- `app-help.js` +11 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.43.0"></a>
## v3.43.0 — 10 июля 2026

✨ Редизайн «Дымка»: космический фон с настройкой (выкл/тихий/живой), новые темы (глубокий космос / молочное стекло), трёхуровневое стекло, система движения (модалки bottom-sheet на телефоне, stagger-списки, HP-след урона), SVG-иконки школ и состояний вместо эмодзи, обновлённые тур и приветствие, плотный десктоп (rail с ячейками, сетка персонажей до 4 колонок)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/406a8c41...3f7c6653) · 20 файлов, +1487 −936

<details><summary>Коммиты и файлы</summary>

**Коммиты (13):**

- [`b186e777`](https://github.com/D1MANYCH/dnd-app/commit/b186e777) chore(docs): релиз-пост 122 (v3.42.0 — светлая тема, арена, 3D-кость)
- [`ffaf90c1`](https://github.com/D1MANYCH/dnd-app/commit/ffaf90c1) feat(ui): Дымка v5 — новые токены тем (космос тёмная / молочное стекло светлая), система движения t1/t2/t3
- [`f2792e07`](https://github.com/D1MANYCH/dnd-app/commit/f2792e07) feat(ui): Дымка v5 — космос-фон bg-space.js вместо bg-orbits, настройка «Космос на фоне» (выкл/тихий/живой)
- [`73748556`](https://github.com/D1MANYCH/dnd-app/commit/73748556) feat(ui): Дымка v5 — иерархия стекла: хром/карточки(блик)/поповеры (surface-pop+pop-blur), радиусы 18/26/14, primary-кнопки градиентом
- [`3d403499`](https://github.com/D1MANYCH/dnd-app/commit/3d403499) feat(ui): Дымка v5 — система движения: модалки/шторки t3+пружина, bottom-sheet на телефоне, .closing-анимация, stagger-списки, HP-ghost след урона
- [`8de533bc`](https://github.com/D1MANYCH/dnd-app/commit/8de533bc) feat(ui): Дымка v5 — SVG-иконки icons.js: школы магии тонированными бейджами, чипы состояний, cond-dot в трекере боя, навигация/статус-бар без эмодзи
- [`38e2fb9f`](https://github.com/D1MANYCH/dnd-app/commit/38e2fb9f) feat(ui): Дымка v5 — тур: скруглённый ring со свечением, маски внахлёст 1px, перелёт между шагами, коуч с точками-прогрессом; приветствие: марка+фичи → «С чего начнём?» (билд/с нуля/импорт)
- [`ec8ed41f`](https://github.com/D1MANYCH/dnd-app/commit/ec8ed41f) feat(ui): Дымка v5 — плотность ПК: rail 296px (крупное ХП ±1/±5, ячейки полосками, 6 кубиков), сетка персонажей 2/3/4 колонки (620/1000/1560), пропорции листа 8/4, таб-бар «Магия/Сумка»
- [`6b7512cb`](https://github.com/D1MANYCH/dnd-app/commit/6b7512cb) fix(ui): Дымка v5, фидбек: центр космоса по вьюпорту (не по body), яркость орбит +50%, глобальная дымка 1/3 слайдера, ячейки заклинаний в стиле стекла, отступ под строкой редакции, максимум 3 колонки персонажей, лист шире на ≥1600px
- [`29110f94`](https://github.com/D1MANYCH/dnd-app/commit/29110f94) fix(ui): Дымка v5, фидбек 2: детализация космоса ×1.6 (звёзды/пыль/туманности/кометы), тур из приветствия учитывает открытый лист
- [`f27114f9`](https://github.com/D1MANYCH/dnd-app/commit/f27114f9) fix(ui): ячейки заклинаний — свободные всегда золотые (токены --slot-gold, не акцент класса), потраченные — серые бусины; фикс «зеркального» прочтения при цветных акцентах
- [`db696799`](https://github.com/D1MANYCH/dnd-app/commit/db696799) fix(ui): ячейки — круглые золотые бусины слева направо (свободные слева, как в образце), клик тратит/возвращает одну; плашка последнего броска — стекло-поповер с крупным золотым результатом
- [`3f7c6653`](https://github.com/D1MANYCH/dnd-app/commit/3f7c6653) v3.43.0: feat(ui): редизайн «Дымка» — космос-фон с настройкой, тёмная/светлая темы на новых токенах, трёхуровневое стекло, система движения, SVG-иконки школ и состояний, обновлённые тур и приветствие, плотный десктоп

**Файлы (20):**

- `style.css` +538 −228
- `bg-orbits.js` +0 −526
- `bg-space.js` +334 −15
- `index.html` +121 −112
- `icons.js` +142 −0
- `app-help.js` +70 −21
- `app-ui.js` +84 −5
- `app-desktop.js` +70 −4
- `app-core.js` +44 −4
- `app-spells.js` +17 −7
- `docs/marketing/posts/122-light-theme-polish.txt` +16 −0
- `app-party.js` +15 −0
- `data.js` +11 −3
- `app-combat.js` +6 −4
- `CHANGELOG.md` +6 −1
- `app-hp.js` +5 −0
- `app-inventory.js` +3 −2
- `sw.js` +3 −2
- `docs/ARCHITECTURE.md` +1 −1
- `manifest.json` +1 −1

</details>

<a id="v3.42.0"></a>
## v3.42.0 — 9 июля 2026

🐛 светлая тема: бледный/невидимый текст переведён на токены по всем экранам (лист, бой, журнал, черты, заметки, изменения); светлые палитры арены броска (3 фона) — кость и результат читаемы; тёмная подложка под иконки классов; единый стиль карточек секций листа (умения/условия/эффекты/сопротивления); панель предыстории и безделушка во всю ширину; фикс невидимой 3D-кости (WebGL-буфер 0×0 → мгновенное пересоздание); авто-туры ждут закрытия модалок (гайд билда)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/16b3e6a6...406a8c41) · 11 файлов, +405 −169

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`6011da12`](https://github.com/D1MANYCH/dnd-app/commit/6011da12) chore(docs): релиз-пост 121 (v3.41.2 — покрытие автотестами)
- [`406a8c41`](https://github.com/D1MANYCH/dnd-app/commit/406a8c41) v3.42.0: fix(ui): светлая тема — читаемость и единый стиль листа, светлая арена броска, фикс невидимой 3D-кости, авто-туры не стартуют поверх модалок

**Файлы (11):**

- `style.css` +197 −120
- `index.html` +31 −31
- `app-ui.js` +47 −4
- `dice-arena-bg.js` +41 −5
- `app-help.js` +36 −3
- `data.js` +11 −3
- `.claude/skills/verify-ui/SKILL.md` +12 −1
- `docs/marketing/posts/121-headless-test-coverage.txt` +12 −0
- `.claude/skills/tours/SKILL.md` +11 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.41.2"></a>
## v3.41.2 — 8 июля 2026

🔧 тесты: покрытие headless непокрытых модулей — app-log (кольцевой буфер 600, newId, exportText, fmtTime), app-notes (markdown-парсер, реордер закреплённых, CRUD/экспорт заметок), history-stack (слои back-навигации), app-backup (smoke), quickRoll-edge, id участников боя; node 375→394

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/930884c2...16b3e6a6) · 7 файлов, +345 −35

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`07b6cdeb`](https://github.com/D1MANYCH/dnd-app/commit/07b6cdeb) chore(docs): релиз-пост 120 (v3.41.1 — чистка: Мистический ловкач, заметки, логи)
- [`16b3e6a6`](https://github.com/D1MANYCH/dnd-app/commit/16b3e6a6) v3.41.2: chore(test): покрытие headless непокрытых модулей — app-log/app-notes/history-stack/app-backup

**Файлы (7):**

- `tests/headless.js` +258 −0
- `index.html` +31 −31
- `tests/headless-node.js` +26 −0
- `docs/marketing/posts/120-cleanup-rogue-notes.txt` +13 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.41.1"></a>
## v3.41.1 — 8 июля 2026

🐛 чистка: подкласс «Мошенник» (внекнижный дубль) удалён с миграцией сейвов в «Мистический ловкач»; legacy-поля заметок (notes/features/appearance/magicItems) убраны из схемы — единый источник notesV2; диагностические логи дайса скрыты за флагом DND_DEBUG; удалена мёртвая функция getEffectIcon

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4ddaca26...930884c2) · 11 файлов, +229 −134

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`0e0441ab`](https://github.com/D1MANYCH/dnd-app/commit/0e0441ab) chore(docs): релиз-пост 119 (v3.41.0 — божества и планы)
- [`930884c2`](https://github.com/D1MANYCH/dnd-app/commit/930884c2) v3.41.1: fix(core): чистка — миграция «Мошенник»→«Мистический ловкач», legacy notes, debug-логи дайса

**Файлы (11):**

- `tests/headless.js` +105 −15
- `index.html` +31 −39
- `app-core.js` +31 −11
- `app-notes.js` +11 −21
- `data.js` +15 −17
- `app-pdf.js` +4 −21
- `app-ui.js` +10 −3
- `docs/marketing/posts/119-deities-planes.txt` +13 −0
- `app-combat.js` +2 −5
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.41.0"></a>
## v3.41.0 — 7 июля 2026

✨ божества (Приложение Б PHB) — поле «Божество» с подсказками (61 бог: Фаэрун + нечеловеческие) + раздел справки «Планы существования»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/dc0f89db...4ddaca26) · 10 файлов, +269 −35

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`c56cd6cb`](https://github.com/D1MANYCH/dnd-app/commit/c56cd6cb) chore(docs): релиз-пост 118 (v3.40.0 — безделушки к100 и транспорт)
- [`4ddaca26`](https://github.com/D1MANYCH/dnd-app/commit/4ddaca26) v3.41.0: feat(sheet): божества (Приложение Б PHB) + раздел справки «Планы существования»

**Файлы (10):**

- `index.html` +68 −31
- `data.js` +88 −2
- `tests/headless.js` +71 −0
- `app-ui.js` +17 −0
- `docs/marketing/posts/118-trinkets-transport.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `app-core.js` +2 −0
- `sw.js` +1 −1
- `app-combat.js` +1 −0
- `app-pdf.js` +1 −0

</details>

<a id="v3.40.0"></a>
## v3.40.0 — 7 июля 2026

✨ Безделушки к100: кнопка на карточке персонажа бросает по таблице PHB (100 позиций) и кладёт предмет в инвентарь. Каталог снаряжения пополнен транспортом и ездовыми (25 позиций: скакуны, сёдла, повозки, наземные и водные суда).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/40cceb9f...dc0f89db) · 9 файлов, +310 −52

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f165b9e3`](https://github.com/D1MANYCH/dnd-app/commit/f165b9e3) chore(docs): релиз-пост 117 (v3.39.0 — заряды предметов)
- [`dc0f89db`](https://github.com/D1MANYCH/dnd-app/commit/dc0f89db) v3.40.0: feat(inventory): безделушки к100 + транспорт/ездовые в каталоге снаряжения

**Файлы (9):**

- `gear-catalog.js` +150 −10
- `index.html` +38 −31
- `app-inventory.js` +39 −3
- `tests/headless.js` +33 −4
- `style.css` +19 −0
- `docs/marketing/posts/117-item-charges.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.39.0"></a>
## v3.39.0 — 7 июля 2026

✨ заряды предметов: поля тек./макс. зарядов и режим восстановления в модалке; бейдж «⚡ N/M» и кнопки −/+ в списке; длинный отдых восполняет заряды (кроме «не восст.»); каталог предзаполняет заряды палочек/посохов/жезлов (восстановление полное — упрощение против 1к6+N)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/58f87d3f...40cceb9f) · 11 файлов, +292 −56

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9f05bf1e`](https://github.com/D1MANYCH/dnd-app/commit/9f05bf1e) chore(docs): релиз-пост 116 (v3.38.0 — спасбросок концентрации при уроне)
- [`40cceb9f`](https://github.com/D1MANYCH/dnd-app/commit/40cceb9f) v3.39.0: feat(inventory): заряды предметов — счётчик ± и восстановление на отдыхе

**Файлы (11):**

- `tests/headless.js` +82 −0
- `index.html` +41 −31
- `app-inventory.js` +65 −0
- `magic-items.js` +20 −18
- `style.css` +29 −1
- `app-hp.js` +23 −2
- `docs/marketing/posts/116-concentration-save.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.38.0"></a>
## v3.38.0 — 7 июля 2026

✨ Спасбросок концентрации при уроне: модалка подтверждения + настоящий 3D-бросок (СЛ max(10, урон/2), владение спасом ТЕЛ учитывается, черта «Боевой маг» даёт преимущество); при 0 ХП — авто-срыв без броска

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b69ae35f...58f87d3f) · 8 файлов, +166 −51

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`39916e59`](https://github.com/D1MANYCH/dnd-app/commit/39916e59) chore(docs): релиз-пост 115 (v3.37.0 — настройка магпредметов и лимит 3)
- [`58f87d3f`](https://github.com/D1MANYCH/dnd-app/commit/58f87d3f) v3.38.0: feat(combat): спасбросок концентрации при уроне — модалка + 3D-бросок

**Файлы (8):**

- `app-hp.js` +49 −16
- `index.html` +31 −31
- `tests/headless.js` +52 −0
- `docs/marketing/posts/115-attunement.txt` +13 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `app-ui.js` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.37.0"></a>
## v3.37.0 — 7 июля 2026

✨ настройка магпредметов (лимит 3): флаг «требует настройки» у предмета + из каталога, кнопка настройки в списке, счётчик ⚙ N/3 в шапке с предупреждением при превышении

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6a46f5fc...b69ae35f) · 8 файлов, +235 −35

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`2fc898d7`](https://github.com/D1MANYCH/dnd-app/commit/2fc898d7) chore(docs): релиз-пост 114 (v3.36.0 — каталог снаряжения 56 и наборы)
- [`b69ae35f`](https://github.com/D1MANYCH/dnd-app/commit/b69ae35f) v3.37.0: feat(gear): настройка магпредметов (лимит 3)

**Файлы (8):**

- `app-inventory.js` +72 −0
- `tests/headless.js` +67 −0
- `index.html` +33 −31
- `style.css` +33 −0
- `docs/marketing/posts/114-gear-catalog.txt` +13 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.36.0"></a>
## v3.36.0 — 7 июля 2026

✨ Каталог снаряжения: 56 товаров PHB гл.5 (ленивый пикер) + 7 готовых наборов одной кнопкой; наборы вынесены в GEAR_PACKS (data.js)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/46152556...6a46f5fc) · 11 файлов, +476 −123

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f111d53d`](https://github.com/D1MANYCH/dnd-app/commit/f111d53d) chore(docs): релиз-пост 113 (v3.35.0 — предыстории 13 и умение предыстории)
- [`6a46f5fc`](https://github.com/D1MANYCH/dnd-app/commit/6a46f5fc) v3.36.0: feat(gear): каталог снаряжения 56 товаров PHB гл.5 + 7 наборов одной кнопкой

**Файлы (11):**

- `data.js` +108 −2
- `app-inventory.js` +109 −0
- `app-core.js` +3 −89
- `index.html` +59 −30
- `gear-catalog.js` +86 −0
- `tests/headless.js` +75 −0
- `style.css` +14 −0
- `docs/marketing/posts/113-backgrounds-catalog.txt` +13 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.35.0"></a>
## v3.35.0 — 7 июля 2026

✨ предыстории 11→13 (+Шарлатан, +Беспризорник по PHB 2014) — умение предыстории (feature) с панелью на листе персонажа; сверка 11 существующих по книге (Солдат +игровой набор, Народный герой +транспорт наземный); Шарлатан выделен из алиаса на Преступника в самостоятельную предысторию (навыки Обман/Ловкость рук, инструменты грим/фальсификатор)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/47cea566...46152556) · 9 файлов, +212 −47

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`28e52d15`](https://github.com/D1MANYCH/dnd-app/commit/28e52d15) chore(docs): релиз-пост 112 (v3.34.0 — каталог доспехов 13 и помехи)
- [`46152556`](https://github.com/D1MANYCH/dnd-app/commit/46152556) v3.35.0: feat(backgrounds): предыстории 11→13 (+Шарлатан, +Беспризорник) — умение предыстории с панелью на листе

**Файлы (9):**

- `tests/headless.js` +69 −0
- `index.html` +34 −30
- `data.js` +40 −14
- `style.css` +26 −0
- `app-combat.js` +17 −0
- `docs/marketing/posts/112-armor-catalog.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `app-core.js` +5 −1
- `sw.js` +1 −1

</details>

<a id="v3.34.0"></a>
## v3.34.0 — 6 июля 2026

✨ каталог доспехов 13 позиций PHB 2014 — +Шкурный (КД12), разделены Колечный доспех (КД14) и Кольчуга (КД16, СИЛ13); поля СИЛ-требование/помеха Скрытности/вес/цена; бейджи помех в расчёте КД; миграция schema 29 (armorId ring→chain_mail, КД16 сохранён); имена по книге (Кираса/Полулаты/Наборный/Латы) с алиасами; пикер сгруппирован по категориям

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/fa3f4f27...47cea566) · 24 файлов, +535 −183

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`17ff4a4a`](https://github.com/D1MANYCH/dnd-app/commit/17ff4a4a) chore(docs): релиз-пост 111 (v3.33.0 — каталог оружия 37 и коннект с инвентарём)
- [`634a92a0`](https://github.com/D1MANYCH/dnd-app/commit/634a92a0) chore(docs): актуализация маркетинг-комплекта под v3.33.0 + ревизия каналов
- [`47cea566`](https://github.com/D1MANYCH/dnd-app/commit/47cea566) v3.34.0: feat(armor): каталог доспехов 13 позиций PHB 2014 + помехи + миграция ring→chain_mail

**Файлы (24):**

- `tests/headless.js` +140 −14
- `docs/marketing/expanded-channels.md` +82 −28
- `docs/marketing/listings-kit.md` +74 −21
- `index.html` +43 −35
- `app-core.js` +36 −21
- `data.js` +31 −14
- `app-combat.js` +31 −12
- `docs/marketing/seeding-targets.md` +24 −11
- `docs/marketing/posts/111-weapons-catalog.txt` +16 −0
- `docs/marketing/promo/post-dtf-vc.md` +8 −1
- `docs/marketing/seeding-plan.md` +5 −4
- `README.md` +5 −4
- `style.css` +8 −0
- `CHANGELOG.md` +6 −1
- `docs/marketing/first-week-posts.md` +3 −3
- `docs/marketing/promo/gen_promo.py` +3 −3
- `docs/marketing/promo/preview.html` +4 −2
- `docs/marketing/promo/README.md` +4 −2
- `docs/marketing/posts/seed-vk.txt` +3 −2
- `docs/marketing/posts/01-zachem-sdelal.txt` +2 −2
- `tests/headless-node.js` +4 −0
- `docs/marketing/posts/03-features.txt` +1 −1
- `docs/marketing/posts/seed-tg-chat.txt` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.33.0"></a>
## v3.33.0 — 6 июля 2026

✨ Оружие: единый каталог PHB 2014 — все 37 позиций с ценой/весом/категорией (было 13 в пикере + 21 скрыто для билдов), Секира 1к10→1к12, книжные имена с алиасами старых (Скимитар, Дубинка, Боевой посох, Молот 2к6); пикер оружия с поиском и чипами Простое/Воинское · Ближнее/Дальнобойное; владения по книге: скимитар друида, короткий меч монаха, рапира/длинный меч/ручной арбалет барда и плута; дротики, метательные копья и скимитары билдов теперь ложатся оружием в лист

✨ Оружие связано с инвентарём: добавление кладёт предмет во вкладку Инвентарь (вес из каталога, повтор — стопкой ×N), удаление из списка атак синхронно уменьшает стопку; чекбокс «Добавить и в инвентарь» в окне оружия

✨ В карточках пикера оружия — бейдж владения текущего персонажа (✓ владение / без владения); бонус атаки при выборе пресета считается без бонуса мастерства, если владения нет; блок «❓ Как это работает» в окне оружия — атака, урон, владение, свойства оружия простыми словами

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0f56f0ef...fa3f4f27) · 10 файлов, +553 −124

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`e66ff2b1`](https://github.com/D1MANYCH/dnd-app/commit/e66ff2b1) chore(docs): релиз-пост 110 (v3.32.1 — фикс заклинаний билдов и мобильной вёрстки)
- [`fa3f4f27`](https://github.com/D1MANYCH/dnd-app/commit/fa3f4f27) v3.33.0: feat(weapons): каталог оружия 37 позиций PHB 2014 (цена/вес/алиасы, Секира 1к12), пикер с поиском и фильтрами, коннект с инвентарём, владения по книге (скимитар друида, короткий меч монаха), блок «Как это работает»

**Файлы (10):**

- `tests/headless.js` +184 −0
- `app-inventory.js` +129 −11
- `app-core.js` +47 −63
- `data.js` +69 −16
- `index.html` +49 −30
- `style.css` +47 −2
- `docs/marketing/posts/110-fix-ph24-builds-mobile.txt` +13 −0
- `CHANGELOG.md` +8 −1
- `app-combat.js` +6 −0
- `sw.js` +1 −1

</details>

<a id="v3.32.1"></a>
## v3.32.1 — 5 июля 2026

🐛 Фикс: билды получали PH24-версии заклинаний вместо PHB 2014 (+миграция сохранённых персонажей); фикс фильтров Класс/Роль пикера билдов и обрезанных названий заклинаний на телефоне; подписи школ/классов/источника в карточке заклинания и тултипы на иконках

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4248a1c9...0f56f0ef) · 9 файлов, +239 −72

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`c907b93c`](https://github.com/D1MANYCH/dnd-app/commit/c907b93c) chore(docs): релиз-пост 109 (v3.32.0 — каталог черт 42)
- [`0f56f0ef`](https://github.com/D1MANYCH/dnd-app/commit/0f56f0ef) v3.32.1: fix(spells): билды набирали PH24-версии заклинаний вместо PHB 2014 (+миграция schema 28); фильтры Класс/Роль пикера билдов и названия заклинаний видны на телефоне; подписи школ/классов/источника в карточке и тултипы на иконках

**Файлы (9):**

- `index.html` +47 −43
- `app-core.js` +49 −6
- `tests/headless.js` +40 −14
- `style.css` +50 −2
- `app-spells.js` +22 −2
- `data.js` +11 −3
- `docs/marketing/posts/109-feats-catalog.txt` +13 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.32.0"></a>
## v3.32.0 — 5 июля 2026

✨ Черты: аудит по Книге игрока 2014 — каталог дополнен до всех 42 (добавлены Мастер тяжёлых и средних доспехов, Знаток лёгких и средних доспехов, Посвящённый в магию, Воинский адепт, Отличная память), внекнижная «Мастер магии» удалена; имена и описания приведены к книге (старые имена распознаются); владение доспехами от черт показывается во владениях с пометкой «Черта»; +5 инициативы от «Бдительного» учитывается в авто-инициативе вкладки «Бой»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4981c67d...4248a1c9) · 20 файлов, +681 −200

<details><summary>Коммиты и файлы</summary>

**Коммиты (4):**

- [`383fa39c`](https://github.com/D1MANYCH/dnd-app/commit/383fa39c) chore(docs): релиз-пост 108 (v3.31.1 — фикс туров обучения)
- [`3bf338da`](https://github.com/D1MANYCH/dnd-app/commit/3bf338da) chore(dev): скиллы Claude Code (.claude/skills) — релиз, verify-ui, контент, дайсы, туры + ссылки в CLAUDE.md
- [`61fe0b7e`](https://github.com/D1MANYCH/dnd-app/commit/61fe0b7e) fix(ci): деплой Pages через GitHub Actions (pages.yml) — легаси-пайплайн Jekyll трижды падал 04–05.07; tests.yml: checkout v7, setup-node v6, Node 24
- [`4248a1c9`](https://github.com/D1MANYCH/dnd-app/commit/4248a1c9) v3.32.0: feat(data): черты — полный каталог 42 по PHB 2014 (+7 черт, аудит имён и механик), владения доспехами от черт, бонус «Бдительного» в авто-инициативе боя

**Файлы (20):**

- `data.js` +198 −138
- `tests/headless.js` +107 −0
- `index.html` +30 −30
- `.claude/skills/verify-ui/SKILL.md` +54 −0
- `.claude/skills/release/SKILL.md` +51 −0
- `.claude/skills/add-content/SKILL.md` +44 −0
- `.claude/skills/dice-3d/SKILL.md` +38 −0
- `.claude/skills/tours/SKILL.md` +37 −0
- `.github/workflows/pages.yml` +34 −0
- `app-core.js` +18 −4
- `character-builds.js` +11 −11
- `app-party.js` +12 −8
- `app-combat.js` +12 −1
- `docs/marketing/posts/108-tour-fixes.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `CLAUDE.md` +7 −0
- `.github/workflows/tests.yml` +3 −3
- `app-ui.js` +4 −2
- `.gitignore` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.31.1"></a>
## v3.31.1 — 4 июля 2026

🐛 Обучение: карточка шага тура непрозрачна при низкой непрозрачности фона (пол как у модалок + blur); подсказка больше не ложится на подсветку (размещение под/над/справа/слева + докрутка); шаги «Разделы персонажа» и «Справка по разделу» не выпадают на 1024–1199 и на свежем персонаже

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3b7bf383...4981c67d) · 7 файлов, +139 −49

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9a13d415`](https://github.com/D1MANYCH/dnd-app/commit/9a13d415) chore(docs): релиз-пост 107 (v3.31.0 — вкладка Бой: авто-инициатива, инлайн-HP, монстры, броски)
- [`4981c67d`](https://github.com/D1MANYCH/dnd-app/commit/4981c67d) v3.31.1: fix(ui): туры обучения — непрозрачная карточка шага, коуч не перекрывает подсветку, шаги не выпадают

**Файлы (7):**

- `app-help.js` +71 −13
- `index.html` +30 −30
- `data.js` +11 −3
- `docs/marketing/posts/107-battle-tab.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `style.css` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.31.0"></a>
## v3.31.0 — 3 июля 2026

✨ вкладка «Бой»: авто-инициатива (d20+модификатор Ловкости, сортировка по убыванию), инлайн-HP (−/+ и тек/макс) для «я» и монстров, добавление монстров из бестиария SRD прямо в бой (дубли получают номер), быстрый бросок d20 из строки участника в общую историю, ручной переброс/правка инициативы

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/03d98b0a...3b7bf383) · 8 файлов, +513 −53

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`e9ce9964`](https://github.com/D1MANYCH/dnd-app/commit/e9ce9964) chore(docs): релиз-пост 106 (v3.30.0 — кидалка с листа: 3D-броски, общая история, лента)
- [`3b7bf383`](https://github.com/D1MANYCH/dnd-app/commit/3b7bf383) v3.31.0: feat(ui): вкладка «Бой» — авто-инициатива, инлайн-HP, монстры из бестиария в бой, быстрый d20 из строки

**Файлы (8):**

- `app-party.js` +258 −14
- `tests/headless.js` +141 −0
- `index.html` +33 −30
- `style.css` +50 −4
- `data.js` +11 −3
- `docs/marketing/posts/106-quick-roll-sheet.txt` +13 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.30.0"></a>
## v3.30.0 — 29 июня 2026

✨ универсальная кидалка с листа — тап по характеристике/спасброску/навыку кидает d20+мод с 3D-анимацией и записью в общую историю с подписью; компактная лента последних бросков вне окна кубиков

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/37834bb7...03d98b0a) · 9 файлов, +387 −108

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ec131e4b`](https://github.com/D1MANYCH/dnd-app/commit/ec131e4b) chore(docs): релиз-пост 105 (v3.29.0 — гайды билдов: живучесть, сложность, глоссарий)
- [`03d98b0a`](https://github.com/D1MANYCH/dnd-app/commit/03d98b0a) v3.30.0: feat(ui): универсальная кидалка с листа — d20+мод с 3D-анимацией и общей историей

**Файлы (9):**

- `app-ui.js` +174 −1
- `style.css` +94 −0
- `app-combat.js` +4 −73
- `index.html` +37 −30
- `tests/headless.js` +48 −0
- `docs/marketing/posts/105-build-guides-glossary.txt` +13 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.29.0"></a>
## v3.29.0 — 29 июня 2026

✨ гайды билдов: шкала живучести (кость хитов d6→d12) и расшифровка сложности; сильные/слабые стороны переписаны простым языком; глоссарий-тултипы игровых терминов

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ad5ad04b...37834bb7) · 11 файлов, +373 −52

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`8d4a2bc4`](https://github.com/D1MANYCH/dnd-app/commit/8d4a2bc4) chore(docs): релиз-пост 104 (v3.28.74 — полноэкранный бросок кубиков на ПК)
- [`37834bb7`](https://github.com/D1MANYCH/dnd-app/commit/37834bb7) v3.29.0: feat(ui): гайды билдов — шкала живучести, легенда сложности, глоссарий-тултипы

**Файлы (11):**

- `app-core.js` +146 −5
- `glossary-data.js` +69 −0
- `index.html` +31 −29
- `style.css` +46 −0
- `tests/headless.js` +34 −0
- `character-builds.js` +14 −14
- `docs/marketing/posts/104-pc-fullscreen-dice.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1
- `tests/headless-node.js` +1 −0

</details>

<a id="v3.28.74"></a>
## v3.28.74 — 29 июня 2026

✨ полноэкранный бросок кубиков теперь и на ПК — в окне модалки только кнопки выбора, тап по кубику открывает полноэкранную 3D-анимацию броска поверх размытого фона, тап закрывает (как на телефоне)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/fba32fd8...ad5ad04b) · 7 файлов, +177 −180

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`0856d21c`](https://github.com/D1MANYCH/dnd-app/commit/0856d21c) chore(docs): релиз-пост 103 (v3.28.73 — полноэкранный бросок кубиков на телефоне)
- [`ad5ad04b`](https://github.com/D1MANYCH/dnd-app/commit/ad5ad04b) v3.28.74: feat(ui): полноэкранный бросок кубиков и на ПК (только кнопки в окне, бросок — оверлеем)

**Файлы (7):**

- `style.css` +110 −126
- `index.html` +29 −29
- `app-ui.js` +6 −21
- `docs/marketing/posts/103-fullscreen-dice-roll.txt` +15 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.73"></a>
## v3.28.73 — 29 июня 2026

✨ бросок кубиков на телефоне — экран кубиков на весь экран только с кнопками выбора; тап по кубику открывает полноэкранную 3D-анимацию броска поверх размытого фона с крупным результатом, тап по ней закрывает; плавный переход из выбора кубика в бросок (проявление арены на телефоне, «оживание» арены на ПК); 3 варианта фона арены (Космос/Сияние/Звёзды) с переключателем в настройках и сохранением выбора

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/fa263b13...fba32fd8) · 8 файлов, +350 −61

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`c27e45ae`](https://github.com/D1MANYCH/dnd-app/commit/c27e45ae) chore(docs): релиз-пост 102 (v3.28.72 — парсер формулы кубиков + чипы)
- [`fba32fd8`](https://github.com/D1MANYCH/dnd-app/commit/fba32fd8) v3.28.73: feat(ui): полноэкранный экран кубиков на телефоне (3D-бросок) + плавный переход в бросок + варианты фона арены

**Файлы (8):**

- `style.css` +156 −3
- `dice-arena-bg.js` +60 −22
- `index.html` +39 −30
- `app-ui.js` +63 −1
- `data.js` +11 −3
- `docs/marketing/posts/102-dice-formula-parser.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.72"></a>
## v3.28.72 — 28 июня 2026

✨ UX-2: своя формула кубиков — парсер термов (NdX/dX/целый мод) с ± и несколькими группами (d20, 2к6+3, 1к8+1к6+2), нормализация к→d, клампы (кубиков ≤50, грань ≥2, итог ≥1); реальный 3D-бросок основной группы вместо вывода только числа; разбивка результата в подписи и запись в историю; быстрые вставки-чипы (к4–к20, +, −, ⌫) под полем формулы и в поповере настроек

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8b35436d...fa263b13) · 8 файлов, +343 −79

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`df9de2c9`](https://github.com/D1MANYCH/dnd-app/commit/df9de2c9) chore(docs): релиз-пост 101 (v3.28.71 — непрозрачность липких поверхностей)
- [`fa263b13`](https://github.com/D1MANYCH/dnd-app/commit/fa263b13) v3.28.72: feat(ui): надёжный парсер своей формулы кубиков + быстрые вставки-чипы

**Файлы (8):**

- `app-ui.js` +153 −45
- `index.html` +54 −30
- `tests/headless.js` +69 −0
- `style.css` +36 −0
- `docs/marketing/posts/101-sticky-surface-opacity.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.71"></a>
## v3.28.71 — 28 июня 2026

🐛 липкие поверхности (шапка/статус-бар/нижняя навигация) не просвечивают контент при низкой непрозрачности — отдельный токен --surface-sticky с полом 0.86 (отвязан от --glass-alpha карточек) + усиленное размытие (--sticky-blur, +4px)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4917705a...8b35436d) · 6 файлов, +83 −60

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`13421d12`](https://github.com/D1MANYCH/dnd-app/commit/13421d12) chore(docs): актуализация чисел в listings-kit (706→719, v3.28.70)
- [`69636dd6`](https://github.com/D1MANYCH/dnd-app/commit/69636dd6) chore(docs): listings-kit — Appscope мёртв (503) → store.app, PWA-секция актуализирована
- [`8b35436d`](https://github.com/D1MANYCH/dnd-app/commit/8b35436d) v3.28.71: fix(ui): липкие поверхности (шапка/статус-бар/нижняя навигация) не просвечивают контент при низкой непрозрачности — отдельный токен --surface-sticky с полом 0.86 (отвязан от --glass-alpha карточек) + усиленное размытие (--sticky-blur, +4px); синхронизированы тёмный/светлый/auto блоки токенов

**Файлы (6):**

- `index.html` +29 −29
- `style.css` +30 −20
- `docs/marketing/listings-kit.md` +7 −7
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.70"></a>
## v3.28.70 — 28 июня 2026

🐛 актуализация счётчика заклинаний 706→719 в meta-описании, og/twitter-тегах и manifest (недокат после REQ-6: +13 заклинаний Следопыта)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3a50f859...4917705a) · 7 файлов, +66 −41

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`79fbd0ce`](https://github.com/D1MANYCH/dnd-app/commit/79fbd0ce) chore(docs): релиз-пост 100 (v3.28.69 — Трек 3 QA: имена заклинаний в билдах)
- [`4917705a`](https://github.com/D1MANYCH/dnd-app/commit/4917705a) v3.28.70: fix(meta): счётчик заклинаний 706→719 в meta-описании, og/twitter-тегах и manifest (недокат после REQ-6: +13 заклинаний Следопыта); README-версия 3.28.63→3.28.70

**Файлы (7):**

- `index.html` +32 −32
- `data.js` +10 −2
- `docs/marketing/posts/100-track3-qa-fixes.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `README.md` +3 −3
- `manifest.json` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.28.69"></a>
## v3.28.69 — 28 июня 2026

🐛 Трек 3 QA — 3 устаревших имени заклинаний в prepared готовых билдов сведены к именам базы (Указующая стрела→Направленный снаряд, Божественная благосклонность→Божественное благоволение, удалён дубль Приручение животных=Дружба с животными) + алиасы для старых сохранёнок; в descе «Договор с Древним» (ур.14) Снятие проклятия→Снятие проклятья

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4356da97...3a50f859) · 7 файлов, +70 −38

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`09ef0ca9`](https://github.com/D1MANYCH/dnd-app/commit/09ef0ca9) chore(docs): релиз-пост 99 (v3.28.68 — исправления уровня/имён заклинаний)
- [`3a50f859`](https://github.com/D1MANYCH/dnd-app/commit/3a50f859) v3.28.69: fix(spells): Трек 3 QA — 3 устаревших имени заклинаний в prepared готовых билдов сведены к именам базы (Указующая стрела→Направленный снаряд, Божественная благосклонность→Божественное благоволение, удалён дубль Приручение животных=Дружба с животными) + алиасы для старых сохранёнок; в descе «Договор с Древним» (ур.14) Снятие проклятия→Снятие проклятья

**Файлы (7):**

- `index.html` +29 −29
- `data.js` +12 −4
- `docs/marketing/posts/99-spell-fixes.txt` +12 −0
- `app-core.js` +7 −0
- `CHANGELOG.md` +6 −1
- `character-builds.js` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.28.68"></a>
## v3.28.68 — 27 июня 2026

🐛 исправлены флаги REQ-6: уровень «Телепортации» 5→7 (PHB 2014); «Туча кинжалов»→«Облако кинжалов», «Воспламеняющаяся туча»→«Воспламеняющая туча» — недокат имён REQ-5b; миграция сохранёнок schema 27

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/31f547ab...4356da97) · 8 файлов, +129 −55

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`be96520d`](https://github.com/D1MANYCH/dnd-app/commit/be96520d) chore(docs): релиз-пост 98 (v3.28.67 — 13 отсутствовавших заклинаний PHB 2014)
- [`4356da97`](https://github.com/D1MANYCH/dnd-app/commit/4356da97) v3.28.68: fix(spells): закрыты флаги REQ-6 — «Телепортация» 5→7 ур. (PHB 2014); «Туча кинжалов»→«Облако кинжалов», «Воспламеняющаяся туча»→«Воспламеняющая туча» (недокат имён REQ-5b); миграция сохранёнок schema 27

**Файлы (8):**

- `index.html` +29 −29
- `tests/headless.js` +33 −13
- `app-core.js` +28 −1
- `data.js` +11 −3
- `docs/marketing/posts/98-missing-phb-spells.txt` +14 −0
- `spells.js` +7 −7
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.67"></a>
## v3.28.67 — 27 июня 2026

✨ добавлены 13 заклинаний PHB 2014, отсутствовавших в базе — Вызов на дуэль, Град шипов, Опутывающий удар, Животные чувства, Завеса стрел, Поиск ловушек, Молниевая стрела, Вещий сон, Призыв залпа + копии PH14 для Каменной кожи, Огненной стены, Сглаза и Создания прохода (были только PH24)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/7289754f...31f547ab) · 16 файлов, +708 −34

<details><summary>Коммиты и файлы</summary>

**Коммиты (4):**

- [`8bf65ed1`](https://github.com/D1MANYCH/dnd-app/commit/8bf65ed1) chore(docs): релиз-пост 97 (v3.28.66 — заклинания подкласса на листе, сверка с PHB 2014)
- [`ed2170f5`](https://github.com/D1MANYCH/dnd-app/commit/ed2170f5) chore(docs): промо-кит DTF/VC (черновик поста, обложка/баннер, генератор gen_promo.py с функцией og())
- [`e6d72e8c`](https://github.com/D1MANYCH/dnd-app/commit/e6d72e8c) chore: не трекать __pycache__/*.pyc (убран случайный байткод из промо-кита)
- [`31f547ab`](https://github.com/D1MANYCH/dnd-app/commit/31f547ab) v3.28.67: feat(spells): добавлены 13 заклинаний PHB 2014, отсутствовавших в базе — Вызов на дуэль, Град шипов, Опутывающий удар, Животные чувства, Завеса стрел, Поиск ловушек, Молниевая стрела, Вещий сон, Призыв залпа + копии PH14 для Каменной кожи, Огненной стены, Сглаза и Создания прохода (были только PH24)

**Файлы (16):**

- `docs/marketing/promo/gen_promo.py` +220 −0
- `spells.js` +219 −1
- `docs/marketing/promo/preview.html` +96 −0
- `docs/marketing/promo/post-dtf-vc.md` +72 −0
- `index.html` +29 −29
- `docs/marketing/promo/README.md` +39 −0
- `docs/marketing/posts/97-subclass-spell-lists.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `.gitignore` +2 −0
- `sw.js` +1 −1
- `docs/marketing/promo/__pycache__/gen_promo.cpython-314.pyc` +0 −0
- `docs/marketing/promo/01-cover.png` +0 −0
- `docs/marketing/promo/02-features.png` +0 −0
- `docs/marketing/promo/avatar.png` +0 −0
- `docs/marketing/promo/vc-banner.png` +0 −0

</details>

<a id="v3.28.66"></a>
## v3.28.66 — 27 июня 2026

✨ Заклинания подкласса (домены жреца, клятвы паладина, договоры колдуна): названия и состав сверены с Книгой Игрока 2014 и теперь отображаются в блоке ресурсов подкласса по уровням

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3bc1d46d...7289754f) · 7 файлов, +139 −95

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`369e909a`](https://github.com/D1MANYCH/dnd-app/commit/369e909a) chore(docs): релиз-пост 96 (v3.28.65 — фикс числа стихийных дисциплин Монаха)
- [`7289754f`](https://github.com/D1MANYCH/dnd-app/commit/7289754f) v3.28.66: feat(subclass): заклинания доменов/клятв/договоров — сверка с PHB 2014 + отображение в блоке ресурсов подкласса по уровням

**Файлы (7):**

- `subclass-choices-data.js` +59 −59
- `index.html` +29 −29
- `app-ui.js` +25 −3
- `data.js` +10 −2
- `docs/marketing/posts/96-monk-four-elements-count.txt` +9 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.65"></a>
## v3.28.65 — 27 июня 2026

🐛 Монах «Путь четырёх стихий»: число выбираемых стихийных дисциплин приведено к книге PHB 2014 — 1/2/3/4 на 3/6/11/17 ур. (Родство со стихией выдаётся отдельной фичей, раньше выбор был на 1 больше)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/efe15b9b...3bc1d46d) · 8 файлов, +137 −36

<details><summary>Коммиты и файлы</summary>

**Коммиты (4):**

- [`ab3cf0ae`](https://github.com/D1MANYCH/dnd-app/commit/ab3cf0ae) chore(docs): актуализация README (версия v3.28.64, статус REQ-5)
- [`5b4a315b`](https://github.com/D1MANYCH/dnd-app/commit/5b4a315b) chore(docs): листинги-кит Трек 4B (GitHub topics, awesome-dnd, alternativeto, PWA-каталоги)
- [`2423177b`](https://github.com/D1MANYCH/dnd-app/commit/2423177b) chore(docs): релиз-пост 95 (v3.28.64 — OG/Twitter-превью ссылки и скриншоты в manifest)
- [`3bc1d46d`](https://github.com/D1MANYCH/dnd-app/commit/3bc1d46d) v3.28.65: fix(mechanics): Монах «Путь четырёх стихий» — выбор стихийных дисциплин 1/2/3/4 по PHB 2014 (Родство со стихией выдаётся отдельно)

**Файлы (8):**

- `docs/marketing/listings-kit.md` +70 −0
- `index.html` +29 −29
- `docs/marketing/posts/95-link-preview-meta.txt` +15 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `subclass-choices-data.js` +4 −1
- `README.md` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.28.64"></a>
## v3.28.64 — 27 июня 2026

✨ OG/Twitter-разметка и meta-описание страницы для превью-карточки при шеринге ссылки; реальные скриншоты приложения в manifest; читаемый заголовок страницы

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/70b86830...efe15b9b) · 8 файлов, +171 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`d36f91c2`](https://github.com/D1MANYCH/dnd-app/commit/d36f91c2) chore(docs): релиз-пост 93 (v3.28.62 — механика умений Чародея и Колдуна по книге PHB 2014, REQ-5f-7)
- [`533b67d6`](https://github.com/D1MANYCH/dnd-app/commit/533b67d6) chore(docs): релиз-пост 94 (v3.28.63 — механика умений Волшебника (8 школ магии) по книге PHB 2014, REQ-5f-8)
- [`efe15b9b`](https://github.com/D1MANYCH/dnd-app/commit/efe15b9b) v3.28.64: feat(seo): OG/Twitter-разметка, meta-описание и OG-картинка для превью ссылки; реальные скриншоты в manifest

**Файлы (8):**

- `index.html` +47 −30
- `docs/marketing/posts/94-mechanics-wizard.txt` +60 −0
- `docs/marketing/posts/93-mechanics-sorcerer-warlock.txt` +29 −0
- `manifest.json` +18 −9
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1
- `assets/og-cover.png` +0 −0

</details>

<a id="v3.28.63"></a>
## v3.28.63 — 27 июня 2026

🐛 механика умений Волшебника (8 школ магии) по книге PHB 2014 (REQ-5f-8)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/89e5dd47...70b86830) · 5 файлов, +90 −64

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`70b86830`](https://github.com/D1MANYCH/dnd-app/commit/70b86830) v3.28.63: fix(mechanics): механика умений Волшебника (8 школ магии) по книге PHB 2014 (REQ-5f-8)

**Файлы (5):**

- `data.js` +40 −32
- `index.html` +29 −29
- `docs/phases/req-5f-mechanical.md` +14 −1
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.62"></a>
## v3.28.62 — 27 июня 2026

🐛 механика умений Чародея и Колдуна по книге PHB 2014 (REQ-5f-7)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/65b88ef1...89e5dd47) · 6 файлов, +93 −44

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`0b89f608`](https://github.com/D1MANYCH/dnd-app/commit/0b89f608) chore(docs): релиз-пост 92 (v3.28.61 — механика умений Монаха по книге PHB 2014, REQ-5f-6)
- [`89e5dd47`](https://github.com/D1MANYCH/dnd-app/commit/89e5dd47) v3.28.62: fix(mechanics): механика умений Чародея и Колдуна по книге PHB 2014 (REQ-5f-7)

**Файлы (6):**

- `index.html` +29 −29
- `docs/marketing/posts/92-mechanics-monk.txt` +33 −0
- `data.js` +15 −11
- `docs/phases/req-5f-mechanical.md` +9 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.61"></a>
## v3.28.61 — 27 июня 2026

🐛 механика умений Монаха по книге PHB 2014 (REQ-5f-6)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4bc09d2d...65b88ef1) · 7 файлов, +99 −48

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ec05b8e9`](https://github.com/D1MANYCH/dnd-app/commit/ec05b8e9) chore(docs): релиз-пост 91 (v3.28.60 — механика умений Плута по книге PHB 2014, REQ-5f-5)
- [`65b88ef1`](https://github.com/D1MANYCH/dnd-app/commit/65b88ef1) v3.28.61: fix(mechanics): механика умений Монаха по книге PHB 2014 (REQ-5f-6)

**Файлы (7):**

- `index.html` +29 −29
- `docs/marketing/posts/91-mechanics-rogue.txt` +35 −0
- `data.js` +20 −12
- `subclass-choices-data.js` +4 −4
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5f-mechanical.md` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.60"></a>
## v3.28.60 — 26 июня 2026

🐛 механика умений Плута по книге PHB 2014 (REQ-5f-5)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1ca31e3f...4bc09d2d) · 7 файлов, +100 −50

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ed4215b9`](https://github.com/D1MANYCH/dnd-app/commit/ed4215b9) chore(docs): релиз-пост 90 (v3.28.59 — механика умений Паладина и Следопыта по книге PHB 2014, REQ-5f-4)
- [`4bc09d2d`](https://github.com/D1MANYCH/dnd-app/commit/4bc09d2d) v3.28.60: fix(mechanics): механика умений Плута по книге PHB 2014 (REQ-5f-5)

**Файлы (7):**

- `index.html` +29 −29
- `docs/marketing/posts/90-mechanics-paladin-ranger.txt` +34 −0
- `data.js` +20 −12
- `character-builds.js` +6 −6
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5f-mechanical.md` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.59"></a>
## v3.28.59 — 26 июня 2026

🐛 механика умений Паладина и Следопыта по книге PHB 2014 (REQ-5f-4). Паладин: L3 +«Божественное здоровье» (Divine Health, иммунитет к болезням — отсутствовало); L20 выдуманный «Священный чемпион»→«Особенность клятвы» (у базового паладина капстоуна нет, L20=фича клятвы — Святой нимб/Мстящий ангел/Древний чемпион). Следопыт: descs переписаны под книгу — Первозданная осведомлённость (ячейка заклинания→чувствовать аберраций/небожителей/драконов/элементалей/фей/исчадий/нежить, без числа и местоположения), Маскировка на виду (1 мин камуфляжа из природных материалов + неподвижно +10 к Скрытности, не невидимость), Дикие чувства (атака по невидимым без помехи + чувство невидимых в 9 м), Убийца врагов (раз в ход +мод.МУД к атаке ИЛИ урону по избранному врагу). Убраны фантомные «Особенность архетипа» на L9/13/17 (книга даёт фичи архетипа только 3/7/11/15) + L6 добавлен пропущенный «Исследователь природы +1» + с L18 убран «Многоатакующий защитник» (опция Охотника, не базовая). Охотник: summary-descs L3/L7/L11/L15 приведены к реальным книжным опциям (Сокрушитель орд/Побег от орды/Защита от мультиатаки/Вихревая атака/Увёртливость/Стоять против течения/Невероятное уклонение). Клятва возмездия L3 «Очищение отступника» desc→книжн. (Испуг + скорость 0, не «Увещевание»). Повелитель зверей L7 «Тренировка зверя» desc→книжн. (бонус-действие Рывок/Отход/Уклонение/Помощь когда зверь не атакует + магические атаки). Фичи=отображение по ключу класс/подкласс+уровень → без миграции

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f530d2ff...1ca31e3f) · 5 файлов, +89 −49

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`416b9e7a`](https://github.com/D1MANYCH/dnd-app/commit/416b9e7a) chore(docs): релиз-пост 89 (v3.28.58 — механика умений Друида и Барда по книге PHB 2014, REQ-5f-3)
- [`1ca31e3f`](https://github.com/D1MANYCH/dnd-app/commit/1ca31e3f) v3.28.59: fix(mechanics): механика умений Паладина и Следопыта по книге PHB 2014 (REQ-5f-4)

**Файлы (5):**

- `index.html` +29 −29
- `data.js` +23 −18
- `docs/marketing/posts/89-mechanics-druid-bard.txt` +30 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.58"></a>
## v3.28.58 — 26 июня 2026

🐛 механика умений Друида и Барда по книге PHB 2014 (REQ-5f-3) — Друид: L18 «Речь зверей и растений» (выдумано)→Заклинания зверя (Beast Spells: творить заклинания друида в Диком облике, сомат.+вербал. компоненты, но без материальных); Бард: L5 разделён на «Вдохновение барда: 1к8» + добавлен «Источник вдохновения» (Font of Inspiration: восстановление зарядов Вдохновения и на коротком, и на длинном отдыхе) — раньше слиты в ярлык кубика; Коллегия знаний (Бард): L14 «Непревзойдённый навык» desc исправлен под книгу (потратить кость Вдохновения и прибавить к проверке, решение после броска — вместо выдуманной «замены кубика на минимум без траты»). Круг земли: «Арктика» оставлена для консистентности со Следопытом (книга=тундра). Фичи=отображение по ключу класс/подкласс+уровень → без миграции

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8f6b57bc...f530d2ff) · 5 файлов, +79 −36

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`20c7dc5b`](https://github.com/D1MANYCH/dnd-app/commit/20c7dc5b) chore(docs): релиз-пост 88 (v3.28.57 — механика умений Жреца по книге PHB 2014, REQ-5f-2)
- [`f530d2ff`](https://github.com/D1MANYCH/dnd-app/commit/f530d2ff) v3.28.58: fix(mechanics): механика умений Друида и Барда по книге PHB 2014 (REQ-5f-3)

**Файлы (5):**

- `index.html` +29 −29
- `docs/marketing/posts/88-mechanics-cleric.txt` +30 −0
- `data.js` +13 −5
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.57"></a>
## v3.28.57 — 26 июня 2026

🐛 механика умений Жреца по книге PHB 2014 (REQ-5f-2). База: Уничтожение нежити L11 КО4→КО2, L14 КО4→КО3, +пропущенный L17 КО4; убрана ошибочная базовая фича «Мощный заклинатель» L8 (это доменная фича Знания/Света, не базовая) + чистка garbled passive; ресурс Божественный канал 3/отдых теперь с L18 (был ошибочно с L10). Домен знаний: своп L2↔L6 (книга L2=Знания веков, L6=Чтение мыслей) + plural «Знание»→«Знания» + чистка desc Чтения мыслей. Домен природы: L1 разделён на «Послушник природы» (заговор друида + выбор навыка Уход за животными/Природа/Выживание) и «Бонусное владение» (тяж. броня). Фичи=отображение по ключу класс/подкласс+уровень → без миграции

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c0e8d261...8f6b57bc) · 6 файлов, +92 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`8262428c`](https://github.com/D1MANYCH/dnd-app/commit/8262428c) chore(docs): релиз-пост 87 (v3.28.56 — механика умений Варвара и Воина по книге PHB 2014, старт REQ-5f)
- [`8f6b57bc`](https://github.com/D1MANYCH/dnd-app/commit/8f6b57bc) v3.28.57: fix(mechanics): механика умений Жреца по книге PHB 2014 (REQ-5f-2)

**Файлы (6):**

- `index.html` +29 −29
- `docs/marketing/posts/87-mechanics-barbarian-fighter-subclasses.txt` +33 −0
- `data.js` +19 −11
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5f-mechanical.md` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.56"></a>
## v3.28.56 — 26 июня 2026

🐛 механика умений подклассов по книге PHB 2014 — старт REQ-5f (механический проход). Варвар: L15 Непоколебимость→Непрерывная ярость и L18 Неудержимая сила→Неукротимая мощь (имена+descs под книгу). Мистический рыцарь (Воин): +умение Связь с оружием L3, L3 «3 заговора»→«2 заговора», Мистический заряд→Мистический удар L10 (был desc Всплеска действий → Eldritch Strike: помеха на спас цели), Чародейская защита→Волшебный рывок L15 (выдумана → Arcane Charge: телепорт 9м при Всплеске действий), L18 «2 атаки»→«одна атака». Воин-тотема (Варвар): +умение Искатель духов L3 (ритуалы животные чувства/разговор с животными)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8297cb9c...c0e8d261) · 6 файлов, +219 −40

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b98cab88`](https://github.com/D1MANYCH/dnd-app/commit/b98cab88) chore(docs): релиз-пост 86 (v3.28.55 — школы магии Волшебника + пути Варвара по книге PHB 2014, финал REQ-5d)
- [`c0e8d261`](https://github.com/D1MANYCH/dnd-app/commit/c0e8d261) v3.28.56: fix(mechanics): механика умений подклассов по книге PHB 2014 (REQ-5f-1, старт механического прохода) — Варвар: Непоколебимость→Непрерывная ярость (L15) и Неудержимая сила→Неукротимая мощь (L18), имена+descs под книгу; Мистический рыцарь (Воин): +умение Связь с оружием (L3), L3 «3 заговора»→«2 заговора», Мистический заряд→Мистический удар (L10, Eldritch Strike: помеха на спас цели вместо desc Всплеска действий), Чародейская защита→Волшебный рывок (L15, Arcane Charge: телепорт 9м при Всплеске действий вместо выдуманной реакции), L18 «2 атаки»→«одна атака»; Воин-тотема (Варвар): +умение Искатель духов (L3, ритуалы животные чувства/разговор с животными). Фичи=отображение по ключу класс/подкласс+уровень → без миграции

**Файлы (6):**

- `docs/phases/req-5f-mechanical.md` +136 −0
- `index.html` +29 −29
- `docs/marketing/posts/86-naming-wizard-barbarian-subclasses.txt` +30 −0
- `data.js` +17 −9
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.55"></a>
## v3.28.55 — 26 июня 2026

🐛 имена умений подклассов Волшебника (8 школ магии) и Варвара (Путь берсерка, Путь воина-тотема) по книге PHB 2014 — финальная партия аудита. Волшебник: таксономия школ сведена к книге (Воплощение=Evocation, Вызов=Conjuration, Ограждение=Abjuration, Очарование=Enchantment; иллюзия/некромантия/преобразование/прорицание совпали), ренейм фич где механика совпала (Построение заклинаний, Усиленное воплощение, Мастер созидания/ограждения/очарования, Усиленное/Ложные воспоминания очарования, Собственная иллюзорность, Неживые рабы, Единение с не-жизнью) + синхрон школ Мистического рыцаря (Воплощения и Ограждения); миграция подкласса schema 26. Варвар: Устрашающее присутствие→Пугающее присутствие, Возмездие→Ответный удар, Дух тотема→Тотемный дух, Духовный странник→Гуляющий с духами, Тотемное воплощение→Гармония тотема (REQ-5d партия 8 — REQ-5d ЗАВЕРШЁН)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9c18758e...8297cb9c) · 9 файлов, +189 −93

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`15401e01`](https://github.com/D1MANYCH/dnd-app/commit/15401e01) chore(docs): релиз-пост 85 (v3.28.54 — имена фич происхождений Чародея и покровителей Колдуна + фикс Великого Древнего по книге PHB 2014)
- [`8297cb9c`](https://github.com/D1MANYCH/dnd-app/commit/8297cb9c) v3.28.55: fix(naming): имена умений подклассов Волшебника (8 школ магии) и Варвара (Берсерк/Воин-тотема) по книге PHB 2014 — финал REQ-5d. Волшебник: таксономия школ сведена к книге (своп ключей воплощение↔вызов, отмена→ограждение, заговаривание→очарование) + миграция schema 26 + ренейм фич + синхрон EK; Варвар: Пугающее присутствие/Ответный удар/Тотемный дух/Гуляющий с духами/Гармония тотема (REQ-5d партия 8)

**Файлы (9):**

- `data.js` +43 −35
- `index.html` +29 −29
- `tests/headless.js` +39 −12
- `app-core.js` +30 −0
- `docs/marketing/posts/85-naming-sorcerer-warlock-subclasses.txt` +26 −0
- `character-builds.js` +8 −8
- `subclass-choices-data.js` +7 −7
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.54"></a>
## v3.28.54 — 26 июня 2026

🐛 имена фич происхождений Чародея (Драконья кровь/Дикая магия) и покровителей Колдуна (Фея/Исчадие); блок Договора с Древним переписан на настоящие умения Великого Древнего по книге PHB 2014 (REQ-5d партия 7)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/16b46532...9c18758e) · 6 файлов, +89 −50

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f7035c38`](https://github.com/D1MANYCH/dnd-app/commit/f7035c38) chore(docs): релиз-пост 84 (v3.28.53 — имена фич архетипов Плута и традиций Монаха по книге PHB 2014)
- [`9c18758e`](https://github.com/D1MANYCH/dnd-app/commit/9c18758e) v3.28.54: fix(naming): имена фич происхождений Чародея (Драконья кровь/Дикая магия) и покровителей Колдуна (Фея/Исчадие) + блок Договора с Древним переписан на настоящие умения Великого Древнего по книге PHB 2014 (REQ-5d партия 7)

**Файлы (6):**

- `index.html` +29 −29
- `data.js` +26 −18
- `docs/marketing/posts/84-naming-rogue-monk-subclasses.txt` +26 −0
- `CHANGELOG.md` +6 −1
- `subclass-choices-data.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.53"></a>
## v3.28.53 — 26 июня 2026

🐛 имена фич архетипов Плута (Вор/Убийца/Мистический ловкач) и традиций Монаха (Открытая ладонь/Тень/Четыре стихии) + стихийные дисциплины по книге PHB 2014 (REQ-5d партия 6)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6b2e5d4b...16b46532) · 6 файлов, +78 −65

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`16b46532`](https://github.com/D1MANYCH/dnd-app/commit/16b46532) v3.28.53: fix(naming): имена фич архетипов Плута (Вор/Убийца/Мистический ловкач) и традиций Монаха (Открытая ладонь/Тень/Четыре стихии) + стихийные дисциплины по книге PHB 2014 (REQ-5d партия 6)

**Файлы (6):**

- `index.html` +29 −29
- `data.js` +22 −14
- `subclass-choices-data.js` +16 −16
- `character-builds.js` +4 −4
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.52"></a>
## v3.28.52 — 26 июня 2026

🐛 имена фич клятв Паладина (Преданности/Возмездия/Древних) и архетипов Следопыта (Охотник/Повелитель зверей) по книге PHB 2014 (REQ-5d партия 5)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e7d6f01c...6b2e5d4b) · 7 файлов, +95 −58

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9a8471ce`](https://github.com/D1MANYCH/dnd-app/commit/9a8471ce) chore(docs): релиз-пост 83 (v3.28.51 — имена фич подклассов Друида и Барда по книге PHB 2014)
- [`6b2e5d4b`](https://github.com/D1MANYCH/dnd-app/commit/6b2e5d4b) v3.28.52: fix(naming): имена фич клятв Паладина (Преданности/Возмездия/Древних) и архетипов Следопыта (Охотник/Повелитель зверей) по книге PHB 2014 (REQ-5d партия 5)

**Файлы (7):**

- `index.html` +29 −29
- `data.js` +22 −14
- `docs/marketing/posts/83-naming-druid-bard-subclasses.txt` +24 −0
- `subclass-choices-data.js` +10 −10
- `CHANGELOG.md` +6 −1
- `character-builds.js` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.28.51"></a>
## v3.28.51 — 26 июня 2026

🐛 имена фич подклассов Друида (Круг Земли/Луны) и Барда (Коллегии Знаний/Доблести) по книге PHB 2014 (REQ-5d партия 4)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/91f7f777...e7d6f01c) · 6 файлов, +85 −48

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`a29cc777`](https://github.com/D1MANYCH/dnd-app/commit/a29cc777) chore(docs): релиз-пост 82 (v3.28.50 — имена фич доменов Жреца по книге PHB 2014)
- [`e7d6f01c`](https://github.com/D1MANYCH/dnd-app/commit/e7d6f01c) v3.28.51: fix(naming): имена фич подклассов Друида (Круг Земли/Луны) и Барда (Коллегии Знаний/Доблести) по книге PHB 2014 (REQ-5d партия 4)

**Файлы (6):**

- `index.html` +29 −29
- `data.js` +23 −15
- `docs/marketing/posts/82-naming-cleric-features.txt` +24 −0
- `CHANGELOG.md` +6 −1
- `character-builds.js` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.28.50"></a>
## v3.28.50 — 24 июня 2026

🐛 имена фич доменов Жреца (7 PHB-доменов) по книге PHB 2014 (REQ-5d партия 3)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/43157d60...91f7f777) · 6 файлов, +110 −71

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`a1e4943f`](https://github.com/D1MANYCH/dnd-app/commit/a1e4943f) chore(docs): релиз-пост 81 (v3.28.49 — имена базовых умений Колдуна по книге PHB 2014)
- [`91f7f777`](https://github.com/D1MANYCH/dnd-app/commit/91f7f777) v3.28.50: fix(naming): имена фич доменов Жреца (7 PHB-доменов) по книге PHB 2014 (REQ-5d партия 3)

**Файлы (6):**

- `data.js` +38 −30
- `index.html` +29 −29
- `docs/marketing/posts/81-naming-warlock-features.txt` +26 −0
- `character-builds.js` +10 −10
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.49"></a>
## v3.28.49 — 23 июня 2026

🐛 имена базовых умений Колдуна по книге PHB 2014 (REQ-5e партия 7)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/48d6cf97...43157d60) · 9 файлов, +147 −104

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`e0b7e7b1`](https://github.com/D1MANYCH/dnd-app/commit/e0b7e7b1) chore(docs): релиз-пост 80 (v3.28.48 — имена базовых умений Чародея и Волшебника по книге PHB 2014)
- [`43157d60`](https://github.com/D1MANYCH/dnd-app/commit/43157d60) v3.28.49: fix(naming): имена базовых умений Колдуна по книге PHB 2014 (REQ-5e партия 7)

**Файлы (9):**

- `class-choices.js` +34 −34
- `index.html` +29 −29
- `data.js` +24 −16
- `character-builds.js` +17 −17
- `docs/marketing/posts/80-naming-sorcerer-wizard-features.txt` +24 −0
- `docs/phases/req-5e-class-features.md` +11 −5
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1
- `tests/headless.js` +1 −1

</details>

<a id="v3.28.48"></a>
## v3.28.48 — 23 июня 2026

🐛 имена базовых умений Чародея и Волшебника по книге PHB 2014 (REQ-5e партия 6)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6cc1b835...48d6cf97) · 8 файлов, +109 −65

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`63001094`](https://github.com/D1MANYCH/dnd-app/commit/63001094) chore(docs): релиз-пост 79 (v3.28.47 — имена базовых умений Плута и Монаха по книге PHB 2014)
- [`48d6cf97`](https://github.com/D1MANYCH/dnd-app/commit/48d6cf97) v3.28.48: fix(naming): имена базовых умений Чародея и Волшебника по книге PHB 2014 (REQ-5e партия 6)

**Файлы (8):**

- `index.html` +29 −29
- `data.js` +19 −11
- `docs/marketing/posts/79-naming-rogue-monk-features.txt` +24 −0
- `docs/phases/req-5e-class-features.md` +14 −7
- `character-builds.js` +8 −8
- `class-choices.js` +8 −8
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.47"></a>
## v3.28.47 — 23 июня 2026

🐛 имена базовых умений Плута и Монаха по книге PHB 2014 (REQ-5e партия 5)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/020b029c...6cc1b835) · 8 файлов, +115 −66

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`4f1395c4`](https://github.com/D1MANYCH/dnd-app/commit/4f1395c4) chore(docs): релиз-пост 78 (v3.28.46 — имена базовых умений Паладина по книге PHB 2014)
- [`6cc1b835`](https://github.com/D1MANYCH/dnd-app/commit/6cc1b835) v3.28.47: fix(naming): имена базовых умений Плута и Монаха по книге PHB 2014 (REQ-5e партия 5)

**Файлы (8):**

- `index.html` +29 −29
- `data.js` +28 −20
- `docs/phases/req-5e-class-features.md` +21 −9
- `docs/marketing/posts/78-naming-paladin-features.txt` +24 −0
- `character-builds.js` +5 −5
- `CHANGELOG.md` +6 −1
- `class-choices.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.46"></a>
## v3.28.46 — 23 июня 2026

🐛 имена базовых классовых умений Паладина по книге PHB 2014 (REQ-5e партия 4)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f7d33510...020b029c) · 7 файлов, +97 −55

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ee0f18da`](https://github.com/D1MANYCH/dnd-app/commit/ee0f18da) chore(docs): релиз-пост 77 (v3.28.45 — имена базовых умений Барда и Следопыта по книге PHB 2014)
- [`020b029c`](https://github.com/D1MANYCH/dnd-app/commit/020b029c) v3.28.46: fix(naming): имена базовых классовых умений Паладина по книге PHB 2014 (REQ-5e партия 4)

**Файлы (7):**

- `index.html` +29 −29
- `data.js` +18 −10
- `docs/marketing/posts/77-naming-bard-ranger-features.txt` +25 −0
- `character-builds.js` +9 −9
- `docs/phases/req-5e-class-features.md` +9 −5
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.45"></a>
## v3.28.45 — 22 июня 2026

🐛 имена базовых классовых умений Барда и Следопыта по книге PHB 2014 (REQ-5e партия 3)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/95d4cb2b...f7d33510) · 7 файлов, +110 −71

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f559f994`](https://github.com/D1MANYCH/dnd-app/commit/f559f994) chore(docs): релиз-пост 76 (v3.28.44 — имена базовых умений Жреца и Друида по книге PHB 2014)
- [`f7d33510`](https://github.com/D1MANYCH/dnd-app/commit/f7d33510) v3.28.45: fix(naming): имена базовых классовых умений Барда и Следопыта по книге PHB 2014 (REQ-5e партия 3)

**Файлы (7):**

- `index.html` +29 −29
- `data.js` +30 −22
- `docs/marketing/posts/76-naming-cleric-druid-features.txt` +23 −0
- `class-choices.js` +11 −11
- `docs/phases/req-5e-class-features.md` +10 −7
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.44"></a>
## v3.28.44 — 22 июня 2026

🐛 имена базовых умений Жреца и Друида по книге PHB 2014 (REQ-5e партия 2)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/5c20ef9d...95d4cb2b) · 7 файлов, +108 −69

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b2ef3109`](https://github.com/D1MANYCH/dnd-app/commit/b2ef3109) chore(docs): релиз-пост 75 (v3.28.43 — имена фич подклассов Воина: Чемпион, Мистический рыцарь)
- [`95d4cb2b`](https://github.com/D1MANYCH/dnd-app/commit/95d4cb2b) v3.28.44: fix(naming): имена базовых умений Жреца и Друида по книге PHB 2014 (REQ-5e партия 2)

**Файлы (7):**

- `index.html` +29 −29
- `character-builds.js` +17 −17
- `data.js` +21 −13
- `docs/marketing/posts/75-naming-fighter-subclasses.txt` +23 −0
- `docs/phases/req-5e-class-features.md` +11 −8
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.43"></a>
## v3.28.43 — 22 июня 2026

🐛 имена фич подклассов Воина (Чемпион, Мистический рыцарь) по книге PHB 2014 (REQ-5d партия 2)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/77b59f71...5c20ef9d) · 7 файлов, +79 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`d7dde074`](https://github.com/D1MANYCH/dnd-app/commit/d7dde074) chore(docs): релиз-пост 74 (v3.28.42 — имена заклинаний уровня 9 по книге PHB 2014)
- [`5c20ef9d`](https://github.com/D1MANYCH/dnd-app/commit/5c20ef9d) v3.28.43: fix(naming): имена фич подклассов Воина (Чемпион, Мистический рыцарь) по книге PHB 2014 (REQ-5d партия 2)

**Файлы (7):**

- `index.html` +29 −29
- `data.js` +16 −8
- `docs/marketing/posts/74-naming-spells-level9.txt` +23 −0
- `CHANGELOG.md` +6 −1
- `character-builds.js` +3 −3
- `subclass-choices-data.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.42"></a>
## v3.28.42 — 22 июня 2026

🐛 имена заклинаний уровня 9 по книге PHB 2014 (REQ-5b партия 10) + единый регистр семьи «Слово Силы»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ffd5698b...77b59f71) · 9 файлов, +190 −76

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ceefc662`](https://github.com/D1MANYCH/dnd-app/commit/ceefc662) chore(docs): релиз-пост 73 (v3.28.41 — имена заклинаний уровня 8 по книге PHB 2014)
- [`77b59f71`](https://github.com/D1MANYCH/dnd-app/commit/77b59f71) v3.28.42: fix(naming): имена заклинаний уровня 9 по книге PHB 2014 (REQ-5b партия 10)

**Файлы (9):**

- `app-core.js` +65 −6
- `index.html` +29 −29
- `spells.js` +24 −24
- `tests/headless.js` +31 −11
- `docs/marketing/posts/73-naming-spells-level8.txt` +22 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5b-spells.md` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.41"></a>
## v3.28.41 — 22 июня 2026

🐛 имена заклинаний уровня 8 по книге PHB 2014 (REQ-5b партия 9)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c16dfe48...ffd5698b) · 9 файлов, +189 −76

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`863c17b6`](https://github.com/D1MANYCH/dnd-app/commit/863c17b6) chore(docs): релиз-пост 72 (v3.28.40 — имена заклинаний уровня 7 по книге PHB 2014)
- [`ffd5698b`](https://github.com/D1MANYCH/dnd-app/commit/ffd5698b) v3.28.41: fix(naming): имена заклинаний уровня 8 по книге PHB 2014 (REQ-5b партия 9)

**Файлы (9):**

- `app-core.js` +65 −8
- `index.html` +29 −29
- `spells.js` +22 −22
- `tests/headless.js` +30 −10
- `docs/marketing/posts/72-naming-spells-level7.txt` +22 −0
- `data.js` +12 −4
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5b-spells.md` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.40"></a>
## v3.28.40 — 21 июня 2026

🐛 имена заклинаний уровня 7 по книге PHB 2014 (REQ-5b партия 8)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/011c0174...c16dfe48) · 9 файлов, +186 −76

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`17748b1a`](https://github.com/D1MANYCH/dnd-app/commit/17748b1a) chore(docs): релиз-пост 71 (v3.28.39 — имена заклинаний уровня 6 по книге PHB 2014)
- [`c16dfe48`](https://github.com/D1MANYCH/dnd-app/commit/c16dfe48) v3.28.40: fix(naming): имена заклинаний уровня 7 по книге PHB 2014 (REQ-5b партия 8)

**Файлы (9):**

- `app-core.js` +65 −10
- `index.html` +29 −29
- `spells.js` +22 −22
- `tests/headless.js` +28 −9
- `docs/marketing/posts/71-naming-spells-level6.txt` +22 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5b-spells.md` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.39"></a>
## v3.28.39 — 21 июня 2026

🐛 имена заклинаний уровня 6 по книге PHB 2014 (REQ-5b партия 7): 23 переименования (Дезинтеграция→Распад, Цепная молния→Пляшущая молния, Исцеление→Полное исцеление, Вред→Поражение, Стена льда→Ледяная стена, Стена шипов→Терновая стена, Шар неуязвимости→Сфера неуязвимости и др.); миграция сохранёнок schema 22

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ca975b50...011c0174) · 10 файлов, +233 −101

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`cb2e3451`](https://github.com/D1MANYCH/dnd-app/commit/cb2e3451) chore(docs): релиз-пост 70 (v3.28.38 — имена заклинаний уровня 5 по книге PHB 2014)
- [`011c0174`](https://github.com/D1MANYCH/dnd-app/commit/011c0174) v3.28.39: fix(naming): имена заклинаний уровня 6 по книге PHB 2014 (REQ-5b партия 7)

**Файлы (10):**

- `spells.js` +46 −46
- `app-core.js` +82 −4
- `index.html` +29 −29
- `tests/headless.js` +26 −8
- `docs/marketing/posts/70-naming-spells-level5.txt` +22 −0
- `character-builds.js` +8 −8
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5b-spells.md` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.38"></a>
## v3.28.38 — 21 июня 2026

🐛 имена заклинаний уровня 5 по книге PHB 2014 (REQ-5b партия 6)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d9a5bb83...ca975b50) · 12 файлов, +230 −94

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`1952e243`](https://github.com/D1MANYCH/dnd-app/commit/1952e243) chore(docs): релиз-пост 69 (v3.28.37 — имена заклинаний уровня 4 по книге PHB 2014)
- [`ca975b50`](https://github.com/D1MANYCH/dnd-app/commit/ca975b50) v3.28.38: fix(naming): имена заклинаний уровня 5 по книге PHB 2014 (REQ-5b партия 6)

**Файлы (12):**

- `app-core.js` +89 −7
- `spells.js` +41 −41
- `index.html` +29 −29
- `tests/headless.js` +25 −7
- `docs/marketing/posts/69-naming-spells-level4.txt` +22 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `subclass-choices-data.js` +2 −2
- `docs/phases/req-5b-spells.md` +2 −1
- `character-builds.js` +1 −1
- `magic-items.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.37"></a>
## v3.28.37 — 21 июня 2026

🐛 имена заклинаний уровня 4 по книге PHB 2014 (REQ-5b партия 5)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/41212ccf...d9a5bb83) · 12 файлов, +258 −99

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`7d4053bd`](https://github.com/D1MANYCH/dnd-app/commit/7d4053bd) chore(docs): релиз-пост 68 (v3.28.36 — имена заклинаний уровня 3 по книге PHB 2014)
- [`241a8a66`](https://github.com/D1MANYCH/dnd-app/commit/241a8a66) docs(readme): актуализация — фичи, счётчик заклинаний 706, версия v3.28.36, сверка названий
- [`d9a5bb83`](https://github.com/D1MANYCH/dnd-app/commit/d9a5bb83) v3.28.37: fix(naming): имена заклинаний уровня 4 по книге PHB 2014 (REQ-5b партия 5)

**Файлы (12):**

- `app-core.js` +100 −7
- `spells.js` +38 −38
- `index.html` +29 −29
- `tests/headless.js` +23 −6
- `docs/marketing/posts/68-naming-spells-level3.txt` +22 −0
- `README.md` +17 −4
- `data.js` +12 −4
- `character-builds.js` +5 −5
- `CHANGELOG.md` +6 −1
- `subclass-choices-data.js` +3 −3
- `docs/phases/req-5b-spells.md` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.36"></a>
## v3.28.36 — 20 июня 2026

🐛 имена заклинаний уровня 3 по книге PHB 2014 (REQ-5b партия 4)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c902b461...41212ccf) · 10 файлов, +237 −109

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`5a76b4a1`](https://github.com/D1MANYCH/dnd-app/commit/5a76b4a1) chore(docs): релиз-пост 67 (v3.28.35 — имена заклинаний уровня 2 по книге PHB 2014)
- [`41212ccf`](https://github.com/D1MANYCH/dnd-app/commit/41212ccf) v3.28.36: fix(naming): имена заклинаний уровня 3 по книге PHB 2014 (REQ-5b партия 4)

**Файлы (10):**

- `spells.js` +57 −57
- `app-core.js` +79 −4
- `index.html` +29 −29
- `tests/headless.js` +22 −5
- `docs/marketing/posts/67-naming-spells-level2.txt` +22 −0
- `data.js` +14 −6
- `character-builds.js` +5 −5
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5b-spells.md` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.35"></a>
## v3.28.35 — 20 июня 2026

🐛 имена заклинаний уровня 2 по книге PHB 2014 (REQ-5b партия 3)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/7fa97121...c902b461) · 11 файлов, +268 −136

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`0d5f22cc`](https://github.com/D1MANYCH/dnd-app/commit/0d5f22cc) chore(docs): релиз-пост 66 (v3.28.34 — имена заклинаний уровня 1 по книге PHB 2014)
- [`c902b461`](https://github.com/D1MANYCH/dnd-app/commit/c902b461) v3.28.35: fix(naming): имена заклинаний уровня 2 по книге PHB 2014 (REQ-5b партия 3)

**Файлы (11):**

- `spells.js` +72 −72
- `app-core.js` +96 −17
- `index.html` +29 −29
- `tests/headless.js` +21 −4
- `docs/marketing/posts/66-naming-spells-level1.txt` +22 −0
- `data.js` +13 −5
- `CHANGELOG.md` +6 −1
- `character-builds.js` +3 −3
- `subclass-choices-data.js` +3 −3
- `docs/phases/req-5b-spells.md` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.34"></a>
## v3.28.34 — 20 июня 2026

🐛 имена 31 заклинания уровня 1 по книге PHB 2014 (REQ-5b партия 2)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8ba9d567...7fa97121) · 11 файлов, +286 −160

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`5b429828`](https://github.com/D1MANYCH/dnd-app/commit/5b429828) chore(docs): релиз-пост 65 (v3.28.33 — имена классовых умений Варвара/Воина по книге PHB 2014)
- [`7fa97121`](https://github.com/D1MANYCH/dnd-app/commit/7fa97121) v3.28.34: fix(naming): имена заклинаний уровня 1 по книге PHB 2014 (REQ-5b партия 2)

**Файлы (11):**

- `spells.js` +62 −62
- `app-core.js` +96 −25
- `character-builds.js` +31 −31
- `index.html` +29 −29
- `docs/marketing/posts/65-naming-class-features.txt` +24 −0
- `tests/headless.js` +20 −3
- `data.js` +14 −6
- `CHANGELOG.md` +6 −1
- `docs/phases/req-5b-spells.md` +2 −1
- `subclass-choices-data.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.33"></a>
## v3.28.33 — 20 июня 2026

🐛 Имена классовых умений Варвара и Воина по книге PHB 2014: Путь дикости, Быстрое передвижение, Дикий инстинкт, Сильный критический удар, Непреклонная ярость, Дикий чемпион; Боевой стиль, Всплеск действий, Упорный. Общие боевые стили Воина/Паладина/Следопыта: Сражение большим оружием, Оборона, Сражение двумя оружиями (REQ-5e партия 1)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/71f19343...8ba9d567) · 9 файлов, +211 −63

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`19cd3e81`](https://github.com/D1MANYCH/dnd-app/commit/19cd3e81) chore(docs): релиз-пост 64 (v3.28.32 — имена манёвров и фич Боевого мастера по книге PHB 2014)
- [`8ba9d567`](https://github.com/D1MANYCH/dnd-app/commit/8ba9d567) v3.28.33: fix(naming): имена классовых умений Варвара/Воина по книге PHB 2014 (REQ-5e партия 1)

**Файлы (9):**

- `docs/phases/req-5e-class-features.md` +112 −0
- `index.html` +29 −29
- `data.js` +30 −22
- `docs/marketing/posts/64-naming-battlemaster.txt` +23 −0
- `class-choices.js` +6 −6
- `CHANGELOG.md` +7 −2
- `character-builds.js` +2 −2
- `sw.js` +1 −1
- `tests/headless.js` +1 −1

</details>

<a id="v3.28.32"></a>
## v3.28.32 — 20 июня 2026

🐛 имена манёвров и фич Боевого мастера по книге PHB 2014 (REQ-5d партия 1)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/73f24476...71f19343) · 7 файлов, +88 −51

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f07ee697`](https://github.com/D1MANYCH/dnd-app/commit/f07ee697) chore(docs): релиз-пост 63 (v3.28.31 — имена магических предметов по книге DMG 2014)
- [`71f19343`](https://github.com/D1MANYCH/dnd-app/commit/71f19343) v3.28.32: fix(naming): имена манёвров и фич Боевого мастера по книге PHB 2014 (REQ-5d партия 1)

**Файлы (7):**

- `index.html` +29 −29
- `docs/marketing/posts/63-naming-magic-items.txt` +24 −0
- `data.js` +15 −7
- `subclass-choices-data.js` +10 −10
- `CHANGELOG.md` +6 −1
- `character-builds.js` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.28.31"></a>
## v3.28.31 — 20 июня 2026

🐛 названия каталога магических предметов приведены к книге «Руководство Мастера» (DMG 2014) — 69 переименований из 193: «Вострый меч»→«Меч головоруб», «Палочка X»→«Волшебная палочка X», «Драконобойца»→«Убийца драконов», «Огненный язык»→«Язык пламени», «Камень Иоун»→«Камень Йоун» и др. (REQ-5c)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d5301926...73f24476) · 6 файлов, +138 −103

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`fde4c1f1`](https://github.com/D1MANYCH/dnd-app/commit/fde4c1f1) chore(docs): релиз-пост 62 (v3.28.30 — имена заговоров по книге PHB 2014)
- [`73f24476`](https://github.com/D1MANYCH/dnd-app/commit/73f24476) v3.28.31: fix(naming): имена магических предметов по книге DMG 2014 (REQ-5c)

**Файлы (6):**

- `magic-items.js` +69 −69
- `index.html` +29 −29
- `docs/marketing/posts/62-naming-spells-cantrips.txt` +22 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.30"></a>
## v3.28.30 — 19 июня 2026

🐛 Названия 20 заговоров приведены к книге PHB 2014: «Огненный болт»→«Огненный снаряд», «Престидижитация»→«Фокусы», «Луч мороза»→«Луч холода», «Священный огонь»→«Священное пламя» и др. Сохранённые персонажи мигрируют автоматически (schema 16).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e5b94d7d...d5301926) · 10 файлов, +209 −111

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`2f72438e`](https://github.com/D1MANYCH/dnd-app/commit/2f72438e) chore(docs): релиз-пост 61 (v3.28.29 — выравнивание карточки персонажа)
- [`d5301926`](https://github.com/D1MANYCH/dnd-app/commit/d5301926) v3.28.30: fix(naming): имена заговоров (level 0) по книге PHB 2014 (REQ-5b партия 1)

**Файлы (10):**

- `app-core.js` +87 −24
- `spells.js` +40 −40
- `index.html` +29 −29
- `data.js` +12 −4
- `character-builds.js` +7 −7
- `docs/phases/req-5b-spells.md` +12 −2
- `docs/marketing/posts/61-fix-basics-align.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `tests/headless.js` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.28.29"></a>
## v3.28.29 — 19 июня 2026

🐛 Выравнивание верхних полей карточки персонажа на ПК (Класс ↔ Раса/Вид): убран сдвиг колонок ~7px из-за кнопки «План класса»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/43a1b97b...e5b94d7d) · 6 файлов, +79 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`863713bc`](https://github.com/D1MANYCH/dnd-app/commit/863713bc) chore(docs): релиз-пост 60 (REQ-5a′ — Дварф по книгам Студии PHantom)
- [`e5b94d7d`](https://github.com/D1MANYCH/dnd-app/commit/e5b94d7d) v3.28.29: fix(ui): выравнивание верхних полей карточки персонажа на ПК (Класс ↔ Раса/Вид)

**Файлы (6):**

- `index.html` +29 −29
- `docs/marketing/posts/60-naming-phantom-dwarf.txt` +20 −0
- `style.css` +13 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.28"></a>
## v3.28.28 — 19 июня 2026

🐛 Названия по книгам 2014 PHantom: раса «Дворф» → «Дварф» (+ Горный/Холмовой), язык «Дворфийский» → «Дварфский». Реконсиляция REQ-5a (книга расходится с dnd.su). Миграция сохранёнок (schema 15).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f0be2bbf...43a1b97b) · 14 файлов, +286 −85

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`692b87c3`](https://github.com/D1MANYCH/dnd-app/commit/692b87c3) chore(docs): релиз-пост 59 + статус аудита названий (REQ-5a, v3.28.24–27)
- [`f6da7697`](https://github.com/D1MANYCH/dnd-app/commit/f6da7697) chore(docs): планы фаз REQ-5b (заклинания) и REQ-5c (маг.предметы)
- [`43a1b97b`](https://github.com/D1MANYCH/dnd-app/commit/43a1b97b) v3.28.28: fix(naming): откат «Дворф»→«Дварф» + язык «Дворфийский»→«Дварфский» под книгу (REQ-5a′)

**Файлы (14):**

- `index.html` +33 −33
- `docs/naming-audit.md` +59 −1
- `docs/phases/req-5b-spells.md` +56 −0
- `data.js` +29 −21
- `build-notes-data.js` +16 −16
- `docs/phases/req-5c-magic-items.md` +30 −0
- `app-core.js` +22 −1
- `docs/marketing/posts/59-naming-dndsu.txt` +23 −0
- `character-builds.js` +4 −4
- `CHANGELOG.md` +6 −1
- `magic-items.js` +3 −3
- `tests/headless.js` +3 −3
- `spells.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.27"></a>
## v3.28.27 — 19 июня 2026

🐛 Названия состояний по dnd.su: прилагательные формы (Ослеплён→Ослеплённый, Испуган→Испуганный, Невидим→Невидимый, Лежащий→Сбитый с ног и др.); id не тронуты, активные состояния сохранёнок не ломаются

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/440ea4f7...f0be2bbf) · 4 файла, +56 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`f0be2bbf`](https://github.com/D1MANYCH/dnd-app/commit/f0be2bbf) v3.28.27: fix(naming): названия состояний по dnd.su (REQ-5a)

**Файлы (4):**

- `index.html` +29 −29
- `data.js` +20 −12
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.26"></a>
## v3.28.26 — 19 июня 2026

🐛 Предыстории по dnd.su: Воин→Солдат, Благородный→Дворянин, Герой народа→Народный герой, Матрос→Моряк, Торговец/Подмастерье→Гильдейский ремесленник; слиты дубли Аколит/Преступник-Шпион/Бродяга. Миграция сохранёнок (schema 14)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/366e733c...440ea4f7) · 6 файлов, +74 −58

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`440ea4f7`](https://github.com/D1MANYCH/dnd-app/commit/440ea4f7) v3.28.26: fix(naming): предыстории по dnd.su + слияние дублей (REQ-5a)

**Файлы (6):**

- `index.html` +34 −38
- `data.js` +18 −12
- `app-core.js` +12 −3
- `CHANGELOG.md` +6 −1
- `tests/headless.js` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.28.25"></a>
## v3.28.25 — 19 июня 2026

🐛 Названия по dnd.su: раса «Дварф» → «Дворф» (+ Горный/Холмовой), язык «Дварфский» → «Дворфийский». Миграция сохранёнок (schema 13), фикс внутренней нестыковки с фичами классов/каталогом

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/610e1625...366e733c) · 9 файлов, +109 −81

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`366e733c`](https://github.com/D1MANYCH/dnd-app/commit/366e733c) v3.28.25: fix(naming): раса Дворф + язык Дворфийский по dnd.su (REQ-5a)

**Файлы (9):**

- `index.html` +33 −33
- `data.js` +29 −21
- `build-notes-data.js` +16 −16
- `app-core.js` +16 −1
- `character-builds.js` +4 −4
- `CHANGELOG.md` +6 −1
- `tests/headless.js` +3 −3
- `spells.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.24"></a>
## v3.28.24 — 19 июня 2026

🐛 Названия навыков по dnd.su: «Аркана» → «Магия», «Расследование» → «Анализ» (предыстории, классы, билды, описания)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e10d38bf...610e1625) · 9 файлов, +195 −49

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`3dab4d27`](https://github.com/D1MANYCH/dnd-app/commit/3dab4d27) chore(docs): релиз-пост 58 (каталог магических предметов v3.28.22–23)
- [`610e1625`](https://github.com/D1MANYCH/dnd-app/commit/610e1625) v3.28.24: fix(naming): навыки по dnd.su — Аркана→Магия, Расследование→Анализ (REQ-5a)

**Файлы (9):**

- `docs/naming-audit.md` +112 −0
- `index.html` +29 −29
- `data.js` +22 −14
- `docs/marketing/posts/58-magic-items-catalog.txt` +21 −0
- `CHANGELOG.md` +6 −1
- `app-core.js` +2 −2
- `character-builds.js` +1 −1
- `spells.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.23"></a>
## v3.28.23 — 19 июня 2026

✨ Пикер магических предметов в инвентаре: кнопка «Из каталога» в окне предмета → поиск (рус/eng) и фильтры по типу/редкости (193 позиции), выбор заполняет название/вес/категорию/описание

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b4c3e6d4...e10d38bf) · 6 файлов, +204 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`e10d38bf`](https://github.com/D1MANYCH/dnd-app/commit/e10d38bf) v3.28.23: feat(inventory): пикер магических предметов из каталога (REQ-4b)

**Файлы (6):**

- `index.html` +64 −29
- `app-inventory.js` +82 −0
- `style.css` +41 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.22"></a>
## v3.28.22 — 19 июня 2026

✨ Каталог магических предметов: датасет magic-items.js (193 позиции DMG, RU+EN названия, редкость/тип/настройка) + ленивая загрузка ensureMagicItems и кэш SW. UI-пикер — следующим патчем

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/11448bb9...b4c3e6d4) · 6 файлов, +320 −32

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`169a4001`](https://github.com/D1MANYCH/dnd-app/commit/169a4001) chore(docs): релиз-пост 57 (монеты/курс обмена, фикс подготовленных заклинаний, план класса v3.28.19–21)
- [`b4c3e6d4`](https://github.com/D1MANYCH/dnd-app/commit/b4c3e6d4) v3.28.22: feat(inventory): каталог магических предметов — датасет + ленивая загрузка (REQ-4a)

**Файлы (6):**

- `magic-items.js` +249 −0
- `index.html` +33 −28
- `docs/marketing/posts/57-coins-rate-prepared-classplan.txt` +20 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1

</details>

<a id="v3.28.21"></a>
## v3.28.21 — 19 июня 2026

✨ «План класса 1–20»: просмотр особенностей класса и подкласса по уровням для любого персонажа (не только из готового билда), кнопка у поля «Класс»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/2e5c14ea...11448bb9) · 6 файлов, +101 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`11448bb9`](https://github.com/D1MANYCH/dnd-app/commit/11448bb9) v3.28.21: feat(ui): «План класса 1–20» для любого персонажа

**Файлы (6):**

- `index.html` +29 −29
- `app-core.js` +51 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.20"></a>
## v3.28.20 — 19 июня 2026

🐛 Билды: имена подготовленных заклинаний приводятся к названиям из базы (отметка «подготовлено» корректно привязывается к заклинанию)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/18a714c1...2e5c14ea) · 5 файлов, +66 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`2e5c14ea`](https://github.com/D1MANYCH/dnd-app/commit/2e5c14ea) v3.28.20: fix(builds): подготовленные заклинания билда приводятся к именам базы

**Файлы (5):**

- `index.html` +28 −28
- `app-core.js` +21 −11
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.19"></a>
## v3.28.19 — 19 июня 2026

✨ Кошель: убран авто-пересчёт монет в золото (итог =0.00), добавлена справка курса обмена (1 ЗМ = 10 СМ = 100 ММ)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1734cd9b...18a714c1) · 7 файлов, +81 −62

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`745df354`](https://github.com/D1MANYCH/dnd-app/commit/745df354) chore(docs): релиз-пост 56 (оформление характеристик 2024 + значок броска v3.28.18)
- [`18a714c1`](https://github.com/D1MANYCH/dnd-app/commit/18a714c1) v3.28.19: feat(ui): кошель — убран авто-пересчёт монет в золото, добавлена справка курса обмена

**Файлы (7):**

- `index.html` +30 −37
- `style.css` +10 −12
- `docs/marketing/posts/56-stats-2024-layout-dice.txt` +20 −0
- `data.js` +11 −3
- `app-combat.js` +3 −8
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.18"></a>
## v3.28.18 — 18 июня 2026

✨ Вид характеристик 2024: имя характеристики на отдельной строке (длинные имена не наезжают на модификатор), низ колонок выровнен; значок 🎲 на кнопках быстрого броска — у спасбросков рядом с числом, на навыках и модификаторах бейджем в углу.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9758bf17...1734cd9b) · 6 файлов, +142 −48

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9cdddb00`](https://github.com/D1MANYCH/dnd-app/commit/9cdddb00) chore(docs): релиз-пост 55 (локализация гайдов билдов + план 1–20 v3.28.17)
- [`1734cd9b`](https://github.com/D1MANYCH/dnd-app/commit/1734cd9b) v3.28.18: feat(ui): вид характеристик 2024 — имя на отдельной строке, ровный низ колонок, значок броска на кнопках

**Файлы (6):**

- `style.css` +69 −16
- `index.html` +35 −28
- `docs/marketing/posts/55-build-guides-localization.txt` +21 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.17"></a>
## v3.28.17 — 18 июня 2026

✨ Гайды билдов: русские термины (английские в скобках) и исправленные опечатки; план развития в окне гайда теперь показывается на 1–20 уровнях, убрана дублирующая кнопка «План 1–20»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b37a81ae...9758bf17) · 8 файлов, +480 −444

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`77f2c567`](https://github.com/D1MANYCH/dnd-app/commit/77f2c567) chore(docs): релиз-пост 54 (кости превосходства Боевого мастера v3.28.15–16)
- [`9758bf17`](https://github.com/D1MANYCH/dnd-app/commit/9758bf17) v3.28.17: feat(ui): русские термины в гайдах билдов + план 1–20 в окне гайда

**Файлы (8):**

- `character-builds.js` +403 −403
- `index.html` +28 −29
- `docs/marketing/posts/54-battlemaster-superiority-dice.txt` +21 −0
- `app-core.js` +10 −7
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.16"></a>
## v3.28.16 — 18 июня 2026

✨ SDR-2 — готовый билд «Боевой мастер — лучник» советует и авто-применяет 3 манёвра на 3 уровне (Точная атака, Отвлекающий удар, Опрокидывание); движок советов уровень-апа учитывает SUBCLASS_CHOICES

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/a618f151...b37a81ae) · 7 файлов, +105 −44

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`b37a81ae`](https://github.com/D1MANYCH/dnd-app/commit/b37a81ae) v3.28.16: feat(ui): SDR-2 — готовый билд Боевого мастера советует 3 манёвра

**Файлы (7):**

- `index.html` +28 −28
- `tests/headless.js` +36 −2
- `app-hp.js` +21 −8
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `character-builds.js` +2 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.15"></a>
## v3.28.15 — 17 июня 2026

✨ SDR-1 — трекер костей превосходства Боевого мастера: счётчик по уровню (4→5→6), размер кости к8/к10/к12, восстановление после короткого отдыха (подключён SUBCLASS_RESOURCES)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/48b6dc53...a618f151) · 12 файлов, +407 −41

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`4f2904ed`](https://github.com/D1MANYCH/dnd-app/commit/4f2904ed) chore(docs): релиз-пост 53 (тур по вкладке «Журнал» v3.28.14)
- [`552aaa84`](https://github.com/D1MANYCH/dnd-app/commit/552aaa84) chore(marketing): расширенный пул каналов + готовые seed-тексты VK/TG
- [`a618f151`](https://github.com/D1MANYCH/dnd-app/commit/a618f151) v3.28.15: feat(ui): SDR-1 — трекер костей превосходства Боевого мастера

**Файлы (12):**

- `docs/marketing/expanded-channels.md` +209 −0
- `index.html` +28 −28
- `app-ui.js` +36 −8
- `tests/headless.js` +38 −0
- `docs/marketing/posts/seed-vk.txt` +25 −0
- `docs/marketing/posts/53-journal-tab-tour.txt` +22 −0
- `docs/marketing/posts/seed-tg-chat.txt` +22 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `style.css` +7 −0
- `docs/marketing/README.md` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.14"></a>
## v3.28.14 — 16 июня 2026

✨ TOUR-6 — интерактивный тур по вкладке «Журнал» (авто-старт при первом входе, повтор из «Справки»; запись события через ＋ Событие, фильтры по типам записей) + регистрация вкладки journal в реестре туров

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1d77691a...48b6dc53) · 7 файлов, +122 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`2089b9da`](https://github.com/D1MANYCH/dnd-app/commit/2089b9da) chore(docs): релиз-пост 52 (тур по вкладке «Мир» v3.28.13)
- [`48b6dc53`](https://github.com/D1MANYCH/dnd-app/commit/48b6dc53) v3.28.14: feat(ui): TOUR-6 — интерактивный тур по вкладке «Журнал» (авто-старт при первом входе, повтор из «Справки»; запись события через ＋ Событие, фильтры по типам записей) + регистрация вкладки journal в реестре туров

**Файлы (7):**

- `index.html` +29 −28
- `app-help.js` +47 −1
- `docs/marketing/posts/52-world-tab-tour.txt` +24 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +5 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.13"></a>
## v3.28.13 — 16 июня 2026

✨ TOUR-5 — интерактивный тур по вкладке «Мир» (авто-старт при первом входе, повтор из «Справки»; мой персонаж, блоки существ — соратники/NPC/монстры, переход к бою) + регистрация вкладки party в реестре туров

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/79037e3f...1d77691a) · 7 файлов, +135 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9d2a5c16`](https://github.com/D1MANYCH/dnd-app/commit/9d2a5c16) chore(docs): релиз-пост 51 (тур по вкладке «Записи» v3.28.12)
- [`1d77691a`](https://github.com/D1MANYCH/dnd-app/commit/1d77691a) v3.28.13: feat(ui): TOUR-5 — интерактивный тур по вкладке «Мир» (авто-старт при первом входе, повтор из «Справки»; мой персонаж, соратники/NPC, монстры, переход к бою) + регистрация вкладки party в реестре туров

**Файлы (7):**

- `app-help.js` +60 −1
- `index.html` +29 −28
- `docs/marketing/posts/51-notes-tab-tour.txt` +22 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +7 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.12"></a>
## v3.28.12 — 16 июня 2026

✨ TOUR-4 — интерактивный тур по вкладке «Записи» (авто-старт при первом входе, повтор из «Справки»; шапка раздела — поиск/добавление записи/🎲 всё/экспорт-импорт, под-табы разделов) + регистрация вкладки notes в реестре туров

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/192794f9...79037e3f) · 7 файлов, +109 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`63bf15d4`](https://github.com/D1MANYCH/dnd-app/commit/63bf15d4) chore(docs): релиз-пост 50 (туры по вкладкам «Инвентарь» и «Бой» v3.28.11)
- [`79037e3f`](https://github.com/D1MANYCH/dnd-app/commit/79037e3f) v3.28.12: feat(ui): TOUR-4 — интерактивный тур по вкладке «Записи» (авто-старт при первом входе, повтор из «Справки»; шапка раздела — поиск/добавление записи/🎲 всё/экспорт-импорт, под-табы разделов) + регистрация вкладки notes в реестре туров

**Файлы (7):**

- `index.html` +29 −28
- `app-help.js` +37 −1
- `docs/marketing/posts/50-inventory-battle-tab-tours.txt` +22 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `style.css` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.11"></a>
## v3.28.11 — 16 июня 2026

✨ TOUR-3 — интерактивный тур по вкладке «Бой» (авто-старт при первом входе, повтор из «Справки»; выбор участников, запуск боя, трекер инициативы) + регистрация вкладки battle в реестре туров

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0bb41dd4...192794f9) · 5 файлов, +80 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`192794f9`](https://github.com/D1MANYCH/dnd-app/commit/192794f9) v3.28.11: feat(ui): TOUR-3 — интерактивный тур по вкладке «Бой» (авто-старт при первом входе, повтор из «Справки»; выбор участников, запуск боя, трекер инициативы) + регистрация вкладки battle в реестре туров

**Файлы (5):**

- `index.html` +29 −28
- `app-help.js` +34 −1
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.10"></a>
## v3.28.10 — 16 июня 2026

✨ TOUR-2 — интерактивный тур по вкладке «Инвентарь» (авто-старт при первом входе, повтор из «Справки»; слоты/переноска, рюкзак с фильтрами, кошель с разменом монет) + регистрация вкладки inventory в реестре туров

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/7a6680fa...0bb41dd4) · 6 файлов, +112 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`59eac6c3`](https://github.com/D1MANYCH/dnd-app/commit/59eac6c3) chore(docs): релиз-пост 49 (тур по вкладке «Заклинания» v3.28.9)
- [`0bb41dd4`](https://github.com/D1MANYCH/dnd-app/commit/0bb41dd4) v3.28.10: feat(ui): TOUR-2 — интерактивный тур по вкладке «Инвентарь» (авто-старт при первом входе, повтор из «Справки»; слоты/переноска, рюкзак с фильтрами, кошель с разменом монет) + регистрация вкладки inventory в реестре туров

**Файлы (6):**

- `index.html` +29 −28
- `app-help.js` +42 −1
- `docs/marketing/posts/49-spells-tab-tour.txt` +24 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.9"></a>
## v3.28.9 — 16 июня 2026

✨ интерактивный тур по вкладке «Заклинания» — авто-старт при первом входе (характеристика заклинателя, ячейки, поиск/добавление заклинаний), повтор кнопкой «Пройти тур по разделу» в справке вкладки; общий каркас туров по вкладкам (авто-старт-хук в switchTab, «Показать обучение заново» сбрасывает все флаги онбординга)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1442c0d9...7a6680fa) · 7 файлов, +152 −34

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`80211cd6`](https://github.com/D1MANYCH/dnd-app/commit/80211cd6) chore(docs): релиз-пост 48 (ссылка на Telegram в окнах обновления v3.28.8)
- [`7a6680fa`](https://github.com/D1MANYCH/dnd-app/commit/7a6680fa) v3.28.9: feat(ui): TOUR-1 — интерактивный тур по вкладке «Заклинания» (авто-старт при первом входе, повтор из «Справки»; характеристика заклинателя, ячейки, поиск/добавление) + общий каркас туров по вкладкам (реестр TOUR_TABS, хук в switchTab, «Показать обучение заново» сбрасывает все флаги онбординга)

**Файлы (7):**

- `app-help.js` +92 −2
- `index.html` +29 −28
- `data.js` +10 −2
- `docs/marketing/posts/48-update-window-telegram.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `app-core.js` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.8"></a>
## v3.28.8 — 16 июня 2026

✨ окна обновления («Доступно обновление» и «Обновлено») — добавлена ссылка на Telegram-канал @dndlistru с анонсами обновлений, опросами и новостями

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/112f60bd...1442c0d9) · 6 файлов, +100 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`1442c0d9`](https://github.com/D1MANYCH/dnd-app/commit/1442c0d9) v3.28.8: feat(ui): окна обновления («Доступно обновление» и «Обновлено») — добавлена ссылка на Telegram-канал @dndlistru с анонсами обновлений, опросами и новостями

**Файлы (6):**

- `index.html` +28 −28
- `style.css` +41 −0
- `data.js` +11 −3
- `app-ui.js` +13 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.7"></a>
## v3.28.7 — 15 июня 2026

🐛 интерактивный тур: исправлено затемнение фона — на части браузеров и при зуме экран не темнел, подсказки накладывались на светлый интерфейс и подсветка не совпадала с кнопками; затемнение переведено на сплошные панели вокруг подсвеченного элемента

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/cfedfb78...112f60bd) · 7 файлов, +125 −73

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`8002c1c8`](https://github.com/D1MANYCH/dnd-app/commit/8002c1c8) chore(docs): релиз-пост 47 (интерактивный тур v3.28.6)
- [`112f60bd`](https://github.com/D1MANYCH/dnd-app/commit/112f60bd) v3.28.7: fix(ui): затемнение тура — на части браузеров и при зуме box-shadow 9999px не рендерился (экран не темнел, подсказки на светлом фоне, подсветка не совпадала); замена на 4 сплошные панели вокруг подсвеченного элемента + рамка

**Файлы (7):**

- `app-help.js` +41 −26
- `index.html` +28 −28
- `style.css` +16 −15
- `docs/marketing/posts/47-interactive-tour.txt` +23 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.6"></a>
## v3.28.6 — 15 июня 2026

✨ интерактивный тур по интерфейсу: затемнение с подсветкой реальных кнопок и пояснениями, шаги Назад/Далее/Готово со счётчиком; тур по главному экрану (новый персонаж, готовый билд, копии, настройки) и по листу персонажа (разделы, кубики, хиты и класс доспеха); запускается из приветствия, при первом открытии персонажа и кнопкой в справке; для уровня «первый раз в D&D» добавлены пояснения терминов (d20, хиты, КД)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ea1bc4f2...cfedfb78) · 8 файлов, +518 −32

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b8a832e7`](https://github.com/D1MANYCH/dnd-app/commit/b8a832e7) chore(docs): релиз-пост 46 (приветствие первого запуска v3.28.5)
- [`cfedfb78`](https://github.com/D1MANYCH/dnd-app/commit/cfedfb78) v3.28.6: feat(ui): интерактивный тур по интерфейсу — затемнение с подсветкой реальных кнопок и пояснениями (Назад/Далее/Готово, счётчик); туры по главному экрану и листу персонажа; запуск из приветствия, при первом открытии персонажа и из справки; для новичков пояснения терминов (d20, хиты, КД)

**Файлы (8):**

- `app-help.js` +315 −0
- `style.css` +131 −0
- `index.html` +29 −28
- `docs/marketing/posts/46-welcome-onboarding.txt` +24 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `app-core.js` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.28.5"></a>
## v3.28.5 — 15 июня 2026

✨ приветствие первого запуска — на старте выбор уровня знакомства с D&D (новичок / знаю игру); новичку краткий разбор «что такое D&D» со ссылкой на правила; «Показать обучение заново» в настройках

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0ee24085...ea1bc4f2) · 7 файлов, +411 −32

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`982afd7d`](https://github.com/D1MANYCH/dnd-app/commit/982afd7d) chore(docs): релиз-пост 45 (контекстная справка v3.28.4)
- [`ea1bc4f2`](https://github.com/D1MANYCH/dnd-app/commit/ea1bc4f2) v3.28.5: feat(ui): приветствие первого запуска — на старте выбор уровня знакомства с D&D (новичок / знаю игру); новичку краткий разбор «что такое D&D» со ссылкой на правила; «Показать обучение заново» в настройках

**Файлы (7):**

- `style.css` +166 −0
- `index.html` +96 −28
- `app-help.js` +108 −0
- `docs/marketing/posts/45-help-context-buttons.txt` +24 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.4"></a>
## v3.28.4 — 15 июня 2026

✨ контекстная справка: кнопка «❓ Справка» в каждой вкладке (лист, заклинания, инвентарь, бой, записи, мир, журнал) и в окне кубиков открывает help-центр на нужном разделе; на листе кнопка перенесена в строку «Основа персонажа», кнопка «Изменить» сделана компактнее

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3ebaf42f...0ee24085) · 6 файлов, +128 −33

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9f7f9c90`](https://github.com/D1MANYCH/dnd-app/commit/9f7f9c90) chore(docs): релиз-пост 44 (раскладка характеристик 2024 v3.28.3)
- [`0ee24085`](https://github.com/D1MANYCH/dnd-app/commit/0ee24085) v3.28.4: feat(ui): контекстная справка — кнопка «❓ Справка» в каждой вкладке и окне кубиков открывает help-центр на нужном разделе; на листе кнопка в строке «Основа персонажа», «Изменить» компактнее

**Файлы (6):**

- `index.html` +46 −29
- `style.css` +51 −0
- `docs/marketing/posts/44-stats-2024-layout.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.3"></a>
## v3.28.3 — 15 июня 2026

🐛 характеристики 2024 — шапка карточки в одну строку (имя + модификатор + значение), колонки выровнены по высоте (masonry), пассивная внимательность отдельной строкой под колонками; убрано пустое пространство снизу

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/acbbf0e6...3ebaf42f) · 6 файлов, +130 −63

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`fbbd690b`](https://github.com/D1MANYCH/dnd-app/commit/fbbd690b) chore(docs): релиз-пост 43 (справочный центр v3.28.2)
- [`3ebaf42f`](https://github.com/D1MANYCH/dnd-app/commit/3ebaf42f) v3.28.3: fix(ui): характеристики 2024 — шапка карточки в одну строку (имя + модификатор + значение), выровненные колонки (masonry), пассивная внимательность отдельной строкой; убрано пустое пространство снизу

**Файлы (6):**

- `index.html` +47 −49
- `style.css` +40 −10
- `docs/marketing/posts/43-help-center.txt` +26 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.2"></a>
## v3.28.2 — 15 июня 2026

✨ справочный центр: пункт «❓ Справка» в боковом меню открывает модалку с разделами по вкладкам (что такое D&D, с чего начать, лист, заклинания, инвентарь, бой, мир, записи, журнал, кубики, данные)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/348878d6...acbbf0e6) · 7 файлов, +404 −32

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`101c4f2d`](https://github.com/D1MANYCH/dnd-app/commit/101c4f2d) chore(docs): релиз-пост 42 (карточки персонажей v3.28.1)
- [`acbbf0e6`](https://github.com/D1MANYCH/dnd-app/commit/acbbf0e6) v3.28.2: feat(ui): справочный центр — пункт «❓ Справка» в боковом меню открывает модалку с разделами по вкладкам (что такое D&D, с чего начать, лист, заклинания, инвентарь, бой, мир, записи, журнал, кубики, данные)

**Файлы (7):**

- `index.html` +212 −27
- `style.css` +112 −0
- `app-help.js` +47 −0
- `data.js` +11 −3
- `docs/marketing/posts/42-character-card-layout.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1

</details>

<a id="v3.28.1"></a>
## v3.28.1 — 14 июня 2026

🐛 карточки персонажей: имя на всю ширину первой строкой (видно полностью), кнопки вынесены в отдельный нижний ряд, одинаковая высота соседних карточек в сетке, мировоззрение показывается всегда (плейсхолдер «не выбрано»), предыстория — отдельной строкой при наличии

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1c81d36b...348878d6) · 7 файлов, +102 −40

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`a66c3217`](https://github.com/D1MANYCH/dnd-app/commit/a66c3217) chore(docs): релиз-пост 41 (сворачиваемые характеристики + фиксы v3.28.0)
- [`348878d6`](https://github.com/D1MANYCH/dnd-app/commit/348878d6) v3.28.1: fix(ui): карточки персонажей — имя на всю ширину первой строкой, кнопки отдельным нижним рядом, одинаковая высота соседних карточек, мировоззрение всегда видно (плейсхолдер «не выбрано»), предыстория строкой при наличии

**Файлы (7):**

- `index.html` +27 −27
- `style.css` +33 −2
- `docs/marketing/posts/41-stats-collapse-fixes.txt` +17 −0
- `app-core.js` +8 −7
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.28.0"></a>
## v3.28.0 — 14 июня 2026

✨ Характеристики: сворачиваемая секция (кнопка-стрелка, состояние запоминается) + на телефоне компактные карточки в 2 колонки, навыки/спасброски вынесены в отдельные секции; фикс: текст кнопок-чипов (сортировка/редакция/фильтры) не пропадает при наведении

🐛 Выравнивание: элементы характеристик по центру строк (значок экспертизы «E» больше не уезжает вверх); в окне кубиков × и «Бросить» выровнены по центру

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/87d9638a...1c81d36b) · 7 файлов, +150 −37

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`4200c6c9`](https://github.com/D1MANYCH/dnd-app/commit/4200c6c9) chore(docs): релиз-пост 40 (исправления вёрстки v3.27.2)
- [`1c81d36b`](https://github.com/D1MANYCH/dnd-app/commit/1c81d36b) v3.28.0: feat(ui): сворачиваемые характеристики + 2 колонки на телефоне; фиксы наведения кнопок-чипов и выравнивания (экспертиза «E», × и «Бросить» в окне кубиков)

**Файлы (7):**

- `index.html` +29 −28
- `style.css` +48 −2
- `app-ui.js` +40 −3
- `docs/marketing/posts/40-ui-fixes.txt` +14 −0
- `data.js` +11 −2
- `CHANGELOG.md` +7 −1
- `sw.js` +1 −1

</details>

<a id="v3.27.2"></a>
## v3.27.2 — 14 июня 2026

🐛 Полировка UI: разделитель списка персонажей и кнопок на главной; полные имена персонажей (перенос строк); выпадающие списки в тон теме; поля основы и мировоззрения не обрезаются (один столбец); статус-бар не перекрывает шапку на малых экранах

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ca95c54e...87d9638a) · 7 файлов, +121 −55

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`dea50b6e`](https://github.com/D1MANYCH/dnd-app/commit/dea50b6e) chore(docs): релиз-пост 39 (полировка интерфейса v3.27.1)
- [`87d9638a`](https://github.com/D1MANYCH/dnd-app/commit/87d9638a) v3.27.2: fix(ui): полировка вёрстки — полные имена персонажей, читаемые поля основы/мировоззрения, тематические выпадающие списки, статус-бар не перекрывает шапку, разделитель на главной

**Файлы (7):**

- `index.html` +48 −46
- `style.css` +24 −5
- `app-ui.js` +19 −0
- `docs/marketing/posts/39-ui-polish.txt` +13 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.27.1"></a>
## v3.27.1 — 14 июня 2026

✨ UI6-6 — полировка вкладок: плоские поверхности и спокойные ховеры на остатках (заклинания/инвентарь/бой/заметки/отряд/журнал/создание), модалках, дайс-модалке и right-rail; мягче тени модалок/дроверов; убран глянец полосы ХП

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b1f011a8...ca95c54e) · 6 файлов, +151 −129

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`5dcb507b`](https://github.com/D1MANYCH/dnd-app/commit/5dcb507b) chore(docs): релиз-пост 38 (fantasy-modern рефреш v3.27.0)
- [`ca95c54e`](https://github.com/D1MANYCH/dnd-app/commit/ca95c54e) v3.27.1: feat(ui): UI6-6 — полировка остатков вкладок/модалок/right-rail (плоские поверхности, спокойные ховеры, мягче тени, убран глянец полосы ХП)

**Файлы (6):**

- `style.css` +91 −97
- `index.html` +27 −27
- `docs/marketing/posts/38-fantasy-modern-refresh.txt` +15 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.27.0"></a>
## v3.27.0 — 13 июня 2026

✨ UI6-5 — fantasy-modern: мягче тени (меньше alpha, blur ≤24px), единый ease без «прыжка», кнопки и карточки без глянцевых градиентов и подскоков при наведении

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4e778bec...b1f011a8) · 6 файлов, +105 −79

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`76d37685`](https://github.com/D1MANYCH/dnd-app/commit/76d37685) chore(docs): релиз-пост 37 (лист характеристик 2024 v3.26.0)
- [`b1f011a8`](https://github.com/D1MANYCH/dnd-app/commit/b1f011a8) v3.27.0: feat(ui): UI6-5 — fantasy-modern рефреш токенов (плоские кнопки/карточки, мягче тени, спокойнее анимации)

**Файлы (6):**

- `style.css` +46 −48
- `index.html` +27 −27
- `docs/marketing/posts/37-stats-2024-cards.txt` +15 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.26.0"></a>
## v3.26.0 — 13 июня 2026

✨ UI6-4 — лист характеристик в стиле 2024: спасброски и навыки сгруппированы в карточках характеристик (вид по умолчанию), тумблер «Классический» в настройках

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d3711e81...4e778bec) · 9 файлов, +597 −163

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`e715b132`](https://github.com/D1MANYCH/dnd-app/commit/e715b132) chore(docs): релиз-пост 36 (переключатель редакции 2014/2024 v3.25.11)
- [`4e778bec`](https://github.com/D1MANYCH/dnd-app/commit/4e778bec) v3.26.0: feat(ui): UI6-4 — лист характеристик в стиле 2024 (компактные карточки + тумблер «Классический»)

**Файлы (9):**

- `style.css` +243 −73
- `index.html` +117 −77
- `app-combat.js` +70 −8
- `app-ui.js` +75 −0
- `tests/headless.js` +61 −1
- `docs/marketing/posts/36-edition-switcher.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.11"></a>
## v3.25.11 — 13 июня 2026

✨ UI6-3: переключатель редакции 2014/2024 на главном экране (2024 — заглушка «в разработке»)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/a2bf634d...d3711e81) · 7 файлов, +159 −31

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`19180168`](https://github.com/D1MANYCH/dnd-app/commit/19180168) chore(docs): релиз-пост 35 (главный экран — сетка на десктопе v3.25.10)
- [`d3711e81`](https://github.com/D1MANYCH/dnd-app/commit/d3711e81) v3.25.11: feat(ui): UI6-3 — переключатель редакции 2014/2024 на главном экране (2024 — заглушка «в разработке»)

**Файлы (7):**

- `style.css` +67 −0
- `index.html` +32 −27
- `app-ui.js` +29 −0
- `docs/marketing/posts/35-desktop-home-grid.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.10"></a>
## v3.25.10 — 13 июня 2026

✨ UI6-2: главный экран — основные действия и утилиты в адаптивную сетку, список персонажей в 2 колонки на десктопе (≥768px); на телефоне всё стопкой

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8cf3447a...a2bf634d) · 5 файлов, +69 −31

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`a2bf634d`](https://github.com/D1MANYCH/dnd-app/commit/a2bf634d) v3.25.10: feat(ui): UI6-2 — главный экран: действия и список персонажей в адаптивную сетку на десктопе (≥768px)

**Файлы (5):**

- `index.html` +31 −27
- `style.css` +21 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.9"></a>
## v3.25.9 — 13 июня 2026

🔧 Удалён счётчик Яндекс.Метрики

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/7af2fc2f...8cf3447a) · 5 файлов, +69 −44

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f7cdb478`](https://github.com/D1MANYCH/dnd-app/commit/f7cdb478) chore(docs): релиз-пост 34 (фикс авто-акцента v3.25.8 + план интерфейса)
- [`8cf3447a`](https://github.com/D1MANYCH/dnd-app/commit/8cf3447a) v3.25.9: chore(analytics): удалён счётчик Яндекс.Метрики

**Файлы (5):**

- `index.html` +27 −40
- `docs/marketing/posts/34-accent-fix-and-roadmap.txt` +25 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.8"></a>
## v3.25.8 — 13 июня 2026

🐛 авто-акцент по классу: обновляется при переключении персонажей и возврате на главную; включён по умолчанию (ручной выбор акцента сохраняется); app-ui.js подключён к node-тестам, +9 проверок (БЛОК 13), 225/225

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b73158c7...7af2fc2f) · 9 файлов, +150 −34

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`d7474f7c`](https://github.com/D1MANYCH/dnd-app/commit/d7474f7c) chore(docs): релиз-пост 33 (счётчик Метрики)
- [`7af2fc2f`](https://github.com/D1MANYCH/dnd-app/commit/7af2fc2f) v3.25.8: fix(ui): UI6-1 — авто-акцент по классу обновляется при переключении персонажей + ON по умолчанию

**Файлы (9):**

- `tests/headless.js` +56 −1
- `index.html` +27 −27
- `tests/headless-node.js` +21 −1
- `data.js` +10 −2
- `docs/marketing/posts/33-yandex-metrika.txt` +12 −0
- `app-ui.js` +9 −1
- `app-core.js` +8 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.7"></a>
## v3.25.7 — 13 июня 2026

🔧 Добавлен счётчик Яндекс.Метрики (статистика посещений)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/093ccbf7...b73158c7) · 6 файлов, +90 −32

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`d87e303f`](https://github.com/D1MANYCH/dnd-app/commit/d87e303f) chore(docs): релиз-пост 31 (логи действий по вкладкам)
- [`dffa790c`](https://github.com/D1MANYCH/dnd-app/commit/dffa790c) chore(docs): релиз-пост 32 (итоги серии v3.25.3–3.25.6)
- [`b73158c7`](https://github.com/D1MANYCH/dnd-app/commit/b73158c7) v3.25.7: chore(analytics): счётчик Яндекс.Метрики — статистика посещений (id 109811248) в index.html

**Файлы (6):**

- `index.html` +40 −27
- `docs/marketing/posts/31-module-action-logs.txt` +17 −0
- `docs/marketing/posts/32-series-recap.txt` +15 −0
- `data.js` +11 −3
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.6"></a>
## v3.25.6 — 12 июня 2026

✨ FEAT-LOG-2: явные логи действий (AppLog) в модулях combat/hp/inventory/spells/notes/party — категории combat, hp, character, inventory, spells, notes, party, battle в панели Ctrl+Shift+L

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/964a1113...093ccbf7) · 11 файлов, +135 −36

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`1f3d3ec5`](https://github.com/D1MANYCH/dnd-app/commit/1f3d3ec5) chore(docs): релиз-пост 30 (чистка CSS)
- [`093ccbf7`](https://github.com/D1MANYCH/dnd-app/commit/093ccbf7) v3.25.6: feat(log): FEAT-LOG-2 — явные логи действий в combat/hp/inventory/spells/notes/party: 56 вызовов AppLog, категории combat/hp/character/inventory/spells/notes/party/battle в панели Ctrl+Shift+L

**Файлы (11):**

- `index.html` +27 −27
- `app-party.js` +29 −5
- `app-spells.js` +17 −0
- `data.js` +10 −2
- `app-inventory.js` +11 −0
- `docs/marketing/posts/30-css-cleanup.txt` +11 −0
- `app-combat.js` +9 −0
- `app-hp.js` +9 −0
- `CHANGELOG.md` +6 −1
- `app-notes.js` +5 −0
- `sw.js` +1 −1

</details>

<a id="v3.25.5"></a>
## v3.25.5 — 12 июня 2026

🔧 OPT-7 — чистка мёртвого CSS по отчёту OPT-6: −155 правил и 2 keyframes (~18 КБ, −641 строка), фикс битого комментария light-темы (терялся focus ring)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0e1fa6c7...964a1113) · 8 файлов, +946 −987

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`edf5d161`](https://github.com/D1MANYCH/dnd-app/commit/edf5d161) chore(docs): релиз-пост 29 (фикс 3D-кубиков)
- [`5e208181`](https://github.com/D1MANYCH/dnd-app/commit/5e208181) chore(tools): OPT-6 — отчёт использования CSS (tools/css-usage-report.js + docs/css-usage-report.md)
- [`964a1113`](https://github.com/D1MANYCH/dnd-app/commit/964a1113) v3.25.5: chore(css): OPT-7 — чистка мёртвого CSS по отчёту OPT-6: −155 правил и 2 keyframes (~18 КБ, −641 строка), фикс битого комментария light-темы (терялся focus ring)

**Файлы (8):**

- `docs/css-usage-report.md` +407 −315
- `style.css` +6 −641
- `tools/css-usage-report.js` +477 −0
- `index.html` +27 −27
- `data.js` +10 −2
- `docs/marketing/posts/29-dice-roll-race-fix.txt` +12 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.4"></a>
## v3.25.4 — 12 июня 2026

🐛 Кубики: быстрые повторные броски больше не теряются — новый бросок мгновенно показывает результат предыдущего; устранены каскад таймаутов 10с и двойной куб d20; индикация «…» на время броска

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/bb110283...0e1fa6c7) · 9 файлов, +468 −77

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`5c53eed5`](https://github.com/D1MANYCH/dnd-app/commit/5c53eed5) chore(docs): релиз-пост 28 (ленивый SRD-бестиарий)
- [`8e44521d`](https://github.com/D1MANYCH/dnd-app/commit/8e44521d) chore(tests): TEST-3 — app-spells и app-party в обоих раннерах, тесты 203→216
- [`0e1fa6c7`](https://github.com/D1MANYCH/dnd-app/commit/0e1fa6c7) v3.25.4: fix(dice): сериализация 3D-бросков — новый бросок прерывает предыдущий, устранены каскад таймаутов 10с и двойной d20, индикация «…» на время броска

**Файлы (9):**

- `tests/headless.js` +313 −1
- `app-ui.js` +83 −42
- `index.html` +27 −27
- `data.js` +11 −3
- `docs/marketing/posts/28-lazy-srd-bestiary.txt` +11 −0
- `tests/headless-node.js` +9 −1
- `tests/runner.html` +7 −1
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.3"></a>
## v3.25.3 — 11 июня 2026

🔧 Ленивая загрузка SRD-бестиария: monsters-srd.js + npc-srd.js (~61 КБ) грузятся при открытии пикеров отряда, а не при старте

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/50bcee79...bb110283) · 10 файлов, +144 −94

<details><summary>Коммиты и файлы</summary>

**Коммиты (4):**

- [`3520e4fb`](https://github.com/D1MANYCH/dnd-app/commit/3520e4fb) chore(docs): релиз-пост 26 (ленивые заметки билдов)
- [`0436d132`](https://github.com/D1MANYCH/dnd-app/commit/0436d132) chore(docs): DOCS-1 — актуализация CLAUDE.md и ARCHITECTURE.md
- [`e82ecab1`](https://github.com/D1MANYCH/dnd-app/commit/e82ecab1) chore(docs): релиз-пост 27 (актуализация документации)
- [`bb110283`](https://github.com/D1MANYCH/dnd-app/commit/bb110283) v3.25.3: chore(perf): PERF-3 — ленивый SRD-бестиарий (~61 КБ) при открытии пикеров

**Файлы (10):**

- `index.html` +38 −29
- `docs/ARCHITECTURE.md` +33 −16
- `docs/ui-v3-plan.md` +0 −43
- `app-party.js` +23 −0
- `docs/marketing/posts/27-docs-refresh.txt` +14 −0
- `data.js` +10 −2
- `docs/marketing/posts/26-lazy-build-notes.txt` +11 −0
- `CLAUDE.md` +8 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.2"></a>
## v3.25.2 — 11 июня 2026

🔧 PERF-2: заметки билдов (build-notes-data.js, ~530 КБ) грузятся лениво при применении билда — быстрее холодный старт

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1f861741...50bcee79) · 14 файлов, +549 −37

<details><summary>Коммиты и файлы</summary>

**Коммиты (5):**

- [`7bfbf148`](https://github.com/D1MANYCH/dnd-app/commit/7bfbf148) test(data): round-trip импорт/экспорт + миграции + инвентарь (БЛОКИ 9b/10) + снапшот localStorage в раннере (TEST-2)
- [`8954e55d`](https://github.com/D1MANYCH/dnd-app/commit/8954e55d) chore(docs): релиз-пост 24 (автотесты импорта/экспорта и инвентаря)
- [`d472554d`](https://github.com/D1MANYCH/dnd-app/commit/d472554d) chore(ci): GitHub Action на тесты + проверка инварианта релиза (TOOL-3)
- [`9a211d15`](https://github.com/D1MANYCH/dnd-app/commit/9a211d15) chore(docs): релиз-пост 25 (CI на GitHub Actions)
- [`50bcee79`](https://github.com/D1MANYCH/dnd-app/commit/50bcee79) v3.25.2: chore(perf): PERF-2 — ленивые заметки билдов (~530 КБ) при применении

**Файлы (14):**

- `tests/headless.js` +308 −1
- `tools/check-invariant.js` +104 −0
- `index.html` +38 −28
- `.github/workflows/tests.yml` +19 −0
- `docs/marketing/posts/24-import-export-inventory-tests.txt` +17 −0
- `data.js` +11 −3
- `docs/marketing/posts/25-ci-github-actions.txt` +14 −0
- `app-core.js` +11 −0
- `dev-verify-builds.js` +8 −0
- `CHANGELOG.md` +6 −1
- `character-builds.js` +5 −2
- `tests/headless-node.js` +5 −1
- `sw.js` +1 −1
- `tests/runner.html` +2 −0

</details>

<a id="v3.25.1"></a>
## v3.25.1 — 10 июня 2026

🐛 Импорт бэкапа больше не ломает список персонажей, если у персонажа в файле нет боевых полей (combat/stats и др.) — недостающее достраивается значениями по умолчанию

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9c61a015...1f861741) · 7 файлов, +134 −31

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ded81313`](https://github.com/D1MANYCH/dnd-app/commit/ded81313) chore(docs): релиз-пост v3.25.0 (бэкапы, защита хранилища, быстрый старт)
- [`1f861741`](https://github.com/D1MANYCH/dnd-app/commit/1f861741) v3.25.1: fix(data): импорт персонажа без combat/stats не роняет список персонажей

**Файлы (7):**

- `tests/headless.js` +55 −0
- `index.html` +27 −27
- `app-core.js` +21 −0
- `docs/marketing/posts/23-backups-storage-fast-start.txt` +14 −0
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.25.0"></a>
## v3.25.0 — 10 июня 2026

✨ DATA-2: авто-резервные копии в IndexedDB — ежедневный снапшот, снапшот перед импортом и ручная кнопка (хранятся 7 последних, восстановление списком на экране персонажей); пользовательские заклинания теперь входят в полный бэкап (exportData/importData)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/48a99414...9c61a015) · 6 файлов, +306 −48

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`9c61a015`](https://github.com/D1MANYCH/dnd-app/commit/9c61a015) v3.25.0: feat(data): DATA-2 — авто-бэкап в IndexedDB + userSpells в конверте экспорта

**Файлы (6):**

- `app-backup.js` +208 −0
- `app-core.js` +45 −18
- `index.html` +35 −26
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +2 −1

</details>

<a id="v3.24.35"></a>
## v3.24.35 — 10 июня 2026

✨ DATA-1: защита данных от вытеснения браузером (navigator.storage.persist) + индикатор хранилища на экране персонажей (статус и занятый объём)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/332920d8...48a99414) · 5 файлов, +102 −30

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`48a99414`](https://github.com/D1MANYCH/dnd-app/commit/48a99414) v3.24.35: feat(data): DATA-1 — persistent storage + индикатор хранилища

**Файлы (5):**

- `app-core.js` +58 −0
- `index.html` +27 −26
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.34"></a>
## v3.24.34 — 10 июня 2026

🔧 PERF-1: PDF-стек (jsPDF + Roboto + app-pdf, ~600 КБ) грузится лениво по первому клику 📄 — быстрее холодный старт

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/84b0c347...332920d8) · 7 файлов, +203 −32

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`7e67f65b`](https://github.com/D1MANYCH/dnd-app/commit/7e67f65b) chore(docs): релиз-пост v3.24.33 (заклинания при повышении уровня + фильтр поиска)
- [`0e70a7e2`](https://github.com/D1MANYCH/dnd-app/commit/0e70a7e2) chore(marketing): список конкретных сообществ для посева (со ссылками)
- [`332920d8`](https://github.com/D1MANYCH/dnd-app/commit/332920d8) v3.24.34: chore(perf): PERF-1 — ленивый PDF-стек (~600 КБ) по первому клику

**Файлы (7):**

- `docs/marketing/seeding-targets.md` +102 −0
- `index.html` +68 −27
- `data.js` +11 −3
- `docs/marketing/posts/22-levelup-spells-search-filter.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1
- `docs/marketing/README.md` +1 −0

</details>

<a id="v3.24.33"></a>
## v3.24.33 — 8 июня 2026

🐛 Окно повышения уровня: убран встроенный поиск заклинаний — теперь рекомендации билда с кнопкой добавить + кнопка перехода на вкладку «Заклинания». Поиск заклинаний по умолчанию ограничен классом персонажа и не показывает уровни выше доступного

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f942dbe1...84b0c347) · 7 файлов, +116 −129

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`84b0c347`](https://github.com/D1MANYCH/dnd-app/commit/84b0c347) v3.24.33: fix(ui): окно повышения уровня — два пути для заклинаний + фильтр поиска

**Файлы (7):**

- `app-hp.js` +40 −88
- `index.html` +26 −26
- `app-spells.js` +28 −2
- `style.css` +5 −9
- `data.js` +10 −2
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.32"></a>
## v3.24.32 — 8 июня 2026

🐛 Повышение уровня: рекомендации заклинаний — если билд не указывает конкретные, предлагаются заклинания нужного уровня из списка класса (с фильтром по школе); 3 flavor-имени в билдах теперь резолвятся

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4b5b0634...f942dbe1) · 8 файлов, +163 −36

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`1cd3c2ff`](https://github.com/D1MANYCH/dnd-app/commit/1cd3c2ff) chore(docs): релиз-пост v3.24.31 (полировка UI: брейкпоинты/фокус/шевроны)
- [`f942dbe1`](https://github.com/D1MANYCH/dnd-app/commit/f942dbe1) v3.24.32: fix(ui): рекомендации заклинаний при ап-левеле — фолбэк по классу

**Файлы (8):**

- `app-hp.js` +94 −5
- `index.html` +26 −26
- `data.js` +10 −2
- `docs/marketing/posts/21-ui-polish-breakpoints.txt` +12 −0
- `style.css` +9 −0
- `CHANGELOG.md` +6 −1
- `app-core.js` +5 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.31"></a>
## v3.24.31 — 8 июня 2026

🐛 UI5-6: консолидация мобильных брейкпоинтов (единый порог 640), единый :focus-visible для клавиатурной навигации, плавная анимация шевронов аккордеонов

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/54a22513...4b5b0634) · 7 файлов, +96 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b29b2564`](https://github.com/D1MANYCH/dnd-app/commit/b29b2564) chore(docs): релиз-пост v3.24.30 (мобильные правки)
- [`4b5b0634`](https://github.com/D1MANYCH/dnd-app/commit/4b5b0634) v3.24.31: fix(ui): UI5-6 — брейкпоинты, :focus-visible, шевроны аккордеонов

**Файлы (7):**

- `index.html` +26 −26
- `style.css` +36 −9
- `data.js` +11 −3
- `docs/marketing/posts/20-mobile-polish.txt` +14 −0
- `CHANGELOG.md` +6 −1
- `app-ui.js` +2 −3
- `sw.js` +1 −1

</details>

<a id="v3.24.30"></a>
## v3.24.30 — 7 июня 2026

🐛 Фон перестаёт трястись при перетаскивании слайдеров непрозрачности и размытия фона — на время перетаскивания отключаются CSS-переходы поверхностей и ставится на паузу анимированный фон (раньше частая смена значений ре-триггерила переходы и пересчёт размытия → дрожание интерфейса)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3ec4f046...54a22513) · 7 файлов, +92 −31

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`54a22513`](https://github.com/D1MANYCH/dnd-app/commit/54a22513) v3.24.30: fix(ui): фон не трясётся при перетаскивании слайдеров непрозрачности/размытия

**Файлы (7):**

- `index.html` +26 −26
- `app-ui.js` +25 −0
- `CHANGELOG.md` +13 −1
- `data.js` +10 −2
- `style.css` +11 −0
- `bg-orbits.js` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.29"></a>
## v3.24.29 — 7 июня 2026

✨ UI5-5: мобильная разгрузка — на телефоне (≤640px) дефолт компактной плотности при отсутствии явного выбора пользователя; тач-таргеты листа ≥44px (чекбоксы и броски навыков/спасбросков, ± характеристик, HP-пресеты, истощение, вложенные аккордеоны)

🐛 Окно броска кубиков на телефоне больше не обрезается снизу — все 6 кубиков, поле формулы и кнопка сброса помещаются без прокрутки (уменьшены арена и кнопки, max-height 92vh)

🐛 Заклинания на телефоне: название больше не сжимается до одной буквы — текст школы скрыт (остаётся цветная иконка), название получает место

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9743a27d...3ec4f046) · 34 файлов, +484 −77

<details><summary>Коммиты и файлы</summary>

**Коммиты (5):**

- [`86f1ec19`](https://github.com/D1MANYCH/dnd-app/commit/86f1ec19) chore(docs): CHANGELOG.md v3.24.23–v3.24.28 + релиз-пост 19
- [`5317c56d`](https://github.com/D1MANYCH/dnd-app/commit/5317c56d) chore(marketing): обновить ссылку на чат с invite на @DnDSocialru
- [`b906cff3`](https://github.com/D1MANYCH/dnd-app/commit/b906cff3) feat(tools): автогенерация CHANGELOG.md встроена в bump-version
- [`d4b3de86`](https://github.com/D1MANYCH/dnd-app/commit/d4b3de86) chore(marketing): план посева Этапа 1 (VK, TG-чаты, Discord, форумы)
- [`3ec4f046`](https://github.com/D1MANYCH/dnd-app/commit/3ec4f046) v3.24.29: feat(ui): UI5-5 мобильная разгрузка + фиксы дайс-модалки и имён заклинаний

**Файлы (34):**

- `docs/marketing/seeding-plan.md` +238 −0
- `style.css` +59 −2
- `index.html` +30 −27
- `app-ui.js` +32 −2
- `CHANGELOG.md` +31 −1
- `tools/bump-version.js` +15 −3
- `tools/gen-changelog.js` +14 −3
- `data.js` +13 −3
- `docs/marketing/posts/19-pc-two-column-sheet.txt` +15 −1
- `docs/marketing/first-week-posts.md` +6 −6
- `CLAUDE.md` +5 −4
- `docs/marketing/README.md` +4 −3
- `docs/marketing/posts/01-zachem-sdelal.txt` +1 −1
- `docs/marketing/posts/02-changelog.txt` +1 −1
- `docs/marketing/posts/03-features.txt` +1 −1
- `docs/marketing/posts/04-poll.txt` +1 −1
- `docs/marketing/posts/05-vs-dndbeyond.txt` +1 −1
- `docs/marketing/posts/06-stabilizaciya.txt` +1 −1
- `docs/marketing/posts/07-pdf-export.txt` +1 −1
- `docs/marketing/posts/08-srd-bestiary.txt` +1 −1
- `docs/marketing/posts/09-familiars.txt` +1 −1
- `docs/marketing/posts/10-offline-cleanup.txt` +1 −1
- `docs/marketing/posts/11-build-autoleveling.txt` +1 −1
- `docs/marketing/posts/12-spell-recommendations.txt` +1 −1
- `docs/marketing/posts/13-spell-audit-l2.txt` +1 −1
- `docs/marketing/posts/14-spell-audit-l3-l6.txt` +1 −1
- `docs/marketing/posts/15-spell-audit-l7-l9-final.txt` +1 −1
- `docs/marketing/posts/16-build-rec-choices.txt` +1 −1
- `docs/marketing/posts/17-build-asi-subclass-hints.txt` +1 −1
- `docs/marketing/posts/18-session-log.txt` +1 −1
- `docs/marketing/posts/archive/06-stabilizaciya-personal.txt` +1 −1
- `docs/marketing/posts/archive/07-pdf-export-personal.txt` +1 −1
- `docs/marketing/posts/archive/08-srd-bestiary-personal.txt` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.28"></a>
## v3.24.28 — 6 июня 2026

🐛 UI5-4: компактная карточка личности на ПК — поля класс/подкласс/раса/предыстория/мировоззрение в 2 колонки (шапка и блок расы во всю ширину), высота карточки ~на треть меньше

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6888d9d1...9743a27d) · 4 файла, +171 −70

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`9743a27d`](https://github.com/D1MANYCH/dnd-app/commit/9743a27d) v3.24.28: feat(ui): UI5-3 отступы листа + UI5-4 ПК-многоколоночная раскладка

**Файлы (4):**

- `style.css` +83 −38
- `index.html` +45 −29
- `data.js` +42 −2
- `sw.js` +1 −1

</details>

<a id="v3.24.27"></a>
## v3.24.27 — 6 июня 2026

🐛 UI5-4: баланс ПК-колонок листа — классовые ресурсы/умения в левую колонку (выровнял высоты ~Δ250px), правая = владения/прихвостни/оружие; Урон/Лечение — адаптивная сетка (2-в-ряд где влезает, иначе в столбик, не обрезаются)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.26"></a>
## v3.24.26 — 6 июня 2026

🐛 UI5-4 фикс по ревью: широкие карточки листа (характеристики/спасброски/навыки) во всю ширину над колонками; спасброски/урон-лечение перестроены на адаптивные сетки — больше не обрезаются в узкой колонке; навыки плотнее (3 колонки)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.25"></a>
## v3.24.25 — 6 июня 2026

✨ UI5-4 — ПК-многоколоночная раскладка листа персонажа: карточки в 2 колонки на широких экранах (стабильные flex-колонки, мобайл без изменений), полноширинные кнопки больше не растягиваются на весь экран

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.24"></a>
## v3.24.24 — 6 июня 2026

✨ UI5-3 — отступы и ритм листа персонажа на токены --sp-*/--r-* (плотность-aware): .card/.field-блоки, сетки навыков/спасбросков/состояний/характеристик, AC-секция, фильтр-бар, заголовки секций

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.23"></a>
## v3.24.23 — 6 июня 2026

✨ UI5-2: поля ввода листа на дизайн-систему .field (единая высота --control-h, плотность-aware) — 14 инпутов/селектов; радиус HP-полей → токен --r-sm; кнопка 🎲 имени и поле одной высоты

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/45f6b536...6888d9d1) · 6 файлов, +104 −52

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`97894c9b`](https://github.com/D1MANYCH/dnd-app/commit/97894c9b) chore(docs): CHANGELOG.md v3.24.16–v3.24.22 + релиз-пост 18 (журнал сессии)
- [`6888d9d1`](https://github.com/D1MANYCH/dnd-app/commit/6888d9d1) v3.24.23: feat(ui): UI5-2 — поля ввода листа на дизайн-систему .field

**Файлы (6):**

- `index.html` +40 −40
- `CHANGELOG.md` +27 −1
- `style.css` +11 −7
- `data.js` +11 −3
- `docs/marketing/posts/18-session-log.txt` +14 −0
- `sw.js` +1 −1

</details>

<a id="v3.24.22"></a>
## v3.24.22 — 5 июня 2026

✨ система логирования сессии — журнал «действие → что после» с авто-перехватом (клики/console/ошибки) + явные логи с корреляц. ID (кубики/навигация/персонаж); панель просмотра (Ctrl+Shift+L или дровер «Логи сессии») с фильтром по категории/уровню, «Скопировать всё»/«Скачать», persist последней сессии в localStorage (переживает перезагрузку)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/bf7e7ccf...45f6b536) · 7 файлов, +516 −28

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`45f6b536`](https://github.com/D1MANYCH/dnd-app/commit/45f6b536) v3.24.22: feat(log): система логирования сессии — авто-перехват + явные логи + панель просмотра

**Файлы (7):**

- `app-log.js` +375 −0
- `index.html` +51 −25
- `style.css` +73 −0
- `data.js` +10 −2
- `app-ui.js` +3 −0
- `sw.js` +2 −1
- `app-core.js` +2 −0

</details>

<a id="v3.24.21"></a>
## v3.24.21 — 5 июня 2026

🐛 3D-кубики снова работают на сервере/проде — физика dice-box переведена в основной поток (offscreen:false). Дефолтный OffscreenCanvas-воркер не рапортовал оседание костей → onRollComplete не вызывался → таймаут 10с на каждый бросок; добавлена страховка от нулевого (0×0) буфера canvas

✨ подсказка в окне кубиков при запуске по file:// — 3D-движок (ES-модуль) блокируется CORS на файловом протоколе, доступны только плоские; для 3D запускать через сервер (localhost) или на сайте

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/72fff6c2...bf7e7ccf) · 14 файлов, +628 −100

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`1b111d2c`](https://github.com/D1MANYCH/dnd-app/commit/1b111d2c) chore(docs): CHANGELOG.md v3.24.12–v3.24.13 + релиз-посты 16–17
- [`faac4180`](https://github.com/D1MANYCH/dnd-app/commit/faac4180) test(builds): автолевелинг — регресс-тесты (BLOCK 8) + dev-verify симуляция 1→20 (BUILD-LVL-7)
- [`bf7e7ccf`](https://github.com/D1MANYCH/dnd-app/commit/bf7e7ccf) v3.24.21: fix(dice) 3D-кубики onscreen + UI5 фиксы листа персонажа

**Файлы (14):**

- `tests/headless.js` +193 −1
- `style.css` +121 −51
- `dev-verify-builds.js` +112 −1
- `index.html` +38 −37
- `data.js` +36 −3
- `app-ui.js` +37 −0
- `app-combat.js` +30 −3
- `docs/marketing/posts/16-build-rec-choices.txt` +14 −0
- `app-core.js` +11 −1
- `CHANGELOG.md` +11 −1
- `docs/marketing/posts/17-build-asi-subclass-hints.txt` +12 −0
- `tests/headless-node.js` +8 −0
- `tests/runner.html` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.16"></a>
## v3.24.16 — 5 июня 2026

🐛 UI5-FB добор: бросок навыка — «+N» стала попадаемым чипом (48×36 ПК / 52×40 моб; регресс от FB-5 width:auto, была 30px → «нельзя кинуть»); секция «Владения» — кнопки «Добавить»/«×» по контенту на ПК (не во всю ширину), на телефоне «Добавить» широкие

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.15"></a>
## v3.24.15 — 5 июня 2026

🐛 UI5-FB: фиксы листа по ревью — модалка разблокировки основы (кнопка «Разблокировать», не-деструктивный стиль); карточки состояний (иконка крупно по центру сверху, равная высота, сворачивание длинных описаний line-clamp + «Подробнее»); смягчены цвета активных категорий состояний; выровнены кнопки ±истощения; раскладка навыков (адаптивные колонки, порядок, выравнивание); инлайн-пилюли ряда бейджа билда + комфортная кнопка «План»

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.14"></a>
## v3.24.14 — 4 июня 2026

✨ единый стиль кнопок на листе персонажа: акционные кнопки переведены на систему .btn (повышение/откат уровня, отдых, урон/лечение, бросок кости хитов, спасброски смерти, история ХП, добавить оружие/прихвостня) — единые высота/радиус/отступы; добавлен токен --control-h

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.13"></a>
## v3.24.13 — 4 июня 2026

✨ подсветка рекомендованных билдом характеристик в ASI-модалке + хинт рекомендованного подкласса у селектора (BUILD-LVL-6)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c2081274...72fff6c2) · 7 файлов, +93 −30

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`72fff6c2`](https://github.com/D1MANYCH/dnd-app/commit/72fff6c2) v3.24.13: feat(builds): подсветка рекомендованных характеристик в ASI-модалке + хинт подкласса автобилда (BUILD-LVL-6)

**Файлы (7):**

- `index.html` +27 −26
- `app-combat.js` +21 −0
- `app-core.js` +15 −0
- `style.css` +14 −0
- `data.js` +10 −2
- `app-ui.js` +5 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.12"></a>
## v3.24.12 — 4 июня 2026

✨ Автобилды: рекомендованные классовые выборы для 18 билдов (стиль боя, метамагия, пактный дар+воззвания, экспертиза) — подсветка совета в guided level-up, модалке выбора и карточках; «применить рекомендации разом» поддерживает multi-выборы с учётом лимита и доступности.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4ca806da...c2081274) · 9 файлов, +159 −57

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`876fb0a5`](https://github.com/D1MANYCH/dnd-app/commit/876fb0a5) chore(docs): CHANGELOG.md v3.24.10–v3.24.11 + релиз-пост 15
- [`c2081274`](https://github.com/D1MANYCH/dnd-app/commit/c2081274) v3.24.12: feat(builds): рекомендованные классовые выборы автобилдов (BUILD-LVL-5)

**Файлы (9):**

- `app-hp.js` +43 −14
- `index.html` +25 −25
- `class-choices.js` +16 −10
- `app-core.js` +19 −3
- `character-builds.js` +18 −0
- `docs/marketing/posts/15-spell-audit-l7-l9-final.txt` +15 −0
- `data.js` +11 −3
- `CHANGELOG.md` +11 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.11"></a>
## v3.24.11 — 3 июня 2026

🐛 кросс-редакционная сверка PH14↔PH24 (SPELL-AUDIT-6): коллизия имён «Порча» (Bane) / «Сглаз» (Hex) разрешена; классы 2024 для Предзнаменования, Прорицания, Усиления способности

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d6b98263...4ca806da) · 9 файлов, +408 −37

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`4ca806da`](https://github.com/D1MANYCH/dnd-app/commit/4ca806da) v3.24.11: fix(spells) кросс-редакционная сверка PH14↔PH24 (SPELL-AUDIT-6)

**Файлы (9):**

- `docs/spell-audit/L_XEDITION.md` +153 −0
- `tools/spell-xedition.js` +138 −0
- `docs/spell-audit/_L6_progress.md` +66 −0
- `index.html` +25 −25
- `spells.js` +9 −6
- `data.js` +10 −2
- `app-core.js` +4 −1
- `character-builds.js` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.24.10"></a>
## v3.24.10 — 3 июня 2026

🐛 Сверка заклинаний ур.7–9 (PH14+PH24) с dnd.su: 31 правка + удалён дубль Prismatic Spray (#611). Школы: Forcecage→воплощение, Power Word Kill→очарование. Опознан Shapechange (#691/#707). Реворки 2024: Conjure Celestial, Power Word Heal/Stun, Befuddlement, Дуговой клинок 4к12. Power Word Fortify 120 врем.хитов.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/81ab6c9a...d6b98263) · 14 файлов, +349 −97

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`728b5aa5`](https://github.com/D1MANYCH/dnd-app/commit/728b5aa5) chore(docs): CHANGELOG.md v3.24.8–v3.24.9 + релиз-пост 14
- [`d6b98263`](https://github.com/D1MANYCH/dnd-app/commit/d6b98263) v3.24.10: fix(spells) сверка заклинаний ур.7–9 с dnd.su (SPELL-AUDIT-5)

**Файлы (14):**

- `spells.js` +45 −66
- `docs/spell-audit/_L7_progress.md` +108 −0
- `index.html` +25 −25
- `docs/spell-audit/L7_PH24.md` +23 −0
- `docs/spell-audit/L9_PH14.md` +23 −0
- `docs/spell-audit/L7_PH14.md` +22 −0
- `docs/spell-audit/L9_PH24.md` +20 −0
- `docs/spell-audit/L8_PH24.md` +17 −0
- `docs/spell-audit/L8_PH14.md` +16 −0
- `app-core.js` +13 −2
- `docs/marketing/posts/14-spell-audit-l3-l6.txt` +15 −0
- `CHANGELOG.md` +11 −1
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.24.9"></a>
## v3.24.9 — 3 июня 2026

🐛 Сверка заклинаний 5–6 уровней с dnd.su (PHB 2014/2024): 55 правок данных. Школы Высшего восстановления, Изгоняющего удара, Массового лечения ран, Исцеления → ограждение. Реворки 2024: Болезнь (11к8 + отравление), Призыв элементаля, Оживление предметов, Призыв феи. Дезинтеграция — испытание Ловкости вместо атаки; Цепная молния 10к8; Вред 14к6. Удалены 2 дубля «Истинного видения» (= True Seeing 6 ур.). База: 709→707 заклинаний.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4eb48888...81ab6c9a) · 17 файлов, +1164 −287

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`660fe8f3`](https://github.com/D1MANYCH/dnd-app/commit/660fe8f3) chore(docs): CHANGELOG.md v3.24.5–v3.24.7 + релиз-пост 13
- [`81ab6c9a`](https://github.com/D1MANYCH/dnd-app/commit/81ab6c9a) v3.24.9: fix(spells) сверка заклинаний ур.3–6 с dnd.su (SPELL-AUDIT-3..4)

**Файлы (17):**

- `spells.js` +188 −255
- `docs/spell-audit/_L3_progress.md` +390 −0
- `docs/spell-audit/_L5_progress.md` +218 −0
- `index.html` +25 −25
- `docs/spell-audit/L4_PH24.md` +43 −0
- `docs/spell-audit/L3_PH24.md` +38 −0
- `docs/spell-audit/L4_PH14.md` +37 −0
- `docs/spell-audit/L5_PH24.md` +36 −0
- `docs/spell-audit/L3_PH14.md` +34 −0
- `docs/spell-audit/L5_PH14.md` +33 −0
- `docs/spell-audit/L6_PH24.md` +30 −0
- `docs/spell-audit/L6_PH14.md` +29 −0
- `data.js` +19 −3
- `CHANGELOG.md` +16 −1
- `docs/marketing/posts/13-spell-audit-l2.txt` +16 −0
- `app-core.js` +11 −2
- `sw.js` +1 −1

</details>

<a id="v3.24.8"></a>
## v3.24.8 — 3 июня 2026

🐛 сверка заклинаний ур.3–4 с dnd.su (SPELL-AUDIT-3): 81 правка (PH14 39, PH24 42); удалён дубль «Знамя крестоносца», «Ледяная буря»→«Метель» (Sleet Storm); школа «Оживления» → некромантия

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.7"></a>
## v3.24.7 — 2 июня 2026

🐛 Сверка заклинаний 2 уровня с dnd.su (обе редакции): исправлены школы, механика описаний, компоненты и единицы измерения у 58 заклинаний

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/721e18a1...4eb48888) · 12 файлов, +747 −174

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`be73f475`](https://github.com/D1MANYCH/dnd-app/commit/be73f475) chore(tools): bump-version.js — semver-сравнение в checkRemote
- [`4eb48888`](https://github.com/D1MANYCH/dnd-app/commit/4eb48888) v3.24.7: fix(spells) сверка заклинаний ур.1–2 с dnd.su (SPELL-AUDIT-2)

**Файлы (12):**

- `spells.js` +126 −143
- `docs/spell-audit/_L2_progress.md` +202 −0
- `docs/spell-audit/_L1_progress.md` +125 −0
- `docs/spell-audit/L2_PH24.md` +69 −0
- `index.html` +25 −25
- `docs/spell-audit/L1_PH24.md` +49 −0
- `docs/spell-audit/L2_PH14.md` +49 −0
- `docs/spell-audit/L1_PH14.md` +41 −0
- `app-core.js` +32 −1
- `data.js` +19 −3
- `tools/bump-version.js` +9 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.6"></a>
## v3.24.6 — 1 июня 2026

🐛 Сверка заклинаний 1 уровня с dnd.su (обе редакции): исправлены школы, длительности, компоненты и механика (Лечение ран, Цветная россыпь, Ведьмин болт, Порча, Сон, Громовая кара и др.); удалён дубль Color Spray; добавлены алиасы имён

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.24.5"></a>
## v3.24.5 — 1 июня 2026

🐛 Сверка заговоров (уровень 0, 57 шт.) с dnd.su по обеим редакциям: исправлены школы, длительности, компоненты, классы и механика описаний у 31 заговора PH14/PH24; добавлены алиасы имён dnd.su

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/dc81e73e...721e18a1) · 13 файлов, +1192 −506

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`0b69e001`](https://github.com/D1MANYCH/dnd-app/commit/0b69e001) chore(docs): CHANGELOG.md v3.24.4 + релиз-пост 12 (рекомендации заклинаний)
- [`c1878264`](https://github.com/D1MANYCH/dnd-app/commit/c1878264) chore(spell-audit): SPELL-AUDIT-0 — харнесс аудита заклинаний + пилот
- [`721e18a1`](https://github.com/D1MANYCH/dnd-app/commit/721e18a1) v3.24.5: fix(spells) сверка заговоров ур.0 с dnd.su — 31 правка + 17 алиасов

**Файлы (13):**

- `docs/spell-audit/L0_PH14.md` +512 −412
- `tools/spell-audit.js` +198 −0
- `spells.js` +59 −59
- `docs/spell-audit/L0_PH24.md` +116 −0
- `docs/spell-audit/L0_PILOT.md` +103 −0
- `docs/spell-audit/README.md` +98 −0
- `index.html` +25 −25
- `tests/_spell-url-map.json` +41 −5
- `docs/marketing/posts/12-spell-recommendations.txt` +13 −0
- `data.js` +10 −2
- `app-core.js` +10 −1
- `CHANGELOG.md` +6 −1
- `sw.js` +1 −1

</details>

<a id="v3.24.4"></a>
## v3.24.4 — 1 июня 2026

✨ Рекомендации заклинаний по уровням: в пошаговом повышении и в кнопке «применить рекомендации разом» готовые билды теперь подсказывают и добавляют конкретные заклинания нового уровня — распознаются прямо из плана развития.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8e209097...dc81e73e) · 7 файлов, +141 −52

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`3261898e`](https://github.com/D1MANYCH/dnd-app/commit/3261898e) chore(docs): CHANGELOG.md v3.24.2–3 + релиз-пост 11 (автолевелинг билдов)
- [`dc81e73e`](https://github.com/D1MANYCH/dnd-app/commit/dc81e73e) v3.24.4: feat(builds) рекомендации заклинаний по уровням из плана развития

**Файлы (7):**

- `app-core.js` +56 −1
- `index.html` +25 −25
- `app-hp.js` +20 −21
- `CHANGELOG.md` +14 −1
- `data.js` +11 −3
- `docs/marketing/posts/11-build-autoleveling.txt` +14 −0
- `sw.js` +1 −1

</details>

<a id="v3.24.3"></a>
## v3.24.3 — 31 мая 2026

✨ Кнопка «Применить рекомендации билда разом» теперь работает для всех билдов: характеристики и черты распознаются прямо из плана развития (без ручной разметки данных).

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/088d0076...8e209097) · 6 файлов, +110 −36

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`8e209097`](https://github.com/D1MANYCH/dnd-app/commit/8e209097) v3.24.3: feat(builds) кнопка «применить рекомендации разом» для всех билдов

**Файлы (6):**

- `app-core.js` +62 −1
- `index.html` +25 −25
- `data.js` +11 −3
- `app-hp.js` +9 −4
- `character-builds.js` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.24.2"></a>
## v3.24.2 — 30 мая 2026

✨ Готовые билды: интерактивный план развития 1–20 с подсветкой текущего уровня и подсказкой следующего шага при повышении; исправлены подклассы 5 билдов (показ фич подкласса) и ASI монаха на 10 ур.

✨ Рекомендации билда в точках выбора: фиолетовая подсветка советуемого варианта + баннер-подсказка в модалках выбора класса (стиль боя) и повышения характеристик/черт; воин авто-получает рекомендованный стиль боя на 1 уровне.

✨ Пошаговое повышение уровня (как в Baldur's Gate): после повышения сразу показывается экран всех выборов нового уровня — подкласс, характеристики/черта, классовые опции и заклинания — с подсветкой рекомендаций билда, и только потом итог.

✨ Кнопка «Применить рекомендации билда разом» на экране выбора уровня — автоматически проставляет подкласс, характеристики/черту, классовые опции и заклинания по плану билда одним нажатием.

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/4febde9e...088d0076) · 11 файлов, +761 −51

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`088d0076`](https://github.com/D1MANYCH/dnd-app/commit/088d0076) v3.24.2: feat(builds) автолевелинг — план 1–20, рекомендации, guided level-up

**Файлы (11):**

- `app-hp.js` +336 −10
- `dev-verify-builds.js` +143 −1
- `app-core.js` +106 −0
- `index.html` +51 −25
- `style.css` +55 −0
- `class-choices.js` +22 −3
- `app-ui.js` +21 −1
- `data.js` +15 −4
- `character-builds.js` +9 −6
- `app-spells.js` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.24.1"></a>
## v3.24.1 — 29 мая 2026

🐛 офлайн-кеш — добавлены 6 пропущенных JS в прекеш (dice-arena-bg, build-notes-data, character-builds, class-choices, subclass-choices-data, app-notes) + ignoreSearch в fetch-обработчике, чтобы версионные ?v= запросы попадали в прекеш (исправлен офлайн-cold-start)

🔧 Чистка: удалены 12 неиспользуемых ассетов (~600 КБ — svg-дубли, легаси tab-картинки, неиспользуемая текстура) и 2 мёртвых CSS-правила

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/402f3393...4febde9e) · 42 файлов, +163 −122

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`82aa9c86`](https://github.com/D1MANYCH/dnd-app/commit/82aa9c86) chore(docs): CHANGELOG.md v3.24.0 + релиз-пост 09 (фамильяры)
- [`4febde9e`](https://github.com/D1MANYCH/dnd-app/commit/4febde9e) v3.24.1: fix(sw) офлайн-кеш + чистка проекта

**Файлы (42):**

- `docs/ARCHITECTURE.md` +37 −16
- `index.html` +25 −25
- `tools/screenshots-to-webp.py` +27 −0
- `CHANGELOG.md` +13 −2
- `docs/screenshots/README.md` +7 −7
- `sw.js` +12 −2
- `data.js` +11 −2
- `docs/marketing/posts/09-familiars.txt` +13 −0
- `docs/marketing/posts/10-offline-cleanup.txt` +13 −0
- `assets/avatar-fallback.svg` +0 −11
- `assets/empty-state.svg` +0 −10
- `assets/bg-body.svg` +0 −9
- `assets/tab-spells.svg` +0 −9
- `README.md` +4 −4
- `assets/tab-sheet.svg` +0 −7
- `assets/tab-battle.svg` +0 −6
- `assets/tab-inventory.svg` +0 −6
- `style.css` +0 −5
- `app-core.js` +1 −1
- `assets/tab-battle.webp` +0 −0
- `assets/tab-inventory.webp` +0 −0
- `assets/tab-sheet.webp` +0 −0
- `assets/tab-spells.webp` +0 −0
- `assets/textures/wood-table.jpg` +0 −0
- `docs/screenshots/01-character-sheet.png` +0 −0
- `docs/screenshots/01-character-sheet.webp` +0 −0
- `docs/screenshots/02-builds-picker.png` +0 −0
- `docs/screenshots/02-builds-picker.webp` +0 −0
- `docs/screenshots/03-build-guide.png` +0 −0
- `docs/screenshots/03-build-guide.webp` +0 −0
- `docs/screenshots/04-spells.png` +0 −0
- `docs/screenshots/04-spells.webp` +0 −0
- `docs/screenshots/05-dice.png` +0 −0
- `docs/screenshots/05-dice.webp` +0 −0
- `docs/screenshots/06-combat.png` +0 −0
- `docs/screenshots/06-combat.webp` +0 −0
- `docs/screenshots/bonus/characters-list.png` +0 −0
- `docs/screenshots/bonus/characters-list.webp` +0 −0
- `docs/screenshots/bonus/combat-setup-simple.png` +0 −0
- `docs/screenshots/bonus/combat-setup-simple.webp` +0 −0
- …и ещё 2 файлов — см. полный патч

</details>

<a id="v3.24.0"></a>
## v3.24.0 — 29 мая 2026

✨ FEAT-6 фамильяры — слот companions в DEFAULT_CHARACTER, 15 SRD-форм фамильяра с автозаполнением статов, кнопка «Призвать фамильяра» на заклинании «Поиск фамильяра»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/447c8e4d...402f3393) · 15 файлов, +1034 −103

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`f88fe715`](https://github.com/D1MANYCH/dnd-app/commit/f88fe715) chore(marketing): пост 08 — SRD-бестиарий и архетипы NPC v3.23.0
- [`cc02ade7`](https://github.com/D1MANYCH/dnd-app/commit/cc02ade7) chore(marketing): нейтральные релиз-посты + автогенерируемый CHANGELOG.md
- [`402f3393`](https://github.com/D1MANYCH/dnd-app/commit/402f3393) v3.24.0: feat(companions): FEAT-6 фамильяры — пресеты форм + призыв из заклинания

**Файлы (15):**

- `CHANGELOG.md` +654 −0
- `tools/gen-changelog.js` +73 −0
- `docs/marketing/posts/08-srd-bestiary.txt` +42 −29
- `index.html` +30 −26
- `app-ui.js` +48 −2
- `data.js` +37 −3
- `docs/marketing/README.md` +35 −2
- `docs/marketing/posts/07-pdf-export.txt` +8 −25
- `docs/marketing/posts/archive/08-srd-bestiary-personal.txt` +33 −0
- `docs/marketing/posts/archive/07-pdf-export-personal.txt` +29 −0
- `docs/marketing/posts/06-stabilizaciya.txt` +9 −15
- `docs/marketing/posts/archive/06-stabilizaciya-personal.txt` +19 −0
- `style.css` +14 −0
- `app-spells.js` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.23.0"></a>
## v3.23.0 — 28 мая 2026

✨ FEAT-4 SRD-бестиарий — 43 монстра SRD 5e (CR 0..10) и 25 NPC-архетипов в новых пикерах «📚 Из SRD» / «📚 Архетипы»

✨ фильтры пикера монстров по CR и редакции (PHB'14 / PHB'24)

✨ расширены формы — у монстра поля CR/КД/ХП/тактика/редакция, у NPC локация и отношение; на карточках появились бэйджи и блок «Тактика»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/7a46eb2d...447c8e4d) · 8 файлов, +1580 −35

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`5bb439f9`](https://github.com/D1MANYCH/dnd-app/commit/5bb439f9) chore(marketing): пост 07 — PDF-экспорт v3.21.0
- [`447c8e4d`](https://github.com/D1MANYCH/dnd-app/commit/447c8e4d) v3.23.0: feat(party): FEAT-4 SRD-бестиарий и архетипы NPC

**Файлы (8):**

- `monsters-srd.js` +744 −0
- `app-party.js` +262 −5
- `style.css` +216 −0
- `npc-srd.js` +211 −0
- `index.html` +103 −27
- `docs/marketing/posts/07-pdf-export.txt` +29 −0
- `data.js` +12 −2
- `sw.js` +3 −1

</details>

<a id="v3.21.0"></a>
## v3.21.0 — 28 мая 2026

✨ FEAT-3 экспорт листа персонажа в PDF (jsPDF + Roboto)

✨ декор листа — классовая цветовая полоса с аватаром, иконки школ магии, двойная рамка и уголки на каждой странице

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0ad820bf...7a46eb2d) · 9 файлов, +1178 −25

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`3dde110a`](https://github.com/D1MANYCH/dnd-app/commit/3dde110a) chore(docs): добавить текстовый черновик в копилку
- [`7a46eb2d`](https://github.com/D1MANYCH/dnd-app/commit/7a46eb2d) v3.21.0: feat(pdf): FEAT-3 экспорт листа персонажа в PDF + декор

**Файлы (9):**

- `app-pdf.js` +715 −0
- `vendor/jspdf/jspdf.umd.min.js` +398 −0
- `index.html` +24 −20
- `docs/marketing/posts/06-stabilizaciya.txt` +19 −0
- `data.js` +12 −3
- `sw.js` +4 −1
- `app-core.js` +2 −1
- `vendor/jspdf/roboto-base64.js` +3 −0
- `docs/marketing/first-week-posts.md` +1 −0

</details>

<a id="v3.20.0"></a>
## v3.20.0 — 26 мая 2026

🔧 BUGFIX-10: финализация цикла стабилизации — инвариант APP_VERSION↔CACHE_NAME↔?v=vN зафиксирован в CLAUDE.md, remote-conflict guard в bump-version.js

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b3338dd7...0ad820bf) · 5 файлов, +82 −28

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`f3d2cfd8`](https://github.com/D1MANYCH/dnd-app/commit/f3d2cfd8) chore(tools): remote-conflict guard в bump-version.js (BUGFIX-9 follow-up)
- [`0ad820bf`](https://github.com/D1MANYCH/dnd-app/commit/0ad820bf) v3.20.0: chore(stabilization): BUGFIX-10 финализация — инвариант версионирования в CLAUDE.md

**Файлы (5):**

- `index.html` +20 −20
- `tools/bump-version.js` +34 −0
- `CLAUDE.md` +17 −5
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.19.5"></a>
## v3.19.5 — 26 мая 2026

🐛 BUGFIX-9: тегированные catch через window.__catchLog (тихо в проде, видно при window.__DEBUG=true)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/73e1a96e...b3338dd7) · 18 файлов, +627 −157

<details><summary>Коммиты и файлы</summary>

**Коммиты (7):**

- [`c0ad3d5f`](https://github.com/D1MANYCH/dnd-app/commit/c0ad3d5f) chore(marketing): редакционный план + 5 готовых постов первой недели
- [`6d6a4941`](https://github.com/D1MANYCH/dnd-app/commit/6d6a4941) chore(marketing): сменить позиционирование на «разраб-практик»
- [`0f1c1486`](https://github.com/D1MANYCH/dnd-app/commit/0f1c1486) chore(marketing): убрать множественное число (один автор-игрок)
- [`e14fe586`](https://github.com/D1MANYCH/dnd-app/commit/e14fe586) chore(marketing): «у нас» → «у меня» в Посте 1 (единый личный голос)
- [`97ca506a`](https://github.com/D1MANYCH/dnd-app/commit/97ca506a) chore(marketing): добавить чистые .txt версии 5 постов для копипасты в TG
- [`4c5fa695`](https://github.com/D1MANYCH/dnd-app/commit/4c5fa695) chore(marketing): добавить роль чата-обсуждения (неформальная кухня)
- [`b3338dd7`](https://github.com/D1MANYCH/dnd-app/commit/b3338dd7) v3.19.5: fix(diag): BUGFIX-9 тегированные catch через window.__catchLog

**Файлы (18):**

- `docs/marketing/first-week-posts.md` +310 −102
- `docs/marketing/README.md` +75 −16
- `docs/marketing/group-content.md` +71 −0
- `index.html` +20 −20
- `docs/marketing/posts/02-changelog.txt` +23 −0
- `docs/marketing/posts/03-features.txt` +23 −0
- `docs/marketing/group-pinned.txt` +22 −0
- `docs/marketing/posts/05-vs-dndbeyond.txt` +20 −0
- `docs/marketing/posts/01-zachem-sdelal.txt` +18 −0
- `docs/marketing/posts/04-poll.txt` +16 −0
- `data.js` +11 −3
- `app-core.js` +7 −5
- `app-party.js` +4 −4
- `app-notes.js` +2 −2
- `README.md` +2 −2
- `app-desktop.js` +1 −1
- `app-inventory.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.19.4"></a>
## v3.19.4 — 25 мая 2026

✨ ссылка на TG-канал в разделе «О приложении» (инфраструктура под донат/Boosty готова)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d3d85fb2...73e1a96e) · 26 файлов, +373 −237

<details><summary>Коммиты и файлы</summary>

**Коммиты (6):**

- [`409f5315`](https://github.com/D1MANYCH/dnd-app/commit/409f5315) chore(marketing): README как лендинг, ARCHITECTURE.md, URL-константы
- [`9d714d1a`](https://github.com/D1MANYCH/dnd-app/commit/9d714d1a) chore(marketing): подключить TG-канал @dndlistru
- [`d74bad42`](https://github.com/D1MANYCH/dnd-app/commit/d74bad42) chore(marketing): подготовить структуру docs/screenshots/
- [`94e4e0c5`](https://github.com/D1MANYCH/dnd-app/commit/94e4e0c5) chore(marketing): добавить 6 скриншотов приложения
- [`30ca5348`](https://github.com/D1MANYCH/dnd-app/commit/30ca5348) feat(marketing): добавить 6 скриншотов приложения + активировать таблицу в README
- [`73e1a96e`](https://github.com/D1MANYCH/dnd-app/commit/73e1a96e) v3.19.4: feat(ui): ссылка на TG-канал в разделе «О приложении»

**Файлы (26):**

- `README.md` +52 −212
- `docs/ARCHITECTURE.md` +152 −0
- `docs/screenshots/README.md` +50 −0
- `style.css` +48 −0
- `index.html` +25 −20
- `app-ui.js` +25 −0
- `data.js` +20 −4
- `sw.js` +1 −1
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215136.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215207.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215220.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215234.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215256.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215400.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215442.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215553.png"` +0 −0
- `"docs/screenshots/\320\241\320\275\320\270\320\274\320\276\320\272 \321\215\320\272\321\200\320\260\320\275\320\260 2026-05-25 215602.png"` +0 −0
- `docs/screenshots/01-character-sheet.png` +0 −0
- `docs/screenshots/02-builds-picker.png` +0 −0
- `docs/screenshots/03-build-guide.png` +0 −0
- `docs/screenshots/04-spells.png` +0 −0
- `docs/screenshots/05-dice.png` +0 −0
- `docs/screenshots/06-combat.png` +0 −0
- `docs/screenshots/bonus/characters-list.png` +0 −0
- `docs/screenshots/bonus/combat-setup-simple.png` +0 −0
- `docs/screenshots/bonus/combat-setup-with-ally.png` +0 −0

</details>

<a id="v3.19.3"></a>
## v3.19.3 — 24 мая 2026

🐛 BUGFIX-8: clear notesSearch/notesSave/ritual таймеров при loadCharacter — pending-таймеры из других модулей больше не «дострелят» в контексте нового персонажа

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/06aa4ac3...d3d85fb2) · 9 файлов, +285 −37

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`d3a38123`](https://github.com/D1MANYCH/dnd-app/commit/d3a38123) test: TEST-1 расширение headless-shim — DOM-stub, app-core/combat/hp, +2 кейса
- [`d3d85fb2`](https://github.com/D1MANYCH/dnd-app/commit/d3d85fb2) v3.19.3: fix(loadCharacter): BUGFIX-8 clear-all pending-таймеров при смене персонажа

**Файлы (9):**

- `tests/headless-node.js` +128 −11
- `tests/headless.js` +94 −0
- `index.html` +20 −20
- `app-core.js` +14 −0
- `data.js` +11 −3
- `tests/runner.html` +6 −2
- `app-notes.js` +6 −0
- `app-spells.js` +5 −0
- `sw.js` +1 −1

</details>

<a id="v3.19.2"></a>
## v3.19.2 — 23 мая 2026

🐛 parseInt radix 10 во всех app-*.js (BUGFIX-7)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/191391b6...06aa4ac3) · 10 файлов, +122 −92

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`be3d5438`](https://github.com/D1MANYCH/dnd-app/commit/be3d5438) chore(tools): автобамп ?v= токенов js/css в index.html (TOOL-2 пилот)
- [`06aa4ac3`](https://github.com/D1MANYCH/dnd-app/commit/06aa4ac3) v3.19.2: fix(safety): parseInt radix 10 во всех app-*.js (BUGFIX-7)

**Файлы (10):**

- `app-combat.js` +37 −37
- `index.html` +20 −20
- `tools/bump-version.js` +28 −6
- `app-hp.js` +12 −12
- `app-ui.js` +7 −7
- `data.js` +11 −3
- `app-spells.js` +3 −3
- `app-core.js` +2 −2
- `app-party.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.19.1"></a>
## v3.19.1 — 21 мая 2026

🐛 видимая × в шапке + Сброс перенесён в подвал модалки

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/decc4cbf...191391b6) · 6 файлов, +1161 −73

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`191391b6`](https://github.com/D1MANYCH/dnd-app/commit/191391b6) v3.19.1: feat(dice): редизайн модалки броска кубиков — космо-арена + новый UX

**Файлы (6):**

- `style.css` +486 −8
- `dice-arena-bg.js` +360 −0
- `index.html` +151 −60
- `app-ui.js` +120 −1
- `data.js` +43 −3
- `sw.js` +1 −1

</details>

<a id="v3.19.0"></a>
## v3.19.0 — 21 мая 2026

✨ новый визуал — SVG-плитки кубиков, БЫСТРЫЙ БРОСОК d20, бейдж истории, Сброс, кнопка Готово вместо ×

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.18.1"></a>
## v3.18.1 — 20 мая 2026

🐛 компактные dropdown-поповеры (grid 2×2 для стилей) + меньше кнопки d4-d100 на десктопе

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.18.0"></a>
## v3.18.0 — 20 мая 2026

✨ редизайн модалки — двухколоночный layout, gear/history popovers, удалён дубль закрытия

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.17.0"></a>
## v3.17.0 — 20 мая 2026

✨ космическая арена броска — анимированный фон + shockwave

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.16.3"></a>
## v3.16.3 — 20 мая 2026

🐛 canvas сохраняется при soft-таймауте 3D-физики, инстанс DiceBox пересоздаётся только после 3 таймаутов подряд или WebGL context loss; убран ложный 2D-fallback после нескольких роллов

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e030a54b...decc4cbf) · 4 файла, +100 −14

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`decc4cbf`](https://github.com/D1MANYCH/dnd-app/commit/decc4cbf) v3.16.3: fix(dice): 3D-кубик больше не пропадает после нескольких роллов

**Файлы (4):**

- `app-ui.js` +87 −9
- `data.js` +11 −3
- `index.html` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.16.2"></a>
## v3.16.2 — 19 мая 2026

🐛 читаемость карточек готовых билдов в светлой теме

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/2aa4513c...e030a54b) · 4 файла, +47 −4

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`e030a54b`](https://github.com/D1MANYCH/dnd-app/commit/e030a54b) v3.16.2: fix(ui): читаемость карточек готовых билдов в светлой теме

**Файлы (4):**

- `style.css` +35 −0
- `data.js` +10 −2
- `index.html` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.16.1"></a>
## v3.16.1 — 19 мая 2026

🐛 светлая тема — читаемость по всем экранам: модалки на пол непрозрачности, убран dark-only хардкод в пикерах/журнале/notes/фильтре заклинаний/трекере боя; чипы-категории и res-теги непрозрачные, полоска ХП видима; кнопка × модалок переделана (была во всю ширину → крупная 40px тач-кнопка), убрана старая «полоска» в модалке броска, аватарка круглая (внутр. кнопка тоже), сегмент режима броска отцентрован, пилюли категорий Записей непрозрачны

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e34bf218...2aa4513c) · 7 файлов, +1109 −259

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`b5c63b36`](https://github.com/D1MANYCH/dnd-app/commit/b5c63b36) feat(ui): UI v4 — орбитальный космо-фон + стекло + светлая тема
- [`2aa4513c`](https://github.com/D1MANYCH/dnd-app/commit/2aa4513c) v3.16.1: fix(ui): светлая тема — читаемость по всем экранам + README/история версий

**Файлы (7):**

- `style.css` +446 −247
- `bg-orbits.js` +521 −0
- `app-ui.js` +59 −0
- `README.md` +36 −4
- `index.html` +33 −3
- `data.js` +11 −3
- `sw.js` +3 −2

</details>

<a id="v3.16.0"></a>
## v3.16.0 — 16 мая 2026

✨ feat(io) — FEAT-2 генератор случайных имён по расе (🎲 у поля имени)

🐛 fix(pwa) — service worker кеширует свежие файлы при обновлении (обход HTTP-кеша)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/efd9e206...e34bf218) · 5 файлов, +117 −8

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`e34bf218`](https://github.com/D1MANYCH/dnd-app/commit/e34bf218) v3.16.0: feat(io) — FEAT-2 генератор случайных имён по расе (🎲 у поля имени)

**Файлы (5):**

- `data.js` +69 −2
- `app-combat.js` +28 −0
- `sw.js` +11 −2
- `index.html` +4 −4
- `style.css` +5 −0

</details>

<a id="v3.15.4"></a>
## v3.15.4 — 16 мая 2026

🐛 fix(hp) — модалка «История HP» теперь показывает записи только текущего персонажа (charId-фильтр); унаследованные записи без привязки показываются как общие

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e1728c25...efd9e206) · 3 файла, +19 −5

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`efd9e206`](https://github.com/D1MANYCH/dnd-app/commit/efd9e206) v3.15.4: fix(hp) — модалка «История HP» фильтруется по текущему персонажу

**Файлы (3):**

- `data.js` +10 −2
- `app-core.js` +8 −2
- `sw.js` +1 −1

</details>

<a id="v3.15.3"></a>
## v3.15.3 — 16 мая 2026

✨ feat(io) — FEAT-1 доработка: HP-история теперь привязана к персонажу (charId) и входит в экспорт/импорт — одиночный конверт и полный бэкап «Скачать копию» теперь 100% полные

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/a2800d08...e1728c25) · 4 файла, +58 −7

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`e1728c25`](https://github.com/D1MANYCH/dnd-app/commit/e1728c25) v3.15.3: feat(io) — FEAT-1 доработка: HP-история привязана к персонажу

**Файлы (4):**

- `app-core.js` +43 −3
- `data.js` +10 −2
- `app-hp.js` +4 −1
- `sw.js` +1 −1

</details>

<a id="v3.15.2"></a>
## v3.15.2 — 16 мая 2026

🐛 fix(notes) — печать/PDF «Записей»: чинит пустой лист (битый #app-селектор → visibility-изоляция) и контент свёрнутых секций (notesPrint раскрывает все .notes-section-body + рендерит превью, restore через renderNotes)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/851ce14e...a2800d08) · 4 файла, +84 −16

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`a2800d08`](https://github.com/D1MANYCH/dnd-app/commit/a2800d08) v3.15.2: fix(notes) — печать/PDF: пустой лист + контент свёрнутых секций

**Файлы (4):**

- `style.css` +50 −10
- `app-notes.js` +23 −3
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.15.1"></a>
## v3.15.1 — 16 мая 2026

🔧 chore(cleanup) — удалён мёртвый app.js (легаси-монолит, не подключён в index.html)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/00a71807...851ce14e) · 7 файлов, +97 −5912

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`851ce14e`](https://github.com/D1MANYCH/dnd-app/commit/851ce14e) v3.15.1: feat(io) — FEAT-1 импорт/экспорт персонажа (round-trip) + chore(cleanup) удалён мёртвый app.js

**Файлы (7):**

- `app.js` +0 −5900
- `app-core.js` +74 −6
- `data.js` +18 −2
- `CLAUDE.md` +2 −2
- `index.html` +2 −0
- `sw.js` +1 −1
- `README.md` +0 −1

</details>

<a id="v3.15.0"></a>
## v3.15.0 — 16 мая 2026

✨ feat(io) — FEAT-1: не разрушающий импорт персонажа + схема-толерантный round-trip экспорта/импорта (обёртка {characters:[...]} и голый массив)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.14.0"></a>
## v3.14.0 — 16 мая 2026

✨ UI-12: единые радиусы — off-token border-radius (5/6/7/9/10/13/14/20/50px + .btn-система) приведены к токенам --r-sm/--r-md/--r-pill; 4px-сетка: .level-actions; верифицировано clean на всех 7 вкладках + 10 модалках (dark)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/dd631037...00a71807) · 6 файлов, +262 −191

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`00a71807`](https://github.com/D1MANYCH/dnd-app/commit/00a71807) v3.14.0: feat(ui) — UI-11 анимации + UI-12 единые радиусы

**Файлы (6):**

- `style.css` +204 −184
- `data.js` +19 −3
- `app-ui.js` +21 −0
- `app-hp.js` +14 −0
- `index.html` +3 −3
- `sw.js` +1 −1

</details>

<a id="v3.13.0"></a>
## v3.13.0 — 15 мая 2026

✨ UI-11: анимации и микровзаимодействия — fade+slide при смене вкладок, spring-нажатие кнопок (scale .96), pulse HP-бара при уроне/лечении, count-up числа ХП; reduced-motion учтён

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.12.1"></a>
## v3.12.1 — 15 мая 2026

🐛 возврат к списку персонажей скроллит наверх; вход в персонажа всегда открывает «Лист» и сбрасывает подсветку сайдбара (раньше залипала на прошлой вкладке)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1287f672...dd631037) · 8 файлов, +151 −29

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`dd631037`](https://github.com/D1MANYCH/dnd-app/commit/dd631037) v3.12.1: feat(ui) — skeleton-лоадеры + подсветка поиска (UI-10) + fix(nav)

**Файлы (8):**

- `style.css` +63 −0
- `app-ui.js` +42 −0
- `app-core.js` +19 −20
- `data.js` +18 −2
- `index.html` +5 −5
- `app-spells.js` +2 −1
- `sw.js` +1 −1
- `app-inventory.js` +1 −0

</details>

<a id="v3.12.0"></a>
## v3.12.0 — 15 мая 2026

✨ skeleton-лоадеры списков заклинаний/инвентаря/билдов при первой загрузке + подсветка <mark> совпадений поиска (UI-10)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.11.2"></a>
## v3.11.2 — 15 мая 2026

🐛 смена категории предмета в модалке больше не дублирует его — предмет удаляется из старой категории и переносится в новую (раньше оставался в обеих)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/105f2695...1287f672) · 5 файлов, +288 −6

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`1287f672`](https://github.com/D1MANYCH/dnd-app/commit/1287f672) v3.11.2: feat(inventory) — drag-n-drop предметов (UI-8) + 2 фикса

**Файлы (5):**

- `app-inventory.js` +232 −1
- `data.js` +26 −2
- `style.css` +27 −0
- `index.html` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.11.1"></a>
## v3.11.1 — 15 мая 2026

🐛 перетаскивание больше не меняет категорию предмета (UI-8) — дроп на предмет переставляет только внутри своей категории, смена категории только через кнопки фильтра

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.11.0"></a>
## v3.11.0 — 15 мая 2026

✨ drag-n-drop предметов между слотами и категориями (UI-8) — desktop HTML5 DnD + touch long-press 300ms, плейсхолдер-линия и подсветка цели, Escape — отмена

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.10.8"></a>
## v3.10.8 — 15 мая 2026

🐛 2D-fallback анимация кубиков (SVG polygon + rAF) когда DiceBox недоступен (file:// блокирует ES-module и WebAssembly); тестовая страница tests/dice-test.html с переключателем auto/3D/2D

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0c2a3a27...105f2695) · 6 файлов, +486 −288

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`105f2695`](https://github.com/D1MANYCH/dnd-app/commit/105f2695) v3.10.8: fix(dice) — 2D-fallback анимация кубиков для file://

**Файлы (6):**

- `tests/dice-test.html` +341 −277
- `app-ui.js` +121 −6
- `data.js` +10 −2
- `style.css` +11 −0
- `index.html` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.10.7"></a>
## v3.10.7 — 15 мая 2026

🐛 FIX 3D-кубики: убрана animation dice-sheet-in (opacity застревал в 0 при некоторых условиях рендера); +resize event на open модалки; +отдельный tests/dice-test.html для отладки в будущем

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d1f686c9...0c2a3a27) · 6 файлов, +430 −6

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`0c2a3a27`](https://github.com/D1MANYCH/dnd-app/commit/0c2a3a27) v3.10.7: fix(dice) — кубики не видны, opacity застревал в 0 + dice-test

**Файлы (6):**

- `tests/dice-test.html` +405 −0
- `data.js` +10 −2
- `app-ui.js` +11 −0
- `index.html` +2 −2
- `style.css` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.10.6"></a>
## v3.10.6 — 15 мая 2026

🐛 Прозрачный фон у d20-fab.webp (Gemini-картинка шла со светло-серым фоном, прогнал flood-fill из углов в Pillow); убрал иконку из right-rail d20-кнопки на desktop — вернул компактный текстовый btn-primary

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3ac92512...d1f686c9) · 5 файлов, +13 −35

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`d1f686c9`](https://github.com/D1MANYCH/dnd-app/commit/d1f686c9) v3.10.6: fix(ui) — прозрачный фон d20 и текстовая d20 в right-rail

**Файлы (5):**

- `style.css` +1 −31
- `data.js` +10 −2
- `app-desktop.js` +1 −1
- `sw.js` +1 −1
- `assets/d20-fab.webp` +0 −0

</details>

<a id="v3.10.5"></a>
## v3.10.5 — 15 мая 2026

🐛 d20-кнопка в right-rail (desktop) теперь использует картинку d20-fab вместо эмодзи; openDiceModal страхуется от застрявшего .hidden; cache-bust для всех изменённых файлов

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ca9be75e...3ac92512) · 6 файлов, +52 −8

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`3ac92512`](https://github.com/D1MANYCH/dnd-app/commit/3ac92512) v3.10.5: fix(ui) — d20-кнопка в desktop right-rail с картинкой d20-fab

**Файлы (6):**

- `style.css` +32 −0
- `data.js` +10 −2
- `app-ui.js` +5 −1
- `index.html` +3 −3
- `app-desktop.js` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.10.4"></a>
## v3.10.4 — 15 мая 2026

🐛 Fallback-аватар теперь используется и в карточках списка персонажей и везде где getClassIcon вызывается для пустого класса — заменена sentinel-эмодзи 🎭 на assets/avatar-fallback.webp

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/0ebef29c...ca9be75e) · 5 файлов, +22 −6

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`ca9be75e`](https://github.com/D1MANYCH/dnd-app/commit/ca9be75e) v3.10.4: fix(ui) — fallback-аватар в карточках списка персонажей

**Файлы (5):**

- `data.js` +10 −2
- `style.css` +9 −1
- `app-core.js` +1 −1
- `index.html` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.10.3"></a>
## v3.10.3 — 15 мая 2026

🐛 Заменены ассеты d20-fab.webp (детальный золотой полиэдр) и avatar-fallback.webp (фигура в плаще без Gemini-водяного знака) — сгенерированы через Gemini по новым промтам; FAB-кнопка без тёмного круга, d20 парит со свечением

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/aba11f03...0ebef29c) · 5 файлов, +22 −19

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`0ebef29c`](https://github.com/D1MANYCH/dnd-app/commit/0ebef29c) v3.10.3: fix(assets) — детальный d20 и аватар без водяного знака

**Файлы (5):**

- `style.css` +11 −16
- `data.js` +10 −2
- `sw.js` +1 −1
- `assets/avatar-fallback.webp` +0 −0
- `assets/d20-fab.webp` +0 −0

</details>

<a id="v3.10.2"></a>
## v3.10.2 — 15 мая 2026

🐛 Fallback-аватар (фигура в плаще) вместо эмодзи 🎭 в шапке листа и в превью модалки аватара когда у персонажа нет билда и класса

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f57f8c6f...aba11f03) · 6 файлов, +40 −11

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`aba11f03`](https://github.com/D1MANYCH/dnd-app/commit/aba11f03) v3.10.2: fix(ui) — fallback-аватар вместо эмодзи 🎭

**Файлы (6):**

- `style.css` +15 −0
- `data.js` +10 −2
- `app-ui.js` +7 −4
- `app-core.js` +5 −2
- `index.html` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.10.1"></a>
## v3.10.1 — 15 мая 2026

🐛 Возвращена картинка d20-fab.webp в FAB-кнопке кубика вместо эмодзи 🎲: золотой полиэдр на тёмном круге с акцентной рамкой и свечением

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/d4fc0d03...f57f8c6f) · 4 файла, +31 −10

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`f57f8c6f`](https://github.com/D1MANYCH/dnd-app/commit/f57f8c6f) v3.10.1: fix(ui) — вернул d20-картинку в FAB-кнопку кубика

**Файлы (4):**

- `style.css` +18 −5
- `data.js` +11 −3
- `index.html` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.10.0"></a>
## v3.10.0 — 14 мая 2026

✨ FEAT-5: history-back для PWA — браузерная кнопка Назад закрывает модалки/экраны, на корне confirm Выйти

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/105bdfe1...d4fc0d03) · 4 файла, +158 −3

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`d4fc0d03`](https://github.com/D1MANYCH/dnd-app/commit/d4fc0d03) v3.10.0: feat(pwa) — FEAT-5 history-back для PWA

**Файлы (4):**

- `history-stack.js` +145 −0
- `data.js` +10 −2
- `sw.js` +2 −1
- `index.html` +1 −0

</details>

<a id="v3.9.0"></a>
## v3.9.0 — 14 мая 2026

✨ UI-13: ⚙️ настройки на экране списка персонажей + усиленный header-back на desktop/tablet с подписью «К персонажам»

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/05f7c3f9...105bdfe1) · 4 файла, +82 −3

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`105bdfe1`](https://github.com/D1MANYCH/dnd-app/commit/105bdfe1) v3.9.0: feat(ui) — UI-13 настройки на экране списка + видимая кнопка back

**Файлы (4):**

- `style.css` +70 −0
- `data.js` +10 −2
- `sw.js` +1 −1
- `index.html` +1 −0

</details>

<a id="v3.8.1"></a>
## v3.8.1 — 14 мая 2026

🐛 BUGFIX-6: мобильная вёрстка — имена персонажей не обрезаются, HP-блок Урон/Лечение в один столбец на ≤540px, сетка фильтра классов с flex-wrap и адекватными размерами

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/cadb130f...05f7c3f9) · 3 файла, +55 −3

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`05f7c3f9`](https://github.com/D1MANYCH/dnd-app/commit/05f7c3f9) v3.8.1: fix(ui) — BUGFIX-6 мобильная вёрстка после UI-6

**Файлы (3):**

- `style.css` +44 −0
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.8.0"></a>
## v3.8.0 — 14 мая 2026

✨ UI-6: мобильная навигация v2 — safe-area, хитбоксы ≥44px, индикатор активной вкладки, тактильная отдача, свайпы между Лист/Заклинания/Инвентарь/Бой, edge-swipe для drawer, усиленный backdrop-blur

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/5b6f6d6d...cadb130f) · 6 файлов, +249 −27

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`1244664b`](https://github.com/D1MANYCH/dnd-app/commit/1244664b) chore(plan): UI-5 — закрытие фазы в плане UI v3
- [`cadb130f`](https://github.com/D1MANYCH/dnd-app/commit/cadb130f) v3.8.0: feat(ui) — UI-6 мобильная навигация v2

**Файлы (6):**

- `app.js` +84 −10
- `app-core.js` +80 −10
- `docs/ui-v3-plan.md` +43 −0
- `style.css` +31 −4
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.7.1"></a>
## v3.7.1 — 14 мая 2026

🐛 адаптив: кнопки заклинаний (Найти/Добавить) на узких экранах ≤540px растягиваются на всю ширину, текст переносится

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/f6b60eba...5b6f6d6d) · 5 файлов, +415 −44

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`5b6f6d6d`](https://github.com/D1MANYCH/dnd-app/commit/5b6f6d6d) v3.7.1: feat(ui) — UI-5 масштаб шрифта 90–130% + настройки в отдельной модалке

**Файлы (5):**

- `style.css` +223 −12
- `index.html` +65 −29
- `app-ui.js` +76 −0
- `data.js` +50 −2
- `sw.js` +1 −1

</details>

<a id="v3.7.0"></a>
## v3.7.0 — 14 мая 2026

✨ UI-5: настройки оформления вынесены в отдельную модалку, drawer короткий

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.6.3"></a>
## v3.6.3 — 14 мая 2026

🐛 UI-5: zoom переехал с html на body, чтобы не сдвигать медиа-запросы (sidebar 1200px)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.6.2"></a>
## v3.6.2 — 14 мая 2026

🐛 UI-5: drawer overflow-y auto + убрал двойной скейл (--fs-scale + zoom)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.6.1"></a>
## v3.6.1 — 14 мая 2026

🐛 UI-5: масштаб через zoom на :root — теперь скейлится весь интерфейс, не только drawer

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.6.0"></a>
## v3.6.0 — 14 мая 2026

✨ UI-5: слайдер масштаба шрифта 90–130% (--fs-scale) в drawer

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.5.0"></a>
## v3.5.0 — 14 мая 2026

✨ UI-4 — переключатель плотности (Компактно / Стандарт / Просторно) через --sp-*/--fs-* и data-density

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6684d69c...f6b60eba) · 5 файлов, +104 −8

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`9b474d38`](https://github.com/D1MANYCH/dnd-app/commit/9b474d38) fix(ui): чипы акцента — сетка 4×2 без пустых слотов
- [`f6b60eba`](https://github.com/D1MANYCH/dnd-app/commit/f6b60eba) v3.5.0: feat(ui) — UI-4 переключатель плотности (Компактно/Стандарт/Просторно)

**Файлы (5):**

- `style.css` +51 −3
- `app-ui.js` +27 −0
- `index.html` +15 −2
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.4.0"></a>
## v3.4.0 — 14 мая 2026

✨ UI-3 — авто-акцент по классу персонажа (12 классов → 8 пресетов)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/400fe590...6684d69c) · 6 файлов, +102 −4

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`6684d69c`](https://github.com/D1MANYCH/dnd-app/commit/6684d69c) v3.4.0: feat(ui) — UI-3 авто-акцент по классу персонажа (12 классов → 8 пресетов)

**Файлы (6):**

- `app-ui.js` +58 −0
- `style.css` +26 −0
- `data.js` +10 −2
- `index.html` +5 −1
- `app.js` +2 −0
- `sw.js` +1 −1

</details>

<a id="v3.3.0"></a>
## v3.3.0 — 14 мая 2026

✨ UI-2 — кастомизация акцента (8 пресетов)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8dce83b8...400fe590) · 5 файлов, +195 −5

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`400fe590`](https://github.com/D1MANYCH/dnd-app/commit/400fe590) v3.3.0: feat(ui) — UI-2 кастомизация акцента (8 пресетов)

**Файлы (5):**

- `style.css` +133 −0
- `app-ui.js` +31 −0
- `index.html` +20 −2
- `data.js` +10 −2
- `sw.js` +1 −1

</details>

<a id="v3.2.1"></a>
## v3.2.1 — 14 мая 2026

🐛 UI: кнопка «Назад к персонажам» в шапке на десктопе (sidebar-режим)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/8d2c0764...8dce83b8) · 3 файла, +11 −4

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`8dce83b8`](https://github.com/D1MANYCH/dnd-app/commit/8dce83b8) v3.2.1: fix(ui) — кнопка «Назад к персонажам» в шапке на десктопе

**Файлы (3):**

- `data.js` +10 −2
- `sw.js` +1 −1
- `style.css` +0 −1

</details>

<a id="v3.2.0"></a>
## v3.2.0 — 14 мая 2026

✨ UI-9: кнопка «Откатить уровень» с подтверждением — снимок состояния перед level-up хранится в char._prevLevelSnapshot, одношаговый undo возвращает HP/слоты/фичи/подкласс к предыдущему состоянию

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/31a7d054...8d2c0764) · 6 файлов, +120 −7

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`8d2c0764`](https://github.com/D1MANYCH/dnd-app/commit/8d2c0764) v3.2.0: UI-9 — кнопка «Откатить уровень»

**Файлы (6):**

- `app-hp.js` +95 −0
- `data.js` +11 −3
- `index.html` +6 −3
- `style.css` +6 −0
- `sw.js` +1 −1
- `app-core.js` +1 −0

</details>

<a id="v3.1.10"></a>
## v3.1.10 — 10 мая 2026

🐛 BUGFIX-5: a11y — все <span onclick> переведены в <button> (26 шт), CSS-сброс для button-классов; глобальный onerror+unhandledrejection с toast и троттлингом 1.5с

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/6779a42b...31a7d054) · 7 файлов, +92 −34

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`31a7d054`](https://github.com/D1MANYCH/dnd-app/commit/31a7d054) v3.1.10: BUGFIX-5 — a11y и глобальный onerror-toast

**Файлы (7):**

- `index.html` +18 −18
- `app-ui.js` +30 −1
- `style.css` +21 −0
- `app-combat.js` +9 −9
- `data.js` +11 −3
- `app-notes.js` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.1.9"></a>
## v3.1.9 — 8 мая 2026

🐛 BUGFIX-4: чистка console.log в проде — удалён шумный sync-лог билдов и SW-зарегистрирован, error-catches переведены на console.error

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/57fca5d1...6779a42b) · 6 файлов, +17 −12

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`6779a42b`](https://github.com/D1MANYCH/dnd-app/commit/6779a42b) v3.1.9: BUGFIX-4 — чистка console.log в проде

**Файлы (6):**

- `data.js` +10 −2
- `index.html` +3 −3
- `app-core.js` +2 −2
- `app-ui.js` +1 −2
- `character-builds.js` +0 −2
- `sw.js` +1 −1

</details>

<a id="v3.1.8"></a>
## v3.1.8 — 8 мая 2026

🐛 BUGFIX-3: валидация JSON-импорта — лимит размера 10МБ, проверка формата (массив + shape валидных элементов), confirm-модалка перед заменой, миграция импортированных персонажей через migrateCharacter, подсчёт пропущенных

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/a7164afd...57fca5d1) · 5 файлов, +114 −28

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`57fca5d1`](https://github.com/D1MANYCH/dnd-app/commit/57fca5d1) v3.1.8: BUGFIX-3 — валидация JSON-импорта

**Файлы (5):**

- `app-core.js` +79 −19
- `app-party.js` +22 −4
- `data.js` +10 −2
- `index.html` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.1.7"></a>
## v3.1.7 — 8 мая 2026

🐛 BUGFIX-2: parseInt без radix в app-inventory.js (23 точки) — единая база 10 для парсинга монет, qty, индексов, dice-формул

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ca2e715c...a7164afd) · 4 файла, +35 −27

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`a7164afd`](https://github.com/D1MANYCH/dnd-app/commit/a7164afd) v3.1.7: BUGFIX-2 — parseInt с явной базой 10 в инвентаре

**Файлы (4):**

- `app-inventory.js` +23 −23
- `data.js` +10 −2
- `index.html` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.1.6"></a>
## v3.1.6 — 8 мая 2026

🐛 BUGFIX-1: пакт-ячейки колдуна вынесены в отдельную строку (отдельный счётчик/кнопки), мультикласс с Колдуном теперь корректно показывает обе таблицы

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9375cd73...ca2e715c) · 6 файлов, +157 −39

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`ca2e715c`](https://github.com/D1MANYCH/dnd-app/commit/ca2e715c) v3.1.6: BUGFIX-1 — пакт-ячейки колдуна в отдельной строке

**Файлы (6):**

- `app-spells.js` +73 −22
- `app-hp.js` +30 −9
- `app-core.js` +38 −0
- `data.js` +11 −3
- `index.html` +4 −4
- `sw.js` +1 −1

</details>

<a id="v3.1.5"></a>
## v3.1.5 — 8 мая 2026

🐛 иконки эффектов больше не пытаются грузить .png — папка удалена при OPT-5, было 24 ошибки 404 на каждой загрузке

🐛 адаптив: статичный sidebar только с 1200px; на 1024-1199 (планшет в landscape) — drawer-режим, контент шире на 240px

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/5aeecc4f...9375cd73) · 5 файлов, +91 −43

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`9375cd73`](https://github.com/D1MANYCH/dnd-app/commit/9375cd73) v3.1.5: drawer-mode на 1024-1199, фикс 404 для иконок эффектов

**Файлы (5):**

- `style.css` +72 −26
- `app-core.js` +5 −12
- `data.js` +11 −2
- `index.html` +2 −2
- `sw.js` +1 −1

</details>

<a id="v3.1.4"></a>
## v3.1.4 — 8 мая 2026

🐛 сайдбар на ≥1024px зафиксирован 240px — раньше tablet-правило ставило 320px и накладывало на контент

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/3447363b...5aeecc4f) · 4 файла, +26 −9

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`5aeecc4f`](https://github.com/D1MANYCH/dnd-app/commit/5aeecc4f) v3.1.4: сайдбар на десктопе перестал накладываться на контент

**Файлы (4):**

- `style.css` +14 −5
- `data.js` +10 −2
- `index.html` +1 −1
- `sw.js` +1 −1

</details>

<a id="v3.1.3"></a>
## v3.1.3 — 8 мая 2026

🐛 экран выбора персонажа: right-rail и табы сайдбара скрыты — остаётся только переключатель темы

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/5dc570b2...3447363b) · 6 файлов, +36 −6

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`3447363b`](https://github.com/D1MANYCH/dnd-app/commit/3447363b) v3.1.3: скрыть боковые панели на экране выбора персонажа

**Файлы (6):**

- `data.js` +10 −2
- `style.css` +12 −0
- `app-desktop.js` +6 −0
- `index.html` +3 −3
- `app-core.js` +4 −0
- `sw.js` +1 −1

</details>

<a id="v3.1.2"></a>
## v3.1.2 — 8 мая 2026

🐛 кубики: 6-секундный fallback при зависшей 3D-физике (file://, GPU-проблемы) — результат показывается всегда

🐛 адаптив: right-rail активен с 1024px — планшет в landscape выглядит как ПК

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/99d2dc69...5dc570b2) · 7 файлов, +295 −79

<details><summary>Коммиты и файлы</summary>

**Коммиты (5):**

- [`81fca053`](https://github.com/D1MANYCH/dnd-app/commit/81fca053) fix(desktop): скрыть status-bar на ≥1200px, AC/Level/Inspiration в right-rail
- [`2a2c31d7`](https://github.com/D1MANYCH/dnd-app/commit/2a2c31d7) fix(desktop): шапка fixed на всю ширину между sidebar и правым краем
- [`dbd7c44a`](https://github.com/D1MANYCH/dnd-app/commit/dbd7c44a) fix(desktop): right-rail в auto-теме следует за OS prefers-color-scheme
- [`fe5e29cb`](https://github.com/D1MANYCH/dnd-app/commit/fe5e29cb) fix(theme): auto-режим резолвит prefers-color-scheme через JS
- [`5dc570b2`](https://github.com/D1MANYCH/dnd-app/commit/5dc570b2) v3.1.2: right-rail dice/conditions UX + tablet support

**Файлы (7):**

- `style.css` +91 −34
- `app-desktop.js` +108 −3
- `app-combat.js` +37 −26
- `app-ui.js` +28 −2
- `data.js` +20 −3
- `index.html` +10 −10
- `sw.js` +1 −1

</details>

<a id="v3.1.1"></a>
## v3.1.1 — 7 мая 2026

🐛 right-rail: 3D-кубы открывают модалку; inline-баджи состояний в карточке

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.1.0"></a>
## v3.1.0 — 7 мая 2026

✨ Light Theme v3: тёплая cream-палитра (#eef2ef) с warm radial gradient и SVG-noise; декоративные золотые «лозы» по краям приложения

✨ Унифицированная система кнопок: .btn-sm/md/lg × .btn-primary/secondary/ghost/danger/success + .btn-pill / .btn-loading; работают через CSS-переменные в обеих темах

✨ Анимации: HP-bar shimmer, hover-lift на карточках/кнопках, toast-in, banner-in, lock-pulse — с уважением prefers-reduced-motion (универсально для всех тем)

✨ Desktop layout (≥1200px): sidebar 240px + main центрирован + right-rail 320px (HP-виджет с кнопками урона/лечения, быстрые броски d4-d20, состояния)

✨ Адаптивные брейкпоинты: tablet 768+ (увеличенные padding и .grid-2), desktop 1200+ (3-колоночный layout, drawer как статический sidebar, tab-nav скрыт)

🔧 Тёмная тема получила обновлённый визуал кнопок и анимации без потери привычного образа (через CSS-переменные)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/5e253211...99d2dc69) · 129 файлов, +3821 −690

<details><summary>Коммиты и файлы</summary>

**Коммиты (9):**

- [`4cd2b82a`](https://github.com/D1MANYCH/dnd-app/commit/4cd2b82a) fix(weapons): рендер 3D-кубиков при бросках атаки и урона
- [`8a82d66a`](https://github.com/D1MANYCH/dnd-app/commit/8a82d66a) feat(notes): BUILD-NOTES-6 — расширенные варианты билдов + сворачиваемые секции
- [`9c5a43a8`](https://github.com/D1MANYCH/dnd-app/commit/9c5a43a8) chore(cleanup): remove stale v2.5.0 test reports
- [`44fac68b`](https://github.com/D1MANYCH/dnd-app/commit/44fac68b) chore(assets): OPT-5 — PNG → WebP q=85, ассеты 27 МБ → 5.1 МБ
- [`cadc0e6b`](https://github.com/D1MANYCH/dnd-app/commit/cadc0e6b) chore(dev): DEV-1..4 — оптимизация процесса разработки
- [`ca68a8a2`](https://github.com/D1MANYCH/dnd-app/commit/ca68a8a2) docs(readme): синхронизация changelog v2.6.0..v3.0.1
- [`465c54d4`](https://github.com/D1MANYCH/dnd-app/commit/465c54d4) feat(theme): UI-1 — light v3 палитра, body, лозы, override'ы
- [`ac77f56e`](https://github.com/D1MANYCH/dnd-app/commit/ac77f56e) feat(buttons): UI-2 — унифицированная .btn v3 + .icon-btn + анимации
- [`99d2dc69`](https://github.com/D1MANYCH/dnd-app/commit/99d2dc69) v3.1.0: light theme v3 — adaptive layout, button system, animations

**Файлы (129):**

- `build-notes-data.js` +1624 −0
- `style.css` +1169 −157
- `character-builds.js` +34 −295
- `app-notes.js` +181 −9
- `tools/bump-version.js` +163 −0
- `app-desktop.js` +114 −0
- `app-inventory.js` +64 −46
- `tools/archive-old.js` +83 −0
- `README.md` +37 −34
- `CLAUDE.md` +70 −0
- `tools/run-tests-hook.js` +67 −0
- `tests/reports/final.md` +0 −60
- `index.html` +38 −13
- `tests/reports/run-1.md` +0 −46
- `app-ui.js` +45 −0
- `app-core.js` +29 −14
- `tools/optimize-assets.py` +35 −0
- `data.js` +26 −5
- `dev-verify-builds.js` +30 −0
- `sw.js` +11 −10
- `app-combat.js` +1 −1
- `assets/abilities/cha.png` +0 −0
- `assets/abilities/cha.webp` +0 −0
- `assets/abilities/constitution.png` +0 −0
- `assets/abilities/constitution.webp` +0 −0
- `assets/abilities/dex.png` +0 −0
- `assets/abilities/dex.webp` +0 −0
- `assets/abilities/int.png` +0 −0
- `assets/abilities/int.webp` +0 −0
- `assets/abilities/str.png` +0 −0
- `assets/abilities/str.webp` +0 −0
- `assets/abilities/wis.png` +0 −0
- `assets/abilities/wis.webp` +0 −0
- `assets/avatar-fallback.png` +0 −0
- `assets/avatar-fallback.webp` +0 −0
- `assets/bg-body.png` +0 −0
- `assets/bg-body.webp` +0 −0
- `assets/classes/barbarian.png` +0 −0
- `assets/classes/barbarian.webp` +0 −0
- `assets/classes/bard.png` +0 −0
- …и ещё 89 файлов — см. полный патч

</details>

<a id="v3.0.1"></a>
## v3.0.1 — 7 мая 2026

🔧 OPT-5: ассеты PNG → WebP q=85 (assets/ ~26 МБ → ~5 МБ, экономия 86%); ускорена загрузка preview и кеш SW

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v3.0.0"></a>
## v3.0.0 — 2 мая 2026

✨ Гайды по билдам: модалка «📘 Гайд» автоматически открывается после применения билда — pitch, стиль игры, сильные/слабые стороны, синергия в партии, советы и план развития 1-5

✨ Бейдж «Билд: …» на листе персонажа стал кнопкой 📖 — клик открывает гайд повторно в любой момент

✨ Мини-гайд в карточках пикера билдов: 🎯 цель + 2 плюса (зелёные ✓) и 1 минус (красный ✗) под кратким описанием

✨ BUILD_GUIDES — карта 36 гайдов с полями pitch/playstyle/strengths/weaknesses/synergy/tips для всех билдов PHB 2014

✨ BUILD_NOTES — персонализированные заметки билда (внешность/личность/идеалы/связи/слабости + 2-3 сюжетных крючка), привязанные к расе, классу и предыстории

🐛 Заклинания/заговоры билдов больше не показывают пустые «UNDEFINED УРОВЕНЬ» карточки — applyBuild теперь резолвит имена в объекты SPELL_DATABASE с алиасами PHB→БД (Огненный снаряд→Огненный болт, Указание→Руководство, Рука мага→Волшебная рука и т.д., 17 пар)

🐛 Подкласс билда сохраняется на 1 уровне для locked-классов (Воин/Чародей/Колдун) — раньше затирался пустым значением и не возвращался при level-up

🐛 Расы билдов синхронизированы с <select>-опциями: «Высокий эльф»→«Высший эльф», «Гном леса»→«Лесной гном», «Дракорожд. (красный)»→«Драконорождённый» (×4)

🐛 Поле spell-stat корректно подсвечивается после применения билда — миграция старых en-lowercase значений (int/wis/cha) на ru-uppercase (ИНТ/МУД/ХАР) и sync с DC/atk/sc-btn

🐛 Боевая вкладка после applyBuild при «Без брони» (armorId=none): КД считается как «10 + ЛОВ» с осмысленной формулой; добавлен хинт «🚫 Нет владения никакой бронёй» для волшебников/чародеев

• Инвентарь билдов: каждый предмет получил поле location (🎒 рюкзак / 🧥 надето / ✋ в руке / 🪪 на поясе / 🪢 снаружи / 📦 на хранении) и эмодзи-тег в списке

• Тумблер «🎒 Снят/Надет рюкзак» в шапке инвентаря — снятие исключает предметы из рюкзака из расчёта слотов и приглушает их в списке

• Backstory билда обогащается разделом «## Сюжетные крючки» (2-3 пункта) — готовые зацепки для DM на старте игры

• Иконки 12 классов PHB: золотые PNG в assets/classes/ — варвар, бард, жрец, друид, воин, монах, паладин, следопыт, плут, чародей, колдун, волшебник

• Иконки 6 характеристик и всех 14 состояний PHB + 6 уровней истощения

• Иконки 8 школ магии в карточке заклинания + цветовая кодировка по школе

• Фильтр классов в поиске заклинаний newbie-friendly: PNG-иконки, группировка по источнику магии, зелёная подсветка своего класса, приглушённо-красная — чужих

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/fb9c34a1...5e253211) · 11 файлов, +2284 −221

<details><summary>Коммиты и файлы</summary>

**Коммиты (5):**

- [`a33ec66a`](https://github.com/D1MANYCH/dnd-app/commit/a33ec66a) feat(spells): фильтр классов с PNG-иконками + группировка по источнику магии
- [`ac345a0c`](https://github.com/D1MANYCH/dnd-app/commit/ac345a0c) fix(spells): компактная кнопка Все в фильтре классов (не растягивается)
- [`4f6c2a17`](https://github.com/D1MANYCH/dnd-app/commit/4f6c2a17) feat(spells): newbie-friendly фильтр классов с подсветкой своего/чужих
- [`a7853056`](https://github.com/D1MANYCH/dnd-app/commit/a7853056) feat(spells): редакция как подкатегория + равномерное растяжение групп фильтра
- [`5e253211`](https://github.com/D1MANYCH/dnd-app/commit/5e253211) v3.0.0: гайды по билдам + полировка автобилда (BUILD-FIX-6..12, BUILD-DESC-1..3)

**Файлы (11):**

- `app-core.js` +687 −8
- `character-builds.js` +663 −6
- `style.css` +302 −34
- `app-combat.js` +217 −93
- `index.html` +120 −66
- `dev-verify-builds.js` +172 −0
- `app-inventory.js` +52 −3
- `data.js` +31 −5
- `app-spells.js` +34 −1
- `sw.js` +5 −5
- `.gitignore` +1 −0

</details>

<a id="v2.9.1"></a>
## v2.9.1 — 27 апреля 2026

✨ Иконки 12 классов PHB (ICONS-1): золотые PNG в assets/classes/ — варвар, бард, жрец, друид, воин, монах, паладин, следопыт, плут, чародей, колдун, волшебник

✨ Иконки 6 характеристик (ICONS-2): assets/abilities/ — STR/DEX/CON/INT/WIS/CHA для спасбросков и боевого блока

✨ Иконки состояний (ICONS-3): assets/conditions/ — все 14 состояний PHB + 6 уровней истощения

✨ Иконки 8 школ магии (ICONS-4): золотые PNG в assets/schools/ — ограждение, воплощение, вызов, прорицание, очарование, иллюзия, некромантия, преобразование

• Бейдж школы магии в карточке заклинания: иконка + цветовая кодировка по школе (синий ограждение, оранжевая воплощение, фиолетовая иллюзия, зелёный некромантия и т.д.)

• Иконки классов в бейджах заклинаний: золотые PNG (волшебник, друид, бард, жрец, паладин, следопыт, чародей, колдун) вместо emoji

• Фильтр классов в модалке поиска заклинаний: PNG-иконки + группировка по источнику магии (Тайная / Божественная / Природная) с цветными разделителями

• Фильтр классов newbie-friendly: подписи классов под иконками, зелёная подсветка своего класса, приглушённо-красная — чужих, легенда внизу

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/725e65cf...fb9c34a1) · 60 файлов, +233 −37

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`ba8ac341`](https://github.com/D1MANYCH/dnd-app/commit/ba8ac341) fix(changelog): добавлена пропущенная запись v2.8.0 (3D-кубики)
- [`fb9c34a1`](https://github.com/D1MANYCH/dnd-app/commit/fb9c34a1) v2.9.1: иконки PHB (ICONS-1..4) — классы, характеристики, состояния, школы магии

**Файлы (60):**

- `style.css` +86 −7
- `app-core.js` +69 −6
- `data.js` +26 −4
- `index.html` +7 −7
- `assets/schools/NOTICE.txt` +13 −0
- `app-combat.js` +7 −5
- `sw.js` +9 −1
- `app-spells.js` +3 −3
- `app.js` +2 −2
- `assets/abilities/NOTICE.txt` +3 −0
- `assets/classes/NOTICE.txt` +3 −0
- `assets/conditions/NOTICE.txt` +3 −0
- `app-party.js` +1 −1
- `app-ui.js` +1 −1
- `assets/abilities/cha.png` +0 −0
- `assets/abilities/constitution.png` +0 −0
- `assets/abilities/dex.png` +0 −0
- `assets/abilities/int.png` +0 −0
- `assets/abilities/str.png` +0 −0
- `assets/abilities/wis.png` +0 −0
- `assets/classes/barbarian.png` +0 −0
- `assets/classes/bard.png` +0 −0
- `assets/classes/cleric.png` +0 −0
- `assets/classes/druid.png` +0 −0
- `assets/classes/fighter.png` +0 −0
- `assets/classes/monk.png` +0 −0
- `assets/classes/paladin.png` +0 −0
- `assets/classes/ranger.png` +0 −0
- `assets/classes/rogue.png` +0 −0
- `assets/classes/sorcerer.png` +0 −0
- `assets/classes/warlock.png` +0 −0
- `assets/classes/wizard.png` +0 −0
- `assets/conditions/blinded.png` +0 −0
- `assets/conditions/charmed.png` +0 −0
- `assets/conditions/deafened.png` +0 −0
- `assets/conditions/exhaustion_1.png` +0 −0
- `assets/conditions/exhaustion_2.png` +0 −0
- `assets/conditions/exhaustion_3.png` +0 −0
- `assets/conditions/exhaustion_4.png` +0 −0
- `assets/conditions/exhaustion_5.png` +0 −0
- …и ещё 20 файлов — см. полный патч

</details>

<a id="v2.9.0"></a>
## v2.9.0 — 20 апреля 2026

✨ Готовые билды персонажей (BUILD-1..BUILD-6): 36 билдов — по 3 на каждый из 12 классов PHB 2014

✨ Кнопка «📘 По готовому билду» при создании чара — предзаполняет класс, подкласс, расу, предысторию, статы, снаряжение и заклинания

✨ Баннер-подсказка в модалке повышения уровня: «Рекомендация: {что} — {почему}» с подсветкой рекомендованного выбора

✨ Схема чара v11: поле buildId + миграция старых персонажей

✨ Пикер билдов: фильтры по классу и роли (DPS/Tank/Support/Control/Utility), поиск по названию/классу/подклассу

✨ Бейдж «⚔️ Билд: …» на экране персонажа с тултипом summary и кнопкой «✕ Отвязать»

• Иконки ролей в бейджах и цветовая кодировка сложности билда (1 — зелёный, 2 — оранжевый, 3 — красный)

• A11y пикера: role="dialog", автофокус на поле поиска, ESC закрывает модалку, Enter/Space активирует карточку

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/5c097fb6...725e65cf) · 32 файлов, +4814 −36

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`7d098a28`](https://github.com/D1MANYCH/dnd-app/commit/7d098a28) fix(ui): выравнивание строки цвета кубиков и кнопок модалки записей
- [`76fa4e50`](https://github.com/D1MANYCH/dnd-app/commit/76fa4e50) fix(dice): деревянный поднос, 4 темы кубиков, физика внутри октагона
- [`725e65cf`](https://github.com/D1MANYCH/dnd-app/commit/725e65cf) v2.9.0: готовые билды персонажей (BUILD-1..BUILD-6)

**Файлы (32):**

- `character-builds.js` +1496 −0
- `vendor/dice-box/assets/themes/steel/default.json` +731 −0
- `vendor/dice-box/assets/themes/rock/smoothDice.json` +707 −0
- `vendor/dice-box/assets/themes/smooth/smoothDice.json` +707 −0
- `vendor/dice-box/assets/themes/wooden/smoothDice.json` +707 −0
- `app-core.js` +147 −0
- `style.css` +115 −3
- `index.html` +50 −9
- `app-ui.js` +30 −20
- `app-hp.js` +24 −0
- `data.js` +20 −4
- `vendor/dice-box/assets/themes/rock/theme.config.json` +22 −0
- `vendor/dice-box/assets/themes/steel/theme.config.json` +21 −0
- `vendor/dice-box/assets/themes/smooth/theme.config.json` +20 −0
- `vendor/dice-box/assets/themes/wooden/theme.config.json` +17 −0
- `assets/textures/dice-tray.jpg` +0 −0
- `assets/textures/wood-table.jpg` +0 −0
- `vendor/dice-box/assets/themes/rock/diffuse-dark.png` +0 −0
- `vendor/dice-box/assets/themes/rock/diffuse-light.png` +0 −0
- `vendor/dice-box/assets/themes/rock/normal.png` +0 −0
- `vendor/dice-box/assets/themes/rock/specularity.jpg` +0 −0
- `vendor/dice-box/assets/themes/smooth/diffuse-dark.png` +0 −0
- `vendor/dice-box/assets/themes/smooth/diffuse-light.png` +0 −0
- `vendor/dice-box/assets/themes/smooth/normal.png` +0 −0
- `vendor/dice-box/assets/themes/steel/diffuse-dark.jpg` +0 −0
- `vendor/dice-box/assets/themes/steel/diffuse-dark.png` +0 −0
- `vendor/dice-box/assets/themes/steel/diffuse-light.png` +0 −0
- `vendor/dice-box/assets/themes/steel/normal.png` +0 −0
- `vendor/dice-box/assets/themes/steel/specular.jpg` +0 −0
- `vendor/dice-box/assets/themes/wooden/diffuse.jpg` +0 −0
- `vendor/dice-box/assets/themes/wooden/normal.png` +0 −0
- `vendor/dice-box/assets/themes/wooden/specularity.jpg` +0 −0

</details>

<a id="v2.8.0"></a>
## v2.8.0 — 18 апреля 2026

✨ 3D-кубики: миграция на @3d-dice/dice-box (WebGL) — настоящая физика и реалистичные меши d4/d6/d8/d10/d12/d20/d100 (DICE2-1..5)

✨ Выбор цвета кубиков в настройках + 4 темы (классика, золото, кровь, океан)

✨ Деревянный поднос с октагональным бортиком — кубики ограничены областью броска

🐛 Починен режим d20 с преимуществом/помехой, добавлен скролл к началу при смене вкладки

🐛 Выравнивание строки цвета кубиков и кнопок в модалке записей

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/87b25238...5c097fb6) · 18 файлов, +48609 −720

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`1d45d285`](https://github.com/D1MANYCH/dnd-app/commit/1d45d285) fix: скролл в начало при смене вкладки и починка режима d20 (преим./помеха)
- [`e9286d10`](https://github.com/D1MANYCH/dnd-app/commit/e9286d10) DICE-5a: настоящие 3D-меши для d4/d6/d8
- [`5c097fb6`](https://github.com/D1MANYCH/dnd-app/commit/5c097fb6) v2.8.0: миграция кубиков на @3d-dice/dice-box (DICE2-1..5) + цвет кубиков

**Файлы (18):**

- `vendor/dice-box/Dice.js` +33326 −0
- `vendor/dice-box/world.onscreen.js` +13152 −0
- `vendor/dice-box/assets/themes/default/default.json` +731 −0
- `app-ui.js` +346 −359
- `style.css` +246 −322
- `vendor/dice-box/dice-box.es.js` +505 −0
- `vendor/dice-box/world.offscreen.js` +112 −0
- `vendor/dice-box/world.none.js` +97 −0
- `index.html` +44 −32
- `vendor/dice-box/assets/themes/default/theme.config.json` +20 −0
- `sw.js` +15 −2
- `app-core.js` +13 −3
- `data.js` +2 −2
- `vendor/dice-box/assets/ammo/ammo.wasm.wasm` +0 −0
- `vendor/dice-box/assets/themes/default/diffuse-dark.png` +0 −0
- `vendor/dice-box/assets/themes/default/diffuse-light.png` +0 −0
- `vendor/dice-box/assets/themes/default/normal.png` +0 −0
- `vendor/dice-box/assets/themes/default/specular.jpg` +0 −0

</details>

<a id="v2.7.0"></a>
## v2.7.0 — 17 апреля 2026

✨ Расширение вкладки «📝 Записи» (фазы N1–N6): структурированный «дневник игрока» вместо 4 плоских textarea

✨ Схема notesV2 v10 + миграция старых полей notes/features/appearance/magicItems в sections

✨ Под-табы по типам: Предыстория (8 секций), NPC, Квесты, Локации, Сессии, Зацепки, Свободно

✨ Markdown-тулбар (B/I/H/•/‟/🔗/▦/―), превью 👁, счётчик слов/символов, горячие клавиши Ctrl+S/B/I/K

✨ CRUD карточек-записей: теги-чипы, закрепление ★, сортировка, @-упоминания NPC, фильтр по тегам

✨ Поиск по всем записям с подсветкой совпадений, Enter — переход к следующему

✨ Экспорт .md и .json, импорт .json (слияние), импорт .md (как новая запись), печать с print-CSS

✨ Автособытия в Журнал: создание/обновление/удаление/закреп записей

✨ Drag-n-drop для ручного порядка закреплённых карточек (pinOrder)

• Адаптив: на узких экранах под-табы превращаются в <select>, тулбар — в горизонтальный scroll

• Индикатор «✓ сохранено HH:MM» в шапке вкладки Записи (debounced autosave)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9d2905fb...87b25238) · 5 файлов, +1877 −89

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`0693d50f`](https://github.com/D1MANYCH/dnd-app/commit/0693d50f) fix(ui): стеклянные шапка и таб-бар, возврат 🎲, удалён ватермарк вкладок
- [`87b25238`](https://github.com/D1MANYCH/dnd-app/commit/87b25238) v2.7.0: расширение вкладки «Записи» (фазы N1–N6) — дневник игрока

**Файлы (5):**

- `app-notes.js` +1148 −0
- `style.css` +551 −41
- `index.html` +103 −43
- `data.js` +46 −5
- `app-core.js` +29 −0

</details>

<a id="v2.6.0"></a>
## v2.6.0 — 16 апреля 2026

✨ Редизайн UI (фазы R1–R7): единый минималистичный тёмный стиль на токенах дизайн-системы

✨ Новые токены: палитра --bg-0..3, --accent/-hi/-lo, --overlay, радиусы --r-sm/md/lg/pill, отступы --sp-1..6, тени --sh-1/2/glow

✨ Унифицированные компоненты: .btn (+primary/ghost/danger), .card, .chip, .sheet (модалки)

✨ Плавающий FAB d20 (64px) по центру таб-бара + bottom-sheet панель бросков

✨ Единый тост результата для всех бросков (атаки, спасы, навыки, HD, death save)

• Таб-бар ужат до 4 табов (Лист/Заклинания/Инвентарь/Бой), «Записи/Мир/Журнал» — в drawer

• Компактный status-bar (HP/КД/Ур/условия) и упрощённый хедер

• Полировка: захардкоженные цвета, радиусы и отступы переведены на токены по всем экранам

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/b5407347...9d2905fb) · 22 файлов, +656 −210

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`517bbfd8`](https://github.com/D1MANYCH/dnd-app/commit/517bbfd8) chore: bump APP_VERSION 2.5.0 → 2.5.1
- [`9d2905fb`](https://github.com/D1MANYCH/dnd-app/commit/9d2905fb) v2.6.0: редизайн UI (фазы R1–R7) — единая дизайн-система

**Файлы (22):**

- `style.css` +490 −161
- `index.html` +40 −42
- `data.js` +29 −5
- `app.js` +25 −0
- `assets/avatar-fallback.svg` +11 −0
- `assets/empty-state.svg` +10 −0
- `assets/bg-body.svg` +9 −0
- `assets/tab-spells.svg` +9 −0
- `app-core.js` +7 −0
- `assets/tab-sheet.svg` +7 −0
- `README.md` +6 −1
- `assets/tab-battle.svg` +6 −0
- `assets/tab-inventory.svg` +6 −0
- `sw.js` +1 −1
- `assets/avatar-fallback.png` +0 −0
- `assets/bg-body.png` +0 −0
- `assets/d20-fab.png` +0 −0
- `assets/empty-state.png` +0 −0
- `assets/tab-battle.png` +0 −0
- `assets/tab-inventory.png` +0 −0
- `assets/tab-sheet.png` +0 −0
- `assets/tab-spells.png` +0 −0

</details>

<a id="v2.5.1"></a>
## v2.5.1 — 15 апреля 2026

🐛 Заклинание «Призматический поток»: исправлены классы (Чародей, Волшебник) — раньше было некорректное значение

🐛 Заклинание «Туманный шаг»: школа магии «передвижение» заменена на «вызов» по PHB (обе версии PH14/PH24)

🐛 Changelog синхронизирован — добавлены записи 2.3.0, 2.4.0, 2.5.0, убрана старая метка «new»

• Node-раннер автотестов (tests/headless-node.js) — 122 теста логики без браузера

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/e3eae756...b5407347) · 8 файлов, +228 −11

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`b5407347`](https://github.com/D1MANYCH/dnd-app/commit/b5407347) v2.5.1: автотестовый прогон, фикс данных и версии

**Файлы (8):**

- `tests/headless-node.js` +60 −0
- `tests/reports/final.md` +60 −0
- `tests/reports/run-1.md` +46 −0
- `data.js` +31 −5
- `README.md` +25 −1
- `spells.js` +4 −3
- `sw.js` +1 −1
- `tests/runner.html` +1 −1

</details>

<a id="v2.5.0"></a>
## v2.5.0 — 15 апреля 2026

✨ Подклассовые выборы (фазы A–G): интерактивные опции для Воина (стили боя, маневры), Следопыта, Варвара, Чародея, Монаха (дисциплины 4 стихий) и пассивных подклассов

✨ Уровневые фильтры опций подклассов — выбор открывается только при достижении нужного уровня

✨ Тест-ранер для автоматической проверки логики подклассов, ячеек и выборов (tests/runner.html)

• Покрытие автотестами: 122 кейса по ячейкам, выборам классов/подклассов, фичам и мультиклассу

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ef6f4a8a...e3eae756) · 9 файлов, +955 −50

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`e3eae756`](https://github.com/D1MANYCH/dnd-app/commit/e3eae756) v2.5.0: подклассовые выборы (фазы A–G) + тест-ранер

**Файлы (9):**

- `subclass-choices-data.js` +468 −0
- `class-choices.js` +124 −33
- `tests/headless.js` +138 −0
- `app.js` +93 −16
- `tests/fixtures.js` +67 −0
- `tests/runner.html` +41 −0
- `style.css` +22 −0
- `data.js` +1 −1
- `index.html` +1 −0

</details>

<a id="v2.4.0"></a>
## v2.4.0 — 13 апреля 2026

✨ Интерактивные классовые выборы: стиль боя, маневры Боевого мастера, метамагия Чародея, воззвания и пакты Колдуна, экспертиза Плута/Барда

✨ Унифицированная система ccGetAllChoicesFor — все выборы классов в одной структуре

🐛 Применение расовых бонусов характеристик без сброса при перезагрузке

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1f547ecc...ef6f4a8a) · 5 файлов, +728 −2

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`c2aed35d`](https://github.com/D1MANYCH/dnd-app/commit/c2aed35d) fix: применение расовых бонусов к характеристикам
- [`ef6f4a8a`](https://github.com/D1MANYCH/dnd-app/commit/ef6f4a8a) v2.4.0: интерактивные классовые выборы

**Файлы (5):**

- `class-choices.js` +562 −0
- `style.css` +99 −0
- `app-combat.js` +50 −0
- `index.html` +15 −0
- `data.js` +2 −2

</details>

<a id="v2.3.0"></a>
## v2.3.0 — 12 апреля 2026

✨ Категоризированные владения: отдельные разделы для языков, инструментов, доспехов и оружия

• Владения от класса/расы/мультикласса агрегируются без дубликатов

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/9f498980...1f547ecc) · 6 файлов, +1253 −123

<details><summary>Коммиты и файлы</summary>

**Коммиты (1):**

- [`1f547ecc`](https://github.com/D1MANYCH/dnd-app/commit/1f547ecc) v2.3.0: категоризированные владения — языки, инструменты, доспехи, оружие

**Файлы (6):**

- `app-combat.js` +910 −50
- `data.js` +181 −3
- `style.css` +94 −0
- `app-core.js` +58 −34
- `index.html` +9 −35
- `sw.js` +1 −1

</details>

<a id="v2.2.0"></a>
## v2.2.0 — 11 апреля 2026

✨ Мастер создания персонажа: новые персонажи начинают с шага «фиксация основы» — имя, класс, подкласс, раса, предыстория, уровень; нажатие на «🔒 Сохранить» блокирует поля от случайного изменения

✨ Расовые доп. выборы (Человек: 1 черта, Полуэльф: +1+1) появляются ТОЛЬКО после фиксации основы

✨ Кнопка «Изменить» рядом с зафиксированной основой — разблокировка с подтверждением

• Существующие персонажи автоматически считаются зафиксированными (миграция схемы v6)

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1b1f0d72...9f498980) · 8 файлов, +779 −41

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`2564bd05`](https://github.com/D1MANYCH/dnd-app/commit/2564bd05) chore: bump APP_VERSION to 2.1.0
- [`9f498980`](https://github.com/D1MANYCH/dnd-app/commit/9f498980) v2.2.0: мастер создания персонажа, расовые черты, блокировка подкласса

**Файлы (8):**

- `app.js` +276 −10
- `app-combat.js` +255 −13
- `style.css` +144 −0
- `data.js` +47 −5
- `index.html` +26 −6
- `app-core.js` +17 −2
- `app-ui.js` +13 −4
- `sw.js` +1 −1

</details>

<a id="v2.1.1"></a>
## v2.1.1 — 11 апреля 2026

🐛 Подкласс блокируется до нужного уровня (PHB 2014): Жрец/Чародей/Колдун — 1, Друид/Волшебник — 2, остальные — 3. Показывается плашка «🔒 Откроется на N уровне»

✨ Расовая черта Человека: панель «Расовая черта» под расовым бонусом — кнопка выбирает 1 черту PHB, не занимая слот ASI

✨ Полуэльф: панель выбора +1 к двум характеристикам (кроме ХАР) согласно PHB 2014

🐛 Селект подкласса автоматически обновляется при изменении уровня

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v2.1.0"></a>
## v2.1.0 — 10 апреля 2026

✨ Мультиклассирование (PHB) — добавление второго класса при level-up с проверкой требований характеристик

✨ Таблица ячеек заклинаний для мультикласса (full/half/third caster) с автоматическим расчётом

✨ Подклассы получили механические фичи PHB — все 50+ подклассов с описаниями по уровням

✨ Отдельный экран выбора класса при повышении уровня для мультикласс-персонажей

✨ Дополнительные владения брони/оружия от мультикласса (PHB p.164)

• Карточка персонажа показывает мультикласс-строку: «Воин 5 / Плут 3»

• Фичи подклассов отображаются с золотистой подсветкой и бейджем

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/15235ba5...1b1f0d72) · 8 файлов, +1459 −228

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`0b9960b3`](https://github.com/D1MANYCH/dnd-app/commit/0b9960b3) feat: уникальные 3D-полиэдры и анимации для каждого типа кубика
- [`6d26b9f1`](https://github.com/D1MANYCH/dnd-app/commit/6d26b9f1) chore: bump SW cache v21 для обновления кубиков
- [`1b1f0d72`](https://github.com/D1MANYCH/dnd-app/commit/1b1f0d72) v2.1.0: Фаза 6 — мультиклассирование и фичи подклассов

**Файлы (8):**

- `data.js` +502 −0
- `app-hp.js` +357 −75
- `style.css` +262 −71
- `app-ui.js` +128 −58
- `app-core.js` +127 −1
- `app-combat.js` +59 −9
- `index.html` +22 −12
- `sw.js` +2 −2

</details>

<a id="v2.0.0"></a>
## v2.0.0 — 9 апреля 2026

✨ Преимущество/Помеха — попап выбора режима при бросках атаки, спасбросков и навыков

✨ Клик по бонусу спасброска/навыка — бросок d20 с выбором adv/dis

✨ Отображение двух кубиков при преимуществе/помехе (оставленный + зачёркнутый)

✨ Сопротивления, иммунитеты, уязвимости к 13 типам урона PHB

✨ Бой двумя оружиями — бонусная атака вторым лёгким оружием (PHB)

✨ Боевой стиль «Сражение двумя оружиями» — добавляет мод. к урону бонусной атаки

• 3D CSS кубик с вращением куба и динамической подсветкой граней

• Улучшенная анимация броска: 3D вращение, замедление, glow при приземлении

• Градиенты и блики на SVG кубиках для объёмного вида

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/902b2a65...15235ba5) · 9 файлов, +911 −130

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`7ea682f7`](https://github.com/D1MANYCH/dnd-app/commit/7ea682f7) fix: добавлен APP_CHANGELOG для v1.8.0 и v1.9.0
- [`15235ba5`](https://github.com/D1MANYCH/dnd-app/commit/15235ba5) v2.0.0: Фаза 5 — боевые броски, сопротивления, бой двумя оружиями

**Файлы (9):**

- `style.css` +276 −30
- `app-combat.js` +264 −2
- `app-inventory.js` +136 −30
- `app.js` +64 −32
- `app-ui.js` +66 −12
- `data.js` +57 −5
- `index.html` +39 −18
- `app-core.js` +8 −0
- `sw.js` +1 −1

</details>

<a id="v1.9.0"></a>
## v1.9.0 — 9 апреля 2026

✨ Подготовка заклинаний: Жрец/Друид (МУД+ур.), Паладин (ХАР+½ур.), Волшебник (ИНТ+ур.)

✨ Счётчик «Подготовлено: X/Y» в разделе «Мои заклинания»

✨ Кнопка подготовки на каждом заклинании 1+ уровня с лимитом

✨ Неподготовленные заклинания визуально приглушены; заговоры всегда доступны

✨ Ритуальное колдовство: таймер 10 мин для Волшебника, Жреца, Друида, Барда

✨ Колдун: бейдж «ПАКТ» на ячейках, восстановление после короткого отдыха

• Попап состояний: группировка с разделением на состояния, баффы, дебаффы

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/ec7051e3...902b2a65) · 9 файлов, +472 −124

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`26da09c8`](https://github.com/D1MANYCH/dnd-app/commit/26da09c8) fix: попап состояний и предыстория при загрузке
- [`5ccc71bf`](https://github.com/D1MANYCH/dnd-app/commit/5ccc71bf) v1.9.0: Колдун + ритуалы (ф.3) и подготовка заклинаний (ф.4)
- [`902b2a65`](https://github.com/D1MANYCH/dnd-app/commit/902b2a65) v1.9.0: обновление версии, SW кэш и changelog

**Файлы (9):**

- `style.css` +163 −9
- `app-spells.js` +124 −2
- `app.js` +58 −53
- `app-combat.js` +54 −53
- `data.js` +32 −6
- `app-core.js` +21 −0
- `README.md` +15 −0
- `index.html` +4 −0
- `sw.js` +1 −1

</details>

<a id="v1.8.0"></a>
## v1.8.0 — 5 апреля 2026

✨ Экспертиза — кнопка «E» рядом с навыком, удваивает бонус мастерства

✨ Мастер на все руки — Бард ур.2+ получает +½ бонуса к непрофильным навыкам

✨ Владение оружием — автоопределение по классу, метка «без влад.»

✨ Спасбросок концентрации — авторолл ТЕЛ при уроне (DC = max(10, урон/2))

✨ Предыстория — заполняет инструменты и языки + авто-применение при загрузке

✨ Истощение — блок с переключателем уровня 0–6, длинный отдых снижает на 1

🐛 Исправления PHB 2014: ячейки, классовые фичи

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/c69d3f57...ec7051e3) · 10 файлов, +1008 −149

<details><summary>Коммиты и файлы</summary>

**Коммиты (4):**

- [`827bd140`](https://github.com/D1MANYCH/dnd-app/commit/827bd140) Обновлена версия на v1.7.1 и кеш SW на v17
- [`95729efc`](https://github.com/D1MANYCH/dnd-app/commit/95729efc) Добавлен changelog для v1.7.1
- [`2d76da90`](https://github.com/D1MANYCH/dnd-app/commit/2d76da90) Улучшена система обновлений: версия на главной, модалы до/после обновления
- [`ec7051e3`](https://github.com/D1MANYCH/dnd-app/commit/ec7051e3) v1.8.0: экспертиза, концентрация, истощение, исправления PHB 2014

**Файлы (10):**

- `app.js` +382 −52
- `app-combat.js` +246 −36
- `style.css` +161 −6
- `data.js` +49 −34
- `app-ui.js` +64 −11
- `app-hp.js` +43 −3
- `app-core.js` +35 −0
- `app-inventory.js` +22 −2
- `index.html` +5 −4
- `sw.js` +1 −1

</details>

<a id="v1.7.1"></a>
## v1.7.1 — 2 апреля 2026

✨ Статус-бар: реорганизация панели — бейджи, переключатели и меню в одну строку на десктопе

✨ Статус-бар: состояния/эффекты вынесены в попап со счётчиком вместо тегов

✨ Статус-бар: Вдохновение и Концентрация — крупные кнопки-переключатели

✨ Шапка: баннер с мини-аватаром, именем и подстрокой (Класс · Раса)

• Кнопка «Назад» — компактная pill-кнопка со стрелкой

• Заголовки секций — золотая полоска слева для визуальной иерархии

• Карточки — gold glow эффект при наведении

🐛 Мобильная адаптация: бейджи на всю ширину, переключатели отдельной строкой

🐛 Header сбрасывается при возврате к списку персонажей

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/1beb5671...c69d3f57) · 8 файлов, +427 −172

<details><summary>Коммиты и файлы</summary>

**Коммиты (3):**

- [`d2dc98dc`](https://github.com/D1MANYCH/dnd-app/commit/d2dc98dc) Добавлен .gitignore, убран .vscode/launch.json из отслеживания
- [`e13eb115`](https://github.com/D1MANYCH/dnd-app/commit/e13eb115) Обновлён README: актуальная структура модулей, 712 заклинаний, v1.7.0
- [`c69d3f57`](https://github.com/D1MANYCH/dnd-app/commit/c69d3f57) v1.7.1: редизайн статус-бара и визуальные улучшения UI

**Файлы (8):**

- `style.css` +172 −44
- `app.js` +85 −28
- `README.md` +45 −41
- `app-combat.js` +60 −24
- `index.html` +33 −15
- `app-core.js` +25 −5
- `.vscode/launch.json` +0 −15
- `.gitignore` +7 −0

</details>

<a id="v1.7.0"></a>
## v1.7.0 — 1 апреля 2026

✨ Рефакторинг: app.js (5000+ строк) разделён на 7 модулей для удобства разработки

🐛 Кошельки: теперь обновляются мгновенно при изменении Силы (STR 8/12/16/18)

🐛 Уровень: добавлено ограничение 20 уровня по PHB 2014

🐛 Класс доспеха: исправлен крэш при расчёте КД

🐛 HP: исправлено отображение NaN при пустом максимуме ХП

🐛 Черты: исправлен крэш при выборе несуществующей черты

🐛 Заклинания: исправлен крэш при удалении заклинания из пустого списка

🐛 Сохранение: ошибки localStorage теперь показываются пользователю

• Стабильность: добавлены проверки безопасности в модалки, статус-бар и систему группы

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/982cd12d...1beb5671) · 20 файлов, +7512 −1329

<details><summary>Коммиты и файлы</summary>

**Коммиты (21):**

- [`f95c6a0c`](https://github.com/D1MANYCH/dnd-app/commit/f95c6a0c) PC style update
- [`c7d9ecf0`](https://github.com/D1MANYCH/dnd-app/commit/c7d9ecf0) Ver. 1.6.1
- [`f61a76cb`](https://github.com/D1MANYCH/dnd-app/commit/f61a76cb) Avatar
- [`7e766f25`](https://github.com/D1MANYCH/dnd-app/commit/7e766f25) Delete images.jpg
- [`0a9adf04`](https://github.com/D1MANYCH/dnd-app/commit/0a9adf04) Undo ver 2.0
- [`d85b5f12`](https://github.com/D1MANYCH/dnd-app/commit/d85b5f12) refactor: замена var на let/const для современного синтаксиса ES6+
- [`f5511bcf`](https://github.com/D1MANYCH/dnd-app/commit/f5511bcf) feat: debounce автосохранение в localStorage (300мс)
- [`eacbb79f`](https://github.com/D1MANYCH/dnd-app/commit/eacbb79f) Title: Release version 2.0.0 with modular architecture and performance optimizations
- [`a099726e`](https://github.com/D1MANYCH/dnd-app/commit/a099726e) Merge pull request #1 from D1MANYCH/bug-checking-for-files-764c9
- [`2b8174be`](https://github.com/D1MANYCH/dnd-app/commit/2b8174be) Merge pull request #2 from D1MANYCH/main
- [`ac0df0f1`](https://github.com/D1MANYCH/dnd-app/commit/ac0df0f1) feat: добавлены модуль состояния, конфиг Jest и автотесты (v2.0.0)
- [`69369e66`](https://github.com/D1MANYCH/dnd-app/commit/69369e66) fix: обновлена версия кэша SW для активации уведомления v2.0.0
- [`cb21b122`](https://github.com/D1MANYCH/dnd-app/commit/cb21b122) Fix: Исправлена синтаксическая ошибка в app.js и обновлена версия на 2.0
- [`2a69d928`](https://github.com/D1MANYCH/dnd-app/commit/2a69d928) Update version to v2.0.0 and cache to v21
- [`b310743a`](https://github.com/D1MANYCH/dnd-app/commit/b310743a) Update APP_VERSION to 2.0.0 and APP_VERSION_DATE to 2026-03-29
- [`1d8a0958`](https://github.com/D1MANYCH/dnd-app/commit/1d8a0958) Update CHANGELOG version 2.0.0 date to 2026-03-29
- [`7e8ea7a7`](https://github.com/D1MANYCH/dnd-app/commit/7e8ea7a7) Force cache update to v22 to load APP_VERSION 2.0.0
- [`b7f0b4bc`](https://github.com/D1MANYCH/dnd-app/commit/b7f0b4bc) Force cache invalidation: add cache-control meta tags and version params to JS files
- [`c28ee696`](https://github.com/D1MANYCH/dnd-app/commit/c28ee696) Merge branch 'main' of https://github.com/D1MANYCH/dnd-app
- [`f9aaf8f6`](https://github.com/D1MANYCH/dnd-app/commit/f9aaf8f6) Ver 1.6.1
- [`1beb5671`](https://github.com/D1MANYCH/dnd-app/commit/1beb5671) v1.7.0: рефакторинг + исправления багов

**Файлы (20):**

- `app.js` +1447 −1086
- `app-ui.js` +1258 −0
- `app-combat.js` +1078 −0
- `app-core.js` +752 −0
- `style.css` +591 −5
- `app-hp.js` +592 −0
- `app-inventory.js` +567 −0
- `app-party.js` +551 −0
- `app-spells.js` +284 −0
- `sw.js` +91 −85
- `index.html` +113 −18
- `state.js` +51 −51
- `CHANGELOG.md` +42 −42
- `data.js` +46 −11
- `app.test.js` +19 −19
- `jest.config.js` +10 −10
- `.vscode/launch.json` +15 −0
- `README.md` +4 −1
- `.gitignore` +1 −1
- `images.jpg` +0 −0

</details>

<a id="v1.6.1"></a>
## v1.6.1 — 25 марта 2026

✨ Статус-бар: индикатор 🔮 [заклинание] рядом с вдохновением при активной концентрации (пульсация, скрыт если нет концентрации)

✨ Детали концентрации: клик по индикатору открывает панель с названием, длительностью из базы и правилом снятия концентрации + кнопка «✕ Завершить»

• Логика концентрации: повторное нажатие на то же заклинание открывает детали; новое заклинание прерывает старое

🐛 Модалка деталей концентрации: исправлено открытие оверлея (используется класс active вместо снятия hidden)

🐛 UI: поднят z-index кнопки/индикатора в статус-баре, чтобы не перекрывалась другими элементами

🐛 endConcentration: поиск данных о заклинании учитывает также пользовательские заклинания (mySpells)

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v1.6.0"></a>
## v1.6.0 — Март 2026

✨ Навигация: центральная FAB-кнопка кубика в таббаре, боковое drawer-меню по свайпу влево или кнопке ☰

✨ Кнопки отдыха: ☕ Короткий и 🛏️ Долгий отдых перенесены в блок ХП на вкладке Лист

✨ Заклинания: карточки сворачиваются/разворачиваются тапом, мета-строка всегда видна

✨ Заклинания: новый дизайн блока характеристик — три кнопки ИНТ/МУД/ХАР вместо dropdown

✨ Ячейки заклинаний: компактные строки вместо сетки карточек, кнопка «Длинный отдых»

✨ Инвентарь: система слотов в стиле OSR (броня=3, оружие=1, зелье=½, свиток=1)

✨ Инвентарь: прогресс-бар загрузки, слоты зависят от СИЛ персонажа

✨ Инвентарь: карточки предметов со сворачиванием, кнопки скрыты внутри

✨ Инвентарь: мешочки для монет — до 4 штук по 500 монет, разблокируются по СИЛ 8/12/16/18

✨ Кошелёк: карточки монет с крупными цифрами, итог в ЗМ, модалка размена между монетами

✨ Справка: кнопка ? рядом с полями веса и слотов открывает таблицы D&D предметов

✨ Кубик: SVG-форма каждого типа кубика (d4=треугольник, d6=квадрат, d8=ромб и т.д.) с анимацией тряски

• Автозаполнение веса предмета по названию — словарь ~80 стандартных предметов D&D

• Форма предмета: кнопки быстрого количества ×1 ×5 ×10 ×20, поле кастомных слотов

🐛 Редактирование первого предмета (index 0) создавало новый вместо обновления

🐛 Вкладки Мир/Бой/Журнал были вне screen-character и оставались видны на главном экране

🐛 Свайп бокового меню не работал на главном экране без персонажа

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/dc3a042b...982cd12d) · 6 файлов, +14105 −2326

<details><summary>Коммиты и файлы</summary>

**Коммиты (2):**

- [`0236dac5`](https://github.com/D1MANYCH/dnd-app/commit/0236dac5) Ver. 1.6.0
- [`982cd12d`](https://github.com/D1MANYCH/dnd-app/commit/982cd12d) v1.6.0

**Файлы (6):**

- `spells.js` +11500 −1769
- `style.css` +1458 −276
- `app.js` +659 −93
- `index.html` +438 −173
- `data.js` +49 −14
- `sw.js` +1 −1

</details>

<a id="v1.5.2"></a>
## v1.5.2 — Март 2026

✨ База заклинаний расширена до 712 заклинаний — PHB 2014 и PHB 2024 полностью

✨ Фильтр классов работает корректно — каждое заклинание привязано к своим классам

• Поиск заклинаний: показывается счётчик результатов и подсказка при открытии

🐛 Исправлено отображение заклинаний в поиске

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v1.5.1"></a>
## v1.5.1 — Март 2026

✨ База заклинаний: 190 заклинаний встроены в приложение — заговоры и заклинания 1–9 уровней (PH14, PH24, XGE)

• Заклинания из базы доступны сразу без импорта — пользовательские добавления сохраняются отдельно

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/compare/272cbe23...dc3a042b) · 9 файлов, +4733 −1180

<details><summary>Коммиты и файлы</summary>

**Коммиты (7):**

- [`018d08d2`](https://github.com/D1MANYCH/dnd-app/commit/018d08d2) New lvlup
- [`4b44cbb3`](https://github.com/D1MANYCH/dnd-app/commit/4b44cbb3) Optimization
- [`b3b66077`](https://github.com/D1MANYCH/dnd-app/commit/b3b66077) Update Icon
- [`0b2d1cea`](https://github.com/D1MANYCH/dnd-app/commit/0b2d1cea) Update icon
- [`7659ba1b`](https://github.com/D1MANYCH/dnd-app/commit/7659ba1b) Debug
- [`65fbba41`](https://github.com/D1MANYCH/dnd-app/commit/65fbba41) Ver 1.5
- [`dc3a042b`](https://github.com/D1MANYCH/dnd-app/commit/dc3a042b) v1.5.1

**Файлы (9):**

- `spells.js` +2670 −0
- `app.js` +1102 −842
- `data.js` +400 −230
- `style.css` +355 −63
- `README.md` +159 −20
- `sw.js` +18 −13
- `index.html` +27 −2
- `icon-192.svg` +0 −8
- `manifest.json` +2 −2

</details>

<a id="v1.5.0"></a>
## v1.5.0 — Март 2026

✨ Обновления приложения: при выходе новой версии появляется экран с описанием изменений и кнопкой установки

✨ Уведомления: все системные сообщения показываются как всплывающие тосты вместо блокирующих окон

• Миграции данных: старые сохранения автоматически обновляются до новой структуры без потери персонажей

• Иконка приложения обновлена на детализированную версию с d20 и рунами

• История ХП теперь сохраняется между сессиями браузера

🐛 Сохранение при вводе текста оптимизировано — больше не тормозит при быстром печатании

🐛 Счётчик навыков теперь корректно работает при любом количестве навыков

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v1.4.0"></a>
## v1.4.0 — Март 2026

✨ Кидалка: кнопки Преимущество и Помеха (2к20, берёт выше/ниже)

✨ Кидалка: произвольная формула — 2к6+3, 4к4, 1к20-1 и любые комбинации

✨ Черты PHB: добавлены Вдохновляющий лидер, Лингвист, Дикий атакующий, Мастер магии

✨ Предыстории: добавлены Аколит, Артист, Матрос, Подмастерье, Преступник/Шпион

• Классовые умения: все 12 классов заполнены полностью по всем уровням 1–20

🐛 Короткий отдых: кости хитов теперь бросаются реально — виден каждый результат

🐛 Колдун: ячейки пакта корректно восстанавливаются на коротком отдыхе

🐛 Спасброски смерти сбрасываются автоматически при лечении из 0 ХП

🐛 АСИ с чертой: уровень теперь корректно помечается как использованный

• Условия и Временные эффекты полностью переработаны по Fantom Studio PH14

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v1.3.0"></a>
## v1.3.0 — Март 2026

✨ Прихвостни — фамильяры, скакуны, призванные существа с ХП и атаками

✨ Журнал персонажа — история сессий, уровней, событий с фильтрами

✨ АСИ с выбором черты — 32 черты PHB по Fantom Studio с авто-эффектами

✨ Версия приложения отображается на экране профилей

🐛 Исправлена кнопка АСИ — теперь корректно активируется при выборе стата или черты

🐛 Модалка прихвостня теперь открывается с любой вкладки

🔍 [Полный патч](https://github.com/D1MANYCH/dnd-app/commit/272cbe23) · 14 файлов, +18996 −8891

<details><summary>Коммиты и файлы</summary>

**Коммиты (52):**

- [`5e5a2f8b`](https://github.com/D1MANYCH/dnd-app/commit/5e5a2f8b) Add files via upload
- [`b9b91cf9`](https://github.com/D1MANYCH/dnd-app/commit/b9b91cf9) Delete README.md
- [`93929a43`](https://github.com/D1MANYCH/dnd-app/commit/93929a43) Delete app.js
- [`263d49ab`](https://github.com/D1MANYCH/dnd-app/commit/263d49ab) Delete data.js
- [`a768a5e3`](https://github.com/D1MANYCH/dnd-app/commit/a768a5e3) Delete files.zip
- [`545c955c`](https://github.com/D1MANYCH/dnd-app/commit/545c955c) Delete index.html
- [`2b3894c9`](https://github.com/D1MANYCH/dnd-app/commit/2b3894c9) Delete manifest.json
- [`85e14993`](https://github.com/D1MANYCH/dnd-app/commit/85e14993) Delete style.css
- [`e3764881`](https://github.com/D1MANYCH/dnd-app/commit/e3764881) Delete sw.js
- [`d39d2605`](https://github.com/D1MANYCH/dnd-app/commit/d39d2605) Delete dnd-app.zip
- [`7c071960`](https://github.com/D1MANYCH/dnd-app/commit/7c071960) Add files via upload
- [`c3ce73ba`](https://github.com/D1MANYCH/dnd-app/commit/c3ce73ba) Add icon-192.svg for application icon
- [`a2e86605`](https://github.com/D1MANYCH/dnd-app/commit/a2e86605) Update print statement from 'Hello' to 'Goodbye'
- [`5968a499`](https://github.com/D1MANYCH/dnd-app/commit/5968a499) Add files via upload
- [`045b3066`](https://github.com/D1MANYCH/dnd-app/commit/045b3066) fix: иконки PNG в manifest.json
- [`1f612990`](https://github.com/D1MANYCH/dnd-app/commit/1f612990) fix: обновить пути иконок на PNG в sw.js
- [`11ad8e03`](https://github.com/D1MANYCH/dnd-app/commit/11ad8e03) Delete icons/icon-192.svg
- [`3761017e`](https://github.com/D1MANYCH/dnd-app/commit/3761017e) Delete icons/icon-512.svg
- [`bfd494ff`](https://github.com/D1MANYCH/dnd-app/commit/bfd494ff) Update manifest.json
- [`cac050a4`](https://github.com/D1MANYCH/dnd-app/commit/cac050a4) Add icons and apple-touch-icon links to index.html
- [`8b017606`](https://github.com/D1MANYCH/dnd-app/commit/8b017606) Update CACHE_NAME to version 2
- [`7ac65dac`](https://github.com/D1MANYCH/dnd-app/commit/7ac65dac) Change apple-mobile-web-app-capable meta tag
- [`504578a8`](https://github.com/D1MANYCH/dnd-app/commit/504578a8) Update icon purposes in manifest.json
- [`2fb80389`](https://github.com/D1MANYCH/dnd-app/commit/2fb80389) Add screenshots to manifest.json
- [`3d0934c3`](https://github.com/D1MANYCH/dnd-app/commit/3d0934c3) Enhance character sheet with HP display and controls
- [`a730b5fc`](https://github.com/D1MANYCH/dnd-app/commit/a730b5fc) Update print statement from 'Hello' to 'Goodbye'
- [`642e2082`](https://github.com/D1MANYCH/dnd-app/commit/642e2082) Update fmt.Println message from 'Hello' to 'Goodbye'
- [`1174a361`](https://github.com/D1MANYCH/dnd-app/commit/1174a361) Update print statement from 'Hello' to 'Goodbye'
- [`e7559100`](https://github.com/D1MANYCH/dnd-app/commit/e7559100) Update service worker cache name to v3
- [`be50a52e`](https://github.com/D1MANYCH/dnd-app/commit/be50a52e) feat: add loadDeathSaves, updateHPDisplay, toggleDeathSave functions
- [`32b023e0`](https://github.com/D1MANYCH/dnd-app/commit/32b023e0) fix: sync death saves IDs and HP display with index.html
- [`bbdee501`](https://github.com/D1MANYCH/dnd-app/commit/bbdee501) fix: add openASIModal function
- [`49021146`](https://github.com/D1MANYCH/dnd-app/commit/49021146) fix: replace style.css with full version (40KB)
- [`de868ef5`](https://github.com/D1MANYCH/dnd-app/commit/de868ef5) Add mobile web app capability meta tag
- [`526e3e1d`](https://github.com/D1MANYCH/dnd-app/commit/526e3e1d) Update cache version and enhance fetch handling
- [`01afc7cb`](https://github.com/D1MANYCH/dnd-app/commit/01afc7cb) Улучшение HP блока и истории
- [`95bb2983`](https://github.com/D1MANYCH/dnd-app/commit/95bb2983) New icon
- [`d8539d6f`](https://github.com/D1MANYCH/dnd-app/commit/d8539d6f) Update sw
- [`7ef449c0`](https://github.com/D1MANYCH/dnd-app/commit/7ef449c0) Site Icon
- [`ff676f38`](https://github.com/D1MANYCH/dnd-app/commit/ff676f38) new update
- [`8e94b971`](https://github.com/D1MANYCH/dnd-app/commit/8e94b971) Delete README.md content
- [`6d861eec`](https://github.com/D1MANYCH/dnd-app/commit/6d861eec) Merge branch 'main' of https://github.com/D1MANYCH/dnd-app
- [`4ac806f7`](https://github.com/D1MANYCH/dnd-app/commit/4ac806f7) characters update
- [`a7212211`](https://github.com/D1MANYCH/dnd-app/commit/a7212211) characters update
- [`68306d08`](https://github.com/D1MANYCH/dnd-app/commit/68306d08) Style update
- [`8aa79d1e`](https://github.com/D1MANYCH/dnd-app/commit/8aa79d1e) Cache update
- [`59ac8218`](https://github.com/D1MANYCH/dnd-app/commit/59ac8218) Update Index
- [`40109c0b`](https://github.com/D1MANYCH/dnd-app/commit/40109c0b) Icon update
- [`cad340db`](https://github.com/D1MANYCH/dnd-app/commit/cad340db) New update
- [`05456d75`](https://github.com/D1MANYCH/dnd-app/commit/05456d75) Fight update
- [`0963022d`](https://github.com/D1MANYCH/dnd-app/commit/0963022d) Update list
- [`272cbe23`](https://github.com/D1MANYCH/dnd-app/commit/272cbe23) v1.3.0

**Файлы (14):**

- `app.js` +7474 −3629
- `style.css` +6558 −2849
- `index.html` +2399 −1051
- `data.js` +2195 −1120
- `README.md` +120 −119
- `sw.js` +141 −74
- `manifest.json` +85 −33
- `icons/icon-192.svg` +8 −8
- `icons/icon-512.svg` +8 −8
- `icon-192.svg` +8 −0
- `dnd-app.zip` +0 −0
- `files.zip` +0 −0
- `icons/icon-192.png` +0 −0
- `icons/icon-512.png` +0 −0

</details>

<a id="v1.2.0"></a>
## v1.2.0 — Март 2026

✨ Трекер классовых ресурсов — Ярость, Ки, Порыв, Наложение рук и др.

✨ Пассивные умения класса отображаются в листе персонажа

✨ Сброс ресурсов автоматически при коротком и длинном отдыхе

✨ Вкладка Журнал добавлена в навигацию

• Данные по Fantom Studio: расы, подрасы, бонусы характеристик

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v1.1.0"></a>
## v1.1.0 — Март 2026

✨ Выбор брони из списка с авто-расчётом КД по типу и ЛОВ

✨ Чекбокс Щит (+2 к КД)

✨ Ручной ввод максимума ХП + кнопка пересчёта по классу/уровню/ТЕЛ

✨ Авто-скорость при смене расы (25/30/35 фт)

✨ Авто-навыки при выборе предыстории

✨ Авто-спасброски и владения при смене класса

✨ Расовые бонусы отображаются плашкой под выбором расы

• Характеристики — компактная сетка 6 колонок, кнопки +/−

• Навыки — двухколоночный компактный список

• Спасброски, Навыки, Условия, Эффекты — аккордеоны (скрыты по умолчанию)

• Бонус мастерства вынесен в шапку секции характеристик

🐛 Смена класса теперь сбрасывает спасброски предыдущего класса

🐛 Хоббит и Полурослик объединены; добавлены все подрасы Fantom Studio

_Релизного коммита нет в истории репозитория — патч недоступен._

<a id="v1.0.0"></a>
## v1.0.0 — Февраль 2026

✨ Лист персонажа D&D 5e — характеристики, навыки, спасброски, КД

✨ Трекер ХП с историей урона и лечения, кости хитов, спасброски смерти

✨ Заклинания — ячейки, книга заклинаний, заклинательная характеристика

✨ Инвентарь с весом, монеты, разбивка по категориям

✨ Вкладка Мир — отряд, NPC, монстры с описаниями

✨ Трекер боя с инициативой, статусами и пипками урона

✨ Повышение уровня с авто-расчётом ХП и ячеек заклинаний

✨ Короткий и длинный отдых с восстановлением ресурсов

✨ Экспорт / импорт данных персонажей, резервные копии

✨ PWA — устанавливается на телефон, работает офлайн

✨ Переводы по Fantom Studio (русский язык)

_Релизного коммита нет в истории репозитория — патч недоступен._
