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
| index.html — блоки верхнего уровня (`#id:строки`) | 130–174 |
| Функции по файлам (`имя:строка`) | 175–248 |
| Данные — константы верхнего уровня (`имя:строка`) | 249–265 |


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
| 14124–14235 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 14236–14371 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 14372–14572 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 14573–14581 | STYLE-8b3-fix: срезанный ромб |
| 14582–14849 | STYLE-8b3b: два оставшихся блока «Магии» |
| 14850–15310 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 15311–15345 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 15346–17034 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:93-94 #conditions-popup-overlay:95-95 #conditions-popup:96-100 #conditions-popup-list:101-104 #drawer-overlay:105-106 #side-drawer:107-144 #screen-settings:145-236 #header-autohide-row:237-253  
#wake-lock-row:254-284 #edition-row:285-307 #install-row:308-318 #welcome-modal:319-323 #welcome-step-1:324-342 #welcome-step-2:343-377 #header-avatar:378-383 #status-bar:384-387  
#status-inspiration:388-388 #status-concentration:389-391 #status-ritual:392-394 #status-conditions-btn:395-408 #screen-home:409-411 #home-art:412-439 #home-sub-new:440-487 #home-install:488-495  
#home-hero:496-496 #home-hero-emblem:497-500 #home-hero-sub:501-501 #home-hero-chips:502-512 #screen-characters:513-552 #char-hero:553-553 #char-hero-emblem:554-557 #char-hero-sub:558-558  
#char-hero-chips:559-559 #char-hero-actions:560-568 #screen-data:569-585 #backup-panel:586-590 #backup-list:591-592 #sync-row:593-593 #storage-status:594-605 #screen-about:606-609  
#app-version-row:610-617 #ptab-info:618-625 #app-links-row:626-629 #app-legal-note:630-635 #ptab-changelog:636-641 #changelog-list:642-648 #screen-character:649-649 #tab-sheet:650-652  
#creation-wizard-banner:653-660 #cw-edition-row:661-670 #cw-validation:671-673 #basic-locked-bar:674-683 #creation-todo:684-693 #sheet-avatar:694-706 #char-build-badge-wrap:707-721 #char-class-mc:722-746  
#char-subclass-rec:747-747 #char-subclass-mc:748-956 #char-books:957-961 #race-bonus-display:962-962 #race-extras-panel:963-963 #class-skills-panel:964-965 #background-feature-display:966-967 #bg-extras-panel:968-1011  
#abilgen-row:1012-1018 #stats-collapse-btn:1019-1026 #abilities-region:1027-1030 #proficiency-bonus-2024:1031-1032 #insp-card-2024:1033-1042 #abil-col-1:1043-1043 #stat-block-str:1044-1045 #mod-str:1046-1052  
#abil-save-slot-str:1053-1053 #abil-skills-slot-str:1054-1056 #stat-block-dex:1057-1058 #mod-dex:1059-1065 #abil-save-slot-dex:1066-1066 #abil-skills-slot-dex:1067-1069 #stat-block-int:1070-1071 #mod-int:1072-1078  
#abil-save-slot-int:1079-1079 #abil-skills-slot-int:1080-1083 #abil-col-2:1084-1084 #stat-block-con:1085-1086 #mod-con:1087-1093 #abil-save-slot-con:1094-1094 #abil-skills-slot-con:1095-1097 #stat-block-wis:1098-1099  
#mod-wis:1100-1106 #abil-save-slot-wis:1107-1107 #abil-skills-slot-wis:1108-1110 #stat-block-cha:1111-1112 #mod-cha:1113-1119 #abil-save-slot-cha:1120-1120 #abil-skills-slot-cha:1121-1134 #saves-grid:1135-1144  
#skills-container:1145-1147 #passive-perception:1148-1167 #ws-hp-banner:1168-1173 #hp-dmg-row:1174-1183 #hp-dmg-body:1184-1204 #death-saves-section:1205-1236 #hp-armor-body:1237-1278 #hp-hd-body:1279-1292  
#hp-rest-body:1293-1320 #class-dev-section:1321-1323 #cd-head:1324-1324 #cd-res:1325-1325 #cd-attn:1326-1327 #cd-about:1328-1336 #ac-formula:1337-1338 #ac-modifiers:1339-1346  
#conditions-grid:1347-1354 #effects-grid:1355-1362 #resistances-container:1363-1371 #prof-card:1372-1375 #armor-prof-container:1376-1379 #weapon-prof-container:1380-1383 #tools-container:1384-1387 #languages-container:1388-1395  
#companions-list-sheet:1396-1408 #tab-progress:1409-1410 #pg-body:1411-1412 #tab-spells:1413-1415 #spell-stat-card:1416-1437 #spell-mod-display:1438-1443 #spell-dc-display:1444-1449 #spell-attack-display:1450-1455  
#spell-stats-by-class:1456-1467 #spell-slots-card:1468-1472 #spell-slots-visual:1473-1479 #concentration-block:1480-1497 #rd-find-spl-wrap:1498-1498 #prep-counter:1499-1499 #my-spells-list:1500-1501 #rd-slot-strip:1502-1503  
#tab-inventory:1504-1507 #rd-find-inv-wrap:1508-1524 #weight-fill:1525-1559 #inventory-list:1560-1564 #inv-coins-card:1565-1569 #rd-exch:1570-1580 #inv-pouches:1581-1636 #tab-notes:1637-1663  
#notes-subtabs:1664-1665 #notes-main:1666-1667 #taken-feats-section:1668-1672 #taken-feats-list:1673-1676 #tab-party:1677-1686 #my-char-card:1687-1700 #allies-list:1701-1715 #npcs-list:1716-1731  
#monsters-list:1732-1743 #companions-list-world:1744-1754 #tab-battle:1755-1760 #weapons-list:1761-1763 #ws-card:1764-1766 #saved-roll-form:1767-1773 #saved-roll-err:1774-1775 #saved-rolls-list:1776-1779  
#battle-res-card:1780-1781 #battle-res-rows:1782-1783 #battle-setup-screen:1784-1794 #battle-setup-list:1795-1795 #battle-difficulty:1796-1799 #battle-tracker-screen:1800-1804 #battle-turn-info:1805-1810 #battle-repeat-strip:1811-1811  
#battle-tracker-list:1812-1821 #tab-journal:1822-1836 #journal-list:1837-1843 #screen-itemref:1844-1846 #item-ref-tabs:1847-1852 #item-ref-weight:1853-1891 #item-ref-slots:1892-1923 #screen-dmref:1924-1926  
#dm-ref-tabs:1927-1931 #dm-ref-ed:1932-1932 #dm-ref-cond:1933-1933 #dm-ref-combat:1934-1934 #dm-ref-world:1935-1939 #screen-help:1940-1962 #help-about:1963-1986 #help-start:1987-2011  
#help-sheet:2012-2035 #help-progress:2036-2081 #help-spells:2082-2098 #help-inventory:2099-2111 #help-battle:2112-2136 #help-party:2137-2153 #help-notes:2154-2162 #help-journal:2163-2171  
#help-planes:2172-2199 #help-dice:2200-2211 #help-edition2024:2212-2251 #help-data:2252-2268 #help-marks:2269-2291 #conc-details-modal:2292-2302 #conc-detail-duration-row:2303-2310 #conc-detail-desc-row:2311-2320  
#add-journal-modal:2321-2344 #add-npc-modal:2345-2374 #add-ally-modal:2375-2412 #screen-monsters:2413-2425 #srd-monster-count:2426-2426 #srd-monster-results:2427-2431 #srd-npc-modal:2432-2441 #srd-npc-count:2442-2442  
#srd-npc-results:2443-2450 #screen-monsterform:2451-2488 #monster-cr-note:2489-2491 #monster-stats:2492-2493 #monster-saves:2494-2495 #monster-attacks:2496-2519 #screen-rest:2520-2522 #rest-main-screen:2523-2524  
#rest-card-short:2525-2527 #hit-dice-section:2528-2529 #hit-dice-controls-total:2530-2534 #hit-dice-by-size:2535-2540 #rest-card-long:2541-2543 #rest-food-section:2544-2554 #rest-result-screen:2555-2557 #rest-result-details:2558-2566  
#screen-levelup:2567-2571 #lu-screen-multiclass:2572-2573 #lu-mc-current-classes:2574-2576 #lu-mc-new-class:2577-2581 #lu-mc-prereq-warn:2582-2582 #lu-mc-subclass-row:2583-2591 #lu-screen-preview:2592-2624 #lu-slots-card:2625-2626  
#lu-slots-info:2627-2630 #lu-build-hint:2631-2631 #lu-features-container:2632-2640 #lu-screen-choices:2641-2642 #lu-choices-body:2643-2649 #lu-screen-result:2650-2651 #lu-result-title:2652-2652 #lu-result-body:2653-2659  
#screen-wildshape:2660-2665 #ws-limits:2666-2666 #ws-results:2667-2670 #screen-hphistory:2671-2673 #hp-history-list:2674-2679 #asi-modal:2680-2684 #asi-build-hint:2685-2699 #asi-feat-list:2700-2700  
#asi-stat-grid:2701-2701 #asi-preview:2702-2710 #class-choice-modal:2711-2726 #dice-modal:2727-2759 #dice-file-hint:2760-2760 #dice3d-result:2761-2772 #dice-result-display:2773-2786 #dice-pick-hint:2787-2787  
#dice-mode-segment:2788-2792 #dice-formula-panel:2793-2810 #dice-fan:2811-2819 #dice-popover-settings:2820-2867 #dice-popover-history:2868-2879 #dice-history:2880-2888 #screen-spellsearch:2889-2891 #spell-feat-bar:2892-2907  
#spell-ver-filter:2908-2914 #spell-class-filter:2915-2947 #class-filter-legend:2948-2949 #spell-search-count:2950-2951 #spell-search-results:2952-2955 #cast-spell-modal:2956-2960 #cast-spell-options:2961-2963 #add-spell-modal:2964-3007  
#new-spell-class-chips:3008-3054 #new-spell-mech-fields:3055-3059 #new-spell-mech-dmg-row:3060-3079 #new-spell-mech-half-row:3080-3082 #new-spell-mech-mod-row:3083-3093 #subclass-modal:3094-3105 #subclass-features:3106-3114 #item-modal:3115-3159  
#item-armor-fields:3160-3185 #coin-exchange-modal:3186-3224 #exch-preview:3225-3231 #screen-magiccatalog:3232-3259 #magic-catalog-count:3260-3260 #magic-catalog-list:3261-3264 #screen-gearcatalog:3265-3269 #gear-packs-list:3270-3283  
#gear-catalog-count:3284-3284 #gear-catalog-list:3285-3289 #weapon-modal:3290-3293 #weapon-picker-section:3294-3296 #weapon-filter-chips:3297-3306 #weapon-presets-list:3307-3307 #weapon-pick-bar:3308-3371 #rd-quick-dock:3372-3372  
#character-tabs:3373-3391 #quick-roll-strip:3392-3397 #qrs-list:3398-3408 #active-effects-panel:3409-3413 #aef-list:3414-3420 #hp-toast-container:3421-3423 #add-companion-modal:3424-3440 #companion-familiar-row:3441-3461  
#mob-sheet:3462-3465 #mob-sheet-list:3466-3469 #confirm-modal:3470-3483 #avatar-modal:3484-3487 #avatar-modal-preview:3488-3515 #screen-builds:3516-3543 #bp-list:3544-3548 #screen-buildguide:3549-3551  
#bg-body:3552-3556 #screen-buildplan:3557-3559 #bp-plan-body:3560-3564 #screen-abilityinfo:3565-3567 #ai-body:3568-3572 #screen-abilgen:3573-3575 #ag-body:3576-3580 #screen-books:3581-3583  
#books-body:3584-3588 #screen-mclayout:3589-3591 #ml-body:3592-3596 #screen-featureinfo:3597-3599 #fi-body:3600-3604 #screen-creator:3605-3607 #cr-progress:3608-3608 #cr-body:3609-3619  
#app-log-panel:3620-3639 #app-log-list:3640-3821 #notes-entry-modal:3822-3870  

