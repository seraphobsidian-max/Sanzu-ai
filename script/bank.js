const { updateEconomyData, ensureUser } = require("../utils/economyDB");

module.exports.config = {
  name: "bank",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Mag-deposit o mag-withdraw ng coins sa iyong bangko",
  usePrefix: true,
  commandCategory: "Casino",
  usages:
    "!bank — tingnan ang balance\n" +
    "!bank deposit <halaga|all>\n" +
    "!bank withdraw <halaga|all>",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const action = (args[0] || "").toLowerCase();

  // ===== !bank (walang args) — check balance lang, read-only =====
  if (!action) {
    return updateEconomyData((eco) => {
      const user = ensureUser(eco, senderID);
      api.sendMessage(
        `🏦 BANK ACCOUNT\n\n` +
          `💵 Wallet: ${user.coins} 🪙\n` +
          `🏦 Bangko: ${user.bank} 🪙\n` +
          `💰 Total: ${user.coins + user.bank} 🪙`,
        threadID,
        messageID
      );
      return eco; // walang binago
    });
  }

  if (action !== "deposit" && action !== "withdraw") {
    return api.sendMessage(
      "⚠️ Gamitin: !bank deposit <halaga|all> o !bank withdraw <halaga|all>",
      threadID,
      messageID
    );
  }

  const amountInput = args[1];

  await updateEconomyData((eco) => {
    const user = ensureUser(eco, senderID);
    let resultMessage;

    if (action === "deposit") {
      let amount =
        amountInput === "all"
          ? user.coins
          : parseInt(amountInput, 10);

      if (!amount || isNaN(amount) || amount <= 0) {
        resultMessage = "⚠️ Mag-lagay ng tamang halaga. Hal: !bank deposit 100";
      } else if (amount > user.coins) {
        resultMessage = `❌ Kulang ang wallet mo. Meron ka lang ${user.coins} 🪙`;
      } else {
        user.coins -= amount;
        user.bank += amount;
        resultMessage =
          `✅ Na-deposit: ${amount} 🪙\n` +
          `💵 Wallet: ${user.coins} 🪙\n` +
          `🏦 Bangko: ${user.bank} 🪙`;
      }
    } else {
      // withdraw
      let amount =
        amountInput === "all"
          ? user.bank
          : parseInt(amountInput, 10);

      if (!amount || isNaN(amount) || amount <= 0) {
        resultMessage = "⚠️ Mag-lagay ng tamang halaga. Hal: !bank withdraw 100";
      } else if (amount > user.bank) {
        resultMessage = `❌ Kulang ang laman ng bangko mo. Meron ka lang ${user.bank} 🪙`;
      } else {
        user.bank -= amount;
        user.coins += amount;
        resultMessage =
          `✅ Na-withdraw: ${amount} 🪙\n` +
          `💵 Wallet: ${user.coins} 🪙\n` +
          `🏦 Bangko: ${user.bank} 🪙`;
      }
    }

    api.sendMessage(resultMessage, threadID, messageID);
    return eco;
  });
};
