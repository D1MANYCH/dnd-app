// ============================================================
// app-notes.js — Вкладка «📝 Записи по персонажу» (фазы N2–N6)
// N2: под-табы + секции-редакторы.
// N3: Markdown-тулбар, превью, счётчик слов/симв., горячие клавиши.
// N4: CRUD карточек, теги, закрепление, сортировка, @-ссылки.
// N5: поиск, экспорт/импорт .md/.json, печать.
// N6: автособытия в Журнале, drag-n-drop порядок закреплённых, адаптив.
// ============================================================

// Состояние превью по ключу секции (true = показан preview).
var _notesPreviewOpen = {};

// ── Конфигурация под-табов ────────────────────────────────────
// backstory — единственная секция-редактор с несколькими полями,
// остальные — списки карточек-entries (наполнение в N4).
var NOTES_TABS = [
  { key: 'backstory', icon: '📖', label: 'Предыстория', kind: 'sections' },
  { key: 'npc',       icon: '🧝', label: 'NPC',         kind: 'entries'  },
  { key: 'quest',     icon: '🎯', label: 'Квесты',      kind: 'entries'  },
  { key: 'location',  icon: '🗺️', label: 'Локации',     kind: 'entries'  },
  { key: 'session',   icon: '📅', label: 'Сессии',      kind: 'entries'  },
  { key: 'hook',      icon: '🧲', label: 'Зацепки',     kind: 'entries'  },
  { key: 'free',      icon: '📝', label: 'Свободно',    kind: 'entries'  }
];

// Поля секции «Предыстория» — все 8 из notesV2.sections.
var NOTES_SECTIONS = [
  { key: 'backstory',   icon: '📖', label: 'Предыстория',         rows: 10, placeholder: 'Происхождение, семья, важные события прошлого…', legacy: null },
  { key: 'appearance',  icon: '👤', label: 'Внешность',            rows: 5,  placeholder: 'Внешность, приметы, манеры…',                 legacy: 'char-appearance' },
  { key: 'personality', icon: '🎭', label: 'Личность',             rows: 5,  placeholder: 'Характер, привычки, особенности поведения…',   legacy: null },
  { key: 'ideals',      icon: '✨', label: 'Идеалы',               rows: 3,  placeholder: 'Во что верит персонаж…',                       legacy: null },
  { key: 'bonds',       icon: '🔗', label: 'Связи',                rows: 3,  placeholder: 'Люди, места, предметы, важные персонажу…',     legacy: null },
  { key: 'flaws',       icon: '⚠️', label: 'Слабости',             rows: 3,  placeholder: 'Недостатки, страхи, уязвимости…',              legacy: null },
  { key: 'features',    icon: '📖', label: 'Черты и умения',       rows: 7,  placeholder: 'Классовые умения, расовые черты…',             legacy: 'char-features', showTakenFeats: true },
  { key: 'magicItems',  icon: '🔮', label: 'Магические предметы',  rows: 5,  placeholder: 'Настроенные предметы, свойства…',              legacy: 'magic-items' }
];

// ── Состояние UI (не сохраняется; prefs.lastSection живёт в notesV2) ──
var _notesState = { currentTab: null };

/** Главный рендер вкладки — вызывается из switchTab('notes'). */
function renderNotes() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return;
  // Гарантируем наличие notesV2 (на случай старого персонажа, загруженного до миграции).
  if (!char.notesV2) {
    char.notesV2 = { sections: {}, entries: [], prefs: { lastSection: 'backstory', lastFilter: 'all' } };
  }
  if (!char.notesV2.sections) char.notesV2.sections = {};
  if (!Array.isArray(char.notesV2.entries)) char.notesV2.entries = [];
  if (!char.notesV2.prefs) char.notesV2.prefs = { lastSection: 'backstory', lastFilter: 'all' };

  if (!_notesState.currentTab) {
    _notesState.currentTab = char.notesV2.prefs.lastSection || 'backstory';
  }
  _renderNotesSubtabs();
  _renderNotesMain();
}

function _renderNotesSubtabs() {
  var host = document.getElementById('notes-subtabs');
  if (!host) return;
  var pillsHtml = '<div class="notes-subtabs-pills">';
  var selOpts = '';
  for (var i = 0; i < NOTES_TABS.length; i++) {
    var t = NOTES_TABS[i];
    var active = (t.key === _notesState.currentTab) ? ' active' : '';
    pillsHtml += '<button type="button" class="notes-pill' + active + '" role="tab" data-key="' + t.key + '"' +
            ' onclick="notesSwitchTab(\'' + t.key + '\')">' +
            '<span class="notes-pill-ico">' + t.icon + '</span> ' + escapeHtml(t.label) +
            '</button>';
    selOpts += '<option value="' + t.key + '"' + (t.key === _notesState.currentTab ? ' selected' : '') + '>' +
               t.icon + ' ' + escapeHtml(t.label) + '</option>';
  }
  pillsHtml += '</div>';
  // N6: select-вариант для узких экранов — CSS скрывает его на десктопе.
  var selectHtml = '<select class="notes-subtabs-select" aria-label="Раздел записей" ' +
                   'onchange="notesSwitchTab(this.value)">' + selOpts + '</select>';
  host.innerHTML = pillsHtml + selectHtml;
}

function notesSwitchTab(key) {
  _notesState.currentTab = key;
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (char && char.notesV2) {
    char.notesV2.prefs = char.notesV2.prefs || {};
    char.notesV2.prefs.lastSection = key;
    if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
  }
  _renderNotesSubtabs();
  _renderNotesMain();
}

function _renderNotesMain() {
  var host = document.getElementById('notes-main');
  if (!host) return;
  // N5: поиск перехватывает обычный рендер
  if (_notesSearchQuery && _notesSearchQuery.trim()) {
    host.innerHTML = _renderSearchResults();
    return;
  }
  var tab = _findTab(_notesState.currentTab) || NOTES_TABS[0];
  if (tab.kind === 'sections') {
    host.innerHTML = _renderSectionsView();
    _bindSectionInputs();
    _syncTakenFeatsLocation();
  } else {
    host.innerHTML = _renderEntriesView(tab);
  }
}

