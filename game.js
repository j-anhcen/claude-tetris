'use strict';

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

const COLORS = [
  null,
  '#4dd0e1', // I - cyan
  '#ffd54f', // O - yellow
  '#ba68c8', // T - purple
  '#81c784', // S - green
  '#e57373', // Z - red
  '#90caf9', // J - pale blue
  '#ffb74d', // L - orange
  '#b0bec5', // Nut - silver
];

const COLORS_LIGHT = [
  null,
  '#0891b2', // I - dark cyan
  '#ca8a04', // O - dark yellow
  '#9333ea', // T - dark purple
  '#16a34a', // S - dark green
  '#dc2626', // Z - dark red
  '#2563eb', // J - blue
  '#ea580c', // L - dark orange
  '#546e7a', // Nut - steel
];

const COLORS_NEON = [
  null,
  '#00ffff', // I - electric cyan
  '#ffff00', // O - electric yellow
  '#ff00ff', // T - magenta
  '#00ff88', // S - electric green
  '#ff3333', // Z - electric red
  '#4488ff', // J - electric blue
  '#ff8800', // L - electric orange
  '#cc99ff', // Nut - electric violet
];

const COLORS_PASTEL = [
  null,
  '#a8e6f0', // I - pastel cyan
  '#fff0a0', // O - pastel yellow
  '#dbb8f0', // T - pastel purple
  '#b8e8b8', // S - pastel green
  '#f0b8b8', // Z - pastel red
  '#b8d0f0', // J - pastel blue
  '#f0d0a0', // L - pastel orange
  '#d8d8e8', // Nut - pastel silver
];

const COLORS_PIXEL = [
  null,
  '#29b6d0', // I
  '#e6c040', // O
  '#a050b8', // T
  '#60b060', // S
  '#c85050', // Z
  '#6080c0', // J
  '#d08830', // L
  '#8890a0', // Nut
];

// ---- Skin definitions ----

function drawBlockRetro(context, x, y, colorIndex, size, alpha, colors) {
  if (!colorIndex) return;
  const color = colors[colorIndex];
  context.globalAlpha = alpha ?? 1;
  context.fillStyle = color;
  context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  context.fillStyle = 'rgba(255,255,255,0.12)';
  context.fillRect(x * size + 1, y * size + 1, size - 2, 4);
  context.globalAlpha = 1;
}

function drawBlockNeon(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = COLORS_NEON[colorIndex];
  const a = alpha ?? 1;
  context.globalAlpha = a;
  context.shadowBlur = 15;
  context.shadowColor = color;
  context.fillStyle = color;
  context.fillRect(x * size + 2, y * size + 2, size - 4, size - 4);
  // inner bright center
  context.fillStyle = 'rgba(255,255,255,0.25)';
  context.fillRect(x * size + 4, y * size + 4, size - 8, size - 8);
  context.shadowBlur = 0;
  context.globalAlpha = 1;
}

function drawBlockPastel(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const color = COLORS_PASTEL[colorIndex];
  const a = alpha ?? 1;
  context.globalAlpha = a;
  const px = x * size + 2;
  const py = y * size + 2;
  const w = size - 4;
  const h = size - 4;
  const r = Math.min(6, w / 3);
  context.fillStyle = color;
  context.beginPath();
  if (context.roundRect) {
    context.roundRect(px, py, w, h, r);
  } else {
    context.moveTo(px + r, py);
    context.lineTo(px + w - r, py);
    context.arcTo(px + w, py, px + w, py + r, r);
    context.lineTo(px + w, py + h - r);
    context.arcTo(px + w, py + h, px + w - r, py + h, r);
    context.lineTo(px + r, py + h);
    context.arcTo(px, py + h, px, py + h - r, r);
    context.lineTo(px, py + r);
    context.arcTo(px, py, px + r, py, r);
    context.closePath();
  }
  context.fill();
  // soft highlight
  context.fillStyle = 'rgba(255,255,255,0.3)';
  context.beginPath();
  if (context.roundRect) {
    context.roundRect(px + 2, py + 2, w - 4, Math.floor(h * 0.35), r / 2);
  } else {
    context.rect(px + 2, py + 2, w - 4, Math.floor(h * 0.35));
  }
  context.fill();
  context.globalAlpha = 1;
}

