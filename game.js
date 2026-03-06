const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dayClockEl = document.getElementById("dayClock");
const phaseLabelEl = document.getElementById("phaseLabel");
const nightTimerEl = document.getElementById("nightTimer");
const creditsValueEl = document.getElementById("creditsValue");
const creditsTextEl = document.getElementById("creditsText");
const ammoHudEl = document.getElementById("ammoHud");
const ammoIconEl = document.getElementById("ammoIcon");
const ammoAttachmentIconEl = document.getElementById("ammoAttachmentIcon");
const ammoTextEl = document.getElementById("ammoText");
const reloadHudEl = document.getElementById("reloadHud");
const baseHpTextEl = document.getElementById("baseHpText");
const baseHpFillEl = document.getElementById("baseHpFill");
const playerHpTextEl = document.getElementById("playerHpText");
const playerHpFillEl = document.getElementById("playerHpFill");
const currentWeaponEl = document.getElementById("currentWeapon");
const nightIconEl = document.getElementById("nightIcon");
const skipNightBtn = document.getElementById("skipNightBtn");
const skipCurrentNightBtn = document.getElementById("skipCurrentNightBtn");
const openShopBtn = document.getElementById("openShopBtn");
const pauseBtn = document.getElementById("pauseBtn");
const ultimateBtn = document.getElementById("ultimateBtn");
const ultimateStatusEl = document.getElementById("ultimateStatus");
const restartBtn = document.getElementById("restartBtn");
const gameOverModalEl = document.getElementById("gameOverModal");
const gameOverKillsEl = document.getElementById("gameOverKills");
const gameOverHighScoreEl = document.getElementById("gameOverHighScore");
const closeShopBtn = document.getElementById("closeShopBtn");
const shopModalEl = document.getElementById("shopModal");
const customTooltipEl = document.getElementById("customTooltip");
const shopWeaponListEl = document.getElementById("shopWeaponList");
const shopAttachmentListEl = document.getElementById("shopAttachmentList");
const shopRepairListEl = document.getElementById("shopRepairList");
const shopBaseUpgradeListEl = document.getElementById("shopBaseUpgradeList");
const shopTurretListEl = document.getElementById("shopTurretList");
const speedButtons = document.querySelectorAll(".speed-btn");
const killsHudEl = document.getElementById("killsHud");
const DEV_ALLOW_NIGHT_SPEED = true;
const ULTI_RELOAD_SPEED_MULTIPLIER = 2;
const PLAYER_ZOMBIE_BITE_DAMAGE_MULTIPLIER = 0.65;
const DAY_NIGHT_TRANSITION_SECONDS = 16;
const PLAYER_FULL_HEAL_COST = 500;
const PLAYER_SPRITE_SHEET_COLS = 8;
const PLAYER_SPRITE_SHEET_ROWS = 8;
const PLAYER_SPRITE_FRAME_COUNT = PLAYER_SPRITE_SHEET_COLS * PLAYER_SPRITE_SHEET_ROWS;
const USE_ISOMETRIC_VIEW = false;
let isometricXAxisDegrees = 24;
let isometricYAxisDegrees = 156;
let isometricVerticalSquash = 0.86;
const ISOMETRIC_VIEW_MARGIN = 28;
const VIEW_ZOOM_MIN = 0.65;
const VIEW_ZOOM_MAX = 2.1;
const VIEW_ZOOM_STEP = 0.0015;
const ISOMETRIC_ANGLE_STEP_DEGREES = 1.5;
const ISOMETRIC_SQUASH_STEP = 0.02;

const playerSpritePathByKey = {
  idle1: "main-character-Outlined/Idle.png",
  idle2: "main-character-Outlined/Idle2.png",
  idle3: "main-character-Outlined/Idle3.png",
  walkDown: "main-character-Outlined/Walk.png",
  runDown: "main-character-Outlined/Run.png",
  runUp: "main-character-Outlined/RunBackwards.png",
  strafeLeft: "main-character-Outlined/StrafeLeft.png",
  strafeRight: "main-character-Outlined/StrafeRight.png",
  attack1: "main-character-Outlined/Attack1.png",
  attack2: "main-character-Outlined/Attack2.png",
  attack3: "main-character-Outlined/Attack3.png",
  attack4: "main-character-Outlined/Attack4.png",
  attackUp: "main-character-Outlined/RunBackwardsAttack.png",
  attackDown: "main-character-Outlined/RunAttack.png",
  attackLeft: "main-character-Outlined/StrafeLeftAttack.png",
  attackRight: "main-character-Outlined/StrafeRightAttack.png",
};

const playerSprites = {};
Object.entries(playerSpritePathByKey).forEach(([key, path]) => {
  const image = new Image();
  image.src = path;
  playerSprites[key] = image;
});

const basicZombieWalkSprite = new Image();
basicZombieWalkSprite.src = "zombie-characters/002_walking.png";
const BASIC_ZOMBIE_SHEET_COLS = 2;
const BASIC_ZOMBIE_FRAME_CYCLE = [0, 1, 2, 3];
const BASIC_ZOMBIE_FRAME_ROWS = 2;
const BASIC_ZOMBIE_MIN_OPAQUE_PIXELS = 18;
const BASIC_ZOMBIE_DRAW_HEIGHT = 36;
const BASIC_ZOMBIE_CENTER_OFFSET_Y = 4;
const BASIC_ZOMBIE_ANCHOR_Y = 0.62;

let basicZombieResolvedFrameCycle = [...BASIC_ZOMBIE_FRAME_CYCLE];
let basicZombieFramesScanned = false;

const levelTwoZombieWalkSprite = new Image();
levelTwoZombieWalkSprite.src = "zombie-characters/006_walking.png";
const LVL2_ZOMBIE_SHEET_COLS = 2;
const LVL2_ZOMBIE_FRAME_CYCLE = [0, 1, 2, 3];
const LVL2_ZOMBIE_FRAME_ROWS = 2;
const LVL2_ZOMBIE_MIN_OPAQUE_PIXELS = 18;
const LVL2_ZOMBIE_DRAW_HEIGHT = 48;
const LVL2_ZOMBIE_CENTER_OFFSET_Y = 2;
const LVL2_ZOMBIE_ANCHOR_Y = 0.62;

let levelTwoZombieResolvedFrameCycle = [...LVL2_ZOMBIE_FRAME_CYCLE];
let levelTwoZombieFramesScanned = false;

const levelThreeZombieWalkSprite = new Image();
levelThreeZombieWalkSprite.src = "zombie-characters/001_walking.png";
const LVL3_ZOMBIE_SHEET_COLS = 2;
const LVL3_ZOMBIE_FRAME_CYCLE = [0, 1, 2, 3];
const LVL3_ZOMBIE_FRAME_ROWS = 2;
const LVL3_ZOMBIE_MIN_OPAQUE_PIXELS = 18;
const LVL3_ZOMBIE_DRAW_HEIGHT = 41;
const LVL3_ZOMBIE_CENTER_OFFSET_Y = 2;
const LVL3_ZOMBIE_ANCHOR_Y = 0.62;

let levelThreeZombieResolvedFrameCycle = [...LVL3_ZOMBIE_FRAME_CYCLE];
let levelThreeZombieFramesScanned = false;

const zombieSplatterSprite = new Image();
zombieSplatterSprite.src = "assets/splatter-svgrepo-com.svg";
const footprintsSprite = new Image();
footprintsSprite.src = "assets/footprints.png";
const grassTileSprite = new Image();
grassTileSprite.decoding = "async";
grassTileSprite.src = "assets/Grass_01.png";
const GRASS_TILE_SCALE = 0.42;
const FOOTPRINT_HOLD_DURATION = 1;
const FOOTPRINT_FADE_DURATION = 2;
const FOOTPRINT_LIFE = FOOTPRINT_HOLD_DURATION + FOOTPRINT_FADE_DURATION;
const FOOTPRINT_STEP_SPACING = 28;
const FOOTPRINT_SIZE = 20;
const FOOTPRINT_LATERAL_OFFSET = 0;
const FOOTPRINT_MAX_ACTIVE = 1400;
const FOOTPRINT_ROTATION_OFFSET = Math.PI / 2;
const FOOTPRINT_ROTATION_JITTER = 0.08;
let grassTileLoaded = false;
grassTileSprite.addEventListener("load", () => {
  grassTileLoaded = true;
});
grassTileSprite.addEventListener("error", () => {
  grassTileLoaded = false;
});
const ZOMBIE_SPLATTER_HOLD_DURATION = 4;
const ZOMBIE_SPLATTER_FADE_DURATION = 4;
const ZOMBIE_SPLATTER_LIFE = ZOMBIE_SPLATTER_HOLD_DURATION + ZOMBIE_SPLATTER_FADE_DURATION;
const HIT_SPLASH_LIFE = 0.18;

const turretPodSprite = new Image();
turretPodSprite.src = "assets/turret pod 1.png";
const turretLevelSprites = [
  "assets/turret level 1.png",
  "assets/turret level 2.png",
  "assets/turret level 3.png",
  "assets/turret level 4.png",
].map((src) => {
  const image = new Image();
  image.src = src;
  return image;
});
const turretMuzzleFlashSprites = [
  "assets/muzzleflash1.png",
  "assets/muzzleflash2.png",
  "assets/muzzleflash3.png",
  "assets/muzzleflash4.png",
  "assets/muzzleflash5.png",
].map((src) => {
  const image = new Image();
  image.src = src;
  return image;
});
const TURRET_POD_DRAW_SIZE = 42;
const TURRET_LEVEL_DRAW_SIZE = 40;
const TURRET_LEVEL1_SIZE_MULTIPLIER = 0.66;
const TURRET_LEVEL4_SIZE_MULTIPLIER = 1.25;
const turretTurnSpeedByLevel = {
  1: 1.5,
  2: 2.1,
  3: 2.9,
  4: 3.8,
};
const PLAYER_TURRET_TURN_SPEED = 6.2;
const TURRET_FIRE_ANGLE_TOLERANCE = 0.18;
const TURRET_RECOIL_KICK = 2.8;
const TURRET_RECOIL_MAX = 5;
const TURRET_RECOIL_RECOVERY = 16;
const TURRET_MUZZLE_FLASH_FRAME_DURATION = 0.03;
const TURRET_MUZZLE_FLASH_SIZE_MULTIPLIER = 1.12;

const turretSlotRotationByLabel = {
  Top: -Math.PI / 2,
  Right: 0,
  Bottom: Math.PI / 2,
  Left: Math.PI,
};


const weaponIconById = {
  glock: "weapon-assets-svg/glock-svgrepo-com.svg",
  magnum50: "weapon-assets-svg/revolver-svgrepo-com.svg",
  mp5: "weapon-assets-svg/smg-svgrepo-com.svg",
  ar15: "weapon-assets-svg/rifle-gun-svgrepo-com.svg",
  m249: "weapon-assets-svg/auto-rifle-svgrepo-com.svg",
};

const attachmentIconByWeaponId = {
  glock: "weapon-assets-svg/extended-magazine-pistol-svgrepo-com.svg",
  magnum50: "weapon-assets-svg/extended-magazine-pistol-svgrepo-com.svg",
  mp5: "weapon-assets-svg/extended-magazine-machine-gun-magazine-svgrepo-com.svg",
  ar15: "weapon-assets-svg/extended-magazine-machine-gun-magazine-svgrepo-com.svg",
  m249: "weapon-assets-svg/extended-magazine-machine-gun-magazine-svgrepo-com.svg",
};

const weapons = [
  {
    id: "glock",
    name: "Glock",
    cost: 0,
    fireRate: 0.46,
    damage: 27,
    bulletSpeed: 500,
    magSize: 14,
    reloadTime: 1.25,
  },
  {
    id: "magnum50",
    name: ".50 Magnum",
    cost: 350,
    fireRate: 0.78,
    damage: 60,
    bulletSpeed: 560,
    magSize: 6,
    reloadTime: 1.95,
  },
  {
    id: "mp5",
    name: "MP5",
    cost: 650,
    fireRate: 0.18,
    damage: 19,
    bulletSpeed: 560,
    magSize: 30,
    reloadTime: 1.9,
  },
  {
    id: "ar15",
    name: "AR15",
    cost: 2500,
    fireRate: 0.11,
    damage: 27,
    bulletSpeed: 610,
    magSize: 30,
    reloadTime: 2.2,
  },
  {
    id: "m249",
    name: "M249",
    cost: 4000,
    fireRate: 0.09,
    damage: 28,
    bulletSpeed: 610,
    magSize: 100,
    reloadTime: 2.2,
  },
];

const attachments = [
  { id: "extmag-glock", weaponId: "glock", name: "Glock Extended Mag", cost: 220 },
  {
    id: "extmag-magnum50",
    weaponId: "magnum50",
    name: ".50 Magnum Extended Mag",
    cost: 300,
  },
  { id: "extmag-mp5", weaponId: "mp5", name: "MP5 Extended Mag", cost: 420 },
  { id: "extmag-ar15", weaponId: "ar15", name: "AR15 Extended Mag", cost: 520 },
];

const repairs = [
  {
    id: "repair250",
    name: "Repair +250 HP",
    hp: 250,
    cost: 250,
  },
  {
    id: "repair500",
    name: "Repair +500 HP",
    hp: 500,
    cost: 500,
  },
  {
    id: "repair1000",
    name: "Repair +1000 HP",
    hp: 1000,
    cost: 1000,
  },
];

const baseUpgradeCosts = [700, 1400];

const turretBuyCost = 550;
const turretUpgradeCosts = [500, 900, 1400];
const turretRangeMultipliersByLevel = {
  1: 0.4,
  2: 0.55,
  3: 0.76,
  4: 1,
};
const turretLevelLoadouts = {
  1: ["smg"],
  2: ["flak"],
  3: ["grenade"],
  4: ["cannon"],
};
const turretTypeLabelByLevel = {
  1: "M249",
  2: "Flak",
  3: "Grenades",
  4: "Cannon",
};

const turretWeaponStats = {
  smg: { cooldown: 0.26, speed: 460, damage: 11, radius: 2.5, life: 1.15, splashRadius: 0 },
  flak: { cooldown: 0.16, speed: 420, damage: 8, radius: 2.2, life: 1.0, splashRadius: 0 },
  grenade: {
    cooldown: 1.1,
    speed: 220,
    damage: 34,
    radius: 4.2,
    life: 1.5,
    splashRadius: 68,
  },
  cannon: {
    cooldown: 0.72,
    speed: 330,
    damage: 62,
    radius: 4,
    life: 1.4,
    splashRadius: 56,
  },
};

