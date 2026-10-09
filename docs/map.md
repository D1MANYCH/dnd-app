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
| index.html — блоки верхнего уровня (`#id:строки`) | 133–174 |
| Функции по файлам (`имя:строка`) | 175–248 |
| Данные — константы верхнего уровня (`имя:строка`) | 249–265 |


## style.css — секции

| Строки | Секция |
|---|---|
| 1–5 | style.css — Стили D&D 5e Character Sheet |
| 6–146 | Design tokens (R1) |
| 147–184 | Алиасы старых переменных (совместимость) |
| 185–204 | THEME-4: компонентные токены базового хрома |
| 205–220 | THEME-5: компонентные токены фичевых зон (партия B) |
| 221–245 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 246–290 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 291–474 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 475–572 | UI-2. Пресеты акцента (8 цветов) |
| 573–589 | Body — атмосферный cream-фон + warm radial + SVG-noise |
| 590–597 | UI4-glass: декоративные «лозы» светлой темы убраны |
| 598–606 | Заголовки |
| 607–1020 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1021–1361 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1362–1367 | R2. Базовые компоненты |
| 1368–1526 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1527–1791 | UI-3. Desktop/tablet layout (≥1024px) |
| 1792–1902 | UI5-4: ПК — многоколоночная раскладка листа |
| 1903–1979 | /R2 |
| 1980–2153 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2154–2366 | HEADER (R5: back + name + hamburger) |
| 2367–2432 | КД АВТО-РАСЧЁТ |
| 2433–2502 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2503–2568 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2569–2728 | УСЛОВИЯ |
| 2729–2875 | СПАСБРОСКИ |
| 2876–3027 | CLASS FEATURES |
| 3028–3067 | УБИРАЕМ СТРЕЛКИ |
| 3068–3172 | TAB NAV — 5 tabs + centered FAB dice |
| 3173–3295 | UX-5: лента последних бросков вне модалки |
| 3296–3472 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3473–3492 | HAMBURGER BUTTON |
| 3493–3534 | SIDE DRAWER |
| 3535–4038 | STYLE-8L: сайдбар в языке встречающего экрана |
| 4039–4086 | MENU-8/9: встречающий экран во всё окно. |
| 4087–4179 | MENU-2: плашка последнего героя. |
| 4180–4354 | MENU-3: меню приключения. |
| 4355–4425 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4426–4426 | INVENTORY |
| 4427–4457 | INVENTORY — WEIGHT BAR |
| 4458–4494 | INVENTORY — BACKPACK HEADER |
| 4495–4535 | INVENTORY — FILTERS |
| 4536–4724 | INVENTORY — ITEM CARDS |
| 4725–5090 | COINS — BIG NUMBER CARD GRID |
| 5091–5391 | MODALS |
| 5392–5426 | DICE |
| 5427–6007 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 6008–6897 | OTHER STYLES |
| 6898–6966 | HP DISPLAY BLOCK |
| 6967–6992 | MOBILE OPTIMIZATION |
| 6993–7121 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7122–7160 | HP TOAST (snackbar) |
| 7161–7212 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7213–7266 | Confirm Modal |
| 7267–7691 | ⚔️ ОТРЯД & БОЙ |
| 7692–7971 | RACIAL BONUS BAR |
| 7972–8114 | COMPACT STATS GRID |
| 8115–8382 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8383–8435 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8436–8486 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8487–8589 | COMPACT SKILLS |
| 8590–8632 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8633–8704 | ACCORDION |
| 8705–8728 | CLASS RESOURCES |
| 8729–8821 | ASI MODAL |
| 8822–9086 | APP VERSION |
| 9087–9096 | COMPANIONS |
| 9097–9142 | FEATS LIST IN ASI |
| 9143–9389 | PROFILES TABS (Чейнджлог) |
| 9390–9468 | TAKEN FEATS |
| 9469–9665 | SW UPDATE MODAL |
| 9666–9713 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9714–9886 | INVENTORY SLOTS SYSTEM |
| 9887–10086 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 10087–10358 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10359–10531 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10532–10601 | 3D DICE CUBE |
| 10602–10974 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10975–11057 | DESKTOP LAYOUT — centered max-width |
| 11058–11078 | INSPIRATION |
| 11079–11118 | CONCENTRATION |
| 11119–11795 | WEAPON CARDS WITH ROLL BUTTONS |
| 11796–11906 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11907–11969 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11970–11996 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11997–12120 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12121–12147 | R6: Ассеты (декор) |
| 12148–13119 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13120–13207 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13208–13216 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13217–13286 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13287–13612 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13613–13639 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13640–13687 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13688–13770 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13771–14868 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14869–14924 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14925–15017 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 15018–15331 | DISC-1 · Ромб раскрытия |
| 15332–15921 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15922–16027 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 16028–16163 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16164–16398 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16399–16408 | STYLE-8b3-fix: срезанный ромб |
| 16409–16722 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16723–17241 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17242–17276 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17277–17911 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #header-autohide-row:225-241  
#wake-lock-row:242-272 #edition-row:273-295 #install-row:296-306 #welcome-modal:307-311 #welcome-step-1:312-330 #welcome-step-2:331-365 #header-avatar:366-371 #status-bar:372-375  
#status-inspiration:376-376 #status-concentration:377-379 #status-ritual:380-382 #status-conditions-btn:383-395 #screen-home:396-398 #home-art:399-426 #home-sub-new:427-474 #home-install:475-482  
#home-hero:483-483 #home-hero-emblem:484-487 #home-hero-sub:488-488 #home-hero-chips:489-499 #screen-characters:500-539 #char-hero:540-540 #char-hero-emblem:541-544 #char-hero-sub:545-545  
#char-hero-chips:546-546 #char-hero-actions:547-555 #screen-data:556-571 #sync-row:572-572 #storage-status:573-573 #backup-panel:574-578 #backup-list:579-590 #screen-about:591-594  
#app-version-row:595-602 #ptab-info:603-610 #app-links-row:611-615 #ptab-changelog:616-621 #changelog-list:622-628 #screen-character:629-629 #tab-sheet:630-632 #creation-wizard-banner:633-643  
#cw-validation:644-646 #basic-locked-bar:647-656 #creation-todo:657-666 #sheet-avatar:667-679 #char-build-badge-wrap:680-694 #char-class-mc:695-718 #char-subclass-rec:719-719 #char-subclass-mc:720-928  
#char-books:929-933 #race-bonus-display:934-934 #race-extras-panel:935-935 #class-skills-panel:936-937 #background-feature-display:938-939 #bg-extras-panel:940-983 #abilgen-row:984-990 #stats-collapse-btn:991-998  
#abilities-region:999-1002 #proficiency-bonus-2024:1003-1004 #insp-card-2024:1005-1014 #abil-col-1:1015-1015 #stat-block-str:1016-1017 #mod-str:1018-1024 #abil-save-slot-str:1025-1025 #abil-skills-slot-str:1026-1028  
#stat-block-dex:1029-1030 #mod-dex:1031-1037 #abil-save-slot-dex:1038-1038 #abil-skills-slot-dex:1039-1041 #stat-block-int:1042-1043 #mod-int:1044-1050 #abil-save-slot-int:1051-1051 #abil-skills-slot-int:1052-1055  
#abil-col-2:1056-1056 #stat-block-con:1057-1058 #mod-con:1059-1065 #abil-save-slot-con:1066-1066 #abil-skills-slot-con:1067-1069 #stat-block-wis:1070-1071 #mod-wis:1072-1078 #abil-save-slot-wis:1079-1079  
#abil-skills-slot-wis:1080-1082 #stat-block-cha:1083-1084 #mod-cha:1085-1091 #abil-save-slot-cha:1092-1092 #abil-skills-slot-cha:1093-1106 #saves-grid:1107-1116 #skills-container:1117-1119 #passive-perception:1120-1143  
#hp-dmg-row:1144-1153 #hp-dmg-body:1154-1174 #death-saves-section:1175-1206 #hp-armor-body:1207-1248 #hp-hd-body:1249-1262 #hp-rest-body:1263-1290 #class-dev-section:1291-1293 #cd-head:1294-1294  
#cd-res:1295-1295 #cd-attn:1296-1297 #cd-about:1298-1306 #ac-formula:1307-1308 #ac-modifiers:1309-1316 #conditions-grid:1317-1324 #effects-grid:1325-1332 #resistances-container:1333-1341  
#prof-card:1342-1345 #armor-prof-container:1346-1349 #weapon-prof-container:1350-1353 #tools-container:1354-1357 #languages-container:1358-1365 #companions-list-sheet:1366-1378 #tab-progress:1379-1380 #pg-body:1381-1382  
#tab-spells:1383-1406 #spell-mod-display:1407-1412 #spell-dc-display:1413-1418 #spell-attack-display:1419-1424 #spell-stats-by-class:1425-1442 #spell-slots-visual:1443-1449 #concentration-block:1450-1466 #prep-counter:1467-1467  
#my-spells-list:1468-1470 #tab-inventory:1471-1490 #weight-fill:1491-1525 #inventory-list:1526-1535 #inv-pouches:1536-1591 #tab-notes:1592-1618 #notes-subtabs:1619-1620 #notes-main:1621-1622  
#taken-feats-section:1623-1627 #taken-feats-list:1628-1631 #tab-party:1632-1640 #my-char-card:1641-1655 #allies-list:1656-1671 #npcs-list:1672-1687 #monsters-list:1688-1699 #companions-list-world:1700-1710  
#tab-battle:1711-1716 #weapons-list:1717-1720 #saved-roll-form:1721-1727 #saved-roll-err:1728-1729 #saved-rolls-list:1730-1733 #battle-res-card:1734-1735 #battle-res-rows:1736-1737 #battle-setup-screen:1738-1748  
#battle-setup-list:1749-1749 #battle-difficulty:1750-1753 #battle-tracker-screen:1754-1758 #battle-turn-info:1759-1764 #battle-repeat-strip:1765-1765 #battle-tracker-list:1766-1775 #tab-journal:1776-1790 #journal-list:1791-1797  
#screen-itemref:1798-1800 #item-ref-tabs:1801-1806 #item-ref-weight:1807-1845 #item-ref-slots:1846-1877 #screen-dmref:1878-1880 #dm-ref-tabs:1881-1885 #dm-ref-ed:1886-1886 #dm-ref-cond:1887-1887  
#dm-ref-combat:1888-1888 #dm-ref-world:1889-1893 #screen-help:1894-1916 #help-about:1917-1940 #help-start:1941-1965 #help-sheet:1966-1989 #help-progress:1990-2035 #help-spells:2036-2052  
#help-inventory:2053-2065 #help-battle:2066-2090 #help-party:2091-2107 #help-notes:2108-2116 #help-journal:2117-2125 #help-planes:2126-2153 #help-dice:2154-2165 #help-edition2024:2166-2205  
#help-data:2206-2222 #help-marks:2223-2245 #conc-details-modal:2246-2256 #conc-detail-duration-row:2257-2264 #conc-detail-desc-row:2265-2274 #add-journal-modal:2275-2298 #add-npc-modal:2299-2328 #add-ally-modal:2329-2365  
#screen-monsters:2366-2378 #srd-monster-count:2379-2379 #srd-monster-results:2380-2384 #srd-npc-modal:2385-2394 #srd-npc-count:2395-2395 #srd-npc-results:2396-2403 #screen-monsterform:2404-2441 #monster-cr-note:2442-2444  
#monster-stats:2445-2446 #monster-saves:2447-2448 #monster-attacks:2449-2472 #screen-rest:2473-2475 #rest-main-screen:2476-2482 #rest-info-screen:2483-2487 #hit-dice-section:2488-2489 #hit-dice-controls-total:2490-2494  
#hit-dice-by-size:2495-2499 #rest-food-section:2500-2508 #rest-result-screen:2509-2511 #rest-result-details:2512-2520 #screen-levelup:2521-2525 #lu-screen-multiclass:2526-2527 #lu-mc-current-classes:2528-2530 #lu-mc-new-class:2531-2535  
#lu-mc-prereq-warn:2536-2536 #lu-mc-subclass-row:2537-2545 #lu-screen-preview:2546-2578 #lu-slots-card:2579-2580 #lu-slots-info:2581-2584 #lu-build-hint:2585-2585 #lu-features-container:2586-2593 #lu-screen-choices:2594-2595  
#lu-choices-body:2596-2602 #lu-screen-result:2603-2604 #lu-result-title:2605-2605 #lu-result-body:2606-2612 #screen-hphistory:2613-2615 #hp-history-list:2616-2621 #asi-modal:2622-2626 #asi-build-hint:2627-2641  
#asi-feat-list:2642-2642 #asi-stat-grid:2643-2643 #asi-preview:2644-2652 #class-choice-modal:2653-2668 #dice-modal:2669-2701 #dice-file-hint:2702-2702 #dice3d-result:2703-2714 #dice-result-display:2715-2728  
#dice-pick-hint:2729-2729 #dice-mode-segment:2730-2734 #dice-formula-panel:2735-2752 #dice-fan:2753-2761 #dice-popover-settings:2762-2809 #dice-popover-history:2810-2821 #dice-history:2822-2830 #screen-spellsearch:2831-2833  
#spell-feat-bar:2834-2850 #spell-class-filter:2851-2894 #class-filter-legend:2895-2896 #spell-search-count:2897-2897 #spell-search-results:2898-2901 #cast-spell-modal:2902-2906 #cast-spell-options:2907-2909 #add-spell-modal:2910-2953  
#new-spell-class-chips:2954-2999 #new-spell-mech-fields:3000-3004 #new-spell-mech-dmg-row:3005-3024 #new-spell-mech-half-row:3025-3027 #new-spell-mech-mod-row:3028-3038 #item-modal:3039-3083 #item-armor-fields:3084-3109 #coin-exchange-modal:3110-3148  
#exch-preview:3149-3155 #screen-magiccatalog:3156-3183 #magic-catalog-count:3184-3184 #magic-catalog-list:3185-3188 #screen-gearcatalog:3189-3193 #gear-packs-list:3194-3207 #gear-catalog-count:3208-3208 #gear-catalog-list:3209-3213  
#weapon-modal:3214-3217 #weapon-picker-section:3218-3220 #weapon-filter-chips:3221-3230 #weapon-presets-list:3231-3293 #character-tabs:3294-3305 #quick-roll-strip:3306-3311 #qrs-list:3312-3322 #active-effects-panel:3323-3327  
#aef-list:3328-3334 #hp-toast-container:3335-3337 #add-companion-modal:3338-3354 #companion-familiar-row:3355-3375 #mob-sheet:3376-3379 #mob-sheet-list:3380-3383 #confirm-modal:3384-3397 #avatar-modal:3398-3401  
#avatar-modal-preview:3402-3429 #screen-builds:3430-3457 #bp-list:3458-3462 #screen-buildguide:3463-3465 #bg-body:3466-3470 #screen-buildplan:3471-3473 #bp-plan-body:3474-3478 #screen-abilityinfo:3479-3481  
#ai-body:3482-3486 #screen-abilgen:3487-3489 #ag-body:3490-3494 #screen-books:3495-3497 #books-body:3498-3502 #screen-mclayout:3503-3505 #ml-body:3506-3510 #screen-featureinfo:3511-3513  
#fi-body:3514-3518 #app-log-panel:3519-3538 #app-log-list:3539-3699 #notes-entry-modal:3700-3748  

