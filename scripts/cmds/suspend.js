"use strict";
const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const { loadImage, createCanvas } = require("canvas");

const TEMPLATE_URL = "https://i.ibb.co.com/5NTNZZW/1789528159120.png";

const REF_W = 737;
const COVER_SLOT_REF = { x: 0, y: 148, w: 737, h: 266 };
const AVATAR_CIRCLE_REF = { cx: 152, cy: 368, r: 120 };
const HEADER_NAME_Y_REF = 100;
const BIG_NAME_Y_REF = 549;
const BIG_NAME_X_REF = 26;
const HEADER_FONT_REF = 33;
const BIG_FONT_REF = 39;
const BG_FILL = "#808080";
const DEBUG_CALIBRATE = false;

module.exports = {
	config: {
		name: "suspend",
		version: "3.0.0",
		author: "EryXenX",
		countDown: 5,
		role: 0,
		description: {
			en: "Prank: shows the mentioned/replied user's profile as unavailable",
			bn: "Prank: mention/reply kora user er profile 'content isn't available' dekhabe"
		},
		category: "fun",
		guide: {
			en: "{pn} @mention or reply to a message"
		}
	},

	langs: {
		en: { noMention: "❌ | Mention someone or reply to a message!", error: "❌ | Failed to generate. Try again." },
		bn: { noMention: "❌ | কাউকে mention করুন বা reply করুন!", error: "❌ | তৈরি করতে সমস্যা হয়েছে।" }
	},

	onStart: async function ({ event, message, getLang, usersData, args, api }) {
		try {
			const targetID = Object.keys(event.mentions)[0]
				|| (event.messageReply ? event.messageReply.senderID : null)
				|| (args[0] && /^\d+$/.test(args[0]) ? args[0] : null)
				|| event.senderID;

			const targetName = (await usersData.getName(targetID).catch(() => null)) || "Unknown User";

			const ts = Date.now();
			const avtPath = __dirname + "/cache/suspend_avt_" + ts + ".jpg";
			const coverPath = __dirname + "/cache/suspend_cover_" + ts + ".jpg";
			const outputPath = __dirname + "/cache/suspend_out_" + ts + ".png";

			const profilePicUrl = "https://graph.facebook.com/" + targetID + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
			const cookieStr = typeof api.getCookies === "function" ? api.getCookies() : null;

			let coverUrl = null;
			if (cookieStr) {
				try {
					coverUrl = await fetchViaMbasic(targetID, cookieStr);
					console.log("[suspend] fetchViaMbasic:", coverUrl ? "OK" : "no result");
				} catch (e) { console.log("[suspend] fetchViaMbasic failed:", e.message); }
			}
			if (!coverUrl && cookieStr) {
				try {
					coverUrl = await fetchCoverAlbum(targetID, cookieStr);
					console.log("[suspend] fetchCoverAlbum:", coverUrl ? "OK" : "no result");
				} catch (e) { console.log("[suspend] fetchCoverAlbum failed:", e.message); }
			}

			const [avatarBuffer, templateRes] = await Promise.all([
				downloadImage(profilePicUrl, cookieStr),
				axios.get(TEMPLATE_URL, { responseType: "arraybuffer" })
			]);
			fs.writeFileSync(avtPath, avatarBuffer);
			const rawAvatar = await loadImage(avtPath);
			const avatar = autoCropPadding(rawAvatar);
			const template = await loadImage(Buffer.from(templateRes.data));
			console.log("[suspend] template size:", template.width, "x", template.height, "| avatar size:", avatar.width, "x", avatar.height);

			let coverImg = avatar;
			if (coverUrl) {
				try {
					const coverBuffer = await downloadImage(coverUrl, cookieStr);
					if (coverBuffer && coverBuffer.length > 500) {
						fs.writeFileSync(coverPath, coverBuffer);
						coverImg = await loadImage(coverPath);
					}
				} catch (_) {}
			}

			const canvas = createCanvas(template.width, template.height);
			const ctx = canvas.getContext("2d");

			const scale = template.width / REF_W;
			const COVER_SLOT = {
				x: COVER_SLOT_REF.x * scale,
				y: COVER_SLOT_REF.y * scale,
				w: COVER_SLOT_REF.w * scale,
				h: COVER_SLOT_REF.h * scale
			};
			const avCx = AVATAR_CIRCLE_REF.cx * scale;
			const avCy = AVATAR_CIRCLE_REF.cy * scale;
			const avR = AVATAR_CIRCLE_REF.r * scale;
			const HEADER_NAME_Y = HEADER_NAME_Y_REF * scale;
			const BIG_NAME_Y = BIG_NAME_Y_REF * scale;
			const BIG_NAME_X = BIG_NAME_X_REF * scale;
			const headerFontSize = Math.round(HEADER_FONT_REF * scale);
			const bigFontSize = Math.round(BIG_FONT_REF * scale);

			ctx.fillStyle = BG_FILL;
			ctx.fillRect(0, 0, template.width, template.height);

			ctx.save();
			ctx.beginPath();
			ctx.rect(COVER_SLOT.x, COVER_SLOT.y, COVER_SLOT.w, COVER_SLOT.h);
			ctx.clip();
			drawCoverImage(ctx, coverImg, COVER_SLOT.x, COVER_SLOT.y, COVER_SLOT.w, COVER_SLOT.h);
			ctx.restore();

			ctx.save();
			ctx.beginPath();
			ctx.arc(avCx, avCy, avR, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			drawCoverImage(ctx, avatar, avCx - avR, avCy - avR, avR * 2, avR * 2);
			ctx.restore();

			ctx.drawImage(template, 0, 0, template.width, template.height);

			if (DEBUG_CALIBRATE) {
				ctx.save();
				ctx.strokeStyle = "#ff0000";
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.arc(avCx, avCy, avR, 0, Math.PI * 2);
				ctx.stroke();
				ctx.restore();
			}

			ctx.textAlign = "center";
			ctx.fillStyle = "#050505";
			ctx.font = `bold ${headerFontSize}px Sans`;
			ctx.fillText(targetName, template.width / 2, HEADER_NAME_Y);

			ctx.textAlign = "left";
			ctx.font = `bold ${bigFontSize}px Sans`;
			ctx.fillText(targetName, BIG_NAME_X, BIG_NAME_Y);

			fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));

			await message.reply({ attachment: fs.createReadStream(outputPath) });

			[avtPath, coverPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

		} catch (err) {
			console.error("Suspend Error:", err);
			message.reply(getLang("error"));
		}
	}
};

