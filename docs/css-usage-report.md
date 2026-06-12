# Отчёт по использованию CSS (OPT-6)

Генератор: `node tools/css-usage-report.js`. Только диагностика — правки вручную в OPT-7.

Источник: `style.css` (362463 байт, 11490 строк). Использование искалось по: `index.html`, `app-backup.js`, `app-combat.js`, `app-core.js`, `app-desktop.js`, `app-hp.js`, `app-inventory.js`, `app-log.js`, `app-notes.js`, `app-party.js`, `app-pdf.js`, `app-spells.js`, `app-ui.js`, `bg-orbits.js`, `build-notes-data.js`, `character-builds.js`, `class-choices.js`, `data.js`, `dev-verify-builds.js`, `dice-arena-bg.js`, `history-stack.js`, `monsters-srd.js`, `npc-srd.js`, `spells.js`, `subclass-choices-data.js`, `sw.js`.

## Сводка

| Метрика | Всего | Живых | Подозрительных | Мёртвых |
|---|---|---|---|---|
| Селекторы | 2550 | 2317 | 79 | 154 |
| Классы | 1367 | 1208 | 59 | 100 |
| ID | 25 | 25 | 0 | 0 |

Правил всего: 2361 · полностью мёртвых: 132 (~15688 байт) · частично мёртвых: 5 · @keyframes без использования: 0 из 33 · аномалий парсинга: 1.

Sanity (`btn`, `field`, `bp-card`, `char-card`): OK, все живые.

Терминология: **мёртвый** — имя не найдено ни целиком, ни фрагментом; **подозрительный** — найден только фрагмент (возможна сборка конкатенацией) — проверять вручную. Совпадение имени класса со словом в JS/changelog даёт ложно-живой — отчёт намеренно ошибается в сторону «живой».

## Мёртвые классы (100)

