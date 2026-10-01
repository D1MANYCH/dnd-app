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
| index.html — блоки верхнего уровня (`#id:строки`) | 133–172 |
| Функции по файлам (`имя:строка`) | 173–246 |
| Данные — константы верхнего уровня (`имя:строка`) | 247–263 |


## style.css — секции

| Строки | Секция |
|---|---|
| 1–5 | style.css — Стили D&D 5e Character Sheet |
| 6–137 | Design tokens (R1) |
| 138–175 | Алиасы старых переменных (совместимость) |
| 176–195 | THEME-4: компонентные токены базового хрома |
| 196–211 | THEME-5: компонентные токены фичевых зон (партия B) |
| 212–236 | MENU-1: главный экран — плашка героя, меню приключения, слот под арт |
| 237–281 | UI-4. Плотность интерфейса (compact / standard / cozy) |
| 282–465 | UI-1. Светлая тема v3 — адаптив + атмосферный фон |
| 466–563 | UI-2. Пресеты акцента (8 цветов) |
| 564–580 | Body — атмосферный cream-фон + warm radial + SVG-noise |
| 581–588 | UI4-glass: декоративные «лозы» светлой темы убраны |
| 589–597 | Заголовки |
| 598–1010 | Override'ы для блоков с захардкоженным rgba(255,255,255,*) |
| 1011–1339 | STYLE-8M-2: СТРАНИЦА-ЭКРАН. |
| 1340–1345 | R2. Базовые компоненты |
| 1346–1504 | UI-2. Кнопки v3 + анимации (общая секция, обе темы) |
| 1505–1777 | UI-3. Desktop/tablet layout (≥1024px) |
| 1778–1880 | UI5-4: ПК — многоколоночная раскладка листа |
| 1881–1956 | /R2 |
| 1957–2130 | ЗАКРЕПЛЁННАЯ ПАНЕЛЬ СТАТУСА (R5: компактная одна строка) |
| 2131–2292 | HEADER (R5: back + name + hamburger) |
| 2293–2358 | КД АВТО-РАСЧЁТ |
| 2359–2428 | ФИЛЬТР-БАР (состояния и эффекты) |
| 2429–2494 | ВРЕМЕННЫЕ ЭФФЕКТЫ |
| 2495–2654 | УСЛОВИЯ |
| 2655–2801 | СПАСБРОСКИ |
| 2802–2953 | CLASS FEATURES |
| 2954–2993 | УБИРАЕМ СТРЕЛКИ |
| 2994–3098 | TAB NAV — 5 tabs + centered FAB dice |
| 3099–3221 | UX-5: лента последних бросков вне модалки |
| 3222–3398 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3399–3418 | HAMBURGER BUTTON |
| 3419–3460 | SIDE DRAWER |
| 3461–3960 | STYLE-8L: сайдбар в языке встречающего экрана |
| 3961–4008 | MENU-8/9: встречающий экран во всё окно. |
| 4009–4101 | MENU-2: плашка последнего героя. |
| 4102–4276 | MENU-3: меню приключения. |
| 4277–4347 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4348–4348 | INVENTORY |
| 4349–4379 | INVENTORY — WEIGHT BAR |
| 4380–4416 | INVENTORY — BACKPACK HEADER |
| 4417–4457 | INVENTORY — FILTERS |
| 4458–4646 | INVENTORY — ITEM CARDS |
| 4647–5012 | COINS — BIG NUMBER CARD GRID |
| 5013–5313 | MODALS |
| 5314–5348 | DICE |
| 5349–5929 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 5930–6816 | OTHER STYLES |
| 6817–6885 | HP DISPLAY BLOCK |
| 6886–6911 | MOBILE OPTIMIZATION |
| 6912–7040 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7041–7079 | HP TOAST (snackbar) |
| 7080–7131 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7132–7185 | Confirm Modal |
| 7186–7610 | ⚔️ ОТРЯД & БОЙ |
| 7611–7884 | RACIAL BONUS BAR |
| 7885–8027 | COMPACT STATS GRID |
| 8028–8295 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8296–8348 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8349–8399 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8400–8499 | COMPACT SKILLS |
| 8500–8542 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8543–8614 | ACCORDION |
| 8615–8638 | CLASS RESOURCES |
| 8639–8731 | ASI MODAL |
| 8732–8984 | APP VERSION |
| 8985–8994 | COMPANIONS |
| 8995–9040 | FEATS LIST IN ASI |
| 9041–9286 | PROFILES TABS (Чейнджлог) |
| 9287–9365 | TAKEN FEATS |
| 9366–9562 | SW UPDATE MODAL |
| 9563–9610 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9611–9783 | INVENTORY SLOTS SYSTEM |
| 9784–9983 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 9984–10255 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10256–10428 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10429–10498 | 3D DICE CUBE |
| 10499–10871 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10872–10941 | DESKTOP LAYOUT — centered max-width |
| 10942–10962 | INSPIRATION |
| 10963–11002 | CONCENTRATION |
| 11003–11679 | WEAPON CARDS WITH ROLL BUTTONS |
| 11680–11790 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11791–11853 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11854–11880 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11881–12004 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12005–12031 | R6: Ассеты (декор) |
| 12032–13003 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13004–13091 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13092–13100 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13101–13170 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13171–13496 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13497–13523 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13524–13571 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13572–13654 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13655–14752 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14753–14808 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14809–14901 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 14902–15205 | DISC-1 · Ромб раскрытия |
| 15206–15709 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15710–15804 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 15805–15940 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 15941–16175 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16176–16185 | STYLE-8b3-fix: срезанный ромб |
| 16186–16452 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16453–16971 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 16972–17006 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17007–17297 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

