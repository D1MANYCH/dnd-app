// SYNC-1/3: вход через Google и синхронизация с файлом в скрытой папке приложения на Диске.
// Включается входом через Google; что хранится — privacy.html.

var SYNC_CLIENT_ID = "756417920081-9s625rqlg5kv9o2rue4q9sp2831koaiu.apps.googleusercontent.com";
var SYNC_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
var SYNC_FILE = "dnd-sync.json";
var SYNC_DATA_KEY = "dnd_sync_state";
var SYNC_DELAY = 5000;
var SYNC_AUTH_KEY = "dnd_sync_auth";
var SYNC_STATE_KEY = "dnd_sync_oauth_state";
var _syncNotice = "";
var _syncStatus = "";
var _syncTimer = null;
var _syncBusy = false;
var _syncAgain = false;
var _syncApplying = false;
var _syncPaused = false;
var _syncCorrupt = false;
var _syncExpiredToast = false;
var _syncDupeChoice;

function _syncLog(level, msg) {
  try { if (window.AppLog && AppLog[level]) AppLog[level]("sync", msg); } catch (e) {}
}

function _syncEnabled() {
  return !!_syncGetAuth() || !!_syncLoadState().lastAt;
}

function _syncRedirectUri() {
  return location.origin + location.pathname.replace(/[^\/]*$/, "");
}

function _syncDevice() {
  var ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/.test(ua)) return "iPhone/iPad";
  if (/Android/.test(ua)) return "Android";
  return "ПК";
}

function _syncGetAuth() {
  try {
    var a = JSON.parse(localStorage.getItem(SYNC_AUTH_KEY) || "null");
    return a && a.token ? a : null;
  } catch (e) { return null; }
}

function _syncSetAuth(a) {
  try {
    if (a) localStorage.setItem(SYNC_AUTH_KEY, JSON.stringify(a));
    else localStorage.removeItem(SYNC_AUTH_KEY);
  } catch (e) {}
}

function _syncTokenValid(a) {
  return !!(a && a.token && a.exp > Date.now() + 30000);
}

