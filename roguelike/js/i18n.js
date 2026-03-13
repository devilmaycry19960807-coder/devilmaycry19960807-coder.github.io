// 国际化多语言支持
export const translations = {
    zh: {
        // 标题和标题栏
        title: "无尽地下城",
        floorInfo: "🏰 第 FLOOR 层 | 🏆 最高纪录: 第 MAXFLOOR 层",
        actions: "⚡ 操作",
        autoBattleBtn: "▶️ 开始自动战斗",

        // 怪物区域
        noMonster: "暂无怪物<br>点击\"开始自动战斗\"",

        // 状态栏
        currentGold: "💰 当前金币",

        // 日志区域
        adventureLog: "📜 冒险日志",

        // 属性面板
        statsPanel: "👤 角色属性",
        level: "等级",
        exp: "EXP",
        hp: "HP",
        mp: "MP",
        baseAttributes: {
            strength: "力量",
            agility: "敏捷",
            intelligence: "智力"
        },
        stats: {
            attack: "攻击力",
            defense: "防御力",
            critRate: "暴击率",
            critDamage: "暴击伤害",
            dodge: "闪避率",
            lifesteal: "吸血",
            penetration: "穿透"
        },

        // 装备和遗物
        equipment: "🎒 装备栏",
        artifact: "★ 遗物",
        spells: "✨ 法术",

        // 广告功能
        watchAdRevive: "🎬 看广告复活",
        watchAdSpeed: "⚡ 看广告2倍速度",
        watchAdRecovery: "✨ 看广告全满恢复",

        // 游戏结束
        gameOver: "💀 游戏结束",
        adventureEnded: "你的冒险在第 FINAL 层结束了",
        goldEarned: "💰 获得金币: GOLD",
        restart: "重新开始",
        watchAdReviveInPlace: "🎬 看广告原地复活",

        // 其他
        toggleStatsExpand: "📊 展开属性 ▼",
        toggleStatsCollapse: "📊 收起属性 ▲",
        leaderboard: "🏆 排行榜",
        close: "关闭",
        rank: "排名",
        floorCol: "层数",
        goldCol: "金币",

        // 反馈邮箱
        feedback: "📧 意见反馈",
        feedbackText: "如有问题或建议，欢迎反馈：",

        // 装备部位名称
        equipmentSlots: {
            helmet: "头盔",
            armor: "铠甲",
            leftHand: "左手",
            rightHand: "右手",
            gloves: "护手",
            boots: "靴子",
            necklace: "项链",
            ring: "戒指"
        },
        emptySlot: "空",
        noArtifact: "暂无遗物（击败BOSS可获得）",
        noSpell: "暂无法术（升级后自动学习）",
        upgradeSpell: "升级后学习法术",

        // 战斗日志翻译
        battleLogs: {
            encountered: "遭遇了",
            defeated: "击败了",
            goldEarned: "，获得",
            goldUnit: "金币！",
            enterFloor: "进入第",
            floorUnit: "层",
            defeatedByMonster: "你被击败了！退回到第",
            defeatedByMonster2: "层，状态已恢复。",
            obtainedEquipment: "获得装备:",
            typeBoss: "BOSS",
            typeElite: "精英怪",
            typeMonster: "怪物"
        },

        rarityNames: {
            common: "普通",
            uncommon: "优秀",
            rare: "稀有",
            legendary: "传说"
        },

        // 技能名称和描述翻译
        spellTranslations: {
            fireball: { name: "火球术", description: "投掷火球造成伤害" },
            ice_spike: { name: "冰刺", description: "发射冰刺穿透敌人" },
            lightning: { name: "闪电链", description: "召唤闪电攻击敌人" },
            heal: { name: "治疗术", description: "恢复生命值" },
            shield: { name: "魔法护盾", description: "临时增加防御力" },
            explosion: { name: "火焰爆裂", description: "造成大量范围伤害" },
            meteor: { name: "陨石坠落", description: "召唤陨石毁灭敌人" },
            divine_heal: { name: "圣光治疗", description: "大量恢复生命值" },
            blink: { name: "闪现", description: "提高闪避率" },
            power_up: { name: "力量增幅", description: "提高攻击力" }
        }
    },
    en: {
        // 标题和标题栏
        title: "Endless Dungeon",
        floorInfo: "🏰 Floor FLOOR | 🏆 Best: Floor MAXFLOOR",
        actions: "⚡ Actions",
        autoBattleBtn: "▶️ Auto Battle",

        // 怪物区域
        noMonster: "No monster<br>Click \"Auto Battle\" to start",

        // 状态栏
        currentGold: "💰 Gold",

        // 日志区域
        adventureLog: "📜 Adventure Log",

        // 属性面板
        statsPanel: "👤 Character Stats",
        level: "Level",
        exp: "EXP",
        hp: "HP",
        mp: "MP",
        baseAttributes: {
            strength: "Strength",
            agility: "Agility",
            intelligence: "Intelligence"
        },
        stats: {
            attack: "Attack",
            defense: "Defense",
            critRate: "Crit Rate",
            critDamage: "Crit Damage",
            dodge: "Dodge",
            lifesteal: "Lifesteal",
            penetration: "Penetration"
        },

        // 装备和遗物
        equipment: "🎒 Equipment",
        artifact: "★ Artifacts",
        spells: "✨ Spells",

        // 广告功能
        watchAdRevive: "🎬 Watch Ad to Revive",
        watchAdSpeed: "⚡ Watch Ad for 2x Speed",
        watchAdRecovery: "✨ Watch Ad to Full Recovery",

        // 游戏结束
        gameOver: "💀 Game Over",
        adventureEnded: "Your adventure ended at floor FINAL",
        goldEarned: "💰 Gold Earned: GOLD",
        restart: "Restart",
        watchAdReviveInPlace: "🎬 Watch Ad to Revive in Place",

        // 其他
        toggleStatsExpand: "📊 Expand Stats ▼",
        toggleStatsCollapse: "📊 Collapse Stats ▲",
        leaderboard: "🏆 Leaderboard",
        close: "Close",
        rank: "Rank",
        floorCol: "Floor",
        goldCol: "Gold",

        // 反馈邮箱
        feedback: "📧 Feedback",
        feedbackText: "Questions or suggestions? Email us:",

        // 装备部位名称
        equipmentSlots: {
            helmet: "Helmet",
            armor: "Armor",
            leftHand: "Left Hand",
            rightHand: "Right Hand",
            gloves: "Gloves",
            boots: "Boots",
            necklace: "Necklace",
            ring: "Ring"
        },
        emptySlot: "Empty",
        noArtifact: "No artifacts (defeat bosses to obtain)",
        noSpell: "No spells (auto-learn on level up)",
        upgradeSpell: "Learn spells on level up",

        // Battle log translations
        battleLogs: {
            encountered: "Encountered",
            defeated: "Defeated",
            goldEarned: ", earned",
            goldUnit: " gold!",
            enterFloor: "Entered floor",
            floorUnit: "",
            defeatedByMonster: "You were defeated! Retreated to floor",
            defeatedByMonster2: ", status restored.",
            obtainedEquipment: "Obtained equipment:",
            typeBoss: "BOSS",
            typeElite: "Elite",
            typeMonster: "Monster"
        },

        rarityNames: {
            common: "Common",
            uncommon: "Uncommon",
            rare: "Rare",
            legendary: "Legendary"
        },

        // 技能名称和描述翻译
        spellTranslations: {
            fireball: { name: "Fireball", description: "Throws a fireball to deal damage" },
            ice_spike: { name: "Ice Spike", description: "Shoots ice spikes to pierce enemies" },
            lightning: { name: "Lightning Chain", description: "Summons lightning to attack enemies" },
            heal: { name: "Heal", description: "Restores HP" },
            shield: { name: "Magic Shield", description: "Temporarily increases defense" },
            explosion: { name: "Flame Explosion", description: "Deals massive AOE damage" },
            meteor: { name: "Meteor Fall", description: "Summons meteors to destroy enemies" },
            divine_heal: { name: "Divine Heal", description: "Greatly restores HP" },
            blink: { name: "Blink", description: "Increases dodge rate" },
            power_up: { name: "Power Up", description: "Increases attack power" }
        }
    }
};

