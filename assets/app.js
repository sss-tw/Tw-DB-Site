import sqlHttpVfs from "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/+esm";

const { createDbWorker } = sqlHttpVfs;

const I18N = {
  enUS: {
    titleHome: "Turtle WoW Database",
    titleResults: "Search Results",
    summaryHome: "Based on Turtle mirror data",
    summarySearch: "Search database",
    summaryDetail: "Entry details",
    statusInit: "Initializing SQLite worker...",
    statusReady: "Ready",
    statusSearching: "Searching...",
    statusError: "Database load failed",
    emptyHome: "Use the search box above (example: rabbit, thunderfury, fireball).",
    emptyResult: "No results.",
    notFound: "Entry not found.",
    dbNotConfigured: "Please configure db-config.js with your Cloudflare R2 SQLite URL.",
    wowhead: "Wowhead",
    quickFacts: "Quick Facts",
    type: "Type",
    id: "ID",
    name: "Name",
    level: "Level",
    reqLevel: "Req.",
    description: "Description",
    details: "Details",
    tabAll: "All",
    typeItem: "Items",
    typeNpc: "NPCs",
    typeObject: "Objects",
    typeQuest: "Quests",
    typeSpell: "Spells",
    fieldSchool: "School",
    fieldCost: "Cost",
    fieldRange: "Range",
    fieldCastTime: "Cast Time",
    fieldCooldown: "Cooldown",
    fieldSide: "Side",
    fieldZone: "Zone/Sort",
    fieldRewardXp: "Reward XP",
    fieldMinLevel: "Min Level",
    fieldMaxLevel: "Max Level",
    fieldFaction: "Faction",
    fieldTypeText: "Object Type"
  },
  zhCN: {
    titleHome: "海龟魔兽数据库",
    titleResults: "搜索结果",
    summaryHome: "基于本地镜像数据库",
    summarySearch: "数据库搜索",
    summaryDetail: "词条详情",
    statusInit: "正在初始化 SQLite 查询引擎...",
    statusReady: "已就绪",
    statusSearching: "正在搜索...",
    statusError: "数据库加载失败",
    emptyHome: "请使用上方搜索框（例如：雷霆之怒、火球术、布甲）。",
    emptyResult: "没有找到结果。",
    notFound: "未找到该词条。",
    dbNotConfigured: "请先在 db-config.js 配置 Cloudflare R2 的 SQLite 地址。",
    wowhead: "Wowhead",
    quickFacts: "基础信息",
    type: "类型",
    id: "编号",
    name: "名称",
    level: "等级",
    reqLevel: "需求",
    description: "描述",
    details: "详细信息",
    tabAll: "全部",
    typeItem: "物品",
    typeNpc: "NPC",
    typeObject: "物体",
    typeQuest: "任务",
    typeSpell: "法术",
    fieldSchool: "法术系别",
    fieldCost: "消耗",
    fieldRange: "射程",
    fieldCastTime: "施法时间",
    fieldCooldown: "冷却",
    fieldSide: "阵营",
    fieldZone: "区域/分类",
    fieldRewardXp: "奖励经验",
    fieldMinLevel: "最低等级",
    fieldMaxLevel: "最高等级",
    fieldFaction: "阵营 ID",
    fieldTypeText: "物体类型"
  }
};

const TYPE_META = {
  item: { table: "items", idCol: "item_id", iconFallback: "INV_Misc_QuestionMark" },
  npc: { table: "npcs", idCol: "npc_id", iconFallback: "INV_Misc_QuestionMark" },
  object: { table: "objects", idCol: "object_id", iconFallback: "INV_Misc_QuestionMark" },
  quest: { table: "quests", idCol: "quest_id", iconFallback: "INV_Misc_QuestionMark" },
  spell: { table: "spells", idCol: "spell_id", iconFallback: "INV_Misc_QuestionMark" }
};

const state = {
  lang: localStorage.getItem("turtle-db-lang") || "enUS",
  dbWorker: null,
  activeTypeFilter: "all"
};

