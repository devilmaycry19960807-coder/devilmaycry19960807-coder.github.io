// 探索系统
import { gameState, updateHp, updateGold, saveGame, getTotalStats } from './gameState.js';
import { generateMonster, startBattle } from './battle.js';
import { GAME_CONFIG } from './config.js';
import { addLog } from './ui.js';

export function explore() {
    if (gameState.inBattle) return { success: false, message: '正在战斗中！' };

    const roll = Math.random();

    if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE) {
        // 遭遇怪物
        const monster = generateMonster();
        startBattle(monster);

        const typeText = monster.type === 'boss' ? 'BOSS' : monster.type === 'elite' ? '精英怪' : '怪物';

        return {
            success: true,
            type: 'monster',
            monster: monster,
            message: `遭遇了 ${monster.emoji}${monster.name}！${monster.description}`,
            battleType: monster.type
        };
    } else if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE + GAME_CONFIG.CHEST_SPAWN_RATE) {
        // 发现宝箱
        const goldFound = Math.floor(20 + Math.random() * 30 + gameState.floor * 3);

        // 显示宝箱翻倍选项
        showChestModal(goldFound);

        return {
            success: true,
            type: 'chest',
            message: `发现了宝箱！`,
            gold: goldFound
        };
    } else if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE + GAME_CONFIG.CHEST_SPAWN_RATE + GAME_CONFIG.FOUNTAIN_SPAWN_RATE) {
        // 发现生命之泉
        const stats = getTotalStats();
        const hpRestore = Math.floor(stats.maxHp * GAME_CONFIG.HEAL_PERCENT);
        updateHp(hpRestore);
        saveGame(); // 自动存档

        return {
            success: true,
            type: 'fountain',
            message: `发现了生命之泉，恢复 ${hpRestore} HP！`,
            hpRestore: hpRestore
        };
    } else {
        // 安全区域，休息恢复
        const stats = getTotalStats();
        const hpRestore = Math.floor(stats.maxHp * 0.05);
        updateHp(hpRestore);
        saveGame(); // 自动存档

        // 检查是否触发商店
        if (checkShopAccess()) {
            return {
                success: true,
                type: 'shop',
                message: `发现了一处安全的休息地，恢复了 ${hpRestore} HP。`,
                hpRestore: hpRestore,
                shouldShowShop: true
            };
        }

        return {
            success: true,
            type: 'rest',
            message: `发现了一处安全的休息地，恢复了 ${hpRestore} HP。`,
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
    // 暂停自动战斗
    const wasAuto = gameState.isAutoBattle;
    if (wasAuto) {
        gameState.isAutoBattle = false;
        const autoBtn = document.getElementById('autoBattleBtn');
        if (autoBtn) autoBtn.textContent = '▶️ 开始自动战斗';

        // 重置探索标志
        import('./game.js').then(m => {
            m.isExploring = false;
            console.log('Reset isExploring flag');
        });
    }

    const chestModal = document.createElement('div');
    chestModal.className = 'sign-in-modal';
    chestModal.innerHTML = `
        <div class="sign-in-content">
            <h3>🎁 发现宝箱</h3>
            <p>基础奖励：${goldFound} 金币</p>
            <div class="sign-in-buttons">
                <button class="sign-btn sign-normal" id="chestNormal">直接领取</button>
                <button class="sign-btn sign-ad" id="chestAd">📺 看广告翻10倍</button>
            </div>
        </div>
    `;
    document.body.appendChild(chestModal);

    document.getElementById('chestNormal').addEventListener('click', () => {
        updateGold(goldFound);
        saveGame();
        addLog(`💰 获得了 ${goldFound} 金币`, 'item');
        document.body.removeChild(chestModal);

        // 恢复自动战斗
        if (wasAuto) {
            gameState.isAutoBattle = true;
            const autoBtn = document.getElementById('autoBattleBtn');
            if (autoBtn) autoBtn.textContent = '⏸️ 停止战斗';
            addLog('▶️ 自动战斗继续！', 'info');
            updateUI();
            // 从 game.js 导入的 startAutoBattleLoop
            import('./game.js').then(m => m.startAutoBattleLoop());
        }
    });

    document.getElementById('chestAd').addEventListener('click', () => {
        addLog('📺 正在播放广告...', 'info');
        setTimeout(() => {
            const finalGold = goldFound * 10;
            updateGold(finalGold);
            saveGame();
            addLog(`💎 奖励翻倍！获得 ${finalGold} 金币！`, 'item');
            document.body.removeChild(chestModal);

            // 恢复自动战斗
            if (wasAuto) {
                gameState.isAutoBattle = true;
                const autoBtn = document.getElementById('autoBattleBtn');
                if (autoBtn) autoBtn.textContent = '⏸️ 停止战斗';
                addLog('▶️ 自动战斗继续！', 'info');
                updateUI();
                import('./game.js').then(m => m.startAutoBattleLoop());
            }
        }, 1000);
    });
}

export function heal(times = 1) {
    const totalCost = GAME_CONFIG.HEAL_COST * times;

    if (gameState.gold < totalCost) {
        return { success: false, message: '金币不足！' };
    }

    if (gameState.hp >= gameState.maxHp) {
        return { success: false, message: '血量已满！' };
    }

    updateGold(-totalCost);
    const healAmount = Math.floor(gameState.maxHp * GAME_CONFIG.HEAL_PERCENT * times);
    updateHp(healAmount);
    saveGame(); // 自动存档

    return {
        success: true,
        message: `花费${totalCost}金币，恢复了 ${healAmount} HP！`,
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
