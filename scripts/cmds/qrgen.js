const QRCode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

function extractData(args) {
    let data = args.join(" ").trim();
    if (!data) {
        data = "https://example.com"; // ডিফল্ট ডাটা যদি কিছু না দেয়
    }
    return data;
}

module.exports = {
  config: {
    name: "qrgen",
    aliases: ["qrcode"],
    version: "1.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    longDescription: "Generate a QR code from text, link, or any information.",
    category: "utility",
    guide: {
      en: "{pn} [text or link]"
    }
  },

  onStart: async function({ message, args, event }) {
    const qrData = extractData(args);

    if (!qrData) {
      return message.reply("❌ Please provide text, link, or information to generate QR code.");
    }

    message.reaction("⏳", event.messageID);
    let tempFilePath;

    try {
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      
      tempFilePath = path.join(cacheDir, `qr_code_${Date.now()}.png`);

      // QR কোড জেনারেট করে ফাইলে সেভ করা
      await QRCode.toFile(tempFilePath, qrData, {
        color: {
          dark: '#000',  // কালো
          light: '#FFF'  // সাদা
        },
        scale: 8  // সাইজ অ্যাডজাস্ট
      });

      message.reaction("✅", event.messageID);
      await message.reply({
        body: "✅ Yᴏᴜʀ QR ᴄᴏᴅᴇ ʜᴀs ʙᴇᴇɴ ɢᴇɴᴇʀᴀᴛᴇᴅ!",
        attachment: fs.createReadStream(tempFilePath)
      });

    } catch (error) {
      message.reaction("❌", event.messageID);
      
      let errorMessage = "An error occurred during QR code generation.";
      if (error.message) {
         errorMessage = `❌ ${error.message}`;
      }

      console.error("QRGen Command Error:", error);
      message.reply(`❌ ${errorMessage}`);
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
      }
    }
  }
};
