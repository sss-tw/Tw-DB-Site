import sqlHttpVfs from "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/+esm";

const { createDbWorker } = sqlHttpVfs;

const I18N = {
  enUS: {
    statusReady: "Ready",
    statusLoading: "Initializing SQLite worker...",
    statusSearching: "Searching...",
    statusError: "Database error",
    type_item: "Item",
    type_itemset: "Item Set",
    type_npc: "NPC",
    type_object: "Object",
    type_quest: "Quest",
    type_spell: "Spell",
    type_faction: "Faction",
    detail: "Details",
    progress: "Progress",
    completion: "Completion",
    gains: "Gains",
    relatedQuests: "Related Quests",
    starts: "Starts",
    ends: "Ends",
    list_name: "Name",
    list_item_level: "iLvl",
    list_required_level: "Req. Level",
    list_type: "Type",
    list_level: "Level",
    list_side: "Side",
    list_school: "School",
    list_group: "Group",
    list_actions: "Relations",
    list_no_results: "No results",
    quickFacts: "Quick Facts",
    entityId: "ID",
    wowhead: "Wowhead",
    inGameLink: "In-Game Link",
    relatedNpcs: "Related NPCs",
    relatedItems: "Related Items",
    relatedObjects: "Related Objects",
    questStartBy: "Starts From",
    questEndBy: "Ends At",
    questRequires: "Requires Quests",
    questOpens: "Opens Quests",
    searchResults: "Search Results",
    description: "Description",
    reward: "Reward",
    setBonuses: "Set Bonuses",
    spellDetails: "Details on spell",
    seeAlso: "See also",
    history: "History",
    reputation: "Reputation",
    taughtBy: "Taught by",
    droppedBy: "Dropped by",
    containedInObject: "Contained in object",
    createdBy: "Created by",
    uncategorizedSpells: "Uncategorized spells",
    startsQuest: "Starts quest",
    contains: "Contains",
    members: "Members",
    searchPlaceholder: "Search database...",
    searchButton: "Search",
    browseDatabase: "Browse Database",
    browseHint: "Jump directly to common database sections.",
    popularBrowse: "Popular Browse",
    allEntries: "All"
  },
  zhCN: {
    statusReady: "已就绪",
    statusLoading: "正在初始化 SQLite 查询引擎...",
    statusSearching: "正在搜索...",
    statusError: "数据库错误",
    type_item: "物品",
    type_itemset: "套装",
    type_npc: "NPC",
    type_object: "物体",
    type_quest: "任务",
    type_spell: "法术",
    type_faction: "阵营",
    detail: "详细信息",
    progress: "进度",
    completion: "完成",
    gains: "收益",
    relatedQuests: "关联任务",
    starts: "起始",
    ends: "结束",
    list_name: "名称",
    list_item_level: "物品等级",
    list_required_level: "需求等级",
    list_type: "类型",
    list_level: "等级",
    list_side: "阵营",
    list_school: "系别",
    list_group: "分组",
    list_actions: "关联",
    list_no_results: "无结果",
    quickFacts: "基础信息",
    entityId: "ID",
    wowhead: "Wowhead",
    inGameLink: "游戏内链接",
    relatedNpcs: "相关NPC",
    relatedItems: "相关物品",
    relatedObjects: "相关物体",
    questStartBy: "起始于",
    questEndBy: "结束于",
    questRequires: "前置任务",
    questOpens: "后续任务",
    searchResults: "搜索结果",
    description: "描述",
    reward: "奖励",
    setBonuses: "套装奖励",
    spellDetails: "法术详情",
    seeAlso: "相关信息",
    history: "历史",
    reputation: "声望",
    taughtBy: "训练师",
    droppedBy: "掉落自",
    containedInObject: "包含于物体",
    createdBy: "制造来源",
    uncategorizedSpells: "未分类法术",
    startsQuest: "起始任务",
    contains: "包含",
    members: "成员",
    searchPlaceholder: "搜索数据库...",
    searchButton: "搜索",
    browseDatabase: "浏览数据库",
    browseHint: "直接进入常用数据库分类，减少搜索等待。",
    popularBrowse: "常用浏览",
    allEntries: "全部"
  }
};

const state = {
  lang: localStorage.getItem("turtle-db-lang") || "enUS",
  dbWorker: null,
  timer: null,
  originalMenus: null
};

const el = {
  form: document.getElementById("header-search-form") || document.getElementById("search-form"),
  input: document.getElementById("live-search-generic") || document.getElementById("search-generic"),
  searchButton: document.getElementById("home-search-btn"),
  status: document.getElementById("status-line"),
  results: document.getElementById("local-results"),
  precontents: document.getElementById("main-precontents"),
  detail: document.getElementById("local-detail"),
  tabs: document.getElementById("tabs-generic"),
  listview: document.getElementById("listview-generic"),
  headerTitle: document.querySelector("#header-logo h1"),
  langEn: document.getElementById("lang-en-btn"),
  langZh: document.getElementById("lang-zh-btn")
};

function t(key) {
  const bundle = I18N[state.lang] || I18N.enUS;
  return bundle[key] || key;
}

function uiLabel(label) {
  if (state.lang !== "zhCN") return label;
  const labels = {
    "Database": "数据库",
    "Browse": "浏览",
    "Items": "物品",
    "Item Sets": "套装",
    "Weapons": "武器",
    "Armor": "护甲",
    "One-Handed Swords": "单手剑",
    "NPCs": "NPC",
    "Npcs": "NPC",
    "Objects": "物体",
    "Quests": "任务",
    "Spells": "法术",
    "Factions": "阵营",
    "One-Handed Axes": "单手斧",
    "Two-Handed Axes": "双手斧",
    "Bows": "弓",
    "Guns": "枪械",
    "One-Handed Maces": "单手锤",
    "Two-Handed Maces": "双手锤",
    "Polearms": "长柄武器",
    "One-Handed Swords": "单手剑",
    "Two-Handed Swords": "双手剑",
    "Staves": "法杖",
    "Fist Weapons": "拳套",
    "Miscellaneous": "杂项",
    "Daggers": "匕首",
    "Thrown": "投掷武器",
    "Crossbows": "弩",
    "Wands": "魔杖",
    "Fishing Poles": "鱼竿",
    "Cloth": "布甲",
    "Leather": "皮甲",
    "Mail": "锁甲",
    "Plate": "板甲",
    "Shields": "盾牌",
    "Librams": "圣契",
    "Idols": "神像",
    "Totems": "图腾",
    "Sigils": "魔印",
    "Head": "头部",
    "Neck": "颈部",
    "Shoulder": "肩部",
    "Shirt": "衬衣",
    "Chest": "胸部",
    "Waist": "腰部",
    "Legs": "腿部",
    "Feet": "脚",
    "Wrist": "手腕",
    "Hands": "手",
    "Finger": "手指",
    "Trinket": "饰品",
    "Held In Off-hand": "副手物品",
    "Relic": "圣物",
    "Ammo": "弹药",
    "Quiver": "箭袋",
    "Bag": "背包",
    "Key": "钥匙",
    "Permanent": "永久",
    "Junk": "垃圾",
    "Reagent": "材料",
    "Consumable": "消耗品",
    "Consumables": "消耗品",
    "Trade Goods": "商品",
    "Recipe": "配方",
    "Gem": "宝石",
    "Glyph": "雕文",
    "Quest": "任务",
    "Projectile": "弹药",
    "Projectiles": "弹药",
    "Containers": "容器",
    "Bags": "背包",
    "Soul Bags": "灵魂袋",
    "Herb Bags": "草药袋",
    "Enchanting Bags": "附魔材料袋",
    "Engineering Bags": "工程学材料袋",
    "Leatherworking Bags": "制皮材料袋",
    "Potions": "药水",
    "Elixirs": "药剂",
    "Flasks": "合剂",
    "Scrolls": "卷轴",
    "Food & Drinks": "食物和饮料",
    "Permanent Item Enhancements": "永久物品强化",
    "Bandages": "绷带",
    "Other": "其他",
    "Parts": "零件",
    "Explosives": "爆炸物",
    "Devices": "装置",
    "Metal & Stone": "金属和石头",
    "Meat": "肉类",
    "Herbs": "草药",
    "Elemental": "元素",
    "Enchanting": "附魔",
    "Material": "材料",
    "Arrows": "箭",
    "Bullets": "子弹",
    "Quivers": "箭袋",
    "Ammo Pouches": "弹药袋",
    "Recipes": "配方",
    "Books": "书籍",
    "Reagents": "材料",
    "Keys": "钥匙",
    "Amulets": "项链",
    "Cloaks": "披风",
    "Rings": "戒指",
    "Trinkets": "饰品",
    "Off-hand Frills": "副手物品",
    "Shirts": "衬衣",
    "Tabards": "战袍",
    "Companions": "伙伴",
    "Mounts": "坐骑",
    "Classes": "职业",
    "Professions": "专业",
    "Druid": "德鲁伊",
    "Hunter": "猎人",
    "Mage": "法师",
    "Paladin": "圣骑士",
    "Priest": "牧师",
    "Rogue": "潜行者",
    "Shaman": "萨满祭司",
    "Warlock": "术士",
    "Warrior": "战士",
    "Alchemy": "炼金术",
    "Blacksmithing": "锻造",
    "Cooking": "烹饪",
    "Engineering": "工程学",
    "First Aid": "急救",
    "Fishing": "钓鱼",
    "Herbalism": "草药学",
    "Leatherworking": "制皮",
    "Tailoring": "裁缝",
    "Class Skills": "职业技能",
    "Pet Skills": "宠物技能",
    "Professions Skills": "专业技能",
    "Secondary Skills": "辅助技能",
    "Armor Proficiencies": "护甲熟练度",
    "Weapon Skills": "武器技能",
    "Languages": "语言",
    "Mounts": "坐骑",
    "Companions": "伙伴",
    "Uncategorized": "未分类",
    "Turtle WoW Quests": "乌龟服任务",
    "Balance": "平衡",
    "Feral Combat": "野性战斗",
    "Restoration": "恢复",
    "Beast Mastery": "野兽控制",
    "Marksmanship": "射击",
    "Survival": "生存",
    "Arcane": "奥术",
    "Fire": "火焰",
    "Frost": "冰霜",
    "Holy": "神圣",
    "Protection": "防护",
    "Retribution": "惩戒",
    "Discipline": "戒律",
    "Shadow Magic": "暗影魔法",
    "Assassination": "刺杀",
    "Combat": "战斗",
    "Lockpicking": "开锁",
    "Subtlety": "敏锐",
    "Elemental Combat": "元素战斗",
    "Enhancement": "增强",
    "Affliction": "痛苦",
    "Demonology": "恶魔学识",
    "Destruction": "毁灭",
    "Arms": "武器",
    "Fury": "狂怒",
    "Ghoul": "食尸鬼",
    "Generic": "通用",
    "Bat": "蝙蝠",
    "Bear": "熊",
    "Bird of Prey": "猛禽",
    "Boar": "野猪",
    "Carrion Bird": "食腐鸟",
    "Cat": "猫科",
    "Chimera": "奇美拉",
    "Core Hound": "熔岩犬",
    "Crab": "螃蟹",
    "Crocolisk": "鳄鱼",
    "Devilsaur": "魔暴龙",
    "Dragonhawk": "龙鹰",
    "Gorilla": "猩猩",
    "Hyena": "土狼",
    "Moth": "蛾子",
    "Nether Ray": "虚空鳐",
    "Raptor": "迅猛龙",
    "Ravager": "掠食者",
    "Rhino": "犀牛",
    "Scorpid": "蝎子",
    "Serpent": "蛇",
    "Silithid": "异种虫",
    "Spider": "蜘蛛",
    "Spirit Beast": "灵魂兽",
    "Sporebat": "孢子蝠",
    "Tallstrider": "陆行鸟",
    "Turtle": "乌龟",
    "Warp Stalker": "迁跃捕猎者",
    "Wasp": "黄蜂",
    "Wind Serpent": "风蛇",
    "Wolf": "狼",
    "Worm": "蠕虫",
    "Felguard": "恶魔卫士",
    "Felhunter": "地狱猎犬",
    "Imp": "小鬼",
    "Succubus": "魅魔",
    "Voidwalker": "虚空行者",
    "Mining": "采矿",
    "Skinning": "剥皮",
    "Riding": "骑术",
    "Racial Traits": "种族特长",
    "Armorsmithing": "护甲锻造",
    "Weaponsmithing": "武器锻造",
    "Master Axesmithing": "铸斧大师",
    "Master Hammersmithing": "铸锤大师",
    "Master Swordsmithing": "铸剑大师",
    "Gnomish Engineering": "侏儒工程学",
    "Goblin Engineering": "地精工程学",
    "Dragonscale Leatherworking": "龙鳞制皮",
    "Elemental Leatherworking": "元素制皮",
    "Tribal Leatherworking": "部族制皮",
    "Mooncloth Tailoring": "月布裁缝",
    "Shadoweave Tailoring": "暗纹裁缝",
    "Spellfire Tailoring": "魔焰裁缝",
    "Humanoid": "人型生物",
    "Humanoids": "人型生物",
    "Beast": "野兽",
    "Beasts": "野兽",
    "Dragonkin": "龙类",
    "Demon": "恶魔",
    "Demons": "恶魔",
    "Elementals": "元素生物",
    "Giant": "巨人",
    "Giants": "巨人",
    "Undead": "亡灵",
    "Critter": "小动物",
    "Critters": "小动物",
    "Mechanical": "机械",
    "Mechanicals": "机械",
    "Small Pets": "小宠物",
    "Not specified": "未指定",
    "Totem": "图腾",
    "Non-combat Pet": "非战斗宠物",
    "Gas Cloud": "气体云雾",
    "Herb": "草药",
    "Vein": "矿脉",
    "Gathering node": "采集点",
    "Chest": "胸部",
    "Door": "门",
    "Button": "按钮",
    "Questgiver": "任务给予者",
    "Book": "书籍",
    "Trap": "陷阱",
    "Container": "容器",
    "Footlockers": "提箱",
    "Mineral Veins": "矿脉",
    "Azeroth": "艾泽拉斯",
    "Eastern Kingdoms": "东部王国",
    "Kalimdor": "卡利姆多",
    "Dungeons": "地下城",
    "Raids": "团队副本",
    "Battlegrounds": "战场",
    "All": "全部",
    "Seasonal": "节日",
    "Daily Quests": "日常任务",
    "Epic": "史诗",
    "Legendary": "传说",
    "Reputation": "声望",
    "Ahn'Qiraj War Effort": "安其拉战争物资",
    "Darkmoon Faire": "暗月马戏团",
    "Hallow's End": "万圣节",
    "Lunar Festival": "春节",
    "Midsummer Fire Festival": "仲夏火焰节",
    "Alterac Mountains": "奥特兰克山脉",
    "Arathi Highlands": "阿拉希高地",
    "Badlands": "荒芜之地",
    "Blackrock Mountain": "黑石山",
    "Blasted Lands": "诅咒之地",
    "Burning Steppes": "燃烧平原",
    "Deadwind Pass": "逆风小径",
    "Deeprun Tram": "矿道地铁",
    "Dun Morogh": "丹莫罗",
    "Duskwood": "暮色森林",
    "Eastern Plaguelands": "东瘟疫之地",
    "Elwynn Forest": "艾尔文森林",
    "Hillsbrad Foothills": "希尔斯布莱德丘陵",
    "Ironforge": "铁炉堡",
    "Loch Modan": "洛克莫丹",
    "Redridge Mountains": "赤脊山",
    "Searing Gorge": "灼热峡谷",
    "Silverpine Forest": "银松森林",
    "Stormwind City": "暴风城",
    "Stranglethorn Vale": "荆棘谷",
    "Swamp of Sorrows": "悲伤沼泽",
    "The Hinterlands": "辛特兰",
    "Tirisfal Glades": "提瑞斯法林地",
    "Undercity": "幽暗城",
    "Western Plaguelands": "西瘟疫之地",
    "Westfall": "西部荒野",
    "Wetlands": "湿地",
    "Ashenvale": "灰谷",
    "Azshara": "艾萨拉",
    "Darkshore": "黑海岸",
    "Darnassus": "达纳苏斯",
    "Desolace": "凄凉之地",
    "Durotar": "杜隆塔尔",
    "Dustwallow Marsh": "尘泥沼泽",
    "Felwood": "费伍德森林",
    "Feralas": "菲拉斯",
    "Moonglade": "月光林地",
    "Mulgore": "莫高雷",
    "Orgrimmar": "奥格瑞玛",
    "Silithus": "希利苏斯",
    "Stonetalon Mountains": "石爪山脉",
    "Tanaris": "塔纳利斯",
    "Teldrassil": "泰达希尔",
    "The Barrens": "贫瘠之地",
    "Thousand Needles": "千针石林",
    "Thunder Bluff": "雷霆崖",
    "Timbermaw Hold": "木喉要塞",
    "Un'Goro Crater": "安戈洛环形山",
    "Winterspring": "冬泉谷",
    "Blackfathom Deeps": "黑暗深渊",
    "Blackrock Depths": "黑石深渊",
    "Blackrock Spire": "黑石塔",
    "Dire Maul": "厄运之槌",
    "Gnomeregan": "诺莫瑞根",
    "Maraudon": "玛拉顿",
    "Ragefire Chasm": "怒焰裂谷",
    "Razorfen Downs": "剃刀高地",
    "Razorfen Kraul": "剃刀沼泽",
    "Scarlet Monastery": "血色修道院",
    "Scholomance": "通灵学院",
    "Shadowfang Keep": "影牙城堡",
    "Stratholme": "斯坦索姆",
    "The Deadmines": "死亡矿井",
    "The Stockade": "暴风城监狱",
    "Uldaman": "奥达曼",
    "Wailing Caverns": "哀嚎洞穴",
    "Zul'Farrak": "祖尔法拉克",
    "Blackwing Lair": "黑翼之巢",
    "Molten Core": "熔火之心",
    "Naxxramas": "纳克萨玛斯",
    "Onyxia's Lair": "奥妮克希亚的巢穴",
    "Ruins of Ahn'Qiraj": "安其拉废墟",
    "Temple of Ahn'Qiraj": "安其拉神殿",
    "Zul'Gurub": "祖尔格拉布",
    "Arathi Basin": "阿拉希盆地",
    "Alterac Valley": "奥特兰克山谷",
    "Warsong Gulch": "战歌峡谷",
    "Level": "等级",
    "Req.": "需求",
    "Requires level": "需求等级",
    "Required Level": "需求等级",
    "Item Level": "物品等级",
    "Quest Level": "任务等级",
    "Side": "阵营",
    "Start": "开始",
    "End": "结束",
    "Sharable": "可共享",
    "Allowable Races": "可用种族",
    "Race Mask": "种族掩码",
    "Allowable Classes": "可用职业",
    "Class Mask": "职业掩码",
    "Start Script": "开始脚本",
    "Complete Script": "完成脚本",
    "Group": "分组",
    "Buy for": "买入价格",
    "Sells for": "卖出价格",
    "Display ID": "显示 ID",
    "DisplayId": "显示 ID",
    "Disenchant ID": "分解 ID",
    "Script Name": "脚本名",
    "Quality": "品质",
    "Slot": "部位",
    "Armor Type": "护甲类型",
    "Type": "类型",
    "School": "系别",
    "Cost": "消耗",
    "Range": "距离",
    "Cast Time": "施法时间",
    "Cooldown": "冷却",
    "Class": "分类",
    "React": "反应",
    "Faction": "阵营",
    "Faction ID": "阵营 ID",
    "Health": "生命值",
    "Mana": "法力值",
    "Wealth": "财富",
    "Damage": "伤害",
    "Armor": "护甲",
    "Equipment ID": "装备 ID",
    "NPC flags": "NPC 标记",
    "Name": "名称",
    "Description": "描述",
    "Source": "来源",
    "Location": "位置",
    "Skill": "技能",
    "Duration": "持续时间",
    "Mechanic": "机制",
    "Dispel type": "驱散类型",
    "Category Cooldown": "分类冷却",
    "Effect #1": "效果 #1",
    "Effect #2": "效果 #2"
  };
  return labels[label] || label;
}

function pathLabel(label, href = "") {
  if (state.lang === "zhCN" && String(href || "").startsWith("?objects")) {
    const objectLabels = {
      "Chest": "宝箱",
      "Book": "书籍",
      "Button": "按钮",
      "Door": "门",
      "Trap": "陷阱",
      "Container": "容器"
    };
    if (objectLabels[label]) return objectLabels[label];
  }
  return uiLabel(label);
}

function listTypeLabel(listType) {
  return {
    items: pathLabel("Items"),
    itemsets: pathLabel("Item Sets"),
    npcs: pathLabel("NPCs"),
    objects: pathLabel("Objects"),
    quests: pathLabel("Quests"),
    spells: pathLabel("Spells"),
    factions: pathLabel("Factions")
  }[listType] || listType;
}