function syncSignIn() {
  var state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  try { localStorage.setItem(SYNC_STATE_KEY, state); } catch (e) {}
  var params = {
    client_id: SYNC_CLIENT_ID,
    redirect_uri: _syncRedirectUri(),
    response_type: "token",
    scope: SYNC_SCOPE,
    include_granted_scopes: "true",
    state: state
  };
  var q = Object.keys(params).map(function(k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
  location.href = "https://accounts.google.com/o/oauth2/v2/auth?" + q;
}

function syncSignOut() {
  var a = _syncGetAuth();
  _syncSetAuth(null);
  _syncNotice = "";
  if (a && a.token) {
    fetch("https://oauth2.googleapis.com/revoke?token=" + encodeURIComponent(a.token), { method: "POST" }).catch(function() {});
  }
  renderSyncRow();
  showToast("Вы вышли из Google", "info");
}

function syncTurnOff() {
  showConfirmModal("Выключить синхронизацию?",
    "Файл синхронизации будет удалён с Google Диска, вход на этом устройстве отменён. Персонажи на устройствах останутся. Если другое устройство ещё входит в Google, оно создаст файл заново — выключите синхронизацию и там.",
    function() {
      _driveFind(SYNC_FILE).then(function(f) {
        return f ? _driveFetch("https://www.googleapis.com/drive/v3/files/" + f.id, { method: "DELETE" }) : null;
      }).then(function() {
        clearTimeout(_syncTimer);
        _syncTimer = null;
        _syncStatus = "";
        _syncCorrupt = false;
        _syncSaveState({ base: null, tombstones: _syncLoadState().tombstones, lastAt: 0 });
        syncSignOut();
        showToast("Синхронизация выключена, файл на Диске удалён", "success");
      }).catch(function(e) {
        showToast(e && e.auth ? "Срок входа истёк — войдите снова и повторите" : "Не удалось удалить файл с Диска", "error");
        renderSyncRow();
      });
    }, "Выключить и удалить");
}

function _syncConsumeHash() {
  var h = location.hash || "";
  if (!/[#&](access_token|error)=/.test(h)) return;
  var p = {};
  h.slice(1).split("&").forEach(function(kv) {
    var i = kv.indexOf("=");
    if (i > 0) p[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " "));
  });
  try { history.replaceState(history.state, "", location.pathname + location.search); } catch (e) {}
  var expected = null;
  try { expected = localStorage.getItem(SYNC_STATE_KEY); localStorage.removeItem(SYNC_STATE_KEY); } catch (e) {}
  if (!expected || p.state !== expected) {
    _syncLog("warn", "oauth: state не совпал");
    _syncNotice = "Вход не завершён — попробуйте ещё раз";
    return;
  }
  if (p.error) {
    _syncLog("warn", "oauth: " + p.error);
    _syncNotice = p.error === "access_denied" ? "Доступ не разрешён" : "Ошибка входа: " + p.error;
    return;
  }
  var ttl = parseInt(p.expires_in, 10) || 3600;
  _syncSetAuth({ token: p.access_token, exp: Date.now() + ttl * 1000, email: "" });
  _syncNotice = "";
  _syncLog("info", "oauth: вход выполнен");
  _driveFetch("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)").then(function(r) {
    return r.json();
  }).then(function(j) {
    var a = _syncGetAuth();
    if (a && j && j.user && j.user.emailAddress) { a.email = j.user.emailAddress; _syncSetAuth(a); renderSyncRow(); }
  }).catch(function(e) {
    if (e && e.auth) { _syncNotice = "Нужно войти снова"; renderSyncRow(); }
  });
}

function _driveFetch(url, opts) {
  var a = _syncGetAuth();
  if (!_syncTokenValid(a)) return Promise.reject({ auth: true });
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers.Authorization = "Bearer " + a.token;
  return fetch(url, opts).then(function(r) {
    if (r.status === 401) { _syncSetAuth(null); throw { auth: true }; }
    if (!r.ok) throw { status: r.status };
    return r;
  });
}

// Все файлы с этим именем, старый первым: основной — files[0], остальные — дубли от одновременного создания.
function _driveList(name) {
  var q = encodeURIComponent("name='" + name + "'");
  return _driveFetch("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&orderBy=createdTime&q=" + q + "&fields=files(id,modifiedTime,version)")
    .then(function(r) { return r.json(); })
    .then(function(j) { return (j && Array.isArray(j.files)) ? j.files : []; });
}

function _driveFind(name) {
  return _driveList(name).then(function(files) { return files[0] || null; });
}

function _driveRead(id) {
  return _driveFetch("https://www.googleapis.com/drive/v3/files/" + id + "?alt=media")
    .then(function(r) { return r.text(); })
    .then(function(t) {
      try { return JSON.parse(t); } catch (e) { throw { corrupt: true }; }
    });
}

// Файл синхронизации: null — пустой/нет; иначе проверенный документ или { corrupt } / { newer }.
function _syncCheckDoc(doc) {
  if (doc == null) return null;
  if (typeof doc !== "object" || doc.app !== "dnd-sheet") throw { corrupt: true };
  if (typeof doc.format === "number" && doc.format > 1) throw { newer: true };
  if (doc.format !== 1) throw { corrupt: true };
  if ((doc.chars != null && !Array.isArray(doc.chars)) || (doc.spells != null && !Array.isArray(doc.spells)) ||
      (doc.tombstones != null && (typeof doc.tombstones !== "object" || Array.isArray(doc.tombstones)))) throw { corrupt: true };
  return doc;
}

function _driveWrite(name, id, data) {
  var body = JSON.stringify(data);
  if (id) {
    return _driveFetch("https://www.googleapis.com/upload/drive/v3/files/" + id + "?uploadType=media&fields=id,version", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: body
    }).then(function(r) { return r.json(); });
  }
  var boundary = "dndsync" + Date.now();
  var multipart = "--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify({ name: name, parents: ["appDataFolder"] }) +
    "\r\n--" + boundary + "\r\nContent-Type: application/json\r\n\r\n" + body + "\r\n--" + boundary + "--";
  return _driveFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,version", {
    method: "POST", headers: { "Content-Type": "multipart/related; boundary=" + boundary }, body: multipart
  }).then(function(r) { return r.json(); });
}

