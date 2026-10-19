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
| 875–1222 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1223–1228 | R2. Базовые компоненты |
| 1229–1387 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1388–1643 | UI-3. Desktop/tablet layout (≥1024px) |
| 1644–1754 | UI5-4: ПК — многоколоночная раскладка листа |
| 1755–1837 | /R2 |
| 1838–2012 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2013–2252 | HEADER (R5: back + name + hamburger) |
| 2253–2318 | КД АВТО-РАСЧЁТ |
| 2319–2388 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2389–2454 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2455–2614 | УСЛОВИЯ |
| 2615–2761 | СПАСБРОСКИ |
| 2762–2913 | CLASS FEATURES |
| 2914–2960 | УБИРАЕМ СТРЕЛКИ |
| 2961–3067 | TAB NAV — 5 tabs + centered FAB dice |
| 3068–3181 | UX-5: лента последних бросков вне модалки |
| 3182–3358 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3359–3378 | HAMBURGER BUTTON |
| 3379–3421 | SIDE DRAWER |
| 3422–3925 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3926–3973 | MENU-8/9: встречающий экран во всё окно. |
| 3974–4066 | MENU-2: плашка последнего героя. |
| 4067–4241 | MENU-3: меню приключения. |
| 4242–4312 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4313–4313 | INVENTORY |
| 4314–4344 | INVENTORY — WEIGHT BAR |
| 4345–4381 | INVENTORY — BACKPACK HEADER |
| 4382–4422 | INVENTORY — FILTERS |
| 4423–4611 | INVENTORY — ITEM CARDS |
| 4612–4977 | COINS — BIG NUMBER CARD GRID |
| 4978–5281 | MODALS |
| 5282–5316 | DICE |
| 5317–5897 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5898–6786 | OTHER STYLES |
| 6787–6857 | HP DISPLAY BLOCK |
| 6858–6883 | MOBILE OPTIMIZATION |
| 6884–7012 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7013–7051 | HP TOAST (snackbar) |
| 7052–7103 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7104–7159 | Confirm Modal |
| 7160–7585 | ⚔️ ОТРЯД & БОЙ |
| 7586–7865 | RACIAL BONUS BAR |
| 7866–8008 | COMPACT STATS GRID |
| 8009–8276 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8277–8329 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8330–8380 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8381–8483 | COMPACT SKILLS |
| 8484–8526 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8527–8598 | ACCORDION |
| 8599–8622 | CLASS RESOURCES |
| 8623–8723 | ASI MODAL |
| 8724–8988 | APP VERSION |
| 8989–8998 | COMPANIONS |
| 8999–9044 | FEATS LIST IN ASI |
| 9045–9291 | PROFILES TABS (Чейнджлог) |
| 9292–9370 | TAKEN FEATS |
| 9371–9567 | SW UPDATE MODAL |
| 9568–9615 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9616–9788 | INVENTORY SLOTS SYSTEM |
| 9789–9988 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9989–10260 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10261–10433 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10434–10503 | 3D DICE CUBE |
| 10504–10878 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10879–10961 | DESKTOP LAYOUT — centered max-width |
| 10962–10985 | INSPIRATION |
| 10986–11025 | CONCENTRATION |
| 11026–11702 | WEAPON CARDS WITH ROLL BUTTONS |
| 11703–11813 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11814–11876 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11877–11903 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11904–12027 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12028–12056 | R6: Ассеты (декор) |
| 12057–13020 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13021–13108 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13109–13117 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13118–13175 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13176–13507 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13508–13534 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13535–13561 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13562–13644 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13645–14745 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14746–14801 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14802–14894 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14895–15208 | DISC-1 · Ромб раскрытия |
| 15209–15799 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15800–15905 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15906–16045 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16046–16280 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16281–16290 | STYLE-8b3-fix: срезанный ромб |
| 16291–16604 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16605–17123 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17124–17158 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17159–17840 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-139 #screen-settings:140-234 #header-autohide-row:235-251  
#wake-lock-row:252-282 #edition-row:283-305 #install-row:306-316 #welcome-modal:317-321 #welcome-step-1:322-340 #welcome-step-2:341-375 #header-avatar:376-381 #status-bar:382-385  
#status-inspiration:386-386 #status-concentration:387-389 #status-ritual:390-392 #status-conditions-btn:393-405 #screen-home:406-408 #home-art:409-436 #home-sub-new:437-484 #home-install:485-492  
#home-hero:493-493 #home-hero-emblem:494-497 #home-hero-sub:498-498 #home-hero-chips:499-509 #screen-characters:510-549 #char-hero:550-550 #char-hero-emblem:551-554 #char-hero-sub:555-555  
#char-hero-chips:556-556 #char-hero-actions:557-565 #screen-data:566-582 #sync-row:583-583 #storage-status:584-584 #backup-panel:585-589 #backup-list:590-601 #screen-about:602-605  
#app-version-row:606-613 #ptab-info:614-621 #app-links-row:622-626 #ptab-changelog:627-632 #changelog-list:633-639 #screen-character:640-640 #tab-sheet:641-643 #creation-wizard-banner:644-651  
#cw-edition-row:652-661 #cw-validation:662-664 #basic-locked-bar:665-674 #creation-todo:675-684 #sheet-avatar:685-697 #char-build-badge-wrap:698-712 #char-class-mc:713-736 #char-subclass-rec:737-737  
#char-subclass-mc:738-946 #char-books:947-951 #race-bonus-display:952-952 #race-extras-panel:953-953 #class-skills-panel:954-955 #background-feature-display:956-957 #bg-extras-panel:958-1001 #abilgen-row:1002-1008  
#stats-collapse-btn:1009-1016 #abilities-region:1017-1020 #proficiency-bonus-2024:1021-1022 #insp-card-2024:1023-1032 #abil-col-1:1033-1033 #stat-block-str:1034-1035 #mod-str:1036-1042 #abil-save-slot-str:1043-1043  
#abil-skills-slot-str:1044-1046 #stat-block-dex:1047-1048 #mod-dex:1049-1055 #abil-save-slot-dex:1056-1056 #abil-skills-slot-dex:1057-1059 #stat-block-int:1060-1061 #mod-int:1062-1068 #abil-save-slot-int:1069-1069  
#abil-skills-slot-int:1070-1073 #abil-col-2:1074-1074 #stat-block-con:1075-1076 #mod-con:1077-1083 #abil-save-slot-con:1084-1084 #abil-skills-slot-con:1085-1087 #stat-block-wis:1088-1089 #mod-wis:1090-1096  
#abil-save-slot-wis:1097-1097 #abil-skills-slot-wis:1098-1100 #stat-block-cha:1101-1102 #mod-cha:1103-1109 #abil-save-slot-cha:1110-1110 #abil-skills-slot-cha:1111-1124 #saves-grid:1125-1134 #skills-container:1135-1137  
#passive-perception:1138-1157 #ws-hp-banner:1158-1163 #hp-dmg-row:1164-1173 #hp-dmg-body:1174-1194 #death-saves-section:1195-1226 #hp-armor-body:1227-1268 #hp-hd-body:1269-1282 #hp-rest-body:1283-1310  
#class-dev-section:1311-1313 #cd-head:1314-1314 #cd-res:1315-1315 #cd-attn:1316-1317 #cd-about:1318-1326 #ac-formula:1327-1328 #ac-modifiers:1329-1336 #conditions-grid:1337-1344  
#effects-grid:1345-1352 #resistances-container:1353-1361 #prof-card:1362-1365 #armor-prof-container:1366-1369 #weapon-prof-container:1370-1373 #tools-container:1374-1377 #languages-container:1378-1385 #companions-list-sheet:1386-1398  
#tab-progress:1399-1400 #pg-body:1401-1402 #tab-spells:1403-1405 #spell-stat-card:1406-1427 #spell-mod-display:1428-1433 #spell-dc-display:1434-1439 #spell-attack-display:1440-1445 #spell-stats-by-class:1446-1457  
#spell-slots-card:1458-1463 #spell-slots-visual:1464-1470 #concentration-block:1471-1488 #prep-counter:1489-1489 #my-spells-list:1490-1492 #tab-inventory:1493-1512 #weight-fill:1513-1547 #inventory-list:1548-1557  
#inv-pouches:1558-1613 #tab-notes:1614-1640 #notes-subtabs:1641-1642 #notes-main:1643-1644 #taken-feats-section:1645-1649 #taken-feats-list:1650-1653 #tab-party:1654-1662 #my-char-card:1663-1677  
#allies-list:1678-1693 #npcs-list:1694-1710 #monsters-list:1711-1722 #companions-list-world:1723-1733 #tab-battle:1734-1739 #weapons-list:1740-1742 #ws-card:1743-1745 #saved-roll-form:1746-1752  
#saved-roll-err:1753-1754 #saved-rolls-list:1755-1758 #battle-res-card:1759-1760 #battle-res-rows:1761-1762 #battle-setup-screen:1763-1773 #battle-setup-list:1774-1774 #battle-difficulty:1775-1778 #battle-tracker-screen:1779-1783  
#battle-turn-info:1784-1789 #battle-repeat-strip:1790-1790 #battle-tracker-list:1791-1800 #tab-journal:1801-1815 #journal-list:1816-1822 #screen-itemref:1823-1825 #item-ref-tabs:1826-1831 #item-ref-weight:1832-1870  
#item-ref-slots:1871-1902 #screen-dmref:1903-1905 #dm-ref-tabs:1906-1910 #dm-ref-ed:1911-1911 #dm-ref-cond:1912-1912 #dm-ref-combat:1913-1913 #dm-ref-world:1914-1918 #screen-help:1919-1941  
#help-about:1942-1965 #help-start:1966-1990 #help-sheet:1991-2014 #help-progress:2015-2060 #help-spells:2061-2077 #help-inventory:2078-2090 #help-battle:2091-2115 #help-party:2116-2132  
#help-notes:2133-2141 #help-journal:2142-2150 #help-planes:2151-2178 #help-dice:2179-2190 #help-edition2024:2191-2230 #help-data:2231-2247 #help-marks:2248-2270 #conc-details-modal:2271-2281  
#conc-detail-duration-row:2282-2289 #conc-detail-desc-row:2290-2299 #add-journal-modal:2300-2323 #add-npc-modal:2324-2353 #add-ally-modal:2354-2390 #screen-monsters:2391-2403 #srd-monster-count:2404-2404 #srd-monster-results:2405-2409  
#srd-npc-modal:2410-2419 #srd-npc-count:2420-2420 #srd-npc-results:2421-2428 #screen-monsterform:2429-2466 #monster-cr-note:2467-2469 #monster-stats:2470-2471 #monster-saves:2472-2473 #monster-attacks:2474-2497  
#screen-rest:2498-2500 #rest-main-screen:2501-2507 #rest-info-screen:2508-2512 #hit-dice-section:2513-2514 #hit-dice-controls-total:2515-2519 #hit-dice-by-size:2520-2524 #rest-food-section:2525-2533 #rest-result-screen:2534-2536  
#rest-result-details:2537-2545 #screen-levelup:2546-2550 #lu-screen-multiclass:2551-2552 #lu-mc-current-classes:2553-2555 #lu-mc-new-class:2556-2560 #lu-mc-prereq-warn:2561-2561 #lu-mc-subclass-row:2562-2570 #lu-screen-preview:2571-2603  
#lu-slots-card:2604-2605 #lu-slots-info:2606-2609 #lu-build-hint:2610-2610 #lu-features-container:2611-2619 #lu-screen-choices:2620-2621 #lu-choices-body:2622-2628 #lu-screen-result:2629-2630 #lu-result-title:2631-2631  
#lu-result-body:2632-2638 #screen-wildshape:2639-2644 #ws-limits:2645-2645 #ws-results:2646-2649 #screen-hphistory:2650-2652 #hp-history-list:2653-2658 #asi-modal:2659-2663 #asi-build-hint:2664-2678  
#asi-feat-list:2679-2679 #asi-stat-grid:2680-2680 #asi-preview:2681-2689 #class-choice-modal:2690-2705 #dice-modal:2706-2738 #dice-file-hint:2739-2739 #dice3d-result:2740-2751 #dice-result-display:2752-2765  
#dice-pick-hint:2766-2766 #dice-mode-segment:2767-2771 #dice-formula-panel:2772-2789 #dice-fan:2790-2798 #dice-popover-settings:2799-2846 #dice-popover-history:2847-2858 #dice-history:2859-2867 #screen-spellsearch:2868-2870  
#spell-feat-bar:2871-2887 #spell-class-filter:2888-2931 #class-filter-legend:2932-2933 #spell-search-count:2934-2934 #spell-search-results:2935-2938 #cast-spell-modal:2939-2943 #cast-spell-options:2944-2946 #add-spell-modal:2947-2990  
#new-spell-class-chips:2991-3036 #new-spell-mech-fields:3037-3041 #new-spell-mech-dmg-row:3042-3061 #new-spell-mech-half-row:3062-3064 #new-spell-mech-mod-row:3065-3075 #item-modal:3076-3120 #item-armor-fields:3121-3146 #coin-exchange-modal:3147-3185  
#exch-preview:3186-3192 #screen-magiccatalog:3193-3220 #magic-catalog-count:3221-3221 #magic-catalog-list:3222-3225 #screen-gearcatalog:3226-3230 #gear-packs-list:3231-3244 #gear-catalog-count:3245-3245 #gear-catalog-list:3246-3250  
#weapon-modal:3251-3254 #weapon-picker-section:3255-3257 #weapon-filter-chips:3258-3267 #weapon-presets-list:3268-3268 #weapon-pick-bar:3269-3331 #character-tabs:3332-3343 #quick-roll-strip:3344-3349 #qrs-list:3350-3360  
#active-effects-panel:3361-3365 #aef-list:3366-3372 #hp-toast-container:3373-3375 #add-companion-modal:3376-3392 #companion-familiar-row:3393-3413 #mob-sheet:3414-3417 #mob-sheet-list:3418-3421 #confirm-modal:3422-3435  
#avatar-modal:3436-3439 #avatar-modal-preview:3440-3467 #screen-builds:3468-3495 #bp-list:3496-3500 #screen-buildguide:3501-3503 #bg-body:3504-3508 #screen-buildplan:3509-3511 #bp-plan-body:3512-3516  
#screen-abilityinfo:3517-3519 #ai-body:3520-3524 #screen-abilgen:3525-3527 #ag-body:3528-3532 #screen-books:3533-3535 #books-body:3536-3540 #screen-mclayout:3541-3543 #ml-body:3544-3548  
#screen-featureinfo:3549-3551 #fi-body:3552-3556 #app-log-panel:3557-3576 #app-log-list:3577-3757 #notes-entry-modal:3758-3806  

