# Drift / 所见

**Your Own Cultural Atlas · 你的私人文化地图**

把书、电影、人物、历史与个人笔记放回地图，形成「记录 → 空间化 → 再发现」的私人文化收藏。

## 面试展示

- **[打开 Showcase](https://leahlin809.github.io/drift/showcase/)**：产品问题、核心模型、操作流程与设计取舍，适合先浏览 3–5 分钟。
- **[体验 Interactive Demo](https://leahlin809.github.io/drift/demo/)**：浏览地图与文化条目、切换 Library、添加 Entry 并选择位置。
- [直接打开应用预览](https://leahlin809.github.io/drift/)。Showcase 支持章节导航、方向键和全屏展示。

这是 iPhone-first 产品的 Web 展示原型。演示内容是预设样例；Web 使用内存数据，刷新会重置，请勿输入需要保存的信息。Native 保留 Mapbox 与 SQLite 架构，未在本次发布中验证 iOS 真机。

## 本地运行

需要 Node.js 22。复制 `.env.example` 为 `.env`，填入自己的 Mapbox **public token (`pk.*`)**，然后运行：

```sh
npm ci
npm run web
```

打开终端给出的地址，加上 `/showcase` 或 `/demo`。缺少 token 时，地图无法正常加载，但展示文案和截图仍可浏览。

## 技术与目录

Expo / React Native / TypeScript / Expo Router；Web 地图使用 `mapbox-gl`。

- `src/showcase/`：面试展示页与 Demo 外框。
- `src/demo/`：预设展示数据与演示状态。
- `src/app/`、`src/components/`：现有应用与交互。
- `promo-video/`：短片工程及展示截图；不包含渲染视频、缓存或依赖。
- `docs/`：产品、数据模型、设计和功能说明，以最新版本为准。

## 验证与 GitHub Pages

```sh
npm run typecheck
npm run lint
npm run build:pages
```

GitHub Actions 在 `main` 更新时构建并部署。仓库 **Settings → Pages → Source** 使用 **GitHub Actions**。
在 **Settings → Secrets and variables → Actions** 添加 `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`，值为可访问当前地图样式的 Mapbox public token；如限制 URL，须允许 `https://leahlin809.github.io/*`。该 token 会进入浏览器构建，请勿使用 secret token。

部署时 `GITHUB_PAGES=true` 自动配置 `/drift` 子路径；本地预览不需要该变量。构建产物不提交到仓库。修改 token 后在 Actions 重新运行部署。
