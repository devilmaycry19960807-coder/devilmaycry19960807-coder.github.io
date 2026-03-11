// 战斗系统
import { gameState, getTotalStats, updateHp, updateGold, calculateDamageReduction, equipItem, addArtifact, saveGame } from './gameState.js';
import { MONSTERS, ARTIFACTS } from './monsters.js';
import { EQUIPMENT } from './equipment.js';
import { GAME_CONFIG } from './config.js';
import { SPELLS, getSpellsByLevel } from './spells.js';
import { addLog } from './ui.js';

let monsterHp = 0;
let monsterMaxHp = 0;
let battleLog = [];
let activeBuffs = [];

// 获取装备掉落稀有度（根据楼层）
function getDropRarity(floor) {
    const roll = Math.random();

    if (floor <= 10) {
        if (roll < 0.80) return 'common';
        if (roll < 0.95) return 'uncommon';
        return 'rare';
    } else if (floor <= 30) {
        if (roll < 0.60) return 'common';
        if (roll < 0.90) return 'uncommon';
        if (roll < 0.99) return 'rare';
        return 'legendary';
    } else if (floor <= 60) {
        if (roll < 0.40) return 'common';
        if (roll < 0.80) return 'uncommon';
        if (roll < 0.98) return 'rare';
        return 'legendary';
    } else if (floor <= 100) {
        if (roll < 0.20) return 'common';
        if (roll < 0.70) return 'uncommon';
        if (roll < 0.95) return 'rare';
        return 'legendary';
    } else {
        if (roll < 0.10) return 'common';
        if (roll < 0.60) return 'uncommon';
        if (roll < 0.95) return 'rare';
        return 'legendary';
    }
}

export function generateMonster() {
    let pool;
    let type;

    // 每10层必定是BOSS
    if (gameState.floor % 10 === 0) {
        pool = MONSTERS.boss;
        type = 'boss';
    } else {
        // 其他楼层随机出现普通怪或精英怪
        const roll = Math.random();
        if (roll < GAME_CONFIG.ELITE_SPAWN_RATE) {
            pool = MONSTERS.elite;
            type = 'elite';
        } else {
            pool = MONSTERS.normal;
            type = 'normal';
        }
    }

    const template = pool[Math.floor(Math.random() * pool.length)];
    const floorMultiplier = 1 + (gameState.floor - 1) * GAME_CONFIG.FLOOR_MULTIPLIER;

    return {
        ...template,
        hp: Math.floor(template.hp * floorMultiplier),
        maxHp: Math.floor(template.hp * floorMultiplier),
        attack: Math.floor(template.attack * floorMultiplier),
        defense: Math.floor(template.defense * floorMultiplier),
        gold: Math.floor(template.gold * floorMultiplier),
        exp: Math.floor((template.exp || 10) * floorMultiplier),
        type: type
    };
}

export function startBattle(monster) {
    gameState.inBattle = true;
    gameState.monster = monster;
    monsterHp = monster.hp;
    monsterMaxHp = monster.maxHp;
    battleLog = [];
    activeBuffs = [];

    // 更新玩家属性
    const stats = getTotalStats();
    gameState.maxHp = stats.maxHp;
    gameState.maxMp = stats.maxMp;
    gameState.mpRegen = stats.mpRegen;

    // 确保血量不超过新的最大值
    if (gameState.hp > gameState.maxHp) gameState.hp = gameState.maxHp;
    if (gameState.mp > gameState.maxMp) gameState.mp = gameState.maxMp;

    return monster;
}

export function getMonsterStats() {
    if (!gameState.monster) return null;
    return {
        name: gameState.monster.name,
        emoji: gameState.monster.emoji,
        attack: gameState.monster.attack,
        defense: gameState.monster.defense,
        hp: monsterHp,
        maxHp: monsterMaxHp,
        type: gameState.monster.type,
        description: gameState.monster.description,
        title: gameState.monster.title
    };
}

