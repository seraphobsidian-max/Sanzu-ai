const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Ipakita ang listahan ng lahat ng commands, o detalye ng isang command",
  usePrefix: true,
  commandCategory: "Info",
  usages: "/help — listahan ng lahat\n/help <pangalan ng command> — detalye",
  cooldowns: 3
};

const PREFIX = "/";

/**
 * Basahin ang commands/ folder mismo (kung saan naka-store itong help.js)
 * at i-require ang bawat isa para makuha ang config nila. Dynamic — hindi
 * na kailangang i-update manually kada may bagong command na idagdag.
 */
function loadAllCommandConfigs() {
  const commandsDir = __dirname;
  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".js"));

  const commands = [];
  for (const file of files) {
    try {
      const filePath = path.join(commandsDir, file);
      delete require.cache[require.resolve(filePath)]; // laging bago ang basa
      const cmd = require(filePath);
      if (cmd && cmd.config && cmd.config.name) {
        commands.push(cmd.config);
      }
    } catch {
      // skip file na may error, huwag ipa-crash ang buong help command
      continue;
    }
  }
  return commands;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const allCommands = loadAllCommandConfigs();

  // ===== /help <commandname> — detalyadong info ng isang command =====
  if (args[0]) {
    const query = args[0].toLowerCase();
    const cmd = allCommands.find((c) => c.name.toLowerCase() === query);

    if (!cmd) {
      return api.sendMessage(
        `❌ Walang command na "${args[0]}". Gamitin ang /help para makita ang listahan.`,
        threadID,
        messageID
      );
    }

    const msg =
      `📖 COMMAND: ${cmd.name}\n\n` +
      `📝 Deskripsyon: ${cmd.description || "Wala pang deskripsyon"}\n` +
      `📂 Kategorya: ${cmd.commandCategory || "Uncategorized"}\n` +
      `⏳ Cooldown: ${cmd.cooldowns ?? 0}s\n` +
      `🔑 Permission Level: ${cmd.hasPermission ?? 0}\n` +
      (cmd.usages ? `📌 Paggamit:\n${cmd.usages}` : "");

    return api.sendMessage(msg, threadID, messageID);
  }

  // ===== /help (walang args) — listahan grouped by category =====
  const grouped = {};
  for (const cmd of allCommands) {
    const category = cmd.commandCategory || "Uncategorized";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(cmd.name);
  }

  const categories = Object.keys(grouped).sort();

  let msg = `📚 LISTAHAN NG COMMANDS (${allCommands.length})\n`;
  msg += `Gamitin ang "${PREFIX}help <pangalan>" para sa detalye.\n`;

  for (const category of categories) {
    const names = grouped[category].sort();
    msg += `\n〘 ${category.toUpperCase()} 〙\n`;
    msg += names.map((n) => `${PREFIX}${n}`).join(", ") + "\n";
  }

  return api.sendMessage(msg.trim(), threadID, messageID);
};