function _findTab(key) {
  for (var i = 0; i < NOTES_TABS.length; i++) if (NOTES_TABS[i].key === key) return NOTES_TABS[i];
  return null;
}

function _renderSectionsView() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return '';
  var sec = (char.notesV2 && char.notesV2.sections) || {};
  var html = '';
  for (var i = 0; i < NOTES_SECTIONS.length; i++) {
    var s = NOTES_SECTIONS[i];
    var val = sec[s.key] != null ? sec[s.key] : '';
    var previewOn = !!_notesPreviewOpen[s.key];
    html += '<div class="card notes-section-card" data-sec-key="' + s.key + '">' +
              '<h3>' + s.icon + ' ' + escapeHtml(s.label) + '</h3>';
    if (s.showTakenFeats) {
      html += '<div class="notes-feats-anchor" id="notes-feats-anchor"></div>';
    }
    // MD-тулбар
    html += _renderMdToolbar(s.key, previewOn);
    // Textarea
    html += '<textarea class="notes-section-input" id="notes-sec-' + s.key + '"' +
            ' data-section="' + s.key + '"' +
            (s.legacy ? ' data-legacy="' + s.legacy + '"' : '') +
            ' rows="' + s.rows + '" placeholder="' + escapeHtml(s.placeholder) + '"' +
            (previewOn ? ' style="display:none;"' : '') + '>' +
            escapeHtml(val) + '</textarea>';
    // Превью
    html += '<div class="notes-md-preview" id="notes-prev-' + s.key + '"' +
            (previewOn ? '' : ' style="display:none;"') + '>' +
            _mdToHtml(val) + '</div>';
    // Счётчик
    var stats = _countStats(val);
    html += '<div class="notes-md-stats" id="notes-stat-' + s.key + '">' +
              stats.words + ' сл. · ' + stats.chars + ' симв.' +
            '</div>';
    html += '</div>';
  }
  return html;
}

function _renderMdToolbar(key, previewOn) {
  var btns = [
    { t: 'B',  a: 'bold',   title: 'Жирный (Ctrl+B)' },
    { t: 'I',  a: 'italic', title: 'Курсив (Ctrl+I)' },
    { t: 'H',  a: 'h2',     title: 'Заголовок' },
    { t: '•',  a: 'ul',     title: 'Список' },
    { t: '“',  a: 'quote',  title: 'Цитата' },
    { t: '🔗', a: 'link',   title: 'Ссылка (Ctrl+K)' },
    { t: '▦',  a: 'table',  title: 'Таблица' },
    { t: '―',  a: 'hr',     title: 'Разделитель' }
  ];
  var html = '<div class="notes-md-toolbar" data-for="' + key + '">';
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    html += '<button type="button" class="notes-md-btn" title="' + b.title +
            '" onclick="notesMdInsert(\'' + key + '\',\'' + b.a + '\')">' + b.t + '</button>';
  }
  html += '<button type="button" class="notes-md-btn notes-md-preview-toggle' +
          (previewOn ? ' active' : '') + '" title="Превью"' +
          ' onclick="notesTogglePreview(\'' + key + '\')">👁</button>';
  html += '</div>';
  return html;
}

/** Мини-парсер Markdown → безопасный HTML. Экранирует текст, затем применяет ограниченный набор правил. */
function _mdToHtml(src) {
  if (!src) return '<div class="notes-md-empty">— пусто —</div>';
  var s = escapeHtml(src);
  // code fences ```…```
  s = s.replace(/```([\s\S]*?)```/g, function(_, code){
    return '<pre class="notes-md-code">' + code + '</pre>';
  });
  // inline code `x`
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  // Обработка по строкам (заголовки, цитаты, списки, hr)
  var lines = s.split(/\r?\n/);
  var out = [], inUl = false, inOl = false;
  function closeLists() {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  }
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (/^\s*---\s*$/.test(line)) { closeLists(); out.push('<hr>'); continue; }
    var mH = line.match(/^(#{1,4})\s+(.*)$/);
    if (mH) { closeLists(); var lvl = mH[1].length; out.push('<h' + (lvl+1) + '>' + mH[2] + '</h' + (lvl+1) + '>'); continue; }
    var mQ = line.match(/^&gt;\s?(.*)$/);
    if (mQ) { closeLists(); out.push('<blockquote>' + mQ[1] + '</blockquote>'); continue; }
    var mUl = line.match(/^\s*[-*]\s+(.*)$/);
    if (mUl) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push('<li>' + mUl[1] + '</li>'); continue;
    }
    var mOl = line.match(/^\s*\d+\.\s+(.*)$/);
    if (mOl) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push('<li>' + mOl[1] + '</li>'); continue;
    }
    closeLists();
    if (line.trim() === '') { out.push(''); }
    else out.push('<p>' + line + '</p>');
  }
  closeLists();
  var html = out.join('\n');
  // Жирный/курсив (после построчной обработки, чтоб не задеть структуру)
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  // Ссылки [text](url) — url whitelisted (http/https/#)
  html = html.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, function(_, t, u){
    var safe = /^(https?:\/\/|#|\/)/i.test(u) ? u : '#';
    return '<a href="' + safe + '" target="_blank" rel="noopener">' + t + '</a>';
  });
  return html;
}

function _countStats(v) {
  v = v || '';
  var chars = v.length;
  var words = v.trim() ? v.trim().split(/\s+/).length : 0;
  return { words: words, chars: chars };
}

function _bindSectionInputs() {
  var inputs = document.querySelectorAll('#notes-main .notes-section-input');
  for (var i = 0; i < inputs.length; i++) {
    (function(el){
      el.addEventListener('input', function() {
        notesUpdateSection(el);
        _updateStats(el);
      });
      el.addEventListener('keydown', function(ev) { _notesHotkeys(ev, el); });
    })(inputs[i]);
  }
}

