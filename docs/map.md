# Карта кода

Сгенерировано `node tools/gen-map.js` — руками не править, перегенерировать после
крупных правок `style.css`, `index.html` или добавления функций.

Как пользоваться: найти нужный диапазон здесь → `Read` с `offset`/`limit` по нему,
вместо чтения файла целиком или разведочных grep. Сам этот файл тоже читается
диапазонами — оглавление ниже указывает строки внутри map.md.

## Оглавление

| Раздел | Строки в map.md |
|---|---|
| style.css — секции | 20–132 |
| index.html — блоки верхнего уровня (`#id:строки`) | 133–175 |
| Функции по файлам (`имя:строка`) | 176–249 |
| Данные — константы верхнего уровня (`имя:строка`) | 250–266 |


## style.css — секции

| Строки | Секция |
|---|---|
| 1–13 | style.css — Стили D&D 5e Character Sheet |
| 14–182 | Design tokens (R1) |
| 183–198 | Алиасы старых переменных (совместимость) |
| 199–218 | THEME-4: компонентные токены базового хрома |
| 219–234 | THEME-5: компонентные токены фичевых зон (партия B) |
| 235–261 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 262–306 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 307–488 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 489–572 | UI-2. Пресеты акцента (8 цветов) |
| 573–589 | Body — атмосферный cream-фон + warm radial + SVG-noise |
| 590–597 | UI4-glass: декоративные «лозы» светлой темы убраны |
| 598–606 | Заголовки |
| 607–1029 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1030–1374 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1375–1380 | R2. Базовые компоненты |
| 1381–1539 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1540–1804 | UI-3. Desktop/tablet layout (≥1024px) |
| 1805–1915 | UI5-4: ПК — многоколоночная раскладка листа |
| 1916–1992 | /R2 |
| 1993–2166 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2167–2379 | HEADER (R5: back + name + hamburger) |
| 2380–2445 | КД АВТО-РАСЧЁТ |
| 2446–2515 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2516–2581 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2582–2741 | УСЛОВИЯ |
| 2742–2888 | СПАСБРОСКИ |
| 2889–3040 | CLASS FEATURES |
| 3041–3080 | УБИРАЕМ СТРЕЛКИ |
| 3081–3185 | TAB NAV — 5 tabs + centered FAB dice |
| 3186–3297 | UX-5: лента последних бросков вне модалки |
| 3298–3474 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3475–3494 | HAMBURGER BUTTON |
| 3495–3536 | SIDE DRAWER |
| 3537–4040 | STYLE-8L: сайдбар в языке встречающего экрана |
| 4041–4088 | MENU-8/9: встречающий экран во всё окно. |
| 4089–4181 | MENU-2: плашка последнего героя. |
| 4182–4356 | MENU-3: меню приключения. |
| 4357–4427 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4428–4428 | INVENTORY |
| 4429–4459 | INVENTORY — WEIGHT BAR |
| 4460–4496 | INVENTORY — BACKPACK HEADER |
| 4497–4537 | INVENTORY — FILTERS |
| 4538–4726 | INVENTORY — ITEM CARDS |
| 4727–5092 | COINS — BIG NUMBER CARD GRID |
| 5093–5396 | MODALS |
| 5397–5431 | DICE |
| 5432–6012 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 6013–6902 | OTHER STYLES |
| 6903–6971 | HP DISPLAY BLOCK |
| 6972–6997 | MOBILE OPTIMIZATION |
| 6998–7126 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7127–7165 | HP TOAST (snackbar) |
| 7166–7217 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7218–7271 | Confirm Modal |
| 7272–7696 | ⚔️ ОТРЯД & БОЙ |
| 7697–7976 | RACIAL BONUS BAR |
| 7977–8119 | COMPACT STATS GRID |
| 8120–8387 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8388–8440 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8441–8491 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8492–8594 | COMPACT SKILLS |
| 8595–8637 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8638–8709 | ACCORDION |
| 8710–8733 | CLASS RESOURCES |
| 8734–8826 | ASI MODAL |
| 8827–9091 | APP VERSION |
| 9092–9101 | COMPANIONS |
| 9102–9147 | FEATS LIST IN ASI |
| 9148–9394 | PROFILES TABS (Чейнджлог) |
| 9395–9473 | TAKEN FEATS |
| 9474–9670 | SW UPDATE MODAL |
| 9671–9718 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9719–9891 | INVENTORY SLOTS SYSTEM |
| 9892–10091 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 10092–10363 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10364–10536 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10537–10606 | 3D DICE CUBE |
| 10607–10979 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10980–11062 | DESKTOP LAYOUT — centered max-width |
| 11063–11083 | INSPIRATION |
| 11084–11123 | CONCENTRATION |
| 11124–11800 | WEAPON CARDS WITH ROLL BUTTONS |
| 11801–11911 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11912–11974 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11975–12001 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 12002–12125 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12126–12152 | R6: Ассеты (декор) |
| 12153–13127 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13128–13215 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13216–13224 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13225–13294 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13295–13626 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13627–13653 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13654–13701 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13702–13784 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13785–14882 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14883–14938 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14939–15031 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 15032–15345 | DISC-1 · Ромб раскрытия |
| 15346–15935 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15936–16041 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 16042–16178 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16179–16413 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16414–16423 | STYLE-8b3-fix: срезанный ромб |
| 16424–16737 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16738–17256 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17257–17291 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17292–17945 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-139 #screen-settings:140-234 #header-autohide-row:235-251  
#wake-lock-row:252-282 #edition-row:283-305 #install-row:306-316 #welcome-modal:317-321 #welcome-step-1:322-340 #welcome-step-2:341-375 #header-avatar:376-381 #status-bar:382-385  
#status-inspiration:386-386 #status-concentration:387-389 #status-ritual:390-392 #status-conditions-btn:393-405 #screen-home:406-408 #home-art:409-436 #home-sub-new:437-484 #home-install:485-492  
#home-hero:493-493 #home-hero-emblem:494-497 #home-hero-sub:498-498 #home-hero-chips:499-509 #screen-characters:510-549 #char-hero:550-550 #char-hero-emblem:551-554 #char-hero-sub:555-555  
#char-hero-chips:556-556 #char-hero-actions:557-565 #screen-data:566-582 #sync-row:583-583 #storage-status:584-584 #backup-panel:585-589 #backup-list:590-601 #screen-about:602-605  
#app-version-row:606-613 #ptab-info:614-621 #app-links-row:622-626 #ptab-changelog:627-632 #changelog-list:633-639 #screen-character:640-640 #tab-sheet:641-643 #creation-wizard-banner:644-654  
#cw-validation:655-657 #basic-locked-bar:658-667 #creation-todo:668-677 #sheet-avatar:678-690 #char-build-badge-wrap:691-705 #char-class-mc:706-729 #char-subclass-rec:730-730 #char-subclass-mc:731-939  
#char-books:940-944 #race-bonus-display:945-945 #race-extras-panel:946-946 #class-skills-panel:947-948 #background-feature-display:949-950 #bg-extras-panel:951-994 #abilgen-row:995-1001 #stats-collapse-btn:1002-1009  
#abilities-region:1010-1013 #proficiency-bonus-2024:1014-1015 #insp-card-2024:1016-1025 #abil-col-1:1026-1026 #stat-block-str:1027-1028 #mod-str:1029-1035 #abil-save-slot-str:1036-1036 #abil-skills-slot-str:1037-1039  
#stat-block-dex:1040-1041 #mod-dex:1042-1048 #abil-save-slot-dex:1049-1049 #abil-skills-slot-dex:1050-1052 #stat-block-int:1053-1054 #mod-int:1055-1061 #abil-save-slot-int:1062-1062 #abil-skills-slot-int:1063-1066  
#abil-col-2:1067-1067 #stat-block-con:1068-1069 #mod-con:1070-1076 #abil-save-slot-con:1077-1077 #abil-skills-slot-con:1078-1080 #stat-block-wis:1081-1082 #mod-wis:1083-1089 #abil-save-slot-wis:1090-1090  
#abil-skills-slot-wis:1091-1093 #stat-block-cha:1094-1095 #mod-cha:1096-1102 #abil-save-slot-cha:1103-1103 #abil-skills-slot-cha:1104-1117 #saves-grid:1118-1127 #skills-container:1128-1130 #passive-perception:1131-1150  
#ws-hp-banner:1151-1156 #hp-dmg-row:1157-1166 #hp-dmg-body:1167-1187 #death-saves-section:1188-1219 #hp-armor-body:1220-1261 #hp-hd-body:1262-1275 #hp-rest-body:1276-1303 #class-dev-section:1304-1306  
#cd-head:1307-1307 #cd-res:1308-1308 #cd-attn:1309-1310 #cd-about:1311-1319 #ac-formula:1320-1321 #ac-modifiers:1322-1329 #conditions-grid:1330-1337 #effects-grid:1338-1345  
#resistances-container:1346-1354 #prof-card:1355-1358 #armor-prof-container:1359-1362 #weapon-prof-container:1363-1366 #tools-container:1367-1370 #languages-container:1371-1378 #companions-list-sheet:1379-1391 #tab-progress:1392-1393  
#pg-body:1394-1395 #tab-spells:1396-1398 #spell-stat-card:1399-1420 #spell-mod-display:1421-1426 #spell-dc-display:1427-1432 #spell-attack-display:1433-1438 #spell-stats-by-class:1439-1450 #spell-slots-card:1451-1456  
#spell-slots-visual:1457-1463 #concentration-block:1464-1481 #prep-counter:1482-1482 #my-spells-list:1483-1485 #tab-inventory:1486-1505 #weight-fill:1506-1540 #inventory-list:1541-1550 #inv-pouches:1551-1606  
#tab-notes:1607-1633 #notes-subtabs:1634-1635 #notes-main:1636-1637 #taken-feats-section:1638-1642 #taken-feats-list:1643-1646 #tab-party:1647-1655 #my-char-card:1656-1670 #allies-list:1671-1686  
#npcs-list:1687-1702 #monsters-list:1703-1714 #companions-list-world:1715-1725 #tab-battle:1726-1731 #weapons-list:1732-1734 #ws-card:1735-1737 #saved-roll-form:1738-1744 #saved-roll-err:1745-1746  
#saved-rolls-list:1747-1750 #battle-res-card:1751-1752 #battle-res-rows:1753-1754 #battle-setup-screen:1755-1765 #battle-setup-list:1766-1766 #battle-difficulty:1767-1770 #battle-tracker-screen:1771-1775 #battle-turn-info:1776-1781  
#battle-repeat-strip:1782-1782 #battle-tracker-list:1783-1792 #tab-journal:1793-1807 #journal-list:1808-1814 #screen-itemref:1815-1817 #item-ref-tabs:1818-1823 #item-ref-weight:1824-1862 #item-ref-slots:1863-1894  
#screen-dmref:1895-1897 #dm-ref-tabs:1898-1902 #dm-ref-ed:1903-1903 #dm-ref-cond:1904-1904 #dm-ref-combat:1905-1905 #dm-ref-world:1906-1910 #screen-help:1911-1933 #help-about:1934-1957  
#help-start:1958-1982 #help-sheet:1983-2006 #help-progress:2007-2052 #help-spells:2053-2069 #help-inventory:2070-2082 #help-battle:2083-2107 #help-party:2108-2124 #help-notes:2125-2133  
#help-journal:2134-2142 #help-planes:2143-2170 #help-dice:2171-2182 #help-edition2024:2183-2222 #help-data:2223-2239 #help-marks:2240-2262 #conc-details-modal:2263-2273 #conc-detail-duration-row:2274-2281  
#conc-detail-desc-row:2282-2291 #add-journal-modal:2292-2315 #add-npc-modal:2316-2345 #add-ally-modal:2346-2382 #screen-monsters:2383-2395 #srd-monster-count:2396-2396 #srd-monster-results:2397-2401 #srd-npc-modal:2402-2411  
#srd-npc-count:2412-2412 #srd-npc-results:2413-2420 #screen-monsterform:2421-2458 #monster-cr-note:2459-2461 #monster-stats:2462-2463 #monster-saves:2464-2465 #monster-attacks:2466-2489 #screen-rest:2490-2492  
#rest-main-screen:2493-2499 #rest-info-screen:2500-2504 #hit-dice-section:2505-2506 #hit-dice-controls-total:2507-2511 #hit-dice-by-size:2512-2516 #rest-food-section:2517-2525 #rest-result-screen:2526-2528 #rest-result-details:2529-2537  
#screen-levelup:2538-2542 #lu-screen-multiclass:2543-2544 #lu-mc-current-classes:2545-2547 #lu-mc-new-class:2548-2552 #lu-mc-prereq-warn:2553-2553 #lu-mc-subclass-row:2554-2562 #lu-screen-preview:2563-2595 #lu-slots-card:2596-2597  
#lu-slots-info:2598-2601 #lu-build-hint:2602-2602 #lu-features-container:2603-2611 #lu-screen-choices:2612-2613 #lu-choices-body:2614-2620 #lu-screen-result:2621-2622 #lu-result-title:2623-2623 #lu-result-body:2624-2630  
#screen-wildshape:2631-2636 #ws-limits:2637-2637 #ws-results:2638-2641 #screen-hphistory:2642-2644 #hp-history-list:2645-2650 #asi-modal:2651-2655 #asi-build-hint:2656-2670 #asi-feat-list:2671-2671  
#asi-stat-grid:2672-2672 #asi-preview:2673-2681 #class-choice-modal:2682-2697 #dice-modal:2698-2730 #dice-file-hint:2731-2731 #dice3d-result:2732-2743 #dice-result-display:2744-2757 #dice-pick-hint:2758-2758  
#dice-mode-segment:2759-2763 #dice-formula-panel:2764-2781 #dice-fan:2782-2790 #dice-popover-settings:2791-2838 #dice-popover-history:2839-2850 #dice-history:2851-2859 #screen-spellsearch:2860-2862 #spell-feat-bar:2863-2879  
#spell-class-filter:2880-2923 #class-filter-legend:2924-2925 #spell-search-count:2926-2926 #spell-search-results:2927-2930 #cast-spell-modal:2931-2935 #cast-spell-options:2936-2938 #add-spell-modal:2939-2982 #new-spell-class-chips:2983-3028  
#new-spell-mech-fields:3029-3033 #new-spell-mech-dmg-row:3034-3053 #new-spell-mech-half-row:3054-3056 #new-spell-mech-mod-row:3057-3067 #item-modal:3068-3112 #item-armor-fields:3113-3138 #coin-exchange-modal:3139-3177 #exch-preview:3178-3184  
#screen-magiccatalog:3185-3212 #magic-catalog-count:3213-3213 #magic-catalog-list:3214-3217 #screen-gearcatalog:3218-3222 #gear-packs-list:3223-3236 #gear-catalog-count:3237-3237 #gear-catalog-list:3238-3242 #weapon-modal:3243-3246  
#weapon-picker-section:3247-3249 #weapon-filter-chips:3250-3259 #weapon-presets-list:3260-3260 #weapon-pick-bar:3261-3323 #character-tabs:3324-3335 #quick-roll-strip:3336-3341 #qrs-list:3342-3352 #active-effects-panel:3353-3357  
#aef-list:3358-3364 #hp-toast-container:3365-3367 #add-companion-modal:3368-3384 #companion-familiar-row:3385-3405 #mob-sheet:3406-3409 #mob-sheet-list:3410-3413 #confirm-modal:3414-3427 #avatar-modal:3428-3431  
#avatar-modal-preview:3432-3459 #screen-builds:3460-3487 #bp-list:3488-3492 #screen-buildguide:3493-3495 #bg-body:3496-3500 #screen-buildplan:3501-3503 #bp-plan-body:3504-3508 #screen-abilityinfo:3509-3511  
#ai-body:3512-3516 #screen-abilgen:3517-3519 #ag-body:3520-3524 #screen-books:3525-3527 #books-body:3528-3532 #screen-mclayout:3533-3535 #ml-body:3536-3540 #screen-featureinfo:3541-3543  
#fi-body:3544-3548 #app-log-panel:3549-3568 #app-log-list:3569-3749 #notes-entry-modal:3750-3798  

