const fs = require("fs");
const path = require("path");

function getPath(obj, keys) {
	return keys.reduce((o, k) => (o == null ? o : o[k]), obj);
}

function setPath(obj, keys, value) {
	let cur = obj;
	for (let i = 0; i < keys.length - 1; i++) {
		cur[keys[i]] = cur[keys[i]] || {};
		cur = cur[keys[i]];
	}
	cur[keys[keys.length - 1]] = value;
}

function status(val) {
	return val ? "ON ✦" : "OFF ◌";
}

function masked(val) {
	if (val === undefined || val === null || val === "" || val === " ") return "Not set ✕";
	return "Set ✦ (" + String(val).length + " chars)";
}

const BOOL_GROUPS = {
	hideNoti: {
		title: "🔕 Hide Notification Messages",
		path: ["hideNotiMessage"],
		items: [
			["commandNotFound", "Command Not Found"],
			["adminOnly", "Admin Only"],
			["threadBanned", "Thread Banned"],
			["userBanned", "User Banned"],
			["needRoleToUseCmd", "Need Role To Use Cmd"],
			["needRoleToUseCmdOnReply", "…On Reply"],
			["needRoleToUseCmdOnReaction", "…On Reaction"]
		]
	},
	logEvents: {
		title: "📝 Log Events",
		path: ["logEvents"],
		items: [
			["disableAll", "Disable All"],
			["message", "Message"],
			["message_reaction", "Message Reaction"],
			["message_unsend", "Message Unsend"],
			["message_reply", "Message Reply"],
			["event", "Event"],
			["read_receipt", "Read Receipt"],
			["typ", "Typing"],
			["presence", "Presence"]
		]
	},
	fcaOptions: {
		title: "🧩 FCA Options",
		path: ["optionsFca"],
		items: [
			["forceLogin", "Force Login"],
			["listenEvents", "Listen Events"],
			["updatePresence", "Update Presence"],
			["listenTyping", "Listen Typing"],
			["selfListen", "Self Listen"],
			["selfListenEvent", "Self Listen Event"],
			["autoMarkDelivery", "Auto Mark Delivery"],
			["autoReconnect", "Auto Reconnect"]
		],
		afterToggle: (api, key, val) => {
			try { api.setOptions({ [key]: val }); } catch (e) { }
		}
	},
	notiMqttGmail: {
		title: "📧 MQTT Error Notify — Gmail",
		path: ["notiWhenListenMqttError", "gmail"],
		items: [["enable", "Enable"]]
	},
	notiMqttTelegram: {
		title: "📨 MQTT Error Notify — Telegram",
		path: ["notiWhenListenMqttError", "telegram"],
		items: [["enable", "Enable"]]
	},
	notiMqttDiscord: {
		title: "📢 MQTT Error Notify — Discord",
		path: ["notiWhenListenMqttError", "discordHook"],
		items: [["enable", "Enable"]]
	}
};

function renderBoolGroupMenu(config, groupKey) {
	const group = BOOL_GROUPS[groupKey];
	const sub = getPath(config, group.path) || {};
	const lines = [group.title, "━━━━━━━━━━━━━━━━━"];
	group.items.forEach(([key, label], i) => {
		lines.push(`${i + 1}. ${label} — ${status(sub[key])}`);
	});
	lines.push("━━━━━━━━━━━━━━━━━", "› Reply a number to toggle, or 0 to go back");
	return lines.join("\n");
}

const CATEGORIES = [
	{
		title: "🔐 Account & Security",
		items: [
			{ num: 1, label: "Facebook Account" },
			{ num: 17, label: "Credentials (Gmail / reCAPTCHA)" }
		]
	},
	{
		title: "🤖 Bot Behavior",
		items: [
			{ num: 2, label: "Bot Behavior" },
			{ num: 5, label: "No Prefix" },
			{ num: 7, label: "Nickname" },
			{ num: 9, label: "Typing Indicator" }
		]
	},
	{
		title: "👥 Access Control",
		items: [
			{ num: 3, label: "Admin Manage" },
			{ num: 4, label: "Whitelist Manage" },
			{ num: 6, label: "React Unsend" }
		]
	},
	{
		title: "🧩 Connection (FCA / MQTT)",
		items: [
			{ num: 8, label: "FCA Options" },
			{ num: 13, label: "Restart Listen MQTT" },
			{ num: 14, label: "MQTT Error Notify" },
			{ num: 18, label: "E2EE" }
		]
	},
	{
		title: "🗄️ Database & Storage",
		items: [
			{ num: 10, label: "Database" }
		]
	},
	{
		title: "📊 Dashboard & Monitoring",
		items: [
			{ num: 11, label: "Dashboard & Uptime" },
			{ num: 12, label: "Auto Load Scripts" }
		]
	},
	{
		title: "📝 Logging",
		items: [
			{ num: 15, label: "Hide Notification Messages" },
			{ num: 16, label: "Log Events" }
		]
	}
];

function renderCategoryList() {
	const lines = ["⚙️ Bot Settings", "━━━━━━━━━━━━━━━━━"];
	CATEGORIES.forEach((cat, i) => lines.push(`${i + 1}. ${cat.title}`));
	lines.push("━━━━━━━━━━━━━━━━━", `› Reply 1-${CATEGORIES.length} to enter a category`);
	return lines.join("\n");
}