## index.html — блоки верхнего уровня (`#id:строки`)

#bgGlass:89-90 #conditions-popup-overlay:91-91 #conditions-popup:92-96 #conditions-popup-list:97-100 #drawer-overlay:101-102 #side-drawer:103-136 #screen-settings:137-224 #edition-row:225-248  
#wake-lock-row:249-269 #install-row:270-280 #welcome-modal:281-285 #welcome-step-1:286-304 #welcome-step-2:305-339 #header-avatar:340-347 #status-bar:348-351 #status-inspiration:352-352  
#status-concentration:353-355 #status-ritual:356-358 #status-conditions-btn:359-369 #screen-home:370-372 #home-art:373-400 #home-sub-new:401-440 #home-install:441-448 #home-hero:449-449  
#home-hero-emblem:450-453 #home-hero-sub:454-454 #home-hero-chips:455-465 #screen-characters:466-505 #char-hero:506-506 #char-hero-emblem:507-510 #char-hero-sub:511-511 #char-hero-chips:512-512  
#char-hero-actions:513-521 #screen-data:522-537 #storage-status:538-538 #backup-panel:539-543 #backup-list:544-555 #screen-about:556-559 #app-version-row:560-567 #ptab-info:568-575  
#app-links-row:576-581 #ptab-changelog:582-586 #changelog-list:587-593 #screen-character:594-594 #tab-sheet:595-597 #creation-wizard-banner:598-608 #cw-validation:609-611 #basic-locked-bar:612-628  
#sheet-avatar:629-641 #char-build-badge-wrap:642-656 #char-class-mc:657-680 #char-subclass-rec:681-681 #char-subclass-mc:682-783 #char-books:784-787 #race-bonus-display:788-788 #race-extras-panel:789-790  
#background-feature-display:791-792 #bg-extras-panel:793-836 #abilgen-row:837-843 #stats-collapse-btn:844-851 #abilities-region:852-855 #proficiency-bonus-2024:856-857 #insp-card-2024:858-867 #abil-col-1:868-868  
#stat-block-str:869-870 #mod-str:871-877 #abil-save-slot-str:878-878 #abil-skills-slot-str:879-881 #stat-block-dex:882-883 #mod-dex:884-890 #abil-save-slot-dex:891-891 #abil-skills-slot-dex:892-894  
#stat-block-int:895-896 #mod-int:897-903 #abil-save-slot-int:904-904 #abil-skills-slot-int:905-908 #abil-col-2:909-909 #stat-block-con:910-911 #mod-con:912-918 #abil-save-slot-con:919-919  
#abil-skills-slot-con:920-922 #stat-block-wis:923-924 #mod-wis:925-931 #abil-save-slot-wis:932-932 #abil-skills-slot-wis:933-935 #stat-block-cha:936-937 #mod-cha:938-944 #abil-save-slot-cha:945-945  
#abil-skills-slot-cha:946-959 #saves-grid:960-969 #skills-container:970-972 #passive-perception:973-996 #hp-dmg-row:997-1006 #hp-dmg-body:1007-1027 #death-saves-section:1028-1059 #hp-armor-body:1060-1101  
#hp-hd-body:1102-1115 #hp-rest-body:1116-1143 #class-dev-section:1144-1146 #cd-head:1147-1147 #cd-res:1148-1148 #cd-attn:1149-1150 #cd-about:1151-1159 #ac-formula:1160-1161  
#ac-modifiers:1162-1169 #conditions-grid:1170-1177 #effects-grid:1178-1185 #resistances-container:1186-1198 #armor-prof-container:1199-1202 #weapon-prof-container:1203-1206 #tools-container:1207-1210 #languages-container:1211-1218  
#companions-list-sheet:1219-1231 #tab-progress:1232-1233 #pg-body:1234-1235 #tab-spells:1236-1259 #spell-mod-display:1260-1265 #spell-dc-display:1266-1271 #spell-attack-display:1272-1277 #spell-stats-by-class:1278-1295  
#spell-slots-visual:1296-1301 #concentration-block:1302-1318 #prep-counter:1319-1319 #my-spells-list:1320-1322 #tab-inventory:1323-1342 #weight-fill:1343-1377 #inventory-list:1378-1387 #inv-pouches:1388-1442  
#tab-notes:1443-1469 #notes-subtabs:1470-1471 #notes-main:1472-1473 #taken-feats-section:1474-1478 #taken-feats-list:1479-1482 #tab-party:1483-1491 #my-char-card:1492-1506 #allies-list:1507-1522  
#npcs-list:1523-1538 #monsters-list:1539-1550 #companions-list-world:1551-1561 #tab-battle:1562-1567 #weapons-list:1568-1571 #battle-res-card:1572-1573 #battle-res-rows:1574-1575 #battle-setup-screen:1576-1584  
#battle-setup-list:1585-1585 #battle-difficulty:1586-1589 #battle-tracker-screen:1590-1594 #battle-turn-info:1595-1600 #battle-repeat-strip:1601-1601 #battle-tracker-list:1602-1611 #tab-journal:1612-1626 #journal-list:1627-1633  
#screen-itemref:1634-1636 #item-ref-tabs:1637-1642 #item-ref-weight:1643-1681 #item-ref-slots:1682-1713 #screen-dmref:1714-1716 #dm-ref-tabs:1717-1721 #dm-ref-ed:1722-1722 #dm-ref-cond:1723-1723  
#dm-ref-combat:1724-1724 #dm-ref-world:1725-1729 #screen-help:1730-1752 #help-about:1753-1776 #help-start:1777-1801 #help-sheet:1802-1825 #help-progress:1826-1871 #help-spells:1872-1888  
#help-inventory:1889-1901 #help-battle:1902-1926 #help-party:1927-1943 #help-notes:1944-1952 #help-journal:1953-1961 #help-planes:1962-1989 #help-dice:1990-2001 #help-edition2024:2002-2041  
#help-data:2042-2054 #help-marks:2055-2077 #conc-details-modal:2078-2088 #conc-detail-duration-row:2089-2096 #conc-detail-desc-row:2097-2106 #add-journal-modal:2107-2130 #add-npc-modal:2131-2160 #add-ally-modal:2161-2197  
#screen-monsters:2198-2210 #srd-monster-count:2211-2211 #srd-monster-results:2212-2216 #srd-npc-modal:2217-2226 #srd-npc-count:2227-2227 #srd-npc-results:2228-2235 #screen-monsterform:2236-2273 #monster-cr-note:2274-2276  
#monster-stats:2277-2278 #monster-saves:2279-2280 #monster-attacks:2281-2304 #screen-rest:2305-2307 #rest-main-screen:2308-2314 #rest-info-screen:2315-2319 #hit-dice-section:2320-2321 #hit-dice-controls-total:2322-2326  
#hit-dice-by-size:2327-2331 #rest-food-section:2332-2340 #rest-result-screen:2341-2343 #rest-result-details:2344-2352 #screen-levelup:2353-2357 #lu-screen-multiclass:2358-2359 #lu-mc-current-classes:2360-2362 #lu-mc-new-class:2363-2367  
#lu-mc-prereq-warn:2368-2368 #lu-mc-subclass-row:2369-2377 #lu-screen-preview:2378-2410 #lu-slots-card:2411-2412 #lu-slots-info:2413-2416 #lu-build-hint:2417-2417 #lu-features-container:2418-2425 #lu-screen-choices:2426-2427  
#lu-choices-body:2428-2434 #lu-screen-result:2435-2436 #lu-result-title:2437-2437 #lu-result-body:2438-2444 #screen-hphistory:2445-2447 #hp-history-list:2448-2453 #asi-modal:2454-2458 #asi-build-hint:2459-2473  
#asi-feat-list:2474-2474 #asi-stat-grid:2475-2475 #asi-preview:2476-2484 #class-choice-modal:2485-2500 #dice-modal:2501-2533 #dice-file-hint:2534-2534 #dice3d-result:2535-2546 #dice-result-display:2547-2560  
#dice-pick-hint:2561-2561 #dice-mode-segment:2562-2566 #dice-formula-panel:2567-2583 #dice-fan:2584-2592 #dice-popover-settings:2593-2640 #dice-popover-history:2641-2652 #dice-history:2653-2661 #screen-spellsearch:2662-2664  
#spell-feat-bar:2665-2681 #spell-class-filter:2682-2725 #class-filter-legend:2726-2727 #spell-search-count:2728-2728 #spell-search-results:2729-2732 #cast-spell-modal:2733-2737 #cast-spell-options:2738-2740 #add-spell-modal:2741-2784  
#new-spell-class-chips:2785-2830 #new-spell-mech-fields:2831-2835 #new-spell-mech-dmg-row:2836-2855 #new-spell-mech-half-row:2856-2858 #new-spell-mech-mod-row:2859-2869 #item-modal:2870-2914 #item-armor-fields:2915-2940 #coin-exchange-modal:2941-2979  
#exch-preview:2980-2986 #screen-magiccatalog:2987-3014 #magic-catalog-count:3015-3015 #magic-catalog-list:3016-3019 #screen-gearcatalog:3020-3024 #gear-packs-list:3025-3038 #gear-catalog-count:3039-3039 #gear-catalog-list:3040-3044  
#weapon-modal:3045-3048 #weapon-picker-section:3049-3051 #weapon-filter-chips:3052-3061 #weapon-presets-list:3062-3124 #character-tabs:3125-3136 #quick-roll-strip:3137-3142 #qrs-list:3143-3153 #active-effects-panel:3154-3158  
#aef-list:3159-3165 #hp-toast-container:3166-3168 #add-companion-modal:3169-3185 #companion-familiar-row:3186-3205 #confirm-modal:3206-3219 #avatar-modal:3220-3223 #avatar-modal-preview:3224-3251 #screen-builds:3252-3279  
#bp-list:3280-3284 #screen-buildguide:3285-3287 #bg-body:3288-3292 #screen-buildplan:3293-3295 #bp-plan-body:3296-3300 #screen-abilityinfo:3301-3303 #ai-body:3304-3308 #screen-abilgen:3309-3311  
#ag-body:3312-3316 #screen-mclayout:3317-3319 #ml-body:3320-3324 #screen-featureinfo:3325-3327 #fi-body:3328-3332 #app-log-panel:3333-3352 #app-log-list:3353-3512 #notes-entry-modal:3513-3561  

