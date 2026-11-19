const axios = require("axios");

const FF_API = "https://eryxenx.agi.bd/api/ffinfo";

module.exports = {
  config: {
    name: "ffinfo",
    aliases: ["freefireinfo", "ffstats"],
    version: "2.4.0",
    author: "EryXenX",
    role: 0,
    premium: false,
    description: "Show complete Free Fire player info with styled output",
    category: "game",
    guide: {
      en: "{p}ffinfo <uid>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const uid = args[0];
      if (!uid) {
        return api.sendMessage(
          "⚠️ Please provide a Free Fire UID\n📌 Example: ffinfo 3060644273",
          event.threadID,
          event.messageID
        );
      }

      const wait = await api.sendMessage(
        "⏳ Fetching Free Fire player info...",
        event.threadID
      );

      const res = await axios.get(FF_API, {
        params: { uid, region: args[1] || undefined },
        timeout: 90000
      });
      const data = res.data;

      if (!data || !data.basicInfo) {
        return api.editMessage(
          "❌ Failed to fetch player data. UID may be invalid.",
          wait.messageID
        );
      }

      const b = data.basicInfo;
      const clan = data.clanBasicInfo || {};
      const pet = data.petInfo || {};
      const social = data.socialInfo || {};
      const credit = data.creditScoreInfo || {};
      const cap = data.captainBasicInfo || {};

      const fmtDate = (ts) =>
        ts ? new Date(ts * 1000).toLocaleDateString("en-GB") : "N/A";
      const enumName = (v, prefix) =>
        v === null || v === undefined ? "N/A" : String(v).replace(prefix, "");
      const sig = social.signature || b.signature || "";

      const msg = `
🎮 Free Fire Player Info
━━━━━━━━━━━━━━━━━━
👤 Name: ${b.nickname || "N/A"}
🆔 UID: ${b.accountId || uid}
🌍 Region: ${b.region || "N/A"}
⭐ Level: ${b.level ?? "N/A"}
❤️ Likes: ${b.liked ?? 0}
📈 Exp: ${b.exp ?? 0}

🏆 Rank: ${b.rank ?? "N/A"}
🎯 Rank Points: ${b.rankingPoints ?? 0}
⚔️ CS Rank: ${b.csRank ?? "N/A"}
🎮 CS Points: ${b.csRankingPoints ?? 0}

👑 Max Rank: ${b.maxRank ?? "N/A"}
👑 Max CS Rank: ${b.csMaxRank ?? "N/A"}
🎟️ Elite Pass: ${b.hasElitePass ? "✅ Yes" : "❌ No"}
🏅 Badges: ${b.badgeCnt ?? 0}

📅 Season: ${b.seasonId ?? "N/A"}
🛠️ Release: ${b.releaseVersion || "N/A"}
👁️ BR Rank Show: ${b.showBrRank ? "Yes" : "No"}
👁️ CS Rank Show: ${b.showCsRank ? "Yes" : "No"}
⏳ Account Created: ${fmtDate(b.createAt)}
🕒 Last Login: ${fmtDate(b.lastLoginAt)}

🛡️ Guild Info
━━━━━━━━━━━━━━━━
🏷️ Guild Name: ${clan.clanName || "None"}
🆔 Guild ID: ${clan.clanId ?? "N/A"}
📊 Guild Level: ${clan.clanLevel ?? "N/A"}
👥 Members: ${clan.memberNum || 0}/${clan.capacity || 0}
👑 Guild Leader: ${cap.nickname || "N/A"} (Lv.${cap.level ?? "?"})

🐾 Pet Info
━━━━━━━━━━━━━━━━
🐶 Name: ${pet.name || "None"}
📈 Level: ${pet.level ?? "N/A"}
⭐ Exp: ${pet.exp ?? 0}
🎨 Skin ID: ${pet.skinId ?? "N/A"}

🌐 Social Info
━━━━━━━━━━━━━━━━
🚻 Gender: ${enumName(social.gender, "Gender_")}
🗣️ Language: ${enumName(social.language, "Language_")}
✍️ Signature:
${sig ? sig.replace(/\[B]|\[C]|\[ff[0-9a-f]+]/gi, "") : "None"}

🛡️ Credit Score
━━━━━━━━━━━━━━━━
💯 Score: ${credit.creditScore ?? "N/A"}
🎁 Reward: ${enumName(credit.rewardState, "REWARD_STATE_")}
📆 Period End: ${fmtDate(credit.periodicSummaryEndTime)}

✨ Powered by EryXenX
`;

      await api.editMessage(msg, wait.messageID);
    } catch (err) {
      const reason = err.response?.data?.error || err.message;
      api.sendMessage(`❌ Error: ${reason}`, event.threadID, event.messageID);
    }
  }
};
