// ============================================================
// bg-orbits.js — UI4-1: орбитальный космический фон (canvas)
// Адаптация фона из Front.html. Темой владеет приложение:
// читаем data-theme с <html>, реагируем через MutationObserver.
// ============================================================
(function () {
  'use strict';

  let canvas = null, ctx = null;
  let isMobile = false, dpr = 1;
  let W = 0, H = 0, centerX = 0, centerY = 0;
  let isDark = true;
  let time = 0;
  let rafId = 0;
  let enabled = true;
  let reduce = false;
  let booted = false;

  let bgStars = [], nebulae = [], orbits = [], accentArcs = [], dustParticles = [], cometParticles = [], shootingStars = [];
  let mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0;

  const rmMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const csMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function readIsDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }
  function running() {
    return enabled && !reduce && !document.hidden;
  }

  function getViewportHeight() {
    // iOS Safari fix
    if (window.visualViewport) return window.visualViewport.height;
    return window.innerHeight || document.documentElement.clientHeight;
  }

  function resize() {
    if (!canvas || !ctx) return;
    W = window.innerWidth;
    H = getViewportHeight();
    // UI4-glass: центр орбит — геометрический центр страницы (окна).
    centerX = W / 2;
    centerY = H / 2;

    // Set CSS size explicitly
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    // Set internal resolution
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initAll();
  }

  function createStars(count, sMin, sMax, oMin, oMax) {
    const stars = [];
    const c = Math.floor(count * (isMobile ? 0.5 : 1));
    for (let i = 0; i < c; i++) {
      stars.push({
        x: Math.random() * 3000 - 500, y: Math.random() * 3000 - 500,
        size: Math.random() * (sMax - sMin) + sMin,
        baseOpacity: Math.random() * (oMax - oMin) + oMin,
        twinkleSpeed: Math.random() * 0.015 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  function initAll() {
    if (isDark) {
      bgStars = [
        createStars(100, 0.4, 1.4, 0.15, 0.45),
        createStars(50, 0.6, 2.0, 0.2, 0.55),
        createStars(15, 1.2, 2.5, 0.3, 0.65)
      ];
    } else {
      bgStars = [
        createStars(70, 0.4, 1.1, 0.08, 0.22),
        createStars(30, 0.5, 1.4, 0.12, 0.28),
        createStars(10, 1.0, 2.0, 0.15, 0.32)
      ];
    }

    nebulae = [];
    const nCount = isMobile ? 2 : 4;
    for (let i = 0; i < nCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.min(W, H) * 0.3 + 50;
      nebulae.push({
        x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
        radius: Math.random() * 90 + 50,
        hue: Math.random() > 0.5 ? (isDark ? 220 : 210) : (isDark ? 30 : 40),
        alpha: isDark ? (Math.random() * 0.03 + 0.008) : (Math.random() * 0.04 + 0.012),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0003
      });
    }

    const minDim = Math.min(W, H);
    const maxR = minDim * 0.42;
    const alphaMult = isMobile ? 1.2 : 1;

    const orbitDefs = [
      { relR: 0.07, speed: 1.5, dir: 1, arcLen: 0.5, alpha: isDark ? 0.16 : 0.1, planets: [] },
      { relR: 0.12, speed: 1.1, dir: -1, arcLen: 0.6, alpha: isDark ? 0.18 : 0.12, planets: [{ type: isDark ? 'cool' : 'cool_l', size: 6, offset: 0 }] },
      { relR: 0.17, speed: 0.8, dir: 1, arcLen: 0.55, alpha: isDark ? 0.16 : 0.1, planets: [] },
      { relR: 0.23, speed: 0.6, dir: -1, arcLen: 0.65, alpha: isDark ? 0.2 : 0.13, planets: [{ type: isDark ? 'warm' : 'warm_l', size: 10, offset: 0 }] },
      { relR: 0.23, speed: 0.6, dir: -1, arcLen: 0.65, alpha: isDark ? 0.2 : 0.13, planets: [{ type: isDark ? 'cool' : 'cool_l', size: 7, offset: Math.PI }] },
      { relR: 0.29, speed: 0.4, dir: 1, arcLen: 0.7, alpha: isDark ? 0.16 : 0.1, planets: [] },
      { relR: 0.35, speed: 0.3, dir: -1, arcLen: 0.75, alpha: isDark ? 0.18 : 0.11, planets: [{ type: isDark ? 'warm' : 'warm_l', size: 12, offset: 0 }] },
      { relR: 0.35, speed: 0.3, dir: -1, arcLen: 0.75, alpha: isDark ? 0.18 : 0.11, planets: [{ type: isDark ? 'ice' : 'ice_l', size: 8, offset: Math.PI * 0.6 }] },
      { relR: 0.42, speed: 0.25, dir: 1, arcLen: 0.8, alpha: isDark ? 0.15 : 0.09, planets: [] },
      { relR: 0.48, speed: 0.18, dir: -1, arcLen: 0.85, alpha: isDark ? 0.17 : 0.1, planets: [{ type: isDark ? 'cool' : 'cool_l', size: 14, offset: 0, ring: true }] },
      { relR: 0.48, speed: 0.18, dir: -1, arcLen: 0.85, alpha: isDark ? 0.17 : 0.1, planets: [{ type: isDark ? 'warm' : 'warm_l', size: 9, offset: Math.PI * 1.1 }] },
      { relR: 0.54, speed: 0.12, dir: 1, arcLen: 0.9, alpha: isDark ? 0.13 : 0.08, planets: [{ type: isDark ? 'ice' : 'ice_l', size: 7, offset: Math.PI * 0.4 }] },
    ];

    orbits = orbitDefs.map(cfg => ({
      radius: Math.min(cfg.relR * minDim, maxR),
      speed: cfg.speed, dir: cfg.dir,
      alpha: cfg.alpha * alphaMult,
      arcLen: cfg.arcLen,
      planets: cfg.planets,
      angle: Math.random() * Math.PI * 2
    }));

    accentArcs = [
      { radius: maxR * 0.15, startAngle: -35, arcLength: 50, speed: 0.7, dir: 1, alpha: isDark ? 0.4 : 0.2 },
      { radius: maxR * 0.28, startAngle: 100, arcLength: 40, speed: 0.5, dir: -1, alpha: isDark ? 0.35 : 0.18 },
      { radius: maxR * 0.4, startAngle: 180, arcLength: 55, speed: 0.3, dir: 1, alpha: isDark ? 0.3 : 0.15 },
      { radius: maxR * 0.52, startAngle: -65, arcLength: 65, speed: 0.25, dir: -1, alpha: isDark ? 0.3 : 0.15 },
    ];
    accentArcs.forEach(a => a.angle = Math.random() * Math.PI * 2);

    dustParticles = [];
    const dCount = Math.min(60, Math.floor(W * H / 18000) * (isMobile ? 0.4 : 1));
    for (let i = 0; i < dCount; i++) {
      dustParticles.push({
        x: Math.random() * 2400 - 700, y: Math.random() * 2400 - 700,
        size: Math.random() * 1.8 + 0.4,
        baseOpacity: Math.random() * 0.3 + 0.04,
        speedX: (Math.random() - 0.5) * 0.04, speedY: (Math.random() - 0.5) * 0.04,
        twinkleSpeed: Math.random() * 0.012 + 0.002,
        twinkleOffset: Math.random() * Math.PI * 2, depth: Math.random()
      });
    }

    cometParticles = [];
    const cCount = Math.min(10, Math.floor(orbits.length * 1.2) * (isMobile ? 0.5 : 1));
    for (let i = 0; i < cCount; i++) {
      const oi = Math.floor(Math.random() * orbits.length);
      cometParticles.push({
        orbitIndex: oi, angle: Math.random() * Math.PI * 2,
        speed: orbits[oi].speed * (0.3 + Math.random() * 0.8),
        size: Math.random() * 1.2 + 0.4, opacity: Math.random() * 0.3 + 0.08,
        trailLength: Math.floor(Math.random() * 3 + 2)
      });
    }
    shootingStars = [];
  }

  function spawnShootingStar() {
    if (!running()) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * Math.min(W, H) * 0.35 + 80;
    shootingStars.push({
      x: centerX + Math.cos(angle) * dist,
      y: centerY + Math.sin(angle) * dist,
      vx: Math.cos(angle + Math.PI + (Math.random() - 0.5) * 0.5) * (Math.random() * 2 + 1),
      vy: Math.sin(angle + Math.PI + (Math.random() - 0.5) * 0.5) * (Math.random() * 2 + 1),
      life: 1
    });
  }

  function drawGlow(x, y, radius, r, g, b, alpha) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function drawPlanet(x, y, radius, type) {
    let r, g, b;
    if (isDark) {
      if (type === 'warm') { r = 255; g = 200; b = 100; }
      else if (type === 'cool') { r = 120; g = 150; b = 220; }
      else { r = 150; g = 210; b = 240; }
    } else {
      if (type === 'warm_l') { r = 170; g = 120; b = 50; }
      else if (type === 'cool_l') { r = 60; g = 80; b = 140; }
      else { r = 80; g = 130; b = 160; }
    }

    if (isDark) {
      const gg = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
      gg.addColorStop(0, `rgba(${r},${g},${b},0.1)`);
      gg.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2); ctx.fill();
    }

    const bg = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    bg.addColorStop(0, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},0.85)`);
    bg.addColorStop(0.6, `rgba(${r},${g},${b},0.8)`);
    bg.addColorStop(1, `rgba(${Math.floor(r * 0.4)},${Math.floor(g * 0.4)},${Math.floor(b * 0.4)},0.7)`);
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();

    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (isDark) {
      const sg = ctx.createLinearGradient(x - radius, y, x + radius, y);
      sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,0.25)');
      ctx.fillStyle = sg; ctx.fill();
    } else {
      const sg = ctx.createLinearGradient(x - radius, y, x + radius, y);
      sg.addColorStop(0, 'rgba(255,255,255,0.12)'); sg.addColorStop(1, 'rgba(0,0,0,0.06)');
      ctx.fillStyle = sg; ctx.fill();
    }
  }

  function drawRing(x, y, planetRadius, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(1, 0.3);
    ctx.beginPath(); ctx.arc(0, 0, planetRadius * 2.2, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? 'rgba(255,220,150,0.18)' : 'rgba(70,100,150,0.22)';
    ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
  }

  function render() {
    if (!ctx) return;
    time += 0.016;
    mouseX += (targetMX - mouseX) * 0.03;
    mouseY += (targetMY - mouseY) * 0.03;
    const px = (mouseX - centerX) * 0.01;
    const py = (mouseY - centerY) * 0.01;

    ctx.clearRect(0, 0, W, H);

    // Background
    if (isDark) {
      const g = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) * 0.6);
      g.addColorStop(0, '#0a1628'); g.addColorStop(0.5, '#060e1f'); g.addColorStop(1, '#030812');
      ctx.fillStyle = g;
    } else {
      const g = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) * 0.6);
      // UI4-glass: глубже исходного (#f0f4fa…) — иначе белые полупрозрачные
      // поверхности сливаются с почти-белым фоном и «стекло» не читается.
      g.addColorStop(0, '#ccd8ee'); g.addColorStop(0.5, '#b6c5e2'); g.addColorStop(1, '#9eafd0');
      ctx.fillStyle = g;
    }
    ctx.fillRect(0, 0, W, H);

    // Nebulae
    ctx.save(); ctx.translate(centerX + px * 0.3, centerY + py * 0.3);
    nebulae.forEach(n => {
      n.rotation += n.rotSpeed;
      ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(n.rotation);
      const ng = ctx.createRadialGradient(0, 0, 0, 0, 0, n.radius);
      if (isDark) {
        if (n.hue > 200) { ng.addColorStop(0, `rgba(50,70,140,${n.alpha})`); ng.addColorStop(1, 'rgba(50,70,140,0)'); }
        else { ng.addColorStop(0, `rgba(140,90,40,${n.alpha})`); ng.addColorStop(1, 'rgba(140,90,40,0)'); }
      } else {
        if (n.hue > 200) { ng.addColorStop(0, `rgba(160,180,220,${n.alpha})`); ng.addColorStop(1, 'rgba(160,180,220,0)'); }
        else { ng.addColorStop(0, `rgba(200,170,130,${n.alpha})`); ng.addColorStop(1, 'rgba(200,170,130,0)'); }
      }
      ctx.fillStyle = ng; ctx.fillRect(-n.radius, -n.radius, n.radius * 2, n.radius * 2);
      ctx.restore();
    });
    ctx.restore();

    // Stars
    bgStars.forEach((layer, li) => {
      const spx = px * (0.08 + li * 0.12);
      const spy = py * (0.08 + li * 0.12);
      layer.forEach(star => {
        const tw = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
        const a = star.baseOpacity * (0.4 + tw * 0.6);
        const sx = star.x + spx, sy = star.y + spy;
        if (sx > -10 && sx < W + 10 && sy > -10 && sy < H + 10) {
          ctx.beginPath(); ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(200,215,255,${a})` : `rgba(50,70,130,${a * 0.75})`;
          ctx.fill();
        }
      });
    });

    // Dust
    ctx.save(); ctx.translate(centerX + px * 0.4, centerY + py * 0.4);
    dustParticles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      const tw = Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.5 + 0.5;
      const a = p.baseOpacity * (0.3 + tw * 0.7) * (isMobile ? 1.3 : 1);
      const s = p.size * (0.5 + p.depth * 0.5);
      ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(${220 + p.depth * 30},${180 + p.depth * 35},${100 + p.depth * 70},${a})` : `rgba(70,90,140,${a * 0.5})`;
      ctx.fill();
    });
    ctx.restore();

    // Center
    const cpx = centerX + px * 0.15, cpy = centerY + py * 0.15;
    const starPulse = Math.sin(time * 1.5) * 0.1 + 1;
    const starSize = isDark ? (9 * starPulse) : (6 * starPulse);

    if (isDark) {
      drawGlow(cpx, cpy, 90, 255, 180, 80, 0.1);
      drawGlow(cpx, cpy, 45, 255, 200, 120, 0.08);
    } else {
      drawGlow(cpx, cpy, 60, 160, 140, 80, 0.06);
      drawGlow(cpx, cpy, 30, 180, 160, 100, 0.04);
    }

    ctx.save(); ctx.translate(cpx, cpy); ctx.rotate(time * 0.05);
    for (let r = 0; r < 4; r++) {
      const ra = r * Math.PI / 2, rl = isDark ? 40 : 25;
      const g = ctx.createLinearGradient(0, 0, Math.cos(ra) * rl, Math.sin(ra) * rl);
      g.addColorStop(0, isDark ? 'rgba(255,200,120,0.06)' : 'rgba(140,120,80,0.04)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ra) * rl, Math.sin(ra) * rl); ctx.stroke();
    }
    ctx.restore();

    ctx.save(); ctx.translate(cpx, cpy); ctx.rotate(time * 0.08);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, r = i % 2 === 0 ? starSize : starSize * 0.3;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(255,220,150,0.5)' : 'rgba(110,90,50,0.3)';
    ctx.fill();
    ctx.restore();

    // Orbits
    const ocx = centerX + px * 0.2, ocy = centerY + py * 0.2;
    orbits.forEach(orbit => {
      orbit.angle += orbit.speed * orbit.dir * 0.008;

      ctx.beginPath(); ctx.arc(ocx, ocy, orbit.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? `rgba(255,200,120,${orbit.alpha * 0.15})` : `rgba(70,100,150,${orbit.alpha * 0.25})`;
      ctx.lineWidth = 0.4; ctx.stroke();

      const arcStart = orbit.angle, arcEnd = orbit.angle + orbit.arcLen;
      if (isDark) {
        ctx.beginPath(); ctx.arc(ocx, ocy, orbit.radius, arcStart, arcEnd);
        ctx.strokeStyle = `rgba(255,190,100,${orbit.alpha * 0.2})`; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
        ctx.beginPath(); ctx.arc(ocx, ocy, orbit.radius, arcStart, arcEnd);
        ctx.strokeStyle = `rgba(255,190,100,${orbit.alpha})`; ctx.lineWidth = 1.1; ctx.lineCap = 'round'; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(ocx, ocy, orbit.radius, arcStart, arcEnd);
        ctx.strokeStyle = `rgba(70,100,150,${orbit.alpha * 0.9})`; ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.stroke();
      }

      const leadX = ocx + orbit.radius * Math.cos(arcEnd);
      const leadY = ocy + orbit.radius * Math.sin(arcEnd);
      ctx.beginPath(); ctx.arc(leadX, leadY, isDark ? 2.5 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(255,230,180,${orbit.alpha * 3})` : `rgba(60,85,140,${orbit.alpha * 2.5})`;
      ctx.fill();

      for (let d = 0; d < 6; d++) {
        const dotAngle = orbit.angle + (d / 6) * orbit.arcLen;
        const dx = ocx + orbit.radius * Math.cos(dotAngle);
        const dy = ocy + orbit.radius * Math.sin(dotAngle);
        const da = orbit.alpha * (1 - d / 6) * 0.4;
        ctx.beginPath(); ctx.arc(dx, dy, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(255,200,120,${da})` : `rgba(70,100,150,${da})`;
        ctx.fill();
      }

      orbit.planets.forEach(pl => {
        const pAngle = orbit.angle + pl.offset;
        const ppx = ocx + orbit.radius * Math.cos(pAngle);
        const ppy = ocy + orbit.radius * Math.sin(pAngle);
        if (pl.ring) drawRing(ppx, ppy, pl.size / 2, pAngle);
        drawPlanet(ppx, ppy, pl.size / 2, pl.type);
      });
    });

    // Accent arcs
    accentArcs.forEach(arc => {
      arc.angle += arc.speed * arc.dir * 0.008;
      const startA = arc.startAngle * Math.PI / 180 + arc.angle;
      const endA = startA + arc.arcLength * Math.PI / 180;
      ctx.beginPath(); ctx.arc(ocx, ocy, arc.radius, startA, endA);
      ctx.strokeStyle = isDark ? `rgba(255,180,80,${arc.alpha})` : `rgba(70,100,150,${arc.alpha})`;
      ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.stroke();
      const tipX = ocx + arc.radius * Math.cos(endA);
      const tipY = ocy + arc.radius * Math.sin(endA);
      ctx.beginPath(); ctx.arc(tipX, tipY, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(255,220,150,${arc.alpha * 1.5})` : `rgba(60,85,140,${arc.alpha * 1.5})`;
      ctx.fill();
    });

    // Comets
    cometParticles.forEach(c => {
      const orb = orbits[c.orbitIndex];
      c.angle += c.speed * orb.dir * 0.008;
      const cx = ocx + orb.radius * Math.cos(c.angle);
      const cy = ocy + orb.radius * Math.sin(c.angle);
      for (let t = 0; t < c.trailLength; t++) {
        const ta = c.angle - t * 0.05;
        const tx = ocx + orb.radius * Math.cos(ta);
        const ty = ocy + orb.radius * Math.sin(ta);
        const a2 = c.opacity * (1 - t / c.trailLength) * 0.35;
        ctx.beginPath(); ctx.arc(tx, ty, c.size * (1 - t / c.trailLength * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(255,200,120,${a2})` : `rgba(90,120,170,${a2})`;
        ctx.fill();
      }
      ctx.beginPath(); ctx.arc(cx, cy, c.size, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(255,230,180,${c.opacity})` : `rgba(90,120,170,${c.opacity * 0.7})`;
      ctx.fill();
    });

    // Shooting stars
    shootingStars = shootingStars.filter(s => {
      s.x += s.vx; s.y += s.vy; s.life -= 0.012;
      if (s.life <= 0) return false;
      const tl = 18;
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tl, s.y - s.vy * tl);
      g.addColorStop(0, isDark ? `rgba(255,230,180,${s.life})` : `rgba(70,90,140,${s.life * 0.6})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * tl, s.y - s.vy * tl);
      ctx.strokeStyle = g; ctx.lineWidth = s.life * 1.5; ctx.lineCap = 'round'; ctx.stroke();
      return true;
    });
  }

  function loop() {
    if (!running()) { rafId = 0; return; }
    render();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (!enabled || !canvas) return;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (reduce || document.hidden) { render(); return; }   // один статичный кадр
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  function applyThemeChange() {
    const d = readIsDark();
    if (d === isDark) return;          // тема не изменилась — не пересеиваем
    isDark = d;
    if (!W || !H) return;              // ещё не было resize(); первый resize() сам вызовет initAll()
    initAll();
    if (!running()) render();          // активный loop перерисует сам
  }

  function boot() {
    if (booted) return;
    booted = true;
    canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    isDark = readIsDark();
    reduce = !!(rmMQ && rmMQ.matches);

    window.addEventListener('resize', () => setTimeout(resize, isMobile ? 100 : 0));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => setTimeout(resize, 50));
    }
    document.addEventListener('mousemove', e => { targetMX = e.clientX; targetMY = e.clientY; });
    document.addEventListener('touchmove', e => { targetMX = e.touches[0].clientX; targetMY = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });

    // Темой владеет приложение: следим за data-theme на <html>
    const mo = new MutationObserver(applyThemeChange);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (csMQ) {
      if (csMQ.addEventListener) csMQ.addEventListener('change', applyThemeChange);
      else if (csMQ.addListener) csMQ.addListener(applyThemeChange);
    }
    if (rmMQ) {
      const onRm = () => {
        reduce = !!rmMQ.matches;
        if (reduce) { stop(); render(); } else { start(); }
      };
      if (rmMQ.addEventListener) rmMQ.addEventListener('change', onRm);
      else if (rmMQ.addListener) rmMQ.addListener(onRm);
    }

    setInterval(spawnShootingStar, isMobile ? 8000 : 5000);

    // Задержка под iOS Safari (адресная строка), затем старт
    setTimeout(() => { resize(); start(); }, isMobile ? 200 : 50);
  }

  // Публичный API (используется в UI4-5 и наблюдателями)
  window.__bgOrbits = {
    setEnabled: function (v) {
      enabled = !!v;
      if (enabled) start();
      else { stop(); render(); }
    },
    refresh: function () {
      if (!canvas) return;
      resize();
      if (!running()) render();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
