module.exports = {
  config: {
    name: "groupname",
    version: "1.1.0",
    author: "Mohammad Akash",
    countDown: 0,
    role: 1, // শুধু গ্রুপ অ্যাডমিন বা বট অ্যাডমিন (চাওলে 0 করো)
    shortDescription: "Change group name",
    longDescription: "তুমি যেই নাম দেবে সেটাই গ্রুপের নতুন নাম হবে।",
    category: "box",
    guide: "{pn} [new name]"
  },

  onStart: async function ({ api, event, args }) {
    const name = args.join(" ");

    if (!name) {
      return api.sendMessage(
        "❌ | দয়া করে নতুন গ্রুপ নাম লিখো!\n\n📝 উদাহরণঃ /groupname Dark Army 💀",
        event.threadID,
        event.messageID
      );
    }

    try {
      await api.setTitle(name, event.threadID);
      api.sendMessage(`✅ | গ্রুপের নাম পরিবর্তন হয়েছে:\n➡️ ${name}`, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ | নাম পরিবর্তন করা যায়নি! নিশ্চিত হও বটের পর্যাপ্ত পারমিশন আছে কিনা।", event.threadID, event.messageID);
    }
  }
};
