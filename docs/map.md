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
| 607–1027 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1028–1368 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1369–1374 | R2. Базовые компоненты |
| 1375–1533 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1534–1798 | UI-3. Desktop/tablet layout (≥1024px) |
| 1799–1909 | UI5-4: ПК — многоколоночная раскладка листа |
| 1910–1986 | /R2 |
| 1987–2160 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2161–2373 | HEADER (R5: back + name + hamburger) |
| 2374–2439 | КД АВТО-РАСЧЁТ |
| 2440–2509 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2510–2575 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2576–2735 | УСЛОВИЯ |
| 2736–2882 | СПАСБРОСКИ |
| 2883–3034 | CLASS FEATURES |
| 3035–3074 | УБИРАЕМ СТРЕЛКИ |
| 3075–3179 | TAB NAV — 5 tabs + centered FAB dice |
| 3180–3302 | UX-5: лента последних бросков вне модалки |
| 3303–3479 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3480–3499 | HAMBURGER BUTTON |
| 3500–3541 | SIDE DRAWER |
| 3542–4045 | STYLE-8L: сайдбар в языке встречающего экрана |
| 4046–4093 | MENU-8/9: встречающий экран во всё окно. |
| 4094–4186 | MENU-2: плашка последнего героя. |
| 4187–4361 | MENU-3: меню приключения. |
| 4362–4432 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4433–4433 | INVENTORY |
| 4434–4464 | INVENTORY — WEIGHT BAR |
| 4465–4501 | INVENTORY — BACKPACK HEADER |
| 4502–4542 | INVENTORY — FILTERS |
| 4543–4731 | INVENTORY — ITEM CARDS |
| 4732–5097 | COINS — BIG NUMBER CARD GRID |
| 5098–5398 | MODALS |
| 5399–5433 | DICE |
| 5434–6014 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 6015–6904 | OTHER STYLES |
| 6905–6973 | HP DISPLAY BLOCK |
| 6974–6999 | MOBILE OPTIMIZATION |
| 7000–7128 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7129–7167 | HP TOAST (snackbar) |
| 7168–7219 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7220–7273 | Confirm Modal |
| 7274–7698 | ⚔️ ОТРЯД & БОЙ |
| 7699–7978 | RACIAL BONUS BAR |
| 7979–8121 | COMPACT STATS GRID |
| 8122–8389 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8390–8442 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8443–8493 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8494–8596 | COMPACT SKILLS |
| 8597–8639 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8640–8711 | ACCORDION |
| 8712–8735 | CLASS RESOURCES |
| 8736–8828 | ASI MODAL |
| 8829–9093 | APP VERSION |
| 9094–9103 | COMPANIONS |
| 9104–9149 | FEATS LIST IN ASI |
| 9150–9396 | PROFILES TABS (Чейнджлог) |
| 9397–9475 | TAKEN FEATS |
| 9476–9672 | SW UPDATE MODAL |
| 9673–9720 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9721–9893 | INVENTORY SLOTS SYSTEM |
| 9894–10093 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 10094–10365 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10366–10538 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10539–10608 | 3D DICE CUBE |
| 10609–10981 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10982–11064 | DESKTOP LAYOUT — centered max-width |
| 11065–11085 | INSPIRATION |
| 11086–11125 | CONCENTRATION |
| 11126–11802 | WEAPON CARDS WITH ROLL BUTTONS |
| 11803–11913 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11914–11976 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11977–12003 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 12004–12127 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12128–12154 | R6: Ассеты (декор) |
| 12155–13126 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13127–13214 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13215–13223 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13224–13293 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13294–13625 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13626–13652 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13653–13700 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13701–13783 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13784–14881 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14882–14937 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14938–15030 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 15031–15344 | DISC-1 · Ромб раскрытия |
| 15345–15934 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15935–16040 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 16041–16176 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16177–16411 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16412–16421 | STYLE-8b3-fix: срезанный ромб |
| 16422–16735 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16736–17254 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17255–17289 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17290–17928 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-231 #header-autohide-row:232-248  
#wake-lock-row:249-279 #edition-row:280-302 #install-row:303-313 #welcome-modal:314-318 #welcome-step-1:319-337 #welcome-step-2:338-372 #header-avatar:373-378 #status-bar:379-382  
#status-inspiration:383-383 #status-concentration:384-386 #status-ritual:387-389 #status-conditions-btn:390-402 #screen-home:403-405 #home-art:406-433 #home-sub-new:434-481 #home-install:482-489  
#home-hero:490-490 #home-hero-emblem:491-494 #home-hero-sub:495-495 #home-hero-chips:496-506 #screen-characters:507-546 #char-hero:547-547 #char-hero-emblem:548-551 #char-hero-sub:552-552  
#char-hero-chips:553-553 #char-hero-actions:554-562 #screen-data:563-579 #sync-row:580-580 #storage-status:581-581 #backup-panel:582-586 #backup-list:587-598 #screen-about:599-602  
#app-version-row:603-610 #ptab-info:611-618 #app-links-row:619-623 #ptab-changelog:624-629 #changelog-list:630-636 #screen-character:637-637 #tab-sheet:638-640 #creation-wizard-banner:641-651  
#cw-validation:652-654 #basic-locked-bar:655-664 #creation-todo:665-674 #sheet-avatar:675-687 #char-build-badge-wrap:688-702 #char-class-mc:703-726 #char-subclass-rec:727-727 #char-subclass-mc:728-936  
#char-books:937-941 #race-bonus-display:942-942 #race-extras-panel:943-943 #class-skills-panel:944-945 #background-feature-display:946-947 #bg-extras-panel:948-991 #abilgen-row:992-998 #stats-collapse-btn:999-1006  
#abilities-region:1007-1010 #proficiency-bonus-2024:1011-1012 #insp-card-2024:1013-1022 #abil-col-1:1023-1023 #stat-block-str:1024-1025 #mod-str:1026-1032 #abil-save-slot-str:1033-1033 #abil-skills-slot-str:1034-1036  
#stat-block-dex:1037-1038 #mod-dex:1039-1045 #abil-save-slot-dex:1046-1046 #abil-skills-slot-dex:1047-1049 #stat-block-int:1050-1051 #mod-int:1052-1058 #abil-save-slot-int:1059-1059 #abil-skills-slot-int:1060-1063  
#abil-col-2:1064-1064 #stat-block-con:1065-1066 #mod-con:1067-1073 #abil-save-slot-con:1074-1074 #abil-skills-slot-con:1075-1077 #stat-block-wis:1078-1079 #mod-wis:1080-1086 #abil-save-slot-wis:1087-1087  
#abil-skills-slot-wis:1088-1090 #stat-block-cha:1091-1092 #mod-cha:1093-1099 #abil-save-slot-cha:1100-1100 #abil-skills-slot-cha:1101-1114 #saves-grid:1115-1124 #skills-container:1125-1127 #passive-perception:1128-1147  
#ws-hp-banner:1148-1153 #hp-dmg-row:1154-1163 #hp-dmg-body:1164-1184 #death-saves-section:1185-1216 #hp-armor-body:1217-1258 #hp-hd-body:1259-1272 #hp-rest-body:1273-1300 #class-dev-section:1301-1303  
#cd-head:1304-1304 #cd-res:1305-1305 #cd-attn:1306-1307 #cd-about:1308-1316 #ac-formula:1317-1318 #ac-modifiers:1319-1326 #conditions-grid:1327-1334 #effects-grid:1335-1342  
#resistances-container:1343-1351 #prof-card:1352-1355 #armor-prof-container:1356-1359 #weapon-prof-container:1360-1363 #tools-container:1364-1367 #languages-container:1368-1375 #companions-list-sheet:1376-1388 #tab-progress:1389-1390  
#pg-body:1391-1392 #tab-spells:1393-1416 #spell-mod-display:1417-1422 #spell-dc-display:1423-1428 #spell-attack-display:1429-1434 #spell-stats-by-class:1435-1452 #spell-slots-visual:1453-1459 #concentration-block:1460-1477  
#prep-counter:1478-1478 #my-spells-list:1479-1481 #tab-inventory:1482-1501 #weight-fill:1502-1536 #inventory-list:1537-1546 #inv-pouches:1547-1602 #tab-notes:1603-1629 #notes-subtabs:1630-1631  
#notes-main:1632-1633 #taken-feats-section:1634-1638 #taken-feats-list:1639-1642 #tab-party:1643-1651 #my-char-card:1652-1666 #allies-list:1667-1682 #npcs-list:1683-1698 #monsters-list:1699-1710  
#companions-list-world:1711-1721 #tab-battle:1722-1727 #weapons-list:1728-1730 #ws-card:1731-1733 #saved-roll-form:1734-1740 #saved-roll-err:1741-1742 #saved-rolls-list:1743-1746 #battle-res-card:1747-1748  
#battle-res-rows:1749-1750 #battle-setup-screen:1751-1761 #battle-setup-list:1762-1762 #battle-difficulty:1763-1766 #battle-tracker-screen:1767-1771 #battle-turn-info:1772-1777 #battle-repeat-strip:1778-1778 #battle-tracker-list:1779-1788  
#tab-journal:1789-1803 #journal-list:1804-1810 #screen-itemref:1811-1813 #item-ref-tabs:1814-1819 #item-ref-weight:1820-1858 #item-ref-slots:1859-1890 #screen-dmref:1891-1893 #dm-ref-tabs:1894-1898  
#dm-ref-ed:1899-1899 #dm-ref-cond:1900-1900 #dm-ref-combat:1901-1901 #dm-ref-world:1902-1906 #screen-help:1907-1929 #help-about:1930-1953 #help-start:1954-1978 #help-sheet:1979-2002  
#help-progress:2003-2048 #help-spells:2049-2065 #help-inventory:2066-2078 #help-battle:2079-2103 #help-party:2104-2120 #help-notes:2121-2129 #help-journal:2130-2138 #help-planes:2139-2166  
#help-dice:2167-2178 #help-edition2024:2179-2218 #help-data:2219-2235 #help-marks:2236-2258 #conc-details-modal:2259-2269 #conc-detail-duration-row:2270-2277 #conc-detail-desc-row:2278-2287 #add-journal-modal:2288-2311  
#add-npc-modal:2312-2341 #add-ally-modal:2342-2378 #screen-monsters:2379-2391 #srd-monster-count:2392-2392 #srd-monster-results:2393-2397 #srd-npc-modal:2398-2407 #srd-npc-count:2408-2408 #srd-npc-results:2409-2416  
#screen-monsterform:2417-2454 #monster-cr-note:2455-2457 #monster-stats:2458-2459 #monster-saves:2460-2461 #monster-attacks:2462-2485 #screen-rest:2486-2488 #rest-main-screen:2489-2495 #rest-info-screen:2496-2500  
#hit-dice-section:2501-2502 #hit-dice-controls-total:2503-2507 #hit-dice-by-size:2508-2512 #rest-food-section:2513-2521 #rest-result-screen:2522-2524 #rest-result-details:2525-2533 #screen-levelup:2534-2538 #lu-screen-multiclass:2539-2540  
#lu-mc-current-classes:2541-2543 #lu-mc-new-class:2544-2548 #lu-mc-prereq-warn:2549-2549 #lu-mc-subclass-row:2550-2558 #lu-screen-preview:2559-2591 #lu-slots-card:2592-2593 #lu-slots-info:2594-2597 #lu-build-hint:2598-2598  
#lu-features-container:2599-2606 #lu-screen-choices:2607-2608 #lu-choices-body:2609-2615 #lu-screen-result:2616-2617 #lu-result-title:2618-2618 #lu-result-body:2619-2625 #screen-wildshape:2626-2631 #ws-limits:2632-2632  
#ws-results:2633-2636 #screen-hphistory:2637-2639 #hp-history-list:2640-2645 #asi-modal:2646-2650 #asi-build-hint:2651-2665 #asi-feat-list:2666-2666 #asi-stat-grid:2667-2667 #asi-preview:2668-2676  
#class-choice-modal:2677-2692 #dice-modal:2693-2725 #dice-file-hint:2726-2726 #dice3d-result:2727-2738 #dice-result-display:2739-2752 #dice-pick-hint:2753-2753 #dice-mode-segment:2754-2758 #dice-formula-panel:2759-2776  
#dice-fan:2777-2785 #dice-popover-settings:2786-2833 #dice-popover-history:2834-2845 #dice-history:2846-2854 #screen-spellsearch:2855-2857 #spell-feat-bar:2858-2874 #spell-class-filter:2875-2918 #class-filter-legend:2919-2920  
#spell-search-count:2921-2921 #spell-search-results:2922-2925 #cast-spell-modal:2926-2930 #cast-spell-options:2931-2933 #add-spell-modal:2934-2977 #new-spell-class-chips:2978-3023 #new-spell-mech-fields:3024-3028 #new-spell-mech-dmg-row:3029-3048  
#new-spell-mech-half-row:3049-3051 #new-spell-mech-mod-row:3052-3062 #item-modal:3063-3107 #item-armor-fields:3108-3133 #coin-exchange-modal:3134-3172 #exch-preview:3173-3179 #screen-magiccatalog:3180-3207 #magic-catalog-count:3208-3208  
#magic-catalog-list:3209-3212 #screen-gearcatalog:3213-3217 #gear-packs-list:3218-3231 #gear-catalog-count:3232-3232 #gear-catalog-list:3233-3237 #weapon-modal:3238-3241 #weapon-picker-section:3242-3244 #weapon-filter-chips:3245-3254  
#weapon-presets-list:3255-3317 #character-tabs:3318-3329 #quick-roll-strip:3330-3335 #qrs-list:3336-3346 #active-effects-panel:3347-3351 #aef-list:3352-3358 #hp-toast-container:3359-3361 #add-companion-modal:3362-3378  
#companion-familiar-row:3379-3399 #mob-sheet:3400-3403 #mob-sheet-list:3404-3407 #confirm-modal:3408-3421 #avatar-modal:3422-3425 #avatar-modal-preview:3426-3453 #screen-builds:3454-3481 #bp-list:3482-3486  
#screen-buildguide:3487-3489 #bg-body:3490-3494 #screen-buildplan:3495-3497 #bp-plan-body:3498-3502 #screen-abilityinfo:3503-3505 #ai-body:3506-3510 #screen-abilgen:3511-3513 #ag-body:3514-3518  
#screen-books:3519-3521 #books-body:3522-3526 #screen-mclayout:3527-3529 #ml-body:3530-3534 #screen-featureinfo:3535-3537 #fi-body:3538-3542 #app-log-panel:3543-3562 #app-log-list:3563-3742  
#notes-entry-modal:3743-3791  

