module.exports = {
  config: {
    name: "help",
    aliases: ["h", "commands"],
    version: "2.0.0",
    role: 0,
    hasPrefix: true,
    description: "Shows all available commands",
    usage: "/help",
    credits: "sinzu",
    cooldown: 3
  },

  run: async ({ api, event }) => {
    const msg = `╔════════════════════════════╗
      🌸 𝐒𝐀𝐍𝐙𝐔 𝐀𝐈 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐄𝐍𝐓𝐄𝐑
╚════════════════════════════╝

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


💰 ─── [ 𝐄𝐂𝐎𝐍𝐎𝐌𝐘 & 𝐂𝐀𝐒𝐈𝐍𝐎 ]

• /coins
  └ Tingnan ang iyong balance

• /coins daily
  └ Daily coin reward

• /coins pay @tag [amount]
  └ Magpadala ng coins

• /slot [taya]
  └ 🎰 Slot Machine

• /rich
  └ 🏆 Top 10 Richest Users


🎨 ─── [ 𝐂𝐑𝐄𝐀𝐓𝐈𝐕𝐄 & 𝐌𝐄𝐃𝐈𝐀 ]

• /banner [title] | [sub]
  └ HD Banner Maker

• /pinterest [query]
  └ Aesthetic Images

• /shoti
  └ Random Viral Video


💬 ─── [ 𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍 ]

• /autoreply add [key] => [reply]
  └ Add Auto Reply

• /autoreply list
  └ List Auto Replies

• /autoreply del [key]
  └ Delete Auto Reply


🛡️ ─── [ 𝐆𝐑𝐎𝐔𝐏 & 𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐈𝐎𝐍 ]

• /lockgcname on [name]
  └ Lock GC Name

• /lockgcname off
  └ Unlock GC Name

• /kick @tag
  └ Remove Member

• /adduser [UID]
  └ Add User to Group

• /setname [nickname]
  └ Change Nickname


🎮 ─── [ 𝐅𝐔𝐍 & 𝐆𝐀𝐌𝐄𝐒 ]

• /joke
  └ Pinoy Jokes

• /coinflip
  └ Heads or Tails

• /roll [number]
  └ Random Dice

• /slap @tag
  └ Slap Someone

• /hug @tag
  └ Hug Someone


⚡ ─── [ 𝐒𝐘𝐒𝐓𝐄𝐌 & 𝐔𝐓𝐈𝐋𝐈𝐓𝐘 ]

• /help
  └ Show Command Center

• /help [command]
  └ Command Information

• /ping
  └ Bot Response Speed

• /uptime
  └ Bot Uptime

• /uid
  └ Get User ID

• /tid
  └ Get Thread ID

• /unsend
  └ Unsend Bot Message

• /admin
  └ 👑 Admin Command Center


👑 ─── [ 𝐀𝐃𝐌𝐈𝐍 & 𝐄𝐂𝐎𝐍𝐎𝐌𝐘 ]

• /setbal @tag [amount]
  └ Set User Balance

• /setbal [amount]
  └ Set Balance by Reply

• /admin
  └ View Admin Commands

• /announce [message]
  └ Broadcast Announcement


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Prefix: [ / ]
📊 Use /help [command] for details

👑 Developer: SINZU
🤖 Engine: WS3-FCA
🌸 SANZU AI COMMAND CENTER`;

    return api.sendMessage(
      msg,
      event.threadID,
      event.messageID
    );
  }
};
