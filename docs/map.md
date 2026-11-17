# Карта кода

Сгенерировано `node tools/gen-map.js` — руками не править, перегенерировать после
крупных правок `style.css`, `index.html` или добавления функций.

Как пользоваться: найти нужный диапазон здесь → `Read` с `offset`/`limit` по нему,
вместо чтения файла целиком или разведочных grep. Сам этот файл тоже читается
диапазонами — оглавление ниже указывает строки внутри map.md.

## Оглавление

| Раздел / файл | Строки в map.md |
|---|---|
| style.css — секции | 55–164 |
| index.html — блоки верхнего уровня (`#id:строки`) | 165–210 |
| Функции по файлам (`имя:строка`) | 211–302 |
|   rules.js | 213–215 |
|   app-asi.js | 216–218 |
|   app-backup.js | 219–221 |
|   app-builds.js | 222–224 |
|   app-cast-effects.js | 225–227 |
|   app-combat.js | 228–230 |
|   app-conditions.js | 231–233 |
|   app-core.js | 234–236 |
|   app-creator.js | 237–239 |
|   app-desktop.js | 240–242 |
|   app-dice.js | 243–245 |
|   app-help.js | 246–248 |
|   app-home.js | 249–251 |
|   app-hp.js | 252–254 |
|   app-inventory.js | 255–257 |
|   app-io.js | 258–260 |
|   app-log.js | 261–263 |
|   app-migrate.js | 264–266 |
|   app-notes.js | 267–269 |
|   app-party.js | 270–272 |
|   app-pdf.js | 273–275 |
|   app-proficiencies.js | 276–278 |
|   app-progress.js | 279–281 |
|   app-settings.js | 282–284 |
|   app-sheet2.js | 285–287 |
|   app-spells.js | 288–290 |
|   app-sync.js | 291–293 |
|   app-ui.js | 294–296 |
|   app-wiki.js | 297–299 |
|   app-wildshape.js | 300–302 |
| Данные — константы верхнего уровня (`имя:строка`) | 303–319 |
|   data.js | 305–307 |
|   spells.js | 308–310 |
|   spell-effects.js | 311–313 |
|   class-choices.js | 314–316 |
|   subclass-choices-data.js | 317–319 |


## style.css — секции

