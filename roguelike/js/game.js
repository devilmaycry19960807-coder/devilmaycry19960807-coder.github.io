// 游戏主逻辑
import { gameState, resetGameState, saveGame, loadGame, clearSave, getTotalStats, updateGold } from './gameState.js';
import { playerAttack, winBattle, isInBattle, getMonsterStats, toggleAutoBattle, fleeBattle, castSpellAttack } from './battle.js';
import { explore, heal, checkShopAccess } from './exploration.js';
import { updateUI, addLog, updateMonsterPanel, showGameOver, hideGameOver, openShopPanel, addBattleLogEntry } from './ui.js';
import { calculateBatchMultiplier } from './exploration.js';
import { RARITY_COLORS, RARITY_NAMES, calculateEquipmentScore, EQUIPMENT } from './equipment.js';
import { claimDailyReward, checkDailyReward, getDailyReward } from './dailyReward.js';
import { equipObtainedItem } from './shop.js';
import { getCurrentLanguage, translations } from './i18n.js';

console.log('Game module loaded');

// 重置存档（测试用）
// clearSave();
// resetGameState(false);
// console.log('存档已重置');

// 重置存档
export function handleResetGame() {
    if (confirm('确定要重置存档吗？所有进度将丢失！')) {
        clearSave();
        resetGameState(false);
        addLog('🔄 存档已重置！', 'info');
        updateUI();
    }
}

// 初始化游戏
export function initGame() {
    console.log('Initializing game');

    // 尝试自动读取存档
    const hasSave = loadGame();
    if (hasSave) {
        addLog('💾 已自动读取上次的存档，继续你的冒险！', 'info');
    } else {
        addLog('欢迎来到无尽地下城！你的角色拥有强大的初始属性，可以轻松通过前50层。<br>点击"开始自动战斗"开始你的冒险！', 'info');
    }

    updateUI();
}

// 切换属性面板显示
export function toggleStatsPanel() {
    const panel = document.getElementById('statsPanel');
    const btn = document.getElementById('toggleStatsBtn');
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        btn.textContent = '📊 收起属性 ▲';
    } else {
        panel.style.display = 'none';
        btn.textContent = '📊 查看属性 ▼';
    }
}

// 探索
export function handleExplore() {
    console.log('Handling explore, inBattle:', gameState.inBattle);
    const result = explore();
    console.log('Explore result:', result, 'current inBattle:', gameState.inBattle);

    if (result.type === 'monster') {
        const typeText = result.battleType === 'boss' ? 'BOSS' : result.battleType === 'elite' ? '精英怪' : '怪物';
        addLog(`<span style="color: #ef4444;">⚠️ ${result.message}</span>`, result.battleType);
    } else if (result.type === 'shop') {
        // 显示商店
        addLog(result.message, 'rest');

        const wasAuto = gameState.isAutoBattle;
        if (wasAuto) {
            gameState.isAutoBattle = false;
            const autoBtn = document.getElementById('autoBattleBtn');
            if (autoBtn) autoBtn.textContent = '▶️ 开始自动战斗';
        }

        addLog('🏪 发现神秘商人！', 'item');

        setTimeout(() => {
            openNewShop(wasAuto);
        }, 1000);
    } else {
        addLog(result.message, result.type);
    }

    updateUI();
}

// 开始/停止自动战斗
export function handleAutoBattle() {
    console.log('handleAutoBattle called');
    const isAuto = toggleAutoBattle();
    console.log('Auto battle toggled to:', isAuto);

    const autoBtn = document.getElementById('autoBattleBtn');
    if (isAuto) {
        addLog('▶️ 自动战斗已启动！角色将自动探索和战斗。', 'info');
        if (autoBtn) autoBtn.textContent = '⏸️ 停止战斗';
        startAutoBattleLoop();
    } else {
        addLog('⏸️ 自动战斗已停止。', 'info');
        if (autoBtn) autoBtn.textContent = '▶️ 开始自动战斗';
        if (autoBattleInterval) {
            clearInterval(autoBattleInterval);
            autoBattleInterval = null;
        }
        if (combatInterval) {
            clearInterval(combatInterval);
            combatInterval = null;
        }
        // 停止时重置探索标志
        isExploring = false;
    }

    updateUI();
}

