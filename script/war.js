module.exports = {
  config: {
    name: "war",
    version: "1.0.0",
    author: "Bot Developer",
    countDown: 5,
    role: 2, // 2 = Admin / Bot Operator Only
    shortDescription: {
      en: "Spam GC Name and Auto Trash Talk"
    },
    longDescription: {
      en: "Automated GC Name change spam and auto-reply trash talker."
    },
    category: "war",
    guide: {
      en: "{p}war [on/off]"
    }
  },

  // Mga gagamiting salita / pang-trashtalk
  trashTalkList: [
    "Umiyak ka na lang dito haha!",
    "Ano ba yan, walang maipaglaban?",
    "Basura pa rin hanggang ngayon ah!",
    "Matulog ka na lang, hindi mo kaya 'to.",
    "Bakit ka nandito? Walang naghahanap sa'yo!",
    "Chat ka pa, wala namang may paki!"
  ],

  // Global State Variable para sa Sanzu
  onStart: async function ({ api, event, args, message, role }) {
    const { threadID } = event;

    // Direct Check kung Admin ang nag-run
    if (role < 2) {
      return message.reply("⚠️ Admin lang ang pwedeng gumamit ng war command!");
    }

    global.sanzuWarState = global.sanzuWarState || {
      active: false,
      interval: null,
      targetThread: null
    };

    const action = args[0] ? args[0].toLowerCase() : "";

    // ACTIVATION METHOD (/war o /war on)
    if (action === "on" || action === "start" || !action) {
      if (global.sanzuWarState.active) {
        return message.reply("🔥 War Mode is already ACTIVE in this group!");
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
      }, 3000); // Tumatakbo bawat 3 seconds

      return;
    }

    // DEACTIVATION METHOD (/war off o mag-type ng "off")
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

  // AUTO-REPLY ENGINE (Tumitira sa kahit kaninong mag-drop ng chat habang ACTIVE ang war)
  onChat: async function ({ api, event, message }) {
    if (!global.sanzuWarState || !global.sanzuWarState.active) return;

    const { threadID, senderID, body, type } = event;

    // Wag mag-reply kung sariling chat ng bot, o kung walang text
    if (type !== "message" || !body || senderID === api.getCurrentUserID()) return;

    // Iniiwasang basahin ang stop/off command bilang trigger ng reply
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
