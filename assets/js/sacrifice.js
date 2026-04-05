/**
 * 祭品动画组件 (优化版)
 * 源仓库: https://github.com/antiter/praise-animation
 * 优化点: 性能提升、错误处理、代码解耦、兼容性增强、可配置化
 */

// 工具函数抽离 - 单一职责
const utils = {
    /**
     * 获取指定范围的随机整数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @returns {number} 随机整数
     */
    getRandom(min, max) {
        if (min > max) [min, max] = [max, min]; // 容错：处理最小值大于最大值的情况
        return min + Math.floor(Math.random() * (max - min + 1));
    },

    /**
     * 兼容的 requestAnimationFrame
     * @param {Function} cb 回调函数
     * @returns {number} 帧请求ID
     */
    requestFrame(cb) {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        )(cb);
    },

    /**
     * 兼容的 cancelAnimationFrame
     * @param {number} id 帧请求ID
     */
    cancelFrame(id) {
        return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            function (id) {
                window.clearTimeout(id);
            }
        )(id);
    },

    /**
     * 安全获取DOM元素
     * @param {string} id DOM ID
     * @returns {HTMLElement|null}
     */
    getElement(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`DOM元素 ${id} 未找到`);
        return el;
    },

    /**
     * 加载图片资源
     * @param {string[]} imgPaths 图片路径列表
     * @param {string} baseDir 基础目录
     * @returns {Promise<HTMLImageElement[]>} 加载完成的图片数组
     */
    loadImages(imgPaths, baseDir) {
        if (!imgPaths.length) return Promise.resolve([]);

        const loadSingle = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onerror = () => {
                    console.error(`图片加载失败: ${src}`);
                    resolve(null); // 加载失败返回null，后续过滤
                };
                img.onload = () => resolve(img);
                img.src = `${baseDir}/${src}`;
            });
        };

        return Promise.all(imgPaths.map(path => loadSingle(path)))
            .then(imgs => imgs.filter(img => img && img.width > 0)); // 过滤无效图片
    }
};

class ThumbsUpAni {
    // 可配置参数 - 集中管理，便于修改
    config = {
        scaleTime: 0.1, // 缩放动画占比
        canvasWidth: 200, // canvas默认宽度
        canvasHeight: 400, // canvas默认高度
        offsetX: 20, // X轴随机偏移量
        angleRange: [2, 10], // 摇摆角度范围
        ratioRange: [10, 30], // 摇摆幅度范围
        fadeOutStage: [14, 18], // 淡出阶段占比范围
        durationRange: [1500, 3000], // 动画时长范围(ms)
        basicScales: [0.6, 0.9, 1.2], // 基础缩放比例
        imageNames: ["examplePic1.png", "examplePic2.png", "examplePic3.png"] // 图片文件名
    };

    imgsList = []; // 加载完成的图片列表
    context = null; // canvas上下文
    canvas = null; // canvas元素
    renderList = []; // 动画渲染队列
    scanning = false; // 是否正在扫描渲染
    frameId = null; // 动画帧ID (用于取消)
    baseImageDir = ""; // 图片基础目录

    constructor() {
        this.initCanvas();
        this.initImageDir();
        this.loadImages();
    }

    /**
     * 初始化Canvas
     */
    initCanvas() {
        this.canvas = utils.getElement('thumsSac');
        if (!this.canvas) return;

        // 设置canvas尺寸（支持外部定义，无则用默认值）
        this.canvas.width = this.canvas.width || this.config.canvasWidth;
        this.canvas.height = this.canvas.height || this.config.canvasHeight;

        this.context = this.canvas.getContext('2d');
        if (!this.context) console.error("Canvas 2D上下文获取失败");
    }

    /**
     * 初始化图片基础目录
     */
    initImageDir() {
        const memoPic = utils.getElement('memoPic');
        this.baseImageDir = memoPic ? `../static/sacrifice/${memoPic.alt}` : "";
    }

    /**
     * 加载图片资源
     */
    loadImages() {
        if (!this.baseImageDir) {
            console.error("图片基础目录未获取到");
            return;
        }

        utils.loadImages(this.config.imageNames, this.baseImageDir)
            .then(imgsList => {
                this.imgsList = imgsList;
                if (this.imgsList.length === 0) {
                    console.error("有效素材图片载入失败！");
                }
            });
    }

