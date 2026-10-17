# Карта кода

Сгенерировано `node tools/gen-map.js` — руками не править, перегенерировать после
крупных правок `style.css`, `index.html` или добавления функций.

Как пользоваться: найти нужный диапазон здесь → `Read` с `offset`/`limit` по нему,
вместо чтения файла целиком или разведочных grep. Сам этот файл тоже читается
диапазонами — оглавление ниже указывает строки внутри map.md.

## Оглавление

| Раздел | Строки в map.md |
|---|---|
| style.css — секции | 20–129 |
| index.html — блоки верхнего уровня (`#id:строки`) | 130–172 |
| Функции по файлам (`имя:строка`) | 173–246 |
| Данные — константы верхнего уровня (`имя:строка`) | 247–263 |


## style.css — секции

| Строки | Секция |
|---|---|
| 1–13 | style.css — Стили D&D 5e Character Sheet |
| 14–181 | Design tokens (R1) |
| 182–197 | Алиасы старых переменных (совместимость) |
| 198–217 | THEME-4: компонентные токены базового хрома |
| 218–233 | THEME-5: компонентные токены фичевых зон (партия B) |
| 234–335 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 336–380 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 381–574 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 575–660 | UI-2. Пресеты акцента (8 цветов) |
| 661–872 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 873–1217 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1218–1223 | R2. Базовые компоненты |
| 1224–1382 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1383–1638 | UI-3. Desktop/tablet layout (≥1024px) |
| 1639–1749 | UI5-4: ПК — многоколоночная раскладка листа |
| 1750–1832 | /R2 |
| 1833–2007 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2008–2247 | HEADER (R5: back + name + hamburger) |
| 2248–2313 | КД АВТО-РАСЧЁТ |
| 2314–2383 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2384–2449 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2450–2609 | УСЛОВИЯ |
| 2610–2756 | СПАСБРОСКИ |
| 2757–2908 | CLASS FEATURES |
| 2909–2955 | УБИРАЕМ СТРЕЛКИ |
| 2956–3062 | TAB NAV — 5 tabs + centered FAB dice |
| 3063–3174 | UX-5: лента последних бросков вне модалки |
| 3175–3351 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3352–3371 | HAMBURGER BUTTON |
| 3372–3414 | SIDE DRAWER |
| 3415–3918 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3919–3966 | MENU-8/9: встречающий экран во всё окно. |
| 3967–4059 | MENU-2: плашка последнего героя. |
| 4060–4234 | MENU-3: меню приключения. |
| 4235–4305 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4306–4306 | INVENTORY |
| 4307–4337 | INVENTORY — WEIGHT BAR |
| 4338–4374 | INVENTORY — BACKPACK HEADER |
| 4375–4415 | INVENTORY — FILTERS |
| 4416–4604 | INVENTORY — ITEM CARDS |
| 4605–4970 | COINS — BIG NUMBER CARD GRID |
| 4971–5274 | MODALS |
| 5275–5309 | DICE |
| 5310–5890 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5891–6779 | OTHER STYLES |
| 6780–6850 | HP DISPLAY BLOCK |
| 6851–6876 | MOBILE OPTIMIZATION |
| 6877–7005 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7006–7044 | HP TOAST (snackbar) |
| 7045–7096 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7097–7152 | Confirm Modal |
| 7153–7578 | ⚔️ ОТРЯД & БОЙ |
| 7579–7858 | RACIAL BONUS BAR |
| 7859–8001 | COMPACT STATS GRID |
| 8002–8269 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8270–8322 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8323–8373 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8374–8476 | COMPACT SKILLS |
| 8477–8519 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8520–8591 | ACCORDION |
| 8592–8615 | CLASS RESOURCES |
| 8616–8708 | ASI MODAL |
| 8709–8973 | APP VERSION |
| 8974–8983 | COMPANIONS |
| 8984–9029 | FEATS LIST IN ASI |
| 9030–9276 | PROFILES TABS (Чейнджлог) |
| 9277–9355 | TAKEN FEATS |
| 9356–9552 | SW UPDATE MODAL |
| 9553–9600 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9601–9773 | INVENTORY SLOTS SYSTEM |
| 9774–9973 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9974–10245 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10246–10418 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10419–10488 | 3D DICE CUBE |
| 10489–10863 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10864–10946 | DESKTOP LAYOUT — centered max-width |
| 10947–10970 | INSPIRATION |
| 10971–11010 | CONCENTRATION |
| 11011–11684 | WEAPON CARDS WITH ROLL BUTTONS |
| 11685–11795 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11796–11858 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11859–11885 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11886–12009 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12010–12038 | R6: Ассеты (декор) |
| 12039–13007 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13008–13095 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13096–13104 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13105–13162 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13163–13494 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13495–13521 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13522–13548 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13549–13631 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13632–14732 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14733–14788 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14789–14881 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14882–15195 | DISC-1 · Ромб раскрытия |
| 15196–15785 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15786–15891 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15892–16028 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16029–16263 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16264–16273 | STYLE-8b3-fix: срезанный ромб |
| 16274–16587 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16588–17106 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17107–17141 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17142–17824 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

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

