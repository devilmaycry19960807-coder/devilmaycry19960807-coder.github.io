// 每日签到系统
import { gameState, updateGold, getTotalStats } from './gameState.js';

export function checkDailyReward() {
    const today = new Date().toDateString();
    const lastSignIn = localStorage.getItem('lastSignIn');

    if (lastSignIn !== today) {
        const streak = parseInt(localStorage.getItem('signInStreak')) || 0;
        const newStreak = streak >= 7 ? 1 : streak + 1;

        localStorage.setItem('signInStreak', newStreak);
        localStorage.setItem('lastSignIn', today);

        return {
            canSignIn: true,
            day: newStreak,
            streak: newStreak
        };
    }

    return {
        canSignIn: false,
        day: parseInt(localStorage.getItem('signInStreak')) || 1
    };
}

export function getDailyReward(day) {
    const rewards = {
        1: { gold: 100 },
        2: { gold: 150 },
        3: { gold: 200 },
        4: { gold: 250 },
        5: { gold: 300 },
        6: { gold: 350 },
        7: { gold: 500, equipment: true } // 第7天额外送装备
    };
    return rewards[day] || rewards[1];
}

export function claimDailyReward(watchAd = false) {
    const today = new Date().toDateString();
    const lastClaimed = localStorage.getItem('lastClaimed');

    if (lastClaimed === today) {
        return { success: false, message: '今日已签到' };
    }

    const streak = parseInt(localStorage.getItem('signInStreak')) || 0;
    const day = streak >= 7 ? 7 : streak + 1;
    const reward = getDailyReward(day);

    // 看广告翻倍
    const multiplier = watchAd ? 10 : 1;
    const goldReward = reward.gold * multiplier;

    updateGold(goldReward);

    let message = `📅 签到第${day}天！获得 ${goldReward} 金币`;

    if (reward.equipment && watchAd) {
        message += ' + 随机装备';
    }

    localStorage.setItem('lastClaimed', today);

    return {
        success: true,
        message,
        gold: goldReward,
        equipment: reward.equipment && watchAd
    };
}

export function getSignInInfo() {
    const streak = parseInt(localStorage.getItem('signInStreak')) || 0;
    const lastSignIn = localStorage.getItem('lastSignIn');
    const lastClaimed = localStorage.getItem('lastClaimed');

    const today = new Date().toDateString();
    const canSignIn = lastSignIn !== today && lastClaimed !== today;

    return {
        streak,
        canSignIn,
        nextReward: getDailyReward(canSignIn ? (streak >= 7 ? 1 : streak + 1) : streak),
        lastSignIn
    };
}