## Функции по файлам (`имя:строка`)

**rules.js** (1822 строк, 122 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:327 rulesAuraOfProtection:346 rulesClassSaveProf:355 rulesAttuneLimit:361 rulesSoulOfArtifice:367 rulesSaveBonus:372 rulesDivineSmiteFormula:381 rulesSkillBonus:388 rulesPassivePerception:403 rulesSpellStats:407 _spellStatMod:434 rulesSpellStatsByClass:442 rulesWeaponMods:460 rulesOffhandDamageMod:476 armorPenalties:485 rulesItemArmor:500 rulesArmorItem:512 rulesAC:523 charCasterLevel:705 classSpellSlotRow:749 getMulticlassSpellSlots:762 rulesRestoreLevelFields:798 rulesApplySpellSlots:817 resolvePactSlots:840 restoreItemCharges:850 rulesHitDieSides:867 rulesShortRest:873 rulesLongRestBlockReason:908 rulesLongRest:921 rulesExhaustionLevel:987 rulesEffectiveHpMax:993 _dsReset:998 _dsCount:999 _dsFill:1000 _condAdd:1001 _condRemove:1002 rulesIsDead:1004 rulesIsStable:1008 rulesRegainFromZero:1013 rulesSetHp:1019 rulesDamageAfterDefenses:1031 rulesApplyDamage:1043 rulesDeathSaveBlockReason:1080 rulesDeathSave:1087 rulesConditionRollMods:1106 rulesEffectiveSpeed:1123 rulesArmorStealthDisadv:1144 rulesFeatPrereqMissing:1153 rulesFeatStatChoice:1180 rulesFeatStatOptions:1188 rulesFeatSlotCount:1201 rulesFeatSpellFits:1206 rulesFeatSpellCandidates:1217 rulesFeatSpellLabel:1221 rulesFeatSpellProgress:1226 rulesFeatClassOptions:1251 rulesFeatFreeResId:1264 rulesResetFeatFree:1267 concSaveParams:1278 rulesCrToXp:1320 rulesCrToProf:1326 rulesCrValue:1333 rulesWildShapeLimits:1344 rulesPolymorphLimits:1368 rulesCombatWildShapeHeal:1373 rulesBeastAllowed:1378 rulesFormStart:1385 rulesFormOwnHp:1399 rulesFormDamage:1404 rulesFormHeal:1419 rulesEncounterMultiplier:1426 rulesEncounterDifficulty:1435 getCharClassPairs:1459 charEditionMismatch:1473 findLangInCatalog:1481 ensureLanguagesArray:1493 recalcLanguagesFromSources:1509 add:1514 findToolInCatalog:1559 ensureToolsArray:1571 getBackgroundDef:1592 validateBgStatChoice:1628 parseBackgroundToolEntry:1648 recalcToolsFromSources:1663 add:1668 ensureArmorWeaponFields:1733 recalcArmorWeaponFromSources:1746 addArmor:1752 addWeapon:1753 addSpec:1802

**app-core.js** (1876 строк, 88 функций)  
$:8 fmtNum:10 getCurrentChar:15 openModal:17 _syncModalOpenFlag:26 closeModal:35 debounce:46 localDateStamp:69 migrateToMulticlass:80 syncClassFields:94 isMulticlass:102 getClassLabel:107 getClassLine:116 checkMulticlassPrereqs:126 check:129 autoFillItemWeight:173 setItemQty:190 _openFromLaunchParams:271 _blockSaving:286 _loadCharsSafe:300 _onStorageChange:315 _stampCurrentCharUpdated:334 saveToLocal:348 initPersistentStorage:372 _formatStorageBytes:393 updateStorageStatus:401 currentScreenName:463 screenBack:469 _modalVisible:488 _closeOpenModals:491 headerBack:501 _rdScreenOpen:529 initRdScreens:532 _screenMotionOk:577 _screenGhostDrop:583 _screenGhostStart:595 _screenEnter:613 _purgeDraftChars:624 showScreen:637 updateHeaderTitle:752 syncDrawerHeader:806 switchTab:818 _rdSheetView:857 openDrawer:876 closeDrawer:889 showCharacterNav:901 hideCharacterNav:909 isInteractive:929 currentActiveTab:952 scrolledDown:1017 closeAction:1024 reset:1031 end:1064 createNewCharacter:1084 getClassColor:1107 getClassIcon:1123 getAbilityIcon:1130 getConditionIcon:1145 getConditionChipIcon:1169 getSpellClassIcon:1187 getSchoolSlug:1204 getSchoolIcon:1208 stripLeadingEmoji:1221 formatTimeAgo:1225 setCharSort:1239 setCharSearch:1246 duplicateCharacter:1250 exportOneCharacter:1262 updateCharCounter:1269 onDragStart:1286 onDragOver:1287 onDrop:1288 renderCharacterList:1299 renderCharPlate:1386 deleteCharacter:1449 showConfirmModal:1463 safeSet:1510 safeSetChecked:1514 loadCharacter:1523 showToast:1716 showFieldError:1733 clearFieldError:1755 toastAddAction:1765 emptyStateHtml:1783 openHPHistory:1794 closeHPHistory:1822 updateVersionBlock:1827 forceAppUpdate:1858

**app-migrate.js** (1052 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1044

**app-builds.js** (1760 строк, 49 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 bpRoleLabel:53 renderBuildPicker:61 renderBuildBadge:139 renderEditionBadge:155 openBuildBadgeMenu:168 unlinkBuild:174 _setCharBuildId:184 _stemSet:201 _matchByStems:207 _weaponMatchNames:215 _findWeapon:218 _findArmorPreset:243 placeStartingItem:260 confirmApplyBuild:386 applyBuild:396 _applyBuildCore:419 _pick:929 _glossNorm:1041 _reEscape:1042 _glossEd:1043 _glossBuild:1044 ingest:1046 _glossIndex:1068 glossarizeHtml:1076 _glossPopoverEl:1090 hideGlossPopover:1102 showGlossPopover:1107 _glossBindOnce:1126 openBuildGuide:1157 gx:1180 _list:1181 getBuildLevelRec:1244 getBuildRecChoiceOption:1249 getBuildRecChoiceIds:1257 getBuildRecFeat:1262 getBuildRecAsi:1272 getBuildRecSubclass:1279 parseAsiFromHeadline:1287 _buildFeatNameMap:1301 parseFeatFromHeadline:1343 parseSpellsFromHeadline:1360 getBuildRecSpellObjs:1606 openBuildPlan:1626 _cpSubclassOf:1679 _cpClassSwitch:1690 openClassPlan:1705

**app-io.js** (720 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:104 _normalizeImportedSpell:113 _isValidImportedSpell:124 _collectCharUserSpells:128 _ingestImportedUserSpells:146 _spellBaseById:192 _unpackSpell:200 _countUnresolvedSpells:222 _unresolvedNote:230 _importTooNew:235 _packSpell:244 _packCharForExport:255 _unpackCharSpells:262 _buildCharEnvelope:268 _charExportFileName:283 _downloadText:286 _shareableFile:297 shareOneCharacter:308 copyCharToClipboard:325 pasteCharFromClipboard:338 _extractCharsFromImport:356 _applyFullRestore:368 _warnEditionMix:412 run:413 importData:428 importOneCharacter:487 _importOneCharText:504 _consumeLaunchFiles:585 _importLaunchText:618 exportSpells:625 importSpells:634 exportSessionLog:707

**app-combat.js** (3421 строк, 154 функций)  
showRollModePopup:10 rollHintText:39 rollD20WithMode:51 formatRollMode:66 formatRollModeLabel:81 showDualDice:88 formatDiceInfoStr:106 rollSavingThrow:119 rollAbilityCheck:134 rollSkillCheck:148 initSaves:167 autoSelectProficiencies:202 initSkills:245 toggleAbilOpen:273 abilityBreakdown:285 openAbilityInfo:313 toggleExpertise:348 loadExpertise:367 updateSkillProfCount:381 updateSkillSources:393 updateClassFeatures:417 calculateAC:432 toggleInspiration:493 updateStatusCounter:506 updateStatusBar:520 updateInspirationLabels:562 updateStatDisplay:579 updateAllStatDisplays:584 adjustStat:588 adjustCoin:611 renderCoinMob:625 openCoinSheet:635 setCoinFromSheet:645 updateCoinTotal:652 openCoinExchange:664 closeCoinExchange:669 previewExchange:673 coinExchangeCalc:701 confirmExchange:706 updateSubclassOptions:729 updateSubclassRecHint:793 featHpPerLevel:808 featHpFlat:817 recalculateHP:826 updateChar:881 toggleProficiency:948 calcStats:971 setSpellStat:1042 calcSpellStats:1053 _toggleNonCasterCards:1105 showSpellCasterCards:1116 onRaceChange:1124 renderBooksRow:1259 openMobSheet:1286 closeMobSheet:1293 mobSheetActs:1295 openBooksSheet:1300 toggleCharBook:1310 populateRaceSelect:1327 _speciesEffective:1360 _renderSpeciesBar:1373 _speciesChoiceOptions:1388 toggleSpeciesChoice:1395 syncSpeciesSpells:1409 rollRandomName:1455 pick:1463 build:1464 _raceSkillAllowance:1531 _raceFlexCount:1541 _raceFlexFits:1547 _raceFlexApply:1554 _setExtrasHtml:1564 renderRaceExtras:1573 toggleHalfElfStat:1744 toggleRaceFlexStat:1770 setRaceVariableTrait:1800 _raceSkillSet:1817 _pickHide:1827 _pickExpandBtn:1831 pickExpand:1834 raceLangGoto:1841 toggleRaceSkill:1849 _classSkillList:1878 _skillsFromOtherSources:1891 _skillsByName:1900 _skillTakenElsewhere:1906 _classSkillHeld:1920 _classSkillSync:1926 renderClassSkills:1957 toggleClassSkill:2004 openRaceFeatModal:2032 removeRaceFeat:2052 applyBasicLockUI:2087 _cwEditionBusy:2121 syncCwEdition:2126 setDraftEdition:2138 updateLockButtonState:2148 lockBasicInfo:2186 unlockBasicInfo:2207 isSheetLocked:2237 sheetLockGuard:2243 applySheetLockUI:2249 _creationTodo:2280 add:2284 src:2285 scheduleCreationTodo:2357 renderCreationTodo:2362 creationTodoGo:2389 openLockSheet:2401 _creationUiReset:2414 _isMobSheet:2415 renderIdentitySummary:2416 toggleIdentityMore:2435 renderProfSummary:2439 toggleProfCard:2454 openAcSheet:2460 _mobMarkClamp:2468 init:2477 lockSheet:2498 doLock:2502 unlockSheet:2515 onBackgroundChange:2536 _bgSkillsOf:2581 _bgUncheckOld:2588 _bgCheckSkills:2596 renderBackgroundFeature:2608 _bgStatShort:2653 populateBackgroundSelect:2656 _bgRevertStatChoice:2687 _bgAppliedStat:2700 _bgApplyStat:2705 setBgStatMode:2717 toggleBgStat:2729 _bgAfterStats:2752 _bgRevertFeatEffects:2763 syncOriginFeat:2788 toggleBgCustom:2824 _toggleBgCustom14:2864 toggleBgSkillPick:2911 _renderBgCustom14:2938 giveBackgroundEquipment:2975 renderBackgroundExtras:3020 _armorFromSelect:3128 renderArmorSelect:3140 onArmorPick:3175 onShieldPick:3189 onArmorChange:3208 onManualAC:3237 onManualMaxHP:3244 calcCoinWeight:3267 getActiveConditionsForRender:3281 toggleConditionsPopup:3310 closeConditionsPopup:3322 renderConditionsPopup:3328

**app-conditions.js** (505 строк, 28 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:303 loadConditions:312 refreshSaveBonuses:321 _fxMatches:338 setEffectsSearch:343 setEffectsType:344 toggleEffectsActiveOnly:352 renderEffectsGrid:358 initEffects:441 toggleEffect:461 updateEffectsCount:490 loadEffects:499

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

**app-ui.js** (1368 строк, 80 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:180 animateCountUp:186 tick:194 _reportError:217 swProgressToast:248 swProgressToastRemove:261 swInstallFailed:265 swWatchFirstInstall:278 swRegister:308 swTelegramBlock:343 swSupportBlock:354 showUpdateModal:366 later:392 onKey:399 checkWhatsNew:409 showWhatsNewModal:421 toggleAccordion:458 initCharResources:478 getResourceMax:487 getCharResourceDefs:508 currentDieSize:538 crRow:550 crRestoreLabel:563 crResourceRow:578 crSlotRecoveryBudget:638 crSlotRecoveryActs:642 recoverSlotByResource:657 crPassiveNotes:682 rollSneakAttack:691 rollResourceDie:715 crManeuverRows:734 crRowsHtml:751 crSetRows:788 renderClassResources:803 spendResource:821 resetResource:839 toggleResourcePip:849 resourceRollOnSpend:874 resetResourcesByRest:887 getJournal:933 addJournalEntry:938 filterJournal:960 renderJournal:967 deleteJournalEntry:1003 openAddJournalEntry:1012 closeAddJournalEntry:1017 saveJournalEntry:1020 getCompanions:1040 renderCompanions:1045 companionHP:1090 buildFamiliarFormOptions:1103 onCompanionTypeChange:1115 applyFamiliarForm:1123 openAddCompanionModal:1135 summonFamiliar:1152 openPrefilledCompanionModal:1162 openEditCompanionModal:1173 closeAddCompanionModal:1193 saveCompanion:1196 deleteCompanion:1221 switchProfilesTab:1237 clipChangelogText:1252 expandChangelogItem:1263 clCleanText:1275 renderChangelog:1281 openItemRef:1326 closeItemRef:1331 switchItemRef:1336 _syncHeaderHeight:1354

**app-dice.js** (1713 строк, 83 функций)  
openDiceModal:6 _prewarmDiceBox:60 openDiceModalForRoll:75 closeDiceModal:82 _diceModalActive:98 showDiceRollOverlay:104 hideDiceRollOverlay:118 toggleDicePopover:126 closeDicePopovers:149 clearDiceHistory:159 _diceHistoryRefresh:175 resetDiceResult:181 _updateDiceHistoryBadge:193 rollCustomFormulaFromMain:206 diceInsertToken:210 diceFormulaBackspace:216 setDiceMode:235 rollDiceWithSelectedMode:242 rollDice:246 _quickRollCompute:341 _quickRollModStr:360 _emitDiceRolled:366 _setDiceSettled:374 _setSettledDice:384 _quickRollRecord:401 _quickRollInfoText:408 _quickRollToastText:415 _rollSrc:433 quickRoll:440 renderQuickRollStrip:501 updateQuickRollStripVisibility:524 dismissQuickRollStrip:540 openDiceRollHistory:545 drawDiceSVG:558 _waitDiceBoxModule:577 _diceLsGet:597 _getAccentColor:605 _getDiceTheme:624 _getDiceThemeColor:631 setDiceTheme:634 _syncDiceThemeButtons:640 _getDiceBg:650 setDiceBg:657 _syncDiceBgButtons:663 _diceDbg:673 _initDiceBox:678 _diceFaceValue:773 animateDice3d:795 animateDice2d:999 buildDie:1025 tick:1093 _applyDiceCritGlow:1116 parseDiceFormula:1137 _formulaCanon:1173 _renderFormulaResult:1185 rollFormula:1221 _rollFormulaFrom:1303 _diceFieldErrOpts:1318 diceFormulaBlur:1324 rollCustomFormula:1334 renderDiceHistory:1337 createParticles:1359 _diceShapeSvg:1393 renderDiceFan:1400 _paintSelectedDie:1419 _diceHeroSvg:1443 _paintDiceMode:1453 selectDie:1468 rollSelectedDie:1487 toggleDiceFormulaPanel:1496 _savedRollFormula:1515 _savedRollsClean:1518 _savedRollNewId:1533 _savedRollLabel:1536 renderSavedRolls:1540 savedRollRoll:1560 savedRollTap:1567 savedRollEdit:1583 savedRollCancel:1600 savedRollSubmit:1605 savedRollDelete:1626 savedRollFromDice:1644 _diceHotkeys:1665

**app-settings.js** (898 строк, 90 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:57 _applyAccent:64 setAccent:71 _syncAccentButtons:82 _getAutoAccent:113 _accentForClass:125 _applyClassAccent:128 _refreshAccent:131 setAutoAccent:139 _syncAutoAccentToggle:144 getEdition:160 setEdition:168 _syncEditionButtons:177 _getStatsLayout:194 _applyStatsLayout:201 _statsInCards:208 _statsRowTarget:212 _placeStatRows:230 setStatsLayout:246 _syncStatsLayoutButtons:253 _getSheetLock:267 setSheetLock:271 _syncSheetLockButtons:276 _wakeLockSupported:287 _getWakeLockOn:288 _applyWakeLock:292 setWakeLock:307 _syncWakeLockButtons:312 _getHeaderAutohideOn:322 setHeaderAutohide:325 _syncHeaderAutohideButtons:330 _getTrackXpOn:338 _applyTrackXp:341 setTrackXp:344 _syncTrackXpButtons:349 _getAttackDamageOn:370 setAttackDamage:373 _syncAttackDamageButtons:377 isEditionSplit:386 setEditionSplit:389 _syncEditionSplitButtons:394 openBooksScreen:404 _bookRowHtml:408 _renderBooksScreen:418 setBookOn:443 setBooksPreset:449 _afterBooksChange:456 _syncBooksSummary:468 _getStatsCollapsed:482 _applyStatsCollapsed:485 toggleStatsCollapsed:490 _getStoredDensity:504 _getDefaultDensity:512 _getDensity:519 _applyDensity:522 setDensity:526 _syncDensityButtons:532 _onViewportDensityChange:540 _getFontScale:558 _applyFontScale:565 setFontScale:576 _syncFontScaleUi:587 _getGlassAlpha:602 _getGlassBlur:609 _applyGlassAlpha:616 _applyGlassBlur:617 setGlassAlpha:618 setGlassBlur:628 _syncGlassUi:637 _getSpaceMode:686 _applySpaceBg:693 setSpaceMode:708 _syncSpaceButtons:714 _spaceOnScroll:733 _applyDymkaIcons:761 _initAppLinks:774 openSupportLink:806 _isStandalone:818 _isIos:824 _installMode:828 _syncInstallUi:833 installApp:846 openSettingsModal:870 closeSettingsModal:885

**app-asi.js** (900 строк, 43 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:80 buildASIStatGrid:92 getASIMode:113 toggleASIStat:118 updateASIPreview:149 getFeatDef:220 _featPickerList:238 buildFeatList:250 filterFeatList:282 _asiFeatPreview:298 _asiFeatBlocked:318 _featStatPickHtml:331 _asiFeatReady:344 selectFeatStat:348 selectFeat:353 asiPruneToLevel:368 _asiUnlockSheet:381 _asiShowStatModes:390 _statGain:401 applyASI:407 renderTakenFeats:574 removeFeat:631 featSkillPick:660 _agBonus:695 _agPbSpent:705 _agBase:711 _agReady:718 openAbilGen:723 _agInit:733 agSetMode:746 agPb:752 _agSwap:762 agStd:769 agPick:775 agRoll:781 _agCtl:794 owner:805 _agRender:820 agApply:873 _agCommit:881

**app-progress.js** (1070 строк, 65 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:253 _pgClassRow:266 _pgClasses:310 _pgNext:326 _pgClassWord:380 _pgAvailableClasses:389 _pgActions:402 _pgBuild:420 openProgressTab:433 openProgress:443 pgTabActive:454 pgRefresh:461 pgSetSubclass:469 pgFocusSubclass:484 pgLevelUp:501 pgLevelDown:506 pgAfterLevelModal:512 pgAddClass:523 renderClassDev:537 _pgSheetAboutRow:556 _pgSubclassRows:574 syncClassFieldUI:600 _pgOwnSubclasses:646 pgEditSubclass:656 _subclassRecord:661 _subclassUnlock:666 _subclassClasses:671 _subclassPicked:677 _subclassRepick:682 subclassFormClassChanged:691 subclassAddFeature:697 subclassRemoveFeature:716 openSubclassForm:721 closeSubclassForm:747 _subclassFormDone:752 submitSubclassForm:760 deleteSubclassForm:794 openFeatureInfo:815 _fiRuleNotes:858 _mlTotal:897 _mlMissing:902 openMcLayout:908 mlSetClass:920 mlLevel:928 mlSetSub:937 mlAdd:942 mlRemove:948 _mlRender:954 _mlPruneAsi:1019 mlApply:1030

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

**data.js** (8611 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:129 SAVES_DATA:151 CONDITIONS:160 EFFECTS_DATA:183 CLASS_FEATURES:234 SPELL_PREP_CLASSES:505 CANTRIPS_KNOWN_2014:514 SPELLS_KNOWN_2014:525 SPELL_SLOTS_BY_LEVEL:534 CLASS_HIT_DICE:618 SUBCLASSES:625 SOURCE_LABELS:646 SUBCLASS_SOURCE:673 SUBCLASS_CREDIT:733 BOOK_CODES:752 _booksOffCache:755 CLASS_SOURCE:808 SUBCLASS_LEVEL:824 SUBCLASS_FEATURES:841 WEAPON_PRESETS:1665 ITEM_ICONS:1709 CATEGORY_NAMES:1710 GEAR_PACKS:1719 RACE_DATA:1814 BACKGROUND_SKILLS:2431 BACKGROUND_ALIASES:2510 DEITY_ALIGN_LABELS:2523 DEITIES_DATA:2528 LANGUAGE_CATALOG:2596 RACE_LANGUAGES:2633 CLASS_LANGUAGES:2735 TOOL_CATALOG:2741 RACE_TOOLS:2797 CLASS_TOOLS:2809 SUBCLASS_LANGUAGES:2818 SUBCLASS_TOOLS:2841 RACE_ARMOR:2869 RACE_WEAPONS_SPECIFIC:2875 CLASS_WEAPONS_SPECIFIC:2891 RACE_NAME_POOLS:2904 RACE_NAME_GROUP:2946 SUBCLASS_ARMOR:2961 ARMOR_PRESETS:2996 skills:3013 ABILITY_INFO:3026 CLASS_SKILL_OPTIONS:3066 CLASS_SKILL_COUNT:3082 CLASS_SKILL_MC_COUNT:3083 CLASS_ARMOR_PROFS:3086 CLASS_RESOURCES:3107 ASI_LEVELS:3291 XP_THRESHOLDS:3299 APP_VERSION:3309 APP_VERSION_DATE:3310 APP_TELEGRAM_URL:3316 APP_BOOSTY_URL:3317 FEATS_DATA:3338 APP_CHANGELOG:3661 CASTER_TYPE:8409 THIRD_CASTER_SUBCLASSES:8419 THIRD_CASTER_SLOTS:8426 MULTICLASS_SPELL_SLOTS:8437 MULTICLASS_PREREQUISITES:8462 MULTICLASS_PROFICIENCIES:8481 EDITION_DATA:8511

**spells.js** (13819 строк)  
SPELLS_BASE:7

**spell-effects.js** (881 строк)  
SPELL_EFFECTS:71

**class-choices.js** (815 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 ARTIFICER_INFUSIONS:106 ARTIFICER_REPLICA_ITEMS:125 CLASS_CHOICES:170 ccModalState:513

**subclass-choices-data.js** (1172 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 LIVING_WEAPON_DISCIPLINES:134 LIVING_WEAPON_PERFECT_FORM:140 RUNE_KNIGHT_RUNES:148 ARCANA_CANTRIPS:166 ARCANA_MASTERY:167 GIANT_CANTRIPS:178 ARMORER_MODELS:182 SUBCLASS_CHOICES:187 SUBCLASS_RESOURCES:474