    /**
     * 创建单个动画渲染函数
     * @returns {Function|null} 渲染函数
     */
    createRender() {
        if (this.imgsList.length === 0) return null;

        const { scaleTime, basicScales, offsetX, angleRange, ratioRange, fadeOutStage } = this.config;
        const basicScale = basicScales[utils.getRandom(0, basicScales.length - 1)];
        const image = this.imgsList[utils.getRandom(0, this.imgsList.length - 1)];
        const basicX = (this.canvas.width / 2) + utils.getRandom(-offsetX, offsetX);
        const angle = utils.getRandom(...angleRange);
        const ratio = utils.getRandom(...ratioRange) * (utils.getRandom(0, 1) ? 1 : -1);
        const fadeOut = utils.getRandom(...fadeOutStage) / 100;

        // 缩放计算
        const getScale = (diffTime) => {
            return diffTime < scaleTime ? +(diffTime / scaleTime).toFixed(2) * basicScale : basicScale;
        };

        // X轴位移（带摇摆）
        const getTranslateX = (diffTime) => {
            return diffTime < scaleTime
                ? basicX
                : basicX + ratio * Math.sin(angle * (diffTime - scaleTime));
        };

        // Y轴位移（向上移动）
        const getTranslateY = (diffTime) => {
            return (image.height / 2) + (this.canvas.height - image.height / 2) * (1 - diffTime);
        };

        // 透明度计算（淡出）
        const getAlpha = (diffTime) => {
            const left = 1 - diffTime;
            return left > fadeOut ? 1 : 1 - +((fadeOut - left) / fadeOut).toFixed(2);
        };

        return (diffTime) => {
            if (diffTime >= 1) return true; // 动画结束标记

            const ctx = this.context;
            const scale = getScale(diffTime);
            const translateX = getTranslateX(diffTime);
            const translateY = getTranslateY(diffTime);
            const alpha = getAlpha(diffTime);

            ctx.save();
            ctx.translate(translateX, translateY);
            ctx.scale(scale, scale);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
            ctx.restore();

            return false; // 动画未结束
        };
    }

    /**
     * 扫描并渲染动画队列
     */
    scan() {
        if (!this.context) return;

        // 清空canvas（优化：仅清空有效区域）
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let index = 0;
        const length = this.renderList.length;

        if (length === 0) {
            this.scanning = false;
            utils.cancelFrame(this.frameId); // 取消帧请求，避免空循环
            return;
        }

        // 遍历渲染队列，移除已结束的动画
        while (index < length) {
            const item = this.renderList[index];
            const isEnd = item?.render?.((Date.now() - item.timestamp) / item.duration);

            if (isEnd) {
                this.renderList.splice(index, 1);
            } else {
                index++;
            }
        }

        // 继续请求下一帧
        this.frameId = utils.requestFrame(this.scan.bind(this));
        this.scanning = true;
    }

    /**
     * 启动单个动画
     * @returns {this} 实例自身
     */
    start() {
        if (!this.context || this.imgsList.length === 0) return this;

        const render = this.createRender();
        if (!render) return this;

        // 添加到渲染队列
        this.renderList.push({
            render,
            duration: utils.getRandom(...this.config.durationRange),
            timestamp: Date.now()
        });

        // 未在扫描时启动扫描
        if (!this.scanning) {
            this.scan();
        }

        return this;
    }

    /**
     * 销毁实例（清理资源）
     */
    destroy() {
        this.renderList = [];
        this.scanning = false;
        utils.cancelFrame(this.frameId);
        this.imgsList = [];
        this.context = null;
        this.canvas = null;
    }
}

// 页面初始化（DOM加载完成后执行，避免获取不到元素）
document.addEventListener('DOMContentLoaded', () => {
    const pageLike = utils.getElement('pageLike');
    if (!pageLike) return;

    const popuplike = new ThumbsUpAni();

    // 防抖处理：避免快速连续点击创建过多动画
    let clickLock = false;
    pageLike.addEventListener('click', () => {
        if (clickLock) return;
        clickLock = true;
        popuplike.start();
        setTimeout(() => {
            clickLock = false;
        }, 100); // 100ms内仅允许一次点击
    });

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        popuplike.destroy();
    });
});