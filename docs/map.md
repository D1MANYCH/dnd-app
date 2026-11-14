# Карта кода

Сгенерировано `node tools/gen-map.js` — руками не править, перегенерировать после
крупных правок `style.css`, `index.html` или добавления функций.

Как пользоваться: найти нужный диапазон здесь → `Read` с `offset`/`limit` по нему,
вместо чтения файла целиком или разведочных grep. Сам этот файл тоже читается
диапазонами — оглавление ниже указывает строки внутри map.md.

## Оглавление

| Раздел / файл | Строки в map.md |
|---|---|
| style.css — секции | 54–163 |
| index.html — блоки верхнего уровня (`#id:строки`) | 164–208 |
| Функции по файлам (`имя:строка`) | 209–297 |
|   rules.js | 211–213 |
|   app-asi.js | 214–216 |
|   app-backup.js | 217–219 |
|   app-builds.js | 220–222 |
|   app-cast-effects.js | 223–225 |
|   app-combat.js | 226–228 |
|   app-conditions.js | 229–231 |
|   app-core.js | 232–234 |
|   app-creator.js | 235–237 |
|   app-desktop.js | 238–240 |
|   app-dice.js | 241–243 |
|   app-help.js | 244–246 |
|   app-home.js | 247–249 |
|   app-hp.js | 250–252 |
|   app-inventory.js | 253–255 |
|   app-io.js | 256–258 |
|   app-log.js | 259–261 |
|   app-migrate.js | 262–264 |
|   app-notes.js | 265–267 |
|   app-party.js | 268–270 |
|   app-pdf.js | 271–273 |
|   app-proficiencies.js | 274–276 |
|   app-progress.js | 277–279 |
|   app-settings.js | 280–282 |
|   app-sheet2.js | 283–285 |
|   app-spells.js | 286–288 |
|   app-sync.js | 289–291 |
|   app-ui.js | 292–294 |
|   app-wildshape.js | 295–297 |
| Данные — константы верхнего уровня (`имя:строка`) | 298–314 |
|   data.js | 300–302 |
|   spells.js | 303–305 |
|   spell-effects.js | 306–308 |
|   class-choices.js | 309–311 |
|   subclass-choices-data.js | 312–314 |


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
| 6035–6165 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6166–6204 | HP TOAST (snackbar) |
| 6205–6238 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 6239–6295 | Confirm Modal |
| 6296–6673 | ⚔️ ОТРЯД & БОЙ |
| 6674–6905 | RACIAL BONUS BAR |
| 6906–7054 | COMPACT STATS GRID |
| 7055–7306 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 7307–7359 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 7360–7407 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 7408–7510 | COMPACT SKILLS |
| 7511–7553 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 7554–7625 | ACCORDION |
| 7626–7632 | CLASS RESOURCES |
| 7633–7729 | ASI MODAL |
| 7730–7897 | APP VERSION |
| 7898–7907 | COMPANIONS |
| 7908–7948 | FEATS LIST IN ASI |
| 7949–8194 | PROFILES TABS (Чейнджлог) |
| 8195–8270 | TAKEN FEATS |
| 8271–8463 | SW UPDATE MODAL |
| 8464–8515 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8516–8683 | INVENTORY SLOTS SYSTEM |
| 8684–8888 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 8889–9101 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9102–9250 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9251–9320 | 3D DICE CUBE |
| 9321–9663 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9664–9737 | DESKTOP LAYOUT — centered max-width |
| 9738–9761 | INSPIRATION |
| 9762–9801 | CONCENTRATION |
| 9802–10319 | WEAPON CARDS WITH ROLL BUTTONS |
| 10320–10414 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10415–10475 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10476–10497 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10498–10610 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10611–10638 | R6: Ассеты (декор) |
| 10639–11507 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11508–11591 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11592–11600 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11601–11658 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11659–11975 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 11976–12002 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 12003–12029 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 12030–12112 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12113–13114 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13115–13170 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13171–13266 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13267–13598 | DISC-1 · Ромб раскрытия |
| 13599–14133 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14134–14245 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14246–14381 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14382–14582 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14583–14591 | STYLE-8b3-fix: срезанный ромб |
| 14592–14859 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14860–15320 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15321–15355 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15356–17044 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:93-94 #conditions-popup-overlay:95-95 #conditions-popup:96-100 #conditions-popup-list:101-104 #drawer-overlay:105-106 #side-drawer:107-144 #screen-settings:145-236 #header-autohide-row:237-253  
#wake-lock-row:254-284 #edition-row:285-307 #install-row:308-318 #welcome-modal:319-323 #welcome-step-1:324-342 #welcome-step-2:343-377 #header-avatar:378-383 #status-bar:384-387  
#status-inspiration:388-388 #status-concentration:389-391 #status-ritual:392-394 #status-conditions-btn:395-408 #screen-home:409-411 #home-art:412-439 #home-sub-new:440-487 #home-install:488-495  
#home-hero:496-496 #home-hero-emblem:497-500 #home-hero-sub:501-501 #home-hero-chips:502-512 #screen-characters:513-532 #char-select-bar:533-560 #char-hero:561-561 #char-hero-emblem:562-565  
#char-hero-sub:566-566 #char-hero-chips:567-567 #char-hero-actions:568-576 #screen-data:577-593 #backup-panel:594-598 #backup-list:599-600 #sync-row:601-601 #storage-status:602-613  
#screen-about:614-617 #app-version-row:618-625 #ptab-info:626-633 #app-links-row:634-637 #app-legal-note:638-643 #ptab-changelog:644-649 #changelog-list:650-656 #screen-character:657-657  
#tab-sheet:658-660 #creation-wizard-banner:661-668 #cw-edition-row:669-678 #cw-validation:679-681 #basic-locked-bar:682-691 #creation-todo:692-701 #sheet-avatar:702-714 #char-build-badge-wrap:715-729  
#char-class-mc:730-754 #char-subclass-rec:755-755 #char-subclass-mc:756-964 #char-books:965-969 #race-bonus-display:970-970 #race-extras-panel:971-971 #class-skills-panel:972-973 #background-feature-display:974-975  
#bg-extras-panel:976-1019 #abilgen-row:1020-1026 #stats-collapse-btn:1027-1034 #abilities-region:1035-1038 #proficiency-bonus-2024:1039-1040 #insp-card-2024:1041-1050 #abil-col-1:1051-1051 #stat-block-str:1052-1053  
#mod-str:1054-1060 #abil-save-slot-str:1061-1061 #abil-skills-slot-str:1062-1064 #stat-block-dex:1065-1066 #mod-dex:1067-1073 #abil-save-slot-dex:1074-1074 #abil-skills-slot-dex:1075-1077 #stat-block-int:1078-1079  
#mod-int:1080-1086 #abil-save-slot-int:1087-1087 #abil-skills-slot-int:1088-1091 #abil-col-2:1092-1092 #stat-block-con:1093-1094 #mod-con:1095-1101 #abil-save-slot-con:1102-1102 #abil-skills-slot-con:1103-1105  
#stat-block-wis:1106-1107 #mod-wis:1108-1114 #abil-save-slot-wis:1115-1115 #abil-skills-slot-wis:1116-1118 #stat-block-cha:1119-1120 #mod-cha:1121-1127 #abil-save-slot-cha:1128-1128 #abil-skills-slot-cha:1129-1142  
#saves-grid:1143-1152 #skills-container:1153-1155 #passive-perception:1156-1175 #ws-hp-banner:1176-1181 #hp-dmg-row:1182-1191 #hp-dmg-body:1192-1212 #death-saves-section:1213-1244 #hp-armor-body:1245-1286  
#hp-hd-body:1287-1300 #hp-rest-body:1301-1328 #class-dev-section:1329-1331 #cd-head:1332-1332 #cd-res:1333-1333 #cd-attn:1334-1335 #cd-about:1336-1344 #ac-formula:1345-1346  
#ac-modifiers:1347-1354 #conditions-grid:1355-1362 #effects-grid:1363-1370 #resistances-container:1371-1379 #prof-card:1380-1383 #armor-prof-container:1384-1387 #weapon-prof-container:1388-1391 #tools-container:1392-1395  
#languages-container:1396-1403 #companions-list-sheet:1404-1416 #tab-progress:1417-1418 #pg-body:1419-1420 #tab-spells:1421-1423 #spell-stat-card:1424-1445 #spell-mod-display:1446-1451 #spell-dc-display:1452-1457  
#spell-attack-display:1458-1463 #spell-stats-by-class:1464-1475 #spell-slots-card:1476-1480 #spell-slots-visual:1481-1487 #concentration-block:1488-1505 #rd-find-spl-wrap:1506-1506 #prep-counter:1507-1507 #my-spells-list:1508-1509  
#rd-slot-strip:1510-1511 #tab-inventory:1512-1515 #rd-find-inv-wrap:1516-1532 #weight-fill:1533-1567 #inventory-list:1568-1572 #inv-coins-card:1573-1577 #rd-exch:1578-1588 #inv-pouches:1589-1644  
#tab-notes:1645-1671 #notes-subtabs:1672-1673 #notes-main:1674-1675 #taken-feats-section:1676-1680 #taken-feats-list:1681-1684 #tab-party:1685-1694 #my-char-card:1695-1708 #allies-list:1709-1723  
#npcs-list:1724-1739 #monsters-list:1740-1751 #companions-list-world:1752-1762 #tab-battle:1763-1768 #weapons-list:1769-1771 #ws-card:1772-1774 #saved-roll-form:1775-1781 #saved-roll-err:1782-1783  
#saved-rolls-list:1784-1787 #battle-res-card:1788-1789 #battle-res-rows:1790-1791 #battle-setup-screen:1792-1802 #battle-setup-list:1803-1803 #battle-difficulty:1804-1807 #battle-tracker-screen:1808-1812 #battle-turn-info:1813-1818  
#battle-repeat-strip:1819-1819 #battle-tracker-list:1820-1829 #tab-journal:1830-1844 #journal-list:1845-1851 #screen-itemref:1852-1854 #item-ref-tabs:1855-1860 #item-ref-weight:1861-1899 #item-ref-slots:1900-1931  
#screen-dmref:1932-1934 #dm-ref-tabs:1935-1939 #dm-ref-ed:1940-1940 #dm-ref-cond:1941-1941 #dm-ref-combat:1942-1942 #dm-ref-world:1943-1947 #screen-help:1948-1970 #help-about:1971-1994  
#help-start:1995-2019 #help-sheet:2020-2043 #help-progress:2044-2089 #help-spells:2090-2106 #help-inventory:2107-2119 #help-battle:2120-2144 #help-party:2145-2161 #help-notes:2162-2170  
#help-journal:2171-2179 #help-planes:2180-2207 #help-dice:2208-2219 #help-edition2024:2220-2259 #help-data:2260-2276 #help-marks:2277-2299 #conc-details-modal:2300-2310 #conc-detail-duration-row:2311-2318  
#conc-detail-desc-row:2319-2328 #add-journal-modal:2329-2352 #add-npc-modal:2353-2382 #add-ally-modal:2383-2420 #screen-monsters:2421-2433 #srd-monster-count:2434-2434 #srd-monster-results:2435-2439 #srd-npc-modal:2440-2449  
#srd-npc-count:2450-2450 #srd-npc-results:2451-2458 #screen-monsterform:2459-2496 #monster-cr-note:2497-2499 #monster-stats:2500-2501 #monster-saves:2502-2503 #monster-attacks:2504-2527 #screen-rest:2528-2530  
#rest-main-screen:2531-2532 #rest-card-short:2533-2535 #hit-dice-section:2536-2537 #hit-dice-controls-total:2538-2542 #hit-dice-by-size:2543-2548 #rest-card-long:2549-2551 #rest-food-section:2552-2562 #rest-result-screen:2563-2565  
#rest-result-details:2566-2574 #screen-levelup:2575-2579 #lu-screen-multiclass:2580-2581 #lu-mc-current-classes:2582-2584 #lu-mc-new-class:2585-2589 #lu-mc-prereq-warn:2590-2590 #lu-mc-subclass-row:2591-2599 #lu-screen-preview:2600-2632  
#lu-slots-card:2633-2634 #lu-slots-info:2635-2638 #lu-build-hint:2639-2639 #lu-features-container:2640-2648 #lu-screen-choices:2649-2650 #lu-choices-body:2651-2657 #lu-screen-result:2658-2659 #lu-result-title:2660-2660  
#lu-result-body:2661-2667 #screen-wildshape:2668-2673 #ws-limits:2674-2674 #ws-results:2675-2678 #screen-hphistory:2679-2681 #hp-history-list:2682-2687 #asi-modal:2688-2692 #asi-build-hint:2693-2707  
#asi-feat-list:2708-2708 #asi-stat-grid:2709-2709 #asi-preview:2710-2718 #class-choice-modal:2719-2734 #dice-modal:2735-2767 #dice-file-hint:2768-2768 #dice3d-result:2769-2780 #dice-result-display:2781-2794  
#dice-pick-hint:2795-2795 #dice-mode-segment:2796-2800 #dice-formula-panel:2801-2818 #dice-fan:2819-2827 #dice-popover-settings:2828-2875 #dice-popover-history:2876-2887 #dice-history:2888-2896 #screen-spellsearch:2897-2899  
#spell-feat-bar:2900-2915 #spell-ver-filter:2916-2922 #spell-class-filter:2923-2955 #class-filter-legend:2956-2957 #spell-search-count:2958-2959 #spell-search-results:2960-2963 #cast-spell-modal:2964-2968 #cast-spell-options:2969-2971  
#add-spell-modal:2972-3015 #new-spell-class-chips:3016-3062 #new-spell-mech-fields:3063-3067 #new-spell-mech-dmg-row:3068-3087 #new-spell-mech-half-row:3088-3090 #new-spell-mech-mod-row:3091-3101 #subclass-modal:3102-3113 #subclass-features:3114-3122  
#item-modal:3123-3167 #item-armor-fields:3168-3193 #coin-exchange-modal:3194-3232 #exch-preview:3233-3239 #screen-magiccatalog:3240-3267 #magic-catalog-count:3268-3268 #magic-catalog-list:3269-3272 #screen-gearcatalog:3273-3277  
#gear-packs-list:3278-3291 #gear-catalog-count:3292-3292 #gear-catalog-list:3293-3297 #weapon-modal:3298-3301 #weapon-picker-section:3302-3304 #weapon-filter-chips:3305-3314 #weapon-presets-list:3315-3315 #weapon-pick-bar:3316-3379  
#rd-quick-dock:3380-3380 #character-tabs:3381-3399 #quick-roll-strip:3400-3405 #qrs-list:3406-3416 #active-effects-panel:3417-3421 #aef-list:3422-3428 #hp-toast-container:3429-3431 #add-companion-modal:3432-3448  
#companion-familiar-row:3449-3469 #mob-sheet:3470-3473 #mob-sheet-list:3474-3477 #confirm-modal:3478-3491 #avatar-modal:3492-3495 #avatar-modal-preview:3496-3523 #screen-builds:3524-3551 #bp-list:3552-3556  
#screen-buildguide:3557-3559 #bg-body:3560-3564 #screen-buildplan:3565-3567 #bp-plan-body:3568-3572 #screen-abilityinfo:3573-3575 #ai-body:3576-3580 #screen-abilgen:3581-3583 #ag-body:3584-3588  
#screen-books:3589-3591 #books-body:3592-3596 #screen-mclayout:3597-3599 #ml-body:3600-3604 #screen-featureinfo:3605-3607 #fi-body:3608-3612 #screen-creator:3613-3615 #cr-progress:3616-3616  
#cr-body:3617-3627 #app-log-panel:3628-3647 #app-log-list:3648-3829 #notes-entry-modal:3830-3878  

