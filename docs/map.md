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
| 234–337 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 338–382 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 383–576 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 577–662 | UI-2. Пресеты акцента (8 цветов) |
| 663–874 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 875–1219 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1220–1225 | R2. Базовые компоненты |
| 1226–1384 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1385–1640 | UI-3. Desktop/tablet layout (≥1024px) |
| 1641–1751 | UI5-4: ПК — многоколоночная раскладка листа |
| 1752–1834 | /R2 |
| 1835–2009 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2010–2249 | HEADER (R5: back + name + hamburger) |
| 2250–2315 | КД АВТО-РАСЧЁТ |
| 2316–2385 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2386–2451 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2452–2611 | УСЛОВИЯ |
| 2612–2758 | СПАСБРОСКИ |
| 2759–2910 | CLASS FEATURES |
| 2911–2957 | УБИРАЕМ СТРЕЛКИ |
| 2958–3064 | TAB NAV — 5 tabs + centered FAB dice |
| 3065–3178 | UX-5: лента последних бросков вне модалки |
| 3179–3355 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3356–3375 | HAMBURGER BUTTON |
| 3376–3418 | SIDE DRAWER |
| 3419–3922 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3923–3970 | MENU-8/9: встречающий экран во всё окно. |
| 3971–4063 | MENU-2: плашка последнего героя. |
| 4064–4238 | MENU-3: меню приключения. |
| 4239–4309 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4310–4310 | INVENTORY |
| 4311–4341 | INVENTORY — WEIGHT BAR |
| 4342–4378 | INVENTORY — BACKPACK HEADER |
| 4379–4419 | INVENTORY — FILTERS |
| 4420–4608 | INVENTORY — ITEM CARDS |
| 4609–4974 | COINS — BIG NUMBER CARD GRID |
| 4975–5278 | MODALS |
| 5279–5313 | DICE |
| 5314–5894 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5895–6783 | OTHER STYLES |
| 6784–6854 | HP DISPLAY BLOCK |
| 6855–6880 | MOBILE OPTIMIZATION |
| 6881–7009 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7010–7048 | HP TOAST (snackbar) |
| 7049–7100 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7101–7156 | Confirm Modal |
| 7157–7582 | ⚔️ ОТРЯД & БОЙ |
| 7583–7862 | RACIAL BONUS BAR |
| 7863–8005 | COMPACT STATS GRID |
| 8006–8273 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8274–8326 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8327–8377 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8378–8480 | COMPACT SKILLS |
| 8481–8523 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8524–8595 | ACCORDION |
| 8596–8619 | CLASS RESOURCES |
| 8620–8712 | ASI MODAL |
| 8713–8977 | APP VERSION |
| 8978–8987 | COMPANIONS |
| 8988–9033 | FEATS LIST IN ASI |
| 9034–9280 | PROFILES TABS (Чейнджлог) |
| 9281–9359 | TAKEN FEATS |
| 9360–9556 | SW UPDATE MODAL |
| 9557–9604 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9605–9777 | INVENTORY SLOTS SYSTEM |
| 9778–9977 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9978–10249 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10250–10422 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10423–10492 | 3D DICE CUBE |
| 10493–10867 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10868–10950 | DESKTOP LAYOUT — centered max-width |
| 10951–10974 | INSPIRATION |
| 10975–11014 | CONCENTRATION |
| 11015–11691 | WEAPON CARDS WITH ROLL BUTTONS |
| 11692–11802 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11803–11865 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11866–11892 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11893–12016 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12017–12045 | R6: Ассеты (декор) |
| 12046–13014 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13015–13102 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13103–13111 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13112–13169 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13170–13501 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13502–13528 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13529–13555 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13556–13638 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13639–14739 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14740–14795 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14796–14888 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14889–15202 | DISC-1 · Ромб раскрытия |
| 15203–15792 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15793–15898 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15899–16035 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16036–16270 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16271–16280 | STYLE-8b3-fix: срезанный ромб |
| 16281–16594 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16595–17113 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17114–17148 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17149–17830 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

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

