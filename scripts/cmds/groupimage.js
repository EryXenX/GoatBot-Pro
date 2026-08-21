const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "groupimage",
    version: "1.1.0",
    author: "Mohammad Akash",
    countDown: 0,
    role: 1, // অ্যাডমিন বা মডারেটরদের জন্য (চাওলে 0 করো)
    shortDescription: "Change group photo",
    longDescription: "রিপ্লাই দেওয়া ছবিটাকে গ্রুপ প্রোফাইল ছবিতে সেট করবে",
    category: "box",
    guide: "{pn} (একটা ছবিতে রিপ্লাই দাও)"
  },

  onStart: async function ({ api, event }) {
    try {
      // ✅ প্রথমে চেক করবো রিপ্লাই আছে কিনা
      if (event.type !== "message_reply") {
        return api.sendMessage("❌ দয়া করে একটি ছবিতে রিপ্লাই দাও!", event.threadID, event.messageID);
      }

      // ✅ অ্যাটাচমেন্ট আছে কিনা
      const attachments = event.messageReply.attachments;
      if (!attachments || attachments.length === 0) {
        return api.sendMessage("❌ রিপ্লাই করা মেসেজে কোনো ছবি পাওয়া যায়নি!", event.threadID, event.messageID);
      }

      // ✅ একাধিক ছবি দেওয়া থাকলে
      if (attachments.length > 1) {
        return api.sendMessage("⚠️ শুধু একটি ছবিতে রিপ্লাই দাও!", event.threadID, event.messageID);
      }

      // ✅ ডাউনলোড ও সেট করা
      const imageURL = attachments[0].url;
      const pathImg = __dirname + "/cache/groupimage.png";
      const getData = (await axios.get(imageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathImg, Buffer.from(getData, "utf-8"));
      await api.changeGroupImage(fs.createReadStream(pathImg), event.threadID);
      fs.unlinkSync(pathImg);

      return api.sendMessage("✅ | গ্রুপ প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে!", event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("⚠️ | ছবিটি সেট করা যায়নি, আবার চেষ্টা করো!", event.threadID, event.messageID);
    }
  }
};
