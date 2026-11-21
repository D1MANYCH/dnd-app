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
| 7912–7961 | FEATS LIST IN ASI |
| 7962–8207 | PROFILES TABS (Чейнджлог) |
| 8208–8283 | TAKEN FEATS |
| 8284–8476 | SW UPDATE MODAL |
| 8477–8528 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8529–8696 | INVENTORY SLOTS SYSTEM |
| 8697–8901 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 8902–9114 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9115–9263 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9264–9333 | 3D DICE CUBE |
| 9334–9676 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9677–9750 | DESKTOP LAYOUT — centered max-width |
| 9751–9774 | INSPIRATION |
| 9775–9814 | CONCENTRATION |
| 9815–10332 | WEAPON CARDS WITH ROLL BUTTONS |
| 10333–10427 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10428–10488 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10489–10510 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10511–10623 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10624–10651 | R6: Ассеты (декор) |
| 10652–11521 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11522–11605 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11606–11614 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11615–11672 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11673–11989 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 11990–12016 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 12017–12043 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 12044–12126 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12127–13128 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13129–13184 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13185–13280 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13281–13612 | DISC-1 · Ромб раскрытия |
| 13613–14147 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14148–14259 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14260–14404 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14405–14605 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14606–14614 | STYLE-8b3-fix: срезанный ромб |
| 14615–14882 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14883–15343 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15344–15378 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15379–17097 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

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

