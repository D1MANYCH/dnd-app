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

#bgGlass:98-99 #conditions-popup-overlay:100-100 #conditions-popup:101-105 #conditions-popup-list:106-109 #drawer-overlay:110-111 #side-drawer:112-148 #screen-settings:149-244 #header-autohide-row:245-261  
#wake-lock-row:262-292 #edition-row:293-315 #install-row:316-326 #welcome-modal:327-331 #welcome-step-1:332-350 #welcome-step-2:351-385 #header-avatar:386-391 #status-bar:392-395  
#status-inspiration:396-396 #status-concentration:397-399 #status-ritual:400-402 #status-conditions-btn:403-415 #screen-home:416-418 #home-art:419-446 #home-sub-new:447-494 #home-install:495-502  
#home-hero:503-503 #home-hero-emblem:504-507 #home-hero-sub:508-508 #home-hero-chips:509-519 #screen-characters:520-559 #char-hero:560-560 #char-hero-emblem:561-564 #char-hero-sub:565-565  
#char-hero-chips:566-566 #char-hero-actions:567-575 #screen-data:576-592 #sync-row:593-593 #storage-status:594-594 #backup-panel:595-599 #backup-list:600-611 #screen-about:612-615  
#app-version-row:616-623 #ptab-info:624-631 #app-links-row:632-636 #ptab-changelog:637-642 #changelog-list:643-649 #screen-character:650-650 #tab-sheet:651-653 #creation-wizard-banner:654-661  
#cw-edition-row:662-671 #cw-validation:672-674 #basic-locked-bar:675-684 #creation-todo:685-694 #sheet-avatar:695-707 #char-build-badge-wrap:708-722 #char-class-mc:723-746 #char-subclass-rec:747-747  
#char-subclass-mc:748-956 #char-books:957-961 #race-bonus-display:962-962 #race-extras-panel:963-963 #class-skills-panel:964-965 #background-feature-display:966-967 #bg-extras-panel:968-1011 #abilgen-row:1012-1018  
#stats-collapse-btn:1019-1026 #abilities-region:1027-1030 #proficiency-bonus-2024:1031-1032 #insp-card-2024:1033-1042 #abil-col-1:1043-1043 #stat-block-str:1044-1045 #mod-str:1046-1052 #abil-save-slot-str:1053-1053  
#abil-skills-slot-str:1054-1056 #stat-block-dex:1057-1058 #mod-dex:1059-1065 #abil-save-slot-dex:1066-1066 #abil-skills-slot-dex:1067-1069 #stat-block-int:1070-1071 #mod-int:1072-1078 #abil-save-slot-int:1079-1079  
#abil-skills-slot-int:1080-1083 #abil-col-2:1084-1084 #stat-block-con:1085-1086 #mod-con:1087-1093 #abil-save-slot-con:1094-1094 #abil-skills-slot-con:1095-1097 #stat-block-wis:1098-1099 #mod-wis:1100-1106  
#abil-save-slot-wis:1107-1107 #abil-skills-slot-wis:1108-1110 #stat-block-cha:1111-1112 #mod-cha:1113-1119 #abil-save-slot-cha:1120-1120 #abil-skills-slot-cha:1121-1134 #saves-grid:1135-1144 #skills-container:1145-1147  
#passive-perception:1148-1167 #ws-hp-banner:1168-1173 #hp-dmg-row:1174-1183 #hp-dmg-body:1184-1204 #death-saves-section:1205-1236 #hp-armor-body:1237-1278 #hp-hd-body:1279-1292 #hp-rest-body:1293-1320  
#class-dev-section:1321-1323 #cd-head:1324-1324 #cd-res:1325-1325 #cd-attn:1326-1327 #cd-about:1328-1336 #ac-formula:1337-1338 #ac-modifiers:1339-1346 #conditions-grid:1347-1354  
#effects-grid:1355-1362 #resistances-container:1363-1371 #prof-card:1372-1375 #armor-prof-container:1376-1379 #weapon-prof-container:1380-1383 #tools-container:1384-1387 #languages-container:1388-1395 #companions-list-sheet:1396-1408  
#tab-progress:1409-1410 #pg-body:1411-1412 #tab-spells:1413-1415 #spell-stat-card:1416-1437 #spell-mod-display:1438-1443 #spell-dc-display:1444-1449 #spell-attack-display:1450-1455 #spell-stats-by-class:1456-1467  
#spell-slots-card:1468-1473 #spell-slots-visual:1474-1480 #concentration-block:1481-1498 #prep-counter:1499-1499 #my-spells-list:1500-1502 #tab-inventory:1503-1522 #weight-fill:1523-1557 #inventory-list:1558-1567  
#inv-pouches:1568-1623 #tab-notes:1624-1650 #notes-subtabs:1651-1652 #notes-main:1653-1654 #taken-feats-section:1655-1659 #taken-feats-list:1660-1663 #tab-party:1664-1672 #my-char-card:1673-1687  
#allies-list:1688-1703 #npcs-list:1704-1720 #monsters-list:1721-1732 #companions-list-world:1733-1743 #tab-battle:1744-1749 #weapons-list:1750-1752 #ws-card:1753-1755 #saved-roll-form:1756-1762  
#saved-roll-err:1763-1764 #saved-rolls-list:1765-1768 #battle-res-card:1769-1770 #battle-res-rows:1771-1772 #battle-setup-screen:1773-1783 #battle-setup-list:1784-1784 #battle-difficulty:1785-1788 #battle-tracker-screen:1789-1793  
#battle-turn-info:1794-1799 #battle-repeat-strip:1800-1800 #battle-tracker-list:1801-1810 #tab-journal:1811-1825 #journal-list:1826-1832 #screen-itemref:1833-1835 #item-ref-tabs:1836-1841 #item-ref-weight:1842-1880  
#item-ref-slots:1881-1912 #screen-dmref:1913-1915 #dm-ref-tabs:1916-1920 #dm-ref-ed:1921-1921 #dm-ref-cond:1922-1922 #dm-ref-combat:1923-1923 #dm-ref-world:1924-1928 #screen-help:1929-1951  
#help-about:1952-1975 #help-start:1976-2000 #help-sheet:2001-2024 #help-progress:2025-2070 #help-spells:2071-2087 #help-inventory:2088-2100 #help-battle:2101-2125 #help-party:2126-2142  
#help-notes:2143-2151 #help-journal:2152-2160 #help-planes:2161-2188 #help-dice:2189-2200 #help-edition2024:2201-2240 #help-data:2241-2257 #help-marks:2258-2280 #conc-details-modal:2281-2291  
#conc-detail-duration-row:2292-2299 #conc-detail-desc-row:2300-2309 #add-journal-modal:2310-2333 #add-npc-modal:2334-2363 #add-ally-modal:2364-2400 #screen-monsters:2401-2413 #srd-monster-count:2414-2414 #srd-monster-results:2415-2419  
#srd-npc-modal:2420-2429 #srd-npc-count:2430-2430 #srd-npc-results:2431-2438 #screen-monsterform:2439-2476 #monster-cr-note:2477-2479 #monster-stats:2480-2481 #monster-saves:2482-2483 #monster-attacks:2484-2507  
#screen-rest:2508-2510 #rest-main-screen:2511-2517 #rest-info-screen:2518-2522 #hit-dice-section:2523-2524 #hit-dice-controls-total:2525-2529 #hit-dice-by-size:2530-2534 #rest-food-section:2535-2543 #rest-result-screen:2544-2546  
#rest-result-details:2547-2555 #screen-levelup:2556-2560 #lu-screen-multiclass:2561-2562 #lu-mc-current-classes:2563-2565 #lu-mc-new-class:2566-2570 #lu-mc-prereq-warn:2571-2571 #lu-mc-subclass-row:2572-2580 #lu-screen-preview:2581-2613  
#lu-slots-card:2614-2615 #lu-slots-info:2616-2619 #lu-build-hint:2620-2620 #lu-features-container:2621-2629 #lu-screen-choices:2630-2631 #lu-choices-body:2632-2638 #lu-screen-result:2639-2640 #lu-result-title:2641-2641  
#lu-result-body:2642-2648 #screen-wildshape:2649-2654 #ws-limits:2655-2655 #ws-results:2656-2659 #screen-hphistory:2660-2662 #hp-history-list:2663-2668 #asi-modal:2669-2673 #asi-build-hint:2674-2688  
#asi-feat-list:2689-2689 #asi-stat-grid:2690-2690 #asi-preview:2691-2699 #class-choice-modal:2700-2715 #dice-modal:2716-2748 #dice-file-hint:2749-2749 #dice3d-result:2750-2761 #dice-result-display:2762-2775  
#dice-pick-hint:2776-2776 #dice-mode-segment:2777-2781 #dice-formula-panel:2782-2799 #dice-fan:2800-2808 #dice-popover-settings:2809-2856 #dice-popover-history:2857-2868 #dice-history:2869-2877 #screen-spellsearch:2878-2880  
#spell-feat-bar:2881-2896 #spell-ver-filter:2897-2903 #spell-class-filter:2904-2935 #class-filter-legend:2936-2937 #spell-search-count:2938-2939 #spell-search-results:2940-2943 #cast-spell-modal:2944-2948 #cast-spell-options:2949-2951  
#add-spell-modal:2952-2995 #new-spell-class-chips:2996-3041 #new-spell-mech-fields:3042-3046 #new-spell-mech-dmg-row:3047-3066 #new-spell-mech-half-row:3067-3069 #new-spell-mech-mod-row:3070-3080 #item-modal:3081-3125 #item-armor-fields:3126-3151  
#coin-exchange-modal:3152-3190 #exch-preview:3191-3197 #screen-magiccatalog:3198-3225 #magic-catalog-count:3226-3226 #magic-catalog-list:3227-3230 #screen-gearcatalog:3231-3235 #gear-packs-list:3236-3249 #gear-catalog-count:3250-3250  
#gear-catalog-list:3251-3255 #weapon-modal:3256-3259 #weapon-picker-section:3260-3262 #weapon-filter-chips:3263-3272 #weapon-presets-list:3273-3273 #weapon-pick-bar:3274-3336 #character-tabs:3337-3355 #quick-roll-strip:3356-3361  
#qrs-list:3362-3372 #active-effects-panel:3373-3377 #aef-list:3378-3384 #hp-toast-container:3385-3387 #add-companion-modal:3388-3404 #companion-familiar-row:3405-3425 #mob-sheet:3426-3429 #mob-sheet-list:3430-3433  
#confirm-modal:3434-3447 #avatar-modal:3448-3451 #avatar-modal-preview:3452-3479 #screen-builds:3480-3507 #bp-list:3508-3512 #screen-buildguide:3513-3515 #bg-body:3516-3520 #screen-buildplan:3521-3523  
#bp-plan-body:3524-3528 #screen-abilityinfo:3529-3531 #ai-body:3532-3536 #screen-abilgen:3537-3539 #ag-body:3540-3544 #screen-books:3545-3547 #books-body:3548-3552 #screen-mclayout:3553-3555  
#ml-body:3556-3560 #screen-featureinfo:3561-3563 #fi-body:3564-3568 #app-log-panel:3569-3588 #app-log-list:3589-3769 #notes-entry-modal:3770-3818  

