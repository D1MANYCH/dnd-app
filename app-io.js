// ============================================================
// app-io.js — Экспорт и импорт: полный бэкап, отдельный персонаж,
// свои заклинания; валидация и нормализация импортируемых данных
// ============================================================

// DATA-2: построение конверта полного бэкапа — общая точка для exportData()
// и снапшотов app-backup.js. userSpells — только пользовательские заклинания
// (не из базы spells.js), как в saveToLocal().
function _buildExportPayload() {
  var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){ return s.id; }) : []);
  var userSpells = (typeof SPELL_DATABASE !== 'undefined' && Array.isArray(SPELL_DATABASE))
    ? SPELL_DATABASE.filter(function(s){ return !baseIds.has(s.id); }) : [];
  return {
    app: "dnd-sheet",
    appVersion: (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "",
    schemaVersion: (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 0,
    exportedAt: new Date().toISOString(),
    characters: characters,
    hpHistory: (typeof hpHistory !== 'undefined' && Array.isArray(hpHistory)) ? hpHistory : [],
    userSpells: userSpells
  };
}
function exportData() {
// FEAT-1 доработка: полный бэкап — конверт со всеми персонажами И всей
// HP-историей (importData принимает и голый массив, и конверт).
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_buildExportPayload()));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_backup_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
// BUGFIX-3: валидация импорта
var IMPORT_MAX_BYTES = 10 * 1024 * 1024; // 10 МБ — защита от случайного OOM
function _isValidImportedChar(c) {
  if (!c || typeof c !== 'object') return false;
  // Допускаем как одноклассовых (class:string), так и мультикласс (classes:array)
  var hasClass = (typeof c.class === 'string' && c.class) ||
                 (Array.isArray(c.classes) && c.classes.length > 0 &&
                  c.classes.every(function(e){ return e && typeof e.class === 'string' && typeof e.level === 'number'; }));
  var lvl = (typeof c.level === 'number' && c.level >= 1 && c.level <= 20);
  return hasClass && lvl;
}
// HB-7: нормализация импортируемого заклинания. Возвращает пригодную КОПИЮ
// (глубокий клон — чтобы не делить ссылку с mySpells/чужим конвертом) или null.
// Отличие от прежней голой валидации: level вне 0..9 не отбраковывается, а
// клампится (это опечатка автора хомбрю, а не мусор), а отсутствующий/битый
// source чинится на "PH14" — иначе renderSpellSearch падает на .toLowerCase().
function _normalizeImportedSpell(s) {
  if (!s || typeof s !== 'object') return null;
  if (typeof s.name !== 'string' || !s.name) return null;
  if (typeof s.level !== 'number' || !isFinite(s.level)) return null;
  var out;
  try { out = JSON.parse(JSON.stringify(s)); } catch (e) { return null; }
  out.level = Math.max(0, Math.min(9, Math.round(s.level)));
  if (out.source !== "PH14" && out.source !== "PH24") out.source = "PH14";
  return out;
}
// Булев предикат оставлен для совместимости (фильтры прошлых фаз).
function _isValidImportedSpell(s) { return _normalizeImportedSpell(s) !== null; }
// HB-7: хомбрю-заклинания одного персонажа для конверта exportOneCharacter —
// только копии из его mySpells с признаком «своё». Дескриптор hbEffect едет
// вместе с копией, поэтому «Использовать» переживает экспорт-импорт.
function _collectCharUserSpells(char) {
  var out = [], seen = {};
  var list = (char && char.spells && Array.isArray(char.spells.mySpells)) ? char.spells.mySpells : [];
  list.forEach(function(s) {
    if (!s || !s.homebrew) return;
    var key = String(s.id);
    if (seen[key]) return;
    seen[key] = true;
    out.push(s);
  });
  return out;
}
// HB-7: долив хомбрю-заклинаний из конверта в глобальную базу + перепривязка
// ссылок. mySpells везёт копии (каст работает и без базы), но без долива их не
// видно в поиске и нельзя переиспользовать/править. Заклинания клонируются
// (нормализатором), поэтому запись базы не делит ссылку с mySpells персонажа.
// При коллизии id с уже занятой ДРУГОЙ записью — новый id и перепривязка
// mySpells/prepared импортированных персонажей. Возвращает { added, remapped }.
function _ingestImportedUserSpells(rawSpells, targetChars) {
  var res = { added: 0, remapped: 0 };
  if (!Array.isArray(rawSpells) || typeof SPELL_DATABASE === 'undefined' || !Array.isArray(SPELL_DATABASE)) return res;
  var idMap = {};        // oldId -> newId (только при ремапе)
  var addedIds = [];     // финальные id для бэкфилла признака на копиях
  var nextId = Date.now();
  rawSpells.forEach(function(raw) {
    var s = _normalizeImportedSpell(raw);
    if (!s) return;
    s.homebrew = true;
    var oldId = s.id;
    var clash = SPELL_DATABASE.find(function(x) { return x && x.id === oldId; });
    if (clash) {
      // Тот же id уже в базе: если это та же запись (хомбрю с тем же именем) —
      // просто помечаем копию и не дублируем; иначе перевыдаём id.
      if (clash.homebrew && clash.name === s.name) { addedIds.push(oldId); return; }
      while (SPELL_DATABASE.some(function(x){ return x && x.id === nextId; })) nextId++;
      s.id = nextId++;
      if (oldId != null) idMap[oldId] = s.id;
      res.remapped++;
    }
    SPELL_DATABASE.push(s);
    addedIds.push(s.id);
    res.added++;
  });
  if (Object.keys(idMap).length && Array.isArray(targetChars)) {
    targetChars.forEach(function(c) {
      var sp = c && c.spells;
      if (!sp) return;
      if (Array.isArray(sp.mySpells)) sp.mySpells.forEach(function(x) {
        if (x && idMap.hasOwnProperty(x.id)) x.id = idMap[x.id];
      });
      if (Array.isArray(sp.prepared)) sp.prepared = sp.prepared.map(function(pid) {
        return idMap.hasOwnProperty(pid) ? idMap[pid] : pid;
      });
    });
  }
  if (addedIds.length && typeof _backfillHomebrewFlag === 'function' && Array.isArray(targetChars)) {
    _backfillHomebrewFlag(targetChars, new Set(addedIds));
  }
  return res;
}
// FEAT-1: схема-толерантный разбор импорта. Принимает голый массив
// [char,...] (полные бэкапы из exportData) либо обёртку
// { characters:[...], spells?:[...] } (из exportOneCharacter). Иначе null.
function _extractCharsFromImport(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.characters)) return parsed.characters;
  return null;
}
// DATA-2: применение полного бэкапа (конверт exportData / снапшот app-backup.js).
// Заменяет персонажей, HP-историю и пользовательские заклинания. Конверты без
// userSpells (бэкапы до v3.25) текущие заклинания не трогают.
function _applyFullRestore(imported, validChars) {
  characters = validChars.map(migrateCharacter);
  // FEAT-1 доработка: «Заменить всё» сохраняет id персонажей, поэтому
  // HP-историю из конверта восстанавливаем как есть (только для импортируемых).
  if (imported && Array.isArray(imported.hpHistory)) {
    var _ids = {};
    characters.forEach(function(c){ _ids[c.id] = true; });
    hpHistory = imported.hpHistory.filter(function(h){ return h && _ids[h.charId]; }).slice(0, 300);
  }
  if (imported && Array.isArray(imported.userSpells)) {
    // HB-7: через нормализатор — кламп level и фикс source прямо при загрузке.
    var validSpells = imported.userSpells.map(_normalizeImportedSpell).filter(Boolean);
    validSpells.forEach(function(s) { s.homebrew = true; }); // HB-1: тот же бэкфилл, что и в onload
    SPELL_DATABASE = ((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : []).concat(validSpells);
    _backfillHomebrewFlag(characters, new Set(validSpells.map(function(s) { return s && s.id; })));
  }
  saveToLocal();
  renderCharacterList();
}
function importData(input) {
const file = input?.files?.[0];
if (!file) return;
if (file.size > IMPORT_MAX_BYTES) {
  showToast("Файл слишком большой (макс. " + Math.round(IMPORT_MAX_BYTES/1024/1024) + " МБ)", "error");
  input.value = "";
  return;
}
const reader = new FileReader();
reader.onload = function(e) {
let imported;
try {
  imported = JSON.parse(e.target.result);
} catch (err) {
  showToast("Файл повреждён или это не JSON", "error");
  input.value = "";
  return;
}
var importedChars = _extractCharsFromImport(imported);
if (!importedChars) {
  showToast("Неверный формат: ожидался массив или { characters: [...] }", "error");
  input.value = "";
  return;
}
var valid = importedChars.filter(_isValidImportedChar);
var skipped = importedChars.length - valid.length;
if (valid.length === 0) {
  showToast("В файле нет валидных персонажей", "error");
  input.value = "";
  return;
}
var msg = "Загрузить " + valid.length + " персонаж(а/ей)? Все текущие будут заменены.";
if (skipped > 0) msg += " Пропущено повреждённых: " + skipped + ".";
showConfirmModal("Импорт персонажей", msg, function() {
  // DATA-2: страховочный снапшот текущего состояния перед заменой всего.
  // Конверт строится синхронно внутри вызова — фиксирует состояние ДО замены.
  if (typeof createBackupSnapshot === "function") {
    try { createBackupSnapshot("pre-import").catch(function(){}); }
    catch(e) { window.__catchLog && window.__catchLog('core:pre-import-backup', e); }
  }
  _applyFullRestore(imported, valid);
  showToast("Загружено: " + characters.length + (skipped > 0 ? " (пропущено " + skipped + ")" : ""), "success");
});
input.value = "";
};
reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
reader.readAsText(file);
}
// FEAT-1: не разрушающий импорт персонажа(ей). Добавляет в текущий список,
// не затрагивая существующих. Свежие id (защита от коллизий) + миграция схемы.
function importOneCharacter(input) {
const file = input?.files?.[0];
if (!file) return;
if (file.size > IMPORT_MAX_BYTES) {
  showToast("Файл слишком большой (макс. " + Math.round(IMPORT_MAX_BYTES/1024/1024) + " МБ)", "error");
  input.value = "";
  return;
}
const reader = new FileReader();
reader.onload = function(e) {
let parsed;
try {
  parsed = JSON.parse(e.target.result);
} catch (err) {
  showToast("Файл повреждён или это не JSON", "error");
  input.value = "";
  return;
}
var importedChars = _extractCharsFromImport(parsed);
if (!importedChars) {
  showToast("Неверный формат: ожидался массив или { characters: [...] }", "error");
  input.value = "";
  return;
}
var valid = importedChars.filter(_isValidImportedChar);
var skipped = importedChars.length - valid.length;
if (valid.length === 0) {
  showToast("В файле нет валидных персонажей", "error");
  input.value = "";
  return;
}
var msg = "Добавить " + valid.length + " персонаж(а/ей) в список? Текущие не будут затронуты.";
if (skipped > 0) msg += " Пропущено повреждённых: " + skipped + ".";
showConfirmModal("Импорт персонажа", msg, function() {
  var nextId = Date.now();
  var idMap = {};
  var addedChars = [];
  valid.forEach(function(c) {
    var oldId = c.id;
    var nc = migrateCharacter(JSON.parse(JSON.stringify(c)));
    while (characters.some(function(x) { return x.id === nextId; })) nextId++;
    nc.id = nextId++;
    nc.updatedAt = Date.now();
    idMap[oldId] = nc.id;
    characters.push(nc);
    addedChars.push(nc);
  });
  // FEAT-1 доработка: восстановить HP-историю импортированных персонажей,
  // перепривязав записи на новые id (защита от коллизий не ломает связь).
  var addedHp = 0;
  if (parsed && Array.isArray(parsed.hpHistory)) {
    parsed.hpHistory.forEach(function(h) {
      if (!h || typeof h !== 'object') return;
      var mapped = idMap.hasOwnProperty(h.charId) ? idMap[h.charId] : null;
      if (mapped == null && valid.length === 1) mapped = idMap[valid[0].id];
      if (mapped == null) return;
      hpHistory.push({ from: h.from, to: h.to, delta: h.delta, source: h.source, time: h.time, charId: mapped });
      addedHp++;
    });
    if (addedHp && hpHistory.length > 300) hpHistory = hpHistory.slice(0, 300);
  }
  // HB-7: долить хомбрю-заклинания в глобальную базу. Конверт HB-7+ несёт
  // userSpells; для файлов до HB-7 (поля нет) собираем хомбрю из mySpells
  // импортированных — тогда «Использовать» и поиск работают и для старых экспортов.
  var rawUserSpells = (parsed && Array.isArray(parsed.userSpells)) ? parsed.userSpells : null;
  if (!rawUserSpells) {
    var harvested = [], seenSp = {};
    addedChars.forEach(function(c) {
      _collectCharUserSpells(c).forEach(function(s) {
        var key = String(s.id);
        if (!seenSp[key]) { seenSp[key] = true; harvested.push(s); }
      });
    });
    rawUserSpells = harvested;
  }
  var addedSpells = _ingestImportedUserSpells(rawUserSpells, addedChars).added;
  saveToLocal();
  renderCharacterList();
  showToast("Добавлено: " + valid.length + (skipped > 0 ? " (пропущено " + skipped + ")" : "") +
            (addedHp ? " · HP-история: " + addedHp : "") +
            (addedSpells ? " · свои заклинания: " + addedSpells : ""), "success");
});
input.value = "";
};
reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
reader.readAsText(file);
}
function exportSpells() {
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SPELL_DATABASE));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_spells_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
function importSpells(input) {
const file = input?.files?.[0];
if (!file) return;
if (file.size > IMPORT_MAX_BYTES) {
  showToast("Файл слишком большой (макс. " + Math.round(IMPORT_MAX_BYTES/1024/1024) + " МБ)", "error");
  input.value = "";
  return;
}
const reader = new FileReader();
reader.onload = function(e) {
let imported;
try {
  imported = JSON.parse(e.target.result);
} catch (err) {
  showToast("Файл повреждён или это не JSON", "error");
  input.value = "";
  return;
}
if (!Array.isArray(imported)) {
  showToast("Неверный формат: ожидался массив заклинаний", "error");
  input.value = "";
  return;
}
var validSpells = imported.map(_normalizeImportedSpell).filter(Boolean);
var skippedSpells = imported.length - validSpells.length;
if (validSpells.length === 0) {
  showToast("В файле нет валидных заклинаний", "error");
  input.value = "";
  return;
}
// HB-7: больше НЕ затираем базу 719 книжных — доливаем только своё (id не из
// SPELLS_BASE), дедуп по id внутри файла. Файл exportSpells содержит всю базу;
// после фильтра остаётся только пользовательская дельта.
var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){ return s.id; }) : []);
var seenSp = {}, mergeable = [];
validSpells.forEach(function(s) {
  if (baseIds.has(s.id)) return;                 // книжное — уже в базе
  var key = String(s.id);
  if (seenSp[key]) return;                        // дубль внутри файла
  seenSp[key] = true;
  s.homebrew = true;
  mergeable.push(s);
});
if (mergeable.length === 0) {
  showToast("В файле только книжные заклинания — добавлять нечего" +
            (skippedSpells > 0 ? " (пропущено " + skippedSpells + ")" : ""), "info");
  input.value = "";
  return;
}
var msgSp = "Добавить " + mergeable.length + " своих заклинаний к базе? Книжные не затрагиваются.";
if (skippedSpells > 0) msgSp += " Пропущено повреждённых: " + skippedSpells + ".";
showConfirmModal("Импорт заклинаний", msgSp, function() {
  var base = (typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : [];
  // Уже сидящее в базе своё (по id) заменяем свежей версией из файла;
  // остальное пользовательское сохраняем.
  var mergeIds = new Set(mergeable.map(function(s){ return s.id; }));
  var existingUser = SPELL_DATABASE.filter(function(s){ return s && !baseIds.has(s.id) && !mergeIds.has(s.id); });
  SPELL_DATABASE = base.concat(existingUser, mergeable);
  _backfillHomebrewFlag(characters, mergeIds);
  saveToLocal();
  showToast("Добавлено: " + mergeable.length + (skippedSpells > 0 ? " (пропущено " + skippedSpells + ")" : ""), "success");
});
input.value = "";
};
reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
reader.readAsText(file);
}

/**
 * Выгрузить журнал текущей сессии в .txt — чтобы баг-репорт присылали файлом.
 * Сам файл собирает app-log.js (AppLog.download), здесь только строка «Данных»:
 * проверка, что журнал вообще есть, и понятный тост вместо тихого ничего.
 */
function exportSessionLog() {
  if (typeof AppLog === "undefined" || !AppLog || typeof AppLog.download !== "function") {
    showToast("Журнал сессии недоступен", "error");
    return;
  }
  var n = (typeof AppLog.entries === "function") ? AppLog.entries().length : 0;
  if (!n) {
    showToast("Журнал сессии пуст", "info");
    return;
  }
  AppLog.download();
  showToast("Журнал сессии выгружен: " + n + " записей", "success");
}
