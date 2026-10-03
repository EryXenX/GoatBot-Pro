const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "2.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "Google TTS দিয়ে ভয়েসে টেক্সট বলা",
    longDescription: "যেকোনো টেক্সটকে বাংলায় Google Translate এর ভয়েসে রূপান্তর করে পাঠাবে।",
    category: "media",
    guide: {
      en: "{p}say <text>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const text = args.join(" ") || (event.messageReply?.body ?? null);
      if (!text) return api.sendMessage("❌ দয়া করে কিছু লিখুন যেটা ভয়েসে বলতে হবে।", event.threadID, event.messageID);

      const filePath = path.join(__dirname, "cache", `${event.senderID}.mp3`);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=bn&client=tw-ob`;

      // 🔽 MP3 ফাইল ডাউনলোড
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

      // 🎧 পাঠানো
      await api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, () => {
        fs.unlinkSync(filePath); // 🧹 ফাইল মুছে ফেলা
      });

    } catch (error) {
      console.error("Say command error:", error);
      api.sendMessage("❌ কিছু সমস্যা হয়েছে। পরে আবার চেষ্টা করুন!", event.threadID);
    }
  }
};
