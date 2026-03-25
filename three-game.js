import * as THREE from "./vendor/three/three.module.js";

const canvas = document.getElementById("gameCanvas");
const dayClockEl = document.getElementById("dayClock");
const phaseLabelEl = document.getElementById("phaseLabel");
const nightTimerEl = document.getElementById("nightTimer");
const creditsTextEl = document.getElementById("creditsText");
const killsHudEl = document.getElementById("killsHud");
const ammoIconEl = document.getElementById("ammoIcon");
const ammoAttachmentIconEl = document.getElementById("ammoAttachmentIcon");
const weaponHudNameEl = document.getElementById("weaponHudName");
const ammoTextEl = document.getElementById("ammoText");
const baseHpTextEl = document.getElementById("baseHpText");
const baseHpFillEl = document.getElementById("baseHpFill");
const bunkerHpTextEl = document.getElementById("bunkerHpText");
const bunkerHpFillEl = document.getElementById("bunkerHpFill");
const playerHpTextEl = document.getElementById("playerHpText");
const playerHpFillEl = document.getElementById("playerHpFill");
const ultimateStatusEl = document.getElementById("ultimateStatus");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const openShopBtn = document.getElementById("openShopBtn");
const closeShopBtn = document.getElementById("closeShopBtn");
const shopModalEl = document.getElementById("shopModal");
const currentWeaponEl = document.getElementById("currentWeapon");
const shopWeaponListEl = document.getElementById("shopWeaponList");
const shopAttachmentListEl = document.getElementById("shopAttachmentList");
const shopRepairListEl = document.getElementById("shopRepairList");
const shopBaseUpgradeListEl = document.getElementById("shopBaseUpgradeList");
const shopTurretListEl = document.getElementById("shopTurretList");
const shopTabTurretsEl = document.getElementById("shopTabTurrets");
const shopTabBaseEl = document.getElementById("shopTabBase");
const shopTabPlayerEl = document.getElementById("shopTabPlayer");
const shopPanelTurretsEl = document.getElementById("shopPanelTurrets");
const shopPanelBaseEl = document.getElementById("shopPanelBase");
const shopPanelPlayerEl = document.getElementById("shopPanelPlayer");
const shopTabsEl = shopModalEl?.querySelector(".shop-tabs");
const skipNightBtn = document.getElementById("skipNightBtn");
const skipCurrentNightBtn = document.getElementById("skipCurrentNightBtn");
const speedButtons = document.querySelectorAll(".speed-btn");
const phaseIconEl = document.getElementById("nightIcon");
const gameOverModalEl = document.getElementById("gameOverModal");
const gameOverKillsEl = document.getElementById("gameOverKills");
const gameOverHighScoreEl = document.getElementById("gameOverHighScore");
const startOverlayEl = document.getElementById("startOverlay");
const startGameBtnEl = document.getElementById("startGameBtn");
const survivedBannerEl = document.getElementById("survivedBanner");

const enemiesLeftEl = document.createElement("div");
enemiesLeftEl.id = "enemiesLeftHud";
enemiesLeftEl.style.position = "absolute";
enemiesLeftEl.style.top = "12px";
enemiesLeftEl.style.left = "50%";
enemiesLeftEl.style.transform = "translateX(-50%)";
enemiesLeftEl.style.padding = "6px 12px";
enemiesLeftEl.style.border = "1px solid rgba(142, 166, 206, 0.7)";
enemiesLeftEl.style.background = "rgba(10, 18, 30, 0.8)";
enemiesLeftEl.style.color = "#dfe9fa";
enemiesLeftEl.style.font = "700 14px Inter, system-ui, sans-serif";
enemiesLeftEl.style.borderRadius = "4px";
enemiesLeftEl.style.zIndex = "5";
enemiesLeftEl.style.pointerEvents = "none";
enemiesLeftEl.style.display = "none";
enemiesLeftEl.textContent = "Enemies Left: 0";

const cameraLegendEl = document.createElement("div");
cameraLegendEl.id = "cameraControlsLegend";
cameraLegendEl.style.position = "absolute";
cameraLegendEl.style.top = "52px";
cameraLegendEl.style.right = "12px";
cameraLegendEl.style.padding = "8px 10px";
cameraLegendEl.style.border = "1px solid rgba(142, 166, 206, 0.65)";
cameraLegendEl.style.background = "rgba(10, 18, 30, 0.78)";
cameraLegendEl.style.color = "#dfe9fa";
cameraLegendEl.style.font = "600 12px Inter, system-ui, sans-serif";
cameraLegendEl.style.borderRadius = "6px";
cameraLegendEl.style.zIndex = "5";
cameraLegendEl.style.pointerEvents = "none";
cameraLegendEl.style.whiteSpace = "pre-line";
cameraLegendEl.textContent = "Mouse Controls\nWheel: Zoom\nLMB + Drag: Tilt/Orbit\nMMB Click: Reset Angle";

const devModeBtnEl = document.createElement("button");
devModeBtnEl.id = "devModeBtn";
devModeBtnEl.type = "button";
devModeBtnEl.style.position = "absolute";
devModeBtnEl.style.top = "12px";
devModeBtnEl.style.right = "12px";
devModeBtnEl.style.padding = "6px 10px";
devModeBtnEl.style.border = "1px solid rgba(142, 166, 206, 0.75)";
devModeBtnEl.style.background = "rgba(10, 18, 30, 0.9)";
devModeBtnEl.style.color = "#dfe9fa";
devModeBtnEl.style.font = "700 12px Inter, system-ui, sans-serif";
devModeBtnEl.style.borderRadius = "6px";
devModeBtnEl.style.zIndex = "6";
devModeBtnEl.style.pointerEvents = "auto";
devModeBtnEl.style.cursor = "pointer";
devModeBtnEl.textContent = "Dev Mode: OFF";

const woodHudEl = document.createElement("div");
woodHudEl.id = "woodHud";
woodHudEl.style.color = "#f6e6c8";
woodHudEl.style.font = "700 12px Inter, system-ui, sans-serif";
woodHudEl.style.pointerEvents = "none";
woodHudEl.style.whiteSpace = "nowrap";
woodHudEl.textContent = "Wood: 0 | Stone: 0 | Backpack: 0/20";

const breachAlertBannerEl = document.createElement("div");
breachAlertBannerEl.id = "breachAlertBanner";
breachAlertBannerEl.style.position = "absolute";
breachAlertBannerEl.style.top = "10px";
breachAlertBannerEl.style.left = "50%";
breachAlertBannerEl.style.transform = "translateX(-50%)";
breachAlertBannerEl.style.padding = "9px 18px";
breachAlertBannerEl.style.border = "2px solid #ffdb6e";
breachAlertBannerEl.style.background = "rgba(124, 12, 12, 0.92)";
breachAlertBannerEl.style.color = "#ffe9a9";
breachAlertBannerEl.style.font = "900 17px 'Arial Black', Impact, sans-serif";
breachAlertBannerEl.style.letterSpacing = "1.7px";
breachAlertBannerEl.style.textTransform = "uppercase";
breachAlertBannerEl.style.textShadow = "0 0 10px rgba(255, 94, 94, 0.9)";
breachAlertBannerEl.style.borderRadius = "6px";
breachAlertBannerEl.style.zIndex = "9";
breachAlertBannerEl.style.pointerEvents = "none";
breachAlertBannerEl.style.display = "none";
breachAlertBannerEl.textContent = "!!! BREACH DETECTED !!!";

const canvasWrapEl = canvas.parentElement;
if (canvasWrapEl && getComputedStyle(canvasWrapEl).position === "static") {
  canvasWrapEl.style.position = "relative";
}
canvasWrapEl?.appendChild(enemiesLeftEl);
canvasWrapEl?.appendChild(devModeBtnEl);
canvasWrapEl?.appendChild(cameraLegendEl);
canvasWrapEl?.appendChild(breachAlertBannerEl);
const canvasCreditsHudEl = openShopBtn?.parentElement;
canvasCreditsHudEl?.insertBefore(woodHudEl, openShopBtn);

phaseLabelEl.className = "phase day";
dayClockEl.textContent = "08:00 AM";
nightTimerEl.textContent = "Night in 90s";
ultimateStatusEl.textContent = "Ultimate: No targets";
creditsTextEl.textContent = "Credits: 0";
ammoTextEl.textContent = "Ammo: 14 / 14";
woodHudEl.textContent = "Wood: 0 | Stone: 0 | Backpack: 0/20";

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(canvas.width, canvas.height, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09140f);
scene.fog = new THREE.Fog(0x09140f, 180, 560);

function createSkyGradientTexture(topColor, bottomColor) {
  const gradientCanvas = document.createElement("canvas");
  gradientCanvas.width = 8;
  gradientCanvas.height = 512;
  const context = gradientCanvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, gradientCanvas.height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  context.fillStyle = gradient;
  context.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
  const texture = new THREE.CanvasTexture(gradientCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const daySkyTexture = createSkyGradientTexture("#d9efff", "#8dc8ff");
const nightSkyColor = new THREE.Color(0x09140f);

const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 1200);
camera.position.set(0, 260, 250);
camera.lookAt(0, 0, 0);

const defaultOrbitPitch = Math.atan2(260, 250);
const cameraOrbit = {
  targetX: 0,
  targetY: 0,
  targetZ: 0,
  yaw: 0,
  pitch: defaultOrbitPitch,
  distance: Math.hypot(260, 250),
  minDistance: 180,
  maxDistance: 620,
  dragSensitivityYaw: 0.006,
  dragSensitivityPitch: 0.005,
  wheelSensitivity: 0.001,
  isDragging: false,
  lastX: 0,
  lastY: 0,
};

function applyCameraOrbit() {
  const minPitch = 0.3;
  const maxPitch = 1.35;
  cameraOrbit.pitch = THREE.MathUtils.clamp(cameraOrbit.pitch, minPitch, maxPitch);
  cameraOrbit.distance = THREE.MathUtils.clamp(cameraOrbit.distance, cameraOrbit.minDistance, cameraOrbit.maxDistance);
  const horizontalDistance = Math.cos(cameraOrbit.pitch) * cameraOrbit.distance;
  const camX = cameraOrbit.targetX + Math.sin(cameraOrbit.yaw) * horizontalDistance;
  const camY = cameraOrbit.targetY + Math.sin(cameraOrbit.pitch) * cameraOrbit.distance;
  const camZ = cameraOrbit.targetZ + Math.cos(cameraOrbit.yaw) * horizontalDistance;
  camera.position.set(camX, camY, camZ);
  camera.lookAt(cameraOrbit.targetX, cameraOrbit.targetY, cameraOrbit.targetZ);
}

applyCameraOrbit();

const hemi = new THREE.HemisphereLight(0xbde6ff, 0x2d5a32, 0.75);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 0.92);
sun.position.set(120, 220, 80);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -360;
sun.shadow.camera.right = 360;
sun.shadow.camera.top = 360;
sun.shadow.camera.bottom = -360;
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 900;
sun.shadow.bias = -0.00035;
sun.shadow.normalBias = 0.03;
sun.shadow.camera.updateProjectionMatrix();
sun.target.position.set(0, 0, 0);
scene.add(sun);
scene.add(sun.target);

const daySunOrb = new THREE.Mesh(
  new THREE.SphereGeometry(11, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0xffe68a })
);
daySunOrb.position.set(190, 185, -200);
scene.add(daySunOrb);

const moonOrb = new THREE.Mesh(
  new THREE.SphereGeometry(9.5, 22, 22),
  new THREE.MeshStandardMaterial({ color: 0xf5f8ff, emissive: 0xc8d6ff, emissiveIntensity: 0.72, roughness: 0.2 })
);
moonOrb.position.set(-190, 165, 200);
moonOrb.visible = false;
scene.add(moonOrb);

const moonLight = new THREE.DirectionalLight(0xd8e7ff, 0.58);
moonLight.position.set(-120, 220, -80);
moonLight.castShadow = true;
moonLight.shadow.mapSize.set(1024, 1024);
moonLight.shadow.camera.left = -360;
moonLight.shadow.camera.right = 360;
moonLight.shadow.camera.top = 360;
moonLight.shadow.camera.bottom = -360;
moonLight.shadow.camera.near = 10;
moonLight.shadow.camera.far = 900;
moonLight.shadow.bias = -0.00035;
moonLight.shadow.normalBias = 0.03;
moonLight.shadow.camera.updateProjectionMatrix();
moonLight.target.position.set(0, 0, 0);
moonLight.intensity = 0;
scene.add(moonLight);
scene.add(moonLight.target);

const CELESTIAL_ORBIT_RADIUS = 320;
const CELESTIAL_BASE_Y = 64;
const CELESTIAL_HEIGHT = 226;
const CELESTIAL_Z_SWAY = 210;

function getCelestialPositionFromProgress(progress) {
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  const azimuth = clamped * Math.PI - Math.PI / 2;
  return {
    x: Math.sin(azimuth) * CELESTIAL_ORBIT_RADIUS,
    y: CELESTIAL_BASE_Y + Math.cos(azimuth) * CELESTIAL_HEIGHT,
    z: -Math.cos(azimuth) * CELESTIAL_Z_SWAY,
  };
}

function updateCelestialBodies() {
  if (worldState.phase === "day") {
    const progress = worldState.dayLength > 0 ? worldState.dayTimer / worldState.dayLength : 0;
    const pos = getCelestialPositionFromProgress(progress);
    daySunOrb.position.set(pos.x, pos.y, pos.z);
    sun.position.set(pos.x, pos.y + 36, pos.z + 34);
    return;
  }

  const progress = worldState.nightLength > 0
    ? (worldState.nightLength - worldState.nightTimer) / worldState.nightLength
    : 0;
  const pos = getCelestialPositionFromProgress(progress);
  moonOrb.position.set(pos.x, pos.y, pos.z);
  moonLight.position.set(pos.x, pos.y + 24, pos.z + 18);
}

function applyPhaseVisuals(phase) {
  if (phase === "day") {
    scene.background = daySkyTexture;
    scene.fog.color.set(0x8ebde6);
    scene.fog.near = 220;
    scene.fog.far = 820;
    hemi.intensity = 1.0;
    hemi.color.set(0xcfeeff);
    hemi.groundColor.set(0x4b7651);
    sun.intensity = 1.02;
    moonLight.intensity = 0;
    daySunOrb.visible = true;
    moonOrb.visible = false;
    return;
  }
  scene.background = nightSkyColor;
  scene.fog.color.set(0x09140f);
  scene.fog.near = 320;
  scene.fog.far = 980;
  hemi.intensity = 0.75;
  hemi.color.set(0xbde6ff);
  hemi.groundColor.set(0x2d5a32);
  sun.intensity = 0.08;
  moonLight.intensity = 0.62;
  daySunOrb.visible = false;
  moonOrb.visible = true;
}

const worldSize = { width: 650, depth: 650 };

const grassBaseTexture = new THREE.TextureLoader().load("assets/Grass_01.png");
grassBaseTexture.colorSpace = THREE.SRGBColorSpace;
grassBaseTexture.wrapS = THREE.RepeatWrapping;
grassBaseTexture.wrapT = THREE.RepeatWrapping;
grassBaseTexture.repeat.set(9, 6);
grassBaseTexture.minFilter = THREE.LinearMipMapLinearFilter;
grassBaseTexture.magFilter = THREE.LinearFilter;
grassBaseTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(worldSize.width, worldSize.depth, 1, 1),
  new THREE.MeshStandardMaterial({
    map: grassBaseTexture,
    color: 0x9fcf95,
    roughness: 1,
    metalness: 0,
  })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const BASE_HQ_RADIUS = 90;
const CAMERA_HQ_STAY_RADIUS = BASE_HQ_RADIUS + 16;
const CAMERA_FOLLOW_DEADZONE = 78;
const CAMERA_FOLLOW_LERP = 4.6;
const BASE_HP_TIERS = [2000, 3000, 4000, 5000];

const base = {
  hp: BASE_HP_TIERS[0],
  maxHp: BASE_HP_TIERS[0],
  radius: BASE_HQ_RADIUS,
};

const baseMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(base.radius, base.radius, 1.6, 48),
  new THREE.MeshStandardMaterial({
    color: 0x2f4463,
    roughness: 0.8,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  })
);
baseMesh.position.set(0, -0.78, 0);
baseMesh.receiveShadow = true;
baseMesh.castShadow = true;
scene.add(baseMesh);

const player = {
  name: "Survivor",
  x: 0,
  z: 34,
  facingYaw: 0,
  desiredFacingYaw: 0,
  dustTimer: 0,
  speed: 170,
  hp: 100,
  maxHp: 100,
  weaponAimTimer: 0,
  shootCooldown: 0,
  fireRate: 0.12,
  damage: 28,
};

const PLAYER_VISUAL_Y = 12;
const PLAYER_FACING_OFFSET = Math.PI;
const PLAYER_TURN_SPEED = 7.6;
const PLAYER_DUST_EMIT_INTERVAL_MIN = 0.022;
const PLAYER_DUST_EMIT_INTERVAL_VARIANCE = 0.014;
const PLAYER_DUST_PUFFS_PER_EMIT = 2;
let playerCharacterModel = null;

const playerMesh = new THREE.Group();
playerMesh.position.set(player.x, PLAYER_VISUAL_Y, player.z);
playerMesh.rotation.y = player.facingYaw + PLAYER_FACING_OFFSET;
scene.add(playerMesh);

const playerFallbackMesh = new THREE.Mesh(
  new THREE.CapsuleGeometry(6, 12, 4, 10),
  new THREE.MeshStandardMaterial({ color: 0xf4c430, roughness: 0.7 })
);
playerFallbackMesh.castShadow = true;
playerMesh.add(playerFallbackMesh);

const playerWeaponMount = new THREE.Group();
playerWeaponMount.position.set(4, 0, -2);
playerWeaponMount.rotation.set(0.18, 0, 0);
playerMesh.add(playerWeaponMount);
function createSpeechBubbleSprite(text) {
  const bubbleCanvas = document.createElement("canvas");
  bubbleCanvas.width = 300;
  bubbleCanvas.height = 120;
  const ctx = bubbleCanvas.getContext("2d");
  ctx.fillStyle = "rgba(10, 14, 20, 0.88)";
  ctx.strokeStyle = "rgba(241, 244, 248, 0.95)";
  ctx.lineWidth = 5;
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(radius, 8);
  ctx.lineTo(bubbleCanvas.width - radius, 8);
  ctx.quadraticCurveTo(bubbleCanvas.width - 8, 8, bubbleCanvas.width - 8, radius);
  ctx.lineTo(bubbleCanvas.width - 8, bubbleCanvas.height - 30 - radius);
  ctx.quadraticCurveTo(bubbleCanvas.width - 8, bubbleCanvas.height - 30 - 8, bubbleCanvas.width - radius, bubbleCanvas.height - 30 - 8);
  ctx.lineTo(170, bubbleCanvas.height - 38);
  ctx.lineTo(150, bubbleCanvas.height - 8);
  ctx.lineTo(130, bubbleCanvas.height - 38);
  ctx.lineTo(radius, bubbleCanvas.height - 38);
  ctx.quadraticCurveTo(8, bubbleCanvas.height - 38, 8, bubbleCanvas.height - 38 - radius);
  ctx.lineTo(8, radius);
  ctx.quadraticCurveTo(8, 8, radius, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.font = "bold 36px Inter, sans-serif";
  ctx.fillStyle = "#f4f7fb";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, bubbleCanvas.width * 0.5, bubbleCanvas.height * 0.42);

  const texture = new THREE.CanvasTexture(bubbleCanvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(18, 7.2, 1);
  return sprite;
}

const playerSpeechBubble = {
  sprite: null,
  timer: 0,
};

const playerAxeMount = new THREE.Group();
playerAxeMount.position.set(4.2, 0.2, -1.6);
playerAxeMount.rotation.y = Math.PI * 0.5;
playerAxeMount.scale.setScalar(2);
playerAxeMount.visible = false;
playerMesh.add(playerAxeMount);

const playerAxeHandle = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.24, 6.2, 10),
  new THREE.MeshStandardMaterial({ color: 0x8b6a46, roughness: 0.82, metalness: 0.08 })
);
playerAxeHandle.castShadow = true;
playerAxeMount.add(playerAxeHandle);

const playerAxeHead = new THREE.Mesh(
  new THREE.BoxGeometry(1.3, 0.9, 0.55),
  new THREE.MeshStandardMaterial({ color: 0x9ca7b4, roughness: 0.42, metalness: 0.68 })
);
playerAxeHead.position.set(0.72, 2.55, 0);
playerAxeHead.castShadow = true;
playerAxeMount.add(playerAxeHead);

const playerPickSpike = new THREE.Mesh(
  new THREE.ConeGeometry(0.24, 1.4, 10),
  new THREE.MeshStandardMaterial({ color: 0xaab3be, roughness: 0.4, metalness: 0.7 })
);
playerPickSpike.rotation.z = Math.PI * 0.5;
playerPickSpike.position.set(-0.85, 2.55, 0);
playerPickSpike.castShadow = true;
playerAxeMount.add(playerPickSpike);

const carriedLogsMount = new THREE.Group();
carriedLogsMount.position.set(-4.8, 2.4, 1.8);
playerMesh.add(carriedLogsMount);

const PLAYER_WEAPON_MOUNT_BASE_X = 4;
const PLAYER_WEAPON_MOUNT_BASE_Y = 0;
const PLAYER_WEAPON_MOUNT_BASE_Z = -2;
const PLAYER_MUZZLE_FLASH_MOUNT_OFFSET = [1, 0.35, 6];
const PLAYER_WEAPON_IDLE_PITCH = 0;
const PLAYER_WEAPON_AIM_PITCH = -1.7;
const PLAYER_WEAPON_IDLE_YAW = 0;
const PLAYER_WEAPON_AIM_HOLD = 1;
const PLAYER_WEAPON_RECOIL_KICK = 0.7;
const PLAYER_WEAPON_RECOIL_MAX = 1.2;
const PLAYER_WEAPON_RECOIL_RECOVERY = 14;
let playerWeaponRecoil = 0;
const playerMuzzleFlashWorldPos = new THREE.Vector3();
const turretMuzzleWorldPos = new THREE.Vector3();
const MAX_CARRIED_LOGS = 20;
const HARVEST_TREE_MAX_GROWTH_STAGE = 5;
const HARVEST_TREE_COUNT = 0;
const HARVEST_TREE_INTERACT_RANGE = 22;
const HARVEST_TREE_AXE_RANGE = 28;
const HARVEST_TREE_MIN_ACTIVE = 10;
const HARVEST_EXTRA_TREES_PER_DAY = 2;
const HARVEST_LOG_PICKUP_RANGE = 11;
const HARVEST_TREE_PROJECTILE_HITBOX_RADIUS = 6;
const HARVEST_TREE_PROJECTILE_FALL_DAMAGE = 4;
const HARVEST_LOG_MAGNET_RANGE = 38;
const HARVEST_LOG_MAGNET_SPEED = 115;
const HARVEST_LOG_DESPAWN_CYCLES = 4;
const HARVEST_STONE_MAX_GROWTH_STAGE = 5;
const HARVEST_STONE_AXE_RANGE = 28;
const HARVEST_STONE_MIN_ACTIVE = 8;
const HARVEST_EXTRA_STONES_PER_DAY = 2;
const CREDIT_PICKUP_MAGNET_RANGE = 54;
const CREDIT_PICKUP_COLLECT_RANGE = 4.6;
const CREDIT_PICKUP_MAGNET_SPEED = 140;
const BREACH_WOOD_REPAIR_COST = 150;
const BREACH_BUNKER_MAX_HP = 500;

const playerAxeState = {
  equipped: false,
  swingTimer: 0,
  swingDuration: 0.22,
  autoChopCooldown: 0,
  autoMineCooldown: 0,
  fullAlertCooldown: 0,
};

const ULT_BUNKER_POSITION = { x: 0, z: 0 };
const ULT_BUNKER_HOUSE_RADIUS = 16;
const ULT_BUNKER_HOUSE_HEIGHT = 18;
const ULT_BUNKER_COLLISION_RADIUS = 15;
const ULT_BUNKER_ENTRY_POINT = { x: 0, z: ULT_BUNKER_HOUSE_RADIUS + 2.8 };
const ULT_BUNKER_DEPTH_Y = -9.5;
const ULT_BUNKER_MOVE_TO_HATCH_DURATION = 0.38;
const ULT_BUNKER_DESCEND_DURATION = 0.88;
const ULT_BUNKER_ARMING_DURATION = 0.45;
const ULT_BUNKER_ASCEND_DURATION = 0.82;
const ULT_BUNKER_RETURN_DURATION = 0.42;
const ULT_BUNKER_CLOSE_DURATION = 0.34;

const ultimateBunkerSequence = {
  active: false,
  phase: "idle",
  phaseTime: 0,
  startX: 0,
  startZ: 0,
  startYaw: 0,
  blastX: 0,
  blastZ: 0,
  hasDetonated: false,
};

function createUltimateBunkerHatch() {
  const group = new THREE.Group();
  group.position.set(ULT_BUNKER_POSITION.x, 0, ULT_BUNKER_POSITION.z);

  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(ULT_BUNKER_HOUSE_RADIUS, ULT_BUNKER_HOUSE_RADIUS, ULT_BUNKER_HOUSE_HEIGHT, 40),
    new THREE.MeshStandardMaterial({ color: 0x5a6069, roughness: 0.78, metalness: 0.38 })
  );
  shell.position.y = ULT_BUNKER_HOUSE_HEIGHT * 0.5;
  shell.castShadow = true;
  shell.receiveShadow = true;
  group.add(shell);

  const roof = new THREE.Mesh(
    new THREE.CylinderGeometry(ULT_BUNKER_HOUSE_RADIUS + 0.8, ULT_BUNKER_HOUSE_RADIUS + 0.8, 0.72, 40),
    new THREE.MeshStandardMaterial({ color: 0x6a727d, roughness: 0.58, metalness: 0.52 })
  );
  roof.position.y = ULT_BUNKER_HOUSE_HEIGHT + 0.36;
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);

  const trim = new THREE.Mesh(
    new THREE.TorusGeometry(ULT_BUNKER_HOUSE_RADIUS + 0.2, 0.4, 12, 48),
    new THREE.MeshStandardMaterial({ color: 0x8f98a3, roughness: 0.45, metalness: 0.56 })
  );
  trim.rotation.x = Math.PI / 2;
  trim.position.y = ULT_BUNKER_HOUSE_HEIGHT + 0.54;
  trim.castShadow = true;
  group.add(trim);

  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(10, 16.4, 1.1),
    new THREE.MeshStandardMaterial({ color: 0x3b424b, roughness: 0.7, metalness: 0.36 })
  );
  doorFrame.position.set(0, 8.2, ULT_BUNKER_HOUSE_RADIUS - 0.38);
  doorFrame.castShadow = true;
  doorFrame.receiveShadow = true;
  group.add(doorFrame);

  const doorPivot = new THREE.Group();
  doorPivot.position.set(-3.9, 8.2, ULT_BUNKER_HOUSE_RADIUS + 0.14);
  group.add(doorPivot);

  const doorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(7.8, 15, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x7f8894, roughness: 0.52, metalness: 0.54 })
  );
  doorPanel.position.set(3.9, 0, 0);
  doorPanel.castShadow = true;
  doorPanel.receiveShadow = true;
  doorPivot.add(doorPanel);

  const wheelHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.34, 16),
    new THREE.MeshStandardMaterial({ color: 0xa6b0bc, roughness: 0.35, metalness: 0.72 })
  );
  wheelHub.rotation.x = Math.PI / 2;
  wheelHub.position.set(4.1, 0.6, 0.55);
  doorPivot.add(wheelHub);

  const wheelGroup = new THREE.Group();
  wheelGroup.position.set(4.1, 0.6, 0.78);
  doorPivot.add(wheelGroup);

  const wheelRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.11, 10, 24),
    new THREE.MeshStandardMaterial({ color: 0xabb5c1, roughness: 0.34, metalness: 0.75 })
  );
  wheelGroup.add(wheelRing);

  const spokeMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c8d2, roughness: 0.36, metalness: 0.72 });
  for (let index = 0; index < 6; index += 1) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.62, 10), spokeMaterial);
    spoke.rotation.z = Math.PI * 0.5;
    spoke.rotation.y = (Math.PI * 2 * index) / 6;
    wheelGroup.add(spoke);
  }

  const hatchGlow = new THREE.Mesh(
    new THREE.CircleGeometry(2, 24),
    new THREE.MeshBasicMaterial({ color: 0xb9e6ff, transparent: true, opacity: 0.12, depthWrite: false })
  );
  hatchGlow.position.set(0, 10.6, ULT_BUNKER_HOUSE_RADIUS - 0.28);
  group.add(hatchGlow);

  return {
    group,
    doorPivot,
    wheelGroup,
    hatchGlow,
  };
}

const ultimateBunkerHatch = createUltimateBunkerHatch();
scene.add(ultimateBunkerHatch.group);

const breachSirenLight = new THREE.PointLight(0xff3344, 0, 120, 2);
breachSirenLight.position.set(ULT_BUNKER_POSITION.x, ULT_BUNKER_HOUSE_HEIGHT + 9, ULT_BUNKER_POSITION.z);
scene.add(breachSirenLight);

function createBreachSirenBeacon() {
  const group = new THREE.Group();
  group.position.set(
    ULT_BUNKER_POSITION.x,
    ULT_BUNKER_HOUSE_HEIGHT + 6.8,
    ULT_BUNKER_POSITION.z + ULT_BUNKER_HOUSE_RADIUS - 0.45
  );

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.85, 0.52, 16),
    new THREE.MeshStandardMaterial({ color: 0x3b4048, roughness: 0.42, metalness: 0.78 })
  );
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const rotator = new THREE.Group();
  rotator.position.y = 0.42;
  group.add(rotator);

  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.18, 0.62),
    new THREE.MeshStandardMaterial({ color: 0x9aa3b0, roughness: 0.32, metalness: 0.88 })
  );
  bar.castShadow = true;
  rotator.add(bar);

  const redLensMat = new THREE.MeshStandardMaterial({
    color: 0xff4040,
    emissive: 0x3b0606,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.94,
    roughness: 0.22,
    metalness: 0.12,
  });
  const blueLensMat = new THREE.MeshStandardMaterial({
    color: 0x3d68ff,
    emissive: 0x07113b,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.94,
    roughness: 0.22,
    metalness: 0.12,
  });

  const redLens = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 12), redLensMat);
  redLens.scale.set(1, 0.7, 1);
  redLens.position.set(-1.02, 0.34, 0);
  redLens.castShadow = true;
  rotator.add(redLens);

  const blueLens = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 12), blueLensMat);
  blueLens.scale.set(1, 0.7, 1);
  blueLens.position.set(1.02, 0.34, 0);
  blueLens.castShadow = true;
  rotator.add(blueLens);

  return { group, rotator, redLensMat, blueLensMat };
}

const breachSirenBeacon = createBreachSirenBeacon();
scene.add(breachSirenBeacon.group);

function setUltimateBunkerHatchOpen(openAmount) {
  const open = THREE.MathUtils.clamp(openAmount, 0, 1);
  ultimateBunkerHatch.doorPivot.rotation.y = -open * 1.05;
  ultimateBunkerHatch.wheelGroup.rotation.z = open * Math.PI * 2.6;
  ultimateBunkerHatch.hatchGlow.material.opacity = 0.12 + open * 0.24;
}

function easeInOut(t) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function applyUltimateDamageAt(x, z) {
  spawnUltimateWave(x, z, worldState.ultimate.radius);
  for (let index = enemies.length - 1; index >= 0; index -= 1) {
    const enemy = enemies[index];
    const dx = enemy.x - x;
    const dz = enemy.z - z;
    if (Math.hypot(dx, dz) <= worldState.ultimate.radius + getEnemyHitRadius(enemy)) {
      enemy.hp -= worldState.ultimate.damage;
      if (enemy.hp <= 0) {
        removeEnemy(enemy);
      }
    }
  }
}

function resetUltimateBunkerSequence() {
  ultimateBunkerSequence.active = false;
  ultimateBunkerSequence.phase = "idle";
  ultimateBunkerSequence.phaseTime = 0;
  ultimateBunkerSequence.hasDetonated = false;
  setUltimateBunkerHatchOpen(0);
}

function updateUltimateBunkerSequence(dt) {
  if (!ultimateBunkerSequence.active) {
    return;
  }

  const seq = ultimateBunkerSequence;
  seq.phaseTime += dt;

  if (seq.phase === "moveToHatch") {
    const t = easeInOut(seq.phaseTime / ULT_BUNKER_MOVE_TO_HATCH_DURATION);
    player.x = THREE.MathUtils.lerp(seq.startX, ULT_BUNKER_ENTRY_POINT.x, t);
    player.z = THREE.MathUtils.lerp(seq.startZ, ULT_BUNKER_ENTRY_POINT.z, t);
    playerMesh.position.set(player.x, PLAYER_VISUAL_Y, player.z);
    setUltimateBunkerHatchOpen(t);

    const moveDirX = ULT_BUNKER_POSITION.x - ULT_BUNKER_ENTRY_POINT.x;
    const moveDirZ = ULT_BUNKER_POSITION.z - ULT_BUNKER_ENTRY_POINT.z;
    if (Math.hypot(moveDirX, moveDirZ) > 0.01) {
      player.facingYaw = Math.atan2(moveDirX, moveDirZ);
      player.desiredFacingYaw = player.facingYaw;
      playerMesh.rotation.y = player.facingYaw + PLAYER_FACING_OFFSET;
    }

    if (seq.phaseTime >= ULT_BUNKER_MOVE_TO_HATCH_DURATION) {
      seq.phase = "descend";
      seq.phaseTime = 0;
    }
    return;
  }

  if (seq.phase === "descend") {
    const t = easeInOut(seq.phaseTime / ULT_BUNKER_DESCEND_DURATION);
    const y = THREE.MathUtils.lerp(PLAYER_VISUAL_Y, ULT_BUNKER_DEPTH_Y, t);
    player.x = ULT_BUNKER_ENTRY_POINT.x;
    player.z = ULT_BUNKER_ENTRY_POINT.z;
    playerMesh.position.set(player.x, y, player.z);
    setUltimateBunkerHatchOpen(1);

    if (seq.phaseTime >= ULT_BUNKER_DESCEND_DURATION) {
      seq.phase = "arming";
      seq.phaseTime = 0;
    }
    return;
  }

  if (seq.phase === "arming") {
    playerMesh.position.set(ULT_BUNKER_ENTRY_POINT.x, ULT_BUNKER_DEPTH_Y, ULT_BUNKER_ENTRY_POINT.z);
    setUltimateBunkerHatchOpen(1);

    if (!seq.hasDetonated && seq.phaseTime >= ULT_BUNKER_ARMING_DURATION * 0.55) {
      seq.hasDetonated = true;
      applyUltimateDamageAt(seq.blastX, seq.blastZ);
    }

    if (seq.phaseTime >= ULT_BUNKER_ARMING_DURATION) {
      seq.phase = "ascend";
      seq.phaseTime = 0;
    }
    return;
  }

  if (seq.phase === "ascend") {
    const t = easeInOut(seq.phaseTime / ULT_BUNKER_ASCEND_DURATION);
    const y = THREE.MathUtils.lerp(ULT_BUNKER_DEPTH_Y, PLAYER_VISUAL_Y, t);
    player.x = ULT_BUNKER_ENTRY_POINT.x;
    player.z = ULT_BUNKER_ENTRY_POINT.z;
    playerMesh.position.set(player.x, y, player.z);
    setUltimateBunkerHatchOpen(1);

    if (seq.phaseTime >= ULT_BUNKER_ASCEND_DURATION) {
      seq.phase = "returnFromHatch";
      seq.phaseTime = 0;
    }
    return;
  }

  if (seq.phase === "returnFromHatch") {
    const t = easeInOut(seq.phaseTime / ULT_BUNKER_RETURN_DURATION);
    player.x = THREE.MathUtils.lerp(ULT_BUNKER_ENTRY_POINT.x, seq.startX, t);
    player.z = THREE.MathUtils.lerp(ULT_BUNKER_ENTRY_POINT.z, seq.startZ, t);
    playerMesh.position.set(player.x, PLAYER_VISUAL_Y, player.z);
    setUltimateBunkerHatchOpen(1 - t * 0.8);

    if (seq.phaseTime >= ULT_BUNKER_RETURN_DURATION) {
      seq.phase = "closeHatch";
      seq.phaseTime = 0;
      player.facingYaw = seq.startYaw;
      player.desiredFacingYaw = seq.startYaw;
      playerMesh.rotation.y = player.facingYaw + PLAYER_FACING_OFFSET;
    }
    return;
  }

  if (seq.phase === "closeHatch") {
    const t = easeInOut(seq.phaseTime / ULT_BUNKER_CLOSE_DURATION);
    setUltimateBunkerHatchOpen(0.2 * (1 - t));

    if (seq.phaseTime >= ULT_BUNKER_CLOSE_DURATION) {
      resetUltimateBunkerSequence();
    }
  }
}

