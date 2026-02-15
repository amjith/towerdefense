const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 64;
const GRID_W = 12;
const GRID_H = 9;

canvas.width = GRID_W * TILE_SIZE;
canvas.height = GRID_H * TILE_SIZE;

const ui = {
  levelName: document.getElementById("levelName"),
  waveLabel: document.getElementById("waveLabel"),
  lives: document.getElementById("lives"),
  money: document.getElementById("money"),
  status: document.getElementById("status"),
  wrap: document.querySelector(".canvas-wrap"),
  startWave: document.getElementById("startWave"),
  nextLevel: document.getElementById("nextLevel"),
  speed: document.getElementById("toggleSpeed"),
  selection: document.getElementById("selectionInfo"),
  upgrade: document.getElementById("upgradeBtn"),
  sell: document.getElementById("sellBtn"),
  toast: document.getElementById("toast"),
  gameOver: document.getElementById("gameOverOverlay"),
  win: document.getElementById("winOverlay"),
  towerButtons: Array.from(document.querySelectorAll(".tower-btn")),
};

const STYLE_SETS = {
  frontier: {
    grass: "assets/styles/frontier/grass.png",
    path: "assets/styles/frontier/path.png",
    turret: "assets/styles/frontier/turret.png",
    catapult: "assets/styles/frontier/slingshot.png",
    spike: "assets/styles/frontier/spike.png",
    fire: "assets/styles/frontier/fire.png",
    enemyScout: "assets/styles/frontier/enemy-scout.png",
    enemyBrute: "assets/styles/frontier/enemy-brute.png",
    enemyTank: "assets/styles/frontier/enemy-tank.png",
  },
  dungeon: {
    grass: "assets/styles/dungeon/grass.png",
    path: "assets/styles/dungeon/path.png",
    turret: "assets/styles/dungeon/turret.png",
    catapult: "assets/styles/dungeon/catapult.png",
    spike: "assets/styles/dungeon/spike.png",
    fire: "assets/styles/dungeon/fire.png",
    enemyScout: "assets/styles/dungeon/enemy-scout.png",
    enemyBrute: "assets/styles/dungeon/enemy-brute.png",
    enemyTank: "assets/styles/dungeon/enemy-tank.png",
  },
  armored: {
    grass: "assets/styles/armored/grass.png",
    path: "assets/styles/armored/path.png",
    turret: "assets/styles/armored/turret.png",
    catapult: "assets/styles/armored/catapult.png",
    spike: "assets/styles/armored/spike.png",
    fire: "assets/styles/armored/fire.png",
    enemyScout: "assets/styles/armored/enemy-scout.png",
    enemyBrute: "assets/styles/armored/enemy-brute.png",
    enemyTank: "assets/styles/armored/enemy-tank.png",
  },
};

const STYLE_ORDER = ["frontier", "dungeon", "armored"];

const LEVEL_VISUALS = [
  {
    accent: "#f06b4f",
    accent2: "#2db6a3",
    accent3: "#f3b64d",
    bgTop: "#f8f3e9",
    bgMid: "#f3e3cb",
    bgBottom: "#e1c9a5",
    mapTint: "rgba(255, 198, 129, 0.08)",
    towerFilter: "none",
    enemyFilter: "none",
    enemyBar: "#f06b4f",
  },
  {
    accent: "#d95f46",
    accent2: "#4ea56a",
    accent3: "#d2b45e",
    bgTop: "#edf3e0",
    bgMid: "#dfe8c6",
    bgBottom: "#bccba0",
    mapTint: "rgba(95, 146, 96, 0.12)",
    towerFilter: "hue-rotate(16deg) saturate(1.08)",
    enemyFilter: "hue-rotate(22deg) saturate(1.2)",
    enemyBar: "#d95f46",
  },
  {
    accent: "#5a7fdb",
    accent2: "#2ca7b0",
    accent3: "#89c4ec",
    bgTop: "#e5eff7",
    bgMid: "#d2dfef",
    bgBottom: "#afc2de",
    mapTint: "rgba(112, 152, 218, 0.14)",
    towerFilter: "hue-rotate(90deg) saturate(1.05)",
    enemyFilter: "hue-rotate(96deg) saturate(1.2)",
    enemyBar: "#5a7fdb",
  },
  {
    accent: "#dd7d3c",
    accent2: "#3588b6",
    accent3: "#efbe74",
    bgTop: "#f7e8d9",
    bgMid: "#eed4b7",
    bgBottom: "#d9b08c",
    mapTint: "rgba(214, 124, 56, 0.11)",
    towerFilter: "hue-rotate(-10deg) saturate(1.15)",
    enemyFilter: "hue-rotate(-14deg) saturate(1.25)",
    enemyBar: "#dd7d3c",
  },
  {
    accent: "#7a5ad8",
    accent2: "#2697a0",
    accent3: "#c5a0ec",
    bgTop: "#ece5f8",
    bgMid: "#ddd0ef",
    bgBottom: "#c4b0df",
    mapTint: "rgba(123, 90, 216, 0.11)",
    towerFilter: "hue-rotate(140deg) saturate(1.12)",
    enemyFilter: "hue-rotate(160deg) saturate(1.24)",
    enemyBar: "#7a5ad8",
  },
  {
    accent: "#c95758",
    accent2: "#56a8b5",
    accent3: "#dba06b",
    bgTop: "#f4e3e4",
    bgMid: "#e8ccce",
    bgBottom: "#cfaab0",
    mapTint: "rgba(196, 89, 97, 0.12)",
    towerFilter: "hue-rotate(196deg) saturate(1.15)",
    enemyFilter: "hue-rotate(204deg) saturate(1.3)",
    enemyBar: "#c95758",
  },
  {
    accent: "#4d8aa7",
    accent2: "#2f8f60",
    accent3: "#8ec7c4",
    bgTop: "#deeff1",
    bgMid: "#c8dfe3",
    bgBottom: "#a5c2c7",
    mapTint: "rgba(84, 148, 178, 0.11)",
    towerFilter: "hue-rotate(250deg) saturate(1.08)",
    enemyFilter: "hue-rotate(262deg) saturate(1.2)",
    enemyBar: "#4d8aa7",
  },
  {
    accent: "#8d6052",
    accent2: "#3f88a1",
    accent3: "#d4b181",
    bgTop: "#f0e5dd",
    bgMid: "#e1d0c2",
    bgBottom: "#c8ad95",
    mapTint: "rgba(126, 91, 71, 0.1)",
    towerFilter: "hue-rotate(300deg) saturate(1.1)",
    enemyFilter: "hue-rotate(314deg) saturate(1.22)",
    enemyBar: "#8d6052",
  },
];

