const Attachment = require('discord.js').Attachment;
const apiService = require('../services/api-service');
const relink = require('./relink');

module.exports = {
    name: 'migrate',
    args: true,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword]',
    execute: async function (message, args) {
        const sticker = await apiService.get(args[0]);
        if (sticker) {
            message.channel.send(`Migrating ${sticker.keyword} to discord...`);
            message.channel.send(new Attachment(sticker.url))
                .then((msg) => {
                    relink.execute(msg, [sticker.keyword, msg.attachments.first().url ])
                })
                .catch((error) => {
                    message.channel.send('Migration failed.');
                    console.error(error);
                })
        } else {
            message.channel.send(`Cannot find keyword ${args[0]}`);
        }
    }
};