// 自动战斗循环
let autoBattleInterval = null;
let combatInterval = null;
let isExploring = false;

// 导出 isExploring 和重置函数
export { isExploring };

// 重置探索标志（供外部模块调用）
export function resetExploringFlag() {
    isExploring = false;
    console.log('isExploring flag reset');
}

// 启动自动战斗循环（可选：强制重置探索标志）
export function startAutoBattleLoop(forceReset = false) {
    console.log('Starting auto battle loop, forceReset:', forceReset);

    if (forceReset) {
        isExploring = false;
    }

    if (autoBattleInterval) {
        clearInterval(autoBattleInterval);
    }
    if (combatInterval) {
        clearInterval(combatInterval);
    }

    // 如果当前已经在战斗中，直接启动自动战斗
    if (isInBattle()) {
        console.log('Already in battle, starting combat immediately');
        performAutoCombat();
    }

    autoBattleInterval = setInterval(() => {
        console.log('Auto battle loop tick, isAutoBattle:', gameState.isAutoBattle, 'isExploring:', isExploring, 'isInBattle:', isInBattle());

        if (!gameState.isAutoBattle) {
            console.log('Stopping auto battle loop');
            clearInterval(autoBattleInterval);
            autoBattleInterval = null;
            return;
        }

        // 如果已经在探索中，跳过这次
        if (isExploring) {
            console.log('Already exploring, skipping...');
            return;
        }

        // 如果不在战斗中，探索
        if (!isInBattle()) {
            console.log('Not in battle, exploring...');
            isExploring = true;
            handleExplore();

            // 探索完成后重置标志
            setTimeout(() => {
                console.log('Exploration timeout, resetting isExploring. isAutoBattle:', gameState.isAutoBattle, 'isInBattle:', isInBattle());
                isExploring = false;

                // 如果探索后进入战斗，启动自动战斗
                if (gameState.isAutoBattle && isInBattle()) {
                    console.log('Battle started, starting combat...');
                    performAutoCombat();
                }
            }, 800);
        } else {
            console.log('Currently in battle, skipping explore...');
        }
    }, 1500);
}

// 执行自动战斗
let combatSpeed = 1200; // 默认战斗速度

function performAutoCombat() {
    console.log('Starting auto combat');

    if (combatInterval) {
        clearInterval(combatInterval);
    }

    combatInterval = setInterval(() => {
        if (!gameState.isAutoBattle || !isInBattle()) {
            console.log('Stopping auto combat');
            clearInterval(combatInterval);
            combatInterval = null;
            return;
        }

        console.log('Auto combat attack');
        const result = playerAttack();

        // 显示战斗日志
        result.battleLog.forEach(logEntry => {
            addBattleLogEntry(logEntry);
        });

        updateUI();

        // 检查是否结束
        if (result.monsterDead) {
            console.log('Monster dead');
            clearInterval(combatInterval);
            combatInterval = null;
            handleBattleWin();
        } else if (gameState.hp <= 0) {
            console.log('Player dead');
            clearInterval(combatInterval);
            combatInterval = null;
            handleGameOver();
        }
    }, combatSpeed);
}

// 手动攻击
export function handleAttack() {
    if (!isInBattle()) return;

    const result = playerAttack();

    result.battleLog.forEach(logEntry => {
        addBattleLogEntry(logEntry);
    });

    updateUI();

    if (result.monsterDead) {
        handleBattleWin();
    } else if (gameState.hp <= 0) {
        handleGameOver();
    }
}