const TOWER_TYPES = {
  turret: {
    name: "Turret",
    cost: 21,
    range: 150,
    fireRate: 0.7,
    damage: 8,
    projectileSpeed: 320,
    burst: 1,
    sprite: "turret",
  },
  slingshot: {
    name: "Catapult",
    cost: 24,
    range: 200,
    fireRate: 1.1,
    damage: 6,
    projectileSpeed: 260,
    burst: 1,
    sprite: "catapult",
  },
  spike: {
    name: "Spike Trap",
    cost: 20,
    range: 0,
    fireRate: 0.65,
    damage: 8,
    projectileSpeed: 0,
    burst: 0,
    sprite: "spike",
    trap: true,
    aoe: 0,
  },
  fire: {
    name: "Fire Trap",
    cost: 26,
    range: 0,
    fireRate: 1.4,
    damage: 6,
    projectileSpeed: 0,
    burst: 0,
    sprite: "fire",
    trap: true,
    aoe: 90,
  },
};

const ENEMY_TYPES = {
  scout: {
    name: "Scout",
    speed: 60,
    health: 28,
    reward: 4,
    sprite: "enemyScout",
  },
  brute: {
    name: "Brute",
    speed: 45,
    health: 60,
    reward: 7,
    sprite: "enemyBrute",
  },
  tank: {
    name: "Tank",
    speed: 30,
    health: 130,
    reward: 12,
    sprite: "enemyTank",
  },
};

