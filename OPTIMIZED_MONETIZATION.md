# 优化版0成本变现方案

## 💰 核心变现点（精简版）

### 1. 激励视频广告（保留3个最有效的）

| 功能 | 效果 | 提升体验 |
|------|------|---------|
| **复活** | 看广告原地复活，不回退层数 | 保留进度，避免挫败感 |
| **宝箱翻倍** | 看广告金币奖励翻10倍 | 快速积累资源 |
| **战斗加速** | 看广告2倍速自动战斗 | 节省时间，提升效率 |

### 2. Banner广告（底部固定）
- 位置：页面底部
- 尺寸：728x90 或 320x50（响应式）
- 体验：不影响核心玩法

## 🎮 游戏机制优化

### 1. 移除插屏广告
- ❌ 不在关键节点插入广告
- ✅ 保持游戏流畅体验
- ✅ 广告完全可控，玩家主动选择

### 2. 装备评分系统（自动择优替换）

**评分公式：**
```javascript
function calculateEquipmentScore(item, floor) {
    let score = 0;

    // 基础属性（根据楼层权重调整）
    const floorMultiplier = 1 + (floor / 100); // 每100层评分提升1倍
    score += item.attack * 2 * floorMultiplier;
    score += item.defense * 1.5 * floorMultiplier;
    score += item.hp * 0.1 * floorMultiplier;

    // 高级属性（更高权重）
    score += item.critRate * 10;
    score += item.critDamage * 200;
    score += item.dodge * 15;
    score += item.lifesteal * 300; // 吸血最值钱

    // 稀有度加成
    const rarityBonus = {
        common: 1,
        uncommon: 1.5,
        rare: 2,
        legendary: 3
    };
    score *= rarityBonus[item.rarity];

    // 添加一些随机性，避免完全固定
    score *= (0.9 + Math.random() * 0.2);

    return Math.floor(score);
}
```

**自动替换逻辑：**
```javascript
function autoEquipItem(newItem) {
    const currentScore = calculateEquipmentScore(currentItem, gameState.floor);
    const newScore = calculateEquipmentScore(newItem, gameState.floor);

    if (newScore > currentScore) {
        // 显示替换提示
        const improvement = ((newScore / currentScore - 1) * 100).toFixed(1);
        addLog(`⚔️ 自动装备：${newItem.name} 提升 ${improvement}%！`, 'item');
        gameState.equipment[slot] = newItem;
        return true;
    }

    // 虽然分数低但显示原因（可选）
    const decline = ((currentScore / newScore - 1) * 100).toFixed(1);
    addLog(`❌ ${newItem.name} 比当前装备弱 ${decline}%，已自动销毁`, 'info');
    return false;
}
```

### 3. 每日签到系统（简化版）

```javascript
每日签到奖励（不看广告）：
第1天：100金币
第2天：150金币
第3天：200金币
第4天：250金币
第5天：300金币
第6天：350金币
第7天：500金币 + 随机装备

看广告翻倍（可选）：
- 所有签到奖励可看广告翻10倍
- 玩家自主选择，不强求
```

### 4. 装备掉落难度曲线

**当前层数 vs 装备强度：**

| 层数范围 | 掉落装备稀有度概率 | 说明 |
|---------|------------------|------|
| 1-10层 | 普通80%，优秀15%，稀有5% | 初始装备 |
| 11-30层 | 普通60%，优秀30%，稀有9%，传说1% | 逐渐提升 |
| 31-60层 | 普通40%，优秀40%，稀有18%，传说2% | 高级装备 |
| 61-100层 | 普通20%，优秀50%，稀有25%，传说5% | 传说级常见 |
| 101+层 | 普通10%，优秀50%，稀有35%，传说5% | 深度优化 |

