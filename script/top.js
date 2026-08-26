const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "economy.json");

function loadEconomy() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

module.exports.config = {
  name: "top",
  aliases: ["topexp", "toplevel", "expboard"],
  version: "1.0.0",
  hasPermission: 0,
  credits: "Sinzu",
  description: "Ipinapakita ang top 10 pinaka-mataas ang level.",
  commandCategory: "economy",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const messageID = event.messageID;
  const economy = loadEconomy();

  const entries = Object.entries(economy)
    .filter(([id, data]) => data && typeof data.level === "number")
    .sort((a, b) => {
      if (b[1].level !== a[1].level) return b[1].level - a[1].level;
      return (b[1].exp || 0) - (a[1].exp || 0);
    })
    .slice(0, 10);

  if (entries.length === 0) {
    return api.sendMessage(
      "📭 Wala pang exp data. Magchat muna para makakuha ng exp.",
      threadID,
      messageID
    );
  }

  const medals = ["🥇", "🥈", "🥉"];
  let msg = `╭─────────────────╮\n`;
  msg += `   🌟 TOP EXP LEADERBOARD\n`;
  msg += `╰─────────────────╯\n\n`;

  for (let i = 0; i < entries.length; i++) {
    const [uid, data] = entries[i];
    let name = uid;
    try {
      const info = await api.getUserInfo(uid);
      name = (info[uid] && info[uid].name) || uid;
    } catch (e) {}

    const rank = medals[i] || `${i + 1}.`;
    msg += `${rank} ${name} — Lv.${data.level} (${data.exp || 0} exp)\n`;
  }

  return api.sendMessage(msg, threadID, messageID);
};
