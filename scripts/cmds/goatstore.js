const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_BASE = "https://mirai-store.vercel.app";
const userSeenNoti = new Map();
const AUTOSYNC_CACHE_PATH = path.join(process.cwd(), "goatstore_sync_cache.json");
const DIR_CACHE_PATH = path.join(process.cwd(), "goatstore_dircache.json");

let _updateCheckCache = null;
const UPDATE_CHECK_INTERVAL = 1000 * 60 * 30;

// --- Pagination edit-limit ------------------------------------------------
const MAX_EDITS_PER_MESSAGE = 5;

// --- Prefix detection ---------------------------------------------------
function getPrefix(threadData) {
  try {
    if (threadData?.data?.prefix) return threadData.data.prefix;
    if (global.GoatBot?.config?.prefix) return global.GoatBot.config.prefix;
  } catch (_) {}
  return "!";
}

function loadSyncCache() {
  try { return JSON.parse(fs.readFileSync(AUTOSYNC_CACHE_PATH, "utf8")); }
  catch { return {}; }
}

function saveSyncCache(cache) {
  try { fs.writeFileSync(AUTOSYNC_CACHE_PATH, JSON.stringify(cache, null, 2)); }
  catch (_) {}
}

// --- Autoupdate: always on, fully silent in the background ---------------
let _autoupdateInFlight = false;

function hashContent(content) {
  let h = 0;
  for (let i = 0; i < content.length; i++) h = (h * 31 + content.charCodeAt(i)) | 0;
  return h.toString(16);
}

// --- Shared version comparison -------------------------------------------
function parseVer(v) {
  return String(v).split(".").map(n => parseInt(n) || 0);
}

function cmpVer(a, b) {
  const pa = parseVer(a), pb = parseVer(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
}

// Scope config-field extraction to the actual config block (brace-depth
// matched) — same approach as the backend's extractConfigBlock, so signals
// aren't picked up from comments or unrelated objects elsewhere in the file.
function extractConfigBlock(src) {
  const idx = src.search(/\bconfig\s*[:=]\s*\{/);
  if (idx === -1) return src;
  const braceStart = src.indexOf("{", idx);
  if (braceStart === -1) return src;
  let depth = 0;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(braceStart, i + 1);
    }
  }
  return src.slice(braceStart);
}

