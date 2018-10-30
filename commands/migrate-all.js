const Attachment = require('discord.js').Attachment;
const stickerFeature = require('../features/stickers');
const updateUrl = require('./update-url');

module.exports = {
    name: 'migrate-all',
    args: false,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    execute: function (message, args) {
        let stickers = stickerFeature.stickers;
        stickers = stickers.filter(s => s.url.includes('imgur') && s.useCount && s.useCount > 0);

        if (stickers) {
            for (let i = 0; i < stickers.length; ++i) {
                const sticker = stickers[i];
                message.channel.send(`Migrating ${sticker.keyword} to discord...`);
                message.channel.send(new Attachment(sticker.url))
                    .then((msg) => {
                        updateUrl.execute(msg, [sticker.keyword, msg.attachments.first().url ])
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