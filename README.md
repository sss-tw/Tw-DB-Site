# Turtle WoW Database CN

这是一个面向 Turtle WoW 的数据库浏览网站，目标是复刻 `database.turtlecraft.gg` 的浏览体验，并在此基础上增加中文显示。

网站本身是纯静态前端，可以部署在 GitHub Pages；数据来自远端 SQLite 数据库，浏览器通过 `sql.js-httpvfs` 和 HTTP Range 请求按需读取数据库内容。数据库文件体积较大，不包含在本仓库中，发布时托管在 Cloudflare R2。

## 功能

- 支持物品、NPC、对象、任务、法术、阵营、套装等数据库页面。
- 支持详情页与关联列表，例如掉落、任务奖励、任务关联、法术来源等。
- 支持中文/英文切换；中文模式下优先显示数据库中的 `zhCN` 本地化内容，缺失时回退英文。
- 支持本地物品与法术 tooltip，避免依赖原站的 `ajax.php`。
- 支持 GitHub Pages 静态部署，数据库独立托管在 Cloudflare R2。

## 技术结构

- `index.html`：页面入口。
- `app.js`：路由、SQLite 查询、列表页和详情页渲染逻辑。
- `style.css`：站点样式。
- `assets/`：本地化后的页面脚本、样式、图标和图片资源。
- `db-config.js`：远端 SQLite 数据库地址配置。
- `sqlite.worker.js` / `sql-wasm.wasm`：浏览器端 SQLite 查询运行时。

## 数据库

数据库文件为 `turtle_mirror.db`，通过 Cloudflare R2 公开访问。本仓库通过 `.gitignore` 排除了：

- `*.db`
- `*.db-wal`
- `*.db-shm`

因此 GitHub 仓库只保存网站代码和静态资源，不保存大型数据库文件。

## Credits

页面结构和视觉风格参考 Turtle WoW Database。项目仅用于数据库浏览与中文本地化展示。
