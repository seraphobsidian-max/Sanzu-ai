const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "autoreply.json");

function getAutoReplies() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}", "utf8");
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch {
    return {};
  }
}

function saveAutoReplies(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

module.exports.config = {
  name: "autoreply",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Mag-set ng auto-reply triggers sa bot",
  usePrefix: true,
  commandCategory: "Utility",
  usages: "!autoreply add [keyword] => [sagot] | !autoreply list | !autoreply del [keyword]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const replies = getAutoReplies();
  if (!replies[threadID]) replies[threadID] = {};

  const action = args[0]?.toLowerCase();

  // 1. List All Auto Replies in this GC
  if (action === "list") {
    const keys = Object.keys(replies[threadID]);
    if (keys.length === 0) {
      return api.sendMessage("📭 Walang naka-set na auto-reply sa group chat na ito.", threadID, messageID);
    }
    const list = keys.map((k, i) => `${i + 1}. "${k}" ➔ "${replies[threadID][k]}"`).join("\n");
    return api.sendMessage(`💬 [ NAKA-SET NA AUTO REPLIES ]\n\n${list}`, threadID, messageID);
  }

  // 2. Delete an Auto Reply
  if (action === "del" || action === "remove") {
    const key = args.slice(1).join(" ").toLowerCase();
    if (!key || !replies[threadID][key]) {
      return api.sendMessage(`❌ Hindi nahanap ang trigger keyword na "${key}".`, threadID, messageID);
    }
    delete replies[threadID][key];
    saveAutoReplies(replies);
    return api.sendMessage(`✓ Matagumpay na tinanggal ang auto-reply para sa "${key}".`, threadID, messageID);
  }

  // 3. Add Auto Reply (!autoreply add hi => kamusta kaibigan)
  if (action === "add") {
    const content = args.slice(1).join(" ");
    if (!content.includes("=>")) {
      return api.sendMessage("⚠️ Tamang Format:\n!autoreply add [trigger] => [sagot ng bot]\n\nHalimbawa:\n!autoreply add kumain ka na? => Opo, kakatapos lang busog na si Sanzu!", threadID, messageID);
    }

    const [trigger, response] = content.split("=>").map(s => s.trim());
    if (!trigger || !response) {
      return api.sendMessage("❌ Hindi maaaring blangko ang trigger o ang sagot.", threadID, messageID);
    }

    replies[threadID][trigger.toLowerCase()] = response;
    saveAutoReplies(replies);
    return api.sendMessage(`✓ [ AUTO-REPLY SET ]\n\nKapag may nag-type ng: "${trigger}"\nSasagot ang bot ng: "${response}"`, threadID, messageID);
  }

  return api.sendMessage("💡 Paggamit:\n• !autoreply add [keyword] => [sagot]\n• !autoreply list\n• !autoreply del [keyword]", threadID, messageID);
};
module.exports.onStart = module.exports.run;