const LEVELS = [
  {
    name: "Marsh Run",
    style: "frontier",
    path: {
      start: { x: 0, y: 4 },
      end: { x: 11, y: 6 },
      minTurns: 3,
      maxTurns: 6,
      minExtra: 6,
      maxExtra: 18,
    },
    waves: [
      [{ type: "scout", count: 8, gap: 0.7 }],
      [
        { type: "scout", count: 10, gap: 0.6 },
        { type: "brute", count: 3, gap: 1.1, delay: 1.2 },
      ],
      [
        { type: "scout", count: 12, gap: 0.55 },
        { type: "brute", count: 5, gap: 1.0, delay: 0.8 },
      ],
    ],
  },
  {
    name: "Crystal Switchbacks",
    style: "dungeon",
    path: {
      start: { x: 0, y: 2 },
      end: { x: 11, y: 1 },
      minTurns: 4,
      maxTurns: 7,
      minExtra: 8,
      maxExtra: 22,
    },
    waves: [
      [
        { type: "scout", count: 10, gap: 0.6 },
        { type: "brute", count: 4, gap: 1.1, delay: 1 },
      ],
      [
        { type: "scout", count: 10, gap: 0.55 },
        { type: "brute", count: 6, gap: 0.95, delay: 0.9 },
      ],
      [
        { type: "brute", count: 6, gap: 0.9 },
        { type: "tank", count: 2, gap: 1.6, delay: 1.5 },
      ],
    ],
  },
  {
    name: "Cinder Pass",
    style: "armored",
    path: {
      start: { x: 0, y: 7 },
      end: { x: 11, y: 1 },
      minTurns: 5,
      maxTurns: 8,
      minExtra: 10,
      maxExtra: 26,
    },
    waves: [
      [
        { type: "scout", count: 12, gap: 0.5 },
        { type: "brute", count: 4, gap: 1.0, delay: 1 },
      ],
      [
        { type: "brute", count: 8, gap: 0.85 },
        { type: "tank", count: 3, gap: 1.5, delay: 1.4 },
      ],
      [
        { type: "scout", count: 14, gap: 0.5 },
        { type: "brute", count: 10, gap: 0.8, delay: 1.0 },
        { type: "tank", count: 4, gap: 1.2, delay: 1.8 },
      ],
    ],
  },
  {
    name: "Verdant Zigzag",
    style: "frontier",
    path: {
      start: { x: 0, y: 5 },
      end: { x: 11, y: 3 },
      minTurns: 4,
      maxTurns: 7,
      minExtra: 8,
      maxExtra: 22,
    },
    waves: [
      [
        { type: "scout", count: 14, gap: 0.48 },
        { type: "brute", count: 4, gap: 0.95, delay: 1.0 },
      ],
      [
        { type: "scout", count: 10, gap: 0.45 },
        { type: "brute", count: 8, gap: 0.85, delay: 0.8 },
      ],
      [
        { type: "brute", count: 10, gap: 0.8 },
        { type: "tank", count: 2, gap: 1.6, delay: 1.4 },
      ],
    ],
  },
  {
    name: "Obsidian Loop",
    style: "dungeon",
    path: {
      start: { x: 0, y: 1 },
      end: { x: 11, y: 7 },
      minTurns: 5,
      maxTurns: 8,
      minExtra: 10,
      maxExtra: 26,
    },
    waves: [
      [
        { type: "scout", count: 16, gap: 0.45 },
        { type: "brute", count: 5, gap: 0.9, delay: 0.9 },
      ],
      [
        { type: "brute", count: 8, gap: 0.8 },
        { type: "tank", count: 3, gap: 1.5, delay: 1.2 },
      ],
      [
        { type: "scout", count: 12, gap: 0.42 },
        { type: "brute", count: 10, gap: 0.75, delay: 1.0 },
        { type: "tank", count: 4, gap: 1.3, delay: 1.6 },
      ],
    ],
  },
  {
    name: "Iron Wastes",
    style: "armored",
    path: {
      start: { x: 0, y: 6 },
      end: { x: 11, y: 2 },
      minTurns: 6,
      maxTurns: 9,
      minExtra: 12,
      maxExtra: 28,
    },
    waves: [
      [
        { type: "scout", count: 14, gap: 0.42 },
        { type: "brute", count: 6, gap: 0.85, delay: 0.9 },
      ],
      [
        { type: "brute", count: 10, gap: 0.75 },
        { type: "tank", count: 3, gap: 1.4, delay: 1.2 },
      ],
      [
        { type: "brute", count: 8, gap: 0.7 },
        { type: "tank", count: 6, gap: 1.25, delay: 1.0 },
      ],
    ],
  },
  {
    name: "Sunken Spur",
    style: "frontier",
    path: {
      start: { x: 0, y: 3 },
      end: { x: 11, y: 5 },
      minTurns: 5,
      maxTurns: 8,
      minExtra: 10,
      maxExtra: 26,
    },
    waves: [
      [
        { type: "scout", count: 18, gap: 0.4 },
        { type: "brute", count: 6, gap: 0.85, delay: 0.8 },
      ],
      [
        { type: "brute", count: 10, gap: 0.7 },
        { type: "tank", count: 4, gap: 1.4, delay: 1.1 },
      ],
      [
        { type: "scout", count: 16, gap: 0.38 },
        { type: "brute", count: 12, gap: 0.7, delay: 0.9 },
        { type: "tank", count: 4, gap: 1.15, delay: 1.4 },
      ],
    ],
  },
  {
    name: "Gilded Grotto",
    style: "dungeon",
    path: {
      start: { x: 0, y: 4 },
      end: { x: 11, y: 4 },
      minTurns: 6,
      maxTurns: 9,
      minExtra: 12,
      maxExtra: 30,
    },
    waves: [
      [
        { type: "scout", count: 18, gap: 0.38 },
        { type: "brute", count: 8, gap: 0.75, delay: 0.8 },
      ],
      [
        { type: "brute", count: 12, gap: 0.68 },
        { type: "tank", count: 5, gap: 1.2, delay: 1.1 },
      ],
      [
        { type: "brute", count: 10, gap: 0.65 },
        { type: "tank", count: 8, gap: 1.05, delay: 1.0 },
      ],
    ],
  },
];

