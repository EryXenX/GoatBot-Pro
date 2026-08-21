module.exports.config = {
 name: "daily",
 aliases: ["claim"],
 version: "1.0",
 author: "MOHAMMAD AKASH",
 countDown: 5,
 role: 0,
 shortDescription: "Claim daily reward",
 category: "economy"
};

module.exports.onStart = async function ({ api, event, usersData }) {
 const { senderID, threadID, messageID } = event;

 const cooldown = 24 * 60 * 60 * 1000; // 24h
 const reward = Math.floor(Math.random() * 5000) + 1000;

 const userData = await usersData.get(senderID);

 if (!userData.data) userData.data = {};

 const lastClaim = userData.data.lastDaily || 0;
 const now = Date.now();

 if (now - lastClaim < cooldown) {
 const remaining = cooldown - (now - lastClaim);

 const hours = Math.floor(remaining / (1000 * 60 * 60));
 const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

 return api.sendMessage(
 `⏳ You already claimed your daily reward!\n🕒 Come back after ${hours}h ${minutes}m`,
 threadID,
 messageID
 );
 }

 const currentMoney = userData.data.money || 0;
 const newBalance = currentMoney + reward;

 await usersData.set(senderID, {
 data: {
 ...userData.data,
 money: newBalance,
 lastDaily: now
 }
 });

 api.sendMessage(
`🎁 Daily Reward Claimed!

💵 Reward: ${reward}$
🏦 New Balance: ${newBalance}$`,
 threadID,
 messageID
 );
};