| Имя | Правил | Строки style.css |
|---|---|---|
| `.ac-block` | 1 | 967 |
| `.accordion` | 1 | 661 |
| `.accordion-content` | 1 | 661 |
| `.avatar-modal-actions` | 1 | 9694 |
| `.avatar-url-row` | 1 | 9814 |
| `.back-btn` | 3 | 558, 2270, 2285 |
| `.back-btn-container` | 1 | 2269 |
| `.battle-drag-handle` | 2 | 874, 6976 |
| `.battle-drag-hint` | 2 | 874, 6972 |
| `.battle-row-unchecked` | 1 | 6975 |
| `.battle-type-label` | 2 | 874, 6981 |
| `.bonus-display` | 1 | 5394 |
| `.card-v2` | 2 | 1897, 1905 |
| `.char-avatar` | 1 | 603 |
| `.char-hp-bar` | 1 | 3614 |
| `.char-hp-bar-wrap` | 1 | 3613 |
| `.char-selector-wrap` | 1 | 10869 |
| `.checkbox-wrapper` | 1 | 5392 |
| `.chip--info` | 1 | 1822 |
| `.chip--solid` | 1 | 1823 |
| `.chip--success` | 1 | 1821 |
| `.conc-status-icon` | 1 | 9511 |
| `.conditions-btn-icon` | 1 | 2015 |
| `.conditions-section` | 2 | 2575, 2582 |
| `.disease` | 3 | 2135, 2620, 2631 |
| `.ds-reset-btn` | 2 | 6551, 6560 |
| `.ds-roll-btn` | 2 | 6524, 6534 |
| `.dsvg-wrap` | 1 | 8896 |
| `.effects-section` | 2 | 2500, 2507 |
| `.empty-state-illustration` | 1 | 10207 |
| `.feature-block` | 1 | 967 |
| `.floating-btn` | 5 | 1530, 3718, 3736, 3737, 6171 |
| `.floating-btn-dice` | 1 | 3734 |
| `.floating-btn-rest` | 1 | 3735 |
| `.floating-buttons` | 2 | 3708, 6170 |
| `.hd-roll-btn` | 3 | 6467, 6479, 6480 |
| `.header-glass` | 1 | 10869 |
| `.hit-die-info-row` | 1 | 6006 |
| `.hit-die-quick-block` | 1 | 5999 |
| `.hp-bar-fill` | 3 | 502, 1423, 1424 |
| `.hp-custom-inp` | 1 | 5986 |
| `.hp-history-open-btn` | 2 | 6606, 6618 |
| `.hp-quick-row` | 1 | 5958 |
| `.hp-quick-section` | 1 | 5957 |
| `.hp-side-btn-dmg` | 3 | 6238, 6242, 6243 |
| `.hp-side-btn-heal` | 3 | 6244, 6248, 6249 |
| `.hpb` | 5 | 5963, 5976, 5977, 5981, 5985 |
| `.inspi-icon` | 1 | 9269 |
| `.inspi-label` | 2 | 9270, 9271 |
| `.inv-coin-card-wide` | 1 | 3955 |
| `.inv-item-card` | 2 | 581, 589 |
| `.inv-weight-bar-wrap` | 1 | 3747 |
| `.inv-weight-cap` | 1 | 3769 |
| `.inv-weight-label` | 1 | 3768 |
| `.inv-weight-left` | 1 | 3756 |
| `.inv-weight-num` | 1 | 3761 |
| `.inv-weight-top` | 1 | 3748 |
| `.inv-weight-unit` | 1 | 3767 |
| `.levelup-info-block` | 1 | 6114 |
| `.lock-banner` | 1 | 1439 |
| `.lock-warn` | 1 | 1445 |
| `.lu-gain` | 1 | 6143 |
| `.lu-highlight` | 1 | 6133 |
| `.lu-row` | 2 | 6124, 6132 |
| `.modal-overlay` | 1 | 573 |
| `.muted` | 1 | 5896 |
| `.proficiency-badge` | 1 | 3496 |
| `.proficiency-checkbox` | 4 | 5008, 5019, 5020, 5021 |
| `.proficiency-checkboxes` | 1 | 5007 |
| `.ritual-status-icon` | 1 | 9534 |
| `.save-row` | 2 | 5384, 5391 |
| `.sheet--bottom` | 1 | 1850 |
| `.sheet-actions` | 1 | 1873 |
| `.sheet-avatar-row` | 1 | 9811 |
| `.sheet-close` | 2 | 1867, 1872 |
| `.sheet-fields-col` | 1 | 9808 |
| `.sheet-header` | 1 | 1859 |
| `.sheet-overlay` | 2 | 1826, 1836 |
| `.sheet-title` | 1 | 1866 |
| `.skill-row` | 2 | 5384, 5391 |
| `.spell-card` | 2 | 581, 589 |
| `.stat-block` | 1 | 967 |
| `.stat-box` | 1 | 2288 |
| `.stat-btn` | 3 | 2329, 2345, 2350 |
| `.stat-btn-row` | 1 | 2322 |
| `.stat-controls` | 1 | 2314 |
| `.stat-input` | 1 | 2351 |
| `.stat-label` | 1 | 2301 |
| `.stat-mod` | 1 | 2308 |
| `.status-badges` | 3 | 1997, 6162, 6163 |
| `.status-top-right` | 2 | 1998, 6169 |
| `.status-top-row` | 3 | 1996, 6161, 6166 |
| `.toast-container` | 1 | 10869 |
| `.toast-error` | 1 | 1433 |
| `.toast-success` | 1 | 1433 |
| `.tracker-init` | 1 | 6990 |
| `.tracker-self-badge` | 1 | 7063 |
| `.tracker-type-lbl` | 1 | 7010 |
| `.version-toggle` | 1 | 4399 |
| `.weapon-stats` | 2 | 5137, 5138 |

## Мёртвые ID (0)

Нет.

## Подозрительные (возможна конкатенация — проверять вручную) (59)

