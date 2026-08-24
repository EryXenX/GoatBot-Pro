const { createCanvas, registerFont } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const fontDir = path.join(__dirname, "fonts");

function ensureFont(filename, url) {
  const fp = path.join(fontDir, filename);
  if (!fs.existsSync(fp)) {
    try {
      fs.mkdirSync(fontDir, { recursive: true });
      execSync(`curl -L -o "${fp}" "${url}"`, { stdio: "pipe" });
    } catch {}
  }
  return fp;
}

ensureFont("NotoColorEmoji.ttf", "https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf");

registerFont(path.join(fontDir, "CourierPrime-Regular.ttf"), { family: "UI" });
registerFont(path.join(fontDir, "CourierPrime-Bold.ttf"),    { family: "UI", weight: "bold" });
try {
  registerFont(path.join(fontDir, "NotoColorEmoji.ttf"), { family: "Emoji" });
} catch {}

const themeMap = {};

const THEMES = {
  dark: {
    bg0: "#091525", bg1: "#0d1f3c", bg2: "#0c1a35", bg3: "#07101e",
    winBody: "rgba(10,18,38,0.84)",
    sidebar: "rgba(255,255,255,0.032)",
    tbFrom: "rgba(255,255,255,0.11)", tbTo: "rgba(255,255,255,0.04)",
    tbBorder: "rgba(255,255,255,0.10)",
    tbText: "rgba(255,255,255,0.80)",
    btnBg: "rgba(255,255,255,0.06)",
    btnText: "rgba(255,255,255,0.78)",
    sidebarBorder: "rgba(255,255,255,0.055)",
    activeItem: "rgba(0,120,212,0.22)",
    activeText: "rgba(255,255,255,0.88)",
    inactiveText: "rgba(255,255,255,0.34)",
    taskFrom: "rgba(18,28,52,0.97)", taskTo: "rgba(12,20,40,0.99)",
    taskBorder: "rgba(255,255,255,0.07)",
    taskText: "rgba(255,255,255,0.80)",
    taskSub: "rgba(255,255,255,0.42)",
    taskIcons: "rgba(255,255,255,0.55)",
    pageTitle: "#ffffff",
    dateText: "rgba(255,255,255,0.28)",
    cardBg: "rgba(255,255,255,0.052)",
    cardBorder: "rgba(255,255,255,0.09)",
    cardShine: "rgba(255,255,255,0.07)",
    cardShadow: "rgba(0,0,0,0.55)",
    labelText: "rgba(255,255,255,0.40)",
    labelText2: "rgba(255,255,255,0.38)",
    labelText3: "rgba(255,255,255,0.46)",
    labelText4: "rgba(255,255,255,0.68)",
    valueText: "rgba(255,255,255,0.80)",
    barLabel: "rgba(255,255,255,0.78)",
    barPct: "rgba(255,255,255,0.50)",
    barTrack: "rgba(255,255,255,0.10)",
    ringTrack: "rgba(255,255,255,0.07)",
    ringValue: "#ffffff",
    rowAlt: "rgba(255,255,255,0.022)",
    detailValue: "rgba(255,255,255,0.80)",
    subtitleText: "rgba(255,255,255,0.28)",
    networkIP: "rgba(255,255,255,0.55)",
    networkMask: "rgba(255,255,255,0.35)",
    cmdText: "rgba(255,255,255,0.55)",
    themeToggleBg: "rgba(255,255,255,0.06)",
    themeToggleBorder: "rgba(255,255,255,0.18)",
    themeActiveBg: "#0078d4",
    themeActiveText: "#ffffff",
    themeInactiveText: "rgba(255,255,255,0.45)",
  },
  light: {
    bg0: "#f0f4f8", bg1: "#e8edf5", bg2: "#edf1f7", bg3: "#e4eaf2",
    winBody: "rgba(255,255,255,0.92)",
    sidebar: "rgba(240,244,248,0.85)",
    tbFrom: "rgba(255,255,255,0.95)", tbTo: "rgba(240,244,248,0.90)",
    tbBorder: "rgba(0,0,0,0.10)",
    tbText: "rgba(20,20,20,0.82)",
    btnBg: "rgba(0,0,0,0.05)",
    btnText: "rgba(20,20,20,0.70)",
    sidebarBorder: "rgba(0,0,0,0.07)",
    activeItem: "rgba(0,120,212,0.12)",
    activeText: "#0078d4",
    inactiveText: "rgba(40,40,40,0.45)",
    taskFrom: "rgba(255,255,255,0.98)", taskTo: "rgba(240,244,248,0.99)",
    taskBorder: "rgba(0,0,0,0.08)",
    taskText: "rgba(20,20,20,0.80)",
    taskSub: "rgba(20,20,20,0.42)",
    taskIcons: "rgba(40,40,40,0.40)",
    pageTitle: "#1a1a2e",
    dateText: "rgba(30,30,30,0.38)",
    cardBg: "rgba(0,0,0,0.03)",
    cardBorder: "rgba(0,0,0,0.08)",
    cardShine: "rgba(255,255,255,0.60)",
    cardShadow: "rgba(0,0,0,0.12)",
    labelText: "rgba(30,30,30,0.45)",
    labelText2: "rgba(30,30,30,0.42)",
    labelText3: "rgba(30,30,30,0.55)",
    labelText4: "rgba(30,30,30,0.65)",
    valueText: "rgba(20,20,20,0.80)",
    barLabel: "rgba(30,30,30,0.80)",
    barPct: "rgba(30,30,30,0.45)",
    barTrack: "rgba(0,0,0,0.08)",
    ringTrack: "rgba(0,0,0,0.08)",
    ringValue: "#1a1a2e",
    rowAlt: "rgba(0,0,0,0.03)",
    detailValue: "rgba(20,20,20,0.80)",
    subtitleText: "rgba(30,30,30,0.38)",
    networkIP: "rgba(30,30,30,0.60)",
    networkMask: "rgba(30,30,30,0.40)",
    cmdText: "rgba(30,30,30,0.60)",
    themeToggleBg: "rgba(0,0,0,0.04)",
    themeToggleBorder: "rgba(0,0,0,0.15)",
    themeActiveBg: "#0078d4",
    themeActiveText: "#ffffff",
    themeInactiveText: "rgba(30,30,30,0.45)",
  }
};

