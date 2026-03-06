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
cameraLegendEl.style.top = "12px";
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

const canvasWrapEl = canvas.parentElement;
if (canvasWrapEl && getComputedStyle(canvasWrapEl).position === "static") {
  canvasWrapEl.style.position = "relative";
}
canvasWrapEl?.appendChild(enemiesLeftEl);
canvasWrapEl?.appendChild(cameraLegendEl);

phaseLabelEl.className = "phase day";
dayClockEl.textContent = "08:00 AM";
nightTimerEl.textContent = "Night in 90s";
ultimateStatusEl.textContent = "Ultimate: starts Night 1";
creditsTextEl.textContent = "Credits: 0";
ammoTextEl.textContent = "Ammo: 14 / 14";

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
const BASE_HP_TIERS = [2000, 3000, 4000];

const base = {
  hp: BASE_HP_TIERS[0],
  maxHp: BASE_HP_TIERS[0],
  radius: BASE_HQ_RADIUS,
};

const baseMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(base.radius, base.radius, 1.6, 48),
  new THREE.MeshStandardMaterial({ color: 0x2f4463, roughness: 0.8 })
);
baseMesh.position.set(0, 0.8, 0);
baseMesh.receiveShadow = true;
baseMesh.castShadow = true;
scene.add(baseMesh);

const player = {
  name: "Survivor",
  x: 0,
  z: 34,
  facingYaw: 0,
  desiredFacingYaw: 0,
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
    new THREE.CylinderGeometry(4.6, 4.6, 2.2, 20),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_CAMO_DARK, roughness: 0.58, metalness: 0.22 })
  );
  coreMesh.position.y = 1.3;
  coreMesh.castShadow = true;
  turretGroup.add(coreMesh);

  const recoilGroup = new THREE.Group();
  turretGroup.add(recoilGroup);

  const neckMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.8, 1.7),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.48, metalness: 0.42 })
  );
  neckMesh.position.set(0, 0.8, -5.1);
  recoilGroup.add(neckMesh);

  const barrelShroud = new THREE.Mesh(
    new THREE.CylinderGeometry(1.12, 1.12, 10.8, 16),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_STEEL, roughness: 0.45, metalness: 0.5 })
  );
  barrelShroud.rotation.x = Math.PI / 2;
  barrelShroud.position.set(0, 1.0, -10.6);
  barrelShroud.castShadow = true;
  recoilGroup.add(barrelShroud);

  const barrelCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 13.4, 14),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_DARK_STEEL, roughness: 0.4, metalness: 0.62 })
  );
  barrelCore.rotation.x = Math.PI / 2;
  barrelCore.position.set(0, 1.0, -11.7);
  barrelCore.castShadow = true;
  recoilGroup.add(barrelCore);

  const muzzleTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.42, metalness: 0.55 })
  );
  muzzleTip.rotation.x = Math.PI / 2;
  muzzleTip.position.set(0, 1.0, -18.2);
  muzzleTip.castShadow = true;
  recoilGroup.add(muzzleTip);

  const railGeometry = new THREE.BoxGeometry(0.46, 0.36, 6.8);
  const railMaterial = new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.45, metalness: 0.5 });
  const railLeft = new THREE.Mesh(railGeometry, railMaterial);
  railLeft.position.set(-1.0, 1.95, -10.8);
  recoilGroup.add(railLeft);

  const railRight = new THREE.Mesh(railGeometry, railMaterial);
  railRight.position.set(1.0, 1.95, -10.8);
  recoilGroup.add(railRight);

  turretGroup.userData.recoilMesh = recoilGroup;
  turretGroup.userData.recoilBaseZ = 0;

  return turretGroup;
}

function createLevel2TurretMesh() {
  const turretGroup = createLevel1TurretMesh();
  const recoilGroup = turretGroup.userData.recoilMesh || turretGroup;

  const heavyBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(1.58, 1.58, 13.8, 18),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_GUNMETAL, roughness: 0.44, metalness: 0.58 })
  );
  heavyBarrel.rotation.x = Math.PI / 2;
  heavyBarrel.position.set(0, 1.03, -12.3);
  heavyBarrel.castShadow = true;
  recoilGroup.add(heavyBarrel);

  const heavyMuzzle = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.02, 1.8, 14),
    new THREE.MeshStandardMaterial({ color: TURRET_COLOR_LIGHT_STEEL, roughness: 0.4, metalness: 0.6 })
  );
  heavyMuzzle.rotation.x = Math.PI / 2;
  heavyMuzzle.position.set(0, 1.03, -19.0);
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
  const turretBaseY = isMiddleSlot ? 2.2 : 1.2;
  const turretLevelY = isMiddleSlot ? 4.4 : 3.4;

  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(14.8, 16.2, 2.4, 24),
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
const enemyDeathEffects = [];
const zombieSplatters = [];
const muzzleFlashes = [];
const creepDustPuffs = [];
const ejectedReloadProps = [];
const ejectedShellCasings = [];

const ZOMBIE_SPLATTER_FADE_DURATION = 8;
const PLAYER_MUZZLE_FLASH_LIFE = 0.08;
const TURRET_MUZZLE_FLASH_LIFE = 0.06;
const EJECTED_PROP_GROUND_HOLD = 8;
const EJECTED_PROP_FADE_DURATION = 8;
const HQ_SHELL_LANDING_Y = 1.62;

