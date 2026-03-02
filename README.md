







<div align="center">

# Universal Animation Library

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.4+-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2+-purple.svg)](https://vitejs.dev/)

**Universal Animation Library - 一套完整的 CSS 动画库，包含 105+ 精心设计的动画效果**

[在线演示](#) · [文档](#) · [贡献指南](CONTRIBUTING.md)

</div>


# 登出当前账户
# npm logout
# 使用新令牌登录
#npm config set //registry.npmjs.org/:_authToken=NEW_TOKEN_HERE
# 或使用 npm login 命令交互式登录







## ✨ 特性

- 🎨 **105+ 动画效果** - 从基础到终极的完整动画库
- 🚀 **7 个版本系列** - 从 V1 基础动画到 V7 终极动画的渐进式学习路径
- 💪 **零依赖** - 纯 CSS 实现，即插即用
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎯 **易于使用** - 简洁的 API，只需添加 class
- 🔧 **高度可定制** - 支持自定义时长、缓动函数等
- 🌐 **浏览器兼容** - 支持 Chrome 87+、Firefox 78+、Safari 14+、Edge 88+

## 📦 动画系列

### V1 基础系列 (18 个)
淡入淡出、缩放、旋转、弹跳、闪烁、摇晃、脉冲等经典动画

### V2 超级动画 (15 个)
全息投影、涡流、正弦波浪、折纸、星轨、万花筒等高级动画

### V3 超现实动画 (14 个)
虫洞、全息 Pro、量子纠缠、神经网络、元宇宙、VR 等前沿特效

### V4 创意互动 (18 个)
磁吸、悬浮、波浪、弹性弹出、聚焦、绘制、棱镜、翻转等交互动画

### V5 极限突破 (10 个)
极限漩涡、变形万花筒、极光幻影、玻璃破碎、维度穿越等极限动画

### V6 传奇动画 (12 个)
光影穿梭、空间折叠、晶体裂变、电磁风暴、量子涟漪等传奇效果

### V7 终极动画 (16 个)
液态、晶体、涡流、光芒、分形、彩虹、弹跳、波纹等终极动画

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看演示

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 💻 使用方法

### 1. 引入样式文件

```vue
<style lang="scss">
@import './animation.css';
</style>
```

### 2. 应用动画类

```html
<!-- V2-V6 需要基础类 -->
<div class="ua-v2-animated ua-v2-hologram">元素内容</div>

<!-- V7 直接使用动画类 -->
<div class="ua-v7-liquidIn">元素内容</div>
```

### 3. 自定义动画参数

```css
/* 自定义 V1 动画时长和缓动 */
.ua-v1-animated {
  --ua-v1-duration-in: 1s;
  --ua-v1-duration-out: 0.8s;
  --ua-v1-ease-in: cubic-bezier(0.4, 0, 0.2, 1);
  --ua-v1-ease-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 自定义 V7 动画参数 */
.ua-v7-liquidIn {
  --ua-v7-duration-in: 1.5s;
  --ua-v7-ease-physics: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

## 🛠️ 技术栈

- **核心框架**: Vue 3.4+ + Vue Router 4.3+ + Pinia 2.1+
- **开发语言**: TypeScript 5.4+
- **构建工具**: Vite 5.2+
- **UI 框架**: Element Plus 2.7+
- **原子化 CSS**: UnoCSS 0.58+
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
animation-library/
├── public/                 # 静态资源
├── src/
│   ├── views/
│   │   └── animation/      # 动画模块
│   │       ├── index.vue   # 动画演示组件
│   │       └── animation.css # 动画样式定义
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   ├── styles/             # 全局样式
│   ├── types/              # 类型定义
│   ├── utils/              # 工具函数
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── .env                    # 环境变量
├── .eslintrc.cjs           # ESLint 配置
├── .prettierrc             # Prettier 配置
├── .npmrc                  # npm 配置
├── .nvmrc                  # Node 版本
├── LICENSE                 # 开源协议
├── CONTRIBUTING.md         # 贡献指南
├── README.md               # 项目说明
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript 配置
├── uno.config.ts           # UnoCSS 配置
└── vite.config.ts          # Vite 配置
```

## 📜 可用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 🌐 浏览器支持

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| >= 87  | >= 78   | >= 14  | >= 88 |

## 🤝 贡献

我们欢迎任何形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解如何参与项目。

## 📝 许可证

本项目基于 [MIT License](LICENSE) 开源。

## ⭐ Star History

如果这个项目对您有帮助，请给我们一个 Star！

---

<div align="center">

Made with ❤️ by Universal Animation Library Contributors

</div>
