const RichEmbed = require('discord.js').RichEmbed;
const stickerService = require('../services/sticker_service.js');
const apiService = require('../services/api-service');

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
    try {
        const sticker = await apiService.get(keyword);
        if (sticker) {
            const embed = new RichEmbed().setImage(sticker.url);
            message.channel.send({ embed: embed });
            updateStickerCount(sticker);
        }
        return;
    }
    catch (error) {
        console.log('[sticker.js]')
        console.error(error);
        return;
    }
}

async function updateStickerCount(sticker) {
    const newSticker = {
        keyword: sticker.keyword,
        url: sticker.url,
        useCount: sticker.useCount ? ++useCount : 1,
        upload: {
            id: sticker.upload.id || process.env.OWNER_ID,
            username: sticker.upload.username || 'VarZ'
        }
    }

    await apiService.update(sticker.id, newSticker);
}

refreshStickers();