const el = {
  pageTitle: document.getElementById("page-title"),
  mainHeading: document.getElementById("main-heading"),
  searchForm: document.getElementById("header-search-form"),
  searchInput: document.getElementById("live-search-generic"),
  searchSubmit: document.getElementById("search-submit"),
  searchSummary: document.getElementById("search-summary"),
  searchTabs: document.getElementById("search-tabs"),
  searchResults: document.getElementById("search-results"),
  searchWowhead: document.getElementById("search-wowhead"),
  statusLine: document.getElementById("status-line"),
  langEnBtn: document.getElementById("lang-en-btn"),
  langZhBtn: document.getElementById("lang-zh-btn")
};

function t(key) {
  const bundle = I18N[state.lang] || I18N.enUS;
  return bundle[key] || key;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getConfig() {
  return window.TURTLE_DB_CONFIG || {};
}

function updateLangButtons() {
  el.langEnBtn.classList.toggle("active", state.lang === "enUS");
  el.langZhBtn.classList.toggle("active", state.lang === "zhCN");
}

function setStatus(text, isError = false) {
  el.statusLine.textContent = text || "";
  el.statusLine.style.color = isError ? "#d67272" : "#b5b5b5";
}

async function ensureDb() {
  if (state.dbWorker) return state.dbWorker;
  const cfg = getConfig();
  if (!cfg.databaseUrl || cfg.databaseUrl.includes("pub-your-r2-domain")) {
    throw new Error(t("dbNotConfigured"));
  }

  setStatus(t("statusInit"));
  state.dbWorker = await createDbWorker(
    [{
      from: "inline",
      config: {
        serverMode: "full",
        requestChunkSize: cfg.requestChunkSize || 4096,
        url: cfg.databaseUrl
      }
    }],
    "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sqlite.worker.js",
    "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sql-wasm.wasm"
  );
  setStatus(t("statusReady"));
  return state.dbWorker;
}

async function execRows(sql, params = {}) {
  const worker = await ensureDb();
  const result = await worker.db.exec(sql, params);
  if (!result || !result.length) return [];
  const first = result[0];
  const columns = first.columns || [];
  const values = first.values || [];
  return values.map((row) => {
    const out = {};
    for (let i = 0; i < columns.length; i += 1) {
      out[columns[i]] = row[i];
    }
    return out;
  });
}

function resolveRoute(searchParams) {
  const directTypes = ["item", "npc", "object", "quest", "spell"];
  for (const type of directTypes) {
    if (searchParams.has(type) && /^\d+$/.test(searchParams.get(type) || "")) {
      return { mode: "detail", type, id: Number(searchParams.get(type)) };
    }
  }
  if (searchParams.has("search")) {
    return { mode: "search", query: (searchParams.get("search") || "").trim() };
  }
  return { mode: "home" };
}

function typeLabel(type) {
  if (type === "item") return t("typeItem");
  if (type === "npc") return t("typeNpc");
  if (type === "object") return t("typeObject");
  if (type === "quest") return t("typeQuest");
  if (type === "spell") return t("typeSpell");
  return type;
}

function setTitleAndHeading(title) {
  document.title = `Turtle WoW Database - ${title}`;
  el.pageTitle.textContent = title;
  el.mainHeading.textContent = title;
}

function renderHome() {
  setTitleAndHeading(t("titleHome"));
  el.searchSummary.textContent = t("summaryHome");
  el.searchWowhead.innerHTML = "";
  el.searchTabs.innerHTML = "";
  el.searchResults.innerHTML = `<div class="result-empty">${escapeHtml(t("emptyHome"))}</div>`;
}

function renderTabs(rows) {
  const counts = { item: 0, npc: 0, object: 0, quest: 0, spell: 0 };
  for (const row of rows) {
    if (counts[row.type] != null) counts[row.type] += 1;
  }
  const tabs = [{ key: "all", label: t("tabAll"), count: rows.length }];
  for (const k of ["item", "npc", "object", "quest", "spell"]) {
    if (counts[k] > 0) {
      tabs.push({ key: k, label: typeLabel(k), count: counts[k] });
    }
  }
  el.searchTabs.innerHTML = tabs.map((tab) => (
    `<button data-type="${tab.key}">${escapeHtml(tab.label)} (${tab.count})</button>`
  )).join("");
  Array.from(el.searchTabs.querySelectorAll("button")).forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeTypeFilter = btn.dataset.type || "all";
      renderSearchTable(rows);
    });
  });
}