function localizeItemAttributeText(value) {
  const raw = String(value == null ? "" : value);
  if (state.lang !== "zhCN" || !raw) return raw;
  const exact = {
    "Poor": "粗糙",
    "Common": "普通",
    "Uncommon": "优秀",
    "Rare": "精良",
    "Epic": "史诗",
    "Legendary": "传说",
    "Artifact": "神器",
    "All": "全部",
    "Cloth": "布甲",
    "Leather": "皮甲",
    "Mail": "锁甲",
    "Plate": "板甲",
    "Shield": "盾牌",
    "Shields": "盾牌",
    "Head": "头部",
    "Neck": "颈部",
    "Shoulder": "肩部",
    "Back": "背部",
    "Chest": "胸部",
    "Shirt": "衬衣",
    "Tabard": "战袍",
    "Wrist": "手腕",
    "Hands": "手",
    "Waist": "腰部",
    "Legs": "腿部",
    "Feet": "脚",
    "Finger": "手指",
    "Trinket": "饰品",
    "One-Hand": "单手",
    "Two-Hand": "双手",
    "Main Hand": "主手",
    "Off Hand": "副手",
    "Held In Off-hand": "副手物品",
    "Ranged": "远程",
    "Projectile": "弹药",
    "Relic": "圣物",
    "Axe": "斧",
    "Sword": "剑",
    "Mace": "锤",
    "Polearm": "长柄武器",
    "Staff": "法杖",
    "Dagger": "匕首",
    "Fist Weapon": "拳套",
    "Bow": "弓",
    "Gun": "枪械",
    "Crossbow": "弩",
    "Wand": "魔杖",
    "Binds when picked up": "拾取后绑定",
    "Binds when equipped": "装备后绑定",
    "Binds when used": "使用后绑定",
    "Unique": "唯一",
    "Unique-Equipped": "唯一装备",
    "Soulbound": "已绑定",
    "Strength": "力量",
    "Agility": "敏捷",
    "Stamina": "耐力",
    "Intellect": "智力",
    "Spirit": "精神",
    "Defense": "防御",
    "Fire Resistance": "火焰抗性",
    "Nature Resistance": "自然抗性",
    "Frost Resistance": "冰霜抗性",
    "Shadow Resistance": "暗影抗性",
    "Arcane Resistance": "奥术抗性",
    "Resistance": "抗性"
  };
  const trimmed = raw.trim();
  if (exact[trimmed]) return raw.replace(trimmed, exact[trimmed]);
  return raw
    .replace(/\bBinds when picked up\b/g, "拾取后绑定")
    .replace(/\bBinds when equipped\b/g, "装备后绑定")
    .replace(/\bBinds when used\b/g, "使用后绑定")
    .replace(/\bUnique-Equipped\b/g, "唯一装备")
    .replace(/\bUnique\b/g, "唯一")
    .replace(/\bSoulbound\b/g, "已绑定")
    .replace(/\bEquip:\s*/g, "装备：")
    .replace(/\bUse:\s*/g, "使用：")
    .replace(/\bIncreases your chance to hit by ([\d.]+)%/gi, "使你的命中几率提高 $1%")
    .replace(/\bImproves your chance to hit by ([\d.]+)%/gi, "使你的命中几率提高 $1%")
    .replace(/\bImproves your chance to get a critical strike by ([\d.]+)%/gi, "使你的爆击几率提高 $1%")
    .replace(/\bIncreases your chance to get a critical strike by ([\d.]+)%/gi, "使你的爆击几率提高 $1%")
    .replace(/\bIncreases damage and healing done by magical spells and effects by up to ([\d,]+)\./gi, "使法术和魔法效果造成的伤害和治疗效果最多提高 $1 点。")
    .replace(/\bIncreases healing done by spells and effects by up to ([\d,]+)\./gi, "使法术和效果的治疗量最多提高 $1 点。")
    .replace(/\bRestores ([\d,]+) mana per 5 sec\./gi, "每5秒回复 $1 点法力。")
    .replace(/\bIncreases attack power by ([\d,]+)\./gi, "攻击强度提高 $1 点。")
    .replace(/\bIncreases ranged attack power by ([\d,]+)\./gi, "远程攻击强度提高 $1 点。")
    .replace(/\bImproves spell critical strike chance by ([\d.]+)%/gi, "法术爆击几率提高 $1%")
    .replace(/\bImproves spell hit chance by ([\d.]+)%/gi, "法术命中几率提高 $1%")
    .replace(/\bItem Level\b/g, "物品等级")
    .replace(/\bAll\b/g, "全部")
    .replace(/\bRequires Level\b/g, "需要等级")
    .replace(/\bRequires\b/g, "需要")
    .replace(/\bDurability\b/g, "耐久度")
    .replace(/\bFire Resistance\b/g, "火焰抗性")
    .replace(/\bNature Resistance\b/g, "自然抗性")
    .replace(/\bFrost Resistance\b/g, "冰霜抗性")
    .replace(/\bShadow Resistance\b/g, "暗影抗性")
    .replace(/\bArcane Resistance\b/g, "奥术抗性")
    .replace(/\bResistance\b/g, "抗性")
    .replace(/\bStrength\b/g, "力量")
    .replace(/\bAgility\b/g, "敏捷")
    .replace(/\bStamina\b/g, "耐力")
    .replace(/\bIntellect\b/g, "智力")
    .replace(/\bSpirit\b/g, "精神")
    .replace(/\bRanged Attack Power\b/g, "远程攻击强度")
    .replace(/\bFeral Attack Power\b/g, "野性攻击强度")
    .replace(/\bAttack Power\b/g, "攻击强度")
    .replace(/\bSpell Damage and Healing\b/g, "法术伤害和治疗效果")
    .replace(/\bSpell Damage\b/g, "法术伤害")
    .replace(/\bHealing Spells\b/g, "治疗法术")
    .replace(/\bHealing\b/g, "治疗效果")
    .replace(/\bMana Regen\b/g, "法力回复")
    .replace(/\bMana per 5 sec\.\b/g, "每5秒回复法力")
    .replace(/\bHealth per 5 sec\.\b/g, "每5秒回复生命")
    .replace(/\bCritical Strike Rating\b/g, "爆击等级")
    .replace(/\bSpell Critical Strike\b/g, "法术爆击")
    .replace(/\bCritical Strike\b/g, "爆击")
    .replace(/\bHit Rating\b/g, "命中等级")
    .replace(/\bSpell Hit\b/g, "法术命中")
    .replace(/\bHit\b/g, "命中")
    .replace(/\bDodge\b/g, "躲闪")
    .replace(/\bParry\b/g, "招架")
    .replace(/\bDefense Rating\b/g, "防御等级")
    .replace(/\bDefense\b/g, "防御")
    .replace(/\bResilience\b/g, "韧性")
    .replace(/\bArmor Penetration\b/g, "护甲穿透")
    .replace(/\bArmor\b/g, "护甲")
    .replace(/\bBlock\b/g, "格挡")
    .replace(/\bDamage Per Second\b/g, "每秒伤害")
    .replace(/\bDamage\b/g, "伤害")
    .replace(/\bSpeed\b/g, "速度")
    .replace(/\bClasses\b/g, "职业")
    .replace(/\bClass\b/g, "职业")
    .replace(/\bRaces\b/g, "种族")
    .replace(/\bRace\b/g, "种族")
    .replace(/\bCloth\b/g, "布甲")
    .replace(/\bLeather\b/g, "皮甲")
    .replace(/\bMail\b/g, "锁甲")
    .replace(/\bPlate\b/g, "板甲")
    .replace(/\bShield\b/g, "盾牌")
    .replace(/\bHead\b/g, "头部")
    .replace(/\bNeck\b/g, "颈部")
    .replace(/\bShoulder\b/g, "肩部")
    .replace(/\bBack\b/g, "背部")
    .replace(/\bChest\b/g, "胸部")
    .replace(/\bWrist\b/g, "手腕")
    .replace(/\bHands\b/g, "手")
    .replace(/\bWaist\b/g, "腰部")
    .replace(/\bLegs\b/g, "腿部")
    .replace(/\bFeet\b/g, "脚")
    .replace(/\bFinger\b/g, "手指")
    .replace(/\bTrinket\b/g, "饰品")
    .replace(/\bMain Hand\b/g, "主手")
    .replace(/\bOff Hand\b/g, "副手")
    .replace(/\bOne-Hand\b/g, "单手")
    .replace(/\bTwo-Hand\b/g, "双手")
    .replace(/\bHeld In Off-hand\b/g, "副手物品")
    .replace(/\bFist Weapon\b/g, "拳套")
    .replace(/\bPolearm\b/g, "长柄武器")
    .replace(/\bStaff\b/g, "法杖")
    .replace(/\bDagger\b/g, "匕首")
    .replace(/\bCrossbow\b/g, "弩")
    .replace(/\bWand\b/g, "魔杖")
    .replace(/\bAxe\b/g, "斧")
    .replace(/\bSword\b/g, "剑")
    .replace(/\bMace\b/g, "锤")
    .replace(/\bBow\b/g, "弓")
    .replace(/\bGun\b/g, "枪械")
    .replace(/\bPoor\b/g, "粗糙")
    .replace(/\bCommon\b/g, "普通")
    .replace(/\bUncommon\b/g, "优秀")
    .replace(/\bRare\b/g, "精良")
    .replace(/\bEpic\b/g, "史诗")
    .replace(/\bLegendary\b/g, "传说")
    .replace(/\bArtifact\b/g, "神器");
}

function localizeItemAttributeHtml(htmlText) {
  if (state.lang !== "zhCN") return String(htmlText || "");
  return localizeItemAttributeText(htmlText);
}

function cloneMenuArray(menu) {
  return (menu || []).map((entry) => {
    if (!Array.isArray(entry)) return entry;
    return entry.map((value, index) => {
      if (index === 3 && Array.isArray(value)) return cloneMenuArray(value);
      return value;
    });
  });
}

function restoreMenuArray(target, source) {
  if (!Array.isArray(target) || !Array.isArray(source)) return;
  target.splice(0, target.length, ...cloneMenuArray(source));
}

function localizeMenuArray(menu) {
  (menu || []).forEach((entry) => {
    if (!Array.isArray(entry)) return;
    if (entry._originalLabel == null && typeof entry[1] === "string") entry._originalLabel = entry[1];
    if (entry._originalSubLabel == null && typeof entry[4] === "string") entry._originalSubLabel = entry[4];
    if (typeof entry[1] === "string") {
      const original = entry._originalLabel || entry[1];
      entry[1] = state.lang === "zhCN" ? pathLabel(original, entry[2]) : original;
    }
    if (typeof entry[4] === "string") {
      const original = entry._originalSubLabel || entry[4];
      entry[4] = state.lang === "zhCN" ? pathLabel(original, entry[2]) : original;
    }
    if (Array.isArray(entry[3])) localizeMenuArray(entry[3]);
  });
}

function syncBrowseMenus() {
  if (typeof window === "undefined" || typeof mn_path === "undefined") return;
  if (!state.originalMenus) {
    state.originalMenus = {
      mn_path: cloneMenuArray(mn_path),
      mn_database: cloneMenuArray(typeof mn_database === "undefined" ? [] : mn_database),
      mn_items: cloneMenuArray(typeof mn_items === "undefined" ? [] : mn_items),
      mn_npcs: cloneMenuArray(typeof mn_npcs === "undefined" ? [] : mn_npcs),
      mn_objects: cloneMenuArray(typeof mn_objects === "undefined" ? [] : mn_objects),
      mn_quests: cloneMenuArray(typeof mn_quests === "undefined" ? [] : mn_quests),
      mn_spells: cloneMenuArray(typeof mn_spells === "undefined" ? [] : mn_spells)
    };
  }
  restoreMenuArray(mn_path, state.originalMenus.mn_path);
  if (typeof mn_database !== "undefined") restoreMenuArray(mn_database, state.originalMenus.mn_database);
  if (typeof mn_items !== "undefined") restoreMenuArray(mn_items, state.originalMenus.mn_items);
  if (typeof mn_npcs !== "undefined") restoreMenuArray(mn_npcs, state.originalMenus.mn_npcs);
  if (typeof mn_objects !== "undefined") restoreMenuArray(mn_objects, state.originalMenus.mn_objects);
  if (typeof mn_quests !== "undefined") restoreMenuArray(mn_quests, state.originalMenus.mn_quests);
  if (typeof mn_spells !== "undefined") restoreMenuArray(mn_spells, state.originalMenus.mn_spells);
  if (state.lang === "zhCN") {
    localizeMenuArray(mn_path);
    if (typeof mn_database !== "undefined") localizeMenuArray(mn_database);
    if (typeof mn_items !== "undefined") localizeMenuArray(mn_items);
    if (typeof mn_npcs !== "undefined") localizeMenuArray(mn_npcs);
    if (typeof mn_objects !== "undefined") localizeMenuArray(mn_objects);
    if (typeof mn_quests !== "undefined") localizeMenuArray(mn_quests);
    if (typeof mn_spells !== "undefined") localizeMenuArray(mn_spells);
  }
}

function rerenderBrowseHeader() {
  syncBrowseMenus();
  if (typeof window === "undefined") return;
  const tabsHost = document.getElementById("toptabs-right-generic");
  const buttonsHost = document.getElementById("menu-buttons-generic");
  if (tabsHost) tabsHost.innerHTML = "";
  if (buttonsHost) buttonsHost.innerHTML = "";
  if (window.Menu && typeof window.Menu._hide === "function") window.Menu._hide();
  if (typeof window.g_initHeader === "function") window.g_initHeader(0);
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function localizeNumericPhrase(value) {
  return String(value || "")
    .trim()
    .replace(/\s+to\s+/i, "到")
    .replace(/\s*(seconds?|sec)\b/gi, "秒")
    .replace(/\s*(minutes?|mins?|min)\b/gi, "分钟")
    .replace(/\s*(hours?|hrs?|hr)\b/gi, "小时")
    .replace(/\s+/g, "");
}

function extractValuePhrases(text) {
  const source = String(text || "");
  const re = /\d[\d,]*(?:\.\d+)?\s+to\s+\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s*(?:seconds?|sec|minutes?|mins?|min|hours?|hrs?|hr)\b|\d[\d,]*(?:\.\d+)?%/gi;
  return Array.from(source.matchAll(re), (match) => localizeNumericPhrase(match[0]));
}

function extractPlainNumberPhrases(text) {
  const source = String(text || "");
  const re = /\d[\d,]*(?:\.\d+)?\s+to\s+\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?%|\d[\d,]*(?:\.\d+)?(?!\s*(?:seconds?|sec|minutes?|mins?|min|hours?|hrs?|hr)\b)/gi;
  return Array.from(source.matchAll(re), (match) => localizeNumericPhrase(match[0]));
}

function textContainsNumericValue(text, value) {
  const needle = String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!needle) return false;
  return new RegExp(`(^|[^\\d.])${needle}($|[^\\d.])`).test(String(text || ""));
}

function resolveSpellPlaceholders(text, sourceText) {
  const raw = String(text || "");
  if (!raw || !raw.includes("$")) return raw;
  const source = String(sourceText || "");
  if (!source) return raw.replace(/\$[A-Za-z]/g, "");

  const durationValues = [];
  const durationRe = /\b(?:for|up to|over|lasts?|last)\s+(\d[\d,]*(?:\.\d+)?\s*(?:seconds?|sec|minutes?|mins?|min|hours?|hrs?|hr)\b)/gi;
  let durationMatch = durationRe.exec(source);
  while (durationMatch) {
    durationValues.push(localizeNumericPhrase(durationMatch[1]));
    durationMatch = durationRe.exec(source);
  }

  const tickValues = [];
  const tickRe = /\bevery\s+(\d[\d,]*(?:\.\d+)?\s*(?:seconds?|sec|minutes?|mins?|min|hours?|hrs?|hr)\b)/gi;
  let tickMatch = tickRe.exec(source);
  while (tickMatch) {
    tickValues.push(localizeNumericPhrase(tickMatch[1]));
    tickMatch = tickRe.exec(source);
  }

  const overValues = [];
  const overRe = /(\d[\d,]*(?:\.\d+)?(?:\s+to\s+\d[\d,]*(?:\.\d+)?)?)\s+[A-Za-z ]{0,28}?\bover\s+\d/gi;
  let overMatch = overRe.exec(source);
  while (overMatch) {
    overValues.push(localizeNumericPhrase(overMatch[1]));
    overMatch = overRe.exec(source);
  }

  const visibleRaw = raw.replace(/\$\/?\d*(?:;?[a-z]\d*|[a-z]\d*)[%％]?/gi, "");
  const plainValues = extractPlainNumberPhrases(source);
  const statValues = plainValues.filter((value) => (
    !durationValues.includes(value) &&
    !tickValues.includes(value) &&
    !textContainsNumericValue(visibleRaw, value)
  ));
  const counters = { d: 0, t: 0, o: 0, s: 0, any: 0 };
  return raw.replace(/\$\/?\d*(?:;?[a-z]\d*|[a-z]\d*)[%％]?/gi, (token) => {
    const kindMatch = /([a-z])\d*[%％]?$/i.exec(token);
    const kind = kindMatch ? kindMatch[1].toLowerCase() : "";
    let replacement = "";
    if (kind === "d") replacement = durationValues[counters.d++] || extractValuePhrases(source)[counters.any++];
    else if (kind === "t") replacement = tickValues[counters.t++] || durationValues[counters.d++] || extractValuePhrases(source)[counters.any++];
    else if (kind === "o") replacement = overValues[counters.o++] || statValues[counters.s++] || plainValues[counters.any++];
    else if (kind === "s") replacement = statValues[counters.s++] || plainValues[counters.any++];
    else replacement = plainValues[counters.any++];
    return replacement || "";
  });
}

function localizedTextHtml(text) {
  return escapeHtml(text)
    .replace(/\$[bB]/g, "<br><br>")
    .replace(/\$[nN]/g, state.lang === "zhCN" ? "你" : "you")
    .replace(/\$[cC]/g, state.lang === "zhCN" ? "勇士" : "hero")
    .replace(/\$g([^:;]*):([^;]*);/g, "$1")
    .replace(/\$[rR]/g, state.lang === "zhCN" ? "冒险者" : "adventurer");
}

function escapeJsSingle(value) {
  return String(value == null ? "" : value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\x3c");
}

function normalizeIconName(iconName) {
  const value = String(iconName || "").trim();
  return value && value.toLowerCase() !== "temp" ? value : "INV_Misc_QuestionMark";
}

function localItemTooltipHtml(item) {
  const quality = Number(item.quality_class ?? item.quality ?? 1);
  const name = escapeHtml(item.name || `${item.id}`);
  const slotText = localizeItemAttributeText(String(item.tooltip_slot_text || item.slot_text || item.slot || "").trim());
  const typeText = localizeItemAttributeText(String(item.tooltip_type_text || item.type_text || item.armor_type || "").trim());
  const damageText = localizeItemAttributeText(String(item.tooltip_damage_text || item.damage_text || "").trim());
  const speedText = localizeItemAttributeText(String(item.tooltip_speed_text || item.speed_text || "").trim());
  const dpsText = localizeItemAttributeText(String(item.tooltip_dps_text || item.dps_text || "").trim());
  const durabilityText = localizeItemAttributeText(String(item.tooltip_durability_text || item.durability_text || "").trim());
  const preHtml = localizeItemAttributeHtml(normalizeTooltipPreHtml(item.tooltip_pre_html || item.pre_html));
  const bonusHtml = localizeItemAttributeHtml(String(item.tooltip_bonus_html || item.bonus_html || "").trim());
  const effectHtml = localizeItemAttributeHtml(String(item.tooltip_effect_html || item.effect_html || "").trim());
  const itemLevel = item.level || item.item_level ? `<br><span class="q0">${escapeHtml(uiLabel("Item Level"))} ${escapeHtml(String(item.level || item.item_level))}</span>` : "";
  const requiredLevel = item.required_level || item.reqlevel ? `${escapeHtml(state.lang === "zhCN" ? uiLabel("Required Level") : "Requires Level")} ${escapeHtml(String(item.required_level || item.reqlevel))}<br>` : "";
  return `<table><tr><td><table><tr><td>
    <b class="q${quality}">${name}</b>${itemLevel}<br>
    ${preHtml}
    ${slotText || typeText ? `<table width="100%"><tr><td>${escapeHtml(slotText)}</td><th>${escapeHtml(typeText)}</th></tr></table>` : ""}
    ${damageText || speedText ? `<table width="100%"><tr><td>${escapeHtml(damageText)}</td><th>${escapeHtml(speedText)}</th></tr></table>` : ""}
    ${dpsText ? `(${escapeHtml(dpsText)})<br>` : ""}
    ${durabilityText ? `${escapeHtml(state.lang === "zhCN" ? "耐久度" : "Durability")} ${escapeHtml(durabilityText)}<br>` : ""}
    ${bonusHtml}
    ${!bonusHtml && requiredLevel ? requiredLevel : ""}
    ${effectHtml}
  </td></tr></table></td></tr></table>`;
}

function normalizeTooltipPreHtml(htmlText) {
  return String(htmlText || "")
    .trim()
    .replace(/(Binds when (?:picked up|equipped|used))(\d+\s+Armor)/i, "$1<br />$2")
    .replace(/(Binds when (?:picked up|equipped|used))(Requires Level)/i, "$1<br />$2");
}

function extractSpellIdsFromHtml(htmlText) {
  const ids = [];
  const re = /\?spell=(\d+)/g;
  let match = re.exec(String(htmlText || ""));
  while (match) {
    const id = Number(match[1]);
    if (Number.isInteger(id) && id > 0) ids.push(id);
    match = re.exec(String(htmlText || ""));
  }
  return ids;
}

function spellDescriptionForLocale(spell) {
  const original = String(spell.original_description || spell.en_description || "").trim();
  if (state.lang !== "zhCN") {
    return original || String(spell.description || spell.tooltip_description_text || "").trim();
  }
  return String(spell.tooltip_description_text || spell.description || original).trim();
}

function localSpellTooltipHtml(spell) {
  const name = escapeHtml(spell.name || `${spell.id}`);
  const rankText = String(spell.rank_text || spell.tooltip_rank_text || "").trim();
  const rangeText = String(spell.range_short_text || spell.tooltip_range_short_text || spell.range_text || "").trim();
  const castText = String(spell.cast_text || spell.tooltip_cast_text || spell.cast_time_text || "").trim();
  const costText = String(spell.cost_text || "").trim();
  const description = resolveSpellPlaceholders(
    spellDescriptionForLocale(spell),
    spell.original_description || spell.en_description || ""
  );
  return `<table><tr><td><table><tr><td>
    <table width="100%"><tr><td><b>${name}</b><br /></td><th>${rankText ? `<b class="q0">${escapeHtml(rankText)}</b>` : ""}</th></tr></table>
    ${costText || rangeText ? `<table width="100%"><tr><td>${escapeHtml(costText)}<br /></td><th>${escapeHtml(rangeText)}<br /></th></tr></table>` : ""}
    ${escapeHtml(castText)}
  </td></tr></table>${description ? `<table><tr><td><span class="q">${escapeHtml(description)}</span></td></tr></table>` : ""}</td></tr></table>`;
}

function registerLocalSpellTooltip(spell) {
  const id = Number(spell && spell.id);
  if (!Number.isInteger(id) || id <= 0 || !window.g_spells) return;
  const existing = window.g_spells[id] || {};
  const merged = {
    ...existing,
    name: spell.name || existing.name || `${id}`,
    icon: normalizeIconName(spell.icon_name || existing.icon),
    tooltip: localSpellTooltipHtml({ ...spell, id }),
    status: {
      ...(existing.status || {}),
      [String((window.g_locale && window.g_locale.id) || 0)]: 4
    }
  };
  window.g_spells[id] = merged;
}

function localizeItemEffectHtml(htmlText, spellMap, locale) {
  const raw = String(htmlText || "");
  if (!raw) return "";
  const div = document.createElement("div");
  div.innerHTML = raw;
  if (locale === "zhCN") {
    div.querySelectorAll("span").forEach((span) => {
      span.childNodes.forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE) return;
        node.nodeValue = node.nodeValue
          .replace(/\bEquip:\s*/g, "装备：")
          .replace(/\bUse:\s*/g, "使用：");
      });
    });
  }
  div.querySelectorAll("a[href*='?spell=']").forEach((link) => {
    const match = /\?spell=(\d+)/.exec(link.getAttribute("href") || "");
    const spell = match ? spellMap.get(Number(match[1])) : null;
    if (spell && locale === "zhCN") {
      let text = resolveSpellPlaceholders(
        spell.tooltip_description_text || spell.description || spell.name || link.textContent,
        spell.original_description || spell.en_description || link.textContent
      );
      const damageRange = /causing\s+([\d,]+)\s+to\s+([\d,]+)\s+damage/i.exec(link.textContent || "");
      if (damageRange) {
        text = text.replace(/\$[A-Za-z0-9]+/g, `${damageRange[1]}到${damageRange[2]}`);
      }
      link.textContent = text;
    }
  });
  return div.innerHTML;
}