export function getBattleLog() {
    return battleLog;
}

// 随机获取战斗文本
function getRandomBattleText(type) {
    const texts = GAME_CONFIG.BATTLE_TEXTS[type];
    return texts[Math.floor(Math.random() * texts.length)];
}

// 玩家攻击（普通攻击）
export function playerAttack() {
    return attackMonster(false);
}

// 使用法术攻击
export function castSpellAttack(spellId) {
    const spell = SPELLS.find(s => s.id === spellId);
    if (!spell) return { success: false, message: '法术不存在' };
    if (!gameState.spells.some(s => s.id === spellId)) {
        return { success: false, message: '尚未学会这个法术' };
    }
    if (gameState.mp < spell.mpCost) {
        return { success: false, message: `法力不足！需要 ${spell.mpCost} 法力` };
    }

    // 消耗法力
    gameState.mp -= spell.mpCost;

    // 使用法术攻击
    const stats = getTotalStats();
    const monster = gameState.monster;

    let damage = 0;
    let message = '';

    if (spell.type === 'attack') {
        // 攻击法术
        damage = Math.floor(spell.baseDamage * stats.spellDamage);
        damage = Math.max(1, damage - monster.defense);

        // 法术暴击
        const isCrit = Math.random() * 100 < (stats.critRate + (spell.critBonus || 0) * 100);
        if (isCrit) {
            damage = Math.floor(damage * (1 + stats.critDamage));
        }

        monsterHp -= damage;
        message = `${spell.icon} 你释放了【${spell.name}】，对${monster.emoji}${monster.name}造成了 <span style="color: #ef4444;">${damage}</span> 点法术伤害！`;
    } else if (spell.type === 'heal') {
        // 治疗法术
        const healAmount = Math.floor(spell.baseHeal * stats.spellDamage);
        updateHp(healAmount);
        message = `${spell.icon} 你释放了【${spell.name}】，恢复了 <span style="color: #22c55e;">${healAmount}</span> 点生命值！`;
    } else if (spell.type === 'buff') {
        // 增益法术
        activeBuffs.push({
            type: spell.buffType,
            value: spell.buffValue,
            duration: spell.buffDuration
        });
        message = `${spell.icon} 你释放了【${spell.name}】，获得了${spell.buffValue}${spell.buffType === 'defense' ? '防御' : spell.buffType === 'dodge' ? '闪避' : '攻击'}提升！持续${spell.buffDuration}回合`;
    }

    battleLog.push({ type: 'spell', message, damage: spell.type === 'attack' ? damage : 0 });

    // 检查怪物是否死亡
    if (monsterHp <= 0 && spell.type === 'attack') {
        monsterHp = 0;
        return { success: true, monsterDead: true, battleLog };
    }

    // 怪物反击
    monsterAttack();

    return { success: true, monsterDead: false, battleLog };
}