function buildDetailUrl(type, id) {
  return `?${encodeURIComponent(type)}=${encodeURIComponent(String(id))}`;
}

function renderSearchTable(rows) {
  const filtered = state.activeTypeFilter === "all"
    ? rows
    : rows.filter((row) => row.type === state.activeTypeFilter);

  if (!filtered.length) {
    el.searchResults.innerHTML = `<div class="result-empty">${escapeHtml(t("emptyResult"))}</div>`;
    return;
  }

  const body = filtered.map((row) => {
    const level = row.level ?? row.level_min ?? "-";
    const reqLevel = row.required_level ?? "-";
    const desc = row.short_desc || "-";
    return (
      `<tr>
        <td class="name"><a href="${buildDetailUrl(row.type, row.id)}">${escapeHtml(row.name)}</a></td>
        <td class="muted">${escapeHtml(level)}</td>
        <td class="muted">${escapeHtml(reqLevel)}</td>
        <td>${escapeHtml(typeLabel(row.type))}</td>
        <td class="muted">${escapeHtml(desc)}</td>
      </tr>`
    );
  }).join("");

  el.searchResults.innerHTML = (
    `<div id="search-table-wrap">
      <table id="search-table">
        <thead><tr><th>${escapeHtml(t("name"))}</th><th>${escapeHtml(t("level"))}</th><th>${escapeHtml(t("reqLevel"))}</th><th>${escapeHtml(t("type"))}</th><th>${escapeHtml(t("description"))}</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`
  );
}

async function querySearchRows(queryText) {
  const byId = /^\d+$/.test(queryText);
  const like = `%${queryText}%`;
  const idValue = Number(queryText);
  const locale = state.lang === "zhCN" ? "zhCN" : "__none__";

  const sql = `
    SELECT * FROM (
      SELECT 'item' AS type, i.item_id AS id,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
        i.item_level AS level, i.required_level AS required_level, '' AS short_desc
      FROM items i
      LEFT JOIN entity_localizations l
        ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE (
        (:byId = 1 AND i.item_id = :idValue)
        OR
        (:byId = 0 AND (i.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)))
      )
      UNION ALL
      SELECT 'npc' AS type, n.npc_id AS id,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
        n.level_max AS level, NULL AS required_level, '' AS short_desc
      FROM npcs n
      LEFT JOIN entity_localizations l
        ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE (
        (:byId = 1 AND n.npc_id = :idValue)
        OR
        (:byId = 0 AND (n.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)))
      )
      UNION ALL
      SELECT 'object' AS type, o.object_id AS id,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END AS name,
        NULL AS level, NULL AS required_level, COALESCE(o.type_text, '') AS short_desc
      FROM objects o
      LEFT JOIN entity_localizations l
        ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      WHERE (
        (:byId = 1 AND o.object_id = :idValue)
        OR
        (:byId = 0 AND (o.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)))
      )
      UNION ALL
      SELECT 'quest' AS type, q.quest_id AS id,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
        q.quest_level AS level, q.required_level AS required_level,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.description, q.description) ELSE q.description END AS short_desc
      FROM quests q
      LEFT JOIN entity_localizations l
        ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE (
        (:byId = 1 AND q.quest_id = :idValue)
        OR
        (:byId = 0 AND (
          q.name LIKE :like COLLATE NOCASE
          OR (q.description IS NOT NULL AND q.description LIKE :like COLLATE NOCASE)
          OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
          OR (l.description IS NOT NULL AND l.description LIKE :like COLLATE NOCASE)
        ))
      )
      UNION ALL
      SELECT 'spell' AS type, s.spell_id AS id,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END AS name,
        s.level AS level, NULL AS required_level,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.description, s.description) ELSE s.description END AS short_desc
      FROM spells s
      LEFT JOIN entity_localizations l
        ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
      WHERE (
        (:byId = 1 AND s.spell_id = :idValue)
        OR
        (:byId = 0 AND (
          s.name LIKE :like COLLATE NOCASE
          OR (s.description IS NOT NULL AND s.description LIKE :like COLLATE NOCASE)
          OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
          OR (l.description IS NOT NULL AND l.description LIKE :like COLLATE NOCASE)
        ))
      )
    ) AS all_rows
    ORDER BY name
    LIMIT 300;
  `;

  return execRows(sql, {
    ":byId": byId ? 1 : 0,
    ":idValue": idValue,
    ":like": like,
    ":locale": locale
  });
}

