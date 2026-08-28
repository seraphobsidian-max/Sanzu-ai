const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "economy.json");

/**
 * ===== CONCURRENCY FIX =====
 * Dati: bawat call ay gumagawa ng sarili nitong read -> modify -> write.
 * Kapag sabay-sabay (2+ users, o parallel command calls), pwedeng
 * mag-overlap ang mga writes at may mawawalang update (race condition).
 *
 * Solusyon: isang shared "lock queue" (Promise chain) na nagpapatakbo
 * ng bawat operation nang isa-isa lang (serialized), kahit tinawag
 * sila nang sabay-sabay. Dagdag pa: atomic write gamit ang temp file
 * + rename, para hindi masira ang JSON kung biglang na-interrupt
 * ang process habang nagsusulat.
 */
let lockQueue = Promise.resolve();

function withLock(fn) {
  const run = lockQueue.then(() => fn());
  // ikabit ang susunod na operation kahit magka-error ang kasalukuyan,
  // para hindi permanenteng ma-stuck ang queue
  lockQueue = run.catch(() => {});
  return run;
}

function readEconomyDataRaw() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch {
    return {};
  }
}

function writeEconomyDataRaw(data) {
  const tmpPath = dbPath + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmpPath, dbPath); // atomic sa karamihan ng filesystems
}

/**
 * Gamitin ito kapag kailangan mong basahin LANG ang data
 * (walang susunod na pagsusulat, e.g. para sa !balance command).
 */
function getEconomyData() {
  return withLock(() => readEconomyDataRaw());
}

/**
 * Ang pinaka-importante: gamitin ito para sa anumang command na
 * READ -> MODIFY -> WRITE (tulad ng slot, daily, transfer, atbp).
 * Ang buong operation ay isang atomic unit sa loob ng lock, kaya
 * walang ibang command ang makaka-abala sa gitna ng proseso.
 *
 * updaterFn(data) => dapat mag-mutate o mag-return ng bagong data object.
 */
function updateEconomyData(updaterFn) {
  return withLock(() => {
    const data = readEconomyDataRaw();
    const result = updaterFn(data) || data;
    writeEconomyDataRaw(result);
    return result;
  });
}

module.exports.config = {
  name: "slot",
  version: "1.1.0",
  hasPermission: 0,
  credits: "sinzu",
  description: "Maglaro ng Mega Casino Slot Machine gamit ang iyong coins",
  usePrefix: true,
  commandCategory: "Casino",
  usages: "!slot [halaga ng taya]",
  cooldowns: 4
};

const symbols = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎", "7️⃣"];
const payouts = {
  "7️⃣": 10,   // 3x 7️⃣ = 10x ng taya
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
      "⚠️ Mag-lagay ng tamang halaga ng taya.\nHal: !slot 100",
      threadID,
      messageID
    );
  }

  // Ang buong "check balance -> deduct -> spin -> credit winnings" ay
  // isang unit na naka-lock, kaya kahit sabay-sabay mag-!slot ang
  // parehong user (o magkaibang user), hindi sila mag-oo-overlap sa
  // isa't isa at hindi mababaluktot ang coins.
  let resultMessage;

  await updateEconomyData((eco) => {
    if (!eco[senderID]) eco[senderID] = { coins: 1000, lastDaily: 0 };
    const user = eco[senderID];

    if (bet > user.coins) {
      resultMessage = `❌ Kulang ang coins mo. Balance mo: ${user.coins} 🪙`;
      return eco; // walang binago, pero kailangan pa ring i-return/isulat
    }

    // bawasan muna ang taya
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
      `Balance ngayon: ${user.coins} 🪙`;

    return eco;
  });

  return api.sendMessage(resultMessage, threadID, messageID);
};
