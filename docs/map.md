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
| index.html — блоки верхнего уровня (`#id:строки`) | 133–175 |
| Функции по файлам (`имя:строка`) | 176–249 |
| Данные — константы верхнего уровня (`имя:строка`) | 250–266 |


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
| 13287–13618 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13619–13645 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13646–13693 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13694–13776 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13777–14874 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14875–14930 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14931–15023 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 15024–15337 | DISC-1 · Ромб раскрытия |
| 15338–15927 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15928–16033 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 16034–16169 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16170–16404 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16405–16414 | STYLE-8b3-fix: срезанный ромб |
| 16415–16728 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16729–17247 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17248–17282 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17283–17917 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #header-autohide-row:225-241  
#wake-lock-row:242-272 #edition-row:273-295 #install-row:296-306 #welcome-modal:307-311 #welcome-step-1:312-330 #welcome-step-2:331-365 #header-avatar:366-371 #status-bar:372-375  
#status-inspiration:376-376 #status-concentration:377-379 #status-ritual:380-382 #status-conditions-btn:383-395 #screen-home:396-398 #home-art:399-426 #home-sub-new:427-474 #home-install:475-482  
#home-hero:483-483 #home-hero-emblem:484-487 #home-hero-sub:488-488 #home-hero-chips:489-499 #screen-characters:500-539 #char-hero:540-540 #char-hero-emblem:541-544 #char-hero-sub:545-545  
#char-hero-chips:546-546 #char-hero-actions:547-555 #screen-data:556-572 #sync-row:573-573 #storage-status:574-574 #backup-panel:575-579 #backup-list:580-591 #screen-about:592-595  
#app-version-row:596-603 #ptab-info:604-611 #app-links-row:612-616 #ptab-changelog:617-622 #changelog-list:623-629 #screen-character:630-630 #tab-sheet:631-633 #creation-wizard-banner:634-644  
#cw-validation:645-647 #basic-locked-bar:648-657 #creation-todo:658-667 #sheet-avatar:668-680 #char-build-badge-wrap:681-695 #char-class-mc:696-719 #char-subclass-rec:720-720 #char-subclass-mc:721-929  
#char-books:930-934 #race-bonus-display:935-935 #race-extras-panel:936-936 #class-skills-panel:937-938 #background-feature-display:939-940 #bg-extras-panel:941-984 #abilgen-row:985-991 #stats-collapse-btn:992-999  
#abilities-region:1000-1003 #proficiency-bonus-2024:1004-1005 #insp-card-2024:1006-1015 #abil-col-1:1016-1016 #stat-block-str:1017-1018 #mod-str:1019-1025 #abil-save-slot-str:1026-1026 #abil-skills-slot-str:1027-1029  
#stat-block-dex:1030-1031 #mod-dex:1032-1038 #abil-save-slot-dex:1039-1039 #abil-skills-slot-dex:1040-1042 #stat-block-int:1043-1044 #mod-int:1045-1051 #abil-save-slot-int:1052-1052 #abil-skills-slot-int:1053-1056  
#abil-col-2:1057-1057 #stat-block-con:1058-1059 #mod-con:1060-1066 #abil-save-slot-con:1067-1067 #abil-skills-slot-con:1068-1070 #stat-block-wis:1071-1072 #mod-wis:1073-1079 #abil-save-slot-wis:1080-1080  
#abil-skills-slot-wis:1081-1083 #stat-block-cha:1084-1085 #mod-cha:1086-1092 #abil-save-slot-cha:1093-1093 #abil-skills-slot-cha:1094-1107 #saves-grid:1108-1117 #skills-container:1118-1120 #passive-perception:1121-1140  
#ws-hp-banner:1141-1146 #hp-dmg-row:1147-1156 #hp-dmg-body:1157-1177 #death-saves-section:1178-1209 #hp-armor-body:1210-1251 #hp-hd-body:1252-1265 #hp-rest-body:1266-1293 #class-dev-section:1294-1296  
#cd-head:1297-1297 #cd-res:1298-1298 #cd-attn:1299-1300 #cd-about:1301-1309 #ac-formula:1310-1311 #ac-modifiers:1312-1319 #conditions-grid:1320-1327 #effects-grid:1328-1335  
#resistances-container:1336-1344 #prof-card:1345-1348 #armor-prof-container:1349-1352 #weapon-prof-container:1353-1356 #tools-container:1357-1360 #languages-container:1361-1368 #companions-list-sheet:1369-1381 #tab-progress:1382-1383  
#pg-body:1384-1385 #tab-spells:1386-1409 #spell-mod-display:1410-1415 #spell-dc-display:1416-1421 #spell-attack-display:1422-1427 #spell-stats-by-class:1428-1445 #spell-slots-visual:1446-1452 #concentration-block:1453-1470  
#prep-counter:1471-1471 #my-spells-list:1472-1474 #tab-inventory:1475-1494 #weight-fill:1495-1529 #inventory-list:1530-1539 #inv-pouches:1540-1595 #tab-notes:1596-1622 #notes-subtabs:1623-1624  
#notes-main:1625-1626 #taken-feats-section:1627-1631 #taken-feats-list:1632-1635 #tab-party:1636-1644 #my-char-card:1645-1659 #allies-list:1660-1675 #npcs-list:1676-1691 #monsters-list:1692-1703  
#companions-list-world:1704-1714 #tab-battle:1715-1720 #weapons-list:1721-1723 #ws-card:1724-1726 #saved-roll-form:1727-1733 #saved-roll-err:1734-1735 #saved-rolls-list:1736-1739 #battle-res-card:1740-1741  
#battle-res-rows:1742-1743 #battle-setup-screen:1744-1754 #battle-setup-list:1755-1755 #battle-difficulty:1756-1759 #battle-tracker-screen:1760-1764 #battle-turn-info:1765-1770 #battle-repeat-strip:1771-1771 #battle-tracker-list:1772-1781  
#tab-journal:1782-1796 #journal-list:1797-1803 #screen-itemref:1804-1806 #item-ref-tabs:1807-1812 #item-ref-weight:1813-1851 #item-ref-slots:1852-1883 #screen-dmref:1884-1886 #dm-ref-tabs:1887-1891  
#dm-ref-ed:1892-1892 #dm-ref-cond:1893-1893 #dm-ref-combat:1894-1894 #dm-ref-world:1895-1899 #screen-help:1900-1922 #help-about:1923-1946 #help-start:1947-1971 #help-sheet:1972-1995  
#help-progress:1996-2041 #help-spells:2042-2058 #help-inventory:2059-2071 #help-battle:2072-2096 #help-party:2097-2113 #help-notes:2114-2122 #help-journal:2123-2131 #help-planes:2132-2159  
#help-dice:2160-2171 #help-edition2024:2172-2211 #help-data:2212-2228 #help-marks:2229-2251 #conc-details-modal:2252-2262 #conc-detail-duration-row:2263-2270 #conc-detail-desc-row:2271-2280 #add-journal-modal:2281-2304  
#add-npc-modal:2305-2334 #add-ally-modal:2335-2371 #screen-monsters:2372-2384 #srd-monster-count:2385-2385 #srd-monster-results:2386-2390 #srd-npc-modal:2391-2400 #srd-npc-count:2401-2401 #srd-npc-results:2402-2409  
#screen-monsterform:2410-2447 #monster-cr-note:2448-2450 #monster-stats:2451-2452 #monster-saves:2453-2454 #monster-attacks:2455-2478 #screen-rest:2479-2481 #rest-main-screen:2482-2488 #rest-info-screen:2489-2493  
#hit-dice-section:2494-2495 #hit-dice-controls-total:2496-2500 #hit-dice-by-size:2501-2505 #rest-food-section:2506-2514 #rest-result-screen:2515-2517 #rest-result-details:2518-2526 #screen-levelup:2527-2531 #lu-screen-multiclass:2532-2533  
#lu-mc-current-classes:2534-2536 #lu-mc-new-class:2537-2541 #lu-mc-prereq-warn:2542-2542 #lu-mc-subclass-row:2543-2551 #lu-screen-preview:2552-2584 #lu-slots-card:2585-2586 #lu-slots-info:2587-2590 #lu-build-hint:2591-2591  
#lu-features-container:2592-2599 #lu-screen-choices:2600-2601 #lu-choices-body:2602-2608 #lu-screen-result:2609-2610 #lu-result-title:2611-2611 #lu-result-body:2612-2618 #screen-wildshape:2619-2624 #ws-limits:2625-2625  
#ws-results:2626-2629 #screen-hphistory:2630-2632 #hp-history-list:2633-2638 #asi-modal:2639-2643 #asi-build-hint:2644-2658 #asi-feat-list:2659-2659 #asi-stat-grid:2660-2660 #asi-preview:2661-2669  
#class-choice-modal:2670-2685 #dice-modal:2686-2718 #dice-file-hint:2719-2719 #dice3d-result:2720-2731 #dice-result-display:2732-2745 #dice-pick-hint:2746-2746 #dice-mode-segment:2747-2751 #dice-formula-panel:2752-2769  
#dice-fan:2770-2778 #dice-popover-settings:2779-2826 #dice-popover-history:2827-2838 #dice-history:2839-2847 #screen-spellsearch:2848-2850 #spell-feat-bar:2851-2867 #spell-class-filter:2868-2911 #class-filter-legend:2912-2913  
#spell-search-count:2914-2914 #spell-search-results:2915-2918 #cast-spell-modal:2919-2923 #cast-spell-options:2924-2926 #add-spell-modal:2927-2970 #new-spell-class-chips:2971-3016 #new-spell-mech-fields:3017-3021 #new-spell-mech-dmg-row:3022-3041  
#new-spell-mech-half-row:3042-3044 #new-spell-mech-mod-row:3045-3055 #item-modal:3056-3100 #item-armor-fields:3101-3126 #coin-exchange-modal:3127-3165 #exch-preview:3166-3172 #screen-magiccatalog:3173-3200 #magic-catalog-count:3201-3201  
#magic-catalog-list:3202-3205 #screen-gearcatalog:3206-3210 #gear-packs-list:3211-3224 #gear-catalog-count:3225-3225 #gear-catalog-list:3226-3230 #weapon-modal:3231-3234 #weapon-picker-section:3235-3237 #weapon-filter-chips:3238-3247  
#weapon-presets-list:3248-3310 #character-tabs:3311-3322 #quick-roll-strip:3323-3328 #qrs-list:3329-3339 #active-effects-panel:3340-3344 #aef-list:3345-3351 #hp-toast-container:3352-3354 #add-companion-modal:3355-3371  
#companion-familiar-row:3372-3392 #mob-sheet:3393-3396 #mob-sheet-list:3397-3400 #confirm-modal:3401-3414 #avatar-modal:3415-3418 #avatar-modal-preview:3419-3446 #screen-builds:3447-3474 #bp-list:3475-3479  
#screen-buildguide:3480-3482 #bg-body:3483-3487 #screen-buildplan:3488-3490 #bp-plan-body:3491-3495 #screen-abilityinfo:3496-3498 #ai-body:3499-3503 #screen-abilgen:3504-3506 #ag-body:3507-3511  
#screen-books:3512-3514 #books-body:3515-3519 #screen-mclayout:3520-3522 #ml-body:3523-3527 #screen-featureinfo:3528-3530 #fi-body:3531-3535 #app-log-panel:3536-3555 #app-log-list:3556-3735  
#notes-entry-modal:3736-3784  