**实现代码：**
```javascript
function getDropRarity(floor) {
    const roll = Math.random();

    if (floor <= 10) {
        if (roll < 0.80) return 'common';
        if (roll < 0.95) return 'uncommon';
        return 'rare';
    } else if (floor <= 30) {
        if (roll < 0.60) return 'common';
        if (roll < 0.90) return 'uncommon';
        if (roll < 0.99) return 'rare';
        return 'legendary';
    } else if (floor <= 60) {
        if (roll < 0.40) return 'common';
        if (roll < 0.80) return 'uncommon';
        if (roll < 0.98) return 'rare';
        return 'legendary';
    } else if (floor <= 100) {
        if (roll < 0.20) return 'common';
        if (roll < 0.70) return 'uncommon';
        if (roll < 0.95) return 'rare';
        return 'legendary';
    } else {
        if (roll < 0.10) return 'common';
        if (roll < 0.60) return 'uncommon';
        if (roll < 0.95) return 'rare';
        return 'legendary';
    }
}
```

### 5. 每日任务（可选，增加粘性）

```
每日任务（完成后获得金币）：
- [ ] 探索10层 → 200金币
- [ ] 击败5只精英怪 → 300金币
- [ ] 击败1只BOSS → 500金币
- [ ] 使用10次法术 → 150金币
- [ ] 自动战斗100回合 → 250金币

看广告翻倍（可选）：
- 任何任务奖励都可看广告翻10倍
```

## 🔧 具体实现方案

### 第1步：添加广告SDK（30分钟）

**推荐平台：**
1. **百度联盟**（首选）
   - 审核快（2-3天）
   - eCPM高（¥25-40）
   - 结算稳定

2. **Google AdSense**（备选）
   - 适合海外用户
   - eCPM更高（$5-15）
   - 审核严格

**接入代码：**
```html
<!-- 在index.html中添加广告SDK -->
<script>
// 百度联盟示例
(function() {
    var s = "_" + Math.random().toString(36).slice(2);
    document.write('<div id="' + s + '"></div>');
    (window.slotbydup = window.slotbydup || []).push({
        id: 'your-slot-id',
        container: s,
        size: '728,90',
        display: 'inlay-fix'
    });
})();
</script>
<script src="https://cpro.baidustatic.com/cpro/ui/c.js" async></script>

<!-- 激励视频SDK -->
<script>
function showRewardedAd(onReward, onFail) {
    // 调用广告平台API
    window.cpro_api.showRewardedAd({
        onReward: onReward,
        onFail: onFail,
        onClose: function() {
            onFail && onFail();
        }
    });
}
</script>
```

### 第2步：实现3个激励视频功能（1小时）

#### 功能1：复活
```javascript
// 在game.js的handleGameOver函数中修改
export function handleGameOver() {
    const wasAutoBattle = gameState.isAutoBattle;

    // 显示复活选项
    const reviveBtn = createButton('💀 看广告复活（不回退层数）', () => {
        showRewardedAd(
            () => {
                // 广告奖励
                const stats = getTotalStats();
                gameState.hp = stats.maxHp;
                gameState.mp = stats.maxMp;

                addLog('✨ 复活成功！继续挑战！', 'info');
                updateUI();

                if (wasAutoBattle) {
                    setTimeout(() => {
                        performAutoCombat();
                    }, 500);
                }
            },
            () => {
                // 正常死亡流程
                retreatOneFloor();
            }
        );
    });

    // 或者点击其他地方正常死亡
    setTimeout(() => {
        if (!reviveBtn.clicked) {
            retreatOneFloor();
        }
    }, 5000); // 5秒后自动选择死亡
}
```