**rules.js** (1964 строк, 133 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:346 rulesClassSaveProf:356 rulesAttuneLimit:364 rulesSoulOfArtifice:370 rulesSaveBonus:375 rulesDivineSmiteFormula:384 rulesDivineStrikeDice:393 rulesHealBonus:408 rulesSkillBonus:414 rulesPassivePerception:429 rulesSpellStats:433 _spellStatMod:460 rulesSpellStatsByClass:468 rulesWeaponMods:486 rulesMartialArtsDie:505 rulesActiveEffects:515 rulesWeaponIsThrowable:523 rulesWeaponIsRanged:528 rulesEffectDamageBonus:538 rulesEffectResists:553 rulesOffhandDamageMod:559 armorPenalties:568 rulesItemArmor:583 rulesArmorItem:595 rulesAC:606 charCasterLevel:788 classSpellSlotRow:832 getMulticlassSpellSlots:845 rulesApplyFeatureStats:886 rulesRestoreLevelFields:903 rulesApplySpellSlots:922 resolvePactSlots:945 restoreItemCharges:955 rulesHitDieSides:972 rulesShortRest:978 rulesLongRestBlockReason:1013 rulesLongRest:1026 rulesExhaustionLevel:1098 rulesEffectiveHpMax:1104 _dsReset:1109 _dsCount:1110 _dsFill:1111 _condAdd:1112 _condRemove:1113 rulesIsDead:1115 rulesIsStable:1119 rulesRegainFromZero:1124 rulesSetHp:1130 rulesDamageAfterDefenses:1142 rulesApplyDamage:1154 rulesDeathSaveBlockReason:1191 rulesDeathSave:1198 rulesConditionRollMods:1217 rulesSpeedBonus:1242 rulesEffectiveSpeed:1254 rulesArmorStealthDisadv:1277 rulesFeatPrereqMissing:1286 rulesFeatStatChoice:1313 rulesFeatStatOptions:1321 rulesFeatSlotCount:1334 rulesFeatSpellFits:1339 rulesFeatSpellCandidates:1350 rulesFeatSpellLabel:1354 rulesFeatSpellProgress:1359 rulesFeatClassOptions:1384 rulesFeatFreeResId:1397 rulesResetFeatFree:1400 concSaveParams:1411 rulesCrToXp:1453 rulesCrToProf:1459 rulesCrValue:1466 rulesWildShapeLimits:1477 rulesPolymorphLimits:1501 rulesCombatWildShapeHeal:1506 rulesBeastAllowed:1511 rulesFormStart:1518 rulesFormOwnHp:1532 rulesFormDamage:1537 rulesFormHeal:1552 rulesEncounterMultiplier:1559 rulesEncounterDifficulty:1568 rulesClassLangChoice:1594 getCharClassPairs:1599 charEditionMismatch:1613 findLangInCatalog:1621 ensureLanguagesArray:1633 recalcLanguagesFromSources:1649 add:1654 findToolInCatalog:1701 ensureToolsArray:1713 getBackgroundDef:1734 validateBgStatChoice:1770 parseBackgroundToolEntry:1790 recalcToolsFromSources:1805 add:1810 ensureArmorWeaponFields:1875 recalcArmorWeaponFromSources:1888 addArmor:1894 addWeapon:1895 addSpec:1944

**app-asi.js** (930 строк, 43 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:92 buildASIStatGrid:104 getASIMode:125 toggleASIStat:130 updateASIPreview:161 getFeatDef:232 _featPickerList:250 buildFeatList:264 filterFeatList:299 _asiFeatPreview:316 _asiFeatBlocked:340 _featStatPickHtml:353 _asiFeatReady:366 selectFeatStat:370 selectFeat:375 asiPruneToLevel:390 _asiUnlockSheet:403 _asiShowStatModes:412 _statGain:423 applyASI:429 renderTakenFeats:597 removeFeat:656 featSkillPick:685 _agBonus:720 _agPbSpent:731 _agBase:737 _agReady:744 openAbilGen:749 _agInit:759 agSetMode:772 agPb:778 _agSwap:788 agStd:795 agPick:801 agRoll:807 _agCtl:820 owner:831 _agRender:846 agApply:903 _agCommit:911

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-builds.js** (1769 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1129 openBuildGuide:1160 gx:1183 _list:1184 getBuildLevelRec:1249 getBuildRecChoiceOption:1258 getBuildRecChoiceIds:1266 getBuildRecFeat:1271 getBuildRecAsi:1281 getBuildRecSubclass:1288 parseAsiFromHeadline:1296 _buildFeatNameMap:1310 parseFeatFromHeadline:1352 parseSpellsFromHeadline:1369 getBuildRecSpellObjs:1615 openBuildPlan:1635 _cpSubclassOf:1688 _cpClassSwitch:1699 openClassPlan:1714

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-combat.js** (3459 строк, 155 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:52 formatRollMode:67 formatRollModeLabel:82 showDualDice:89 formatDiceInfoStr:107 rollSavingThrow:120 rollAbilityCheck:135 rollInitiative:149 rollSkillCheck:160 initSaves:179 autoSelectProficiencies:214 initSkills:257 toggleAbilOpen:285 abilityBreakdown:297 openAbilityInfo:327 toggleExpertise:362 loadExpertise:381 updateSkillProfCount:395 updateSkillSources:407 updateClassFeatures:431 calculateAC:446 toggleInspiration:507 updateStatusCounter:520 updateStatusBar:534 updateInspirationLabels:576 updateStatDisplay:593 updateAllStatDisplays:598 adjustStat:602 adjustCoin:625 renderCoinMob:639 openCoinSheet:649 setCoinFromSheet:659 updateCoinTotal:666 openCoinExchange:678 closeCoinExchange:683 previewExchange:687 coinExchangeCalc:715 confirmExchange:720 updateSubclassOptions:743 updateSubclassRecHint:807 featHpPerLevel:822 featHpFlat:831 recalculateHP:840 updateChar:895 toggleProficiency:962 calcStats:985 setSpellStat:1059 calcSpellStats:1070 _toggleNonCasterCards:1122 showSpellCasterCards:1133 onRaceChange:1141 renderBooksRow:1276 openMobSheet:1303 closeMobSheet:1310 mobSheetActs:1312 openBooksSheet:1317 toggleCharBook:1327 populateRaceSelect:1344 _speciesEffective:1377 _renderSpeciesBar:1390 _speciesChoiceOptions:1405 toggleSpeciesChoice:1412 syncSpeciesSpells:1426 rollRandomName:1472 pick:1480 build:1481 _raceSkillAllowance:1548 _raceFlexCount:1558 _raceFlexFits:1564 _raceFlexApply:1571 _setExtrasHtml:1581 renderRaceExtras:1590 toggleHalfElfStat:1761 toggleRaceFlexStat:1787 setRaceVariableTrait:1817 _raceSkillSet:1834 _pickHide:1844 _pickExpandBtn:1848 pickExpand:1851 raceLangGoto:1858 toggleRaceSkill:1866 _classSkillList:1895 _skillsFromOtherSources:1908 _skillsByName:1918 _skillTakenElsewhere:1924 _classSkillHeld:1939 _classSkillSync:1945 renderClassSkills:1976 toggleClassSkill:2023 openRaceFeatModal:2051 removeRaceFeat:2071 applyBasicLockUI:2106 _cwEditionBusy:2140 syncCwEdition:2145 setDraftEdition:2157 updateLockButtonState:2167 lockBasicInfo:2205 unlockBasicInfo:2226 isSheetLocked:2256 sheetLockGuard:2262 applySheetLockUI:2268 _creationTodo:2299 add:2303 src:2304 scheduleCreationTodo:2395 renderCreationTodo:2400 creationTodoGo:2427 openLockSheet:2439 _creationUiReset:2452 _isMobSheet:2453 renderIdentitySummary:2454 toggleIdentityMore:2473 renderProfSummary:2477 toggleProfCard:2492 openAcSheet:2498 _mobMarkClamp:2506 init:2515 lockSheet:2536 doLock:2540 unlockSheet:2553 onBackgroundChange:2574 _bgSkillsOf:2619 _bgUncheckOld:2626 _bgCheckSkills:2634 renderBackgroundFeature:2646 _bgStatShort:2691 populateBackgroundSelect:2694 _bgRevertStatChoice:2725 _bgAppliedStat:2738 _bgApplyStat:2743 setBgStatMode:2755 toggleBgStat:2767 _bgAfterStats:2790 _bgRevertFeatEffects:2801 syncOriginFeat:2826 toggleBgCustom:2862 _toggleBgCustom14:2902 toggleBgSkillPick:2949 _renderBgCustom14:2976 giveBackgroundEquipment:3013 renderBackgroundExtras:3058 _armorFromSelect:3166 renderArmorSelect:3178 onArmorPick:3213 onShieldPick:3227 onArmorChange:3246 onManualAC:3275 onManualMaxHP:3282 calcCoinWeight:3305 getActiveConditionsForRender:3319 toggleConditionsPopup:3348 closeConditionsPopup:3360 renderConditionsPopup:3366

**app-conditions.js** (515 строк, 28 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:116 setConditionsSearch:121 toggleConditionsActiveOnly:122 renderConditionsGrid:128 toggleConditionDesc:181 toggleEffectDesc:189 initConditions:196 getExhaustionLevel:228 adjustExhaustion:235 updateExhaustionDisplay:261 toggleCondition:282 updateConditionsCount:310 loadConditions:319 refreshSaveBonuses:328 _fxMatches:345 setEffectsSearch:350 setEffectsType:351 toggleEffectsActiveOnly:359 renderEffectsGrid:365 initEffects:448 toggleEffect:468 updateEffectsCount:500 loadEffects:509

**app-core.js** (1989 строк, 97 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:587 _screenGhostDrop:593 _screenGhostStart:605 _screenEnter:623 _purgeDraftChars:634 showScreen:647 updateHeaderTitle:762 syncDrawerHeader:816 switchTab:828 _rdSheetView:867 openDrawer:886 closeDrawer:899 showCharacterNav:911 hideCharacterNav:919 isInteractive:939 currentActiveTab:962 scrolledDown:1027 closeAction:1034 reset:1041 end:1074 createNewCharacter:1094 getClassColor:1117 getClassIcon:1133 getAbilityIcon:1140 getConditionIcon:1155 getConditionChipIcon:1179 getSpellClassIcon:1197 getSchoolSlug:1214 getSchoolIcon:1218 stripLeadingEmoji:1231 formatTimeAgo:1235 setCharSort:1249 setCharSearch:1256 duplicateCharacter:1260 exportOneCharacter:1272 toggleCharSelectMode:1284 _charSelectedList:1293 _updateCharSelectBar:1296 toggleCharSelected:1313 charSelectAll:1317 _charSelectEmptyToast:1322 exportSelectedCharacters:1325 duplicateSelectedCharacters:1332 deleteSelectedCharacters:1347 updateCharCounter:1365 onDragStart:1382 onDragOver:1383 onDrop:1384 renderCharacterList:1395 renderCharPlate:1489 deleteCharacter:1552 showConfirmModal:1566 safeSet:1620 safeSetChecked:1624 loadCharacter:1633 showToast:1826 showFieldError:1843 clearFieldError:1865 toastAddAction:1875 emptyStateHtml:1893 openHPHistory:1904 closeHPHistory:1932 updateVersionBlock:1937 forceAppUpdate:1971

**app-creator.js** (1149 строк, 111 функций)  
_crChar:27 _crVisible:31 _crStepIndex:37 openCharOrCreator:43 openCreator:48 creatorRender:58 creatorRefresh:82 _crSyncNext:86 creatorHostsPanels:98 creatorSpellRoom:103 _crLockIndex:112 _crRenderFrozen:117 _crGo:122 creatorNext:136 creatorPrev:143 creatorExit:146 creatorManual:149 _crLeaveToSheet:151 _crSetField:165 _crValidBase:175 _crSeg:180 _crRenderBase:193 creatorSetEdition:214 creatorSetName:221 creatorRollName:226 creatorSetGender:234 creatorSetLevel:239 _crCard:253 _crSelectOptions:261 _crRaceData:277 _crSpeciesSingles:282 _crValidRace:286 _crRaceMeta:293 _crRaceDesc:307 _crRenderRaceList:313 _crRenderRace:335 creatorRaceSearch:369 creatorPickRace:376 creatorPickSpeciesOpt:383 _crClassMeta:407 _crSubclassOpen:418 _crValidClass:423 _crBuildsFor:428 _crRenderClass:435 creatorPickClass:479 creatorPickSubclass:489 creatorPickBuild:496 _crBgDef:506 _crFeatName:510 _crValidBg:515 _crBgMeta:524 _crRenderBg:536 _crRenderBgStats:558 _crChip:595 creatorPickBg:599 creatorBgStatMode:606 creatorBgStat:607 creatorBgCustomStat:608 creatorBgCustomFeat:609 _crRenderAbil:617 _crAfterAbil:621 _crValidAbil:627 _crLeaveAbil:631 _crTodo:658 _crValidChoices:662 _crRenderChoices:664 _crAfterChoices:672 _crMount:683 _crUnmountPanels:694 creatorChoicesSync:707 _crTodoGo:722 _crGoTo:726 _crRenderMastery:732 creatorToggleMastery:744 _crRenderClassChoices:757 _crTargetLevel:775 _crLevelPending:777 _crValidLevels:781 _crRenderLevels:785 _crAfterLevels:793 creatorLevelsSync:809 creatorHpMode:822 creatorLevelUp:824 _crRollLevelHp:837 _crSpellRows:853 _crSpellRow:870 _crValidSpells:874 _crListRoom:879 _crBuildSpells:889 push:893 _crHasSpell:903 _crRenderSpells:907 _crRenderMySpells:932 creatorRemoveSpell:954 creatorOpenSpells:963 creatorToggleSpellPrep:967 creatorAddBuildSpells:977 _crGearTodo:1003 _crValidGear:1007 _crRenderGear:1009 creatorGearSync:1015 _crBgEquip24:1029 _crRenderPersona:1049 creatorSetAlign:1066 creatorSetDeity:1073 creatorPersonaGen:1075 creatorPersonaVariant:1082 put:1091 _crRenderSummary:1104 _crSummaryTodo:1130 _crGoStep:1141

**app-desktop.js** (528 строк, 15 функций)  
syncFromStatusBar:144 syncStrip:203 setRailOpen:214 syncRdToggles:221 _esc:241 _stripEmoji:247 _condIcon:251 setRowExpanded:257 collapseRow:263 renderRrConditions:265 renderRailSlots:311 renderRailConc:353 updateRailHpRow:368 rrApplyHP:383 init:396

**app-dice.js** (1717 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1363 _diceShapeSvg:1397 renderDiceFan:1404 _paintSelectedDie:1423 _diceHeroSvg:1447 _paintDiceMode:1457 selectDie:1472 rollSelectedDie:1491 toggleDiceFormulaPanel:1500 _savedRollFormula:1519 _savedRollsClean:1522 _savedRollNewId:1537 _savedRollLabel:1540 renderSavedRolls:1544 savedRollRoll:1564 savedRollTap:1571 savedRollEdit:1587 savedRollCancel:1604 savedRollSubmit:1609 savedRollDelete:1630 savedRollFromDice:1648 _diceHotkeys:1669

**app-help.js** (1342 строк, 58 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:46 getHelpFlag:111 setHelpFlag:115 welcomeGoStep:121 showWelcome:131 closeWelcome:138 welcomeContinue:144 welcomeSkipExperienced:150 welcomeBack:156 welcomeFinish:163 dismissWelcome:196 maybeShowWelcome:199 restartOnboarding:204 _tourWide:240 _ensureTourDom:243 _resolveTarget:284 _tourFirstVisible:299 _tourAnyModalVisible:319 _tourModalOpen:325 _tourStartWhenClear:337 startTour:349 startListTour:362 startSheetTour:366 _tourTyping:378 maybeStartSheetTour:383 startCreatorTour:406 maybeStartCreatorTour:411 _buildCreatorSteps:423 restartTour:434 startTabTour:461 maybeStartTabTour:479 tourNext:506 tourPrev:511 endTour:517 _showTourStep:527 _setBox:590 _computeTourBoxes:606 snap:608 corner:621 _layoutTourCorners:643 _layoutTour:660 _onTourKey:763 _onTourReflow:769 _bindTourGlobal:773 _unbindTourGlobal:778 _buildListSteps:789 _buildSheetSteps:839 _buildStatsSteps:949 _buildProgressSteps:990 _buildSpellsSteps:1048 _buildInventorySteps:1091 _buildBattleSteps:1137 _buildNotesSteps:1212 _buildPartySteps:1253 _buildJournalSteps:1311

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

**app-hp.js** (2122 строк, 74 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:33 showLongRestInfo:34 selectRestType:36 _restResNames:53 _restResLine:72 _restSlotsSpent:78 _restRecoveries:85 _restRecoveryHtml:98 _restRefreshRecovery:103 _renderRestPreview:107 _restHasSlots:145 showRestResult:151 adjustHitDice:161 _restHitDiceChosen:173 adjustHitDiceSize:180 updateHitDiceInfo:187 confirmRest:220 openLevelUpModal:317 _showMulticlassScreen:348 luPickAnotherClass:393 openMulticlassNewClass:400 confirmMulticlassNewClass:459 _showLevelUpPreview:470 closeLevelUpModal:651 confirmLevelUp:664 _luShowResult:799 luFinishChoices:865 luRefreshChoices:877 luSetSubclass:884 luApplyFeatById:904 luApplyAsi:950 _luFeatChoiceAt:971 _luChoiceOpensAt:980 _luSub:986 _ccDefsFor:990 _luAsiDone:1001 _luBuildFor:1007 luApplyAllRecommendations:1013 _luSpellGainParts:1135 pluralRu:1140 delta:1144 _luResMap:1163 luBuildChoicesScreen:1174 recBadge:1184 luAddRecommendedSpells:1345 luGoToSpellsTab:1373 openLevelDownConfirm:1385 confirmLevelDown:1430 loadDeathSaves:1463 toggleDeathSave:1507 resetDeathSaves:1524 updateHPDisplay:1537 hpToggleRow:1629 hpSetRowOpen:1638 updateHPSummary:1646 updateHPRows:1710 quickHP:1728 setHPAbsolute:1854 addHPHistory:1879 _hpUndoPrepare:1896 _hpUndoConcSnap:1916 _hpUndoConcRestore:1933 undoHPChange:1956 showHPToast:1986 applyCustomHP:2004 saveTempHP:2021 rollHitDieQuick:2035 renderHitDiceIcons:2067 rollDeathSave:2081 _luSlotPart:2112 _luPactPart:2115

**app-inventory.js** (2452 строк, 136 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:151 toggleInvItem:279 editItemDirect:284 deleteItemDirect:285 updateInventoryWeight:305 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:379 adjustItemCharges:390 openItemModal:406 closeItemModal:480 syncItemArmorFields:485 syncWornArmor:497 submitItem:526 openMagicCatalog:598 closeMagicCatalog:615 renderMagicCatalog:620 fillFromMagicItem:652 openGearCatalog:705 closeGearCatalog:721 renderGearPacks:726 renderGearCatalog:736 fillFromGearItem:764 addPackToInventory:787 rollTrinket:809 _weaponPresets2024:845 _weaponMasteryGrant:866 getWeaponMasteryLimit:891 weaponMasteryPending:895 canMasterWeapon:900 getWeaponMasteryProp:909 isWeaponMastered:916 toggleWeaponMastery:919 toggleWeaponThrown:938 _weaponCatalog:946 renderWeaponPresets:960 filterWeaponPresets:1026 toggleWeaponFilter:1030 fillWeaponPreset:1037 _resetWeaponForm:1055 openWeaponModal:1076 closeWeaponModal:1086 editWeapon:1094 deleteCustomWeapon:1124 _weaponPresetByName:1150 checkWeaponProficiency:1157 submitWeapon:1185 weaponRowTap:1276 renderWeapons:1290 isLightWeapon:1396 toggleTWFStyle:1401 rollTWFAttack:1409 _weaponDamageRoll:1457 _weaponDmgCaption:1479 _weaponFxTag:1488 rollTWFDamage:1493 _unarmedStrike:1508 _weaponAt:1513 rollWeaponAttack:1517 _attackBonusTail:1579 rollWeaponDamage:1583 _canDivineSmite:1616 openDivineSmite:1620 _divineSmite:1644 rollDivineStrike:1678 removeWeapon:1696 _invDndInit:1730 _invClearIndicators:1759 _invSetIndicator:1768 _invCleanup:1773 _invCancelDrag:1780 _invMoveItem:1788 _invCommitDrop:1805 invDragStart:1826 invDragOver:1836 invDragLeave:1853 invDrop:1857 invDragEnd:1863 invTouchStart:1870 invTouchMove:1886 invTouchEnd:1918 quickSlotsClean:1940 quickSlotIconValid:1957 quickSlotAutoIcon:1963 _qsList:1982 _qsFindItem:1986 _qsFindSpell:1996 _qsResolve:2001 _qsItemQid:2004 _qsQty:2008 _qsConsumable:2012 quickSlotIndex:2018 quickSlotAdd:2024 quickSlotRemove:2034 quickSlotPrune:2041 _qsBusy:2048 quickSlotConsume:2054 _qsHealFormula:2065 quickSlotUse:2071 quickSlotToggle:2097 _qsBtnHtml:2131 quickSlotIconPickFor:2138 quickSlotIconPick:2145 quickSlotIconClose:2182 quickSlotIconSet:2187 quickSlotIconUpload:2200 quickSlotIconEncode:2216 quickDockEdit:2235 quickDockCancel:2236 quickDockHint:2237 quickDockRemoveAt:2241 quickDockReplaceAt:2249 _qsRefreshCards:2260 renderQuickDock:2265 _rdNorm:2318 _rdMatch:2319 _rdFindRows:2324 byPrefix:2329 rdFindRender:2373 rdFindFocus:2385 rdFindBlur:2395 rdFindKey:2401 _rdReveal:2409 rdFindPick:2414 rdExchPreview:2430 rdExchange:2445

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

**app-spells.js** (2300 строк, 113 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:165 adjustPactSlots:176 syncSpellSlotsFromClass:188 updateSpellSlots:197 toggleSpellSlot:208 adjustSpellSlots:219 restoreAllSlots:230 setSpellVersion:241 _syncSpellVersionLock:252 setSpellClass:261 _charIsThirdCaster:270 _charSpellClassKey:276 _charMaxCastableLevel:288 _defaultSpellVersion:296 toggleSpellOnlyAdded:302 _renderSpellOnlyAdded:306 openSpellSearch:317 markCharOwnClassFilter:339 closeSpellSearch:368 _featPickCtx:379 featAddFixedSpells:394 openFeatSpellPicker:420 _featPickProgressText:437 _renderFeatPickBar:443 featPickSetClass:464 _featPickCandidates:472 _renderFeatPickList:482 addFeatSpell:513 removeFeatSpell:533 _parseSpellClassList:556 _syncNewSpellClassChips:560 toggleNewSpellClass:567 _fillNewSpellDamageTypes:592 _toggleHidden:599 updateNewSpellMechFields:607 _hbFormulaCheck:622 _collectHbEffect:631 _spellIdArg:669 _findHomebrewSpell:675 openAddSpellForm:683 _syncCustomSpellAcrossChars:762 _purgeCustomSpellFromChars:780 deleteCustomSpell:799 _deleteCustomSpellConfirmed:808 closeAddSpellForm:822 submitNewSpell:826 renderSpellSearch:916 spellCompRu:997 addSpell:1002 removeSpell:1036 toggleSpellCard:1050 renderMySpells:1055 _spellActiveBadgeText:1203 _spellActiveBadgeHtml:1207 updateSpellActiveBadges:1210 _prepEntries:1233 _spellPrepEntry:1251 _prepLimit:1256 calcMaxPrepared:1272 _known2014:1279 calcMaxKnownSpells:1294 _knownSpellCount:1300 calcMaxCantrips:1310 isPrepClass:1319 _subclassSpellNames:1325 syncSubclassSpells:1358 spellNeedsPrep:1385 _preparedCount:1401 openSpellCardsMenu:1409 isSpellPrepared:1424 toggleSpellPrepared:1434 renderPrepCounter:1460 _castableSlotOptions:1513 _wizardPick:1538 _spellMasteryFree:1541 _signatureResId:1546 _arcanumResId:1553 castSpell:1563 _castSpellWithSlot:1584 _finishCast:1632 applyCastEffects:1682 _applyCastForm:1719 openCastVariantChooser:1732 pickCastVariant:1771 closeCastVariantChooser:1781 _applyCastSummon:1794 _nextCastInstanceId:1828 _replaceCastInstance:1836 _ensureCastInstance:1866 _applyCastDamage:1886 _rollCastDamage:1913 _startCastRepeat:1983 castRepeatDamage:1997 _applyCastDebuff:2022 castSpellAttackMod:2063 castStatMod:2071 _agonizingBonus:2093 _applyCastHeal:2112 _castHealApply:2136 _applyCastTempHp:2142 applyCastTempHp:2159 _applyCastHpMaxBonus:2173 openCastChooser:2193 closeCastChooser:2214 canCastAsRitual:2227 castRitual:2249 cancelRitual:2288

**app-sync.js** (696 строк, 46 функций)  
_syncLog:22 _syncEnabled:26 _syncRedirectUri:30 _syncDevice:34 _syncGetAuth:41 _syncSetAuth:48 _syncTokenValid:55 syncSignIn:59 syncSignOut:76 syncTurnOff:87 _syncConsumeHash:110 _driveFetch:146 _driveList:160 _driveFind:167 _driveRead:171 _syncCheckDoc:180 _driveWrite:190 _syncLoadState:207 _syncSaveState:215 syncTombstone:219 _syncExpired:227 syncSchedule:233 _syncUserSpells:240 _syncHashes:245 _syncKeepLive:255 _syncNameDupes:275 _syncAskDupes:282 _syncDestructive:293 lost:294 _syncApply:302 _syncFixChar:332 _syncMergeExtra:337 _syncRun:348 syncNow:416 syncOverwrite:470 _syncStable:480 _syncHashStr:488 syncHashChar:497 _syncClone:499 _syncUnpackChar:501 _syncPackChar:507 _syncMergeList:513 syncMerge:545 _syncBtn:639 _syncTimeLabel:648 renderSyncRow:655

**app-ui.js** (1579 строк, 98 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:58 openAvatarModal:76 closeAvatarModal:95 handleAvatarFile:98 applyAvatarFromUrl:124 applyAvatar:133 removeAvatar:151 renderSheetAvatar:170 prefersReducedMotion:186 animateCountUp:192 tick:200 _reportError:223 swProgressToast:254 swProgressToastRemove:267 swInstallFailed:271 swWatchFirstInstall:284 swRegister:314 swTelegramBlock:349 swSupportBlock:360 showUpdateModal:372 later:398 onKey:405 checkWhatsNew:415 showWhatsNewModal:427 toggleAccordion:469 initCharResources:489 getResourceMax:498 getCharResourceDefs:519 currentDieSize:549 crRow:561 crRestoreLabel:574 crResourceRow:590 crRecoveryHint:660 crResName:665 crFlexActs:674 _crFlexContext:693 _crFlexDone:703 flexSlotToPoints:710 flexPointsToSlot:724 crPointRecoveryAmount:743 crPointRecoveryActs:748 recoverPointsByResource:754 crPortentRolls:774 crPortentMeta:778 crPortentActs:784 _crPortentContext:790 crRollPortent:800 usePortent:807 crSlotRecoveryBudget:822 crSlotRecoveryActs:826 recoverSlotByResource:841 crPassiveNotes:867 rollSneakAttack:876 rollResourceDie:900 crManeuverRows:919 crRowsHtml:936 crSetRows:973 renderClassResources:988 spendResource:1006 resourceEffectOn:1027 resourceEffectOff:1035 resetResource:1042 toggleResourcePip:1052 resourceRollOnSpend:1077 resetResourcesByRest:1090 getJournal:1140 addJournalEntry:1145 filterJournal:1167 renderJournal:1174 deleteJournalEntry:1210 openAddJournalEntry:1219 closeAddJournalEntry:1224 saveJournalEntry:1227 getCompanions:1247 renderCompanions:1252 companionHP:1297 buildFamiliarFormOptions:1310 onCompanionTypeChange:1322 applyFamiliarForm:1330 openAddCompanionModal:1342 summonFamiliar:1359 openPrefilledCompanionModal:1369 openEditCompanionModal:1380 closeAddCompanionModal:1400 saveCompanion:1403 deleteCompanion:1428 switchProfilesTab:1444 clipChangelogText:1459 expandChangelogItem:1470 clCleanText:1482 renderChangelog:1488 openItemRef:1536 closeItemRef:1542 switchItemRef:1547 _syncHeaderHeight:1565

**app-wiki.js** (856 строк, 71 функций)  
_wikiPlural:33 _wikiLoreCount:37 wikiRegister:64 wikiCrumbs:71 _wikiCrumbGo:94 wikiExit:97 _wikiRecentGet:101 wikiRecentPush:105 _wikiRecentOpen:110 wikiEdition:118 wikiEdData:125 setWikiEdition:127 openWiki:132 _wikiNorm:142 _wikiHelpTabs:145 _wikiHelpHits:159 wikiUpdateHelpLink:180 openWikiLore:200 _wikiRow:202 _wikiGo:211 wikiJump:212 _wikiHubItems:217 renderWiki:226 _wikiClassNames:325 _wikiClassSource:333 _wikiProfList:339 _wikiToolsText:348 openWikiClasses:355 openWikiClass:361 wikiClassBack:371 setWikiClassEdition:375 _wikiCRow:383 _wikiCGo:391 _wikiFact:393 _wikiFeatureRows:400 renderWikiClass:411 _wikiSrcLabel:514 _wikiLoreList:519 _wikiFeatByName:530 _wikiLoreEnsure:537 _wikiLoreOpen:543 openWikiRaces:554 openWikiBackgrounds:555 openWikiFeats:556 wikiLoreBack:558 setWikiLoreEdition:562 _wikiLRow:570 _wikiLGo:578 _wikiStatsText:580 _wikiPara:585 _wikiRaceSource:594 _wikiMeters:598 _wikiRacePage:603 _wikiBgPage:626 _wikiFeatPage:646 renderWikiLore:657 _wikiLoreSearch:697 _wikiCondName:715 _wikiParaBr:718 _wikiCondPage:728 _wikiGlossMap:735 add:737 _wikiGlossPage:750 _wikiAbilPage:756 _wikiOptDict:765 _wikiOptGroup:778 _wikiOptReq:783 _wikiOptPage:793 wikiOpenGloss:805 wikiOpenMyClass:813 _wikiGlossSearch:821

**app-wildshape.js** (319 строк, 27 функций)  
wsBeast:12 wsChargesLeft:18 wsSpeedText:27 wsCrText:36 wsLimitsText:40 wildShapeStatBlock:53 wsEnsureBeasts:72 wsFormLine:80 renderWildShape:89 wsSlotHeal:139 wsSlotHealRow:147 wildShapeSlotHeal:154 wsLimits:171 openPolymorphPicker:174 openWildShapePicker:180 wsOpenPicker:186 closeWildShapePicker:194 wsSetSearch:197 wsPickRow:199 wsBtn:204 renderWildShapePicker:208 wildShapeLearn:241 wildShapeForget:249 wildShapeAssume:257 polymorphAssume:275 polymorphEnd:291 wildShapeExit:300

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (3873 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:129 SAVES_DATA:151 CONDITIONS:160 EFFECTS_DATA:183 CLASS_FEATURES:238 SPELL_PREP_CLASSES:509 CANTRIPS_KNOWN_2014:518 SPELLS_KNOWN_2014:529 SPELL_SLOTS_BY_LEVEL:538 CLASS_HIT_DICE:622 SUBCLASSES:629 SOURCE_LABELS:650 SUBCLASS_SOURCE:677 SUBCLASS_CREDIT:737 BOOK_CODES:756 _booksOffCache:759 CLASS_SOURCE:812 SUBCLASS_LEVEL:828 SUBCLASS_FEATURES:845 WEAPON_PRESETS:1668 ITEM_ICONS:1712 CATEGORY_NAMES:1713 GEAR_PACKS:1722 RACE_DATA:1817 BACKGROUND_SKILLS:2434 BACKGROUND_ALIASES:2513 DEITY_ALIGN_LABELS:2526 DEITIES_DATA:2531 LANGUAGE_CATALOG:2599 RACE_LANGUAGES:2636 CLASS_LANGUAGES:2738 TOOL_CATALOG:2744 RACE_TOOLS:2800 CLASS_TOOLS:2812 SUBCLASS_LANGUAGES:2821 SUBCLASS_TOOLS:2844 RACE_ARMOR:2872 RACE_WEAPONS_SPECIFIC:2878 CLASS_WEAPONS_SPECIFIC:2894 RACE_NAME_POOLS:2907 RACE_NAME_GROUP:2949 SUBCLASS_ARMOR:2964 ARMOR_PRESETS:2999 skills:3016 ABILITY_INFO:3029 CLASS_SKILL_OPTIONS:3069 CLASS_SKILL_COUNT:3085 CLASS_SKILL_MC_COUNT:3086 CLASS_ARMOR_PROFS:3089 CLASS_RESOURCES:3110 ASI_LEVELS:3298 XP_THRESHOLDS:3306 APP_VERSION:3316 APP_VERSION_DATE:3317 APP_TELEGRAM_URL:3323 APP_BOOSTY_URL:3324 FEATS_DATA:3345 CASTER_TYPE:3671 THIRD_CASTER_SUBCLASSES:3681 THIRD_CASTER_SLOTS:3688 MULTICLASS_SPELL_SLOTS:3699 MULTICLASS_PREREQUISITES:3724 MULTICLASS_PROFICIENCIES:3743 EDITION_DATA:3773

**spells.js** (13819 строк)  
SPELLS_BASE:7

**spell-effects.js** (881 строк)  
SPELL_EFFECTS:71

**class-choices.js** (995 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 ARTIFICER_INFUSIONS:106 ARTIFICER_REPLICA_ITEMS:125 CLASS_CHOICES:184 CC_REQ_SPELL_NAMES:457 ccModalState:649

**subclass-choices-data.js** (1196 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 LIVING_WEAPON_DISCIPLINES:134 LIVING_WEAPON_PERFECT_FORM:140 RUNE_KNIGHT_RUNES:148 ARCANA_CANTRIPS:166 ARCANA_MASTERY:167 GIANT_CANTRIPS:178 ARMORER_MODELS:182 SUBCLASS_CHOICES:187 SUBCLASS_RESOURCES:490

