const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API = "https://eryxenx.agi.bd/api/tiktoksearch?keyword=";
const DL_API = "https://eryxenx.agi.bd/api/alldl?url=";
const CACHE = path.join(__dirname, "tiktok_cache");
const LINE = "━━━━━━━━━━━━━━━━━━";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Referer: "https://www.tiktok.com/"
};

function fmt(n) {
  n = Number(n) || 0;
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function dur(s) {
  s = Number(s) || 0;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
}

function react(api, emoji, messageID) {
  if (!messageID) return;
  try {
    api.setMessageReaction(emoji, messageID, () => {}, true);
  } catch (_) {}
}

async function stream(url) {
  const res = await axios({
    url,
    responseType: "stream",
    timeout: 180000,
    headers: HEADERS
  });
  return res.data;
}

async function saveTo(file, url, headers) {
  const res = await axios({
    url,
    responseType: "stream",
    timeout: 300000,
    headers,
    maxRedirects: 5
  });

  const w = fs.createWriteStream(file);
  res.data.pipe(w);

  await new Promise((resolve, reject) => {
    w.on("finish", resolve);
    w.on("error", reject);
    res.data.on("error", reject);
  });

  const size = fs.statSync(file).size;
  if (size < 50 * 1024) {
    fs.unlinkSync(file);
    throw new Error("File too small: " + size + " bytes");
  }
}

async function downloadVideo(video, file) {
  const pageUrl = `https://www.tiktok.com/@${video.author.unique_id}/video/${video.id}`;

  const attempts = [
    () => saveTo(file, video.videoUrl, HEADERS),
    () => saveTo(file, video.videoUrl, {}),
    () => saveTo(file, video.wmVideoUrl, HEADERS),
    () => saveTo(file, DL_API + encodeURIComponent(pageUrl), {})
  ];

  let lastErr = null;
  for (const run of attempts) {
    try {
      await run();
      return;
    } catch (e) {
      lastErr = e;
      console.error(
        "[tiktok] download attempt failed:",
        e.response ? "HTTP " + e.response.status : e.message
      );
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (_) {}
    }
  }
  throw lastErr || new Error("All download attempts failed");
}

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["tt"],
    version: "3.0.0",
    author: "EryXenX",
    role: 0,
    countDown: 5,
    category: "media",
    description: {
      en: "Search & download TikTok video"
    },
    guide: {
      en: "{pn} <keyword>"
    }
  },

  onStart: async function ({ api, event, args, commandName }) {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage(
        "❌ Please provide a keyword.\nExample: tiktok funny cat",
        event.threadID,
        event.messageID
      );
    }

    react(api, "⏳", event.messageID);

    try {
      const res = await axios.get(API + encodeURIComponent(query) + "&count=6", {
        timeout: 60000
      });

      const list = res.data && res.data.status ? res.data.results : [];
      const results = (list || []).slice(0, 6);

      if (!results.length) {
        react(api, "❌", event.messageID);
        return api.sendMessage("❌ No videos found.", event.threadID);
      }

      let body = `🎵 TikTok Search: ${query}\n${LINE}\n\n`;
      const imgs = [];

      results.forEach((v, i) => {
        body += `${i + 1}. ${(v.title || "No title").replace(/\s+/g, " ").trim().slice(0, 55)}\n`;
        body += `    👤 @${v.author.unique_id}  •  ⏱ ${dur(v.duration)}\n`;
        body += `    ❤️ ${fmt(v.stats.digg_count)}  👁 ${fmt(v.stats.play_count)}\n\n`;
        if (v.cover) imgs.push(stream(v.cover).catch(() => null));
      });

      body += `${LINE}\n📥 Reply with a number (1-${results.length}) to download`;

      const atts = (await Promise.all(imgs)).filter(Boolean);

      api.sendMessage(
        { body, attachment: atts },
        event.threadID,
        (err, info) => {
          if (err) {
            react(api, "❌", event.messageID);
            return;
          }

          react(api, "🎵", event.messageID);

          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            author: event.senderID,
            messageID: info.messageID,
            results
          });
        }
      );
    } catch (e) {
      console.error("[tiktok] search failed:", e.message);
      react(api, "❌", event.messageID);
      api.sendMessage("❌ API error. Please try again later.", event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const choose = parseInt(event.body);
    if (isNaN(choose)) return;

    const { results, messageID } = Reply;
    if (choose < 1 || choose > results.length) {
      return api.sendMessage(
        `❌ Invalid number. Choose between 1 and ${results.length}.`,
        event.threadID,
        event.messageID
      );
    }

    const video = results[choose - 1];
    await fs.ensureDir(CACHE);

    const title = (video.title || "TikTok Video").replace(/\s+/g, " ").trim();
    const name = title.slice(0, 25).replace(/[^a-z0-9]/gi, "_") || "video";
    const file = path.join(CACHE, `${Date.now()}_${name}.mp4`);

    react(api, "⏳", event.messageID);

    try {
      await downloadVideo(video, file);

      api.sendMessage(
        {
          body:
            `✅ Done!\n${LINE}\n` +
            `🎬 ${title.slice(0, 80)}\n` +
            `👤 ${video.author.nickname} (@${video.author.unique_id})\n` +
            `⏱ ${dur(video.duration)}  •  ❤️ ${fmt(video.stats.digg_count)}  •  👁 ${fmt(video.stats.play_count)}`,
          attachment: fs.createReadStream(file)
        },
        event.threadID,
        async (err) => {
          try {
            fs.unlinkSync(file);
          } catch (_) {}

          if (err) {
            react(api, "❌", event.messageID);
            return;
          }

          react(api, "✅", event.messageID);

          try {
            if (messageID) await api.unsendMessage(messageID);
          } catch (_) {}
        }
      );
    } catch (e) {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (_) {}
      react(api, "❌", event.messageID);
      api.sendMessage("❌ Download failed. Please try again.", event.threadID);
    }
  }
};
