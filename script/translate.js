const axios = require("axios");

module.exports.config = {
  name: "translate",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Isalin ang salita sa Tagalog o English",
  usePrefix: true,
  commandCategory: "Utility",
  usages: "!translate [tl/en] [teksto] o !translate [teksto]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;
  let targetLang = "tl";
  let content = args.join(" ");

  if (args[0] === "en" || args[0] === "tl") {
    targetLang = args[0];
    content = args.slice(1).join(" ");
  }

  if (!content && messageReply && messageReply.body) {
    content = messageReply.body;
  }

  if (!content) return api.sendMessage("⚠️ Maglagay ng tekstong isasalin.\nHalimbawa: !translate en Magandang umaga sa inyo!", threadID, messageID);

  try {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(content)}`);
    const translated = res.data[0].map(item => item[0]).join("");
    api.sendMessage(`🌐 [ TRANSLATION - ${targetLang.toUpperCase()} ]\n\n${translated}`, threadID, messageID);
  } catch (e) {
    api.sendMessage(`❌ Translate Error: ${e.message}`, threadID, messageID);
  }
};
module.exports.onStart = module.exports.run;
