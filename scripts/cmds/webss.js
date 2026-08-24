const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "webss",
    aliases: ["screenshot", "ss"],
    version: "1.1",
    author: "EryXenX",
    countDown: 10,
    role: 2,
    shortDescription: "Website screenshot",
    longDescription: "Take a screenshot of any website",
    category: "utility",
    guide: {
      en: "{p}webss <url>\nExample: {p}webss mariasmm.shop",
    },
  },

  onStart: async function ({ api, event, args, message }) {
    if (!args[0]) {
      return message.reply("No URL provided!\n\nExample: !webss mariasmm.shop");
    }

    let url = args[0].trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      return message.reply("Invalid URL!\nExample: !webss mariasmm.shop");
    }

    const { messageID } = event;

    await api.setMessageReaction("⏳", messageID, () => {}, true);

    const screenshotPath = path.join(__dirname, `../tmp/webss_${Date.now()}.png`);

    try {
      const encodedUrl = encodeURIComponent(url);
      const apiUrl = `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=1280&h=800`;

      let imageBuffer;
      const maxAttempts = 5;

      for (let i = 0; i < maxAttempts; i++) {
        const response = await axios.get(apiUrl, {
          responseType: "arraybuffer",
          timeout: 30000,
        });

        const buffer = Buffer.from(response.data);
        const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;

        if (!isGif && buffer.length > 5000) {
          imageBuffer = buffer;
          break;
        }

        await new Promise((r) => setTimeout(r, 4000));
      }

      if (!imageBuffer) throw new Error("Screenshot not ready, try again later");

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