// 当前语言
let currentLang = localStorage.getItem('gameLanguage') || 'zh';

// 获取当前语言
export function getCurrentLanguage() {
    return currentLang;
}

// 设置语言
export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('gameLanguage', lang);
        applyTranslations();
    }
}

// 切换语言
export function toggleLanguage() {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
}

// 应用翻译
export function applyTranslations() {
    const t = translations[currentLang];

    // 标题
    document.querySelector('h1').textContent = t.title;

    // 语言切换按钮（中文界面显示EN，英文界面显示中文）
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = currentLang === 'zh' ? '🌐 EN' : '🌐 中文';
    }

    // 楼层信息（需要特殊处理变量）
    const floorEl = document.getElementById('floor');
    const maxFloorEl = document.getElementById('maxFloor');
    if (floorEl && maxFloorEl && t.floorInfo) {
        document.querySelector('.floor-info').textContent = t.floorInfo
            .replace('FLOOR', floorEl.textContent)
            .replace('MAXFLOOR', maxFloorEl.textContent);
    }

    // 操作区域标题和按钮
    const actionPanelH2 = document.querySelector('.actions-panel').parentElement.querySelector('h2');
    if (actionPanelH2) actionPanelH2.textContent = t.actions;

    const autoBattleBtn = document.getElementById('autoBattleBtn');
    if (autoBattleBtn) {
        // 不要覆盖按钮的实际状态文本，只在初始化时设置
        if (!autoBattleBtn.dataset.initialized) {
            autoBattleBtn.textContent = t.autoBattleBtn;
            autoBattleBtn.dataset.initialized = 'true';
        }
    }

    // 怪物区域
    const noMonsterEl = document.getElementById('noMonsterDisplay');
    if (noMonsterEl) {
        noMonsterEl.innerHTML = `<div class="no-monster-icon">🌙</div><div>${t.noMonster}</div>`;
    }

    // 金币
    const goldPanelH2 = document.querySelector('.monster-area .panel:nth-child(2) h2');
    if (goldPanelH2) goldPanelH2.textContent = t.currentGold;

    // 日志
    const logPanelH2 = document.querySelector('.log-area .panel h2');
    if (logPanelH2) logPanelH2.textContent = t.adventureLog;

    // 属性面板
    const statsPanelH2 = document.querySelector('#statsPanel h2');
    if (statsPanelH2) statsPanelH2.textContent = t.statsPanel;

    // 基础属性
    document.querySelectorAll('.base-attr-label').forEach((el, index) => {
        const keys = ['strength', 'agility', 'intelligence'];
        if (keys[index]) {
            el.textContent = t.baseAttributes[keys[index]];
        }
    });

    // 战斗属性
    const statKeys = ['attack', 'defense', 'critRate', 'critDamage', 'dodge', 'lifesteal', 'penetration'];
    document.querySelectorAll('.stat-label').forEach((el, index) => {
        if (statKeys[index] && t.stats[statKeys[index]]) {
            el.textContent = t.stats[statKeys[index]];
        }
    });

    // 装备、遗物、法术面板标题
    const equipmentH2 = document.querySelector('.equipment-container')?.closest('.panel')?.querySelector('h2');
    if (equipmentH2) equipmentH2.textContent = t.equipment;

    const artifactH2 = document.querySelector('.artifact-container')?.closest('.panel')?.querySelector('h2');
    if (artifactH2) artifactH2.textContent = t.artifact;

    const spellsH2 = document.querySelector('.spells-container')?.closest('.panel')?.querySelector('h2');
    if (spellsH2) spellsH2.textContent = t.spells;

    // 收起/展开按钮
    const toggleStatsBtn = document.getElementById('toggleStatsBtn');
    if (toggleStatsBtn) {
        const isExpanded = !document.getElementById('statsPanel').classList.contains('hidden');
        toggleStatsBtn.textContent = isExpanded ? t.toggleStatsCollapse : t.toggleStatsExpand;
    }

    // 广告按钮
    const adReviveBtn = document.getElementById('adReviveBtn');
    if (adReviveBtn) adReviveBtn.textContent = t.watchAdRevive;

    const adSpeedBtn = document.getElementById('adSpeedBtn');
    if (adSpeedBtn) adSpeedBtn.textContent = t.watchAdSpeed;

    const adRecoveryBtn = document.getElementById('adRecoveryBtn');
    if (adRecoveryBtn) adRecoveryBtn.textContent = t.watchAdRecovery;

    const adGameOverReviveBtn = document.getElementById('adGameOverReviveBtn');
    if (adGameOverReviveBtn) adGameOverReviveBtn.textContent = t.watchAdReviveInPlace;

    // 游戏结束
    const gameOverH2 = document.querySelector('#gameOverModal h2');
    if (gameOverH2) gameOverH2.textContent = t.gameOver;

    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) restartBtn.textContent = t.restart;
}

// 初始化语言
export function initI18n() {
    // 自动检测浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('en') && !localStorage.getItem('gameLanguage')) {
        currentLang = 'en';
    }

    applyTranslations();
}