#### 功能2：宝箱翻倍
```javascript
// 在exploration.js中修改宝箱逻辑
} else if (roll < GAME_CONFIG.MONSTER_SPAWN_RATE + GAME_CONFIG.CHEST_SPAWN_RATE) {
    const baseGold = Math.floor(20 + Math.random() * 30 + gameState.floor * 3);
    const doubleBtn = createButton('🎁 看广告翻10倍奖励', () => {
        showRewardedAd(
            () => {
                const finalGold = baseGold * 10;
                updateGold(finalGold);
                addLog(`💎 奖励翻倍！获得 ${finalGold} 金币！`, 'item');
                saveGame();
            },
            () => {
                updateGold(baseGold);
                addLog(`💰 获得了 ${baseGold} 金币`, 'item');
                saveGame();
            }
        );
    });

    // 5秒后如果不点击就默认获得基础奖励
    setTimeout(() => {
        if (!doubleBtn.clicked) {
            updateGold(baseGold);
            addLog(`💰 获得了 ${baseGold} 金币`, 'item');
            saveGame();
        }
    }, 5000);

    return {
        success: true,
        type: 'chest',
        message: `发现了宝箱！`,
        gold: baseGold
    };
}
```

#### 功能3：战斗加速
```javascript
// 在game.js中修改自动战斗速度
let combatSpeed = 1200; // 默认1.2秒

export function watchAdToSpeedUp() {
    if (!gameState.isAutoBattle) return;

    showRewardedAd(
        () => {
            combatSpeed = 600; // 加速到0.6秒
            addLog('⚡ 战斗加速已激活！持续5分钟', 'info');
            updateUI();

            // 5分钟后恢复正常速度
            setTimeout(() => {
                combatSpeed = 1200;
                addLog('战斗加速效果结束', 'info');
            }, 300000);
        },
        () => {
            addLog('广告观看失败', 'info');
        }
    );
}

// 在performAutoCombat中使用combatSpeed
combatInterval = setInterval(() => {
    // ... existing code ...
}, combatSpeed);
```

### 第3步：添加底部Banner广告（20分钟）

```html
<!-- 在index.html的container div最后添加 -->
<div class="banner-ad-container">
    <div id="banner-ad"></div>
</div>
```

```css
/* 在style.css中添加 */
.banner-ad-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    text-align: center;
    z-index: 9999;
}

#banner-ad {
    max-width: 728px;
    height: 90px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    #banner-ad {
        height: 50px;
    }
}
```

### 第4步：实现装备评分系统（30分钟）

```javascript
// 在equipment.js中添加评分函数
export function calculateEquipmentScore(item, floor = 1) {
    let score = 0;

    // 楼层权重（深层掉落更强）
    const floorMultiplier = 1 + (floor / 200);

    // 基础属性
    score += (item.attack || 0) * 2 * floorMultiplier;
    score += (item.defense || 0) * 1.5 * floorMultiplier;
    score += (item.hp || 0) * 0.15 * floorMultiplier;

    // 高级属性（更高价值）
    score += (item.critRate || 0) * 12;
    score += (item.critDamage || 0) * 250;
    score += (item.dodge || 0) * 18;
    score += (item.lifesteal || 0) * 350; // 吸血最值钱

    // 稀有度加成
    const rarityBonus = {
        common: 1,
        uncommon: 1.4,
        rare: 1.8,
        legendary: 2.5
    };
    score *= rarityBonus[item.rarity];

    return Math.floor(score);
}

// 在gameState.js中修改equipItem函数
export function equipItem(item, slot) {
    const currentItem = gameState.equipment[slot];
    if (!currentItem) {
        gameState.equipment[slot] = item;
        return { replaced: false };
    }

    const scoreCurrent = calculateEquipmentScore(currentItem, gameState.floor);
    const scoreNew = calculateEquipmentScore(item, gameState.floor);

    if (scoreNew > scoreCurrent) {
        const improvement = ((scoreNew / scoreCurrent - 1) * 100).toFixed(1);
        gameState.equipment[slot] = item;
        return {
            replaced: true,
            oldItem: currentItem,
            improvement: improvement
        };
    }

    const decline = ((scoreCurrent / scoreNew - 1) * 100).toFixed(1);
    return {
        replaced: false,
        reason: `比当前装备弱 ${decline}%`
    };
}
```

