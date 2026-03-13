// 探索系统
import { gameState, updateHp, updateGold, saveGame, getTotalStats } from './gameState.js';
import { generateMonster, startBattle } from './battle.js';
import { GAME_CONFIG } from './config.js';
import { addLog, updateUI } from './ui.js';
import { getCurrentLanguage, translations } from './i18n.js';

export function explore() {
    if (gameState.inBattle) return { success: false, message: '正在战斗中！' };

    const roll = Math.random();
    const lang = getCurrentLanguage();
    const t = translations[lang];

    if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE) {
        // 遭遇怪物
        const monster = generateMonster();
        startBattle(monster);

        const typeText = t.battleLogs[`type${monster.type.charAt(0).toUpperCase() + monster.type.slice(1)}`] || t.battleLogs.typeMonster;

        return {
            success: true,
            type: 'monster',
            monster: monster,
            message: `${t.battleLogs.encountered} ${monster.emoji}${monster.name}！${monster.description}`,
            battleType: monster.type
        };
    } else if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE + GAME_CONFIG.CHEST_SPAWN_RATE) {
        // 发现宝箱
        const goldFound = Math.floor(20 + Math.random() * 30 + gameState.floor * 3);

        // 显示宝箱翻倍选项
        showChestModal(goldFound);

        // 宝箱不算探索，不增加楼层
        return {
            success: true,
            type: 'chest',
            message: t.explorationLogs.foundChest,
            gold: goldFound,
            noFloorIncrement: true
        };
    } else if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE + GAME_CONFIG.CHEST_SPAWN_RATE + GAME_CONFIG.FOUNTAIN_SPAWN_RATE) {
        // 发现生命之泉
        const stats1 = getTotalStats();
        const hpRestore = Math.floor(stats1.maxHp * GAME_CONFIG.HEAL_PERCENT);
        updateHp(hpRestore);
        saveGame(); // 自动存档

        // 泉水不算探索，不增加楼层
        return {
            success: true,
            type: 'fountain',
            message: t.explorationLogs.foundFountain.replace('HP', hpRestore),
            hpRestore: hpRestore,
            noFloorIncrement: true
        };
    } else {
        // 安全区域，休息恢复
        const stats2 = getTotalStats();
        const hpRestore = Math.floor(stats2.maxHp * 0.05);
        updateHp(hpRestore);
        saveGame(); // 自动存档

        // 检查是否触发商店
        if (checkShopAccess()) {
            return {
                success: true,
                type: 'shop',
                message: t.explorationLogs.foundShop.replace('HP', hpRestore),
                hpRestore: hpRestore,
                shouldShowShop: true
            };
        }

        return {
            success: true,
            type: 'rest',
            message: t.explorationLogs.foundRest.replace('HP', hpRestore),
            hpRestore: hpRestore
        };
    }
}

// 检查商店访问（每20层必有一次）
export function checkShopAccess() {
    console.log('检查商店访问，当前楼层:', gameState.floor, '上次商店楼层:', gameState.lastShopFloor);

    if (!gameState.lastShopFloor) {
        gameState.lastShopFloor = 0;
    }

    const floorsSinceLastShop = gameState.floor - gameState.lastShopFloor;

    console.log('距离上次商店层数:', floorsSinceLastShop);

    // 每满20层必有一次商店
    if (floorsSinceLastShop >= 20) {
        console.log('触发商店！');
        // 更新lastShopFloor，防止重复触发
        gameState.lastShopFloor = gameState.floor;
        return true;
    }

    return false;
}

