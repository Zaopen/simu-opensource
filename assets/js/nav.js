// 设置base64密语和地址
var links = {
    // 英文密语直接转base64，中文密语需要转URL编码再转base64，放左边，右边是想打开的对应html
    // 示例："demo" 的 base64 是 "ZGVtbw=="
    "ZGVtbw==": "layouts/demo.html"
};

// 获取输入密语转URL编码再转base64后匹配地址
document.getElementById('redirect-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var depassword = document.getElementById('password-input').value;
    var enpassword = window.btoa(encodeURIComponent(depassword))
    var pageLink = links[enpassword];
    if (pageLink) {
        window.location.href = pageLink;
    } else {
        alert('密语有误，再想想？');
    }
});