## Функции по файлам (`имя:строка`)

**rules.js** (1784 строк, 119 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesAuraOfProtection:337 rulesSaveBonus:342 rulesDivineSmiteFormula:350 rulesSkillBonus:357 rulesPassivePerception:372 rulesSpellStats:376 _spellStatMod:401 rulesSpellStatsByClass:409 rulesWeaponMods:427 rulesOffhandDamageMod:443 armorPenalties:452 rulesItemArmor:465 rulesArmorItem:477 rulesAC:488 charCasterLevel:670 classSpellSlotRow:711 getMulticlassSpellSlots:724 rulesRestoreLevelFields:760 rulesApplySpellSlots:779 resolvePactSlots:802 restoreItemCharges:812 rulesHitDieSides:829 rulesShortRest:835 rulesLongRestBlockReason:870 rulesLongRest:883 rulesExhaustionLevel:949 rulesEffectiveHpMax:955 _dsReset:960 _dsCount:961 _dsFill:962 _condAdd:963 _condRemove:964 rulesIsDead:966 rulesIsStable:970 rulesRegainFromZero:975 rulesSetHp:981 rulesDamageAfterDefenses:993 rulesApplyDamage:1005 rulesDeathSaveBlockReason:1042 rulesDeathSave:1049 rulesConditionRollMods:1068 rulesEffectiveSpeed:1085 rulesArmorStealthDisadv:1106 rulesFeatPrereqMissing:1115 rulesFeatStatChoice:1142 rulesFeatStatOptions:1150 rulesFeatSlotCount:1163 rulesFeatSpellFits:1168 rulesFeatSpellCandidates:1179 rulesFeatSpellLabel:1183 rulesFeatSpellProgress:1188 rulesFeatClassOptions:1213 rulesFeatFreeResId:1226 rulesResetFeatFree:1229 concSaveParams:1240 rulesCrToXp:1282 rulesCrToProf:1288 rulesCrValue:1295 rulesWildShapeLimits:1306 rulesPolymorphLimits:1330 rulesCombatWildShapeHeal:1335 rulesBeastAllowed:1340 rulesFormStart:1347 rulesFormOwnHp:1361 rulesFormDamage:1366 rulesFormHeal:1381 rulesEncounterMultiplier:1388 rulesEncounterDifficulty:1397 getCharClassPairs:1421 charEditionMismatch:1435 findLangInCatalog:1443 ensureLanguagesArray:1455 recalcLanguagesFromSources:1471 add:1476 findToolInCatalog:1521 ensureToolsArray:1533 getBackgroundDef:1554 validateBgStatChoice:1590 parseBackgroundToolEntry:1610 recalcToolsFromSources:1625 add:1630 ensureArmorWeaponFields:1695 recalcArmorWeaponFromSources:1708 addArmor:1714 addWeapon:1715 addSpec:1764

**app-core.js** (1718 строк, 81 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:462 screenBack:468 _modalVisible:482 _closeOpenModals:485 headerBack:495 _screenMotionOk:528 _screenGhostDrop:534 _screenGhostStart:546 _screenEnter:564 _purgeDraftChars:575 showScreen:588 updateHeaderTitle:700 syncDrawerHeader:754 switchTab:766 openDrawer:796 closeDrawer:809 showCharacterNav:821 hideCharacterNav:829 isInteractive:849 currentActiveTab:872 createNewCharacter:930 getClassColor:952 getClassIcon:967 getAbilityIcon:974 getConditionIcon:989 getConditionChipIcon:1013 getSpellClassIcon:1031 getSchoolSlug:1048 getSchoolIcon:1052 stripLeadingEmoji:1065 formatTimeAgo:1069 setCharSort:1083 setCharSearch:1090 duplicateCharacter:1094 exportOneCharacter:1106 updateCharCounter:1113 onDragStart:1130 onDragOver:1131 onDrop:1132 renderCharacterList:1143 renderCharPlate:1230 deleteCharacter:1293 showConfirmModal:1307 safeSet:1354 safeSetChecked:1358 loadCharacter:1367 showToast:1558 showFieldError:1575 clearFieldError:1597 toastAddAction:1607 emptyStateHtml:1625 openHPHistory:1636 closeHPHistory:1664 updateVersionBlock:1669 forceAppUpdate:1700

**app-migrate.js** (1042 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1034

**app-builds.js** (1757 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1038 _reEscape:1039 _glossEd:1040 _glossBuild:1041 ingest:1043 _glossIndex:1065 glossarizeHtml:1073 _glossPopoverEl:1087 hideGlossPopover:1099 showGlossPopover:1104 _glossBindOnce:1123 openBuildGuide:1154 gx:1177 _list:1178 getBuildLevelRec:1241 getBuildRecChoiceOption:1246 getBuildRecChoiceIds:1254 getBuildRecFeat:1259 getBuildRecAsi:1269 getBuildRecSubclass:1276 parseAsiFromHeadline:1284 _buildFeatNameMap:1298 parseFeatFromHeadline:1340 parseSpellsFromHeadline:1357 getBuildRecSpellObjs:1603 openBuildPlan:1623 _cpSubclassOf:1676 _cpClassSwitch:1687 openClassPlan:1702

**app-io.js** (717 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:101 _normalizeImportedSpell:110 _isValidImportedSpell:121 _collectCharUserSpells:125 _ingestImportedUserSpells:143 _spellBaseById:189 _unpackSpell:197 _countUnresolvedSpells:219 _unresolvedNote:227 _importTooNew:232 _packSpell:241 _packCharForExport:252 _unpackCharSpells:259 _buildCharEnvelope:265 _charExportFileName:280 _downloadText:283 _shareableFile:294 shareOneCharacter:305 copyCharToClipboard:322 pasteCharFromClipboard:335 _extractCharsFromImport:353 _applyFullRestore:365 _warnEditionMix:409 run:410 importData:425 importOneCharacter:484 _importOneCharText:501 _consumeLaunchFiles:582 _importLaunchText:615 exportSpells:622 importSpells:631 exportSessionLog:704

**app-combat.js** (3378 строк, 154 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:132 rollSkillCheck:146 initSaves:165 autoSelectProficiencies:200 initSkills:243 toggleAbilOpen:271 abilityBreakdown:283 openAbilityInfo:311 toggleExpertise:346 loadExpertise:365 updateSkillProfCount:379 updateSkillSources:391 updateClassFeatures:415 calculateAC:430 toggleInspiration:491 updateStatusCounter:504 updateStatusBar:518 updateInspirationLabels:560 updateStatDisplay:577 updateAllStatDisplays:582 adjustStat:586 adjustCoin:609 renderCoinMob:623 openCoinSheet:633 setCoinFromSheet:643 updateCoinTotal:650 openCoinExchange:662 closeCoinExchange:667 previewExchange:671 coinExchangeCalc:699 confirmExchange:704 updateSubclassOptions:727 updateSubclassRecHint:784 featHpPerLevel:799 featHpFlat:808 recalculateHP:817 updateChar:872 toggleProficiency:939 calcStats:962 setSpellStat:1033 calcSpellStats:1044 _toggleNonCasterCards:1096 showSpellCasterCards:1107 onRaceChange:1115 renderBooksRow:1245 openMobSheet:1272 closeMobSheet:1279 mobSheetActs:1281 openBooksSheet:1286 toggleCharBook:1296 populateRaceSelect:1313 _speciesEffective:1346 _renderSpeciesBar:1359 _speciesChoiceOptions:1374 toggleSpeciesChoice:1381 syncSpeciesSpells:1395 rollRandomName:1441 pick:1449 build:1450 _raceSkillAllowance:1509 _raceFlexCount:1519 _raceFlexFits:1525 _raceFlexApply:1532 _setExtrasHtml:1542 renderRaceExtras:1551 toggleHalfElfStat:1722 toggleRaceFlexStat:1748 setRaceVariableTrait:1778 _raceSkillSet:1795 _pickHide:1805 _pickExpandBtn:1809 pickExpand:1812 raceLangGoto:1819 toggleRaceSkill:1827 _classSkillList:1856 _skillsFromOtherSources:1869 _skillsByName:1878 _skillTakenElsewhere:1884 _classSkillHeld:1896 _classSkillSync:1902 renderClassSkills:1933 toggleClassSkill:1977 openRaceFeatModal:2005 removeRaceFeat:2025 applyBasicLockUI:2060 _cwEditionBusy:2091 syncCwEdition:2095 setDraftEdition:2107 updateLockButtonState:2117 lockBasicInfo:2155 unlockBasicInfo:2175 isSheetLocked:2203 sheetLockGuard:2209 applySheetLockUI:2215 _creationTodo:2246 add:2250 src:2251 scheduleCreationTodo:2318 renderCreationTodo:2323 creationTodoGo:2348 openLockSheet:2358 _creationUiReset:2371 _isMobSheet:2372 renderIdentitySummary:2373 toggleIdentityMore:2392 renderProfSummary:2396 toggleProfCard:2411 openAcSheet:2417 _mobMarkClamp:2425 init:2434 lockSheet:2455 doLock:2459 unlockSheet:2472 onBackgroundChange:2493 _bgSkillsOf:2538 _bgUncheckOld:2545 _bgCheckSkills:2553 renderBackgroundFeature:2565 _bgStatShort:2610 populateBackgroundSelect:2613 _bgRevertStatChoice:2644 _bgAppliedStat:2657 _bgApplyStat:2662 setBgStatMode:2674 toggleBgStat:2686 _bgAfterStats:2709 _bgRevertFeatEffects:2720 syncOriginFeat:2745 toggleBgCustom:2781 _toggleBgCustom14:2821 toggleBgSkillPick:2868 _renderBgCustom14:2895 giveBackgroundEquipment:2932 renderBackgroundExtras:2977 _armorFromSelect:3085 renderArmorSelect:3097 onArmorPick:3132 onShieldPick:3146 onArmorChange:3165 onManualAC:3194 onManualMaxHP:3201 calcCoinWeight:3224 getActiveConditionsForRender:3238 toggleConditionsPopup:3267 closeConditionsPopup:3279 renderConditionsPopup:3285

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1937 строк, 61 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 _restHasSlots:78 showRestResult:84 adjustHitDice:96 _restHitDiceChosen:108 adjustHitDiceSize:115 updateHitDiceInfo:122 confirmRest:155 openLevelUpModal:247 _showMulticlassScreen:277 luPickAnotherClass:322 openMulticlassNewClass:329 confirmMulticlassNewClass:388 _showLevelUpPreview:399 closeLevelUpModal:574 confirmLevelUp:587 _luShowResult:714 luFinishChoices:745 luRefreshChoices:752 luSetSubclass:759 luApplyFeatById:778 luApplyAsi:824 _luFeatChoiceAt:845 _luChoiceOpensAt:854 _ccDefsFor:859 _luAsiDone:870 luApplyAllRecommendations:875 _luSpellGainParts:997 pluralRu:1002 delta:1006 luBuildChoicesScreen:1024 recBadge:1032 luAddRecommendedSpells:1167 luGoToSpellsTab:1195 openLevelDownConfirm:1207 confirmLevelDown:1252 loadDeathSaves:1285 toggleDeathSave:1329 resetDeathSaves:1346 updateHPDisplay:1359 hpToggleRow:1449 hpSetRowOpen:1458 updateHPSummary:1466 updateHPRows:1530 quickHP:1548 setHPAbsolute:1674 addHPHistory:1699 _hpUndoPrepare:1716 _hpUndoConcSnap:1736 _hpUndoConcRestore:1753 undoHPChange:1776 showHPToast:1806 applyCustomHP:1831 saveTempHP:1848 rollHitDieQuick:1862 renderHitDiceIcons:1894 rollDeathSave:1908

**app-inventory.js** (1860 строк, 86 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:463 syncItemArmorFields:468 syncWornArmor:480 submitItem:509 openMagicCatalog:580 closeMagicCatalog:597 renderMagicCatalog:602 fillFromMagicItem:634 openGearCatalog:687 closeGearCatalog:703 renderGearPacks:708 renderGearCatalog:718 fillFromGearItem:746 addPackToInventory:769 rollTrinket:791 _weaponPresets2024:827 _weaponMasteryGrant:848 getWeaponMasteryLimit:873 weaponMasteryPending:877 canMasterWeapon:882 getWeaponMasteryProp:891 isWeaponMastered:898 toggleWeaponMastery:901 _weaponCatalog:920 renderWeaponPresets:934 filterWeaponPresets:1000 toggleWeaponFilter:1004 fillWeaponPreset:1011 _resetWeaponForm:1029 openWeaponModal:1050 closeWeaponModal:1060 editWeapon:1068 deleteCustomWeapon:1098 _weaponPresetByName:1124 checkWeaponProficiency:1131 submitWeapon:1159 weaponRowTap:1250 renderWeapons:1264 isLightWeapon:1363 toggleTWFStyle:1368 rollTWFAttack:1376 _weaponDamageRoll:1424 rollTWFDamage:1445 _unarmedStrike:1460 _weaponAt:1464 rollWeaponAttack:1468 _attackBonusTail:1529 rollWeaponDamage:1533 _canDivineSmite:1566 openDivineSmite:1570 _divineSmite:1594 removeWeapon:1626 _invDndInit:1660 _invClearIndicators:1689 _invSetIndicator:1698 _invCleanup:1703 _invCancelDrag:1710 _invMoveItem:1718 _invCommitDrop:1735 invDragStart:1756 invDragOver:1766 invDragLeave:1783 invDrop:1787 invDragEnd:1793 invTouchStart:1800 invTouchMove:1816 invTouchEnd:1848

**app-spells.js** (2067 строк, 101 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:103 adjustPactSlots:114 syncSpellSlotsFromClass:126 updateSpellSlots:135 toggleSpellSlot:146 adjustSpellSlots:157 restoreAllSlots:168 setSpellVersion:179 _syncSpellVersionLock:190 setSpellClass:199 _charSpellClassKey:208 _charMaxCastableLevel:219 _defaultSpellVersion:227 openSpellSearch:230 markCharOwnClassFilter:248 closeSpellSearch:278 _featPickCtx:289 featAddFixedSpells:304 openFeatSpellPicker:330 _featPickProgressText:347 _renderFeatPickBar:353 featPickSetClass:372 _featPickCandidates:380 _renderFeatPickList:390 addFeatSpell:421 removeFeatSpell:441 _parseSpellClassList:464 _syncNewSpellClassChips:468 toggleNewSpellClass:475 _fillNewSpellDamageTypes:500 _toggleHidden:507 updateNewSpellMechFields:515 _hbFormulaCheck:530 _collectHbEffect:539 _spellIdArg:577 _findHomebrewSpell:583 openAddSpellForm:591 _syncCustomSpellAcrossChars:670 _purgeCustomSpellFromChars:688 deleteCustomSpell:707 _deleteCustomSpellConfirmed:716 closeAddSpellForm:730 submitNewSpell:734 renderSpellSearch:824 addSpell:893 removeSpell:909 toggleSpellCard:923 renderMySpells:928 _spellActiveBadgeText:1070 _spellActiveBadgeHtml:1074 updateSpellActiveBadges:1077 _prepEntries:1100 _spellPrepEntry:1115 _prepLimit:1120 calcMaxPrepared:1136 _known2014:1143 calcMaxKnownSpells:1157 _knownSpellCount:1163 calcMaxCantrips:1173 isPrepClass:1182 _subclassSpellNames:1188 spellNeedsPrep:1215 _preparedCount:1231 openSpellCardsMenu:1239 isSpellPrepared:1254 toggleSpellPrepared:1264 renderPrepCounter:1290 _castableSlotOptions:1344 _arcanumResId:1365 castSpell:1375 _castSpellWithSlot:1396 _finishCast:1434 applyCastEffects:1480 _applyCastForm:1517 openCastVariantChooser:1530 pickCastVariant:1569 closeCastVariantChooser:1579 _applyCastSummon:1592 _nextCastInstanceId:1626 _replaceCastInstance:1634 _ensureCastInstance:1664 _applyCastDamage:1684 _rollCastDamage:1711 _startCastRepeat:1776 castRepeatDamage:1790 _applyCastDebuff:1815 castSpellAttackMod:1856 castStatMod:1864 _applyCastHeal:1882 _castHealApply:1903 _applyCastTempHp:1909 applyCastTempHp:1926 _applyCastHpMaxBonus:1940 openCastChooser:1960 closeCastChooser:1981 canCastAsRitual:1994 castRitual:2016 cancelRitual:2055

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1528 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:454 notesPickRandomVariant:459 _applyVariantToSection:472 _setSectionText:486 _mdToHtml:501 closeLists:513 _countStats:553 _bindSectionInputs:560 _updateStats:573 _notesHotkeys:582 notesMdInsert:597 wrap:606 linePrefix:613 notesTogglePreview:663 notesUpdateSection:682 _syncTakenFeatsLocation:697 _renderEntriesView:710 _renderEntryCard:765 notesPinDragStart:812 notesPinDragOver:822 notesPinDragLeave:831 notesPinDrop:836 notesPinDragEnd:846 _notesReorderPinned:855 notesSetTagFilter:883 notesJumpToNpc:889 notesOpenEntryModal:917 notesCloseEntryModal:951 _notesRenderModalTags:956 notesAddModalTag:968 notesModalTagKeydown:978 notesRemoveModalTag:982 notesSaveEntryModal:988 notesDeleteEntry:1036 notesTogglePin:1057 _notesLogJournal:1092 notesSearchInput:1118 notesSearchKeydown:1125 _hlText:1143 _renderSearchResults:1153 notesClearSearch:1232 notesToggleMenu:1243 _notesMenuClose:1256 notesMenuAction:1262 _notesCharName:1277 _notesTriggerDownload:1282 notesExportMd:1290 notesExportJson:1335 _notesSanitizeEntry:1347 _notesFileTooBig:1358 notesHandleImportJson:1366 _notesApplyImport:1387 notesHandleImportMd:1427 notesPrint:1463 _notesFlashSaved:1494

**app-ui.js** (1282 строк, 74 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 later:333 onKey:340 checkWhatsNew:350 showWhatsNewModal:362 toggleAccordion:399 initCharResources:419 getResourceMax:428 getCharResourceDefs:448 currentDieSize:478 crRow:490 crRestoreLabel:503 crResourceRow:518 crSlotRecoveryBudget:576 crSlotRecoveryActs:580 recoverSlotByResource:595 crPassiveNotes:620 rollResourceDie:629 crManeuverRows:648 crRowsHtml:665 crSetRows:702 renderClassResources:717 spendResource:735 resetResource:753 toggleResourcePip:763 resourceRollOnSpend:788 resetResourcesByRest:801 getJournal:847 addJournalEntry:852 filterJournal:874 renderJournal:881 deleteJournalEntry:917 openAddJournalEntry:926 closeAddJournalEntry:931 saveJournalEntry:934 getCompanions:954 renderCompanions:959 companionHP:1004 buildFamiliarFormOptions:1017 onCompanionTypeChange:1029 applyFamiliarForm:1037 openAddCompanionModal:1049 summonFamiliar:1066 openPrefilledCompanionModal:1076 openEditCompanionModal:1087 closeAddCompanionModal:1107 saveCompanion:1110 deleteCompanion:1135 switchProfilesTab:1151 clipChangelogText:1166 expandChangelogItem:1177 clCleanText:1189 renderChangelog:1195 openItemRef:1240 closeItemRef:1245 switchItemRef:1250 _syncHeaderHeight:1268

**app-dice.js** (1712 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:539 openDiceRollHistory:544 drawDiceSVG:557 _waitDiceBoxModule:576 _diceLsGet:596 _getAccentColor:604 _getDiceTheme:623 _getDiceThemeColor:630 setDiceTheme:633 _syncDiceThemeButtons:639 _getDiceBg:649 setDiceBg:656 _syncDiceBgButtons:662 _diceDbg:672 _initDiceBox:677 _diceFaceValue:772 animateDice3d:794 animateDice2d:998 buildDie:1024 tick:1092 _applyDiceCritGlow:1115 parseDiceFormula:1136 _formulaCanon:1172 _renderFormulaResult:1184 rollFormula:1220 _rollFormulaFrom:1302 _diceFieldErrOpts:1317 diceFormulaBlur:1323 rollCustomFormula:1333 renderDiceHistory:1336 createParticles:1358 _diceShapeSvg:1392 renderDiceFan:1399 _paintSelectedDie:1418 _diceHeroSvg:1442 _paintDiceMode:1452 selectDie:1467 rollSelectedDie:1486 toggleDiceFormulaPanel:1495 _savedRollFormula:1514 _savedRollsClean:1517 _savedRollNewId:1532 _savedRollLabel:1535 renderSavedRolls:1539 savedRollRoll:1559 savedRollTap:1566 savedRollEdit:1582 savedRollCancel:1599 savedRollSubmit:1604 savedRollDelete:1625 savedRollFromDice:1643 _diceHotkeys:1664

**app-settings.js** (912 строк, 93 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:172 _getStatsLayout:189 _applyStatsLayout:196 _statsInCards:203 _statsRowTarget:207 _placeStatRows:225 setStatsLayout:241 _syncStatsLayoutButtons:248 _getSheet2Demo:261 _syncSheet2DemoButtons:264 setSheet2Demo:270 _getSheetLock:281 setSheetLock:285 _syncSheetLockButtons:290 _wakeLockSupported:301 _getWakeLockOn:302 _applyWakeLock:306 setWakeLock:321 _syncWakeLockButtons:326 _getHeaderAutohideOn:336 setHeaderAutohide:339 _syncHeaderAutohideButtons:344 _getTrackXpOn:352 _applyTrackXp:355 setTrackXp:358 _syncTrackXpButtons:363 _getAttackDamageOn:384 setAttackDamage:387 _syncAttackDamageButtons:391 isEditionSplit:400 setEditionSplit:403 _syncEditionSplitButtons:408 openBooksScreen:418 _bookRowHtml:422 _renderBooksScreen:432 setBookOn:457 setBooksPreset:463 _afterBooksChange:470 _syncBooksSummary:482 _getStatsCollapsed:496 _applyStatsCollapsed:499 toggleStatsCollapsed:504 _getStoredDensity:518 _getDefaultDensity:526 _getDensity:533 _applyDensity:536 setDensity:540 _syncDensityButtons:546 _onViewportDensityChange:554 _getFontScale:572 _applyFontScale:579 setFontScale:590 _syncFontScaleUi:601 _getGlassAlpha:616 _getGlassBlur:623 _applyGlassAlpha:630 _applyGlassBlur:631 setGlassAlpha:632 setGlassBlur:642 _syncGlassUi:651 _getSpaceMode:700 _applySpaceBg:707 setSpaceMode:722 _syncSpaceButtons:728 _spaceOnScroll:747 _applyDymkaIcons:775 _initAppLinks:788 openSupportLink:820 _isStandalone:832 _isIos:838 _installMode:842 _syncInstallUi:847 installApp:860 openSettingsModal:884 closeSettingsModal:899

**app-asi.js** (840 строк, 39 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:573 removeFeat:620 _agBonus:656 _agPbSpent:666 _agBase:672 _agReady:679 openAbilGen:683 agSetMode:701 agPb:707 _agSwap:717 agStd:724 agPick:730 agRoll:736 _agCtl:749 _agRender:770 agApply:819

**app-progress.js** (896 строк, 50 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:309 _pgNext:325 _pgClassWord:379 _pgAvailableClasses:388 _pgActions:401 _pgBuild:419 openProgressTab:432 openProgress:442 pgTabActive:453 pgRefresh:460 pgSetSubclass:468 pgFocusSubclass:482 pgLevelUp:499 pgLevelDown:504 pgAfterLevelModal:510 pgAddClass:521 renderClassDev:535 _pgSheetAboutRow:554 _pgSubclassRows:572 syncClassFieldUI:598 openFeatureInfo:641 _fiRuleNotes:684 _mlTotal:723 _mlMissing:728 openMcLayout:734 mlSetClass:746 mlLevel:754 mlSetSub:763 mlAdd:768 mlRemove:774 _mlRender:780 _mlPruneAsi:845 mlApply:856

**app-desktop.js** (487 строк, 14 функций)  
syncFromStatusBar:134 syncStrip:193 setRailOpen:204 _esc:209 _stripEmoji:215 _condIcon:219 setRowExpanded:225 collapseRow:231 renderRrConditions:233 renderRailSlots:279 renderRailConc:321 updateRailHpRow:336 rrApplyHP:351 init:364

**app-help.js** (1169 строк, 54 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:90 setHelpFlag:94 welcomeGoStep:100 showWelcome:110 closeWelcome:117 welcomeContinue:123 welcomeSkipExperienced:129 welcomeBack:135 welcomeFinish:142 dismissWelcome:175 maybeShowWelcome:178 restartOnboarding:183 _tourWide:219 _ensureTourDom:222 _resolveTarget:263 _tourFirstVisible:278 _tourAnyModalVisible:298 _tourModalOpen:304 _tourStartWhenClear:316 startTour:328 startListTour:341 startSheetTour:345 _tourTyping:357 maybeStartSheetTour:362 restartTour:384 startTabTour:409 maybeStartTabTour:427 tourNext:453 tourPrev:458 endTour:464 _showTourStep:474 _setBox:537 _computeTourBoxes:553 snap:555 corner:568 _layoutTourCorners:590 _layoutTour:607 _onTourKey:710 _onTourReflow:716 _bindTourGlobal:720 _unbindTourGlobal:725 _buildListSteps:736 _buildSheetSteps:786 _buildProgressSteps:878 _buildSpellsSteps:936 _buildInventorySteps:973 _buildBattleSteps:1013 _buildNotesSteps:1045 _buildPartySteps:1080 _buildJournalSteps:1138

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (7833 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:127 SAVES_DATA:149 CONDITIONS:158 EFFECTS_DATA:181 CLASS_FEATURES:232 SPELL_PREP_CLASSES:482 CANTRIPS_KNOWN_2014:490 SPELLS_KNOWN_2014:498 SPELL_SLOTS_BY_LEVEL:505 CLASS_HIT_DICE:580 SUBCLASSES:586 SOURCE_LABELS:606 SUBCLASS_SOURCE:633 BOOK_CODES:702 _booksOffCache:705 SUBCLASS_LEVEL:746 SUBCLASS_FEATURES:762 WEAPON_PRESETS:1554 ITEM_ICONS:1598 CATEGORY_NAMES:1599 GEAR_PACKS:1608 RACE_DATA:1703 BACKGROUND_SKILLS:2320 BACKGROUND_ALIASES:2399 DEITY_ALIGN_LABELS:2412 DEITIES_DATA:2417 LANGUAGE_CATALOG:2485 RACE_LANGUAGES:2522 CLASS_LANGUAGES:2624 TOOL_CATALOG:2630 RACE_TOOLS:2685 CLASS_TOOLS:2697 SUBCLASS_LANGUAGES:2705 SUBCLASS_TOOLS:2728 RACE_ARMOR:2750 RACE_WEAPONS_SPECIFIC:2756 CLASS_WEAPONS_SPECIFIC:2772 RACE_NAME_POOLS:2785 RACE_NAME_GROUP:2827 SUBCLASS_ARMOR:2842 ARMOR_PRESETS:2873 skills:2890 ABILITY_INFO:2903 CLASS_SKILL_OPTIONS:2943 CLASS_SKILL_COUNT:2958 CLASS_SKILL_MC_COUNT:2959 CLASS_ARMOR_PROFS:2962 CLASS_RESOURCES:2982 ASI_LEVELS:3144 XP_THRESHOLDS:3152 APP_VERSION:3162 APP_VERSION_DATE:3163 APP_TELEGRAM_URL:3169 APP_BOOSTY_URL:3170 FEATS_DATA:3191 APP_CHANGELOG:3513 CASTER_TYPE:7661 THIRD_CASTER_SUBCLASSES:7670 THIRD_CASTER_SLOTS:7677 MULTICLASS_SPELL_SLOTS:7688 MULTICLASS_PREREQUISITES:7713 MULTICLASS_PROFICIENCIES:7731 EDITION_DATA:7760

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (732 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

