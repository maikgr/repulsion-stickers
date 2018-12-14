const apiService = require('../services/api-service');
const feature = require('../features/stickers');
const uploadService = require('../services/upload-service');
const urlValidator = require('../services/url-validator-service');
const messageParser = require('../services/message-parser');

module.exports = {
    name: 'add',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword]',
    optional: '[url or attachment]',
    execute: async function (message, args) {
        let request = messageParser.parse(message, args);
        if (!urlValidator.validate(request.url)) {
            return message.reply(` please provide direct link url that ends with \`${urlValidator.extensions.join('\`, \`')}\``);
        }
        let deleteHash;
        try {
            message = await message.channel.send(`Adding new image with keyword ${request.keyword}...`);
            // if (request.url.includes('discordapp')) {
            //     const imgurData = await uploadService.upload(request.url);
            //     request.url = imgurData.link;
            //     deleteHash = imgurData.hash;
            // }

            const newSticker = {
                keyword: request.keyword,
                url: request.url,
                upload: {
                    id: request.author.id,
                    date: new Date(),
                    username: request.author.username
                }
            };

            const result = await apiService.add(newSticker);
            feature.refresh();
            message.edit(`Added a new sticker with keyword ${result.keyword}`);
            return;
        } catch (error) {
            await uploadService.remove(deleteHash);
            if (error.error.code === 400) {
                return message.edit(`${request.keyword} already exists.`)
            }
            return message.edit(`Cannot proceed, something went wrong.`);
        }
    }
};

console.log(`Loaded command add`);