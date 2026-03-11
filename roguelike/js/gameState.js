// 游戏状态管理
import { EQUIPMENT, calculateEquipmentScore } from './equipment.js';

// 初始装备
const initialEquipment = {
    helmet: EQUIPMENT.helmets[0],
    armor: EQUIPMENT.armors[0],
    leftHand: EQUIPMENT.oneHandWeapons[0],
    rightHand: EQUIPMENT.oneHandWeapons[0],
    gloves: EQUIPMENT.gloves[0],
    boots: EQUIPMENT.boots[0],
    necklace: EQUIPMENT.necklaces[0],
    ring1: EQUIPMENT.rings[0],
    ring2: EQUIPMENT.rings[0]
};

// 基础属性（非常强力，能轻松通过10层）
export const baseStats = {
    strength: 10,        // 力量 - 影响攻击力和生命值
    agility: 10,         // 敏捷 - 影响防御、闪避、暴击率
    intelligence: 10      // 智力 - 影响法力值、法力恢复、法术伤害
};

// 计算初始装备加成的HP
function getInitialEquipHp() {
    const eq = initialEquipment;
    return eq.helmet.hp + eq.armor.hp + eq.gloves.hp +
           eq.boots.hp + eq.ring1.hp + (eq.ring2 ? eq.ring2.hp : 0);
}

export const defaultState = {
    floor: 1,
    maxFloor: 1,
    level: 1,                   // 等级
    exp: 0,                     // 经验值
    expToLevel: 100,             // 升级所需经验
    hp: 230,                    // 生命值（初始计算后）
    maxHp: 230,                 // 最大生命值
    mp: 100,                    // 法力值
    maxMp: 100,                 // 最大法力值
    mpRegen: 5,                 // 法力恢复/每回合
    gold: 30,                   // 初始金币
    strength: 10,               // 力量
    agility: 10,                // 敏捷
    intelligence: 10,            // 智力
    equipment: { ...initialEquipment },
    artifacts: [],               // 遗物列表
    spells: [],                 // 学会的法术
    inBattle: false,
    isAutoBattle: false,         // 是否自动战斗
    monster: null,
    damageBuff: 1.0,            // 攻击力buff倍率
    defenseBuff: 1.0,           // 防御力buff倍率
    penetration: 0,             // 穿透值
    spellDamage: 1.0,          // 法术伤害倍率
    lastShopFloor: 0           // 上次商店楼层
};

export let gameState = { ...defaultState };

export function resetGameState(keepMaxFloor = true) {
    gameState = {
        ...defaultState,
        maxFloor: keepMaxFloor ? gameState.maxFloor : 1
    };
    // 确保 ring2 存在
    if (!gameState.equipment.ring2) {
        gameState.equipment.ring2 = EQUIPMENT.rings[0];
    }
    // 初始化属性
    const stats = calculateBaseAttributes();
    gameState.maxHp = stats.maxHp;
    gameState.hp = stats.maxHp;
    gameState.maxMp = stats.maxMp;
    gameState.mp = stats.maxMp;
    gameState.mpRegen = stats.mpRegen;
    gameState.spellDamage = stats.spellDamage;

    gameState.inBattle = false;
    gameState.monster = null;
    gameState.isAutoBattle = false;
    gameState.lastShopFloor = 0;  // 重置商店记录

    return gameState;
}

// 计算三大属性对应的战斗属性
export function calculateBaseAttributes() {
    const str = gameState.strength || 10;
    const agi = gameState.agility || 10;
    const int = gameState.intelligence || 10;

    // 力量：10力量 = 20血量 + 5攻击力
    let maxHp = str * 20;

    // 加上装备的HP
    if (gameState.equipment) {
        const eq = gameState.equipment;
        if (eq.helmet && eq.armor && eq.leftHand && eq.rightHand &&
            eq.gloves && eq.boots && eq.ring1 && eq.ring2) {
            maxHp += eq.helmet.hp + eq.armor.hp + eq.leftHand.hp + eq.rightHand.hp +
                     eq.gloves.hp + eq.boots.hp + eq.ring1.hp + eq.ring2.hp;
        }
    }

    // 敏捷：10敏捷 = 10防御 + 1闪避 + 0.5暴击率
    const defense = agi;
    const dodge = agi / 10;
    const critRate = agi / 20;

    // 智力：10智力 = 10法力 + 1法力恢复/回合 + 1.0法术伤害倍率
    const maxMp = int * 10;
    const mpRegen = int / 10;
    const spellDamage = 0.5 + int / 20; // 基础0.5，每10智力+0.5

    return {
        maxHp,
        defense,
        dodge,
        critRate,
        critDamage: 0.5, // 基础暴击伤害50%
        maxMp,
        mpRegen,
        spellDamage,
        attack: str * 0.5  // 力量：10力量 = 5攻击力
    };
}