// 战斗加速（看广告2倍速5分钟）
export function watchAdToSpeedUp() {
    if (!gameState.isAutoBattle) {
        addLog('⚠️ 只有在自动战斗时才能使用加速！', 'info');
        return;
    }

    if (combatSpeed === 600) {
        addLog('⚠️ 加速效果正在生效中！', 'info');
        return;
    }

    addLog('📺 正在播放广告...', 'info');

    setTimeout(() => {
        combatSpeed = 600; // 加速到0.6秒
        addLog('⚡ 战斗加速已激活！持续5分钟', 'info');
        updateUI();

        // 5分钟后恢复正常速度
        setTimeout(() => {
            combatSpeed = 1200;
            addLog('战斗加速效果已结束', 'info');
            updateUI();
        }, 300000); // 5分钟 = 300000毫秒
    }, 1000);
}

// 治疗
export function handleHeal() {
    const multiplier = calculateBatchMultiplier(GAME_CONFIG.HEAL_COST);
    const result = heal(multiplier);
    if (result.success) {
        addLog(result.message, 'item');
    } else {
        addLog(result.message, 'info');
    }
    updateUI();
}

// 打开商店
export function handleOpenShop() {
    openShopPanel();
}

// 存档
export function handleSaveGame() {
    saveGame();
    addLog('💾 游戏已保存！', 'info');
}

// 读档
export function handleLoadGame() {
    const success = loadGame();
    if (success) {
        addLog('📂 游戏已读取！', 'info');
        updateMonsterPanel();
        updateUI();
    } else {
        addLog('❌ 没有找到存档！', 'info');
    }
}

// 每日签到
export function handleSignIn() {
    const canSignIn = checkDailyReward();

    if (!canSignIn.canSignIn) {
        const nextReward = getDailyReward(canSignIn.day);
        const rewardText = nextReward.equipment ? `${nextReward.gold}金币 + 装备` : `${nextReward.gold}金币`;
        addLog(`📅 今日已签到！明日奖励：${rewardText}`, 'info');
        return;
    }

    // 显示签到选项
    const signInInfo = document.createElement('div');
    signInInfo.className = 'sign-in-modal';
    signInInfo.innerHTML = `
        <div class="sign-in-content">
            <h3>📅 每日签到 - 第${canSignIn.day}天</h3>
            <div class="sign-in-rewards">
                <p>基础奖励：${canSignIn.day}天 - ${getDailyReward(canSignIn.day).gold}金币</p>
                ${canSignIn.day === 7 ? '<p class="special">第7天额外获得随机装备！</p>' : ''}
            </div>
            <div class="sign-in-buttons">
                <button class="sign-btn sign-normal" id="signInNormal">直接签到</button>
                <button class="sign-btn sign-ad" id="signInAd">📺 看广告翻10倍</button>
                <button class="sign-btn sign-cancel" id="signInCancel">取消</button>
            </div>
        </div>
    `;

    document.body.appendChild(signInInfo);

    // 绑定事件
    document.getElementById('signInNormal').addEventListener('click', () => {
        const result = claimDailyReward(false);
        addLog(result.message, 'item');
        document.body.removeChild(signInInfo);
        updateUI();
    });

    document.getElementById('signInAd').addEventListener('click', () => {
        // 模拟看广告
        showAdAndClaimReward(signInInfo);
    });

    document.getElementById('signInCancel').addEventListener('click', () => {
        document.body.removeChild(signInInfo);
    });
}

