module.exports.config = {
  name: "tid",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Kunin ang Thread ID ng kasalukuyang Group Chat",
  usePrefix: true,
  commandCategory: "Utility",
  usages: "!tid",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  api.sendMessage(`👥 Group Chat Thread ID:\n${event.threadID}`, event.threadID, event.messageID);
};
module.exports.onStart = module.exports.run;
