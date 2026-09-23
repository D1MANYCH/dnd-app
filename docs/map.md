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
| 7524–7792 | RACIAL BONUS BAR |
| 7793–7939 | COMPACT STATS GRID |
| 7940–8207 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8208–8260 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8261–8311 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8312–8411 | COMPACT SKILLS |
| 8412–8454 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8455–8526 | ACCORDION |
| 8527–8550 | CLASS RESOURCES |
| 8551–8641 | ASI MODAL |
| 8642–8887 | APP VERSION |
| 8888–8897 | COMPANIONS |
| 8898–8937 | FEATS LIST IN ASI |
| 8938–9183 | PROFILES TABS (Чейнджлог) |
| 9184–9262 | TAKEN FEATS |
| 9263–9459 | SW UPDATE MODAL |
| 9460–9466 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9467–9634 | INVENTORY SLOTS SYSTEM |
| 9635–9830 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9831–10079 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10080–10252 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10253–10322 | 3D DICE CUBE |
| 10323–10693 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10694–10763 | DESKTOP LAYOUT — centered max-width |
| 10764–10784 | INSPIRATION |
| 10785–10824 | CONCENTRATION |
| 10825–11514 | WEAPON CARDS WITH ROLL BUTTONS |
| 11515–11622 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11623–11685 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11686–11712 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11713–11833 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 11834–11860 | R6: Ассеты (декор) |
| 11861–12812 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 12813–12892 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 12893–12901 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 12902–12971 | UI-13: доступ к настройкам и усиление back-кнопки |
| 12972–13246 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13247–13273 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13274–13321 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13322–13374 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13375–14474 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14475–14530 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14531–14623 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14624–14927 | DISC-1 · Ромб раскрытия |
| 14928–15431 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15432–15526 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15527–15609 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 15610–15840 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 15841–15850 | STYLE-8b3-fix: срезанный ромб |
| 15851–16117 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16118–16604 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 16605–16639 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 16640–16716 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #edition-row:225-250  
#welcome-modal:251-255 #welcome-step-1:256-274 #welcome-step-2:275-309 #header-avatar:310-317 #status-bar:318-321 #status-inspiration:322-322 #status-concentration:323-325 #status-ritual:326-328  
#status-conditions-btn:329-339 #screen-home:340-342 #home-art:343-370 #home-sub-new:371-413 #home-hero:414-414 #home-hero-emblem:415-418 #home-hero-sub:419-419 #home-hero-chips:420-430  
#screen-characters:431-470 #char-hero:471-471 #char-hero-emblem:472-475 #char-hero-sub:476-476 #char-hero-chips:477-477 #char-hero-actions:478-486 #screen-data:487-500 #storage-status:501-501  
#backup-panel:502-506 #backup-list:507-518 #screen-about:519-522 #app-version-row:523-530 #ptab-info:531-538 #app-links-row:539-544 #ptab-changelog:545-549 #changelog-list:550-556  
#screen-character:557-557 #tab-sheet:558-560 #creation-wizard-banner:561-569 #cw-validation:570-572 #basic-locked-bar:573-589 #sheet-avatar:590-602 #char-build-badge-wrap:603-617 #char-class-mc:618-641  
#char-subclass-rec:642-642 #char-subclass-mc:643-705 #race-bonus-display:706-706 #race-extras-panel:707-708 #background-feature-display:709-710 #bg-extras-panel:711-757 #stats-collapse-btn:758-765 #abilities-region:766-769  
#proficiency-bonus-2024:770-771 #insp-card-2024:772-781 #abil-col-1:782-782 #stat-block-str:783-784 #mod-str:785-791 #abil-save-slot-str:792-792 #abil-skills-slot-str:793-795 #stat-block-dex:796-797  
#mod-dex:798-804 #abil-save-slot-dex:805-805 #abil-skills-slot-dex:806-808 #stat-block-int:809-810 #mod-int:811-817 #abil-save-slot-int:818-818 #abil-skills-slot-int:819-822 #abil-col-2:823-823  
#stat-block-con:824-825 #mod-con:826-832 #abil-save-slot-con:833-833 #abil-skills-slot-con:834-836 #stat-block-wis:837-838 #mod-wis:839-845 #abil-save-slot-wis:846-846 #abil-skills-slot-wis:847-849  
#stat-block-cha:850-851 #mod-cha:852-858 #abil-save-slot-cha:859-859 #abil-skills-slot-cha:860-873 #saves-grid:874-883 #skills-container:884-886 #passive-perception:887-910 #hp-dmg-row:911-920  
#hp-dmg-body:921-936 #death-saves-section:937-968 #hp-armor-body:969-1010 #hp-hd-body:1011-1024 #hp-rest-body:1025-1052 #class-dev-section:1053-1055 #cd-head:1056-1056 #cd-res:1057-1057  
#cd-attn:1058-1059 #cd-about:1060-1068 #ac-formula:1069-1070 #ac-modifiers:1071-1078 #conditions-grid:1079-1086 #effects-grid:1087-1094 #resistances-container:1095-1107 #armor-prof-container:1108-1111  
#weapon-prof-container:1112-1115 #tools-container:1116-1119 #languages-container:1120-1127 #companions-list-sheet:1128-1140 #tab-progress:1141-1142 #pg-body:1143-1144 #tab-spells:1145-1168 #spell-mod-display:1169-1174  
#spell-dc-display:1175-1180 #spell-attack-display:1181-1203 #spell-slots-visual:1204-1209 #concentration-block:1210-1226 #prep-counter:1227-1227 #my-spells-list:1228-1230 #tab-inventory:1231-1250 #weight-fill:1251-1285  
#inventory-list:1286-1295 #inv-pouches:1296-1350 #coin-exchange-modal:1351-1389 #exch-preview:1390-1397 #tab-notes:1398-1423 #notes-subtabs:1424-1425 #notes-main:1426-1427 #taken-feats-section:1428-1432  
#taken-feats-list:1433-1436 #tab-party:1437-1445 #my-char-card:1446-1460 #allies-list:1461-1476 #npcs-list:1477-1492 #monsters-list:1493-1504 #companions-list-world:1505-1515 #tab-battle:1516-1521  
#weapons-list:1522-1525 #battle-res-card:1526-1527 #battle-res-rows:1528-1529 #battle-setup-screen:1530-1538 #battle-setup-list:1539-1542 #battle-tracker-screen:1543-1547 #battle-turn-info:1548-1553 #battle-repeat-strip:1554-1554  
#battle-tracker-list:1555-1564 #tab-journal:1565-1579 #journal-list:1580-1586 #screen-itemref:1587-1589 #item-ref-tabs:1590-1595 #item-ref-weight:1596-1634 #item-ref-slots:1635-1666 #screen-help:1667-1689  
#help-about:1690-1713 #help-start:1714-1738 #help-sheet:1739-1758 #help-progress:1759-1798 #help-spells:1799-1815 #help-inventory:1816-1828 #help-battle:1829-1845 #help-party:1846-1858  
#help-notes:1859-1867 #help-journal:1868-1876 #help-planes:1877-1904 #help-dice:1905-1916 #help-edition2024:1917-1946 #help-data:1947-1959 #help-marks:1960-1982 #conc-details-modal:1983-1993  
#conc-detail-duration-row:1994-2001 #conc-detail-desc-row:2002-2011 #add-journal-modal:2012-2034 #add-npc-modal:2035-2063 #add-ally-modal:2064-2097 #srd-monster-modal:2098-2109 #srd-monster-count:2110-2110 #srd-monster-results:2111-2118  
#srd-npc-modal:2119-2127 #srd-npc-count:2128-2128 #srd-npc-results:2129-2136 #add-monster-modal:2137-2194 #screen-rest:2195-2197 #rest-main-screen:2198-2204 #rest-info-screen:2205-2209 #hit-dice-section:2210-2220  
#rest-food-section:2221-2229 #rest-result-screen:2230-2232 #rest-result-details:2233-2241 #screen-levelup:2242-2246 #lu-screen-multiclass:2247-2248 #lu-mc-current-classes:2249-2251 #lu-mc-new-class:2252-2256 #lu-mc-prereq-warn:2257-2257  
#lu-mc-subclass-row:2258-2266 #lu-screen-preview:2267-2299 #lu-slots-card:2300-2301 #lu-slots-info:2302-2305 #lu-build-hint:2306-2306 #lu-features-container:2307-2314 #lu-screen-choices:2315-2316 #lu-choices-body:2317-2323  
#lu-screen-result:2324-2325 #lu-result-title:2326-2326 #lu-result-body:2327-2333 #screen-hphistory:2334-2336 #hp-history-list:2337-2342 #asi-modal:2343-2346 #asi-build-hint:2347-2361 #asi-feat-list:2362-2362  
#asi-stat-grid:2363-2363 #asi-preview:2364-2372 #class-choice-modal:2373-2387 #dice-modal:2388-2426 #dice-file-hint:2427-2427 #dice3d-result:2428-2439 #dice-result-display:2440-2443 #dice-mode-segment:2444-2451  
#dice-pick:2452-2455 #dice-fan:2456-2462 #dice-formula-panel:2463-2491 #dice-popover-settings:2492-2538 #dice-popover-history:2539-2550 #dice-history:2551-2559 #screen-spellsearch:2560-2578 #spell-class-filter:2579-2622  
#class-filter-legend:2623-2624 #spell-search-count:2625-2625 #spell-search-results:2626-2629 #cast-spell-modal:2630-2634 #cast-spell-options:2635-2637 #add-spell-modal:2638-2681 #new-spell-class-chips:2682-2727 #new-spell-mech-fields:2728-2732  
#new-spell-mech-dmg-row:2733-2752 #new-spell-mech-half-row:2753-2755 #new-spell-mech-mod-row:2756-2766 #item-modal:2767-2830 #screen-magiccatalog:2831-2858 #magic-catalog-count:2859-2859 #magic-catalog-list:2860-2863 #screen-gearcatalog:2864-2868  
#gear-packs-list:2869-2882 #gear-catalog-count:2883-2883 #gear-catalog-list:2884-2888 #weapon-modal:2889-2892 #weapon-picker-section:2893-2895 #weapon-filter-chips:2896-2905 #weapon-presets-list:2906-2968 #character-tabs:2969-2980  
#quick-roll-strip:2981-2986 #qrs-list:2987-2997 #active-effects-panel:2998-3002 #aef-list:3003-3009 #hp-toast-container:3010-3012 #add-companion-modal:3013-3028 #companion-familiar-row:3029-3048 #confirm-modal:3049-3061  
#avatar-modal:3062-3065 #avatar-modal-preview:3066-3093 #screen-builds:3094-3116 #bp-list:3117-3121 #screen-buildguide:3122-3124 #bg-body:3125-3129 #screen-buildplan:3130-3132 #bp-plan-body:3133-3137  
#screen-abilityinfo:3138-3140 #ai-body:3141-3145 #screen-featureinfo:3146-3148 #fi-body:3149-3153 #app-log-panel:3154-3173 #app-log-list:3174-3318 #notes-entry-modal:3319-3367  

