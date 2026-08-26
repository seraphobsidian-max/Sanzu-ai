module.exports = {
  config: {
    name: "announce",
    aliases: ["announcement", "broadcast", "bc"],
    version: "1.0.0",
    role: 1,
    hasPrefix: true,
    description: "Mag-broadcast ng announcement sa lahat ng GC",
    usage: "!announce [message]",
    credits: "sinzu",
    cooldown: 30
  },

  run: async ({ api, event, args }) => {
    if (!args.length) {
      return api.sendMessage(
        "📢 Usage:\n!announce [message]\n\nExample:\n!announce Maintenance mamayang 10PM.",
        event.threadID,
        event.messageID
      );
    }

    const message = args.join(" ");

    const announcement = `╔══════════════════════════╗
       📢 𝐒𝐀𝐍𝐙𝐔 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓
╚══════════════════════════╝

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 Official Bot Announcement
🤖 SANZU BOT`;

    try {
      /*
       * Kunin ang thread IDs na kilala ng bot.
       * Ipinapakita muna dito ang kasalukuyang thread bilang fallback.
       */
      const threadIDs = new Set();

      if (event.threadID) {
        threadIDs.add(event.threadID);
      }

      /*
       * Kung supported ng FCA version mo ang getThreadList,
       * kunin ang mga thread na available sa account.
       */
      if (typeof api.getThreadList === "function") {
        const threads = await new Promise((resolve, reject) => {
          api.getThreadList(
            100,
            null,
            ["INBOX"],
            (err, data) => {
              if (err) return reject(err);
              resolve(data || []);
            }
          );
        });

        for (const thread of threads) {
          if (
            thread &&
            thread.threadID &&
            thread.isGroup
          ) {
            threadIDs.add(thread.threadID);
          }
        }
      }

      if (!threadIDs.size) {
        return api.sendMessage(
          "❌ Walang GC na nakita.",
          event.threadID,
          event.messageID
        );
      }

      let sent = 0;
      let failed = 0;

      for (const threadID of threadIDs) {
        try {
          await api.sendMessage(
            announcement,
            threadID
          );

          sent++;

          // Small delay para hindi biglang sabay-sabay
          await new Promise(resolve =>
            setTimeout(resolve, 1000)
          );

        } catch (error) {
          failed++;
          console.error(
            `Failed to announce to ${threadID}:`,
            error.message
          );
        }
      }

      return api.sendMessage(
        `✅ ANNOUNCEMENT SENT

📢 Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Successfully sent: ${sent}
❌ Failed: ${failed}
📊 Total GC processed: ${threadIDs.size}`,
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error("Global announce error:", error);

      return api.sendMessage(
        `❌ Nagkaroon ng error sa global announcement.\n\n${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
