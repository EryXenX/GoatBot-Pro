const fs = require("fs");
const path = require("path");
const os = require("os");
const axios = require("axios");

const API_BASE = "https://eryxenx.agi.bd/api/alldl";

module.exports = {
    config: {
        name: "autolink",
        version: "3.0.0",
        author: "EryXenX",
        countDown: 5,
        role: 0,
        shortDescription: "Auto-download & send videos silently (no messages)",
        category: "media",
    },

    onStart: async function () {},

    onChat: async function ({ api, event }) {
        const threadID = event.threadID;
        const messageID = event.messageID;
        const message = event.body || "";

        const linkMatches = message.match(/(https?:\/\/[^\s]+)/g);
        if (!linkMatches || linkMatches.length === 0) return;

        const uniqueLinks = [...new Set(linkMatches)];
        const supportedLinks = uniqueLinks.filter(detectPlatform);
        if (supportedLinks.length === 0) return;

        api.setMessageReaction("⏳", messageID, () => {}, true);

        let successCount = 0;
        let failCount = 0;

        for (const url of supportedLinks) {
            const filePath = path.join(os.tmpdir(), `autolink_${Date.now()}_${Math.floor(Math.random() * 1e6)}.mp4`);

            try {
                const response = await axios.get(API_BASE, {
                    params: { url },
                    responseType: "stream",
                    timeout: 150000
                });

                await new Promise((resolve, reject) => {
                    const writer = fs.createWriteStream(filePath);
                    response.data.pipe(writer);
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });

                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) {
                    fs.unlinkSync(filePath);
                    failCount++;
                    continue;
                }

                const title = extractTitleFromHeaders(response.headers);

                await api.sendMessage(
                    {
                        body:
`📥 ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ  
━━━━━━━━━━━━━━━  
🎬 ᴛɪᴛʟᴇ: ${title || "Video File"}  
📦 sɪᴢᴇ: ${fileSizeInMB.toFixed(2)} MB  
━━━━━━━━━━━━━━━`,
                        attachment: fs.createReadStream(filePath)
                    },
                    threadID,
                    () => fs.unlinkSync(filePath)
                );

                successCount++;

            } catch (err) {
                console.error(`[autolink] Failed for ${url}: ${err.message}`);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                failCount++;
            }
        }

        const finalReaction =
            successCount > 0 && failCount === 0 ? "✅" :
            successCount > 0 ? "⚠️" : "❌";

        api.setMessageReaction(finalReaction, messageID, () => {}, true);
    }
};

function detectPlatform(url) {
    if (/instagram\.com/i.test(url)) return "instagram";
    if (/tiktok\.com/i.test(url)) return "tiktok";
    if (/facebook\.com|fb\.watch/i.test(url)) return "facebook";
    if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
    return null;
}

function extractTitleFromHeaders(headers) {
    const disposition = headers["content-disposition"];
    if (!disposition) return null;
    const match = disposition.match(/filename="(.+?)\.mp4"/);
    return match ? match[1].replace(/_/g, " ") : null;
        }