### 第5步：实现每日签到系统（1小时）

```javascript
// 新建dailyReward.js
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
    const lastSignIn = localStorage.getItem('lastSignIn');
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
        // 随机送一件优秀及以上装备
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
```

### 第6步：调整装备掉落概率（30分钟）

```javascript
// 在battle.js的winBattle函数中修改掉落逻辑
function getDropRarity(floor) {
    const roll = Math.random();

    if (floor <= 10) {
        if (roll < 0.80) return 'common';
        if (roll < 0.95) return 'uncommon';
        return 'rare';
    } else if (floor <= 30) {
        if (roll < 0.60) return 'common';
        if (roll < 0.90) return 'uncommon';
        if (roll < 0.99) return 'rare';
        return 'legendary';
    } else if (floor <= 60) {
        if (roll < 0.40) return 'common';
        if (roll < 0.80) return 'uncommon';
        if (roll < 0.98) return 'rare';
        return 'legendary';
    } else if (floor <= 100) {
        if (roll < 0.20) return 'common';
        if (roll < 0.70) return 'uncommon';
        if (roll < 0.95) return 'rare';
        return 'legendary';
    } else {
        if (roll < 0.10) return 'common';
        if (roll < 0.60) return 'uncommon';
        if (roll < 0.95) return 'rare';
        return 'legendary';
    }
}

// 在BOSS/精英掉落时使用
if ((monster.type === 'boss' || monster.type === 'elite')) {
    const slotType = slotTypes[Math.floor(Math.random() * slotTypes.length)];

    // 根据楼层筛选稀有度
    const minRarity = getDropRarity(gameState.floor);
    let pool = EQUIPMENT[slotType].filter(item => {
        if (minRarity === 'legendary') return true;
        if (minRarity === 'rare') return item.rarity !== 'legendary';
        if (minRarity === 'uncommon') return item.rarity === 'common' || item.rarity === 'uncommon';
        return item.rarity === 'common';
    });

    // 添加高级装备概率
    if (Math.random() < 0.3) {
        // 30%概率提升一个稀有度
        pool = EQUIPMENT[slotType].filter(item => item.price > 0);
    }

    if (pool.length > 0) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        // ... 装备逻辑
    }
}
```

## 📋 实施时间线

### 第1-2天：基础广告接入
- [ ] 申请百度联盟账号
- [ ] 添加广告SDK
- [ ] 实现激励视频框架

### 第3-4天：核心功能实现
- [ ] 复活功能（看广告）
- [ ] 宝箱翻倍（看广告×10）
- [ ] 战斗加速（看广告）
- [ ] 底部Banner广告

### 第5天：游戏优化
- [ ] 实现装备评分系统
- [ ] 实现自动择优替换
- [ ] 调整装备掉落概率

### 第6天：额外功能
- [ ] 每日签到系统
- [ ] UI优化
- [ ] 数据埋点

### 第7天：测试上线
- [ ] 全面测试
- [ ] 部署到线上
- [ ] 提交广告审核

## 💰 预期收益

### 保守估计
- DAU：3,000人
- 人均日广告：4次
- eCPM：¥25
- **月收入：9万**

### 中等估计
- DAU：8,000人
- 人均日广告：5次
- eCPM：¥30
- **月收入：36万**

### 乐观估计
- DAU：15,000人
- 人均日广告：6次
- eCPM：¥35
- **月收入：95万**

## 🚀 立即开始

我现在可以帮你实现：
1. ✅ **装备评分系统** - 隐藏评分，自动择优替换
2. ✅ **激励视频框架** - 复活、翻倍、加速
3. ✅ **装备掉落曲线** - 深层掉落更好装备
4. ✅ **每日签到系统** - 可看广告翻10倍

**从哪个功能开始？建议先实现装备评分系统，这对游戏体验很重要！**
