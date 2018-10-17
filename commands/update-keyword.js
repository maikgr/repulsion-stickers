const apiService = require('../services/api-service');
const feature = require('../features/stickers');

module.exports = {
    name: 'update-keyword',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[oldkeyword] [newkeyword]',
    execute: async function (message, args) {
        const oldKey = args[0];
        const newKey = args[1];

        try {
            const sticker = await apiService.get(oldKey);
            const newSticker = {
                keyword: newKey,
                url: sticker.url,
                useCount: sticker.useCount || 0,
                upload: {
                    id: sticker.upload.id,
                    date: sticker.upload.date,
                    username: sticker.upload.username
                }
            }
            const result = await apiService.update(sticker.id, newSticker);
            feature.refresh();
            return message.reply(`Updated ${sticker.keyword} to ${result.keyword}.`);
        } catch (error) {
            return message.reply(error.error.message);
        }
    }
};