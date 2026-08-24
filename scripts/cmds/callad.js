const { getStreamsFromAttachment, log } = global.utils;

const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
  config: {
    name: "callad",
    aliases: ["call", "called"],
    version: "2.0",
    author: "NTKhang | Edited by Akash",
    countDown: 5,
    role: 0,
    category: "contacts admin",
    description: {
      en: "Send message or report directly to bot admin"
    },
    guide: {
      en: "{pn} <your message>"
    }
  },

  langs: {
    en: {
      missingMessage: "❗ Please write a message to send",
      noAdmin: "⚠️ No admin found",
      sentFromGroup: "\n👥 Group: %1\n🧵 Thread ID: %2",
      sentFromUser: "\n👤 Sent from private chat",

      userContent:
        "\n\n📩 Message:\n%1\n\n↩️ Reply to respond",

      success:
        "✅ Message Sent\n\n📨 Sent to %1 admin(s)",

      failed:
        "❌ Failed to send message to %1 admin(s)",

      adminReply:
        "📍 Admin Reply\n\n👤 %1:\n%2\n\n↩️ Reply to continue",

      userFeedback:
        "📝 User Feedback\n\n👤 %1\n🆔 %2%3\n\n📩 Message:\n%4",

      replySuccess: "✅ Reply sent successfully"
    }
  },

  onStart: async function ({
    args, message, event, usersData, threadsData, api, commandName, getLang
  }) {
    if (!args[0])
      return message.reply(getLang("missingMessage"));

    const { senderID, threadID, isGroup } = event;
    const adminBot = global.GoatBot.config.adminBot;
    if (!adminBot.length)
      return message.reply(getLang("noAdmin"));

    const senderName = await usersData.getName(senderID);

    let body =
      "📞 CALL ADMIN\n\n" +
      `👤 User: ${senderName}\n` +
      `🆔 ID: ${senderID}`;

    body += isGroup
      ? getLang("sentFromGroup", (await threadsData.get(threadID)).threadName, threadID)
      : getLang("sentFromUser");

    body += getLang("userContent", args.join(" "));

    const formMessage = {
      body,
      mentions: [{ id: senderID, tag: senderName }],
      attachment: await getStreamsFromAttachment(
        [...event.attachments, ...(event.messageReply?.attachments || [])]
          .filter(item => mediaTypes.includes(item.type))
      )
    };

    let success = 0;

    for (const uid of adminBot) {
      try {
        const info = await api.sendMessage(formMessage, uid);
        success++;
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          type: "userCallAdmin",
          threadID,
          messageIDSender: event.messageID
        });
      } catch (e) {
        log.err("CALL ADMIN", e);
      }
    }

    return message.reply(getLang("success", success));
  },

  onReply: async function ({
    args, event, api, message, Reply, usersData, commandName, getLang
  }) {
    const senderName = await usersData.getName(event.senderID);

    if (Reply.type === "userCallAdmin") {
      const body = getLang("adminReply", senderName, args.join(" "));
      api.sendMessage(
        { body },
        Reply.threadID,
        () => message.reply(getLang("replySuccess")),
        Reply.messageIDSender
      );
    }
  }
};