const enemyTypes = {
  level1: {
    level: 1,
    radius: 10,
    hp: 46,
    speedMin: 34,
    speedMax: 46,
    damagePerSecond: 9.9,
    reward: 20,
    color: "#6ce36c",
  },
  level2: {
    level: 2,
    radius: 14,
    hp: 72,
    speedMin: 48,
    speedMax: 70,
    damagePerSecond: 14,
    reward: 30,
    color: "#f0c95f",
  },
  level3: {
    level: 3,
    radius: 18,
    hp: 160,
    speedMin: 48,
    speedMax: 62,
    damagePerSecond: 26,
    reward: 60,
    color: "#ff8f72",
  },
};

const weaponById = new Map(weapons.map((weapon) => [weapon.id, weapon]));
const attachmentById = new Map(attachments.map((attachment) => [attachment.id, attachment]));
const attachmentByWeaponId = new Map(
  attachments.map((attachment) => [attachment.weaponId, attachment])
);
const playerBulletPenetrationByWeaponId = {
  ar15: 2,
  m249: 3,
};

function getStoredHighScore() {
  try {
    const raw = localStorage.getItem("baseDefenseHighScore");
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function setStoredHighScore(value) {
  try {
    localStorage.setItem("baseDefenseHighScore", String(value));
  } catch {
    // ignore storage errors in restricted environments
  }
}

const world = {
  width: canvas.width,
  height: canvas.height,
  base: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 116,
    maxHp: 1000,
    hp: 1000,
    upgradeLevel: 0,
  },
  player: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 9,
    speed: 220,
    maxHp: 100,
    hp: 100,
    weaponId: "glock",
    fireRate: 0.46,
    fireCooldown: 0,
    bulletSpeed: 500,
    damage: 27,
    magSize: 14,
    ammoInMag: 14,
    reloadTime: 1.25,
    reloadTimer: 0,
    isReloading: false,
    shotFlashTimer: 0,
    animationTimer: 0,
    lastAimX: 1,
    lastAimY: 0,
  },
  bullets: [],
  turretProjectiles: [],
  grenadeBursts: [],
  zombieSplatters: [],
  footprints: [],
  hitSplashes: [],
  turretMuzzleFlashes: [],
  enemies: [],
  muzzleFlashes: [],
  explosions: [],
  ultimateWaves: [],
  keys: new Set(),
  timeScaleDay: 1,
  dayLength: 90,
  nightLength: 45,
  dayTimer: 0,
  nightTimer: 0,
  dayNumber: 1,
  nightNumber: 0,
  phase: "day",
  spawnedThisNight: 0,
  totalNightEnemies: 0,
  defeatedThisNight: 0,
  totalKills: 0,
  highScore: getStoredHighScore(),
  spawnAccumulator: 0,
  credits: 0,
  ownedWeapons: new Set(["glock"]),
  ownedAttachments: new Set(),
  ultimate: {
    cooldown: 60,
    timer: 60,
    hasStarted: false,
    damage: 120,
    radius: 220,
    fireRateMultiplier: 0.4,
    boostDuration: 8,
    boostTimer: 0,
  },
  turrets: [],
  selectedTurretId: null,
  viewZoom: 1,
  paused: false,
  gameOver: false,
};

function createDefaultTurrets() {
  const offset = world.base.radius + 12;
  const slots = [
    { x: world.base.x, y: world.base.y - offset, label: "Top" },
    { x: world.base.x - offset, y: world.base.y, label: "Left" },
    { x: world.base.x + offset, y: world.base.y, label: "Right" },
    { x: world.base.x, y: world.base.y + offset, label: "Bottom" },
    { x: world.base.x, y: world.base.y, label: "Middle" },
  ];

  return slots.map((slot, index) => ({
    id: index,
    x: slot.x,
    y: slot.y,
    label: slot.label,
    aimAngle: turretSlotRotationByLabel[slot.label] ?? 0,
    recoil: 0,
    owned: false,
    level: 0,
    cooldowns: {
      smg: 0,
      flak: 0,
      grenade: 0,
      cannon: 0,
    },
  }));
}

world.turrets = createDefaultTurrets();

function hasExtendedMag(weaponId) {
  const attachment = attachmentByWeaponId.get(weaponId);
  return !!attachment && world.ownedAttachments.has(attachment.id);
}

function getWeaponMagSize(weaponId) {
  const weapon = weaponById.get(weaponId);
  if (!weapon) {
    return 0;
  }

  const multiplier = hasExtendedMag(weaponId) ? 1.5 : 1;
  return Math.ceil(weapon.magSize * multiplier);
}

function setPaused(paused) {
  world.paused = paused;
  pauseBtn.textContent = "Ⅱ";
  pauseBtn.title = paused ? "Resume" : "Pause";
}

function resetGameState() {
  world.base.maxHp = 1000;
  world.base.hp = world.base.maxHp;
  world.base.upgradeLevel = 0;
  world.player.x = world.base.x;
  world.player.y = world.base.y;
  world.player.weaponId = "glock";
  world.player.maxHp = 100;
  world.player.hp = world.player.maxHp;
  world.player.fireCooldown = 0;
  world.player.shotFlashTimer = 0;
  world.player.animationTimer = 0;
  world.player.lastAimX = 1;
  world.player.lastAimY = 0;

  world.bullets = [];
  world.turretProjectiles = [];
  world.grenadeBursts = [];
  world.zombieSplatters = [];
  world.footprints = [];
  world.hitSplashes = [];
  world.turretMuzzleFlashes = [];
  world.enemies = [];
  world.muzzleFlashes = [];
  world.explosions = [];
  world.ultimateWaves = [];
  world.turrets = createDefaultTurrets();
  world.keys.clear();

  world.timeScaleDay = 1;
  world.dayTimer = 0;
  world.nightTimer = 0;
  world.dayNumber = 1;
  world.nightNumber = 0;
  world.phase = "day";
  world.spawnedThisNight = 0;
  world.totalNightEnemies = 0;
  world.defeatedThisNight = 0;
  world.totalKills = 0;
  world.spawnAccumulator = 0;
  world.credits = 0;
  world.ownedWeapons = new Set(["glock"]);
  world.ownedAttachments = new Set();
  world.ultimate.timer = world.ultimate.cooldown;
  world.ultimate.hasStarted = false;
  world.ultimate.boostTimer = 0;
  world.paused = false;
  world.gameOver = false;

  setPaused(false);
  setPlayerWeapon("glock");
  setShopModalOpen(false);
  setSpeedButtonActive();
  updateShopUi();
  gameOverModalEl.classList.add("hidden");
}

function setPlayerWeapon(weaponId) {
  const weapon = weaponById.get(weaponId);
  if (!weapon) {
    return;
  }

  world.player.weaponId = weapon.id;
  world.player.fireRate = weapon.fireRate;
  world.player.damage = weapon.damage;
  world.player.bulletSpeed = weapon.bulletSpeed;
  world.player.magSize = getWeaponMagSize(weapon.id);
  world.player.ammoInMag = world.player.magSize;
  world.player.reloadTime = weapon.reloadTime;
  world.player.reloadTimer = 0;
  world.player.isReloading = false;
  currentWeaponEl.textContent = `Weapon: ${weapon.name}`;
}

function buyOrEquipWeapon(weaponId) {
  const weapon = weaponById.get(weaponId);
  if (!weapon) {
    return;
  }

  if (world.ownedWeapons.has(weaponId)) {
    setPlayerWeapon(weaponId);
    return;
  }

  if (world.credits < weapon.cost) {
    return;
  }

  world.credits -= weapon.cost;
  world.ownedWeapons.add(weapon.id);
  setPlayerWeapon(weapon.id);
}

function buyExtendedMag(attachmentId) {
  const attachment = attachmentById.get(attachmentId);
  if (!attachment) {
    return;
  }

  const { weaponId } = attachment;

  if (!world.ownedWeapons.has(weaponId)) {
    return;
  }

  if (world.ownedAttachments.has(attachment.id) || world.credits < attachment.cost) {
    return;
  }

  world.credits -= attachment.cost;
  world.ownedAttachments.add(attachment.id);

  if (world.player.weaponId === weaponId) {
    world.player.magSize = getWeaponMagSize(weaponId);
    world.player.ammoInMag = world.player.magSize;
    world.player.reloadTimer = 0;
    world.player.isReloading = false;
  }
}

function buyRepair(repairId) {
  const repair = repairs.find((item) => item.id === repairId);
  if (!repair) {
    return;
  }

  if (world.credits < repair.cost || world.base.hp >= world.base.maxHp) {
    return;
  }

  world.credits -= repair.cost;
  world.base.hp = Math.min(world.base.maxHp, world.base.hp + repair.hp);
}

function buyBaseUpgrade(level) {
  if (level < 1 || level > baseUpgradeCosts.length) {
    return;
  }

  if (world.base.upgradeLevel !== level - 1) {
    return;
  }

  const cost = baseUpgradeCosts[level - 1];
  if (world.credits < cost) {
    return;
  }

  world.credits -= cost;
  const missingHp = Math.max(0, world.base.maxHp - world.base.hp);
  world.base.upgradeLevel = level;
  world.base.maxHp *= 2;
  world.base.hp = Math.max(0, world.base.maxHp - missingHp);
}

function buyPlayerFullHeal() {
  if (world.credits < PLAYER_FULL_HEAL_COST || world.player.hp >= world.player.maxHp) {
    return;
  }

  world.credits -= PLAYER_FULL_HEAL_COST;
  world.player.hp = world.player.maxHp;
}

function buyOrUpgradeTurret(turretId) {
  const turret = world.turrets.find((item) => item.id === turretId);
  if (!turret) {
    return;
  }

  if (!turret.owned) {
    if (world.credits < turretBuyCost) {
      return;
    }
    world.credits -= turretBuyCost;
    turret.owned = true;
    turret.level = 1;
    return;
  }

  if (turret.level >= 4) {
    return;
  }

  const cost = turretUpgradeCosts[turret.level - 1];
  if (world.credits < cost) {
    return;
  }

  world.credits -= cost;
  turret.level += 1;
}

function setShopModalOpen(open) {
  const canOpen = world.phase === "day" && !world.gameOver;
  const shouldOpen = open && canOpen;
  shopModalEl.classList.toggle("hidden", !shouldOpen);
  if (!shouldOpen) {
    hideTooltip();
  }
}

function hideTooltip() {
  customTooltipEl.classList.add("hidden");
  customTooltipEl.setAttribute("aria-hidden", "true");
}

function showTooltip(content, mouseX, mouseY) {
  if (!content || shopModalEl.classList.contains("hidden")) {
    hideTooltip();
    return;
  }

  customTooltipEl.innerHTML = content.split("\n").join("<br>");
  customTooltipEl.classList.remove("hidden");
  customTooltipEl.setAttribute("aria-hidden", "false");

  const margin = 12;
  const rect = customTooltipEl.getBoundingClientRect();
  let left = mouseX + 14;
  let top = mouseY + 14;

  if (left + rect.width + margin > window.innerWidth) {
    left = window.innerWidth - rect.width - margin;
  }
  if (top + rect.height + margin > window.innerHeight) {
    top = mouseY - rect.height - 14;
  }

  customTooltipEl.style.left = `${Math.max(margin, left)}px`;
  customTooltipEl.style.top = `${Math.max(margin, top)}px`;
}

function attachShopTooltip(button) {
  button.addEventListener("mouseenter", (event) => {
    showTooltip(button.dataset.tooltip || "", event.clientX, event.clientY);
  });

  button.addEventListener("mousemove", (event) => {
    showTooltip(button.dataset.tooltip || "", event.clientX, event.clientY);
  });

  button.addEventListener("mouseleave", () => {
    hideTooltip();
  });
}

function setShopButtonContent(button, label, iconPath, emojiFallback = "") {
  const iconMarkup = iconPath
    ? `<img class="shop-icon" src="${iconPath}" alt="" aria-hidden="true" />`
    : `<span class="shop-icon-emoji" aria-hidden="true">${emojiFallback}</span>`;

  button.innerHTML = `<span class="shop-btn-content">${iconMarkup}<span class="shop-btn-text">${label}</span></span>`;
}

