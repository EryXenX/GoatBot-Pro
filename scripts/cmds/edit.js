const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

module.exports.config = {
  name: "edit",
  aliases: ["qwen"],
  author: "rX",
  version: "1.1.2",
  role: 0,
  countDown: 30,
  shortDescription: {
    en: "Edit image using Qwen API"
  },
  longDescription: {
    en: "Edit image using Qwen API (supports 1 or 2 source images)"
  },
  category: "AI",
  guide: {
    en: "{pn} <text> (reply to an image) | {pn} -a <text> (reply to an image, then reply to the bot's message with a 2nd photo)"
  }
};

const API_BASE = "https://qwen-xdi.onrender.com/edit";

function getReplyImageUrl(event) {
  if (
    event.messageReply &&
    event.messageReply.attachments &&
    event.messageReply.attachments[0]
  ) {
    return event.messageReply.attachments[0].url;
  }
  return null;
}

function getOwnImageUrl(event) {
  if (event.attachments && event.attachments[0]) {
    return event.attachments[0].url;
  }
  return null;
}

module.exports.run = async function ({ api, event, args }) {
  const addMode = args.length > 0 && (args[0] === "-a" || args[0] === "--add");
  const promptArgs = addMode ? args.slice(1) : args;
  const prompt = promptArgs.join(" ").trim();

  if (!prompt) {
    return api.sendMessage(
      addMode
        ? "⚠️ Usage: edit -a <text> (reply to an image)"
        : "⚠️ Please provide some text for the image.",
      event.threadID,
      event.messageID
    );
  }

  const imgUrl = getReplyImageUrl(event);
  if (!imgUrl) {
    return api.sendMessage(
      "⚠️ Please reply to an image.",
      event.threadID,
      event.messageID
    );
  }

  if (addMode) {
    // React 🫩 on the command message itself (edit -a <prompt>)
    api.setMessageReaction("🫩", event.messageID, () => {}, true);
  } else {
    api.setMessageReaction("🐣", event.messageID, () => {}, true);
    return runEditRequest({ api, event, prompt, imageUrls: [imgUrl], reactionMsgID: event.messageID });
  }

  api.sendMessage(
    "📷 𝐀𝐝𝐝 𝐚𝐧𝐨𝐭𝐡𝐞𝐫 𝐩𝐡𝐨𝐭𝐨 — reply to this message with the 2nd image.",
    event.threadID,
    (err, info) => {
      if (err || !info) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      // GoatBot reply-tracking: register via the global onReply store
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        prompt,
        imageUrls: [imgUrl],
        reactionMsgID: event.messageID,
      });
    },
    event.messageID
  );
};

module.exports.handleReply = async function ({ api, event, Reply }) {
  const handleReply = Reply;

  if (event.senderID !== handleReply.author) {
    return;
  }

  const secondUrl = getOwnImageUrl(event);
  if (!secondUrl) {
    return api.sendMessage(
      "⚠️ Please reply to this message with a photo (image attachment).",
      event.threadID,
      event.messageID
    );
  }

  // 2nd image received -> processing reaction goes here
  api.setMessageReaction("🐣", event.messageID, () => {}, true);

  await runEditRequest({
    api,
    event,
    prompt: handleReply.prompt,
    imageUrls: [...handleReply.imageUrls, secondUrl],
    reactionMsgID: event.messageID,
  });

  // Clean up the reply listener once handled.
  // Use handleReply.messageID (the tracked entry) instead of
  // event.messageReply.messageID, which can be undefined if the
  // event doesn't carry a messageReply object.
  global.GoatBot.onReply.delete(handleReply.messageID);
};

/** Shared: build the backend request and send back the edited image. */
async function runEditRequest({ api, event, prompt, imageUrls, reactionMsgID }) {
  try {
    const params = new URLSearchParams();
    params.set("image", imageUrls[0]);
    if (imageUrls[1]) params.set("image2", imageUrls[1]);
    params.set("prompt", prompt);

    const requestURL = `${API_BASE}?${params.toString()}`;
    console.log("🔗 Request URL:", requestURL);

    const res = await axios.get(requestURL, { timeout: 120000 });
    console.log("📦 Full API response status:", res.status);
    console.log("📦 Full API response data:", JSON.stringify(res.data, null, 2));

    const data = res.data;
    const finalImageURL = data && data.success ? data.imageUrl : null;

    if (!finalImageURL) {
      const errMsg = (data && (data.error || data.message)) || "Unknown reason";
      console.log("❌ Failed. success:", data && data.success, "| reason:", errMsg);
      api.setMessageReaction("⚠️", reactionMsgID, () => {}, true);
      return api.sendMessage(
        `❌ API Error: ${errMsg}`,
        event.threadID,
        event.messageID
      );
    }

    const cacheDir = path.join(__dirname, "cache");
    // recursive:true avoids the existsSync+mkdirSync race when multiple
    // requests hit this at the same time (EEXIST-safe, no separate check).
    fs.mkdirSync(cacheDir, { recursive: true });

    const imageResponse = await axios.get(finalImageURL, {
      responseType: "arraybuffer",
      timeout: 60000
    });

    const rawBuffer = Buffer.from(imageResponse.data);
    const filePath = path.join(cacheDir, `${Date.now()}.jpg`);

    try {
      await sharp(rawBuffer)
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 92 })
        .toFile(filePath);
    } catch (convErr) {
      console.log("⚠️ sharp conversion failed, falling back to raw bytes:", convErr.message);
      fs.writeFileSync(filePath, rawBuffer);
    }

    api.setMessageReaction("🧃", reactionMsgID, () => {}, true);
    api.sendMessage(
      {
        body: "> 🎀 𝐃𝐨𝐧𝐞",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath)
    );
  } catch (err) {
    if (err.response) {
      console.log("❌ ERROR status:", err.response.status);
      console.log("❌ ERROR data:", err.response.data ? err.response.data.toString() : err.response.data);
    } else if (err.request) {
      console.log("❌ ERROR: No response received —", err.message);
    } else {
      console.log("❌ ERROR:", err.message);
    }
    api.setMessageReaction("❌", reactionMsgID, () => {}, true);
    api.sendMessage(
      "❌ Error while processing the image.",
      event.threadID,
      event.messageID
    );
  }
}