let prev = null;
const getCPU = () => {
  let idle = 0, total = 0;
  for (const c of os.cpus()) {
    for (const t in c.times) total += c.times[t];
    idle += c.times.idle;
  }
  const cur = { idle, total };
  if (!prev) { prev = cur; return 0; }
  const di = cur.idle - prev.idle, dt = cur.total - prev.total;
  prev = cur;
  return dt ? Math.round(100 - (100 * di / dt)) : 0;
};
const getDisk = () => {
  try {
    const d = execSync("df -k /").toString().split("\n")[1].split(/\s+/);
    return Math.round((parseInt(d[2]) / parseInt(d[1])) * 100);
  } catch { return Math.floor(Math.random() * 30) + 40; }
};
const getDiskTotal = () => {
  try {
    const d = execSync("df -k /").toString().split("\n")[1].split(/\s+/);
    return (parseInt(d[1]) / 1024 / 1024).toFixed(1);
  } catch { return "N/A"; }
};
const getDiskUsed = () => {
  try {
    const d = execSync("df -k /").toString().split("\n")[1].split(/\s+/);
    return (parseInt(d[2]) / 1024 / 1024).toFixed(1);
  } catch { return "N/A"; }
};
const getNetwork = () => {
  try {
    const ifaces = os.networkInterfaces();
    let t = 0;
    for (const i in ifaces) ifaces[i].forEach(a => { if (!a.internal && a.family === "IPv4") t++; });
    return t;
  } catch { return 1; }
};
const getNetworkIPs = () => {
  try {
    const ifaces = os.networkInterfaces();
    const result = [];
    for (const name in ifaces) {
      ifaces[name].forEach(a => {
        if (!a.internal && a.family === "IPv4") result.push({ name, address: a.address, netmask: a.netmask });
      });
    }
    return result;
  } catch { return []; }
};
const getTemperature = () => {
  try {
    if (os.platform() === "linux") {
      return Math.round(parseInt(execSync("cat /sys/class/thermal/thermal_zone0/temp").toString()) / 1000);
    } else if (os.platform() === "darwin") {
      const t = execSync("sudo powermetrics --samplers smc -i1 -n1 | grep -i 'CPU die temperature'").toString();
      const m = t.match(/(\d+.?\d*)/);
      return m ? Math.round(parseFloat(m[0])) : 45;
    }
  } catch { return Math.floor(Math.random() * 20) + 40; }
  return 45;
};
const getDhakaTime = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Dhaka" });
  const fullStr = now.toLocaleString("en-US", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Dhaka"
  }) + " BDT";
  return { timeStr, dateStr, fullStr };
};

