module.exports = {
  config: {
    name: "admin",
    aliases: ["admincmd", "admincommands"],
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Shows all admin-only commands",
    usage: "/admin",
    credits: "sinzu",
    cooldown: 5
  },

  run: async ({ api, event, Utils }) => {
    const adminCommands = [];

    for (const command of Utils.commands.values()) {
      const role = Number(command.role);

      if (role >= 1) {
        adminCommands.push(command);
      }
    }

    adminCommands.sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );

    let msg = `╔══════════════════════════╗
     👑 𝐒𝐀𝐍𝐙𝐔 𝐀𝐃𝐌𝐈𝐍 𝐂𝐄𝐍𝐓𝐄𝐑
╚══════════════════════════╝

`;

    if (!adminCommands.length) {
      msg += "❌ Walang admin-only commands na loaded.";
    } else {
      for (const cmd of adminCommands) {
        const aliases = Array.isArray(cmd.aliases)
          ? cmd.aliases.filter(a => a !== cmd.name)
          : [];

        msg += `🛡️ /${cmd.name}`;

        if (aliases.length) {
          msg += ` (${aliases.map(a => "/" + a).join(", ")})`;
        }

        msg += `\n   └ ${cmd.description || "Admin command"}\n\n`;
      }
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 Role 1 = Bot Admin
👑 Role 2 = Group Admin
👑 Role 3 = Owner`;

    return api.sendMessage(
      msg,
      event.threadID,
      event.messageID
    );
  }
};
