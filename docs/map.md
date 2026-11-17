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
| 15361–17075 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:93-94 #conditions-popup-overlay:95-95 #conditions-popup:96-100 #conditions-popup-list:101-104 #drawer-overlay:105-106 #side-drawer:107-144 #screen-settings:145-236 #header-autohide-row:237-253  
#wake-lock-row:254-284 #edition-row:285-307 #install-row:308-318 #welcome-modal:319-323 #welcome-step-1:324-342 #welcome-step-2:343-377 #header-avatar:378-383 #status-bar:384-387  
#status-inspiration:388-388 #status-concentration:389-391 #status-ritual:392-394 #status-conditions-btn:395-408 #screen-home:409-411 #home-art:412-439 #home-sub-new:440-495 #home-install:496-503  
#home-hero:504-504 #home-hero-emblem:505-508 #home-hero-sub:509-509 #home-hero-chips:510-520 #screen-characters:521-540 #char-select-bar:541-568 #char-hero:569-569 #char-hero-emblem:570-573  
#char-hero-sub:574-574 #char-hero-chips:575-575 #char-hero-actions:576-584 #screen-data:585-601 #backup-panel:602-606 #backup-list:607-608 #sync-row:609-609 #storage-status:610-621  
#screen-about:622-625 #app-version-row:626-633 #ptab-info:634-641 #app-links-row:642-645 #app-legal-note:646-651 #ptab-changelog:652-657 #changelog-list:658-664 #screen-character:665-665  
#tab-sheet:666-668 #creation-wizard-banner:669-676 #cw-edition-row:677-686 #cw-validation:687-689 #basic-locked-bar:690-699 #creation-todo:700-709 #sheet-avatar:710-722 #char-build-badge-wrap:723-737  
#char-class-mc:738-762 #char-subclass-rec:763-763 #char-subclass-mc:764-972 #char-books:973-977 #race-bonus-display:978-978 #race-extras-panel:979-979 #class-skills-panel:980-981 #background-feature-display:982-983  
#bg-extras-panel:984-1027 #abilgen-row:1028-1034 #stats-collapse-btn:1035-1042 #abilities-region:1043-1046 #proficiency-bonus-2024:1047-1048 #insp-card-2024:1049-1058 #abil-col-1:1059-1059 #stat-block-str:1060-1061  
#mod-str:1062-1068 #abil-save-slot-str:1069-1069 #abil-skills-slot-str:1070-1072 #stat-block-dex:1073-1074 #mod-dex:1075-1081 #abil-save-slot-dex:1082-1082 #abil-skills-slot-dex:1083-1085 #stat-block-int:1086-1087  
#mod-int:1088-1094 #abil-save-slot-int:1095-1095 #abil-skills-slot-int:1096-1099 #abil-col-2:1100-1100 #stat-block-con:1101-1102 #mod-con:1103-1109 #abil-save-slot-con:1110-1110 #abil-skills-slot-con:1111-1113  
#stat-block-wis:1114-1115 #mod-wis:1116-1122 #abil-save-slot-wis:1123-1123 #abil-skills-slot-wis:1124-1126 #stat-block-cha:1127-1128 #mod-cha:1129-1135 #abil-save-slot-cha:1136-1136 #abil-skills-slot-cha:1137-1150  
#saves-grid:1151-1160 #skills-container:1161-1163 #passive-perception:1164-1183 #ws-hp-banner:1184-1189 #hp-dmg-row:1190-1199 #hp-dmg-body:1200-1220 #death-saves-section:1221-1252 #hp-armor-body:1253-1295  
#hp-hd-body:1296-1309 #hp-rest-body:1310-1337 #class-dev-section:1338-1340 #cd-head:1341-1341 #cd-res:1342-1342 #cd-attn:1343-1344 #cd-about:1345-1353 #ac-formula:1354-1355  
#ac-modifiers:1356-1363 #conditions-grid:1364-1371 #effects-grid:1372-1379 #resistances-container:1380-1388 #prof-card:1389-1392 #armor-prof-container:1393-1396 #weapon-prof-container:1397-1400 #tools-container:1401-1404  
#languages-container:1405-1412 #companions-list-sheet:1413-1425 #tab-progress:1426-1427 #pg-body:1428-1429 #tab-spells:1430-1432 #spell-stat-card:1433-1454 #spell-mod-display:1455-1460 #spell-dc-display:1461-1466  
#spell-attack-display:1467-1472 #spell-stats-by-class:1473-1484 #spell-slots-card:1485-1489 #spell-slots-visual:1490-1496 #concentration-block:1497-1514 #rd-find-spl-wrap:1515-1515 #prep-counter:1516-1516 #my-spells-list:1517-1518  
#rd-slot-strip:1519-1520 #tab-inventory:1521-1524 #rd-find-inv-wrap:1525-1541 #weight-fill:1542-1576 #inventory-list:1577-1581 #inv-coins-card:1582-1586 #rd-exch:1587-1597 #inv-pouches:1598-1653  
#tab-notes:1654-1680 #notes-subtabs:1681-1682 #notes-main:1683-1684 #taken-feats-section:1685-1689 #taken-feats-list:1690-1693 #tab-party:1694-1703 #my-char-card:1704-1717 #allies-list:1718-1732  
#npcs-list:1733-1748 #monsters-list:1749-1760 #companions-list-world:1761-1771 #tab-battle:1772-1777 #weapons-list:1778-1780 #ws-card:1781-1783 #saved-roll-form:1784-1790 #saved-roll-err:1791-1792  
#saved-rolls-list:1793-1796 #battle-res-card:1797-1798 #battle-res-rows:1799-1800 #battle-setup-screen:1801-1811 #battle-setup-list:1812-1812 #battle-difficulty:1813-1816 #battle-tracker-screen:1817-1821 #battle-turn-info:1822-1827  
#battle-repeat-strip:1828-1828 #battle-tracker-list:1829-1838 #tab-journal:1839-1853 #journal-list:1854-1860 #screen-itemref:1861-1863 #item-ref-tabs:1864-1869 #item-ref-weight:1870-1908 #item-ref-slots:1909-1940  
#screen-dmref:1941-1943 #dm-ref-tabs:1944-1948 #dm-ref-ed:1949-1949 #dm-ref-cond:1950-1950 #dm-ref-combat:1951-1951 #dm-ref-world:1952-1956 #screen-wiki:1957-1967 #wiki-jumps:1968-1969  
#wiki-body:1970-1975 #screen-wikiclass:1976-1980 #wikiclass-edition-row:1981-1985 #wikiclass-body:1986-1991 #screen-wikilore:1992-1996 #wikilore-edition-row:1997-2001 #wikilore-body:2002-2007 #screen-help:2008-2029  
#help-wiki-row:2030-2031 #help-about:2032-2055 #help-start:2056-2080 #help-sheet:2081-2104 #help-progress:2105-2150 #help-spells:2151-2167 #help-inventory:2168-2180 #help-battle:2181-2205  
#help-party:2206-2222 #help-notes:2223-2231 #help-journal:2232-2240 #help-planes:2241-2268 #help-dice:2269-2280 #help-edition2024:2281-2320 #help-data:2321-2337 #help-marks:2338-2360  
#conc-details-modal:2361-2371 #conc-detail-duration-row:2372-2379 #conc-detail-desc-row:2380-2389 #add-journal-modal:2390-2413 #add-npc-modal:2414-2443 #add-ally-modal:2444-2481 #screen-monsters:2482-2494 #srd-monster-count:2495-2495  
#srd-monster-results:2496-2500 #srd-npc-modal:2501-2510 #srd-npc-count:2511-2511 #srd-npc-results:2512-2519 #screen-monsterform:2520-2557 #monster-cr-note:2558-2560 #monster-stats:2561-2562 #monster-saves:2563-2564  
#monster-attacks:2565-2588 #screen-rest:2589-2591 #rest-main-screen:2592-2593 #rest-card-short:2594-2596 #hit-dice-section:2597-2598 #hit-dice-controls-total:2599-2603 #hit-dice-by-size:2604-2609 #rest-card-long:2610-2612  
#rest-food-section:2613-2623 #rest-result-screen:2624-2626 #rest-result-details:2627-2635 #screen-levelup:2636-2640 #lu-screen-multiclass:2641-2642 #lu-mc-current-classes:2643-2645 #lu-mc-new-class:2646-2650 #lu-mc-prereq-warn:2651-2651  
#lu-mc-subclass-row:2652-2660 #lu-screen-preview:2661-2693 #lu-slots-card:2694-2695 #lu-slots-info:2696-2699 #lu-build-hint:2700-2700 #lu-features-container:2701-2709 #lu-screen-choices:2710-2711 #lu-choices-body:2712-2718  
#lu-screen-result:2719-2720 #lu-result-title:2721-2721 #lu-result-body:2722-2728 #screen-wildshape:2729-2734 #ws-limits:2735-2735 #ws-results:2736-2739 #screen-hphistory:2740-2742 #hp-history-list:2743-2748  
#asi-modal:2749-2753 #asi-build-hint:2754-2768 #asi-feat-list:2769-2769 #asi-stat-grid:2770-2770 #asi-preview:2771-2779 #class-choice-modal:2780-2795 #dice-modal:2796-2828 #dice-file-hint:2829-2829  
#dice3d-result:2830-2841 #dice-result-display:2842-2855 #dice-pick-hint:2856-2856 #dice-mode-segment:2857-2861 #dice-formula-panel:2862-2879 #dice-fan:2880-2888 #dice-popover-settings:2889-2936 #dice-popover-history:2937-2948  
#dice-history:2949-2957 #screen-spellsearch:2958-2960 #spell-feat-bar:2961-2976 #spell-ver-filter:2977-2983 #spell-class-filter:2984-3016 #class-filter-legend:3017-3018 #spell-search-count:3019-3020 #spell-search-results:3021-3024  
#cast-spell-modal:3025-3029 #cast-spell-options:3030-3032 #add-spell-modal:3033-3076 #new-spell-class-chips:3077-3123 #new-spell-mech-fields:3124-3128 #new-spell-mech-dmg-row:3129-3148 #new-spell-mech-half-row:3149-3151 #new-spell-mech-mod-row:3152-3162  
#subclass-modal:3163-3174 #subclass-features:3175-3183 #item-modal:3184-3228 #item-armor-fields:3229-3254 #coin-exchange-modal:3255-3293 #exch-preview:3294-3300 #screen-magiccatalog:3301-3328 #magic-catalog-count:3329-3329  
#magic-catalog-list:3330-3333 #screen-gearcatalog:3334-3338 #gear-packs-list:3339-3352 #gear-catalog-count:3353-3353 #gear-catalog-list:3354-3358 #weapon-modal:3359-3362 #weapon-picker-section:3363-3365 #weapon-filter-chips:3366-3375  
#weapon-presets-list:3376-3376 #weapon-pick-bar:3377-3440 #rd-quick-dock:3441-3441 #character-tabs:3442-3460 #quick-roll-strip:3461-3466 #qrs-list:3467-3477 #active-effects-panel:3478-3482 #aef-list:3483-3489  
#hp-toast-container:3490-3492 #add-companion-modal:3493-3509 #companion-familiar-row:3510-3530 #mob-sheet:3531-3534 #mob-sheet-list:3535-3538 #confirm-modal:3539-3552 #avatar-modal:3553-3556 #avatar-modal-preview:3557-3584  
#screen-builds:3585-3612 #bp-list:3613-3617 #screen-buildguide:3618-3620 #bg-body:3621-3625 #screen-buildplan:3626-3628 #bp-plan-body:3629-3633 #screen-abilityinfo:3634-3636 #ai-body:3637-3641  
#screen-abilgen:3642-3644 #ag-body:3645-3649 #screen-books:3650-3652 #books-body:3653-3657 #screen-mclayout:3658-3660 #ml-body:3661-3665 #screen-featureinfo:3666-3668 #fi-body:3669-3673  
#screen-creator:3674-3676 #cr-progress:3677-3677 #cr-body:3678-3688 #app-log-panel:3689-3708 #app-log-list:3709-3891 #notes-entry-modal:3892-3940  

