---
name: release
description: Полный релизный цикл dnd-app — от готовой правки кода до пуша. Использовать при словах «релиз», «выпусти версию», «bump», «закоммить и запушь», а также перед любым коммитом, меняющим js/css.
---

# Релиз dnd-app: пошаговая процедура

## Инвариант (пять величин меняются синхронно, вручную не править!)

```
APP_VERSION (data.js) ↔ APP_CHANGELOG[0].version (data.js) ↔ CACHE_NAME dnd-sheet-vN (sw.js)
  ↔ все ?v=vN токены js/css в index.html ↔ CHANGELOG.md
```

Если хоть одна величина отстанет — Service Worker отдаст клиентам старый код
(классический симптом: `ReferenceError: <новая функция> is not defined` при живом UI).

## Порядок действий

1. Убедиться, что правка кода закончена и `node tests/headless-node.js` зелёный (или `/test`).
2. **`/bump <patch|minor|major> "<текст changelog>" [--type chore|feat|fix]`** — единственный
   правильный способ поднять версию. Под капотом `tools/bump-version.js` правит data.js, sw.js,
   все `?v=` токены index.html и перегенерирует CHANGELOG.md за один проход.
   - Скрипт сам делает `git fetch` и сверяет версии с origin; если origin впереди — упадёт
     с подсказкой `git pull`. Это защита от дубля номера, не ошибка.
   - Никогда не бампить версии руками по файлам — легко получить рассинхрон.
3. **`/preflight`** — тесты + сверка инварианта (`tools/check-invariant.js`).
4. **Коммит — ТОЛЬКО по явному запросу пользователя.** Формат: `vX.Y.Z: тип(scope): описание`
   на русском (типы: feat/fix/chore). Без упоминаний маркетинга/TG-постов в публичных коммитах
   и в APP_CHANGELOG.
5. **Push.** Почти всегда прилетит `! [rejected] non-fast-forward` — пользователь пушит с другого
   места marketing-коммиты (`chore(docs):`, `docs/marketing/**`). Это НЕ коллизия версии:
   - `git fetch origin main`
   - `git log --oneline HEAD..origin/main` — убедиться, что там только docs/marketing
   - `git pull --rebase origin main` → `git push`
   - Merge-коммит не делать.
6. Если просят релиз-пост: сухо по факту, тон = changelog (числа/имена/значения, без эпитетов
   и рекламных вступлений). Сохранить в `docs/marketing/posts/NN-*.txt`, коммит отдельный
   со scope `chore(docs):`.

## Хуки, которые сработают по пути

- Правка `sw.js` через Edit/Write → hook напечатает текущий CACHE_NAME и заблокирует (exit 2) —
  напоминание бампить через `/bump`, а не руками. `tools/bump-version.js` работает через node
  и хуки не триггерит.
- Правка `data.js` при `APP_VERSION !== APP_CHANGELOG[0].version` → блок (exit 2).
- Любая правка `*.js` → авто-тесты в warn-режиме (не блокирует, но читать вывод).

## Связанные скиллы

- Проверка правки в браузере перед релизом — скилл `verify-ui` (там про ловушку SW-кеша).
