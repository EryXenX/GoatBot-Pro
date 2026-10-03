const axios = require("axios");

module.exports = {
  config: {
    name: "manga",
    aliases: ["man", "ani-manga"],
    version: "1.0",
    author: "nexo_here",
    countDown: 0,
    role: 0,
    description: "Search Manga info using AniList API",
    category: "anime",
    guide: {
      en: "{pn} [manga name] — get manga info from AniList"
    }
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) return api.sendMessage("🔍 | Please provide a manga name.", event.threadID);

    const anilistQuery = `
      query ($search: String) {
        Media(search: $search, type: MANGA) {
          title {
            romaji
            english
            native
          }
          description(asHtml: false)
          status
          chapters
          volumes
          averageScore
          genres
          siteUrl
          coverImage {
            large
          }
        }
      }
    `;

    const variables = {
      search: query
    };

    try {
      const res = await axios.post("https://graphql.anilist.co", {
        query: anilistQuery,
        variables: variables
      });

      const manga = res.data.data.Media;

      const title = manga.title.english || manga.title.romaji || manga.title.native;
      const desc = manga.description?.replace(/<br>/g, "\n").replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300) || "No description available.";
      const msg = `📖 ${title}\n\n📌 Status: ${manga.status}\n📚 Chapters: ${manga.chapters || "?"}\n📘 Volumes: ${manga.volumes || "?"}\n⭐ Score: ${manga.averageScore || "?"}/100\n🎭 Genres: ${manga.genres.join(", ")}\n\n📝 Description:\n${desc}...\n\n🔗 ${manga.siteUrl}`;

      const cover = manga.coverImage.large;

      // Download and send image with message
      const img = (await axios.get(cover, { responseType: "arraybuffer" })).data;
      const imgPath = __dirname + "/manga.jpg";
      const fs = require("fs");
      fs.writeFileSync(imgPath, Buffer.from(img, "utf-8"));

      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath));

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ | Couldn't fetch manga info. Try again or check the name.", event.threadID);
    }
  }
};