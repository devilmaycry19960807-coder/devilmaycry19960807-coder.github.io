# 部署和广告接入指南

## 📋 部署步骤（3种免费方案）

### 方案1：GitHub Pages（推荐）

1. **创建GitHub仓库**
   - 访问 https://github.com/new
   - 创建新仓库，命名为 `roguelike-game`
   - 勾选 "Public"

2. **上传代码**
   ```bash
   # 初始化git仓库
   cd c:/Users/user/WorkBuddy/20260310102455
   git init
   git add .
   git commit -m "Initial commit"
   
   # 添加远程仓库（替换YOUR_USERNAME）
   git remote add origin https://github.com/YOUR_USERNAME/roguelike-game.git
   git branch -M main
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库设置页面
   - 点击左侧 "Pages"
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，文件夹选择 `/root`
   - 点击 Save
   - 等待1-2分钟，会得到访问链接

---

### 方案2：Vercel（最快）

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择你刚创建的GitHub仓库
   - 点击 "Deploy"

3. **等待部署**
   - Vercel自动部署，约1分钟完成
   - 获得访问链接（如：https://roguelike-game.vercel.app）

---

### 方案3：Netlify（最简单）

1. **访问 Netlify**
   - 访问 https://netlify.com
   - 注册账号

2. **拖拽上传**
   - 将 `roguelike` 文件夹拖入 Netlify 页面
   - 等待上传完成
   - 获得访问链接

---

## 📺 广告接入指南

### 百度联盟（推荐国内）

#### 1. 注册账号
- 访问：https://union.baidu.com/
- 点击"立即注册"
- 填写个人信息/公司信息
- 提交审核（1-3天）

#### 2. 网站备案
- 如果网站要备案，需要购买域名和服务器
- 或者使用已备案的域名
- 完成后提交给百度联盟审核

#### 3. 创建广告位

登录百度联盟后：
1. 点击"流量管理" → "站点管理"
2. 添加你的网站地址
3. 等待审核通过

4. 创建广告位：
   - 点击"广告位管理" → "新建广告位"
   - 选择"Banner广告"（底部固定）
   - 选择"激励视频广告"
   - 获取广告位ID

#### 4. 接入代码

**Banner广告（替换HTML中的占位符）：**

```html
<!-- 在 index.html 中的 #banner-ad 元素内替换为 -->
<div id="banner-ad">
    <!-- 百度联盟Banner广告代码 -->
    <script>
        (function() {
            var s = "_" + Math.random().toString(36).slice(2);
            document.write('<div id="' + s + '"></div>');
            (window.slotbydup = window.slotbydup || []).push({
                id: 'your-banner-ad-id',  // 替换为你的Banner广告ID
                container: s,
                size: '728,90',
                display: 'inlay-fix'
            });
        })();
    </script>
    <script src="https://cpro.baidustatic.com/cpro/ui/c.js" async></script>
</div>
```

**激励视频广告（替换JS中的setTimeout）：**

在 `game.js` 和 `exploration.js` 中找到所有 `setTimeout(() => {...}, 1000)` 调用，替换为：

```javascript
// 复活功能
function showAdAndRevive(modal, wasAutoBattle) {
    // 调用百度联盟激励视频
    if (window.cpro_api && window.cpro_api.showRewardedAd) {
        window.cpro_api.showRewardedAd({
            adId: 'your-rewarded-ad-id',  // 替换为你的激励视频广告ID
            onReward: () => {
                // 广告观看完成，发放奖励
                const stats = getTotalStats();
                gameState.hp = stats.maxHp;
                gameState.mp = stats.maxMp;
                // ... 其他奖励代码
            },
            onError: () => {
                addLog('广告加载失败，请重试', 'info');
            }
        });
    } else {
        // 广告SDK未加载时的降级处理
        addLog('广告服务暂时不可用', 'info');
        document.body.removeChild(modal);
        performDeath(wasAutoBattle);
    }
}
```

**同样方式替换其他广告调用：**
- `showAdAndClaimReward()` - 签到翻倍
- 宝箱翻倍 - 在 `showChestModal()` 中
- 战斗加速 - 在 `watchAdToSpeedUp()` 中

---

### Google AdSense（推荐海外）

#### 1. 注册账号
- 访问：https://www.google.com/adsense/
- 使用Google账号登录
- 添加网站信息
- 等待审核（1-2周）

#### 2. 获取广告代码
- 审核通过后，进入AdSense后台
- 点击"广告" → "按广告单元"
- 创建"展示广告"和"激励视频广告"
- 复制广告代码

#### 3. 接入代码

**Banner广告：**

```html
<div id="banner-ad">
    <!-- Google AdSense Banner -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