// 显示宝箱翻倍选项
function showChestModal(goldFound) {
    const lang = getCurrentLanguage();
    const t = translations[lang];

    // 暂停自动战斗
    const wasAuto = gameState.isAutoBattle;
    if (wasAuto) {
        gameState.isAutoBattle = false;
        const autoBtn = document.getElementById('autoBattleBtn');
        if (autoBtn) autoBtn.textContent = '▶️ 开始自动战斗';

        // 重置探索标志
        import('./game.js').then(m => {
            m.resetExploringFlag();
            console.log('Reset isExploring flag');
        });
    }

    const chestModal = document.createElement('div');
    chestModal.className = 'sign-in-modal';
    const title = lang === 'zh' ? '🎁 发现宝箱' : '🎁 Treasure Chest Found';
    const baseReward = lang === 'zh' ? `基础奖励：${goldFound} 金币` : `Base reward: ${goldFound} gold`;
    const claim = lang === 'zh' ? '直接领取' : 'Claim';
    const watchAd = lang === 'zh' ? '📺 看广告翻10倍' : '📺 Watch Ad x10';

    chestModal.innerHTML = `
        <div class="sign-in-content">
            <h3>${title}</h3>
            <p>${baseReward}</p>
            <div class="sign-in-buttons">
                <button class="sign-btn sign-normal" id="chestNormal">${claim}</button>
                <button class="sign-btn sign-ad" id="chestAd">${watchAd}</button>
            </div>
        </div>
    `;
    document.body.appendChild(chestModal);

    document.getElementById('chestNormal').addEventListener('click', () => {
        updateGold(goldFound);
        saveGame();
        addLog(t.explorationLogs.goldEarned.replace('GOLD', goldFound), 'item');
        document.body.removeChild(chestModal);

        // 恢复自动战斗
        if (wasAuto) {
            gameState.isAutoBattle = true;
            const autoBtn = document.getElementById('autoBattleBtn');
            if (autoBtn) autoBtn.textContent = t.explorationLogs.stopBattle;
            addLog(t.explorationLogs.autoBattleContinue, 'info');
            updateUI();
            // 从 game.js 导入的 startAutoBattleLoop，强制重置探索标志
            import('./game.js').then(m => {
                m.startAutoBattleLoop(true);
            });
        }
    });

    document.getElementById('chestAd').addEventListener('click', () => {
        addLog(t.explorationLogs.playingAd, 'info');
        setTimeout(() => {
            const finalGold = goldFound * 10;
            updateGold(finalGold);
            saveGame();
            addLog(t.explorationLogs.rewardDoubled.replace('GOLD', finalGold), 'item');
            document.body.removeChild(chestModal);

            // 恢复自动战斗
            if (wasAuto) {
                gameState.isAutoBattle = true;
                const autoBtn = document.getElementById('autoBattleBtn');
                if (autoBtn) autoBtn.textContent = t.explorationLogs.stopBattle;
                addLog(t.explorationLogs.autoBattleContinue, 'info');
                updateUI();
                import('./game.js').then(m => {
                    m.startAutoBattleLoop(true);
                });
            }
        }, 1000);
    });
}

export function heal(times = 1) {
    const totalCost = GAME_CONFIG.HEAL_COST * times;
    const lang = getCurrentLanguage();
    const t = translations[lang];

    if (gameState.gold < totalCost) {
        return { success: false, message: t.explorationLogs.notEnoughGold };
    }

    if (gameState.hp >= gameState.maxHp) {
        return { success: false, message: t.explorationLogs.hpFull };
    }

    updateGold(-totalCost);
    const healAmount = Math.floor(gameState.maxHp * GAME_CONFIG.HEAL_PERCENT * times);
    updateHp(healAmount);
    saveGame(); // 自动存档

    return {
        success: true,
        message: t.explorationLogs.spentGoldHeal.replace('COST', totalCost).replace('HEAL', healAmount),
        healAmount: healAmount,
        cost: totalCost
    };
}

// 计算批量购买次数
export function calculateBatchMultiplier(baseCost) {
    if (gameState.gold >= baseCost * 100) return 100;
    if (gameState.gold >= baseCost * 50) return 50;
    if (gameState.gold >= baseCost * 20) return 20;
    if (gameState.gold >= baseCost * 10) return 10;
    if (gameState.gold >= baseCost * 5) return 5;
    return 1;
}
