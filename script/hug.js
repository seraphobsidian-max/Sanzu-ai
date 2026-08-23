module.exports.config = {
  name: "hug",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Yakapin ang kaibigan sa GC",
  usePrefix: true,
  commandCategory: "Fun",
  usages: "!hug @mention",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, mentions } = event;
  if (!mentions || Object.keys(mentions).length === 0) {
    return api.sendMessage("🤗 I-tag (@mention) ang taong gusto mong yakapin!", threadID, messageID);
  }
  const targetName = Object.values(mentions)[0];
  api.sendMessage(`🤗❤️ Binigyan ng mahigpit at mainit na yakap si ${targetName}!`, threadID, messageID);
};
module.exports.onStart = module.exports.run;
