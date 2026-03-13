// UI管理
import { gameState, getTotalStats } from './gameState.js';
import { getMonsterStats, getBattleLog } from './battle.js';
import { buyRandomEquipment, equipObtainedItem } from './shop.js';
import { GAME_CONFIG } from './config.js';
import { RARITY_COLORS } from './equipment.js';
import { getCurrentLanguage, translations } from './i18n.js';
import { getEquipmentTranslation, getArtifactTranslation, getSpellTranslation, getMonsterTranslation, getMonsterDescriptionTranslation } from './translations.js';

export function updateUI() {
    const stats = getTotalStats();
    const lang = getCurrentLanguage();
    const t = translations[lang];

    // 更新楼层信息（需要翻译）
    const floorEl = document.getElementById('floor');
    const maxFloorEl = document.getElementById('maxFloor');
    if (floorEl && gameState.floor !== undefined) floorEl.textContent = gameState.floor;
    if (maxFloorEl && gameState.maxFloor !== undefined) maxFloorEl.textContent = gameState.maxFloor;

    // 更新楼层UI文字
    const floorInfoEl = document.querySelector('.floor-info');
    if (floorInfoEl && t.floorInfo) {
        floorInfoEl.textContent = t.floorInfo
            .replace('FLOOR', gameState.floor)
            .replace('MAXFLOOR', gameState.maxFloor);
    }

    // 更新等级和经验
    const levelEl = document.getElementById('level');
    const expEl = document.getElementById('exp');
    const expToLevelEl = document.getElementById('expToLevel');
    const expBar = document.getElementById('expBar');

    if (levelEl && gameState.level !== undefined) levelEl.textContent = gameState.level;
    if (expEl && gameState.exp !== undefined) expEl.textContent = gameState.exp;
    if (expToLevelEl && gameState.expToLevel !== undefined) expToLevelEl.textContent = gameState.expToLevel;
    if (expBar && gameState.exp !== undefined && gameState.expToLevel !== undefined) {
        const expPercent = (gameState.exp / gameState.expToLevel) * 100;
        expBar.style.width = expPercent + '%';
    }

    // 更新角色属性
    const currentHpEl = document.getElementById('currentHp');
    const maxHpEl = document.getElementById('maxHp');
    const mpEl = document.getElementById('mp');
    const maxMpEl = document.getElementById('maxMp');
    const goldEl = document.getElementById('goldDisplay');

    if (currentHpEl && gameState.hp !== undefined) currentHpEl.textContent = Math.floor(gameState.hp);
    if (maxHpEl && stats.maxHp) maxHpEl.textContent = Math.floor(stats.maxHp);
    if (mpEl && gameState.mp !== undefined) mpEl.textContent = Math.floor(gameState.mp);
    if (maxMpEl && stats.maxMp) maxMpEl.textContent = Math.floor(stats.maxMp);
    if (goldEl && gameState.gold !== undefined) goldEl.textContent = gameState.gold;

    // 更新基础属性
    document.getElementById('strength').textContent = gameState.strength;
    document.getElementById('agility').textContent = gameState.agility;
    document.getElementById('intelligence').textContent = gameState.intelligence;

    document.getElementById('attack').textContent = Math.floor(stats.attack);
    document.getElementById('defense').textContent = Math.floor(stats.defense);
    document.getElementById('critRate').textContent = stats.critRate.toFixed(1) + '%';
    document.getElementById('critDamage').textContent = (stats.critDamage * 100).toFixed(0) + '%';
    document.getElementById('dodge').textContent = stats.dodge.toFixed(1) + '%';
    document.getElementById('lifesteal').textContent = (stats.lifesteal * 100).toFixed(1) + '%';
    document.getElementById('penetration').textContent = gameState.penetration || 0;

    // 更新血条和法力条
    const hpPercent = (gameState.hp / stats.maxHp) * 100;
    document.getElementById('healthBar').style.width = hpPercent + '%';
    const mpPercent = (gameState.mp / stats.maxMp) * 100;
    document.getElementById('manaBar').style.width = mpPercent + '%';

    // 更新购买按钮文本（批量购买）
    updatePurchaseButtons();

    // 更新装备
    updateEquipmentDisplay();

    // 更新遗物
    updateArtifactDisplay();

    // 更新法术
    updateSpellsDisplay();

    // 更新法术快捷键
    updateSpellsActions();

    // 更新怪物面板
    updateMonsterPanel();

    // 更新按钮状态
    updateButtonStates();
}

