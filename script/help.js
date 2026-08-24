const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "help",
    version: "1.0.0",
    role: 0,
    author: "YourName",
    description: "Ipinapakita ang listahan ng lahat ng magagamit na commands",
    usages: "[command name / pwedeng walang lagay]",
    cooldown: 3
  },

  onRun: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const commandsPath = __dirname; // assuming magkakasama sila sa isang folder

    fs.readdir(commandsPath, (err, files) => {
      if (err) {
        return api.sendMessage("⚠️ Hindi ma-load ang mga commands.", threadID, messageID);
      }

      // Salain ang mga .js files lamang maliban sa sarili nitong file kung gusto mo
      const commandFiles = files.filter(file => file.endsWith('.js'));
      const commandList = [];

      for (const file of commandFiles) {
        try {
          const pull = require(path.join(commandsPath, file));
          if (pull.config && pull.config.name) {
            commandList.push({
              name: pull.config.name,
              description: pull.config.description || "Walang description",
              usages: pull.config.usages || ""
            });
          }
        } catch (e) {
          // Skip kung may error sa pagbasa ng specific file
        }
      }

      // Kung may hinahanap na specific command ang user (hal. /help ai)
      if (args[0]) {
        const cmdName = args[0].toLowerCase();
        const found = commandList.find(c => c.name.toLowerCase() === cmdName);
        
        if (!found) {
          return api.sendMessage(`❌ Ang command na "${args[0]}" ay hindi nahanap.`, threadID, messageID);
        }

        return api.sendMessage(
          `📖 **COMMAND INFO**\n\n` +
          `• **Pangalan:** ${found.name}\n` +
          `• **Description:** ${found.description}\n` +
          `• **Paggamit:** ${found.usages}`,
          threadID,
          messageID
        );
      }

      // Kapag pangkalahatang help list lang ang tiningnan
      let msg = `🤖 **LISTAHAN NG MGA COMMANDS** (${commandList.length})\n\n`;
      commandList.forEach((cmd, index) => {
        msg += `${index + 1}. ${cmd.name} - ${cmd.description}\n`;
      });
      msg += `\n💡 Tip: I-type ang [prefix]help [command name] para sa detalye ng isang command.`;

      return api.sendMessage(msg, threadID, messageID);
    });
  }
};
