const Attachment = require('discord.js').Attachment;
const apiService = require('../services/api-service');
const relink = require('./relink');

module.exports = {
    name: 'migrate-all',
    args: false,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    execute: async function (message, args) {
        let stickers = await apiService.getAll();
        stickers = stickers.filter(s => s.url.includes('imgur') && s.useCount > 0);

        if (stickers && stickers.length > 0) {
            for (let i = 0; i < stickers.length; ++i) {
                const sticker = stickers[i];
                message.channel.send(`Migrating ${sticker.keyword} to discord...`);
                message.channel.send(new Attachment(sticker.url))
                    .then((msg) => {
                        relink.execute(msg, [sticker.keyword, msg.attachments.first().url ])
                    })
                    .catch((error) => {
                        msg.channel.send('Migration failed.');
                        console.error(error);
                    });
            }
        } else {
            message.channel.send(`There's nothing to migrate.`);
        }
    }
};