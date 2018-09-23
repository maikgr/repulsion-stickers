const apiService = require('../services/api-service')
const feature = require('../features/stickers');

module.exports = {
    name: 'update-image',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword]',
    optional: '[attachment]',
    execute: async function (message, args) {
        const keyword = args[0];
        const attachment = message.attachments.first();
        let url = attachment.url;

        try {
            const sticker = await apiService.get(keyword);
            const newSticker = {
                keyword: sticker.keyword,
                url: url,
                useCount: sticker.useCount || 0,
                upload: {
                    id: sticker.upload.id,
                    username: sticker.upload.username
                }
            }
            const result = await apiService.update(sticker.id, newSticker);
            feature.refresh();
            return message.reply(`Updated ${sticker.keyword} image.`);
        } catch (error) {
            return message.reply(error.error.message || error.statusMessage);
        }
    }
};