function _updateStats(el) {
  var key = el.getAttribute('data-section');
  var host = document.getElementById('notes-stat-' + key);
  if (!host) return;
  var st = _countStats(el.value);
  host.textContent = st.words + ' сл. · ' + st.chars + ' симв.';
}

/** Горячие клавиши редактора: Ctrl+S/B/I/K. */
function _notesHotkeys(ev, el) {
  if (!(ev.ctrlKey || ev.metaKey)) return;
  var k = (ev.key || '').toLowerCase();
  var key = el.getAttribute('data-section');
  if (k === 's') {
    ev.preventDefault();
    if (typeof saveToLocal === 'function') saveToLocal();
    else if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
    _notesFlashSaved();
  } else if (k === 'b') { ev.preventDefault(); notesMdInsert(key, 'bold'); }
  else if (k === 'i') { ev.preventDefault(); notesMdInsert(key, 'italic'); }
  else if (k === 'k') { ev.preventDefault(); notesMdInsert(key, 'link'); }
}

/** Вставить/обернуть Markdown-разметку в textarea секции. */
function notesMdInsert(secKey, action) {
  var el = document.getElementById('notes-sec-' + secKey);
  if (!el) return;
  var v = el.value || '';
  var s = el.selectionStart, e = el.selectionEnd;
  var sel = v.substring(s, e);
  var before = v.substring(0, s), after = v.substring(e);
  var insert = '', caretDelta = 0, selLen = sel.length;

  function wrap(l, r, ph) {
    var body = sel || ph;
    insert = l + body + r;
    // Если не было выделения — курсор внутрь обёртки на плейсхолдере.
    caretDelta = sel ? insert.length : l.length + body.length;
    if (!sel) selLen = body.length;
  }
  function linePrefix(pref, ph) {
    var body = sel || ph;
    // Применяем к каждой строке выделения.
    insert = body.split(/\r?\n/).map(function(ln){ return pref + ln; }).join('\n');
    caretDelta = insert.length;
  }

  switch (action) {
    case 'bold':   wrap('**', '**', 'жирный'); break;
    case 'italic': wrap('*',  '*',  'курсив'); break;
    case 'h2':     linePrefix('## ', 'Заголовок'); break;
    case 'ul':     linePrefix('- ', 'пункт'); break;
    case 'quote':  linePrefix('> ', 'цитата'); break;
    case 'link': {
      var text = sel || 'текст';
      insert = '[' + text + '](https://)';
      caretDelta = insert.length - 1; // курсор перед закрывающей скобкой
      selLen = 0;
      break;
    }
    case 'table': {
      var t = '| Колонка | Значение |\n| --- | --- |\n| a | 1 |\n| b | 2 |';
      insert = (before && !/\n$/.test(before) ? '\n' : '') + t + '\n';
      caretDelta = insert.length;
      break;
    }
    case 'hr': {
      insert = (before && !/\n$/.test(before) ? '\n' : '') + '---\n';
      caretDelta = insert.length;
      break;
    }
    default: return;
  }

  el.value = before + insert + after;
  el.focus();
  var caret = s + caretDelta;
  if (sel || action === 'link') {
    // Для link — нулевое выделение; для выделения — ставим курсор в конец.
    el.setSelectionRange(caret, caret);
  } else {
    // Выделяем плейсхолдер, чтобы пользователь мог сразу набрать замену.
    el.setSelectionRange(s + (action === 'bold' ? 2 : action === 'italic' ? 1 : 0),
                         s + (action === 'bold' ? 2 : action === 'italic' ? 1 : 0) + selLen);
  }
  notesUpdateSection(el);
  _updateStats(el);
}

/** Переключить превью для секции. */
function notesTogglePreview(secKey) {
  _notesPreviewOpen[secKey] = !_notesPreviewOpen[secKey];
  var ta  = document.getElementById('notes-sec-' + secKey);
  var pv  = document.getElementById('notes-prev-' + secKey);
  var btn = document.querySelector('.notes-md-toolbar[data-for="' + secKey + '"] .notes-md-preview-toggle');
  if (!ta || !pv) return;
  if (_notesPreviewOpen[secKey]) {
    pv.innerHTML = _mdToHtml(ta.value || '');
    ta.style.display = 'none';
    pv.style.display = '';
    if (btn) btn.classList.add('active');
  } else {
    pv.style.display = 'none';
    ta.style.display = '';
    if (btn) btn.classList.remove('active');
  }
}

/** Запись из textarea → notesV2.sections + зеркалирование в legacy поля (double-write). */
function notesUpdateSection(el) {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!el || !char) return;
  var key = el.getAttribute('data-section');
  var legacyId = el.getAttribute('data-legacy');
  var val = el.value || '';
  char.notesV2 = char.notesV2 || { sections: {}, entries: [], prefs: {} };
  char.notesV2.sections = char.notesV2.sections || {};
  char.notesV2.sections[key] = val;
  // Double-write: синхронизируем скрытый legacy-textarea, чтобы updateChar() подхватил.
  if (legacyId) {
    var legacy = document.getElementById(legacyId);
    if (legacy && legacy.value !== val) legacy.value = val;
  }
  // Плюс — зеркалим в char.* поля напрямую для секций-аналогов.
  if (key === 'appearance') char.appearance = val;
  else if (key === 'features') char.features = val;
  else if (key === 'magicItems') char.magicItems = val;
  // «Заметки» теперь не имеют прямого аналога в секциях — старое поле char.notes оставляем как legacy.
  _notesFlashSaved();
  if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
}

/** Переместить #taken-feats-section внутрь секции «Черты», если она открыта. */
function _syncTakenFeatsLocation() {
  var src = document.getElementById('taken-feats-section');
  var anchor = document.getElementById('notes-feats-anchor');
  if (src && anchor && src.parentNode !== anchor) {
    anchor.appendChild(src);
  }
}

// ── N4: CRUD карточек ─────────────────────────────────────────