| Имя | Правил | Строки style.css | Найдено как |
|---|---|---|---|
| `.app-toast-error` | 1 | 8673 | prefix `app-toast-` |
| `.app-toast-info` | 1 | 8675 | prefix `app-toast-` |
| `.app-toast-success` | 1 | 8672 | prefix `app-toast-` |
| `.app-toast-warn` | 1 | 8674 | prefix `app-toast-` |
| `.bp-diff-1` | 3 | 10934, 10960, 10972 | prefix `bp-diff-` |
| `.bp-diff-2` | 3 | 10935, 10961, 10973 | prefix `bp-diff-` |
| `.bp-diff-3` | 3 | 10936, 10962, 10974 | prefix `bp-diff-` |
| `.bp-role-Control` | 1 | 10920 | prefix `bp-role-` |
| `.bp-role-DPS` | 1 | 10918 | prefix `bp-role-` |
| `.bp-role-Support` | 1 | 10921 | prefix `bp-role-` |
| `.bp-role-Tank` | 1 | 10919 | prefix `bp-role-` |
| `.bp-role-Utility` | 1 | 10922 | prefix `bp-role-` |
| `.btn-lg` | 1 | 1312 | prefix `btn-` |
| `.btn-md` | 1 | 1311 | prefix `btn-` |
| `.btn-row` | 1 | 1914 | prefix `btn-` |
| `.btn-row--end` | 1 | 1915 | prefix `btn-` |
| `.chip--accent` | 1 | 1819 | suffix `--accent` |
| `.chip--danger` | 1 | 1820 | suffix `--danger` |
| `.class-bard` | 1 | 5422 | prefix `class-` |
| `.class-both` | 2 | 5425, 5426 | prefix `class-` |
| `.class-cleric` | 1 | 5421 | prefix `class-` |
| `.class-druid` | 1 | 5418 | prefix `class-` |
| `.class-filter-icon` | 1 | 597 | prefix `class-` |
| `.class-paladin` | 1 | 5423 | prefix `class-` |
| `.class-ranger` | 1 | 5424 | prefix `class-` |
| `.class-sorcerer` | 1 | 5419 | prefix `class-` |
| `.class-warlock` | 1 | 5420 | prefix `class-` |
| `.class-wizard` | 1 | 5417 | prefix `class-` |
| `.coin-btn` | 1 | 6157 | prefix `coin-` |
| `.coin-value` | 1 | 6156 | prefix `coin-` |
| `.dice-adv-btn` | 5 | 4452, 4453, 4454, 4455, 4456 | prefix `dice-` |
| `.dice-adv-row` | 1 | 4451 | prefix `dice-` |
| `.dice-color-inp` | 1 | 9085 | prefix `dice-` |
| `.dice-color-label` | 1 | 9084 | prefix `dice-` |
| `.dice-color-reset` | 3 | 9090, 9097, 9098 | prefix `dice-` |
| `.dice-color-row` | 1 | 9074 | prefix `dice-` |
| `.dice-popover-close` | 1 | 4821 | prefix `dice-` |
| `.effect-icon-svg` | 1 | 2488 | prefix `effect-` |
| `.flex1` | 1 | 5985 | числовой хвост от `flex` |
| `.lu-val` | 1 | 6139 | suffix `-val` |
| `.notes-entry-pin` | 1 | 10362 | prefix `notes-` |
| `.res-row-imm` | 1 | 9989 | prefix `res-row-` |
| `.res-row-res` | 1 | 9988 | prefix `res-row-` |
| `.res-row-vul` | 1 | 9990 | prefix `res-row-` |
| `.res-tag-imm` | 3 | 937, 948, 10004 | prefix `res-tag-` |
| `.res-tag-res` | 3 | 932, 947, 10003 | prefix `res-tag-` |
| `.res-tag-vul` | 3 | 942, 949, 10005 | prefix `res-tag-` |
| `.school-abjuration` | 1 | 5554 | prefix `school-` |
| `.school-conjuration` | 1 | 5555 | prefix `school-` |
| `.school-divination` | 1 | 5556 | prefix `school-` |
| `.school-enchantment` | 1 | 5557 | prefix `school-` |
| `.school-evocation` | 1 | 5558 | prefix `school-` |
| `.school-illusion` | 1 | 5559 | prefix `school-` |
| `.school-necromancy` | 1 | 5560 | prefix `school-` |
| `.school-transmutation` | 1 | 5561 | prefix `school-` |
| `.source-ph14` | 1 | 5414 | prefix `source-` |
| `.source-ph24` | 1 | 5415 | prefix `source-` |
| `.tab-bar` | 1 | 10869 | prefix `tab-` |
| `.tab-item` | 3 | 532, 534, 536 | prefix `tab-` |