| Строки | Секция |
|---|---|
| 1–14 | style.css — Стили D&D 5e Character Sheet |
| 15–156 | Design tokens (R1) |
| 157–159 | Алиасы старых переменных (совместимость) |
| 160–170 | THEME-4: компонентные токены базового хрома |
| 171–177 | THEME-5: компонентные токены фичевых зон (партия B) |
| 178–250 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 251–295 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 296–421 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 422–518 | UI-2. Пресеты акцента (8 цветов) |
| 519–669 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 670–1034 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1035–1040 | R2. Базовые компоненты |
| 1041–1168 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1169–1314 | UI-3. Desktop/tablet layout (≥1024px) |
| 1315–1501 | UI5-4: ПК — многоколоночная раскладка листа |
| 1502–1584 | /R2 |
| 1585–1752 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 1753–1975 | HEADER (R5: back + name + hamburger) |
| 1976–2038 | КД АВТО-РАСЧЁТ |
| 2039–2102 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2103–2165 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2166–2320 | УСЛОВИЯ |
| 2321–2462 | СПАСБРОСКИ |
| 2463–2590 | CLASS FEATURES |
| 2591–2630 | УБИРАЕМ СТРЕЛКИ |
| 2631–2737 | TAB NAV — 5 tabs + centered FAB dice |
| 2738–2846 | UX-5: лента последних бросков вне модалки |
| 2847–2983 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 2984–3003 | HAMBURGER BUTTON |
| 3004–3046 | SIDE DRAWER |
| 3047–3443 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3444–3491 | MENU-8/9: встречающий экран во всё окно. |
| 3492–3584 | MENU-2: плашка последнего героя. |
| 3585–3761 | MENU-3: меню приключения. |
| 3762–3831 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 3832–3832 | INVENTORY |
| 3833–3863 | INVENTORY — WEIGHT BAR |
| 3864–3886 | INVENTORY — BACKPACK HEADER |
| 3887–3927 | INVENTORY — FILTERS |
| 3928–4080 | INVENTORY — ITEM CARDS |
| 4081–4396 | COINS — BIG NUMBER CARD GRID |
| 4397–4698 | MODALS |
| 4699–4707 | DICE |
| 4708–5206 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5207–5938 | OTHER STYLES |
| 5939–6009 | HP DISPLAY BLOCK |
| 6010–6034 | MOBILE OPTIMIZATION |
| 6035–6169 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6170–6208 | HP TOAST (snackbar) |
| 6209–6242 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 6243–6299 | Confirm Modal |
| 6300–6677 | ⚔️ ОТРЯД & БОЙ |
| 6678–6909 | RACIAL BONUS BAR |
| 6910–7058 | COMPACT STATS GRID |
| 7059–7310 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 7311–7363 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 7364–7411 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 7412–7514 | COMPACT SKILLS |
| 7515–7557 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 7558–7629 | ACCORDION |
| 7630–7636 | CLASS RESOURCES |
| 7637–7733 | ASI MODAL |
| 7734–7901 | APP VERSION |
| 7902–7911 | COMPANIONS |
| 7912–7952 | FEATS LIST IN ASI |
| 7953–8198 | PROFILES TABS (Чейнджлог) |
| 8199–8274 | TAKEN FEATS |
| 8275–8467 | SW UPDATE MODAL |
| 8468–8519 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8520–8687 | INVENTORY SLOTS SYSTEM |
| 8688–8892 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 8893–9105 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9106–9254 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9255–9324 | 3D DICE CUBE |
| 9325–9667 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9668–9741 | DESKTOP LAYOUT — centered max-width |
| 9742–9765 | INSPIRATION |
| 9766–9805 | CONCENTRATION |
| 9806–10323 | WEAPON CARDS WITH ROLL BUTTONS |
| 10324–10418 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10419–10479 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10480–10501 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10502–10614 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10615–10642 | R6: Ассеты (декор) |
| 10643–11512 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11513–11596 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11597–11605 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11606–11663 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11664–11980 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 11981–12007 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 12008–12034 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 12035–12117 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12118–13119 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13120–13175 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13176–13271 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13272–13603 | DISC-1 · Ромб раскрытия |
| 13604–14138 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14139–14250 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14251–14386 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14387–14587 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14588–14596 | STYLE-8b3-fix: срезанный ромб |
| 14597–14864 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14865–15325 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15326–15360 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15361–17077 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:94-95 #conditions-popup-overlay:96-96 #conditions-popup:97-101 #conditions-popup-list:102-105 #drawer-overlay:106-107 #side-drawer:108-145 #screen-settings:146-237 #header-autohide-row:238-254  
#wake-lock-row:255-285 #edition-row:286-308 #install-row:309-319 #welcome-modal:320-324 #welcome-step-1:325-343 #welcome-step-2:344-378 #header-avatar:379-384 #status-bar:385-388  
#status-inspiration:389-389 #status-concentration:390-392 #status-ritual:393-395 #status-conditions-btn:396-409 #screen-home:410-412 #home-art:413-440 #home-sub-new:441-496 #home-install:497-504  
#home-hero:505-505 #home-hero-emblem:506-509 #home-hero-sub:510-510 #home-hero-chips:511-521 #screen-characters:522-541 #char-select-bar:542-569 #char-hero:570-570 #char-hero-emblem:571-574  
#char-hero-sub:575-575 #char-hero-chips:576-576 #char-hero-actions:577-585 #screen-data:586-602 #backup-panel:603-607 #backup-list:608-609 #sync-row:610-610 #storage-status:611-622  
#screen-about:623-626 #app-version-row:627-634 #ptab-info:635-642 #app-links-row:643-646 #app-legal-note:647-652 #ptab-changelog:653-658 #changelog-list:659-665 #screen-character:666-666  
#tab-sheet:667-669 #creation-wizard-banner:670-677 #cw-edition-row:678-687 #cw-validation:688-690 #basic-locked-bar:691-700 #creation-todo:701-710 #sheet-avatar:711-723 #char-build-badge-wrap:724-738  
#char-class-mc:739-763 #char-subclass-rec:764-764 #char-subclass-mc:765-973 #char-books:974-978 #race-bonus-display:979-979 #race-extras-panel:980-980 #class-skills-panel:981-982 #background-feature-display:983-984  
#bg-extras-panel:985-1028 #abilgen-row:1029-1035 #stats-collapse-btn:1036-1043 #abilities-region:1044-1047 #proficiency-bonus-2024:1048-1049 #insp-card-2024:1050-1059 #abil-col-1:1060-1060 #stat-block-str:1061-1062  
#mod-str:1063-1069 #abil-save-slot-str:1070-1070 #abil-skills-slot-str:1071-1073 #stat-block-dex:1074-1075 #mod-dex:1076-1082 #abil-save-slot-dex:1083-1083 #abil-skills-slot-dex:1084-1086 #stat-block-int:1087-1088  
#mod-int:1089-1095 #abil-save-slot-int:1096-1096 #abil-skills-slot-int:1097-1100 #abil-col-2:1101-1101 #stat-block-con:1102-1103 #mod-con:1104-1110 #abil-save-slot-con:1111-1111 #abil-skills-slot-con:1112-1114  
#stat-block-wis:1115-1116 #mod-wis:1117-1123 #abil-save-slot-wis:1124-1124 #abil-skills-slot-wis:1125-1127 #stat-block-cha:1128-1129 #mod-cha:1130-1136 #abil-save-slot-cha:1137-1137 #abil-skills-slot-cha:1138-1151  
#saves-grid:1152-1161 #skills-container:1162-1164 #passive-perception:1165-1184 #ws-hp-banner:1185-1190 #hp-dmg-row:1191-1200 #hp-dmg-body:1201-1221 #death-saves-section:1222-1253 #hp-armor-body:1254-1296  
#hp-hd-body:1297-1310 #hp-rest-body:1311-1338 #class-dev-section:1339-1341 #cd-head:1342-1342 #cd-res:1343-1343 #cd-attn:1344-1345 #cd-about:1346-1354 #ac-formula:1355-1356  
#ac-modifiers:1357-1364 #conditions-grid:1365-1372 #effects-grid:1373-1380 #resistances-container:1381-1389 #prof-card:1390-1393 #armor-prof-container:1394-1397 #weapon-prof-container:1398-1401 #tools-container:1402-1405  
#languages-container:1406-1413 #companions-list-sheet:1414-1426 #tab-progress:1427-1428 #pg-body:1429-1430 #tab-spells:1431-1433 #spell-stat-card:1434-1455 #spell-mod-display:1456-1461 #spell-dc-display:1462-1467  
#spell-attack-display:1468-1473 #spell-stats-by-class:1474-1485 #spell-slots-card:1486-1490 #spell-slots-visual:1491-1497 #concentration-block:1498-1515 #rd-find-spl-wrap:1516-1516 #prep-counter:1517-1517 #my-spells-list:1518-1519  
#rd-slot-strip:1520-1521 #tab-inventory:1522-1525 #rd-find-inv-wrap:1526-1542 #weight-fill:1543-1577 #inventory-list:1578-1582 #inv-coins-card:1583-1587 #rd-exch:1588-1598 #inv-pouches:1599-1654  
#tab-notes:1655-1681 #notes-subtabs:1682-1683 #notes-main:1684-1685 #taken-feats-section:1686-1690 #taken-feats-list:1691-1694 #tab-party:1695-1704 #my-char-card:1705-1718 #allies-list:1719-1733  
#npcs-list:1734-1749 #monsters-list:1750-1761 #companions-list-world:1762-1772 #tab-battle:1773-1778 #weapons-list:1779-1781 #ws-card:1782-1784 #saved-roll-form:1785-1791 #saved-roll-err:1792-1793  
#saved-rolls-list:1794-1797 #battle-res-card:1798-1799 #battle-res-rows:1800-1801 #battle-setup-screen:1802-1812 #battle-setup-list:1813-1813 #battle-difficulty:1814-1817 #battle-tracker-screen:1818-1822 #battle-turn-info:1823-1828  
#battle-repeat-strip:1829-1829 #battle-tracker-list:1830-1839 #tab-journal:1840-1854 #journal-list:1855-1861 #screen-itemref:1862-1864 #item-ref-tabs:1865-1870 #item-ref-weight:1871-1909 #item-ref-slots:1910-1941  
#screen-dmref:1942-1944 #dm-ref-tabs:1945-1949 #dm-ref-ed:1950-1950 #dm-ref-cond:1951-1951 #dm-ref-combat:1952-1952 #dm-ref-world:1953-1957 #screen-wiki:1958-1968 #wiki-jumps:1969-1970  
#wiki-body:1971-1976 #screen-wikiclass:1977-1981 #wikiclass-edition-row:1982-1986 #wikiclass-body:1987-1992 #screen-wikilore:1993-1997 #wikilore-edition-row:1998-2002 #wikilore-body:2003-2008 #screen-help:2009-2030  
#help-wiki-row:2031-2032 #help-about:2033-2056 #help-start:2057-2081 #help-sheet:2082-2105 #help-progress:2106-2151 #help-spells:2152-2168 #help-inventory:2169-2181 #help-battle:2182-2206  
#help-party:2207-2223 #help-notes:2224-2232 #help-journal:2233-2241 #help-planes:2242-2269 #help-dice:2270-2281 #help-edition2024:2282-2321 #help-data:2322-2338 #help-marks:2339-2361  
#conc-details-modal:2362-2372 #conc-detail-duration-row:2373-2380 #conc-detail-desc-row:2381-2390 #add-journal-modal:2391-2414 #add-npc-modal:2415-2444 #add-ally-modal:2445-2482 #screen-monsters:2483-2495 #srd-monster-count:2496-2496  
#srd-monster-results:2497-2501 #srd-npc-modal:2502-2511 #srd-npc-count:2512-2512 #srd-npc-results:2513-2520 #screen-monsterform:2521-2558 #monster-cr-note:2559-2561 #monster-stats:2562-2563 #monster-saves:2564-2565  
#monster-attacks:2566-2589 #screen-rest:2590-2592 #rest-main-screen:2593-2594 #rest-card-short:2595-2597 #hit-dice-section:2598-2599 #hit-dice-controls-total:2600-2604 #hit-dice-by-size:2605-2610 #rest-card-long:2611-2613  
#rest-food-section:2614-2624 #rest-result-screen:2625-2627 #rest-result-details:2628-2636 #screen-levelup:2637-2641 #lu-screen-multiclass:2642-2643 #lu-mc-current-classes:2644-2646 #lu-mc-new-class:2647-2651 #lu-mc-prereq-warn:2652-2652  
#lu-mc-subclass-row:2653-2661 #lu-screen-preview:2662-2694 #lu-slots-card:2695-2696 #lu-slots-info:2697-2700 #lu-build-hint:2701-2701 #lu-features-container:2702-2710 #lu-screen-choices:2711-2712 #lu-choices-body:2713-2719  
#lu-screen-result:2720-2721 #lu-result-title:2722-2722 #lu-result-body:2723-2729 #screen-wildshape:2730-2735 #ws-limits:2736-2736 #ws-results:2737-2740 #screen-hphistory:2741-2743 #hp-history-list:2744-2749  
#asi-modal:2750-2754 #asi-build-hint:2755-2769 #asi-feat-list:2770-2770 #asi-stat-grid:2771-2771 #asi-preview:2772-2780 #class-choice-modal:2781-2796 #dice-modal:2797-2829 #dice-file-hint:2830-2830  
#dice3d-result:2831-2842 #dice-result-display:2843-2856 #dice-pick-hint:2857-2857 #dice-mode-segment:2858-2862 #dice-formula-panel:2863-2880 #dice-fan:2881-2889 #dice-popover-settings:2890-2937 #dice-popover-history:2938-2949  
#dice-history:2950-2958 #screen-spellsearch:2959-2961 #spell-feat-bar:2962-2977 #spell-ver-filter:2978-2984 #spell-class-filter:2985-3017 #class-filter-legend:3018-3019 #spell-search-count:3020-3021 #spell-search-results:3022-3025  
#cast-spell-modal:3026-3030 #cast-spell-options:3031-3033 #add-spell-modal:3034-3077 #new-spell-class-chips:3078-3124 #new-spell-mech-fields:3125-3129 #new-spell-mech-dmg-row:3130-3149 #new-spell-mech-half-row:3150-3152 #new-spell-mech-mod-row:3153-3163  
#subclass-modal:3164-3175 #subclass-features:3176-3184 #item-modal:3185-3229 #item-armor-fields:3230-3255 #coin-exchange-modal:3256-3294 #exch-preview:3295-3301 #screen-magiccatalog:3302-3329 #magic-catalog-count:3330-3330  
#magic-catalog-list:3331-3334 #screen-gearcatalog:3335-3339 #gear-packs-list:3340-3353 #gear-catalog-count:3354-3354 #gear-catalog-list:3355-3359 #weapon-modal:3360-3363 #weapon-picker-section:3364-3366 #weapon-filter-chips:3367-3376  
#weapon-presets-list:3377-3377 #weapon-pick-bar:3378-3441 #rd-quick-dock:3442-3442 #character-tabs:3443-3461 #quick-roll-strip:3462-3467 #qrs-list:3468-3478 #active-effects-panel:3479-3483 #aef-list:3484-3490  
#hp-toast-container:3491-3493 #add-companion-modal:3494-3510 #companion-familiar-row:3511-3531 #mob-sheet:3532-3535 #mob-sheet-list:3536-3539 #confirm-modal:3540-3553 #avatar-modal:3554-3557 #avatar-modal-preview:3558-3585  
#screen-builds:3586-3613 #bp-list:3614-3618 #screen-buildguide:3619-3621 #bg-body:3622-3626 #screen-buildplan:3627-3629 #bp-plan-body:3630-3634 #screen-abilityinfo:3635-3637 #ai-body:3638-3642  
#screen-abilgen:3643-3645 #ag-body:3646-3650 #screen-books:3651-3653 #books-body:3654-3658 #screen-mclayout:3659-3661 #ml-body:3662-3666 #screen-featureinfo:3667-3669 #fi-body:3670-3674  
#screen-creator:3675-3677 #cr-progress:3678-3678 #cr-body:3679-3689 #app-log-panel:3690-3709 #app-log-list:3710-3897 #notes-entry-modal:3898-3946  