function drawBlockPixel(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  const base = COLORS_PIXEL[colorIndex];
  const a = alpha ?? 1;
  context.globalAlpha = a;

  // Parse hex to RGB for manipulation
  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);
  const darker = `rgb(${Math.floor(r * 0.55)},${Math.floor(g * 0.55)},${Math.floor(b * 0.55)})`;
  const lighter = `rgb(${Math.min(255, Math.floor(r * 1.4))},${Math.min(255, Math.floor(g * 1.4))},${Math.min(255, Math.floor(b * 1.4))})`;

  const GRID = 4;
  const cell = (size - 2) / GRID;
  const ox = x * size + 1;
  const oy = y * size + 1;

  for (let pr = 0; pr < GRID; pr++) {
    for (let pc = 0; pc < GRID; pc++) {
      const isBorder = pr === 0 || pr === GRID - 1 || pc === 0 || pc === GRID - 1;
      const isInnerCenter = pr > 0 && pr < GRID - 1 && pc > 0 && pc < GRID - 1;
      if (isBorder) {
        context.fillStyle = darker;
      } else if (isInnerCenter) {
        context.fillStyle = lighter;
      } else {
        context.fillStyle = base;
      }
      context.fillRect(
        ox + pc * cell,
        oy + pr * cell,
        Math.ceil(cell),
        Math.ceil(cell)
      );
    }
  }
  context.globalAlpha = 1;
}

// ---- Skin objects ----

const SKINS = {
  retro: {
    name: 'retro',
    drawBlock(ctx, x, y, colorIdx, size, alpha) {
      const colors = document.body.classList.contains('light-mode') ? COLORS_LIGHT : COLORS;
      drawBlockRetro(ctx, x, y, colorIdx, size, alpha, colors);
    },
  },
  neon: {
    name: 'neon',
    drawBlock(ctx, x, y, colorIdx, size, alpha) {
      drawBlockNeon(ctx, x, y, colorIdx, size, alpha);
    },
  },
  pastel: {
    name: 'pastel',
    drawBlock(ctx, x, y, colorIdx, size, alpha) {
      drawBlockPastel(ctx, x, y, colorIdx, size, alpha);
    },
  },
  pixel: {
    name: 'pixel',
    drawBlock(ctx, x, y, colorIdx, size, alpha) {
      drawBlockPixel(ctx, x, y, colorIdx, size, alpha);
    },
  },
};

let activeSkin = SKINS.retro;

// ---- Pieces ----

const PIECES = [
  null,
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
  [[2,2],[2,2]],                               // O
  [[0,3,0],[3,3,3],[0,0,0]],                  // T
  [[0,4,4],[4,4,0],[0,0,0]],                  // S
  [[5,5,0],[0,5,5],[0,0,0]],                  // Z
  [[6,0,0],[6,6,6],[0,0,0]],                  // J
  [[0,0,7],[7,7,7],[0,0,0]],                  // L
  [[8,8,8],[8,0,8],[8,8,8]],                  // Nut
];

const LINE_SCORES = [0, 100, 300, 500, 800];

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayScore = document.getElementById('overlay-score');
const restartBtn = document.getElementById('restart-btn');

let board, current, next, score, lines, level, paused, gameOver, lastTime, dropAccum, dropInterval, animId;

function createBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function randomPiece() {
  const type = Math.floor(Math.random() * 8) + 1;
  const shape = PIECES[type].map(row => [...row]);
  return { type, shape, x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 };
}

function collide(shape, ox, oy) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = ox + c;
      const ny = oy + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function rotateCW(shape) {
  const rows = shape.length, cols = shape[0].length;
  const result = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      result[c][rows - 1 - r] = shape[r][c];
  return result;
}

function tryRotate() {
  const rotated = rotateCW(current.shape);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (!collide(rotated, current.x + kick, current.y)) {
      current.shape = rotated;
      current.x += kick;
      return;
    }
  }
}

function merge() {
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      if (current.shape[r][c])
        board[current.y + r][current.x + c] = current.shape[r][c];
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== 0)) {
      board.splice(r, 1);
      board.unshift(new Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  if (cleared) {
    lines += cleared;
    score += (LINE_SCORES[cleared] || 0) * level;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 90);
    updateHUD();
  }
}

function ghostY() {
  let gy = current.y;
  while (!collide(current.shape, current.x, gy + 1)) gy++;
  return gy;
}

function hardDrop() {
  const gy = ghostY();
  score += (gy - current.y) * 2;
  current.y = gy;
  lockPiece();
}

function softDrop() {
  if (!collide(current.shape, current.x, current.y + 1)) {
    current.y++;
    score += 1;
    updateHUD();
  } else {
    lockPiece();
  }
}

function lockPiece() {
  merge();
  clearLines();
  spawn();
}

function spawn() {
  current = next;
  next = randomPiece();
  if (collide(current.shape, current.x, current.y)) {
    endGame();
  }
  drawNext();
}

