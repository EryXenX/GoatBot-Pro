const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pastebin",
    aliases: ["bin"],
    version: "1.4",
    author: "NeoKEX", // Don't try to change the author name otherwise I'll fvckyourmom
    countDown: 5,
    role: 0,
    shortDescription: "Upload a command's code to Pastebin.",
    longDescription: "Uploads the raw source code of any command to a Pastebin service and returns the raw link.",
    category: "utility",
    guide: "{pn} <commandName}"
  },

  onStart: async function ({ api, event, args, message }) {
    // Copyright: NeoKEX
    const encodedAuthor = 'TmVvS0VY'; 
    const correctAuthor = Buffer.from(encodedAuthor, 'base64').toString('utf8');

    if (this.config.author !== correctAuthor) {
      return message.reply("❌ | The author name has been changed. This command will not work.");
    }

    const cmdName = args[0];
    if (!cmdName) {
      return message.reply("❌ | Please provide the command name to upload.");
    }

    const cmdPath = path.join(__dirname, `${cmdName}.js`);

    if (!fs.existsSync(cmdPath) || !cmdPath.startsWith(__dirname)) {
      return message.reply(`❌ | Command "${cmdName}" not found in this folder.`);
    }

    try {
      const code = fs.readFileSync(cmdPath, "utf8");
      
      const encodedApiKey = 'aHR0cHM6Ly9hcnlhbmFwaS51cC5yYWlsd2F5LmFwcC9hcGkvcGFzdGViaW4=';
      const apiUrl = Buffer.from(encodedApiKey, 'base64').toString('utf8');

      const response = await axios.get(apiUrl, {
        params: {
          content: code,
          title: `${cmdName}.js source code`
        }
      });

      const { status, raw } = response.data;
      if (status === 0 && raw) {
        return message.reply(`✅ | Raw source code link for "${cmdName}.js":\n🔗 Raw Link: ${raw}`);
      } else {
        return message.reply(`❌ | Failed to upload content to Pastebin. Please try again later.`);
      }
    } catch (error) {
      console.error(error);
      return message.reply("❌ | An error occurred while trying to read and upload the command file.");
    }
  }
};