**rules.js** (1768 строк, 118 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 fmtNum:18 calculateMaxHP:24 _hpClassEntries:33 rulesMaxHPBase:47 rulesHasClass:62 rulesHitDicePool:67 _hdSizesDesc:75 rulesHitDiceSpentBy:81 rulesHitDiceLabel:105 rulesPickHitDice:115 rulesClampHitDice:127 rulesRitualMinutes:139 rulesHitDieHeal:146 rulesSpendHitDice:152 charClassLevel:178 charHasClass:188 charClassLevelOr:198 charAsiSlots:207 charEpicSlots:222 charSubclassPending:240 charXpNext:253 rulesJackOfAllTrades:264 charClassSubclass:269 rulesHasFeat:278 rulesHasFightingStyle:283 rulesHasDraconicResilience:295 rulesHasDazzlingFootwork:300 rulesRemarkableAthlete:305 rulesUntrainedCheckBonus:311 rulesHasExpertise:318 getInitiativeMod:324 rulesSaveBonus:340 rulesSkillBonus:346 rulesPassivePerception:361 rulesSpellStats:365 _spellStatMod:385 rulesSpellStatsByClass:393 rulesWeaponMods:411 rulesOffhandDamageMod:427 armorPenalties:436 rulesItemArmor:449 rulesArmorItem:461 rulesAC:472 charCasterLevel:654 classSpellSlotRow:695 getMulticlassSpellSlots:708 rulesRestoreLevelFields:744 rulesApplySpellSlots:763 resolvePactSlots:786 restoreItemCharges:796 rulesHitDieSides:813 rulesShortRest:819 rulesLongRestBlockReason:854 rulesLongRest:867 rulesExhaustionLevel:933 rulesEffectiveHpMax:939 _dsReset:944 _dsCount:945 _dsFill:946 _condAdd:947 _condRemove:948 rulesIsDead:950 rulesIsStable:954 rulesRegainFromZero:959 rulesSetHp:965 rulesDamageAfterDefenses:977 rulesApplyDamage:989 rulesDeathSaveBlockReason:1026 rulesDeathSave:1033 rulesConditionRollMods:1052 rulesEffectiveSpeed:1069 rulesArmorStealthDisadv:1090 rulesFeatPrereqMissing:1099 rulesFeatStatChoice:1126 rulesFeatStatOptions:1134 rulesFeatSlotCount:1147 rulesFeatSpellFits:1152 rulesFeatSpellCandidates:1163 rulesFeatSpellLabel:1167 rulesFeatSpellProgress:1172 rulesFeatClassOptions:1197 rulesFeatFreeResId:1210 rulesResetFeatFree:1213 concSaveParams:1224 rulesCrToXp:1266 rulesCrToProf:1272 rulesCrValue:1279 rulesWildShapeLimits:1290 rulesPolymorphLimits:1314 rulesCombatWildShapeHeal:1319 rulesBeastAllowed:1324 rulesFormStart:1331 rulesFormOwnHp:1345 rulesFormDamage:1350 rulesFormHeal:1365 rulesEncounterMultiplier:1372 rulesEncounterDifficulty:1381 getCharClassPairs:1405 charEditionMismatch:1419 findLangInCatalog:1427 ensureLanguagesArray:1439 recalcLanguagesFromSources:1455 add:1460 findToolInCatalog:1505 ensureToolsArray:1517 getBackgroundDef:1538 validateBgStatChoice:1574 parseBackgroundToolEntry:1594 recalcToolsFromSources:1609 add:1614 ensureArmorWeaponFields:1679 recalcArmorWeaponFromSources:1692 addArmor:1698 addWeapon:1699 addSpec:1748

**app-core.js** (1703 строк, 80 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 _stampCurrentCharUpdated:329 saveToLocal:343 initPersistentStorage:367 _formatStorageBytes:388 updateStorageStatus:396 currentScreenName:457 screenBack:463 _modalVisible:477 _closeOpenModals:480 headerBack:490 _screenMotionOk:523 _screenGhostDrop:529 _screenGhostStart:541 _screenEnter:559 _purgeDraftChars:570 showScreen:583 updateHeaderTitle:691 syncDrawerHeader:745 switchTab:757 openDrawer:787 closeDrawer:800 showCharacterNav:812 hideCharacterNav:820 isInteractive:840 currentActiveTab:863 createNewCharacter:921 getClassColor:943 getClassIcon:958 getAbilityIcon:965 getConditionIcon:980 getConditionChipIcon:1004 getSpellClassIcon:1022 getSchoolSlug:1039 getSchoolIcon:1043 stripLeadingEmoji:1056 formatTimeAgo:1060 setCharSort:1074 setCharSearch:1081 duplicateCharacter:1085 exportOneCharacter:1097 updateCharCounter:1104 onDragStart:1121 onDragOver:1122 onDrop:1123 renderCharacterList:1134 renderCharPlate:1220 deleteCharacter:1279 showConfirmModal:1293 safeSet:1340 safeSetChecked:1344 loadCharacter:1353 showToast:1544 showFieldError:1561 clearFieldError:1583 toastAddAction:1592 emptyStateHtml:1610 openHPHistory:1621 closeHPHistory:1649 updateVersionBlock:1654 forceAppUpdate:1685

**app-migrate.js** (1042 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1034

**app-builds.js** (1743 строк, 47 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _setCharBuildId:181 _stemSet:198 _matchByStems:204 _weaponMatchNames:212 _findWeapon:215 _findArmorPreset:240 placeStartingItem:257 applyBuild:382 _applyBuildCore:405 _pick:915 _glossNorm:1024 _reEscape:1025 _glossEd:1026 _glossBuild:1027 ingest:1029 _glossIndex:1051 glossarizeHtml:1059 _glossPopoverEl:1073 hideGlossPopover:1085 showGlossPopover:1090 _glossBindOnce:1109 openBuildGuide:1140 gx:1163 _list:1164 getBuildLevelRec:1227 getBuildRecChoiceOption:1232 getBuildRecChoiceIds:1240 getBuildRecFeat:1245 getBuildRecAsi:1255 getBuildRecSubclass:1262 parseAsiFromHeadline:1270 _buildFeatNameMap:1284 parseFeatFromHeadline:1326 parseSpellsFromHeadline:1343 getBuildRecSpellObjs:1589 openBuildPlan:1609 _cpSubclassOf:1662 _cpClassSwitch:1673 openClassPlan:1688

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

**app-hp.js** (1882 строк, 57 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:147 openLevelUpModal:232 _showMulticlassScreen:262 luPickAnotherClass:307 openMulticlassNewClass:314 confirmMulticlassNewClass:373 _showLevelUpPreview:384 closeLevelUpModal:551 confirmLevelUp:564 _luShowResult:691 luFinishChoices:722 luRefreshChoices:729 luSetSubclass:736 luApplyFeatById:755 luApplyAsi:801 _luFeatChoiceAt:822 _luChoiceOpensAt:831 _ccDefsFor:836 _luAsiDone:847 luApplyAllRecommendations:852 luBuildChoicesScreen:972 recBadge:980 luAddRecommendedSpells:1112 luGoToSpellsTab:1140 openLevelDownConfirm:1152 confirmLevelDown:1197 loadDeathSaves:1230 toggleDeathSave:1274 resetDeathSaves:1291 updateHPDisplay:1304 hpToggleRow:1394 hpSetRowOpen:1403 updateHPSummary:1411 updateHPRows:1475 quickHP:1493 setHPAbsolute:1619 addHPHistory:1644 _hpUndoPrepare:1661 _hpUndoConcSnap:1681 _hpUndoConcRestore:1698 undoHPChange:1721 showHPToast:1751 applyCustomHP:1776 saveTempHP:1793 rollHitDieQuick:1807 renderHitDiceIcons:1839 rollDeathSave:1853

**app-inventory.js** (1750 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:463 syncItemArmorFields:468 syncWornArmor:480 submitItem:509 openMagicCatalog:580 closeMagicCatalog:597 renderMagicCatalog:602 fillFromMagicItem:634 openGearCatalog:687 closeGearCatalog:703 renderGearPacks:708 renderGearCatalog:718 fillFromGearItem:746 addPackToInventory:769 rollTrinket:791 _weaponPresets2024:827 _weaponMasteryGrant:848 getWeaponMasteryLimit:873 canMasterWeapon:878 getWeaponMasteryProp:887 isWeaponMastered:894 toggleWeaponMastery:897 _weaponCatalog:916 renderWeaponPresets:930 filterWeaponPresets:996 toggleWeaponFilter:1000 fillWeaponPreset:1007 _resetWeaponForm:1025 openWeaponModal:1046 closeWeaponModal:1056 editWeapon:1064 deleteCustomWeapon:1094 _weaponPresetByName:1120 checkWeaponProficiency:1127 submitWeapon:1155 weaponRowTap:1246 renderWeapons:1259 isLightWeapon:1338 toggleTWFStyle:1343 rollTWFAttack:1351 _weaponDamageRoll:1399 rollTWFDamage:1420 rollWeaponAttack:1432 rollWeaponDamage:1487 removeWeapon:1516 _invDndInit:1550 _invClearIndicators:1579 _invSetIndicator:1588 _invCleanup:1593 _invCancelDrag:1600 _invMoveItem:1608 _invCommitDrop:1625 invDragStart:1646 invDragOver:1656 invDragLeave:1673 invDrop:1677 invDragEnd:1683 invTouchStart:1690 invTouchMove:1706 invTouchEnd:1738

**app-spells.js** (2075 строк, 101 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:217 setSpellClass:226 _charSpellClassKey:235 _charMaxCastableLevel:246 _defaultSpellVersion:254 openSpellSearch:257 markCharOwnClassFilter:275 closeSpellSearch:305 _featPickCtx:316 featAddFixedSpells:331 openFeatSpellPicker:357 _featPickProgressText:374 _renderFeatPickBar:380 featPickSetClass:399 _featPickCandidates:407 _renderFeatPickList:417 addFeatSpell:448 removeFeatSpell:468 _parseSpellClassList:491 _syncNewSpellClassChips:495 toggleNewSpellClass:502 _fillNewSpellDamageTypes:527 _toggleHidden:534 updateNewSpellMechFields:542 _hbFormulaCheck:557 _collectHbEffect:566 _spellIdArg:604 _findHomebrewSpell:610 openAddSpellForm:618 _syncCustomSpellAcrossChars:697 _purgeCustomSpellFromChars:715 deleteCustomSpell:734 _deleteCustomSpellConfirmed:743 closeAddSpellForm:757 submitNewSpell:761 renderSpellSearch:851 addSpell:920 removeSpell:936 toggleSpellCard:950 renderMySpells:955 _spellActiveBadgeText:1097 _spellActiveBadgeHtml:1101 updateSpellActiveBadges:1104 _prepEntries:1127 _spellPrepEntry:1142 _prepLimit:1147 calcMaxPrepared:1163 _known2014:1170 calcMaxKnownSpells:1184 _knownSpellCount:1190 calcMaxCantrips:1200 isPrepClass:1209 _subclassSpellNames:1215 spellNeedsPrep:1242 _preparedCount:1258 openSpellCardsMenu:1266 isSpellPrepared:1281 toggleSpellPrepared:1291 renderPrepCounter:1317 _castableSlotOptions:1363 _arcanumResId:1384 castSpell:1394 _castSpellWithSlot:1415 _finishCast:1453 applyCastEffects:1499 _applyCastForm:1536 openCastVariantChooser:1549 pickCastVariant:1588 closeCastVariantChooser:1598 _applyCastSummon:1611 _nextCastInstanceId:1645 _replaceCastInstance:1653 _ensureCastInstance:1683 _applyCastDamage:1703 _rollCastDamage:1719 _startCastRepeat:1784 castRepeatDamage:1798 _applyCastDebuff:1823 castSpellAttackMod:1864 castStatMod:1872 _applyCastHeal:1890 _castHealApply:1911 _applyCastTempHp:1917 applyCastTempHp:1934 _applyCastHpMaxBonus:1948 openCastChooser:1968 closeCastChooser:1989 canCastAsRitual:2002 castRitual:2024 cancelRitual:2063

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1528 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:454 notesPickRandomVariant:459 _applyVariantToSection:472 _setSectionText:486 _mdToHtml:501 closeLists:513 _countStats:553 _bindSectionInputs:560 _updateStats:573 _notesHotkeys:582 notesMdInsert:597 wrap:606 linePrefix:613 notesTogglePreview:663 notesUpdateSection:682 _syncTakenFeatsLocation:697 _renderEntriesView:710 _renderEntryCard:765 notesPinDragStart:812 notesPinDragOver:822 notesPinDragLeave:831 notesPinDrop:836 notesPinDragEnd:846 _notesReorderPinned:855 notesSetTagFilter:883 notesJumpToNpc:889 notesOpenEntryModal:917 notesCloseEntryModal:951 _notesRenderModalTags:956 notesAddModalTag:968 notesModalTagKeydown:978 notesRemoveModalTag:982 notesSaveEntryModal:988 notesDeleteEntry:1036 notesTogglePin:1057 _notesLogJournal:1092 notesSearchInput:1118 notesSearchKeydown:1125 _hlText:1143 _renderSearchResults:1153 notesClearSearch:1232 notesToggleMenu:1243 _notesMenuClose:1256 notesMenuAction:1262 _notesCharName:1277 _notesTriggerDownload:1282 notesExportMd:1290 notesExportJson:1335 _notesSanitizeEntry:1347 _notesFileTooBig:1358 notesHandleImportJson:1366 _notesApplyImport:1387 notesHandleImportMd:1427 notesPrint:1463 _notesFlashSaved:1494

**app-ui.js** (1238 строк, 70 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:564 crSlotRecoveryActs:568 recoverSlotByResource:583 crPassiveNotes:608 rollResourceDie:617 crManeuverRows:636 crRowsHtml:653 crSetRows:690 renderClassResources:705 spendResource:723 resetResource:741 toggleResourcePip:751 resetResourcesByRest:773 getJournal:815 addJournalEntry:820 filterJournal:842 renderJournal:849 deleteJournalEntry:885 openAddJournalEntry:894 closeAddJournalEntry:899 saveJournalEntry:902 getCompanions:922 renderCompanions:927 companionHP:972 buildFamiliarFormOptions:985 onCompanionTypeChange:997 applyFamiliarForm:1005 openAddCompanionModal:1017 summonFamiliar:1034 openPrefilledCompanionModal:1044 openEditCompanionModal:1055 closeAddCompanionModal:1075 saveCompanion:1078 deleteCompanion:1103 switchProfilesTab:1119 clipChangelogText:1134 expandChangelogItem:1145 renderChangelog:1151 openItemRef:1196 closeItemRef:1201 switchItemRef:1206 _syncHeaderHeight:1224

**app-dice.js** (1666 строк, 81 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 _diceHistoryRefresh:162 resetDiceResult:167 _updateDiceHistoryBadge:179 rollCustomFormulaFromMain:192 diceInsertToken:196 diceFormulaBackspace:202 setDiceMode:221 rollDiceWithSelectedMode:228 rollDice:232 _quickRollCompute:327 _quickRollModStr:346 _emitDiceRolled:352 _setDiceSettled:360 _setSettledDice:370 _quickRollRecord:387 _quickRollInfoText:394 _quickRollToastText:401 _rollSrc:419 quickRoll:426 renderQuickRollStrip:487 updateQuickRollStripVisibility:510 dismissQuickRollStrip:525 openDiceRollHistory:530 drawDiceSVG:543 _waitDiceBoxModule:562 _diceLsGet:582 _getAccentColor:590 _getDiceTheme:609 _getDiceThemeColor:616 setDiceTheme:619 _syncDiceThemeButtons:625 _getDiceBg:635 setDiceBg:642 _syncDiceBgButtons:648 _diceDbg:658 _initDiceBox:663 animateDice3d:769 animateDice2d:971 buildDie:997 tick:1065 _applyDiceCritGlow:1088 parseDiceFormula:1109 _formulaCanon:1145 _renderFormulaResult:1157 rollFormula:1193 _rollFormulaFrom:1275 _diceFieldErrOpts:1290 diceFormulaBlur:1293 rollCustomFormula:1303 renderDiceHistory:1306 createParticles:1328 _diceShapeSvg:1362 renderDiceFan:1369 _paintSelectedDie:1388 _diceHeroSvg:1412 _paintDiceMode:1422 selectDie:1437 rollSelectedDie:1456 toggleDiceFormulaPanel:1465 _savedRollFormula:1484 _savedRollsClean:1487 _savedRollNewId:1502 _savedRollLabel:1505 renderSavedRolls:1509 savedRollRoll:1529 savedRollTap:1536 savedRollEdit:1552 savedRollCancel:1569 savedRollSubmit:1574 savedRollDelete:1595 savedRollFromDice:1613 _diceHotkeys:1634

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

**data.js** (7729 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:127 SAVES_DATA:149 CONDITIONS:158 EFFECTS_DATA:181 CLASS_FEATURES:232 SPELL_PREP_CLASSES:482 CANTRIPS_KNOWN_2014:490 SPELLS_KNOWN_2014:498 SPELL_SLOTS_BY_LEVEL:505 CLASS_HIT_DICE:580 SUBCLASSES:586 SOURCE_LABELS:606 SUBCLASS_SOURCE:633 BOOK_CODES:702 _booksOffCache:705 SUBCLASS_LEVEL:746 SUBCLASS_FEATURES:762 WEAPON_PRESETS:1554 ITEM_ICONS:1598 CATEGORY_NAMES:1599 GEAR_PACKS:1608 RACE_DATA:1703 BACKGROUND_SKILLS:2320 BACKGROUND_ALIASES:2399 DEITY_ALIGN_LABELS:2412 DEITIES_DATA:2417 LANGUAGE_CATALOG:2485 RACE_LANGUAGES:2522 CLASS_LANGUAGES:2624 TOOL_CATALOG:2630 RACE_TOOLS:2685 CLASS_TOOLS:2697 SUBCLASS_LANGUAGES:2705 SUBCLASS_TOOLS:2728 RACE_ARMOR:2750 RACE_WEAPONS_SPECIFIC:2756 CLASS_WEAPONS_SPECIFIC:2772 RACE_NAME_POOLS:2785 RACE_NAME_GROUP:2827 SUBCLASS_ARMOR:2842 ARMOR_PRESETS:2873 skills:2890 ABILITY_INFO:2903 CLASS_SKILL_OPTIONS:2943 CLASS_SKILL_COUNT:2958 CLASS_SKILL_MC_COUNT:2959 CLASS_ARMOR_PROFS:2962 CLASS_RESOURCES:2982 ASI_LEVELS:3144 XP_THRESHOLDS:3152 APP_VERSION:3162 APP_VERSION_DATE:3163 APP_TELEGRAM_URL:3169 APP_BOOSTY_URL:3170 FEATS_DATA:3191 APP_CHANGELOG:3513 CASTER_TYPE:7557 THIRD_CASTER_SUBCLASSES:7566 THIRD_CASTER_SLOTS:7573 MULTICLASS_SPELL_SLOTS:7584 MULTICLASS_PREREQUISITES:7609 MULTICLASS_PROFICIENCIES:7627 EDITION_DATA:7656

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (871 строк)  
SPELL_EFFECTS:71

**class-choices.js** (707 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

