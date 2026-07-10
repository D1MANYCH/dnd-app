// ============================================================
// bg-space.js — «Дымка» v5: космос под стеклом (vanilla).
// Замена/дополнение bg-orbits.js. Без зависимостей.
//
// API:
//   var destroy = initSpaceBg(canvas, {
//     theme:  'dark' | 'light',
//     mode:   'off' | 'calm' | 'lively',   // интенсивность
//     motion: true | false                  // false => один статичный кадр
//   });
//   destroy(); // перед сменой темы/режима — и init заново
//
// Канвас: position:fixed; inset:0; z-index:0; pointer-events:none;
// UI-контейнер поверх: position:relative; z-index:1.
// ============================================================
(function () {
  'use strict';

  function initSpaceBg(canvas, opts) {
    opts = opts || {};
    var mode = opts.mode || 'lively';
    if (mode === 'off' || !canvas) return function () {};

    var ctx = canvas.getContext('2d');
    var host = canvas.parentElement || document.body;
    var dark = (opts.theme || 'dark') === 'dark';
    var lively = mode === 'lively';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animate = (opts.motion !== false) && !reduced;

    var W = 0, H = 0, cx = 0, cy = 0, minDim = 0;
    var raf = 0, resizeT = 0, killed = false, time = 0;
    var stars = [], nebulae = [], orbits = [], arcs = [], dust = [], comets = [], shots = [];
    var nextShot = 8;
    var mx = 0, my = 0, tmx = 0, tmy = 0;

    var rand = (a, b) => a + Math.random() * (b - a);

    var mkStars = (count, sMin, sMax, oMin, oMax) =>
      Array.from({ length: count }, () => ({
        x: rand(-100, W + 100), y: rand(-100, H + 100),
        size: rand(sMin, sMax), o: rand(oMin, oMax),
        om: rand(0.2, 1.1), ph: rand(0, Math.PI * 2),
      }));

    var init = () => {
      // dnd-app: размер сцены — CSS-бокс самого канваса (fixed, 100vw×100vh),
      // а не host/body: высота body равна высоте ДОКУМЕНТА вкладки, из-за чего
      // центр орбит уезжал вниз и на каждой вкладке сцена выглядела по-разному.
      W = canvas.clientWidth || host.clientWidth;
      H = canvas.clientHeight || Math.min(host.clientHeight, window.innerHeight || host.clientHeight);
      if (!W || !H) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2; minDim = Math.min(W, H);
      var area = (W * H) / (1280 * 800);
      var k = (lively ? 1 : 0.65) * Math.min(1.4, Math.max(0.45, area));

      // dnd-app: плотность деталей ×1.6 к прототипу (фидбек: «детализированнее»)
      stars = dark ? [
        ...mkStars(Math.round(150 * k), 0.4, 1.4, 0.15, 0.45),
        ...mkStars(Math.round(76 * k), 0.6, 2.0, 0.2, 0.55),
        ...mkStars(Math.round(22 * k), 1.2, 2.5, 0.3, 0.65),
      ] : [
        ...mkStars(Math.round(110 * k), 0.4, 1.1, 0.10, 0.26),
        ...mkStars(Math.round(46 * k), 0.5, 1.4, 0.14, 0.32),
        ...mkStars(Math.round(16 * k), 1.0, 2.0, 0.18, 0.36),
      ];

      nebulae = Array.from({ length: lively ? 6 : 3 }, () => {
        var ang = rand(0, Math.PI * 2);
        var dist = rand(50, minDim * 0.35 + 50);
        return {
          x: Math.cos(ang) * dist, y: Math.sin(ang) * dist,
          r: rand(60, 150),
          hue: Math.random() > 0.5 ? (dark ? 220 : 212) : (dark ? 32 : 40),
          a: dark ? rand(0.010, 0.038) : rand(0.014, 0.05),
          rot: rand(0, Math.PI * 2), rotSp: rand(-0.00015, 0.00015) * 60,
        };
      });

      var maxR = minDim * 0.42;
      var defs = [
        { rr: 0.07, sp: 1.5, dir: 1, arc: 0.5, a: dark ? 0.16 : 0.11, pl: [] },
        { rr: 0.12, sp: 1.1, dir: -1, arc: 0.6, a: dark ? 0.18 : 0.13, pl: [{ t: 'cool', s: 6, off: 0 }] },
        { rr: 0.17, sp: 0.8, dir: 1, arc: 0.55, a: dark ? 0.16 : 0.11, pl: [] },
        { rr: 0.23, sp: 0.6, dir: -1, arc: 0.65, a: dark ? 0.20 : 0.14, pl: [{ t: 'warm', s: 10, off: 0 }, { t: 'cool', s: 7, off: Math.PI }] },
        { rr: 0.29, sp: 0.4, dir: 1, arc: 0.7, a: dark ? 0.16 : 0.11, pl: [] },
        { rr: 0.35, sp: 0.3, dir: -1, arc: 0.75, a: dark ? 0.18 : 0.12, pl: [{ t: 'warm', s: 12, off: 0 }, { t: 'ice', s: 8, off: Math.PI * 0.6 }] },
        { rr: 0.42, sp: 0.25, dir: 1, arc: 0.8, a: dark ? 0.15 : 0.10, pl: [] },
        { rr: 0.48, sp: 0.18, dir: -1, arc: 0.85, a: dark ? 0.17 : 0.11, pl: [{ t: 'cool', s: 14, off: 0, ring: true }, { t: 'warm', s: 9, off: Math.PI * 1.1 }] },
        { rr: 0.54, sp: 0.12, dir: 1, arc: 0.9, a: dark ? 0.13 : 0.09, pl: [{ t: 'ice', s: 7, off: Math.PI * 0.4 }] },
      ];
      var use = lively ? defs : defs.slice(0, 5).map((d) => ({ ...d, pl: [], a: d.a * 0.7 }));
      orbits = use.map((d) => ({
        r: Math.min(d.rr * minDim, maxR), sp: d.sp, dir: d.dir, arc: d.arc,
        a: d.a, pl: d.pl, ang: rand(0, Math.PI * 2),
      }));

      arcs = lively ? [
        { r: maxR * 0.15, st: -35, len: 50, sp: 0.7, dir: 1, a: dark ? 0.40 : 0.22 },
        { r: maxR * 0.28, st: 100, len: 40, sp: 0.5, dir: -1, a: dark ? 0.35 : 0.19 },
        { r: maxR * 0.40, st: 180, len: 55, sp: 0.3, dir: 1, a: dark ? 0.30 : 0.16 },
        { r: maxR * 0.52, st: -65, len: 65, sp: 0.25, dir: -1, a: dark ? 0.30 : 0.16 },
      ].map((a) => ({ ...a, ang: rand(0, Math.PI * 2) })) : [];

      dust = Array.from({ length: Math.min(96, Math.floor((W * H) / 13000) * (lively ? 1 : 0.5)) | 0 }, () => ({
        x: rand(-100, W + 100), y: rand(-100, H + 100),
        size: rand(0.4, 2.2), o: rand(0.04, 0.32),
        vx: rand(-0.02, 0.02), vy: rand(-0.02, 0.02),
        om: rand(0.15, 0.9), ph: rand(0, Math.PI * 2), depth: Math.random(),
      }));

      comets = lively ? Array.from({ length: Math.min(12, orbits.length + 3) }, () => {
        var oi = Math.floor(rand(0, orbits.length));
        return { oi, ang: rand(0, Math.PI * 2), sp: orbits[oi].sp * rand(0.3, 1.1), size: rand(0.4, 1.6), o: rand(0.10, 0.38) };
      }) : [];

      shots = []; nextShot = time + rand(5, 12);
    };

    /* --- палитры --- */
    var P = dark ? {
      bg: ['#0a1628', '#060e1f', '#030812'],
      star: '220,230,255', orbit: '150,180,255', arcGold: '255,210,120',
      warm: [255, 200, 100], cool: [120, 150, 220], ice: [150, 210, 240],
      ringC: 'rgba(255,220,150,0.18)', comet: '235,240,255', shot: '235,242,255',
    } : {
      bg: ['#f7f9fd', '#edf1f8', '#e2e8f2'],
      star: '80,100,150', orbit: '60,80,140', arcGold: '168,128,52',
      warm: [170, 120, 50], cool: [60, 80, 140], ice: [80, 130, 160],
      ringC: 'rgba(70,100,150,0.22)', comet: '80,100,150', shot: '90,110,170',
    };

    var drawPlanet = (x, y, r, t) => {
      var [pr, pg, pb] = P[t];
      if (dark) {
        var gg = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        gg.addColorStop(0, `rgba(${pr},${pg},${pb},0.1)`); gg.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
        ctx.fillStyle = gg;
        ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2); ctx.fill();
      }
      var bg = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      bg.addColorStop(0, `rgba(${Math.min(255, pr + 40)},${Math.min(255, pg + 40)},${Math.min(255, pb + 40)},0.85)`);
      bg.addColorStop(0.6, `rgba(${pr},${pg},${pb},0.8)`);
      bg.addColorStop(1, `rgba(${(pr * 0.4) | 0},${(pg * 0.4) | 0},${(pb * 0.4) | 0},0.7)`);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
      var sg = ctx.createLinearGradient(x - r, y, x + r, y);
      if (dark) { sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,0.25)'); }
      else { sg.addColorStop(0, 'rgba(255,255,255,0.12)'); sg.addColorStop(1, 'rgba(0,0,0,0.06)'); }
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();
    };

    var draw = () => {
      mx += (tmx - mx) * 0.03; my += (tmy - my) * 0.03;
      var px = mx * 8, py = my * 8;

      // Фон-виньетка
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.62);
      g.addColorStop(0, P.bg[0]); g.addColorStop(0.5, P.bg[1]); g.addColorStop(1, P.bg[2]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Туманности
      for (var n of nebulae) {
        var nx = cx + n.x + px * 0.4, ny = cy + n.y + py * 0.4;
        var ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        ng.addColorStop(0, `hsla(${n.hue}, 70%, ${dark ? 60 : 52}%, ${n.a})`);
        ng.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        ctx.fillStyle = ng;
        ctx.fillRect(nx - n.r, ny - n.r, n.r * 2, n.r * 2);
      }

      // Звёзды (лёгкий параллакс)
      for (var s of stars) {
        var tw = 0.6 + 0.4 * Math.sin(time * s.om + s.ph);
        ctx.globalAlpha = s.o * tw;
        ctx.fillStyle = `rgb(${P.star})`;
        ctx.beginPath(); ctx.arc(s.x + px * 0.3, s.y + py * 0.3, s.size, 0, Math.PI * 2); ctx.fill();
      }

      // Пыль
      for (var d of dust) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < -110) d.x = W + 100; if (d.x > W + 110) d.x = -100;
        if (d.y < -110) d.y = H + 100; if (d.y > H + 110) d.y = -100;
        var tw = 0.55 + 0.45 * Math.sin(time * d.om + d.ph);
        ctx.globalAlpha = d.o * tw;
        ctx.fillStyle = `rgb(${P.star})`;
        ctx.beginPath(); ctx.arc(d.x + px * (0.3 + d.depth * 0.5), d.y + py * (0.3 + d.depth * 0.5), d.size * 0.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      var ox = cx + px, oy = cy + py;

      // Орбиты + планеты
      // dnd-app: ×1.5 к яркости линий — сцена лежит под слоем #bgGlass
      // (лёгкое глобальное размытие), исходные альфы прототипа тонут.
      for (var o of orbits) {
        var rot = o.ang + time * o.sp * o.dir * 0.1;
        ctx.strokeStyle = `rgba(${P.orbit},${Math.min(1, o.a * 1.5)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ox, oy, o.r, rot, rot + o.arc * Math.PI * 2); ctx.stroke();
        for (var p of o.pl) {
          var pa = rot + p.off;
          var pxp = ox + Math.cos(pa) * o.r, pyp = oy + Math.sin(pa) * o.r;
          var size = p.s * 0.62 * Math.min(1.15, Math.max(0.6, minDim / 900));
          drawPlanet(pxp, pyp, size, p.t);
          if (p.ring) {
            ctx.save(); ctx.translate(pxp, pyp); ctx.rotate(pa * 0.4); ctx.scale(1, 0.3);
            ctx.beginPath(); ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2);
            ctx.strokeStyle = P.ringC; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
          }
        }
      }

      // Золотые акцент-дуги (dnd-app: ×1.4 к яркости, см. комментарий у орбит)
      for (var a of arcs) {
        var rot = (a.st * Math.PI / 180) + a.ang + time * a.sp * a.dir * 0.1;
        ctx.strokeStyle = `rgba(${P.arcGold},${Math.min(1, a.a * 1.4)})`;
        ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(ox, oy, a.r, rot, rot + a.len * Math.PI / 180); ctx.stroke();
      }

      // Кометы на орбитах (точка + хвост)
      for (var c of comets) {
        var o = orbits[c.oi]; if (!o) continue;
        var ca = c.ang + time * c.sp * 0.14;
        for (var ti = 3; ti >= 0; ti--) {
          var ta = ca - ti * 0.05;
          var tx = ox + Math.cos(ta) * o.r, ty = oy + Math.sin(ta) * o.r;
          ctx.globalAlpha = c.o * (1 - ti / 4);
          ctx.fillStyle = `rgb(${P.comet})`;
          ctx.beginPath(); ctx.arc(tx, ty, c.size * (1 - ti * 0.18), 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Падающие звёзды
      if (lively) {
        if (animate && time > nextShot) {
          var ang = rand(0, Math.PI * 2);
          var dist = rand(80, minDim * 0.35 + 80);
          shots.push({
            x: ox + Math.cos(ang) * dist, y: oy + Math.sin(ang) * dist,
            vx: Math.cos(ang + Math.PI + rand(-0.25, 0.25)) * rand(1, 3),
            vy: Math.sin(ang + Math.PI + rand(-0.25, 0.25)) * rand(1, 3),
            life: 1,
          });
          nextShot = time + rand(6, 14);
        }
        for (var sh of shots) {
          sh.x += sh.vx * 2; sh.y += sh.vy * 2; sh.life -= 0.016;
          if (sh.life <= 0) continue;
          var a = Math.max(0, sh.life * (1 - sh.life) * 4) * (dark ? 0.75 : 0.4);
          var lg = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 12, sh.y - sh.vy * 12);
          lg.addColorStop(0, `rgba(${P.shot},${a})`); lg.addColorStop(1, `rgba(${P.shot},0)`);
          ctx.strokeStyle = lg; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 12, sh.y - sh.vy * 12); ctx.stroke();
        }
        shots = shots.filter((s) => s.life > 0);
      }
    };

    var loop = () => {
      if (killed) return;
      time += 0.016;
      draw();
      raf = requestAnimationFrame(loop);
    };

    init();
    if (animate) { raf = requestAnimationFrame(loop); }
    else { time = 40; draw(); }

    var ro = new ResizeObserver(() => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => { init(); if (!animate) draw(); }, 150);
    });
    // dnd-app: следим за канвасом (вьюпорт), а не за body — рост высоты
    // документа при смене вкладки не должен пересеивать сцену.
    ro.observe(canvas);

    var onMouse = (e) => {
      var r = canvas.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    if (animate && !coarse) host.addEventListener('mousemove', onMouse, { passive: true });

    var onVis = () => {
      if (!animate) return;
      cancelAnimationFrame(raf);
      if (!document.hidden && !killed) raf = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVis);

    function destroy() {
      killed = true;
      cancelAnimationFrame(raf); clearTimeout(resizeT);
      ro.disconnect();
      host.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    }
    // dnd-app: временная пауза без destroy — на время перетаскивания слайдеров
    // «стекла» (backdrop-filter не должен пересчитываться поверх движущегося
    // фона). Кадр остаётся на канвасе, resume продолжает ту же сцену.
    destroy.pause = function () { cancelAnimationFrame(raf); };
    destroy.resume = function () {
      if (killed || !animate) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    return destroy;
  }

  window.initSpaceBg = initSpaceBg;
})();
