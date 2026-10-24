const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imagen3",
    aliases: [],
    version: "1.0",
    author: "nexo_here",
    countDown: 10,
    role: 0,
    shortDescription: "Generate image using Imagen 3",
    longDescription: "Generate AI image using Imagen 3",
    category: "ai-image",
    guide: {
      en: "{pn} [prompt]\nExample: {pn} a samurai standing in sunset"
    }
  },

  onStart: async function ({ args, message, event, api }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("❌ Please provide a prompt.\nExample: imagen3 a samurai standing in sunset");
    }

    // React while loading
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const url = `https://renzweb.onrender.com/api/imagen3?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });

      const fileName = `${Date.now()}_imagen3.jpg`;
      const filePath = path.join(__dirname, "cache", fileName);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      message.reply({ attachment: fs.createReadStream(filePath) }, () => {
        fs.unlinkSync(filePath); // Delete after send
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      });

    } catch (error) {
      console.error("Error generating image:", error.message);
      message.reply("❌ Failed to generate image.");
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};