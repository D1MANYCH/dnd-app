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
| 14–155 | Design tokens (R1) |
| 156–158 | Алиасы старых переменных (совместимость) |
| 159–169 | THEME-4: компонентные токены базового хрома |
| 170–176 | THEME-5: компонентные токены фичевых зон (партия B) |
| 177–249 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 250–294 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 295–419 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 420–516 | UI-2. Пресеты акцента (8 цветов) |
| 517–667 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 668–1012 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1013–1018 | R2. Базовые компоненты |
| 1019–1146 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1147–1292 | UI-3. Desktop/tablet layout (≥1024px) |
| 1293–1479 | UI5-4: ПК — многоколоночная раскладка листа |
| 1480–1562 | /R2 |
| 1563–1730 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 1731–1952 | HEADER (R5: back + name + hamburger) |
| 1953–2015 | КД АВТО-РАСЧЁТ |
| 2016–2079 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2080–2142 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2143–2297 | УСЛОВИЯ |
| 2298–2439 | СПАСБРОСКИ |
| 2440–2567 | CLASS FEATURES |
| 2568–2607 | УБИРАЕМ СТРЕЛКИ |
| 2608–2713 | TAB NAV — 5 tabs + centered FAB dice |
| 2714–2822 | UX-5: лента последних бросков вне модалки |
| 2823–2959 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 2960–2979 | HAMBURGER BUTTON |
| 2980–3022 | SIDE DRAWER |
| 3023–3418 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3419–3466 | MENU-8/9: встречающий экран во всё окно. |
| 3467–3559 | MENU-2: плашка последнего героя. |
| 3560–3736 | MENU-3: меню приключения. |
| 3737–3806 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 3807–3807 | INVENTORY |
| 3808–3838 | INVENTORY — WEIGHT BAR |
| 3839–3861 | INVENTORY — BACKPACK HEADER |
| 3862–3902 | INVENTORY — FILTERS |
| 3903–4055 | INVENTORY — ITEM CARDS |
| 4056–4371 | COINS — BIG NUMBER CARD GRID |
| 4372–4673 | MODALS |
| 4674–4682 | DICE |
| 4683–5181 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5182–5913 | OTHER STYLES |
| 5914–5984 | HP DISPLAY BLOCK |
| 5985–6009 | MOBILE OPTIMIZATION |
| 6010–6138 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6139–6177 | HP TOAST (snackbar) |
| 6178–6211 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 6212–6268 | Confirm Modal |
| 6269–6645 | ⚔️ ОТРЯД & БОЙ |
| 6646–6873 | RACIAL BONUS BAR |
| 6874–7016 | COMPACT STATS GRID |
| 7017–7268 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 7269–7321 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 7322–7369 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 7370–7472 | COMPACT SKILLS |
| 7473–7515 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 7516–7587 | ACCORDION |
| 7588–7594 | CLASS RESOURCES |
| 7595–7691 | ASI MODAL |
| 7692–7859 | APP VERSION |
| 7860–7869 | COMPANIONS |
| 7870–7909 | FEATS LIST IN ASI |
| 7910–8155 | PROFILES TABS (Чейнджлог) |
| 8156–8231 | TAKEN FEATS |
| 8232–8424 | SW UPDATE MODAL |
| 8425–8472 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8473–8640 | INVENTORY SLOTS SYSTEM |
| 8641–8840 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 8841–9046 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9047–9195 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9196–9265 | 3D DICE CUBE |
| 9266–9608 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9609–9682 | DESKTOP LAYOUT — centered max-width |
| 9683–9706 | INSPIRATION |
| 9707–9746 | CONCENTRATION |
| 9747–10264 | WEAPON CARDS WITH ROLL BUTTONS |
| 10265–10359 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10360–10420 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10421–10442 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10443–10555 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10556–10583 | R6: Ассеты (декор) |
| 10584–11450 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11451–11534 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11535–11543 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11544–11601 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11602–11918 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 11919–11945 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 11946–11972 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 11973–12055 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12056–13053 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13054–13109 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13110–13205 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13206–13537 | DISC-1 · Ромб раскрытия |
| 13538–14072 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14073–14178 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14179–14304 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14305–14505 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14506–14514 | STYLE-8b3-fix: срезанный ромб |
| 14515–14782 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14783–15243 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15244–15278 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15279–16676 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:91-92 #conditions-popup-overlay:93-93 #conditions-popup:94-98 #conditions-popup-list:99-102 #drawer-overlay:103-104 #side-drawer:105-142 #screen-settings:143-231 #header-autohide-row:232-248  
#wake-lock-row:249-279 #edition-row:280-302 #install-row:303-313 #welcome-modal:314-318 #welcome-step-1:319-337 #welcome-step-2:338-372 #header-avatar:373-378 #status-bar:379-382  
#status-inspiration:383-383 #status-concentration:384-386 #status-ritual:387-389 #status-conditions-btn:390-403 #screen-home:404-406 #home-art:407-434 #home-sub-new:435-482 #home-install:483-490  
#home-hero:491-491 #home-hero-emblem:492-495 #home-hero-sub:496-496 #home-hero-chips:497-507 #screen-characters:508-547 #char-hero:548-548 #char-hero-emblem:549-552 #char-hero-sub:553-553  
#char-hero-chips:554-554 #char-hero-actions:555-563 #screen-data:564-580 #sync-row:581-581 #storage-status:582-582 #backup-panel:583-587 #backup-list:588-599 #screen-about:600-603  
#app-version-row:604-611 #ptab-info:612-619 #app-links-row:620-624 #ptab-changelog:625-630 #changelog-list:631-637 #screen-character:638-638 #tab-sheet:639-641 #creation-wizard-banner:642-649  
#cw-edition-row:650-659 #cw-validation:660-662 #basic-locked-bar:663-672 #creation-todo:673-682 #sheet-avatar:683-695 #char-build-badge-wrap:696-710 #char-class-mc:711-734 #char-subclass-rec:735-735  
#char-subclass-mc:736-944 #char-books:945-949 #race-bonus-display:950-950 #race-extras-panel:951-951 #class-skills-panel:952-953 #background-feature-display:954-955 #bg-extras-panel:956-999 #abilgen-row:1000-1006  
#stats-collapse-btn:1007-1014 #abilities-region:1015-1018 #proficiency-bonus-2024:1019-1020 #insp-card-2024:1021-1030 #abil-col-1:1031-1031 #stat-block-str:1032-1033 #mod-str:1034-1040 #abil-save-slot-str:1041-1041  
#abil-skills-slot-str:1042-1044 #stat-block-dex:1045-1046 #mod-dex:1047-1053 #abil-save-slot-dex:1054-1054 #abil-skills-slot-dex:1055-1057 #stat-block-int:1058-1059 #mod-int:1060-1066 #abil-save-slot-int:1067-1067  
#abil-skills-slot-int:1068-1071 #abil-col-2:1072-1072 #stat-block-con:1073-1074 #mod-con:1075-1081 #abil-save-slot-con:1082-1082 #abil-skills-slot-con:1083-1085 #stat-block-wis:1086-1087 #mod-wis:1088-1094  
#abil-save-slot-wis:1095-1095 #abil-skills-slot-wis:1096-1098 #stat-block-cha:1099-1100 #mod-cha:1101-1107 #abil-save-slot-cha:1108-1108 #abil-skills-slot-cha:1109-1122 #saves-grid:1123-1132 #skills-container:1133-1135  
#passive-perception:1136-1155 #ws-hp-banner:1156-1161 #hp-dmg-row:1162-1171 #hp-dmg-body:1172-1192 #death-saves-section:1193-1224 #hp-armor-body:1225-1266 #hp-hd-body:1267-1280 #hp-rest-body:1281-1308  
#class-dev-section:1309-1311 #cd-head:1312-1312 #cd-res:1313-1313 #cd-attn:1314-1315 #cd-about:1316-1324 #ac-formula:1325-1326 #ac-modifiers:1327-1334 #conditions-grid:1335-1342  
#effects-grid:1343-1350 #resistances-container:1351-1359 #prof-card:1360-1363 #armor-prof-container:1364-1367 #weapon-prof-container:1368-1371 #tools-container:1372-1375 #languages-container:1376-1383 #companions-list-sheet:1384-1396  
#tab-progress:1397-1398 #pg-body:1399-1400 #tab-spells:1401-1403 #spell-stat-card:1404-1425 #spell-mod-display:1426-1431 #spell-dc-display:1432-1437 #spell-attack-display:1438-1443 #spell-stats-by-class:1444-1455  
#spell-slots-card:1456-1461 #spell-slots-visual:1462-1468 #concentration-block:1469-1486 #rd-find-spl-wrap:1487-1487 #prep-counter:1488-1488 #my-spells-list:1489-1490 #rd-slot-strip:1491-1492 #tab-inventory:1493-1496  
#rd-find-inv-wrap:1497-1513 #weight-fill:1514-1548 #inventory-list:1549-1553 #inv-coins-card:1554-1558 #rd-exch:1559-1569 #inv-pouches:1570-1625 #tab-notes:1626-1652 #notes-subtabs:1653-1654  
#notes-main:1655-1656 #taken-feats-section:1657-1661 #taken-feats-list:1662-1665 #tab-party:1666-1674 #my-char-card:1675-1689 #allies-list:1690-1705 #npcs-list:1706-1722 #monsters-list:1723-1734  
#companions-list-world:1735-1745 #tab-battle:1746-1751 #weapons-list:1752-1754 #ws-card:1755-1757 #saved-roll-form:1758-1764 #saved-roll-err:1765-1766 #saved-rolls-list:1767-1770 #battle-res-card:1771-1772  
#battle-res-rows:1773-1774 #battle-setup-screen:1775-1785 #battle-setup-list:1786-1786 #battle-difficulty:1787-1790 #battle-tracker-screen:1791-1795 #battle-turn-info:1796-1801 #battle-repeat-strip:1802-1802 #battle-tracker-list:1803-1812  
#tab-journal:1813-1827 #journal-list:1828-1834 #screen-itemref:1835-1837 #item-ref-tabs:1838-1843 #item-ref-weight:1844-1882 #item-ref-slots:1883-1914 #screen-dmref:1915-1917 #dm-ref-tabs:1918-1922  
#dm-ref-ed:1923-1923 #dm-ref-cond:1924-1924 #dm-ref-combat:1925-1925 #dm-ref-world:1926-1930 #screen-help:1931-1953 #help-about:1954-1977 #help-start:1978-2002 #help-sheet:2003-2026  
#help-progress:2027-2072 #help-spells:2073-2089 #help-inventory:2090-2102 #help-battle:2103-2127 #help-party:2128-2144 #help-notes:2145-2153 #help-journal:2154-2162 #help-planes:2163-2190  
#help-dice:2191-2202 #help-edition2024:2203-2242 #help-data:2243-2259 #help-marks:2260-2282 #conc-details-modal:2283-2293 #conc-detail-duration-row:2294-2301 #conc-detail-desc-row:2302-2311 #add-journal-modal:2312-2335  
#add-npc-modal:2336-2365 #add-ally-modal:2366-2402 #screen-monsters:2403-2415 #srd-monster-count:2416-2416 #srd-monster-results:2417-2421 #srd-npc-modal:2422-2431 #srd-npc-count:2432-2432 #srd-npc-results:2433-2440  
#screen-monsterform:2441-2478 #monster-cr-note:2479-2481 #monster-stats:2482-2483 #monster-saves:2484-2485 #monster-attacks:2486-2509 #screen-rest:2510-2512 #rest-main-screen:2513-2519 #rest-info-screen:2520-2524  
#hit-dice-section:2525-2526 #hit-dice-controls-total:2527-2531 #hit-dice-by-size:2532-2536 #rest-food-section:2537-2545 #rest-result-screen:2546-2548 #rest-result-details:2549-2557 #screen-levelup:2558-2562 #lu-screen-multiclass:2563-2564  
#lu-mc-current-classes:2565-2567 #lu-mc-new-class:2568-2572 #lu-mc-prereq-warn:2573-2573 #lu-mc-subclass-row:2574-2582 #lu-screen-preview:2583-2615 #lu-slots-card:2616-2617 #lu-slots-info:2618-2621 #lu-build-hint:2622-2622  
#lu-features-container:2623-2631 #lu-screen-choices:2632-2633 #lu-choices-body:2634-2640 #lu-screen-result:2641-2642 #lu-result-title:2643-2643 #lu-result-body:2644-2650 #screen-wildshape:2651-2656 #ws-limits:2657-2657  
#ws-results:2658-2661 #screen-hphistory:2662-2664 #hp-history-list:2665-2670 #asi-modal:2671-2675 #asi-build-hint:2676-2690 #asi-feat-list:2691-2691 #asi-stat-grid:2692-2692 #asi-preview:2693-2701  
#class-choice-modal:2702-2717 #dice-modal:2718-2750 #dice-file-hint:2751-2751 #dice3d-result:2752-2763 #dice-result-display:2764-2777 #dice-pick-hint:2778-2778 #dice-mode-segment:2779-2783 #dice-formula-panel:2784-2801  
#dice-fan:2802-2810 #dice-popover-settings:2811-2858 #dice-popover-history:2859-2870 #dice-history:2871-2879 #screen-spellsearch:2880-2882 #spell-feat-bar:2883-2898 #spell-ver-filter:2899-2905 #spell-class-filter:2906-2937  
#class-filter-legend:2938-2939 #spell-search-count:2940-2941 #spell-search-results:2942-2945 #cast-spell-modal:2946-2950 #cast-spell-options:2951-2953 #add-spell-modal:2954-2997 #new-spell-class-chips:2998-3043 #new-spell-mech-fields:3044-3048  
#new-spell-mech-dmg-row:3049-3068 #new-spell-mech-half-row:3069-3071 #new-spell-mech-mod-row:3072-3082 #item-modal:3083-3127 #item-armor-fields:3128-3153 #coin-exchange-modal:3154-3192 #exch-preview:3193-3199 #screen-magiccatalog:3200-3227  
#magic-catalog-count:3228-3228 #magic-catalog-list:3229-3232 #screen-gearcatalog:3233-3237 #gear-packs-list:3238-3251 #gear-catalog-count:3252-3252 #gear-catalog-list:3253-3257 #weapon-modal:3258-3261 #weapon-picker-section:3262-3264  
#weapon-filter-chips:3265-3274 #weapon-presets-list:3275-3275 #weapon-pick-bar:3276-3339 #rd-quick-dock:3340-3340 #character-tabs:3341-3359 #quick-roll-strip:3360-3365 #qrs-list:3366-3376 #active-effects-panel:3377-3381  
#aef-list:3382-3388 #hp-toast-container:3389-3391 #add-companion-modal:3392-3408 #companion-familiar-row:3409-3429 #mob-sheet:3430-3433 #mob-sheet-list:3434-3437 #confirm-modal:3438-3451 #avatar-modal:3452-3455  
#avatar-modal-preview:3456-3483 #screen-builds:3484-3511 #bp-list:3512-3516 #screen-buildguide:3517-3519 #bg-body:3520-3524 #screen-buildplan:3525-3527 #bp-plan-body:3528-3532 #screen-abilityinfo:3533-3535  
#ai-body:3536-3540 #screen-abilgen:3541-3543 #ag-body:3544-3548 #screen-books:3549-3551 #books-body:3552-3556 #screen-mclayout:3557-3559 #ml-body:3560-3564 #screen-featureinfo:3565-3567  
#fi-body:3568-3572 #app-log-panel:3573-3592 #app-log-list:3593-3773 #notes-entry-modal:3774-3822  

