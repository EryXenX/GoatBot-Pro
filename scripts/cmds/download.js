const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "download",
    version: "1.4",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "Download media from direct link",
    category: "media",
    guide: "{pn} <direct-link>"
  },

  onStart: async function ({ api, event, args }) {
    const url = args[0];

    if (!url) {
      return api.sendMessage(
        "⚠️ Pʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴅɪʀᴇᴄᴛ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ.\n\nE xᴀᴍᴘʟᴇ:\n/download https://example.com/video.mp4",
        event.threadID,
        event.messageID
      );
    }

    const supported = [
      ".mp4", ".mp3",
      ".jpg", ".jpeg", ".png", ".gif",
      ".pdf", ".docx", ".txt", ".zip"
    ];

    const ext = path.extname(url.split("?")[0]).toLowerCase();

    if (!supported.includes(ext)) {
      return api.sendMessage(
        "❌ Uɴsᴜᴘᴘᴏʀᴛᴇᴅ ғɪʟᴇ ᴛʏᴘᴇ!\n\nSᴜᴘᴘᴏʀᴛᴇᴅ:\nmp4, mp3, jpg, png, gif, pdf, docx, txt, zip",
        event.threadID,
        event.messageID
      );
    }

    const fileName = `download${ext}`;

    try {
      // Loading message (Aʙᴄ Fᴏɴᴛ)
      const loadingMsg = await api.sendMessage(
        "⏳ Dᴏᴡɴʟᴏᴀᴅɪɴɢ • Jᴜsᴛ A Mᴏᴍᴇɴᴛ...",
        event.threadID
      );

      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      fs.writeFileSync(fileName, res.data);

      // Unsend loading message
      api.unsendMessage(loadingMsg.messageID);

      api.sendMessage(
        {
          body: `✅ Dᴏᴡɴʟᴏᴀᴅ Cᴏᴍᴘʟᴇᴛᴇ!\n📥 Fɪʟᴇ: ${fileName}`,
          attachment: fs.createReadStream(fileName)
        },
        event.threadID,
        () => fs.unlinkSync(fileName)
      );

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "❌ Dᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ! Tʜᴇ ʟɪɴᴋ ᴍᴀʏ ɴᴏᴛ ʙᴇ ᴅɪʀᴇᴄᴛ.",
        event.threadID
      );
    }
  }
};
