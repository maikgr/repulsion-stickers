const Discord = require('discord.js');
const fs = require('fs');
const stickers = require('./features/stickers.js');
const apiService = require('./services/api-service.js');

const client = new Discord.Client();
const keyLetter = process.env.DEFAULT_PREFIX;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await apiService.refreshCache();
  client.user.setActivity(`@me help [v${process.env.VERSION}]`, { type: "LISTENING" });
});

client.on('error', (err) => {
  console.error(err)
});

client.on('message', (msg) => {
  // Ignore all messages from bots
  if (msg.author.bot) return;

  // Check if message is @me commands
  // if (msg.isMemberMentioned(client.user)) {
  //   return executeCommand(msg);
  // }

  // Check if message is ;keywords
  else if (msg.content.startsWith(keyLetter)) {
    const content = msg.content.substring(keyLetter.length);
    const sticker = stickers(content);
    if (sticker) {
      const embed = new Discord.MessageEmbed()
        .setImage(sticker.url)
        .setFooter(sticker.keyword);
      return msg.channel.send(embed);
    }
  }

  return;
});

client.login(process.env.BOT_TOKEN);

const executeCommand = (msg) => {
  const words = msg.content.replace(keyLetter, '').split(/ +/);
  const commandAttempt = words[1].toLowerCase();

  const command = client.commands.get(commandAttempt);
  const args = words.slice(2);
  
  if (!command) return;

  if (command.ownerOnly && msg.author.id !== process.env.OWNER_ID) {
    return msg.reply(`you don't have permission to use this command.`);
  }

  if (command.args && args.length < command.usage.split(' ').length) {
    let reply = "Incorrect command usage.";

    if (command.usage) {
      reply += `\nCommand syntax: \`@me ${commandAttempt} ${command.usage} ${command.optional}\``;
    }

    return msg.reply(reply);
  }

  try {
    return command.execute(msg, args);
  } catch (error) {
    return msg.channel.send(error.message.message);
  }
}
