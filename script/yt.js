const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const util = require("util");

const execFileAsync = util.promisify(execFile);

module.exports = {
  config: {
    name: "yt",
    aliases: ["youtube", "ytdl"],
    version: "2.0.0",
    role: 0,
    hasPrefix: true,
    description: "Download YouTube videos",
    usage: "/yt <YouTube URL>",
    credits: "sinzu",
    cooldown: 10
  },

  run: async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    if (!args[0]) {
      return api.sendMessage(
        "❌ Usage:\n/yt <YouTube URL>\n\nExample:\n/yt https://youtube.com/watch?v=xxxx",
        threadID,
        messageID
      );
    }

    const url = args[0];

    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      return api.sendMessage(
        "❌ Invalid YouTube URL.",
        threadID,
        messageID
      );
    }

    const tempDir = path.join(__dirname, "../temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const output = path.join(
      tempDir,
      `yt_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`
    );

    try {
      await api.sendMessage(
        "⏳ Downloading YouTube video...\n\nPlease wait.",
        threadID
      );

      // Check yt-dlp
      let ytdlp = "yt-dlp";

      try {
        await execFileAsync("yt-dlp", ["--version"]);
      } catch {
        // Try Python module
        try {
          await execFileAsync("python", ["-m", "yt_dlp", "--version"]);
          ytdlp = "python";
        } catch {
          return api.sendMessage(
            "❌ yt-dlp is not installed.\n\nInstall it using:\n\npip install -U yt-dlp",
            threadID,
            messageID
          );
        }
      }

      let commandArgs;

      if (ytdlp === "python") {
        commandArgs = [
          "-m",
          "yt_dlp",
          "-f",
          "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
          "--merge-output-format",
          "mp4",
          "--no-playlist",
          "--max-filesize",
          "50M",
          "-o",
          output,
          url
        ];
      } else {
        commandArgs = [
          "-f",
          "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
          "--merge-output-format",
          "mp4",
          "--no-playlist",
          "--max-filesize",
          "50M",
          "-o",
          output,
          url
        ];
      }

      try {
        await execFileAsync(ytdlp, commandArgs, {
          timeout: 180000,
          maxBuffer: 10 * 1024 * 1024
        });
      } catch (err) {
        let error = err.stderr || err.stdout || err.message || "";

        if (error.includes("Sign in")) {
          error = "YouTube requires sign-in for this video.";
        } else if (error.includes("Private video")) {
          error = "The video is private.";
        } else if (error.includes("Video unavailable")) {
          error = "The video is unavailable.";
        } else if (
          error.includes("File is larger than max-filesize")
        ) {
          error = "The video is larger than the 50MB limit.";
        } else if (error.includes("Unsupported URL")) {
          error = "Unsupported or invalid YouTube URL.";
        } else if (error.includes("ffmpeg")) {
          error = "FFmpeg is missing. Install it using: pkg install ffmpeg -y";
        } else {
          error = error.slice(-1500);
        }

        throw new Error(error);
      }

      if (!fs.existsSync(output)) {
        throw new Error(
          "Download finished but the output video was not found."
        );
      }

      const stats = fs.statSync(output);

      if (stats.size === 0) {
        throw new Error("Downloaded file is empty.");
      }

      // Messenger attachment limit protection
      if (stats.size > 50 * 1024 * 1024) {
        fs.unlinkSync(output);

        return api.sendMessage(
          "❌ Hindi ma-send ang video.\n\n" +
          "📦 File size is larger than 50MB.",
          threadID,
          messageID
        );
      }

      await api.sendMessage(
        {
          body: "✅ YouTube video downloaded!",
          attachment: fs.createReadStream(output)
        },
        threadID,
        messageID
      );

      // Cleanup
      setTimeout(() => {
        try {
          if (fs.existsSync(output)) {
            fs.unlinkSync(output);
          }
        } catch {}
      }, 10000);

    } catch (error) {
      console.error("[YT ERROR]", error);

      if (fs.existsSync(output)) {
        try {
          fs.unlinkSync(output);
        } catch {}
      }

      return api.sendMessage(
        "❌ Hindi ma-download ang video.\n\n" +
        "🔎 Error:\n" +
        `${error.message || "Unknown error"}\n\n` +
        "Possible fix:\n" +
        "• Update yt-dlp: pip install -U yt-dlp\n" +
        "• Install FFmpeg: pkg install ffmpeg -y\n" +
        "• Check kung available ang video\n" +
        "• Try another YouTube URL",
        threadID,
        messageID
      );
    }
  }
};