## Функции по файлам (`имя:строка`)

**rules.js** (866 строк, 46 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 charClassLevel:33 charHasClass:43 charClassLevelOr:53 charAsiSlots:62 charSubclassPending:76 charXpNext:89 rulesJackOfAllTrades:100 rulesHasExpertise:104 getInitiativeMod:110 rulesSaveBonus:122 rulesSkillBonus:128 rulesPassivePerception:142 rulesSpellStats:146 armorPenalties:161 rulesAC:172 charCasterLevel:290 classSpellSlotRow:324 getMulticlassSpellSlots:337 resolvePactSlots:369 restoreItemCharges:379 rulesHitDieSides:396 rulesShortRest:402 rulesLongRestBlockReason:448 rulesLongRest:461 concSaveParams:521 getCharClassPairs:538 findLangInCatalog:550 ensureLanguagesArray:562 recalcLanguagesFromSources:578 add:583 findToolInCatalog:628 ensureToolsArray:640 getBackgroundDef:661 validateBgStatChoice:679 parseBackgroundToolEntry:699 recalcToolsFromSources:709 add:714 ensureArmorWeaponFields:778 recalcArmorWeaponFromSources:791 addArmor:797 addWeapon:798 addSpec:846

**app-core.js** (1463 строк, 67 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 migrateToMulticlass:60 syncClassFields:74 isMulticlass:82 getClassLabel:87 getClassLine:96 checkMulticlassPrereqs:104 autoFillItemWeight:176 setItemQty:193 saveToLocal:266 initPersistentStorage:280 _formatStorageBytes:301 updateStorageStatus:309 currentScreenName:366 screenBack:372 _modalVisible:386 _closeOpenModals:389 headerBack:399 _screenMotionOk:432 _screenGhostDrop:438 _screenGhostStart:450 _screenEnter:468 showScreen:477 updateHeaderTitle:579 syncDrawerHeader:633 switchTab:645 openDrawer:675 closeDrawer:688 showCharacterNav:700 hideCharacterNav:708 isInteractive:728 currentActiveTab:751 createNewCharacter:809 getClassColor:827 getClassIcon:842 getAbilityIcon:849 getConditionIcon:864 getConditionChipIcon:888 getSpellClassIcon:906 getSchoolSlug:923 getSchoolIcon:927 stripLeadingEmoji:940 formatTimeAgo:944 setCharSort:958 setCharSearch:965 duplicateCharacter:969 exportOneCharacter:981 updateCharCounter:1007 onDragStart:1024 onDragOver:1025 onDrop:1026 renderCharacterList:1037 renderCharPlate:1104 deleteCharacter:1160 showConfirmModal:1173 safeSet:1206 safeSetChecked:1210 loadCharacter:1218 showToast:1389 openHPHistory:1402 closeHPHistory:1430 updateVersionBlock:1435

**app-migrate.js** (910 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:902

**app-builds.js** (1641 строк, 43 функций)  
_withBuilds:7 openBuildPicker:17 renderBuildPicker:50 renderBuildBadge:112 renderEditionBadge:131 unlinkBuild:143 _stemSet:164 _matchByStems:170 _weaponMatchNames:178 _findWeapon:181 _findArmorPreset:206 applyBuild:220 _applyBuildCore:232 _pick:832 _glossNorm:924 _reEscape:925 _glossEd:926 _glossBuild:927 ingest:929 _glossIndex:951 glossarizeHtml:959 _glossPopoverEl:973 hideGlossPopover:985 showGlossPopover:990 _glossBindOnce:1009 openBuildGuide:1040 gx:1063 _list:1064 getBuildLevelRec:1127 getBuildRecChoiceOption:1132 getBuildRecChoiceIds:1140 getBuildRecFeat:1145 getBuildRecAsi:1155 getBuildRecSubclass:1162 parseAsiFromHeadline:1170 _buildFeatNameMap:1184 parseFeatFromHeadline:1226 parseSpellsFromHeadline:1243 getBuildRecSpellObjs:1487 openBuildPlan:1507 _cpSubclassOf:1560 _cpClassSwitch:1571 openClassPlan:1586

**app-io.js** (387 строк, 14 функций)  
_buildExportPayload:9 exportData:23 _isValidImportedChar:36 _normalizeImportedSpell:50 _isValidImportedSpell:61 _collectCharUserSpells:65 _ingestImportedUserSpells:83 _extractCharsFromImport:128 _applyFullRestore:136 importData:155 importOneCharacter:205 exportSpells:292 importSpells:301 exportSessionLog:374

**app-combat.js** (2080 строк, 85 функций)  
showRollModePopup:9 rollD20WithMode:34 formatRollMode:49 formatRollModeLabel:64 showDualDice:71 formatDiceInfoStr:89 rollSavingThrow:102 rollAbilityCheck:117 rollSkillCheck:129 initSaves:145 autoSelectProficiencies:180 initSkills:216 toggleAbilOpen:243 openAbilityInfo:254 toggleExpertise:281 loadExpertise:300 updateSkillProfCount:314 updateClassFeatures:324 calculateAC:339 toggleInspiration:400 updateStatusBar:411 updateInspirationLabels:462 updateStatDisplay:479 updateAllStatDisplays:484 adjustStat:488 adjustCoin:511 updateCoinTotal:521 openCoinExchange:532 closeCoinExchange:537 previewExchange:541 confirmExchange:577 updateSubclassOptions:603 updateSubclassRecHint:657 recalculateHP:671 updateChar:716 toggleProficiency:782 calcStats:805 setSpellStat:876 calcSpellStats:887 onRaceChange:931 populateRaceSelect:1056 _speciesEffective:1080 _renderSpeciesBar:1093 _speciesChoiceOptions:1107 toggleSpeciesChoice:1114 syncSpeciesSpells:1128 rollRandomName:1173 pick:1181 build:1182 renderRaceExtras:1203 toggleHalfElfStat:1280 openRaceFeatModal:1304 removeRaceFeat:1322 applyBasicLockUI:1348 updateLockButtonState:1371 lockBasicInfo:1402 unlockBasicInfo:1417 isSheetLocked:1444 sheetLockGuard:1450 applySheetLockUI:1456 lockSheet:1483 unlockSheet:1493 onBackgroundChange:1514 _bgCheckSkills:1554 renderBackgroundFeature:1566 _bgStatShort:1605 populateBackgroundSelect:1608 _bgRevertStatChoice:1630 _bgApplyStat:1641 setBgStatMode:1650 toggleBgStat:1662 _bgAfterStats:1684 _bgRevertFeatEffects:1694 syncOriginFeat:1714 toggleBgCustom:1743 giveBackgroundEquipment:1780 renderBackgroundExtras:1822 onArmorChange:1900 onManualAC:1923 onManualMaxHP:1930 calcCoinWeight:1949 getActiveConditionsForRender:1963 toggleConditionsPopup:1992 closeConditionsPopup:2004 renderConditionsPopup:2010

**app-conditions.js** (473 строк, 26 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 _condMatches:101 setConditionsSearch:106 toggleConditionsActiveOnly:107 renderConditionsGrid:113 toggleConditionDesc:166 toggleEffectDesc:174 initConditions:181 getExhaustionLevel:213 adjustExhaustion:220 updateExhaustionDisplay:241 toggleCondition:262 updateConditionsCount:283 loadConditions:292 _fxMatches:306 setEffectsSearch:311 setEffectsType:312 toggleEffectsActiveOnly:320 renderEffectsGrid:326 initEffects:409 toggleEffect:429 updateEffectsCount:458 loadEffects:467

**app-cast-effects.js** (348 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:232 _aefRowHtml:247 renderActiveEffectsFab:261 toggleActiveEffectsPanel:281 _aefBindOutside:300 advanceActiveEffects:320 removeActiveEffect:332

**app-proficiencies.js** (639 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:148 addCustomLanguage:164 removeCustomLanguage:191 getToolChoiceSlots:216 buildToolOptionsHtml:282 renderTools:303 addChoiceTool:375 addCustomTool:391 removeCustomTool:418 renderArmorProf:437 renderWeaponProf:487 addCustomArmorType:551 removeCustomArmorType:567 addCustomWeaponType:579 removeCustomWeaponType:594 addCustomSpecificWeapon:605 removeCustomSpecificWeapon:626

**app-hp.js** (1640 строк, 47 функций)  
openRestModal:6 closeRestModal:11 showRestMain:17 showShortRestInfo:25 showLongRestInfo:47 showRestResult:76 adjustHitDice:88 updateHitDiceInfo:99 confirmRest:114 openLevelUpModal:201 _showMulticlassScreen:223 openMulticlassNewClass:266 confirmMulticlassNewClass:316 _showLevelUpPreview:327 closeLevelUpModal:492 confirmLevelUp:505 _luShowResult:678 luFinishChoices:702 luRefreshChoices:709 luSetSubclass:716 luApplyFeatById:733 luApplyAsi:773 _ccDefsFor:790 _luAsiDone:801 luApplyAllRecommendations:806 luBuildChoicesScreen:927 recBadge:935 luAddRecommendedSpells:1056 luGoToSpellsTab:1084 openLevelDownConfirm:1096 confirmLevelDown:1140 loadDeathSaves:1177 toggleDeathSave:1216 resetDeathSaves:1233 updateHPDisplay:1246 hpToggleRow:1326 hpSetRowOpen:1335 updateHPSummary:1343 updateHPRows:1389 quickHP:1407 addHPHistory:1493 showHPToast:1504 applyCustomHP:1528 saveTempHP:1540 rollHitDieQuick:1553 renderHitDiceIcons:1582 rollDeathSave:1596

**app-inventory.js** (1672 строк, 73 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:289 countAttuned:340 _hasAttunable:350 toggleAttuned:357 updateAttuneCount:377 adjustItemCharges:388 openItemModal:404 closeItemModal:461 submitItem:465 openMagicCatalog:529 closeMagicCatalog:546 renderMagicCatalog:551 fillFromMagicItem:583 openGearCatalog:633 closeGearCatalog:649 renderGearPacks:654 renderGearCatalog:664 fillFromGearItem:692 addPackToInventory:714 rollTrinket:736 _weaponPresets2024:772 getWeaponMasteryLimit:791 getWeaponMasteryProp:813 isWeaponMastered:820 toggleWeaponMastery:823 _weaponCatalog:841 renderWeaponPresets:855 filterWeaponPresets:918 toggleWeaponFilter:922 fillWeaponPreset:929 _resetWeaponForm:958 openWeaponModal:977 closeWeaponModal:987 editWeapon:995 deleteCustomWeapon:1025 _weaponPresetByName:1051 checkWeaponProficiency:1058 submitWeapon:1086 renderWeapons:1170 isLightWeapon:1253 toggleTWFStyle:1258 rollTWFAttack:1266 rollTWFDamage:1314 rollWeaponAttack:1343 rollWeaponDamage:1392 removeWeapon:1438 _invDndInit:1472 _invClearIndicators:1501 _invSetIndicator:1510 _invCleanup:1515 _invCancelDrag:1522 _invMoveItem:1530 _invCommitDrop:1547 invDragStart:1568 invDragOver:1578 invDragLeave:1595 invDrop:1599 invDragEnd:1605 invTouchStart:1612 invTouchMove:1628 invTouchEnd:1660

**app-spells.js** (1617 строк, 76 функций)  
toggleSpellStatRow:9 renderSpellSlots:14 togglePactSlot:83 adjustPactSlots:94 updateSpellSlots:108 toggleSpellSlot:119 adjustSpellSlots:130 restoreAllSlots:148 setSpellVersion:159 setSpellClass:167 _charSpellClassKey:176 _charMaxCastableLevel:187 _defaultSpellVersion:195 openSpellSearch:198 markCharOwnClassFilter:215 closeSpellSearch:245 _parseSpellClassList:265 _syncNewSpellClassChips:269 toggleNewSpellClass:276 _fillNewSpellDamageTypes:301 _toggleHidden:308 updateNewSpellMechFields:316 _hbFormulaCheck:331 _collectHbEffect:340 _spellIdArg:378 _findHomebrewSpell:384 openAddSpellForm:392 _syncCustomSpellAcrossChars:471 _purgeCustomSpellFromChars:489 deleteCustomSpell:508 _deleteCustomSpellConfirmed:517 closeAddSpellForm:531 submitNewSpell:535 renderSpellSearch:625 addSpell:689 removeSpell:705 toggleSpellCard:718 renderMySpells:723 _spellActiveBadgeText:859 _spellActiveBadgeHtml:863 updateSpellActiveBadges:866 _spellPrepEntry:887 _prepClassLevel:895 calcMaxPrepared:905 calcMaxCantrips:923 isPrepClass:929 isSpellPrepared:933 toggleSpellPrepared:942 renderPrepCounter:971 _castableSlotOptions:1005 castSpell:1019 _castSpellWithSlot:1040 _finishCast:1062 applyCastEffects:1102 openCastVariantChooser:1143 pickCastVariant:1181 closeCastVariantChooser:1191 _applyCastSummon:1204 _nextCastInstanceId:1238 _replaceCastInstance:1246 _ensureCastInstance:1276 _applyCastDamage:1296 _rollCastDamage:1312 _startCastRepeat:1376 castRepeatDamage:1390 _applyCastDebuff:1415 castSpellAttackMod:1456 castStatMod:1462 _applyCastHeal:1475 _applyCastTempHp:1496 applyCastTempHp:1513 _applyCastHpMaxBonus:1527 openCastChooser:1547 closeCastChooser:1568 castRitual:1577 cancelRitual:1606

**app-party.js** (1581 строк, 119 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:78 getStatusColor:84 openPartyTab:90 renderMyChar:98 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:210 _pentSave:211 _pentDelete:236 _pentStatus:245 _pentExport:250 _isValidPentry:257 _pentImport:260 openAddAllyModal:287 openEditAllyModal:288 closeAddAllyModal:289 saveAlly:290 deleteAlly:291 setAllyStatus:292 exportAllies:293 importAllies:294 openAddNPCModal:296 openEditNPCModal:297 closeAddNPCModal:298 saveNPC:299 deleteNPC:300 setNPCStatus:301 exportNPCs:302 importNPCs:303 openAddMonsterModal:305 openEditMonsterModal:306 closeAddMonsterModal:307 saveMonster:308 deleteMonster:309 setMonsterStatus:310 exportMonsters:311 importMonsters:312 _npcAttColor:317 renderNPCs:323 renderMonsters:364 _openSrdMonsterPickerLazy:418 openSrdMonsterPicker:428 openSrdMonsterPickerForBattle:430 _openSrdMonsterPickerCore:435 closeSrdMonsterPicker:471 setSrdMonsterSearch:473 setSrdMonsterCr:474 setSrdMonsterEdition:475 renderSrdMonsterPicker:477 addMonsterFromSRD:520 openSrdNpcPicker:561 _openSrdNpcPickerCore:570 closeSrdNpcPicker:591 setSrdNpcSearch:593 setSrdNpcAtt:594 renderSrdNpcPicker:596 addNpcFromSRD:628 openBattleTab:658 buildBattleSetupList:671 setBattleSearch:691 toggleBattleSection:692 renderBattleSetup:697 toggleBattleCheck:741 battleDragStart:746 battleDragOver:747 battleDrop:748 battleDragEnd:756 rollInitiativeValue:761 sortParticipantsByInitiative:766 _findPartyMonster:772 _participantCombatMeta:782 _makeBattleParticipant:806 _battleParticipantHP:819 _addSrdMonsterToBattle:828 startBattle:858 getParticipantDesc:871 showTrackerInfo:894 getSelfStatusFromHP:930 syncSelfBattleStatus:944 renderBattleTracker:954 renderBattleCastPanels:1046 _battleCondDots:1087 adjustBattleHP:1102 setBattleHP:1115 setBattleHPMax:1136 setBattleInitiative:1147 rerollInitiative:1159 battleRollD20:1171 removeBattleParticipant:1176 setBattleStatus:1192 _battleStatusFromHp:1200 offerCastDamageToBattle:1216 _castDamageAmount:1232 _renderCastDamageModal:1237 setCastDamageHalf:1286 applyCastDamageToTarget:1295 closeCastDamageModal:1313 _castDebuffTargets:1334 offerCastDebuffToBattle:1340 _renderCastDebuffModal:1356 toggleCastDebuffTarget:1411 pickCastDebuffTarget:1421 applyCastDebuffTargets:1430 closeCastDebuffModal:1458 _battleDebuffChips:1467 removeBattleDebuff:1484 removeBattleDebuffsForSpell:1497 clearAllBattleDebuffs:1512 _logTurn:1517 nextTurn:1522 prevTurn:1532 tickCastEffectsRound:1543 endBattle:1571

**app-notes.js** (1346 строк, 63 функций)  
renderNotes:43 _renderNotesSubtabs:61 notesSwitchTab:83 _renderNotesMain:95 _findTab:113 _getSectionVariants:125 _renderSectionsView:138 _renderVariantsPanel:193 _renderMdToolbar:216 notesToggleSection:248 notesToggleVariants:264 notesPickVariant:276 notesRegenerateAll:287 notesPickRandomVariant:317 _applyVariantToSection:330 _mdToHtml:350 closeLists:362 _countStats:402 _bindSectionInputs:409 _updateStats:422 _notesHotkeys:431 notesMdInsert:446 wrap:455 linePrefix:462 notesTogglePreview:512 notesUpdateSection:531 _syncTakenFeatsLocation:546 _renderEntriesView:559 _renderEntryCard:618 notesPinDragStart:665 notesPinDragOver:675 notesPinDragLeave:684 notesPinDrop:689 notesPinDragEnd:699 _notesReorderPinned:708 notesSetTagFilter:736 notesJumpToNpc:742 notesOpenEntryModal:770 notesCloseEntryModal:804 _notesRenderModalTags:809 notesAddModalTag:821 notesModalTagKeydown:831 notesRemoveModalTag:835 notesSaveEntryModal:841 notesDeleteEntry:889 notesTogglePin:904 _notesLogJournal:939 notesSearchInput:965 notesSearchKeydown:972 _hlText:990 _renderSearchResults:1000 notesClearSearch:1081 notesToggleMenu:1092 _notesMenuClose:1105 notesMenuAction:1111 _notesCharName:1126 _notesTriggerDownload:1131 notesExportMd:1139 notesExportJson:1184 notesHandleImportJson:1195 notesHandleImportMd:1246 notesPrint:1281 _notesFlashSaved:1312

**app-ui.js** (1114 строк, 63 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:126 removeAvatar:144 renderSheetAvatar:163 prefersReducedMotion:178 animateCountUp:184 tick:192 _reportError:215 swTelegramBlock:278 showUpdateModal:289 checkWhatsNew:320 showWhatsNewModal:332 toggleAccordion:368 initCharResources:388 getResourceMax:397 getCharResourceDefs:414 currentDieSize:444 crRow:456 crRestoreLabel:469 crResourceRow:483 crRowsHtml:534 crSetRows:570 renderClassResources:585 spendResource:603 resetResource:621 toggleResourcePip:631 resetResourcesByRest:656 getJournal:693 addJournalEntry:698 filterJournal:720 renderJournal:727 deleteJournalEntry:764 openAddJournalEntry:773 closeAddJournalEntry:777 saveJournalEntry:780 getCompanions:800 renderCompanions:805 companionHP:850 buildFamiliarFormOptions:863 onCompanionTypeChange:875 applyFamiliarForm:883 openAddCompanionModal:895 summonFamiliar:911 openPrefilledCompanionModal:921 openEditCompanionModal:932 closeAddCompanionModal:951 saveCompanion:954 deleteCompanion:979 switchProfilesTab:995 clipChangelogText:1010 expandChangelogItem:1021 renderChangelog:1027 openItemRef:1072 closeItemRef:1077 switchItemRef:1082 _syncHeaderHeight:1100

**app-dice.js** (1379 строк, 61 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:216 rollDice:220 _quickRollCompute:315 _quickRollModStr:334 _emitDiceRolled:340 _setDiceSettled:348 _setSettledDice:358 _quickRollRecord:375 _quickRollInfoText:382 _quickRollToastText:389 quickRoll:405 renderQuickRollStrip:463 updateQuickRollStripVisibility:485 dismissQuickRollStrip:500 openDiceRollHistory:505 drawDiceSVG:518 _waitDiceBoxModule:537 _getAccentColor:555 _getDiceTheme:574 _getDiceThemeColor:581 setDiceTheme:584 _syncDiceThemeButtons:590 _getDiceBg:600 setDiceBg:607 _syncDiceBgButtons:613 _diceDbg:623 _initDiceBox:628 animateDice3d:734 animateDice2d:925 buildDie:951 tick:1019 _applyDiceCritGlow:1042 parseDiceFormula:1063 _formulaCanon:1098 _renderFormulaResult:1110 rollFormula:1145 _rollFormulaFrom:1211 rollCustomFormula:1224 renderDiceHistory:1227 createParticles:1249 _diceShapeSvg:1285 renderDiceFan:1292 _paintSelectedDie:1312 selectDie:1333 rollSelectedDie:1352 toggleDiceFormulaPanel:1361

**app-settings.js** (645 строк, 60 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 _e24BetaEnabled:158 getEdition:161 setEdition:171 _syncEditionButtons:184 _getStatsLayout:211 _applyStatsLayout:218 _statsInCards:225 _statsRowTarget:229 _placeStatRows:247 setStatsLayout:263 _syncStatsLayoutButtons:270 _getSheetLock:283 setSheetLock:287 _syncSheetLockButtons:292 _getStatsCollapsed:301 _applyStatsCollapsed:304 toggleStatsCollapsed:309 _getStoredDensity:323 _getDefaultDensity:331 _getDensity:338 _applyDensity:341 setDensity:345 _syncDensityButtons:351 _onViewportDensityChange:359 _getFontScale:377 _applyFontScale:384 setFontScale:395 _syncFontScaleUi:406 _getGlassAlpha:421 _getGlassBlur:428 _applyGlassAlpha:435 _applyGlassBlur:436 setGlassAlpha:437 setGlassBlur:447 _syncGlassUi:456 _getSpaceMode:505 _applySpaceBg:512 setSpaceMode:527 _syncSpaceButtons:533 _spaceOnScroll:552 _applyDymkaIcons:580 _initAppLinks:593 openSettingsModal:622 closeSettingsModal:632

**app-asi.js** (496 строк, 17 функций)  
asiMarkUsed:17 openASIModalForLevel:28 openASIModal:34 closeASIModal:74 buildASIStatGrid:85 getASIMode:106 toggleASIStat:111 updateASIPreview:127 getFeatDef:203 _featPickerList:221 buildFeatList:233 filterFeatList:262 selectFeat:270 _asiUnlockSheet:286 applyASI:294 renderTakenFeats:437 removeFeat:478

**app-progress.js** (671 строк, 38 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:164 _pgAttention:205 _pgGrownLast:235 _pgClassRow:248 _pgClasses:290 _pgNext:306 _pgAvailableClasses:361 _pgActions:374 _pgBuild:391 openProgressTab:404 openProgress:414 pgTabActive:425 pgRefresh:432 pgSetSubclass:440 pgFocusSubclass:454 pgLevelUp:471 pgLevelDown:476 pgAfterLevelModal:482 pgAddClass:493 renderClassDev:504 _pgSheetAboutRow:523 _pgSubclassRows:541 syncClassFieldUI:567 openFeatureInfo:599 _fiRuleNotes:642

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

**data.js** (5768 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:21 DAMAGE_TYPES:24 DEFAULT_CHARACTER:31 FAMILIAR_FORMS:108 SAVES_DATA:130 CONDITIONS:139 EFFECTS_DATA:162 CLASS_FEATURES:213 SPELL_PREP_CLASSES:495 SPELL_SLOTS_BY_LEVEL:502 CLASS_HIT_DICE:577 SUBCLASSES:583 SOURCE_LABELS:602 SUBCLASS_SOURCE:611 SUBCLASS_LEVEL:681 SUBCLASS_FEATURES:697 WEAPON_PRESETS:1417 ITEM_ICONS:1461 CATEGORY_NAMES:1462 GEAR_PACKS:1471 RACE_DATA:1566 BACKGROUND_SKILLS:1697 BACKGROUND_ALIASES:1734 DEITY_ALIGN_LABELS:1747 DEITIES_DATA:1752 LANGUAGE_CATALOG:1820 RACE_LANGUAGES:1849 CLASS_LANGUAGES:1875 TOOL_CATALOG:1881 RACE_TOOLS:1936 CLASS_TOOLS:1943 SUBCLASS_LANGUAGES:1951 SUBCLASS_TOOLS:1964 RACE_ARMOR:1986 RACE_WEAPONS_SPECIFIC:1990 CLASS_WEAPONS_SPECIFIC:2003 RACE_NAME_POOLS:2013 RACE_NAME_GROUP:2055 SUBCLASS_ARMOR:2069 ARMOR_PRESETS:2099 skills:2116 ABILITY_INFO:2129 CLASS_SKILL_OPTIONS:2169 CLASS_ARMOR_PROFS:2185 CLASS_RESOURCES:2205 ASI_LEVELS:2359 XP_THRESHOLDS:2367 APP_VERSION:2377 APP_VERSION_DATE:2378 APP_TELEGRAM_URL:2384 APP_DONATE_URL:2385 APP_BOOSTY_URL:2386 FEATS_DATA:2406 APP_CHANGELOG:2725 CASTER_TYPE:5601 THIRD_CASTER_SUBCLASSES:5610 THIRD_CASTER_SLOTS:5617 MULTICLASS_SPELL_SLOTS:5628 MULTICLASS_PREREQUISITES:5653 MULTICLASS_PROFICIENCIES:5669 EDITION_DATA:5698

**spells.js** (13274 строк)  
SPELLS_BASE:7

**spell-effects.js** (849 строк)  
SPELL_EFFECTS:71

**class-choices.js** (693 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (790 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 SUBCLASS_CHOICES:144 SUBCLASS_RESOURCES:333

