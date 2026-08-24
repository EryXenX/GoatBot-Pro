const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "flux",
    aliases: [],
    version: "5.0",
    author: "nexo_here",
    countDown: 5,
    role: 0,
    shortDescription: "Generate ultra-realistic AI images with advanced style options",
    longDescription: "Use Flux API to generate premium, hyper-realistic AI images with customizable styles and options",
    category: "AI-IMAGE",
    guide: {
      en: `{pn} <prompt> | [style]\n\n📌 Example:\n{pn} a lion in desert | realistic\n{pn} warrior girl with sword | anime\n{pn} cybernetic dragon flying | cyberpunk`
    }
  },

  langs: {
    en: {
      noPrompt: `❗ Please provide a prompt.\n\n📌 Example:\n• flux a lion in jungle | realistic\n• flux dragon on rooftop | fantasy`,
      generating: "🖼️ Generating your premium AI image...",
      failed: "❌ Failed to generate image. Please try again later.",
      invalidStyle: "⚠️ Unknown style provided! Using your prompt as is."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("noPrompt"));

    const input = args.join(" ").split("|");
    const rawPrompt = input[0].trim();
    let style = input[1]?.trim().toLowerCase() || "";

    // অনেক উন্নত স্টাইল ম্যাপ (AI image gen এর জন্য জনপ্রিয় ট্যাগসহ)
    const styleMap = {
      realistic: "photorealistic, ultra-detailed, 8K UHD, DSLR quality, natural lighting, depth of field",
      anime: "anime style, vibrant colors, sharp lines, cel shading, highly detailed character art",
      fantasy: "fantasy art, epic background, magical aura, dramatic lighting, mythical creatures",
      cyberpunk: "cyberpunk, neon lights, futuristic cityscape, dark atmosphere, high tech details",
      cartoon: "cartoon style, bold outlines, bright colors, 2D animation look, fun and playful",
      "digital art": "digital painting, smooth brush strokes, vivid colors, high detail",
      "oil painting": "oil painting style, textured brush strokes, classical art, warm tones",
      "photography": "professional photography, natural light, sharp focus, realistic",
      "low poly": "low poly art style, geometric shapes, minimalistic, vibrant colors",
      "pixel art": "pixel art style, retro gaming, 8-bit colors, sharp edges",
      "surrealism": "surrealistic art, dreamlike scenes, abstract, vivid imagination",
      "vaporwave": "vaporwave style, pastel colors, retro-futuristic, glitch art",
      "concept art": "concept art, detailed environment, mood lighting, cinematic",
      "portrait": "portrait photography, close-up, high detail, studio lighting",
      "macro": "macro photography, extreme close-up, detailed textures, shallow depth of field"
    };

    // যদি style থাকে, সেটি styleMap থেকে নিবো, অন্যথায় rawPrompt ব্যবহার করবো
    let finalPrompt;
    if (style) {
      if (styleMap[style]) {
        finalPrompt = `${rawPrompt}, ${styleMap[style]}`;
      } else {
        // Unknown style দিলে শুধু rawPrompt নিবে এবং ইউজারকে জানাবে
        finalPrompt = rawPrompt;
        message.reply(getLang("invalidStyle"));
      }
    } else {
      finalPrompt = rawPrompt;
    }

    message.reply(getLang("generating"));

    try {
      const res = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/flux?prompt=${encodeURIComponent(finalPrompt)}`);
      const imageUrl = res?.data?.data?.imageUrl;

      if (!imageUrl) return message.reply(getLang("failed"));

      const imgStream = await axios.get(imageUrl, { responseType: "stream" });
      const filePath = `${__dirname}/cache/flux_${Date.now()}.jpg`;
      const writer = fs.createWriteStream(filePath);

      imgStream.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({
          body: `🧠 Prompt: ${rawPrompt}${style ? `\n🎨 Style: ${style}` : ""}`,
          attachment: fs.createReadStream(filePath)
        }, () => fs.unlinkSync(filePath));
      });

      writer.on("error", () => {
        message.reply(getLang("failed"));
      });

    } catch (err) {
      console.error(err.message);
      return message.reply(getLang("failed"));
    }
  }
};
