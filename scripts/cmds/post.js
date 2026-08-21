const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
 config: {
 name: "post",
 aliases: ["prankpost"],
 version: "1.0.0",
 author: "EryXenX",
 countDown: 5,
 role: 0,
 description: {
 en: "Fake Facebook post prank",
 bn: "ফেক ফেসবুক পোস্ট প্র্যাংক"
 },
 category: "fun",
 guide: { en: "{pn} <text> or {pn} @mention <text> or reply with {pn} <text>" }
 },

 langs: {
 en: { noText: "❌ | Write something to post!", error: "❌ | Failed to generate. Try again." },
 bn: { noText: "❌ | পোস্টে কিছু লিখো!", error: "❌ | তৈরি করতে সমস্যা হয়েছে।" },
 hi: { noText: "❌ | Post mein kuch likho!", error: "❌ | Banana fail hua." },
 tl: { noText: "❌ | Maglagay ng text sa post!", error: "❌ | Hindi nagawa." },
 ar: { noText: "❌ | اكتب شيئاً لنشره!", error: "❌ | فشل الإنشاء." }
 },

 onStart: async function ({ event, message, getLang, usersData, args }) {
 try {
 const mentionID = Object.keys(event.mentions)[0]
 || (event.messageReply ? event.messageReply.senderID : null);

 const posterID = mentionID || event.senderID;

 let postText = args.join(" ");
 if (mentionID) {
 const mentionTag = Object.values(event.mentions)[0];
 postText = postText.replace("@" + mentionTag, "").trim();
 }
 if (!postText) return message.reply(getLang("noText"));

 const posterName = await usersData.getName(posterID).catch(() => "Unknown");

 const ts = Date.now();
 const avatarPath = __dirname + "/cache/post_avt_" + ts + ".jpg";
 const outputPath = __dirname + "/cache/post_out_" + ts + ".jpg";

 const avatarRes = await axios.get("https://graph.facebook.com/" + posterID + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" });
 fs.writeFileSync(avatarPath, Buffer.from(avatarRes.data));
 const avatarImg = await loadImage(avatarPath);

 const W = 720;
 const padding = 28;
 const lineHeight = 38;
 const textStartY = 145;
 const textLines = wrapText(postText, 36);
 const textBlockHeight = textLines.length * lineHeight;
 const H = textStartY + textBlockHeight + 170;

 const canvas = createCanvas(W, H);
 const ctx = canvas.getContext("2d");

 ctx.fillStyle = "#ffffff";
 ctx.fillRect(0, 0, W, H);

 const avatarSize = 56;
 const avatarX = padding;
 const avatarY = padding;

 ctx.save();
 ctx.beginPath();
 ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
 ctx.closePath();
 ctx.clip();
 drawCoverImage(ctx, avatarImg, avatarX, avatarY, avatarSize, avatarSize);
 ctx.restore();

 ctx.fillStyle = "#050505";
 ctx.font = "bold 26px Sans";
 ctx.textAlign = "left";
 ctx.fillText(posterName, avatarX + avatarSize + 16, avatarY + 26);

 ctx.fillStyle = "#65676b";
 ctx.font = "20px Sans";
 ctx.fillText("Just now · 🌐", avatarX + avatarSize + 16, avatarY + 52);

 ctx.fillStyle = "#65676b";
 ctx.font = "bold 30px Sans";
 ctx.fillText("⋯", W - 60, avatarY + 36);

 let textY = textStartY;
 ctx.fillStyle = "#050505";
 ctx.font = "28px Sans";
 for (const line of textLines) {
 ctx.fillText(line, padding, textY);
 textY += lineHeight;
 }

 const statsY = textY + 6;
 ctx.strokeStyle = "#e4e6eb";
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.moveTo(padding, statsY);
 ctx.lineTo(W - padding, statsY);
 ctx.stroke();

 const likeCount = randomCount();
 const commentCount = randomCount();
 const shareCount = randomCount();

 ctx.fillStyle = "#1877f2";
 ctx.beginPath();
 ctx.arc(padding + 12, statsY + 30, 12, 0, Math.PI * 2);
 ctx.fill();
 drawThumbIcon(ctx, padding + 12, statsY + 30, "#ffffff");

 ctx.fillStyle = "#65676b";
 ctx.font = "22px Sans";
 ctx.fillText(likeCount, padding + 32, statsY + 38);

 ctx.textAlign = "right";
 ctx.fillText(commentCount + " comments · " + shareCount + " shares", W - padding, statsY + 38);
 ctx.textAlign = "left";

 const statsLineY = statsY + 58;
 ctx.beginPath();
 ctx.moveTo(padding, statsLineY);
 ctx.lineTo(W - padding, statsLineY);
 ctx.stroke();

 ctx.fillStyle = "#65676b";
 ctx.font = "bold 24px Sans";
 const actionsY = statsLineY + 42;
 ctx.fillText("👍 Like", padding + 10, actionsY);
 ctx.fillText("💬 Comment", W / 2 - 60, actionsY);
 ctx.fillText("↗ Share", W - padding - 110, actionsY);

 fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));

 await message.reply({ attachment: fs.createReadStream(outputPath) });

 [avatarPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

 } catch (err) {
 console.error("Post Error:", err);
 message.reply(getLang("error"));
 }
 }
};

function wrapText(text, maxCharsPerLine) {
 const words = text.split(" ");
 const lines = [];
 let current = "";
 for (let word of words) {
 while (word.length > maxCharsPerLine) {
 if (current) {
 lines.push(current.trim());
 current = "";
 }
 lines.push(word.slice(0, maxCharsPerLine));
 word = word.slice(maxCharsPerLine);
 }
 if ((current + " " + word).trim().length > maxCharsPerLine) {
 lines.push(current.trim());
 current = word;
 } else {
 current += " " + word;
 }
 }
 if (current.trim()) lines.push(current.trim());
 return lines;
}

function randomCount() {
 const pools = [
 () => (Math.random() * 9 + 1).toFixed(1) + "K",
 () => (Math.random() * 90 + 10).toFixed(1) + "K",
 () => Math.floor(Math.random() * 900 + 100).toString(),
 () => (Math.random() * 9 + 1).toFixed(0) + "0K"
 ];
 const pick = pools[Math.floor(Math.random() * pools.length)];
 return pick();
}

function drawCoverImage(ctx, img, x, y, w, h) {
 const scale = Math.max(w / img.width, h / img.height);
 const dw = img.width * scale;
 const dh = img.height * scale;
 const dx = x + (w - dw) / 2;
 const dy = y + (h - dh) / 2;
 ctx.drawImage(img, dx, dy, dw, dh);
}

function drawThumbIcon(ctx, cx, cy, color) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(0.55, 0.55);
 ctx.fillStyle = color;
 ctx.beginPath();
 ctx.moveTo(-9, -2);
 ctx.lineTo(-9, 11);
 ctx.lineTo(-4, 11);
 ctx.lineTo(-4, -2);
 ctx.closePath();
 ctx.fill();
 ctx.beginPath();
 ctx.moveTo(-3, -2);
 ctx.lineTo(-3, 11);
 ctx.lineTo(7, 11);
 ctx.bezierCurveTo(9, 11, 10, 10, 10, 8);
 ctx.lineTo(12, 0);
 ctx.bezierCurveTo(12.5, -2, 11, -4, 9, -4);
 ctx.lineTo(2, -4);
 ctx.lineTo(3, -10);
 ctx.bezierCurveTo(3.3, -12.5, 1, -14, -0.5, -12.5);
 ctx.lineTo(-3, -7);
 ctx.closePath();
 ctx.fill();
 ctx.restore();
}