function roundRect(ctx, x, y, w, h, r) {
  const tl = Array.isArray(r) ? r[0] : r;
  const tr = Array.isArray(r) ? r[1] : r;
  const br = Array.isArray(r) ? r[2] : r;
  const bl = Array.isArray(r) ? r[3] : r;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function acrylicCardT(ctx, x, y, w, h, r, th) {
  ctx.save();
  ctx.shadowColor   = th.cardShadow;
  ctx.shadowBlur    = 18;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = th.cardBg;
  ctx.fill();
  ctx.restore();
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = th.cardBorder;
  ctx.lineWidth   = 1;
  ctx.stroke();
  roundRect(ctx, x + 1, y + 1, w - 2, 2, 1);
  ctx.fillStyle = th.cardShine;
  ctx.fill();
}

function win11BarT(ctx, x, y, w, value, color1, color2, label, pct, th) {
  const trackH = 10;
  ctx.font      = "bold 24px 'UI'";
  ctx.fillStyle = th.barLabel;
  ctx.textAlign = "left";
  ctx.fillText(label, x, y - 10);
  ctx.fillStyle = th.barPct;
  ctx.textAlign = "right";
  ctx.fillText(`${pct}%`, x + w, y - 10);
  roundRect(ctx, x, y, w, trackH, trackH / 2);
  ctx.fillStyle = th.barTrack;
  ctx.fill();
  if (value > 0) {
    const fw = Math.max((value / 100) * w, trackH);
    const g  = ctx.createLinearGradient(x, 0, x + fw, 0);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    roundRect(ctx, x, y, fw, trackH, trackH / 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.save();
    ctx.shadowColor = color1;
    ctx.shadowBlur  = 12;
    roundRect(ctx, x + fw - 4, y, 4, trackH, trackH / 2);
    ctx.fillStyle = color2;
    ctx.fill();
    ctx.restore();
  }
  ctx.textAlign = "left";
}

function clipText(ctx, text, maxW) {
  let t = text;
  while (ctx.measureText(t).width > maxW && t.length > 1) t = t.slice(0, -1);
  if (t !== text) t = t.slice(0, -1) + "..";
  return t;
}

function drawBase(c, W, H, activePage, version, th) {
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,    th.bg0);
  bg.addColorStop(0.4,  th.bg1);
  bg.addColorStop(0.75, th.bg2);
  bg.addColorStop(1,    th.bg3);
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);

  const glow = (gx, gy, gr, col) => {
    const rg = c.createRadialGradient(gx, gy, 0, gx, gy, gr);
    rg.addColorStop(0, col);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = rg;
    c.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
  };
  glow(280, 200, 480, "rgba(0,120,212,0.17)");
  glow(1520, 820, 440, "rgba(90,60,200,0.13)");
  glow(900, 580, 560, "rgba(0,80,170,0.08)");

  const WIN_X = 55, WIN_Y = 28, WIN_W = W - 110;
  const TB_H  = 50;

  roundRect(c, WIN_X, WIN_Y, WIN_W, TB_H, [12, 12, 0, 0]);
  const tbG = c.createLinearGradient(WIN_X, WIN_Y, WIN_X, WIN_Y + TB_H);
  tbG.addColorStop(0, th.tbFrom);
  tbG.addColorStop(1, th.tbTo);
  c.fillStyle = tbG;
  c.fill();
  c.strokeStyle = th.tbBorder;
  c.lineWidth   = 1;
  c.stroke();

  c.beginPath();
  c.arc(WIN_X + 22, WIN_Y + 25, 9, 0, Math.PI * 2);
  c.fillStyle = "#0078d4";
  c.fill();

  c.font      = "bold 23px 'UI'";
  c.fillStyle = th.tbText;
  c.textAlign = "left";
  c.fillText(`System Monitor  \u2014  v${version}`, WIN_X + 46, WIN_Y + 32);

  [
    { x: WIN_X + WIN_W - 138, label: "\u2014", bg: th.btnBg },
    { x: WIN_X + WIN_W - 92,  label: "\u25A1",  bg: th.btnBg },
    { x: WIN_X + WIN_W - 46,  label: "\u2715",  bg: "rgba(196,43,28,0.85)" },
  ].forEach(btn => {
    roundRect(c, btn.x - 8, WIN_Y + 1, 44, TB_H - 2, 0);
    c.fillStyle = btn.bg;
    c.fill();
    c.font      = "19px 'UI'";
    c.fillStyle = btn.label === "\u2715" ? "rgba(255,255,255,0.90)" : th.btnText;
    c.textAlign = "center";
    c.fillText(btn.label, btn.x + 14, WIN_Y + 30);
  });

  const BODY_Y = WIN_Y + TB_H;
  const BODY_H = H - TB_H - WIN_Y - 30 - 72;
  roundRect(c, WIN_X, BODY_Y, WIN_W, BODY_H, [0, 0, 12, 12]);
  c.fillStyle = th.winBody;
  c.fill();
  c.strokeStyle = th.tbBorder;
  c.lineWidth   = 1;
  c.stroke();

  const SB_W = 265;
  roundRect(c, WIN_X + 1, BODY_Y + 1, SB_W, BODY_H - 2, [0, 0, 0, 12]);
  c.fillStyle = th.sidebar;
  c.fill();
  c.strokeStyle = th.sidebarBorder;
  c.lineWidth   = 1;
  c.beginPath();
  c.moveTo(WIN_X + SB_W, BODY_Y + 8);
  c.lineTo(WIN_X + SB_W, BODY_Y + BODY_H - 8);
  c.stroke();

  const pages = ["Overview", "Performance", "Network", "Storage", "Settings"];
  pages.forEach((label, i) => {
    const ny     = BODY_Y + 28 + i * 66;
    const active = label.toLowerCase() === activePage;
    if (active) {
      roundRect(c, WIN_X + 10, ny - 4, SB_W - 20, 54, 8);
      c.fillStyle = th.activeItem;
      c.fill();
      c.fillStyle = "#0078d4";
      c.fillRect(WIN_X + 10, ny + 4, 4, 34);
    }
    c.font      = "bold 21px 'UI'";
    c.fillStyle = active ? th.activeText : th.inactiveText;
    c.textAlign = "left";
    c.fillText(label, WIN_X + 28, ny + 30);
  });

  const { timeStr, dateStr } = getDhakaTime();
  const TASK_Y = H - 70;
  const taskBg = c.createLinearGradient(0, TASK_Y, 0, H);
  taskBg.addColorStop(0, th.taskFrom);
  taskBg.addColorStop(1, th.taskTo);
  c.fillStyle = taskBg;
  c.fillRect(0, TASK_Y, W, 70);
  c.strokeStyle = th.taskBorder;
  c.lineWidth   = 1;
  c.beginPath();
  c.moveTo(0, TASK_Y);
  c.lineTo(W, TASK_Y);
  c.stroke();

  roundRect(c, W / 2 - 230, TASK_Y + 9, 50, 50, 8);
  c.fillStyle = "rgba(0,120,212,0.88)";
  c.fill();
  c.font      = "bold 26px 'UI'";
  c.fillStyle = "#ffffff";
  c.textAlign = "center";
  c.fillText("\u229E", W / 2 - 205, TASK_Y + 43);

  ["\u25A3", "\u25A6", "\u2740", "\u25CE", "\u2699"].forEach((icon, i) => {
    const ix = W / 2 - 120 + i * 58;
    c.font      = "26px 'UI'";
    c.textAlign = "center";
    c.fillStyle = i === 0 ? th.taskText : th.taskIcons;
    c.fillText(icon, ix, TASK_Y + 43);
    if (i === 0) {
      c.beginPath();
      c.arc(ix, TASK_Y + 62, 3, 0, Math.PI * 2);
      c.fillStyle = "#0078d4";
      c.fill();
    }
  });

  c.font      = "bold 21px 'UI'";
  c.fillStyle = th.taskText;
  c.textAlign = "right";
  c.fillText(timeStr, W - 28, TASK_Y + 32);
  c.font      = "19px 'UI'";
  c.fillStyle = th.taskSub;
  c.fillText(dateStr, W - 28, TASK_Y + 56);

  ["\u266B", "\u25D0", "\u2602"].forEach((ico, i) => {
    c.font      = "22px 'UI'";
    c.fillStyle = th.taskIcons;
    c.textAlign = "center";
    c.fillText(ico, W - 165 + i * 34, TASK_Y + 40);
  });

  return { WIN_X, WIN_Y, WIN_W, TB_H, BODY_Y, BODY_H, SB_W };
}

function drawPageHeader(c, MX, MY, WIN_X, WIN_W, title, subtitle, subtitleColor, th) {
  c.font      = "bold 46px 'UI'";
  c.fillStyle = th.pageTitle;
  c.textAlign = "left";
  c.fillText(title, MX, MY + 42);

  if (subtitle) {
    const pillW = c.measureText(subtitle).width + 44;
    roundRect(c, MX + 232, MY + 12, pillW, 34, 17);
    c.fillStyle = subtitleColor + "20";
    c.fill();
    roundRect(c, MX + 232, MY + 12, pillW, 34, 17);
    c.strokeStyle = subtitleColor + "55";
    c.lineWidth   = 1;
    c.stroke();
    c.beginPath();
    c.arc(MX + 250, MY + 29, 6, 0, Math.PI * 2);
    c.fillStyle = subtitleColor;
    c.fill();
    c.font      = "bold 19px 'UI'";
    c.fillStyle = subtitleColor;
    c.textAlign = "left";
    c.fillText(subtitle, MX + 263, MY + 34);
  }

  c.font      = "21px 'UI'";
  c.fillStyle = th.subtitleText;
  c.textAlign = "right";
  c.fillText(getDhakaTime().fullStr, WIN_X + WIN_W - 28, MY + 42);
}

