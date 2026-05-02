# Turtle DB 子页面与功能清单（对齐 database.turtlecraft.gg）

本文档用于定义“必须实现”的页面、URL 参数、功能行为。  
目标：与 [database.turtlecraft.gg](https://database.turtlecraft.gg) 的信息架构保持一致（你截图中的菜单也包含在内）。

---

## 1. 顶层信息架构

主导航：`Database`  
`Database` 下必须包含 `Browse` 分组，至少含以下子页：

- `Items`（`?items`）
- `Item Sets`（`?itemsets`）
- `NPCs`（`?npcs`）
- `Objects`（`?objects`）
- `Quests`（`?quests`）
- `Spells`（`?spells`）
- `Factions`（`?factions`）

同时必须支持对应详情页（单数）：

- `?item=<id>`
- `?npc=<id>`
- `?object=<id>`
- `?quest=<id>`
- `?spell=<id>`
- `?faction=<id>`

---

## 2. URL/参数规范（必须支持）

## 2.1 通用

- `?search=<keyword>`：全站搜索（主页输入框）
- 中英文切换参数建议使用前端状态（localStorage），不强制进入 URL

## 2.2 Browse 列表页（复数）

- `?items`
  - 分类参数：`?items=<class>`、`?items=<class>.<subclass>`、`?items=<class>.<subclass>.<subsubclass>`
- `?itemsets`
  - 职业筛选参数：`?itemsets&filter=cl=<classId>`
- `?npcs`
  - 类型参数：`?npcs=<typeId>`
- `?objects`
  - 类型参数：`?objects=<typeId>`
- `?quests`
  - 分类参数：`?quests=<category2>.<category>`
- `?spells`
  - 技能树/分类参数：`?spells=<path>`（例如脚本中出现的 `?spells=-3.<family>`）
- `?factions`

## 2.3 详情页（单数）

- `?item=<id>`
- `?npc=<id>`
- `?object=<id>`
- `?quest=<id>`
- `?spell=<id>`
- `?faction=<id>`

---

## 2.4 参数范围（已按原版菜单校验）

以下范围来自原站 `templates/wowhead/js/locale_enus.js` 的菜单定义（`mn_database/mn_items/mn_npcs/...`），用于实现时的“合法输入集”。

### A. `?items=<class>[.<subclass>[.<subsubclass>]]`

- `class`（主类）允许值：
  - `0,1,2,4,6,7,9,11,12,13,15`
- 常用 `subclass` 范围（按 class）：
  - `class=0`（Consumables）：`0..8`
  - `class=1`（Containers）：`0,1,2,3,4,7`
  - `class=2`（Weapons）：`0,1,2,3,4,5,6,7,8,10,13,14,15,16,18,19,20`
  - `class=4`（Armor）：`0,1,2,3,4,6,7,8,9`
  - `class=6`（Projectiles）：`2,3`
  - `class=7`（Trade Goods）：`1,2,3,5,6,7,8,9,10,11,12,13`
  - `class=9`（Recipes）：`0..9`
  - `class=11`（Quivers）：`2,3`
  - `class=15`（Misc）：`0,1,2,4`
  - `class=12,13` 通常无细分
- `subsubclass`（当前原站菜单中仅显式出现）：
  - `class=0, subclass=2` 时可用：`1,2`

### B. `?itemsets&filter=cl=<classId>`

- `classId`（职业）允许值：
  - `1,2,3,4,5,7,8,9,11`

### C. `?npcs=<typeId>`

- `typeId` 允许值：
  - `1,2,3,4,5,6,7,8,9,10,12`

### D. `?objects=<typeId>`

- `typeId` 允许值：
  - `9,3,-5,-3,-4,-2`

### E. `?quests=<category2>[.<category>]`

- `category2`（一级分类）允许值：
  - `0,1,2,3,4,5,6,7,9,-2,-44`
- `category`（二级分类）取值取决于 `category2`：
  - 当 `category2=0/1/2/3`：通常为 zoneId（正整数）
  - 当 `category2=4/5/6/7/9`：通常为负数 sortId 或活动/职业/专业子类 ID
  - `category2=-2,-44` 常见为单值入口（可直接 `?quests=-2` / `?quests=-44`）

### F. `?spells=<path>`

- `path` 为分层路径，原站是多级菜单编码，不是固定单一整数。
- 实际出现格式包括（至少）：
  - `?spells=<cat>`
  - `?spells=<cat>.<subcat>`
  - `?spells=<cat>.<class>.<skill>`
  - `?spells=-3.<family>`（宠物技能族）
- 顶层 `cat` 常见值（来自 `mn_spells`）：`7,-3,11,9,8,10,-4,6,0`

### G. `?factions` / `?faction=<id>`

- `?factions`：列表页
- `?faction=<id>`：详情页（`id` 为正整数）
- 原站菜单未给 factions 的过滤参数集合（主要是列表 + 详情）

### H. 单数详情页 ID 参数

- `?item=<id>` / `?npc=<id>` / `?object=<id>` / `?quest=<id>` / `?spell=<id>` / `?faction=<id>`
- 原站语义：`id` 为正整数；实现时建议按数据库实际存在值验证。

---

## 2.5 原站校验结论（本轮）

- 通过浏览器实测确认可达（至少）：`?items`、`?npcs`（页面标题与列表存在）。
- 其他路由在自动化请求下会偶发 Cloudflare challenge（“Just a moment”），因此参数范围以原站同源脚本定义为准（`locale_enus.js`）。
- 结论：本规范中的页面集合和参数语法与原站菜单定义一致，可作为实现基线。

---

## 3. 各页面功能要求

## 3.1 首页（`/`）

- 中央 Logo + 搜索框布局与目标站一致
- 输入关键词后显示下拉联想（popup）
- 联想项点击跳转到对应详情页
- `Enter` 提交可触发搜索结果联想刷新（与目标站行为一致）
- 右上角保留中英文切换（这是你新增需求）

## 3.2 搜索联想（主页 popup）

- 必须锚定在搜索框下方（不能固定到左上角）
- 样式：深色背景、黄/白文本、右侧显示类型（Item/NPC/...）
- 最少包含：`item/npc/object/quest/spell`
- 支持中英文显示：
  - 中文模式优先取 `entity_localizations(locale='zhCN')`
  - 无中文时回退英文

## 3.3 Browse 列表页（`?items`/`?npcs`/...）

通用要求：

- 列表视图（ListView 风格）
- 列头支持排序（至少名称列）
- 支持分页或懒加载（大表必须可用）
- 行内链接跳转详情页
- 顶部面包屑/菜单可回到 `Database > Browse`

各页最低字段：

- `?items`：`name / ilvl / req level / type / source(可选)`
- `?itemsets`：`name / group / class(可选)`
- `?npcs`：`name / level / location / type`
- `?objects`：`name / location / type`
- `?quests`：`name / level / req level / side / category`
- `?spells`：`name / rank(or subtext) / level / school(or category)`
- `?factions`：`name / group / side`

## 3.4 详情页（`?item=<id>` 等）

通用要求：

- 页面头部与全站一致（风格统一）
- 主标题（名称）+ 类型 + ID
- Quick Facts 区块
- 详情描述区块
- 关联链接区块（可逐步补充）
- Wowhead 按钮
- 中文切换时尽可能显示中文字段（名称/描述/任务文本等）

各实体最低详情字段：

- `item`：`name, item_level, required_level, quality, slot, armor/type`
- `npc`：`name, level_min, level_max, type/class, faction`
- `object`：`name, type_text`
- `quest`：`name, quest_level, required_level, side, description, progress_text, completion_text`
- `spell`：`name, level, school, cost_text, range_text, cast_time_text, cooldown_text, description`
- `faction`：`name, group, side`

---

## 4. 数据层能力要求（SQLite）

必须可从 SQLite 查询出以下实体：

- `items`
- `npcs`
- `objects`
- `quests`
- `spells`
- `factions`（若当前主库无 factions 表，需补建或导入）

本地化：

- 使用 `entity_localizations`（`locale='zhCN'`）
- 字段回退策略：`COALESCE(zhCN, enUS)`

---

## 5. 实现阶段建议（执行顺序）

1. **路由层**：先把所有 URL 入口打通（复数列表 + 单数详情 + factions）
2. **列表页**：先实现 `items/npcs/objects/quests/spells/factions` 的基础 ListView
3. **详情页**：补齐 6 类详情模板
4. **菜单系统**：还原 `Database > Browse > ...` 分层菜单
5. **样式对齐**：像素级微调（字号、间距、边框、hover）
6. **中文覆盖**：逐页核查中文回退逻辑

---

## 6. 验收清单（必须全部通过）

- 能打开并正确渲染：
  - `?items ?itemsets ?npcs ?objects ?quests ?spells ?factions`
  - `?item=<id> ?npc=<id> ?object=<id> ?quest=<id> ?spell=<id> ?faction=<id>`
- 搜索 popup 位置正确（搜索框下方）
- 切换中文后，名称/描述能显示中文（有数据时）
- 样式骨架与目标站一致（主页 + 列表页 + 详情页）

