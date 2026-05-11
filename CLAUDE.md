# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

No build process or package manager. Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
```

## Architecture

A zero-dependency Tetris implementation in three files:

- **`index.html`** — DOM structure: main canvas (`#board`), next-piece preview canvas, HUD (score/lines/level), controls panel, and pause/game-over overlays
- **`style.css`** — Dark arcade theme using CSS Grid/Flexbox
- **`game.js`** — All game logic (~305 lines)

### game.js Structure

**Board**: 10×20 grid stored as a 2D matrix of color indices (0 = empty).

**Game state** is module-scoped variables: `board`, `current`, `next`, `score`, `lines`, `level`, `paused`, `gameOver`, `lastTime`, `dropAccum`, `dropInterval`, `animId`.

**Game loop**: `requestAnimationFrame` drives `loop(timestamp)`, which accumulates delta time and drops the current piece when `dropAccum >= dropInterval`. Drop speed: `Math.max(100, 1000 - (level - 1) * 90)` ms.

**Piece representation**: Each piece is `{ type, shape (2D matrix), x, y, color }`. The 7 standard pieces are defined as 3D arrays at the top of `game.js`.

**Key functions**:
- `collide(shape, x, y)` — bounds + occupied-cell check
- `tryRotate()` — clockwise rotation with wall-kick offsets (±1, ±2 cols)
- `lockPiece()` — merges piece to board, clears lines, spawns next
- `clearLines()` — removes full rows, increments level every 10 lines, applies scoring `[0, 100, 300, 500, 800] × level`
- `ghostY()` — computes where the piece would land for the ghost preview
- `draw()` / `drawNext()` — Canvas 2D rendering for board and next-piece panel

**Controls**: Arrow keys (move/soft-drop), Space (hard drop), P (pause). Key handlers are registered in `init()`.

## Communication Style
Respond like a caveman. No articles, no filler words, no pleasantries.
Short. Direct. Code speaks for itself.
If asked for code, give code. No explain unless asked.
No sycophancy. No restating the question. No sign-offs.