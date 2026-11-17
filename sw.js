// ============================================================
// sw.js — Service Worker для офлайн-работы D&D Sheet
// ============================================================

const CACHE_NAME = 'dnd-sheet-v621';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app-log.js',
  './icons.js',
  './bg-space.js',
  './dice-arena-bg.js',
  './data.js',
  './data-2024.js',
  './build-notes-data.js',
  './character-builds.js',
  './glossary-data.js',
  './spells.js',
  './spell-effects.js',
  './rules.js',
  './app-migrate.js',
  './app-builds.js',
  './app-core.js',
  './app-io.js',
  './app-backup.js',
  './app-sync.js',
  './app-combat.js',
  './app-conditions.js',
  './app-cast-effects.js',
  './app-proficiencies.js',
  './app-hp.js',
  './app-wildshape.js',
  './app-spells.js',
  './start-equip-2014.js',
  './class-choices.js',
  './subclass-choices-data.js',
  './app-notes.js',
  './notes-gen-data.js',
  './assets/schools/abjuration.webp',
  './assets/schools/conjuration.webp',
  './assets/schools/divination.webp',
  './assets/schools/enchantment.webp',
  './assets/schools/evocation.webp',
  './assets/schools/illusion.webp',
  './assets/schools/necromancy.webp',
  './assets/schools/transmutation.webp',
  './assets/abilities/cha.webp',
  './assets/abilities/constitution.webp',
  './assets/abilities/dex.webp',
  './assets/abilities/int.webp',
  './assets/abilities/str.webp',
  './assets/abilities/wis.webp',
  './assets/avatar-fallback.webp',
  './assets/bg-body.webp',
  './assets/classes/barbarian.webp',
  './assets/classes/bard.webp',
  './assets/classes/cleric.webp',
  './assets/classes/druid.webp',
  './assets/classes/fighter.webp',
  './assets/classes/monk.webp',
  './assets/classes/paladin.webp',
  './assets/classes/ranger.webp',
  './assets/classes/rogue.webp',
  './assets/classes/sorcerer.webp',
  './assets/classes/warlock.webp',
  './assets/classes/wizard.webp',
  './assets/conditions/blinded.webp',
  './assets/conditions/charmed.webp',
  './assets/conditions/deafened.webp',
  './assets/conditions/exhaustion_1.webp',
  './assets/conditions/exhaustion_2.webp',
  './assets/conditions/exhaustion_3.webp',
  './assets/conditions/exhaustion_4.webp',
  './assets/conditions/exhaustion_5.webp',
  './assets/conditions/exhaustion_6.webp',
  './assets/conditions/frightened.webp',
  './assets/conditions/grappled.webp',
  './assets/conditions/incapacitated.webp',
  './assets/conditions/invisible.webp',
  './assets/conditions/paralyzed.webp',
  './assets/conditions/petrified.webp',
  './assets/conditions/poisoned.webp',
  './assets/conditions/prone.webp',
  './assets/conditions/restrained.webp',
  './assets/conditions/stunned.webp',
  './assets/conditions/unconscious.webp',
  './assets/d20-fab.webp',
  './assets/textures/dice-tray.jpg',
  './app-inventory.js',
  './magic-items.js',
  './gear-catalog.js',
  './app-party.js',
  './monsters-srd.js',
  './npc-srd.js',
  './beast-forms.js',
  './app-dice.js',
  './app-settings.js',
  './app-ui.js',
  './app-home.js',
  './app-asi.js',
  './app-creator.js',
  './app-progress.js',
  './app-desktop.js',
  './history-stack.js',
  './app-help.js',
  './app-wiki.js',
  './app-sheet2.js',
  './app-pdf.js',
  './vendor/jspdf/jspdf.umd.min.js',
  './vendor/jspdf/roboto-base64.js',
  './vendor/fonts/eb-garamond-cyrillic-400-normal.woff2',
  './vendor/fonts/eb-garamond-cyrillic-600-normal.woff2',
  './vendor/fonts/eb-garamond-cyrillic-700-normal.woff2',
  './vendor/fonts/eb-garamond-latin-400-normal.woff2',
  './vendor/fonts/eb-garamond-latin-600-normal.woff2',
  './vendor/fonts/eb-garamond-latin-700-normal.woff2',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon-96.png',
  // DICE2-1: @3d-dice/dice-box vendor (ES-модуль + воркеры + ассеты)
  './vendor/dice-box/dice-box.es.js',
  './vendor/dice-box/world.offscreen.js',
  './vendor/dice-box/world.onscreen.js',
  './vendor/dice-box/world.none.js',
  './vendor/dice-box/Dice.js',
  './vendor/dice-box/assets/ammo/ammo.wasm.wasm',
  './vendor/dice-box/assets/themes/default/theme.config.json',
  './vendor/dice-box/assets/themes/default/default.json',
  './vendor/dice-box/assets/themes/default/diffuse-dark.png',
  './vendor/dice-box/assets/themes/default/diffuse-light.png',
  './vendor/dice-box/assets/themes/default/normal.png',
  './vendor/dice-box/assets/themes/default/specular.jpg',
  // AUD-2 (W5): выбираемые темы костей (по умолчанию steel)
  './vendor/dice-box/assets/themes/steel/default.json',
  './vendor/dice-box/assets/themes/steel/diffuse-dark.png',
  './vendor/dice-box/assets/themes/steel/diffuse-light.png',
  './vendor/dice-box/assets/themes/steel/normal.png',
  './vendor/dice-box/assets/themes/steel/specular.jpg',
  './vendor/dice-box/assets/themes/steel/theme.config.json',
  './vendor/dice-box/assets/themes/rock/diffuse-dark.png',
  './vendor/dice-box/assets/themes/rock/diffuse-light.png',
  './vendor/dice-box/assets/themes/rock/normal.png',
  './vendor/dice-box/assets/themes/rock/smoothDice.json',
  './vendor/dice-box/assets/themes/rock/specularity.jpg',
  './vendor/dice-box/assets/themes/rock/theme.config.json',
  './vendor/dice-box/assets/themes/wooden/diffuse.jpg',
  './vendor/dice-box/assets/themes/wooden/normal.png',
  './vendor/dice-box/assets/themes/wooden/smoothDice.json',
  './vendor/dice-box/assets/themes/wooden/specularity.jpg',
  './vendor/dice-box/assets/themes/wooden/theme.config.json',
  './vendor/dice-box/assets/themes/smooth/diffuse-dark.png',
  './vendor/dice-box/assets/themes/smooth/diffuse-light.png',
  './vendor/dice-box/assets/themes/smooth/normal.png',
  './vendor/dice-box/assets/themes/smooth/smoothDice.json',
  './vendor/dice-box/assets/themes/smooth/theme.config.json'
];