## Функции по файлам (`имя:строка`)

**rules.js** (1828 строк, 122 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:346 rulesClassSaveProf:355 rulesAttuneLimit:361 rulesSoulOfArtifice:367 rulesSaveBonus:372 rulesDivineSmiteFormula:381 rulesSkillBonus:388 rulesPassivePerception:403 rulesSpellStats:407 _spellStatMod:434 rulesSpellStatsByClass:442 rulesWeaponMods:460 rulesOffhandDamageMod:476 armorPenalties:485 rulesItemArmor:500 rulesArmorItem:512 rulesAC:523 charCasterLevel:705 classSpellSlotRow:749 getMulticlassSpellSlots:762 rulesRestoreLevelFields:798 rulesApplySpellSlots:817 resolvePactSlots:840 restoreItemCharges:850 rulesHitDieSides:867 rulesShortRest:873 rulesLongRestBlockReason:908 rulesLongRest:921 rulesExhaustionLevel:993 rulesEffectiveHpMax:999 _dsReset:1004 _dsCount:1005 _dsFill:1006 _condAdd:1007 _condRemove:1008 rulesIsDead:1010 rulesIsStable:1014 rulesRegainFromZero:1019 rulesSetHp:1025 rulesDamageAfterDefenses:1037 rulesApplyDamage:1049 rulesDeathSaveBlockReason:1086 rulesDeathSave:1093 rulesConditionRollMods:1112 rulesEffectiveSpeed:1129 rulesArmorStealthDisadv:1150 rulesFeatPrereqMissing:1159 rulesFeatStatChoice:1186 rulesFeatStatOptions:1194 rulesFeatSlotCount:1207 rulesFeatSpellFits:1212 rulesFeatSpellCandidates:1223 rulesFeatSpellLabel:1227 rulesFeatSpellProgress:1232 rulesFeatClassOptions:1257 rulesFeatFreeResId:1270 rulesResetFeatFree:1273 concSaveParams:1284 rulesCrToXp:1326 rulesCrToProf:1332 rulesCrValue:1339 rulesWildShapeLimits:1350 rulesPolymorphLimits:1374 rulesCombatWildShapeHeal:1379 rulesBeastAllowed:1384 rulesFormStart:1391 rulesFormOwnHp:1405 rulesFormDamage:1410 rulesFormHeal:1425 rulesEncounterMultiplier:1432 rulesEncounterDifficulty:1441 getCharClassPairs:1465 charEditionMismatch:1479 findLangInCatalog:1487 ensureLanguagesArray:1499 recalcLanguagesFromSources:1515 add:1520 findToolInCatalog:1565 ensureToolsArray:1577 getBackgroundDef:1598 validateBgStatChoice:1634 parseBackgroundToolEntry:1654 recalcToolsFromSources:1669 add:1674 ensureArmorWeaponFields:1739 recalcArmorWeaponFromSources:1752 addArmor:1758 addWeapon:1759 addSpec:1808

**app-asi.js** (906 строк, 43 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:574 removeFeat:633 featSkillPick:662 _agBonus:697 _agPbSpent:707 _agBase:713 _agReady:720 openAbilGen:725 _agInit:735 agSetMode:748 agPb:754 _agSwap:764 agStd:771 agPick:777 agRoll:783 _agCtl:796 owner:807 _agRender:822 agApply:879 _agCommit:887

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-builds.js** (1763 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1129 openBuildGuide:1160 gx:1183 _list:1184 getBuildLevelRec:1247 getBuildRecChoiceOption:1252 getBuildRecChoiceIds:1260 getBuildRecFeat:1265 getBuildRecAsi:1275 getBuildRecSubclass:1282 parseAsiFromHeadline:1290 _buildFeatNameMap:1304 parseFeatFromHeadline:1346 parseSpellsFromHeadline:1363 getBuildRecSpellObjs:1609 openBuildPlan:1629 _cpSubclassOf:1682 _cpClassSwitch:1693 openClassPlan:1708

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-combat.js** (3451 строк, 155 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollInitiative:148 rollSkillCheck:159 initSaves:178 autoSelectProficiencies:213 initSkills:256 toggleAbilOpen:284 abilityBreakdown:296 openAbilityInfo:324 toggleExpertise:359 loadExpertise:378 updateSkillProfCount:392 updateSkillSources:404 updateClassFeatures:428 calculateAC:443 toggleInspiration:504 updateStatusCounter:517 updateStatusBar:531 updateInspirationLabels:573 updateStatDisplay:590 updateAllStatDisplays:595 adjustStat:599 adjustCoin:622 renderCoinMob:636 openCoinSheet:646 setCoinFromSheet:656 updateCoinTotal:663 openCoinExchange:675 closeCoinExchange:680 previewExchange:684 coinExchangeCalc:712 confirmExchange:717 updateSubclassOptions:740 updateSubclassRecHint:804 featHpPerLevel:819 featHpFlat:828 recalculateHP:837 updateChar:892 toggleProficiency:959 calcStats:982 setSpellStat:1053 calcSpellStats:1064 _toggleNonCasterCards:1116 showSpellCasterCards:1127 onRaceChange:1135 renderBooksRow:1270 openMobSheet:1297 closeMobSheet:1304 mobSheetActs:1306 openBooksSheet:1311 toggleCharBook:1321 populateRaceSelect:1338 _speciesEffective:1371 _renderSpeciesBar:1384 _speciesChoiceOptions:1399 toggleSpeciesChoice:1406 syncSpeciesSpells:1420 rollRandomName:1466 pick:1474 build:1475 _raceSkillAllowance:1542 _raceFlexCount:1552 _raceFlexFits:1558 _raceFlexApply:1565 _setExtrasHtml:1575 renderRaceExtras:1584 toggleHalfElfStat:1755 toggleRaceFlexStat:1781 setRaceVariableTrait:1811 _raceSkillSet:1828 _pickHide:1838 _pickExpandBtn:1842 pickExpand:1845 raceLangGoto:1852 toggleRaceSkill:1860 _classSkillList:1889 _skillsFromOtherSources:1902 _skillsByName:1911 _skillTakenElsewhere:1917 _classSkillHeld:1931 _classSkillSync:1937 renderClassSkills:1968 toggleClassSkill:2015 openRaceFeatModal:2043 removeRaceFeat:2063 applyBasicLockUI:2098 _cwEditionBusy:2132 syncCwEdition:2137 setDraftEdition:2149 updateLockButtonState:2159 lockBasicInfo:2197 unlockBasicInfo:2218 isSheetLocked:2248 sheetLockGuard:2254 applySheetLockUI:2260 _creationTodo:2291 add:2295 src:2296 scheduleCreationTodo:2387 renderCreationTodo:2392 creationTodoGo:2419 openLockSheet:2431 _creationUiReset:2444 _isMobSheet:2445 renderIdentitySummary:2446 toggleIdentityMore:2465 renderProfSummary:2469 toggleProfCard:2484 openAcSheet:2490 _mobMarkClamp:2498 init:2507 lockSheet:2528 doLock:2532 unlockSheet:2545 onBackgroundChange:2566 _bgSkillsOf:2611 _bgUncheckOld:2618 _bgCheckSkills:2626 renderBackgroundFeature:2638 _bgStatShort:2683 populateBackgroundSelect:2686 _bgRevertStatChoice:2717 _bgAppliedStat:2730 _bgApplyStat:2735 setBgStatMode:2747 toggleBgStat:2759 _bgAfterStats:2782 _bgRevertFeatEffects:2793 syncOriginFeat:2818 toggleBgCustom:2854 _toggleBgCustom14:2894 toggleBgSkillPick:2941 _renderBgCustom14:2968 giveBackgroundEquipment:3005 renderBackgroundExtras:3050 _armorFromSelect:3158 renderArmorSelect:3170 onArmorPick:3205 onShieldPick:3219 onArmorChange:3238 onManualAC:3267 onManualMaxHP:3274 calcCoinWeight:3297 getActiveConditionsForRender:3311 toggleConditionsPopup:3340 closeConditionsPopup:3352 renderConditionsPopup:3358

**app-conditions.js** (505 строк, 28 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:303 loadConditions:312 refreshSaveBonuses:321 _fxMatches:338 setEffectsSearch:343 setEffectsType:344 toggleEffectsActiveOnly:352 renderEffectsGrid:358 initEffects:441 toggleEffect:461 updateEffectsCount:490 loadEffects:499

**app-core.js** (1969 строк, 97 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:577 _screenGhostDrop:583 _screenGhostStart:595 _screenEnter:613 _purgeDraftChars:624 showScreen:637 updateHeaderTitle:752 syncDrawerHeader:806 switchTab:818 _rdSheetView:857 openDrawer:876 closeDrawer:889 showCharacterNav:901 hideCharacterNav:909 isInteractive:929 currentActiveTab:952 scrolledDown:1017 closeAction:1024 reset:1031 end:1064 createNewCharacter:1084 getClassColor:1107 getClassIcon:1123 getAbilityIcon:1130 getConditionIcon:1145 getConditionChipIcon:1169 getSpellClassIcon:1187 getSchoolSlug:1204 getSchoolIcon:1208 stripLeadingEmoji:1221 formatTimeAgo:1225 setCharSort:1239 setCharSearch:1246 duplicateCharacter:1250 exportOneCharacter:1262 toggleCharSelectMode:1274 _charSelectedList:1283 _updateCharSelectBar:1286 toggleCharSelected:1303 charSelectAll:1307 _charSelectEmptyToast:1312 exportSelectedCharacters:1315 duplicateSelectedCharacters:1322 deleteSelectedCharacters:1337 updateCharCounter:1355 onDragStart:1372 onDragOver:1373 onDrop:1374 renderCharacterList:1385 renderCharPlate:1479 deleteCharacter:1542 showConfirmModal:1556 safeSet:1603 safeSetChecked:1607 loadCharacter:1616 showToast:1809 showFieldError:1826 clearFieldError:1848 toastAddAction:1858 emptyStateHtml:1876 openHPHistory:1887 closeHPHistory:1915 updateVersionBlock:1920 forceAppUpdate:1951

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

**app-notes.js** (1530 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:455 notesPickRandomVariant:460 _applyVariantToSection:473 _setSectionText:487 _mdToHtml:502 closeLists:514 _countStats:554 _bindSectionInputs:561 _updateStats:574 _notesHotkeys:583 notesMdInsert:598 wrap:607 linePrefix:614 notesTogglePreview:664 notesUpdateSection:683 _syncTakenFeatsLocation:698 _renderEntriesView:711 _renderEntryCard:766 notesPinDragStart:813 notesPinDragOver:823 notesPinDragLeave:832 notesPinDrop:837 notesPinDragEnd:847 _notesReorderPinned:856 notesSetTagFilter:884 notesJumpToNpc:890 notesOpenEntryModal:918 notesCloseEntryModal:953 _notesRenderModalTags:958 notesAddModalTag:970 notesModalTagKeydown:980 notesRemoveModalTag:984 notesSaveEntryModal:990 notesDeleteEntry:1038 notesTogglePin:1059 _notesLogJournal:1094 notesSearchInput:1120 notesSearchKeydown:1127 _hlText:1145 _renderSearchResults:1155 notesClearSearch:1234 notesToggleMenu:1245 _notesMenuClose:1258 notesMenuAction:1264 _notesCharName:1279 _notesTriggerDownload:1284 notesExportMd:1292 notesExportJson:1337 _notesSanitizeEntry:1349 _notesFileTooBig:1360 notesHandleImportJson:1368 _notesApplyImport:1389 notesHandleImportMd:1429 notesPrint:1465 _notesFlashSaved:1496

**app-party.js** (2378 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2365 switchDmRef:2369

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-proficiencies.js** (645 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:380 addCustomTool:397 removeCustomTool:424 renderArmorProf:443 renderWeaponProf:493 addCustomArmorType:557 removeCustomArmorType:573 addCustomWeaponType:585 removeCustomWeaponType:600 addCustomSpecificWeapon:611 removeCustomSpecificWeapon:632

**app-progress.js** (1071 строк, 65 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:310 _pgNext:326 _pgClassWord:380 _pgAvailableClasses:389 _pgActions:402 _pgBuild:420 openProgressTab:433 openProgress:443 pgTabActive:454 pgRefresh:461 pgSetSubclass:469 pgFocusSubclass:484 pgLevelUp:501 pgLevelDown:506 pgAfterLevelModal:512 pgAddClass:523 renderClassDev:537 _pgSheetAboutRow:556 _pgSubclassRows:574 syncClassFieldUI:600 _pgOwnSubclasses:646 pgEditSubclass:656 _subclassRecord:661 _subclassUnlock:666 _subclassClasses:671 _subclassPicked:677 _subclassRepick:682 subclassFormClassChanged:691 subclassAddFeature:697 subclassRemoveFeature:716 openSubclassForm:721 closeSubclassForm:747 _subclassFormDone:752 submitSubclassForm:760 deleteSubclassForm:794 openFeatureInfo:815 _fiRuleNotes:859 _mlTotal:898 _mlMissing:903 openMcLayout:909 mlSetClass:921 mlLevel:929 mlSetSub:938 mlAdd:943 mlRemove:949 _mlRender:955 _mlPruneAsi:1020 mlApply:1031

**app-settings.js** (898 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:113 _accentForClass:125 _applyClassAccent:128 _refreshAccent:131 setAutoAccent:139 _syncAutoAccentToggle:144 getEdition:160 setEdition:168 _syncEditionButtons:177 _getStatsLayout:194 _applyStatsLayout:201 _statsInCards:208 _statsRowTarget:212 _placeStatRows:230 setStatsLayout:246 _syncStatsLayoutButtons:253 _getSheetLock:267 setSheetLock:271 _syncSheetLockButtons:276 _wakeLockSupported:287 _getWakeLockOn:288 _applyWakeLock:292 setWakeLock:307 _syncWakeLockButtons:312 _getHeaderAutohideOn:322 setHeaderAutohide:325 _syncHeaderAutohideButtons:330 _getTrackXpOn:338 _applyTrackXp:341 setTrackXp:344 _syncTrackXpButtons:349 _getAttackDamageOn:370 setAttackDamage:373 _syncAttackDamageButtons:377 isEditionSplit:386 setEditionSplit:389 _syncEditionSplitButtons:394 openBooksScreen:404 _bookRowHtml:408 _renderBooksScreen:418 setBookOn:443 setBooksPreset:449 _afterBooksChange:456 _syncBooksSummary:468 _getStatsCollapsed:482 _applyStatsCollapsed:485 toggleStatsCollapsed:490 _getStoredDensity:504 _getDefaultDensity:512 _getDensity:519 _applyDensity:522 setDensity:526 _syncDensityButtons:532 _onViewportDensityChange:540 _getFontScale:558 _applyFontScale:565 setFontScale:576 _syncFontScaleUi:587 _getGlassAlpha:602 _getGlassBlur:609 _applyGlassAlpha:616 _applyGlassBlur:617 setGlassAlpha:618 setGlassBlur:628 _syncGlassUi:637 _getSpaceMode:686 _applySpaceBg:693 setSpaceMode:708 _syncSpaceButtons:714 _spaceOnScroll:733 _applyDymkaIcons:761 _initAppLinks:774 openSupportLink:806 _isStandalone:818 _isIos:824 _installMode:828 _syncInstallUi:833 installApp:846 openSettingsModal:870 closeSettingsModal:885

**app-sheet2.js** (572 строк, 27 функций)  
esc:15 fm:20 abName:21 listText:22 ensureNodes:30 render:83 build:104 hpBlock:238 restBlock:265 atkRow:273 weaponsBlock:284 diceBlock:296 slotsBlock:306 condBlock:322 buildBattle:328 buildRail:332 buildPersona:337 buildSpellHead:348 classFeatures:362 classResources:411 rollsHtml:446 closePop:467 outside:475 onKey:476 openPop:477 poolFormula:533 schedule:557

**app-spells.js** (2277 строк, 113 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:165 adjustPactSlots:176 syncSpellSlotsFromClass:188 updateSpellSlots:197 toggleSpellSlot:208 adjustSpellSlots:219 restoreAllSlots:230 setSpellVersion:241 _syncSpellVersionLock:252 setSpellClass:261 _charIsThirdCaster:270 _charSpellClassKey:276 _charMaxCastableLevel:288 _defaultSpellVersion:296 toggleSpellOnlyAdded:302 _renderSpellOnlyAdded:306 openSpellSearch:314 markCharOwnClassFilter:336 closeSpellSearch:365 _featPickCtx:376 featAddFixedSpells:391 openFeatSpellPicker:417 _featPickProgressText:434 _renderFeatPickBar:440 featPickSetClass:461 _featPickCandidates:469 _renderFeatPickList:479 addFeatSpell:510 removeFeatSpell:530 _parseSpellClassList:553 _syncNewSpellClassChips:557 toggleNewSpellClass:564 _fillNewSpellDamageTypes:589 _toggleHidden:596 updateNewSpellMechFields:604 _hbFormulaCheck:619 _collectHbEffect:628 _spellIdArg:666 _findHomebrewSpell:672 openAddSpellForm:680 _syncCustomSpellAcrossChars:759 _purgeCustomSpellFromChars:777 deleteCustomSpell:796 _deleteCustomSpellConfirmed:805 closeAddSpellForm:819 submitNewSpell:823 renderSpellSearch:913 spellCompRu:987 addSpell:992 removeSpell:1016 toggleSpellCard:1030 renderMySpells:1035 _spellActiveBadgeText:1183 _spellActiveBadgeHtml:1187 updateSpellActiveBadges:1190 _prepEntries:1213 _spellPrepEntry:1231 _prepLimit:1236 calcMaxPrepared:1252 _known2014:1259 calcMaxKnownSpells:1274 _knownSpellCount:1280 calcMaxCantrips:1290 isPrepClass:1299 _subclassSpellNames:1305 syncSubclassSpells:1338 spellNeedsPrep:1365 _preparedCount:1381 openSpellCardsMenu:1389 isSpellPrepared:1404 toggleSpellPrepared:1414 renderPrepCounter:1440 _castableSlotOptions:1493 _wizardPick:1518 _spellMasteryFree:1521 _signatureResId:1526 _arcanumResId:1533 castSpell:1543 _castSpellWithSlot:1564 _finishCast:1612 applyCastEffects:1662 _applyCastForm:1699 openCastVariantChooser:1712 pickCastVariant:1751 closeCastVariantChooser:1761 _applyCastSummon:1774 _nextCastInstanceId:1808 _replaceCastInstance:1816 _ensureCastInstance:1846 _applyCastDamage:1866 _rollCastDamage:1893 _startCastRepeat:1963 castRepeatDamage:1977 _applyCastDebuff:2002 castSpellAttackMod:2043 castStatMod:2051 _agonizingBonus:2073 _applyCastHeal:2092 _castHealApply:2113 _applyCastTempHp:2119 applyCastTempHp:2136 _applyCastHpMaxBonus:2150 openCastChooser:2170 closeCastChooser:2191 canCastAsRitual:2204 castRitual:2226 cancelRitual:2265

**app-sync.js** (691 строк, 46 функций)  
_syncLog:22 _syncEnabled:26 _syncRedirectUri:30 _syncDevice:34 _syncGetAuth:41 _syncSetAuth:48 _syncTokenValid:55 syncSignIn:59 syncSignOut:74 syncTurnOff:85 _syncConsumeHash:106 _driveFetch:141 _driveList:155 _driveFind:162 _driveRead:166 _syncCheckDoc:175 _driveWrite:185 _syncLoadState:202 _syncSaveState:210 syncTombstone:214 _syncExpired:222 syncSchedule:228 _syncUserSpells:235 _syncHashes:240 _syncKeepLive:250 _syncNameDupes:270 _syncAskDupes:277 _syncDestructive:288 lost:289 _syncApply:297 _syncFixChar:327 _syncMergeExtra:332 _syncRun:343 syncNow:411 syncOverwrite:465 _syncStable:475 _syncHashStr:483 syncHashChar:492 _syncClone:494 _syncUnpackChar:496 _syncPackChar:502 _syncMergeList:508 syncMerge:540 _syncBtn:634 _syncTimeLabel:643 renderSyncRow:650

**app-ui.js** (1540 строк, 96 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:180 animateCountUp:186 tick:194 _reportError:217 swProgressToast:248 swProgressToastRemove:261 swInstallFailed:265 swWatchFirstInstall:278 swRegister:308 swTelegramBlock:343 swSupportBlock:354 showUpdateModal:366 later:392 onKey:399 checkWhatsNew:409 showWhatsNewModal:421 toggleAccordion:458 initCharResources:478 getResourceMax:487 getCharResourceDefs:508 currentDieSize:538 crRow:550 crRestoreLabel:563 crResourceRow:579 crRecoveryHint:642 crResName:647 crFlexActs:656 _crFlexContext:675 _crFlexDone:685 flexSlotToPoints:692 flexPointsToSlot:706 crPointRecoveryAmount:725 crPointRecoveryActs:730 recoverPointsByResource:736 crPortentRolls:756 crPortentMeta:760 crPortentActs:766 _crPortentContext:772 crRollPortent:782 usePortent:789 crSlotRecoveryBudget:804 crSlotRecoveryActs:808 recoverSlotByResource:823 crPassiveNotes:849 rollSneakAttack:858 rollResourceDie:882 crManeuverRows:901 crRowsHtml:918 crSetRows:955 renderClassResources:970 spendResource:988 resetResource:1006 toggleResourcePip:1016 resourceRollOnSpend:1041 resetResourcesByRest:1054 getJournal:1104 addJournalEntry:1109 filterJournal:1131 renderJournal:1138 deleteJournalEntry:1174 openAddJournalEntry:1183 closeAddJournalEntry:1188 saveJournalEntry:1191 getCompanions:1211 renderCompanions:1216 companionHP:1261 buildFamiliarFormOptions:1274 onCompanionTypeChange:1286 applyFamiliarForm:1294 openAddCompanionModal:1306 summonFamiliar:1323 openPrefilledCompanionModal:1333 openEditCompanionModal:1344 closeAddCompanionModal:1364 saveCompanion:1367 deleteCompanion:1392 switchProfilesTab:1408 clipChangelogText:1423 expandChangelogItem:1434 clCleanText:1446 renderChangelog:1452 openItemRef:1497 closeItemRef:1503 switchItemRef:1508 _syncHeaderHeight:1526

**app-wiki.js** (856 строк, 71 функций)  
_wikiPlural:33 _wikiLoreCount:37 wikiRegister:64 wikiCrumbs:71 _wikiCrumbGo:94 wikiExit:97 _wikiRecentGet:101 wikiRecentPush:105 _wikiRecentOpen:110 wikiEdition:118 wikiEdData:125 setWikiEdition:127 openWiki:132 _wikiNorm:142 _wikiHelpTabs:145 _wikiHelpHits:159 wikiUpdateHelpLink:180 openWikiLore:200 _wikiRow:202 _wikiGo:211 wikiJump:212 _wikiHubItems:217 renderWiki:226 _wikiClassNames:325 _wikiClassSource:333 _wikiProfList:339 _wikiToolsText:348 openWikiClasses:355 openWikiClass:361 wikiClassBack:371 setWikiClassEdition:375 _wikiCRow:383 _wikiCGo:391 _wikiFact:393 _wikiFeatureRows:400 renderWikiClass:411 _wikiSrcLabel:514 _wikiLoreList:519 _wikiFeatByName:530 _wikiLoreEnsure:537 _wikiLoreOpen:543 openWikiRaces:554 openWikiBackgrounds:555 openWikiFeats:556 wikiLoreBack:558 setWikiLoreEdition:562 _wikiLRow:570 _wikiLGo:578 _wikiStatsText:580 _wikiPara:585 _wikiRaceSource:594 _wikiMeters:598 _wikiRacePage:603 _wikiBgPage:626 _wikiFeatPage:646 renderWikiLore:657 _wikiLoreSearch:697 _wikiCondName:715 _wikiParaBr:718 _wikiCondPage:728 _wikiGlossMap:735 add:737 _wikiGlossPage:750 _wikiAbilPage:756 _wikiOptDict:765 _wikiOptGroup:778 _wikiOptReq:783 _wikiOptPage:793 wikiOpenGloss:805 wikiOpenMyClass:813 _wikiGlossSearch:821

**app-wildshape.js** (319 строк, 27 функций)  
wsBeast:12 wsChargesLeft:18 wsSpeedText:27 wsCrText:36 wsLimitsText:40 wildShapeStatBlock:53 wsEnsureBeasts:72 wsFormLine:80 renderWildShape:89 wsSlotHeal:139 wsSlotHealRow:147 wildShapeSlotHeal:154 wsLimits:171 openPolymorphPicker:174 openWildShapePicker:180 wsOpenPicker:186 closeWildShapePicker:194 wsSetSearch:197 wsPickRow:199 wsBtn:204 renderWildShapePicker:208 wildShapeLearn:241 wildShapeForget:249 wildShapeAssume:257 polymorphAssume:275 polymorphEnd:291 wildShapeExit:300

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (8678 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:129 SAVES_DATA:151 CONDITIONS:160 EFFECTS_DATA:183 CLASS_FEATURES:234 SPELL_PREP_CLASSES:505 CANTRIPS_KNOWN_2014:514 SPELLS_KNOWN_2014:525 SPELL_SLOTS_BY_LEVEL:534 CLASS_HIT_DICE:618 SUBCLASSES:625 SOURCE_LABELS:646 SUBCLASS_SOURCE:673 SUBCLASS_CREDIT:733 BOOK_CODES:752 _booksOffCache:755 CLASS_SOURCE:808 SUBCLASS_LEVEL:824 SUBCLASS_FEATURES:841 WEAPON_PRESETS:1664 ITEM_ICONS:1708 CATEGORY_NAMES:1709 GEAR_PACKS:1718 RACE_DATA:1813 BACKGROUND_SKILLS:2430 BACKGROUND_ALIASES:2509 DEITY_ALIGN_LABELS:2522 DEITIES_DATA:2527 LANGUAGE_CATALOG:2595 RACE_LANGUAGES:2632 CLASS_LANGUAGES:2734 TOOL_CATALOG:2740 RACE_TOOLS:2796 CLASS_TOOLS:2808 SUBCLASS_LANGUAGES:2817 SUBCLASS_TOOLS:2840 RACE_ARMOR:2868 RACE_WEAPONS_SPECIFIC:2874 CLASS_WEAPONS_SPECIFIC:2890 RACE_NAME_POOLS:2903 RACE_NAME_GROUP:2945 SUBCLASS_ARMOR:2960 ARMOR_PRESETS:2995 skills:3012 ABILITY_INFO:3025 CLASS_SKILL_OPTIONS:3065 CLASS_SKILL_COUNT:3081 CLASS_SKILL_MC_COUNT:3082 CLASS_ARMOR_PROFS:3085 CLASS_RESOURCES:3106 ASI_LEVELS:3294 XP_THRESHOLDS:3302 APP_VERSION:3312 APP_VERSION_DATE:3313 APP_TELEGRAM_URL:3319 APP_BOOSTY_URL:3320 FEATS_DATA:3341 APP_CHANGELOG:3664 CASTER_TYPE:8476 THIRD_CASTER_SUBCLASSES:8486 THIRD_CASTER_SLOTS:8493 MULTICLASS_SPELL_SLOTS:8504 MULTICLASS_PREREQUISITES:8529 MULTICLASS_PROFICIENCIES:8548 EDITION_DATA:8578

**spells.js** (13819 строк)  
SPELLS_BASE:7

**spell-effects.js** (881 строк)  
SPELL_EFFECTS:71

**class-choices.js** (844 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 ARTIFICER_INFUSIONS:106 ARTIFICER_REPLICA_ITEMS:125 CLASS_CHOICES:184 ccModalState:542

**subclass-choices-data.js** (1180 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 LIVING_WEAPON_DISCIPLINES:134 LIVING_WEAPON_PERFECT_FORM:140 RUNE_KNIGHT_RUNES:148 ARCANA_CANTRIPS:166 ARCANA_MASTERY:167 GIANT_CANTRIPS:178 ARMORER_MODELS:182 SUBCLASS_CHOICES:187 SUBCLASS_RESOURCES:474

