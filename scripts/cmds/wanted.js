const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

const toEnglishName = (name) => {
  const map = {
    'আ': 'A', 'ই': 'I', 'উ': 'U', 'এ': 'E', 'ও': 'O',
    'ক': 'K', 'খ': 'Kh', 'গ': 'G', 'ঘ': 'Gh', 'ঙ': 'Ng',
    'চ': 'Ch', 'ছ': 'Chh', 'জ': 'J', 'ঝ': 'Jh', 'ঞ': 'Ny',
    'ট': 'T', 'ঠ': 'Th', 'ড': 'D', 'ঢ': 'Dh', 'ণ': 'N',
    'ত': 'T', 'থ': 'Th', 'দ': 'D', 'ধ': 'Dh', 'ন': 'N',
    'প': 'P', 'ফ': 'Ph', 'ব': 'B', 'ভ': 'Bh', 'ম': 'M',
    'য': 'Y', 'র': 'R', 'ল': 'L', 'শ': 'Sh', 'ষ': 'Sh', 'স': 'S', 'হ': 'H',
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au'
  };
  return name.split('').map(c => map[c] || c).join('').replace(/\s+/g, ' ').trim() || "Unknown";
};

module.exports = {
  config: {
    name: "wanted",
    version: "1.1",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "Wanted poster",
    longDescription: "Mention someone to create a high quality wanted poster.",
    category: "fun",
    guide: { en: "{pn} @mention" }
  },

  getCrime() {
    const crimes = [
      "Stealing Hearts", "Being Too Cool", "Spreading Chaos",
      "Hacking Laughter", "Breaking Rules", "Too Much Swag"
    ];
    return crimes[Math.floor(Math.random() * crimes.length)];
  },

  getReward() {
    const rewards = [1000, 5000, 10000, 50000, 100000];
    return "$" + rewards[Math.floor(Math.random() * rewards.length)];
  },

  onStart: async function ({ event, message, api, usersData }) {
    try {
      const mentionID = Object.keys(event.mentions)[0];
      if (!mentionID) return message.reply("Mention someone!");

      const rawName = await usersData.getName(mentionID);
      const name = toEnglishName(rawName);

      // ✅ Always use HD Graph API photo
      const photoUrl = `https://graph.facebook.com/${mentionID}/picture?height=2048&width=2048&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const res = await axios.get(photoUrl, { responseType: "arraybuffer" });
      const avatarPath = __dirname + "/cache/wanted_avatar.jpg";
      const outputPath = __dirname + "/cache/wanted_poster.jpg";

      fs.writeFileSync(avatarPath, Buffer.from(res.data));

      const canvas = createCanvas(700, 900);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, 700, 900);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 700, 150);

      ctx.font = "bold 100px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("WANTED", 350, 120);

      const avatar = await loadImage(avatarPath);

      ctx.fillStyle = "#fff";
      ctx.fillRect(100, 180, 500, 500);
      ctx.save();
      ctx.beginPath();
      ctx.rect(100, 180, 500, 500);
      ctx.clip();

      // ✅ Resize keeping ratio + better draw quality
      ctx.drawImage(avatar, 100, 180, 500, 500);
      ctx.restore();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000";
      ctx.strokeRect(100, 180, 500, 500);

      ctx.font = "bold 50px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(name.toUpperCase(), 350, 750);

      const crime = this.getCrime();
      ctx.font = "italic 32px Arial";
      ctx.fillText("CRIME: " + crime, 350, 800);

      const reward = this.getReward();
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#d35400";
      ctx.fillText("REWARD: " + reward, 350, 850);

      ctx.font = "italic 24px Arial";
      ctx.fillStyle = "#7f8c8d";
      ctx.fillText("Author: MOHAMMAD AKASH", 350, 890);

      fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg"));

      await message.reply({
        body: `📜 WANTED POSTER\n👤 Name: ${name}\n💣 Crime: ${crime}\n💰 Reward: ${reward}`,
        attachment: fs.createReadStream(outputPath)
      });

      [avatarPath, outputPath].forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
    } catch (err) {
      console.error("Wanted Error:", err);
      message.reply("❌ Error while generating wanted poster!");
    }
  }
};
