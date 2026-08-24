const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

function formatBalance(num) {
  num = Number(num) || 0;
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "t";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "b";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "m";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
  return num.toFixed(0);
}

function roundRect(ctx, x, y, w, h, r, fill = false, stroke = false) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

async function drawCard({ userID, userName, balance }) {
  const formatted = "$" + formatBalance(balance);

  let avatar = null;
  try {
    const picURL = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios({ url: picURL, method: "GET", responseType: "arraybuffer" });
    avatar = await loadImage(response.data);
  } catch (err) {
    console.log("Avatar Load Failed:", err.message);
  }

  const width = 850;
  const height = 520;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#0f2027");
  grad.addColorStop(0.5, "#1c4966");
  grad.addColorStop(1, "#2a7ab0");
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, width, height, 30, true);

  const shine = ctx.createLinearGradient(0, 0, width, height);
  shine.addColorStop(0, "rgba(255,255,255,0.06)");
  shine.addColorStop(0.4, "rgba(255,255,255,0)");
  shine.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = shine;
  roundRect(ctx, 0, 0, width, height, 30, true);

  ctx.font = "bold 34px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("GOAT NATIONAL BANK", 60, 80);

  ctx.font = "16px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("PREMIUM ECONOMY CARD", 60, 105);

  const chipGrad = ctx.createLinearGradient(60, 140, 150, 205);
  chipGrad.addColorStop(0, "#f4d97a");
  chipGrad.addColorStop(1, "#c9982f");
  ctx.fillStyle = chipGrad;
  roundRect(ctx, 60, 145, 90, 60, 10, true);

  ctx.font = "28px monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("1234  5678  9012  8456", 60, 250);

  ctx.font = "16px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("VALID THRU", 60, 295);
  ctx.font = "bold 22px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("12/29", 60, 322);

  ctx.font = "bold 24px Arial";
  const safeName = userName ? userName.toUpperCase() : "CARD HOLDER";
  const maxNameWidth = 360;
  let nameToShow = safeName;
  while (ctx.measureText(nameToShow).width > maxNameWidth && nameToShow.length > 0) {
    nameToShow = nameToShow.slice(0, -1);
  }
  if (nameToShow !== safeName) nameToShow = nameToShow.trim() + "…";
  ctx.fillText(nameToShow, 60, 380);

  const boxX = 440, boxY = 240, boxW = 350, boxH = 190;
  const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
  boxGrad.addColorStop(0, "rgba(255,255,255,0.22)");
  boxGrad.addColorStop(1, "rgba(255,255,255,0.10)");
  ctx.fillStyle = boxGrad;
  roundRect(ctx, boxX, boxY, boxW, boxH, 25, true);

  ctx.textAlign = "center";
  ctx.font = "18px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText("AVAILABLE BALANCE", boxX + boxW / 2, boxY + 45);

  let fontSize = 50;
  const maxTextWidth = boxW - 40;
  do {
    ctx.font = `bold ${fontSize}px Arial`;
    const w = ctx.measureText(formatted).width;
    if (w <= maxTextWidth) break;
    fontSize -= 2;
  } while (fontSize > 18);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(formatted, boxX + boxW / 2, boxY + 120);
  ctx.textAlign = "left";

  if (avatar) {
    const size = 100;
    const x = width - size - 50;
    const y = 45;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2 + 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  return canvas.toBuffer("image/png");
}

async function sendCard({ api, threadID, messageID, userID, userName, balance }) {
  const buffer = await drawCard({ userID, userName, balance });
  const cachePath = path.join(__dirname, "cache");
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
  const filePath = path.join(cachePath, `balance_${userID}.png`);
  fs.writeFileSync(filePath, buffer);

  await api.sendMessage({ attachment: fs.createReadStream(filePath) }, threadID, messageID);

  setTimeout(() => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 10000);
}

function getTargetID({ event, args }) {
  if (event.messageReply) return event.messageReply.senderID;
  if (event.mentions && Object.keys(event.mentions).length > 0) {
    return Object.keys(event.mentions)[0];
  }
  const lastArg = args[args.length - 1];
  if (lastArg && /^\d{6,}$/.test(lastArg)) return lastArg;
  return null;
}

module.exports.config = {
  name: "balance",
  aliases: ["bal"],
  version: "9.0",
  author: "MOHAMMAD AKASH",
  countDown: 5,
  role: 0,
  shortDescription: "Real Bank Card",
  category: "economy",
  usages: "[@mention | reply] | transfer <amount> [@mention | reply]",
  description: "Show balance card or transfer money to another user"
};

module.exports.onStart = async function ({ api, event, args, usersData }) {
  const { threadID, senderID, messageID } = event;

  try {
    if (args[0] && args[0].toLowerCase() === "transfer") {
      const amount = parseInt(args[1], 10);
      if (!amount || amount <= 0) {
        return api.sendMessage("Please enter a valid amount. Example: /balance transfer 10000 @friend (or reply to their message)", threadID, messageID);
      }

      const targetID = getTargetID({ event, args: args.slice(2) });
      if (!targetID) {
        return api.sendMessage("Who do you want to send money to? Mention someone or reply to their message with this command.", threadID, messageID);
      }
      if (targetID === senderID) {
        return api.sendMessage("You can't transfer money to yourself.", threadID, messageID);
      }

      const senderData = await usersData.get(senderID);
      const senderBalance = senderData?.data?.money ?? 100;

      if (senderBalance < amount) {
        return api.sendMessage(`Insufficient balance. Your current balance: $${formatBalance(senderBalance)}`, threadID, messageID);
      }

      const receiverData = await usersData.get(targetID);
      const receiverBalance = receiverData?.data?.money ?? 100;

      await usersData.set(senderID, { money: senderBalance - amount }, "data");
      await usersData.set(targetID, { money: receiverBalance + amount }, "data");

      const senderName = await usersData.getName(senderID);
      const receiverName = await usersData.getName(targetID);

      api.sendMessage(
        `✅ Transfer successful!\n${senderName} ➝ ${receiverName}\nAmount: $${formatBalance(amount)}\n\nYour new balance: $${formatBalance(senderBalance - amount)}`,
        threadID,
        messageID
      );
      return;
    }

    const targetID = getTargetID({ event, args }) || senderID;
    const userData = await usersData.get(targetID);
    const balance = userData?.data?.money ?? 100;
    const userName = await usersData.getName(targetID);

    await sendCard({ api, threadID, messageID, userID: targetID, userName, balance });

  } catch (err) {
    console.error(err);
    api.sendMessage("Something went wrong while running this command!", threadID, messageID);
  }
};
