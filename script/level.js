const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "economy.json"); // parehas ng work.js at rich.js
const EXP_COOLDOWN = 60 * 1000;      // 1 minuto bago makakuha ulit ng exp
const EXP_MIN = 5;
const EXP_MAX = 14;

// ── Storage helpers ─────────────────────────────────────
function loadEconomy() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      fs.writeFileSync(FILE, "{}");
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

function saveEconomy(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// exp na kailangan para umabot sa susunod na level
function expNeeded(level) {
  return level * 100;
}

function ensureUser(economy, uid) {
  if (!economy[uid]) {
    economy[uid] = { balance: 0, shifts: 0, nextAvailable: 0 };
  }
  if (typeof economy[uid].exp !== "number") economy[uid].exp = 0;
  if (typeof economy[uid].level !== "number") economy[uid].level = 1;
  if (typeof economy[uid].lastExpTime !== "number") economy[uid].lastExpTime = 0;
  return economy[uid];
}

function progressBar(current, max, size = 10) {
  const filled = Math.round((current / max) * size);
  return "▰".repeat(Math.min(filled, size)) + "▱".repeat(Math.max(size - filled, 0));
}

module.exports.config = {
  name: "level",
  aliases: ["lvl", "rank", "exp"],
  version: "1.0.0",
  hasPermission: 0,
  credits: "Sinzu",
  description: "Tignan ang level at exp mo.",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

// ── Command: /level — check level/exp mo ──
module.exports.run = async function ({ api, event }) {
  const uid = event.senderID;
  const economy = loadEconomy();
  const user = ensureUser(economy, uid);
  saveEconomy(economy);

  const needed = expNeeded(user.level);
  const bar = progressBar(user.exp, needed);

  let name = uid;
  try {
    const info = await api.getUserInfo(uid);
    name = (info[uid] && info[uid].name) || uid;
  } catch (e) {}

  const msg =
    `╭─────────────────╮\n` +
    `   🌟 LEVEL PROFILE\n` +
    `╰─────────────────╯\n\n` +
    `👤 Pangalan: ${name}\n` +
    `🏆 Level: ${user.level}\n` +
    `✨ EXP: ${user.exp} / ${needed}\n` +
    `${bar}\n\n` +
    `Makakakuha ka ng exp sa tuwing nagcha-chat ka sa group!`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};

// ── Passive: kumuha ng exp sa bawat message (GoatBot-style) ──
module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body || !event.senderID) return;

  const uid = event.senderID;
  const threadID = event.threadID;
  const economy = loadEconomy();
  const user = ensureUser(economy, uid);
  const now = Date.now();

  // cooldown para di sobrang bilis kumita ng exp
  if (now - user.lastExpTime < EXP_COOLDOWN) return;

  const gained = Math.floor(Math.random() * (EXP_MAX - EXP_MIN + 1)) + EXP_MIN;
  user.exp += gained;
  user.lastExpTime = now;

  const needed = expNeeded(user.level);

  if (user.exp >= needed) {
    user.exp -= needed;
    user.level += 1;

    saveEconomy(economy);

    let name = uid;
    try {
      const info = await api.getUserInfo(uid);
      name = (info[uid] && info[uid].name) || uid;
    } catch (e) {}

    return api.sendMessage(
      `🎉 LEVEL UP!\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `👤 ${name}\n` +
        `📈 Level ${user.level - 1} ➜ Level ${user.level}\n` +
        `━━━━━━━━━━━━━━━━`,
      threadID
    );
  }

  saveEconomy(economy);
};
