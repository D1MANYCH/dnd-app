# Прогон автотестов — итерация 1 (2026-04-15)

## Фаза 0 — инфраструктура
- [x] `tests/headless-node.js` создан (для Node, когда будет установлен — сейчас Node отсутствует).
- [x] Основной канал — preview MCP + существующий `tests/runner.html`.

## Фаза 1 — логические тесты (headless.js)
- **122 pass / 0 fail** после бампа кеша фикстур (`?v=2` → `?v=3`).
- Покрытие: slot-таблицы, ccGetAllChoicesFor, SUBCLASS_FEATURES всех подклассов, SUBCLASS_CHOICES options+optionsDict, level-gate Монаха, мультикласс.

## Фаза 2 — браузерный smoke (index.html, 1440×900 → 360×640)
- [x] Загрузка главной: title OK, `console.error` = 0, `console.warn` = 0, failed network = 0.
- [x] Горизонтального overflow нет ни на 360×640, ни на 1425×900.
- [x] Валидация данных: 712 заклинаний, все с `name`/`level`/`school`; SUBCLASS_CHOICES без пропусков в optionsDict.
- [ ] Wizard создания персонажа для 3 архетипов — НЕ прогнан (следующая итерация).
- [ ] Интерактив (кубик, урон, отдых, ячейки, модалки) — НЕ прогнан.
- [ ] Скриншоты 3 разрешений — НЕ сохранены (требуется место под артефакты).

## Найденные проблемы

| # | Категория | Приоритет | Описание | Файл | Статус |
|---|---|---|---|---|---|
| 1 | data/ui | Medium | `APP_VERSION="2.4.0"` при последнем коммите v2.5.0 — шапка показывает старую версию | data.js:1517 | **Fixed** → 2.5.0 |
| 2 | data | Medium | `APP_VERSION_DATE="2026-04-12"` устарел | data.js:1518 | **Fixed** → 2026-04-15 |
| 3 | pwa | Medium | `CACHE_NAME='dnd-sheet-v28'` не синхронизирован с релизом — пользователи получают старые файлы из кеша | sw.js:5 | **Fixed** → v29 |
| 4 | tests | Low | В runner.html `fixtures.js?v=2` грузил устаревшую фикстуру Следопыта L1 | tests/runner.html:38 | **Fixed** → `?v=3` |

## Что запланировано на следующие итерации

### Итерация 2 — Wizard + интерактив
- Создать персонажа Воин-Чемпион L10, Волшебник-Эвокатор L10, Монах-Четырёх Стихий L17 через preview_click.
- После каждого шага — `preview_console_logs error` и `preview_snapshot`.
- Проверить: бросок кубика, применение урона, short/long rest, трата ячейки, переключение preparedness, open/close всех модалок.
- localStorage round-trip: сохранить → reload → проверить восстановление.

### Итерация 3 — Расширение headless.js (блоки 7-13)
Добавить тесты для модулей `app-combat.js`, `app-hp.js`, `app-spells.js`, `app-inventory.js`, `app-party.js`. Требуется загрузить их в runner.html и написать t()-блоки против state-мутаций.

### Итерация 4 — Статический анализ
grep по типичным багам (`== null`, `parseInt` без radix, TODO/FIXME, orphan console.log), references integrity между data.js ↔ class-choices.js ↔ subclass-choices-data.js.

### Итерация 5 — Полный регресс + final.md

## Как продолжить

Пишите «продолжай итерацию 2» — и я буду прогонять следующий этап, фиксить найденное, обновлять этот отчёт.
