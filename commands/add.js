const apiService = require('../services/api-service');
const feature = require('../features/stickers');

module.exports = {
    name: 'add',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword] [url]',
    execute: async function (message, args) {
        const keyword = args[0];
        let url = args[1];

        if (!url.endsWith('.jpg') && !url.endsWith('.png') && !url.endsWith('.gif')) {
            return message.reply(' please provide direct link url that ends with `.jpg`, `.png`, or `.gif`');
        }
        
        const newSticker = {
            keyword: keyword,
            url: url,
            upload: {
                id: message.author.id,
                username: message.author.username
            }
        };

        try {
            const result = await apiService.add(newSticker);
            feature.refresh();
            message.channel.send(`Added a new sticker with keyword ${result.keyword}`);
            return;
        } catch (error) {
            return message.reply(error.error.message);
        }
    }
};