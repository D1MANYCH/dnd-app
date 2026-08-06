// ============================================================
// dice-arena-bg.js — космо-фон арены броска кубиков
// Локальная мини-сцена внутри #dsvg-container под канвасом dice-box.
// Палитра тема-зависимая: тёмный космос в тёмной теме, светлый «дневной»
// вариант в светлой (data-theme на <html>, читается каждый кадр).
// Публичный API: window.DiceArenaBg.{start, stop, pulse}
// ============================================================
(function () {
  'use strict';

  let canvas = null, ctx = null;
  let W = 0, H = 0, cx = 0, cy = 0;
  let dpr = 1;
  let isMobile = false;
  let time = 0;
  let rafId = 0;
  let reduce = false;
  let initedSize = false;
  let ro = null;

  // динамика для pulse()
  let speedMultiplier = 1;
  let targetSpeed = 1;

  let bgStars = [], nebulae = [], orbits = [], dustParticles = [], shockwaves = [];

  // PERF: арена — фикс-оверлей во весь экран, поэтому на ПК это 2–8 Мп на кадр.
  // Три меры против «куртки кубиков» на слабой машине:
  //   1) настоящий dpr под площадь (см. effectiveDpr) — на 1440×900 переход
  //      с dpr 2 на кап даёт 1.21 → 0.51 мс на кадр, это главный выигрыш;
  //   2) статичные слои (фон + туманности) и градиенты свечения/планет печём
  //      один раз на размер/вариант/тему, а не пересобираем каждый кадр —
  //      на GPU-канвасе это нейтрально, на программном рендере заметно;
  //   3) тариф lowFx — меньше звёзд/пыли, dpr=1, без хвостов орбит. Включается
  //      по слабому железу сразу и адаптивно, если кадры реально не укладываются.
  let staticLayer = null, staticKey = '';
  let glowGrad = null, glowKey = '';
  let planetCache = {};
  let lowFx = false;
  let slowFrames = 0, lastFrameT = 0;

  function detectLowFx() {
    try {
      if (localStorage.getItem('dnd_dice_lowfx') === '1') return true;
      if (localStorage.getItem('dnd_dice_lowfx') === '0') return false;
    } catch (e) {}
    try {
      if (navigator.deviceMemory && navigator.deviceMemory <= 4) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
    } catch (e) {}
    return false;
  }
  function rememberLowFx() {
    try { localStorage.setItem('dnd_dice_lowfx', '1'); } catch (e) {}
  }
  function invalidateCaches() {
    staticLayer = null; staticKey = '';
    glowGrad = null; glowKey = '';
    planetCache = {};
  }

  // UX-3: варианты фона арены. Палитра + флаги (орбиты/плотность звёзд).
  // cosmos — исходный космос (орбиты + тёплое золото); aurora — холодное
  // сияние (бирюза + фиолет); starfield — плотное звёздное поле без орбит.
  const VARIANTS = {
    cosmos: {
      bg: ['#0a1628', '#060e1f', '#030812'],
      orbit: [255, 190, 100], lead: [255, 230, 180], glow: [255, 180, 80],
      nebWarm: [160, 100, 50], nebCool: [60, 80, 140],
      star: [200, 215, 255], orbits: true, starScale: 1
    },
    aurora: {
      bg: ['#04140f', '#06121c', '#02090f'],
      orbit: [120, 230, 180], lead: [200, 255, 230], glow: [120, 220, 170],
      nebWarm: [80, 180, 140], nebCool: [120, 90, 200],
      star: [200, 255, 235], orbits: true, starScale: 1.1
    },
    starfield: {
      bg: ['#0a0a18', '#06060f', '#020208'],
      orbit: [200, 210, 255], lead: [230, 235, 255], glow: [150, 165, 230],
      nebWarm: [120, 90, 200], nebCool: [70, 90, 160],
      star: [220, 225, 255], orbits: false, starScale: 1.8
    }
  };
  // Светлые варианты тех же палитр (светлая тема приложения): фон — светлый
  // перивинкль в тон орбитальному bg-orbits, звёзды/орбиты — тёмные на светлом.
  const VARIANTS_LIGHT = {
    cosmos: {
      bg: ['#dbe4f2', '#c8d4e8', '#b2c1da'],
      orbit: [170, 120, 35], lead: [130, 90, 25], glow: [190, 140, 50],
      nebWarm: [190, 150, 90], nebCool: [120, 140, 190],
      star: [60, 80, 130], orbits: true, starScale: 1
    },
    aurora: {
      bg: ['#d6ece2', '#c4ded4', '#adcabf'],
      orbit: [35, 130, 95], lead: [25, 105, 75], glow: [50, 150, 110],
      nebWarm: [90, 170, 140], nebCool: [130, 110, 190],
      star: [45, 110, 90], orbits: true, starScale: 1.1
    },
    starfield: {
      bg: ['#dedfe9', '#ccd0e0', '#b8bdd2'],
      orbit: [80, 90, 160], lead: [60, 70, 140], glow: [100, 110, 180],
      nebWarm: [140, 120, 200], nebCool: [110, 130, 180],
      star: [70, 80, 140], orbits: false, starScale: 1.8
    }
  };
  let variant = 'cosmos';
  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }
  function V() {
    const set = isLightTheme() ? VARIANTS_LIGHT : VARIANTS;
    return set[variant] || set.cosmos;
  }
  function col(rgb, a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; }

  const rmMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function running() {
    return canvas && !document.hidden && !reduce;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initScene() {
    // Звёзды — 3 слоя, локальные координаты (внутри арены 0..W, 0..H)
    const sc = (V().starScale || 1) * (lowFx ? 0.45 : 1);
    const starCounts = (isMobile ? [35, 20, 8] : [70, 40, 15]).map(function (n) { return Math.round(n * sc); });
    bgStars = starCounts.map((count, layerIdx) => {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: rand(0, W),
          y: rand(0, H),
          size: rand(0.4, 0.8 + layerIdx * 0.5),
          baseOpacity: rand(0.18, 0.45 + layerIdx * 0.12),
          twinkleSpeed: rand(0.004, 0.018),
          twinkleOffset: rand(0, Math.PI * 2)
        });
      }
      return arr;
    });

    // Туманности — 2 (синяя + оранжевая)
    nebulae = [];
    for (let i = 0; i < 2; i++) {
      const angle = rand(0, Math.PI * 2);
      const dist = rand(20, Math.min(W, H) * 0.35);
      nebulae.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        radius: rand(50, 95),
        warm: i === 0,
        alpha: rand(0.018, 0.04),
        rotation: rand(0, Math.PI * 2),
        rotSpeed: rand(-0.0004, 0.0004)
      });
    }

    // Орбиты — 5 (без центральной звезды, поверх будет 3D-кубик)
    const minDim = Math.min(W, H);
    const halfDim = minDim / 2;
    const orbitDefs = [
      { relR: 0.22, speed: 1.4, dir: 1,  arcLen: 0.55, alpha: 0.18, planets: [] },
      { relR: 0.34, speed: 1.0, dir: -1, arcLen: 0.65, alpha: 0.20, planets: [{ type: 'cool', size: 7, offset: 0 }] },
      { relR: 0.48, speed: 0.7, dir: 1,  arcLen: 0.75, alpha: 0.18, planets: [] },
      { relR: 0.64, speed: 0.5, dir: -1, arcLen: 0.85, alpha: 0.17, planets: [{ type: 'warm', size: 9, offset: Math.PI * 0.6 }] },
      { relR: 0.80, speed: 0.35, dir: 1, arcLen: 0.95, alpha: 0.14, planets: [] }
    ];
    orbits = orbitDefs.map(cfg => ({
      radius: cfg.relR * halfDim,
      speed: cfg.speed, dir: cfg.dir,
      alpha: cfg.alpha,
      arcLen: cfg.arcLen,
      planets: cfg.planets,
      angle: rand(0, Math.PI * 2)
    }));

    // Дуст — ~40 частиц
    dustParticles = [];
    const dCount = lowFx ? 10 : (isMobile ? 22 : 40);
    for (let i = 0; i < dCount; i++) {
      dustParticles.push({
        x: rand(0, W),
        y: rand(0, H),
        size: rand(0.4, 1.6),
        baseOpacity: rand(0.05, 0.28),
        speedX: rand(-0.04, 0.04),
        speedY: rand(-0.04, 0.04),
        twinkleSpeed: rand(0.003, 0.014),
        twinkleOffset: rand(0, Math.PI * 2),
        depth: Math.random()
      });
    }
  }

  // PERF: реальный dpr под площадь арены. Оверлей полноэкранный, и dpr=2 на
  // 1920×1080 — это 8 Мп заливок каждый кадр; выше ~2.2 Мп выигрыш в резкости
  // уже незаметен, а стоимость растёт линейно.
  function effectiveDpr() {
    if (lowFx || isMobile) return 1;
    let d = Math.min(window.devicePixelRatio || 1, 2);
    const px = W * H;
    if (px * d * d > 2200000) d = Math.max(1, Math.sqrt(2200000 / Math.max(1, px)));
    return d;
  }

  function resize() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    cx = W / 2;
    cy = H / 2;
    dpr = effectiveDpr();

    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    invalidateCaches();
    initScene();
    initedSize = true;
  }

  // Статичные слои (фон-градиент + туманности) — в offscreen. Туманности
  // радиально симметричны, их вращение на экране неотличимо, так что печь их
  // один раз безопасно; пересборка — только при смене размера/варианта/темы.
  function getStaticLayer() {
    const key = variant + '|' + (isLightTheme() ? 'l' : 'd') + '|' + W + 'x' + H + '@' + dpr.toFixed(2);
    if (staticLayer && staticKey === key) return staticLayer;
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.floor(W * dpr));
    off.height = Math.max(1, Math.floor(H * dpr));
    const octx = off.getContext('2d');
    if (!octx) return null;
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const v = V();
    const bgg = octx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
    bgg.addColorStop(0, v.bg[0]);
    bgg.addColorStop(0.55, v.bg[1]);
    bgg.addColorStop(1, v.bg[2]);
    octx.fillStyle = bgg;
    octx.fillRect(0, 0, W, H);
    octx.save(); octx.translate(cx, cy);
    nebulae.forEach(n => {
      const ng = octx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      const nc = n.warm ? v.nebWarm : v.nebCool;
      ng.addColorStop(0, col(nc, n.alpha));
      ng.addColorStop(1, col(nc, 0));
      octx.fillStyle = ng;
      octx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
    });
    octx.restore();
    staticLayer = off;
    staticKey = key;
    return off;
  }

  function drawGlow(x, y, radius, r, g, b, alpha) {
    const key = radius.toFixed(1) + '|' + r + ',' + g + ',' + b;
    if (!glowGrad || glowKey !== key) {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      glowGrad = grad; glowKey = key;
    }
    // Прозрачность дышит от pulse() — берём её через globalAlpha, чтобы
    // не пересобирать градиент каждый кадр.
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawPlanet(x, y, radius, type) {
    let r, g, b;
    if (isLightTheme()) {
      // приглушённые тела — на светлом фоне яркие «неоновые» сливаются
      if (type === 'warm') { r = 190; g = 130; b = 50; }
      else if (type === 'cool') { r = 70; g = 100; b = 170; }
      else { r = 80; g = 140; b = 180; }
    } else if (type === 'warm') { r = 255; g = 200; b = 100; }
    else if (type === 'cool') { r = 120; g = 150; b = 220; }
    else { r = 150; g = 210; b = 240; }

    // PERF: три градиента на планету × 2 планеты × 60 кадров — собираем один раз
    // в локальных координатах и рисуем со сдвигом.
    const key = type + '@' + radius.toFixed(1) + (isLightTheme() ? 'l' : 'd');
    let p = planetCache[key];
    if (!p) {
      const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2.5);
      gg.addColorStop(0, `rgba(${r},${g},${b},0.12)`);
      gg.addColorStop(1, `rgba(${r},${g},${b},0)`);
      const bg = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 0, 0, 0, radius);
      bg.addColorStop(0, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},0.9)`);
      bg.addColorStop(0.6, `rgba(${r},${g},${b},0.85)`);
      bg.addColorStop(1, `rgba(${Math.floor(r * 0.4)},${Math.floor(g * 0.4)},${Math.floor(b * 0.4)},0.75)`);
      const sg = ctx.createLinearGradient(-radius, 0, radius, 0);
      sg.addColorStop(0, 'rgba(0,0,0,0)');
      sg.addColorStop(1, 'rgba(0,0,0,0.3)');
      p = planetCache[key] = { glow: gg, body: bg, shade: sg };
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = p.glow;
    ctx.beginPath(); ctx.arc(0, 0, radius * 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.body; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.shade; ctx.fill();
    ctx.restore();
  }

  function render() {
    if (!ctx || !initedSize) return;
    time += 0.016;

    // плавный возврат скорости к 1
    speedMultiplier += (targetSpeed - speedMultiplier) * 0.05;

    const v = V();

    // Фон + туманности — один drawImage вместо 3 радиальных градиентов на кадр.
    // Слой непрозрачный, поэтому clearRect не нужен вовсе.
    const layer = getStaticLayer();
    if (layer) ctx.drawImage(layer, 0, 0, W, H);
    else {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = v.bg[1];
      ctx.fillRect(0, 0, W, H);
    }

    // Звёзды (мерцание)
    bgStars.forEach(layer => {
      layer.forEach(star => {
        const tw = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
        const a = star.baseOpacity * (0.45 + tw * 0.55);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = col(v.star, a);
        ctx.fill();
      });
    });

    // Дуст
    dustParticles.forEach(p => {
      p.x += p.speedX * speedMultiplier;
      p.y += p.speedY * speedMultiplier;
      // wrap внутри арены
      if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5; else if (p.y > H + 5) p.y = -5;
      const tw = Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.5 + 0.5;
      const a = p.baseOpacity * (0.3 + tw * 0.7);
      const s = p.size * (0.5 + p.depth * 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
      ctx.fillStyle = isLightTheme()
        ? `rgba(110,95,55,${a * 0.7})`
        : `rgba(${220 + p.depth * 30},${180 + p.depth * 35},${100 + p.depth * 70},${a})`;
      ctx.fill();
    });

    // Центральное мягкое свечение под кубик
    drawGlow(cx, cy, Math.min(W, H) * 0.18, v.glow[0], v.glow[1], v.glow[2], 0.06 + (speedMultiplier - 1) * 0.04);

    // Орбиты (вариант starfield их не рисует)
    if (v.orbits) orbits.forEach(orbit => {
      orbit.angle += orbit.speed * orbit.dir * speedMultiplier * 0.008;

      // тонкое базовое кольцо (в lowFx не рисуем — на глаз почти не видно)
      if (!lowFx) {
        ctx.beginPath();
        ctx.arc(cx, cy, orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = col(v.orbit, orbit.alpha * 0.18);
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // светящаяся дуга
      const arcStart = orbit.angle;
      const arcEnd = orbit.angle + orbit.arcLen;
      ctx.beginPath();
      ctx.arc(cx, cy, orbit.radius, arcStart, arcEnd);
      ctx.strokeStyle = col(v.orbit, orbit.alpha * 0.25);
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, orbit.radius, arcStart, arcEnd);
      ctx.strokeStyle = col(v.orbit, orbit.alpha * 1.1);
      ctx.lineWidth = 1.1; ctx.lineCap = 'round';
      ctx.stroke();

      // ведущая точка
      const leadX = cx + orbit.radius * Math.cos(arcEnd);
      const leadY = cy + orbit.radius * Math.sin(arcEnd);
      ctx.beginPath();
      ctx.arc(leadX, leadY, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = col(v.lead, Math.min(1, orbit.alpha * 3));
      ctx.fill();

      // хвост (точки) — 6 дуг на орбиту × 5 орбит, в lowFx опускаем
      if (!lowFx) for (let d = 0; d < 6; d++) {
        const da = orbit.angle + (d / 6) * orbit.arcLen;
        const dx = cx + orbit.radius * Math.cos(da);
        const dy = cy + orbit.radius * Math.sin(da);
        const a = orbit.alpha * (1 - d / 6) * 0.45;
        ctx.beginPath();
        ctx.arc(dx, dy, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = col(v.orbit, a);
        ctx.fill();
      }

      // планеты
      orbit.planets.forEach(pl => {
        const pAngle = orbit.angle + pl.offset;
        const ppx = cx + orbit.radius * Math.cos(pAngle);
        const ppy = cy + orbit.radius * Math.sin(pAngle);
        drawPlanet(ppx, ppy, pl.size / 2, pl.type);
      });
    });

    // Shockwaves (импульсы от центра при броске)
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed * speedMultiplier;
      sw.opacity *= 0.965;
      if (sw.opacity < 0.012 || sw.radius > Math.max(W, H)) {
        shockwaves.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = col(v.orbit, sw.opacity);
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }

  function loop() {
    if (!running()) { rafId = 0; lastFrameT = 0; return; }
    render();
    // Адаптивный тариф: если кадры стабильно не укладываются в бюджет (>26мс,
    // т.е. ниже ~38 fps), переходим на lowFx и запоминаем — на этой машине
    // полный набор эффектов не тянется, второй раз мерить незачем.
    if (!lowFx) {
      const now = (window.performance && performance.now) ? performance.now() : Date.now();
      if (lastFrameT) {
        const dt = now - lastFrameT;
        if (dt > 26) slowFrames++;
        else if (slowFrames > 0) slowFrames--;
        if (slowFrames >= 24) {
          lowFx = true;
          rememberLowFx();
          resize();
          try { window.dispatchEvent(new Event('dicearena:lowfx')); } catch (e) {}
        }
      }
      lastFrameT = now;
    }
    rafId = requestAnimationFrame(loop);
  }

  function start(el) {
    if (el && el !== canvas) {
      teardownObserver();
      canvas = el;
      ctx = canvas.getContext('2d');
      if (!ctx) { canvas = null; return; }
      isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      lowFx = detectLowFx();
      dpr = 1;  // настоящее значение считает effectiveDpr() внутри resize()
      reduce = !!(rmMQ && rmMQ.matches);
      initedSize = false;
      // ResizeObserver реагирует на изменения размера контейнера
      try {
        ro = new ResizeObserver(() => resize());
        ro.observe(canvas);
      } catch (e) { /* старые браузеры — резизим один раз */ }
    }
    if (!canvas || !ctx) return;
    resize();
    if (reduce || document.hidden) { render(); return; }
    if (rafId) { cancelAnimationFrame(rafId); }
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  function teardownObserver() {
    if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
  }

  function pulse() {
    if (!canvas) return;
    // Два кольца + лёгкий импульс орбит
    shockwaves.push({ radius: Math.min(W, H) * 0.08, opacity: 0.7, speed: 2.4 });
    shockwaves.push({ radius: Math.min(W, H) * 0.04, opacity: 0.5, speed: 1.6 });
    targetSpeed = 3;
    setTimeout(() => { targetSpeed = 1; }, 1000);
    // если RAF не крутился (например хидден стал) — нарисуем хотя бы один кадр
    if (!rafId && !document.hidden && !reduce) {
      rafId = requestAnimationFrame(loop);
    }
  }

  // visibility / reduced-motion
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (canvas && !rafId) { rafId = requestAnimationFrame(loop); }
  });
  if (rmMQ) {
    const onRm = () => {
      reduce = !!rmMQ.matches;
      if (reduce) { stop(); render(); }
      else if (canvas && !rafId) { rafId = requestAnimationFrame(loop); }
    };
    if (rmMQ.addEventListener) rmMQ.addEventListener('change', onRm);
    else if (rmMQ.addListener) rmMQ.addListener(onRm);
  }

  // UX-3: смена варианта фона. Пересобирает сцену (плотность звёзд) и
  // перерисовывает кадр; при reduced-motion/скрытой вкладке — один статичный кадр.
  function setVariant(name) {
    if (!VARIANTS[name]) return;
    variant = name;
    if (canvas && ctx && initedSize) {
      invalidateCaches();
      initScene();
      if (reduce || document.hidden) { render(); }
      else if (!rafId) { rafId = requestAnimationFrame(loop); }
    }
  }
  function getVariant() { return variant; }

  // isLowFx() читает app-dice.js: на слабой машине WebGL-кубик тоже идёт без теней.
  function isLowFx() { return lowFx || detectLowFx(); }
  window.DiceArenaBg = { start: start, stop: stop, pulse: pulse, setVariant: setVariant, getVariant: getVariant, isLowFx: isLowFx };
})();
