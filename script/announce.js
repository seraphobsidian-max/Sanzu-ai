module.exports.config = {
  name: "announce",
  version: "1.0.0",
  hasPermssion: 2, // 2 is usually for Bot Admins only
  credits: "Developer",
  description: "Mag-announce ng mensahe sa lahat ng Group Chats kung saan kasali ang bot.",
  commandCategory: "admin",
  usages: "[mensahe]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  // Combine all arguments to form the message
  const message = args.join(" ");
  
  if (!message) {
    return api.sendMessage("⚠️ Pakilagay ang mensahe na gusto mong i-announce.\nFormat: !announce [mensahe]", event.threadID);
  }

  api.sendMessage("⏳ Nagsisimula na i-send ang announcement sa mga GCs...", event.threadID);

  try {
    // Fetch recent threads from the bot's inbox
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    let successCount = 0;
    let failedCount = 0;

    for (const thread of threadList) {
      // Check if the thread is a group chat
      if (thread.isGroup) {
        try {
          // Send the message to the group
          await api.sendMessage(`[ 📢 𝗕𝗢𝗧 𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧 ]\n\n${message}`, thread.threadID);
          successCount++;
          
          // Small delay (1 second) to prevent the bot from getting flagged/banned by Facebook for spamming
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          failedCount++; // Counts GCs where the bot is muted or removed
        }
      }
    }

    // Send the final report back to the admin who used the command
    return api.sendMessage(`✅ 𝗕𝗿𝗼𝗮𝗱𝗰𝗮𝘀𝘁 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!\n\nNa-send sa ${successCount} na GCs.\nFailed: ${failedCount}`, event.threadID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ May nangyaring error habang kinukuha ang listahan ng mga GC.", event.threadID);
  }
};