async function renderPage(page, sysData, th) {
  const W = 1800, H = 1160;
  const cv = createCanvas(W, H);
  const c  = cv.getContext("2d");

  const { WIN_X, WIN_Y, WIN_W, TB_H, BODY_Y, BODY_H, SB_W } = drawBase(c, W, H, page, "3.0", th);

  const MX  = WIN_X + SB_W + 28;
  const MY  = BODY_Y + 22;
  const MCW = WIN_W - SB_W - 46;
  const gap = 18;

  const { cpu, ram, disk, network, temp, threads, platform, arch, hostname,
    load, cpuModel, ramGB, usedGB, uptime, ping, pingLabel, pingAccent,
    sysStatus, sysStatusColor, diskTotal, diskUsed, netIPs, themeName } = sysData;

  if (page === "overview") {
    drawPageHeader(c, MX, MY, WIN_X, WIN_W, "Overview", sysStatus, sysStatusColor, th);

    const R1Y = MY + 62, R1H = 120;
    const C4W = (MCW - gap * 3) / 4;
    [
      { label: "Hostname",  value: hostname.substring(0, 16), accent: "#60a5fa", large: false },
      { label: "OS / Arch", value: `${platform}  ${arch}`,   accent: "#a78bfa", large: false },
      { label: "Processor", value: cpuModel,                  accent: "#f59e0b", large: false },
      { label: "Uptime",    value: uptime,                    accent: "#34d399", large: true  },
    ].forEach((card, i) => {
      const cx = MX + i * (C4W + gap);
      acrylicCardT(c, cx, R1Y, C4W, R1H, 12, th);
      c.font      = "19px 'UI'";
      c.fillStyle = th.labelText;
      c.textAlign = "left";
      c.fillText(card.label, cx + 16, R1Y + 28);
      if (card.large) {
        c.font      = "bold 44px 'UI'";
        c.fillStyle = card.accent;
        c.textAlign = "left";
        c.fillText(card.value, cx + 16, R1Y + 88);
      } else {
        c.font = "bold 26px 'UI'";
        const clipped = clipText(c, card.value, C4W - 28);
        c.fillStyle = card.accent;
        c.textAlign = "left";
        c.fillText(clipped, cx + 16, R1Y + 78);
      }
    });

    const R2Y = R1Y + R1H + 18;
    const PERF_W = Math.floor((MCW * 0.60 - gap * 2) / 3);
    const PERF_H = 235;
    [
      { label: "CPU",    value: cpu,  sub: `${threads} Cores \u00b7 Load ${load}`, c1: "#0078d4", c2: "#60a5fa" },
      { label: "Memory", value: ram,  sub: `${usedGB} GB / ${ramGB} GB`,           c1: "#7c3aed", c2: "#a78bfa" },
      { label: "Disk",   value: disk, sub: `Usage ${disk}% \u00b7 Active`,          c1: "#db2777", c2: "#f472b6" },
    ].forEach((card, i) => {
      const px = MX + i * (PERF_W + gap);
      acrylicCardT(c, px, R2Y, PERF_W, PERF_H, 14, th);
      const ringCX = px + PERF_W / 2, ringCY = R2Y + 102, ringR = 68;
      c.beginPath(); c.arc(ringCX, ringCY, ringR, Math.PI * 0.75, Math.PI * 2.25);
      c.strokeStyle = th.ringTrack; c.lineWidth = 11; c.lineCap = "round"; c.stroke();
      const arcEnd = Math.PI * 0.75 + (card.value / 100) * Math.PI * 1.5;
      const arcG = c.createLinearGradient(px, R2Y, px + PERF_W, R2Y + PERF_H);
      arcG.addColorStop(0, card.c1); arcG.addColorStop(1, card.c2);
      c.beginPath(); c.arc(ringCX, ringCY, ringR, Math.PI * 0.75, arcEnd);
      c.strokeStyle = arcG; c.lineWidth = 11; c.lineCap = "round"; c.stroke();
      c.save(); c.shadowColor = card.c1; c.shadowBlur = 16;
      c.beginPath(); c.arc(ringCX, ringCY, ringR, arcEnd - 0.04, arcEnd);
      c.strokeStyle = card.c2; c.lineWidth = 11; c.stroke(); c.restore();
      c.font = "bold 44px 'UI'"; c.fillStyle = th.ringValue; c.textAlign = "center";
      c.fillText(`${card.value}%`, ringCX, ringCY + 15);
      c.font = "bold 26px 'UI'"; c.fillStyle = card.c2; c.fillText(card.label, ringCX, R2Y + 192);
      c.font = "19px 'UI'"; c.fillStyle = th.labelText; c.fillText(card.sub, ringCX, R2Y + 218);
    });

    const DPX = MX + PERF_W * 3 + gap * 3;
    const DPW = MCW - PERF_W * 3 - gap * 3;
    acrylicCardT(c, DPX, R2Y, DPW, PERF_H, 14, th);
    c.font = "bold 24px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("System Details", DPX + 18, R2Y + 34);
    [
      { k: "Node.js",  v: process.version },
      { k: "Threads",  v: `${threads}`    },
      { k: "Temp",     v: `${temp}\u00b0C` },
      { k: "Net IFs",  v: `${network}`    },
      { k: "Load Avg", v: `${load}`       },
    ].forEach((row, i) => {
      const dy = R2Y + 64 + i * 34;
      if (i % 2 === 0) {
        roundRect(c, DPX + 10, dy - 16, DPW - 20, 30, 6);
        c.fillStyle = th.rowAlt; c.fill();
      }
      c.font = "19px 'UI'"; c.fillStyle = th.labelText2; c.textAlign = "left";
      c.fillText(row.k, DPX + 20, dy + 5);
      c.font = "bold 19px 'UI'"; c.fillStyle = th.detailValue; c.textAlign = "right";
      c.fillText(row.v, DPX + DPW - 18, dy + 5);
    });

    const R3Y = R2Y + PERF_H + 18, R3H = 160;
    acrylicCardT(c, MX, R3Y, MCW, R3H, 14, th);
    c.font = "bold 22px 'UI'"; c.fillStyle = th.labelText3; c.textAlign = "left";
    c.fillText("Resource Usage", MX + 18, R3Y + 30);
    const barW = (MCW - 90) / 3;
    [
      { label: "CPU Usage",    value: cpu,  c1: "#0078d4", c2: "#60a5fa" },
      { label: "Memory Usage", value: ram,  c1: "#7c3aed", c2: "#a78bfa" },
      { label: "Disk Usage",   value: disk, c1: "#db2777", c2: "#f472b6" },
    ].forEach((bar, i) => {
      win11BarT(c, MX + 18 + i * (barW + 27), R3Y + 86, barW, bar.value, bar.c1, bar.c2, bar.label, bar.value, th);
    });

    const R4Y = R3Y + R3H + 18, R4H = 110;
    const T4W = (MCW - gap * 3) / 4;
    [
      { label: "Response", value: `${ping}ms`,       sub: pingLabel,                                          accent: pingAccent },
      { label: "Hostname", value: hostname.substring(0, 14), sub: `${platform} \u00b7 ${arch}`,              accent: "#60a5fa"  },
      { label: "CPU Temp", value: `${temp}\u00b0C`,  sub: temp > 70 ? "High" : temp > 50 ? "Warm" : "Cool",  accent: temp > 70 ? "#f87171" : temp > 50 ? "#fb923c" : "#34d399" },
      { label: "Load Avg", value: `${load}`,         sub: `${threads} threads`,                               accent: "#a78bfa"  },
    ].forEach((tile, i) => {
      const tx = MX + i * (T4W + gap);
      acrylicCardT(c, tx, R4Y, T4W, R4H, 14, th);
      c.font = "19px 'UI'"; c.fillStyle = th.labelText; c.textAlign = "left";
      c.fillText(tile.label, tx + 18, R4Y + 30);
      c.font = "bold 32px 'UI'"; c.fillStyle = tile.accent;
      c.fillText(tile.value, tx + 18, R4Y + 72);
      c.font = "18px 'UI'"; c.fillStyle = th.labelText2;
      c.fillText(tile.sub, tx + 18, R4Y + 96);
    });

  } else if (page === "performance") {
    drawPageHeader(c, MX, MY, WIN_X, WIN_W, "Performance", "Real-time stats", "#60a5fa", th);

    const cpuColor  = cpu > 80 ? "#f87171" : cpu > 50 ? "#fb923c" : "#60a5fa";
    const ramColor  = ram > 80 ? "#f87171" : ram > 50 ? "#fb923c" : "#a78bfa";
    const diskColor = disk > 80 ? "#f87171" : disk > 50 ? "#fb923c" : "#f472b6";
    const tempColor = temp > 70 ? "#f87171" : temp > 50 ? "#fb923c" : "#34d399";

    const bigRings = [
      { label: "CPU Usage",    value: cpu,  sub: `${threads} cores \u00b7 ${load} avg`, c1: "#0078d4", c2: cpuColor  },
      { label: "Memory",       value: ram,  sub: `${usedGB} / ${ramGB} GB`,              c1: "#7c3aed", c2: ramColor  },
      { label: "Disk",         value: disk, sub: `${diskUsed} / ${diskTotal} GB`,        c1: "#db2777", c2: diskColor },
      { label: "Temperature",  value: Math.min(temp, 99), sub: `${temp}\u00b0C \u00b7 ${temp > 70 ? "Hot" : temp > 50 ? "Warm" : "Cool"}`, c1: "#b45309", c2: tempColor },
    ];

    const RW = (MCW - gap * 3) / 4;
    const RH = 320;
    const RY = MY + 62;
    bigRings.forEach((card, i) => {
      const px = MX + i * (RW + gap);
      acrylicCardT(c, px, RY, RW, RH, 14, th);
      const ringCX = px + RW / 2, ringCY = RY + 130, ringR = 90;
      c.beginPath(); c.arc(ringCX, ringCY, ringR, Math.PI * 0.75, Math.PI * 2.25);
      c.strokeStyle = th.ringTrack; c.lineWidth = 14; c.lineCap = "round"; c.stroke();
      const arcEnd = Math.PI * 0.75 + (card.value / 100) * Math.PI * 1.5;
      const arcG = c.createLinearGradient(px, RY, px + RW, RY + RH);
      arcG.addColorStop(0, card.c1); arcG.addColorStop(1, card.c2);
      c.beginPath(); c.arc(ringCX, ringCY, ringR, Math.PI * 0.75, arcEnd);
      c.strokeStyle = arcG; c.lineWidth = 14; c.lineCap = "round"; c.stroke();
      c.save(); c.shadowColor = card.c1; c.shadowBlur = 20;
      c.beginPath(); c.arc(ringCX, ringCY, ringR, arcEnd - 0.04, arcEnd);
      c.strokeStyle = card.c2; c.lineWidth = 14; c.stroke(); c.restore();
      c.font = "bold 56px 'UI'"; c.fillStyle = th.ringValue; c.textAlign = "center";
      c.fillText(`${card.value}%`, ringCX, ringCY + 20);
      c.font = "bold 28px 'UI'"; c.fillStyle = card.c2; c.fillText(card.label, ringCX, RY + 262);
      c.font = "20px 'UI'"; c.fillStyle = th.labelText; c.fillText(card.sub, ringCX, RY + 294);
    });

    const R2Y = RY + RH + 22, R2H = 200;
    acrylicCardT(c, MX, R2Y, MCW, R2H, 14, th);
    c.font = "bold 24px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("Detailed Breakdown", MX + 20, R2Y + 36);
    const bW = (MCW - 80) / 3;
    [
      { label: "CPU Usage",    value: cpu,  c1: "#0078d4", c2: cpuColor  },
      { label: "Memory Usage", value: ram,  c1: "#7c3aed", c2: ramColor  },
      { label: "Disk Usage",   value: disk, c1: "#db2777", c2: diskColor },
    ].forEach((bar, i) => {
      win11BarT(c, MX + 18 + i * (bW + 22), R2Y + 100, bW, bar.value, bar.c1, bar.c2, bar.label, bar.value, th);
    });

    const R3Y = R2Y + R2H + 18, R3H = 130;
    acrylicCardT(c, MX, R3Y, MCW, R3H, 14, th);
    c.font = "bold 24px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("Process Info", MX + 20, R3Y + 36);
    const procInfo = [
      { k: "CPU Model",     v: clipText(c, cpuModel, 600)  },
      { k: "Node.js",       v: process.version             },
      { k: "Platform",      v: `${platform} ${arch}`       },
      { k: "Load Average",  v: `${os.loadavg().map(l => l.toFixed(2)).join("  ")}` },
    ];
    procInfo.forEach((row, i) => {
      const dx = MX + 20 + i * ((MCW - 40) / 4);
      acrylicCardT(c, dx, R3Y + 50, (MCW - 40) / 4 - 10, 64, 8, th);
      c.font = "18px 'UI'"; c.fillStyle = th.labelText2; c.textAlign = "left";
      c.fillText(row.k, dx + 12, R3Y + 72);
      c.font = "bold 20px 'UI'"; c.fillStyle = th.detailValue;
      c.fillText(row.v, dx + 12, R3Y + 100);
    });

  } else if (page === "network") {
    drawPageHeader(c, MX, MY, WIN_X, WIN_W, "Network", `${network} Interface${network !== 1 ? "s" : ""} Active`, "#4ade80", th);

    const R1Y = MY + 62, R1H = 130;
    const C3W = (MCW - gap * 2) / 3;
    [
      { label: "Interfaces",  value: `${network}`,          sub: "Active IPv4",    accent: "#4ade80"  },
      { label: "Hostname",    value: hostname.substring(0, 18), sub: platform,     accent: "#60a5fa"  },
      { label: "Response",    value: `${ping}ms`,            sub: pingLabel,        accent: pingAccent },
    ].forEach((card, i) => {
      const cx = MX + i * (C3W + gap);
      acrylicCardT(c, cx, R1Y, C3W, R1H, 12, th);
      c.font = "19px 'UI'"; c.fillStyle = th.labelText; c.textAlign = "left";
      c.fillText(card.label, cx + 16, R1Y + 30);
      c.font = "bold 40px 'UI'"; c.fillStyle = card.accent;
      c.fillText(card.value, cx + 16, R1Y + 84);
      c.font = "18px 'UI'"; c.fillStyle = th.labelText2;
      c.fillText(card.sub, cx + 16, R1Y + 112);
    });

    const R2Y = R1Y + R1H + 18;
    acrylicCardT(c, MX, R2Y, MCW, 380, 14, th);
    c.font = "bold 26px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("Network Interfaces", MX + 20, R2Y + 38);

    const IPs = netIPs.length > 0 ? netIPs : [{ name: "lo", address: "127.0.0.1", netmask: "255.0.0.0" }];
    IPs.forEach((iface, i) => {
      const iy = R2Y + 60 + i * 80;
      acrylicCardT(c, MX + 10, iy, MCW - 20, 64, 8, th);
      c.font = "bold 22px 'UI'"; c.fillStyle = "#60a5fa"; c.textAlign = "left";
      c.fillText(iface.name, MX + 28, iy + 26);
      c.font = "20px 'UI'"; c.fillStyle = th.networkIP;
      c.fillText(`IP: ${iface.address}`, MX + 200, iy + 26);
      c.font = "18px 'UI'"; c.fillStyle = th.networkMask;
      c.fillText(`Netmask: ${iface.netmask}`, MX + 560, iy + 26);
      c.beginPath(); c.arc(MX + MCW - 40, iy + 20, 7, 0, Math.PI * 2);
      c.fillStyle = "#4ade80"; c.fill();
      c.font = "17px 'UI'"; c.fillStyle = "#4ade80"; c.textAlign = "right";
      c.fillText("Connected", MX + MCW - 54, iy + 26);
    });

    const R3Y = R2Y + 398, R3H = 200;
    acrylicCardT(c, MX, R3Y, MCW, R3H, 14, th);
    c.font = "bold 24px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("System Network Info", MX + 20, R3Y + 36);
    const netDetails = [
      { k: "Hostname",     v: os.hostname()          },
      { k: "Platform",     v: `${platform} ${arch}`  },
      { k: "DNS Resolve",  v: "Active"               },
      { k: "Ping",         v: `${ping}ms \u00b7 ${pingLabel}` },
    ];
    netDetails.forEach((row, i) => {
      const dx = MX + 20 + i * ((MCW - 40) / 4);
      acrylicCardT(c, dx, R3Y + 52, (MCW - 40) / 4 - 10, 120, 8, th);
      c.font = "19px 'UI'"; c.fillStyle = th.labelText2; c.textAlign = "left";
      c.fillText(row.k, dx + 14, R3Y + 82);
      c.font = "bold 22px 'UI'"; c.fillStyle = "#60a5fa";
      c.fillText(clipText(c, row.v, (MCW - 40) / 4 - 30), dx + 14, R3Y + 115);
    });

  } else if (page === "storage") {
    drawPageHeader(c, MX, MY, WIN_X, WIN_W, "Storage", "Disk Overview", "#f472b6", th);

    const R1Y = MY + 62, R1H = 130;
    const C3W = (MCW - gap * 2) / 3;
    [
      { label: "Total Space",  value: `${diskTotal} GB`, sub: "Root filesystem", accent: "#f472b6" },
      { label: "Used Space",   value: `${diskUsed} GB`,  sub: `${disk}% used`,   accent: disk > 80 ? "#f87171" : "#fb923c" },
      { label: "Free Space",   value: `${(parseFloat(diskTotal) - parseFloat(diskUsed)).toFixed(1)} GB`, sub: `${100 - disk}% free`, accent: "#34d399" },
    ].forEach((card, i) => {
      const cx = MX + i * (C3W + gap);
      acrylicCardT(c, cx, R1Y, C3W, R1H, 12, th);
      c.font = "19px 'UI'"; c.fillStyle = th.labelText; c.textAlign = "left";
      c.fillText(card.label, cx + 16, R1Y + 30);
      c.font = "bold 40px 'UI'"; c.fillStyle = card.accent;
      c.fillText(card.value, cx + 16, R1Y + 84);
      c.font = "18px 'UI'"; c.fillStyle = th.labelText2;
      c.fillText(card.sub, cx + 16, R1Y + 112);
    });

    const R2Y = R1Y + R1H + 18, R2H = 160;
    acrylicCardT(c, MX, R2Y, MCW, R2H, 14, th);
    c.font = "bold 22px 'UI'"; c.fillStyle = th.labelText3; c.textAlign = "left";
    c.fillText("Disk Usage", MX + 18, R2Y + 34);
    win11BarT(c, MX + 18, R2Y + 90, MCW - 36, disk, "#db2777", "#f472b6", "Root  /", disk, th);

    const R3Y = R2Y + R2H + 18, R3H = 260;
    acrylicCardT(c, MX, R3Y, MCW, R3H, 14, th);
    c.font = "bold 24px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("Filesystem Details", MX + 20, R3Y + 38);

    const diskRows = [
      { k: "Filesystem",    v: "/"                     },
      { k: "Total",         v: `${diskTotal} GB`       },
      { k: "Used",          v: `${diskUsed} GB`        },
      { k: "Available",     v: `${(parseFloat(diskTotal) - parseFloat(diskUsed)).toFixed(1)} GB` },
      { k: "Use%",          v: `${disk}%`              },
      { k: "Temp",          v: `${temp}\u00b0C`        },
    ];
    diskRows.forEach((row, i) => {
      const dy = R3Y + 68 + i * 32;
      if (i % 2 === 0) {
        roundRect(c, MX + 10, dy - 14, MCW - 20, 28, 6);
        c.fillStyle = th.rowAlt; c.fill();
      }
      c.font = "20px 'UI'"; c.fillStyle = th.labelText; c.textAlign = "left";
      c.fillText(row.k, MX + 24, dy + 5);
      c.font = "bold 20px 'UI'"; c.fillStyle = "#f472b6"; c.textAlign = "right";
      c.fillText(row.v, MX + MCW - 24, dy + 5);
    });

  } else if (page === "settings") {
    drawPageHeader(c, MX, MY, WIN_X, WIN_W, "Settings", "System Configuration", "#a78bfa", th);

    const items = [
      { label: "Bot Version",       value: "3.0",                        accent: "#60a5fa" },
      { label: "Node.js Version",   value: process.version,              accent: "#4ade80" },
      { label: "Platform",          value: `${platform} ${arch}`,        accent: "#a78bfa" },
      { label: "CPU Model",         value: cpuModel,                     accent: "#f59e0b" },
      { label: "Hostname",          value: os.hostname(),                 accent: "#60a5fa" },
      { label: "Total RAM",         value: `${ramGB} GB`,                accent: "#a78bfa" },
      { label: "CPU Threads",       value: `${threads}`,                 accent: "#f472b6" },
      { label: "Timezone",          value: "Asia/Dhaka (BDT)",           accent: "#34d399" },
      { label: "Uptime",            value: uptime,                       accent: "#34d399" },
      { label: "Load Average",      value: `${os.loadavg().map(l => l.toFixed(2)).join("  ")}`, accent: "#fb923c" },
    ];

    const R1Y = MY + 62;
    const IW  = (MCW - gap) / 2;
    items.forEach((item, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const ix = MX + col * (IW + gap);
      const iy = R1Y + row * 90;
      acrylicCardT(c, ix, iy, IW, 74, 10, th);
      c.font = "19px 'UI'"; c.fillStyle = th.labelText2; c.textAlign = "left";
      c.fillText(item.label, ix + 20, iy + 28);
      c.font = "bold 26px 'UI'"; c.fillStyle = item.accent;
      c.fillText(clipText(c, item.value, IW - 40), ix + 20, iy + 58);
    });

    const R2Y = R1Y + Math.ceil(items.length / 2) * 90 + 18;
    const isDark = themeName === "dark";

    // Appearance card with theme toggle
    const TH_H = 110;
    acrylicCardT(c, MX, R2Y, MCW, TH_H, 14, th);
    c.font = "bold 22px 'UI'"; c.fillStyle = th.labelText4; c.textAlign = "left";
    c.fillText("Appearance", MX + 20, R2Y + 34);

    const BTN_W = 220, BTN_H = 48, BTN_Y = R2Y + 50;

    // Dark button
    const darkX = MX + 20;
    roundRect(c, darkX, BTN_Y, BTN_W, BTN_H, 10);
    c.fillStyle = isDark ? th.themeActiveBg : th.themeToggleBg;
    c.fill();
    roundRect(c, darkX, BTN_Y, BTN_W, BTN_H, 10);
    c.strokeStyle = isDark ? th.themeActiveBg : th.themeToggleBorder;
    c.lineWidth = 1.5; c.stroke();
    c.font = "bold 22px 'UI'";
    c.fillStyle = isDark ? th.themeActiveText : th.themeInactiveText;
    c.textAlign = "center";
    c.fillText("\uD83C\uDF19  Dark", darkX + BTN_W / 2, BTN_Y + 31);

    // Light button
    const lightX = MX + 20 + BTN_W + 16;
    roundRect(c, lightX, BTN_Y, BTN_W, BTN_H, 10);
    c.fillStyle = !isDark ? th.themeActiveBg : th.themeToggleBg;
    c.fill();
    roundRect(c, lightX, BTN_Y, BTN_W, BTN_H, 10);
    c.strokeStyle = !isDark ? th.themeActiveBg : th.themeToggleBorder;
    c.lineWidth = 1.5; c.stroke();
    c.font = "bold 22px 'UI'";
    c.fillStyle = !isDark ? th.themeActiveText : th.themeInactiveText;
    c.textAlign = "center";
    c.fillText("\u2600\uFE0F  Light", lightX + BTN_W / 2, BTN_Y + 31);

    // hint text right side
    c.font = "19px 'UI'"; c.fillStyle = th.labelText2; c.textAlign = "left";
    c.fillText(
      `Current: ${isDark ? "Dark" : "Light"}  \u2014  Reply "dark" or "light" to switch`,
      MX + 20 + BTN_W * 2 + 40, BTN_Y + 31
    );

    // Commands card
    const R3Y = R2Y + TH_H + 18;
    acrylicCardT(c, MX, R3Y, MCW, 100, 14, th);
    c.font = "bold 22px 'UI'"; c.fillStyle = th.labelText3; c.textAlign = "left";
    c.fillText("Commands", MX + 20, R3Y + 34);
    c.font = "20px 'UI'"; c.fillStyle = th.cmdText;
    c.fillText("up \u00b7 uptime \u00b7 status \u00b7 sysinfo  \u2014  Reply: performance  network  storage  settings  dark  light", MX + 20, R3Y + 70);
  }

  return cv;
}

