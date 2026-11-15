# 连接 Cloudflare Pages

1. 将项目源码提交到 `luo-li-ba-suo/kida_research` 的 `main`。当前仓库公开，草稿留在本地。以后设为 Private 时，也可以继续使用同一个 Cloudflare 项目。
2. 打开 [Cloudflare 控制台](https://dash.cloudflare.com/)，在 **Workers & Pages** 创建 **Pages** 应用，选择 **Connect to Git**。授权 GitHub 集成访问 `kida_research`。
3. 填写构建配置，并部署。

| 配置 | 值 |
|---|---|
| Project name | `kida-research` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | 仓库根目录 |
| Build command | `bundle install && bash scripts/build.sh` |
| Build output directory | `_site` |
| 环境变量 `SITE_URL` | 生产地址，例如 `https://kida-research.pages.dev`，以控制台分配为准 |

Ruby 版本从 `.ruby-version` 读取。关闭非生产分支预览构建，只保留 `main` 自动发布。如果地址不同，更新 `SITE_URL` 后重新部署，使 RSS、canonical 和 sitemap 指向生产站。

第一次上线后打开首页、归档、Score Centering 文章和 `/rss.xml`。可复制 [速记样例](../templates/example-reading-quicknote.html) 到 `notes/`，用草稿状态构建一次，然后设为 `published` 提交，确认索引自动出现。覆盖同名文件并更新 `note:updated`，确认地址和首次发布时间不变。发布内容的修订可通过 Git 历史撤销。Cloudflare 部署失败时可在 Deployments 查看具体报错，恢复时选用已验证的生产部署。

参考 [Git 集成](https://developers.cloudflare.com/pages/get-started/git-integration/)、[构建环境](https://developers.cloudflare.com/pages/configuration/build-image/)和[生产与预览分支控制](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)。