// 普通攻击
function attackMonster() {
    if (!gameState.inBattle || !gameState.monster) return { success: false, message: '不在战斗中' };

    const stats = getTotalStats();
    const monster = gameState.monster;
    const weapon = gameState.equipment.leftHand?.type === 'twoHand' ? gameState.equipment.leftHand : gameState.equipment.leftHand;

    // 自动触发攻击法术（最高级攻击法术）
    autoCastAttackSpell(stats, monster);

    // 检查主动buff
    let attackBonus = 0;
    activeBuffs = activeBuffs.filter(buff => {
        if (buff.type === 'attack') attackBonus += buff.value;
        buff.duration--;
        return buff.duration > 0;
    });

    // 计算基础伤害
    let damage = Math.max(1, (stats.attack + attackBonus) - monster.defense + (gameState.penetration || 0));

    // 判断暴击
    const isCrit = Math.random() * 100 < stats.critRate;
    if (isCrit) {
        damage = Math.floor(damage * (1 + stats.critDamage));
    }

    monsterHp -= damage;

    // 生成战斗文本
    let message;
    if (isCrit) {
        message = getRandomBattleText('playerCrit')
            .replace('{weapon}', weapon?.name || '武器')
            .replace('{monster}', monster.name);
    } else {
        message = getRandomBattleText('playerAttack')
            .replace('{weapon}', weapon?.name || '武器')
            .replace('{monster}', monster.name);
    }

    message += ` 对${monster.emoji}${monster.name}造成了 <span style="color: ${isCrit ? '#eab308' : '#22c55e'}">${damage}</span> 点伤害！`;
    battleLog.push({ type: 'playerAttack', message, damage, isCrit });

    // 吸血效果
    if (stats.lifesteal > 0 && damage > 0) {
        const healAmount = Math.floor(damage * stats.lifesteal);
        if (healAmount > 0) {
            updateHp(healAmount);
            const lifestealText = getRandomBattleText('lifesteal');
            battleLog.push({ type: 'lifesteal', message: `${lifestealText} 回复了 ${healAmount} 生命值！`, healAmount });
        }
    }

    // 检查怪物是否死亡
    if (monsterHp <= 0) {
        monsterHp = 0;
        return { success: true, monsterDead: true, battleLog };
    }

    // 怪物反击
    monsterAttack();

    return { success: true, monsterDead: false, battleLog };
}

// 怪物攻击
export function monsterAttack() {
    if (!gameState.inBattle || !gameState.monster) return;

    const stats = getTotalStats();
    const monster = gameState.monster;

    // 检查主动buff
    let defenseBonus = 0;
    let dodgeBonus = 0;
    activeBuffs = activeBuffs.filter(buff => {
        if (buff.type === 'defense') defenseBonus += buff.value;
        if (buff.type === 'dodge') dodgeBonus += buff.value;
        buff.duration--;
        return buff.duration > 0;
    });

    // 闪避判定
    const isDodged = Math.random() * 100 < (stats.dodge + dodgeBonus);

    if (isDodged) {
        const message = getRandomBattleText('playerDodge').replace('{monster}', monster.emoji + monster.name);
        battleLog.push({ type: 'dodge', message, dodged: true });
        return;
    }

    // 计算伤害
    const defense = stats.defense + defenseBonus;
    const damageReduction = calculateDamageReduction(defense);
    const baseDamage = monster.attack;
    const damage = Math.max(1, Math.floor(baseDamage * (1 - damageReduction)));

    updateHp(-damage);

    // 生成战斗文本
    const message = getRandomBattleText('monsterAttack').replace('{monster}', monster.emoji + monster.name);
    battleLog.push({
        type: 'monsterAttack',
        message: `${message} 对你造成了 <span style="color: #ef4444">${damage}</span> 点伤害！`,
        damage,
        isDodged: false
    });

    // 自动触发治疗法术（血量低于50%时）
    autoCastHealSpell(stats);

    // 法力恢复（每回合）
    const mpRegen = stats.mpRegen;
    if (mpRegen > 0) {
        gameState.mp = Math.min(gameState.maxMp, gameState.mp + mpRegen);
    }

    return { playerDead: gameState.hp <= 0 };
}

// 自动触发攻击法术
function autoCastAttackSpell(stats, monster) {
    if (!gameState.spells || gameState.spells.length === 0) return;

    // 找到最高级的攻击法术
    const attackSpells = gameState.spells.filter(s => s.type === 'attack').sort((a, b) => b.level - a.level);

    if (attackSpells.length === 0) return;

    const bestSpell = attackSpells[0];

    // 检查法力是否足够
    if (gameState.mp < bestSpell.mpCost) return;

    // 消耗法力
    gameState.mp -= bestSpell.mpCost;

    // 计算法术伤害
    let spellDamage = Math.floor(bestSpell.baseDamage * stats.spellDamage);
    spellDamage = Math.max(1, spellDamage - monster.defense);

    // 法术暴击
    const isCrit = Math.random() * 100 < (stats.critRate + (bestSpell.critBonus || 0) * 100);
    if (isCrit) {
        spellDamage = Math.floor(spellDamage * (1 + stats.critDamage));
    }

    monsterHp -= spellDamage;

    const spellMessage = `${bestSpell.icon} 自动释放【${bestSpell.name}】，造成 <span style="color: #ef4444;">${spellDamage}</span> 点法术伤害！`;
    battleLog.push({ type: 'spell', message: spellMessage, damage: spellDamage });
}

