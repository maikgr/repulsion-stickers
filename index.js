const Discord = require('discord.js');
const S = require('string');
const fs = require('fs');

const client = new Discord.Client();
const cooldowns = new Discord.Collection();

const keyLetter = process.env.DEFAULT_PREFIX;
const cooldownTime = 3000; // miliseconds

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('YOUR BACK', { type: "WATCHING" });
});

client.on('error', (err) => console.error(err));

client.on('message', (msg) => {
    const stickerKeyword = S(msg.content).between(keyLetter, keyLetter).s;
    if (stickerKeyword === ''
        || S(stickerKeyword).contains(' ')
        || msg.author.bot) return;    

    const now = Date.now();
    if (cooldowns.has(msg.author.id)) {
        const timestamp = cooldowns.get(msg.author.id);
        const expirationTime = timestamp + cooldownTime;
        if (now < expirationTime) {
            return;
        }

    } else {
        cooldowns.set(msg.author.id, now);
        setTimeout(() => cooldowns.delete(msg.author.id), cooldownTime);
    }    

    try {
        const files = fs.readdirSync(`./assets/`);
        const sticker = files.find(filename => S(filename).contains(stickerKeyword));
        if (sticker) {
            let stickerPath = `./assets/${sticker}`;
            msg.channel.send('', {files: [stickerPath]});
        }
    } catch (error) {
        console.error(error);
        msg.reply("Error executing command!");
    };
});

client.login(process.env.BOT_TOKEN);