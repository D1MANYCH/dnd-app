// Базовые тесты для проверки целостности v2.0.0

describe('App Core Logic', () => {
  test('debounce function should exist', () => {
    expect(typeof debounce).toBe('function');
  });
  
  test('appState module should be initialized', () => {
    expect(typeof appState).toBe('object');
    expect(typeof appState.setState).toBe('function');
  });

  test('state should have default structure', () => {
    appState.init();
    const data = appState.get();
    expect(data).toHaveProperty('level');
    expect(data.level).toBe(1);
  });
});