function detectFramework(code) {
  const configBlock = extractConfigBlock(code);

  // Mirai — credits + hasPermission in config (matching the common
  // "hasPermssion" typo as the backend does).
  const hasCredits    = /\bcredits\s*:/.test(configBlock);
  const hasPermission = /\bhasPerm(?:i)?ssion\s*[:(]/i.test(configBlock);
  if (hasCredits && hasPermission) return "mirai";

  // GoatBot — author + role in config.
  const hasAuthor = /\bauthor\s*:/.test(configBlock);
  const hasRole   = /\brole\s*:/.test(configBlock);
  if (hasAuthor && hasRole) return "goat";

  // Export-shape fallbacks.
  const isGoatStructure =
    /module\.exports\s*=\s*\{/.test(code) &&
    /onStart\s*[:(]|onChat\s*[:(]|onLoad\s*[:(]/.test(code);
  if (isGoatStructure) return "goat";

  const isMiraiStructure =
    /module\.exports\.config\s*=/.test(code) ||
    /module\.exports\.run\s*=/.test(code);
  if (isMiraiStructure) return "mirai";

  // No confident signal → "other" instead of the old blind "mirai" default.
  return "other";
}


// --- Auto-detect commands/events folders -----------------------------
// goatstore.js itself is a command file, so it always lives INSIDE the
// real commands folder alongside every other command — no need to guess
// paths from cwd for that. __dirname IS the commands dir.
// For the events dir, we look for a sibling folder (same parent as cmds)
// whose name matches known event-folder patterns, since bots almost always
// keep cmds/events side by side.
const EVENTS_NAME_PATTERNS = ["events", "event"];
const SCAN_SKIP_DIRS = new Set(["node_modules", ".git", ".cache", ".github", "dist", "build"]);

function loadDirCache() {
  try { return JSON.parse(fs.readFileSync(DIR_CACHE_PATH, "utf8")); }
  catch { return {}; }
}

function saveDirCache(cache) {
  try { fs.writeFileSync(DIR_CACHE_PATH, JSON.stringify(cache, null, 2)); }
  catch (_) {}
}

let _dirCache = loadDirCache();

// Bounded breadth-first scan for a folder whose name matches one of the
// given patterns, starting from `startDir` (used to find the events folder
// as a sibling/nearby folder relative to where goatstore.js itself lives).
function scanForDir(startDir, namePatterns, maxDepth = 2) {
  const queue = [{ dir: startDir, depth: 0 }];
  while (queue.length) {
    const { dir, depth } = queue.shift();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { continue; }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      if (SCAN_SKIP_DIRS.has(ent.name)) continue;
      if (ent.name.startsWith(".")) continue;
      const lower = ent.name.toLowerCase();
      const full = path.join(dir, ent.name);
      if (namePatterns.includes(lower)) return full;
      if (depth < maxDepth) queue.push({ dir: full, depth: depth + 1 });
    }
  }
  return null;
}

function getCmdsDir(forceRescan = false) {
  if (!forceRescan && _dirCache.cmdsDir && fs.existsSync(_dirCache.cmdsDir)) return _dirCache.cmdsDir;
  // goatstore.js's own folder — it's a command file sitting right next to
  // every other command, so this is always correct without guessing.
  const dir = __dirname;
  _dirCache.cmdsDir = dir;
  saveDirCache(_dirCache);
  return dir;
}

function getEventsDir(forceRescan = false) {
  if (!forceRescan && _dirCache.eventsDir && fs.existsSync(_dirCache.eventsDir)) return _dirCache.eventsDir;
  const cmdsDir = getCmdsDir(forceRescan);
  const parent = path.dirname(cmdsDir);
  // Scan roots in priority order: the cmds folder's parent (events is almost
  // always a sibling of cmds), one level higher, then the bot's cwd — the
  // wider roots catch layouts like <root>/scripts/cmds with <root>/events,
  // which a parent-only scan can never find.
  const roots = [...new Set([parent, path.dirname(parent), process.cwd()])];
  let dir = null;
  for (const root of roots) {
    dir = scanForDir(root, EVENTS_NAME_PATTERNS, 3);
    if (dir) break;
  }
  if (!dir) dir = path.join(parent, "events");
  _dirCache.eventsDir = dir;
  saveDirCache(_dirCache);
  return dir;
}

// Locate a file by name — commands look in the cmds dir first, then the
// events dir (users mix them up); events only look in the events dir.
// Returns the searched dirs too, so "not found" errors can say exactly
// where we looked.
function findLocalFile(fileName, kind) {
  const dirs = kind === "event" ? [getEventsDir()] : [getCmdsDir(), getEventsDir()];
  for (const dir of dirs) {
    const direct = path.join(dir, fileName);
    if (fs.existsSync(direct)) return { filePath: direct, dirs };
    const withExt = direct.endsWith(".js") ? null : direct + ".js";
    if (withExt && fs.existsSync(withExt)) return { filePath: withExt, dirs };
  }
  return { filePath: null, dirs };
}

function relDir(p) {
  const rel = path.relative(process.cwd(), p);
  return rel || ".";
}

function fileNotFoundMsg(fileName, dirs, prefix) {
  return (
    `❌ File not found: "${fileName}"\nSearched in:\n` +
    dirs.map(d => `• ${relDir(d)}`).join("\n") +
    `\n💡 Wrong location? Check with: ${prefix}gs dirs`
  );
}

async function checkSelfUpdate() {
  const now = Date.now();
  if (_updateCheckCache && (now - _updateCheckCache.checkedAt) < UPDATE_CHECK_INTERVAL)
    return _updateCheckCache.result;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=goatstore&limit=10&framework=goat&kind=command`);
    const cmds = Array.isArray(res.data?.commands) ? res.data.commands : [];
    const match =
      cmds.find(c => c.name?.toLowerCase() === "goatstore" && c.author === module.exports.config.author) ||
      cmds.find(c => c.name?.toLowerCase() === "goatstore");
    if (!match) { _updateCheckCache = { checkedAt: now, result: null }; return null; }
    const current = module.exports.config.version;
    const latest = match.version || "N/A";
    const result = {
      hasUpdate: cmpVer(latest, current) > 0,
      currentVersion: current,
      latestVersion: latest,
      latestId: match.id,
      description: match.description || match.changelog || ""
    };
    _updateCheckCache = { checkedAt: now, result };
    return result;
  } catch (_) { return null; }
}

async function getTodayUpdates() {
  try {
    const res = await axios.get(`${API_BASE}/miraistore/list?limit=50&framework=goat`);
    const today = new Date().toDateString();
    return (res.data.commands || [])
      .filter(cmd => new Date(cmd.uploadDate).toDateString() === today);
  } catch (_) { return []; }
}

// Global trending — every framework (Goat, Mirai, Other), each row
// carries a type badge so the reader can tell which is which. Some
// backends answer with a bare array, others wrap it in { commands }.
async function getTrending(limit = 5) {
  const parse = d => Array.isArray(d) ? d : (Array.isArray(d?.commands) ? d.commands : null);
  try {
    const res = await axios.get(`${API_BASE}/miraistore/trending?limit=${limit}`);
    const list = parse(res.data);
    if (list) return list.slice(0, limit);
  } catch (_) {}
  return null;
}

async function runAutoSync() {
  const folders = [
    { dir: getCmdsDir(), kind: "command" },
    { dir: getEventsDir(), kind: "event" }
  ].filter(f => fs.existsSync(f.dir));

  if (!folders.length) return;

  const cache = loadSyncCache();

  for (const { dir, kind } of folders) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const cacheKey = `${kind}:${file}`;
      let content;
      try { content = fs.readFileSync(fullPath, "utf8"); } catch (_) { continue; }

      const hash = hashContent(content);
      if (cache[cacheKey] === hash) continue;

      try { new Function(content); } catch (_) { continue; }
      const fw = detectFramework(content);
      if (fw !== "goat") {
        console.log(`[goatstore-sync] Skipped ${file}: detected as "${fw}" (only GoatBot files are synced).`);
        continue;
      }

      try {
        const author = content.match(/author\s*:\s*["'`](.*?)["'`]/)?.[1]
                    || content.match(/credits\s*:\s*["'`](.*?)["'`]/)?.[1]
                    || "Unknown";
        const category = content.match(/category\s*:\s*["'`](.*?)["'`]/)?.[1] || "Uncategorized";
        const res = await axios.post(`${API_BASE}/miraistore/upload`, { rawCode: content, framework: "goat", kind, author, category });
        if (res.data?.error) {
          console.error(`[goatstore-sync] Upload skipped for ${file}: ${res.data.message || res.data.error}`);
        } else if (res.data?.updated) {
          console.log(`[goatstore-sync] ${file}: updated existing entry (ID: ${res.data.id}) to v${res.data.version}.`);
          cache[cacheKey] = hash;
        } else {
          console.log(`[goatstore-sync] ${file}: uploaded as new entry (ID: ${res.data.id}).`);
          cache[cacheKey] = hash;
        }
      } catch (err) {
        console.error(`[goatstore-sync] Upload request fail for ${file}:`, err.response?.data?.error || err.message);
      }

      await new Promise(r => setTimeout(r, 500));
    }
  }

  saveSyncCache(cache);
}

const buildBar = pct => "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));
const frames = ["◖", "◕", "◔", "◓", "◒", "◑", "◐"];

async function animateInstall(api, threadID, name) {
  const steps = [
    { label: "Downloading source",  pct: 30,  delay: 600 },
    { label: "Verifying integrity", pct: 60,  delay: 900 },
    { label: "Writing to disk",     pct: 85,  delay: 700 },
    { label: "Registering command", pct: 100, delay: 600 }
  ];
  const info = await api.sendMessage(`📦 Installing ${name}...\n\n◖ Fetching package info...\n[░░░░░░░░░░] 0%`, threadID);
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, steps[i].delay));
    await api.editMessage(`📦 Installing ${name}...\n\n${frames[i]} ${steps[i].label}...\n[${buildBar(steps[i].pct)}] ${steps[i].pct}%`, info.messageID);
  }
  return info.messageID;
}

async function animateUpload(api, threadID, name) {
  const steps = [
    { label: "Reading file",         pct: 30,  delay: 500 },
    { label: "Uploading directly",   pct: 70,  delay: 900 },
    { label: "Finalizing registration", pct: 100, delay: 500 }
  ];
  const info = await api.sendMessage(`📤 Uploading ${name}...\n\n◖ Preparing upload...\n[░░░░░░░░░░] 0%`, threadID);
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, steps[i].delay));
    await api.editMessage(`📤 Uploading ${name}...\n\n${frames[i]} ${steps[i].label}...\n[${buildBar(steps[i].pct)}] ${steps[i].pct}%`, info.messageID);
  }
  return info.messageID;
}

