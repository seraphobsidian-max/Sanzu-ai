const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "economy.json");

// Simpleng in-file lock (walang external file) para hindi mag-overlap
// ang read->modify->write kapag sabay-sabay gumamit ng bank/slot/megaslot.
let lockQueue = Promise.resolve();
function withLock(fn) {
  const run = lockQueue.then(fn);
  lockQueue = run.catch(() => {});
  return run;
}

function getEconomyData() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch {
    return {};
  }
}

function saveEconomyData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

module.exports.config = {
  name: "bank",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Mag-deposit o mag-withdraw ng coins sa iyong bangko",
  usePrefix: true,
  commandCategory: "Casino",
  usages:
    "/bank — tingnan ang balance\n" +
    "/bank deposit <halaga|all>\n" +
    "/bank withdraw <halaga|all>",
  cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const action = (args[0] || "").toLowerCase();

  // ===== /bank (walang args) — check balance lang =====
  if (!action) {
    return withLock(() => {
      const eco = getEconomyData();
      if (!eco[senderID]) eco[senderID] = { coins: 1000, bank: 0, lastDaily: 0 };
      const user = eco[senderID];
      if (typeof user.bank !== "number") user.bank = 0;

      api.sendMessage(
        `🏦 BANK ACCOUNT\n\n` +
          `💵 Wallet: 🪙 ${user.coins.toLocaleString()}\n` +
          `🏦 Bangko: 🪙 ${user.bank.toLocaleString()}\n` +
          `💰 Total: 🪙 ${(user.coins + user.bank).toLocaleString()}`,
        threadID,
        messageID
      );
      // walang binago, pero save pa rin para ma-migrate ang bagong "bank" field
      saveEconomyData(eco);
    });
  }

  if (action !== "deposit" && action !== "withdraw") {
    return api.sendMessage(
      "⚠️ Gamitin: /bank deposit <halaga|all> o /bank withdraw <halaga|all>",
      threadID,
      messageID
    );
  }

  const amountInput = args[1];

  await withLock(() => {
    const eco = getEconomyData();
    if (!eco[senderID]) eco[senderID] = { coins: 1000, bank: 0, lastDaily: 0 };
    const user = eco[senderID];
    if (typeof user.bank !== "number") user.bank = 0;

    let resultMessage;

    if (action === "deposit") {
      let amount = amountInput === "all" ? user.coins : parseInt(amountInput, 10);

      if (!amount || isNaN(amount) || amount <= 0) {
        resultMessage = "⚠️ Mag-lagay ng tamang halaga. Hal: /bank deposit 100";
      } else if (amount > user.coins) {
        resultMessage = `❌ Kulang ang wallet mo. Meron ka lang 🪙 ${user.coins.toLocaleString()}`;
      } else {
        user.coins -= amount;
        user.bank += amount;
        resultMessage =
          `✅ Na-deposit: 🪙 ${amount.toLocaleString()}\n` +
          `💵 Wallet: 🪙 ${user.coins.toLocaleString()}\n` +
          `🏦 Bangko: 🪙 ${user.bank.toLocaleString()}`;
      }
    } else {
      // withdraw
      let amount = amountInput === "all" ? user.bank : parseInt(amountInput, 10);

      if (!amount || isNaN(amount) || amount <= 0) {
        resultMessage = "⚠️ Mag-lagay ng tamang halaga. Hal: /bank withdraw 100";
      } else if (amount > user.bank) {
        resultMessage = `❌ Kulang ang laman ng bangko mo. Meron ka lang 🪙 ${user.bank.toLocaleString()}`;
      } else {
        user.bank -= amount;
        user.coins += amount;
        resultMessage =
          `✅ Na-withdraw: 🪙 ${amount.toLocaleString()}\n` +
          `💵 Wallet: 🪙 ${user.coins.toLocaleString()}\n` +
          `🏦 Bangko: 🪙 ${user.bank.toLocaleString()}`;
      }
    }

    saveEconomyData(eco);
    api.sendMessage(resultMessage, threadID, messageID);
  });
};
module.exports.onStart = module.exports.run;
