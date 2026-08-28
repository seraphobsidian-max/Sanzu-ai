const fs = require("fs");
const os = require("os");
const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");

module.exports.config = {
  name: "animepfp",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Gumawa ng random anime pfp na may nakalagay na pangalan o custom text",
  usePrefix: true,
  commandCategory: "Fun",
  usages: "/animepfp — gagamit ng Facebook name mo\n/animepfp <custom text> — gagamit ng sarili mong text",
  cooldowns: 5
};

// Pwede kang magdagdag pa ng ibang endpoint dito para hindi paulit-ulit
// ang parehong image source.
const ANIME_IMAGE_APIS = [
  "https://api.waifu.pics/sfw/waifu",
  "https://api.waifu.pics/sfw/neko"
];

async function fetchRandomAnimeImageBuffer() {
  const apiUrl = ANIME_IMAGE_APIS[Math.floor(Math.random() * ANIME_IMAGE_APIS.length)];
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`Anime image API failed: ${res.status}`);
  const { url } = await res.json();

  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
  const arrayBuffer = await imgRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/** Kunin ang display name ng user galing sa Facebook, safe kahit anong tawag style ng api.getUserInfo. */
function getUserName(api, userID) {
  return new Promise((resolve) => {
    try {
      const maybePromise = api.getUserInfo(userID, (err, ret) => {
        if (err || !ret || !ret[userID]) return resolve("Unknown User");
        resolve(ret[userID].name || "Unknown User");
      });
      // kung Promise-based pala ang bersyon ng ws3-fca mo (walang error sa callback style)
      if (maybePromise && typeof maybePromise.then === "function") {
        maybePromise
          .then((ret) => resolve(ret?.[userID]?.name || "Unknown User"))
          .catch(() => resolve("Unknown User"));
      }
    } catch {
      resolve("Unknown User");
    }
  });
}

/** I-shrink ang font size hanggang kumasya ang text sa loob ng maxWidth. */
function fitFontSize(ctx, text, maxWidth, startSize) {
  let size = startSize;
  ctx.font = `bold ${size}px sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 2;
    ctx.font = `bold ${size}px sans-serif`;
  }
  return size;
}

async function buildPfpImage(imageBuffer, displayText) {
  const SIZE = 800;
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");

  const img = await loadImage(imageBuffer);

  // "cover" fit — punuin ang buong canvas nang hindi nadidistort ang image
  const scale = Math.max(SIZE / img.width, SIZE / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = (SIZE - drawW) / 2;
  const dy = (SIZE - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);

  // Gradient banner sa ibaba para babasahin ang text kahit maliwanag ang background
  const bannerHeight = 170;
  const gradient = ctx.createLinearGradient(0, SIZE - bannerHeight, 0, SIZE);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, SIZE - bannerHeight, SIZE, bannerHeight);

  // Text (pangalan / custom text)
  const maxTextWidth = SIZE - 80;
  const fontSize = fitFontSize(ctx, displayText, maxTextWidth, 56);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  ctx.fillStyle = "#ffffff";

  const textY = SIZE - bannerHeight / 2 - 5;
  ctx.strokeText(displayText, SIZE / 2, textY);
  ctx.fillText(displayText, SIZE / 2, textY);

  // Maliit na subtext/watermark
  ctx.font = "22px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText("Sanzu Anime PFP", SIZE / 2, SIZE - 28);

  return canvas.toBuffer("image/png");
}

function safeSend(api, payload, threadID, messageID) {
  try {
    const result = api.sendMessage(payload, threadID, messageID);
    if (result && typeof result.catch === "function") {
      result.catch((err) => console.error("[animepfp] sendMessage error:", err?.message || err));
    }
  } catch (err) {
    console.error("[animepfp] sendMessage error:", err?.message || err);
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  let tempPath;
  try {
    const customText = args.join(" ").trim();
    const displayText = customText || (await getUserName(api, senderID));

    const [imageBuffer] = await Promise.all([fetchRandomAnimeImageBuffer()]);
    const pngBuffer = await buildPfpImage(imageBuffer, displayText);

    tempPath = path.join(os.tmpdir(), `animepfp_${senderID}_${Date.now()}.png`);
    fs.writeFileSync(tempPath, pngBuffer);

    safeSend(
      api,
      { body: `🎨 Anime PFP para kay: ${displayText}`, attachment: fs.createReadStream(tempPath) },
      threadID,
      messageID
    );
  } catch (err) {
    console.error("[animepfp] error:", err);
    safeSend(api, "❌ Hindi nagawa ang anime pfp. Subukan ulit mamaya.", threadID, messageID);
  } finally {
    // hintayin sandali bago tanggalin ang temp file, para sigurong
    // naipadala na ang attachment stream
    if (tempPath) {
      setTimeout(() => {
        fs.unlink(tempPath, () => {});
      }, 10000);
    }
  }
};
module.exports.onStart = module.exports.run;
