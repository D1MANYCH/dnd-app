// ============================================================
// data-2024.js — Данные редакции D&D 2024 (Player's Handbook 2024)
// ============================================================
// Ленивый файл (грузится через ensureEdition2024() из index.html, НЕ в <script>).
// Заполняет EDITION_DATA['2024'] через registerEdition2024(): передаёт ТОЛЬКО
// таблицы, которые в 2024 отличаются от 2014; недостающие ключи наследуются от
// '2014' (см. registerEdition2024 в data.js).
//
// E24-0 (скелет): overrides пуст → '2024' полностью ≡ '2014'. Поведение 2024-
// персонажа в бете идентично 2014, но edition-слой и путь загрузки уже рабочие.
//
// Дорожная карта наполнения (каждая таблица — в своей фазе E24; тогда же call-sites
// этой таблицы переводятся на edData(char).X — решение о ленивом переводе, E24-0):
//   E24-1  CONDITIONS_2024        — состояния/истощение 2024
//   E24-2  SPELL_PREP_2024        — prepared-модель всех классов (заклинания)
//   E24-3  FEATS_2024             — черты 74 (origin/general/style/epic)
//   E24-4  SPECIES_2024           — виды 10 (без бонусов характеристик)
//   E24-5  BACKGROUNDS_2024       — предыстории 16 + характеристики от предыстории
//   E24-6  MASTERY_PROPS / w24    — мастерство оружия (8 приёмов)
//   E24-7…12  CLASS_FEATURES_2024 / SUBCLASS_FEATURES_2024 / SUBCLASSES_2024 /
//             SUBCLASS_LEVEL_2024 / CLASS_RESOURCES_2024 / CLASS_CHOICES_2024 /
//             SUBCLASS_CHOICES_2024 — по 2 класса на фазу
//   E24-13 MULTICLASS_PREREQUISITES_2024 / MULTICLASS_PROFICIENCIES_2024
// ============================================================

(function () {
  // Собираем 2024-переопределения. По мере наполнения фазами сюда добавляются
  // ключи из списка выше (например: overrides.CONDITIONS = CONDITIONS_2024;).
  var overrides = {};

  if (typeof registerEdition2024 === 'function') {
    registerEdition2024(overrides);
  } else if (typeof window !== 'undefined') {
    // Страховка на случай нарушения порядка загрузки: регистрируемся, как только
    // data.js определит registerEdition2024. В штатном потоке ветка не нужна —
    // data.js грузится eagerly до ленивого data-2024.js.
    window.__pendingEdition2024 = overrides;
  }
})();
