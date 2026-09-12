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
| index.html — блоки верхнего уровня (`#id:строки`) | 133–170 |
| Функции по файлам (`имя:строка`) | 171–244 |
| Данные — константы верхнего уровня (`имя:строка`) | 245–261 |


## style.css — секции

| Строки | Секция |
|---|---|
| 1–5 | style.css — Стили D&D 5e Character Sheet |
| 6–133 | Design tokens (R1) |
| 134–171 | Алиасы старых переменных (совместимость) |
| 172–191 | THEME-4: компонентные токены базового хрома |
| 192–207 | THEME-5: компонентные токены фичевых зон (партия B) |
| 208–232 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 233–277 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 278–456 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 457–554 | UI-2. Пресеты акцента (8 цветов) |
| 555–571 | Body — атмосферный cream-фон + warm radial + SVG-noise |
| 572–579 | UI4-glass: декоративные «лозы» светлой темы убраны |
| 580–588 | Заголовки |
| 589–1015 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1016–1317 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1318–1323 | R2. Базовые компоненты |
| 1324–1482 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1483–1755 | UI-3. Desktop/tablet layout (≥1024px) |
| 1756–1858 | UI5-4: ПК — многоколоночная раскладка листа |
| 1859–1934 | /R2 |
| 1935–2108 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2109–2270 | HEADER (R5: back + name + hamburger) |
| 2271–2336 | КД АВТО-РАСЧЁТ |
| 2337–2406 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2407–2472 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2473–2632 | УСЛОВИЯ |
| 2633–2779 | СПАСБРОСКИ |
| 2780–2930 | CLASS FEATURES |
| 2931–2970 | УБИРАЕМ СТРЕЛКИ |
| 2971–3075 | TAB NAV — 5 tabs + centered FAB dice |
| 3076–3198 | UX-5: лента последних бросков вне модалки |
| 3199–3375 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3376–3395 | HAMBURGER BUTTON |
| 3396–3437 | SIDE DRAWER |
| 3438–3938 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3939–3986 | MENU-8/9: встречающий экран во всё окно. |
| 3987–4078 | MENU-2: плашка последнего героя. |
| 4079–4253 | MENU-3: меню приключения. |
| 4254–4324 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4325–4325 | INVENTORY |
| 4326–4356 | INVENTORY — WEIGHT BAR |
| 4357–4393 | INVENTORY — BACKPACK HEADER |
| 4394–4434 | INVENTORY — FILTERS |
| 4435–4619 | INVENTORY — ITEM CARDS |
| 4620–4985 | COINS — BIG NUMBER CARD GRID |
| 4986–5276 | MODALS |
| 5277–5311 | DICE |
| 5312–5892 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5893–6808 | OTHER STYLES |
| 6809–6877 | HP DISPLAY BLOCK |
| 6878–6903 | MOBILE OPTIMIZATION |
| 6904–7032 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7033–7071 | HP TOAST (snackbar) |
| 7072–7121 | HP HISTORY MODAL |
| 7122–7175 | Confirm Modal |
| 7176–7579 | ⚔️ ОТРЯД & БОЙ |
| 7580–7818 | RACIAL BONUS BAR |
| 7819–7965 | COMPACT STATS GRID |
| 7966–8233 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8234–8286 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8287–8337 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8338–8437 | COMPACT SKILLS |
| 8438–8480 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8481–8552 | ACCORDION |
| 8553–8576 | CLASS RESOURCES |
| 8577–8667 | ASI MODAL |
| 8668–8913 | APP VERSION |
| 8914–8923 | COMPANIONS |
| 8924–8963 | FEATS LIST IN ASI |
| 8964–9209 | PROFILES TABS (Чейнджлог) |
| 9210–9288 | TAKEN FEATS |
| 9289–9485 | SW UPDATE MODAL |
| 9486–9492 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9493–9503 | SPELL CLASS FILTER COMPACT |
| 9504–9712 | INVENTORY SLOTS SYSTEM |
| 9713–9908 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9909–10157 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10158–10330 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10331–10400 | 3D DICE CUBE |
| 10401–10771 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10772–10841 | DESKTOP LAYOUT — centered max-width |
| 10842–10862 | INSPIRATION |
| 10863–10902 | CONCENTRATION |
| 10903–11587 | WEAPON CARDS WITH ROLL BUTTONS |
| 11588–11695 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11696–11758 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11759–11785 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11786–11906 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 11907–11933 | R6: Ассеты (декор) |
| 11934–12885 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 12886–12965 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 12966–12986 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 12987–13056 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13057–13331 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13332–13358 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13359–13406 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13407–13459 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13460–14564 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14565–14620 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14621–14713 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14714–15017 | DISC-1 · Ромб раскрытия |
| 15018–15521 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15522–15616 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15617–15699 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 15700–15930 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 15931–15940 | STYLE-8b3-fix: срезанный ромб |
| 15941–16207 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16208–16694 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 16695–16728 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #edition-row:225-242  
#welcome-modal:243-247 #welcome-step-1:248-266 #welcome-step-2:267-301 #header-avatar:302-309 #status-bar:310-313 #status-inspiration:314-314 #status-concentration:315-317 #status-ritual:318-320  
#status-conditions-btn:321-331 #screen-home:332-334 #home-art:335-362 #home-sub-new:363-405 #home-hero:406-406 #home-hero-emblem:407-410 #home-hero-sub:411-411 #home-hero-chips:412-422  
#screen-characters:423-462 #char-hero:463-463 #char-hero-emblem:464-467 #char-hero-sub:468-468 #char-hero-chips:469-469 #char-hero-actions:470-478 #screen-data:479-492 #storage-status:493-493  
#backup-panel:494-498 #backup-list:499-510 #screen-about:511-514 #app-version-row:515-522 #ptab-info:523-530 #app-links-row:531-536 #ptab-changelog:537-541 #changelog-list:542-548  
#screen-character:549-549 #tab-sheet:550-552 #creation-wizard-banner:553-561 #cw-validation:562-564 #basic-locked-bar:565-579 #sheet-avatar:580-592 #char-build-badge-wrap:593-607 #char-class-mc:608-631  
#char-subclass-rec:632-632 #char-subclass-mc:633-695 #race-bonus-display:696-696 #race-extras-panel:697-698 #background-feature-display:699-745 #stats-collapse-btn:746-753 #abilities-region:754-757 #proficiency-bonus-2024:758-759  
#insp-card-2024:760-769 #abil-col-1:770-770 #stat-block-str:771-772 #mod-str:773-779 #abil-save-slot-str:780-780 #abil-skills-slot-str:781-783 #stat-block-dex:784-785 #mod-dex:786-792  
#abil-save-slot-dex:793-793 #abil-skills-slot-dex:794-796 #stat-block-int:797-798 #mod-int:799-805 #abil-save-slot-int:806-806 #abil-skills-slot-int:807-810 #abil-col-2:811-811 #stat-block-con:812-813  
#mod-con:814-820 #abil-save-slot-con:821-821 #abil-skills-slot-con:822-824 #stat-block-wis:825-826 #mod-wis:827-833 #abil-save-slot-wis:834-834 #abil-skills-slot-wis:835-837 #stat-block-cha:838-839  
#mod-cha:840-846 #abil-save-slot-cha:847-847 #abil-skills-slot-cha:848-861 #saves-grid:862-871 #skills-container:872-874 #passive-perception:875-898 #hp-dmg-row:899-908 #hp-dmg-body:909-924  
#death-saves-section:925-956 #hp-armor-body:957-998 #hp-hd-body:999-1012 #hp-rest-body:1013-1040 #class-dev-section:1041-1043 #cd-head:1044-1044 #cd-res:1045-1045 #cd-attn:1046-1047  
#cd-about:1048-1056 #ac-formula:1057-1058 #ac-modifiers:1059-1066 #conditions-grid:1067-1074 #effects-grid:1075-1082 #resistances-container:1083-1095 #armor-prof-container:1096-1099 #weapon-prof-container:1100-1103  
#tools-container:1104-1107 #languages-container:1108-1115 #companions-list-sheet:1116-1128 #tab-progress:1129-1130 #pg-body:1131-1132 #tab-spells:1133-1156 #spell-mod-display:1157-1162 #spell-dc-display:1163-1168  
#spell-attack-display:1169-1191 #spell-slots-visual:1192-1197 #concentration-block:1198-1214 #prep-counter:1215-1215 #my-spells-list:1216-1218 #tab-inventory:1219-1238 #weight-fill:1239-1273 #inventory-list:1274-1283  
#inv-pouches:1284-1338 #coin-exchange-modal:1339-1377 #exch-preview:1378-1385 #tab-notes:1386-1411 #notes-subtabs:1412-1413 #notes-main:1414-1415 #taken-feats-section:1416-1420 #taken-feats-list:1421-1424  
#tab-party:1425-1433 #my-char-card:1434-1448 #allies-list:1449-1464 #npcs-list:1465-1480 #monsters-list:1481-1492 #companions-list-world:1493-1503 #tab-battle:1504-1509 #weapons-list:1510-1513  
#battle-res-card:1514-1515 #battle-res-rows:1516-1517 #battle-setup-screen:1518-1526 #battle-setup-list:1527-1530 #battle-tracker-screen:1531-1535 #battle-turn-info:1536-1541 #battle-repeat-strip:1542-1542 #battle-tracker-list:1543-1552  
#tab-journal:1553-1567 #journal-list:1568-1573 #item-ref-modal:1574-1577 #item-ref-tabs:1578-1583 #item-ref-weight:1584-1622 #item-ref-slots:1623-1654 #screen-help:1655-1677 #help-about:1678-1701  
#help-start:1702-1726 #help-sheet:1727-1742 #help-progress:1743-1782 #help-spells:1783-1799 #help-inventory:1800-1812 #help-battle:1813-1829 #help-party:1830-1842 #help-notes:1843-1851  
#help-journal:1852-1860 #help-planes:1861-1888 #help-dice:1889-1900 #help-edition2024:1901-1930 #help-data:1931-1943 #help-marks:1944-1966 #conc-details-modal:1967-1977 #conc-detail-duration-row:1978-1985  
#conc-detail-desc-row:1986-1995 #add-journal-modal:1996-2018 #add-npc-modal:2019-2047 #add-ally-modal:2048-2081 #srd-monster-modal:2082-2093 #srd-monster-count:2094-2094 #srd-monster-results:2095-2102 #srd-npc-modal:2103-2111  
#srd-npc-count:2112-2112 #srd-npc-results:2113-2120 #add-monster-modal:2121-2178 #screen-rest:2179-2181 #rest-main-screen:2182-2188 #rest-info-screen:2189-2193 #hit-dice-section:2194-2204 #rest-food-section:2205-2213  
#rest-result-screen:2214-2216 #rest-result-details:2217-2225 #screen-levelup:2226-2230 #lu-screen-multiclass:2231-2232 #lu-mc-current-classes:2233-2235 #lu-mc-new-class:2236-2240 #lu-mc-prereq-warn:2241-2241 #lu-mc-subclass-row:2242-2250  
#lu-screen-preview:2251-2283 #lu-slots-card:2284-2285 #lu-slots-info:2286-2289 #lu-build-hint:2290-2290 #lu-features-container:2291-2298 #lu-screen-choices:2299-2300 #lu-choices-body:2301-2307 #lu-screen-result:2308-2309  
#lu-result-title:2310-2310 #lu-result-body:2311-2316 #hp-history-modal:2317-2322 #hp-history-list:2323-2328 #asi-modal:2329-2332 #asi-build-hint:2333-2347 #asi-feat-list:2348-2348 #asi-stat-grid:2349-2349  
#asi-preview:2350-2358 #class-choice-modal:2359-2373 #dice-modal:2374-2412 #dice-file-hint:2413-2413 #dice3d-result:2414-2425 #dice-result-display:2426-2429 #dice-mode-segment:2430-2437 #dice-pick:2438-2441  
#dice-fan:2442-2448 #dice-formula-panel:2449-2477 #dice-popover-settings:2478-2524 #dice-popover-history:2525-2536 #dice-history:2537-2544 #spell-search-modal:2545-2548 #spell-class-filter:2549-2592 #class-filter-legend:2593-2614  
#spell-search-count:2615-2615 #spell-search-results:2616-2620 #cast-spell-modal:2621-2625 #cast-spell-options:2626-2628 #add-spell-modal:2629-2672 #new-spell-class-chips:2673-2718 #new-spell-mech-fields:2719-2723 #new-spell-mech-dmg-row:2724-2743  
#new-spell-mech-half-row:2744-2746 #new-spell-mech-mod-row:2747-2757 #item-modal:2758-2821 #screen-magiccatalog:2822-2849 #magic-catalog-count:2850-2850 #magic-catalog-list:2851-2854 #screen-gearcatalog:2855-2859 #gear-packs-list:2860-2873  
#gear-catalog-count:2874-2874 #gear-catalog-list:2875-2878 #item-view-modal:2879-2882 #view-item-icon:2883-2883 #view-item-name:2884-2887 #view-item-qty:2888-2891 #view-item-weight:2892-2895 #view-item-category:2896-2899  
#view-item-total-weight:2900-2902 #view-item-desc:2903-2911 #weapon-modal:2912-2915 #weapon-picker-section:2916-2918 #weapon-filter-chips:2919-2928 #weapon-presets-list:2929-2991 #character-tabs:2992-3003 #quick-roll-strip:3004-3009  
#qrs-list:3010-3020 #active-effects-panel:3021-3025 #aef-list:3026-3032 #hp-toast-container:3033-3035 #add-companion-modal:3036-3051 #companion-familiar-row:3052-3071 #confirm-modal:3072-3084 #avatar-modal:3085-3088  
#avatar-modal-preview:3089-3116 #screen-builds:3117-3139 #bp-list:3140-3144 #screen-buildguide:3145-3147 #bg-body:3148-3152 #screen-buildplan:3153-3155 #bp-plan-body:3156-3160 #screen-abilityinfo:3161-3163  
#ai-body:3164-3168 #screen-featureinfo:3169-3171 #fi-body:3172-3176 #app-log-panel:3177-3196 #app-log-list:3197-3337 #notes-entry-modal:3338-3386  

