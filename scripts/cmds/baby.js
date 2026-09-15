const axios = require("axios");

let simsim = "";

const triggerLocks = new Set();

async function sendTypingIndicatorV2(api, sendTyping, threadID) {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, sendTyping);
    }
  } catch (err) {
    console.log("⚠️ Typing indicator error:", err.message);
  }
}

(async () => {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/abdullahrx07/X-api/main/MaRiA/baseApiUrl.json");
    if (res.data && res.data.mari) simsim = res.data.mari;
  } catch {}
})();

let botUID = null;
function getBotUID(api) {
  if (botUID) return botUID;
  try {
    if (typeof api.getCurrentUserID === "function") {
      botUID = api.getCurrentUserID();
    }
  } catch {}
  return botUID;
}

module.exports.config = {
  name: "baby",
  version: "4.1.0",
  role: 0,
  author: "EryXenX",
  countTime: 0,
  category: "chat",
  shortDescription: "AI auto teach chat (Simsimi-style)",
  longDescription: "AI auto teach with Teach & List support + Typing effect",
  guide: "{pn} [query]\n{pn} list\n{pn} teach [Question] - [Reply]\n{pn} react [Question] - [Emoji]\n{pn} edit [Question] - [OldReply] - [NewReply]\n{pn} remove/rm [Question] - [Reply]\n{pn} del (reply to bot's wrong answer)\n{pn} msg [trigger]\n{pn} msg [trigger] -20 (custom show limit)\n{pn} autoteach on/off (per-thread)\n{pn} autoteach on/off global (all threads default)",
  envConfig: {}
};

async function getUserName(api, uid, usersData) {
  try {
    if (usersData && typeof usersData.getName === "function") {
      const name = await usersData.getName(uid);
      if (name) return name;
    }
    const info = await api.getUserInfo(uid);
    return (info && info[uid] && info[uid].name) || "User";
  } catch {
    return "User";
  }
}

