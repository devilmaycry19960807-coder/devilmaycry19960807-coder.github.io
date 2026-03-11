// 法术系统
import { gameState } from './gameState.js';

export const SPELLS = [
    {
        id: 'fireball',
        name: '火球术',
        description: '投掷火球造成伤害',
        type: 'attack',
        baseDamage: 25,
        mpCost: 15,
        levelReq: 1,
        icon: '🔥'
    },
    {
        id: 'ice_spike',
        name: '冰刺',
        description: '发射冰刺穿透敌人',
        type: 'attack',
        baseDamage: 20,
        mpCost: 12,
        levelReq: 1,
        icon: '❄️',
        penetration: 5
    },
    {
        id: 'lightning',
        name: '闪电链',
        description: '召唤闪电攻击敌人',
        type: 'attack',
        baseDamage: 30,
        mpCost: 20,
        levelReq: 2,
        icon: '⚡',
        critBonus: 0.2
    },
    {
        id: 'heal',
        name: '治疗术',
        description: '恢复生命值',
        type: 'heal',
        baseHeal: 40,
        mpCost: 25,
        levelReq: 3,
        icon: '💚'
    },
    {
        id: 'shield',
        name: '魔法护盾',
        description: '临时增加防御力',
        type: 'buff',
        buffType: 'defense',
        buffValue: 15,
        buffDuration: 3,
        mpCost: 18,
        levelReq: 3,
        icon: '🛡️'
    },
    {
        id: 'explosion',
        name: '火焰爆裂',
        description: '造成大量范围伤害',
        type: 'attack',
        baseDamage: 50,
        mpCost: 35,
        levelReq: 5,
        icon: '💥',
        aoe: true
    },
    {
        id: 'meteor',
        name: '陨石坠落',
        description: '召唤陨石毁灭敌人',
        type: 'attack',
        baseDamage: 80,
        mpCost: 50,
        levelReq: 8,
        icon: '☄️'
    },
    {
        id: 'divine_heal',
        name: '圣光治疗',
        description: '大量恢复生命值',
        type: 'heal',
        baseHeal: 100,
        mpCost: 40,
        levelReq: 6,
        icon: '✨'
    },
    {
        id: 'blink',
        name: '闪现',
        description: '提高闪避率',
        type: 'buff',
        buffType: 'dodge',
        buffValue: 20,
        buffDuration: 2,
        mpCost: 15,
        levelReq: 4,
        icon: '💨'
    },
    {
        id: 'power_up',
        name: '力量增幅',
        description: '提高攻击力',
        type: 'buff',
        buffType: 'attack',
        buffValue: 20,
        buffDuration: 3,
        mpCost: 20,
        levelReq: 5,
        icon: '💪'
    }
];

// 按等级获取可用法术
export function getSpellsByLevel(level) {
    return SPELLS.filter(spell => spell.levelReq <= level);
}

// 法力消耗
export function castSpell(spellId) {
    const spell = SPELLS.find(s => s.id === spellId);
    if (!spell) return { success: false, message: '法术不存在' };

    if (gameState.mp < spell.mpCost) {
        return { success: false, message: `法力不足！需要 ${spell.mpCost} 法力` };
    }

    gameState.mp -= spell.mpCost;
    return { success: true, spell: spell };
}

// 学习法术
export function learnSpell(spellId) {
    const spell = SPELLS.find(s => s.id === spellId);
    if (!spell) return { success: false, message: '法术不存在' };

    if (gameState.level < spell.levelReq) {
        return { success: false, message: `等级不足！需要 ${spell.levelReq} 级` };
    }

    if (gameState.spells.some(s => s.id === spellId)) {
        return { success: false, message: '已经学会这个法术' };
    }

    gameState.spells.push(spell);
    return { success: true, spell: spell };
}
