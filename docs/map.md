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
#cw-edition-row:656-665 #cw-validation:666-668 #basic-locked-bar:669-678 #creation-todo:679-688 #sheet-avatar:689-701 #char-build-badge-wrap:702-716 #char-class-mc:717-741 #char-subclass-rec:742-742  
#char-subclass-mc:743-951 #char-books:952-956 #race-bonus-display:957-957 #race-extras-panel:958-958 #class-skills-panel:959-960 #background-feature-display:961-962 #bg-extras-panel:963-1006 #abilgen-row:1007-1013  
#stats-collapse-btn:1014-1021 #abilities-region:1022-1025 #proficiency-bonus-2024:1026-1027 #insp-card-2024:1028-1037 #abil-col-1:1038-1038 #stat-block-str:1039-1040 #mod-str:1041-1047 #abil-save-slot-str:1048-1048  
#abil-skills-slot-str:1049-1051 #stat-block-dex:1052-1053 #mod-dex:1054-1060 #abil-save-slot-dex:1061-1061 #abil-skills-slot-dex:1062-1064 #stat-block-int:1065-1066 #mod-int:1067-1073 #abil-save-slot-int:1074-1074  
#abil-skills-slot-int:1075-1078 #abil-col-2:1079-1079 #stat-block-con:1080-1081 #mod-con:1082-1088 #abil-save-slot-con:1089-1089 #abil-skills-slot-con:1090-1092 #stat-block-wis:1093-1094 #mod-wis:1095-1101  
#abil-save-slot-wis:1102-1102 #abil-skills-slot-wis:1103-1105 #stat-block-cha:1106-1107 #mod-cha:1108-1114 #abil-save-slot-cha:1115-1115 #abil-skills-slot-cha:1116-1129 #saves-grid:1130-1139 #skills-container:1140-1142  
#passive-perception:1143-1162 #ws-hp-banner:1163-1168 #hp-dmg-row:1169-1178 #hp-dmg-body:1179-1199 #death-saves-section:1200-1231 #hp-armor-body:1232-1273 #hp-hd-body:1274-1287 #hp-rest-body:1288-1315  
#class-dev-section:1316-1318 #cd-head:1319-1319 #cd-res:1320-1320 #cd-attn:1321-1322 #cd-about:1323-1331 #ac-formula:1332-1333 #ac-modifiers:1334-1341 #conditions-grid:1342-1349  
#effects-grid:1350-1357 #resistances-container:1358-1366 #prof-card:1367-1370 #armor-prof-container:1371-1374 #weapon-prof-container:1375-1378 #tools-container:1379-1382 #languages-container:1383-1390 #companions-list-sheet:1391-1403  
#tab-progress:1404-1405 #pg-body:1406-1407 #tab-spells:1408-1410 #spell-stat-card:1411-1432 #spell-mod-display:1433-1438 #spell-dc-display:1439-1444 #spell-attack-display:1445-1450 #spell-stats-by-class:1451-1462  
#spell-slots-card:1463-1467 #spell-slots-visual:1468-1474 #concentration-block:1475-1492 #rd-find-spl-wrap:1493-1493 #prep-counter:1494-1494 #my-spells-list:1495-1496 #rd-slot-strip:1497-1498 #tab-inventory:1499-1502  
#rd-find-inv-wrap:1503-1519 #weight-fill:1520-1554 #inventory-list:1555-1559 #inv-coins-card:1560-1564 #rd-exch:1565-1575 #inv-pouches:1576-1631 #tab-notes:1632-1658 #notes-subtabs:1659-1660  
#notes-main:1661-1662 #taken-feats-section:1663-1667 #taken-feats-list:1668-1671 #tab-party:1672-1681 #my-char-card:1682-1695 #allies-list:1696-1710 #npcs-list:1711-1726 #monsters-list:1727-1738  
#companions-list-world:1739-1749 #tab-battle:1750-1755 #weapons-list:1756-1758 #ws-card:1759-1761 #saved-roll-form:1762-1768 #saved-roll-err:1769-1770 #saved-rolls-list:1771-1774 #battle-res-card:1775-1776  
#battle-res-rows:1777-1778 #battle-setup-screen:1779-1789 #battle-setup-list:1790-1790 #battle-difficulty:1791-1794 #battle-tracker-screen:1795-1799 #battle-turn-info:1800-1805 #battle-repeat-strip:1806-1806 #battle-tracker-list:1807-1816  
#tab-journal:1817-1831 #journal-list:1832-1838 #screen-itemref:1839-1841 #item-ref-tabs:1842-1847 #item-ref-weight:1848-1886 #item-ref-slots:1887-1918 #screen-dmref:1919-1921 #dm-ref-tabs:1922-1926  
#dm-ref-ed:1927-1927 #dm-ref-cond:1928-1928 #dm-ref-combat:1929-1929 #dm-ref-world:1930-1934 #screen-help:1935-1957 #help-about:1958-1981 #help-start:1982-2006 #help-sheet:2007-2030  
#help-progress:2031-2076 #help-spells:2077-2093 #help-inventory:2094-2106 #help-battle:2107-2131 #help-party:2132-2148 #help-notes:2149-2157 #help-journal:2158-2166 #help-planes:2167-2194  
#help-dice:2195-2206 #help-edition2024:2207-2246 #help-data:2247-2263 #help-marks:2264-2286 #conc-details-modal:2287-2297 #conc-detail-duration-row:2298-2305 #conc-detail-desc-row:2306-2315 #add-journal-modal:2316-2339  
#add-npc-modal:2340-2369 #add-ally-modal:2370-2407 #screen-monsters:2408-2420 #srd-monster-count:2421-2421 #srd-monster-results:2422-2426 #srd-npc-modal:2427-2436 #srd-npc-count:2437-2437 #srd-npc-results:2438-2445  
#screen-monsterform:2446-2483 #monster-cr-note:2484-2486 #monster-stats:2487-2488 #monster-saves:2489-2490 #monster-attacks:2491-2514 #screen-rest:2515-2517 #rest-main-screen:2518-2519 #rest-card-short:2520-2522  
#hit-dice-section:2523-2524 #hit-dice-controls-total:2525-2529 #hit-dice-by-size:2530-2535 #rest-card-long:2536-2538 #rest-food-section:2539-2549 #rest-result-screen:2550-2552 #rest-result-details:2553-2561 #screen-levelup:2562-2566  
#lu-screen-multiclass:2567-2568 #lu-mc-current-classes:2569-2571 #lu-mc-new-class:2572-2576 #lu-mc-prereq-warn:2577-2577 #lu-mc-subclass-row:2578-2586 #lu-screen-preview:2587-2619 #lu-slots-card:2620-2621 #lu-slots-info:2622-2625  
#lu-build-hint:2626-2626 #lu-features-container:2627-2635 #lu-screen-choices:2636-2637 #lu-choices-body:2638-2644 #lu-screen-result:2645-2646 #lu-result-title:2647-2647 #lu-result-body:2648-2654 #screen-wildshape:2655-2660  
#ws-limits:2661-2661 #ws-results:2662-2665 #screen-hphistory:2666-2668 #hp-history-list:2669-2674 #asi-modal:2675-2679 #asi-build-hint:2680-2694 #asi-feat-list:2695-2695 #asi-stat-grid:2696-2696  
#asi-preview:2697-2705 #class-choice-modal:2706-2721 #dice-modal:2722-2754 #dice-file-hint:2755-2755 #dice3d-result:2756-2767 #dice-result-display:2768-2781 #dice-pick-hint:2782-2782 #dice-mode-segment:2783-2787  
#dice-formula-panel:2788-2805 #dice-fan:2806-2814 #dice-popover-settings:2815-2862 #dice-popover-history:2863-2874 #dice-history:2875-2883 #screen-spellsearch:2884-2886 #spell-feat-bar:2887-2902 #spell-ver-filter:2903-2909  
#spell-class-filter:2910-2942 #class-filter-legend:2943-2944 #spell-search-count:2945-2946 #spell-search-results:2947-2950 #cast-spell-modal:2951-2955 #cast-spell-options:2956-2958 #add-spell-modal:2959-3002 #new-spell-class-chips:3003-3049  
#new-spell-mech-fields:3050-3054 #new-spell-mech-dmg-row:3055-3074 #new-spell-mech-half-row:3075-3077 #new-spell-mech-mod-row:3078-3088 #item-modal:3089-3133 #item-armor-fields:3134-3159 #coin-exchange-modal:3160-3198 #exch-preview:3199-3205  
#screen-magiccatalog:3206-3233 #magic-catalog-count:3234-3234 #magic-catalog-list:3235-3238 #screen-gearcatalog:3239-3243 #gear-packs-list:3244-3257 #gear-catalog-count:3258-3258 #gear-catalog-list:3259-3263 #weapon-modal:3264-3267  
#weapon-picker-section:3268-3270 #weapon-filter-chips:3271-3280 #weapon-presets-list:3281-3281 #weapon-pick-bar:3282-3345 #rd-quick-dock:3346-3346 #character-tabs:3347-3365 #quick-roll-strip:3366-3371 #qrs-list:3372-3382  
#active-effects-panel:3383-3387 #aef-list:3388-3394 #hp-toast-container:3395-3397 #add-companion-modal:3398-3414 #companion-familiar-row:3415-3435 #mob-sheet:3436-3439 #mob-sheet-list:3440-3443 #confirm-modal:3444-3457  
#avatar-modal:3458-3461 #avatar-modal-preview:3462-3489 #screen-builds:3490-3517 #bp-list:3518-3522 #screen-buildguide:3523-3525 #bg-body:3526-3530 #screen-buildplan:3531-3533 #bp-plan-body:3534-3538  
#screen-abilityinfo:3539-3541 #ai-body:3542-3546 #screen-abilgen:3547-3549 #ag-body:3550-3554 #screen-books:3555-3557 #books-body:3558-3562 #screen-mclayout:3563-3565 #ml-body:3566-3570  
#screen-featureinfo:3571-3573 #fi-body:3574-3578 #screen-creator:3579-3581 #cr-progress:3582-3582 #cr-body:3583-3593 #app-log-panel:3594-3613 #app-log-list:3614-3795 #notes-entry-modal:3796-3844  

