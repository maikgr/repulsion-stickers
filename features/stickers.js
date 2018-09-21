const RichEmbed = require('discord.js').RichEmbed;
const apiService = require('../services/api-service');

let stickers = [];

module.exports.refresh = async function () {
    stickers = await apiService.getAll();
}

module.exports.get = async function (message, keyword) {
    if (keyword.length < 3) return;
    try {
        const sticker = stickers.find(s => s.keyword === keyword);
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
        useCount: sticker.useCount ? ++sticker.useCount : 1,
        upload: {
            id: sticker.upload.id || process.env.OWNER_ID,
            username: sticker.upload.username || 'VarZ'
        }
    }

    await apiService.update(sticker.id, newSticker);
}