// SYNC-3: живая синхронизация — файл dnd-sync.json, состояние в dnd_sync_state.
function _syncLoadState() {
  try {
    var s = JSON.parse(localStorage.getItem(SYNC_DATA_KEY) || "null");
    if (s && typeof s === "object") { s.tombstones = s.tombstones || {}; return s; }
  } catch (e) {}
  return { base: null, tombstones: {}, lastAt: 0 };
}

function _syncSaveState(s) {
  try { localStorage.setItem(SYNC_DATA_KEY, JSON.stringify(s)); } catch (e) {}
}

function syncTombstone(id) {
  if (id == null) return;
  var s = _syncLoadState(), now = Date.now();
  Object.keys(s.tombstones).forEach(function(k) { if (now - (Number(s.tombstones[k]) || 0) >= SYNC_TOMB_TTL) delete s.tombstones[k]; });
  s.tombstones[id] = now;
  _syncSaveState(s);
}

function _syncExpired() {
  _syncStatus = "Нужно войти снова";
  if (!_syncExpiredToast) { _syncExpiredToast = true; showToast("Срок входа в Google истёк — войдите снова, чтобы продолжить синхронизацию", "warn"); }
  renderSyncRow();
}

function syncSchedule() {
  if (_syncApplying || !_syncEnabled()) return;
  if (!_syncTokenValid(_syncGetAuth())) { _syncExpired(); return; }
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(function() { _syncTimer = null; syncNow(false); }, SYNC_DELAY);
}

function _syncUserSpells() {
  var baseIds = new Set((typeof SPELLS_BASE !== "undefined") ? SPELLS_BASE.map(function(s) { return s.id; }) : []);
  return SPELL_DATABASE.filter(function(s) { return !baseIds.has(s.id); });
}

function _syncHashes(list) {
  var h = {};
  list.forEach(function(x) { if (x && x.id != null) h[x.id] = syncHashChar(x); });
  return h;
}

// Итог слияния поверх того, что игрок успел поменять, пока шёл запрос:
// правка во время запроса побеждает, удалённое во время запроса не воскресает, новое остаётся.
// kept — id, где живая правка победила пришедшую с Диска версию: их базу откатываем, чтобы
// следующая синхронизация увидела правку с обеих сторон и сделала копию, а не затёрла чужую.
function _syncKeepLive(merged, live, before, fix, kept) {
  var liveById = {}, inMerged = {}, out = [];
  live.forEach(function(x) { if (x && x.id != null) liveById[x.id] = x; });
  merged.forEach(function(m) {
    if (!m || m.id == null) return;
    inMerged[m.id] = true;
    var cur = liveById[m.id];
    if (cur && before[m.id] !== undefined && syncHashChar(cur) !== before[m.id]) {
      if (kept && syncHashChar(m) !== before[m.id]) kept.push(m.id);
      out.push(cur);
    } else if (cur) out.push(fix(m));
    else if (!(m.id in before)) out.push(fix(m));
  });
  live.forEach(function(x) {
    if (!x || x.id == null) { out.push(x); return; }
    if (!inMerged[x.id] && !(x.id in before)) out.push(x);
  });
  return out;
}

function _syncNameDupes(localChars, remote) {
  var rIds = {}, rNames = {};
  (remote.chars || []).forEach(function(c) { if (c) { rIds[c.id] = true; if (c.name) rNames[c.name] = true; } });
  return localChars.filter(function(c) { return c && c.name && !rIds[c.id] && rNames[c.name]; });
}