## Функции по файлам (`имя:строка`)

**rules.js** (1763 строк, 117 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesSaveBonus:335 rulesSkillBonus:341 rulesPassivePerception:356 rulesSpellStats:360 _spellStatMod:380 rulesSpellStatsByClass:388 rulesWeaponMods:406 rulesOffhandDamageMod:422 armorPenalties:431 rulesItemArmor:444 rulesArmorItem:456 rulesAC:467 charCasterLevel:649 classSpellSlotRow:690 getMulticlassSpellSlots:703 rulesRestoreLevelFields:739 rulesApplySpellSlots:758 resolvePactSlots:781 restoreItemCharges:791 rulesHitDieSides:808 rulesShortRest:814 rulesLongRestBlockReason:849 rulesLongRest:862 rulesExhaustionLevel:928 rulesEffectiveHpMax:934 _dsReset:939 _dsCount:940 _dsFill:941 _condAdd:942 _condRemove:943 rulesIsDead:945 rulesIsStable:949 rulesRegainFromZero:954 rulesSetHp:960 rulesDamageAfterDefenses:972 rulesApplyDamage:984 rulesDeathSaveBlockReason:1021 rulesDeathSave:1028 rulesConditionRollMods:1047 rulesEffectiveSpeed:1064 rulesArmorStealthDisadv:1085 rulesFeatPrereqMissing:1094 rulesFeatStatChoice:1121 rulesFeatStatOptions:1129 rulesFeatSlotCount:1142 rulesFeatSpellFits:1147 rulesFeatSpellCandidates:1158 rulesFeatSpellLabel:1162 rulesFeatSpellProgress:1167 rulesFeatClassOptions:1192 rulesFeatFreeResId:1205 rulesResetFeatFree:1208 concSaveParams:1219 rulesCrToXp:1261 rulesCrToProf:1267 rulesCrValue:1274 rulesWildShapeLimits:1285 rulesPolymorphLimits:1309 rulesCombatWildShapeHeal:1314 rulesBeastAllowed:1319 rulesFormStart:1326 rulesFormOwnHp:1340 rulesFormDamage:1345 rulesFormHeal:1360 rulesEncounterMultiplier:1367 rulesEncounterDifficulty:1376 getCharClassPairs:1400 charEditionMismatch:1414 findLangInCatalog:1422 ensureLanguagesArray:1434 recalcLanguagesFromSources:1450 add:1455 findToolInCatalog:1500 ensureToolsArray:1512 getBackgroundDef:1533 validateBgStatChoice:1569 parseBackgroundToolEntry:1589 recalcToolsFromSources:1604 add:1609 ensureArmorWeaponFields:1674 recalcArmorWeaponFromSources:1687 addArmor:1693 addWeapon:1694 addSpec:1743

**app-core.js** (1672 строк, 78 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 _stampCurrentCharUpdated:329 saveToLocal:343 initPersistentStorage:367 _formatStorageBytes:388 updateStorageStatus:396 currentScreenName:457 screenBack:463 _modalVisible:477 _closeOpenModals:480 headerBack:490 _screenMotionOk:523 _screenGhostDrop:529 _screenGhostStart:541 _screenEnter:559 _purgeDraftChars:570 showScreen:583 updateHeaderTitle:691 syncDrawerHeader:745 switchTab:757 openDrawer:787 closeDrawer:800 showCharacterNav:812 hideCharacterNav:820 isInteractive:840 currentActiveTab:863 createNewCharacter:921 getClassColor:943 getClassIcon:958 getAbilityIcon:965 getConditionIcon:980 getConditionChipIcon:1004 getSpellClassIcon:1022 getSchoolSlug:1039 getSchoolIcon:1043 stripLeadingEmoji:1056 formatTimeAgo:1060 setCharSort:1074 setCharSearch:1081 duplicateCharacter:1085 exportOneCharacter:1097 updateCharCounter:1104 onDragStart:1121 onDragOver:1122 onDrop:1123 renderCharacterList:1134 renderCharPlate:1220 deleteCharacter:1279 showConfirmModal:1293 safeSet:1340 safeSetChecked:1344 loadCharacter:1353 showToast:1544 toastAddAction:1561 emptyStateHtml:1579 openHPHistory:1590 closeHPHistory:1618 updateVersionBlock:1623 forceAppUpdate:1654

**app-migrate.js** (1042 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1034

**app-builds.js** (1737 строк, 46 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _stemSet:192 _matchByStems:198 _weaponMatchNames:206 _findWeapon:209 _findArmorPreset:234 placeStartingItem:251 applyBuild:376 _applyBuildCore:399 _pick:909 _glossNorm:1018 _reEscape:1019 _glossEd:1020 _glossBuild:1021 ingest:1023 _glossIndex:1045 glossarizeHtml:1053 _glossPopoverEl:1067 hideGlossPopover:1079 showGlossPopover:1084 _glossBindOnce:1103 openBuildGuide:1134 gx:1157 _list:1158 getBuildLevelRec:1221 getBuildRecChoiceOption:1226 getBuildRecChoiceIds:1234 getBuildRecFeat:1239 getBuildRecAsi:1249 getBuildRecSubclass:1256 parseAsiFromHeadline:1264 _buildFeatNameMap:1278 parseFeatFromHeadline:1320 parseSpellsFromHeadline:1337 getBuildRecSpellObjs:1583 openBuildPlan:1603 _cpSubclassOf:1656 _cpClassSwitch:1667 openClassPlan:1682

**app-io.js** (717 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:101 _normalizeImportedSpell:110 _isValidImportedSpell:121 _collectCharUserSpells:125 _ingestImportedUserSpells:143 _spellBaseById:189 _unpackSpell:197 _countUnresolvedSpells:219 _unresolvedNote:227 _importTooNew:232 _packSpell:241 _packCharForExport:252 _unpackCharSpells:259 _buildCharEnvelope:265 _charExportFileName:280 _downloadText:283 _shareableFile:294 shareOneCharacter:305 copyCharToClipboard:322 pasteCharFromClipboard:335 _extractCharsFromImport:353 _applyFullRestore:365 _warnEditionMix:409 run:410 importData:425 importOneCharacter:484 _importOneCharText:501 _consumeLaunchFiles:582 _importLaunchText:615 exportSpells:622 importSpells:631 exportSessionLog:704

**app-combat.js** (3340 строк, 151 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:244 toggleAbilOpen:272 abilityBreakdown:284 openAbilityInfo:312 toggleExpertise:347 loadExpertise:366 updateSkillProfCount:380 updateSkillSources:392 updateClassFeatures:416 calculateAC:431 toggleInspiration:492 updateStatusCounter:505 updateStatusBar:519 updateInspirationLabels:561 updateStatDisplay:578 updateAllStatDisplays:583 adjustStat:587 adjustCoin:610 renderCoinMob:624 openCoinSheet:634 setCoinFromSheet:644 updateCoinTotal:651 openCoinExchange:663 closeCoinExchange:668 previewExchange:672 coinExchangeCalc:700 confirmExchange:705 updateSubclassOptions:728 updateSubclassRecHint:785 featHpPerLevel:800 featHpFlat:809 recalculateHP:818 updateChar:873 toggleProficiency:940 calcStats:963 setSpellStat:1034 calcSpellStats:1045 _toggleNonCasterCards:1097 showSpellCasterCards:1108 onRaceChange:1116 renderBooksRow:1246 openMobSheet:1273 closeMobSheet:1280 mobSheetActs:1282 openBooksSheet:1287 toggleCharBook:1297 populateRaceSelect:1314 _speciesEffective:1347 _renderSpeciesBar:1360 _speciesChoiceOptions:1375 toggleSpeciesChoice:1382 syncSpeciesSpells:1396 rollRandomName:1442 pick:1450 build:1451 _raceSkillAllowance:1510 _raceFlexCount:1516 _raceFlexFits:1522 _raceFlexApply:1529 _setExtrasHtml:1539 renderRaceExtras:1548 toggleHalfElfStat:1719 toggleRaceFlexStat:1745 setRaceVariableTrait:1775 _raceSkillSet:1792 _pickHide:1802 _pickExpandBtn:1806 pickExpand:1809 raceLangGoto:1816 toggleRaceSkill:1824 _classSkillList:1853 _skillsFromOtherSources:1866 _skillsByName:1875 _skillTakenElsewhere:1881 _classSkillHeld:1893 _classSkillSync:1899 renderClassSkills:1930 toggleClassSkill:1974 openRaceFeatModal:2002 removeRaceFeat:2022 applyBasicLockUI:2057 updateLockButtonState:2087 lockBasicInfo:2124 unlockBasicInfo:2144 isSheetLocked:2172 sheetLockGuard:2178 applySheetLockUI:2184 _creationTodo:2213 add:2217 src:2218 scheduleCreationTodo:2282 renderCreationTodo:2287 creationTodoGo:2312 openLockSheet:2322 _creationUiReset:2335 _isMobSheet:2336 renderIdentitySummary:2337 toggleIdentityMore:2356 renderProfSummary:2360 toggleProfCard:2375 openAcSheet:2381 _mobMarkClamp:2389 init:2398 lockSheet:2419 doLock:2423 unlockSheet:2436 onBackgroundChange:2457 _bgSkillsOf:2502 _bgUncheckOld:2509 _bgCheckSkills:2517 renderBackgroundFeature:2529 _bgStatShort:2574 populateBackgroundSelect:2577 _bgRevertStatChoice:2608 _bgAppliedStat:2621 _bgApplyStat:2626 setBgStatMode:2638 toggleBgStat:2650 _bgAfterStats:2673 _bgRevertFeatEffects:2684 syncOriginFeat:2709 toggleBgCustom:2745 _toggleBgCustom14:2785 toggleBgSkillPick:2832 _renderBgCustom14:2859 giveBackgroundEquipment:2896 renderBackgroundExtras:2939 _armorFromSelect:3047 renderArmorSelect:3059 onArmorPick:3094 onShieldPick:3108 onArmorChange:3127 onManualAC:3156 onManualMaxHP:3163 calcCoinWeight:3186 getActiveConditionsForRender:3200 toggleConditionsPopup:3229 closeConditionsPopup:3241 renderConditionsPopup:3247

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1878 строк, 57 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:147 openLevelUpModal:232 _showMulticlassScreen:262 luPickAnotherClass:307 openMulticlassNewClass:314 confirmMulticlassNewClass:373 _showLevelUpPreview:384 closeLevelUpModal:551 confirmLevelUp:564 _luShowResult:691 luFinishChoices:722 luRefreshChoices:729 luSetSubclass:736 luApplyFeatById:755 luApplyAsi:801 _luFeatChoiceAt:822 _luChoiceOpensAt:831 _ccDefsFor:836 _luAsiDone:847 luApplyAllRecommendations:852 luBuildChoicesScreen:972 recBadge:980 luAddRecommendedSpells:1112 luGoToSpellsTab:1140 openLevelDownConfirm:1152 confirmLevelDown:1197 loadDeathSaves:1230 toggleDeathSave:1274 resetDeathSaves:1291 updateHPDisplay:1304 hpToggleRow:1390 hpSetRowOpen:1399 updateHPSummary:1407 updateHPRows:1471 quickHP:1489 setHPAbsolute:1615 addHPHistory:1640 _hpUndoPrepare:1657 _hpUndoConcSnap:1677 _hpUndoConcRestore:1694 undoHPChange:1717 showHPToast:1747 applyCustomHP:1772 saveTempHP:1789 rollHitDieQuick:1803 renderHitDiceIcons:1835 rollDeathSave:1849

**app-inventory.js** (1748 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:995 toggleWeaponFilter:999 fillWeaponPreset:1006 _resetWeaponForm:1024 openWeaponModal:1044 closeWeaponModal:1054 editWeapon:1062 deleteCustomWeapon:1092 _weaponPresetByName:1118 checkWeaponProficiency:1125 submitWeapon:1153 weaponRowTap:1244 renderWeapons:1257 isLightWeapon:1336 toggleTWFStyle:1341 rollTWFAttack:1349 _weaponDamageRoll:1397 rollTWFDamage:1418 rollWeaponAttack:1430 rollWeaponDamage:1485 removeWeapon:1514 _invDndInit:1548 _invClearIndicators:1577 _invSetIndicator:1586 _invCleanup:1591 _invCancelDrag:1598 _invMoveItem:1606 _invCommitDrop:1623 invDragStart:1644 invDragOver:1654 invDragLeave:1671 invDrop:1675 invDragEnd:1681 invTouchStart:1688 invTouchMove:1704 invTouchEnd:1736

**app-spells.js** (2074 строк, 101 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:216 setSpellClass:225 _charSpellClassKey:234 _charMaxCastableLevel:245 _defaultSpellVersion:253 openSpellSearch:256 markCharOwnClassFilter:274 closeSpellSearch:304 _featPickCtx:315 featAddFixedSpells:330 openFeatSpellPicker:356 _featPickProgressText:373 _renderFeatPickBar:379 featPickSetClass:398 _featPickCandidates:406 _renderFeatPickList:416 addFeatSpell:447 removeFeatSpell:467 _parseSpellClassList:490 _syncNewSpellClassChips:494 toggleNewSpellClass:501 _fillNewSpellDamageTypes:526 _toggleHidden:533 updateNewSpellMechFields:541 _hbFormulaCheck:556 _collectHbEffect:565 _spellIdArg:603 _findHomebrewSpell:609 openAddSpellForm:617 _syncCustomSpellAcrossChars:696 _purgeCustomSpellFromChars:714 deleteCustomSpell:733 _deleteCustomSpellConfirmed:742 closeAddSpellForm:756 submitNewSpell:760 renderSpellSearch:850 addSpell:919 removeSpell:935 toggleSpellCard:949 renderMySpells:954 _spellActiveBadgeText:1096 _spellActiveBadgeHtml:1100 updateSpellActiveBadges:1103 _prepEntries:1126 _spellPrepEntry:1141 _prepLimit:1146 calcMaxPrepared:1162 _known2014:1169 calcMaxKnownSpells:1183 _knownSpellCount:1189 calcMaxCantrips:1199 isPrepClass:1208 _subclassSpellNames:1214 spellNeedsPrep:1241 _preparedCount:1257 openSpellCardsMenu:1265 isSpellPrepared:1280 toggleSpellPrepared:1290 renderPrepCounter:1316 _castableSlotOptions:1362 _arcanumResId:1383 castSpell:1393 _castSpellWithSlot:1414 _finishCast:1452 applyCastEffects:1498 _applyCastForm:1535 openCastVariantChooser:1548 pickCastVariant:1587 closeCastVariantChooser:1597 _applyCastSummon:1610 _nextCastInstanceId:1644 _replaceCastInstance:1652 _ensureCastInstance:1682 _applyCastDamage:1702 _rollCastDamage:1718 _startCastRepeat:1783 castRepeatDamage:1797 _applyCastDebuff:1822 castSpellAttackMod:1863 castStatMod:1871 _applyCastHeal:1889 _castHealApply:1910 _applyCastTempHp:1916 applyCastTempHp:1933 _applyCastHpMaxBonus:1947 openCastChooser:1967 closeCastChooser:1988 canCastAsRitual:2001 castRitual:2023 cancelRitual:2062

**app-party.js** (2376 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentSafeIcon:270 _pentNormalize:275 _pentImport:298 openAddAllyModal:339 openEditAllyModal:340 closeAddAllyModal:341 saveAlly:342 deleteAlly:343 setAllyStatus:344 exportAllies:345 importAllies:346 openAddNPCModal:348 openEditNPCModal:349 closeAddNPCModal:350 saveNPC:351 deleteNPC:352 setNPCStatus:353 exportNPCs:354 importNPCs:355 openAddMonsterModal:357 openEditMonsterModal:358 closeAddMonsterModal:359 saveMonster:360 deleteMonster:361 setMonsterStatus:362 exportMonsters:363 importMonsters:364 _monSigned:371 _monFormFill:372 _monFormStat:388 monsterFormRefresh:389 toggleMonsterSave:405 monsterAddAttackRow:406 _monFormRead:418 _monFormApply:432 monsterSaveBonus:443 monsterStatBlockHtml:448 monsterRoll:474 monsterAttackRoll:478 _monCatalog:489 _monCatalogIndex:495 _monCatalogPut:501 deleteCatalogMonster:511 addMonsterFromCatalog:523 _npcAttColor:543 renderNPCs:549 renderMonsters:590 _openSrdMonsterPickerLazy:645 openSrdMonsterPicker:655 openSrdMonsterPickerForBattle:657 _openSrdMonsterPickerCore:662 closeSrdMonsterPicker:705 setSrdMonsterSearch:710 setSrdMonsterCr:711 setSrdMonsterEdition:712 renderSrdMonsterPicker:714 addMonsterFromSRD:784 openSrdNpcPicker:825 _openSrdNpcPickerCore:834 closeSrdNpcPicker:855 setSrdNpcSearch:857 setSrdNpcAtt:858 renderSrdNpcPicker:860 addNpcFromSRD:891 openBattleTab:921 buildBattleSetupList:934 setBattleSearch:954 toggleBattleSection:955 renderBattleSetup:960 battleEncounterInput:1008 renderBattleDifficulty:1028 toggleBattleCheck:1053 battleDragStart:1058 battleDragOver:1059 battleDrop:1060 battleDragEnd:1068 rollInitiativeValue:1073 sortParticipantsByInitiative:1078 _findPartyMonster:1085 _participantCombatMeta:1095 _makeBattleParticipant:1120 _battleParticipantHP:1133 _addSrdMonsterToBattle:1144 _addCatalogMonsterToBattle:1174 _participantStatBlock:1198 startBattle:1206 getParticipantDesc:1228 showTrackerInfo:1251 getSelfStatusFromHP:1295 syncSelfBattleStatus:1312 renderBattleTracker:1322 renderBattleCastPanels:1415 _battleCondList:1457 _battleCondSet:1465 _battleCondMeta:1470 _battleCondDots:1473 openBattleCondPicker:1487 closeBattleCondPicker:1492 _renderBattleCondPicker:1497 toggleBattleCondition:1544 adjustBattleExhaustion:1559 adjustBattleHP:1578 setBattleHP:1592 setBattleHPMax:1623 setBattleInitiative:1634 rerollInitiative:1646 battleRollD20:1658 removeBattleParticipant:1663 setBattleStatus:1681 _battleStatusFromHp:1691 _battleSyncHpStatus:1701 offerCastDamageToBattle:1712 _castDamageTargets:1729 _castDamageAmount:1735 _renderCastDamageModal:1741 setCastDamageHalf:1804 toggleCastDamageTarget:1812 _castDamageHit:1822 applyCastDamageToTarget:1835 applyCastDamageTargets:1845 closeCastDamageModal:1855 _castHealTargets:1864 offerCastHealToBattle:1870 _renderCastHealModal:1878 toggleCastHealTarget:1923 applyCastHealTargets:1930 closeCastHealModal:1952 _castDebuffTargets:1973 offerCastDebuffToBattle:1979 _renderCastDebuffModal:1995 toggleCastDebuffTarget:2051 pickCastDebuffTarget:2061 applyCastDebuffTargets:2070 closeCastDebuffModal:2098 _battleDebuffChips:2107 removeBattleDebuff:2124 removeBattleDebuffsForSpell:2137 clearAllBattleDebuffs:2152 _logTurn:2157 _battleNewRound:2164 nextTurn:2172 _battleEconomyRow:2188 toggleBattleEconomy:2200 resetBattleEconomy:2206 prevTurn:2210 tickCastEffectsRound:2221 endBattle:2249 _dmRefEsc:2323 _dmRefGroup:2327 renderDmRef:2338 t:2342 openDmRef:2358 closeDmRef:2363 switchDmRef:2367

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1235 строк, 70 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:564 crSlotRecoveryActs:568 recoverSlotByResource:583 crPassiveNotes:608 rollResourceDie:617 crManeuverRows:636 crRowsHtml:653 crSetRows:690 renderClassResources:705 spendResource:723 resetResource:741 toggleResourcePip:751 resetResourcesByRest:773 getJournal:815 addJournalEntry:820 filterJournal:842 renderJournal:849 deleteJournalEntry:885 openAddJournalEntry:894 closeAddJournalEntry:898 saveJournalEntry:901 getCompanions:921 renderCompanions:926 companionHP:971 buildFamiliarFormOptions:984 onCompanionTypeChange:996 applyFamiliarForm:1004 openAddCompanionModal:1016 summonFamiliar:1032 openPrefilledCompanionModal:1042 openEditCompanionModal:1053 closeAddCompanionModal:1072 saveCompanion:1075 deleteCompanion:1100 switchProfilesTab:1116 clipChangelogText:1131 expandChangelogItem:1142 renderChangelog:1148 openItemRef:1193 closeItemRef:1198 switchItemRef:1203 _syncHeaderHeight:1221

**app-dice.js** (1639 строк, 78 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:217 rollDice:221 _quickRollCompute:316 _quickRollModStr:335 _emitDiceRolled:341 _setDiceSettled:349 _setSettledDice:359 _quickRollRecord:376 _quickRollInfoText:383 _quickRollToastText:390 _rollSrc:408 quickRoll:415 renderQuickRollStrip:476 updateQuickRollStripVisibility:499 dismissQuickRollStrip:514 openDiceRollHistory:519 drawDiceSVG:532 _waitDiceBoxModule:551 _diceLsGet:571 _getAccentColor:579 _getDiceTheme:598 _getDiceThemeColor:605 setDiceTheme:608 _syncDiceThemeButtons:614 _getDiceBg:624 setDiceBg:631 _syncDiceBgButtons:637 _diceDbg:647 _initDiceBox:652 animateDice3d:758 animateDice2d:960 buildDie:986 tick:1054 _applyDiceCritGlow:1077 parseDiceFormula:1098 _formulaCanon:1134 _renderFormulaResult:1146 rollFormula:1182 _rollFormulaFrom:1264 rollCustomFormula:1277 renderDiceHistory:1280 createParticles:1302 _diceShapeSvg:1336 renderDiceFan:1343 _paintSelectedDie:1362 _diceHeroSvg:1386 _paintDiceMode:1396 selectDie:1411 rollSelectedDie:1430 toggleDiceFormulaPanel:1439 _savedRollFormula:1458 _savedRollsClean:1461 _savedRollNewId:1476 _savedRollLabel:1479 renderSavedRolls:1483 savedRollRoll:1503 savedRollTap:1510 savedRollEdit:1526 savedRollCancel:1542 savedRollSubmit:1547 savedRollDelete:1568 savedRollFromDice:1586 _diceHotkeys:1607

**app-settings.js** (912 строк, 93 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:172 _getStatsLayout:189 _applyStatsLayout:196 _statsInCards:203 _statsRowTarget:207 _placeStatRows:225 setStatsLayout:241 _syncStatsLayoutButtons:248 _getSheet2Demo:261 _syncSheet2DemoButtons:264 setSheet2Demo:270 _getSheetLock:281 setSheetLock:285 _syncSheetLockButtons:290 _wakeLockSupported:301 _getWakeLockOn:302 _applyWakeLock:306 setWakeLock:321 _syncWakeLockButtons:326 _getHeaderAutohideOn:336 setHeaderAutohide:339 _syncHeaderAutohideButtons:344 _getTrackXpOn:352 _applyTrackXp:355 setTrackXp:358 _syncTrackXpButtons:363 _getAttackDamageOn:384 setAttackDamage:387 _syncAttackDamageButtons:391 isEditionSplit:400 setEditionSplit:403 _syncEditionSplitButtons:408 openBooksScreen:418 _bookRowHtml:422 _renderBooksScreen:432 setBookOn:457 setBooksPreset:463 _afterBooksChange:470 _syncBooksSummary:482 _getStatsCollapsed:496 _applyStatsCollapsed:499 toggleStatsCollapsed:504 _getStoredDensity:518 _getDefaultDensity:526 _getDensity:533 _applyDensity:536 setDensity:540 _syncDensityButtons:546 _onViewportDensityChange:554 _getFontScale:572 _applyFontScale:579 setFontScale:590 _syncFontScaleUi:601 _getGlassAlpha:616 _getGlassBlur:623 _applyGlassAlpha:630 _applyGlassBlur:631 setGlassAlpha:632 setGlassBlur:642 _syncGlassUi:651 _getSpaceMode:700 _applySpaceBg:707 setSpaceMode:722 _syncSpaceButtons:728 _spaceOnScroll:747 _applyDymkaIcons:775 _initAppLinks:788 openSupportLink:820 _isStandalone:832 _isIos:838 _installMode:842 _syncInstallUi:847 installApp:860 openSettingsModal:884 closeSettingsModal:899

**app-asi.js** (805 строк, 37 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:79 buildASIStatGrid:91 getASIMode:112 toggleASIStat:117 updateASIPreview:139 getFeatDef:219 _featPickerList:237 buildFeatList:249 filterFeatList:280 _asiFeatBlocked:289 _featStatPickHtml:302 _asiFeatReady:315 selectFeatStat:319 selectFeat:326 _asiUnlockSheet:347 _asiShowStatModes:356 _statGain:367 applyASI:373 renderTakenFeats:539 removeFeat:586 _agBonus:622 _agPbSpent:632 _agBase:638 _agReady:645 openAbilGen:649 agSetMode:667 agPb:673 _agSwap:683 agStd:690 agPick:696 agRoll:702 _agCtl:715 _agRender:736 agApply:784

**app-progress.js** (887 строк, 50 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:244 _pgClassRow:257 _pgClasses:300 _pgNext:316 _pgClassWord:370 _pgAvailableClasses:379 _pgActions:392 _pgBuild:410 openProgressTab:423 openProgress:433 pgTabActive:444 pgRefresh:451 pgSetSubclass:459 pgFocusSubclass:473 pgLevelUp:490 pgLevelDown:495 pgAfterLevelModal:501 pgAddClass:512 renderClassDev:526 _pgSheetAboutRow:545 _pgSubclassRows:563 syncClassFieldUI:589 openFeatureInfo:632 _fiRuleNotes:675 _mlTotal:714 _mlMissing:719 openMcLayout:725 mlSetClass:737 mlLevel:745 mlSetSub:754 mlAdd:759 mlRemove:765 _mlRender:771 _mlPruneAsi:836 mlApply:847

**app-desktop.js** (487 строк, 14 функций)  
syncFromStatusBar:134 syncStrip:193 setRailOpen:204 _esc:209 _stripEmoji:215 _condIcon:219 setRowExpanded:225 collapseRow:231 renderRrConditions:233 renderRailSlots:279 renderRailConc:321 updateRailHpRow:336 rrApplyHP:351 init:364

**app-help.js** (1169 строк, 54 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:90 setHelpFlag:94 welcomeGoStep:100 showWelcome:110 closeWelcome:117 welcomeContinue:123 welcomeSkipExperienced:129 welcomeBack:135 welcomeFinish:142 dismissWelcome:175 maybeShowWelcome:178 restartOnboarding:183 _tourWide:219 _ensureTourDom:222 _resolveTarget:263 _tourFirstVisible:278 _tourAnyModalVisible:298 _tourModalOpen:304 _tourStartWhenClear:316 startTour:328 startListTour:341 startSheetTour:345 _tourTyping:357 maybeStartSheetTour:362 restartTour:384 startTabTour:409 maybeStartTabTour:427 tourNext:453 tourPrev:458 endTour:464 _showTourStep:474 _setBox:537 _computeTourBoxes:553 snap:555 corner:568 _layoutTourCorners:590 _layoutTour:607 _onTourKey:710 _onTourReflow:716 _bindTourGlobal:720 _unbindTourGlobal:725 _buildListSteps:736 _buildSheetSteps:786 _buildProgressSteps:878 _buildSpellsSteps:936 _buildInventorySteps:973 _buildBattleSteps:1013 _buildNotesSteps:1045 _buildPartySteps:1080 _buildJournalSteps:1138

**app-backup.js** (211 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:175

**app-pdf.js** (1039 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:385 _pdfOrigin2024:415 _pdfAttacks:445 _pdfSpells:482 _pdfInventory:580 _pdfNotes:635 _scLineH:737 _scColor:739 _spellCardList:745 _spellCardBody:758 _spellCardFit:766 _scClip:780 _scWhiteIcon:786 _scCutMarks:808 _scGeom:823 _scDiamond:865 _scDrawCard:870 _spellCardFaces:959

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (7625 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:127 SAVES_DATA:149 CONDITIONS:158 EFFECTS_DATA:181 CLASS_FEATURES:232 SPELL_PREP_CLASSES:482 CANTRIPS_KNOWN_2014:490 SPELLS_KNOWN_2014:498 SPELL_SLOTS_BY_LEVEL:505 CLASS_HIT_DICE:580 SUBCLASSES:586 SOURCE_LABELS:606 SUBCLASS_SOURCE:633 BOOK_CODES:702 _booksOffCache:705 SUBCLASS_LEVEL:746 SUBCLASS_FEATURES:762 WEAPON_PRESETS:1554 ITEM_ICONS:1598 CATEGORY_NAMES:1599 GEAR_PACKS:1608 RACE_DATA:1703 BACKGROUND_SKILLS:2320 BACKGROUND_ALIASES:2399 DEITY_ALIGN_LABELS:2412 DEITIES_DATA:2417 LANGUAGE_CATALOG:2485 RACE_LANGUAGES:2522 CLASS_LANGUAGES:2624 TOOL_CATALOG:2630 RACE_TOOLS:2685 CLASS_TOOLS:2697 SUBCLASS_LANGUAGES:2705 SUBCLASS_TOOLS:2728 RACE_ARMOR:2750 RACE_WEAPONS_SPECIFIC:2756 CLASS_WEAPONS_SPECIFIC:2772 RACE_NAME_POOLS:2785 RACE_NAME_GROUP:2827 SUBCLASS_ARMOR:2842 ARMOR_PRESETS:2873 skills:2890 ABILITY_INFO:2903 CLASS_SKILL_OPTIONS:2943 CLASS_SKILL_COUNT:2958 CLASS_SKILL_MC_COUNT:2959 CLASS_ARMOR_PROFS:2962 CLASS_RESOURCES:2982 ASI_LEVELS:3144 XP_THRESHOLDS:3152 APP_VERSION:3162 APP_VERSION_DATE:3163 APP_TELEGRAM_URL:3169 APP_BOOSTY_URL:3170 FEATS_DATA:3191 APP_CHANGELOG:3513 CASTER_TYPE:7453 THIRD_CASTER_SUBCLASSES:7462 THIRD_CASTER_SLOTS:7469 MULTICLASS_SPELL_SLOTS:7480 MULTICLASS_PREREQUISITES:7505 MULTICLASS_PROFICIENCIES:7523 EDITION_DATA:7552

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (871 строк)  
SPELL_EFFECTS:71

**class-choices.js** (707 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

