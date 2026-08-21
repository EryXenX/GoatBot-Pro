const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "pair",
    version: "1.0.0",
    author: "EryXenX",
    countDown: 5,
    role: 0,
    description: {
      en: "Find today's random couple in the group",
      bn: "আজকের random জুটি খোঁজো",
      hi: "Aaj ka random pair dhundho",
      tl: "Hanapin ang random na pares ngayon",
      ar: "ابحث عن زوج اليوم العشوائي"
    },
    category: "fun",
    guide: { en: "{pn}" }
  },

  langs: {
    en: {
      noMembers: "❌ | Not enough members in this group!",
      error: "❌ | Failed to generate. Try again.",
      result: "💕 Today's Couple 💕\n\n👤 %1\n💑 &\n👤 %2\n\n❤️ Compatibility: %3%\n\n🔁 New pair tomorrow!"
    },
    bn: {
      noMembers: "❌ | গ্রুপে যথেষ্ট সদস্য নেই!",
      error: "❌ | তৈরি করতে সমস্যা হয়েছে।",
      result: "💕 আজকের জুটি 💕\n\n👤 %1\n💑 &\n👤 %2\n\n❤️ মিল: %3%\n\n🔁 কাল নতুন জুটি!"
    },
    hi: {
      noMembers: "❌ | Group mein kaafi members nahi hain!",
      error: "❌ | Banana fail hua.",
      result: "💕 Aaj ka Pair 💕\n\n👤 %1\n💑 &\n👤 %2\n\n❤️ Compatibility: %3%\n\n🔁 Kal naya pair!"
    },
    tl: {
      noMembers: "❌ | Hindi sapat ang mga miyembro sa grupo!",
      error: "❌ | Hindi nagawa.",
      result: "💕 Pares Ngayon 💕\n\n👤 %1\n💑 &\n👤 %2\n\n❤️ Compatibility: %3%\n\n🔁 Bagong pares bukas!"
    },
    ar: {
      noMembers: "❌ | لا يوجد أعضاء كافيون في المجموعة!",
      error: "❌ | فشل الإنشاء.",
      result: "💕 زوج اليوم 💕\n\n👤 %1\n💑 &\n👤 %2\n\n❤️ التوافق: %3%\n\n🔁 زوج جديد غداً!"
    }
  },

  onStart: async function ({ event, message, getLang, threadsData, usersData, api }) {
    try {
      const { threadID, senderID } = event;
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID() && id !== senderID);

      if (members.length < 1) return message.reply(getLang("noMembers"));

      const id2 = members[Math.floor(Math.random() * members.length)];
      const compatibility = Math.floor(Math.random() * 51) + 50;
      const pair = { id1: senderID, id2, compatibility };

      const [user1, user2] = await Promise.all([
        usersData.get(pair.id1),
        usersData.get(pair.id2)
      ]);
      const name1 = user1.name || "Unknown";
      const name2 = user2.name || "Unknown";

      const ts = Date.now();
      const outputPath = __dirname + "/cache/pair_out_" + ts + ".jpg";

      const [res1, res2] = await Promise.all([
        axios.get("https://graph.facebook.com/" + pair.id1 + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" }),
        axios.get("https://graph.facebook.com/" + pair.id2 + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" })
      ]);

      const avt1Path = __dirname + "/cache/pair_avt1_" + ts + ".jpg";
      const avt2Path = __dirname + "/cache/pair_avt2_" + ts + ".jpg";
      fs.writeFileSync(avt1Path, Buffer.from(res1.data));
      fs.writeFileSync(avt2Path, Buffer.from(res2.data));

      const [img1, img2] = await Promise.all([loadImage(avt1Path), loadImage(avt2Path)]);

      const W = 800, H = 400;
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#ff6b6b");
      grad.addColorStop(0.5, "#ee0979");
      grad.addColorStop(1, "#ff6b6b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const r = 150;

      ctx.save();
      ctx.beginPath();
      ctx.arc(r + 30, H / 2, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img1, 30, H / 2 - r, r * 2, r * 2);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(W - r - 30, H / 2, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img2, W - r * 2 - 30, H / 2 - r, r * 2, r * 2);
      ctx.restore();

      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(r + 30, H / 2, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W - r - 30, H / 2, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "bold 60px serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("❤️", W / 2, H / 2 + 20);

      const barW = 200, barH = 22;
      const barX = W / 2 - barW / 2;
      const barY = H - 55;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 11);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * (pair.compatibility / 100), barH, 11);
      ctx.fill();

      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(pair.compatibility + "% Compatible", W / 2, barY - 8);

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));

      const body = getLang("result", name1, name2, pair.compatibility);

      await message.reply({ body, attachment: fs.createReadStream(outputPath) });

      [avt1Path, avt2Path, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

    } catch (err) {
      console.error("Pair Error:", err);
      message.reply(getLang("error"));
    }
  }
};
