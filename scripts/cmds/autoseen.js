const fs = require("fs-extra");
const path = __dirname + "/cache/autoseen.json";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ status: true }, null, 2));
}

const seenQueue = [];
const queuedThreads = new Set();
let isProcessingQueue = false;

function randomDelay(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

async function processSeenQueue(api) {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (seenQueue.length > 0) {
    const threadID = seenQueue.shift();
    queuedThreads.delete(threadID);

    await new Promise((r) => setTimeout(r, randomDelay(1500, 4000)));

    try {
      await api.markAsRead(threadID);
    } catch (err) {
      console.error("AUTOSEEN markAsRead failed:", err && err.message ? err.message : err);
    }

    if (seenQueue.length > 0) {
      await new Promise((r) => setTimeout(r, randomDelay(800, 2000)));
    }
  }

  isProcessingQueue = false;
}

function box(title, rows, footer) {
  const lines = [`╭─‣ ${title} 〄`];
  rows.forEach(r => lines.push(`├‣ ${r}`));
  lines.push("╰────────────◊");
  lines.push(` ${footer}`);
  return lines.join("\n");
}

function status(val) {
  return val ? "ON ✦" : "OFF ◌";
}

module.exports = {
  config: {
    name: "autoseen",
    version: "2.1",
    author: "EryXenX",
    countDown: 0,
    role: 0,
    shortDescription: "Automatic seen system",
    longDescription: "Bot automatically marks new messages as seen, one at a time with a delay.",
    category: "system",
    guide: {
      en: "{pn} on/off",
    },
  },

  onStart: async function ({ message, args }) {
    const data = JSON.parse(fs.readFileSync(path));

    if (!args[0]) {
      return message.reply(box("AUTOSEEN", [
        `Status : ${status(data.status)}`
      ], "Reply \"on\" or \"off\" to change"));
    }

    if (args[0].toLowerCase() === "on") {
      data.status = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(box("AUTOSEEN", [
        "Status : ON ✦"
      ], "Autoseen is now enabled"));
    } else if (args[0].toLowerCase() === "off") {
      data.status = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(box("AUTOSEEN", [
        "Status : OFF ◌"
      ], "Autoseen is now disabled"));
    } else {
      return message.reply("⚠️ Usage: autoseen on / off");
    }
  },

  // Marks messages as seen, but not instantly and not all at once —
  // queued and processed one at a time with a randomized delay.
  onChat: async function ({ event, api }) {
    try {
      const data = JSON.parse(fs.readFileSync(path));
      if (data.status !== true) return;
      if (queuedThreads.has(event.threadID)) return;

      queuedThreads.add(event.threadID);
      seenQueue.push(event.threadID);
      processSeenQueue(api);
    } catch (e) {
      console.error(e);
    }
  },
};
