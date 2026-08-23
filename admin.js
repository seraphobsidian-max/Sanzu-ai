module.exports.config = {
  name: "admin",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Tingnan ang listahan ng Bot Admins at Owner",
  usePrefix: true,
  commandCategory: "System",
  usages: "!admin",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const text = `👑 [ SANZU AI BOT MANAGEMENT ]
━━━━━━━━━━━━━━━━━
👑 BOT OWNER:
• Name: sinzu
• UID: 61592910700010

🛡️ BOT ADMINS:
• Full access to Admin Commands, GC moderation, and AI controls.

📌 Para sa support o queries, mag-PM lamang sa Owner!`;
  api.sendMessage(text, event.threadID, event.messageID);
};
module.exports.onStart = module.exports.run;