function updateShopUi() {
  const buttons = shopWeaponListEl.querySelectorAll(".shop-btn");
  buttons.forEach((button) => {
    const weaponId = button.dataset.weapon;
    const weapon = weaponById.get(weaponId);
    if (!weapon) {
      return;
    }

    const isOwned = world.ownedWeapons.has(weaponId);
    const isEquipped = world.player.weaponId === weaponId;
    const canBuy = world.credits >= weapon.cost;

    button.classList.toggle("active", isEquipped);
    button.classList.toggle("locked", !isOwned && !canBuy);
    button.disabled = !isOwned && !canBuy;

    if (isEquipped) {
      setShopButtonContent(
        button,
        `${weapon.name} · Equipped`,
        weaponIconById[weapon.id],
        "🔫"
      );
    } else if (isOwned) {
      setShopButtonContent(button, `${weapon.name} · Equip`, weaponIconById[weapon.id], "🔫");
    } else if (!canBuy) {
      const missingCredits = weapon.cost - world.credits;
      setShopButtonContent(
        button,
        `${weapon.name} · Need ${missingCredits}`,
        weaponIconById[weapon.id],
        "🔫"
      );
    } else {
      setShopButtonContent(
        button,
        `${weapon.name} · Buy ${weapon.cost}`,
        weaponIconById[weapon.id],
        "🔫"
      );
    }

    button.dataset.tooltip = `${weapon.name}\nDamage: ${weapon.damage}\nFire Rate: ${weapon.fireRate.toFixed(
      2
    )}s/shot\nAmmo: ${getWeaponMagSize(weapon.id)}\nReload: ${weapon.reloadTime.toFixed(2)}s`;
  });

  const repairButtons = shopRepairListEl.querySelectorAll(".shop-btn");
  repairButtons.forEach((button) => {
    if (button.dataset.playerHeal === "true") {
      const canHealPlayer = world.player.hp < world.player.maxHp;
      const canBuy = world.credits >= PLAYER_FULL_HEAL_COST && canHealPlayer;

      button.disabled = !canBuy;
      if (!canHealPlayer) {
        setShopButtonContent(button, "Medkit · Player Full HP", "", "❤️");
      } else if (world.credits < PLAYER_FULL_HEAL_COST) {
        setShopButtonContent(
          button,
          `Medkit · Need ${PLAYER_FULL_HEAL_COST - world.credits}`,
          "",
          "❤️"
        );
      } else {
        setShopButtonContent(button, `Medkit · Buy ${PLAYER_FULL_HEAL_COST}`, "", "❤️");
      }

      button.dataset.tooltip = "Fully restores player HP";
      return;
    }

    const repairId = button.dataset.repair;
    const repair = repairs.find((item) => item.id === repairId);
    if (!repair) {
      return;
    }

    const canBuy = world.credits >= repair.cost && world.base.hp < world.base.maxHp;

    button.disabled = !canBuy;
    if (world.credits < repair.cost) {
      setShopButtonContent(
        button,
        `${repair.name} · Need ${repair.cost - world.credits}`,
        "",
        "🛠️"
      );
    } else {
      setShopButtonContent(button, `${repair.name} · Buy ${repair.cost}`, "", "🛠️");
    }
    button.dataset.tooltip = `${repair.name}\nRestores ${repair.hp} HP`;
  });

  const baseUpgradeButtons = shopBaseUpgradeListEl.querySelectorAll(".shop-btn");
  baseUpgradeButtons.forEach((button) => {
    const level = Number(button.dataset.baseUpgradeLevel);
    const levelIndex = level - 1;
    const cost = baseUpgradeCosts[levelIndex];
    const isOwned = world.base.upgradeLevel >= level;
    const isNext = world.base.upgradeLevel === level - 1;
    const canBuy = isNext && world.credits >= cost;

    button.classList.toggle("active", isOwned);
    button.classList.toggle("locked", !isOwned && !isNext);
    button.disabled = isOwned || !canBuy;

    if (isOwned) {
      setShopButtonContent(button, `Reinforce Wall Lv${level} · Owned`, "", "🧱");
    } else if (!isNext) {
      setShopButtonContent(button, `Reinforce Wall Lv${level} · Locked`, "", "🧱");
    } else if (!canBuy) {
      setShopButtonContent(
        button,
        `Reinforce Wall Lv${level} · Need ${cost - world.credits}`,
        "",
        "🧱"
      );
    } else {
      setShopButtonContent(button, `Reinforce Wall Lv${level} · Buy ${cost}`, "", "🧱");
    }

    const afterHp = 1000 * 2 ** level;
    button.dataset.tooltip = `Base Reinforcement Lv${level}\nDoubles base max HP\nMax HP after buy: ${afterHp}`;
  });

  const turretButtons = shopTurretListEl.querySelectorAll(".shop-btn");
  turretButtons.forEach((button) => {
    const turretId = Number(button.dataset.turretId);
    const turret = world.turrets.find((item) => item.id === turretId);
    if (!turret) {
      return;
    }

    if (!turret.owned) {
      const canBuy = world.credits >= turretBuyCost;
      button.disabled = !canBuy;
      button.classList.remove("active");
      button.classList.toggle("locked", !canBuy);
      if (canBuy) {
        setShopButtonContent(button, `${turret.label} Turret · Buy ${turretBuyCost}`, "", "🔩");
      } else {
        setShopButtonContent(
          button,
          `${turret.label} Turret · Need ${turretBuyCost - world.credits}`,
          "",
          "🔩"
        );
      }
      button.dataset.tooltip = `Buy ${turret.label.toLowerCase()} turret (Level 1: M249)`;
      return;
    }

    const atMaxLevel = turret.level >= 4;
    const upgradeCost = atMaxLevel ? 0 : turretUpgradeCosts[turret.level - 1];
    const canUpgrade = !atMaxLevel && world.credits >= upgradeCost;
    button.classList.toggle("active", atMaxLevel);
    button.classList.toggle("locked", !atMaxLevel && !canUpgrade);
    button.disabled = atMaxLevel || !canUpgrade;

    if (atMaxLevel) {
      setShopButtonContent(button, `${turret.label} Turret · Lv4 Max`, "", "🔩");
    } else if (canUpgrade) {
      setShopButtonContent(
        button,
        `${turret.label} Turret · Upgrade Lv${turret.level + 1} (${upgradeCost})`,
        "",
        "🔩"
      );
    } else {
      setShopButtonContent(
        button,
        `${turret.label} Turret · Need ${upgradeCost - world.credits}`,
        "",
        "🔩"
      );
    }

    const loadoutLabelsByLevel = {
      1: "M249",
      2: "Flak",
      3: "Grenades",
      4: "Cannon",
    };
    const rangePct = Math.round((turretRangeMultipliersByLevel[turret.level] || 0) * 100);
    button.dataset.tooltip = `${turret.label} Turret\nCurrent Lv${turret.level}: ${loadoutLabelsByLevel[turret.level]}\nRange: ${rangePct}%`;
  });

  const attachmentButtons = shopAttachmentListEl.querySelectorAll(".shop-btn");
  attachmentButtons.forEach((button) => {
    const attachmentId = button.dataset.attachmentId;
    const attachment = attachmentById.get(attachmentId);
    const weaponId = attachment?.weaponId;
    const weapon = weaponById.get(weaponId);
    if (!attachment || !weapon) {
      return;
    }

    const hasWeapon = world.ownedWeapons.has(weaponId);
    const ownedAttachment = world.ownedAttachments.has(attachment.id);
    const canBuy = hasWeapon && !ownedAttachment && world.credits >= attachment.cost;
    const creditsMissing = Math.max(0, attachment.cost - world.credits);

    button.disabled = !ownedAttachment && !canBuy;
    button.classList.toggle("active", ownedAttachment);
    button.classList.toggle("locked", !hasWeapon);

    if (!hasWeapon) {
      setShopButtonContent(
        button,
        `${attachment.name} · Need ${weapon.name}`,
        attachmentIconByWeaponId[weaponId],
        "📦"
      );
    } else if (ownedAttachment) {
      setShopButtonContent(
        button,
        `${attachment.name} · Owned`,
        attachmentIconByWeaponId[weaponId],
        "📦"
      );
    } else if (!canBuy) {
      setShopButtonContent(
        button,
        `${attachment.name} · Need ${creditsMissing} credits`,
        attachmentIconByWeaponId[weaponId],
        "📦"
      );
    } else {
      setShopButtonContent(
        button,
        `${attachment.name} · Buy ${attachment.cost}`,
        attachmentIconByWeaponId[weaponId],
        "📦"
      );
    }

    const baseMag = weapon.magSize;
    const extraAmmo = Math.ceil(baseMag * 1.5) - baseMag;
    button.dataset.tooltip = `${attachment.name}\nAmmo Increase: +${extraAmmo}\n(${baseMag} → ${baseMag + extraAmmo})`;
  });

  openShopBtn.disabled = world.phase !== "day" || world.gameOver;
}

function initShopUi() {
  shopWeaponListEl.innerHTML = "";
  shopAttachmentListEl.innerHTML = "";
  shopRepairListEl.innerHTML = "";
  shopBaseUpgradeListEl.innerHTML = "";
  shopTurretListEl.innerHTML = "";

  weapons.forEach((weapon) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.weapon = weapon.id;
    button.type = "button";
    button.addEventListener("click", () => {
      buyOrEquipWeapon(weapon.id);
      updateShopUi();
    });
    attachShopTooltip(button);
    shopWeaponListEl.appendChild(button);
  });

  repairs.forEach((repair) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.repair = repair.id;
    button.type = "button";
    button.addEventListener("click", () => {
      buyRepair(repair.id);
      updateShopUi();
    });
    attachShopTooltip(button);
    shopRepairListEl.appendChild(button);
  });

  const playerHealButton = document.createElement("button");
  playerHealButton.className = "shop-btn";
  playerHealButton.dataset.playerHeal = "true";
  playerHealButton.type = "button";
  playerHealButton.addEventListener("click", () => {
    buyPlayerFullHeal();
    updateShopUi();
  });
  attachShopTooltip(playerHealButton);
  shopRepairListEl.appendChild(playerHealButton);

  baseUpgradeCosts.forEach((_, levelIndex) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.baseUpgradeLevel = String(levelIndex + 1);
    button.type = "button";
    button.addEventListener("click", () => {
      buyBaseUpgrade(levelIndex + 1);
      updateShopUi();
    });
    attachShopTooltip(button);
    shopBaseUpgradeListEl.appendChild(button);
  });

  for (let turretId = 0; turretId < world.turrets.length; turretId += 1) {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.turretId = String(turretId);
    button.type = "button";
    button.addEventListener("click", () => {
      buyOrUpgradeTurret(turretId);
      updateShopUi();
    });
    attachShopTooltip(button);
    shopTurretListEl.appendChild(button);
  }

  attachments.forEach((attachment) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.attachmentId = attachment.id;
    button.type = "button";
    button.addEventListener("click", () => {
      buyExtendedMag(attachment.id);
      updateShopUi();
    });
    attachShopTooltip(button);
    shopAttachmentListEl.appendChild(button);
  });

  openShopBtn.addEventListener("click", () => {
    if (world.phase !== "day" || world.gameOver) {
      return;
    }
    setShopModalOpen(true);
    updateShopUi();
  });

  closeShopBtn.addEventListener("click", () => {
    setShopModalOpen(false);
  });

  shopModalEl.addEventListener("click", (event) => {
    if (event.target === shopModalEl) {
      setShopModalOpen(false);
    }
  });

  setPlayerWeapon(world.player.weaponId);
  updateShopUi();
}

function setSpeedButtonActive() {
  speedButtons.forEach((btn) => {
    const speed = Number(btn.dataset.speed);
    btn.classList.toggle("active", speed === world.timeScaleDay);
  });
}

setSpeedButtonActive();

speedButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!DEV_ALLOW_NIGHT_SPEED && world.phase !== "day") {
      return;
    }
    world.timeScaleDay = Number(btn.dataset.speed);
    setSpeedButtonActive();
  });
});

skipNightBtn.addEventListener("click", () => {
  if (world.phase !== "day" || world.gameOver) {
    return;
  }
  world.dayTimer = world.dayLength;
});

if (skipCurrentNightBtn) {
  skipCurrentNightBtn.addEventListener("click", () => {
    if (world.phase !== "night" || world.gameOver) {
      return;
    }
    devEndNightNow();
  });
}

pauseBtn.addEventListener("click", () => {
  if (world.gameOver) {
    return;
  }
  setPaused(!world.paused);
});

if (ultimateBtn) {
  ultimateBtn.addEventListener("click", () => {
    activateUltimate();
  });
}

restartBtn.addEventListener("click", () => {
  resetGameState();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (event.key === "Escape") {
    setShopModalOpen(false);
    return;
  }

  if (key === "q") {
    activateUltimate();
    return;
  }

  if (adjustIsometricCameraFromArrowKey(key)) {
    event.preventDefault();
    return;
  }

  world.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  world.keys.delete(event.key.toLowerCase());
});

function startNight() {
  world.phase = "night";
  world.nightNumber += 1;
  world.nightTimer = world.nightLength;
  world.spawnedThisNight = 0;
  world.defeatedThisNight = 0;
  const baseNightEnemies = 12 + (world.nightNumber - 1) * 4;
  const midNightExtra = Math.max(0, world.nightNumber - 10) * 3;
  const lateNightExtra = Math.max(0, world.nightNumber - 20) * 6;
  world.totalNightEnemies = baseNightEnemies + midNightExtra + lateNightExtra;
  world.spawnAccumulator = 0;
  world.timeScaleDay = 1;
  if (!world.ultimate.hasStarted) {
    world.ultimate.hasStarted = true;
    world.ultimate.timer = world.ultimate.cooldown;
  }
  setShopModalOpen(false);
  setSpeedButtonActive();
  updateShopUi();
}

function startDay() {
  world.phase = "day";
  world.dayNumber += 1;
  world.dayTimer = 0;
  updateShopUi();
}

function devEndNightNow() {
  if (world.phase !== "night" || world.gameOver) {
    return;
  }

  let bonusKills = 0;
  let bonusCredits = 0;

  world.enemies.forEach((enemy) => {
    bonusKills += 1;
    bonusCredits += enemy.reward || 0;
  });

  const unspawnedCount = Math.max(0, world.totalNightEnemies - world.spawnedThisNight);
  for (let index = 0; index < unspawnedCount; index += 1) {
    const enemyType = getEnemyTypeForNight();
    bonusKills += 1;
    bonusCredits += enemyType.reward;
  }

  world.enemies = [];
  world.bullets = [];
  world.turretProjectiles = [];
  world.spawnedThisNight = world.totalNightEnemies;
  world.defeatedThisNight = world.totalNightEnemies;
  world.spawnAccumulator = 0;
  world.totalKills += bonusKills;
  world.credits += bonusCredits;

  startDay();
}

function getEnemyTypeForNight() {
  const roll = Math.random();

  if (world.nightNumber >= 6 && roll < 0.22) {
    return enemyTypes.level3;
  }

  if (world.nightNumber >= 4 && roll < 0.45) {
    return enemyTypes.level2;
  }

  if (world.nightNumber >= 3 && roll < 0.2) {
    return enemyTypes.level2;
  }

  return enemyTypes.level1;
}

function clampPlayerToWorldBounds() {
  world.player.x = Math.max(world.player.radius, Math.min(world.width - world.player.radius, world.player.x));
  world.player.y = Math.max(world.player.radius, Math.min(world.height - world.player.radius, world.player.y));
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  const margin = 35;
  let x = 0;
  let y = 0;

  if (side === 0) {
    x = Math.random() * world.width;
    y = -margin;
  } else if (side === 1) {
    x = world.width + margin;
    y = Math.random() * world.height;
  } else if (side === 2) {
    x = Math.random() * world.width;
    y = world.height + margin;
  } else {
    x = -margin;
    y = Math.random() * world.height;
  }

  const enemyType = getEnemyTypeForNight();
  const randomSpeed =
    enemyType.speedMin + Math.random() * (enemyType.speedMax - enemyType.speedMin);
  const progressiveDamageScale = Math.min(0.5, (world.nightNumber - 1) * 0.015);
  const lateNightDamageScale = Math.max(0, world.nightNumber - 18) * 0.02;
  const nightDamageScale = 1 + progressiveDamageScale + lateNightDamageScale;
  const progressiveHpScale = Math.min(0.7, (world.nightNumber - 1) * 0.02);
  const lateNightHpScale = Math.max(0, world.nightNumber - 20) * 0.04;
  const nightHpScale = 1 + progressiveHpScale + lateNightHpScale;

  world.enemies.push({
    x,
    y,
    level: enemyType.level,
    radius: enemyType.radius,
    speed: randomSpeed + world.nightNumber * 1.3,
    hp: enemyType.hp * nightHpScale,
    damagePerSecond: enemyType.damagePerSecond * nightDamageScale,
    reward: enemyType.reward,
    color: enemyType.color,
    animationTimer: Math.random() * 1.2,
    footprintDistanceAccumulator: Math.random() * FOOTPRINT_STEP_SPACING,
    footprintStepSide: Math.random() < 0.5 ? -1 : 1,
  });
}

