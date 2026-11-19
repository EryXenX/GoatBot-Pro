const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "edit",
    aliases: [],
    version: "4.0.0",
    author: "EryXenX",
    countDown: 30,
    role: 0,
    shortDescription: "Edit image using AI",
    category: "AI",
    guide: "{pn} <text> (reply to an image) | {pn} -a <text> (reply to an image, then reply to the bot's message with a 2nd photo)"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const addMode = args.length > 0 && (args[0] === "-a" || args[0] === "--add");
    const promptArgs = addMode ? args.slice(1) : args;
    const prompt = promptArgs.join(" ").trim();

    if (!prompt) {
      return api.sendMessage(
        addMode
          ? "⚠️ Usage: edit -a <text> (reply to an image)"
          : "⚠️ Please provide some text for the image.",
        threadID,
        messageID
      );
    }

    const imgUrl = messageReply?.attachments?.[0]?.url;
    if (!imgUrl) {
      return api.sendMessage("⚠️ Please reply to an image.", threadID, messageID);
    }

    if (!addMode) {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      return runEditRequest({ api, event, prompt, imageUrls: [imgUrl], reactionMsgID: messageID });
    }

    api.setMessageReaction("🫩", messageID, () => {}, true);

    api.sendMessage(
      "📷 Send another photo\nReply to this message with your 2nd image.",
      threadID,
      (err, info) => {
        if (err || !info) {
          api.setMessageReaction("❌", messageID, () => {}, true);
          return;
        }
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          prompt,
          imageUrls: [imgUrl],
          reactionMsgID: messageID
        });
      },
      messageID
    );
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const secondUrl = event.attachments?.[0]?.url;
    if (!secondUrl) {
      return api.sendMessage(
        "⚠️ Please reply to this message with a photo (image attachment).",
        event.threadID,
        event.messageID
      );
    }

    api.setMessageReaction("🐣", event.messageID, () => {}, true);

    await runEditRequest({
      api,
      event,
      prompt: Reply.prompt,
      imageUrls: [...Reply.imageUrls, secondUrl],
      reactionMsgID: event.messageID
    });

    global.GoatBot.onReply.delete(Reply.messageID);
  }
};

const API_BASE = "https://eryxenx.agi.bd/api/imgedit";

async function runEditRequest({ api, event, prompt, imageUrls, reactionMsgID }) {
  try {
    const params = new URLSearchParams();
    params.set("image", imageUrls[0]);
    if (imageUrls[1]) params.set("image2", imageUrls[1]);
    params.set("prompt", prompt);

    const res = await axios.get(`${API_BASE}?${params.toString()}`, { timeout: 120000 });
    const data = res.data;
    const finalImageURL = data && data.success ? data.imageUrl : null;

    if (!finalImageURL) {
      const errMsg = (data && (data.error || data.message)) || "Unknown reason";
      api.setMessageReaction("⚠️", reactionMsgID, () => {}, true);
      return api.sendMessage(`❌ Failed to edit\nReason: ${errMsg}`, event.threadID, event.messageID);
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
    const filePath = path.join(cacheDir, `${Date.now()}.${safeExt}`);
    fs.writeFileSync(filePath, Buffer.from(imageResponse.data));

    api.setMessageReaction("✅", reactionMsgID, () => {}, true);
    api.sendMessage(
      {
        body: "✅ Edit complete",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );
  } catch (err) {
    console.error("EDIT Error:", err?.response?.data || err.message);
    api.setMessageReaction("❌", reactionMsgID, () => {}, true);
    api.sendMessage("❌ Failed to edit\nReason: unexpected error", event.threadID, event.messageID);
  }
}
