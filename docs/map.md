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
| 1731–1953 | HEADER (R5: back + name + hamburger) |
| 1954–2016 | КД АВТО-РАСЧЁТ |
| 2017–2080 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2081–2143 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2144–2298 | УСЛОВИЯ |
| 2299–2440 | СПАСБРОСКИ |
| 2441–2568 | CLASS FEATURES |
| 2569–2608 | УБИРАЕМ СТРЕЛКИ |
| 2609–2715 | TAB NAV — 5 tabs + centered FAB dice |
| 2716–2824 | UX-5: лента последних бросков вне модалки |
| 2825–2961 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 2962–2981 | HAMBURGER BUTTON |
| 2982–3024 | SIDE DRAWER |
| 3025–3420 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3421–3468 | MENU-8/9: встречающий экран во всё окно. |
| 3469–3561 | MENU-2: плашка последнего героя. |
| 3562–3738 | MENU-3: меню приключения. |
| 3739–3808 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 3809–3809 | INVENTORY |
| 3810–3840 | INVENTORY — WEIGHT BAR |
| 3841–3863 | INVENTORY — BACKPACK HEADER |
| 3864–3904 | INVENTORY — FILTERS |
| 3905–4057 | INVENTORY — ITEM CARDS |
| 4058–4373 | COINS — BIG NUMBER CARD GRID |
| 4374–4675 | MODALS |
| 4676–4684 | DICE |
| 4685–5183 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5184–5915 | OTHER STYLES |
| 5916–5986 | HP DISPLAY BLOCK |
| 5987–6011 | MOBILE OPTIMIZATION |
| 6012–6140 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6141–6179 | HP TOAST (snackbar) |
| 6180–6213 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 6214–6270 | Confirm Modal |
| 6271–6648 | ⚔️ ОТРЯД & БОЙ |
| 6649–6880 | RACIAL BONUS BAR |
| 6881–7029 | COMPACT STATS GRID |
| 7030–7281 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 7282–7334 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 7335–7382 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 7383–7485 | COMPACT SKILLS |
| 7486–7528 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 7529–7600 | ACCORDION |
| 7601–7607 | CLASS RESOURCES |
| 7608–7704 | ASI MODAL |
| 7705–7872 | APP VERSION |
| 7873–7882 | COMPANIONS |
| 7883–7923 | FEATS LIST IN ASI |
| 7924–8169 | PROFILES TABS (Чейнджлог) |
| 8170–8245 | TAKEN FEATS |
| 8246–8438 | SW UPDATE MODAL |
| 8439–8490 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 8491–8658 | INVENTORY SLOTS SYSTEM |
| 8659–8863 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 8864–9076 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 9077–9225 | HELP-4 — Движок интерактивного тура (подсветка). |
| 9226–9295 | 3D DICE CUBE |
| 9296–9638 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 9639–9712 | DESKTOP LAYOUT — centered max-width |
| 9713–9736 | INSPIRATION |
| 9737–9776 | CONCENTRATION |
| 9777–10294 | WEAPON CARDS WITH ROLL BUTTONS |
| 10295–10389 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 10390–10450 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 10451–10472 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 10473–10585 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 10586–10613 | R6: Ассеты (декор) |
| 10614–11482 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 11483–11566 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 11567–11575 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 11576–11633 | UI-13: доступ к настройкам и усиление back-кнопки |
| 11634–11950 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 11951–11977 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 11978–12004 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 12005–12087 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 12088–13085 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 13086–13141 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 13142–13237 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 13238–13569 | DISC-1 · Ромб раскрытия |
| 13570–14104 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 14105–14210 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14211–14344 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14345–14545 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14546–14554 | STYLE-8b3-fix: срезанный ромб |
| 14555–14822 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14823–15283 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15284–15318 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15319–16903 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:92-93 #conditions-popup-overlay:94-94 #conditions-popup:95-99 #conditions-popup-list:100-103 #drawer-overlay:104-105 #side-drawer:106-143 #screen-settings:144-235 #header-autohide-row:236-252  
#wake-lock-row:253-283 #edition-row:284-306 #install-row:307-317 #welcome-modal:318-322 #welcome-step-1:323-341 #welcome-step-2:342-376 #header-avatar:377-382 #status-bar:383-386  
#status-inspiration:387-387 #status-concentration:388-390 #status-ritual:391-393 #status-conditions-btn:394-407 #screen-home:408-410 #home-art:411-438 #home-sub-new:439-486 #home-install:487-494  
#home-hero:495-495 #home-hero-emblem:496-499 #home-hero-sub:500-500 #home-hero-chips:501-511 #screen-characters:512-551 #char-hero:552-552 #char-hero-emblem:553-556 #char-hero-sub:557-557  
#char-hero-chips:558-558 #char-hero-actions:559-567 #screen-data:568-584 #sync-row:585-585 #storage-status:586-586 #backup-panel:587-591 #backup-list:592-603 #screen-about:604-607  
#app-version-row:608-615 #ptab-info:616-623 #app-links-row:624-628 #ptab-changelog:629-634 #changelog-list:635-641 #screen-character:642-642 #tab-sheet:643-645 #creation-wizard-banner:646-653  
#cw-edition-row:654-663 #cw-validation:664-666 #basic-locked-bar:667-676 #creation-todo:677-686 #sheet-avatar:687-699 #char-build-badge-wrap:700-714 #char-class-mc:715-738 #char-subclass-rec:739-739  
#char-subclass-mc:740-948 #char-books:949-953 #race-bonus-display:954-954 #race-extras-panel:955-955 #class-skills-panel:956-957 #background-feature-display:958-959 #bg-extras-panel:960-1003 #abilgen-row:1004-1010  
#stats-collapse-btn:1011-1018 #abilities-region:1019-1022 #proficiency-bonus-2024:1023-1024 #insp-card-2024:1025-1034 #abil-col-1:1035-1035 #stat-block-str:1036-1037 #mod-str:1038-1044 #abil-save-slot-str:1045-1045  
#abil-skills-slot-str:1046-1048 #stat-block-dex:1049-1050 #mod-dex:1051-1057 #abil-save-slot-dex:1058-1058 #abil-skills-slot-dex:1059-1061 #stat-block-int:1062-1063 #mod-int:1064-1070 #abil-save-slot-int:1071-1071  
#abil-skills-slot-int:1072-1075 #abil-col-2:1076-1076 #stat-block-con:1077-1078 #mod-con:1079-1085 #abil-save-slot-con:1086-1086 #abil-skills-slot-con:1087-1089 #stat-block-wis:1090-1091 #mod-wis:1092-1098  
#abil-save-slot-wis:1099-1099 #abil-skills-slot-wis:1100-1102 #stat-block-cha:1103-1104 #mod-cha:1105-1111 #abil-save-slot-cha:1112-1112 #abil-skills-slot-cha:1113-1126 #saves-grid:1127-1136 #skills-container:1137-1139  
#passive-perception:1140-1159 #ws-hp-banner:1160-1165 #hp-dmg-row:1166-1175 #hp-dmg-body:1176-1196 #death-saves-section:1197-1228 #hp-armor-body:1229-1270 #hp-hd-body:1271-1284 #hp-rest-body:1285-1312  
#class-dev-section:1313-1315 #cd-head:1316-1316 #cd-res:1317-1317 #cd-attn:1318-1319 #cd-about:1320-1328 #ac-formula:1329-1330 #ac-modifiers:1331-1338 #conditions-grid:1339-1346  
#effects-grid:1347-1354 #resistances-container:1355-1363 #prof-card:1364-1367 #armor-prof-container:1368-1371 #weapon-prof-container:1372-1375 #tools-container:1376-1379 #languages-container:1380-1387 #companions-list-sheet:1388-1400  
#tab-progress:1401-1402 #pg-body:1403-1404 #tab-spells:1405-1407 #spell-stat-card:1408-1429 #spell-mod-display:1430-1435 #spell-dc-display:1436-1441 #spell-attack-display:1442-1447 #spell-stats-by-class:1448-1459  
#spell-slots-card:1460-1465 #spell-slots-visual:1466-1472 #concentration-block:1473-1490 #rd-find-spl-wrap:1491-1491 #prep-counter:1492-1492 #my-spells-list:1493-1494 #rd-slot-strip:1495-1496 #tab-inventory:1497-1500  
#rd-find-inv-wrap:1501-1517 #weight-fill:1518-1552 #inventory-list:1553-1557 #inv-coins-card:1558-1562 #rd-exch:1563-1573 #inv-pouches:1574-1629 #tab-notes:1630-1656 #notes-subtabs:1657-1658  
#notes-main:1659-1660 #taken-feats-section:1661-1665 #taken-feats-list:1666-1669 #tab-party:1670-1678 #my-char-card:1679-1693 #allies-list:1694-1709 #npcs-list:1710-1726 #monsters-list:1727-1738  
#companions-list-world:1739-1749 #tab-battle:1750-1755 #weapons-list:1756-1758 #ws-card:1759-1761 #saved-roll-form:1762-1768 #saved-roll-err:1769-1770 #saved-rolls-list:1771-1774 #battle-res-card:1775-1776  
#battle-res-rows:1777-1778 #battle-setup-screen:1779-1789 #battle-setup-list:1790-1790 #battle-difficulty:1791-1794 #battle-tracker-screen:1795-1799 #battle-turn-info:1800-1805 #battle-repeat-strip:1806-1806 #battle-tracker-list:1807-1816  
#tab-journal:1817-1831 #journal-list:1832-1838 #screen-itemref:1839-1841 #item-ref-tabs:1842-1847 #item-ref-weight:1848-1886 #item-ref-slots:1887-1918 #screen-dmref:1919-1921 #dm-ref-tabs:1922-1926  
#dm-ref-ed:1927-1927 #dm-ref-cond:1928-1928 #dm-ref-combat:1929-1929 #dm-ref-world:1930-1934 #screen-help:1935-1957 #help-about:1958-1981 #help-start:1982-2006 #help-sheet:2007-2030  
#help-progress:2031-2076 #help-spells:2077-2093 #help-inventory:2094-2106 #help-battle:2107-2131 #help-party:2132-2148 #help-notes:2149-2157 #help-journal:2158-2166 #help-planes:2167-2194  
#help-dice:2195-2206 #help-edition2024:2207-2246 #help-data:2247-2263 #help-marks:2264-2286 #conc-details-modal:2287-2297 #conc-detail-duration-row:2298-2305 #conc-detail-desc-row:2306-2315 #add-journal-modal:2316-2339  
#add-npc-modal:2340-2369 #add-ally-modal:2370-2406 #screen-monsters:2407-2419 #srd-monster-count:2420-2420 #srd-monster-results:2421-2425 #srd-npc-modal:2426-2435 #srd-npc-count:2436-2436 #srd-npc-results:2437-2444  
#screen-monsterform:2445-2482 #monster-cr-note:2483-2485 #monster-stats:2486-2487 #monster-saves:2488-2489 #monster-attacks:2490-2513 #screen-rest:2514-2516 #rest-main-screen:2517-2518 #rest-card-short:2519-2521  
#hit-dice-section:2522-2523 #hit-dice-controls-total:2524-2528 #hit-dice-by-size:2529-2534 #rest-card-long:2535-2537 #rest-food-section:2538-2548 #rest-result-screen:2549-2551 #rest-result-details:2552-2560 #screen-levelup:2561-2565  
#lu-screen-multiclass:2566-2567 #lu-mc-current-classes:2568-2570 #lu-mc-new-class:2571-2575 #lu-mc-prereq-warn:2576-2576 #lu-mc-subclass-row:2577-2585 #lu-screen-preview:2586-2618 #lu-slots-card:2619-2620 #lu-slots-info:2621-2624  
#lu-build-hint:2625-2625 #lu-features-container:2626-2634 #lu-screen-choices:2635-2636 #lu-choices-body:2637-2643 #lu-screen-result:2644-2645 #lu-result-title:2646-2646 #lu-result-body:2647-2653 #screen-wildshape:2654-2659  
#ws-limits:2660-2660 #ws-results:2661-2664 #screen-hphistory:2665-2667 #hp-history-list:2668-2673 #asi-modal:2674-2678 #asi-build-hint:2679-2693 #asi-feat-list:2694-2694 #asi-stat-grid:2695-2695  
#asi-preview:2696-2704 #class-choice-modal:2705-2720 #dice-modal:2721-2753 #dice-file-hint:2754-2754 #dice3d-result:2755-2766 #dice-result-display:2767-2780 #dice-pick-hint:2781-2781 #dice-mode-segment:2782-2786  
#dice-formula-panel:2787-2804 #dice-fan:2805-2813 #dice-popover-settings:2814-2861 #dice-popover-history:2862-2873 #dice-history:2874-2882 #screen-spellsearch:2883-2885 #spell-feat-bar:2886-2901 #spell-ver-filter:2902-2908  
#spell-class-filter:2909-2940 #class-filter-legend:2941-2942 #spell-search-count:2943-2944 #spell-search-results:2945-2948 #cast-spell-modal:2949-2953 #cast-spell-options:2954-2956 #add-spell-modal:2957-3000 #new-spell-class-chips:3001-3046  
#new-spell-mech-fields:3047-3051 #new-spell-mech-dmg-row:3052-3071 #new-spell-mech-half-row:3072-3074 #new-spell-mech-mod-row:3075-3085 #item-modal:3086-3130 #item-armor-fields:3131-3156 #coin-exchange-modal:3157-3195 #exch-preview:3196-3202  
#screen-magiccatalog:3203-3230 #magic-catalog-count:3231-3231 #magic-catalog-list:3232-3235 #screen-gearcatalog:3236-3240 #gear-packs-list:3241-3254 #gear-catalog-count:3255-3255 #gear-catalog-list:3256-3260 #weapon-modal:3261-3264  
#weapon-picker-section:3265-3267 #weapon-filter-chips:3268-3277 #weapon-presets-list:3278-3278 #weapon-pick-bar:3279-3342 #rd-quick-dock:3343-3343 #character-tabs:3344-3362 #quick-roll-strip:3363-3368 #qrs-list:3369-3379  
#active-effects-panel:3380-3384 #aef-list:3385-3391 #hp-toast-container:3392-3394 #add-companion-modal:3395-3411 #companion-familiar-row:3412-3432 #mob-sheet:3433-3436 #mob-sheet-list:3437-3440 #confirm-modal:3441-3454  
#avatar-modal:3455-3458 #avatar-modal-preview:3459-3486 #screen-builds:3487-3514 #bp-list:3515-3519 #screen-buildguide:3520-3522 #bg-body:3523-3527 #screen-buildplan:3528-3530 #bp-plan-body:3531-3535  
#screen-abilityinfo:3536-3538 #ai-body:3539-3543 #screen-abilgen:3544-3546 #ag-body:3547-3551 #screen-books:3552-3554 #books-body:3555-3559 #screen-mclayout:3560-3562 #ml-body:3563-3567  
#screen-featureinfo:3568-3570 #fi-body:3571-3575 #screen-creator:3576-3578 #cr-progress:3579-3579 #cr-body:3580-3590 #app-log-panel:3591-3610 #app-log-list:3611-3792 #notes-entry-modal:3793-3841  

