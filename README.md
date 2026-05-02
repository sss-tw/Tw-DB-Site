# turtle_db_publish

这是一个可直接发布到 GitHub Pages 的前端目录，特点：

- 无静态词条页面（不再有 `item/123/index.html` 这类预渲染文件）
- 浏览器端通过 `sql.js-httpvfs` 直接查询远端 SQLite
- 数据库可放在 Cloudflare R2（通过 HTTP Range 分块读取）
- 支持中英文切换（中文优先显示 `entity_localizations` 中的 `zhCN`）

## 目录结构

- `index.html` 页面入口
- `app.js` 查询与渲染逻辑
- `style.css` 页面样式
- `db-config.js` 数据库 URL 配置

## 上线步骤

1. 编辑 `db-config.js`

```js
window.TURTLE_DB_CONFIG = {
  databaseUrl: "https://你的-r2-公开域名/turtle_mirror.sqlite3",
  requestChunkSize: 4096
};
```

2. 把 `turtle_db_publish` 目录作为站点根目录发布到 GitHub Pages。
3. 确保 Cloudflare R2 对数据库文件返回可用 CORS 和 Range 相关响应头。

## CORS / Range 注意事项

前端与数据库跨域时，服务端建议允许：

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Range`
- `Access-Control-Expose-Headers: Content-Range, Accept-Ranges`

参考：

- [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs)
- [Query SQLite on GitHub Pages with sql.js-httpvfs](https://recca0120.github.io/en/2026/03/07/sql-js-httpvfs-static-hosting/)