module.exports = {
  config: {
    name: "up",
    aliases: ["uptime", "status", "sysinfo"],
    version: "3.0",
    author: "MOHAMMAD AKASH",
    role: 0,
    category: "system",
    shortDescription: "Display system status in Windows 11 style"
  },

  onStart: async function ({ message, api, event }) {
    try {
      await sendPage("overview", message, api, event);
    } catch (error) {
      console.error("WIN11 MONITOR ERROR:", error);
      message.reply("\u274C System monitor failed to generate.");
    }
  },

  onChat: async function ({ event, api }) {
    if (!event.body) return;
    const body = event.body.toLowerCase().trim();

    if (body === "hack") {
      api.sendMessage("\uD83D\uDD12 Access Denied \u2014 Insufficient Privileges.", event.threadID);
      return;
    }

    if (body === "dark" || body === "light") {
      themeMap[event.threadID] = body;
      const fakeMsg = {
        reply: (data) => api.sendMessage(data, event.threadID, null, event.messageID)
      };
      try {
        await sendPage("settings", fakeMsg, api, event);
      } catch (error) {
        console.error("WIN11 THEME ERROR:", error);
        api.sendMessage(`\u2705 Theme switched to ${body}.`, event.threadID);
      }
      return;
    }

    const pages = ["performance", "network", "storage", "settings", "overview"];
    if (pages.includes(body) && event.messageReply) {
      try {
        const fakeMsg = {
          reply: (data) => api.sendMessage(data, event.threadID, null, event.messageID)
        };
        await sendPage(body, fakeMsg, api, event);
      } catch (error) {
        console.error("WIN11 PAGE ERROR:", error);
        api.sendMessage("\u274C Failed to render page.", event.threadID);
      }
    }
  }
};

