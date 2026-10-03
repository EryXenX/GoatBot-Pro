module.exports = {
  config: {
    name: "anti_isis_leave",
    author: "MOHAMMAD AKASH",
    version: "7.0",
    shortDescription: "ISIS সংশ্লিষ্ট শব্দ পেলেই স্বয়ংক্রিয় লিভ",
    category: "system"
  },

  onStart: async function () {},

  // ==========================
  // 🔥 All trigger list
  // ==========================
  triggers: [
    "我是 ISIS☝",
    "我是杀人犯☝",
    "☝️😭‼️‼️我是一名恐怖分子，我是一名 ISIS 恐怖分子，我是一名☝️😭‼️‼️"
  ],

  // Universal checker
  checkTrigger(text, triggers) {
    if (!text) return false;
    return triggers.some(trigger => text.includes(trigger));
  },

  // ==========================
  // 🔥 On chat event (message + bot add)
  // ==========================
  onChat: async function ({ event, api }) {
    try {
      const botID = api.getCurrentUserID();
      const triggers = this.triggers;

      // === ✔ MESSAGE CHECK ===
      if (event.body && this.checkTrigger(event.body, triggers)) {
        await api.removeUserFromGroup(botID, event.threadID);
        return;
      }

      // === ✔ BOT ADDED CHECK ===
      if (event.logMessageType === "log:subscribe") {
        const added = event.logMessageData?.addedParticipants?.find(p => p.userFbId == botID);

        if (added) {
          api.getThreadInfo(event.threadID, async (err, info) => {
            if (err) return;

            const groupName = info.threadName || "";
            if (this.checkTrigger(groupName, triggers)) {
              await api.removeUserFromGroup(botID, event.threadID);
            }
          });
        }
      }

    } catch (err) {
      console.log("auto leave error:", err);
    }
  },

  // ==========================
  // 🔥 On group rename event
  // ==========================
  onEvent: async function ({ event, api }) {
    try {
      if (event.logMessageType === "log:thread-name") {
        const botID = api.getCurrentUserID();
        const newName = event.logMessageData?.name || "";

        if (this.checkTrigger(newName, this.triggers)) {
          await api.removeUserFromGroup(botID, event.threadID);
        }
      }
    } catch (err) {
      console.log("rename auto leave error:", err);
    }
  }
};