const game = {
  levelIndex: 0,
  waveIndex: 0,
  lives: 20,
  money: 50,
  speed: 1,
  waveActive: false,
  waveTimer: 0,
  spawnQueue: [],
  enemies: [],
  towers: [],
  projectiles: [],
  effects: [],
  confetti: [],
  hoverCell: null,
  selectedTower: null,
  buildSelection: null,
  map: [],
  pathPoints: [],
  pathCells: [],
  levelDifficulty: { health: 1, speed: 1, reward: 1 },
  levelVisual: LEVEL_VISUALS[0],
  gameOver: false,
  gameWon: false,
};

const images = {};
let currentStyle = STYLE_ORDER[0];
let lastTime = 0;
let nextEnemyId = 1;

function loadImages() {
  const paths = new Set();
  Object.values(STYLE_SETS).forEach((set) => {
    Object.values(set).forEach((path) => paths.add(path));
  });

  let loaded = 0;
  return new Promise((resolve) => {
    paths.forEach((path) => {
      const img = new Image();
      img.onload = () => {
        loaded += 1;
        if (loaded === paths.size) {
          resolve();
        }
      };
      img.src = encodeURI(path);
      images[path] = img;
    });
  });
}

function getSprite(key) {
  const path = STYLE_SETS[currentStyle][key];
  return images[path];
}

function getLevelDifficulty(index) {
  return {
    health: 1 + index * 0.15,
    speed: 1 + index * 0.07,
    reward: 1 + index * 0.08,
  };
}

function applyLevelVisual(visual) {
  const root = document.documentElement;
  root.style.setProperty("--accent", visual.accent);
  root.style.setProperty("--accent-2", visual.accent2);
  root.style.setProperty("--accent-3", visual.accent3);
  root.style.setProperty("--level-bg-top", visual.bgTop);
  root.style.setProperty("--level-bg-mid", visual.bgMid);
  root.style.setProperty("--level-bg-bottom", visual.bgBottom);
}

function expandPath(waypoints) {
  const cells = [];
  waypoints.forEach((point, index) => {
    if (index === 0) {
      cells.push({ ...point });
      return;
    }
    const prev = waypoints[index - 1];
    const dx = Math.sign(point.x - prev.x);
    const dy = Math.sign(point.y - prev.y);
    let x = prev.x;
    let y = prev.y;
    while (x !== point.x || y !== point.y) {
      x += dx;
      y += dy;
      const last = cells[cells.length - 1];
      if (!last || last.x !== x || last.y !== y) {
        cells.push({ x, y });
      }
    }
  });
  return cells;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function generateRandomPath(level) {
  const { start, end, minTurns = 3, maxTurns = 6, minExtra = 6, maxExtra = 20 } = level.path;
  const baseDist = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  const minLength = baseDist + minExtra;
  const maxLength = baseDist + maxExtra;
  const attempts = 80;

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const path = [{ ...start }];
    const visited = new Set([`${start.x},${start.y}`]);

    const dfs = (current, prevDir, turns) => {
      if (current.x === end.x && current.y === end.y) {
        return path.length >= minLength && path.length <= maxLength && turns >= minTurns;
      }
      if (path.length >= maxLength) return false;

      const options = directions
        .map((dir) => ({ x: current.x + dir.x, y: current.y + dir.y, dir }))
        .filter((next) => {
          if (next.x < 0 || next.y < 0 || next.x >= GRID_W || next.y >= GRID_H) return false;
          return !visited.has(`${next.x},${next.y}`);
        })
        .sort((a, b) => manhattan(a, end) - manhattan(b, end) + (Math.random() - 0.5));

      for (const next of options) {
        const newTurns = prevDir && (prevDir.x !== next.dir.x || prevDir.y !== next.dir.y) ? turns + 1 : turns;
        if (newTurns > maxTurns) continue;
        const projectedMin = path.length + manhattan(next, end);
        if (projectedMin > maxLength) continue;
        if (next.x === end.x && next.y === end.y && path.length + 1 < minLength) continue;

        path.push({ x: next.x, y: next.y });
        visited.add(`${next.x},${next.y}`);
        if (dfs(next, next.dir, newTurns)) return true;
        path.pop();
        visited.delete(`${next.x},${next.y}`);
      }
      return false;
    };

    if (dfs(start, null, 0)) {
      return { waypoints: [], cells: path };
    }
  }

  const fallback = [{ ...start }];
  if (start.x !== end.x && start.y !== end.y) {
    fallback.push({ x: end.x, y: start.y });
  }
  fallback.push({ ...end });
  return { waypoints: [], cells: expandPath(fallback) };
}

function cellToWorld(cell) {
  return {
    x: cell.x * TILE_SIZE + TILE_SIZE / 2,
    y: cell.y * TILE_SIZE + TILE_SIZE / 2,
  };
}