async function hydrateItemEffectSpells(rows, locale, keys = ["effect_html", "tooltip_effect_html"]) {
  const ids = Array.from(new Set((rows || []).flatMap((row) => keys.flatMap((key) => extractSpellIdsFromHtml(row[key])))));
  if (!ids.length) return rows;
  const spells = await execRows(`
    SELECT s.spell_id AS id,
    CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END AS name,
    s.icon_name, s.cost_text, s.range_text, s.cast_time_text,
    s.description AS original_description,
    CASE WHEN :locale='zhCN' THEN COALESCE(l.description, st.description_text, s.description) ELSE s.description END AS description,
    st.rank_text AS tooltip_rank_text, st.range_short_text AS tooltip_range_short_text,
    st.cast_text AS tooltip_cast_text,
    CASE WHEN :locale='zhCN' THEN COALESCE(l.description, st.description_text, s.description) ELSE s.description END AS tooltip_description_text
    FROM spells s
    LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
    LEFT JOIN spell_tooltips st ON st.spell_id=s.spell_id
    WHERE s.spell_id IN (${ids.join(",")});
  `, { ":locale": locale });
  const spellMap = new Map(spells.map((spell) => [Number(spell.id), spell]));
  spells.forEach(registerLocalSpellTooltip);
  if (locale === "zhCN") {
    for (const row of rows || []) {
      for (const key of keys) {
        if (row[key]) row[key] = localizeItemEffectHtml(row[key], spellMap, locale);
      }
    }
  }
  return rows;
}

function registerLocalItemTooltip(item) {
  const id = Number(item && item.id);
  if (!Number.isInteger(id) || id <= 0 || !window.g_items) return;
  const existing = window.g_items[id] || {};
  const merged = {
    ...existing,
    name: item.name || existing.name || `${id}`,
    quality: Number(item.quality_class ?? item.quality ?? existing.quality ?? 1),
    icon: normalizeIconName(item.icon_name || existing.icon)
  };
  const hasDetailedTooltip = [
    item.pre_html, item.bonus_html, item.effect_html,
    item.tooltip_pre_html, item.tooltip_bonus_html, item.tooltip_effect_html
  ].some((value) => String(value || "").trim());
  merged.tooltip = hasDetailedTooltip ? localItemTooltipHtml({ ...item, ...merged, id }) : (existing.tooltip || localItemTooltipHtml({ ...item, ...merged, id }));
  merged.status = {
    ...(existing.status || {}),
    [String((window.g_locale && window.g_locale.id) || 0)]: 4
  };
  window.g_items[id] = merged;
}

function setStatus(message, isError = false) {
  const text = message === t("statusReady") ? "" : (message || "");
  el.status.textContent = text;
  el.status.classList.toggle("error", isError);
}

function updateLangButtons() {
  el.langEn.classList.toggle("active", state.lang === "enUS");
  el.langZh.classList.toggle("active", state.lang === "zhCN");
  if (el.input) el.input.placeholder = t("searchPlaceholder");
  if (el.searchButton) el.searchButton.textContent = t("searchButton");
  rerenderBrowseHeader();
}

async function ensureDb() {
  if (state.dbWorker) return state.dbWorker;
  const cfg = window.TURTLE_DB_CONFIG || {};
  if (!cfg.databaseUrl || cfg.databaseUrl.includes("pub-your-r2-domain")) {
    throw new Error("Please set databaseUrl in db-config.js");
  }

  setStatus(t("statusLoading"));
  state.dbWorker = await createDbWorker(
    [{
      from: "inline",
      config: {
        serverMode: "full",
        requestChunkSize: cfg.requestChunkSize || 4096,
        url: cfg.databaseUrl
      }
    }],
    "./sqlite.worker.js",
    "./sql-wasm.wasm"
  );
  setStatus(t("statusReady"));
  return state.dbWorker;
}

async function execRows(sql, params = {}) {
  const worker = await ensureDb();
  const out = await worker.db.exec(sql, params);
  if (!out || !out.length) return [];
  const cols = out[0].columns;
  return out[0].values.map((row) => {
    const obj = {};
    for (let i = 0; i < cols.length; i += 1) obj[cols[i]] = row[i];
    return obj;
  });
}

async function querySuggestions(queryText) {
  const like = `%${queryText}%`;
  const localized = state.lang === "zhCN";
  const locale = localized ? "zhCN" : "__none__";
  if (!localized) {
    return execRows(`
      SELECT * FROM (
        SELECT 'item' AS type, i.item_id AS id, i.name AS name
        FROM items i
        WHERE i.name LIKE :like COLLATE NOCASE AND i.name <> '_'
        UNION ALL
        SELECT 'itemset', s.itemset_id, s.name
        FROM itemsets s
        WHERE s.name LIKE :like COLLATE NOCASE
        UNION ALL
        SELECT 'npc', n.npc_id, n.name
        FROM npcs n
        WHERE n.name LIKE :like COLLATE NOCASE
        UNION ALL
        SELECT 'object', o.object_id, o.name
        FROM objects o
        WHERE o.name LIKE :like COLLATE NOCASE
        UNION ALL
        SELECT 'quest', q.quest_id, q.name
        FROM quests q
        WHERE q.name LIKE :like COLLATE NOCASE
        UNION ALL
        SELECT 'spell', s.spell_id, s.name
        FROM spells s
        WHERE s.name LIKE :like COLLATE NOCASE
        UNION ALL
        SELECT 'faction', f.faction_id, f.name
        FROM factions f
        WHERE f.name LIKE :like COLLATE NOCASE
      ) t
      ORDER BY name
      LIMIT 15;
    `, { ":like": like });
  }
  return execRows(`
    SELECT * FROM (
      SELECT 'item' AS type, i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name
      FROM items i
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE i.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
      UNION ALL
      SELECT 'itemset', s.itemset_id,
      s.name
      FROM itemsets s
      WHERE s.name LIKE :like COLLATE NOCASE
      UNION ALL
      SELECT 'npc', n.npc_id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END
      FROM npcs n
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE n.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
      UNION ALL
      SELECT 'object', o.object_id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END
      FROM objects o
      LEFT JOIN entity_localizations l ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      WHERE o.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
      UNION ALL
      SELECT 'quest', q.quest_id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END
      FROM quests q
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE q.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
      UNION ALL
      SELECT 'spell', s.spell_id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END
      FROM spells s
      LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
      WHERE s.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
      UNION ALL
      SELECT 'faction', f.faction_id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, f.name) ELSE f.name END
      FROM factions f
      LEFT JOIN entity_localizations l ON l.entity_type='faction' AND l.entity_id=f.faction_id AND l.locale='zhCN'
      WHERE f.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE)
    ) t
    ORDER BY name
    LIMIT 15;
  `, { ":like": like, ":locale": locale });
}

function renderSuggestions(rows) {
  if (!rows.length) {
    el.results.innerHTML = "";
    return;
  }
  const rect = el.input.getBoundingClientRect();
  el.results.style.left = `${Math.round(window.scrollX + rect.left)}px`;
  el.results.style.top = `${Math.round(window.scrollY + rect.bottom)}px`;
  el.results.innerHTML = rows.map((row) => (
    `<a class="result-row" href="?${encodeURIComponent(row.type)}=${encodeURIComponent(String(row.id))}">
      <span class="result-name">${escapeHtml(row.name)}</span>
      <span class="result-type">${escapeHtml(t(`type_${row.type}`))}</span>
    </a>`
  )).join("");
}

function searchItemTypeText(row) {
  const slot = String(row.slot || "").trim();
  const armorType = String(row.armor_type || "").trim();
  if (slot && armorType) {
    if (slot.toLowerCase().includes("two")) return `Two-Handed ${armorType}`;
    if (slot.toLowerCase().includes("main")) return `One-Handed ${armorType}`;
    return armorType;
  }
  if (armorType) return armorType;
  if (slot) return slot;
  if (row.path_json) {
    try {
      const links = resolveMenuPath(JSON.parse(row.path_json));
      const last = links[links.length - 1];
      if (last && last.label) {
        return {
          "Ammo Pouches": "Ammo Pouch",
          Bags: "Bag",
          Books: "Book",
          Consumables: "Consumable",
          "Quest Items": "Quest",
          "Junk Items": "Junk"
        }[last.label] || last.label;
      }
    } catch (_) {
      // Fall through to the generic empty type.
    }
  }
  return "";
}

function listviewItemName(name, quality) {
  const raw = String(name || "");
  if (/^[0-6](?=[^\d\s])/.test(raw)) return raw;
  const q = Number(quality);
  const prefix = Number.isFinite(q) ? (6 - q) : 5;
  return `${prefix}${raw}`;
}

function listviewSpellName(name) {
  const raw = String(name || "");
  if (!raw || raw.startsWith("@") || /^[0-6](?=[^\d\s])/.test(raw)) return raw;
  return `@${raw}`;
}

function mapItemRowsForListview(rows) {
  return (rows || []).map((x) => ({
    ...x,
    id: String(x.id),
    name: listviewItemName(x.name, x.quality_class ?? x.quality),
    quality: Number(x.quality_class ?? x.quality ?? 1)
  }));
}

function textFromHtml(htmlText) {
  const div = document.createElement("div");
  div.innerHTML = String(htmlText || "");
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

function searchItemDescription(row) {
  const html = String(row.effect_html || "");
  const quoted = /<span class="q">([\s\S]*?)<\/span>/i.exec(html);
  if (quoted) return textFromHtml(quoted[1]).replace(/^"|"$/g, "");
  return "";
}

function itemClassInfoFromPath(pathJson) {
  try {
    const path = JSON.parse(String(pathJson || "[]"));
    return {
      classs: Number(path[2] || 0),
      subclass: Number(path[3] || 0),
      subsubclass: path[4] == null ? undefined : Number(path[4])
    };
  } catch (_) {
    return { classs: 0, subclass: 0, subsubclass: undefined };
  }
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === "") return undefined;
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : undefined;
  } catch (_) {
    return undefined;
  }
}

function parseBrowsePathParam(value, maxParts = 3) {
  const raw = String(value || "").trim();
  if (!raw) return [];
  if (!/^-?\d+(?:\.-?\d+)*$/.test(raw)) return [];
  return raw.split(".").slice(0, maxParts).map((x) => Number(x));
}

function itemPathMatches(pathJson, parts, row = {}) {
  if (!parts.length) return true;
  const info = itemClassInfoFromPath(pathJson);
  if (parts[0] != null && info.classs !== parts[0]) return false;
  if (parts[1] != null && info.subclass !== parts[1]) return false;
  if (parts[2] != null) {
    if (info.subsubclass != null) return info.subsubclass === parts[2];
    if (info.classs === 4) return itemSlotValue(row.slot_text || row.slot) === parts[2];
    return false;
  }
  return true;
}

function entityPathMatches(pathJson, parts, startIndex = 2) {
  if (!parts.length) return true;
  try {
    const path = JSON.parse(String(pathJson || "[]"));
    return parts.every((part, index) => Number(path[startIndex + index]) === part);
  } catch (_) {
    return false;
  }
}

function browseBreadcrumb(pathIds, fallbackName, fallbackHref) {
  const links = resolveMenuPath(pathIds);
  return renderBreadcrumbFromLinks(links) || `<div class="path"><a href=".">${escapeHtml(pathLabel("Database"))}</a> &raquo; <a href="${escapeHtml(fallbackHref)}">${escapeHtml(pathLabel(fallbackName, fallbackHref))}</a></div>`;
}

function firstPathPart(pathJson, index = 2, fallback = 0) {
  try {
    const path = JSON.parse(String(pathJson || "[]"));
    const value = Number(path[index]);
    return Number.isFinite(value) ? value : fallback;
  } catch (_) {
    return fallback;
  }
}

function itemSlotValue(slotText) {
  const raw = String(slotText || "").trim();
  if (!raw) return 0;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  const slots = window.g_item_slots || {};
  const lower = raw.toLowerCase();
  for (const [slotId, label] of Object.entries(slots)) {
    if (String(label || "").toLowerCase() === lower) return Number(slotId);
  }
  return 0;
}

function itemSlotLabel(slotId) {
  const slots = window.g_item_slots || {};
  return String(slots[Number(slotId)] || "").trim();
}

function pathJsonLiteral(parts) {
  return `[${parts.join(", ")}]`;
}

function itemArmorValue(preHtml) {
  const match = /(\d+)\s+Armor/i.exec(textFromHtml(preHtml || ""));
  return match ? Number(match[1]) : 0;
}

function npcClassificationValue(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("rare") && text.includes("elite")) return 2;
  if (text.includes("boss")) return 3;
  if (text.includes("elite")) return 1;
  if (text.includes("rare")) return 4;
  return 0;
}

function factionSideValue(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("alliance")) return 1;
  if (text.includes("horde")) return 2;
  return 0;
}

function questSideValue(side) {
  const text = String(side || "").toLowerCase();
  if (text === "3" || text.includes("both")) return "3";
  if (text === "2" || text.includes("orc") || text.includes("tauren") || text.includes("troll") || text.includes("undead")) return "2";
  if (text === "1" || text.includes("human") || text.includes("dwarf") || text.includes("gnome") || text.includes("night elf") || text.includes("highelf")) return "1";
  return String(side || "0");
}

function questCategoryFromPath(pathJson, fallbackCategory) {
  try {
    const path = JSON.parse(pathJson || "[]");
    if (Array.isArray(path) && path.length >= 4) {
      return { category2: Number(path[2] || 0), category: Number(path[3] || fallbackCategory || 0) };
    }
  } catch (_) {
    // Fall back to the stored category below.
  }
  return { category2: 0, category: Number(fallbackCategory || 0) };
}

async function searchListviewConfigs(queryText) {
  const like = `%${queryText}%`;
  const localized = state.lang === "zhCN";
  const locale = localized ? "zhCN" : "__none__";
  const itemNameSelect = localized ? "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END" : "i.name";
  const npcNameSelect = localized ? "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END" : "n.name";
  const objectNameSelect = localized ? "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END" : "o.name";
  const questNameSelect = localized ? "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END" : "q.name";
  const spellNameSelect = localized ? "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END" : "s.name";
  const itemLocJoin = localized ? "LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'" : "";
  const npcLocJoin = localized ? "LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'" : "";
  const objectLocJoin = localized ? "LEFT JOIN entity_localizations l ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'" : "";
  const questLocJoin = localized ? "LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'" : "";
  const spellLocJoin = localized ? "LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'" : "";
  const itemWhere = localized ? "(i.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE))" : "i.name LIKE :like COLLATE NOCASE";
  const npcWhere = localized ? "(n.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE))" : "n.name LIKE :like COLLATE NOCASE";
  const objectWhere = localized ? "(o.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE))" : "o.name LIKE :like COLLATE NOCASE";
  const questWhere = localized ? "(q.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE))" : "q.name LIKE :like COLLATE NOCASE";
  const spellWhere = localized ? "(s.name LIKE :like COLLATE NOCASE OR (l.name IS NOT NULL AND l.name LIKE :like COLLATE NOCASE))" : "s.name LIKE :like COLLATE NOCASE";
  const [items, npcs, objects, quests, spells] = await Promise.all([
    execRows(`
      SELECT i.item_id AS id,
      ${itemNameSelect} AS name,
      i.item_level AS level, i.required_level AS reqlevel, i.slot, i.armor_type, i.icon_name,
      ep.path_json, its.effect_html,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality_class
      FROM items i
      ${itemLocJoin}
      LEFT JOIN entity_paths ep ON ep.entity_type='item' AND ep.entity_id=i.item_id
      LEFT JOIN item_tooltip_stats its ON its.item_id=i.item_id
      WHERE ${itemWhere}
      AND i.name <> '_'
      ORDER BY quality_class DESC, name COLLATE NOCASE
      LIMIT 1000;
    `, { ":like": like, ":locale": locale }),
    execRows(`
      SELECT n.npc_id AS id,
      ${npcNameSelect} AS name,
      n.level_min AS minlevel, n.level_max AS maxlevel, n.npc_class AS classification
      FROM npcs n
      ${npcLocJoin}
      WHERE ${npcWhere}
      ORDER BY name COLLATE NOCASE
      LIMIT 1000;
    `, { ":like": like, ":locale": locale }),
    execRows(`
      SELECT o.object_id AS id,
      ${objectNameSelect} AS name,
      o.type_text AS type
      FROM objects o
      ${objectLocJoin}
      WHERE ${objectWhere}
      ORDER BY name COLLATE NOCASE
      LIMIT 1000;
    `, { ":like": like, ":locale": locale }),
    execRows(`
      SELECT q.quest_id AS id,
      ${questNameSelect} AS name,
      q.quest_level, q.required_level, q.side, q.zone_or_sort AS category,
      q.rew_xp AS xp, q.rew_money_max_level AS money, ep.path_json
      FROM quests q
      ${questLocJoin}
      LEFT JOIN entity_paths ep ON ep.entity_type='quest' AND ep.entity_id=q.quest_id
      WHERE ${questWhere}
      ORDER BY name COLLATE NOCASE
      LIMIT 1000;
    `, { ":like": like, ":locale": locale }),
    execRows(`
      SELECT s.spell_id AS id,
      ${spellNameSelect} AS name,
      s.level, s.school, s.icon_name, st.rank_text AS rank
      FROM spells s
      ${spellLocJoin}
      LEFT JOIN spell_tooltips st ON st.spell_id=s.spell_id
      WHERE ${spellWhere}
      ORDER BY name COLLATE NOCASE
      LIMIT 1000;
    `, { ":like": like, ":locale": locale })
  ]);

  await primeGlobalItems(items.map((x) => x.id), locale);
  await primeGlobalSpells(spells.map((x) => x.id), locale);
  const questRewardMap = new Map();
  if (quests.length) {
    const questIds = quests.map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0);
    const rewardRows = questIds.length
      ? await execRows(`
        SELECT qr.quest_id, qr.item_id, COALESCE(qr.item_count, 1) AS item_count
        FROM quest_reward_choice_items qr
        WHERE qr.quest_id IN (${questIds.join(",")})
        ORDER BY qr.quest_id, qr.sort_order;
      `)
      : [];
    await primeGlobalItems(rewardRows.map((x) => x.item_id), locale);
    for (const reward of rewardRows) {
      const questId = Number(reward.quest_id);
      const list = questRewardMap.get(questId) || [];
      list.push([Number(reward.item_id), Number(reward.item_count || 1)]);
      questRewardMap.set(questId, list);
    }
  }
  const spellReagentMap = new Map();
  if (spells.length) {
    const spellIds = spells.map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0);
    const reagentRows = spellIds.length
      ? await execRows(`
        SELECT sr.spell_id, sr.item_id, sr.item_count
        FROM spell_reagents sr
        WHERE sr.spell_id IN (${spellIds.join(",")})
        ORDER BY sr.spell_id, sr.sort_order;
      `)
      : [];
    await primeGlobalItems(reagentRows.map((x) => x.item_id), locale);
    for (const reagent of reagentRows) {
      const spellId = Number(reagent.spell_id);
      const list = spellReagentMap.get(spellId) || [];
      list.push([Number(reagent.item_id), Number(reagent.item_count || 1)]);
      spellReagentMap.set(spellId, list);
    }
  }

  const configs = [];
  if (items.length) {
    configs.push({
      template: "item",
      id: "items",
      name: t("type_item"),
      data: items.map((x) => ({
        type_text: localizeItemAttributeText(searchItemTypeText(x)),
        id: String(x.id),
        name: listviewItemName(x.name, x.quality_class),
        level: x.level,
        reqlevel: x.reqlevel || (searchItemTypeText(x) === "Book" ? x.level : ""),
        quality: x.quality_class,
        description: searchItemDescription(x),
        slot: x.slot,
      })),
      hiddenCols: ["source", "type", "quality"],
      extraCols: (typeof Listview !== "undefined" && Listview.funcBox)
        ? [{ id: "quality", name: uiLabel("Quality"), hidden: true, value: "quality" }, Listview.funcBox.createSimpleCol("type_text", uiLabel("Type"), "12%", "type_text"), { id: "description", name: t("description"), width: "30%", value: "description" }]
        : undefined,
      sort: ["-quality", "name"]
    });
  }
  if (npcs.length) {
    configs.push({
      template: "npc",
      id: "npcs",
      name: t("type_npc"),
      data: npcs.map((x) => ({
        id: String(x.id),
        name: x.name,
        minlevel: x.minlevel,
        maxlevel: x.maxlevel,
        classification: x.classification
      })),
      sort: ["name"]
    });
  }
  if (objects.length) {
    configs.push({
      template: "object",
      id: "objects",
      name: t("type_object"),
      data: objects.map((x) => ({ id: String(x.id), name: x.name, type: x.type })),
      sort: ["name"]
    });
  }
  if (quests.length) {
    configs.push({
      template: "quest",
      id: "quests",
      name: t("type_quest"),
      data: quests.map((x) => {
        const category = questCategoryFromPath(x.path_json, x.category);
        return {
          id: String(x.id),
          name: x.name || `quest:${x.id}`,
          level: String(x.quest_level ?? x.level ?? ""),
          reqlevel: Number(x.required_level ?? x.reqlevel ?? 0),
          side: questSideValue(x.side),
          itemchoices: questRewardMap.get(Number(x.id)),
          xp: Number(x.xp || 0),
          money: Number(x.money || 0),
          category: category.category,
          category2: category.category2,
          type: Number(x.type ?? 0)
        };
      }),
      sort: ["name"]
    });
  }
  if (spells.length) {
    configs.push({
      template: "spell",
      id: "uncategorized-spells",
      name: t("uncategorizedSpells"),
      data: spells.map((x) => ({ id: String(x.id), name: listviewSpellName(x.name), level: x.level, school: x.school, rank: x.rank || "", reagents: spellReagentMap.get(Number(x.id)) })),
      visibleCols: ["level"],
      hiddenCols: ["skill", "school"],
      sort: ["name"]
    });
  }
  return configs;
}

