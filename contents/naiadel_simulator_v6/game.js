'use strict';

const PX_PER_METER = 40;
const FIELD_W = 960;
const FIELD_H = 540;

const SIM = {
  normalDetectRange: 6 * PX_PER_METER,
  rangedDetectRange: 8 * PX_PER_METER,
  chaseMaxDistance: 12 * PX_PER_METER,
  returnDistance: 14 * PX_PER_METER,
  meleeAttackRange: 1.5 * PX_PER_METER,
  playerMoveSpeed: 170,
  monsterMoveSpeed: 105,
  monsterAttackInterval: 1.5,
  basicCoeff: 1.0,
  basicCastTime: 0.8,
  skillCastTime: 0.8,
  chargeTime: 1.2
};

const EXP_TABLE = {
  1: 100, 2: 120, 3: 140, 4: 170, 5: 210,
  6: 250, 7: 300, 8: 360, 9: 430, 10: 520,
  11: 620, 12: 750, 13: 900, 14: 1080, 15: 1280,
  16: 1540, 17: 1850, 18: 2220, 19: 2670, 20: 3200
};

const playerKnightFrames = {
  left: {
    idle: [
      'assets/knight/idle_0.png',
      'assets/knight/idle_1.png',
      'assets/knight/idle_2.png',
      'assets/knight/idle_3.png',
      'assets/knight/idle_4.png',
      'assets/knight/idle_5.png'
    ],
    move: [
      'assets/knight/move_0.png',
      'assets/knight/move_1.png',
      'assets/knight/move_2.png',
      'assets/knight/move_3.png',
      'assets/knight/move_4.png',
      'assets/knight/move_5.png',
      'assets/knight/move_6.png',
      'assets/knight/move_7.png'
    ],
    attack: [
      'assets/knight/attack_0.png',
      'assets/knight/attack_1.png',
      'assets/knight/attack_2.png',
      'assets/knight/attack_3.png',
      'assets/knight/attack_4.png',
      'assets/knight/attack_5.png'
    ],
    skill: [
      'assets/knight/skill_0.png',
      'assets/knight/skill_1.png',
      'assets/knight/skill_2.png',
      'assets/knight/skill_3.png',
      'assets/knight/skill_4.png',
      'assets/knight/skill_5.png',
      'assets/knight/skill_6.png',
      'assets/knight/skill_7.png'
    ]
  },
  right: {
    idle: [
      'assets/knight/idle_right_0.png',
      'assets/knight/idle_right_1.png',
      'assets/knight/idle_right_2.png',
      'assets/knight/idle_right_3.png',
      'assets/knight/idle_right_4.png',
      'assets/knight/idle_right_5.png'
    ],
    move: [
      'assets/knight/move_right_0.png',
      'assets/knight/move_right_1.png',
      'assets/knight/move_right_2.png',
      'assets/knight/move_right_3.png',
      'assets/knight/move_right_4.png',
      'assets/knight/move_right_5.png',
      'assets/knight/move_right_6.png',
      'assets/knight/move_right_7.png'
    ],
    attack: [
      'assets/knight/attack_right_0.png',
      'assets/knight/attack_right_1.png',
      'assets/knight/attack_right_2.png',
      'assets/knight/attack_right_3.png',
      'assets/knight/attack_right_4.png',
      'assets/knight/attack_right_5.png'
    ],
    skill: [
      'assets/knight/skill_right_0.png',
      'assets/knight/skill_right_1.png',
      'assets/knight/skill_right_2.png',
      'assets/knight/skill_right_3.png',
      'assets/knight/skill_right_4.png',
      'assets/knight/skill_right_5.png',
      'assets/knight/skill_right_6.png',
      'assets/knight/skill_right_7.png'
    ]
  }
};

function preloadPlayerSprites() {
  Object.values(playerKnightFrames).forEach((dirSet) => {
    Object.values(dirSet).flat().forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });
}

