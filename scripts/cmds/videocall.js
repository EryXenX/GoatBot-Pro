const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
 config: {
 name: "videocall",
 aliases: ["vcall"],
 version: "1.0.0",
 author: "EryXenX",
 countDown: 5,
 role: 0,
 description: {
 en: "Fake video call screen with you and target",
 bn: "তুমি আর target এর ফেক ভিডিও কল স্ক্রিন"
 },
 category: "fun",
 guide: { en: "{pn} @mention or reply to a message" }
 },

 langs: {
 en: { noMention: "❌ | Mention someone or reply to a message!", error: "❌ | Failed to generate. Try again." },
 bn: { noMention: "❌ | কাউকে mention করুন বা reply করুন!", error: "❌ | তৈরি করতে সমস্যা হয়েছে।" },
 hi: { noMention: "❌ | Kisi ko mention karein ya reply karein!", error: "❌ | Banana fail hua." },
 tl: { noMention: "❌ | Mag-mention ng isa o mag-reply!", error: "❌ | Hindi nagawa." },
 ar: { noMention: "❌ | أشر إلى شخص أو رد على رسالة!", error: "❌ | فشل الإنشاء." }
 },

 onStart: async function ({ event, message, getLang, usersData, args }) {
 try {
 const senderID = event.senderID;
 const targetID = Object.keys(event.mentions)[0]
 || (event.messageReply ? event.messageReply.senderID : null)
 || (args[0] && /^\d+$/.test(args[0]) ? args[0] : null);

 if (!targetID) return message.reply(getLang("noMention"));

 const targetName = await usersData.getName(targetID).catch(() => "Unknown");

 const ts = Date.now();
 const senderAvtPath = __dirname + "/cache/vc_sender_" + ts + ".jpg";
 const targetAvtPath = __dirname + "/cache/vc_target_" + ts + ".jpg";
 const outputPath = __dirname + "/cache/vc_out_" + ts + ".jpg";

 const [senderRes, targetRes] = await Promise.all([
 axios.get("https://graph.facebook.com/" + senderID + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" }),
 axios.get("https://graph.facebook.com/" + targetID + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" })
 ]);

 fs.writeFileSync(senderAvtPath, Buffer.from(senderRes.data));
 fs.writeFileSync(targetAvtPath, Buffer.from(targetRes.data));

 const senderImg = await loadImage(senderAvtPath);
 const targetImg = await loadImage(targetAvtPath);

 const W = 720;
 const H = 1280;
 const canvas = createCanvas(W, H);
 const ctx = canvas.getContext("2d");

 drawCoverBlurred(ctx, targetImg, 0, 0, W, H);

 const overlay = ctx.createLinearGradient(0, 0, 0, H);
 overlay.addColorStop(0, "rgba(0,0,0,0.55)");
 overlay.addColorStop(0.2, "rgba(0,0,0,0.05)");
 overlay.addColorStop(0.8, "rgba(0,0,0,0.05)");
 overlay.addColorStop(1, "rgba(0,0,0,0.6)");
 ctx.fillStyle = overlay;
 ctx.fillRect(0, 0, W, H);

 ctx.fillStyle = "#ffffff";
 ctx.font = "bold 36px Sans";
 ctx.textAlign = "center";
 ctx.fillText(targetName, W / 2, 90);

 ctx.fillStyle = "#d9dee3";
 ctx.font = "24px Sans";
 ctx.fillText("00:14", W / 2, 130);

 const pipW = 200;
 const pipH = 270;
 const pipX = W - pipW - 30;
 const pipY = 60;
 const radius = 18;

 ctx.save();
 roundRectPath(ctx, pipX, pipY, pipW, pipH, radius);
 ctx.clip();
 drawCoverImage(ctx, senderImg, pipX, pipY, pipW, pipH);
 ctx.restore();

 ctx.strokeStyle = "rgba(255,255,255,0.6)";
 ctx.lineWidth = 3;
 roundRectPath(ctx, pipX, pipY, pipW, pipH, radius);
 ctx.stroke();

 const btnY = H - 150;
 const spacing = 130;
 const centerX = W / 2;
 const positions = [centerX - spacing, centerX, centerX + spacing];

 ctx.fillStyle = "rgba(255,255,255,0.18)";
 ctx.beginPath();
 ctx.arc(positions[0], btnY, 55, 0, Math.PI * 2);
 ctx.fill();
 drawMicIcon(ctx, positions[0], btnY, "#ffffff");

 ctx.fillStyle = "#e53950";
 ctx.beginPath();
 ctx.arc(positions[1], btnY, 60, 0, Math.PI * 2);
 ctx.fill();
 ctx.save();
 ctx.translate(positions[1], btnY);
 ctx.rotate((135 * Math.PI) / 180);
 drawPhoneIcon(ctx, "#ffffff");
 ctx.restore();

 ctx.fillStyle = "rgba(255,255,255,0.18)";
 ctx.beginPath();
 ctx.arc(positions[2], btnY, 55, 0, Math.PI * 2);
 ctx.fill();
 drawCameraIcon(ctx, positions[2], btnY, "#ffffff");

 fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));

 await message.reply({ body: "📹 Video call with " + targetName, attachment: fs.createReadStream(outputPath) });

 [senderAvtPath, targetAvtPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

 } catch (err) {
 console.error("Videocall Error:", err);
 message.reply(getLang("error"));
 }
 }
};

