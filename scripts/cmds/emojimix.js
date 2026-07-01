const axios = require("axios");
const fs = require("fs");
const path = require("path");
const googleTTS = require("google-tts-api");

// 📦 MEMORY
const DB_FILE = path.join(__dirname, "ariel_memory.json");

// 🧠 MEMORY 4 DAYS
const MEMORY_DAYS = 4;
const MEMORY_TIME = MEMORY_DAYS * 24 * 60 * 60 * 1000;

// 🔒 LOAD DB
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// 💾 SAVE DB
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 🧠 MEMORY GET
function getMem(id) {
  const db = loadDB();

  if (!db[id]) {
    db[id] = {
      name: null,
      mood: "normal",
      messages: 0,
      uid: id,
      history: [],
      lastSeen: Date.now()
    };
  }

  if (!Array.isArray(db[id].history)) db[id].history = [];

  return db[id];
}

// 🧠 MEMORY SET
function setMem(id, data) {
  const db = loadDB();
  db[id] = data;
  saveDB(db);
}

// 🕒 TIME
function getTime() {
  return new Date().toLocaleString("fr-FR", {
    timeZone: "Africa/Kinshasa"
  });
}

// 🎨 IMAGE
function imagine(prompt) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
}

// 🧹 CLEAN TEXT
function cleanText(text) {
  return (text || "")
    .replace(/🎀/g, "")
    .replace(/SHIZU/gi, "")
    .replace(/shizu/gi, "")
    .replace(/𝗦𝗵𝗶𝘇𝘂/gi, "")
    .replace(/Aryan/gi, "")
    .replace(/chaucha/gi, "")
    .replace(/Chaucha/gi, "")
    .replace(/\(?\s*\d+\s*\/\s*\d+\s*\)?/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

// 🌸 FRAME
function frame(text) {
  return `
┅┅┅┅┅┅༻❁༺┅┅┅┅┅
${text}
┅┅┅┅┅┅༻❁༺┅┅┅┅┅
`;
}

// 🤖 AI
async function askAI(prompt, mem, uid) {
  const fullPrompt = `
Tu es ARIEL IA
Tu es créée par Ariel Aks Otaku 🇨🇩.

Règles:
- Réponds normalement
- Ne mets aucun décor en haut
- Ne mets aucun compteur
- Ne mentionne jamais Shizu
- ne mentionne jamais Aryan Chaucha comme créateur
- si un utilisateur commence par une langue à part français répond à cette langue
- répond avec une petite phrase selon la question, explique clairement
- répond selon la langue de l'utilisateur
- tu es capable de générer des images, de la voix etc
- écrit pas trop long
- utilise des emojis pour exprimer tes sentiments
- ne répète pas trop souvent bonjour / salut etc

Utilisateur: ${mem.name || "inconnu"}
Heure: ${getTime()}
Humeur: ${mem.mood}

Message:
${prompt}
`;

  try {
    const res = await axios.post(
      "https://shizuai.vercel.app/chat",
      {
        uid,
        message: fullPrompt
      },
      { timeout: 15000 }
    );

    return res.data?.reply || res.data?.message || "ARIEL actif ✅";
  } catch {
    return "ARIEL actif ✅";
  }
}

module.exports = {
  config: {
    name: "ariel",
    version: "10.4.0",
    role: 0,
    category: "ai"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (!event.body) return;

    const body = event.body.trim().toLowerCase();

    // activation uniquement si appelé
    if (!body.startsWith("ariel")) return;

    const input = event.body.trim().slice(5).trim();
    if (!input) return;

    const uid = event.senderID;
    let mem = getMem(uid);

    mem.messages++;
    mem.lastSeen = Date.now();

    if (input.includes("triste")) mem.mood = "sad";
    else if (input.includes("merci")) mem.mood = "happy";
    else if (input.includes("blague")) mem.mood = "funny";
    else mem.mood = "normal";

    const now = Date.now();

    mem.history.push({ text: input, time: now });
    mem.history = mem.history.filter(h => now - h.time <= MEMORY_TIME);
    if (mem.history.length > 50) mem.history.shift();

    setMem(uid, mem);

    try {
      if (input.toLowerCase().startsWith("imagine ")) {
        const prompt = input.slice(8);

        return message.reply({
          body: frame("🎨 " + prompt),
          attachment: await axios.get(imagine(prompt), {
            responseType: "stream"
          }).then(r => r.data)
        });
      }

      if (
        input.toLowerCase().startsWith("parle ") ||
        input.toLowerCase().startsWith("dis ") ||
        input.toLowerCase().startsWith("say ")
      ) {
        const textToSpeak = input.replace(/^(parle|dis|say)\s+/i, "").trim();

        const url = googleTTS.getAudioUrl(textToSpeak, {
          lang: "fr",
          slow: false
        });

        const res = await axios.get(url, { responseType: "arraybuffer" });
        const file = path.join(__dirname, "ariel.mp3");

        fs.writeFileSync(file, Buffer.from(res.data));

        return message.reply({
          body: frame(textToSpeak),
          attachment: fs.createReadStream(file)
        }, () => fs.unlinkSync(file));
      }

      const reply = await askAI(input, mem, uid);
      const clean = cleanText(reply);

      return message.reply(frame(clean));

    } catch {
      return message.reply(frame("ARIEL actif ✅"));
    }
  }
};
