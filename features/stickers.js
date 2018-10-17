const RichEmbed = require('discord.js').RichEmbed;
const apiService = require('../services/api-service');

let stickers = [];

module.exports.refresh = async function () {
    stickers = await apiService.getAll();
}

module.exports.get = function (message, keyword) {
    if (keyword.length < 3) return;
    try {
        let sticker;
        if (keyword.includes(' ')) {
            sticker = getRandomSticker(keyword);
        } else {
            sticker = getExactSticker(keyword);
        }
        
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

function getExactSticker (keyword) {
    return stickers.find(s => s.keyword === keyword);
}

function getRandomSticker (keyword) {
    keyword = keyword.replace(' ', '');
    const stickerList = stickers.find(s => s.keyword.includes(keyword));
    const randIndex = Math.floor(Math.random() * stickerList.length);
    return stickerList[randIndex];
}

async function updateStickerCount(sticker) {
    const newSticker = {
        keyword: sticker.keyword,
        url: sticker.url,
        useCount: sticker.useCount ? ++sticker.useCount : 1,
        upload: {
            id: sticker.upload.id || process.env.OWNER_ID,
            date: sticker.upload.date || new Date(2018, 8, 28),
            username: sticker.upload.username || 'VarZ'
        }
    }

    await apiService.update(sticker.id, newSticker);
}