## Функции по файлам (`имя:строка`)

**rules.js** (1757 строк, 116 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHitDicePool:58 _hdSizesDesc:66 rulesHitDiceSpentBy:72 rulesHitDiceLabel:96 rulesPickHitDice:104 rulesClampHitDice:116 rulesRitualMinutes:128 rulesHitDieHeal:135 rulesSpendHitDice:141 charClassLevel:167 charHasClass:177 charClassLevelOr:187 charAsiSlots:196 charEpicSlots:211 charSubclassPending:229 charXpNext:242 rulesJackOfAllTrades:253 charClassSubclass:258 rulesHasFeat:267 rulesHasFightingStyle:272 rulesHasDraconicResilience:284 rulesHasDazzlingFootwork:289 rulesRemarkableAthlete:294 rulesUntrainedCheckBonus:300 rulesHasExpertise:307 getInitiativeMod:313 rulesSaveBonus:329 rulesSkillBonus:335 rulesPassivePerception:350 rulesSpellStats:354 _spellStatMod:374 rulesSpellStatsByClass:382 rulesWeaponMods:400 rulesOffhandDamageMod:416 armorPenalties:425 rulesItemArmor:438 rulesArmorItem:450 rulesAC:461 charCasterLevel:643 classSpellSlotRow:684 getMulticlassSpellSlots:697 rulesRestoreLevelFields:733 rulesApplySpellSlots:752 resolvePactSlots:775 restoreItemCharges:785 rulesHitDieSides:802 rulesShortRest:808 rulesLongRestBlockReason:843 rulesLongRest:856 rulesExhaustionLevel:922 rulesEffectiveHpMax:928 _dsReset:933 _dsCount:934 _dsFill:935 _condAdd:936 _condRemove:937 rulesIsDead:939 rulesIsStable:943 rulesRegainFromZero:948 rulesSetHp:954 rulesDamageAfterDefenses:966 rulesApplyDamage:978 rulesDeathSaveBlockReason:1015 rulesDeathSave:1022 rulesConditionRollMods:1041 rulesEffectiveSpeed:1058 rulesArmorStealthDisadv:1079 rulesFeatPrereqMissing:1088 rulesFeatStatChoice:1115 rulesFeatStatOptions:1123 rulesFeatSlotCount:1136 rulesFeatSpellFits:1141 rulesFeatSpellCandidates:1152 rulesFeatSpellLabel:1156 rulesFeatSpellProgress:1161 rulesFeatClassOptions:1186 rulesFeatFreeResId:1199 rulesResetFeatFree:1202 concSaveParams:1213 rulesCrToXp:1255 rulesCrToProf:1261 rulesCrValue:1268 rulesWildShapeLimits:1279 rulesPolymorphLimits:1303 rulesCombatWildShapeHeal:1308 rulesBeastAllowed:1313 rulesFormStart:1320 rulesFormOwnHp:1334 rulesFormDamage:1339 rulesFormHeal:1354 rulesEncounterMultiplier:1361 rulesEncounterDifficulty:1370 getCharClassPairs:1394 charEditionMismatch:1408 findLangInCatalog:1416 ensureLanguagesArray:1428 recalcLanguagesFromSources:1444 add:1449 findToolInCatalog:1494 ensureToolsArray:1506 getBackgroundDef:1527 validateBgStatChoice:1563 parseBackgroundToolEntry:1583 recalcToolsFromSources:1598 add:1603 ensureArmorWeaponFields:1668 recalcArmorWeaponFromSources:1681 addArmor:1687 addWeapon:1688 addSpec:1737

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

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1842 строк, 55 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:145 openLevelUpModal:230 _showMulticlassScreen:252 openMulticlassNewClass:296 confirmMulticlassNewClass:355 _showLevelUpPreview:366 closeLevelUpModal:533 confirmLevelUp:546 _luShowResult:672 luFinishChoices:696 luRefreshChoices:703 luSetSubclass:710 luApplyFeatById:729 luApplyAsi:775 _luFeatChoiceAt:796 _ccDefsFor:804 _luAsiDone:815 luApplyAllRecommendations:820 luBuildChoicesScreen:940 recBadge:948 luAddRecommendedSpells:1080 luGoToSpellsTab:1108 openLevelDownConfirm:1120 confirmLevelDown:1165 loadDeathSaves:1198 toggleDeathSave:1242 resetDeathSaves:1259 updateHPDisplay:1272 hpToggleRow:1354 hpSetRowOpen:1363 updateHPSummary:1371 updateHPRows:1435 quickHP:1453 setHPAbsolute:1579 addHPHistory:1604 _hpUndoPrepare:1621 _hpUndoConcSnap:1641 _hpUndoConcRestore:1658 undoHPChange:1681 showHPToast:1711 applyCustomHP:1736 saveTempHP:1753 rollHitDieQuick:1767 renderHitDiceIcons:1799 rollDeathSave:1813

**app-inventory.js** (1744 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:992 toggleWeaponFilter:996 fillWeaponPreset:1003 _resetWeaponForm:1021 openWeaponModal:1040 closeWeaponModal:1050 editWeapon:1058 deleteCustomWeapon:1088 _weaponPresetByName:1114 checkWeaponProficiency:1121 submitWeapon:1149 weaponRowTap:1240 renderWeapons:1253 isLightWeapon:1332 toggleTWFStyle:1337 rollTWFAttack:1345 _weaponDamageRoll:1393 rollTWFDamage:1414 rollWeaponAttack:1426 rollWeaponDamage:1481 removeWeapon:1510 _invDndInit:1544 _invClearIndicators:1573 _invSetIndicator:1582 _invCleanup:1587 _invCancelDrag:1594 _invMoveItem:1602 _invCommitDrop:1619 invDragStart:1640 invDragOver:1650 invDragLeave:1667 invDrop:1671 invDragEnd:1677 invTouchStart:1684 invTouchMove:1700 invTouchEnd:1732

**app-spells.js** (2074 строк, 101 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:216 setSpellClass:225 _charSpellClassKey:234 _charMaxCastableLevel:245 _defaultSpellVersion:253 openSpellSearch:256 markCharOwnClassFilter:274 closeSpellSearch:304 _featPickCtx:315 featAddFixedSpells:330 openFeatSpellPicker:356 _featPickProgressText:373 _renderFeatPickBar:379 featPickSetClass:398 _featPickCandidates:406 _renderFeatPickList:416 addFeatSpell:447 removeFeatSpell:467 _parseSpellClassList:490 _syncNewSpellClassChips:494 toggleNewSpellClass:501 _fillNewSpellDamageTypes:526 _toggleHidden:533 updateNewSpellMechFields:541 _hbFormulaCheck:556 _collectHbEffect:565 _spellIdArg:603 _findHomebrewSpell:609 openAddSpellForm:617 _syncCustomSpellAcrossChars:696 _purgeCustomSpellFromChars:714 deleteCustomSpell:733 _deleteCustomSpellConfirmed:742 closeAddSpellForm:756 submitNewSpell:760 renderSpellSearch:850 addSpell:919 removeSpell:935 toggleSpellCard:949 renderMySpells:954 _spellActiveBadgeText:1096 _spellActiveBadgeHtml:1100 updateSpellActiveBadges:1103 _prepEntries:1126 _spellPrepEntry:1141 _prepLimit:1146 calcMaxPrepared:1162 _known2014:1169 calcMaxKnownSpells:1183 _knownSpellCount:1189 calcMaxCantrips:1199 isPrepClass:1208 _subclassSpellNames:1214 spellNeedsPrep:1241 _preparedCount:1257 openSpellCardsMenu:1265 isSpellPrepared:1280 toggleSpellPrepared:1290 renderPrepCounter:1316 _castableSlotOptions:1362 _arcanumResId:1383 castSpell:1393 _castSpellWithSlot:1414 _finishCast:1452 applyCastEffects:1498 _applyCastForm:1535 openCastVariantChooser:1548 pickCastVariant:1587 closeCastVariantChooser:1597 _applyCastSummon:1610 _nextCastInstanceId:1644 _replaceCastInstance:1652 _ensureCastInstance:1682 _applyCastDamage:1702 _rollCastDamage:1718 _startCastRepeat:1783 castRepeatDamage:1797 _applyCastDebuff:1822 castSpellAttackMod:1863 castStatMod:1871 _applyCastHeal:1889 _castHealApply:1910 _applyCastTempHp:1916 applyCastTempHp:1933 _applyCastHpMaxBonus:1947 openCastChooser:1967 closeCastChooser:1988 canCastAsRitual:2001 castRitual:2023 cancelRitual:2062

**app-party.js** (2376 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentSafeIcon:270 _pentNormalize:275 _pentImport:298 openAddAllyModal:339 openEditAllyModal:340 closeAddAllyModal:341 saveAlly:342 deleteAlly:343 setAllyStatus:344 exportAllies:345 importAllies:346 openAddNPCModal:348 openEditNPCModal:349 closeAddNPCModal:350 saveNPC:351 deleteNPC:352 setNPCStatus:353 exportNPCs:354 importNPCs:355 openAddMonsterModal:357 openEditMonsterModal:358 closeAddMonsterModal:359 saveMonster:360 deleteMonster:361 setMonsterStatus:362 exportMonsters:363 importMonsters:364 _monSigned:371 _monFormFill:372 _monFormStat:388 monsterFormRefresh:389 toggleMonsterSave:405 monsterAddAttackRow:406 _monFormRead:418 _monFormApply:432 monsterSaveBonus:443 monsterStatBlockHtml:448 monsterRoll:474 monsterAttackRoll:478 _monCatalog:489 _monCatalogIndex:495 _monCatalogPut:501 deleteCatalogMonster:511 addMonsterFromCatalog:523 _npcAttColor:543 renderNPCs:549 renderMonsters:590 _openSrdMonsterPickerLazy:645 openSrdMonsterPicker:655 openSrdMonsterPickerForBattle:657 _openSrdMonsterPickerCore:662 closeSrdMonsterPicker:705 setSrdMonsterSearch:710 setSrdMonsterCr:711 setSrdMonsterEdition:712 renderSrdMonsterPicker:714 addMonsterFromSRD:784 openSrdNpcPicker:825 _openSrdNpcPickerCore:834 closeSrdNpcPicker:855 setSrdNpcSearch:857 setSrdNpcAtt:858 renderSrdNpcPicker:860 addNpcFromSRD:891 openBattleTab:921 buildBattleSetupList:934 setBattleSearch:954 toggleBattleSection:955 renderBattleSetup:960 battleEncounterInput:1008 renderBattleDifficulty:1028 toggleBattleCheck:1053 battleDragStart:1058 battleDragOver:1059 battleDrop:1060 battleDragEnd:1068 rollInitiativeValue:1073 sortParticipantsByInitiative:1078 _findPartyMonster:1085 _participantCombatMeta:1095 _makeBattleParticipant:1120 _battleParticipantHP:1133 _addSrdMonsterToBattle:1144 _addCatalogMonsterToBattle:1174 _participantStatBlock:1198 startBattle:1206 getParticipantDesc:1228 showTrackerInfo:1251 getSelfStatusFromHP:1295 syncSelfBattleStatus:1312 renderBattleTracker:1322 renderBattleCastPanels:1415 _battleCondList:1457 _battleCondSet:1465 _battleCondMeta:1470 _battleCondDots:1473 openBattleCondPicker:1487 closeBattleCondPicker:1492 _renderBattleCondPicker:1497 toggleBattleCondition:1544 adjustBattleExhaustion:1559 adjustBattleHP:1578 setBattleHP:1592 setBattleHPMax:1623 setBattleInitiative:1634 rerollInitiative:1646 battleRollD20:1658 removeBattleParticipant:1663 setBattleStatus:1681 _battleStatusFromHp:1691 _battleSyncHpStatus:1701 offerCastDamageToBattle:1712 _castDamageTargets:1729 _castDamageAmount:1735 _renderCastDamageModal:1741 setCastDamageHalf:1804 toggleCastDamageTarget:1812 _castDamageHit:1822 applyCastDamageToTarget:1835 applyCastDamageTargets:1845 closeCastDamageModal:1855 _castHealTargets:1864 offerCastHealToBattle:1870 _renderCastHealModal:1878 toggleCastHealTarget:1923 applyCastHealTargets:1930 closeCastHealModal:1952 _castDebuffTargets:1973 offerCastDebuffToBattle:1979 _renderCastDebuffModal:1995 toggleCastDebuffTarget:2051 pickCastDebuffTarget:2061 applyCastDebuffTargets:2070 closeCastDebuffModal:2098 _battleDebuffChips:2107 removeBattleDebuff:2124 removeBattleDebuffsForSpell:2137 clearAllBattleDebuffs:2152 _logTurn:2157 _battleNewRound:2164 nextTurn:2172 _battleEconomyRow:2188 toggleBattleEconomy:2200 resetBattleEconomy:2206 prevTurn:2210 tickCastEffectsRound:2221 endBattle:2249 _dmRefEsc:2323 _dmRefGroup:2327 renderDmRef:2338 t:2342 openDmRef:2358 closeDmRef:2363 switchDmRef:2367

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1191 строк, 67 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:562 crSlotRecoveryActs:566 recoverSlotByResource:581 crRowsHtml:607 crSetRows:643 renderClassResources:658 spendResource:676 resetResource:694 toggleResourcePip:704 resetResourcesByRest:729 getJournal:771 addJournalEntry:776 filterJournal:798 renderJournal:805 deleteJournalEntry:841 openAddJournalEntry:850 closeAddJournalEntry:854 saveJournalEntry:857 getCompanions:877 renderCompanions:882 companionHP:927 buildFamiliarFormOptions:940 onCompanionTypeChange:952 applyFamiliarForm:960 openAddCompanionModal:972 summonFamiliar:988 openPrefilledCompanionModal:998 openEditCompanionModal:1009 closeAddCompanionModal:1028 saveCompanion:1031 deleteCompanion:1056 switchProfilesTab:1072 clipChangelogText:1087 expandChangelogItem:1098 renderChangelog:1104 openItemRef:1149 closeItemRef:1154 switchItemRef:1159 _syncHeaderHeight:1177

**app-dice.js** (1605 строк, 77 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:217 rollDice:221 _quickRollCompute:316 _quickRollModStr:335 _emitDiceRolled:341 _setDiceSettled:349 _setSettledDice:359 _quickRollRecord:376 _quickRollInfoText:383 _quickRollToastText:390 quickRoll:406 renderQuickRollStrip:464 updateQuickRollStripVisibility:486 dismissQuickRollStrip:501 openDiceRollHistory:506 drawDiceSVG:519 _waitDiceBoxModule:538 _diceLsGet:558 _getAccentColor:566 _getDiceTheme:585 _getDiceThemeColor:592 setDiceTheme:595 _syncDiceThemeButtons:601 _getDiceBg:611 setDiceBg:618 _syncDiceBgButtons:624 _diceDbg:634 _initDiceBox:639 animateDice3d:745 animateDice2d:940 buildDie:966 tick:1034 _applyDiceCritGlow:1057 parseDiceFormula:1078 _formulaCanon:1114 _renderFormulaResult:1126 rollFormula:1162 _rollFormulaFrom:1230 rollCustomFormula:1243 renderDiceHistory:1246 createParticles:1268 _diceShapeSvg:1302 renderDiceFan:1309 _paintSelectedDie:1328 _diceHeroSvg:1352 _paintDiceMode:1362 selectDie:1377 rollSelectedDie:1396 toggleDiceFormulaPanel:1405 _savedRollFormula:1424 _savedRollsClean:1427 _savedRollNewId:1442 _savedRollLabel:1445 renderSavedRolls:1449 savedRollRoll:1469 savedRollTap:1476 savedRollEdit:1492 savedRollCancel:1508 savedRollSubmit:1513 savedRollDelete:1534 savedRollFromDice:1552 _diceHotkeys:1573

**app-settings.js** (907 строк, 93 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:172 _getStatsLayout:189 _applyStatsLayout:196 _statsInCards:203 _statsRowTarget:207 _placeStatRows:225 setStatsLayout:241 _syncStatsLayoutButtons:248 _getSheet2Demo:261 _syncSheet2DemoButtons:264 setSheet2Demo:270 _getSheetLock:281 setSheetLock:285 _syncSheetLockButtons:290 _wakeLockSupported:301 _getWakeLockOn:302 _applyWakeLock:306 setWakeLock:321 _syncWakeLockButtons:326 _getHeaderAutohideOn:336 setHeaderAutohide:339 _syncHeaderAutohideButtons:344 _getTrackXpOn:352 _applyTrackXp:355 setTrackXp:358 _syncTrackXpButtons:363 _getAttackDamageOn:384 setAttackDamage:387 _syncAttackDamageButtons:391 isEditionSplit:400 setEditionSplit:403 _syncEditionSplitButtons:408 openBooksScreen:418 _bookRowHtml:422 _renderBooksScreen:432 setBookOn:454 setBooksPreset:460 _afterBooksChange:467 _syncBooksSummary:479 _getStatsCollapsed:491 _applyStatsCollapsed:494 toggleStatsCollapsed:499 _getStoredDensity:513 _getDefaultDensity:521 _getDensity:528 _applyDensity:531 setDensity:535 _syncDensityButtons:541 _onViewportDensityChange:549 _getFontScale:567 _applyFontScale:574 setFontScale:585 _syncFontScaleUi:596 _getGlassAlpha:611 _getGlassBlur:618 _applyGlassAlpha:625 _applyGlassBlur:626 setGlassAlpha:627 setGlassBlur:637 _syncGlassUi:646 _getSpaceMode:695 _applySpaceBg:702 setSpaceMode:717 _syncSpaceButtons:723 _spaceOnScroll:742 _applyDymkaIcons:770 _initAppLinks:783 openSupportLink:815 _isStandalone:827 _isIos:833 _installMode:837 _syncInstallUi:842 installApp:855 openSettingsModal:879 closeSettingsModal:894

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

**data.js** (7560 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:126 SAVES_DATA:148 CONDITIONS:157 EFFECTS_DATA:180 CLASS_FEATURES:231 SPELL_PREP_CLASSES:481 CANTRIPS_KNOWN_2014:489 SPELLS_KNOWN_2014:497 SPELL_SLOTS_BY_LEVEL:504 CLASS_HIT_DICE:579 SUBCLASSES:585 SOURCE_LABELS:605 SUBCLASS_SOURCE:632 BOOK_CODES:701 _booksOffCache:704 SUBCLASS_LEVEL:745 SUBCLASS_FEATURES:761 WEAPON_PRESETS:1553 ITEM_ICONS:1597 CATEGORY_NAMES:1598 GEAR_PACKS:1607 RACE_DATA:1702 BACKGROUND_SKILLS:2319 BACKGROUND_ALIASES:2398 DEITY_ALIGN_LABELS:2411 DEITIES_DATA:2416 LANGUAGE_CATALOG:2484 RACE_LANGUAGES:2521 CLASS_LANGUAGES:2623 TOOL_CATALOG:2629 RACE_TOOLS:2684 CLASS_TOOLS:2696 SUBCLASS_LANGUAGES:2704 SUBCLASS_TOOLS:2727 RACE_ARMOR:2749 RACE_WEAPONS_SPECIFIC:2755 CLASS_WEAPONS_SPECIFIC:2771 RACE_NAME_POOLS:2784 RACE_NAME_GROUP:2826 SUBCLASS_ARMOR:2841 ARMOR_PRESETS:2872 skills:2889 ABILITY_INFO:2902 CLASS_SKILL_OPTIONS:2942 CLASS_SKILL_COUNT:2957 CLASS_SKILL_MC_COUNT:2958 CLASS_ARMOR_PROFS:2961 CLASS_RESOURCES:2981 ASI_LEVELS:3143 XP_THRESHOLDS:3151 APP_VERSION:3161 APP_VERSION_DATE:3162 APP_TELEGRAM_URL:3168 APP_BOOSTY_URL:3169 FEATS_DATA:3190 APP_CHANGELOG:3512 CASTER_TYPE:7388 THIRD_CASTER_SUBCLASSES:7397 THIRD_CASTER_SLOTS:7404 MULTICLASS_SPELL_SLOTS:7415 MULTICLASS_PREREQUISITES:7440 MULTICLASS_PROFICIENCIES:7458 EDITION_DATA:7487

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (871 строк)  
SPELL_EFFECTS:71

**class-choices.js** (700 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

