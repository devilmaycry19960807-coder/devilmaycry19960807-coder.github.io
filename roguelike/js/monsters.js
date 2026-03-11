// 怪物数据（前50层难度大幅降低，90%几率平稳度过）
export const MONSTERS = {
    normal: [
        { name: '深渊魔鼠', emoji: '🐀', hp: 15, attack: 2, defense: 0, gold: 3, exp: 15, description: '来自深渊的变异老鼠' },
        { name: '暗影蜘蛛', emoji: '🕷️', hp: 18, attack: 3, defense: 1, gold: 4, exp: 20, description: '在黑暗中织网的猎手' },
        { name: '腐烂僵尸', emoji: '🧟', hp: 20, attack: 3, defense: 1, gold: 5, exp: 25, description: '被诅咒复活的亡灵' },
        { name: '骨矛守卫', emoji: '💀', hp: 22, attack: 3, defense: 2, gold: 6, exp: 30, description: '手持骨矛的骷髅战士' },
        { name: '虚空行者', emoji: '👻', hp: 20, attack: 4, defense: 1, gold: 7, exp: 35, description: '在空间裂缝中游荡的幽灵' },
        { name: '熔岩史莱姆', emoji: '🔥', hp: 25, attack: 2, defense: 2, gold: 5, exp: 28, description: '流淌着岩浆的粘液生物' }
    ],
    elite: [
        { name: '深渊领主之影', emoji: '👿', hp: 50, attack: 8, defense: 4, gold: 15, exp: 60, description: '领主的黑暗投影' },
        { name: '死亡骑士', emoji: '⚔️', hp: 55, attack: 9, defense: 5, gold: 18, exp: 70, description: '被诅咒的不死骑士' },
        { name: '暗炎魔像', emoji: '🗿', hp: 60, attack: 7, defense: 6, gold: 16, exp: 65, description: '由暗黑元素凝聚的守护者' },
        { name: '虚空吞噬者', emoji: '🌀', hp: 45, attack: 11, defense: 3, gold: 20, exp: 75, description: '能够吞噬一切的虚空生物' }
    ],
    boss: [
        { name: '·深渊魔王·索拉瑞斯', emoji: '👹', hp: 80, attack: 8, defense: 3, gold: 50, exp: 200, description: '统治深渊的魔王', title: '深渊魔王' },
        { name: '·永恒守卫·阿瑞斯', emoji: '🛡️', hp: 90, attack: 7, defense: 4, gold: 55, exp: 220, description: '守卫上古封印的永恒骑士', title: '永恒守卫' },
        { name: '·虚空之主·泽拉图', emoji: '👁️', hp: 75, attack: 9, defense: 2, gold: 60, exp: 250, description: '窥视真实与虚空的神秘存在', title: '虚空之主' },
        { name: '·炎龙之王·伊格尼斯', emoji: '🐉', hp: 100, attack: 8, defense: 4, gold: 70, exp: 280, description: '燃烧着永恒之火的古龙', title: '炎龙之王' },
        { name: '·死亡女神·海拉', emoji: '💀', hp: 85, attack: 10, defense: 3, gold: 75, exp: 300, description: '掌管死亡的神秘女神', title: '死亡女神' }
    ]
};

// 遗物数据
export const ARTIFACTS = [
    { name: '吸血鬼之牙', description: '攻击时回复攻击伤害5%的生命值', type: 'lifesteal', value: 0.05, rarity: 'common' },
    { name: '暗影斗篷', description: '闪避率+3%', type: 'dodge', value: 3, rarity: 'common' },
    { name: '致命之眼', description: '暴击率+4%', type: 'critRate', value: 4, rarity: 'common' },
    { name: '狂战之血', description: '暴击伤害+20%', type: 'critDamage', value: 0.20, rarity: 'uncommon' },
    { name: '不朽之心', description: '最大生命值+20', type: 'maxHp', value: 20, rarity: 'uncommon' },
    { name: '破法者护符', description: '忽视敌人5点防御', type: 'penetration', value: 5, rarity: 'uncommon' },
    { name: '暗夜之影', description: '闪避率+5%', type: 'dodge', value: 5, rarity: 'rare' },
    { name: '狂暴宝石', description: '暴击率+6%，暴击伤害+25%', type: 'critRateAndDamage', value: { rate: 6, damage: 0.25 }, rarity: 'rare' },
    { name: '生命之泉圣水', description: '最大生命值+50', type: 'maxHp', value: 50, rarity: 'rare' },
    { name: '虚空之核', description: '无视敌人防御+8点', type: 'penetration', value: 8, rarity: 'rare' },
    { name: '深渊之血', description: '吸血+8%，暴击伤害+30%', type: 'lifestealAndCrit', value: { lifesteal: 0.08, critDamage: 0.30 }, rarity: 'legendary' },
    { name: '死神之镰碎片', description: '攻击力+10，暴击率+8%', type: 'attackAndCrit', value: { attack: 10, critRate: 8 }, rarity: 'legendary' },
    { name: '永恒之盾', description: '闪避率+10，最大生命值+100', type: 'dodgeAndHp', value: { dodge: 10, maxHp: 100 }, rarity: 'legendary' }
];