## Функции по файлам (`имя:строка`)

**rules.js** (1597 строк, 106 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHitDicePool:57 _hdSizesDesc:65 rulesHitDiceSpentBy:71 rulesHitDiceLabel:95 rulesPickHitDice:103 rulesClampHitDice:115 rulesRitualMinutes:127 rulesHitDieHeal:134 rulesSpendHitDice:140 charClassLevel:164 charHasClass:174 charClassLevelOr:184 charAsiSlots:193 charEpicSlots:208 charSubclassPending:226 charXpNext:239 rulesJackOfAllTrades:250 charClassSubclass:255 rulesHasFeat:264 rulesHasFightingStyle:269 rulesHasDraconicResilience:281 rulesHasDazzlingFootwork:286 rulesRemarkableAthlete:291 rulesUntrainedCheckBonus:297 rulesHasExpertise:304 getInitiativeMod:310 rulesSaveBonus:324 rulesSkillBonus:330 rulesPassivePerception:345 rulesSpellStats:349 _spellStatMod:369 rulesSpellStatsByClass:377 rulesWeaponMods:395 rulesOffhandDamageMod:411 armorPenalties:420 rulesItemArmor:433 rulesArmorItem:445 rulesAC:456 charCasterLevel:594 classSpellSlotRow:635 getMulticlassSpellSlots:648 rulesRestoreLevelFields:684 rulesApplySpellSlots:703 resolvePactSlots:726 restoreItemCharges:736 rulesHitDieSides:753 rulesShortRest:759 rulesLongRestBlockReason:794 rulesLongRest:807 rulesExhaustionLevel:873 rulesEffectiveHpMax:879 _dsReset:884 _dsCount:885 _dsFill:886 _condAdd:887 _condRemove:888 rulesIsDead:890 rulesIsStable:894 rulesRegainFromZero:899 rulesDamageAfterDefenses:905 rulesApplyDamage:917 rulesDeathSaveBlockReason:954 rulesDeathSave:961 rulesConditionRollMods:980 rulesEffectiveSpeed:997 rulesArmorStealthDisadv:1018 rulesFeatPrereqMissing:1027 rulesFeatStatChoice:1054 rulesFeatStatOptions:1062 rulesFeatSlotCount:1075 rulesFeatSpellFits:1080 rulesFeatSpellCandidates:1091 rulesFeatSpellLabel:1095 rulesFeatSpellProgress:1100 rulesFeatClassOptions:1125 rulesFeatFreeResId:1138 rulesResetFeatFree:1141 concSaveParams:1152 rulesCrToXp:1188 rulesCrToProf:1194 rulesEncounterMultiplier:1201 rulesEncounterDifficulty:1210 getCharClassPairs:1234 charEditionMismatch:1248 findLangInCatalog:1256 ensureLanguagesArray:1268 recalcLanguagesFromSources:1284 add:1289 findToolInCatalog:1334 ensureToolsArray:1346 getBackgroundDef:1367 validateBgStatChoice:1403 parseBackgroundToolEntry:1423 recalcToolsFromSources:1438 add:1443 ensureArmorWeaponFields:1508 recalcArmorWeaponFromSources:1521 addArmor:1527 addWeapon:1528 addSpec:1577

**app-core.js** (1581 строк, 75 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 saveToLocal:326 initPersistentStorage:348 _formatStorageBytes:369 updateStorageStatus:377 currentScreenName:438 screenBack:444 _modalVisible:458 _closeOpenModals:461 headerBack:471 _screenMotionOk:504 _screenGhostDrop:510 _screenGhostStart:522 _screenEnter:540 showScreen:549 updateHeaderTitle:651 syncDrawerHeader:705 switchTab:717 openDrawer:747 closeDrawer:760 showCharacterNav:772 hideCharacterNav:780 isInteractive:800 currentActiveTab:823 createNewCharacter:881 getClassColor:897 getClassIcon:912 getAbilityIcon:919 getConditionIcon:934 getConditionChipIcon:958 getSpellClassIcon:976 getSchoolSlug:993 getSchoolIcon:997 stripLeadingEmoji:1010 formatTimeAgo:1014 setCharSort:1028 setCharSearch:1035 duplicateCharacter:1039 exportOneCharacter:1051 updateCharCounter:1058 onDragStart:1075 onDragOver:1076 onDrop:1077 renderCharacterList:1088 renderCharPlate:1174 deleteCharacter:1233 showConfirmModal:1246 safeSet:1289 safeSetChecked:1293 loadCharacter:1301 showToast:1474 toastAddAction:1491 emptyStateHtml:1509 openHPHistory:1520 closeHPHistory:1548 updateVersionBlock:1553

**app-migrate.js** (970 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:962

**app-builds.js** (1716 строк, 44 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 unlinkBuild:164 _stemSet:185 _matchByStems:191 _weaponMatchNames:199 _findWeapon:202 _findArmorPreset:227 applyBuild:241 _applyBuildCore:264 _pick:888 _glossNorm:997 _reEscape:998 _glossEd:999 _glossBuild:1000 ingest:1002 _glossIndex:1024 glossarizeHtml:1032 _glossPopoverEl:1046 hideGlossPopover:1058 showGlossPopover:1063 _glossBindOnce:1082 openBuildGuide:1113 gx:1136 _list:1137 getBuildLevelRec:1200 getBuildRecChoiceOption:1205 getBuildRecChoiceIds:1213 getBuildRecFeat:1218 getBuildRecAsi:1228 getBuildRecSubclass:1235 parseAsiFromHeadline:1243 _buildFeatNameMap:1257 parseFeatFromHeadline:1299 parseSpellsFromHeadline:1316 getBuildRecSpellObjs:1562 openBuildPlan:1582 _cpSubclassOf:1635 _cpClassSwitch:1646 openClassPlan:1661

**app-io.js** (624 строк, 34 функций)  
_buildExportPayload:9 exportData:23 _isValidImportedChar:36 _importNum:46 _sanitizeImportedChar:47 _sanitizeHpEntry:75 _normalizeImportedSpell:84 _isValidImportedSpell:95 _collectCharUserSpells:99 _ingestImportedUserSpells:117 _spellBaseById:163 _unpackSpell:171 _packSpell:181 _packCharForExport:192 _unpackCharSpells:199 _buildCharEnvelope:205 _charExportFileName:220 _downloadText:223 _shareableFile:230 shareOneCharacter:241 copyCharToClipboard:258 pasteCharFromClipboard:271 _extractCharsFromImport:289 _applyFullRestore:299 _warnEditionMix:331 run:332 importData:347 importOneCharacter:398 _importOneCharText:415 _consumeLaunchFiles:491 _importLaunchText:522 exportSpells:529 importSpells:538 exportSessionLog:611

**app-combat.js** (2549 строк, 103 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:237 toggleAbilOpen:264 openAbilityInfo:275 toggleExpertise:302 loadExpertise:321 updateSkillProfCount:335 updateClassFeatures:345 calculateAC:360 toggleInspiration:421 updateStatusBar:432 updateInspirationLabels:483 updateStatDisplay:500 updateAllStatDisplays:505 adjustStat:509 adjustCoin:532 updateCoinTotal:542 openCoinExchange:553 closeCoinExchange:558 previewExchange:562 coinExchangeCalc:590 confirmExchange:595 updateSubclassOptions:618 updateSubclassRecHint:675 featHpPerLevel:690 featHpFlat:699 recalculateHP:708 updateChar:755 toggleProficiency:821 calcStats:844 setSpellStat:915 calcSpellStats:926 onRaceChange:977 renderBooksRow:1105 toggleCharBook:1119 populateRaceSelect:1136 _speciesEffective:1168 _renderSpeciesBar:1181 _speciesChoiceOptions:1195 toggleSpeciesChoice:1202 syncSpeciesSpells:1216 rollRandomName:1261 pick:1269 build:1270 _setExtrasHtml:1298 renderRaceExtras:1307 toggleHalfElfStat:1432 _raceSkillSet:1459 raceLangGoto:1467 toggleRaceSkill:1475 openRaceFeatModal:1498 removeRaceFeat:1518 applyBasicLockUI:1553 updateLockButtonState:1580 lockBasicInfo:1617 unlockBasicInfo:1632 isSheetLocked:1659 sheetLockGuard:1665 applySheetLockUI:1671 lockSheet:1698 unlockSheet:1708 onBackgroundChange:1729 _bgCheckSkills:1772 renderBackgroundFeature:1784 _bgStatShort:1829 populateBackgroundSelect:1832 _bgRevertStatChoice:1863 _bgAppliedStat:1876 _bgApplyStat:1881 setBgStatMode:1893 toggleBgStat:1905 _bgAfterStats:1928 _bgRevertFeatEffects:1938 syncOriginFeat:1958 toggleBgCustom:1994 _toggleBgCustom14:2033 toggleBgSkillPick:2079 _renderBgCustom14:2103 giveBackgroundEquipment:2140 renderBackgroundExtras:2182 _armorFromSelect:2279 renderArmorSelect:2291 onArmorPick:2326 onShieldPick:2340 onArmorChange:2359 onManualAC:2388 onManualMaxHP:2395 calcCoinWeight:2418 getActiveConditionsForRender:2432 toggleConditionsPopup:2461 closeConditionsPopup:2473 renderConditionsPopup:2479

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (348 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:74 expireCastEffectsByUnits:95 setConcentration:113 openConcDetails:147 closeConcDetails:173 endConcentration:181 updateConcentrationDisplay:194 _aefRemainingLabel:232 _aefRowHtml:247 renderActiveEffectsFab:261 toggleActiveEffectsPanel:281 _aefBindOutside:300 advanceActiveEffects:320 removeActiveEffect:332

**app-proficiencies.js** (642 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:148 addCustomLanguage:165 removeCustomLanguage:192 getToolChoiceSlots:217 buildToolOptionsHtml:285 renderTools:306 addChoiceTool:378 addCustomTool:394 removeCustomTool:421 renderArmorProf:440 renderWeaponProf:490 addCustomArmorType:554 removeCustomArmorType:570 addCustomWeaponType:582 removeCustomWeaponType:597 addCustomSpecificWeapon:608 removeCustomSpecificWeapon:629

**app-hp.js** (1734 строк, 52 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:145 openLevelUpModal:229 _showMulticlassScreen:251 openMulticlassNewClass:295 confirmMulticlassNewClass:351 _showLevelUpPreview:362 closeLevelUpModal:529 confirmLevelUp:542 _luShowResult:667 luFinishChoices:691 luRefreshChoices:698 luSetSubclass:705 luApplyFeatById:724 luApplyAsi:769 _luFeatChoiceAt:790 _ccDefsFor:798 _luAsiDone:809 luApplyAllRecommendations:814 luBuildChoicesScreen:934 recBadge:942 luAddRecommendedSpells:1074 luGoToSpellsTab:1102 openLevelDownConfirm:1114 confirmLevelDown:1159 loadDeathSaves:1192 toggleDeathSave:1236 resetDeathSaves:1253 updateHPDisplay:1266 hpToggleRow:1347 hpSetRowOpen:1356 updateHPSummary:1364 updateHPRows:1428 quickHP:1446 addHPHistory:1546 _hpUndoPrepare:1563 undoHPChange:1579 showHPToast:1607 applyCustomHP:1632 saveTempHP:1649 rollHitDieQuick:1663 renderHitDiceIcons:1691 rollDeathSave:1705

**app-inventory.js** (1730 строк, 78 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:992 toggleWeaponFilter:996 fillWeaponPreset:1003 _resetWeaponForm:1021 openWeaponModal:1040 closeWeaponModal:1050 editWeapon:1058 deleteCustomWeapon:1088 _weaponPresetByName:1114 checkWeaponProficiency:1121 submitWeapon:1149 renderWeapons:1239 isLightWeapon:1318 toggleTWFStyle:1323 rollTWFAttack:1331 _weaponDamageRoll:1379 rollTWFDamage:1400 rollWeaponAttack:1412 rollWeaponDamage:1467 removeWeapon:1496 _invDndInit:1530 _invClearIndicators:1559 _invSetIndicator:1568 _invCleanup:1573 _invCancelDrag:1580 _invMoveItem:1588 _invCommitDrop:1605 invDragStart:1626 invDragOver:1636 invDragLeave:1653 invDrop:1657 invDragEnd:1663 invTouchStart:1670 invTouchMove:1686 invTouchEnd:1718

**app-spells.js** (2003 строк, 98 функций)  
toggleSpellStatRow:9 renderSpellSlots:14 togglePactSlot:83 adjustPactSlots:94 syncSpellSlotsFromClass:109 updateSpellSlots:118 toggleSpellSlot:129 adjustSpellSlots:140 restoreAllSlots:158 setSpellVersion:169 _syncSpellVersionLock:179 setSpellClass:188 _charSpellClassKey:197 _charMaxCastableLevel:208 _defaultSpellVersion:216 openSpellSearch:219 markCharOwnClassFilter:237 closeSpellSearch:267 _featPickCtx:278 featAddFixedSpells:293 openFeatSpellPicker:319 _featPickProgressText:336 _renderFeatPickBar:342 featPickSetClass:361 _featPickCandidates:369 _renderFeatPickList:379 addFeatSpell:410 removeFeatSpell:430 _parseSpellClassList:453 _syncNewSpellClassChips:457 toggleNewSpellClass:464 _fillNewSpellDamageTypes:489 _toggleHidden:496 updateNewSpellMechFields:504 _hbFormulaCheck:519 _collectHbEffect:528 _spellIdArg:566 _findHomebrewSpell:572 openAddSpellForm:580 _syncCustomSpellAcrossChars:659 _purgeCustomSpellFromChars:677 deleteCustomSpell:696 _deleteCustomSpellConfirmed:705 closeAddSpellForm:719 submitNewSpell:723 renderSpellSearch:813 addSpell:882 removeSpell:898 toggleSpellCard:912 renderMySpells:917 _spellActiveBadgeText:1059 _spellActiveBadgeHtml:1063 updateSpellActiveBadges:1066 _prepEntries:1089 _spellPrepEntry:1104 _prepLimit:1109 calcMaxPrepared:1125 _known2014:1132 calcMaxKnownSpells:1146 _knownSpellCount:1152 calcMaxCantrips:1162 isPrepClass:1171 _subclassSpellNames:1177 spellNeedsPrep:1199 _preparedCount:1215 isSpellPrepared:1222 toggleSpellPrepared:1232 renderPrepCounter:1258 _castableSlotOptions:1304 _arcanumResId:1325 castSpell:1335 _castSpellWithSlot:1356 _finishCast:1394 applyCastEffects:1440 openCastVariantChooser:1481 pickCastVariant:1520 closeCastVariantChooser:1530 _applyCastSummon:1543 _nextCastInstanceId:1577 _replaceCastInstance:1585 _ensureCastInstance:1615 _applyCastDamage:1635 _rollCastDamage:1651 _startCastRepeat:1716 castRepeatDamage:1730 _applyCastDebuff:1755 castSpellAttackMod:1796 castStatMod:1804 _applyCastHeal:1822 _castHealApply:1843 _applyCastTempHp:1849 applyCastTempHp:1866 _applyCastHpMaxBonus:1880 openCastChooser:1900 closeCastChooser:1921 canCastAsRitual:1934 castRitual:1956 cancelRitual:1992

**app-party.js** (2302 строк, 168 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentImport:268 openAddAllyModal:306 openEditAllyModal:307 closeAddAllyModal:308 saveAlly:309 deleteAlly:310 setAllyStatus:311 exportAllies:312 importAllies:313 openAddNPCModal:315 openEditNPCModal:316 closeAddNPCModal:317 saveNPC:318 deleteNPC:319 setNPCStatus:320 exportNPCs:321 importNPCs:322 openAddMonsterModal:324 openEditMonsterModal:325 closeAddMonsterModal:326 saveMonster:327 deleteMonster:328 setMonsterStatus:329 exportMonsters:330 importMonsters:331 _monSigned:338 _monFormFill:339 _monFormStat:355 monsterFormRefresh:356 toggleMonsterSave:372 monsterAddAttackRow:373 _monFormRead:385 _monFormApply:399 monsterSaveBonus:410 monsterStatBlockHtml:415 monsterRoll:441 monsterAttackRoll:445 _monCatalog:456 _monCatalogIndex:462 _monCatalogPut:468 deleteCatalogMonster:478 addMonsterFromCatalog:490 _npcAttColor:510 renderNPCs:516 renderMonsters:557 _openSrdMonsterPickerLazy:612 openSrdMonsterPicker:622 openSrdMonsterPickerForBattle:624 _openSrdMonsterPickerCore:629 closeSrdMonsterPicker:672 setSrdMonsterSearch:677 setSrdMonsterCr:678 setSrdMonsterEdition:679 renderSrdMonsterPicker:681 addMonsterFromSRD:751 openSrdNpcPicker:792 _openSrdNpcPickerCore:801 closeSrdNpcPicker:822 setSrdNpcSearch:824 setSrdNpcAtt:825 renderSrdNpcPicker:827 addNpcFromSRD:858 openBattleTab:888 buildBattleSetupList:901 setBattleSearch:921 toggleBattleSection:922 renderBattleSetup:927 battleEncounterInput:975 renderBattleDifficulty:995 toggleBattleCheck:1020 battleDragStart:1025 battleDragOver:1026 battleDrop:1027 battleDragEnd:1035 rollInitiativeValue:1040 sortParticipantsByInitiative:1045 _findPartyMonster:1051 _participantCombatMeta:1061 _makeBattleParticipant:1086 _battleParticipantHP:1099 _addSrdMonsterToBattle:1108 _addCatalogMonsterToBattle:1138 _participantStatBlock:1162 startBattle:1169 getParticipantDesc:1182 showTrackerInfo:1205 getSelfStatusFromHP:1248 syncSelfBattleStatus:1264 renderBattleTracker:1274 renderBattleCastPanels:1367 _battleCondList:1409 _battleCondSet:1417 _battleCondMeta:1422 _battleCondDots:1425 openBattleCondPicker:1439 closeBattleCondPicker:1444 _renderBattleCondPicker:1449 toggleBattleCondition:1496 adjustBattleExhaustion:1511 adjustBattleHP:1530 setBattleHP:1543 setBattleHPMax:1564 setBattleInitiative:1575 rerollInitiative:1587 battleRollD20:1599 removeBattleParticipant:1604 setBattleStatus:1620 _battleStatusFromHp:1628 offerCastDamageToBattle:1644 _castDamageTargets:1661 _castDamageAmount:1667 _renderCastDamageModal:1673 setCastDamageHalf:1736 toggleCastDamageTarget:1744 _castDamageHit:1754 applyCastDamageToTarget:1767 applyCastDamageTargets:1777 closeCastDamageModal:1787 _castHealTargets:1796 offerCastHealToBattle:1802 _renderCastHealModal:1810 toggleCastHealTarget:1855 applyCastHealTargets:1862 closeCastHealModal:1884 _castDebuffTargets:1905 offerCastDebuffToBattle:1911 _renderCastDebuffModal:1927 toggleCastDebuffTarget:1983 pickCastDebuffTarget:1993 applyCastDebuffTargets:2002 closeCastDebuffModal:2030 _battleDebuffChips:2039 removeBattleDebuff:2056 removeBattleDebuffsForSpell:2069 clearAllBattleDebuffs:2084 _logTurn:2089 nextTurn:2094 _battleEconomyRow:2114 toggleBattleEconomy:2126 resetBattleEconomy:2132 prevTurn:2136 tickCastEffectsRound:2147 endBattle:2175 _dmRefEsc:2249 _dmRefGroup:2253 renderDmRef:2264 t:2268 openDmRef:2284 closeDmRef:2289 switchDmRef:2293

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1174 строк, 66 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 showUpdateModal:295 checkWhatsNew:326 showWhatsNewModal:338 toggleAccordion:374 initCharResources:394 getResourceMax:403 getCharResourceDefs:421 currentDieSize:451 crRow:463 crRestoreLabel:476 crResourceRow:491 crSlotRecoveryBudget:545 crSlotRecoveryActs:549 recoverSlotByResource:564 crRowsHtml:590 crSetRows:626 renderClassResources:641 spendResource:659 resetResource:677 toggleResourcePip:687 resetResourcesByRest:712 getJournal:754 addJournalEntry:759 filterJournal:781 renderJournal:788 deleteJournalEntry:824 openAddJournalEntry:833 closeAddJournalEntry:837 saveJournalEntry:840 getCompanions:860 renderCompanions:865 companionHP:910 buildFamiliarFormOptions:923 onCompanionTypeChange:935 applyFamiliarForm:943 openAddCompanionModal:955 summonFamiliar:971 openPrefilledCompanionModal:981 openEditCompanionModal:992 closeAddCompanionModal:1011 saveCompanion:1014 deleteCompanion:1039 switchProfilesTab:1055 clipChangelogText:1070 expandChangelogItem:1081 renderChangelog:1087 openItemRef:1132 closeItemRef:1137 switchItemRef:1142 _syncHeaderHeight:1160

**app-dice.js** (1454 строк, 65 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:217 rollDice:221 _quickRollCompute:316 _quickRollModStr:335 _emitDiceRolled:341 _setDiceSettled:349 _setSettledDice:359 _quickRollRecord:376 _quickRollInfoText:383 _quickRollToastText:390 quickRoll:406 renderQuickRollStrip:464 updateQuickRollStripVisibility:486 dismissQuickRollStrip:501 openDiceRollHistory:506 drawDiceSVG:519 _waitDiceBoxModule:538 _diceLsGet:558 _getAccentColor:566 _getDiceTheme:585 _getDiceThemeColor:592 setDiceTheme:595 _syncDiceThemeButtons:601 _getDiceBg:611 setDiceBg:618 _syncDiceBgButtons:624 _diceDbg:634 _initDiceBox:639 animateDice3d:745 animateDice2d:940 buildDie:966 tick:1034 _applyDiceCritGlow:1057 parseDiceFormula:1078 _formulaCanon:1114 _renderFormulaResult:1126 rollFormula:1162 _rollFormulaFrom:1228 rollCustomFormula:1241 renderDiceHistory:1244 createParticles:1266 _diceShapeSvg:1300 renderDiceFan:1307 _paintSelectedDie:1326 _diceHeroSvg:1350 _paintDiceMode:1360 selectDie:1375 rollSelectedDie:1394 toggleDiceFormulaPanel:1403 _diceHotkeys:1422

**app-settings.js** (752 строк, 75 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:171 _getStatsLayout:188 _applyStatsLayout:195 _statsInCards:202 _statsRowTarget:206 _placeStatRows:224 setStatsLayout:240 _syncStatsLayoutButtons:247 _getSheetLock:260 setSheetLock:264 _syncSheetLockButtons:269 _wakeLockSupported:280 _getWakeLockOn:281 _applyWakeLock:285 setWakeLock:300 _syncWakeLockButtons:305 _getAttackDamageOn:315 setAttackDamage:318 _syncAttackDamageButtons:322 isEditionSplit:331 setEditionSplit:334 _syncEditionSplitButtons:339 _getStatsCollapsed:351 _applyStatsCollapsed:354 toggleStatsCollapsed:359 _getStoredDensity:373 _getDefaultDensity:381 _getDensity:388 _applyDensity:391 setDensity:395 _syncDensityButtons:401 _onViewportDensityChange:409 _getFontScale:427 _applyFontScale:434 setFontScale:445 _syncFontScaleUi:456 _getGlassAlpha:471 _getGlassBlur:478 _applyGlassAlpha:485 _applyGlassBlur:486 setGlassAlpha:487 setGlassBlur:497 _syncGlassUi:506 _getSpaceMode:555 _applySpaceBg:562 setSpaceMode:577 _syncSpaceButtons:583 _spaceOnScroll:602 _applyDymkaIcons:630 _initAppLinks:643 _isStandalone:674 _isIos:680 _installMode:684 _syncInstallUi:689 installApp:702 openSettingsModal:726 closeSettingsModal:739

**app-asi.js** (777 строк, 36 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:79 buildASIStatGrid:91 getASIMode:112 toggleASIStat:117 updateASIPreview:139 getFeatDef:219 _featPickerList:237 buildFeatList:249 filterFeatList:280 _asiFeatBlocked:289 _featStatPickHtml:296 _asiFeatReady:309 selectFeatStat:313 selectFeat:320 _asiUnlockSheet:341 _asiShowStatModes:350 applyASI:360 renderTakenFeats:517 removeFeat:564 _agBonus:600 _agPbSpent:607 _agBase:613 _agReady:620 openAbilGen:624 agSetMode:640 agPb:646 _agSwap:656 agStd:663 agPick:669 agRoll:675 _agCtl:688 _agRender:709 agApply:757

**app-progress.js** (856 строк, 48 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:164 _pgAttention:205 _pgGrownLast:243 _pgClassRow:256 _pgClasses:299 _pgNext:315 _pgAvailableClasses:370 _pgActions:383 _pgBuild:401 openProgressTab:414 openProgress:424 pgTabActive:435 pgRefresh:442 pgSetSubclass:450 pgFocusSubclass:464 pgLevelUp:481 pgLevelDown:486 pgAfterLevelModal:492 pgAddClass:503 renderClassDev:517 _pgSheetAboutRow:536 _pgSubclassRows:554 syncClassFieldUI:580 openFeatureInfo:618 _fiRuleNotes:661 _mlTotal:700 _mlMissing:705 openMcLayout:711 mlSetClass:723 mlLevel:731 mlSetSub:740 mlAdd:745 mlRemove:751 _mlRender:757 mlApply:817

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

**data.js** (6401 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:120 SAVES_DATA:142 CONDITIONS:151 EFFECTS_DATA:174 CLASS_FEATURES:225 SPELL_PREP_CLASSES:475 CANTRIPS_KNOWN_2014:483 SPELLS_KNOWN_2014:491 SPELL_SLOTS_BY_LEVEL:498 CLASS_HIT_DICE:573 SUBCLASSES:579 SOURCE_LABELS:598 SUBCLASS_SOURCE:609 BOOK_CODES:672 SUBCLASS_LEVEL:690 SUBCLASS_FEATURES:706 WEAPON_PRESETS:1426 ITEM_ICONS:1470 CATEGORY_NAMES:1471 GEAR_PACKS:1480 RACE_DATA:1575 BACKGROUND_SKILLS:1714 BACKGROUND_ALIASES:1793 DEITY_ALIGN_LABELS:1806 DEITIES_DATA:1811 LANGUAGE_CATALOG:1879 RACE_LANGUAGES:1908 CLASS_LANGUAGES:1935 TOOL_CATALOG:1941 RACE_TOOLS:1996 CLASS_TOOLS:2003 SUBCLASS_LANGUAGES:2011 SUBCLASS_TOOLS:2024 RACE_ARMOR:2046 RACE_WEAPONS_SPECIFIC:2050 CLASS_WEAPONS_SPECIFIC:2063 RACE_NAME_POOLS:2076 RACE_NAME_GROUP:2118 SUBCLASS_ARMOR:2132 ARMOR_PRESETS:2163 skills:2180 ABILITY_INFO:2193 CLASS_SKILL_OPTIONS:2233 CLASS_ARMOR_PROFS:2249 CLASS_RESOURCES:2269 ASI_LEVELS:2431 XP_THRESHOLDS:2439 APP_VERSION:2449 APP_VERSION_DATE:2450 APP_TELEGRAM_URL:2456 APP_DONATE_URL:2457 APP_BOOSTY_URL:2458 FEATS_DATA:2479 APP_CHANGELOG:2801 CASTER_TYPE:6229 THIRD_CASTER_SUBCLASSES:6238 THIRD_CASTER_SLOTS:6245 MULTICLASS_SPELL_SLOTS:6256 MULTICLASS_PREREQUISITES:6281 MULTICLASS_PROFICIENCIES:6299 EDITION_DATA:6328

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (869 строк)  
SPELL_EFFECTS:71

**class-choices.js** (694 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (800 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 SUBCLASS_CHOICES:144 SUBCLASS_RESOURCES:333

