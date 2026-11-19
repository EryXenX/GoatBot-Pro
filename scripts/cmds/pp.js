const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "pp",
    version: "1.1.0",
    author: "EryXenX",
    countDown: 3,
    role: 0,
    shortDescription: "View Facebook profile picture 📸",
    longDescription: "View profile picture of any user via reply, mention, link, or UID.",
    category: "media",
    guide: {
      en: "{pn} [reply / @mention / profile link / UID]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, `profile_${Date.now()}.png`);

    try {
      await fs.ensureDir(cacheDir);

      let uid;

      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[0] && args[0].includes("facebook.com")) {
        uid = await api.getUID(args[0]);
      } else if (args[0] && /^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        uid = event.senderID;
      }

      const name = await usersData.getName(uid).catch(() => "Unknown User");

      const imageUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      await fs.writeFile(cachePath, response.data);

      await api.sendMessage(
        {
          body: `📸 Profile picture of ${name}`,
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => fs.remove(cachePath),
        event.messageID
      );

    } catch (err) {
      console.error("[pp]", err.message);
      api.sendMessage("⚠️ Failed to fetch profile picture. Please try again.", event.threadID, event.messageID);
    }
  }
};