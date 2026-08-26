module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Shows all available commands",
    usage: "/help",
    credits: "sinzu",
    cooldown: 3
  },

  run: async ({ api, event }) => {
    const msg = `╔══════════════════════════╗
   🌸 𝐒𝐀𝐍𝐙𝐔 𝐀𝐈 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐄𝐍𝐓𝐄𝐑 🌸
╚══════════════════════════╝

🤖 ─── [ AI & ASSISTANCE ]
 • /ai [tanong] ➔ Google Gemini 3.7 AI
 • /lyrics [kanta] ➔ Song Lyrics Finder
 • /weather [lungsod] ➔ Live Weather Report
 • /translate [tl/en] ➔ Instant Translator
 • /quote ➔ Daily Motivation & Wisdom

🪙 ─── [ ECONOMY & CASINO ]
 • /coins ➔ Tingnan ang iyong Balanse
 • /coins daily ➔ Libreng Arawang Barya
 • /coins pay @tag [amt] ➔ Magpadala ng Barya
 • /slot [taya] ➔ 🎰 Mega Jackpot Slot Machine

🎨 ─── [ CREATIVE & MEDIA ]
 • /banner [Title] | [Sub] ➔ HD Banner Maker
 • /pinterest [query] ➔ Aesthetic Wallpapers
 • /shoti ➔ Random Viral Video

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Prefix: [ / ]
👑 Developer: sinzu
🤖 Engine: ws3-fca + Gemini`;

    return api.sendMessage(
      msg,
      event.threadID,
      event.messageID
    );
  }
};
