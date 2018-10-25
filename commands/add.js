const apiService = require('../services/api-service');
const feature = require('../features/stickers');
const uploadService = require('../services/upload-service');

module.exports = {
    name: 'add',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword]',
    optional: '[url or attachment]',
    execute: async function (message, args) {
        const keyword = args[0].replace('?', '');
        const author = message.author;
        let attachment = message.attachments.first();
        let url = args[1] || attachment.url;
        url = url.toLowerCase();
        if (!url.endsWith('.jpg') && !url.endsWith('.png') && !url.endsWith('.gif')) {
            return message.reply(' please provide direct link url that ends with `.jpg`, `.png`, or `.gif`');
        }
        
        try {
            message = await message.channel.send(`Adding new image with keyword ${keyword}...`)
            const mirror = await uploadService.upload(url);
            const newSticker = {
                keyword: keyword,
                url: mirror.link,
                upload: {
                    id: author.id,
                    date: new Date(),
                    username: author.username
                }
            };

            const result = await apiService.add(newSticker);
            feature.refresh();
            message.edit(`Added a new sticker with keyword ${result.keyword}`);
            return;
        } catch (error) {
            uploadService.remove(mirror.hash);
            if (error.error.code === 400) {
                return message.edit(`${keyword} already exists.`)
            }
            return message.edit(`Cannot proceed, something went wrong.`);
        }
    }
};