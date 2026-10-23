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
| 1–13 | style.css — Стили D&D 5e Character Sheet |
| 14–166 | Design tokens (R1) |
| 167–169 | Алиасы старых переменных (совместимость) |
| 170–180 | THEME-4: компонентные токены базового хрома |
| 181–187 | THEME-5: компонентные токены фичевых зон (партия B) |
| 188–261 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 262–306 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 307–431 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 432–528 | UI-2. Пресеты акцента (8 цветов) |
| 529–686 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 687–1032 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1033–1038 | R2. Базовые компоненты |
| 1039–1166 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1167–1422 | UI-3. Desktop/tablet layout (≥1024px) |
| 1423–1609 | UI5-4: ПК — многоколоночная раскладка листа |
| 1610–1692 | /R2 |
| 1693–1867 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 1868–2092 | HEADER (R5: back + name + hamburger) |
| 2093–2158 | КД АВТО-РАСЧЁТ |
| 2159–2222 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2223–2285 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2286–2441 | УСЛОВИЯ |
| 2442–2583 | СПАСБРОСКИ |
| 2584–2711 | CLASS FEATURES |
| 2712–2751 | УБИРАЕМ СТРЕЛКИ |
| 2752–2858 | TAB NAV — 5 tabs + centered FAB dice |
| 2859–2972 | UX-5: лента последних бросков вне модалки |
| 2973–3111 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3112–3131 | HAMBURGER BUTTON |
| 3132–3174 | SIDE DRAWER |
| 3175–3570 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3571–3618 | MENU-8/9: встречающий экран во всё окно. |
| 3619–3711 | MENU-2: плашка последнего героя. |
| 3712–3888 | MENU-3: меню приключения. |
| 3889–3958 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 3959–3959 | INVENTORY |
| 3960–3990 | INVENTORY — WEIGHT BAR |
| 3991–4013 | INVENTORY — BACKPACK HEADER |
| 4014–4054 | INVENTORY — FILTERS |
| 4055–4207 | INVENTORY — ITEM CARDS |
| 4208–4523 | COINS — BIG NUMBER CARD GRID |
| 4524–4825 | MODALS |
| 4826–4834 | DICE |
| 4835–5338 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5339–6082 | OTHER STYLES |
| 6083–6153 | HP DISPLAY BLOCK |
| 6154–6178 | MOBILE OPTIMIZATION |
| 6179–6307 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6308–6346 | HP TOAST (snackbar) |
| 6347–6380 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 6381–6438 | Confirm Modal |
| 6439–6815 | ⚔️ ОТРЯД & БОЙ |
| 6816–7056 | RACIAL BONUS BAR |
| 7057–7199 | COMPACT STATS GRID |
| 7200–7465 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 7466–7518 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 7519–7569 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 7570–7672 | COMPACT SKILLS |
| 7673–7715 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 7716–7787 | ACCORDION |
| 7788–7794 | CLASS RESOURCES |
| 7795–7895 | ASI MODAL |
| 7896–8063 | APP VERSION |
| 8064–8073 | COMPANIONS |
| 8074–8113 | FEATS LIST IN ASI |
| 8114–8359 | PROFILES TABS (Чейнджлог) |
| 8360–8438 | TAKEN FEATS |
| 8439–8631 | SW UPDATE MODAL |
| 8632–8679 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8680–8847 | INVENTORY SLOTS SYSTEM |
| 8848–9047 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9048–9260 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9261–9412 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9413–9482 | 3D DICE CUBE |
| 9483–9827 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9828–9910 | DESKTOP LAYOUT — centered max-width |
| 9911–9934 | INSPIRATION |
| 9935–9974 | CONCENTRATION |
| 9975–10511 | WEAPON CARDS WITH ROLL BUTTONS |
| 10512–10611 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10612–10672 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10673–10694 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10695–10818 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10819–10847 | R6: Ассеты (декор) |
| 10848–11722 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11723–11806 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11807–11815 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11816–11873 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11874–12192 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 12193–12219 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 12220–12246 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 12247–12329 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12330–13327 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13328–13383 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13384–13479 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13480–13811 | DISC-1 · Ромб раскрытия |
| 13812–14349 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14350–14455 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14456–14581 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14582–14787 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14788–14797 | STYLE-8b3-fix: срезанный ромб |
| 14798–15065 | STYLE-8b3b: два оставшихся блока «Магии» |
| 15066–15526 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15527–15561 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15562–16204 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:98-99 #conditions-popup-overlay:100-100 #conditions-popup:101-105 #conditions-popup-list:106-109 #drawer-overlay:110-111 #side-drawer:112-149 #screen-settings:150-245 #header-autohide-row:246-262  
#wake-lock-row:263-293 #edition-row:294-316 #install-row:317-327 #welcome-modal:328-332 #welcome-step-1:333-351 #welcome-step-2:352-386 #header-avatar:387-392 #status-bar:393-396  
#status-inspiration:397-397 #status-concentration:398-400 #status-ritual:401-403 #status-conditions-btn:404-417 #screen-home:418-420 #home-art:421-448 #home-sub-new:449-496 #home-install:497-504  
#home-hero:505-505 #home-hero-emblem:506-509 #home-hero-sub:510-510 #home-hero-chips:511-521 #screen-characters:522-561 #char-hero:562-562 #char-hero-emblem:563-566 #char-hero-sub:567-567  
#char-hero-chips:568-568 #char-hero-actions:569-577 #screen-data:578-594 #sync-row:595-595 #storage-status:596-596 #backup-panel:597-601 #backup-list:602-613 #screen-about:614-617  
#app-version-row:618-625 #ptab-info:626-633 #app-links-row:634-638 #ptab-changelog:639-644 #changelog-list:645-651 #screen-character:652-652 #tab-sheet:653-655 #creation-wizard-banner:656-663  
#cw-edition-row:664-673 #cw-validation:674-676 #basic-locked-bar:677-686 #creation-todo:687-696 #sheet-avatar:697-709 #char-build-badge-wrap:710-724 #char-class-mc:725-748 #char-subclass-rec:749-749  
#char-subclass-mc:750-958 #char-books:959-963 #race-bonus-display:964-964 #race-extras-panel:965-965 #class-skills-panel:966-967 #background-feature-display:968-969 #bg-extras-panel:970-1013 #abilgen-row:1014-1020  
#stats-collapse-btn:1021-1028 #abilities-region:1029-1032 #proficiency-bonus-2024:1033-1034 #insp-card-2024:1035-1044 #abil-col-1:1045-1045 #stat-block-str:1046-1047 #mod-str:1048-1054 #abil-save-slot-str:1055-1055  
#abil-skills-slot-str:1056-1058 #stat-block-dex:1059-1060 #mod-dex:1061-1067 #abil-save-slot-dex:1068-1068 #abil-skills-slot-dex:1069-1071 #stat-block-int:1072-1073 #mod-int:1074-1080 #abil-save-slot-int:1081-1081  
#abil-skills-slot-int:1082-1085 #abil-col-2:1086-1086 #stat-block-con:1087-1088 #mod-con:1089-1095 #abil-save-slot-con:1096-1096 #abil-skills-slot-con:1097-1099 #stat-block-wis:1100-1101 #mod-wis:1102-1108  
#abil-save-slot-wis:1109-1109 #abil-skills-slot-wis:1110-1112 #stat-block-cha:1113-1114 #mod-cha:1115-1121 #abil-save-slot-cha:1122-1122 #abil-skills-slot-cha:1123-1136 #saves-grid:1137-1146 #skills-container:1147-1149  
#passive-perception:1150-1169 #ws-hp-banner:1170-1175 #hp-dmg-row:1176-1185 #hp-dmg-body:1186-1206 #death-saves-section:1207-1238 #hp-armor-body:1239-1280 #hp-hd-body:1281-1294 #hp-rest-body:1295-1322  
#class-dev-section:1323-1325 #cd-head:1326-1326 #cd-res:1327-1327 #cd-attn:1328-1329 #cd-about:1330-1338 #ac-formula:1339-1340 #ac-modifiers:1341-1348 #conditions-grid:1349-1356  
#effects-grid:1357-1364 #resistances-container:1365-1373 #prof-card:1374-1377 #armor-prof-container:1378-1381 #weapon-prof-container:1382-1385 #tools-container:1386-1389 #languages-container:1390-1397 #companions-list-sheet:1398-1410  
#tab-progress:1411-1412 #pg-body:1413-1414 #tab-spells:1415-1417 #spell-stat-card:1418-1439 #spell-mod-display:1440-1445 #spell-dc-display:1446-1451 #spell-attack-display:1452-1457 #spell-stats-by-class:1458-1469  
#spell-slots-card:1470-1475 #spell-slots-visual:1476-1482 #concentration-block:1483-1500 #rd-find-spl-wrap:1501-1501 #prep-counter:1502-1502 #my-spells-list:1503-1504 #rd-slot-strip:1505-1506 #tab-inventory:1507-1510  
#rd-find-inv-wrap:1511-1527 #weight-fill:1528-1562 #inventory-list:1563-1567 #inv-coins-card:1568-1572 #rd-exch:1573-1583 #inv-pouches:1584-1639 #tab-notes:1640-1666 #notes-subtabs:1667-1668  
#notes-main:1669-1670 #taken-feats-section:1671-1675 #taken-feats-list:1676-1679 #tab-party:1680-1688 #my-char-card:1689-1703 #allies-list:1704-1719 #npcs-list:1720-1736 #monsters-list:1737-1748  
#companions-list-world:1749-1759 #tab-battle:1760-1765 #weapons-list:1766-1768 #ws-card:1769-1771 #saved-roll-form:1772-1778 #saved-roll-err:1779-1780 #saved-rolls-list:1781-1784 #battle-res-card:1785-1786  
#battle-res-rows:1787-1788 #battle-setup-screen:1789-1799 #battle-setup-list:1800-1800 #battle-difficulty:1801-1804 #battle-tracker-screen:1805-1809 #battle-turn-info:1810-1815 #battle-repeat-strip:1816-1816 #battle-tracker-list:1817-1826  
#tab-journal:1827-1841 #journal-list:1842-1848 #screen-itemref:1849-1851 #item-ref-tabs:1852-1857 #item-ref-weight:1858-1896 #item-ref-slots:1897-1928 #screen-dmref:1929-1931 #dm-ref-tabs:1932-1936  
#dm-ref-ed:1937-1937 #dm-ref-cond:1938-1938 #dm-ref-combat:1939-1939 #dm-ref-world:1940-1944 #screen-help:1945-1967 #help-about:1968-1991 #help-start:1992-2016 #help-sheet:2017-2040  
#help-progress:2041-2086 #help-spells:2087-2103 #help-inventory:2104-2116 #help-battle:2117-2141 #help-party:2142-2158 #help-notes:2159-2167 #help-journal:2168-2176 #help-planes:2177-2204  
#help-dice:2205-2216 #help-edition2024:2217-2256 #help-data:2257-2273 #help-marks:2274-2296 #conc-details-modal:2297-2307 #conc-detail-duration-row:2308-2315 #conc-detail-desc-row:2316-2325 #add-journal-modal:2326-2349  
#add-npc-modal:2350-2379 #add-ally-modal:2380-2416 #screen-monsters:2417-2429 #srd-monster-count:2430-2430 #srd-monster-results:2431-2435 #srd-npc-modal:2436-2445 #srd-npc-count:2446-2446 #srd-npc-results:2447-2454  
#screen-monsterform:2455-2492 #monster-cr-note:2493-2495 #monster-stats:2496-2497 #monster-saves:2498-2499 #monster-attacks:2500-2523 #screen-rest:2524-2526 #rest-main-screen:2527-2533 #rest-info-screen:2534-2538  
#hit-dice-section:2539-2540 #hit-dice-controls-total:2541-2545 #hit-dice-by-size:2546-2550 #rest-food-section:2551-2559 #rest-result-screen:2560-2562 #rest-result-details:2563-2571 #screen-levelup:2572-2576 #lu-screen-multiclass:2577-2578  
#lu-mc-current-classes:2579-2581 #lu-mc-new-class:2582-2586 #lu-mc-prereq-warn:2587-2587 #lu-mc-subclass-row:2588-2596 #lu-screen-preview:2597-2629 #lu-slots-card:2630-2631 #lu-slots-info:2632-2635 #lu-build-hint:2636-2636  
#lu-features-container:2637-2645 #lu-screen-choices:2646-2647 #lu-choices-body:2648-2654 #lu-screen-result:2655-2656 #lu-result-title:2657-2657 #lu-result-body:2658-2664 #screen-wildshape:2665-2670 #ws-limits:2671-2671  
#ws-results:2672-2675 #screen-hphistory:2676-2678 #hp-history-list:2679-2684 #asi-modal:2685-2689 #asi-build-hint:2690-2704 #asi-feat-list:2705-2705 #asi-stat-grid:2706-2706 #asi-preview:2707-2715  
#class-choice-modal:2716-2731 #dice-modal:2732-2764 #dice-file-hint:2765-2765 #dice3d-result:2766-2777 #dice-result-display:2778-2791 #dice-pick-hint:2792-2792 #dice-mode-segment:2793-2797 #dice-formula-panel:2798-2815  
#dice-fan:2816-2824 #dice-popover-settings:2825-2872 #dice-popover-history:2873-2884 #dice-history:2885-2893 #screen-spellsearch:2894-2896 #spell-feat-bar:2897-2912 #spell-ver-filter:2913-2919 #spell-class-filter:2920-2951  
#class-filter-legend:2952-2953 #spell-search-count:2954-2955 #spell-search-results:2956-2959 #cast-spell-modal:2960-2964 #cast-spell-options:2965-2967 #add-spell-modal:2968-3011 #new-spell-class-chips:3012-3057 #new-spell-mech-fields:3058-3062  
#new-spell-mech-dmg-row:3063-3082 #new-spell-mech-half-row:3083-3085 #new-spell-mech-mod-row:3086-3096 #item-modal:3097-3141 #item-armor-fields:3142-3167 #coin-exchange-modal:3168-3206 #exch-preview:3207-3213 #screen-magiccatalog:3214-3241  
#magic-catalog-count:3242-3242 #magic-catalog-list:3243-3246 #screen-gearcatalog:3247-3251 #gear-packs-list:3252-3265 #gear-catalog-count:3266-3266 #gear-catalog-list:3267-3271 #weapon-modal:3272-3275 #weapon-picker-section:3276-3278  
#weapon-filter-chips:3279-3288 #weapon-presets-list:3289-3289 #weapon-pick-bar:3290-3353 #rd-quick-dock:3354-3354 #character-tabs:3355-3373 #quick-roll-strip:3374-3379 #qrs-list:3380-3390 #active-effects-panel:3391-3395  
#aef-list:3396-3402 #hp-toast-container:3403-3405 #add-companion-modal:3406-3422 #companion-familiar-row:3423-3443 #mob-sheet:3444-3447 #mob-sheet-list:3448-3451 #confirm-modal:3452-3465 #avatar-modal:3466-3469  
#avatar-modal-preview:3470-3497 #screen-builds:3498-3525 #bp-list:3526-3530 #screen-buildguide:3531-3533 #bg-body:3534-3538 #screen-buildplan:3539-3541 #bp-plan-body:3542-3546 #screen-abilityinfo:3547-3549  
#ai-body:3550-3554 #screen-abilgen:3555-3557 #ag-body:3558-3562 #screen-books:3563-3565 #books-body:3566-3570 #screen-mclayout:3571-3573 #ml-body:3574-3578 #screen-featureinfo:3579-3581  
#fi-body:3582-3586 #app-log-panel:3587-3606 #app-log-list:3607-3787 #notes-entry-modal:3788-3836  