// Хэши файлов прекеша — пишет tools/file-hashes.js (через /bump), руками не править.
const FILE_HASHES = {
  './': '0d6fdcc448d119aa5231',
  './index.html': '0d6fdcc448d119aa5231',
  './style.css': '755d4ca4bf56d9d7dd84',
  './app-log.js': '54f5eed79eb54ac7de54',
  './icons.js': '28370adcc628dbc457a0',
  './bg-space.js': '8f5ddcbae1e763435ff8',
  './dice-arena-bg.js': '8c311fce0b0af8d5ef13',
  './data.js': '5e1629e55fea3cb76b64',
  './data-2024.js': '437a6d12f1c87e414d5a',
  './build-notes-data.js': '707838037f539baa77ed',
  './character-builds.js': '77b42fd37a288578a7d2',
  './glossary-data.js': '9527a894523806e106db',
  './spells.js': 'f44fcfe7081c578aac02',
  './spell-effects.js': '066847944196c692fd2e',
  './rules.js': 'c1edf21aa5c2a445f6a4',
  './app-migrate.js': '94a9bf363387c9c40c4f',
  './app-builds.js': 'f782f41240b09b62aa78',
  './app-core.js': '3b1181c76fcf8206a235',
  './app-io.js': '9e3bd77057751774d538',
  './app-backup.js': '92999f765d89fbd6a031',
  './app-sync.js': 'a147ab8b27f2084ba22a',
  './app-combat.js': 'dc225d21f1b75797f4b3',
  './app-conditions.js': 'a50363d1bbeee4b92144',
  './app-cast-effects.js': '1431df4b5df9a39f9f04',
  './app-proficiencies.js': '0efc3e243910a2132656',
  './app-hp.js': 'cfeb68e3ccc368e4abf1',
  './app-wildshape.js': '356c3cbc0f470d2a0335',
  './app-spells.js': '1994f5a4c809346271e4',
  './start-equip-2014.js': 'db43ddf7f29bad11cd8c',
  './class-choices.js': 'fd71dff5fa313dbb98b4',
  './subclass-choices-data.js': '9828e4be608849230bc0',
  './app-notes.js': '8058789d83ffd54560ac',
  './notes-gen-data.js': '4e79af340e55516dd838',
  './assets/schools/abjuration.webp': '16484747b2a6b35a3a0b',
  './assets/schools/conjuration.webp': 'c980b50f10d846373a66',
  './assets/schools/divination.webp': '94b447a9d11f779e2e62',
  './assets/schools/enchantment.webp': '8bbe9eacc498040ae4bc',
  './assets/schools/evocation.webp': 'd19632b6712801ced8bc',
  './assets/schools/illusion.webp': '972b38ad79cf00c88f79',
  './assets/schools/necromancy.webp': '5d940ebbadecebca806a',
  './assets/schools/transmutation.webp': '4270275b938c3a11de96',
  './assets/abilities/cha.webp': 'd9b4729b268a13514074',
  './assets/abilities/constitution.webp': '71cca6db53b3ee47aa9c',
  './assets/abilities/dex.webp': 'd902540c02544b139a99',
  './assets/abilities/int.webp': '6090ca6b52e416188890',
  './assets/abilities/str.webp': '6a570575ce2fcd5292f5',
  './assets/abilities/wis.webp': '68656cad395c01ddb735',
  './assets/avatar-fallback.webp': 'a37827e78c5141e03938',
  './assets/bg-body.webp': '08c13dd0db7ab1de0ab1',
  './assets/classes/barbarian.webp': '419ceb5d5fd2f1467fea',
  './assets/classes/bard.webp': 'b966e591729c6c5187a3',
  './assets/classes/cleric.webp': '573726d7d52c1da5b735',
  './assets/classes/druid.webp': '39754eefe0fae5c6e284',
  './assets/classes/fighter.webp': 'ac882ef33feeb1c83207',
  './assets/classes/monk.webp': '27c15f16a891d32fcd5e',
  './assets/classes/paladin.webp': 'fca3381c66f37f54d3c6',
  './assets/classes/ranger.webp': 'de2468db65972b478e9c',
  './assets/classes/rogue.webp': '150f99ba37364d4e8e17',
  './assets/classes/sorcerer.webp': 'bf3106ad8cf875c52704',
  './assets/classes/warlock.webp': '8edad154f589448627f9',
  './assets/classes/wizard.webp': '38796ad0fee1bf166d03',
  './assets/conditions/blinded.webp': 'b743fa604fcf9ab04afd',
  './assets/conditions/charmed.webp': '8d51af07a8e573c50dd2',
  './assets/conditions/deafened.webp': 'd33f7c3e318573503b80',
  './assets/conditions/exhaustion_1.webp': 'b04b590b29b170ae41e9',
  './assets/conditions/exhaustion_2.webp': '6b39403448201b053b0f',
  './assets/conditions/exhaustion_3.webp': 'fb2f2487bc1ffbe8cbc7',
  './assets/conditions/exhaustion_4.webp': 'ae2afddd330860663fc5',
  './assets/conditions/exhaustion_5.webp': '24a52f98ed8592d8d61a',
  './assets/conditions/exhaustion_6.webp': 'b332a4ae64aa32762fa7',
  './assets/conditions/frightened.webp': 'aa11468757cb6b36914a',
  './assets/conditions/grappled.webp': '45d3478bf91c81fd7ce2',
  './assets/conditions/incapacitated.webp': 'be2848f4391b1bdf5613',
  './assets/conditions/invisible.webp': '60daf440ac6adf7ded4b',
  './assets/conditions/paralyzed.webp': '8fa50867338183f18f1c',
  './assets/conditions/petrified.webp': '56cee114ab60e4e2cd1d',
  './assets/conditions/poisoned.webp': 'eab64394120770dd3d43',
  './assets/conditions/prone.webp': '63f5fa8837cd4274574f',
  './assets/conditions/restrained.webp': '4bea952047547639f1ff',
  './assets/conditions/stunned.webp': 'b8720542d609eaac572e',
  './assets/conditions/unconscious.webp': '48d48a5d637ee0b3edf0',
  './assets/d20-fab.webp': '16fa31348567bf909cbf',
  './assets/textures/dice-tray.jpg': '92822b7a73279a5fafbe',
  './app-inventory.js': 'cb53b1deb2bb7a770c09',
  './magic-items.js': '76df82a7548e225acf8a',
  './gear-catalog.js': 'bbfe37396d69eb804c6a',
  './app-party.js': '5097de4c7ccc3da0b9fe',
  './monsters-srd.js': 'b8abf656f043b05c1413',
  './npc-srd.js': 'a37a24e4b38892ea9e86',
  './beast-forms.js': '5faf66aae2eb4581a3f8',
  './app-dice.js': '79730e57a78b7ca01d60',
  './app-settings.js': '16732d53358f047422ad',
  './app-ui.js': '3e505ff07341ae0c9277',
  './app-home.js': 'e32f75f66e05b1b12741',
  './app-asi.js': 'e0bf292e1c3e20dd5ad7',
  './app-creator.js': '68c9f70811c5e4f2add1',
  './app-progress.js': 'c1eca9c1fc97aaaa2d86',
  './app-desktop.js': '3e4f78e611e4179f9382',
  './history-stack.js': '4f49b495185044eec959',
  './app-help.js': 'b419ce997af5f18c3701',
  './app-wiki.js': '864102ed8393fc5b75cf',
  './app-sheet2.js': '1fce7a82bb335f0c2db5',
  './app-pdf.js': 'fe93586152b8088dbfab',
  './vendor/jspdf/jspdf.umd.min.js': '85ba2cc3ff858a20fa49',
  './vendor/jspdf/roboto-base64.js': '39d97e962c5848003719',
  './vendor/fonts/eb-garamond-cyrillic-400-normal.woff2': '35a2e24a40899ed58caa',
  './vendor/fonts/eb-garamond-cyrillic-600-normal.woff2': '59bfda8adc364a2840fc',
  './vendor/fonts/eb-garamond-cyrillic-700-normal.woff2': 'e7a18bbb7467077a9832',
  './vendor/fonts/eb-garamond-latin-400-normal.woff2': 'b63448e2680a0dbde70e',
  './vendor/fonts/eb-garamond-latin-600-normal.woff2': 'ab02e032e749d28f6d23',
  './vendor/fonts/eb-garamond-latin-700-normal.woff2': '5d0f8a497a48fd2a3611',
  './manifest.json': '8f85ba5296c14ae8cf88',
  './icons/icon-192.png': '285ac3830193b3308c59',
  './icons/icon-512.png': '9d462208d91c8bbec688',
  './icons/icon-maskable-192.png': '5487d3cbe6a1d97f5057',
  './icons/icon-maskable-512.png': 'c74d6ce2676fbb31fce9',
  './icons/apple-touch-icon.png': 'a558e261920170f10b9a',
  './icons/icon-96.png': '9c877334a8129b12becf',
  './vendor/dice-box/dice-box.es.js': 'd1caccae54bd074c84ee',
  './vendor/dice-box/world.offscreen.js': '0abc59c784c8c4f92de3',
  './vendor/dice-box/world.onscreen.js': '5ee5637cd51e63f29226',
  './vendor/dice-box/world.none.js': 'b5c079e5f7d11c41a3c9',
  './vendor/dice-box/Dice.js': '252b30b2f7f405f1b05e',
  './vendor/dice-box/assets/ammo/ammo.wasm.wasm': '007a4e93dce707e222e5',
  './vendor/dice-box/assets/themes/default/theme.config.json': '4f55c758bca4c1040565',
  './vendor/dice-box/assets/themes/default/default.json': '26bf6fb1edea72296208',
  './vendor/dice-box/assets/themes/default/diffuse-dark.png': 'acf62205d3af96937599',
  './vendor/dice-box/assets/themes/default/diffuse-light.png': 'de15a8eed40be8123d30',
  './vendor/dice-box/assets/themes/default/normal.png': '77b7b5102d4190391d11',
  './vendor/dice-box/assets/themes/default/specular.jpg': '2af3b8a5da79f9b7953c',
  './vendor/dice-box/assets/themes/steel/default.json': '26bf6fb1edea72296208',
  './vendor/dice-box/assets/themes/steel/diffuse-dark.png': 'acf62205d3af96937599',
  './vendor/dice-box/assets/themes/steel/diffuse-light.png': 'de15a8eed40be8123d30',
  './vendor/dice-box/assets/themes/steel/normal.png': '8537c1015de5cc33d202',
  './vendor/dice-box/assets/themes/steel/specular.jpg': '55d3eee2b69008ad3701',
  './vendor/dice-box/assets/themes/steel/theme.config.json': '6b3ca85984f8dc9c3eb9',
  './vendor/dice-box/assets/themes/rock/diffuse-dark.png': 'f861e7f261b02d42188f',
  './vendor/dice-box/assets/themes/rock/diffuse-light.png': '991a1f69dda17587d686',
  './vendor/dice-box/assets/themes/rock/normal.png': 'eb092f16304b7b2a04c2',
  './vendor/dice-box/assets/themes/rock/smoothDice.json': '09137cad0f4fc2a6e4ce',
  './vendor/dice-box/assets/themes/rock/specularity.jpg': 'd53268766990e5727866',
  './vendor/dice-box/assets/themes/rock/theme.config.json': '414acdca17311dec916e',
  './vendor/dice-box/assets/themes/wooden/diffuse.jpg': '2571669dce5516d9dbf9',
  './vendor/dice-box/assets/themes/wooden/normal.png': 'c98a9d87669c9dd82a6d',
  './vendor/dice-box/assets/themes/wooden/smoothDice.json': '09137cad0f4fc2a6e4ce',
  './vendor/dice-box/assets/themes/wooden/specularity.jpg': '15a9e6f4973f506c43dc',
  './vendor/dice-box/assets/themes/wooden/theme.config.json': 'd460120a2d32ec178043',
  './vendor/dice-box/assets/themes/smooth/diffuse-dark.png': 'c99c0b07f56e6ce5faa9',
  './vendor/dice-box/assets/themes/smooth/diffuse-light.png': '5ae9e8609a04c54e2c6a',
  './vendor/dice-box/assets/themes/smooth/normal.png': '5caee4a33272b3cf519b',
  './vendor/dice-box/assets/themes/smooth/smoothDice.json': '09137cad0f4fc2a6e4ce',
  './vendor/dice-box/assets/themes/smooth/theme.config.json': '54af6c296035df11d30e'
};