**rules.js** (1784 строк, 119 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesAuraOfProtection:337 rulesSaveBonus:342 rulesDivineSmiteFormula:350 rulesSkillBonus:357 rulesPassivePerception:372 rulesSpellStats:376 _spellStatMod:401 rulesSpellStatsByClass:409 rulesWeaponMods:427 rulesOffhandDamageMod:443 armorPenalties:452 rulesItemArmor:465 rulesArmorItem:477 rulesAC:488 charCasterLevel:670 classSpellSlotRow:711 getMulticlassSpellSlots:724 rulesRestoreLevelFields:760 rulesApplySpellSlots:779 resolvePactSlots:802 restoreItemCharges:812 rulesHitDieSides:829 rulesShortRest:835 rulesLongRestBlockReason:870 rulesLongRest:883 rulesExhaustionLevel:949 rulesEffectiveHpMax:955 _dsReset:960 _dsCount:961 _dsFill:962 _condAdd:963 _condRemove:964 rulesIsDead:966 rulesIsStable:970 rulesRegainFromZero:975 rulesSetHp:981 rulesDamageAfterDefenses:993 rulesApplyDamage:1005 rulesDeathSaveBlockReason:1042 rulesDeathSave:1049 rulesConditionRollMods:1068 rulesEffectiveSpeed:1085 rulesArmorStealthDisadv:1106 rulesFeatPrereqMissing:1115 rulesFeatStatChoice:1142 rulesFeatStatOptions:1150 rulesFeatSlotCount:1163 rulesFeatSpellFits:1168 rulesFeatSpellCandidates:1179 rulesFeatSpellLabel:1183 rulesFeatSpellProgress:1188 rulesFeatClassOptions:1213 rulesFeatFreeResId:1226 rulesResetFeatFree:1229 concSaveParams:1240 rulesCrToXp:1282 rulesCrToProf:1288 rulesCrValue:1295 rulesWildShapeLimits:1306 rulesPolymorphLimits:1330 rulesCombatWildShapeHeal:1335 rulesBeastAllowed:1340 rulesFormStart:1347 rulesFormOwnHp:1361 rulesFormDamage:1366 rulesFormHeal:1381 rulesEncounterMultiplier:1388 rulesEncounterDifficulty:1397 getCharClassPairs:1421 charEditionMismatch:1435 findLangInCatalog:1443 ensureLanguagesArray:1455 recalcLanguagesFromSources:1471 add:1476 findToolInCatalog:1521 ensureToolsArray:1533 getBackgroundDef:1554 validateBgStatChoice:1590 parseBackgroundToolEntry:1610 recalcToolsFromSources:1625 add:1630 ensureArmorWeaponFields:1695 recalcArmorWeaponFromSources:1708 addArmor:1714 addWeapon:1715 addSpec:1764

**app-core.js** (1709 строк, 81 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:462 screenBack:468 _modalVisible:482 _closeOpenModals:485 headerBack:495 _screenMotionOk:528 _screenGhostDrop:534 _screenGhostStart:546 _screenEnter:564 _purgeDraftChars:575 showScreen:588 updateHeaderTitle:696 syncDrawerHeader:750 switchTab:762 openDrawer:792 closeDrawer:805 showCharacterNav:817 hideCharacterNav:825 isInteractive:845 currentActiveTab:868 createNewCharacter:926 getClassColor:948 getClassIcon:963 getAbilityIcon:970 getConditionIcon:985 getConditionChipIcon:1009 getSpellClassIcon:1027 getSchoolSlug:1044 getSchoolIcon:1048 stripLeadingEmoji:1061 formatTimeAgo:1065 setCharSort:1079 setCharSearch:1086 duplicateCharacter:1090 exportOneCharacter:1102 updateCharCounter:1109 onDragStart:1126 onDragOver:1127 onDrop:1128 renderCharacterList:1139 renderCharPlate:1225 deleteCharacter:1284 showConfirmModal:1298 safeSet:1345 safeSetChecked:1349 loadCharacter:1358 showToast:1549 showFieldError:1566 clearFieldError:1588 toastAddAction:1598 emptyStateHtml:1616 openHPHistory:1627 closeHPHistory:1655 updateVersionBlock:1660 forceAppUpdate:1691

**app-migrate.js** (1042 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1034

**app-builds.js** (1743 строк, 47 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _setCharBuildId:181 _stemSet:198 _matchByStems:204 _weaponMatchNames:212 _findWeapon:215 _findArmorPreset:240 placeStartingItem:257 applyBuild:382 _applyBuildCore:405 _pick:915 _glossNorm:1024 _reEscape:1025 _glossEd:1026 _glossBuild:1027 ingest:1029 _glossIndex:1051 glossarizeHtml:1059 _glossPopoverEl:1073 hideGlossPopover:1085 showGlossPopover:1090 _glossBindOnce:1109 openBuildGuide:1140 gx:1163 _list:1164 getBuildLevelRec:1227 getBuildRecChoiceOption:1232 getBuildRecChoiceIds:1240 getBuildRecFeat:1245 getBuildRecAsi:1255 getBuildRecSubclass:1262 parseAsiFromHeadline:1270 _buildFeatNameMap:1284 parseFeatFromHeadline:1326 parseSpellsFromHeadline:1343 getBuildRecSpellObjs:1589 openBuildPlan:1609 _cpSubclassOf:1662 _cpClassSwitch:1673 openClassPlan:1688

**app-io.js** (717 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:101 _normalizeImportedSpell:110 _isValidImportedSpell:121 _collectCharUserSpells:125 _ingestImportedUserSpells:143 _spellBaseById:189 _unpackSpell:197 _countUnresolvedSpells:219 _unresolvedNote:227 _importTooNew:232 _packSpell:241 _packCharForExport:252 _unpackCharSpells:259 _buildCharEnvelope:265 _charExportFileName:280 _downloadText:283 _shareableFile:294 shareOneCharacter:305 copyCharToClipboard:322 pasteCharFromClipboard:335 _extractCharsFromImport:353 _applyFullRestore:365 _warnEditionMix:409 run:410 importData:425 importOneCharacter:484 _importOneCharText:501 _consumeLaunchFiles:582 _importLaunchText:615 exportSpells:622 importSpells:631 exportSessionLog:704

**app-combat.js** (3339 строк, 151 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:132 rollSkillCheck:146 initSaves:165 autoSelectProficiencies:200 initSkills:243 toggleAbilOpen:271 abilityBreakdown:283 openAbilityInfo:311 toggleExpertise:346 loadExpertise:365 updateSkillProfCount:379 updateSkillSources:391 updateClassFeatures:415 calculateAC:430 toggleInspiration:491 updateStatusCounter:504 updateStatusBar:518 updateInspirationLabels:560 updateStatDisplay:577 updateAllStatDisplays:582 adjustStat:586 adjustCoin:609 renderCoinMob:623 openCoinSheet:633 setCoinFromSheet:643 updateCoinTotal:650 openCoinExchange:662 closeCoinExchange:667 previewExchange:671 coinExchangeCalc:699 confirmExchange:704 updateSubclassOptions:727 updateSubclassRecHint:784 featHpPerLevel:799 featHpFlat:808 recalculateHP:817 updateChar:872 toggleProficiency:939 calcStats:962 setSpellStat:1033 calcSpellStats:1044 _toggleNonCasterCards:1096 showSpellCasterCards:1107 onRaceChange:1115 renderBooksRow:1245 openMobSheet:1272 closeMobSheet:1279 mobSheetActs:1281 openBooksSheet:1286 toggleCharBook:1296 populateRaceSelect:1313 _speciesEffective:1346 _renderSpeciesBar:1359 _speciesChoiceOptions:1374 toggleSpeciesChoice:1381 syncSpeciesSpells:1395 rollRandomName:1441 pick:1449 build:1450 _raceSkillAllowance:1509 _raceFlexCount:1515 _raceFlexFits:1521 _raceFlexApply:1528 _setExtrasHtml:1538 renderRaceExtras:1547 toggleHalfElfStat:1718 toggleRaceFlexStat:1744 setRaceVariableTrait:1774 _raceSkillSet:1791 _pickHide:1801 _pickExpandBtn:1805 pickExpand:1808 raceLangGoto:1815 toggleRaceSkill:1823 _classSkillList:1852 _skillsFromOtherSources:1865 _skillsByName:1874 _skillTakenElsewhere:1880 _classSkillHeld:1892 _classSkillSync:1898 renderClassSkills:1929 toggleClassSkill:1973 openRaceFeatModal:2001 removeRaceFeat:2021 applyBasicLockUI:2056 updateLockButtonState:2086 lockBasicInfo:2123 unlockBasicInfo:2143 isSheetLocked:2171 sheetLockGuard:2177 applySheetLockUI:2183 _creationTodo:2212 add:2216 src:2217 scheduleCreationTodo:2281 renderCreationTodo:2286 creationTodoGo:2311 openLockSheet:2321 _creationUiReset:2334 _isMobSheet:2335 renderIdentitySummary:2336 toggleIdentityMore:2355 renderProfSummary:2359 toggleProfCard:2374 openAcSheet:2380 _mobMarkClamp:2388 init:2397 lockSheet:2418 doLock:2422 unlockSheet:2435 onBackgroundChange:2456 _bgSkillsOf:2501 _bgUncheckOld:2508 _bgCheckSkills:2516 renderBackgroundFeature:2528 _bgStatShort:2573 populateBackgroundSelect:2576 _bgRevertStatChoice:2607 _bgAppliedStat:2620 _bgApplyStat:2625 setBgStatMode:2637 toggleBgStat:2649 _bgAfterStats:2672 _bgRevertFeatEffects:2683 syncOriginFeat:2708 toggleBgCustom:2744 _toggleBgCustom14:2784 toggleBgSkillPick:2831 _renderBgCustom14:2858 giveBackgroundEquipment:2895 renderBackgroundExtras:2938 _armorFromSelect:3046 renderArmorSelect:3058 onArmorPick:3093 onShieldPick:3107 onArmorChange:3126 onManualAC:3155 onManualMaxHP:3162 calcCoinWeight:3185 getActiveConditionsForRender:3199 toggleConditionsPopup:3228 closeConditionsPopup:3240 renderConditionsPopup:3246

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1882 строк, 57 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:147 openLevelUpModal:232 _showMulticlassScreen:262 luPickAnotherClass:307 openMulticlassNewClass:314 confirmMulticlassNewClass:373 _showLevelUpPreview:384 closeLevelUpModal:551 confirmLevelUp:564 _luShowResult:691 luFinishChoices:722 luRefreshChoices:729 luSetSubclass:736 luApplyFeatById:755 luApplyAsi:801 _luFeatChoiceAt:822 _luChoiceOpensAt:831 _ccDefsFor:836 _luAsiDone:847 luApplyAllRecommendations:852 luBuildChoicesScreen:972 recBadge:980 luAddRecommendedSpells:1112 luGoToSpellsTab:1140 openLevelDownConfirm:1152 confirmLevelDown:1197 loadDeathSaves:1230 toggleDeathSave:1274 resetDeathSaves:1291 updateHPDisplay:1304 hpToggleRow:1394 hpSetRowOpen:1403 updateHPSummary:1411 updateHPRows:1475 quickHP:1493 setHPAbsolute:1619 addHPHistory:1644 _hpUndoPrepare:1661 _hpUndoConcSnap:1681 _hpUndoConcRestore:1698 undoHPChange:1721 showHPToast:1751 applyCustomHP:1776 saveTempHP:1793 rollHitDieQuick:1807 renderHitDiceIcons:1839 rollDeathSave:1853

**app-inventory.js** (1826 строк, 83 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:463 syncItemArmorFields:468 syncWornArmor:480 submitItem:509 openMagicCatalog:580 closeMagicCatalog:597 renderMagicCatalog:602 fillFromMagicItem:634 openGearCatalog:687 closeGearCatalog:703 renderGearPacks:708 renderGearCatalog:718 fillFromGearItem:746 addPackToInventory:769 rollTrinket:791 _weaponPresets2024:827 _weaponMasteryGrant:848 getWeaponMasteryLimit:873 canMasterWeapon:878 getWeaponMasteryProp:887 isWeaponMastered:894 toggleWeaponMastery:897 _weaponCatalog:916 renderWeaponPresets:930 filterWeaponPresets:996 toggleWeaponFilter:1000 fillWeaponPreset:1007 _resetWeaponForm:1025 openWeaponModal:1046 closeWeaponModal:1056 editWeapon:1064 deleteCustomWeapon:1094 _weaponPresetByName:1120 checkWeaponProficiency:1127 submitWeapon:1155 weaponRowTap:1246 renderWeapons:1260 isLightWeapon:1340 toggleTWFStyle:1345 rollTWFAttack:1353 _weaponDamageRoll:1401 rollTWFDamage:1422 rollWeaponAttack:1434 _attackBonusTail:1495 rollWeaponDamage:1499 _canDivineSmite:1532 openDivineSmite:1536 _divineSmite:1560 removeWeapon:1592 _invDndInit:1626 _invClearIndicators:1655 _invSetIndicator:1664 _invCleanup:1669 _invCancelDrag:1676 _invMoveItem:1684 _invCommitDrop:1701 invDragStart:1722 invDragOver:1732 invDragLeave:1749 invDrop:1753 invDragEnd:1759 invTouchStart:1766 invTouchMove:1782 invTouchEnd:1814

**app-spells.js** (2059 строк, 101 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:103 adjustPactSlots:114 syncSpellSlotsFromClass:126 updateSpellSlots:135 toggleSpellSlot:146 adjustSpellSlots:157 restoreAllSlots:168 setSpellVersion:179 _syncSpellVersionLock:190 setSpellClass:199 _charSpellClassKey:208 _charMaxCastableLevel:219 _defaultSpellVersion:227 openSpellSearch:230 markCharOwnClassFilter:248 closeSpellSearch:278 _featPickCtx:289 featAddFixedSpells:304 openFeatSpellPicker:330 _featPickProgressText:347 _renderFeatPickBar:353 featPickSetClass:372 _featPickCandidates:380 _renderFeatPickList:390 addFeatSpell:421 removeFeatSpell:441 _parseSpellClassList:464 _syncNewSpellClassChips:468 toggleNewSpellClass:475 _fillNewSpellDamageTypes:500 _toggleHidden:507 updateNewSpellMechFields:515 _hbFormulaCheck:530 _collectHbEffect:539 _spellIdArg:577 _findHomebrewSpell:583 openAddSpellForm:591 _syncCustomSpellAcrossChars:670 _purgeCustomSpellFromChars:688 deleteCustomSpell:707 _deleteCustomSpellConfirmed:716 closeAddSpellForm:730 submitNewSpell:734 renderSpellSearch:824 addSpell:893 removeSpell:909 toggleSpellCard:923 renderMySpells:928 _spellActiveBadgeText:1070 _spellActiveBadgeHtml:1074 updateSpellActiveBadges:1077 _prepEntries:1100 _spellPrepEntry:1115 _prepLimit:1120 calcMaxPrepared:1136 _known2014:1143 calcMaxKnownSpells:1157 _knownSpellCount:1163 calcMaxCantrips:1173 isPrepClass:1182 _subclassSpellNames:1188 spellNeedsPrep:1215 _preparedCount:1231 openSpellCardsMenu:1239 isSpellPrepared:1254 toggleSpellPrepared:1264 renderPrepCounter:1290 _castableSlotOptions:1336 _arcanumResId:1357 castSpell:1367 _castSpellWithSlot:1388 _finishCast:1426 applyCastEffects:1472 _applyCastForm:1509 openCastVariantChooser:1522 pickCastVariant:1561 closeCastVariantChooser:1571 _applyCastSummon:1584 _nextCastInstanceId:1618 _replaceCastInstance:1626 _ensureCastInstance:1656 _applyCastDamage:1676 _rollCastDamage:1703 _startCastRepeat:1768 castRepeatDamage:1782 _applyCastDebuff:1807 castSpellAttackMod:1848 castStatMod:1856 _applyCastHeal:1874 _castHealApply:1895 _applyCastTempHp:1901 applyCastTempHp:1918 _applyCastHpMaxBonus:1932 openCastChooser:1952 closeCastChooser:1973 canCastAsRitual:1986 castRitual:2008 cancelRitual:2047

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1528 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:454 notesPickRandomVariant:459 _applyVariantToSection:472 _setSectionText:486 _mdToHtml:501 closeLists:513 _countStats:553 _bindSectionInputs:560 _updateStats:573 _notesHotkeys:582 notesMdInsert:597 wrap:606 linePrefix:613 notesTogglePreview:663 notesUpdateSection:682 _syncTakenFeatsLocation:697 _renderEntriesView:710 _renderEntryCard:765 notesPinDragStart:812 notesPinDragOver:822 notesPinDragLeave:831 notesPinDrop:836 notesPinDragEnd:846 _notesReorderPinned:855 notesSetTagFilter:883 notesJumpToNpc:889 notesOpenEntryModal:917 notesCloseEntryModal:951 _notesRenderModalTags:956 notesAddModalTag:968 notesModalTagKeydown:978 notesRemoveModalTag:982 notesSaveEntryModal:988 notesDeleteEntry:1036 notesTogglePin:1057 _notesLogJournal:1092 notesSearchInput:1118 notesSearchKeydown:1125 _hlText:1143 _renderSearchResults:1153 notesClearSearch:1232 notesToggleMenu:1243 _notesMenuClose:1256 notesMenuAction:1262 _notesCharName:1277 _notesTriggerDownload:1282 notesExportMd:1290 notesExportJson:1335 _notesSanitizeEntry:1347 _notesFileTooBig:1358 notesHandleImportJson:1366 _notesApplyImport:1387 notesHandleImportMd:1427 notesPrint:1463 _notesFlashSaved:1494

**app-ui.js** (1238 строк, 70 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:564 crSlotRecoveryActs:568 recoverSlotByResource:583 crPassiveNotes:608 rollResourceDie:617 crManeuverRows:636 crRowsHtml:653 crSetRows:690 renderClassResources:705 spendResource:723 resetResource:741 toggleResourcePip:751 resetResourcesByRest:773 getJournal:815 addJournalEntry:820 filterJournal:842 renderJournal:849 deleteJournalEntry:885 openAddJournalEntry:894 closeAddJournalEntry:899 saveJournalEntry:902 getCompanions:922 renderCompanions:927 companionHP:972 buildFamiliarFormOptions:985 onCompanionTypeChange:997 applyFamiliarForm:1005 openAddCompanionModal:1017 summonFamiliar:1034 openPrefilledCompanionModal:1044 openEditCompanionModal:1055 closeAddCompanionModal:1075 saveCompanion:1078 deleteCompanion:1103 switchProfilesTab:1119 clipChangelogText:1134 expandChangelogItem:1145 renderChangelog:1151 openItemRef:1196 closeItemRef:1201 switchItemRef:1206 _syncHeaderHeight:1224

**app-dice.js** (1712 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:539 openDiceRollHistory:544 drawDiceSVG:557 _waitDiceBoxModule:576 _diceLsGet:596 _getAccentColor:604 _getDiceTheme:623 _getDiceThemeColor:630 setDiceTheme:633 _syncDiceThemeButtons:639 _getDiceBg:649 setDiceBg:656 _syncDiceBgButtons:662 _diceDbg:672 _initDiceBox:677 _diceFaceValue:772 animateDice3d:794 animateDice2d:998 buildDie:1024 tick:1092 _applyDiceCritGlow:1115 parseDiceFormula:1136 _formulaCanon:1172 _renderFormulaResult:1184 rollFormula:1220 _rollFormulaFrom:1302 _diceFieldErrOpts:1317 diceFormulaBlur:1323 rollCustomFormula:1333 renderDiceHistory:1336 createParticles:1358 _diceShapeSvg:1392 renderDiceFan:1399 _paintSelectedDie:1418 _diceHeroSvg:1442 _paintDiceMode:1452 selectDie:1467 rollSelectedDie:1486 toggleDiceFormulaPanel:1495 _savedRollFormula:1514 _savedRollsClean:1517 _savedRollNewId:1532 _savedRollLabel:1535 renderSavedRolls:1539 savedRollRoll:1559 savedRollTap:1566 savedRollEdit:1582 savedRollCancel:1599 savedRollSubmit:1604 savedRollDelete:1625 savedRollFromDice:1643 _diceHotkeys:1664

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

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (7761 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:127 SAVES_DATA:149 CONDITIONS:158 EFFECTS_DATA:181 CLASS_FEATURES:232 SPELL_PREP_CLASSES:482 CANTRIPS_KNOWN_2014:490 SPELLS_KNOWN_2014:498 SPELL_SLOTS_BY_LEVEL:505 CLASS_HIT_DICE:580 SUBCLASSES:586 SOURCE_LABELS:606 SUBCLASS_SOURCE:633 BOOK_CODES:702 _booksOffCache:705 SUBCLASS_LEVEL:746 SUBCLASS_FEATURES:762 WEAPON_PRESETS:1554 ITEM_ICONS:1598 CATEGORY_NAMES:1599 GEAR_PACKS:1608 RACE_DATA:1703 BACKGROUND_SKILLS:2320 BACKGROUND_ALIASES:2399 DEITY_ALIGN_LABELS:2412 DEITIES_DATA:2417 LANGUAGE_CATALOG:2485 RACE_LANGUAGES:2522 CLASS_LANGUAGES:2624 TOOL_CATALOG:2630 RACE_TOOLS:2685 CLASS_TOOLS:2697 SUBCLASS_LANGUAGES:2705 SUBCLASS_TOOLS:2728 RACE_ARMOR:2750 RACE_WEAPONS_SPECIFIC:2756 CLASS_WEAPONS_SPECIFIC:2772 RACE_NAME_POOLS:2785 RACE_NAME_GROUP:2827 SUBCLASS_ARMOR:2842 ARMOR_PRESETS:2873 skills:2890 ABILITY_INFO:2903 CLASS_SKILL_OPTIONS:2943 CLASS_SKILL_COUNT:2958 CLASS_SKILL_MC_COUNT:2959 CLASS_ARMOR_PROFS:2962 CLASS_RESOURCES:2982 ASI_LEVELS:3144 XP_THRESHOLDS:3152 APP_VERSION:3162 APP_VERSION_DATE:3163 APP_TELEGRAM_URL:3169 APP_BOOSTY_URL:3170 FEATS_DATA:3191 APP_CHANGELOG:3513 CASTER_TYPE:7589 THIRD_CASTER_SUBCLASSES:7598 THIRD_CASTER_SLOTS:7605 MULTICLASS_SPELL_SLOTS:7616 MULTICLASS_PREREQUISITES:7641 MULTICLASS_PROFICIENCIES:7659 EDITION_DATA:7688

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (707 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