## Функции по файлам (`имя:строка`)

**rules.js** (1784 строк, 119 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesAuraOfProtection:337 rulesSaveBonus:342 rulesDivineSmiteFormula:350 rulesSkillBonus:357 rulesPassivePerception:372 rulesSpellStats:376 _spellStatMod:401 rulesSpellStatsByClass:409 rulesWeaponMods:427 rulesOffhandDamageMod:443 armorPenalties:452 rulesItemArmor:465 rulesArmorItem:477 rulesAC:488 charCasterLevel:670 classSpellSlotRow:711 getMulticlassSpellSlots:724 rulesRestoreLevelFields:760 rulesApplySpellSlots:779 resolvePactSlots:802 restoreItemCharges:812 rulesHitDieSides:829 rulesShortRest:835 rulesLongRestBlockReason:870 rulesLongRest:883 rulesExhaustionLevel:949 rulesEffectiveHpMax:955 _dsReset:960 _dsCount:961 _dsFill:962 _condAdd:963 _condRemove:964 rulesIsDead:966 rulesIsStable:970 rulesRegainFromZero:975 rulesSetHp:981 rulesDamageAfterDefenses:993 rulesApplyDamage:1005 rulesDeathSaveBlockReason:1042 rulesDeathSave:1049 rulesConditionRollMods:1068 rulesEffectiveSpeed:1085 rulesArmorStealthDisadv:1106 rulesFeatPrereqMissing:1115 rulesFeatStatChoice:1142 rulesFeatStatOptions:1150 rulesFeatSlotCount:1163 rulesFeatSpellFits:1168 rulesFeatSpellCandidates:1179 rulesFeatSpellLabel:1183 rulesFeatSpellProgress:1188 rulesFeatClassOptions:1213 rulesFeatFreeResId:1226 rulesResetFeatFree:1229 concSaveParams:1240 rulesCrToXp:1282 rulesCrToProf:1288 rulesCrValue:1295 rulesWildShapeLimits:1306 rulesPolymorphLimits:1330 rulesCombatWildShapeHeal:1335 rulesBeastAllowed:1340 rulesFormStart:1347 rulesFormOwnHp:1361 rulesFormDamage:1366 rulesFormHeal:1381 rulesEncounterMultiplier:1388 rulesEncounterDifficulty:1397 getCharClassPairs:1421 charEditionMismatch:1435 findLangInCatalog:1443 ensureLanguagesArray:1455 recalcLanguagesFromSources:1471 add:1476 findToolInCatalog:1521 ensureToolsArray:1533 getBackgroundDef:1554 validateBgStatChoice:1590 parseBackgroundToolEntry:1610 recalcToolsFromSources:1625 add:1630 ensureArmorWeaponFields:1695 recalcArmorWeaponFromSources:1708 addArmor:1714 addWeapon:1715 addSpec:1764

**app-core.js** (1866 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:483 _closeOpenModals:486 headerBack:496 _rdScreenOpen:524 initRdScreens:527 _screenMotionOk:572 _screenGhostDrop:578 _screenGhostStart:590 _screenEnter:608 _purgeDraftChars:619 showScreen:632 updateHeaderTitle:747 syncDrawerHeader:801 switchTab:813 _rdSheetView:850 openDrawer:869 closeDrawer:882 showCharacterNav:894 hideCharacterNav:902 isInteractive:922 currentActiveTab:945 scrolledDown:1010 closeAction:1017 reset:1024 end:1057 createNewCharacter:1077 getClassColor:1100 getClassIcon:1115 getAbilityIcon:1122 getConditionIcon:1137 getConditionChipIcon:1161 getSpellClassIcon:1179 getSchoolSlug:1196 getSchoolIcon:1200 stripLeadingEmoji:1213 formatTimeAgo:1217 setCharSort:1231 setCharSearch:1238 duplicateCharacter:1242 exportOneCharacter:1254 updateCharCounter:1261 onDragStart:1278 onDragOver:1279 onDrop:1280 renderCharacterList:1291 renderCharPlate:1378 deleteCharacter:1441 showConfirmModal:1455 safeSet:1502 safeSetChecked:1506 loadCharacter:1515 showToast:1706 showFieldError:1723 clearFieldError:1745 toastAddAction:1755 emptyStateHtml:1773 openHPHistory:1784 closeHPHistory:1812 updateVersionBlock:1817 forceAppUpdate:1848

**app-migrate.js** (1047 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1039

**app-builds.js** (1757 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1038 _reEscape:1039 _glossEd:1040 _glossBuild:1041 ingest:1043 _glossIndex:1065 glossarizeHtml:1073 _glossPopoverEl:1087 hideGlossPopover:1099 showGlossPopover:1104 _glossBindOnce:1123 openBuildGuide:1154 gx:1177 _list:1178 getBuildLevelRec:1241 getBuildRecChoiceOption:1246 getBuildRecChoiceIds:1254 getBuildRecFeat:1259 getBuildRecAsi:1269 getBuildRecSubclass:1276 parseAsiFromHeadline:1284 _buildFeatNameMap:1298 parseFeatFromHeadline:1340 parseSpellsFromHeadline:1357 getBuildRecSpellObjs:1603 openBuildPlan:1623 _cpSubclassOf:1676 _cpClassSwitch:1687 openClassPlan:1702

**app-io.js** (719 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:103 _normalizeImportedSpell:112 _isValidImportedSpell:123 _collectCharUserSpells:127 _ingestImportedUserSpells:145 _spellBaseById:191 _unpackSpell:199 _countUnresolvedSpells:221 _unresolvedNote:229 _importTooNew:234 _packSpell:243 _packCharForExport:254 _unpackCharSpells:261 _buildCharEnvelope:267 _charExportFileName:282 _downloadText:285 _shareableFile:296 shareOneCharacter:307 copyCharToClipboard:324 pasteCharFromClipboard:337 _extractCharsFromImport:355 _applyFullRestore:367 _warnEditionMix:411 run:412 importData:427 importOneCharacter:486 _importOneCharText:503 _consumeLaunchFiles:584 _importLaunchText:617 exportSpells:624 importSpells:633 exportSessionLog:706

**app-combat.js** (3399 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:786 featHpPerLevel:801 featHpFlat:810 recalculateHP:819 updateChar:874 toggleProficiency:941 calcStats:964 setSpellStat:1035 calcSpellStats:1046 _toggleNonCasterCards:1098 showSpellCasterCards:1109 onRaceChange:1117 renderBooksRow:1247 openMobSheet:1274 closeMobSheet:1281 mobSheetActs:1283 openBooksSheet:1288 toggleCharBook:1298 populateRaceSelect:1315 _speciesEffective:1348 _renderSpeciesBar:1361 _speciesChoiceOptions:1376 toggleSpeciesChoice:1383 syncSpeciesSpells:1397 rollRandomName:1443 pick:1451 build:1452 _raceSkillAllowance:1511 _raceFlexCount:1521 _raceFlexFits:1527 _raceFlexApply:1534 _setExtrasHtml:1544 renderRaceExtras:1553 toggleHalfElfStat:1724 toggleRaceFlexStat:1750 setRaceVariableTrait:1780 _raceSkillSet:1797 _pickHide:1807 _pickExpandBtn:1811 pickExpand:1814 raceLangGoto:1821 toggleRaceSkill:1829 _classSkillList:1858 _skillsFromOtherSources:1871 _skillsByName:1880 _skillTakenElsewhere:1886 _classSkillHeld:1898 _classSkillSync:1904 renderClassSkills:1935 toggleClassSkill:1982 openRaceFeatModal:2010 removeRaceFeat:2030 applyBasicLockUI:2065 _cwEditionBusy:2099 syncCwEdition:2104 setDraftEdition:2116 updateLockButtonState:2126 lockBasicInfo:2164 unlockBasicInfo:2185 isSheetLocked:2215 sheetLockGuard:2221 applySheetLockUI:2227 _creationTodo:2258 add:2262 src:2263 scheduleCreationTodo:2335 renderCreationTodo:2340 creationTodoGo:2367 openLockSheet:2379 _creationUiReset:2392 _isMobSheet:2393 renderIdentitySummary:2394 toggleIdentityMore:2413 renderProfSummary:2417 toggleProfCard:2432 openAcSheet:2438 _mobMarkClamp:2446 init:2455 lockSheet:2476 doLock:2480 unlockSheet:2493 onBackgroundChange:2514 _bgSkillsOf:2559 _bgUncheckOld:2566 _bgCheckSkills:2574 renderBackgroundFeature:2586 _bgStatShort:2631 populateBackgroundSelect:2634 _bgRevertStatChoice:2665 _bgAppliedStat:2678 _bgApplyStat:2683 setBgStatMode:2695 toggleBgStat:2707 _bgAfterStats:2730 _bgRevertFeatEffects:2741 syncOriginFeat:2766 toggleBgCustom:2802 _toggleBgCustom14:2842 toggleBgSkillPick:2889 _renderBgCustom14:2916 giveBackgroundEquipment:2953 renderBackgroundExtras:2998 _armorFromSelect:3106 renderArmorSelect:3118 onArmorPick:3153 onShieldPick:3167 onArmorChange:3186 onManualAC:3215 onManualMaxHP:3222 calcCoinWeight:3245 getActiveConditionsForRender:3259 toggleConditionsPopup:3288 closeConditionsPopup:3300 renderConditionsPopup:3306

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (646 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:167 removeCustomLanguage:194 getToolChoiceSlots:219 buildToolOptionsHtml:287 renderTools:308 addChoiceTool:381 addCustomTool:398 removeCustomTool:425 renderArmorProf:444 renderWeaponProf:494 addCustomArmorType:558 removeCustomArmorType:574 addCustomWeaponType:586 removeCustomWeaponType:601 addCustomSpecificWeapon:612 removeCustomSpecificWeapon:633

**app-hp.js** (1950 строк, 64 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:33 showLongRestInfo:34 selectRestType:36 _restResNames:53 _renderRestPreview:63 _restHasSlots:99 showRestResult:105 adjustHitDice:115 _restHitDiceChosen:127 adjustHitDiceSize:134 updateHitDiceInfo:141 confirmRest:174 openLevelUpModal:266 _showMulticlassScreen:296 luPickAnotherClass:341 openMulticlassNewClass:348 confirmMulticlassNewClass:407 _showLevelUpPreview:418 closeLevelUpModal:593 confirmLevelUp:606 _luShowResult:733 luFinishChoices:764 luRefreshChoices:771 luSetSubclass:778 luApplyFeatById:797 luApplyAsi:843 _luFeatChoiceAt:864 _luChoiceOpensAt:873 _ccDefsFor:878 _luAsiDone:889 luApplyAllRecommendations:894 _luSpellGainParts:1016 pluralRu:1021 delta:1025 luBuildChoicesScreen:1043 recBadge:1051 luAddRecommendedSpells:1187 luGoToSpellsTab:1215 openLevelDownConfirm:1227 confirmLevelDown:1272 loadDeathSaves:1305 toggleDeathSave:1349 resetDeathSaves:1366 updateHPDisplay:1379 hpToggleRow:1469 hpSetRowOpen:1478 updateHPSummary:1486 updateHPRows:1550 quickHP:1568 setHPAbsolute:1694 addHPHistory:1719 _hpUndoPrepare:1736 _hpUndoConcSnap:1756 _hpUndoConcRestore:1773 undoHPChange:1796 showHPToast:1826 applyCustomHP:1844 saveTempHP:1861 rollHitDieQuick:1875 renderHitDiceIcons:1907 rollDeathSave:1921

**app-inventory.js** (2387 строк, 131 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 rdInvStatus:46 getSlotsTotal:59 calcUsedSlots:69 updateSlotsDisplay:85 renderPouches:130 renderInventory:151 toggleInvItem:279 editItemDirect:284 deleteItemDirect:285 updateInventoryWeight:305 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:377 adjustItemCharges:388 openItemModal:404 closeItemModal:478 syncItemArmorFields:483 syncWornArmor:495 submitItem:524 openMagicCatalog:596 closeMagicCatalog:613 renderMagicCatalog:618 fillFromMagicItem:650 openGearCatalog:703 closeGearCatalog:719 renderGearPacks:724 renderGearCatalog:734 fillFromGearItem:762 addPackToInventory:785 rollTrinket:807 _weaponPresets2024:843 _weaponMasteryGrant:864 getWeaponMasteryLimit:889 weaponMasteryPending:893 canMasterWeapon:898 getWeaponMasteryProp:907 isWeaponMastered:914 toggleWeaponMastery:917 _weaponCatalog:936 renderWeaponPresets:950 filterWeaponPresets:1016 toggleWeaponFilter:1020 fillWeaponPreset:1027 _resetWeaponForm:1045 openWeaponModal:1066 closeWeaponModal:1076 editWeapon:1084 deleteCustomWeapon:1114 _weaponPresetByName:1140 checkWeaponProficiency:1147 submitWeapon:1175 weaponRowTap:1266 renderWeapons:1280 isLightWeapon:1379 toggleTWFStyle:1384 rollTWFAttack:1392 _weaponDamageRoll:1440 rollTWFDamage:1461 _unarmedStrike:1476 _weaponAt:1480 rollWeaponAttack:1484 _attackBonusTail:1545 rollWeaponDamage:1549 _canDivineSmite:1582 openDivineSmite:1586 _divineSmite:1610 removeWeapon:1642 _invDndInit:1676 _invClearIndicators:1705 _invSetIndicator:1714 _invCleanup:1719 _invCancelDrag:1726 _invMoveItem:1734 _invCommitDrop:1751 invDragStart:1772 invDragOver:1782 invDragLeave:1799 invDrop:1803 invDragEnd:1809 invTouchStart:1816 invTouchMove:1832 invTouchEnd:1864 quickSlotsClean:1886 quickSlotIconValid:1903 quickSlotAutoIcon:1909 _qsList:1928 _qsFindItem:1932 _qsFindSpell:1942 _qsResolve:1947 _qsItemQid:1950 _qsQty:1954 quickSlotIndex:1955 quickSlotAdd:1961 quickSlotRemove:1971 quickSlotPrune:1978 _qsBusy:1985 quickSlotConsume:1991 _qsHealFormula:2001 quickSlotUse:2007 quickSlotToggle:2032 _qsBtnHtml:2066 quickSlotIconPickFor:2073 quickSlotIconPick:2080 quickSlotIconClose:2117 quickSlotIconSet:2122 quickSlotIconUpload:2135 quickSlotIconEncode:2151 quickDockEdit:2170 quickDockCancel:2171 quickDockHint:2172 quickDockRemoveAt:2176 quickDockReplaceAt:2184 _qsRefreshCards:2195 renderQuickDock:2200 _rdNorm:2253 _rdMatch:2254 _rdFindRows:2259 byPrefix:2264 rdFindRender:2308 rdFindFocus:2320 rdFindBlur:2330 rdFindKey:2336 _rdReveal:2344 rdFindPick:2349 rdExchPreview:2365 rdExchange:2380

**app-spells.js** (2152 строк, 106 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 rdSlotStripToggle:108 rdSlotMax:112 renderRdSlotStrip:130 togglePactSlot:159 adjustPactSlots:170 syncSpellSlotsFromClass:182 updateSpellSlots:191 toggleSpellSlot:202 adjustSpellSlots:213 restoreAllSlots:224 setSpellVersion:235 _syncSpellVersionLock:246 setSpellClass:255 _charSpellClassKey:264 _charMaxCastableLevel:275 _defaultSpellVersion:283 toggleSpellOnlyAdded:289 _renderSpellOnlyAdded:293 openSpellSearch:301 markCharOwnClassFilter:320 closeSpellSearch:349 _featPickCtx:360 featAddFixedSpells:375 openFeatSpellPicker:401 _featPickProgressText:418 _renderFeatPickBar:424 featPickSetClass:445 _featPickCandidates:453 _renderFeatPickList:463 addFeatSpell:494 removeFeatSpell:514 _parseSpellClassList:537 _syncNewSpellClassChips:541 toggleNewSpellClass:548 _fillNewSpellDamageTypes:573 _toggleHidden:580 updateNewSpellMechFields:588 _hbFormulaCheck:603 _collectHbEffect:612 _spellIdArg:650 _findHomebrewSpell:656 openAddSpellForm:664 _syncCustomSpellAcrossChars:743 _purgeCustomSpellFromChars:761 deleteCustomSpell:780 _deleteCustomSpellConfirmed:789 closeAddSpellForm:803 submitNewSpell:807 renderSpellSearch:897 addSpell:970 removeSpell:992 toggleSpellCard:1006 renderMySpells:1011 _spellActiveBadgeText:1155 _spellActiveBadgeHtml:1159 updateSpellActiveBadges:1162 _prepEntries:1185 _spellPrepEntry:1200 _prepLimit:1205 calcMaxPrepared:1221 _known2014:1228 calcMaxKnownSpells:1242 _knownSpellCount:1248 calcMaxCantrips:1258 isPrepClass:1267 _subclassSpellNames:1273 spellNeedsPrep:1300 _preparedCount:1316 openSpellCardsMenu:1324 isSpellPrepared:1339 toggleSpellPrepared:1349 renderPrepCounter:1375 _castableSlotOptions:1429 _arcanumResId:1450 castSpell:1460 _castSpellWithSlot:1481 _finishCast:1519 applyCastEffects:1565 _applyCastForm:1602 openCastVariantChooser:1615 pickCastVariant:1654 closeCastVariantChooser:1664 _applyCastSummon:1677 _nextCastInstanceId:1711 _replaceCastInstance:1719 _ensureCastInstance:1749 _applyCastDamage:1769 _rollCastDamage:1796 _startCastRepeat:1861 castRepeatDamage:1875 _applyCastDebuff:1900 castSpellAttackMod:1941 castStatMod:1949 _applyCastHeal:1967 _castHealApply:1988 _applyCastTempHp:1994 applyCastTempHp:2011 _applyCastHpMaxBonus:2025 openCastChooser:2045 closeCastChooser:2066 canCastAsRitual:2079 castRitual:2101 cancelRitual:2140

**app-party.js** (2377 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:214 _pentSave:219 _pentDelete:245 _pentStatus:254 _pentExport:259 _isValidPentry:266 _pentSafeIcon:271 _pentNormalize:276 _pentImport:299 openAddAllyModal:340 openEditAllyModal:341 closeAddAllyModal:342 saveAlly:343 deleteAlly:344 setAllyStatus:345 exportAllies:346 importAllies:347 openAddNPCModal:349 openEditNPCModal:350 closeAddNPCModal:351 saveNPC:352 deleteNPC:353 setNPCStatus:354 exportNPCs:355 importNPCs:356 openAddMonsterModal:358 openEditMonsterModal:359 closeAddMonsterModal:360 saveMonster:361 deleteMonster:362 setMonsterStatus:363 exportMonsters:364 importMonsters:365 _monSigned:372 _monFormFill:373 _monFormStat:389 monsterFormRefresh:390 toggleMonsterSave:406 monsterAddAttackRow:407 _monFormRead:419 _monFormApply:433 monsterSaveBonus:444 monsterStatBlockHtml:449 monsterRoll:475 monsterAttackRoll:479 _monCatalog:490 _monCatalogIndex:496 _monCatalogPut:502 deleteCatalogMonster:512 addMonsterFromCatalog:524 _npcAttColor:544 renderNPCs:550 renderMonsters:591 _openSrdMonsterPickerLazy:646 openSrdMonsterPicker:656 openSrdMonsterPickerForBattle:658 _openSrdMonsterPickerCore:663 closeSrdMonsterPicker:706 setSrdMonsterSearch:711 setSrdMonsterCr:712 setSrdMonsterEdition:713 renderSrdMonsterPicker:715 addMonsterFromSRD:785 openSrdNpcPicker:826 _openSrdNpcPickerCore:835 closeSrdNpcPicker:856 setSrdNpcSearch:858 setSrdNpcAtt:859 renderSrdNpcPicker:861 addNpcFromSRD:892 openBattleTab:922 buildBattleSetupList:935 setBattleSearch:955 toggleBattleSection:956 renderBattleSetup:961 battleEncounterInput:1009 renderBattleDifficulty:1029 toggleBattleCheck:1054 battleDragStart:1059 battleDragOver:1060 battleDrop:1061 battleDragEnd:1069 rollInitiativeValue:1074 sortParticipantsByInitiative:1079 _findPartyMonster:1086 _participantCombatMeta:1096 _makeBattleParticipant:1121 _battleParticipantHP:1134 _addSrdMonsterToBattle:1145 _addCatalogMonsterToBattle:1175 _participantStatBlock:1199 startBattle:1207 getParticipantDesc:1229 showTrackerInfo:1252 getSelfStatusFromHP:1296 syncSelfBattleStatus:1313 renderBattleTracker:1323 renderBattleCastPanels:1416 _battleCondList:1458 _battleCondSet:1466 _battleCondMeta:1471 _battleCondDots:1474 openBattleCondPicker:1488 closeBattleCondPicker:1493 _renderBattleCondPicker:1498 toggleBattleCondition:1545 adjustBattleExhaustion:1560 adjustBattleHP:1579 setBattleHP:1593 setBattleHPMax:1624 setBattleInitiative:1635 rerollInitiative:1647 battleRollD20:1659 removeBattleParticipant:1664 setBattleStatus:1682 _battleStatusFromHp:1692 _battleSyncHpStatus:1702 offerCastDamageToBattle:1713 _castDamageTargets:1730 _castDamageAmount:1736 _renderCastDamageModal:1742 setCastDamageHalf:1805 toggleCastDamageTarget:1813 _castDamageHit:1823 applyCastDamageToTarget:1836 applyCastDamageTargets:1846 closeCastDamageModal:1856 _castHealTargets:1865 offerCastHealToBattle:1871 _renderCastHealModal:1879 toggleCastHealTarget:1924 applyCastHealTargets:1931 closeCastHealModal:1953 _castDebuffTargets:1974 offerCastDebuffToBattle:1980 _renderCastDebuffModal:1996 toggleCastDebuffTarget:2052 pickCastDebuffTarget:2062 applyCastDebuffTargets:2071 closeCastDebuffModal:2099 _battleDebuffChips:2108 removeBattleDebuff:2125 removeBattleDebuffsForSpell:2138 clearAllBattleDebuffs:2153 _logTurn:2158 _battleNewRound:2165 nextTurn:2173 _battleEconomyRow:2189 toggleBattleEconomy:2201 resetBattleEconomy:2207 prevTurn:2211 tickCastEffectsRound:2222 endBattle:2250 _dmRefEsc:2324 _dmRefGroup:2328 renderDmRef:2339 t:2343 openDmRef:2359 closeDmRef:2364 switchDmRef:2368

**app-notes.js** (1529 строк, 77 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:363 _ngRaceKey:372 _notesGenVariants:382 pick:389 join:390 many:391 list:399 notesGenerate:420 _notesSyncGenBtn:455 notesPickRandomVariant:460 _applyVariantToSection:473 _setSectionText:487 _mdToHtml:502 closeLists:514 _countStats:554 _bindSectionInputs:561 _updateStats:574 _notesHotkeys:583 notesMdInsert:598 wrap:607 linePrefix:614 notesTogglePreview:664 notesUpdateSection:683 _syncTakenFeatsLocation:698 _renderEntriesView:711 _renderEntryCard:766 notesPinDragStart:813 notesPinDragOver:823 notesPinDragLeave:832 notesPinDrop:837 notesPinDragEnd:847 _notesReorderPinned:856 notesSetTagFilter:884 notesJumpToNpc:890 notesOpenEntryModal:918 notesCloseEntryModal:952 _notesRenderModalTags:957 notesAddModalTag:969 notesModalTagKeydown:979 notesRemoveModalTag:983 notesSaveEntryModal:989 notesDeleteEntry:1037 notesTogglePin:1058 _notesLogJournal:1093 notesSearchInput:1119 notesSearchKeydown:1126 _hlText:1144 _renderSearchResults:1154 notesClearSearch:1233 notesToggleMenu:1244 _notesMenuClose:1257 notesMenuAction:1263 _notesCharName:1278 _notesTriggerDownload:1283 notesExportMd:1291 notesExportJson:1336 _notesSanitizeEntry:1348 _notesFileTooBig:1359 notesHandleImportJson:1367 _notesApplyImport:1388 notesHandleImportMd:1428 notesPrint:1464 _notesFlashSaved:1495

**app-ui.js** (1283 строк, 74 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:180 animateCountUp:186 tick:194 _reportError:217 swTelegramBlock:285 swSupportBlock:296 showUpdateModal:308 later:334 onKey:341 checkWhatsNew:351 showWhatsNewModal:363 toggleAccordion:400 initCharResources:420 getResourceMax:429 getCharResourceDefs:449 currentDieSize:479 crRow:491 crRestoreLabel:504 crResourceRow:519 crSlotRecoveryBudget:577 crSlotRecoveryActs:581 recoverSlotByResource:596 crPassiveNotes:621 rollResourceDie:630 crManeuverRows:649 crRowsHtml:666 crSetRows:703 renderClassResources:718 spendResource:736 resetResource:754 toggleResourcePip:764 resourceRollOnSpend:789 resetResourcesByRest:802 getJournal:848 addJournalEntry:853 filterJournal:875 renderJournal:882 deleteJournalEntry:918 openAddJournalEntry:927 closeAddJournalEntry:932 saveJournalEntry:935 getCompanions:955 renderCompanions:960 companionHP:1005 buildFamiliarFormOptions:1018 onCompanionTypeChange:1030 applyFamiliarForm:1038 openAddCompanionModal:1050 summonFamiliar:1067 openPrefilledCompanionModal:1077 openEditCompanionModal:1088 closeAddCompanionModal:1108 saveCompanion:1111 deleteCompanion:1136 switchProfilesTab:1152 clipChangelogText:1167 expandChangelogItem:1178 clCleanText:1190 renderChangelog:1196 openItemRef:1241 closeItemRef:1246 switchItemRef:1251 _syncHeaderHeight:1269

**app-dice.js** (1713 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1359 _diceShapeSvg:1393 renderDiceFan:1400 _paintSelectedDie:1419 _diceHeroSvg:1443 _paintDiceMode:1453 selectDie:1468 rollSelectedDie:1487 toggleDiceFormulaPanel:1496 _savedRollFormula:1515 _savedRollsClean:1518 _savedRollNewId:1533 _savedRollLabel:1536 renderSavedRolls:1540 savedRollRoll:1560 savedRollTap:1567 savedRollEdit:1583 savedRollCancel:1600 savedRollSubmit:1605 savedRollDelete:1626 savedRollFromDice:1644 _diceHotkeys:1665

**app-settings.js** (897 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:112 _accentForClass:124 _applyClassAccent:127 _refreshAccent:130 setAutoAccent:138 _syncAutoAccentToggle:143 getEdition:159 setEdition:167 _syncEditionButtons:176 _getStatsLayout:193 _applyStatsLayout:200 _statsInCards:207 _statsRowTarget:211 _placeStatRows:229 setStatsLayout:245 _syncStatsLayoutButtons:252 _getSheetLock:266 setSheetLock:270 _syncSheetLockButtons:275 _wakeLockSupported:286 _getWakeLockOn:287 _applyWakeLock:291 setWakeLock:306 _syncWakeLockButtons:311 _getHeaderAutohideOn:321 setHeaderAutohide:324 _syncHeaderAutohideButtons:329 _getTrackXpOn:337 _applyTrackXp:340 setTrackXp:343 _syncTrackXpButtons:348 _getAttackDamageOn:369 setAttackDamage:372 _syncAttackDamageButtons:376 isEditionSplit:385 setEditionSplit:388 _syncEditionSplitButtons:393 openBooksScreen:403 _bookRowHtml:407 _renderBooksScreen:417 setBookOn:442 setBooksPreset:448 _afterBooksChange:455 _syncBooksSummary:467 _getStatsCollapsed:481 _applyStatsCollapsed:484 toggleStatsCollapsed:489 _getStoredDensity:503 _getDefaultDensity:511 _getDensity:518 _applyDensity:521 setDensity:525 _syncDensityButtons:531 _onViewportDensityChange:539 _getFontScale:557 _applyFontScale:564 setFontScale:575 _syncFontScaleUi:586 _getGlassAlpha:601 _getGlassBlur:608 _applyGlassAlpha:615 _applyGlassBlur:616 setGlassAlpha:617 setGlassBlur:627 _syncGlassUi:636 _getSpaceMode:685 _applySpaceBg:692 setSpaceMode:707 _syncSpaceButtons:713 _spaceOnScroll:732 _applyDymkaIcons:760 _initAppLinks:773 openSupportLink:805 _isStandalone:817 _isIos:823 _installMode:827 _syncInstallUi:832 installApp:845 openSettingsModal:869 closeSettingsModal:884

**app-asi.js** (861 строк, 42 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:573 removeFeat:620 _agBonus:657 _agPbSpent:667 _agBase:673 _agReady:680 openAbilGen:684 _agInit:694 agSetMode:707 agPb:713 _agSwap:723 agStd:730 agPick:736 agRoll:742 _agCtl:755 owner:766 _agRender:781 agApply:834 _agCommit:842

**app-progress.js** (896 строк, 50 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:309 _pgNext:325 _pgClassWord:379 _pgAvailableClasses:388 _pgActions:401 _pgBuild:419 openProgressTab:432 openProgress:442 pgTabActive:453 pgRefresh:460 pgSetSubclass:468 pgFocusSubclass:482 pgLevelUp:499 pgLevelDown:504 pgAfterLevelModal:510 pgAddClass:521 renderClassDev:535 _pgSheetAboutRow:554 _pgSubclassRows:572 syncClassFieldUI:598 openFeatureInfo:641 _fiRuleNotes:684 _mlTotal:723 _mlMissing:728 openMcLayout:734 mlSetClass:746 mlLevel:754 mlSetSub:763 mlAdd:768 mlRemove:774 _mlRender:780 _mlPruneAsi:845 mlApply:856

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

**data.js** (8130 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:128 SAVES_DATA:150 CONDITIONS:159 EFFECTS_DATA:182 CLASS_FEATURES:233 SPELL_PREP_CLASSES:483 CANTRIPS_KNOWN_2014:491 SPELLS_KNOWN_2014:499 SPELL_SLOTS_BY_LEVEL:506 CLASS_HIT_DICE:581 SUBCLASSES:587 SOURCE_LABELS:607 SUBCLASS_SOURCE:634 BOOK_CODES:703 _booksOffCache:706 SUBCLASS_LEVEL:747 SUBCLASS_FEATURES:763 WEAPON_PRESETS:1555 ITEM_ICONS:1599 CATEGORY_NAMES:1600 GEAR_PACKS:1609 RACE_DATA:1704 BACKGROUND_SKILLS:2321 BACKGROUND_ALIASES:2400 DEITY_ALIGN_LABELS:2413 DEITIES_DATA:2418 LANGUAGE_CATALOG:2486 RACE_LANGUAGES:2523 CLASS_LANGUAGES:2625 TOOL_CATALOG:2631 RACE_TOOLS:2686 CLASS_TOOLS:2698 SUBCLASS_LANGUAGES:2706 SUBCLASS_TOOLS:2729 RACE_ARMOR:2751 RACE_WEAPONS_SPECIFIC:2757 CLASS_WEAPONS_SPECIFIC:2773 RACE_NAME_POOLS:2786 RACE_NAME_GROUP:2828 SUBCLASS_ARMOR:2843 ARMOR_PRESETS:2874 skills:2891 ABILITY_INFO:2904 CLASS_SKILL_OPTIONS:2944 CLASS_SKILL_COUNT:2959 CLASS_SKILL_MC_COUNT:2960 CLASS_ARMOR_PROFS:2963 CLASS_RESOURCES:2983 ASI_LEVELS:3145 XP_THRESHOLDS:3153 APP_VERSION:3163 APP_VERSION_DATE:3164 APP_TELEGRAM_URL:3170 APP_BOOSTY_URL:3171 FEATS_DATA:3192 APP_CHANGELOG:3514 CASTER_TYPE:7958 THIRD_CASTER_SUBCLASSES:7967 THIRD_CASTER_SLOTS:7974 MULTICLASS_SPELL_SLOTS:7985 MULTICLASS_PREREQUISITES:8010 MULTICLASS_PROFICIENCIES:8028 EDITION_DATA:8057

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (872 строк)  
SPELL_EFFECTS:71

**class-choices.js** (732 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

