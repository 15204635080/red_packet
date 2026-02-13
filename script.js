// ====== 获取页面元素 ======
const openBtn = document.getElementById('open-btn');
const loadingEl = document.getElementById('loading');
const resultEl = document.getElementById('result');
const danmuContainer = document.getElementById('danmu-container');

// ====== 音频相关 ======
let audio = null;
let hasAskedForAudio = false;

function initAudio() {
    if (audio) return;
    audio = new Audio('lucky.mp3');
    audio.preload = 'none';
}

function playLuckyMusic() {
    if (!audio) initAudio();
    audio.currentTime = 6;
    audio.play().catch(e => {
        console.log('自动播放被阻止', e);
    });
}

// ====== 弹幕生成器 ======
// 昵称库
const nicknames = [
    "我不吃香菜", "你猜我是谁", "大胃王", "幸运锦鲤", 
    "发财小能手", "红包收割机", "欧皇本皇", "锦鲤附体",
    "旺财", "福星", "好运连连", "财神爷", "暴富预备役"
];

// 金额模板
function getRandomAmount() {
    return (Math.random()).toFixed(2); // 1.00 ~ 9.99
}

// 随机手机号（前3位固定151，中间4位隐藏，后4位随机）
function getRandomPhone() {
    const last4 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `151****${last4}`;
}

// 弹幕模板
const danmuTemplates = [
    () => `恭喜用户 ${getRandomPhone()} 获得 ${getRandomAmount()} 元`,
    () => `超级幸运！用户「${nicknames[Math.floor(Math.random() * nicknames.length)]}」抽中 ${getRandomAmount()} 元`,
    () => `用户 ${getRandomPhone()} 领取了 ${getRandomAmount()} 元红包`,
    () => `${nicknames[Math.floor(Math.random() * nicknames.length)]} 刚刚中了 ${getRandomAmount()} 元！`,
    () => `🎉 恭喜 ${getRandomPhone()} 获得 ${getRandomAmount()} 元现金`,
    () => `💰 用户「${nicknames[Math.floor(Math.random() * nicknames.length)]}」抽到 ${getRandomAmount()} 元`,
];

// 生成一条弹幕
function createDanmu() {
    if (!danmuContainer) return;

    // 随机选择一个模板生成内容
    const template = danmuTemplates[Math.floor(Math.random() * danmuTemplates.length)];
    const text = template();

    // 创建弹幕元素
    const danmu = document.createElement('div');
    danmu.className = 'danmu-item';
    danmu.textContent = text;

    // 随机垂直位置（10% ~ 90%）
    const top = Math.random() * 80 + 10; // vh
    danmu.style.top = top + 'vh';

    // 随机动画时长（7~12秒），让弹幕速度有变化
    const duration = Math.random() * 5 + 7;
    danmu.style.animation = `danmuFly ${duration}s linear forwards`;

    // 随机字体大小（可选微调）
    danmu.style.fontSize = (Math.random() * 4 + 12) + 'px'; // 12~16px

    // 添加到容器
    danmuContainer.appendChild(danmu);

    // 自动移除（动画结束后 + 0.5秒）
    setTimeout(() => {
        if (danmu.parentNode) {
            danmu.remove();
        }
    }, duration * 1000 + 500);
}

// 启动弹幕（持续生成）
let danmuInterval;
function startDanmu() {
    if (danmuInterval) clearInterval(danmuInterval);
    // 立即生成一条，然后每隔1.2~2秒生成一条
    createDanmu();
    danmuInterval = setInterval(() => {
        createDanmu();
    }, Math.random() * 800 + 1200); // 1200~2000ms
}

// ====== 加载提示文本 ======
const loadingTexts = [
    "正在连接财神服务器...",
    "验证红包有效性...",
    "计算红包金额中...",
    "检查网络连接...",
    "正在生成幸运数字...",
    "几乎就要打开了...",
    "最后一步，请稍候..."
];

function getRandomLoadingText() {
    const randomIndex = Math.floor(Math.random() * loadingTexts.length);
    return loadingTexts[randomIndex];
}

// ====== 显示加载动画 ======
function showLoadingAnimation() {
    let count = 0;
    const maxCount = 4;

    loadingEl.textContent = getRandomLoadingText();
    loadingEl.style.opacity = '1';

    const loadingInterval = setInterval(() => {
        if (count >= maxCount) {
            loadingEl.style.opacity = '0';
            setTimeout(() => {
                loadingEl.textContent = '';
                loadingEl.style.opacity = '1';
            }, 500);
            clearInterval(loadingInterval);
            return;
        }

        loadingEl.style.opacity = '0.3';
        setTimeout(() => {
            loadingEl.textContent = getRandomLoadingText();
            loadingEl.style.opacity = '1';
            count++;
        }, 300);
    }, 1800);

    return loadingInterval;
}

// ====== 开红包主函数 ======
openBtn.addEventListener('click', function() {
    if (this.classList.contains('spinning')) {
        return;
    }

    loadingEl.textContent = "";
    loadingEl.style.opacity = '1';
    resultEl.textContent = "";
    this.classList.remove('retry');
    this.innerHTML = '<span>開</span>';

    this.classList.add('spinning');
    this.style.cursor = 'not-allowed';

    const loadingInterval = showLoadingAnimation();
    const waitTime = 4000 + Math.random() * 2000;

    setTimeout(() => {
        clearInterval(loadingInterval);
        loadingEl.textContent = "";

        this.classList.remove('spinning');
        this.classList.add('shaking');

        setTimeout(() => {
            resultEl.innerHTML = "<div>加载完成！</div>";

            setTimeout(() => {
                resultEl.innerHTML = "<div>正在解密红包...</div>";

                setTimeout(() => {
                    resultEl.innerHTML = `
                        <div style="margin-bottom: 10px;">谢谢参与！</div>
                        <div style="font-size: 18px; color: #ffcc80;">
                            新年快乐，万事如意！
                        </div>
                    `;

                    this.classList.remove('shaking');
                    this.style.cursor = 'pointer';

                    // 按钮变为“再试一次”
                    this.classList.add('retry');
                    this.innerHTML = '<span>再试一次</span>';

                    // 为“再试一次”绑定事件（仅执行一次）
                    const retryHandler = function() {
                        this.removeEventListener('click', retryHandler);

                        // 音频询问（只问一次）
                        if (!hasAskedForAudio) {
                            const wantMusic = confirm('是否增加抽中概率？');
                            if (wantMusic) {
                                playLuckyMusic();
                            }
                            hasAskedForAudio = true;
                        }

                        // 重置按钮状态
                        this.classList.remove('retry');
                        this.innerHTML = '<span>開</span>';
                        loadingEl.textContent = "";
                        resultEl.textContent = "";

                        // 延迟后自动点击，重新开红包
                        setTimeout(() => {
                            this.click();
                        }, 300);
                    };

                    this.addEventListener('click', retryHandler);

                }, 1200);
            }, 1000);
        }, 800);
    }, waitTime);
});

// ====== 页面初始化 ======
window.addEventListener('load', function() {
    // 初始化音频对象
    initAudio();

    // 启动弹幕（页面一加载就开始飘）
    startDanmu();

    // 确保红包居中
    setTimeout(() => {
        document.body.style.display = 'flex';
    }, 100);
});