module.exports.config = {
  name: "slot",
  version: "3.0.0",
  author: "EryXenX",
  role: 0,
  category: "economy",
  shortDescription: "Slot Machine Game"
};

module.exports.onStart = async function ({ api, event, args, usersData }) {
  const { senderID, threadID, messageID } = event;

  const bet = parseInt(args[0]);
  if (!bet || bet <= 0)
    return api.sendMessage("Enter valid bet amount.", threadID, messageID);

  const userData = await usersData.get(senderID);
  let balance = userData?.data?.money ?? 100;

  if (balance < bet)
    return api.sendMessage("❌ Not enough balance!", threadID, messageID);

  const symbols = ["🍎", "🍌", "🍒", "⭐", "7️⃣"];
  const win = Math.random() * 100 < 60;
  const winAmount = bet;

  let slot1, slot2, slot3;

  if (win) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    slot1 = slot2 = slot3 = symbol;
    balance += winAmount;
  } else {
    do {
      slot1 = symbols[Math.floor(Math.random() * symbols.length)];
      slot2 = symbols[Math.floor(Math.random() * symbols.length)];
      slot3 = symbols[Math.floor(Math.random() * symbols.length)];
    } while (slot1 === slot2 && slot2 === slot3);
    balance -= bet;
  }

  await usersData.set(senderID, { data: { ...userData.data, money: balance } });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const buildFrame = (s1, s2, s3, status) => {
    return `🎰 SLOT MACHINE 🎰\n──────────────────\n🎲 ${status} →\n[ ${s1} | ${s2} | ${s3} ]`;
  };

  const initialMsg = `${buildFrame("❓", "❓", "❓", "Spinning")}\n\nGood luck! 🍀`;

  api.sendMessage(initialMsg, threadID, (err, info) => {
    if (err || !info) return;

    const messageIDForEdit = info.messageID;

    (async () => {
      await delay(700);
      api.editMessage(buildFrame(slot1, "❓", "❓", "Spinning"), messageIDForEdit);

      await delay(700);
      api.editMessage(buildFrame(slot1, slot2, "❓", "Spinning"), messageIDForEdit);

      await delay(700);

      let finalText;
      if (win) {
        finalText =
          `${buildFrame(slot1, slot2, slot3, "Result")}\n` +
          `──────────────────\n` +
          `🏆 JACKPOT WINNER! 🏆\n` +
          `💵 Earned → +${winAmount}$\n` +
          `💰 Balance → ${balance}$\n` +
          `──────────────────\n` +
          `Bet again? Type: slot <amount>`;
      } else {
        finalText =
          `${buildFrame(slot1, slot2, slot3, "Result")}\n` +
          `──────────────────\n` +
          `💸 YOU LOSE!\n` +
          `💵 Lost → -${bet}$\n` +
          `💰 Balance → ${balance}$\n` +
          `──────────────────\n` +
          `Better luck next time! 🍀`;
      }

      api.editMessage(finalText, messageIDForEdit);
    })();
  }, messageID);
};
