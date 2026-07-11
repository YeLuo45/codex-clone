# Coze Clone

https://www.coze.cn/overview 的视觉克隆。技术栈：Vite 6 + React 18 + TypeScript 5 + Tailwind v3。

技术来源：[ai-website-cloner skill](https://github.com/JCodesMore/ai-website-cloner-template) — 克隆流程规范。

## 快速开始

```bash
cd web/
npm install
npm run dev
```

打开 http://127.0.0.1:5173 看效果。

## 生产构建

```bash
npm run build      # 输出到 web/dist/
npm run preview    # 本地预览构建
```

## 部署到 GitHub Pages

`vite.config.ts` 已配置 `base: './'`，产物可直接放到任意子路径。

**方式 A：gh-pages 分支**

```bash
cd web/
npm run build
npx gh-pages -d dist
```

**方式 B：GitHub Actions**

`.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd web && npm ci
      - run: cd web && npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: web/dist }
      - id: deploy
        uses: actions/deploy-pages@v4
```

需要仓库 Settings → Pages → Source 选 "GitHub Actions"。

## 包含内容

- 9 个 sections 完整还原（Header + Hero + Collaboration + DefineAgents + Professional + Coding + Video + CrossDevice + UseCases + FinalCTA）
- 真实素材：coze.cn 的 logo / avatar / icon / illustration 共 17 张图
- 真实视频：hero 视频（2.2MB 720p 压缩版）+ coding 视频（5.3MB 720p 压缩版），含 poster 帧
- 6 张 Use Cases 卡（原版 2x3 = 6）
- 响应式：mobile (390px) / tablet (768px) / desktop (1440px) 三档

## 已知限制

- 视频在 headless 浏览器不渲染帧（带 poster 帧占位）
- 部分动画（滚动联动、IntersectionObserver）未实现
- 素材来源 coze.cn，仅供学习研究

## License

MIT