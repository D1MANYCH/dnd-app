// ============================================================
// app-backup.js — DATA-2: авто-бэкап в IndexedDB
// Снапшот = конверт _buildExportPayload() (app-core.js), глубокая
// копия состояния на момент вызова. Триггеры: старт приложения
// (не чаще 1 раза в календарный день), перед импортом «Заменить
// всё» (importData в app-core.js), ручная кнопка. Ротация:
// хранится BACKUP_KEEP последних снапшотов.
// Восстановление идёт существующим путём импорта:
// _extractCharsFromImport → _isValidImportedChar → _applyFullRestore.
// ============================================================

var BACKUP_DB_NAME = "dnd-backups";
var BACKUP_STORE = "snapshots";
var BACKUP_KEEP = 7;
var BACKUP_DAY_KEY = "dnd_backup_day";

var BACKUP_REASON_LABELS = {
  "auto": "авто",
  "pre-import": "перед импортом",
  "pre-restore": "перед восстановлением",
  "manual": "вручную"
};

function _backupLog(level, msg, data) {
  if (window.AppLog && AppLog[level]) AppLog[level]("backup", msg, data);
}

function _backupOpenDb() {
  return new Promise(function(resolve, reject) {
    if (typeof indexedDB === "undefined") { reject(new Error("IndexedDB недоступен")); return; }
    var req = indexedDB.open(BACKUP_DB_NAME, 1);
    req.onupgradeneeded = function() {
      var db = req.result;
      if (!db.objectStoreNames.contains(BACKUP_STORE)) {
        db.createObjectStore(BACKUP_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function() { reject(req.error || new Error("indexedDB.open: ошибка")); };
  });
}

// Все снапшоты, новые сверху.
function listBackupSnapshots() {
  return _backupOpenDb().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(BACKUP_STORE, "readonly");
      var req = tx.objectStore(BACKUP_STORE).getAll();
      req.onsuccess = function() {
        var rows = req.result || [];
        rows.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
        resolve(rows);
      };
      req.onerror = function() { reject(req.error); };
      tx.oncomplete = function() { db.close(); };
    });
  });
}

// reason: 'auto' | 'pre-import' | 'pre-restore' | 'manual'.
// Resolve: true — записан, null — пустое состояние (снапшот не нужен,
// чтобы ротация не вытесняла полезные копии пустыми).
function createBackupSnapshot(reason) {
  var snap;
  try {
    snap = JSON.parse(JSON.stringify(_buildExportPayload()));
  } catch (e) {
    _backupLog("error", "не удалось построить снапшот: " + ((e && e.message) || e));
    return Promise.reject(e);
  }
  if ((!snap.characters || !snap.characters.length) && (!snap.userSpells || !snap.userSpells.length)) {
    return Promise.resolve(null);
  }
  return _backupOpenDb().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(BACKUP_STORE, "readwrite");
      var store = tx.objectStore(BACKUP_STORE);
      store.add({
        createdAt: Date.now(),
        reason: reason || "manual",
        charCount: snap.characters.length,
        payload: snap
      });
      // Ротация в той же транзакции: всё старше BACKUP_KEEP последних — удалить
      var all = store.getAll();
      all.onsuccess = function() {
        var rows = all.result || [];
        if (rows.length > BACKUP_KEEP) {
          rows.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
          rows.slice(BACKUP_KEEP).forEach(function(r) { store.delete(r.id); });
        }
      };
      tx.oncomplete = function() {
        db.close();
        _backupLog("info", "снапшот создан (" + (reason || "manual") + "), персонажей: " + snap.characters.length);
        resolve(true);
      };
      tx.onerror = function() { db.close(); reject(tx.error); };
      tx.onabort = function() { db.close(); reject(tx.error || new Error("transaction abort")); };
    });
  });
}

// Авто-снапшот на старте — не чаще 1 раза в календарный (локальный) день
function initAutoBackup() {
  try {
    var d = new Date();
    var today = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var last = null;
    try { last = localStorage.getItem(BACKUP_DAY_KEY); } catch (e) {}
    if (last === today) return;
    createBackupSnapshot("auto").then(function(res) {
      if (res === null) return; // пустое состояние: ключ не ставим — попробуем при следующем старте
      try { localStorage.setItem(BACKUP_DAY_KEY, today); } catch (e) {}
    }).catch(function(e) {
      _backupLog("warn", "авто-снапшот не записан: " + ((e && e.message) || e));
    });
  } catch (e) { window.__catchLog && window.__catchLog("backup:init", e); }
}

