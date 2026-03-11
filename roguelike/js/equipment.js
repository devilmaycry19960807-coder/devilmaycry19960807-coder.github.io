// 装备数据
export const EQUIPMENT = {
    helmets: [
        { name: '粗制皮帽', type: 'helmet', attack: 0, defense: 5, hp: 0, critRate: 0, critDamage: 0, dodge: 0, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '精铁头盔', type: 'helmet', attack: 2, defense: 12, hp: 15, critRate: 0, critDamage: 0, dodge: 0, lifesteal: 0, rarity: 'common', price: 50 },
        { name: '秘银头冠', type: 'helmet', attack: 5, defense: 18, hp: 30, critRate: 2, critDamage: 0, dodge: 1, lifesteal: 0, rarity: 'uncommon', price: 150 },
        { name: '龙鳞护盔', type: 'helmet', attack: 8, defense: 25, hp: 50, critRate: 3, critDamage: 0.10, dodge: 2, lifesteal: 0.02, rarity: 'rare', price: 400 },
        { name: '王者冕冠', type: 'helmet', attack: 12, defense: 35, hp: 80, critRate: 5, critDamage: 0.15, dodge: 3, lifesteal: 0.03, rarity: 'legendary', price: 1000 }
    ],
    armors: [
        { name: '破旧布衣', type: 'armor', attack: 0, defense: 8, hp: 10, critRate: 0, critDamage: 0, dodge: 0, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '锁子甲', type: 'armor', attack: 1, defense: 15, hp: 25, critRate: 0, critDamage: 0, dodge: 0, lifesteal: 0, rarity: 'common', price: 60 },
        { name: '秘银战甲', type: 'armor', attack: 3, defense: 25, hp: 50, critRate: 1, critDamage: 0, dodge: 1, lifesteal: 0, rarity: 'uncommon', price: 180 },
        { name: '龙鳞铠甲', type: 'armor', attack: 6, defense: 38, hp: 80, critRate: 2, critDamage: 0.10, dodge: 2, lifesteal: 0.02, rarity: 'rare', price: 500 },
        { name: '神圣圣甲', type: 'armor', attack: 10, defense: 50, hp: 120, critRate: 4, critDamage: 0.20, dodge: 3, lifesteal: 0.04, rarity: 'legendary', price: 1200 }
    ],
    oneHandWeapons: [
        { name: '生锈的铁剑', type: 'oneHand', attack: 8, defense: 0, hp: 0, critRate: 2, critDamage: 0.10, dodge: 0, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '精钢长剑', type: 'oneHand', attack: 18, defense: 0, hp: 0, critRate: 4, critDamage: 0.15, dodge: 0, lifesteal: 0.02, rarity: 'common', price: 70 },
        { name: '暗影之刃', type: 'oneHand', attack: 28, defense: 2, hp: 0, critRate: 6, critDamage: 0.25, dodge: 2, lifesteal: 0.03, rarity: 'uncommon', price: 200 },
        { name: '龙骨利刃', type: 'oneHand', attack: 40, defense: 3, hp: 10, critRate: 8, critDamage: 0.35, dodge: 3, lifesteal: 0.05, rarity: 'rare', price: 600 },
        { name: '传说神剑·阿瓦隆', type: 'oneHand', attack: 60, defense: 5, hp: 20, critRate: 12, critDamage: 0.50, dodge: 4, lifesteal: 0.08, rarity: 'legendary', price: 1500 }
    ],
    twoHandWeapons: [
        { name: '粗糙战斧', type: 'twoHand', attack: 15, defense: -2, hp: 0, critRate: 3, critDamage: 0.20, dodge: -1, lifesteal: 0, rarity: 'common', price: 50 },
        { name: '巨剑·碎星', type: 'twoHand', attack: 35, defense: -3, hp: 10, critRate: 5, critDamage: 0.30, dodge: -2, lifesteal: 0.03, rarity: 'uncommon', price: 180 },
        { name: '战锤·雷霆', type: 'twoHand', attack: 55, defense: -5, hp: 20, critRate: 7, critDamage: 0.40, dodge: -3, lifesteal: 0.05, rarity: 'rare', price: 550 },
        { name: '长枪·破晓', type: 'twoHand', attack: 75, defense: -6, hp: 30, critRate: 9, critDamage: 0.50, dodge: -4, lifesteal: 0.07, rarity: 'legendary', price: 1400 },
        { name: '圣剑·Excalibur', type: 'twoHand', attack: 100, defense: -8, hp: 50, critRate: 12, critDamage: 0.65, dodge: -5, lifesteal: 0.10, rarity: 'legendary', price: 2000 }
    ],
    gloves: [
        { name: '破旧手套', type: 'gloves', attack: 1, defense: 2, hp: 5, critRate: 1, critDamage: 0, dodge: 0, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '精铁护手', type: 'gloves', attack: 4, defense: 6, hp: 10, critRate: 2, critDamage: 0.05, dodge: 0, lifesteal: 0, rarity: 'common', price: 40 },
        { name: '暗影手套', type: 'gloves', attack: 7, defense: 10, hp: 20, critRate: 4, critDamage: 0.15, dodge: 1, lifesteal: 0.02, rarity: 'uncommon', price: 120 },
        { name: '龙鳞护手', type: 'gloves', attack: 12, defense: 18, hp: 35, critRate: 6, critDamage: 0.20, dodge: 2, lifesteal: 0.04, rarity: 'rare', price: 350 },
        { name: '力量之握', type: 'gloves', attack: 18, defense: 25, hp: 50, critRate: 8, critDamage: 0.30, dodge: 3, lifesteal: 0.06, rarity: 'legendary', price: 900 }
    ],
    boots: [
        { name: '破旧布鞋', type: 'boots', attack: 0, defense: 2, hp: 5, critRate: 0, critDamage: 0, dodge: 2, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '皮革靴', type: 'boots', attack: 1, defense: 5, hp: 10, critRate: 0, critDamage: 0, dodge: 4, lifesteal: 0, rarity: 'common', price: 45 },
        { name: '迅捷之靴', type: 'boots', attack: 2, defense: 8, hp: 15, critRate: 1, critDamage: 0, dodge: 8, lifesteal: 0, rarity: 'uncommon', price: 130 },
        { name: '暗影之靴', type: 'boots', attack: 4, defense: 12, hp: 25, critRate: 2, critDamage: 0, dodge: 12, lifesteal: 0.02, rarity: 'rare', price: 380 },
        { name: '风神之翼', type: 'boots', attack: 6, defense: 18, hp: 40, critRate: 3, critDamage: 0.10, dodge: 18, lifesteal: 0.03, rarity: 'legendary', price: 950 }
    ],
    necklaces: [
        { name: '破旧项链', type: 'necklace', attack: 2, defense: 1, hp: 10, critRate: 0, critDamage: 0.10, dodge: 0, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '秘银项链', type: 'necklace', attack: 5, defense: 3, hp: 20, critRate: 1, critDamage: 0.15, dodge: 0, lifesteal: 0, rarity: 'common', price: 60 },
        { name: '龙鳞吊坠', type: 'necklace', attack: 8, defense: 5, hp: 30, critRate: 2, critDamage: 0.20, dodge: 1, lifesteal: 0.02, rarity: 'uncommon', price: 150 },
        { name: '守护之心', type: 'necklace', attack: 12, defense: 8, hp: 50, critRate: 3, critDamage: 0.25, dodge: 2, lifesteal: 0.03, rarity: 'rare', price: 450 },
        { name: '灵魂之石', type: 'necklace', attack: 18, defense: 12, hp: 80, critRate: 4, critDamage: 0.35, dodge: 3, lifesteal: 0.05, rarity: 'legendary', price: 1100 }
    ],
    rings: [
        { name: '生锈铁环', type: 'ring', attack: 2, defense: 1, hp: 5, critRate: 1, critDamage: 0, dodge: 0, lifesteal: 0, rarity: 'common', price: 0 },
        { name: '力量戒指', type: 'ring', attack: 5, defense: 2, hp: 10, critRate: 2, critDamage: 0.10, dodge: 0, lifesteal: 0, rarity: 'common', price: 55 },
        { name: '暗影之戒', type: 'ring', attack: 8, defense: 4, hp: 15, critRate: 3, critDamage: 0.15, dodge: 2, lifesteal: 0.02, rarity: 'uncommon', price: 140 },
        { name: '龙鳞戒指', type: 'ring', attack: 12, defense: 7, hp: 25, critRate: 4, critDamage: 0.20, dodge: 3, lifesteal: 0.04, rarity: 'rare', price: 400 },
        { name: '永恒指环', type: 'ring', attack: 16, defense: 10, hp: 40, critRate: 5, critDamage: 0.25, dodge: 4, lifesteal: 0.05, rarity: 'legendary', price: 1000 }
    ]
};

