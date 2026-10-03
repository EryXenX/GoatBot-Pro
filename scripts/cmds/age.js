const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "age",
    aliases: ["myage"],
    version: "6.0",
    author: "𝐌𝐨𝐡𝐚ᴍᴍᴀᴅ 𝐀ᴋᴀsʜ",
    role: 0,
    category: "AI",
    guide: "age <YYYY | DD/MM/YYYY | D Month YYYY | D/Month/YYYY>",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args.length) {
        return api.sendMessage(
          "⚠️ Uꜱᴇ:\n• age 2007\n• age 01/05/2007\n• age 3 May 2007\n• age 3/may/2007",
          event.threadID
        );
      }

      let input = args.join(" ").trim();
      let day, month, year;

      const monthMap = {
        jan:1,january:1,feb:2,february:2,mar:3,march:3,
        apr:4,april:4,may:5,jun:6,june:6,
        jul:7,july:7,aug:8,august:8,
        sep:9,september:9,oct:10,october:10,
        nov:11,november:11,dec:12,december:12
      };

      // YYYY
      if (/^\d{4}$/.test(input)) {
        day = 1; month = 1; year = Number(input);
      }

      // DD/MM/YYYY
      else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(input)) {
        const p = input.split("/");
        day = +p[0];
        month = +p[1];
        year = +p[2];
        if (year < 100) year += 2000;
      }

      // 3 May 2007
      else if (/^\d{1,2}\s+[a-zA-Z]{3,9}\s+\d{4}$/.test(input)) {
        const p = input.split(" ");
        day = +p[0];
        month = monthMap[p[1].toLowerCase()];
        year = +p[2];
      }

      // 3/May/2007
      else if (/^\d{1,2}\/[a-zA-Z]{3,9}\/\d{4}$/.test(input)) {
        const p = input.split("/");
        day = +p[0];
        month = monthMap[p[1].toLowerCase()];
        year = +p[2];
      }

      else {
        return api.sendMessage(
          "❌ Fᴏʀᴍᴀᴛ ভুল\n✔ age 2007\n✔ age 01/05/2007\n✔ age 3 May 2007\n✔ age 3/may/2007",
          event.threadID
        );
      }

      if (!day || !month || !year) {
        return api.sendMessage("❌ Dᴀᴛᴇ পাʀsᴇ হʏ নɪ", event.threadID);
      }

      const birth = moment.tz(
        `${year}-${month}-${day}`,
        "YYYY-MM-DD",
        "Asia/Dhaka"
      );

      if (!birth.isValid()) {
        return api.sendMessage("❌ Iɴᴠᴀʟɪᴅ Dᴀᴛᴇ", event.threadID);
      }

      const now = moment.tz("Asia/Dhaka");
      const d = moment.duration(now.diff(birth));

      const y = d.years();
      const m = d.months();
      const dy = d.days();

      const totalMonths = y * 12 + m;
      const totalDays = Math.floor(d.asDays());
      const totalHours = Math.floor(d.asHours());

      const msg = `━━━━━━━━━━━━━━
🎂 Sᴍᴀʀᴛ Aɢᴇ Cᴏᴜɴᴛ🎂
━━━━━━━━━━━━━━

📅 Bɪʀᴛʜᴅᴀʏ: ${String(day).padStart(2,"0")}/${String(month).padStart(2,"0")}/${year}
🕒 Aɢᴇ: ${y} Yᴇᴀʀs ${m} Mᴏɴᴛʜs ${dy} Dᴀʏs

📌 Tᴏᴛᴀʟ:
➤ ${totalMonths} Mᴏɴᴛʜs
➤ ${totalDays} Dᴀʏs
➤ ${totalHours} Hᴏᴜʀs
━━━━━━━━━━━━━━`;

      return api.sendMessage(msg, event.threadID);

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ Eʀʀᴏʀ", event.threadID);
    }
  }
};