function updateHUD() {
  scoreEl.textContent = score.toLocaleString();
  linesEl.textContent = lines;
  levelEl.textContent = level;
}

function drawBlock(context, x, y, colorIndex, size, alpha) {
  activeSkin.drawBlock(context, x, y, colorIndex, size, alpha);
}

function drawGrid() {
  const isNeon = activeSkin.name === 'neon';
  if (isNeon) {
    ctx.strokeStyle = '#1a1a2a';
  } else {
    ctx.strokeStyle = document.body.classList.contains('light-mode') ? '#e0e0e8' : '#22222e';
  }
  ctx.lineWidth = 0.5;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * BLOCK, 0);
    ctx.lineTo(c * BLOCK, ROWS * BLOCK);
    ctx.stroke();
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * BLOCK);
    ctx.lineTo(COLS * BLOCK, r * BLOCK);
    ctx.stroke();
  }
}

function draw() {
  if (activeSkin.name === 'neon') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  drawGrid();

  // board
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawBlock(ctx, c, r, board[r][c], BLOCK);

  // ghost
  const gy = ghostY();
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      if (current.shape[r][c])
        drawBlock(ctx, current.x + c, gy + r, current.shape[r][c], BLOCK, 0.2);

  // current piece
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      drawBlock(ctx, current.x + c, current.y + r, current.shape[r][c], BLOCK);
}

function drawNext() {
  const NB = 30;
  if (activeSkin.name === 'neon') {
    nextCtx.fillStyle = '#000000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  } else {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  }
  const shape = next.shape;
  const offX = Math.floor((4 - shape[0].length) / 2);
  const offY = Math.floor((4 - shape.length) / 2);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      drawBlock(nextCtx, offX + c, offY + r, shape[r][c], NB);
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animId);
  overlayTitle.textContent = 'GAME OVER';
  overlayScore.textContent = `Puntuación: ${score.toLocaleString()}`;
  overlay.classList.remove('hidden');
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) {
    lastTime = performance.now();
    loop(lastTime);
  } else {
    cancelAnimationFrame(animId);
    overlayTitle.textContent = 'PAUSA';
    overlayScore.textContent = '';
    overlay.classList.remove('hidden');
  }
}

function loop(ts) {
  if (gameOver) return;
  const dt = ts - lastTime;
  lastTime = ts;
  dropAccum += dt;
  if (dropAccum >= dropInterval) {
    dropAccum = 0;
    if (!collide(current.shape, current.x, current.y + 1)) {
      current.y++;
    } else {
      lockPiece();
    }
  }
  draw();
  animId = requestAnimationFrame(loop);
}

function init() {
  board = createBoard();
  score = 0;
  lines = 0;
  level = 1;
  paused = false;
  gameOver = false;
  dropInterval = 1000;
  dropAccum = 0;
  lastTime = performance.now();
  next = randomPiece();
  spawn();
  updateHUD();
  overlay.classList.add('hidden');
  cancelAnimationFrame(animId);
  animId = requestAnimationFrame(loop);
}

function setSkin(name) {
  activeSkin = SKINS[name] || SKINS.retro;
  localStorage.setItem('tetris_skin', name);
  document.querySelectorAll('.skin-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.skin === name);
  });
  if (!gameOver && !paused) draw();
  drawNext();
}

document.addEventListener('keydown', e => {
  if (e.code === 'KeyP') { togglePause(); return; }
  if (paused || gameOver) return;
  switch (e.code) {
    case 'ArrowLeft':
      if (!collide(current.shape, current.x - 1, current.y)) current.x--;
      break;
    case 'ArrowRight':
      if (!collide(current.shape, current.x + 1, current.y)) current.x++;
      break;
    case 'ArrowDown':
      softDrop();
      break;
    case 'ArrowUp':
    case 'KeyX':
      tryRotate();
      break;
    case 'Space':
      e.preventDefault();
      hardDrop();
      break;
  }
  updateHUD();
});

restartBtn.addEventListener('click', init);

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-mode');
  document.getElementById('theme-toggle').textContent = isLight ? '✔ Dark' : '☀ Light';
  if (!gameOver && !paused) draw();
  drawNext();
});

document.querySelectorAll('.skin-btn').forEach(btn => {
  btn.addEventListener('click', () => setSkin(btn.dataset.skin));
});

// Restore saved skin
const savedSkin = localStorage.getItem('tetris_skin');
if (savedSkin && SKINS[savedSkin]) {
  activeSkin = SKINS[savedSkin];
}

init();

// Mark active skin button after init
document.querySelectorAll('.skin-btn').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.skin === activeSkin.name);
});