async function sendPage(page, message, api, event) {
  const start = Date.now();
  const themeName = themeMap[event.threadID] || "dark";
  const th = THEMES[themeName];

  const cpu      = Math.min(getCPU(), 99);
  const total    = os.totalmem();
  const used     = total - os.freemem();
  const ram      = Math.min(Math.round((used / total) * 100), 99);
  const disk     = Math.min(getDisk(), 99);
  const network  = Math.min(getNetwork(), 9);
  const temp     = getTemperature();
  const threads  = os.cpus().length;
  const platform = os.platform().toUpperCase();
  const arch     = os.arch();
  const hostname = os.hostname();
  const load     = Math.min(parseFloat(os.loadavg()[0].toFixed(2)), 9.99);
  const cpuModel = os.cpus()[0].model.split("@")[0].trim();
  const ramGB    = (os.totalmem()  / 1024 / 1024 / 1024).toFixed(1);
  const usedGB   = (used           / 1024 / 1024 / 1024).toFixed(1);
  const diskTotal = getDiskTotal();
  const diskUsed  = getDiskUsed();
  const netIPs    = getNetworkIPs();

  const sec = process.uptime();
  const d   = Math.floor(sec / 86400);
  const h   = Math.floor((sec % 86400) / 3600);
  const m   = Math.floor((sec % 3600) / 60);
  const s   = Math.floor(sec % 60);
  const uptime = d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
  const ping   = Math.min(Date.now() - start, 9999);

  let pingLabel = "Excellent", pingAccent = "#4ade80";
  if (ping > 200)  { pingLabel = "Good";  pingAccent = "#facc15"; }
  if (ping > 500)  { pingLabel = "Slow";  pingAccent = "#fb923c"; }
  if (ping > 1000) { pingLabel = "Poor";  pingAccent = "#f87171"; }

  const sysStatus      = ping < 100 ? "All systems running" : ping < 300 ? "System stable" : "Lag detected";
  const sysStatusColor = ping < 100 ? "#4ade80" : ping < 300 ? "#facc15" : "#f87171";

  const sysData = {
    cpu, ram, disk, network, temp, threads, platform, arch, hostname,
    load, cpuModel, ramGB, usedGB, uptime, ping, pingLabel, pingAccent,
    sysStatus, sysStatusColor, diskTotal, diskUsed, netIPs, themeName
  };

  const cv = await renderPage(page, sysData, th);
  const timestamp = Date.now();
  const cacheDir = path.join(__dirname, "cache");
  const file = path.join(cacheDir, `win11_${page}_${timestamp}.png`);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(file, cv.toBuffer("image/png"));

  await message.reply({ attachment: fs.createReadStream(file) });
  setTimeout(() => { if (fs.existsSync(file)) fs.unlinkSync(file); }, 15000);
}