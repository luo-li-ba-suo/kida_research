# Research Notes

Kida 的个人研究博客，沿用 stormzhang 的 Jekyll 页面结构和部分排版样式。研究方向为 Agentic RL、Reward Modeling、Social Intelligence 和 GameAgent。

## 更新一篇文章

1. 从 [文章模板](templates/your-note.html) 另存一份，或让 AI 按[写作提示词](templates/ai-writing-prompt.md) 修改现有 HTML。
2. 双击文件，在浏览器检查文字、公式与图表。模板内含公式渲染所需的文件，本地打开时即可检查。
3. 写好后，将 head 里的 `note:status` 改为 `published`。在 GitHub 打开 `notes/` 目录，使用 **Add file → Upload files** 上传并提交到 `main`。文件名必须是 `slug.html`。
4. Cloudflare Pages 连接仓库后会自动部署。归档、研究方向、搜索、RSS 和 sitemap 随部署更新。

修订时覆盖同名文件。保持 `note:slug` 和 `note:created`，只改 `note:updated`。正文标题和日期从这些字段取值。状态缺失时视为草稿。当前 GitHub 仓库为 Public，真实草稿和未公开附件留在本地，到发布时再上传。日后如果把仓库改为 Private，也可把草稿提交到 `notes/`，构建仍会过滤。

- [完整 HTML 模板](templates/your-note.html)
- [阅读速记样例](templates/example-reading-quicknote.html)
- [AI 写作提示词](templates/ai-writing-prompt.md)
- [文章页面设计与维护约定](DESIGN.md)
- [文章评论启用与维护](docs/comments.md)
- [Cloudflare 部署步骤](docs/deploy.md)
- [知识库迁移对照](docs/migration.md)

## 本地预览

安装 Python 3.9+、Ruby 3.2.11 与 Bundler 2.4.22 后，在项目目录执行：

```sh
bundle install
bash scripts/build.sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory _site
```

访问 [本地首页](http://127.0.0.1:4173/) 或 [全部文章](http://127.0.0.1:4173/archive/)。单篇文章也可以从 `notes/` 直接打开，站内跳转和搜索通过本地网站使用。

构建读取完整 HTML 源文件，并按发布状态创建 Jekyll 的临时源目录。部署目录只有通过检查的站点文件。日常写作所需的标签和时间字段均保存在文章文件中。

## 来源

导航和页面框架改自 [stormzhang 的 Jekyll 博客](https://github.com/stormzhang/stormzhang.github.com)。复用的 CSS 保持独立，布局和归档入口按研究博客需要调整。原样参考文件和 KaTeX 许可证记录在 [来源说明](provenance/README.md)。迁移内容源自用户提供的 RL 知识库，各篇笔记包含论文链接与核对位置。
