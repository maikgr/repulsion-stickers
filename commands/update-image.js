const apiService = require('../services/api-service')
const feature = require('../features/stickers');
const uploadService = require('../services/upload-service');
const urlValidator = require('../services/url-validator-service');
const messageParser = require('../services/message-parser');

module.exports = {
    name: 'update-image',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword]',
    optional: '[attachment]',
    execute: async function (message, args) {
        let request = messageParser.parse(message, args);

        if (!urlValidator.validate(request.url)) {
            return message.reply(` please provide direct link url that ends with \`${urlValidator.extensions.join('\`, \`')}\``);
        }
        
        let deleteHash;
        try {
            message = await message.channel.send(`Updating an image with keyword ${request.keyword}...`)

            const sticker = await apiService.get(request.keyword);
            const newSticker = {
                keyword: sticker.keyword,
                url: request.url,
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
            uploadService.remove(deleteHash);
            return message.edit(`Cannot proceed, something went wrong.`);
        }
    }
};
console.log(`Loaded command update-image`);
