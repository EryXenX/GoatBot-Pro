const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");

const { configCommands } = global.GoatBot;
const { log } = global.utils;

function getDomain(url) {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function extractUrlFromText(text) {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}

async function fetchCodeFromUrl(url) {
  const domain = getDomain(url);
  let fixedUrl = url;

  if (domain === "pastebin.com" && !url.includes("/raw/")) {
    fixedUrl = url.replace("pastebin.com/", "pastebin.com/raw/");
  }

  if (domain === "github.com" && url.includes("/blob/")) {
    fixedUrl = url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  }

  try {
    const res = await axios.get(fixedUrl);
    let code = res.data;

    if (domain === "savetext.net") {
      const $ = cheerio.load(code);
      code = $("#content").text().trim();
    }

    return code;
  } catch {
    return null;
  }
}

function extractCommandName(code) {
  const nameMatch = code.match(/name\s*:\s*["']([^"']+)["']/);
  return nameMatch ? nameMatch[1].trim() + ".js" : null;
}

module.exports = {
  config: {
    name: "install",
    version: "3.0",
    author: "Rx Abdullah",
    countDown: 3,
    role: 2,
    hasPrefix: false,
    description: "Install command via reply / code / url",
    category: "owner"
  },

  onStart: async function ({ args, message, event, api }) {

    let rawCode = "";
    let fileName = "";

    if (event.messageReply?.body) {
      const replyText = event.messageReply.body.trim();
      const url = extractUrlFromText(replyText);

      if (url) {
        rawCode = await fetchCodeFromUrl(url);
        if (!rawCode) return message.reply(
          "✖ Failed to fetch code from URL.\n" +
          "Please check the link and try again."
        );
      } else {
        rawCode = replyText;
      }

      fileName = extractCommandName(rawCode);
    }

    else if (args[0] && isURL(args[0])) {
      rawCode = await fetchCodeFromUrl(args[0]);
      if (!rawCode) return message.reply(
        "✖ Invalid or unreachable URL.\n" +
        "Make sure the link is accessible and try again."
      );

      fileName = extractCommandName(rawCode);
    }

    else if (args.length >= 2 && args[0].endsWith(".js")) {
      fileName = args[0];
      rawCode = args.slice(1).join(" ");
    }

    if (!rawCode)
      return message.reply(
        "⚠ No code provided.\n\n" +
        "Usage:\n" +
        "• Reply to a message containing code or URL\n" +
        "• Provide a raw URL directly\n" +
        "• install <name.js> <code>"
      );

    if (!fileName)
      return message.reply(
        "✖ Could not detect command name.\n" +
        "Make sure the code has a valid name field."
      );

    const filePath = path.join(process.cwd(), "scripts", "cmds", fileName);

    if (fs.existsSync(filePath)) {
      return message.reply(
        `⚠ ${fileName} already exists.\n\n` +
        "React to this message to overwrite and reinstall.",
        (err, info) => {
          global.GoatBot.onReaction.set(info.messageID, {
            commandName: "install",
            author: event.senderID,
            data: { rawCode, fileName }
          });
        }
      );
    }

    fs.writeFileSync(filePath, rawCode);

    const load = global.utils.loadScripts(
      "cmds",
      fileName.replace(".js", ""),
      log,
      configCommands,
      api
    );

    if (load.status === "success") {
      return message.reply(
        `✅ Installed: ${fileName}\n` +
        `📌 Status: Loaded & Ready`
      );
    } else {
      return message.reply(
        `✖ Installation failed: ${fileName}\n` +
        `⚠ Error: ${load.error?.message || "Unknown error"}`
      );
    }
  },

  onReaction: async function ({ Reaction, event, message, api }) {

    if (event.userID !== Reaction.author) return;

    const { rawCode, fileName } = Reaction.data;

    const filePath = path.join(process.cwd(), "scripts", "cmds", fileName);

    fs.writeFileSync(filePath, rawCode);

    const load = global.utils.loadScripts(
      "cmds",
      fileName.replace(".js", ""),
      log,
      configCommands,
      api
    );

    if (load.status === "success") {
      message.reply(
        `✅ Overwritten & Reloaded: ${fileName}\n` +
        `📌 Status: Loaded & Ready`
      );
    } else {
      message.reply(
        `✖ Overwrite failed: ${fileName}\n` +
        `⚠ Error: ${load.error?.message || "Unknown error"}`
      );
    }
  }
};
