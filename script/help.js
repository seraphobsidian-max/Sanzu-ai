module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Ipakita ang listahan ng lahat ng commands",
  usePrefix: true,
  commandCategory: "System",
  usages: "!help",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;
  const text = `╭─── [ SANZU AI BOT COMMANDS ] ───╮
│
├─ 🤖 AI & INFO:
│  • !ai [tanong] - Gemini AI Assistant
│  • !lyrics [kanta] - Search song lyrics
│  • !weather [city] - Weather forecast
│  • !translate [text] - Google Translate
│  • !quote - Daily motivation quote
│
├─ 🛠️ UTILITY & SYSTEM:
│  • !help - Listahan ng commands
│  • !uptime - Server uptime status
│  • !ping - Bot speed and latency
│  • !uid [@tag/reply] - Facebook User ID
│  • !tid - Group Thread ID
│  • !unsend - Unsend bot message (reply)
│  • !admin - Listahan ng admins
│
├─ 👥 GROUP MANAGEMENT:
│  • !kick [@tag] - Kick member (Admin)
│  • !adduser [UID] - Add user to GC
│  • !setname [nickname] - Change nickname
│
├─ 🎮 FUN & ENTERTAINMENT:
│  • !joke - Pinoy funny jokes
│  • !coinflip - Heads or Tails
│  • !roll [max] - Random dice roll
│  • !pinterest [query] - Pinterest photo
│  • !shoti - Viral video
│  • !slap [@tag] - Slap a friend
│  • !hug [@tag] - Hug someone
│
├─ ⚡ OWNER:
│  • !restart - Reboot bot server
│
╰────────────────────────────────╯
📌 Prefix: ! | Developer: sinzu`;

  api.sendMessage(text, threadID, messageID);
};
module.exports.onStart = module.exports.run;
