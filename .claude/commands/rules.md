---
description: Check changed math against the rulebook (dnd-rules judge subagent)
argument-hint: [функция|файл]  (пусто — весь diff ветки)
---
Аргумент: $ARGUMENTS. Запусти сабагента `dnd-rules`. Пустой аргумент — судить незакоммиченные правки плюс `git diff main...HEAD`; иначе — только названные функции или файлы. Покажи вердикт как есть, без пересказа. Код по итогам вердикта не правь, пока пользователь не попросит.
