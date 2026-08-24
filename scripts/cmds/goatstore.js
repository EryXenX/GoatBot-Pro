const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_BASE = "https://mirai-store.vercel.app";
const userSeenNoti = new Map();
const AUTOSYNC_CACHE_PATH = path.join(process.cwd(), "goatstore_sync_cache.json");
const AUTOUPDATE_STATE_PATH = path.join(process.cwd(), "goatstore_autoupdate.json");

let _updateCheckCache = null;
const UPDATE_CHECK_INTERVAL = 1000 * 60 * 30;

// --- Pagination edit-limit ------------------------------------------------
const MAX_EDITS_PER_MESSAGE = 5;

// --- Tracked-author filter for command update checks ----------------------
const TRACKED_AUTHOR = "rx"; // matched case-insensitively against "rX"

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

// --- Autoupdate on/off persistence -----------------------------------
function loadAutoupdateState() {
  try {
    const raw = JSON.parse(fs.readFileSync(AUTOUPDATE_STATE_PATH, "utf8"));
    return { enabled: !!raw.enabled };
  } catch { return { enabled: true }; }
}

function saveAutoupdateState(state) {
  try { fs.writeFileSync(AUTOUPDATE_STATE_PATH, JSON.stringify(state, null, 2)); }
  catch (_) {}
}

let _autoupdateState = loadAutoupdateState();
let _autoupdateInFlight = false;
let _cmdAutoupdateInFlight = false;

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

