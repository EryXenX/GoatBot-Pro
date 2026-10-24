const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "poli",
    author: "MahMUD",
    version: "1.7",
    cooldowns: 10,
    role: 0,
    category: "ai-image",
    guide: {
      en: "{p}poli <prompt>"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    if (args.length === 0) {
      return api.sendMessage("❌ | Please provide a prompt.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    api.sendMessage("𝐖𝐚𝐢𝐭 𝐤𝐨𝐫𝐨 𝐣𝐚𝐧 <😘", event.threadID, event.messageID);

    try {
      const styles = ["ultra detailed", "4k resolution", "realistic lighting", "artstation", "digital painting"];
      const imagePaths = [];

      for (let i = 0; i < 4; i++) {
        const enhancedPrompt = `${prompt}, ${styles[i % styles.length]}`;

        const response = await axios.post(`${await baseApiUrl()}/api/poli/generate`, {
          prompt: enhancedPrompt
        }, {
          responseType: "arraybuffer",
          headers: {
            "author": module.exports.config.author
          }
        });

        const filePath = path.join(cacheDir, `generated_${Date.now()}_${i}.png`);
        fs.writeFileSync(filePath, response.data);
        imagePaths.push(filePath);
      }

      const attachments = imagePaths.map(p => fs.createReadStream(p));
      message.reply({
        body: "✅ | Here are images generated from your prompt:",
        attachment: attachments
      });

    } catch (error) {
      console.error("Image generation error:", error);
      message.reply("❌ | Couldn't generate images. Try again later.");
    }
  }
};
