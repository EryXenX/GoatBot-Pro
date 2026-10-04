const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const TOKEN = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
const TEMPLATE_URL = "https://i.ibb.co.com/ynYgrQhk/1790296731426.jpg";
const BOX = { x: 389, y: 199, w: 206, h: 233 };

let templateCache = null;

async function getTemplate() {
  if (templateCache) return templateCache;
  const res = await axios.get(TEMPLATE_URL, { responseType: "arraybuffer" });
  templateCache = await loadImage(Buffer.from(res.data));
  return templateCache;
}

module.exports = {
  config: {
    name: "amarbondhu",
    aliases: ["12vatari"],
    version: "1.4",
    author: "EryXenX",
    countDown: 8,
    role: 0,
    description: {
      en: "Put someone's avatar into the meme template"
    },
    category: "fun",
    guide: {
      en: "{pn} @mention | reply to a message | {pn} (yourself)"
    }
  },

  langs: {
    en: {
      failed: "Could not generate the image. Try again later."
    }
  },

  onStart: async function ({ message, event, getLang }) {
    const mentionIds = Object.keys(event.mentions || {});
    const uid = event.messageReply
      ? event.messageReply.senderID
      : mentionIds[0] || event.senderID;

    const outPath = path.join(__dirname, "cache", `12vatari_${uid}_${Date.now()}.png`);

    try {
      const [template, avatarRes] = await Promise.all([
        getTemplate(),
        axios.get(
          `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=${TOKEN}`,
          { responseType: "arraybuffer" }
        )
      ]);

      const avatar = await loadImage(Buffer.from(avatarRes.data));

      const canvas = createCanvas(template.width, template.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(template, 0, 0);

      const scale = Math.max(BOX.w / avatar.width, BOX.h / avatar.height);
      const sw = BOX.w / scale;
      const sh = BOX.h / scale;
      const sx = (avatar.width - sw) / 2;
      const sy = (avatar.height - sh) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h);
      ctx.clip();
      ctx.drawImage(avatar, sx, sy, sw, sh, BOX.x, BOX.y, BOX.w, BOX.h);
      ctx.restore();

      await fs.ensureDir(path.dirname(outPath));
      await fs.writeFile(outPath, canvas.toBuffer("image/png"));

      await message.reply({ attachment: fs.createReadStream(outPath) });
    } catch (err) {
      await message.reply(getLang("failed"));
    } finally {
      fs.remove(outPath).catch(() => {});
    }
  }
};
