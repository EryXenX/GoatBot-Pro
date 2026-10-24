const axios = require("axios");

module.exports = {
  config: {
    name: "creart",
    version: "1.2",
    author: "nexo_here",
    countDown: 5,
    role: 0,
    shortDescription: "Generate AI image",
    longDescription: "Generate image using prompt via smfahim.xyz CreartAI",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <your prompt>"
    }
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("❌ | Please provide a prompt to generate image.");

    // Send waiting message with ⏳
    const waiting = await message.reply(`⏳ | Generating image for: "${prompt}"`);

    try {
      const url = `https://smfahim.xyz/creartai?prompt=${encodeURIComponent(prompt)}`;
      const imgRes = await axios.get(url, { responseType: "stream" });

      // Send image with ✅
      return message.reply({
        body: `✅ | Here is your image for: "${prompt}"`,
        attachment: imgRes.data
      });

    } catch (error) {
      console.error("Image generation error:", error.message);
      return message.reply("❌ | Failed to generate image. Try again later.");
    }
  }
};