// Вопрос задаётся вне _syncBusy: окно, которое не открылось или закрылось без ответа, ничего не блокирует.
function _syncAskDupes(dupes) {
  var names = dupes.map(function(c) { return "«" + c.name + "»"; }).join(", ");
  showConfirmModal("Одинаковые персонажи",
    "На Диске и на этом устройстве есть персонажи с одинаковыми именами: " + names +
    ". «Объединить» — оставить версии с Диска, местные уйдут в резервную копию. «Оставить оба» — будут дубли.",
    function() { _syncDupeChoice = true; _syncPaused = false; syncNow(false); }, "Объединить",
    { danger: false, icon: "copy", altLabel: "Оставить оба",
      onAlt: function() { _syncDupeChoice = false; _syncPaused = false; syncNow(false); } });
}

// Применение заменит или удалит что-то из того, что сейчас есть на устройстве.
function _syncDestructive(res, before) {
  function lost(list, prev) {
    var now = {};
    list.forEach(function(x) { if (x && x.id != null) now[x.id] = syncHashChar(x); });
    return Object.keys(prev).some(function(id) { return now[id] !== prev[id]; });
  }
  return lost(res.chars, before.chars) || lost(res.spells, before.spells);
}

function _syncApply(res, before) {
  var kept = { chars: [], spells: [] };
  _syncApplying = true;
  try {
    if (typeof saveToLocalDebounced !== "undefined") saveToLocalDebounced.flush();
    var open = characters.find(function(c) { return c.id === currentId; });
    var openHash = open ? syncHashChar(open) : null;
    characters = _syncKeepLive(res.chars, characters, before.chars, function(c) { return c; }, kept.chars);
    var spells = _syncKeepLive(res.spells, _syncUserSpells(), before.spells, function(s) { s.homebrew = true; return s; }, kept.spells);
    SPELL_DATABASE = ((typeof SPELLS_BASE !== "undefined") ? SPELLS_BASE.slice() : []).concat(spells);
    saveToLocal();
    renderCharacterList();
    if (open && currentScreenName() === "character") {
      var now = characters.find(function(c) { return c.id === currentId; });
      if (!now) {
        showToast("«" + (open.name || "Персонаж") + "» удалён на другом устройстве", "warn");
        showScreen("characters");
      } else if (syncHashChar(now) !== openHash) {
        var tabEl = document.querySelector(".tab-content.active");
        var tab = tabEl ? tabEl.id.replace("tab-", "") : "";
        loadCharacter(currentId);
        if (tab && tab !== "sheet") switchTab(tab);
      }
    }
  } finally {
    _syncApplying = false;
  }
  return kept;
}

function _syncFixChar(c) {
  return _sanitizeImportedChar(migrateCharacter(c));
}

// Дубли файла (два устройства создали его одновременно) вливаются в основной; основной — самый старый.
function _syncMergeExtra(remote, doc) {
  var x;
  try { x = _syncCheckDoc(doc); } catch (e) { return remote; }
  if (!x) return remote;
  if (!remote) return x;
  var m = syncMerge({ chars: (x.chars || []).map(_syncUnpackChar), spells: x.spells || [] }, remote, {}, x.tombstones || {},
    { device: x.device || "", fixChar: _syncFixChar });
  return m.toUpload || remote;
}