// 装备稀有度颜色
export const RARITY_COLORS = {
    common: '#9ca3af',      // 灰色
    uncommon: '#22c55e',    // 绿色
    rare: '#3b82f6',        // 蓝色
    legendary: '#eab308'    // 金色
};

// 装备稀有度名称
export const RARITY_NAMES = {
    common: '普通',
    uncommon: '优秀',
    rare: '稀有',
    legendary: '传说'
};

// 装备评分函数（隐藏评分，用于自动择优替换）
export function calculateEquipmentScore(item, floor = 1) {
    let score = 0;

    // 楼层权重（深层掉落更强）
    const floorMultiplier = 1 + (floor / 200);

    // 基础属性
    score += (item.attack || 0) * 2 * floorMultiplier;
    score += (item.defense || 0) * 1.5 * floorMultiplier;
    score += (item.hp || 0) * 0.15 * floorMultiplier;

    // 高级属性（更高价值）
    score += (item.critRate || 0) * 12;
    score += (item.critDamage || 0) * 250;
    score += (item.dodge || 0) * 18;
    score += (item.lifesteal || 0) * 350; // 吸血最值钱

    // 稀有度加成
    const rarityBonus = {
        common: 1,
        uncommon: 1.4,
        rare: 1.8,
        legendary: 2.5
    };
    score *= rarityBonus[item.rarity];

    return Math.floor(score);
}