function buildLevel(index) {
  const level = LEVELS[index];
  currentStyle = level.style || STYLE_ORDER[index % STYLE_ORDER.length];
  game.levelDifficulty = level.difficulty || getLevelDifficulty(index);
  game.levelVisual = LEVEL_VISUALS[index % LEVEL_VISUALS.length];
  applyLevelVisual(game.levelVisual);
  game.map = Array.from({ length: GRID_H }, () => Array(GRID_W).fill("grass"));
  const path = generateRandomPath(level);
  game.pathCells = path.cells;
  game.pathPoints = game.pathCells.map(cellToWorld);
  game.pathCells.forEach((cell) => {
    if (cell.x >= 0 && cell.x < GRID_W && cell.y >= 0 && cell.y < GRID_H) {
      game.map[cell.y][cell.x] = "path";
    }
  });
  game.enemies = [];
  game.projectiles = [];
  game.effects = [];
  game.towers = [];
  game.waveIndex = 0;
  game.waveActive = false;
  game.spawnQueue = [];
  game.waveTimer = 0;
  game.selectedTower = null;
  game.gameOver = false;
  game.gameWon = false;
  game.confetti = [];
  ui.win.classList.add("hidden");
  ui.gameOver.classList.add("hidden");
  updateSelection();
  updateUI();
  ui.nextLevel.classList.add("hidden");
  const bonusHealth = Math.round((game.levelDifficulty.health - 1) * 100);
  const bonusSpeed = Math.round((game.levelDifficulty.speed - 1) * 100);
  ui.status.textContent = `Level ${index + 1}: ${level.name} | Enemy +${bonusHealth}% hp, +${bonusSpeed}% speed`;
}

function buildSpawnQueue(waveDef) {
  const queue = [];
  let time = 0;
  waveDef.forEach((group) => {
    time += group.delay || 0;
    for (let i = 0; i < group.count; i += 1) {
      queue.push({ time, type: group.type });
      time += group.gap;
    }
  });
  return queue;
}

function startWave() {
  if (game.waveActive || game.gameOver) return;
  const level = LEVELS[game.levelIndex];
  const waveDef = level.waves[game.waveIndex];
  if (!waveDef) return;
  game.waveActive = true;
  game.waveTimer = 0;
  game.spawnQueue = buildSpawnQueue(waveDef);
  ui.status.textContent = `Wave ${game.waveIndex + 1} inbound.`;
}

function spawnEnemy(typeKey) {
  const type = ENEMY_TYPES[typeKey];
  const start = game.pathPoints[0];
  const health = Math.round(type.health * game.levelDifficulty.health);
  const reward = Math.max(type.reward, Math.round(type.reward * game.levelDifficulty.reward));
  game.enemies.push({
    id: nextEnemyId += 1,
    type: typeKey,
    x: start.x,
    y: start.y,
    speed: type.speed * game.levelDifficulty.speed,
    maxHealth: health,
    health,
    reward,
    pathIndex: 0,
  });
}

function updateEnemies(dt) {
  const speedScale = game.speed;
  const exitIndex = game.pathPoints.length - 1;
  let escaped = false;
  for (const enemy of game.enemies) {
    const target = game.pathPoints[Math.min(enemy.pathIndex + 1, exitIndex)];
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    const travel = enemy.speed * speedScale * dt;
    if (dist <= travel) {
      enemy.x = target.x;
      enemy.y = target.y;
      enemy.pathIndex += 1;
      if (enemy.pathIndex >= exitIndex) {
        enemy.reachedExit = true;
        escaped = true;
      }
    } else {
      enemy.x += (dx / dist) * travel;
      enemy.y += (dy / dist) * travel;
    }
  }

  const survivors = [];
  for (const enemy of game.enemies) {
    if (enemy.reachedExit) {
      game.lives = Math.max(0, game.lives - 1);
      if (game.lives === 0) {
        game.gameOver = true;
        ui.status.textContent = "The gates have fallen. Reset to try again.";
        showToast("Game Over");
        ui.gameOver.classList.remove("hidden");
      }
    } else if (enemy.health > 0) {
      survivors.push(enemy);
    } else {
      game.money += enemy.reward;
    }
  }
  game.enemies = survivors;
  if (escaped) {
    triggerShake();
  }
}

function findTarget(tower) {
  let closest = null;
  let bestDist = Infinity;
  for (const enemy of game.enemies) {
    const dx = enemy.x - tower.x;
    const dy = enemy.y - tower.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= tower.range && dist < bestDist) {
      bestDist = dist;
      closest = enemy;
    }
  }
  return closest;
}

function fireProjectiles(tower, target) {
  const angle = Math.atan2(target.y - tower.y, target.x - tower.x);
  const shots = tower.burst || 1;
  const spread = shots > 1 ? 0.14 : 0;
  for (let i = 0; i < shots; i += 1) {
    const offset = (i - (shots - 1) / 2) * spread;
    const finalAngle = angle + offset;
    game.projectiles.push({
      x: tower.x,
      y: tower.y,
      vx: Math.cos(finalAngle) * tower.projectileSpeed,
      vy: Math.sin(finalAngle) * tower.projectileSpeed,
      damage: tower.damage,
      life: 1.6,
    });
  }
}

