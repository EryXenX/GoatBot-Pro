const axios = require('axios'); // ✅ Axios সরাসরি import করা হয়েছে

module.exports = {
  config: {
    name: "imgur",
    version: "1.0.2",
    author: "MOHAMMAD AKASH",
    role: 0,
    shortDescription: "Upload image/video/GIF to Imgur and get direct links",
    longDescription: "Reply to any image, video, or GIF to upload it to Imgur and get the link.",
    category: "other",
    guide: "[reply with any media file]",
    cooldowns: 0
  },

  onStart: async function ({ api, event }) {
    // Get API link from JSON
    let Shaon;
    try {
      const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
      Shaon = apis.data.imgur;
    } catch {
      return api.sendMessage("❌ Failed to fetch Imgur API link!", event.threadID, event.messageID);
    }

    const reply = event.messageReply;
    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return api.sendMessage(
        "Please reply to the image or video with the command Imgur...!✅",
        event.threadID,
        event.messageID
      );
    }

    const links = [];

    for (const attachment of reply.attachments) {
      try {
        const url = encodeURIComponent(attachment.url);
        const upload = await axios.get(`${Shaon}/imgur?link=${url}`);
        links.push(upload.data.uploaded.image || "❌ No link received");
      } catch (e) {
        links.push("❌ Failed to upload");
      }
    }

    const messageToSend = links.length === 1
      ? links[0]
      : `✅ Uploaded files Imgur links:\n\n${links.join("\n")}`;

    return api.sendMessage(messageToSend, event.threadID, event.messageID);
  }
};
