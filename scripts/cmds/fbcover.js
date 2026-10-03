const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

const FB_TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
const FONTS_DIR = path.join(__dirname, "cache", "fonts");

const FONT_LIST = [
  { file: "PlayfairDisplay-Bold.ttf", url: "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Bold.ttf", family: "Playfair",  weight: "bold"   },
  { file: "Outfit-Regular.ttf",       url: "https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Regular.ttf",                 family: "Outfit",    weight: "normal" },
  { file: "Outfit-Bold.ttf",          url: "https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Bold.ttf",                    family: "Outfit",    weight: "bold"   },
  { file: "SpaceMono-Bold.ttf",       url: "https://github.com/google/fonts/raw/main/ofl/spacemono/SpaceMono-Bold.ttf",                     family: "SpaceMono", weight: "bold"   },
  { file: "Rajdhani-Bold.ttf",        url: "https://github.com/google/fonts/raw/main/ofl/rajdhani/Rajdhani-Bold.ttf",                       family: "Rajdhani",  weight: "bold"   },
];

// ── color themes ──────────────────────────────────────────
const THEMES = {
  white:  { a: "#ffffff", b: "#cccccc", bg1: "#1a1a1a", bg2: "#2a2a2a" },
  red:    { a: "#ff3b3b", b: "#ff7c7c", bg1: "#1a0000", bg2: "#2d0a0a" },
  blue:   { a: "#3b8bff", b: "#7cb9ff", bg1: "#000e1a", bg2: "#0a1a2d" },
  green:  { a: "#2ecc71", b: "#82e0aa", bg1: "#001a0a", bg2: "#0a2d18" },
  black:  { a: "#aaaaaa", b: "#666666", bg1: "#000000", bg2: "#111111" },
  orange: { a: "#ff8c00", b: "#ffb347", bg1: "#1a0a00", bg2: "#2d1a00" },
  purple: { a: "#9b59b6", b: "#c39bd3", bg1: "#0d001a", bg2: "#1a0a2d" },
  pink:   { a: "#ff69b4", b: "#ffb6c1", bg1: "#1a0010", bg2: "#2d0020" },
  yellow: { a: "#f1c40f", b: "#f7dc6f", bg1: "#1a1500", bg2: "#2d2500" },
  cyan:   { a: "#00bcd4", b: "#80deea", bg1: "#001a1a", bg2: "#002d2d" },
};

function getTheme(colour) {
  const key = (colour || "white").toLowerCase().trim();
  return THEMES[key] || THEMES.white;
}

let fontsReady = false;

async function setupFonts() {
  if (fontsReady) return;
  await fs.ensureDir(FONTS_DIR);
  for (const f of FONT_LIST) {
    const dest = path.join(FONTS_DIR, f.file);
    if (!fs.existsSync(dest)) {
      try {
        const res = await axios.get(f.url, { responseType: "arraybuffer", timeout: 15000 });
        await fs.writeFile(dest, Buffer.from(res.data));
      } catch (e) {
        console.error(`[fbcover] font fail: ${f.file}`, e.message);
      }
    }
    if (fs.existsSync(dest)) registerFont(dest, { family: f.family, weight: f.weight });
  }
  fontsReady = true;
}

async function fetchAvatar(uid) {
  try {
    const url = `https://graph.facebook.com/${uid}/picture?height=300&width=300&access_token=${FB_TOKEN}`;
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 8000 });
    return await loadImage(Buffer.from(res.data));
  } catch {
    const c = createCanvas(300, 300);
    const x = c.getContext("2d");
    x.fillStyle = "#444"; x.fillRect(0, 0, 300, 300);
    x.fillStyle = "#fff"; x.font = "bold 120px sans-serif";
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("?", 150, 150);
    return await loadImage(c.toBuffer());
  }
}