const enemyGeometry = new THREE.SphereGeometry(6.5, 12, 12);
const deathExplosionParticleGeometry = new THREE.SphereGeometry(0.95, 6, 6);
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
const repairs = [
  { id: "repair250", name: "Repair +250 HP", hp: 250, cost: 250 },
  { id: "repair500", name: "Repair +500 HP", hp: 500, cost: 500 },
  { id: "repair1000", name: "Repair +1000 HP", hp: 1000, cost: 1000 },
];
const baseUpgradeCosts = [700, 1400];
const turretBuyCost = 550;
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
const LEVEL2_ZOMBIE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/character-zombie.glb";
const LEVEL3_SKELETON_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/character-skeleton.glb";
const LEVEL4_VAMPIRE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/character-vampire.glb";
const BASE_FENCE_CURVE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/iron-fence-curve.glb";
const BASE_FENCE_BORDER_CURVE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/iron-fence-border-curve.glb";
const BASE_BRICK_WALL_CURVE_MODEL_PATH = "kenney_graveyard-kit_5.0/Models/GLB%20format/brick-wall-curve.glb";
const CLIP_LARGE_MODEL_PATH = "kenney_blaster-kit_2.1/Models/GLB%20format/clip-large.glb";
const CLIP_SMALL_MODEL_PATH = "kenney_blaster-kit_2.1/Models/GLB%20format/clip-small.glb";

const playerWeaponModels = new Map();
let gltfLoader = null;
let gltfLoaderReadyPromise = null;
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
let level4VampirePrototype = null;
let level4VampireLoadStarted = false;
let level4VampireAnimationClip = null;
let baseFencePerimeterBuilt = false;
let baseFencePerimeterLoadStarted = false;
let baseFenceMainGroup = null;
let baseFenceInnerGroup = null;
let baseBrickWallGroup = null;
let clipLargePrototype = null;
let clipSmallPrototype = null;
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
  if (!level4VampirePrototype) {
    return;
  }

  if (playerCharacterModel) {
    playerMesh.remove(playerCharacterModel);
    playerCharacterModel = null;
  }

  const model = level4VampirePrototype.clone(true);
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

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        level1GhostLoadStarted = false;
        return;
      }

      loader.load(
        LEVEL1_GHOST_MODEL_PATH,
        (gltf) => {
          try {
            const ghostModel = gltf.scene;
            prepareCharacterPrototype(ghostModel, regularEnemyTiers.level1.radius * 2.2);
            level1GhostPrototype = ghostModel;
            level1GhostAnimationClip = gltf.animations?.[0] || null;
          } catch {
            level1GhostLoadStarted = false;
          }
        },
        undefined,
        () => {
          level1GhostLoadStarted = false;
        }
      );
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

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        level2ZombieLoadStarted = false;
        return;
      }

      loader.load(
        LEVEL2_ZOMBIE_MODEL_PATH,
        (gltf) => {
          try {
            const zombieModel = gltf.scene;
            prepareCharacterPrototype(zombieModel, regularEnemyTiers.level2.radius * 2.2);
            level2ZombiePrototype = zombieModel;
            level2ZombieAnimationClip = gltf.animations?.[0] || null;
          } catch {
            level2ZombieLoadStarted = false;
          }
        },
        undefined,
        () => {
          level2ZombieLoadStarted = false;
        }
      );
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

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        level3SkeletonLoadStarted = false;
        return;
      }

      loader.load(
        LEVEL3_SKELETON_MODEL_PATH,
        (gltf) => {
          try {
            const skeletonModel = gltf.scene;
            prepareCharacterPrototype(skeletonModel, regularEnemyTiers.level3.radius * 2.2);
            level3SkeletonPrototype = skeletonModel;
            level3SkeletonAnimationClip = gltf.animations?.[0] || null;
          } catch {
            level3SkeletonLoadStarted = false;
          }
        },
        undefined,
        () => {
          level3SkeletonLoadStarted = false;
        }
      );
    })
    .catch(() => {
      level3SkeletonLoadStarted = false;
    });
}

