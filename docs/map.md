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
| index.html — блоки верхнего уровня (`#id:строки`) | 133–169 |
| Функции по файлам (`имя:строка`) | 170–243 |
| Данные — константы верхнего уровня (`имя:строка`) | 244–260 |


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
| 278–458 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 459–556 | UI-2. Пресеты акцента (8 цветов) |
| 557–573 | Body — атмосферный cream-фон + warm radial + SVG-noise |
| 574–581 | UI4-glass: декоративные «лозы» светлой темы убраны |
| 582–590 | Заголовки |
| 591–1004 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1005–1306 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1307–1312 | R2. Базовые компоненты |
| 1313–1471 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1472–1744 | UI-3. Desktop/tablet layout (≥1024px) |
| 1745–1847 | UI5-4: ПК — многоколоночная раскладка листа |
| 1848–1923 | /R2 |
| 1924–2097 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2098–2259 | HEADER (R5: back + name + hamburger) |
| 2260–2325 | КД АВТО-РАСЧЁТ |
| 2326–2395 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2396–2461 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2462–2621 | УСЛОВИЯ |
| 2622–2768 | СПАСБРОСКИ |
| 2769–2920 | CLASS FEATURES |
| 2921–2960 | УБИРАЕМ СТРЕЛКИ |
| 2961–3065 | TAB NAV — 5 tabs + centered FAB dice |
| 3066–3188 | UX-5: лента последних бросков вне модалки |
| 3189–3365 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3366–3385 | HAMBURGER BUTTON |
| 3386–3427 | SIDE DRAWER |
| 3428–3928 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3929–3976 | MENU-8/9: встречающий экран во всё окно. |
| 3977–4068 | MENU-2: плашка последнего героя. |
| 4069–4243 | MENU-3: меню приключения. |
| 4244–4314 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4315–4315 | INVENTORY |
| 4316–4346 | INVENTORY — WEIGHT BAR |
| 4347–4383 | INVENTORY — BACKPACK HEADER |
| 4384–4424 | INVENTORY — FILTERS |
| 4425–4609 | INVENTORY — ITEM CARDS |
| 4610–4975 | COINS — BIG NUMBER CARD GRID |
| 4976–5258 | MODALS |
| 5259–5293 | DICE |
| 5294–5874 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5875–6750 | OTHER STYLES |
| 6751–6819 | HP DISPLAY BLOCK |
| 6820–6845 | MOBILE OPTIMIZATION |
| 6846–6974 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6975–7013 | HP TOAST (snackbar) |
| 7014–7065 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7066–7119 | Confirm Modal |
| 7120–7523 | ⚔️ ОТРЯД & БОЙ |
| 7524–7789 | RACIAL BONUS BAR |
| 7790–7936 | COMPACT STATS GRID |
| 7937–8204 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8205–8257 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8258–8308 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8309–8408 | COMPACT SKILLS |
| 8409–8451 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8452–8523 | ACCORDION |
| 8524–8547 | CLASS RESOURCES |
| 8548–8638 | ASI MODAL |
| 8639–8884 | APP VERSION |
| 8885–8894 | COMPANIONS |
| 8895–8934 | FEATS LIST IN ASI |
| 8935–9180 | PROFILES TABS (Чейнджлог) |
| 9181–9259 | TAKEN FEATS |
| 9260–9456 | SW UPDATE MODAL |
| 9457–9463 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9464–9631 | INVENTORY SLOTS SYSTEM |
| 9632–9827 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9828–10076 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10077–10249 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10250–10319 | 3D DICE CUBE |
| 10320–10690 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10691–10760 | DESKTOP LAYOUT — centered max-width |
| 10761–10781 | INSPIRATION |
| 10782–10821 | CONCENTRATION |
| 10822–11506 | WEAPON CARDS WITH ROLL BUTTONS |
| 11507–11614 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11615–11677 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11678–11704 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11705–11825 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 11826–11852 | R6: Ассеты (декор) |
| 11853–12804 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 12805–12884 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 12885–12893 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 12894–12963 | UI-13: доступ к настройкам и усиление back-кнопки |
| 12964–13238 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13239–13265 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13266–13313 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13314–13366 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13367–14466 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14467–14522 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14523–14615 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14616–14919 | DISC-1 · Ромб раскрытия |
| 14920–15423 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15424–15518 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15519–15601 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 15602–15832 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 15833–15842 | STYLE-8b3-fix: срезанный ромб |
| 15843–16109 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16110–16596 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 16597–16631 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 16632–16708 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #edition-row:225-250  
#welcome-modal:251-255 #welcome-step-1:256-274 #welcome-step-2:275-309 #header-avatar:310-317 #status-bar:318-321 #status-inspiration:322-322 #status-concentration:323-325 #status-ritual:326-328  
#status-conditions-btn:329-339 #screen-home:340-342 #home-art:343-370 #home-sub-new:371-413 #home-hero:414-414 #home-hero-emblem:415-418 #home-hero-sub:419-419 #home-hero-chips:420-430  
#screen-characters:431-470 #char-hero:471-471 #char-hero-emblem:472-475 #char-hero-sub:476-476 #char-hero-chips:477-477 #char-hero-actions:478-486 #screen-data:487-500 #storage-status:501-501  
#backup-panel:502-506 #backup-list:507-518 #screen-about:519-522 #app-version-row:523-530 #ptab-info:531-538 #app-links-row:539-544 #ptab-changelog:545-549 #changelog-list:550-556  
#screen-character:557-557 #tab-sheet:558-560 #creation-wizard-banner:561-569 #cw-validation:570-572 #basic-locked-bar:573-589 #sheet-avatar:590-602 #char-build-badge-wrap:603-617 #char-class-mc:618-641  
#char-subclass-rec:642-642 #char-subclass-mc:643-705 #race-bonus-display:706-706 #race-extras-panel:707-708 #background-feature-display:709-755 #stats-collapse-btn:756-763 #abilities-region:764-767 #proficiency-bonus-2024:768-769  
#insp-card-2024:770-779 #abil-col-1:780-780 #stat-block-str:781-782 #mod-str:783-789 #abil-save-slot-str:790-790 #abil-skills-slot-str:791-793 #stat-block-dex:794-795 #mod-dex:796-802  
#abil-save-slot-dex:803-803 #abil-skills-slot-dex:804-806 #stat-block-int:807-808 #mod-int:809-815 #abil-save-slot-int:816-816 #abil-skills-slot-int:817-820 #abil-col-2:821-821 #stat-block-con:822-823  
#mod-con:824-830 #abil-save-slot-con:831-831 #abil-skills-slot-con:832-834 #stat-block-wis:835-836 #mod-wis:837-843 #abil-save-slot-wis:844-844 #abil-skills-slot-wis:845-847 #stat-block-cha:848-849  
#mod-cha:850-856 #abil-save-slot-cha:857-857 #abil-skills-slot-cha:858-871 #saves-grid:872-881 #skills-container:882-884 #passive-perception:885-908 #hp-dmg-row:909-918 #hp-dmg-body:919-934  
#death-saves-section:935-966 #hp-armor-body:967-1008 #hp-hd-body:1009-1022 #hp-rest-body:1023-1050 #class-dev-section:1051-1053 #cd-head:1054-1054 #cd-res:1055-1055 #cd-attn:1056-1057  
#cd-about:1058-1066 #ac-formula:1067-1068 #ac-modifiers:1069-1076 #conditions-grid:1077-1084 #effects-grid:1085-1092 #resistances-container:1093-1105 #armor-prof-container:1106-1109 #weapon-prof-container:1110-1113  
#tools-container:1114-1117 #languages-container:1118-1125 #companions-list-sheet:1126-1138 #tab-progress:1139-1140 #pg-body:1141-1142 #tab-spells:1143-1166 #spell-mod-display:1167-1172 #spell-dc-display:1173-1178  
#spell-attack-display:1179-1201 #spell-slots-visual:1202-1207 #concentration-block:1208-1224 #prep-counter:1225-1225 #my-spells-list:1226-1228 #tab-inventory:1229-1248 #weight-fill:1249-1283 #inventory-list:1284-1293  
#inv-pouches:1294-1348 #coin-exchange-modal:1349-1387 #exch-preview:1388-1395 #tab-notes:1396-1421 #notes-subtabs:1422-1423 #notes-main:1424-1425 #taken-feats-section:1426-1430 #taken-feats-list:1431-1434  
#tab-party:1435-1443 #my-char-card:1444-1458 #allies-list:1459-1474 #npcs-list:1475-1490 #monsters-list:1491-1502 #companions-list-world:1503-1513 #tab-battle:1514-1519 #weapons-list:1520-1523  
#battle-res-card:1524-1525 #battle-res-rows:1526-1527 #battle-setup-screen:1528-1536 #battle-setup-list:1537-1540 #battle-tracker-screen:1541-1545 #battle-turn-info:1546-1551 #battle-repeat-strip:1552-1552 #battle-tracker-list:1553-1562  
#tab-journal:1563-1577 #journal-list:1578-1584 #screen-itemref:1585-1587 #item-ref-tabs:1588-1593 #item-ref-weight:1594-1632 #item-ref-slots:1633-1664 #screen-help:1665-1687 #help-about:1688-1711  
#help-start:1712-1736 #help-sheet:1737-1756 #help-progress:1757-1796 #help-spells:1797-1813 #help-inventory:1814-1826 #help-battle:1827-1843 #help-party:1844-1856 #help-notes:1857-1865  
#help-journal:1866-1874 #help-planes:1875-1902 #help-dice:1903-1914 #help-edition2024:1915-1944 #help-data:1945-1957 #help-marks:1958-1980 #conc-details-modal:1981-1991 #conc-detail-duration-row:1992-1999  
#conc-detail-desc-row:2000-2009 #add-journal-modal:2010-2032 #add-npc-modal:2033-2061 #add-ally-modal:2062-2095 #srd-monster-modal:2096-2107 #srd-monster-count:2108-2108 #srd-monster-results:2109-2116 #srd-npc-modal:2117-2125  
#srd-npc-count:2126-2126 #srd-npc-results:2127-2134 #add-monster-modal:2135-2192 #screen-rest:2193-2195 #rest-main-screen:2196-2202 #rest-info-screen:2203-2207 #hit-dice-section:2208-2218 #rest-food-section:2219-2227  
#rest-result-screen:2228-2230 #rest-result-details:2231-2239 #screen-levelup:2240-2244 #lu-screen-multiclass:2245-2246 #lu-mc-current-classes:2247-2249 #lu-mc-new-class:2250-2254 #lu-mc-prereq-warn:2255-2255 #lu-mc-subclass-row:2256-2264  
#lu-screen-preview:2265-2297 #lu-slots-card:2298-2299 #lu-slots-info:2300-2303 #lu-build-hint:2304-2304 #lu-features-container:2305-2312 #lu-screen-choices:2313-2314 #lu-choices-body:2315-2321 #lu-screen-result:2322-2323  
#lu-result-title:2324-2324 #lu-result-body:2325-2331 #screen-hphistory:2332-2334 #hp-history-list:2335-2340 #asi-modal:2341-2344 #asi-build-hint:2345-2359 #asi-feat-list:2360-2360 #asi-stat-grid:2361-2361  
#asi-preview:2362-2370 #class-choice-modal:2371-2385 #dice-modal:2386-2424 #dice-file-hint:2425-2425 #dice3d-result:2426-2437 #dice-result-display:2438-2441 #dice-mode-segment:2442-2449 #dice-pick:2450-2453  
#dice-fan:2454-2460 #dice-formula-panel:2461-2489 #dice-popover-settings:2490-2536 #dice-popover-history:2537-2548 #dice-history:2549-2557 #screen-spellsearch:2558-2576 #spell-class-filter:2577-2620 #class-filter-legend:2621-2622  
#spell-search-count:2623-2623 #spell-search-results:2624-2627 #cast-spell-modal:2628-2632 #cast-spell-options:2633-2635 #add-spell-modal:2636-2679 #new-spell-class-chips:2680-2725 #new-spell-mech-fields:2726-2730 #new-spell-mech-dmg-row:2731-2750  
#new-spell-mech-half-row:2751-2753 #new-spell-mech-mod-row:2754-2764 #item-modal:2765-2828 #screen-magiccatalog:2829-2856 #magic-catalog-count:2857-2857 #magic-catalog-list:2858-2861 #screen-gearcatalog:2862-2866 #gear-packs-list:2867-2880  
#gear-catalog-count:2881-2881 #gear-catalog-list:2882-2886 #weapon-modal:2887-2890 #weapon-picker-section:2891-2893 #weapon-filter-chips:2894-2903 #weapon-presets-list:2904-2966 #character-tabs:2967-2978 #quick-roll-strip:2979-2984  
#qrs-list:2985-2995 #active-effects-panel:2996-3000 #aef-list:3001-3007 #hp-toast-container:3008-3010 #add-companion-modal:3011-3026 #companion-familiar-row:3027-3046 #confirm-modal:3047-3059 #avatar-modal:3060-3063  
#avatar-modal-preview:3064-3091 #screen-builds:3092-3114 #bp-list:3115-3119 #screen-buildguide:3120-3122 #bg-body:3123-3127 #screen-buildplan:3128-3130 #bp-plan-body:3131-3135 #screen-abilityinfo:3136-3138  
#ai-body:3139-3143 #screen-featureinfo:3144-3146 #fi-body:3147-3151 #app-log-panel:3152-3171 #app-log-list:3172-3316 #notes-entry-modal:3317-3365  

