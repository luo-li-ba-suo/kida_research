# 文章评论

每篇已发布笔记的正文后都有评论区，使用 [Utterances](https://utteranc.es/)，评论存储在 `luo-li-ba-suo/kida_research` 的 GitHub Issues 中。访客可以阅读，发表留言需要 GitHub 登录和授权。

## 一次性启用

1. 使用仓库所有者账号打开 [Utterances GitHub App](https://github.com/apps/utterances)，点击 Install / Configure。
2. 选择 **Only select repositories**，仅授权 `kida_research`，完成安装。
3. 确认仓库公开且 Settings → General → Features 中 **Issues** 已开启。
4. 将本地修改提交并推送至 `main`，等待 Cloudflare Pages 部署完成。
5. 打开任一已发布文章，滚动到末尾。用 GitHub 登录后发布首条真实留言，确认仓库出现对应 Issue。

代码接入不代表 GitHub App 已安装；仓库管理员必须完成上面的安装步骤。不需要 API Token、Cloudflare Secret 或评论数据库。

## 讨论如何关联

- 仓库在 `templates/article-runtime.js` 中统一指定。
- 讨论键为 `notes/<note:slug>/`，显式传给 Utterances 的 `issue-term`。每篇笔记使用独立讨论，不依赖标题、访问域名或查询参数。
- 修改标题、正文、日期或站点域名不会创建新讨论；修改 slug 会改变讨论键，因此继续遵守“修订保留 slug”的约定。
- 首次留言时 Utterances 自动创建 Issue。尚无人留言时，没有对应 Issue 属于正常情况。
- “在 GitHub 查看讨论”链接按同一个讨论键搜索仓库 Issues，服务无法加载时仍可使用。
- 评论公开，仓库管理员可在 GitHub Issues 中管理留言。未来若仓库转为私有，需重新选择可公开存储评论的仓库。

## 加载与布局

评论区放在 `article` 之外、文章页脚之前，不进入论文目录；样式与正文对齐，窄屏使用可用宽度，打印时隐藏。页面接近评论区时才加载第三方服务。

本地直接打开的 `file:` 文件、缺少发布状态的文章和草稿都不会加载评论脚本。HTTP 本地预览已发布文章会连接真实讨论，留言也会真实保存到 GitHub。

## 维护与检查

- 结构源：`templates/article-comments.inc`，内嵌于所有笔记及两个 HTML 模板。
- 行为源：`templates/article-runtime.js`；样式源：`templates/article.css`。修改后同步各 HTML，继续保持单文件可打开。
- 新文章从最新版模板复制，即可自动获得评论功能，无需手工创建 Issue。
- 执行 `node tests/comments.cjs` 验证延迟加载、讨论关联、草稿隔离和所有文章的接入；执行 `python scripts/import_notes.py --check` 检查文章元信息。
- 实际登录、发表与持久化需在 GitHub App 安装后验证；自动检查不会代替访客发布留言。