/** Активный фильтр по тегу (null = нет). */
var _notesTagFilter = null;

function _renderEntriesView(tab) {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return '';
  var all = ((char.notesV2 && char.notesV2.entries) || []).filter(function(e){ return e && e.type === tab.key; });

  // Фильтр по тегу
  var filtered = _notesTagFilter
    ? all.filter(function(e){ return e.tags && e.tags.indexOf(_notesTagFilter) !== -1; })
    : all;

  // Сортировка: сначала закреплённые (по pinOrder ASC — ручной порядок через DnD),
  // затем по updatedAt DESC. У закреплённых без pinOrder — в конец своей группы.
  var pinned  = filtered.filter(function(e){ return e.pinned; }).sort(function(a,b){
    var ao = (typeof a.pinOrder === 'number') ? a.pinOrder : 1e15 - (a.updatedAt || 0);
    var bo = (typeof b.pinOrder === 'number') ? b.pinOrder : 1e15 - (b.updatedAt || 0);
    return ao - bo;
  });
  var regular = filtered.filter(function(e){ return !e.pinned; }).sort(function(a,b){ return b.updatedAt - a.updatedAt; });
  var sorted  = pinned.concat(regular);

  // Все теги в этом типе (для строки фильтра)
  var allTags = [];
  for (var i = 0; i < all.length; i++) {
    var tags = all[i].tags || [];
    for (var j = 0; j < tags.length; j++) {
      if (allTags.indexOf(tags[j]) === -1) allTags.push(tags[j]);
    }
  }

  var html = '';

  // Строка фильтра по тегам (если есть теги)
  if (allTags.length) {
    html += '<div class="notes-tag-filter-bar">';
    html += '<button class="notes-tag-chip' + (!_notesTagFilter ? ' active' : '') + '" onclick="notesSetTagFilter(null)">Все</button>';
    for (var k = 0; k < allTags.length; k++) {
      var tg = allTags[k];
      html += '<button class="notes-tag-chip' + (_notesTagFilter === tg ? ' active' : '') + '" onclick="notesSetTagFilter(\'' + escapeHtml(tg).replace(/'/g, "\\'") + '\')">' + escapeHtml(tg) + '</button>';
    }
    html += '</div>';
  }

  if (!sorted.length) {
    html += '<div class="card notes-empty">' +
              '<div class="notes-empty-ico">' + tab.icon + '</div>' +
              '<div class="notes-empty-title">Пока пусто</div>' +
              '<div class="notes-empty-hint">Нажмите «+ Запись», чтобы добавить ' + escapeHtml(tab.label) + '.</div>' +
            '</div>';
    return html;
  }

  html += '<div class="notes-entries-list">';
  for (var n = 0; n < sorted.length; n++) {
    html += _renderEntryCard(sorted[n]);
  }
  html += '</div>';
  return html;
}

function _renderEntryCard(e) {
  // Превью тела (2-3 строки, не более 200 символов)
  var bodyPreview = (e.body || '').replace(/[#*`>_~\[\]]/g, '').trim().slice(0, 200);
  if ((e.body || '').length > 200) bodyPreview += '…';

  // @-упоминания → кликабельные ссылки
  bodyPreview = escapeHtml(bodyPreview).replace(/@([\wА-яЁё\-]+)/g, function(_, name) {
    return '<span class="notes-at-ref" onclick="notesJumpToNpc(\'' + name.replace(/'/g, "\\'") + '\')" title="Перейти к NPC ' + name + '">@' + name + '</span>';
  });

  var tagsHtml = '';
  if (e.tags && e.tags.length) {
    tagsHtml = '<div class="notes-entry-tags">';
    for (var i = 0; i < e.tags.length; i++) {
      tagsHtml += '<span class="notes-tag-chip small" onclick="notesSetTagFilter(\'' + escapeHtml(e.tags[i]).replace(/'/g, "\\'") + '\')">' + escapeHtml(e.tags[i]) + '</span>';
    }
    tagsHtml += '</div>';
  }

  // N6: закреплённые карточки — draggable для ручной сортировки
  var dndAttrs = e.pinned
    ? ' draggable="true"' +
      ' ondragstart="notesPinDragStart(event,\'' + e.id + '\')"' +
      ' ondragover="notesPinDragOver(event)"' +
      ' ondragleave="notesPinDragLeave(event)"' +
      ' ondrop="notesPinDrop(event,\'' + e.id + '\')"' +
      ' ondragend="notesPinDragEnd(event)"'
    : '';

  return '<div class="notes-entry-card' + (e.pinned ? ' pinned' : '') + '" data-entry-id="' + e.id + '"' + dndAttrs + '>' +
    (e.pinned ? '<span class="notes-entry-drag-handle" title="Потяните, чтобы изменить порядок">⋮⋮</span>' : '') +
    '<div class="notes-entry-header">' +
      '<span class="notes-entry-title">' + escapeHtml(e.title || '(без названия)') + '</span>' +
      '<div class="notes-entry-actions">' +
        '<button class="notes-entry-btn" title="' + (e.pinned ? 'Открепить' : 'Закрепить') + '" onclick="notesTogglePin(\'' + e.id + '\')">' + (e.pinned ? '★' : '☆') + '</button>' +
        '<button class="notes-entry-btn" title="Редактировать" onclick="notesOpenEntryModal(\'' + e.id + '\')">✎</button>' +
        '<button class="notes-entry-btn danger" title="Удалить" onclick="notesDeleteEntry(\'' + e.id + '\')">🗑</button>' +
      '</div>' +
    '</div>' +
    (bodyPreview ? '<div class="notes-entry-body">' + bodyPreview + '</div>' : '') +
    tagsHtml +
  '</div>';
}

// ── N6: Drag-n-drop для закреплённых карточек ────────────────
var _notesPinDragId = null;

function notesPinDragStart(ev, id) {
  _notesPinDragId = id;
  if (ev.dataTransfer) {
    ev.dataTransfer.effectAllowed = 'move';
    try { ev.dataTransfer.setData('text/plain', id); } catch(e) {}
  }
  var card = ev.currentTarget;
  if (card && card.classList) card.classList.add('dragging');
}

function notesPinDragOver(ev) {
  if (!_notesPinDragId) return;
  var card = ev.currentTarget;
  if (!card || !card.classList || !card.classList.contains('pinned')) return;
  ev.preventDefault();
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
  card.classList.add('drag-over');
}

function notesPinDragLeave(ev) {
  var card = ev.currentTarget;
  if (card && card.classList) card.classList.remove('drag-over');
}

function notesPinDrop(ev, targetId) {
  ev.preventDefault();
  var card = ev.currentTarget;
  if (card && card.classList) card.classList.remove('drag-over');
  var fromId = _notesPinDragId;
  _notesPinDragId = null;
  if (!fromId || fromId === targetId) return;
  _notesReorderPinned(fromId, targetId);
}

function notesPinDragEnd(ev) {
  _notesPinDragId = null;
  var cards = document.querySelectorAll('#notes-main .notes-entry-card.pinned');
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove('dragging');
    cards[i].classList.remove('drag-over');
  }
}

function _notesReorderPinned(fromId, toId) {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char || !char.notesV2) return;
  var tab = _notesState.currentTab;
  var entries = char.notesV2.entries || [];
  var pinned = entries.filter(function(e){ return e.pinned && e.type === tab; });
  // Отсортируем по существующему pinOrder/updatedAt, чтобы работать со стабильным порядком
  pinned.sort(function(a,b){
    var ao = (typeof a.pinOrder === 'number') ? a.pinOrder : 1e15 - (a.updatedAt || 0);
    var bo = (typeof b.pinOrder === 'number') ? b.pinOrder : 1e15 - (b.updatedAt || 0);
    return ao - bo;
  });
  var fromIdx = -1, toIdx = -1;
  for (var i = 0; i < pinned.length; i++) {
    if (pinned[i].id === fromId) fromIdx = i;
    if (pinned[i].id === toId) toIdx = i;
  }
  if (fromIdx === -1 || toIdx === -1) return;
  var moved = pinned.splice(fromIdx, 1)[0];
  pinned.splice(toIdx, 0, moved);
  // Перераспределим pinOrder последовательно
  for (var j = 0; j < pinned.length; j++) {
    pinned[j].pinOrder = j;
  }
  if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
  _renderNotesMain();
}

function notesSetTagFilter(tag) {
  _notesTagFilter = tag || null;
  _renderNotesMain();
  _renderNotesSubtabs();
}

function notesJumpToNpc(name) {
  // Переключаемся на вкладку NPC и ищем entry с совпадающим title
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char || !char.notesV2) return;
  var found = null;
  var entries = char.notesV2.entries || [];
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].type === 'npc' && entries[i].title && entries[i].title.toLowerCase() === name.toLowerCase()) {
      found = entries[i];
      break;
    }
  }
  _notesTagFilter = null;
  notesSwitchTab('npc');
  if (found) {
    // Подсветим карточку через небольшую задержку (ждём рендер)
    setTimeout(function() {
      var el = document.querySelector('.notes-entry-card[data-entry-id="' + found.id + '"]');
      if (el) { el.classList.add('highlight'); setTimeout(function(){ el.classList.remove('highlight'); }, 1500); }
    }, 80);
  }
}

