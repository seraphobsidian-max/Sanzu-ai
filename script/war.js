global.activeWarThreads = global.activeWarThreads || new Map();

module.exports = {
	config: {
		name: "war",
		version: "1.0.0",
		author: "SinzuBot",
		countDown: 5,
		role: 1, // 1 = Admin Only (Bot Admin / Group Admin)
		shortDescription: "I-activate ang auto-trashtalk war mode sa GC",
		longDescription: "Kahit anong i-chat ng tao sa GC ay automatic na ttrashtalkin ng bot habang naka-ON.",
		category: "war",
		guide: "{p}war [stop/off]"
	},

	onStart: async function ({ api, event, args, permission }) {
		const { threadID, messageID, senderID } = event;
		const action = args[0]?.toLowerCase();

		// Check permission: Siguraduhing Admin (role >= 1) ang gumagamit
		if (permission < 1) {
			return api.sendMessage("⚠️ **Admin Only**: Mga Admin lang sa GC o Bot Admin ang pwedeng mag-control ng War Mode!", threadID, messageID);
		}

		// STOP / OFF COMMAND: /war stop o /war off
		if (action === "stop" || action === "off" || action === "unlock") {
			if (global.activeWarThreads.has(threadID)) {
				global.activeWarThreads.delete(threadID);
				return api.sendMessage("🛑 **WAR MODE OFF**: Inihinto na ng Admin ang trashtalk war sa GC na ito!", threadID, messageID);
			} else {
				return api.sendMessage("⚠️ Walang aktibong War Mode sa GC na ito.", threadID, messageID);
			}
		}

		// I-check kung Naka-ON na
		if (global.activeWarThreads.has(threadID)) {
			return api.sendMessage("🔥 Naka-ON na ang War Mode sa GC na ito!\nI-type ang `/war stop` para patayin.", threadID, messageID);
		}

		// I-set sa global state na AKTIBO ang war
		global.activeWarThreads.set(threadID, { index: 0 });

		const prefix = process.env.PREFIX || "/";
		const startMsg = `⚔️ **WAR MODE ACTIVATED!** ⚔️\n\nKahit anong ilapag o i-chat niyo sa GC na 'to, automatic kayong ttrashtalkin ng SinzuBot!\n\n💡 *Para ihinto, i-type ng Admin ang: \`${prefix}war stop\`*`;

		return api.sendMessage(startMsg, threadID);
	}
};