function loadLevel4VampireModel() {
  if (level4VampireLoadStarted || level4VampirePrototype) {
    return;
  }
  level4VampireLoadStarted = true;

  ensureGLTFLoader()
    .then((loader) => {
      if (!loader) {
        level4VampireLoadStarted = false;
        return;
      }

      loader.load(
        LEVEL4_VAMPIRE_MODEL_PATH,
        (gltf) => {
          try {
            const vampireModel = gltf.scene;
            prepareCharacterPrototype(vampireModel, regularEnemyTiers.level4.radius * 2.2);
            level4VampirePrototype = vampireModel;
            level4VampireAnimationClip = gltf.animations?.[0] || null;
            updatePlayerCharacterModel();
          } catch {
            level4VampireLoadStarted = false;
          }
        },
        undefined,
        () => {
          level4VampireLoadStarted = false;
        }
      );
    })
    .catch(() => {
      level4VampireLoadStarted = false;
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
        for (let index = 0; index < segmentCount; index += 1) {
          const angle = (index / segmentCount) * Math.PI * 2;
          const segment = prototype.clone(true);
          segment.position.set(Math.cos(angle) * radius, heightY, Math.sin(angle) * radius);
          segment.rotation.y = -angle + Math.PI * 0.5 + yawOffset + Math.PI;
          group.add(segment);
        }
        return group;
      };

      Promise.all([
        loadRingPrototype(BASE_FENCE_CURVE_MODEL_PATH),
        loadRingPrototype(BASE_FENCE_BORDER_CURVE_MODEL_PATH),
        loadRingPrototype(BASE_BRICK_WALL_CURVE_MODEL_PATH),
      ])
        .then(([outerFenceProto, innerFenceProto, brickWallProto]) => {
          try {
            baseFenceMainGroup = buildPerimeterRing(outerFenceProto, {
              radius: BASE_HQ_RADIUS,
              segmentCount: 40,
              heightY: 0.5,
            });
            baseFenceInnerGroup = buildPerimeterRing(innerFenceProto, {
              radius: BASE_HQ_RADIUS - 6,
              segmentCount: 40,
              heightY: 0.5,
            });
            baseBrickWallGroup = buildPerimeterRing(brickWallProto, {
              radius: BASE_HQ_RADIUS + 8,
              segmentCount: 44,
              heightY: 0.5,
            });

            scene.add(baseFenceMainGroup);
            scene.add(baseFenceInnerGroup);
            scene.add(baseBrickWallGroup);

            baseFenceInnerGroup.visible = worldState.baseUpgradeLevel >= 1;
            baseBrickWallGroup.visible = worldState.baseUpgradeLevel >= 2;
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

function applyBaseUpgradeVisuals() {
  if (baseFenceInnerGroup) {
    baseFenceInnerGroup.visible = worldState.baseUpgradeLevel >= 1;
  }
  if (baseBrickWallGroup) {
    baseBrickWallGroup.visible = worldState.baseUpgradeLevel >= 2;
  }
}

function loadReloadPropsModels() {
  if (reloadPropsLoadStarted || (clipLargePrototype && clipSmallPrototype)) {
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
  timeScaleDay: 1,
  baseUpgradeLevel: 0,
  activeShopTab: "player",
  selectedTurretId: null,
  ownedWeapons: new Set(["glock"]),
  ownedAttachments: new Set(),
  ultimate: {
    cooldown: 60,
    timer: 60,
    hasStarted: false,
    damage: 120,
    radius: 130,
  },
};

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
  if (worldState.credits < weapon.cost) {
    return;
  }
  worldState.credits -= weapon.cost;
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
  if (worldState.ownedAttachments.has(attachment.id) || worldState.credits < attachment.cost) {
    return;
  }
  worldState.credits -= attachment.cost;
  worldState.ownedAttachments.add(attachment.id);
  if (player.weaponId === attachment.weaponId) {
    player.magSize = getWeaponMagSize(player.weaponId);
    player.ammoInMag = player.magSize;
  }
}

function buyRepair(repairId) {
  const repair = repairs.find((item) => item.id === repairId);
  if (!repair || worldState.credits < repair.cost || base.hp >= base.maxHp) {
    return;
  }
  worldState.credits -= repair.cost;
  base.hp = Math.min(base.maxHp, base.hp + repair.hp);
}

function buyBaseUpgrade(level) {
  if (level < 1 || level > baseUpgradeCosts.length) {
    return;
  }
  if (worldState.baseUpgradeLevel !== level - 1) {
    return;
  }
  const cost = baseUpgradeCosts[level - 1];
  if (worldState.credits < cost) {
    return;
  }
  const targetMaxHp = BASE_HP_TIERS[level];
  if (!targetMaxHp) {
    return;
  }
  worldState.credits -= cost;
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
  if (!turret.owned) {
    if (worldState.credits < turretBuyCost) {
      return;
    }
    worldState.credits -= turretBuyCost;
    turret.owned = true;
    turret.level = 1;
    return;
  }
  if (turret.level >= 6) {
    return;
  }
  const cost = turretUpgradeCosts[turret.level - 1];
  if (worldState.credits < cost) {
    return;
  }
  worldState.credits -= cost;
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
    const canBuy = worldState.credits >= weapon.cost;
    button.disabled = !isOwned && !canBuy;
    if (isEquipped) {
      setWeaponShopCardContent(button, weapon.id, weapon.name, "Equipped", weaponIconById[weapon.id]);
    } else if (isOwned) {
      setWeaponShopCardContent(button, weapon.id, weapon.name, "Equip", weaponIconById[weapon.id]);
    } else {
      setWeaponShopCardContent(button, weapon.id, weapon.name, `Buy for ${weapon.cost}`, weaponIconById[weapon.id]);
    }
  });

  shopAttachmentListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const attachment = attachmentById.get(button.dataset.attachmentId);
    const hasWeapon = worldState.ownedWeapons.has(attachment.weaponId);
    const owned = worldState.ownedAttachments.has(attachment.id);
    const canBuy = hasWeapon && !owned && worldState.credits >= attachment.cost;
    button.disabled = !owned && !canBuy;
    if (!hasWeapon) {
      setShopButtonContent(button, `${attachment.name} · Need weapon`, attachmentIconByWeaponId[attachment.weaponId], "📦");
    } else if (owned) {
      setShopButtonContent(button, `${attachment.name} · Owned`, attachmentIconByWeaponId[attachment.weaponId], "📦");
    } else {
      setShopButtonContent(button, `${attachment.name} · Buy ${attachment.cost}`, attachmentIconByWeaponId[attachment.weaponId], "📦");
    }
  });

  shopRepairListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const repair = repairs.find((item) => item.id === button.dataset.repairId);
    const canBuy = worldState.credits >= repair.cost && base.hp < base.maxHp;
    button.disabled = !canBuy;
    setShopButtonContent(button, `${repair.name} · ${repair.cost}`, "", "🛠️");
  });

  shopBaseUpgradeListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const level = Number(button.dataset.baseUpgradeLevel);
    const cost = baseUpgradeCosts[level - 1];
    const owned = worldState.baseUpgradeLevel >= level;
    const canBuy = worldState.baseUpgradeLevel === level - 1 && worldState.credits >= cost;
    button.disabled = !canBuy;
    setShopButtonContent(button, owned ? `Wall Lv${level} · Owned` : `Wall Lv${level} · Buy ${cost}`, "", "🧱");
  });

  shopTurretListEl.querySelectorAll(".shop-btn").forEach((button) => {
    const turret = turrets.find((item) => item.id === Number(button.dataset.turretId));
    const turretDirection = getTurretDirectionLabel(turret.label);
    const levelValue = Math.max(1, turret.level || 1);
    const levelType = turretTypeLabelByLevel[levelValue] || "Turret";
    const rangeValue = turretRangeByLevel[levelValue] || turretRangeByLevel[1];
    const stats = turretStatsByLevel[levelValue] || turretStatsByLevel[1];
    if (!turret.owned) {
      const canBuy = worldState.credits >= turretBuyCost;
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
    button.disabled = worldState.credits < cost;
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
}

function getBaseNightEnemyCount(nightNumber) {
  return (12 + (nightNumber - 1) * 4) * 2;
}

function getNightEnemyTierChances(nightNumber) {
  const level4Chance = nightNumber >= 20 ? Math.min(0.22, 0.08 + (nightNumber - 20) * 0.0025) : 0;
  const level3Chance = nightNumber >= 6 ? 0.22 : 0;
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
    color: 0xc58dff,
    isBoss: true,
  };
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
      depthWrite: false,
    })
  );
  fillMesh.position.z = 0.03;
  barGroup.add(fillMesh);

  barGroup.position.set(0, enemyRadius + 10, 0);
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

  const characterPrototype = modelTier === 4
    ? level4VampirePrototype
    : modelTier === 3
      ? level3SkeletonPrototype
      : modelTier === 2
        ? level2ZombiePrototype
        : enemyType.useGhostModel
          ? level1GhostPrototype
          : null;
  const characterAnimationClip = modelTier === 4
    ? level4VampireAnimationClip
    : modelTier === 3
      ? level3SkeletonAnimationClip
      : modelTier === 2
        ? level2ZombieAnimationClip
        : enemyType.useGhostModel
          ? level1GhostAnimationClip
          : null;

  const useCharacterModel = !!characterPrototype;
  let mesh;
  let animationRoot = null;
  if (useCharacterModel) {
    const modelClone = characterPrototype.clone(true);
    modelClone.position.set(0, 0.5, 0);
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
    animationMixer = new THREE.AnimationMixer(animationRoot);
    const action = animationMixer.clipAction(characterAnimationClip);
    action.play();
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
    isBoss: !!enemyType.isBoss,
    isCharacterModel: useCharacterModel,
    facingYaw: initialFacingYaw,
    facingOffset,
    walkBobPhase: Math.random() * Math.PI * 2,
    shamblePhase: Math.random() * Math.PI * 2,
    walkBaseY: useCharacterModel ? 0 : enemyType.radius + 0.5,
    dustTimer: 0.015 + Math.random() * 0.03,
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

function spawnImpactEffect(x, z, radius, colorHex, maxLife = 0.24) {
  const inner = Math.max(0.5, radius * 0.65);
  const outer = Math.max(1.2, radius);
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(inner, outer, 40),
    new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.22, z);
  scene.add(mesh);

  impactEffects.push({ mesh, life: maxLife, maxLife, growth: 1.65 });
}

