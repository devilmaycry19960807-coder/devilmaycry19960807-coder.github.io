// 商店系统（已废弃，改为打怪随机获得装备）
import { gameState, updateGold, getTotalStats, equipItem, addArtifact, saveGame } from './gameState.js';
import { EQUIPMENT } from './equipment.js';
import { ARTIFACTS } from './monsters.js';
import { GAME_CONFIG } from './config.js';

// 商店功能已改为：使用金币随机购买装备
export function buyRandomEquipment(times = 1) {
    const cost = GAME_CONFIG.EQUIPMENT_COST * times;
    if (gameState.gold < cost) {
        return { success: false, message: `金币不足（需要${cost}金币）！` };
    }

    updateGold(-cost);
    const items = [];

    for (let i = 0; i < times; i++) {
        // 随机选择物品类型
        const roll = Math.random();
        let item;

        if (roll < 0.6) {
            // 60%概率获得装备
            const slotTypes = ['helmets', 'armors', 'oneHandWeapons', 'twoHandWeapons', 'gloves', 'boots', 'rings'];
            const slotType = slotTypes[Math.floor(Math.random() * slotTypes.length)];
            const pool = EQUIPMENT[slotType].filter(e => e.price > 0);
            item = pool[Math.floor(Math.random() * pool.length)];
        } else {
            // 40%概率获得遗物
            item = ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];
        }
        items.push(item);
    }

    return {
        success: true,
        items: items,
        cost: cost,
        message: `花费${cost}金币，随机购买了${times}件物品！`
    };
}

// 装备获得的物品
export function equipObtainedItem(item) {
    if (item.type) {
        // 装备
        if (item.type === 'twoHand') {
            const equipResult = equipItem(item, 'leftHand');
            gameState.equipment.rightHand = null;
            saveGame(); // 自动存档
            return { type: 'equipment', equipped: equipResult.replaced, message: equipResult.replaced ? '装备已替换' : '当前装备更强' };
        } else if (item.type === 'oneHand') {
            const leftHand = gameState.equipment.leftHand;
            const rightHand = gameState.equipment.rightHand;

            let slot;
            if (!leftHand || leftHand.type === 'twoHand') {
                slot = 'leftHand';
            } else if (!rightHand || rightHand.type === 'twoHand') {
                slot = 'rightHand';
            } else {
                slot = Math.random() < 0.5 ? 'leftHand' : 'rightHand';
            }

            const equipResult = equipItem(item, slot);
            saveGame(); // 自动存档
            return { type: 'equipment', equipped: equipResult.replaced, message: equipResult.replaced ? '装备已替换' : '当前装备更强' };
        } else if (item.type === 'necklace') {
            const equipResult = equipItem(item, 'necklace');
            saveGame(); // 自动存档
            return { type: 'equipment', equipped: equipResult.replaced, message: equipResult.replaced ? '装备已替换' : '当前装备更强' };
        } else {
            const equipResult = equipItem(item, item.type);
            saveGame(); // 自动存档
            return { type: 'equipment', equipped: equipResult.replaced, message: equipResult.replaced ? '装备已替换' : '当前装备更强' };
        }
    } else {
        // 遗物
        addArtifact(item);
        saveGame(); // 自动存档
        return { type: 'artifact', message: '遗物已添加到背包（可无限叠加）' };
    }
}
