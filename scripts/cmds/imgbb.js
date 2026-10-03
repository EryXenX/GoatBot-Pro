const axios = require("axios");
const FormData = require("form-data");

const IMGBB_API_KEY = "a0bcf5603cef298e99236e6f0bab90b2";

module.exports = {
  config: {
    name: "imgbb",
    version: "2.0",
    author: "EryXenX",
    category: "tools",
    shortDescription: "Upload replied image to ImgBB and get link",
    longDescription: "Reply to an image with this command to upload it to ImgBB and receive a direct link.",
    guide: "{pn}imgbb (reply to an image)"
  },

  onStart: async function ({ api, event }) {
    try {
      const attachments = event.messageReply?.attachments;

      if (!attachments || attachments.length === 0) {
        return api.sendMessage("❌ Please reply to an image.", event.threadID, event.messageID);
      }

      if (attachments[0].type !== "photo") {
        return api.sendMessage("❌ Only photo attachments are supported.", event.threadID, event.messageID);
      }

      const imageUrl = attachments[0].url;
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(imageResponse.data);

      const form = new FormData();
      form.append("image", imageBuffer.toString("base64"));
      form.append("key", IMGBB_API_KEY);

      const uploadResponse = await axios.post("https://api.imgbb.com/1/upload", form, {
        headers: form.getHeaders()
      });

      const result = uploadResponse.data;

      if (result.success) {
        const { url } = result.data;
        return api.sendMessage(url, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ Upload failed. Please try again.", event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("ImgBB Error:", error.message);
      return api.sendMessage("❌ Something went wrong. Please try again.", event.threadID, event.messageID);
    }
  }
};