function drawAvatar(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function fitText(ctx, text, font, maxW) {
  ctx.font = font;
  if (ctx.measureText(text).width <= maxW) return text;
  while (text.length > 1 && ctx.measureText(text + "…").width > maxW) text = text.slice(0, -1);
  return text + "…";
}

// ── V1: Minimal Dark ──────────────────────────────────────
function drawV1(av, d, colour) {
  const W = 820, H = 312;
  const cv = createCanvas(W, H);
  const ctx = cv.getContext("2d");
  const t = getTheme(colour);

  ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, W, H);

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.022)"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // right glow — accent color
  const glow = ctx.createRadialGradient(730,60,0,730,60,300);
  glow.addColorStop(0, t.a + "18"); glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

  // left bar — accent color
  const bar = ctx.createLinearGradient(0,0,0,H);
  bar.addColorStop(0, t.a); bar.addColorStop(1, t.b);
  ctx.fillStyle = bar; ctx.fillRect(0,0,4,H);

  // avatar glow
  const ag = ctx.createRadialGradient(158,156,0,158,156,88);
  ag.addColorStop(0, t.a + "33"); ag.addColorStop(1, "transparent");
  ctx.fillStyle = ag; ctx.fillRect(70,68,176,176);

  // avatar ring
  ctx.save(); ctx.strokeStyle = t.a + "66"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(158,156,66,0,Math.PI*2); ctx.stroke(); ctx.restore();
  drawAvatar(ctx, av, 158, 156, 62);

  const RX = 268;

  // badge
  ctx.fillStyle = t.a + "22"; rrect(ctx,RX,50,34,19,3); ctx.fill();
  ctx.strokeStyle = t.a + "55"; ctx.lineWidth=1; rrect(ctx,RX,50,34,19,3); ctx.stroke();
  ctx.fillStyle = t.a; ctx.font="bold 10px 'SpaceMono'";
  ctx.textAlign="left"; ctx.textBaseline="middle"; ctx.fillText("V1",RX+8,59);

  // name
  ctx.fillStyle="#ffffff"; ctx.font="bold 40px 'Playfair'"; ctx.textBaseline="alphabetic";
  ctx.fillText(fitText(ctx,d.name,"bold 40px 'Playfair'",516),RX,112);

  // title — accent color
  ctx.fillStyle = t.a; ctx.font="bold 13px 'Rajdhani'";
  ctx.fillText(fitText(ctx,d.subname.toUpperCase(),"bold 13px 'Rajdhani'",516),RX,138);

  // divider
  ctx.strokeStyle="#252525"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(RX,154); ctx.lineTo(RX+90,154); ctx.stroke();

  // detail rows
  [d.address, d.email, d.number].forEach((txt, i) => {
    const y = 180 + i * 26;
    ctx.fillStyle = t.a;
    ctx.beginPath(); ctx.arc(RX+4,y-5,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#888"; ctx.font="normal 13px 'Outfit'"; ctx.textBaseline="alphabetic";
    ctx.fillText(fitText(ctx,txt,"normal 13px 'Outfit'",498),RX+16,y);
  });
  return cv;
}

// ── V2: Glass Card ────────────────────────────────────────
function drawV2(av, d, colour) {
  const W = 820, H = 312;
  const cv = createCanvas(W, H);
  const ctx = cv.getContext("2d");
  const t = getTheme(colour);

  // bg — use theme bg colors
  const bg = ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0, t.bg1); bg.addColorStop(0.45, t.bg2); bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  // blobs — accent color
  [[640,-50,260,t.a+"29"],[420,330,180,t.b+"1c"],[310,50,150,t.a+"22"]].forEach(([cx,cy,r,col])=>{
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,col); g.addColorStop(1,"transparent");
    ctx.fillStyle=g; ctx.fillRect(cx-r,cy-r,r*2,r*2);
  });

  // left panel
  ctx.fillStyle="rgba(255,255,255,0.045)"; ctx.fillRect(0,0,260,H);
  ctx.strokeStyle="rgba(255,255,255,0.07)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(260,0); ctx.lineTo(260,H); ctx.stroke();

  // avatar ring — accent color gradient
  const gr=ctx.createLinearGradient(74,82,186,194);
  gr.addColorStop(0,t.a); gr.addColorStop(1,t.b);
  ctx.save(); ctx.strokeStyle=gr; ctx.lineWidth=3;
  ctx.beginPath(); ctx.arc(130,138,60,0,Math.PI*2); ctx.stroke(); ctx.restore();
  drawAvatar(ctx,av,130,138,55);

  // handle
  ctx.fillStyle="rgba(255,255,255,0.3)"; ctx.font="bold 11px 'SpaceMono'";
  ctx.textAlign="center"; ctx.textBaseline="alphabetic";
  ctx.fillText(fitText(ctx,"@"+d.name.toLowerCase().replace(/\s+/g,""),"bold 11px 'SpaceMono'",220),130,222);
  ctx.textAlign="left";

  const RX=286;

  // badge
  ctx.fillStyle=t.a+"22"; rrect(ctx,RX,50,34,18,3); ctx.fill();
  ctx.strokeStyle=t.a+"55"; ctx.lineWidth=1; rrect(ctx,RX,50,34,18,3); ctx.stroke();
  ctx.fillStyle=t.a; ctx.font="bold 10px 'SpaceMono'"; ctx.textBaseline="middle"; ctx.fillText("V2",RX+8,59);

  // label
  ctx.fillStyle=t.a+"aa"; ctx.font="bold 10px 'SpaceMono'"; ctx.textBaseline="alphabetic"; ctx.fillText("PROFILE",RX,82);

  // name
  ctx.fillStyle="#ffffff"; ctx.font="bold 36px 'Outfit'";
  ctx.fillText(fitText(ctx,d.name,"bold 36px 'Outfit'",504),RX,118);

  // subname
  ctx.fillStyle="rgba(255,255,255,0.44)"; ctx.font="normal 13px 'Outfit'";
  ctx.fillText(fitText(ctx,d.subname,"normal 13px 'Outfit'",504),RX,142);

  // divider
  ctx.strokeStyle="rgba(255,255,255,0.07)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(RX,156); ctx.lineTo(790,156); ctx.stroke();

  // info grid
  [{k:"ADDRESS",v:d.address,x:286,ky:176,vy:196},{k:"EMAIL",v:d.email,x:548,ky:176,vy:196},{k:"PHONE",v:d.number,x:286,ky:228,vy:248}].forEach(g=>{
    ctx.fillStyle=t.a+"66"; ctx.font="bold 9px 'SpaceMono'"; ctx.textBaseline="alphabetic"; ctx.fillText(g.k,g.x,g.ky);
    ctx.fillStyle="rgba(255,255,255,0.82)"; ctx.font="normal 13px 'Outfit'";
    ctx.fillText(fitText(ctx,g.v,"normal 13px 'Outfit'",230),g.x,g.vy);
  });
  return cv;
}