function autoloadCommand(filePath) {
  try {
    delete require.cache[require.resolve(filePath)];
    const cmd = require(filePath);
    if (cmd?.config?.name) {
      const name = cmd.config.name.toLowerCase();
      global.GoatBot.commands.set(name, cmd);
      if (Array.isArray(cmd.config.aliases))
        cmd.config.aliases.forEach(a => global.GoatBot.commands.set(a.toLowerCase(), cmd));
      if (typeof cmd.onLoad === "function") cmd.onLoad({});
      return { success: true, name };
    }
    return { success: false, reason: "Missing config.name." };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

async function doInstall(api, threadID, id, forceKind = null) {
  let cmdData = null;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(id)}`);
    const data = res.data;
    if (!isNaN(id) && data?.rawCode && !Array.isArray(data)) cmdData = data;
    else if (Array.isArray(data?.commands)) cmdData = data.commands.find(c => String(c.id) === String(id));
    if (!cmdData?.rawCode) return api.sendMessage("❌ Command not found or rawCode missing.", threadID);
  } catch (_) { return api.sendMessage("❌ Failed to fetch command info.", threadID); }

  if (cmdData.framework !== "goat")
    return api.sendMessage(
      `❌ This is not a GoatBot file!\n` +
      `├‣ Category : ${cmdData.framework || "unknown"}\n` +
      `╰────────────◊\n` +
      `⚠️ Only goat-framework commands/events can be installed here.`,
      threadID
    );

  try { new Function(cmdData.rawCode); }
  catch (err) { return api.sendMessage(`❌ Syntax error in remote code.\n${err.message}`, threadID); }

  const displayName = cmdData.name || `gs_${id}`;
  const isEvent = forceKind === "event" ? true : forceKind === "command" ? false : cmdData.kind === "event";

  let pid;
  try { pid = await animateInstall(api, threadID, displayName); } catch (_) {}

  const fileName = displayName.replace(/\s+/g, "_") + ".js";
  const baseDir = process.cwd();
  const installDir = isEvent ? getEventsDir() : getCmdsDir();
  const filePath = path.join(installDir, fileName);
  const locLabel = path.relative(baseDir, filePath);

  try {
    if (!fs.existsSync(installDir)) fs.mkdirSync(installDir, { recursive: true });
    fs.writeFileSync(filePath, cmdData.rawCode, "utf-8");
  } catch (err) {
    if (pid) api.unsendMessage(pid);
    return api.sendMessage(`❌ Failed to write file:\n${err.message}`, threadID);
  }

  try { await axios.post(`${API_BASE}/miraistore/install/${cmdData.id}`); } catch (_) {}

  const load = isEvent ? { success: false } : autoloadCommand(filePath);

  const msg =
    `✅ Installed Successfully!\n` +
    `╭─‣ Name : ${cmdData.name || "Unknown"}\n` +
    `├‣ Type : ${typeBadge(cmdData)}\n` +
    `├‣ Author : ${cmdData.author || "Unknown"}\n` +
    `├‣ Version : ${cmdData.version || "N/A"}\n` +
    `├‣ Category : ${cmdData.category || "N/A"}\n` +
    `├‣ ID : ${id}\n` +
    `├‣ Location : ${locLabel}\n` +
    `╰────────────◊\n` +
    (load.success ? `🚀 "${load.name}" is now live! No restart needed.`
      : isEvent ? `⚠️ Event saved. Restart bot to apply.`
      : `⚠️ Autoload failed: ${load.reason}`);

  if (pid) {
    try { await api.editMessage(msg, pid); setTimeout(() => api.unsendMessage(pid).catch(() => {}), 5000); }
    catch (_) { api.sendMessage(msg, threadID); }
  } else api.sendMessage(msg, threadID);
}

async function doSelfUpdateSilent(api, threadID, selfUpdate) {
  let cmdData = null;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(selfUpdate.latestId)}`);
    const data = res.data;
    if (!isNaN(selfUpdate.latestId) && data?.rawCode && !Array.isArray(data)) cmdData = data;
    else if (Array.isArray(data?.commands)) cmdData = data.commands.find(c => String(c.id) === String(selfUpdate.latestId));
    if (!cmdData?.rawCode) return false;
  } catch (_) { return false; }

  try { new Function(cmdData.rawCode); }
  catch (_) { return false; }

  try {
    fs.writeFileSync(__filename, cmdData.rawCode, "utf-8");
  } catch (_) { return false; }

  try { await axios.post(`${API_BASE}/miraistore/install/${cmdData.id}`); } catch (_) {}

  const changelog = (cmdData.description || cmdData.changelog || "No changelog provided.").trim();
  const load = autoloadCommand(__filename);

  if (api && threadID) {
    const msg =
      `♻️ Auto-Updated GoatStore!\n` +
      `╭─‣ Version : v${cmdData.version || selfUpdate.latestVersion}\n` +
      `├‣ ID : ${cmdData.id}\n` +
      `╰────────────◊\n` +
      `📝 Changelog:\n${changelog}\n\n` +
      (load.success ? `🚀 Live now! No restart needed.` : `⚠️ Reload failed (${load.reason}) — restart bot to apply.`);
    api.sendMessage(msg, threadID).catch(() => {});
  }
  return true;
}

async function maybeAutoUpdate(api, threadID) {
  if (_autoupdateInFlight) return;
  const selfUpdate = await checkSelfUpdate();
  if (!selfUpdate?.hasUpdate) return;
  _autoupdateInFlight = true;
  try {
    await doSelfUpdateSilent(api, threadID, selfUpdate);
  } finally {
    _autoupdateInFlight = false;
  }
}

function typeBadge(cmd) {
  if (cmd.framework === "goat")  return cmd.kind === "event" ? "🐐 G-Event" : "🐐 G-Bot";
  if (cmd.framework === "mirai") return cmd.kind === "event" ? "🌌 Mirai-E" : "🌌 Mirai";
  return "📦 Other";
}

