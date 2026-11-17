# Research Notes 设计约定

## 目标

以论文阅读和理解为中心。保留现有研究笔记的配色、字体和正文阅读宽度，让目录与原文链接随时可用。本文记录已实现的文章页约定，也是后续修改模板的参考。

## 配色与文字

- 页面底色 `#fbfaf6`，正文 `#263b38`，普通链接 `#2e6258`，分隔线 `#dedfd7`。
- 说明文字沿用 `#65716c`、`#737e78`；原文链接使用暗红 `#a12b32`，与正文导航区分。
- 正文使用系统中文无衬线字体，桌面字号 17px、行高 1.95；640px 及以下字号 16px。
- 文章标题使用 Georgia / 宋体，桌面 34px、手机 27px。沿用细线、留白和浅色背景组织内容。

## 目录布局

- 宽屏（视口至少 1200px）：目录固定在左侧，宽 250px、距顶部 24px。正文容器保持 870px，内侧左右留白 40px，并向右让出目录空间。
- 长目录限制在视口高度内，可独立滚动；正文滚动时目录仍可使用。
- 窄屏：目录位于文章头部之后，使用原生 `details / summary` 折叠，默认展开，避免压缩正文宽度。
- 保留已有手工目录。没有目录的文章由脚本读取正文 `h2` 自动生成；已有标题 ID 保持不变，缺少时生成唯一 ID。
- 新文章主要章节使用 `h2`。手工目录的链接必须对应正文标题的 ID。
- 打印时隐藏目录和文章导航，恢复完整正文宽度。

## 标题与原论文

- 论文标题后显示小型 arXiv 字标链接，点击在新标签页打开原文，并保留当前笔记。
- 地址明确保存在 `<meta name="note:paper-url" content="https://arxiv.org/abs/论文编号">` 中，支持 arXiv 的 abs、html 等 HTTPS 地址。
- 不从正文随意选择第一个引用作为主论文；比较文章可能引用多篇论文，主论文必须显式指定。
- 单篇论文精读填写已核对的地址；专题总结、速记或暂未确认原文时可以留空，留空不显示图标。当前实现只为有效的 `https://arxiv.org/` 地址显示 arXiv 图标。
- 使用内嵌 SVG 字标，无需加载外部图片。链接提供可读的辅助标签、键盘焦点和悬停反馈，点击区域至少 44px 高。

## 模板与独立文件

- 文章必须仍能作为单个 HTML 本地打开，内嵌样式和运行脚本，不能只修改网站布局文件。
- 公共样式源为 `templates/article.css`，公共脚本源为 `templates/article-runtime.js`。修改它们后，同步到 `notes/*.html` 和两个 HTML 模板的对应内嵌代码。
- 新论文从 `templates/your-note.html` 复制；速记参考 `templates/example-reading-quicknote.html`。写作要求同时维护在 `templates/ai-writing-prompt.md`。
- 页面标题、摘要和日期继续由 `note:*` 字段驱动。修订文章保留 slug 和首次发布日期；目录布局调整不改变文章地址。

## 验证与发布

文章末尾统一提供 Utterances 评论区，放在 `article` 之外，避免进入章节目录。按 slug 关联独立讨论，接近视口时加载；本地文件和草稿不加载第三方评论，打印时隐藏。评论需 GitHub 登录，数据保存在仓库 Issues，安装与维护见 [评论说明](docs/comments.md)。结构源为 `templates/article-comments.inc`，与公共脚本、样式一起同步到各篇 HTML。

- 核对有手工目录和自动目录两种文章，检查宽屏、手机、长目录和长标题。
- 确认目录锚点可跳转、原文链接与主论文匹配、目录不遮挡正文、窄屏无新增横向溢出。
- 运行 `python scripts/import_notes.py --check`、`node --check templates/article-runtime.js` 和 `git diff --check`。
- 完整发布检查使用 `bash scripts/build.sh` 及 `python tests/publication.py`，依赖 Ruby / Bundler 环境。
- 提交并推送 `main` 后由 Cloudflare Pages 构建。GitHub 验证成功与线上部署完成是两个独立状态。
