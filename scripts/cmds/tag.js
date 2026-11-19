module.exports = {
  config: {
    name: "tag",
    category: "box chat",
    role: 0,
    author: "EryXenX",
    countDown: 3,
    description: {
      en: "Tag members by name, reply or everyone"
    },
    guide: {
      en: "{p}tag [name] [msg]\n{p}tag all [msg]\nReply + {p}tag [msg]"
    }
  },

  onStart: async ({ api, event, usersData, threadsData, args }) => {
    const { threadID, messageID, messageReply } = event;

    try {
      const threadData = await threadsData.get(threadID);

      const members = threadData.members
        .filter(member => member.inGroup)
        .map(member => ({
          name: member.name,
          id: member.userID
        }));

      let tagUsers = [];
      let text = "";

      if (messageReply) {
        const uid = messageReply.senderID;
        const name = await usersData.getName(uid);

        tagUsers.push({
          name,
          id: uid
        });

        text = args.join(" ");
      }

      else if (
        args[0] &&
        ["all", "everyone", "cdi"].includes(args[0].toLowerCase())
      ) {
        tagUsers = members;
        text = args.slice(1).join(" ");
      }

      else {
        if (!args[0]) {
          return api.sendMessage(
            "⚠️ | Reply, name or all use korun.",
            threadID,
            messageID
          );
        }

        const searchName = args[0].toLowerCase();
        text = args.slice(1).join(" ");

        tagUsers = members.filter(member =>
          member.name.toLowerCase().includes(searchName)
        );

        if (tagUsers.length === 0) {
          return api.sendMessage(
            "❌ | User Not Found.",
            threadID,
            messageID
          );
        }
      }

      const mentions = tagUsers.map(user => ({
        tag: user.name,
        id: user.id
      }));

      const namesText = tagUsers
        .map(user => `• ${user.name}`)
        .join("\n");

      const body = text
        ? `╭─ Tag Notice\n${namesText}\n├──────────\n💬 ${text}\n╰──────────`
        : `╭─ Tag Notice\n${namesText}\n╰──────────`;

      return api.sendMessage(
        {
          body,
          mentions
        },
        threadID,
        messageReply ? messageReply.messageID : messageID
      );
    } catch (error) {
      return api.sendMessage(
        `❌ | Error: ${error.message}`,
        threadID,
        messageID
      );
    }
  }
};