async function renderSearchResultsPage(queryText) {
  setStatus(t("statusSearching"));
  const configs = await searchListviewConfigs(queryText);
  if (el.precontents) el.precontents.innerHTML = "";
  el.results.innerHTML = "";
  el.detail.innerHTML = `
    <div class="text detail-page">
      <a href="https://www.wowhead.com/search?q=${encodeURIComponent(queryText)}" target="_blank" class="button-red"><div><blockquote><i>Wowhead</i></blockquote><span>Wowhead</span></div></a>
      <h1>${escapeHtml(t("searchResults"))}</h1>
    </div>
  `;
  renderRelatedListviews(configs);
  setStatus(t("statusReady"));
}

function renderRelatedQuests(rows) {
  if (!rows.length) return "";
  const links = rows.map((row) => {
    const tags = [];
    if (Number(row.is_start) === 1) tags.push(t("starts"));
    if (Number(row.is_end) === 1) tags.push(t("ends"));
    const tagText = tags.join(" / ");
    return `<div class="meta"><a href="?quest=${encodeURIComponent(String(row.id))}">${escapeHtml(row.name)}</a>${tagText ? ` - ${escapeHtml(tagText)}` : ""}</div>`;
  }).join("");
  return `<div class="block-title">${escapeHtml(t("relatedQuests"))}</div>${links}`;
}

function homeBrowseLink(href, label, description = "") {
  return `<a class="home-browse-link" href="${escapeHtml(href)}"><b>${escapeHtml(label)}</b>${description ? `<span>${escapeHtml(description)}</span>` : ""}</a>`;
}

function homeBrowseButton(group, label, description = "") {
  return `<button type="button" class="home-browse-link home-browse-main" data-home-browse-group="${escapeHtml(group)}"><b>${escapeHtml(label)}</b>${description ? `<span>${escapeHtml(description)}</span>` : ""}</button>`;
}

function homeBrowseGroupFromHref(href) {
  const match = /^\?([a-z]+)/i.exec(String(href || ""));
  return match ? match[1] : "";
}

function homeBrowseMenuTree(entries, depth = 0) {
  const rows = (entries || [])
    .filter((entry) => Array.isArray(entry) && entry[0] != null)
    .map((entry) => {
      const label = pathLabel(entry[1] || "", entry[2] || "");
      const href = entry[2] || "javascript:;";
      const childHtml = Array.isArray(entry[3]) && entry[3].length
        ? homeBrowseMenuTree(entry[3], depth + 1)
        : "";
      return `
        <li class="home-browse-node depth-${depth}">
          <a href="${escapeHtml(href)}">${escapeHtml(label)}</a>
          ${childHtml}
        </li>
      `;
    }).join("");
  return rows ? `<ul class="home-browse-tree depth-${depth}">${rows}</ul>` : "";
}

function homeBrowsePanel(group, topEntry) {
  const directHref = topEntry[2] || `?${group}`;
  const allLink = homeBrowseLink(directHref, t("allEntries"));
  const tree = homeBrowseMenuTree(topEntry[3] || [], 0);
  return `<div class="home-browse-panel" data-home-browse-panel="${escapeHtml(group)}">${allLink}${tree}</div>`;
}

function renderHomeBrowse() {
  syncBrowseMenus();
  const topEntries = (typeof mn_database !== "undefined" ? mn_database : [])
    .filter((entry) => Array.isArray(entry) && entry[0] != null && entry[2]);
  const descriptions = {
    items: state.lang === "zhCN" ? "装备、材料、配方" : "Equipment, materials, recipes",
    itemsets: state.lang === "zhCN" ? "套装与套装奖励" : "Sets and bonuses",
    npcs: state.lang === "zhCN" ? "生物、首领、商人" : "Creatures, bosses, vendors",
    objects: state.lang === "zhCN" ? "箱子、矿点、草药" : "Chests, veins, herbs",
    quests: state.lang === "zhCN" ? "任务与奖励" : "Quests and rewards",
    spells: state.lang === "zhCN" ? "技能、专业、法术" : "Skills, professions, spells",
    factions: state.lang === "zhCN" ? "声望阵营" : "Reputation factions"
  };
  el.detail.innerHTML = `
    <div class="home-browse">
      <h2>${escapeHtml(t("browseDatabase"))}</h2>
      <p>${escapeHtml(t("browseHint"))}</p>
      <div class="home-browse-grid">
        ${topEntries.map((entry) => {
          const group = homeBrowseGroupFromHref(entry[2]);
          return homeBrowseButton(group, pathLabel(entry[1], entry[2]), descriptions[group] || "");
        }).join("")}
      </div>
      <div class="home-browse-subcategories">
        ${topEntries.map((entry) => homeBrowsePanel(homeBrowseGroupFromHref(entry[2]), entry)).join("")}
      </div>
    </div>
  `;
}

function resetRelatedListviews() {
  el.tabs.innerHTML = "";
  el.listview.innerHTML = "";
}

function renderRelatedListviews(configs) {
  resetRelatedListviews();
  if (!configs.length || typeof Tabs === "undefined" || typeof Listview === "undefined") {
    return;
  }
  const tabsRelated = new Tabs({ parent: el.tabs });
  window.tabsRelated = tabsRelated;
  for (const cfg of configs) {
    if (!cfg.data || !cfg.data.length) continue;
    const options = {
      template: cfg.template,
      id: cfg.id,
      name: cfg.name,
      tabs: tabsRelated,
      parent: "listview-generic",
      data: cfg.data
    };
    if (cfg.extraCols) options.extraCols = cfg.extraCols;
    if (cfg.visibleCols) options.visibleCols = cfg.visibleCols;
    if (cfg.hiddenCols) options.hiddenCols = cfg.hiddenCols;
    if (cfg.sort) options.sort = cfg.sort;
    new Listview(options);
    localizeListviewHeaders();
  }
  tabsRelated.flush();
  localizeListviewHeaders();
}

function localizeListviewHeaders() {
  if (state.lang !== "zhCN") return;
  document.querySelectorAll("#listview-generic th a span, #listview-generic th span").forEach((node) => {
    const raw = (node.textContent || "").trim();
    if (!raw) return;
    const translated = uiLabel(raw);
    if (translated !== raw) node.textContent = translated;
  });
  document.querySelectorAll("#listview-generic td a, #listview-generic td span").forEach((node) => {
    const raw = (node.textContent || "").trim();
    if (!raw) return;
    const translated = localizeItemAttributeText(raw);
    if (translated !== raw) node.textContent = translated;
  });
}

function renderInfobox(facts, tailHtml = "", extraRowsHtml = "") {
  const rows = facts
    .filter((f) => f && f.label && f.value != null && f.value !== "")
    .map((f) => {
      const value = f.html ? f.value : escapeHtml(localizeItemAttributeText(f.value));
      return `<li><div>${escapeHtml(uiLabel(f.label))}${f.noColon ? "" : `: ${value}`}</div></li>`;
    })
    .join("");
  if (!rows) return "";
  return `<table class="infobox"><tr><th>${escapeHtml(t("quickFacts"))}</th></tr><tr><td><div class="infobox-spacer"></div><ul>${rows}</ul>${tailHtml || ""}</td></tr>${extraRowsHtml || ""}</table>`;
}

function questFactionIconHtml(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  const cls = lower.includes("human") || lower.includes("dwarf") || lower.includes("gnome") || lower.includes("night elf") || lower.includes("highelf")
    ? "alliance-icon"
    : (lower.includes("orc") || lower.includes("tauren") || lower.includes("troll") || lower.includes("undead") ? "horde-icon" : "");
  return cls ? `<span class="${cls}">${escapeHtml(text)}</span>` : escapeHtml(text);
}

function toFactMap(rows) {
  const out = {};
  for (const row of rows || []) {
    const k = String(row.fact_key || "").trim();
    if (!k) continue;
    out[k] = row.fact_value == null ? "" : String(row.fact_value);
  }
  return out;
}

function formatMoneyHtml(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const nums = raw.split(/\s+/).filter(Boolean).map((x) => Number(x)).filter((x) => Number.isFinite(x));
  if (!nums.length) return escapeHtml(raw);
  const [gold, silver, copper] = nums.length >= 3 ? nums : [0, nums[0] || 0, nums[1] || 0];
  return [
    gold ? `<span class="moneygold">${gold}</span>` : "",
    silver ? `<span class="moneysilver">${silver}</span>` : "",
    copper ? `<span class="moneycopper">${copper}</span>` : ""
  ].filter(Boolean).join(" ");
}

function mapQuestRowsForListview(rows) {
  return rows.map((row) => ({
    id: String(row.id),
    name: row.name || `quest:${row.id}`,
    level: String(row.quest_level ?? row.level ?? ""),
    reqlevel: Number(row.required_level ?? row.reqlevel ?? 0),
    side: String(row.side ?? 0),
    category: Number(row.category ?? 0),
    category2: Number(row.category2 ?? 0),
    type: Number(row.type ?? 0),
    itemrewards: row.itemrewards,
    itemchoices: row.itemchoices
  }));
}

function itemQualityColor(qualityClass) {
  return {
    0: "ff9d9d9d",
    1: "ffffffff",
    2: "ff1eff00",
    3: "ff0070dd",
    4: "ffa335ee",
    5: "ffff8000",
    6: "ffe6cc80"
  }[Number(qualityClass)] || "ffffffff";
}

function listviewTabName(id, template) {
  const lang = typeof LANG !== "undefined" ? LANG : {};
  if (state.lang === "zhCN") {
    const zhNames = {
      "dropped-by": "掉落自",
      drop: "掉落",
      abilities: "技能",
      "contained-in-object": "包含于物体",
      "contained-in-item": "包含于物品",
      "objective-of": "任务目标",
      "reward-of": "任务奖励",
      "sold-by": "出售者",
      sells: "出售",
      "created-by": "制造来源",
      "reagent-for": "作为材料",
      "used-by-item": "被物品使用",
      "taught-by-npc": "训练师",
      "taught-by-item": "由物品教授",
      "taught-by-quest": "由任务教授",
      "reward-for-quest": "任务奖励",
      starts: "起始",
      ends: "结束",
      contains: "包含",
      "pick-pocketed-from": "偷窃自",
      "pick-pocketing": "可偷窃",
      unlocks: "解锁",
      "skinned-from": "剥皮自",
      skinning: "剥皮",
      "mined-from-object": "采矿自",
      disenchanting: "分解",
      "gathered-from-object": "采集自",
      "teaches-recipe": "教授配方",
      "fished-in": "钓鱼地点"
    };
    return zhNames[id] || zhNames[template] || pathLabel(id.replace(/-/g, " "));
  }
  const names = {
    "dropped-by": lang.tab_droppedby,
    drop: lang.tab_drops,
    abilities: lang.tab_abilities,
    "contained-in-object": lang.tab_containedin,
    "contained-in-item": lang.tab_containedin,
    "objective-of": lang.tab_objectiveof,
    "reward-of": lang.tab_rewardfrom,
    "sold-by": lang.tab_soldby,
    sells: lang.tab_sells,
    "created-by": lang.tab_createdby,
    "reagent-for": lang.tab_reagentfor,
    "used-by-item": lang.tab_usedby,
    "taught-by-npc": lang.tab_taughtby,
    "taught-by-item": lang.tab_taughtby,
    "taught-by-quest": lang.tab_taughtby,
    "reward-for-quest": lang.tab_rewardfrom,
    starts: lang.tab_starts,
    ends: lang.tab_ends,
    contains: lang.tab_contains,
    "pick-pocketed-from": lang.tab_pickpocketedfrom,
    "pick-pocketing": lang.tab_pickpocketing,
    unlocks: lang.tab_unlocks,
    "skinned-from": lang.tab_skinnedfrom,
    skinning: lang.tab_skinning,
    "mined-from-object": lang.tab_minedfrom,
    disenchanting: lang.tab_disenchantedfrom,
    "gathered-from-object": lang.tab_gatheredfrom,
    "teaches-recipe": lang.tab_teaches,
    "fished-in": lang.tab_fishedin
  };
  return names[id] || names[template] || id.replace(/-/g, " ");
}

function payloadListviewOptions(id) {
  if (typeof Listview === "undefined" || !Listview.extraCols) return {};
  const percentIds = new Set([
    "drop",
    "dropped-by",
    "contained-in-object",
    "contained-in-item",
    "contains",
    "pick-pocketed-from",
    "skinned-from",
    "mined-from-object",
    "gathered-from-object",
    "disenchanting"
  ]);
  if (id === "sold-by") {
    return {
      extraCols: [Listview.extraCols.stock, Listview.extraCols.cost],
      sort: ["name"]
    };
  }
  if (id === "used-by-item") {
    return {
      hiddenCols: ["source"],
      sort: ["name"]
    };
  }
  if (id === "see-also-ability") {
    return {
      visibleCols: ["level"],
      hiddenCols: ["reagents", "skill", "school"],
      sort: ["name"]
    };
  }
  if (percentIds.has(id)) {
    const options = {
      extraCols: [Listview.extraCols.percent],
      sort: ["-percent", "name"]
    };
      if (id === "contains") {
        options.extraCols = [
          Listview.extraCols.percent,
          Listview.funcBox.createSimpleCol("group", "group", "10%", "group")
        ];
        options.visibleCols = ["dps", "speed"];
        options.hiddenCols = ["source"];
      }
    if (id === "drop") {
      options.extraCols = [
        Listview.extraCols.percent,
        Listview.funcBox.createSimpleCol("group", "group", "10%", "group")
      ];
      options.hiddenCols = ["source"];
    }
    return options;
  }
  if (id === "sells") {
    return {
      extraCols: [Listview.extraCols.stock, Listview.extraCols.cost],
      sort: ["name"]
    };
  }
  return {};
}

function safeIdList(rows) {
  const ids = [...new Set((rows || []).map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0))];
  return ids.length ? ids.join(",") : "";
}

function mergePayloadOrder(payloadRows, hydratedRows) {
  const byId = new Map(hydratedRows.map((x) => [Number(x.id), x]));
  return payloadRows.map((x) => {
    const hydrated = byId.get(Number(x.id)) || {};
    return {
      ...hydrated,
      ...x,
      id: String(x.id),
      name: hydrated.name || x.name || `${x.id}`
    };
  });
}