export function updateEquipmentDisplay() {
    const eq = gameState.equipment;
    const lang = getCurrentLanguage();
    const t = translations[lang];

    const equipItems = [
        { slot: 'helmet', name: t.equipmentSlots.helmet, item: eq.helmet },
        { slot: 'armor', name: t.equipmentSlots.armor, item: eq.armor },
        { slot: 'leftHand', name: t.equipmentSlots.leftHand, item: eq.leftHand },
        { slot: 'rightHand', name: t.equipmentSlots.rightHand, item: eq.rightHand },
        { slot: 'gloves', name: t.equipmentSlots.gloves, item: eq.gloves },
        { slot: 'boots', name: t.equipmentSlots.boots, item: eq.boots },
        { slot: 'necklace', name: t.equipmentSlots.necklace, item: eq.necklace },
        { slot: 'ring1', name: t.equipmentSlots.ring, item: eq.ring1 }
    ];

    const container = document.getElementById('equipmentContainer');
    container.innerHTML = equipItems.map(e => {
        const item = e.item;
        const color = item ? RARITY_COLORS[item.rarity] : '#666';
        const stats = item ? [
            item.attack > 0 ? `⚔️${item.attack}` : '',
            item.defense > 0 ? `🛡️${item.defense}` : '',
            item.hp > 0 ? `❤️${item.hp}` : '',
            item.critRate > 0 ? `💥${item.critRate}%` : '',
            item.critDamage > 0 ? `⚡${(item.critDamage*100).toFixed(0)}%` : '',
            item.dodge > 0 ? `💨${item.dodge}%` : '',
            item.lifesteal > 0 ? `🩸${(item.lifesteal*100).toFixed(1)}%` : ''
        ].filter(Boolean).join(' ') : '';

        // 使用翻译函数获取装备名称
        const translatedName = item ? getEquipmentTranslation(item.name, lang) : t.emptySlot;

        return `
            <div class="equipment-item">
                <div class="equipment-slot">${e.name}</div>
                <div class="equipment-name" style="color: ${color}">${translatedName}</div>
                <div class="equipment-stats">${stats}</div>
            </div>
        `;
    }).join('');
}

export function updateArtifactDisplay() {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    const container = document.getElementById('artifactContainer');
    if (gameState.artifacts.length === 0) {
        container.innerHTML = `<div class="no-artifact">${t.noArtifact}</div>`;
    } else {
        container.innerHTML = gameState.artifacts.map(a => {
            // 使用翻译函数获取遗物名称和描述
            const translatedName = getArtifactTranslation(a.name, lang, 'name');
            const translatedDesc = getArtifactTranslation(a.name, lang, 'description');
            return `
            <div class="artifact-item">
                <div class="artifact-name">${translatedName}</div>
                <div class="artifact-desc">${translatedDesc}</div>
            </div>
        `}).join('');
    }
}

export function updateSpellsDisplay() {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    const container = document.getElementById('spellsContainer');
    if (gameState.spells.length === 0) {
        container.innerHTML = `<div class="no-spell">${t.noSpell}</div>`;
    } else {
        container.innerHTML = gameState.spells.map(s => {
            // 使用新的翻译函数获取技能名称和描述
            const displayName = getSpellTranslation(s.id, lang, 'name');
            const displayDesc = getSpellTranslation(s.id, lang, 'description');
            return `
            <div class="spell-item">
                <div class="spell-icon">${s.icon}</div>
                <div class="spell-info">
                    <div class="spell-name">${displayName}</div>
                    <div class="spell-desc">${displayDesc}</div>
                    <div class="spell-cost">MP: ${s.mpCost}</div>
                </div>
            </div>
        `}).join('');
    }
}

export function updateSpellsActions() {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    const container = document.getElementById('spellsActions');
    if (!container) return;

    if (gameState.spells.length === 0) {
        container.innerHTML = `<div class="no-spell">${t.upgradeSpell}</div>`;
        return;
    }

    container.innerHTML = gameState.spells.map((s, index) => {
        const canCast = gameState.mp >= s.mpCost && gameState.inBattle;
        // 使用新的翻译函数获取技能名称
        const displayName = getSpellTranslation(s.id, lang, 'name');
        return `
            <button class="spell-btn" data-spell-id="${s.id}" ${canCast ? '' : 'disabled'}>
                <div class="spell-btn-icon">${s.icon}</div>
                <div class="spell-btn-name">${displayName}</div>
                <div class="spell-btn-cost">MP: ${s.mpCost}</div>
            </button>
        `;
    }).join('');

    // 绑定法术按钮事件
    container.querySelectorAll('.spell-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const spellId = btn.dataset.spellId;
            window.castSpell(spellId);
        });
    });
}

