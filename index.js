const Discord = require('discord.js');
const stickers = require('./features/stickers.js');
const modules = require('./features/modules.js');
const apiService = require('./services/api-service.js');

const client = new Discord.Client();
const keyLetter = process.env.DEFAULT_PREFIX;
const mentionString = "<@!";

// Bot Invites https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=50176

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await apiService.refreshCache();
  client.user.setActivity(`@me help [v${process.env.VERSION}]`, { type: "LISTENING" });
});

client.on('error', (err) => {
  console.error(err)
});

client.on('message', async (message) => {
  // Ignore all messages from bots
  if (message.author.bot) return;

  //Check if message is @me commands
  if (message.content.startsWith(mentionString) && message.mentions.users.first().equals(client.user)) {
    return modules(message);
  }

  // Check if message is ;keywords
  else if (message.content.startsWith(keyLetter)) {
    const content = message.content.substring(keyLetter.length);
    const sticker = stickers(content);
    if (sticker) {
      const embed = new Discord.MessageEmbed()
        .setImage(sticker.url)
        .setFooter(sticker.keyword);
      return message.channel.send(embed);
    }
  }

  return;
});

client.login(process.env.BOT_TOKEN);