function updateTowers(dt) {
  for (const tower of game.towers) {
    tower.cooldown = Math.max(0, tower.cooldown - dt * game.speed);
    if (tower.trap) {
      if (tower.cooldown > 0) continue;
      const triggered = game.enemies.some((enemy) => {
        const dist = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
        return dist < TILE_SIZE * 0.35;
      });
      if (triggered) {
        if (tower.aoe > 0) {
          for (const enemy of game.enemies) {
            if (Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= tower.aoe) {
              enemy.health -= tower.damage;
            }
          }
          game.effects.push({ x: tower.x, y: tower.y, radius: tower.aoe, life: 0.35 });
        } else {
          for (const enemy of game.enemies) {
            if (Math.hypot(enemy.x - tower.x, enemy.y - tower.y) < TILE_SIZE * 0.35) {
              enemy.health -= tower.damage;
              break;
            }
          }
        }
        tower.cooldown = tower.fireRate;
      }
      continue;
    }

    if (tower.cooldown > 0) continue;
    const target = findTarget(tower);
    if (!target) continue;
    tower.aim = Math.atan2(target.y - tower.y, target.x - tower.x);
    fireProjectiles(tower, target);
    tower.cooldown = tower.fireRate;
  }
}

function updateProjectiles(dt) {
  const keep = [];
  for (const proj of game.projectiles) {
    proj.x += proj.vx * dt * game.speed;
    proj.y += proj.vy * dt * game.speed;
    proj.life -= dt * game.speed;
    let hit = false;
    for (const enemy of game.enemies) {
      if (Math.hypot(enemy.x - proj.x, enemy.y - proj.y) < 16) {
        enemy.health -= proj.damage;
        hit = true;
        break;
      }
    }
    if (!hit && proj.life > 0) {
      keep.push(proj);
    }
  }
  game.projectiles = keep;
}

function updateEffects(dt) {
  const next = [];
  for (const fx of game.effects) {
    fx.life -= dt * game.speed;
    if (fx.life > 0) next.push(fx);
  }
  game.effects = next;
}

function triggerWin() {
  if (game.gameWon) return;
  game.gameWon = true;
  ui.status.textContent = "Victory! All levels cleared.";
  ui.nextLevel.classList.add("hidden");
  ui.win.classList.remove("hidden");
  spawnConfetti(220);
}

function spawnConfetti(count) {
  const colors = ["#f06b4f", "#2db6a3", "#f3b64d", "#ffffff", "#ffd2a8"];
  for (let i = 0; i < count; i += 1) {
    game.confetti.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 40,
      vy: 80 + Math.random() * 180,
      size: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 3 + Math.random() * 2,
    });
  }
}

function updateConfetti(dt) {
  if (!game.confetti.length) return;
  const next = [];
  for (const piece of game.confetti) {
    piece.life -= dt;
    piece.x += piece.vx * dt;
    piece.y += piece.vy * dt;
    piece.vy += 40 * dt;
    piece.rot += piece.spin * dt;
    if (piece.life > 0 && piece.y < canvas.height + 40) {
      next.push(piece);
    }
  }
  game.confetti = next;
}

function drawConfetti() {
  for (const piece of game.confetti) {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rot);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.6);
    ctx.restore();
  }
}

function updateWave(dt) {
  if (!game.waveActive) return;
  game.waveTimer += dt * game.speed;
  while (game.spawnQueue.length && game.waveTimer >= game.spawnQueue[0].time) {
    const spawn = game.spawnQueue.shift();
    spawnEnemy(spawn.type);
  }

  if (game.spawnQueue.length === 0 && game.enemies.length === 0) {
    game.waveActive = false;
    game.waveIndex += 1;
    const level = LEVELS[game.levelIndex];
    if (game.waveIndex >= level.waves.length) {
      if (game.levelIndex === LEVELS.length - 1) {
        triggerWin();
      } else {
        ui.status.textContent = "Sector cleared. Ready to advance.";
        ui.nextLevel.classList.remove("hidden");
      }
    } else {
      ui.status.textContent = `Wave ${game.waveIndex + 1} ready.`;
    }
  }
}

function updateUI() {
  ui.levelName.textContent = `${game.levelIndex + 1}. ${LEVELS[game.levelIndex].name}`;
  const totalWaves = LEVELS[game.levelIndex].waves.length;
  ui.waveLabel.textContent = `${Math.min(game.waveIndex + 1, totalWaves)} / ${totalWaves}`;
  ui.lives.textContent = game.lives;
  ui.money.textContent = game.money;
  ui.startWave.disabled = game.waveActive || game.gameOver || game.gameWon;
  if (game.selectedTower) {
    updateSelection();
  }
}