function renderCategoryItems(catIndex) {
	const cat = CATEGORIES[catIndex];
	const lines = [cat.title, "━━━━━━━━━━━━━━━━━"];
	cat.items.forEach((item, i) => lines.push(`${i + 1}. ${item.label}`));
	lines.push("━━━━━━━━━━━━━━━━━", "› Reply a number, or 0 to go back to categories");
	return lines.join("\n");
}

module.exports = {
	config: {
		name: "setting",
		aliases: ["settings"],
		version: "5.0.0",
		author: "EryXenX",
		countDown: 5,
		role: 2,
		shortDescription: "Bot settings",
		longDescription: "Control every bot setting from chat, organized by category",
		category: "admin",
		guide: "{prefix}setting"
	},

	onStart: async function ({ event, message }) {
		const sent = await message.reply(renderCategoryList());
		global.GoatBot.onReply.set(sent.messageID, {
			commandName: "setting",
			messageID: sent.messageID,
			author: event.senderID,
			state: "categories"
		});
	},

	onReply: async function ({ api, event, Reply, message }) {
		const { author, state } = Reply;
		if (event.senderID !== author) return;

		const configPath = path.join(process.cwd(), "config.json");
		const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
		const input = event.body.trim();
		let num = parseInt(input);

		function saveConfig() {
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
		}

		async function sendAndListen(text, newState, extra = {}) {
			const sent = await message.reply(text);
			global.GoatBot.onReply.set(sent.messageID, {
				commandName: "setting",
				messageID: sent.messageID,
				author,
				state: newState,
				...extra
			});
		}

		async function backToCategories() {
			return await sendAndListen(renderCategoryList(), "categories");
		}

		if (state === "categories") {
			const cat = CATEGORIES[num - 1];
			if (!cat) return message.reply(`𝗫 Invalid selection. Reply 1-${CATEGORIES.length}.`);
			return await sendAndListen(renderCategoryItems(num - 1), "categoryItems", { catIndex: num - 1 });
		}

		if (state === "categoryItems") {
			if (num === 0) return backToCategories();
			const cat = CATEGORIES[Reply.catIndex];
			const item = cat && cat.items[num - 1];
			if (!item) return message.reply("𝗫 Invalid selection.");
			num = item.num; // fall through to the existing item logic below
		}

		if (BOOL_GROUPS[state]) {
			const group = BOOL_GROUPS[state];
			if (num === 0) return backToCategories();
			const item = group.items[num - 1];
			if (!item) return message.reply("𝗫 Invalid selection. Reply a number from the list, or 0 to go back.");
			const [key] = item;
			const sub = getPath(config, group.path) || {};
			sub[key] = !sub[key];
			setPath(config, group.path, sub);
			saveConfig();
			if (group.afterToggle) group.afterToggle(api, key, sub[key]);
			return await sendAndListen(renderBoolGroupMenu(config, state), state);
		}

		if (state === "categoryItems" || state === "itemMenu") {
			if (num === 1) {
				const fb = config.facebookAccount || {};
				const menu = [
					"👤 Facebook Account",
					"━━━━━━━━━━━━━━━━━",
					`1. Email — ${fb.email || "Not set ✕"}`,
					`2. Password — ${masked(fb.password)}`,
					`3. 2FA Secret — ${masked(fb["2FASecret"])}`,
					`4. i_user — ${masked(fb.i_user)}`,
					`5. Proxy — ${fb.proxy || "Not set ✕"}`,
					`6. User Agent — ${fb.userAgent ? "Set ✦" : "Not set ✕"}`,
					`7. Cookie Refresh Interval — ${fb.intervalGetNewCookie ?? "Not set"} min`,
					"━━━━━━━━━━━━━━━━━",
					"⚠️ Changes here need a bot restart to take effect.",
					"› Reply 1-7"
				].join("\n");
				return await sendAndListen(menu, "fbAccount");
			}
			if (num === 2) {
				const menu = [
					"🤖 Bot Behavior",
					"━━━━━━━━━━━━━━━━━",
					`1. Prefix — ${config.prefix || "/"}`,
					`2. Language — ${config.language || "en"}`,
					`3. Time Zone — ${config.timeZone || "Not set"}`,
					`4. Anti Inbox — ${status(config.antiInbox)}`,
					`5. Admin Only — ${status(config.adminOnly?.enable)}`,
					`6. Only Admin Box — ${status(config.onlyAdminBox)}`,
					`7. Auto Refresh Fbstate — ${status(config.autoRefreshFbstate)}`,
					`8. Auto Relogin On Account Change — ${status(config.autoReloginWhenChangeAccount)}`,
					`9. Auto Restart On MQTT Error — ${status(config.autoRestartWhenListenMqttError)}`,
					`10. Auto Restart Time (cron/ms) — ${config.autoRestart?.time ?? "Not set"}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-10"
				].join("\n");
				return await sendAndListen(menu, "botBehavior");
			}
			if (num === 3) {
				const menu = [
					"⚙️ Admin Manage",
					"━━━━━━━━━━━━━━━━━",
					"1. Add Admin",
					"2. Remove Admin",
					"3. List Admins",
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-3"
				].join("\n");
				return await sendAndListen(menu, "adminManage");
			}
			if (num === 4) {
				const menu = [
					"⚙️ Whitelist Manage",
					"━━━━━━━━━━━━━━━━━",
					`1. Thread Whitelist — ${status(config.whiteListModeThread?.enable)}`,
					"2. Add Thread",
					"3. Remove Thread",
					`4. User Whitelist — ${status(config.whiteListMode?.enable)}`,
					"5. Add User",
					"6. Remove User",
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-6"
				].join("\n");
				return await sendAndListen(menu, "whitelist");
			}
			if (num === 5) {
				config.noPrefix = config.noPrefix || {};
				config.noPrefix.enable = !config.noPrefix.enable;
				saveConfig();
				return message.reply(`✦ No Prefix — ${status(config.noPrefix.enable)}`);
			}
			if (num === 6) {
				const menu = [
					"⚙️ React Unsend",
					"━━━━━━━━━━━━━━━━━",
					`1. Toggle — ${status(config.reactUnsend?.enable)}`,
					`2. Only Admin — ${status(config.reactUnsend?.onlyAdmin)}`,
					"3. Add Emoji",
					"4. Remove Emoji",
					"5. List Emojis",
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-5"
				].join("\n");
				return await sendAndListen(menu, "reactUnsend");
			}
			if (num === 7) {
				const current = config.nickNameBot || "Not set";
				const menu = [
					"⚙️ Nickname",
					"━━━━━━━━━━━━━━━━━",
					`› Current: ${current}`,
					"━━━━━━━━━━━━━━━━━",
					"1. Set Nickname (this group)",
					"2. Set Nickname (all groups)",
					"3. Reset Nickname",
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-3"
				].join("\n");
				return await sendAndListen(menu, "nickname");
			}
			if (num === 8) return await sendAndListen(renderBoolGroupMenu(config, "fcaOptions"), "fcaOptions");
			if (num === 9) {
				const menu = [
					"⚙️ Typing Indicator",
					"━━━━━━━━━━━━━━━━━",
					`1. Toggle — ${status(config.enableTypingIndicator)}`,
					`2. Duration — ${config.typingDuration || 2000}ms`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-2"
				].join("\n");
				return await sendAndListen(menu, "typingIndicator");
			}
			if (num === 10) {
				const db = config.database || {};
				const menu = [
					"🗄️ Database",
					"━━━━━━━━━━━━━━━━━",
					`1. Type — ${db.type || "Not set"} (needs restart to change)`,
					`2. MongoDB URI — ${masked(db.uriMongodb)}`,
					`3. Auto Sync When Start — ${status(db.autoSyncWhenStart)}`,
					`4. Auto Refresh Thread Info (first time) — ${status(db.autoRefreshThreadInfoFirstTime)}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-4"
				].join("\n");
				return await sendAndListen(menu, "database");
			}
			if (num === 11) {
				const dash = config.dashBoard || {};
				const up = config.serverUptime || {};
				const auto = config.autoUptime || {};
				const menu = [
					"📊 Dashboard & Uptime",
					"━━━━━━━━━━━━━━━━━",
					`1. Dashboard Enable — ${status(dash.enable)}`,
					`2. Dashboard Port — ${dash.port ?? "Not set"}`,
					`3. Dashboard Verify Code Expiry (ms) — ${dash.expireVerifyCode ?? "Not set"}`,
					`4. Server Uptime Enable — ${status(up.enable)}`,
					`5. Server Uptime Port — ${up.port ?? "Not set"}`,
					`6. Server Uptime Socket Enable — ${status(up.socket?.enable)}`,
					`7. Server Uptime Channel Name — ${up.socket?.channelName || "Not set"}`,
					`8. Auto Uptime Enable — ${status(auto.enable)}`,
					`9. Auto Uptime Interval (s) — ${auto.timeInterval ?? "Not set"}`,
					`10. Auto Uptime URL — ${auto.url || "Not set"}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-10"
				].join("\n");
				return await sendAndListen(menu, "dashboardUptime");
			}
			if (num === 12) {
				const a = config.autoLoadScripts || {};
				const menu = [
					"📜 Auto Load Scripts",
					"━━━━━━━━━━━━━━━━━",
					`1. Enable — ${status(a.enable)}`,
					`2. Ignore Commands — ${a.ignoreCmds || "(none)"}`,
					`3. Ignore Events — ${a.ignoreEvents || "(none)"}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-3"
				].join("\n");
				return await sendAndListen(menu, "autoLoadScripts");
			}
			if (num === 13) {
				const r = config.restartListenMqtt || {};
				const menu = [
					"🔁 Restart Listen MQTT",
					"━━━━━━━━━━━━━━━━━",
					`1. Enable — ${status(r.enable)}`,
					`2. Restart Interval (ms) — ${r.timeRestart ?? "Not set"}`,
					`3. Delay After Stop (ms) — ${r.delayAfterStopListening ?? "Not set"}`,
					`4. Log Notification — ${status(r.logNoti)}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-4"
				].join("\n");
				return await sendAndListen(menu, "restartListenMqtt");
			}
			if (num === 14) {
				const menu = [
					"🔔 MQTT Error Notify",
					"━━━━━━━━━━━━━━━━━",
					"1. Gmail",
					"2. Telegram",
					"3. Discord",
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-3"
				].join("\n");
				return await sendAndListen(menu, "notiMqttPick");
			}
			if (num === 15) return await sendAndListen(renderBoolGroupMenu(config, "hideNoti"), "hideNoti");
			if (num === 16) return await sendAndListen(renderBoolGroupMenu(config, "logEvents"), "logEvents");
			if (num === 17) {
				const g = config.credentials?.gmailAccount || {};
				const r = config.credentials?.gRecaptcha || {};
				const menu = [
					"🔑 Credentials",
					"━━━━━━━━━━━━━━━━━",
					`1. Gmail Email — ${g.email || "Not set ✕"}`,
					`2. Gmail Client ID — ${masked(g.clientId)}`,
					`3. Gmail Client Secret — ${masked(g.clientSecret)}`,
					`4. Gmail Refresh Token — ${masked(g.refreshToken)}`,
					`5. Gmail API Key — ${masked(g.apiKey)}`,
					`6. reCAPTCHA Site Key — ${masked(r.siteKey)}`,
					`7. reCAPTCHA Secret Key — ${masked(r.secretKey)}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-7"
				].join("\n");
				return await sendAndListen(menu, "credentials");
			}
			if (num === 18) {
				config.e2ee = config.e2ee || {};
				config.e2ee.enable = !config.e2ee.enable;
				saveConfig();
				return message.reply(`✦ E2EE — ${status(config.e2ee.enable)}\n⚠️ Needs a bot restart to take effect.`);
			}
		}

		if (state === "fbAccount") {
			const fields = [
				["email", "Email", "text"],
				["password", "Password", "text"],
				["2FASecret", "2FA Secret", "text"],
				["i_user", "i_user", "text"],
				["proxy", "Proxy", "text"],
				["userAgent", "User Agent", "text"],
				["intervalGetNewCookie", "Cookie Refresh Interval (minutes)", "number"]
			];
			const field = fields[num - 1];
			if (!field) return message.reply("𝗫 Invalid selection.");
			const [key, label, type] = field;
			return await sendAndListen(`› Reply with new value for ${label}:`, "fbAccountSet", { fieldKey: key, fieldType: type });
		}
		if (state === "fbAccountSet") {
			const { fieldKey, fieldType } = Reply;
			let value = input;
			if (fieldType === "number") {
				if (isNaN(num)) return message.reply("𝗫 Invalid number.");
				value = num;
			}
			config.facebookAccount = config.facebookAccount || {};
			config.facebookAccount[fieldKey] = value;
			saveConfig();
			return message.reply(`✦ Updated. (Restart the bot for this to take effect.)`);
		}

		if (state === "botBehavior") {
			if (num === 1) return await sendAndListen("› Reply with new prefix:", "prefixSet");
			if (num === 2) return await sendAndListen("› Reply with new language code (e.g. en, bn):", "languageSet");
			if (num === 3) return await sendAndListen("› Reply with new time zone (e.g. Asia/Dhaka):", "timeZoneSet");
			if (num === 4) {
				config.antiInbox = !config.antiInbox;
				saveConfig();
				return message.reply(`✦ Anti Inbox — ${status(config.antiInbox)}`);
			}
			if (num === 5) {
				config.adminOnly = config.adminOnly || {};
				config.adminOnly.enable = !config.adminOnly.enable;
				saveConfig();
				return message.reply(`✦ Admin Only — ${status(config.adminOnly.enable)}`);
			}
			if (num === 6) {
				config.onlyAdminBox = !config.onlyAdminBox;
				saveConfig();
				return message.reply(`✦ Only Admin Box — ${status(config.onlyAdminBox)}`);
			}
			if (num === 7) {
				config.autoRefreshFbstate = !config.autoRefreshFbstate;
				saveConfig();
				return message.reply(`✦ Auto Refresh Fbstate — ${status(config.autoRefreshFbstate)}`);
			}
			if (num === 8) {
				config.autoReloginWhenChangeAccount = !config.autoReloginWhenChangeAccount;
				saveConfig();
				return message.reply(`✦ Auto Relogin On Account Change — ${status(config.autoReloginWhenChangeAccount)}`);
			}
			if (num === 9) {
				config.autoRestartWhenListenMqttError = !config.autoRestartWhenListenMqttError;
				saveConfig();
				return message.reply(`✦ Auto Restart On MQTT Error — ${status(config.autoRestartWhenListenMqttError)}`);
			}
			if (num === 10) return await sendAndListen("› Reply with new Auto Restart time (ms, or cron string, or 'null' to disable):", "autoRestartTimeSet");
		}
		if (state === "prefixSet") {
			if (!input) return message.reply("𝗫 Invalid prefix.");
			config.prefix = input;
			saveConfig();
			return message.reply(`✦ Prefix set to: ${input}`);
		}
		if (state === "languageSet") {
			if (!input) return message.reply("𝗫 Invalid language code.");
			config.language = input;
			saveConfig();
			return message.reply(`✦ Language set to: ${input}`);
		}
		if (state === "timeZoneSet") {
			if (!input) return message.reply("𝗫 Invalid time zone.");
			config.timeZone = input;
			saveConfig();
			return message.reply(`✦ Time Zone set to: ${input}`);
		}
		if (state === "autoRestartTimeSet") {
			config.autoRestart = config.autoRestart || {};
			config.autoRestart.time = input === "null" ? null : (isNaN(num) ? input : num);
			saveConfig();
			return message.reply(`✦ Auto Restart time set to: ${config.autoRestart.time}`);
		}

		if (state === "adminManage") {
			if (num === 1) return await sendAndListen("› Reply with UID or tag user to add as admin:", "adminAdd");
			if (num === 2) {
				const admins = config.adminBot || [];
				if (!admins.length) return message.reply("𝗫 No admins found.");
				const list = admins.map((id, i) => `${i + 1}. ${id}`).join("\n");
				await message.reply(`⚙️ Select admin to remove:\n━━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━━\n› Reply number`);
				return await sendAndListen("› Waiting...", "adminRemoveSelect");
			}
			if (num === 3) {
				const admins = config.adminBot || [];
				if (!admins.length) return message.reply("𝗫 No admins found.");
				return message.reply(`⚙️ Admins:\n━━━━━━━━━━━━━━━━━\n› ${admins.join("\n› ")}`);
			}
		}

		if (state === "adminAdd") {
			let uid = input;
			if (event.mentions && Object.keys(event.mentions).length > 0) uid = Object.keys(event.mentions)[0];
			if (!uid || isNaN(uid)) return message.reply("𝗫 Invalid UID.");
			config.adminBot = config.adminBot || [];
			if (config.adminBot.includes(uid)) return message.reply("𝗫 Already an admin.");
			config.adminBot.push(uid);
			saveConfig();
			return message.reply(`✦ Added ${uid} as admin.`);
		}

		if (state === "adminRemoveSelect") {
			const admins = config.adminBot || [];
			const idx = num - 1;
			if (isNaN(num) || !admins[idx]) return message.reply("𝗫 Invalid selection.");
			const removed = admins.splice(idx, 1)[0];
			config.adminBot = admins;
			saveConfig();
			return message.reply(`✦ Removed ${removed} from admins.`);
		}

		if (state === "whitelist") {
			if (num === 1) {
				config.whiteListModeThread = config.whiteListModeThread || {};
				config.whiteListModeThread.enable = !config.whiteListModeThread.enable;
				saveConfig();
				return message.reply(`✦ Thread Whitelist — ${status(config.whiteListModeThread.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with Thread ID to add:", "threadAdd");
			if (num === 3) {
				const threads = config.whiteListModeThread?.whiteListThreadIds || [];
				if (!threads.length) return message.reply("𝗫 No threads found.");
				const list = threads.map((id, i) => `${i + 1}. ${id}`).join("\n");
				await message.reply(`⚙️ Select thread to remove:\n━━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━━\n› Reply number`);
				return await sendAndListen("› Waiting...", "threadRemoveSelect");
			}
			if (num === 4) {
				config.whiteListMode = config.whiteListMode || {};
				config.whiteListMode.enable = !config.whiteListMode.enable;
				saveConfig();
				return message.reply(`✦ User Whitelist — ${status(config.whiteListMode.enable)}`);
			}
			if (num === 5) return await sendAndListen("› Reply with UID or tag user to add:", "userAdd");
			if (num === 6) {
				const users = config.whiteListMode?.whiteListIds || [];
				if (!users.length) return message.reply("𝗫 No users found.");
				const list = users.map((id, i) => `${i + 1}. ${id}`).join("\n");
				await message.reply(`⚙️ Select user to remove:\n━━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━━\n› Reply number`);
				return await sendAndListen("› Waiting...", "userRemoveSelect");
			}
		}

		if (state === "threadAdd") {
			const tid = input;
			if (!tid || isNaN(tid)) return message.reply("𝗫 Invalid Thread ID.");
			config.whiteListModeThread = config.whiteListModeThread || {};
			config.whiteListModeThread.whiteListThreadIds = config.whiteListModeThread.whiteListThreadIds || [];
			if (config.whiteListModeThread.whiteListThreadIds.includes(tid)) return message.reply("𝗫 Already in whitelist.");
			config.whiteListModeThread.whiteListThreadIds.push(tid);
			saveConfig();
			return message.reply(`✦ Thread ${tid} added.`);
		}

		if (state === "threadRemoveSelect") {
			const threads = config.whiteListModeThread?.whiteListThreadIds || [];
			const idx = num - 1;
			if (isNaN(num) || !threads[idx]) return message.reply("𝗫 Invalid selection.");
			const removed = threads.splice(idx, 1)[0];
			config.whiteListModeThread.whiteListThreadIds = threads;
			saveConfig();
			return message.reply(`✦ Thread ${removed} removed.`);
		}

		if (state === "userAdd") {
			let uid = input;
			if (event.mentions && Object.keys(event.mentions).length > 0) uid = Object.keys(event.mentions)[0];
			if (!uid || isNaN(uid)) return message.reply("𝗫 Invalid UID.");
			config.whiteListMode = config.whiteListMode || {};
			config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds || [];
			if (config.whiteListMode.whiteListIds.includes(uid)) return message.reply("𝗫 Already in whitelist.");
			config.whiteListMode.whiteListIds.push(uid);
			saveConfig();
			return message.reply(`✦ User ${uid} added.`);
		}

		if (state === "userRemoveSelect") {
			const users = config.whiteListMode?.whiteListIds || [];
			const idx = num - 1;
			if (isNaN(num) || !users[idx]) return message.reply("𝗫 Invalid selection.");
			const removed = users.splice(idx, 1)[0];
			config.whiteListMode.whiteListIds = users;
			saveConfig();
			return message.reply(`✦ User ${removed} removed.`);
		}

		if (state === "reactUnsend") {
			if (num === 1) {
				config.reactUnsend = config.reactUnsend || {};
				config.reactUnsend.enable = !config.reactUnsend.enable;
				saveConfig();
				return message.reply(`✦ React Unsend — ${status(config.reactUnsend.enable)}`);
			}
			if (num === 2) {
				config.reactUnsend = config.reactUnsend || {};
				config.reactUnsend.onlyAdmin = !config.reactUnsend.onlyAdmin;
				saveConfig();
				return message.reply(`✦ Only Admin — ${status(config.reactUnsend.onlyAdmin)}`);
			}
			if (num === 3) return await sendAndListen("› Reply with emoji to add:", "emojiAdd");
			if (num === 4) {
				const emojis = config.reactUnsend?.emojis || [];
				if (!emojis.length) return message.reply("𝗫 No emojis found.");
				const list = emojis.map((e, i) => `${i + 1}. ${e}`).join("\n");
				await message.reply(`⚙️ Select emoji to remove:\n━━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━━\n› Reply number`);
				return await sendAndListen("› Waiting...", "emojiRemoveSelect");
			}
			if (num === 5) {
				const emojis = config.reactUnsend?.emojis || [];
				if (!emojis.length) return message.reply("𝗫 No emojis.");
				return message.reply(`⚙️ Emojis:\n━━━━━━━━━━━━━━━━━\n› ${emojis.join("  ")}`);
			}
		}

		if (state === "emojiAdd") {
			const emoji = input.trim();
			if (!emoji) return message.reply("𝗫 Invalid emoji.");
			config.reactUnsend = config.reactUnsend || {};
			config.reactUnsend.emojis = config.reactUnsend.emojis || [];
			if (config.reactUnsend.emojis.includes(emoji)) return message.reply("𝗫 Already added.");
			config.reactUnsend.emojis.push(emoji);
			saveConfig();
			return message.reply(`✦ Emoji ${emoji} added.`);
		}

		if (state === "emojiRemoveSelect") {
			const emojis = config.reactUnsend?.emojis || [];
			const idx = num - 1;
			if (isNaN(num) || !emojis[idx]) return message.reply("𝗫 Invalid selection.");
			const removed = emojis.splice(idx, 1)[0];
			config.reactUnsend.emojis = emojis;
			saveConfig();
			return message.reply(`✦ Emoji ${removed} removed.`);
		}

		if (state === "nickname") {
			if (num === 1) return await sendAndListen("› Reply with new nickname:", "nicknameSet");
			if (num === 2) return await sendAndListen("› Reply with new nickname (will set in all groups):", "nicknameSetAll");
			if (num === 3) {
				config.nickNameBot = "";
				saveConfig();
				try { await api.changeNickname("", event.threadID, api.getCurrentUserID()); } catch (e) { }
				return message.reply("✦ Nickname reset.");
			}
		}

		if (state === "nicknameSet") {
			const nickname = input;
			if (!nickname) return message.reply("𝗫 Invalid nickname.");
			config.nickNameBot = nickname;
			saveConfig();
			try { await api.changeNickname(nickname, event.threadID, api.getCurrentUserID()); } catch (e) { }
			return message.reply(`✦ Nickname set to: ${nickname}`);
		}

		if (state === "nicknameSetAll") {
			const nickname = input;
			if (!nickname) return message.reply("𝗫 Invalid nickname.");
			config.nickNameBot = nickname;
			saveConfig();
			const threads = await api.getThreadList(100, null, ["INBOX"]);
			let success = 0;
			for (const thread of threads) {
				if (!thread.isGroup) continue;
				try { await api.changeNickname(nickname, thread.threadID, api.getCurrentUserID()); success++; } catch (e) { }
			}
			return message.reply(`✦ Nickname set to: ${nickname}\n› Updated in ${success} groups.`);
		}

		if (state === "typingIndicator") {
			if (num === 1) {
				config.enableTypingIndicator = !config.enableTypingIndicator;
				saveConfig();
				return message.reply(`✦ Typing Indicator — ${status(config.enableTypingIndicator)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with duration in milliseconds (e.g. 2000 for 2s):", "typingDurationSet");
		}
		if (state === "typingDurationSet") {
			if (isNaN(num) || num < 500 || num > 15000) return message.reply("𝗫 Invalid duration. Use a value between 500 and 15000 ms.");
			config.typingDuration = num;
			saveConfig();
			return message.reply(`✦ Typing Duration set to: ${num}ms`);
		}

		if (state === "database") {
			if (num === 1) return message.reply("𝗫 Database type can't be changed live — edit config.json manually and restart the bot.");
			if (num === 2) return await sendAndListen("› Reply with new MongoDB URI:", "mongoUriSet");
			if (num === 3) {
				config.database = config.database || {};
				config.database.autoSyncWhenStart = !config.database.autoSyncWhenStart;
				saveConfig();
				return message.reply(`✦ Auto Sync When Start — ${status(config.database.autoSyncWhenStart)}`);
			}
			if (num === 4) {
				config.database = config.database || {};
				config.database.autoRefreshThreadInfoFirstTime = !config.database.autoRefreshThreadInfoFirstTime;
				saveConfig();
				return message.reply(`✦ Auto Refresh Thread Info — ${status(config.database.autoRefreshThreadInfoFirstTime)}`);
			}
		}
		if (state === "mongoUriSet") {
			if (!input) return message.reply("𝗫 Invalid URI.");
			config.database = config.database || {};
			config.database.uriMongodb = input;
			saveConfig();
			return message.reply("✦ MongoDB URI updated. (Restart the bot for this to take effect.)");
		}

		if (state === "dashboardUptime") {
			config.dashBoard = config.dashBoard || {};
			config.serverUptime = config.serverUptime || {};
			config.serverUptime.socket = config.serverUptime.socket || {};
			config.autoUptime = config.autoUptime || {};
			if (num === 1) {
				config.dashBoard.enable = !config.dashBoard.enable;
				saveConfig();
				return message.reply(`✦ Dashboard Enable — ${status(config.dashBoard.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with new Dashboard port:", "dashPortSet");
			if (num === 3) return await sendAndListen("› Reply with new Verify Code expiry (ms):", "dashExpirySet");
			if (num === 4) {
				config.serverUptime.enable = !config.serverUptime.enable;
				saveConfig();
				return message.reply(`✦ Server Uptime Enable — ${status(config.serverUptime.enable)}`);
			}
			if (num === 5) return await sendAndListen("› Reply with new Server Uptime port:", "uptimePortSet");
			if (num === 6) {
				config.serverUptime.socket.enable = !config.serverUptime.socket.enable;
				saveConfig();
				return message.reply(`✦ Server Uptime Socket Enable — ${status(config.serverUptime.socket.enable)}`);
			}
			if (num === 7) return await sendAndListen("› Reply with new channel name:", "uptimeChannelSet");
			if (num === 8) {
				config.autoUptime.enable = !config.autoUptime.enable;
				saveConfig();
				return message.reply(`✦ Auto Uptime Enable — ${status(config.autoUptime.enable)}`);
			}
			if (num === 9) return await sendAndListen("› Reply with new interval in seconds:", "autoUptimeIntervalSet");
			if (num === 10) return await sendAndListen("› Reply with new Auto Uptime URL:", "autoUptimeUrlSet");
		}
		if (state === "dashPortSet") {
			if (isNaN(num)) return message.reply("𝗫 Invalid port.");
			config.dashBoard.port = num;
			saveConfig();
			return message.reply(`✦ Dashboard port set to: ${num}`);
		}
		if (state === "dashExpirySet") {
			if (isNaN(num)) return message.reply("𝗫 Invalid value.");
			config.dashBoard.expireVerifyCode = num;
			saveConfig();
			return message.reply(`✦ Verify Code expiry set to: ${num}ms`);
		}
		if (state === "uptimePortSet") {
			if (isNaN(num)) return message.reply("𝗫 Invalid port.");
			config.serverUptime.port = num;
			saveConfig();
			return message.reply(`✦ Server Uptime port set to: ${num}`);
		}
		if (state === "uptimeChannelSet") {
			if (!input) return message.reply("𝗫 Invalid channel name.");
			config.serverUptime.socket.channelName = input;
			saveConfig();
			return message.reply(`✦ Channel name set to: ${input}`);
		}
		if (state === "autoUptimeIntervalSet") {
			if (isNaN(num)) return message.reply("𝗫 Invalid value.");
			config.autoUptime.timeInterval = num;
			saveConfig();
			return message.reply(`✦ Interval set to: ${num}s`);
		}
		if (state === "autoUptimeUrlSet") {
			if (!input) return message.reply("𝗫 Invalid URL.");
			config.autoUptime.url = input;
			saveConfig();
			return message.reply(`✦ URL set to: ${input}`);
		}

		if (state === "autoLoadScripts") {
			config.autoLoadScripts = config.autoLoadScripts || {};
			if (num === 1) {
				config.autoLoadScripts.enable = !config.autoLoadScripts.enable;
				saveConfig();
				return message.reply(`✦ Auto Load Scripts — ${status(config.autoLoadScripts.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with comma-separated command names to ignore:", "ignoreCmdsSet");
			if (num === 3) return await sendAndListen("› Reply with comma-separated event names to ignore:", "ignoreEventsSet");
		}
		if (state === "ignoreCmdsSet") {
			config.autoLoadScripts.ignoreCmds = input;
			saveConfig();
			return message.reply(`✦ Ignore Commands set to: ${input || "(none)"}`);
		}
		if (state === "ignoreEventsSet") {
			config.autoLoadScripts.ignoreEvents = input;
			saveConfig();
			return message.reply(`✦ Ignore Events set to: ${input || "(none)"}`);
		}

		if (state === "restartListenMqtt") {
			config.restartListenMqtt = config.restartListenMqtt || {};
			if (num === 1) {
				config.restartListenMqtt.enable = !config.restartListenMqtt.enable;
				saveConfig();
				return message.reply(`✦ Restart Listen MQTT Enable — ${status(config.restartListenMqtt.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with new restart interval (ms):", "mqttTimeRestartSet");
			if (num === 3) return await sendAndListen("› Reply with new delay after stop (ms):", "mqttDelaySet");
			if (num === 4) {
				config.restartListenMqtt.logNoti = !config.restartListenMqtt.logNoti;
				saveConfig();
				return message.reply(`✦ Log Notification — ${status(config.restartListenMqtt.logNoti)}`);
			}
		}
		if (state === "mqttTimeRestartSet") {
			if (isNaN(num)) return message.reply("𝗫 Invalid value.");
			config.restartListenMqtt.timeRestart = num;
			saveConfig();
			return message.reply(`✦ Restart interval set to: ${num}ms`);
		}
		if (state === "mqttDelaySet") {
			if (isNaN(num)) return message.reply("𝗫 Invalid value.");
			config.restartListenMqtt.delayAfterStopListening = num;
			saveConfig();
			return message.reply(`✦ Delay set to: ${num}ms`);
		}

		if (state === "notiMqttPick") {
			if (num === 1) return await sendAndListen(renderBoolGroupMenu(config, "notiMqttGmail") + "\n\n2. Set Notify Email\n0. Back", "notiMqttGmailMenu");
			if (num === 2) return await sendAndListen(renderBoolGroupMenu(config, "notiMqttTelegram") + "\n\n2. Set Bot Token\n3. Set Chat ID\n0. Back", "notiMqttTelegramMenu");
			if (num === 3) return await sendAndListen(renderBoolGroupMenu(config, "notiMqttDiscord") + "\n\n2. Set Webhook URL\n0. Back", "notiMqttDiscordMenu");
		}
		if (state === "notiMqttGmailMenu") {
			config.notiWhenListenMqttError = config.notiWhenListenMqttError || {};
			config.notiWhenListenMqttError.gmail = config.notiWhenListenMqttError.gmail || {};
			if (num === 0) {
				const menu = ["🔔 MQTT Error Notify", "━━━━━━━━━━━━━━━━━", "1. Gmail", "2. Telegram", "3. Discord", "━━━━━━━━━━━━━━━━━", "› Reply 1-3"].join("\n");
				return await sendAndListen(menu, "notiMqttPick");
			}
			if (num === 1) {
				config.notiWhenListenMqttError.gmail.enable = !config.notiWhenListenMqttError.gmail.enable;
				saveConfig();
				return message.reply(`✦ Gmail Notify — ${status(config.notiWhenListenMqttError.gmail.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with notify email:", "notiGmailEmailSet");
		}
		if (state === "notiGmailEmailSet") {
			if (!input) return message.reply("𝗫 Invalid email.");
			config.notiWhenListenMqttError.gmail.emailGetNoti = input;
			saveConfig();
			return message.reply(`✦ Notify email set to: ${input}`);
		}
		if (state === "notiMqttTelegramMenu") {
			config.notiWhenListenMqttError = config.notiWhenListenMqttError || {};
			config.notiWhenListenMqttError.telegram = config.notiWhenListenMqttError.telegram || {};
			if (num === 1) {
				config.notiWhenListenMqttError.telegram.enable = !config.notiWhenListenMqttError.telegram.enable;
				saveConfig();
				return message.reply(`✦ Telegram Notify — ${status(config.notiWhenListenMqttError.telegram.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with bot token:", "notiTgTokenSet");
			if (num === 3) return await sendAndListen("› Reply with chat ID:", "notiTgChatSet");
		}
		if (state === "notiTgTokenSet") {
			config.notiWhenListenMqttError.telegram.botToken = input;
			saveConfig();
			return message.reply("✦ Bot token updated.");
		}
		if (state === "notiTgChatSet") {
			config.notiWhenListenMqttError.telegram.chatId = input;
			saveConfig();
			return message.reply(`✦ Chat ID set to: ${input}`);
		}
		if (state === "notiMqttDiscordMenu") {
			config.notiWhenListenMqttError = config.notiWhenListenMqttError || {};
			config.notiWhenListenMqttError.discordHook = config.notiWhenListenMqttError.discordHook || {};
			if (num === 1) {
				config.notiWhenListenMqttError.discordHook.enable = !config.notiWhenListenMqttError.discordHook.enable;
				saveConfig();
				return message.reply(`✦ Discord Notify — ${status(config.notiWhenListenMqttError.discordHook.enable)}`);
			}
			if (num === 2) return await sendAndListen("› Reply with webhook URL:", "notiDiscordUrlSet");
		}
		if (state === "notiDiscordUrlSet") {
			config.notiWhenListenMqttError.discordHook.webhookUrl = input;
			saveConfig();
			return message.reply("✦ Webhook URL updated.");
		}

		if (state === "credentials") {
			config.credentials = config.credentials || {};
			config.credentials.gmailAccount = config.credentials.gmailAccount || {};
			config.credentials.gRecaptcha = config.credentials.gRecaptcha || {};
			const fields = [
				["gmailAccount", "email", "Gmail Email"],
				["gmailAccount", "clientId", "Gmail Client ID"],
				["gmailAccount", "clientSecret", "Gmail Client Secret"],
				["gmailAccount", "refreshToken", "Gmail Refresh Token"],
				["gmailAccount", "apiKey", "Gmail API Key"],
				["gRecaptcha", "siteKey", "reCAPTCHA Site Key"],
				["gRecaptcha", "secretKey", "reCAPTCHA Secret Key"]
			];
			const field = fields[num - 1];
			if (!field) return message.reply("𝗫 Invalid selection.");
			const [section, key, label] = field;
			return await sendAndListen(`› Reply with new value for ${label}:`, "credentialSet", { credSection: section, credKey: key });
		}
		if (state === "credentialSet") {
			const { credSection, credKey } = Reply;
			config.credentials[credSection][credKey] = input;
			saveConfig();
			return message.reply("✦ Updated.");
		}
	}
};