## Функции по файлам (`имя:строка`)

**rules.js** (1784 строк, 119 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesAuraOfProtection:337 rulesSaveBonus:342 rulesDivineSmiteFormula:350 rulesSkillBonus:357 rulesPassivePerception:372 rulesSpellStats:376 _spellStatMod:401 rulesSpellStatsByClass:409 rulesWeaponMods:427 rulesOffhandDamageMod:443 armorPenalties:452 rulesItemArmor:465 rulesArmorItem:477 rulesAC:488 charCasterLevel:670 classSpellSlotRow:711 getMulticlassSpellSlots:724 rulesRestoreLevelFields:760 rulesApplySpellSlots:779 resolvePactSlots:802 restoreItemCharges:812 rulesHitDieSides:829 rulesShortRest:835 rulesLongRestBlockReason:870 rulesLongRest:883 rulesExhaustionLevel:949 rulesEffectiveHpMax:955 _dsReset:960 _dsCount:961 _dsFill:962 _condAdd:963 _condRemove:964 rulesIsDead:966 rulesIsStable:970 rulesRegainFromZero:975 rulesSetHp:981 rulesDamageAfterDefenses:993 rulesApplyDamage:1005 rulesDeathSaveBlockReason:1042 rulesDeathSave:1049 rulesConditionRollMods:1068 rulesEffectiveSpeed:1085 rulesArmorStealthDisadv:1106 rulesFeatPrereqMissing:1115 rulesFeatStatChoice:1142 rulesFeatStatOptions:1150 rulesFeatSlotCount:1163 rulesFeatSpellFits:1168 rulesFeatSpellCandidates:1179 rulesFeatSpellLabel:1183 rulesFeatSpellProgress:1188 rulesFeatClassOptions:1213 rulesFeatFreeResId:1226 rulesResetFeatFree:1229 concSaveParams:1240 rulesCrToXp:1282 rulesCrToProf:1288 rulesCrValue:1295 rulesWildShapeLimits:1306 rulesPolymorphLimits:1330 rulesCombatWildShapeHeal:1335 rulesBeastAllowed:1340 rulesFormStart:1347 rulesFormOwnHp:1361 rulesFormDamage:1366 rulesFormHeal:1381 rulesEncounterMultiplier:1388 rulesEncounterDifficulty:1397 getCharClassPairs:1421 charEditionMismatch:1435 findLangInCatalog:1443 ensureLanguagesArray:1455 recalcLanguagesFromSources:1471 add:1476 findToolInCatalog:1521 ensureToolsArray:1533 getBackgroundDef:1554 validateBgStatChoice:1590 parseBackgroundToolEntry:1610 recalcToolsFromSources:1625 add:1630 ensureArmorWeaponFields:1695 recalcArmorWeaponFromSources:1708 addArmor:1714 addWeapon:1715 addSpec:1764

**app-core.js** (1861 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:462 screenBack:468 _modalVisible:482 _closeOpenModals:485 headerBack:495 _rdScreenOpen:523 initRdScreens:526 _screenMotionOk:571 _screenGhostDrop:577 _screenGhostStart:589 _screenEnter:607 _purgeDraftChars:618 showScreen:631 updateHeaderTitle:743 syncDrawerHeader:797 switchTab:809 _rdSheetView:846 openDrawer:865 closeDrawer:878 showCharacterNav:890 hideCharacterNav:898 isInteractive:918 currentActiveTab:941 scrolledDown:1006 closeAction:1013 reset:1020 end:1053 createNewCharacter:1073 getClassColor:1095 getClassIcon:1110 getAbilityIcon:1117 getConditionIcon:1132 getConditionChipIcon:1156 getSpellClassIcon:1174 getSchoolSlug:1191 getSchoolIcon:1195 stripLeadingEmoji:1208 formatTimeAgo:1212 setCharSort:1226 setCharSearch:1233 duplicateCharacter:1237 exportOneCharacter:1249 updateCharCounter:1256 onDragStart:1273 onDragOver:1274 onDrop:1275 renderCharacterList:1286 renderCharPlate:1373 deleteCharacter:1436 showConfirmModal:1450 safeSet:1497 safeSetChecked:1501 loadCharacter:1510 showToast:1701 showFieldError:1718 clearFieldError:1740 toastAddAction:1750 emptyStateHtml:1768 openHPHistory:1779 closeHPHistory:1807 updateVersionBlock:1812 forceAppUpdate:1843

**app-migrate.js** (1047 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1039

**app-builds.js** (1757 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1038 _reEscape:1039 _glossEd:1040 _glossBuild:1041 ingest:1043 _glossIndex:1065 glossarizeHtml:1073 _glossPopoverEl:1087 hideGlossPopover:1099 showGlossPopover:1104 _glossBindOnce:1123 openBuildGuide:1154 gx:1177 _list:1178 getBuildLevelRec:1241 getBuildRecChoiceOption:1246 getBuildRecChoiceIds:1254 getBuildRecFeat:1259 getBuildRecAsi:1269 getBuildRecSubclass:1276 parseAsiFromHeadline:1284 _buildFeatNameMap:1298 parseFeatFromHeadline:1340 parseSpellsFromHeadline:1357 getBuildRecSpellObjs:1603 openBuildPlan:1623 _cpSubclassOf:1676 _cpClassSwitch:1687 openClassPlan:1702

**app-io.js** (719 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:103 _normalizeImportedSpell:112 _isValidImportedSpell:123 _collectCharUserSpells:127 _ingestImportedUserSpells:145 _spellBaseById:191 _unpackSpell:199 _countUnresolvedSpells:221 _unresolvedNote:229 _importTooNew:234 _packSpell:243 _packCharForExport:254 _unpackCharSpells:261 _buildCharEnvelope:267 _charExportFileName:282 _downloadText:285 _shareableFile:296 shareOneCharacter:307 copyCharToClipboard:324 pasteCharFromClipboard:337 _extractCharsFromImport:355 _applyFullRestore:367 _warnEditionMix:411 run:412 importData:427 importOneCharacter:486 _importOneCharText:503 _consumeLaunchFiles:584 _importLaunchText:617 exportSpells:624 importSpells:633 exportSessionLog:706

**app-combat.js** (3387 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:786 featHpPerLevel:801 featHpFlat:810 recalculateHP:819 updateChar:874 toggleProficiency:941 calcStats:964 setSpellStat:1035 calcSpellStats:1046 _toggleNonCasterCards:1098 showSpellCasterCards:1109 onRaceChange:1117 renderBooksRow:1247 openMobSheet:1274 closeMobSheet:1281 mobSheetActs:1283 openBooksSheet:1288 toggleCharBook:1298 populateRaceSelect:1315 _speciesEffective:1348 _renderSpeciesBar:1361 _speciesChoiceOptions:1376 toggleSpeciesChoice:1383 syncSpeciesSpells:1397 rollRandomName:1443 pick:1451 build:1452 _raceSkillAllowance:1511 _raceFlexCount:1521 _raceFlexFits:1527 _raceFlexApply:1534 _setExtrasHtml:1544 renderRaceExtras:1553 toggleHalfElfStat:1724 toggleRaceFlexStat:1750 setRaceVariableTrait:1780 _raceSkillSet:1797 _pickHide:1807 _pickExpandBtn:1811 pickExpand:1814 raceLangGoto:1821 toggleRaceSkill:1829 _classSkillList:1858 _skillsFromOtherSources:1871 _skillsByName:1880 _skillTakenElsewhere:1886 _classSkillHeld:1898 _classSkillSync:1904 renderClassSkills:1935 toggleClassSkill:1979 openRaceFeatModal:2007 removeRaceFeat:2027 applyBasicLockUI:2062 _cwEditionBusy:2096 syncCwEdition:2100 setDraftEdition:2112 updateLockButtonState:2122 lockBasicInfo:2160 unlockBasicInfo:2181 isSheetLocked:2210 sheetLockGuard:2216 applySheetLockUI:2222 _creationTodo:2253 add:2257 src:2258 scheduleCreationTodo:2325 renderCreationTodo:2330 creationTodoGo:2355 openLockSheet:2367 _creationUiReset:2380 _isMobSheet:2381 renderIdentitySummary:2382 toggleIdentityMore:2401 renderProfSummary:2405 toggleProfCard:2420 openAcSheet:2426 _mobMarkClamp:2434 init:2443 lockSheet:2464 doLock:2468 unlockSheet:2481 onBackgroundChange:2502 _bgSkillsOf:2547 _bgUncheckOld:2554 _bgCheckSkills:2562 renderBackgroundFeature:2574 _bgStatShort:2619 populateBackgroundSelect:2622 _bgRevertStatChoice:2653 _bgAppliedStat:2666 _bgApplyStat:2671 setBgStatMode:2683 toggleBgStat:2695 _bgAfterStats:2718 _bgRevertFeatEffects:2729 syncOriginFeat:2754 toggleBgCustom:2790 _toggleBgCustom14:2830 toggleBgSkillPick:2877 _renderBgCustom14:2904 giveBackgroundEquipment:2941 renderBackgroundExtras:2986 _armorFromSelect:3094 renderArmorSelect:3106 onArmorPick:3141 onShieldPick:3155 onArmorChange:3174 onManualAC:3203 onManualMaxHP:3210 calcCoinWeight:3233 getActiveConditionsForRender:3247 toggleConditionsPopup:3276 closeConditionsPopup:3288 renderConditionsPopup:3294

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1930 строк, 61 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 _restHasSlots:78 showRestResult:84 adjustHitDice:96 _restHitDiceChosen:108 adjustHitDiceSize:115 updateHitDiceInfo:122 confirmRest:155 openLevelUpModal:247 _showMulticlassScreen:277 luPickAnotherClass:322 openMulticlassNewClass:329 confirmMulticlassNewClass:388 _showLevelUpPreview:399 closeLevelUpModal:574 confirmLevelUp:587 _luShowResult:714 luFinishChoices:745 luRefreshChoices:752 luSetSubclass:759 luApplyFeatById:778 luApplyAsi:824 _luFeatChoiceAt:845 _luChoiceOpensAt:854 _ccDefsFor:859 _luAsiDone:870 luApplyAllRecommendations:875 _luSpellGainParts:997 pluralRu:1002 delta:1006 luBuildChoicesScreen:1024 recBadge:1032 luAddRecommendedSpells:1167 luGoToSpellsTab:1195 openLevelDownConfirm:1207 confirmLevelDown:1252 loadDeathSaves:1285 toggleDeathSave:1329 resetDeathSaves:1346 updateHPDisplay:1359 hpToggleRow:1449 hpSetRowOpen:1458 updateHPSummary:1466 updateHPRows:1530 quickHP:1548 setHPAbsolute:1674 addHPHistory:1699 _hpUndoPrepare:1716 _hpUndoConcSnap:1736 _hpUndoConcRestore:1753 undoHPChange:1776 showHPToast:1806 applyCustomHP:1824 saveTempHP:1841 rollHitDieQuick:1855 renderHitDiceIcons:1887 rollDeathSave:1901

**app-inventory.js** (2378 строк, 131 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:151 toggleInvItem:279 editItemDirect:284 deleteItemDirect:285 updateInventoryWeight:305 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:377 adjustItemCharges:388 openItemModal:404 closeItemModal:478 syncItemArmorFields:483 syncWornArmor:495 submitItem:524 openMagicCatalog:596 closeMagicCatalog:613 renderMagicCatalog:618 fillFromMagicItem:650 openGearCatalog:703 closeGearCatalog:719 renderGearPacks:724 renderGearCatalog:734 fillFromGearItem:762 addPackToInventory:785 rollTrinket:807 _weaponPresets2024:843 _weaponMasteryGrant:864 getWeaponMasteryLimit:889 weaponMasteryPending:893 canMasterWeapon:898 getWeaponMasteryProp:907 isWeaponMastered:914 toggleWeaponMastery:917 _weaponCatalog:936 renderWeaponPresets:950 filterWeaponPresets:1016 toggleWeaponFilter:1020 fillWeaponPreset:1027 _resetWeaponForm:1045 openWeaponModal:1066 closeWeaponModal:1076 editWeapon:1084 deleteCustomWeapon:1114 _weaponPresetByName:1140 checkWeaponProficiency:1147 submitWeapon:1175 weaponRowTap:1266 renderWeapons:1280 isLightWeapon:1379 toggleTWFStyle:1384 rollTWFAttack:1392 _weaponDamageRoll:1440 rollTWFDamage:1461 _unarmedStrike:1476 _weaponAt:1480 rollWeaponAttack:1484 _attackBonusTail:1545 rollWeaponDamage:1549 _canDivineSmite:1582 openDivineSmite:1586 _divineSmite:1610 removeWeapon:1642 _invDndInit:1676 _invClearIndicators:1705 _invSetIndicator:1714 _invCleanup:1719 _invCancelDrag:1726 _invMoveItem:1734 _invCommitDrop:1751 invDragStart:1772 invDragOver:1782 invDragLeave:1799 invDrop:1803 invDragEnd:1809 invTouchStart:1816 invTouchMove:1832 invTouchEnd:1864 quickSlotsClean:1886 quickSlotIconValid:1903 quickSlotAutoIcon:1909 _qsList:1928 _qsFindItem:1932 _qsFindSpell:1942 _qsResolve:1947 _qsItemQid:1950 _qsQty:1954 quickSlotIndex:1955 quickSlotAdd:1961 quickSlotRemove:1971 quickSlotPrune:1978 _qsBusy:1985 quickSlotConsume:1991 _qsHealFormula:2001 quickSlotUse:2007 quickSlotToggle:2032 _qsBtnHtml:2066 quickSlotIconPickFor:2073 quickSlotIconPick:2080 quickSlotIconClose:2117 quickSlotIconSet:2122 quickSlotIconUpload:2135 quickSlotIconEncode:2151 quickDockEdit:2170 quickDockCancel:2171 quickDockHint:2172 quickDockRemoveAt:2176 quickDockReplaceAt:2184 _qsRefreshCards:2195 renderQuickDock:2200 _rdNorm:2244 _rdMatch:2245 _rdFindRows:2250 byPrefix:2255 rdFindRender:2299 rdFindFocus:2311 rdFindBlur:2321 rdFindKey:2327 _rdReveal:2335 rdFindPick:2340 rdExchPreview:2356 rdExchange:2371

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

**app-settings.js** (895 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:112 _accentForClass:124 _applyClassAccent:127 _refreshAccent:130 setAutoAccent:138 _syncAutoAccentToggle:143 getEdition:157 setEdition:165 _syncEditionButtons:174 _getStatsLayout:191 _applyStatsLayout:198 _statsInCards:205 _statsRowTarget:209 _placeStatRows:227 setStatsLayout:243 _syncStatsLayoutButtons:250 _getSheetLock:264 setSheetLock:268 _syncSheetLockButtons:273 _wakeLockSupported:284 _getWakeLockOn:285 _applyWakeLock:289 setWakeLock:304 _syncWakeLockButtons:309 _getHeaderAutohideOn:319 setHeaderAutohide:322 _syncHeaderAutohideButtons:327 _getTrackXpOn:335 _applyTrackXp:338 setTrackXp:341 _syncTrackXpButtons:346 _getAttackDamageOn:367 setAttackDamage:370 _syncAttackDamageButtons:374 isEditionSplit:383 setEditionSplit:386 _syncEditionSplitButtons:391 openBooksScreen:401 _bookRowHtml:405 _renderBooksScreen:415 setBookOn:440 setBooksPreset:446 _afterBooksChange:453 _syncBooksSummary:465 _getStatsCollapsed:479 _applyStatsCollapsed:482 toggleStatsCollapsed:487 _getStoredDensity:501 _getDefaultDensity:509 _getDensity:516 _applyDensity:519 setDensity:523 _syncDensityButtons:529 _onViewportDensityChange:537 _getFontScale:555 _applyFontScale:562 setFontScale:573 _syncFontScaleUi:584 _getGlassAlpha:599 _getGlassBlur:606 _applyGlassAlpha:613 _applyGlassBlur:614 setGlassAlpha:615 setGlassBlur:625 _syncGlassUi:634 _getSpaceMode:683 _applySpaceBg:690 setSpaceMode:705 _syncSpaceButtons:711 _spaceOnScroll:730 _applyDymkaIcons:758 _initAppLinks:771 openSupportLink:803 _isStandalone:815 _isIos:821 _installMode:825 _syncInstallUi:830 installApp:843 openSettingsModal:867 closeSettingsModal:882

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

**data.js** (8074 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:128 SAVES_DATA:150 CONDITIONS:159 EFFECTS_DATA:182 CLASS_FEATURES:233 SPELL_PREP_CLASSES:483 CANTRIPS_KNOWN_2014:491 SPELLS_KNOWN_2014:499 SPELL_SLOTS_BY_LEVEL:506 CLASS_HIT_DICE:581 SUBCLASSES:587 SOURCE_LABELS:607 SUBCLASS_SOURCE:634 BOOK_CODES:703 _booksOffCache:706 SUBCLASS_LEVEL:747 SUBCLASS_FEATURES:763 WEAPON_PRESETS:1555 ITEM_ICONS:1599 CATEGORY_NAMES:1600 GEAR_PACKS:1609 RACE_DATA:1704 BACKGROUND_SKILLS:2321 BACKGROUND_ALIASES:2400 DEITY_ALIGN_LABELS:2413 DEITIES_DATA:2418 LANGUAGE_CATALOG:2486 RACE_LANGUAGES:2523 CLASS_LANGUAGES:2625 TOOL_CATALOG:2631 RACE_TOOLS:2686 CLASS_TOOLS:2698 SUBCLASS_LANGUAGES:2706 SUBCLASS_TOOLS:2729 RACE_ARMOR:2751 RACE_WEAPONS_SPECIFIC:2757 CLASS_WEAPONS_SPECIFIC:2773 RACE_NAME_POOLS:2786 RACE_NAME_GROUP:2828 SUBCLASS_ARMOR:2843 ARMOR_PRESETS:2874 skills:2891 ABILITY_INFO:2904 CLASS_SKILL_OPTIONS:2944 CLASS_SKILL_COUNT:2959 CLASS_SKILL_MC_COUNT:2960 CLASS_ARMOR_PROFS:2963 CLASS_RESOURCES:2983 ASI_LEVELS:3145 XP_THRESHOLDS:3153 APP_VERSION:3163 APP_VERSION_DATE:3164 APP_TELEGRAM_URL:3170 APP_BOOSTY_URL:3171 FEATS_DATA:3192 APP_CHANGELOG:3514 CASTER_TYPE:7902 THIRD_CASTER_SUBCLASSES:7911 THIRD_CASTER_SLOTS:7918 MULTICLASS_SPELL_SLOTS:7929 MULTICLASS_PREREQUISITES:7954 MULTICLASS_PROFICIENCIES:7972 EDITION_DATA:8001

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (732 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