## Функции по файлам (`имя:строка`)

**rules.js** (815 строк, 44 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 charClassLevel:33 charHasClass:43 charClassLevelOr:53 charAsiSlots:62 charSubclassPending:76 charXpNext:89 rulesJackOfAllTrades:100 rulesHasExpertise:104 getInitiativeMod:110 rulesSaveBonus:120 rulesSkillBonus:126 rulesPassivePerception:140 rulesSpellStats:144 armorPenalties:159 rulesAC:170 charCasterLevel:288 classSpellSlotRow:322 getMulticlassSpellSlots:335 resolvePactSlots:367 restoreItemCharges:377 rulesHitDieSides:394 rulesShortRest:400 rulesLongRestBlockReason:446 rulesLongRest:459 concSaveParams:519 getCharClassPairs:536 findLangInCatalog:548 ensureLanguagesArray:560 recalcLanguagesFromSources:576 add:581 findToolInCatalog:625 ensureToolsArray:637 parseBackgroundToolEntry:653 recalcToolsFromSources:663 add:668 ensureArmorWeaponFields:732 recalcArmorWeaponFromSources:745 addArmor:751 addWeapon:752 addSpec:795

**app-core.js** (1461 строк, 67 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 migrateToMulticlass:60 syncClassFields:74 isMulticlass:82 getClassLabel:87 getClassLine:96 checkMulticlassPrereqs:104 autoFillItemWeight:177 setItemQty:194 saveToLocal:267 initPersistentStorage:281 _formatStorageBytes:302 updateStorageStatus:310 currentScreenName:367 screenBack:373 _modalVisible:387 _closeOpenModals:390 headerBack:400 _screenMotionOk:433 _screenGhostDrop:439 _screenGhostStart:451 _screenEnter:469 showScreen:478 updateHeaderTitle:580 syncDrawerHeader:634 switchTab:646 openDrawer:676 closeDrawer:689 showCharacterNav:701 hideCharacterNav:709 isInteractive:729 currentActiveTab:752 createNewCharacter:810 getClassColor:828 getClassIcon:843 getAbilityIcon:850 getConditionIcon:865 getConditionChipIcon:889 getSpellClassIcon:907 getSchoolSlug:924 getSchoolIcon:928 stripLeadingEmoji:941 formatTimeAgo:945 setCharSort:959 setCharSearch:966 duplicateCharacter:970 exportOneCharacter:982 updateCharCounter:1008 onDragStart:1025 onDragOver:1026 onDrop:1027 renderCharacterList:1038 renderCharPlate:1105 deleteCharacter:1161 showConfirmModal:1174 safeSet:1207 safeSetChecked:1211 loadCharacter:1219 showToast:1387 openHPHistory:1400 closeHPHistory:1428 updateVersionBlock:1433

**app-migrate.js** (893 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:885

**app-builds.js** (1641 строк, 43 функций)  
_withBuilds:7 openBuildPicker:17 renderBuildPicker:50 renderBuildBadge:112 renderEditionBadge:131 unlinkBuild:143 _stemSet:164 _matchByStems:170 _weaponMatchNames:178 _findWeapon:181 _findArmorPreset:206 applyBuild:220 _applyBuildCore:232 _pick:832 _glossNorm:924 _reEscape:925 _glossEd:926 _glossBuild:927 ingest:929 _glossIndex:951 glossarizeHtml:959 _glossPopoverEl:973 hideGlossPopover:985 showGlossPopover:990 _glossBindOnce:1009 openBuildGuide:1040 gx:1063 _list:1064 getBuildLevelRec:1127 getBuildRecChoiceOption:1132 getBuildRecChoiceIds:1140 getBuildRecFeat:1145 getBuildRecAsi:1155 getBuildRecSubclass:1162 parseAsiFromHeadline:1170 _buildFeatNameMap:1184 parseFeatFromHeadline:1226 parseSpellsFromHeadline:1243 getBuildRecSpellObjs:1487 openBuildPlan:1507 _cpSubclassOf:1560 _cpClassSwitch:1571 openClassPlan:1586

**app-io.js** (387 строк, 14 функций)  
_buildExportPayload:9 exportData:23 _isValidImportedChar:36 _normalizeImportedSpell:50 _isValidImportedSpell:61 _collectCharUserSpells:65 _ingestImportedUserSpells:83 _extractCharsFromImport:128 _applyFullRestore:136 importData:155 importOneCharacter:205 exportSpells:292 importSpells:301 exportSessionLog:374

**app-combat.js** (1575 строк, 66 функций)  
showRollModePopup:9 rollD20WithMode:34 formatRollMode:49 formatRollModeLabel:64 showDualDice:71 formatDiceInfoStr:89 rollSavingThrow:102 rollAbilityCheck:117 rollSkillCheck:129 initSaves:145 autoSelectProficiencies:180 initSkills:216 toggleAbilOpen:243 openAbilityInfo:254 toggleExpertise:281 loadExpertise:300 updateSkillProfCount:314 updateClassFeatures:324 calculateAC:339 toggleInspiration:400 updateStatusBar:411 updateInspirationLabels:462 updateStatDisplay:479 updateAllStatDisplays:484 adjustStat:488 adjustCoin:511 updateCoinTotal:521 openCoinExchange:532 closeCoinExchange:537 previewExchange:541 confirmExchange:577 updateSubclassOptions:603 updateSubclassRecHint:655 recalculateHP:669 updateChar:707 toggleProficiency:773 calcStats:796 setSpellStat:867 calcSpellStats:878 onRaceChange:922 rollRandomName:1023 pick:1031 build:1032 renderRaceExtras:1053 toggleHalfElfStat:1108 openRaceFeatModal:1132 removeRaceFeat:1150 applyBasicLockUI:1176 updateLockButtonState:1199 lockBasicInfo:1229 unlockBasicInfo:1243 isSheetLocked:1269 sheetLockGuard:1275 applySheetLockUI:1281 lockSheet:1308 unlockSheet:1318 onBackgroundChange:1339 renderBackgroundFeature:1378 onArmorChange:1395 onManualAC:1418 onManualMaxHP:1425 calcCoinWeight:1444 getActiveConditionsForRender:1458 toggleConditionsPopup:1487 closeConditionsPopup:1499 renderConditionsPopup:1505

**app-conditions.js** (473 строк, 26 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 _condMatches:101 setConditionsSearch:106 toggleConditionsActiveOnly:107 renderConditionsGrid:113 toggleConditionDesc:166 toggleEffectDesc:174 initConditions:181 getExhaustionLevel:213 adjustExhaustion:220 updateExhaustionDisplay:241 toggleCondition:262 updateConditionsCount:283 loadConditions:292 _fxMatches:306 setEffectsSearch:311 setEffectsType:312 toggleEffectsActiveOnly:320 renderEffectsGrid:326 initEffects:409 toggleEffect:429 updateEffectsCount:458 loadEffects:467

**app-cast-effects.js** (348 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:232 _aefRowHtml:247 renderActiveEffectsFab:261 toggleActiveEffectsPanel:281 _aefBindOutside:300 advanceActiveEffects:320 removeActiveEffect:332

**app-proficiencies.js** (638 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:63 addChoiceLanguage:147 addCustomLanguage:163 removeCustomLanguage:190 getToolChoiceSlots:215 buildToolOptionsHtml:281 renderTools:302 addChoiceTool:374 addCustomTool:390 removeCustomTool:417 renderArmorProf:436 renderWeaponProf:486 addCustomArmorType:550 removeCustomArmorType:566 addCustomWeaponType:578 removeCustomWeaponType:593 addCustomSpecificWeapon:604 removeCustomSpecificWeapon:625

**app-hp.js** (1632 строк, 47 функций)  
openRestModal:6 closeRestModal:11 showRestMain:17 showShortRestInfo:25 showLongRestInfo:47 showRestResult:76 adjustHitDice:88 updateHitDiceInfo:99 confirmRest:114 openLevelUpModal:201 _showMulticlassScreen:223 openMulticlassNewClass:266 confirmMulticlassNewClass:316 _showLevelUpPreview:327 closeLevelUpModal:492 confirmLevelUp:505 _luShowResult:678 luFinishChoices:702 luRefreshChoices:709 luSetSubclass:716 luApplyFeatById:733 luApplyAsi:765 _ccDefsFor:782 _luAsiDone:793 luApplyAllRecommendations:798 luBuildChoicesScreen:919 recBadge:927 luAddRecommendedSpells:1048 luGoToSpellsTab:1076 openLevelDownConfirm:1088 confirmLevelDown:1132 loadDeathSaves:1169 toggleDeathSave:1208 resetDeathSaves:1225 updateHPDisplay:1238 hpToggleRow:1318 hpSetRowOpen:1327 updateHPSummary:1335 updateHPRows:1381 quickHP:1399 addHPHistory:1485 showHPToast:1496 applyCustomHP:1520 saveTempHP:1532 rollHitDieQuick:1545 renderHitDiceIcons:1574 rollDeathSave:1588

**app-inventory.js** (1580 строк, 68 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:289 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:377 adjustItemCharges:388 openItemModal:404 closeItemModal:461 submitItem:465 openMagicCatalog:529 closeMagicCatalog:546 renderMagicCatalog:551 fillFromMagicItem:583 openGearCatalog:633 closeGearCatalog:649 renderGearPacks:654 renderGearCatalog:664 fillFromGearItem:692 addPackToInventory:714 rollTrinket:736 _weaponCatalog:767 renderWeaponPresets:780 filterWeaponPresets:838 toggleWeaponFilter:842 fillWeaponPreset:849 _resetWeaponForm:878 openWeaponModal:897 closeWeaponModal:907 editWeapon:915 deleteCustomWeapon:945 _weaponPresetByName:971 checkWeaponProficiency:978 submitWeapon:1006 renderWeapons:1090 isLightWeapon:1161 toggleTWFStyle:1166 rollTWFAttack:1174 rollTWFDamage:1222 rollWeaponAttack:1251 rollWeaponDamage:1300 removeWeapon:1346 _invDndInit:1380 _invClearIndicators:1409 _invSetIndicator:1418 _invCleanup:1423 _invCancelDrag:1430 _invMoveItem:1438 _invCommitDrop:1455 invDragStart:1476 invDragOver:1486 invDragLeave:1503 invDrop:1507 invDragEnd:1513 invTouchStart:1520 invTouchMove:1536 invTouchEnd:1568

**app-spells.js** (1612 строк, 76 функций)  
toggleSpellStatRow:9 renderSpellSlots:14 togglePactSlot:83 adjustPactSlots:94 updateSpellSlots:108 toggleSpellSlot:119 adjustSpellSlots:130 restoreAllSlots:148 setSpellVersion:159 setSpellClass:167 _charSpellClassKey:176 _charMaxCastableLevel:187 _defaultSpellVersion:195 openSpellSearch:198 markCharOwnClassFilter:215 closeSpellSearch:245 _parseSpellClassList:265 _syncNewSpellClassChips:269 toggleNewSpellClass:276 _fillNewSpellDamageTypes:301 _toggleHidden:308 updateNewSpellMechFields:316 _hbFormulaCheck:331 _collectHbEffect:340 _spellIdArg:378 _findHomebrewSpell:384 openAddSpellForm:392 _syncCustomSpellAcrossChars:471 _purgeCustomSpellFromChars:489 deleteCustomSpell:508 _deleteCustomSpellConfirmed:517 closeAddSpellForm:531 submitNewSpell:535 renderSpellSearch:625 addSpell:689 removeSpell:705 toggleSpellCard:717 renderMySpells:722 _spellActiveBadgeText:857 _spellActiveBadgeHtml:861 updateSpellActiveBadges:864 _spellPrepEntry:885 _prepClassLevel:893 calcMaxPrepared:903 calcMaxCantrips:921 isPrepClass:927 isSpellPrepared:931 toggleSpellPrepared:937 renderPrepCounter:966 _castableSlotOptions:1000 castSpell:1014 _castSpellWithSlot:1035 _finishCast:1057 applyCastEffects:1097 openCastVariantChooser:1138 pickCastVariant:1176 closeCastVariantChooser:1186 _applyCastSummon:1199 _nextCastInstanceId:1233 _replaceCastInstance:1241 _ensureCastInstance:1271 _applyCastDamage:1291 _rollCastDamage:1307 _startCastRepeat:1371 castRepeatDamage:1385 _applyCastDebuff:1410 castSpellAttackMod:1451 castStatMod:1457 _applyCastHeal:1470 _applyCastTempHp:1491 applyCastTempHp:1508 _applyCastHpMaxBonus:1522 openCastChooser:1542 closeCastChooser:1563 castRitual:1572 cancelRitual:1601

**app-party.js** (1581 строк, 119 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:78 getStatusColor:84 openPartyTab:90 renderMyChar:98 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:210 _pentSave:211 _pentDelete:236 _pentStatus:245 _pentExport:250 _isValidPentry:257 _pentImport:260 openAddAllyModal:287 openEditAllyModal:288 closeAddAllyModal:289 saveAlly:290 deleteAlly:291 setAllyStatus:292 exportAllies:293 importAllies:294 openAddNPCModal:296 openEditNPCModal:297 closeAddNPCModal:298 saveNPC:299 deleteNPC:300 setNPCStatus:301 exportNPCs:302 importNPCs:303 openAddMonsterModal:305 openEditMonsterModal:306 closeAddMonsterModal:307 saveMonster:308 deleteMonster:309 setMonsterStatus:310 exportMonsters:311 importMonsters:312 _npcAttColor:317 renderNPCs:323 renderMonsters:364 _openSrdMonsterPickerLazy:418 openSrdMonsterPicker:428 openSrdMonsterPickerForBattle:430 _openSrdMonsterPickerCore:435 closeSrdMonsterPicker:471 setSrdMonsterSearch:473 setSrdMonsterCr:474 setSrdMonsterEdition:475 renderSrdMonsterPicker:477 addMonsterFromSRD:520 openSrdNpcPicker:561 _openSrdNpcPickerCore:570 closeSrdNpcPicker:591 setSrdNpcSearch:593 setSrdNpcAtt:594 renderSrdNpcPicker:596 addNpcFromSRD:628 openBattleTab:658 buildBattleSetupList:671 setBattleSearch:691 toggleBattleSection:692 renderBattleSetup:697 toggleBattleCheck:741 battleDragStart:746 battleDragOver:747 battleDrop:748 battleDragEnd:756 rollInitiativeValue:761 sortParticipantsByInitiative:766 _findPartyMonster:772 _participantCombatMeta:782 _makeBattleParticipant:806 _battleParticipantHP:819 _addSrdMonsterToBattle:828 startBattle:858 getParticipantDesc:871 showTrackerInfo:894 getSelfStatusFromHP:930 syncSelfBattleStatus:944 renderBattleTracker:954 renderBattleCastPanels:1046 _battleCondDots:1087 adjustBattleHP:1102 setBattleHP:1115 setBattleHPMax:1136 setBattleInitiative:1147 rerollInitiative:1159 battleRollD20:1171 removeBattleParticipant:1176 setBattleStatus:1192 _battleStatusFromHp:1200 offerCastDamageToBattle:1216 _castDamageAmount:1232 _renderCastDamageModal:1237 setCastDamageHalf:1286 applyCastDamageToTarget:1295 closeCastDamageModal:1313 _castDebuffTargets:1334 offerCastDebuffToBattle:1340 _renderCastDebuffModal:1356 toggleCastDebuffTarget:1411 pickCastDebuffTarget:1421 applyCastDebuffTargets:1430 closeCastDebuffModal:1458 _battleDebuffChips:1467 removeBattleDebuff:1484 removeBattleDebuffsForSpell:1497 clearAllBattleDebuffs:1512 _logTurn:1517 nextTurn:1522 prevTurn:1532 tickCastEffectsRound:1543 endBattle:1571

**app-notes.js** (1346 строк, 63 функций)  
renderNotes:43 _renderNotesSubtabs:61 notesSwitchTab:83 _renderNotesMain:95 _findTab:113 _getSectionVariants:125 _renderSectionsView:138 _renderVariantsPanel:193 _renderMdToolbar:216 notesToggleSection:248 notesToggleVariants:264 notesPickVariant:276 notesRegenerateAll:287 notesPickRandomVariant:317 _applyVariantToSection:330 _mdToHtml:350 closeLists:362 _countStats:402 _bindSectionInputs:409 _updateStats:422 _notesHotkeys:431 notesMdInsert:446 wrap:455 linePrefix:462 notesTogglePreview:512 notesUpdateSection:531 _syncTakenFeatsLocation:546 _renderEntriesView:559 _renderEntryCard:618 notesPinDragStart:665 notesPinDragOver:675 notesPinDragLeave:684 notesPinDrop:689 notesPinDragEnd:699 _notesReorderPinned:708 notesSetTagFilter:736 notesJumpToNpc:742 notesOpenEntryModal:770 notesCloseEntryModal:804 _notesRenderModalTags:809 notesAddModalTag:821 notesModalTagKeydown:831 notesRemoveModalTag:835 notesSaveEntryModal:841 notesDeleteEntry:889 notesTogglePin:904 _notesLogJournal:939 notesSearchInput:965 notesSearchKeydown:972 _hlText:990 _renderSearchResults:1000 notesClearSearch:1081 notesToggleMenu:1092 _notesMenuClose:1105 notesMenuAction:1111 _notesCharName:1126 _notesTriggerDownload:1131 notesExportMd:1139 notesExportJson:1184 notesHandleImportJson:1195 notesHandleImportMd:1246 notesPrint:1281 _notesFlashSaved:1312

**app-ui.js** (1109 строк, 63 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:126 removeAvatar:144 renderSheetAvatar:163 prefersReducedMotion:178 animateCountUp:184 tick:192 _reportError:215 swTelegramBlock:278 showUpdateModal:289 checkWhatsNew:320 showWhatsNewModal:332 toggleAccordion:368 initCharResources:388 getResourceMax:397 getCharResourceDefs:414 currentDieSize:444 crRow:456 crRestoreLabel:469 crResourceRow:481 crRowsHtml:532 crSetRows:568 renderClassResources:583 spendResource:601 resetResource:619 toggleResourcePip:629 resetResourcesByRest:654 getJournal:688 addJournalEntry:693 filterJournal:715 renderJournal:722 deleteJournalEntry:759 openAddJournalEntry:768 closeAddJournalEntry:772 saveJournalEntry:775 getCompanions:795 renderCompanions:800 companionHP:845 buildFamiliarFormOptions:858 onCompanionTypeChange:870 applyFamiliarForm:878 openAddCompanionModal:890 summonFamiliar:906 openPrefilledCompanionModal:916 openEditCompanionModal:927 closeAddCompanionModal:946 saveCompanion:949 deleteCompanion:974 switchProfilesTab:990 clipChangelogText:1005 expandChangelogItem:1016 renderChangelog:1022 openItemRef:1067 closeItemRef:1072 switchItemRef:1077 _syncHeaderHeight:1095

**app-dice.js** (1379 строк, 61 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:216 rollDice:220 _quickRollCompute:315 _quickRollModStr:334 _emitDiceRolled:340 _setDiceSettled:348 _setSettledDice:358 _quickRollRecord:375 _quickRollInfoText:382 _quickRollToastText:389 quickRoll:405 renderQuickRollStrip:463 updateQuickRollStripVisibility:485 dismissQuickRollStrip:500 openDiceRollHistory:505 drawDiceSVG:518 _waitDiceBoxModule:537 _getAccentColor:555 _getDiceTheme:574 _getDiceThemeColor:581 setDiceTheme:584 _syncDiceThemeButtons:590 _getDiceBg:600 setDiceBg:607 _syncDiceBgButtons:613 _diceDbg:623 _initDiceBox:628 animateDice3d:734 animateDice2d:925 buildDie:951 tick:1019 _applyDiceCritGlow:1042 parseDiceFormula:1063 _formulaCanon:1098 _renderFormulaResult:1110 rollFormula:1145 _rollFormulaFrom:1211 rollCustomFormula:1224 renderDiceHistory:1227 createParticles:1249 _diceShapeSvg:1285 renderDiceFan:1292 _paintSelectedDie:1312 selectDie:1333 rollSelectedDie:1352 toggleDiceFormulaPanel:1361

**app-settings.js** (645 строк, 60 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 _e24BetaEnabled:158 getEdition:161 setEdition:171 _syncEditionButtons:184 _getStatsLayout:211 _applyStatsLayout:218 _statsInCards:225 _statsRowTarget:229 _placeStatRows:247 setStatsLayout:263 _syncStatsLayoutButtons:270 _getSheetLock:283 setSheetLock:287 _syncSheetLockButtons:292 _getStatsCollapsed:301 _applyStatsCollapsed:304 toggleStatsCollapsed:309 _getStoredDensity:323 _getDefaultDensity:331 _getDensity:338 _applyDensity:341 setDensity:345 _syncDensityButtons:351 _onViewportDensityChange:359 _getFontScale:377 _applyFontScale:384 setFontScale:395 _syncFontScaleUi:406 _getGlassAlpha:421 _getGlassBlur:428 _applyGlassAlpha:435 _applyGlassBlur:436 setGlassAlpha:437 setGlassBlur:447 _syncGlassUi:456 _getSpaceMode:505 _applySpaceBg:512 setSpaceMode:527 _syncSpaceButtons:533 _spaceOnScroll:552 _applyDymkaIcons:580 _initAppLinks:593 openSettingsModal:622 closeSettingsModal:632

**app-asi.js** (440 строк, 15 функций)  
asiMarkUsed:17 openASIModalForLevel:28 openASIModal:34 closeASIModal:74 buildASIStatGrid:85 getASIMode:106 toggleASIStat:111 updateASIPreview:127 buildFeatList:201 filterFeatList:229 selectFeat:237 _asiUnlockSheet:253 applyASI:261 renderTakenFeats:386 removeFeat:424

**app-progress.js** (669 строк, 38 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:164 _pgAttention:205 _pgGrownLast:235 _pgClassRow:248 _pgClasses:290 _pgNext:306 _pgAvailableClasses:361 _pgActions:374 _pgBuild:391 openProgressTab:404 openProgress:414 pgTabActive:425 pgRefresh:432 pgSetSubclass:440 pgFocusSubclass:454 pgLevelUp:471 pgLevelDown:476 pgAfterLevelModal:482 pgAddClass:493 renderClassDev:504 _pgSheetAboutRow:523 _pgSubclassRows:541 syncClassFieldUI:566 openFeatureInfo:598 _fiRuleNotes:640

**app-desktop.js** (398 строк, 11 функций)  
syncFromStatusBar:103 _esc:158 _stripEmoji:164 _condIcon:168 setRowExpanded:174 collapseRow:180 renderRrConditions:182 renderRailSlots:228 updateRailHpRow:272 rrApplyHP:287 init:300

**app-help.js** (1131 строк, 52 функций)  
openHelp:12 closeHelp:19 switchHelpSection:29 getHelpFlag:82 setHelpFlag:86 welcomeGoStep:92 showWelcome:102 closeWelcome:109 welcomeContinue:115 welcomeSkipExperienced:121 welcomeBack:127 welcomeFinish:134 dismissWelcome:167 maybeShowWelcome:170 restartOnboarding:175 _tourWide:211 _ensureTourDom:214 _resolveTarget:255 _tourFirstVisible:270 _tourAnyModalVisible:290 _tourModalOpen:296 _tourStartWhenClear:308 startTour:320 startListTour:333 startSheetTour:337 maybeStartSheetTour:343 restartTour:361 startTabTour:386 maybeStartTabTour:404 tourNext:426 tourPrev:431 endTour:437 _showTourStep:447 _setBox:510 _computeTourBoxes:526 snap:528 corner:541 _layoutTourCorners:563 _layoutTour:580 _onTourKey:683 _onTourReflow:689 _bindTourGlobal:693 _unbindTourGlobal:698 _buildListSteps:709 _buildSheetSteps:759 _buildProgressSteps:840 _buildSpellsSteps:898 _buildInventorySteps:935 _buildBattleSteps:975 _buildNotesSteps:1007 _buildPartySteps:1042 _buildJournalSteps:1100

**app-backup.js** (209 строк, 10 функций)  
_backupLog:24 _backupOpenDb:28 listBackupSnapshots:44 createBackupSnapshot:63 initAutoBackup:105 restoreBackupSnapshot:121 createBackupNow:146 _backupFmtDate:159 toggleBackupPanel:165 renderBackupList:173

**app-pdf.js** (700 строк, 20 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:75 _pdfDecoBorder:91 _pdfSafeName:125 _pdfFormatMod:129 _pdfRule:132 _pdfSection:140 _pdfNeed:151 _pdfMultiline:161 _pdfFooter:179 _pdfStatsAndCombat:276 _pdfSaves:370 _pdfSkills:397 _pdfAttacks:425 _pdfSpells:458 _pdfInventory:556 _pdfNotes:611

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (5697 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:21 DAMAGE_TYPES:24 DEFAULT_CHARACTER:31 FAMILIAR_FORMS:104 SAVES_DATA:126 CONDITIONS:135 EFFECTS_DATA:158 CLASS_FEATURES:209 SPELL_PREP_CLASSES:491 SPELL_SLOTS_BY_LEVEL:498 CLASS_HIT_DICE:573 SUBCLASSES:579 SOURCE_LABELS:598 SUBCLASS_SOURCE:606 SUBCLASS_LEVEL:675 SUBCLASS_FEATURES:691 WEAPON_PRESETS:1406 ITEM_ICONS:1450 CATEGORY_NAMES:1451 GEAR_PACKS:1460 RACE_DATA:1555 BACKGROUND_SKILLS:1686 BACKGROUND_ALIASES:1723 DEITY_ALIGN_LABELS:1736 DEITIES_DATA:1741 LANGUAGE_CATALOG:1809 RACE_LANGUAGES:1838 CLASS_LANGUAGES:1864 TOOL_CATALOG:1870 RACE_TOOLS:1925 CLASS_TOOLS:1932 SUBCLASS_LANGUAGES:1940 SUBCLASS_TOOLS:1953 RACE_ARMOR:1975 RACE_WEAPONS_SPECIFIC:1979 CLASS_WEAPONS_SPECIFIC:1992 RACE_NAME_POOLS:2002 RACE_NAME_GROUP:2044 SUBCLASS_ARMOR:2058 ARMOR_PRESETS:2088 skills:2105 ABILITY_INFO:2118 CLASS_SKILL_OPTIONS:2158 CLASS_ARMOR_PROFS:2174 CLASS_RESOURCES:2194 ASI_LEVELS:2348 XP_THRESHOLDS:2356 APP_VERSION:2366 APP_VERSION_DATE:2367 APP_TELEGRAM_URL:2373 APP_DONATE_URL:2374 APP_BOOSTY_URL:2375 FEATS_DATA:2391 APP_CHANGELOG:2710 CASTER_TYPE:5538 THIRD_CASTER_SUBCLASSES:5547 THIRD_CASTER_SLOTS:5554 MULTICLASS_SPELL_SLOTS:5565 MULTICLASS_PREREQUISITES:5590 MULTICLASS_PROFICIENCIES:5606 EDITION_DATA:5635

**spells.js** (13274 строк)  
SPELLS_BASE:7

**spell-effects.js** (849 строк)  
SPELL_EFFECTS:71

**class-choices.js** (680 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:437

**subclass-choices-data.js** (790 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 SUBCLASS_CHOICES:144 SUBCLASS_RESOURCES:333

