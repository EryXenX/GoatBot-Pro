const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

const GIF_URL = "https://i.imgur.com/dcJ6kIH.mp4";

// Helper to get cached GIF stream to avoid 429 Rate Limits from Imgur
async function getGifStream() {
    const cacheDir = path.join(__dirname, "cache");
    const gifPath = path.join(cacheDir, "prefix_cache.gif");

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Download once if not cached locally
    if (!fs.existsSync(gifPath)) {
        try {
            const res = await axios.get(GIF_URL, {
                responseType: "arraybuffer",
                timeout: 15000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            fs.writeFileSync(gifPath, Buffer.from(res.data));
        } catch (e) {
            console.error("[Prefix GIF Error]:", e.message);
            return null; // Fallback gracefully if download fails
        }
    }

    return fs.existsSync(gifPath) ? fs.createReadStream(gifPath) : null;
}

module.exports = {
    config: {
        name: "prefix",
        version: "2.4.3",
        author: "APON",
        countDown: 3,
        role: 0,
        shortDescription: { en: "Change & show bot prefix" },
        longDescription: { en: "View current system/group prefix or request to change it with local cached animation." },
        category: "system",
        guide: { en: "{pn}\n{pn} <newPrefix>\n{pn} reset\n{pn} <newPrefix> -g" }
    },

    langs: {
        en: {
            usage: "❌ Usage:\n• {pn} <newPrefix> (Change group prefix)\n• {pn} <newPrefix> -g (Change global prefix)\n• {pn} reset (Reset group prefix)",
            reset: "✅ Group prefix reset successful!\n🔰 System prefix: %1",
            onlyAdmin: "⛔ Only bot admins can change the global prefix.",
            confirmGlobal: "⚙️ Global prefix change requested.\n👉 React to this message with any emoji to confirm.",
            confirmThisThread: "🛠️ Group prefix change requested.\n👉 React to this message with any emoji to confirm.",
            successGlobal: "✅ Global prefix successfully changed!\n🆕 New global prefix: %1",
            successThisThread: "✅ Group prefix successfully changed!\n🆕 New group prefix: %1"
        }
    },

    onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
        if (!args[0]) {
            return this.showPrefixInfo({ event, message, threadsData });
        }

        const gifStream = await getGifStream();

        // 1. Reset Prefix
        if (args[0].toLowerCase() === 'reset') {
            await threadsData.set(event.threadID, null, "data.prefix");
            return message.reply(getLang("reset", global.GoatBot.config.prefix));
        }

        // 2. Set New Prefix
        const newPrefix = args[0];
        const setGlobal = args[1] === "-g";

        if (setGlobal && role < 2) {
            return message.reply(getLang("onlyAdmin"));
        }

        const confirmMsg = setGlobal
            ? getLang("confirmGlobal")
            : getLang("confirmThisThread");

        const replyPayload = { body: confirmMsg };
        if (gifStream) replyPayload.attachment = gifStream;

        return message.reply(replyPayload, (err, info) => {
            if (err) return;

            global.GoatBot.onReaction.set(info.messageID, {
                commandName,
                author: event.senderID,
                newPrefix,
                setGlobal
            });
        });
    },

    onReaction: async function ({ event, message, threadsData, Reaction, getLang }) {
        if (event.userID !== Reaction.author) return;

        global.GoatBot.onReaction.delete(event.messageID);

        if (Reaction.setGlobal) {
            global.GoatBot.config.prefix = Reaction.newPrefix;
            fs.writeFileSync(
                global.client.dirConfig,
                JSON.stringify(global.GoatBot.config, null, 2)
            );
            return message.reply(getLang("successGlobal", Reaction.newPrefix));
        }

        await threadsData.set(event.threadID, Reaction.newPrefix, "data.prefix");
        return message.reply(getLang("successThisThread", Reaction.newPrefix));
    },

    showPrefixInfo: async function ({ event, message, threadsData }) {
        const gifStream = await getGifStream();

        const systemPrefix = global.GoatBot.config.prefix;
        const groupPrefix = (await global.utils.getPrefix(event.threadID)) || systemPrefix;

        const threadInfo = await threadsData.get(event.threadID);
        const groupName = threadInfo?.threadName || "Unknown Group";

        const time = moment().tz("Asia/Dhaka").format("hh:mm A");
        const date = moment().tz("Asia/Dhaka").format("DD MMM YYYY");

        const replyPayload = {
            body:
`╭━━━〔 🤖 CHATBOT PREFIX 〕━━━╮
│
│ 🏷️ Group  : ${groupName}
│ 🔰 System : 『 ${systemPrefix} 』
│ 💬 Group  : 『 ${groupPref