```

**激励视频广告：**

```javascript
// 需要先引入Google AdSense SDK
function showAdAndRevive(modal, wasAutoBattle) {
    // Google AdSense激励视频
    const adRequest = new google.ima.AdsRequest();
    adRequest.adTagUrl = 'your-ad-tag-url';
    
    const adDisplayContainer = new google.ima.AdDisplayContainer(
        document.getElementById('ad-container'),
        document.getElementById('video-content')
    );
    
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    
    adsLoader.getAdsManager(adRequest, new google.ima.AdsRenderingSettings());
    
    // 监听广告事件
    adsLoader.addEventListener(
        google.ima.AdsManagerEventType.LOADED,
        () => {
            adDisplayContainer.initialize();
        }
    );
    
    adsLoader.addEventListener(
        google.ima.AdsManagerEventType.COMPLETE,
        () => {
            // 广告播放完成，发放奖励
            const stats = getTotalStats();
            gameState.hp = stats.maxHp;
            // ...
        }
    );
}
```

---

## 🔍 测试广告

### 本地测试（推荐）

在真实广告接入前，可以先测试模拟广告：

```javascript
// 在 game.js 顶部添加开关
const USE_REAL_ADS = false; // 设置为 false 使用模拟广告

// 在所有广告调用处使用
function showAdAndRevive(modal, wasAutoBattle) {
    if (USE_REAL_ADS) {
        // 使用真实广告API
        window.cpro_api.showRewardedAd({...});
    } else {
        // 使用模拟广告
        addLog('📺 正在播放广告...', 'info');
        setTimeout(() => {
            // 发放奖励
            const stats = getTotalStats();
            gameState.hp = stats.maxHp;
            // ...
        }, 1000);
    }
}
```

### 真实广告测试

1. 部署到线上环境（广告需要在真实域名下运行）
2. 使用测试广告位ID（百度联盟提供测试ID）
3. 检查广告是否正常显示
4. 检查奖励发放是否正常
5. 检查广告统计后台是否有数据

---

## 📊 数据监控

接入广告后，需要关注以下指标：

### 关键指标
- **广告填充率**（Fill Rate）- 目标>95%
- **eCPM**（千次展示收入）- 目标>¥25
- **观看完成率**（Completion Rate）- 目标>80%
- **点击率**（CTR）- 目标>1%
- **日活用户数**（DAU）
- **人均广告观看次数**

### 百度联盟后台
- 访问 https://union.baidu.com/
- 进入"报表" → "收益报表"
- 查看每日收入数据

### Google AdSense后台
- 访问 https://www.google.com/adsense/
- 进入"报告" → "效果报告"
- 查看收入和表现数据

---

## ❓ 常见问题

### Q: 广告不显示？
A: 检查以下几点：
1. 网站是否已在广告联盟后台审核通过
2. 广告位ID是否正确
3. 是否在真实域名下（本地file://无法显示广告）
4. 浏览器是否禁用了广告插件

### Q: 奖励没发放？
A: 检查：
1. 广告回调函数是否正确
2. 是否有JavaScript错误
3. 打开浏览器控制台查看日志

### Q: eCPM很低？
A: 优化建议：
1. 提高用户留存
2. 优化广告展示位置
3. 提高广告观看完成率
4. 尝试不同广告联盟

### Q: 需要备案吗？
A:
- 百度联盟：国内网站需要ICP备案
- Google AdSense：不需要备案，但需要域名
- 建议先使用备案好的域名

---

## 🎯 上线检查清单

部署前确认：
- [ ] 所有功能测试通过
- [ ] 接入真实广告SDK（或确认测试模式）
- [ ] 已在真实域名下测试广告
- [ ] 网站已备案（百度联盟需要）
- [ ] 已注册广告联盟账号
- [ ] 广告位ID已配置
- [ ] 移除所有console.log（可选）
- [ ] 优化图片资源（可选）

---

## 📞 需要帮助？

如果在部署或接入广告过程中遇到问题，可以：
1. 查看浏览器控制台错误日志
2. 查看广告联盟的帮助文档
3. 联系广告联盟客服

祝你的游戏顺利上线，收入暴涨！🎉
