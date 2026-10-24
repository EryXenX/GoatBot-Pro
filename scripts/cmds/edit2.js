const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://eryxenx.agi.bd/api/nanobanana2";

module.exports = {
  config: {
    name: "edit2",
    aliases: ["nanobanana"],
    version: "2.0.0",
    author: "EryXenX",
    countDown: 30,
    role: 0,
    shortDescription: "Edit or generate image using Nano Banana 2",
    category: "AI",
    guide: "{pn} <text> (reply to an image to edit it, or send without reply to generate)"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage("⚠️ Please provide some text for the image.", threadID, messageID);
    }

    const imgUrl = messageReply?.attachments?.[0]?.url;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let filePath;
    try {
      const params = new URLSearchParams();
      params.set("prompt", prompt);
      if (imgUrl) params.set("image", imgUrl);

      const res = await axios.get(`${API_BASE}?${params.toString()}`, { timeout: 180000 });
      const data = res.data;
      const finalImageURL = data && data.success ? data.imageUrl : null;

      if (!finalImageURL) {
        const errMsg = (data && (data.error || data.message)) || "Unknown reason";
        api.setMessageReaction("⚠️", messageID, () => {}, true);
        return api.sendMessage(`❌ Failed\nReason: ${errMsg}`, threadID, messageID);
      }

      const cacheDir = path.join(__dirname, "cache");
      fs.mkdirSync(cacheDir, { recursive: true });

      const imageResponse = await axios.get(finalImageURL, {
        responseType: "arraybuffer",
        timeout: 60000
      });

      const contentType = data.contentType || "";
      const extFromType = contentType.split("/").pop();
      const ext = (extFromType || finalImageURL.split("?")[0].split(".").pop() || "png").toLowerCase();
      const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "png";
      filePath = path.join(cacheDir, `${Date.now()}.${safeExt}`);
      fs.writeFileSync(filePath, Buffer.from(imageResponse.data));

      const body =
        `✨━━━ ${String(data.model || "").toUpperCase()} ━━━✨\n\n` +
        `✅ ${data.message || "Done"}\n\n` +
        `🎨 Mode: ${data.mode || "N/A"}\n` +
        `🤖 Model: ${data.model || "N/A"}\n` +
        `⏱️ Time: ${data.timeTaken || "N/A"}\n` +
        `👤 Operator: ${data.operator || "N/A"}\n\n` +
        "━━━━━━━━━━━━━━━━━━━━";

      api.setMessageReaction("✅", messageID, () => {}, true);
      api.sendMessage(
        {
          body,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          try { fs.unlinkSync(filePath); } catch (_) {}
        },
        messageID
      );
    } catch (err) {
      console.error("EDIT2 Error:", err?.response?.data || err.message);
      if (filePath) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
      api.setMessageReaction("❌", messageID, () => {}, true);
      const reason = err?.response?.data?.error || "unexpected error";
      api.sendMessage(`❌ Failed\nReason: ${reason}`, threadID, messageID);
    }
  }
};
