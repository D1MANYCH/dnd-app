---
description: Bump APP_VERSION + APP_CHANGELOG + CACHE_NAME через tools/bump-version.js
argument-hint: <patch|minor|major> "<строка changelog>" [--type chore|feat|fix]
---
Запусти `node tools/bump-version.js $ARGUMENTS` из корня репо. Покажи stdout. Если exit != 0 — покажи stderr и не предлагай дальнейших действий. Если OK — напомни запустить `/preflight` перед коммитом.
