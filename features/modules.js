const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = {}
const refactoredCommands = ["add"]

for (const commandFile of commandFiles) {
  // (WIP) only add refactored command modules

  const command = require(`../commands/${commandFile}`);
  // Exclude owner only commands
  if (!command.ownerOnly && refactoredCommands.includes(command.name)) {
    commands[command.name] = command;
    console.log("Loaded command", command.name);
  }
}

const execute = (message) => {
  const words = message.content.split(/ +/);
  const trigger = words[1].toLowerCase();
  const command = commands[trigger];
  const commandArgs = words.slice(2);
  
  if (!command) return;

  if (command.args && commandArgs.length < command.usage.split(" ").length) {
    let response = "Incorrect command usage.";

    if (command.usage) {
      response += `\nCommand syntax: \`@me ${command.name} ${command.usage} ${command.optional}\``;
    }

    return response;
  }

  return command.execute(message, commandArgs);
}

module.exports = execute