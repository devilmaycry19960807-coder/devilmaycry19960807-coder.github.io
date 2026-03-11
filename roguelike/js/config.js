// 游戏配置
export const GAME_CONFIG = {
    HEAL_COST: 50,
    HEAL_PERCENT: 0.3,
    FLEE_CHANCE: 0.7,
    FLOOR_MULTIPLIER: 0.18,  // 每层怪物数值提升18%
    UPGRADE_CHANCE: 0.1,
    BOSS_ITEM_DROP_RATE: 0.9,
    BOSS_ARTIFACT_DROP_RATE: 0.5,
    BOSS_SPAWN_RATE: 0.05,
    ELITE_SPAWN_RATE: 0.15,
    MONSTER_SPAWN_RATE: 0.7,
    CHEST_SPAWN_RATE: 0.1,
    FOUNTAIN_SPAWN_RATE: 0.1,
    SHOP_MULTIPLIER: 1.5,
    
    // 属性衰减系数（护甲）
    ARMOR_DIMINISHING: 0.85,
    
    // 闪避上限
    MAX_DODGE: 75,
    
    // 战斗描述模板
    BATTLE_TEXTS: {
        playerAttack: [
            "你挥舞着{weapon}狠狠地砸向{monster}！",
            "你猛地跃起，{weapon}带着呼啸声劈向{monster}！",
            "你灵巧地闪避反击，{weapon}精准地刺向{monster}的要害！",
            "你怒吼一声，{weapon}爆发出耀眼的光芒！",
            "你如闪电般冲向{monster}，{weapon}划破空气！"
        ],
        playerCrit: [
            "⚡ 暴击！{weapon}击中了{monster}的弱点，造成了致命伤害！",
            "💥 完美的一击！{weapon}撕裂了{monster}的防御！",
            "🔥 致命一击！{weapon}带着毁灭性的力量轰在{monster}身上！"
        ],
        monsterAttack: [
            "{monster}发出一声咆哮，向你扑来！",
            "{monster}张开大嘴，露出了锋利的牙齿！",
            "{monster}挥舞着爪子，狠狠地抓向你！",
            "{monster}从背后偷袭，想要给你致命一击！",
            "{monster}凝聚力量，准备发动强力的攻击！"
        ],
        playerDodge: [
            "💨 你灵巧地侧身闪开了{monster}的攻击！",
            "⚡ 你如鬼魅般闪避了{monster}的所有攻击！",
            "🌪️ 你看穿了{monster}的招式，轻松躲开！"
        ],
        lifesteal: [
            "❤️ 吸血生效！伤口愈合了！",
            "💫 生命力被吸取，你的伤口在修复！",
            "🩸 鲜血滋养着你的身体！"
        ]
    }
};

// 装备槽位
export const EQUIPMENT_SLOTS = [
    'helmet',
    'armor',
    'leftHand',
    'rightHand',
    'gloves',
    'boots',
    'ring1',
    'ring2'
];
