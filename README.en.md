# DnD-List

**A D&D 5e character sheet for the browser and phone. Free, no sign-up, works offline.**

> ⚠️ **The app is in Russian only for now.** This page exists to find out whether an English version is worth building — if you'd use one, please ⭐ the repo or say so in [Issues](https://github.com/D1MANYCH/dnd-app/issues).

🎲 **[Open the app →](https://d1manych.github.io/dnd-app/)** &nbsp;&nbsp; 🇷🇺 [README на русском](README.md)

---

## What it is

A PWA for running a D&D 5e character. Open the link and play. Characters are stored in your browser, and everything works offline after the first load. No account and no server — your data stays on your device. Optional sync between your own devices goes through a file in your Google Drive ([what is stored](https://d1manych.github.io/dnd-app/privacy.html)).

## What's inside

| | |
|---|---|
| 📚 **Two editions** | 2014 and 2024 rules, chosen per character. Each character has its own set of enabled books. |
| 🎯 **48 ready-made builds** | For every class, with a level 1–20 progression guide, playstyle, pros and cons. |
| 📜 **760 spells** | Search, class filters, slot tracking, concentration, rituals. A **Use** button applies the mechanics: spends a slot, rolls damage or healing with upcasting, makes spell attacks, puts buffs and debuffs into the combat tracker. |
| 🎲 **3D dice** | Physics-based dice rolls (WebGL), roll history. |
| ⚔️ **Combat** | Initiative, conditions, death saves, a party tracker with allies and SRD monsters. |
| 🎒 **Inventory** | Gear, weapons with weight, cost and proficiencies, magic items, money. |
| 🔒 **Sheet lock** | Things that change only on level-up are locked during play, so you can't break the sheet by accident. |
| 📝 **Notes** | NPCs, quests, locations, sessions. Markdown, tags, search, export to `.md`/`.json`. |
| 📱 **PWA** | Installs to the home screen, works offline, phone and desktop layouts. |
| 💾 **Backups** | JSON export/import, PDF export of the sheet. |

## Screenshots

| Character sheet | Builds | Build guide |
|---|---|---|
| ![](docs/screenshots/01-character-sheet.webp) | ![](docs/screenshots/02-builds-picker.webp) | ![](docs/screenshots/03-build-guide.webp) |

| Spells | 3D dice | Combat tracker |
|---|---|---|
| ![](docs/screenshots/04-spells.webp) | ![](docs/screenshots/05-dice.webp) | ![](docs/screenshots/06-combat.webp) |

## How it's made

This is my first software project — I have no programming background. I started it to give my own party a convenient sheet, and I build it openly with AI:

- 🤖 **Claude (Claude Code)** — the app code
- 🎨 **Gemini and ChatGPT** — images and icons

I decide what to add, how it should work and how it plays at a real table, and I test it myself.

The stack is deliberately plain: vanilla **JavaScript + HTML + CSS**, no bundler and no runtime dependencies, a **PWA** (Service Worker + manifest) for offline use, 3D dice on **WebGL** (`@3d-dice/dice-box`).

## Version

Current: **v4.32.2** (October 8, 2026). Full changelog (in Russian) — [CHANGELOG.md](CHANGELOG.md).

## For developers

Architecture, data schema, migrations — [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (in Russian).

Run locally with any static server from the repo root (`python3 -m http.server` works). PWA features need `https` or `localhost`.

Tests: `node tests/headless-node.js`.