// ── Модалка создания/редактирования entry ─────────────────────

var _notesModalEntryId = null; // null = новая запись
var _notesModalTags = [];      // рабочий список тегов модалки

function notesOpenEntryModal(id) {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return;

  var entry = null;
  if (id) {
    var entries = (char.notesV2 && char.notesV2.entries) || [];
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].id === id) { entry = entries[i]; break; }
    }
  }

  _notesModalEntryId = entry ? entry.id : null;
  _notesModalTags = entry ? (entry.tags || []).slice() : [];

  var modal = document.getElementById('notes-entry-modal');
  if (!modal) return;

  // Заполнить форму
  document.getElementById('nem-title').value = entry ? (entry.title || '') : '';
  document.getElementById('nem-body').value  = entry ? (entry.body  || '') : '';
  document.getElementById('nem-pinned').checked = entry ? !!entry.pinned : false;

  // Тип — для новой: текущий tab, для существующей — её type
  var typeSelect = document.getElementById('nem-type');
  var defaultType = entry ? entry.type : (_notesState.currentTab !== 'backstory' ? _notesState.currentTab : 'free');
  typeSelect.value = defaultType;

  _notesRenderModalTags();

  modal.classList.add('open');
  document.getElementById('nem-title').focus();
}

function notesCloseEntryModal() {
  var modal = document.getElementById('notes-entry-modal');
  if (modal) modal.classList.remove('open');
}

