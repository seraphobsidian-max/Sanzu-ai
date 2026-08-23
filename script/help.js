module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermssion: 0, 
  credits: "SINZU",
  description: "Tingnan ang listahan ng mga available commands o ang detalye ng isang command.",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  // Access the global commands map (standard for Mirai-based bots)
  const { commands } = global.client; 
  const { threadID, messageID } = event;
  const commandName = (args[0] || "").toLowerCase();

  // If the user just types "!help" without specifying a command
  if (!commandName) {
    let msg = "╭─『 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』\n";
    let index = 1;

    // Loop through all loaded commands and list them
    for (const [name, cmd] of commands) {
      msg += `│ ${index++}. ${name}\n`;
    }

    msg += `╰───────────────\n`;
    msg += `\n💡 Type "help [command]" para makita ang paano gamitin ang isang command. (Ex: help ai)`;

    return api.sendMessage(msg, threadID, messageID);
  } 
  
  // If the user types "!help [command name]" (e.g., "!help weather")
  else {
    if (commands.has(commandName)) {
      const cmd = commands.get(commandName).config;
      
      // Determine permission level text
      let role = "Lahat ng Users";
      if (cmd.hasPermssion === 1) role = "Group Admins";
      if (cmd.hasPermssion === 2) role = "Bot Admin";

      let msg = `╭─『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 』\n`;
      msg += `│ 🏷️ Name: ${cmd.name}\n`;
      msg += `│ 📝 Description: ${cmd.description}\n`;
      msg += `│ ⚙️ Category: ${cmd.commandCategory}\n`;
      msg += `│ 📌 Usage: ${cmd.name} ${cmd.usages}\n`;
      msg += `│ ⏳ Cooldown: ${cmd.cooldowns} seconds\n`;
      msg += `│ 👑 Permission: ${role}\n`;
      msg += `╰───────────────`;
      
      return api.sendMessage(msg, threadID, messageID);
    } else {
      return api.sendMessage(`❌ Walang command na nagngangalang "${commandName}". I-type ang "help" para makita ang lahat ng commands.`, threadID, messageID);
    }
  }
};