const OPTIONAL_RE = /^\.\/(assets|icons|vendor\/dice-box\/assets\/themes)\//;
const PRECACHE_PARALLEL = 6;
const PRECACHE_RETRY_MS = [1000, 3000];
const PRECACHE_IDLE_MS = 20000;
const HASH_LEN = 20;
const precacheStat = { reused: 0, fetched: 0, bytes: 0 };

function hashOf(resp) {
  return resp.arrayBuffer()
    .then((buf) => crypto.subtle.digest('SHA-256', buf))
    .then((digest) => {
      const bytes = new Uint8Array(digest);
      let hex = '';
      for (let i = 0; i < bytes.length; i++) hex += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
      return hex.slice(0, HASH_LEN);
    });
}

// ОБН-1: прежние кеши приложения, новые первыми. Без crypto.subtle сверить
// содержимое нечем — тогда всё качается из сети, как раньше.
function openOldCaches() {
  if (!self.crypto || !self.crypto.subtle) return Promise.resolve([]);
  return caches.keys()
    .then((keys) => Promise.all(keys
      .filter((k) => k !== CACHE_NAME && /^dnd-sheet-v\d+$/.test(k))
      .sort((a, b) => b.slice(11) - a.slice(11))
      .map((k) => caches.open(k))))
    .catch(() => []);
}