const monsterSprites = {
  "스틱스 슬라임": `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="82" rx="28" ry="8" fill="rgba(0,0,0,0.35)"/><path d="M20 62 Q20 28 48 24 Q76 28 76 62 Q76 80 48 80 Q20 80 20 62Z" fill="#5cc6a8" stroke="#1f5d52" stroke-width="3"/><circle cx="38" cy="52" r="5" fill="#123c36"/><circle cx="58" cy="52" r="5" fill="#123c36"/><path d="M38 66 Q48 72 58 66" stroke="#123c36" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 34 Q45 26 58 34" stroke="rgba(255,255,255,0.45)" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
  "오스 머드": `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="82" rx="30" ry="8" fill="rgba(0,0,0,0.35)"/><path d="M18 64 Q22 34 48 30 Q74 34 78 64 Q70 82 48 80 Q26 82 18 64Z" fill="#6b4b32" stroke="#352317" stroke-width="3"/><circle cx="37" cy="54" r="4" fill="#17100b"/><circle cx="59" cy="54" r="4" fill="#17100b"/><path d="M33 67 Q48 60 63 67" stroke="#25180f" stroke-width="3" fill="none"/><circle cx="30" cy="42" r="5" fill="#8b6646"/><circle cx="66" cy="39" r="4" fill="#8b6646"/></svg>`,
  "블랙 버블": `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="82" rx="24" ry="7" fill="rgba(0,0,0,0.35)"/><circle cx="48" cy="50" r="30" fill="#25263a" stroke="#8a7cff" stroke-width="3"/><circle cx="38" cy="44" r="5" fill="#d6d2ff"/><circle cx="58" cy="44" r="5" fill="#d6d2ff"/><path d="M36 62 Q48 68 60 62" stroke="#d6d2ff" stroke-width="3" fill="none"/><circle cx="35" cy="30" r="6" fill="rgba(180,170,255,0.5)"/><circle cx="62" cy="34" r="4" fill="rgba(180,170,255,0.5)"/></svg>`,
  "리버 드롭": `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="82" rx="24" ry="7" fill="rgba(0,0,0,0.35)"/><path d="M48 12 C68 36 76 50 76 64 C76 78 64 84 48 84 C32 84 20 78 20 64 C20 50 28 36 48 12Z" fill="#4aa7e8" stroke="#1e4f78" stroke-width="3"/><circle cx="38" cy="56" r="4" fill="#102f46"/><circle cx="58" cy="56" r="4" fill="#102f46"/><path d="M38 68 Q48 72 58 68" stroke="#102f46" stroke-width="3" fill="none"/><path d="M36 28 Q48 20 60 30" stroke="rgba(255,255,255,0.5)" stroke-width="5" fill="none"/></svg>`,
  "스틱스 웨이브": `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="82" rx="28" ry="8" fill="rgba(0,0,0,0.35)"/><path d="M18 64 C28 40 36 36 48 50 C60 64 68 40 78 58 C78 76 62 84 46 80 C30 84 16 76 18 64Z" fill="#3b7fd3" stroke="#153d76" stroke-width="3"/><path d="M26 56 C36 48 42 48 52 56 C60 62 66 62 74 56" stroke="#bde7ff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="38" cy="63" r="4" fill="#092544"/><circle cx="58" cy="63" r="4" fill="#092544"/></svg>`,
  "스틱스 피라냐": `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><ellipse cx="48" cy="82" rx="28" ry="8" fill="rgba(0,0,0,0.35)"/><path d="M18 52 Q38 28 68 40 L84 30 L76 52 L84 74 L66 64 Q38 78 18 52Z" fill="#2f668f" stroke="#15324b" stroke-width="3"/><circle cx="34" cy="47" r="5" fill="#f2f7ff"/><circle cx="34" cy="47" r="2" fill="#0b1720"/><path d="M20 56 L34 56 L26 64 Z" fill="#f2f7ff"/><path d="M48 38 L58 24 L62 42 Z" fill="#204761"/><path d="M48 66 L58 82 L62 62 Z" fill="#204761"/></svg>`
};

const skills = [
  { index: 1001001, name: '기사단의 기초', reqClassIdx: 1001, reqLevel: 1, skillType: 0, target: 'self', coeff: 0, coolTime: 0, effect: 'def_flat', value: 5 },
  { index: 1001002, name: '방패 가격', reqClassIdx: 1001, reqLevel: 1, skillType: 2, key: 'Q', attackType: 'physical', range: 2 * PX_PER_METER, coeff: 1.2, coolTime: 3, rangeYn: false },
  { index: 1001003, name: '전방 베기', reqClassIdx: 1001, reqLevel: 3, skillType: 2, key: 'W', attackType: 'physical', range: 3 * PX_PER_METER, area: 4 * PX_PER_METER, coeff: 0.9, maxTargets: 3, coolTime: 6, rangeYn: true, rangeType: 'cone' },
  { index: 1001004, name: '돌진 찌르기', reqClassIdx: 1001, reqLevel: 5, skillType: 2, key: 'E', attackType: 'physical', range: 4 * PX_PER_METER, area: 2 * PX_PER_METER, coeff: 1.8, moveDistance: 4 * PX_PER_METER, coolTime: 10, rangeYn: true, rangeType: 'line' }
];

const monsterPool = [
  { nameIdx: 1000001, name: '스틱스 슬라임', level: 1, maxHp: 520, atk: 35, def: 18, res: 10, exp: 25, attackType: 'physical', rangeYn: false, rangeValue: null },
  { nameIdx: 1000002, name: '오스 머드', level: 3, maxHp: 620, atk: 40, def: 22, res: 15, exp: 30, attackType: 'physical', rangeYn: false, rangeValue: null },
  { nameIdx: 1000003, name: '블랙 버블', level: 5, maxHp: 560, atk: 60, def: 24, res: 45, exp: 45, attackType: 'magical', rangeYn: true, rangeValue: 300 },
  { nameIdx: 1000004, name: '리버 드롭', level: 7, maxHp: 750, atk: 78, def: 40, res: 28, exp: 55, attackType: 'physical', rangeYn: false, rangeValue: null },
  { nameIdx: 1000005, name: '스틱스 웨이브', level: 9, maxHp: 860, atk: 94, def: 38, res: 60, exp: 65, attackType: 'magical', rangeYn: true, rangeValue: 300 },
  { nameIdx: 1000006, name: '스틱스 피라냐', level: 10, maxHp: 1000, atk: 105, def: 52, res: 36, exp: 75, attackType: 'physical', rangeYn: false, rangeValue: null }
];

const equipmentAdds = {
  str: 35, dex: 0, int: 0, fth: 10, spi: 0,
  hp: 250, mp: 0, atk: 20, def: 130, res: 130,
  hit: 0, dodge: 0
};

