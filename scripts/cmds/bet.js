module.exports.config = {
  name: "bet",
  version: "3.0",
  author: "MOHAMMAD AKASH",
  role: 0,
  category: "economy",
  shortDescription: "Casino betting game"
};

module.exports.onStart = async function ({ api, event, args, usersData }) {
  const { senderID, threadID, messageID } = event;

  if (!args[0])
    return api.sendMessage("🎰 Usage: bet <amount>", threadID, messageID);

  const bet = parseInt(args[0]);
  if (!bet || bet <= 0)
    return api.sendMessage("❌ Invalid bet amount!", threadID, messageID);

  const userData = await usersData.get(senderID);
  let balance = userData?.data?.money ?? 100;

  if (balance < bet)
    return api.sendMessage(`❌ Not enough balance!\n🏦 Balance: ${balance}$`, threadID, messageID);

  const outcomes = [
    { text: "💥 You lost everything!", multiplier: 0 },
    { text: "😞 You got back half.", multiplier: 0.5 },
    { text: "🟡 You broke even.", multiplier: 1 },
    { text: "🟢 You doubled your money!", multiplier: 2 },
    { text: "🔥 You tripled your bet!", multiplier: 3 },
    { text: "🎉 JACKPOT! 10x reward!", multiplier: 10 }
  ];

  const win = Math.random() < 0.6;
  let selected;

  if (win) {
    const winOutcomes = outcomes.filter(o => o.multiplier > 0);
    selected = winOutcomes[Math.floor(Math.random() * winOutcomes.length)];
  } else {
    const loseOutcomes = outcomes.filter(o => o.multiplier === 0);
    selected = loseOutcomes[Math.floor(Math.random() * loseOutcomes.length)];
  }

  const reward = Math.floor(bet * selected.multiplier);
  balance = balance - bet + reward;

  await usersData.set(senderID, { data: { ...userData.data, money: balance } });

  const msg =
`${selected.text}

🎰 You bet: ${bet}$
💸 You won: ${reward}$
💰 New balance: ${balance}$`;

  api.sendMessage(msg, threadID, messageID);
};
