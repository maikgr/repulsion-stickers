const apiService = require('../services/api-service')
const feature = require('../features/stickers');

module.exports = {
    name: 'update-url',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword] [newurl]',
    execute: async function (message, args) {
        const keyword = args[0];
        const url = args[1].toLowerCase();
        
        try {
            const sticker = await apiService.get(keyword);
            const newSticker = {
                keyword: sticker.keyword,
                url: url,
                useCount: sticker.useCount || 0,
                upload: {
                    id: sticker.upload.id,
                    date: sticker.upload.date,
                    username: sticker.upload.username
                }
            }
            const result = await apiService.update(sticker.id, newSticker);
            feature.refresh();
            return message.reply(`Updated ${sticker.keyword} url to ${result.url}.`);
        } catch (error) {
            return message.reply(error.error.message);
        }
    }
};