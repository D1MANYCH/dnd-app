// SYNC-1: вход через Google и пробная запись в скрытую папку приложения на Диске.
// Видно только с ?sync=1 (флаг запоминается в localStorage).

var SYNC_CLIENT_ID = "756417920081-9s625rqlg5kv9o2rue4q9sp2831koaiu.apps.googleusercontent.com";
var SYNC_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
var SYNC_TEST_FILE = "dnd-sync-test.json";
var SYNC_AUTH_KEY = "dnd_sync_auth";
var SYNC_STATE_KEY = "dnd_sync_oauth_state";
var SYNC_FLAG_KEY = "dnd_sync_flag";
var _syncNotice = "";

function _syncLog(level, msg) {
  try { if (window.AppLog && AppLog[level]) AppLog[level]("sync", msg); } catch (e) {}
}

function _syncEnabled() {
  try {
    if (/[?&]sync=1/.test(location.search || "")) localStorage.setItem(SYNC_FLAG_KEY, "1");
    return localStorage.getItem(SYNC_FLAG_KEY) === "1";
  } catch (e) { return false; }
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

function _driveFind(name) {
  var q = encodeURIComponent("name='" + name + "'");
  return _driveFetch("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=" + q + "&fields=files(id,modifiedTime,version)")
    .then(function(r) { return r.json(); })
    .then(function(j) { return (j.files && j.files[0]) || null; });
}

function _driveRead(id) {
  return _driveFetch("https://www.googleapis.com/drive/v3/files/" + id + "?alt=media").then(function(r) { return r.json(); });
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

function _syncFail(e) {
  if (e && e.auth) {
    _syncNotice = "Нужно войти снова";
    showToast("Срок входа истёк — войдите в Google снова", "warn");
  } else {
    _syncLog("error", "drive: " + ((e && (e.status || e.message)) || e));
    showToast(navigator.onLine === false ? "Нет сети" : "Не удалось связаться с Google Диском", "error");
  }
  renderSyncRow();
}

function syncTestWrite() {
  var prev = null;
  var fileId = null;
  _driveFind(SYNC_TEST_FILE).then(function(f) {
    if (!f) return null;
    fileId = f.id;
    return _driveRead(f.id).catch(function() { return null; });
  }).then(function(old) {
    prev = old;
    return _driveWrite(SYNC_TEST_FILE, fileId, { at: Date.now(), device: _syncDevice() });
  }).then(function(res) {
    return _driveRead(res.id);
  }).then(function(back) {
    var msg = "Запись на Диск работает (" + back.device + ")";
    if (prev && prev.at) msg += ". Прошлая запись: " + prev.device + ", " + _backupFmtDate(prev.at);
    showToast(msg, "success");
  }).catch(_syncFail);
}

function _syncBtn(label, fn) {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "backup-create-btn";
  b.textContent = label;
  b.onclick = fn;
  return b;
}

function renderSyncRow() {
  var row = $("sync-row");
  if (!row) return;
  if (!_syncEnabled()) { row.style.display = "none"; return; }
  row.style.display = "";
  var status = $("sync-status");
  var actions = $("sync-actions");
  actions.innerHTML = "";
  var a = _syncGetAuth();
  if (_syncTokenValid(a)) {
    status.textContent = "Синхронизация · вошли" + (a.email ? " · " + a.email : "");
    actions.appendChild(_syncBtn("Проверить запись", syncTestWrite));
    actions.appendChild(_syncBtn("Выйти", syncSignOut));
  } else {
    status.textContent = "Синхронизация · " + (_syncNotice || (a ? "Нужно войти снова" : "Google Диск"));
    actions.appendChild(_syncBtn(a || _syncNotice ? "Войти снова" : "Войти через Google", syncSignIn));
  }
}

_syncConsumeHash();
document.addEventListener("DOMContentLoaded", renderSyncRow);
