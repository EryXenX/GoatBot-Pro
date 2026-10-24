const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "allbox",
    version: "1.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 60,
    role: 2,
    shortDescription: "Manage all joined groups",
    longDescription: "List all groups and reply to Ban, Unban, Delete data, or remove the bot",
    category: "box chat",
    usages: "[page number/all]",
  },

  onStart: async function ({ event, api, commandName }) {
    const { threadID, messageID } = event;

    try {
      const dataThreads = await api.getThreadList(100, null, ["INBOX"]);
      const groups = dataThreads.filter(thread => thread.isGroup);
      if (!groups.length) return api.sendMessage("There are currently no groups!", threadID);

      // Sort groups by messageCount descending
      groups.sort((a, b) => b.messageCount - a.messageCount);

      let msg = "🎭 GROUP LIST 🎭\n\n";
      const groupid = [];
      const groupName = [];

      groups.forEach((g, i) => {
        msg += `${i + 1}. ${g.name}\n🔰TID: ${g.threadID}\n💌MessageCount: ${g.messageCount}\n\n`;
        groupid.push(g.threadID);
        groupName.push(g.name);
      });

      msg += "Reply to this message with: <ban | unban | del | out> + number or 'all'";

      api.sendMessage(msg, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          groupid,
          groupName,
          unsendTimeout: setTimeout(() => api.unsendMessage(info.messageID), this.config.countDown * 1000)
        });
      }, messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("Error fetching group list.", threadID);
    }
  },

  onReply: async function ({ event, Reply, api }) {
    const { author, groupid, groupName, messageID } = Reply;
    if (event.senderID !== author) return;

    const args = event.body.trim().toLowerCase().split(" ");
    clearTimeout(Reply.unsendTimeout);

    const action = args[0];
    const index = parseInt(args[1]) - 1;

    if (!["ban", "unban", "del", "out"].includes(action)) {
      return api.sendMessage("Invalid action. Use: ban, unban, del, out", event.threadID);
    }

    if (args[1] === "all") {
      for (let i = 0; i < groupid.length; i++) {
        await processGroup(action, i);
      }
      return api.sendMessage(`✅ ${action.toUpperCase()} executed on all groups.`, event.threadID);
    } else {
      if (index < 0 || index >= groupid.length) return api.sendMessage("Invalid number!", event.threadID);
      await processGroup(action, index);
    }

    async function processGroup(act, i) {
      const idgr = groupid[i];
      const gName = groupName[i];
      const Threads = global.GoatBot.Threads;

      if (act === "ban") {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        data.dateAdded = moment.tz("Asia/Dhaka").format("HH:mm:ss L");
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
        api.sendMessage(`✅ Banned: ${gName}`, event.threadID);
      }

      if (act === "unban") {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 0;
        data.dateAdded = null;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.delete(idgr);
        api.sendMessage(`✅ Unbanned: ${gName}`, event.threadID);
      }

      if (act === "del") {
        const data = (await Threads.getData(idgr)).data || {};
        await Threads.delData(idgr, { data });
        api.sendMessage(`✅ Data deleted: ${gName}`, event.threadID);
      }

      if (act === "out") {
        api.removeUserFromGroup(api.getCurrentUserID(), idgr);
        api.sendMessage(`✅ Bot removed from: ${gName}`, event.threadID);
      }
    }

    api.unsendMessage(messageID);
  }
};
