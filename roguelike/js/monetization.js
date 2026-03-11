// 变现功能模块
import { gameState, saveGame } from './gameState.js';
import { updateUI, addLog } from './ui.js';
import { AdProvider } from './adProvider.js';

export const Monetization = {
    // 看广告原地复活
    watchAdToRevive: function() {
        if (!AdProvider.isAdAvailable('rewarded')) {
            addLog('广告暂时不可用，稍后再试', 'info');
            return;
        }

        AdProvider.showRewardedAd({
            onReward: () => {
                // 原地复活，不回退层数
                gameState.hp = gameState.maxHp;
                gameState.mp = gameState.maxMp;
                addLog('🎉 复活成功！生命值和法力值已完全恢复！', 'info');
                saveGame();
                updateUI();
            },
            onError: () => {
                addLog('广告加载失败，请稍后再试', 'info');
            },
            onClose: () => {
                addLog('已取消复活，回退一层', 'info');
            }
        });
    },

    // 看广告2倍自动战斗速度
    watchAdForSpeedBoost: function() {
        if (!AdProvider.isAdAvailable('rewarded')) {
            addLog('广告暂时不可用，稍后再试', 'info');
            return;
        }

        if (gameState.speedBoostTime && gameState.speedBoostTime > Date.now()) {
            addLog('加速效果仍在持续中！', 'info');
            return;
        }

        AdProvider.showRewardedAd({
            onReward: () => {
                // 2倍速度持续30分钟
                gameState.speedBoostTime = Date.now() + 30 * 60 * 1000;
                gameState.combatSpeed = 600; // 从1200ms降到600ms
                addLog('⚡ 自动战斗速度提升2倍！持续30分钟！', 'info');
                saveGame();
                updateUI();
            },
            onError: () => {
                addLog('广告加载失败，请稍后再试', 'info');
            }
        });
    },

    // 检查加速效果是否过期
    checkSpeedBoost: function() {
        if (gameState.speedBoostTime && gameState.speedBoostTime <= Date.now()) {
            gameState.speedBoostTime = 0;
            gameState.combatSpeed = 1200; // 恢复默认速度
            addLog('⏱️ 加速效果已过期', 'info');
            saveGame();
        }
        return gameState.combatSpeed || 1200;
    },

    // 看广告刷新商店（提升稀有装备概率）
    watchAdToRefreshShop: function(shopItems) {
        if (!AdProvider.isAdAvailable('rewarded')) {
            addLog('广告暂时不可用，稍后再试', 'info');
            return shopItems;
        }

        AdProvider.showRewardedAd({
            onReward: () => {
                addLog('🎊 商店已刷新！出现稀有装备的概率大幅提升！', 'info');
                // 返回刷新标记
                return { refreshed: true };
            },
            onError: () => {
                addLog('广告加载失败，请稍后再试', 'info');
                return { refreshed: false };
            }
        });
    },

    // 看广告获取额外金币
    watchAdForBonusGold: function(baseAmount) {
        if (!AdProvider.isAdAvailable('rewarded')) {
            addLog('广告暂时不可用，稍后再试', 'info');
            return baseAmount;
        }

        AdProvider.showRewardedAd({
            onReward: () => {
                const bonusAmount = baseAmount * 2;
                gameState.gold += bonusAmount;
                addLog(`💎 观看广告获得额外奖励：${bonusAmount} 金币！`, 'info');
                saveGame();
                updateUI();
                return bonusAmount;
            },
            onError: () => {
                addLog('广告加载失败，请稍后再试', 'info');
                return baseAmount;
            }
        });
    },

    // 显示插屏广告（关键节点）
    showInterstitial: function(context = '') {
        if (!AdProvider.isAdAvailable('interstitial')) {
            return;
        }

        // 避免频繁显示
        const now = Date.now();
        if (gameState.lastInterstitial && now - gameState.lastInterstitial < 60000) {
            return; // 1分钟内不重复显示
        }

        AdProvider.showInterstitialAd({
            onClose: () => {
                gameState.lastInterstitial = Date.now();
            }
        });
    },

    // 看广告全满状态恢复
    watchAdForFullRecovery: function() {
        if (!AdProvider.isAdAvailable('rewarded')) {
            addLog('广告暂时不可用，稍后再试', 'info');
            return;
        }

        AdProvider.showRewardedAd({
            onReward: () => {
                gameState.hp = gameState.maxHp;
                gameState.mp = gameState.maxMp;
                addLog('✨ 生命值和法力值已完全恢复！', 'info');
                saveGame();
                updateUI();
            },
            onError: () => {
                addLog('广告加载失败，请稍后再试', 'info');
            }
        });
    },

    // 检查是否显示插屏广告
    shouldShowInterstitial: function(floor, eventType) {
        // 击败BOSS后
        if (eventType === 'boss') {
            return Math.random() < 0.5; // 50%概率
        }
        // 每10层
        if (eventType === 'rest' && floor % 10 === 0) {
            return Math.random() < 0.3; // 30%概率
        }
        return false;
    }
};