const turretSlots = [
  { x: 0, z: -68, label: "Top" },
  { x: -68, z: 0, label: "Left" },
  { x: 68, z: 0, label: "Right" },
  { x: 0, z: 68, label: "Bottom" },
  { x: 0, z: 0, label: "Middle" },
];

const turretSlotYawByLabel = {
  Top: -Math.PI / 2,
  Right: 0,
  Bottom: Math.PI / 2,
  Left: Math.PI,
  Middle: -Math.PI / 2,
};

const turretLevel4Texture = new THREE.TextureLoader().load("assets/turret level 4.png");
turretLevel4Texture.colorSpace = THREE.SRGBColorSpace;
turretLevel4Texture.minFilter = THREE.LinearFilter;
turretLevel4Texture.magFilter = THREE.LinearFilter;

const zombieSplatterTexture = new THREE.TextureLoader().load("assets/splatter-svgrepo-com.svg");
zombieSplatterTexture.colorSpace = THREE.SRGBColorSpace;
zombieSplatterTexture.minFilter = THREE.LinearFilter;
zombieSplatterTexture.magFilter = THREE.LinearFilter;

const muzzleFlashTexture = new THREE.TextureLoader().load("assets/muzzleflash1.png");
muzzleFlashTexture.colorSpace = THREE.SRGBColorSpace;
muzzleFlashTexture.minFilter = THREE.LinearFilter;
muzzleFlashTexture.magFilter = THREE.LinearFilter;

const TURRET_COLOR_GUNMETAL = 0x4a5462;
const TURRET_COLOR_STEEL = 0x717c89;
const TURRET_COLOR_LIGHT_STEEL = 0xa4afba;
const TURRET_COLOR_DARK_STEEL = 0x2f3945;
const TURRET_COLOR_CAMO = 0x5f7360;
const TURRET_COLOR_CAMO_DARK = 0x4e614f;

function createLevel1TurretMesh() {
  const turretGroup = new THREE.Group();

  const baseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9, 4, 6),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_GUNMETAL, roughness: 0.5, metalness: 0.48 })
  );
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  turretGroup.add(baseMesh);

  const coreMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 4.8, 2.8, 20),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO_DARK, roughness: 0.58, metalness: 0.22 })
  );
  coreMesh.position.y = 1.5;
  coreMesh.castShadow = true;
  turretGroup.add(coreMesh);

  const domeMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4.95, 26, 20),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.5, metalness: 0.34 })
  );
  domeMesh.scale.y = 0.72;
  domeMesh.position.y = 3.15;
  domeMesh.castShadow = true;
  domeMesh.receiveShadow = true;
  turretGroup.add(domeMesh);

  const recoilGroup = new THREE.Group();
  turretGroup.add(recoilGroup);

  const neckMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.8, 1.7),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.48, metalness: 0.42 })
  );
  neckMesh.position.set(0, 1.25, -5.1);
  recoilGroup.add(neckMesh);

  const barrelShroud = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.12, 10.8, 16),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.45, metalness: 0.5 })
  );
  barrelShroud.rotation.x = Math.PI / 2;
  barrelShroud.position.set(0, 1.45, -10.6);
  barrelShroud.castShadow = true;
  recoilGroup.add(barrelShroud);

  const barrelCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 13.4, 14),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_DARK_STEEL, roughness: 0.4, metalness: 0.62 })
  );
  barrelCore.rotation.x = Math.PI / 2;
  barrelCore.position.set(0, 1.45, -11.7);
  barrelCore.castShadow = true;
  recoilGroup.add(barrelCore);

  const muzzleTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.42, metalness: 0.55 })
  );
  muzzleTip.rotation.x = Math.PI / 2;
  muzzleTip.position.set(0, 1.45, -18.2);
  muzzleTip.castShadow = true;
  recoilGroup.add(muzzleTip);

  const railGeometry = new THREE.BoxGeometry(0.46, 0.36, 6.8);
  const railMaterial = new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.45, metalness: 0.5 });
  const railLeft = new THREE.Mesh(railGeometry, railMaterial);
  railLeft.position.set(-1.0, 2.35, -10.8);
  recoilGroup.add(railLeft);

  const railRight = new THREE.Mesh(railGeometry, railMaterial);
  railRight.position.set(1.0, 2.35, -10.8);
  recoilGroup.add(railRight);

  turretGroup.userData.recoilMesh = recoilGroup;
  turretGroup.userData.recoilBaseZ = 0;

  return turretGroup;
}

function createLevel2TurretMesh() {
  const turretGroup = createLevel1TurretMesh();
  const recoilGroup = turretGroup.userData.recoilMesh || turretGroup;

  const reinforcedDome = new THREE.Mesh(
    new THREE.SphereGeometry(5.35, 28, 22),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.44, metalness: 0.48 })
  );
  reinforcedDome.scale.y = 0.68;
  reinforcedDome.position.y = 3.55;
  reinforcedDome.castShadow = true;
  reinforcedDome.receiveShadow = true;
  turretGroup.add(reinforcedDome);

  const heavyBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.58, 1.58, 13.8, 18),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_GUNMETAL, roughness: 0.44, metalness: 0.58 })
  );
  heavyBarrel.rotation.x = Math.PI / 2;
  heavyBarrel.position.set(0, 1.45, -12.3);
  heavyBarrel.castShadow = true;
  recoilGroup.add(heavyBarrel);

  const heavyMuzzle = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.02, 1.8, 14),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.4, metalness: 0.6 })
  );
  heavyMuzzle.rotation.x = Math.PI / 2;
  heavyMuzzle.position.set(0, 1.45, -19.0);
  heavyMuzzle.castShadow = true;
  recoilGroup.add(heavyMuzzle);

  turretGroup.userData.recoilMesh = recoilGroup;
  turretGroup.userData.recoilBaseZ = 0;

  return turretGroup;
}

function createLevel3TurretMesh() {
  const turretGroup = new THREE.Group();

  const baseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(10.4, 10.4, 4.4, 8),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO, roughness: 0.56, metalness: 0.2 })
  );
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  turretGroup.add(baseMesh);

  const turretBody = new THREE.Mesh(
    new THREE.BoxGeometry(9.4, 3.0, 8.8),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_GUNMETAL, roughness: 0.5, metalness: 0.42 })
  );
  turretBody.position.set(0, 2.3, -2.8);
  turretBody.castShadow = true;
  turretGroup.add(turretBody);

  const recoilGroup = new THREE.Group();
  recoilGroup.position.set(0, 2.2, -9.6);
  turretGroup.add(recoilGroup);

  const barrelOffset = 1.8;
  [-barrelOffset, barrelOffset].forEach((offsetX) => {
    const barrelShell = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 10.8, 14),
      new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.44, metalness: 0.52 })
    );
    barrelShell.rotation.x = Math.PI / 2;
    barrelShell.position.set(offsetX, 0.2, -2.0);
    barrelShell.castShadow = true;
    recoilGroup.add(barrelShell);

    const barrelCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.54, 0.54, 12.8, 12),
      new THREE.MeshStandardMaterial({ color: TURRET_COLOR_DARK_STEEL, roughness: 0.4, metalness: 0.62 })
    );
    barrelCore.rotation.x = Math.PI / 2;
    barrelCore.position.set(offsetX, 0.2, -3.0);
    barrelCore.castShadow = true;
    recoilGroup.add(barrelCore);
  });

  const rearBlock = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 2.3, 2.6),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO_DARK, roughness: 0.56, metalness: 0.2 })
  );
  rearBlock.position.set(0, 1.9, 1.6);
  turretGroup.add(rearBlock);

  turretGroup.userData.recoilMesh = recoilGroup;
  turretGroup.userData.recoilBaseZ = -9.6;

  return turretGroup;
}

function createLevel4TurretMesh() {
  const turretGroup = new THREE.Group();

  const baseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(11.4, 11.4, 4.8, 12),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO, roughness: 0.56, metalness: 0.2 })
  );
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  turretGroup.add(baseMesh);

  const bodyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(12.4, 3.6, 11.4),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_GUNMETAL, roughness: 0.5, metalness: 0.42 })
  );
  bodyMesh.position.set(0, 2.9, -1.2);
  bodyMesh.castShadow = true;
  turretGroup.add(bodyMesh);

  const sidePlateGeometry = new THREE.BoxGeometry(1.4, 2.4, 7.8);
  const sidePlateMaterial = new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO_DARK, roughness: 0.56, metalness: 0.24 });
  const sideLeft = new THREE.Mesh(sidePlateGeometry, sidePlateMaterial);
  sideLeft.position.set(-5.0, 2.7, -3.2);
  sideLeft.castShadow = true;
  turretGroup.add(sideLeft);

  const sideRight = sideLeft.clone();
  sideRight.position.x = 5.0;
  turretGroup.add(sideRight);

  const texturePlate = new THREE.Mesh(
    new THREE.PlaneGeometry(19, 19),
    new THREE.MeshBasicMaterial({
      map: turretLevel4Texture,
      transparent: true,
      alphaTest: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  texturePlate.rotation.x = -Math.PI / 2;
  texturePlate.position.set(0, 4.95, -0.5);
  turretGroup.add(texturePlate);

  const barrelHousing = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 2.6, 5.8),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.44, metalness: 0.5 })
  );
  barrelHousing.position.set(0, 3.1, -8.4);
  barrelHousing.castShadow = true;
  turretGroup.add(barrelHousing);

  const cannonAssembly = new THREE.Group();
  cannonAssembly.position.set(0, 2.9, -12.8);
  turretGroup.add(cannonAssembly);

  const cannonSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.7, 7.6, 16),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.42, metalness: 0.56 })
  );
  cannonSleeve.rotation.x = Math.PI / 2;
  cannonSleeve.position.set(0, 0, -1.0);
  cannonSleeve.castShadow = true;
  cannonAssembly.add(cannonSleeve);

  const cannonCore = new THREE.Mesh(
    new THREE.CylinderGeometry(1.08, 1.08, 15.8, 18),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_DARK_STEEL, roughness: 0.38, metalness: 0.66 })
  );
  cannonCore.rotation.x = Math.PI / 2;
  cannonCore.position.set(0, 0, -5.2);
  cannonCore.castShadow = true;
  cannonAssembly.add(cannonCore);

  const muzzle = new THREE.Mesh(
    new THREE.CylinderGeometry(1.26, 1.26, 2.3, 16),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.38, metalness: 0.64 })
  );
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, 0, -13.1);
  muzzle.castShadow = true;
  cannonAssembly.add(muzzle);

  turretGroup.userData.recoilMesh = cannonAssembly;
  turretGroup.userData.recoilBaseZ = -12.8;

  return turretGroup;
}

function createLevel5TurretMesh() {
  const turretGroup = createLevel4TurretMesh();

  const topMount = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 1.2, 4.6),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO_DARK, roughness: 0.56, metalness: 0.2 })
  );
  topMount.position.set(0, 6.0, -0.8);
  topMount.castShadow = true;
  turretGroup.add(topMount);

  const topGun = new THREE.Group();
  topGun.position.set(0, 6.2, -4.2);
  turretGroup.add(topGun);

  const gunBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.1, 4.8),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.44, metalness: 0.54 })
  );
  gunBody.castShadow = true;
  topGun.add(gunBody);

  const gunBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 8.4, 10),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_DARK_STEEL, roughness: 0.38, metalness: 0.64 })
  );
  gunBarrel.rotation.x = Math.PI / 2;
  gunBarrel.position.set(0, 0, -5.8);
  gunBarrel.castShadow = true;
  topGun.add(gunBarrel);

  turretGroup.userData.mountedRotator = topGun;

  return turretGroup;
}

function createLevel6TurretMesh() {
  const turretGroup = createLevel5TurretMesh();

  const flakTopMount = new THREE.Mesh(
    new THREE.BoxGeometry(6.2, 1.2, 4.8),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO_DARK, roughness: 0.56, metalness: 0.2 })
  );
  flakTopMount.position.set(0, 8.0, -1.2);
  flakTopMount.castShadow = true;
  turretGroup.add(flakTopMount);

  const topFlakGroup = new THREE.Group();
  topFlakGroup.position.set(0, 8.1, -5.6);
  turretGroup.add(topFlakGroup);

  [-1.25, 1.25].forEach((offsetX) => {
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 7.6, 10),
      new THREE.MeshStandardMaterial({ color: TURRET_COLOR_DARK_STEEL, roughness: 0.38, metalness: 0.64 })
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(offsetX, 0, -3.8);
    barrel.castShadow = true;
    topFlakGroup.add(barrel);
  });

  turretGroup.userData.mountedRotator = topFlakGroup;

  return turretGroup;
}

const turrets = turretSlots.map((slot) => {
  const isMiddleSlot = slot.label === "Middle";
  const turretBaseY = isMiddleSlot ? ULT_BUNKER_HOUSE_HEIGHT + 1.45 : 1.8;
  const turretLevelY = isMiddleSlot ? ULT_BUNKER_HOUSE_HEIGHT + 3.65 : 4.0;
  const turretBaseRadius = isMiddleSlot ? ULT_BUNKER_HOUSE_RADIUS : 14.8;

  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(turretBaseRadius, turretBaseRadius, 2.4, 24),
    new THREE.MeshStandardMaterial({ color: 0x8d97a6, roughness: 0.44, metalness: 0.62 })
  );
  mesh.position.set(slot.x, turretBaseY, slot.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  const level1Mesh = createLevel1TurretMesh();
  level1Mesh.position.set(slot.x, turretLevelY, slot.z);
  level1Mesh.visible = false;
  scene.add(level1Mesh);

  const level2Mesh = createLevel2TurretMesh();
  level2Mesh.position.set(slot.x, turretLevelY, slot.z);
  level2Mesh.visible = false;
  scene.add(level2Mesh);

  const level3Mesh = createLevel3TurretMesh();
  level3Mesh.position.set(slot.x, turretLevelY, slot.z);
  level3Mesh.visible = false;
  scene.add(level3Mesh);

  const level4Mesh = createLevel4TurretMesh();
  level4Mesh.position.set(slot.x, turretLevelY, slot.z);
  level4Mesh.visible = false;
  scene.add(level4Mesh);

  const level5Mesh = createLevel5TurretMesh();
  level5Mesh.position.set(slot.x, turretLevelY, slot.z);
  level5Mesh.visible = false;
  scene.add(level5Mesh);

  const level6Mesh = createLevel6TurretMesh();
  level6Mesh.position.set(slot.x, turretLevelY, slot.z);
  level6Mesh.visible = false;
  scene.add(level6Mesh);

  return {
    ...slot,
    level: 1,
    destroyed: false,
    destroyedLevel: 1,
    cooldown: Math.random() * 0.3,
    mountedCooldown: Math.random() * 0.2,
    fireRate: 0.21,
    range: 170,
    damage: 12,
    turretRecoil: 0,
    aimYaw: turretSlotYawByLabel[slot.label] ?? -Math.PI / 2,
    mountedAimYaw: turretSlotYawByLabel[slot.label] ?? -Math.PI / 2,
    mesh,
    level1Mesh,
    level2Mesh,
    level3Mesh,
    level4Mesh,
    level5Mesh,
    level6Mesh,
  };
});

function getActiveTurretMesh(turret) {
  if (!turret.owned || turret.level <= 0) {
    return turret.mesh;
  }
  if (turret.level === 1) {
    return turret.level1Mesh;
  }
  if (turret.level === 2) {
    return turret.level2Mesh;
  }
  if (turret.level === 3) {
    return turret.level3Mesh;
  }
  if (turret.level === 4) {
    return turret.level4Mesh;
  }
  if (turret.level === 5) {
    return turret.level5Mesh;
  }
  if (turret.level >= 6) {
    return turret.level6Mesh;
  }
  return turret.mesh;
}

function syncTurretVisualState(turret) {
  const showLevel1 = turret.owned && turret.level === 1;
  const showLevel2 = turret.owned && turret.level === 2;
  const showLevel3 = turret.owned && turret.level === 3;
  const showLevel4 = turret.owned && turret.level === 4;
  const showLevel5 = turret.owned && turret.level === 5;
  const showLevel6 = turret.owned && turret.level >= 6;
  turret.level1Mesh.visible = showLevel1;
  turret.level2Mesh.visible = showLevel2;
  turret.level3Mesh.visible = showLevel3;
  turret.level4Mesh.visible = showLevel4;
  turret.level5Mesh.visible = showLevel5;
  turret.level6Mesh.visible = showLevel6;
  turret.mesh.visible = true;
}

function setMeshDestroyedMaterialStyle(root, destroyed) {
  root?.traverse?.((node) => {
    if (!node.isMesh || !node.material) {
      return;
    }
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((material) => {
      if (!material || typeof material !== "object") {
        return;
      }
      if (!material.userData.__turretOriginalStyle) {
        material.userData.__turretOriginalStyle = {
          hasColor: !!material.color,
          color: material.color ? material.color.clone() : null,
          hasEmissive: !!material.emissive,
          emissive: material.emissive ? material.emissive.clone() : null,
          roughness: typeof material.roughness === "number" ? material.roughness : null,
          metalness: typeof material.metalness === "number" ? material.metalness : null,
        };
      }
      const original = material.userData.__turretOriginalStyle;
      if (!original) {
        return;
      }

      if (destroyed) {
        if (original.hasColor && material.color) {
          material.color.copy(original.color).multiplyScalar(0.14);
        }
        if (original.hasEmissive && material.emissive) {
          material.emissive.setHex(0x050505);
        }
        if (typeof original.roughness === "number") {
          material.roughness = Math.max(original.roughness, 0.95);
        }
        if (typeof original.metalness === "number") {
          material.metalness = Math.min(original.metalness, 0.18);
        }
      } else {
        if (original.hasColor && material.color) {
          material.color.copy(original.color);
        }
        if (original.hasEmissive && material.emissive) {
          material.emissive.copy(original.emissive);
        }
        if (typeof original.roughness === "number") {
          material.roughness = original.roughness;
        }
        if (typeof original.metalness === "number") {
          material.metalness = original.metalness;
        }
      }
      material.needsUpdate = true;
    });
  });
}

function setMeshDestroyedPose(mesh, destroyed, tiltX, tiltZ, squashY) {
  if (!mesh) {
    return;
  }
  if (!mesh.userData.__turretOriginalPose) {
    mesh.userData.__turretOriginalPose = {
      rotationX: mesh.rotation.x,
      rotationY: mesh.rotation.y,
      rotationZ: mesh.rotation.z,
      scaleX: mesh.scale.x,
      scaleY: mesh.scale.y,
      scaleZ: mesh.scale.z,
    };
  }
  const original = mesh.userData.__turretOriginalPose;
  if (destroyed) {
    mesh.rotation.x = original.rotationX + tiltX;
    mesh.rotation.z = original.rotationZ + tiltZ;
    mesh.scale.set(original.scaleX * 1.03, original.scaleY * squashY, original.scaleZ * 0.97);
  } else {
    mesh.rotation.set(original.rotationX, original.rotationY, original.rotationZ);
    mesh.scale.set(original.scaleX, original.scaleY, original.scaleZ);
  }
}

function setTurretDestroyedVisualState(turret, destroyed) {
  const allMeshes = [
    turret.mesh,
    turret.level1Mesh,
    turret.level2Mesh,
    turret.level3Mesh,
    turret.level4Mesh,
    turret.level5Mesh,
    turret.level6Mesh,
  ];
  allMeshes.forEach((mesh) => {
    setMeshDestroyedMaterialStyle(mesh, destroyed);
  });

  const idPhase = (turret.id || 0) + 1;
  const tiltX = 0.08 + (idPhase % 3) * 0.02;
  const tiltZ = ((idPhase % 2 === 0) ? -1 : 1) * (0.09 + (idPhase % 4) * 0.015);
  const squashY = 0.83;
  setMeshDestroyedPose(turret.mesh, destroyed, tiltX, tiltZ, squashY);
  setMeshDestroyedPose(getActiveTurretMesh(turret), destroyed, tiltX * 0.65, tiltZ * 0.5, 0.9);
}

function applyTurretRecoilVisual(turret) {
  const activeMesh = getActiveTurretMesh(turret);
  const recoilMesh = activeMesh?.userData?.recoilMesh;
  if (!recoilMesh) {
    return;
  }
  const baseZ = activeMesh.userData.recoilBaseZ ?? recoilMesh.position.z;
  recoilMesh.position.z = baseZ + (turret.turretRecoil || 0);
}

const enemies = [];
const bullets = [];
const turretBullets = [];
const impactEffects = [];
const cannonScorchMarks = [];
const enemyDeathEffects = [];
const zombieSplatters = [];
const muzzleFlashes = [];
const creepDustPuffs = [];
const ejectedReloadProps = [];
const ejectedShellCasings = [];
const harvestTrees = [];
const harvestStones = [];
const woodSuckEffects = [];
const axeSwooshes = [];
const droppedHarvestLogs = [];
const droppedCreditPickups = [];
const treeLeafParticles = [];

const ZOMBIE_SPLATTER_FADE_DURATION = 8;
const PLAYER_MUZZLE_FLASH_LIFE = 0.08;
const TURRET_MUZZLE_FLASH_LIFE = 0.06;
const EJECTED_PROP_GROUND_HOLD = 8;
const EJECTED_PROP_FADE_DURATION = 8;
const HQ_SHELL_LANDING_Y = 0.16;

const enemyGeometry = new THREE.SphereGeometry(6.5, 12, 12);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0x84dd68, roughness: 0.75 });
const bulletGeometry = new THREE.SphereGeometry(1.7, 8, 8);
const playerBulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff8f57 });
const turretSmgBulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff4f5c });
const turretBulletMaterial = new THREE.MeshBasicMaterial({ color: 0x66e7ff });
const grenadeBulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff8f57 });
const cannonBulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffd166 });
const shellCasingMaterial = new THREE.MeshBasicMaterial({ color: 0xffc44d, transparent: true, opacity: 0.98 });
const shellCasingGeometry = new THREE.BoxGeometry(1.25, 0.3, 0.3);
const creepDustGeometry = new THREE.SphereGeometry(0.62, 8, 8);
const creepDustMaterial = new THREE.MeshBasicMaterial({
  color: 0x8f959e,
  transparent: true,
  opacity: 0.44,
  depthWrite: false,
});
const harvestDroppedLogMaterial = new THREE.MeshStandardMaterial({ color: 0x8a6a46, roughness: 0.82, metalness: 0.06 });
const creditPickupMaterial = new THREE.MeshStandardMaterial({ color: 0xffd457, roughness: 0.26, metalness: 0.85 });
const treeLeafGeometry = new THREE.PlaneGeometry(0.92, 1.12);
const treeLeafMaterial = new THREE.MeshBasicMaterial({
  color: 0x66c36f,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  side: THREE.DoubleSide,
});
const axeSwooshBaseMaterial = new THREE.MeshBasicMaterial({
  color: 0xe6f3ff,
  transparent: true,
  opacity: 0.82,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});
const ENEMY_SHAMBLE_SWAY = 0.22;
const ENEMY_SHAMBLE_YAW_SWAY = 0.055;
const ENEMY_CHOMP_SHAKE = 0.42;
const ENEMY_CHOMP_Y_BOUNCE = 0.14;
const turretTypeLabelByLevel = {
  1: "Assault Rifle",
  2: "M249",
  3: "Flak Cannon",
  4: "Cannon",
  5: "Cannon + M249",
  6: "Cannon + Flak",
};
const TURRET_AIM_Y_OFFSET = Math.PI;
const turretRecoilKickByLevel = { 1: 2.4, 2: 2.9, 3: 2.7, 4: 3.0, 5: 3.2, 6: 3.4 };
const turretRecoilMaxByLevel = { 1: 4.0, 2: 4.5, 3: 4.3, 4: 5.3, 5: 5.6, 6: 5.9 };
const turretRecoilRecoveryByLevel = { 1: 11, 2: 11, 3: 14, 4: 15, 5: 15, 6: 16 };
const turretTurnSpeedByLevel = { 1: 2.5, 2: 2.1, 3: 2.6, 4: 3.2, 5: 3.5, 6: 3.8 };
const TURRET_FIRE_ANGLE_TOLERANCE = 0.18;

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();

const weapons = [
  { id: "glock", name: "Glock", cost: 0, fireRate: 0.46, damage: 27, speed: 500, magSize: 14, reloadTime: 1.25 },
  { id: "magnum50", name: ".50 Magnum", cost: 350, fireRate: 0.78, damage: 60, speed: 560, magSize: 6, reloadTime: 1.95 },
  { id: "mp5", name: "MP5", cost: 650, fireRate: 0.18, damage: 19, speed: 560, magSize: 30, reloadTime: 1.9 },
  { id: "ar15", name: "AR15", cost: 2500, fireRate: 0.11, damage: 27, speed: 610, magSize: 30, reloadTime: 2.2 },
  { id: "m249", name: "M249", cost: 4000, fireRate: 0.09, damage: 28, speed: 610, magSize: 100, reloadTime: 2.2 },
];
const attachments = [
  { id: "extmag-glock", weaponId: "glock", name: "Glock Extended Mag", cost: 220 },
  { id: "extmag-magnum50", weaponId: "magnum50", name: ".50 Magnum Extended Mag", cost: 300 },
  { id: "extmag-mp5", weaponId: "mp5", name: "MP5 Extended Mag", cost: 420 },
  { id: "extmag-ar15", weaponId: "ar15", name: "AR15 Extended Mag", cost: 520 },
];
const pickupPullUpgrades = [
  { level: 1, multiplier: 2, cost: 500 },
  { level: 2, multiplier: 4, cost: 1000 },
];
const repairs = [
  { id: "repair250", name: "Repair +250 HP", hp: 250, cost: 250 },
  { id: "repair500", name: "Repair +500 HP", hp: 500, cost: 500 },
  { id: "repair1000", name: "Repair +1000 HP", hp: 1000, cost: 1000 },
  { id: "repairBreach", name: "Repair Breach", cost: BREACH_WOOD_REPAIR_COST, resource: "wood", target: "breach" },
  { id: "repairBunker", name: "Repair Bunker +250", hp: 250, cost: 400, target: "bunker" },
];
const baseUpgradeCosts = [700, 1400, 2200];
const baseUpgradeWoodCosts = [120, 220, 0];
const baseUpgradeStoneCosts = [0, 0, 160];
const turretBuyCost = 550;
const turretRepairCost = 500;
const turretUpgradeCosts = [500, 900, 1400, 2200, 3200];
const turretRangeByLevel = { 1: 170, 2: 220, 3: 250, 4: 340, 5: 360, 6: 390 };
const turretStatsByLevel = {
  1: { fireRate: 0.2, damage: 11, speed: 500 },
  2: { fireRate: 0.14, damage: 10, speed: 560 },
  3: { fireRate: 0.16, damage: 8, speed: 420 },
  4: { fireRate: 0.72, damage: 62, speed: 330 },
  5: { fireRate: 0.68, damage: 66, speed: 340 },
  6: { fireRate: 0.62, damage: 70, speed: 350 },
};
const mountedWeaponStatsByLevel = {
  5: { fireRate: 0.12, damage: 9, speed: 560, penetration: 1, type: "m249" },
  6: { fireRate: 0.14, damage: 8, speed: 430, penetration: 2, type: "flak" },
};
const playerBulletPenetrationByWeapon = { ar15: 2, m249: 3 };
const weaponIconById = {
  glock: "weapon-assets-svg/glock-svgrepo-com.svg",
  magnum50: "weapon-assets-svg/revolver-svgrepo-com.svg",
  mp5: "weapon-assets-svg/smg-svgrepo-com.svg",
  ar15: "weapon-assets-svg/rifle-gun-svgrepo-com.svg",
  m249: "weapon-assets-svg/auto-rifle-svgrepo-com.svg",
};
const weaponIconScaleById = {
  mp5: 1.25,
  m249: 1.75,
};
const attachmentIconByWeaponId = {
  glock: "weapon-assets-svg/extended-magazine-pistol-svgrepo-com.svg",
  magnum50: "weapon-assets-svg/extended-magazine-pistol-svgrepo-com.svg",
  mp5: "weapon-assets-svg/extended-magazine-machine-gun-magazine-svgrepo-com.svg",
  ar15: "weapon-assets-svg/extended-magazine-machine-gun-magazine-svgrepo-com.svg",
  m249: "weapon-assets-svg/extended-magazine-machine-gun-magazine-svgrepo-com.svg",
};
const weaponById = new Map(weapons.map((weapon) => [weapon.id, weapon]));
const attachmentById = new Map(attachments.map((attachment) => [attachment.id, attachment]));
const attachmentByWeaponId = new Map(attachments.map((attachment) => [attachment.weaponId, attachment]));

const playerWeaponModelPathById = {
  glock: "kenney_blaster-kit_2.1/Models/GLB%20format/blaster-a.glb",
  magnum50: "kenney_blaster-kit_2.1/Models/GLB%20format/blaster-b.glb",
  mp5: "kenney_blaster-kit_2.1/Models/GLB%20format/blaster-d.glb",
  ar15: "kenney_blaster-kit_2.1/Models/GLB%20format/blaster-e.glb",
  m249: "kenney_blaster-kit_2.1/Models/GLB%20format/blaster-g.glb",
};

const playerWeaponModelScaleById = {
  glock: 1,
  magnum50: 1,
  mp5: 1.05,
  ar15: 1.1,
  m249: 1.2,
};

const ENABLE_PLAYER_WEAPON_MODELS = true;
const LEVEL1_GHOST_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/character-ghost.glb";
const LEVEL1_ZOMBIEA_FBX_MODEL_PATH = "kenney_animated-characters-1/Model/characterMedium.fbx";
const LEVEL1_ZOMBIEA_RUN_FBX_PATH = "kenney_animated-characters-1/Animations/run.fbx";
const LEVEL1_ZOMBIEA_SKIN_PATH = "kenney_animated-characters-1/Skins/zombieA.png";
const LEVEL2_CYBORG_FBX_MODEL_PATH = "kenney_animated-characters-2/Model/characterMedium.fbx";
const LEVEL2_CYBORG_RUN_FBX_PATH = "kenney_animated-characters-2/Animations/run.fbx";
const LEVEL2_CYBORG_SKIN_PATH = "kenney_animated-characters-2/Skins/cyborgFemaleA.png";
const LEVEL3_ZOMBIE_FEMALE_FBX_MODEL_PATH = "kenney_animated-characters-3/Model/characterMedium.fbx";
const LEVEL3_ZOMBIE_FEMALE_RUN_FBX_PATH = "kenney_animated-characters-3/Animations/run.fbx";
const LEVEL3_ZOMBIE_FEMALE_SKIN_PATH = "kenney_animated-characters-3/Skins/zombieFemaleA.png";
const LEVEL4_ZOMBIE_MALE_FBX_MODEL_PATH = "kenney_animated-characters-3/Model/characterMedium.fbx";
const LEVEL4_ZOMBIE_MALE_RUN_FBX_PATH = "kenney_animated-characters-3/Animations/run.fbx";
const LEVEL4_ZOMBIE_MALE_SKIN_PATH = "kenney_animated-characters-3/Skins/zombieMaleA.png";
const PLAYER_CHARACTER_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/character-vampire.glb";
const FIELD_PINE_CROOKED_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/pine-crooked.glb";
const FIELD_PINE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/pine.glb";
const FIELD_ROCKS_TALL_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/rocks-tall.glb";
const FIELD_ROCKS_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/rocks.glb";
const FIELD_DEBRIS_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/debris.glb";
const BASE_FENCE_CURVE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/iron-fence-curve.glb";
const BASE_FENCE_BORDER_CURVE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/iron-fence-border-curve.glb";
const BASE_BRICK_WALL_CURVE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/brick-wall-curve.glb";
const CLIP_LARGE_MODEL_PATH = "kenney_blaster-kit_2.1/Models/GLB%20format/clip-large.glb";
const CLIP_SMALL_MODEL_PATH = "kenney_blaster-kit_2.1/Models/GLB%20format/clip-small.glb";
const BULLET_FOAM_THICK_MODEL_PATH = "kenney_blaster-kit_2.1/Models/GLB%20format/bullet-foam-thick.glb";

const playerWeaponModels = new Map();
let gltfLoader = null;
let gltfLoaderReadyPromise = null;
let fbxLoader = null;
let fbxLoaderReadyPromise = null;
let skeletonCloneFn = null;
let skeletonCloneReadyPromise = null;
let weaponModelsLoadStarted = false;
let level1GhostPrototype = null;
let level1GhostLoadStarted = false;
let level1GhostAnimationClip = null;
let level2ZombiePrototype = null;
let level2ZombieLoadStarted = false;
let level2ZombieAnimationClip = null;
let level3SkeletonPrototype = null;
let level3SkeletonLoadStarted = false;
let level3SkeletonAnimationClip = null;
let level4EnemyPrototype = null;
let level4EnemyLoadStarted = false;
let level4EnemyAnimationClip = null;
let playerCharacterPrototype = null;
let playerCharacterLoadStarted = false;
let baseFencePerimeterBuilt = false;
let baseFencePerimeterLoadStarted = false;
let baseFenceMainGroup = null;
let baseFenceInnerGroup = null;
let baseBrickWallGroup = null;
let baseFenceSegmentCount = 0;
let fieldScatterPropsBuilt = false;
let fieldScatterPropsLoadStarted = false;
let fieldScatterPropsGroup = null;
let harvestTreePrototypePool = [];
let harvestStonePrototypePool = [];
let clipLargePrototype = null;
let clipSmallPrototype = null;
let bulletFoamThickPrototype = null;
let reloadPropsLoadStarted = false;
const ENEMY_CHARACTER_FACING_OFFSET = Math.PI;
const ENEMY_MODEL_LOCAL_YAW = Math.PI;
const ENEMY_USE_CHARACTER_ANIMATIONS = true;
const CHARACTER_FACING_OFFSET_BY_TIER = {
  1: ENEMY_CHARACTER_FACING_OFFSET,
  2: ENEMY_CHARACTER_FACING_OFFSET,
  3: ENEMY_CHARACTER_FACING_OFFSET,
  4: ENEMY_CHARACTER_FACING_OFFSET,
};

function ensureGLTFLoader() {
  if (gltfLoader) {
    return Promise.resolve(gltfLoader);
  }
  if (gltfLoaderReadyPromise) {
    return gltfLoaderReadyPromise;
  }

  gltfLoaderReadyPromise = import("./vendor/three/examples/jsm/loaders/GLTFLoader.js")
    .then((module) => {
      const LoaderClass = module?.GLTFLoader;
      if (!LoaderClass) {
        return null;
      }
      gltfLoader = new LoaderClass();
      return gltfLoader;
    })
    .catch(() => {
      gltfLoaderReadyPromise = null;
      return null;
    });

  return gltfLoaderReadyPromise;
}

function ensureFBXLoader() {
  if (fbxLoader) {
    return Promise.resolve(fbxLoader);
  }
  if (fbxLoaderReadyPromise) {
    return fbxLoaderReadyPromise;
  }

  fbxLoaderReadyPromise = import("./vendor/three/examples/jsm/loaders/FBXLoader.js")
    .then((module) => {
      const LoaderClass = module?.FBXLoader;
      if (!LoaderClass) {
        return null;
      }
      fbxLoader = new LoaderClass();
      return fbxLoader;
    })
    .catch(() => {
      fbxLoaderReadyPromise = null;
      return null;
    });

  return fbxLoaderReadyPromise;
}

function loadFBXAsset(loader, path) {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, undefined, reject);
  });
}

function pickBestLocomotionClip(clips) {
  if (!Array.isArray(clips) || clips.length === 0) {
    return null;
  }

  const normalized = clips.filter(Boolean);
  if (normalized.length === 0) {
    return null;
  }

  const byName = (regex) => normalized.find((clip) => regex.test(String(clip.name || "")));

  const preferredRun = byName(/\brun\b|running|jog|sprint/i);
  if (preferredRun) {
    return preferredRun;
  }

  const preferredWalk = byName(/\bwalk\b|walking|locomotion|move/i);
  if (preferredWalk) {
    return preferredWalk;
  }

  const notPose = normalized.find((clip) => !/targeting\s*pose|\bpose\b|\bidle\b/i.test(String(clip.name || "")));
  if (notPose) {
    return notPose;
  }

  return normalized[0];
}

function ensureSkeletonCloneFn() {
  if (skeletonCloneFn) {
    return Promise.resolve(skeletonCloneFn);
  }
  if (skeletonCloneReadyPromise) {
    return skeletonCloneReadyPromise;
  }

  skeletonCloneReadyPromise = import("./vendor/three/examples/jsm/utils/SkeletonUtils.js")
    .then((module) => {
      const cloneFn = module?.clone;
      if (typeof cloneFn !== "function") {
        return null;
      }
      skeletonCloneFn = cloneFn;
      return skeletonCloneFn;
    })
    .catch(() => {
      skeletonCloneReadyPromise = null;
      return null;
    });

  return skeletonCloneReadyPromise;
}

