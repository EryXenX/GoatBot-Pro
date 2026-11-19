const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

const JAIL_URL = "https://i.ibb.co.com/84f1gzcJ/pngtree-jail-prison-bars-vector-png-image-6665843.png";

module.exports = {
  config: {
    name: "jail",
    version: "1.0.0",
    author: "EryXenX",
    countDown: 5,
    role: 0,
    description: {
      en: "Put someone behind jail bars",
      bn: "কাউকে জেলের গ্রিলের পেছনে বসাও",
      hi: "Kisi ko jail ke peeche daalo",
      tl: "Ilagay ang isa sa likod ng rehas ng bilangguan",
      ar: "ضع شخصاً خلف قضبان السجن"
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
      const jailPath = __dirname + "/cache/jail_base_" + ts + ".png";
      const avatarPath = __dirname + "/cache/jail_avt_" + ts + ".jpg";
      const outputPath = __dirname + "/cache/jail_out_" + ts + ".jpg";

      const [jailRes, avatarRes] = await Promise.all([
        axios.get(JAIL_URL, { responseType: "arraybuffer" }),
        axios.get("https://graph.facebook.com/" + mentionID + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" })
      ]);

      fs.writeFileSync(jailPath, Buffer.from(jailRes.data));
      fs.writeFileSync(avatarPath, Buffer.from(avatarRes.data));

      const jailImg = await loadImage(jailPath);
      const avatarImg = await loadImage(avatarPath);

      const W = jailImg.width;
      const H = jailImg.height;
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(avatarImg, 0, 0, W, H);
      ctx.drawImage(jailImg, 0, 0, W, H);

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));

      await message.reply({ body: "🔒 You are in jail!", attachment: fs.createReadStream(outputPath) });

      [jailPath, avatarPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

    } catch (err) {
      console.error("Jail Error:", err);
      message.reply(getLang("error"));
    }
  }
};