function drawCoverImage(ctx, img, x, y, w, h) {
 const scale = Math.max(w / img.width, h / img.height);
 const dw = img.width * scale;
 const dh = img.height * scale;
 const dx = x + (w - dw) / 2;
 const dy = y + (h - dh) / 2;
 ctx.drawImage(img, dx, dy, dw, dh);
}

function drawCoverBlurred(ctx, img, x, y, w, h) {
 ctx.save();
 ctx.filter = "blur(18px)";
 drawCoverImage(ctx, img, x - 20, y - 20, w + 40, h + 40);
 ctx.restore();
}

function roundRectPath(ctx, x, y, w, h, r) {
 ctx.beginPath();
 ctx.moveTo(x + r, y);
 ctx.arcTo(x + w, y, x + w, y + h, r);
 ctx.arcTo(x + w, y + h, x, y + h, r);
 ctx.arcTo(x, y + h, x, y, r);
 ctx.arcTo(x, y, x + w, y, r);
 ctx.closePath();
}

function drawPhoneIcon(ctx, color) {
 ctx.fillStyle = color;
 ctx.beginPath();
 ctx.moveTo(-18, -22);
 ctx.lineTo(-6, -22);
 ctx.lineTo(-2, -10);
 ctx.lineTo(-9, -3);
 ctx.bezierCurveTo(-4, 8, 4, 16, 15, 21);
 ctx.lineTo(22, 14);
 ctx.lineTo(34, 18);
 ctx.lineTo(34, 30);
 ctx.bezierCurveTo(34, 33, 31, 35, 28, 35);
 ctx.bezierCurveTo(0, 35, -35, 0, -35, -28);
 ctx.bezierCurveTo(-35, -31, -33, -34, -30, -34);
 ctx.lineTo(-18, -22);
 ctx.closePath();
 ctx.fill();
}

function drawMicIcon(ctx, cx, cy, color) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.fillStyle = color;
 ctx.beginPath();
 ctx.moveTo(-10, -22);
 ctx.lineTo(10, -22);
 ctx.arcTo(20, -12, 10, 0, 10);
 ctx.lineTo(-10, 0);
 ctx.arcTo(-20, -12, -10, -22, 10);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = color;
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.arc(0, 0, 22, 0.2 * Math.PI, 0.8 * Math.PI);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(0, 22);
 ctx.lineTo(0, 32);
 ctx.moveTo(-12, 32);
 ctx.lineTo(12, 32);
 ctx.stroke();
 ctx.restore();
}

function drawCameraIcon(ctx, cx, cy, color) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.fillStyle = color;
 ctx.beginPath();
 ctx.roundRect ? ctx.roundRect(-22, -16, 32, 32, 6) : ctx.rect(-22, -16, 32, 32);
 ctx.fill();
 ctx.beginPath();
 ctx.moveTo(10, -8);
 ctx.lineTo(24, -16);
 ctx.lineTo(24, 16);
 ctx.lineTo(10, 8);
 ctx.closePath();
 ctx.fill();
 ctx.restore();
}