async function renderSearch(queryText) {
  setTitleAndHeading(t("titleResults"));
  el.searchSummary.textContent = t("summarySearch");
  el.searchWowhead.innerHTML = (
    `<a class="button-red" href="https://classic.wowhead.com/?search=${encodeURIComponent(queryText)}" target="_blank" rel="noopener noreferrer">
      <div><blockquote><i>${escapeHtml(t("wowhead"))}</i></blockquote><span>${escapeHtml(t("wowhead"))}</span></div>
    </a>`
  );
  if (!queryText) {
    el.searchTabs.innerHTML = "";
    el.searchResults.innerHTML = `<div class="result-empty">${escapeHtml(t("emptyHome"))}</div>`;
    return;
  }

  setStatus(t("statusSearching"));
  const rows = await querySearchRows(queryText);
  setStatus(t("statusReady"));
  if (!rows.length) {
    el.searchTabs.innerHTML = "";
    el.searchResults.innerHTML = `<div class="result-empty">${escapeHtml(t("emptyResult"))}</div>`;
    return;
  }
  state.activeTypeFilter = "all";
  renderTabs(rows);
  renderSearchTable(rows);
}

function renderMetaItems(items) {
  return (
    `<div id="detail-meta">
      ${items.map((row) => (
        `<div class="meta-item"><b>${escapeHtml(row.label)}:</b> <span>${escapeHtml(row.value)}</span></div>`
      )).join("")}
    </div>`
  );
}

async function queryDetail(type, id) {
  if (type === "item") {
    return execRows(`
      SELECT
        i.item_id AS id,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
        i.item_level, i.required_level, i.quality, i.slot, i.armor_type, i.icon_name, i.wowhead_url
      FROM items i
      LEFT JOIN entity_localizations l
        ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE i.item_id = :id
      LIMIT 1;
    `, { ":id": id, ":lang": state.lang });
  }
  if (type === "npc") {
    return execRows(`
      SELECT
        n.npc_id AS id,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
        n.level_min, n.level_max, n.npc_class, n.faction_id, n.icon_name, n.wowhead_url
      FROM npcs n
      LEFT JOIN entity_localizations l
        ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE n.npc_id = :id
      LIMIT 1;
    `, { ":id": id, ":lang": state.lang });
  }
  if (type === "object") {
    return execRows(`
      SELECT
        o.object_id AS id,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END AS name,
        o.type_text, o.icon_name, o.wowhead_url
      FROM objects o
      LEFT JOIN entity_localizations l
        ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      WHERE o.object_id = :id
      LIMIT 1;
    `, { ":id": id, ":lang": state.lang });
  }
  if (type === "quest") {
    return execRows(`
      SELECT
        q.quest_id AS id,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
        q.quest_level, q.required_level, q.side, q.zone_or_sort, q.rew_xp,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.description, q.description) ELSE q.description END AS description,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.progress_text, q.progress_text) ELSE q.progress_text END AS progress_text,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.completion_text, q.completion_text) ELSE q.completion_text END AS completion_text,
        q.icon_name, q.wowhead_url
      FROM quests q
      LEFT JOIN entity_localizations l
        ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE q.quest_id = :id
      LIMIT 1;
    `, { ":id": id, ":lang": state.lang });
  }
  if (type === "spell") {
    return execRows(`
      SELECT
        s.spell_id AS id,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END AS name,
        s.level, s.school, s.cost_text, s.range_text, s.cast_time_text, s.cooldown_text,
        CASE WHEN :lang='zhCN' THEN COALESCE(l.description, s.description) ELSE s.description END AS description,
        s.icon_name, s.wowhead_url
      FROM spells s
      LEFT JOIN entity_localizations l
        ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
      WHERE s.spell_id = :id
      LIMIT 1;
    `, { ":id": id, ":lang": state.lang });
  }
  return [];
}

