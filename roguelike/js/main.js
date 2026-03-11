// 主入口文件
import * as Game from './game.js';
import { Monetization } from './monetization.js';

console.log('Main script loaded');

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game');
    Game.initGame();

    // 绑定事件监听器
    const autoBattleBtn = document.getElementById('autoBattleBtn');
    if (autoBattleBtn) {
        console.log('Attaching auto battle button');
        autoBattleBtn.addEventListener('click', () => {
            console.log('Auto battle button clicked');
            Game.handleAutoBattle();
        });
    } else {
        console.error('Auto battle button not found');
    }

    const toggleStatsBtn = document.getElementById('toggleStatsBtn');
    if (toggleStatsBtn) {
        toggleStatsBtn.addEventListener('click', Game.toggleStatsPanel);
    }

    // 暴露法术函数到全局作用域
    window.castSpell = Game.handleCastSpell;

    // 游戏结束重新开始按钮
    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            Game.handleRestartGame();
        });
    }

    // 广告功能按钮
    const adReviveBtn = document.getElementById('adReviveBtn');
    if (adReviveBtn) {
        adReviveBtn.addEventListener('click', () => {
            Monetization.watchAdToRevive();
        });
    }

    const adSpeedBtn = document.getElementById('adSpeedBtn');
    if (adSpeedBtn) {
        adSpeedBtn.addEventListener('click', () => {
            Monetization.watchAdForSpeedBoost();
        });
    }

    const adRecoveryBtn = document.getElementById('adRecoveryBtn');
    if (adRecoveryBtn) {
        adRecoveryBtn.addEventListener('click', () => {
            Monetization.watchAdForFullRecovery();
        });
    }

    const adGameOverReviveBtn = document.getElementById('adGameOverReviveBtn');
    if (adGameOverReviveBtn) {
        adGameOverReviveBtn.addEventListener('click', () => {
            Monetization.watchAdToRevive();
        });
    }

    console.log('All event listeners attached');
});