function autoCropPadding(img, tolerance = 24) {
	const off = createCanvas(img.width, img.height);
	const octx = off.getContext("2d");
	octx.drawImage(img, 0, 0);
	const { data, width, height } = octx.getImageData(0, 0, img.width, img.height);

	function colorAt(x, y) {
		const i = (y * width + x) * 4;
		return [data[i], data[i + 1], data[i + 2]];
	}
	function closeColor(a, b) {
		return Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance && Math.abs(a[2] - b[2]) <= tolerance;
	}
	function rowIsBorder(y, ref) {
		const step = Math.max(1, Math.floor(width / 60));
		for (let x = 0; x < width; x += step) {
			if (!closeColor(colorAt(x, y), ref)) return false;
		}
		return true;
	}
	function colIsBorder(x, ref) {
		const step = Math.max(1, Math.floor(height / 60));
		for (let y = 0; y < height; y += step) {
			if (!closeColor(colorAt(x, y), ref)) return false;
		}
		return true;
	}

	const ref = colorAt(0, 0);
	let top = 0, bottom = height - 1, left = 0, right = width - 1;
	const maxTrim = Math.floor(Math.min(width, height) * 0.35);

	let trimmed = 0;
	while (top < bottom && rowIsBorder(top, ref) && trimmed < maxTrim) { top++; trimmed++; }
	trimmed = 0;
	while (bottom > top && rowIsBorder(bottom, ref) && trimmed < maxTrim) { bottom--; trimmed++; }
	trimmed = 0;
	while (left < right && colIsBorder(left, ref) && trimmed < maxTrim) { left++; trimmed++; }
	trimmed = 0;
	while (right > left && colIsBorder(right, ref) && trimmed < maxTrim) { right--; trimmed++; }

	const cw = right - left + 1;
	const ch = bottom - top + 1;
	if (cw <= 0 || ch <= 0 || (cw === width && ch === height)) return img;

	const cropped = createCanvas(cw, ch);
	const cctx = cropped.getContext("2d");
	cctx.drawImage(off, left, top, cw, ch, 0, 0, cw, ch);
	return cropped;
}

function drawCoverImage(ctx, img, x, y, w, h) {
	const scale = Math.max(w / img.width, h / img.height);
	const dw = img.width * scale;
	const dh = img.height * scale;
	const dx = x + (w - dw) / 2;
	const dy = y + (h - dh) / 2;
	ctx.drawImage(img, dx, dy, dw, dh);
}

