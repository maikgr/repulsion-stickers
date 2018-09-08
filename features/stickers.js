const RichEmbed = require('discord.js').RichEmbed;
const stickerService = require('../services/sticker_service.js');

let stickers = [];
let availableStickerKey;

module.exports = {
    refresh : refreshStickers,
    get : getSticker
}

async function refreshStickers(message) {
    stickers = await stickerService.getAll();
    availableStickerKey = stickers.map(s => s.keyword);
    if (message) message.channel.send("Sticker list updated.");
}

async function getSticker(message, keyword) {
    if (keyword.length < 3) return;

    let stickerKey =  availableStickerKey.find(stickerKey => stickerKey == keyword);
    if (!stickerKey) return;

    let sticker = await stickerService.get(stickerKey);
    const embed = new RichEmbed().setImage(sticker.url);
    return message.channel.send({ embed: embed });
}

refreshStickers();