function payloadRowsFromRaw(raw) {
  const rows = [];
  const source = String(raw || "");
  const dataMatch = /data\s*:\s*\[/.exec(source);
  if (!dataMatch) return rows;
  const data = source.slice(dataMatch.index);
  const re = /\{([^{}]*(?:\bid\s*:|\bname\s*:)[^{}]*)\}/g;
  let match = re.exec(data);
  while (match) {
    const block = match[1];
    const idMatch = /\bid\s*:\s*'?([0-9]*)'?/.exec(block);
    const id = idMatch && idMatch[1] ? Number(idMatch[1]) : 0;
    if (Number.isInteger(id)) {
      const row = { id };
      const nameMatch = /\bname\s*:\s*'((?:\\'|[^'])*)'/.exec(block);
      if (nameMatch) {
        const rawName = nameMatch[1].replace(/\\'/g, "'");
        const qualityName = /^([0-6])(?=[^\d\s])(.*)$/.exec(rawName);
        if (qualityName) {
          row.quality_class = 6 - Number(qualityName[1]);
          row.name = qualityName[2];
        } else {
          row.name = rawName.startsWith("@") ? rawName.slice(1) : rawName;
        }
      }
      for (const key of ["level", "reqlevel", "side", "category", "category2", "type", "percent", "classs", "subclass", "dps", "speed"]) {
        const valueMatch = new RegExp(`\\b${key}\\s*:\\s*'?([^,'\\]]+)'?`).exec(block);
        if (valueMatch) {
          const rawValue = valueMatch[1];
          const numericValue = Number(rawValue);
          row[key] = Number.isFinite(numericValue) ? numericValue : rawValue;
        }
      }
      for (const key of ["description", "group"]) {
        const valueMatch = new RegExp(`\\b${key}\\s*:\\s*'((?:\\\\'|[^'])*)'`).exec(block);
        if (valueMatch) row[key] = valueMatch[1].replace(/\\'/g, "'");
      }
      const rankMatch = /\brank\s*:\s*'((?:\\'|[^'])*)'/.exec(block);
      if (rankMatch) row.rank = rankMatch[1].replace(/\\'/g, "'");
      const stockMatch = /\bstock\s*:\s*(-?[0-9]+)/.exec(block);
      if (stockMatch) row.stock = Number(stockMatch[1]);
      const costMatch = /\bcost\s*:\s*\[([^\]]*)\]/.exec(block);
      if (costMatch) row.cost = costMatch[1].split(",").map((x) => Number(x.trim())).filter((x) => Number.isFinite(x));
      for (const key of ["itemrewards", "itemchoices"]) {
        const rewardsMatch = new RegExp(`\\b${key}\\s*:\\s*(\\[\\[[^\\]]+\\](?:,\\[[^\\]]+\\])*\\])`).exec(block);
        if (rewardsMatch) {
          try {
            row[key] = JSON.parse(rewardsMatch[1]);
          } catch {
            row[key] = undefined;
          }
        }
      }
      if (row.id > 0 || row.name) rows.push(row);
    }
    match = re.exec(data);
  }
  return rows;
}

async function primeGlobalItems(ids, locale) {
  const itemIds = Array.from(new Set((ids || []).map((x) => Number(x)).filter((x) => Number.isInteger(x) && x > 0)));
  if (!itemIds.length || !window.g_items) return;
  const rows = await execRows(`
    SELECT i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      i.icon_name, i.item_level, i.required_level, i.slot, i.armor_type,
      its.slot_text, its.type_text, its.damage_text, its.speed_text, its.dps_text,
      its.durability_text, its.pre_html, its.bonus_html, its.effect_html,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality_class
    FROM items i
    LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
    LEFT JOIN item_tooltip_stats its ON its.item_id=i.item_id
    WHERE i.item_id IN (${itemIds.join(",")});
  `, { ":locale": locale });
  await hydrateItemEffectSpells(rows, locale, ["effect_html"]);
  for (const item of rows) {
    const id = Number(item.id);
    window.g_items[id] = window.g_items[id] || {};
    window.g_items[id].name = item.name;
    window.g_items[id].quality = Number(item.quality_class ?? item.quality ?? 1);
    window.g_items[id].icon = normalizeIconName(item.icon_name);
    registerLocalItemTooltip(item);
  }
}

function registerGlobalItemRows(rows) {
  if (!window.g_items) return;
  for (const item of rows || []) {
    const id = Number(item.id);
    if (!Number.isInteger(id) || id <= 0) continue;
    window.g_items[id] = window.g_items[id] || {};
    window.g_items[id].name = item.name;
    window.g_items[id].quality = Number(item.quality_class ?? item.quality ?? 1);
    window.g_items[id].icon = normalizeIconName(item.icon_name);
    registerLocalItemTooltip(item);
  }
}

async function primeGlobalSpells(ids, locale) {
  const spellIds = Array.from(new Set((ids || []).map((x) => Number(x)).filter((x) => Number.isInteger(x) && x > 0)));
  if (!spellIds.length || !window.g_spells) return;
  const rows = await execRows(`
    SELECT s.spell_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END AS name,
      s.icon_name, s.cost_text, s.range_text, s.cast_time_text,
      s.description AS original_description,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.description, st.description_text, s.description) ELSE s.description END AS description,
      st.rank_text AS tooltip_rank_text, st.range_short_text AS tooltip_range_short_text,
      st.cast_text AS tooltip_cast_text,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.description, st.description_text, s.description) ELSE s.description END AS tooltip_description_text
    FROM spells s
    LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
    LEFT JOIN spell_tooltips st ON st.spell_id=s.spell_id
    WHERE s.spell_id IN (${spellIds.join(",")});
  `, { ":locale": locale });
  for (const spell of rows) {
    const id = Number(spell.id);
    window.g_spells[id] = window.g_spells[id] || {};
    window.g_spells[id].name = spell.name;
    window.g_spells[id].icon = normalizeIconName(spell.icon_name);
    registerLocalSpellTooltip(spell);
  }
}

async function hydratePayloadListview(lv, locale) {
  const rows = lv.raw ? payloadRowsFromRaw(lv.raw) : (Array.isArray(lv.rows) && lv.rows.length ? lv.rows : []);
  const ids = safeIdList(rows);
  if (!ids) {
    if (lv.template === "quest") {
      const rewardIds = rows.flatMap((x) => [...(x.itemrewards || []), ...(x.itemchoices || [])].map((pair) => pair && pair[0])).filter(Boolean);
      await primeGlobalItems(rewardIds, locale);
      const rawNames = [...new Set(rows.map((x) => String(x.name || "").trim()).filter(Boolean))];
      const questsByName = new Map();
      if (rawNames.length) {
        const params = {};
        const placeholders = rawNames.map((name, index) => {
          params[`:name${index}`] = name;
          return `:name${index}`;
        });
        const matched = await execRows(`
          SELECT q.quest_id AS id, q.name,
          CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS localized_name,
          q.quest_level, q.required_level, q.side, q.zone_or_sort
          FROM quests q
          LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
          WHERE q.name IN (${placeholders.join(",")});
        `, { ...params, ":locale": locale });
        for (const match of matched) {
          const list = questsByName.get(match.name) || [];
          list.push(match);
          questsByName.set(match.name, list);
        }
      }
      return rows.map((x, index) => {
        const candidates = questsByName.get(x.name) || [];
        const localized = candidates.find((candidate) => {
          const levelMatches = String(candidate.quest_level ?? "") === String(x.level ?? "");
          const reqMatches = Number(candidate.required_level || 0) === Number(x.reqlevel || 0);
          const sideMatches = questSideValue(candidate.side) === questSideValue(x.side);
          const categoryMatches = !x.category || Number(candidate.zone_or_sort || 0) === Number(x.category || 0);
          return levelMatches && reqMatches && sideMatches && categoryMatches;
        }) || candidates.find((candidate) => {
          const levelMatches = String(candidate.quest_level ?? "") === String(x.level ?? "");
          const reqMatches = Number(candidate.required_level || 0) === Number(x.reqlevel || 0);
          return levelMatches && reqMatches;
        }) || candidates[0];
        return {
          id: String(x.id || localized?.id || `raw-${index}`),
          name: localized?.localized_name || x.name || `quest:${index}`,
          level: String(x.level ?? ""),
          reqlevel: Number(x.reqlevel || 0),
          side: questSideValue(x.side),
          itemrewards: x.itemrewards,
          itemchoices: x.itemchoices,
          xp: Number(x.xp || 0),
          money: Number(x.money || 0),
          category: Number(x.category || 0),
          category2: Number(x.category2 || 0),
          type: x.type
        };
      });
    }
    return [];
  }
  if (lv.template === "quest") {
    const hydrated = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side, q.zone_or_sort AS category
      FROM quests q
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE q.quest_id IN (${ids});
    `, { ":locale": locale });
    const merged = mergePayloadOrder(rows, hydrated);
    const rewardIds = [];
    for (const row of merged) {
      for (const key of ["itemrewards", "itemchoices"]) {
        for (const reward of row[key] || []) {
          if (Array.isArray(reward)) rewardIds.push(reward[0]);
        }
      }
    }
    await primeGlobalItems(rewardIds, locale);
    return mapQuestRowsForListview(merged);
  }
  if (lv.template === "npc") {
    const hydrated = await execRows(`
      SELECT n.npc_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
      n.level_min AS minlevel, n.level_max AS maxlevel, n.npc_class AS classification
      FROM npcs n
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE n.npc_id IN (${ids});
    `, { ":locale": locale });
    return mergePayloadOrder(rows, hydrated).map((x) => ({
      id: String(x.id),
      name: x.name,
      minlevel: x.minlevel,
      maxlevel: x.maxlevel,
      classification: x.classification,
      stock: x.stock,
      cost: x.cost,
      percent: x.percent
    }));
  }
  if (lv.template === "object") {
    const hydrated = await execRows(`
      SELECT o.object_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END AS name,
      o.type_text AS type
      FROM objects o
      LEFT JOIN entity_localizations l ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      WHERE o.object_id IN (${ids});
    `, { ":locale": locale });
    return mergePayloadOrder(rows, hydrated).map((x) => ({
      id: String(x.id),
      name: x.name,
      type: x.type,
      percent: x.percent
    }));
  }
  if (lv.template === "item") {
    const hydrated = await execRows(`
      SELECT i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      i.item_level AS level, i.required_level AS reqlevel, i.slot, i.armor_type,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality
      FROM items i
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE i.item_id IN (${ids});
    `, { ":locale": locale });
    const merged = mergePayloadOrder(rows, hydrated);
    await primeGlobalItems(merged.map((x) => x.id), locale);
    return mapItemRowsForListview(merged.map((x) => ({
      id: x.id,
      name: x.name,
      level: x.level,
      reqlevel: x.reqlevel,
      quality_class: x.quality_class,
      classs: x.classs,
      subclass: x.subclass,
      description: x.description,
      group: x.group,
      slot: x.slot,
      type: x.type,
      percent: x.percent,
      dps: x.dps,
      speed: x.speed
    })));
  }
  if (lv.template === "spell") {
    const hydrated = await execRows(`
      SELECT s.spell_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END AS name,
      s.level, s.school, s.icon_name
      FROM spells s
      LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
      WHERE s.spell_id IN (${ids});
    `, { ":locale": locale });
    const merged = mergePayloadOrder(rows, hydrated);
    await primeGlobalSpells(merged.map((x) => x.id), locale);
    return merged.map((x) => ({
      id: String(x.id),
      name: listviewSpellName(x.name),
      level: x.level,
      school: x.school,
      rank: x.rank,
      percent: x.percent
    }));
  }
  if (lv.template === "zone") {
    const hydrated = await execRows(`
      SELECT z.zone_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, z.zone_name) ELSE z.zone_name END AS name
      FROM zones z
      LEFT JOIN entity_localizations l ON l.entity_type='zone' AND l.entity_id=z.zone_id AND l.locale='zhCN'
      WHERE z.zone_id IN (${ids});
    `, { ":locale": locale });
    return mergePayloadOrder(rows, hydrated).map((x) => ({
      id: String(x.id),
      name: x.name
    }));
  }
  return [];
}

async function payloadListviewConfigs(entityType, entityId, locale) {
  const payloadRows = await execRows(`
    SELECT listviews_json
    FROM entity_payloads
    WHERE entity_type=:type AND entity_id=:id
    LIMIT 1;
  `, { ":type": entityType, ":id": entityId });
  if (!payloadRows.length || !payloadRows[0].listviews_json) return [];
  let listviews = [];
  try {
    listviews = JSON.parse(payloadRows[0].listviews_json) || [];
  } catch (err) {
    return [];
  }
  const configs = [];
  for (const lv of listviews) {
    const data = await hydratePayloadListview(lv, locale);
    if (!data.length) continue;
    configs.push({
      template: lv.template,
      id: lv.id || `${lv.template}-${configs.length}`,
      name: listviewTabName(lv.id || "", lv.template || ""),
      data,
      ...payloadListviewOptions(lv.id || "")
    });
  }
  return configs;
}

function renderItemTooltipBlock(row, factMap = {}) {
  if (!row) return "";
  const qClass = row.quality_class || "1";
  const tooltipId = `tooltip${String(row.id)}-generic`;
  const slotText = localizeItemAttributeText(String(row.tooltip_slot_text || row.slot || "").trim());
  const typeText = localizeItemAttributeText(String(row.tooltip_type_text || row.armor_type || "").trim());
  const damageText = localizeItemAttributeText(String(row.tooltip_damage_text || "").trim());
  const speedText = localizeItemAttributeText(String(row.tooltip_speed_text || "").trim());
  const dpsText = localizeItemAttributeText(String(row.tooltip_dps_text || "").trim());
  const durabilityText = localizeItemAttributeText(String(row.tooltip_durability_text || "").trim());
  const preHtml = localizeItemAttributeHtml(normalizeTooltipPreHtml(row.tooltip_pre_html));
  const bonusHtml = localizeItemAttributeHtml(String(row.tooltip_bonus_html || "").trim());
  const effectHtml = localizeItemAttributeHtml(String(row.tooltip_effect_html || "").trim());
  const bindText = localizeItemAttributeText(factMap["Binds when equipped"] ? "Binds when equipped" : (factMap["Binds when picked up"] ? "Binds when picked up" : ""));
  const armorLine = localizeItemAttributeText(factMap.Armor || "");
  const durabilityLine = localizeItemAttributeText(factMap.Durability || "");
  const requireLine = localizeItemAttributeText(factMap["Requires Level"] || (row.required_level != null ? `Requires Level ${row.required_level}` : ""));
  return `
    <div id="icon${escapeHtml(String(row.id))}-generic" style="float: left; min-width: 56px; min-height: 56px"></div>
    <div id="${escapeHtml(tooltipId)}" class="tooltip" style="float: left; padding-top: 1px; width: 253px">
      <table>
        <tr>
          <td>
            <table><tr><td>
              <b class="q${escapeHtml(qClass)}">${escapeHtml(row.name)}</b><br>
              ${preHtml || (bindText ? `${escapeHtml(bindText)}<br>` : "")}
              ${slotText || typeText ? `<table width="100%"><tr><td>${escapeHtml(slotText)}</td><th>${escapeHtml(typeText)}</th></tr></table>` : ""}
              ${damageText || speedText ? `<table width="100%"><tr><td>${escapeHtml(damageText)}</td><th>${escapeHtml(speedText)}</th></tr></table>` : ""}
              ${dpsText ? `(${escapeHtml(dpsText)})<br>` : ""}
              ${durabilityText ? `${escapeHtml(state.lang === "zhCN" ? "耐久度" : "Durability")} ${escapeHtml(durabilityText)}<br>` : ""}
              ${bonusHtml}
              ${armorLine ? `${escapeHtml(armorLine)}<br>` : ""}
              ${durabilityLine ? `${escapeHtml(durabilityLine)}<br>` : ""}
              ${!bonusHtml && requireLine && !String(requireLine).toLowerCase().includes("requires level") && !String(requireLine).includes("需要等级") ? `${escapeHtml(state.lang === "zhCN" ? "需要等级" : "Requires Level")} ${escapeHtml(requireLine)}<br>` : ""}
            </td></tr></table>
            ${effectHtml ? `<table><tr><td>${effectHtml}</td></tr></table>` : ""}
          </td>
          <th style="background-position: top right"></th>
        </tr>
        <tr>
          <th style="background-position: bottom left"></th>
          <th style="background-position: bottom right"></th>
        </tr>
      </table>
    </div>
    <div style="clear: left"></div>
  `;
}

function renderSpellTooltipBlock(row) {
  if (!row) return "";
  const tooltipId = `tooltip${String(row.id)}-generic`;
  const rankText = String(row.tooltip_rank_text || "").trim();
  const rangeText = String(row.tooltip_range_short_text || row.range_text || "").trim();
  const castText = String(row.tooltip_cast_text || row.cast_time_text || "").trim();
  const descText = resolveSpellPlaceholders(
    spellDescriptionForLocale(row),
    row.original_description || row.en_description || ""
  );
  const auraText = resolveSpellPlaceholders(
    String(row.tooltip_aura_text || "").trim(),
    row.original_description || row.en_description || ""
  );
  const descHtml = descText
    ? descText.match(/.{1,48}(?:\s|$)/g).map((x) => escapeHtml(x.trim())).filter(Boolean).join("<br>")
    : "";
  const auraHtml = auraText && auraText !== descText
    ? auraText.match(/.{1,48}(?:\s|$)/g).map((x) => escapeHtml(x.trim())).filter(Boolean).join("<br>")
    : "";
  return `
    <div id="icon${escapeHtml(String(row.id))}-generic" style="float: left"></div>
    <div id="${escapeHtml(tooltipId)}" class="tooltip" style="float: left; padding-top: 1px">
      <table>
        <tr>
          <td>
            <table><tr><td>
              <table width="100%"><tr><td><b>${escapeHtml(row.name)}</b><br /></td><th>${rankText ? `<b class="q0">${escapeHtml(rankText)}</b>` : ""}</th></tr></table>
              <table width="100%"><tr><td>${escapeHtml(row.cost_text || "")}<br /></td><th>${escapeHtml(rangeText)}<br /></th></tr></table>
              ${escapeHtml(castText)}
            </td></tr></table>
            ${descHtml ? `<table><tr><td><span class="q">${descHtml}</span></td></tr></table>` : ""}
            ${auraHtml ? `<table><tr><td><span class="q2">${auraHtml}</span></td></tr></table>` : ""}
          </td>
          <th style="background-position: top right"></th>
        </tr>
        <tr>
          <th style="background-position: bottom left"></th>
          <th style="background-position: bottom right"></th>
        </tr>
      </table>
    </div>
    <div style="clear: left"></div>
  `;
}

function initItemVisuals(row) {
  if (!row || typeof window.ge !== "function" || !window.Icon) return;
  const iconHost = window.ge(`icon${String(row.id)}-generic`);
  if (iconHost && !iconHost.firstChild) {
    iconHost.appendChild(window.Icon.create(normalizeIconName(row.icon_name), 2, 0, 0, 1));
  }
  if (window.Tooltip && typeof window.Tooltip.fix === "function") {
    const tt = window.ge(`tooltip${String(row.id)}-generic`);
    if (tt) window.Tooltip.fix(tt, 1, 1);
  }
}

function initSpellVisuals(row) {
  if (!row || typeof window.ge !== "function" || !window.Icon) return;
  const iconHost = window.ge(`icon${String(row.id)}-generic`);
  if (iconHost && !iconHost.firstChild) {
    iconHost.appendChild(window.Icon.create(normalizeIconName(row.icon_name), 2, 0, 0, 0));
  }
  if (window.g_spells) {
    window.g_spells[Number(row.id)] = window.g_spells[Number(row.id)] || {};
    window.g_spells[Number(row.id)].icon = normalizeIconName(row.icon_name);
    registerLocalSpellTooltip(row);
  }
  if (window.Tooltip && typeof window.Tooltip.fix === "function") {
    const tt = window.ge(`tooltip${String(row.id)}-generic`);
    if (tt) window.Tooltip.fix(tt, 1, 1);
  }
}

function initQuestVisuals(objectiveItems, rewardItems) {
  if (typeof window.ge !== "function" || !window.g_items) return;
  [...(objectiveItems || []), ...(rewardItems || [])].forEach((item) => {
    const itemId = Number(item.id);
    if (!Number.isInteger(itemId) || itemId <= 0) return;
    window.g_items[itemId] = window.g_items[itemId] || {};
    window.g_items[itemId].icon = normalizeIconName(item.icon_name);
    registerLocalItemTooltip(item);
  });
  (objectiveItems || []).forEach((item, index) => {
    const host = window.ge(`quest-objective-icon${index}`);
    if (!host || host.firstChild) return;
    host.appendChild(window.g_items.createIcon(Number(item.id), 0, Number(item.count || 0)));
  });
  (rewardItems || []).forEach((item, index) => {
    const host = window.ge(`quest-reward-icon${index}`);
    if (!host || host.firstChild) return;
    host.appendChild(window.g_items.createIcon(Number(item.id), 1, 0));
  });
}

function initItemsetVisuals(items) {
  if (!items || !items.length || typeof window.ge !== "function" || !window.g_items) return;
  items.forEach((item, index) => {
    const host = window.ge(`iconlist-icon${index + 1}`);
    if (!host || host.firstChild) return;
    const itemId = Number(item.id);
    const icon = normalizeIconName(item.icon_name);
    window.g_items[itemId] = window.g_items[itemId] || {};
    window.g_items[itemId].icon = icon;
    registerLocalItemTooltip(item);
    host.appendChild(window.g_items.createIcon(itemId, 0, 0));
  });
}

function spellFactValueHtml(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.toLowerCase() === "n/a") return '<span class="q0">n/a</span>';
  const paren = /^([^()]+)\s+\(([^)]+)\)$/.exec(raw);
  if (paren) return `${escapeHtml(paren[1].trim())} <small>(${escapeHtml(paren[2])})</small>`;
  return escapeHtml(raw);
}

function spellEffectHtml(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const match = /^(.*?)(?:\s+(Value:|Interval:)\s*(.*))$/.exec(raw);
  if (!match) return escapeHtml(raw);
  return `${escapeHtml(match[1].trim())}<br><small>${escapeHtml(match[2])} ${escapeHtml(match[3].trim())}</small>`;
}

function setWowheadPageInfo(type, row) {
  const typeIds = {
    npc: 1,
    object: 2,
    item: 3,
    itemset: 4,
    quest: 5,
    spell: 6,
    faction: 8
  };
  if (!row || !typeIds[type]) return;
  window.lv_comments = [];
  window.g_pageInfo = {
    type: typeIds[type],
    typeId: Number(row.id),
    name: row.name
  };
  if (typeof window.ss_appendSticky === "function") {
    try { window.ss_appendSticky(); } catch (err) {}
  }
}

function setPageHeading(titleText) {
  const title = titleText || "Turtle WoW Database";
  document.title = title;
  if (el.headerTitle) el.headerTitle.textContent = title;
}

function setHomeMode(enabled) {
  document.body.classList.toggle("is-home", !!enabled);
}

function initMapper(points) {
  const list = (points || []).filter((p) => p && p.zone_id != null && p.x != null && p.y != null);
  if (!list.length || typeof window.Mapper === "undefined") return;
  const container = document.getElementById("mapper-generic");
  if (!container) return;
  try {
    container.innerHTML = "";
    const first = list[0];
    const mapper = new window.Mapper({ parent: "mapper-generic", zone: String(first.zone_id) });
    if (mapper && typeof mapper.update === "function") {
      mapper.update({
        zone: Number(first.zone_id),
        coords: list.map((p) => [Number(p.x), Number(p.y), { label: "$", type: "0" }])
      });
    }
  } catch (_) {
    // Keep page rendering even when mapper initialization fails.
  }
}

function typePlural(type) {
  if (type === "item") return "items";
  if (type === "itemset") return "itemsets";
  if (type === "npc") return "npcs";
  if (type === "object") return "objects";
  if (type === "quest") return "quests";
  if (type === "spell") return "spells";
  if (type === "faction") return "factions";
  return "";
}

function itemBreadcrumbLinks(row) {
  const slot = String(row.slot || "").toLowerCase();
  const armorType = String(row.armor_type || "").toLowerCase();
  if (armorType.includes("sword")) {
    return [
      { href: "?items", label: "Items" },
      { href: "?items=2", label: "Weapons" },
      { href: "?items=2.7", label: "One-Handed Swords" }
    ];
  }
  if (slot || armorType) {
    return [
      { href: "?items", label: "Items" },
      { href: "?items=2", label: "Weapons" }
    ];
  }
  return [{ href: "?items", label: "Items" }];
}

function menuEntryHref(entry, baseKey, codePath) {
  if (entry && entry[2]) return entry[2];
  if (!baseKey || !codePath.length) return ".";
  return `?${baseKey}=${codePath.join(".")}`;
}

function resolveMenuPath(pathIds) {
  if (!Array.isArray(pathIds) || !pathIds.length || typeof mn_path === "undefined") return [];
  let menu = mn_path;
  let baseKey = "";
  const codePath = [];
  const links = [];
  for (let i = 0; i < pathIds.length; i += 1) {
    const id = Number(pathIds[i]);
    const entry = (menu || []).find((x) => Number(x && x[0]) === id);
    if (!entry) break;
    const label = entry[1] || "";
    if (!label || label === "Browse") {
      menu = entry[3] || [];
      continue;
    }
    if (i === 0 && label === "Database") {
      links.push({ href: ".", label });
    } else {
      if (!baseKey) {
        const href = String(entry[2] || "");
        baseKey = href.replace(/^\?/, "") || label.toLowerCase().replace(/\s+/g, "");
      } else {
        codePath.push(id);
      }
      links.push({
        href: menuEntryHref(entry, baseKey, codePath),
        label
      });
    }
    menu = entry[3] || [];
  }
  return links;
}

function renderBreadcrumbFromLinks(links) {
  const safeLinks = (links || []).filter((x) => x && x.label);
  if (!safeLinks.length) return "";
  return `<div class="path">${safeLinks.map((x) => `<a href="${escapeHtml(x.href || ".")}">${escapeHtml(pathLabel(x.label, x.href))}</a>`).join(" &raquo; ")}</div>`;
}

function titleCasePlural(type) {
  const p = typePlural(type);
  if (!p) return "";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function renderNamedLinksBlock(title, rows, toHref, extraText = null) {
  if (!rows.length) return "";
  const links = rows.map((row) => {
    const suffix = extraText ? extraText(row) : "";
    return `<div class="meta"><a href="${toHref(row)}">${escapeHtml(row.name)}</a>${suffix ? ` - ${escapeHtml(suffix)}` : ""}</div>`;
  }).join("");
  return `<div class="block-title">${escapeHtml(title)}</div>${links}`;
}

function factRow(label, value) {
  if (value == null || value === "") return "";
  return `<div class="meta"><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</div>`;
}

function factRowHtml(label, valueHtml) {
  if (!valueHtml) return "";
  return `<div class="meta"><b>${escapeHtml(label)}:</b> ${valueHtml}</div>`;
}

function renderListTable(columns, rows, rowToCells, breadcrumbHtml = "") {
  if (el.precontents) el.precontents.innerHTML = breadcrumbHtml;
  if (!rows.length) {
    el.detail.innerHTML = `<div class="meta">${escapeHtml(t("list_no_results"))}</div>`;
    return;
  }
  const thead = columns.map((c) => `<th><div><a href="javascript:;"><span>${escapeHtml(uiLabel(c))}</span></a></div></th>`).join("");
  const tbody = rows.map((row) => {
    const cells = rowToCells(row).map((cell, i) => `<td${i === 0 ? ' style="text-align:left"' : ""}>${cell}</td>`).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  el.detail.innerHTML = `
    <div class="listview">
      <table class="listview-std">
        <thead><tr>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
  `;
}

function renderBrowseListview(config, breadcrumbHtml = "") {
  if (el.precontents) el.precontents.innerHTML = breadcrumbHtml;
  el.detail.innerHTML = "";
  resetRelatedListviews();
  if (typeof Listview === "undefined") {
    renderListTable([t("list_name")], config.data || [], (row) => [`<a href="?${config.template}=${encodeURIComponent(String(row.id))}">${escapeHtml(row.name || row.id)}</a>`], breadcrumbHtml);
    return;
  }
  const options = {
    template: config.template,
    id: config.id || config.template,
    parent: "listview-generic",
    data: config.data || []
  };
  if (config.extraCols) options.extraCols = config.extraCols;
  if (config.hiddenCols) options.hiddenCols = config.hiddenCols;
  if (config.visibleCols) options.visibleCols = config.visibleCols;
  if (config.sort) options.sort = config.sort;
  if (config.template === "spell") {
    options.data = (options.data || []).map((row) => ({
      ...row,
      name: listviewSpellName(row.name)
    }));
  }
  new Listview(options);
  localizeListviewHeaders();
}

async function renderBrowseList(listType, params = new URLSearchParams(window.location.search)) {
  const locale = state.lang === "zhCN" ? "zhCN" : "__none__";
  let rows = [];
  if (listType === "items") {
    const itemPathParts = parseBrowsePathParam(params.get("items"), 3);
    const itemQueryParams = { ":locale": locale };
    const itemWhere = ["i.name <> '_'"];
    if (itemPathParts.length === 1) {
      const path = [0, 0, itemPathParts[0]];
      itemQueryParams[":pathExact"] = pathJsonLiteral(path);
      itemQueryParams[":pathPrefix"] = `${pathJsonLiteral(path).slice(0, -1)},%`;
      itemWhere.push("(ep.path_json = :pathExact OR ep.path_json LIKE :pathPrefix)");
    } else if (itemPathParts.length >= 2) {
      const basePath = [0, 0, itemPathParts[0], itemPathParts[1]];
      itemQueryParams[":pathExact"] = pathJsonLiteral(itemPathParts.length >= 3 && itemPathParts[0] !== 4 ? [...basePath, itemPathParts[2]] : basePath);
      itemWhere.push("ep.path_json = :pathExact");
      if (itemPathParts.length >= 3 && itemPathParts[0] === 4) {
        const slotLabel = itemSlotLabel(itemPathParts[2]);
        if (slotLabel) {
          itemQueryParams[":slotLabel"] = slotLabel;
          itemWhere.push("COALESCE(its.slot_text, i.slot) = :slotLabel");
        }
      }
    }
    rows = await execRows(`
      SELECT i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      i.item_level AS level, i.required_level AS reqlevel, i.icon_name, i.slot, ep.path_json,
      its.slot_text, its.type_text, its.damage_text, its.speed_text, its.dps_text,
      its.durability_text, its.pre_html, its.bonus_html, its.effect_html,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality_class
      FROM items i
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      LEFT JOIN entity_paths ep ON ep.entity_type='item' AND ep.entity_id=i.item_id
      LEFT JOIN item_tooltip_stats its ON its.item_id=i.item_id
      WHERE ${itemWhere.join(" AND ")}
      ORDER BY quality_class DESC, name COLLATE NOCASE
      LIMIT 50000;
    `, itemQueryParams);
    if (itemPathParts.length) {
      rows = rows.filter((row) => itemPathMatches(row.path_json, itemPathParts, row));
    }
    await hydrateItemEffectSpells(rows, locale, ["effect_html"]);
    registerGlobalItemRows(rows);
    if (el.precontents) {
      el.precontents.innerHTML = browseBreadcrumb(itemPathParts.length ? [0, 0, ...itemPathParts] : [0, 0], "Items", "?items");
    }
    el.detail.innerHTML = `
      <span class="menuarrow hand" onclick="toggle_filters()">Filters</span>
      <form method="POST" id="filters_form" class="filters_hidden">
        <input type="hidden" name="filters" value="off" id="filters">
      </form>
    `;
    resetRelatedListviews();
    if (typeof Listview !== "undefined" && window.Listview.funcBox) {
      const data = rows.map((x) => {
        const classInfo = itemClassInfoFromPath(x.path_json);
        return {
          id: String(x.id),
          name: listviewItemName(x.name, x.quality_class),
          description: searchItemDescription(x),
          level: x.level,
          reqlevel: x.reqlevel,
          quality: x.quality_class,
          armor: itemArmorValue(x.pre_html),
          slot: itemSlotValue(x.slot_text || x.slot),
          classs: classInfo.classs,
          subclass: classInfo.subclass,
          subsubclass: classInfo.subsubclass
        };
      });
      new Listview({
        template: "item",
        id: "items",
        parent: "listview-generic",
        extraCols: itemPathParts[0] === 4
          ? [{ id: "quality", name: uiLabel("Quality"), hidden: true, value: "quality" }]
          : [
              { id: "quality", name: uiLabel("Quality"), hidden: true, value: "quality" },
              Listview.funcBox.createSimpleCol("description", t("description"), "40%", "description")
            ],
        hiddenCols: ["source", "quality"],
        visibleCols: itemPathParts[0] === 4 ? ["armor", "slot"] : undefined,
        sort: ["-quality", "name"],
        data
      });
      localizeListviewHeaders();
    } else {
      renderListTable(
        [t("list_name"), t("list_item_level"), t("list_required_level"), t("list_type")],
        rows,
        (row) => [
          `<a href="?item=${encodeURIComponent(String(row.id))}">${escapeHtml(row.name)}</a>`,
          escapeHtml(row.level ?? ""),
          escapeHtml(row.reqlevel ?? ""),
          escapeHtml(localizeItemAttributeText(searchItemTypeText(row)))
        ]
      );
    }
    return;
  }
  if (listType === "itemsets") {
    const filterRaw = String(params.get("filter") || "").trim();
    let classId = null;
    const m = /^cl=([0-9]+)$/i.exec(filterRaw);
    if (m) classId = Number(m[1]);
    const classMaskBit = classId && classId > 0 ? (1 << (classId - 1)) : 0;
    rows = await execRows(`
      SELECT s.itemset_id AS id, s.name, s.set_level, s.piece_count,
        COALESCE(MAX(si.quality_class), 3) AS quality_class
      FROM itemsets s
      LEFT JOIN itemset_items si ON si.itemset_id=s.itemset_id
      WHERE (
        :bit = 0
        OR EXISTS (
          SELECT 1
          FROM itemset_items si
          JOIN items i ON i.item_id=si.item_id
          WHERE si.itemset_id=s.itemset_id
            AND i.class_mask IS NOT NULL
            AND i.class_mask > 0
            AND (i.class_mask & :bit) != 0
        )
      )
      GROUP BY s.itemset_id, s.name, s.set_level, s.piece_count
      ORDER BY s.name COLLATE NOCASE
      LIMIT 1000;
    `, { ":bit": classMaskBit });
    const setIds = rows.map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0);
    const pieceRows = setIds.length ? await execRows(`
      SELECT si.itemset_id, si.item_id AS id, si.quality_class, si.icon_name, si.sort_order
      FROM itemset_items si
      WHERE si.itemset_id IN (${setIds.join(",")})
      ORDER BY si.itemset_id, si.sort_order;
    `) : [];
    await primeGlobalItems(pieceRows.map((x) => x.id), locale);
    const piecesBySet = new Map();
    for (const piece of pieceRows) {
      const setId = Number(piece.itemset_id);
      const list = piecesBySet.get(setId) || [];
      list.push(Number(piece.id));
      piecesBySet.set(setId, list);
    }
    renderBrowseListview({
      template: "itemset",
      id: "itemsets",
      data: rows.map((x) => ({
        id: String(x.id),
        name: listviewItemName(x.name, x.quality_class),
        minlevel: Number(x.set_level || 0),
        maxlevel: Number(x.set_level || 0),
        pieces: piecesBySet.get(Number(x.id)) || [],
        type: 0
      })),
      sort: ["name"]
    }, `<div class="path"><a href=".">${escapeHtml(pathLabel("Database"))}</a> &raquo; <a href="?itemsets">${escapeHtml(t("type_itemset"))}</a></div>`);
    return;
  }
  if (listType === "npcs") {
    const npcPathParts = parseBrowsePathParam(params.get("npcs"), 1);
    rows = await execRows(`
      SELECT n.npc_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
      n.level_min, n.level_max, COALESCE(n.npc_class, '') AS type_text, ep.path_json
      FROM npcs n
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      LEFT JOIN entity_paths ep ON ep.entity_type='npc' AND ep.entity_id=n.npc_id
      ORDER BY name COLLATE NOCASE
      LIMIT 50000;
    `, { ":locale": locale });
    if (npcPathParts.length) {
      rows = rows.filter((row) => entityPathMatches(row.path_json, npcPathParts, 2));
    }
    const npcIds = rows.map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0);
    const locationRows = npcIds.length ? await execRows(`
      SELECT entity_id AS id, zone_id
      FROM map_points
      WHERE entity_type='npc' AND entity_id IN (${npcIds.join(",")})
      GROUP BY entity_id, zone_id;
    `) : [];
    const locationsById = new Map();
    for (const loc of locationRows) {
      const id = Number(loc.id);
      const list = locationsById.get(id) || [];
      list.push(Number(loc.zone_id));
      locationsById.set(id, list);
    }
    renderBrowseListview({
      template: "npc",
      id: "npcs",
      data: rows.map((x) => ({
        id: String(x.id),
        name: x.name,
        minlevel: Number(x.level_min || 0),
        maxlevel: Number(x.level_max || x.level_min || 0),
        classification: npcClassificationValue(x.type_text),
        type: firstPathPart(x.path_json, 2, 10),
        location: locationsById.get(Number(x.id)) || []
      })),
      sort: ["name"]
    }, browseBreadcrumb(npcPathParts.length ? [0, 4, ...npcPathParts] : [0, 4], "NPCs", "?npcs"));
    return;
  }
  if (listType === "objects") {
    const objectPathParts = parseBrowsePathParam(params.get("objects"), 1);
    rows = await execRows(`
      SELECT o.object_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END AS name,
      COALESCE(o.type_text, '') AS type_text, ep.path_json
      FROM objects o
      LEFT JOIN entity_localizations l ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      LEFT JOIN entity_paths ep ON ep.entity_type='object' AND ep.entity_id=o.object_id
      ORDER BY name COLLATE NOCASE
      LIMIT 50000;
    `, { ":locale": locale });
    if (objectPathParts.length) {
      rows = rows.filter((row) => entityPathMatches(row.path_json, objectPathParts, 2));
    }
    const objectIds = rows.map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0);
    const locationRows = objectIds.length ? await execRows(`
      SELECT entity_id AS id, zone_id
      FROM map_points
      WHERE entity_type='object' AND entity_id IN (${objectIds.join(",")})
      GROUP BY entity_id, zone_id;
    `) : [];
    const locationsById = new Map();
    for (const loc of locationRows) {
      const id = Number(loc.id);
      const list = locationsById.get(id) || [];
      list.push(Number(loc.zone_id));
      locationsById.set(id, list);
    }
    renderBrowseListview({
      template: "object",
      id: "objects",
      data: rows.map((x) => ({
        id: String(x.id),
        name: x.name,
        type: firstPathPart(x.path_json, 2, 0),
        location: locationsById.get(Number(x.id)) || []
      })),
      sort: ["name"]
    }, browseBreadcrumb(objectPathParts.length ? [0, 5, ...objectPathParts] : [0, 5], "Objects", "?objects"));
    return;
  }
  if (listType === "quests") {
    const questPathParts = parseBrowsePathParam(params.get("quests"), 2);
    rows = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, COALESCE(q.side, '') AS side_text, ep.path_json,
      COALESCE(qtype.fact_value, '0') AS quest_type
      FROM quests q
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      LEFT JOIN entity_paths ep ON ep.entity_type='quest' AND ep.entity_id=q.quest_id
      LEFT JOIN quest_facts qtype ON qtype.quest_id=q.quest_id AND qtype.fact_key='Type'
      ORDER BY name COLLATE NOCASE
      LIMIT 50000;
    `, { ":locale": locale });
    if (questPathParts.length) {
      rows = rows.filter((row) => entityPathMatches(row.path_json, questPathParts, 2));
    }
    const questIds = rows.map((x) => Number(x.id)).filter((x) => Number.isInteger(x) && x > 0);
    const rewardRows = questIds.length ? await execRows(`
      SELECT quest_id, item_id, COALESCE(item_count, 1) AS item_count, sort_order
      FROM quest_reward_choice_items
      WHERE quest_id IN (${questIds.join(",")})
      ORDER BY quest_id, sort_order;
    `) : [];
    await primeGlobalItems(rewardRows.map((x) => x.item_id), locale);
    const rewardsByQuest = new Map();
    for (const reward of rewardRows) {
      const questId = Number(reward.quest_id);
      const list = rewardsByQuest.get(questId) || [];
      list.push([Number(reward.item_id), Number(reward.item_count || 1)]);
      rewardsByQuest.set(questId, list);
    }
    renderBrowseListview({
      template: "quest",
      id: "quests",
      data: rows.map((x) => {
        const category = questCategoryFromPath(x.path_json, 0);
        return {
          id: String(x.id),
          name: x.name,
          level: String(x.quest_level ?? ""),
          reqlevel: Number(x.required_level || 0),
          side: questSideValue(x.side_text),
          category: category.category,
          category2: category.category2,
          type: Number(x.quest_type || 0),
          itemchoices: rewardsByQuest.get(Number(x.id)) || undefined
        };
      }),
      sort: ["name"]
    }, browseBreadcrumb(questPathParts.length ? [0, 3, ...questPathParts] : [0, 3], "Quests", "?quests"));
    return;
  }
  if (listType === "spells") {
    const rawSpellPath = String(params.get("spells") || "").trim();
    const spellPath = /^-?\d+(?:\.-?\d+)*$/.test(rawSpellPath) ? rawSpellPath : "";
    const spellPathParts = parseBrowsePathParam(spellPath, 3);
    let spellBrowseTableExists = false;
    try {
      const tableRows = await execRows("SELECT name FROM sqlite_master WHERE type='table' AND name='spell_browse_entries';");
      spellBrowseTableExists = tableRows.length > 0;
    } catch (_) {
      spellBrowseTableExists = false;
    }
    if (spellBrowseTableExists && spellPath) {
      rows = await execRows(`
        SELECT sbe.spell_id AS id,
        CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name, sbe.name) ELSE COALESCE(s.name, sbe.name) END AS name,
        COALESCE(sbe.level, s.level, 0) AS level,
        COALESCE(sbe.school, s.school, 0) AS school,
        COALESCE(sbe.rank, st.rank_text, '') AS rank,
        sbe.skill_json, sbe.cat, sbe.chrclass, sbe.learnedat,
        sbe.colors_json, sbe.reagents_json, sbe.source_json,
        s.icon_name
        FROM spell_browse_entries sbe
        LEFT JOIN spells s ON s.spell_id=sbe.spell_id
        LEFT JOIN spell_tooltips st ON st.spell_id=sbe.spell_id
        LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=sbe.spell_id AND l.locale='zhCN'
        WHERE sbe.path=:path
        ORDER BY sbe.sort_order;
      `, { ":locale": locale, ":path": spellPath });
      await primeGlobalSpells(rows.map((x) => x.id), locale);
      await primeGlobalItems(rows.flatMap((x) => (parseJsonArray(x.reagents_json) || []).map((pair) => Array.isArray(pair) ? pair[0] : null)), locale);
      renderBrowseListview({
        template: "spell",
        id: "spells",
        data: rows.map((x) => ({
          id: String(x.id),
          name: x.name,
          level: Number(x.level || 0),
          school: Number(x.school || 0),
          rank: x.rank || "",
          skill: parseJsonArray(x.skill_json),
          cat: x.cat == null ? undefined : Number(x.cat),
          chrclass: x.chrclass == null ? undefined : Number(x.chrclass),
          learnedat: x.learnedat == null ? undefined : Number(x.learnedat),
          colors: parseJsonArray(x.colors_json),
          reagents: parseJsonArray(x.reagents_json),
          source: parseJsonArray(x.source_json)
        })),
        visibleCols: ["level"],
        hiddenCols: ["reagents", "school"],
        sort: ["skill", "name"]
      }, browseBreadcrumb([0, 1, ...spellPathParts], "Spells", "?spells"));
      return;
    }
    rows = await execRows(`
      SELECT s.spell_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END AS name,
      s.level, COALESCE(s.school, '') AS school, ep.path_json
      FROM spells s
      LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
      LEFT JOIN entity_paths ep ON ep.entity_type='spell' AND ep.entity_id=s.spell_id
      ORDER BY name COLLATE NOCASE
      LIMIT 50000;
    `, { ":locale": locale });
    if (spellPathParts.length) {
      rows = rows.filter((row) => entityPathMatches(row.path_json, spellPathParts, 2));
    }
    renderListTable(
      [t("list_name"), t("list_level"), t("list_school")],
      rows,
      (row) => [
        `<a href="?spell=${encodeURIComponent(String(row.id))}">${escapeHtml(row.name)}</a>`,
        escapeHtml(row.level ?? ""),
        escapeHtml(row.school ?? "")
      ],
      browseBreadcrumb(spellPathParts.length ? [0, 1, ...spellPathParts] : [0, 1], "Spells", "?spells")
    );
    return;
  }
  if (listType === "factions") {
    rows = await execRows(`
      SELECT f.faction_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, f.name) ELSE f.name END AS name,
      COALESCE(f.group_name, '') AS group_name,
      COALESCE(f.side, '') AS side
      FROM factions f
      LEFT JOIN entity_localizations l ON l.entity_type='faction' AND l.entity_id=f.faction_id AND l.locale='zhCN'
      ORDER BY name COLLATE NOCASE
      LIMIT 1000;
    `, { ":locale": locale });
    renderBrowseListview({
      template: "faction",
      id: "factions",
      data: rows.map((x) => ({
        id: String(x.id),
        name: x.name,
        group: x.group_name,
        side: factionSideValue(x.side)
      })),
      sort: ["name"]
    }, `<div class="path"><a href=".">${escapeHtml(pathLabel("Database"))}</a> &raquo; <a href="?factions">${escapeHtml(t("type_faction"))}</a></div>`);
  }
}

async function renderDetail(type, id) {
  const locale = state.lang === "zhCN" ? "zhCN" : "__none__";
  let rows = [];
  let relatedQuestRows = [];
  let listviewConfigs = [];
  let introHtml = "";
  let itemFacts = [];
  let itemFactMap = {};
  let questFacts = [];
  let questFactMap = {};
  let npcFacts = [];
  let npcFactMap = {};
  let spellFacts = [];
  let spellFactMap = {};
  let objectFacts = [];
  let objectFactMap = {};
  let mapperPoints = [];
  let rowStartEndCache = { start: null, end: null };
  let requirementRows = [];
  let seriesRows = [];
  let questObjectiveLine = "";
  let questObjectiveItems = [];
  let questRewardItems = [];
  let itemsetItems = [];
  let itemsetBonuses = [];
  let itemsetIntro = "";
  let pathLinks = [];
  try {
    const pathRows = await execRows(`
      SELECT path_json
      FROM entity_paths
      WHERE entity_type=:type AND entity_id=:id
      LIMIT 1;
    `, { ":type": type, ":id": id });
    if (pathRows.length && pathRows[0].path_json) {
      try {
        pathLinks = resolveMenuPath(JSON.parse(pathRows[0].path_json));
      } catch (err) {
        pathLinks = [];
      }
    }
  } catch (err) {
    pathLinks = [];
  }
  if (type === "quest") {
    rows = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side, q.zone_or_sort, q.wowhead_url,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.description, q.description) ELSE q.description END AS description,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.progress_text, q.progress_text) ELSE q.progress_text END AS progress_text,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.completion_text, q.completion_text) ELSE q.completion_text END AS completion_text,
      q.gains_text,
      qdb.description_html, qdb.progress_html, qdb.completion_html, qdb.gains_html
      FROM quests q
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      LEFT JOIN quest_detail_blocks qdb ON qdb.quest_id=q.quest_id
      WHERE q.quest_id=:id LIMIT 1;
    `, { ":id": id, ":locale": locale });
    const starters = await execRows(`
      SELECT starter_type, starter_id AS id,
      CASE
        WHEN starter_type='npc' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(ln.name, n.name) ELSE n.name END)
        WHEN starter_type='item' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(li.name, i.name) ELSE i.name END)
        WHEN starter_type='object' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(lo.name, o.name) ELSE o.name END)
        ELSE NULL
      END AS name
      FROM quest_starters qs
      LEFT JOIN npcs n ON qs.starter_type='npc' AND n.npc_id=qs.starter_id
      LEFT JOIN items i ON qs.starter_type='item' AND i.item_id=qs.starter_id
      LEFT JOIN objects o ON qs.starter_type='object' AND o.object_id=qs.starter_id
      LEFT JOIN entity_localizations ln ON ln.entity_type='npc' AND ln.entity_id=n.npc_id AND ln.locale='zhCN'
      LEFT JOIN entity_localizations li ON li.entity_type='item' AND li.entity_id=i.item_id AND li.locale='zhCN'
      LEFT JOIN entity_localizations lo ON lo.entity_type='object' AND lo.entity_id=o.object_id AND lo.locale='zhCN'
      WHERE qs.quest_id=:id
      ORDER BY starter_type, starter_id
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    const enders = await execRows(`
      SELECT n.npc_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name
      FROM quest_enders qe
      JOIN npcs n ON n.npc_id=qe.npc_id
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE qe.quest_id=:id
      ORDER BY name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    const requirements = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side
      FROM quest_requirements qr
      JOIN quests q ON q.quest_id=qr.required_quest_id
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE qr.quest_id=:id
      ORDER BY name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    requirementRows = requirements;
    const opens = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side
      FROM quest_opens qo
      JOIN quests q ON q.quest_id=qo.next_quest_id
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE qo.quest_id=:id
      ORDER BY name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    questFacts = await execRows(`
      SELECT fact_key, fact_value
      FROM quest_facts
      WHERE quest_id=:id
      ORDER BY fact_key COLLATE NOCASE
      LIMIT 80;
    `, { ":id": id });
    questFactMap = toFactMap(questFacts);
    const objectiveLineRows = await execRows(`
      SELECT objective_text
      FROM quest_objective_lines
      WHERE quest_id=:id
      LIMIT 1;
    `, { ":id": id });
    questObjectiveLine = String((objectiveLineRows[0] && objectiveLineRows[0].objective_text) || "").trim();
    const requiredItemsRows = await execRows(`
      SELECT qri.item_id AS id, qri.item_count AS count, qri.sort_order,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      i.icon_name
      FROM quest_required_items qri
      JOIN items i ON i.item_id=qri.item_id
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE qri.quest_id=:id
      ORDER BY qri.sort_order;
    `, { ":id": id, ":locale": locale });
    if (requiredItemsRows.length) {
      questObjectiveItems = requiredItemsRows.map((x) => ({
        id: x.id,
        name: x.name,
        icon_name: x.icon_name,
        count: x.count
      }));
    }
    const rewardChoiceRows = await execRows(`
      SELECT qri.item_id AS id, qri.item_count AS count, qri.sort_order,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      i.icon_name
      FROM quest_reward_choice_items qri
      JOIN items i ON i.item_id=qri.item_id
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE qri.quest_id=:id
      ORDER BY qri.sort_order;
    `, { ":id": id, ":locale": locale });
    if (rewardChoiceRows.length) {
      questRewardItems = rewardChoiceRows.map((x) => ({
        id: x.id,
        name: x.name,
        icon_name: x.icon_name,
        count: x.count
      }));
    }
    const payloadRows = await execRows(`
      SELECT outbound_links_json
      FROM entity_payloads
      WHERE entity_type='quest' AND entity_id=:id
      LIMIT 1;
    `, { ":id": id });
    if (payloadRows.length && payloadRows[0].outbound_links_json) {
      try {
        const links = JSON.parse(payloadRows[0].outbound_links_json);
        const itemIds = [];
        const linkedQuestIds = [];
        for (const link of links || []) {
          if (!Array.isArray(link) || !Number.isFinite(Number(link[1]))) continue;
          if (link[0] === "item") {
            itemIds.push(Number(link[1]));
          } else if (link[0] === "quest" && Number(link[1]) !== Number(id)) {
            linkedQuestIds.push(Number(link[1]));
          }
        }
        if (!requirementRows.length && linkedQuestIds.length) {
          const uniqQuestIds = [...new Set(linkedQuestIds)];
          const qPlaceholders = uniqQuestIds.map((_, idx) => `:qid${idx}`).join(",");
          const qParams = {};
          uniqQuestIds.forEach((questId, idx) => { qParams[`:qid${idx}`] = questId; });
          const linkedQuests = await execRows(`
            SELECT q.quest_id AS id,
            CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name
            FROM quests q
            LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
            WHERE q.quest_id IN (${qPlaceholders})
            ORDER BY q.quest_id;
          `, { ...qParams, ":locale": locale });
          const qById = new Map(linkedQuests.map((x) => [Number(x.id), x]));
          seriesRows = uniqQuestIds.map((qid) => qById.get(Number(qid))).filter(Boolean);
        }
        const uniqItemIds = [...new Set(itemIds)];
        if (uniqItemIds.length && (!questObjectiveItems.length || !questRewardItems.length)) {
          const placeholders = uniqItemIds.map((_, idx) => `:iid${idx}`).join(",");
          const paramMap = {};
          uniqItemIds.forEach((itemId, idx) => { paramMap[`:iid${idx}`] = itemId; });
          const linkedItems = await execRows(`
            SELECT i.item_id AS id,
            CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
            i.icon_name
            FROM items i
            LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
            WHERE i.item_id IN (${placeholders})
            ORDER BY i.item_id;
          `, { ...paramMap, ":locale": locale });
          if (linkedItems.length) {
            const byId = new Map(linkedItems.map((x) => [Number(x.id), x]));
            const ordered = uniqItemIds.map((iid) => byId.get(Number(iid))).filter(Boolean);
            if (!questObjectiveItems.length) {
              questObjectiveItems = ordered.slice(0, 1);
            }
            if (!questRewardItems.length) {
              questRewardItems = ordered.slice(1, 6);
            }
          }
        }
      } catch (_) {
        // Keep rendering even if payload JSON parse fails.
      }
    }

    const firstStarterNpc = starters.find((x) => x.starter_type === "npc" && x.name);
    const firstEndNpc = enders.find((x) => x.name);
    if (firstStarterNpc) {
      rowStartEndCache.start = firstStarterNpc;
    }
    if (firstEndNpc) {
      rowStartEndCache.end = firstEndNpc;
    }
    listviewConfigs = [];
  } else if (type === "spell") {
    let spellTooltipSelect = "'' AS tooltip_rank_text, '' AS tooltip_range_short_text, '' AS tooltip_cast_text, '' AS tooltip_description_text, '' AS tooltip_aura_text";
    let spellTooltipJoin = "";
    let spellNampowerSelect = "'' AS nampower_description, '' AS nampower_tooltip";
    let spellNampowerJoin = "";
    let spellNameSelect = "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, s.name) ELSE s.name END";
    let spellDescriptionSelect = "CASE WHEN :locale='zhCN' THEN COALESCE(l.description, s.description) ELSE s.description END";
    try {
      const spellTooltipTables = await execRows("SELECT name FROM sqlite_master WHERE type='table' AND name='spell_tooltips';");
      if (spellTooltipTables.length) {
        const spellTooltipCols = await execRows("PRAGMA table_info(spell_tooltips);");
        const spellTooltipColNames = new Set(spellTooltipCols.map((x) => String(x.name || "")));
        const auraSelect = spellTooltipColNames.has("aura_tooltip_text") ? "CASE WHEN :locale='zhCN' THEN st.aura_tooltip_text ELSE '' END" : "''";
        spellTooltipSelect = `st.rank_text AS tooltip_rank_text, st.range_short_text AS tooltip_range_short_text, st.cast_text AS tooltip_cast_text, CASE WHEN :locale='zhCN' THEN st.description_text ELSE s.description END AS tooltip_description_text, ${auraSelect} AS tooltip_aura_text`;
        spellTooltipJoin = "LEFT JOIN spell_tooltips st ON st.spell_id=s.spell_id";
      }
      const spellNampowerTables = await execRows("SELECT name FROM sqlite_master WHERE type='table' AND name='spell_nampower_records';");
      if (spellNampowerTables.length) {
        spellNampowerSelect = "npr.description AS nampower_description, npr.tooltip AS nampower_tooltip";
        spellNampowerJoin = "LEFT JOIN spell_nampower_records npr ON npr.spell_id=s.spell_id";
        spellNameSelect = "CASE WHEN :locale='zhCN' THEN COALESCE(l.name, npr.name, s.name) ELSE s.name END";
        spellDescriptionSelect = "CASE WHEN :locale='zhCN' THEN COALESCE(l.description, npr.description, s.description) ELSE s.description END";
      }
    } catch (_) {
      // Older cached databases may not have imported spell tooltip data yet.
    }
    rows = await execRows(`
      SELECT s.spell_id AS id,
      ${spellNameSelect} AS name,
      s.level, s.school, s.cost_text, s.range_text, s.cast_time_text, s.cooldown_text, s.icon_name, s.wowhead_url,
      s.description AS original_description,
      ${spellTooltipSelect},
      ${spellNampowerSelect},
      ${spellDescriptionSelect} AS description
      FROM spells s
      LEFT JOIN entity_localizations l ON l.entity_type='spell' AND l.entity_id=s.spell_id AND l.locale='zhCN'
      ${spellTooltipJoin}
      ${spellNampowerJoin}
      WHERE s.spell_id=:id LIMIT 1;
    `, { ":id": id, ":locale": locale });
    const creators = await execRows(`
      SELECT sc.source_type AS src_type, sc.source_id AS id,
      CASE
        WHEN sc.source_type='item' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(li.name, i.name) ELSE i.name END)
        WHEN sc.source_type='npc' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(ln.name, n.name) ELSE n.name END)
        WHEN sc.source_type='object' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(lo.name, o.name) ELSE o.name END)
        WHEN sc.source_type='quest' THEN (CASE WHEN :locale='zhCN' THEN COALESCE(lq.name, q.name) ELSE q.name END)
        ELSE NULL
      END AS name,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality_class
      FROM spell_created_by sc
      LEFT JOIN items i ON sc.source_type='item' AND i.item_id=sc.source_id
      LEFT JOIN npcs n ON sc.source_type='npc' AND n.npc_id=sc.source_id
      LEFT JOIN objects o ON sc.source_type='object' AND o.object_id=sc.source_id
      LEFT JOIN quests q ON sc.source_type='quest' AND q.quest_id=sc.source_id
      LEFT JOIN entity_localizations li ON li.entity_type='item' AND li.entity_id=i.item_id AND li.locale='zhCN'
      LEFT JOIN entity_localizations ln ON ln.entity_type='npc' AND ln.entity_id=n.npc_id AND ln.locale='zhCN'
      LEFT JOIN entity_localizations lo ON lo.entity_type='object' AND lo.entity_id=o.object_id AND lo.locale='zhCN'
      LEFT JOIN entity_localizations lq ON lq.entity_type='quest' AND lq.entity_id=q.quest_id AND lq.locale='zhCN'
      WHERE sc.spell_id=:id
      ORDER BY sc.source_type, sc.source_id
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    spellFacts = await execRows(`
      SELECT fact_key, fact_value
      FROM spell_facts
      WHERE spell_id=:id
      ORDER BY fact_key COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id });
    spellFactMap = toFactMap(spellFacts);
    listviewConfigs = [
      {
        template: "item",
        id: "created-by-item",
        name: t("detail"),
        data: mapItemRowsForListview(creators.filter((x) => x.src_type === "item" && x.name))
      },
      {
        template: "npc",
        id: "created-by-npc",
        name: t("relatedNpcs"),
        data: creators.filter((x) => x.src_type === "npc" && x.name).map((x) => ({ id: String(x.id), name: x.name }))
      }
    ];
  } else if (type === "item") {
    let tooltipExtraSelect = "'' AS tooltip_pre_html, '' AS tooltip_bonus_html, '' AS tooltip_effect_html";
    try {
      const tooltipCols = await execRows("PRAGMA table_info(item_tooltip_stats);");
      const tooltipColNames = new Set(tooltipCols.map((x) => String(x.name || "")));
      if (tooltipColNames.has("pre_html") && tooltipColNames.has("bonus_html") && tooltipColNames.has("effect_html")) {
        tooltipExtraSelect = "its.pre_html AS tooltip_pre_html, its.bonus_html AS tooltip_bonus_html, its.effect_html AS tooltip_effect_html";
      }
    } catch (_) {
      // Older cached databases may not have the expanded tooltip schema yet.
    }
    rows = await execRows(`
      SELECT i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      i.item_level, i.required_level, i.quality, i.slot, i.armor_type, i.wowhead_url, i.icon_name,
      its.slot_text AS tooltip_slot_text, its.type_text AS tooltip_type_text,
      its.damage_text AS tooltip_damage_text, its.speed_text AS tooltip_speed_text,
      its.dps_text AS tooltip_dps_text, its.durability_text AS tooltip_durability_text,
      ${tooltipExtraSelect},
      CASE i.quality
        WHEN 'Poor' THEN 0
        WHEN 'Common' THEN 1
        WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3
        WHEN 'Epic' THEN 4
        WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6
        ELSE 1
      END AS quality_class
      FROM items i
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      LEFT JOIN item_tooltip_stats its ON its.item_id=i.item_id
      WHERE i.item_id=:id LIMIT 1;
    `, { ":id": id, ":locale": locale });
    await hydrateItemEffectSpells(rows, locale, ["tooltip_effect_html"]);
    relatedQuestRows = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      1 AS is_start, 0 AS is_end
      FROM item_starts_quests iq
      JOIN quests q ON q.quest_id=iq.quest_id
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE iq.item_id=:id
      ORDER BY name COLLATE NOCASE
      LIMIT 100;
    `, { ":id": id, ":locale": locale });
    const droppedBy = await execRows(`
      SELECT n.npc_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
      nl.drop_percent
      FROM npc_loot_items nl
      JOIN npcs n ON n.npc_id=nl.npc_id
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE nl.item_id=:id
      ORDER BY nl.drop_percent DESC, name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    const containedByObjects = await execRows(`
      SELECT o.object_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END AS name,
      oc.drop_percent
      FROM object_contains_items oc
      JOIN objects o ON o.object_id=oc.object_id
      LEFT JOIN entity_localizations l ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      WHERE oc.item_id=:id
      ORDER BY oc.drop_percent DESC, name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    listviewConfigs = [
      {
        template: "quest",
        id: "starts-quest",
        name: LANG.tab_starts || t("relatedQuests"),
        data: mapQuestRowsForListview(relatedQuestRows)
      },
      {
        template: "npc",
        id: "dropped-by",
        name: state.lang === "zhCN" ? t("droppedBy") : (LANG.tab_droppedby || t("relatedNpcs")),
        data: droppedBy.map((x) => ({ id: String(x.id), name: x.name, percent: x.drop_percent }))
      },
      {
        template: "object",
        id: "contained-in-object",
        name: state.lang === "zhCN" ? t("containedInObject") : (LANG.tab_containedinobject || t("relatedObjects")),
        data: containedByObjects.map((x) => ({ id: String(x.id), name: x.name, percent: x.drop_percent }))
      }
    ];
    itemFacts = await execRows(`
      SELECT fact_key, fact_value
      FROM item_facts
      WHERE item_id=:id
      ORDER BY fact_key COLLATE NOCASE
      LIMIT 80;
    `, { ":id": id });
    itemFactMap = toFactMap(itemFacts);
  } else if (type === "itemset") {
    rows = await execRows(`
      SELECT s.itemset_id AS id, s.name, s.set_level, s.piece_count, s.wowhead_url
      FROM itemsets s
      WHERE s.itemset_id=:id
      LIMIT 1;
    `, { ":id": id });
    itemsetItems = await execRows(`
      SELECT si.sort_order,
      si.item_id AS id,
      COALESCE(
        CASE WHEN :locale='zhCN' THEN l.name ELSE NULL END,
        i.name,
        si.item_name
      ) AS name,
      COALESCE(i.icon_name, si.icon_name) AS icon_name,
      COALESCE(si.quality_class, 1) AS quality_class
      FROM itemset_items si
      LEFT JOIN items i ON i.item_id=si.item_id
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE si.itemset_id=:id
      ORDER BY si.sort_order
      LIMIT 40;
    `, { ":id": id, ":locale": locale });
    await primeGlobalItems(itemsetItems.map((x) => x.id), locale);
    itemsetBonuses = await execRows(`
      SELECT sort_order, pieces_required, spell_id, bonus_text
      FROM itemset_bonuses
      WHERE itemset_id=:id
      ORDER BY sort_order
      LIMIT 40;
    `, { ":id": id });
    const pieces = Number((rows[0] && rows[0].piece_count) || itemsetItems.length || 0);
    if (pieces > 0) {
      itemsetIntro = state.lang === "zhCN"
        ? `该套装包含以下 ${pieces} 件装备：`
        : `This ${pieces}-piece set includes the following items:`;
    }
  } else if (type === "npc") {
    rows = await execRows(`
      SELECT n.npc_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
      n.level_min, n.level_max, n.npc_class, n.faction_id, n.health, n.damage_min, n.damage_max, n.armor, n.model_image, n.wowhead_url,
      CASE WHEN :locale='zhCN' THEN COALESCE(lf.name, f.name) ELSE f.name END AS faction_name
      FROM npcs n
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      LEFT JOIN factions f ON f.faction_id=n.faction_id
      LEFT JOIN entity_localizations lf ON lf.entity_type='faction' AND lf.entity_id=f.faction_id AND lf.locale='zhCN'
      WHERE n.npc_id=:id LIMIT 1;
    `, { ":id": id, ":locale": locale });
    npcFacts = await execRows(`
      SELECT fact_key, fact_value
      FROM npc_facts
      WHERE npc_id=:id
      ORDER BY fact_key COLLATE NOCASE
      LIMIT 80;
    `, { ":id": id });
    npcFactMap = toFactMap(npcFacts);
    if (rows.length && npcFactMap.Faction) {
      const factionRows = await execRows(`
        SELECT faction_id
        FROM factions
        WHERE name=:name
        LIMIT 1;
      `, { ":name": npcFactMap.Faction });
      if (factionRows.length) rows[0].display_faction_id = factionRows[0].faction_id;
    }
    relatedQuestRows = await execRows(`
      WITH fq AS (
        SELECT qs.quest_id AS quest_id, 1 AS is_start, 0 AS is_end
        FROM quest_starters qs
        WHERE qs.starter_type='npc' AND qs.starter_id=:id
        UNION ALL
        SELECT qe.quest_id AS quest_id, 0 AS is_start, 1 AS is_end
        FROM quest_enders qe
        WHERE qe.npc_id=:id
      )
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side,
      MAX(fq.is_start) AS is_start,
      MAX(fq.is_end) AS is_end
      FROM fq
      JOIN quests q ON q.quest_id=fq.quest_id
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      GROUP BY q.quest_id
      ORDER BY name COLLATE NOCASE
      LIMIT 150;
    `, { ":id": id, ":locale": locale });
    const npcDrops = await execRows(`
      SELECT i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      nl.drop_percent,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality_class
      FROM npc_loot_items nl
      JOIN items i ON i.item_id=nl.item_id
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE nl.npc_id=:id
      ORDER BY nl.drop_percent DESC, name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    listviewConfigs = [
      {
        template: "quest",
        id: "starts-ends",
        name: t("relatedQuests"),
        data: mapQuestRowsForListview(relatedQuestRows)
      },
      {
        template: "item",
        id: "drops",
        name: state.lang === "zhCN" ? t("relatedItems") : (LANG.tab_drops || t("relatedItems")),
        data: mapItemRowsForListview(npcDrops.map((x) => ({ id: x.id, name: x.name, percent: x.drop_percent, quality_class: x.quality_class })))
      }
    ];
    mapperPoints = await execRows(`
      SELECT mp.zone_id,
      mp.x, mp.y,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, z.zone_name) ELSE z.zone_name END AS name
      FROM map_points mp
      LEFT JOIN zones z ON z.zone_id=mp.zone_id
      LEFT JOIN entity_localizations l ON l.entity_type='zone' AND l.entity_id=z.zone_id AND l.locale='zhCN'
      WHERE mp.entity_type='npc' AND mp.entity_id=:id
      ORDER BY name COLLATE NOCASE, mp.point_id
      LIMIT 20;
    `, { ":id": id, ":locale": locale });
    if (mapperPoints.length) {
      const links = mapperPoints
        .filter((x) => x.name)
        .reduce((acc, point) => {
          const key = `${point.zone_id}:${point.name}`;
          const existing = acc.get(key) || { zone_id: point.zone_id, name: point.name, count: 0 };
          existing.count += 1;
          acc.set(key, existing);
          return acc;
        }, new Map());
      const locationLinks = Array.from(links.values())
        .map((x) => `<a href="javascript:;">${escapeHtml(x.name)}</a>&nbsp;(${escapeHtml(String(x.count))})`)
        .join(", ");
      introHtml = state.lang === "zhCN"
        ? `该 NPC 可在 ${locationLinks} 找到。<br><div id="mapper-generic"></div><div class="clear"></div>`
        : `This NPC can be found in ${locationLinks}.<br><div id="mapper-generic"></div><div class="clear"></div>`;
    }
  } else if (type === "object") {
    rows = await execRows(`
      SELECT o.object_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, o.name) ELSE o.name END AS name,
      o.type_text, o.wowhead_url
      FROM objects o
      LEFT JOIN entity_localizations l ON l.entity_type='object' AND l.entity_id=o.object_id AND l.locale='zhCN'
      WHERE o.object_id=:id LIMIT 1;
    `, { ":id": id, ":locale": locale });
    relatedQuestRows = await execRows(`
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side,
      1 AS is_start, 0 AS is_end
      FROM quest_starters qs
      JOIN quests q ON q.quest_id=qs.quest_id
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      WHERE qs.starter_type='object' AND qs.starter_id=:id
      ORDER BY name COLLATE NOCASE
      LIMIT 100;
    `, { ":id": id, ":locale": locale });
    const objContains = await execRows(`
      SELECT i.item_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, i.name) ELSE i.name END AS name,
      oc.drop_percent,
      CASE i.quality
        WHEN 'Poor' THEN 0 WHEN 'Common' THEN 1 WHEN 'Uncommon' THEN 2
        WHEN 'Rare' THEN 3 WHEN 'Epic' THEN 4 WHEN 'Legendary' THEN 5
        WHEN 'Artifact' THEN 6 ELSE 1
      END AS quality_class
      FROM object_contains_items oc
      JOIN items i ON i.item_id=oc.item_id
      LEFT JOIN entity_localizations l ON l.entity_type='item' AND l.entity_id=i.item_id AND l.locale='zhCN'
      WHERE oc.object_id=:id
      ORDER BY oc.drop_percent DESC, name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    listviewConfigs = [
      {
        template: "quest",
        id: "starts",
        name: LANG.tab_starts || t("relatedQuests"),
        data: mapQuestRowsForListview(relatedQuestRows)
      },
      {
        template: "item",
        id: "contains-items",
        name: state.lang === "zhCN" ? t("contains") : (LANG.tab_contains || t("relatedItems")),
        data: mapItemRowsForListview(objContains.map((x) => ({ id: x.id, name: x.name, percent: x.drop_percent, quality_class: x.quality_class })))
      }
    ];
    objectFacts = await execRows(`
      SELECT fact_key, fact_value
      FROM object_facts
      WHERE object_id=:id
      ORDER BY fact_key COLLATE NOCASE
      LIMIT 80;
    `, { ":id": id });
    objectFactMap = toFactMap(objectFacts);
    mapperPoints = await execRows(`
      SELECT mp.zone_id,
      mp.x, mp.y,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, z.zone_name) ELSE z.zone_name END AS name
      FROM map_points mp
      LEFT JOIN zones z ON z.zone_id=mp.zone_id
      LEFT JOIN entity_localizations l ON l.entity_type='zone' AND l.entity_id=z.zone_id AND l.locale='zhCN'
      WHERE mp.entity_type='object' AND mp.entity_id=:id
      ORDER BY name COLLATE NOCASE, mp.point_id
      LIMIT 20;
    `, { ":id": id, ":locale": locale });
    if (mapperPoints.length) {
      const links = mapperPoints
        .filter((x) => x.name)
        .map((x) => `<a href="?objects=${encodeURIComponent(String(x.zone_id))}">${escapeHtml(x.name)}</a>`)
        .join(", ");
      introHtml = state.lang === "zhCN"
        ? `该物体可在 ${links} 找到。<br><div id="mapper-generic"></div><div class="clear"></div>`
        : `This object can be found in ${links}.<br><div id="mapper-generic"></div><div class="clear"></div>`;
    } else {
      introHtml = state.lang === "zhCN"
        ? `该物体可在 。<br><div id="mapper-generic" style="width:488px;height:325px;background:#000;border:3px solid #404040;position:relative"><b style="position:absolute;right:4px;bottom:4px">提示：点击地图缩放</b></div><div class="clear"></div>`
        : `This Object can be found in .<br><div id="mapper-generic" style="width:488px;height:325px;background:#000;border:3px solid #404040;position:relative"><b style="position:absolute;right:4px;bottom:4px">Tip: Click map to zoom</b></div><div class="clear"></div>`;
    }
  } else if (type === "faction") {
    rows = await execRows(`
      SELECT f.faction_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, f.name) ELSE f.name END AS name,
      f.group_name, f.side, f.wowhead_url,
      ft.intro_text, ft.history_text, ft.reputation_text
      FROM factions f
      LEFT JOIN entity_localizations l ON l.entity_type='faction' AND l.entity_id=f.faction_id AND l.locale='zhCN'
      LEFT JOIN faction_texts ft ON ft.faction_id=f.faction_id
      WHERE f.faction_id=:id LIMIT 1;
    `, { ":id": id, ":locale": locale });
    relatedQuestRows = await execRows(`
      WITH fq AS (
        SELECT qs.quest_id AS quest_id, 1 AS is_start, 0 AS is_end
        FROM quest_starters qs
        JOIN npcs n ON n.npc_id=qs.starter_id
        WHERE qs.starter_type='npc' AND n.faction_id=:id
        UNION ALL
        SELECT qe.quest_id AS quest_id, 0 AS is_start, 1 AS is_end
        FROM quest_enders qe
        JOIN npcs n ON n.npc_id=qe.npc_id
        WHERE n.faction_id=:id
      )
      SELECT q.quest_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, q.name) ELSE q.name END AS name,
      q.quest_level, q.required_level, q.side,
      MAX(fq.is_start) AS is_start,
      MAX(fq.is_end) AS is_end
      FROM fq
      JOIN quests q ON q.quest_id=fq.quest_id
      LEFT JOIN entity_localizations l ON l.entity_type='quest' AND l.entity_id=q.quest_id AND l.locale='zhCN'
      GROUP BY q.quest_id
      ORDER BY name COLLATE NOCASE
      LIMIT 200;
    `, { ":id": id, ":locale": locale });
    const factionNpcs = await execRows(`
      SELECT n.npc_id AS id,
      CASE WHEN :locale='zhCN' THEN COALESCE(l.name, n.name) ELSE n.name END AS name,
      n.level_min, n.level_max
      FROM npcs n
      LEFT JOIN entity_localizations l ON l.entity_type='npc' AND l.entity_id=n.npc_id AND l.locale='zhCN'
      WHERE n.faction_id=:id
      ORDER BY name COLLATE NOCASE
      LIMIT 120;
    `, { ":id": id, ":locale": locale });
    listviewConfigs = [
      {
        template: "quest",
        id: "related-quests",
        name: t("relatedQuests"),
        data: mapQuestRowsForListview(relatedQuestRows)
      },
      {
        template: "npc",
        id: "members",
        name: t("members"),
        data: factionNpcs.map((x) => ({ id: String(x.id), name: x.name, level: x.level_min }))
      }
    ];
  }

  const payloadConfigs = await payloadListviewConfigs(type, id, locale);
  if (payloadConfigs.length) {
    listviewConfigs = payloadConfigs;
  }

  if (!rows.length) {
    if (el.precontents) el.precontents.innerHTML = "";
    el.detail.innerHTML = "";
    resetRelatedListviews();
    setPageHeading("Turtle WoW Database");
    return;
  }

  const row = rows[0];
  const wowheadButton = row.wowhead_url
    ? `<a href="${escapeHtml(row.wowhead_url)}" target="_blank" class="button-red"><div><blockquote><i>Wowhead</i></blockquote><span>Wowhead</span></div></a>`
    : "";
  const inGameButton = `<a href="javascript:;" class="button-red" onclick="return false"><div><blockquote><i>${escapeHtml(t("inGameLink"))}</i></blockquote><span>${escapeHtml(t("inGameLink"))}</span></div></a>`;
  const extraItemFacts = type === "item"
    ? itemFacts
        .filter((x) => !["Level", "Required level", "Requires level", "Quality", "Slot", "Armor Type", "Buy for", "Sells for"].includes(String(x.fact_key || "").trim()))
        .slice(0, 12)
        .map((x) => ({ label: x.fact_key, value: x.fact_value }))
    : [];
  const levelText = row.level_min === row.level_max ? row.level_min : `${row.level_min ?? ""}-${row.level_max ?? ""}`;
  const reactRaw = String(npcFactMap.React || "").trim();
  const reactHtml = reactRaw
    ? reactRaw.split(/\s+/).filter(Boolean).map((x) => `<span class="q7">${escapeHtml(x)}</span>`).join(" ")
    : "";
  const npcDamageText = npcFactMap.Damage || ((row.damage_min != null || row.damage_max != null) ? (row.damage_min === row.damage_max ? row.damage_min : `${row.damage_min ?? ""}-${row.damage_max ?? ""}`) : "");
  const orderedSeries = requirementRows.length ? requirementRows : seriesRows;
  const questSeriesRows = (type === "quest" && orderedSeries.length)
    ? `<tr><th>Series</th></tr><tr><td><div class="infobox-spacer"></div><table class="series">${orderedSeries.map((x, i) => `<tr><th>${i + 1}.</th><td><div><a href="?quest=${encodeURIComponent(String(x.id))}">${escapeHtml(x.name)}</a></div></td></tr>`).join("")}<tr><th>${orderedSeries.length + 1}.</th><td><b>${escapeHtml(row.name)}</b></td></tr></table></td></tr>`
    : "";
  const infoboxTail = type === "npc"
    ? `${row.model_image ? `<div style="width:220px;height:220px;border:1px solid #404040;border-radius:5px;background:#111;overflow:hidden"><img width="220" height="220" src="${escapeHtml(row.model_image)}" alt="${escapeHtml(row.name)}"></div>` : ""}`
    : "";
  const infoboxEntries = type === "npc"
    ? [
        { label: "Level", value: npcFactMap.Level || levelText },
        { label: "Class", value: npcFactMap.Class || row.npc_class },
        { label: "React", value: reactHtml || null, html: !!reactHtml },
        { label: "Faction", value: (npcFactMap.Faction || row.faction_name) ? `<a href="?faction=${encodeURIComponent(String(row.display_faction_id || row.faction_id))}">${escapeHtml(npcFactMap.Faction || row.faction_name)}</a>` : null, html: !!(npcFactMap.Faction || row.faction_name) },
        { label: "Faction ID", value: npcFactMap["Faction ID"] || row.faction_id },
        { label: "Health", value: npcFactMap.Health || row.health },
        { label: "Mana", value: npcFactMap.Mana || null },
        { label: "Wealth", value: npcFactMap.Wealth || null },
        { label: "Damage", value: npcDamageText },
        { label: "Armor", value: npcFactMap.Armor || row.armor },
        { label: "Display ID", value: npcFactMap["Display ID"] },
        { label: "Equipment ID", value: npcFactMap["Equipment ID"] },
        { label: "NPC flags", value: npcFactMap["NPC flags"] }
      ]
    : type === "quest"
      ? [
          { label: "Level", value: questFactMap.Level || row.quest_level },
          { label: "Requires level", value: questFactMap["Requires level"] || row.required_level },
          { label: "Side", value: questFactionIconHtml(questFactMap.Side || row.side), html: true },
          { label: "Start", value: rowStartEndCache.start ? `<span class="alliance-icon"><a href="?npc=${encodeURIComponent(String(rowStartEndCache.start.id))}">${escapeHtml(rowStartEndCache.start.name)}</a></span>` : (questFactMap.Start || null), html: !!rowStartEndCache.start },
          { label: "End", value: rowStartEndCache.end ? `<span class="alliance-icon"><a href="?npc=${encodeURIComponent(String(rowStartEndCache.end.id))}">${escapeHtml(rowStartEndCache.end.name)}</a></span>` : (questFactMap.End || null), html: !!rowStartEndCache.end },
          { label: "Sharable", value: questFactMap.Sharable || null, noColon: true },
          { label: "Allowable Races", value: questFactMap["Allowable Races"] || null },
          { label: "Race Mask", value: questFactMap["Race Mask"] || null },
          { label: "Allowable Classes", value: questFactMap["Allowable Classes"] || null },
          { label: "Class Mask", value: questFactMap["Class Mask"] || null },
          { label: "Start Script", value: questFactMap["Start Script"] || null },
          { label: "Complete Script", value: questFactMap["Complete Script"] || null },
          { label: "RewMoneyMaxLevel", value: questFactMap.RewMoneyMaxLevel || null },
          { label: "ZoneOrSort", value: questFactMap.ZoneOrSort || row.zone_or_sort },
          { label: "RewXP", value: questFactMap.RewXP || null }
        ]
      : type === "faction"
        ? [
            { label: "Group", value: row.group_name || row.side || null },
            { label: "Side", value: row.side || null }
          ]
        : type === "item"
          ? [
              { label: "Level", value: itemFactMap.Level || row.item_level || null },
              { label: "Buy for", value: itemFactMap["Buy for"] ? formatMoneyHtml(itemFactMap["Buy for"]) : null, html: !!itemFactMap["Buy for"] },
              { label: "Sells for", value: itemFactMap["Sells for"] ? formatMoneyHtml(itemFactMap["Sells for"]) : null, html: !!itemFactMap["Sells for"] },
              { label: "Display ID", value: itemFactMap["Display ID"] || null },
              { label: "Disenchant ID", value: itemFactMap["Disenchant ID"] || null },
              { label: "Allowable Races", value: itemFactMap["Allowable Races"] || null },
              { label: "Race Mask", value: itemFactMap["Race Mask"] || null },
              { label: "Allowable Classes", value: itemFactMap["Allowable Classes"] || null },
              { label: "Class Mask", value: itemFactMap["Class Mask"] || null },
              { label: "Script Name", value: "&nbsp;", html: true }
            ]
        : type === "spell"
          ? [
              { label: "Level", value: spellFactMap.Level || row.level || null }
            ]
        : type === "object"
          ? [
              { label: "DisplayId", value: objectFactMap.DisplayId || null }
            ]
        : type === "itemset"
          ? [
              { label: "Level", value: row.set_level || null }
            ]
        : [
          { label: t("entityId"), value: row.id },
          { label: "Item Level", value: row.item_level },
          { label: "Required Level", value: row.required_level },
          { label: "Quality", value: row.quality },
          { label: "Slot", value: row.slot },
          { label: "Armor Type", value: row.armor_type },
          { label: "Level", value: row.level },
          { label: "Type", value: row.type_text },
          { label: "Quest Level", value: row.quest_level },
          { label: "Side", value: row.side },
          { label: "School", value: row.school },
          { label: "Cost", value: row.cost_text },
          { label: "Range", value: row.range_text },
          { label: "Cast Time", value: row.cast_time_text },
          { label: "Cooldown", value: row.cooldown_text },
          { label: "Group", value: row.group_name },
          ...(type === "item" && itemFactMap["Buy for"] ? [{ label: "Buy for", value: formatMoneyHtml(itemFactMap["Buy for"]), html: true }] : []),
          ...(type === "item" && itemFactMap["Sells for"] ? [{ label: "Sells for", value: formatMoneyHtml(itemFactMap["Sells for"]), html: true }] : []),
          ...extraItemFacts
        ];
  const infobox = renderInfobox(infoboxEntries, infoboxTail, questSeriesRows);
  const itemTooltipBlock = type === "item" ? renderItemTooltipBlock(row, itemFactMap) : "";
  const spellTooltipBlock = type === "spell" ? renderSpellTooltipBlock(row) : "";
  const questStarterName = rowStartEndCache.start ? rowStartEndCache.start.name : "";
  const questIntroLine = type === "quest"
    ? (questObjectiveLine || ((questObjectiveItems.length && questStarterName)
      ? `${state.lang === "zhCN" ? "将" : "Bring "}${questObjectiveItems[0].name}${state.lang === "zhCN" ? "交给" : " to "}${questStarterName}${state.lang === "zhCN" ? "。" : "."}`
      : ""))
    : "";
  const questObjectiveHtml = type === "quest" && questObjectiveItems.length
    ? `<table class="iconlist">${questObjectiveItems.map((x) => {
      const countText = Number(x.count) > 0 ? ` (${escapeHtml(String(x.count))})` : "";
      const iconIndex = questObjectiveItems.indexOf(x);
      return `<tr><th align="right" id="quest-objective-icon${escapeHtml(String(iconIndex))}"></th><td><span class="q1"><a href="?item=${encodeURIComponent(String(x.id))}">${escapeHtml(x.name)}</a></span>${countText}</td></tr>`;
    }).join("")}</table>`
    : "";
  const questRewardHtml = type === "quest" && questRewardItems.length
    ? `<h3>${escapeHtml(t("reward"))}</h3><div class="block-text">${escapeHtml((state.lang === "zhCN") ? "你可以选择以下奖励之一：" : "You can choose one of these awards:")}</div><div class="pad"></div><table class="icontab"><tr>${questRewardItems.map((x) => {
      const iconIndex = questRewardItems.indexOf(x);
      return `<th id="quest-reward-icon${escapeHtml(String(iconIndex))}"></th><td><span class="q1"><a href="?item=${encodeURIComponent(String(x.id))}">${escapeHtml(x.name)}</a></span></td>`;
    }).join("")}</tr></table>`
    : "";
  const itemsetListHtml = type === "itemset" && itemsetItems.length
    ? `${escapeHtml(itemsetIntro || (state.lang === "zhCN" ? `该套装包含以下 ${itemsetItems.length} 件装备：` : `This ${itemsetItems.length}-piece set includes the following items:`))}
      <table class="iconlist">${itemsetItems.map((x, i) => {
      const iconIndex = i + 1;
      return `<tr><th align="right" id="iconlist-icon${escapeHtml(String(iconIndex))}"></th><td><span class="q${escapeHtml(String(x.quality_class || 1))}"><a href="?item=${encodeURIComponent(String(x.id))}">${escapeHtml(x.name)}</a></span></td></tr>`;
    }).join("")}</table>`
    : "";
  const itemsetBonusesHtml = type === "itemset" && itemsetBonuses.length
    ? `<h3>${escapeHtml(t("setBonuses"))}</h3><div class="block-text">${escapeHtml(state.lang === "zhCN" ? "装备更多套装部件将获得额外效果。" : "Wearing more pieces of this set will convey bonuses to your character.")}</div><ul>${itemsetBonuses.map((x) => `<li><div>${escapeHtml(String(x.pieces_required || ""))}${state.lang === "zhCN" ? " 件：" : " pieces: "}${x.spell_id ? `<a href="?spell=${encodeURIComponent(String(x.spell_id))}">${escapeHtml(x.bonus_text || "")}</a>` : escapeHtml(x.bonus_text || "")}</div></li>`).join("")}</ul>`
    : "";
  const spellDetailsHtml = type === "spell"
    ? `<h3>${escapeHtml(t("spellDetails"))}</h3><table class="grid" id="spelldetails"><colgroup><col width="12%"><col width="38%"><col width="12%"><col width="38%"></colgroup><tbody><tr><th>${escapeHtml(uiLabel("Cost"))}</th><td>${spellFactValueHtml(spellFactMap["detail:cost"] || row.cost_text || "")}</td><th>${escapeHtml(uiLabel("Duration"))}</th><td>${spellFactValueHtml(spellFactMap["detail:duration"] || "")}</td></tr><tr><th>${escapeHtml(uiLabel("Range"))}</th><td>${spellFactValueHtml(spellFactMap["detail:range"] || row.range_text || "")}</td><th>${escapeHtml(uiLabel("School"))}</th><td>${spellFactValueHtml(spellFactMap["detail:school"] || row.school || "")}</td></tr><tr><th>${escapeHtml(uiLabel("Cast Time"))}</th><td>${spellFactValueHtml(spellFactMap["detail:cast_time"] || row.cast_time_text || "")}</td><th>${escapeHtml(uiLabel("Mechanic"))}</th><td>${spellFactValueHtml(spellFactMap["detail:mechanic"] || "")}</td></tr><tr><th>${escapeHtml(uiLabel("Cooldown"))}</th><td>${spellFactValueHtml(spellFactMap["detail:cooldown"] || row.cooldown_text || "")}</td><th>${escapeHtml(uiLabel("Dispel type"))}</th><td>${spellFactValueHtml(spellFactMap["detail:dispel_type"] || "")}</td></tr><tr><th>${escapeHtml(uiLabel("Category Cooldown"))}</th><td colspan="3">${spellFactValueHtml(spellFactMap["detail:category_cooldown"] || "")}</td></tr><tr><th>${escapeHtml(uiLabel("Effect #1"))}</th><td colspan="3" style="line-height: 17px">${spellEffectHtml(spellFactMap["detail:effect_#1"] || "")}</td></tr><tr><th>${escapeHtml(uiLabel("Effect #2"))}</th><td colspan="3" style="line-height: 17px">${spellEffectHtml(spellFactMap["detail:effect_#2"] || "")}</td></tr></tbody></table>`
    : "";
  const factionContentHtml = type === "faction"
    ? `${row.intro_text ? `<div class="block-text">${escapeHtml(row.intro_text)}</div>` : ""}${row.history_text ? `<h3>${escapeHtml(t("history"))}</h3><div class="block-text">${escapeHtml(row.history_text)}</div>` : ""}${row.reputation_text ? `<h3>${escapeHtml(t("reputation"))}</h3><div class="block-text">${escapeHtml(row.reputation_text)}</div>` : ""}`
    : "";
  const questDescriptionBlock = type === "quest" && row.description
    ? `<h3>${escapeHtml(t("description"))}</h3><div class="block-text">${state.lang !== "zhCN" && row.description_html ? row.description_html : localizedTextHtml(row.description)}</div>`
    : "";
  const questProgressBlock = type === "quest" && row.progress_text
    ? `<h3>${escapeHtml(t("progress"))}</h3><div class="block-text">${state.lang !== "zhCN" && row.progress_html ? row.progress_html : localizedTextHtml(row.progress_text)}</div>`
    : "";
  const questCompletionBlock = type === "quest" && row.completion_text
    ? `<h3>${escapeHtml(t("completion"))}</h3><div class="block-text">${state.lang !== "zhCN" && row.completion_html ? row.completion_html : localizedTextHtml(row.completion_text)}</div>`
    : "";
  const questGainsBlock = type === "quest" && (row.gains_html || row.gains_text)
    ? `<h3>${escapeHtml(t("gains"))}</h3><div class="block-text">${state.lang !== "zhCN" && row.gains_html ? row.gains_html : localizedTextHtml(row.gains_text || "")}</div>`
    : "";
  const breadcrumb = pathLinks.length
    ? renderBreadcrumbFromLinks(pathLinks)
    : (type === "item"
      ? `<div class="path"><a href=".">${escapeHtml(pathLabel("Database"))}</a> &raquo; ${itemBreadcrumbLinks(row).map((x) => `<a href="${x.href}">${escapeHtml(pathLabel(x.label, x.href))}</a>`).join(" &raquo; ")}</div>`
      : type === "itemset"
        ? `<div class="path"><a href=".">${escapeHtml(pathLabel("Database"))}</a> &raquo; <a href="?itemsets">${escapeHtml(t("type_itemset"))}</a></div>`
        : `<div class="path"><a href=".">${escapeHtml(pathLabel("Database"))}</a> &raquo; <a href="?${typePlural(type)}">${escapeHtml(pathLabel(titleCasePlural(type)))}</a></div>`);
  if (el.precontents) el.precontents.innerHTML = breadcrumb;
  setPageHeading(`${row.name} - Turtle WoW Database`);
  el.detail.innerHTML = `
    ${infobox}
    <div class="text detail-page">
      ${type === "item" && row.wowhead_url ? `<a onclick="if(window.g_getIngameLink){g_getIngameLink('${itemQualityColor(row.quality_class)}','${escapeJsSingle(String(row.id))}','${escapeJsSingle(row.name)}');}return false;" class="button-red"><div><blockquote><i>${escapeHtml(t("inGameLink"))}</i></blockquote><span>${escapeHtml(t("inGameLink"))}</span></div></a>` : ""}${wowheadButton}
      <h1>${escapeHtml(row.name)}</h1>
      ${itemTooltipBlock}
      ${spellTooltipBlock}
      ${questIntroLine ? `<div class="block-text">${escapeHtml(questIntroLine)}</div>` : ""}
      ${introHtml ? `${introHtml}<br>` : ""}
      ${factionContentHtml}
      ${itemsetListHtml}
      ${type === "quest" && questObjectiveHtml ? `${questObjectiveHtml}` : ""}
      ${type === "quest" ? questDescriptionBlock : (row.description && type !== "spell" ? `<h3>${escapeHtml(t("detail"))}</h3><div class="block-text">${escapeHtml(row.description)}</div>` : "")}
      ${spellDetailsHtml}
      ${questRewardHtml}
      ${itemsetBonusesHtml}
      ${questProgressBlock}
      ${questCompletionBlock}
      ${questGainsBlock}
      <h2>${escapeHtml(t("seeAlso"))}</h2>
    </div>
  `;
  if (!listviewConfigs.length && relatedQuestRows.length) {
    listviewConfigs = [{
      template: "quest",
      id: "related-quests",
      name: t("relatedQuests"),
      data: mapQuestRowsForListview(relatedQuestRows)
    }];
  }
  renderRelatedListviews(listviewConfigs.filter((x) => x.data && x.data.length));
  setWowheadPageInfo(type, row);
  if (type === "item") initItemVisuals(row);
  if (type === "spell") initSpellVisuals(row);
  if (type === "quest") initQuestVisuals(questObjectiveItems, questRewardItems);
  if (type === "itemset") initItemsetVisuals(itemsetItems);
  if (type === "npc" || type === "object") initMapper(mapperPoints);
}

