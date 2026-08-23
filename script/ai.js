const { GoogleGenAI } = require("@google/genai");

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Makipag-usap kay Google Gemini AI",
  usePrefix: true,
  commandCategory: "AI",
  usages: "!ai [iyong tanong]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("❓ Maglagay ng tanong.\nHalimbawa: !ai ano ang photosynthesis?", threadID, messageID);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return api.sendMessage("❌ Walang GEMINI_API_KEY na naka-configure.", threadID, messageID);

  try {
    api.sendMessage("✨ Nag-iisip si Sanzu AI...", threadID, messageID);
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { systemInstruction: "Ikaw si Sanzu AI, matalino at magalang na Tagalog/Taglish chatbot." }
    });
    api.sendMessage(`🌸 [ SANZU AI ]\n\n${response.text}`, threadID, messageID);
  } catch (err) {
    api.sendMessage(`❌ AI Error: ${err.message}`, threadID, messageID);
  }
};
module.exports.onStart = module.exports.run;