## Функции по файлам (`имя:строка`)

**rules.js** (1658 строк, 107 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHitDicePool:58 _hdSizesDesc:66 rulesHitDiceSpentBy:72 rulesHitDiceLabel:96 rulesPickHitDice:104 rulesClampHitDice:116 rulesRitualMinutes:128 rulesHitDieHeal:135 rulesSpendHitDice:141 charClassLevel:167 charHasClass:177 charClassLevelOr:187 charAsiSlots:196 charEpicSlots:211 charSubclassPending:229 charXpNext:242 rulesJackOfAllTrades:253 charClassSubclass:258 rulesHasFeat:267 rulesHasFightingStyle:272 rulesHasDraconicResilience:284 rulesHasDazzlingFootwork:289 rulesRemarkableAthlete:294 rulesUntrainedCheckBonus:300 rulesHasExpertise:307 getInitiativeMod:313 rulesSaveBonus:329 rulesSkillBonus:335 rulesPassivePerception:350 rulesSpellStats:354 _spellStatMod:374 rulesSpellStatsByClass:382 rulesWeaponMods:400 rulesOffhandDamageMod:416 armorPenalties:425 rulesItemArmor:438 rulesArmorItem:450 rulesAC:461 charCasterLevel:643 classSpellSlotRow:684 getMulticlassSpellSlots:697 rulesRestoreLevelFields:733 rulesApplySpellSlots:752 resolvePactSlots:775 restoreItemCharges:785 rulesHitDieSides:802 rulesShortRest:808 rulesLongRestBlockReason:843 rulesLongRest:856 rulesExhaustionLevel:922 rulesEffectiveHpMax:928 _dsReset:933 _dsCount:934 _dsFill:935 _condAdd:936 _condRemove:937 rulesIsDead:939 rulesIsStable:943 rulesRegainFromZero:948 rulesSetHp:954 rulesDamageAfterDefenses:966 rulesApplyDamage:978 rulesDeathSaveBlockReason:1015 rulesDeathSave:1022 rulesConditionRollMods:1041 rulesEffectiveSpeed:1058 rulesArmorStealthDisadv:1079 rulesFeatPrereqMissing:1088 rulesFeatStatChoice:1115 rulesFeatStatOptions:1123 rulesFeatSlotCount:1136 rulesFeatSpellFits:1141 rulesFeatSpellCandidates:1152 rulesFeatSpellLabel:1156 rulesFeatSpellProgress:1161 rulesFeatClassOptions:1186 rulesFeatFreeResId:1199 rulesResetFeatFree:1202 concSaveParams:1213 rulesCrToXp:1249 rulesCrToProf:1255 rulesEncounterMultiplier:1262 rulesEncounterDifficulty:1271 getCharClassPairs:1295 charEditionMismatch:1309 findLangInCatalog:1317 ensureLanguagesArray:1329 recalcLanguagesFromSources:1345 add:1350 findToolInCatalog:1395 ensureToolsArray:1407 getBackgroundDef:1428 validateBgStatChoice:1464 parseBackgroundToolEntry:1484 recalcToolsFromSources:1499 add:1504 ensureArmorWeaponFields:1569 recalcArmorWeaponFromSources:1582 addArmor:1588 addWeapon:1589 addSpec:1638

**app-core.js** (1630 строк, 76 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 saveToLocal:326 initPersistentStorage:349 _formatStorageBytes:370 updateStorageStatus:378 currentScreenName:439 screenBack:445 _modalVisible:459 _closeOpenModals:462 headerBack:472 _screenMotionOk:505 _screenGhostDrop:511 _screenGhostStart:523 _screenEnter:541 showScreen:550 updateHeaderTitle:652 syncDrawerHeader:706 switchTab:718 openDrawer:748 closeDrawer:761 showCharacterNav:773 hideCharacterNav:781 isInteractive:801 currentActiveTab:824 createNewCharacter:882 getClassColor:903 getClassIcon:918 getAbilityIcon:925 getConditionIcon:940 getConditionChipIcon:964 getSpellClassIcon:982 getSchoolSlug:999 getSchoolIcon:1003 stripLeadingEmoji:1016 formatTimeAgo:1020 setCharSort:1034 setCharSearch:1041 duplicateCharacter:1045 exportOneCharacter:1057 updateCharCounter:1064 onDragStart:1081 onDragOver:1082 onDrop:1083 renderCharacterList:1094 renderCharPlate:1180 deleteCharacter:1239 showConfirmModal:1253 safeSet:1300 safeSetChecked:1304 loadCharacter:1313 showToast:1502 toastAddAction:1519 emptyStateHtml:1537 openHPHistory:1548 closeHPHistory:1576 updateVersionBlock:1581 forceAppUpdate:1612

**app-migrate.js** (1028 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1020

**app-builds.js** (1724 строк, 45 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _stemSet:192 _matchByStems:198 _weaponMatchNames:206 _findWeapon:209 _findArmorPreset:234 applyBuild:248 _applyBuildCore:271 _pick:896 _glossNorm:1005 _reEscape:1006 _glossEd:1007 _glossBuild:1008 ingest:1010 _glossIndex:1032 glossarizeHtml:1040 _glossPopoverEl:1054 hideGlossPopover:1066 showGlossPopover:1071 _glossBindOnce:1090 openBuildGuide:1121 gx:1144 _list:1145 getBuildLevelRec:1208 getBuildRecChoiceOption:1213 getBuildRecChoiceIds:1221 getBuildRecFeat:1226 getBuildRecAsi:1236 getBuildRecSubclass:1243 parseAsiFromHeadline:1251 _buildFeatNameMap:1265 parseFeatFromHeadline:1307 parseSpellsFromHeadline:1324 getBuildRecSpellObjs:1570 openBuildPlan:1590 _cpSubclassOf:1643 _cpClassSwitch:1654 openClassPlan:1669

**app-io.js** (707 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:91 _normalizeImportedSpell:100 _isValidImportedSpell:111 _collectCharUserSpells:115 _ingestImportedUserSpells:133 _spellBaseById:179 _unpackSpell:187 _countUnresolvedSpells:209 _unresolvedNote:217 _importTooNew:222 _packSpell:231 _packCharForExport:242 _unpackCharSpells:249 _buildCharEnvelope:255 _charExportFileName:270 _downloadText:273 _shareableFile:284 shareOneCharacter:295 copyCharToClipboard:312 pasteCharFromClipboard:325 _extractCharsFromImport:343 _applyFullRestore:355 _warnEditionMix:399 run:400 importData:415 importOneCharacter:474 _importOneCharText:491 _consumeLaunchFiles:572 _importLaunchText:605 exportSpells:612 importSpells:621 exportSessionLog:694

**app-combat.js** (3297 строк, 149 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:244 toggleAbilOpen:272 abilityBreakdown:284 openAbilityInfo:312 toggleExpertise:347 loadExpertise:366 updateSkillProfCount:380 updateSkillSources:392 updateClassFeatures:416 calculateAC:431 toggleInspiration:492 updateStatusCounter:505 updateStatusBar:519 updateInspirationLabels:559 updateStatDisplay:576 updateAllStatDisplays:581 adjustStat:585 adjustCoin:608 renderCoinMob:622 openCoinSheet:632 setCoinFromSheet:642 updateCoinTotal:649 openCoinExchange:661 closeCoinExchange:666 previewExchange:670 coinExchangeCalc:698 confirmExchange:703 updateSubclassOptions:726 updateSubclassRecHint:783 featHpPerLevel:798 featHpFlat:807 recalculateHP:816 updateChar:863 toggleProficiency:930 calcStats:953 setSpellStat:1024 calcSpellStats:1035 onRaceChange:1086 renderBooksRow:1216 openMobSheet:1243 closeMobSheet:1250 mobSheetActs:1252 openBooksSheet:1257 toggleCharBook:1267 populateRaceSelect:1284 _speciesEffective:1317 _renderSpeciesBar:1330 _speciesChoiceOptions:1345 toggleSpeciesChoice:1352 syncSpeciesSpells:1366 rollRandomName:1412 pick:1420 build:1421 _raceSkillAllowance:1480 _raceFlexCount:1486 _raceFlexFits:1492 _raceFlexApply:1499 _setExtrasHtml:1509 renderRaceExtras:1518 toggleHalfElfStat:1689 toggleRaceFlexStat:1715 setRaceVariableTrait:1745 _raceSkillSet:1762 _pickHide:1772 _pickExpandBtn:1776 pickExpand:1779 raceLangGoto:1786 toggleRaceSkill:1794 _classSkillList:1823 _skillsFromOtherSources:1836 _skillsByName:1845 _skillTakenElsewhere:1851 _classSkillHeld:1863 _classSkillSync:1869 renderClassSkills:1900 toggleClassSkill:1943 openRaceFeatModal:1971 removeRaceFeat:1991 applyBasicLockUI:2026 updateLockButtonState:2056 lockBasicInfo:2093 unlockBasicInfo:2109 isSheetLocked:2137 sheetLockGuard:2143 applySheetLockUI:2149 _creationTodo:2178 add:2182 src:2183 scheduleCreationTodo:2242 renderCreationTodo:2247 creationTodoGo:2272 openLockSheet:2282 _creationUiReset:2295 _isMobSheet:2296 renderIdentitySummary:2297 toggleIdentityMore:2316 renderProfSummary:2320 toggleProfCard:2335 openAcSheet:2341 _mobMarkClamp:2349 init:2358 lockSheet:2379 doLock:2383 unlockSheet:2396 onBackgroundChange:2417 _bgSkillsOf:2462 _bgUncheckOld:2469 _bgCheckSkills:2477 renderBackgroundFeature:2489 _bgStatShort:2534 populateBackgroundSelect:2537 _bgRevertStatChoice:2568 _bgAppliedStat:2581 _bgApplyStat:2586 setBgStatMode:2598 toggleBgStat:2610 _bgAfterStats:2633 _bgRevertFeatEffects:2644 syncOriginFeat:2669 toggleBgCustom:2705 _toggleBgCustom14:2745 toggleBgSkillPick:2792 _renderBgCustom14:2819 giveBackgroundEquipment:2856 renderBackgroundExtras:2899 _armorFromSelect:3004 renderArmorSelect:3016 onArmorPick:3051 onShieldPick:3065 onArmorChange:3084 onManualAC:3113 onManualMaxHP:3120 calcCoinWeight:3143 getActiveConditionsForRender:3157 toggleConditionsPopup:3186 closeConditionsPopup:3198 renderConditionsPopup:3204

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (350 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:234 _aefRowHtml:249 renderActiveEffectsFab:263 toggleActiveEffectsPanel:283 _aefBindOutside:302 advanceActiveEffects:322 removeActiveEffect:334

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1812 строк, 55 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:145 openLevelUpModal:229 _showMulticlassScreen:251 openMulticlassNewClass:295 confirmMulticlassNewClass:354 _showLevelUpPreview:365 closeLevelUpModal:532 confirmLevelUp:545 _luShowResult:671 luFinishChoices:695 luRefreshChoices:702 luSetSubclass:709 luApplyFeatById:728 luApplyAsi:774 _luFeatChoiceAt:795 _ccDefsFor:803 _luAsiDone:814 luApplyAllRecommendations:819 luBuildChoicesScreen:939 recBadge:947 luAddRecommendedSpells:1079 luGoToSpellsTab:1107 openLevelDownConfirm:1119 confirmLevelDown:1164 loadDeathSaves:1197 toggleDeathSave:1241 resetDeathSaves:1258 updateHPDisplay:1271 hpToggleRow:1352 hpSetRowOpen:1361 updateHPSummary:1369 updateHPRows:1433 quickHP:1451 setHPAbsolute:1552 addHPHistory:1576 _hpUndoPrepare:1593 _hpUndoConcSnap:1612 _hpUndoConcRestore:1629 undoHPChange:1652 showHPToast:1681 applyCustomHP:1706 saveTempHP:1723 rollHitDieQuick:1737 renderHitDiceIcons:1769 rollDeathSave:1783

**app-inventory.js** (1744 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:992 toggleWeaponFilter:996 fillWeaponPreset:1003 _resetWeaponForm:1021 openWeaponModal:1040 closeWeaponModal:1050 editWeapon:1058 deleteCustomWeapon:1088 _weaponPresetByName:1114 checkWeaponProficiency:1121 submitWeapon:1149 weaponRowTap:1240 renderWeapons:1253 isLightWeapon:1332 toggleTWFStyle:1337 rollTWFAttack:1345 _weaponDamageRoll:1393 rollTWFDamage:1414 rollWeaponAttack:1426 rollWeaponDamage:1481 removeWeapon:1510 _invDndInit:1544 _invClearIndicators:1573 _invSetIndicator:1582 _invCleanup:1587 _invCancelDrag:1594 _invMoveItem:1602 _invCommitDrop:1619 invDragStart:1640 invDragOver:1650 invDragLeave:1667 invDrop:1671 invDragEnd:1677 invTouchStart:1684 invTouchMove:1700 invTouchEnd:1732

**app-spells.js** (2049 строк, 99 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:216 setSpellClass:225 _charSpellClassKey:234 _charMaxCastableLevel:245 _defaultSpellVersion:253 openSpellSearch:256 markCharOwnClassFilter:274 closeSpellSearch:304 _featPickCtx:315 featAddFixedSpells:330 openFeatSpellPicker:356 _featPickProgressText:373 _renderFeatPickBar:379 featPickSetClass:398 _featPickCandidates:406 _renderFeatPickList:416 addFeatSpell:447 removeFeatSpell:467 _parseSpellClassList:490 _syncNewSpellClassChips:494 toggleNewSpellClass:501 _fillNewSpellDamageTypes:526 _toggleHidden:533 updateNewSpellMechFields:541 _hbFormulaCheck:556 _collectHbEffect:565 _spellIdArg:603 _findHomebrewSpell:609 openAddSpellForm:617 _syncCustomSpellAcrossChars:696 _purgeCustomSpellFromChars:714 deleteCustomSpell:733 _deleteCustomSpellConfirmed:742 closeAddSpellForm:756 submitNewSpell:760 renderSpellSearch:850 addSpell:919 removeSpell:935 toggleSpellCard:949 renderMySpells:954 _spellActiveBadgeText:1096 _spellActiveBadgeHtml:1100 updateSpellActiveBadges:1103 _prepEntries:1126 _spellPrepEntry:1141 _prepLimit:1146 calcMaxPrepared:1162 _known2014:1169 calcMaxKnownSpells:1183 _knownSpellCount:1189 calcMaxCantrips:1199 isPrepClass:1208 _subclassSpellNames:1214 spellNeedsPrep:1241 _preparedCount:1257 isSpellPrepared:1264 toggleSpellPrepared:1274 renderPrepCounter:1300 _castableSlotOptions:1346 _arcanumResId:1367 castSpell:1377 _castSpellWithSlot:1398 _finishCast:1436 applyCastEffects:1482 openCastVariantChooser:1523 pickCastVariant:1562 closeCastVariantChooser:1572 _applyCastSummon:1585 _nextCastInstanceId:1619 _replaceCastInstance:1627 _ensureCastInstance:1657 _applyCastDamage:1677 _rollCastDamage:1693 _startCastRepeat:1758 castRepeatDamage:1772 _applyCastDebuff:1797 castSpellAttackMod:1838 castStatMod:1846 _applyCastHeal:1864 _castHealApply:1885 _applyCastTempHp:1891 applyCastTempHp:1908 _applyCastHpMaxBonus:1922 openCastChooser:1942 closeCastChooser:1963 canCastAsRitual:1976 castRitual:1998 cancelRitual:2037

**app-party.js** (2359 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentSafeIcon:270 _pentNormalize:275 _pentImport:298 openAddAllyModal:339 openEditAllyModal:340 closeAddAllyModal:341 saveAlly:342 deleteAlly:343 setAllyStatus:344 exportAllies:345 importAllies:346 openAddNPCModal:348 openEditNPCModal:349 closeAddNPCModal:350 saveNPC:351 deleteNPC:352 setNPCStatus:353 exportNPCs:354 importNPCs:355 openAddMonsterModal:357 openEditMonsterModal:358 closeAddMonsterModal:359 saveMonster:360 deleteMonster:361 setMonsterStatus:362 exportMonsters:363 importMonsters:364 _monSigned:371 _monFormFill:372 _monFormStat:388 monsterFormRefresh:389 toggleMonsterSave:405 monsterAddAttackRow:406 _monFormRead:418 _monFormApply:432 monsterSaveBonus:443 monsterStatBlockHtml:448 monsterRoll:474 monsterAttackRoll:478 _monCatalog:489 _monCatalogIndex:495 _monCatalogPut:501 deleteCatalogMonster:511 addMonsterFromCatalog:523 _npcAttColor:543 renderNPCs:549 renderMonsters:590 _openSrdMonsterPickerLazy:645 openSrdMonsterPicker:655 openSrdMonsterPickerForBattle:657 _openSrdMonsterPickerCore:662 closeSrdMonsterPicker:705 setSrdMonsterSearch:710 setSrdMonsterCr:711 setSrdMonsterEdition:712 renderSrdMonsterPicker:714 addMonsterFromSRD:784 openSrdNpcPicker:825 _openSrdNpcPickerCore:834 closeSrdNpcPicker:855 setSrdNpcSearch:857 setSrdNpcAtt:858 renderSrdNpcPicker:860 addNpcFromSRD:891 openBattleTab:921 buildBattleSetupList:934 setBattleSearch:954 toggleBattleSection:955 renderBattleSetup:960 battleEncounterInput:1008 renderBattleDifficulty:1028 toggleBattleCheck:1053 battleDragStart:1058 battleDragOver:1059 battleDrop:1060 battleDragEnd:1068 rollInitiativeValue:1073 sortParticipantsByInitiative:1078 _findPartyMonster:1085 _participantCombatMeta:1095 _makeBattleParticipant:1120 _battleParticipantHP:1133 _addSrdMonsterToBattle:1142 _addCatalogMonsterToBattle:1172 _participantStatBlock:1196 startBattle:1203 getParticipantDesc:1225 showTrackerInfo:1248 getSelfStatusFromHP:1291 syncSelfBattleStatus:1307 renderBattleTracker:1317 renderBattleCastPanels:1410 _battleCondList:1452 _battleCondSet:1460 _battleCondMeta:1465 _battleCondDots:1468 openBattleCondPicker:1482 closeBattleCondPicker:1487 _renderBattleCondPicker:1492 toggleBattleCondition:1539 adjustBattleExhaustion:1554 adjustBattleHP:1573 setBattleHP:1587 setBattleHPMax:1606 setBattleInitiative:1617 rerollInitiative:1629 battleRollD20:1641 removeBattleParticipant:1646 setBattleStatus:1664 _battleStatusFromHp:1674 _battleSyncHpStatus:1684 offerCastDamageToBattle:1695 _castDamageTargets:1712 _castDamageAmount:1718 _renderCastDamageModal:1724 setCastDamageHalf:1787 toggleCastDamageTarget:1795 _castDamageHit:1805 applyCastDamageToTarget:1818 applyCastDamageTargets:1828 closeCastDamageModal:1838 _castHealTargets:1847 offerCastHealToBattle:1853 _renderCastHealModal:1861 toggleCastHealTarget:1906 applyCastHealTargets:1913 closeCastHealModal:1935 _castDebuffTargets:1956 offerCastDebuffToBattle:1962 _renderCastDebuffModal:1978 toggleCastDebuffTarget:2034 pickCastDebuffTarget:2044 applyCastDebuffTargets:2053 closeCastDebuffModal:2081 _battleDebuffChips:2090 removeBattleDebuff:2107 removeBattleDebuffsForSpell:2120 clearAllBattleDebuffs:2135 _logTurn:2140 _battleNewRound:2147 nextTurn:2155 _battleEconomyRow:2171 toggleBattleEconomy:2183 resetBattleEconomy:2189 prevTurn:2193 tickCastEffectsRound:2204 endBattle:2232 _dmRefEsc:2306 _dmRefGroup:2310 renderDmRef:2321 t:2325 openDmRef:2341 closeDmRef:2346 switchDmRef:2350

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1189 строк, 67 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:560 crSlotRecoveryActs:564 recoverSlotByResource:579 crRowsHtml:605 crSetRows:641 renderClassResources:656 spendResource:674 resetResource:692 toggleResourcePip:702 resetResourcesByRest:727 getJournal:769 addJournalEntry:774 filterJournal:796 renderJournal:803 deleteJournalEntry:839 openAddJournalEntry:848 closeAddJournalEntry:852 saveJournalEntry:855 getCompanions:875 renderCompanions:880 companionHP:925 buildFamiliarFormOptions:938 onCompanionTypeChange:950 applyFamiliarForm:958 openAddCompanionModal:970 summonFamiliar:986 openPrefilledCompanionModal:996 openEditCompanionModal:1007 closeAddCompanionModal:1026 saveCompanion:1029 deleteCompanion:1054 switchProfilesTab:1070 clipChangelogText:1085 expandChangelogItem:1096 renderChangelog:1102 openItemRef:1147 closeItemRef:1152 switchItemRef:1157 _syncHeaderHeight:1175

**app-dice.js** (1603 строк, 77 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:217 rollDice:221 _quickRollCompute:316 _quickRollModStr:335 _emitDiceRolled:341 _setDiceSettled:349 _setSettledDice:359 _quickRollRecord:376 _quickRollInfoText:383 _quickRollToastText:390 quickRoll:406 renderQuickRollStrip:464 updateQuickRollStripVisibility:486 dismissQuickRollStrip:501 openDiceRollHistory:506 drawDiceSVG:519 _waitDiceBoxModule:538 _diceLsGet:558 _getAccentColor:566 _getDiceTheme:585 _getDiceThemeColor:592 setDiceTheme:595 _syncDiceThemeButtons:601 _getDiceBg:611 setDiceBg:618 _syncDiceBgButtons:624 _diceDbg:634 _initDiceBox:639 animateDice3d:745 animateDice2d:940 buildDie:966 tick:1034 _applyDiceCritGlow:1057 parseDiceFormula:1078 _formulaCanon:1114 _renderFormulaResult:1126 rollFormula:1162 _rollFormulaFrom:1228 rollCustomFormula:1241 renderDiceHistory:1244 createParticles:1266 _diceShapeSvg:1300 renderDiceFan:1307 _paintSelectedDie:1326 _diceHeroSvg:1350 _paintDiceMode:1360 selectDie:1375 rollSelectedDie:1394 toggleDiceFormulaPanel:1403 _savedRollFormula:1422 _savedRollsClean:1425 _savedRollNewId:1440 _savedRollLabel:1443 renderSavedRolls:1447 savedRollRoll:1467 savedRollTap:1474 savedRollEdit:1490 savedRollCancel:1506 savedRollSubmit:1511 savedRollDelete:1532 savedRollFromDice:1550 _diceHotkeys:1571

**app-settings.js** (887 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:172 _getStatsLayout:189 _applyStatsLayout:196 _statsInCards:203 _statsRowTarget:207 _placeStatRows:225 setStatsLayout:241 _syncStatsLayoutButtons:248 _getSheetLock:261 setSheetLock:265 _syncSheetLockButtons:270 _wakeLockSupported:281 _getWakeLockOn:282 _applyWakeLock:286 setWakeLock:301 _syncWakeLockButtons:306 _getHeaderAutohideOn:316 setHeaderAutohide:319 _syncHeaderAutohideButtons:324 _getTrackXpOn:332 _applyTrackXp:335 setTrackXp:338 _syncTrackXpButtons:343 _getAttackDamageOn:364 setAttackDamage:367 _syncAttackDamageButtons:371 isEditionSplit:380 setEditionSplit:383 _syncEditionSplitButtons:388 openBooksScreen:398 _bookRowHtml:402 _renderBooksScreen:412 setBookOn:434 setBooksPreset:440 _afterBooksChange:447 _syncBooksSummary:459 _getStatsCollapsed:471 _applyStatsCollapsed:474 toggleStatsCollapsed:479 _getStoredDensity:493 _getDefaultDensity:501 _getDensity:508 _applyDensity:511 setDensity:515 _syncDensityButtons:521 _onViewportDensityChange:529 _getFontScale:547 _applyFontScale:554 setFontScale:565 _syncFontScaleUi:576 _getGlassAlpha:591 _getGlassBlur:598 _applyGlassAlpha:605 _applyGlassBlur:606 setGlassAlpha:607 setGlassBlur:617 _syncGlassUi:626 _getSpaceMode:675 _applySpaceBg:682 setSpaceMode:697 _syncSpaceButtons:703 _spaceOnScroll:722 _applyDymkaIcons:750 _initAppLinks:763 openSupportLink:795 _isStandalone:807 _isIos:813 _installMode:817 _syncInstallUi:822 installApp:835 openSettingsModal:859 closeSettingsModal:874

**app-asi.js** (805 строк, 37 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:79 buildASIStatGrid:91 getASIMode:112 toggleASIStat:117 updateASIPreview:139 getFeatDef:219 _featPickerList:237 buildFeatList:249 filterFeatList:280 _asiFeatBlocked:289 _featStatPickHtml:302 _asiFeatReady:315 selectFeatStat:319 selectFeat:326 _asiUnlockSheet:347 _asiShowStatModes:356 _statGain:367 applyASI:373 renderTakenFeats:539 removeFeat:586 _agBonus:622 _agPbSpent:632 _agBase:638 _agReady:645 openAbilGen:649 agSetMode:667 agPb:673 _agSwap:683 agStd:690 agPick:696 agRoll:702 _agCtl:715 _agRender:736 agApply:784

**app-progress.js** (879 строк, 49 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:244 _pgClassRow:257 _pgClasses:300 _pgNext:316 _pgAvailableClasses:371 _pgActions:384 _pgBuild:402 openProgressTab:415 openProgress:425 pgTabActive:436 pgRefresh:443 pgSetSubclass:451 pgFocusSubclass:465 pgLevelUp:482 pgLevelDown:487 pgAfterLevelModal:493 pgAddClass:504 renderClassDev:518 _pgSheetAboutRow:537 _pgSubclassRows:555 syncClassFieldUI:581 openFeatureInfo:624 _fiRuleNotes:667 _mlTotal:706 _mlMissing:711 openMcLayout:717 mlSetClass:729 mlLevel:737 mlSetSub:746 mlAdd:751 mlRemove:757 _mlRender:763 _mlPruneAsi:828 mlApply:839

**app-desktop.js** (477 строк, 14 функций)  
syncFromStatusBar:126 syncStrip:183 setRailOpen:194 _esc:199 _stripEmoji:205 _condIcon:209 setRowExpanded:215 collapseRow:221 renderRrConditions:223 renderRailSlots:269 renderRailConc:311 updateRailHpRow:326 rrApplyHP:341 init:354

**app-help.js** (1150 строк, 53 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:90 setHelpFlag:94 welcomeGoStep:100 showWelcome:110 closeWelcome:117 welcomeContinue:123 welcomeSkipExperienced:129 welcomeBack:135 welcomeFinish:142 dismissWelcome:175 maybeShowWelcome:178 restartOnboarding:183 _tourWide:219 _ensureTourDom:222 _resolveTarget:263 _tourFirstVisible:278 _tourAnyModalVisible:298 _tourModalOpen:304 _tourStartWhenClear:316 startTour:328 startListTour:341 startSheetTour:345 maybeStartSheetTour:351 restartTour:369 startTabTour:394 maybeStartTabTour:412 tourNext:434 tourPrev:439 endTour:445 _showTourStep:455 _setBox:518 _computeTourBoxes:534 snap:536 corner:549 _layoutTourCorners:571 _layoutTour:588 _onTourKey:691 _onTourReflow:697 _bindTourGlobal:701 _unbindTourGlobal:706 _buildListSteps:717 _buildSheetSteps:767 _buildProgressSteps:859 _buildSpellsSteps:917 _buildInventorySteps:954 _buildBattleSteps:994 _buildNotesSteps:1026 _buildPartySteps:1061 _buildJournalSteps:1119

**app-backup.js** (211 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:175

**app-pdf.js** (739 строк, 21 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:75 _pdfDecoBorder:91 _pdfSafeName:125 _pdfFormatMod:129 _pdfRule:132 _pdfSection:140 _pdfNeed:151 _pdfMultiline:161 _pdfFooter:179 _pdfStatsAndCombat:278 _pdfSaves:372 _pdfSkills:399 _pdfOrigin2024:429 _pdfAttacks:459 _pdfSpells:496 _pdfInventory:594 _pdfNotes:649

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (7486 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:124 SAVES_DATA:146 CONDITIONS:155 EFFECTS_DATA:178 CLASS_FEATURES:229 SPELL_PREP_CLASSES:479 CANTRIPS_KNOWN_2014:487 SPELLS_KNOWN_2014:495 SPELL_SLOTS_BY_LEVEL:502 CLASS_HIT_DICE:577 SUBCLASSES:583 SOURCE_LABELS:603 SUBCLASS_SOURCE:630 BOOK_CODES:699 _booksOffCache:702 SUBCLASS_LEVEL:743 SUBCLASS_FEATURES:759 WEAPON_PRESETS:1551 ITEM_ICONS:1595 CATEGORY_NAMES:1596 GEAR_PACKS:1605 RACE_DATA:1700 BACKGROUND_SKILLS:2317 BACKGROUND_ALIASES:2396 DEITY_ALIGN_LABELS:2409 DEITIES_DATA:2414 LANGUAGE_CATALOG:2482 RACE_LANGUAGES:2519 CLASS_LANGUAGES:2621 TOOL_CATALOG:2627 RACE_TOOLS:2682 CLASS_TOOLS:2694 SUBCLASS_LANGUAGES:2702 SUBCLASS_TOOLS:2725 RACE_ARMOR:2747 RACE_WEAPONS_SPECIFIC:2753 CLASS_WEAPONS_SPECIFIC:2769 RACE_NAME_POOLS:2782 RACE_NAME_GROUP:2824 SUBCLASS_ARMOR:2839 ARMOR_PRESETS:2870 skills:2887 ABILITY_INFO:2900 CLASS_SKILL_OPTIONS:2940 CLASS_SKILL_COUNT:2955 CLASS_SKILL_MC_COUNT:2956 CLASS_ARMOR_PROFS:2959 CLASS_RESOURCES:2979 ASI_LEVELS:3141 XP_THRESHOLDS:3149 APP_VERSION:3159 APP_VERSION_DATE:3160 APP_TELEGRAM_URL:3166 APP_BOOSTY_URL:3167 FEATS_DATA:3188 APP_CHANGELOG:3510 CASTER_TYPE:7314 THIRD_CASTER_SUBCLASSES:7323 THIRD_CASTER_SLOTS:7330 MULTICLASS_SPELL_SLOTS:7341 MULTICLASS_PREREQUISITES:7366 MULTICLASS_PROFICIENCIES:7384 EDITION_DATA:7413

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (869 строк)  
SPELL_EFFECTS:71

**class-choices.js** (700 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

