module.exports.config = {
  name: "help",
  version: "2.5.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Ipakita ang kumpletong menu at listahan ng lahat ng commands",
  usePrefix: true,
  commandCategory: "System",
  usages: "!help o !help [command_name]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const commandQuery = args[0]?.toLowerCase();

  // Kung may partikular na command na hinahanap (e.g. !help slot)
  if (commandQuery) {
    const details = {
      ai: "🤖 !ai [tanong] - Makipag-usap kay Google Gemini 3.7 AI Flash para sa kahit anong tanong o homework.",
      coins: "🪙 !coins - Tingnan ang balanse\n🪙 !coins daily - Mag-claim ng libreng daily bonus\n🪙 !coins pay @tag [halaga] - Magpadala ng coins sa kaibigan.",
      slot: "🎰 !slot [halaga] - Maglaro sa Mega Casino Slot Machine. Manalo ng hanggang x15 Multiplier sa Mega 777 Jackpot!",
      banner: "🎨 !banner [Title] | [Subtitle] - Gumawa ng visual high-definition graphic text banner.",
      autoreply: "💬 !autoreply add [keyword] => [sagot]\n💬 !autoreply list - Tingnan ang lahat\n💬 !autoreply del [keyword] - Tanggalin ang trigger.",
      lockgcname: "🔒 !lockgcname on [Pangalan] - I-lock ang pangalan ng GC upang hindi mapalitan ng iba\n🔓 !lockgcname off - I-unlock.",
      weather: "🌤️ !weather [city] - Kumuha ng real-time forecast, temperatura, at humidity.",
      lyrics: "🎶 !lyrics [pamagat] - Maghanap ng kumpletong liriko ng kahit anong kanta.",
      translate: "🌐 !translate [en/tl] [text] - Isalin ang salita sa Tagalog o English.",
      uptime: "⏱️ !uptime - Tingnan kung gaano na katagal online ang 24/7 server ng bot sa Render.",
      ping: "⚡ !ping - I-test ang bilis at server latency (ms) ng bot.",
      uid: "🆔 !uid - Kunin ang iyong Facebook UID o i-tag ang iba.",
      tid: "👥 !tid - Kunin ang Thread ID ng kasalukuyang Group Chat.",
      unsend: "🗑️ !unsend - I-reply sa mensahe ng bot para tanggalin ito.",
      kick: "👋 !kick @mention - I-kick ang pasaway na miyembro mula sa GC (Admin only).",
      adduser: "➕ !adduser [UID] - Magdagdag ng user sa GC gamit ang Facebook UID.",
      setname: "✏️ !setname [nickname] - Palitan ang nickname sa GC ng sarili o naka-tag.",
      joke: "🤣 !joke - Magbasa ng nakakatawang Pinoy joke.",
      quote: "📜 !quote - Random inspiring at motivational daily quote.",
      coinflip: "🪙 !coinflip - Mag-toss ng barya (Heads o Tails).",
      roll: "🎲 !roll [max] - Random dice roll simulator.",
      slap: "👋 !slap @mention - Sampalin ang kaibigan sa GC.",
      hug: "🤗 !hug @mention - Magpadala ng mainit na yakap.",
      pinterest: "📌 !pinterest [query] - Maghanap ng aesthetic visual wallpapers.",
      shoti: "✨ !shoti - Random trending video link.",
      admin: "🛡️ !admin - Tingnan ang listahan ng mga bot administrators.",
      restart: "🔄 !restart - I-reboot ang bot server (Owner only)."
    };

    if (details[commandQuery]) {
      return api.sendMessage(`📖 [ COMMAND DETAILS: !${commandQuery.toUpperCase()} ]\n━━━━━━━━━━━━━━━━━━━━\n${details[commandQuery]}`, threadID, messageID);
    }
  }

  // Master Help Menu Display
  const fullMenu = `╔══════════════════════════╗
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

  api.sendMessage(fullMenu, threadID, messageID);
};

module.exports.onStart = module.exports.run;
