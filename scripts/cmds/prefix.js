
const fs = require("fs-extra");
const axios = require("axios");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "NADIM",
    countDown: 5,
    role: 0,
    description: "Prefix information with video",
    category: "config"
  },

  langs: {
    en: {
      reset: "Prefix reset to default: %1",
      onlyAdmin: "Only bot admins can change global prefix.",
      confirmGlobal: "React to confirm global prefix change.",
      confirmThisThread: "React to confirm group prefix change.",
      successGlobal: "Global prefix changed to: %1",
      successThisThread: "Group prefix changed to: %1",
      myPrefix: "╭━━━━━━━━━━━━━━━━━━╮\n       🌟 PREFIX INFORMATION 🌟\n╰━━━━━━━━━━━━━━━━━━╯\n\n🌐 Global Prefix: %1\n🛸 Group Prefix: %2\n\n🔧 Type \"%2help\" to see all commands\n\n👑 Powered by NADIM 🦖\n╰━━━━━━━━━━━━━━━━━━╯"
    }
  },

  onStart: async function ({
    message, role, args, commandName,
    event, threadsData, getLang
  }) {
    if (!args[0]) {
      return this.onChat({
        event: { ...event, body: "prefix" },
        message,
        getLang
      })?.();
    }

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(
        getLang("reset", global.GoatBot.config.prefix)
      );
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal && role < 2)
      return message.reply(getLang("onlyAdmin"));

    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal
    };

    return message.reply(
      setGlobal
        ? getLang("confirmGlobal")
        : getLang("confirmThisThread"),
      (err, info) => {
        if (err || !info) return;
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );
  },

  onReaction: async function ({
    message, threadsData, event, Reaction, getLang
  }) {
    const { author, newPrefix, setGlobal } = Reaction;

    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(
        global.client.dirConfig,
        JSON.stringify(global.GoatBot.config, null, 2)
      );
      return message.reply(getLang("successGlobal", newPrefix));
    }

    await threadsData.set(event.threadID, newPrefix, "data.prefix");
    return message.reply(getLang("successThisThread", newPrefix));
  },

  onChat: async function ({ event, message, getLang }) {
    if (!event.body || event.body.toLowerCase().trim() !== "prefix")
      return;

    return async () => {
      const text = getLang(
        "myPrefix",
        global.GoatBot.config.prefix,
        utils.getPrefix(event.threadID)
      );

      const videoUrl = "https://i.imgur.com/8Psum3K.mp4";

      try {
        const response = await axios.get(videoUrl, {
          responseType: "stream"
        });

        return message.reply({
          body: text,
          attachment: response.data
        });
      } catch (error) {
        return message.reply(text);
      }
    };
  }
};