// "Author (v1.2)" — version shown right next to the author, used by both
// search results and list pages.
function authorLine(cmd) {
  const v = cmd.version && cmd.version !== "N/A" ? ` (v${cmd.version})` : "";
  return `${cmd.author || "Unknown"}${v}`;
}

// Result block — ID kept, Version on its own line below Author.
function resultBlock(cmd) {
  return (
    `╭─‣ ${cmd.name} 〄\n` +
    `├‣ ID : ${cmd.id}\n` +
    `├‣ Type : ${typeBadge(cmd)}\n` +
    `├‣ Author : ${cmd.author || "Unknown"}\n` +
    `├‣ Version : ${cmd.version && cmd.version !== "N/A" ? ` ${cmd.version}` : " N/A"}\n` +
    `├‣ Category : ${cmd.category}\n` +
    `╰────────────◊\n` +
    ` ✰ Upload : ${new Date(cmd.uploadDate || Date.now()).toDateString()}\n\n`
  );
}

function listBlock(cmd) {
  return (
    `╭─‣ ${cmd.name} 〄\n` +
    `├‣ ID : ${cmd.id}\n` +
    `├‣ Author : ${cmd.author || "Unknown"}\n` +
    `├‣ Version : ${cmd.version && cmd.version !== "N/A" ? ` ${cmd.version}` : " N/A"}\n` +
    `├‣ Category : ${cmd.category}\n` +
    `╰────────────◊\n` +
    ` ✰ Upload : ${new Date(cmd.uploadDate || Date.now()).toDateString()}\n\n`
  );
}