## Функции по файлам (`имя:строка`)

**rules.js** (1784 строк, 119 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesAuraOfProtection:337 rulesSaveBonus:342 rulesDivineSmiteFormula:350 rulesSkillBonus:357 rulesPassivePerception:372 rulesSpellStats:376 _spellStatMod:401 rulesSpellStatsByClass:409 rulesWeaponMods:427 rulesOffhandDamageMod:443 armorPenalties:452 rulesItemArmor:465 rulesArmorItem:477 rulesAC:488 charCasterLevel:670 classSpellSlotRow:711 getMulticlassSpellSlots:724 rulesRestoreLevelFields:760 rulesApplySpellSlots:779 resolvePactSlots:802 restoreItemCharges:812 rulesHitDieSides:829 rulesShortRest:835 rulesLongRestBlockReason:870 rulesLongRest:883 rulesExhaustionLevel:949 rulesEffectiveHpMax:955 _dsReset:960 _dsCount:961 _dsFill:962 _condAdd:963 _condRemove:964 rulesIsDead:966 rulesIsStable:970 rulesRegainFromZero:975 rulesSetHp:981 rulesDamageAfterDefenses:993 rulesApplyDamage:1005 rulesDeathSaveBlockReason:1042 rulesDeathSave:1049 rulesConditionRollMods:1068 rulesEffectiveSpeed:1085 rulesArmorStealthDisadv:1106 rulesFeatPrereqMissing:1115 rulesFeatStatChoice:1142 rulesFeatStatOptions:1150 rulesFeatSlotCount:1163 rulesFeatSpellFits:1168 rulesFeatSpellCandidates:1179 rulesFeatSpellLabel:1183 rulesFeatSpellProgress:1188 rulesFeatClassOptions:1213 rulesFeatFreeResId:1226 rulesResetFeatFree:1229 concSaveParams:1240 rulesCrToXp:1282 rulesCrToProf:1288 rulesCrValue:1295 rulesWildShapeLimits:1306 rulesPolymorphLimits:1330 rulesCombatWildShapeHeal:1335 rulesBeastAllowed:1340 rulesFormStart:1347 rulesFormOwnHp:1361 rulesFormDamage:1366 rulesFormHeal:1381 rulesEncounterMultiplier:1388 rulesEncounterDifficulty:1397 getCharClassPairs:1421 charEditionMismatch:1435 findLangInCatalog:1443 ensureLanguagesArray:1455 recalcLanguagesFromSources:1471 add:1476 findToolInCatalog:1521 ensureToolsArray:1533 getBackgroundDef:1554 validateBgStatChoice:1590 parseBackgroundToolEntry:1610 recalcToolsFromSources:1625 add:1630 ensureArmorWeaponFields:1695 recalcArmorWeaponFromSources:1708 addArmor:1714 addWeapon:1715 addSpec:1764

**app-core.js** (1863 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:462 screenBack:468 _modalVisible:482 _closeOpenModals:485 headerBack:495 _rdScreenOpen:523 initRdScreens:526 _screenMotionOk:572 _screenGhostDrop:578 _screenGhostStart:590 _screenEnter:608 _purgeDraftChars:619 showScreen:632 updateHeaderTitle:744 syncDrawerHeader:798 switchTab:810 _rdSheetView:848 openDrawer:867 closeDrawer:880 showCharacterNav:892 hideCharacterNav:900 isInteractive:920 currentActiveTab:943 scrolledDown:1008 closeAction:1015 reset:1022 end:1055 createNewCharacter:1075 getClassColor:1097 getClassIcon:1112 getAbilityIcon:1119 getConditionIcon:1134 getConditionChipIcon:1158 getSpellClassIcon:1176 getSchoolSlug:1193 getSchoolIcon:1197 stripLeadingEmoji:1210 formatTimeAgo:1214 setCharSort:1228 setCharSearch:1235 duplicateCharacter:1239 exportOneCharacter:1251 updateCharCounter:1258 onDragStart:1275 onDragOver:1276 onDrop:1277 renderCharacterList:1288 renderCharPlate:1375 deleteCharacter:1438 showConfirmModal:1452 safeSet:1499 safeSetChecked:1503 loadCharacter:1512 showToast:1703 showFieldError:1720 clearFieldError:1742 toastAddAction:1752 emptyStateHtml:1770 openHPHistory:1781 closeHPHistory:1809 updateVersionBlock:1814 forceAppUpdate:1845

**app-migrate.js** (1042 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1034

**app-builds.js** (1757 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1038 _reEscape:1039 _glossEd:1040 _glossBuild:1041 ingest:1043 _glossIndex:1065 glossarizeHtml:1073 _glossPopoverEl:1087 hideGlossPopover:1099 showGlossPopover:1104 _glossBindOnce:1123 openBuildGuide:1154 gx:1177 _list:1178 getBuildLevelRec:1241 getBuildRecChoiceOption:1246 getBuildRecChoiceIds:1254 getBuildRecFeat:1259 getBuildRecAsi:1269 getBuildRecSubclass:1276 parseAsiFromHeadline:1284 _buildFeatNameMap:1298 parseFeatFromHeadline:1340 parseSpellsFromHeadline:1357 getBuildRecSpellObjs:1603 openBuildPlan:1623 _cpSubclassOf:1676 _cpClassSwitch:1687 openClassPlan:1702

**app-io.js** (717 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:101 _normalizeImportedSpell:110 _isValidImportedSpell:121 _collectCharUserSpells:125 _ingestImportedUserSpells:143 _spellBaseById:189 _unpackSpell:197 _countUnresolvedSpells:219 _unresolvedNote:227 _importTooNew:232 _packSpell:241 _packCharForExport:252 _unpackCharSpells:259 _buildCharEnvelope:265 _charExportFileName:280 _downloadText:283 _shareableFile:294 shareOneCharacter:305 copyCharToClipboard:322 pasteCharFromClipboard:335 _extractCharsFromImport:353 _applyFullRestore:365 _warnEditionMix:409 run:410 importData:425 importOneCharacter:484 _importOneCharText:501 _consumeLaunchFiles:582 _importLaunchText:615 exportSpells:622 importSpells:631 exportSessionLog:704

**app-combat.js** (3382 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:786 featHpPerLevel:801 featHpFlat:810 recalculateHP:819 updateChar:874 toggleProficiency:941 calcStats:964 setSpellStat:1035 calcSpellStats:1046 _toggleNonCasterCards:1098 showSpellCasterCards:1109 onRaceChange:1117 renderBooksRow:1247 openMobSheet:1274 closeMobSheet:1281 mobSheetActs:1283 openBooksSheet:1288 toggleCharBook:1298 populateRaceSelect:1315 _speciesEffective:1348 _renderSpeciesBar:1361 _speciesChoiceOptions:1376 toggleSpeciesChoice:1383 syncSpeciesSpells:1397 rollRandomName:1443 pick:1451 build:1452 _raceSkillAllowance:1511 _raceFlexCount:1521 _raceFlexFits:1527 _raceFlexApply:1534 _setExtrasHtml:1544 renderRaceExtras:1553 toggleHalfElfStat:1724 toggleRaceFlexStat:1750 setRaceVariableTrait:1780 _raceSkillSet:1797 _pickHide:1807 _pickExpandBtn:1811 pickExpand:1814 raceLangGoto:1821 toggleRaceSkill:1829 _classSkillList:1858 _skillsFromOtherSources:1871 _skillsByName:1880 _skillTakenElsewhere:1886 _classSkillHeld:1898 _classSkillSync:1904 renderClassSkills:1935 toggleClassSkill:1979 openRaceFeatModal:2007 removeRaceFeat:2027 applyBasicLockUI:2062 _cwEditionBusy:2093 syncCwEdition:2097 setDraftEdition:2109 updateLockButtonState:2119 lockBasicInfo:2157 unlockBasicInfo:2177 isSheetLocked:2205 sheetLockGuard:2211 applySheetLockUI:2217 _creationTodo:2248 add:2252 src:2253 scheduleCreationTodo:2320 renderCreationTodo:2325 creationTodoGo:2350 openLockSheet:2362 _creationUiReset:2375 _isMobSheet:2376 renderIdentitySummary:2377 toggleIdentityMore:2396 renderProfSummary:2400 toggleProfCard:2415 openAcSheet:2421 _mobMarkClamp:2429 init:2438 lockSheet:2459 doLock:2463 unlockSheet:2476 onBackgroundChange:2497 _bgSkillsOf:2542 _bgUncheckOld:2549 _bgCheckSkills:2557 renderBackgroundFeature:2569 _bgStatShort:2614 populateBackgroundSelect:2617 _bgRevertStatChoice:2648 _bgAppliedStat:2661 _bgApplyStat:2666 setBgStatMode:2678 toggleBgStat:2690 _bgAfterStats:2713 _bgRevertFeatEffects:2724 syncOriginFeat:2749 toggleBgCustom:2785 _toggleBgCustom14:2825 toggleBgSkillPick:2872 _renderBgCustom14:2899 giveBackgroundEquipment:2936 renderBackgroundExtras:2981 _armorFromSelect:3089 renderArmorSelect:3101 onArmorPick:3136 onShieldPick:3150 onArmorChange:3169 onManualAC:3198 onManualMaxHP:3205 calcCoinWeight:3228 getActiveConditionsForRender:3242 toggleConditionsPopup:3271 closeConditionsPopup:3283 renderConditionsPopup:3289

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1949 строк, 61 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 _restHasSlots:78 showRestResult:84 adjustHitDice:96 _restHitDiceChosen:108 adjustHitDiceSize:115 updateHitDiceInfo:122 confirmRest:155 openLevelUpModal:247 _showMulticlassScreen:277 luPickAnotherClass:322 openMulticlassNewClass:329 confirmMulticlassNewClass:388 _showLevelUpPreview:399 closeLevelUpModal:574 confirmLevelUp:587 _luShowResult:714 luFinishChoices:745 luRefreshChoices:752 luSetSubclass:759 luApplyFeatById:778 luApplyAsi:824 _luFeatChoiceAt:845 _luChoiceOpensAt:854 _ccDefsFor:859 _luAsiDone:870 luApplyAllRecommendations:875 _luSpellGainParts:997 pluralRu:1002 delta:1006 luBuildChoicesScreen:1024 recBadge:1032 luAddRecommendedSpells:1167 luGoToSpellsTab:1195 openLevelDownConfirm:1207 confirmLevelDown:1252 loadDeathSaves:1285 toggleDeathSave:1329 resetDeathSaves:1346 updateHPDisplay:1359 hpToggleRow:1449 hpSetRowOpen:1458 updateHPSummary:1466 updateHPRows:1530 quickHP:1548 setHPAbsolute:1674 addHPHistory:1699 _hpUndoPrepare:1716 _hpUndoConcSnap:1736 _hpUndoConcRestore:1753 undoHPChange:1776 showHPToast:1806 applyCustomHP:1843 saveTempHP:1860 rollHitDieQuick:1874 renderHitDiceIcons:1906 rollDeathSave:1920

**app-inventory.js** (1860 строк, 86 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:463 syncItemArmorFields:468 syncWornArmor:480 submitItem:509 openMagicCatalog:580 closeMagicCatalog:597 renderMagicCatalog:602 fillFromMagicItem:634 openGearCatalog:687 closeGearCatalog:703 renderGearPacks:708 renderGearCatalog:718 fillFromGearItem:746 addPackToInventory:769 rollTrinket:791 _weaponPresets2024:827 _weaponMasteryGrant:848 getWeaponMasteryLimit:873 weaponMasteryPending:877 canMasterWeapon:882 getWeaponMasteryProp:891 isWeaponMastered:898 toggleWeaponMastery:901 _weaponCatalog:920 renderWeaponPresets:934 filterWeaponPresets:1000 toggleWeaponFilter:1004 fillWeaponPreset:1011 _resetWeaponForm:1029 openWeaponModal:1050 closeWeaponModal:1060 editWeapon:1068 deleteCustomWeapon:1098 _weaponPresetByName:1124 checkWeaponProficiency:1131 submitWeapon:1159 weaponRowTap:1250 renderWeapons:1264 isLightWeapon:1363 toggleTWFStyle:1368 rollTWFAttack:1376 _weaponDamageRoll:1424 rollTWFDamage:1445 _unarmedStrike:1460 _weaponAt:1464 rollWeaponAttack:1468 _attackBonusTail:1529 rollWeaponDamage:1533 _canDivineSmite:1566 openDivineSmite:1570 _divineSmite:1594 removeWeapon:1626 _invDndInit:1660 _invClearIndicators:1689 _invSetIndicator:1698 _invCleanup:1703 _invCancelDrag:1710 _invMoveItem:1718 _invCommitDrop:1735 invDragStart:1756 invDragOver:1766 invDragLeave:1783 invDrop:1787 invDragEnd:1793 invTouchStart:1800 invTouchMove:1816 invTouchEnd:1848

**app-spells.js** (2088 строк, 103 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:103 adjustPactSlots:114 syncSpellSlotsFromClass:126 updateSpellSlots:135 toggleSpellSlot:146 adjustSpellSlots:157 restoreAllSlots:168 setSpellVersion:179 _syncSpellVersionLock:190 setSpellClass:199 _charSpellClassKey:208 _charMaxCastableLevel:219 _defaultSpellVersion:227 toggleSpellOnlyAdded:233 _renderSpellOnlyAdded:237 openSpellSearch:245 markCharOwnClassFilter:264 closeSpellSearch:293 _featPickCtx:304 featAddFixedSpells:319 openFeatSpellPicker:345 _featPickProgressText:362 _renderFeatPickBar:368 featPickSetClass:389 _featPickCandidates:397 _renderFeatPickList:407 addFeatSpell:438 removeFeatSpell:458 _parseSpellClassList:481 _syncNewSpellClassChips:485 toggleNewSpellClass:492 _fillNewSpellDamageTypes:517 _toggleHidden:524 updateNewSpellMechFields:532 _hbFormulaCheck:547 _collectHbEffect:556 _spellIdArg:594 _findHomebrewSpell:600 openAddSpellForm:608 _syncCustomSpellAcrossChars:687 _purgeCustomSpellFromChars:705 deleteCustomSpell:724 _deleteCustomSpellConfirmed:733 closeAddSpellForm:747 submitNewSpell:751 renderSpellSearch:841 addSpell:914 removeSpell:930 toggleSpellCard:944 renderMySpells:949 _spellActiveBadgeText:1091 _spellActiveBadgeHtml:1095 updateSpellActiveBadges:1098 _prepEntries:1121 _spellPrepEntry:1136 _prepLimit:1141 calcMaxPrepared:1157 _known2014:1164 calcMaxKnownSpells:1178 _knownSpellCount:1184 calcMaxCantrips:1194 isPrepClass:1203 _subclassSpellNames:1209 spellNeedsPrep:1236 _preparedCount:1252 openSpellCardsMenu:1260 isSpellPrepared:1275 toggleSpellPrepared:1285 renderPrepCounter:1311 _castableSlotOptions:1365 _arcanumResId:1386 castSpell:1396 _castSpellWithSlot:1417 _finishCast:1455 applyCastEffects:1501 _applyCastForm:1538 openCastVariantChooser:1551 pickCastVariant:1590 closeCastVariantChooser:1600 _applyCastSummon:1613 _nextCastInstanceId:1647 _replaceCastInstance:1655 _ensureCastInstance:1685 _applyCastDamage:1705 _rollCastDamage:1732 _startCastRepeat:1797 castRepeatDamage:1811 _applyCastDebuff:1836 castSpellAttackMod:1877 castStatMod:1885 _applyCastHeal:1903 _castHealApply:1924 _applyCastTempHp:1930 applyCastTempHp:1947 _applyCastHpMaxBonus:1961 openCastChooser:1981 closeCastChooser:2002 canCastAsRitual:2015 castRitual:2037 cancelRitual:2076

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

**data.js** (7937 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:127 SAVES_DATA:149 CONDITIONS:158 EFFECTS_DATA:181 CLASS_FEATURES:232 SPELL_PREP_CLASSES:482 CANTRIPS_KNOWN_2014:490 SPELLS_KNOWN_2014:498 SPELL_SLOTS_BY_LEVEL:505 CLASS_HIT_DICE:580 SUBCLASSES:586 SOURCE_LABELS:606 SUBCLASS_SOURCE:633 BOOK_CODES:702 _booksOffCache:705 SUBCLASS_LEVEL:746 SUBCLASS_FEATURES:762 WEAPON_PRESETS:1554 ITEM_ICONS:1598 CATEGORY_NAMES:1599 GEAR_PACKS:1608 RACE_DATA:1703 BACKGROUND_SKILLS:2320 BACKGROUND_ALIASES:2399 DEITY_ALIGN_LABELS:2412 DEITIES_DATA:2417 LANGUAGE_CATALOG:2485 RACE_LANGUAGES:2522 CLASS_LANGUAGES:2624 TOOL_CATALOG:2630 RACE_TOOLS:2685 CLASS_TOOLS:2697 SUBCLASS_LANGUAGES:2705 SUBCLASS_TOOLS:2728 RACE_ARMOR:2750 RACE_WEAPONS_SPECIFIC:2756 CLASS_WEAPONS_SPECIFIC:2772 RACE_NAME_POOLS:2785 RACE_NAME_GROUP:2827 SUBCLASS_ARMOR:2842 ARMOR_PRESETS:2873 skills:2890 ABILITY_INFO:2903 CLASS_SKILL_OPTIONS:2943 CLASS_SKILL_COUNT:2958 CLASS_SKILL_MC_COUNT:2959 CLASS_ARMOR_PROFS:2962 CLASS_RESOURCES:2982 ASI_LEVELS:3144 XP_THRESHOLDS:3152 APP_VERSION:3162 APP_VERSION_DATE:3163 APP_TELEGRAM_URL:3169 APP_BOOSTY_URL:3170 FEATS_DATA:3191 APP_CHANGELOG:3513 CASTER_TYPE:7765 THIRD_CASTER_SUBCLASSES:7774 THIRD_CASTER_SLOTS:7781 MULTICLASS_SPELL_SLOTS:7792 MULTICLASS_PREREQUISITES:7817 MULTICLASS_PROFICIENCIES:7835 EDITION_DATA:7864

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (732 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

