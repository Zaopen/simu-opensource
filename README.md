# 思幕 (Simu) | Memorial Website

> 远居他乡，心念故里。故人已去，谨以此记。  
> *Far from home, with a heart that longs for the native land. The departed are gone, this is dedicated to their memory.*

一个简洁、优雅的静态网页纪念项目，用于追思亲人和朋友。  
*A simple and elegant static memorial website for commemorating loved ones and friends.*

---

## ✨ 特性 | Features

- 🙏 **密语访问** - 通过 base64 编码的密语访问纪念页面  
  *Password Access* - Access memorial pages via base64-encoded passphrases
- 🎵 **背景音乐** - 支持自定义背景音乐与封面  
  *Background Music* - Customizable background music and cover images
- 🖼️ **纪念照片** - 自动匹配多格式图片  
  *Memorial Photos* - Auto-matching for multiple image formats
- 🎊 **祭品动画** - 点击祭祀按钮触发动画效果  
  *Sacrifice Animation* - Animated effects triggered by the memorial button
- 📱 **响应式设计** - 适配桌面与移动设备  
  *Responsive Design* - Adapted for desktop and mobile devices
- 🌙 **暗色主题** - 庄重的视觉风格  
  *Dark Theme* - Solemn visual style

---

## 🚀 快速开始 | Quick Start

### 1. 克隆项目 | Clone the Project

```bash
git clone https://github.com/yourusername/simu.git
cd simu
```

### 2. 配置纪念页面 | Configure Memorial Page

**1) 复制模板 | Copy the template**
```bash
cp layouts/demo.html layouts/yourpage.html
```

**2) 编辑页面信息 | Edit page information**

修改 `layouts/yourpage.html` 中的以下内容：  
*Modify the following in `layouts/yourpage.html`:*

| 字段 | Field | 说明 | Description |
|------|-------|------|-------------|
| `<title>` | `<title>` | 故人姓名 | Name of the deceased |
| `<h1>` | `<h1>` | 显示的名称和敬称 | Display name and honorific |
| 忌日 | Date of passing | 阳历/农历日期 | Solar/lunar calendar date |
| `mcoverURL` | `mcoverURL` | 音乐封面图片链接 | Music cover image URL |
| `mURL` | `mURL` | 背景音乐文件路径 | Background music file path |

**3) 添加照片 | Add photos**

将故人照片放入 `static/img/`，文件名与 HTML 文件名一致：  
*Place photos in `static/img/` with filenames matching the HTML file:*

- 支持格式 | Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
- 示例 | Example: `demo.png` 对应 `layouts/demo.html`

**4) 添加祭品图片（可选）| Add sacrifice images (optional)**

创建文件夹 `static/sacrifice/yourpage/`，放入祭品动画图片：  
*Create folder `static/sacrifice/yourpage/` and add animation images:*

- 建议尺寸 | Recommended size: ~100x100 pixels
- 建议格式 | Recommended format: PNG with transparent background
- 命名 | Naming: `examplePic1.png`, `examplePic2.png`, `examplePic3.png`

**5) 添加背景音乐（可选）| Add background music (optional)**

将音乐文件放入 `static/music/`，并在 HTML 中更新 `mURL`  
*Place music files in `static/music/` and update `mURL` in the HTML*

### 3. 配置访问密语 | Configure Access Passphrase

编辑 `assets/js/nav.js`，添加密语映射：  
*Edit `assets/js/nav.js` to add passphrase mappings:*

```javascript
var links = {
    // 英文密语直接转 base64
    // English passphrases: convert directly to base64
    "ZGVtbw==": "layouts/demo.html",  // "demo" 的 base64
    "eW91cnBhZ2U=": "layouts/yourpage.html"  // 添加你的密语
};
```

**密语生成方法 | Passphrase generation:**

| 类型 | Type | 方法 | Method |
|------|------|------|--------|
| 英文 | English | `btoa("demo")` → `"ZGVtbw=="` | Direct base64 encoding |
| 中文 | Chinese | `btoa(encodeURIComponent("思念"))` | URL encode then base64 |

### 4. 部署 | Deploy

本项目为纯静态网页，可部署到任何静态托管服务：  
*This is a pure static website, deployable to any static hosting service:*

**国内大部分网络友好 | China-friendly:**
- [Render](https://render.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- 自有服务器 | Self-hosted server

**电信/特殊网络友好 | Telecom/special network friendly:**
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

---

## 📁 项目结构 | Project Structure

```
simu/
├── index.html              # 首页 - 密语输入 | Homepage - passphrase input
├── layouts/
│   ├── about.html          # 关于页面 | About page
│   └── demo.html           # 纪念页面模板 | Memorial page template
├── assets/
│   ├── css/
│   │   ├── home.css        # 首页样式 | Homepage styles
│   │   └── page.css        # 纪念页样式 | Memorial page styles
│   └── js/
│       ├── nav.js          # 密语导航逻辑 | Passphrase navigation logic
│       ├── page.js         # 纪念页功能 | Memorial page functionality
│       └── sacrifice.js    # 祭品动画组件 | Sacrifice animation component
├── static/
│   ├── img/                # 纪念照片 | Memorial photos
│   ├── music/              # 背景音乐 | Background music
│   ├── sacrifice/          # 祭品动画图片 | Sacrifice animation images
│   ├── favicon.ico
│   └── favicon.png
└── README.md
```

---

## 🎨 自定义配置 | Customization

### 修改祭祀按钮图标 | Change Memorial Button Icon

编辑 `layouts/yourpage.html` 中的按钮：  
*Edit the button in `layouts/yourpage.html`:*

```html
<button id="pageLike" class="likeBt" type="button">🙏</button>
```

### 调整祭品动画 | Adjust Sacrifice Animation

编辑 `assets/js/sacrifice.js` 中的 `config` 对象：  
*Edit the `config` object in `assets/js/sacrifice.js`:*

```javascript
config = {
    scaleTime: 0.1,           // 缩放动画占比 | Scale animation ratio
    offsetX: 20,              // X轴随机偏移量 | X-axis random offset
    angleRange: [2, 10],      // 摇摆角度范围 | Swing angle range
    durationRange: [1500, 3000], // 动画时长范围(ms) | Animation duration range
    imageNames: ["pic1.png", "pic2.png", "pic3.png"] // 祭品图片 | Sacrifice images
};
```

---

## 📜 许可 | License

MIT License - 详见 [LICENSE](LICENSE) 文件  
*See [LICENSE](LICENSE) file for details.*

---

## 🙏 致谢 | Acknowledgments

- 祭品动画组件基于 [praise-animation](https://github.com/antiter/praise-animation) 优化  
  *Sacrifice animation component optimized from [praise-animation](https://github.com/antiter/praise-animation)*
- 字体 | Fonts: Noto Serif SC, Roboto Slab (Google Fonts)

---

> 生的终止不过一场死亡，死的意义不过在于重生或永眠。死亡不是失去生命，而是走出时间。  
> *The end of life is but a death; the meaning of death lies in rebirth or eternal sleep. Death is not the loss of life, but stepping out of time.*
> 
> —— 余华《活着》| Yu Hua, *To Live*
