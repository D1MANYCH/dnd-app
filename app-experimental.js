(function () {
  const LUCK_LABEL = 'Проверка удачи';

  const rollLuck = (char) => {
    const bonus = char && char.stats ? getMod(char.stats.cha) : 0;
    return { label: LUCK_LABEL, value: Math.floor(Math.random() * 20) + 1 + bonus };
  };

  window.rollLuck = rollLuck;
})();