// Файл из прежнего кеша берётся, только если хэш его содержимого совпал с хэшем
// новой версии; меткам старого кеша не доверяем. Любой сбой — файл уходит в сеть.
function reuseFromOld(cache, olds, u, i) {
  const want = FILE_HASHES[u];
  if (!want || i >= olds.length) return Promise.resolve(false);
  return olds[i].match(u)
    .then((resp) => {
      if (!resp || !resp.ok || resp.type !== 'basic') return false;
      return hashOf(resp.clone()).then((hash) => hash === want && cache.put(u, resp).then(() => true));
    })
    .catch(() => false)
    .then((ok) => ok || reuseFromOld(cache, olds, u, i + 1));
}

// Зависшее соединение не падает само: без таймаута установка стояла бы минутами.
// Счётчик простоя сбрасывается на каждом куске данных, поэтому медленная сеть
// не считается обрывом.
function storeWithRetry(cache, u, attempt) {
  const ctrl = new AbortController();
  let timer;
  function touch() {
    clearTimeout(timer);
    timer = setTimeout(() => ctrl.abort(), PRECACHE_IDLE_MS);
  }
  touch();
  return fetch(new Request(u, { cache: 'reload', signal: ctrl.signal }))
    .then((resp) => {
      if (!resp || !resp.ok) throw new Error('[SW] не скачан ' + u);
      touch();
      const reader = resp.clone().body.getReader();
      const watch = () => reader.read().then((part) => {
        if (part.done) return;
        touch();
        precacheStat.bytes += part.value.length;
        return watch();
      });
      return watch().then(() => cache.put(u, resp));
    })
    .then(() => { clearTimeout(timer); precacheStat.fetched++; })
    .catch((err) => {
      clearTimeout(timer);
      if (attempt >= PRECACHE_RETRY_MS.length) throw err;
      return new Promise((resolve) => setTimeout(resolve, PRECACHE_RETRY_MS[attempt]))
        .then(() => storeWithRetry(cache, u, attempt + 1));
    });
}

