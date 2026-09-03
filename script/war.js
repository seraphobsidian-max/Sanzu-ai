module.exports = {
  config: {
    name: "war",
    version: "1.0.0",
    author: "Bot Developer",
    countDown: 5,
    role: 2, // 2 = Admin / Bot Operator Only
    shortDescription: {
      en: "Auto GC Name Trash-Talk & Auto Reply"
    },
    longDescription: {
      en: "Spam changes group chat name and automatically trash talks anyone who drops a message."
    },
    category: "war",
    guide: {
      en: "{p}war [on/off]"
    }
  },

  trashTalkList: [
    "Umiyak ka na lang dito haha!",
    "Ano ba yan, walang maipaglaban?",
    "Basura pa rin hanggang ngayon ah!",
    "Matulog ka na lang, hindi mo kaya 'to.",
    "Bakit ka nandito? Walang naghahanap sa'yo!",
    "Chat ka pa, wala namang may paki!"
  ],

  // 1. COMMAND SYSTEM (/war ON AT OFF)
  onStart: async function ({ api, event, args, message, role }) {
    const { threadID } = event;

    // Check kung Admin ang nag-exec
    if (role < 2) {
      return message.reply("⚠️ Admin lang ang pwedeng mag-control ng War Mode!");
    }

    global.sanzuWarState = global.sanzuWarState || {
      active: false,
      interval: null,
      targetThread: null
    };

    const action = args[0] ? args[0].toLowerCase() : "";

    // START WAR (/war o /war on)
    if (action === "on" || action === "start" || !action) {
      if (global.sanzuWarState.active) {
        return message.reply("🔥 War Mode is already ACTIVE!");
      }

      global.sanzuWarState.active = true;
      global.sanzuWarState.targetThread = threadID;

      message.reply("🔥 WAR MODE ACTIVATED! Sisimulan na ang GC Name Spam at Auto-Reply...");

      let counter = 0;
      global.sanzuWarState.interval = setInterval(() => {
        if (!global.sanzuWarState.active) return;

        const randomPhrase = this.trashTalkList[Math.floor(Math.random() * this.trashTalkList.length)];
        const newGCName = `${randomPhrase} [${counter++}]`;

        api.setTitle(newGCName, threadID, (err) => {
          if (err) console.error("Failed to change GC Name:", err);
        });
      }, 3000); // 3 seconds interval

      return;
    }

    // STOP WAR (/war off o mag-command ng "off")
    if (action === "off" || action === "stop") {
      if (!global.sanzuWarState.active) {
        return message.reply("Naka-OFF na ang War Mode.");
      }

      global.sanzuWarState.active = false;
      clearInterval(global.sanzuWarState.interval);
      global.sanzuWarState.interval = null;
      global.sanzuWarState.targetThread = null;

      return message.reply("🛑 WAR MODE DEACTIVATED! Huminto na ang spam.");
    }
  },

  // 2. AUTO-REPLY SYSTEM (Kapag active ang War Mode, tina-trashtalk lahat ng nag-te-text)
  onChat: async function ({ api, event }) {
    if (!global.sanzuWarState || !global.sanzuWarState.active) return;

    const { threadID, senderID, body, type } = event;

    // Direct Guards: Huwag mag-reply kung sariling ID ng bot, or walang text content
    if (type !== "message" || !body || senderID === api.getCurrentUserID()) return;

    // Huwag tumugon kapag sinubukang i-off/on ang command
    const text = body.trim().toLowerCase();
    if (text === "off" || text.includes("/war")) return;

    const randomTrash = this.trashTalkList[Math.floor(Math.random() * this.trashTalkList.length)];

    api.sendMessage({
      body: randomTrash,
      mentions: [{
        tag: `@${senderID}`,
        id: senderID
      }]
    }, threadID);
  }
};
