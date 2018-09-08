const stickerService = require('../services/sticker_service.js');
const isUrl = require('is-url');

module.exports = {
    name: 'add',
    args: true,
    ownerOnly: true,
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
    const url = args[1];

    if (stickerNames.includes(keyword)) {
        return message.reply(`Sorry, the keyword ${keyword} is already taken.`);
    }

    if (!isUrl(url) || (!url.endsWith('.jpg') && !url.endsWith('.png') && !url.endsWith('.gif'))) {
        return message.reply(`Incorrect url, please provide direct link url that ends with .jpg, .png, or .gif`);
    }

    await stickerService.add(keyword, url, message.author.id, message.author.username);
    return message.channel.send(`Added a new sticker with keyword ${keyword}`);
}