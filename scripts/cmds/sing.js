const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
const DL_API_BASE = "https://ytdl-api-xdi.onrender.com/api/dl";

async function fetchSongInfo(videoUrl) {
	const infoRes = await axios.get(DL_API_BASE, {
		params: { link: videoUrl, format: "mp3" },
		timeout: 60000
	});

	const data = infoRes.data;
	if (!data?.downloadUrl) {
		throw new Error(data?.error || "downloadUrl paoa jayni API response e");
	}
	return data;
}

async function streamDownloadToFile(dlUrl, filePath) {
	if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

	const response = await axios.get(dlUrl, {
		responseType: "stream",
		timeout: 300000,
		maxContentLength: Infinity,
		maxBodyLength: Infinity,
		headers: {
			"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"
		}
	});

	const contentType = response.headers["content-type"] || "";
	const isValid = contentType.includes("video") || contentType.includes("audio") || contentType.includes("octet-stream");

	if (!isValid) {
		let bodyText = "";
		try {
			const chunks = [];
			for await (const chunk of response.data) {
				chunks.push(chunk);
				if (Buffer.concat(chunks).length > 2000) break;
			}
			bodyText = Buffer.concat(chunks).toString("utf-8").slice(0, 500);
		} catch (_) {}

		throw new Error(
			`Invalid content received from downloadUrl (type: ${contentType})` +
			(bodyText ? ` — upstream said: "${bodyText.trim()}"` : "")
		);
	}

	const writer = fs.createWriteStream(filePath);

	await new Promise((resolve, reject) => {
		response.data.pipe(writer);
		let failed = false;
		const onError = (err) => {
			if (failed) return;
			failed = true;
			writer.close();
			fs.unlink(filePath, () => {});
			reject(err);
		};
		response.data.on("error", onError);
		writer.on("error", onError);
		writer.on("close", () => { if (!failed) resolve(); });
	});

	const stats = fs.statSync(filePath);
	if (stats.size < 1024) {
		fs.unlink(filePath, () => {});
		throw new Error(`Downloaded file too small (${stats.size} bytes) — corrupt ba failed download`);
	}
}

function extractApiErrorMessage(err) {
	const raw = err.response?.data;

	if (raw && typeof raw === "object" && !Buffer.isBuffer(raw)) {
		if (raw.error) return raw.error;
		if (raw.message) return raw.message;
	}

	if (raw) {
		try {
			const text = Buffer.isBuffer(raw) ? raw.toString("utf-8") : String(raw);
			const parsed = JSON.parse(text);
			if (parsed?.error) return parsed.error;
			if (parsed?.message) return parsed.message;
		} catch (_) {}
	}

	return err.message;
}

function tempFilePath(ext) {
	if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
	return path.join(CACHE_DIR, `sing_${Date.now()}_${Math.floor(Math.random() * 1e4)}.${ext}`);
}

async function sendWithRetry(message, msg, retries = 2) {
	for (let i = 0; i <= retries; i++) {
		try {
			return await message.reply(msg);
		} catch (err) {
			const is408 = err?.error === 408 || String(err?.message || err).includes("408");
			if (is408 && i < retries) {
				console.warn(`[sing] Upload timeout, retrying (${i + 1}/${retries})...`);
				await new Promise(r => setTimeout(r, 2000));
				continue;
			}
			throw err;
		}
	}
}

function react(api, messageID, emoji) {
	try {
		api.setMessageReaction(emoji, messageID, () => {}, true);
	} catch (_) {}
}

module.exports.config = {
	name: "sing",
	aliases: ["song"],
	version: "1.0.0",
	author: "EryXenX",
	countDown: 5,
	role: 0,
	shortDescription: "YouTube theke gaan download",
	longDescription: "Song name diye sorasori mp3 download kore pathay",
	category: "media",
	guide: {
		en: "{pn} <song name>\nExample: {pn} mann mera"
	}
};

module.exports.onStart = async function ({ api, event, args, message }) {
	const { messageID } = event;
	const query = args.join(" ").trim();

	if (!query) {
		return message.reply("❌ Song name den.\nExample: sing mann mera");
	}

	react(api, messageID, "⏳");

	let file;
	try {
		const search = await yts(query);
		const video = search.videos?.[0];
		if (!video) {
			react(api, messageID, "❌");
			return message.reply(`❌ "${query}" er kono result paoa jayni`);
		}

		const info = await fetchSongInfo(video.url);
		file = tempFilePath("mp3");
		await streamDownloadToFile(info.downloadUrl, file);

		await sendWithRetry(message, {
			body: `🎶 ${video.title}\n🕒 ${video.timestamp}`,
			attachment: fs.createReadStream(file)
		});

		react(api, messageID, "✅");
	} catch (err) {
		console.error(err);
		react(api, messageID, "❌");
		return message.reply("❌ Download failed: " + extractApiErrorMessage(err));
	} finally {
		if (file) {
			try { fs.unlinkSync(file); } catch (e) { console.error("[sing] cleanup error:", e.message); }
		}
	}
};
