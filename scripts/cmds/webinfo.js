const axios = require("axios");
const dns = require("dns").promises;
const https = require("https");

module.exports = {
  config: {
    name: "webinfo",
    version: "2.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get detailed information about any website" },
    description: {
      en: "Fetch full info like IP, SSL, Server, Response, Country from any website"
    },
    category: "ai",
    guide: { en: "{p}webinfo <url>\nExample: {p}webinfo https://google.com" }
  },

  langs: {
    en: {
      missing: "⚠️  Pʟᴇᴀsᴇ Pʀᴏᴠɪᴅᴇ A Vᴀʟɪᴅ Uʀʟ\n📌  Eɢ : webinfo google.com",
      loading: "🔍  Aɴᴀʟʏᴢɪɴɢ Wᴇʙsɪᴛᴇ...\n🌐  %1",
      error: "❌  Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Wᴇʙ Iɴғᴏ"
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    try {
      // ----------- CLEAN URL -----------
      let input = args[0].trim();
      input = input.replace(/^https?:\/\//, "");
      input = input.replace(/^www\./, "");
      input = input.replace(/\/$/, "");
      const domain = input;
      const url = `https://${domain}`;

      await message.reply(getLang("loading", domain));

      // ----------- IP RESOLVE -----------
      let ip = "N/A";
      try {
        const dnsRes = await dns.lookup(domain);
        ip = dnsRes.address;
      } catch {}

      // ----------- SSL CHECK -----------
      let ssl = "🔴  Nᴏ Sᴇᴄᴜʀᴇ";
      try {
        await new Promise((resolve) => {
          const req = https.request(
            { host: domain, method: "HEAD", port: 443 },
            () => resolve((ssl = "🟢  Vᴀʟɪᴅ"))
          );
          req.on("error", () => resolve());
          req.end();
        });
      } catch {}

      // ----------- RESPONSE TIME & SERVER -----------
      let responseTime = "N/A";
      let server = "Uɴᴋɴᴏᴡɴ";
      try {
        const start = Date.now();
        const res = await axios.get(url, { timeout: 10000 });
        responseTime = Date.now() - start;
        server = res.headers["server"] || "Uɴᴋɴᴏᴡɴ";
      } catch {}

      // ----------- COUNTRY (IP API) -----------
      let country = "N/A";
      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        country = geo.data.country_name || "N/A";
      } catch {}

      // ----------- REPLY -----------
      const output =
        "🌐  Wᴇʙsɪᴛᴇ Iɴғᴏ\n\n" +
        `🔗  Dᴏᴍᴀɪɴ : ${domain}\n` +
        `📍  Iᴘ : ${ip}\n` +
        `🛡️  Sᴇᴄᴜʀɪᴛʏ : ${ssl}\n` +
        `⚡  Rᴇsᴘᴏɴsᴇ : ${responseTime} ms\n` +
        `🧠  Sᴇʀᴠᴇʀ : ${server}\n` +
        `🌍  Cᴏᴜɴᴛʀʏ : ${country}`;

      message.reply(output);

    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
