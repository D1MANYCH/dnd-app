# Отчёт по использованию CSS (OPT-6)

Генератор: `node tools/css-usage-report.js`. Только диагностика — правки вручную в OPT-7.

Источник: `style.css` (342711 байт, 10855 строк). Использование искалось по: `index.html`, `app-backup.js`, `app-combat.js`, `app-core.js`, `app-desktop.js`, `app-hp.js`, `app-inventory.js`, `app-log.js`, `app-notes.js`, `app-party.js`, `app-pdf.js`, `app-spells.js`, `app-ui.js`, `bg-orbits.js`, `build-notes-data.js`, `character-builds.js`, `class-choices.js`, `data.js`, `dev-verify-builds.js`, `dice-arena-bg.js`, `history-stack.js`, `monsters-srd.js`, `npc-srd.js`, `spells.js`, `subclass-choices-data.js`, `sw.js`.

## Сводка

| Метрика | Всего | Живых | Подозрительных | Мёртвых |
|---|---|---|---|---|
| Селекторы | 2369 | 2318 | 51 | 0 |
| Классы | 1244 | 1206 | 38 | 0 |
| ID | 25 | 25 | 0 | 0 |

Правил всего: 2206 · полностью мёртвых: 0 (~0 байт) · частично мёртвых: 0 · @keyframes без использования: 0 из 31 · аномалий парсинга: 0.

Sanity (`btn`, `field`, `bp-card`, `char-card`): OK, все живые.

Терминология: **мёртвый** — имя не найдено ни целиком, ни фрагментом; **подозрительный** — найден только фрагмент (возможна сборка конкатенацией) — проверять вручную. Совпадение имени класса со словом в JS/changelog даёт ложно-живой — отчёт намеренно ошибается в сторону «живой».

## Мёртвые классы (0)

Нет.

## Мёртвые ID (0)

Нет.

## Подозрительные (возможна конкатенация — проверять вручную) (38)

| Имя | Правил | Строки style.css | Найдено как |
|---|---|---|---|
| `.app-toast-error` | 1 | 8107 | prefix `app-toast-` |
| `.app-toast-info` | 1 | 8109 | prefix `app-toast-` |
| `.app-toast-success` | 1 | 8106 | prefix `app-toast-` |
| `.app-toast-warn` | 1 | 8108 | prefix `app-toast-` |
| `.bp-diff-1` | 3 | 10299, 10325, 10337 | prefix `bp-diff-` |
| `.bp-diff-2` | 3 | 10300, 10326, 10338 | prefix `bp-diff-` |
| `.bp-diff-3` | 3 | 10301, 10327, 10339 | prefix `bp-diff-` |
| `.bp-role-Control` | 1 | 10285 | prefix `bp-role-` |
| `.bp-role-DPS` | 1 | 10283 | prefix `bp-role-` |
| `.bp-role-Support` | 1 | 10286 | prefix `bp-role-` |
| `.bp-role-Tank` | 1 | 10284 | prefix `bp-role-` |
| `.bp-role-Utility` | 1 | 10287 | prefix `bp-role-` |
| `.class-bard` | 1 | 5046 | prefix `class-` |
| `.class-both` | 2 | 5049, 5050 | prefix `class-` |
| `.class-cleric` | 1 | 5045 | prefix `class-` |
| `.class-druid` | 1 | 5042 | prefix `class-` |
| `.class-paladin` | 1 | 5047 | prefix `class-` |
| `.class-ranger` | 1 | 5048 | prefix `class-` |
| `.class-sorcerer` | 1 | 5043 | prefix `class-` |
| `.class-warlock` | 1 | 5044 | prefix `class-` |
| `.class-wizard` | 1 | 5041 | prefix `class-` |
| `.effect-icon-svg` | 1 | 2256 | prefix `effect-` |
| `.res-row-imm` | 1 | 9367 | prefix `res-row-` |
| `.res-row-res` | 1 | 9366 | prefix `res-row-` |
| `.res-row-vul` | 1 | 9368 | prefix `res-row-` |
| `.res-tag-imm` | 3 | 901, 912, 9382 | prefix `res-tag-` |
| `.res-tag-res` | 3 | 896, 911, 9381 | prefix `res-tag-` |
| `.res-tag-vul` | 3 | 906, 913, 9383 | prefix `res-tag-` |
| `.school-abjuration` | 1 | 5178 | prefix `school-` |
| `.school-conjuration` | 1 | 5179 | prefix `school-` |
| `.school-divination` | 1 | 5180 | prefix `school-` |
| `.school-enchantment` | 1 | 5181 | prefix `school-` |
| `.school-evocation` | 1 | 5182 | prefix `school-` |
| `.school-illusion` | 1 | 5183 | prefix `school-` |
| `.school-necromancy` | 1 | 5184 | prefix `school-` |
| `.school-transmutation` | 1 | 5185 | prefix `school-` |
| `.source-ph14` | 1 | 5038 | prefix `source-` |
| `.source-ph24` | 1 | 5039 | prefix `source-` |

## Полностью мёртвые правила (0, ~0 байт)

Все селекторы правила мертвы — кандидаты на удаление целиком.

Нет.

## Частично мёртвые правила (0)

Мёртвые селекторы можно убрать из списка, остальное правило живое.

Нет.

## Аномалии парсинга (0)

«Селектор» содержит `*/` — внутри комментария встретился текст `*/`, по спецификации CSS комментарий закрылся раньше времени. Хвост стал мусорным CSS, и браузер при error-recovery **теряет следующее реальное правило**. Чинить текст комментария в style.css (убрать `*/` из прозы) и перезапускать отчёт — классы внутри аномалий не учтены в статистике.

Нет.

## Неиспользуемые @keyframes (0)

Нет.
