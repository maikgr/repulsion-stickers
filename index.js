const Discord = require('discord.js');
const fs = require('fs');
const sticker = require('./features/stickers.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const keyLetter = process.env.DEFAULT_PREFIX;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    sticker.refresh();
    client.user.setActivity('@me help [v1.14.2]', { type: "LISTENING" });
});

client.on('error', (err) => console.error(err));

client.on('message', (msg) => {
    if (msg.isMemberMentioned(client.user)) {
        return executeCommand(msg);
    }

    const stickerKeyword = msg.content
                            .substring(msg.content.indexOf(keyLetter) + 1, msg.content.lastIndexOf(keyLetter))
                            .replace(keyLetter, '')
                            .replace(/ +/, '');
    if (stickerKeyword !== '' && !stickerKeyword.includes(' ') && !msg.author.bot) {
        return executeSticker(msg, stickerKeyword);
    }
    return;
});

client.login(process.env.BOT_TOKEN);

function executeCommand(msg) {
    const words = msg.content.replace(keyLetter, '').split(/ +/);
    const commandAttempt = words[1].toLowerCase();
    if (commandAttempt === 'refresh') {
        return msg.channel.send("Any update to sticker database is now refreshed automatically, no need to do refresh command.");
    }

    const command = client.commands.get(commandAttempt);
    const args = words.slice(2);
    
    if (!command) return;

    if (command.ownerOnly && msg.author.id !== process.env.OWNER_ID) {
        return msg.reply(`you don't have permission to use this command.`);
    }

    if (command.args && args.length < command.usage.split(' ').length) {
        let reply = "Incorrect command usage.";

        if (command.usage) {
            reply += `\nCommand syntax: \`@Stickers#9966 ${commandAttempt} ${command.usage} ${command.optional}\``;
        }

        return msg.reply(reply);
    }

    try {
        return command.execute(msg, args);
    } catch (error) {
        return msg.channel.send(error.message.message);
    }
}

function executeSticker(msg, stickerKeyword) {
    try {
        return sticker.get(msg, stickerKeyword);
    } catch (error) {
        console.error(error);
        return msg.reply("Error executing command!");
    };
}