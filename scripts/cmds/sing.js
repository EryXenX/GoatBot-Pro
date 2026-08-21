const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "sing",
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "যেকোনো গান সার্চ করে অডিও ফাইল ডাউনলোড করুন",
                        en: "Search and download any song as an audio file",
                        vi: "Tìm kiếm và tải xuống bất kỳ bài hát nào dưới dạng tệp âm thanh"
                },
                category: "music",
                guide: {
                        bn: '   {pn} <গানের নাম>: গান ডাউনলোড করতে নাম লিখুন',
                        en: '   {pn} <song name>: Enter song name to download',
                        vi: '   {pn} <tên bài hát>: Nhập tên bài hát để tải xuống'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, গানের নাম তো দাও! 🎵\nউদাহরণ: {pn} shape of you",
                        success: "✅ | এই নাও তোমার গান বেবি <😘\n• 𝐒𝐨𝐧𝐠: %1",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please provide a song name! 🎵\nExample: {pn} shape of you",
                        success: "✅ | Here's your requested song baby <😘\n• 𝐒𝐨𝐧𝐠: %1",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng cung cấp tên bài hát! 🎵\nVí dụ: {pn} shape of you",
                        success: "✅ | Bài hát của cưng đây <😘\n• 𝐁𝐚̀𝐢 𝐡𝐚́𝐭: %1",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const query = args.join(" ");
                if (!query) return message.reply(getLang("noInput"));

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        const baseUrl = await mahmud();
                        const apiUrl = `${baseUrl}/api/song/mahmud?query=${encodeURIComponent(query)}`;

                        const response = await axios({
                                method: "GET",
                                url: apiUrl,
                                responseType: "stream"
                        });

                        return message.reply({
                                body: getLang("success", query),
                                attachment: response.data
                        }, () => {
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        });

                } catch (err) {
                        console.error("Sing Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};