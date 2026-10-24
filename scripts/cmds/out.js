module.exports = {
  config: {
    name: "out",
    version: "2.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 2,
    shortDescription: "বটকে গ্রুপ থেকে বের করে দেওয়া",
    longDescription: "এই কমান্ডের মাধ্যমে বটকে বর্তমান বা নির্দিষ্ট গ্রুপ থেকে বের করে দেওয়া হয়।",
    category: "owner",
    guide: {
      en: "{pn} [threadID (optional)]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const botID = api.getCurrentUserID();
    const targetThread = args[0] || event.threadID;

    try {
      await api.sendMessage("👋 আলবিদা সবাই! আমি এখন গ্রুপ থেকে বের হচ্ছি...", targetThread);
      await api.removeUserFromGroup(botID, targetThread);
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ বের হতে পারলাম না! হয়তো আমি অ্যাডমিন না বা কোনো সমস্যা হয়েছে।", event.threadID);
    }
  },
};