function normalizeWeaponModelSize(modelRoot, targetLongestSide = 9.5) {
  const box = new THREE.Box3().setFromObject(modelRoot);
  const size = new THREE.Vector3();
  box.getSize(size);
  const longestSide = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(longestSide) || longestSide <= 0.0001) {
    return;
  }
  const scale = targetLongestSide / longestSide;
  modelRoot.scale.setScalar(scale);
}

function updatePlayerCharacterModel() {
  if (playerCharacterModel) {
    playerMesh.remove(playerCharacterModel);
    playerCharacterModel = null;
  }

  if (!playerCharacterPrototype) {
    playerFallbackMesh.visible = true;
    return;
  }

  // Keep the original calibration path for weapon alignment and aiming visuals.
  const model = playerCharacterPrototype.clone(true);
  model.position.set(0, -11.2, 0);
  model.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    node.castShadow = true;
    node.receiveShadow = false;
  });
  playerMesh.add(model);
  playerCharacterModel = model;
  playerFallbackMesh.visible = false;
}

function loadPlayerCharacterModel() {
  if (playerCharacterLoadStarted || playerCharacterPrototype) {
    return;
  }
  playerCharacterLoadStarted = true;

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        playerCharacterLoadStarted = false;
        return;
      }

      loader.load(
        PLAYER_CHARACTER_MODEL_PATH,
        (gltf) => {
          try {
            const model = gltf.scene;
            prepareCharacterPrototype(model, regularEnemyTiers.level4.radius * 2.2);
            playerCharacterPrototype = model;
            updatePlayerCharacterModel();
          } catch {
            playerCharacterLoadStarted = false;
          }
        },
        undefined,
        () => {
          playerCharacterLoadStarted = false;
        }
      );
    })
    .catch(() => {
      playerCharacterLoadStarted = false;
    });
}

function updatePlayerWeaponModel() {
  if (!ENABLE_PLAYER_WEAPON_MODELS) {
    return;
  }

  playerWeaponModels.forEach((model) => {
    model.visible = false;
  });

  const activeId = player.weaponId;
  const activeModel = playerWeaponModels.get(activeId);
  if (!activeModel) {
    return;
  }
  activeModel.visible = true;
}

function loadPlayerWeaponModels() {
  try {
    if (!ENABLE_PLAYER_WEAPON_MODELS) {
      return;
    }

    if (weaponModelsLoadStarted) {
      return;
    }
    weaponModelsLoadStarted = true;
    ensureGLTFLoader()
      .then((loader) => {
        if (!loader) {
          weaponModelsLoadStarted = false;
          return;
        }
        Object.entries(playerWeaponModelPathById).forEach(([weaponId, path]) => {
          loader.load(
            path,
            (gltf) => {
              try {
                const model = gltf.scene;
                normalizeWeaponModelSize(model);
                const weaponScale = playerWeaponModelScaleById[weaponId] || 1;
                model.scale.multiplyScalar(weaponScale);
                model.rotation.set(Math.PI / 2, 0, 0);
                model.position.set(0.2, -0.8, -1.6);
                model.visible = false;
                model.traverse((node) => {
                  if (!node.isMesh) {
                    return;
                  }
                  node.castShadow = true;
                  node.receiveShadow = false;
                  if (node.material) {
                    node.material.side = THREE.FrontSide;
                  }
                });

                playerWeaponMount.add(model);
                playerWeaponModels.set(weaponId, model);
                if (player.weaponId === weaponId) {
                  updatePlayerWeaponModel();
                }
              } catch {}
            },
            undefined,
            () => {}
          );
        });
      })
      .catch(() => {
        weaponModelsLoadStarted = false;
      });
  } catch {
    weaponModelsLoadStarted = false;
  }
}

function prepareCharacterPrototype(modelRoot, targetHeight, yawOffset = ENEMY_MODEL_LOCAL_YAW) {
  const initialBox = new THREE.Box3().setFromObject(modelRoot);
  const initialSize = new THREE.Vector3();
  initialBox.getSize(initialSize);
  const currentHeight = Math.max(0.001, initialSize.y || Math.max(initialSize.x, initialSize.z));
  const scale = targetHeight / currentHeight;
  modelRoot.scale.setScalar(scale);

  const centeredBox = new THREE.Box3().setFromObject(modelRoot);
  const centerX = (centeredBox.min.x + centeredBox.max.x) * 0.5;
  const centerZ = (centeredBox.min.z + centeredBox.max.z) * 0.5;
  modelRoot.position.set(-centerX, -centeredBox.min.y, -centerZ);
  modelRoot.rotation.y = yawOffset;

  modelRoot.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    node.castShadow = true;
    node.receiveShadow = false;
  });
}

function loadLevel1GhostModel() {
  if (level1GhostLoadStarted || level1GhostPrototype) {
    return;
  }
  level1GhostLoadStarted = true;

  ensureFBXLoader()
    .then((loader) => {
      if (!loader) {
        level1GhostLoadStarted = false;
        return;
      }

      Promise.allSettled([
        loadFBXAsset(loader, LEVEL1_ZOMBIEA_FBX_MODEL_PATH),
        loadFBXAsset(loader, LEVEL1_ZOMBIEA_RUN_FBX_PATH),
      ])
        .then((results) => {
          try {
            const modelResult = results[0];
            const runResult = results[1];
            if (!modelResult || modelResult.status !== "fulfilled" || !modelResult.value) {
              console.error("[L1 FBX] Failed to load character model", modelResult?.reason || "Unknown error");
              level1GhostLoadStarted = false;
              return;
            }

            const characterModel = modelResult.value;
            const runAnim = runResult?.status === "fulfilled" ? runResult.value : null;
            if (runResult?.status !== "fulfilled") {
              console.warn("[L1 FBX] run.fbx failed, using fallback animation", runResult?.reason || "Unknown error");
            }

            const hasMeshNodes = (root) => {
              let found = false;
              root?.traverse?.((node) => {
                if (node.isMesh) {
                  found = true;
                }
              });
              return found;
            };

            const sourceModel = runAnim && hasMeshNodes(runAnim) ? runAnim : characterModel;

            const skinTexture = new THREE.TextureLoader().load(LEVEL1_ZOMBIEA_SKIN_PATH);
            skinTexture.colorSpace = THREE.SRGBColorSpace;
            skinTexture.flipY = false;

            prepareCharacterPrototype(sourceModel, regularEnemyTiers.level1.radius * 2.86);
            sourceModel.traverse((node) => {
              if (!node.isMesh) {
                return;
              }
              const applyZombieSkinToMaterial = (sourceMaterial) => {
                if (!sourceMaterial || typeof sourceMaterial.clone !== "function") {
                  return sourceMaterial;
                }
                const nextMaterial = sourceMaterial.clone();
                nextMaterial.map = skinTexture;
                nextMaterial.color = new THREE.Color(0xffffff);
                nextMaterial.transparent = false;
                nextMaterial.opacity = 1;
                nextMaterial.alphaTest = 0;
                nextMaterial.depthWrite = true;
                nextMaterial.side = THREE.FrontSide;
                nextMaterial.emissive?.set?.(0x000000);
                if (node.isSkinnedMesh) {
                  nextMaterial.skinning = true;
                }
                nextMaterial.needsUpdate = true;
                return nextMaterial;
              };

              if (Array.isArray(node.material)) {
                node.material = node.material.map((material) => applyZombieSkinToMaterial(material));
              } else {
                node.material = applyZombieSkinToMaterial(node.material);
              }
            });

            level1GhostPrototype = sourceModel;
            const runAnimClips = Array.isArray(runAnim?.animations) ? runAnim.animations : [];
            const sourceModelClips = Array.isArray(sourceModel?.animations) ? sourceModel.animations : [];
            level1GhostAnimationClip =
              pickBestLocomotionClip(runAnimClips) ||
              pickBestLocomotionClip(sourceModelClips) ||
              null;
            console.info("[L1 FBX] zombieA character loaded", {
              hasRun: !!level1GhostAnimationClip,
            });

            try {
              const countSkinned = (root) => {
                let c = 0;
                root?.traverse?.((n) => {
                  if (n.isSkinnedMesh) c += 1;
                });
                return c;
              };

              console.info("[L1 FBX DEBUG] clip/proto info", {
                clipName: level1GhostAnimationClip?.name || null,
                clipTracks: level1GhostAnimationClip?.tracks?.length || 0,
                prototypeHasSkinnedMeshes: countSkinned(sourceModel || {}),
                originalModelHasSkinnedMeshes: countSkinned(characterModel || {}),
              });
            } catch (e) {
              console.warn("[L1 FBX DEBUG] failed to emit clip/proto info", e);
            }
          } catch {
            console.error("[L1 FBX] Unexpected setup error while preparing character");
            level1GhostLoadStarted = false;
          }
        })
        .catch(() => {
          console.error("[L1 FBX] Loader promise failed");
          level1GhostLoadStarted = false;
        });
    })
    .catch(() => {
      level1GhostLoadStarted = false;
    });
}

function loadLevel2ZombieModel() {
  if (level2ZombieLoadStarted || level2ZombiePrototype) {
    return;
  }
  level2ZombieLoadStarted = true;

  ensureFBXLoader()
    .then((loader) => {
      if (!loader) {
        level2ZombieLoadStarted = false;
        return;
      }

      Promise.allSettled([
        loadFBXAsset(loader, LEVEL2_CYBORG_FBX_MODEL_PATH),
        loadFBXAsset(loader, LEVEL2_CYBORG_RUN_FBX_PATH),
      ])
        .then((results) => {
          try {
            const modelResult = results[0];
            const runResult = results[1];
            if (!modelResult || modelResult.status !== "fulfilled" || !modelResult.value) {
              level2ZombieLoadStarted = false;
              return;
            }

            const characterModel = modelResult.value;
            const runAnim = runResult?.status === "fulfilled" ? runResult.value : null;

            const hasMeshNodes = (root) => {
              let found = false;
              root?.traverse?.((node) => {
                if (node.isMesh) {
                  found = true;
                }
              });
              return found;
            };

            const sourceModel = runAnim && hasMeshNodes(runAnim) ? runAnim : characterModel;

            const skinTexture = new THREE.TextureLoader().load(LEVEL2_CYBORG_SKIN_PATH);
            skinTexture.colorSpace = THREE.SRGBColorSpace;
            skinTexture.flipY = false;

            prepareCharacterPrototype(sourceModel, regularEnemyTiers.level2.radius * 2.2);
            sourceModel.traverse((node) => {
              if (!node.isMesh) {
                return;
              }
              const applySkinToMaterial = (sourceMaterial) => {
                if (!sourceMaterial || typeof sourceMaterial.clone !== "function") {
                  return sourceMaterial;
                }
                const nextMaterial = sourceMaterial.clone();
                nextMaterial.map = skinTexture;
                nextMaterial.color = new THREE.Color(0xffffff);
                nextMaterial.transparent = false;
                nextMaterial.opacity = 1;
                nextMaterial.alphaTest = 0;
                nextMaterial.depthWrite = true;
                nextMaterial.side = THREE.FrontSide;
                nextMaterial.emissive?.set?.(0x000000);
                if (node.isSkinnedMesh) {
                  nextMaterial.skinning = true;
                }
                nextMaterial.needsUpdate = true;
                return nextMaterial;
              };

              if (Array.isArray(node.material)) {
                node.material = node.material.map((material) => applySkinToMaterial(material));
              } else {
                node.material = applySkinToMaterial(node.material);
              }
            });

            level2ZombiePrototype = sourceModel;
            const runAnimClips = Array.isArray(runAnim?.animations) ? runAnim.animations : [];
            const sourceModelClips = Array.isArray(sourceModel?.animations) ? sourceModel.animations : [];
            level2ZombieAnimationClip =
              pickBestLocomotionClip(runAnimClips) ||
              pickBestLocomotionClip(sourceModelClips) ||
              null;
          } catch {
            level2ZombieLoadStarted = false;
          }
        })
        .catch(() => {
          level2ZombieLoadStarted = false;
        });
    })
    .catch(() => {
      level2ZombieLoadStarted = false;
    });
}

function loadLevel3SkeletonModel() {
  if (level3SkeletonLoadStarted || level3SkeletonPrototype) {
    return;
  }
  level3SkeletonLoadStarted = true;

  ensureFBXLoader()
    .then((loader) => {
      if (!loader) {
        level3SkeletonLoadStarted = false;
        return;
      }

      Promise.allSettled([
        loadFBXAsset(loader, LEVEL3_ZOMBIE_FEMALE_FBX_MODEL_PATH),
        loadFBXAsset(loader, LEVEL3_ZOMBIE_FEMALE_RUN_FBX_PATH),
      ])
        .then((results) => {
          try {
            const modelResult = results[0];
            const runResult = results[1];
            if (!modelResult || modelResult.status !== "fulfilled" || !modelResult.value) {
              level3SkeletonLoadStarted = false;
              return;
            }

            const characterModel = modelResult.value;
            const runAnim = runResult?.status === "fulfilled" ? runResult.value : null;

            const hasMeshNodes = (root) => {
              let found = false;
              root?.traverse?.((node) => {
                if (node.isMesh) {
                  found = true;
                }
              });
              return found;
            };

            const sourceModel = runAnim && hasMeshNodes(runAnim) ? runAnim : characterModel;

            const skinTexture = new THREE.TextureLoader().load(LEVEL3_ZOMBIE_FEMALE_SKIN_PATH);
            skinTexture.colorSpace = THREE.SRGBColorSpace;
            skinTexture.flipY = false;

            prepareCharacterPrototype(sourceModel, regularEnemyTiers.level3.radius * 2.2);
            sourceModel.traverse((node) => {
              if (!node.isMesh) {
                return;
              }
              const applySkinToMaterial = (sourceMaterial) => {
                if (!sourceMaterial || typeof sourceMaterial.clone !== "function") {
                  return sourceMaterial;
                }
                const nextMaterial = sourceMaterial.clone();
                nextMaterial.map = skinTexture;
                nextMaterial.color = new THREE.Color(0xffffff);
                nextMaterial.transparent = false;
                nextMaterial.opacity = 1;
                nextMaterial.alphaTest = 0;
                nextMaterial.depthWrite = true;
                nextMaterial.side = THREE.FrontSide;
                nextMaterial.emissive?.set?.(0x000000);
                if (node.isSkinnedMesh) {
                  nextMaterial.skinning = true;
                }
                nextMaterial.needsUpdate = true;
                return nextMaterial;
              };

              if (Array.isArray(node.material)) {
                node.material = node.material.map((material) => applySkinToMaterial(material));
              } else {
                node.material = applySkinToMaterial(node.material);
              }
            });

            level3SkeletonPrototype = sourceModel;
            const runAnimClips = Array.isArray(runAnim?.animations) ? runAnim.animations : [];
            const sourceModelClips = Array.isArray(sourceModel?.animations) ? sourceModel.animations : [];
            level3SkeletonAnimationClip =
              pickBestLocomotionClip(runAnimClips) ||
              pickBestLocomotionClip(sourceModelClips) ||
              null;
          } catch {
            level3SkeletonLoadStarted = false;
          }
        })
        .catch(() => {
          level3SkeletonLoadStarted = false;
        });
    })
    .catch(() => {
      level3SkeletonLoadStarted = false;
    });
}

function loadLevel4EnemyModel() {
  if (level4EnemyLoadStarted || level4EnemyPrototype) {
    return;
  }
  level4EnemyLoadStarted = true;

  ensureFBXLoader()
    .then((loader) => {
      if (!loader) {
        level4EnemyLoadStarted = false;
        return;
      }

      Promise.allSettled([
        loadFBXAsset(loader, LEVEL4_ZOMBIE_MALE_FBX_MODEL_PATH),
        loadFBXAsset(loader, LEVEL4_ZOMBIE_MALE_RUN_FBX_PATH),
      ])
        .then((results) => {
          try {
            const modelResult = results[0];
            const runResult = results[1];
            if (!modelResult || modelResult.status !== "fulfilled" || !modelResult.value) {
              level4EnemyLoadStarted = false;
              return;
            }

            const characterModel = modelResult.value;
            const runAnim = runResult?.status === "fulfilled" ? runResult.value : null;

            const hasMeshNodes = (root) => {
              let found = false;
              root?.traverse?.((node) => {
                if (node.isMesh) {
                  found = true;
                }
              });
              return found;
            };

            const sourceModel = runAnim && hasMeshNodes(runAnim) ? runAnim : characterModel;

            const skinTexture = new THREE.TextureLoader().load(LEVEL4_ZOMBIE_MALE_SKIN_PATH);
            skinTexture.colorSpace = THREE.SRGBColorSpace;
            skinTexture.flipY = false;

            prepareCharacterPrototype(sourceModel, regularEnemyTiers.level4.radius * 2.2);
            sourceModel.traverse((node) => {
              if (!node.isMesh) {
                return;
              }
              const applySkinToMaterial = (sourceMaterial) => {
                if (!sourceMaterial || typeof sourceMaterial.clone !== "function") {
                  return sourceMaterial;
                }
                const nextMaterial = sourceMaterial.clone();
                nextMaterial.map = skinTexture;
                nextMaterial.color = new THREE.Color(0xffffff);
                nextMaterial.transparent = false;
                nextMaterial.opacity = 1;
                nextMaterial.alphaTest = 0;
                nextMaterial.depthWrite = true;
                nextMaterial.side = THREE.FrontSide;
                nextMaterial.emissive?.set?.(0x000000);
                if (node.isSkinnedMesh) {
                  nextMaterial.skinning = true;
                }
                nextMaterial.needsUpdate = true;
                return nextMaterial;
              };

              if (Array.isArray(node.material)) {
                node.material = node.material.map((material) => applySkinToMaterial(material));
              } else {
                node.material = applySkinToMaterial(node.material);
              }
            });

            level4EnemyPrototype = sourceModel;
            const runAnimClips = Array.isArray(runAnim?.animations) ? runAnim.animations : [];
            const sourceModelClips = Array.isArray(sourceModel?.animations) ? sourceModel.animations : [];
            level4EnemyAnimationClip =
              pickBestLocomotionClip(runAnimClips) ||
              pickBestLocomotionClip(sourceModelClips) ||
              null;

            updatePlayerCharacterModel();
          } catch {
            level4EnemyLoadStarted = false;
          }
        })
        .catch(() => {
          level4EnemyLoadStarted = false;
        });
    })
    .catch(() => {
      level4EnemyLoadStarted = false;
    });
}

function loadBaseFencePerimeter() {
  if (baseFencePerimeterBuilt || baseFencePerimeterLoadStarted) {
    return;
  }
  baseFencePerimeterLoadStarted = true;

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        baseFencePerimeterLoadStarted = false;
        return;
      }

      const loadRingPrototype = (path) => new Promise((resolve, reject) => {
        loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
      });

      const buildPerimeterRing = (prototype, options) => {
        const { radius, segmentCount, heightY, yawOffset = -Math.PI * 0.25 } = options;

        prototype.traverse((node) => {
          if (!node.isMesh) {
            return;
          }
          node.castShadow = true;
          node.receiveShadow = true;
        });

        const initialBox = new THREE.Box3().setFromObject(prototype);
        const initialSize = new THREE.Vector3();
        initialBox.getSize(initialSize);
        const footprint = Math.max(0.001, initialSize.x, initialSize.z);
        const segmentLength = (Math.PI * 2 * radius) / segmentCount;
        const uniformScale = (segmentLength / footprint) * 0.89;
        prototype.scale.setScalar(uniformScale);

        const centeredBox = new THREE.Box3().setFromObject(prototype);
        const centerX = (centeredBox.min.x + centeredBox.max.x) * 0.5;
        const centerZ = (centeredBox.min.z + centeredBox.max.z) * 0.5;
        prototype.position.set(-centerX, -centeredBox.min.y, -centerZ);

        const group = new THREE.Group();
        const segmentMeshes = [];
        for (let index = 0; index < segmentCount; index += 1) {
          const angle = (index / segmentCount) * Math.PI * 2;
          const segment = prototype.clone(true);
          segment.position.set(Math.cos(angle) * radius, heightY, Math.sin(angle) * radius);
          segment.rotation.y = -angle + Math.PI * 0.5 + yawOffset + Math.PI;
          segment.userData.segmentIndex = index;
          segment.userData.baseRotationY = segment.rotation.y;
          group.add(segment);
          segmentMeshes.push(segment);
        }
        group.userData.segmentMeshes = segmentMeshes;
        group.userData.segmentCount = segmentCount;
        group.userData.radius = radius;
        group.userData.heightY = heightY;
        return group;
      };

      Promise.all([
        loadRingPrototype(BASE_FENCE_CURVE_MODEL_PATH),
        loadRingPrototype(BASE_FENCE_BORDER_CURVE_MODEL_PATH),
        loadRingPrototype(BASE_BRICK_WALL_CURVE_MODEL_PATH),
      ])
        .then(([outerFenceProto, innerFenceProto, brickWallProto]) => {
          try {
            const ringBuildOptions = {
              radius: BASE_HQ_RADIUS,
              segmentCount: 40,
              heightY: 0.5,
            };

            baseFenceMainGroup = buildPerimeterRing(outerFenceProto, {
              ...ringBuildOptions,
              yawOffset: -Math.PI * 0.25,
            });
            baseFenceInnerGroup = buildPerimeterRing(innerFenceProto, {
              ...ringBuildOptions,
              yawOffset: -Math.PI * 0.25,
            });
            baseBrickWallGroup = buildPerimeterRing(brickWallProto, {
              ...ringBuildOptions,
              yawOffset: -Math.PI * 0.25 + Math.PI/2,
            });

            scene.add(baseFenceMainGroup);
            scene.add(baseFenceInnerGroup);
            scene.add(baseBrickWallGroup);

            baseFenceSegmentCount = ringBuildOptions.segmentCount;

            applyBaseUpgradeVisuals();
            baseFencePerimeterBuilt = true;
          } catch {
            baseFencePerimeterLoadStarted = false;
          }
        })
        .catch(() => {
          baseFencePerimeterLoadStarted = false;
        });
    })
    .catch(() => {
      baseFencePerimeterLoadStarted = false;
    });
}

function loadFieldScatterProps() {
  if (fieldScatterPropsBuilt || fieldScatterPropsLoadStarted) {
    return;
  }
  fieldScatterPropsLoadStarted = true;

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        fieldScatterPropsLoadStarted = false;
        return;
      }

      const loadPrototype = (path) => new Promise((resolve, reject) => {
        loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
      });

      Promise.all([
        loadPrototype(FIELD_PINE_CROOKED_MODEL_PATH),
        loadPrototype(FIELD_PINE_MODEL_PATH),
        loadPrototype(FIELD_ROCKS_TALL_MODEL_PATH),
        loadPrototype(FIELD_ROCKS_MODEL_PATH),
        loadPrototype(FIELD_DEBRIS_MODEL_PATH),
      ])
        .then(([
          pineCrookedPrototype,
          pinePrototype,
          rocksTallPrototype,
          rocksPrototype,
          debrisPrototype,
        ]) => {
          harvestTreePrototypePool = [pineCrookedPrototype, pinePrototype];
          harvestStonePrototypePool = [rocksTallPrototype, rocksPrototype];
          const prototypePool = [
            pineCrookedPrototype,
            pineCrookedPrototype,
            pinePrototype,
            pinePrototype,
            rocksTallPrototype,
            rocksPrototype,
            debrisPrototype,
          ];
          const placements = [];
          const targetCount = 40;
          const minCenterRadius = 150;
          const maxRadius = Math.min(worldSize.width, worldSize.depth) * 0.5 - 28;
          const minSpacing = 26;

          for (let attempts = 0; attempts < 900 && placements.length < targetCount; attempts += 1) {
            const angle = Math.random() * Math.PI * 2;
            const radius = THREE.MathUtils.randFloat(minCenterRadius, maxRadius);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            let tooClose = false;
            for (let i = 0; i < placements.length; i += 1) {
              const placed = placements[i];
              if (Math.hypot(placed.x - x, placed.z - z) < minSpacing) {
                tooClose = true;
                break;
              }
            }
            if (tooClose) {
              continue;
            }

            const prototype = prototypePool[Math.floor(Math.random() * prototypePool.length)];
            const isTreePrototype = prototype === pineCrookedPrototype || prototype === pinePrototype;
            const isStonePrototype = prototype === rocksTallPrototype || prototype === rocksPrototype;
            const baseScale = THREE.MathUtils.randFloat(7.6, 9.6);
            const treeAgeScale = THREE.MathUtils.randFloat(1.5, 2.0);
            placements.push({
              prototype,
              x,
              z,
              y: 0,
              scale: isTreePrototype ? baseScale * treeAgeScale : isStonePrototype ? baseScale * 1.5 : baseScale,
              rotY: Math.random() * Math.PI * 2,
            });
          }

          const propsGroup = new THREE.Group();
          placements.forEach((placement) => {
            const model = placement.prototype.clone(true);
            model.position.set(placement.x, placement.y, placement.z);
            model.rotation.y = placement.rotY;
            model.scale.setScalar(placement.scale);
            const isTreePrototype =
              placement.prototype === pineCrookedPrototype ||
              placement.prototype === pinePrototype;
            const isStonePrototype =
              placement.prototype === rocksTallPrototype ||
              placement.prototype === rocksPrototype;
            model.traverse((node) => {
              if (!node.isMesh) {
                return;
              }
              node.castShadow = true;
              node.receiveShadow = true;
            });
            if (isTreePrototype) {
              model.userData.harvestTreeEligible = true;
              model.userData.harvestBaseScale = placement.scale;
              model.userData.harvestPrototype = placement.prototype;
            }
            if (isStonePrototype) {
              model.userData.harvestStoneEligible = true;
              model.userData.harvestBaseScale = placement.scale;
              model.userData.harvestPrototype = placement.prototype;
            }
            propsGroup.add(model);

            if (isTreePrototype) {
              const woodYield = placement.scale >= 15 ? 2 : 1;
              registerHarvestTreeModel(model, placement.prototype, placement.scale, woodYield, HARVEST_TREE_MAX_GROWTH_STAGE);
            }
            if (isStonePrototype) {
              const stoneYield = placement.scale >= 13 ? 2 : 1;
              registerHarvestStoneModel(model, placement.prototype, placement.scale, stoneYield, HARVEST_STONE_MAX_GROWTH_STAGE);
            }
          });

          scene.add(propsGroup);
          fieldScatterPropsGroup = propsGroup;
          fieldScatterPropsBuilt = true;
        })
        .catch(() => {
          fieldScatterPropsLoadStarted = false;
        });
    })
    .catch(() => {
      fieldScatterPropsLoadStarted = false;
    });
}

function updateCarriedLogsVisual() {
  carriedLogsMount.children.splice(0).forEach((mesh) => {
    mesh.geometry?.dispose?.();
    mesh.material?.dispose?.();
    carriedLogsMount.remove(mesh);
  });

  for (let index = 0; index < worldState.carriedLogs; index += 1) {
    const log = new THREE.Mesh(
      new THREE.CylinderGeometry(0.96, 1.26, 10.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x8a6a46, roughness: 0.82, metalness: 0.06 })
    );
    log.rotation.z = Math.PI * 0.5;
    log.position.set(0, index * 1.6, 0);
    log.castShadow = true;
    carriedLogsMount.add(log);
  }
}

function setAxeEquipped(equipped) {
  playerAxeState.equipped = equipped;
  playerAxeMount.visible = equipped;
  playerWeaponMount.visible = !equipped;
}

function getHarvestGrowthScale(growthStage) {
  const normalized = THREE.MathUtils.clamp(growthStage / HARVEST_TREE_MAX_GROWTH_STAGE, 0, 1);
  return 0.2 + normalized * 0.8;
}

function registerHarvestTreeModel(model, sourcePrototype, baseScale, woodYield, growthStage = HARVEST_TREE_MAX_GROWTH_STAGE) {
  const tree = {
    model,
    sourcePrototype,
    baseScale,
    woodYield,
    growthStage,
    hitCount: 0,
    projectileDamage: 0,
    shakeTimer: 0,
    shakePhase: Math.random() * Math.PI * 2,
    falling: false,
    fallProgress: 0,
    fallDirX: 0,
    fallDirZ: 0,
    fallDropPickupCycles: 0,
  };
  const growthScale = getHarvestGrowthScale(growthStage);
  tree.model.scale.setScalar(baseScale * growthScale);
  harvestTrees.push(tree);
  return tree;
}

function findHarvestTreeSpawnPosition() {
  const maxRadius = Math.min(worldSize.width, worldSize.depth) * 0.5 - 26;
  const minRadius = Math.max(130, ULT_BUNKER_HOUSE_RADIUS + 36);
  for (let attempt = 0; attempt < 180; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.randFloat(minRadius, maxRadius);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    let blocked = false;
    for (const tree of harvestTrees) {
      if (!tree.model?.parent) {
        continue;
      }
      if (Math.hypot(tree.model.position.x - x, tree.model.position.z - z) < 34) {
        blocked = true;
        break;
      }
    }
    if (!blocked) {
      return { x, z };
    }
  }

  const fallbackAngle = Math.random() * Math.PI * 2;
  const fallbackRadius = Math.max(140, ULT_BUNKER_HOUSE_RADIUS + 48);
  return {
    x: Math.cos(fallbackAngle) * fallbackRadius,
    z: Math.sin(fallbackAngle) * fallbackRadius,
  };
}

function resetHarvestTrees(initialGrowthStage = HARVEST_TREE_MAX_GROWTH_STAGE) {
  harvestTrees.length = 0;

  if (fieldScatterPropsGroup) {
    fieldScatterPropsGroup.children.forEach((model) => {
      if (!model.userData?.harvestTreeEligible) {
        return;
      }
      const sourcePrototype = model.userData.harvestPrototype || harvestTreePrototypePool[0] || null;
      const baseScale = model.userData.harvestBaseScale || model.scale.x || 12;
      const woodYield = baseScale >= 15 ? 2 : 1;
      registerHarvestTreeModel(model, sourcePrototype, baseScale, woodYield, initialGrowthStage);
    });
    return;
  }

  for (let index = 0; index < HARVEST_TREE_COUNT; index += 1) {
    if (harvestTreePrototypePool.length === 0) {
      break;
    }
    const prototype = harvestTreePrototypePool[Math.floor(Math.random() * harvestTreePrototypePool.length)];
    const pos = findHarvestTreeSpawnPosition();
    const model = prototype.clone(true);
    const baseScale = THREE.MathUtils.randFloat(12, 17.5);
    model.position.set(pos.x, 0, pos.z);
    model.rotation.y = Math.random() * Math.PI * 2;
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(model);
    registerHarvestTreeModel(model, prototype, baseScale, baseScale >= 15 ? 2 : 1, initialGrowthStage);
  }
}

function registerHarvestStoneModel(model, sourcePrototype, baseScale, stoneYield, growthStage = HARVEST_STONE_MAX_GROWTH_STAGE) {
  const stone = {
    model,
    sourcePrototype,
    baseScale,
    stoneYield,
    growthStage,
    hitCount: 0,
    shakeTimer: 0,
    shakePhase: Math.random() * Math.PI * 2,
    falling: false,
    fallProgress: 0,
  };
  const growthScale = getHarvestGrowthScale(growthStage);
  stone.model.scale.setScalar(baseScale * growthScale);
  harvestStones.push(stone);
  return stone;
}

function spawnHarvestStones(count, growthStage = HARVEST_STONE_MAX_GROWTH_STAGE) {
  if (harvestStonePrototypePool.length === 0 || count <= 0) {
    return;
  }
  for (let index = 0; index < count; index += 1) {
    const prototype = harvestStonePrototypePool[Math.floor(Math.random() * harvestStonePrototypePool.length)];
    const pos = findHarvestTreeSpawnPosition();
    const model = prototype.clone(true);
    const baseScale = THREE.MathUtils.randFloat(10.5, 15.5);
    model.position.set(pos.x, 0, pos.z);
    model.rotation.y = Math.random() * Math.PI * 2;
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(model);
    registerHarvestStoneModel(model, prototype, baseScale, baseScale >= 13 ? 2 : 1, growthStage);
  }
}

function resetHarvestStones(initialGrowthStage = HARVEST_STONE_MAX_GROWTH_STAGE) {
  harvestStones.length = 0;

  if (fieldScatterPropsGroup) {
    fieldScatterPropsGroup.children.forEach((model) => {
      if (!model.userData?.harvestStoneEligible) {
        return;
      }
      const sourcePrototype = model.userData.harvestPrototype || harvestStonePrototypePool[0] || null;
      const baseScale = model.userData.harvestBaseScale || model.scale.x || 12;
      const stoneYield = baseScale >= 13 ? 2 : 1;
      registerHarvestStoneModel(model, sourcePrototype, baseScale, stoneYield, initialGrowthStage);
    });
    return;
  }

  spawnHarvestStones(HARVEST_STONE_MIN_ACTIVE, initialGrowthStage);
}

function getNearestHarvestStone(maxDistance, requireMature = true) {
  let best = null;
  let bestDist = maxDistance;
  for (const stone of harvestStones) {
    if (stone.falling || !stone.model?.parent) {
      continue;
    }
    if (requireMature && stone.growthStage < HARVEST_STONE_MAX_GROWTH_STAGE) {
      continue;
    }
    const dist = Math.hypot(stone.model.position.x - player.x, stone.model.position.z - player.z);
    if (dist <= bestDist) {
      best = stone;
      bestDist = dist;
    }
  }
  return best;
}

function finalizeHarvestedStone(stone) {
  worldState.stoneStock += Math.max(1, stone.stoneYield || 1);
  spawnCannonBlastEffect(stone.model.position.x, stone.model.position.z, 9);

  stone.model?.parent?.remove(stone.model);
  stone.model?.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    node.geometry?.dispose?.();
    if (Array.isArray(node.material)) {
      node.material.forEach((material) => material?.dispose?.());
    } else {
      node.material?.dispose?.();
    }
  });

  harvestStones.splice(harvestStones.indexOf(stone), 1);

  if (harvestStonePrototypePool.length > 0) {
    const prototype = stone.sourcePrototype || harvestStonePrototypePool[Math.floor(Math.random() * harvestStonePrototypePool.length)];
    const sproutPos = findHarvestTreeSpawnPosition();
    const sprout = prototype.clone(true);
    sprout.position.set(sproutPos.x, 0, sproutPos.z);
    sprout.rotation.y = Math.random() * Math.PI * 2;
    sprout.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(sprout);
    registerHarvestStoneModel(sprout, prototype, stone.baseScale, stone.stoneYield || 1, 0);
  }
}

function performStoneMine(stone) {
  if (worldState.phase !== "day" || worldState.paused || worldState.gameOver || ultimateBunkerSequence.active) {
    return;
  }
  if (!stone) {
    return;
  }

  playerAxeState.swingTimer = playerAxeState.swingDuration;
  spawnAxeSwoosh();

  stone.hitCount += 1;
  if (stone.hitCount === 1) {
    stone.shakeTimer = 0.2;
    spawnCannonBlastEffect(stone.model.position.x, stone.model.position.z, 4.5);
    return;
  }

  if (!stone.falling) {
    stone.falling = true;
    stone.fallProgress = 0;
  }
}

function spawnHarvestTrees(count, growthStage = HARVEST_TREE_MAX_GROWTH_STAGE) {
  if (harvestTreePrototypePool.length === 0 || count <= 0) {
    return;
  }
  for (let index = 0; index < count; index += 1) {
    const prototype = harvestTreePrototypePool[Math.floor(Math.random() * harvestTreePrototypePool.length)];
    const pos = findHarvestTreeSpawnPosition();
    const model = prototype.clone(true);
    const baseScale = THREE.MathUtils.randFloat(12, 17.5);
    model.position.set(pos.x, 0, pos.z);
    model.rotation.y = Math.random() * Math.PI * 2;
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(model);
    registerHarvestTreeModel(model, prototype, baseScale, baseScale >= 15 ? 2 : 1, growthStage);
  }
}

function getNearestHarvestTree(maxDistance, requireMature = true) {
  let best = null;
  let bestDist = maxDistance;
  for (const tree of harvestTrees) {
    if (tree.falling) {
      continue;
    }
    if (!tree.model?.parent) {
      continue;
    }
    if (requireMature && tree.growthStage < HARVEST_TREE_MAX_GROWTH_STAGE) {
      continue;
    }
    const dist = Math.hypot(tree.model.position.x - player.x, tree.model.position.z - player.z);
    if (dist <= bestDist) {
      best = tree;
      bestDist = dist;
    }
  }
  return best;
}

function getHarvestTreeNearPoint(x, z, maxDistance, requireMature = false) {
  let nearest = null;
  let nearestDist = maxDistance;
  for (const tree of harvestTrees) {
    if (!tree.model?.parent || tree.falling) {
      continue;
    }
    if (requireMature && tree.growthStage < HARVEST_TREE_MAX_GROWTH_STAGE) {
      continue;
    }
    const distance = Math.hypot(tree.model.position.x - x, tree.model.position.z - z);
    if (distance <= nearestDist) {
      nearest = tree;
      nearestDist = distance;
    }
  }
  return nearest;
}

function getHarvestTreeProjectileHit(tree, x, z, bulletRadius = 0) {
  const treeHitbox = HARVEST_TREE_PROJECTILE_HITBOX_RADIUS;
  return Math.hypot(tree.model.position.x - x, tree.model.position.z - z) <= treeHitbox + bulletRadius;
}

