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
| index.html — блоки верхнего уровня (`#id:строки`) | 130–173 |
| Функции по файлам (`имя:строка`) | 174–247 |
| Данные — константы верхнего уровня (`имя:строка`) | 248–264 |


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
| 670–1024 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1025–1030 | R2. Базовые компоненты |
| 1031–1158 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1159–1304 | UI-3. Desktop/tablet layout (≥1024px) |
| 1305–1491 | UI5-4: ПК — многоколоночная раскладка листа |
| 1492–1574 | /R2 |
| 1575–1742 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 1743–1965 | HEADER (R5: back + name + hamburger) |
| 1966–2028 | КД АВТО-РАСЧЁТ |
| 2029–2092 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2093–2155 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2156–2310 | УСЛОВИЯ |
| 2311–2452 | СПАСБРОСКИ |
| 2453–2580 | CLASS FEATURES |
| 2581–2620 | УБИРАЕМ СТРЕЛКИ |
| 2621–2727 | TAB NAV — 5 tabs + centered FAB dice |
| 2728–2836 | UX-5: лента последних бросков вне модалки |
| 2837–2973 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 2974–2993 | HAMBURGER BUTTON |
| 2994–3036 | SIDE DRAWER |
| 3037–3433 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3434–3481 | MENU-8/9: встречающий экран во всё окно. |
| 3482–3574 | MENU-2: плашка последнего героя. |
| 3575–3751 | MENU-3: меню приключения. |
| 3752–3821 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 3822–3822 | INVENTORY |
| 3823–3853 | INVENTORY — WEIGHT BAR |
| 3854–3876 | INVENTORY — BACKPACK HEADER |
| 3877–3917 | INVENTORY — FILTERS |
| 3918–4070 | INVENTORY — ITEM CARDS |
| 4071–4386 | COINS — BIG NUMBER CARD GRID |
| 4387–4688 | MODALS |
| 4689–4697 | DICE |
| 4698–5196 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5197–5928 | OTHER STYLES |
| 5929–5999 | HP DISPLAY BLOCK |
| 6000–6024 | MOBILE OPTIMIZATION |
| 6025–6155 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6156–6194 | HP TOAST (snackbar) |
| 6195–6228 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 6229–6285 | Confirm Modal |
| 6286–6663 | ⚔️ ОТРЯД & БОЙ |
| 6664–6895 | RACIAL BONUS BAR |
| 6896–7044 | COMPACT STATS GRID |
| 7045–7296 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 7297–7349 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 7350–7397 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 7398–7500 | COMPACT SKILLS |
| 7501–7543 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 7544–7615 | ACCORDION |
| 7616–7622 | CLASS RESOURCES |
| 7623–7719 | ASI MODAL |
| 7720–7887 | APP VERSION |
| 7888–7897 | COMPANIONS |
| 7898–7938 | FEATS LIST IN ASI |
| 7939–8184 | PROFILES TABS (Чейнджлог) |
| 8185–8260 | TAKEN FEATS |
| 8261–8453 | SW UPDATE MODAL |
| 8454–8505 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8506–8673 | INVENTORY SLOTS SYSTEM |
| 8674–8878 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 8879–9091 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9092–9240 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9241–9310 | 3D DICE CUBE |
| 9311–9653 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9654–9727 | DESKTOP LAYOUT — centered max-width |
| 9728–9751 | INSPIRATION |
| 9752–9791 | CONCENTRATION |
| 9792–10309 | WEAPON CARDS WITH ROLL BUTTONS |
| 10310–10404 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10405–10465 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10466–10487 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10488–10600 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10601–10628 | R6: Ассеты (декор) |
| 10629–11497 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11498–11581 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11582–11590 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11591–11648 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11649–11965 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 11966–11992 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 11993–12019 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 12020–12102 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12103–13104 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13105–13160 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13161–13256 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13257–13588 | DISC-1 · Ромб раскрытия |
| 13589–14123 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14124–14229 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14230–14365 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14366–14566 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14567–14575 | STYLE-8b3-fix: срезанный ромб |
| 14576–14843 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14844–15304 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15305–15339 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15340–17028 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:93-94 #conditions-popup-overlay:95-95 #conditions-popup:96-100 #conditions-popup-list:101-104 #drawer-overlay:105-106 #side-drawer:107-144 #screen-settings:145-236 #header-autohide-row:237-253  
#wake-lock-row:254-284 #edition-row:285-307 #install-row:308-318 #welcome-modal:319-323 #welcome-step-1:324-342 #welcome-step-2:343-377 #header-avatar:378-383 #status-bar:384-387  
#status-inspiration:388-388 #status-concentration:389-391 #status-ritual:392-394 #status-conditions-btn:395-408 #screen-home:409-411 #home-art:412-439 #home-sub-new:440-487 #home-install:488-495  
#home-hero:496-496 #home-hero-emblem:497-500 #home-hero-sub:501-501 #home-hero-chips:502-512 #screen-characters:513-552 #char-hero:553-553 #char-hero-emblem:554-557 #char-hero-sub:558-558  
#char-hero-chips:559-559 #char-hero-actions:560-568 #screen-data:569-585 #backup-panel:586-590 #backup-list:591-592 #sync-row:593-593 #storage-status:594-605 #screen-about:606-609  
#app-version-row:610-617 #ptab-info:618-625 #app-links-row:626-630 #ptab-changelog:631-636 #changelog-list:637-643 #screen-character:644-644 #tab-sheet:645-647 #creation-wizard-banner:648-655  
#cw-edition-row:656-665 #cw-validation:666-668 #basic-locked-bar:669-678 #creation-todo:679-688 #sheet-avatar:689-701 #char-build-badge-wrap:702-716 #char-class-mc:717-740 #char-subclass-rec:741-741  
#char-subclass-mc:742-950 #char-books:951-955 #race-bonus-display:956-956 #race-extras-panel:957-957 #class-skills-panel:958-959 #background-feature-display:960-961 #bg-extras-panel:962-1005 #abilgen-row:1006-1012  
#stats-collapse-btn:1013-1020 #abilities-region:1021-1024 #proficiency-bonus-2024:1025-1026 #insp-card-2024:1027-1036 #abil-col-1:1037-1037 #stat-block-str:1038-1039 #mod-str:1040-1046 #abil-save-slot-str:1047-1047  
#abil-skills-slot-str:1048-1050 #stat-block-dex:1051-1052 #mod-dex:1053-1059 #abil-save-slot-dex:1060-1060 #abil-skills-slot-dex:1061-1063 #stat-block-int:1064-1065 #mod-int:1066-1072 #abil-save-slot-int:1073-1073  
#abil-skills-slot-int:1074-1077 #abil-col-2:1078-1078 #stat-block-con:1079-1080 #mod-con:1081-1087 #abil-save-slot-con:1088-1088 #abil-skills-slot-con:1089-1091 #stat-block-wis:1092-1093 #mod-wis:1094-1100  
#abil-save-slot-wis:1101-1101 #abil-skills-slot-wis:1102-1104 #stat-block-cha:1105-1106 #mod-cha:1107-1113 #abil-save-slot-cha:1114-1114 #abil-skills-slot-cha:1115-1128 #saves-grid:1129-1138 #skills-container:1139-1141  
#passive-perception:1142-1161 #ws-hp-banner:1162-1167 #hp-dmg-row:1168-1177 #hp-dmg-body:1178-1198 #death-saves-section:1199-1230 #hp-armor-body:1231-1272 #hp-hd-body:1273-1286 #hp-rest-body:1287-1314  
#class-dev-section:1315-1317 #cd-head:1318-1318 #cd-res:1319-1319 #cd-attn:1320-1321 #cd-about:1322-1330 #ac-formula:1331-1332 #ac-modifiers:1333-1340 #conditions-grid:1341-1348  
#effects-grid:1349-1356 #resistances-container:1357-1365 #prof-card:1366-1369 #armor-prof-container:1370-1373 #weapon-prof-container:1374-1377 #tools-container:1378-1381 #languages-container:1382-1389 #companions-list-sheet:1390-1402  
#tab-progress:1403-1404 #pg-body:1405-1406 #tab-spells:1407-1409 #spell-stat-card:1410-1431 #spell-mod-display:1432-1437 #spell-dc-display:1438-1443 #spell-attack-display:1444-1449 #spell-stats-by-class:1450-1461  
#spell-slots-card:1462-1466 #spell-slots-visual:1467-1473 #concentration-block:1474-1491 #rd-find-spl-wrap:1492-1492 #prep-counter:1493-1493 #my-spells-list:1494-1495 #rd-slot-strip:1496-1497 #tab-inventory:1498-1501  
#rd-find-inv-wrap:1502-1518 #weight-fill:1519-1553 #inventory-list:1554-1558 #inv-coins-card:1559-1563 #rd-exch:1564-1574 #inv-pouches:1575-1630 #tab-notes:1631-1657 #notes-subtabs:1658-1659  
#notes-main:1660-1661 #taken-feats-section:1662-1666 #taken-feats-list:1667-1670 #tab-party:1671-1680 #my-char-card:1681-1694 #allies-list:1695-1709 #npcs-list:1710-1725 #monsters-list:1726-1737  
#companions-list-world:1738-1748 #tab-battle:1749-1754 #weapons-list:1755-1757 #ws-card:1758-1760 #saved-roll-form:1761-1767 #saved-roll-err:1768-1769 #saved-rolls-list:1770-1773 #battle-res-card:1774-1775  
#battle-res-rows:1776-1777 #battle-setup-screen:1778-1788 #battle-setup-list:1789-1789 #battle-difficulty:1790-1793 #battle-tracker-screen:1794-1798 #battle-turn-info:1799-1804 #battle-repeat-strip:1805-1805 #battle-tracker-list:1806-1815  
#tab-journal:1816-1830 #journal-list:1831-1837 #screen-itemref:1838-1840 #item-ref-tabs:1841-1846 #item-ref-weight:1847-1885 #item-ref-slots:1886-1917 #screen-dmref:1918-1920 #dm-ref-tabs:1921-1925  
#dm-ref-ed:1926-1926 #dm-ref-cond:1927-1927 #dm-ref-combat:1928-1928 #dm-ref-world:1929-1933 #screen-help:1934-1956 #help-about:1957-1980 #help-start:1981-2005 #help-sheet:2006-2029  
#help-progress:2030-2075 #help-spells:2076-2092 #help-inventory:2093-2105 #help-battle:2106-2130 #help-party:2131-2147 #help-notes:2148-2156 #help-journal:2157-2165 #help-planes:2166-2193  
#help-dice:2194-2205 #help-edition2024:2206-2245 #help-data:2246-2262 #help-marks:2263-2285 #conc-details-modal:2286-2296 #conc-detail-duration-row:2297-2304 #conc-detail-desc-row:2305-2314 #add-journal-modal:2315-2338  
#add-npc-modal:2339-2368 #add-ally-modal:2369-2405 #screen-monsters:2406-2418 #srd-monster-count:2419-2419 #srd-monster-results:2420-2424 #srd-npc-modal:2425-2434 #srd-npc-count:2435-2435 #srd-npc-results:2436-2443  
#screen-monsterform:2444-2481 #monster-cr-note:2482-2484 #monster-stats:2485-2486 #monster-saves:2487-2488 #monster-attacks:2489-2512 #screen-rest:2513-2515 #rest-main-screen:2516-2517 #rest-card-short:2518-2520  
#hit-dice-section:2521-2522 #hit-dice-controls-total:2523-2527 #hit-dice-by-size:2528-2533 #rest-card-long:2534-2536 #rest-food-section:2537-2547 #rest-result-screen:2548-2550 #rest-result-details:2551-2559 #screen-levelup:2560-2564  
#lu-screen-multiclass:2565-2566 #lu-mc-current-classes:2567-2569 #lu-mc-new-class:2570-2574 #lu-mc-prereq-warn:2575-2575 #lu-mc-subclass-row:2576-2584 #lu-screen-preview:2585-2617 #lu-slots-card:2618-2619 #lu-slots-info:2620-2623  
#lu-build-hint:2624-2624 #lu-features-container:2625-2633 #lu-screen-choices:2634-2635 #lu-choices-body:2636-2642 #lu-screen-result:2643-2644 #lu-result-title:2645-2645 #lu-result-body:2646-2652 #screen-wildshape:2653-2658  
#ws-limits:2659-2659 #ws-results:2660-2663 #screen-hphistory:2664-2666 #hp-history-list:2667-2672 #asi-modal:2673-2677 #asi-build-hint:2678-2692 #asi-feat-list:2693-2693 #asi-stat-grid:2694-2694  
#asi-preview:2695-2703 #class-choice-modal:2704-2719 #dice-modal:2720-2752 #dice-file-hint:2753-2753 #dice3d-result:2754-2765 #dice-result-display:2766-2779 #dice-pick-hint:2780-2780 #dice-mode-segment:2781-2785  
#dice-formula-panel:2786-2803 #dice-fan:2804-2812 #dice-popover-settings:2813-2860 #dice-popover-history:2861-2872 #dice-history:2873-2881 #screen-spellsearch:2882-2884 #spell-feat-bar:2885-2900 #spell-ver-filter:2901-2907  
#spell-class-filter:2908-2939 #class-filter-legend:2940-2941 #spell-search-count:2942-2943 #spell-search-results:2944-2947 #cast-spell-modal:2948-2952 #cast-spell-options:2953-2955 #add-spell-modal:2956-2999 #new-spell-class-chips:3000-3045  
#new-spell-mech-fields:3046-3050 #new-spell-mech-dmg-row:3051-3070 #new-spell-mech-half-row:3071-3073 #new-spell-mech-mod-row:3074-3084 #item-modal:3085-3129 #item-armor-fields:3130-3155 #coin-exchange-modal:3156-3194 #exch-preview:3195-3201  
#screen-magiccatalog:3202-3229 #magic-catalog-count:3230-3230 #magic-catalog-list:3231-3234 #screen-gearcatalog:3235-3239 #gear-packs-list:3240-3253 #gear-catalog-count:3254-3254 #gear-catalog-list:3255-3259 #weapon-modal:3260-3263  
#weapon-picker-section:3264-3266 #weapon-filter-chips:3267-3276 #weapon-presets-list:3277-3277 #weapon-pick-bar:3278-3341 #rd-quick-dock:3342-3342 #character-tabs:3343-3361 #quick-roll-strip:3362-3367 #qrs-list:3368-3378  
#active-effects-panel:3379-3383 #aef-list:3384-3390 #hp-toast-container:3391-3393 #add-companion-modal:3394-3410 #companion-familiar-row:3411-3431 #mob-sheet:3432-3435 #mob-sheet-list:3436-3439 #confirm-modal:3440-3453  
#avatar-modal:3454-3457 #avatar-modal-preview:3458-3485 #screen-builds:3486-3513 #bp-list:3514-3518 #screen-buildguide:3519-3521 #bg-body:3522-3526 #screen-buildplan:3527-3529 #bp-plan-body:3530-3534  
#screen-abilityinfo:3535-3537 #ai-body:3538-3542 #screen-abilgen:3543-3545 #ag-body:3546-3550 #screen-books:3551-3553 #books-body:3554-3558 #screen-mclayout:3559-3561 #ml-body:3562-3566  
#screen-featureinfo:3567-3569 #fi-body:3570-3574 #screen-creator:3575-3577 #cr-progress:3578-3578 #cr-body:3579-3589 #app-log-panel:3590-3609 #app-log-list:3610-3791 #notes-entry-modal:3792-3840  

