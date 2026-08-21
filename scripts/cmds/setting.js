const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "setting",
		version: "1.0.0",
		author: "EryXenX",
		countDown: 5,
		role: 2,
		shortDescription: "Bot settings",
		longDescription: "Control bot settings",
		category: "admin",
		guide: "{prefix}setting"
	},

	onStart: async function ({ api, event, args, message }) {
		const mainMenu = [
			"⚙️ Bot Settings",
			"━━━━━━━━━━━━━━━━━",
			"1. Bot Config",
			"2. Admin Manage",
			"3. Whitelist Manage",
			"4. No Prefix",
			"5. React Unsend",
			"6. Nickname",
			"7. FCA Options",
			"━━━━━━━━━━━━━━━━━",
			"› Reply 1-7 to enter"
		].join("\n");

		const sent = await message.reply(mainMenu);
		global.GoatBot.onReply.set(sent.messageID, {
			commandName: "setting",
			messageID: sent.messageID,
			author: event.senderID,
			state: "main"
		});
	},

	onReply: async function ({ api, event, Reply, message }) {
		const { author, state } = Reply;
		if (event.senderID !== author) return;

		const configPath = path.join(process.cwd(), "config.json");
		const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
		const input = event.body.trim();
		const num = parseInt(input);

		function saveConfig() {
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
		}

		function status(val) {
			return val ? "ON ✦" : "OFF ◌";
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

		if (state === "main") {
			if (num === 1) {
				const menu = [
					"⚙️ Bot Config",
					"━━━━━━━━━━━━━━━━━",
					`1. Admin Only — ${status(config.adminOnly?.enable)}`,
					`2. Auto Restart — ${status(config.autoRestart?.enable)}`,
					`3. Anti Inbox — ${status(config.antiInbox?.enable)}`,
					`4. Only Admin Box — ${status(config.onlyAdminBox)}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-4 to toggle"
				].join("\n");
				return await sendAndListen(menu, "botConfig");
			}
			if (num === 2) {
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
			if (num === 3) {
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
			if (num === 4) {
				config.noPrefix = config.noPrefix || {};
				config.noPrefix.enable = !config.noPrefix.enable;
				saveConfig();
				return message.reply(`✦ No Prefix — ${status(config.noPrefix.enable)}`);
			}
			if (num === 5) {
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
			if (num === 6) {
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
			if (num === 7) {
				const o = config.optionsFca || {};
				const menu = [
					"⚙️ FCA Options",
					"━━━━━━━━━━━━━━━━━",
					`1. Force Login — ${status(o.forceLogin)}`,
					`2. Listen Events — ${status(o.listenEvents)}`,
					`3. Update Presence — ${status(o.updatePresence)}`,
					`4. Listen Typing — ${status(o.listenTyping)}`,
					`5. Self Listen — ${status(o.selfListen)}`,
					`6. Self Listen Event — ${status(o.selfListenEvent)}`,
					`7. Auto Mark Delivery — ${status(o.autoMarkDelivery)}`,
					`8. Auto Reconnect — ${status(o.autoReconnect)}`,
					"━━━━━━━━━━━━━━━━━",
					"› Reply 1-8 to toggle"
				].join("\n");
				return await sendAndListen(menu, "fcaOptions");
			}
		}

		if (state === "botConfig") {
			if (num === 1) {
				config.adminOnly = config.adminOnly || {};
				config.adminOnly.enable = !config.adminOnly.enable;
				saveConfig();
				return message.reply(`✦ Admin Only — ${status(config.adminOnly.enable)}`);
			}
			if (num === 2) {
				config.autoRestart = config.autoRestart || {};
				config.autoRestart.enable = !config.autoRestart.enable;
				saveConfig();
				return message.reply(`✦ Auto Restart — ${status(config.autoRestart.enable)}`);
			}
			if (num === 3) {
				config.antiInbox = config.antiInbox || {};
				config.antiInbox.enable = !config.antiInbox.enable;
				saveConfig();
				return message.reply(`✦ Anti Inbox — ${status(config.antiInbox.enable)}`);
			}
			if (num === 4) {
				config.onlyAdminBox = !config.onlyAdminBox;
				saveConfig();
				return message.reply(`✦ Only Admin Box — ${status(config.onlyAdminBox)}`);
			}
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
				try { await api.changeNickname("", event.threadID, api.getCurrentUserID()); } catch (e) {}
				return message.reply("✦ Nickname reset.");
			}
		}

		if (state === "nicknameSet") {
			const nickname = input;
			if (!nickname) return message.reply("𝗫 Invalid nickname.");
			config.nickNameBot = nickname;
			saveConfig();
			try { await api.changeNickname(nickname, event.threadID, api.getCurrentUserID()); } catch (e) {}
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
				try { await api.changeNickname(nickname, thread.threadID, api.getCurrentUserID()); success++; } catch (e) {}
			}
			return message.reply(`✦ Nickname set to: ${nickname}\n› Updated in ${success} groups.`);
		}

		if (state === "fcaOptions") {
			const keys = ["forceLogin", "listenEvents", "updatePresence", "listenTyping", "selfListen", "selfListenEvent", "autoMarkDelivery", "autoReconnect"];
			const key = keys[num - 1];
			if (!key) return message.reply("𝗫 Invalid selection.");
			config.optionsFca = config.optionsFca || {};
			config.optionsFca[key] = !config.optionsFca[key];
			saveConfig();
			api.setOptions({ [key]: config.optionsFca[key] });
			return message.reply(`✦ ${key} — ${status(config.optionsFca[key])}`);
		}
	}
};