// overwrite — файл на Диске повреждён, пользователь согласился записать поверх него данные устройства.
function _syncRun(attempt, dropDupes, overwrite) {
  var file = null, extras = [], remote = null;
  return _driveList(SYNC_FILE).then(function(files) {
    file = files[0] || null;
    extras = files.slice(1);
    return file && !overwrite ? _driveRead(file.id) : null;
  }).then(function(doc) {
    remote = _syncCheckDoc(doc);
    return extras.reduce(function(p, f) {
      return p.then(function() {
        return _driveRead(f.id).then(function(d) { remote = _syncMergeExtra(remote, d); }, function(e) { if (e && e.auth) throw e; });
      });
    }, Promise.resolve());
  }).then(function() {
    var state = _syncLoadState();
    if (!state.base && remote && dropDupes === undefined) {
      var dupes = _syncNameDupes(characters, remote);
      if (dupes.length) throw { dupes: dupes };
    }
    if (typeof saveToLocalDebounced !== "undefined") saveToLocalDebounced.flush();
    var startAt = Date.now();
    var dropIds = {};
    if (dropDupes && remote) _syncNameDupes(characters, remote).forEach(function(c) { dropIds[c.id] = true; });
    var local = {
      chars: characters.filter(function(c) { return !(c && dropIds[c.id]); }),
      spells: _syncUserSpells()
    };
    var before = { chars: _syncHashes(characters), spells: _syncHashes(local.spells) };
    var res;
    try {
      res = syncMerge(local, remote, remote ? (state.base || {}) : {}, state.tombstones,
        { device: _syncDevice(), fixChar: _syncFixChar, force: extras.length > 0 || overwrite });
    } catch (e) { throw { corrupt: true }; }
    var apply = res.changed || Object.keys(dropIds).length;
    var snap = Promise.resolve();
    if (apply && _syncDestructive(res, before) && typeof createBackupSnapshot === "function") {
      snap = createBackupSnapshot("sync").catch(function() { throw { backup: true }; });
    }
    return snap.then(function() {
      if (!res.toUpload) return;
      return _driveList(SYNC_FILE).then(function(files) {
        var f2 = files[0] || null;
        var same = f2 ? (file && f2.id === file.id && f2.version === file.version) : !file;
        if (!same) throw { retry: true };
        return _driveWrite(SYNC_FILE, file && file.id, res.toUpload);
      }).then(function() {
        extras.forEach(function(f) {
          _driveFetch("https://www.googleapis.com/drive/v3/files/" + f.id, { method: "DELETE" }).catch(function() {});
        });
      });
    }).then(function() {
      var kept = apply ? _syncApply(res, before) : { chars: [], spells: [] };
      var old = state.base || {};
      kept.chars.forEach(function(id) { if (String(id) in old) res.base[String(id)] = old[String(id)]; else delete res.base[String(id)]; });
      kept.spells.forEach(function(id) { var k = "spell:" + id; if (k in old) res.base[k] = old[k]; else delete res.base[k]; });
      var s = _syncLoadState();
      Object.keys(s.tombstones).forEach(function(id) {
        if (s.tombstones[id] >= startAt) res.tombstones[id] = s.tombstones[id];
      });
      _syncSaveState({ base: res.base, tombstones: res.tombstones, lastAt: Date.now() });
      return res;
    });
  }).catch(function(e) {
    if (e && e.retry && attempt < 2) return _syncRun(attempt + 1, dropDupes, overwrite);
    throw e;
  });
}

