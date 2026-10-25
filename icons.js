// ============================================================
// icons.js — линейные SVG-иконки «Дымки» (Lucide-геометрия).
// Vanilla, без зависимостей. Подключать ДО остальных скриптов.
//
//   dndIcon('flame', 16)            → строка '<svg …>…</svg>'
//   dndIcon('flame', 16, 'my-cls')  → с классом
//   CONDITION_META['Отравлен']      → { ico:'flask', color:'var(--necro)' }
//   SCHOOL_META['Эвокация']         → { ico:'flame', color:'var(--danger)' }
//
// stroke = currentColor: цвет задаётся через color родителя или --sc.
// ============================================================
(function () {
  'use strict';

  var DND_ICON_PATHS = {
    // навигация
    sheet: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
    spells: '<path d="M9.94 14.06A2 2 0 0 0 8.5 12.62L2.37 11.04a.5.5 0 0 1 0-.96L8.5 8.5a2 2 0 0 0 1.44-1.44l1.58-6.13a.5.5 0 0 1 .96 0L14.06 7.06A2 2 0 0 0 15.5 8.5l6.13 1.58a.5.5 0 0 1 0 .96L15.5 12.62a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    inventory: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    combat: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
    notes: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.4 2.6a1 1 0 0 1 3 3l-9 9a2 2 0 0 1-.85.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.85z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    // STYLE-7: одиночная фигура — набору её не хватало (NPC, «Внешность» в записях)
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
    // статы
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    star: '<path d="M11.5 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.75a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .29-.9l5.17-.76a2.12 2.12 0 0 0 1.6-1.16z"/>',
    sparkle: '<path d="M9.94 14.06A2 2 0 0 0 8.5 12.62L2.37 11.04a.5.5 0 0 1 0-.96L8.5 8.5a2 2 0 0 0 1.44-1.44l1.58-6.13a.5.5 0 0 1 .96 0L14.06 7.06A2 2 0 0 0 15.5 8.5l6.13 1.58a.5.5 0 0 1 0 .96L15.5 12.62a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/>',
    d20: '<path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7z"/><path d="M12 6.6 17.4 15.9H6.6z"/><path d="M12 6.6 12 2.2"/><path d="M6.6 15.9 3.5 17"/><path d="M17.4 15.9 20.5 17"/>',
    sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/>',
    // действия
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    wand: '<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>',
    // Флаг развёртки дуги = 1: лук выгнут В СТОРОНУ полёта стрелы. При 0 (было)
    // стрела вылетала через вогнутую сторону — физически наоборот.
    bow: '<path d="M17 3h4v4"/><path d="M21 3 3 21"/><path d="M3 3a17 17 0 0 1 18 18"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    cross: '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z"/>',
    scroll: '<path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    wolf: '<path d="M12 2 9 6H4l2 5-2 5h5l3 4 3-4h5l-2-5 2-5h-5z"/><circle cx="9.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="11" r="1" fill="currentColor" stroke="none"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    import: '<path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/>',
    // новые
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    phone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    more: '<circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    grad: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    // состояния
    focus: '<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
    eyeOff: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    ghost: '<path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>',
    skull: '<path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="12" r="1"/>',
    dizzy: '<circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10.4 21.9a10 10 0 0 0 9.941-15.416"/><path d="M13.5 2.1a10 10 0 0 0-9.841 15.416"/>',
    flask: '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
    zapOff: '<path d="M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317"/><path d="M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773"/><path d="M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643"/><path d="m2 2 20 20"/>',
    dashed: '<path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/>',
    fall: '<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/>',
    charm: '<circle cx="12" cy="12" r="9"/><path d="M12 12a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0"/>',
    // школы магии
    summon: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    // STYLE-7a: подписи кнопок хрома (данные/отдых/инвентарь/экспорт)
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
    upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
    save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
    archive: '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    trend: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    coffee: '<path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/><path d="M17 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12a4 4 0 1 1 0 8h-1"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    edit: '<path d="M21.17 6.81a1 1 0 0 0-3.98-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/>',
    printer: '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    scale: '<path d="M12 3v18"/><path d="M7 21h10"/><path d="M5 7h14"/><path d="m5 7-3 6a3 3 0 0 0 6 0z"/><path d="m19 7 3 6a3 3 0 0 1-6 0z"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    bookOpen: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    // STYLE-7b: шапки секций настроек, подписи полей, примечания
    type: '<path d="M4 7V5h16v2"/><path d="M9 20h6"/><path d="M12 5v15"/>',
    contrast: '<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12z" fill="currentColor" stroke="none"/>',
    pin: '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-3 9v11"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    // STYLE-7c: разметка из app-*.js — пустые состояния, бейджи, трекер боя
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    mapPin: '<path d="M20 10c0 4.99-5.06 10.44-7.06 12.4a1.3 1.3 0 0 1-1.88 0C9.06 20.44 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    hourglass: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/><path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    ruler: '<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>',
    // РД-14: глифы для замены эмодзи
    paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    mask: '<path d="M18 11c-1.5 0-2.5.5-3 2"/><path d="M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z"/><path d="M6 11c1.5 0 2.5.5 3 2"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    tree: '<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>',
    wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
    feather: '<path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    frown: '<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    hammer: '<path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>',
    snow: '<path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>',
  };

  function dndIcon(name, size, cls) {
    var d = DND_ICON_PATHS[name];
    if (!d) return '';
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      (cls ? ' class="' + cls + '"' : '') +
      ' style="flex-shrink:0;display:block" aria-hidden="true">' + d + '</svg>';
  }

  // STYLE-7c: иконка вместе с обёрткой .dico — для разметки, собираемой в JS.
  function dndIcoHtml(name, size) {
    var svg = dndIcon(name, size || 14);
    return svg ? '<span class="dico">' + svg + '</span>' : '';
  }

  // --- Состояния D&D 5e (2014): иконка + цвет ---
  var CONDITION_META = {
    'Концентрация':  { ico: 'focus',  color: 'var(--accent)' },
    'Ослеплён':      { ico: 'eyeOff', color: 'var(--text-dim)' },
    'Очарован':      { ico: 'charm',  color: 'var(--charm)' },
    'Оглушён':       { ico: 'dizzy',  color: 'var(--info)' },
    'Отравлен':      { ico: 'flask',  color: 'var(--necro)' },
    'Испуган':       { ico: 'ghost',  color: 'var(--magic)' },
    'Сбит с ног':    { ico: 'fall',   color: 'var(--danger)' },
    'Невидим':       { ico: 'dashed', color: 'var(--text-mute)' },
    'Парализован':   { ico: 'zapOff', color: 'var(--divin)' },
    // расширение на полный список 5e:
    'Схвачен':       { ico: 'lock',   color: 'var(--danger)' },
    'Опутан':        { ico: 'lock',   color: 'var(--necro)' },
    'Глух':          { ico: 'x',      color: 'var(--text-dim)' },
    'Недееспособен': { ico: 'alert',  color: 'var(--danger)' },
    'Окаменел':      { ico: 'shield', color: 'var(--text-mute)' },
    'Ошеломлён':     { ico: 'dizzy',  color: 'var(--magic)' },
    'Без сознания':  { ico: 'moon',   color: 'var(--text-mute)' },
    'Истощение':     { ico: 'drop',   color: 'var(--danger)' },
  };

  // --- Школы магии: иконка + цвет ---
  var SCHOOL_META = {
    'Эвокация':        { ico: 'flame',  color: 'var(--danger)' },
    'Воплощение':      { ico: 'flame',  color: 'var(--danger)' },  // синоним
    'Вызов':           { ico: 'summon', color: 'var(--info)' },
    'Иллюзия':         { ico: 'layers', color: 'var(--magic)' },
    'Ограждение':      { ico: 'shield', color: 'var(--success)' },
    'Некромантия':     { ico: 'skull',  color: 'var(--necro)' },
    'Очарование':      { ico: 'charm',  color: 'var(--charm)' },
    'Преобразование':  { ico: 'atom',   color: 'var(--accent)' },
    'Прорицание':      { ico: 'eye',    color: 'var(--divin)' },
  };

  // --- РД-9: пресеты иконок слотов быстрого доступа ---
  // Двухтонные: class="f" — заливка цветом пресета (прозрачность в CSS), остальное — контур.
  var QS_ICON_PRESETS = {
    spell: [
      { id: 'fire',      name: 'Огонь',    color: 'var(--danger)', d: '<path class="f" d="M12 2.5c1.2 3.2 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.3 1-3.9 2.3-5 0 1.7.8 2.8 2.1 3.3-.2-3.2.1-5.9 1.1-8.8z"/><path d="M12 21a2.4 2.4 0 0 1-2.4-2.4c0-1.6 1.4-2.6 2.4-4.1 1 1.5 2.4 2.5 2.4 4.1A2.4 2.4 0 0 1 12 21z"/>' },
      { id: 'frost',     name: 'Лёд',      color: 'var(--info)',   d: '<path class="f" d="M12 2l4.5 7.5L12 22 7.5 9.5z"/><path d="M7.5 9.5h9M12 2v20"/><path d="M4 4.5l2 2M6 4.5l-2 2M18.5 16l2 2M20.5 16l-2 2"/>' },
      { id: 'lightning', name: 'Молния',   color: 'var(--divin)',  d: '<path class="f" d="M13.5 2 4.5 13.5h6.5L9.5 22l10-12.5h-6.5z"/>' },
      { id: 'heal',      name: 'Лечение',  color: 'var(--success)', d: '<path class="f" d="M12 20.5s-8-4.7-8-10.8a4.4 4.4 0 0 1 8-2.6 4.4 4.4 0 0 1 8 2.6c0 6.1-8 10.8-8 10.8z"/><path d="M12 9.5v5.5M9.25 12.25h5.5"/>' },
      { id: 'shield',    name: 'Защита',   color: 'var(--accent-ink)', d: '<path class="f" d="M12 2.5 4.5 5.5v6c0 4.8 3.2 8.4 7.5 10 4.3-1.6 7.5-5.2 7.5-10v-6z"/><path d="M12 6.5v11M8 10.5l4-4 4 4"/>' },
      { id: 'arrows',    name: 'Стрелы',   color: 'var(--magic)',  d: '<path class="f" d="M10 3.5h5.5V9zM13 7.5h5.5V13zM16 11.5h5.5V17z"/><path d="M3 14.5l11-11M6 18.5l11-11M9 22.5l11-11"/>' },
      { id: 'dark',      name: 'Тьма',     color: 'var(--necro)',  d: '<path class="f" d="M19.5 15A8.5 8.5 0 1 1 9 3.5a7 7 0 0 0 10.5 11.5z"/><path d="M17 3.5v3M15.5 5h3M20.5 8.5v2M19.5 9.5h2"/>' },
      { id: 'nature',    name: 'Природа',  color: 'var(--success)', d: '<path class="f" d="M5 20.5C5 11.5 10 5 20 4c-.8 10-7 15.6-15 16.5z"/><path d="M3.5 22 14 11.5M9 16.5h4.5M9 16.5V12"/>' }
    ],
    item: [
      { id: 'potion-heal', name: 'Зелье лечения', color: 'var(--danger)', d: '<path class="f" d="M6.1 14a6 6 0 0 0 11.8 0z"/><path d="M10.5 3v4.6a6.5 6.5 0 1 0 3 0V3M9.5 3h5"/>' },
      { id: 'potion-mana', name: 'Зелье',         color: 'var(--info)',   d: '<path class="f" d="M6.1 14a6 6 0 0 0 11.8 0z"/><path d="M10.5 3v4.6a6.5 6.5 0 1 0 3 0V3M9.5 3h5"/><path d="M15.5 11.5h.01"/>' },
      { id: 'poison',      name: 'Яд',            color: 'var(--necro)',  d: '<path class="f" d="M7.5 14h9v6a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 20z"/><path d="M9 2.5h6M10 2.5v4.5l-2.5 3.5v9.5A1.5 1.5 0 0 0 9 21.5h6a1.5 1.5 0 0 0 1.5-1.5v-9.5L14 7V2.5"/><path d="M10.5 17.5h.01M13.5 17.5h.01"/>' },
      { id: 'elixir',      name: 'Эликсир',       color: 'var(--magic)',  d: '<path class="f" d="M10 12h4v7a2 2 0 0 1-4 0z"/><path d="M9 2.5h6M10 2.5V19a2 2 0 0 0 4 0V2.5"/><path d="M17.5 6l1.5 1.5M19 6l-1.5 1.5M5 10l1.5 1.5M6.5 10 5 11.5"/>' },
      { id: 'holy-water',  name: 'Святая вода',   color: 'var(--divin)',  d: '<path class="f" d="M12 3c3 4 6 7.2 6 11a6 6 0 0 1-12 0c0-3.8 3-7 6-11z"/><path d="M12 10.5v7M9.5 13h5"/>' },
      { id: 'alch-fire',   name: 'Алхимический огонь', color: 'var(--accent)', d: '<path class="f" d="M6.1 15a6 6 0 0 0 11.8 0z"/><path d="M10.5 8v.6a6.5 6.5 0 1 0 3 0V8M9.5 8h5"/><path d="M12 6c-1.2-1.2-1-2.6 0-4 1 1.4 1.2 2.8 0 4z"/>' },
      { id: 'oil',         name: 'Масло',         color: 'var(--divin)',  d: '<path class="f" d="M5.2 14a6.8 6.8 0 0 0 13.6 0z"/><path d="M9.5 3h5M10 3v3.2C7 7.3 5 9.8 5 13a7 7 0 0 0 14 0c0-3.2-2-5.7-5-6.8V3"/><path d="M19 10.5c1.5 0 2.5 1 2.5 2.5S20.5 15.5 19 15.5"/>' },
      { id: 'scroll',      name: 'Свиток',        color: 'var(--accent-ink)', d: '<path class="f" d="M7 6.5h11v12a2 2 0 0 1-2 2H6"/><path d="M5.5 3.5H16a2 2 0 0 1 0 4H5.5a2 2 0 0 1 0-4zM6 20.5a2 2 0 0 1-2-2V5.5M10 11.5h5M10 14.5h5"/>' },
      { id: 'herb',        name: 'Трава',         color: 'var(--success)', d: '<path class="f" d="M12 21c0-5 1.5-9 6.5-11-1 5-3 8.5-6.5 11zM12 15c-.5-4-2.5-6.5-6.5-7.5.5 4 2.5 6.5 6.5 7.5z"/><path d="M12 21.5V5M12 5c-1-1-1-2 0-3 1 1 1 2 0 3z"/>' },
      { id: 'gem',         name: 'Самоцвет',      color: 'var(--magic)',  d: '<path class="f" d="M2.5 9.5 12 21l9.5-11.5z"/><path d="M6.5 3.5h11l4 6L12 21 2.5 9.5zM2.5 9.5h19M9.5 3.5 8 9.5 12 21l4-11.5-1.5-6"/>' },
      { id: 'ration',      name: 'Рацион',        color: 'var(--accent)', d: '<path class="f" d="M4 12a8 5.5 0 0 1 16 0v6.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8.5 8.5l1.5 3M12 7.5v3.5M15.5 8.5 14 11.5"/>' },
      { id: 'torch',       name: 'Факел',         color: 'var(--accent)', d: '<path class="f" d="M12 2.5c2 2.5 3.5 4 3.5 6.2a3.5 3.5 0 0 1-7 0c0-1.3.8-2.3 1.6-3 .2 1 .7 1.6 1.4 2 0-2 0-3.5.5-5.2z"/><path d="M9.5 12.5h5l-1.5 9h-2z"/>' }
    ]
  };
  var _qsIconIndex = {};
  QS_ICON_PRESETS.spell.concat(QS_ICON_PRESETS.item).forEach(function (p) { _qsIconIndex[p.id] = p; });
  function qsIconPreset(id) { return _qsIconIndex[id] || null; }
  // плитка иконки слота: id пресета или data:-картинка (своя, ~96 px)
  function qsIconHtml(icon, size) {
    size = size || 24;
    var box = 'width:' + size + 'px;height:' + size + 'px';
    if (typeof icon === 'string' && icon.indexOf('data:image/') === 0) {
      return '<span class="qsi qsi-img" style="' + box + '"><img src="' + icon + '" alt="" width="' + size + '" height="' + size + '"></span>';
    }
    var p = _qsIconIndex[icon] || _qsIconIndex.fire;
    var s = Math.round(size * 0.72);
    return '<span class="qsi" style="' + box + ';--qc:' + p.color + '" aria-hidden="true"><svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + p.d + '</svg></span>';
  }

  // --- РД-14: эмодзи → линейная иконка, одним проходом по DOM в режиме ?rd=1 ---
  // Данные и разметку не трогаем: текстовый узел с эмодзи заменяется на иконку при показе.
  // В <option>, подписях optgroup, placeholder/title/aria-label SVG не вставить — эмодзи убираются.
  // Пользовательский ввод (input, textarea, contenteditable) не трогаем.
  var EMOJI_ICON = {};
  (function (groups) {
    for (var ico in groups) {
      var list = groups[ico].split(' ');
      for (var i = 0; i < list.length; i++) EMOJI_ICON[list[i]] = ico;
    }
  })({
    combat: '⚔ 🤜 👊 🥊 🥋', sword: '🗡 🪓 ⛏', shield: '🛡 🔰 🗿', sparkle: '✨ 🌟 💫 🎉 🎆 ✦ 🌈', dice: '🎲', zap: '⚡ 💥 💪 ⛈',
    skull: '💀 ☠ ⚰ 🪦 😈 👿 👹', book: '📖 📕 📘 📚', hourglass: '⏳ ⌛', target: '🎯 ⭕', spells: '🔮', wand: '🪄',
    inventory: '🎒 📦 👝', leaf: '🌿 🍀 🌱 🌾 🍄', search: '🔍 🕵', paw: '🐾 🐴 🐙 🐲 🐉 🦑 🕷 🐢 🦠 🐛 🐱 🦇 🐸 🦎 🐀 🦦 🐍 🦀 🦁 🦴 🕸 👾 🐻',
    eye: '👁 🪞', sheet: '📋 🪪', mask: '🎭 🎩', notes: '📝 ✏', lock: '🔒 ⛓ 🗝', unlock: '🔓', scroll: '📜', moon: '🌑 🌙 🌕 💤 🛌 🌌',
    alert: '⚠ ❗ ❕', bow: '🏹', frown: '😫 😡 😨 😵', compass: '🧭 🛞', settings: '⚙ 🔩', trend: '📈', grad: '🎓 🧙 🧝',
    heart: '❤ 💚 💔 💕 💛 ♥ 🩸', wolf: '🐺', wrench: '🔧 ⚒ 🛠', cross: '✝ ⛪ 🙏', check: '✅ ☑ ✔', reset: '🔁 🔄 ➿',
    sun: '☀ 🌅 🔆', map: '🗺 🌍', music: '🎵 🎶 🎤', feather: '🧚 🕊 🦅 🦉 🐦 🪽', flame: '🔥 🪔 🕯', drop: '💧 🧪 ⚗',
    help: '❓ ❔', bed: '🛏', download: '📥', upload: '📤', save: '💾', user: '👤 🧑 🧘', users: '👥', inventory: '🧥 👟',
    link: '🔗 🪢', file: '📄', home: '🏠 🏛 🏺 🌆', star: '★ ⭐', ghost: '👻 🫥', dashed: '🌀 🕳', menu: '☰', printer: '🖨',
    trash: '🗑', bulb: '💡 🧠', wind: '💨 🌪 🌫', tree: '🌳 🌲 🪵', smile: '😇', clock: '🕐 ⏱ ⏰', calendar: '📅', fish: '🐟 🐠 🌊',
    gem: '💎', crown: '👑 🏆', hand: '✋ 🖐', rocket: '🚀', hammer: '🔨', snow: '🧊 ❄', scale: '⚖', mountain: '🗻 ⛰', cloud: '☁',
    eyeOff: '🙈', ban: '🚫', coffee: '☕ 🍺', food: '🍴', coins: '💰 🪙', folder: '📁 📂', archive: '🗄', pin: '📌 📍',
    chat: '💬', palette: '🎨', monitor: '🖥 🪟 🤖', phone: '📱 📲', ruler: '📐 📏', type: '🔤', x: '✖ ❌ 🔇', plus: '➕', minus: '➖',
    charm: '💖 💘', mapPin: '⚓', inbox: '🛒', atom: '🧲', arrowRight: '🏃', d20: '🟡 ⚪ 🟤 🔵 🟣 🟢 🔴 🟠 ⬛'
  });

  // Пиктограммы от U+2300: ниже — стрелки и геометрия (↔ ▶ ◆), это не эмодзи.
  var EMOJI_RE = /(?:[⌀-⟿⤀-⯿〰〽㊗㊙]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[︎️]?(?:\uD83C[\uDFFB-\uDFFF])?(?:‍(?:[⌀-⟿]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[️]?)*/g;
  // Эмодзи — всё вне BMP, всё с FE0F и знакомые по карте; прочие значки (✓ ✕ ◆ ⌫) остаются текстом.
  var EMOJI_TEST = new RegExp(EMOJI_RE.source);

  function _emoBase(m) { return m.replace(/[︎️]|\uD83C[\uDFFB-\uDFFF]/g, '').split('‍')[0]; }
  function _isEmoji(m) { return m.length > 1 || m.charCodeAt(0) >= 0xD800 || !!EMOJI_ICON[m]; }
  function stripEmoji(s) {
    return s.replace(EMOJI_RE, function (m) { return _isEmoji(m) ? '' : m; }).replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
  }
  function emojiIconSvg(m) {
    var name = EMOJI_ICON[_emoBase(m)];
    var d = name && DND_ICON_PATHS[name];
    if (!d) return null;
    return '<svg class="rd-emo" width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  var _SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SVG: 1, svg: 1, CANVAS: 1, NOSCRIPT: 1, TITLE: 1 };
  var _ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'label', 'data-tip', 'data-tooltip'];
  var _tpl = null;

  function _skipEl(el) {
    for (; el && el.nodeType === 1; el = el.parentNode) {
      if (_SKIP_TAGS[el.tagName] || el.isContentEditable || el.hasAttribute('data-keep-emoji')) return true;
    }
    return false;
  }
  function _fixText(node) {
    var s = node.nodeValue;
    if (!s || !EMOJI_TEST.test(s)) return;
    var p = node.parentNode;
    if (!p || _skipEl(p)) return;
    // В option/optgroup SVG не отрисуется — только убрать
    if (p.tagName === 'OPTION' || p.tagName === 'OPTGROUP') { node.nodeValue = stripEmoji(s); return; }
    var html = '', plain = '', last = 0, hasSvg = false, changed = false, m;
    EMOJI_RE.lastIndex = 0;
    while ((m = EMOJI_RE.exec(s))) {
      if (!_isEmoji(m[0])) continue;
      var svg = emojiIconSvg(m[0]);
      html += _esc(s.slice(last, m.index)) + (svg || '');
      plain += s.slice(last, m.index);
      if (svg) hasSvg = true;
      last = m.index + m[0].length;
      changed = true;
    }
    if (!changed) return;
    html += _esc(s.slice(last));
    plain += s.slice(last);
    if (!hasSvg) {
      // эмодзи без глифа убирается; если элемент остался бы пустым — общий значок
      if (plain.trim() || p.textContent.trim() !== s.trim()) { node.nodeValue = plain.replace(/^\s+/, ''); return; }
      html = emojiIconSvg('✨');
    }
    _tpl = _tpl || document.createElement('template');
    _tpl.innerHTML = html;
    p.replaceChild(_tpl.content, node);
  }
  function _esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function _fixAttrs(el) {
    if (el.tagName === 'svg' || el.tagName === 'SVG') return;
    for (var i = 0; i < _ATTRS.length; i++) {
      var v = el.getAttribute(_ATTRS[i]);
      if (v && EMOJI_TEST.test(v)) { var nv = stripEmoji(v); if (nv !== v) el.setAttribute(_ATTRS[i], nv); }
    }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && EMOJI_TEST.test(el.value)) el.value = stripEmoji(el.value);
  }
  function deEmojiTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { _fixText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (_skipEl(root)) return; _fixAttrs(root); }
    var w = document.createTreeWalker(root, 5 /* ELEMENT | TEXT */, null), n, texts = [];
    while ((n = w.nextNode())) {
      if (n.nodeType === 1) {
        if (n.hasAttribute('placeholder') || n.hasAttribute('title') || n.hasAttribute('aria-label') || n.hasAttribute('label') || n.tagName === 'INPUT') _fixAttrs(n);
      } else if (EMOJI_TEST.test(n.nodeValue)) texts.push(n);
    }
    for (var i = 0; i < texts.length; i++) _fixText(texts[i]);
  }

  var _queue = [], _scheduled = false;
  function _flush() {
    _scheduled = false;
    var q = _queue; _queue = [];
    for (var i = 0; i < q.length; i++) if (q[i].isConnected) deEmojiTree(q[i]);
  }
  function startEmojiIcons() {
    if (startEmojiIcons._on) return;
    startEmojiIcons._on = true;
    deEmojiTree(document.body);
    if (document.title && EMOJI_TEST.test(document.title)) document.title = stripEmoji(document.title);
    if (typeof MutationObserver !== 'function') return;
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var mu = muts[i];
        if (mu.type === 'childList') { for (var j = 0; j < mu.addedNodes.length; j++) _queue.push(mu.addedNodes[j]); }
        else if (mu.type === 'characterData') _queue.push(mu.target);
        else _queue.push(mu.target);
      }
      // синхронно до кадра: microtask, чтобы эмодзи не мигали
      if (!_scheduled && _queue.length) { _scheduled = true; Promise.resolve().then(_flush); }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: _ATTRS });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startEmojiIcons);
  else startEmojiIcons();

  window.stripEmoji = stripEmoji;
  window.deEmojiTree = deEmojiTree;
  window.startEmojiIcons = startEmojiIcons;
  window.QS_ICON_PRESETS = QS_ICON_PRESETS;
  window.qsIconPreset = qsIconPreset;
  window.qsIconHtml = qsIconHtml;
  window.DND_ICON_PATHS = DND_ICON_PATHS;
  window.dndIcon = dndIcon;
  window.dndIcoHtml = dndIcoHtml;
  window.CONDITION_META = CONDITION_META;
  window.SCHOOL_META = SCHOOL_META;
})();