function getHarvestTreeNearProjectilePoint(x, z, bulletRadius = 0) {
  for (const tree of harvestTrees) {
    if (!tree.model?.parent || tree.falling) {
      continue;
    }
    if (getHarvestTreeProjectileHit(tree, x, z, bulletRadius)) {
      return tree;
    }
  }
  return null;
}

function getTreeDamageFromBullet(bullet) {
  if (!bullet) {
    return 0;
  }
  if (bullet.projectileType === "cannon" || bullet.projectileType === "flak") {
    return HARVEST_TREE_PROJECTILE_FALL_DAMAGE;
  }
  if (bullet.projectileType !== "smg") {
    return 0;
  }

  if (bullet.owner === "player") {
    return bullet.weaponId === "ar15" || bullet.weaponId === "m249" ? 1 : 0;
  }

  return 1;
}

function applyProjectileHitToTree(tree, bullet) {
  const treeDamage = getTreeDamageFromBullet(bullet);
  if (!tree || treeDamage <= 0 || tree.falling) {
    return false;
  }

  tree.projectileDamage = Math.min(HARVEST_TREE_PROJECTILE_FALL_DAMAGE, (tree.projectileDamage || 0) + treeDamage);
  tree.shakeTimer = Math.max(tree.shakeTimer || 0, 0.16);
  if (tree.projectileDamage >= HARVEST_TREE_PROJECTILE_FALL_DAMAGE) {
    tree.projectileDamage = HARVEST_TREE_PROJECTILE_FALL_DAMAGE;
    knockdownHarvestTreeByCannon(tree, bullet.vx, bullet.vz);
  }
  return true;
}

function knockdownHarvestTreesInRadius(x, z, radius, shotDirX = 0, shotDirZ = 0) {
  let knocked = 0;
  for (const tree of harvestTrees) {
    if (!tree.model?.parent || tree.falling) {
      continue;
    }
    if (Math.hypot(tree.model.position.x - x, tree.model.position.z - z) <= radius + HARVEST_TREE_PROJECTILE_HITBOX_RADIUS) {
      knockdownHarvestTreeByCannon(tree, shotDirX, shotDirZ);
      tree.projectileDamage = HARVEST_TREE_PROJECTILE_FALL_DAMAGE;
      knocked += 1;
    }
  }
  return knocked;
}

function spawnTreeLeafBurst(tree, count = 16, burstStrength = 1) {
  const treeX = tree.model?.position?.x ?? 0;
  const treeZ = tree.model?.position?.z ?? 0;
  const crownY = Math.max(5.2, (tree.model?.scale?.y ?? tree.baseScale ?? 12) * 0.7);
  for (let index = 0; index < count; index += 1) {
    const mesh = new THREE.Mesh(treeLeafGeometry.clone(), treeLeafMaterial.clone());
    mesh.position.set(
      treeX + THREE.MathUtils.randFloatSpread(2.2),
      crownY + THREE.MathUtils.randFloatSpread(2.3),
      treeZ + THREE.MathUtils.randFloatSpread(2.2)
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.scale.setScalar(0.8 + Math.random() * 1.4);
    mesh.material.color.setHSL(0.22 + Math.random() * 0.16, 0.65, 0.42 + Math.random() * 0.2);
    scene.add(mesh);

    const angle = Math.random() * Math.PI * 2;
    const speed = (4.8 + Math.random() * 9.5) * burstStrength;
    treeLeafParticles.push({
      mesh,
      vx: Math.cos(angle) * speed,
      vz: Math.sin(angle) * speed,
      vy: (8.5 + Math.random() * 8.5) * burstStrength,
      rvx: THREE.MathUtils.randFloatSpread(7),
      rvy: THREE.MathUtils.randFloatSpread(10),
      rvz: THREE.MathUtils.randFloatSpread(7),
      life: 0.9 + Math.random() * 0.45,
      maxLife: 0.9 + Math.random() * 0.45,
    });
  }
}

function spawnTreeFallSmoke(tree, smokePuffs = 34, scaleMultiplier = 4.8) {
  const treeX = tree.model?.position?.x ?? 0;
  const treeZ = tree.model?.position?.z ?? 0;
  for (let index = 0; index < smokePuffs; index += 1) {
    const angle = (Math.PI * 2 * index) / smokePuffs + (Math.random() - 0.5) * 0.45;
    const dirX = Math.cos(angle);
    const dirZ = Math.sin(angle);
    const radialJitter = 0.6 + Math.random() * 1.8;
    spawnCreepDust(
      { x: treeX + dirX * radialJitter, z: treeZ + dirZ * radialJitter },
      dirX,
      dirZ,
      scaleMultiplier * (1 + Math.random() * 0.75),
      1.9,
      1.35
    );
  }
}

function spawnDroppedHarvestLogPickup(tree, despawnCycles = HARVEST_LOG_DESPAWN_CYCLES) {
  const treeX = tree.model?.position?.x ?? 0;
  const treeZ = tree.model?.position?.z ?? 0;
  const pickupMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.45, 11.5, 12), harvestDroppedLogMaterial.clone());
  pickupMesh.rotation.z = Math.PI * 0.5;
  pickupMesh.rotation.y = Math.random() * Math.PI * 2;
  pickupMesh.position.set(treeX, 1.25, treeZ);
  pickupMesh.castShadow = true;
  pickupMesh.receiveShadow = true;
  scene.add(pickupMesh);

  droppedHarvestLogs.push({
    mesh: pickupMesh,
    woodAmount: Math.max(1, tree.woodYield || 1),
    spawnCycle: worldState.growthCycleCount,
    despawnCycles,
    bobPhase: Math.random() * Math.PI * 2,
    baseY: 1.25,
    magnetized: false,
  });
}

function spawnCreditPickup(x, z, amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const coinGroup = new THREE.Group();
  const coinBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.05, 0.42, 20),
    creditPickupMaterial.clone()
  );
  coinBody.rotation.x = Math.PI * 0.5;
  coinBody.castShadow = true;
  coinBody.receiveShadow = true;
  coinGroup.add(coinBody);

  const coinGlow = new THREE.Mesh(
    new THREE.RingGeometry(0.82, 1.38, 20),
    new THREE.MeshBasicMaterial({ color: 0xffef91, transparent: true, opacity: 0.72, depthWrite: false, side: THREE.DoubleSide })
  );
  coinGlow.rotation.x = -Math.PI * 0.5;
  coinGlow.position.y = 0.02;
  coinGroup.add(coinGlow);

  const floorY = getEffectFloorY(x, z);
  coinGroup.position.set(x, floorY + 1.25, z);
  scene.add(coinGroup);

  droppedCreditPickups.push({
    mesh: coinGroup,
    amount,
    bobPhase: Math.random() * Math.PI * 2,
    baseY: floorY + 1.25,
    magnetized: false,
  });
}

function finalizeHarvestedTree(tree, options = {}) {
  const autoCollect = options.autoCollect !== false;
  const dropPickupCycles = options.dropPickupCycles || 0;

  if (autoCollect && worldState.carriedLogs < MAX_CARRIED_LOGS) {
    const canAdd = Math.min(MAX_CARRIED_LOGS - worldState.carriedLogs, tree.woodYield || 1);
    worldState.carriedLogs += canAdd;
    updateCarriedLogsVisual();
  } else if (!autoCollect && dropPickupCycles > 0) {
    spawnDroppedHarvestLogPickup(tree, dropPickupCycles);
  }

  spawnTreeFallSmoke(tree, 52, 5.6);

  tree.model?.parent?.remove(tree.model);
  tree.model?.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    node.geometry?.dispose?.();
    if (Array.isArray(node.material)) {
      node.material.forEach((material) => material?.dispose?.());
    } else {
      node.material?.dispose?.();
    }
  });

  harvestTrees.splice(harvestTrees.indexOf(tree), 1);

  if (harvestTreePrototypePool.length > 0) {
    const prototype = tree.sourcePrototype || harvestTreePrototypePool[Math.floor(Math.random() * harvestTreePrototypePool.length)];
    const sproutPos = findHarvestTreeSpawnPosition();
    const sprout = prototype.clone(true);
    sprout.position.set(sproutPos.x, 0, sproutPos.z);
    sprout.rotation.y = Math.random() * Math.PI * 2;
    sprout.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(sprout);
    registerHarvestTreeModel(sprout, prototype, tree.baseScale, tree.woodYield || 1, 0);
  } else {
    const fallbackPos = findHarvestTreeSpawnPosition();
    const placeholder = new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 4.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x4c7d45, roughness: 0.9, metalness: 0.02 })
    );
    placeholder.position.set(fallbackPos.x, 2.3, fallbackPos.z);
    scene.add(placeholder);
    registerHarvestTreeModel(placeholder, null, tree.baseScale || 12, tree.woodYield || 1, 0);
  }
}

function performTreeChop(tree) {
  if (worldState.phase !== "day" || worldState.paused || worldState.gameOver || ultimateBunkerSequence.active) {
    return;
  }
  if (!tree) {
    return;
  }
  if (worldState.carriedLogs >= MAX_CARRIED_LOGS) {
    if (playerAxeState.fullAlertCooldown <= 0) {
      showPlayerSpeechBubble("I'm full", 1.1);
      playerAxeState.fullAlertCooldown = 1.1;
    }
    return;
  }

  playerAxeState.swingTimer = playerAxeState.swingDuration;
  spawnAxeSwoosh();
  spawnTreeLeafBurst(tree, 14, 1);

  tree.hitCount += 1;
  if (tree.hitCount === 1) {
    tree.shakeTimer = 0.24;
    return;
  }

  if (!tree.falling) {
    tree.falling = true;
    tree.fallProgress = 0;
    spawnTreeLeafBurst(tree, 30, 1.35);
    spawnTreeFallSmoke(tree, 28, 4.2);
  }
}

function tryChopNearestTree() {
  const tree = getNearestHarvestTree(HARVEST_TREE_INTERACT_RANGE, true);
  performTreeChop(tree);
}

function tryDepositCarriedLogs() {
  if (worldState.carriedLogs <= 0 || worldState.phase !== "day" || worldState.paused || worldState.gameOver) {
    return;
  }
  const distToBunker = Math.hypot(player.x - ULT_BUNKER_POSITION.x, player.z - ULT_BUNKER_POSITION.z);
  if (distToBunker > ULT_BUNKER_HOUSE_RADIUS + 18) {
    return;
  }

  startAutoDepositLogs();
}

function showPlayerSpeechBubble(text, duration = 1.2) {
  if (playerSpeechBubble.sprite) {
    playerMesh.remove(playerSpeechBubble.sprite);
    playerSpeechBubble.sprite.material.map?.dispose?.();
    playerSpeechBubble.sprite.material.dispose?.();
    playerSpeechBubble.sprite = null;
  }
  const sprite = createSpeechBubbleSprite(text);
  sprite.position.set(0, 22, 0);
  playerMesh.add(sprite);
  playerSpeechBubble.sprite = sprite;
  playerSpeechBubble.timer = duration;
}

function updatePlayerSpeechBubble(dt) {
  if (!playerSpeechBubble.sprite) {
    return;
  }
  playerSpeechBubble.timer = Math.max(0, playerSpeechBubble.timer - dt);
  const alpha = Math.min(1, playerSpeechBubble.timer / 0.24);
  playerSpeechBubble.sprite.material.opacity = alpha;
  playerSpeechBubble.sprite.position.y = 22 + (1 - alpha) * 0.8;
  if (playerSpeechBubble.timer <= 0) {
    playerMesh.remove(playerSpeechBubble.sprite);
    playerSpeechBubble.sprite.material.map?.dispose?.();
    playerSpeechBubble.sprite.material.dispose?.();
    playerSpeechBubble.sprite = null;
  }
}

function startAutoDepositLogs() {
  if (worldState.carriedLogs <= 0) {
    return;
  }

  const logCount = worldState.carriedLogs;
  for (let index = 0; index < logCount; index += 1) {
    const life = 0.58 + Math.random() * 0.25;
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.92, 1.2, 10.2, 10),
      new THREE.MeshStandardMaterial({ color: 0x8a6a46, roughness: 0.82, metalness: 0.06, transparent: true, opacity: 0.96 })
    );
    mesh.rotation.z = Math.PI * 0.5;
    mesh.position.set(
      player.x + THREE.MathUtils.randFloatSpread(2.2),
      PLAYER_VISUAL_Y + 3.2 + index * 0.4,
      player.z + THREE.MathUtils.randFloatSpread(2.2)
    );
    mesh.castShadow = true;
    scene.add(mesh);

    woodSuckEffects.push({
      mesh,
      life,
      maxLife: life,
      targetX: ULT_BUNKER_ENTRY_POINT.x,
      targetY: ULT_BUNKER_HOUSE_HEIGHT * 0.5 + 2.5,
      targetZ: ULT_BUNKER_ENTRY_POINT.z,
    });
  }

  worldState.woodStock += logCount;
  worldState.carriedLogs = 0;
  updateCarriedLogsVisual();
}

function updateWoodSuckEffects(dt) {
  for (let index = woodSuckEffects.length - 1; index >= 0; index -= 1) {
    const effect = woodSuckEffects[index];
    effect.life -= dt;
    const alpha = Math.max(0, effect.life / effect.maxLife);
    effect.mesh.position.x += (effect.targetX - effect.mesh.position.x) * Math.min(1, dt * 7.5);
    effect.mesh.position.y += (effect.targetY - effect.mesh.position.y) * Math.min(1, dt * 8.5);
    effect.mesh.position.z += (effect.targetZ - effect.mesh.position.z) * Math.min(1, dt * 7.5);
    effect.mesh.scale.setScalar(Math.max(0.12, alpha));
    effect.mesh.material.opacity = alpha;

    if (effect.life <= 0) {
      scene.remove(effect.mesh);
      effect.mesh.geometry.dispose();
      effect.mesh.material.dispose();
      woodSuckEffects.splice(index, 1);
    }
  }
}

function spawnAxeSwoosh() {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(5.8, 0.28, 8, 26, Math.PI * 0.86),
    axeSwooshBaseMaterial.clone()
  );
  const yaw = player.facingYaw;
  const offset = 4.8;
  mesh.position.set(
    player.x + Math.sin(yaw) * offset,
    PLAYER_VISUAL_Y + 4.4,
    player.z + Math.cos(yaw) * offset
  );
  mesh.rotation.set(0.15, yaw + Math.PI * 0.5, -1.04);
  mesh.scale.setScalar(0.65);
  scene.add(mesh);
  axeSwooshes.push({
    mesh,
    life: 0.2,
    maxLife: 0.2,
    spinDir: Math.random() < 0.5 ? -1 : 1,
  });
}

function updateAxeSwooshes(dt) {
  for (let index = axeSwooshes.length - 1; index >= 0; index -= 1) {
    const swoosh = axeSwooshes[index];
    swoosh.life -= dt;
    const alpha = Math.max(0, swoosh.life / swoosh.maxLife);
    const growth = 1 + (1 - alpha) * 0.9;
    swoosh.mesh.material.opacity = 0.82 * alpha;
    swoosh.mesh.scale.setScalar(0.65 * growth);
    swoosh.mesh.position.y += dt * 6.5;
    swoosh.mesh.rotation.z += dt * 9 * swoosh.spinDir;

    if (swoosh.life <= 0) {
      scene.remove(swoosh.mesh);
      swoosh.mesh.geometry.dispose();
      swoosh.mesh.material.dispose();
      axeSwooshes.splice(index, 1);
    }
  }
}

function knockdownHarvestTreeByCannon(tree, shotDirX = 0, shotDirZ = 0) {
  if (!tree || tree.falling || !tree.model?.parent) {
    return;
  }

  let fallDirX = -shotDirX;
  let fallDirZ = -shotDirZ;
  const shotLen = Math.hypot(fallDirX, fallDirZ);
  if (shotLen > 0.0001) {
    fallDirX /= shotLen;
    fallDirZ /= shotLen;
  } else {
    const awayX = tree.model.position.x;
    const awayZ = tree.model.position.z;
    const awayLen = Math.hypot(awayX, awayZ) || 1;
    fallDirX = awayX / awayLen;
    fallDirZ = awayZ / awayLen;
  }

  tree.fallDirX = fallDirX;
  tree.fallDirZ = fallDirZ;
  tree.fallDropPickupCycles = HARVEST_LOG_DESPAWN_CYCLES;
  tree.falling = true;
  tree.fallProgress = 0;

  spawnTreeLeafBurst(tree, 40, 1.9);
  spawnTreeFallSmoke(tree, 24, 4.2);
}

function updateDroppedHarvestLogs(dt) {
  const pullMultiplier = worldState.pickupPullMultiplier || 1;
  for (let index = droppedHarvestLogs.length - 1; index >= 0; index -= 1) {
    const pickup = droppedHarvestLogs[index];
    if (worldState.growthCycleCount - pickup.spawnCycle >= pickup.despawnCycles) {
      scene.remove(pickup.mesh);
      pickup.mesh.geometry.dispose();
      pickup.mesh.material.dispose();
      droppedHarvestLogs.splice(index, 1);
      continue;
    }

    pickup.bobPhase += dt * 3.2;
    pickup.baseY = getEffectFloorY(pickup.mesh.position.x, pickup.mesh.position.z) + 1.25;
    if (!pickup.magnetized) {
      pickup.mesh.position.y = pickup.baseY + Math.sin(pickup.bobPhase) * 0.14;
    }
    pickup.mesh.rotation.x = Math.sin(pickup.bobPhase * 0.75) * 0.08;

    if (worldState.phase !== "day") {
      continue;
    }

    const distance = Math.hypot(pickup.mesh.position.x - player.x, pickup.mesh.position.z - player.z);
    if (worldState.carriedLogs >= MAX_CARRIED_LOGS) {
      continue;
    }

    if (distance <= HARVEST_LOG_MAGNET_RANGE * pullMultiplier) {
      pickup.magnetized = true;
      const dx = player.x - pickup.mesh.position.x;
      const dz = player.z - pickup.mesh.position.z;
      const len = Math.hypot(dx, dz) || 1;
      const step = Math.min(HARVEST_LOG_MAGNET_SPEED * pullMultiplier * dt, len);
      pickup.mesh.position.x += (dx / len) * step;
      pickup.mesh.position.z += (dz / len) * step;
      const targetY = PLAYER_VISUAL_Y * 0.62;
      pickup.mesh.position.y += (targetY - pickup.mesh.position.y) * Math.min(1, dt * 8.5);
      pickup.mesh.rotation.y += dt * 7.5;
    }

    if (distance > HARVEST_LOG_PICKUP_RANGE) {
      continue;
    }

    const canTake = Math.min(MAX_CARRIED_LOGS - worldState.carriedLogs, pickup.woodAmount);
    if (canTake <= 0) {
      continue;
    }

    worldState.carriedLogs += canTake;
    pickup.woodAmount -= canTake;
    updateCarriedLogsVisual();

    if (pickup.woodAmount <= 0) {
      scene.remove(pickup.mesh);
      pickup.mesh.geometry.dispose();
      pickup.mesh.material.dispose();
      droppedHarvestLogs.splice(index, 1);
    }
  }
}

function updateDroppedCreditPickups(dt) {
  const pullMultiplier = worldState.pickupPullMultiplier || 1;
  for (let index = droppedCreditPickups.length - 1; index >= 0; index -= 1) {
    const pickup = droppedCreditPickups[index];
    if (!pickup.mesh?.parent) {
      droppedCreditPickups.splice(index, 1);
      continue;
    }

    pickup.bobPhase += dt * 3.9;
    pickup.baseY = getEffectFloorY(pickup.mesh.position.x, pickup.mesh.position.z) + 1.25;
    if (!pickup.magnetized) {
      pickup.mesh.position.y = pickup.baseY + Math.sin(pickup.bobPhase) * 0.2;
    }
    pickup.mesh.rotation.y += dt * 2.8;

    const dx = player.x - pickup.mesh.position.x;
    const dz = player.z - pickup.mesh.position.z;
    const distance = Math.hypot(dx, dz);

    if (distance <= CREDIT_PICKUP_MAGNET_RANGE * pullMultiplier) {
      pickup.magnetized = true;
      const len = Math.max(distance, 0.001);
      const step = Math.min(CREDIT_PICKUP_MAGNET_SPEED * pullMultiplier * dt, len);
      pickup.mesh.position.x += (dx / len) * step;
      pickup.mesh.position.z += (dz / len) * step;
      const targetY = PLAYER_VISUAL_Y * 0.66;
      pickup.mesh.position.y += (targetY - pickup.mesh.position.y) * Math.min(1, dt * 9.5);
      pickup.mesh.scale.setScalar(1 + Math.sin(pickup.bobPhase * 2.2) * 0.05);
    }

    if (distance <= CREDIT_PICKUP_COLLECT_RANGE) {
      worldState.credits += pickup.amount;
      scene.remove(pickup.mesh);
      pickup.mesh.traverse?.((node) => {
        if (!node.isMesh) {
          return;
        }
        node.geometry?.dispose?.();
        if (Array.isArray(node.material)) {
          node.material.forEach((material) => material?.dispose?.());
        } else {
          node.material?.dispose?.();
        }
      });
      droppedCreditPickups.splice(index, 1);
    }
  }
}

function updateTreeLeafParticles(dt) {
  for (let index = treeLeafParticles.length - 1; index >= 0; index -= 1) {
    const particle = treeLeafParticles[index];
    particle.life -= dt;
    particle.vy -= 22 * dt;
    particle.mesh.position.x += particle.vx * dt;
    particle.mesh.position.y += particle.vy * dt;
    particle.mesh.position.z += particle.vz * dt;
    particle.mesh.rotation.x += particle.rvx * dt;
    particle.mesh.rotation.y += particle.rvy * dt;
    particle.mesh.rotation.z += particle.rvz * dt;
    const alpha = Math.max(0, particle.life / particle.maxLife);
    particle.mesh.material.opacity = alpha * 0.95;

    if (particle.mesh.position.y <= 0.12 || particle.life <= 0) {
      scene.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      particle.mesh.material.dispose();
      treeLeafParticles.splice(index, 1);
    }
  }
}

function updateCameraFollow(dt) {
  if (cameraOrbit.isDragging) {
    return;
  }

  const playerCenterDist = Math.hypot(player.x, player.z);
  if (playerCenterDist <= CAMERA_HQ_STAY_RADIUS) {
    cameraOrbit.targetX += (0 - cameraOrbit.targetX) * Math.min(1, dt * CAMERA_FOLLOW_LERP);
    cameraOrbit.targetZ += (0 - cameraOrbit.targetZ) * Math.min(1, dt * CAMERA_FOLLOW_LERP);
    applyCameraOrbit();
    return;
  }

  const dx = player.x - cameraOrbit.targetX;
  const dz = player.z - cameraOrbit.targetZ;
  const dist = Math.hypot(dx, dz);
  if (dist <= CAMERA_FOLLOW_DEADZONE) {
    return;
  }

  const excess = dist - CAMERA_FOLLOW_DEADZONE;
  const dirX = dx / dist;
  const dirZ = dz / dist;
  const followStep = excess * Math.min(1, dt * CAMERA_FOLLOW_LERP);
  cameraOrbit.targetX += dirX * followStep;
  cameraOrbit.targetZ += dirZ * followStep;
  applyCameraOrbit();
}

function ensureHarvestTreesPopulation() {
  if (worldState.phase !== "day") {
    return;
  }
  if (harvestTrees.length >= HARVEST_TREE_MIN_ACTIVE) {
    return;
  }
  if (harvestTreePrototypePool.length === 0) {
    return;
  }

  const toSpawn = HARVEST_TREE_MIN_ACTIVE - harvestTrees.length;
  spawnHarvestTrees(toSpawn, HARVEST_TREE_MAX_GROWTH_STAGE);
}

function ensureHarvestStonesPopulation() {
  if (worldState.phase !== "day") {
    return;
  }
  if (harvestStones.length >= HARVEST_STONE_MIN_ACTIVE) {
    return;
  }
  if (harvestStonePrototypePool.length === 0) {
    return;
  }

  spawnHarvestStones(HARVEST_STONE_MIN_ACTIVE - harvestStones.length, HARVEST_STONE_MAX_GROWTH_STAGE);
}

function advanceHarvestTreeGrowthCycle() {
  worldState.growthCycleCount += 1;
  harvestTrees.forEach((tree) => {
    if (tree.growthStage >= HARVEST_TREE_MAX_GROWTH_STAGE) {
      return;
    }
    tree.growthStage += 1;
    const scale = getHarvestGrowthScale(tree.growthStage);
    tree.model.scale.setScalar(tree.baseScale * scale);
    tree.hitCount = 0;
    tree.projectileDamage = 0;
    tree.shakeTimer = 0;
    tree.model.rotation.x = 0;
  });
  spawnHarvestTrees(HARVEST_EXTRA_TREES_PER_DAY, 0);

  harvestStones.forEach((stone) => {
    if (stone.growthStage >= HARVEST_STONE_MAX_GROWTH_STAGE) {
      return;
    }
    stone.growthStage += 1;
    const scale = getHarvestGrowthScale(stone.growthStage);
    stone.model.scale.setScalar(stone.baseScale * scale);
    stone.hitCount = 0;
    stone.shakeTimer = 0;
    stone.model.rotation.set(0, stone.model.rotation.y, 0);
  });
  spawnHarvestStones(HARVEST_EXTRA_STONES_PER_DAY, 0);
}

function updateHarvestTrees(dt) {
  for (let index = harvestTrees.length - 1; index >= 0; index -= 1) {
    const tree = harvestTrees[index];

    if (!tree.model?.parent) {
      harvestTrees.splice(index, 1);
      continue;
    }

    if (tree.falling) {
      tree.fallProgress += dt * 1.9;
      if (Math.hypot(tree.fallDirX || 0, tree.fallDirZ || 0) > 0.0001) {
        tree.model.rotation.y = Math.atan2(tree.fallDirX, tree.fallDirZ);
      }
      const fallAngle = Math.min(1.45, tree.fallProgress * 1.45);
      tree.model.rotation.x = -fallAngle;
      if (tree.fallProgress >= 1) {
        if ((tree.fallDropPickupCycles || 0) > 0) {
          finalizeHarvestedTree(tree, { autoCollect: false, dropPickupCycles: tree.fallDropPickupCycles });
        } else {
          finalizeHarvestedTree(tree);
        }
      }
      continue;
    }

    if (tree.shakeTimer > 0) {
      tree.shakeTimer = Math.max(0, tree.shakeTimer - dt);
      tree.shakePhase += dt * 30;
      const shakeStrength = (tree.shakeTimer / 0.24) * 0.1;
      tree.model.rotation.z = Math.sin(tree.shakePhase) * shakeStrength;
      if (tree.shakeTimer <= 0) {
        tree.model.rotation.z = 0;
      }
    }
  }
}

function updateHarvestStones(dt) {
  for (let index = harvestStones.length - 1; index >= 0; index -= 1) {
    const stone = harvestStones[index];

    if (!stone.model?.parent) {
      harvestStones.splice(index, 1);
      continue;
    }

    if (stone.falling) {
      stone.fallProgress += dt * 2.3;
      stone.model.rotation.x = Math.min(1.2, stone.fallProgress * 1.2);
      stone.model.rotation.z = Math.sin(stone.fallProgress * 8) * 0.08;
      if (stone.fallProgress >= 1) {
        finalizeHarvestedStone(stone);
      }
      continue;
    }

    if (stone.shakeTimer > 0) {
      stone.shakeTimer = Math.max(0, stone.shakeTimer - dt);
      stone.shakePhase += dt * 34;
      const shakeStrength = (stone.shakeTimer / 0.2) * 0.08;
      stone.model.rotation.z = Math.sin(stone.shakePhase) * shakeStrength;
      if (stone.shakeTimer <= 0) {
        stone.model.rotation.z = 0;
      }
    }
  }
}

function updateDayHarvestLoop(dt) {
  if (worldState.phase !== "day" || worldState.gameOver || worldState.paused || ultimateBunkerSequence.active) {
    setAxeEquipped(false);
    playerAxeState.swingTimer = 0;
    playerAxeState.autoChopCooldown = 0;
    playerAxeState.autoMineCooldown = 0;
    playerAxeState.fullAlertCooldown = 0;
    playerAxeMount.rotation.set(0, 0, 0);
    // Keep environmental harvest animations/states advancing outside day
    // so cannon/tree knockdowns resolve immediately instead of batching on phase swaps.
    updateHarvestTrees(dt);
    updateHarvestStones(dt);
    return;
  }

  const isOutsideBase = Math.hypot(player.x, player.z) > BASE_HQ_RADIUS + 6;
  const nearbyTree = getNearestHarvestTree(HARVEST_TREE_AXE_RANGE, true);
  const nearbyStone = getNearestHarvestStone(HARVEST_STONE_AXE_RANGE, true);
  setAxeEquipped(isOutsideBase);

  playerAxeState.autoChopCooldown = Math.max(0, playerAxeState.autoChopCooldown - dt);
  playerAxeState.autoMineCooldown = Math.max(0, playerAxeState.autoMineCooldown - dt);
  playerAxeState.fullAlertCooldown = Math.max(0, playerAxeState.fullAlertCooldown - dt);

  ensureHarvestTreesPopulation();
  ensureHarvestStonesPopulation();

  tryDepositCarriedLogs();

  if (playerAxeState.equipped && nearbyTree && playerAxeState.autoChopCooldown <= 0) {
    performTreeChop(nearbyTree);
    playerAxeState.autoChopCooldown = 0.44;
  }
  if (playerAxeState.equipped && nearbyStone && playerAxeState.autoMineCooldown <= 0) {
    performStoneMine(nearbyStone);
    playerAxeState.autoMineCooldown = 0.48;
  }

  if (playerAxeState.swingTimer > 0) {
    playerAxeState.swingTimer = Math.max(0, playerAxeState.swingTimer - dt);
    const swingAlpha = playerAxeState.swingDuration > 0
      ? 1 - (playerAxeState.swingTimer / playerAxeState.swingDuration)
      : 1;
    playerAxeMount.rotation.z = -Math.sin(swingAlpha * Math.PI) * 1.05;
    playerAxeMount.rotation.x = -Math.sin(swingAlpha * Math.PI) * 0.4;
  } else {
    playerAxeMount.rotation.z *= Math.max(0, 1 - dt * 18);
    playerAxeMount.rotation.x *= Math.max(0, 1 - dt * 18);
  }

  updateHarvestTrees(dt);
  updateHarvestStones(dt);
}

function applyBaseUpgradeVisuals() {
  if (baseFenceMainGroup) {
    baseFenceMainGroup.visible = worldState.baseUpgradeLevel <= 0;
  }
  if (baseFenceInnerGroup) {
    baseFenceInnerGroup.visible = worldState.baseUpgradeLevel === 1;
  }
  if (baseBrickWallGroup) {
    baseBrickWallGroup.visible = worldState.baseUpgradeLevel >= 2;
  }
}

function getActivePerimeterGroup() {
  if (worldState.baseUpgradeLevel >= 2 && baseBrickWallGroup) {
    return baseBrickWallGroup;
  }
  if (worldState.baseUpgradeLevel === 1 && baseFenceInnerGroup) {
    return baseFenceInnerGroup;
  }
  return baseFenceMainGroup;
}

function getSegmentIndexFromAngle(angle) {
  const count = baseFenceSegmentCount || getActivePerimeterGroup()?.userData?.segmentCount || 40;
  const normalized = THREE.MathUtils.euclideanModulo(angle, Math.PI * 2);
  return Math.floor((normalized / (Math.PI * 2)) * count) % count;
}

function ensureBreachAlertSprite() {
  // Legacy no-op: breach alert now uses a HUD banner for better readability.
}

function getCircularSegmentDistance(a, b, segmentCount) {
  const forward = Math.abs(a - b);
  return Math.min(forward, segmentCount - forward);
}

function setTurretDestroyed(turret, destroyed) {
  turret.destroyed = destroyed;
  if (destroyed) {
    turret.destroyedLevel = Math.max(1, turret.level || 1);
    turret.cooldown = 0;
    turret.mountedCooldown = 0;
    spawnCannonBlastEffect(turret.x, turret.z, 14);
    spawnCannonScorchMark(turret.x, turret.z, 12);
  } else {
    turret.level = Math.max(1, turret.destroyedLevel || turret.level || 1);
    turret.cooldown = 0;
    turret.mountedCooldown = 0;
    turret.aimYaw = turretSlotYawByLabel[turret.label] ?? turret.aimYaw;
    turret.mountedAimYaw = turret.aimYaw;
  }
  setTurretDestroyedVisualState(turret, destroyed);
  syncTurretVisualState(turret);
  if (worldState.selectedTurretId === turret.id && destroyed) {
    worldState.selectedTurretId = null;
  }
}

function destroyTurretsNearOpening(openingIndex, segmentCount) {
  turrets.forEach((turret) => {
    if (!turret.owned || turret.destroyed || turret.label === "Middle") {
      return;
    }
    const turretAngle = Math.atan2(turret.z, turret.x);
    const normalized = THREE.MathUtils.euclideanModulo(turretAngle, Math.PI * 2);
    const turretSegment = Math.floor((normalized / (Math.PI * 2)) * segmentCount) % segmentCount;
    const distance = getCircularSegmentDistance(turretSegment, openingIndex, segmentCount);
    if (distance <= 1) {
      setTurretDestroyed(turret, true);
    }
  });
}

function triggerBreach(segmentIndex = -1) {
  if (worldState.breach.active) {
    return false;
  }
  const group = getActivePerimeterGroup();
  const segments = group?.userData?.segmentMeshes;
  if (!group || !segments || segments.length === 0) {
    return false;
  }

  const openingIndex = segmentIndex >= 0
    ? segmentIndex % segments.length
    : (worldState.breach.lastHitSegmentIndex >= 0 ? worldState.breach.lastHitSegmentIndex : 0);

  const openingSegment = segments[openingIndex];
  const openingAngle = Math.atan2(openingSegment.position.z, openingSegment.position.x);

  worldState.breach.active = true;
  worldState.breach.openingIndex = openingIndex;
  worldState.breach.openingPoint.x = Math.cos(openingAngle) * BASE_HQ_RADIUS;
  worldState.breach.openingPoint.z = Math.sin(openingAngle) * BASE_HQ_RADIUS;
  worldState.breach.modifiedSegments = [];
  worldState.breach.bunkerHp = worldState.breach.bunkerMaxHp;
  const anglePerSegment = (Math.PI * 2) / segments.length;

  enemies.forEach((enemy) => {
    const hitRadius = getEnemyHitRadius(enemy);
    const ringDistance = Math.abs(Math.hypot(enemy.x, enemy.z) - BASE_HQ_RADIUS);
    const enemyAngle = Math.atan2(enemy.z, enemy.x);
    const angleDelta = THREE.MathUtils.euclideanModulo(enemyAngle - openingAngle + Math.PI, Math.PI * 2) - Math.PI;
    const nearOpeningArc = Math.abs(angleDelta) <= anglePerSegment * 1.5;
    const nearOpeningPoint = Math.hypot(enemy.x - worldState.breach.openingPoint.x, enemy.z - worldState.breach.openingPoint.z) <= 24;
    enemy.breachDirect = ringDistance <= (hitRadius + 8) && (nearOpeningArc || nearOpeningPoint);
  });

  destroyTurretsNearOpening(openingIndex, segments.length);

  const offsets = [-1, 0, 1];
  offsets.forEach((offset) => {
    const idx = (openingIndex + offset + segments.length) % segments.length;
    const segment = segments[idx];
    if (!segment) {
      return;
    }

    worldState.breach.modifiedSegments.push({
      segment,
      visible: segment.visible,
      rotationY: segment.rotation.y,
    });

    const worldPos = new THREE.Vector3();
    segment.getWorldPosition(worldPos);
    spawnCannonBlastEffect(worldPos.x, worldPos.z, 12);

    if (offset === 0) {
      segment.visible = false;
    } else {
      segment.rotation.y += offset < 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
    }
  });

  ensureBreachAlertSprite();
  breachAlertBannerEl.style.display = "block";
  return true;
}

function closeBreach() {
  worldState.breach.modifiedSegments.forEach((entry) => {
    if (!entry.segment) {
      return;
    }
    entry.segment.visible = entry.visible;
    entry.segment.rotation.y = entry.rotationY;
  });
  worldState.breach.modifiedSegments = [];
  worldState.breach.active = false;
  worldState.breach.openingIndex = -1;
  worldState.breach.openingPoint.x = 0;
  worldState.breach.openingPoint.z = 0;
  worldState.breach.lastHitSegmentIndex = -1;
  worldState.breach.bunkerHp = worldState.breach.bunkerMaxHp;
  base.hp = base.maxHp;
  enemies.forEach((enemy) => {
    enemy.breachDirect = false;
  });
  breachAlertBannerEl.style.display = "none";
}