function updateSelection() {
  if (!game.selectedTower) {
    ui.selection.textContent = "None";
    ui.upgrade.disabled = true;
    ui.sell.disabled = true;
    return;
  }
  const tower = game.selectedTower;
  const nextCost = upgradeCost(tower);
  ui.selection.textContent = `${tower.name} (Lv ${tower.level})\nDamage: ${tower.damage}\nRange: ${tower.range || "Trap"}\nBurst: ${tower.burst || "-"}\nUpgrade: ${tower.level >= 3 ? "Maxed" : `$${nextCost}`}`;
  ui.upgrade.disabled = tower.level >= 3 || game.money < nextCost;
  ui.sell.disabled = false;
}

function upgradeCost(tower) {
  return Math.round(tower.baseCost * (0.7 + 0.6 * tower.level));
}

function upgradeTower() {
  const tower = game.selectedTower;
  if (!tower || tower.level >= 3) return;
  const cost = upgradeCost(tower);
  if (game.money < cost) {
    showToast("Not enough credits.");
    return;
  }
  game.money -= cost;
  tower.totalCost += cost;
  tower.level += 1;
  tower.damage = Math.round(tower.damage * 1.3);
  tower.fireRate = Math.max(0.2, tower.fireRate * 0.86);
  if (!tower.trap) {
    tower.range += 18;
    tower.burst = Math.min(3, tower.burst + 1);
  } else if (tower.aoe > 0) {
    tower.aoe += 12;
  }
  updateSelection();
  showToast(`${tower.name} upgraded.`);
}

function sellTower() {
  const tower = game.selectedTower;
  if (!tower) return;
  const refund = Math.round(tower.totalCost * 0.6);
  game.money += refund;
  game.towers = game.towers.filter((item) => item !== tower);
  game.selectedTower = null;
  updateSelection();
  showToast(`Tower sold for ${refund}.`);
}

