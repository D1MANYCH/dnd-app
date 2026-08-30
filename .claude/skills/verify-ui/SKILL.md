---
name: verify-ui
description: Verifying dnd-app edits in the browser preview — Service Worker cache traps, screenshots hanging on WebGL, cumulative network log, theme checks. Use before any UI/CSS/JS verification in preview, and whenever «правка не видна» or «скриншот виснет».
---

# Preview verification: mandatory workarounds

The app is a PWA with an aggressive Service Worker and continuous WebGL. Naive preview checks give FALSE results. Tools: `javascript_tool` (page JS), `read_page`, `computer` (clicks, screenshot), `read_console_messages`, `read_network_requests`.

## 1. The SW serves stale code ("my edit is invisible")

`sw.js` precaches files under the current `CACHE_NAME` and matches with `ignoreSearch:true` — even `?nocache=` does not help. Editing `style.css`/JS and looking at preview without a new `CACHE_NAME` shows the OLD copy.

One-off fix via `javascript_tool`:
```js
(async()=>{for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();
for(const n of await caches.keys())await caches.delete(n);})()
```
then `window.location.reload()`. Not needed on a real deploy — `/bump` changes `CACHE_NAME`.

**Second layer: plain HTTP cache.** Killing the SW is not enough; refetch the exact `?v=` URL with `fetch(url,{cache:'reload'})`. Symptom: a new function is `undefined` while `node --check` is green.

## 2. Screenshots hang (WebGL)

The page renders WebGL non-stop: the orbital `#bgCanvas` rAF loop plus dice-box (Babylon in a worker). Frame capture never reaches idle.

- For styles and layout a screenshot is not needed — use `javascript_tool` + `getComputedStyle`, including tokens: `getComputedStyle(document.documentElement).getPropertyValue('--sh-1')`.
- If a screenshot is genuinely required (see §4): first kill rendering — `cancelAnimationFrame` on the active loop, stub `requestAnimationFrame` to a no-op, `WEBGL_lose_context.loseContext()` on every canvas, `display:none` on them — then capture.
- **Hidden browser pane** is a separate cause: `computer {action:"screenshot"}` fails in 5 s with "Browser pane is not displayed, so the page is not compositing frames". Nothing above helps. Everything else still works while hidden (`read_page`, real clicks, console, network, `javascript_tool`); only capture is blocked — use headless Chrome (§6).

## 3. The network log is cumulative across reloads

Old 404s from diagnostic fetches stay in the list. For "what THIS load actually requested" use `performance.getEntriesByType('resource')` via `javascript_tool`.

## 4. Computed styles do not catch visual bugs

Tour dimming bug (v3.28.6): `getComputedStyle().boxShadow` reported the correct value and `elementFromPoint` confirmed the overlay, yet nothing was dimmed on screen (the GPU refused a huge spread). For overlays, dimming and layering the only reliable check is a real screenshot (with the §2 workaround).

## 5. Screenshots brighten black translucent overlays (false bug)

The inverse trap: the JPEG preview capture applies auto-exposure, so a dark frame gets pulled up. Tour dimming `rgba(0,0,0,0.7)` over a light theme can look ALMOST ABSENT in a screenshot while rendering correctly in the browser. To prove the mask paints: temporarily
`document.querySelectorAll('.tour-mask').forEach(m=>m.style.background='rgba(255,0,0,0.7)')` — saturated red survives exposure. If red covers the area, the black dimming works too; "weak black dimming in a screenshot" is not a bug by itself.

## 6. Headless Chrome (PNG, no auto-exposure)

When preview tooling is unavailable or capture is blocked, and the server runs:

```
chrome --headless=new --disable-gpu --hide-scrollbars --window-size=W,H
--force-device-scale-factor=DPR --virtual-time-budget=3000 --screenshot=out.png <url>
```
Chrome lives at `C:\Program Files\Google\Chrome\Application\chrome.exe`; analyse pixels with Pillow.