function updateBreachEffects(nowSeconds) {
  if (!worldState.breach.active) {
    breachSirenLight.intensity = 0;
    breachAlertBannerEl.style.display = "none";
    breachSirenBeacon.redLensMat.emissiveIntensity = 0.22;
    breachSirenBeacon.blueLensMat.emissiveIntensity = 0.22;
    return;
  }
  ensureBreachAlertSprite();
  breachAlertBannerEl.style.display = "block";

  const pulse = (Math.sin(nowSeconds * 12) + 1) * 0.5;
  breachSirenLight.intensity = 1.8 + pulse * 2.2;
  breachSirenLight.color.setHex(pulse > 0.5 ? 0xff3344 : 0x3377ff);
  breachSirenBeacon.rotator.rotation.y = nowSeconds * 8;
  breachSirenBeacon.redLensMat.emissiveIntensity = 0.35 + pulse * 1.95;
  breachSirenBeacon.blueLensMat.emissiveIntensity = 0.35 + (1 - pulse) * 1.95;
  breachAlertBannerEl.style.opacity = `${0.72 + pulse * 0.28}`;
  breachAlertBannerEl.style.transform = `translateX(-50%) scale(${1 + pulse * 0.025})`;
}

function loadReloadPropsModels() {
  if (reloadPropsLoadStarted || (clipLargePrototype && clipSmallPrototype && bulletFoamThickPrototype)) {
    return;
  }
  reloadPropsLoadStarted = true;

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        reloadPropsLoadStarted = false;
        return;
      }

      const loadClip = (path, onLoaded) => {
        loader.load(
          path,
          (gltf) => {
            try {
              const clipModel = gltf.scene;
              clipModel.traverse((node) => {
                if (!node.isMesh) {
                  return;
                }
                node.castShadow = true;
                node.receiveShadow = false;
              });

              const box = new THREE.Box3().setFromObject(clipModel);
              const size = new THREE.Vector3();
              box.getSize(size);
              const longestSide = Math.max(0.001, size.x, size.y, size.z);
              const scale = 1.8 / longestSide;
              clipModel.scale.setScalar(scale);

              const centeredBox = new THREE.Box3().setFromObject(clipModel);
              const centerX = (centeredBox.min.x + centeredBox.max.x) * 0.5;
              const centerY = (centeredBox.min.y + centeredBox.max.y) * 0.5;
              const centerZ = (centeredBox.min.z + centeredBox.max.z) * 0.5;
              clipModel.position.set(-centerX, -centerY, -centerZ);

              onLoaded(clipModel);
            } catch {}
          },
          undefined,
          () => {}
        );
      };

      loadClip(CLIP_LARGE_MODEL_PATH, (model) => {
        clipLargePrototype = model;
      });
      loadClip(CLIP_SMALL_MODEL_PATH, (model) => {
        clipSmallPrototype = model;
      });
      loadClip(BULLET_FOAM_THICK_MODEL_PATH, (model) => {
        bulletFoamThickPrototype = model;
      });
    })
    .catch(() => {
      reloadPropsLoadStarted = false;
    });
}

const worldState = {
  keys: new Set(),
  paused: false,
  gameOver: false,
  highScore: Number(localStorage.getItem("baseDefenseHighScore") || 0),
  credits: 0,
  woodStock: 0,
  stoneStock: 0,
  carriedLogs: 0,
  growthCycleCount: 0,
  totalKills: 0,
  phase: "day",
  dayNumber: 1,
  nightNumber: 0,
  dayLength: 90,
  nightLength: 45,
  dayTimer: 0,
  nightTimer: 0,
  isBossWave: false,
  spawnedThisNight: 0,
  totalNightEnemies: 0,
  defeatedThisNight: 0,
  spawnAccumulator: 0,
  secondWavePending: 0,
  secondWaveTimer: 0,
  thirdWavePending: 0,
  thirdWaveTimer: 0,
  fourthWavePending: 0,
  fourthWaveTimer: 0,
  fifthWavePending: 0,
  fifthWaveTimer: 0,
  timeScaleDay: 1,
  devMode: false,
  baseUpgradeLevel: 0,
  activeShopTab: "player",
  pickupPullLevel: 0,
  pickupPullMultiplier: 1,
  breach: {
    active: false,
    openingIndex: -1,
    openingPoint: { x: 0, z: 0 },
    modifiedSegments: [],
    lastHitSegmentIndex: -1,
    bunkerHp: BREACH_BUNKER_MAX_HP,
    bunkerMaxHp: BREACH_BUNKER_MAX_HP,
  },
  selectedTurretId: null,
  ownedWeapons: new Set(["glock"]),
  ownedAttachments: new Set(),
  ultimate: {
    cooldown: 60,
    timer: 0,
    hasStarted: true,
    damage: 120,
    radius: 260,
  },
};

function updateDevModeButtonUi() {
  if (!devModeBtnEl) {
    return;
  }
  if (worldState.devMode) {
    devModeBtnEl.textContent = "Dev Mode: ON";
    devModeBtnEl.style.borderColor = "rgba(130, 214, 154, 0.95)";
    devModeBtnEl.style.background = "rgba(13, 38, 22, 0.92)";
    return;
  }
  devModeBtnEl.textContent = "Dev Mode: OFF";
  devModeBtnEl.style.borderColor = "rgba(142, 166, 206, 0.75)";
  devModeBtnEl.style.background = "rgba(10, 18, 30, 0.9)";
}

function setDevMode(enabled) {
  worldState.devMode = !!enabled;
  updateDevModeButtonUi();
  updateShopUi();
}

devModeBtnEl?.addEventListener("click", () => {
  setDevMode(!worldState.devMode);
});

function hasExtendedMag(weaponId) {
  const attachment = attachmentByWeaponId.get(weaponId);
  return !!attachment && worldState.ownedAttachments.has(attachment.id);
}

function updateWeaponHudIcons() {
  const weaponId = player.weaponId;
  const weaponIconPath = weaponIconById[weaponId];
  if (weaponIconPath && ammoIconEl) {
    ammoIconEl.src = weaponIconPath;
    const hudScale = weaponIconScaleById[weaponId] || 1;
    ammoIconEl.style.transform = `scale(${hudScale})`;
    ammoIconEl.style.transformOrigin = "center";
  }

  if (!ammoAttachmentIconEl) {
    return;
  }

  if (hasExtendedMag(weaponId)) {
    const attachmentIconPath = attachmentIconByWeaponId[weaponId];
    if (attachmentIconPath) {
      ammoAttachmentIconEl.src = attachmentIconPath;
    }
    ammoAttachmentIconEl.classList.add("show");
  } else {
    ammoAttachmentIconEl.classList.remove("show");
  }
}

function setShopButtonContent(button, label, iconPath, emojiFallback = "") {
  const iconMarkup = iconPath
    ? `<img class="shop-icon" src="${iconPath}" alt="" aria-hidden="true" />`
    : `<span class="shop-icon-emoji" aria-hidden="true">${emojiFallback}</span>`;
  button.innerHTML = `<span class="shop-btn-content">${iconMarkup}<span class="shop-btn-text">${label}</span></span>`;
}

function setWeaponShopCardContent(button, weaponId, weaponName, actionText, iconPath) {
  const iconScale = weaponIconScaleById[weaponId] || 1;
  const iconStyle = iconScale === 1 ? "" : ` style=\"transform: scale(${iconScale}); transform-origin: center;\"`;
  const iconMarkup = iconPath
    ? `<img class="weapon-shop-icon" src="${iconPath}" alt="" aria-hidden="true"${iconStyle} />`
    : '<span class="weapon-shop-icon-emoji" aria-hidden="true">🔫</span>';
  button.innerHTML = `
    <div class="weapon-shop-card">
      <div class="weapon-shop-card-icon">${iconMarkup}</div>
      <div class="weapon-shop-card-text">${weaponName} - ${actionText}</div>
    </div>
  `;
}

function setTurretShopCardContent(button, config) {
  const {
    direction,
    level,
    type,
    range,
    damage,
    fireRate,
    actionLabel,
    showUpgradeIcon,
  } = config;
  const shotsPerSecond = fireRate > 0 ? (1 / fireRate).toFixed(1) : "0.0";
  button.innerHTML = `
    <div class="turret-card">
      <div class="turret-card-head">
        <span class="turret-card-name">Lv${level} ${type}</span>
        <span class="turret-card-dir-badge">${direction}</span>
      </div>
      <div class="turret-card-statline">
        <span>DMG ${damage}</span>
        <span>RNG ${Math.round(range)}</span>
        <span>ROF ${shotsPerSecond}/s</span>
      </div>
      <div class="turret-card-action">
        <span>${actionLabel}</span>
        ${showUpgradeIcon ? '<span class="turret-upgrade-icon" aria-hidden="true">^^</span>' : ""}
      </div>
    </div>
  `;
}

function getTurretCompassSlot(label) {
  if (label === "Top") {
    return "north";
  }
  if (label === "Bottom") {
    return "south";
  }
  if (label === "Left") {
    return "west";
  }
  if (label === "Right") {
    return "east";
  }
  return "center";
}

function getTurretDirectionLabel(label) {
  const slot = getTurretCompassSlot(label);
  if (slot === "north") {
    return "North";
  }
  if (slot === "south") {
    return "South";
  }
  if (slot === "west") {
    return "West";
  }
  if (slot === "east") {
    return "East";
  }
  return "Center";
}

function getWeaponMagSize(weaponId) {
  const weapon = weaponById.get(weaponId);
  if (!weapon) {
    return 0;
  }
  return hasExtendedMag(weaponId) ? Math.ceil(weapon.magSize * 1.5) : weapon.magSize;
}

function setPlayerWeapon(weaponId) {
  const weapon = weaponById.get(weaponId);
  if (!weapon) {
    return;
  }
  player.weaponId = weapon.id;
  player.fireRate = weapon.fireRate;
  player.damage = weapon.damage;
  player.bulletSpeed = weapon.speed;
  player.reloadTime = weapon.reloadTime;
  player.magSize = getWeaponMagSize(weapon.id);
  player.ammoInMag = player.magSize;
  player.reloadTimer = 0;
  player.isReloading = false;
  if (currentWeaponEl) {
    currentWeaponEl.textContent = `Weapon: ${weapon.name}`;
  }
  if (weaponHudNameEl) {
    weaponHudNameEl.textContent = `Weapon: ${weapon.name}`;
  }
  updateWeaponHudIcons();
  updatePlayerWeaponModel();
}

function buyOrEquipWeapon(weaponId) {
  const weapon = weaponById.get(weaponId);
  if (!weapon) {
    return;
  }
  if (worldState.ownedWeapons.has(weaponId)) {
    setPlayerWeapon(weaponId);
    return;
  }
  if (!worldState.devMode && worldState.credits < weapon.cost) {
    return;
  }
  if (!worldState.devMode) {
    worldState.credits -= weapon.cost;
  }
  worldState.ownedWeapons.add(weaponId);
  setPlayerWeapon(weaponId);
}

function buyAttachment(attachmentId) {
  const attachment = attachmentById.get(attachmentId);
  if (!attachment) {
    return;
  }
  if (!worldState.ownedWeapons.has(attachment.weaponId)) {
    return;
  }
  if (worldState.ownedAttachments.has(attachment.id) || (!worldState.devMode && worldState.credits < attachment.cost)) {
    return;
  }
  if (!worldState.devMode) {
    worldState.credits -= attachment.cost;
  }
  worldState.ownedAttachments.add(attachment.id);
  if (player.weaponId === attachment.weaponId) {
    player.magSize = getWeaponMagSize(player.weaponId);
    player.ammoInMag = player.magSize;
  }
}

function buyPickupPullUpgrade(level) {
  const upgrade = pickupPullUpgrades.find((item) => item.level === level);
  if (!upgrade) {
    return;
  }
  if (worldState.pickupPullLevel !== level - 1) {
    return;
  }
  if (!worldState.devMode && worldState.credits < upgrade.cost) {
    return;
  }
  if (!worldState.devMode) {
    worldState.credits -= upgrade.cost;
  }
  worldState.pickupPullLevel = level;
  worldState.pickupPullMultiplier = upgrade.multiplier;
}

function buyRepair(repairId) {
  const repair = repairs.find((item) => item.id === repairId);
  if (!repair) {
    return;
  }

  if (repair.target === "breach") {
    if (!worldState.breach.active || worldState.phase !== "day" || (!worldState.devMode && worldState.woodStock < repair.cost)) {
      return;
    }
    if (!worldState.devMode) {
      worldState.woodStock -= repair.cost;
    }
    closeBreach();
    return;
  }

  if (repair.target === "bunker") {
    if (!worldState.breach.active || (!worldState.devMode && worldState.credits < repair.cost) || worldState.breach.bunkerHp >= worldState.breach.bunkerMaxHp) {
      return;
    }
    if (!worldState.devMode) {
      worldState.credits -= repair.cost;
    }
    worldState.breach.bunkerHp = Math.min(worldState.breach.bunkerMaxHp, worldState.breach.bunkerHp + repair.hp);
    return;
  }

  if ((!worldState.devMode && worldState.credits < repair.cost) || base.hp >= base.maxHp) {
    return;
  }
  if (!worldState.devMode) {
    worldState.credits -= repair.cost;
  }
  base.hp = Math.min(base.maxHp, base.hp + repair.hp);
}

function buyBaseUpgrade(level) {
  if (level < 1 || level > baseUpgradeCosts.length) {
    return;
  }
  if (worldState.baseUpgradeLevel !== level - 1) {
    return;
  }
  const woodCost = baseUpgradeWoodCosts[level - 1] || 0;
  const stoneCost = baseUpgradeStoneCosts[level - 1] || 0;
  if (!worldState.devMode && (worldState.woodStock < woodCost || worldState.stoneStock < stoneCost)) {
    return;
  }
  const targetMaxHp = BASE_HP_TIERS[level];
  if (!targetMaxHp) {
    return;
  }
  if (!worldState.devMode) {
    worldState.woodStock -= woodCost;
    worldState.stoneStock -= stoneCost;
  }
  const missingHp = Math.max(0, base.maxHp - base.hp);
  worldState.baseUpgradeLevel = level;
  base.maxHp = targetMaxHp;
  base.hp = Math.max(0, base.maxHp - missingHp);
  applyBaseUpgradeVisuals();
}

function buyOrUpgradeTurret(turretId) {
  const turret = turrets.find((item) => item.id === turretId);
  if (!turret) {
    return;
  }
  if (turret.destroyed) {
    if (!worldState.devMode && worldState.credits < turretRepairCost) {
      return;
    }
    if (!worldState.devMode) {
      worldState.credits -= turretRepairCost;
    }
    setTurretDestroyed(turret, false);
    return;
  }
  if (!turret.owned) {
    if (!worldState.devMode && worldState.credits < turretBuyCost) {
      return;
    }
    if (!worldState.devMode) {
      worldState.credits -= turretBuyCost;
    }
    turret.owned = true;
    turret.level = 1;
    return;
  }
  if (turret.level >= 6) {
    return;
  }
  const cost = turretUpgradeCosts[turret.level - 1];
  if (!worldState.devMode && worldState.credits < cost) {
    return;
  }
  if (!worldState.devMode) {
    worldState.credits -= cost;
  }
  turret.level += 1;
}

function setShopModalOpen(open) {
  const canOpen = worldState.phase === "day" && !worldState.gameOver;
  const shouldOpen = open && canOpen;
  shopModalEl.classList.toggle("hidden", !shouldOpen);
}

function setActiveShopTab(tab) {
  const nextTab = tab === "base" || tab === "turrets" ? tab : "player";
  worldState.activeShopTab = nextTab;

  const tabMeta = [
    { id: "player", button: shopTabPlayerEl, panel: shopPanelPlayerEl },
    { id: "base", button: shopTabBaseEl, panel: shopPanelBaseEl },
    { id: "turrets", button: shopTabTurretsEl, panel: shopPanelTurretsEl },
  ];

  tabMeta.forEach(({ id, button, panel }) => {
    const active = id === nextTab;
    button?.classList.toggle("active", active);
    button?.setAttribute("aria-selected", active ? "true" : "false");
    if (panel) {
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    }
  });
}

function initShopUi() {
  shopTabTurretsEl?.addEventListener("click", () => setActiveShopTab("turrets"));
  shopTabBaseEl?.addEventListener("click", () => setActiveShopTab("base"));
  shopTabPlayerEl?.addEventListener("click", () => setActiveShopTab("player"));
  shopTabsEl?.addEventListener("click", (event) => {
    const button = event.target.closest(".shop-tab-btn");
    if (!button) {
      return;
    }
    if (button.id === "shopTabBase") {
      setActiveShopTab("base");
      return;
    }
    if (button.id === "shopTabPlayer") {
      setActiveShopTab("player");
      return;
    }
    setActiveShopTab("turrets");
  });

  weapons.forEach((weapon) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.weaponId = weapon.id;
    button.addEventListener("click", () => {
      buyOrEquipWeapon(weapon.id);
      updateShopUi();
    });
    shopWeaponListEl.appendChild(button);
  });

  attachments.forEach((attachment) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.attachmentId = attachment.id;
    button.addEventListener("click", () => {
      buyAttachment(attachment.id);
      updateShopUi();
    });
    shopAttachmentListEl.appendChild(button);
  });

  pickupPullUpgrades.forEach((upgrade) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.pickupPullUpgradeLevel = String(upgrade.level);
    button.addEventListener("click", () => {
      buyPickupPullUpgrade(upgrade.level);
      updateShopUi();
    });
    shopAttachmentListEl.appendChild(button);
  });

  repairs.forEach((repair) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.repairId = repair.id;
    button.addEventListener("click", () => {
      buyRepair(repair.id);
      updateShopUi();
    });
    shopRepairListEl.appendChild(button);
  });

  baseUpgradeCosts.forEach((_, index) => {
    const level = index + 1;
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.baseUpgradeLevel = String(level);
    button.addEventListener("click", () => {
      buyBaseUpgrade(level);
      updateShopUi();
    });
    shopBaseUpgradeListEl.appendChild(button);
  });

  turrets.forEach((turret) => {
    const button = document.createElement("button");
    button.className = "shop-btn";
    button.dataset.turretId = String(turret.id);
    button.dataset.slot = getTurretCompassSlot(turret.label);
    button.addEventListener("click", () => {
      buyOrUpgradeTurret(turret.id);
      updateShopUi();
    });
    shopTurretListEl.appendChild(button);
  });

  setActiveShopTab(worldState.activeShopTab);
}

function updateShopUi() {
  shopWeaponListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const weapon = weaponById.get(button.dataset.weaponId);
    const isOwned = worldState.ownedWeapons.has(weapon.id);
    const isEquipped = player.weaponId === weapon.id;
    const canBuy = worldState.devMode || worldState.credits >= weapon.cost;
    button.disabled = !isOwned && !canBuy;
    if (isEquipped) {
      setWeaponShopCardContent(button, weapon.id, weapon.name, "Equipped", weaponIconById[weapon.id]);
    } else if (isOwned) {
      setWeaponShopCardContent(button, weapon.id, weapon.name, "Equip", weaponIconById[weapon.id]);
    } else {
      setWeaponShopCardContent(button, weapon.id, weapon.name, `Buy for ${weapon.cost}`, weaponIconById[weapon.id]);
    }
  });

  shopAttachmentListEl.querySelectorAll("[data-attachment-id]").forEach((button) => {
    const attachment = attachmentById.get(button.dataset.attachmentId);
    const hasWeapon = worldState.ownedWeapons.has(attachment.weaponId);
    const owned = worldState.ownedAttachments.has(attachment.id);
    const canBuy = hasWeapon && !owned && (worldState.devMode || worldState.credits >= attachment.cost);
    button.disabled = !owned && !canBuy;
    if (!hasWeapon) {
      setShopButtonContent(button, `${attachment.name} · Need weapon`, attachmentIconByWeaponId[attachment.weaponId], "📦");
    } else if (owned) {
      setShopButtonContent(button, `${attachment.name} · Owned`, attachmentIconByWeaponId[attachment.weaponId], "📦");
    } else {
      setShopButtonContent(button, `${attachment.name} · Buy ${attachment.cost}`, attachmentIconByWeaponId[attachment.weaponId], "📦");
    }
  });

  shopAttachmentListEl.querySelectorAll("[data-pickup-pull-upgrade-level]").forEach((button) => {
    const level = Number(button.dataset.pickupPullUpgradeLevel);
    const upgrade = pickupPullUpgrades.find((item) => item.level === level);
    if (!upgrade) {
      return;
    }

    const owned = worldState.pickupPullLevel >= level;
    const canBuy =
      worldState.pickupPullLevel === level - 1 &&
      (worldState.devMode || worldState.credits >= upgrade.cost);
    button.disabled = !owned && !canBuy;

    const label = owned
      ? `Pickup Pull x${upgrade.multiplier} · Owned`
      : `Pickup Pull x${upgrade.multiplier} · Buy ${upgrade.cost}`;
    setShopButtonContent(button, label, "", "🧲");
  });

  shopRepairListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const repair = repairs.find((item) => item.id === button.dataset.repairId);
    let canBuy = false;
    if (repair.target === "breach") {
      canBuy = worldState.breach.active && worldState.phase === "day" && (worldState.devMode || worldState.woodStock >= repair.cost);
    } else if (repair.target === "bunker") {
      canBuy = worldState.breach.active && (worldState.devMode || worldState.credits >= repair.cost) && worldState.breach.bunkerHp < worldState.breach.bunkerMaxHp;
    } else {
      canBuy = (worldState.devMode || worldState.credits >= repair.cost) && base.hp < base.maxHp;
    }
    button.disabled = !canBuy;
    const repairCostLabel = repair.resource === "wood" ? `${repair.cost} Wood` : `${repair.cost}`;
    setShopButtonContent(button, `${repair.name} · ${repairCostLabel}`, "", "🛠️");
  });

  shopBaseUpgradeListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const level = Number(button.dataset.baseUpgradeLevel);
    const owned = worldState.baseUpgradeLevel >= level;
    const woodCost = baseUpgradeWoodCosts[level - 1] || 0;
    const stoneCost = baseUpgradeStoneCosts[level - 1] || 0;
    const canBuy =
      worldState.baseUpgradeLevel === level - 1 &&
      (worldState.devMode || (worldState.woodStock >= woodCost && worldState.stoneStock >= stoneCost));
    button.disabled = !canBuy;
    const costText = stoneCost > 0
      ? `${woodCost} Wood + ${stoneCost} Stone`
      : `${woodCost} Wood`;
    setShopButtonContent(button, owned ? `Wall Lv${level} · Owned` : `Wall Lv${level} · ${costText}`, "", "🧱");
  });

  shopTurretListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const turret = turrets.find((item) => item.id === Number(button.dataset.turretId));
    const turretDirection = getTurretDirectionLabel(turret.label);
    const levelValue = Math.max(1, turret.level || 1);
    const levelType = turretTypeLabelByLevel[levelValue] || "Turret";
    const rangeValue = turretRangeByLevel[levelValue] || turretRangeByLevel[1];
    const stats = turretStatsByLevel[levelValue] || turretStatsByLevel[1];
    if (turret.destroyed) {
      const canRepair = worldState.devMode || worldState.credits >= turretRepairCost;
      button.disabled = !canRepair;
      setTurretShopCardContent(button, {
        direction: turretDirection,
        level: Math.max(1, turret.destroyedLevel || turret.level || 1),
        type: "Destroyed",
        range: 0,
        damage: 0,
        fireRate: 0,
        actionLabel: `Repair ${turretRepairCost}`,
        showUpgradeIcon: false,
      });
      button.title = `${turretDirection} Turret\nDestroyed by breach\nRepair cost: ${turretRepairCost}`;
      return;
    }
    if (!turret.owned) {
      const canBuy = worldState.devMode || worldState.credits >= turretBuyCost;
      button.disabled = !canBuy;
      const levelOneStats = turretStatsByLevel[1] || { damage: 0, fireRate: 1 };
      setTurretShopCardContent(button, {
        direction: turretDirection,
        level: 1,
        type: turretTypeLabelByLevel[1],
        range: turretRangeByLevel[1],
        damage: levelOneStats.damage,
        fireRate: levelOneStats.fireRate,
        actionLabel: `Buy ${turretBuyCost}`,
        showUpgradeIcon: false,
      });
      button.title = `${turretDirection} Turret\nLv1 Type: ${turretTypeLabelByLevel[1]}\nRange: ${turretRangeByLevel[1]}`;
      return;
    }
    if (turret.level >= 6) {
      button.disabled = true;
      setTurretShopCardContent(button, {
        direction: turretDirection,
        level: turret.level,
        type: levelType,
        range: rangeValue,
        damage: stats.damage,
        fireRate: stats.fireRate,
        actionLabel: "MAXED",
        showUpgradeIcon: false,
      });
      button.title = `${turretDirection} Turret\nCurrent: Lv${turret.level} ${levelType}\nRange: ${rangeValue}`;
      return;
    }
    const cost = turretUpgradeCosts[turret.level - 1];
    button.disabled = !worldState.devMode && worldState.credits < cost;
    const nextType = turretTypeLabelByLevel[turret.level + 1] || "Turret";
    setTurretShopCardContent(button, {
      direction: turretDirection,
      level: turret.level,
      type: levelType,
      range: rangeValue,
      damage: stats.damage,
      fireRate: stats.fireRate,
      actionLabel: `Upgrade ${cost} → Lv${turret.level + 1} ${nextType}`,
      showUpgradeIcon: true,
    });
    button.title = `${turretDirection} Turret\nCurrent: Lv${turret.level} ${levelType}\nRange: ${rangeValue}`;
  });
}

function clampPosition() {
  const halfW = worldSize.width / 2 - 8;
  const halfD = worldSize.depth / 2 - 8;
  player.x = Math.max(-halfW, Math.min(halfW, player.x));
  player.z = Math.max(-halfD, Math.min(halfD, player.z));

  const dx = player.x - ULT_BUNKER_POSITION.x;
  const dz = player.z - ULT_BUNKER_POSITION.z;
  const dist = Math.hypot(dx, dz);
  if (dist > 0.0001 && dist < ULT_BUNKER_COLLISION_RADIUS) {
    const push = ULT_BUNKER_COLLISION_RADIUS / dist;
    player.x = ULT_BUNKER_POSITION.x + dx * push;
    player.z = ULT_BUNKER_POSITION.z + dz * push;
  }
}

function getBaseNightEnemyCount(nightNumber) {
  return (12 + (nightNumber - 1) * 4) * 2;
}

function getNightEnemyTierChances(nightNumber) {
  const level4Chance = nightNumber >= 20 ? Math.min(0.22, 0.08 + (nightNumber - 20) * 0.0025) : 0;
  const level3Chance = nightNumber >= 10 ? Math.min(0.22, 0.08 + (nightNumber - 10) * 0.02) : 0;
  const level2Chance = nightNumber >= 3 ? 0.23 : 0;
  const level1Chance = Math.max(0, 1 - level4Chance - level3Chance - level2Chance);
  return {
    level4Chance,
    level3Chance,
    level2Chance,
    level1Chance,
  };
}

const ENEMY_SIZE_SCALE = 0.75;
const regularEnemyTiers = {
  level4: {
    hp: 160,
    speedMin: 122,
    speedMax: 140,
    damage: 30,
    reward: 35,
    radius: 8.4 * ENEMY_SIZE_SCALE,
    color: 0x7f9bff,
    modelTier: 4,
    modelScale: 1.6,
    animationSpeed: 2,
    facingOffset: CHARACTER_FACING_OFFSET_BY_TIER[4],
  },
  level3: {
    hp: 160,
    speedMin: 48,
    speedMax: 62,
    damage: 26,
    reward: 30,
    radius: 9.8 * ENEMY_SIZE_SCALE,
    color: 0xff8f72,
    modelTier: 3,
    modelScale: 1.4,
    animationSpeed: 1,
    facingOffset: CHARACTER_FACING_OFFSET_BY_TIER[3],
  },
  level2: {
    hp: 72,
    speedMin: 48,
    speedMax: 70,
    damage: 14,
    reward: 21,
    radius: 7.5 * ENEMY_SIZE_SCALE,
    color: 0xf0c95f,
    modelTier: 2,
    modelScale: 1.2,
    animationSpeed: 1,
    facingOffset: CHARACTER_FACING_OFFSET_BY_TIER[2],
  },
  level1: {
    hp: 46,
    speedMin: 34,
    speedMax: 46,
    damage: 9.9,
    reward: 13.5,
    radius: 6.5 * ENEMY_SIZE_SCALE,
    color: 0x6ce36c,
    useGhostModel: true,
    modelTier: 1,
    modelScale: 1,
    animationSpeed: 1,
    facingOffset: CHARACTER_FACING_OFFSET_BY_TIER[1],
  },
};

function getExpectedEnemyStatsForNight(nightNumber) {
  const chances = getNightEnemyTierChances(nightNumber);
  const tierList = [
    { chance: chances.level4Chance, stats: regularEnemyTiers.level4 },
    { chance: chances.level3Chance, stats: regularEnemyTiers.level3 },
    { chance: chances.level2Chance, stats: regularEnemyTiers.level2 },
    { chance: chances.level1Chance, stats: regularEnemyTiers.level1 },
  ];

  return tierList.reduce(
    (acc, tier) => {
      acc.hp += tier.stats.hp * tier.chance;
      acc.reward += tier.stats.reward * tier.chance;
      acc.damage += tier.stats.damage * tier.chance;
      acc.speedMin += tier.stats.speedMin * tier.chance;
      acc.speedMax += tier.stats.speedMax * tier.chance;
      return acc;
    },
    { hp: 0, reward: 0, damage: 0, speedMin: 0, speedMax: 0 }
  );
}

function getBossEnemyTypeForNight(nightNumber) {
  const regularEnemyCount = getBaseNightEnemyCount(nightNumber);
  const expected = getExpectedEnemyStatsForNight(nightNumber);
  const expectedHordeHp = Math.max(1, expected.hp * regularEnemyCount);
  const expectedHordeReward = Math.max(2, Math.round(expected.reward * regularEnemyCount));

  return {
    hp: Math.round(expectedHordeHp),
    speedMin: Math.max(18, expected.speedMin * 0.45),
    speedMax: Math.max(24, expected.speedMax * 0.52),
    damage: Math.max(22, expected.damage * 2.4),
    reward: Math.max(1, Math.floor(expectedHordeReward / 2)),
    radius: 18.5,
    hitRadius: regularEnemyTiers.level2.radius * 1,
    color: 0xc58dff,
    modelTier: 2,
    modelScale: 2.35,
    facingOffset: CHARACTER_FACING_OFFSET_BY_TIER[2],
    isBoss: true,
  };
}

function getEnemyHitRadius(enemy) {
  return enemy.hitRadius ?? enemy.radius;
}

function getEnemyTypeForNight() {
  const night = worldState.nightNumber;
  if (worldState.isBossWave) {
    return getBossEnemyTypeForNight(night);
  }

  const roll = Math.random();
  const { level4Chance, level3Chance, level2Chance } = getNightEnemyTierChances(night);

  if (roll < level4Chance) {
    return { ...regularEnemyTiers.level4 };
  }
  if (roll < level4Chance + level3Chance) {
    return { ...regularEnemyTiers.level3 };
  }
  if (roll < level4Chance + level3Chance + level2Chance) {
    return { ...regularEnemyTiers.level2 };
  }
  return { ...regularEnemyTiers.level1 };
}

function createBossHealthBar(enemyRadius) {
  const barGroup = new THREE.Group();
  const barWidth = 20;
  const barHeight = 2.6;
  const fillWidth = barWidth - 0.8;

  const bgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(barWidth, barHeight),
    new THREE.MeshBasicMaterial({
      color: 0x182536,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false,
    })
  );
  barGroup.add(bgMesh);

  const fillMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(fillWidth, barHeight - 0.8),
    new THREE.MeshBasicMaterial({
      color: 0x62f59b,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false,
    })
  );
  fillMesh.position.z = 0.03;
  barGroup.add(fillMesh);

  barGroup.position.set(0, enemyRadius + 8.2, 0);
  barGroup.userData.fillMesh = fillMesh;
  barGroup.userData.fillBaseWidth = fillWidth;
  barGroup.userData.bgMesh = bgMesh;

  return barGroup;
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  const halfW = worldSize.width / 2;
  const halfD = worldSize.depth / 2;
  const margin = 22;
  let x = 0;
  let z = 0;

  if (side === 0) {
    x = THREE.MathUtils.randFloat(-halfW, halfW);
    z = -halfD - margin;
  } else if (side === 1) {
    x = halfW + margin;
    z = THREE.MathUtils.randFloat(-halfD, halfD);
  } else if (side === 2) {
    x = THREE.MathUtils.randFloat(-halfW, halfW);
    z = halfD + margin;
  } else {
    x = -halfW - margin;
    z = THREE.MathUtils.randFloat(-halfD, halfD);
  }

  const enemyType = getEnemyTypeForNight();
  const modelTier = enemyType.modelTier || (enemyType.useGhostModel ? 1 : 0);
  const facingOffset = Number.isFinite(enemyType.facingOffset)
    ? enemyType.facingOffset
    : CHARACTER_FACING_OFFSET_BY_TIER[modelTier] || 0;

  const level1PrototypeFallback = level1GhostPrototype || level2ZombiePrototype;
  const level1RunClipFallback = level1GhostAnimationClip || level2ZombieAnimationClip;

  const characterPrototype = modelTier === 4
    ? level4EnemyPrototype
    : modelTier === 3
      ? level3SkeletonPrototype
      : modelTier === 2
        ? level2ZombiePrototype
        : enemyType.useGhostModel
          ? level1PrototypeFallback
          : null;
  const characterAnimationClip = modelTier === 4
    ? level4EnemyAnimationClip
    : modelTier === 3
      ? level3SkeletonAnimationClip
      : modelTier === 2
        ? level2ZombieAnimationClip
        : enemyType.useGhostModel
          ? level1RunClipFallback
          : null;
  const useCharacterModel = !!characterPrototype;
  let mesh;
  let animationRoot = null;
  if (useCharacterModel) {
    let modelClone = skeletonCloneFn ? skeletonCloneFn(characterPrototype) : characterPrototype.clone(true);
    if (Number.isFinite(enemyType.modelScale) && enemyType.modelScale > 0) {
      modelClone.scale.multiplyScalar(enemyType.modelScale);
    }
    modelClone.position.set(0, 0.5, 0);

    // If the cloned prototype doesn't contain any skinned meshes
    // try falling back to a known skinned prototype (level2) so
    // the animation clip actually drives a visible skinned mesh.
    const countSkinnedMeshes = (root) => {
      let c = 0;
      root?.traverse?.((n) => {
        if (n.isSkinnedMesh) c += 1;
      });
      return c;
    };

    if (modelTier === 1 && countSkinnedMeshes(modelClone) === 0) {
      console.warn('[L1 DEBUG] spawnEnemy: cloned prototype has 0 skinned meshes, attempting fallback');
      if (level2ZombiePrototype) {
        try {
          const altClone = skeletonCloneFn ? skeletonCloneFn(level2ZombiePrototype) : level2ZombiePrototype.clone(true);
          if (Number.isFinite(enemyType.modelScale) && enemyType.modelScale > 0) {
            altClone.scale.multiplyScalar(enemyType.modelScale);
          }
          altClone.position.set(0, 0.5, 0);
          modelClone = altClone;
          console.info('[L1 DEBUG] spawnEnemy: fallback to level2 prototype succeeded');
        } catch (e) {
          console.warn('[L1 DEBUG] spawnEnemy: fallback clone failed', e);
        }
      }
    }

    // Ensure cloned rigs are fully live for runtime animation updates.
    modelClone.traverse((node) => {
      if (node.isBone) {
        node.matrixAutoUpdate = true;
      }
      if (node.isSkinnedMesh) {
        node.frustumCulled = false;
      }
    });

    mesh = new THREE.Group();
    mesh.position.set(x, 0, z);
    mesh.add(modelClone);
    animationRoot = modelClone;
  } else {
    mesh = new THREE.Mesh(enemyGeometry, enemyMaterial.clone());
    mesh.material.color.setHex(enemyType.color);
    mesh.scale.setScalar(enemyType.radius / 6.5);
    mesh.position.set(x, enemyType.radius + 0.5, z);
    mesh.castShadow = true;
    animationRoot = mesh;
  }

  let bossHpBar = null;
  if (enemyType.isBoss) {
    bossHpBar = createBossHealthBar(enemyType.radius);
    mesh.add(bossHpBar);
  }

  scene.add(mesh);

  let animationMixer = null;
  if (ENEMY_USE_CHARACTER_ANIMATIONS && useCharacterModel && characterAnimationClip) {
    // lightweight debug object to surface runtime info in the console
    try {
      window.__l1Debug = window.__l1Debug || { spawnCount: 0, mixerUpdatedLogged: false };
    } catch (e) {}

    animationMixer = new THREE.AnimationMixer(animationRoot);
    const animationSpeed = Number.isFinite(enemyType.animationSpeed) ? enemyType.animationSpeed : 1;
    animationMixer.timeScale = 1;
    const runAction = animationMixer.clipAction(characterAnimationClip);
    runAction.reset();
    runAction.enabled = true;
    runAction.paused = false;
    runAction.clampWhenFinished = false;
    runAction.setLoop(THREE.LoopRepeat, Infinity);
    runAction.setEffectiveTimeScale(animationSpeed);
    runAction.setEffectiveWeight(1);
    try {
      runAction.play();
    } catch (e) {
      console.warn('[L1 DEBUG] runAction.play() threw', e);
    }

    // Post-play diagnostics: dump action state and skinned mesh properties
    try {
      const actionDiag = {
        clipName: characterAnimationClip?.name || null,
        actionTime: runAction?.time ?? null,
        actionWeight: typeof runAction?.getEffectiveWeight === 'function' ? runAction.getEffectiveWeight() : runAction?.weight ?? null,
        actionLoop: runAction?.loop ?? null,
      };
      const skinnedInfo = [];
      try {
        (animationRoot || {}).traverse?.((n) => {
          if (n.isSkinnedMesh) {
            const mats = Array.isArray(n.material) ? n.material : [n.material];
            skinnedInfo.push({
              meshName: n.name || null,
              materialSkinning: mats.map((m) => (m ? !!m.skinning : null)),
              bones: n.skeleton && Array.isArray(n.skeleton.bones) ? n.skeleton.bones.length : 0,
              firstBone: n.skeleton && Array.isArray(n.skeleton.bones) ? n.skeleton.bones[0]?.name || null : null,
            });
          }
        });
      } catch (e) {}
      console.info('[L1 DEBUG] post-play action/skinnedInfo', { actionDiag, skinnedInfo });
    } catch (e) {
      console.warn('[L1 DEBUG] post-play diagnostics failed', e);
    }

    try {
      const countSkinnedMeshes = (root) => {
        let c = 0;
        root?.traverse?.((n) => {
          if (n.isSkinnedMesh) c += 1;
        });
        return c;
      };
      try {
        window.__l1Debug.spawnCount += 1;
      } catch (e) {}
      console.info('[L1 DEBUG] spawnEnemy animation setup', {
        spawnIndex: (window.__l1Debug && window.__l1Debug.spawnCount) || null,
        hasClip: !!characterAnimationClip,
        clipTracks: characterAnimationClip?.tracks?.length || 0,
        skinnedMeshCount: countSkinnedMeshes(animationRoot || {}),
        actionTime: runAction?.time ?? null,
      });
      // If we have a clip, emit detailed diagnostics comparing clip tracks to skeleton bones
      try {
        if (characterAnimationClip) {
          const clipTrackNames = (characterAnimationClip.tracks || []).map((t) => t.name);
          const clipSample = clipTrackNames.slice(0, 40);
          const boneNames = new Set();
          (animationRoot || {}).traverse?.((n) => {
            if (n.isSkinnedMesh && n.skeleton && Array.isArray(n.skeleton.bones)) {
              n.skeleton.bones.forEach((b) => boneNames.add(b.name));
            }
          });

          const trackRootNames = clipTrackNames.map((n) => (typeof n === 'string' ? n.split('.')[0] : n));
          let matched = 0;
          for (const rootName of trackRootNames) {
            if (boneNames.has(rootName)) matched += 1;
          }

          console.info('[L1 DEBUG] clip-vs-skeleton', {
            clipSample,
            totalClipTracks: clipTrackNames.length,
            sampleBoneNames: Array.from(boneNames).slice(0, 60),
            totalBones: boneNames.size,
            matchedTrackRoots: matched,
          });
        }
      } catch (e) {
        console.warn('[L1 DEBUG] detailed clip-vs-skeleton diagnostic failed', e);
      }
    } catch (e) {
      console.warn('[L1 DEBUG] spawnEnemy animation info failed', e);
    }
  }

  const initialFacingYaw = Math.atan2(-x, -z) + facingOffset;
  if (useCharacterModel) {
    mesh.rotation.y = initialFacingYaw;
  }

  enemies.push({
    x,
    z,
    hp: enemyType.hp,
    maxHp: enemyType.hp,
    speed: THREE.MathUtils.randFloat(enemyType.speedMin, enemyType.speedMax),
    damagePerSecond: enemyType.damage,
    reward: enemyType.reward,
    radius: enemyType.radius,
    hitRadius: enemyType.hitRadius ?? enemyType.radius,
    isBoss: !!enemyType.isBoss,
    isCharacterModel: useCharacterModel,
    facingYaw: initialFacingYaw,
    facingOffset,
    walkBobPhase: Math.random() * Math.PI * 2,
    shamblePhase: Math.random() * Math.PI * 2,
    walkBaseY: useCharacterModel ? 0 : enemyType.radius + 0.5,
    dustTimer: 0.015 + Math.random() * 0.03,
    hitReactTime: 0,
    hitReactDuration: 0.12,
    hitTiltX: 0,
    hitTiltZ: 0,
    breachDirect: false,
    animationMixer,
    animationRoot,
    bossHpBar,
    disposeMaterial: !useCharacterModel,
    disposeGeometry: false,
    mesh,
  });
}