async function performLiveSearch() {
  const queryText = (el.input.value || "").trim();
  if (queryText.length < 3) {
    el.results.innerHTML = "";
    resetRelatedListviews();
    return;
  }
  try {
    setStatus(t("statusSearching"));
    const rows = await querySuggestions(queryText);
    renderSuggestions(rows);
    if (el.precontents) el.precontents.innerHTML = "";
    el.detail.innerHTML = "";
    resetRelatedListviews();
    setStatus(t("statusReady"));
  } catch (err) {
    setStatus(`${t("statusError")}: ${String(err.message || err)}`, true);
  }
}

function bindEvents() {
  el.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const q = (el.input.value || "").trim();
    const url = new URL(window.location.href);
    ["item", "itemset", "npc", "object", "quest", "spell", "faction", "items", "itemsets", "npcs", "objects", "quests", "spells", "factions", "filter"].forEach((k) => url.searchParams.delete(k));
    if (q) {
      url.searchParams.set("search", q);
    } else {
      url.searchParams.delete("search");
    }
    window.history.pushState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
    await routePage();
  });
  el.input.addEventListener("input", () => {
    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      performLiveSearch();
    }, 180);
  });
  el.detail.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-home-browse-group]");
    if (!trigger) return;
    event.preventDefault();
    const group = trigger.getAttribute("data-home-browse-group") || "";
    document.querySelectorAll("[data-home-browse-group]").forEach((node) => {
      node.classList.toggle("active", node === trigger);
    });
    document.querySelectorAll("[data-home-browse-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.getAttribute("data-home-browse-panel") === group);
    });
  });
  el.langEn.addEventListener("click", async () => {
    state.lang = "enUS";
    localStorage.setItem("turtle-db-lang", state.lang);
    updateLangButtons();
    await routePage();
  });
  el.langZh.addEventListener("click", async () => {
    state.lang = "zhCN";
    localStorage.setItem("turtle-db-lang", state.lang);
    updateLangButtons();
    await routePage();
  });
  window.addEventListener("popstate", () => {
    routePage();
  });
}

