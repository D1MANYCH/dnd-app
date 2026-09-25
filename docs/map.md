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
| 278–458 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 459–556 | UI-2. Пресеты акцента (8 цветов) |
| 557–573 | Body — атмосферный cream-фон + warm radial + SVG-noise |
| 574–581 | UI4-glass: декоративные «лозы» светлой темы убраны |
| 582–590 | Заголовки |
| 591–1005 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1006–1307 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1308–1313 | R2. Базовые компоненты |
| 1314–1472 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1473–1745 | UI-3. Desktop/tablet layout (≥1024px) |
| 1746–1848 | UI5-4: ПК — многоколоночная раскладка листа |
| 1849–1924 | /R2 |
| 1925–2098 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2099–2260 | HEADER (R5: back + name + hamburger) |
| 2261–2326 | КД АВТО-РАСЧЁТ |
| 2327–2396 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2397–2462 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2463–2622 | УСЛОВИЯ |
| 2623–2769 | СПАСБРОСКИ |
| 2770–2921 | CLASS FEATURES |
| 2922–2961 | УБИРАЕМ СТРЕЛКИ |
| 2962–3066 | TAB NAV — 5 tabs + centered FAB dice |
| 3067–3189 | UX-5: лента последних бросков вне модалки |
| 3190–3366 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3367–3386 | HAMBURGER BUTTON |
| 3387–3428 | SIDE DRAWER |
| 3429–3926 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3927–3974 | MENU-8/9: встречающий экран во всё окно. |
| 3975–4066 | MENU-2: плашка последнего героя. |
| 4067–4241 | MENU-3: меню приключения. |
| 4242–4312 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4313–4313 | INVENTORY |
| 4314–4344 | INVENTORY — WEIGHT BAR |
| 4345–4381 | INVENTORY — BACKPACK HEADER |
| 4382–4422 | INVENTORY — FILTERS |
| 4423–4611 | INVENTORY — ITEM CARDS |
| 4612–4977 | COINS — BIG NUMBER CARD GRID |
| 4978–5260 | MODALS |
| 5261–5295 | DICE |
| 5296–5876 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5877–6752 | OTHER STYLES |
| 6753–6821 | HP DISPLAY BLOCK |
| 6822–6847 | MOBILE OPTIMIZATION |
| 6848–6976 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 6977–7015 | HP TOAST (snackbar) |
| 7016–7067 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7068–7121 | Confirm Modal |
| 7122–7529 | ⚔️ ОТРЯД & БОЙ |
| 7530–7801 | RACIAL BONUS BAR |
| 7802–7948 | COMPACT STATS GRID |
| 7949–8216 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8217–8269 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8270–8320 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8321–8420 | COMPACT SKILLS |
| 8421–8463 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8464–8535 | ACCORDION |
| 8536–8559 | CLASS RESOURCES |
| 8560–8652 | ASI MODAL |
| 8653–8898 | APP VERSION |
| 8899–8908 | COMPANIONS |
| 8909–8954 | FEATS LIST IN ASI |
| 8955–9200 | PROFILES TABS (Чейнджлог) |
| 9201–9279 | TAKEN FEATS |
| 9280–9476 | SW UPDATE MODAL |
| 9477–9483 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9484–9651 | INVENTORY SLOTS SYSTEM |
| 9652–9847 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9848–10096 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10097–10269 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10270–10339 | 3D DICE CUBE |
| 10340–10712 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10713–10782 | DESKTOP LAYOUT — centered max-width |
| 10783–10803 | INSPIRATION |
| 10804–10843 | CONCENTRATION |
| 10844–11521 | WEAPON CARDS WITH ROLL BUTTONS |
| 11522–11632 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11633–11695 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11696–11722 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11723–11843 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 11844–11870 | R6: Ассеты (декор) |
| 11871–12822 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 12823–12902 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 12903–12911 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 12912–12981 | UI-13: доступ к настройкам и усиление back-кнопки |
| 12982–13256 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13257–13283 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13284–13331 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13332–13384 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13385–14482 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14483–14538 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14539–14631 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14632–14935 | DISC-1 · Ромб раскрытия |
| 14936–15439 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15440–15534 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15535–15617 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 15618–15848 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 15849–15858 | STYLE-8b3-fix: срезанный ромб |
| 15859–16125 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16126–16612 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 16613–16647 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 16648–16931 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #edition-row:225-250  
#welcome-modal:251-255 #welcome-step-1:256-274 #welcome-step-2:275-309 #header-avatar:310-317 #status-bar:318-321 #status-inspiration:322-322 #status-concentration:323-325 #status-ritual:326-328  
#status-conditions-btn:329-339 #screen-home:340-342 #home-art:343-370 #home-sub-new:371-413 #home-hero:414-414 #home-hero-emblem:415-418 #home-hero-sub:419-419 #home-hero-chips:420-430  
#screen-characters:431-470 #char-hero:471-471 #char-hero-emblem:472-475 #char-hero-sub:476-476 #char-hero-chips:477-477 #char-hero-actions:478-486 #screen-data:487-500 #storage-status:501-501  
#backup-panel:502-506 #backup-list:507-518 #screen-about:519-522 #app-version-row:523-530 #ptab-info:531-538 #app-links-row:539-544 #ptab-changelog:545-549 #changelog-list:550-556  
#screen-character:557-557 #tab-sheet:558-560 #creation-wizard-banner:561-569 #cw-validation:570-572 #basic-locked-bar:573-589 #sheet-avatar:590-602 #char-build-badge-wrap:603-617 #char-class-mc:618-641  
#char-subclass-rec:642-642 #char-subclass-mc:643-706 #race-bonus-display:707-707 #race-extras-panel:708-709 #background-feature-display:710-711 #bg-extras-panel:712-758 #stats-collapse-btn:759-766 #abilities-region:767-770  
#proficiency-bonus-2024:771-772 #insp-card-2024:773-782 #abil-col-1:783-783 #stat-block-str:784-785 #mod-str:786-792 #abil-save-slot-str:793-793 #abil-skills-slot-str:794-796 #stat-block-dex:797-798  
#mod-dex:799-805 #abil-save-slot-dex:806-806 #abil-skills-slot-dex:807-809 #stat-block-int:810-811 #mod-int:812-818 #abil-save-slot-int:819-819 #abil-skills-slot-int:820-823 #abil-col-2:824-824  
#stat-block-con:825-826 #mod-con:827-833 #abil-save-slot-con:834-834 #abil-skills-slot-con:835-837 #stat-block-wis:838-839 #mod-wis:840-846 #abil-save-slot-wis:847-847 #abil-skills-slot-wis:848-850  
#stat-block-cha:851-852 #mod-cha:853-859 #abil-save-slot-cha:860-860 #abil-skills-slot-cha:861-874 #saves-grid:875-884 #skills-container:885-887 #passive-perception:888-911 #hp-dmg-row:912-921  
#hp-dmg-body:922-942 #death-saves-section:943-974 #hp-armor-body:975-1016 #hp-hd-body:1017-1030 #hp-rest-body:1031-1058 #class-dev-section:1059-1061 #cd-head:1062-1062 #cd-res:1063-1063  
#cd-attn:1064-1065 #cd-about:1066-1074 #ac-formula:1075-1076 #ac-modifiers:1077-1084 #conditions-grid:1085-1092 #effects-grid:1093-1100 #resistances-container:1101-1113 #armor-prof-container:1114-1117  
#weapon-prof-container:1118-1121 #tools-container:1122-1125 #languages-container:1126-1133 #companions-list-sheet:1134-1146 #tab-progress:1147-1148 #pg-body:1149-1150 #tab-spells:1151-1174 #spell-mod-display:1175-1180  
#spell-dc-display:1181-1186 #spell-attack-display:1187-1192 #spell-stats-by-class:1193-1210 #spell-slots-visual:1211-1216 #concentration-block:1217-1233 #prep-counter:1234-1234 #my-spells-list:1235-1237 #tab-inventory:1238-1257  
#weight-fill:1258-1292 #inventory-list:1293-1302 #inv-pouches:1303-1359 #tab-notes:1360-1385 #notes-subtabs:1386-1387 #notes-main:1388-1389 #taken-feats-section:1390-1394 #taken-feats-list:1395-1398  
#tab-party:1399-1407 #my-char-card:1408-1422 #allies-list:1423-1438 #npcs-list:1439-1454 #monsters-list:1455-1466 #companions-list-world:1467-1477 #tab-battle:1478-1483 #weapons-list:1484-1487  
#battle-res-card:1488-1489 #battle-res-rows:1490-1491 #battle-setup-screen:1492-1500 #battle-setup-list:1501-1504 #battle-tracker-screen:1505-1509 #battle-turn-info:1510-1515 #battle-repeat-strip:1516-1516 #battle-tracker-list:1517-1526  
#tab-journal:1527-1541 #journal-list:1542-1548 #screen-itemref:1549-1551 #item-ref-tabs:1552-1557 #item-ref-weight:1558-1596 #item-ref-slots:1597-1628 #screen-help:1629-1651 #help-about:1652-1675  
#help-start:1676-1700 #help-sheet:1701-1720 #help-progress:1721-1760 #help-spells:1761-1777 #help-inventory:1778-1790 #help-battle:1791-1807 #help-party:1808-1820 #help-notes:1821-1829  
#help-journal:1830-1838 #help-planes:1839-1866 #help-dice:1867-1878 #help-edition2024:1879-1918 #help-data:1919-1931 #help-marks:1932-1954 #conc-details-modal:1955-1965 #conc-detail-duration-row:1966-1973  
#conc-detail-desc-row:1974-1983 #add-journal-modal:1984-2007 #add-npc-modal:2008-2037 #add-ally-modal:2038-2072 #srd-monster-modal:2073-2085 #srd-monster-count:2086-2086 #srd-monster-results:2087-2094 #srd-npc-modal:2095-2104  
#srd-npc-count:2105-2105 #srd-npc-results:2106-2113 #add-monster-modal:2114-2172 #screen-rest:2173-2175 #rest-main-screen:2176-2182 #rest-info-screen:2183-2187 #hit-dice-section:2188-2189 #hit-dice-controls-total:2190-2194  
#hit-dice-by-size:2195-2199 #rest-food-section:2200-2208 #rest-result-screen:2209-2211 #rest-result-details:2212-2220 #screen-levelup:2221-2225 #lu-screen-multiclass:2226-2227 #lu-mc-current-classes:2228-2230 #lu-mc-new-class:2231-2235  
#lu-mc-prereq-warn:2236-2236 #lu-mc-subclass-row:2237-2245 #lu-screen-preview:2246-2278 #lu-slots-card:2279-2280 #lu-slots-info:2281-2284 #lu-build-hint:2285-2285 #lu-features-container:2286-2293 #lu-screen-choices:2294-2295  
#lu-choices-body:2296-2302 #lu-screen-result:2303-2304 #lu-result-title:2305-2305 #lu-result-body:2306-2312 #screen-hphistory:2313-2315 #hp-history-list:2316-2321 #asi-modal:2322-2326 #asi-build-hint:2327-2341  
#asi-feat-list:2342-2342 #asi-stat-grid:2343-2343 #asi-preview:2344-2352 #class-choice-modal:2353-2368 #dice-modal:2369-2407 #dice-file-hint:2408-2408 #dice3d-result:2409-2420 #dice-result-display:2421-2424  
#dice-mode-segment:2425-2432 #dice-pick:2433-2436 #dice-fan:2437-2443 #dice-formula-panel:2444-2472 #dice-popover-settings:2473-2519 #dice-popover-history:2520-2531 #dice-history:2532-2540 #screen-spellsearch:2541-2559  
#spell-class-filter:2560-2603 #class-filter-legend:2604-2605 #spell-search-count:2606-2606 #spell-search-results:2607-2610 #cast-spell-modal:2611-2615 #cast-spell-options:2616-2618 #add-spell-modal:2619-2662 #new-spell-class-chips:2663-2708  
#new-spell-mech-fields:2709-2713 #new-spell-mech-dmg-row:2714-2733 #new-spell-mech-half-row:2734-2736 #new-spell-mech-mod-row:2737-2747 #item-modal:2748-2811 #coin-exchange-modal:2812-2850 #exch-preview:2851-2856 #screen-magiccatalog:2857-2884  
#magic-catalog-count:2885-2885 #magic-catalog-list:2886-2889 #screen-gearcatalog:2890-2894 #gear-packs-list:2895-2908 #gear-catalog-count:2909-2909 #gear-catalog-list:2910-2914 #weapon-modal:2915-2918 #weapon-picker-section:2919-2921  
#weapon-filter-chips:2922-2931 #weapon-presets-list:2932-2994 #character-tabs:2995-3006 #quick-roll-strip:3007-3012 #qrs-list:3013-3023 #active-effects-panel:3024-3028 #aef-list:3029-3035 #hp-toast-container:3036-3038  
#add-companion-modal:3039-3055 #companion-familiar-row:3056-3075 #confirm-modal:3076-3089 #avatar-modal:3090-3093 #avatar-modal-preview:3094-3121 #screen-builds:3122-3151 #bp-list:3152-3156 #screen-buildguide:3157-3159  
#bg-body:3160-3164 #screen-buildplan:3165-3167 #bp-plan-body:3168-3172 #screen-abilityinfo:3173-3175 #ai-body:3176-3180 #screen-featureinfo:3181-3183 #fi-body:3184-3188 #app-log-panel:3189-3208  
#app-log-list:3209-3353 #notes-entry-modal:3354-3402  

