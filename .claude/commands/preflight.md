---
disable-model-invocation: true
description: Check release readiness — tests, versions, CACHE_NAME
---
Запусти параллельно:
1. `node tests/headless-node.js` — итог одной строкой.
2. `node tools/check-invariant.js` — сверка `APP_VERSION` ↔ `APP_CHANGELOG[0].version` ↔ `CACHE_NAME` ↔ `?v=` ↔ `CHANGELOG.md`; расхождения — списком.

Итог: `[preflight] OK` или нумерованный список проблем.