async function sendListPage(api, threadID, senderID, kind, page, limit = 10, prefix = "!") {
  const offset = (page - 1) * limit;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/list?limit=${limit}&offset=${offset}&framework=goat&kind=${kind}`);
    const data = res.data;
    if (!Array.isArray(data.commands) || !data.commands.length)
      return api.sendMessage("❌ No results found for this page.", threadID);

    const totalPages = Math.ceil(data.total / limit);
    const label = kind === "event" ? "GoatBot Events" : "GoatBot Commands";
    let msg = `📂 ${label} — Page ${page}/${totalPages} (${data.total} total)\n\n`;
    data.commands.forEach(cmd => { msg += listBlock(cmd); });
    if (totalPages > 1) msg += `⏤͟͟͞͞  Page ${page}/${totalPages}\n╭‣ React or reply p ${page + 1 <= totalPages ? page + 1 : page} for nxt pg\n`;
    msg += `╰‣ reply in <id> for install`;

    const finalMsg = msg.trim();
    const sent = await api.sendMessage(finalMsg, threadID);
    {
      const h = { commandName: "goatstore", messageID: sent.messageID, listType: kind, page, totalPages, limit, mode: "list", senderID, editCount: 0 };
      global.GoatBot.onReply.set(sent.messageID, h);
      global.GoatBot.onReaction.set(sent.messageID, h);
    }
  } catch (_) { api.sendMessage("❌ List API error.", threadID); }
}

// Universal search — no framework filter unless filterOpts.framework is
// given, and can search by author instead of name via filterOpts.author.
// Results come back from the backend already grouped goat → mirai → other,
// most recent first within each group.
function searchTitle(query, filterOpts) {
  if (filterOpts.author) return `👤 Author: ${filterOpts.author}`;
  if (filterOpts.category && !query) return `📂 Category: ${filterOpts.category}`;
  if (filterOpts.framework && !query) return `📂 Category: ${filterOpts.framework}`;
  if (filterOpts.kind === "event" && !query) return `📂 Events`;
  return `🔍 Search: "${query}"`;
}

async function sendSearchPage(api, threadID, senderID, query, page, limit = 5, prefix = "!", filterOpts = {}) {
  const offset = (page - 1) * limit;
  try {
    let url = `${API_BASE}/miraistore/search?limit=${limit}&offset=${offset}`;
    if (filterOpts.author) url += `&author=${encodeURIComponent(filterOpts.author)}`;
    else url += `&q=${encodeURIComponent(query || "")}`;
    if (filterOpts.framework) url += `&framework=${filterOpts.framework}`;
    if (filterOpts.kind) url += `&kind=${filterOpts.kind}`;
    if (filterOpts.category) url += `&category=${encodeURIComponent(filterOpts.category)}`;

    const res = await axios.get(url);
    const data = res.data;
    if (!Array.isArray(data.commands) || !data.commands.length)
      return api.sendMessage(`❌ No results found${query ? ` for "${query}"` : ""}.`, threadID);

    const total = data.total || data.commands.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const title = searchTitle(query, filterOpts);

    let msg = `${title} (${total} found)\n\n`;
    data.commands.forEach(cmd => { msg += resultBlock(cmd); });
    if (totalPages > 1) msg += `⏤͟͟͞͞  Page ${page}/${totalPages}\n╭‣ React or reply p ${page + 1 <= totalPages ? page + 1 : page} for nxt pg\n`;
    msg += `╰‣ reply in <id> for install`;

    const finalMsg = msg.trim();
    const sent = await api.sendMessage(finalMsg, threadID);
    const h = {
      commandName: "goatstore", messageID: sent.messageID, query,
      authorQuery: filterOpts.author || null, framework: filterOpts.framework || null,
      kind: filterOpts.kind || null, category: filterOpts.category || null,
      page, totalPages, limit, mode: "search", senderID, editCount: 0
    };
    global.GoatBot.onReply.set(sent.messageID, h);
    if (totalPages > 1) global.GoatBot.onReaction.set(sent.messageID, h);
  } catch (_) { api.sendMessage("❌ Search API error.", threadID); }
}

async function renderListPageInto(messageID, kind, page, limit) {
  const offset = (page - 1) * limit;
  const res = await axios.get(`${API_BASE}/miraistore/list?limit=${limit}&offset=${offset}&framework=goat&kind=${kind}`);
  const data = res.data;
  if (!Array.isArray(data.commands) || !data.commands.length) return null;

  const totalPages = Math.ceil(data.total / limit);
  const label = kind === "event" ? "GoatBot Events" : "GoatBot Commands";
  let msg = `📂 ${label} — Page ${page}/${totalPages} (${data.total} total)\n\n`;
  data.commands.forEach(cmd => { msg += listBlock(cmd); });
  if (totalPages > 1) msg += `⏤͟͟͞͞  Page ${page}/${totalPages}\n╭‣ React or reply p ${page + 1 <= totalPages ? page + 1 : page} for nxt pg\n`;
  msg += `╰‣ reply in <id> for install`;
  return { text: msg.trim(), totalPages };
}

async function renderSearchPageInto(query, page, limit, filterOpts = {}) {
  const offset = (page - 1) * limit;
  let url = `${API_BASE}/miraistore/search?limit=${limit}&offset=${offset}`;
  if (filterOpts.author) url += `&author=${encodeURIComponent(filterOpts.author)}`;
  else url += `&q=${encodeURIComponent(query || "")}`;
  if (filterOpts.framework) url += `&framework=${filterOpts.framework}`;
  if (filterOpts.kind) url += `&kind=${filterOpts.kind}`;
  if (filterOpts.category) url += `&category=${encodeURIComponent(filterOpts.category)}`;

  const res = await axios.get(url);
  const data = res.data;
  if (!Array.isArray(data.commands) || !data.commands.length) return null;

  const total = data.total || data.commands.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const title = searchTitle(query, filterOpts);

  let msg = `${title} (${total} found)\n\n`;
  data.commands.forEach(cmd => { msg += resultBlock(cmd); });
  if (totalPages > 1) msg += `⏤͟͟͞͞  Page ${page}/${totalPages}\n╭‣ React or reply p ${page + 1 <= totalPages ? page + 1 : page} for nxt pg\n`;
  msg += `╰‣ reply in <id> for install`;
  return { text: msg.trim(), totalPages };
}

async function uploadFile(api, threadID, filePath, kind, senderID = null) {
  let data;
  try { data = fs.readFileSync(filePath, "utf8"); }
  catch (err) { return api.sendMessage(`❌ Read failed:\n${err.message}`, threadID); }

  try { new Function(data); }
  catch (err) { return api.sendMessage(`❌ Syntax Error:\n${err.message}`, threadID); }

  const displayName = data.match(/name\s*:\s*["'`](.*?)["'`]/)?.[1] || path.basename(filePath);
  const detected = detectFramework(data);
  if (detected !== "goat")
    return api.sendMessage(
      `❌ Only GoatBot files can be uploaded here.\n` +
      `├‣ Detected : "${detected}" (this looks like a ${detected === "mirai" ? "Mirai" : "plain script"} file)\n` +
      `╰────────────◊`,
      threadID
    );

  let pid;
  try { pid = await animateUpload(api, threadID, displayName); } catch (_) {}

  try {
    const body = { rawCode: data, framework: "goat", kind };
    if (senderID) body.uploaderID = senderID;
    const res = await axios.post(`${API_BASE}/miraistore/upload`, body);

    if (["Already exists", "Version already exists", "Version too low", "Not allowed"].includes(res.data?.error)) {
      if (pid) api.unsendMessage(pid);
      return api.sendMessage(
        `⚠️ Upload Blocked!\n` +
        `╭─‣ Name : ${displayName}\n` +
        (res.data.id ? `├‣ ID : ${res.data.id}\n` : "") +
        (res.data.currentVersion ? `├‣ Current : v${res.data.currentVersion}\n` : "") +
        `╰────────────◊\n` +
        `💡 ${res.data.message}`,
        threadID
      );
    }

    if (res.data?.error) {
      if (pid) api.unsendMessage(pid);
      return api.sendMessage(
        `⚠️ Upload Failed!\n` +
        `╭─‣ Name : ${displayName}\n` +
        `├‣ Error : ${res.data.error}\n` +
        `╰────────────◊\n` +
        `💡 ${res.data.message || "MiraiStore backend register korte parenai. Backend/API side check koro."}`,
        threadID
      );
    }

    const author  = data.match(/author\s*:\s*["'`](.*?)["'`]/)?.[1]
                 || data.match(/credits\s*:\s*["'`](.*?)["'`]/)?.[1]
                 || "Unknown";
    const version = data.match(/version\s*:\s*["'`](.*?)["'`]/)?.[1] || "N/A";
    const category = data.match(/category\s*:\s*["'`](.*?)["'`]/)?.[1] || "Uncategorized";

    let header = "✅ Upload Successful!";
    let note = "";
    if (res.data.olderVersion) {
      header = "⚠️ Older Version — Stored As New Entry!";
      note = `💡 ${res.data.message}\n`;
    } else if (res.data.updated) {
      header = "🔄 Updated Existing Entry (Overwritten)!";
      note = `💡 ${res.data.message}\n`;
    }

    const msg =
      `${header}\n` +
      `╭─‣ Name : ${displayName}\n` +
      `├‣ Type : ${res.data.type || `goat-${kind}`}\n` +
      `├‣ Version : ${version}\n` +
      `├‣ Author : ${author}\n` +
      `├‣ Category : ${category}\n` +
      `├‣ ID : ${res.data.id}\n` +
      `╰────────────◊\n` +
      note +
      `⭔ Upload : ${new Date().toDateString()}`;
    if (pid) { try { await api.editMessage(msg, pid); } catch (_) { api.sendMessage(msg, threadID); } }
    else api.sendMessage(msg, threadID);
  } catch (err) {
    if (pid) api.unsendMessage(pid);
    api.sendMessage(
      `⚠️ Store API Call Fail Korlo!\n` +
      `├‣ Error : ${err.response?.data?.error || err.message}\n` +
      `╰────────────◊\n` +
      `💡 Request fail hoyeche, MiraiStore backend / network check koro.`,
      threadID
    );
  }
}

module.exports = {
  config: {
    name: "goatstore",
    aliases: ["gs", "cmdstore", "commandstore"],
    version: "19.4.0",
    author: "rX",
    countDown: 3,
    role: 2,
    shortDescription: "GoatBot Store — Search, AutoUpdate, Install, Upload, AutoSync",
    longDescription: "Browse, install, upload, and autosync GoatBot commands and events from the MiraiStore API. Auto-detects your cmds/events folder naming. The bare-menu shows only the daily-use commands — every subcommand lives here in the guide.",
    category: "system",
    guide: {
      en:
        "{pn} — Menu / Notifications\n" +
        "{pn} <id | file name> — Search commands only\n" +
        "{pn} -a <name> — All files by an author\n" +
        "{pn} -c <goat|mirai|other|category> — Browse a framework or category\n" +
        "{pn} -e <name> — Search events\n" +
        "{pn} -e install <id> — Install as event\n" +
        "{pn} -e upload <fileName> — Upload an event file\n" +
        "{pn} n — Today's updates\n" +
        "{pn} list [page] — Command list\n" +
        "{pn} list event [page] — Event list\n" +
        "{pn} install <id> — Install a command\n" +
        "{pn} like <id> — Like\n" +
        "{pn} trend — Trending\n" +
        "{pn} upload <fileName> — Upload a command file\n" +
        "{pn} sync — Manual sync\n" +
        "{pn} dirs — Show & re-detect cmds/events locations\n" +
        "Reply \"in\" to a single result — Install\n" +
        "Reply \"in <id>\" to a list result — Install"
    },
    autoSync: true
  },

  onLoad: function () {
    // Silent self-update, fully automatic — no subcommand needed.
    setTimeout(() => {
      maybeAutoUpdate(null, null).catch(() => {});
      setInterval(() => { maybeAutoUpdate(null, null).catch(() => {}); }, UPDATE_CHECK_INTERVAL);
    }, 6000);
    if (module.exports.config.autoSync) {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      setTimeout(() => {
        runAutoSync().catch(() => {});
        setInterval(() => { runAutoSync().catch(() => {}); }, ONE_DAY);
      }, 8000);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, body, senderID } = event;

    // Reply-based install: "in <id>" installs a specific ID from a list;
    // bare "in" installs the single-result ID stashed on the reply handler.
    const inIdMatch = body.match(/^in\s+(\d+)$/i);
    const inBareMatch = /^in$/i.test(body.trim());
    if (inIdMatch) return doInstall(api, threadID, inIdMatch[1], null);
    if (inBareMatch && Reply?.singleId) return doInstall(api, threadID, Reply.singleId, null);

    // Reply-based delete: "rmv <id> [secret]" (legacy: "delete <id> [secret]").
    const delMatch = body.match(/^(?:rmv|delete|remove)\s+(\S+)(?:\s+(\S+))?/i);
    if (delMatch) {
      const [, delId, delSecret] = delMatch;
      try {
        const payload = delSecret ? { secret: delSecret, userID: senderID } : { userID: senderID };
        const res = await axios.post(`${API_BASE}/miraistore/delete/${delId}`, payload);
        if (res.data?.error) return api.sendMessage(`❌ ${res.data.error}`, threadID);
        return api.sendMessage(`🗑️ Deleted! ID: ${delId}`, threadID);
      } catch (_) { return api.sendMessage("❌ Delete API error.", threadID); }
    }

    const { mode, query, listType, authorQuery, framework, kind, category, page, totalPages, limit, senderID: origSender } = Reply;
    if (senderID !== origSender) return;
    const match = body.match(/^page (\d+)$/i);
    if (!match) return;
    const newPage = parseInt(match[1]);
    if (newPage < 1 || newPage > totalPages)
      return api.sendMessage(`❌ Page must be between 1 and ${totalPages}.`, threadID);
    api.unsendMessage(Reply.messageID).catch(() => {});
    const prefix = getPrefix(event.threadData);
    if (mode === "list") await sendListPage(api, threadID, senderID, listType, newPage, limit, prefix);
    else await sendSearchPage(api, threadID, senderID, query, newPage, limit, prefix, { author: authorQuery, framework, kind, category });
  },

  // Stateless reply install/delete — no onReply registration required.
  // Fires on ANY reply to one of the bot's own store result messages
  // (search/list/etc.), even after a bot restart wiped the onReply map.
  onChat: async function ({ api, event }) {
    const { threadID, senderID, body, messageReply } = event;
    if (!body || !messageReply) return;
    const text = body.trim();

    const inMatch  = text.match(/^in\s+(\d+)$/i);
    const rmvMatch = text.match(/^(?:rmv|remove)\s+(\d+)(?:\s+(\S+))?$/i);
    if (!inMatch && !rmvMatch) return;

    // Only act on replies to OUR OWN store result messages, so random chat
    // replies like "in 5" never trigger an install/delete.
    let isBotMsg = false;
    try { isBotMsg = String(messageReply.senderID) === String(api.getCurrentUserID()); } catch (_) {}
    if (!isBotMsg) return;
    const repliedBody = messageReply.body || "";
    if (!/〄|🔍|📂|MiraiStore|GoatBot Store/i.test(repliedBody)) return;

    if (inMatch) return doInstall(api, threadID, inMatch[1], null);

    const [, id, secret] = rmvMatch;
    try {
      const payload = secret ? { secret, userID: senderID } : { userID: senderID };
      const res = await axios.post(`${API_BASE}/miraistore/delete/${id}`, payload);
      if (res.data?.error) return api.sendMessage(`❌ ${res.data.error}`, threadID);
      return api.sendMessage(`🗑️ Deleted! ID: ${id}`, threadID);
    } catch (_) { return api.sendMessage("❌ Delete API error.", threadID); }
  },

  onReaction: async function ({ api, event, Reaction }) {
    const { threadID, userID } = event;

    const { mode, query, listType, authorQuery, framework, kind, category, page, totalPages, limit, senderID, messageID, editCount = 0 } = Reaction;
    if (userID !== senderID) return;
    if (page >= totalPages) return api.sendMessage("✅ Already on the last page.", threadID);

    const nextPage = page + 1;

    try {
      const rendered = mode === "list"
        ? await renderListPageInto(messageID, listType, nextPage, limit)
        : await renderSearchPageInto(query, nextPage, limit, { author: authorQuery, framework, kind, category });

      if (!rendered) return api.sendMessage("❌ No results found for this page.", threadID);

      if (editCount >= MAX_EDITS_PER_MESSAGE) {
        const sent = await api.sendMessage(rendered.text, threadID);
        const h = { commandName: "goatstore", messageID: sent.messageID, listType, query, authorQuery, framework, kind, category, page: nextPage, totalPages: rendered.totalPages, limit, mode, senderID, editCount: 0 };
        global.GoatBot.onReply.set(sent.messageID, h);
        global.GoatBot.onReaction.set(sent.messageID, h);
      } else {
        await api.editMessage(rendered.text, messageID);
        const h = { commandName: "goatstore", messageID, listType, query, authorQuery, framework, kind, category, page: nextPage, totalPages: rendered.totalPages, limit, mode, senderID, editCount: editCount + 1 };
        global.GoatBot.onReply.set(messageID, h);
        global.GoatBot.onReaction.set(messageID, h);
      }
    } catch (_) {
      api.unsendMessage(messageID).catch(() => {});
      const prefix = getPrefix(event.threadData);
      if (mode === "list") await sendListPage(api, threadID, senderID, listType, nextPage, limit, prefix);
      else await sendSearchPage(api, threadID, senderID, query, nextPage, limit, prefix, { author: authorQuery, framework, kind, category });
    }
  },

  onStart: async function ({ api, event, args, threadData }) {
    const { threadID, senderID } = event;
    const sub = args[0]?.toLowerCase() || null;
    const prefix = getPrefix(threadData || event?.threadData);

    // Silent self-update also runs on every invocation (cheap, cached) as a
    // backup to the background timer in onLoad — no subcommand, no chat noise.
    maybeAutoUpdate(api, threadID).catch(() => {});

    if (!sub) {
      const updates = await getTodayUpdates();

      if (updates.length && !userSeenNoti.get(senderID)) {
        let n = `🔔 [ NOTIFICATION ]\nToday ${updates.length} GoatBot update(s)!\n━━━━━━━━━━━━━━━━━━\n`;
        updates.forEach(f => n += ` ‣ ${f.name} (ID: ${f.id})\n`);
        n += `\n(Type "${prefix}gs n" for details or "${prefix}gs" again for menu)`;
        userSeenNoti.set(senderID, true);
        return api.sendMessage(n, threadID);
      }

      // Bare menu intentionally shows ONLY the daily-use commands;
      // every other subcommand (-a, -c, -e, list, n, like, delete,
      // dirs, ...) lives in the config guide instead of cluttering it.
      const menuMsg =
        `📦 GoatStore\n\nUsage:\n` +
        `• ${prefix}gs <id | file name> \n` +
        `• ${prefix}gs install <id> \n` +
        `• ${prefix}gs upload <fileName> \n` +
        `• ${prefix}gs trend — Trending\n` +
        `• ${prefix}gs sync — Sync your files`;
      await api.sendMessage(menuMsg, threadID);
      return;
    }

    if (sub === "n" || sub === "notification") {
      const updates = await getTodayUpdates();
      if (!updates.length)
        return api.sendMessage("📅 No GoatBot updates today.", threadID);
      let msg = `📂 Today's GoatBot Updates\n━━━━━━━━━━━━━━━━━━\n`;
      updates.forEach(cmd =>
        msg += `╭─‣ ${cmd.name}\n├‣ ID: ${cmd.id}\n├‣ Type: ${typeBadge(cmd)}\n├‣ Author: ${cmd.author}\n╰────────────◊\n\n`
      );
      await api.sendMessage(msg.trim(), threadID);
      return;
    }

    if (sub === "sync") {
      api.sendMessage("🔄 Starting manual sync...", threadID);
      try {
        await runAutoSync();
        api.sendMessage("✅ Sync complete.", threadID);
      } catch (err) {
        api.sendMessage(`❌ Sync failed: ${err.message}`, threadID);
      }
      return;
    }

    // Show — and re-run — cmds/events folder auto-detection.
    if (sub === "dirs") {
      const cmdsDir = getCmdsDir(true);
      const eventsDir = getEventsDir(true);
      const countJs = d => { try { return fs.readdirSync(d).filter(f => f.endsWith(".js")).length; } catch { return null; } };
      const cc = countJs(cmdsDir), ec = countJs(eventsDir);
      const msg =
        `📁 Auto-detected Locations\n` +
        `╭─‣ Commands : ${relDir(cmdsDir)}${cc !== null ? ` (${cc} .js files)` : " — not found"}\n` +
        `├‣ Events    : ${relDir(eventsDir)}${ec !== null ? ` (${ec} .js files)` : " — not found"}\n` +
        `╰────────────◊\n` +
        `♻️ Auto-detect re-ran • AutoSync: ${module.exports.config.autoSync ? "ON ✅" : "OFF ❌"}`;
      return api.sendMessage(msg, threadID);
    }

    if (sub === "list" || sub === "ls") {
      const isEvent = args[1]?.toLowerCase() === "event";
      const page = Math.max(1, Number(isEvent ? args[2] : args[1]) || 1);
      return sendListPage(api, threadID, senderID, isEvent ? "event" : "command", page, 10, prefix);
    }

    if (sub === "-e" || sub === "--event" || sub === "event") {
      const action = args[1]?.toLowerCase();

      if (action === "install") {
        const id = args[2];
        if (!id) return api.sendMessage(`❌ Usage: ${prefix}gs -e install <id>`, threadID);
        return doInstall(api, threadID, id, "event");
      }

      if (action === "upload") {
        const fileName = args[2];
        if (!fileName) return api.sendMessage(`❌ Usage: ${prefix}gs -e upload <fileName>`, threadID);
        const { filePath, dirs } = findLocalFile(fileName, "event");
        if (!filePath) return api.sendMessage(fileNotFoundMsg(fileName, dirs, prefix), threadID);
        return uploadFile(api, threadID, filePath, "event", senderID);
      }

      if (!action) {
        try {
          const res = await axios.get(`${API_BASE}/miraistore/list?limit=20&framework=goat&kind=event`);
          const events = res.data.commands || [];
          if (!events.length) return api.sendMessage("❌ No GoatBot events found in store.", threadID);
          let msg = `📂 GoatBot Store Events (${res.data.total})\n\n`;
          events.forEach(cmd => {
            msg += `╭─‣ ${cmd.name}\n├‣ ID : ${cmd.id}\n├‣ Author : ${authorLine(cmd)}\n╰────────────◊\n\n`;
          });
          msg += `💡 Use: ${prefix}gs -e install <id>`;
          await api.sendMessage(msg.trim(), threadID);
          return;
        } catch (_) { return api.sendMessage("❌ Event list API error.", threadID); }
      }

      try {
        const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(action)}&limit=5&framework=goat&kind=event`);
        const events = res.data.commands || [];
        if (!events.length) return api.sendMessage(`❌ No GoatBot event found: "${action}"`, threadID);
        let msg = `📂 GoatBot Events matching "${action}"\n\n`;
        events.forEach(cmd => {
          msg += `╭─‣ ${cmd.name}\n├‣ ID : ${cmd.id}\n├‣ Author : ${authorLine(cmd)}\n╰────────────◊\n\n`;
        });
        msg += `💡 Use: ${prefix}gs -e install <id>`;
        await api.sendMessage(msg.trim(), threadID);
        return;
      } catch (_) { return api.sendMessage("❌ Event search API error.", threadID); }
    }

    if (sub === "install") {
      const id = args[1];
      if (!id) return api.sendMessage(`❌ Usage: ${prefix}gs install <id>`, threadID);
      return doInstall(api, threadID, id, null);
    }

    if (sub === "like") {
      const id = args[1];
      if (!id) return api.sendMessage(`❌ Usage: ${prefix}gs like <id>`, threadID);
      try {
        const res = await axios.post(`${API_BASE}/miraistore/like/${id}`, { userID: senderID });
        if (res.data?.message) return api.sendMessage("⚠️ Already liked.", threadID);
        return api.sendMessage(`❤️ Liked! Total Likes: ${res.data.likes}`, threadID);
      } catch (_) { return api.sendMessage("❌ Like API error.", threadID); }
    }

    if (sub === "trend" || sub === "trending") {
      const list = await getTrending(5);
      try {
        if (!list) return api.sendMessage("❌ Trending API error.", threadID);
        if (!list.length) return api.sendMessage("❌ No trending files.", threadID);
        let msg = `🔥 Top Trending 🔥\n\n`;
        list.forEach((cmd, i) => {
          msg +=
            `╭─‣ ${cmd.name}${i === 0 ? " 🏆" : ""}\n` +
            `├‣ Type : ${typeBadge(cmd)}\n` +
            `├‣ Likes : ❤️ ${cmd.likes}\n` +
            `├‣ Views : 👁️ ${cmd.views}\n` +
            `├‣ ID : ${cmd.id}\n` +
            `╰────────────◊\n\n`;
        });
        await api.sendMessage(msg.trim(), threadID);
        return;
      } catch (_) { return api.sendMessage("❌ Trending API error.", threadID); }
    }

    if (sub === "upload") {
      // Legacy "upload event <fileName>" still works; the documented
      // form is "-e upload <fileName>".
      const isEvent = args[1]?.toLowerCase() === "event";
      const fileName = isEvent ? args[2] : args[1];
      const kind = isEvent ? "event" : "command";
      if (!fileName)
        return api.sendMessage(`📁 Usage:\n• ${prefix}gs upload <fileName>\n• ${prefix}gs -e upload <fileName> (event)`, threadID);
      const { filePath, dirs } = findLocalFile(fileName, kind);
      if (!filePath) return api.sendMessage(fileNotFoundMsg(fileName, dirs, prefix), threadID);
      return uploadFile(api, threadID, filePath, kind, senderID);
    }

    if (sub === "delete") {
      const id = args[1], secret = args[2];
      if (!id) return api.sendMessage(`❌ Usage: ${prefix}gs delete <id> [secret]`, threadID);
      try {
        const payload = secret ? { secret, userID: senderID } : { userID: senderID };
        const res = await axios.post(`${API_BASE}/miraistore/delete/${id}`, payload);
        if (res.data?.error) return api.sendMessage(`❌ ${res.data.error}`, threadID);
        return api.sendMessage(`🗑️ Deleted! ID: ${id}`, threadID);
      } catch (_) { return api.sendMessage("❌ Delete API error.", threadID); }
    }

    // Author search: "-a <name>" ("author" kept as an alias).
    if (sub === "-a" || sub === "--author" || sub === "author") {
      const authorName = args.slice(1).join(" ");
      if (!authorName) return api.sendMessage(`❌ Usage: ${prefix}gs -a <name>`, threadID);
      return sendSearchPage(api, threadID, senderID, "", 1, 5, prefix, { author: authorName });
    }

    // Category search: "-c <goat|mirai|other>" browses a framework bucket;
    // any other value matches the entry's category field ("cat" kept as
    // an alias).
    if (sub === "-c" || sub === "--cat" || sub === "--category" || sub === "cat" || sub === "category") {
      const catName = args[1];
      if (!catName)
        return api.sendMessage(`❌ Usage: ${prefix}gs -c <goat|mirai|other|category name>`, threadID);
      const rest = args.slice(2).join(" ");
      if (["goat", "mirai", "other"].includes(catName.toLowerCase()))
        return sendSearchPage(api, threadID, senderID, rest, 1, 5, prefix, { framework: catName.toLowerCase() });
      return sendSearchPage(api, threadID, senderID, rest, 1, 5, prefix, { category: catName });
    }

    // Universal search — COMMANDS ONLY (kind=command); events live
    // behind "-e". Matches by file name, falls back to matching by
    // author. Append " -N" to the query to limit results.
    const query = args.join(" ");
    try {
      const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}&kind=command`);
      const data = res.data;
      if (!data || data.message) return api.sendMessage("❌ Not found.", threadID);

      if (!isNaN(query) && !Array.isArray(data) && !data.commands) {
        const finalMsg =
          `${typeBadge(data)}\n` +
          `╭─‣ Name : ${data.name}\n` +
          `├‣ Author : ${data.author}\n` +
          `├‣ Version : ${data.version || "N/A"}\n` +
          `├‣ Category : ${data.category}\n` +
          `├‣ Views : 👁️ ${data.views}\n` +
          `├‣ Likes : ❤️ ${data.likes}\n` +
          `├‣ Installs : ⬇️ ${data.installs}\n` +
          `╰────────────◊\n` +
          `⭔ Description: ${data.description || "No description"}\n` +
          `⭔ Upload : ${new Date(data.uploadDate || Date.now()).toDateString()}\n` +
          `🌐 URL : ${data.rawUrl}\n\n` +
          `💬 Reply "in" to install`;
        const sent = await api.sendMessage(finalMsg, threadID);
        const h = { commandName: "goatstore", messageID: sent.messageID, singleId: data.id, mode: "single", senderID, editCount: 0 };
        global.GoatBot.onReply.set(sent.messageID, h);
        return;
      }

      await sendSearchPage(api, threadID, senderID, query, 1, 5, prefix, { kind: "command" });
    } catch (_) { return api.sendMessage("❌ Search API error.", threadID); }
  }
};
