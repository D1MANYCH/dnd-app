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
| 3180–3291 | UX-5: лента последних бросков вне модалки |
| 3292–3468 | Плавающий чип активных эффектов заклинаний (char.activeSpellEffects). |
| 3469–3488 | HAMBURGER BUTTON |
| 3489–3530 | SIDE DRAWER |
| 3531–4034 | STYLE-8L: сайдбар в языке встречающего экрана |
| 4035–4082 | MENU-8/9: встречающий экран во всё окно. |
| 4083–4175 | MENU-2: плашка последнего героя. |
| 4176–4350 | MENU-3: меню приключения. |
| 4351–4421 | MENU-11: адаптив встречающего экрана, доступность, спокойное движение. |
| 4422–4422 | INVENTORY |
| 4423–4453 | INVENTORY — WEIGHT BAR |
| 4454–4490 | INVENTORY — BACKPACK HEADER |
| 4491–4531 | INVENTORY — FILTERS |
| 4532–4720 | INVENTORY — ITEM CARDS |
| 4721–5086 | COINS — BIG NUMBER CARD GRID |
| 5087–5390 | MODALS |
| 5391–5425 | DICE |
| 5426–6006 | v3.18: DICE MODAL — новый UX (header tools + 2-col body + popovers) |
| 6007–6896 | OTHER STYLES |
| 6897–6965 | HP DISPLAY BLOCK |
| 6966–6991 | MOBILE OPTIMIZATION |
| 6992–7120 | LEVEL UP (STYLE-8M-3: экран, а не модалка) |
| 7121–7159 | HP TOAST (snackbar) |
| 7160–7211 | HP HISTORY (STYLE-8M-4: экран, а не модалка) |
| 7212–7265 | Confirm Modal |
| 7266–7690 | ⚔️ ОТРЯД & БОЙ |
| 7691–7970 | RACIAL BONUS BAR |
| 7971–8113 | COMPACT STATS GRID |
| 8114–8381 | UI6-4: ЛИСТ ХАРАКТЕРИСТИК — режимы «2024» / «Классический». |
| 8382–8434 | Режим «Классический»: регион эмулирует сетку 6/3, карточки — |
| 8435–8485 | UI-fix: телефон (≤767px) + вид 2024 — компактные карточки в 2 колонки. |
| 8486–8588 | COMPACT SKILLS |
| 8589–8631 | UI5-5: МОБИЛЬНЫЕ ТАЧ-ТАРГЕТЫ (≥44px) |
| 8632–8703 | ACCORDION |
| 8704–8727 | CLASS RESOURCES |
| 8728–8820 | ASI MODAL |
| 8821–9085 | APP VERSION |
| 9086–9095 | COMPANIONS |
| 9096–9141 | FEATS LIST IN ASI |
| 9142–9388 | PROFILES TABS (Чейнджлог) |
| 9389–9467 | TAKEN FEATS |
| 9468–9664 | SW UPDATE MODAL |
| 9665–9712 | УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ |
| 9713–9885 | INVENTORY SLOTS SYSTEM |
| 9886–10085 | HELP / ONBOARDING (HELP-1) — табовый help-центр. |
| 10086–10357 | HELP-3 — Приветствие первого запуска (#welcome-modal) |
| 10358–10530 | HELP-4 — Движок интерактивного тура (подсветка). |
| 10531–10600 | 3D DICE CUBE |
| 10601–10973 | FEAT-LOG: панель журнала сессии (выезжает справа) |
| 10974–11056 | DESKTOP LAYOUT — centered max-width |
| 11057–11077 | INSPIRATION |
| 11078–11117 | CONCENTRATION |
| 11118–11794 | WEAPON CARDS WITH ROLL BUTTONS |
| 11795–11905 | ПОПАП РЕЖИМА БРОСКА (Преимущество / Помеха) |
| 11906–11968 | СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ |
| 11969–11995 | БОЙ ДВУМЯ ОРУЖИЯМИ (Two-Weapon Fighting) |
| 11996–12119 | КЛАССОВЫЕ ВЫБОРЫ — карточки в asi-container |
| 12120–12146 | R6: Ассеты (декор) |
| 12147–13118 | 📝 Вкладка «Записи по персонажу» — фаза N2 |
| 13119–13206 | STYLE-4b: кнопки, которым ширину давал элементный button{width:100%}. |
| 13207–13215 | BUGFIX-6: мобильная вёрстка (≤540px) |
| 13216–13285 | UI-13: доступ к настройкам и усиление back-кнопки |
| 13286–13617 | UI-10. Skeleton-лоадеры + подсветка совпадений поиска |
| 13618–13644 | UI5-6: ПОЛИРОВКА — единый фокус клавиатуры + шевроны аккордеонов |
| 13645–13692 | Светлая тема: цветные акценты, подобранные под тёмный фон и |
| 13693–13775 | Дымка v5: чипы состояний, мини-индикаторы, SVG-иконки |
| 13776–14873 | STYLE-5: одна поверхность для всех карточек-контейнеров. |
| 14874–14929 | MOTION: переходы между экранами и под-меню встречающего экрана. |
| 14930–15022 | STYLE-8a2 · «Лист»: блок характеристик — реестр |
| 15023–15336 | DISC-1 · Ромб раскрытия |
| 15337–15926 | STYLE-8a2 · остальной «Лист» в языке встречающего экрана |
| 15927–16032 | LVL-2 · Экран «Развитие» (#screen-progress) |
| 16033–16169 | LVL-3 · Раздел «Класс и развитие» на листе и дубль ресурсов в «Бою» |
| 16170–16404 | STYLE-8b3: список «Мои заклинания» — рецепт «Сумки» + чип действия |
| 16405–16414 | STYLE-8b3-fix: срезанный ромб |
| 16415–16728 | STYLE-8b3b: два оставшихся блока «Магии» |
| 16729–17247 | STYLE-8d2 · Вкладка «Бой» в языке встречающего экрана |
| 17248–17282 | STYLE-8M-3: ОКНА-ЭКРАНЫ, ДОЗАХОД — «Повышение уровня», «Отдых», |
| 17283–17921 | STYLE-8M-4: ОКНА-ЭКРАНЫ, ДОЗАХОД II — «История здоровья», |

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
#pg-body:1391-1392 #tab-spells:1393-1395 #spell-stat-card:1396-1417 #spell-mod-display:1418-1423 #spell-dc-display:1424-1429 #spell-attack-display:1430-1435 #spell-stats-by-class:1436-1447 #spell-slots-card:1448-1453  
#spell-slots-visual:1454-1460 #concentration-block:1461-1478 #prep-counter:1479-1479 #my-spells-list:1480-1482 #tab-inventory:1483-1502 #weight-fill:1503-1537 #inventory-list:1538-1547 #inv-pouches:1548-1603  
#tab-notes:1604-1630 #notes-subtabs:1631-1632 #notes-main:1633-1634 #taken-feats-section:1635-1639 #taken-feats-list:1640-1643 #tab-party:1644-1652 #my-char-card:1653-1667 #allies-list:1668-1683  
#npcs-list:1684-1699 #monsters-list:1700-1711 #companions-list-world:1712-1722 #tab-battle:1723-1728 #weapons-list:1729-1731 #ws-card:1732-1734 #saved-roll-form:1735-1741 #saved-roll-err:1742-1743  
#saved-rolls-list:1744-1747 #battle-res-card:1748-1749 #battle-res-rows:1750-1751 #battle-setup-screen:1752-1762 #battle-setup-list:1763-1763 #battle-difficulty:1764-1767 #battle-tracker-screen:1768-1772 #battle-turn-info:1773-1778  
#battle-repeat-strip:1779-1779 #battle-tracker-list:1780-1789 #tab-journal:1790-1804 #journal-list:1805-1811 #screen-itemref:1812-1814 #item-ref-tabs:1815-1820 #item-ref-weight:1821-1859 #item-ref-slots:1860-1891  
#screen-dmref:1892-1894 #dm-ref-tabs:1895-1899 #dm-ref-ed:1900-1900 #dm-ref-cond:1901-1901 #dm-ref-combat:1902-1902 #dm-ref-world:1903-1907 #screen-help:1908-1930 #help-about:1931-1954  
#help-start:1955-1979 #help-sheet:1980-2003 #help-progress:2004-2049 #help-spells:2050-2066 #help-inventory:2067-2079 #help-battle:2080-2104 #help-party:2105-2121 #help-notes:2122-2130  
#help-journal:2131-2139 #help-planes:2140-2167 #help-dice:2168-2179 #help-edition2024:2180-2219 #help-data:2220-2236 #help-marks:2237-2259 #conc-details-modal:2260-2270 #conc-detail-duration-row:2271-2278  
#conc-detail-desc-row:2279-2288 #add-journal-modal:2289-2312 #add-npc-modal:2313-2342 #add-ally-modal:2343-2379 #screen-monsters:2380-2392 #srd-monster-count:2393-2393 #srd-monster-results:2394-2398 #srd-npc-modal:2399-2408  
#srd-npc-count:2409-2409 #srd-npc-results:2410-2417 #screen-monsterform:2418-2455 #monster-cr-note:2456-2458 #monster-stats:2459-2460 #monster-saves:2461-2462 #monster-attacks:2463-2486 #screen-rest:2487-2489  
#rest-main-screen:2490-2496 #rest-info-screen:2497-2501 #hit-dice-section:2502-2503 #hit-dice-controls-total:2504-2508 #hit-dice-by-size:2509-2513 #rest-food-section:2514-2522 #rest-result-screen:2523-2525 #rest-result-details:2526-2534  
#screen-levelup:2535-2539 #lu-screen-multiclass:2540-2541 #lu-mc-current-classes:2542-2544 #lu-mc-new-class:2545-2549 #lu-mc-prereq-warn:2550-2550 #lu-mc-subclass-row:2551-2559 #lu-screen-preview:2560-2592 #lu-slots-card:2593-2594  
#lu-slots-info:2595-2598 #lu-build-hint:2599-2599 #lu-features-container:2600-2608 #lu-screen-choices:2609-2610 #lu-choices-body:2611-2617 #lu-screen-result:2618-2619 #lu-result-title:2620-2620 #lu-result-body:2621-2627  
#screen-wildshape:2628-2633 #ws-limits:2634-2634 #ws-results:2635-2638 #screen-hphistory:2639-2641 #hp-history-list:2642-2647 #asi-modal:2648-2652 #asi-build-hint:2653-2667 #asi-feat-list:2668-2668  
#asi-stat-grid:2669-2669 #asi-preview:2670-2678 #class-choice-modal:2679-2694 #dice-modal:2695-2727 #dice-file-hint:2728-2728 #dice3d-result:2729-2740 #dice-result-display:2741-2754 #dice-pick-hint:2755-2755  
#dice-mode-segment:2756-2760 #dice-formula-panel:2761-2778 #dice-fan:2779-2787 #dice-popover-settings:2788-2835 #dice-popover-history:2836-2847 #dice-history:2848-2856 #screen-spellsearch:2857-2859 #spell-feat-bar:2860-2876  
#spell-class-filter:2877-2920 #class-filter-legend:2921-2922 #spell-search-count:2923-2923 #spell-search-results:2924-2927 #cast-spell-modal:2928-2932 #cast-spell-options:2933-2935 #add-spell-modal:2936-2979 #new-spell-class-chips:2980-3025  
#new-spell-mech-fields:3026-3030 #new-spell-mech-dmg-row:3031-3050 #new-spell-mech-half-row:3051-3053 #new-spell-mech-mod-row:3054-3064 #item-modal:3065-3109 #item-armor-fields:3110-3135 #coin-exchange-modal:3136-3174 #exch-preview:3175-3181  
#screen-magiccatalog:3182-3209 #magic-catalog-count:3210-3210 #magic-catalog-list:3211-3214 #screen-gearcatalog:3215-3219 #gear-packs-list:3220-3233 #gear-catalog-count:3234-3234 #gear-catalog-list:3235-3239 #weapon-modal:3240-3243  
#weapon-picker-section:3244-3246 #weapon-filter-chips:3247-3256 #weapon-presets-list:3257-3257 #weapon-pick-bar:3258-3320 #character-tabs:3321-3332 #quick-roll-strip:3333-3338 #qrs-list:3339-3349 #active-effects-panel:3350-3354  
#aef-list:3355-3361 #hp-toast-container:3362-3364 #add-companion-modal:3365-3381 #companion-familiar-row:3382-3402 #mob-sheet:3403-3406 #mob-sheet-list:3407-3410 #confirm-modal:3411-3424 #avatar-modal:3425-3428  
#avatar-modal-preview:3429-3456 #screen-builds:3457-3484 #bp-list:3485-3489 #screen-buildguide:3490-3492 #bg-body:3493-3497 #screen-buildplan:3498-3500 #bp-plan-body:3501-3505 #screen-abilityinfo:3506-3508  
#ai-body:3509-3513 #screen-abilgen:3514-3516 #ag-body:3517-3521 #screen-books:3522-3524 #books-body:3525-3529 #screen-mclayout:3530-3532 #ml-body:3533-3537 #screen-featureinfo:3538-3540  
#fi-body:3541-3545 #app-log-panel:3546-3565 #app-log-list:3566-3745 #notes-entry-modal:3746-3794  

## Функции по файлам (`имя:строка`)

**rules.js** (1763 строк, 117 функций)  
getProficiencyBonus:8 getMod:15 formatMod:16 calculateMaxHP:19 _hpClassEntries:28 rulesMaxHPBase:42 rulesHasClass:57 rulesHitDicePool:62 _hdSizesDesc:70 rulesHitDiceSpentBy:76 rulesHitDiceLabel:100 rulesPickHitDice:110 rulesClampHitDice:122 rulesRitualMinutes:134 rulesHitDieHeal:141 rulesSpendHitDice:147 charClassLevel:173 charHasClass:183 charClassLevelOr:193 charAsiSlots:202 charEpicSlots:217 charSubclassPending:235 charXpNext:248 rulesJackOfAllTrades:259 charClassSubclass:264 rulesHasFeat:273 rulesHasFightingStyle:278 rulesHasDraconicResilience:290 rulesHasDazzlingFootwork:295 rulesRemarkableAthlete:300 rulesUntrainedCheckBonus:306 rulesHasExpertise:313 getInitiativeMod:319 rulesSaveBonus:335 rulesSkillBonus:341 rulesPassivePerception:356 rulesSpellStats:360 _spellStatMod:380 rulesSpellStatsByClass:388 rulesWeaponMods:406 rulesOffhandDamageMod:422 armorPenalties:431 rulesItemArmor:444 rulesArmorItem:456 rulesAC:467 charCasterLevel:649 classSpellSlotRow:690 getMulticlassSpellSlots:703 rulesRestoreLevelFields:739 rulesApplySpellSlots:758 resolvePactSlots:781 restoreItemCharges:791 rulesHitDieSides:808 rulesShortRest:814 rulesLongRestBlockReason:849 rulesLongRest:862 rulesExhaustionLevel:928 rulesEffectiveHpMax:934 _dsReset:939 _dsCount:940 _dsFill:941 _condAdd:942 _condRemove:943 rulesIsDead:945 rulesIsStable:949 rulesRegainFromZero:954 rulesSetHp:960 rulesDamageAfterDefenses:972 rulesApplyDamage:984 rulesDeathSaveBlockReason:1021 rulesDeathSave:1028 rulesConditionRollMods:1047 rulesEffectiveSpeed:1064 rulesArmorStealthDisadv:1085 rulesFeatPrereqMissing:1094 rulesFeatStatChoice:1121 rulesFeatStatOptions:1129 rulesFeatSlotCount:1142 rulesFeatSpellFits:1147 rulesFeatSpellCandidates:1158 rulesFeatSpellLabel:1162 rulesFeatSpellProgress:1167 rulesFeatClassOptions:1192 rulesFeatFreeResId:1205 rulesResetFeatFree:1208 concSaveParams:1219 rulesCrToXp:1261 rulesCrToProf:1267 rulesCrValue:1274 rulesWildShapeLimits:1285 rulesPolymorphLimits:1309 rulesCombatWildShapeHeal:1314 rulesBeastAllowed:1319 rulesFormStart:1326 rulesFormOwnHp:1340 rulesFormDamage:1345 rulesFormHeal:1360 rulesEncounterMultiplier:1367 rulesEncounterDifficulty:1376 getCharClassPairs:1400 charEditionMismatch:1414 findLangInCatalog:1422 ensureLanguagesArray:1434 recalcLanguagesFromSources:1450 add:1455 findToolInCatalog:1500 ensureToolsArray:1512 getBackgroundDef:1533 validateBgStatChoice:1569 parseBackgroundToolEntry:1589 recalcToolsFromSources:1604 add:1609 ensureArmorWeaponFields:1674 recalcArmorWeaponFromSources:1687 addArmor:1693 addWeapon:1694 addSpec:1743

**app-core.js** (1667 строк, 78 функций)  
$:8 getCurrentChar:10 openModal:12 _syncModalOpenFlag:21 closeModal:30 debounce:41 localDateStamp:64 migrateToMulticlass:75 syncClassFields:89 isMulticlass:97 getClassLabel:102 getClassLine:111 checkMulticlassPrereqs:121 check:124 autoFillItemWeight:168 setItemQty:185 _openFromLaunchParams:266 _blockSaving:281 _loadCharsSafe:295 _onStorageChange:310 _stampCurrentCharUpdated:329 saveToLocal:343 initPersistentStorage:367 _formatStorageBytes:388 updateStorageStatus:396 currentScreenName:457 screenBack:463 _modalVisible:477 _closeOpenModals:480 headerBack:490 _screenMotionOk:523 _screenGhostDrop:529 _screenGhostStart:541 _screenEnter:559 _purgeDraftChars:570 showScreen:583 updateHeaderTitle:686 syncDrawerHeader:740 switchTab:752 openDrawer:782 closeDrawer:795 showCharacterNav:807 hideCharacterNav:815 isInteractive:835 currentActiveTab:858 createNewCharacter:916 getClassColor:938 getClassIcon:953 getAbilityIcon:960 getConditionIcon:975 getConditionChipIcon:999 getSpellClassIcon:1017 getSchoolSlug:1034 getSchoolIcon:1038 stripLeadingEmoji:1051 formatTimeAgo:1055 setCharSort:1069 setCharSearch:1076 duplicateCharacter:1080 exportOneCharacter:1092 updateCharCounter:1099 onDragStart:1116 onDragOver:1117 onDrop:1118 renderCharacterList:1129 renderCharPlate:1215 deleteCharacter:1274 showConfirmModal:1288 safeSet:1335 safeSetChecked:1339 loadCharacter:1348 showToast:1539 toastAddAction:1556 emptyStateHtml:1574 openHPHistory:1585 closeHPHistory:1613 updateVersionBlock:1618 forceAppUpdate:1649

**app-migrate.js** (1034 строк, 2 функций)  
migrateCharacter:6 _backfillHomebrewFlag:1026

**app-builds.js** (1724 строк, 45 функций)  
_withBuilds:7 openBuildPicker:17 setBuildEdition:45 renderBuildPicker:58 renderBuildBadge:136 renderEditionBadge:152 openBuildBadgeMenu:165 unlinkBuild:171 _stemSet:192 _matchByStems:198 _weaponMatchNames:206 _findWeapon:209 _findArmorPreset:234 applyBuild:248 _applyBuildCore:271 _pick:896 _glossNorm:1005 _reEscape:1006 _glossEd:1007 _glossBuild:1008 ingest:1010 _glossIndex:1032 glossarizeHtml:1040 _glossPopoverEl:1054 hideGlossPopover:1066 showGlossPopover:1071 _glossBindOnce:1090 openBuildGuide:1121 gx:1144 _list:1145 getBuildLevelRec:1208 getBuildRecChoiceOption:1213 getBuildRecChoiceIds:1221 getBuildRecFeat:1226 getBuildRecAsi:1236 getBuildRecSubclass:1243 parseAsiFromHeadline:1251 _buildFeatNameMap:1265 parseFeatFromHeadline:1307 parseSpellsFromHeadline:1324 getBuildRecSpellObjs:1570 openBuildPlan:1590 _cpSubclassOf:1643 _cpClassSwitch:1654 openClassPlan:1669

**app-io.js** (717 строк, 37 функций)  
_buildExportPayload:9 exportData:24 _isValidImportedChar:37 _importNum:47 _sanitizeImportedChar:48 _sanitizeHpEntry:101 _normalizeImportedSpell:110 _isValidImportedSpell:121 _collectCharUserSpells:125 _ingestImportedUserSpells:143 _spellBaseById:189 _unpackSpell:197 _countUnresolvedSpells:219 _unresolvedNote:227 _importTooNew:232 _packSpell:241 _packCharForExport:252 _unpackCharSpells:259 _buildCharEnvelope:265 _charExportFileName:280 _downloadText:283 _shareableFile:294 shareOneCharacter:305 copyCharToClipboard:322 pasteCharFromClipboard:335 _extractCharsFromImport:353 _applyFullRestore:365 _warnEditionMix:409 run:410 importData:425 importOneCharacter:484 _importOneCharText:501 _consumeLaunchFiles:582 _importLaunchText:615 exportSpells:622 importSpells:631 exportSessionLog:704

**app-combat.js** (3331 строк, 151 функций)  
showRollModePopup:10 rollHintText:37 rollD20WithMode:49 formatRollMode:64 formatRollModeLabel:79 showDualDice:86 formatDiceInfoStr:104 rollSavingThrow:117 rollAbilityCheck:133 rollSkillCheck:147 initSaves:166 autoSelectProficiencies:201 initSkills:244 toggleAbilOpen:272 abilityBreakdown:284 openAbilityInfo:312 toggleExpertise:347 loadExpertise:366 updateSkillProfCount:380 updateSkillSources:392 updateClassFeatures:416 calculateAC:431 toggleInspiration:492 updateStatusCounter:505 updateStatusBar:519 updateInspirationLabels:561 updateStatDisplay:578 updateAllStatDisplays:583 adjustStat:587 adjustCoin:610 renderCoinMob:624 openCoinSheet:634 setCoinFromSheet:644 updateCoinTotal:651 openCoinExchange:663 closeCoinExchange:668 previewExchange:672 coinExchangeCalc:700 confirmExchange:705 updateSubclassOptions:728 updateSubclassRecHint:785 featHpPerLevel:800 featHpFlat:809 recalculateHP:818 updateChar:873 toggleProficiency:940 calcStats:963 setSpellStat:1034 calcSpellStats:1045 _toggleNonCasterCards:1097 showSpellCasterCards:1108 onRaceChange:1116 renderBooksRow:1246 openMobSheet:1273 closeMobSheet:1280 mobSheetActs:1282 openBooksSheet:1287 toggleCharBook:1297 populateRaceSelect:1314 _speciesEffective:1347 _renderSpeciesBar:1360 _speciesChoiceOptions:1375 toggleSpeciesChoice:1382 syncSpeciesSpells:1396 rollRandomName:1442 pick:1450 build:1451 _raceSkillAllowance:1510 _raceFlexCount:1516 _raceFlexFits:1522 _raceFlexApply:1529 _setExtrasHtml:1539 renderRaceExtras:1548 toggleHalfElfStat:1719 toggleRaceFlexStat:1745 setRaceVariableTrait:1775 _raceSkillSet:1792 _pickHide:1802 _pickExpandBtn:1806 pickExpand:1809 raceLangGoto:1816 toggleRaceSkill:1824 _classSkillList:1853 _skillsFromOtherSources:1866 _skillsByName:1875 _skillTakenElsewhere:1881 _classSkillHeld:1893 _classSkillSync:1899 renderClassSkills:1930 toggleClassSkill:1973 openRaceFeatModal:2001 removeRaceFeat:2021 applyBasicLockUI:2056 updateLockButtonState:2086 lockBasicInfo:2123 unlockBasicInfo:2143 isSheetLocked:2171 sheetLockGuard:2177 applySheetLockUI:2183 _creationTodo:2212 add:2216 src:2217 scheduleCreationTodo:2276 renderCreationTodo:2281 creationTodoGo:2306 openLockSheet:2316 _creationUiReset:2329 _isMobSheet:2330 renderIdentitySummary:2331 toggleIdentityMore:2350 renderProfSummary:2354 toggleProfCard:2369 openAcSheet:2375 _mobMarkClamp:2383 init:2392 lockSheet:2413 doLock:2417 unlockSheet:2430 onBackgroundChange:2451 _bgSkillsOf:2496 _bgUncheckOld:2503 _bgCheckSkills:2511 renderBackgroundFeature:2523 _bgStatShort:2568 populateBackgroundSelect:2571 _bgRevertStatChoice:2602 _bgAppliedStat:2615 _bgApplyStat:2620 setBgStatMode:2632 toggleBgStat:2644 _bgAfterStats:2667 _bgRevertFeatEffects:2678 syncOriginFeat:2703 toggleBgCustom:2739 _toggleBgCustom14:2779 toggleBgSkillPick:2826 _renderBgCustom14:2853 giveBackgroundEquipment:2890 renderBackgroundExtras:2933 _armorFromSelect:3038 renderArmorSelect:3050 onArmorPick:3085 onShieldPick:3099 onArmorChange:3118 onManualAC:3147 onManualMaxHP:3154 calcCoinWeight:3177 getActiveConditionsForRender:3191 toggleConditionsPopup:3220 closeConditionsPopup:3232 renderConditionsPopup:3238

**app-conditions.js** (492 строк, 27 функций)  
renderResistances:9 addResistance:58 removeResistance:82 applyDamageResistance:91 conditionShortName:98 _condMatches:109 setConditionsSearch:114 toggleConditionsActiveOnly:115 renderConditionsGrid:121 toggleConditionDesc:174 toggleEffectDesc:182 initConditions:189 getExhaustionLevel:221 adjustExhaustion:228 updateExhaustionDisplay:254 toggleCondition:275 updateConditionsCount:302 loadConditions:311 _fxMatches:325 setEffectsSearch:330 setEffectsType:331 toggleEffectsActiveOnly:339 renderEffectsGrid:345 initEffects:428 toggleEffect:448 updateEffectsCount:477 loadEffects:486

**app-cast-effects.js** (352 строк, 16 функций)  
_revertCastInstanceBody:11 removeCastEffectsForSpell:31 clearAllCastEffects:76 expireCastEffectsByUnits:97 setConcentration:115 openConcDetails:149 closeConcDetails:175 endConcentration:183 updateConcentrationDisplay:196 _aefRemainingLabel:236 _aefRowHtml:251 renderActiveEffectsFab:265 toggleActiveEffectsPanel:285 _aefBindOutside:304 advanceActiveEffects:324 removeActiveEffect:336

**app-proficiencies.js** (644 строк, 20 функций)  
profSourceLabel:19 getLanguageChoiceSlots:30 renderLanguages:64 addChoiceLanguage:149 addCustomLanguage:166 removeCustomLanguage:193 getToolChoiceSlots:218 buildToolOptionsHtml:286 renderTools:307 addChoiceTool:380 addCustomTool:396 removeCustomTool:423 renderArmorProf:442 renderWeaponProf:492 addCustomArmorType:556 removeCustomArmorType:572 addCustomWeaponType:584 removeCustomWeaponType:599 addCustomSpecificWeapon:610 removeCustomSpecificWeapon:631

**app-hp.js** (1878 строк, 57 функций)  
openRestModal:6 closeRestModal:11 showRestMain:18 showShortRestInfo:26 showLongRestInfo:48 showRestResult:77 adjustHitDice:89 _restHitDiceChosen:101 adjustHitDiceSize:108 updateHitDiceInfo:115 confirmRest:147 openLevelUpModal:232 _showMulticlassScreen:262 luPickAnotherClass:307 openMulticlassNewClass:314 confirmMulticlassNewClass:373 _showLevelUpPreview:384 closeLevelUpModal:551 confirmLevelUp:564 _luShowResult:691 luFinishChoices:722 luRefreshChoices:729 luSetSubclass:736 luApplyFeatById:755 luApplyAsi:801 _luFeatChoiceAt:822 _luChoiceOpensAt:831 _ccDefsFor:836 _luAsiDone:847 luApplyAllRecommendations:852 luBuildChoicesScreen:972 recBadge:980 luAddRecommendedSpells:1112 luGoToSpellsTab:1140 openLevelDownConfirm:1152 confirmLevelDown:1197 loadDeathSaves:1230 toggleDeathSave:1274 resetDeathSaves:1291 updateHPDisplay:1304 hpToggleRow:1390 hpSetRowOpen:1399 updateHPSummary:1407 updateHPRows:1471 quickHP:1489 setHPAbsolute:1615 addHPHistory:1640 _hpUndoPrepare:1657 _hpUndoConcSnap:1677 _hpUndoConcRestore:1694 undoHPChange:1717 showHPToast:1747 applyCustomHP:1772 saveTempHP:1789 rollHitDieQuick:1803 renderHitDiceIcons:1835 rollDeathSave:1849

**app-inventory.js** (1748 строк, 79 функций)  
filterInventory:6 _isBackpackOff:26 _isItemActive:29 toggleBackpackOff:34 getSlotsTotal:48 calcUsedSlots:58 updateSlotsDisplay:74 renderPouches:113 renderInventory:152 toggleInvItem:264 editItemDirect:269 deleteItemDirect:270 updateInventoryWeight:290 countAttuned:325 _hasAttunable:335 toggleAttuned:342 updateAttuneCount:362 adjustItemCharges:373 openItemModal:389 closeItemModal:462 syncItemArmorFields:467 syncWornArmor:479 submitItem:508 openMagicCatalog:579 closeMagicCatalog:596 renderMagicCatalog:601 fillFromMagicItem:633 openGearCatalog:686 closeGearCatalog:702 renderGearPacks:707 renderGearCatalog:717 fillFromGearItem:745 addPackToInventory:768 rollTrinket:790 _weaponPresets2024:826 _weaponMasteryGrant:847 getWeaponMasteryLimit:872 canMasterWeapon:877 getWeaponMasteryProp:886 isWeaponMastered:893 toggleWeaponMastery:896 _weaponCatalog:915 renderWeaponPresets:929 filterWeaponPresets:995 toggleWeaponFilter:999 fillWeaponPreset:1006 _resetWeaponForm:1024 openWeaponModal:1044 closeWeaponModal:1054 editWeapon:1062 deleteCustomWeapon:1092 _weaponPresetByName:1118 checkWeaponProficiency:1125 submitWeapon:1153 weaponRowTap:1244 renderWeapons:1257 isLightWeapon:1336 toggleTWFStyle:1341 rollTWFAttack:1349 _weaponDamageRoll:1397 rollTWFDamage:1418 rollWeaponAttack:1430 rollWeaponDamage:1485 removeWeapon:1514 _invDndInit:1548 _invClearIndicators:1577 _invSetIndicator:1586 _invCleanup:1591 _invCancelDrag:1598 _invMoveItem:1606 _invCommitDrop:1623 invDragStart:1644 invDragOver:1654 invDragLeave:1671 invDrop:1675 invDragEnd:1681 invTouchStart:1688 invTouchMove:1704 invTouchEnd:1736

**app-spells.js** (2074 строк, 101 функций)  
toggleSpellStatRow:9 toggleEmptySlotLevels:20 renderSpellSlots:27 togglePactSlot:104 adjustPactSlots:115 syncSpellSlotsFromClass:138 updateSpellSlots:147 toggleSpellSlot:158 adjustSpellSlots:169 restoreAllSlots:195 setSpellVersion:206 _syncSpellVersionLock:216 setSpellClass:225 _charSpellClassKey:234 _charMaxCastableLevel:245 _defaultSpellVersion:253 openSpellSearch:256 markCharOwnClassFilter:274 closeSpellSearch:304 _featPickCtx:315 featAddFixedSpells:330 openFeatSpellPicker:356 _featPickProgressText:373 _renderFeatPickBar:379 featPickSetClass:398 _featPickCandidates:406 _renderFeatPickList:416 addFeatSpell:447 removeFeatSpell:467 _parseSpellClassList:490 _syncNewSpellClassChips:494 toggleNewSpellClass:501 _fillNewSpellDamageTypes:526 _toggleHidden:533 updateNewSpellMechFields:541 _hbFormulaCheck:556 _collectHbEffect:565 _spellIdArg:603 _findHomebrewSpell:609 openAddSpellForm:617 _syncCustomSpellAcrossChars:696 _purgeCustomSpellFromChars:714 deleteCustomSpell:733 _deleteCustomSpellConfirmed:742 closeAddSpellForm:756 submitNewSpell:760 renderSpellSearch:850 addSpell:919 removeSpell:935 toggleSpellCard:949 renderMySpells:954 _spellActiveBadgeText:1096 _spellActiveBadgeHtml:1100 updateSpellActiveBadges:1103 _prepEntries:1126 _spellPrepEntry:1141 _prepLimit:1146 calcMaxPrepared:1162 _known2014:1169 calcMaxKnownSpells:1183 _knownSpellCount:1189 calcMaxCantrips:1199 isPrepClass:1208 _subclassSpellNames:1214 spellNeedsPrep:1241 _preparedCount:1257 openSpellCardsMenu:1265 isSpellPrepared:1280 toggleSpellPrepared:1290 renderPrepCounter:1316 _castableSlotOptions:1362 _arcanumResId:1383 castSpell:1393 _castSpellWithSlot:1414 _finishCast:1452 applyCastEffects:1498 _applyCastForm:1535 openCastVariantChooser:1548 pickCastVariant:1587 closeCastVariantChooser:1597 _applyCastSummon:1610 _nextCastInstanceId:1644 _replaceCastInstance:1652 _ensureCastInstance:1682 _applyCastDamage:1702 _rollCastDamage:1718 _startCastRepeat:1783 castRepeatDamage:1797 _applyCastDebuff:1822 castSpellAttackMod:1863 castStatMod:1871 _applyCastHeal:1889 _castHealApply:1910 _applyCastTempHp:1916 applyCastTempHp:1933 _applyCastHpMaxBonus:1947 openCastChooser:1967 closeCastChooser:1988 canCastAsRitual:2001 castRitual:2023 cancelRitual:2062

**app-party.js** (2376 строк, 172 функций)  
getMonsterTypeIcon:37 saveParty:59 saveBattle:64 getMonsterIcon:71 getFactionColor:72 getFactionLabel:77 getStatusColor:83 openPartyTab:89 renderMyChar:97 renderAllies:131 _pentLabel:161 _pentOpen:201 _pentClose:213 _pentSave:218 _pentDelete:244 _pentStatus:253 _pentExport:258 _isValidPentry:265 _pentSafeIcon:270 _pentNormalize:275 _pentImport:298 openAddAllyModal:339 openEditAllyModal:340 closeAddAllyModal:341 saveAlly:342 deleteAlly:343 setAllyStatus:344 exportAllies:345 importAllies:346 openAddNPCModal:348 openEditNPCModal:349 closeAddNPCModal:350 saveNPC:351 deleteNPC:352 setNPCStatus:353 exportNPCs:354 importNPCs:355 openAddMonsterModal:357 openEditMonsterModal:358 closeAddMonsterModal:359 saveMonster:360 deleteMonster:361 setMonsterStatus:362 exportMonsters:363 importMonsters:364 _monSigned:371 _monFormFill:372 _monFormStat:388 monsterFormRefresh:389 toggleMonsterSave:405 monsterAddAttackRow:406 _monFormRead:418 _monFormApply:432 monsterSaveBonus:443 monsterStatBlockHtml:448 monsterRoll:474 monsterAttackRoll:478 _monCatalog:489 _monCatalogIndex:495 _monCatalogPut:501 deleteCatalogMonster:511 addMonsterFromCatalog:523 _npcAttColor:543 renderNPCs:549 renderMonsters:590 _openSrdMonsterPickerLazy:645 openSrdMonsterPicker:655 openSrdMonsterPickerForBattle:657 _openSrdMonsterPickerCore:662 closeSrdMonsterPicker:705 setSrdMonsterSearch:710 setSrdMonsterCr:711 setSrdMonsterEdition:712 renderSrdMonsterPicker:714 addMonsterFromSRD:784 openSrdNpcPicker:825 _openSrdNpcPickerCore:834 closeSrdNpcPicker:855 setSrdNpcSearch:857 setSrdNpcAtt:858 renderSrdNpcPicker:860 addNpcFromSRD:891 openBattleTab:921 buildBattleSetupList:934 setBattleSearch:954 toggleBattleSection:955 renderBattleSetup:960 battleEncounterInput:1008 renderBattleDifficulty:1028 toggleBattleCheck:1053 battleDragStart:1058 battleDragOver:1059 battleDrop:1060 battleDragEnd:1068 rollInitiativeValue:1073 sortParticipantsByInitiative:1078 _findPartyMonster:1085 _participantCombatMeta:1095 _makeBattleParticipant:1120 _battleParticipantHP:1133 _addSrdMonsterToBattle:1144 _addCatalogMonsterToBattle:1174 _participantStatBlock:1198 startBattle:1206 getParticipantDesc:1228 showTrackerInfo:1251 getSelfStatusFromHP:1295 syncSelfBattleStatus:1312 renderBattleTracker:1322 renderBattleCastPanels:1415 _battleCondList:1457 _battleCondSet:1465 _battleCondMeta:1470 _battleCondDots:1473 openBattleCondPicker:1487 closeBattleCondPicker:1492 _renderBattleCondPicker:1497 toggleBattleCondition:1544 adjustBattleExhaustion:1559 adjustBattleHP:1578 setBattleHP:1592 setBattleHPMax:1623 setBattleInitiative:1634 rerollInitiative:1646 battleRollD20:1658 removeBattleParticipant:1663 setBattleStatus:1681 _battleStatusFromHp:1691 _battleSyncHpStatus:1701 offerCastDamageToBattle:1712 _castDamageTargets:1729 _castDamageAmount:1735 _renderCastDamageModal:1741 setCastDamageHalf:1804 toggleCastDamageTarget:1812 _castDamageHit:1822 applyCastDamageToTarget:1835 applyCastDamageTargets:1845 closeCastDamageModal:1855 _castHealTargets:1864 offerCastHealToBattle:1870 _renderCastHealModal:1878 toggleCastHealTarget:1923 applyCastHealTargets:1930 closeCastHealModal:1952 _castDebuffTargets:1973 offerCastDebuffToBattle:1979 _renderCastDebuffModal:1995 toggleCastDebuffTarget:2051 pickCastDebuffTarget:2061 applyCastDebuffTargets:2070 closeCastDebuffModal:2098 _battleDebuffChips:2107 removeBattleDebuff:2124 removeBattleDebuffsForSpell:2137 clearAllBattleDebuffs:2152 _logTurn:2157 _battleNewRound:2164 nextTurn:2172 _battleEconomyRow:2188 toggleBattleEconomy:2200 resetBattleEconomy:2206 prevTurn:2210 tickCastEffectsRound:2221 endBattle:2249 _dmRefEsc:2323 _dmRefGroup:2327 renderDmRef:2338 t:2342 openDmRef:2358 closeDmRef:2363 switchDmRef:2367

**app-notes.js** (1497 строк, 75 функций)  
renderNotes:43 _renderNotesSubtabs:62 notesSwitchTab:84 _renderNotesMain:96 _findTab:114 _getSectionVariants:133 onGenderChange:144 _renderSectionsView:174 _renderVariantsPanel:229 _renderMdToolbar:254 notesToggleSection:286 notesToggleVariants:302 notesPickVariant:314 notesRegenerateAll:325 _notesHasBuildVariants:356 _ngRaceKey:365 _notesGenVariants:375 pick:382 join:383 many:384 list:392 notesGenerate:413 _notesSyncGenBtn:447 notesPickRandomVariant:452 _applyVariantToSection:465 _mdToHtml:485 closeLists:497 _countStats:537 _bindSectionInputs:544 _updateStats:557 _notesHotkeys:566 notesMdInsert:581 wrap:590 linePrefix:597 notesTogglePreview:647 notesUpdateSection:666 _syncTakenFeatsLocation:681 _renderEntriesView:694 _renderEntryCard:749 notesPinDragStart:796 notesPinDragOver:806 notesPinDragLeave:815 notesPinDrop:820 notesPinDragEnd:830 _notesReorderPinned:839 notesSetTagFilter:867 notesJumpToNpc:873 notesOpenEntryModal:901 notesCloseEntryModal:935 _notesRenderModalTags:940 notesAddModalTag:952 notesModalTagKeydown:962 notesRemoveModalTag:966 notesSaveEntryModal:972 notesDeleteEntry:1020 notesTogglePin:1035 _notesLogJournal:1070 notesSearchInput:1096 notesSearchKeydown:1103 _hlText:1121 _renderSearchResults:1131 notesClearSearch:1210 notesToggleMenu:1221 _notesMenuClose:1234 notesMenuAction:1240 _notesCharName:1255 _notesTriggerDownload:1260 notesExportMd:1268 notesExportJson:1313 _notesSanitizeEntry:1325 _notesFileTooBig:1336 notesHandleImportJson:1344 notesHandleImportMd:1396 notesPrint:1432 _notesFlashSaved:1463

**app-ui.js** (1235 строк, 70 функций)  
injectSkeletons:12 firstLoadSkeleton:28 highlightMatch:39 renderDeityDatalist:52 openAvatarModal:70 closeAvatarModal:89 handleAvatarFile:92 applyAvatarFromUrl:118 applyAvatar:127 removeAvatar:145 renderSheetAvatar:164 prefersReducedMotion:179 animateCountUp:185 tick:193 _reportError:216 swTelegramBlock:284 swSupportBlock:295 showUpdateModal:307 checkWhatsNew:338 showWhatsNewModal:350 toggleAccordion:387 initCharResources:407 getResourceMax:416 getCharResourceDefs:436 currentDieSize:466 crRow:478 crRestoreLabel:491 crResourceRow:506 crSlotRecoveryBudget:564 crSlotRecoveryActs:568 recoverSlotByResource:583 crPassiveNotes:608 rollResourceDie:617 crManeuverRows:636 crRowsHtml:653 crSetRows:690 renderClassResources:705 spendResource:723 resetResource:741 toggleResourcePip:751 resetResourcesByRest:773 getJournal:815 addJournalEntry:820 filterJournal:842 renderJournal:849 deleteJournalEntry:885 openAddJournalEntry:894 closeAddJournalEntry:898 saveJournalEntry:901 getCompanions:921 renderCompanions:926 companionHP:971 buildFamiliarFormOptions:984 onCompanionTypeChange:996 applyFamiliarForm:1004 openAddCompanionModal:1016 summonFamiliar:1032 openPrefilledCompanionModal:1042 openEditCompanionModal:1053 closeAddCompanionModal:1072 saveCompanion:1075 deleteCompanion:1100 switchProfilesTab:1116 clipChangelogText:1131 expandChangelogItem:1142 renderChangelog:1148 openItemRef:1193 closeItemRef:1198 switchItemRef:1203 _syncHeaderHeight:1221

**app-dice.js** (1639 строк, 78 функций)  
openDiceModal:6 _prewarmDiceBox:60 closeDiceModal:71 _diceModalActive:86 showDiceRollOverlay:92 hideDiceRollOverlay:106 toggleDicePopover:113 closeDicePopovers:136 clearDiceHistory:146 resetDiceResult:156 _updateDiceHistoryBadge:168 rollCustomFormulaFromMain:181 diceInsertToken:185 diceFormulaBackspace:191 setDiceMode:210 rollDiceWithSelectedMode:217 rollDice:221 _quickRollCompute:316 _quickRollModStr:335 _emitDiceRolled:341 _setDiceSettled:349 _setSettledDice:359 _quickRollRecord:376 _quickRollInfoText:383 _quickRollToastText:390 _rollSrc:408 quickRoll:415 renderQuickRollStrip:476 updateQuickRollStripVisibility:499 dismissQuickRollStrip:514 openDiceRollHistory:519 drawDiceSVG:532 _waitDiceBoxModule:551 _diceLsGet:571 _getAccentColor:579 _getDiceTheme:598 _getDiceThemeColor:605 setDiceTheme:608 _syncDiceThemeButtons:614 _getDiceBg:624 setDiceBg:631 _syncDiceBgButtons:637 _diceDbg:647 _initDiceBox:652 animateDice3d:758 animateDice2d:960 buildDie:986 tick:1054 _applyDiceCritGlow:1077 parseDiceFormula:1098 _formulaCanon:1134 _renderFormulaResult:1146 rollFormula:1182 _rollFormulaFrom:1264 rollCustomFormula:1277 renderDiceHistory:1280 createParticles:1302 _diceShapeSvg:1336 renderDiceFan:1343 _paintSelectedDie:1362 _diceHeroSvg:1386 _paintDiceMode:1396 selectDie:1411 rollSelectedDie:1430 toggleDiceFormulaPanel:1439 _savedRollFormula:1458 _savedRollsClean:1461 _savedRollNewId:1476 _savedRollLabel:1479 renderSavedRolls:1483 savedRollRoll:1503 savedRollTap:1510 savedRollEdit:1526 savedRollCancel:1542 savedRollSubmit:1547 savedRollDelete:1568 savedRollFromDice:1586 _diceHotkeys:1607

**app-settings.js** (907 строк, 93 функций)  
_getTheme:8 _isEffectiveLight:15 _resolveTheme:22 _applyTheme:27 setTheme:40 _syncThemeButtons:46 _getAccent:56 _applyAccent:63 setAccent:70 _syncAccentButtons:81 _getAutoAccent:111 _accentForClass:122 _applyClassAccent:125 _refreshAccent:128 setAutoAccent:136 _syncAutoAccentToggle:141 getEdition:155 setEdition:163 _syncEditionButtons:172 _getStatsLayout:189 _applyStatsLayout:196 _statsInCards:203 _statsRowTarget:207 _placeStatRows:225 setStatsLayout:241 _syncStatsLayoutButtons:248 _getSheet2Demo:261 _syncSheet2DemoButtons:264 setSheet2Demo:270 _getSheetLock:281 setSheetLock:285 _syncSheetLockButtons:290 _wakeLockSupported:301 _getWakeLockOn:302 _applyWakeLock:306 setWakeLock:321 _syncWakeLockButtons:326 _getHeaderAutohideOn:336 setHeaderAutohide:339 _syncHeaderAutohideButtons:344 _getTrackXpOn:352 _applyTrackXp:355 setTrackXp:358 _syncTrackXpButtons:363 _getAttackDamageOn:384 setAttackDamage:387 _syncAttackDamageButtons:391 isEditionSplit:400 setEditionSplit:403 _syncEditionSplitButtons:408 openBooksScreen:418 _bookRowHtml:422 _renderBooksScreen:432 setBookOn:454 setBooksPreset:460 _afterBooksChange:467 _syncBooksSummary:479 _getStatsCollapsed:491 _applyStatsCollapsed:494 toggleStatsCollapsed:499 _getStoredDensity:513 _getDefaultDensity:521 _getDensity:528 _applyDensity:531 setDensity:535 _syncDensityButtons:541 _onViewportDensityChange:549 _getFontScale:567 _applyFontScale:574 setFontScale:585 _syncFontScaleUi:596 _getGlassAlpha:611 _getGlassBlur:618 _applyGlassAlpha:625 _applyGlassBlur:626 setGlassAlpha:627 setGlassBlur:637 _syncGlassUi:646 _getSpaceMode:695 _applySpaceBg:702 setSpaceMode:717 _syncSpaceButtons:723 _spaceOnScroll:742 _applyDymkaIcons:770 _initAppLinks:783 openSupportLink:815 _isStandalone:827 _isIos:833 _installMode:837 _syncInstallUi:842 installApp:855 openSettingsModal:879 closeSettingsModal:894

**app-asi.js** (805 строк, 37 функций)  
asiMarkUsed:18 openASIModalForLevel:29 openASIModal:35 closeASIModal:79 buildASIStatGrid:91 getASIMode:112 toggleASIStat:117 updateASIPreview:139 getFeatDef:219 _featPickerList:237 buildFeatList:249 filterFeatList:280 _asiFeatBlocked:289 _featStatPickHtml:302 _asiFeatReady:315 selectFeatStat:319 selectFeat:326 _asiUnlockSheet:347 _asiShowStatModes:356 _statGain:367 applyASI:373 renderTakenFeats:539 removeFeat:586 _agBonus:622 _agPbSpent:632 _agBase:638 _agReady:645 openAbilGen:649 agSetMode:667 agPb:673 _agSwap:683 agStd:690 agPick:696 agRoll:702 _agCtl:715 _agRender:736 agApply:784

**app-progress.js** (887 строк, 50 функций)  
_pgArg:19 _pgClassList:24 _pgDisc:42 _pgStatic:54 _pgAttn:60 _pgFeat:65 _pgActRow:72 _pgHeadInner:77 _pgHead:90 _pgAboutRow:96 _pgProfRow:111 _pgAsiRow:129 _pgXpRow:152 _pgSlotRows:165 _pgAttention:206 _pgGrownLast:244 _pgClassRow:257 _pgClasses:300 _pgNext:316 _pgClassWord:370 _pgAvailableClasses:379 _pgActions:392 _pgBuild:410 openProgressTab:423 openProgress:433 pgTabActive:444 pgRefresh:451 pgSetSubclass:459 pgFocusSubclass:473 pgLevelUp:490 pgLevelDown:495 pgAfterLevelModal:501 pgAddClass:512 renderClassDev:526 _pgSheetAboutRow:545 _pgSubclassRows:563 syncClassFieldUI:589 openFeatureInfo:632 _fiRuleNotes:675 _mlTotal:714 _mlMissing:719 openMcLayout:725 mlSetClass:737 mlLevel:745 mlSetSub:754 mlAdd:759 mlRemove:765 _mlRender:771 _mlPruneAsi:836 mlApply:847

**app-desktop.js** (487 строк, 14 функций)  
syncFromStatusBar:134 syncStrip:193 setRailOpen:204 _esc:209 _stripEmoji:215 _condIcon:219 setRowExpanded:225 collapseRow:231 renderRrConditions:233 renderRailSlots:279 renderRailConc:321 updateRailHpRow:336 rrApplyHP:351 init:364

**app-help.js** (1150 строк, 53 функций)  
openHelp:12 openTabHelp:19 closeHelp:27 switchHelpSection:37 getHelpFlag:90 setHelpFlag:94 welcomeGoStep:100 showWelcome:110 closeWelcome:117 welcomeContinue:123 welcomeSkipExperienced:129 welcomeBack:135 welcomeFinish:142 dismissWelcome:175 maybeShowWelcome:178 restartOnboarding:183 _tourWide:219 _ensureTourDom:222 _resolveTarget:263 _tourFirstVisible:278 _tourAnyModalVisible:298 _tourModalOpen:304 _tourStartWhenClear:316 startTour:328 startListTour:341 startSheetTour:345 maybeStartSheetTour:351 restartTour:369 startTabTour:394 maybeStartTabTour:412 tourNext:434 tourPrev:439 endTour:445 _showTourStep:455 _setBox:518 _computeTourBoxes:534 snap:536 corner:549 _layoutTourCorners:571 _layoutTour:588 _onTourKey:691 _onTourReflow:697 _bindTourGlobal:701 _unbindTourGlobal:706 _buildListSteps:717 _buildSheetSteps:767 _buildProgressSteps:859 _buildSpellsSteps:917 _buildInventorySteps:954 _buildBattleSteps:994 _buildNotesSteps:1026 _buildPartySteps:1061 _buildJournalSteps:1119

**app-backup.js** (211 строк, 10 функций)  
_backupLog:26 _backupOpenDb:30 listBackupSnapshots:46 createBackupSnapshot:65 initAutoBackup:106 restoreBackupSnapshot:122 createBackupNow:148 _backupFmtDate:161 toggleBackupPanel:167 renderBackupList:175

**app-pdf.js** (1039 строк, 33 функций)  
_pdfEnsureFont:8 _pdfNewDoc:19 _hexToRgb:28 _pdfImgToDataUrl:36 _pdfLoadSchoolIcons:61 _pdfDecoBorder:77 _pdfSafeName:111 _pdfFormatMod:115 _pdfRule:118 _pdfSection:126 _pdfNeed:137 _pdfMultiline:147 _pdfFooter:165 _pdfStatsAndCombat:264 _pdfSaves:358 _pdfSkills:385 _pdfOrigin2024:415 _pdfAttacks:445 _pdfSpells:482 _pdfInventory:580 _pdfNotes:635 _scLineH:737 _scColor:739 _spellCardList:745 _spellCardBody:758 _spellCardFit:766 _scClip:780 _scWhiteIcon:786 _scCutMarks:808 _scGeom:823 _scDiamond:865 _scDrawCard:870 _spellCardFaces:959

**app-home.js** (288 строк, 16 функций)  
getLastCharacter:22 _homeCantripCount:34 _homeHeroChips:48 _homePlural:68 _homeHeroSig:80 _homeHeroSubtitle:92 renderHomeHero:108 _homeSyncMenu:177 toggleHomeSection:203 homeContinue:220 openDataModal:232 closeDataModal:237 homeExportPdf:247 openAboutModal:261 closeAboutModal:268 _homeSyncContinue:273

## Данные — константы верхнего уровня (`имя:строка`)

**data.js** (7592 строк)  
_ASI:7 _FEAT:8 SCHEMA_VERSION:29 DAMAGE_TYPES:32 DEFAULT_CHARACTER:39 FAMILIAR_FORMS:126 SAVES_DATA:148 CONDITIONS:157 EFFECTS_DATA:180 CLASS_FEATURES:231 SPELL_PREP_CLASSES:481 CANTRIPS_KNOWN_2014:489 SPELLS_KNOWN_2014:497 SPELL_SLOTS_BY_LEVEL:504 CLASS_HIT_DICE:579 SUBCLASSES:585 SOURCE_LABELS:605 SUBCLASS_SOURCE:632 BOOK_CODES:701 _booksOffCache:704 SUBCLASS_LEVEL:745 SUBCLASS_FEATURES:761 WEAPON_PRESETS:1553 ITEM_ICONS:1597 CATEGORY_NAMES:1598 GEAR_PACKS:1607 RACE_DATA:1702 BACKGROUND_SKILLS:2319 BACKGROUND_ALIASES:2398 DEITY_ALIGN_LABELS:2411 DEITIES_DATA:2416 LANGUAGE_CATALOG:2484 RACE_LANGUAGES:2521 CLASS_LANGUAGES:2623 TOOL_CATALOG:2629 RACE_TOOLS:2684 CLASS_TOOLS:2696 SUBCLASS_LANGUAGES:2704 SUBCLASS_TOOLS:2727 RACE_ARMOR:2749 RACE_WEAPONS_SPECIFIC:2755 CLASS_WEAPONS_SPECIFIC:2771 RACE_NAME_POOLS:2784 RACE_NAME_GROUP:2826 SUBCLASS_ARMOR:2841 ARMOR_PRESETS:2872 skills:2889 ABILITY_INFO:2902 CLASS_SKILL_OPTIONS:2942 CLASS_SKILL_COUNT:2957 CLASS_SKILL_MC_COUNT:2958 CLASS_ARMOR_PROFS:2961 CLASS_RESOURCES:2981 ASI_LEVELS:3143 XP_THRESHOLDS:3151 APP_VERSION:3161 APP_VERSION_DATE:3162 APP_TELEGRAM_URL:3168 APP_BOOSTY_URL:3169 FEATS_DATA:3190 APP_CHANGELOG:3512 CASTER_TYPE:7420 THIRD_CASTER_SUBCLASSES:7429 THIRD_CASTER_SLOTS:7436 MULTICLASS_SPELL_SLOTS:7447 MULTICLASS_PREREQUISITES:7472 MULTICLASS_PROFICIENCIES:7490 EDITION_DATA:7519

**spells.js** (13330 строк)  
SPELLS_BASE:7

**spell-effects.js** (871 строк)  
SPELL_EFFECTS:71

**class-choices.js** (707 строк)  
FIGHTING_STYLES:10 SORCERER_METAMAGIC:20 WARLOCK_PACT_BOONS:32 WARLOCK_INVOCATIONS:40 FAVORED_ENEMIES:76 FAVORED_TERRAINS:94 CLASS_CHOICES:114 ccModalState:450

**subclass-choices-data.js** (1031 строк)  
BATTLE_MASTER_MANEUVERS:6 HUNTER_PREY:26 HUNTER_DEFENSIVE:32 HUNTER_MULTIATTACK:38 HUNTER_SUPERIOR:43 TOTEM_SPIRIT:50 TOTEM_ASPECT:56 TOTEM_ATTUNEMENT:62 DRACONIC_ANCESTRY:69 ELEMENTAL_DISCIPLINES:83 STORM_HERALD_AURA:103 ARCANE_SHOTS:110 KENSEI_WEAPONS:122 RUNE_KNIGHT_RUNES:134 ARCANA_CANTRIPS:152 ARCANA_MASTERY:153 GIANT_CANTRIPS:164 SUBCLASS_CHOICES:167 SUBCLASS_RESOURCES:419

