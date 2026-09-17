const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "webss",
    aliases: ["screenshot", "ss"],
    version: "3.0.0",
    author: "EryXenX",
    countDown: 10,
    role: 2,
    shortDescription: "Website screenshot",
    longDescription: "Take a screenshot of any website",
    category: "utility",
    guide: {
      en: "{p}webss <url>\nExample: {p}webss eryxenx.agi.bd",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    if (!args[0]) {
      return message.reply("No URL provided!\n\nExample: !webss eryxenx.agi.bd");
    }

    let url = args[0].trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      return message.reply("Invalid URL!\nExample: !webss eryxenx.agi.bd");
    }

    const { messageID } = event;

    await api.setMessageReaction("⏳", messageID, () => {}, true);

    const screenshotPath = path.join(__dirname, `../tmp/webss_${Date.now()}.png`);

    try {
      const encodedUrl = encodeURIComponent(url);
      const apiUrl = `https://eryxenx.agi.bd/api/screenshot?url=${encodedUrl}`;

      const response = await axios.get(apiUrl, {
        responseType: "arraybuffer",
        timeout: 60000,
      });

      const imageBuffer = Buffer.from(response.data);

      await fs.outputFile(screenshotPath, imageBuffer);
      await api.setMessageReaction("✅", messageID, () => {}, true);
      await message.reply({
        body: `✅ Screenshot ready!\n🌐 ${url}`,
        attachment: fs.createReadStream(screenshotPath),
      });

    } catch (err) {
      await api.setMessageReaction("❌", messageID, () => {}, true);
      message.reply(`Failed to take screenshot!\n\nError: ${err.message}`);
    } finally {
      setTimeout(() => {
        fs.remove(screenshotPath).catch(() => {});
      }, 10000);
    }
  },
};