function getNearestEnemyTarget() {
  const selectNearest = (onlyAttackers) => {
    let nearestEnemy = null;
    let minDistanceSq = Number.POSITIVE_INFINITY;

    world.enemies.forEach((enemy) => {
      if (onlyAttackers && !enemy.isAttackingBase) {
        return;
      }
      if (!Number.isFinite(enemy.x) || !Number.isFinite(enemy.y)) {
        return;
      }

      const dx = enemy.x - world.player.x;
      const dy = enemy.y - world.player.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        nearestEnemy = enemy;
      }
    });

    return nearestEnemy;
  };

  const nearestAttacker = selectNearest(true);
  if (nearestAttacker) {
    return nearestAttacker;
  }

  return selectNearest(false);
}

function getTurretRangeForLevel(level) {
  const baseRange = Math.hypot(world.width, world.height);
  const multiplier = turretRangeMultipliersByLevel[level] || 0;
  return baseRange * multiplier;
}

function getWorldProjectionTransform() {
  if (!USE_ISOMETRIC_VIEW) {
    return {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
    };
  }

  const xAxisRadians = (isometricXAxisDegrees * Math.PI) / 180;
  const yAxisRadians = (isometricYAxisDegrees * Math.PI) / 180;
  const xAxis = {
    x: Math.cos(xAxisRadians),
    y: Math.sin(xAxisRadians) * isometricVerticalSquash,
  };
  const yAxis = {
    x: Math.cos(yAxisRadians),
    y: Math.sin(yAxisRadians) * isometricVerticalSquash,
  };

  const corners = [
    { x: 0, y: 0 },
    { x: world.width, y: 0 },
    { x: 0, y: world.height },
    { x: world.width, y: world.height },
  ];

  let minProjectedX = Number.POSITIVE_INFINITY;
  let maxProjectedX = Number.NEGATIVE_INFINITY;
  let minProjectedY = Number.POSITIVE_INFINITY;
  let maxProjectedY = Number.NEGATIVE_INFINITY;

  corners.forEach((corner) => {
    const projectedX = corner.x * xAxis.x + corner.y * yAxis.x;
    const projectedY = corner.x * xAxis.y + corner.y * yAxis.y;
    minProjectedX = Math.min(minProjectedX, projectedX);
    maxProjectedX = Math.max(maxProjectedX, projectedX);
    minProjectedY = Math.min(minProjectedY, projectedY);
    maxProjectedY = Math.max(maxProjectedY, projectedY);
  });

  const projectedWidth = Math.max(1, maxProjectedX - minProjectedX);
  const projectedHeight = Math.max(1, maxProjectedY - minProjectedY);
  const availableWidth = Math.max(1, canvas.width - ISOMETRIC_VIEW_MARGIN * 2);
  const availableHeight = Math.max(1, canvas.height - ISOMETRIC_VIEW_MARGIN * 2);
  const baseScale = Math.min(availableWidth / projectedWidth, availableHeight / projectedHeight);
  const projectionScale = baseScale * world.viewZoom;

  const a = xAxis.x * projectionScale;
  const b = xAxis.y * projectionScale;
  const c = yAxis.x * projectionScale;
  const d = yAxis.y * projectionScale;

  const scaledMinX = minProjectedX * projectionScale;
  const scaledMaxX = maxProjectedX * projectionScale;
  const scaledMinY = minProjectedY * projectionScale;
  const scaledMaxY = maxProjectedY * projectionScale;
  const e = canvas.width / 2 - (scaledMinX + scaledMaxX) / 2;
  const f = canvas.height / 2 - (scaledMinY + scaledMaxY) / 2;

  return { a, b, c, d, e, f };
}

function worldToScreen(x, y) {
  const transform = getWorldProjectionTransform();
  return {
    x: transform.a * x + transform.c * y + transform.e,
    y: transform.b * x + transform.d * y + transform.f,
  };
}

function screenToWorld(x, y) {
  const transform = getWorldProjectionTransform();
  const determinant = transform.a * transform.d - transform.b * transform.c;
  if (Math.abs(determinant) <= 0.000001) {
    return { x, y };
  }

  const dx = x - transform.e;
  const dy = y - transform.f;
  return {
    x: (transform.d * dx - transform.c * dy) / determinant,
    y: (-transform.b * dx + transform.a * dy) / determinant,
  };
}

function applyWorldProjectionTransform() {
  const transform = getWorldProjectionTransform();
  ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
}

function adjustIsometricCameraFromArrowKey(key) {
  if (!USE_ISOMETRIC_VIEW) {
    return false;
  }

  if (key === "arrowleft") {
    isometricXAxisDegrees -= ISOMETRIC_ANGLE_STEP_DEGREES;
    isometricYAxisDegrees += ISOMETRIC_ANGLE_STEP_DEGREES;
    return true;
  }

  if (key === "arrowright") {
    isometricXAxisDegrees += ISOMETRIC_ANGLE_STEP_DEGREES;
    isometricYAxisDegrees -= ISOMETRIC_ANGLE_STEP_DEGREES;
    return true;
  }

  if (key === "arrowup") {
    isometricVerticalSquash = Math.min(1.25, isometricVerticalSquash + ISOMETRIC_SQUASH_STEP);
    return true;
  }

  if (key === "arrowdown") {
    isometricVerticalSquash = Math.max(0.35, isometricVerticalSquash - ISOMETRIC_SQUASH_STEP);
    return true;
  }

  return false;
}

function getNearestEnemyToPoint(x, y, maxRange = Number.POSITIVE_INFINITY) {
  let nearestEnemy = null;
  let minDistanceSq = Number.POSITIVE_INFINITY;
  const maxRangeSq = maxRange * maxRange;

  world.enemies.forEach((enemy) => {
    const dx = enemy.x - x;
    const dy = enemy.y - y;
    const distSq = dx * dx + dy * dy;
    if (distSq > maxRangeSq) {
      return;
    }
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearestEnemy = enemy;
    }
  });

  return nearestEnemy;
}

function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

function rotateAngleTowards(current, target, maxStep) {
  const delta = normalizeAngle(target - current);
  if (Math.abs(delta) <= maxStep) {
    return target;
  }
  return current + Math.sign(delta) * maxStep;
}

function fireTurretWeapon(turret, weaponType, target, maxRange) {
  const stats = turretWeaponStats[weaponType];
  if (!stats) {
    return false;
  }

  if (!target || !Number.isFinite(target.x) || !Number.isFinite(target.y)) {
    return false;
  }

  const dxToTarget = target.x - turret.x;
  const dyToTarget = target.y - turret.y;
  const distanceToTarget = Math.hypot(dxToTarget, dyToTarget);
  const targetRadius = Number.isFinite(target.radius) ? target.radius : 0;
  if (distanceToTarget > maxRange + targetRadius) {
    return false;
  }

  const aimAngle = turret.aimAngle || 0;
  const dirX = Math.cos(aimAngle);
  const dirY = Math.sin(aimAngle);

  world.turretProjectiles.push({
    x: turret.x + dirX * 11,
    y: turret.y + dirY * 11,
    vx: dirX * stats.speed,
    vy: dirY * stats.speed,
    damage: stats.damage,
    radius: stats.radius,
    life: stats.life,
    splashRadius: stats.splashRadius,
    type: weaponType,
    penetrationsRemaining: weaponType === "flak" ? 2 : 0,
    piercedEnemies: new Set(),
  });

  spawnTurretMuzzleFlash(turret.x + dirX * 13, turret.y + dirY * 13, aimAngle, weaponType);

  turret.cooldowns[weaponType] = stats.cooldown;
  return true;
}

function getTurretImpactColor(projectileType) {
  if (projectileType === "flak") {
    return { red: 102, green: 231, blue: 255 };
  }
  return { red: 114, green: 255, blue: 130 };
}

function applyAreaDamage(x, y, radius, damage) {
  for (let index = world.enemies.length - 1; index >= 0; index -= 1) {
    const enemy = world.enemies[index];
    const dx = enemy.x - x;
    const dy = enemy.y - y;
    if (Math.hypot(dx, dy) <= radius + enemy.radius) {
      enemy.hp -= damage;
      if (enemy.hp <= 0) {
        defeatEnemyAtIndex(index);
      }
    }
  }
}

function spawnGrenadeBurst(x, y, radius) {
  world.grenadeBursts.push({
    x,
    y,
    radius,
    type: "grenade",
    life: 0.3,
    maxLife: 0.3,
  });
}

function spawnCannonSplash(x, y, radius) {
  world.grenadeBursts.push({
    x,
    y,
    radius,
    type: "cannon",
    life: 0.24,
    maxLife: 0.24,
  });
}

function getClosestPointTOnSegment(startX, startY, endX, endY, x, y) {
  const segmentX = endX - startX;
  const segmentY = endY - startY;
  const segmentLengthSq = segmentX * segmentX + segmentY * segmentY;
  if (segmentLengthSq <= 0.000001) {
    return 0;
  }

  const t = ((x - startX) * segmentX + (y - startY) * segmentY) / segmentLengthSq;
  return Math.max(0, Math.min(1, t));
}

function findFirstEnemyHitAlongSegment(startX, startY, endX, endY, bullet) {
  let nearestHit = null;

  world.enemies.forEach((enemy, index) => {
    if (bullet.piercedEnemies?.has(enemy)) {
      return;
    }

    const hitRadius = enemy.radius + bullet.radius;
    const t = getClosestPointTOnSegment(startX, startY, endX, endY, enemy.x, enemy.y);
    const hitX = startX + (endX - startX) * t;
    const hitY = startY + (endY - startY) * t;
    const dx = enemy.x - hitX;
    const dy = enemy.y - hitY;

    if (dx * dx + dy * dy > hitRadius * hitRadius) {
      return;
    }

    if (!nearestHit || t < nearestHit.t) {
      nearestHit = {
        enemy,
        index,
        t,
        hitX,
        hitY,
      };
    }
  });

  return nearestHit;
}

function updateTurrets(dtRaw) {
  world.turrets.forEach((turret) => {
    turret.recoil = Math.max(0, (turret.recoil || 0) - TURRET_RECOIL_RECOVERY * dtRaw);

    if (!turret.owned || turret.level <= 0) {
      return;
    }

    Object.keys(turret.cooldowns).forEach((weaponType) => {
      turret.cooldowns[weaponType] = Math.max(0, turret.cooldowns[weaponType] - dtRaw);
    });

    const turretRange = getTurretRangeForLevel(turret.level);
    const target = getNearestEnemyToPoint(turret.x, turret.y, turretRange);
    if (!target) {
      return;
    }

    const targetDistance = Math.hypot(target.x - turret.x, target.y - turret.y);
    if (targetDistance > turretRange + (target.radius || 0)) {
      return;
    }

    const desiredAim = Math.atan2(target.y - turret.y, target.x - turret.x);
    const turnSpeed =
      turret.label === "Middle"
        ? PLAYER_TURRET_TURN_SPEED
        : turretTurnSpeedByLevel[turret.level] || turretTurnSpeedByLevel[1];
    turret.aimAngle = rotateAngleTowards(
      Number.isFinite(turret.aimAngle) ? turret.aimAngle : desiredAim,
      desiredAim,
      turnSpeed * dtRaw
    );
    const aimError = Math.abs(normalizeAngle(desiredAim - turret.aimAngle));
    if (aimError > TURRET_FIRE_ANGLE_TOLERANCE) {
      return;
    }

    const loadout = turretLevelLoadouts[turret.level] || [];
    let fired = false;
    loadout.forEach((weaponType) => {
      if ((turret.cooldowns[weaponType] || 0) <= 0) {
        const didFire = fireTurretWeapon(turret, weaponType, target, turretRange);
        if (didFire) {
          fired = true;
        }
      }
    });

    if (fired) {
      turret.recoil = Math.min(TURRET_RECOIL_MAX, (turret.recoil || 0) + TURRET_RECOIL_KICK);
    }
  });

  world.turretProjectiles = world.turretProjectiles.filter((projectile) => {
    projectile.x += projectile.vx * dtRaw;
    projectile.y += projectile.vy * dtRaw;
    projectile.life -= dtRaw;

    if (!projectile.piercedEnemies) {
      projectile.piercedEnemies = new Set();
    }

    if (
      projectile.life <= 0 ||
      projectile.x < -24 ||
      projectile.x > world.width + 24 ||
      projectile.y < -24 ||
      projectile.y > world.height + 24
    ) {
      return false;
    }

    for (let index = 0; index < world.enemies.length; index += 1) {
      const enemy = world.enemies[index];
      if (projectile.piercedEnemies.has(enemy)) {
        continue;
      }

      const dx = enemy.x - projectile.x;
      const dy = enemy.y - projectile.y;
      if (Math.hypot(dx, dy) <= enemy.radius + projectile.radius) {
        spawnHitSplash(
          projectile.x,
          projectile.y,
          enemy.radius / 12,
          getTurretImpactColor(projectile.type)
        );

        if (projectile.splashRadius > 0) {
          if (projectile.type === "grenade") {
            spawnGrenadeBurst(projectile.x, projectile.y, projectile.splashRadius);
          } else if (projectile.type === "cannon") {
            spawnCannonSplash(projectile.x, projectile.y, projectile.splashRadius);
          }
          applyAreaDamage(projectile.x, projectile.y, projectile.splashRadius, projectile.damage);
          return false;
        }

        enemy.hp -= projectile.damage;
        projectile.piercedEnemies.add(enemy);

        if (enemy.hp <= 0 && world.enemies[index] === enemy) {
          defeatEnemyAtIndex(index);
        }

        if ((projectile.penetrationsRemaining || 0) > 0) {
          projectile.penetrationsRemaining -= 1;
          break;
        }

        return false;
      }
    }

    return true;
  });
}

function getCanvasPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const screenX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const screenY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  return USE_ISOMETRIC_VIEW ? screenToWorld(screenX, screenY) : { x: screenX, y: screenY };
}