- **PowerShell gotcha:** an argument containing a comma without quotes (`--window-size=390,844`) is parsed as an array and Chrome silently writes no PNG — quote the whole thing (`"--window-size=390,844"`, `"--screenshot=$path"`). Give every run its own `--user-data-dir` (a second start otherwise hits the first profile's lock) plus `--no-first-run`.
- A fresh profile means no SW (trap §1 disappears) but also no localStorage — the app opens onboarding over the main screen.
- Fixtures: `tests/tour-fixture.html?theme=light|dark&dim=0.5&diag=1` (deterministic hole (194,144)–(526,276) CSS px) for overlays; `tests/theme-audit-fixture.html?tab=…&theme=…&scroll=…&modal=settings|levelup&set=--token:value;…&keepbg=1` for the app screenshot matrix — it seeds a character, kills rAF/WebGL and can A/B-inject tokens without editing files (params documented in the file header).
- `--dump-dom` is silent on some builds — pull diagnostics out with an HTTP beacon `GET /__diag?<json>` (visible in `python -m http.server` stdout). With `--force-device-scale-factor` the viewport is NOT the requested `--window-size` — verify `window.innerWidth` through the beacon.

## 7. Theme edits: both themes plus the checker

Any `style.css` change touching colors or tokens is verified in dark AND light (`setTheme('light')` / `setTheme('dark')`), plus static checks:

- `node tools/check-theme.js` — 4 checks: light/auto token blocks in sync, dark↔light parity, WCAG contrast (`tools/theme-contrast-pairs.json`), hardcode ratchet (`tools/theme-baseline.json`; CI fails only on GROWTH). `--report` lists hardcodes per section; `--update-baseline` for a deliberate change.
- A new color inside a component rule fails the ratchet → use `var(--token)`. A new token goes into all THREE blocks at once (dark `:root` / light / auto), otherwise checks 1–2 fail.
- The PostToolUse hook runs the checker on `style.css` edits (warn-only; CI blocks).
- The checker is static and does NOT replace screenshots (§4–5): it catches token drift and contrast, not render bugs.
- **Picking contrast values without guessing:** `check-theme.js` exports `parseCss / collectThemeMaps / substVars / parseColor / flatten / contrast` — a throwaway node script resolves a theme into a token map, computes the exact pair contrast, and binary-searches the darkening toward the threshold (scaling the color to black). Raise the threshold in `theme-contrast-pairs.json` AFTER fixing the palette, or check 3 fails; `target`/`note` fields are documentation and ignored by the checker.
- **Pure color edits: a synthetic swatch page beats the app.** Driving the real app headless is flaky (fixture iframe timing plus hidden WebGL yields an empty frame, and `theme=light` may not apply). A tiny static HTML with before/after swatches on the real theme background (`#eceff5` under glass) plus a headless PNG gives exact hex on exact background — and doubles as an artifact to agree on with the user. A full-screen app screenshot is only needed when LAYOUT changes.
- **Live A/B on a running page:** `document.documentElement.style.setProperty('--token','value')` (or `&set=` in the fixture) compares candidates without editing files.
- **Gotcha `-*/` inside a CSS comment:** the sequence `*/` inside a comment closes it EARLY (e.g. `--cf-own-*/--cf-foreign-*`, `.res-tag-*/.res-add-btn-*`, `--opt-*/--optgroup-*`). The comment tail leaks into CSS and the browser's error recovery silently drops the NEXT rule. The checker does not catch this (its comment stripping repeats the same mistake). Symptom: the rule exists in the file and braces balance, but it is absent from the CSSOM and computed values come from a less specific rule. Diagnose with a stray-`*/` scan (an `inComment` state machine) or `grep '\*/\S'`. Check ONLY in headless (fresh profile, no SW) — a preview tab with a live SW serves a stale CSSOM and lies. Write `-* /` with a space, or drop the `*`.

## 7b. `setTheme()` does not repaint STATIC markup live

Switching themes in a live page leaves elements from `index.html` with computed values of the PREVIOUS theme: `getComputedStyle(el).getPropertyValue('--chip-bg')` already returns the light value while `backgroundColor` of the same element is still dark. Forced reflow does not help. Dynamically created elements with the same class do paint correctly — hence the false conclusion "my rule is broken, the neighbouring one works".

- **Three-line probe:** `el.cloneNode(true)` → insert into the same parent → read computed from the clone. The clone computes from scratch: correct colors there mean the cascade is fine and the original's computed value is stale.
- **Reliable theme check = reload the page with the theme already chosen** (`setTheme('light')` → `navigate` to the same URL), not a live switch.

## 8. Misc

- 3D dice physics does not run in a HIDDEN preview tab (rAF frozen) — verify rolls with the tab visible; subsystem details in skill `dice-3d`.
- Verify behaviour with a REAL click (`computer`), not by injecting a function call: injection masks a file that never loaded because of a stale `?v=` token.
