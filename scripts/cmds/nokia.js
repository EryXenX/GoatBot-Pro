const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nokia",
    version: "1.0",
    author: "Helal",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Apply Nokia screen effect to profile photo"
    },
    description: {
      en: "Creates a Nokia-style image using your or mentioned user's avatar"
    },
    category: "fun",
    guide: {
      en: "{p}nokia [@mention or reply]\n\nDefault: Your profile picture"
    }
  },

  onStart: async function ({ api, event, usersData, message }) {
    const { senderID, mentions, type, messageReply } = event;

    let uid;
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (type === "message_reply") {
      uid = messageReply.senderID;
    } else {
      uid = senderID;
    }

    const avatarURL = `https://graph.facebook.com/${uid}/picture?height=512&width=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    try {
      const res = await axios.get(`https://api.popcat.xyz/v2/nokia?image=${encodeURIComponent(avatarURL)}`, {
        responseType: "arraybuffer"
      });

      const imagePath = path.join(__dirname, "cache", `nokia_${uid}.jpg`);
      fs.writeFileSync(imagePath, res.data);

      message.reply({
        body: `📱 | Here's your Nokia screen effect!`,
        attachment: fs.createReadStream(imagePath)
      }, () => fs.unlinkSync(imagePath));
    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to generate Nokia image.");
    }
  }
};