function getTurretAtPoint(x, y) {
  let nearestTurret = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  world.turrets.forEach((turret) => {
    if (!turret.owned || turret.level <= 0) {
      return;
    }

    const dx = x - turret.x;
    const dy = y - turret.y;
    const distance = Math.hypot(dx, dy);
    const clickableRadius = turret.label === "Middle" ? 20 : 24;
    if (distance <= clickableRadius && distance < nearestDistance) {
      nearestDistance = distance;
      nearestTurret = turret;
    }
  });

  return nearestTurret;
}

canvas.addEventListener("click", (event) => {
  if (world.gameOver || !shopModalEl.classList.contains("hidden")) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  const selectedTurret = getTurretAtPoint(point.x, point.y);
  world.selectedTurretId = selectedTurret ? selectedTurret.id : null;
});

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const zoomFactor = Math.exp(-event.deltaY * VIEW_ZOOM_STEP);
    world.viewZoom = Math.max(VIEW_ZOOM_MIN, Math.min(VIEW_ZOOM_MAX, world.viewZoom * zoomFactor));
  },
  { passive: false }
);

function getPlayerAimDirection() {
  const target = getNearestEnemyTarget();
  if (target) {
    const dx = target.x - world.player.x;
    const dy = target.y - world.player.y;
    const len = Math.hypot(dx, dy) || 1;
    world.player.lastAimX = dx / len;
    world.player.lastAimY = dy / len;
  }

  return { x: world.player.lastAimX, y: world.player.lastAimY };
}

function getAnimationSpec(isShooting, isMoving) {
  if (isShooting) {
    return {
      spriteKey: "attackDown",
      frames: [0, 2, 4, 6, 8, 10],
      fps: 14,
    };
  }

  if (isMoving) {
    return {
      spriteKey: "runDown",
      frames: [0, 2, 4, 6, 8, 10],
      fps: 9,
    };
  }

  return {
    spriteKey: "idle1",
    frames: [0, 1, 0, 2],
    fps: 2.5,
  };
}

function getPlayerFrameIndex(frames, fps) {
  const index = Math.floor(world.player.animationTimer * fps) % frames.length;
  return frames[index];
}

function getGunOrigin(aimX, aimY) {
  return {
    x: world.player.x + aimX * 6,
    y: world.player.y - 14 + aimY * 2,
  };
}

function scanValidZombieFrames(sprite, sheetCols, frameRows, minOpaquePixels, fallbackCycle) {
  if (!sprite.complete || sprite.naturalWidth <= 0 || sprite.naturalHeight <= 0) {
    return [...fallbackCycle];
  }

  const frameWidth = Math.floor(sprite.naturalWidth / sheetCols);
  const frameHeight = Math.floor(sprite.naturalHeight / frameRows);
  if (frameWidth <= 0 || frameHeight <= 0) {
    return [...fallbackCycle];
  }

  const canvasEl = document.createElement("canvas");
  canvasEl.width = sprite.naturalWidth;
  canvasEl.height = sprite.naturalHeight;
  const scanCtx = canvasEl.getContext("2d", { willReadFrequently: true });
  if (!scanCtx) {
    return [...fallbackCycle];
  }

  scanCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  scanCtx.drawImage(sprite, 0, 0);

  const validFrames = [];
  const totalFrames = sheetCols * frameRows;

  for (let frame = 0; frame < totalFrames; frame += 1) {
    const col = frame % sheetCols;
    const row = Math.floor(frame / sheetCols);
    const sx = col * frameWidth;
    const sy = row * frameHeight;
    const { data } = scanCtx.getImageData(sx, sy, frameWidth, frameHeight);

    let opaquePixels = 0;
    for (let index = 3; index < data.length; index += 4) {
      if (data[index] > 18) {
        opaquePixels += 1;
        if (opaquePixels >= minOpaquePixels) {
          validFrames.push(frame);
          break;
        }
      }
    }
  }

  return validFrames.length > 0 ? validFrames : [...fallbackCycle];
}

function drawBasicZombie(enemy) {
  const sprite = basicZombieWalkSprite;
  if (!sprite.complete || sprite.naturalWidth <= 0 || sprite.naturalHeight <= 0) {
    return false;
  }

  if (!basicZombieFramesScanned) {
    basicZombieResolvedFrameCycle = scanValidZombieFrames(
      sprite,
      BASIC_ZOMBIE_SHEET_COLS,
      BASIC_ZOMBIE_FRAME_ROWS,
      BASIC_ZOMBIE_MIN_OPAQUE_PIXELS,
      BASIC_ZOMBIE_FRAME_CYCLE
    );
    basicZombieFramesScanned = true;
    console.log("Zombie valid frames:", basicZombieResolvedFrameCycle);
  }

  const frameWidth = Math.floor(sprite.naturalWidth / BASIC_ZOMBIE_SHEET_COLS);
  const frameHeight = Math.floor(sprite.naturalHeight / BASIC_ZOMBIE_FRAME_ROWS);
  if (frameWidth <= 0 || frameHeight <= 0) {
    return false;
  }

  const frameCycle = basicZombieResolvedFrameCycle.length > 0
    ? basicZombieResolvedFrameCycle
    : BASIC_ZOMBIE_FRAME_CYCLE;
  const frameIndex = frameCycle[Math.floor((enemy.animationTimer || 0) * 8) % frameCycle.length];
  const col = frameIndex % BASIC_ZOMBIE_SHEET_COLS;
  const row = Math.floor(frameIndex / BASIC_ZOMBIE_SHEET_COLS);
  const sx = col * frameWidth;
  const sy = row * frameHeight;

  const drawHeight = BASIC_ZOMBIE_DRAW_HEIGHT;
  const drawWidth = Math.round((frameWidth / frameHeight) * drawHeight);
  const centerX = enemy.x + (enemy.renderOffsetX || 0);
  const centerY = enemy.y + (enemy.renderOffsetY || 0) + BASIC_ZOMBIE_CENTER_OFFSET_Y;
  const facingRight = world.base.x - enemy.x > 0;

  ctx.save();
  ctx.translate(centerX, centerY);
  if (!facingRight) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    sprite,
    sx,
    sy,
    frameWidth,
    frameHeight,
    -drawWidth / 2,
    -drawHeight * BASIC_ZOMBIE_ANCHOR_Y,
    drawWidth,
    drawHeight
  );
  ctx.restore();

  return true;
}

function drawLevelTwoZombie(enemy) {
  const sprite = levelTwoZombieWalkSprite;
  if (!sprite.complete || sprite.naturalWidth <= 0 || sprite.naturalHeight <= 0) {
    return false;
  }

  if (!levelTwoZombieFramesScanned) {
    levelTwoZombieResolvedFrameCycle = scanValidZombieFrames(
      sprite,
      LVL2_ZOMBIE_SHEET_COLS,
      LVL2_ZOMBIE_FRAME_ROWS,
      LVL2_ZOMBIE_MIN_OPAQUE_PIXELS,
      LVL2_ZOMBIE_FRAME_CYCLE
    );
    levelTwoZombieFramesScanned = true;
    console.log("Level2 zombie valid frames:", levelTwoZombieResolvedFrameCycle);
  }

  const frameWidth = Math.floor(sprite.naturalWidth / LVL2_ZOMBIE_SHEET_COLS);
  const frameHeight = Math.floor(sprite.naturalHeight / LVL2_ZOMBIE_FRAME_ROWS);
  if (frameWidth <= 0 || frameHeight <= 0) {
    return false;
  }

  const frameCycle = levelTwoZombieResolvedFrameCycle.length > 0
    ? levelTwoZombieResolvedFrameCycle
    : LVL2_ZOMBIE_FRAME_CYCLE;
  const frameIndex = frameCycle[Math.floor((enemy.animationTimer || 0) * 7) % frameCycle.length];
  const col = frameIndex % LVL2_ZOMBIE_SHEET_COLS;
  const row = Math.floor(frameIndex / LVL2_ZOMBIE_SHEET_COLS);
  const sx = col * frameWidth;
  const sy = row * frameHeight;

  const drawHeight = LVL2_ZOMBIE_DRAW_HEIGHT;
  const drawWidth = Math.round((frameWidth / frameHeight) * drawHeight);
  const centerX = enemy.x + (enemy.renderOffsetX || 0);
  const centerY = enemy.y + (enemy.renderOffsetY || 0) + LVL2_ZOMBIE_CENTER_OFFSET_Y;
  const facingRight = world.base.x - enemy.x > 0;

  ctx.save();
  ctx.translate(centerX, centerY);
  if (!facingRight) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(
    sprite,
    sx,
    sy,
    frameWidth,
    frameHeight,
    -drawWidth / 2,
    -drawHeight * LVL2_ZOMBIE_ANCHOR_Y,
    drawWidth,
    drawHeight
  );
  ctx.restore();

  return true;
}

function drawLevelThreeZombie(enemy) {
  const sprite = levelThreeZombieWalkSprite;
  if (!sprite.complete || sprite.naturalWidth <= 0 || sprite.naturalHeight <= 0) {
    return false;
  }

  if (!levelThreeZombieFramesScanned) {
    levelThreeZombieResolvedFrameCycle = scanValidZombieFrames(
      sprite,
      LVL3_ZOMBIE_SHEET_COLS,
      LVL3_ZOMBIE_FRAME_ROWS,
      LVL3_ZOMBIE_MIN_OPAQUE_PIXELS,
      LVL3_ZOMBIE_FRAME_CYCLE
    );
    levelThreeZombieFramesScanned = true;
    console.log("Level3 zombie valid frames:", levelThreeZombieResolvedFrameCycle);
  }

  const frameWidth = Math.floor(sprite.naturalWidth / LVL3_ZOMBIE_SHEET_COLS);
  const frameHeight = Math.floor(sprite.naturalHeight / LVL3_ZOMBIE_FRAME_ROWS);
  if (frameWidth <= 0 || frameHeight <= 0) {
    return false;
  }

  const frameCycle = levelThreeZombieResolvedFrameCycle.length > 0
    ? levelThreeZombieResolvedFrameCycle
    : LVL3_ZOMBIE_FRAME_CYCLE;
  const frameIndex = frameCycle[Math.floor((enemy.animationTimer || 0) * 6.5) % frameCycle.length];
  const col = frameIndex % LVL3_ZOMBIE_SHEET_COLS;
  const row = Math.floor(frameIndex / LVL3_ZOMBIE_SHEET_COLS);
  const sx = col * frameWidth;
  const sy = row * frameHeight;

  const drawHeight = LVL3_ZOMBIE_DRAW_HEIGHT;
  const drawWidth = Math.round((frameWidth / frameHeight) * drawHeight);
  const centerX = enemy.x + (enemy.renderOffsetX || 0);
  const centerY = enemy.y + (enemy.renderOffsetY || 0) + LVL3_ZOMBIE_CENTER_OFFSET_Y;
  const facingRight = world.base.x - enemy.x > 0;
  const drawX = -drawWidth / 2;
  const drawY = -drawHeight * LVL3_ZOMBIE_ANCHOR_Y;

  ctx.save();
  ctx.translate(centerX, centerY);
  if (!facingRight) {
    ctx.scale(-1, 1);
  }

  ctx.filter = "brightness(0.5)";
  ctx.globalAlpha = 0.28;
  ctx.drawImage(sprite, sx, sy, frameWidth, frameHeight, drawX + 1, drawY + 1, drawWidth, drawHeight);

  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.shadowColor = "rgba(108, 255, 171, 0.45)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.drawImage(sprite, sx, sy, frameWidth, frameHeight, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  return true;
}

function drawPlayerSpriteFrame(sprite, frameIndex, centerX, centerY, rotationAngle, flipX) {
  const frameWidth = Math.floor(sprite.naturalWidth / PLAYER_SPRITE_SHEET_COLS);
  const frameHeight = Math.floor(sprite.naturalHeight / PLAYER_SPRITE_SHEET_ROWS);
  const safeIndex = ((frameIndex % PLAYER_SPRITE_FRAME_COUNT) + PLAYER_SPRITE_FRAME_COUNT) %
    PLAYER_SPRITE_FRAME_COUNT;
  const col = safeIndex % PLAYER_SPRITE_SHEET_COLS;
  const row = Math.floor(safeIndex / PLAYER_SPRITE_SHEET_COLS);
  const sx = col * frameWidth;
  const sy = row * frameHeight;

  const drawHeight = 88;
  const drawWidth = Math.round((frameWidth / frameHeight) * drawHeight);
  const offsetX = -drawWidth / 2;
  const offsetY = -drawHeight * 0.62;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotationAngle);
  if (flipX) {
    ctx.scale(-1, 1);
  }
  ctx.drawImage(sprite, sx, sy, frameWidth, frameHeight, offsetX, offsetY, drawWidth, drawHeight);
  ctx.restore();
}

function spawnMuzzleFlash(originX, originY, dirX, dirY) {
  world.muzzleFlashes.push({
    x: originX + dirX * 12,
    y: originY + dirY * 12,
    dirX,
    dirY,
    life: 0.08,
    maxLife: 0.08,
  });
}

function getTurretMuzzleFlashSize(weaponType) {
  if (weaponType === "cannon") {
    return 20 * TURRET_MUZZLE_FLASH_SIZE_MULTIPLIER;
  }
  if (weaponType === "grenade") {
    return 18 * TURRET_MUZZLE_FLASH_SIZE_MULTIPLIER;
  }
  if (weaponType === "flak") {
    return 16 * TURRET_MUZZLE_FLASH_SIZE_MULTIPLIER;
  }
  return 14 * TURRET_MUZZLE_FLASH_SIZE_MULTIPLIER;
}

function spawnTurretMuzzleFlash(x, y, aimAngle, weaponType) {
  const totalLife = TURRET_MUZZLE_FLASH_FRAME_DURATION * turretMuzzleFlashSprites.length;
  world.turretMuzzleFlashes.push({
    x,
    y,
    aimAngle,
    life: totalLife,
    maxLife: totalLife,
    frameIndex: 0,
    size: getTurretMuzzleFlashSize(weaponType),
  });
}

function spawnEnemyExplosion(enemy) {
  const particleCount = 10;
  const particles = [];

  for (let index = 0; index < particleCount; index += 1) {
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.3;
    const speed = 50 + Math.random() * 70;
    particles.push({
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.28 + Math.random() * 0.2,
      maxLife: 0.48,
      radius: 1.8 + Math.random() * 2.2,
      color: enemy.color,
    });
  }

  world.explosions.push({
    x: enemy.x,
    y: enemy.y,
    ringRadius: enemy.radius,
    ringLife: 0.16,
    ringMaxLife: 0.16,
    particles,
  });
}

