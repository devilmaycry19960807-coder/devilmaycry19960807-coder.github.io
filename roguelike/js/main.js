// 主入口文件
import * as Game from './game.js';
import { Monetization } from './monetization.js';
import { toggleLanguage, initI18n, getCurrentLanguage } from './i18n.js';

console.log('Main script loaded');

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game');

    // 初始化国际化
    initI18n();

    // 更新语言切换按钮文字
    updateLangButton();

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

    // 语言切换按钮
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            toggleLanguage();
            updateLangButton();
        });
    }

    console.log('All event listeners attached');
});

// 更新语言按钮文字
function updateLangButton() {
    const lang = getCurrentLanguage();
    const btn = document.getElementById('langToggleBtn');
    if (btn) {
        btn.textContent = lang === 'zh' ? '🌐 中文' : '🌐 EN';
    }
}
