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
| 17277–17888 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

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
#tab-battle:1711-1716 #weapons-list:1717-1720 #battle-res-card:1721-1722 #battle-res-rows:1723-1724 #battle-setup-screen:1725-1735 #battle-setup-list:1736-1736 #battle-difficulty:1737-1740 #battle-tracker-screen:1741-1745  
#battle-turn-info:1746-1751 #battle-repeat-strip:1752-1752 #battle-tracker-list:1753-1762 #tab-journal:1763-1777 #journal-list:1778-1784 #screen-itemref:1785-1787 #item-ref-tabs:1788-1793 #item-ref-weight:1794-1832  
#item-ref-slots:1833-1864 #screen-dmref:1865-1867 #dm-ref-tabs:1868-1872 #dm-ref-ed:1873-1873 #dm-ref-cond:1874-1874 #dm-ref-combat:1875-1875 #dm-ref-world:1876-1880 #screen-help:1881-1903  
#help-about:1904-1927 #help-start:1928-1952 #help-sheet:1953-1976 #help-progress:1977-2022 #help-spells:2023-2039 #help-inventory:2040-2052 #help-battle:2053-2077 #help-party:2078-2094  
#help-notes:2095-2103 #help-journal:2104-2112 #help-planes:2113-2140 #help-dice:2141-2152 #help-edition2024:2153-2192 #help-data:2193-2209 #help-marks:2210-2232 #conc-details-modal:2233-2243  
#conc-detail-duration-row:2244-2251 #conc-detail-desc-row:2252-2261 #add-journal-modal:2262-2285 #add-npc-modal:2286-2315 #add-ally-modal:2316-2352 #screen-monsters:2353-2365 #srd-monster-count:2366-2366 #srd-monster-results:2367-2371  
#srd-npc-modal:2372-2381 #srd-npc-count:2382-2382 #srd-npc-results:2383-2390 #screen-monsterform:2391-2428 #monster-cr-note:2429-2431 #monster-stats:2432-2433 #monster-saves:2434-2435 #monster-attacks:2436-2459  
#screen-rest:2460-2462 #rest-main-screen:2463-2469 #rest-info-screen:2470-2474 #hit-dice-section:2475-2476 #hit-dice-controls-total:2477-2481 #hit-dice-by-size:2482-2486 #rest-food-section:2487-2495 #rest-result-screen:2496-2498  
#rest-result-details:2499-2507 #screen-levelup:2508-2512 #lu-screen-multiclass:2513-2514 #lu-mc-current-classes:2515-2517 #lu-mc-new-class:2518-2522 #lu-mc-prereq-warn:2523-2523 #lu-mc-subclass-row:2524-2532 #lu-screen-preview:2533-2565  
#lu-slots-card:2566-2567 #lu-slots-info:2568-2571 #lu-build-hint:2572-2572 #lu-features-container:2573-2580 #lu-screen-choices:2581-2582 #lu-choices-body:2583-2589 #lu-screen-result:2590-2591 #lu-result-title:2592-2592  
#lu-result-body:2593-2599 #screen-hphistory:2600-2602 #hp-history-list:2603-2608 #asi-modal:2609-2613 #asi-build-hint:2614-2628 #asi-feat-list:2629-2629 #asi-stat-grid:2630-2630 #asi-preview:2631-2639  
#class-choice-modal:2640-2655 #dice-modal:2656-2688 #dice-file-hint:2689-2689 #dice3d-result:2690-2701 #dice-result-display:2702-2715 #dice-pick-hint:2716-2716 #dice-mode-segment:2717-2721 #dice-formula-panel:2722-2738  
#dice-fan:2739-2747 #dice-popover-settings:2748-2795 #dice-popover-history:2796-2807 #dice-history:2808-2816 #screen-spellsearch:2817-2819 #spell-feat-bar:2820-2836 #spell-class-filter:2837-2880 #class-filter-legend:2881-2882  
#spell-search-count:2883-2883 #spell-search-results:2884-2887 #cast-spell-modal:2888-2892 #cast-spell-options:2893-2895 #add-spell-modal:2896-2939 #new-spell-class-chips:2940-2985 #new-spell-mech-fields:2986-2990 #new-spell-mech-dmg-row:2991-3010  
#new-spell-mech-half-row:3011-3013 #new-spell-mech-mod-row:3014-3024 #item-modal:3025-3069 #item-armor-fields:3070-3095 #coin-exchange-modal:3096-3134 #exch-preview:3135-3141 #screen-magiccatalog:3142-3169 #magic-catalog-count:3170-3170  
#magic-catalog-list:3171-3174 #screen-gearcatalog:3175-3179 #gear-packs-list:3180-3193 #gear-catalog-count:3194-3194 #gear-catalog-list:3195-3199 #weapon-modal:3200-3203 #weapon-picker-section:3204-3206 #weapon-filter-chips:3207-3216  
#weapon-presets-list:3217-3279 #character-tabs:3280-3291 #quick-roll-strip:3292-3297 #qrs-list:3298-3308 #active-effects-panel:3309-3313 #aef-list:3314-3320 #hp-toast-container:3321-3323 #add-companion-modal:3324-3340  
#companion-familiar-row:3341-3361 #mob-sheet:3362-3365 #mob-sheet-list:3366-3369 #confirm-modal:3370-3383 #avatar-modal:3384-3387 #avatar-modal-preview:3388-3415 #screen-builds:3416-3443 #bp-list:3444-3448  
#screen-buildguide:3449-3451 #bg-body:3452-3456 #screen-buildplan:3457-3459 #bp-plan-body:3460-3464 #screen-abilityinfo:3465-3467 #ai-body:3468-3472 #screen-abilgen:3473-3475 #ag-body:3476-3480  
#screen-books:3481-3483 #books-body:3484-3488 #screen-mclayout:3489-3491 #ml-body:3492-3496 #screen-featureinfo:3497-3499 #fi-body:3500-3504 #app-log-panel:3505-3524 #app-log-list:3525-3685  
#notes-entry-modal:3686-3734  