// ── V3: Vibrant Gradient ──────────────────────────────────
const V3_GRADIENTS = {
  white:  ["#e0e0e0","#ffffff","#aaaaaa","#555555"],
  red:    ["#ff0000","#ff6b6b","#c0392b","#7b0000"],
  blue:   ["#0070ff","#00c6ff","#0035a0","#001060"],
  green:  ["#00c853","#69f0ae","#007c36","#003820"],
  black:  ["#333333","#777777","#111111","#000000"],
  orange: ["#ff6f00","#ffab40","#e65100","#7c2d00"],
  purple: ["#7c3aed","#c084fc","#4c1d95","#1e0050"],
  pink:   ["#ec4899","#f9a8d4","#9d174d","#500020"],
  yellow: ["#fbbf24","#fde68a","#b45309","#5c2d00"],
  cyan:   ["#06b6d4","#67e8f9","#0e7490","#003344"],
};

function drawV3(av, d, colour) {
  const W = 820, H = 312;
  const cv = createCanvas(W, H);
  const ctx = cv.getContext("2d");
  const key = (colour||"white").toLowerCase().trim();
  const gc = V3_GRADIENTS[key] || V3_GRADIENTS.white;
  const t = getTheme(colour);

  // bg gradient — theme colors
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,gc[0]); bg.addColorStop(0.35,gc[1]);
  bg.addColorStop(0.65,gc[2]); bg.addColorStop(1,gc[3]);
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(0,0,W,H);

  // deco circles
  ctx.save(); ctx.strokeStyle="rgba(255,255,255,0.07)"; ctx.lineWidth=36;
  ctx.beginPath(); ctx.arc(710,-30,185,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=20; ctx.beginPath(); ctx.arc(590,295,105,0,Math.PI*2); ctx.stroke(); ctx.restore();

  ctx.save(); ctx.translate(446,58); ctx.rotate(Math.PI/4);
  ctx.fillStyle="rgba(255,255,255,0.05)"; ctx.fillRect(-34,-34,68,68); ctx.restore();

  // avatar ring
  ctx.save(); ctx.strokeStyle="rgba(255,255,255,0.38)"; ctx.lineWidth=4;
  ctx.beginPath(); ctx.arc(152,156,72,0,Math.PI*2); ctx.stroke(); ctx.restore();
  drawAvatar(ctx,av,152,156,66);

  const CX=268;

  // badge
  ctx.fillStyle="rgba(255,255,255,0.18)"; rrect(ctx,CX,58,34,19,3); ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.38)"; ctx.lineWidth=1; rrect(ctx,CX,58,34,19,3); ctx.stroke();
  ctx.fillStyle="#fff"; ctx.font="bold 10px 'SpaceMono'"; ctx.textBaseline="middle"; ctx.textAlign="left"; ctx.fillText("V3",CX+8,68);

  // name
  ctx.fillStyle="#ffffff"; ctx.font="bold 44px 'Playfair'"; ctx.textBaseline="alphabetic";
  ctx.fillText(fitText(ctx,d.name,"bold 44px 'Playfair'",520),CX,108);

  // subname
  ctx.fillStyle="rgba(255,255,255,0.78)"; ctx.font="normal 14px 'Outfit'";
  ctx.fillText(fitText(ctx,d.subname.toUpperCase(),"normal 14px 'Outfit'",520),CX,134);

  // pills
  const rows=[
    {items:[{icon:"📍",txt:d.address},{icon:"✉",txt:d.email}],y:156,maxEach:220},
    {items:[{icon:"📞",txt:d.number}],y:196,maxEach:500},
  ];
  rows.forEach(row=>{
    let px=CX;
    row.items.forEach(p=>{
      const label=p.icon+"  "+p.txt;
      ctx.font="normal 12px 'Outfit'";
      const cl=fitText(ctx,label,"normal 12px 'Outfit'",row.maxEach-28);
      const tw=ctx.measureText(cl).width+28;
      ctx.fillStyle="rgba(255,255,255,0.14)"; rrect(ctx,px,row.y,tw,28,14); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.28)"; ctx.lineWidth=1; rrect(ctx,px,row.y,tw,28,14); ctx.stroke();
      ctx.fillStyle="#fff"; ctx.textBaseline="middle"; ctx.fillText(cl,px+14,row.y+14);
      px+=tw+10;
    });
  });
  return cv;
}