function spawnEnemyDeathExplosion(enemy) {
  const ringMesh = new THREE.Mesh(
    new THREE.RingGeometry(Math.max(1, enemy.radius * 0.55), Math.max(1.8, enemy.radius * 1.25), 28),
    new THREE.MeshBasicMaterial({
      color: 0x74ff8e,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.set(enemy.x, 0.34, enemy.z);
  scene.add(ringMesh);

  const particles = [];
  const particleCount = 9;
  for (let index = 0; index < particleCount; index += 1) {
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.4;
    const speed = 20 + Math.random() * 22;
    const rise = 24 + Math.random() * 16;
    const mesh = new THREE.Mesh(
      deathExplosionParticleGeometry,
      new THREE.MeshBasicMaterial({ color: 0x86ff6f, transparent: true, opacity: 0.92, depthWrite: false })
    );
    mesh.position.set(enemy.x, enemy.radius * 0.72 + 0.3, enemy.z);
    scene.add(mesh);
    particles.push({ mesh, vx: Math.cos(angle) * speed, vz: Math.sin(angle) * speed, vy: rise });
  }

  enemyDeathEffects.push({ ringMesh, particles, life: 0.3, maxLife: 0.3 });
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
  mesh.position.set(x, 0.16, z);
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
  return isMachineGunWeapon(weaponId) || isPistolWeapon(weaponId);
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
  landingY = 0.16
) {
  if (!isShellEjectWeapon(weaponId)) {
    return;
  }

  const shellMesh = new THREE.Mesh(shellCasingGeometry, shellCasingMaterial.clone());
  shellMesh.renderOrder = 4;
  const sideX = -shotDirZ;
  const sideZ = shotDirX;
  shellMesh.position.set(originX + sideX * lateralOffset, ejectY, originZ + sideZ * lateralOffset);
  shellMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  scene.add(shellMesh);

  const isPistol = isPistolWeapon(weaponId);
  const lateralSpeed = isPistol ? 17 + Math.random() * 8 : 24 + Math.random() * 14;
  const forwardPush = isPistol ? 2.5 : 4;
  const upSpeed = isPistol ? 11 + Math.random() * 5 : 16 + Math.random() * 8;
  const spinScale = isPistol ? 0.7 : 1;

  ejectedShellCasings.push({
    mesh: shellMesh,
    vx: sideX * lateralSpeed + shotDirX * forwardPush,
    vz: sideZ * lateralSpeed + shotDirZ * forwardPush,
    vy: upSpeed,
    spinX: (16 + Math.random() * 8) * spinScale,
    spinY: (12 + Math.random() * 6) * spinScale,
    spinZ: (18 + Math.random() * 8) * spinScale,
    grounded: false,
    landingY,
    groundHoldTimer: EJECTED_PROP_GROUND_HOLD,
    fadeTimer: EJECTED_PROP_FADE_DURATION,
    fadeDuration: EJECTED_PROP_FADE_DURATION,
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

      if (prop.mesh.position.y < 0.2) {
        prop.mesh.position.y = 0.2;
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
    shell.mesh.material.opacity = shellAlpha;
    shell.mesh.material.transparent = true;

    if (shell.fadeTimer <= 0) {
      scene.remove(shell.mesh);
      shell.mesh.material.dispose();
      ejectedShellCasings.splice(index, 1);
    }
  }
}

function applyAreaDamage(x, z, radius, damage) {
  for (let index = enemies.length - 1; index >= 0; index -= 1) {
    const enemy = enemies[index];
    const dx = enemy.x - x;
    const dz = enemy.z - z;
    if (Math.hypot(dx, dz) <= radius + enemy.radius) {
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
    effect.mesh.material.opacity = 0.85 * alpha;
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

function updateEnemyDeathEffects(dt) {
  for (let index = enemyDeathEffects.length - 1; index >= 0; index -= 1) {
    const effect = enemyDeathEffects[index];
    effect.life -= dt;
    const alpha = Math.max(0, effect.life / effect.maxLife);
    effect.ringMesh.material.opacity = 0.88 * alpha;
    const ringScale = 1 + (1 - alpha) * 1.4;
    effect.ringMesh.scale.setScalar(ringScale);

    effect.particles.forEach((particle) => {
      particle.vx *= Math.max(0, 1 - dt * 5.5);
      particle.vz *= Math.max(0, 1 - dt * 5.5);
      particle.vy -= 58 * dt;
      particle.mesh.position.x += particle.vx * dt;
      particle.mesh.position.y += particle.vy * dt;
      particle.mesh.position.z += particle.vz * dt;
      particle.mesh.material.opacity = 0.92 * alpha;
    });

    if (effect.life <= 0) {
      scene.remove(effect.ringMesh);
      effect.ringMesh.geometry.dispose();
      effect.ringMesh.material.dispose();
      effect.particles.forEach((particle) => {
        scene.remove(particle.mesh);
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

function spawnCreepDust(enemy, moveDirX, moveDirZ) {
  const mesh = new THREE.Mesh(creepDustGeometry, creepDustMaterial.clone());
  const sideX = -moveDirZ;
  const sideZ = moveDirX;
  const sideOffset = (Math.random() * 2 - 1) * 1.1;
  mesh.position.set(
    enemy.x - moveDirX * 1.7 + sideX * sideOffset,
    0.26,
    enemy.z - moveDirZ * 1.7 + sideZ * sideOffset
  );
  const startScale = 0.78 + Math.random() * 0.45;
  mesh.scale.setScalar(startScale);
  scene.add(mesh);

  creepDustPuffs.push({
    mesh,
    life: 0.62,
    maxLife: 0.62,
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
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(1.4, 2.6, 64),
    new THREE.MeshBasicMaterial({
      color: 0xf6cc55,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.25, z);
  scene.add(mesh);
  ultimateWaves.push({ mesh, life: 0.35, maxLife: 0.35, maxRadius });
}

function updateUltimateWaves(dt) {
  for (let index = ultimateWaves.length - 1; index >= 0; index -= 1) {
    const wave = ultimateWaves[index];
    wave.life -= dt;
    const alpha = Math.max(0, wave.life / wave.maxLife);
    const progress = Math.max(0, Math.min(1, 1 - wave.life / wave.maxLife));
    const radius = Math.max(1.4, wave.maxRadius * progress);
    wave.mesh.material.opacity = 0.92 * alpha;
    wave.mesh.scale.set(radius, radius, 1);

    if (wave.life <= 0) {
      scene.remove(wave.mesh);
      wave.mesh.geometry.dispose();
      wave.mesh.material.dispose();
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
  if (!turret || !turret.owned || turret.level <= 0) {
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
    .filter((turret) => turret.owned && turret.level > 0)
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
  splashRadius = 0
) {
  const dx = targetX - originX;
  const dz = targetZ - originZ;
  const len = Math.hypot(dx, dz) || 1;
  const vx = (dx / len) * speed;
  const vz = (dz / len) * speed;

  const mesh = new THREE.Mesh(bulletGeometry, getBulletMaterial(projectileType, owner));
  if (owner === "turret" && projectileType === "smg") {
    mesh.scale.setScalar(0.5);
  }
  mesh.position.set(originX, owner === "player" ? 12 : 4.8, originZ);
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
    penetration,
    pierced: new Set(),
    projectileType,
    splashRadius,
  });
}

function getNearestEnemy(x, z, maxRange = Number.POSITIVE_INFINITY) {
  let nearest = null;
  let minDist = Number.POSITIVE_INFINITY;
  enemies.forEach((enemy) => {
    const dx = enemy.x - x;
    const dz = enemy.z - z;
    const dist = Math.hypot(dx, dz);
    if (dist <= maxRange && dist < minDist) {
      minDist = dist;
      nearest = enemy;
    }
  });
  return nearest;
}

function getNearestEnemyExcluding(x, z, maxRange = Number.POSITIVE_INFINITY, excludeEnemy = null) {
  let nearest = null;
  let minDist = Number.POSITIVE_INFINITY;
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
  });
  return nearest;
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
  disposeEnemyVisual(enemy);
  enemies.splice(index, 1);
  worldState.totalKills += 1;
  worldState.credits += enemy.reward || 0;
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
    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = enemies[enemyIndex];
      const dx = enemy.x - bullet.x;
      const dz = enemy.z - bullet.z;
      if (bullet.pierced.has(enemy)) {
        continue;
      }
      if (Math.hypot(dx, dz) <= enemy.radius + bullet.radius) {
        enemy.hp -= bullet.damage;
        bullet.pierced.add(enemy);
        if (enemy.hp <= 0) {
          removeEnemy(enemy);
        }

        if (bullet.projectileType === "flak") {
          spawnImpactEffect(bullet.x, bullet.z, 3.2, 0x66e7ff, 0.16);
        } else if (bullet.projectileType === "grenade") {
          spawnImpactEffect(bullet.x, bullet.z, Math.max(8, bullet.splashRadius), 0xffb86a, 0.28);
          applyAreaDamage(bullet.x, bullet.z, bullet.splashRadius, bullet.damage);
          hit = true;
          break;
        } else if (bullet.projectileType === "cannon") {
          spawnImpactEffect(bullet.x, bullet.z, Math.max(8, bullet.splashRadius), 0xffd88a, 0.24);
          applyAreaDamage(bullet.x, bullet.z, bullet.splashRadius, bullet.damage);
          hit = true;
          break;
        } else {
          const impactColor =
            bullet.owner === "turret" && bullet.projectileType === "smg"
              ? 0xff4f5c
              : bullet.owner === "player"
                ? 0xff8f57
                : 0x86ff6f;
          spawnImpactEffect(bullet.x, bullet.z, 2.6, impactColor, 0.14);
        }

        if (bullet.penetration > 0) {
          bullet.penetration -= 1;
          continue;
        }
        hit = true;
        break;
      }
    }

    if (
      hit ||
      bullet.life <= 0 ||
      Math.abs(bullet.x) > worldSize.width ||
      Math.abs(bullet.z) > worldSize.depth
    ) {
      scene.remove(bullet.mesh);
      container.splice(index, 1);
    }
  }
}

function updateEnemies(dt) {
  enemies.forEach((enemy) => {
    const dx = -enemy.x;
    const dz = -enemy.z;
    const dist = Math.hypot(dx, dz) || 1;
    const stop = base.radius + enemy.radius;

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
      base.hp = Math.max(0, base.hp - enemy.damagePerSecond * dt);
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
      if (enemy.animationRoot) {
        enemy.animationRoot.rotation.y = 0;
      }
    }

    if (enemy.isCharacterModel) {
      const yawSway = Math.sin(enemy.shamblePhase * 1.5) * ENEMY_SHAMBLE_YAW_SWAY;
      enemy.mesh.rotation.y = enemy.facingYaw + yawSway;
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

function fireTwinFlakShots(turret, target, speed, totalDamage, penetration = 2) {
  const dirDx = target.x - turret.x;
  const dirDz = target.z - turret.z;
  const dirLen = Math.hypot(dirDx, dirDz) || 1;
  const dirX = dirDx / dirLen;
  const dirZ = dirDz / dirLen;
  const perpX = -dirZ;
  const perpZ = dirX;
  const spread = 2.2;
  const perShotDamage = totalDamage * 0.5;

  const leftX = turret.x + perpX * spread;
  const leftZ = turret.z + perpZ * spread;
  const rightX = turret.x - perpX * spread;
  const rightZ = turret.z - perpZ * spread;

  const forwardOffset = 12.5;
  const leftMuzzleX = leftX + dirX * forwardOffset;
  const leftMuzzleZ = leftZ + dirZ * forwardOffset;
  const rightMuzzleX = rightX + dirX * forwardOffset;
  const rightMuzzleZ = rightZ + dirZ * forwardOffset;

  createBullet(leftMuzzleX, leftMuzzleZ, target.x, target.z, speed, perShotDamage, "turret", penetration, "flak", 0);
  createBullet(rightMuzzleX, rightMuzzleZ, target.x, target.z, speed, perShotDamage, "turret", penetration, "flak", 0);
  spawnMuzzleFlash(leftMuzzleX, leftMuzzleZ, dirX, dirZ, "turret");
  spawnMuzzleFlash(rightMuzzleX, rightMuzzleZ, dirX, dirZ, "turret");
}

function getTurretMuzzleOrigin(turretX, turretZ, dirX, dirZ, projectileType = "smg", mounted = false) {
  const baseOffset = projectileType === "cannon" ? 17 : 12;
  const mountedBonus = mounted ? 3 : 0;
  const offset = baseOffset + mountedBonus;
  return {
    x: turretX + dirX * offset,
    z: turretZ + dirZ * offset,
  };
}

function updateTurrets(dt) {
  turrets.forEach((turret) => {
    syncTurretVisualState(turret);

    const level = Math.max(1, Math.min(6, turret.level || 1));
    const recoilRecovery = turretRecoilRecoveryByLevel[level] || turretRecoilRecoveryByLevel[1];
    turret.turretRecoil = Math.max(0, (turret.turretRecoil || 0) - recoilRecovery * dt);
    applyTurretRecoilVisual(turret);

    if (!turret.owned || turret.level <= 0) {
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
        fireTwinFlakShots(turret, target, stats.speed, stats.damage, 2);
      } else {
        const projectileType = turret.level >= 4 ? "cannon" : "smg";
        const splashRadius = turret.level >= 4 ? 22 : 0;
        const muzzleOrigin = getTurretMuzzleOrigin(turret.x, turret.z, dirX, dirZ, projectileType, false);
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
          splashRadius
        );
        const turretFlashStyle = projectileType === "cannon" ? "mesh" : "sprite";
        spawnMuzzleFlash(muzzleOrigin.x, muzzleOrigin.z, dirX, dirZ, "turret", turretFlashStyle);
        if (projectileType === "smg") {
          spawnShellCasingEject("ar15", dirX, dirZ, turret.x, turret.z, 4.8, 1.1, HQ_SHELL_LANDING_Y);
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
          fireTwinFlakShots(turret, mountedTarget, mountedStats.speed, mountedStats.damage, mountedStats.penetration);
        } else {
          const mountDx = mountedTarget.x - turret.x;
          const mountDz = mountedTarget.z - turret.z;
          const mountLen = Math.hypot(mountDx, mountDz) || 1;
          const mountDirX = mountDx / mountLen;
          const mountDirZ = mountDz / mountLen;
          const muzzleOrigin = getTurretMuzzleOrigin(turret.x, turret.z, mountDirX, mountDirZ, "smg", true);

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
            0
          );
          spawnMuzzleFlash(muzzleOrigin.x, muzzleOrigin.z, mountDirX, mountDirZ, "turret");
          spawnShellCasingEject("m249", mountDirX, mountDirZ, turret.x, turret.z, 4.9, 1.1, HQ_SHELL_LANDING_Y);
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
    0
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
  spawnShellCasingEject(player.weaponId, shotDirX, shotDirZ, player.x, player.z, 12.7, 4.6, HQ_SHELL_LANDING_Y);
  player.weaponAimTimer = Math.max(player.weaponAimTimer, PLAYER_WEAPON_AIM_HOLD);
  playerWeaponRecoil = Math.min(PLAYER_WEAPON_RECOIL_MAX, playerWeaponRecoil + PLAYER_WEAPON_RECOIL_KICK);
  player.ammoInMag -= 1;
  player.shootCooldown = player.fireRate;
}

function updateMovement(dt) {
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

  if (!worldState.ultimate.hasStarted) {
    ultimateStatusEl.textContent = "Ultimate: starts Night 1";
  } else if (worldState.ultimate.timer > 0) {
    ultimateStatusEl.textContent = `Ultimate: ${Math.ceil(worldState.ultimate.timer)}s`;
  } else if (enemies.length === 0) {
    ultimateStatusEl.textContent = "Ultimate: No targets";
  } else {
    ultimateStatusEl.textContent = "Ultimate: READY (Q)";
  }
  const ultimateReady = worldState.ultimate.hasStarted && worldState.ultimate.timer <= 0 && enemies.length > 0;
  ultimateStatusEl.classList.toggle("ready", ultimateReady);

  speedButtons.forEach((button) => {
    const isActive = Number(button.dataset.speed) === worldState.timeScaleDay;
    button.classList.toggle("active", isActive);
  });

  const baseHpPct = Math.max(0, Math.min(1, base.hp / base.maxHp));
  baseHpTextEl.textContent = `Base HP: ${Math.ceil(base.hp)} / ${base.maxHp}`;
  baseHpFillEl.style.width = `${baseHpPct * 100}%`;
  baseHpFillEl.style.background = baseHpPct > 0.4 ? "#53d48b" : "#e28f51";

  const playerHpPct = Math.max(0, Math.min(1, player.hp / player.maxHp));
  playerHpTextEl.textContent = `Player HP: ${Math.ceil(player.hp)} / ${player.maxHp}`;
  playerHpFillEl.style.width = `${playerHpPct * 100}%`;
  playerHpFillEl.style.background = playerHpPct > 0.4 ? "#53d48b" : "#e28f51";

  const showSkipToNight = worldState.phase === "day" && !worldState.gameOver;
  skipNightBtn.hidden = !showSkipToNight;
  skipNightBtn.disabled = !showSkipToNight;

  if (skipCurrentNightBtn) {
    const showSkipNight = worldState.phase === "night" && !worldState.gameOver;
    skipCurrentNightBtn.hidden = !showSkipNight;
    skipCurrentNightBtn.disabled = !showSkipNight;
  }
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
  player.weaponAimTimer = 0;
  playerWeaponRecoil = 0;
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
    scene.remove(effect.ringMesh);
    effect.ringMesh.geometry.dispose();
    effect.ringMesh.material.dispose();
    effect.particles.forEach((particle) => {
      scene.remove(particle.mesh);
      particle.mesh.material.dispose();
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
    shell.mesh.geometry.dispose();
    shell.mesh.material.dispose();
  });
  ultimateWaves.splice(0).forEach((wave) => {
    scene.remove(wave.mesh);
    wave.mesh.geometry.dispose();
    wave.mesh.material.dispose();
  });
  clearSelectedTurretVisual();

  worldState.totalKills = 0;
  worldState.credits = 0;
  worldState.phase = "day";
  worldState.dayNumber = 1;
  worldState.nightNumber = 0;
  worldState.dayTimer = 0;
  worldState.nightTimer = 0;
  worldState.spawnAccumulator = 0;
  worldState.spawnedThisNight = 0;
  worldState.totalNightEnemies = 0;
  worldState.defeatedThisNight = 0;
  worldState.isBossWave = false;
  worldState.ownedWeapons = new Set(["glock"]);
  worldState.ownedAttachments = new Set();
  worldState.baseUpgradeLevel = 0;
  applyBaseUpgradeVisuals();
  worldState.ultimate.timer = worldState.ultimate.cooldown;
  worldState.ultimate.hasStarted = false;
  worldState.gameOver = false;
  base.maxHp = BASE_HP_TIERS[0];
  base.hp = BASE_HP_TIERS[0];
  turrets.forEach((turret) => {
    turret.owned = false;
    turret.level = 0;
    turret.cooldown = 0;
    turret.mountedCooldown = 0;
    turret.turretRecoil = 0;
    turret.aimYaw = turretSlotYawByLabel[turret.label] ?? -Math.PI / 2;
    turret.mountedAimYaw = turret.aimYaw;
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
    !worldState.ultimate.hasStarted ||
    worldState.ultimate.timer > 0 ||
    enemies.length === 0
  ) {
    return;
  }
  worldState.ultimate.timer = worldState.ultimate.cooldown;
  spawnUltimateWave(player.x, player.z, worldState.ultimate.radius);
  for (let index = enemies.length - 1; index >= 0; index -= 1) {
    const enemy = enemies[index];
    const dx = enemy.x - player.x;
    const dz = enemy.z - player.z;
    if (Math.hypot(dx, dz) <= worldState.ultimate.radius) {
      enemy.hp -= worldState.ultimate.damage;
      if (enemy.hp <= 0) {
        removeEnemy(enemy);
      }
    }
  }
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
  worldState.timeScaleDay = 1;
  if (!worldState.ultimate.hasStarted) {
    worldState.ultimate.hasStarted = true;
    worldState.ultimate.timer = worldState.ultimate.cooldown;
  }
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
    scene.remove(effect.ringMesh);
    effect.ringMesh.geometry.dispose();
    effect.ringMesh.material.dispose();
    effect.particles.forEach((particle) => {
      scene.remove(particle.mesh);
      particle.mesh.material.dispose();
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
    shell.mesh.geometry.dispose();
    shell.mesh.material.dispose();
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
      const baseSpawnRate = Math.max(0.12, 0.78 - (worldState.nightNumber - 1) * 0.032);
      const remainingCount = Math.max(0, worldState.totalNightEnemies - worldState.spawnedThisNight);
      const remainingTime = Math.max(0.01, worldState.nightTimer);
      const requiredInterval = remainingCount > 0 ? remainingTime / remainingCount : baseSpawnRate;
      const spawnRate = Math.max(0.035, Math.min(baseSpawnRate, requiredInterval * 0.92));
      while (
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

    updateMovement(dt);
    updatePlayerShooting(dt);
    updatePlayerFacing(dt);
    updatePlayerWeaponAim(dt);
    updateTurrets(dt);
    updateProjectiles(bullets, dt);
    updateProjectiles(turretBullets, dt);
    updateImpactEffects(dt);
    updateEnemyDeathEffects(dt);
    updateZombieSplatters(dt);
    updateCreepDust(dt);
    updateMuzzleFlashes(dt);
    updateEjectedProps(dt);
    updateUltimateWaves(dt);
    updateEnemies(dt);
    updateSelectedTurretVisual();

    if (base.hp <= 0) {
      base.hp = 0;
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
  turret.owned = false;
  turret.level = 0;
  turret.mountedCooldown = 0;
  turret.turretRecoil = 0;
  turret.aimYaw = turretSlotYawByLabel[turret.label] ?? -Math.PI / 2;
  turret.mountedAimYaw = turret.aimYaw;
  applyTurretRecoilVisual(turret);
  syncTurretVisualState(turret);
});
setPlayerWeapon("glock");
applyPhaseVisuals(worldState.phase);
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
    loadLevel1GhostModel();
    loadLevel2ZombieModel();
    loadLevel3SkeletonModel();
    loadLevel4VampireModel();
    loadBaseFencePerimeter();
    loadReloadPropsModels();
  } catch {}
}, 0);