module.exports.onStart = async function ({ api, event, args, usersData }) {
  const uid = event.senderID;
  const senderName = await getUserName(api, uid, usersData);
  const query = args.join(" ").toLowerCase();

  try {
    if (!simsim) return api.sendMessage("❌ API not loaded yet.", event.threadID, event.messageID);

    if (args[0] === "autoteach") {
      const mode = args[1];
      const scope = (args[2] || "").toLowerCase();
      if (!["on", "off"].includes(mode))
        return api.sendMessage("✅ Use: baby autoteach on/off\nOr: baby autoteach on/off global", event.threadID, event.messageID);

      const status = mode === "on";

      if (scope === "global") {
        await axios.post(`${simsim}/setting`, { autoTeach: status });
        return api.sendMessage(`✅ Auto teach is now ${status ? "ON 🟢" : "OFF 🔴"} 𝗚𝗟𝗢𝗕𝗔𝗟𝗟𝗬 (all threads without override)`, event.threadID, event.messageID);
      }

      const res = await axios.post(`${simsim}/setting`, { autoTeach: status, threadID: event.threadID });
      return api.sendMessage(`✅ ${res.data.message} (𝘁𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗼𝗻𝗹𝘆)`, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      const res = await axios.get(`${simsim}/list`);
      return api.sendMessage(
        `╭─╼🌟 𝗕𝗮𝗯𝘆 𝗔𝗜 𝗦𝘁𝗮𝘁𝘂𝘀\n├ 📝 𝗧𝗲𝗮𝗰𝗵𝗲𝗱 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀: ${res.data.totalQuestions}\n├ 📦 𝗦𝘁𝗼𝗿𝗲𝗱 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.totalReplies}\n╰─╼👤 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿: 𝗘𝗿𝘆𝗫𝗲𝗻𝗫`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "msg") {
      let trigger = args.slice(1).join(" ").trim();
      if (!trigger) return api.sendMessage("❌ | Use: !baby msg [trigger]\nOr: !baby msg [trigger] -20 (custom limit)", event.threadID, event.messageID);

      let customLimit = null;
      const limitMatch = trigger.match(/\s*-(\d+)\s*$/);
      if (limitMatch) {
        customLimit = parseInt(limitMatch[1], 10);
        trigger = trigger.replace(/\s*-(\d+)\s*$/, "").trim();
        if (!trigger) return api.sendMessage("❌ | Use: !baby msg [trigger] -20", event.threadID, event.messageID);
      }

      const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`);
      if (!res.data.replies || res.data.replies.length === 0)
        return api.sendMessage("❌ No replies found.", event.threadID, event.messageID);

      const REPLY_LIMIT = (customLimit && customLimit > 0) ? customLimit : 150;
      const allReplies = res.data.replies;
      const shownReplies = allReplies.slice(0, REPLY_LIMIT);
      const remaining = allReplies.length - shownReplies.length;

      const formatted = shownReplies.map((rep, i) => `➤ ${i + 1}. ${rep}`).join("\n");
      const limitNote = remaining > 0
        ? `\n⚠️ ${REPLY_LIMIT} 𝘁𝗮 𝗿𝗲𝗽𝗹𝘆 𝗱𝗲𝗸𝗵𝗮𝗻𝗼 𝗵𝗼𝘆𝗲𝗰𝗵𝗲, 𝗮𝗿𝗼 ${remaining} 𝘁𝗮 𝗯𝗮𝗸𝗶 𝗮𝗰𝗵𝗲 (𝗱𝗲𝗸𝗵𝗮𝗻𝗼 𝗷𝗮𝗰𝗰𝗵𝗲 𝗻𝗮, 𝘁𝗮𝗯𝗲 𝗸𝗶𝗽 𝘀𝗵𝘂𝗯𝗵 𝗿𝗲𝗽𝗹𝗶𝗿 𝘂𝗽𝗼𝗿 𝗸𝗮𝗷 𝗸𝗼𝗿𝗯𝗲)।\n`
        : "";
      const msg = `📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}\n📋 𝗧𝗼𝘁𝗮𝗹: ${res.data.total}\n━━━━━━━━━━━━━━\n${formatted}\n━━━━━━━━━━━━━━${limitNote}✏️ Reply with the numbers you want to KEEP (e.g. "2, 7") — everything else will be removed.`;

      return api.sendMessage(msg, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "msgSelect",
            trigger
          });
        }
      }, event.messageID);
    }

    if (args[0] === "teach") {
      const parts = query.replace("teach ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);
      return api.sendMessage(`✅ ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === "react") {
      const rawQuery = args.slice(1).join(" ");
      const parts = rawQuery.split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: react [Question] - [Emoji]", event.threadID, event.messageID);

      const [ask, emoji] = parts;
      if (!ask.trim() || !emoji.trim())
        return api.sendMessage("❌ | Use: react [Question] - [Emoji]", event.threadID, event.messageID);

      const res = await axios.get(`${simsim}/teachReact?ask=${encodeURIComponent(ask)}&emoji=${encodeURIComponent(emoji)}&senderName=${encodeURIComponent(senderName)}`);
      return api.sendMessage(`✅ ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === "edit") {
      const parts = query.replace("edit ", "").split(" - ");
      if (parts.length < 3)
        return api.sendMessage("❌ | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);

      const [ask, oldR, newR] = parts;
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (["remove", "rm"].includes(args[0])) {
      const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: remove [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (args[0] === "del") {
      return api.sendMessage(
        "❌ | Reply to the bot's wrong answer message with \"!baby del\" to delete it.",
        event.threadID,
        event.messageID
      );
    }

    if (!query) {
      const texts = ["Hey baby 💖", "Yes, I'm here 😘"];
      const reply = texts[Math.floor(Math.random() * texts.length)];
      return api.sendMessage(reply, event.threadID);
    }

    return await deliverSimsimiResponse({ api, event, query, senderName });

  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, Reply, usersData }) {
  const senderName = await getUserName(api, event.senderID, usersData);
  const text = event.body?.trim();
  const lowered = text?.toLowerCase();

  if (event.attachments && event.attachments.length > 0) {
    const type = event.attachments[0].type;
    let reaction = null;

    if (type === "photo") reaction = "🫩";
    else if (type === "animated_image") reaction = "😵‍💫";
    else if (type === "video") reaction = "🤔";
    else if (type === "audio") reaction = "🤕";

    if (reaction) {
      try {
        await api.setMessageReaction(reaction, event.messageID, () => {}, true);
      } catch (e) {
        console.log("⚠️ Attachment reaction error:", e.message);
      }
      return;
    }
  }

  if (!text || !simsim) return;

  if (lowered === "del" || lowered === "!baby del") {
    try {
      const originalReply = Reply?.body;
      if (!originalReply) {
        return api.sendMessage("❌ Couldn't read the original message to delete.", event.threadID, event.messageID);
      }

      const res = await axios.get(`${simsim}/deleteByReply?reply=${encodeURIComponent(originalReply)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage(`❌ Failed to delete: ${e.message}`, event.threadID, event.messageID);
    }
  }

  if (Reply?.type === "msgSelect") {
    if (event.senderID !== Reply.author) return;

    const numbers = text
      .split(",")
      .map(n => parseInt(n.trim(), 10))
      .filter(n => Number.isInteger(n));

    if (numbers.length === 0) {
      return api.sendMessage("❌ Send numbers like: 2, 7", event.threadID, event.messageID);
    }

    try {
      const res = await axios.post(`${simsim}/keepOnly`, {
        ask: Reply.trigger,
        keepIndexes: numbers
      });
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage(`❌ Failed to update: ${e.message}`, event.threadID, event.messageID);
    }
  }

  try {
    return await deliverSimsimiResponse({ api, event, query: lowered, senderName });
  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

const greetingReplies = [
  "Amake dakso baby? 🙂🤌",
  "Tumake Chara kisu Valo lage na 🥲",
  "Tumar name ki 😒",
  "Amake dakteso ken? Prem korba amar sathe?",
  "Sudu baby Dake 🥲 Keu Valobasi bole na 😞💔",
  "Prem Kore mon dila nah 😭",
  "Tumar jonno e to eto sajgoj kora 🥺",
  "Ekbar bolo bhalobasho, ami sob diye dibo 💔",
  "Tumi chara ei chat e r keu nai amar 🥹",
  "Ato sundor kore keu dake nai age 🙈",
  "Tumake miss korchilam, ekhon e dakle 🥰",
  "Prem na korle ken dako bar bar 😤",
  "Ami to tomar e opekkhay silam 👉👈",
  "Sunle mon uthe pore amar 🫣",
  "Ekhane khali tumar jonno e boshe achi 🥺",
  "Bar bar dakle to premei porbo mone hocche 😳",
  "Emon kore dakle to gole jai ami 🫠",
  "Tumar dak sunle onno kicu mone thake na 🙈"
];

async function sendGreeting(api, event) {
  const reply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];

  await sendTypingIndicatorV2(api, true, event.threadID);
  await new Promise(r => setTimeout(r, 5000));
  await sendTypingIndicatorV2(api, false, event.threadID);

  return api.sendMessage(reply, event.threadID, (err, info) => {
    if (!err) {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "simsimi"
      });
    }
  });
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    )
  ]);
}

