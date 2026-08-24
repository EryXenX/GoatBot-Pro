const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "catbox",
    version: "1.0.0",
    author: "EryXenX",
    role: 0,
    shortDescription: "Upload media to Catbox",
    longDescription: "Reply to an image, video, audio, or file to upload it to Catbox",
    category: "media",
    guide: "{pn} (reply to a file)",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, type, messageReply } = event;

    if (
      type !== "message_reply" ||
      !messageReply ||
      !messageReply.attachments ||
      messageReply.attachments.length === 0
    ) {
      return api.sendMessage(
        "Reply to an image, video, audio, or file.",
        threadID,
        messageID
      );
    }

    const attachment = messageReply.attachments[0];
    const ext = attachment.filename
      ? path.extname(attachment.filename)
      : ".tmp";

    const cacheDir = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(
      cacheDir,
      `catbox_${Date.now()}${ext}`
    );

    try {
      const file = await axios({
        url: attachment.url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      file.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(filePath));

      const upload = await axios.post(
        "https://catbox.moe/user/api.php",
        form,
        {
          headers: form.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity
        }
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return api.sendMessage(
        upload.data.trim(),
        threadID,
        messageID
      );

    } catch (err) {
      console.error("Catbox Error:", err);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return api.sendMessage(
        "Upload failed.",
        threadID,
        messageID
      );
    }
  }
};