function detailWowheadLink(type, id, dbUrl) {
  if (dbUrl) return dbUrl;
  return `https://classic.wowhead.com/?${type}=${id}`;
}

function renderDetailCard(type, row) {
  const meta = [];
  if (type === "item") {
    meta.push({ label: t("type"), value: typeLabel(type) });
    meta.push({ label: t("id"), value: row.id });
    meta.push({ label: t("level"), value: row.item_level ?? "-" });
    meta.push({ label: t("reqLevel"), value: row.required_level ?? "-" });
    meta.push({ label: "Quality", value: row.quality ?? "-" });
    meta.push({ label: "Slot", value: row.slot ?? "-" });
    meta.push({ label: "Armor", value: row.armor_type || "-" });
  } else if (type === "npc") {
    meta.push({ label: t("type"), value: typeLabel(type) });
    meta.push({ label: t("id"), value: row.id });
    meta.push({ label: t("fieldMinLevel"), value: row.level_min ?? "-" });
    meta.push({ label: t("fieldMaxLevel"), value: row.level_max ?? "-" });
    meta.push({ label: "Class", value: row.npc_class ?? "-" });
    meta.push({ label: t("fieldFaction"), value: row.faction_id ?? "-" });
  } else if (type === "object") {
    meta.push({ label: t("type"), value: typeLabel(type) });
    meta.push({ label: t("id"), value: row.id });
    meta.push({ label: t("fieldTypeText"), value: row.type_text || "-" });
  } else if (type === "quest") {
    meta.push({ label: t("type"), value: typeLabel(type) });
    meta.push({ label: t("id"), value: row.id });
    meta.push({ label: t("level"), value: row.quest_level ?? "-" });
    meta.push({ label: t("reqLevel"), value: row.required_level ?? "-" });
    meta.push({ label: t("fieldSide"), value: row.side ?? "-" });
    meta.push({ label: t("fieldZone"), value: row.zone_or_sort ?? "-" });
    meta.push({ label: t("fieldRewardXp"), value: row.rew_xp ?? "-" });
  } else if (type === "spell") {
    meta.push({ label: t("type"), value: typeLabel(type) });
    meta.push({ label: t("id"), value: row.id });
    meta.push({ label: t("level"), value: row.level ?? "-" });
    meta.push({ label: t("fieldSchool"), value: row.school || "-" });
    meta.push({ label: t("fieldCost"), value: row.cost_text || "-" });
    meta.push({ label: t("fieldRange"), value: row.range_text || "-" });
    meta.push({ label: t("fieldCastTime"), value: row.cast_time_text || "-" });
    meta.push({ label: t("fieldCooldown"), value: row.cooldown_text || "-" });
  }

  const wowheadUrl = detailWowheadLink(type, row.id, row.wowhead_url);
  const mainDescription = row.description || "";
  const extraBlock = [];
  if (row.progress_text) {
    extraBlock.push(`<h3>${escapeHtml(state.lang === "zhCN" ? "进度" : "Progress")}</h3>`);
    extraBlock.push(`<div class="detail-text">${escapeHtml(row.progress_text)}</div>`);
  }
  if (row.completion_text) {
    extraBlock.push(`<h3>${escapeHtml(state.lang === "zhCN" ? "完成" : "Completion")}</h3>`);
    extraBlock.push(`<div class="detail-text">${escapeHtml(row.completion_text)}</div>`);
  }

  return (
    `<div id="detail-card">
      <a href="${escapeHtml(wowheadUrl)}" target="_blank" rel="noopener noreferrer" class="button-red">
        <div><blockquote><i>${escapeHtml(t("wowhead"))}</i></blockquote><span>${escapeHtml(t("wowhead"))}</span></div>
      </a>
      <h1 class="detail-title">${escapeHtml(row.name)} <span class="entity-id">#${escapeHtml(row.id)}</span></h1>
      ${renderMetaItems(meta)}
      <h3>${escapeHtml(t("details"))}</h3>
      <div class="detail-text">${escapeHtml(mainDescription || "-")}</div>
      ${extraBlock.join("")}
    </div>`
  );
}