function spawnZombieSplatter(enemy) {
  world.zombieSplatters.push({
    x: enemy.x,
    y: enemy.y,
    life: ZOMBIE_SPLATTER_LIFE,
    maxLife: ZOMBIE_SPLATTER_LIFE,
    rotation: Math.random() * Math.PI * 2,
    size: enemy.radius * 3.4 * 0.6,
  });
}

function getBulletColorFromLife(bullet) {
  const lifeRatio = Math.max(0, Math.min(1, bullet.life / (bullet.maxLife || 1)));
  return {
    red: Math.round(25 + (255 - 25) * lifeRatio),
    green: Math.round(25 + (90 - 25) * lifeRatio),
    blue: Math.round(25 + (20 - 25) * lifeRatio),
  };
}

function spawnHitSplash(x, y, size = 1, color = { red: 114, green: 255, blue: 130 }) {
  const scaledSize = Math.max(0.8, Math.min(1.8, size));
  const particleCount = 4 + Math.floor(Math.random() * 3);
  const particles = [];

  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (45 + Math.random() * 55) * scaledSize;
    particles.push({
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: (1.4 + Math.random() * 1.8) * scaledSize,
    });
  }

  world.hitSplashes.push({
    x,
    y,
    color,
    life: HIT_SPLASH_LIFE,
    maxLife: HIT_SPLASH_LIFE,
    ringRadius: 5 * scaledSize,
    ringGrowth: 54,
    particles,
  });
}

function defeatEnemyAtIndex(index) {
  const enemy = world.enemies[index];
  if (!enemy) {
    return;
  }

  spawnZombieSplatter(enemy);
  world.enemies.splice(index, 1);
  spawnEnemyExplosion(enemy);
  world.totalKills += 1;
  world.credits += enemy.reward;
  if (world.phase === "night") {
    world.defeatedThisNight += 1;
  }
}

function activateUltimate() {
  if (
    world.gameOver ||
    world.paused ||
    !world.ultimate.hasStarted ||
    world.ultimate.timer > 0 ||
    world.enemies.length === 0
  ) {
    return;
  }

  const originX = world.player.x;
  const originY = world.player.y;
  world.ultimate.timer = world.ultimate.cooldown;
  world.ultimate.boostTimer = world.ultimate.boostDuration;
  world.player.fireCooldown = Math.min(
    world.player.fireCooldown,
    world.player.fireRate * world.ultimate.fireRateMultiplier
  );

  world.ultimateWaves.push({
    x: originX,
    y: originY,
    radius: 0,
    maxRadius: world.ultimate.radius,
    life: 0.35,
    maxLife: 0.35,
  });

  for (let index = world.enemies.length - 1; index >= 0; index -= 1) {
    const enemy = world.enemies[index];
    const dx = enemy.x - originX;
    const dy = enemy.y - originY;
    const distance = Math.hypot(dx, dy);

    if (distance <= world.ultimate.radius) {
      enemy.hp -= world.ultimate.damage;
      if (enemy.hp <= 0) {
        defeatEnemyAtIndex(index);
      }
    }
  }
}

function updateEffects(dtRaw) {
  world.muzzleFlashes = world.muzzleFlashes.filter((flash) => {
    flash.life -= dtRaw;
    return flash.life > 0;
  });

  world.turretMuzzleFlashes = world.turretMuzzleFlashes
    .map((flash) => {
      flash.life -= dtRaw;
      const elapsed = flash.maxLife - flash.life;
      flash.frameIndex = Math.min(
        turretMuzzleFlashSprites.length - 1,
        Math.max(0, Math.floor(elapsed / TURRET_MUZZLE_FLASH_FRAME_DURATION))
      );
      return flash;
    })
    .filter((flash) => flash.life > 0);

  world.explosions = world.explosions
    .map((explosion) => {
      explosion.ringLife -= dtRaw;
      explosion.ringRadius += 120 * dtRaw;
      explosion.particles = explosion.particles.filter((particle) => {
        particle.life -= dtRaw;
        particle.x += particle.vx * dtRaw;
        particle.y += particle.vy * dtRaw;
        return particle.life > 0;
      });
      return explosion;
    })
    .filter((explosion) => explosion.ringLife > 0 || explosion.particles.length > 0);

  world.ultimateWaves = world.ultimateWaves
    .map((wave) => {
      wave.life -= dtRaw;
      const progress = 1 - wave.life / wave.maxLife;
      wave.radius = wave.maxRadius * Math.max(0, Math.min(1, progress));
      return wave;
    })
    .filter((wave) => wave.life > 0);

  world.grenadeBursts = world.grenadeBursts
    .map((burst) => {
      burst.life -= dtRaw;
      return burst;
    })
    .filter((burst) => burst.life > 0);

  world.zombieSplatters = world.zombieSplatters
    .map((splatter) => {
      splatter.life -= dtRaw;
      return splatter;
    })
    .filter((splatter) => splatter.life > 0);

  world.footprints = world.footprints
    .map((footprint) => {
      footprint.life -= dtRaw;
      return footprint;
    })
    .filter((footprint) => footprint.life > 0);

  world.hitSplashes = world.hitSplashes
    .map((splash) => {
      splash.life -= dtRaw;
      splash.ringRadius += splash.ringGrowth * dtRaw;
      splash.particles = splash.particles.map((particle) => ({
        ...particle,
        vx: particle.vx * Math.max(0, 1 - dtRaw * 6),
        vy: particle.vy * Math.max(0, 1 - dtRaw * 6),
      }));
      return splash;
    })
    .filter((splash) => splash.life > 0);
}