## Функции по файлам (`имя:строка`)

**rules.js** (815 строк, 44 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 charClassLevel:33 charHasClass:43 charClassLevelOr:53 charAsiSlots:62 charSubclassPending:76 charXpNext:89 rulesJackOfAllTrades:100 rulesHasExpertise:104 getInitiativeMod:110 rulesSaveBonus:120 rulesSkillBonus:126 rulesPassivePerception:140 rulesSpellStats:144 armorPenalties:159 rulesAC:170 charCasterLevel:288 classSpellSlotRow:322 getMulticlassSpellSlots:335 resolvePactSlots:367 restoreItemCharges:377 rulesHitDieSides:394 rulesShortRest:400 rulesLongRestBlockReason:446 rulesLongRest:459 concSaveParams:519 getCharClassPairs:536 findLangInCatalog:548 ensureLanguagesArray:560 recalcLanguagesFromSources:576 add:581 findToolInCatalog:625 ensureToolsArray:637 parseBackgroundToolEntry:653 recalcToolsFromSources:663 add:668 ensureArmorWeaponFields:732 recalcArmorWeaponFromSources:745 addArmor:751 addWeapon:752 addSpec:795

**app-core.js** (1445 строк, 66 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 migrateToMulticlass:60 syncClassFields:74 isMulticlass:82 getClassLabel:87 getClassLine:96 checkMulticlassPrereqs:104 autoFillItemWeight:177 setItemQty:194 saveToLocal:258 initPersistentStorage:272 _formatStorageBytes:293 updateStorageStatus:301 currentScreenName:355 screenBack:361 _closeOpenModals:373 headerBack:383 _screenMotionOk:416 _screenGhostDrop:422 _screenGhostStart:434 _screenEnter:452 showScreen:461 updateHeaderTitle:563 syncDrawerHeader:617 switchTab:629 openDrawer:659 closeDrawer:672 showCharacterNav:684 hideCharacterNav:692 isInteractive:712 currentActiveTab:735 createNewCharacter:793 getClassColor:811 getClassIcon:826 getAbilityIcon:833 getConditionIcon:848 getConditionChipIcon:872 getSpellClassIcon:890 getSchoolSlug:907 getSchoolIcon:911 stripLeadingEmoji:924 formatTimeAgo:928 setCharSort:942 setCharSearch:949 duplicateCharacter:953 exportOneCharacter:965 updateCharCounter:991 onDragStart:1008 onDragOver:1009 onDrop:1010 renderCharacterList:1021 renderCharPlate:1088 deleteCharacter:1144 showConfirmModal:1157 safeSet:1190 safeSetChecked:1194 loadCharacter:1202 showToast:1370 openHPHistory:1383 closeHPHistory:1411 updateVersionBlock:1417

**app-migrate.js** (886 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:878

**app-builds.js** (1625 строк, 42 функций)  
openBuildPicker:7 renderBuildPicker:39 renderBuildBadge:101 renderEditionBadge:120 unlinkBuild:132 _stemSet:153 _matchByStems:159 _weaponMatchNames:167 _findWeapon:170 _findArmorPreset:195 applyBuild:209 _applyBuildCore:218 _pick:818 _glossNorm:910 _reEscape:911 _glossEd:912 _glossBuild:913 ingest:915 _glossIndex:937 glossarizeHtml:945 _glossPopoverEl:959 hideGlossPopover:971 showGlossPopover:976 _glossBindOnce:995 openBuildGuide:1026 gx:1048 _list:1049 getBuildLevelRec:1112 getBuildRecChoiceOption:1117 getBuildRecChoiceIds:1125 getBuildRecFeat:1130 getBuildRecAsi:1140 getBuildRecSubclass:1147 parseAsiFromHeadline:1155 _buildFeatNameMap:1169 parseFeatFromHeadline:1211 parseSpellsFromHeadline:1228 getBuildRecSpellObjs:1472 openBuildPlan:1492 _cpSubclassOf:1544 _cpClassSwitch:1555 openClassPlan:1570

**app-io.js** (387 строк, 14 функций)  
_buildExportPayload:9 exportData:23 _isValidImportedChar:36 _normalizeImportedSpell:50 _isValidImportedSpell:61 _collectCharUserSpells:65 _ingestImportedUserSpells:83 _extractCharsFromImport:128 _applyFullRestore:136 importData:155 importOneCharacter:205 exportSpells:292 importSpells:301 exportSessionLog:374

**app-combat.js** (1496 строк, 61 функций)  
showRollModePopup:9 rollD20WithMode:34 formatRollMode:49 formatRollModeLabel:64 showDualDice:71 formatDiceInfoStr:89 rollSavingThrow:102 rollAbilityCheck:117 rollSkillCheck:129 initSaves:145 autoSelectProficiencies:180 initSkills:216 toggleAbilOpen:243 openAbilityInfo:254 toggleExpertise:281 loadExpertise:299 updateSkillProfCount:313 updateClassFeatures:323 calculateAC:338 toggleInspiration:399 updateStatusBar:410 updateInspirationLabels:461 updateStatDisplay:478 updateAllStatDisplays:483 adjustStat:487 adjustCoin:509 updateCoinTotal:519 openCoinExchange:530 closeCoinExchange:535 previewExchange:539 confirmExchange:575 updateSubclassOptions:601 updateSubclassRecHint:653 recalculateHP:667 updateChar:705 toggleProficiency:771 calcStats:794 setSpellStat:865 calcSpellStats:875 onRaceChange:919 rollRandomName:1020 pick:1028 build:1029 renderRaceExtras:1050 toggleHalfElfStat:1105 openRaceFeatModal:1129 removeRaceFeat:1147 applyBasicLockUI:1173 updateLockButtonState:1195 lockBasicInfo:1225 unlockBasicInfo:1239 onBackgroundChange:1261 renderBackgroundFeature:1300 onArmorChange:1317 onManualAC:1340 onManualMaxHP:1347 calcCoinWeight:1365 getActiveConditionsForRender:1379 toggleConditionsPopup:1408 closeConditionsPopup:1420 renderConditionsPopup:1426

**app-conditions.js** (473 строк, 26 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 _condMatches:101 setConditionsSearch:106 toggleConditionsActiveOnly:107 renderConditionsGrid:113 toggleConditionDesc:166 toggleEffectDesc:174 initConditions:181 getExhaustionLevel:213 adjustExhaustion:220 updateExhaustionDisplay:241 toggleCondition:262 updateConditionsCount:283 loadConditions:292 _fxMatches:306 setEffectsSearch:311 setEffectsType:312 toggleEffectsActiveOnly:320 renderEffectsGrid:326 initEffects:409 toggleEffect:429 updateEffectsCount:458 loadEffects:467

**app-cast-effects.js** (348 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:232 _aefRowHtml:247 renderActiveEffectsFab:261 toggleActiveEffectsPanel:281 _aefBindOutside:300 advanceActiveEffects:320 removeActiveEffect:332

**app-proficiencies.js** (626 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:63 addChoiceLanguage:147 addCustomLanguage:162 removeCustomLanguage:188 getToolChoiceSlots:212 buildToolOptionsHtml:278 renderTools:299 addChoiceTool:371 addCustomTool:386 removeCustomTool:412 renderArmorProf:430 renderWeaponProf:480 addCustomArmorType:544 removeCustomArmorType:559 addCustomWeaponType:570 removeCustomWeaponType:584 addCustomSpecificWeapon:594 removeCustomSpecificWeapon:614

**app-hp.js** (1622 строк, 47 функций)  
openRestModal:6 closeRestModal:11 showRestMain:17 showShortRestInfo:25 showLongRestInfo:47 showRestResult:76 adjustHitDice:88 updateHitDiceInfo:99 confirmRest:114 openLevelUpModal:200 _showMulticlassScreen:222 openMulticlassNewClass:265 confirmMulticlassNewClass:315 _showLevelUpPreview:326 closeLevelUpModal:491 confirmLevelUp:499 _luShowResult:668 luFinishChoices:692 luRefreshChoices:699 luSetSubclass:706 luApplyFeatById:723 luApplyAsi:755 _ccDefsFor:772 _luAsiDone:783 luApplyAllRecommendations:788 luBuildChoicesScreen:909 recBadge:917 luAddRecommendedSpells:1038 luGoToSpellsTab:1066 openLevelDownConfirm:1078 confirmLevelDown:1122 loadDeathSaves:1159 toggleDeathSave:1198 resetDeathSaves:1215 updateHPDisplay:1228 hpToggleRow:1308 hpSetRowOpen:1317 updateHPSummary:1325 updateHPRows:1371 quickHP:1389 addHPHistory:1475 showHPToast:1486 applyCustomHP:1510 saveTempHP:1522 rollHitDieQuick:1535 renderHitDiceIcons:1564 rollDeathSave:1578

**app-inventory.js** (1632 строк, 72 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:289 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:377 adjustItemCharges:388 openItemModal:404 closeItemModal:461 submitItem:465 openMagicCatalog:529 closeMagicCatalog:546 renderMagicCatalog:551 fillFromMagicItem:583 openGearCatalog:633 closeGearCatalog:649 renderGearPacks:654 renderGearCatalog:664 fillFromGearItem:692 addPackToInventory:714 rollTrinket:736 viewItem:761 closeItemView:784 editItemFromView:789 deleteItemFromView:794 _weaponCatalog:821 renderWeaponPresets:834 filterWeaponPresets:892 toggleWeaponFilter:896 fillWeaponPreset:903 _resetWeaponForm:932 openWeaponModal:951 closeWeaponModal:961 editWeapon:969 deleteCustomWeapon:998 _weaponPresetByName:1023 checkWeaponProficiency:1030 submitWeapon:1058 renderWeapons:1142 isLightWeapon:1213 toggleTWFStyle:1218 rollTWFAttack:1226 rollTWFDamage:1274 rollWeaponAttack:1303 rollWeaponDamage:1352 removeWeapon:1398 _invDndInit:1432 _invClearIndicators:1461 _invSetIndicator:1470 _invCleanup:1475 _invCancelDrag:1482 _invMoveItem:1490 _invCommitDrop:1507 invDragStart:1528 invDragOver:1538 invDragLeave:1555 invDrop:1559 invDragEnd:1565 invTouchStart:1572 invTouchMove:1588 invTouchEnd:1620

**app-spells.js** (1567 строк, 72 функций)  
toggleSpellStatRow:9 renderSpellSlots:14 togglePactSlot:83 adjustPactSlots:94 updateSpellSlots:108 toggleSpellSlot:119 adjustSpellSlots:130 restoreAllSlots:148 setSpellVersion:159 setSpellClass:167 _charSpellClassKey:176 _charMaxCastableLevel:187 openSpellSearch:194 markCharOwnClassFilter:208 closeSpellSearch:238 _parseSpellClassList:259 _syncNewSpellClassChips:263 toggleNewSpellClass:270 _fillNewSpellDamageTypes:295 _toggleHidden:302 updateNewSpellMechFields:310 _hbFormulaCheck:325 _collectHbEffect:334 _spellIdArg:372 _findHomebrewSpell:378 openAddSpellForm:386 _syncCustomSpellAcrossChars:465 _purgeCustomSpellFromChars:483 deleteCustomSpell:502 _deleteCustomSpellConfirmed:511 closeAddSpellForm:525 submitNewSpell:529 renderSpellSearch:619 addSpell:683 removeSpell:697 toggleSpellCard:708 renderMySpells:713 _spellActiveBadgeText:848 _spellActiveBadgeHtml:852 updateSpellActiveBadges:855 calcMaxPrepared:873 isPrepClass:890 isSpellPrepared:894 toggleSpellPrepared:900 renderPrepCounter:929 _castableSlotOptions:955 castSpell:969 _castSpellWithSlot:990 _finishCast:1012 applyCastEffects:1052 openCastVariantChooser:1093 pickCastVariant:1131 closeCastVariantChooser:1141 _applyCastSummon:1154 _nextCastInstanceId:1188 _replaceCastInstance:1196 _ensureCastInstance:1226 _applyCastDamage:1246 _rollCastDamage:1262 _startCastRepeat:1326 castRepeatDamage:1340 _applyCastDebuff:1365 castSpellAttackMod:1406 castStatMod:1412 _applyCastHeal:1425 _applyCastTempHp:1446 applyCastTempHp:1463 _applyCastHpMaxBonus:1477 openCastChooser:1497 closeCastChooser:1518 castRitual:1527 cancelRitual:1556

**app-party.js** (1581 строк, 119 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:78 getStatusColor:84 openPartyTab:90 renderMyChar:98 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:210 _pentSave:211 _pentDelete:236 _pentStatus:245 _pentExport:250 _isValidPentry:257 _pentImport:260 openAddAllyModal:287 openEditAllyModal:288 closeAddAllyModal:289 saveAlly:290 deleteAlly:291 setAllyStatus:292 exportAllies:293 importAllies:294 openAddNPCModal:296 openEditNPCModal:297 closeAddNPCModal:298 saveNPC:299 deleteNPC:300 setNPCStatus:301 exportNPCs:302 importNPCs:303 openAddMonsterModal:305 openEditMonsterModal:306 closeAddMonsterModal:307 saveMonster:308 deleteMonster:309 setMonsterStatus:310 exportMonsters:311 importMonsters:312 _npcAttColor:317 renderNPCs:323 renderMonsters:364 _openSrdMonsterPickerLazy:418 openSrdMonsterPicker:428 openSrdMonsterPickerForBattle:430 _openSrdMonsterPickerCore:435 closeSrdMonsterPicker:471 setSrdMonsterSearch:473 setSrdMonsterCr:474 setSrdMonsterEdition:475 renderSrdMonsterPicker:477 addMonsterFromSRD:520 openSrdNpcPicker:561 _openSrdNpcPickerCore:570 closeSrdNpcPicker:591 setSrdNpcSearch:593 setSrdNpcAtt:594 renderSrdNpcPicker:596 addNpcFromSRD:628 openBattleTab:658 buildBattleSetupList:671 setBattleSearch:691 toggleBattleSection:692 renderBattleSetup:697 toggleBattleCheck:741 battleDragStart:746 battleDragOver:747 battleDrop:748 battleDragEnd:756 rollInitiativeValue:761 sortParticipantsByInitiative:766 _findPartyMonster:772 _participantCombatMeta:782 _makeBattleParticipant:806 _battleParticipantHP:819 _addSrdMonsterToBattle:828 startBattle:858 getParticipantDesc:871 showTrackerInfo:894 getSelfStatusFromHP:930 syncSelfBattleStatus:944 renderBattleTracker:954 renderBattleCastPanels:1046 _battleCondDots:1087 adjustBattleHP:1102 setBattleHP:1115 setBattleHPMax:1136 setBattleInitiative:1147 rerollInitiative:1159 battleRollD20:1171 removeBattleParticipant:1176 setBattleStatus:1192 _battleStatusFromHp:1200 offerCastDamageToBattle:1216 _castDamageAmount:1232 _renderCastDamageModal:1237 setCastDamageHalf:1286 applyCastDamageToTarget:1295 closeCastDamageModal:1313 _castDebuffTargets:1334 offerCastDebuffToBattle:1340 _renderCastDebuffModal:1356 toggleCastDebuffTarget:1411 pickCastDebuffTarget:1421 applyCastDebuffTargets:1430 closeCastDebuffModal:1458 _battleDebuffChips:1467 removeBattleDebuff:1484 removeBattleDebuffsForSpell:1497 clearAllBattleDebuffs:1512 _logTurn:1517 nextTurn:1522 prevTurn:1532 tickCastEffectsRound:1543 endBattle:1571

**app-notes.js** (1346 строк, 63 функций)  
renderNotes:43 _renderNotesSubtabs:61 notesSwitchTab:83 _renderNotesMain:95 _findTab:113 _getSectionVariants:125 _renderSectionsView:138 _renderVariantsPanel:193 _renderMdToolbar:216 notesToggleSection:248 notesToggleVariants:264 notesPickVariant:276 notesRegenerateAll:287 notesPickRandomVariant:317 _applyVariantToSection:330 _mdToHtml:350 closeLists:362 _countStats:402 _bindSectionInputs:409 _updateStats:422 _notesHotkeys:431 notesMdInsert:446 wrap:455 linePrefix:462 notesTogglePreview:512 notesUpdateSection:531 _syncTakenFeatsLocation:546 _renderEntriesView:559 _renderEntryCard:618 notesPinDragStart:665 notesPinDragOver:675 notesPinDragLeave:684 notesPinDrop:689 notesPinDragEnd:699 _notesReorderPinned:708 notesSetTagFilter:736 notesJumpToNpc:742 notesOpenEntryModal:770 notesCloseEntryModal:804 _notesRenderModalTags:809 notesAddModalTag:821 notesModalTagKeydown:831 notesRemoveModalTag:835 notesSaveEntryModal:841 notesDeleteEntry:889 notesTogglePin:904 _notesLogJournal:939 notesSearchInput:965 notesSearchKeydown:972 _hlText:990 _renderSearchResults:1000 notesClearSearch:1081 notesToggleMenu:1092 _notesMenuClose:1105 notesMenuAction:1111 _notesCharName:1126 _notesTriggerDownload:1131 notesExportMd:1139 notesExportJson:1184 notesHandleImportJson:1195 notesHandleImportMd:1246 notesPrint:1281 _notesFlashSaved:1312

**app-ui.js** (1107 строк, 63 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:126 removeAvatar:144 renderSheetAvatar:163 prefersReducedMotion:178 animateCountUp:184 tick:192 _reportError:215 swTelegramBlock:278 showUpdateModal:289 checkWhatsNew:320 showWhatsNewModal:332 toggleAccordion:368 initCharResources:388 getResourceMax:397 getCharResourceDefs:414 currentDieSize:444 crRow:456 crRestoreLabel:469 crResourceRow:481 crRowsHtml:532 crSetRows:568 renderClassResources:583 spendResource:601 resetResource:619 toggleResourcePip:629 resetResourcesByRest:654 getJournal:688 addJournalEntry:693 filterJournal:715 renderJournal:722 deleteJournalEntry:759 openAddJournalEntry:768 closeAddJournalEntry:772 saveJournalEntry:775 getCompanions:795 renderCompanions:800 companionHP:845 buildFamiliarFormOptions:858 onCompanionTypeChange:870 applyFamiliarForm:878 openAddCompanionModal:890 summonFamiliar:906 openPrefilledCompanionModal:916 openEditCompanionModal:927 closeAddCompanionModal:946 saveCompanion:949 deleteCompanion:974 switchProfilesTab:990 clipChangelogText:1005 expandChangelogItem:1016 renderChangelog:1022 openItemRef:1066 closeItemRef:1071 switchItemRef:1075 _syncHeaderHeight:1093

**app-dice.js** (1379 строк, 61 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:216 rollDice:220 _quickRollCompute:315 _quickRollModStr:334 _emitDiceRolled:340 _setDiceSettled:348 _setSettledDice:358 _quickRollRecord:375 _quickRollInfoText:382 _quickRollToastText:389 quickRoll:405 renderQuickRollStrip:463 updateQuickRollStripVisibility:485 dismissQuickRollStrip:500 openDiceRollHistory:505 drawDiceSVG:518 _waitDiceBoxModule:537 _getAccentColor:555 _getDiceTheme:574 _getDiceThemeColor:581 setDiceTheme:584 _syncDiceThemeButtons:590 _getDiceBg:600 setDiceBg:607 _syncDiceBgButtons:613 _diceDbg:623 _initDiceBox:628 animateDice3d:734 animateDice2d:925 buildDie:951 tick:1019 _applyDiceCritGlow:1042 parseDiceFormula:1063 _formulaCanon:1098 _renderFormulaResult:1110 rollFormula:1145 _rollFormulaFrom:1211 rollCustomFormula:1224 renderDiceHistory:1227 createParticles:1249 _diceShapeSvg:1285 renderDiceFan:1292 _paintSelectedDie:1312 selectDie:1333 rollSelectedDie:1352 toggleDiceFormulaPanel:1361

**app-settings.js** (626 строк, 57 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 _e24BetaEnabled:158 getEdition:161 setEdition:171 _syncEditionButtons:184 _getStatsLayout:211 _applyStatsLayout:218 _statsInCards:225 _statsRowTarget:229 _placeStatRows:247 setStatsLayout:263 _syncStatsLayoutButtons:270 _getStatsCollapsed:283 _applyStatsCollapsed:286 toggleStatsCollapsed:291 _getStoredDensity:305 _getDefaultDensity:313 _getDensity:320 _applyDensity:323 setDensity:327 _syncDensityButtons:333 _onViewportDensityChange:341 _getFontScale:359 _applyFontScale:366 setFontScale:377 _syncFontScaleUi:388 _getGlassAlpha:403 _getGlassBlur:410 _applyGlassAlpha:417 _applyGlassBlur:418 setGlassAlpha:419 setGlassBlur:429 _syncGlassUi:438 _getSpaceMode:487 _applySpaceBg:494 setSpaceMode:509 _syncSpaceButtons:515 _spaceOnScroll:534 _applyDymkaIcons:562 _initAppLinks:575 openSettingsModal:604 closeSettingsModal:613

**app-asi.js** (429 строк, 14 функций)  
asiMarkUsed:17 openASIModalForLevel:28 openASIModal:34 closeASIModal:74 buildASIStatGrid:85 getASIMode:106 toggleASIStat:111 updateASIPreview:127 buildFeatList:201 filterFeatList:229 selectFeat:237 applyASI:253 renderTakenFeats:376 removeFeat:414

**app-progress.js** (669 строк, 38 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:164 _pgAttention:205 _pgGrownLast:235 _pgClassRow:248 _pgClasses:290 _pgNext:306 _pgAvailableClasses:361 _pgActions:374 _pgBuild:391 openProgressTab:404 openProgress:414 pgTabActive:425 pgRefresh:432 pgSetSubclass:440 pgFocusSubclass:454 pgLevelUp:471 pgLevelDown:476 pgAfterLevelModal:482 pgAddClass:493 renderClassDev:504 _pgSheetAboutRow:523 _pgSubclassRows:541 syncClassFieldUI:566 openFeatureInfo:598 _fiRuleNotes:640

**app-desktop.js** (398 строк, 11 функций)  
syncFromStatusBar:103 _esc:158 _stripEmoji:164 _condIcon:168 setRowExpanded:174 collapseRow:180 renderRrConditions:182 renderRailSlots:228 updateRailHpRow:272 rrApplyHP:287 init:300

**app-help.js** (1122 строк, 52 функций)  
openHelp:12 closeHelp:19 switchHelpSection:29 getHelpFlag:82 setHelpFlag:86 welcomeGoStep:92 showWelcome:102 closeWelcome:109 welcomeContinue:115 welcomeSkipExperienced:121 welcomeBack:127 welcomeFinish:134 dismissWelcome:167 maybeShowWelcome:170 restartOnboarding:175 _tourWide:211 _ensureTourDom:214 _resolveTarget:255 _tourFirstVisible:270 _tourAnyModalVisible:290 _tourModalOpen:296 _tourStartWhenClear:308 startTour:320 startListTour:333 startSheetTour:337 maybeStartSheetTour:343 restartTour:361 startTabTour:386 maybeStartTabTour:404 tourNext:426 tourPrev:431 endTour:437 _showTourStep:447 _setBox:510 _computeTourBoxes:526 snap:528 corner:541 _layoutTourCorners:563 _layoutTour:580 _onTourKey:683 _onTourReflow:689 _bindTourGlobal:693 _unbindTourGlobal:698 _buildListSteps:709 _buildSheetSteps:759 _buildProgressSteps:831 _buildSpellsSteps:889 _buildInventorySteps:926 _buildBattleSteps:966 _buildNotesSteps:998 _buildPartySteps:1033 _buildJournalSteps:1091

**app-backup.js** (209 строк, 10 функций)  
_backupLog:24 _backupOpenDb:28 listBackupSnapshots:44 createBackupSnapshot:63 initAutoBackup:105 restoreBackupSnapshot:121 createBackupNow:146 _backupFmtDate:159 toggleBackupPanel:165 renderBackupList:173

**app-pdf.js** (700 строк, 20 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:75 _pdfDecoBorder:91 _pdfSafeName:125 _pdfFormatMod:129 _pdfRule:132 _pdfSection:140 _pdfNeed:151 _pdfMultiline:161 _pdfFooter:179 _pdfStatsAndCombat:276 _pdfSaves:370 _pdfSkills:397 _pdfAttacks:425 _pdfSpells:458 _pdfInventory:556 _pdfNotes:611

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (5647 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:21 DAMAGE_TYPES:24 DEFAULT_CHARACTER:31 FAMILIAR_FORMS:103 SAVES_DATA:125 CONDITIONS:134 EFFECTS_DATA:157 CLASS_FEATURES:208 SPELL_PREP_CLASSES:490 SPELL_SLOTS_BY_LEVEL:497 CLASS_HIT_DICE:572 SUBCLASSES:578 SOURCE_LABELS:597 SUBCLASS_SOURCE:605 SUBCLASS_LEVEL:674 SUBCLASS_FEATURES:690 WEAPON_PRESETS:1405 ITEM_ICONS:1449 CATEGORY_NAMES:1450 GEAR_PACKS:1459 RACE_DATA:1554 BACKGROUND_SKILLS:1685 BACKGROUND_ALIASES:1722 DEITY_ALIGN_LABELS:1735 DEITIES_DATA:1740 LANGUAGE_CATALOG:1808 RACE_LANGUAGES:1837 CLASS_LANGUAGES:1863 TOOL_CATALOG:1869 RACE_TOOLS:1924 CLASS_TOOLS:1931 SUBCLASS_LANGUAGES:1939 SUBCLASS_TOOLS:1952 RACE_ARMOR:1974 RACE_WEAPONS_SPECIFIC:1978 CLASS_WEAPONS_SPECIFIC:1991 RACE_NAME_POOLS:2001 RACE_NAME_GROUP:2043 SUBCLASS_ARMOR:2057 ARMOR_PRESETS:2087 skills:2104 ABILITY_INFO:2117 CLASS_SKILL_OPTIONS:2157 CLASS_ARMOR_PROFS:2173 CLASS_RESOURCES:2193 ASI_LEVELS:2347 XP_THRESHOLDS:2355 APP_VERSION:2365 APP_VERSION_DATE:2366 APP_TELEGRAM_URL:2372 APP_DONATE_URL:2373 APP_BOOSTY_URL:2374 FEATS_DATA:2390 APP_CHANGELOG:2709 CASTER_TYPE:5489 THIRD_CASTER_SUBCLASSES:5498 THIRD_CASTER_SLOTS:5505 MULTICLASS_SPELL_SLOTS:5516 MULTICLASS_PREREQUISITES:5541 MULTICLASS_PROFICIENCIES:5557 EDITION_DATA:5586

**spells.js** (12518 строк)  
SPELLS_BASE:7

**spell-effects.js** (823 строк)  
SPELL_EFFECTS:71

**class-choices.js** (680 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:437

**subclass-choices-data.js** (790 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 SUBCLASS_CHOICES:144 SUBCLASS_RESOURCES:333