function syncNow(manual, overwrite) {
  if (!_syncEnabled()) return;
  if (manual) _syncPaused = false;
  if (_syncPaused || (typeof _saveBlocked !== "undefined" && _saveBlocked)) return;
  if (_syncBusy) { _syncAgain = true; return; }
  if (!_syncTokenValid(_syncGetAuth())) {
    if (manual) { _syncStatus = "Нужно войти снова"; showToast("Срок входа истёк — войдите в Google снова", "warn"); renderSyncRow(); }
    else _syncExpired();
    return;
  }
  if (navigator.onLine === false) {
    _syncStatus = "Нет сети";
    if (manual) showToast("Нет сети — синхронизация после подключения", "warn");
    renderSyncRow();
    return;
  }
  clearTimeout(_syncTimer);
  _syncTimer = null;
  _syncBusy = true;
  var prevStatus = _syncStatus;
  _syncStatus = "Синхронизация…";
  renderSyncRow();
  var dropDupes = _syncDupeChoice;
  _syncDupeChoice = undefined;
  _syncRun(0, dropDupes, !!overwrite).then(function(res) {
    _syncStatus = "";
    _syncCorrupt = false;
    _syncExpiredToast = false;
    if (res.conflicts.length) {
      _syncStatus = "Конфликт: создана копия " + res.conflicts.map(function(c) { return "«" + c.name + "»"; }).join(", ");
      showToast(_syncStatus, "warn");
    } else if (manual) {
      showToast("Синхронизировано", "success");
    }
    _syncLog("info", "синхронизация: персонажей " + res.chars.length + ", конфликтов " + res.conflicts.length);
  }).catch(function(e) {
    _syncCorrupt = false;
    if (e && e.dupes) { _syncPaused = true; _syncStatus = "Ждёт решения"; _syncAskDupes(e.dupes); return; }
    if (e && e.auth) { if (!manual) { _syncExpired(); return; } _syncStatus = "Нужно войти снова"; }
    else if (e && e.corrupt) { _syncCorrupt = true; _syncStatus = "Файл на Диске повреждён — синхронизация остановлена"; }
    else if (e && e.newer) _syncStatus = "Файл на Диске записан более новой версией — обновите приложение";
    else if (e && e.backup) _syncStatus = "Не удалось сделать резервную копию — синхронизация остановлена";
    else if (navigator.onLine === false) _syncStatus = "Нет сети";
    else if (e && e.retry) _syncStatus = "Файл на Диске менялся одновременно — повторите";
    else _syncStatus = "Не удалось связаться с Google Диском";
    _syncLog("error", "синхронизация: " + ((e && (e.status || e.message)) || _syncStatus));
    if (manual || (e && (e.corrupt || e.newer || e.backup) && _syncStatus !== prevStatus)) showToast(_syncStatus, e && e.auth ? "warn" : "error");
  }).then(function() {
    _syncBusy = false;
    renderSyncRow();
    if (_syncAgain) { _syncAgain = false; syncSchedule(); }
  });
}

function syncOverwrite() {
  showConfirmModal("Перезаписать файл на Диске?",
    "Файл синхронизации на Google Диске не читается. Он будет заменён персонажами и своими заклинаниями с этого устройства. Старый файл восстановить будет нельзя.",
    function() { syncNow(true, true); }, "Перезаписать", { icon: "upload" });
}

// SYNC-2: движок слияния — чистая логика, без DOM и сети.
var SYNC_TOMB_TTL = 90 * 24 * 3600 * 1000;

// JSON с отсортированными ключами — хеш не зависит от порядка полей.
function _syncStable(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return "[" + v.map(_syncStable).join(",") + "]";
  return "{" + Object.keys(v).sort().filter(function(k) { return v[k] !== undefined; }).map(function(k) {
    return JSON.stringify(k) + ":" + _syncStable(v[k]);
  }).join(",") + "}";
}

function _syncHashStr(s) {
  var h = 0x811c9dc5;
  for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16) + "." + s.length.toString(36);
}

function syncHashChar(c) { return _syncHashStr(_syncStable(c)); }

function _syncClone(v) { return JSON.parse(JSON.stringify(v)); }

function _syncUnpackChar(c) {
  var out = _syncClone(c);
  if (typeof _unpackCharSpells === "function") _unpackCharSpells(out);
  return out;
}

function _syncPackChar(c) {
  return typeof _packCharForExport === "function" ? _packCharForExport(c) : c;
}

