const fs = require('fs');
const path = require('path');

// Path para i-save ang settings ng bawat GC
const dbPath = path.join(__dirname, 'autoreply_data.json');

// Helper para magbasa at magsulat ng data
function loadData() {
  if (!fs.existsSync(dbPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "autoreply",
    version: "1.0.0",
    role: 0,
    author: "YourName",
    description: "Nagbibigay ng awtomatikong reply sa kahit anong chat na may on/off at custom message.",
    usages: "[on/off/set] [mensahe kung magse-set]",
    cooldown: 3
  },

  onRun: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const action = args[0] ? args[0].toLowerCase() : "";
    let data = loadData();

    if (!data[threadID]) {
      data[threadID] = { active: false, replyMessage: "Hello! Auto-reply ito ng bot." };
    }

    // 1. Command para I-ON
    if (action === "on") {
      data[threadID].active = true;
      saveData(data);
      return api.sendMessage("🟢 Tagumpay! Naka-ON na ang autoreply sa GC na ito.", threadID, messageID);
    }

    // 2. Command para I-OFF
    if (action === "off") {
      data[threadID].active = false;
      saveData(data);
      return api.sendMessage("🔴 Tagumpay! Naka-OFF na ang autoreply sa GC na ito.", threadID, messageID);
    }

    // 3. Command para PALITAN ang reply message
    if (action === "set") {
      const newReply = args.slice(1).join(" ");
      if (!newReply) {
        return api.sendMessage("⚠️ Mangyaring maglagay ng bagong mensahe. Halimbawa: /autoreply set Busy pa po si owner.", threadID, messageID);
      }
      data[threadID].replyMessage = newReply;
      saveData(data);
      return api.sendMessage(`✅ Matagumpay na nabago ang autoreply message sa:\n\n"${newReply}"`, threadID, messageID);
    }

    // Kung walang tamang argument, ipakita ang status
    return api.sendMessage(
      `🤖 **AUTOREPLY SETTINGS**\n\n` +
      `• Status: ${data[threadID].active ? "Naka-ON 🟢" : "Naka-OFF 🔴"}\n` +
      `• Kasalukuyang Reply: "${data[threadID].replyMessage}"\n\n` +
      `💡 Mga Gamit:\n` +
      `- !autoreply on\n` +
      `- !autoreply off\n` +
      `- !autoreply set [bagong mensahe]`,
      threadID,
      messageID
    );
  },

  // Event listener para saluhin ang lahat ng chat ng members
  onChat: async ({ api, event }) => {
    const { threadID, senderID, body } = event;
    
    // Huwag pansinin kung ang bot ang nag-chat para iwasan ang endless loop
    if (senderID === api.getCurrentUserID() || !body) return;

    const data = loadData();
    const threadData = data[threadID];

    // Kung naka-on ang autoreply sa GC na ito at hindi ito command (hindi nagsisimula sa prefix)
    if (threadData && threadData.active) {
      // Pwede kang maglagay ng sarili mong prefix check kung meron ka
      if (body.startsWith("!") || body.startsWith("/")) return; 

      return api.sendMessage(threadData.replyMessage, threadID);
    }
  }
};