## Функции по файлам (`имя:строка`)

**rules.js** (1818 строк, 122 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:345 rulesClassSaveProf:351 rulesAttuneLimit:357 rulesSoulOfArtifice:363 rulesSaveBonus:368 rulesDivineSmiteFormula:377 rulesSkillBonus:384 rulesPassivePerception:399 rulesSpellStats:403 _spellStatMod:430 rulesSpellStatsByClass:438 rulesWeaponMods:456 rulesOffhandDamageMod:472 armorPenalties:481 rulesItemArmor:496 rulesArmorItem:508 rulesAC:519 charCasterLevel:701 classSpellSlotRow:745 getMulticlassSpellSlots:758 rulesRestoreLevelFields:794 rulesApplySpellSlots:813 resolvePactSlots:836 restoreItemCharges:846 rulesHitDieSides:863 rulesShortRest:869 rulesLongRestBlockReason:904 rulesLongRest:917 rulesExhaustionLevel:983 rulesEffectiveHpMax:989 _dsReset:994 _dsCount:995 _dsFill:996 _condAdd:997 _condRemove:998 rulesIsDead:1000 rulesIsStable:1004 rulesRegainFromZero:1009 rulesSetHp:1015 rulesDamageAfterDefenses:1027 rulesApplyDamage:1039 rulesDeathSaveBlockReason:1076 rulesDeathSave:1083 rulesConditionRollMods:1102 rulesEffectiveSpeed:1119 rulesArmorStealthDisadv:1140 rulesFeatPrereqMissing:1149 rulesFeatStatChoice:1176 rulesFeatStatOptions:1184 rulesFeatSlotCount:1197 rulesFeatSpellFits:1202 rulesFeatSpellCandidates:1213 rulesFeatSpellLabel:1217 rulesFeatSpellProgress:1222 rulesFeatClassOptions:1247 rulesFeatFreeResId:1260 rulesResetFeatFree:1263 concSaveParams:1274 rulesCrToXp:1316 rulesCrToProf:1322 rulesCrValue:1329 rulesWildShapeLimits:1340 rulesPolymorphLimits:1364 rulesCombatWildShapeHeal:1369 rulesBeastAllowed:1374 rulesFormStart:1381 rulesFormOwnHp:1395 rulesFormDamage:1400 rulesFormHeal:1415 rulesEncounterMultiplier:1422 rulesEncounterDifficulty:1431 getCharClassPairs:1455 charEditionMismatch:1469 findLangInCatalog:1477 ensureLanguagesArray:1489 recalcLanguagesFromSources:1505 add:1510 findToolInCatalog:1555 ensureToolsArray:1567 getBackgroundDef:1588 validateBgStatChoice:1624 parseBackgroundToolEntry:1644 recalcToolsFromSources:1659 add:1664 ensureArmorWeaponFields:1729 recalcArmorWeaponFromSources:1742 addArmor:1748 addWeapon:1749 addSpec:1798

**app-core.js** (1876 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:577 _screenGhostDrop:583 _screenGhostStart:595 _screenEnter:613 _purgeDraftChars:624 showScreen:637 updateHeaderTitle:752 syncDrawerHeader:806 switchTab:818 _rdSheetView:857 openDrawer:876 closeDrawer:889 showCharacterNav:901 hideCharacterNav:909 isInteractive:929 currentActiveTab:952 scrolledDown:1017 closeAction:1024 reset:1031 end:1064 createNewCharacter:1084 getClassColor:1107 getClassIcon:1123 getAbilityIcon:1130 getConditionIcon:1145 getConditionChipIcon:1169 getSpellClassIcon:1187 getSchoolSlug:1204 getSchoolIcon:1208 stripLeadingEmoji:1221 formatTimeAgo:1225 setCharSort:1239 setCharSearch:1246 duplicateCharacter:1250 exportOneCharacter:1262 updateCharCounter:1269 onDragStart:1286 onDragOver:1287 onDrop:1288 renderCharacterList:1299 renderCharPlate:1386 deleteCharacter:1449 showConfirmModal:1463 safeSet:1510 safeSetChecked:1514 loadCharacter:1523 showToast:1716 showFieldError:1733 clearFieldError:1755 toastAddAction:1765 emptyStateHtml:1783 openHPHistory:1794 closeHPHistory:1822 updateVersionBlock:1827 forceAppUpdate:1858

**app-migrate.js** (1047 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1039

**app-builds.js** (1760 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1126 openBuildGuide:1157 gx:1180 _list:1181 getBuildLevelRec:1244 getBuildRecChoiceOption:1249 getBuildRecChoiceIds:1257 getBuildRecFeat:1262 getBuildRecAsi:1272 getBuildRecSubclass:1279 parseAsiFromHeadline:1287 _buildFeatNameMap:1301 parseFeatFromHeadline:1343 parseSpellsFromHeadline:1360 getBuildRecSpellObjs:1606 openBuildPlan:1626 _cpSubclassOf:1679 _cpClassSwitch:1690 openClassPlan:1705

**app-io.js** (719 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:103 _normalizeImportedSpell:112 _isValidImportedSpell:123 _collectCharUserSpells:127 _ingestImportedUserSpells:145 _spellBaseById:191 _unpackSpell:199 _countUnresolvedSpells:221 _unresolvedNote:229 _importTooNew:234 _packSpell:243 _packCharForExport:254 _unpackCharSpells:261 _buildCharEnvelope:267 _charExportFileName:282 _downloadText:285 _shareableFile:296 shareOneCharacter:307 copyCharToClipboard:324 pasteCharFromClipboard:337 _extractCharsFromImport:355 _applyFullRestore:367 _warnEditionMix:411 run:412 importData:427 importOneCharacter:486 _importOneCharText:503 _consumeLaunchFiles:584 _importLaunchText:617 exportSpells:624 importSpells:633 exportSessionLog:706

**app-combat.js** (3421 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:793 featHpPerLevel:808 featHpFlat:817 recalculateHP:826 updateChar:881 toggleProficiency:948 calcStats:971 setSpellStat:1042 calcSpellStats:1053 _toggleNonCasterCards:1105 showSpellCasterCards:1116 onRaceChange:1124 renderBooksRow:1259 openMobSheet:1286 closeMobSheet:1293 mobSheetActs:1295 openBooksSheet:1300 toggleCharBook:1310 populateRaceSelect:1327 _speciesEffective:1360 _renderSpeciesBar:1373 _speciesChoiceOptions:1388 toggleSpeciesChoice:1395 syncSpeciesSpells:1409 rollRandomName:1455 pick:1463 build:1464 _raceSkillAllowance:1531 _raceFlexCount:1541 _raceFlexFits:1547 _raceFlexApply:1554 _setExtrasHtml:1564 renderRaceExtras:1573 toggleHalfElfStat:1744 toggleRaceFlexStat:1770 setRaceVariableTrait:1800 _raceSkillSet:1817 _pickHide:1827 _pickExpandBtn:1831 pickExpand:1834 raceLangGoto:1841 toggleRaceSkill:1849 _classSkillList:1878 _skillsFromOtherSources:1891 _skillsByName:1900 _skillTakenElsewhere:1906 _classSkillHeld:1920 _classSkillSync:1926 renderClassSkills:1957 toggleClassSkill:2004 openRaceFeatModal:2032 removeRaceFeat:2052 applyBasicLockUI:2087 _cwEditionBusy:2121 syncCwEdition:2126 setDraftEdition:2138 updateLockButtonState:2148 lockBasicInfo:2186 unlockBasicInfo:2207 isSheetLocked:2237 sheetLockGuard:2243 applySheetLockUI:2249 _creationTodo:2280 add:2284 src:2285 scheduleCreationTodo:2357 renderCreationTodo:2362 creationTodoGo:2389 openLockSheet:2401 _creationUiReset:2414 _isMobSheet:2415 renderIdentitySummary:2416 toggleIdentityMore:2435 renderProfSummary:2439 toggleProfCard:2454 openAcSheet:2460 _mobMarkClamp:2468 init:2477 lockSheet:2498 doLock:2502 unlockSheet:2515 onBackgroundChange:2536 _bgSkillsOf:2581 _bgUncheckOld:2588 _bgCheckSkills:2596 renderBackgroundFeature:2608 _bgStatShort:2653 populateBackgroundSelect:2656 _bgRevertStatChoice:2687 _bgAppliedStat:2700 _bgApplyStat:2705 setBgStatMode:2717 toggleBgStat:2729 _bgAfterStats:2752 _bgRevertFeatEffects:2763 syncOriginFeat:2788 toggleBgCustom:2824 _toggleBgCustom14:2864 toggleBgSkillPick:2911 _renderBgCustom14:2938 giveBackgroundEquipment:2975 renderBackgroundExtras:3020 _armorFromSelect:3128 renderArmorSelect:3140 onArmorPick:3175 onShieldPick:3189 onArmorChange:3208 onManualAC:3237 onManualMaxHP:3244 calcCoinWeight:3267 getActiveConditionsForRender:3281 toggleConditionsPopup:3310 closeConditionsPopup:3322 renderConditionsPopup:3328

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1979 строк, 67 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:33 showLongRestInfo:34 selectRestType:36 _restResNames:53 _renderRestPreview:64 _restHasSlots:100 showRestResult:106 adjustHitDice:116 _restHitDiceChosen:128 adjustHitDiceSize:135 updateHitDiceInfo:142 confirmRest:175 openLevelUpModal:269 _showMulticlassScreen:299 luPickAnotherClass:344 openMulticlassNewClass:351 confirmMulticlassNewClass:410 _showLevelUpPreview:421 closeLevelUpModal:599 confirmLevelUp:612 _luShowResult:739 luFinishChoices:771 luRefreshChoices:778 luSetSubclass:785 luApplyFeatById:805 luApplyAsi:851 _luFeatChoiceAt:872 _luChoiceOpensAt:881 _luSub:887 _ccDefsFor:891 _luAsiDone:902 luApplyAllRecommendations:907 _luSpellGainParts:1029 pluralRu:1034 delta:1038 luBuildChoicesScreen:1056 recBadge:1064 luAddRecommendedSpells:1202 luGoToSpellsTab:1230 openLevelDownConfirm:1242 confirmLevelDown:1287 loadDeathSaves:1320 toggleDeathSave:1364 resetDeathSaves:1381 updateHPDisplay:1394 hpToggleRow:1486 hpSetRowOpen:1495 updateHPSummary:1503 updateHPRows:1567 quickHP:1585 setHPAbsolute:1711 addHPHistory:1736 _hpUndoPrepare:1753 _hpUndoConcSnap:1773 _hpUndoConcRestore:1790 undoHPChange:1813 showHPToast:1843 applyCustomHP:1861 saveTempHP:1878 rollHitDieQuick:1892 renderHitDiceIcons:1924 rollDeathSave:1938 _luSlotPart:1969 _luPactPart:1972

**app-inventory.js** (2400 строк, 132 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:151 toggleInvItem:279 editItemDirect:284 deleteItemDirect:285 updateInventoryWeight:305 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:379 adjustItemCharges:390 openItemModal:406 closeItemModal:480 syncItemArmorFields:485 syncWornArmor:497 submitItem:526 openMagicCatalog:598 closeMagicCatalog:615 renderMagicCatalog:620 fillFromMagicItem:652 openGearCatalog:705 closeGearCatalog:721 renderGearPacks:726 renderGearCatalog:736 fillFromGearItem:764 addPackToInventory:787 rollTrinket:809 _weaponPresets2024:845 _weaponMasteryGrant:866 getWeaponMasteryLimit:891 weaponMasteryPending:895 canMasterWeapon:900 getWeaponMasteryProp:909 isWeaponMastered:916 toggleWeaponMastery:919 _weaponCatalog:938 renderWeaponPresets:952 filterWeaponPresets:1018 toggleWeaponFilter:1022 fillWeaponPreset:1029 _resetWeaponForm:1047 openWeaponModal:1068 closeWeaponModal:1078 editWeapon:1086 deleteCustomWeapon:1116 _weaponPresetByName:1142 checkWeaponProficiency:1149 submitWeapon:1177 weaponRowTap:1268 renderWeapons:1282 isLightWeapon:1381 toggleTWFStyle:1386 rollTWFAttack:1394 _weaponDamageRoll:1442 rollTWFDamage:1463 _unarmedStrike:1478 _weaponAt:1482 rollWeaponAttack:1486 _attackBonusTail:1547 rollWeaponDamage:1551 _canDivineSmite:1584 openDivineSmite:1588 _divineSmite:1612 removeWeapon:1644 _invDndInit:1678 _invClearIndicators:1707 _invSetIndicator:1716 _invCleanup:1721 _invCancelDrag:1728 _invMoveItem:1736 _invCommitDrop:1753 invDragStart:1774 invDragOver:1784 invDragLeave:1801 invDrop:1805 invDragEnd:1811 invTouchStart:1818 invTouchMove:1834 invTouchEnd:1866 quickSlotsClean:1888 quickSlotIconValid:1905 quickSlotAutoIcon:1911 _qsList:1930 _qsFindItem:1934 _qsFindSpell:1944 _qsResolve:1949 _qsItemQid:1952 _qsQty:1956 _qsConsumable:1960 quickSlotIndex:1966 quickSlotAdd:1972 quickSlotRemove:1982 quickSlotPrune:1989 _qsBusy:1996 quickSlotConsume:2002 _qsHealFormula:2013 quickSlotUse:2019 quickSlotToggle:2045 _qsBtnHtml:2079 quickSlotIconPickFor:2086 quickSlotIconPick:2093 quickSlotIconClose:2130 quickSlotIconSet:2135 quickSlotIconUpload:2148 quickSlotIconEncode:2164 quickDockEdit:2183 quickDockCancel:2184 quickDockHint:2185 quickDockRemoveAt:2189 quickDockReplaceAt:2197 _qsRefreshCards:2208 renderQuickDock:2213 _rdNorm:2266 _rdMatch:2267 _rdFindRows:2272 byPrefix:2277 rdFindRender:2321 rdFindFocus:2333 rdFindBlur:2343 rdFindKey:2349 _rdReveal:2357 rdFindPick:2362 rdExchPreview:2378 rdExchange:2393

**app-spells.js** (2234 строк, 110 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:165 adjustPactSlots:176 syncSpellSlotsFromClass:188 updateSpellSlots:197 toggleSpellSlot:208 adjustSpellSlots:219 restoreAllSlots:230 setSpellVersion:241 _syncSpellVersionLock:252 setSpellClass:261 _charIsThirdCaster:270 _charSpellClassKey:276 _charMaxCastableLevel:288 _defaultSpellVersion:296 toggleSpellOnlyAdded:302 _renderSpellOnlyAdded:306 openSpellSearch:314 markCharOwnClassFilter:335 closeSpellSearch:364 _featPickCtx:375 featAddFixedSpells:390 openFeatSpellPicker:416 _featPickProgressText:433 _renderFeatPickBar:439 featPickSetClass:460 _featPickCandidates:468 _renderFeatPickList:478 addFeatSpell:509 removeFeatSpell:529 _parseSpellClassList:552 _syncNewSpellClassChips:556 toggleNewSpellClass:563 _fillNewSpellDamageTypes:588 _toggleHidden:595 updateNewSpellMechFields:603 _hbFormulaCheck:618 _collectHbEffect:627 _spellIdArg:665 _findHomebrewSpell:671 openAddSpellForm:679 _syncCustomSpellAcrossChars:758 _purgeCustomSpellFromChars:776 deleteCustomSpell:795 _deleteCustomSpellConfirmed:804 closeAddSpellForm:818 submitNewSpell:822 renderSpellSearch:912 spellCompRu:986 addSpell:991 removeSpell:1015 toggleSpellCard:1029 renderMySpells:1034 _spellActiveBadgeText:1179 _spellActiveBadgeHtml:1183 updateSpellActiveBadges:1186 _prepEntries:1209 _spellPrepEntry:1227 _prepLimit:1232 calcMaxPrepared:1248 _known2014:1255 calcMaxKnownSpells:1270 _knownSpellCount:1276 calcMaxCantrips:1286 isPrepClass:1295 _subclassSpellNames:1301 syncSubclassSpells:1328 spellNeedsPrep:1355 _preparedCount:1371 openSpellCardsMenu:1379 isSpellPrepared:1394 toggleSpellPrepared:1404 renderPrepCounter:1430 _castableSlotOptions:1483 _arcanumResId:1504 castSpell:1514 _castSpellWithSlot:1535 _finishCast:1573 applyCastEffects:1619 _applyCastForm:1656 openCastVariantChooser:1669 pickCastVariant:1708 closeCastVariantChooser:1718 _applyCastSummon:1731 _nextCastInstanceId:1765 _replaceCastInstance:1773 _ensureCastInstance:1803 _applyCastDamage:1823 _rollCastDamage:1850 _startCastRepeat:1920 castRepeatDamage:1934 _applyCastDebuff:1959 castSpellAttackMod:2000 castStatMod:2008 _agonizingBonus:2030 _applyCastHeal:2049 _castHealApply:2070 _applyCastTempHp:2076 applyCastTempHp:2093 _applyCastHpMaxBonus:2107 openCastChooser:2127 closeCastChooser:2148 canCastAsRitual:2161 castRitual:2183 cancelRitual:2222

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1530 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:455 notesPickRandomVariant:460 _applyVariantToSection:473 _setSectionText:487 _mdToHtml:502 closeLists:514 _countStats:554 _bindSectionInputs:561 _updateStats:574 _notesHotkeys:583 notesMdInsert:598 wrap:607 linePrefix:614 notesTogglePreview:664 notesUpdateSection:683 _syncTakenFeatsLocation:698 _renderEntriesView:711 _renderEntryCard:766 notesPinDragStart:813 notesPinDragOver:823 notesPinDragLeave:832 notesPinDrop:837 notesPinDragEnd:847 _notesReorderPinned:856 notesSetTagFilter:884 notesJumpToNpc:890 notesOpenEntryModal:918 notesCloseEntryModal:953 _notesRenderModalTags:958 notesAddModalTag:970 notesModalTagKeydown:980 notesRemoveModalTag:984 notesSaveEntryModal:990 notesDeleteEntry:1038 notesTogglePin:1059 _notesLogJournal:1094 notesSearchInput:1120 notesSearchKeydown:1127 _hlText:1145 _renderSearchResults:1155 notesClearSearch:1234 notesToggleMenu:1245 _notesMenuClose:1258 notesMenuAction:1264 _notesCharName:1279 _notesTriggerDownload:1284 notesExportMd:1292 notesExportJson:1337 _notesSanitizeEntry:1349 _notesFileTooBig:1360 notesHandleImportJson:1368 _notesApplyImport:1389 notesHandleImportMd:1429 notesPrint:1465 _notesFlashSaved:1496

**app-ui.js** (1310 строк, 75 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:180 animateCountUp:186 tick:194 _reportError:217 swTelegramBlock:285 swSupportBlock:296 showUpdateModal:308 later:334 onKey:341 checkWhatsNew:351 showWhatsNewModal:363 toggleAccordion:400 initCharResources:420 getResourceMax:429 getCharResourceDefs:450 currentDieSize:480 crRow:492 crRestoreLabel:505 crResourceRow:520 crSlotRecoveryBudget:580 crSlotRecoveryActs:584 recoverSlotByResource:599 crPassiveNotes:624 rollSneakAttack:633 rollResourceDie:657 crManeuverRows:676 crRowsHtml:693 crSetRows:730 renderClassResources:745 spendResource:763 resetResource:781 toggleResourcePip:791 resourceRollOnSpend:816 resetResourcesByRest:829 getJournal:875 addJournalEntry:880 filterJournal:902 renderJournal:909 deleteJournalEntry:945 openAddJournalEntry:954 closeAddJournalEntry:959 saveJournalEntry:962 getCompanions:982 renderCompanions:987 companionHP:1032 buildFamiliarFormOptions:1045 onCompanionTypeChange:1057 applyFamiliarForm:1065 openAddCompanionModal:1077 summonFamiliar:1094 openPrefilledCompanionModal:1104 openEditCompanionModal:1115 closeAddCompanionModal:1135 saveCompanion:1138 deleteCompanion:1163 switchProfilesTab:1179 clipChangelogText:1194 expandChangelogItem:1205 clCleanText:1217 renderChangelog:1223 openItemRef:1268 closeItemRef:1273 switchItemRef:1278 _syncHeaderHeight:1296

**app-dice.js** (1713 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1359 _diceShapeSvg:1393 renderDiceFan:1400 _paintSelectedDie:1419 _diceHeroSvg:1443 _paintDiceMode:1453 selectDie:1468 rollSelectedDie:1487 toggleDiceFormulaPanel:1496 _savedRollFormula:1515 _savedRollsClean:1518 _savedRollNewId:1533 _savedRollLabel:1536 renderSavedRolls:1540 savedRollRoll:1560 savedRollTap:1567 savedRollEdit:1583 savedRollCancel:1600 savedRollSubmit:1605 savedRollDelete:1626 savedRollFromDice:1644 _diceHotkeys:1665

**app-settings.js** (898 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:113 _accentForClass:125 _applyClassAccent:128 _refreshAccent:131 setAutoAccent:139 _syncAutoAccentToggle:144 getEdition:160 setEdition:168 _syncEditionButtons:177 _getStatsLayout:194 _applyStatsLayout:201 _statsInCards:208 _statsRowTarget:212 _placeStatRows:230 setStatsLayout:246 _syncStatsLayoutButtons:253 _getSheetLock:267 setSheetLock:271 _syncSheetLockButtons:276 _wakeLockSupported:287 _getWakeLockOn:288 _applyWakeLock:292 setWakeLock:307 _syncWakeLockButtons:312 _getHeaderAutohideOn:322 setHeaderAutohide:325 _syncHeaderAutohideButtons:330 _getTrackXpOn:338 _applyTrackXp:341 setTrackXp:344 _syncTrackXpButtons:349 _getAttackDamageOn:370 setAttackDamage:373 _syncAttackDamageButtons:377 isEditionSplit:386 setEditionSplit:389 _syncEditionSplitButtons:394 openBooksScreen:404 _bookRowHtml:408 _renderBooksScreen:418 setBookOn:443 setBooksPreset:449 _afterBooksChange:456 _syncBooksSummary:468 _getStatsCollapsed:482 _applyStatsCollapsed:485 toggleStatsCollapsed:490 _getStoredDensity:504 _getDefaultDensity:512 _getDensity:519 _applyDensity:522 setDensity:526 _syncDensityButtons:532 _onViewportDensityChange:540 _getFontScale:558 _applyFontScale:565 setFontScale:576 _syncFontScaleUi:587 _getGlassAlpha:602 _getGlassBlur:609 _applyGlassAlpha:616 _applyGlassBlur:617 setGlassAlpha:618 setGlassBlur:628 _syncGlassUi:637 _getSpaceMode:686 _applySpaceBg:693 setSpaceMode:708 _syncSpaceButtons:714 _spaceOnScroll:733 _applyDymkaIcons:761 _initAppLinks:774 openSupportLink:806 _isStandalone:818 _isIos:824 _installMode:828 _syncInstallUi:833 installApp:846 openSettingsModal:870 closeSettingsModal:885

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

**data.js** (8476 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:128 SAVES_DATA:150 CONDITIONS:159 EFFECTS_DATA:182 CLASS_FEATURES:233 SPELL_PREP_CLASSES:504 CANTRIPS_KNOWN_2014:513 SPELLS_KNOWN_2014:524 SPELL_SLOTS_BY_LEVEL:533 CLASS_HIT_DICE:617 SUBCLASSES:624 SOURCE_LABELS:645 SUBCLASS_SOURCE:672 BOOK_CODES:743 _booksOffCache:746 CLASS_SOURCE:779 SUBCLASS_LEVEL:795 SUBCLASS_FEATURES:812 WEAPON_PRESETS:1629 ITEM_ICONS:1673 CATEGORY_NAMES:1674 GEAR_PACKS:1683 RACE_DATA:1778 BACKGROUND_SKILLS:2395 BACKGROUND_ALIASES:2474 DEITY_ALIGN_LABELS:2487 DEITIES_DATA:2492 LANGUAGE_CATALOG:2560 RACE_LANGUAGES:2597 CLASS_LANGUAGES:2699 TOOL_CATALOG:2705 RACE_TOOLS:2761 CLASS_TOOLS:2773 SUBCLASS_LANGUAGES:2782 SUBCLASS_TOOLS:2805 RACE_ARMOR:2833 RACE_WEAPONS_SPECIFIC:2839 CLASS_WEAPONS_SPECIFIC:2855 RACE_NAME_POOLS:2868 RACE_NAME_GROUP:2910 SUBCLASS_ARMOR:2925 ARMOR_PRESETS:2960 skills:2977 ABILITY_INFO:2990 CLASS_SKILL_OPTIONS:3030 CLASS_SKILL_COUNT:3046 CLASS_SKILL_MC_COUNT:3047 CLASS_ARMOR_PROFS:3050 CLASS_RESOURCES:3071 ASI_LEVELS:3255 XP_THRESHOLDS:3263 APP_VERSION:3273 APP_VERSION_DATE:3274 APP_TELEGRAM_URL:3280 APP_BOOSTY_URL:3281 FEATS_DATA:3302 APP_CHANGELOG:3625 CASTER_TYPE:8301 THIRD_CASTER_SUBCLASSES:8311 THIRD_CASTER_SLOTS:8318 MULTICLASS_SPELL_SLOTS:8329 MULTICLASS_PREREQUISITES:8354 MULTICLASS_PROFICIENCIES:8373 EDITION_DATA:8403

**spells.js** (13819 строк)  
SPELLS_BASE:7

**spell-effects.js** (881 строк)  
SPELL_EFFECTS:71

**class-choices.js** (815 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 ARTIFICER_INFUSIONS:106 ARTIFICER_REPLICA_ITEMS:125 CLASS_CHOICES:170 ccModalState:513

**subclass-choices-data.js** (1136 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 ARMORER_MODELS:168 SUBCLASS_CHOICES:173 SUBCLASS_RESOURCES:438