function getBulletMaterial(projectileType, owner) {
  if (projectileType === "cannon") {
    return cannonBulletMaterial;
  }
  if (projectileType === "grenade") {
    return grenadeBulletMaterial;
  }
  if (projectileType === "flak") {
    return turretBulletMaterial;
  }
  if (projectileType === "smg") {
    return owner === "turret" ? turretSmgBulletMaterial : playerBulletMaterial;
  }
  return owner === "player" ? playerBulletMaterial : turretBulletMaterial;
}

function getEffectFloorY(x, z) {
  let floorY = 0.16;

  // Base plate sits slightly above terrain and should host decals/casings.
  if (Math.hypot(x, z) <= BASE_HQ_RADIUS + 1.5) {
    floorY = Math.max(floorY, 0.22);
  }

  // Outer turret foundations are elevated; keep nearby FX on their top surface.
  turrets.forEach((turret) => {
    if (turret.label === "Middle") {
      return;
    }
    const radius = turret.mesh?.geometry?.parameters?.radiusTop;
    const height = turret.mesh?.geometry?.parameters?.height;
    if (!Number.isFinite(radius) || !Number.isFinite(height)) {
      return;
    }
    if (Math.hypot(x - turret.x, z - turret.z) <= radius - 0.35) {
      floorY = Math.max(floorY, turret.mesh.position.y + height * 0.5 + 0.05);
    }
  });

  return floorY;
}

function spawnImpactEffect(x, z, radius, colorHex, maxLife = 0.24, baseOpacity = 0.85) {
  const inner = Math.max(0.5, radius * 0.65);
  const outer = Math.max(1.2, radius);
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(inner, outer, 40),
    new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: baseOpacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, getEffectFloorY(x, z) + 0.06, z);
  scene.add(mesh);

  impactEffects.push({ mesh, life: maxLife, maxLife, growth: 1.65, baseOpacity });
}

function spawnHitPolygonEffect(x, z, y = 0.5, facingYaw = 0) {
  const count = 2;
  for (let i = 0; i < count; i += 1) {
    const segments = 3 + Math.floor(Math.random() * 4);
    const size = THREE.MathUtils.randFloat(1.1, 2.0);
    const colorHex = Math.random() < 0.5 ? 0xff3a3a : 0x6dff74;
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(size, segments),
      new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.98,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.y = facingYaw + THREE.MathUtils.randFloatSpread(0.55);
    mesh.rotation.z = THREE.MathUtils.randFloatSpread(0.4);
    mesh.position.set(
      x + THREE.MathUtils.randFloatSpread(0.9),
      y + THREE.MathUtils.randFloatSpread(0.55),
      z + THREE.MathUtils.randFloatSpread(0.9)
    );
    mesh.renderOrder = 12;
    scene.add(mesh);
    impactEffects.push({ mesh, life: 0.34, maxLife: 0.34, growth: 0.9, baseOpacity: 0.98 });
  }
}

function spawnCannonBlastEffect(x, z, radius) {
  // Keep only a subtle dark shockwave under the chunk burst.
  spawnImpactEffect(x, z, Math.max(9.5, radius * 0.95), 0x282524, 0.28, 0.28);

  const shardGeometryFactories = [
    () => new THREE.TetrahedronGeometry(0.95),
    () => new THREE.CylinderGeometry(0.28, 0.6, 0.9, 5),
    () => new THREE.CylinderGeometry(0.35, 0.7, 0.95, 6),
    () => new THREE.IcosahedronGeometry(0.72, 0),
  ];

  const particles = [];
  const particleCount = 24;
  for (let index = 0; index < particleCount; index += 1) {
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.45;
    const speed = 22 + Math.random() * 26;
    const rise = 26 + Math.random() * 17;
    const geometryFactory = shardGeometryFactories[Math.floor(Math.random() * shardGeometryFactories.length)];
    const mesh = new THREE.Mesh(
      geometryFactory(),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.0 + Math.random() * 0.03, 0.88, 0.42 + Math.random() * 0.14),
        transparent: true,
        opacity: 0.96,
        depthWrite: false,
      })
    );
    const shardScale = THREE.MathUtils.randFloat(0.9, 1.95);
    mesh.scale.set(shardScale, shardScale, shardScale);
    mesh.position.set(x, 0.7 + Math.random() * 0.4, z);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);

    particles.push({
      mesh,
      vx: Math.cos(angle) * speed,
      vz: Math.sin(angle) * speed,
      vy: rise,
      rvx: THREE.MathUtils.randFloatSpread(10),
      rvy: THREE.MathUtils.randFloatSpread(10),
      rvz: THREE.MathUtils.randFloatSpread(10),
      grounded: false,
      groundY: 0.13 + Math.random() * 0.05,
    });
  }

  // Reuse the shard physics/fade system used by enemy death chunks.
  enemyDeathEffects.push({ effectType: "burst", particles, life: 2.6, maxLife: 2.6 });
}

function spawnCannonScorchMark(x, z, radius) {
  const scorch = new THREE.Mesh(
    new THREE.CircleGeometry(Math.max(4.5, radius * THREE.MathUtils.randFloat(0.35, 0.5)), 26),
    new THREE.MeshBasicMaterial({
      color: 0x0f0c0b,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  scorch.rotation.x = -Math.PI / 2;
  scorch.rotation.z = Math.random() * Math.PI * 2;
  scorch.position.set(x, getEffectFloorY(x, z) + 0.03, z);
  scene.add(scorch);

  cannonScorchMarks.push({ mesh: scorch, life: 55, maxLife: 55 });
}

function spawnEnemyDeathExplosion(enemy) {
  const shardGeometryFactories = [
    () => new THREE.TetrahedronGeometry(0.8),
    () => new THREE.CylinderGeometry(0.25, 0.5, 0.7, 5),
    () => new THREE.CylinderGeometry(0.3, 0.55, 0.65, 6),
    () => new THREE.IcosahedronGeometry(0.58, 0),
  ];
  const particles = [];
  const floorY = getEffectFloorY(enemy.x, enemy.z);
  const particleCount = 18;
  for (let index = 0; index < particleCount; index += 1) {
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.4;
    const speed = 18 + Math.random() * 20;
    const rise = 22 + Math.random() * 15;
    const geometryFactory = shardGeometryFactories[Math.floor(Math.random() * shardGeometryFactories.length)];
    const mesh = new THREE.Mesh(
      geometryFactory(),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.29 + Math.random() * 0.05, 0.78, 0.46 + Math.random() * 0.14),
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
      })
    );
    const shardScale = THREE.MathUtils.randFloat(0.65, 1.55);
    mesh.scale.set(shardScale, shardScale, shardScale);
    mesh.position.set(enemy.x, enemy.radius * 0.72 + 0.3, enemy.z);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);
    particles.push({
      mesh,
      vx: Math.cos(angle) * speed,
      vz: Math.sin(angle) * speed,
      vy: rise,
      rvx: THREE.MathUtils.randFloatSpread(9),
      rvy: THREE.MathUtils.randFloatSpread(9),
      rvz: THREE.MathUtils.randFloatSpread(9),
      grounded: false,
      groundY: floorY + 0.03 + Math.random() * 0.05,
      fadeTimer: ZOMBIE_SPLATTER_FADE_DURATION,
      fadeDuration: ZOMBIE_SPLATTER_FADE_DURATION,
    });
  }

  enemyDeathEffects.push({ effectType: "death", particles, life: 0, maxLife: 0 });
}

function spawnZombieSplatter(x, z, enemyRadius = 6.5) {
  const size = Math.max(10, enemyRadius * 3.1);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: zombieSplatterTexture,
      color: 0x7fbf73,
      transparent: true,
      opacity: 0.82,
      alphaTest: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = Math.random() * Math.PI * 2;
  mesh.position.set(x, getEffectFloorY(x, z) + 0.04, z);
  scene.add(mesh);

  zombieSplatters.push({
    mesh,
    life: ZOMBIE_SPLATTER_FADE_DURATION,
    maxLife: ZOMBIE_SPLATTER_FADE_DURATION,
  });
}

function spawnMuzzleFlash(originX, originZ, dirX, dirZ, owner = "player", style = "sprite", originY = null, forwardDistance = null) {
  const distance = forwardDistance ?? (owner === "player" ? 11 : 10);
  const y = originY ?? (owner === "player" ? 12 : 4.8);
  const size = owner === "player" ? 8.8 : 7.2;
  const maxLife = owner === "player" ? PLAYER_MUZZLE_FLASH_LIFE : TURRET_MUZZLE_FLASH_LIFE;

  if (style === "mesh") {
    const geometry = new THREE.ConeGeometry(owner === "player" ? 2.5 : 2.1, owner === "player" ? 6.2 : 5.2, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffc86a,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const cone = new THREE.Mesh(geometry, material);
    cone.position.set(originX + dirX * distance, y, originZ + dirZ * distance);
    cone.rotation.y = Math.atan2(dirX, dirZ);
    cone.rotation.x = Math.PI * 0.5;
    cone.userData.baseScale = owner === "player" ? 1 : 0.9;
    cone.scale.setScalar(cone.userData.baseScale);
    scene.add(cone);
    muzzleFlashes.push({ mesh: cone, life: maxLife, maxLife, style: "mesh" });
    return;
  }

  const material = new THREE.SpriteMaterial({
    map: muzzleFlashTexture,
    transparent: true,
    opacity: 0.95,
    alphaTest: 0.08,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  material.rotation = Math.atan2(dirZ, dirX) - Math.PI / 2;
  const sprite = new THREE.Sprite(material);
  sprite.position.set(originX + dirX * distance, y, originZ + dirZ * distance);
  sprite.scale.set(size, size, 1);
  scene.add(sprite);

  muzzleFlashes.push({ mesh: sprite, life: maxLife, maxLife, style: "sprite" });
}

function getPlayerMuzzleFlashOrigin(dirX, dirZ) {
  const [offsetRight, offsetUp, offsetForward] = PLAYER_MUZZLE_FLASH_MOUNT_OFFSET;
  const rightX = -dirZ;
  const rightZ = dirX;
  playerWeaponMount.getWorldPosition(playerMuzzleFlashWorldPos);
  return {
    x: playerMuzzleFlashWorldPos.x + dirX * offsetForward + rightX * offsetRight,
    y: playerMuzzleFlashWorldPos.y + offsetUp,
    z: playerMuzzleFlashWorldPos.z + dirZ * offsetForward + rightZ * offsetRight,
  };
}

function isMachineGunWeapon(weaponId) {
  return weaponId === "mp5" || weaponId === "ar15" || weaponId === "m249";
}

function isPistolWeapon(weaponId) {
  return weaponId === "glock" || weaponId === "magnum50";
}

function isShellEjectWeapon(weaponId) {
  return isMachineGunWeapon(weaponId) || isPistolWeapon(weaponId) || weaponId === "cannon";
}

function createReloadClipMesh(weaponId) {
  if (isMachineGunWeapon(weaponId) && clipLargePrototype) {
    return { mesh: clipLargePrototype.clone(true), disposeOnRemove: false };
  }
  if (isPistolWeapon(weaponId) && clipSmallPrototype) {
    return { mesh: clipSmallPrototype.clone(true), disposeOnRemove: false };
  }
  if (clipSmallPrototype) {
    return { mesh: clipSmallPrototype.clone(true), disposeOnRemove: false };
  }

  const fallbackSize = isMachineGunWeapon(weaponId) ? [0.9, 0.2, 0.45] : [0.55, 0.16, 0.3];
  return {
    mesh: new THREE.Mesh(
      new THREE.BoxGeometry(fallbackSize[0], fallbackSize[1], fallbackSize[2]),
      new THREE.MeshStandardMaterial({ color: 0x1f2633, roughness: 0.55, metalness: 0.48 })
    ),
    disposeOnRemove: true,
  };
}

function spawnReloadClipEject(weaponId) {
  const { mesh, disposeOnRemove } = createReloadClipMesh(weaponId);
  mesh.position.set(player.x + 3.8, 13.2, player.z - 1.4);
  mesh.rotation.set(Math.PI * 0.18, Math.PI * 0.35, Math.PI * 0.52);
  scene.add(mesh);

  const sideDirX = Math.sin(cameraOrbit.yaw - Math.PI * 0.5);
  const sideDirZ = Math.cos(cameraOrbit.yaw - Math.PI * 0.5);

  ejectedReloadProps.push({
    mesh,
    vx: sideDirX * (18 + Math.random() * 7),
    vz: sideDirZ * (18 + Math.random() * 7),
    vy: 24 + Math.random() * 8,
    spinX: 6 + Math.random() * 3,
    spinY: 8 + Math.random() * 4,
    spinZ: 7 + Math.random() * 3,
    grounded: false,
    landingY: getEffectFloorY(player.x, player.z),
    groundHoldTimer: EJECTED_PROP_GROUND_HOLD,
    fadeTimer: EJECTED_PROP_FADE_DURATION,
    fadeDuration: EJECTED_PROP_FADE_DURATION,
    disposeOnRemove,
  });
}

function spawnShellCasingEject(
  weaponId,
  shotDirX,
  shotDirZ,
  originX = player.x,
  originZ = player.z,
  ejectY = 12.7,
  lateralOffset = 4.6,
  landingY = null
) {
  if (!isShellEjectWeapon(weaponId)) {
    return;
  }

  const isCannon = weaponId === "cannon";
  const shellMesh = isCannon && bulletFoamThickPrototype
    ? bulletFoamThickPrototype.clone(true)
    : new THREE.Mesh(shellCasingGeometry, shellCasingMaterial.clone());
  if (isCannon) {
    // Cannon casing is intentionally much larger than regular AR/MG casings.
    shellMesh.scale.setScalar(3.2);
    shellMesh.traverse?.((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = false;
        node.material = Array.isArray(node.material)
          ? node.material.map((m) => (m?.clone ? m.clone() : m))
          : node.material?.clone?.() || node.material;
        if (Array.isArray(node.material)) {
          node.material.forEach((m) => {
            if (!m) return;
            m.transparent = true;
            m.opacity = 1;
          });
        } else if (node.material) {
          node.material.transparent = true;
          node.material.opacity = 1;
        }
      }
    });
  }
  shellMesh.renderOrder = 4;
  const sideX = -shotDirZ;
  const sideZ = shotDirX;
  shellMesh.position.set(originX + sideX * lateralOffset, ejectY, originZ + sideZ * lateralOffset);
  shellMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  scene.add(shellMesh);

  const isPistol = isPistolWeapon(weaponId);
  const resolvedLandingY = Number.isFinite(landingY) ? landingY : getEffectFloorY(originX, originZ);
  const lateralSpeed = isCannon
    ? 22 + Math.random() * 10
    : isPistol
      ? 17 + Math.random() * 8
      : 24 + Math.random() * 14;
  const forwardPush = isCannon ? 2.6 : isPistol ? 2.5 : 4;
  const upSpeed = isCannon
    ? 14 + Math.random() * 5
    : isPistol
      ? 11 + Math.random() * 5
      : 16 + Math.random() * 8;
  const spinScale = isCannon ? 0.7 : isPistol ? 0.7 : 1;

  ejectedShellCasings.push({
    mesh: shellMesh,
    vx: sideX * lateralSpeed + shotDirX * forwardPush,
    vz: sideZ * lateralSpeed + shotDirZ * forwardPush,
    vy: upSpeed,
    spinX: (16 + Math.random() * 8) * spinScale,
    spinY: (12 + Math.random() * 6) * spinScale,
    spinZ: (18 + Math.random() * 8) * spinScale,
    grounded: false,
    landingY: resolvedLandingY,
    groundHoldTimer: EJECTED_PROP_GROUND_HOLD,
    fadeTimer: EJECTED_PROP_FADE_DURATION,
    fadeDuration: EJECTED_PROP_FADE_DURATION,
    disposeOnRemove: isCannon,
  });
}

function setMeshTreeOpacity(root, opacity) {
  root.traverse?.((node) => {
    if (!node.isMesh || !node.material) {
      return;
    }
    if (Array.isArray(node.material)) {
      node.material.forEach((material) => {
        material.transparent = true;
        material.opacity = opacity;
      });
      return;
    }
    node.material.transparent = true;
    node.material.opacity = opacity;
  });
}

function updateEjectedProps(dt) {
  const gravity = 70;

  for (let index = ejectedReloadProps.length - 1; index >= 0; index -= 1) {
    const prop = ejectedReloadProps[index];
    if (!prop.grounded) {
      prop.vy -= gravity * dt;
      prop.mesh.position.x += prop.vx * dt;
      prop.mesh.position.y += prop.vy * dt;
      prop.mesh.position.z += prop.vz * dt;
      prop.mesh.rotation.x += prop.spinX * dt;
      prop.mesh.rotation.y += prop.spinY * dt;
      prop.mesh.rotation.z += prop.spinZ * dt;

      if (prop.mesh.position.y < prop.landingY) {
        prop.mesh.position.y = prop.landingY;
        prop.grounded = true;
        prop.vx = 0;
        prop.vz = 0;
        prop.vy = 0;
        prop.spinX = 0;
        prop.spinY = 0;
        prop.spinZ = 0;
      }
    } else if (prop.groundHoldTimer > 0) {
      prop.groundHoldTimer -= dt;
    } else {
      prop.fadeTimer -= dt;
    }

    const alpha = prop.groundHoldTimer > 0 ? 1 : Math.max(0, prop.fadeTimer / prop.fadeDuration);
    setMeshTreeOpacity(prop.mesh, alpha);

    if (prop.fadeTimer <= 0) {
      scene.remove(prop.mesh);
      if (prop.disposeOnRemove) {
        prop.mesh.traverse?.((node) => {
          if (!node.isMesh) {
            return;
          }
          node.geometry?.dispose?.();
          if (Array.isArray(node.material)) {
            node.material.forEach((material) => material.dispose?.());
          } else if (node.material) {
            node.material.dispose?.();
          }
        });
      }
      ejectedReloadProps.splice(index, 1);
    }
  }

  for (let index = ejectedShellCasings.length - 1; index >= 0; index -= 1) {
    const shell = ejectedShellCasings[index];
    if (!shell.grounded) {
      shell.vy -= gravity * dt;
      shell.mesh.position.x += shell.vx * dt;
      shell.mesh.position.y += shell.vy * dt;
      shell.mesh.position.z += shell.vz * dt;
      shell.mesh.rotation.x += shell.spinX * dt;
      shell.mesh.rotation.y += shell.spinY * dt;
      shell.mesh.rotation.z += shell.spinZ * dt;

      if (shell.mesh.position.y < shell.landingY) {
        shell.mesh.position.y = shell.landingY;
        shell.grounded = true;
        shell.vx = 0;
        shell.vz = 0;
        shell.vy = 0;
        shell.spinX = 0;
        shell.spinY = 0;
        shell.spinZ = 0;
      }
    } else if (shell.groundHoldTimer > 0) {
      shell.groundHoldTimer -= dt;
    } else {
      shell.fadeTimer -= dt;
    }

    const shellAlpha = shell.groundHoldTimer > 0 ? 1 : Math.max(0, shell.fadeTimer / shell.fadeDuration);
    setMeshTreeOpacity(shell.mesh, shellAlpha);

    if (shell.fadeTimer <= 0) {
      scene.remove(shell.mesh);
      if (shell.disposeOnRemove) {
        shell.mesh.traverse?.((node) => {
          if (!node.isMesh) {
            return;
          }
          node.geometry?.dispose?.();
          if (Array.isArray(node.material)) {
            node.material.forEach((material) => material?.dispose?.());
          } else {
            node.material?.dispose?.();
          }
        });
      } else {
        shell.mesh.material.dispose();
      }
      ejectedShellCasings.splice(index, 1);
    }
  }
}

function applyAreaDamage(x, z, radius, damage) {
  for (let index = enemies.length - 1; index >= 0; index -= 1) {
    const enemy = enemies[index];
    const dx = enemy.x - x;
    const dz = enemy.z - z;
    if (Math.hypot(dx, dz) <= radius + getEnemyHitRadius(enemy)) {
      enemy.hp -= damage;
      if (enemy.hp <= 0) {
        removeEnemy(enemy);
      }
    }
  }
}

function updateImpactEffects(dt) {
  for (let index = impactEffects.length - 1; index >= 0; index -= 1) {
    const effect = impactEffects[index];
    effect.life -= dt;
    const alpha = Math.max(0, effect.life / effect.maxLife);
    effect.mesh.material.opacity = (effect.baseOpacity ?? 0.85) * alpha;
    const scale = 1 + (1 - alpha) * effect.growth;
    effect.mesh.scale.setScalar(scale);

    if (effect.life <= 0) {
      scene.remove(effect.mesh);
      effect.mesh.geometry.dispose();
      effect.mesh.material.dispose();
      impactEffects.splice(index, 1);
    }
  }
}

function updateCannonScorchMarks(dt) {
  for (let index = cannonScorchMarks.length - 1; index >= 0; index -= 1) {
    const mark = cannonScorchMarks[index];
    mark.life -= dt;
    const alpha = Math.max(0, mark.life / mark.maxLife);
    mark.mesh.material.opacity = 0.16 + alpha * 0.3;

    if (mark.life <= 0) {
      scene.remove(mark.mesh);
      mark.mesh.geometry.dispose();
      mark.mesh.material.dispose();
      cannonScorchMarks.splice(index, 1);
    }
  }
}

function updateEnemyDeathEffects(dt) {
  for (let index = enemyDeathEffects.length - 1; index >= 0; index -= 1) {
    const effect = enemyDeathEffects[index];
    if (effect.effectType === "death") {
      for (let p = effect.particles.length - 1; p >= 0; p -= 1) {
        const particle = effect.particles[p];
        if (!particle.grounded) {
          particle.vx *= Math.max(0, 1 - dt * 1.8);
          particle.vz *= Math.max(0, 1 - dt * 1.8);
          particle.vy -= 58 * dt;
          particle.mesh.position.x += particle.vx * dt;
          particle.mesh.position.y += particle.vy * dt;
          particle.mesh.position.z += particle.vz * dt;

          if (particle.mesh.position.y <= particle.groundY) {
            particle.mesh.position.y = particle.groundY;
            particle.grounded = true;
            particle.vx *= 0.18;
            particle.vz *= 0.18;
            particle.vy = 0;
          }
          particle.mesh.material.opacity = 0.95;
        } else {
          particle.vx *= Math.max(0, 1 - dt * 4.2);
          particle.vz *= Math.max(0, 1 - dt * 4.2);
          particle.mesh.position.x += particle.vx * dt;
          particle.mesh.position.z += particle.vz * dt;

          const flattenSpeed = 0.8;
          particle.mesh.scale.y = Math.max(0.18, particle.mesh.scale.y * (1 - dt * flattenSpeed));
          particle.fadeTimer -= dt;
          const groundedAlpha = Math.max(0, particle.fadeTimer / particle.fadeDuration);
          particle.mesh.material.opacity = 0.74 * groundedAlpha;

          if (particle.fadeTimer <= 0) {
            scene.remove(particle.mesh);
            particle.mesh.geometry.dispose();
            particle.mesh.material.dispose();
            effect.particles.splice(p, 1);
            continue;
          }
        }

        particle.mesh.rotation.x += particle.rvx * dt;
        particle.mesh.rotation.y += particle.rvy * dt;
        particle.mesh.rotation.z += particle.rvz * dt;
      }

      if (effect.particles.length === 0) {
        enemyDeathEffects.splice(index, 1);
      }
      continue;
    }

    effect.life -= dt;
    const alpha = Math.max(0, effect.life / effect.maxLife);
    effect.particles.forEach((particle) => {
      if (!particle.grounded) {
        particle.vx *= Math.max(0, 1 - dt * 1.8);
        particle.vz *= Math.max(0, 1 - dt * 1.8);
        particle.vy -= 58 * dt;
        particle.mesh.position.x += particle.vx * dt;
        particle.mesh.position.y += particle.vy * dt;
        particle.mesh.position.z += particle.vz * dt;

        if (particle.mesh.position.y <= particle.groundY) {
          particle.mesh.position.y = particle.groundY;
          particle.grounded = true;
          particle.vx *= 0.18;
          particle.vz *= 0.18;
          particle.vy = 0;
        }
      } else {
        particle.vx *= Math.max(0, 1 - dt * 4.2);
        particle.vz *= Math.max(0, 1 - dt * 4.2);
        particle.mesh.position.x += particle.vx * dt;
        particle.mesh.position.z += particle.vz * dt;
      }

      particle.mesh.rotation.x += particle.rvx * dt;
      particle.mesh.rotation.y += particle.rvy * dt;
      particle.mesh.rotation.z += particle.rvz * dt;
      particle.mesh.material.opacity = 0.9 * alpha;
    });

    if (effect.life <= 0) {
      effect.particles.forEach((particle) => {
        scene.remove(particle.mesh);
        particle.mesh.geometry.dispose();
        particle.mesh.material.dispose();
      });
      enemyDeathEffects.splice(index, 1);
    }
  }
}

function updateZombieSplatters(dt) {
  for (let index = zombieSplatters.length - 1; index >= 0; index -= 1) {
    const splatter = zombieSplatters[index];
    splatter.life -= dt;
    const alpha = Math.max(0, splatter.life / splatter.maxLife);
    splatter.mesh.material.opacity = 0.82 * alpha;

    if (splatter.life <= 0) {
      scene.remove(splatter.mesh);
      splatter.mesh.geometry.dispose();
      splatter.mesh.material.dispose();
      zombieSplatters.splice(index, 1);
    }
  }
}

function updateMuzzleFlashes(dt) {
  for (let index = muzzleFlashes.length - 1; index >= 0; index -= 1) {
    const flash = muzzleFlashes[index];
    flash.life -= dt;
    const alpha = Math.max(0, flash.life / flash.maxLife);
    flash.mesh.material.opacity = 0.95 * alpha;
    if (flash.style === "mesh") {
      const burst = 0.58 + alpha * 0.7;
      const baseScale = flash.mesh.userData.baseScale || 1;
      flash.mesh.scale.set(baseScale * burst, baseScale * (0.32 + alpha * 0.55), baseScale * burst);
      flash.mesh.rotation.z += dt * 20;
    }

    if (flash.life <= 0) {
      scene.remove(flash.mesh);
      flash.mesh.geometry?.dispose?.();
      flash.mesh.material.dispose();
      muzzleFlashes.splice(index, 1);
    }
  }
}

function spawnCreepDust(enemy, moveDirX, moveDirZ, scaleMultiplier = 1, lifeMultiplier = 1, opacityMultiplier = 1) {
  const mesh = new THREE.Mesh(creepDustGeometry, creepDustMaterial.clone());
  const sideX = -moveDirZ;
  const sideZ = moveDirX;
  const sideOffset = (Math.random() * 2 - 1) * 1.1;
  mesh.position.set(
    enemy.x - moveDirX * 1.7 + sideX * sideOffset,
    getEffectFloorY(enemy.x, enemy.z) + 0.1,
    enemy.z - moveDirZ * 1.7 + sideZ * sideOffset
  );
  const startScale = (0.78 + Math.random() * 0.45) * scaleMultiplier;
  mesh.scale.setScalar(startScale);
  mesh.material.opacity = Math.min(0.9, mesh.material.opacity * opacityMultiplier);
  scene.add(mesh);

  const dustLife = 0.62 * lifeMultiplier;

  creepDustPuffs.push({
    mesh,
    life: dustLife,
    maxLife: dustLife,
    growth: 2.3 + Math.random() * 0.9,
    driftX: sideX * ((Math.random() * 2 - 1) * 1.6),
    driftZ: sideZ * ((Math.random() * 2 - 1) * 1.6),
  });
}

function updateCreepDust(dt) {
  for (let index = creepDustPuffs.length - 1; index >= 0; index -= 1) {
    const puff = creepDustPuffs[index];
    puff.life -= dt;
    const alpha = Math.max(0, puff.life / puff.maxLife);
    puff.mesh.material.opacity = 0.44 * alpha;
    puff.mesh.position.x += puff.driftX * dt;
    puff.mesh.position.z += puff.driftZ * dt;
    puff.mesh.position.y += dt * 0.42;
    const scale = 1 + (1 - alpha) * puff.growth;
    puff.mesh.scale.setScalar(scale);

    if (puff.life <= 0) {
      scene.remove(puff.mesh);
      puff.mesh.material.dispose();
      creepDustPuffs.splice(index, 1);
    }
  }
}

const ultimateWaves = [];

function spawnUltimateWave(x, z, maxRadius) {
  const shockwaveMesh = new THREE.Mesh(
    new THREE.RingGeometry(1.2, 2.4, 72),
    new THREE.MeshBasicMaterial({
      color: 0xffcf73,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  shockwaveMesh.rotation.x = -Math.PI / 2;
  shockwaveMesh.position.set(x, 0.25, z);
  scene.add(shockwaveMesh);

  const stemMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 2.6, 1, 18, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x5d5f66,
      emissive: 0x2f1a10,
      emissiveIntensity: 0.55,
      roughness: 0.92,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  stemMesh.position.set(x, 0.9, z);
  scene.add(stemMesh);

  const capMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 18),
    new THREE.MeshStandardMaterial({
      color: 0x6e727b,
      emissive: 0x3a2519,
      emissiveIntensity: 0.45,
      roughness: 0.88,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
  );
  capMesh.position.set(x, 10, z);
  scene.add(capMesh);

  const crownMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 18),
    new THREE.MeshStandardMaterial({
      color: 0x666a73,
      emissive: 0x29170f,
      emissiveIntensity: 0.42,
      roughness: 0.92,
      transparent: true,
      opacity: 0.84,
      depthWrite: false,
    })
  );
  crownMesh.position.set(x, 8, z);
  scene.add(crownMesh);

  const smokePuffs = [];
  const puffCount = 18;
  for (let index = 0; index < puffCount; index += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 10),
      new THREE.MeshStandardMaterial({
        color: 0x777c86,
        emissive: 0x24140e,
        emissiveIntensity: 0.36,
        roughness: 0.95,
        transparent: true,
        opacity: 0.86,
        depthWrite: false,
      })
    );
    puff.position.set(x, 8, z);
    scene.add(puff);
    smokePuffs.push({
      mesh: puff,
      angle: (Math.PI * 2 * index) / puffCount,
      radial: 0.55 + Math.random() * 0.85,
      lift: 0.7 + Math.random() * 1.1,
      driftSpeed: 0.7 + Math.random() * 0.55,
      spinOffset: Math.random() * Math.PI * 2,
    });
  }

  ultimateWaves.push({
    life: 1.45,
    maxLife: 1.45,
    maxRadius,
    shockwaveMesh,
    stemMesh,
    capMesh,
    crownMesh,
    smokePuffs,
  });
}

function disposeUltimateWave(wave) {
  const disposeMesh = (mesh) => {
    if (!mesh) {
      return;
    }
    scene.remove(mesh);
    mesh.geometry?.dispose?.();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material?.dispose?.());
    } else {
      mesh.material?.dispose?.();
    }
  };

  disposeMesh(wave.shockwaveMesh);
  disposeMesh(wave.stemMesh);
  disposeMesh(wave.capMesh);
  disposeMesh(wave.crownMesh);
  wave.smokePuffs?.forEach((puff) => disposeMesh(puff.mesh));
}

