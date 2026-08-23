module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Sampalin ang kaibigan sa GC",
  usePrefix: true,
  commandCategory: "Fun",
  usages: "!slap @mention",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID, mentions } = event;
  if (!mentions || Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ I-tag (@mention) ang taong gusto mong sampalin! 😂", threadID, messageID);
  }
  const targetName = Object.values(mentions)[0];
  api.sendMessage(`👋💥 Sinampal ni user ang pilyong si ${targetName}! Aray! 🤣`, threadID, messageID);
};
module.exports.onStart = module.exports.run;
