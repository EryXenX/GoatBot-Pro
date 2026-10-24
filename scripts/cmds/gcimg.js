const axios = require("axios");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
  return base.data.api;
};

async function getAvatarUrls(userIDs) {
  const avatarURLs = [];
  for (let userID of userIDs) {
    try {
      const avatar = await axios.get(
        `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      avatarURLs.push(avatar.request.res.responseUrl);
    } catch (err) {
      avatarURLs.push("https://i.ibb.co/qk0bnY8/363492156-824459359287620-3125820102191295474-n-png-nc-cat-1-ccb-1-7-nc-sid-5f2048-nc-eui2-Ae-HIhi-I.png");
    }
  }
  return avatarURLs;
}

module.exports = {
  config: {
    name: "gcimg",
    aliases: ["gcimage", "grpimage"],
    version: "1.1",
    author: "nexo_here",
    countDown: 5,
    role: 0,
    description: "Generate a styled group image with profile pictures",
    category: "Ai-Image",
    guide: "{pn} [--color white] [--bgcolor black] [--admincolor red] [--membercolor cyan] [--groupBorder lime] [--glow true]"
  },

  onStart: async function ({ api, args, event, message }) {
    try {
      let textColor = "white";
      let bgColor = null;
      let adminColor = "yellow";
      let memberColor = "cyan";
      let borderColor = "lime";
      let glow = false;

      for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
          case "--color":
            textColor = args[i + 1];
            i++;
            break;
          case "--bgcolor":
            bgColor = args[i + 1];
            i++;
            break;
          case "--admincolor":
            adminColor = args[i + 1];
            i++;
            break;
          case "--membercolor":
            memberColor = args[i + 1];
            i++;
            break;
          case "--groupBorder":
            borderColor = args[i + 1];
            i++;
            break;
          case "--glow":
            glow = args[i + 1]?.toLowerCase() === "true";
            i++;
            break;
        }
      }

      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs;
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

      const memberAvatars = await getAvatarUrls(participantIDs);
      const adminAvatars = await getAvatarUrls(adminIDs);

      const payload = {
        groupName: threadInfo.threadName,
        groupPhotoURL: threadInfo.imageSrc,
        memberURLs: memberAvatars,
        adminURLs: adminAvatars,
        color: textColor,
        bgcolor: bgColor,
        admincolor: adminColor,
        membercolor: memberColor,
        groupborderColor: borderColor,
        glow
      };

      const waitMsg = await message.reply("🛠️ | Generating group image, please wait...");
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.post(`${await baseApiUrl()}/gcimg`, payload, { responseType: "stream" });

      message.unsend(waitMsg.messageID);
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return message.reply({
        body: "✨ | Here's your group image:",
        attachment: response.data
      });

    } catch (err) {
      console.error("[gcimg] Error:", err);
      return message.reply(`❌ | An error occurred: ${err.message}`);
    }
  }
};
