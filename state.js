/**
 * Модуль управления состоянием приложения (Reactivity Core)
 * @typedef {Object} CharacterData
 * @property {string} name
 * @property {number} level
 * @property {string} classType
 * @property {Object} stats
 * @property {Array} inventory
 * @property {Array} spells
 */

const appState = {
  data: {},
  listeners: [],

  /**
   * Подписка на изменения состояния
   * @param {Function} callback - Функция, вызываемая при изменении
   */
  subscribe(callback) {
    this.listeners.push(callback);
  },

  /**
   * Безопасное обновление состояния
   * @param {Partial<CharacterData>} newData 
   */
  setState(newData) {
    this.data = { ...this.data, ...newData };
    this.listeners.forEach(cb => cb(this.data));
    saveToLocalDebounced();
  },

  /**
   * Инициализация из localStorage
   */
  init() {
    const saved = loadFromLocal();
    if (saved) this.data = saved;
    else this.data = { name: '', level: 1, classType: '', stats: {}, inventory: [], spells: [] };
  },

  get() {
    return this.data;
  }
};

// Авто-инициализация при загрузке модуля
if (typeof window !== 'undefined') {
  appState.init();
}
