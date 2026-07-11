---
name: verify-ui
description: Как проверять правки dnd-app в браузерном preview — ловушки Service Worker-кеша, зависающий скриншот из-за WebGL, кумулятивная сеть. Использовать перед любой верификацией UI/стилей/JS в preview, и особенно если «правка не видна» или «скриншот виснет».
---

# Верификация в preview: обязательные обходы

Приложение — PWA с агрессивным Service Worker и непрерывным WebGL. Наивная проверка
через preview даёт ЛОЖНЫЕ результаты. Три ловушки и обходы:

## 1. SW отдаёт старый код («правка не видна»)

`sw.js` прекеширует файлы под текущим `CACHE_NAME`, fetch-обработчик матчит с
`ignoreSearch:true` — даже `?nocache=` не спасает. Если правишь `style.css`/JS и смотришь
в preview без нового CACHE_NAME — видишь СТАРУЮ копию.

**Обход (разово, через preview_eval):**
```js
(async()=>{for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();
for(const n of await caches.keys())await caches.delete(n);})()
```
затем `window.location.reload()`. На реальном деплое не нужно — `/bump` меняет CACHE_NAME.

## 2. preview_screenshot виснет (таймаут 30с)

Страница непрерывно рендерит WebGL: орбитальный фон `#bgCanvas` (rAF-цикл) + dice-box
(Babylon.js в воркере). Захват кадра не дожидается idle.

**Для стилей/layout скриншот и не нужен** — использовать `preview_inspect` или
`preview_eval` + `getComputedStyle` (в т.ч. CSS-токены через
`getComputedStyle(document.documentElement).getPropertyValue('--sh-1')`).

**Если скриншот всё же необходим** (визуальный баг, см. п. 4): перед захватом убить рендер —
`cancelAnimationFrame` активного цикла, переопределить `requestAnimationFrame` на no-op,
`WEBGL_lose_context.loseContext()` на всех canvas, `display:none` на них — потом screenshot.

## 3. preview_network кумулятивна между reload

Старые 404 от диагностических fetch висят в списке и путают. Для «что реально запросила
ЭТА загрузка» — `preview_eval` c `performance.getEntriesByType('resource')`.

## 4. Визуальные баги computed-стилями НЕ ловятся

Урок бага затемнения тура (v3.28.6): `getComputedStyle().boxShadow` показывал корректное
значение, `elementFromPoint` подтверждал оверлей — а визуально затемнения не было
(GPU не рендерил огромный spread). Для оверлеев/затемнений/наслоений единственная
достоверная проверка — реальный скриншот (с обходом из п. 2).

## 5. Скриншот «осветляет» чёрные полупрозрачные оверлеи (ложный баг)

Обратная ловушка к п. 4: JPEG-скриншот preview проходит авто-экспозицию — тёмный
кадр вытягивается по яркости. Затемнение тура `rgba(0,0,0,0.7)` на светлой теме
на скриншоте выглядит ПОЧТИ ОТСУТСТВУЮЩИМ, хотя в браузере рендерится корректно.
Проверка, что маска реально красится: временно `preview_eval` →
`document.querySelectorAll('.tour-mask').forEach(m=>m.style.background='rgba(255,0,0,0.7)')`
— насыщенный красный экспозиция не съедает. Если красный виден по всей площади,
чёрное затемнение тоже работает; «слабое чёрное затемнение на скриншоте» сам по
себе багом НЕ считать.

## 6. Preview-инструменты недоступны (нет расширения Chrome) → headless-Chrome

Если интерактивные preview-тулзы (eval/inspect/screenshot) не работают, а сервер
запущен — снимать **PNG** headless-Chrome'ом (без JPEG-автоэкспозиции из п. 5):
`chrome --headless=new --disable-gpu --hide-scrollbars --window-size=W,H
--force-device-scale-factor=DPR --virtual-time-budget=3000 --screenshot=out.png <url>`
+ попиксельный анализ Pillow'ом. Для оверлеев/затемнений есть готовая фикстура
`tests/tour-fixture.html?theme=light|dark&dim=0.5&diag=1` (детерминированная
дырка (194,144)-(526,276) CSS px). Для скриншот-матрицы ПРИЛОЖЕНИЯ (вкладки/
модалки/темы, THEME-3+) — `tests/theme-audit-fixture.html?tab=…&theme=…&scroll=…
&modal=settings|levelup&set=--токен:значение;…&keepbg=1`: сеет персонажа,
глушит rAF/WebGL, умеет A/B-инъекцию токенов без правки файлов (параметры —
в шапке файла). Ловушки: `--dump-dom` на части сборок молчит —
диагностику из страницы вытаскивать HTTP-маячком `GET /__diag?<json>` (виден в
stdout `python -m http.server`); `--window-size` при `--force-device-scale-factor`
даёт вьюпорт НЕ равный заданному (проверять `window.innerWidth` маячком).

## 7. Правки тем — проверять в ОБЕИХ темах + чекер

Любая правка style.css, задевающая цвета/токены, верифицируется в тёмной И светлой
теме (`setTheme('light')` / `setTheme('dark')` через preview_eval или кнопки в
Настройках). Плюс статические автопроверки (THEME-2):

- `node tools/check-theme.js` — 4 чека: синхрон light/auto-блоков токенов, паритет
  dark↔light, WCAG-контраст (`tools/theme-contrast-pairs.json`), ratchet хардкодов
  (`tools/theme-baseline.json`, CI падает только при РОСТЕ счётчиков).
- Новый цвет в компонентном правиле = FAIL ratchet → использовать `var(--токен)`;
  новый токен добавлять сразу в ТРИ блока (dark `:root` / light / auto) — иначе
  упадут чеки 1–2. Осознанный рост/снижение базы: `--update-baseline`.
- `node tools/check-theme.js --report` — хардкоды по секциям style.css (рабочий
  список токенизации THEME-4/5).
- PostToolUse-hook гоняет чекер на правках style.css автоматически (warn-only,
  НЕ блокирует — блокирует только CI).
- Чекер статический: НЕ заменяет скриншот-проверку (пп. 4–5) — ловит дрейф
  токенов и контраст, но не визуальные баги рендера.

## 8. Прочее

- Физика 3D-кубиков в СКРЫТОЙ вкладке preview не идёт (rAF заморожен) — броски проверять
  только с видимой вкладкой; детали дайс-подсистемы — скилл `dice-3d`.
- Функциональность проверять РЕАЛЬНЫМ кликом (`preview_click`), не инъекцией вызова функции:
  инъекция маскирует незагруженный из-за старого `?v=` токена файл.