function renderHitSplashes() {
  world.hitSplashes.forEach((splash) => {
    const alpha = Math.max(0, splash.life / splash.maxLife);
    const splashColor = splash.color || { red: 114, green: 255, blue: 130 };
    ctx.strokeStyle = `rgba(${splashColor.red}, ${splashColor.green}, ${splashColor.blue}, ${0.75 * alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(splash.x, splash.y, splash.ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    splash.particles.forEach((particle) => {
      const px = splash.x + particle.vx * (1 - alpha) * 0.024;
      const py = splash.y + particle.vy * (1 - alpha) * 0.024;
      ctx.fillStyle = `rgba(${splashColor.red}, ${splashColor.green}, ${splashColor.blue}, ${0.85 * alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

function renderZombieSplatters() {
  if (!zombieSplatterSprite.complete || zombieSplatterSprite.naturalWidth <= 0) {
    return;
  }

  world.zombieSplatters.forEach((splatter) => {
    const fadeRemaining = Math.max(0, Math.min(ZOMBIE_SPLATTER_FADE_DURATION, splatter.life));
    const alpha =
      splatter.life > ZOMBIE_SPLATTER_FADE_DURATION
        ? 1
        : fadeRemaining / ZOMBIE_SPLATTER_FADE_DURATION;
    ctx.save();
    ctx.translate(splatter.x, splatter.y + 6);
    ctx.rotate(splatter.rotation);
    ctx.globalAlpha = alpha * 0.85;
    ctx.drawImage(
      zombieSplatterSprite,
      -splatter.size / 2,
      -splatter.size / 2,
      splatter.size,
      splatter.size
    );
    ctx.restore();
  });
}

function renderFootprints() {
  if (!footprintsSprite.complete || footprintsSprite.naturalWidth <= 0 || footprintsSprite.naturalHeight <= 0) {
    return;
  }

  world.footprints.forEach((footprint) => {
    const fadeRemaining = Math.max(0, Math.min(FOOTPRINT_FADE_DURATION, footprint.life));
    const alpha =
      footprint.life > FOOTPRINT_FADE_DURATION ? 1 : fadeRemaining / FOOTPRINT_FADE_DURATION;
    const drawWidth = footprint.size;
    const drawHeight = Math.max(
      1,
      Math.round((footprintsSprite.naturalHeight / footprintsSprite.naturalWidth) * drawWidth)
    );

    ctx.save();
    ctx.translate(footprint.x, footprint.y);
    ctx.rotate(footprint.rotation);
    ctx.globalAlpha = alpha * footprint.alpha;
    ctx.drawImage(footprintsSprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  });
}

function spawnFootprintForEnemy(enemy, baseX, baseY, moveAngle) {
  if (!footprintsSprite.complete || footprintsSprite.naturalWidth <= 0 || footprintsSprite.naturalHeight <= 0) {
    return;
  }

  const side = enemy.footprintStepSide || 1;
  const perpendicularAngle = moveAngle + Math.PI / 2;
  const offset = FOOTPRINT_LATERAL_OFFSET * side;
  const x = baseX + Math.cos(perpendicularAngle) * offset;
  const y = baseY + Math.sin(perpendicularAngle) * offset;

  world.footprints.push({
    x,
    y,
    rotation:
      moveAngle + FOOTPRINT_ROTATION_OFFSET + (Math.random() - 0.5) * FOOTPRINT_ROTATION_JITTER,
    size: FOOTPRINT_SIZE,
    alpha: 0.55,
    life: FOOTPRINT_LIFE,
  });

  enemy.footprintStepSide = -side;

  if (world.footprints.length > FOOTPRINT_MAX_ACTIVE) {
    world.footprints.splice(0, world.footprints.length - FOOTPRINT_MAX_ACTIVE);
  }
}

function renderTurretMuzzleFlashes() {
  if (turretMuzzleFlashSprites.length === 0) {
    return;
  }

  world.turretMuzzleFlashes.forEach((flash) => {
    const sprite = turretMuzzleFlashSprites[flash.frameIndex];
    if (!sprite || !sprite.complete || sprite.naturalWidth <= 0 || sprite.naturalHeight <= 0) {
      return;
    }

    const drawWidth = flash.size;
    const drawHeight = Math.max(1, Math.round((sprite.naturalHeight / sprite.naturalWidth) * drawWidth));
    const alpha = Math.max(0, flash.life / flash.maxLife);

    ctx.save();
    ctx.translate(flash.x, flash.y);
    ctx.rotate(flash.aimAngle);
    ctx.globalAlpha = 0.95 * alpha;
    ctx.drawImage(sprite, -drawWidth * 0.2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  });
}

function renderMuzzleFlashes() {
  world.muzzleFlashes.forEach((flash) => {
    const alpha = Math.max(0, flash.life / flash.maxLife);
    const tipX = flash.x + flash.dirX * 9;
    const tipY = flash.y + flash.dirY * 9;
    const sideX = -flash.dirY;
    const sideY = flash.dirX;

    ctx.fillStyle = `rgba(255, 224, 140, ${0.75 * alpha})`;
    ctx.beginPath();
    ctx.moveTo(flash.x + sideX * 3, flash.y + sideY * 3);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(flash.x - sideX * 3, flash.y - sideY * 3);
    ctx.closePath();
    ctx.fill();
  });
}

function renderExplosions() {
  world.explosions.forEach((explosion) => {
    if (explosion.ringLife > 0) {
      const ringAlpha = Math.max(0, explosion.ringLife / explosion.ringMaxLife);
      ctx.strokeStyle = `rgba(36, 112, 58, ${0.72 * ringAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, explosion.ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    explosion.particles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      const particleColor = particle.color || "#2f8c48";
      const rgb = hexToRgb(particleColor);
      ctx.fillStyle = `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${0.85 * alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

function renderUltimateWaves() {
  world.ultimateWaves.forEach((wave) => {
    const alpha = Math.max(0, wave.life / wave.maxLife);
    ctx.strokeStyle = `rgba(246, 204, 85, ${0.85 * alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function tryShoot(dt) {
  if (!Number.isFinite(world.player.fireCooldown)) {
    world.player.fireCooldown = 0;
  }
  if (!Number.isFinite(world.player.reloadTimer)) {
    world.player.reloadTimer = 0;
    world.player.isReloading = false;
  }

  world.player.fireCooldown -= dt;
  if (world.player.isReloading || world.player.fireCooldown > 0 || world.enemies.length === 0) {
    return;
  }

  if (world.player.ammoInMag <= 0) {
    world.player.isReloading = true;
    world.player.reloadTimer = world.player.reloadTime;
    return;
  }

  const nearestEnemy = getNearestEnemyTarget();

  if (!nearestEnemy) {
    return;
  }

  const dx = nearestEnemy.x - world.player.x;
  const dy = nearestEnemy.y - world.player.y;
  const length = Math.hypot(dx, dy) || 1;
  const centerAimX = dx / length;
  const centerAimY = dy / length;
  const gunOrigin = getGunOrigin(centerAimX, centerAimY);
  const shotDx = nearestEnemy.x - gunOrigin.x;
  const shotDy = nearestEnemy.y - gunOrigin.y;
  const shotLen = Math.hypot(shotDx, shotDy) || 1;
  const aimX = shotDx / shotLen;
  const aimY = shotDy / shotLen;

  world.bullets.push({
    x: gunOrigin.x,
    y: gunOrigin.y,
    vx: aimX * world.player.bulletSpeed,
    vy: aimY * world.player.bulletSpeed,
    radius: 3.5,
    damage: world.player.damage,
    life: 1.4,
    maxLife: 1.4,
    penetrationsRemaining: playerBulletPenetrationByWeaponId[world.player.weaponId] || 0,
    piercedEnemies: new Set(),
  });

  spawnMuzzleFlash(gunOrigin.x, gunOrigin.y, aimX, aimY);

  const fireRateMultiplier =
    world.ultimate.boostTimer > 0 ? world.ultimate.fireRateMultiplier : 1;
  world.player.fireCooldown = world.player.fireRate * fireRateMultiplier;
  world.player.ammoInMag -= 1;
  world.player.shotFlashTimer = 0.1;

  if (world.player.ammoInMag <= 0) {
    world.player.ammoInMag = 0;
    world.player.isReloading = true;
    world.player.reloadTimer = world.player.reloadTime;
  }
}

function update(dtRaw) {
  if (world.gameOver || world.paused) {
    return;
  }

  if (world.ultimate.hasStarted && world.ultimate.timer > 0) {
    world.ultimate.timer = Math.max(0, world.ultimate.timer - dtRaw);
  }
  if (world.ultimate.boostTimer > 0) {
    world.ultimate.boostTimer = Math.max(0, world.ultimate.boostTimer - dtRaw);
  }

  const timeScale =
    world.phase === "day" || DEV_ALLOW_NIGHT_SPEED ? world.timeScaleDay : 1;
  const dt = dtRaw * timeScale;

  if (world.phase === "day") {
    if (shopModalEl.classList.contains("hidden")) {
      world.dayTimer += dt;
    }
    if (world.dayTimer >= world.dayLength) {
      startNight();
    }
  } else {
    world.nightTimer -= dt;
    world.spawnAccumulator += dt;

    const spawnRate = Math.max(0.12, 0.78 - (world.nightNumber - 1) * 0.032);
    while (
      world.spawnAccumulator >= spawnRate &&
      world.spawnedThisNight < world.totalNightEnemies
    ) {
      world.spawnAccumulator -= spawnRate;
      world.spawnedThisNight += 1;
      spawnEnemy();
    }

    if (world.spawnedThisNight >= world.totalNightEnemies && world.enemies.length === 0) {
      startDay();
    }
  }

  const moveX =
    (world.keys.has("d") || world.keys.has("arrowright") ? 1 : 0) -
    (world.keys.has("a") || world.keys.has("arrowleft") ? 1 : 0);
  const moveY =
    (world.keys.has("s") || world.keys.has("arrowdown") ? 1 : 0) -
    (world.keys.has("w") || world.keys.has("arrowup") ? 1 : 0);
  const mag = Math.hypot(moveX, moveY) || 1;

  world.player.animationTimer += dtRaw;
  if (world.player.shotFlashTimer > 0) {
    world.player.shotFlashTimer = Math.max(0, world.player.shotFlashTimer - dtRaw);
  }

  world.player.x += (moveX / mag) * world.player.speed * dtRaw;
  world.player.y += (moveY / mag) * world.player.speed * dtRaw;
  clampPlayerToWorldBounds();

  if (world.player.isReloading) {
    const reloadSpeedMultiplier =
      world.ultimate.boostTimer > 0 ? ULTI_RELOAD_SPEED_MULTIPLIER : 1;
    world.player.reloadTimer -= dtRaw * reloadSpeedMultiplier;
    if (world.player.reloadTimer <= 0) {
      world.player.reloadTimer = 0;
      world.player.isReloading = false;
      world.player.ammoInMag = world.player.magSize;
    }
  }

  tryShoot(dtRaw);
  updateTurrets(dtRaw);

  world.bullets = world.bullets.filter((bullet) => {
    const previousX = bullet.x;
    const previousY = bullet.y;
    bullet.x += bullet.vx * dtRaw;
    bullet.y += bullet.vy * dtRaw;
    bullet.life -= dtRaw;

    if (!bullet.piercedEnemies) {
      bullet.piercedEnemies = new Set();
    }

    if (
      bullet.life <= 0 ||
      bullet.x < -20 ||
      bullet.x > world.width + 20 ||
      bullet.y < -20 ||
      bullet.y > world.height + 20
    ) {
      return false;
    }

    while (true) {
      const hit = findFirstEnemyHitAlongSegment(previousX, previousY, bullet.x, bullet.y, bullet);
      if (!hit) {
        break;
      }

      hit.enemy.hp -= bullet.damage;
      bullet.piercedEnemies.add(hit.enemy);
      const bulletColor = getBulletColorFromLife(bullet);
      spawnHitSplash(hit.hitX, hit.hitY, (hit.enemy?.radius || 10) / 12, bulletColor);

      if (hit.enemy.hp <= 0 && world.enemies[hit.index] === hit.enemy) {
        defeatEnemyAtIndex(hit.index);
      }

      if ((bullet.penetrationsRemaining || 0) > 0) {
        bullet.penetrationsRemaining -= 1;
        continue;
      }

      return false;
    }

    return true;
  });

  world.enemies.forEach((enemy) => {
    enemy.animationTimer = (enemy.animationTimer || 0) + dtRaw;
    const previousX = enemy.x;
    const previousY = enemy.y;
    const toBaseX = world.base.x - enemy.x;
    const toBaseY = world.base.y - enemy.y;
    const distanceToBase = Math.hypot(toBaseX, toBaseY) || 1;
    const stopDistance = world.base.radius + enemy.radius;
    const distanceToWall = distanceToBase - stopDistance;

    if (distanceToWall > 0.001) {
      const step = Math.min(enemy.speed * dtRaw, distanceToWall);
      enemy.x += (toBaseX / distanceToBase) * step;
      enemy.y += (toBaseY / distanceToBase) * step;
    }

    const movedX = enemy.x - previousX;
    const movedY = enemy.y - previousY;
    const movedDistance = Math.hypot(movedX, movedY);
    if (movedDistance > 0.1) {
      enemy.footprintDistanceAccumulator =
        (enemy.footprintDistanceAccumulator || 0) + movedDistance;
      const moveAngle = Math.atan2(movedY, movedX);
      while (enemy.footprintDistanceAccumulator >= FOOTPRINT_STEP_SPACING) {
        const backtrackDistance = enemy.footprintDistanceAccumulator - FOOTPRINT_STEP_SPACING;
        const footprintX = enemy.x - Math.cos(moveAngle) * backtrackDistance;
        const footprintY = enemy.y - Math.sin(moveAngle) * backtrackDistance;
        spawnFootprintForEnemy(enemy, footprintX, footprintY, moveAngle);
        enemy.footprintDistanceAccumulator -= FOOTPRINT_STEP_SPACING;
      }
    }

    const postDx = world.base.x - enemy.x;
    const postDy = world.base.y - enemy.y;
    const postDistanceToWall = Math.hypot(postDx, postDy) - stopDistance;
    const reachedWall = postDistanceToWall <= 0.001;
    enemy.isAttackingBase = reachedWall;

    if (reachedWall) {
      enemy.attackPhase = (enemy.attackPhase || Math.random() * Math.PI * 2) + dtRaw * 24;
      enemy.renderOffsetX = Math.sin(enemy.attackPhase) * 1.8;
      enemy.renderOffsetY = Math.cos(enemy.attackPhase * 1.31) * 1.4;
    } else {
      enemy.renderOffsetX = 0;
      enemy.renderOffsetY = 0;
    }

    if (reachedWall) {
      world.base.hp -= enemy.damagePerSecond * dtRaw;
    }

    const dxToPlayer = world.player.x - enemy.x;
    const dyToPlayer = world.player.y - enemy.y;
    const playerContactDistance = enemy.radius + world.player.radius + 2;
    if (Math.hypot(dxToPlayer, dyToPlayer) <= playerContactDistance) {
      world.player.hp = Math.max(
        0,
        world.player.hp - enemy.damagePerSecond * PLAYER_ZOMBIE_BITE_DAMAGE_MULTIPLIER * dtRaw
      );
    }
  });

  updateEffects(dtRaw);

  if (world.base.hp <= 0) {
    world.base.hp = 0;
    if (world.totalKills > world.highScore) {
      world.highScore = world.totalKills;
      setStoredHighScore(world.highScore);
    }
    world.gameOver = true;
    setShopModalOpen(false);
    gameOverKillsEl.textContent = `Kills: ${world.totalKills}`;
    gameOverHighScoreEl.textContent = `High Score: ${world.highScore}`;
    gameOverModalEl.classList.remove("hidden");
  }
}

function renderBackground() {
  const nightBlend = getNightBlendForBackground();
  const baseGrass = mixHexColor("#3fa650", "#16261a", nightBlend);

  ctx.fillStyle = baseGrass;
  ctx.fillRect(0, 0, world.width, world.height);

  drawGrassTileLayer(0.96);

  const dayGlowAlpha = (1 - nightBlend) * 0.1;
  if (dayGlowAlpha > 0.001) {
    ctx.fillStyle = `rgba(92, 190, 96, ${dayGlowAlpha})`;
    ctx.fillRect(0, 0, world.width, world.height);
  }

  const nightShadeAlpha = nightBlend * 0.68;
  ctx.fillStyle = `rgba(6, 12, 8, ${nightShadeAlpha})`;
  ctx.fillRect(0, 0, world.width, world.height);
}

function canDrawGrassTile() {
  return (
    (grassTileLoaded || grassTileSprite.complete) &&
    grassTileSprite.naturalWidth > 0 &&
    grassTileSprite.naturalHeight > 0
  );
}

function drawGrassTileLayer(alpha) {
  if (!canDrawGrassTile()) {
    return;
  }

  const tileWidth = Math.max(48, Math.floor(grassTileSprite.naturalWidth * GRASS_TILE_SCALE));
  const tileHeight = Math.max(48, Math.floor(grassTileSprite.naturalHeight * GRASS_TILE_SCALE));

  ctx.save();
  ctx.globalAlpha = alpha;

  for (let y = 0; y < world.height; y += tileHeight) {
    for (let x = 0; x < world.width; x += tileWidth) {
      ctx.drawImage(grassTileSprite, x, y, tileWidth, tileHeight);
    }
  }

  ctx.restore();
}

function getNightBlendForBackground() {
  const transitionDay = Math.min(DAY_NIGHT_TRANSITION_SECONDS, world.dayLength);
  const transitionNight = Math.min(DAY_NIGHT_TRANSITION_SECONDS, world.nightLength);

  if (world.phase === "day") {
    if (world.dayTimer <= world.dayLength - transitionDay) {
      return 0;
    }

    const duskProgress = (world.dayTimer - (world.dayLength - transitionDay)) / transitionDay;
    return easeInOutCubic(Math.min(1, Math.max(0, duskProgress)));
  }

  if (world.nightTimer >= transitionNight) {
    return 1;
  }

  const dawnProgress = 1 - world.nightTimer / transitionNight;
  return 1 - easeInOutCubic(Math.min(1, Math.max(0, dawnProgress)));
}

function mixHexColor(startHex, endHex, t) {
  const clampedT = Math.min(1, Math.max(0, t));
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  const red = Math.round(start.red + (end.red - start.red) * clampedT);
  const green = Math.round(start.green + (end.green - start.green) * clampedT);
  const blue = Math.round(start.blue + (end.blue - start.blue) * clampedT);
  return `rgb(${red}, ${green}, ${blue})`;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const parsed = Number.parseInt(normalized, 16);
  return {
    red: (parsed >> 16) & 255,
    green: (parsed >> 8) & 255,
    blue: parsed & 255,
  };
}

function easeInOutCubic(t) {
  const clampedT = Math.min(1, Math.max(0, t));
  return clampedT < 0.5
    ? 4 * clampedT * clampedT * clampedT
    : 1 - Math.pow(-2 * clampedT + 2, 3) / 2;
}

function renderBase() {
  ctx.fillStyle = "#2b3a4e";
  ctx.beginPath();
  ctx.arc(world.base.x, world.base.y, world.base.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#89a4ce";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(world.base.x, world.base.y, world.base.radius, 0, Math.PI * 2);
  ctx.stroke();

  const innerRadius = world.base.radius * 0.68;
  ctx.strokeStyle = "rgba(137, 164, 206, 0.45)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(world.base.x, world.base.y, innerRadius, 0, Math.PI * 2);
  ctx.stroke();
}

function renderTurrets() {
  world.turrets.forEach((turret) => {
    const isMiddleSlot = turret.label === "Middle";
    const turretRange = getTurretRangeForLevel(turret.level);
    const target = turret.owned ? getNearestEnemyToPoint(turret.x, turret.y, turretRange) : null;
    const aimAngle = Number.isFinite(turret.aimAngle) ? turret.aimAngle : 0;
    const recoil = Math.max(0, turret.recoil || 0);

    if (isMiddleSlot) {
      ctx.beginPath();
      ctx.arc(turret.x, turret.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = turret.owned ? "#6f89b8" : "#3f4b5e";
      ctx.fill();

      if (turret.owned) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(turret.x, turret.y, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!turret.owned) {
        ctx.strokeStyle = "rgba(188, 198, 214, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(turret.x, turret.y, 15, 0, Math.PI * 2);
        ctx.stroke();
        return;
      }

      const levelIndex = Math.max(0, Math.min(3, turret.level - 1));
      const levelSprite = turretLevelSprites[levelIndex];
      const canDrawLevelSprite =
        levelSprite &&
        levelSprite.complete &&
        levelSprite.naturalWidth > 0 &&
        levelSprite.naturalHeight > 0;
      const levelDrawSize =
        turret.level === 1
          ? TURRET_LEVEL_DRAW_SIZE * TURRET_LEVEL1_SIZE_MULTIPLIER
          : turret.level >= 4
            ? TURRET_LEVEL_DRAW_SIZE * TURRET_LEVEL4_SIZE_MULTIPLIER
            : TURRET_LEVEL_DRAW_SIZE;

      if (canDrawLevelSprite) {
        const recoilX = Math.cos(aimAngle) * recoil;
        const recoilY = Math.sin(aimAngle) * recoil;
        ctx.save();
        ctx.translate(turret.x - recoilX, turret.y - recoilY);
        ctx.rotate(aimAngle);
        ctx.drawImage(
          levelSprite,
          -levelDrawSize / 2,
          -levelDrawSize / 2,
          levelDrawSize,
          levelDrawSize
        );
        ctx.restore();
      } else {
        ctx.strokeStyle = "rgba(14, 18, 30, 0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(turret.x, turret.y);
        ctx.lineTo(
          turret.x + Math.cos(aimAngle) * (13 - recoil),
          turret.y + Math.sin(aimAngle) * (13 - recoil)
        );
        ctx.stroke();
      }
      return;
    }

    const canDrawPod =
      turretPodSprite.complete && turretPodSprite.naturalWidth > 0 && turretPodSprite.naturalHeight > 0;
    if (canDrawPod) {
      const rotation = turretSlotRotationByLabel[turret.label] ?? 0;
      ctx.save();
      ctx.translate(turret.x, turret.y);
      ctx.rotate(rotation);

      if (turret.owned) {
        ctx.filter = "brightness(50%)";
      }

      ctx.drawImage(
        turretPodSprite,
        -TURRET_POD_DRAW_SIZE / 2,
        -TURRET_POD_DRAW_SIZE / 2,
        TURRET_POD_DRAW_SIZE,
        TURRET_POD_DRAW_SIZE
      );
      ctx.restore();
    }

    if (!turret.owned) {
      if (!canDrawPod) {
        ctx.beginPath();
        ctx.arc(turret.x, turret.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = "#3f4b5e";
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(188, 198, 214, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(turret.x, turret.y, 15, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    const levelIndex = Math.max(0, Math.min(3, turret.level - 1));
    const levelSprite = turretLevelSprites[levelIndex];
    const canDrawLevelSprite =
      levelSprite && levelSprite.complete && levelSprite.naturalWidth > 0 && levelSprite.naturalHeight > 0;
    const levelDrawSize =
      turret.level === 1
        ? TURRET_LEVEL_DRAW_SIZE * TURRET_LEVEL1_SIZE_MULTIPLIER
        : turret.level >= 4
          ? TURRET_LEVEL_DRAW_SIZE * TURRET_LEVEL4_SIZE_MULTIPLIER
          : TURRET_LEVEL_DRAW_SIZE;

    if (canDrawLevelSprite) {
      const recoilX = Math.cos(aimAngle) * recoil;
      const recoilY = Math.sin(aimAngle) * recoil;
      ctx.save();
      ctx.translate(turret.x - recoilX, turret.y - recoilY);
      ctx.rotate(aimAngle);
      ctx.drawImage(
        levelSprite,
        -levelDrawSize / 2,
        -levelDrawSize / 2,
        levelDrawSize,
        levelDrawSize
      );
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(turret.x, turret.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#6f89b8";
      ctx.fill();
      ctx.strokeStyle = "rgba(14, 18, 30, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(turret.x, turret.y);
      ctx.lineTo(
        turret.x + Math.cos(aimAngle) * (13 - recoil),
        turret.y + Math.sin(aimAngle) * (13 - recoil)
      );
      ctx.stroke();
    }
  });
}

function renderSelectedTurretRange() {
  if (!Number.isInteger(world.selectedTurretId)) {
    return;
  }

  const turret = world.turrets.find((item) => item.id === world.selectedTurretId);
  if (!turret || !turret.owned || turret.level <= 0) {
    world.selectedTurretId = null;
    return;
  }

  const turretRange = getTurretRangeForLevel(turret.level);
  const turretType = turretTypeLabelByLevel[turret.level] || "Turret";
  const turretScreenPoint = worldToScreen(turret.x, turret.y);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 1.8;
  ctx.setLineDash([7, 6]);
  ctx.beginPath();
  ctx.arc(turret.x, turret.y, turretRange, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const labelText = `Lv${turret.level} ${turretType}`;
  if (USE_ISOMETRIC_VIEW) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textWidth = ctx.measureText(labelText).width;
  const boxWidth = Math.ceil(textWidth) + 14;
  const boxHeight = 22;
  ctx.fillStyle = "rgba(8, 12, 18, 0.72)";
  const labelX = USE_ISOMETRIC_VIEW ? turretScreenPoint.x : turret.x;
  const labelY = USE_ISOMETRIC_VIEW ? turretScreenPoint.y : turret.y;
  ctx.fillRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 1;
  ctx.strokeRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(labelText, labelX, labelY + 0.5);
  ctx.restore();
}

function renderNightWaveInfo() {
  if (world.phase !== "night") {
    return;
  }

  const panelWidth = 240;
  const panelHeight = 30;
  const panelX = world.width / 2 - panelWidth / 2;
  const panelY = 14;
  const alive = Math.max(world.totalNightEnemies - world.defeatedThisNight, 0);

  ctx.fillStyle = "rgba(10, 18, 30, 0.8)";
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  ctx.strokeStyle = "rgba(142, 166, 206, 0.7)";
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

  ctx.fillStyle = "#dfe9fa";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Enemies Left: ${alive}`, world.base.x, panelY + 20);
}

function renderPlayer() {
  const nearestEnemy = getNearestEnemyTarget();
  const aim = getPlayerAimDirection();

  const moveX =
    (world.keys.has("d") || world.keys.has("arrowright") ? 1 : 0) -
    (world.keys.has("a") || world.keys.has("arrowleft") ? 1 : 0);
  const moveY =
    (world.keys.has("s") || world.keys.has("arrowdown") ? 1 : 0) -
    (world.keys.has("w") || world.keys.has("arrowup") ? 1 : 0);

  const isShooting = world.player.shotFlashTimer > 0;
  const isMoving = Math.abs(moveX) > 0.001 || Math.abs(moveY) > 0.001;
  const animationSpec = getAnimationSpec(isShooting, isMoving);
  const spriteKey = animationSpec.spriteKey;
  const sprite = playerSprites[spriteKey];
  const frameIndex = getPlayerFrameIndex(animationSpec.frames, animationSpec.fps);
  const flipX = aim.x < 0;
  const visualAimX = flipX ? -aim.x : aim.x;
  const aimRotation = Math.atan2(aim.y, visualAimX);

  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    drawPlayerSpriteFrame(
      sprite,
      frameIndex,
      world.player.x,
      world.player.y,
      aimRotation,
      flipX
    );
  } else {
    ctx.fillStyle = "#f4c430";
    ctx.beginPath();
    ctx.arc(world.player.x, world.player.y, world.player.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (nearestEnemy) {
    const centerDx = nearestEnemy.x - world.player.x;
    const centerDy = nearestEnemy.y - world.player.y;
    const centerLen = Math.hypot(centerDx, centerDy) || 1;
    const gunOrigin = getGunOrigin(centerDx / centerLen, centerDy / centerLen);
    const shotDx = nearestEnemy.x - gunOrigin.x;
    const shotDy = nearestEnemy.y - gunOrigin.y;
    const shotLen = Math.hypot(shotDx, shotDy) || 1;
    const aimX = shotDx / shotLen;
    const aimY = shotDy / shotLen;
    const gunLength = 9;
    ctx.strokeStyle = "rgba(16, 20, 28, 0.9)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(gunOrigin.x, gunOrigin.y);
    ctx.lineTo(
      gunOrigin.x + aimX * gunLength,
      gunOrigin.y + aimY * gunLength
    );
    ctx.stroke();
  }
}

function renderReloadWheel() {
  if (!world.player.isReloading) {
    return;
  }

  const progress = 1 - world.player.reloadTimer / world.player.reloadTime;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const x = world.player.x;
  const y = world.player.y - 22;
  const radius = 10;

  ctx.strokeStyle = "rgba(215, 227, 246, 0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#f4c430";
  ctx.beginPath();
  ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clampedProgress);
  ctx.stroke();
}

function renderBullets() {
  world.bullets.forEach((bullet) => {
    const bulletColor = getBulletColorFromLife(bullet);
    ctx.fillStyle = `rgb(${bulletColor.red}, ${bulletColor.green}, ${bulletColor.blue})`;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderTurretProjectiles() {
  world.turretProjectiles.forEach((projectile) => {
    if (projectile.type === "grenade") {
      ctx.fillStyle = "#ff8f57";
    } else if (projectile.type === "cannon") {
      ctx.fillStyle = "#ffd166";
    } else if (projectile.type === "flak") {
      ctx.fillStyle = "#66e7ff";
    } else {
      ctx.fillStyle = "#86ff6f";
    }

    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderGrenadeBursts() {
  world.grenadeBursts.forEach((burst) => {
    const alpha = Math.max(0, burst.life / burst.maxLife);
    const isCannon = burst.type === "cannon";
    const strokeColor = isCannon ? `rgba(255, 218, 128, ${0.92 * alpha})` : `rgba(255, 184, 106, ${0.8 * alpha})`;
    const fillColor = isCannon ? `rgba(255, 218, 128, ${0.22 * alpha})` : `rgba(255, 184, 106, ${0.12 * alpha})`;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
    ctx.fill();

    if (isCannon) {
      ctx.strokeStyle = `rgba(255, 238, 190, ${0.55 * alpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, burst.radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function renderEnemies() {
  world.enemies.forEach((enemy) => {
    if (enemy.level === 1 && drawBasicZombie(enemy)) {
      return;
    }

    if (enemy.level === 2 && drawLevelTwoZombie(enemy)) {
      return;
    }

    if (enemy.level === 3 && drawLevelThreeZombie(enemy)) {
      return;
    }

    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(
      enemy.x + (enemy.renderOffsetX || 0),
      enemy.y + (enemy.renderOffsetY || 0),
      enemy.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}

function updateHud() {
  const totalSeconds =
    world.phase === "day"
      ? Math.floor((world.dayTimer / world.dayLength) * 12 * 60)
      : Math.floor(((world.nightLength - world.nightTimer) / world.nightLength) * 12 * 60);

  const minuteOfDay = 8 * 60 + totalSeconds;
  const hour24 = Math.floor((minuteOfDay % (24 * 60)) / 60);
  const amPm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  const hour = hour12.toString().padStart(2, "0");
  const minute = (minuteOfDay % 60).toString().padStart(2, "0");

  dayClockEl.textContent = `${hour}:${minute} ${amPm}`;
  phaseLabelEl.textContent =
    world.phase === "day" ? `Day #${world.dayNumber}` : `Night #${world.nightNumber}`;
  phaseLabelEl.className = `phase ${world.phase}`;

  if (world.phase === "day") {
    const remain = Math.max(0, Math.ceil(world.dayLength - world.dayTimer));
    nightTimerEl.textContent = `Night in ${remain}s`;
    nightIconEl.textContent = "🌞";
    nightIconEl.classList.add("sun");
    nightIconEl.classList.remove("moon", "active");
  } else {
    const remain = Math.max(0, Math.ceil(world.nightTimer));
    nightTimerEl.textContent = `Dawn in ${remain}s`;
    nightIconEl.textContent = "🌙";
    nightIconEl.classList.add("moon", "active");
    nightIconEl.classList.remove("sun");
  }

  creditsValueEl.dataset.value = String(world.credits);
  creditsTextEl.textContent = `Credits: ${world.credits}`;
  const ammoPrefix = world.player.isReloading ? "Reloading" : "Ammo";
  ammoHudEl.dataset.value = `${world.player.ammoInMag}/${world.player.magSize}`;
  ammoTextEl.textContent = `${ammoPrefix}: ${world.player.ammoInMag} / ${world.player.magSize}`;

  if (world.player.isReloading) {
    const progress = 1 - world.player.reloadTimer / world.player.reloadTime;
    const clamped = Math.max(0, Math.min(1, progress));
    reloadHudEl.style.setProperty("--reload-progress", `${Math.round(clamped * 360)}deg`);
    reloadHudEl.classList.add("show");
  } else {
    reloadHudEl.classList.remove("show");
  }

  const equippedWeaponId = world.player.weaponId;
  const hasAttachment = hasExtendedMag(equippedWeaponId);
  const weaponIconPath = weaponIconById[equippedWeaponId];
  if (weaponIconPath) {
    ammoIconEl.src = weaponIconPath;
  }

  if (hasAttachment) {
    const attachmentIconPath = attachmentIconByWeaponId[equippedWeaponId];
    if (attachmentIconPath) {
      ammoAttachmentIconEl.src = attachmentIconPath;
    }
    ammoAttachmentIconEl.classList.add("show");
  } else {
    ammoAttachmentIconEl.classList.remove("show");
  }

  const baseHpPct = Math.max(0, Math.min(1, world.base.hp / world.base.maxHp));
  baseHpTextEl.textContent = `Base HP: ${Math.ceil(world.base.hp)} / ${world.base.maxHp}`;
  baseHpFillEl.style.width = `${baseHpPct * 100}%`;
  baseHpFillEl.style.background = baseHpPct > 0.4 ? "#53d48b" : "#e28f51";

  const playerHpPct = Math.max(0, Math.min(1, world.player.hp / world.player.maxHp));
  playerHpTextEl.textContent = `Player HP: ${Math.ceil(world.player.hp)} / ${world.player.maxHp}`;
  playerHpFillEl.style.width = `${playerHpPct * 100}%`;
  playerHpFillEl.style.background = playerHpPct > 0.4 ? "#53d48b" : "#e28f51";
  killsHudEl.textContent = `Kills: ${world.totalKills}`;

  const showSkipToNight = world.phase === "day" && !world.gameOver;
  skipNightBtn.hidden = !showSkipToNight;
  skipNightBtn.disabled = !showSkipToNight;

  if (skipCurrentNightBtn) {
    const showSkipNight = world.phase === "night" && !world.gameOver;
    skipCurrentNightBtn.hidden = !showSkipNight;
    skipCurrentNightBtn.disabled = !showSkipNight;
  }

  const ultimateStarted = world.ultimate.hasStarted;
  const ultimateOnCooldown = world.ultimate.timer > 0;
  const canUseUltimate =
    ultimateStarted &&
    !ultimateOnCooldown &&
    world.enemies.length > 0 &&
    !world.paused &&
    !world.gameOver;
  if (ultimateBtn) {
    ultimateBtn.disabled = !canUseUltimate;
  }

  if (!ultimateStarted) {
    ultimateStatusEl.textContent = "Ultimate: starts Night 1";
    ultimateStatusEl.classList.remove("ready");
  } else if (ultimateOnCooldown) {
    ultimateStatusEl.textContent = `Ultimate: ${Math.ceil(world.ultimate.timer)}s`;
    ultimateStatusEl.classList.remove("ready");
  } else if (world.enemies.length === 0) {
    ultimateStatusEl.textContent = "Ultimate: No targets";
    ultimateStatusEl.classList.remove("ready");
  } else {
    ultimateStatusEl.textContent = "Ultimate: READY (Q)";
    ultimateStatusEl.classList.add("ready");
  }

  if (!shopModalEl.classList.contains("hidden")) {
    updateShopUi();
  }
}

function renderGameOver() {
  if (!world.gameOver) {
    return;
  }

  ctx.fillStyle = "rgba(5, 6, 10, 0.38)";
  ctx.fillRect(0, 0, world.width, world.height);
}

function renderPaused() {
  if (!world.paused || world.gameOver) {
    return;
  }

  ctx.fillStyle = "rgba(5, 6, 10, 0.45)";
  ctx.fillRect(0, 0, world.width, world.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Paused", world.width / 2, world.height / 2);
}

let lastTime = performance.now();

function loop(timestamp) {
  const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  update(dt);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#101712";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  applyWorldProjectionTransform();
  renderBackground();
  renderFootprints();
  renderZombieSplatters();
  renderBase();
  renderTurrets();
  renderSelectedTurretRange();
  renderTurretMuzzleFlashes();
  renderEnemies();
  renderUltimateWaves();
  renderGrenadeBursts();
  renderExplosions();
  renderHitSplashes();
  renderTurretProjectiles();
  renderBullets();
  renderPlayer();
  renderMuzzleFlashes();
  ctx.restore();

  renderNightWaveInfo();
  renderPaused();
  renderGameOver();
  updateHud();

  requestAnimationFrame(loop);
}

initShopUi();
requestAnimationFrame(loop);