async function renderDetail(type, id) {
  setTitleAndHeading(`${typeLabel(type)} #${id}`);
  el.searchSummary.textContent = t("summaryDetail");
  el.searchTabs.innerHTML = "";
  el.searchWowhead.innerHTML = "";
  setStatus(t("statusSearching"));
  const rows = await queryDetail(type, id);
  setStatus(t("statusReady"));

  if (!rows.length) {
    el.searchResults.innerHTML = `<div class="result-empty">${escapeHtml(t("notFound"))}</div>`;
    return;
  }
  el.searchResults.innerHTML = renderDetailCard(type, rows[0]);
}

async function renderByRoute() {
  const searchParams = new URLSearchParams(window.location.search);
  const route = resolveRoute(searchParams);
  const q = (searchParams.get("search") || "").trim();
  if (q) el.searchInput.value = q;

  if (route.mode === "home") {
    renderHome();
    return;
  }
  try {
    if (route.mode === "search") {
      await renderSearch(route.query);
      return;
    }
    await renderDetail(route.type, route.id);
  } catch (err) {
    console.error(err);
    setStatus(t("statusError"), true);
    el.searchTabs.innerHTML = "";
    el.searchResults.innerHTML = `<div class="result-empty">${escapeHtml(String(err.message || err))}</div>`;
  }
}

function onSearchSubmit(event) {
  event.preventDefault();
  const q = el.searchInput.value.trim();
  const next = new URL(window.location.href);
  next.searchParams.delete("item");
  next.searchParams.delete("npc");
  next.searchParams.delete("object");
  next.searchParams.delete("quest");
  next.searchParams.delete("spell");
  if (q) {
    next.searchParams.set("search", q);
  } else {
    next.searchParams.delete("search");
  }
  window.location.href = `${next.pathname}?${next.searchParams.toString()}`;
}

function switchLanguage(lang) {
  if (state.lang === lang) return;
  state.lang = lang;
  localStorage.setItem("turtle-db-lang", lang);
  updateLangButtons();
  renderByRoute();
}

function initEvents() {
  el.searchForm.addEventListener("submit", onSearchSubmit);
  el.searchSubmit.addEventListener("click", () => el.searchForm.requestSubmit());
  el.langEnBtn.addEventListener("click", () => switchLanguage("enUS"));
  el.langZhBtn.addEventListener("click", () => switchLanguage("zhCN"));
}

function initLegacyRedirect() {
  const q = new URLSearchParams(window.location.search);
  const pluralMap = {
    items: "item",
    npcs: "npc",
    objects: "object",
    quests: "quest",
    spells: "spell"
  };
  for (const oldKey of Object.keys(pluralMap)) {
    if (!q.has(oldKey)) continue;
    const value = (q.get(oldKey) || "").trim();
    const next = new URL(window.location.href);
    next.searchParams.delete(oldKey);
    if (/^\d+$/.test(value)) {
      next.searchParams.set(pluralMap[oldKey], value);
    } else if (value) {
      next.searchParams.set("search", value);
    }
    window.location.replace(`${next.pathname}?${next.searchParams.toString()}`);
    return true;
  }
  return false;
}

async function bootstrap() {
  updateLangButtons();
  initEvents();
  if (initLegacyRedirect()) return;
  await renderByRoute();
}

bootstrap();