## Полностью мёртвые правила (132, ~15688 байт)

Все селекторы правила мертвы — кандидаты на удаление целиком.

| Строки | Байт | Селектор |
|---|---|---|
| 502–505 | 196 | `:root[data-theme="light"] .hp-bar-fill` |
| 581–588 | 264 | `:root[data-theme="light"] .spell-card, :root[data-theme="light"] .inv-item-card` |
| 589–594 | 200 | `:root[data-theme="light"] .spell-card:hover, :root[data-theme="light"] .inv-item-card:hover` |
| 661–666 | 193 | `:root[data-theme="light"] .accordion, :root[data-theme="light"] .accordion-content` |
| 874–876 | 178 | `:root[data-theme="light"] .battle-drag-hint, :root[data-theme="light"] .battle-type-label, :root[…` |
| 1423–1423 | 103 | `.hp-bar-fill` |
| 1424–1429 | 227 | `.hp-bar-fill::after` |
| 1433–1433 | 88 | `.toast-success, .toast-error` |
| 1439–1439 | 73 | `.lock-banner` |
| 1445–1445 | 63 | `.lock-warn` |
| 1530–1530 | 42 | `.floating-btn` |
| 1821–1821 | 113 | `.chip--success` |
| 1822–1822 | 107 | `.chip--info` |
| 1823–1823 | 61 | `.chip--solid` |
| 1826–1835 | 225 | `.sheet-overlay` |
| 1836–1836 | 40 | `.sheet-overlay.active` |
| 1850–1858 | 232 | `.sheet--bottom` |
| 1859–1865 | 147 | `.sheet-header` |
| 1866–1866 | 92 | `.sheet-title` |
| 1867–1871 | 185 | `.sheet-close` |
| 1872–1872 | 67 | `.sheet-close:hover` |
| 1873–1873 | 120 | `.sheet-actions` |
| 1897–1904 | 192 | `.card-v2` |
| 1905–1911 | 185 | `.card-v2 > h2, .card-v2 > h3` |
| 1996–1996 | 38 | `.status-top-row` |
| 1997–1997 | 37 | `.status-badges` |
| 1998–1998 | 40 | `.status-top-right` |
| 2015–2015 | 40 | `.conditions-btn-icon` |
| 2135–2139 | 133 | `.condition-badge.disease` |
| 2269–2269 | 44 | `.back-btn-container` |
| 2270–2284 | 331 | `.back-btn` |
| 2285–2285 | 116 | `.back-btn:hover` |
| 2288–2300 | 269 | `.stat-box` |
| 2301–2307 | 134 | `.stat-label` |
| 2308–2313 | 103 | `.stat-mod` |
| 2314–2321 | 141 | `.stat-controls` |
| 2322–2328 | 115 | `.stat-btn-row` |
| 2329–2344 | 367 | `.stat-btn` |
| 2345–2349 | 118 | `.stat-btn:hover` |
| 2350–2350 | 44 | `.stat-btn:active` |
| 2351–2361 | 217 | `.stat-input` |
| 2500–2506 | 201 | `.effects-section` |
| 2507–2514 | 142 | `.effects-section h4` |
| 2575–2581 | 204 | `.conditions-section` |
| 2582–2589 | 145 | `.conditions-section h4` |
| 2620–2623 | 110 | `.condition-item.active.disease` |
| 2631–2631 | 79 | `.condition-item.active.disease .condition-name` |
| 3496–3504 | 224 | `.proficiency-badge` |
| 3613–3613 | 36 | `.char-hp-bar-wrap` |
| 3614–3614 | 31 | `.char-hp-bar` |
| 3708–3717 | 159 | `.floating-buttons` |
| 3718–3733 | 336 | `.floating-btn` |
| 3734–3734 | 97 | `.floating-btn-dice` |
| 3735–3735 | 95 | `.floating-btn-rest` |
| 3736–3736 | 86 | `.floating-btn:hover` |
| 3737–3737 | 48 | `.floating-btn:active` |
| 3747–3747 | 42 | `.inv-weight-bar-wrap` |
| 3748–3755 | 154 | `.inv-weight-top` |
| 3756–3760 | 78 | `.inv-weight-left` |
| 3761–3766 | 112 | `.inv-weight-num` |
| 3767–3767 | 64 | `.inv-weight-unit` |
| 3768–3768 | 80 | `.inv-weight-label` |
| 3769–3769 | 79 | `.inv-weight-cap` |
| 3955–3957 | 48 | `.inv-coin-card-wide` |
| 4399–4399 | 82 | `.version-toggle` |
| 5007–5007 | 91 | `.proficiency-checkboxes` |
| 5008–5018 | 234 | `.proficiency-checkbox` |
| 5019–5019 | 66 | `.proficiency-checkbox:hover` |
| 5020–5020 | 127 | `.proficiency-checkbox input[type="checkbox"]` |
| 5021–5021 | 104 | `.proficiency-checkbox label` |
| 5137–5137 | 103 | `.weapon-stats` |
| 5138–5144 | 159 | `.weapon-stats span` |
| 5384–5390 | 162 | `.skill-row, .save-row` |
| 5391–5391 | 68 | `.skill-row:last-child, .save-row:last-child` |
| 5392–5392 | 68 | `.checkbox-wrapper` |
| 5394–5394 | 120 | `.bonus-display` |
| 5896–5896 | 65 | `.hp-big-num.muted` |
| 5957–5957 | 39 | `.hp-quick-section` |
| 5958–5962 | 67 | `.hp-quick-row` |
| 5963–5975 | 206 | `.hpb` |
| 5976–5976 | 39 | `.hpb:active` |
| 5977–5980 | 104 | `.hpb.dmg` |
| 5981–5984 | 106 | `.hpb.heal` |
| 5985–5985 | 23 | `.hpb.flex1` |
| 5986–5996 | 225 | `.hp-custom-inp` |
| 5999–6005 | 204 | `.hit-die-quick-block` |
| 6006–6013 | 162 | `.hit-die-info-row` |
| 6114–6123 | 209 | `.levelup-info-block` |
| 6124–6131 | 166 | `.lu-row` |
| 6132–6132 | 43 | `.lu-row:last-child` |
| 6133–6138 | 121 | `.lu-highlight` |
| 6143–6150 | 154 | `.lu-gain` |
| 6161–6161 | 36 | `.status-top-row` |
| 6162–6162 | 41 | `.status-badges` |
| 6163–6165 | 168 | `.status-badges .status-level, .status-badges .status-hp, .status-badges .status-ac` |
| 6166–6168 | 166 | `.status-top-row > .status-inspiration, .status-top-row > .status-concentration, .status-top-row >…` |
| 6169–6169 | 34 | `.status-top-right` |
| 6170–6170 | 49 | `.floating-buttons` |
| 6171–6171 | 62 | `.floating-btn` |
| 6238–6241 | 61 | `.hp-side-btn-dmg` |
| 6242–6242 | 47 | `.hp-side-btn-dmg:hover` |
| 6243–6243 | 48 | `.hp-side-btn-dmg:active` |
| 6244–6247 | 62 | `.hp-side-btn-heal` |
| 6248–6248 | 48 | `.hp-side-btn-heal:hover` |
| 6249–6249 | 49 | `.hp-side-btn-heal:active` |
| 6467–6478 | 279 | `.hd-roll-btn` |
| 6479–6479 | 72 | `.hd-roll-btn:hover:not(:disabled)` |
| 6480–6480 | 60 | `.hd-roll-btn:disabled` |
| 6524–6533 | 235 | `.ds-roll-btn` |
| 6534–6534 | 57 | `.ds-roll-btn:hover` |
| 6551–6559 | 210 | `.ds-reset-btn` |
| 6560–6560 | 87 | `.ds-reset-btn:hover` |
| 6606–6617 | 299 | `.hp-history-open-btn` |
| 6618–6621 | 110 | `.hp-history-open-btn:hover` |
| 6972–6972 | 70 | `.battle-drag-hint` |
| 6975–6975 | 39 | `.battle-row-unchecked` |
| 6976–6976 | 102 | `.battle-drag-handle` |
| 6981–6981 | 88 | `.battle-type-label` |
| 6990–6990 | 130 | `.tracker-init` |
| 7010–7010 | 72 | `.tracker-type-lbl` |
| 7063–7073 | 226 | `.tracker-self-badge` |
| 8896–8904 | 167 | `.dsvg-wrap` |
| 9269–9269 | 31 | `.inspi-icon` |
| 9270–9270 | 79 | `.inspi-label` |
| 9271–9271 | 56 | `.status-inspiration.active .inspi-label` |
| 9511–9511 | 53 | `.conc-status-icon` |
| 9534–9534 | 55 | `.ritual-status-icon` |
| 9694–9698 | 96 | `.avatar-modal-actions` |
| 9808–9808 | 37 | `.sheet-fields-col` |
| 9811–9811 | 36 | `.sheet-avatar-row` |
| 9814–9819 | 99 | `.avatar-url-row` |
| 10207–10218 | 325 | `.empty-state-illustration` |