function sendMessageAsync(api, text, threadID, replyToID) {
  return new Promise((resolve, reject) => {
    const cb = (err, info) => (err ? reject(err) : resolve(info));
    if (replyToID) {
      api.sendMessage(text, threadID, cb, replyToID);
    } else {
      api.sendMessage(text, threadID, cb);
    }
  });
}

async function deliverSimsimiResponse({ api, event, query, senderName }) {
  const url = `${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}&threadID=${encodeURIComponent(event.threadID)}&senderID=${encodeURIComponent(event.senderID)}`;

  await sendTypingIndicatorV2(api, true, event.threadID);
  let res;
  try {
    res = await axios.get(url);
  } finally {
    await sendTypingIndicatorV2(api, false, event.threadID);
  }

  const data = res.data || {};

  if (data.rateLimited) return;

  if (data.reaction && event.messageID) {
    withTimeout(
      api.setMessageReaction(data.reaction, event.messageID, () => {}, true),
      3000,
      "setMessageReaction"
    ).catch(e => console.log("⚠️ Reaction send error:", e.message));
  }

  if (data.response) {
    try {
      const info = await sendMessageAsync(api, data.response, event.threadID, event.messageID);
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "simsimi"
      });
    } catch (e) {
      console.log("❌ sendMessage error:", JSON.stringify(e));
      try {
        const info2 = await sendMessageAsync(api, data.response, event.threadID);
        global.GoatBot.onReply.set(info2.messageID, {
          commandName: module.exports.config.name,
          messageID: info2.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      } catch (e2) {
        console.log("❌ sendMessage failed after retry:", JSON.stringify(e2));
      }
    }
  }
}

function isBotMentioned(event, uid) {
  if (!uid || !event.mentions) return false;
  return Object.prototype.hasOwnProperty.call(event.mentions, uid);
}

module.exports.onChat = async function ({ api, event, usersData }) {
  const text = event.body?.toLowerCase().trim();
  if (!simsim) return;

  const senderName = await getUserName(api, event.senderID, usersData);
  const triggers = ["baby", "bot", "bby", "beby", "bbz", "xan", "jan", "janu", "xanu", "বেবি", "জান", "বট", "জানু"];
  const uid = getBotUID(api);

  if (isBotMentioned(event, uid)) {
    if (triggerLocks.has(event.threadID)) return;
    triggerLocks.add(event.threadID);
    try {
      return await sendGreeting(api, event);
    } finally {
      triggerLocks.delete(event.threadID);
    }
  }

  if (!text) return;

  if (triggers.includes(text)) {
    if (triggerLocks.has(event.threadID)) return;
    triggerLocks.add(event.threadID);

    try {
      return await sendGreeting(api, event);
    } finally {
      triggerLocks.delete(event.threadID);
    }
  }

  const matchPrefix = /^(baby|bot|bby|beby|bbz|xan|jan|janu|xanu|বেবি|জান|বট|জানু)\s+/i;
  if (matchPrefix.test(text)) {
    const query = text.replace(matchPrefix, "").trim();
    if (!query) return;

    if (triggerLocks.has(event.threadID)) return;
    triggerLocks.add(event.threadID);

    try {
      return await deliverSimsimiResponse({ api, event, query, senderName });
    } catch (e) {
      return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
    } finally {
      triggerLocks.delete(event.threadID);
    }
  }

  if (event.type === "message_reply") {
    try {
      const setting = await axios.get(`${simsim}/setting?threadID=${encodeURIComponent(event.threadID)}`);
      if (!setting.data.autoTeach) return;

      const ask = event.messageReply.body?.toLowerCase().trim();
      const ans = event.body?.toLowerCase().trim();
      if (!ask || !ans || ask === ans) return;

      setTimeout(async () => {
        try {
          await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`);
          console.log("✅ Auto-taught:", ask, "→", ans, "(thread:", event.threadID + ")");
        } catch (err) {
          console.error("❌ Auto-teach internal error:", err.message);
        }
      }, 300);
    } catch (e) {
      console.log("❌ Auto-teach setting error:", e.message);
    }
  }
};