## Функции по файлам (`имя:строка`)

**rules.js** (1799 строк, 120 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:345 rulesClassSaveProf:351 rulesSaveBonus:356 rulesDivineSmiteFormula:365 rulesSkillBonus:372 rulesPassivePerception:387 rulesSpellStats:391 _spellStatMod:416 rulesSpellStatsByClass:424 rulesWeaponMods:442 rulesOffhandDamageMod:458 armorPenalties:467 rulesItemArmor:480 rulesArmorItem:492 rulesAC:503 charCasterLevel:685 classSpellSlotRow:726 getMulticlassSpellSlots:739 rulesRestoreLevelFields:775 rulesApplySpellSlots:794 resolvePactSlots:817 restoreItemCharges:827 rulesHitDieSides:844 rulesShortRest:850 rulesLongRestBlockReason:885 rulesLongRest:898 rulesExhaustionLevel:964 rulesEffectiveHpMax:970 _dsReset:975 _dsCount:976 _dsFill:977 _condAdd:978 _condRemove:979 rulesIsDead:981 rulesIsStable:985 rulesRegainFromZero:990 rulesSetHp:996 rulesDamageAfterDefenses:1008 rulesApplyDamage:1020 rulesDeathSaveBlockReason:1057 rulesDeathSave:1064 rulesConditionRollMods:1083 rulesEffectiveSpeed:1100 rulesArmorStealthDisadv:1121 rulesFeatPrereqMissing:1130 rulesFeatStatChoice:1157 rulesFeatStatOptions:1165 rulesFeatSlotCount:1178 rulesFeatSpellFits:1183 rulesFeatSpellCandidates:1194 rulesFeatSpellLabel:1198 rulesFeatSpellProgress:1203 rulesFeatClassOptions:1228 rulesFeatFreeResId:1241 rulesResetFeatFree:1244 concSaveParams:1255 rulesCrToXp:1297 rulesCrToProf:1303 rulesCrValue:1310 rulesWildShapeLimits:1321 rulesPolymorphLimits:1345 rulesCombatWildShapeHeal:1350 rulesBeastAllowed:1355 rulesFormStart:1362 rulesFormOwnHp:1376 rulesFormDamage:1381 rulesFormHeal:1396 rulesEncounterMultiplier:1403 rulesEncounterDifficulty:1412 getCharClassPairs:1436 charEditionMismatch:1450 findLangInCatalog:1458 ensureLanguagesArray:1470 recalcLanguagesFromSources:1486 add:1491 findToolInCatalog:1536 ensureToolsArray:1548 getBackgroundDef:1569 validateBgStatChoice:1605 parseBackgroundToolEntry:1625 recalcToolsFromSources:1640 add:1645 ensureArmorWeaponFields:1710 recalcArmorWeaponFromSources:1723 addArmor:1729 addWeapon:1730 addSpec:1779

**app-core.js** (1875 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:577 _screenGhostDrop:583 _screenGhostStart:595 _screenEnter:613 _purgeDraftChars:624 showScreen:637 updateHeaderTitle:752 syncDrawerHeader:806 switchTab:818 _rdSheetView:857 openDrawer:876 closeDrawer:889 showCharacterNav:901 hideCharacterNav:909 isInteractive:929 currentActiveTab:952 scrolledDown:1017 closeAction:1024 reset:1031 end:1064 createNewCharacter:1084 getClassColor:1107 getClassIcon:1122 getAbilityIcon:1129 getConditionIcon:1144 getConditionChipIcon:1168 getSpellClassIcon:1186 getSchoolSlug:1203 getSchoolIcon:1207 stripLeadingEmoji:1220 formatTimeAgo:1224 setCharSort:1238 setCharSearch:1245 duplicateCharacter:1249 exportOneCharacter:1261 updateCharCounter:1268 onDragStart:1285 onDragOver:1286 onDrop:1287 renderCharacterList:1298 renderCharPlate:1385 deleteCharacter:1448 showConfirmModal:1462 safeSet:1509 safeSetChecked:1513 loadCharacter:1522 showToast:1715 showFieldError:1732 clearFieldError:1754 toastAddAction:1764 emptyStateHtml:1782 openHPHistory:1793 closeHPHistory:1821 updateVersionBlock:1826 forceAppUpdate:1857

**app-migrate.js** (1047 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1039

**app-builds.js** (1760 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1126 openBuildGuide:1157 gx:1180 _list:1181 getBuildLevelRec:1244 getBuildRecChoiceOption:1249 getBuildRecChoiceIds:1257 getBuildRecFeat:1262 getBuildRecAsi:1272 getBuildRecSubclass:1279 parseAsiFromHeadline:1287 _buildFeatNameMap:1301 parseFeatFromHeadline:1343 parseSpellsFromHeadline:1360 getBuildRecSpellObjs:1606 openBuildPlan:1626 _cpSubclassOf:1679 _cpClassSwitch:1690 openClassPlan:1705

**app-io.js** (719 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:103 _normalizeImportedSpell:112 _isValidImportedSpell:123 _collectCharUserSpells:127 _ingestImportedUserSpells:145 _spellBaseById:191 _unpackSpell:199 _countUnresolvedSpells:221 _unresolvedNote:229 _importTooNew:234 _packSpell:243 _packCharForExport:254 _unpackCharSpells:261 _buildCharEnvelope:267 _charExportFileName:282 _downloadText:285 _shareableFile:296 shareOneCharacter:307 copyCharToClipboard:324 pasteCharFromClipboard:337 _extractCharsFromImport:355 _applyFullRestore:367 _warnEditionMix:411 run:412 importData:427 importOneCharacter:486 _importOneCharText:503 _consumeLaunchFiles:584 _importLaunchText:617 exportSpells:624 importSpells:633 exportSessionLog:706

**app-combat.js** (3414 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:786 featHpPerLevel:801 featHpFlat:810 recalculateHP:819 updateChar:874 toggleProficiency:941 calcStats:964 setSpellStat:1035 calcSpellStats:1046 _toggleNonCasterCards:1098 showSpellCasterCards:1109 onRaceChange:1117 renderBooksRow:1252 openMobSheet:1279 closeMobSheet:1286 mobSheetActs:1288 openBooksSheet:1293 toggleCharBook:1303 populateRaceSelect:1320 _speciesEffective:1353 _renderSpeciesBar:1366 _speciesChoiceOptions:1381 toggleSpeciesChoice:1388 syncSpeciesSpells:1402 rollRandomName:1448 pick:1456 build:1457 _raceSkillAllowance:1524 _raceFlexCount:1534 _raceFlexFits:1540 _raceFlexApply:1547 _setExtrasHtml:1557 renderRaceExtras:1566 toggleHalfElfStat:1737 toggleRaceFlexStat:1763 setRaceVariableTrait:1793 _raceSkillSet:1810 _pickHide:1820 _pickExpandBtn:1824 pickExpand:1827 raceLangGoto:1834 toggleRaceSkill:1842 _classSkillList:1871 _skillsFromOtherSources:1884 _skillsByName:1893 _skillTakenElsewhere:1899 _classSkillHeld:1913 _classSkillSync:1919 renderClassSkills:1950 toggleClassSkill:1997 openRaceFeatModal:2025 removeRaceFeat:2045 applyBasicLockUI:2080 _cwEditionBusy:2114 syncCwEdition:2119 setDraftEdition:2131 updateLockButtonState:2141 lockBasicInfo:2179 unlockBasicInfo:2200 isSheetLocked:2230 sheetLockGuard:2236 applySheetLockUI:2242 _creationTodo:2273 add:2277 src:2278 scheduleCreationTodo:2350 renderCreationTodo:2355 creationTodoGo:2382 openLockSheet:2394 _creationUiReset:2407 _isMobSheet:2408 renderIdentitySummary:2409 toggleIdentityMore:2428 renderProfSummary:2432 toggleProfCard:2447 openAcSheet:2453 _mobMarkClamp:2461 init:2470 lockSheet:2491 doLock:2495 unlockSheet:2508 onBackgroundChange:2529 _bgSkillsOf:2574 _bgUncheckOld:2581 _bgCheckSkills:2589 renderBackgroundFeature:2601 _bgStatShort:2646 populateBackgroundSelect:2649 _bgRevertStatChoice:2680 _bgAppliedStat:2693 _bgApplyStat:2698 setBgStatMode:2710 toggleBgStat:2722 _bgAfterStats:2745 _bgRevertFeatEffects:2756 syncOriginFeat:2781 toggleBgCustom:2817 _toggleBgCustom14:2857 toggleBgSkillPick:2904 _renderBgCustom14:2931 giveBackgroundEquipment:2968 renderBackgroundExtras:3013 _armorFromSelect:3121 renderArmorSelect:3133 onArmorPick:3168 onShieldPick:3182 onArmorChange:3201 onManualAC:3230 onManualMaxHP:3237 calcCoinWeight:3260 getActiveConditionsForRender:3274 toggleConditionsPopup:3303 closeConditionsPopup:3315 renderConditionsPopup:3321

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1979 строк, 67 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:33 showLongRestInfo:34 selectRestType:36 _restResNames:53 _renderRestPreview:64 _restHasSlots:100 showRestResult:106 adjustHitDice:116 _restHitDiceChosen:128 adjustHitDiceSize:135 updateHitDiceInfo:142 confirmRest:175 openLevelUpModal:269 _showMulticlassScreen:299 luPickAnotherClass:344 openMulticlassNewClass:351 confirmMulticlassNewClass:410 _showLevelUpPreview:421 closeLevelUpModal:599 confirmLevelUp:612 _luShowResult:739 luFinishChoices:771 luRefreshChoices:778 luSetSubclass:785 luApplyFeatById:805 luApplyAsi:851 _luFeatChoiceAt:872 _luChoiceOpensAt:881 _luSub:887 _ccDefsFor:891 _luAsiDone:902 luApplyAllRecommendations:907 _luSpellGainParts:1029 pluralRu:1034 delta:1038 luBuildChoicesScreen:1056 recBadge:1064 luAddRecommendedSpells:1202 luGoToSpellsTab:1230 openLevelDownConfirm:1242 confirmLevelDown:1287 loadDeathSaves:1320 toggleDeathSave:1364 resetDeathSaves:1381 updateHPDisplay:1394 hpToggleRow:1486 hpSetRowOpen:1495 updateHPSummary:1503 updateHPRows:1567 quickHP:1585 setHPAbsolute:1711 addHPHistory:1736 _hpUndoPrepare:1753 _hpUndoConcSnap:1773 _hpUndoConcRestore:1790 undoHPChange:1813 showHPToast:1843 applyCustomHP:1861 saveTempHP:1878 rollHitDieQuick:1892 renderHitDiceIcons:1924 rollDeathSave:1938 _luSlotPart:1969 _luPactPart:1972

**app-inventory.js** (2398 строк, 132 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:151 toggleInvItem:279 editItemDirect:284 deleteItemDirect:285 updateInventoryWeight:305 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:377 adjustItemCharges:388 openItemModal:404 closeItemModal:478 syncItemArmorFields:483 syncWornArmor:495 submitItem:524 openMagicCatalog:596 closeMagicCatalog:613 renderMagicCatalog:618 fillFromMagicItem:650 openGearCatalog:703 closeGearCatalog:719 renderGearPacks:724 renderGearCatalog:734 fillFromGearItem:762 addPackToInventory:785 rollTrinket:807 _weaponPresets2024:843 _weaponMasteryGrant:864 getWeaponMasteryLimit:889 weaponMasteryPending:893 canMasterWeapon:898 getWeaponMasteryProp:907 isWeaponMastered:914 toggleWeaponMastery:917 _weaponCatalog:936 renderWeaponPresets:950 filterWeaponPresets:1016 toggleWeaponFilter:1020 fillWeaponPreset:1027 _resetWeaponForm:1045 openWeaponModal:1066 closeWeaponModal:1076 editWeapon:1084 deleteCustomWeapon:1114 _weaponPresetByName:1140 checkWeaponProficiency:1147 submitWeapon:1175 weaponRowTap:1266 renderWeapons:1280 isLightWeapon:1379 toggleTWFStyle:1384 rollTWFAttack:1392 _weaponDamageRoll:1440 rollTWFDamage:1461 _unarmedStrike:1476 _weaponAt:1480 rollWeaponAttack:1484 _attackBonusTail:1545 rollWeaponDamage:1549 _canDivineSmite:1582 openDivineSmite:1586 _divineSmite:1610 removeWeapon:1642 _invDndInit:1676 _invClearIndicators:1705 _invSetIndicator:1714 _invCleanup:1719 _invCancelDrag:1726 _invMoveItem:1734 _invCommitDrop:1751 invDragStart:1772 invDragOver:1782 invDragLeave:1799 invDrop:1803 invDragEnd:1809 invTouchStart:1816 invTouchMove:1832 invTouchEnd:1864 quickSlotsClean:1886 quickSlotIconValid:1903 quickSlotAutoIcon:1909 _qsList:1928 _qsFindItem:1932 _qsFindSpell:1942 _qsResolve:1947 _qsItemQid:1950 _qsQty:1954 _qsConsumable:1958 quickSlotIndex:1964 quickSlotAdd:1970 quickSlotRemove:1980 quickSlotPrune:1987 _qsBusy:1994 quickSlotConsume:2000 _qsHealFormula:2011 quickSlotUse:2017 quickSlotToggle:2043 _qsBtnHtml:2077 quickSlotIconPickFor:2084 quickSlotIconPick:2091 quickSlotIconClose:2128 quickSlotIconSet:2133 quickSlotIconUpload:2146 quickSlotIconEncode:2162 quickDockEdit:2181 quickDockCancel:2182 quickDockHint:2183 quickDockRemoveAt:2187 quickDockReplaceAt:2195 _qsRefreshCards:2206 renderQuickDock:2211 _rdNorm:2264 _rdMatch:2265 _rdFindRows:2270 byPrefix:2275 rdFindRender:2319 rdFindFocus:2331 rdFindBlur:2341 rdFindKey:2347 _rdReveal:2355 rdFindPick:2360 rdExchPreview:2376 rdExchange:2391

**app-spells.js** (2232 строк, 110 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:165 adjustPactSlots:176 syncSpellSlotsFromClass:188 updateSpellSlots:197 toggleSpellSlot:208 adjustSpellSlots:219 restoreAllSlots:230 setSpellVersion:241 _syncSpellVersionLock:252 setSpellClass:261 _charIsThirdCaster:270 _charSpellClassKey:276 _charMaxCastableLevel:288 _defaultSpellVersion:296 toggleSpellOnlyAdded:302 _renderSpellOnlyAdded:306 openSpellSearch:314 markCharOwnClassFilter:333 closeSpellSearch:362 _featPickCtx:373 featAddFixedSpells:388 openFeatSpellPicker:414 _featPickProgressText:431 _renderFeatPickBar:437 featPickSetClass:458 _featPickCandidates:466 _renderFeatPickList:476 addFeatSpell:507 removeFeatSpell:527 _parseSpellClassList:550 _syncNewSpellClassChips:554 toggleNewSpellClass:561 _fillNewSpellDamageTypes:586 _toggleHidden:593 updateNewSpellMechFields:601 _hbFormulaCheck:616 _collectHbEffect:625 _spellIdArg:663 _findHomebrewSpell:669 openAddSpellForm:677 _syncCustomSpellAcrossChars:756 _purgeCustomSpellFromChars:774 deleteCustomSpell:793 _deleteCustomSpellConfirmed:802 closeAddSpellForm:816 submitNewSpell:820 renderSpellSearch:910 spellCompRu:984 addSpell:989 removeSpell:1013 toggleSpellCard:1027 renderMySpells:1032 _spellActiveBadgeText:1177 _spellActiveBadgeHtml:1181 updateSpellActiveBadges:1184 _prepEntries:1207 _spellPrepEntry:1225 _prepLimit:1230 calcMaxPrepared:1246 _known2014:1253 calcMaxKnownSpells:1268 _knownSpellCount:1274 calcMaxCantrips:1284 isPrepClass:1293 _subclassSpellNames:1299 syncSubclassSpells:1326 spellNeedsPrep:1353 _preparedCount:1369 openSpellCardsMenu:1377 isSpellPrepared:1392 toggleSpellPrepared:1402 renderPrepCounter:1428 _castableSlotOptions:1481 _arcanumResId:1502 castSpell:1512 _castSpellWithSlot:1533 _finishCast:1571 applyCastEffects:1617 _applyCastForm:1654 openCastVariantChooser:1667 pickCastVariant:1706 closeCastVariantChooser:1716 _applyCastSummon:1729 _nextCastInstanceId:1763 _replaceCastInstance:1771 _ensureCastInstance:1801 _applyCastDamage:1821 _rollCastDamage:1848 _startCastRepeat:1918 castRepeatDamage:1932 _applyCastDebuff:1957 castSpellAttackMod:1998 castStatMod:2006 _agonizingBonus:2028 _applyCastHeal:2047 _castHealApply:2068 _applyCastTempHp:2074 applyCastTempHp:2091 _applyCastHpMaxBonus:2105 openCastChooser:2125 closeCastChooser:2146 canCastAsRitual:2159 castRitual:2181 cancelRitual:2220

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1530 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:455 notesPickRandomVariant:460 _applyVariantToSection:473 _setSectionText:487 _mdToHtml:502 closeLists:514 _countStats:554 _bindSectionInputs:561 _updateStats:574 _notesHotkeys:583 notesMdInsert:598 wrap:607 linePrefix:614 notesTogglePreview:664 notesUpdateSection:683 _syncTakenFeatsLocation:698 _renderEntriesView:711 _renderEntryCard:766 notesPinDragStart:813 notesPinDragOver:823 notesPinDragLeave:832 notesPinDrop:837 notesPinDragEnd:847 _notesReorderPinned:856 notesSetTagFilter:884 notesJumpToNpc:890 notesOpenEntryModal:918 notesCloseEntryModal:953 _notesRenderModalTags:958 notesAddModalTag:970 notesModalTagKeydown:980 notesRemoveModalTag:984 notesSaveEntryModal:990 notesDeleteEntry:1038 notesTogglePin:1059 _notesLogJournal:1094 notesSearchInput:1120 notesSearchKeydown:1127 _hlText:1145 _renderSearchResults:1155 notesClearSearch:1234 notesToggleMenu:1245 _notesMenuClose:1258 notesMenuAction:1264 _notesCharName:1279 _notesTriggerDownload:1284 notesExportMd:1292 notesExportJson:1337 _notesSanitizeEntry:1349 _notesFileTooBig:1360 notesHandleImportJson:1368 _notesApplyImport:1389 notesHandleImportMd:1429 notesPrint:1465 _notesFlashSaved:1496

**app-ui.js** (1309 строк, 75 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:180 animateCountUp:186 tick:194 _reportError:217 swTelegramBlock:285 swSupportBlock:296 showUpdateModal:308 later:334 onKey:341 checkWhatsNew:351 showWhatsNewModal:363 toggleAccordion:400 initCharResources:420 getResourceMax:429 getCharResourceDefs:449 currentDieSize:479 crRow:491 crRestoreLabel:504 crResourceRow:519 crSlotRecoveryBudget:579 crSlotRecoveryActs:583 recoverSlotByResource:598 crPassiveNotes:623 rollSneakAttack:632 rollResourceDie:656 crManeuverRows:675 crRowsHtml:692 crSetRows:729 renderClassResources:744 spendResource:762 resetResource:780 toggleResourcePip:790 resourceRollOnSpend:815 resetResourcesByRest:828 getJournal:874 addJournalEntry:879 filterJournal:901 renderJournal:908 deleteJournalEntry:944 openAddJournalEntry:953 closeAddJournalEntry:958 saveJournalEntry:961 getCompanions:981 renderCompanions:986 companionHP:1031 buildFamiliarFormOptions:1044 onCompanionTypeChange:1056 applyFamiliarForm:1064 openAddCompanionModal:1076 summonFamiliar:1093 openPrefilledCompanionModal:1103 openEditCompanionModal:1114 closeAddCompanionModal:1134 saveCompanion:1137 deleteCompanion:1162 switchProfilesTab:1178 clipChangelogText:1193 expandChangelogItem:1204 clCleanText:1216 renderChangelog:1222 openItemRef:1267 closeItemRef:1272 switchItemRef:1277 _syncHeaderHeight:1295

**app-dice.js** (1713 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1359 _diceShapeSvg:1393 renderDiceFan:1400 _paintSelectedDie:1419 _diceHeroSvg:1443 _paintDiceMode:1453 selectDie:1468 rollSelectedDie:1487 toggleDiceFormulaPanel:1496 _savedRollFormula:1515 _savedRollsClean:1518 _savedRollNewId:1533 _savedRollLabel:1536 renderSavedRolls:1540 savedRollRoll:1560 savedRollTap:1567 savedRollEdit:1583 savedRollCancel:1600 savedRollSubmit:1605 savedRollDelete:1626 savedRollFromDice:1644 _diceHotkeys:1665

**app-settings.js** (897 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:112 _accentForClass:124 _applyClassAccent:127 _refreshAccent:130 setAutoAccent:138 _syncAutoAccentToggle:143 getEdition:159 setEdition:167 _syncEditionButtons:176 _getStatsLayout:193 _applyStatsLayout:200 _statsInCards:207 _statsRowTarget:211 _placeStatRows:229 setStatsLayout:245 _syncStatsLayoutButtons:252 _getSheetLock:266 setSheetLock:270 _syncSheetLockButtons:275 _wakeLockSupported:286 _getWakeLockOn:287 _applyWakeLock:291 setWakeLock:306 _syncWakeLockButtons:311 _getHeaderAutohideOn:321 setHeaderAutohide:324 _syncHeaderAutohideButtons:329 _getTrackXpOn:337 _applyTrackXp:340 setTrackXp:343 _syncTrackXpButtons:348 _getAttackDamageOn:369 setAttackDamage:372 _syncAttackDamageButtons:376 isEditionSplit:385 setEditionSplit:388 _syncEditionSplitButtons:393 openBooksScreen:403 _bookRowHtml:407 _renderBooksScreen:417 setBookOn:442 setBooksPreset:448 _afterBooksChange:455 _syncBooksSummary:467 _getStatsCollapsed:481 _applyStatsCollapsed:484 toggleStatsCollapsed:489 _getStoredDensity:503 _getDefaultDensity:511 _getDensity:518 _applyDensity:521 setDensity:525 _syncDensityButtons:531 _onViewportDensityChange:539 _getFontScale:557 _applyFontScale:564 setFontScale:575 _syncFontScaleUi:586 _getGlassAlpha:601 _getGlassBlur:608 _applyGlassAlpha:615 _applyGlassBlur:616 setGlassAlpha:617 setGlassBlur:627 _syncGlassUi:636 _getSpaceMode:685 _applySpaceBg:692 setSpaceMode:707 _syncSpaceButtons:713 _spaceOnScroll:732 _applyDymkaIcons:760 _initAppLinks:773 openSupportLink:805 _isStandalone:817 _isIos:823 _installMode:827 _syncInstallUi:832 installApp:845 openSettingsModal:869 closeSettingsModal:884

**app-asi.js** (900 строк, 43 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:574 removeFeat:631 featSkillPick:660 _agBonus:695 _agPbSpent:705 _agBase:711 _agReady:718 openAbilGen:723 _agInit:733 agSetMode:746 agPb:752 _agSwap:762 agStd:769 agPick:775 agRoll:781 _agCtl:794 owner:805 _agRender:820 agApply:873 _agCommit:881

**app-progress.js** (897 строк, 50 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:309 _pgNext:325 _pgClassWord:379 _pgAvailableClasses:388 _pgActions:401 _pgBuild:419 openProgressTab:432 openProgress:442 pgTabActive:453 pgRefresh:460 pgSetSubclass:468 pgFocusSubclass:483 pgLevelUp:500 pgLevelDown:505 pgAfterLevelModal:511 pgAddClass:522 renderClassDev:536 _pgSheetAboutRow:555 _pgSubclassRows:573 syncClassFieldUI:599 openFeatureInfo:642 _fiRuleNotes:685 _mlTotal:724 _mlMissing:729 openMcLayout:735 mlSetClass:747 mlLevel:755 mlSetSub:764 mlAdd:769 mlRemove:775 _mlRender:781 _mlPruneAsi:846 mlApply:857

**app-desktop.js** (528 строк, 15 функций)  
syncFromStatusBar:144 syncStrip:203 setRailOpen:214 syncRdToggles:221 _esc:241 _stripEmoji:247 _condIcon:251 setRowExpanded:257 collapseRow:263 renderRrConditions:265 renderRailSlots:311 renderRailConc:353 updateRailHpRow:368 rrApplyHP:383 init:396

**app-help.js** (1325 строк, 58 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:94 setHelpFlag:98 welcomeGoStep:104 showWelcome:114 closeWelcome:121 welcomeContinue:127 welcomeSkipExperienced:133 welcomeBack:139 welcomeFinish:146 dismissWelcome:179 maybeShowWelcome:182 restartOnboarding:187 _tourWide:223 _ensureTourDom:226 _resolveTarget:267 _tourFirstVisible:282 _tourAnyModalVisible:302 _tourModalOpen:308 _tourStartWhenClear:320 startTour:332 startListTour:345 startSheetTour:349 _tourTyping:361 maybeStartSheetTour:366 startCreatorTour:389 maybeStartCreatorTour:394 _buildCreatorSteps:406 restartTour:417 startTabTour:444 maybeStartTabTour:462 tourNext:489 tourPrev:494 endTour:500 _showTourStep:510 _setBox:573 _computeTourBoxes:589 snap:591 corner:604 _layoutTourCorners:626 _layoutTour:643 _onTourKey:746 _onTourReflow:752 _bindTourGlobal:756 _unbindTourGlobal:761 _buildListSteps:772 _buildSheetSteps:822 _buildStatsSteps:932 _buildProgressSteps:973 _buildSpellsSteps:1031 _buildInventorySteps:1074 _buildBattleSteps:1120 _buildNotesSteps:1195 _buildPartySteps:1236 _buildJournalSteps:1294

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (8367 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:128 SAVES_DATA:150 CONDITIONS:159 EFFECTS_DATA:182 CLASS_FEATURES:233 SPELL_PREP_CLASSES:483 CANTRIPS_KNOWN_2014:491 SPELLS_KNOWN_2014:501 SPELL_SLOTS_BY_LEVEL:510 CLASS_HIT_DICE:585 SUBCLASSES:591 SOURCE_LABELS:611 SUBCLASS_SOURCE:638 BOOK_CODES:707 _booksOffCache:710 SUBCLASS_LEVEL:751 SUBCLASS_FEATURES:767 WEAPON_PRESETS:1559 ITEM_ICONS:1603 CATEGORY_NAMES:1604 GEAR_PACKS:1613 RACE_DATA:1708 BACKGROUND_SKILLS:2325 BACKGROUND_ALIASES:2404 DEITY_ALIGN_LABELS:2417 DEITIES_DATA:2422 LANGUAGE_CATALOG:2490 RACE_LANGUAGES:2527 CLASS_LANGUAGES:2629 TOOL_CATALOG:2635 RACE_TOOLS:2690 CLASS_TOOLS:2702 SUBCLASS_LANGUAGES:2710 SUBCLASS_TOOLS:2733 RACE_ARMOR:2755 RACE_WEAPONS_SPECIFIC:2761 CLASS_WEAPONS_SPECIFIC:2777 RACE_NAME_POOLS:2790 RACE_NAME_GROUP:2832 SUBCLASS_ARMOR:2847 ARMOR_PRESETS:2878 skills:2895 ABILITY_INFO:2908 CLASS_SKILL_OPTIONS:2948 CLASS_SKILL_COUNT:2963 CLASS_SKILL_MC_COUNT:2964 CLASS_ARMOR_PROFS:2967 CLASS_RESOURCES:2987 ASI_LEVELS:3157 XP_THRESHOLDS:3165 APP_VERSION:3175 APP_VERSION_DATE:3176 APP_TELEGRAM_URL:3182 APP_BOOSTY_URL:3183 FEATS_DATA:3204 APP_CHANGELOG:3527 CASTER_TYPE:8195 THIRD_CASTER_SUBCLASSES:8204 THIRD_CASTER_SLOTS:8211 MULTICLASS_SPELL_SLOTS:8222 MULTICLASS_PREREQUISITES:8247 MULTICLASS_PROFICIENCIES:8265 EDITION_DATA:8294

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (752 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