## Функции по файлам (`имя:строка`)

**rules.js** (1408 строк, 92 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHitDicePool:57 _hdSizesDesc:65 rulesHitDiceSpentBy:71 rulesHitDiceLabel:95 rulesPickHitDice:103 rulesClampHitDice:115 rulesRitualMinutes:127 rulesHitDieHeal:134 rulesSpendHitDice:140 charClassLevel:164 charHasClass:174 charClassLevelOr:184 charAsiSlots:193 charEpicSlots:208 charSubclassPending:226 charXpNext:239 rulesJackOfAllTrades:250 charClassSubclass:255 rulesHasFeat:264 rulesHasFightingStyle:269 rulesHasDraconicResilience:281 rulesHasDazzlingFootwork:286 rulesRemarkableAthlete:291 rulesUntrainedCheckBonus:297 rulesHasExpertise:304 getInitiativeMod:310 rulesSaveBonus:324 rulesSkillBonus:330 rulesPassivePerception:345 rulesSpellStats:349 _spellStatMod:369 rulesSpellStatsByClass:377 rulesWeaponMods:395 rulesOffhandDamageMod:411 armorPenalties:420 rulesAC:433 charCasterLevel:565 classSpellSlotRow:606 getMulticlassSpellSlots:619 rulesRestoreLevelFields:655 rulesApplySpellSlots:674 resolvePactSlots:697 restoreItemCharges:707 rulesHitDieSides:724 rulesShortRest:730 rulesLongRestBlockReason:765 rulesLongRest:778 rulesExhaustionLevel:844 rulesEffectiveHpMax:850 _dsReset:855 _dsCount:856 _dsFill:857 _condAdd:858 _condRemove:859 rulesIsDead:861 rulesIsStable:865 rulesRegainFromZero:870 rulesDamageAfterDefenses:876 rulesApplyDamage:888 rulesDeathSaveBlockReason:925 rulesDeathSave:932 rulesConditionRollMods:951 rulesEffectiveSpeed:968 rulesArmorStealthDisadv:989 rulesFeatPrereqMissing:998 rulesFeatStatChoice:1025 rulesFeatStatOptions:1033 concSaveParams:1048 getCharClassPairs:1068 charEditionMismatch:1082 findLangInCatalog:1090 ensureLanguagesArray:1102 recalcLanguagesFromSources:1118 add:1123 findToolInCatalog:1168 ensureToolsArray:1180 getBackgroundDef:1201 validateBgStatChoice:1219 parseBackgroundToolEntry:1239 recalcToolsFromSources:1249 add:1254 ensureArmorWeaponFields:1319 recalcArmorWeaponFromSources:1332 addArmor:1338 addWeapon:1339 addSpec:1388

**app-core.js** (1514 строк, 72 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _blockSaving:263 _loadCharsSafe:277 _onStorageChange:292 saveToLocal:308 initPersistentStorage:323 _formatStorageBytes:344 updateStorageStatus:352 currentScreenName:409 screenBack:415 _modalVisible:429 _closeOpenModals:432 headerBack:442 _screenMotionOk:475 _screenGhostDrop:481 _screenGhostStart:493 _screenEnter:511 showScreen:520 updateHeaderTitle:622 syncDrawerHeader:676 switchTab:688 openDrawer:718 closeDrawer:731 showCharacterNav:743 hideCharacterNav:751 isInteractive:771 currentActiveTab:794 createNewCharacter:852 getClassColor:868 getClassIcon:883 getAbilityIcon:890 getConditionIcon:905 getConditionChipIcon:929 getSpellClassIcon:947 getSchoolSlug:964 getSchoolIcon:968 stripLeadingEmoji:981 formatTimeAgo:985 setCharSort:999 setCharSearch:1006 duplicateCharacter:1010 exportOneCharacter:1022 updateCharCounter:1048 onDragStart:1065 onDragOver:1066 onDrop:1067 renderCharacterList:1078 renderCharPlate:1145 deleteCharacter:1201 showConfirmModal:1214 safeSet:1257 safeSetChecked:1261 loadCharacter:1269 showToast:1440 openHPHistory:1453 closeHPHistory:1481 updateVersionBlock:1486

**app-migrate.js** (928 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:920

**app-builds.js** (1692 строк, 43 функций)  
_withBuilds:7 openBuildPicker:17 renderBuildPicker:53 renderBuildBadge:117 renderEditionBadge:134 unlinkBuild:146 _stemSet:167 _matchByStems:173 _weaponMatchNames:181 _findWeapon:184 _findArmorPreset:209 applyBuild:223 _applyBuildCore:246 _pick:870 _glossNorm:973 _reEscape:974 _glossEd:975 _glossBuild:976 ingest:978 _glossIndex:1000 glossarizeHtml:1008 _glossPopoverEl:1022 hideGlossPopover:1034 showGlossPopover:1039 _glossBindOnce:1058 openBuildGuide:1089 gx:1112 _list:1113 getBuildLevelRec:1176 getBuildRecChoiceOption:1181 getBuildRecChoiceIds:1189 getBuildRecFeat:1194 getBuildRecAsi:1204 getBuildRecSubclass:1211 parseAsiFromHeadline:1219 _buildFeatNameMap:1233 parseFeatFromHeadline:1275 parseSpellsFromHeadline:1292 getBuildRecSpellObjs:1538 openBuildPlan:1558 _cpSubclassOf:1611 _cpClassSwitch:1622 openClassPlan:1637

**app-io.js** (452 строк, 19 функций)  
_buildExportPayload:9 exportData:23 _isValidImportedChar:36 _importNum:46 _sanitizeImportedChar:47 _sanitizeHpEntry:75 _normalizeImportedSpell:84 _isValidImportedSpell:95 _collectCharUserSpells:99 _ingestImportedUserSpells:117 _extractCharsFromImport:162 _applyFullRestore:170 _warnEditionMix:202 run:203 importData:218 importOneCharacter:269 exportSpells:357 importSpells:366 exportSessionLog:439

**app-combat.js** (2148 строк, 90 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:237 toggleAbilOpen:264 openAbilityInfo:275 toggleExpertise:302 loadExpertise:321 updateSkillProfCount:335 updateClassFeatures:345 calculateAC:360 toggleInspiration:421 updateStatusBar:432 updateInspirationLabels:483 updateStatDisplay:500 updateAllStatDisplays:505 adjustStat:509 adjustCoin:532 updateCoinTotal:542 openCoinExchange:553 closeCoinExchange:558 previewExchange:562 coinExchangeCalc:590 confirmExchange:595 updateSubclassOptions:618 updateSubclassRecHint:672 featHpPerLevel:687 featHpFlat:696 recalculateHP:705 updateChar:752 toggleProficiency:817 calcStats:840 setSpellStat:911 calcSpellStats:922 onRaceChange:973 populateRaceSelect:1098 _speciesEffective:1122 _renderSpeciesBar:1135 _speciesChoiceOptions:1149 toggleSpeciesChoice:1156 syncSpeciesSpells:1170 rollRandomName:1215 pick:1223 build:1224 renderRaceExtras:1250 toggleHalfElfStat:1327 openRaceFeatModal:1351 removeRaceFeat:1369 applyBasicLockUI:1395 updateLockButtonState:1418 lockBasicInfo:1449 unlockBasicInfo:1464 isSheetLocked:1491 sheetLockGuard:1497 applySheetLockUI:1503 lockSheet:1530 unlockSheet:1540 onBackgroundChange:1561 _bgCheckSkills:1601 renderBackgroundFeature:1613 _bgStatShort:1652 populateBackgroundSelect:1655 _bgRevertStatChoice:1677 _bgAppliedStat:1690 _bgApplyStat:1695 setBgStatMode:1707 toggleBgStat:1719 _bgAfterStats:1742 _bgRevertFeatEffects:1752 syncOriginFeat:1772 toggleBgCustom:1801 giveBackgroundEquipment:1838 renderBackgroundExtras:1880 onArmorChange:1958 onManualAC:1987 onManualMaxHP:1994 calcCoinWeight:2017 getActiveConditionsForRender:2031 toggleConditionsPopup:2060 closeConditionsPopup:2072 renderConditionsPopup:2078

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (348 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:232 _aefRowHtml:247 renderActiveEffectsFab:261 toggleActiveEffectsPanel:281 _aefBindOutside:300 advanceActiveEffects:320 removeActiveEffect:332

**app-proficiencies.js** (641 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:148 addCustomLanguage:164 removeCustomLanguage:191 getToolChoiceSlots:216 buildToolOptionsHtml:284 renderTools:305 addChoiceTool:377 addCustomTool:393 removeCustomTool:420 renderArmorProf:439 renderWeaponProf:489 addCustomArmorType:553 removeCustomArmorType:569 addCustomWeaponType:581 removeCustomWeaponType:596 addCustomSpecificWeapon:607 removeCustomSpecificWeapon:628

**app-hp.js** (1655 строк, 50 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:145 openLevelUpModal:229 _showMulticlassScreen:251 openMulticlassNewClass:294 confirmMulticlassNewClass:344 _showLevelUpPreview:355 closeLevelUpModal:522 confirmLevelUp:535 _luShowResult:660 luFinishChoices:684 luRefreshChoices:691 luSetSubclass:698 luApplyFeatById:717 luApplyAsi:760 _luFeatChoiceAt:781 _ccDefsFor:789 _luAsiDone:800 luApplyAllRecommendations:805 luBuildChoicesScreen:925 recBadge:933 luAddRecommendedSpells:1052 luGoToSpellsTab:1080 openLevelDownConfirm:1092 confirmLevelDown:1137 loadDeathSaves:1170 toggleDeathSave:1214 resetDeathSaves:1231 updateHPDisplay:1244 hpToggleRow:1325 hpSetRowOpen:1334 updateHPSummary:1342 updateHPRows:1406 quickHP:1424 addHPHistory:1518 showHPToast:1529 applyCustomHP:1553 saveTempHP:1570 rollHitDieQuick:1584 renderHitDiceIcons:1612 rollDeathSave:1626

**app-inventory.js** (1651 строк, 76 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:289 countAttuned:324 _hasAttunable:334 toggleAttuned:341 updateAttuneCount:361 adjustItemCharges:372 openItemModal:388 closeItemModal:445 submitItem:449 openMagicCatalog:513 closeMagicCatalog:530 renderMagicCatalog:535 fillFromMagicItem:567 openGearCatalog:617 closeGearCatalog:633 renderGearPacks:638 renderGearCatalog:648 fillFromGearItem:676 addPackToInventory:698 rollTrinket:720 _weaponPresets2024:756 _weaponMasteryGrant:777 getWeaponMasteryLimit:802 canMasterWeapon:807 getWeaponMasteryProp:816 isWeaponMastered:823 toggleWeaponMastery:826 _weaponCatalog:845 renderWeaponPresets:859 filterWeaponPresets:922 toggleWeaponFilter:926 fillWeaponPreset:933 _resetWeaponForm:951 openWeaponModal:970 closeWeaponModal:980 editWeapon:988 deleteCustomWeapon:1018 _weaponPresetByName:1044 checkWeaponProficiency:1051 submitWeapon:1079 renderWeapons:1169 isLightWeapon:1248 toggleTWFStyle:1253 rollTWFAttack:1261 _weaponDamageRoll:1309 rollTWFDamage:1330 rollWeaponAttack:1342 rollWeaponDamage:1389 removeWeapon:1417 _invDndInit:1451 _invClearIndicators:1480 _invSetIndicator:1489 _invCleanup:1494 _invCancelDrag:1501 _invMoveItem:1509 _invCommitDrop:1526 invDragStart:1547 invDragOver:1557 invDragLeave:1574 invDrop:1578 invDragEnd:1584 invTouchStart:1591 invTouchMove:1607 invTouchEnd:1639

**app-spells.js** (1802 строк, 87 функций)  
toggleSpellStatRow:9 renderSpellSlots:14 togglePactSlot:83 adjustPactSlots:94 syncSpellSlotsFromClass:109 updateSpellSlots:118 toggleSpellSlot:129 adjustSpellSlots:140 restoreAllSlots:158 setSpellVersion:169 setSpellClass:177 _charSpellClassKey:186 _charMaxCastableLevel:197 _defaultSpellVersion:205 openSpellSearch:208 markCharOwnClassFilter:225 closeSpellSearch:255 _parseSpellClassList:275 _syncNewSpellClassChips:279 toggleNewSpellClass:286 _fillNewSpellDamageTypes:311 _toggleHidden:318 updateNewSpellMechFields:326 _hbFormulaCheck:341 _collectHbEffect:350 _spellIdArg:388 _findHomebrewSpell:394 openAddSpellForm:402 _syncCustomSpellAcrossChars:481 _purgeCustomSpellFromChars:499 deleteCustomSpell:518 _deleteCustomSpellConfirmed:527 closeAddSpellForm:541 submitNewSpell:545 renderSpellSearch:635 addSpell:699 removeSpell:715 toggleSpellCard:728 renderMySpells:733 _spellActiveBadgeText:871 _spellActiveBadgeHtml:875 updateSpellActiveBadges:878 _prepEntries:901 _spellPrepEntry:916 _prepLimit:921 calcMaxPrepared:937 _known2014:944 calcMaxKnownSpells:958 _knownSpellCount:964 calcMaxCantrips:974 isPrepClass:983 _subclassSpellNames:989 spellNeedsPrep:1011 _preparedCount:1027 isSpellPrepared:1034 toggleSpellPrepared:1044 renderPrepCounter:1070 _castableSlotOptions:1116 _arcanumResId:1134 castSpell:1144 _castSpellWithSlot:1165 _finishCast:1195 applyCastEffects:1239 openCastVariantChooser:1280 pickCastVariant:1319 closeCastVariantChooser:1329 _applyCastSummon:1342 _nextCastInstanceId:1376 _replaceCastInstance:1384 _ensureCastInstance:1414 _applyCastDamage:1434 _rollCastDamage:1450 _startCastRepeat:1515 castRepeatDamage:1529 _applyCastDebuff:1554 castSpellAttackMod:1595 castStatMod:1603 _applyCastHeal:1621 _castHealApply:1642 _applyCastTempHp:1648 applyCastTempHp:1665 _applyCastHpMaxBonus:1679 openCastChooser:1699 closeCastChooser:1720 canCastAsRitual:1733 castRitual:1755 cancelRitual:1791

**app-party.js** (1740 строк, 129 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:78 getStatusColor:84 openPartyTab:90 renderMyChar:98 renderAllies:132 _pentLabel:162 _pentOpen:202 _pentClose:211 _pentSave:212 _pentDelete:237 _pentStatus:246 _pentExport:251 _isValidPentry:258 _pentImport:261 openAddAllyModal:299 openEditAllyModal:300 closeAddAllyModal:301 saveAlly:302 deleteAlly:303 setAllyStatus:304 exportAllies:305 importAllies:306 openAddNPCModal:308 openEditNPCModal:309 closeAddNPCModal:310 saveNPC:311 deleteNPC:312 setNPCStatus:313 exportNPCs:314 importNPCs:315 openAddMonsterModal:317 openEditMonsterModal:318 closeAddMonsterModal:319 saveMonster:320 deleteMonster:321 setMonsterStatus:322 exportMonsters:323 importMonsters:324 _npcAttColor:329 renderNPCs:335 renderMonsters:376 _openSrdMonsterPickerLazy:430 openSrdMonsterPicker:440 openSrdMonsterPickerForBattle:442 _openSrdMonsterPickerCore:447 closeSrdMonsterPicker:483 setSrdMonsterSearch:485 setSrdMonsterCr:486 setSrdMonsterEdition:487 renderSrdMonsterPicker:489 addMonsterFromSRD:532 openSrdNpcPicker:573 _openSrdNpcPickerCore:582 closeSrdNpcPicker:603 setSrdNpcSearch:605 setSrdNpcAtt:606 renderSrdNpcPicker:608 addNpcFromSRD:640 openBattleTab:670 buildBattleSetupList:683 setBattleSearch:703 toggleBattleSection:704 renderBattleSetup:709 toggleBattleCheck:753 battleDragStart:758 battleDragOver:759 battleDrop:760 battleDragEnd:768 rollInitiativeValue:773 sortParticipantsByInitiative:778 _findPartyMonster:784 _participantCombatMeta:794 _makeBattleParticipant:818 _battleParticipantHP:831 _addSrdMonsterToBattle:840 startBattle:870 getParticipantDesc:883 showTrackerInfo:906 getSelfStatusFromHP:943 syncSelfBattleStatus:959 renderBattleTracker:969 renderBattleCastPanels:1061 _battleCondDots:1102 adjustBattleHP:1117 setBattleHP:1130 setBattleHPMax:1151 setBattleInitiative:1162 rerollInitiative:1174 battleRollD20:1186 removeBattleParticipant:1191 setBattleStatus:1207 _battleStatusFromHp:1215 offerCastDamageToBattle:1231 _castDamageTargets:1248 _castDamageAmount:1254 _renderCastDamageModal:1260 setCastDamageHalf:1323 toggleCastDamageTarget:1331 _castDamageHit:1341 applyCastDamageToTarget:1354 applyCastDamageTargets:1364 closeCastDamageModal:1374 _castHealTargets:1383 offerCastHealToBattle:1389 _renderCastHealModal:1397 toggleCastHealTarget:1442 applyCastHealTargets:1449 closeCastHealModal:1471 _castDebuffTargets:1492 offerCastDebuffToBattle:1498 _renderCastDebuffModal:1514 toggleCastDebuffTarget:1570 pickCastDebuffTarget:1580 applyCastDebuffTargets:1589 closeCastDebuffModal:1617 _battleDebuffChips:1626 removeBattleDebuff:1643 removeBattleDebuffsForSpell:1656 clearAllBattleDebuffs:1671 _logTurn:1676 nextTurn:1681 prevTurn:1691 tickCastEffectsRound:1702 endBattle:1730

**app-notes.js** (1368 строк, 65 функций)  
renderNotes:43 _renderNotesSubtabs:61 notesSwitchTab:83 _renderNotesMain:95 _findTab:113 _getSectionVariants:125 _renderSectionsView:138 _renderVariantsPanel:193 _renderMdToolbar:216 notesToggleSection:248 notesToggleVariants:264 notesPickVariant:276 notesRegenerateAll:287 notesPickRandomVariant:317 _applyVariantToSection:330 _mdToHtml:350 closeLists:362 _countStats:402 _bindSectionInputs:409 _updateStats:422 _notesHotkeys:431 notesMdInsert:446 wrap:455 linePrefix:462 notesTogglePreview:512 notesUpdateSection:531 _syncTakenFeatsLocation:546 _renderEntriesView:559 _renderEntryCard:618 notesPinDragStart:665 notesPinDragOver:675 notesPinDragLeave:684 notesPinDrop:689 notesPinDragEnd:699 _notesReorderPinned:708 notesSetTagFilter:736 notesJumpToNpc:742 notesOpenEntryModal:770 notesCloseEntryModal:804 _notesRenderModalTags:809 notesAddModalTag:821 notesModalTagKeydown:831 notesRemoveModalTag:835 notesSaveEntryModal:841 notesDeleteEntry:889 notesTogglePin:904 _notesLogJournal:939 notesSearchInput:965 notesSearchKeydown:972 _hlText:990 _renderSearchResults:1000 notesClearSearch:1081 notesToggleMenu:1092 _notesMenuClose:1105 notesMenuAction:1111 _notesCharName:1126 _notesTriggerDownload:1131 notesExportMd:1139 notesExportJson:1184 _notesSanitizeEntry:1196 _notesFileTooBig:1207 notesHandleImportJson:1215 notesHandleImportMd:1267 notesPrint:1303 _notesFlashSaved:1334

**app-ui.js** (1169 строк, 66 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:283 showUpdateModal:294 checkWhatsNew:325 showWhatsNewModal:337 toggleAccordion:373 initCharResources:393 getResourceMax:402 getCharResourceDefs:420 currentDieSize:450 crRow:462 crRestoreLabel:475 crResourceRow:490 crSlotRecoveryBudget:544 crSlotRecoveryActs:548 recoverSlotByResource:563 crRowsHtml:589 crSetRows:625 renderClassResources:640 spendResource:658 resetResource:676 toggleResourcePip:686 resetResourcesByRest:711 getJournal:748 addJournalEntry:753 filterJournal:775 renderJournal:782 deleteJournalEntry:819 openAddJournalEntry:828 closeAddJournalEntry:832 saveJournalEntry:835 getCompanions:855 renderCompanions:860 companionHP:905 buildFamiliarFormOptions:918 onCompanionTypeChange:930 applyFamiliarForm:938 openAddCompanionModal:950 summonFamiliar:966 openPrefilledCompanionModal:976 openEditCompanionModal:987 closeAddCompanionModal:1006 saveCompanion:1009 deleteCompanion:1034 switchProfilesTab:1050 clipChangelogText:1065 expandChangelogItem:1076 renderChangelog:1082 openItemRef:1127 closeItemRef:1132 switchItemRef:1137 _syncHeaderHeight:1155

**app-dice.js** (1390 строк, 62 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:216 rollDice:220 _quickRollCompute:315 _quickRollModStr:334 _emitDiceRolled:340 _setDiceSettled:348 _setSettledDice:358 _quickRollRecord:375 _quickRollInfoText:382 _quickRollToastText:389 quickRoll:405 renderQuickRollStrip:463 updateQuickRollStripVisibility:485 dismissQuickRollStrip:500 openDiceRollHistory:505 drawDiceSVG:518 _waitDiceBoxModule:537 _diceLsGet:556 _getAccentColor:564 _getDiceTheme:583 _getDiceThemeColor:590 setDiceTheme:593 _syncDiceThemeButtons:599 _getDiceBg:609 setDiceBg:616 _syncDiceBgButtons:622 _diceDbg:632 _initDiceBox:637 animateDice3d:743 animateDice2d:934 buildDie:960 tick:1028 _applyDiceCritGlow:1051 parseDiceFormula:1072 _formulaCanon:1108 _renderFormulaResult:1120 rollFormula:1156 _rollFormulaFrom:1222 rollCustomFormula:1235 renderDiceHistory:1238 createParticles:1260 _diceShapeSvg:1296 renderDiceFan:1303 _paintSelectedDie:1323 selectDie:1344 rollSelectedDie:1363 toggleDiceFormulaPanel:1372

**app-settings.js** (622 строк, 59 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:171 _getStatsLayout:188 _applyStatsLayout:195 _statsInCards:202 _statsRowTarget:206 _placeStatRows:224 setStatsLayout:240 _syncStatsLayoutButtons:247 _getSheetLock:260 setSheetLock:264 _syncSheetLockButtons:269 _getStatsCollapsed:278 _applyStatsCollapsed:281 toggleStatsCollapsed:286 _getStoredDensity:300 _getDefaultDensity:308 _getDensity:315 _applyDensity:318 setDensity:322 _syncDensityButtons:328 _onViewportDensityChange:336 _getFontScale:354 _applyFontScale:361 setFontScale:372 _syncFontScaleUi:383 _getGlassAlpha:398 _getGlassBlur:405 _applyGlassAlpha:412 _applyGlassBlur:413 setGlassAlpha:414 setGlassBlur:424 _syncGlassUi:433 _getSpaceMode:482 _applySpaceBg:489 setSpaceMode:504 _syncSpaceButtons:510 _spaceOnScroll:529 _applyDymkaIcons:557 _initAppLinks:570 openSettingsModal:599 closeSettingsModal:609

**app-asi.js** (552 строк, 21 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:78 buildASIStatGrid:90 getASIMode:111 toggleASIStat:116 updateASIPreview:138 getFeatDef:218 _featPickerList:236 buildFeatList:248 filterFeatList:279 _asiFeatBlocked:288 _featStatPickHtml:295 _asiFeatReady:308 selectFeatStat:312 selectFeat:319 _asiUnlockSheet:340 applyASI:348 renderTakenFeats:493 removeFeat:534

**app-progress.js** (679 строк, 38 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:164 _pgAttention:205 _pgGrownLast:243 _pgClassRow:256 _pgClasses:298 _pgNext:314 _pgAvailableClasses:369 _pgActions:382 _pgBuild:399 openProgressTab:412 openProgress:422 pgTabActive:433 pgRefresh:440 pgSetSubclass:448 pgFocusSubclass:462 pgLevelUp:479 pgLevelDown:484 pgAfterLevelModal:490 pgAddClass:501 renderClassDev:512 _pgSheetAboutRow:531 _pgSubclassRows:549 syncClassFieldUI:575 openFeatureInfo:607 _fiRuleNotes:650

**app-desktop.js** (398 строк, 11 функций)  
syncFromStatusBar:103 _esc:158 _stripEmoji:164 _condIcon:168 setRowExpanded:174 collapseRow:180 renderRrConditions:182 renderRailSlots:228 updateRailHpRow:272 rrApplyHP:287 init:300

**app-help.js** (1142 строк, 52 функций)  
openHelp:12 closeHelp:19 switchHelpSection:29 getHelpFlag:82 setHelpFlag:86 welcomeGoStep:92 showWelcome:102 closeWelcome:109 welcomeContinue:115 welcomeSkipExperienced:121 welcomeBack:127 welcomeFinish:134 dismissWelcome:167 maybeShowWelcome:170 restartOnboarding:175 _tourWide:211 _ensureTourDom:214 _resolveTarget:255 _tourFirstVisible:270 _tourAnyModalVisible:290 _tourModalOpen:296 _tourStartWhenClear:308 startTour:320 startListTour:333 startSheetTour:337 maybeStartSheetTour:343 restartTour:361 startTabTour:386 maybeStartTabTour:404 tourNext:426 tourPrev:431 endTour:437 _showTourStep:447 _setBox:510 _computeTourBoxes:526 snap:528 corner:541 _layoutTourCorners:563 _layoutTour:580 _onTourKey:683 _onTourReflow:689 _bindTourGlobal:693 _unbindTourGlobal:698 _buildListSteps:709 _buildSheetSteps:759 _buildProgressSteps:851 _buildSpellsSteps:909 _buildInventorySteps:946 _buildBattleSteps:986 _buildNotesSteps:1018 _buildPartySteps:1053 _buildJournalSteps:1111

**app-backup.js** (209 строк, 10 функций)  
_backupLog:24 _backupOpenDb:28 listBackupSnapshots:44 createBackupSnapshot:63 initAutoBackup:105 restoreBackupSnapshot:121 createBackupNow:146 _backupFmtDate:159 toggleBackupPanel:165 renderBackupList:173

**app-pdf.js** (739 строк, 21 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:75 _pdfDecoBorder:91 _pdfSafeName:125 _pdfFormatMod:129 _pdfRule:132 _pdfSection:140 _pdfNeed:151 _pdfMultiline:161 _pdfFooter:179 _pdfStatsAndCombat:278 _pdfSaves:372 _pdfSkills:399 _pdfOrigin2024:429 _pdfAttacks:459 _pdfSpells:496 _pdfInventory:594 _pdfNotes:649

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (5976 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:116 SAVES_DATA:138 CONDITIONS:147 EFFECTS_DATA:170 CLASS_FEATURES:221 SPELL_PREP_CLASSES:471 CANTRIPS_KNOWN_2014:479 SPELLS_KNOWN_2014:487 SPELL_SLOTS_BY_LEVEL:494 CLASS_HIT_DICE:569 SUBCLASSES:575 SOURCE_LABELS:594 SUBCLASS_SOURCE:603 SUBCLASS_LEVEL:673 SUBCLASS_FEATURES:689 WEAPON_PRESETS:1409 ITEM_ICONS:1453 CATEGORY_NAMES:1454 GEAR_PACKS:1463 RACE_DATA:1558 BACKGROUND_SKILLS:1694 BACKGROUND_ALIASES:1731 DEITY_ALIGN_LABELS:1744 DEITIES_DATA:1749 LANGUAGE_CATALOG:1817 RACE_LANGUAGES:1846 CLASS_LANGUAGES:1873 TOOL_CATALOG:1879 RACE_TOOLS:1934 CLASS_TOOLS:1941 SUBCLASS_LANGUAGES:1949 SUBCLASS_TOOLS:1962 RACE_ARMOR:1984 RACE_WEAPONS_SPECIFIC:1988 CLASS_WEAPONS_SPECIFIC:2001 RACE_NAME_POOLS:2014 RACE_NAME_GROUP:2056 SUBCLASS_ARMOR:2070 ARMOR_PRESETS:2101 skills:2118 ABILITY_INFO:2131 CLASS_SKILL_OPTIONS:2171 CLASS_ARMOR_PROFS:2187 CLASS_RESOURCES:2207 ASI_LEVELS:2369 XP_THRESHOLDS:2377 APP_VERSION:2387 APP_VERSION_DATE:2388 APP_TELEGRAM_URL:2394 APP_DONATE_URL:2395 APP_BOOSTY_URL:2396 FEATS_DATA:2417 APP_CHANGELOG:2736 CASTER_TYPE:5804 THIRD_CASTER_SUBCLASSES:5813 THIRD_CASTER_SLOTS:5820 MULTICLASS_SPELL_SLOTS:5831 MULTICLASS_PREREQUISITES:5856 MULTICLASS_PROFICIENCIES:5874 EDITION_DATA:5903

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (869 строк)  
SPELL_EFFECTS:71

**class-choices.js** (694 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (800 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 SUBCLASS_CHOICES:144 SUBCLASS_RESOURCES:333