const player = {
  classIdx: 1001,
  className: '기사',
  level: 1,
  exp: 0,
  solar: 0,
  base: { str: 10, dex: 5, int: 5, fth: 5, spi: 0, fme: 0, not: 0 },
  growth: { str: 10, dex: 0, int: 0, fth: 0, spi: 0, fme: 0, not: 0 },
  mainStat: 'str',
  subStat: 'fme',
  damageType: 'physical',
  x: 480,
  y: 390,
  targetX: 480,
  targetY: 390,
  direction: 'left',
  hp: 1,
  mp: 1,
  maxHp: 1,
  maxMp: 1,
  stats: {},
  cooldowns: {},
  target: null,
  alive: true
};

let monster = null;
let debug = false;
let lastTime = performance.now();
let monsterAttackTimer = 0;
let pendingAction = null;
let chargeAction = null;
let chargeGaugeEl = null;

const playerAnim = {
  state: 'idle',
  frame: 0,
  timer: 0,
  frameTime: 0.16,
  lockedUntil: 0
};


const el = {
  field: document.getElementById('battlefield'),
  rangeLayer: document.getElementById('rangeLayer'),
  fxLayer: document.getElementById('fxLayer'),
  playerUnit: document.getElementById('playerUnit'),
  monsterUnit: document.getElementById('monsterUnit'),
  moveMarker: document.getElementById('moveMarker'),
  className: document.getElementById('className'),
  playerLevel: document.getElementById('playerLevel'),
  hpText: document.getElementById('hpText'),
  hpBar: document.getElementById('hpBar'),
  mpText: document.getElementById('mpText'),
  mpBar: document.getElementById('mpBar'),
  expText: document.getElementById('expText'),
  expBar: document.getElementById('expBar'),
  solarText: document.getElementById('solarText'),
  targetInfo: document.getElementById('targetInfo'),
  combatLog: document.getElementById('combatLog'),
  characterDetails: document.getElementById('characterDetails'),
  skillSlots: document.getElementById('skillSlots'),
  spawnBtn: document.getElementById('spawnBtn'),
  resetCombatBtn: document.getElementById('resetCombatBtn'),
  debugBtn: document.getElementById('debugBtn')
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function fmt(n) { return Math.floor(n).toLocaleString('ko-KR'); }
function reqExpFor(level) { return EXP_TABLE[level] ?? 999999; }
function mpCost(skill) { return skill.skillType === 0 ? 0 : 5 + skill.reqLevel * 2; }
function getK(targetLevel) { return 100 * targetLevel; }

function calcPlayerStats(keepRatio = false) {
  const oldHpRatio = player.maxHp > 0 ? player.hp / player.maxHp : 1;
  const oldMpRatio = player.maxMp > 0 ? player.mp / player.maxMp : 1;
  const levelOffset = player.level - 1;
  const primary = {
    str: player.base.str + player.growth.str * levelOffset + equipmentAdds.str,
    dex: player.base.dex + player.growth.dex * levelOffset + equipmentAdds.dex,
    int: player.base.int + player.growth.int * levelOffset + equipmentAdds.int,
    fth: player.base.fth + player.growth.fth * levelOffset + equipmentAdds.fth,
    spi: player.base.spi + player.growth.spi * levelOffset + equipmentAdds.spi,
    fme: player.base.fme + player.growth.fme * levelOffset,
    not: player.base.not + player.growth.not * levelOffset
  };
  const baseAtk = primary[player.mainStat] * 3 + primary[player.subStat] * 2;
  const atk = baseAtk + equipmentAdds.atk;
  const baseHp = (100 + 20 * Math.pow(levelOffset, 1.15)) + primary.str * 5;
  const maxHp = Math.floor(baseHp + equipmentAdds.hp);
  const baseMp = (100 + levelOffset * 10) + primary.int * 2;
  const maxMp = Math.floor(baseMp + equipmentAdds.mp);
  const baseDef = player.level * 20 + primary.str * 3;
  let def = Math.floor(baseDef + equipmentAdds.def);
  const baseRes = player.level * 20 + primary.fth * 3;
  const res = Math.floor(baseRes + equipmentAdds.res);

  const passive = skills.find(s => s.index === 1001001 && player.level >= s.reqLevel);
  if (passive) def += passive.value;

  player.stats = { ...primary, atk: Math.floor(atk), def, res };
  player.maxHp = maxHp;
  player.maxMp = maxMp;
  if (keepRatio) {
    player.hp = clamp(Math.floor(maxHp * oldHpRatio), 1, maxHp);
    player.mp = clamp(Math.floor(maxMp * oldMpRatio), 0, maxMp);
  } else {
    player.hp = maxHp;
    player.mp = maxMp;
  }
}

function getPlayerFrames() {
  const directionFrames = playerKnightFrames[player.direction] || playerKnightFrames.left;
  return directionFrames[playerAnim.state] || directionFrames.idle;
}

function getPlayerFrameSrc() {
  const frames = getPlayerFrames();
  return frames[playerAnim.frame % frames.length];
}

function faceTowardX(x) {
  if (Math.abs(x - player.x) < 2) return;
  player.direction = x >= player.x ? 'right' : 'left';
}

function faceTowardUnit(unit) {
  if (!unit) return;
  faceTowardX(unit.x);
}

function createPlayerUnitHtml(name, hpPct) {
  return `<img id="playerSpriteImg" class="player-sprite" src="${getPlayerFrameSrc()}" alt="${name}" draggable="false"><div class="nameplate">${name}</div><div class="unit-hp-bar"><span style="width:${hpPct}%"></span></div>`;
}

function createUnitHtml(name, svg, hpPct) {
  return `${svg}<div class="nameplate">${name}</div><div class="unit-hp-bar"><span style="width:${hpPct}%"></span></div>`;
}

function updateUnitPositions() {
  el.playerUnit.style.left = `${player.x}px`;
  el.playerUnit.style.top = `${player.y}px`;
  if (monster && monster.alive) {
    el.monsterUnit.style.left = `${monster.x}px`;
    el.monsterUnit.style.top = `${monster.y}px`;
  }
}

function updatePlayerSprite() {
  const hpPct = (player.hp / player.maxHp) * 100;
  el.playerUnit.innerHTML = createPlayerUnitHtml('기사', hpPct);
}

function setPlayerAnimation(state, lockDuration = 0) {
  if (playerAnim.state !== state) {
    playerAnim.state = state;
    playerAnim.frame = 0;
    playerAnim.timer = 0;
  }
  if (lockDuration > 0) playerAnim.lockedUntil = performance.now() / 1000 + lockDuration;
}

function updatePlayerAnimation(dt) {
  const now = performance.now() / 1000;
  const dx = player.targetX - player.x;
  const dy = player.targetY - player.y;
  const moving = Math.hypot(dx, dy) > 3;

  if (now >= playerAnim.lockedUntil) {
    setPlayerAnimation(moving ? 'move' : 'idle');
  }

  playerAnim.timer += dt;
  const stateSpeed = { idle: 0.22, move: 0.11, attack: 0.075, skill: 0.095 };
  const frameTime = stateSpeed[playerAnim.state] || 0.16;
  const frames = getPlayerFrames();

  if (playerAnim.timer >= frameTime) {
    playerAnim.timer = 0;
    playerAnim.frame += 1;
    if (playerAnim.frame >= frames.length) {
      playerAnim.frame = now < playerAnim.lockedUntil ? frames.length - 1 : 0;
    }
    const img = document.getElementById('playerSpriteImg');
    if (img) img.src = getPlayerFrameSrc();
  }
}

function updateMonsterSprite() {
  if (!monster) {
    el.monsterUnit.classList.add('hidden');
    el.targetInfo.className = 'target-info empty';
    el.targetInfo.textContent = '몬스터를 소환하거나 선택하면 정보가 표시된다.';
    return;
  }
  const hpPct = Math.max(0, (monster.hp / monster.maxHp) * 100);
  el.monsterUnit.innerHTML = createUnitHtml(`${monster.name} Lv.${monster.level}`, monsterSprites[monster.name], hpPct);
  el.monsterUnit.classList.remove('hidden');
  el.monsterUnit.classList.toggle('selected', player.target === monster);
  el.monsterUnit.classList.toggle('dead', !monster.alive);
}

function updateHud() {
  el.className.textContent = player.className;
  el.playerLevel.textContent = player.level;
  el.hpText.textContent = `${fmt(player.hp)} / ${fmt(player.maxHp)}`;
  el.hpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
  el.mpText.textContent = `${fmt(player.mp)} / ${fmt(player.maxMp)}`;
  el.mpBar.style.width = `${(player.mp / player.maxMp) * 100}%`;
  const req = reqExpFor(player.level);
  el.expText.textContent = `${fmt(player.exp)} / ${fmt(req)}`;
  el.expBar.style.width = `${Math.min(100, (player.exp / req) * 100)}%`;
  el.solarText.textContent = fmt(player.solar);
  updatePlayerSprite();
  updateMonsterSprite();
  updateTargetInfo();
  updateDetails();
  updateSkillSlots();
}

function updateDetails() {
  const s = player.stats;
  const rows = [
    ['클래스', player.className], ['레벨', player.level], ['방향', player.direction === 'right' ? '우측' : '좌측'], ['힘', s.str], ['재주', s.dex], ['지능', s.int], ['신앙', s.fth], ['정신', s.spi],
    ['명성', s.fme], ['공격력', s.atk], ['물리 방어력', s.def], ['마법 저항력', s.res]
  ];
  el.characterDetails.innerHTML = rows.map(([k,v]) => `<div class="detail-row"><span>${k}</span><strong>${v}</strong></div>`).join('');
}

function updateTargetInfo() {
  if (!monster) return;
  if (!monster.alive) {
    el.targetInfo.className = 'target-info';
    el.targetInfo.innerHTML = `<div class="info-row"><span>상태</span><strong>사망</strong></div>`;
    return;
  }
  const solar = monster.level * 5;
  el.targetInfo.className = 'target-info';
  el.targetInfo.innerHTML = [
    ['몬스터', `${monster.name} Lv.${monster.level}`],
    ['유형', `일반 / ${monster.attackType === 'physical' ? '물리' : '마법'} 공격`],
    ['상태', monster.state],
    ['HP', `${fmt(monster.hp)} / ${fmt(monster.maxHp)}`],
    ['ATK', monster.atk], ['DEF', monster.def], ['RES', monster.res],
    ['처치 보상', `EXP ${monster.exp}, 솔라르 ${solar}`]
  ].map(([k,v]) => `<div class="info-row"><span>${k}</span><strong>${v}</strong></div>`).join('');
}

function availableActiveSkills() {
  return skills.filter(s => s.reqClassIdx === player.classIdx && s.skillType === 2);
}

function updateSkillSlots() {
  const order = ['Q','W','E'];
  const active = availableActiveSkills().sort((a,b) => a.reqLevel - b.reqLevel);
  el.skillSlots.innerHTML = order.map((key, i) => {
    const skill = active[i];
    if (!skill) return '';
    const locked = player.level < skill.reqLevel;
    const cd = Math.max(0, player.cooldowns[skill.index] || 0);
    const charging = chargeAction && skill && chargeAction.skill.index === skill.index;
    return `<div class="skill-slot ${locked ? 'locked' : ''} ${cd > 0 ? 'on-cooldown' : ''} ${charging ? 'charging' : ''}" data-key="${key}">
      <div class="skill-key">${key}</div>
      <div class="skill-name">${locked ? `Lv.${skill.reqLevel} 잠김` : skill.name}</div>
      <div class="skill-meta">MP ${mpCost(skill)} · ${skill.coolTime}s</div>
      <div class="cooldown-cover">${cd.toFixed(1)}</div>
    </div>`;
  }).join('');
}

function log(message, type = '') {
  const line = document.createElement('div');
  line.className = `log-line ${type}`.trim();
  line.textContent = message;
  el.combatLog.appendChild(line);
  el.combatLog.scrollTop = el.combatLog.scrollHeight;
}

function damageFormula(atk, coeff, target, attackType) {
  const k = getK(target.level);
  const defense = attackType === 'physical' ? target.def : target.res;
  const raw = atk * coeff * (k / (k + defense));
  const variance = 0.95 + Math.random() * 0.10; // 최종 피해량 -5% ~ +5% 난수 적용
  const finalDamage = raw * variance;
  return Math.max(1, Math.floor(finalDamage));
}

function playerDamageToMonster(coeff, attackType = 'physical') {
  return damageFormula(player.stats.atk, coeff, monster, attackType);
}

function monsterDamageToPlayer(monsterObj) {
  const target = { level: player.level, def: player.stats.def, res: player.stats.res };
  return damageFormula(monsterObj.atk, 1, target, monsterObj.attackType);
}

function showDamage(x, y, amount) {
  const d = document.createElement('div');
  d.className = 'damage-number';
  d.style.left = `${x}px`;
  d.style.top = `${y - 42}px`;
  d.textContent = amount;
  el.fxLayer.appendChild(d);
  setTimeout(() => d.remove(), 800);
}

function flashUnit(unitEl) {
  unitEl.classList.remove('hit');
  void unitEl.offsetWidth;
  unitEl.classList.add('hit');
}

function nowSec() { return performance.now() / 1000; }

function isPlayerBusy() {
  return Boolean(pendingAction || chargeAction);
}

function startPendingAction({ name, duration, animState, lockDuration, execute, type = 'skill' }) {
  if (isPlayerBusy()) {
    log('이미 다른 행동을 준비 중이다.', 'warn');
    return false;
  }
  pendingAction = { name, execute, completesAt: nowSec() + duration, type };
  setPlayerAnimation(animState, lockDuration || duration);
  log(`[준비] ${name} 준비 중. ${duration.toFixed(1)}초 후 발동.`, type === 'attack' ? 'damage' : 'skill');
  return true;
}

function updatePendingAction() {
  if (!pendingAction) return;
  if (nowSec() < pendingAction.completesAt) return;
  const action = pendingAction;
  pendingAction = null;
  action.execute();
}

function useBasicAttack() {
  if (!monster || !monster.alive) {
    log('공격할 몬스터가 없다.', 'warn');
    return;
  }
  if (isPlayerBusy()) {
    log('현재 행동이 끝난 뒤 기본 공격을 사용할 수 있다.', 'warn');
    return;
  }
  player.target = monster;
  faceTowardUnit(monster);
  const distance = dist(player, monster);
  if (distance > SIM.meleeAttackRange) {
    log('대상이 기본 공격 사거리 밖에 있다. 대상에게 접근한다.', 'warn');
    moveTowardTarget(monster, SIM.meleeAttackRange - 4);
    return;
  }

  startPendingAction({
    name: '기본 공격',
    duration: SIM.basicCastTime,
    animState: 'attack',
    lockDuration: SIM.basicCastTime + 0.15,
    type: 'attack',
    execute: () => {
      if (!monster || !monster.alive) return;
      const currentDistance = dist(player, monster);
      if (currentDistance > SIM.meleeAttackRange + 8) {
        log('기본 공격 발동 실패. 대상이 사거리 밖으로 벗어났다.', 'warn');
        return;
      }
      const dmg = playerDamageToMonster(SIM.basicCoeff, player.damageType);
      applyDamageToMonster(dmg, '기본 공격', 'damage');
    }
  });
}

function validateSkillStart(skill) {
  if (!skill) return false;
  if (player.level < skill.reqLevel) { log(`${skill.name}은 Lv.${skill.reqLevel}에 해금된다.`, 'warn'); return false; }
  if (!monster || !monster.alive) { log(`${skill.name}을 사용할 대상이 없다.`, 'warn'); return false; }
  faceTowardUnit(monster);
  const cd = player.cooldowns[skill.index] || 0;
  if (cd > 0) { log(`${skill.name} 쿨타임 ${cd.toFixed(1)}초 남음.`, 'warn'); return false; }
  const cost = mpCost(skill);
  if (player.mp < cost) { log(`MP 부족. ${skill.name} 필요 MP ${cost}.`, 'warn'); return false; }
  const distance = dist(player, monster);
  if (distance > skill.range) {
    log(`${skill.name} 사거리 밖이다. 대상에게 접근한다.`, 'warn');
    moveTowardTarget(monster, skill.range - 4);
    return false;
  }
  return true;
}

function executeSkill(skill) {
  if (!validateSkillStart(skill)) return;

  faceTowardUnit(monster);
  const cost = mpCost(skill);
  player.mp -= cost;
  player.cooldowns[skill.index] = skill.coolTime;
  setPlayerAnimation(skill.index === 1001004 ? 'skill' : 'attack', 0.75);
  const dmg = playerDamageToMonster(skill.coeff, skill.attackType);

  if (skill.index === 1001004) {
    const distance = dist(player, monster);
    const toward = normalizedVector(player, monster);
    player.x = clamp(player.x + toward.x * Math.min(skill.moveDistance, Math.max(0, distance - SIM.meleeAttackRange)), 38, FIELD_W - 38);
    player.y = clamp(player.y + toward.y * Math.min(skill.moveDistance, Math.max(0, distance - SIM.meleeAttackRange)), 38, FIELD_H - 38);
    log(`[스킬] ${skill.name}. MP ${cost} 소모. 전방으로 돌진한다.`, 'skill');
    showLineEffect(player.x, player.y, monster.x, monster.y, skill.range);
  } else {
    log(`[스킬] ${skill.name}. MP ${cost} 소모.`, 'skill');
    if (skill.rangeYn) showBurst(monster.x, monster.y, 90);
  }

  applyDamageToMonster(dmg, skill.name, 'skill');
  updateHud();
}

function useSkillByKey(key) {
  const skill = availableActiveSkills().find(s => s.key === key);
  if (!skill) return;
  if (key === 'E') {
    startChargeSkill(skill);
    return;
  }
  if (isPlayerBusy()) {
    log('현재 행동이 끝난 뒤 스킬을 사용할 수 있다.', 'warn');
    return;
  }
  if (!validateSkillStart(skill)) return;
  startPendingAction({
    name: skill.name,
    duration: SIM.skillCastTime,
    animState: 'skill',
    lockDuration: SIM.skillCastTime + 0.15,
    type: 'skill',
    execute: () => executeSkill(skill)
  });
}

function startChargeSkill(skill) {
  if (isPlayerBusy()) {
    log('현재 행동이 끝난 뒤 차지 스킬을 사용할 수 있다.', 'warn');
    return;
  }
  if (!validateSkillStart(skill)) return;
  chargeAction = { skill, startAt: nowSec(), completesAt: nowSec() + SIM.chargeTime, activated: false };
  setPlayerAnimation('skill', SIM.chargeTime + 0.2);
  createChargeGauge();
  log(`[차지] ${skill.name} 차지 시작. ${SIM.chargeTime.toFixed(1)}초 유지 시 발동.`, 'skill');
}

function cancelChargeSkill() {
  if (!chargeAction || chargeAction.activated) return;
  const name = chargeAction.skill.name;
  chargeAction = null;
  removeChargeGauge();
  log(`[취소] ${name} 차지가 중단됐다.`, 'warn');
}

function updateChargeSkill() {
  if (!chargeAction) {
    removeChargeGauge();
    return;
  }
  const progress = clamp((nowSec() - chargeAction.startAt) / SIM.chargeTime, 0, 1);
  updateChargeGauge(progress);
  if (!chargeAction.activated && progress >= 1) {
    const skill = chargeAction.skill;
    chargeAction.activated = true;
    chargeAction = null;
    removeChargeGauge();
    executeSkill(skill);
  }
}

function createChargeGauge() {
  removeChargeGauge();
  chargeGaugeEl = document.createElement('div');
  chargeGaugeEl.className = 'charge-gauge';
  chargeGaugeEl.innerHTML = '<div class="charge-gauge-label">CHARGE</div><div class="charge-gauge-track"><span></span></div>';
  el.fxLayer.appendChild(chargeGaugeEl);
  updateChargeGauge(0);
}

function updateChargeGauge(progress) {
  if (!chargeGaugeEl) return;
  chargeGaugeEl.style.left = `${player.x}px`;
  chargeGaugeEl.style.top = `${player.y - 96}px`;
  const bar = chargeGaugeEl.querySelector('span');
  if (bar) bar.style.width = `${progress * 100}%`;
}

function removeChargeGauge() {
  if (chargeGaugeEl) chargeGaugeEl.remove();
  chargeGaugeEl = null;
}

function normalizedVector(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

function moveTowardTarget(target, stopDistance) {
  const v = normalizedVector(player, target);
  const desiredX = target.x - v.x * stopDistance;
  const desiredY = target.y - v.y * stopDistance;
  setMoveTarget(desiredX, desiredY);
}

function applyDamageToMonster(dmg, source, type) {
  if (!monster || !monster.alive) return;
  monster.hp = Math.max(0, monster.hp - dmg);
  showDamage(monster.x, monster.y, dmg);
  flashUnit(el.monsterUnit);
  log(`[피해] ${source} → ${monster.name}에게 ${dmg} 피해.`, type);
  if (monster.hp <= 0) killMonster();
  updateHud();
}

function killMonster() {
  if (!monster) return;
  monster.alive = false;
  monster.state = '사망';
  player.target = null;
  log(`[처치] ${monster.name} 처치.`, 'reward');
  gainReward(monster);
  updateHud();
}

function gainReward(m) {
  const solar = m.level * 5;
  player.exp += m.exp;
  player.solar += solar;
  log(`[보상] EXP ${m.exp} 획득, 솔라르 ${solar} 획득.`, 'reward');
  checkLevelUp();
}

function checkLevelUp() {
  let leveled = false;
  while (player.level < 100 && player.exp >= reqExpFor(player.level)) {
    player.exp -= reqExpFor(player.level);
    player.level += 1;
    leveled = true;
    log(`[성장] Lv.${player.level} 달성. HP/MP가 최대치로 회복된다.`, 'growth');
    const newly = skills.filter(s => s.reqClassIdx === player.classIdx && s.skillType === 2 && s.reqLevel === player.level);
    newly.forEach(s => log(`[해금] ${s.name} 스킬 사용 가능.`, 'growth'));
  }
  if (leveled) calcPlayerStats(false);
}

function showBurst(x, y, radius) {
  const b = document.createElement('div');
  b.className = 'skill-burst';
  b.style.left = `${x}px`;
  b.style.top = `${y}px`;
  b.style.width = `${radius}px`;
  b.style.height = `${radius}px`;
  el.fxLayer.appendChild(b);
  setTimeout(() => b.remove(), 400);
}

function showLineEffect(x1, y1, x2, y2, length) {
  const line = document.createElement('div');
  line.className = 'skill-line';
  line.style.left = `${x1}px`;
  line.style.top = `${y1 - 19}px`;
  line.style.width = `${Math.min(length, Math.hypot(x2 - x1, y2 - y1))}px`;
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  line.style.transform = `rotate(${angle}deg)`;
  el.fxLayer.appendChild(line);
  setTimeout(() => line.remove(), 350);
}

function spawnMonster() {
  const minL = Math.max(1, player.level - 1);
  const maxL = Math.min(10, player.level + 2);
  const candidates = monsterPool.filter(m => m.level >= minL && m.level <= maxL);
  const base = candidates[Math.floor(Math.random() * candidates.length)] || monsterPool[0];
  const spawnX = clamp(player.x + (Math.random() > 0.5 ? 1 : -1) * (260 + Math.random() * 100), 90, FIELD_W - 90);
  const spawnY = clamp(player.y - (180 + Math.random() * 90), 80, FIELD_H - 80);
  monster = {
    ...base,
    hp: base.maxHp,
    x: spawnX,
    y: spawnY,
    homeX: spawnX,
    homeY: spawnY,
    state: '대기',
    alive: true
  };
  player.target = monster;
  monsterAttackTimer = 0;
  log(`[소환] ${monster.name} Lv.${monster.level} 출현.`, 'reward');
  updateHud();
}

function resetCombat() {
  monster = null;
  player.target = null;
  player.x = 480; player.y = 390; player.targetX = 480; player.targetY = 390; player.direction = 'left';
  player.cooldowns = {};
  pendingAction = null;
  chargeAction = null;
  removeChargeGauge();
  el.moveMarker.classList.add('hidden');
  log('[초기화] 전투 필드를 초기화했다.', 'warn');
  updateHud();
}

function setMoveTarget(x, y) {
  faceTowardX(x);
  player.targetX = clamp(x, 35, FIELD_W - 35);
  player.targetY = clamp(y, 35, FIELD_H - 35);
  el.moveMarker.style.left = `${player.targetX}px`;
  el.moveMarker.style.top = `${player.targetY}px`;
  el.moveMarker.classList.remove('hidden');
}

function getFieldPoint(evt) {
  const rect = el.field.getBoundingClientRect();
  const scaleX = FIELD_W / rect.width;
  const scaleY = FIELD_H / rect.height;
  return { x: (evt.clientX - rect.left) * scaleX, y: (evt.clientY - rect.top) * scaleY };
}

function updateMovement(dt) {
  const dx = player.targetX - player.x;
  const dy = player.targetY - player.y;
  const distance = Math.hypot(dx, dy);
  if (distance > 2) {
    faceTowardX(player.targetX);
    const step = Math.min(distance, SIM.playerMoveSpeed * dt);
    player.x += (dx / distance) * step;
    player.y += (dy / distance) * step;
  } else {
    el.moveMarker.classList.add('hidden');
  }
}

function updateCooldowns(dt) {
  for (const k of Object.keys(player.cooldowns)) {
    player.cooldowns[k] = Math.max(0, player.cooldowns[k] - dt);
  }
}

function updateMonsterAI(dt) {
  if (!monster || !monster.alive || !player.alive) return;
  const dPlayer = dist(monster, player);
  const dHome = Math.hypot(monster.x - monster.homeX, monster.y - monster.homeY);
  const detect = monster.rangeYn ? SIM.rangedDetectRange : SIM.normalDetectRange;
  const attackRange = monster.rangeYn ? monster.rangeValue : SIM.meleeAttackRange;

  if (dHome >= SIM.returnDistance && monster.state !== '복귀') {
    monster.state = '복귀';
    log(`[복귀] ${monster.name}이 전투 범위를 벗어나 원위치로 돌아간다.`, 'warn');
  }

  if (monster.state === '복귀') {
    moveMonsterToward({ x: monster.homeX, y: monster.homeY }, dt);
    if (Math.hypot(monster.x - monster.homeX, monster.y - monster.homeY) < 4) {
      monster.state = '대기';
      monster.hp = monster.maxHp;
      log(`[대기] ${monster.name}이 원위치로 복귀했다. HP가 초기화된다.`, 'warn');
    }
    return;
  }

  if (monster.state === '대기' && dPlayer <= detect) {
    monster.state = '추적';
    log(`[인식] ${monster.name}이 플레이어를 발견했다.`, 'warn');
  }

  if (monster.state === '추적' || monster.state === '공격') {
    if (dPlayer > SIM.chaseMaxDistance) {
      monster.state = '복귀';
      log(`[이탈] 플레이어가 추적 범위를 벗어났다.`, 'warn');
      return;
    }
    if (dPlayer > attackRange) {
      monster.state = '추적';
      moveMonsterToward(player, dt);
    } else {
      monster.state = '공격';
      monsterAttackTimer -= dt;
      if (monsterAttackTimer <= 0) {
        monsterBasicAttack();
        monsterAttackTimer = SIM.monsterAttackInterval;
      }
    }
  }
}

function moveMonsterToward(target, dt) {
  const dx = target.x - monster.x;
  const dy = target.y - monster.y;
  const d = Math.hypot(dx, dy) || 1;
  const step = Math.min(d, SIM.monsterMoveSpeed * dt);
  monster.x += (dx / d) * step;
  monster.y += (dy / d) * step;
}

function monsterBasicAttack() {
  const dmg = monsterDamageToPlayer(monster);
  player.hp = Math.max(0, player.hp - dmg);
  showDamage(player.x, player.y, dmg);
  flashUnit(el.playerUnit);
  log(`[피격] ${monster.name} 기본 공격 → 기사에게 ${dmg} 피해.`, 'damage');
  if (player.hp <= 0) {
    player.alive = false;
    log('[패배] 플레이어가 사망했다. 보상과 손실 없이 전투 종료.', 'warn');
  }
  updateHud();
}

function renderDebug() {
  el.rangeLayer.innerHTML = '';
  if (!debug || !monster || !monster.alive) return;
  const detect = monster.rangeYn ? SIM.rangedDetectRange : SIM.normalDetectRange;
  const d1 = document.createElement('div');
  d1.className = 'debug-circle detect';
  d1.style.left = `${monster.x}px`;
  d1.style.top = `${monster.y}px`;
  d1.style.width = `${detect * 2}px`;
  d1.style.height = `${detect * 2}px`;
  el.rangeLayer.appendChild(d1);

  const d2 = document.createElement('div');
  d2.className = 'debug-circle return';
  d2.style.left = `${monster.homeX}px`;
  d2.style.top = `${monster.homeY}px`;
  d2.style.width = `${SIM.returnDistance * 2}px`;
  d2.style.height = `${SIM.returnDistance * 2}px`;
  el.rangeLayer.appendChild(d2);
}

function gameLoop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  if (player.alive) {
    updateMovement(dt);
    updatePlayerAnimation(dt);
    updateCooldowns(dt);
    updatePendingAction();
    updateChargeSkill();
    updateMonsterAI(dt);
  }
  updateUnitPositions();
  renderDebug();
  updateSkillSlots();
  updateTargetInfo();
  requestAnimationFrame(gameLoop);
}

function initEvents() {
  el.field.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const p = getFieldPoint(e);
    setMoveTarget(p.x, p.y);
  });

  el.field.addEventListener('click', (e) => {
    const p = getFieldPoint(e);
    const clickedMonster = monster && monster.alive && (
      e.target.closest('.unit.monster') || Math.hypot(p.x - monster.x, p.y - monster.y) < 58
    );

    if (clickedMonster) {
      player.target = monster;
      updateHud();
      useBasicAttack();
    }
  });

  el.spawnBtn.addEventListener('click', spawnMonster);
  el.resetCombatBtn.addEventListener('click', resetCombat);
  el.debugBtn.addEventListener('click', () => {
    debug = !debug;
    el.debugBtn.setAttribute('aria-pressed', String(debug));
    el.debugBtn.textContent = debug ? '디버그 숨김' : '디버그 표시';
  });

  window.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (e.repeat) return;
    if (['Q','W','E'].includes(key)) useSkillByKey(key);
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toUpperCase();
    if (key === 'E' && chargeAction && !chargeAction.activated) cancelChargeSkill();
  });
}

function init() {
  preloadPlayerSprites();
  calcPlayerStats(false);
  updateHud();
  updateUnitPositions();
  initEvents();
  log('[시작] 나이아델 RPG 시뮬레이터가 준비됐다. 몬스터를 소환해 전투를 시작한다.', 'reward');
  requestAnimationFrame(gameLoop);
}

init();