function updateUltimateWaves(dt) {
  for (let index = ultimateWaves.length - 1; index >= 0; index -= 1) {
    const wave = ultimateWaves[index];
    wave.life -= dt;
    const alpha = Math.max(0, wave.life / wave.maxLife);
    const progress = Math.max(0, Math.min(1, 1 - alpha));
    const eased = 1 - Math.pow(1 - progress, 3);
    const burstGlow = Math.exp(-progress * 7.5);

    const shockwaveRadius = Math.max(1.2, wave.maxRadius * (0.16 + eased * 1.25));
    wave.shockwaveMesh.material.opacity = (0.95 * alpha) + burstGlow * 0.18;
    wave.shockwaveMesh.scale.set(shockwaveRadius, shockwaveRadius, 1);

    const stemHeight = 4 + eased * (wave.maxRadius * 0.92);
    const stemRadius = 2.4 + eased * (wave.maxRadius * 0.065);
    wave.stemMesh.position.y = 0.22 + stemHeight * 0.5;
    wave.stemMesh.scale.set(stemRadius, stemHeight, stemRadius);
    wave.stemMesh.material.opacity = 0.78 * alpha + burstGlow * 0.12;

    const capRadius = Math.max(6, wave.maxRadius * (0.18 + eased * 0.65));
    const capY = stemHeight + 8 + Math.sin(eased * Math.PI) * 3.4;
    wave.capMesh.position.y = capY;
    wave.capMesh.scale.set(capRadius * 1.02, capRadius * 0.86, capRadius * 1.02);
    wave.capMesh.material.opacity = 0.76 * alpha + burstGlow * 0.2;

    const crownRadius = Math.max(5, capRadius * 1.22);
    wave.crownMesh.position.y = capY - capRadius * 0.26;
    wave.crownMesh.scale.set(crownRadius, crownRadius * 0.62, crownRadius);
    wave.crownMesh.material.opacity = 0.6 * alpha + burstGlow * 0.14;

    wave.smokePuffs.forEach((puff, puffIndex) => {
      const puffOrbit = capRadius * (0.32 + puff.radial * 0.68);
      const puffAngle = puff.angle + progress * puff.driftSpeed + puff.spinOffset * 0.18;
      const puffY = capY - capRadius * 0.18 + Math.sin(progress * 7 + puffIndex * 0.45) * puff.lift * 1.1;
      puff.mesh.position.set(
        wave.shockwaveMesh.position.x + Math.cos(puffAngle) * puffOrbit,
        puffY,
        wave.shockwaveMesh.position.z + Math.sin(puffAngle) * puffOrbit
      );
      const puffScale = capRadius * (0.12 + puff.radial * 0.18);
      puff.mesh.scale.setScalar(puffScale);
      puff.mesh.material.opacity = Math.max(0, (0.58 + burstGlow * 0.2) * alpha);
    });

    if (wave.life <= 0) {
      disposeUltimateWave(wave);
      ultimateWaves.splice(index, 1);
    }
  }
}

let selectedTurretRangeMesh = null;
let selectedTurretLabelSprite = null;
let selectedTurretVisualKey = "";

function clearSelectedTurretVisual() {
  if (selectedTurretRangeMesh) {
    scene.remove(selectedTurretRangeMesh);
    selectedTurretRangeMesh.geometry.dispose();
    selectedTurretRangeMesh.material.dispose();
    selectedTurretRangeMesh = null;
  }
  if (selectedTurretLabelSprite) {
    scene.remove(selectedTurretLabelSprite);
    selectedTurretLabelSprite.material.map.dispose();
    selectedTurretLabelSprite.material.dispose();
    selectedTurretLabelSprite = null;
  }
  selectedTurretVisualKey = "";
}

function createLabelSprite(text) {
  const canvasEl = document.createElement("canvas");
  canvasEl.width = 512;
  canvasEl.height = 128;
  const labelCtx = canvasEl.getContext("2d");
  labelCtx.fillStyle = "rgba(8, 12, 18, 0.78)";
  labelCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  labelCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  labelCtx.lineWidth = 4;
  labelCtx.strokeRect(2, 2, canvasEl.width - 4, canvasEl.height - 4);
  labelCtx.font = "bold 52px Inter, sans-serif";
  labelCtx.textAlign = "center";
  labelCtx.textBaseline = "middle";
  labelCtx.fillStyle = "#ffffff";
  labelCtx.fillText(text, canvasEl.width / 2, canvasEl.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvasEl);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(44, 11, 1);
  return sprite;
}

function updateSelectedTurretVisual() {
  if (!Number.isInteger(worldState.selectedTurretId)) {
    clearSelectedTurretVisual();
    return;
  }

  const turret = turrets.find((item) => item.id === worldState.selectedTurretId);
  if (!turret || !turret.owned || turret.level <= 0 || turret.destroyed) {
    worldState.selectedTurretId = null;
    clearSelectedTurretVisual();
    return;
  }

  const key = `${turret.id}-${turret.level}`;
  if (key !== selectedTurretVisualKey) {
    clearSelectedTurretVisual();
    const range = turretRangeByLevel[turret.level] || turretRangeByLevel[1];
    selectedTurretRangeMesh = new THREE.Mesh(
      new THREE.RingGeometry(Math.max(0.5, range - 0.9), range + 0.9, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    selectedTurretRangeMesh.rotation.x = -Math.PI / 2;
    selectedTurretRangeMesh.position.set(turret.x, 0.32, turret.z);
    scene.add(selectedTurretRangeMesh);

    const labelText = `Lv${turret.level} ${turretTypeLabelByLevel[turret.level] || "Turret"}`;
    selectedTurretLabelSprite = createLabelSprite(labelText);
    selectedTurretLabelSprite.position.set(turret.x, 28, turret.z);
    scene.add(selectedTurretLabelSprite);
    selectedTurretVisualKey = key;
  }

  if (selectedTurretRangeMesh) {
    selectedTurretRangeMesh.position.set(turret.x, 0.32, turret.z);
  }
  if (selectedTurretLabelSprite) {
    selectedTurretLabelSprite.position.set(turret.x, 28, turret.z);
  }
}

function selectTurretFromCanvasEvent(event) {
  if (!shopModalEl.classList.contains("hidden")) {
    return;
  }

  const selectableMeshes = turrets
    .filter((turret) => turret.owned && turret.level > 0 && !turret.destroyed)
    .map((turret) => getActiveTurretMesh(turret));
  if (selectableMeshes.length === 0) {
    worldState.selectedTurretId = null;
    return;
  }

  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const intersections = raycaster.intersectObjects(selectableMeshes, false);
  if (intersections.length === 0) {
    worldState.selectedTurretId = null;
    return;
  }

  const hitMesh = intersections[0].object;
  const hitTurretId = Number(hitMesh.userData.turretId);
  worldState.selectedTurretId = Number.isFinite(hitTurretId) ? hitTurretId : null;
}

function createBullet(
  originX,
  originZ,
  targetX,
  targetZ,
  speed,
  damage,
  owner,
  penetration = 0,
  projectileType = "player",
  splashRadius = 0,
  originY = null,
  weaponId = null
) {
  const dx = targetX - originX;
  const dz = targetZ - originZ;
  const len = Math.hypot(dx, dz) || 1;
  const vx = (dx / len) * speed;
  const vz = (dz / len) * speed;

  const mesh = new THREE.Mesh(bulletGeometry, getBulletMaterial(projectileType, owner));
  if (owner === "player" || (owner === "turret" && projectileType === "smg")) {
    mesh.scale.setScalar(0.5);
  }
  mesh.position.set(originX, originY ?? (owner === "player" ? 12 : 4.8), originZ);
  scene.add(mesh);

  const container = owner === "player" ? bullets : turretBullets;
  container.push({
    x: originX,
    z: originZ,
    vx,
    vz,
    damage,
    life: 1.25,
    radius: 1.7,
    mesh,
    owner,
    weaponId,
    penetration,
    pierced: new Set(),
    projectileType,
    splashRadius,
  });
}

function getNearestEnemy(x, z, maxRange = Number.POSITIVE_INFINITY) {
  const isBreachPriorityEnemy = (enemy) => {
    if (!worldState.breach.active) {
      return false;
    }
    const opening = worldState.breach.openingPoint;
    return (
      Math.hypot(enemy.x, enemy.z) <= BASE_HQ_RADIUS + 18 ||
      Math.hypot(enemy.x - opening.x, enemy.z - opening.z) <= 28
    );
  };

  let nearest = null;
  let minDist = Number.POSITIVE_INFINITY;
  let nearestBreach = null;
  let minBreachDist = Number.POSITIVE_INFINITY;
  enemies.forEach((enemy) => {
    const dx = enemy.x - x;
    const dz = enemy.z - z;
    const dist = Math.hypot(dx, dz);
    if (dist <= maxRange && dist < minDist) {
      minDist = dist;
      nearest = enemy;
    }
    if (isBreachPriorityEnemy(enemy) && dist <= maxRange && dist < minBreachDist) {
      minBreachDist = dist;
      nearestBreach = enemy;
    }
  });
  return nearestBreach || nearest;
}

function getNearestEnemyExcluding(x, z, maxRange = Number.POSITIVE_INFINITY, excludeEnemy = null) {
  const isBreachPriorityEnemy = (enemy) => {
    if (!worldState.breach.active) {
      return false;
    }
    const opening = worldState.breach.openingPoint;
    return (
      Math.hypot(enemy.x, enemy.z) <= BASE_HQ_RADIUS + 18 ||
      Math.hypot(enemy.x - opening.x, enemy.z - opening.z) <= 28
    );
  };

  let nearest = null;
  let minDist = Number.POSITIVE_INFINITY;
  let nearestBreach = null;
  let minBreachDist = Number.POSITIVE_INFINITY;
  enemies.forEach((enemy) => {
    if (enemy === excludeEnemy) {
      return;
    }
    const dx = enemy.x - x;
    const dz = enemy.z - z;
    const dist = Math.hypot(dx, dz);
    if (dist <= maxRange && dist < minDist) {
      minDist = dist;
      nearest = enemy;
    }
    if (isBreachPriorityEnemy(enemy) && dist <= maxRange && dist < minBreachDist) {
      minBreachDist = dist;
      nearestBreach = enemy;
    }
  });
  return nearestBreach || nearest;
}

function disposeEnemyVisual(enemy) {
  if (enemy.bossHpBar) {
    const fillMesh = enemy.bossHpBar.userData?.fillMesh;
    const bgMesh = enemy.bossHpBar.userData?.bgMesh;
    enemy.mesh.remove(enemy.bossHpBar);
    if (fillMesh) {
      fillMesh.geometry.dispose();
      fillMesh.material.dispose();
    }
    if (bgMesh) {
      bgMesh.geometry.dispose();
      bgMesh.material.dispose();
    }
  }
  scene.remove(enemy.mesh);
  if (enemy.animationMixer) {
    enemy.animationMixer.stopAllAction();
    enemy.animationMixer.uncacheRoot(enemy.animationRoot || enemy.mesh);
  }
  if (enemy.disposeGeometry && enemy.mesh.geometry?.dispose) {
    enemy.mesh.geometry.dispose();
  }
  if (enemy.disposeMaterial && enemy.mesh.material?.dispose) {
    enemy.mesh.material.dispose();
  }
}

function removeEnemy(enemy) {
  const index = enemies.indexOf(enemy);
  if (index < 0) {
    return;
  }
  spawnEnemyDeathExplosion(enemy);
  spawnZombieSplatter(enemy.x, enemy.z, enemy.radius);
  spawnCreditPickup(enemy.x, enemy.z, enemy.reward || 0);
  disposeEnemyVisual(enemy);
  enemies.splice(index, 1);
  worldState.totalKills += 1;
  if (worldState.phase === "night") {
    worldState.defeatedThisNight += 1;
  }
}

function updateProjectiles(container, dt) {
  for (let index = container.length - 1; index >= 0; index -= 1) {
    const bullet = container[index];
    bullet.x += bullet.vx * dt;
    bullet.z += bullet.vz * dt;
    bullet.life -= dt;
    bullet.mesh.position.set(bullet.x, bullet.mesh.position.y, bullet.z);

    let hit = false;

    const hitTree = getHarvestTreeNearProjectilePoint(bullet.x, bullet.z, bullet.radius);
    if (hitTree && applyProjectileHitToTree(hitTree, bullet)) {
      if (bullet.projectileType === "cannon") {
        const blastRadius = Math.max(8, bullet.splashRadius);
        spawnCannonBlastEffect(bullet.x, bullet.z, blastRadius);
        spawnCannonScorchMark(bullet.x, bullet.z, blastRadius);
        applyAreaDamage(bullet.x, bullet.z, bullet.splashRadius, bullet.damage);
        knockdownHarvestTreesInRadius(bullet.x, bullet.z, blastRadius, bullet.vx, bullet.vz);
      } else if (bullet.projectileType === "flak") {
        const shotSpeed = Math.hypot(bullet.vx, bullet.vz) || 1;
        const hitFacing = Math.atan2(bullet.vx / shotSpeed, bullet.vz / shotSpeed);
        spawnHitPolygonEffect(bullet.x, bullet.z, getEffectFloorY(bullet.x, bullet.z) + 1.15, hitFacing);
      }
      hit = true;
    }

    if (hit) {
      scene.remove(bullet.mesh);
      container.splice(index, 1);
      continue;
    }

    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = enemies[enemyIndex];
      const dx = enemy.x - bullet.x;
      const dz = enemy.z - bullet.z;
      if (bullet.pierced.has(enemy)) {
        continue;
      }
      if (Math.hypot(dx, dz) <= getEnemyHitRadius(enemy) + bullet.radius) {
        enemy.hp -= bullet.damage;
        bullet.pierced.add(enemy);
        const hitY = enemy.isCharacterModel ? enemy.walkBaseY + enemy.radius * 1.35 : enemy.radius + 1.8;
        const hitFacing = enemy.facingYaw || 0;

        const shotSpeed = Math.hypot(bullet.vx, bullet.vz) || 1;
        const shotDirX = bullet.vx / shotSpeed;
        const shotDirZ = bullet.vz / shotSpeed;
        const baseKick = bullet.projectileType === "cannon"
          ? 0.34
          : bullet.projectileType === "grenade"
            ? 0.26
            : bullet.projectileType === "flak"
              ? 0.21
              : 0.15;
        const damageKick = THREE.MathUtils.clamp(bullet.damage / 75, 0.65, 1.55);
        const bossDampen = enemy.isBoss ? 0.45 : 1;
        const reactKick = baseKick * damageKick * bossDampen;
        enemy.hitReactDuration = 0.12;
        enemy.hitReactTime = enemy.hitReactDuration;
        enemy.hitTiltX = THREE.MathUtils.clamp(
          (enemy.hitTiltX || 0) + (-shotDirZ + THREE.MathUtils.randFloatSpread(0.16)) * reactKick,
          -0.34,
          0.34
        );
        enemy.hitTiltZ = THREE.MathUtils.clamp(
          (enemy.hitTiltZ || 0) + (shotDirX + THREE.MathUtils.randFloatSpread(0.16)) * reactKick,
          -0.34,
          0.34
        );

        if (enemy.hp <= 0) {
          removeEnemy(enemy);
        }

        if (bullet.projectileType === "flak") {
          spawnHitPolygonEffect(bullet.x, bullet.z, hitY, hitFacing);
        } else if (bullet.projectileType === "grenade") {
          spawnHitPolygonEffect(bullet.x, bullet.z, hitY, hitFacing);
          applyAreaDamage(bullet.x, bullet.z, bullet.splashRadius, bullet.damage);
          hit = true;
          break;
        } else if (bullet.projectileType === "cannon") {
          const blastRadius = Math.max(8, bullet.splashRadius);
          spawnCannonBlastEffect(bullet.x, bullet.z, blastRadius);
          spawnCannonScorchMark(bullet.x, bullet.z, blastRadius);
          applyAreaDamage(bullet.x, bullet.z, bullet.splashRadius, bullet.damage);
          knockdownHarvestTreesInRadius(bullet.x, bullet.z, blastRadius, bullet.vx, bullet.vz);
          hit = true;
          break;
        } else {
          spawnHitPolygonEffect(bullet.x, bullet.z, hitY, hitFacing);
        }

        if (bullet.penetration > 0) {
          bullet.penetration -= 1;
          continue;
        }
        hit = true;
        break;
      }
    }

    const expiredOrOutOfBounds =
      bullet.life <= 0 ||
      Math.abs(bullet.x) > worldSize.width ||
      Math.abs(bullet.z) > worldSize.depth;

    if (!hit && expiredOrOutOfBounds && bullet.projectileType === "cannon") {
      const missBlastRadius = Math.max(8, bullet.splashRadius * 0.42);
      const knockedCount = knockdownHarvestTreesInRadius(bullet.x, bullet.z, missBlastRadius, bullet.vx, bullet.vz);
      if (knockedCount > 0) {
        spawnCannonBlastEffect(bullet.x, bullet.z, missBlastRadius);
        spawnCannonScorchMark(bullet.x, bullet.z, missBlastRadius);
      }
    }

    if (hit || expiredOrOutOfBounds) {
      scene.remove(bullet.mesh);
      container.splice(index, 1);
    }
  }
}

function updateEnemies(dt) {
  enemies.forEach((enemy) => {
    if ((enemy.hitReactTime || 0) > 0) {
      enemy.hitReactTime = Math.max(0, enemy.hitReactTime - dt);
    }
    enemy.hitTiltX = (enemy.hitTiltX || 0) * Math.max(0, 1 - dt * 14);
    enemy.hitTiltZ = (enemy.hitTiltZ || 0) * Math.max(0, 1 - dt * 14);
    const hitReactAlpha = (enemy.hitReactDuration || 0) > 0
      ? Math.max(0, (enemy.hitReactTime || 0) / enemy.hitReactDuration)
      : 0;

    const opening = worldState.breach.openingPoint;
    const hitRadius = getEnemyHitRadius(enemy);
    const centerDist = Math.hypot(enemy.x, enemy.z);
    const openingDist = Math.hypot(enemy.x - opening.x, enemy.z - opening.z);
    const openingAngle = Math.atan2(opening.z, opening.x);
    const breachInnerRadius = Math.max(ULT_BUNKER_HOUSE_RADIUS + 14, BASE_HQ_RADIUS - 14);
    const breachInnerPointX = Math.cos(openingAngle) * breachInnerRadius;
    const breachInnerPointZ = Math.sin(openingAngle) * breachInnerRadius;
    const wallCollisionRadius = BASE_HQ_RADIUS + hitRadius + 1.5;
    const perimeterMoveRadius = wallCollisionRadius + 4.5;

    let targetX = 0;
    let targetZ = 0;
    let seekingOpening = false;
    let stop = worldState.breach.active
      ? ULT_BUNKER_HOUSE_RADIUS + hitRadius + 0.5
      : base.radius + hitRadius;

    if (worldState.breach.active) {
      const hasCrossedPerimeter = centerDist <= BASE_HQ_RADIUS - Math.max(2, hitRadius * 0.35);
      if (!enemy.breachDirect && (openingDist <= 14 || hasCrossedPerimeter)) {
        enemy.breachDirect = true;
      }

      if (enemy.breachDirect) {
        if (centerDist > breachInnerRadius + hitRadius + 1) {
          targetX = breachInnerPointX;
          targetZ = breachInnerPointZ;
          seekingOpening = true;
          stop = hitRadius + 0.9;
        }
      } else {
        const currentAngle = Math.atan2(enemy.z, enemy.x);
        const delta = THREE.MathUtils.euclideanModulo(openingAngle - currentAngle + Math.PI, Math.PI * 2) - Math.PI;
        const isInsideWallCircle = centerDist < wallCollisionRadius;

        if (isInsideWallCircle && openingDist > 16) {
          const safeCenterDist = Math.max(0.001, centerDist);
          targetX = (enemy.x / safeCenterDist) * perimeterMoveRadius;
          targetZ = (enemy.z / safeCenterDist) * perimeterMoveRadius;
          seekingOpening = true;
          stop = 1;
        } else if (Math.abs(delta) < 0.2 || openingDist < 16) {
          targetX = opening.x;
          targetZ = opening.z;
          seekingOpening = true;
          stop = hitRadius + 1.2;
        } else {
          const moveSign = delta > 0 ? 1 : -1;
          const tangentAngle = currentAngle + moveSign * 0.32;
          targetX = Math.cos(tangentAngle) * perimeterMoveRadius;
          targetZ = Math.sin(tangentAngle) * perimeterMoveRadius;
          seekingOpening = true;
          stop = hitRadius + 0.9;
        }
      }
    }

    const dx = targetX - enemy.x;
    const dz = targetZ - enemy.z;
    const dist = Math.hypot(dx, dz) || 1;

    if (dist > stop) {
      const moveDirX = dx / dist;
      const moveDirZ = dz / dist;
      const step = Math.min(enemy.speed * dt, dist - stop);
      enemy.x += moveDirX * step;
      enemy.z += moveDirZ * step;
      if (!enemy.isCharacterModel) {
        enemy.mesh.position.set(enemy.x, enemy.mesh.position.y, enemy.z);
      }

      if (enemy.isCharacterModel) {
        enemy.facingYaw = Math.atan2(moveDirX, moveDirZ) + (enemy.facingOffset || 0);

        enemy.walkBobPhase += dt * (5.2 + enemy.speed * 0.016);
        enemy.shamblePhase += dt * (11.5 + enemy.speed * 0.03);
        const runSwayX = Math.sin(enemy.shamblePhase * 1.35) * ENEMY_SHAMBLE_SWAY;
        const runSwayZ = Math.cos(enemy.shamblePhase * 1.9 + 0.8) * ENEMY_SHAMBLE_SWAY;
        enemy.mesh.position.x = enemy.x + runSwayX;
        enemy.mesh.position.z = enemy.z + runSwayZ;
        enemy.mesh.position.y = enemy.walkBaseY + Math.sin(enemy.walkBobPhase) * 0.34;

        enemy.dustTimer -= dt;
        if (enemy.dustTimer <= 0) {
          spawnCreepDust(enemy, moveDirX, moveDirZ);
          spawnCreepDust(enemy, moveDirX, moveDirZ);
          const interval = Math.max(0.035, 0.075 - enemy.speed * 0.00033);
          enemy.dustTimer = interval + Math.random() * interval * 0.35;
        }
      }
    } else {
      if (!worldState.breach.active) {
        const hitAngle = Math.atan2(enemy.z, enemy.x);
        worldState.breach.lastHitSegmentIndex = getSegmentIndexFromAngle(hitAngle);
      }

      const damageRadius = worldState.breach.active ? ULT_BUNKER_HOUSE_RADIUS : base.radius;
      const touchingDamageRadius = centerDist <= damageRadius + hitRadius + 0.5;
      const canDamageCore = !worldState.breach.active
        ? touchingDamageRadius
        : enemy.breachDirect && !seekingOpening && touchingDamageRadius;
      if (canDamageCore) {
        if (worldState.breach.active) {
          worldState.breach.bunkerHp = Math.max(0, worldState.breach.bunkerHp - enemy.damagePerSecond * dt);
        } else {
          base.hp = Math.max(0, base.hp - enemy.damagePerSecond * dt);
        }
      }
      if (enemy.isCharacterModel) {
        enemy.shamblePhase += dt * 26;
        const latchShakeX = Math.sin(enemy.shamblePhase * 3.8) * ENEMY_CHOMP_SHAKE;
        const latchShakeZ = Math.cos(enemy.shamblePhase * 4.4 + 0.6) * ENEMY_CHOMP_SHAKE;
        enemy.mesh.position.x = enemy.x + latchShakeX;
        enemy.mesh.position.z = enemy.z + latchShakeZ;
        enemy.mesh.position.y = enemy.walkBaseY + Math.abs(Math.sin(enemy.shamblePhase * 3.1)) * ENEMY_CHOMP_Y_BOUNCE;
      } else {
        enemy.mesh.position.set(enemy.x, enemy.mesh.position.y, enemy.z);
      }
    }

    if (enemy.animationMixer) {
      enemy.animationMixer.update(dt);
      try {
        if (window.__l1Debug && !window.__l1Debug.mixerUpdatedLogged) {
          window.__l1Debug.mixerUpdatedLogged = true;
          const maybeAction = enemy.animationMixer._actions && enemy.animationMixer._actions[0];
          // Collect action/clip diagnostics
          const actionsDiag = (enemy.animationMixer._actions || []).map((a) => {
            return {
              clipName: a._clip?.name || null,
              time: a.time ?? null,
              weight: typeof a.getEffectiveWeight === 'function' ? a.getEffectiveWeight() : a.weight,
              clipTracks: a._clip?.tracks?.length || 0,
            };
          });

          let bindingCount = null;
          let bindingSample = null;
          try {
            bindingCount = enemy.animationMixer._bindings ? enemy.animationMixer._bindings.length : null;
            bindingSample = (enemy.animationMixer._bindings || []).slice(0, 20).map((b) => {
              try {
                return b?.binding?.path || b?.binding?.parsedPath || b?._propertyBinding || b?.binding?.cachedPath || null;
              } catch (e) {
                return null;
              }
            });
          } catch (e) {
            bindingSample = null;
          }

          console.info('[L1 DEBUG] mixer.update executed for enemy', {
            x: enemy.x,
            z: enemy.z,
            dt,
            mixerTime: enemy.animationMixer.time ?? null,
            actions: actionsDiag,
            actionCount: enemy.animationMixer._actions ? enemy.animationMixer._actions.length : null,
            bindingCount,
            bindingSample,
          });
        }
      } catch (e) {
        console.warn('[L1 DEBUG] mixer.update debug log failed', e);
      }
      // Ensure skinned meshes' skeletons are updated after mixer advances
      try {
        (enemy.animationRoot || {}).traverse?.((n) => {
          if (n.isSkinnedMesh && n.skeleton && typeof n.skeleton.update === 'function') {
            n.skeleton.update();
          }
        });
      } catch (e) {
        console.warn('[L1 DEBUG] skeleton update after mixer failed', e);
      }
      if (enemy.animationRoot) {
        enemy.animationRoot.rotation.y = 0;
      }
    }

    if (enemy.isCharacterModel) {
      const yawSway = Math.sin(enemy.shamblePhase * 1.5) * ENEMY_SHAMBLE_YAW_SWAY;
      enemy.mesh.rotation.y = enemy.facingYaw + yawSway;
      enemy.mesh.rotation.x = enemy.hitTiltX * hitReactAlpha;
      enemy.mesh.rotation.z = enemy.hitTiltZ * hitReactAlpha;
    }

    if (enemy.bossHpBar) {
      enemy.bossHpBar.quaternion.copy(camera.quaternion);
      const hpPct = THREE.MathUtils.clamp(enemy.hp / Math.max(1, enemy.maxHp || enemy.hp), 0, 1);
      const fillMesh = enemy.bossHpBar.userData.fillMesh;
      const fillBaseWidth = enemy.bossHpBar.userData.fillBaseWidth || 1;
      fillMesh.scale.x = hpPct;
      fillMesh.position.x = -(fillBaseWidth * (1 - hpPct)) * 0.5;
    }
  });
}

function fireTwinFlakShots(turret, target, speed, totalDamage, penetration = 2, mounted = false) {
  const dirDx = target.x - turret.x;
  const dirDz = target.z - turret.z;
  const dirLen = Math.hypot(dirDx, dirDz) || 1;
  const dirX = dirDx / dirLen;
  const dirZ = dirDz / dirLen;
  const spread = 2.2;
  const perShotDamage = totalDamage * 0.5;

  const leftMuzzle = getTurretMuzzleOrigin(turret, dirX, dirZ, "flak", mounted, spread);
  const rightMuzzle = getTurretMuzzleOrigin(turret, dirX, dirZ, "flak", mounted, -spread);

  createBullet(leftMuzzle.x, leftMuzzle.z, target.x, target.z, speed, perShotDamage, "turret", penetration, "flak", 0, leftMuzzle.y);
  createBullet(rightMuzzle.x, rightMuzzle.z, target.x, target.z, speed, perShotDamage, "turret", penetration, "flak", 0, rightMuzzle.y);
  spawnMuzzleFlash(leftMuzzle.x, leftMuzzle.z, dirX, dirZ, "turret", "mesh", leftMuzzle.y);
  spawnMuzzleFlash(rightMuzzle.x, rightMuzzle.z, dirX, dirZ, "turret", "mesh", rightMuzzle.y);
}

function getTurretMuzzleOrigin(turret, dirX, dirZ, projectileType = "smg", mounted = false, lateralOffset = 0) {
  const baseOffset = projectileType === "cannon" ? 17 : projectileType === "flak" ? 12.5 : 12;
  const mountedBonus = mounted ? 3 : 0;
  const offset = baseOffset + mountedBonus;
  const activeMesh = getActiveTurretMesh(turret);
  const mountedRotator = activeMesh?.userData?.mountedRotator;
  const recoilMesh = activeMesh?.userData?.recoilMesh;
  const useBarrelRoot = projectileType === "cannon" || projectileType === "flak";
  const referenceRoot = mounted && mountedRotator
    ? mountedRotator
    : (useBarrelRoot && recoilMesh ? recoilMesh : activeMesh);
  referenceRoot.getWorldPosition(turretMuzzleWorldPos);
  const sideX = -dirZ;
  const sideZ = dirX;
  const yOffset = projectileType === "cannon"
    ? 0.55
    : projectileType === "flak"
      ? (mounted ? 0.45 : 0.35)
      : (mounted ? 1.1 : 0.95);
  return {
    x: turret.x + dirX * offset + sideX * lateralOffset,
    z: turret.z + dirZ * offset + sideZ * lateralOffset,
    y: turretMuzzleWorldPos.y + yOffset,
  };
}

function updateTurrets(dt) {
  turrets.forEach((turret) => {
    syncTurretVisualState(turret);

    const level = Math.max(1, Math.min(6, turret.level || 1));
    const recoilRecovery = turretRecoilRecoveryByLevel[level] || turretRecoilRecoveryByLevel[1];
    turret.turretRecoil = Math.max(0, (turret.turretRecoil || 0) - recoilRecovery * dt);
    applyTurretRecoilVisual(turret);

    if (!turret.owned || turret.level <= 0 || turret.destroyed) {
      return;
    }
    turret.cooldown = Math.max(0, turret.cooldown - dt);
    turret.mountedCooldown = Math.max(0, (turret.mountedCooldown || 0) - dt);
    const stats = turretStatsByLevel[turret.level];
    const range = turretRangeByLevel[turret.level] || 150;
    const target = getNearestEnemy(turret.x, turret.z, range);
    if (!target) {
      return;
    }

    const activeMesh = getActiveTurretMesh(turret);
    const desiredYaw = Math.atan2(target.x - turret.x, target.z - turret.z) + TURRET_AIM_Y_OFFSET;
    if (!Number.isFinite(turret.aimYaw)) {
      turret.aimYaw = activeMesh.rotation.y;
    }
    const maxTurnStep = (turretTurnSpeedByLevel[turret.level] || turretTurnSpeedByLevel[1]) * dt;
    const yawDelta = THREE.MathUtils.euclideanModulo(desiredYaw - turret.aimYaw + Math.PI, Math.PI * 2) - Math.PI;
    const appliedStep = THREE.MathUtils.clamp(yawDelta, -maxTurnStep, maxTurnStep);
    turret.aimYaw += appliedStep;
    activeMesh.rotation.y = turret.aimYaw;

    const dirDx = target.x - turret.x;
    const dirDz = target.z - turret.z;
    const dirLen = Math.hypot(dirDx, dirDz) || 1;
    const dirX = dirDx / dirLen;
    const dirZ = dirDz / dirLen;

    const mountedStats = turret.level >= 5 ? mountedWeaponStatsByLevel[turret.level] : null;
    const mountedRotator = activeMesh.userData?.mountedRotator;
    const mountedTarget = mountedStats
      ? getNearestEnemyExcluding(turret.x, turret.z, Math.max(140, range * 0.92), target) || target
      : null;
    let mountedYawDelta = 0;

    if (mountedStats && mountedRotator && mountedTarget) {
      const mountedDesiredYaw = Math.atan2(mountedTarget.x - turret.x, mountedTarget.z - turret.z) + TURRET_AIM_Y_OFFSET;
      if (!Number.isFinite(turret.mountedAimYaw)) {
        turret.mountedAimYaw = turret.aimYaw;
      }
      const mountedTurnStep = (turretTurnSpeedByLevel[turret.level] || turretTurnSpeedByLevel[1]) * 1.25 * dt;
      mountedYawDelta = THREE.MathUtils.euclideanModulo(mountedDesiredYaw - turret.mountedAimYaw + Math.PI, Math.PI * 2) - Math.PI;
      const mountedAppliedStep = THREE.MathUtils.clamp(mountedYawDelta, -mountedTurnStep, mountedTurnStep);
      turret.mountedAimYaw += mountedAppliedStep;
      mountedRotator.rotation.y = turret.mountedAimYaw - turret.aimYaw;
    }

    if (turret.cooldown <= 0 && Math.abs(yawDelta) <= TURRET_FIRE_ANGLE_TOLERANCE) {
      if (turret.level === 3) {
        fireTwinFlakShots(turret, target, stats.speed, stats.damage, 2, false);
      } else {
        const projectileType = turret.level >= 4 ? "cannon" : "smg";
        const splashRadius = turret.level >= 4 ? 22 : 0;
        const muzzleOrigin = getTurretMuzzleOrigin(turret, dirX, dirZ, projectileType, false);
        createBullet(
          muzzleOrigin.x,
          muzzleOrigin.z,
          target.x,
          target.z,
          stats.speed,
          stats.damage,
          "turret",
          turret.level === 2 ? 1 : 0,
          projectileType,
          splashRadius,
          muzzleOrigin.y
        );
        spawnMuzzleFlash(muzzleOrigin.x, muzzleOrigin.z, dirX, dirZ, "turret", "mesh", muzzleOrigin.y);
        if (projectileType === "smg") {
          spawnShellCasingEject("ar15", dirX, dirZ, turret.x, turret.z, muzzleOrigin.y, 1.1, getEffectFloorY(turret.x, turret.z));
        } else if (projectileType === "cannon") {
          const cannonShellOrigin = getTurretMuzzleOrigin(turret, dirX, dirZ, "cannon", false);
          spawnShellCasingEject(
            "cannon",
            dirX,
            dirZ,
            cannonShellOrigin.x,
            cannonShellOrigin.z,
            cannonShellOrigin.y,
            3.2,
            getEffectFloorY(cannonShellOrigin.x, cannonShellOrigin.z)
          );
        }
      }

      const recoilKick = turretRecoilKickByLevel[turret.level] || turretRecoilKickByLevel[1];
      const recoilMax = turretRecoilMaxByLevel[turret.level] || turretRecoilMaxByLevel[1];
      turret.turretRecoil = Math.min(recoilMax, (turret.turretRecoil || 0) + recoilKick);
      applyTurretRecoilVisual(turret);
      turret.cooldown = stats.fireRate;
    }

    if (turret.level >= 5) {
      if (mountedStats && mountedTarget && turret.mountedCooldown <= 0 && Math.abs(mountedYawDelta) <= TURRET_FIRE_ANGLE_TOLERANCE) {
        if (mountedStats.type === "flak") {
          fireTwinFlakShots(turret, mountedTarget, mountedStats.speed, mountedStats.damage, mountedStats.penetration, true);
        } else {
          const mountDx = mountedTarget.x - turret.x;
          const mountDz = mountedTarget.z - turret.z;
          const mountLen = Math.hypot(mountDx, mountDz) || 1;
          const mountDirX = mountDx / mountLen;
          const mountDirZ = mountDz / mountLen;
          const muzzleOrigin = getTurretMuzzleOrigin(turret, mountDirX, mountDirZ, "smg", true);

          createBullet(
            muzzleOrigin.x,
            muzzleOrigin.z,
            mountedTarget.x,
            mountedTarget.z,
            mountedStats.speed,
            mountedStats.damage,
            "turret",
            mountedStats.penetration,
            "smg",
            0,
            muzzleOrigin.y
          );
          spawnMuzzleFlash(muzzleOrigin.x, muzzleOrigin.z, mountDirX, mountDirZ, "turret", "mesh", muzzleOrigin.y);
          spawnShellCasingEject("m249", mountDirX, mountDirZ, turret.x, turret.z, muzzleOrigin.y, 1.1, getEffectFloorY(turret.x, turret.z));
        }
        turret.mountedCooldown = mountedStats.fireRate;
      }
    }
  });
}

function setPlayerFacingFromDirection(dirX, dirZ) {
  if (!Number.isFinite(dirX) || !Number.isFinite(dirZ)) {
    return;
  }
  const len = Math.hypot(dirX, dirZ);
  if (len < 0.0001) {
    return;
  }
  player.desiredFacingYaw = Math.atan2(dirX / len, dirZ / len);
}

function updatePlayerFacing(dt) {
  const yawDelta = THREE.MathUtils.euclideanModulo(player.desiredFacingYaw - player.facingYaw + Math.PI, Math.PI * 2) - Math.PI;
  const maxStep = PLAYER_TURN_SPEED * dt;
  const step = THREE.MathUtils.clamp(yawDelta, -maxStep, maxStep);
  player.facingYaw += step;
  playerMesh.rotation.y = player.facingYaw + PLAYER_FACING_OFFSET;
}

function updatePlayerWeaponAim(dt) {
  player.weaponAimTimer = Math.max(0, player.weaponAimTimer - dt);
  playerWeaponRecoil = Math.max(0, playerWeaponRecoil - PLAYER_WEAPON_RECOIL_RECOVERY * dt);
  const targetPitch = player.weaponAimTimer > 0 ? PLAYER_WEAPON_AIM_PITCH : PLAYER_WEAPON_IDLE_PITCH;
  const blend = 1 - Math.exp(-12 * dt);

  playerWeaponMount.rotation.x += (targetPitch - playerWeaponMount.rotation.x) * blend;
  playerWeaponMount.rotation.y += (PLAYER_WEAPON_IDLE_YAW - playerWeaponMount.rotation.y) * blend;
  playerWeaponMount.position.set(
    PLAYER_WEAPON_MOUNT_BASE_X,
    PLAYER_WEAPON_MOUNT_BASE_Y,
    PLAYER_WEAPON_MOUNT_BASE_Z + playerWeaponRecoil
  );
}

function updatePlayerShooting(dt) {
  if (ultimateBunkerSequence.active) {
    return;
  }
  if (playerAxeState.equipped) {
    return;
  }
  if (player.isReloading) {
    return;
  }
  player.shootCooldown = Math.max(0, player.shootCooldown - dt);
  const target = getNearestEnemy(player.x, player.z, 260);
  if (!target) {
    return;
  }

  const shotDx = target.x - player.x;
  const shotDz = target.z - player.z;
  const shotLength = Math.hypot(shotDx, shotDz) || 1;
  const shotDirX = shotDx / shotLength;
  const shotDirZ = shotDz / shotLength;
  setPlayerFacingFromDirection(shotDirX, shotDirZ);

  if (player.shootCooldown > 0) {
    return;
  }

  if (player.ammoInMag <= 0) {
    player.ammoInMag = 0;
    player.isReloading = true;
    player.reloadTimer = player.reloadTime;
    spawnReloadClipEject(player.weaponId);
    return;
  }

  const muzzleOffset = 29;
  const muzzleX = player.x + shotDirX * muzzleOffset;
  const muzzleZ = player.z + shotDirZ * muzzleOffset;

  createBullet(
    muzzleX,
    muzzleZ,
    target.x,
    target.z,
    player.bulletSpeed,
    player.damage,
    "player",
    playerBulletPenetrationByWeapon[player.weaponId] || 0,
    "player",
    0,
    null,
    player.weaponId
  );
  const playerFlashStyle = "mesh";
  const playerMuzzleFlashOrigin = getPlayerMuzzleFlashOrigin(shotDirX, shotDirZ);
  spawnMuzzleFlash(
    playerMuzzleFlashOrigin.x,
    playerMuzzleFlashOrigin.z,
    shotDirX,
    shotDirZ,
    "player",
    playerFlashStyle,
    playerMuzzleFlashOrigin.y,
    0
  );
  spawnShellCasingEject(player.weaponId, shotDirX, shotDirZ, player.x, player.z, 12.7, 4.6, getEffectFloorY(player.x, player.z));
  player.weaponAimTimer = Math.max(player.weaponAimTimer, PLAYER_WEAPON_AIM_HOLD);
  playerWeaponRecoil = Math.min(PLAYER_WEAPON_RECOIL_MAX, playerWeaponRecoil + PLAYER_WEAPON_RECOIL_KICK);
  player.ammoInMag -= 1;
  player.shootCooldown = player.fireRate;
}

function updateMovement(dt) {
  if (ultimateBunkerSequence.active) {
    return;
  }
  const xAxis = (worldState.keys.has("d") || worldState.keys.has("arrowright") ? 1 : 0) -
    (worldState.keys.has("a") || worldState.keys.has("arrowleft") ? 1 : 0);
  const zAxis = (worldState.keys.has("s") || worldState.keys.has("arrowdown") ? 1 : 0) -
    (worldState.keys.has("w") || worldState.keys.has("arrowup") ? 1 : 0);
  if (xAxis === 0 && zAxis === 0) {
    return;
  }

  const cameraForward = new THREE.Vector3();
  camera.getWorldDirection(cameraForward);
  cameraForward.y = 0;
  if (cameraForward.lengthSq() < 0.000001) {
    return;
  }
  cameraForward.normalize();

  const cameraRight = new THREE.Vector3().crossVectors(cameraForward, new THREE.Vector3(0, 1, 0)).normalize();
  const moveDir = new THREE.Vector3()
    .addScaledVector(cameraRight, xAxis)
    .addScaledVector(cameraForward, -zAxis)
    .normalize();

  player.x += moveDir.x * player.speed * dt;
  player.z += moveDir.z * player.speed * dt;
  clampPosition();
  playerMesh.position.set(player.x, PLAYER_VISUAL_Y, player.z);
  setPlayerFacingFromDirection(moveDir.x, moveDir.z);

  player.dustTimer -= dt;
  if (player.dustTimer <= 0) {
    for (let index = 0; index < PLAYER_DUST_PUFFS_PER_EMIT; index += 1) {
      spawnCreepDust(player, moveDir.x, moveDir.z, 2);
    }
    player.dustTimer = PLAYER_DUST_EMIT_INTERVAL_MIN + Math.random() * PLAYER_DUST_EMIT_INTERVAL_VARIANCE;
  }
}

function updateHud() {
  const totalSeconds =
    worldState.phase === "day"
      ? Math.floor((worldState.dayTimer / worldState.dayLength) * 12 * 60)
      : Math.floor(((worldState.nightLength - worldState.nightTimer) / worldState.nightLength) * 12 * 60);
  const minuteOfDay = 8 * 60 + totalSeconds;
  const hour24 = Math.floor((minuteOfDay % (24 * 60)) / 60);
  const amPm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  dayClockEl.textContent = `${String(hour12).padStart(2, "0")}:${String(minuteOfDay % 60).padStart(2, "0")} ${amPm}`;
  phaseLabelEl.textContent = worldState.phase === "day" ? `Day #${worldState.dayNumber}` : `Night #${worldState.nightNumber}`;
  phaseLabelEl.className = `phase ${worldState.phase}`;
  nightTimerEl.textContent =
    worldState.phase === "day"
      ? `Night in ${Math.max(0, Math.ceil(worldState.dayLength - worldState.dayTimer))}s`
      : `Dawn in ${Math.max(0, Math.ceil(worldState.nightTimer))}s`;
  phaseIconEl.textContent = worldState.phase === "day" ? "🌞" : "🌙";

  if (worldState.phase === "night") {
    const alive = Math.max(worldState.totalNightEnemies - worldState.defeatedThisNight, 0);
    enemiesLeftEl.textContent = `${worldState.isBossWave ? "Bosses Left" : "Enemies Left"}: ${alive}`;
    enemiesLeftEl.style.display = "block";
  } else {
    enemiesLeftEl.style.display = "none";
  }

  killsHudEl.textContent = `Kills: ${worldState.totalKills}`;
  creditsTextEl.textContent = `Credits: ${worldState.credits}`;
  ammoTextEl.textContent = player.isReloading
    ? `Reloading: ${Math.max(0, Math.ceil(player.reloadTimer * 10) / 10)}s`
    : `Ammo: ${player.ammoInMag} / ${player.magSize}`;

  if (ultimateBunkerSequence.active) {
    ultimateStatusEl.textContent = "Ultimate: DEPLOYING...";
  } else if (!worldState.ultimate.hasStarted) {
    ultimateStatusEl.textContent = "Ultimate: starts Night 1";
  } else if (worldState.ultimate.timer > 0) {
    ultimateStatusEl.textContent = `Ultimate: ${Math.ceil(worldState.ultimate.timer)}s`;
  } else if (enemies.length === 0) {
    ultimateStatusEl.textContent = "Ultimate: No targets";
  } else {
    ultimateStatusEl.textContent = "Ultimate: READY (Q)";
  }
  const ultimateReady =
    !ultimateBunkerSequence.active &&
    worldState.ultimate.hasStarted &&
    worldState.ultimate.timer <= 0 &&
    enemies.length > 0;
  ultimateStatusEl.classList.toggle("ready", ultimateReady);

  speedButtons.forEach((button) => {
    const isActive = Number(button.dataset.speed) === worldState.timeScaleDay;
    button.classList.toggle("active", isActive);
  });

  const baseHpPct = Math.max(0, Math.min(1, base.hp / base.maxHp));
  baseHpTextEl.textContent = `Wall HP: ${Math.ceil(base.hp)} / ${base.maxHp}`;
  baseHpFillEl.style.width = `${baseHpPct * 100}%`;
  baseHpFillEl.style.background = baseHpPct > 0.4 ? "#53d48b" : "#e28f51";

  if (bunkerHpTextEl && bunkerHpFillEl) {
    const bunkerDisplayHp = worldState.breach.active
      ? Math.ceil(worldState.breach.bunkerHp)
      : worldState.breach.bunkerMaxHp;
    const bunkerHpPct = Math.max(0, Math.min(1, bunkerDisplayHp / worldState.breach.bunkerMaxHp));
    bunkerHpTextEl.textContent = `Bunker HP: ${bunkerDisplayHp} / ${worldState.breach.bunkerMaxHp}`;
    bunkerHpFillEl.style.width = `${bunkerHpPct * 100}%`;
    bunkerHpFillEl.style.background = bunkerHpPct > 0.4 ? "#53d48b" : "#e28f51";
  }

  const playerHpPct = Math.max(0, Math.min(1, player.hp / player.maxHp));
  playerHpTextEl.textContent = `Player HP: ${Math.ceil(player.hp)} / ${player.maxHp}`;
  playerHpFillEl.style.width = `${playerHpPct * 100}%`;
  playerHpFillEl.style.background = playerHpPct > 0.4 ? "#53d48b" : "#e28f51";

  const showSkipToNight = worldState.devMode && worldState.phase === "day" && !worldState.gameOver;
  skipNightBtn.hidden = !showSkipToNight;
  skipNightBtn.disabled = !showSkipToNight;

  if (skipCurrentNightBtn) {
    const showSkipNight = worldState.devMode && worldState.phase === "night" && !worldState.gameOver;
    skipCurrentNightBtn.hidden = !showSkipNight;
    skipCurrentNightBtn.disabled = !showSkipNight;
  }

  const nearBunkerForDrop =
    worldState.carriedLogs > 0 &&
    Math.hypot(player.x - ULT_BUNKER_POSITION.x, player.z - ULT_BUNKER_POSITION.z) <= ULT_BUNKER_HOUSE_RADIUS + 18;
  const actionHint = nearBunkerForDrop ? " | Auto unloading..." : "";
  const breachHint = worldState.breach.active ? " | BREACH!" : "";
  woodHudEl.textContent = `Wood: ${worldState.woodStock} | Stone: ${worldState.stoneStock} | Backpack: ${worldState.carriedLogs}/${MAX_CARRIED_LOGS}${actionHint}${breachHint}`;
}

function setPaused(value) {
  worldState.paused = value;
  pauseBtn.textContent = value ? "▶" : "Ⅱ";
}

function resetPrototype() {
  base.hp = base.maxHp;
  player.hp = player.maxHp;
  player.x = 0;
  player.z = 34;
  player.facingYaw = 0;
  player.desiredFacingYaw = 0;
  player.dustTimer = 0;
  player.weaponAimTimer = 0;
  playerWeaponRecoil = 0;
  resetUltimateBunkerSequence();
  playerMesh.position.set(player.x, PLAYER_VISUAL_Y, player.z);
  playerMesh.rotation.y = player.facingYaw + PLAYER_FACING_OFFSET;
  playerWeaponMount.position.set(PLAYER_WEAPON_MOUNT_BASE_X, PLAYER_WEAPON_MOUNT_BASE_Y, PLAYER_WEAPON_MOUNT_BASE_Z);
  playerWeaponMount.rotation.set(PLAYER_WEAPON_IDLE_PITCH, PLAYER_WEAPON_IDLE_YAW, 0);

  enemies.splice(0).forEach((enemy) => {
    disposeEnemyVisual(enemy);
  });

  [...bullets, ...turretBullets].forEach((bullet) => {
    scene.remove(bullet.mesh);
  });
  bullets.length = 0;
  turretBullets.length = 0;
  impactEffects.splice(0).forEach((effect) => {
    scene.remove(effect.mesh);
    effect.mesh.geometry.dispose();
    effect.mesh.material.dispose();
  });
  enemyDeathEffects.splice(0).forEach((effect) => {
    if (effect.ringMesh) {
      scene.remove(effect.ringMesh);
      effect.ringMesh.geometry?.dispose?.();
      effect.ringMesh.material?.dispose?.();
    }
    (effect.particles || []).forEach((particle) => {
      scene.remove(particle.mesh);
      particle.mesh.geometry?.dispose?.();
      particle.mesh.material?.dispose?.();
    });
  });
  zombieSplatters.splice(0).forEach((splatter) => {
    scene.remove(splatter.mesh);
    splatter.mesh.geometry.dispose();
    splatter.mesh.material.dispose();
  });
  creepDustPuffs.splice(0).forEach((puff) => {
    scene.remove(puff.mesh);
    puff.mesh.material.dispose();
  });
  muzzleFlashes.splice(0).forEach((flash) => {
    scene.remove(flash.mesh);
    flash.mesh.geometry?.dispose?.();
    flash.mesh.material.dispose();
  });
  axeSwooshes.splice(0).forEach((swoosh) => {
    scene.remove(swoosh.mesh);
    swoosh.mesh.geometry?.dispose?.();
    swoosh.mesh.material.dispose();
  });
  droppedHarvestLogs.splice(0).forEach((pickup) => {
    scene.remove(pickup.mesh);
    pickup.mesh.geometry?.dispose?.();
    pickup.mesh.material.dispose();
  });
  droppedCreditPickups.splice(0).forEach((pickup) => {
    scene.remove(pickup.mesh);
    pickup.mesh.traverse?.((node) => {
      if (!node.isMesh) {
        return;
      }
      node.geometry?.dispose?.();
      if (Array.isArray(node.material)) {
        node.material.forEach((material) => material?.dispose?.());
      } else {
        node.material?.dispose?.();
      }
    });
  });
  treeLeafParticles.splice(0).forEach((leaf) => {
    scene.remove(leaf.mesh);
    leaf.mesh.geometry?.dispose?.();
    leaf.mesh.material.dispose();
  });
  ejectedReloadProps.splice(0).forEach((prop) => {
    scene.remove(prop.mesh);
    prop.mesh.traverse?.((node) => {
      if (node.isMesh) {
        node.geometry?.dispose?.();
        if (node.material && !Array.isArray(node.material)) {
          node.material.dispose?.();
        }
      }
    });
  });
  ejectedShellCasings.splice(0).forEach((shell) => {
    scene.remove(shell.mesh);
    if (shell.disposeOnRemove) {
      shell.mesh.traverse?.((node) => {
        if (!node.isMesh) {
          return;
        }
        node.geometry?.dispose?.();
        if (Array.isArray(node.material)) {
          node.material.forEach((material) => material?.dispose?.());
        } else {
          node.material?.dispose?.();
        }
      });
    } else {
      shell.mesh.geometry.dispose();
      shell.mesh.material.dispose();
    }
  });
  ultimateWaves.splice(0).forEach((wave) => {
    disposeUltimateWave(wave);
  });
  clearSelectedTurretVisual();

  worldState.totalKills = 0;
  worldState.credits = 0;
  worldState.woodStock = 0;
  worldState.stoneStock = 0;
  worldState.carriedLogs = 0;
  worldState.growthCycleCount = 0;
  worldState.phase = "day";
  worldState.dayNumber = 1;
  worldState.nightNumber = 0;
  worldState.dayTimer = 0;
  worldState.nightTimer = 0;
  worldState.spawnAccumulator = 0;
  worldState.secondWavePending = 0;
  worldState.secondWaveTimer = 0;
  worldState.thirdWavePending = 0;
  worldState.thirdWaveTimer = 0;
  worldState.fourthWavePending = 0;
  worldState.fourthWaveTimer = 0;
  worldState.fifthWavePending = 0;
  worldState.fifthWaveTimer = 0;
  worldState.spawnedThisNight = 0;
  worldState.totalNightEnemies = 0;
  worldState.defeatedThisNight = 0;
  worldState.isBossWave = false;
  worldState.ownedWeapons = new Set(["glock"]);
  worldState.ownedAttachments = new Set();
  worldState.pickupPullLevel = 0;
  worldState.pickupPullMultiplier = 1;
  worldState.baseUpgradeLevel = 0;
  closeBreach();
  worldState.breach.lastHitSegmentIndex = -1;
  applyBaseUpgradeVisuals();
  worldState.ultimate.timer = 0;
  worldState.ultimate.hasStarted = true;
  worldState.gameOver = false;
  setAxeEquipped(false);
  playerAxeState.swingTimer = 0;
  playerAxeState.autoChopCooldown = 0;
  playerAxeState.autoMineCooldown = 0;
  playerAxeState.fullAlertCooldown = 0;
  if (playerSpeechBubble.sprite) {
    playerMesh.remove(playerSpeechBubble.sprite);
    playerSpeechBubble.sprite.material.map?.dispose?.();
    playerSpeechBubble.sprite.material.dispose?.();
    playerSpeechBubble.sprite = null;
    playerSpeechBubble.timer = 0;
  }
  woodSuckEffects.splice(0).forEach((effect) => {
    scene.remove(effect.mesh);
    effect.mesh.geometry?.dispose?.();
    effect.mesh.material?.dispose?.();
  });
  updateCarriedLogsVisual();
  if (fieldScatterPropsGroup) {
    scene.remove(fieldScatterPropsGroup);
    fieldScatterPropsGroup.traverse((node) => {
      if (!node.isMesh) {
        return;
      }
      node.geometry?.dispose?.();
      if (Array.isArray(node.material)) {
        node.material.forEach((material) => material?.dispose?.());
      } else {
        node.material?.dispose?.();
      }
    });
    fieldScatterPropsGroup = null;
    fieldScatterPropsBuilt = false;
    fieldScatterPropsLoadStarted = false;
  }
  resetHarvestTrees(HARVEST_TREE_MAX_GROWTH_STAGE);
  resetHarvestStones(HARVEST_STONE_MAX_GROWTH_STAGE);
  loadFieldScatterProps();
  base.maxHp = BASE_HP_TIERS[0];
  base.hp = BASE_HP_TIERS[0];
  turrets.forEach((turret) => {
    const startsOwned = turret.label === "Middle";
    turret.owned = startsOwned;
    turret.level = startsOwned ? 1 : 0;
    turret.destroyed = false;
    turret.destroyedLevel = 1;
    turret.cooldown = 0;
    turret.mountedCooldown = 0;
    turret.turretRecoil = 0;
    turret.aimYaw = turretSlotYawByLabel[turret.label] ?? -Math.PI / 2;
    turret.mountedAimYaw = turret.aimYaw;
    setTurretDestroyedVisualState(turret, false);
    applyTurretRecoilVisual(turret);
    syncTurretVisualState(turret);
  });
  setPlayerWeapon("glock");
  setShopModalOpen(false);
  updateShopUi();
  setPaused(false);
  gameOverModalEl.classList.add("hidden");
}

function activateUltimate() {
  if (
    worldState.gameOver ||
    worldState.paused ||
    ultimateBunkerSequence.active ||
    !worldState.ultimate.hasStarted ||
    worldState.ultimate.timer > 0 ||
    enemies.length === 0
  ) {
    return;
  }

  worldState.ultimate.timer = worldState.ultimate.cooldown;
  showPlayerSpeechBubble("FIRE IN THE HOLEEE", 1.25);

  ultimateBunkerSequence.active = true;
  ultimateBunkerSequence.phase = "moveToHatch";
  ultimateBunkerSequence.phaseTime = 0;
  ultimateBunkerSequence.startX = player.x;
  ultimateBunkerSequence.startZ = player.z;
  ultimateBunkerSequence.startYaw = player.facingYaw;
  ultimateBunkerSequence.blastX = ULT_BUNKER_POSITION.x;
  ultimateBunkerSequence.blastZ = ULT_BUNKER_POSITION.z;
  ultimateBunkerSequence.hasDetonated = false;
}

function startNight() {
  worldState.phase = "night";
  worldState.nightNumber += 1;
  worldState.nightTimer = worldState.nightLength;
  worldState.isBossWave = worldState.nightNumber % 10 === 0;
  worldState.spawnedThisNight = 0;
  worldState.defeatedThisNight = 0;
  worldState.totalNightEnemies = worldState.isBossWave ? 2 : getBaseNightEnemyCount(worldState.nightNumber);
  worldState.spawnAccumulator = 0;
  worldState.secondWavePending = 0;
  worldState.secondWaveTimer = 0;
  worldState.thirdWavePending = 0;
  worldState.thirdWaveTimer = 0;
  worldState.fourthWavePending = 0;
  worldState.fourthWaveTimer = 0;
  worldState.fifthWavePending = 0;
  worldState.fifthWaveTimer = 0;
  worldState.timeScaleDay = 1;
  if (!worldState.ultimate.hasStarted) {
    worldState.ultimate.hasStarted = true;
    worldState.ultimate.timer = worldState.ultimate.cooldown;
  }

  // Spawn in five waves to smooth pressure over the night.
  const firstWaveCount = Math.ceil(worldState.totalNightEnemies / 5);
  const remainingAfterFirst = Math.max(0, worldState.totalNightEnemies - firstWaveCount);
  const secondWaveCount = Math.ceil(remainingAfterFirst / 4);
  const remainingAfterSecond = Math.max(0, remainingAfterFirst - secondWaveCount);
  const thirdWaveCount = Math.ceil(remainingAfterSecond / 3);
  const remainingAfterThird = Math.max(0, remainingAfterSecond - thirdWaveCount);
  const fourthWaveCount = Math.ceil(remainingAfterThird / 2);
  const fifthWaveCount = Math.max(
    0,
    worldState.totalNightEnemies - firstWaveCount - secondWaveCount - thirdWaveCount - fourthWaveCount
  );

  for (let index = 0; index < firstWaveCount; index += 1) {
    spawnEnemy();
  }
  worldState.spawnedThisNight = firstWaveCount;
  worldState.secondWavePending = secondWaveCount;
  worldState.secondWaveTimer = secondWaveCount > 0 ? 4 : 0;
  worldState.thirdWavePending = thirdWaveCount;
  worldState.thirdWaveTimer = thirdWaveCount > 0 ? 8 : 0;
  worldState.fourthWavePending = fourthWaveCount;
  worldState.fourthWaveTimer = fourthWaveCount > 0 ? 12 : 0;
  worldState.fifthWavePending = fifthWaveCount;
  worldState.fifthWaveTimer = fifthWaveCount > 0 ? 16 : 0;

  applyPhaseVisuals("night");
  setShopModalOpen(false);
}

function showSurvivedBanner(nightNumber) {
  if (!survivedBannerEl || nightNumber <= 0) {
    return;
  }
  survivedBannerEl.textContent = `Survived Night #${nightNumber}`;
  survivedBannerEl.classList.remove("show");
  void survivedBannerEl.offsetWidth;
  survivedBannerEl.classList.add("show");
}

function startDay() {
  worldState.phase = "day";
  worldState.isBossWave = false;
  worldState.dayNumber += 1;
  worldState.dayTimer = 0;
  advanceHarvestTreeGrowthCycle();
  applyPhaseVisuals("day");
  showSurvivedBanner(worldState.nightNumber);
}

function clearEnemiesWithoutReward() {
  enemies.splice(0).forEach((enemy) => {
    disposeEnemyVisual(enemy);
  });
}

function clearProjectilesAndEffects() {
  [...bullets, ...turretBullets].forEach((bullet) => {
    scene.remove(bullet.mesh);
  });
  bullets.length = 0;
  turretBullets.length = 0;

  impactEffects.splice(0).forEach((effect) => {
    scene.remove(effect.mesh);
    effect.mesh.geometry.dispose();
    effect.mesh.material.dispose();
  });
  enemyDeathEffects.splice(0).forEach((effect) => {
    if (effect.ringMesh) {
      scene.remove(effect.ringMesh);
      effect.ringMesh.geometry?.dispose?.();
      effect.ringMesh.material?.dispose?.();
    }
    (effect.particles || []).forEach((particle) => {
      scene.remove(particle.mesh);
      particle.mesh.geometry?.dispose?.();
      particle.mesh.material?.dispose?.();
    });
  });
  zombieSplatters.splice(0).forEach((splatter) => {
    scene.remove(splatter.mesh);
    splatter.mesh.geometry.dispose();
    splatter.mesh.material.dispose();
  });
  creepDustPuffs.splice(0).forEach((puff) => {
    scene.remove(puff.mesh);
    puff.mesh.material.dispose();
  });
  muzzleFlashes.splice(0).forEach((flash) => {
    scene.remove(flash.mesh);
    flash.mesh.geometry?.dispose?.();
    flash.mesh.material.dispose();
  });
  ejectedReloadProps.splice(0).forEach((prop) => {
    scene.remove(prop.mesh);
    prop.mesh.traverse?.((node) => {
      if (node.isMesh) {
        node.geometry?.dispose?.();
        if (node.material && !Array.isArray(node.material)) {
          node.material.dispose?.();
        }
      }
    });
  });
  ejectedShellCasings.splice(0).forEach((shell) => {
    scene.remove(shell.mesh);
    if (shell.disposeOnRemove) {
      shell.mesh.traverse?.((node) => {
        if (!node.isMesh) {
          return;
        }
        node.geometry?.dispose?.();
        if (Array.isArray(node.material)) {
          node.material.forEach((material) => material?.dispose?.());
        } else {
          node.material?.dispose?.();
        }
      });
    } else {
      shell.mesh.geometry.dispose();
      shell.mesh.material.dispose();
    }
  });
}

function devEndNightNow() {
  if (worldState.phase !== "night" || worldState.gameOver) {
    return;
  }

  let bonusKills = 0;
  let bonusCredits = 0;

  enemies.forEach((enemy) => {
    bonusKills += 1;
    bonusCredits += enemy.reward || 0;
  });

  const unspawnedCount = Math.max(0, worldState.totalNightEnemies - worldState.spawnedThisNight);
  for (let index = 0; index < unspawnedCount; index += 1) {
    const enemyType = getEnemyTypeForNight();
    bonusKills += 1;
    bonusCredits += enemyType.reward;
  }

  clearEnemiesWithoutReward();
  clearProjectilesAndEffects();

  worldState.spawnedThisNight = worldState.totalNightEnemies;
  worldState.defeatedThisNight = worldState.totalNightEnemies;
  worldState.spawnAccumulator = 0;
  worldState.totalKills += bonusKills;
  worldState.credits += bonusCredits;

  startDay();
}

pauseBtn.addEventListener("click", () => {
  if (worldState.gameOver) {
    return;
  }
  setPaused(!worldState.paused);
});

restartBtn.addEventListener("click", () => {
  resetPrototype();
});

openShopBtn.addEventListener("click", () => {
  if (worldState.phase !== "day" || worldState.gameOver) {
    return;
  }
  setActiveShopTab("player");
  setShopModalOpen(true);
  updateShopUi();
});

if (closeShopBtn) {
  closeShopBtn.addEventListener("click", () => {
    setShopModalOpen(false);
  });
}

shopModalEl.addEventListener("click", (event) => {
  if (event.target === shopModalEl) {
    setShopModalOpen(false);
  }
});

skipNightBtn.addEventListener("click", () => {
  if (worldState.phase === "day" && !worldState.gameOver) {
    worldState.dayTimer = worldState.dayLength;
  }
});

if (skipCurrentNightBtn) {
  skipCurrentNightBtn.addEventListener("click", () => {
    devEndNightNow();
  });
}

if (startGameBtnEl) {
  startGameBtnEl.addEventListener("click", () => {
    startOverlayEl?.classList.add("hidden");
    setPaused(false);
  });
}

speedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    worldState.timeScaleDay = Number(button.dataset.speed);
  });
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
  worldState.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  worldState.keys.delete(event.key.toLowerCase());
});

