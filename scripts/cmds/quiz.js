const axios = require("axios");

module.exports.config = {
  name: "quiz",
  version: "2.0",
  author: "EryXenX",
  role: 0,
  category: "economy",
  countDown: 10,
  shortDescription: "Answer quiz questions to earn money",
  guide: "{prefix}quiz"
};

const usedQuestions = new Map();

function decodeHTML(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fetchQuestion(senderID) {
  const used = usedQuestions.get(senderID) || new Set();

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await axios.get("https://opentdb.com/api.php?amount=5&type=multiple");
    const results = res.data?.results;
    if (!results) continue;

    for (const item of results) {
      const question = decodeHTML(item.question);
      if (used.has(question)) continue;

      const correct = decodeHTML(item.correct_answer);
      const wrong = item.incorrect_answers.map(decodeHTML);
      const allOptions = shuffle([correct, ...wrong]);
      const labels = ["A", "B", "C", "D"];
      const answerLabel = labels[allOptions.indexOf(correct)];
      const options = allOptions.map((opt, i) => `${labels[i]}. ${opt}`);

      used.add(question);
      if (used.size > 200) {
        const first = used.values().next().value;
        used.delete(first);
      }
      usedQuestions.set(senderID, used);

      return { question, options, answer: answerLabel };
    }
  }

  return null;
}

module.exports.onStart = async function ({ api, event, usersData }) {
  const { senderID, threadID, messageID } = event;

  let quizData;
  try {
    quizData = await fetchQuestion(senderID);
  } catch (e) {
    return api.sendMessage("❌ Failed to fetch question. Try again later.", threadID, messageID);
  }

  if (!quizData)
    return api.sendMessage("❌ Could not get a new question. Try again later.", threadID, messageID);

  const msg =
`📝 QUIZ TIME!

❓ ${quizData.question}

${quizData.options.join("\n")}

⏱ Reply with A, B, C or D
✅ Correct → +500$
❌ Wrong → -50$`;

  api.sendMessage(msg, threadID, (err, info) => {
    if (err) return;
    global.GoatBot.onReply.set(info.messageID, {
      commandName: "quiz",
      messageID: info.messageID,
      answer: quizData.answer,
      senderID
    });

    setTimeout(() => {
      if (global.GoatBot.onReply.has(info.messageID)) {
        global.GoatBot.onReply.delete(info.messageID);
        api.unsendMessage(info.messageID);
      }
    }, 60000);
  }, messageID);
};

module.exports.onReply = async function ({ api, event, usersData, Reply }) {
  const { senderID, threadID, messageID, body } = event;
  const { answer } = Reply;

  const userAnswer = body.trim().toUpperCase();

  if (!["A", "B", "C", "D"].includes(userAnswer))
    return api.sendMessage("⚠ Please reply with only A, B, C or D.", threadID, messageID);

  global.GoatBot.onReply.delete(Reply.messageID);

  const userData = await usersData.get(senderID);
  let balance = userData?.data?.money ?? 100;

  if (userAnswer === answer) {
    balance += 500;
    await usersData.set(senderID, { data: { ...userData.data, money: balance } });
    api.sendMessage(
      `✅ Correct! The answer was ${answer}\n💵 Won +500$\n💰 Balance: ${balance}$`,
      threadID, messageID
    );
  } else {
    balance = Math.max(0, balance - 50);
    await usersData.set(senderID, { data: { ...userData.data, money: balance } });
    api.unsendMessage(Reply.messageID);
    api.sendMessage(
      `❌ Wrong! The correct answer was ${answer}\n💸 Lost -50$\n💰 Balance: ${balance}$`,
      threadID, messageID
    );
  }
};