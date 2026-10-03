const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

const TEMPLATE_URL = "https://i.ibb.co.com/0z785M6/Picsart-26-09-09-06-29-31-062.png";
const TOP_SLOT = { x: 0, y: 0, w: 394, h: 419 };

module.exports = {
	config: {
		name: "relation",
		aliases: ["meyera"],
		version: "1.0.0",
		author: "EryXenX",
		countDown: 5,
		role: 0,
		description: {
			en: "Funny meme with a mentioned or replied user's avatar as the top photo",
			bn: "Mention/reply kora user er avatar upore boshiye funny meme"
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

	onStart: async function ({ event, message, getLang, args }) {
		try {
			const targetID = Object.keys(event.mentions)[0]
				|| (event.messageReply ? event.messageReply.senderID : null)
				|| (args[0] && /^\d+$/.test(args[0]) ? args[0] : null)
				|| event.senderID;

			const ts = Date.now();
			const avtPath = __dirname + "/cache/relation_avt_" + ts + ".jpg";
			const outputPath = __dirname + "/cache/relation_out_" + ts + ".png";

			const [avatarRes, templateRes] = await Promise.all([
				axios.get("https://graph.facebook.com/" + targetID + "/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", { responseType: "arraybuffer" }),
				axios.get(TEMPLATE_URL, { responseType: "arraybuffer" })
			]);

			fs.writeFileSync(avtPath, Buffer.from(avatarRes.data));

			const avatar = await loadImage(avtPath);
			const template = await loadImage(Buffer.from(templateRes.data));

			const canvas = createCanvas(template.width, template.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(template, 0, 0, template.width, template.height);

			ctx.save();
			ctx.beginPath();
			ctx.rect(TOP_SLOT.x, TOP_SLOT.y, TOP_SLOT.w, TOP_SLOT.h);
			ctx.clip();
			drawCoverImage(ctx, avatar, TOP_SLOT.x, TOP_SLOT.y, TOP_SLOT.w, TOP_SLOT.h);
			ctx.restore();

			fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));

			await message.reply({ attachment: fs.createReadStream(outputPath) });

			[avtPath, outputPath].forEach(p => { try { fs.unlinkSync(p); } catch (_) {} });

		} catch (err) {
			console.error("Relation Error:", err);
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
