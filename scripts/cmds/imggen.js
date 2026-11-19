const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "imgen",
    aliases: ["imggen", "imagine"],
    version: "1.0",
    author: "nexo_here",
    countDown: 10,
    role: 0,
    shortDescription: "Generate AI image using imgen API",
    longDescription: "Use this command to generate images from a prompt using the imgen endpoint.",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt>\nExample: {pn} A dragon flying over a castle"
    }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ | Please provide a prompt.\nExample: .imgen A dragon flying over a castle", event.threadID, event.messageID);
    }

    const msg = await api.sendMessage("🧠 | Generating image, please wait...", event.threadID);

    try {
      const response = await axios({
        method: "GET",
        url: "https://www.arch2devs.ct.ws/api/imgen",
        params: { prompt },
        responseType: "arraybuffer"
      });

      const imagePath = __dirname + `/cache/imgen_${event.senderID}.png`;
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      api.sendMessage({
        body: `✅ | Prompt: ${prompt}`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), msg.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to generate image. The server might be overloaded. Try again later.", event.threadID, msg.messageID);
    }
  }
};