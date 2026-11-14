module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "NADIM",
    role: 0,
    category: "utility"
  },

  onStart: async function ({ api, event }) {
    const axios = require("axios");

    const videoUrl = "https://i.imgur.com/8Psum3K.mp4";

    const text = `╭━━━━━━━━━━━━━━━━╮
🌟 PREFIX INFORMATION 🌟
╰━━━━━━━━━━━━━━━━╯

💫 System Prefix: /
🛸 Group Prefix: /
🔧 Type "/help" to see all commands

👑 Powered by NADIM 🦖
✨ Enjoy using the bot!`;

    try {
      const res = await axios.get(videoUrl, {
        responseType: "stream"
      });

      return api.sendMessage(
        {
          body: text,
          attachment: res.data
        },
        event.threadID
      );
    } catch (err) {
      return api.sendMessage(text, event.threadID);
    }
  }
};