## Функции по файлам (`имя:строка`)

**rules.js** (1784 строк, 119 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesAuraOfProtection:337 rulesSaveBonus:342 rulesDivineSmiteFormula:350 rulesSkillBonus:357 rulesPassivePerception:372 rulesSpellStats:376 _spellStatMod:401 rulesSpellStatsByClass:409 rulesWeaponMods:427 rulesOffhandDamageMod:443 armorPenalties:452 rulesItemArmor:465 rulesArmorItem:477 rulesAC:488 charCasterLevel:670 classSpellSlotRow:711 getMulticlassSpellSlots:724 rulesRestoreLevelFields:760 rulesApplySpellSlots:779 resolvePactSlots:802 restoreItemCharges:812 rulesHitDieSides:829 rulesShortRest:835 rulesLongRestBlockReason:870 rulesLongRest:883 rulesExhaustionLevel:949 rulesEffectiveHpMax:955 _dsReset:960 _dsCount:961 _dsFill:962 _condAdd:963 _condRemove:964 rulesIsDead:966 rulesIsStable:970 rulesRegainFromZero:975 rulesSetHp:981 rulesDamageAfterDefenses:993 rulesApplyDamage:1005 rulesDeathSaveBlockReason:1042 rulesDeathSave:1049 rulesConditionRollMods:1068 rulesEffectiveSpeed:1085 rulesArmorStealthDisadv:1106 rulesFeatPrereqMissing:1115 rulesFeatStatChoice:1142 rulesFeatStatOptions:1150 rulesFeatSlotCount:1163 rulesFeatSpellFits:1168 rulesFeatSpellCandidates:1179 rulesFeatSpellLabel:1183 rulesFeatSpellProgress:1188 rulesFeatClassOptions:1213 rulesFeatFreeResId:1226 rulesResetFeatFree:1229 concSaveParams:1240 rulesCrToXp:1282 rulesCrToProf:1288 rulesCrValue:1295 rulesWildShapeLimits:1306 rulesPolymorphLimits:1330 rulesCombatWildShapeHeal:1335 rulesBeastAllowed:1340 rulesFormStart:1347 rulesFormOwnHp:1361 rulesFormDamage:1366 rulesFormHeal:1381 rulesEncounterMultiplier:1388 rulesEncounterDifficulty:1397 getCharClassPairs:1421 charEditionMismatch:1435 findLangInCatalog:1443 ensureLanguagesArray:1455 recalcLanguagesFromSources:1471 add:1476 findToolInCatalog:1521 ensureToolsArray:1533 getBackgroundDef:1554 validateBgStatChoice:1590 parseBackgroundToolEntry:1610 recalcToolsFromSources:1625 add:1630 ensureArmorWeaponFields:1695 recalcArmorWeaponFromSources:1708 addArmor:1714 addWeapon:1715 addSpec:1764

**app-core.js** (1863 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:462 screenBack:468 _modalVisible:482 _closeOpenModals:485 headerBack:495 _rdScreenOpen:523 initRdScreens:526 _screenMotionOk:572 _screenGhostDrop:578 _screenGhostStart:590 _screenEnter:608 _purgeDraftChars:619 showScreen:632 updateHeaderTitle:744 syncDrawerHeader:798 switchTab:810 _rdSheetView:848 openDrawer:867 closeDrawer:880 showCharacterNav:892 hideCharacterNav:900 isInteractive:920 currentActiveTab:943 scrolledDown:1008 closeAction:1015 reset:1022 end:1055 createNewCharacter:1075 getClassColor:1097 getClassIcon:1112 getAbilityIcon:1119 getConditionIcon:1134 getConditionChipIcon:1158 getSpellClassIcon:1176 getSchoolSlug:1193 getSchoolIcon:1197 stripLeadingEmoji:1210 formatTimeAgo:1214 setCharSort:1228 setCharSearch:1235 duplicateCharacter:1239 exportOneCharacter:1251 updateCharCounter:1258 onDragStart:1275 onDragOver:1276 onDrop:1277 renderCharacterList:1288 renderCharPlate:1375 deleteCharacter:1438 showConfirmModal:1452 safeSet:1499 safeSetChecked:1503 loadCharacter:1512 showToast:1703 showFieldError:1720 clearFieldError:1742 toastAddAction:1752 emptyStateHtml:1770 openHPHistory:1781 closeHPHistory:1809 updateVersionBlock:1814 forceAppUpdate:1845

**app-migrate.js** (1047 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1039

**app-builds.js** (1757 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1038 _reEscape:1039 _glossEd:1040 _glossBuild:1041 ingest:1043 _glossIndex:1065 glossarizeHtml:1073 _glossPopoverEl:1087 hideGlossPopover:1099 showGlossPopover:1104 _glossBindOnce:1123 openBuildGuide:1154 gx:1177 _list:1178 getBuildLevelRec:1241 getBuildRecChoiceOption:1246 getBuildRecChoiceIds:1254 getBuildRecFeat:1259 getBuildRecAsi:1269 getBuildRecSubclass:1276 parseAsiFromHeadline:1284 _buildFeatNameMap:1298 parseFeatFromHeadline:1340 parseSpellsFromHeadline:1357 getBuildRecSpellObjs:1603 openBuildPlan:1623 _cpSubclassOf:1676 _cpClassSwitch:1687 openClassPlan:1702

**app-io.js** (719 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:103 _normalizeImportedSpell:112 _isValidImportedSpell:123 _collectCharUserSpells:127 _ingestImportedUserSpells:145 _spellBaseById:191 _unpackSpell:199 _countUnresolvedSpells:221 _unresolvedNote:229 _importTooNew:234 _packSpell:243 _packCharForExport:254 _unpackCharSpells:261 _buildCharEnvelope:267 _charExportFileName:282 _downloadText:285 _shareableFile:296 shareOneCharacter:307 copyCharToClipboard:324 pasteCharFromClipboard:337 _extractCharsFromImport:355 _applyFullRestore:367 _warnEditionMix:411 run:412 importData:427 importOneCharacter:486 _importOneCharText:503 _consumeLaunchFiles:584 _importLaunchText:617 exportSpells:624 importSpells:633 exportSessionLog:706

**app-combat.js** (3388 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:786 featHpPerLevel:801 featHpFlat:810 recalculateHP:819 updateChar:874 toggleProficiency:941 calcStats:964 setSpellStat:1035 calcSpellStats:1046 _toggleNonCasterCards:1098 showSpellCasterCards:1109 onRaceChange:1117 renderBooksRow:1247 openMobSheet:1274 closeMobSheet:1281 mobSheetActs:1283 openBooksSheet:1288 toggleCharBook:1298 populateRaceSelect:1315 _speciesEffective:1348 _renderSpeciesBar:1361 _speciesChoiceOptions:1376 toggleSpeciesChoice:1383 syncSpeciesSpells:1397 rollRandomName:1443 pick:1451 build:1452 _raceSkillAllowance:1511 _raceFlexCount:1521 _raceFlexFits:1527 _raceFlexApply:1534 _setExtrasHtml:1544 renderRaceExtras:1553 toggleHalfElfStat:1724 toggleRaceFlexStat:1750 setRaceVariableTrait:1780 _raceSkillSet:1797 _pickHide:1807 _pickExpandBtn:1811 pickExpand:1814 raceLangGoto:1821 toggleRaceSkill:1829 _classSkillList:1858 _skillsFromOtherSources:1871 _skillsByName:1880 _skillTakenElsewhere:1886 _classSkillHeld:1898 _classSkillSync:1904 renderClassSkills:1935 toggleClassSkill:1979 openRaceFeatModal:2007 removeRaceFeat:2027 applyBasicLockUI:2062 _cwEditionBusy:2096 syncCwEdition:2100 setDraftEdition:2112 updateLockButtonState:2122 lockBasicInfo:2160 unlockBasicInfo:2181 isSheetLocked:2211 sheetLockGuard:2217 applySheetLockUI:2223 _creationTodo:2254 add:2258 src:2259 scheduleCreationTodo:2326 renderCreationTodo:2331 creationTodoGo:2356 openLockSheet:2368 _creationUiReset:2381 _isMobSheet:2382 renderIdentitySummary:2383 toggleIdentityMore:2402 renderProfSummary:2406 toggleProfCard:2421 openAcSheet:2427 _mobMarkClamp:2435 init:2444 lockSheet:2465 doLock:2469 unlockSheet:2482 onBackgroundChange:2503 _bgSkillsOf:2548 _bgUncheckOld:2555 _bgCheckSkills:2563 renderBackgroundFeature:2575 _bgStatShort:2620 populateBackgroundSelect:2623 _bgRevertStatChoice:2654 _bgAppliedStat:2667 _bgApplyStat:2672 setBgStatMode:2684 toggleBgStat:2696 _bgAfterStats:2719 _bgRevertFeatEffects:2730 syncOriginFeat:2755 toggleBgCustom:2791 _toggleBgCustom14:2831 toggleBgSkillPick:2878 _renderBgCustom14:2905 giveBackgroundEquipment:2942 renderBackgroundExtras:2987 _armorFromSelect:3095 renderArmorSelect:3107 onArmorPick:3142 onShieldPick:3156 onArmorChange:3175 onManualAC:3204 onManualMaxHP:3211 calcCoinWeight:3234 getActiveConditionsForRender:3248 toggleConditionsPopup:3277 closeConditionsPopup:3289 renderConditionsPopup:3295

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1949 строк, 61 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 _restHasSlots:78 showRestResult:84 adjustHitDice:96 _restHitDiceChosen:108 adjustHitDiceSize:115 updateHitDiceInfo:122 confirmRest:155 openLevelUpModal:247 _showMulticlassScreen:277 luPickAnotherClass:322 openMulticlassNewClass:329 confirmMulticlassNewClass:388 _showLevelUpPreview:399 closeLevelUpModal:574 confirmLevelUp:587 _luShowResult:714 luFinishChoices:745 luRefreshChoices:752 luSetSubclass:759 luApplyFeatById:778 luApplyAsi:824 _luFeatChoiceAt:845 _luChoiceOpensAt:854 _ccDefsFor:859 _luAsiDone:870 luApplyAllRecommendations:875 _luSpellGainParts:997 pluralRu:1002 delta:1006 luBuildChoicesScreen:1024 recBadge:1032 luAddRecommendedSpells:1167 luGoToSpellsTab:1195 openLevelDownConfirm:1207 confirmLevelDown:1252 loadDeathSaves:1285 toggleDeathSave:1329 resetDeathSaves:1346 updateHPDisplay:1359 hpToggleRow:1449 hpSetRowOpen:1458 updateHPSummary:1466 updateHPRows:1530 quickHP:1548 setHPAbsolute:1674 addHPHistory:1699 _hpUndoPrepare:1716 _hpUndoConcSnap:1736 _hpUndoConcRestore:1753 undoHPChange:1776 showHPToast:1806 applyCustomHP:1843 saveTempHP:1860 rollHitDieQuick:1874 renderHitDiceIcons:1906 rollDeathSave:1920

**app-inventory.js** (2409 строк, 131 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:179 toggleInvItem:310 editItemDirect:315 deleteItemDirect:316 updateInventoryWeight:336 countAttuned:371 _hasAttunable:381 toggleAttuned:388 updateAttuneCount:408 adjustItemCharges:419 openItemModal:435 closeItemModal:509 syncItemArmorFields:514 syncWornArmor:526 submitItem:555 openMagicCatalog:627 closeMagicCatalog:644 renderMagicCatalog:649 fillFromMagicItem:681 openGearCatalog:734 closeGearCatalog:750 renderGearPacks:755 renderGearCatalog:765 fillFromGearItem:793 addPackToInventory:816 rollTrinket:838 _weaponPresets2024:874 _weaponMasteryGrant:895 getWeaponMasteryLimit:920 weaponMasteryPending:924 canMasterWeapon:929 getWeaponMasteryProp:938 isWeaponMastered:945 toggleWeaponMastery:948 _weaponCatalog:967 renderWeaponPresets:981 filterWeaponPresets:1047 toggleWeaponFilter:1051 fillWeaponPreset:1058 _resetWeaponForm:1076 openWeaponModal:1097 closeWeaponModal:1107 editWeapon:1115 deleteCustomWeapon:1145 _weaponPresetByName:1171 checkWeaponProficiency:1178 submitWeapon:1206 weaponRowTap:1297 renderWeapons:1311 isLightWeapon:1410 toggleTWFStyle:1415 rollTWFAttack:1423 _weaponDamageRoll:1471 rollTWFDamage:1492 _unarmedStrike:1507 _weaponAt:1511 rollWeaponAttack:1515 _attackBonusTail:1576 rollWeaponDamage:1580 _canDivineSmite:1613 openDivineSmite:1617 _divineSmite:1641 removeWeapon:1673 _invDndInit:1707 _invClearIndicators:1736 _invSetIndicator:1745 _invCleanup:1750 _invCancelDrag:1757 _invMoveItem:1765 _invCommitDrop:1782 invDragStart:1803 invDragOver:1813 invDragLeave:1830 invDrop:1834 invDragEnd:1840 invTouchStart:1847 invTouchMove:1863 invTouchEnd:1895 quickSlotsClean:1917 quickSlotIconValid:1934 quickSlotAutoIcon:1940 _qsList:1959 _qsFindItem:1963 _qsFindSpell:1973 _qsResolve:1978 _qsItemQid:1981 _qsQty:1985 quickSlotIndex:1986 quickSlotAdd:1992 quickSlotRemove:2002 quickSlotPrune:2009 _qsBusy:2016 quickSlotConsume:2022 _qsHealFormula:2032 quickSlotUse:2038 quickSlotToggle:2063 _qsBtnHtml:2097 quickSlotIconPickFor:2104 quickSlotIconPick:2111 quickSlotIconClose:2148 quickSlotIconSet:2153 quickSlotIconUpload:2166 quickSlotIconEncode:2182 quickDockEdit:2201 quickDockCancel:2202 quickDockHint:2203 quickDockRemoveAt:2207 quickDockReplaceAt:2215 _qsRefreshCards:2226 renderQuickDock:2231 _rdNorm:2275 _rdMatch:2276 _rdFindRows:2281 byPrefix:2286 rdFindRender:2330 rdFindFocus:2342 rdFindBlur:2352 rdFindKey:2358 _rdReveal:2366 rdFindPick:2371 rdExchPreview:2387 rdExchange:2402

**app-spells.js** (2140 строк, 106 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:124 togglePactSlot:153 adjustPactSlots:164 syncSpellSlotsFromClass:176 updateSpellSlots:185 toggleSpellSlot:196 adjustSpellSlots:207 restoreAllSlots:218 setSpellVersion:229 _syncSpellVersionLock:240 setSpellClass:249 _charSpellClassKey:258 _charMaxCastableLevel:269 _defaultSpellVersion:277 toggleSpellOnlyAdded:283 _renderSpellOnlyAdded:287 openSpellSearch:295 markCharOwnClassFilter:314 closeSpellSearch:343 _featPickCtx:354 featAddFixedSpells:369 openFeatSpellPicker:395 _featPickProgressText:412 _renderFeatPickBar:418 featPickSetClass:439 _featPickCandidates:447 _renderFeatPickList:457 addFeatSpell:488 removeFeatSpell:508 _parseSpellClassList:531 _syncNewSpellClassChips:535 toggleNewSpellClass:542 _fillNewSpellDamageTypes:567 _toggleHidden:574 updateNewSpellMechFields:582 _hbFormulaCheck:597 _collectHbEffect:606 _spellIdArg:644 _findHomebrewSpell:650 openAddSpellForm:658 _syncCustomSpellAcrossChars:737 _purgeCustomSpellFromChars:755 deleteCustomSpell:774 _deleteCustomSpellConfirmed:783 closeAddSpellForm:797 submitNewSpell:801 renderSpellSearch:891 addSpell:964 removeSpell:980 toggleSpellCard:994 renderMySpells:999 _spellActiveBadgeText:1143 _spellActiveBadgeHtml:1147 updateSpellActiveBadges:1150 _prepEntries:1173 _spellPrepEntry:1188 _prepLimit:1193 calcMaxPrepared:1209 _known2014:1216 calcMaxKnownSpells:1230 _knownSpellCount:1236 calcMaxCantrips:1246 isPrepClass:1255 _subclassSpellNames:1261 spellNeedsPrep:1288 _preparedCount:1304 openSpellCardsMenu:1312 isSpellPrepared:1327 toggleSpellPrepared:1337 renderPrepCounter:1363 _castableSlotOptions:1417 _arcanumResId:1438 castSpell:1448 _castSpellWithSlot:1469 _finishCast:1507 applyCastEffects:1553 _applyCastForm:1590 openCastVariantChooser:1603 pickCastVariant:1642 closeCastVariantChooser:1652 _applyCastSummon:1665 _nextCastInstanceId:1699 _replaceCastInstance:1707 _ensureCastInstance:1737 _applyCastDamage:1757 _rollCastDamage:1784 _startCastRepeat:1849 castRepeatDamage:1863 _applyCastDebuff:1888 castSpellAttackMod:1929 castStatMod:1937 _applyCastHeal:1955 _castHealApply:1976 _applyCastTempHp:1982 applyCastTempHp:1999 _applyCastHpMaxBonus:2013 openCastChooser:2033 closeCastChooser:2054 canCastAsRitual:2067 castRitual:2089 cancelRitual:2128

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1528 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:454 notesPickRandomVariant:459 _applyVariantToSection:472 _setSectionText:486 _mdToHtml:501 closeLists:513 _countStats:553 _bindSectionInputs:560 _updateStats:573 _notesHotkeys:582 notesMdInsert:597 wrap:606 linePrefix:613 notesTogglePreview:663 notesUpdateSection:682 _syncTakenFeatsLocation:697 _renderEntriesView:710 _renderEntryCard:765 notesPinDragStart:812 notesPinDragOver:822 notesPinDragLeave:831 notesPinDrop:836 notesPinDragEnd:846 _notesReorderPinned:855 notesSetTagFilter:883 notesJumpToNpc:889 notesOpenEntryModal:917 notesCloseEntryModal:951 _notesRenderModalTags:956 notesAddModalTag:968 notesModalTagKeydown:978 notesRemoveModalTag:982 notesSaveEntryModal:988 notesDeleteEntry:1036 notesTogglePin:1057 _notesLogJournal:1092 notesSearchInput:1118 notesSearchKeydown:1125 _hlText:1143 _renderSearchResults:1153 notesClearSearch:1232 notesToggleMenu:1243 _notesMenuClose:1256 notesMenuAction:1262 _notesCharName:1277 _notesTriggerDownload:1282 notesExportMd:1290 notesExportJson:1335 _notesSanitizeEntry:1347 _notesFileTooBig:1358 notesHandleImportJson:1366 _notesApplyImport:1387 notesHandleImportMd:1427 notesPrint:1463 _notesFlashSaved:1494

**app-ui.js** (1282 строк, 74 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 later:333 onKey:340 checkWhatsNew:350 showWhatsNewModal:362 toggleAccordion:399 initCharResources:419 getResourceMax:428 getCharResourceDefs:448 currentDieSize:478 crRow:490 crRestoreLabel:503 crResourceRow:518 crSlotRecoveryBudget:576 crSlotRecoveryActs:580 recoverSlotByResource:595 crPassiveNotes:620 rollResourceDie:629 crManeuverRows:648 crRowsHtml:665 crSetRows:702 renderClassResources:717 spendResource:735 resetResource:753 toggleResourcePip:763 resourceRollOnSpend:788 resetResourcesByRest:801 getJournal:847 addJournalEntry:852 filterJournal:874 renderJournal:881 deleteJournalEntry:917 openAddJournalEntry:926 closeAddJournalEntry:931 saveJournalEntry:934 getCompanions:954 renderCompanions:959 companionHP:1004 buildFamiliarFormOptions:1017 onCompanionTypeChange:1029 applyFamiliarForm:1037 openAddCompanionModal:1049 summonFamiliar:1066 openPrefilledCompanionModal:1076 openEditCompanionModal:1087 closeAddCompanionModal:1107 saveCompanion:1110 deleteCompanion:1135 switchProfilesTab:1151 clipChangelogText:1166 expandChangelogItem:1177 clCleanText:1189 renderChangelog:1195 openItemRef:1240 closeItemRef:1245 switchItemRef:1250 _syncHeaderHeight:1268

**app-dice.js** (1712 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:539 openDiceRollHistory:544 drawDiceSVG:557 _waitDiceBoxModule:576 _diceLsGet:596 _getAccentColor:604 _getDiceTheme:623 _getDiceThemeColor:630 setDiceTheme:633 _syncDiceThemeButtons:639 _getDiceBg:649 setDiceBg:656 _syncDiceBgButtons:662 _diceDbg:672 _initDiceBox:677 _diceFaceValue:772 animateDice3d:794 animateDice2d:998 buildDie:1024 tick:1092 _applyDiceCritGlow:1115 parseDiceFormula:1136 _formulaCanon:1172 _renderFormulaResult:1184 rollFormula:1220 _rollFormulaFrom:1302 _diceFieldErrOpts:1317 diceFormulaBlur:1323 rollCustomFormula:1333 renderDiceHistory:1336 createParticles:1358 _diceShapeSvg:1392 renderDiceFan:1399 _paintSelectedDie:1418 _diceHeroSvg:1442 _paintDiceMode:1452 selectDie:1467 rollSelectedDie:1486 toggleDiceFormulaPanel:1495 _savedRollFormula:1514 _savedRollsClean:1517 _savedRollNewId:1532 _savedRollLabel:1535 renderSavedRolls:1539 savedRollRoll:1559 savedRollTap:1566 savedRollEdit:1582 savedRollCancel:1599 savedRollSubmit:1604 savedRollDelete:1625 savedRollFromDice:1643 _diceHotkeys:1664

**app-settings.js** (917 строк, 94 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _rdOn:56 _getAccent:58 _applyAccent:65 setAccent:72 _syncAccentButtons:83 _getAutoAccent:113 _accentForClass:126 _applyClassAccent:129 _refreshAccent:132 setAutoAccent:140 _syncAutoAccentToggle:145 getEdition:159 setEdition:167 _syncEditionButtons:176 _getStatsLayout:193 _applyStatsLayout:200 _statsInCards:207 _statsRowTarget:211 _placeStatRows:229 setStatsLayout:245 _syncStatsLayoutButtons:252 _getSheet2Demo:266 _syncSheet2DemoButtons:269 setSheet2Demo:275 _getSheetLock:286 setSheetLock:290 _syncSheetLockButtons:295 _wakeLockSupported:306 _getWakeLockOn:307 _applyWakeLock:311 setWakeLock:326 _syncWakeLockButtons:331 _getHeaderAutohideOn:341 setHeaderAutohide:344 _syncHeaderAutohideButtons:349 _getTrackXpOn:357 _applyTrackXp:360 setTrackXp:363 _syncTrackXpButtons:368 _getAttackDamageOn:389 setAttackDamage:392 _syncAttackDamageButtons:396 isEditionSplit:405 setEditionSplit:408 _syncEditionSplitButtons:413 openBooksScreen:423 _bookRowHtml:427 _renderBooksScreen:437 setBookOn:462 setBooksPreset:468 _afterBooksChange:475 _syncBooksSummary:487 _getStatsCollapsed:501 _applyStatsCollapsed:504 toggleStatsCollapsed:509 _getStoredDensity:523 _getDefaultDensity:531 _getDensity:538 _applyDensity:541 setDensity:545 _syncDensityButtons:551 _onViewportDensityChange:559 _getFontScale:577 _applyFontScale:584 setFontScale:595 _syncFontScaleUi:606 _getGlassAlpha:621 _getGlassBlur:628 _applyGlassAlpha:635 _applyGlassBlur:636 setGlassAlpha:637 setGlassBlur:647 _syncGlassUi:656 _getSpaceMode:705 _applySpaceBg:712 setSpaceMode:727 _syncSpaceButtons:733 _spaceOnScroll:752 _applyDymkaIcons:780 _initAppLinks:793 openSupportLink:825 _isStandalone:837 _isIos:843 _installMode:847 _syncInstallUi:852 installApp:865 openSettingsModal:889 closeSettingsModal:904

**app-asi.js** (840 строк, 39 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:573 removeFeat:620 _agBonus:656 _agPbSpent:666 _agBase:672 _agReady:679 openAbilGen:683 agSetMode:701 agPb:707 _agSwap:717 agStd:724 agPick:730 agRoll:736 _agCtl:749 _agRender:770 agApply:819

**app-progress.js** (896 строк, 50 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:309 _pgNext:325 _pgClassWord:379 _pgAvailableClasses:388 _pgActions:401 _pgBuild:419 openProgressTab:432 openProgress:442 pgTabActive:453 pgRefresh:460 pgSetSubclass:468 pgFocusSubclass:482 pgLevelUp:499 pgLevelDown:504 pgAfterLevelModal:510 pgAddClass:521 renderClassDev:535 _pgSheetAboutRow:554 _pgSubclassRows:572 syncClassFieldUI:598 openFeatureInfo:641 _fiRuleNotes:684 _mlTotal:723 _mlMissing:728 openMcLayout:734 mlSetClass:746 mlLevel:754 mlSetSub:763 mlAdd:768 mlRemove:774 _mlRender:780 _mlPruneAsi:845 mlApply:856

**app-desktop.js** (528 строк, 15 функций)  
syncFromStatusBar:144 syncStrip:203 setRailOpen:214 syncRdToggles:221 _esc:241 _stripEmoji:247 _condIcon:251 setRowExpanded:257 collapseRow:263 renderRrConditions:265 renderRailSlots:311 renderRailConc:353 updateRailHpRow:368 rrApplyHP:383 init:396

**app-help.js** (1169 строк, 54 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:90 setHelpFlag:94 welcomeGoStep:100 showWelcome:110 closeWelcome:117 welcomeContinue:123 welcomeSkipExperienced:129 welcomeBack:135 welcomeFinish:142 dismissWelcome:175 maybeShowWelcome:178 restartOnboarding:183 _tourWide:219 _ensureTourDom:222 _resolveTarget:263 _tourFirstVisible:278 _tourAnyModalVisible:298 _tourModalOpen:304 _tourStartWhenClear:316 startTour:328 startListTour:341 startSheetTour:345 _tourTyping:357 maybeStartSheetTour:362 restartTour:384 startTabTour:409 maybeStartTabTour:427 tourNext:453 tourPrev:458 endTour:464 _showTourStep:474 _setBox:537 _computeTourBoxes:553 snap:555 corner:568 _layoutTourCorners:590 _layoutTour:607 _onTourKey:710 _onTourReflow:716 _bindTourGlobal:720 _unbindTourGlobal:725 _buildListSteps:736 _buildSheetSteps:786 _buildProgressSteps:878 _buildSpellsSteps:936 _buildInventorySteps:973 _buildBattleSteps:1013 _buildNotesSteps:1045 _buildPartySteps:1080 _buildJournalSteps:1138

**app-backup.js** (215 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:179

**app-pdf.js** (1040 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:386 _pdfOrigin2024:416 _pdfAttacks:446 _pdfSpells:483 _pdfInventory:581 _pdfNotes:636 _scLineH:738 _scColor:740 _spellCardList:746 _spellCardBody:759 _spellCardFit:767 _scClip:781 _scWhiteIcon:787 _scCutMarks:809 _scGeom:824 _scDiamond:866 _scDrawCard:871 _spellCardFaces:960

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (8050 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:128 SAVES_DATA:150 CONDITIONS:159 EFFECTS_DATA:182 CLASS_FEATURES:233 SPELL_PREP_CLASSES:483 CANTRIPS_KNOWN_2014:491 SPELLS_KNOWN_2014:499 SPELL_SLOTS_BY_LEVEL:506 CLASS_HIT_DICE:581 SUBCLASSES:587 SOURCE_LABELS:607 SUBCLASS_SOURCE:634 BOOK_CODES:703 _booksOffCache:706 SUBCLASS_LEVEL:747 SUBCLASS_FEATURES:763 WEAPON_PRESETS:1555 ITEM_ICONS:1599 CATEGORY_NAMES:1600 GEAR_PACKS:1609 RACE_DATA:1704 BACKGROUND_SKILLS:2321 BACKGROUND_ALIASES:2400 DEITY_ALIGN_LABELS:2413 DEITIES_DATA:2418 LANGUAGE_CATALOG:2486 RACE_LANGUAGES:2523 CLASS_LANGUAGES:2625 TOOL_CATALOG:2631 RACE_TOOLS:2686 CLASS_TOOLS:2698 SUBCLASS_LANGUAGES:2706 SUBCLASS_TOOLS:2729 RACE_ARMOR:2751 RACE_WEAPONS_SPECIFIC:2757 CLASS_WEAPONS_SPECIFIC:2773 RACE_NAME_POOLS:2786 RACE_NAME_GROUP:2828 SUBCLASS_ARMOR:2843 ARMOR_PRESETS:2874 skills:2891 ABILITY_INFO:2904 CLASS_SKILL_OPTIONS:2944 CLASS_SKILL_COUNT:2959 CLASS_SKILL_MC_COUNT:2960 CLASS_ARMOR_PROFS:2963 CLASS_RESOURCES:2983 ASI_LEVELS:3145 XP_THRESHOLDS:3153 APP_VERSION:3163 APP_VERSION_DATE:3164 APP_TELEGRAM_URL:3170 APP_BOOSTY_URL:3171 FEATS_DATA:3192 APP_CHANGELOG:3514 CASTER_TYPE:7878 THIRD_CASTER_SUBCLASSES:7887 THIRD_CASTER_SLOTS:7894 MULTICLASS_SPELL_SLOTS:7905 MULTICLASS_PREREQUISITES:7930 MULTICLASS_PROFICIENCIES:7948 EDITION_DATA:7977

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (732 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