function restoreBackupSnapshot(id) {
  listBackupSnapshots().then(function(rows) {
    var row = null;
    for (var i = 0; i < rows.length; i++) { if (rows[i].id === id) { row = rows[i]; break; } }
    if (!row || !row.payload) { showToast("Копия не найдена", "error"); return; }
    var chars = _extractCharsFromImport(row.payload);
    var valid = (chars || []).filter(_isValidImportedChar);
    if (!valid.length) { showToast("В копии нет валидных персонажей", "error"); return; }
    showConfirmModal("Восстановление копии",
      "Восстановить " + valid.length + " персонаж(а/ей) из копии от " + _backupFmtDate(row.createdAt) + "? Все текущие данные будут заменены.",
      function() {
        // Текущее состояние тоже страхуем — восстановление так же разрушительно, как импорт
        var pre;
        try { pre = createBackupSnapshot("pre-restore").catch(function() {}); } catch (e) { pre = null; }
        _applyFullRestore(row.payload, valid);
        _backupLog("action", "восстановлен снапшот #" + id + " от " + _backupFmtDate(row.createdAt), { chars: valid.length });
        showToast("Восстановлено: " + valid.length, "success");
        (pre || Promise.resolve()).then(renderBackupList);
      }, "Восстановить", { icon: "🗄" });
  }).catch(function(e) {
    _backupLog("error", "restore: " + ((e && e.message) || e));
    showToast("Не удалось прочитать копию", "error");
  });
}

function createBackupNow() {
  createBackupSnapshot("manual").then(function(res) {
    if (res === null) { showToast("Нечего сохранять — список персонажей пуст", "warn"); return; }
    showToast("Резервная копия создана", "success");
    renderBackupList();
  }).catch(function(e) {
    _backupLog("error", "manual: " + ((e && e.message) || e));
    showToast("Не удалось создать копию", "error");
  });
}

// ---------- UI (панель на экране персонажей, index.html) ----------

function _backupFmtDate(ts) {
  try {
    return new Date(ts).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (e) { return String(ts); }
}

function toggleBackupPanel() {
  var panel = $("backup-panel");
  if (!panel) return;
  if (!panel.hidden) { panel.hidden = true; return; }
  panel.hidden = false;
  renderBackupList();
}

function renderBackupList() {
  var panel = $("backup-panel");
  var list = $("backup-list");
  if (!panel || !list || panel.hidden) return;
  list.innerHTML = "";
  listBackupSnapshots().then(function(rows) {
    if (!rows.length) {
      list.innerHTML = '<div style="font-size:0.8em;color:var(--text-muted);padding:4px 0">Пока нет ни одной копии</div>';
      return;
    }
    rows.forEach(function(row) {
      var item = document.createElement("div");
      item.style.cssText = "display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border-soft)";
      var info = document.createElement("div");
      info.style.cssText = "flex:1;min-width:0;font-size:0.85em";
      var line1 = document.createElement("div");
      line1.textContent = _backupFmtDate(row.createdAt);
      var line2 = document.createElement("div");
      line2.style.cssText = "font-size:0.85em;color:var(--text-muted)";
      line2.textContent = "Персонажей: " + (row.charCount != null ? row.charCount : "?") + " · " + (BACKUP_REASON_LABELS[row.reason] || row.reason || "—");
      info.appendChild(line1);
      info.appendChild(line2);
      var btn = document.createElement("button");
      btn.className = "secondary";
      btn.style.cssText = "width:auto;margin:0;padding:6px 10px;font-size:0.8em;flex-shrink:0;min-height:var(--control-h,44px)";
      btn.textContent = "Восстановить";
      btn.onclick = function() { restoreBackupSnapshot(row.id); };
      item.appendChild(info);
      item.appendChild(btn);
      list.appendChild(item);
    });
  }).catch(function(e) {
    _backupLog("error", "list: " + ((e && e.message) || e));
    list.innerHTML = '<div style="font-size:0.8em;color:var(--text-muted);padding:4px 0">Не удалось прочитать копии (IndexedDB недоступен)</div>';
  });
}
