global.activeWarNameThreads = global.activeWarNameThreads || new Map();

const gcWarTrashTalks = [
	"INUTIL MGA TAO DITO 😂",
	"WALANG MGA MAIBUGA HINA",
	"IYAKIN MGA MIYEMBRO RITO",
	"SINZUBOT OWNED THIS GC 🔥",
	"LALABAN PA BA KAYO AH?",
	"PANALO NA SI SINZUBOT",
	"TULOG MO NA YAN HINA MO",
	"PURO KAYO TALAK WALA MGA LAKAS",
	"TAKOT PALAGAN SI SINZUBOT"
];

module.exports = {
	config: {
		name: "war",
		version: "1.0.0",
		author: "SinzuBot",
		countDown: 3,
		role: 1, // Admin Only
		shortDescription: "Tuloy-tuloy na pagpalit ng GC Name hangga't 'di pinapatahy",
		longDescription: "Magse-send ng tuloy-tuloy na pagpapalit ng GC Name gamit ang loop hangga't hindi pina-stop ng admin.",
		category: "war",
		guide: "{p}war [stop/off]"
	},

	onStart: async function ({ api, event, args, permission }) {
		const { threadID, messageID } = event;
		const action = args[0]?.toLowerCase();

		// Check permission: Admin Only
		if (permission < 1) {
			return api.sendMessage("⚠️ **Admin Only**: Mga Admin lang ang pwedeng mag-activate o mag-deactivate ng War Mode!", threadID, messageID);
		}

		// STOP / OFF COMMAND: /war stop
		if (action === "stop" || action === "off" || action === "unlock") {
			if (global.activeWarNameThreads.has(threadID)) {
				// Clear ang interval para huminto ang loop
				const intervalId = global.activeWarNameThreads.get(threadID);
				clearInterval(intervalId);
				global.activeWarNameThreads.delete(threadID);

				return api.sendMessage("🛑 **WAR MODE OFF**: Inihinto na ng Admin ang tuloy-tuloy na GC Name war!", threadID, messageID);
			} else {
				return api.sendMessage("⚠️ Walang aktibong War Mode sa GC na ito.", threadID, messageID);
			}
		}

		// Kapag Naka-ON na
		if (global.activeWarNameThreads.has(threadID)) {
			return api.sendMessage("🔥 Naka-ON na at tumatakbo na ang GC Name War sa GC na ito!\nI-type ang `/war stop` para ihinto.", threadID, messageID);
		}

		const prefix = process.env.PREFIX || "/";
		api.sendMessage(`⚔️ **PERPETUAL GC NAME WAR ACTIVATED!** ⚔️\n\nHindi titigil ang bot sa pagpapalit ng pangalan ng GC hangga't hindi mo pinapatay!\n\n💡 *Para ihinto, i-type ng Admin: \`${prefix}war stop\`*`, threadID);

		let index = 0;

		// Mag-set ng Loop Interval (nagpapalit ng pangalan ng GC bawat 3 seconds)
		const intervalId = setInterval(() => {
			const newName = gcWarTrashTalks[index % gcWarTrashTalks.length];
			index++;

			api.setTitle(newName, threadID, (err) => {
				if (err) console.error("Error setting continuous GC Title:", err);
			});
		}, 3000); // 3 seconds delay bawat palit para iwas-ban ng Facebook

		// I-save ang interval ID sa global state para mapatay kapag nag /war stop
		global.activeWarNameThreads.set(threadID, intervalId);
	}
};
