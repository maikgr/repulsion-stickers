const apiService = require('../services/api-service')
const feature = require('../features/stickers');
const uploadService = require('../services/upload-service');

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
        url = url.toLowerCase();

        if (!url.endsWith('.jpg') && !url.endsWith('.png') && !url.endsWith('.gif')) {
            return message.reply(' please provide direct link url that ends with `.jpg`, `.png`, or `.gif`');
        }

        try {
            message = await message.channel.send(`Updating an image with keyword ${keyword}...`)
            const mirror = await uploadService.upload(url);
            const sticker = await apiService.get(keyword);
            const newSticker = {
                keyword: sticker.keyword,
                url: mirror.link,
                useCount: sticker.useCount || 0,
                upload: {
                    id: sticker.upload.id,
                    date: sticker.upload.date,
                    username: sticker.upload.username
                }
            }
            await apiService.update(sticker.id, newSticker);
            feature.refresh();
            return message.edit(`Updated ${sticker.keyword} image.`);
        } catch (error) {
            uploadService.remove(mirror.hash);
            return message.edit(`Cannot proceed, something went wrong.`);
        }
    }
};