function drawMap() {
  for (let y = 0; y < GRID_H; y += 1) {
    for (let x = 0; x < GRID_W; x += 1) {
      const tile = game.map[y][x];
      const img = getSprite(tile);
      if (img) {
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  if (game.levelVisual.mapTint) {
    ctx.save();
    ctx.fillStyle = game.levelVisual.mapTint;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function drawEntryExit() {
  if (!game.pathPoints.length) return;
  const start = game.pathPoints[0];
  const end = game.pathPoints[game.pathPoints.length - 1];
  const radius = TILE_SIZE * 0.22;

  ctx.save();
  ctx.fillStyle = "rgba(45, 182, 163, 0.9)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(240, 107, 79, 0.9)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.arc(end.x, end.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTowers() {
  for (const tower of game.towers) {
    const img = getSprite(tower.sprite);
    if (!img) continue;
    ctx.save();
    ctx.filter = game.levelVisual.towerFilter || "none";
    ctx.translate(tower.x, tower.y);
    if (!tower.trap && tower.aim) {
      ctx.rotate(tower.aim + Math.PI / 2);
    }
    ctx.drawImage(img, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
    ctx.restore();
  }

  if (game.selectedTower && !game.selectedTower.trap) {
    ctx.save();
    ctx.strokeStyle = "rgba(45, 182, 163, 0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(game.selectedTower.x, game.selectedTower.y, game.selectedTower.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawEnemies() {
  for (const enemy of game.enemies) {
    const sprite = getSprite(ENEMY_TYPES[enemy.type].sprite);
    ctx.save();
    ctx.filter = game.levelVisual.enemyFilter || "none";
    ctx.drawImage(sprite, enemy.x - TILE_SIZE / 2, enemy.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
    ctx.restore();
    const barWidth = 40;
    const barHeight = 6;
    const percent = Math.max(0, enemy.health / enemy.maxHealth);
    ctx.fillStyle = "rgba(15, 28, 46, 0.6)";
    ctx.fillRect(enemy.x - barWidth / 2, enemy.y - TILE_SIZE / 2 - 10, barWidth, barHeight);
    ctx.fillStyle = game.levelVisual.enemyBar || "#f06b4f";
    ctx.fillRect(enemy.x - barWidth / 2, enemy.y - TILE_SIZE / 2 - 10, barWidth * percent, barHeight);
  }
}

function drawProjectiles() {
  ctx.fillStyle = "#f3b64d";
  for (const proj of game.projectiles) {
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEffects() {
  for (const fx of game.effects) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, fx.life / 0.35);
    ctx.strokeStyle = "rgba(240, 107, 79, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, fx.radius * (1 - fx.life / 0.35), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHover() {
  if (!game.hoverCell || !game.buildSelection) return;
  const { x, y } = game.hoverCell;
  if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return;
  const buildType = TOWER_TYPES[game.buildSelection];
  const onPath = game.map[y][x] === "path";
  const occupied = game.towers.some((t) => t.gridX === x && t.gridY === y);
  const blocked = occupied || (buildType.trap ? !onPath : onPath);
  ctx.save();
  ctx.strokeStyle = blocked ? "rgba(240, 107, 79, 0.9)" : "rgba(45, 182, 163, 0.9)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x * TILE_SIZE + 4, y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  ctx.restore();
  const type = TOWER_TYPES[game.buildSelection];
  if (type && !type.trap) {
    ctx.save();
    ctx.strokeStyle = "rgba(45, 182, 163, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, type.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawGridOverlay() {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 1; x < GRID_W; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * TILE_SIZE, 0);
    ctx.lineTo(x * TILE_SIZE, canvas.height);
    ctx.stroke();
  }
  for (let y = 1; y < GRID_H; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE_SIZE);
    ctx.lineTo(canvas.width, y * TILE_SIZE);
    ctx.stroke();
  }
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawEntryExit();
  drawGridOverlay();
  drawEffects();
  drawTowers();
  drawEnemies();
  drawProjectiles();
  drawConfetti();
  drawHover();
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min(0.033, (timestamp - lastTime) / 1000);
  lastTime = timestamp;
  if (!game.gameOver) {
    updateWave(dt);
    updateEnemies(dt);
    updateTowers(dt);
    updateProjectiles(dt);
    updateEffects(dt);
    updateConfetti(dt);
  }
  updateUI();
  render();
  requestAnimationFrame(loop);
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  setTimeout(() => {
    ui.toast.classList.add("hidden");
  }, 1500);
}

function triggerShake() {
  if (!ui.wrap) return;
  ui.wrap.classList.remove("shake");
  // Force reflow so the animation can restart
  void ui.wrap.offsetWidth;
  ui.wrap.classList.add("shake");
}

function getCellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE),
  };
}

function handleCanvasClick(event) {
  if (game.gameOver) return;
  const cell = getCellFromEvent(event);
  if (cell.x < 0 || cell.y < 0 || cell.x >= GRID_W || cell.y >= GRID_H) return;

  const towerOnCell = game.towers.find((tower) => tower.gridX === cell.x && tower.gridY === cell.y);
  if (towerOnCell) {
    game.selectedTower = towerOnCell;
    updateSelection();
    return;
  }

  if (!game.buildSelection) {
    game.selectedTower = null;
    updateSelection();
    return;
  }

  const type = TOWER_TYPES[game.buildSelection];
  const onPath = game.map[cell.y][cell.x] === "path";
  if (type.trap && !onPath) {
    showToast("Place traps on the path.");
    return;
  }
  if (!type.trap && onPath) {
    showToast("Cannot build on the path.");
    return;
  }
  if (game.money < type.cost) {
    showToast("Not enough credits.");
    return;
  }

  const world = cellToWorld(cell);
  const tower = {
    id: Date.now() + Math.random(),
    name: type.name,
    gridX: cell.x,
    gridY: cell.y,
    x: world.x,
    y: world.y,
    range: type.range,
    fireRate: type.fireRate,
    damage: type.damage,
    projectileSpeed: type.projectileSpeed,
    burst: type.burst,
    sprite: type.sprite,
    trap: type.trap || false,
    aoe: type.aoe || 0,
    level: 1,
    cooldown: 0,
    aim: 0,
    baseCost: type.cost,
    totalCost: type.cost,
  };
  game.money -= type.cost;
  game.towers.push(tower);
  game.selectedTower = tower;
  updateSelection();
}

function handleCanvasMove(event) {
  game.hoverCell = getCellFromEvent(event);
}

function handleCanvasLeave() {
  game.hoverCell = null;
}

function setBuildSelection(type) {
  game.buildSelection = type;
  ui.towerButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tower === type);
  });
}

ui.towerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.tower;
    if (game.buildSelection === type) {
      setBuildSelection(null);
    } else {
      setBuildSelection(type);
    }
  });
});

ui.startWave.addEventListener("click", startWave);
function goToNextLevel() {
  if (game.levelIndex < LEVELS.length - 1) {
    game.levelIndex += 1;
    buildLevel(game.levelIndex);
  } else {
    showToast("All levels cleared!");
  }
}

ui.nextLevel.addEventListener("click", goToNextLevel);
ui.speed.addEventListener("click", () => {
  game.speed = game.speed === 1 ? 1.6 : 1;
  ui.speed.textContent = game.speed === 1 ? "x1" : "x1.6";
});
ui.upgrade.addEventListener("click", upgradeTower);
ui.sell.addEventListener("click", sellTower);

canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("mousemove", handleCanvasMove);
canvas.addEventListener("mouseleave", handleCanvasLeave);

window.addEventListener("keydown", (event) => {
  if (event.key === "f" || event.key === "F") {
    if (!game.gameOver && !game.gameWon) {
      goToNextLevel();
    }
  }
});

loadImages().then(() => {
  buildLevel(0);
  requestAnimationFrame(loop);
});