## Функции по файлам (`имя:строка`)

**rules.js** (1837 строк, 123 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:346 rulesClassSaveProf:355 rulesAttuneLimit:361 rulesSoulOfArtifice:367 rulesSaveBonus:372 rulesDivineSmiteFormula:381 rulesSkillBonus:388 rulesPassivePerception:403 rulesSpellStats:407 _spellStatMod:434 rulesSpellStatsByClass:442 rulesWeaponMods:460 rulesOffhandDamageMod:476 armorPenalties:485 rulesItemArmor:500 rulesArmorItem:512 rulesAC:523 charCasterLevel:705 classSpellSlotRow:749 getMulticlassSpellSlots:762 rulesRestoreLevelFields:798 rulesApplySpellSlots:817 resolvePactSlots:840 restoreItemCharges:850 rulesHitDieSides:867 rulesShortRest:873 rulesLongRestBlockReason:908 rulesLongRest:921 rulesExhaustionLevel:993 rulesEffectiveHpMax:999 _dsReset:1004 _dsCount:1005 _dsFill:1006 _condAdd:1007 _condRemove:1008 rulesIsDead:1010 rulesIsStable:1014 rulesRegainFromZero:1019 rulesSetHp:1025 rulesDamageAfterDefenses:1037 rulesApplyDamage:1049 rulesDeathSaveBlockReason:1086 rulesDeathSave:1093 rulesConditionRollMods:1112 rulesEffectiveSpeed:1129 rulesArmorStealthDisadv:1150 rulesFeatPrereqMissing:1159 rulesFeatStatChoice:1186 rulesFeatStatOptions:1194 rulesFeatSlotCount:1207 rulesFeatSpellFits:1212 rulesFeatSpellCandidates:1223 rulesFeatSpellLabel:1227 rulesFeatSpellProgress:1232 rulesFeatClassOptions:1257 rulesFeatFreeResId:1270 rulesResetFeatFree:1273 concSaveParams:1284 rulesCrToXp:1326 rulesCrToProf:1332 rulesCrValue:1339 rulesWildShapeLimits:1350 rulesPolymorphLimits:1374 rulesCombatWildShapeHeal:1379 rulesBeastAllowed:1384 rulesFormStart:1391 rulesFormOwnHp:1405 rulesFormDamage:1410 rulesFormHeal:1425 rulesEncounterMultiplier:1432 rulesEncounterDifficulty:1441 rulesClassLangChoice:1467 getCharClassPairs:1472 charEditionMismatch:1486 findLangInCatalog:1494 ensureLanguagesArray:1506 recalcLanguagesFromSources:1522 add:1527 findToolInCatalog:1574 ensureToolsArray:1586 getBackgroundDef:1607 validateBgStatChoice:1643 parseBackgroundToolEntry:1663 recalcToolsFromSources:1678 add:1683 ensureArmorWeaponFields:1748 recalcArmorWeaponFromSources:1761 addArmor:1767 addWeapon:1768 addSpec:1817

**app-asi.js** (906 строк, 43 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:574 removeFeat:633 featSkillPick:662 _agBonus:697 _agPbSpent:707 _agBase:713 _agReady:720 openAbilGen:725 _agInit:735 agSetMode:748 agPb:754 _agSwap:764 agStd:771 agPick:777 agRoll:783 _agCtl:796 owner:807 _agRender:822 agApply:879 _agCommit:887

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-builds.js** (1763 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1129 openBuildGuide:1160 gx:1183 _list:1184 getBuildLevelRec:1247 getBuildRecChoiceOption:1252 getBuildRecChoiceIds:1260 getBuildRecFeat:1265 getBuildRecAsi:1275 getBuildRecSubclass:1282 parseAsiFromHeadline:1290 _buildFeatNameMap:1304 parseFeatFromHeadline:1346 parseSpellsFromHeadline:1363 getBuildRecSpellObjs:1609 openBuildPlan:1629 _cpSubclassOf:1682 _cpClassSwitch:1693 openClassPlan:1708

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-combat.js** (3453 строк, 155 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollInitiative:148 rollSkillCheck:159 initSaves:178 autoSelectProficiencies:213 initSkills:256 toggleAbilOpen:284 abilityBreakdown:296 openAbilityInfo:324 toggleExpertise:359 loadExpertise:378 updateSkillProfCount:392 updateSkillSources:404 updateClassFeatures:428 calculateAC:443 toggleInspiration:504 updateStatusCounter:517 updateStatusBar:531 updateInspirationLabels:573 updateStatDisplay:590 updateAllStatDisplays:595 adjustStat:599 adjustCoin:622 renderCoinMob:636 openCoinSheet:646 setCoinFromSheet:656 updateCoinTotal:663 openCoinExchange:675 closeCoinExchange:680 previewExchange:684 coinExchangeCalc:712 confirmExchange:717 updateSubclassOptions:740 updateSubclassRecHint:804 featHpPerLevel:819 featHpFlat:828 recalculateHP:837 updateChar:892 toggleProficiency:959 calcStats:982 setSpellStat:1053 calcSpellStats:1064 _toggleNonCasterCards:1116 showSpellCasterCards:1127 onRaceChange:1135 renderBooksRow:1270 openMobSheet:1297 closeMobSheet:1304 mobSheetActs:1306 openBooksSheet:1311 toggleCharBook:1321 populateRaceSelect:1338 _speciesEffective:1371 _renderSpeciesBar:1384 _speciesChoiceOptions:1399 toggleSpeciesChoice:1406 syncSpeciesSpells:1420 rollRandomName:1466 pick:1474 build:1475 _raceSkillAllowance:1542 _raceFlexCount:1552 _raceFlexFits:1558 _raceFlexApply:1565 _setExtrasHtml:1575 renderRaceExtras:1584 toggleHalfElfStat:1755 toggleRaceFlexStat:1781 setRaceVariableTrait:1811 _raceSkillSet:1828 _pickHide:1838 _pickExpandBtn:1842 pickExpand:1845 raceLangGoto:1852 toggleRaceSkill:1860 _classSkillList:1889 _skillsFromOtherSources:1902 _skillsByName:1912 _skillTakenElsewhere:1918 _classSkillHeld:1933 _classSkillSync:1939 renderClassSkills:1970 toggleClassSkill:2017 openRaceFeatModal:2045 removeRaceFeat:2065 applyBasicLockUI:2100 _cwEditionBusy:2134 syncCwEdition:2139 setDraftEdition:2151 updateLockButtonState:2161 lockBasicInfo:2199 unlockBasicInfo:2220 isSheetLocked:2250 sheetLockGuard:2256 applySheetLockUI:2262 _creationTodo:2293 add:2297 src:2298 scheduleCreationTodo:2389 renderCreationTodo:2394 creationTodoGo:2421 openLockSheet:2433 _creationUiReset:2446 _isMobSheet:2447 renderIdentitySummary:2448 toggleIdentityMore:2467 renderProfSummary:2471 toggleProfCard:2486 openAcSheet:2492 _mobMarkClamp:2500 init:2509 lockSheet:2530 doLock:2534 unlockSheet:2547 onBackgroundChange:2568 _bgSkillsOf:2613 _bgUncheckOld:2620 _bgCheckSkills:2628 renderBackgroundFeature:2640 _bgStatShort:2685 populateBackgroundSelect:2688 _bgRevertStatChoice:2719 _bgAppliedStat:2732 _bgApplyStat:2737 setBgStatMode:2749 toggleBgStat:2761 _bgAfterStats:2784 _bgRevertFeatEffects:2795 syncOriginFeat:2820 toggleBgCustom:2856 _toggleBgCustom14:2896 toggleBgSkillPick:2943 _renderBgCustom14:2970 giveBackgroundEquipment:3007 renderBackgroundExtras:3052 _armorFromSelect:3160 renderArmorSelect:3172 onArmorPick:3207 onShieldPick:3221 onArmorChange:3240 onManualAC:3269 onManualMaxHP:3276 calcCoinWeight:3299 getActiveConditionsForRender:3313 toggleConditionsPopup:3342 closeConditionsPopup:3354 renderConditionsPopup:3360

**app-conditions.js** (505 строк, 28 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:303 loadConditions:312 refreshSaveBonuses:321 _fxMatches:338 setEffectsSearch:343 setEffectsType:344 toggleEffectsActiveOnly:352 renderEffectsGrid:358 initEffects:441 toggleEffect:461 updateEffectsCount:490 loadEffects:499

**app-core.js** (1989 строк, 97 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:587 _screenGhostDrop:593 _screenGhostStart:605 _screenEnter:623 _purgeDraftChars:634 showScreen:647 updateHeaderTitle:762 syncDrawerHeader:816 switchTab:828 _rdSheetView:867 openDrawer:886 closeDrawer:899 showCharacterNav:911 hideCharacterNav:919 isInteractive:939 currentActiveTab:962 scrolledDown:1027 closeAction:1034 reset:1041 end:1074 createNewCharacter:1094 getClassColor:1117 getClassIcon:1133 getAbilityIcon:1140 getConditionIcon:1155 getConditionChipIcon:1179 getSpellClassIcon:1197 getSchoolSlug:1214 getSchoolIcon:1218 stripLeadingEmoji:1231 formatTimeAgo:1235 setCharSort:1249 setCharSearch:1256 duplicateCharacter:1260 exportOneCharacter:1272 toggleCharSelectMode:1284 _charSelectedList:1293 _updateCharSelectBar:1296 toggleCharSelected:1313 charSelectAll:1317 _charSelectEmptyToast:1322 exportSelectedCharacters:1325 duplicateSelectedCharacters:1332 deleteSelectedCharacters:1347 updateCharCounter:1365 onDragStart:1382 onDragOver:1383 onDrop:1384 renderCharacterList:1395 renderCharPlate:1489 deleteCharacter:1552 showConfirmModal:1566 safeSet:1620 safeSetChecked:1624 loadCharacter:1633 showToast:1826 showFieldError:1843 clearFieldError:1865 toastAddAction:1875 emptyStateHtml:1893 openHPHistory:1904 closeHPHistory:1932 updateVersionBlock:1937 forceAppUpdate:1971

**app-creator.js** (1145 строк, 111 функций)  
_crChar:27 _crVisible:31 _crStepIndex:37 openCharOrCreator:43 openCreator:48 creatorRender:58 creatorRefresh:82 _crSyncNext:86 creatorHostsPanels:98 creatorSpellRoom:103 _crLockIndex:112 _crRenderFrozen:117 _crGo:122 creatorNext:136 creatorPrev:143 creatorExit:146 creatorManual:149 _crLeaveToSheet:151 _crSetField:165 _crValidBase:175 _crSeg:180 _crRenderBase:193 creatorSetEdition:214 creatorSetName:221 creatorRollName:226 creatorSetGender:234 creatorSetLevel:239 _crCard:253 _crSelectOptions:261 _crRaceData:277 _crSpeciesSingles:282 _crValidRace:286 _crRaceMeta:293 _crRaceDesc:307 _crRenderRaceList:313 _crRenderRace:331 creatorRaceSearch:365 creatorPickRace:372 creatorPickSpeciesOpt:379 _crClassMeta:403 _crSubclassOpen:414 _crValidClass:419 _crBuildsFor:424 _crRenderClass:431 creatorPickClass:475 creatorPickSubclass:485 creatorPickBuild:492 _crBgDef:502 _crFeatName:506 _crValidBg:511 _crBgMeta:520 _crRenderBg:532 _crRenderBgStats:554 _crChip:591 creatorPickBg:595 creatorBgStatMode:602 creatorBgStat:603 creatorBgCustomStat:604 creatorBgCustomFeat:605 _crRenderAbil:613 _crAfterAbil:617 _crValidAbil:623 _crLeaveAbil:627 _crTodo:654 _crValidChoices:658 _crRenderChoices:660 _crAfterChoices:668 _crMount:679 _crUnmountPanels:690 creatorChoicesSync:703 _crTodoGo:718 _crGoTo:722 _crRenderMastery:728 creatorToggleMastery:740 _crRenderClassChoices:753 _crTargetLevel:771 _crLevelPending:773 _crValidLevels:777 _crRenderLevels:781 _crAfterLevels:789 creatorLevelsSync:805 creatorHpMode:818 creatorLevelUp:820 _crRollLevelHp:833 _crSpellRows:849 _crSpellRow:866 _crValidSpells:870 _crListRoom:875 _crBuildSpells:885 push:889 _crHasSpell:899 _crRenderSpells:903 _crRenderMySpells:928 creatorRemoveSpell:950 creatorOpenSpells:959 creatorToggleSpellPrep:963 creatorAddBuildSpells:973 _crGearTodo:999 _crValidGear:1003 _crRenderGear:1005 creatorGearSync:1011 _crBgEquip24:1025 _crRenderPersona:1045 creatorSetAlign:1062 creatorSetDeity:1069 creatorPersonaGen:1071 creatorPersonaVariant:1078 put:1087 _crRenderSummary:1100 _crSummaryTodo:1126 _crGoStep:1137

**app-desktop.js** (528 строк, 15 функций)  
syncFromStatusBar:144 syncStrip:203 setRailOpen:214 syncRdToggles:221 _esc:241 _stripEmoji:247 _condIcon:251 setRowExpanded:257 collapseRow:263 renderRrConditions:265 renderRailSlots:311 renderRailConc:353 updateRailHpRow:368 rrApplyHP:383 init:396

**app-dice.js** (1713 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1359 _diceShapeSvg:1393 renderDiceFan:1400 _paintSelectedDie:1419 _diceHeroSvg:1443 _paintDiceMode:1453 selectDie:1468 rollSelectedDie:1487 toggleDiceFormulaPanel:1496 _savedRollFormula:1515 _savedRollsClean:1518 _savedRollNewId:1533 _savedRollLabel:1536 renderSavedRolls:1540 savedRollRoll:1560 savedRollTap:1567 savedRollEdit:1583 savedRollCancel:1600 savedRollSubmit:1605 savedRollDelete:1626 savedRollFromDice:1644 _diceHotkeys:1665

**app-help.js** (1342 строк, 58 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:46 getHelpFlag:111 setHelpFlag:115 welcomeGoStep:121 showWelcome:131 closeWelcome:138 welcomeContinue:144 welcomeSkipExperienced:150 welcomeBack:156 welcomeFinish:163 dismissWelcome:196 maybeShowWelcome:199 restartOnboarding:204 _tourWide:240 _ensureTourDom:243 _resolveTarget:284 _tourFirstVisible:299 _tourAnyModalVisible:319 _tourModalOpen:325 _tourStartWhenClear:337 startTour:349 startListTour:362 startSheetTour:366 _tourTyping:378 maybeStartSheetTour:383 startCreatorTour:406 maybeStartCreatorTour:411 _buildCreatorSteps:423 restartTour:434 startTabTour:461 maybeStartTabTour:479 tourNext:506 tourPrev:511 endTour:517 _showTourStep:527 _setBox:590 _computeTourBoxes:606 snap:608 corner:621 _layoutTourCorners:643 _layoutTour:660 _onTourKey:763 _onTourReflow:769 _bindTourGlobal:773 _unbindTourGlobal:778 _buildListSteps:789 _buildSheetSteps:839 _buildStatsSteps:949 _buildProgressSteps:990 _buildSpellsSteps:1048 _buildInventorySteps:1091 _buildBattleSteps:1137 _buildNotesSteps:1212 _buildPartySteps:1253 _buildJournalSteps:1311

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

**app-hp.js** (2082 строк, 71 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:33 showLongRestInfo:34 selectRestType:36 _restResNames:53 _restRecoveries:67 _restRecoveryHtml:80 _restRefreshRecovery:85 _renderRestPreview:89 _restHasSlots:127 showRestResult:133 adjustHitDice:143 _restHitDiceChosen:155 adjustHitDiceSize:162 updateHitDiceInfo:169 confirmRest:202 openLevelUpModal:298 _showMulticlassScreen:329 luPickAnotherClass:374 openMulticlassNewClass:381 confirmMulticlassNewClass:440 _showLevelUpPreview:451 closeLevelUpModal:629 confirmLevelUp:642 _luShowResult:771 luFinishChoices:837 luRefreshChoices:849 luSetSubclass:856 luApplyFeatById:876 luApplyAsi:922 _luFeatChoiceAt:943 _luChoiceOpensAt:952 _luSub:958 _ccDefsFor:962 _luAsiDone:973 luApplyAllRecommendations:978 _luSpellGainParts:1100 pluralRu:1105 delta:1109 _luResMap:1128 luBuildChoicesScreen:1137 recBadge:1147 luAddRecommendedSpells:1305 luGoToSpellsTab:1333 openLevelDownConfirm:1345 confirmLevelDown:1390 loadDeathSaves:1423 toggleDeathSave:1467 resetDeathSaves:1484 updateHPDisplay:1497 hpToggleRow:1589 hpSetRowOpen:1598 updateHPSummary:1606 updateHPRows:1670 quickHP:1688 setHPAbsolute:1814 addHPHistory:1839 _hpUndoPrepare:1856 _hpUndoConcSnap:1876 _hpUndoConcRestore:1893 undoHPChange:1916 showHPToast:1946 applyCustomHP:1964 saveTempHP:1981 rollHitDieQuick:1995 renderHitDiceIcons:2027 rollDeathSave:2041 _luSlotPart:2072 _luPactPart:2075

**app-inventory.js** (2400 строк, 132 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:151 toggleInvItem:279 editItemDirect:284 deleteItemDirect:285 updateInventoryWeight:305 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:379 adjustItemCharges:390 openItemModal:406 closeItemModal:480 syncItemArmorFields:485 syncWornArmor:497 submitItem:526 openMagicCatalog:598 closeMagicCatalog:615 renderMagicCatalog:620 fillFromMagicItem:652 openGearCatalog:705 closeGearCatalog:721 renderGearPacks:726 renderGearCatalog:736 fillFromGearItem:764 addPackToInventory:787 rollTrinket:809 _weaponPresets2024:845 _weaponMasteryGrant:866 getWeaponMasteryLimit:891 weaponMasteryPending:895 canMasterWeapon:900 getWeaponMasteryProp:909 isWeaponMastered:916 toggleWeaponMastery:919 _weaponCatalog:938 renderWeaponPresets:952 filterWeaponPresets:1018 toggleWeaponFilter:1022 fillWeaponPreset:1029 _resetWeaponForm:1047 openWeaponModal:1068 closeWeaponModal:1078 editWeapon:1086 deleteCustomWeapon:1116 _weaponPresetByName:1142 checkWeaponProficiency:1149 submitWeapon:1177 weaponRowTap:1268 renderWeapons:1282 isLightWeapon:1381 toggleTWFStyle:1386 rollTWFAttack:1394 _weaponDamageRoll:1442 rollTWFDamage:1463 _unarmedStrike:1478 _weaponAt:1482 rollWeaponAttack:1486 _attackBonusTail:1547 rollWeaponDamage:1551 _canDivineSmite:1584 openDivineSmite:1588 _divineSmite:1612 removeWeapon:1644 _invDndInit:1678 _invClearIndicators:1707 _invSetIndicator:1716 _invCleanup:1721 _invCancelDrag:1728 _invMoveItem:1736 _invCommitDrop:1753 invDragStart:1774 invDragOver:1784 invDragLeave:1801 invDrop:1805 invDragEnd:1811 invTouchStart:1818 invTouchMove:1834 invTouchEnd:1866 quickSlotsClean:1888 quickSlotIconValid:1905 quickSlotAutoIcon:1911 _qsList:1930 _qsFindItem:1934 _qsFindSpell:1944 _qsResolve:1949 _qsItemQid:1952 _qsQty:1956 _qsConsumable:1960 quickSlotIndex:1966 quickSlotAdd:1972 quickSlotRemove:1982 quickSlotPrune:1989 _qsBusy:1996 quickSlotConsume:2002 _qsHealFormula:2013 quickSlotUse:2019 quickSlotToggle:2045 _qsBtnHtml:2079 quickSlotIconPickFor:2086 quickSlotIconPick:2093 quickSlotIconClose:2130 quickSlotIconSet:2135 quickSlotIconUpload:2148 quickSlotIconEncode:2164 quickDockEdit:2183 quickDockCancel:2184 quickDockHint:2185 quickDockRemoveAt:2189 quickDockReplaceAt:2197 _qsRefreshCards:2208 renderQuickDock:2213 _rdNorm:2266 _rdMatch:2267 _rdFindRows:2272 byPrefix:2277 rdFindRender:2321 rdFindFocus:2333 rdFindBlur:2343 rdFindKey:2349 _rdReveal:2357 rdFindPick:2362 rdExchPreview:2378 rdExchange:2393

**app-io.js** (746 строк, 38 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:104 _normalizeImportedSpell:113 _isValidImportedSpell:124 _collectCharUserSpells:128 _ingestImportedUserSpells:146 _spellBaseById:192 _unpackSpell:200 _countUnresolvedSpells:222 _unresolvedNote:230 _importTooNew:235 _packSpell:244 _packCharForExport:255 _unpackCharSpells:262 _buildCharEnvelope:268 _buildCharsEnvelope:284 _charExportFileName:309 _downloadText:312 _shareableFile:323 shareOneCharacter:334 copyCharToClipboard:351 pasteCharFromClipboard:364 _extractCharsFromImport:382 _applyFullRestore:394 _warnEditionMix:438 run:439 importData:454 importOneCharacter:513 _importOneCharText:530 _consumeLaunchFiles:611 _importLaunchText:644 exportSpells:651 importSpells:660 exportSessionLog:733

**app-log.js** (398 строк, 23 функций)  
now:32 fmtTime:34 safeData:45 push:66 schedulePersist:88 loadPrevious:104 newId:111 lineToText:117 jsonShort:122 appVersion:128 exportText:134 matchFilter:236 rowHtml:245 esc:257 renderAll:262 onNewEntry:274 openPanel:289 closePanel:298 copyAll:304 fallbackCopy:314 downloadAll:324 showPrevious:336 wirePanelButtons:350

**app-migrate.js** (1052 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1044

**app-notes.js** (1538 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:455 notesPickRandomVariant:460 _applyVariantToSection:473 _setSectionText:487 _mdToHtml:502 closeLists:514 _countStats:554 _bindSectionInputs:561 _updateStats:574 _notesHotkeys:583 notesMdInsert:598 wrap:607 linePrefix:614 notesTogglePreview:664 notesUpdateSection:683 _syncTakenFeatsLocation:698 _renderEntriesView:711 _renderEntryCard:766 notesPinDragStart:813 notesPinDragOver:823 notesPinDragLeave:832 notesPinDrop:837 notesPinDragEnd:847 _notesReorderPinned:856 notesSetTagFilter:884 notesJumpToNpc:890 notesOpenEntryModal:918 notesCloseEntryModal:953 _notesRenderModalTags:958 notesAddModalTag:970 notesModalTagKeydown:980 notesRemoveModalTag:984 notesSaveEntryModal:990 notesDeleteEntry:1038 notesTogglePin:1059 _notesLogJournal:1094 notesSearchInput:1120 notesSearchKeydown:1127 _hlText:1145 _renderSearchResults:1163 notesClearSearch:1242 notesToggleMenu:1253 _notesMenuClose:1266 notesMenuAction:1272 _notesCharName:1287 _notesTriggerDownload:1292 notesExportMd:1300 notesExportJson:1345 _notesSanitizeEntry:1357 _notesFileTooBig:1368 notesHandleImportJson:1376 _notesApplyImport:1397 notesHandleImportMd:1437 notesPrint:1473 _notesFlashSaved:1504

**app-party.js** (2378 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2365 switchDmRef:2369

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-proficiencies.js** (652 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:71 addChoiceLanguage:156 addCustomLanguage:174 removeCustomLanguage:201 getToolChoiceSlots:226 buildToolOptionsHtml:294 renderTools:315 addChoiceTool:387 addCustomTool:404 removeCustomTool:431 renderArmorProf:450 renderWeaponProf:500 addCustomArmorType:564 removeCustomArmorType:580 addCustomWeaponType:592 removeCustomWeaponType:607 addCustomSpecificWeapon:618 removeCustomSpecificWeapon:639

**app-progress.js** (1071 строк, 65 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:310 _pgNext:326 _pgClassWord:380 _pgAvailableClasses:389 _pgActions:402 _pgBuild:420 openProgressTab:433 openProgress:443 pgTabActive:454 pgRefresh:461 pgSetSubclass:469 pgFocusSubclass:484 pgLevelUp:501 pgLevelDown:506 pgAfterLevelModal:512 pgAddClass:523 renderClassDev:537 _pgSheetAboutRow:556 _pgSubclassRows:574 syncClassFieldUI:600 _pgOwnSubclasses:646 pgEditSubclass:656 _subclassRecord:661 _subclassUnlock:666 _subclassClasses:671 _subclassPicked:677 _subclassRepick:682 subclassFormClassChanged:691 subclassAddFeature:697 subclassRemoveFeature:716 openSubclassForm:721 closeSubclassForm:747 _subclassFormDone:752 submitSubclassForm:760 deleteSubclassForm:794 openFeatureInfo:815 _fiRuleNotes:859 _mlTotal:898 _mlMissing:903 openMcLayout:909 mlSetClass:921 mlLevel:929 mlSetSub:938 mlAdd:943 mlRemove:949 _mlRender:955 _mlPruneAsi:1020 mlApply:1031

**app-settings.js** (898 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:113 _accentForClass:125 _applyClassAccent:128 _refreshAccent:131 setAutoAccent:139 _syncAutoAccentToggle:144 getEdition:160 setEdition:168 _syncEditionButtons:177 _getStatsLayout:194 _applyStatsLayout:201 _statsInCards:208 _statsRowTarget:212 _placeStatRows:230 setStatsLayout:246 _syncStatsLayoutButtons:253 _getSheetLock:267 setSheetLock:271 _syncSheetLockButtons:276 _wakeLockSupported:287 _getWakeLockOn:288 _applyWakeLock:292 setWakeLock:307 _syncWakeLockButtons:312 _getHeaderAutohideOn:322 setHeaderAutohide:325 _syncHeaderAutohideButtons:330 _getTrackXpOn:338 _applyTrackXp:341 setTrackXp:344 _syncTrackXpButtons:349 _getAttackDamageOn:370 setAttackDamage:373 _syncAttackDamageButtons:377 isEditionSplit:386 setEditionSplit:389 _syncEditionSplitButtons:394 openBooksScreen:404 _bookRowHtml:408 _renderBooksScreen:418 setBookOn:443 setBooksPreset:449 _afterBooksChange:456 _syncBooksSummary:468 _getStatsCollapsed:482 _applyStatsCollapsed:485 toggleStatsCollapsed:490 _getStoredDensity:504 _getDefaultDensity:512 _getDensity:519 _applyDensity:522 setDensity:526 _syncDensityButtons:532 _onViewportDensityChange:540 _getFontScale:558 _applyFontScale:565 setFontScale:576 _syncFontScaleUi:587 _getGlassAlpha:602 _getGlassBlur:609 _applyGlassAlpha:616 _applyGlassBlur:617 setGlassAlpha:618 setGlassBlur:628 _syncGlassUi:637 _getSpaceMode:686 _applySpaceBg:693 setSpaceMode:708 _syncSpaceButtons:714 _spaceOnScroll:733 _applyDymkaIcons:761 _initAppLinks:774 openSupportLink:806 _isStandalone:818 _isIos:824 _installMode:828 _syncInstallUi:833 installApp:846 openSettingsModal:870 closeSettingsModal:885

**app-sheet2.js** (572 строк, 27 функций)  
esc:15 fm:20 abName:21 listText:22 ensureNodes:30 render:83 build:104 hpBlock:238 restBlock:265 atkRow:273 weaponsBlock:284 diceBlock:296 slotsBlock:306 condBlock:322 buildBattle:328 buildRail:332 buildPersona:337 buildSpellHead:348 classFeatures:362 classResources:411 rollsHtml:446 closePop:467 outside:475 onKey:476 openPop:477 poolFormula:533 schedule:557

**app-spells.js** (2277 строк, 113 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:165 adjustPactSlots:176 syncSpellSlotsFromClass:188 updateSpellSlots:197 toggleSpellSlot:208 adjustSpellSlots:219 restoreAllSlots:230 setSpellVersion:241 _syncSpellVersionLock:252 setSpellClass:261 _charIsThirdCaster:270 _charSpellClassKey:276 _charMaxCastableLevel:288 _defaultSpellVersion:296 toggleSpellOnlyAdded:302 _renderSpellOnlyAdded:306 openSpellSearch:314 markCharOwnClassFilter:336 closeSpellSearch:365 _featPickCtx:376 featAddFixedSpells:391 openFeatSpellPicker:417 _featPickProgressText:434 _renderFeatPickBar:440 featPickSetClass:461 _featPickCandidates:469 _renderFeatPickList:479 addFeatSpell:510 removeFeatSpell:530 _parseSpellClassList:553 _syncNewSpellClassChips:557 toggleNewSpellClass:564 _fillNewSpellDamageTypes:589 _toggleHidden:596 updateNewSpellMechFields:604 _hbFormulaCheck:619 _collectHbEffect:628 _spellIdArg:666 _findHomebrewSpell:672 openAddSpellForm:680 _syncCustomSpellAcrossChars:759 _purgeCustomSpellFromChars:777 deleteCustomSpell:796 _deleteCustomSpellConfirmed:805 closeAddSpellForm:819 submitNewSpell:823 renderSpellSearch:913 spellCompRu:987 addSpell:992 removeSpell:1016 toggleSpellCard:1030 renderMySpells:1035 _spellActiveBadgeText:1183 _spellActiveBadgeHtml:1187 updateSpellActiveBadges:1190 _prepEntries:1213 _spellPrepEntry:1231 _prepLimit:1236 calcMaxPrepared:1252 _known2014:1259 calcMaxKnownSpells:1274 _knownSpellCount:1280 calcMaxCantrips:1290 isPrepClass:1299 _subclassSpellNames:1305 syncSubclassSpells:1338 spellNeedsPrep:1365 _preparedCount:1381 openSpellCardsMenu:1389 isSpellPrepared:1404 toggleSpellPrepared:1414 renderPrepCounter:1440 _castableSlotOptions:1493 _wizardPick:1518 _spellMasteryFree:1521 _signatureResId:1526 _arcanumResId:1533 castSpell:1543 _castSpellWithSlot:1564 _finishCast:1612 applyCastEffects:1662 _applyCastForm:1699 openCastVariantChooser:1712 pickCastVariant:1751 closeCastVariantChooser:1761 _applyCastSummon:1774 _nextCastInstanceId:1808 _replaceCastInstance:1816 _ensureCastInstance:1846 _applyCastDamage:1866 _rollCastDamage:1893 _startCastRepeat:1963 castRepeatDamage:1977 _applyCastDebuff:2002 castSpellAttackMod:2043 castStatMod:2051 _agonizingBonus:2073 _applyCastHeal:2092 _castHealApply:2113 _applyCastTempHp:2119 applyCastTempHp:2136 _applyCastHpMaxBonus:2150 openCastChooser:2170 closeCastChooser:2191 canCastAsRitual:2204 castRitual:2226 cancelRitual:2265

**app-sync.js** (696 строк, 46 функций)  
_syncLog:22 _syncEnabled:26 _syncRedirectUri:30 _syncDevice:34 _syncGetAuth:41 _syncSetAuth:48 _syncTokenValid:55 syncSignIn:59 syncSignOut:76 syncTurnOff:87 _syncConsumeHash:110 _driveFetch:146 _driveList:160 _driveFind:167 _driveRead:171 _syncCheckDoc:180 _driveWrite:190 _syncLoadState:207 _syncSaveState:215 syncTombstone:219 _syncExpired:227 syncSchedule:233 _syncUserSpells:240 _syncHashes:245 _syncKeepLive:255 _syncNameDupes:275 _syncAskDupes:282 _syncDestructive:293 lost:294 _syncApply:302 _syncFixChar:332 _syncMergeExtra:337 _syncRun:348 syncNow:416 syncOverwrite:470 _syncStable:480 _syncHashStr:488 syncHashChar:497 _syncClone:499 _syncUnpackChar:501 _syncPackChar:507 _syncMergeList:513 syncMerge:545 _syncBtn:639 _syncTimeLabel:648 renderSyncRow:655

**app-ui.js** (1554 строк, 96 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:58 openAvatarModal:76 closeAvatarModal:95 handleAvatarFile:98 applyAvatarFromUrl:124 applyAvatar:133 removeAvatar:151 renderSheetAvatar:170 prefersReducedMotion:186 animateCountUp:192 tick:200 _reportError:223 swProgressToast:254 swProgressToastRemove:267 swInstallFailed:271 swWatchFirstInstall:284 swRegister:314 swTelegramBlock:349 swSupportBlock:360 showUpdateModal:372 later:398 onKey:405 checkWhatsNew:415 showWhatsNewModal:427 toggleAccordion:469 initCharResources:489 getResourceMax:498 getCharResourceDefs:519 currentDieSize:549 crRow:561 crRestoreLabel:574 crResourceRow:590 crRecoveryHint:653 crResName:658 crFlexActs:667 _crFlexContext:686 _crFlexDone:696 flexSlotToPoints:703 flexPointsToSlot:717 crPointRecoveryAmount:736 crPointRecoveryActs:741 recoverPointsByResource:747 crPortentRolls:767 crPortentMeta:771 crPortentActs:777 _crPortentContext:783 crRollPortent:793 usePortent:800 crSlotRecoveryBudget:815 crSlotRecoveryActs:819 recoverSlotByResource:834 crPassiveNotes:860 rollSneakAttack:869 rollResourceDie:893 crManeuverRows:912 crRowsHtml:929 crSetRows:966 renderClassResources:981 spendResource:999 resetResource:1017 toggleResourcePip:1027 resourceRollOnSpend:1052 resetResourcesByRest:1065 getJournal:1115 addJournalEntry:1120 filterJournal:1142 renderJournal:1149 deleteJournalEntry:1185 openAddJournalEntry:1194 closeAddJournalEntry:1199 saveJournalEntry:1202 getCompanions:1222 renderCompanions:1227 companionHP:1272 buildFamiliarFormOptions:1285 onCompanionTypeChange:1297 applyFamiliarForm:1305 openAddCompanionModal:1317 summonFamiliar:1334 openPrefilledCompanionModal:1344 openEditCompanionModal:1355 closeAddCompanionModal:1375 saveCompanion:1378 deleteCompanion:1403 switchProfilesTab:1419 clipChangelogText:1434 expandChangelogItem:1445 clCleanText:1457 renderChangelog:1463 openItemRef:1511 closeItemRef:1517 switchItemRef:1522 _syncHeaderHeight:1540

**app-wiki.js** (856 строк, 71 функций)  
_wikiPlural:33 _wikiLoreCount:37 wikiRegister:64 wikiCrumbs:71 _wikiCrumbGo:94 wikiExit:97 _wikiRecentGet:101 wikiRecentPush:105 _wikiRecentOpen:110 wikiEdition:118 wikiEdData:125 setWikiEdition:127 openWiki:132 _wikiNorm:142 _wikiHelpTabs:145 _wikiHelpHits:159 wikiUpdateHelpLink:180 openWikiLore:200 _wikiRow:202 _wikiGo:211 wikiJump:212 _wikiHubItems:217 renderWiki:226 _wikiClassNames:325 _wikiClassSource:333 _wikiProfList:339 _wikiToolsText:348 openWikiClasses:355 openWikiClass:361 wikiClassBack:371 setWikiClassEdition:375 _wikiCRow:383 _wikiCGo:391 _wikiFact:393 _wikiFeatureRows:400 renderWikiClass:411 _wikiSrcLabel:514 _wikiLoreList:519 _wikiFeatByName:530 _wikiLoreEnsure:537 _wikiLoreOpen:543 openWikiRaces:554 openWikiBackgrounds:555 openWikiFeats:556 wikiLoreBack:558 setWikiLoreEdition:562 _wikiLRow:570 _wikiLGo:578 _wikiStatsText:580 _wikiPara:585 _wikiRaceSource:594 _wikiMeters:598 _wikiRacePage:603 _wikiBgPage:626 _wikiFeatPage:646 renderWikiLore:657 _wikiLoreSearch:697 _wikiCondName:715 _wikiParaBr:718 _wikiCondPage:728 _wikiGlossMap:735 add:737 _wikiGlossPage:750 _wikiAbilPage:756 _wikiOptDict:765 _wikiOptGroup:778 _wikiOptReq:783 _wikiOptPage:793 wikiOpenGloss:805 wikiOpenMyClass:813 _wikiGlossSearch:821

**app-wildshape.js** (319 строк, 27 функций)  
wsBeast:12 wsChargesLeft:18 wsSpeedText:27 wsCrText:36 wsLimitsText:40 wildShapeStatBlock:53 wsEnsureBeasts:72 wsFormLine:80 renderWildShape:89 wsSlotHeal:139 wsSlotHealRow:147 wildShapeSlotHeal:154 wsLimits:171 openPolymorphPicker:174 openWildShapePicker:180 wsOpenPicker:186 closeWildShapePicker:194 wsSetSearch:197 wsPickRow:199 wsBtn:204 renderWildShapePicker:208 wildShapeLearn:241 wildShapeForget:249 wildShapeAssume:257 polymorphAssume:275 polymorphEnd:291 wildShapeExit:300

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (3869 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:129 SAVES_DATA:151 CONDITIONS:160 EFFECTS_DATA:183 CLASS_FEATURES:234 SPELL_PREP_CLASSES:505 CANTRIPS_KNOWN_2014:514 SPELLS_KNOWN_2014:525 SPELL_SLOTS_BY_LEVEL:534 CLASS_HIT_DICE:618 SUBCLASSES:625 SOURCE_LABELS:646 SUBCLASS_SOURCE:673 SUBCLASS_CREDIT:733 BOOK_CODES:752 _booksOffCache:755 CLASS_SOURCE:808 SUBCLASS_LEVEL:824 SUBCLASS_FEATURES:841 WEAPON_PRESETS:1664 ITEM_ICONS:1708 CATEGORY_NAMES:1709 GEAR_PACKS:1718 RACE_DATA:1813 BACKGROUND_SKILLS:2430 BACKGROUND_ALIASES:2509 DEITY_ALIGN_LABELS:2522 DEITIES_DATA:2527 LANGUAGE_CATALOG:2595 RACE_LANGUAGES:2632 CLASS_LANGUAGES:2734 TOOL_CATALOG:2740 RACE_TOOLS:2796 CLASS_TOOLS:2808 SUBCLASS_LANGUAGES:2817 SUBCLASS_TOOLS:2840 RACE_ARMOR:2868 RACE_WEAPONS_SPECIFIC:2874 CLASS_WEAPONS_SPECIFIC:2890 RACE_NAME_POOLS:2903 RACE_NAME_GROUP:2945 SUBCLASS_ARMOR:2960 ARMOR_PRESETS:2995 skills:3012 ABILITY_INFO:3025 CLASS_SKILL_OPTIONS:3065 CLASS_SKILL_COUNT:3081 CLASS_SKILL_MC_COUNT:3082 CLASS_ARMOR_PROFS:3085 CLASS_RESOURCES:3106 ASI_LEVELS:3294 XP_THRESHOLDS:3302 APP_VERSION:3312 APP_VERSION_DATE:3313 APP_TELEGRAM_URL:3319 APP_BOOSTY_URL:3320 FEATS_DATA:3341 CASTER_TYPE:3667 THIRD_CASTER_SUBCLASSES:3677 THIRD_CASTER_SLOTS:3684 MULTICLASS_SPELL_SLOTS:3695 MULTICLASS_PREREQUISITES:3720 MULTICLASS_PROFICIENCIES:3739 EDITION_DATA:3769

**spells.js** (13819 строк)  
SPELLS_BASE:7

**spell-effects.js** (881 строк)  
SPELL_EFFECTS:71

**class-choices.js** (990 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 ARTIFICER_INFUSIONS:106 ARTIFICER_REPLICA_ITEMS:125 CLASS_CHOICES:184 CC_REQ_SPELL_NAMES:457 ccModalState:649

**subclass-choices-data.js** (1196 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 LIVING_WEAPON_DISCIPLINES:134 LIVING_WEAPON_PERFECT_FORM:140 RUNE_KNIGHT_RUNES:148 ARCANA_CANTRIPS:166 ARCANA_MASTERY:167 GIANT_CANTRIPS:178 ARMORER_MODELS:182 SUBCLASS_CHOICES:187 SUBCLASS_RESOURCES:490

