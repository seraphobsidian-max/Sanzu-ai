module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Sinzu",
  description: "Ipinapakita ang lahat ng available commands.",
  commandCategory: "general",
  usages: "[command name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const commandList = [
    "accept", "active-session", "adduser", "ai", "announce", "autoreply",
    "coins", "help", "hug", "joke", "kick", "leaderboard", "lockgcname",
    "nickall", "pinterest", "quote", "roll", "setname", "shoti", "slap",
    "slot", "song", "tid", "translate", "unsend", "uptime", "weather",
    "work", "yt"
  ];

  const prefix = global.config?.PREFIX || "/";

  // ── help [command] — detalye ng specific command ──
  if (args[0]) {
    const cmdName = args[0].toLowerCase();
    if (!commandList.includes(cmdName)) {
      return api.sendMessage(
        `❌ Walang command na "${cmdName}".`,
        event.threadID,
        event.messageID
      );
    }
    return api.sendMessage(
      `📌 Command: ${cmdName}\n` +
        `Gamitin: ${prefix}${cmdName}\n` +
        `Para sa buong listahan, i-type ang "${prefix}help".`,
      event.threadID,
      event.messageID
    );
  }

  // ── help — buong listahan ──
  const sorted = [...commandList].sort((a, b) => a.localeCompare(b));

  let msg = `╭─────────────────╮\n`;
  msg += `   📖 SINZU BOT — HELP MENU\n`;
  msg += `╰─────────────────╯\n\n`;
  msg += `👑 Owner: Sinzu\n`;
  msg += `📦 Total Commands: ${sorted.length}\n\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;

  sorted.forEach((name, i) => {
    msg += `${i + 1}. ${prefix}${name}\n`;
  });

  msg += `━━━━━━━━━━━━━━━━\n\n`;
  msg += `Type "${prefix}help [command]" para sa detalye ng specific na command.`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
