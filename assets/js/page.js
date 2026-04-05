window.onload = function () {
    // 添加背景音乐
    let bgMusic = document.createElement("audio");
    let musicURL = document.getElementById("mURL").innerHTML;
    bgMusic.setAttribute("id", "bgMusic");
    bgMusic.setAttribute("loop", "loop");
    bgMusic.setAttribute("src", musicURL);
    document.body.appendChild(bgMusic);

    // 匹配音乐封面
    let musicCoverURL = `url(${document.getElementById("mcoverURL").innerHTML})`;
    document.getElementById("bgmusicCtrl").setAttribute("style", `background-image: ${musicCoverURL}`);

    // 控制音乐开始或暂停
    let bgmusicCtrl = document.getElementById("bgmusicCtrl");
    let playing = false;
    bgmusicCtrl.addEventListener("click", function () {
        if (playing) {
            bgMusic.pause();
            bgmusicCtrl.style.animationPlayState = "paused";
            playing = false;
        } else {
            bgMusic.play();
            bgmusicCtrl.style.animationPlayState = "running";
            playing = true;
        }
    });

    // 匹配纪念照片
    const pic = document.getElementById("memoPic");
    const name = pic.alt;
    const base = "../static/img/";

    // 支持的格式（按优先级排序）
    const exts = ["png", "jpg", "jpeg", "gif", "webp"];

    function tryLoadImage(index = 0) {
        if (index >= exts.length) return;

        const url = base + name + "." + exts[index];
        const img = new Image();

        // 只在成功时设置
        img.onload = () => {
            pic.src = url;
        };

        // 失败时不打印错误，直接试下一个
        img.onerror = () => {
            tryLoadImage(index + 1);
        };

        img.src = url;
    }

    tryLoadImage();

    // 移动端实现按下按钮效果
    document.body.addEventListener("touchstart", function () { });

}