// Общий проход по id: решает судьбу каждой записи по хешам local / remote / base.
// onBoth — обе стороны изменили запись; isGone(id, hR) — локально нет записи, удалена ли она здесь.
function _syncMergeList(L, R, base, prefix, onBoth, isGone, isRemoteGone) {
  var out = [], newBase = {}, flags = { local: false, remote: false }, deleted = [];
  var rById = {}, lIds = {};
  R.forEach(function(x) { if (x && x.id != null) rById[x.id] = x; });
  L.forEach(function(l) {
    if (!l || l.id == null) { out.push(l); return; }
    lIds[l.id] = true;
    var key = prefix + l.id, b = base[key], hL = syncHashChar(l), r = rById[l.id];
    if (!r) {
      if (isRemoteGone(l.id, hL, b)) { deleted.push(l.id); flags.local = true; return; }
      out.push(l); newBase[key] = hL; flags.remote = true; return;
    }
    var hR = syncHashChar(r);
    if (hL === hR) { out.push(l); newBase[key] = hL; return; }
    if (hL === b) { out.push(r); newBase[key] = hR; flags.local = true; return; }
    if (hR === b) { out.push(l); newBase[key] = hL; flags.remote = true; return; }
    onBoth(l, r, out, newBase, flags);
  });
  R.forEach(function(r) {
    if (!r || r.id == null || lIds[r.id]) return;
    var key = prefix + r.id, hR = syncHashChar(r);
    if (isGone(r.id, hR, base[key], r)) { flags.remote = true; return; }
    out.push(r); newBase[key] = hR; flags.local = true;
  });
  return { list: out, base: newBase, flags: flags, deleted: deleted };
}

// local  = { chars, spells } — живые данные этого устройства;
// remote = содержимое файла на Диске { device, chars (упакованы), spells, tombstones } или null;
// base   = { "<id>": hash, "spell:<id>": hash } — хеши на момент прошлой синхронизации;
// tombstones = { id: at } — удалённые на этом устройстве персонажи.
// opts = { now, device, newId } — для детерминизма в тестах.
function syncMerge(local, remote, base, tombstones, opts) {
  opts = opts || {};
  base = base || {};
  var now = opts.now || Date.now();
  var device = opts.device || "";
  var newId = opts.newId || (function(n) { return function() { return now + (++n); }; })(0);
  remote = remote || {};
  var rDevice = remote.device || "другого устройства";

  var tombs = {};
  [tombstones || {}, remote.tombstones || {}].forEach(function(t) {
    Object.keys(t).forEach(function(id) {
      var at = Number(t[id]) || 0;
      if (now - at < SYNC_TOMB_TTL && !(tombs[id] >= at)) tombs[id] = at;
    });
  });

  var L = _syncClone((local && local.chars) || []);
  var R = ((remote && remote.chars) || []).map(_syncUnpackChar);
  if (opts.fixChar) R = R.map(opts.fixChar);
  var conflicts = [];
  var takenIds = {};
  L.concat(R).forEach(function(c) { if (c && c.id != null) takenIds[c.id] = true; });

  var chars = _syncMergeList(L, R, base, "",
    function(l, r, out, newBase, flags) {
      var copy = _syncClone(r);
      do { copy.id = newId(); } while (takenIds[copy.id]);
      takenIds[copy.id] = true;
      copy.name = (r.name || "Без имени") + " (с " + rDevice + ")";
      out.push(l, copy);
      newBase[String(l.id)] = syncHashChar(l);
      newBase[String(copy.id)] = syncHashChar(copy);
      conflicts.push({ id: l.id, copyId: copy.id, name: copy.name });
      flags.local = true; flags.remote = true;
    },
    // нет здесь: надгробие + на Диске без правок после нашей базы (или, без базы, правка старше надгробия) → остаётся удалённым
    function(id, hR, b, r) {
      if (!(id in tombs)) return false;
      if (hR === b) return true;
      if (b === undefined && (Number(r.updatedAt) || Number(remote.updatedAt) || Infinity) <= tombs[id]) return true;
      delete tombs[id];
      return false;
    },
    // нет на Диске: было в базе и здесь без правок → удалено там (надгробие могло истечь); иначе правка побеждает
    function(id, hL, b) {
      if (b !== undefined && hL === b && remote.chars) return true;
      if (!(id in tombs)) return false;
      delete tombs[id];
      return false;
    });

  var spellIds = {};
  ((local && local.spells) || []).concat(remote.spells || []).forEach(function(s) { if (s && s.id != null) spellIds[s.id] = true; });
  var spells = _syncMergeList(_syncClone((local && local.spells) || []), _syncClone(remote.spells || []), base, "spell:",
    function(l, r, out, newBase, flags) {
      var copy = _syncClone(r);
      do { copy.id = newId(); } while (spellIds[copy.id]);
      spellIds[copy.id] = true;
      copy.name = (r.name || "Без названия") + " (с " + rDevice + ")";
      out.push(l, copy);
      newBase["spell:" + l.id] = syncHashChar(l);
      newBase["spell:" + copy.id] = syncHashChar(copy);
      conflicts.push({ id: l.id, copyId: copy.id, name: copy.name, spell: true });
      flags.local = true; flags.remote = true;
    },
    function(id, hR, b) { return b !== undefined && hR === b; },
    function(id, hL, b) { return b !== undefined && hL === b; });

  chars.list.forEach(function(c) { if (c && c.id != null) delete tombs[c.id]; });
  var newBase = Object.assign({}, chars.base, spells.base);
  var doc = {
    app: "dnd-sheet",
    format: 1,
    device: device,
    updatedAt: now,
    chars: chars.list.map(_syncPackChar),
    spells: spells.list,
    tombstones: tombs
  };
  var remoteTombs = _syncStable(remote.tombstones || {});
  var needUpload = chars.flags.remote || spells.flags.remote || remoteTombs !== _syncStable(tombs) || !remote.chars || !!opts.force;
  return {
    chars: chars.list,
    spells: spells.list,
    tombstones: tombs,
    base: newBase,
    changed: chars.flags.local || spells.flags.local,
    toUpload: needUpload ? doc : null,
    conflicts: conflicts,
    deleted: chars.deleted.concat(spells.deleted.map(function(id) { return "spell:" + id; }))
  };
}