function _notesRenderModalTags() {
  var host = document.getElementById('nem-tags-list');
  if (!host) return;
  var html = '';
  for (var i = 0; i < _notesModalTags.length; i++) {
    var t = _notesModalTags[i];
    html += '<span class="notes-tag-chip small removable">' + escapeHtml(t) +
            '<button type="button" class="notes-tag-remove" onclick="notesRemoveModalTag(\'' + escapeHtml(t).replace(/'/g, "\\'") + '\')">×</button></span>';
  }
  host.innerHTML = html;
}

function notesAddModalTag() {
  var inp = document.getElementById('nem-tag-input');
  if (!inp) return;
  var val = inp.value.trim().replace(/[,;]/g, '');
  if (!val || _notesModalTags.indexOf(val) !== -1) { inp.value = ''; return; }
  _notesModalTags.push(val);
  inp.value = '';
  _notesRenderModalTags();
}

function notesModalTagKeydown(ev) {
  if (ev.key === 'Enter' || ev.key === ',') { ev.preventDefault(); notesAddModalTag(); }
}

function notesRemoveModalTag(tag) {
  var idx = _notesModalTags.indexOf(tag);
  if (idx !== -1) _notesModalTags.splice(idx, 1);
  _notesRenderModalTags();
}

function notesSaveEntryModal() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return;
  char.notesV2 = char.notesV2 || { sections: {}, entries: [], prefs: {} };
  if (!Array.isArray(char.notesV2.entries)) char.notesV2.entries = [];

  var title  = (document.getElementById('nem-title').value || '').trim();
  var body   = document.getElementById('nem-body').value || '';
  var type   = document.getElementById('nem-type').value || 'free';
  var pinned = document.getElementById('nem-pinned').checked;
  var now    = Date.now();

  var isNew = !_notesModalEntryId;
  if (_notesModalEntryId) {
    // Обновление
    for (var i = 0; i < char.notesV2.entries.length; i++) {
      if (char.notesV2.entries[i].id === _notesModalEntryId) {
        var e = char.notesV2.entries[i];
        e.title = title; e.body = body; e.type = type;
        e.tags = _notesModalTags.slice(); e.pinned = pinned;
        e.updatedAt = now;
        break;
      }
    }
  } else {
    // Новая запись
    var entry = (typeof createEntry === 'function') ? createEntry(type) : { id: 'e'+now, type: type, title: '', body: '', tags: [], pinned: false, createdAt: now, updatedAt: now };
    entry.title = title; entry.body = body;
    entry.tags = _notesModalTags.slice(); entry.pinned = pinned;
    char.notesV2.entries.push(entry);
  }

  // N6: автособытие в Журнал
  _notesLogJournal(isNew ? 'create' : 'update', type, title);

  if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
  _notesFlashSaved();
  notesCloseEntryModal();

  // Переключиться на вкладку типа, если отличается
  if (_notesState.currentTab !== type && type !== 'backstory') {
    _notesTagFilter = null;
    notesSwitchTab(type);
  } else {
    _renderNotesMain();
  }
}

function notesDeleteEntry(id) {
  if (!confirm('Удалить запись?')) return;
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char || !char.notesV2 || !Array.isArray(char.notesV2.entries)) return;
  // Найдём, чтобы залогировать
  var removed = null;
  for (var i = 0; i < char.notesV2.entries.length; i++) {
    if (char.notesV2.entries[i].id === id) { removed = char.notesV2.entries[i]; break; }
  }
  char.notesV2.entries = char.notesV2.entries.filter(function(e){ return e.id !== id; });
  if (removed) _notesLogJournal('delete', removed.type, removed.title);
  if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
  _renderNotesMain();
}

function notesTogglePin(id) {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char || !char.notesV2) return;
  var entries = char.notesV2.entries || [];
  var maxPinOrder = -1;
  for (var j = 0; j < entries.length; j++) {
    if (entries[j].pinned && typeof entries[j].pinOrder === 'number' && entries[j].pinOrder > maxPinOrder) {
      maxPinOrder = entries[j].pinOrder;
    }
  }
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].id === id) {
      entries[i].pinned = !entries[i].pinned;
      entries[i].updatedAt = Date.now();
      if (entries[i].pinned) {
        // Новая закрёпка — в конец группы
        entries[i].pinOrder = maxPinOrder + 1;
      } else {
        // Открепили — сбросим pinOrder, чтобы при повторном закрепе — снова в конец
        delete entries[i].pinOrder;
      }
      _notesLogJournal(entries[i].pinned ? 'pin' : 'unpin', entries[i].type, entries[i].title);
      break;
    }
  }
  if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
  _renderNotesMain();
}

// ── N6: Автособытия в Журнал персонажа ───────────────────────
/** Записать событие об изменении записи в общий Журнал.
 *  op: 'create' | 'update' | 'delete' | 'pin' | 'unpin'
 *  type: ключ NOTES_TABS (npc/quest/…) — определяет лейбл
 *  title: название записи (может быть пустым)
 */
function _notesLogJournal(op, type, title) {
  if (typeof addJournalEntry !== 'function') return;
  var tab = _findTab(type);
  var typeLabel = tab ? tab.label : (type || 'Запись');
  var name = (title || '').trim() || '(без названия)';
  var opWords = {
    create: 'Создана',
    update: 'Обновлена',
    delete: 'Удалена',
    pin:    'Закреплена',
    unpin:  'Откреплена'
  };
  var word = opWords[op] || 'Изменена';
  try {
    addJournalEntry('note', word + ' запись «' + name + '»', typeLabel);
  } catch(e) { /* не мешаем основному потоку */ }
}

// ── N5: Поиск ────────────────────────────────────────────────

var _notesSearchQuery = '';
var _notesSearchTimer = null;

function notesSearchInput(val) {
  _notesSearchQuery = val || '';
  if (_notesSearchTimer) clearTimeout(_notesSearchTimer);
  _notesSearchTimer = setTimeout(function() { _renderNotesMain(); }, 180);
}

