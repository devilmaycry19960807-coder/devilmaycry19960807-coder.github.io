# 网页版广告变现部署指南

## 📅 第1周：基础部署（0成本）

### 步骤1：申请广告联盟账号（1-2天）

#### 选项A：百度联盟（推荐，国内）
1. 访问 https://union.baidu.com/
2. 注册账号（需要身份证）
3. 实名认证
4. 提交网站信息
5. 等待审核（通常1-3天）

#### 选项B：Google AdSense（推荐，海外）
1. 访问 https://www.google.com/adsense/
2. 用Google账号登录
3. 添加网站
4. 获取广告代码
5. 等待审核

#### 选项C：360广告联盟
1. 访问 https://union.360.cn/
2. 注册并认证
3. 获取广告位ID

### 步骤2：部署到免费CDN（当天完成）

#### 选项A：GitHub Pages（免费）
```bash
# 1. 创建GitHub仓库
# 2. 上传游戏文件
# 3. 启用GitHub Pages

# 访问地址：https://yourusername.github.io/repository-name/
```

#### 选项B：Vercel（免费，推荐）
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd /path/to/roguelike
vercel

# 访问地址：https://your-project.vercel.app
```

#### 选项C：Netlify（免费）
1. 访问 https://www.netlify.com/
2. 注册账号
3. 拖拽文件夹到上传区
4. 自动部署完成

### 步骤3：配置广告代码（2-3天）

#### 激励视频广告（主要收入）
1. 在广告联盟后台创建广告位
2. 获取广告位ID
3. 修改 `roguelike/js/adProvider.js`：
```javascript
AdProvider.adUnits.rewarded = '你的广告位ID';
AdProvider.isDevelopment = false; // 生产环境设为false
```

#### Banner广告（补充收入）
1. 创建Banner广告位
2. 获取广告位ID
3. 在HTML中添加：
```html
<div id="banner-ad">
    <!-- 百度联盟代码 -->
    <script type="text/javascript" src="https://cpro.baidustatic.com/cpro/ui/cm.js"></script>
</div>
```

#### 插屏广告（关键节点）
1. 创建插屏广告位
2. 配置触发时机
3. 添加到 `monetization.js` 中的 showInterstitial 函数

### 步骤4：数据统计（1天）

#### 接入百度统计
```html
<!-- 在index.html中添加 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?你的统计ID";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

---

## 📊 第2周：功能完善

### 每日任务系统（提升留存）

创建 `roguelike/js/dailyTasks.js`：

```javascript
export const DailyTasks = {
    tasks: [
        { id: 'explore', name: '探索5次', target: 5, reward: 100 },
        { id: 'battle', name: '击败10只怪物', target: 10, reward: 200 },
        { id: 'spell', name: '使用3次法术', target: 3, reward: 150 },
        { id: 'upgrade', name: '购买1次装备', target: 1, reward: 300 }
    ],

    checkTask: function(taskId, progress) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && progress >= task.target) {
            gameState.gold += task.reward;
            addLog(`✅ 完成任务：${task.name}，获得${task.reward}金币！`, 'info');
            saveGame();
        }
    }
};
```

### 排行榜系统（社交功能）

#### 使用免费排行榜服务
- **Leaderboard.io**：免费排行榜API
- **Dreamlo**：免费排行榜服务
- **Firebase**：Google免费数据库

---

## 🚀 第3周：推广运营

### 免费推广渠道

#### 1. 游戏平台提交
```
□ TapTap (tap.io) - 手机游戏平台
□ 好游快爆 (haoyou.com)
□ 4399小游戏中心
□ 360小游戏
□ 腾讯QQ浏览器游戏中心
```

#### 2. 自媒体内容创作
```
□ B站：制作"如何快速通关100层"攻略视频
□ 抖音：录制"第1次遇到传说装备"短视频
□ 小红书：分享游戏心得和装备搭配
□ 知乎：写游戏评测文章
```

#### 3. 社区推广
```
□ Roguelike吧（百度贴吧）
□ 放置游戏吧
□ NGA游戏论坛
□ 游民星空论坛
```

#### 4. 微信推广
```
□ 创建游戏交流群
□ 朋友圈分享游戏链接
□ 游戏互助群互推
```

---

## 📈 第4周：数据分析与优化

### 关键指标监控

```
□ 日活跃用户(DAU)
□ 日留存率（次日/7日/30日）
□ 广告观看率
□ 人均观看广告次数
□ 平均游戏时长
□ 用户流失节点（第几层流失）
```

### 优化方向

1. **如果留存率低**：
   - 添加新手引导
   - 调整前期难度
   - 增加新手福利

2. **如果广告观看率低**：
   - 提高广告奖励价值
   - 优化广告触发时机
   - 增加"必看广告"场景

3. **如果付费意愿低**：
   - 增加限时折扣
   - 优化装备掉落概率
   - 添加稀有限定活动

---

## 💰 收益预估（网页版）

### 保守情况
- DAU：5,000人
- 人均日看广告：5次
- 激励视频eCPM：¥25
- Banner eCPM：¥8

**月收入：约15-25万**

### 乐观情况
- DAU：20,000人
- 人均日看广告：8次
- 激励视频eCPM：¥35
- Banner eCPM：¥10

**月收入：约80-120万**

---

## ✅ 立即行动清单

### 今天就可以做的：
- [ ] 注册GitHub账号（如果没有）
- [ ] 创建GitHub仓库并上传代码
- [ ] 启用GitHub Pages
- [ ] 访问 https://pages.github.com 获取域名
- [ ] 测试游戏在线运行

### 本周完成：
- [ ] 注册百度联盟账号
- [ ] 完成实名认证
- [ ] 提交网站审核
- [ ] 配置广告位ID
- [ ] 部署到Vercel（更快访问）
- [ ] 添加百度统计代码

### 下周计划：
- [ ] 实现每日任务系统
- [ ] 添加排行榜功能
- [ ] 制作推广素材
- [ ] 发布到TapTap
- [ ] 创建游戏交流群

---

## 🎯 快速启动命令

### 本地测试
```bash
# 启动本地服务器
cd roguelike
python -m http.server 8080

# 访问 http://localhost:8080
```

### 部署到Vercel
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 部署到GitHub Pages
```bash
# 推送到GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 在GitHub设置中启用Pages
```

---

## 📞 需要帮助？

我可以帮你：
1. ✅ 配置广告联盟代码
2. ✅ 部署到指定平台
3. ✅ 修改广告触发逻辑
4. ✅ 制作推广文案
5. ✅ 优化UI和用户体验

**现在就开始吗？我可以帮你完成任何一个步骤！**