function detectFramework(code) {
  const hasAuthorRole = /\bauthor\s*:/.test(code) && /\brole\s*:/.test(code);
  const hasCreditsPermission = /\bcredits\s*:/.test(code) && /\bhasPermission\s*[:(]/.test(code);

  if (hasAuthorRole && !hasCreditsPermission) return "goat";
  if (hasCreditsPermission && !hasAuthorRole) return "mirai";

  const isGoatStructure =
    /module\.exports\s*=\s*\{/.test(code) &&
    /onStart\s*[:(]|onChat\s*[:(]|onLoad\s*[:(]/.test(code);
  const isMiraiStructure =
    /module\.exports\.config\s*=/.test(code) ||
    /module\.exports\.run\s*=/.test(code);

  return (isGoatStructure && !isMiraiStructure) ? "goat" : "mirai";
}

async function checkSelfUpdate() {
  const now = Date.now();
  if (_updateCheckCache && (now - _updateCheckCache.checkedAt) < UPDATE_CHECK_INTERVAL)
    return _updateCheckCache.result;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=goatstore&limit=10&type=goat-command`);
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
    const [c, e] = await Promise.all([
      axios.get(`${API_BASE}/miraistore/list?limit=50&type=goat-command`),
      axios.get(`${API_BASE}/miraistore/list?limit=50&type=goat-event`)
    ]);
    const today = new Date().toDateString();
    return [...(c.data.commands || []), ...(e.data.commands || [])]
      .filter(cmd => new Date(cmd.uploadDate).toDateString() === today);
  } catch (_) { return []; }
}

async function runAutoSync() {
  const baseDir = process.cwd();
  const folders = [
    { dir: path.join(baseDir, "modules", "cmds"), kind: "command" },
    { dir: path.join(baseDir, "modules", "events"), kind: "event" }
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
      if (detectFramework(content) !== "goat") continue;

      try {
        const author = content.match(/author\s*:\s*["'`](.*?)["'`]/)?.[1]
                    || content.match(/credits\s*:\s*["'`](.*?)["'`]/)?.[1]
                    || "Unknown";
        const category = content.match(/category\s*:\s*["'`](.*?)["'`]/)?.[1] || "Uncategorized";
        const res = await axios.post(`${API_BASE}/miraistore/upload`, { rawCode: content, framework: "goat", kind, author, category });
        if (res.data?.error) {
          console.error(`[goatstore-sync] Upload error for ${file}:`, res.data.error);
        } else if (res.data?.olderVersion) {
          console.log(`[goatstore-sync] ${file}: older version — stored as separate new entry (ID: ${res.data.id}).`);
          cache[cacheKey] = hash;
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

async function animateSelfUpdate(api, threadID, version) {
  const steps = [
    { label: "Fetching update source",   pct: 30,  delay: 600 },
    { label: "Verifying integrity",      pct: 60,  delay: 900 },
    { label: "Overwriting goatstore.js", pct: 85,  delay: 700 },
    { label: "Reloading module",         pct: 100, delay: 600 }
  ];
  const info = await api.sendMessage(`♻️ Self-Updating to v${version}...\n\n◖ Preparing...\n[░░░░░░░░░░] 0%`, threadID);
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, steps[i].delay));
    await api.editMessage(`♻️ Self-Updating to v${version}...\n\n${frames[i]} ${steps[i].label}...\n[${buildBar(steps[i].pct)}] ${steps[i].pct}%`, info.messageID);
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

  if (!String(cmdData.type || "").startsWith("goat-"))
    return api.sendMessage(
      `❌ This is not a GoatBot file!\n` +
      `├‣ Type : ${cmdData.type || "unknown"}\n` +
      `╰────────────◊\n` +
      `⚠️ Only goat-command and goat-event can be installed here.`,
      threadID
    );

  try { new Function(cmdData.rawCode); }
  catch (err) { return api.sendMessage(`❌ Syntax error in remote code.\n${err.message}`, threadID); }

  const displayName = cmdData.name || `gs_${id}`;
  const isEvent = forceKind === "event" ? true : forceKind === "command" ? false : String(cmdData.type).endsWith("-event");

  let pid;
  try { pid = await animateInstall(api, threadID, displayName); } catch (_) {}

  const fileName = displayName.replace(/\s+/g, "_") + ".js";
  const baseDir = process.cwd();
  const installDir = isEvent ? path.join(baseDir, "modules", "events") : path.join(baseDir, "modules", "cmds");
  const filePath = path.join(installDir, fileName);
  const locLabel = isEvent ? `modules/events/${fileName}` : `modules/cmds/${fileName}`;

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
    `├‣ Type : ${cmdData.type || "N/A"}\n` +
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

// --- Silent install (no chat feedback) — used by autoupdate paths ---------
async function doInstallSilent(id, forceKind = null) {
  let cmdData = null;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(id)}`);
    const data = res.data;
    if (!isNaN(id) && data?.rawCode && !Array.isArray(data)) cmdData = data;
    else if (Array.isArray(data?.commands)) cmdData = data.commands.find(c => String(c.id) === String(id));
    if (!cmdData?.rawCode) return false;
  } catch (_) { return false; }

  if (!String(cmdData.type || "").startsWith("goat-")) return false;

  try { new Function(cmdData.rawCode); } catch (_) { return false; }

  const displayName = cmdData.name || `gs_${id}`;
  const isEvent = forceKind === "event" ? true : forceKind === "command" ? false : String(cmdData.type).endsWith("-event");
  const fileName = displayName.replace(/\s+/g, "_") + ".js";
  const baseDir = process.cwd();
  const installDir = isEvent ? path.join(baseDir, "modules", "events") : path.join(baseDir, "modules", "cmds");
  const filePath = path.join(installDir, fileName);

  try {
    if (!fs.existsSync(installDir)) fs.mkdirSync(installDir, { recursive: true });
    fs.writeFileSync(filePath, cmdData.rawCode, "utf-8");
  } catch (_) { return false; }

  try { await axios.post(`${API_BASE}/miraistore/install/${cmdData.id}`); } catch (_) {}

  if (!isEvent) autoloadCommand(filePath);
  return true;
}

async function doSelfUpdate(api, threadID, id) {
  let cmdData = null;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(id)}`);
    const data = res.data;
    if (!isNaN(id) && data?.rawCode && !Array.isArray(data)) cmdData = data;
    else if (Array.isArray(data?.commands)) cmdData = data.commands.find(c => String(c.id) === String(id));
    if (!cmdData?.rawCode) return api.sendMessage("❌ Update source not found or rawCode missing.", threadID);
  } catch (_) { return api.sendMessage("❌ Failed to fetch update info.", threadID); }

  try { new Function(cmdData.rawCode); }
  catch (err) { return api.sendMessage(`❌ Syntax error in remote self-update code.\n${err.message}`, threadID); }

  const newVersion = cmdData.version || "N/A";
  let pid;
  try { pid = await animateSelfUpdate(api, threadID, newVersion); } catch (_) {}

  try {
    fs.writeFileSync(__filename, cmdData.rawCode, "utf-8");
  } catch (err) {
    if (pid) api.unsendMessage(pid);
    return api.sendMessage(`❌ Self-update file write failed:\n${err.message}`, threadID);
  }

  try { await axios.post(`${API_BASE}/miraistore/install/${cmdData.id}`); } catch (_) {}

  const changelog = (cmdData.description || cmdData.changelog || "No changelog provided.").trim();
  const load = autoloadCommand(__filename);

  const msg =
    `✅ GoatStore Self-Updated!\n` +
    `╭─‣ Version : v${newVersion}\n` +
    `├‣ ID : ${cmdData.id}\n` +
    `╰────────────◊\n` +
    `📝 Changelog:\n${changelog}\n\n` +
    (load.success ? `🚀 Live now! No restart needed.` : `⚠️ Reload failed (${load.reason}) — restart bot to apply.`);

  if (pid) {
    try { await api.editMessage(msg, pid); }
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
  if (!_autoupdateState.enabled || _autoupdateInFlight) return;
  const selfUpdate = await checkSelfUpdate();
  if (!selfUpdate?.hasUpdate) return;
  _autoupdateInFlight = true;
  try {
    await doSelfUpdateSilent(api, threadID, selfUpdate);
  } finally {
    _autoupdateInFlight = false;
  }
}

// --- Per-command update detection (name/author/version) -------------------
function getLocalCommandFiles() {
  const dir = path.join(process.cwd(), "modules", "cmds");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".js"));
}

function extractMeta(content) {
  const name = content.match(/name\s*:\s*["'`](.*?)["'`]/)?.[1] || null;
  const author = content.match(/author\s*:\s*["'`](.*?)["'`]/)?.[1]
              || content.match(/credits\s*:\s*["'`](.*?)["'`]/)?.[1]
              || null;
  const version = content.match(/version\s*:\s*["'`](.*?)["'`]/)?.[1] || "0.0.0";
  return { name, author, version };
}

// Scans modules/cmds, keeps only files whose author matches TRACKED_AUTHOR,
// and returns those where the store has a strictly newer version.
async function checkCommandUpdates() {
  const files = getLocalCommandFiles();
  const baseDir = path.join(process.cwd(), "modules", "cmds");
  const results = [];

  for (const file of files) {
    const filePath = path.join(baseDir, file);
    let content;
    try { content = fs.readFileSync(filePath, "utf8"); } catch (_) { continue; }

    const meta = extractMeta(content);
    if (!meta.name || !meta.author) continue;
    if (!meta.author.toLowerCase().includes(TRACKED_AUTHOR)) continue;

    try {
      const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(meta.name)}&type=goat-command`);
      const data = res.data;
      const cmds = Array.isArray(data?.commands) ? data.commands : (data?.rawCode ? [data] : []);
      const match = cmds.find(c =>
        c.name?.toLowerCase() === meta.name.toLowerCase() &&
        c.author?.toLowerCase().includes(TRACKED_AUTHOR)
      );
      if (!match) continue;

      if (cmpVer(match.version, meta.version) > 0) {
        results.push({
          file,
          name: meta.name,
          localVersion: meta.version,
          storeVersion: match.version,
          storeId: match.id
        });
      }
    } catch (_) { /* skip this file on API error */ }

    await new Promise(r => setTimeout(r, 300));
  }

  return results;
}

// Silently installs every detected command update, no chat feedback.
async function maybeAutoUpdateCommands(api, threadID) {
  if (!_autoupdateState.enabled || _cmdAutoupdateInFlight) return;
  _cmdAutoupdateInFlight = true;
  try {
    const updates = await checkCommandUpdates();
    for (const u of updates) {
      await doInstallSilent(u.storeId, "command");
    }
  } finally {
    _cmdAutoupdateInFlight = false;
  }
}

async function sendListPage(api, threadID, senderID, type, page, limit = 10, prefix = "!") {
  const offset = (page - 1) * limit;
  try {
    const res = await axios.get(`${API_BASE}/miraistore/list?limit=${limit}&offset=${offset}&type=${type}`);
    const data = res.data;
    if (!Array.isArray(data.commands) || !data.commands.length)
      return api.sendMessage("❌ No results found for this page.", threadID);

    const totalPages = Math.ceil(data.total / limit);
    const label = type === "goat-event" ? "GoatBot Events" : "GoatBot Commands";
    let msg = `📂 ${label} — Page ${page}/${totalPages} (${data.total} total)\n\n`;
    data.commands.forEach(cmd => {
      msg += `╭─‣ ${cmd.name} 〄\n`;
      msg += `├‣ ID : ${cmd.id}\n`;
      msg += `├‣ Author : ${cmd.author}\n`;
      msg += `├‣ Category : ${cmd.category}\n`;
      msg += `╰────────────◊\n`;
      msg += ` ✰ Upload : ${new Date(cmd.uploadDate || Date.now()).toDateString()}\n\n`;
    });
    if (totalPages > 1) msg += `Reply "page <number>" or react to go next page.`;

    const finalMsg = msg.trim();
    const sent = await api.sendMessage(finalMsg, threadID);
    if (totalPages > 1) {
      const h = { commandName: "goatstore", messageID: sent.messageID, listType: type, page, totalPages, limit, mode: "list", senderID, editCount: 0 };
      global.GoatBot.onReply.set(sent.messageID, h);
      global.GoatBot.onReaction.set(sent.messageID, h);
    }
  } catch (_) { api.sendMessage("❌ List API error.", threadID); }
}

async function sendSearchPage(api, threadID, senderID, query, page, limit = 5, prefix = "!") {
  const offset = (page - 1) * limit;
  try {
    const [cr, er] = await Promise.all([
      axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&type=goat-command`),
      axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&type=goat-event`)
    ]);
    const all = [...(cr.data.commands || []), ...(er.data.commands || [])];
    const total = (cr.data.total || 0) + (er.data.total || 0);
    if (!all.length) return api.sendMessage(`❌ No GoatBot results found for "${query}".`, threadID);

    const totalPages = Math.max(1, Math.ceil(total / (limit * 2)));
    let msg = `🔍 Search: "${query}" (${total} found)\n\n`;
    all.forEach(cmd => {
      msg += `╭─‣ ${cmd.name} 〄\n`;
      msg += `├‣ ID : ${cmd.id}\n`;
      msg += `├‣ Type : ${cmd.type === "goat-event" ? "🎯 Event" : "⚡ Command"}\n`;
      msg += `├‣ Author : ${cmd.author}\n`;
      msg += `├‣ Category : ${cmd.category}\n`;
      msg += `╰────────────◊\n`;
      msg += ` ✰ Upload : ${new Date(cmd.uploadDate || Date.now()).toDateString()}\n\n`;
    });
    if (totalPages > 1) msg += `Page ${page}/${totalPages}\nReact to go next page.`;

    const finalMsg = msg.trim();
    const sent = await api.sendMessage(finalMsg, threadID);
    if (totalPages > 1) {
      const h = { commandName: "goatstore", messageID: sent.messageID, query, page, totalPages, limit, mode: "search", senderID, editCount: 0 };
      global.GoatBot.onReply.set(sent.messageID, h);
      global.GoatBot.onReaction.set(sent.messageID, h);
    }
  } catch (_) { api.sendMessage("❌ Search API error.", threadID); }
}

async function renderListPageInto(messageID, type, page, limit) {
  const offset = (page - 1) * limit;
  const res = await axios.get(`${API_BASE}/miraistore/list?limit=${limit}&offset=${offset}&type=${type}`);
  const data = res.data;
  if (!Array.isArray(data.commands) || !data.commands.length) return null;

  const totalPages = Math.ceil(data.total / limit);
  const label = type === "goat-event" ? "GoatBot Events" : "GoatBot Commands";
  let msg = `📂 ${label} — Page ${page}/${totalPages} (${data.total} total)\n\n`;
  data.commands.forEach(cmd => {
    msg += `╭─‣ ${cmd.name} 〄\n`;
    msg += `├‣ ID : ${cmd.id}\n`;
    msg += `├‣ Author : ${cmd.author}\n`;
    msg += `├‣ Category : ${cmd.category}\n`;
    msg += `╰────────────◊\n`;
    msg += ` ✰ Upload : ${new Date(cmd.uploadDate || Date.now()).toDateString()}\n\n`;
  });
  if (totalPages > 1) msg += `Reply "page <number>" or react to go next page.`;
  return { text: msg.trim(), totalPages };
}

async function renderSearchPageInto(query, page, limit) {
  const offset = (page - 1) * limit;
  const [cr, er] = await Promise.all([
    axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&type=goat-command`),
    axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&type=goat-event`)
  ]);
  const all = [...(cr.data.commands || []), ...(er.data.commands || [])];
  const total = (cr.data.total || 0) + (er.data.total || 0);
  if (!all.length) return null;

  const totalPages = Math.max(1, Math.ceil(total / (limit * 2)));
  let msg = `🔍 Search: "${query}" (${total} found)\n\n`;
  all.forEach(cmd => {
    msg += `╭─‣ ${cmd.name} 〄\n`;
    msg += `├‣ ID : ${cmd.id}\n`;
    msg += `├‣ Type : ${cmd.type === "goat-event" ? "🎯 Event" : "⚡ Command"}\n`;
    msg += `├‣ Author : ${cmd.author}\n`;
    msg += `├‣ Category : ${cmd.category}\n`;
    msg += `╰────────────◊\n`;
    msg += ` ✰ Upload : ${new Date(cmd.uploadDate || Date.now()).toDateString()}\n\n`;
  });
  if (totalPages > 1) msg += `Page ${page}/${totalPages}\nReact to go next page.`;
  return { text: msg.trim(), totalPages };
}

async function uploadFile(api, threadID, filePath, kind) {
  let data;
  try { data = fs.readFileSync(filePath, "utf8"); }
  catch (err) { return api.sendMessage(`❌ Read failed:\n${err.message}`, threadID); }

  try { new Function(data); }
  catch (err) { return api.sendMessage(`❌ Syntax Error:\n${err.message}`, threadID); }

  const displayName = data.match(/name\s*:\s*["'`](.*?)["'`]/)?.[1] || path.basename(filePath);
  if (detectFramework(data) !== "goat")
    return api.sendMessage(`❌ Only GoatBot files can be uploaded here.`, threadID);

  let pid;
  try { pid = await animateUpload(api, threadID, displayName); } catch (_) {}

  try {
    const res = await axios.post(`${API_BASE}/miraistore/upload`, { rawCode: data, framework: "goat", kind });

    if (res.data?.error === "Already exists" || res.data?.error === "Not allowed") {
      if (pid) api.unsendMessage(pid);
      return api.sendMessage(
        `⚠️ ${res.data.error === "Not allowed" ? "Upload Blocked!" : "Already Exists in Store!"}\n` +
        `╭─‣ Name : ${displayName}\n` +
        (res.data.id ? `├‣ ID : ${res.data.id}\n` : "") +
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
    version: "10.0.0",
    author: "rX",
    countDown: 3,
    role: 2,
    shortDescription: "GoatBot Store — Search, AutoUpdate, Install, Upload, AutoSync",
    longDescription: "Browse, install, upload, and autosync GoatBot commands and events from the MiraiStore API.",
    category: "system",
    guide: {
      en:
        "{pn} — Menu / Notifications\n" +
        "{pn} n — Today's updates\n" +
        "{pn} list [page] — Command list\n" +
        "{pn} list event [page] — Event list\n" +
        "{pn} <id | name> — Search\n" +
        "{pn} install <id> — Install\n" +
        "{pn} event install <id> — Force as event\n" +
        "{pn} like <id> — Like\n" +
        "{pn} trending — Trending\n" +
        "{pn} upload <fileName> — Upload command\n" +
        "{pn} upload event <fileName> — Upload event\n" +
        "{pn} sync — Manual sync\n" +
        "{pn} cmdupdate — Check installed rX commands for store updates\n" +
        "{pn} autoupdate on/off — Toggle silent self-update (also silences command updates)\n" +
        "{pn} delete <id> <secret> — Delete"
    },
    autoSync: true
  },

  onLoad: function () {
    setTimeout(() => { checkSelfUpdate().catch(() => {}); }, 6000);
    if (module.exports.config.autoSync) {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      setTimeout(() => {
        runAutoSync().catch(() => {});
        setInterval(() => { runAutoSync().catch(() => {}); }, ONE_DAY);
      }, 8000);
    }
    // Periodic silent command-update check (only acts while autoupdate is ON)
    const SIX_HOURS = 1000 * 60 * 60 * 6;
    setTimeout(() => {
      maybeAutoUpdateCommands(null, null).catch(() => {});
      setInterval(() => { maybeAutoUpdateCommands(null, null).catch(() => {}); }, SIX_HOURS);
    }, 10000);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, body, senderID } = event;

    if (Reply.mode === "cmdupdate") {
      if (senderID !== Reply.senderID) return;
      const num = parseInt(body.trim(), 10);
      if (isNaN(num) || num < 1 || num > Reply.updates.length) return;
      const chosen = Reply.updates[num - 1];
      return doInstall(api, threadID, chosen.storeId, "command");
    }

    const { mode, query, listType, page, totalPages, limit, senderID: origSender } = Reply;
    if (senderID !== origSender) return;
    const match = body.match(/^page (\d+)$/i);
    if (!match) return;
    const newPage = parseInt(match[1]);
    if (newPage < 1 || newPage > totalPages)
      return api.sendMessage(`❌ Page must be between 1 and ${totalPages}.`, threadID);
    api.unsendMessage(Reply.messageID).catch(() => {});
    const prefix = getPrefix(event.threadData);
    if (mode === "list") await sendListPage(api, threadID, senderID, listType, newPage, limit, prefix);
    else await sendSearchPage(api, threadID, senderID, query, newPage, limit, prefix);
  },

  onReaction: async function ({ api, event, Reaction }) {
    const { threadID, userID } = event;

    if (Reaction.mode === "selfupdate") {
      if (userID !== Reaction.senderID) return;
      api.unsendMessage(Reaction.messageID).catch(() => {});
      return doSelfUpdate(api, threadID, Reaction.latestId);
    }

    const { mode, query, listType, page, totalPages, limit, senderID, messageID, editCount = 0 } = Reaction;
    if (userID !== senderID) return;
    if (page >= totalPages) return api.sendMessage("✅ Already on the last page.", threadID);

    const nextPage = page + 1;

    try {
      const rendered = mode === "list"
        ? await renderListPageInto(messageID, listType, nextPage, limit)
        : await renderSearchPageInto(query, nextPage, limit);

      if (!rendered) return api.sendMessage("❌ No results found for this page.", threadID);

      if (editCount >= MAX_EDITS_PER_MESSAGE) {
        const sent = await api.sendMessage(rendered.text, threadID);
        const h = { commandName: "goatstore", messageID: sent.messageID, listType, query, page: nextPage, totalPages: rendered.totalPages, limit, mode, senderID, editCount: 0 };
        global.GoatBot.onReply.set(sent.messageID, h);
        global.GoatBot.onReaction.set(sent.messageID, h);
      } else {
        await api.editMessage(rendered.text, messageID);
        const h = { commandName: "goatstore", messageID, listType, query, page: nextPage, totalPages: rendered.totalPages, limit, mode, senderID, editCount: editCount + 1 };
        global.GoatBot.onReply.set(messageID, h);
        global.GoatBot.onReaction.set(messageID, h);
      }
    } catch (_) {
      api.unsendMessage(messageID).catch(() => {});
      const prefix = getPrefix(event.threadData);
      if (mode === "list") await sendListPage(api, threadID, senderID, listType, nextPage, limit, prefix);
      else await sendSearchPage(api, threadID, senderID, query, nextPage, limit, prefix);
    }
  },

  onStart: async function ({ api, event, args, threadData }) {
    const { threadID, senderID } = event;
    const sub = args[0]?.toLowerCase() || null;
    const prefix = getPrefix(threadData || event?.threadData);

    await Promise.all([
      maybeAutoUpdate(api, threadID),
      maybeAutoUpdateCommands(api, threadID)
    ]);

    if (sub === "autoupdate") {
      const mode = args[1]?.toLowerCase();
      if (mode !== "on" && mode !== "off")
        return api.sendMessage(
          `⚙️ Autoupdate Status: ${_autoupdateState.enabled ? "✅ ON" : "❌ OFF"}\n\n` +
          `Usage:\n• ${prefix}gs autoupdate on\n• ${prefix}gs autoupdate off\n\n` +
          `💡 ON thakle notun version paile (self + rX commands) react/reply confirm chara e direct silently update hoye jabe.`,
          threadID
        );
      _autoupdateState = { enabled: mode === "on" };
      saveAutoupdateState(_autoupdateState);
      return api.sendMessage(
        mode === "on"
          ? `✅ Autoupdate ON kora holo.\n💡 Ekhon theke notun version paile (goatstore self-update shoho tomar rX command gulao) confirm chara e silently update hoye jabe.`
          : `❌ Autoupdate OFF kora holo.\n💡 Notun version paile ager moto react/reply-confirm chaibe.`,
        threadID
      );
    }

    if (sub === "cmdupdate" || sub === "cu") {
      await api.sendMessage("🔍 Checking your rX commands against the store...", threadID);
      const updates = await checkCommandUpdates();
      if (!updates.length) return api.sendMessage("✅ All your rX commands are up to date.", threadID);

      let msg = `🆕 [ COMMAND UPDATES AVAILABLE ]\n━━━━━━━━━━━━━━━━━━\n`;
      updates.forEach((u, i) => {
        msg +=
          `${i + 1}/${updates.length} ) ${u.name}\n` +
          `├‣ Current : v${u.localVersion}\n` +
          `├‣ New     : v${u.storeVersion}\n` +
          `├‣ ID      : ${u.storeId}\n` +
          `╰────────────◊\n`;
      });
      msg += `\n💬 Reply with the number (e.g. "2") to install that update.`;

      const sent = await api.sendMessage(msg.trim(), threadID);
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: "goatstore",
        messageID: sent.messageID,
        mode: "cmdupdate",
        updates,
        senderID
      });
      return;
    }

    if (!sub) {
      const [updates, selfUpdate] = await Promise.all([getTodayUpdates(), checkSelfUpdate()]);

      if (selfUpdate?.hasUpdate && !_autoupdateState.enabled && !userSeenNoti.get(`upd_${selfUpdate.latestVersion}_${senderID}`)) {
        userSeenNoti.set(`upd_${selfUpdate.latestVersion}_${senderID}`, true);
        const changelogPreview = (selfUpdate.description || "No changelog provided.").slice(0, 200);
        const sent = await api.sendMessage(
          `🆙 [ GOATSTORE UPDATE AVAILABLE ]\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `Current version : v${selfUpdate.currentVersion}\n` +
          `New version     : v${selfUpdate.latestVersion}\n` +
          `Store ID        : ${selfUpdate.latestId}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📝 Changelog:\n${changelogPreview}\n\n` +
          `👍 React to this message to self-update instantly!\n` +
          `(Or type "${prefix}gs" again to see the menu)\n\n` +
          `💡 Tip: "${prefix}gs autoupdate on" korle eibar theke ei prompt lagbe na.`,
          threadID
        );
        global.GoatBot.onReaction.set(sent.messageID, {
          commandName: "goatstore",
          messageID: sent.messageID,
          mode: "selfupdate",
          latestId: selfUpdate.latestId,
          senderID
        });
        return;
      }

      if (updates.length && !userSeenNoti.get(senderID)) {
        let n = `🔔 [ NOTIFICATION ]\nToday ${updates.length} GoatBot update(s)!\n━━━━━━━━━━━━━━━━━━\n`;
        updates.forEach(f => n += ` ‣ ${f.name} (ID: ${f.id})\n`);
        n += `\n(Type "${prefix}gs n" for details or "${prefix}gs" again for menu)`;
        userSeenNoti.set(senderID, true);
        return api.sendMessage(n, threadID);
      }

      const menuMsg =
        `📦 GoatBot Store\n\nUsage:\n` +
        `• ${prefix}gs <id | name>\n` +
        `• ${prefix}gs n\n` +
        `• ${prefix}gs list [page]\n` +
        `• ${prefix}gs list event [page]\n` +
        `• ${prefix}gs install <id>\n` +
        `• ${prefix}gs event install <id>\n` +
        `• ${prefix}gs like <id>\n` +
        `• ${prefix}gs trending\n` +
        `• ${prefix}gs upload <fileName>\n` +
        `• ${prefix}gs upload event <fileName>\n` +
        `• ${prefix}gs sync\n` +
        `• ${prefix}gs cmdupdate\n` +
        `• ${prefix}gs autoupdate on/off\n` +
        `• ${prefix}gs delete <id> <secret>`;
      await api.sendMessage(menuMsg, threadID);
      return;
    }

    if (sub === "n" || sub === "notification") {
      const [updates, selfUpdate] = await Promise.all([getTodayUpdates(), checkSelfUpdate()]);
      let msg = "";
      if (selfUpdate?.hasUpdate && !_autoupdateState.enabled) {
        const changelogPreview = (selfUpdate.description || "No changelog provided.").slice(0, 200);
        msg +=
          `🆙 [ GOATSTORE SELF UPDATE ]\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `Current : v${selfUpdate.currentVersion}\n` +
          `Latest  : v${selfUpdate.latestVersion}\n` +
          `ID      : ${selfUpdate.latestId}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📝 Changelog:\n${changelogPreview}\n\n` +
          `👍 React to self-update instantly!\n\n`;
      }
      if (!updates.length && !(selfUpdate?.hasUpdate && !_autoupdateState.enabled))
        return api.sendMessage("📅 No GoatBot updates today.", threadID);
      if (updates.length) {
        msg += `📂 Today's GoatBot Updates\n━━━━━━━━━━━━━━━━━━\n`;
        updates.forEach(cmd =>
          msg += `╭─‣ ${cmd.name}\n├‣ ID: ${cmd.id}\n├‣ Type: ${cmd.type || "N/A"}\n├‣ Author: ${cmd.author}\n╰────────────◊\n\n`
        );
      }
      const finalMsg = msg.trim();
      const sent = await api.sendMessage(finalMsg, threadID);
      if (selfUpdate?.hasUpdate && !_autoupdateState.enabled) {
        global.GoatBot.onReaction.set(sent.messageID, {
          commandName: "goatstore",
          messageID: sent.messageID,
          mode: "selfupdate",
          latestId: selfUpdate.latestId,
          senderID
        });
      }
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

    if (sub === "list" || sub === "ls") {
      const isEvent = args[1]?.toLowerCase() === "event";
      const page = Math.max(1, Number(isEvent ? args[2] : args[1]) || 1);
      return sendListPage(api, threadID, senderID, isEvent ? "goat-event" : "goat-command", page, 10, prefix);
    }

    if (sub === "event") {
      const action = args[1]?.toLowerCase();

      if (action === "install") {
        const id = args[2];
        if (!id) return api.sendMessage(`❌ Usage: ${prefix}gs event install <id>`, threadID);
        return doInstall(api, threadID, id, "event");
      }

      if (!action) {
        try {
          const res = await axios.get(`${API_BASE}/miraistore/list?limit=20&type=goat-event`);
          const events = res.data.commands || [];
          if (!events.length) return api.sendMessage("❌ No GoatBot events found in store.", threadID);
          let msg = `📂 GoatBot Store Events (${res.data.total})\n\n`;
          events.forEach(cmd => {
            msg += `╭─‣ ${cmd.name}\n├‣ ID : ${cmd.id}\n├‣ Author : ${cmd.author}\n╰────────────◊\n\n`;
          });
          msg += `💡 Use: ${prefix}gs event install <id>`;
          await api.sendMessage(msg.trim(), threadID);
          return;
        } catch (_) { return api.sendMessage("❌ Event list API error.", threadID); }
      }

      try {
        const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(action)}&limit=5&type=goat-event`);
        const events = res.data.commands || [];
        if (!events.length) return api.sendMessage(`❌ No GoatBot event found: "${action}"`, threadID);
        let msg = `📂 GoatBot Events matching "${action}"\n\n`;
        events.forEach(cmd => {
          msg += `╭─‣ ${cmd.name}\n├‣ ID : ${cmd.id}\n├‣ Author : ${cmd.author}\n├‣ Version : ${cmd.version || "N/A"}\n╰────────────◊\n\n`;
        });
        msg += `💡 Use: ${prefix}gs event install <id>`;
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
      try {
        const res = await axios.get(`${API_BASE}/miraistore/trending?limit=5`);
        const list = (res.data || []).filter(c => ["goat-command", "goat-event"].includes(c.type));
        if (!list.length) return api.sendMessage("❌ No GoatBot trending files.", threadID);
        let msg = `🔥 Top GoatBot Trending 🔥\n\n`;
        list.forEach((cmd, i) => {
          msg +=
            `╭─‣ ${cmd.name}${i === 0 ? " 🏆" : ""}\n` +
            `├‣ Type : ${cmd.type === "goat-event" ? "🎯 Event" : "⚡ Command"}\n` +
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
      const isEvent = args[1]?.toLowerCase() === "event";
      const fileName = isEvent ? args[2] : args[1];
      const kind = isEvent ? "event" : "command";
      if (!fileName)
        return api.sendMessage(`📁 Usage:\n• ${prefix}gs upload <fileName>\n• ${prefix}gs upload event <fileName>`, threadID);
      const baseDir = process.cwd();
      const dirs = kind === "event"
        ? [path.join(baseDir, "modules", "events")]
        : [path.join(baseDir, "modules", "cmds"), path.join(baseDir, "modules", "events")];
      let filePath = null;
      for (const dir of dirs) {
        if (fs.existsSync(path.join(dir, fileName))) { filePath = path.join(dir, fileName); break; }
        if (fs.existsSync(path.join(dir, fileName + ".js"))) { filePath = path.join(dir, fileName + ".js"); break; }
      }
      if (!filePath) return api.sendMessage(`❌ File not found: "${fileName}"`, threadID);
      return uploadFile(api, threadID, filePath, kind);
    }

    if (sub === "delete") {
      const id = args[1], secret = args[2];
      if (!id || !secret) return api.sendMessage(`❌ Usage: ${prefix}gs delete <id> <secret>`, threadID);
      try {
        const res = await axios.post(`${API_BASE}/miraistore/delete/${id}`, { secret });
        if (res.data?.error) return api.sendMessage(`❌ ${res.data.error}`, threadID);
        return api.sendMessage(`🗑️ Deleted! ID: ${id}`, threadID);
      } catch (_) { return api.sendMessage("❌ Delete API error.", threadID); }
    }

    const query = args.join(" ");
    try {
      const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}`);
      const data = res.data;
      if (!data || data.message) return api.sendMessage("❌ Not found.", threadID);

      if (!isNaN(query) && !Array.isArray(data) && !data.commands) {
        if (!String(data.type || "").startsWith("goat-"))
          return api.sendMessage(
            `⚠️ ID ${query} is not a GoatBot file.\n├‣ Type : ${data.type || "unknown"}\n╰── Only goat-command / goat-event shown here.`,
            threadID
          );
        const finalMsg =
          `${data.type === "goat-event" ? "🎯 GoatBot Event" : "⚡ GoatBot Command"}\n` +
          `╭─‣ Name : ${data.name}\n` +
          `├‣ Author : ${data.author}\n` +
          `├‣ Version : ${data.version || "N/A"}\n` +
          `├‣ Category : ${data.category}\n` +
          `├‣ Views : 👁️ ${data.views}\n` +
          `├‣ Likes : ❤️ ${data.likes}\n` +
          `├‣ Installs : ⬇️ ${data.installs}\n` +
          `├‣ ID : ${data.id}\n` +
          `╰────────────◊\n` +
          `⭔ Description: ${data.description || "No description"}\n` +
          `⭔ Upload : ${new Date(data.uploadDate || Date.now()).toDateString()}\n` +
          `🌐 URL : ${data.rawUrl}`;
        await api.sendMessage(finalMsg, threadID);
        return;
      }

      await sendSearchPage(api, threadID, senderID, query, 1, 5, prefix);
    } catch (_) { return api.sendMessage("❌ Search API error.", threadID); }
  }
};