export function updateMonsterPanel() {
    const monsterPanel = document.getElementById('monsterPanel');
    const monsterStats = getMonsterStats();
    const noMonsterDisplay = document.getElementById('noMonsterDisplay');
    const monsterContent = document.getElementById('monsterContent');
    const lang = getCurrentLanguage();
    const t = translations[lang];

    if (monsterStats) {
        monsterPanel.style.display = 'block';
        monsterPanel.classList.remove('hidden');
        noMonsterDisplay.style.display = 'none';
        monsterContent.style.display = 'block';

        // 翻译怪物名称和描述
        const translatedName = getMonsterTranslation(monsterStats.name, lang);
        const translatedDesc = getMonsterDescriptionTranslation(monsterStats.description, lang);

        document.getElementById('monsterName').textContent = monsterStats.emoji + ' ' + translatedName;
        if (monsterStats.title) {
            document.getElementById('monsterTitle').textContent = monsterStats.title;
            document.getElementById('monsterTitle').style.display = 'block';
        } else {
            document.getElementById('monsterTitle').style.display = 'none';
        }
        document.getElementById('monsterDesc').textContent = translatedDesc;
        document.getElementById('monsterAttack').textContent = monsterStats.attack;
        document.getElementById('monsterDefense').textContent = monsterStats.defense;

        // 翻译攻击力和防御力标签
        if (t.stats && t.stats.attack) {
            document.getElementById('monsterAttackLabel').textContent = '⚔️ ' + t.stats.attack;
        }
        if (t.stats && t.stats.defense) {
            document.getElementById('monsterDefenseLabel').textContent = '🛡️ ' + t.stats.defense;
        }
        
        const hpPercent = (monsterStats.hp / monsterStats.maxHp) * 100;
        const hpText = `${Math.floor(monsterStats.hp)} / ${Math.floor(monsterStats.maxHp)}`;
        
        document.getElementById('monsterHpBar').style.width = hpPercent + '%';
        document.getElementById('monsterHpBar').textContent = hpText;
        document.getElementById('monsterHpText').textContent = hpText + ' HP';
    } else {
        monsterPanel.style.display = 'block';
        monsterPanel.classList.add('hidden');
        noMonsterDisplay.style.display = 'block';
        monsterContent.style.display = 'none';
    }
}

export function updateButtonStates() {
    const inBattle = gameState.inBattle;
    const isAutoBattle = gameState.isAutoBattle;
    const stats = getTotalStats();

    const healBtn = document.getElementById('healBtn');
    const fleeBtn = document.getElementById('fleeBtn');
    const shopBtn = document.getElementById('shopBtn');
    const autoBtn = document.getElementById('autoBattleBtn');

    if (healBtn) healBtn.disabled = gameState.gold < GAME_CONFIG.HEAL_COST || gameState.hp >= stats.maxHp;
    if (fleeBtn) fleeBtn.disabled = !inBattle;
    if (shopBtn) shopBtn.disabled = gameState.gold < 50;
    
    // 更新自动战斗按钮
    if (autoBtn) {
        autoBtn.textContent = isAutoBattle ? '⏸️ 停止战斗' : '▶️ 开始自动战斗';
        autoBtn.className = isAutoBattle ? 'action-btn shop' : 'action-btn attack';
    }
}

export function addLog(message, type = 'info') {
    const logPanel = document.getElementById('logPanel');

    // 如果是楼层变更，清理之前的日志
    if (type === 'floor') {
        logPanel.innerHTML = '';
    }

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.innerHTML = message;
    logPanel.insertBefore(logEntry, logPanel.firstChild);

    // 限制日志数量
    while (logPanel.children.length > 100) {
        logPanel.removeChild(logPanel.lastChild);
    }
}

export function addBattleLogEntry(logEntry) {
    const logPanel = document.getElementById('logPanel');
    const entry = document.createElement('div');
    entry.className = `log-entry log-battle`;
    
    let message = logEntry.message;
    if (logEntry.damage !== undefined) {
        if (logEntry.isCrit) {
            message = `<span style="color: #eab308;">⚡ ${message}</span>`;
        } else if (logEntry.type === 'monsterAttack') {
            message = `<span style="color: #ef4444;">${message}</span>`;
        }
    }
    if (logEntry.healAmount !== undefined) {
        message = `<span style="color: #22c55e;">${message}</span>`;
    }
    
    entry.innerHTML = message;
    logPanel.insertBefore(entry, logPanel.firstChild);

    while (logPanel.children.length > 100) {
        logPanel.removeChild(logPanel.lastChild);
    }
}