// 显示广告并领取奖励
function showAdAndClaimReward(modal) {
    // 这里可以接入真实广告SDK
    // 目前用setTimeout模拟
    addLog('📺 正在播放广告...', 'info');

    setTimeout(() => {
        const result = claimDailyReward(true);
        addLog(result.message, 'item');
        document.body.removeChild(modal);
        updateUI();

        // 如果第7天看广告，随机给一件装备
        if (result.equipment) {
            setTimeout(() => {
                const randomSlot = ['helmets', 'armors', 'oneHandWeapons', 'gloves', 'boots', 'rings'][Math.floor(Math.random() * 6)];
                const pool = EQUIPMENT[randomSlot].filter(item => item.rarity === 'rare' || item.rarity === 'legendary');
                if (pool.length > 0) {
                    const item = pool[Math.floor(Math.random() * pool.length)];
                    const slotName = {
                        helmets: '头盔', armors: '铠甲', oneHandWeapons: '武器',
                        gloves: '护手', boots: '靴子', rings: '戒指'
                    }[randomSlot];
                    addLog(`🎁 签到奖励：获得${slotName} <span style="color: ${RARITY_COLORS[item.rarity]};">${item.name}</span>！`, 'item');
                }
            }, 500);
        }
    }, 1000);
}

// 逃跑
export function handleFlee() {
    const result = fleeBattle();

    if (result.battleLog) {
        result.battleLog.forEach(logEntry => {
            addBattleLogEntry(logEntry);
        });
    }

    addLog(result.message, 'battle');
    updateUI();
}

// 释放法术
export function handleCastSpell(spellId) {
    if (!isInBattle()) {
        addLog('只能在战斗中使用法术！', 'info');
        return;
    }

    const result = castSpellAttack(spellId);

    if (result.success) {
        // 显示战斗日志
        if (result.battleLog) {
            result.battleLog.forEach(logEntry => {
                addBattleLogEntry(logEntry);
            });
        }

        addLog(result.spell.type === 'heal' || result.spell.type === 'buff' ? result.battleLog[result.battleLog.length - 1].message : '释放法术成功！', 'spell');
        updateUI();

        // 检查怪物是否死亡
        if (result.monsterDead) {
            handleBattleWin();
        } else if (gameState.hp <= 0) {
            handleGameOver();
        }
    } else {
        addLog(result.message, 'info');
        updateUI();
    }
}

// 游戏结束（死亡后回退一层并恢复）
export function handleGameOver() {
    // 记录是否在自动战斗状态
    const wasAutoBattle = gameState.isAutoBattle;

    // 回退一层（至少保持第1层）
    if (gameState.floor > 1) {
        gameState.floor--;
    }

    // 恢复满血满法力状态
    const stats = getTotalStats();
    gameState.hp = stats.maxHp;
    gameState.mp = stats.maxMp;

    // 清除战斗状态
    gameState.inBattle = false;
    gameState.monster = null;

    // 显示死亡消息
    const lang = getCurrentLanguage();
    const t = translations[lang];
    addLog(`<span style="color: #ef4444;">💀 ${t.battleLogs.defeatedByMonster} ${gameState.floor}${t.battleLogs.defeatedByMonster2}</span>`, 'battle');

    // 自动存档
    saveGame();

    // 更新UI
    updateUI();

    // 如果之前在自动战斗，继续自动战斗
    if (wasAutoBattle) {
        // 等待一小段时间后继续自动战斗
        setTimeout(() => {
            if (gameState.isAutoBattle) {
                console.log('Resuming auto battle after death');
                // 自动战斗循环会自动继续，无需额外操作
            }
        }, 500);
    }
}

// 上传成绩到排行榜
function uploadToLeaderboard(floor, gold) {
    // 使用localStorage模拟排行榜
    const leaderboard = JSON.parse(localStorage.getItem('roguelike_leaderboard') || '[]');

    const record = {
        floor: floor,
        gold: gold,
        date: new Date().toLocaleDateString('zh-CN'),
        timestamp: Date.now()
    };

    leaderboard.push(record);

    // 按楼层排序，取前50名
    leaderboard.sort((a, b) => b.floor - a.floor || b.gold - a.gold);
    const top50 = leaderboard.slice(0, 50);

    localStorage.setItem('roguelike_leaderboard', JSON.stringify(top50));

    return `📊 成绩已上传！到达第${floor}层，获得${gold}金币`;
}