let suppressCanvasClickSelection = false;

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const scaleFactor = 1 + event.deltaY * cameraOrbit.wheelSensitivity;
  cameraOrbit.distance *= THREE.MathUtils.clamp(scaleFactor, 0.88, 1.12);
  applyCameraOrbit();
}, { passive: false });

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 1) {
    event.preventDefault();
    cameraOrbit.yaw = 0;
    cameraOrbit.pitch = defaultOrbitPitch;
    applyCameraOrbit();
    return;
  }
  if (event.button !== 0) {
    return;
  }
  cameraOrbit.isDragging = true;
  cameraOrbit.lastX = event.clientX;
  cameraOrbit.lastY = event.clientY;
  canvas.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (event) => {
  if (!cameraOrbit.isDragging) {
    return;
  }
  const dx = event.clientX - cameraOrbit.lastX;
  const dy = event.clientY - cameraOrbit.lastY;
  cameraOrbit.lastX = event.clientX;
  cameraOrbit.lastY = event.clientY;

  if (Math.abs(dx) + Math.abs(dy) > 2.2) {
    suppressCanvasClickSelection = true;
  }

  cameraOrbit.yaw -= dx * cameraOrbit.dragSensitivityYaw;
  cameraOrbit.pitch -= dy * cameraOrbit.dragSensitivityPitch;
  applyCameraOrbit();
});

window.addEventListener("mouseup", (event) => {
  if (event.button !== 0) {
    return;
  }
  cameraOrbit.isDragging = false;
  canvas.style.cursor = "";
});

canvas.addEventListener("mouseleave", () => {
  cameraOrbit.isDragging = false;
  canvas.style.cursor = "";
});

canvas.addEventListener("auxclick", (event) => {
  if (event.button === 1) {
    event.preventDefault();
  }
});

canvas.addEventListener("click", (event) => {
  if (suppressCanvasClickSelection) {
    suppressCanvasClickSelection = false;
    return;
  }
  selectTurretFromCanvasEvent(event);
});

function handleResize() {
  const aspect = canvas.clientWidth / canvas.clientHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}

window.addEventListener("resize", handleResize);
handleResize();

let last = performance.now();

function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (!worldState.paused && !worldState.gameOver) {
    const scaledDt = dt * (worldState.phase === "day" ? worldState.timeScaleDay : 1);

    if (worldState.phase === "day") {
      if (shopModalEl.classList.contains("hidden")) {
        worldState.dayTimer += scaledDt;
      }
      if (worldState.dayTimer >= worldState.dayLength) {
        startNight();
      }
    } else {
      worldState.nightTimer = Math.max(0, worldState.nightTimer - scaledDt);
      worldState.spawnAccumulator += scaledDt;

      if (worldState.secondWavePending > 0) {
        worldState.secondWaveTimer = Math.max(0, worldState.secondWaveTimer - scaledDt);
        if (worldState.secondWaveTimer <= 0) {
          for (let waveIndex = 0; waveIndex < worldState.secondWavePending; waveIndex += 1) {
            spawnEnemy();
          }
          worldState.spawnedThisNight += worldState.secondWavePending;
          worldState.secondWavePending = 0;
        }
      }

      if (worldState.thirdWavePending > 0) {
        worldState.thirdWaveTimer = Math.max(0, worldState.thirdWaveTimer - scaledDt);
        if (worldState.thirdWaveTimer <= 0) {
          for (let waveIndex = 0; waveIndex < worldState.thirdWavePending; waveIndex += 1) {
            spawnEnemy();
          }
          worldState.spawnedThisNight += worldState.thirdWavePending;
          worldState.thirdWavePending = 0;
        }
      }

      if (worldState.fourthWavePending > 0) {
        worldState.fourthWaveTimer = Math.max(0, worldState.fourthWaveTimer - scaledDt);
        if (worldState.fourthWaveTimer <= 0) {
          for (let waveIndex = 0; waveIndex < worldState.fourthWavePending; waveIndex += 1) {
            spawnEnemy();
          }
          worldState.spawnedThisNight += worldState.fourthWavePending;
          worldState.fourthWavePending = 0;
        }
      }

      if (worldState.fifthWavePending > 0) {
        worldState.fifthWaveTimer = Math.max(0, worldState.fifthWaveTimer - scaledDt);
        if (worldState.fifthWaveTimer <= 0) {
          for (let waveIndex = 0; waveIndex < worldState.fifthWavePending; waveIndex += 1) {
            spawnEnemy();
          }
          worldState.spawnedThisNight += worldState.fifthWavePending;
          worldState.fifthWavePending = 0;
        }
      }

      const baseSpawnRate = Math.max(0.12, 0.78 - (worldState.nightNumber - 1) * 0.032);
      const remainingCount = Math.max(0, worldState.totalNightEnemies - worldState.spawnedThisNight);
      const remainingTime = Math.max(0.01, worldState.nightTimer);
      const requiredInterval = remainingCount > 0 ? remainingTime / remainingCount : baseSpawnRate;
      const spawnRate = Math.max(0.035, Math.min(baseSpawnRate, requiredInterval * 0.92));
      while (
        worldState.secondWavePending <= 0 &&
        worldState.thirdWavePending <= 0 &&
        worldState.fourthWavePending <= 0 &&
        worldState.fifthWavePending <= 0 &&
        worldState.spawnAccumulator >= spawnRate &&
        worldState.spawnedThisNight < worldState.totalNightEnemies
      ) {
        worldState.spawnAccumulator -= spawnRate;
        worldState.spawnedThisNight += 1;
        spawnEnemy();
      }
      if (worldState.spawnedThisNight >= worldState.totalNightEnemies && enemies.length === 0) {
        startDay();
      }
    }

    if (worldState.ultimate.hasStarted && worldState.ultimate.timer > 0) {
      worldState.ultimate.timer = Math.max(0, worldState.ultimate.timer - dt);
    }
    if (player.isReloading) {
      player.reloadTimer -= dt;
      if (player.reloadTimer <= 0) {
        player.reloadTimer = 0;
        player.isReloading = false;
        player.ammoInMag = player.magSize;
      }
    }

    updateUltimateBunkerSequence(dt);
    updateMovement(dt);
    updateCameraFollow(dt);
    updateDayHarvestLoop(dt);
    updateDroppedHarvestLogs(dt);
    updateDroppedCreditPickups(dt);
    updateTreeLeafParticles(dt);
    updatePlayerSpeechBubble(dt);
    updatePlayerShooting(dt);
    updatePlayerFacing(dt);
    updatePlayerWeaponAim(dt);
    updateTurrets(dt);
    updateProjectiles(bullets, dt);
    updateProjectiles(turretBullets, dt);
    updateImpactEffects(dt);
    updateCannonScorchMarks(dt);
    updateEnemyDeathEffects(dt);
    updateZombieSplatters(dt);
    updateCreepDust(dt);
    updateMuzzleFlashes(dt);
    updateAxeSwooshes(dt);
    updateEjectedProps(dt);
    updateUltimateWaves(dt);
    updateWoodSuckEffects(dt);
    updateEnemies(dt);
    updateSelectedTurretVisual();
    updateBreachEffects(now * 0.001);

    if (base.hp <= 0 && !worldState.breach.active) {
      const opened = triggerBreach(worldState.breach.lastHitSegmentIndex);
      if (opened) {
        base.hp = 0;
      } else {
        base.hp = 0;
      }
    }

    const bunkerDestroyed = worldState.breach.active && worldState.breach.bunkerHp <= 0;
    const wallDestroyedWithoutBreach = !worldState.breach.active && base.hp <= 0;
    if (bunkerDestroyed || wallDestroyedWithoutBreach) {
      worldState.breach.bunkerHp = Math.max(0, worldState.breach.bunkerHp);
      base.hp = Math.max(0, base.hp);
      worldState.gameOver = true;
      worldState.highScore = Math.max(worldState.highScore, worldState.totalKills);
      localStorage.setItem("baseDefenseHighScore", String(worldState.highScore));
      gameOverKillsEl.textContent = `Kills: ${worldState.totalKills}`;
      gameOverHighScoreEl.textContent = `High Score: ${worldState.highScore}`;
      gameOverModalEl.classList.remove("hidden");
    }
  }

  updateCelestialBodies();

  updateHud();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

turrets.forEach((turret, index) => {
  turret.id = index;
  turret.mesh.userData.turretId = index;
  turret.level1Mesh.userData.turretId = index;
  turret.level2Mesh.userData.turretId = index;
  turret.level3Mesh.userData.turretId = index;
  turret.level4Mesh.userData.turretId = index;
  turret.level5Mesh.userData.turretId = index;
  turret.level6Mesh.userData.turretId = index;
  const startsOwned = turret.label === "Middle";
  turret.owned = startsOwned;
  turret.level = startsOwned ? 1 : 0;
  turret.destroyed = false;
  turret.destroyedLevel = 1;
  turret.mountedCooldown = 0;
  turret.turretRecoil = 0;
  turret.aimYaw = turretSlotYawByLabel[turret.label] ?? -Math.PI / 2;
  turret.mountedAimYaw = turret.aimYaw;
  setTurretDestroyedVisualState(turret, false);
  applyTurretRecoilVisual(turret);
  syncTurretVisualState(turret);
});
setPlayerWeapon("glock");
applyPhaseVisuals(worldState.phase);
updateCarriedLogsVisual();
resetHarvestTrees(HARVEST_TREE_MAX_GROWTH_STAGE);
initShopUi();
updateShopUi();
setShopModalOpen(false);
setPaused(true);
requestAnimationFrame(tick);
setTimeout(() => {
  try {
    loadPlayerWeaponModels();
  } catch {}
}, 0);
setTimeout(() => {
  try {
    ensureSkeletonCloneFn();
    loadPlayerCharacterModel();
    loadLevel1GhostModel();
    loadLevel2ZombieModel();
    loadLevel3SkeletonModel();
    loadLevel4EnemyModel();
    loadBaseFencePerimeter();
    loadFieldScatterProps();
    loadReloadPropsModels();
  } catch {}
}, 0);