function notesSearchKeydown(ev) {
  if (ev.key === 'Escape') {
    _notesSearchQuery = '';
    var el = document.getElementById('notes-search');
    if (el) el.value = '';
    _renderNotesMain();
  } else if (ev.key === 'Enter') {
    // Перейти к следующему совпадению
    var marks = document.querySelectorAll('#notes-main mark.notes-hl');
    if (!marks.length) return;
    _notesSearchIdx = ((_notesSearchIdx || 0) + 1) % marks.length;
    marks[_notesSearchIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

var _notesSearchIdx = 0;

/** Подсветить совпадения query в тексте (безопасный escapeHtml уже применён к text). */
function _hlText(text, query) {
  if (!query || !text) return text;
  var escaped = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    var re = new RegExp('(' + escaped + ')', 'gi');
    return escapeHtml(text).replace(re, '<mark class="notes-hl">$1</mark>');
  } catch(e) { return escapeHtml(text); }
}

/** Рендер результатов поиска по всему notesV2. */
function _renderSearchResults() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char || !char.notesV2) return '<div class="notes-empty card">Нет данных.</div>';
  var q = _notesSearchQuery.trim().toLowerCase();
  if (!q) return '';

  var results = [];

  // Ищем по секциям
  var sec = char.notesV2.sections || {};
  for (var i = 0; i < NOTES_SECTIONS.length; i++) {
    var s = NOTES_SECTIONS[i];
    var val = sec[s.key] || '';
    if (val.toLowerCase().indexOf(q) !== -1) {
      results.push({ kind: 'section', secKey: s.key, icon: s.icon, label: s.label, body: val });
    }
  }

  // Ищем по entries
  var entries = char.notesV2.entries || [];
  for (var j = 0; j < entries.length; j++) {
    var e = entries[j];
    var inTitle = (e.title || '').toLowerCase().indexOf(q) !== -1;
    var inBody  = (e.body  || '').toLowerCase().indexOf(q) !== -1;
    var inTags  = (e.tags  || []).join(' ').toLowerCase().indexOf(q) !== -1;
    if (inTitle || inBody || inTags) {
      results.push({ kind: 'entry', entry: e });
    }
  }

  if (!results.length) {
    return '<div class="card notes-empty"><div class="notes-empty-ico">🔍</div>' +
           '<div class="notes-empty-title">Ничего не найдено</div>' +
           '<div class="notes-empty-hint">По запросу «' + escapeHtml(_notesSearchQuery) + '»</div></div>';
  }

  var qRaw = _notesSearchQuery.trim();
  var html = '<div class="notes-search-count">' + results.length + ' совп. для «' + escapeHtml(qRaw) + '» · <button class="notes-search-clear" onclick="notesClearSearch()">✕ Очистить</button></div>';
  html += '<div class="notes-entries-list">';

  for (var k = 0; k < results.length; k++) {
    var r = results[k];
    if (r.kind === 'section') {
      var excerpt = r.body.slice(0, 300);
      if (r.body.length > 300) excerpt += '…';
      html += '<div class="notes-entry-card" onclick="notesSwitchTab(\'backstory\')">' +
        '<div class="notes-entry-header">' +
          '<span class="notes-entry-title">' + r.icon + ' ' + escapeHtml(r.label) + '</span>' +
          '<span style="font-size:0.75em;opacity:0.6">Предыстория</span>' +
        '</div>' +
        '<div class="notes-entry-body">' + _hlText(excerpt, qRaw) + '</div>' +
      '</div>';
    } else {
      var e2 = r.entry;
      var tab2 = _findTab(e2.type);
      var typeLabel = tab2 ? (tab2.icon + ' ' + tab2.label) : e2.type;
      var bodyExc = (e2.body || '').replace(/[#*`>_~\[\]]/g, '').trim().slice(0, 200);
      if ((e2.body || '').length > 200) bodyExc += '…';
      var tagsHtml = '';
      if (e2.tags && e2.tags.length) {
        tagsHtml = '<div class="notes-entry-tags">';
        for (var ti = 0; ti < e2.tags.length; ti++) {
          tagsHtml += '<span class="notes-tag-chip small">' + _hlText(e2.tags[ti], qRaw) + '</span>';
        }
        tagsHtml += '</div>';
      }
      html += '<div class="notes-entry-card' + (e2.pinned ? ' pinned' : '') + '" onclick="notesOpenEntryModal(\'' + e2.id + '\')">' +
        '<div class="notes-entry-header">' +
          '<span class="notes-entry-title">' + _hlText(e2.title || '(без названия)', qRaw) + '</span>' +
          '<span style="font-size:0.75em;opacity:0.6">' + typeLabel + '</span>' +
        '</div>' +
        (bodyExc ? '<div class="notes-entry-body">' + _hlText(bodyExc, qRaw) + '</div>' : '') +
        tagsHtml +
      '</div>';
    }
  }
  html += '</div>';
  _notesSearchIdx = -1;
  return html;
}

function notesClearSearch() {
  _notesSearchQuery = '';
  var el = document.getElementById('notes-search');
  if (el) el.value = '';
  _renderNotesMain();
}

// ── N5: Меню ⋯ ────────────────────────────────────────────────

var _notesMenuOpen = false;

function notesToggleMenu(ev) {
  ev.stopPropagation();
  var dd = document.getElementById('notes-menu-dropdown');
  if (!dd) return;
  _notesMenuOpen = !_notesMenuOpen;
  dd.style.display = _notesMenuOpen ? 'flex' : 'none';
  if (_notesMenuOpen) {
    setTimeout(function() {
      document.addEventListener('click', _notesMenuClose, { once: true });
    }, 0);
  }
}

function _notesMenuClose() {
  _notesMenuOpen = false;
  var dd = document.getElementById('notes-menu-dropdown');
  if (dd) dd.style.display = 'none';
}

function notesMenuAction(action) {
  _notesMenuClose();
  if (action === 'export-md')   { notesExportMd(); }
  else if (action === 'export-json') { notesExportJson(); }
  else if (action === 'import-json') {
    var inp = document.getElementById('notes-import-json-input');
    if (inp) { inp.value = ''; inp.click(); }
  } else if (action === 'import-md') {
    var inp2 = document.getElementById('notes-import-md-input');
    if (inp2) { inp2.value = ''; inp2.click(); }
  } else if (action === 'print') { notesPrint(); }
}

// ── N5: Экспорт ──────────────────────────────────────────────

function _notesCharName() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  return (char && char.name) ? char.name : 'Персонаж';
}

function _notesTriggerDownload(content, filename, mime) {
  var blob = new Blob([content], { type: mime });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
}

function notesExportMd() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return;
  var nv = char.notesV2 || {};
  var sec = nv.sections || {};
  var entries = nv.entries || [];
  var lines = ['# Записи: ' + _notesCharName(), ''];

  // Секции
  lines.push('## 📖 Предыстория', '');
  for (var i = 0; i < NOTES_SECTIONS.length; i++) {
    var s = NOTES_SECTIONS[i];
    var val = sec[s.key] || '';
    if (val.trim()) {
      lines.push('### ' + s.icon + ' ' + s.label, '', val, '');
    }
  }

  // Entries по типам
  var byType = {};
  for (var j = 0; j < entries.length; j++) {
    var e = entries[j];
    if (!byType[e.type]) byType[e.type] = [];
    byType[e.type].push(e);
  }
  for (var ti = 0; ti < NOTES_TABS.length; ti++) {
    var tab = NOTES_TABS[ti];
    if (tab.kind !== 'entries') continue;
    var list = byType[tab.key] || [];
    if (!list.length) continue;
    lines.push('## ' + tab.icon + ' ' + tab.label, '');
    for (var k = 0; k < list.length; k++) {
      var en = list[k];
      lines.push('### ' + (en.pinned ? '★ ' : '') + (en.title || '(без названия)'));
      if (en.tags && en.tags.length) lines.push('**Теги:** ' + en.tags.join(', '));
      if (en.body) lines.push('', en.body);
      lines.push('');
    }
  }

  var ts = new Date().toISOString().slice(0,10);
  _notesTriggerDownload(lines.join('\n'), _notesCharName() + '-notes-' + ts + '.md', 'text/markdown;charset=utf-8');
}

