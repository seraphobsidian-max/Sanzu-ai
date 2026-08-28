const { updateEconomyData, ensureUser } = require("../utils/economyDB");

module.exports.config = {
  name: "slot",
  version: "1.2.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Maglaro ng Mega Casino Slot Machine gamit ang iyong coins",
  usePrefix: true,
  commandCategory: "Casino",
  usages: "/slot [halaga ng taya]",
  cooldowns: 4
};

const symbols = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎", "7️⃣"];
const payouts = {
  "7️⃣": 10,
  "💎": 7,
  "⭐": 5,
  "🔔": 4,
  "🍇": 3,
  "🍋": 2,
  "🍒": 2
};

function spin() {
  return [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const betInput = args[0];
  const bet = parseInt(betInput, 10);

  if (!betInput || isNaN(bet) || bet <= 0) {
    return api.sendMessage(
      "⚠️ Mag-lagay ng tamang halaga ng taya.\nHal: /slot 100",
      threadID,
      messageID
    );
  }

  // Naka-lock ang buong "check -> deduct -> spin -> credit" bilang isang
  // atomic unit sa SHARED economy module — parehong lock ang ginagamit
  // ng bank.js at setbal.js, kaya walang mag-o-overlap kahit sabay-sabay
  // gamitin ang iba't ibang commands.
  await updateEconomyData((eco) => {
    const user = ensureUser(eco, senderID);
    let resultMessage;

    if (bet > user.coins) {
      resultMessage = `❌ Kulang ang coins mo sa wallet. Balance mo: ${user.coins} 🪙`;
      api.sendMessage(resultMessage, threadID, messageID);
      return eco;
    }

    user.coins -= bet;

    const result = spin();
    const [a, b, c] = result;

    let winnings = 0;
    if (a === b && b === c) {
      winnings = bet * (payouts[a] || 2);
    } else if (a === b || b === c || a === c) {
      winnings = Math.floor(bet * 1.5);
    }

    user.coins += winnings;

    const net = winnings - bet;
    const netText =
      net > 0 ? `+${net} 🪙 (Panalo!)` : net < 0 ? `${net} 🪙 (Talo)` : `Break-even`;

    resultMessage =
      `🎰 [ ${result.join(" | ")} ] 🎰\n\n` +
      `Taya: ${bet} 🪙\n` +
      `Panalo: ${winnings} 🪙\n` +
      `Resulta: ${netText}\n` +
      `Wallet balance: ${user.coins} 🪙`;

    api.sendMessage(resultMessage, threadID, messageID);
    return eco;
  });
};
