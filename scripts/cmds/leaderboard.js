const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

module.exports.config = {
  name: "leaderboard",
  aliases: ["lb", "top"],
  version: "6.0",
  author: "MOHAMMAD AKASH",
  countDown: 10,
  role: 0,
  shortDescription: "Top 10 richest users",
  category: "economy"
};

function formatBalance(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return String(num);
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

async function loadAvatar(uid, cacheDir) {
  const tmpPath = path.join(cacheDir, `av_${uid}_${Date.now()}.png`);
  try {
    const imageUrl = `https://graph.facebook.com/${uid}/picture?height=200&width=200&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await fs.writeFile(tmpPath, response.data);
    const img = await loadImage(tmpPath);
    await fs.remove(tmpPath);
    return img;
  } catch (e) {
    if (await fs.pathExists(tmpPath)) await fs.remove(tmpPath);
    return null;
  }
}

function drawAvatar(ctx, avatar, name, ax, ay, size, isTop3) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(ax + size / 2, ay + size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();

  if (avatar) {
    ctx.drawImage(avatar, ax, ay, size, size);
  } else {
    const colors = ["#1565c0", "#6a1b9a", "#00695c", "#bf360c", "#4e342e", "#37474f"];
    ctx.fillStyle = colors[name.charCodeAt(0) % colors.length];
    ctx.fillRect(ax, ay, size, size);
    ctx.font = `bold ${Math.floor(size * 0.45)}px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((name || "?")[0].toUpperCase(), ax + size / 2, ay + size / 2 + 2);
  }

  ctx.restore();
  ctx.strokeStyle = isTop3 ? "#ffd700" : "rgba(255,255,255,0.3)";
  ctx.lineWidth = isTop3 ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.arc(ax + size / 2, ay + size / 2, size / 2 + 2, 0, Math.PI * 2);
  ctx.stroke();
}

module.exports.onStart = async function ({ api, event, usersData }) {
  const { threadID, messageID } = event;

  const allUsers = await usersData.getAll();
  const sorted = Object.entries(allUsers)
    .map(([uid, data]) => ({
      uid,
      name: data.name || "Unknown",
      money: data?.data?.money ?? 0
    }))
    .sort((a, b) => b.money - a.money)
    .slice(0, 10);

  const cacheDir = path.join(__dirname, "cache");
  await fs.ensureDir(cacheDir);

  const avatars = [];
  for (const user of sorted) {
    const img = await loadAvatar(user.uid, cacheDir);
    avatars.push(img);
  }

  const width = 800;
  const rowH = 72;
  const headerH = 130;
  const footerH = 50;
  const height = headerH + rowH * sorted.length + footerH;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#0a2a4a");
  bgGrad.addColorStop(1, "#0f4c81");
  ctx.fillStyle = bgGrad;
  roundRect(ctx, 0, 0, width, height, 20, true);

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(width - 40 + i * 25, 30 + i * 20, 90 + i * 35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  ctx.font = "bold 38px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("🏆  LEADERBOARD", width / 2, 55);

  ctx.font = "18px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("GOAT NATIONAL BANK — TOP 10", width / 2, 85);

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 105);
  ctx.lineTo(width - 40, 105);
  ctx.stroke();

  const medals = ["🥇", "🥈", "🥉"];
  const avatarSize = 46;

  for (let i = 0; i < sorted.length; i++) {
    const user = sorted[i];
    const avatar = avatars[i];
    const y = headerH + i * rowH;
    const isTop3 = i < 3;

    if (isTop3) {
      const rowGrad = ctx.createLinearGradient(30, y, width - 30, y);
      rowGrad.addColorStop(0, "rgba(255,215,0,0.12)");
      rowGrad.addColorStop(1, "rgba(255,215,0,0.02)");
      ctx.fillStyle = rowGrad;
    } else {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)";
    }
    roundRect(ctx, 30, y + 6, width - 60, rowH - 10, 12, true);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = isTop3 ? "bold 26px Arial" : "bold 20px Arial";
    ctx.fillStyle = isTop3 ? "#ffd700" : "rgba(255,255,255,0.5)";
    ctx.fillText(isTop3 ? medals[i] : `#${i + 1}`, 72, y + rowH / 2 + 8);

    const ax = 100;
    const ay = y + rowH / 2 - avatarSize / 2;
    drawAvatar(ctx, avatar, user.name, ax, ay, avatarSize, isTop3);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    let displayName = user.name;
    ctx.font = isTop3 ? "bold 22px Arial" : "bold 19px Arial";
    ctx.fillStyle = "#ffffff";
    while (ctx.measureText(displayName).width > 390 && displayName.length > 1) {
      displayName = displayName.slice(0, -1);
    }
    if (displayName !== user.name) displayName += "…";
    ctx.fillText(displayName, 162, y + rowH / 2 + 8);

    ctx.textAlign = "right";
    ctx.font = isTop3 ? "bold 22px Arial" : "bold 19px Arial";
    ctx.fillStyle = isTop3 ? "#ffd700" : "#4fc3f7";
    ctx.fillText("$" + formatBalance(user.money), width - 50, y + rowH / 2 + 8);
  }

  ctx.textAlign = "center";
  ctx.font = "15px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText("GOAT BOT  •  Economy System", width / 2, height - 18);

  const filePath = path.join(cacheDir, `leaderboard_${Date.now()}.png`);
  await fs.writeFile(filePath, canvas.toBuffer("image/png"));

  await api.sendMessage({ attachment: fs.createReadStream(filePath) }, threadID, messageID);
  setTimeout(() => fs.remove(filePath), 10000);
};
