module.exports = {
  config: {
    name: "setbal",
    aliases: ["setbalance", "setcash"],
    version: "1.0.0",
    role: 1,
    hasPrefix: true,
    description: "Set user's money at coins."
  },

  async run({ api, event, args, usersData }) {
    const { threadID, messageID } = event;

    const uid =
      Object.keys(event.mentions || {})[0] ||
      event.messageReply?.senderID;

    const amount = parseInt(args[args.length - 1]);

    if (!uid || isNaN(amount)) {
      return api.sendMessage(
        "💰 Usage:\n/setbal @user 50000\nor reply sa user:\n/setbal 50000",
        threadID,
        messageID
      );
    }

    // Kunin ang data ng user
    const user = await usersData.get(uid);

    // Sabay i-update ang Money at Coins
    await usersData.set(uid, {
      ...user,
      money: amount,
      coins: amount
    });

    api.sendMessage(
      `✅ 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗨𝗽𝗱𝗮𝘁𝗲𝗱!\n\n` +
      `👤 User: ${uid}\n` +
      `💵 Money: $${amount.toLocaleString()}\n` +
      `🪙 Coins: ${amount.toLocaleString()}`,
      threadID,
      messageID
    );
  }
};
