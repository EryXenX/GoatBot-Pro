const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

const XRAY_URL = "https://i.ibb.co.com/bRYqX9ms/Picsart-26-05-17-11-24-23-181.jpg";

module.exports = {
  config: {
    name: "xray",
    version: "1.0.0",
    author: "EryXenX",
    countDown: 5,
    role: 0,
    description: {
      en: "Show someone's xray",
      bn: "কারো xray দেখাও",
      hi: "Kisi ka xray dikhao",
      tl: "Ipakita ang xray ng isa",
      ar: "أظهر الأشعة السينية لشخص ما"
    },
    category: "fun",
    guide: { en: "{pn} @mention or reply to a message" }
  },

  langs: {
    en: { noMention: "❌ | Mention someone or reply to a message!", error: "❌ | Failed to generate. Try again." },
    bn: { noMention: "❌ | কাউকে mention করুন বা reply করুন!", error: "❌ | তৈরি করতে সমস্যা হয়েছে।" },
    hi: { noMention: "❌ | Kisi ko mention karein ya reply karein!", error: "❌ | Banana fail hua." },
    tl: { noMention: "❌ | Mag-mention ng isa o mag-reply!", error: "❌ | Hindi nagawa." },
    ar: { noMention: "❌ | أشر إلى شخص أو رد على رسالة!", error: "❌ | فشل الإنشاء." }
  },

  onStart: async function ({ event, message, getLang }) {
    try {
      const mentionID = Object.keys(event.mentions)[0] || (event.messageReply ? event.messageReply.senderID : null);
      if (!mentionID) return message.reply(getLang("noMention"));

      const ts = Date.now();
      const basePath = __dirname + "/cache/xray_base_" + ts + ".jpg";
      const avatarPath = __dirname + "/cache/xray_avt_" + ts + ".jpg";
      const outputPath = __dirname + "/cache/xray_out_" + ts + ".jpg";

      const [baseRes, avatarRes] = await Promise.all([
        axios.get(XRAY_URL, { responseType: "arraybuffer" }),
        axios.get("https://graph.facebook.com/" + mentionID + "/picture?height=1000&width=1000&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" })
      ]);

      fs.writeFileSync(basePath, Buffer.from(baseRes.data));
      fs.writeFileSync(avatarPath, Buffer.from(avatarRes.data));

      const baseImg = await loadImage(basePath);
      const avatarImg = await loadImage(avatarPath);

      const W = baseImg.width;
      const H = baseImg.height;
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImg, 0, 0, W, H);

      const frameX = 1000, frameY = 0, frameW = 1000, frameH = 2000;

      ctx.save();
      ctx.beginPath();
      ctx.rect(frameX, frameY, frameW, frameH);
      ctx.clip();
      ctx.drawImage(avatarImg, frameX, frameY, frameW, frameH);
      ctx.restore();

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));

      await message.reply({ body: "", attachment: fs.createReadStream(outputPath) });

      [basePath, avatarPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

    } catch (err) {
      console.error("XRay Error:", err);
      message.reply(getLang("error"));
    }
  }
};
