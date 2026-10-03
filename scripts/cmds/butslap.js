const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "butslap",
    aliases: ["buttslap"],
    version: "1.7",
    author: "MahMUD",
    role: 0,
    category: "fun",
    cooldown: 8,
    guide: "slap [mention/reply/UID]",
  },

  onStart: async function ({ api, event, args }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const { threadID, messageID, messageReply, mentions, senderID } = event;
    const type = args[0];

    if (!type) return api.sendMessage("Use: fun slap @tag", threadID, messageID);

    let id = senderID;
    let id2;

    if (messageReply) {
      id2 = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];
    } else if (args[1]) {
      id2 = args[1];
    } else {
      return api.sendMessage("Mention, reply, or provide UID of the target.", threadID, messageID);
    }

    try {
      const url = `${await baseApiUrl()}/api/dig?type=buttslap&user=${id}&user2=${id2}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `slap_${id2}.png`);
      fs.writeFileSync(filePath, response.data);

      api.sendMessage(
        {
          attachment: fs.createReadStream(filePath),
          body: `Effect: buttslap successful 💥`
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage(`🥹error, contact MahMUD.`, threadID, messageID);
    }
  }
};
