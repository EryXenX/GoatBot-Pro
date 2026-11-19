module.exports = {
  config: {
    name: "kickall",
    version: "1.0",
    author: "NEXXO",
    role: 2,
    shortDescription: {
      en: "Kick everyone from the group"
    },
    category: "owner",
    guide: {
      en: "{prefix}kickall"
    }
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    try {
      const threadInfo = await api.getThreadInfo(threadID);

      if (!threadInfo.adminIDs.some(item => item.id === api.getCurrentUserID())) {
        return api.sendMessage("❌ Bot must be an admin to kick members.", threadID);
      }

      const membersToKick = threadInfo.participantIDs.filter(id => id !== senderID && id !== api.getCurrentUserID());

      if (membersToKick.length === 0) {
        return api.sendMessage("❌ No members to kick.", threadID);
      }

      api.sendMessage(`⚠️ Kicking ${membersToKick.length} members...`, threadID, async () => {
        for (const userID of membersToKick) {
          try {
            await api.removeUserFromGroup(userID, threadID);
          } catch (e) {
            console.log(`❌ Failed to kick ${userID}: ${e.message}`);
          }
        }
      });
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ An error occurred while trying to kick members.", threadID);
    }

  }
};
