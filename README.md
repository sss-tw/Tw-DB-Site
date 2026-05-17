# Turtle WoW Database CN

这是一个面向 Turtle WoW 的数据库浏览网站，目标是复刻 `database.turtlecraft.gg` 的浏览体验，并在此基础上增加中文显示。

网站本身是纯静态前端，可以部署在 GitHub Pages；数据优先来自 Turso/libSQL 远端数据库，前端使用只读 token 查询数据。Turso 配额、限流或网络失败时，可以自动切换到 Cloudflare R2 上的 SQLite 文件。

## 功能

- 支持物品、NPC、对象、任务、法术、阵营、套装等数据库页面。
- 支持详情页与关联列表，例如掉落、任务奖励、任务关联、法术来源等。
- 支持中文/英文切换；中文模式下优先显示数据库中的 `zhCN` 本地化内容，缺失时回退英文。
- 支持本地物品与法术 tooltip，避免依赖原站的 `ajax.php`。
- 支持 GitHub Pages 静态部署，数据库优先托管在 Turso，R2 可作为后备只读数据源。

## 技术结构

- `index.html`：页面入口。
- `app.js`：路由、Turso/R2 查询、列表页和详情页渲染逻辑。
- `style.css`：站点样式。
- `assets/`：本地化后的页面脚本、样式、图标和图片资源。
- `db-config.js`：Turso URL、只读 token 与 R2 后备 SQLite URL 配置。

## 本地启动

```bash
cd /Users/sekilai/Documents/WebBoot/turtle_db_publish
python3 -m http.server 8000
```

然后打开：

```text
http://localhost:8000/
```

## 数据库

本仓库不保存大型数据库文件。当前线上数据已经导入 Turso，前端通过 `db-config.js` 中的只读 token 访问；如果 Turso 查询失败且 `databaseUrl`/`r2DatabaseUrl` 配置为有效 R2 URL，前端会自动改用 R2 SQLite。

`.gitignore` 仍排除本地维护或重新导入时可能产生的 SQLite 文件：

- `*.db`
- `*.db-wal`
- `*.db-shm`

因此 GitHub 仓库只保存网站代码和静态资源，不保存大型数据库文件。

## Credits

页面结构和视觉风格参考 Turtle WoW Database。项目仅用于数据库浏览与中文本地化展示。