function notesExportJson() {
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return;
  var payload = { charName: _notesCharName(), exportedAt: new Date().toISOString(), notesV2: char.notesV2 || {} };
  var ts = new Date().toISOString().slice(0,10);
  _notesTriggerDownload(JSON.stringify(payload, null, 2), _notesCharName() + '-notes-' + ts + '.json', 'application/json;charset=utf-8');
}

// ── N5: Импорт ───────────────────────────────────────────────

function notesHandleImportJson(input) {
  var file = input && input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var data = JSON.parse(ev.target.result);
      var incoming = data.notesV2 || data; // поддержка raw notesV2
      if (!incoming || typeof incoming !== 'object') throw new Error('Неверный формат');
      if (!confirm('Импортировать записи из «' + file.name + '»?\nДанные будут слиты с текущими (записи добавятся, секции — перезапишутся).')) return;
      var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
      if (!char) return;
      char.notesV2 = char.notesV2 || { sections: {}, entries: [], prefs: {} };
      // Секции: перезаписать если не пусты во входных данных
      if (incoming.sections && typeof incoming.sections === 'object') {
        char.notesV2.sections = char.notesV2.sections || {};
        for (var k in incoming.sections) {
          if (Object.prototype.hasOwnProperty.call(incoming.sections, k) && incoming.sections[k]) {
            char.notesV2.sections[k] = incoming.sections[k];
          }
        }
      }
      // Entries: добавить новые (по id)
      if (Array.isArray(incoming.entries)) {
        char.notesV2.entries = char.notesV2.entries || [];
        var existIds = {};
        for (var i = 0; i < char.notesV2.entries.length; i++) existIds[char.notesV2.entries[i].id] = true;
        for (var j = 0; j < incoming.entries.length; j++) {
          var en = incoming.entries[j];
          if (en && en.id && !existIds[en.id]) {
            char.notesV2.entries.push(en);
            existIds[en.id] = true;
          }
        }
      }
      if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
      _notesFlashSaved();
      renderNotes();
    } catch(e) {
      alert('Ошибка импорта JSON: ' + e.message);
    }
  };
  reader.readAsText(file, 'utf-8');
  input.value = '';
}

function notesHandleImportMd(input) {
  var file = input && input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    var text = ev.target.result || '';
    if (!text.trim()) return;
    var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
    if (!char) return;
    char.notesV2 = char.notesV2 || { sections: {}, entries: [], prefs: {} };
    if (!Array.isArray(char.notesV2.entries)) char.notesV2.entries = [];
    var now = Date.now();
    var dateStr = new Date().toLocaleDateString('ru-RU');
    var entry = {
      id: 'import_' + now,
      type: 'free',
      title: 'Импорт «' + file.name + '» от ' + dateStr,
      body: text,
      tags: ['импорт'],
      pinned: false,
      createdAt: now,
      updatedAt: now
    };
    char.notesV2.entries.push(entry);
    if (typeof saveToLocalDebounced === 'function') saveToLocalDebounced();
    _notesFlashSaved();
    notesSwitchTab('free');
  };
  reader.readAsText(file, 'utf-8');
  input.value = '';
}

// ── N5: Печать ───────────────────────────────────────────────

function notesPrint() {
  // Временно раскроем все секции (снимем preview-скрытие)
  var textareas = document.querySelectorAll('#notes-main .notes-section-input[style*="display:none"]');
  for (var i = 0; i < textareas.length; i++) textareas[i].style.removeProperty('display');
  window.print();
}

// ── Индикатор «✓ сохранено HH:MM» ─────────────────────────────
var _notesSaveTimer = null;
function _notesFlashSaved() {
  var el = document.getElementById('notes-save-ind');
  if (!el) return;
  var d = new Date();
  var hh = String(d.getHours()).padStart(2, '0');
  var mm = String(d.getMinutes()).padStart(2, '0');
  el.textContent = '✓ сохранено ' + hh + ':' + mm;
  el.classList.add('visible');
  if (_notesSaveTimer) clearTimeout(_notesSaveTimer);
  _notesSaveTimer = setTimeout(function(){ el.classList.remove('visible'); }, 2000);
}

// ── Автоперерисовка при загрузке персонажа ───────────────────
// loadCharacter() заполняет legacy-textarea — после него подтянем notesV2 → UI.
(function(){
  var _prevLoad = (typeof window !== 'undefined') ? window.loadCharacter : null;
  if (typeof window !== 'undefined') {
    var orig = window.loadCharacter;
    if (typeof orig === 'function') {
      window.loadCharacter = function() {
        var r = orig.apply(this, arguments);
        try {
          var notesTab = document.getElementById('tab-notes');
          if (notesTab && notesTab.classList.contains('active')) {
            _notesState.currentTab = null; // перечитать prefs
            renderNotes();
          }
        } catch(e) {}
        return r;
      };
    }
  }
})();
