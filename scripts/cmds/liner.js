const axios = require('axios');

async function liner(api, event, args, message) {
  try {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    const response = await getLinerResponse(prompt);

    if (response && response.answer) {
      message.reply(response.answer, (r, s) => {
        global.GoatBot.onReply.set(s.messageID, {
          commandName: module.exports.config.name,
          uid: event.senderID 
        });
      });
    } else {
      message.reply("No response from Liner.");
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply("An error occurred while processing your request.");
  }
}

async function getLinerResponse(prompt) {
  try {
    const url = `https://liner-ai.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error from Liner API:", error.message);
    throw error;
  }
}

module.exports = {
  config: {
    name: "liner",
    version: "1.0",
    author: "nexo_here",
    role: 0,
    longDescription: "Liner AI assistant.",
    category: "ai",
    guide: {
      en: "{p}liner [prompt]"
    }
  },

  handleCommand: liner,
  onStart: function ({ api, message, event, args }) {
    return liner(api, event, args, message);
  },
  onReply: function ({ api, message, event, args }) {
    return liner(api, event, args, message);
  }
};