document.getElementById('open-btn').addEventListener('click', function() {
    const btn = this;
    const result = document.getElementById('result');
    
    // 显示加载中
    btn.disabled = true;
    btn.textContent = '加载中...';
    result.textContent = '正在打开红包，请稍候...';
    
    // 3秒后显示谢谢参与
    setTimeout(function() {
        result.textContent = '谢谢参与！';
        btn.textContent = '再试一次';
        btn.disabled = false;
    }, 3000);
});