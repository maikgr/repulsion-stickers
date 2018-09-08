const stickerService = require('../services/sticker_service.js');
const isUrl = require('is-url');
const S = require('string');

module.exports = {
    name: 'update-url',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword] [newurl]',
    execute(message, args) {
        return updateKeyword(message, args);
    }
};

async function updateKeyword(message, args) {
    const keyword = args[0];
    const url = args[1];
    const stickerKeys = (await stickerService.getAll()).map(s => s.keyword);

    if(!stickerKeys.includes(keyword)) {
        return message.reply(`Cannot find sticker with keyword ${keyword}.`);
    }

    if (!isUrl(url) || url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif')) {
        return message.reply(`Incorrect url, please provide direct link url that ends with .jpg, .png, or .gif`);
    }

    await stickerService.updateImage(keyword, url);
    return message.reply(`Updated ${keyword} image.`)
}