"use strict";

module.exports = {
  config: {
    name: "pending",
    version: "1.0.9",
    author: "EryXenX",
    aliases: [],
    role: 2,
    shortDescription: "Manage bot's waiting groups",
    longDescription: "Approve or cancel pending groups",
    category: "owner",
    countDown: 10
  },

  languages: {
    en: {
      invaildNumber: "%1 is not a valid number",
      cancelSuccess: "❌ Cancelled %1 thread(s)",
      approveSuccess: "✅ Approved %1 thread(s)",
      cantGetPendingList: "⚠️ Can't get pending list",
      returnListClean: "No pending group found"
    },
    bn: {
      invaildNumber: "%1 সঠিক নাম্বার নয়",
      cancelSuccess: "❌ %1 টি থ্রেড বাতিল করা হয়েছে",
      approveSuccess: "✅ %1 টি থ্রেড অনুমোদন করা হয়েছে",
      cantGetPendingList: "⚠️ পেন্ডিং লিস্ট আনা যাচ্ছে না",
      returnListClean: "কোনো পেন্ডিং গ্রুপ পাওয়া যায়নি"
    },
    hi: {
      invaildNumber: "%1 एक मान्य नंबर नहीं है",
      cancelSuccess: "❌ %1 थ्रेड रद्द किए गए",
      approveSuccess: "✅ %1 थ्रेड स्वीकृत किए गए",
      cantGetPendingList: "⚠️ पेंडिंग लिस्ट प्राप्त नहीं हो सकी",
      returnListClean: "कोई पेंडिंग ग्रुप नहीं मिला"
    },
    tl: {
      invaildNumber: "%1 ay hindi wastong numero",
      cancelSuccess: "❌ %1 thread(s) ang kinansela",
      approveSuccess: "✅ %1 thread(s) ang na-approve",
      cantGetPendingList: "⚠️ Hindi makuha ang pending list",
      returnListClean: "Walang nahanap na pending group"
    },
    ar: {
      invaildNumber: "%1 ليس رقمًا صالحًا",
      cancelSuccess: "❌ تم إلغاء %1 محادثة",
      approveSuccess: "✅ تمت الموافقة على %1 محادثة",
      cantGetPendingList: "⚠️ لا يمكن الحصول على قائمة الانتظار",
      returnListClean: "لم يتم العثور على أي مجموعة معلقة"
    }
  },

  _getText(key, ...args) {
    const lang = global.GoatBot?.config?.language || "en";
    const text = (this.languages[lang] && this.languages[lang][key]) || this.languages.en[key] || key;
    return args.length
      ? text.replace("%1", args[0]).replace("%2", args[1] || "")
      : text;
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    let pendingList = [];

    try {
      const other = await api.getThreadList(100, null, ["OTHER"]);
      const pending = await api.getThreadList(100, null, ["PENDING"]);

      pendingList = [...other, ...pending].filter(
        g => g.isGroup && g.isSubscribed
      );
    } catch {
      return api.sendMessage(
        this._getText("cantGetPendingList"),
        threadID,
        messageID
      );
    }

    if (!pendingList.length)
      return api.sendMessage(
        this._getText("returnListClean"),
        threadID,
        messageID
      );

    const prefix = global.GoatBot?.config?.prefix || "!";

    let msg = "";
    pendingList.forEach((g, i) => {
      msg += `${i + 1}️⃣ ${g.name}\n🆔 ${g.threadID}\n\n`;
    });

    const finalMsg =
`📋 Pending Groups (${pendingList.length})
━━━━━━━━━━━━━━━━━━━

${msg}━━━━━━━━━━━━━━━━━━━
✅ Approve » ${prefix}pending 1 2
❌ Cancel  » ${prefix}pending c 1 2`;

    return api.sendMessage(finalMsg, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: senderID,
        pending: pendingList
      });
    }, messageID);
  },

  onReply: async function ({ event, Reply, api }) {
    const { author, pending } = Reply;

    if (String(event.senderID) !== String(author)) return;

    const input = event.body.trim().toLowerCase().split(/\s+/);
    const botID = api.getCurrentUserID();
    const prefix = global.GoatBot?.config?.prefix || "!";
    let count = 0;

    if (input[0] === "c" || input[0] === "cancel") {
      for (let i = 1; i < input.length; i++) {
        const idx = parseInt(input[i]);

        if (isNaN(idx) || idx <= 0 || idx > pending.length)
          return api.sendMessage(
            this._getText("invaildNumber", input[i]),
            event.threadID
          );

        await api.removeUserFromGroup(botID, pending[idx - 1].threadID);
        count++;
      }

      return api.sendMessage(
        this._getText("cancelSuccess", count),
        event.threadID
      );
    }

    for (const v of input) {
      const idx = parseInt(v);

      if (isNaN(idx) || idx <= 0 || idx > pending.length)
        return api.sendMessage(
          this._getText("invaildNumber", v),
          event.threadID
        );

      const tID = pending[idx - 1].threadID;

      await api.sendMessage(
`🎉 GROUP APPROVED 

👋 Hello everyone!
🤖 I am now active in this group.

⚙️ Prefix: ${prefix}
📜 Type ${prefix}help to see all commands

🚀 Bot is ready to assist you!`,
        tID
      );

      const nickNameBot = global.GoatBot?.config?.nickNameBot;
      if (nickNameBot)
        await api.changeNickname(nickNameBot, tID, botID);

      count++;
    }

    return api.sendMessage(
      this._getText("approveSuccess", count),
      event.threadID
    );
  }
};