## Частично мёртвые правила (5)

Мёртвые селекторы можно убрать из списка, остальное правило живое.

| Строка | Мёртвые селекторы | Полный список |
|---|---|---|
| 558 | `:root[data-theme="light"] .back-btn:hover` | `:root[data-theme="light"] .conditions-popup-close:hover, :root[data-theme="li…` |
| 573 | `:root[data-theme="light"] .modal-overlay` | `:root[data-theme="light"] .modal-overlay, :root[data-theme="light"] .confirm-…` |
| 603 | `:root[data-theme="light"] .char-card .char-avatar` | `:root[data-theme="light"] .header-avatar, :root[data-theme="light"] .char-car…` |
| 967 | `:root[data-theme="light"] .ac-block, :root[data-theme="light"] .stat-block, :root[data-theme="light"] .feature-block` | `:root[data-theme="light"] .hp-display-block, :root[data-theme="light"] .hd-bl…` |
| 10869 | `.header-glass, .char-selector-wrap, .toast-container` | `header, .header-glass, .app-right-rail, .tab-bar, .char-selector-wrap, #scree…` |

## Аномалии парсинга (1)

«Селектор» содержит `*/` — внутри комментария встретился текст `*/`, по спецификации CSS комментарий закрылся раньше времени. Хвост стал мусорным CSS, и браузер при error-recovery **теряет следующее реальное правило**. Чинить текст комментария в style.css (убрать `*/` из прозы) и перезапускать отчёт — классы внутри аномалий не учтены в статистике.

| Строка | Фрагмент |
|---|---|
| 455 | `иконочные/утилитарные кнопки больше не перехватываются хрупким blocklist'ом (.fs-scale-reset, .settings-modal-close и…` |

## Неиспользуемые @keyframes (0)

Нет.
