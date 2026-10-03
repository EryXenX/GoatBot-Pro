module.exports = {
  config: {
    name: "uid",
    version: "1.0.0",
    author: "ArYAN",
    description: "",
    category: "utility",
    cooldowns: 5
  },

  onStart: async function({ api, event, usersData }) {
    let uid;


    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    try {
    
      await api.shareContact(uid, uid, event.threadID, event.messageID);

    } catch (error) {
      console.error("Error in UID command:", error);
      api.sendMessage("Error sharing contact: " + error.message, event.threadID, event.messageID);
    }
  }
};
