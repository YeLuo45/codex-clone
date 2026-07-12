# Codex Clone

https://openai.com/zh-Hans-CN/codex/ 的视觉克隆。Vite + React 18 + TypeScript + Tailwind v3。

## 数据来源说明

原站 (openai.com) 有 Cloudflare bot 防护，Playwright headless 直接访问会被拦截。改用 [Wayback Machine](https://web.archive.org) 抓的 archived HTML (20260711044313) 作为 content source。图片从 Contentful CDN (`images.ctfassets.net`) 直接拉取。

## 快速开始

```bash
cd web/
NODE_ENV=development npm install --include=dev   # NODE_ENV=production 时强制装 devDeps
npm run dev          # http://127.0.0.1:5173
npm run build        # 生产构建 → web/dist/
```

## 质量门槛

```bash
npm run typecheck    # tsc --noEmit
npm test             # vitest run (22 tests, smoke + lib)
npm run coverage     # v8 coverage → coverage/index.html
npm run verify       # typecheck + test + build （提交前必须三过）
```

## 部署到 GitHub Pages

`web/vite.config.ts` 已配置 `base: './'`，产物走相对路径。

`.github/workflows/deploy.yml` 已配好，推 main 后自动 build + deploy 到 GitHub Pages。

## 包含内容

- 6 个 sections：Header + Hero + Surfaces + Features + Testimonials + FinalCTA
- 真实素材：1 favicon + 9 张 Contentful 图（hero + 5 features + 3 surfaces）
- 中文内容：H1 + 5 个章节标题 + 5 个开发者证言（Wonderful / Harvey / Sierra / Ramp / Duolingo）
- 响应式：mobile (390px) / desktop (1440px) 已验证

## 已知限制

- OpenAI Cloudflare 拦截自动化浏览器，recon 用 Wayback Machine archived HTML
- 视频元素未实现（HTML 里也是 placeholder）
- 交互（hover animations / scroll behaviors）简化实现
- 部分文案简化（archived HTML 经过 Wayback toolbar 重排）
- 素材来自 Contentful CDN + Wayback Machine，**仅供学习研究**

## License

MIT (clone code only; assets © OpenAI)