## Функции по файлам (`имя:строка`)

**rules.js** (1641 строк, 106 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHitDicePool:57 _hdSizesDesc:65 rulesHitDiceSpentBy:71 rulesHitDiceLabel:95 rulesPickHitDice:103 rulesClampHitDice:115 rulesRitualMinutes:127 rulesHitDieHeal:134 rulesSpendHitDice:140 charClassLevel:164 charHasClass:174 charClassLevelOr:184 charAsiSlots:193 charEpicSlots:208 charSubclassPending:226 charXpNext:239 rulesJackOfAllTrades:250 charClassSubclass:255 rulesHasFeat:264 rulesHasFightingStyle:269 rulesHasDraconicResilience:281 rulesHasDazzlingFootwork:286 rulesRemarkableAthlete:291 rulesUntrainedCheckBonus:297 rulesHasExpertise:304 getInitiativeMod:310 rulesSaveBonus:324 rulesSkillBonus:330 rulesPassivePerception:345 rulesSpellStats:349 _spellStatMod:369 rulesSpellStatsByClass:377 rulesWeaponMods:395 rulesOffhandDamageMod:411 armorPenalties:420 rulesItemArmor:433 rulesArmorItem:445 rulesAC:456 charCasterLevel:638 classSpellSlotRow:679 getMulticlassSpellSlots:692 rulesRestoreLevelFields:728 rulesApplySpellSlots:747 resolvePactSlots:770 restoreItemCharges:780 rulesHitDieSides:797 rulesShortRest:803 rulesLongRestBlockReason:838 rulesLongRest:851 rulesExhaustionLevel:917 rulesEffectiveHpMax:923 _dsReset:928 _dsCount:929 _dsFill:930 _condAdd:931 _condRemove:932 rulesIsDead:934 rulesIsStable:938 rulesRegainFromZero:943 rulesDamageAfterDefenses:949 rulesApplyDamage:961 rulesDeathSaveBlockReason:998 rulesDeathSave:1005 rulesConditionRollMods:1024 rulesEffectiveSpeed:1041 rulesArmorStealthDisadv:1062 rulesFeatPrereqMissing:1071 rulesFeatStatChoice:1098 rulesFeatStatOptions:1106 rulesFeatSlotCount:1119 rulesFeatSpellFits:1124 rulesFeatSpellCandidates:1135 rulesFeatSpellLabel:1139 rulesFeatSpellProgress:1144 rulesFeatClassOptions:1169 rulesFeatFreeResId:1182 rulesResetFeatFree:1185 concSaveParams:1196 rulesCrToXp:1232 rulesCrToProf:1238 rulesEncounterMultiplier:1245 rulesEncounterDifficulty:1254 getCharClassPairs:1278 charEditionMismatch:1292 findLangInCatalog:1300 ensureLanguagesArray:1312 recalcLanguagesFromSources:1328 add:1333 findToolInCatalog:1378 ensureToolsArray:1390 getBackgroundDef:1411 validateBgStatChoice:1447 parseBackgroundToolEntry:1467 recalcToolsFromSources:1482 add:1487 ensureArmorWeaponFields:1552 recalcArmorWeaponFromSources:1565 addArmor:1571 addWeapon:1572 addSpec:1621

**app-core.js** (1629 строк, 76 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 saveToLocal:326 initPersistentStorage:349 _formatStorageBytes:370 updateStorageStatus:378 currentScreenName:439 screenBack:445 _modalVisible:459 _closeOpenModals:462 headerBack:472 _screenMotionOk:505 _screenGhostDrop:511 _screenGhostStart:523 _screenEnter:541 showScreen:550 updateHeaderTitle:652 syncDrawerHeader:706 switchTab:718 openDrawer:748 closeDrawer:761 showCharacterNav:773 hideCharacterNav:781 isInteractive:801 currentActiveTab:824 createNewCharacter:882 getClassColor:903 getClassIcon:918 getAbilityIcon:925 getConditionIcon:940 getConditionChipIcon:964 getSpellClassIcon:982 getSchoolSlug:999 getSchoolIcon:1003 stripLeadingEmoji:1016 formatTimeAgo:1020 setCharSort:1034 setCharSearch:1041 duplicateCharacter:1045 exportOneCharacter:1057 updateCharCounter:1064 onDragStart:1081 onDragOver:1082 onDrop:1083 renderCharacterList:1094 renderCharPlate:1180 deleteCharacter:1239 showConfirmModal:1253 safeSet:1300 safeSetChecked:1304 loadCharacter:1313 showToast:1501 toastAddAction:1518 emptyStateHtml:1536 openHPHistory:1547 closeHPHistory:1575 updateVersionBlock:1580 forceAppUpdate:1611

**app-migrate.js** (1023 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1015

**app-builds.js** (1724 строк, 45 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _stemSet:192 _matchByStems:198 _weaponMatchNames:206 _findWeapon:209 _findArmorPreset:234 applyBuild:248 _applyBuildCore:271 _pick:896 _glossNorm:1005 _reEscape:1006 _glossEd:1007 _glossBuild:1008 ingest:1010 _glossIndex:1032 glossarizeHtml:1040 _glossPopoverEl:1054 hideGlossPopover:1066 showGlossPopover:1071 _glossBindOnce:1090 openBuildGuide:1121 gx:1144 _list:1145 getBuildLevelRec:1208 getBuildRecChoiceOption:1213 getBuildRecChoiceIds:1221 getBuildRecFeat:1226 getBuildRecAsi:1236 getBuildRecSubclass:1243 parseAsiFromHeadline:1251 _buildFeatNameMap:1265 parseFeatFromHeadline:1307 parseSpellsFromHeadline:1324 getBuildRecSpellObjs:1570 openBuildPlan:1590 _cpSubclassOf:1643 _cpClassSwitch:1654 openClassPlan:1669

**app-io.js** (705 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:89 _normalizeImportedSpell:98 _isValidImportedSpell:109 _collectCharUserSpells:113 _ingestImportedUserSpells:131 _spellBaseById:177 _unpackSpell:185 _countUnresolvedSpells:207 _unresolvedNote:215 _importTooNew:220 _packSpell:229 _packCharForExport:240 _unpackCharSpells:247 _buildCharEnvelope:253 _charExportFileName:268 _downloadText:271 _shareableFile:282 shareOneCharacter:293 copyCharToClipboard:310 pasteCharFromClipboard:323 _extractCharsFromImport:341 _applyFullRestore:353 _warnEditionMix:397 run:398 importData:413 importOneCharacter:472 _importOneCharText:489 _consumeLaunchFiles:570 _importLaunchText:603 exportSpells:610 importSpells:619 exportSessionLog:692

**app-combat.js** (3292 строк, 149 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:244 toggleAbilOpen:272 abilityBreakdown:284 openAbilityInfo:312 toggleExpertise:347 loadExpertise:366 updateSkillProfCount:380 updateSkillSources:392 updateClassFeatures:416 calculateAC:431 toggleInspiration:492 updateStatusCounter:505 updateStatusBar:519 updateInspirationLabels:559 updateStatDisplay:576 updateAllStatDisplays:581 adjustStat:585 adjustCoin:608 renderCoinMob:622 openCoinSheet:632 setCoinFromSheet:642 updateCoinTotal:649 openCoinExchange:661 closeCoinExchange:666 previewExchange:670 coinExchangeCalc:698 confirmExchange:703 updateSubclassOptions:726 updateSubclassRecHint:783 featHpPerLevel:798 featHpFlat:807 recalculateHP:816 updateChar:863 toggleProficiency:930 calcStats:953 setSpellStat:1024 calcSpellStats:1035 onRaceChange:1086 renderBooksRow:1216 openMobSheet:1243 closeMobSheet:1250 mobSheetActs:1252 openBooksSheet:1257 toggleCharBook:1267 populateRaceSelect:1284 _speciesEffective:1317 _renderSpeciesBar:1330 _speciesChoiceOptions:1345 toggleSpeciesChoice:1352 syncSpeciesSpells:1366 rollRandomName:1412 pick:1420 build:1421 _raceSkillAllowance:1480 _raceFlexCount:1486 _raceFlexFits:1492 _raceFlexApply:1499 _setExtrasHtml:1509 renderRaceExtras:1518 toggleHalfElfStat:1689 toggleRaceFlexStat:1715 setRaceVariableTrait:1745 _raceSkillSet:1762 _pickHide:1772 _pickExpandBtn:1776 pickExpand:1779 raceLangGoto:1786 toggleRaceSkill:1794 _classSkillList:1823 _skillsFromOtherSources:1836 _skillsByName:1845 _skillTakenElsewhere:1851 _classSkillHeld:1863 _classSkillSync:1869 renderClassSkills:1900 toggleClassSkill:1943 openRaceFeatModal:1971 removeRaceFeat:1991 applyBasicLockUI:2026 updateLockButtonState:2056 lockBasicInfo:2093 unlockBasicInfo:2109 isSheetLocked:2137 sheetLockGuard:2143 applySheetLockUI:2149 _creationTodo:2178 add:2182 src:2183 scheduleCreationTodo:2242 renderCreationTodo:2247 creationTodoGo:2272 openLockSheet:2282 _creationUiReset:2295 _isMobSheet:2296 renderIdentitySummary:2297 toggleIdentityMore:2316 renderProfSummary:2320 toggleProfCard:2335 openAcSheet:2341 _mobMarkClamp:2349 init:2358 lockSheet:2379 doLock:2383 unlockSheet:2396 onBackgroundChange:2417 _bgSkillsOf:2462 _bgUncheckOld:2469 _bgCheckSkills:2477 renderBackgroundFeature:2489 _bgStatShort:2534 populateBackgroundSelect:2537 _bgRevertStatChoice:2568 _bgAppliedStat:2581 _bgApplyStat:2586 setBgStatMode:2598 toggleBgStat:2610 _bgAfterStats:2633 _bgRevertFeatEffects:2644 syncOriginFeat:2664 toggleBgCustom:2700 _toggleBgCustom14:2740 toggleBgSkillPick:2787 _renderBgCustom14:2814 giveBackgroundEquipment:2851 renderBackgroundExtras:2894 _armorFromSelect:2999 renderArmorSelect:3011 onArmorPick:3046 onShieldPick:3060 onArmorChange:3079 onManualAC:3108 onManualMaxHP:3115 calcCoinWeight:3138 getActiveConditionsForRender:3152 toggleConditionsPopup:3181 closeConditionsPopup:3193 renderConditionsPopup:3199

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (350 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:234 _aefRowHtml:249 renderActiveEffectsFab:263 toggleActiveEffectsPanel:283 _aefBindOutside:302 advanceActiveEffects:322 removeActiveEffect:334

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1739 строк, 52 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:145 openLevelUpModal:229 _showMulticlassScreen:251 openMulticlassNewClass:295 confirmMulticlassNewClass:354 _showLevelUpPreview:365 closeLevelUpModal:532 confirmLevelUp:545 _luShowResult:671 luFinishChoices:695 luRefreshChoices:702 luSetSubclass:709 luApplyFeatById:728 luApplyAsi:774 _luFeatChoiceAt:795 _ccDefsFor:803 _luAsiDone:814 luApplyAllRecommendations:819 luBuildChoicesScreen:939 recBadge:947 luAddRecommendedSpells:1079 luGoToSpellsTab:1107 openLevelDownConfirm:1119 confirmLevelDown:1164 loadDeathSaves:1197 toggleDeathSave:1241 resetDeathSaves:1258 updateHPDisplay:1271 hpToggleRow:1352 hpSetRowOpen:1361 updateHPSummary:1369 updateHPRows:1433 quickHP:1451 addHPHistory:1551 _hpUndoPrepare:1568 undoHPChange:1584 showHPToast:1612 applyCustomHP:1637 saveTempHP:1654 rollHitDieQuick:1668 renderHitDiceIcons:1696 rollDeathSave:1710

**app-inventory.js** (1744 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:992 toggleWeaponFilter:996 fillWeaponPreset:1003 _resetWeaponForm:1021 openWeaponModal:1040 closeWeaponModal:1050 editWeapon:1058 deleteCustomWeapon:1088 _weaponPresetByName:1114 checkWeaponProficiency:1121 submitWeapon:1149 weaponRowTap:1240 renderWeapons:1253 isLightWeapon:1332 toggleTWFStyle:1337 rollTWFAttack:1345 _weaponDamageRoll:1393 rollTWFDamage:1414 rollWeaponAttack:1426 rollWeaponDamage:1481 removeWeapon:1510 _invDndInit:1544 _invClearIndicators:1573 _invSetIndicator:1582 _invCleanup:1587 _invCancelDrag:1594 _invMoveItem:1602 _invCommitDrop:1619 invDragStart:1640 invDragOver:1650 invDragLeave:1667 invDrop:1671 invDragEnd:1677 invTouchStart:1684 invTouchMove:1700 invTouchEnd:1732

**app-spells.js** (2049 строк, 99 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:216 setSpellClass:225 _charSpellClassKey:234 _charMaxCastableLevel:245 _defaultSpellVersion:253 openSpellSearch:256 markCharOwnClassFilter:274 closeSpellSearch:304 _featPickCtx:315 featAddFixedSpells:330 openFeatSpellPicker:356 _featPickProgressText:373 _renderFeatPickBar:379 featPickSetClass:398 _featPickCandidates:406 _renderFeatPickList:416 addFeatSpell:447 removeFeatSpell:467 _parseSpellClassList:490 _syncNewSpellClassChips:494 toggleNewSpellClass:501 _fillNewSpellDamageTypes:526 _toggleHidden:533 updateNewSpellMechFields:541 _hbFormulaCheck:556 _collectHbEffect:565 _spellIdArg:603 _findHomebrewSpell:609 openAddSpellForm:617 _syncCustomSpellAcrossChars:696 _purgeCustomSpellFromChars:714 deleteCustomSpell:733 _deleteCustomSpellConfirmed:742 closeAddSpellForm:756 submitNewSpell:760 renderSpellSearch:850 addSpell:919 removeSpell:935 toggleSpellCard:949 renderMySpells:954 _spellActiveBadgeText:1096 _spellActiveBadgeHtml:1100 updateSpellActiveBadges:1103 _prepEntries:1126 _spellPrepEntry:1141 _prepLimit:1146 calcMaxPrepared:1162 _known2014:1169 calcMaxKnownSpells:1183 _knownSpellCount:1189 calcMaxCantrips:1199 isPrepClass:1208 _subclassSpellNames:1214 spellNeedsPrep:1241 _preparedCount:1257 isSpellPrepared:1264 toggleSpellPrepared:1274 renderPrepCounter:1300 _castableSlotOptions:1346 _arcanumResId:1367 castSpell:1377 _castSpellWithSlot:1398 _finishCast:1436 applyCastEffects:1482 openCastVariantChooser:1523 pickCastVariant:1562 closeCastVariantChooser:1572 _applyCastSummon:1585 _nextCastInstanceId:1619 _replaceCastInstance:1627 _ensureCastInstance:1657 _applyCastDamage:1677 _rollCastDamage:1693 _startCastRepeat:1758 castRepeatDamage:1772 _applyCastDebuff:1797 castSpellAttackMod:1838 castStatMod:1846 _applyCastHeal:1864 _castHealApply:1885 _applyCastTempHp:1891 applyCastTempHp:1908 _applyCastHpMaxBonus:1922 openCastChooser:1942 closeCastChooser:1963 canCastAsRitual:1976 castRitual:1998 cancelRitual:2037

**app-party.js** (2303 строк, 168 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentImport:268 openAddAllyModal:306 openEditAllyModal:307 closeAddAllyModal:308 saveAlly:309 deleteAlly:310 setAllyStatus:311 exportAllies:312 importAllies:313 openAddNPCModal:315 openEditNPCModal:316 closeAddNPCModal:317 saveNPC:318 deleteNPC:319 setNPCStatus:320 exportNPCs:321 importNPCs:322 openAddMonsterModal:324 openEditMonsterModal:325 closeAddMonsterModal:326 saveMonster:327 deleteMonster:328 setMonsterStatus:329 exportMonsters:330 importMonsters:331 _monSigned:338 _monFormFill:339 _monFormStat:355 monsterFormRefresh:356 toggleMonsterSave:372 monsterAddAttackRow:373 _monFormRead:385 _monFormApply:399 monsterSaveBonus:410 monsterStatBlockHtml:415 monsterRoll:441 monsterAttackRoll:445 _monCatalog:456 _monCatalogIndex:462 _monCatalogPut:468 deleteCatalogMonster:478 addMonsterFromCatalog:490 _npcAttColor:510 renderNPCs:516 renderMonsters:557 _openSrdMonsterPickerLazy:612 openSrdMonsterPicker:622 openSrdMonsterPickerForBattle:624 _openSrdMonsterPickerCore:629 closeSrdMonsterPicker:672 setSrdMonsterSearch:677 setSrdMonsterCr:678 setSrdMonsterEdition:679 renderSrdMonsterPicker:681 addMonsterFromSRD:751 openSrdNpcPicker:792 _openSrdNpcPickerCore:801 closeSrdNpcPicker:822 setSrdNpcSearch:824 setSrdNpcAtt:825 renderSrdNpcPicker:827 addNpcFromSRD:858 openBattleTab:888 buildBattleSetupList:901 setBattleSearch:921 toggleBattleSection:922 renderBattleSetup:927 battleEncounterInput:975 renderBattleDifficulty:995 toggleBattleCheck:1020 battleDragStart:1025 battleDragOver:1026 battleDrop:1027 battleDragEnd:1035 rollInitiativeValue:1040 sortParticipantsByInitiative:1045 _findPartyMonster:1051 _participantCombatMeta:1061 _makeBattleParticipant:1086 _battleParticipantHP:1099 _addSrdMonsterToBattle:1108 _addCatalogMonsterToBattle:1138 _participantStatBlock:1162 startBattle:1169 getParticipantDesc:1183 showTrackerInfo:1206 getSelfStatusFromHP:1249 syncSelfBattleStatus:1265 renderBattleTracker:1275 renderBattleCastPanels:1368 _battleCondList:1410 _battleCondSet:1418 _battleCondMeta:1423 _battleCondDots:1426 openBattleCondPicker:1440 closeBattleCondPicker:1445 _renderBattleCondPicker:1450 toggleBattleCondition:1497 adjustBattleExhaustion:1512 adjustBattleHP:1531 setBattleHP:1544 setBattleHPMax:1565 setBattleInitiative:1576 rerollInitiative:1588 battleRollD20:1600 removeBattleParticipant:1605 setBattleStatus:1621 _battleStatusFromHp:1629 offerCastDamageToBattle:1645 _castDamageTargets:1662 _castDamageAmount:1668 _renderCastDamageModal:1674 setCastDamageHalf:1737 toggleCastDamageTarget:1745 _castDamageHit:1755 applyCastDamageToTarget:1768 applyCastDamageTargets:1778 closeCastDamageModal:1788 _castHealTargets:1797 offerCastHealToBattle:1803 _renderCastHealModal:1811 toggleCastHealTarget:1856 applyCastHealTargets:1863 closeCastHealModal:1885 _castDebuffTargets:1906 offerCastDebuffToBattle:1912 _renderCastDebuffModal:1928 toggleCastDebuffTarget:1984 pickCastDebuffTarget:1994 applyCastDebuffTargets:2003 closeCastDebuffModal:2031 _battleDebuffChips:2040 removeBattleDebuff:2057 removeBattleDebuffsForSpell:2070 clearAllBattleDebuffs:2085 _logTurn:2090 nextTurn:2095 _battleEconomyRow:2115 toggleBattleEconomy:2127 resetBattleEconomy:2133 prevTurn:2137 tickCastEffectsRound:2148 endBattle:2176 _dmRefEsc:2250 _dmRefGroup:2254 renderDmRef:2265 t:2269 openDmRef:2285 closeDmRef:2290 switchDmRef:2294

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1189 строк, 67 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:560 crSlotRecoveryActs:564 recoverSlotByResource:579 crRowsHtml:605 crSetRows:641 renderClassResources:656 spendResource:674 resetResource:692 toggleResourcePip:702 resetResourcesByRest:727 getJournal:769 addJournalEntry:774 filterJournal:796 renderJournal:803 deleteJournalEntry:839 openAddJournalEntry:848 closeAddJournalEntry:852 saveJournalEntry:855 getCompanions:875 renderCompanions:880 companionHP:925 buildFamiliarFormOptions:938 onCompanionTypeChange:950 applyFamiliarForm:958 openAddCompanionModal:970 summonFamiliar:986 openPrefilledCompanionModal:996 openEditCompanionModal:1007 closeAddCompanionModal:1026 saveCompanion:1029 deleteCompanion:1054 switchProfilesTab:1070 clipChangelogText:1085 expandChangelogItem:1096 renderChangelog:1102 openItemRef:1147 closeItemRef:1152 switchItemRef:1157 _syncHeaderHeight:1175

**app-dice.js** (1454 строк, 65 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:217 rollDice:221 _quickRollCompute:316 _quickRollModStr:335 _emitDiceRolled:341 _setDiceSettled:349 _setSettledDice:359 _quickRollRecord:376 _quickRollInfoText:383 _quickRollToastText:390 quickRoll:406 renderQuickRollStrip:464 updateQuickRollStripVisibility:486 dismissQuickRollStrip:501 openDiceRollHistory:506 drawDiceSVG:519 _waitDiceBoxModule:538 _diceLsGet:558 _getAccentColor:566 _getDiceTheme:585 _getDiceThemeColor:592 setDiceTheme:595 _syncDiceThemeButtons:601 _getDiceBg:611 setDiceBg:618 _syncDiceBgButtons:624 _diceDbg:634 _initDiceBox:639 animateDice3d:745 animateDice2d:940 buildDie:966 tick:1034 _applyDiceCritGlow:1057 parseDiceFormula:1078 _formulaCanon:1114 _renderFormulaResult:1126 rollFormula:1162 _rollFormulaFrom:1228 rollCustomFormula:1241 renderDiceHistory:1244 createParticles:1266 _diceShapeSvg:1300 renderDiceFan:1307 _paintSelectedDie:1326 _diceHeroSvg:1350 _paintDiceMode:1360 selectDie:1375 rollSelectedDie:1394 toggleDiceFormulaPanel:1403 _diceHotkeys:1422

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

**data.js** (7461 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:123 SAVES_DATA:145 CONDITIONS:154 EFFECTS_DATA:177 CLASS_FEATURES:228 SPELL_PREP_CLASSES:478 CANTRIPS_KNOWN_2014:486 SPELLS_KNOWN_2014:494 SPELL_SLOTS_BY_LEVEL:501 CLASS_HIT_DICE:576 SUBCLASSES:582 SOURCE_LABELS:602 SUBCLASS_SOURCE:629 BOOK_CODES:698 _booksOffCache:701 SUBCLASS_LEVEL:742 SUBCLASS_FEATURES:758 WEAPON_PRESETS:1550 ITEM_ICONS:1594 CATEGORY_NAMES:1595 GEAR_PACKS:1604 RACE_DATA:1699 BACKGROUND_SKILLS:2316 BACKGROUND_ALIASES:2395 DEITY_ALIGN_LABELS:2408 DEITIES_DATA:2413 LANGUAGE_CATALOG:2481 RACE_LANGUAGES:2518 CLASS_LANGUAGES:2620 TOOL_CATALOG:2626 RACE_TOOLS:2681 CLASS_TOOLS:2693 SUBCLASS_LANGUAGES:2701 SUBCLASS_TOOLS:2724 RACE_ARMOR:2746 RACE_WEAPONS_SPECIFIC:2752 CLASS_WEAPONS_SPECIFIC:2768 RACE_NAME_POOLS:2781 RACE_NAME_GROUP:2823 SUBCLASS_ARMOR:2838 ARMOR_PRESETS:2869 skills:2886 ABILITY_INFO:2899 CLASS_SKILL_OPTIONS:2939 CLASS_SKILL_COUNT:2954 CLASS_SKILL_MC_COUNT:2955 CLASS_ARMOR_PROFS:2958 CLASS_RESOURCES:2978 ASI_LEVELS:3140 XP_THRESHOLDS:3148 APP_VERSION:3158 APP_VERSION_DATE:3159 APP_TELEGRAM_URL:3165 APP_BOOSTY_URL:3166 FEATS_DATA:3187 APP_CHANGELOG:3509 CASTER_TYPE:7289 THIRD_CASTER_SUBCLASSES:7298 THIRD_CASTER_SLOTS:7305 MULTICLASS_SPELL_SLOTS:7316 MULTICLASS_PREREQUISITES:7341 MULTICLASS_PROFICIENCIES:7359 EDITION_DATA:7388

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (869 строк)  
SPELL_EFFECTS:71

**class-choices.js** (700 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