## Функции по файлам (`имя:строка`)

**rules.js** (1742 строк, 114 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHitDicePool:58 _hdSizesDesc:66 rulesHitDiceSpentBy:72 rulesHitDiceLabel:96 rulesPickHitDice:104 rulesClampHitDice:116 rulesRitualMinutes:128 rulesHitDieHeal:135 rulesSpendHitDice:141 charClassLevel:167 charHasClass:177 charClassLevelOr:187 charAsiSlots:196 charEpicSlots:211 charSubclassPending:229 charXpNext:242 rulesJackOfAllTrades:253 charClassSubclass:258 rulesHasFeat:267 rulesHasFightingStyle:272 rulesHasDraconicResilience:284 rulesHasDazzlingFootwork:289 rulesRemarkableAthlete:294 rulesUntrainedCheckBonus:300 rulesHasExpertise:307 getInitiativeMod:313 rulesSaveBonus:329 rulesSkillBonus:335 rulesPassivePerception:350 rulesSpellStats:354 _spellStatMod:374 rulesSpellStatsByClass:382 rulesWeaponMods:400 rulesOffhandDamageMod:416 armorPenalties:425 rulesItemArmor:438 rulesArmorItem:450 rulesAC:461 charCasterLevel:643 classSpellSlotRow:684 getMulticlassSpellSlots:697 rulesRestoreLevelFields:733 rulesApplySpellSlots:752 resolvePactSlots:775 restoreItemCharges:785 rulesHitDieSides:802 rulesShortRest:808 rulesLongRestBlockReason:843 rulesLongRest:856 rulesExhaustionLevel:922 rulesEffectiveHpMax:928 _dsReset:933 _dsCount:934 _dsFill:935 _condAdd:936 _condRemove:937 rulesIsDead:939 rulesIsStable:943 rulesRegainFromZero:948 rulesSetHp:954 rulesDamageAfterDefenses:966 rulesApplyDamage:978 rulesDeathSaveBlockReason:1015 rulesDeathSave:1022 rulesConditionRollMods:1041 rulesEffectiveSpeed:1058 rulesArmorStealthDisadv:1079 rulesFeatPrereqMissing:1088 rulesFeatStatChoice:1115 rulesFeatStatOptions:1123 rulesFeatSlotCount:1136 rulesFeatSpellFits:1141 rulesFeatSpellCandidates:1152 rulesFeatSpellLabel:1156 rulesFeatSpellProgress:1161 rulesFeatClassOptions:1186 rulesFeatFreeResId:1199 rulesResetFeatFree:1202 concSaveParams:1213 rulesCrToXp:1253 rulesCrToProf:1259 rulesCrValue:1266 rulesWildShapeLimits:1277 rulesBeastAllowed:1300 rulesFormStart:1307 rulesFormOwnHp:1319 rulesFormDamage:1324 rulesFormHeal:1339 rulesEncounterMultiplier:1346 rulesEncounterDifficulty:1355 getCharClassPairs:1379 charEditionMismatch:1393 findLangInCatalog:1401 ensureLanguagesArray:1413 recalcLanguagesFromSources:1429 add:1434 findToolInCatalog:1479 ensureToolsArray:1491 getBackgroundDef:1512 validateBgStatChoice:1548 parseBackgroundToolEntry:1568 recalcToolsFromSources:1583 add:1588 ensureArmorWeaponFields:1653 recalcArmorWeaponFromSources:1666 addArmor:1672 addWeapon:1673 addSpec:1722

**app-core.js** (1630 строк, 76 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 saveToLocal:326 initPersistentStorage:349 _formatStorageBytes:370 updateStorageStatus:378 currentScreenName:439 screenBack:445 _modalVisible:459 _closeOpenModals:462 headerBack:472 _screenMotionOk:505 _screenGhostDrop:511 _screenGhostStart:523 _screenEnter:541 showScreen:550 updateHeaderTitle:652 syncDrawerHeader:706 switchTab:718 openDrawer:748 closeDrawer:761 showCharacterNav:773 hideCharacterNav:781 isInteractive:801 currentActiveTab:824 createNewCharacter:882 getClassColor:903 getClassIcon:918 getAbilityIcon:925 getConditionIcon:940 getConditionChipIcon:964 getSpellClassIcon:982 getSchoolSlug:999 getSchoolIcon:1003 stripLeadingEmoji:1016 formatTimeAgo:1020 setCharSort:1034 setCharSearch:1041 duplicateCharacter:1045 exportOneCharacter:1057 updateCharCounter:1064 onDragStart:1081 onDragOver:1082 onDrop:1083 renderCharacterList:1094 renderCharPlate:1180 deleteCharacter:1239 showConfirmModal:1253 safeSet:1300 safeSetChecked:1304 loadCharacter:1313 showToast:1502 toastAddAction:1519 emptyStateHtml:1537 openHPHistory:1548 closeHPHistory:1576 updateVersionBlock:1581 forceAppUpdate:1612

**app-migrate.js** (1034 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1026

**app-builds.js** (1724 строк, 45 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _stemSet:192 _matchByStems:198 _weaponMatchNames:206 _findWeapon:209 _findArmorPreset:234 applyBuild:248 _applyBuildCore:271 _pick:896 _glossNorm:1005 _reEscape:1006 _glossEd:1007 _glossBuild:1008 ingest:1010 _glossIndex:1032 glossarizeHtml:1040 _glossPopoverEl:1054 hideGlossPopover:1066 showGlossPopover:1071 _glossBindOnce:1090 openBuildGuide:1121 gx:1144 _list:1145 getBuildLevelRec:1208 getBuildRecChoiceOption:1213 getBuildRecChoiceIds:1221 getBuildRecFeat:1226 getBuildRecAsi:1236 getBuildRecSubclass:1243 parseAsiFromHeadline:1251 _buildFeatNameMap:1265 parseFeatFromHeadline:1307 parseSpellsFromHeadline:1324 getBuildRecSpellObjs:1570 openBuildPlan:1590 _cpSubclassOf:1643 _cpClassSwitch:1654 openClassPlan:1669

**app-io.js** (717 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:101 _normalizeImportedSpell:110 _isValidImportedSpell:121 _collectCharUserSpells:125 _ingestImportedUserSpells:143 _spellBaseById:189 _unpackSpell:197 _countUnresolvedSpells:219 _unresolvedNote:227 _importTooNew:232 _packSpell:241 _packCharForExport:252 _unpackCharSpells:259 _buildCharEnvelope:265 _charExportFileName:280 _downloadText:283 _shareableFile:294 shareOneCharacter:305 copyCharToClipboard:322 pasteCharFromClipboard:335 _extractCharsFromImport:353 _applyFullRestore:365 _warnEditionMix:409 run:410 importData:425 importOneCharacter:484 _importOneCharText:501 _consumeLaunchFiles:582 _importLaunchText:615 exportSpells:622 importSpells:631 exportSessionLog:704

**app-combat.js** (3297 строк, 149 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:244 toggleAbilOpen:272 abilityBreakdown:284 openAbilityInfo:312 toggleExpertise:347 loadExpertise:366 updateSkillProfCount:380 updateSkillSources:392 updateClassFeatures:416 calculateAC:431 toggleInspiration:492 updateStatusCounter:505 updateStatusBar:519 updateInspirationLabels:559 updateStatDisplay:576 updateAllStatDisplays:581 adjustStat:585 adjustCoin:608 renderCoinMob:622 openCoinSheet:632 setCoinFromSheet:642 updateCoinTotal:649 openCoinExchange:661 closeCoinExchange:666 previewExchange:670 coinExchangeCalc:698 confirmExchange:703 updateSubclassOptions:726 updateSubclassRecHint:783 featHpPerLevel:798 featHpFlat:807 recalculateHP:816 updateChar:863 toggleProficiency:930 calcStats:953 setSpellStat:1024 calcSpellStats:1035 onRaceChange:1086 renderBooksRow:1216 openMobSheet:1243 closeMobSheet:1250 mobSheetActs:1252 openBooksSheet:1257 toggleCharBook:1267 populateRaceSelect:1284 _speciesEffective:1317 _renderSpeciesBar:1330 _speciesChoiceOptions:1345 toggleSpeciesChoice:1352 syncSpeciesSpells:1366 rollRandomName:1412 pick:1420 build:1421 _raceSkillAllowance:1480 _raceFlexCount:1486 _raceFlexFits:1492 _raceFlexApply:1499 _setExtrasHtml:1509 renderRaceExtras:1518 toggleHalfElfStat:1689 toggleRaceFlexStat:1715 setRaceVariableTrait:1745 _raceSkillSet:1762 _pickHide:1772 _pickExpandBtn:1776 pickExpand:1779 raceLangGoto:1786 toggleRaceSkill:1794 _classSkillList:1823 _skillsFromOtherSources:1836 _skillsByName:1845 _skillTakenElsewhere:1851 _classSkillHeld:1863 _classSkillSync:1869 renderClassSkills:1900 toggleClassSkill:1943 openRaceFeatModal:1971 removeRaceFeat:1991 applyBasicLockUI:2026 updateLockButtonState:2056 lockBasicInfo:2093 unlockBasicInfo:2109 isSheetLocked:2137 sheetLockGuard:2143 applySheetLockUI:2149 _creationTodo:2178 add:2182 src:2183 scheduleCreationTodo:2242 renderCreationTodo:2247 creationTodoGo:2272 openLockSheet:2282 _creationUiReset:2295 _isMobSheet:2296 renderIdentitySummary:2297 toggleIdentityMore:2316 renderProfSummary:2320 toggleProfCard:2335 openAcSheet:2341 _mobMarkClamp:2349 init:2358 lockSheet:2379 doLock:2383 unlockSheet:2396 onBackgroundChange:2417 _bgSkillsOf:2462 _bgUncheckOld:2469 _bgCheckSkills:2477 renderBackgroundFeature:2489 _bgStatShort:2534 populateBackgroundSelect:2537 _bgRevertStatChoice:2568 _bgAppliedStat:2581 _bgApplyStat:2586 setBgStatMode:2598 toggleBgStat:2610 _bgAfterStats:2633 _bgRevertFeatEffects:2644 syncOriginFeat:2669 toggleBgCustom:2705 _toggleBgCustom14:2745 toggleBgSkillPick:2792 _renderBgCustom14:2819 giveBackgroundEquipment:2856 renderBackgroundExtras:2899 _armorFromSelect:3004 renderArmorSelect:3016 onArmorPick:3051 onShieldPick:3065 onArmorChange:3084 onManualAC:3113 onManualMaxHP:3120 calcCoinWeight:3143 getActiveConditionsForRender:3157 toggleConditionsPopup:3186 closeConditionsPopup:3198 renderConditionsPopup:3204

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (350 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:234 _aefRowHtml:249 renderActiveEffectsFab:263 toggleActiveEffectsPanel:283 _aefBindOutside:302 advanceActiveEffects:322 removeActiveEffect:334

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1831 строк, 55 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:145 openLevelUpModal:230 _showMulticlassScreen:252 openMulticlassNewClass:296 confirmMulticlassNewClass:355 _showLevelUpPreview:366 closeLevelUpModal:533 confirmLevelUp:546 _luShowResult:672 luFinishChoices:696 luRefreshChoices:703 luSetSubclass:710 luApplyFeatById:729 luApplyAsi:775 _luFeatChoiceAt:796 _ccDefsFor:804 _luAsiDone:815 luApplyAllRecommendations:820 luBuildChoicesScreen:940 recBadge:948 luAddRecommendedSpells:1080 luGoToSpellsTab:1108 openLevelDownConfirm:1120 confirmLevelDown:1165 loadDeathSaves:1198 toggleDeathSave:1242 resetDeathSaves:1259 updateHPDisplay:1272 hpToggleRow:1354 hpSetRowOpen:1363 updateHPSummary:1371 updateHPRows:1435 quickHP:1453 setHPAbsolute:1568 addHPHistory:1593 _hpUndoPrepare:1610 _hpUndoConcSnap:1630 _hpUndoConcRestore:1647 undoHPChange:1670 showHPToast:1700 applyCustomHP:1725 saveTempHP:1742 rollHitDieQuick:1756 renderHitDiceIcons:1788 rollDeathSave:1802

**app-inventory.js** (1744 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:992 toggleWeaponFilter:996 fillWeaponPreset:1003 _resetWeaponForm:1021 openWeaponModal:1040 closeWeaponModal:1050 editWeapon:1058 deleteCustomWeapon:1088 _weaponPresetByName:1114 checkWeaponProficiency:1121 submitWeapon:1149 weaponRowTap:1240 renderWeapons:1253 isLightWeapon:1332 toggleTWFStyle:1337 rollTWFAttack:1345 _weaponDamageRoll:1393 rollTWFDamage:1414 rollWeaponAttack:1426 rollWeaponDamage:1481 removeWeapon:1510 _invDndInit:1544 _invClearIndicators:1573 _invSetIndicator:1582 _invCleanup:1587 _invCancelDrag:1594 _invMoveItem:1602 _invCommitDrop:1619 invDragStart:1640 invDragOver:1650 invDragLeave:1667 invDrop:1671 invDragEnd:1677 invTouchStart:1684 invTouchMove:1700 invTouchEnd:1732

**app-spells.js** (2065 строк, 100 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:216 setSpellClass:225 _charSpellClassKey:234 _charMaxCastableLevel:245 _defaultSpellVersion:253 openSpellSearch:256 markCharOwnClassFilter:274 closeSpellSearch:304 _featPickCtx:315 featAddFixedSpells:330 openFeatSpellPicker:356 _featPickProgressText:373 _renderFeatPickBar:379 featPickSetClass:398 _featPickCandidates:406 _renderFeatPickList:416 addFeatSpell:447 removeFeatSpell:467 _parseSpellClassList:490 _syncNewSpellClassChips:494 toggleNewSpellClass:501 _fillNewSpellDamageTypes:526 _toggleHidden:533 updateNewSpellMechFields:541 _hbFormulaCheck:556 _collectHbEffect:565 _spellIdArg:603 _findHomebrewSpell:609 openAddSpellForm:617 _syncCustomSpellAcrossChars:696 _purgeCustomSpellFromChars:714 deleteCustomSpell:733 _deleteCustomSpellConfirmed:742 closeAddSpellForm:756 submitNewSpell:760 renderSpellSearch:850 addSpell:919 removeSpell:935 toggleSpellCard:949 renderMySpells:954 _spellActiveBadgeText:1096 _spellActiveBadgeHtml:1100 updateSpellActiveBadges:1103 _prepEntries:1126 _spellPrepEntry:1141 _prepLimit:1146 calcMaxPrepared:1162 _known2014:1169 calcMaxKnownSpells:1183 _knownSpellCount:1189 calcMaxCantrips:1199 isPrepClass:1208 _subclassSpellNames:1214 spellNeedsPrep:1241 _preparedCount:1257 openSpellCardsMenu:1265 isSpellPrepared:1280 toggleSpellPrepared:1290 renderPrepCounter:1316 _castableSlotOptions:1362 _arcanumResId:1383 castSpell:1393 _castSpellWithSlot:1414 _finishCast:1452 applyCastEffects:1498 openCastVariantChooser:1539 pickCastVariant:1578 closeCastVariantChooser:1588 _applyCastSummon:1601 _nextCastInstanceId:1635 _replaceCastInstance:1643 _ensureCastInstance:1673 _applyCastDamage:1693 _rollCastDamage:1709 _startCastRepeat:1774 castRepeatDamage:1788 _applyCastDebuff:1813 castSpellAttackMod:1854 castStatMod:1862 _applyCastHeal:1880 _castHealApply:1901 _applyCastTempHp:1907 applyCastTempHp:1924 _applyCastHpMaxBonus:1938 openCastChooser:1958 closeCastChooser:1979 canCastAsRitual:1992 castRitual:2014 cancelRitual:2053

**app-party.js** (2371 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentSafeIcon:270 _pentNormalize:275 _pentImport:298 openAddAllyModal:339 openEditAllyModal:340 closeAddAllyModal:341 saveAlly:342 deleteAlly:343 setAllyStatus:344 exportAllies:345 importAllies:346 openAddNPCModal:348 openEditNPCModal:349 closeAddNPCModal:350 saveNPC:351 deleteNPC:352 setNPCStatus:353 exportNPCs:354 importNPCs:355 openAddMonsterModal:357 openEditMonsterModal:358 closeAddMonsterModal:359 saveMonster:360 deleteMonster:361 setMonsterStatus:362 exportMonsters:363 importMonsters:364 _monSigned:371 _monFormFill:372 _monFormStat:388 monsterFormRefresh:389 toggleMonsterSave:405 monsterAddAttackRow:406 _monFormRead:418 _monFormApply:432 monsterSaveBonus:443 monsterStatBlockHtml:448 monsterRoll:474 monsterAttackRoll:478 _monCatalog:489 _monCatalogIndex:495 _monCatalogPut:501 deleteCatalogMonster:511 addMonsterFromCatalog:523 _npcAttColor:543 renderNPCs:549 renderMonsters:590 _openSrdMonsterPickerLazy:645 openSrdMonsterPicker:655 openSrdMonsterPickerForBattle:657 _openSrdMonsterPickerCore:662 closeSrdMonsterPicker:705 setSrdMonsterSearch:710 setSrdMonsterCr:711 setSrdMonsterEdition:712 renderSrdMonsterPicker:714 addMonsterFromSRD:784 openSrdNpcPicker:825 _openSrdNpcPickerCore:834 closeSrdNpcPicker:855 setSrdNpcSearch:857 setSrdNpcAtt:858 renderSrdNpcPicker:860 addNpcFromSRD:891 openBattleTab:921 buildBattleSetupList:934 setBattleSearch:954 toggleBattleSection:955 renderBattleSetup:960 battleEncounterInput:1008 renderBattleDifficulty:1028 toggleBattleCheck:1053 battleDragStart:1058 battleDragOver:1059 battleDrop:1060 battleDragEnd:1068 rollInitiativeValue:1073 sortParticipantsByInitiative:1078 _findPartyMonster:1085 _participantCombatMeta:1095 _makeBattleParticipant:1120 _battleParticipantHP:1133 _addSrdMonsterToBattle:1144 _addCatalogMonsterToBattle:1174 _participantStatBlock:1198 startBattle:1206 getParticipantDesc:1228 showTrackerInfo:1251 getSelfStatusFromHP:1295 syncSelfBattleStatus:1312 renderBattleTracker:1322 renderBattleCastPanels:1415 _battleCondList:1457 _battleCondSet:1465 _battleCondMeta:1470 _battleCondDots:1473 openBattleCondPicker:1487 closeBattleCondPicker:1492 _renderBattleCondPicker:1497 toggleBattleCondition:1544 adjustBattleExhaustion:1559 adjustBattleHP:1578 setBattleHP:1592 setBattleHPMax:1618 setBattleInitiative:1629 rerollInitiative:1641 battleRollD20:1653 removeBattleParticipant:1658 setBattleStatus:1676 _battleStatusFromHp:1686 _battleSyncHpStatus:1696 offerCastDamageToBattle:1707 _castDamageTargets:1724 _castDamageAmount:1730 _renderCastDamageModal:1736 setCastDamageHalf:1799 toggleCastDamageTarget:1807 _castDamageHit:1817 applyCastDamageToTarget:1830 applyCastDamageTargets:1840 closeCastDamageModal:1850 _castHealTargets:1859 offerCastHealToBattle:1865 _renderCastHealModal:1873 toggleCastHealTarget:1918 applyCastHealTargets:1925 closeCastHealModal:1947 _castDebuffTargets:1968 offerCastDebuffToBattle:1974 _renderCastDebuffModal:1990 toggleCastDebuffTarget:2046 pickCastDebuffTarget:2056 applyCastDebuffTargets:2065 closeCastDebuffModal:2093 _battleDebuffChips:2102 removeBattleDebuff:2119 removeBattleDebuffsForSpell:2132 clearAllBattleDebuffs:2147 _logTurn:2152 _battleNewRound:2159 nextTurn:2167 _battleEconomyRow:2183 toggleBattleEconomy:2195 resetBattleEconomy:2201 prevTurn:2205 tickCastEffectsRound:2216 endBattle:2244 _dmRefEsc:2318 _dmRefGroup:2322 renderDmRef:2333 t:2337 openDmRef:2353 closeDmRef:2358 switchDmRef:2362

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1191 строк, 67 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:562 crSlotRecoveryActs:566 recoverSlotByResource:581 crRowsHtml:607 crSetRows:643 renderClassResources:658 spendResource:676 resetResource:694 toggleResourcePip:704 resetResourcesByRest:729 getJournal:771 addJournalEntry:776 filterJournal:798 renderJournal:805 deleteJournalEntry:841 openAddJournalEntry:850 closeAddJournalEntry:854 saveJournalEntry:857 getCompanions:877 renderCompanions:882 companionHP:927 buildFamiliarFormOptions:940 onCompanionTypeChange:952 applyFamiliarForm:960 openAddCompanionModal:972 summonFamiliar:988 openPrefilledCompanionModal:998 openEditCompanionModal:1009 closeAddCompanionModal:1028 saveCompanion:1031 deleteCompanion:1056 switchProfilesTab:1072 clipChangelogText:1087 expandChangelogItem:1098 renderChangelog:1104 openItemRef:1149 closeItemRef:1154 switchItemRef:1159 _syncHeaderHeight:1177

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

**app-pdf.js** (1039 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:385 _pdfOrigin2024:415 _pdfAttacks:445 _pdfSpells:482 _pdfInventory:580 _pdfNotes:635 _scLineH:737 _scColor:739 _spellCardList:745 _spellCardBody:758 _spellCardFit:766 _scClip:780 _scWhiteIcon:786 _scCutMarks:808 _scGeom:823 _scDiamond:865 _scDrawCard:870 _spellCardFaces:959

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (7528 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:126 SAVES_DATA:148 CONDITIONS:157 EFFECTS_DATA:180 CLASS_FEATURES:231 SPELL_PREP_CLASSES:481 CANTRIPS_KNOWN_2014:489 SPELLS_KNOWN_2014:497 SPELL_SLOTS_BY_LEVEL:504 CLASS_HIT_DICE:579 SUBCLASSES:585 SOURCE_LABELS:605 SUBCLASS_SOURCE:632 BOOK_CODES:701 _booksOffCache:704 SUBCLASS_LEVEL:745 SUBCLASS_FEATURES:761 WEAPON_PRESETS:1553 ITEM_ICONS:1597 CATEGORY_NAMES:1598 GEAR_PACKS:1607 RACE_DATA:1702 BACKGROUND_SKILLS:2319 BACKGROUND_ALIASES:2398 DEITY_ALIGN_LABELS:2411 DEITIES_DATA:2416 LANGUAGE_CATALOG:2484 RACE_LANGUAGES:2521 CLASS_LANGUAGES:2623 TOOL_CATALOG:2629 RACE_TOOLS:2684 CLASS_TOOLS:2696 SUBCLASS_LANGUAGES:2704 SUBCLASS_TOOLS:2727 RACE_ARMOR:2749 RACE_WEAPONS_SPECIFIC:2755 CLASS_WEAPONS_SPECIFIC:2771 RACE_NAME_POOLS:2784 RACE_NAME_GROUP:2826 SUBCLASS_ARMOR:2841 ARMOR_PRESETS:2872 skills:2889 ABILITY_INFO:2902 CLASS_SKILL_OPTIONS:2942 CLASS_SKILL_COUNT:2957 CLASS_SKILL_MC_COUNT:2958 CLASS_ARMOR_PROFS:2961 CLASS_RESOURCES:2981 ASI_LEVELS:3143 XP_THRESHOLDS:3151 APP_VERSION:3161 APP_VERSION_DATE:3162 APP_TELEGRAM_URL:3168 APP_BOOSTY_URL:3169 FEATS_DATA:3190 APP_CHANGELOG:3512 CASTER_TYPE:7356 THIRD_CASTER_SUBCLASSES:7365 THIRD_CASTER_SLOTS:7372 MULTICLASS_SPELL_SLOTS:7383 MULTICLASS_PREREQUISITES:7408 MULTICLASS_PROFICIENCIES:7426 EDITION_DATA:7455

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (869 строк)  
SPELL_EFFECTS:71

**class-choices.js** (700 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

