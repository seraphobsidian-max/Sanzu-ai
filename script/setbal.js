const fs = require("fs");

module.exports = {
  config: {
    name: "setbal",
    aliases: ["setbalance", "setmoney"],
    version: "1.0.0",
    role: 1,
    hasPrefix: true,
    description: "Set user balance",
    usage: "/setbal @tag [amount]",
    credits: "sinzu",
    cooldown: 3
  },

  run: async ({ api, event, args }) => {
    const file = "./data/economy.json";

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, "{}", "utf8");
    }

    let economy = {};

    try {
      economy = JSON.parse(
        fs.readFileSync(file, "utf8")
      );
    } catch {
      economy = {};
    }

    let targetID = null;

    // Reply target
    if (event.messageReply?.senderID) {
      targetID = event.messageReply.senderID;
    }

    // Mention target
    if (
      !targetID &&
      event.mentions &&
      Object.keys(event.mentions).length
    ) {
      targetID = Object.keys(event.mentions)[0];
    }

    if (!targetID) {
      return api.sendMessage(
        "❌ I-tag ang user o mag-reply sa message niya.\n\nExample:\n/setbal @user 5000",
        event.threadID,
        event.messageID
      );
    }

    const amount = Number(
      args.find(arg => /^\d+(\.\d+)?$/.test(arg))
    );

    if (!Number.isFinite(amount) || amount < 0) {
      return api.sendMessage(
        "❌ Invalid amount.\n\nExample:\n/setbal @user 5000",
        event.threadID,
        event.messageID
      );
    }

    economy[targetID] = {
      ...(economy[targetID] || {}),
      balance: amount
    };

    fs.writeFileSync(
      file,
      JSON.stringify(economy, null, 2),
      "utf8"
    );

    let name = targetID;

    try {
      const info = await api.getUserInfo(targetID);
      name = info?.[targetID]?.name || targetID;
    } catch {}

    return api.sendMessage(
      `✅ 𝐁𝐀𝐋𝐀𝐍𝐂𝐄 𝐔𝐏𝐃𝐀𝐓𝐄𝐃

👤 User: ${name}
🆔 UID: ${targetID}
💰 New Balance: $${amount.toLocaleString()}

👑 Set by Admin`,
      event.threadID,
      event.messageID
    );
  }
};
