// ====== 获取页面元素 ======
const openBtn = document.getElementById('open-btn');
const loadingEl = document.getElementById('loading');
const resultEl = document.getElementById('result');

// ====== 音频相关（新增）=======
let audio = null;
let hasAskedForAudio = false;   // 是否已经询问过用户

// 初始化音频对象（不预加载）
function initAudio() {
    if (audio) return;
    audio = new Audio('lucky.mp3');  // 音频文件放在同一目录
    audio.preload = 'none';
}

// 播放音乐（从第6秒开始）
function playLuckyMusic() {
    if (!audio) initAudio();
    audio.currentTime = 6;   // 从第6秒播放
    audio.play().catch(e => {
        console.log('自动播放被阻止，用户需要再次交互', e);
    });
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

// ====== 显示加载动画（稳定版）=======
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

// ====== 开红包主函数（稳定版逻辑，完全保留）=======
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

                    // === 按钮变为“再试一次”（横向清晰版本）===
                    this.classList.add('retry');
                    this.innerHTML = '<span>再试一次</span>';

                    // === 为“再试一次”绑定事件（仅执行一次，自动移除）===
                    const retryHandler = function() {
                        // 移除自身，确保不会重复绑定
                        this.removeEventListener('click', retryHandler);

                        // ---------- 新增：音频询问逻辑（只问一次）----------
                        if (!hasAskedForAudio) {
                            const wantMusic = confirm('是否增加抽中概率？');
                            if (wantMusic) {
                                playLuckyMusic();
                            }
                            hasAskedForAudio = true;
                        }
                        // ------------------------------------------------

                        // 重置按钮状态（还原为“開”）
                        this.classList.remove('retry');
                        this.innerHTML = '<span>開</span>';
                        loadingEl.textContent = "";
                        resultEl.textContent = "";

                        // 延迟后自动点击，重新开始开红包流程
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

// ====== 页面加载完成初始化（稳定版）=======
window.addEventListener('load', function() {
    initAudio();   // 创建音频对象，但不加载

    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        .gold-coin {
            animation: float 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.body.style.display = 'flex';
    }, 100);
});