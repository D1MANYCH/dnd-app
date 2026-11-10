---
disable-model-invocation: true
description: Build the short release announcement (links to changelog, detailed log, patch)
argument-hint: [версия] [--out <slug>]
---
Вызови субагента `relpost` (`.claude/agents/relpost.md` — единственный источник формата и тона) с аргументами: $ARGUMENTS. Верни его текст поста и строку статуса как есть.
