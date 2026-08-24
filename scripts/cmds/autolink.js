const fs = require("fs");
const { downloadVideo } = require("sagor-video-downloader");

module.exports = {
    config: {
        name: "autolink",
        version: "1.3",
        author: "MOHAMMAD AKASH",
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

        api.setMessageReaction("⏳", messageID, () => {}, true);

        let successCount = 0;
        let failCount = 0;

        for (const url of uniqueLinks) {
            try {
                const { title, filePath } = await downloadVideo(url);
                if (!filePath || !fs.existsSync(filePath)) throw new Error();

                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) {
                    fs.unlinkSync(filePath);
                    failCount++;
                    continue;
                }

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

            } catch {
                failCount++;
            }
        }

        const finalReaction =
            successCount > 0 && failCount === 0 ? "✅" :
            successCount > 0 ? "⚠️" : "❌";

        api.setMessageReaction(finalReaction, messageID, () => {}, true);
    }
};
