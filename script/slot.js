const { updateEconomyData, ensureUser } = require("../utils/economyDB");

module.exports.config = {
  name: "slot",
  version: "1.3.0",
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

/**
 * ws3-fca: api.sendMessage(body, threadID, messageID) ang tamang paraan
 * para mag-reply sa specific message. Minsan nagta-throw / nag-re-reject
 * ito (offline session, rate limit, network hiccup) — kaya binabalot natin
 * sa try/catch para hindi masira/ma-stuck ang buong autobot loop kapag
 * nabigo lang ang isang sendMessage.
 */
function safeSend(api, body, threadID, messageID) {
  try {
    const result = api.sendMessage(body, threadID, messageID);
    if (result && typeof result.catch === "function") {
      result.catch((err) => console.error("[slot] sendMessage error:", err?.message || err));
    }
  } catch (err) {
    console.error("[slot] sendMessage error:", err?.message || err);
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const betInput = args[0];
  const bet = parseInt(betInput, 10);

  if (!betInput || isNaN(bet) || bet <= 0) {
    return safeSend(
      api,
      "⚠️ Mag-lagay ng tamang halaga ng taya.\nHal: /slot 100",
      threadID,
      messageID
    );
  }

  // Naka-lock ang buong "check -> deduct -> spin -> credit" bilang isang
  // atomic unit sa SHARED economy module — parehong lock ang ginagamit
  // ng bank.js at setbal.js, kaya walang mag-o-overlap kahit sabay-sabay
  // gamitin ang iba't ibang commands.
  try {
    await updateEconomyData((eco) => {
      const user = ensureUser(eco, senderID);
      let resultMessage;

      if (bet > user.coins) {
        resultMessage = `❌ Kulang ang coins mo sa wallet. Balance mo: ${user.coins} 🪙`;
        safeSend(api, resultMessage, threadID, messageID);
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

      safeSend(api, resultMessage, threadID, messageID);
      return eco;
    });
  } catch (err) {
    console.error("[slot] error:", err);
    safeSend(api, "❌ May naganap na error sa slot. Subukan ulit mamaya.", threadID, messageID);
  }
};
