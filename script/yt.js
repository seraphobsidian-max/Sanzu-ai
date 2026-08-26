const yts = require("yt-search");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "yt",
    aliases: ["youtube", "playyt"],
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Search and send YouTube video",
    usage: "/yt [search]"
  },

  async run({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args.length) {
      return api.sendMessage(
        "❌ Ilagay ang gusto mong hanapin.\n\nExample:\n/yt Bruno Mars It Will Rain",
        threadID,
        messageID
      );
    }

    const query = args.join(" ");

    try {
      await api.sendMessage(
        `🔎 Searching YouTube for:\n"${query}"\n\n⏳ Please wait...`,
        threadID,
        messageID
      );

      const results = await yts(query);

      if (!results.videos || !results.videos.length) {
        return api.sendMessage(
          "❌ Walang nahanap na video.",
          threadID,
          messageID
        );
      }

      const video = results.videos[0];

      const cacheDir = path.join(__dirname, "../cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const output = path.join(
        cacheDir,
        `yt_${Date.now()}.mp4`
      );

      await api.sendMessage(
        `🎬 Found:\n${video.title}\n\n📥 Downloading video...`,
        threadID
      );

      await new Promise((resolve, reject) => {
        execFile(
          "yt-dlp",
          [
            "-f",
            "mp4[height<=360]/mp4",
            "--no-playlist",
            "--max-filesize",
            "50M",
            "-o",
            output,
            video.url
          ],
          {
            maxBuffer: 1024 * 1024 * 10
          },
          (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      if (!fs.existsSync(output)) {
        throw new Error("Video file was not created.");
      }

      await api.sendMessage(
        {
          body:
            `🎬 ${video.title}\n\n` +
            `👤 ${video.author.name}\n` +
            `⏱️ ${video.timestamp}\n` +
            `🔗 ${video.url}`,
          attachment: fs.createReadStream(output)
        },
        threadID,
        messageID
      );

      // Delete temporary file
      setTimeout(() => {
        if (fs.existsSync(output)) {
          fs.unlinkSync(output);
        }
      }, 10000);

    } catch (error) {
      console.error("YT ERROR:", error);

      return api.sendMessage(
        "❌ Hindi ma-download ang video.\n\n" +
        "Possible reason:\n" +
        "• Masyadong malaki ang video\n" +
        "• Hindi available ang video\n" +
        "• Nagbago ang YouTube format\n" +
        "• Hindi naka-install ang yt-dlp",
        threadID,
        messageID
      );
    }
  }
};