async function routePage() {
  const params = new URLSearchParams(window.location.search);
  for (const listType of ["items", "itemsets", "npcs", "objects", "quests", "spells", "factions"]) {
    if (params.has(listType)) {
      el.results.innerHTML = "";
      resetRelatedListviews();
      await renderBrowseList(listType, params);
      setPageHeading(`${listTypeLabel(listType)} - Turtle WoW Database`);
      setHomeMode(false);
      return;
    }
  }

  for (const type of ["item", "itemset", "npc", "object", "quest", "spell", "faction"]) {
    const v = params.get(type);
    if (v && /^\d+$/.test(v)) {
      el.results.innerHTML = "";
      try {
        await renderDetail(type, Number(v));
      } catch (err) {
        const msg = String((err && err.message) || err || "Unknown detail render error");
        setStatus(`${t("statusError")}: ${msg}`, true);
        if (el.precontents) el.precontents.innerHTML = "";
        el.detail.innerHTML = `<div class="meta">${escapeHtml(msg)}</div>`;
        resetRelatedListviews();
      }
      setHomeMode(false);
      return;
    }
  }

  const q = (params.get("search") || "").trim();
  if (q) {
    el.input.value = q;
    setPageHeading(`${state.lang === "zhCN" ? "搜索" : "Search"}: ${q} - Turtle WoW Database`);
    await renderSearchResultsPage(q);
    setHomeMode(false);
    return;
  }
  el.results.innerHTML = "";
  if (el.precontents) el.precontents.innerHTML = "";
  resetRelatedListviews();
  setPageHeading("Turtle WoW Database");
  setHomeMode(true);
  renderHomeBrowse();
}

async function bootstrap() {
  updateLangButtons();
  bindEvents();
  setStatus(t("statusReady"));
  await routePage();
}

bootstrap();
