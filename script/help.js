module.exports = {
  config: {
    name: "help",
    aliases: ["h", "commands"],
    version: "3.0.0",
    role: 0,
    hasPrefix: true,
    description: "Shows all available commands",
    usage: "/help",
    credits: "sinzu",
    cooldown: 3
  },

  run: async ({ api, event }) => {
    const msg = `╔══════════════════════════════════╗
        🌸 𝐒𝐀𝐍𝐙𝐔 𝐀𝐈 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐄𝐍𝐓𝐄𝐑
╚══════════════════════════════════╝

🤖 ─── [ 𝐀𝐈 & 𝐀𝐒𝐒𝐈𝐒𝐓𝐀𝐍𝐂𝐄 ]

• /ai [tanong]
  └ Gemini AI Assistant

• /lyrics [kanta]
  └ Song Lyrics Finder

• /weather [lungsod]
  └ Weather Information

• /translate [text]
  └ Instant Translator

• /quote
  └ Daily Motivation & Wisdom


🎵 ─── [ 𝐌𝐔𝐒𝐈𝐂 & 𝐕𝐈𝐃𝐄𝐎 ]

• /song [kanta]
  └ Search & send song as MP4

• /yt [search]
  └ Search & send YouTube video

• /youtube [search]
  └ YouTube video search

• /playyt [search]
  └ YouTube video player


💰 ─── [ 𝐄𝐂𝐎𝐍𝐎𝐌𝐘 ]

• /balance
  └ Check your money & coins

• /daily
  └ Claim daily cash reward

• /bet [amount]
  └ Bet your money

• /transfer [@user] [amount]
  └ Transfer cash to another user

• /top
  └ Top richest users

• /toprich
  └ Richest users leaderboard

• /topexp
  └ Top EXP leaderboard


👑 ─── [ 𝐀𝐃𝐌𝐈𝐍 ]

• /setbal [@user] [amount]
  └ Set user's money & coins

• /setcash [@user] [amount]
  └ Set user's cash

• /setbalance [@user] [amount]
  └ Set user's balance

• /givecash [@user] [amount]
  └ Give cash to a user

• /takecash [@user] [amount]
  └ Remove cash from a user

• /admin
  └ View admin commands


😂 ─── [ 𝐅𝐔𝐍 & 𝐑𝐀𝐍𝐃𝐎𝐌 ]

• /slap [username]
  └ Slap a user with a GIF

• /sampal [username]
  └ Alias of /slap

• /slot [amount]
  └ Play the slot machine

• /megaslot [amount]
  └ Play Mega Slot


🛠️ ─── [ 𝐔𝐓𝐈𝐋𝐈𝐓𝐘 ]

• /help
  └ Show all commands

• /h
  └ Shortcut for help

• /commands
  └ Show command list

• /prefix
  └ Show bot prefix

• /info
  └ Bot information

• /uptime
  └ Bot uptime

• /ping
  └ Check bot response


📚 ─── [ 𝐆𝐔𝐈𝐃𝐄 ]

• /help [command]
  └ View command details

• /admin
  └ View administrator tools

• Reply + /setbal [amount]
  └ Set balance of replied user

• Reply + /givecash [amount]
  └ Give cash to replied user


╔══════════════════════════════════╗
        🌸 𝐒𝐀𝐍𝐙𝐔 𝐀𝐈 𝐒𝐘𝐒𝐓𝐄𝐌
╚══════════════════════════════════╝

💠 Total Commands: 30+
⚡ Fast • Stable • Easy to Use
👑 Admin • Economy • AI • Music • Fun

Type /help [command] for more information.
`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