export function showGameOver() {
    document.getElementById('finalFloor').textContent = gameState.floor;
    document.getElementById('finalGold').textContent = gameState.gold;
    document.getElementById('gameOverModal').classList.add('active');
}

export function hideGameOver() {
    document.getElementById('gameOverModal').classList.remove('active');
}

// 更新购买按钮文本（批量购买）
export function updatePurchaseButtons() {
    // 更新治疗按钮
    const healMultiplier = calculateBatchMultiplier(GAME_CONFIG.HEAL_COST);
    const healBtn = document.getElementById('healBtn');
    if (healBtn) {
        if (healMultiplier > 1) {
            healBtn.textContent = `💚 治疗 (${GAME_CONFIG.HEAL_COST * healMultiplier}💰 x${healMultiplier})`;
        } else {
            healBtn.textContent = `💚 治疗 (${GAME_CONFIG.HEAL_COST}💰)`;
        }
    }

    // 更新商店按钮
    const shopMultiplier = calculateBatchMultiplier(GAME_CONFIG.EQUIPMENT_COST);
    const shopBtn = document.getElementById('shopBtn');
    if (shopBtn) {
        if (shopMultiplier > 1) {
            shopBtn.textContent = `🏪 随机装备 (${GAME_CONFIG.EQUIPMENT_COST * shopMultiplier}💰 x${shopMultiplier})`;
        } else {
            shopBtn.textContent = `🏪 随机装备 (${GAME_CONFIG.EQUIPMENT_COST}💰)`;
        }
    }
}

// 计算批量购买次数
function calculateBatchMultiplier(baseCost) {
    if (gameState.gold >= baseCost * 100) return 100;
    if (gameState.gold >= baseCost * 50) return 50;
    if (gameState.gold >= baseCost * 20) return 20;
    if (gameState.gold >= baseCost * 10) return 10;
    if (gameState.gold >= baseCost * 5) return 5;
    return 1;
}

export function openShopPanel() {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    const multiplier = calculateBatchMultiplier(GAME_CONFIG.EQUIPMENT_COST);
    const result = buyRandomEquipment(multiplier);

    if (result.success) {
        // 批量处理获得的物品
        result.items.forEach((item, index) => {
            setTimeout(() => {
                const equipResult = equipObtainedItem(item);
                let message = '';

                if (item.type) {
                    // 装备
                    const stats = [
                        item.attack > 0 ? `⚔️+${item.attack}` : '',
                        item.defense > 0 ? `🛡️+${item.defense}` : '',
                        item.hp > 0 ? `❤️+${item.hp}` : '',
                        item.critRate > 0 ? `💥+${item.critRate}%` : '',
                        item.critDamage > 0 ? `⚡+${(item.critDamage*100).toFixed(0)}%` : '',
                        item.dodge > 0 ? `💨+${item.dodge}%` : '',
                        item.lifesteal > 0 ? `🩸+${(item.lifesteal*100).toFixed(1)}%` : ''
                    ].filter(Boolean).join(', ');
                    // 使用翻译函数获取装备名称
                    const translatedName = getEquipmentTranslation(item.name, lang);
                    message = `<span style="color: ${RARITY_COLORS[item.rarity]}">[${t.rarityNames[item.rarity]}] ${translatedName}</span><br>`;
                    message += `<span style="font-size: 0.9em;">${stats}</span><br>`;
                    message += equipResult.equipped ? `<span style="color: #22c55e;">✓ ${equipResult.message}</span>` : `<span style="color: #f59e0b;">✗ ${equipResult.message}</span>`;
                } else {
                    // 遗物
                    // 使用翻译函数获取遗物名称和描述
                    const translatedName = getArtifactTranslation(item.name, lang, 'name');
                    const translatedDesc = getArtifactTranslation(item.name, lang, 'description');
                    message = `<span style="color: #eab308;">★ ${translatedName}</span><br>`;
                    message += `<span style="font-size: 0.9em;">${translatedDesc}</span><br>`;
                    message += `<span style="color: #22c55e;">✓ ${equipResult.message}</span>`;
                }

                addLog(message, 'item');
            }, index * 200); // 每个物品间隔200ms显示
        });

        setTimeout(() => {
            addLog(`${result.message}`, 'item');
            updateUI();
        }, result.items.length * 200);
    } else {
        addLog(result.message, 'info');
    }
}