function _syncBtn(label, fn) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "backup-create-btn";
  b.textContent = label;
  b.onclick = fn;
  return b;
}

function _syncTimeLabel(at) {
  if (!at) return "";
  var d = new Date(at);
  if (d.toDateString() === new Date().toDateString()) return "Синхронизировано " + d.toTimeString().slice(0, 5);
  return "Синхронизировано " + _backupFmtDate(at);
}

function renderSyncRow() {
  var row = $("sync-row");
  if (!row) return;
  row.style.display = "";
  var status = $("sync-status");
  var actions = $("sync-actions");
  actions.innerHTML = "";
  var a = _syncGetAuth();
  if (_syncTokenValid(a)) {
    var st = _syncStatus || _syncTimeLabel(_syncLoadState().lastAt);
    status.textContent = "Синхронизация" + (a.email ? " · " + a.email : "") + (st ? " · " + st : "");
    var now = _syncBtn(_syncBusy ? "Синхронизация…" : "Синхронизировать сейчас", function() { syncNow(true); });
    now.disabled = _syncBusy;
    actions.appendChild(now);
    if (_syncCorrupt && !_syncBusy) actions.appendChild(_syncBtn("Перезаписать файл на Диске", syncOverwrite));
    actions.appendChild(_syncBtn("Выйти", syncSignOut));
    actions.appendChild(_syncBtn("Выключить и удалить с Диска", syncTurnOff));
  } else {
    status.textContent = "Синхронизация · " + (_syncNotice || (a ? "Нужно войти снова" : "Google Диск"));
    actions.appendChild(_syncBtn(a || _syncNotice ? "Войти снова" : "Войти через Google", syncSignIn));
  }
  var priv = document.createElement("a");
  priv.href = "privacy.html";
  priv.target = "_blank";
  priv.rel = "noopener";
  priv.className = "sync-privacy";
  priv.textContent = "Что хранится";
  actions.appendChild(priv);
}

_syncConsumeHash();
document.addEventListener("DOMContentLoaded", renderSyncRow);
window.addEventListener("load", function() { setTimeout(function() { syncNow(false); }, 1000); });
window.addEventListener("online", function() { syncNow(false); });
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "hidden") {
    if (_syncTimer) syncNow(false);
  } else if (Date.now() - (_syncLoadState().lastAt || 0) > 60000) {
    syncNow(false);
  }
});
