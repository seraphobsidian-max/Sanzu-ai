module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Shows all available commands",
    usage: "!help",
    credits: "sinzu",
    cooldown: 3
  },

  run: async ({ api, event }) => {
    const msg = `╔══════════════════════════╗
   🌸 𝐒𝐀𝐍𝐙𝐔 𝐀𝐈 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐄𝐍𝐓𝐄𝐑 🌸
╚══════════════════════════╝

🤖 ─── [ AI & ASSISTANCE ]
 • !ai [tanong] ➔ Google Gemini 3.7 AI
 • !lyrics [kanta] ➔ Song Lyrics Finder
 • !weather [lungsod] ➔ Live Weather Report
 • !translate [tl/en] ➔ Instant Translator
 • !quote ➔ Daily Motivation & Wisdom

🪙 ─── [ ECONOMY & CASINO ]
 • !coins ➔ Tingnan ang iyong Balanse
 • !coins daily ➔ Libreng Arawang Barya
 • !coins pay @tag [amt] ➔ Magpadala ng Barya
 • !slot [taya] ➔ 🎰 Mega Jackpot Slot Machine

🎨 ─── [ CREATIVE & MEDIA ]
 • !banner [Title] | [Sub] ➔ HD Banner Maker
 • !pinterest [query] ➔ Aesthetic Wallpapers
 • !shoti ➔ Random Viral Video

💬 ─── [ CHATBOT AUTOMATION ]
 • !autoreply add [k] => [v] ➔ Custom Auto Reply
 • !autoreply list ➔ Listahan ng Triggers
 • !autoreply del [k] ➔ Tanggalin ang Trigger

🛡️ ─── [ GROUP & MODERATION ]
 • !lockgcname on [name] ➔ Anti-Change GC Lock
 • !lockgcname off ➔ Unlock GC Name
 • !kick @tag ➔ Kick Member (Admin)
 • !adduser [UID] ➔ Magdagdag sa Group
 • !setname [nickname] ➔ Palitan ang Nickname

🎮 ─── [ FUN & GAMES ]
 • !joke ➔ Nakakatawang Pinoy Jokes
 • !coinflip ➔ Heads o Tails Toss
 • !roll [bilang] ➔ Random Dice Roll
 • !slap @tag ➔ Sampalin ang Kaibigan
 • !hug @tag ➔ Yakapin ang Kasama

⚡ ─── [ SYSTEM & UTILITY ]
 • !help [cmd] ➔ Gabay sa partikular na command
 • !uptime ➔ 24/7 Server Status sa Render
 • !ping ➔ Latency & Response Speed (ms)
 • !uid [@tag/reply] ➔ Facebook User ID
 • !tid ➔ Group Chat Thread ID
 • !unsend ➔ Tanggalin ang Bot Message
 • !admin ➔ Bot Owners & Moderators
 • !restart ➔ I-reboot ang Bot (Owner)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Prefix: [ ! ] | Total Commands: 28
👑 Developer: sinzu | Engine: ws3-fca + Gemini`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