// 显示排行榜
export function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('roguelike_leaderboard') || '[]');

    const leaderboardModal = document.createElement('div');
    leaderboardModal.className = 'sign-in-modal';
    leaderboardModal.style.zIndex = '10001';

    let html = `
        <div class="sign-in-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <h3>🏆 排行榜</h3>
            ${leaderboard.length === 0 ? '<p style="text-align: center; color: #888;">暂无数据</p>' : ''}
    `;

    if (leaderboard.length > 0) {
        html += '<div style="margin-top: 15px;">';
        leaderboard.forEach((record, index) => {
            const rank = index + 1;
            let rankEmoji = '🥉';
            let rankColor = '#888';

            if (rank === 1) { rankEmoji = '🥇'; rankColor = '#ffd700'; }
            else if (rank === 2) { rankEmoji = '🥈'; rankColor = '#c0c0c0'; }
            else if (rank === 3) { rankEmoji = '🥉'; rankColor = '#cd7f32'; }

            html += `
                <div style="display: flex; justify-content: space-between; padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.05); border-radius: 5px; border-left: 3px solid ${rankColor};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.2em;">${rankEmoji}</span>
                        <span style="color: ${rankColor}; font-weight: bold;">第 ${rank} 名</span>
                    </div>
                    <div>
                        <span style="color: #ffd700;">🏰 ${record.floor}层</span>
                        <span style="color: #ffaa00; margin-left: 10px;">💰 ${record.gold}</span>
                    </div>
                    <div style="color: #888; font-size: 0.9em;">${record.date}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    // 显示当前状态
    html += `
        <div style="margin-top: 20px; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
            <p style="color: #ffd700; margin: 5px 0;">当前状态</p>
            <p style="font-size: 0.95em; color: #aaa;">🏰 当前层数：${gameState.floor}层</p>
            <p style="font-size: 0.95em; color: #aaa;">💰 当前金币：${gameState.gold}</p>
        </div>
    `;

    html += `
            <div class="sign-in-buttons" style="flex-direction: column; gap: 10px;">
                <button class="sign-btn sign-normal" id="uploadToLeaderboard">📤 上传当前成绩</button>
                <button class="sign-btn sign-normal" id="closeLeaderboard">关闭</button>
            </div>
        </div>
    `;

    leaderboardModal.innerHTML = html;
    document.body.appendChild(leaderboardModal);

    document.getElementById('closeLeaderboard').addEventListener('click', () => {
        document.body.removeChild(leaderboardModal);
    });

    document.getElementById('uploadToLeaderboard').addEventListener('click', () => {
        const message = uploadToLeaderboard(gameState.floor, gameState.gold);
        addLog(message, 'info');
        updateUI();
    });
}

// 重新开始
export function handleRestartGame() {
    if (autoBattleInterval) {
        clearInterval(autoBattleInterval);
        autoBattleInterval = null;
    }
    
    hideGameOver();
    clearSave();
    resetGameState();
    document.getElementById('logPanel').innerHTML = '';
    gameState.isAutoBattle = false;
    initGame();
}

// 战斗胜利
export function handleBattleWin() {
    console.log('Battle win!');
    const result = winBattle();

    const lang = getCurrentLanguage();
    const t = translations[lang];
    const typeText = t.battleLogs[`type${result.type.charAt(0).toUpperCase() + result.type.slice(1)}`] || t.battleLogs.typeMonster;
    let message = `🎉 ${t.battleLogs.defeated}${typeText}${t.battleLogs.goldEarned} <span style="color: #eab308;">${result.gold}</span> ${t.battleLogs.goldUnit}`;

    if (result.droppedEquipment) {
        message += `<br>⚔️ ${t.battleLogs.obtainedEquipment} <span style="color: ${RARITY_COLORS[result.droppedEquipment.rarity]};">${result.droppedEquipment.name}</span>`;
        if (result.improvement) {
            message += ` <span style="color: #22c55e;">(+${result.improvement}%)</span>`;
        }
    } else if (result.equipReason) {
        message += `<br>⚔️ 获得装备: ${result.equipReason}，已自动销毁`;
    }

    if (result.droppedArtifact) {
        message += `<br>★ 获得遗物: <span style="color: #eab308;">${result.droppedArtifact.name}</span> - ${result.droppedArtifact.description}`;
    }

    if (result.newSpells && result.newSpells.length > 0) {
        message += `<br>✨ 学习了法术: ${result.newSpells.join('，')}`;
    }

    addLog(message, result.type === 'boss' ? 'boss' : 'item');
    updateUI();
}

// 开启新商店（展示6件装备）
function openNewShop(wasAutoBattle = false) {
    const shopItems = generateShopItems();
    showShopModal(shopItems, wasAutoBattle);
}

// 生成商店装备
function generateShopItems() {
    const items = [];
    const allEquipment = [];

    // 收集所有装备
    ['helmets', 'armors', 'oneHandWeapons', 'twoHandWeapons', 'gloves', 'boots', 'rings'].forEach(type => {
        allEquipment.push(...EQUIPMENT[type].filter(e => e.price > 0));
    });

    // 计算当前楼层区间（每20层为一个商店区间）
    // 如果在第200层遇到商店，则按照180-200层的怪物掉落金币总和来计算
    const shopFloorBase = Math.floor((gameState.floor - 1) / 20) * 20 + 1;
    const shopFloorEnd = shopFloorBase + 20;

    // 计算该楼层区间20层怪物掉落金币总和
    // 假设每层约遇怪50%（MONSTER_SPAWN_RATE）
    // 怪物掉落金币 = floor * 3
    const avgGoldPerFloor = shopFloorBase * 3 * 0.5; // 平均每层获得金币
    const totalGoldIn20Floors = avgGoldPerFloor * 20;

    // 商店总价为区间金币总和的90%-120%
    const minTotal = totalGoldIn20Floors * 0.9;
    const maxTotal = totalGoldIn20Floors * 1.2;
    const targetTotal = minTotal + Math.random() * (maxTotal - minTotal);

    // 生成6件装备，分配价格
    for (let i = 0; i < 6; i++) {
        const item = allEquipment[Math.floor(Math.random() * allEquipment.length)];
        const basePrice = item.price;
        // 按照targetTotal的比例分配价格
        const priceScale = targetTotal / (6 * basePrice * (1 + Math.random() * 0.2));
        items.push({
            item: item,
            price: Math.floor(basePrice * priceScale)
        });
    }

    return items;
}

// 显示商店弹窗
function showShopModal(items, wasAutoBattle = false) {
    const shopModal = document.createElement('div');
    shopModal.className = 'sign-in-modal';
    shopModal.style.zIndex = '10001';
    shopModal.style.display = 'flex';

    const totalCost = items.reduce((sum, item) => sum + item.price, 0);

    let html = `
        <div class="sign-in-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <h3>🏪 装备商店</h3>
            <p>当前金币: ${gameState.gold}💰</p>
            <div class="shop-items-grid">
    `;

    items.forEach((shopItem, index) => {
        const item = shopItem.item;

        // 获取玩家当前该部位的装备
        let currentEquipment = null;
        const slotType = item.type;
        if (slotType === 'helmets') currentEquipment = gameState.equipment.helmet;
        else if (slotType === 'armors') currentEquipment = gameState.equipment.armor;
        else if (slotType === 'oneHand') {
            // 单手武器需要判断左右手
            if (!gameState.equipment.rightHand || gameState.equipment.rightHand.type === 'twoHand') {
                currentEquipment = gameState.equipment.leftHand;
            } else {
                // 右手有单手武器，取两者中较弱的
                const leftScore = calculateEquipmentScore(gameState.equipment.leftHand, gameState.floor);
                const rightScore = calculateEquipmentScore(gameState.equipment.rightHand, gameState.floor);
                currentEquipment = leftScore <= rightScore ? gameState.equipment.leftHand : gameState.equipment.rightHand;
            }
        } else if (slotType === 'twoHand') {
            // 双手武器对比当前主武器
            currentEquipment = gameState.equipment.leftHand;
        } else if (slotType === 'gloves') currentEquipment = gameState.equipment.gloves;
        else if (slotType === 'boots') currentEquipment = gameState.equipment.boots;
        else if (slotType === 'ring') {
            // 戒指对比两个戒指中较弱的
            const ring1Score = calculateEquipmentScore(gameState.equipment.ring1, gameState.floor);
            const ring2Score = calculateEquipmentScore(gameState.equipment.ring2, gameState.floor);
            currentEquipment = ring1Score <= ring2Score ? gameState.equipment.ring1 : gameState.equipment.ring2;
        }

        // 计算装备分数对比
        const newItemScore = calculateEquipmentScore(item, gameState.floor);
        const currentScore = currentEquipment ? calculateEquipmentScore(currentEquipment, gameState.floor) : 0;
        const comparisonIcon = newItemScore > currentScore ? ' <span style="color: #22c55e;">↑</span>' : newItemScore < currentScore ? ' <span style="color: #ef4444;">↓</span>' : '';

        const stats = [
            item.attack > 0 ? `攻击+${item.attack}` : '',
            item.defense > 0 ? `防御+${item.defense}` : '',
            item.hp > 0 ? `生命+${item.hp}` : '',
            item.critRate > 0 ? `暴击+${item.critRate}%` : '',
            item.critDamage > 0 ? `暴击伤害+${(item.critDamage*100).toFixed(0)}%` : '',
            item.dodge > 0 ? `闪避+${item.dodge}%` : '',
            item.lifesteal > 0 ? `吸血+${(item.lifesteal*100).toFixed(1)}%` : ''
        ].filter(Boolean).join('、');

        html += `
            <div class="shop-item-card" data-index="${index}">
                <div class="shop-item-name" style="color: ${RARITY_COLORS[item.rarity]}">${item.name}${comparisonIcon}</div>
                <div class="shop-item-rarity">${RARITY_NAMES[item.rarity]}</div>
                <div class="shop-item-stats">${stats}</div>
                <div class="shop-item-price">💰 ${shopItem.price}</div>
                <button class="shop-item-btn">购买</button>
            </div>
        `;
    });

    html += `
            </div>
            <div class="sign-in-buttons">
                <button class="sign-btn sign-ad" id="buyAllAd">🎬 看广告全部购买（不花钱）</button>
                <button class="sign-btn sign-normal" id="closeShop">离开商店</button>
            </div>
        </div>
    `;

    shopModal.innerHTML = html;
    document.body.appendChild(shopModal);

    // 绑定购买按钮
    shopModal.querySelectorAll('.shop-item-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => buyShopItem(items[index], shopModal, items));
    });

    // 看广告全部购买
    document.getElementById('buyAllAd').addEventListener('click', () => {
        if (confirm(`确定观看广告免费购买所有物品吗？（不花钱）\n只装备比你身上更好的装备\n共${items.length}件装备`)) {
            // 模拟观看广告
            alert('🎬 观看广告中...');

            let equippedCount = 0;
            let betterCount = 0;
            const betterItems = [];

            // 先找出所有比当前装备好的物品
            items.forEach(shopItem => {
                const item = shopItem.item;
                let currentEquipment = null;
                const slotType = item.type;

                // 获取当前该部位的装备
                if (slotType === 'helmets') currentEquipment = gameState.equipment.helmet;
                else if (slotType === 'armors') currentEquipment = gameState.equipment.armor;
                else if (slotType === 'oneHand') {
                    if (!gameState.equipment.rightHand || gameState.equipment.rightHand.type === 'twoHand') {
                        currentEquipment = gameState.equipment.leftHand;
                    } else {
                        const leftScore = calculateEquipmentScore(gameState.equipment.leftHand, gameState.floor);
                        const rightScore = calculateEquipmentScore(gameState.equipment.rightHand, gameState.floor);
                        currentEquipment = leftScore <= rightScore ? gameState.equipment.leftHand : gameState.equipment.rightHand;
                    }
                } else if (slotType === 'twoHand') {
                    currentEquipment = gameState.equipment.leftHand;
                } else if (slotType === 'gloves') currentEquipment = gameState.equipment.gloves;
        else if (slotType === 'boots') currentEquipment = gameState.equipment.boots;
        else if (slotType === 'necklace') currentEquipment = gameState.equipment.necklace;
        else if (slotType === 'ring') {
            currentEquipment = gameState.equipment.ring1;
        }

                // 比较装备分数
                const newItemScore = calculateEquipmentScore(item, gameState.floor);
                const currentScore = currentEquipment ? calculateEquipmentScore(currentEquipment, gameState.floor) : 0;

                if (newItemScore > currentScore) {
                    betterCount++;
                    betterItems.push(item);
                }
            });

            // 只装备更好的装备
            betterItems.forEach(item => {
                equipObtainedItem(item);
                equippedCount++;
            });

            addLog(`🎬 通过广告免费获得了${items.length}件装备！`, 'item');
            if (betterCount > 0) {
                addLog(`✨ 其中${betterCount}件装备比你当前装备更好，已自动装备！`, 'info');
            } else {
                addLog(`没有装备比你当前的装备更好，已全部销毁。`, 'info');
            }
            updateUI();
            closeShopModal(shopModal, wasAutoBattle);
        }
    });

    // 离开商店
    document.getElementById('closeShop').addEventListener('click', () => {
        closeShopModal(shopModal, wasAutoBattle);
    });
}

// 关闭商店
function closeShopModal(shopModal, wasAutoBattle = false) {
    gameState.lastShopFloor = gameState.floor;
    saveGame();
    document.body.removeChild(shopModal);

    // 恢复自动战斗
    if (wasAutoBattle) {
        setTimeout(() => {
            gameState.isAutoBattle = true;
            const autoBtn = document.getElementById('autoBattleBtn');
            if (autoBtn) autoBtn.textContent = '⏸️ 停止战斗';
            addLog('▶️ 自动战斗继续！', 'info');
            startAutoBattleLoop();
        }, 500);
    }
}

// 购买商店物品
function buyShopItem(shopItem, modal, allItems) {
    if (gameState.gold < shopItem.price) {
        addLog('金币不足！', 'info');
        return;
    }

    updateGold(-shopItem.price);

    const equipResult = equipObtainedItem(shopItem.item);

    const stats = [
        shopItem.item.attack > 0 ? `攻击+${shopItem.item.attack}` : '',
        shopItem.item.defense > 0 ? `防御+${shopItem.item.defense}` : '',
        shopItem.item.hp > 0 ? `生命+${shopItem.item.hp}` : '',
        shopItem.item.critRate > 0 ? `暴击+${shopItem.item.critRate}%` : '',
        shopItem.item.critDamage > 0 ? `暴击伤害+${(shopItem.item.critDamage*100).toFixed(0)}%` : '',
        shopItem.item.dodge > 0 ? `闪避+${shopItem.item.dodge}%` : '',
        shopItem.item.lifesteal > 0 ? `吸血+${(shopItem.item.lifesteal*100).toFixed(1)}%` : ''
    ].filter(Boolean).join('、');

    addLog(`购买成功！${shopItem.item.name} - ${stats}`, 'item');

    // 先更新装备栏显示
    updateUI();

    // 禁用已购买按钮
    const itemCard = modal.querySelector(`.shop-item-card[data-index="${allItems.indexOf(shopItem)}"]`);
    if (itemCard) {
        const btn = itemCard.querySelector('.shop-item-btn');
        btn.disabled = true;
        btn.textContent = '已购买';
    }

    // 再次更新确保装备显示正确
    setTimeout(() => updateUI(), 100);
}
