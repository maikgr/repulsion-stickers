const stickerService = require('../services/sticker_service.js');
const validUrl = require('valid-url');
const imageService = require('../services/imgur_service.js');

module.exports = {
    name: 'add',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword] [url]',
    execute(message, args) {
        return addSticker(message, args);
    }
};

async function addSticker(message, args) {
    const allStickers = await stickerService.getAll();
    const stickerNames = allStickers.map(s => s.keyword);
    const keyword = args[0];
    let url = args[1];

    if (stickerNames.includes(keyword)) {
        return message.reply(`Sorry, the keyword \`${keyword}\` is already taken.`);
    }

    if (!validUrl.isUri(url)) {
        url = await imageService.upload(url);
        if (!url) {
            return message.reply('failed to read link as a valid url.')
        }
    }

    if (!url.endsWith('.jpg') && !url.endsWith('.png') && !url.endsWith('.gif')) {
        return message.reply('invalid url, please provide direct link url that ends with `.jpg`, `.png`, or `.gif`');
    }

    await stickerService.add(keyword, url, message.author.id, message.author.username);
    return message.channel.send(`Added a new sticker with keyword ${keyword}`);
}