// 计算总属性
export function getTotalStats() {
    const baseAttrs = calculateBaseAttributes();
    const eq = gameState.equipment;

    // 确保 ring2 存在
    if (!eq.ring2) {
        eq.ring2 = EQUIPMENT.rings[0];
    }

    // 装备属性加成
    let equipAttack = eq.helmet.attack + eq.armor.attack + eq.gloves.attack +
                     eq.boots.attack + eq.ring1.attack + (eq.ring2 ? eq.ring2.attack : 0);
    let equipDefense = eq.helmet.defense + eq.armor.defense + eq.gloves.defense +
                      eq.boots.defense + eq.ring1.defense + (eq.ring2 ? eq.ring2.defense : 0);
    let equipHp = eq.helmet.hp + eq.armor.hp + eq.gloves.hp +
                 eq.boots.hp + eq.ring1.hp + (eq.ring2 ? eq.ring2.hp : 0);
    let equipCritRate = eq.helmet.critRate + eq.armor.critRate + eq.gloves.critRate +
                       eq.boots.critRate + eq.ring1.critRate + (eq.ring2 ? eq.ring2.critRate : 0);
    let equipCritDamage = eq.helmet.critDamage + eq.armor.critDamage + eq.gloves.critDamage +
                         eq.boots.critDamage + eq.ring1.critDamage + (eq.ring2 ? eq.ring2.critDamage : 0);
    let equipDodge = eq.helmet.dodge + eq.armor.dodge + eq.gloves.dodge +
                    eq.boots.dodge + eq.ring1.dodge + (eq.ring2 ? eq.ring2.dodge : 0);
    let equipLifesteal = eq.helmet.lifesteal + eq.armor.lifesteal + eq.gloves.lifesteal +
                        eq.boots.lifesteal + eq.ring1.lifesteal + (eq.ring2 ? eq.ring2.lifesteal : 0);

    // 武器攻击力
    if (eq.leftHand) equipAttack += eq.leftHand.attack;
    if (eq.rightHand) equipAttack += eq.rightHand.attack;

    // 遗物加成
    gameState.artifacts.forEach(artifact => {
        switch (artifact.type) {
            case 'lifesteal':
                equipLifesteal += artifact.value;
                break;
            case 'dodge':
                equipDodge += artifact.value;
                break;
            case 'critRate':
                equipCritRate += artifact.value;
                break;
            case 'critDamage':
                equipCritDamage += artifact.value;
                break;
            case 'maxHp':
                equipHp += artifact.value;
                break;
            case 'penetration':
                gameState.penetration = (gameState.penetration || 0) + artifact.value;
                break;
            case 'critRateAndDamage':
                equipCritRate += artifact.value.rate;
                equipCritDamage += artifact.value.damage;
                break;
            case 'lifestealAndCrit':
                equipLifesteal += artifact.value.lifesteal;
                equipCritDamage += artifact.value.critDamage;
                break;
            case 'attackAndCrit':
                equipAttack += artifact.value.attack;
                equipCritRate += artifact.value.critRate;
                break;
            case 'dodgeAndHp':
                equipDodge += artifact.value.dodge;
                equipHp += artifact.value.maxHp;
                break;
        }
    });

    // 闪避上限
    if (equipDodge + baseAttrs.dodge > 75) equipDodge = 75 - baseAttrs.dodge;

    return {
        attack: baseAttrs.attack + equipAttack,
        defense: baseAttrs.defense + equipDefense,
        maxHp: baseAttrs.maxHp + equipHp,
        critRate: baseAttrs.critRate + equipCritRate,
        critDamage: baseAttrs.critDamage + equipCritDamage,
        dodge: baseAttrs.dodge + equipDodge,
        lifesteal: equipLifesteal || 0,
        maxMp: baseAttrs.maxMp,
        mpRegen: baseAttrs.mpRegen,
        spellDamage: baseAttrs.spellDamage + (gameState.spellDamage || 0) - 1.0
    };
}

export function updateGold(amount) {
    gameState.gold += amount;
    if (gameState.gold < 0) gameState.gold = 0;
    return gameState.gold;
}

export function updateHp(amount) {
    gameState.hp += amount;
    if (gameState.hp > gameState.maxHp) gameState.hp = gameState.maxHp;
    if (gameState.hp < 0) gameState.hp = 0;
    return gameState.hp;
}

// 计算防御减伤（有衰减）
export function calculateDamageReduction(defense) {
    return defense / (defense + 50); // 50防御时减伤50%，100防御时减伤66.7%
}

export function saveGame() {
    localStorage.setItem('roguelikeSave', JSON.stringify(gameState));
}

export function loadGame() {
    const saveData = localStorage.getItem('roguelikeSave');
    if (saveData) {
        gameState = JSON.parse(saveData);
        gameState.inBattle = false;
        gameState.monster = null;
        gameState.isAutoBattle = false;
        return true;
    }
    return false;
}

export function clearSave() {
    localStorage.removeItem('roguelikeSave');
}

// 装备物品（择优替换）
export function equipItem(item, slot) {
    const currentItem = gameState.equipment[slot];
    if (!currentItem) {
        gameState.equipment[slot] = item;
        return { replaced: false };
    }

    const scoreCurrent = calculateEquipmentScore(currentItem, gameState.floor);
    const scoreNew = calculateEquipmentScore(item, gameState.floor);

    if (scoreNew > scoreCurrent) {
        const improvement = ((scoreNew / scoreCurrent - 1) * 100).toFixed(1);
        gameState.equipment[slot] = item;
        return {
            replaced: true,
            oldItem: currentItem,
            improvement: improvement
        };
    }

    const decline = ((scoreCurrent / scoreNew - 1) * 100).toFixed(1);
    return {
        replaced: false,
        reason: `比当前装备弱 ${decline}%`
    };
}

// 添加遗物（累积叠加）
export function addArtifact(artifact) {
    gameState.artifacts.push(artifact);
    return gameState.artifacts.length;
}