// Докачка: имя кеша меняется с каждой версией, поэтому файл из прерванной
// установки той же версии брать можно. Сбой обязательного файла останавливает
// очередь, уже скачанное остаётся до следующей попытки.
function precacheAll(cache, olds) {
  const total = FILES_TO_CACHE.length;
  const skipped = [];
  let next = 0, done = 0, percent = -1, failed = null;
  function report() {
    const p = Math.floor(done * 100 / total);
    if (p === percent) return;
    percent = p;
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      list.forEach((client) => client.postMessage({ type: 'PRECACHE_PROGRESS', percent: p }));
    });
  }
  function worker() {
    if (failed || next >= total) return Promise.resolve();
    const u = FILES_TO_CACHE[next++];
    return cache.match(u)
      .then((hit) => hit || reuseFromOld(cache, olds, u, 0).then((ok) => {
        if (ok) { precacheStat.reused++; return; }
        return storeWithRetry(cache, u, 0);
      }))
      .catch((err) => { if (OPTIONAL_RE.test(u)) skipped.push(u); else failed = err; })
      .then(() => { done++; report(); return worker(); });
  }
  const workers = [];
  for (let i = 0; i < PRECACHE_PARALLEL; i++) workers.push(worker());
  return Promise.all(workers).then(() => {
    if (failed) throw failed;
    // Необязательные файлы из обрыва связи — ещё одна попытка, когда очередь прошла
    return Promise.all(skipped.map((u) =>
      storeWithRetry(cache, u, PRECACHE_RETRY_MS.length).catch(() => null)));
  }).then(() => {
    console.log('[SW] Прекеш: из прежнего кеша ' + precacheStat.reused + ', из сети ' +
      precacheStat.fetched + ' (' + precacheStat.bytes + ' байт)');
    return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      list.forEach((client) => client.postMessage({
        type: 'PRECACHE_DONE', cache: CACHE_NAME, total: total,
        reused: precacheStat.reused, fetched: precacheStat.fetched, bytes: precacheStat.bytes
      }));
    }).catch(() => null);
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Кешируем файлы...');
      // {cache:'reload'} обходит HTTP-кеш браузера: при бампе CACHE_NAME
      // в кеш SW попадают РЕАЛЬНО свежие файлы. Иначе addAll берёт
      // устаревшие копии из disk-cache и клиент не получает новый код
      // после релиза. AUD-2 (W4): код обязателен — недокачанный файл срывает
      // установку, прежний SW и его полный кеш остаются. Картинки и темы
      // костей необязательны — их сбой установку не срывает.
      return openOldCaches().then((olds) => precacheAll(cache, olds));
    })
  );
  // НЕ вызываем skipWaiting() — ждём команды от пользователя через модалку
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // AUD-2 (W7): только свои кеши — на origin живут и другие PWA
          if (key !== CACHE_NAME && key.indexOf('dnd-sheet-') === 0) {
            console.log('[SW] Удаляем старый кеш:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Получаем команду "Установить" от пользователя
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// SHARE-2: share_target из manifest — файл из «Поделиться» (Telegram и др.)
// кладём в отдельный кеш и открываем приложение с ?share=1; забирает app-io.js.
const SHARE_CACHE = 'dnd-share-inbox';
function receiveSharedFile(request) {
  return request.formData().then((form) => {
    const file = form.get('file');
    if (!file || typeof file.text !== 'function') return null;
    return file.text().then((text) => caches.open(SHARE_CACHE).then((cache) =>
      cache.put('./share-inbox', new Response(text, { headers: { 'Content-Type': 'application/json' } }))));
  }).catch(() => null).then(() => Response.redirect('./index.html?share=1', 303));
}

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;
  if (/^https:\/\/([a-z0-9-]+\.)*(googleapis\.com|google\.com)\//.test(url)) return;
  if (event.request.method === 'POST' && new URL(url).pathname.endsWith('/share-target')) {
    event.respondWith(receiveSharedFile(event.request));
    return;
  }

  event.respondWith(
    // ignoreSearch: запросы идут с ?v=vN-токенами (index.html), а ключи прекеша —
    // без query. Без этого версионные запросы мимо прекеша → офлайн-cold-start
    // отдавал бы index.html вместо JS/CSS. Свежесть обеспечивает бамп CACHE_NAME
    // (activate чистит старый кеш, install прекеширует свежие копии cache:'reload').
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      if (response) return response;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // AUD-2 (W3): index.html — только для навигации, не вместо JS/картинок
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
