const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Grid settings (28 x 31 like classic layout size)
const tileSize = 16;
const cols = 28;
const rows = 31;

// Derived canvas size to match cols/rows exactly
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

const scoreEl = document.getElementById('score');
const resetBtn = document.getElementById('reset');

// Simple map: 0 empty, 1 wall, 2 dot
// Minimalistic maze border + some inner blocks
const map = [];
for (let y = 0; y < rows; y++) {
  const row = [];
  for (let x = 0; x < cols; x++) {
    const isBorder = (x === 0 || x === cols - 1 || y === 0 || y === rows - 1);
    if (isBorder) {
      row.push(1);
    } else {
      row.push(2); // fill dots by default
    }
  }
  map.push(row);
}

// carve a few inner walls
for (let x = 4; x < cols - 4; x++) {
  if (x % 2 === 0) {
    map[8][x] = 1;
    map[20][x] = 1;
  }
}
for (let y = 4; y < rows - 4; y++) {
  if (y % 2 === 0) {
    map[y][6] = 1;
    map[y][cols - 7] = 1;
  }
}

// Player
const player = {
  x: 14,
  y: 23,
  px: 14,
  py: 23,
  dirX: 0,
  dirY: 0,
  nextDirX: 0,
  nextDirY: 0,
  speed: 6, // tiles per second
  progress: 0,
};

let lastTime = 0;
let score = 0;

function canMoveTo(nx, ny) {
  if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) return false;
  return map[ny][nx] !== 1;
}

function update(dt) {
  // attempt to switch to next direction if possible
  if (player.nextDirX !== player.dirX || player.nextDirY !== player.dirY) {
    const nx = player.x + player.nextDirX;
    const ny = player.y + player.nextDirY;
    if (canMoveTo(nx, ny)) {
      player.dirX = player.nextDirX;
      player.dirY = player.nextDirY;
    }
  }

  player.progress += player.speed * dt;
  while (player.progress >= 1) {
    const nx = player.x + player.dirX;
    const ny = player.y + player.dirY;
    if (canMoveTo(nx, ny)) {
      player.x = nx;
      player.y = ny;
      // eat dot
      if (map[ny][nx] === 2) {
        map[ny][nx] = 0;
        score += 10;
        scoreEl.textContent = String(score);
      }
    } else {
      player.dirX = 0;
      player.dirY = 0;
    }
    player.progress -= 1;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw map
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = map[y][x];
      const px = x * tileSize;
      const py = y * tileSize;
      if (cell === 1) {
        ctx.fillStyle = '#0011aa';
        ctx.fillRect(px, py, tileSize, tileSize);
      } else if (cell === 2) {
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(px + tileSize / 2, py + tileSize / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // draw player (Pac-Man)
  const cx = player.x * tileSize + tileSize / 2;
  const cy = player.y * tileSize + tileSize / 2;
  ctx.fillStyle = '#ff0';
  ctx.beginPath();
  ctx.arc(cx, cy, tileSize * 0.48, 0, Math.PI * 2);
  ctx.fill();
}

function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTime) / 1000);
  lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function reset() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
        map[y][x] = 1;
      } else {
        map[y][x] = 2;
      }
    }
  }
  for (let x = 4; x < cols - 4; x++) {
    if (x % 2 === 0) {
      map[8][x] = 1;
      map[20][x] = 1;
    }
  }
  for (let y = 4; y < rows - 4; y++) {
    if (y % 2 === 0) {
      map[y][6] = 1;
      map[y][cols - 7] = 1;
    }
  }
  player.x = 14;
  player.y = 23;
  player.dirX = 0;
  player.dirY = 0;
  player.nextDirX = 0;
  player.nextDirY = 0;
  player.progress = 0;
  score = 0;
  scoreEl.textContent = '0';
}

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') { player.nextDirX = 0; player.nextDirY = -1; }
  else if (key === 'arrowdown' || key === 's') { player.nextDirX = 0; player.nextDirY = 1; }
  else if (key === 'arrowleft' || key === 'a') { player.nextDirX = -1; player.nextDirY = 0; }
  else if (key === 'arrowright' || key === 'd') { player.nextDirX = 1; player.nextDirY = 0; }
});

resetBtn.addEventListener('click', reset);

requestAnimationFrame((t) => { lastTime = t; loop(t); });