## Функции по файлам (`имя:строка`)

**rules.js** (1828 строк, 122 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:346 rulesClassSaveProf:355 rulesAttuneLimit:361 rulesSoulOfArtifice:367 rulesSaveBonus:372 rulesDivineSmiteFormula:381 rulesSkillBonus:388 rulesPassivePerception:403 rulesSpellStats:407 _spellStatMod:434 rulesSpellStatsByClass:442 rulesWeaponMods:460 rulesOffhandDamageMod:476 armorPenalties:485 rulesItemArmor:500 rulesArmorItem:512 rulesAC:523 charCasterLevel:705 classSpellSlotRow:749 getMulticlassSpellSlots:762 rulesRestoreLevelFields:798 rulesApplySpellSlots:817 resolvePactSlots:840 restoreItemCharges:850 rulesHitDieSides:867 rulesShortRest:873 rulesLongRestBlockReason:908 rulesLongRest:921 rulesExhaustionLevel:993 rulesEffectiveHpMax:999 _dsReset:1004 _dsCount:1005 _dsFill:1006 _condAdd:1007 _condRemove:1008 rulesIsDead:1010 rulesIsStable:1014 rulesRegainFromZero:1019 rulesSetHp:1025 rulesDamageAfterDefenses:1037 rulesApplyDamage:1049 rulesDeathSaveBlockReason:1086 rulesDeathSave:1093 rulesConditionRollMods:1112 rulesEffectiveSpeed:1129 rulesArmorStealthDisadv:1150 rulesFeatPrereqMissing:1159 rulesFeatStatChoice:1186 rulesFeatStatOptions:1194 rulesFeatSlotCount:1207 rulesFeatSpellFits:1212 rulesFeatSpellCandidates:1223 rulesFeatSpellLabel:1227 rulesFeatSpellProgress:1232 rulesFeatClassOptions:1257 rulesFeatFreeResId:1270 rulesResetFeatFree:1273 concSaveParams:1284 rulesCrToXp:1326 rulesCrToProf:1332 rulesCrValue:1339 rulesWildShapeLimits:1350 rulesPolymorphLimits:1374 rulesCombatWildShapeHeal:1379 rulesBeastAllowed:1384 rulesFormStart:1391 rulesFormOwnHp:1405 rulesFormDamage:1410 rulesFormHeal:1425 rulesEncounterMultiplier:1432 rulesEncounterDifficulty:1441 getCharClassPairs:1465 charEditionMismatch:1479 findLangInCatalog:1487 ensureLanguagesArray:1499 recalcLanguagesFromSources:1515 add:1520 findToolInCatalog:1565 ensureToolsArray:1577 getBackgroundDef:1598 validateBgStatChoice:1634 parseBackgroundToolEntry:1654 recalcToolsFromSources:1669 add:1674 ensureArmorWeaponFields:1739 recalcArmorWeaponFromSources:1752 addArmor:1758 addWeapon:1759 addSpec:1808

**app-asi.js** (900 строк, 43 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:574 removeFeat:631 featSkillPick:660 _agBonus:695 _agPbSpent:705 _agBase:711 _agReady:718 openAbilGen:723 _agInit:733 agSetMode:746 agPb:752 _agSwap:762 agStd:769 agPick:775 agRoll:781 _agCtl:794 owner:805 _agRender:820 agApply:873 _agCommit:881

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-builds.js** (1760 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1126 openBuildGuide:1157 gx:1180 _list:1181 getBuildLevelRec:1244 getBuildRecChoiceOption:1249 getBuildRecChoiceIds:1257 getBuildRecFeat:1262 getBuildRecAsi:1272 getBuildRecSubclass:1279 parseAsiFromHeadline:1287 _buildFeatNameMap:1301 parseFeatFromHeadline:1343 parseSpellsFromHeadline:1360 getBuildRecSpellObjs:1606 openBuildPlan:1626 _cpSubclassOf:1679 _cpClassSwitch:1690 openClassPlan:1705

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-combat.js** (3421 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:793 featHpPerLevel:808 featHpFlat:817 recalculateHP:826 updateChar:881 toggleProficiency:948 calcStats:971 setSpellStat:1042 calcSpellStats:1053 _toggleNonCasterCards:1105 showSpellCasterCards:1116 onRaceChange:1124 renderBooksRow:1259 openMobSheet:1286 closeMobSheet:1293 mobSheetActs:1295 openBooksSheet:1300 toggleCharBook:1310 populateRaceSelect:1327 _speciesEffective:1360 _renderSpeciesBar:1373 _speciesChoiceOptions:1388 toggleSpeciesChoice:1395 syncSpeciesSpells:1409 rollRandomName:1455 pick:1463 build:1464 _raceSkillAllowance:1531 _raceFlexCount:1541 _raceFlexFits:1547 _raceFlexApply:1554 _setExtrasHtml:1564 renderRaceExtras:1573 toggleHalfElfStat:1744 toggleRaceFlexStat:1770 setRaceVariableTrait:1800 _raceSkillSet:1817 _pickHide:1827 _pickExpandBtn:1831 pickExpand:1834 raceLangGoto:1841 toggleRaceSkill:1849 _classSkillList:1878 _skillsFromOtherSources:1891 _skillsByName:1900 _skillTakenElsewhere:1906 _classSkillHeld:1920 _classSkillSync:1926 renderClassSkills:1957 toggleClassSkill:2004 openRaceFeatModal:2032 removeRaceFeat:2052 applyBasicLockUI:2087 _cwEditionBusy:2121 syncCwEdition:2126 setDraftEdition:2138 updateLockButtonState:2148 lockBasicInfo:2186 unlockBasicInfo:2207 isSheetLocked:2237 sheetLockGuard:2243 applySheetLockUI:2249 _creationTodo:2280 add:2284 src:2285 scheduleCreationTodo:2357 renderCreationTodo:2362 creationTodoGo:2389 openLockSheet:2401 _creationUiReset:2414 _isMobSheet:2415 renderIdentitySummary:2416 toggleIdentityMore:2435 renderProfSummary:2439 toggleProfCard:2454 openAcSheet:2460 _mobMarkClamp:2468 init:2477 lockSheet:2498 doLock:2502 unlockSheet:2515 onBackgroundChange:2536 _bgSkillsOf:2581 _bgUncheckOld:2588 _bgCheckSkills:2596 renderBackgroundFeature:2608 _bgStatShort:2653 populateBackgroundSelect:2656 _bgRevertStatChoice:2687 _bgAppliedStat:2700 _bgApplyStat:2705 setBgStatMode:2717 toggleBgStat:2729 _bgAfterStats:2752 _bgRevertFeatEffects:2763 syncOriginFeat:2788 toggleBgCustom:2824 _toggleBgCustom14:2864 toggleBgSkillPick:2911 _renderBgCustom14:2938 giveBackgroundEquipment:2975 renderBackgroundExtras:3020 _armorFromSelect:3128 renderArmorSelect:3140 onArmorPick:3175 onShieldPick:3189 onArmorChange:3208 onManualAC:3237 onManualMaxHP:3244 calcCoinWeight:3267 getActiveConditionsForRender:3281 toggleConditionsPopup:3310 closeConditionsPopup:3322 renderConditionsPopup:3328

**app-conditions.js** (505 строк, 28 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:303 loadConditions:312 refreshSaveBonuses:321 _fxMatches:338 setEffectsSearch:343 setEffectsType:344 toggleEffectsActiveOnly:352 renderEffectsGrid:358 initEffects:441 toggleEffect:461 updateEffectsCount:490 loadEffects:499

**app-core.js** (1969 строк, 97 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:577 _screenGhostDrop:583 _screenGhostStart:595 _screenEnter:613 _purgeDraftChars:624 showScreen:637 updateHeaderTitle:752 syncDrawerHeader:806 switchTab:818 _rdSheetView:857 openDrawer:876 closeDrawer:889 showCharacterNav:901 hideCharacterNav:909 isInteractive:929 currentActiveTab:952 scrolledDown:1017 closeAction:1024 reset:1031 end:1064 createNewCharacter:1084 getClassColor:1107 getClassIcon:1123 getAbilityIcon:1130 getConditionIcon:1145 getConditionChipIcon:1169 getSpellClassIcon:1187 getSchoolSlug:1204 getSchoolIcon:1208 stripLeadingEmoji:1221 formatTimeAgo:1225 setCharSort:1239 setCharSearch:1246 duplicateCharacter:1250 exportOneCharacter:1262 toggleCharSelectMode:1274 _charSelectedList:1283 _updateCharSelectBar:1286 toggleCharSelected:1303 charSelectAll:1307 _charSelectEmptyToast:1312 exportSelectedCharacters:1315 duplicateSelectedCharacters:1322 deleteSelectedCharacters:1337 updateCharCounter:1355 onDragStart:1372 onDragOver:1373 onDrop:1374 renderCharacterList:1385 renderCharPlate:1479 deleteCharacter:1542 showConfirmModal:1556 safeSet:1603 safeSetChecked:1607 loadCharacter:1616 showToast:1809 showFieldError:1826 clearFieldError:1848 toastAddAction:1858 emptyStateHtml:1876 openHPHistory:1887 closeHPHistory:1915 updateVersionBlock:1920 forceAppUpdate:1951

**app-creator.js** (1144 строк, 111 функций)  
_crChar:27 _crVisible:31 _crStepIndex:37 openCharOrCreator:43 openCreator:48 creatorRender:58 creatorRefresh:82 _crSyncNext:86 creatorHostsPanels:98 creatorSpellRoom:103 _crLockIndex:112 _crRenderFrozen:117 _crGo:122 creatorNext:136 creatorPrev:143 creatorExit:146 creatorManual:149 _crLeaveToSheet:151 _crSetField:165 _crValidBase:175 _crSeg:180 _crRenderBase:193 creatorSetEdition:214 creatorSetName:221 creatorRollName:226 creatorSetGender:234 creatorSetLevel:239 _crCard:253 _crSelectOptions:261 _crRaceData:277 _crSpeciesSingles:282 _crValidRace:286 _crRaceMeta:293 _crRaceDesc:307 _crRenderRaceList:313 _crRenderRace:331 creatorRaceSearch:365 creatorPickRace:372 creatorPickSpeciesOpt:379 _crClassMeta:403 _crSubclassOpen:414 _crValidClass:419 _crBuildsFor:424 _crRenderClass:431 creatorPickClass:475 creatorPickSubclass:485 creatorPickBuild:492 _crBgDef:502 _crFeatName:506 _crValidBg:511 _crBgMeta:520 _crRenderBg:532 _crRenderBgStats:554 _crChip:591 creatorPickBg:595 creatorBgStatMode:602 creatorBgStat:603 creatorBgCustomStat:604 creatorBgCustomFeat:605 _crRenderAbil:613 _crAfterAbil:617 _crValidAbil:623 _crLeaveAbil:627 _crTodo:653 _crValidChoices:657 _crRenderChoices:659 _crAfterChoices:667 _crMount:678 _crUnmountPanels:689 creatorChoicesSync:702 _crTodoGo:717 _crGoTo:721 _crRenderMastery:727 creatorToggleMastery:739 _crRenderClassChoices:752 _crTargetLevel:770 _crLevelPending:772 _crValidLevels:776 _crRenderLevels:780 _crAfterLevels:788 creatorLevelsSync:804 creatorHpMode:817 creatorLevelUp:819 _crRollLevelHp:832 _crSpellRows:848 _crSpellRow:865 _crValidSpells:869 _crListRoom:874 _crBuildSpells:884 push:888 _crHasSpell:898 _crRenderSpells:902 _crRenderMySpells:927 creatorRemoveSpell:949 creatorOpenSpells:958 creatorToggleSpellPrep:962 creatorAddBuildSpells:972 _crGearTodo:998 _crValidGear:1002 _crRenderGear:1004 creatorGearSync:1010 _crBgEquip24:1024 _crRenderPersona:1044 creatorSetAlign:1061 creatorSetDeity:1068 creatorPersonaGen:1070 creatorPersonaVariant:1077 put:1086 _crRenderSummary:1099 _crSummaryTodo:1125 _crGoStep:1136

**app-desktop.js** (528 строк, 15 функций)  
syncFromStatusBar:144 syncStrip:203 setRailOpen:214 syncRdToggles:221 _esc:241 _stripEmoji:247 _condIcon:251 setRowExpanded:257 collapseRow:263 renderRrConditions:265 renderRailSlots:311 renderRailConc:353 updateRailHpRow:368 rrApplyHP:383 init:396

**app-dice.js** (1713 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1359 _diceShapeSvg:1393 renderDiceFan:1400 _paintSelectedDie:1419 _diceHeroSvg:1443 _paintDiceMode:1453 selectDie:1468 rollSelectedDie:1487 toggleDiceFormulaPanel:1496 _savedRollFormula:1515 _savedRollsClean:1518 _savedRollNewId:1533 _savedRollLabel:1536 renderSavedRolls:1540 savedRollRoll:1560 savedRollTap:1567 savedRollEdit:1583 savedRollCancel:1600 savedRollSubmit:1605 savedRollDelete:1626 savedRollFromDice:1644 _diceHotkeys:1665

**app-help.js** (1325 строк, 58 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:94 setHelpFlag:98 welcomeGoStep:104 showWelcome:114 closeWelcome:121 welcomeContinue:127 welcomeSkipExperienced:133 welcomeBack:139 welcomeFinish:146 dismissWelcome:179 maybeShowWelcome:182 restartOnboarding:187 _tourWide:223 _ensureTourDom:226 _resolveTarget:267 _tourFirstVisible:282 _tourAnyModalVisible:302 _tourModalOpen:308 _tourStartWhenClear:320 startTour:332 startListTour:345 startSheetTour:349 _tourTyping:361 maybeStartSheetTour:366 startCreatorTour:389 maybeStartCreatorTour:394 _buildCreatorSteps:406 restartTour:417 startTabTour:444 maybeStartTabTour:462 tourNext:489 tourPrev:494 endTour:500 _showTourStep:510 _setBox:573 _computeTourBoxes:589 snap:591 corner:604 _layoutTourCorners:626 _layoutTour:643 _onTourKey:746 _onTourReflow:752 _bindTourGlobal:756 _unbindTourGlobal:761 _buildListSteps:772 _buildSheetSteps:822 _buildStatsSteps:932 _buildProgressSteps:973 _buildSpellsSteps:1031 _buildInventorySteps:1074 _buildBattleSteps:1120 _buildNotesSteps:1195 _buildPartySteps:1236 _buildJournalSteps:1294

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

**app-hp.js** (2008 строк, 70 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:33 showLongRestInfo:34 selectRestType:36 _restResNames:53 _restRecoveries:67 _restRecoveryHtml:80 _restRefreshRecovery:85 _renderRestPreview:89 _restHasSlots:127 showRestResult:133 adjustHitDice:143 _restHitDiceChosen:155 adjustHitDiceSize:162 updateHitDiceInfo:169 confirmRest:202 openLevelUpModal:298 _showMulticlassScreen:328 luPickAnotherClass:373 openMulticlassNewClass:380 confirmMulticlassNewClass:439 _showLevelUpPreview:450 closeLevelUpModal:628 confirmLevelUp:641 _luShowResult:768 luFinishChoices:800 luRefreshChoices:807 luSetSubclass:814 luApplyFeatById:834 luApplyAsi:880 _luFeatChoiceAt:901 _luChoiceOpensAt:910 _luSub:916 _ccDefsFor:920 _luAsiDone:931 luApplyAllRecommendations:936 _luSpellGainParts:1058 pluralRu:1063 delta:1067 luBuildChoicesScreen:1085 recBadge:1093 luAddRecommendedSpells:1231 luGoToSpellsTab:1259 openLevelDownConfirm:1271 confirmLevelDown:1316 loadDeathSaves:1349 toggleDeathSave:1393 resetDeathSaves:1410 updateHPDisplay:1423 hpToggleRow:1515 hpSetRowOpen:1524 updateHPSummary:1532 updateHPRows:1596 quickHP:1614 setHPAbsolute:1740 addHPHistory:1765 _hpUndoPrepare:1782 _hpUndoConcSnap:1802 _hpUndoConcRestore:1819 undoHPChange:1842 showHPToast:1872 applyCustomHP:1890 saveTempHP:1907 rollHitDieQuick:1921 renderHitDiceIcons:1953 rollDeathSave:1967 _luSlotPart:1998 _luPactPart:2001

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

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-progress.js** (1070 строк, 65 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:310 _pgNext:326 _pgClassWord:380 _pgAvailableClasses:389 _pgActions:402 _pgBuild:420 openProgressTab:433 openProgress:443 pgTabActive:454 pgRefresh:461 pgSetSubclass:469 pgFocusSubclass:484 pgLevelUp:501 pgLevelDown:506 pgAfterLevelModal:512 pgAddClass:523 renderClassDev:537 _pgSheetAboutRow:556 _pgSubclassRows:574 syncClassFieldUI:600 _pgOwnSubclasses:646 pgEditSubclass:656 _subclassRecord:661 _subclassUnlock:666 _subclassClasses:671 _subclassPicked:677 _subclassRepick:682 subclassFormClassChanged:691 subclassAddFeature:697 subclassRemoveFeature:716 openSubclassForm:721 closeSubclassForm:747 _subclassFormDone:752 submitSubclassForm:760 deleteSubclassForm:794 openFeatureInfo:815 _fiRuleNotes:858 _mlTotal:897 _mlMissing:902 openMcLayout:908 mlSetClass:920 mlLevel:928 mlSetSub:937 mlAdd:942 mlRemove:948 _mlRender:954 _mlPruneAsi:1019 mlApply:1030

**app-settings.js** (898 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:113 _accentForClass:125 _applyClassAccent:128 _refreshAccent:131 setAutoAccent:139 _syncAutoAccentToggle:144 getEdition:160 setEdition:168 _syncEditionButtons:177 _getStatsLayout:194 _applyStatsLayout:201 _statsInCards:208 _statsRowTarget:212 _placeStatRows:230 setStatsLayout:246 _syncStatsLayoutButtons:253 _getSheetLock:267 setSheetLock:271 _syncSheetLockButtons:276 _wakeLockSupported:287 _getWakeLockOn:288 _applyWakeLock:292 setWakeLock:307 _syncWakeLockButtons:312 _getHeaderAutohideOn:322 setHeaderAutohide:325 _syncHeaderAutohideButtons:330 _getTrackXpOn:338 _applyTrackXp:341 setTrackXp:344 _syncTrackXpButtons:349 _getAttackDamageOn:370 setAttackDamage:373 _syncAttackDamageButtons:377 isEditionSplit:386 setEditionSplit:389 _syncEditionSplitButtons:394 openBooksScreen:404 _bookRowHtml:408 _renderBooksScreen:418 setBookOn:443 setBooksPreset:449 _afterBooksChange:456 _syncBooksSummary:468 _getStatsCollapsed:482 _applyStatsCollapsed:485 toggleStatsCollapsed:490 _getStoredDensity:504 _getDefaultDensity:512 _getDensity:519 _applyDensity:522 setDensity:526 _syncDensityButtons:532 _onViewportDensityChange:540 _getFontScale:558 _applyFontScale:565 setFontScale:576 _syncFontScaleUi:587 _getGlassAlpha:602 _getGlassBlur:609 _applyGlassAlpha:616 _applyGlassBlur:617 setGlassAlpha:618 setGlassBlur:628 _syncGlassUi:637 _getSpaceMode:686 _applySpaceBg:693 setSpaceMode:708 _syncSpaceButtons:714 _spaceOnScroll:733 _applyDymkaIcons:761 _initAppLinks:774 openSupportLink:806 _isStandalone:818 _isIos:824 _installMode:828 _syncInstallUi:833 installApp:846 openSettingsModal:870 closeSettingsModal:885

**app-sheet2.js** (572 строк, 27 функций)  
esc:15 fm:20 abName:21 listText:22 ensureNodes:30 render:83 build:104 hpBlock:238 restBlock:265 atkRow:273 weaponsBlock:284 diceBlock:296 slotsBlock:306 condBlock:322 buildBattle:328 buildRail:332 buildPersona:337 buildSpellHead:348 classFeatures:362 classResources:411 rollsHtml:446 closePop:467 outside:475 onKey:476 openPop:477 poolFormula:533 schedule:557

**app-spells.js** (2276 строк, 113 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:165 adjustPactSlots:176 syncSpellSlotsFromClass:188 updateSpellSlots:197 toggleSpellSlot:208 adjustSpellSlots:219 restoreAllSlots:230 setSpellVersion:241 _syncSpellVersionLock:252 setSpellClass:261 _charIsThirdCaster:270 _charSpellClassKey:276 _charMaxCastableLevel:288 _defaultSpellVersion:296 toggleSpellOnlyAdded:302 _renderSpellOnlyAdded:306 openSpellSearch:314 markCharOwnClassFilter:335 closeSpellSearch:364 _featPickCtx:375 featAddFixedSpells:390 openFeatSpellPicker:416 _featPickProgressText:433 _renderFeatPickBar:439 featPickSetClass:460 _featPickCandidates:468 _renderFeatPickList:478 addFeatSpell:509 removeFeatSpell:529 _parseSpellClassList:552 _syncNewSpellClassChips:556 toggleNewSpellClass:563 _fillNewSpellDamageTypes:588 _toggleHidden:595 updateNewSpellMechFields:603 _hbFormulaCheck:618 _collectHbEffect:627 _spellIdArg:665 _findHomebrewSpell:671 openAddSpellForm:679 _syncCustomSpellAcrossChars:758 _purgeCustomSpellFromChars:776 deleteCustomSpell:795 _deleteCustomSpellConfirmed:804 closeAddSpellForm:818 submitNewSpell:822 renderSpellSearch:912 spellCompRu:986 addSpell:991 removeSpell:1015 toggleSpellCard:1029 renderMySpells:1034 _spellActiveBadgeText:1182 _spellActiveBadgeHtml:1186 updateSpellActiveBadges:1189 _prepEntries:1212 _spellPrepEntry:1230 _prepLimit:1235 calcMaxPrepared:1251 _known2014:1258 calcMaxKnownSpells:1273 _knownSpellCount:1279 calcMaxCantrips:1289 isPrepClass:1298 _subclassSpellNames:1304 syncSubclassSpells:1337 spellNeedsPrep:1364 _preparedCount:1380 openSpellCardsMenu:1388 isSpellPrepared:1403 toggleSpellPrepared:1413 renderPrepCounter:1439 _castableSlotOptions:1492 _wizardPick:1517 _spellMasteryFree:1520 _signatureResId:1525 _arcanumResId:1532 castSpell:1542 _castSpellWithSlot:1563 _finishCast:1611 applyCastEffects:1661 _applyCastForm:1698 openCastVariantChooser:1711 pickCastVariant:1750 closeCastVariantChooser:1760 _applyCastSummon:1773 _nextCastInstanceId:1807 _replaceCastInstance:1815 _ensureCastInstance:1845 _applyCastDamage:1865 _rollCastDamage:1892 _startCastRepeat:1962 castRepeatDamage:1976 _applyCastDebuff:2001 castSpellAttackMod:2042 castStatMod:2050 _agonizingBonus:2072 _applyCastHeal:2091 _castHealApply:2112 _applyCastTempHp:2118 applyCastTempHp:2135 _applyCastHpMaxBonus:2149 openCastChooser:2169 closeCastChooser:2190 canCastAsRitual:2203 castRitual:2225 cancelRitual:2264

**app-sync.js** (691 строк, 46 функций)  
_syncLog:22 _syncEnabled:26 _syncRedirectUri:30 _syncDevice:34 _syncGetAuth:41 _syncSetAuth:48 _syncTokenValid:55 syncSignIn:59 syncSignOut:74 syncTurnOff:85 _syncConsumeHash:106 _driveFetch:141 _driveList:155 _driveFind:162 _driveRead:166 _syncCheckDoc:175 _driveWrite:185 _syncLoadState:202 _syncSaveState:210 syncTombstone:214 _syncExpired:222 syncSchedule:228 _syncUserSpells:235 _syncHashes:240 _syncKeepLive:250 _syncNameDupes:270 _syncAskDupes:277 _syncDestructive:288 lost:289 _syncApply:297 _syncFixChar:327 _syncMergeExtra:332 _syncRun:343 syncNow:411 syncOverwrite:465 _syncStable:475 _syncHashStr:483 syncHashChar:492 _syncClone:494 _syncUnpackChar:496 _syncPackChar:502 _syncMergeList:508 syncMerge:540 _syncBtn:634 _syncTimeLabel:643 renderSyncRow:650

**app-ui.js** (1539 строк, 96 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:180 animateCountUp:186 tick:194 _reportError:217 swProgressToast:248 swProgressToastRemove:261 swInstallFailed:265 swWatchFirstInstall:278 swRegister:308 swTelegramBlock:343 swSupportBlock:354 showUpdateModal:366 later:392 onKey:399 checkWhatsNew:409 showWhatsNewModal:421 toggleAccordion:458 initCharResources:478 getResourceMax:487 getCharResourceDefs:508 currentDieSize:538 crRow:550 crRestoreLabel:563 crResourceRow:579 crRecoveryHint:642 crResName:647 crFlexActs:656 _crFlexContext:675 _crFlexDone:685 flexSlotToPoints:692 flexPointsToSlot:706 crPointRecoveryAmount:725 crPointRecoveryActs:730 recoverPointsByResource:736 crPortentRolls:756 crPortentMeta:760 crPortentActs:766 _crPortentContext:772 crRollPortent:782 usePortent:789 crSlotRecoveryBudget:804 crSlotRecoveryActs:808 recoverSlotByResource:823 crPassiveNotes:849 rollSneakAttack:858 rollResourceDie:882 crManeuverRows:901 crRowsHtml:918 crSetRows:955 renderClassResources:970 spendResource:988 resetResource:1006 toggleResourcePip:1016 resourceRollOnSpend:1041 resetResourcesByRest:1054 getJournal:1104 addJournalEntry:1109 filterJournal:1131 renderJournal:1138 deleteJournalEntry:1174 openAddJournalEntry:1183 closeAddJournalEntry:1188 saveJournalEntry:1191 getCompanions:1211 renderCompanions:1216 companionHP:1261 buildFamiliarFormOptions:1274 onCompanionTypeChange:1286 applyFamiliarForm:1294 openAddCompanionModal:1306 summonFamiliar:1323 openPrefilledCompanionModal:1333 openEditCompanionModal:1344 closeAddCompanionModal:1364 saveCompanion:1367 deleteCompanion:1392 switchProfilesTab:1408 clipChangelogText:1423 expandChangelogItem:1434 clCleanText:1446 renderChangelog:1452 openItemRef:1497 closeItemRef:1502 switchItemRef:1507 _syncHeaderHeight:1525

**app-wildshape.js** (319 строк, 27 функций)  
wsBeast:12 wsChargesLeft:18 wsSpeedText:27 wsCrText:36 wsLimitsText:40 wildShapeStatBlock:53 wsEnsureBeasts:72 wsFormLine:80 renderWildShape:89 wsSlotHeal:139 wsSlotHealRow:147 wildShapeSlotHeal:154 wsLimits:171 openPolymorphPicker:174 openWildShapePicker:180 wsOpenPicker:186 closeWildShapePicker:194 wsSetSearch:197 wsPickRow:199 wsBtn:204 renderWildShapePicker:208 wildShapeLearn:241 wildShapeForget:249 wildShapeAssume:257 polymorphAssume:275 polymorphEnd:291 wildShapeExit:300

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (8631 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:129 SAVES_DATA:151 CONDITIONS:160 EFFECTS_DATA:183 CLASS_FEATURES:234 SPELL_PREP_CLASSES:505 CANTRIPS_KNOWN_2014:514 SPELLS_KNOWN_2014:525 SPELL_SLOTS_BY_LEVEL:534 CLASS_HIT_DICE:618 SUBCLASSES:625 SOURCE_LABELS:646 SUBCLASS_SOURCE:673 SUBCLASS_CREDIT:733 BOOK_CODES:752 _booksOffCache:755 CLASS_SOURCE:808 SUBCLASS_LEVEL:824 SUBCLASS_FEATURES:841 WEAPON_PRESETS:1665 ITEM_ICONS:1709 CATEGORY_NAMES:1710 GEAR_PACKS:1719 RACE_DATA:1814 BACKGROUND_SKILLS:2431 BACKGROUND_ALIASES:2510 DEITY_ALIGN_LABELS:2523 DEITIES_DATA:2528 LANGUAGE_CATALOG:2596 RACE_LANGUAGES:2633 CLASS_LANGUAGES:2735 TOOL_CATALOG:2741 RACE_TOOLS:2797 CLASS_TOOLS:2809 SUBCLASS_LANGUAGES:2818 SUBCLASS_TOOLS:2841 RACE_ARMOR:2869 RACE_WEAPONS_SPECIFIC:2875 CLASS_WEAPONS_SPECIFIC:2891 RACE_NAME_POOLS:2904 RACE_NAME_GROUP:2946 SUBCLASS_ARMOR:2961 ARMOR_PRESETS:2996 skills:3013 ABILITY_INFO:3026 CLASS_SKILL_OPTIONS:3066 CLASS_SKILL_COUNT:3082 CLASS_SKILL_MC_COUNT:3083 CLASS_ARMOR_PROFS:3086 CLASS_RESOURCES:3107 ASI_LEVELS:3295 XP_THRESHOLDS:3303 APP_VERSION:3313 APP_VERSION_DATE:3314 APP_TELEGRAM_URL:3320 APP_BOOSTY_URL:3321 FEATS_DATA:3342 APP_CHANGELOG:3665 CASTER_TYPE:8429 THIRD_CASTER_SUBCLASSES:8439 THIRD_CASTER_SLOTS:8446 MULTICLASS_SPELL_SLOTS:8457 MULTICLASS_PREREQUISITES:8482 MULTICLASS_PROFICIENCIES:8501 EDITION_DATA:8531

**spells.js** (13819 строк)  
SPELLS_BASE:7

**spell-effects.js** (881 строк)  
SPELL_EFFECTS:71

**class-choices.js** (844 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 ARTIFICER_INFUSIONS:106 ARTIFICER_REPLICA_ITEMS:125 CLASS_CHOICES:184 ccModalState:542

**subclass-choices-data.js** (1180 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 LIVING_WEAPON_DISCIPLINES:134 LIVING_WEAPON_PERFECT_FORM:140 RUNE_KNIGHT_RUNES:148 ARCANA_CANTRIPS:166 ARCANA_MASTERY:167 GIANT_CANTRIPS:178 ARMORER_MODELS:182 SUBCLASS_CHOICES:187 SUBCLASS_RESOURCES:474