async function fetchViaMbasic(uid, cookieStr) {
	const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
	const headers = {
		cookie: cookieStr,
		"user-agent": UA,
		"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"accept-language": "en-US,en;q=0.9",
		"upgrade-insecure-requests": "1",
		"sec-fetch-dest": "document",
		"sec-fetch-mode": "navigate",
		"sec-fetch-site": "none",
	};
	for (const url of [
		`https://www.facebook.com/profile.php?id=${uid}`,
		`https://www.facebook.com/profile.php?id=${uid}&sk=about`,
	]) {
		try {
			const res = await axios.get(url, { headers, timeout: 20000, maxRedirects: 5 });
			if (res.status === 200 && res.data?.length > 5000) {
				const found = extractCoverFromHtml(res.data);
				if (found?.url) return found.url;
			}
		} catch (_) {}
	}
	try {
		const mHeaders = { ...headers, "user-agent": "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36" };
		const res = await axios.get(`https://mbasic.facebook.com/profile.php?id=${uid}`, {
			headers: mHeaders, timeout: 15000, maxRedirects: 10,
		});
		return extractCoverFromHtml(res.data || "")?.url || null;
	} catch (_) { return null; }
}

async function fetchCoverAlbum(uid, cookieStr) {
	const headers = {
		cookie: cookieStr,
		"accept": "text/html,application/xhtml+xml",
		"accept-language": "en-US,en;q=0.9",
		"user-agent": "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
	};
	try {
		const res = await axios.get(`https://mbasic.facebook.com/media/albums/?id=${uid}`, { headers, timeout: 15000, maxRedirects: 10 });
		const html = res.data || "";
		if (!html) return null;
		const albumMatch = html.match(/href="([^"]*cover[^"]*album[^"]*|[^"]*album[^"]*cover[^"]*)"/i);
		if (!albumMatch) return null;
		const albumUrl = "https://mbasic.facebook.com" + albumMatch[1].replace(/&amp;/g, "&");
		const res2 = await axios.get(albumUrl, { headers, timeout: 15000, maxRedirects: 10 });
		return extractCoverFromHtml(res2.data || "")?.url || null;
	} catch (_) { return null; }
}

function extractCoverFromHtml(html) {
	if (!html) return null;
	const r1 = extractCoverFromJsonText(html);
	if (r1) return { url: r1 };

	try {
		const $ = cheerio.load(html);
		const coverImg = $('img[data-imgperflogname="profileCoverPhoto"]').first();
		if (coverImg.length) {
			const src = coverImg.attr("src");
			if (src && src.startsWith("http")) return { url: src.replace(/&amp;/g, "&") };
		}
		const containerImg = $("#profile_cover_photo_container img").first();
		if (containerImg.length) {
			const src = containerImg.attr("src");
			if (src && src.startsWith("http")) return { url: src.replace(/&amp;/g, "&") };
		}
	} catch (_) {}

	const boxMatch = html.match(/id="profile_cover_photo_container"[^>]*>[\s\S]{0,500}?<img[^>]+src="([^"]+)"/);
	if (boxMatch) return { url: boxMatch[1].replace(/&amp;/g, "&") };

	const linkRe = /https:\/\/(?:scontent|lookaside)\.[^"'<>\s]+/g;
	const found = [];
	let m;
	while ((m = linkRe.exec(html)) !== null) {
		const u = m[0].replace(/&amp;/g, "&");
		if (!u.includes("s160x160") && !u.includes("s40x40") && !u.includes("cp0_dst-jpg"))
			found.push(u);
	}
	const bySid = found.find(u => u.includes("_nc_sid=cc71e4"));
	if (bySid) return { url: bySid };
	const big = found.find(u => u.includes("_s720x720") || u.includes("1500x") || u.includes("t39.30808"));
	if (big) return { url: big };
	if (found[0]) return { url: found[0] };

	return null;
}

function extractCoverFromJsonText(text) {
	if (!text) return null;
	const patterns = [
		/"coverPhoto"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/,
		/"cover_photo"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/,
		/"cover"\s*:\s*\{[^}]*"source"\s*:\s*"([^"]+)"/,
		/"cover"\s*:\s*\{"uri"\s*:\s*"([^"]+)"/,
		/"cover_image"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/,
		/"CoverPhoto"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/,
		/"full_screen_image"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/,
		/"coverPhoto"\s*:\s*"(https:[^"]+)"/,
	];
	for (const re of patterns) {
		const m = re.exec(text);
		if (m) {
			return m[1]
				.replace(/\\u0026/g, "&")
				.replace(/\\u002F/g, "/")
				.replace(/\\\//g, "/")
				.replace(/\\/g, "")
				.trim();
		}
	}
	return null;
}

async function downloadImage(url, cookieStr) {
	const headers = {
		"accept": "image/webp,image/apng,image/*,*/*;q=0.8",
		"referer": "https://www.facebook.com/",
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
		...(cookieStr ? { cookie: cookieStr } : {}),
	};
	const res = await axios.get(url, {
		responseType: "arraybuffer",
		timeout: 20000,
		maxRedirects: 5,
		headers,
	});
	return Buffer.from(res.data);
}
