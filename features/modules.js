const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = {}

for (const commandFile of commandFiles) {
  const command = require(`../commands/${commandFile}`);
  // Exclude owner only commands
  if (!command.ownerOnly) {
    commands[command.name] = command;
  }
}

const execute = (content) => {
  const words = content.split(/ +/);
  const trigger = words[1].toLowerCase();
  const command = commands[trigger];
  if (!command) return;

  const commandArgs = words.slice(2);

  if (command.args && commandArgs.length < command.usage.split(" ").length) {
      let response = "Incorrect command usage.";

      if (command.usage) {
        response += `\nCommand syntax: \`@me ${command.name} ${command.usage} ${command.optional}\``;
      }

      return response;
  }

  return command.execute(commandArgs);
}

module.exports = execute