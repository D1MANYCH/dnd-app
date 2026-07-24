---
description: Стартовать фазу плана X-N из memory
argument-hint: <X-N>  (например DEV-3, BUGFIX-2)
---
Аргумент: $ARGUMENTS. Найди в `~/.claude/projects/.../memory/MEMORY.md` соответствующий project_*_plan.md, прочитай блок фазы $ARGUMENTS. Если фаза уже **done** — стоп, скажи об этом. Иначе следуй плану фазы как обычной задаче, в начале кратко перечисли deliverables.