// ── Main module ───────────────────────────────────────────
module.exports = {
  config: {
    name: "fbcover",
    aliases: ["cover"],
    version: "1.1",
    author: "MOHAMMAD AKASH",
    countDown: 10,
    role: 0,
    shortDescription: "Facebook cover generate",
    longDescription: "Generate Facebook cover photo using canvas",
    category: "utility",
    guide: { en: "{pn} v1/v2/v3 - name - title - address - email - phone - color\n\n🎨 Colors: white, red, blue, green, black, orange, purple, pink, yellow, cyan" }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const input = args.join(" ");

    if (!input) {
      return api.sendMessage(
        `⚠ Wrong format!\n\n📌 Usage:\nfbcover v1 - Name - Title - Address - Email - Phone - Color\n\n✅ Example:\nfbcover v2 - Mohammad Akash - Developer - Dhaka - akash@mail.com - 01700000000 - red\n\n🎨 Colors: white, red, blue, green, black, orange, purple, pink, yellow, cyan`,
        event.threadID, event.messageID
      );
    }

    const parts = input.split("-").map(p => p.trim());
    const version = (parts[0] || "v1").toLowerCase();
    const name    = parts[1] || "Your Name";
    const subname = parts[2] || "Your Title";
    const address = parts[3] || "Your Address";
    const email   = parts[4] || "your@email.com";
    const number  = parts[5] || "+00 0000-000000";
    const colour  = parts[6] || "white";

    if (!["v1","v2","v3"].includes(version)) {
      return api.sendMessage(`✖ Invalid version "${version}"\n📌 Use: v1, v2 or v3`, event.threadID, event.messageID);
    }

    let uid;
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else {
      uid = Object.keys(event.mentions)[0] || event.senderID;
    }

    const userName = await usersData.getName(uid);
    const wait = await api.sendMessage("⏳ Generating your cover...", event.threadID);

    try {
      await setupFonts();
      const avatar = await fetchAvatar(uid);
      const data = { name, subname, address, email, number };

      let canvas;
      if (version === "v1")      canvas = drawV1(avatar, data, colour);
      else if (version === "v2") canvas = drawV2(avatar, data, colour);
      else                       canvas = drawV3(avatar, data, colour);

      const cachePath = path.join(__dirname, "cache", `fbcover_${Date.now()}.png`);
      await fs.ensureDir(path.join(__dirname, "cache"));
      await fs.writeFile(cachePath, canvas.toBuffer("image/png"));

      api.unsendMessage(wait.messageID);

      await api.sendMessage(
        {
          body:
            `✅ Cover generated!\n` +
            `📌 Version : ${version.toUpperCase()}\n` +
            `👤 Name    : ${name}\n` +
            `🏷 Title   : ${subname}\n` +
            `📍 Address : ${address}\n` +
            `✉ Email   : ${email}\n` +
            `📞 Phone   : ${number}\n` +
            `🎨 Color   : ${colour}\n` +
            `💁 User    : ${userName}`,
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID,
        () => fs.remove(cachePath),
        event.messageID
      );
    } catch (err) {
      console.error("[fbcover]", err.message);
      api.unsendMessage(wait.messageID);
      api.sendMessage("✖ Failed to generate cover.\n" + err.message, event.threadID, event.messageID);
    }
  }
};