// 自动触发治疗法术
function autoCastHealSpell(stats) {
    if (!gameState.spells || gameState.spells.length === 0) return;

    // 血量低于50%才触发
    if (gameState.hp >= gameState.maxHp * 0.5) return;

    // 找到最高级的治疗法术
    const healSpells = gameState.spells.filter(s => s.type === 'heal').sort((a, b) => b.level - a.level);

    if (healSpells.length === 0) return;

    const bestSpell = healSpells[0];

    // 检查法力是否足够
    if (gameState.mp < bestSpell.mpCost) return;

    // 消耗法力
    gameState.mp -= bestSpell.mpCost;

    // 计算治疗量
    const healAmount = Math.floor(bestSpell.baseHeal * stats.spellDamage);
    updateHp(healAmount);

    const spellMessage = `${bestSpell.icon} 自动释放【${bestSpell.name}】，恢复 <span style="color: #22c55e;">${healAmount}</span> 点生命值！`;
    battleLog.push({ type: 'spell', message: spellMessage, heal: healAmount });
}

// 战斗胜利
export function winBattle() {
    const monster = gameState.monster;
    updateGold(monster.gold);

    const result = {
        gold: monster.gold,
        type: monster.type,
        droppedEquipment: null,
        droppedArtifact: null
    };

    // BOSS和精英掉落装备
    if ((monster.type === 'boss' || monster.type === 'elite') && Math.random() < GAME_CONFIG.BOSS_ITEM_DROP_RATE) {
        // 随机选择装备类型
        const slotTypes = ['helmets', 'armors', 'oneHandWeapons', 'twoHandWeapons', 'gloves', 'boots', 'necklaces', 'rings'];
        const slotType = slotTypes[Math.floor(Math.random() * slotTypes.length)];

        // 根据楼层筛选稀有度
        const minRarity = getDropRarity(gameState.floor);
        let pool = EQUIPMENT[slotType].filter(item => {
            if (minRarity === 'legendary') return true;
            if (minRarity === 'rare') return item.rarity !== 'legendary';
            if (minRarity === 'uncommon') return item.rarity === 'common' || item.rarity === 'uncommon';
            return item.rarity === 'common';
        });

        // 30%概率提升一个稀有度（BOSS/精英必有好东西）
        if (Math.random() < 0.3) {
            pool = EQUIPMENT[slotType].filter(item => item.price > 0);
        }

        if (pool.length > 0) {
            const item = pool[Math.floor(Math.random() * pool.length)];

            // 检查是否双手武器
            if (item.type === 'twoHand') {
                const equipResult = equipItem(item, 'leftHand');
                gameState.equipment.rightHand = null; // 双手武器清空右手

                if (equipResult.replaced) {
                    result.droppedEquipment = item;
                    if (equipResult.improvement) {
                        result.improvement = equipResult.improvement;
                    }
                } else if (equipResult.reason) {
                    result.equipReason = equipResult.reason;
                }
            } else {
                // 单手武器需要指定槽位
                let slot = item.type;
                if (slot === 'oneHand') {
                    // 选择装备到左手或右手
                    const leftHand = gameState.equipment.leftHand;
                    const rightHand = gameState.equipment.rightHand;

                    if (!leftHand || leftHand.type === 'twoHand') {
                        const equipResult = equipItem(item, 'leftHand');
                        if (equipResult.replaced) {
                            result.droppedEquipment = item;
                            if (equipResult.improvement) {
                                result.improvement = equipResult.improvement;
                            }
                        }
                    } else if (!rightHand || rightHand.type === 'twoHand') {
                        const equipResult = equipItem(item, 'rightHand');
                        if (equipResult.replaced) {
                            result.droppedEquipment = item;
                            if (equipResult.improvement) {
                                result.improvement = equipResult.improvement;
                            }
                        }
                    } else {
                        // 都有单手武器，选一个替换
                        const useLeft = Math.random() < 0.5;
                        const equipResult = equipItem(item, useLeft ? 'leftHand' : 'rightHand');
                        if (equipResult.replaced) {
                            result.droppedEquipment = item;
                            if (equipResult.improvement) {
                                result.improvement = equipResult.improvement;
                            }
                        }
                    }
                } else {
                    const equipResult = equipItem(item, slot);
                    if (equipResult.replaced) {
                        result.droppedEquipment = item;
                        if (equipResult.improvement) {
                            result.improvement = equipResult.improvement;
                        }
                    }
                }
            }
        }
    }

    // BOSS掉落遗物
    if (monster.type === 'boss' && Math.random() < GAME_CONFIG.BOSS_ARTIFACT_DROP_RATE) {
        const artifact = ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];
        addArtifact(artifact);
        result.droppedArtifact = artifact;
    }

    // 获得经验并检查升级
    const expGain = monster.exp || 10;
    gameState.exp += expGain;
    result.exp = expGain;

    // 检查升级
    while (gameState.exp >= gameState.expToLevel) {
        gameState.exp -= gameState.expToLevel;
        gameState.level++;
        gameState.expToLevel = Math.floor(gameState.expToLevel * 1.5);

        // 升级提升三大基础属性
        gameState.strength += 2;
        gameState.agility += 2;
        gameState.intelligence += 2;

        // 检查是否学会新法术
        const newSpells = getSpellsByLevel(gameState.level).filter(
            s => !gameState.spells.some(learned => learned.id === s.id)
        );
        if (newSpells.length > 0) {
            newSpells.forEach(spell => gameState.spells.push(spell));
            result.newSpells = newSpells.map(s => s.name);
        }

        result.levelUp = true;
        result.newLevel = gameState.level;
    }

    // 进入下一层
    gameState.floor++;
    if (gameState.floor > gameState.maxFloor) {
        gameState.maxFloor = gameState.floor;
    }

    gameState.inBattle = false;
    gameState.monster = null;
    battleLog = [];
    activeBuffs = [];

    // 恢复法力到满
    gameState.mp = gameState.maxMp;

    // 清理冒险日志，每下一层刷新
    addLog(`📍 进入第 ${gameState.floor} 层`, 'floor');
    
    // 自动存档
    saveGame();

    return result;
}

export function fleeBattle() {
    if (!gameState.inBattle) return { success: false, message: '不在战斗中' };

    if (gameState.monster.type === 'boss') {
        battleLog.push({ type: 'info', message: '无法逃离BOSS战！' });
        monsterAttack();
        return { success: false, message: '无法逃离BOSS战！', attack: true, battleLog };
    }

    if (Math.random() < GAME_CONFIG.FLEE_CHANCE) {
        gameState.inBattle = false;
        gameState.monster = null;
        battleLog = [];
        return { success: true, message: '成功逃脱了！' };
    }

    battleLog.push({ type: 'info', message: '逃跑失败！' });
    monsterAttack();
    return { success: false, message: '逃跑失败！', attack: true, battleLog };
}

export function isInBattle() {
    return gameState.inBattle;
}

export function toggleAutoBattle() {
    gameState.isAutoBattle = !gameState.isAutoBattle;
    return gameState.isAutoBattle;
}
