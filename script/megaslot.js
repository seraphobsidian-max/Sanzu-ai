const { updateEconomyData, ensureUser } = require("../utils/economyDB");

module.exports.config = {
  name: "megaslot",
  version: "1.0.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Maglaro ng Sanzu Casino Mega Slot Machine gamit ang iyong coins",
  usePrefix: true,
  commandCategory: "Casino",
  usages: "/megaslot [halaga ng taya]",
  cooldowns: 4
};

const MIN_BET = 50;
const symbols = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎", "7️⃣"];

/**
 * ws3-fca: api.sendMessage(body, threadID, messageID) ang tamang paraan
 * para mag-reply. Binabalot sa try/catch (at hinahawakan ang promise
 * rejection kung meron) para hindi masira/ma-stuck ang autobot loop
 * kapag nabigo lang ang isang sendMessage.
 */
function safeSend(api, body, threadID, messageID) {
  try {
    const result = api.sendMessage(body, threadID, messageID);
    if (result && typeof result.catch === "function") {
      result.catch((err) =>
        console.error("[megaslot] sendMessage error:", err?.message || err)
      );
    }
  } catch (err) {
    console.error("[megaslot] sendMessage error:", err?.message || err);
  }
}

function spinReels() {
  return [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
}

function resolveSpin(r1, r2, r3, bet) {
  if (r1 === "7️⃣" && r2 === "7️⃣" && r3 === "7️⃣") {
    return { winAmount: bet * 15, resultStatus: "🔥💥 MEGA ULTRA JACKPOT (x15) 💥🔥" };
  }
  if (r1 === "💎" && r2 === "💎" && r3 === "💎") {
    return { winAmount: bet * 10, resultStatus: "💎✨ DIAMOND JACKPOT (x10) ✨💎" };
  }
  if (r1 === r2 && r2 === r3) {
    return { winAmount: bet * 5, resultStatus: "🎉🌟 BIG WIN TRIPLE MATCH (x5) 🌟🎉" };
  }
  if (r1 === r2 || r2 === r3 || r1 === r3) {
    return { winAmount: bet * 2, resultStatus: "✨ DOUBLE MATCH WIN (x2) ✨" };
  }
  return { winAmount: 0, resultStatus: "💔 TALO! Better luck next spin! 💔" };
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const bet = parseInt(args[0], 10);

  if (isNaN(bet) || bet < MIN_BET) {
    return safeSend(
      api,
      `⚠️ Minimum na taya sa Mega Slot ay 🪙 ${MIN_BET} Coins.\nHalimbawa: /megaslot 200`,
      threadID,
      messageID
    );
  }

  // Naka-lock ang buong "check -> deduct -> spin -> credit" bilang isang
  // atomic unit sa SHARED economy module (kasama ng slot.js, bank.js,
  // setbal.js), kaya walang mag-o-overlap kahit sabay-sabay gamitin.
  try {
    await updateEconomyData((eco) => {
      const user = ensureUser(eco, senderID);

      if (user.coins < bet) {
        safeSend(
          api,
          `❌ Kulang ang iyong coins! Meron ka lamang 🪙 ${user.coins.toLocaleString()} Coins.\nMag-type ng '/coins daily' para sa libreng barya.`,
          threadID,
          messageID
        );
        return eco;
      }

      user.coins -= bet;

      const [r1, r2, r3] = spinReels();
      const { winAmount, resultStatus } = resolveSpin(r1, r2, r3, bet);

      user.coins += winAmount;

      const profitLossText =
        winAmount > 0
          ? `🏆 Nanalo ka ng: +🪙 ${winAmount.toLocaleString()} Coins!`
          : `💸 Nabawas sa taya: -🪙 ${bet.toLocaleString()} Coins`;

      const slotDisplay = `🎰 ═══ [ SANZU CASINO MEGA SLOT ] ═══ 🎰
┌─────────────────────────┐
│     [ ${r1} | ${r2} | ${r3} ]     │  <-- PAYLINE
└─────────────────────────┘
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 Resulta: ${resultStatus}
${profitLossText}
💰 Kasalukuyang Balanse: 🪙 ${user.coins.toLocaleString()} Coins
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      safeSend(api, slotDisplay, threadID, messageID);
      return eco;
    });
  } catch (err) {
    console.error("[megaslot] error:", err);
    safeSend(api, "❌ May naganap na error sa megaslot. Subukan ulit mamaya.", threadID, messageID);
  }
};

module.exports.onStart = module.exports.run;
