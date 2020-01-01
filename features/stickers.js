const RichEmbed = require('discord.js').RichEmbed;
const apiService = require('../services/api-service');

let stickers = [];

async function refresh () {
    try {
        stickers = await apiService.getAll();
    }
    catch (error) {
        if (error) {
            console.error('Failed to connect to api on startup - retrying in 5 sec', error);
            setTimeout(refresh, 5000);
        }
    }
}

function get (message, keyword) {
    if (keyword.length < 2) return;
    try {
        let sticker;
        if (keyword.endsWith('?')) {
            sticker = getRandomSticker(keyword.replace('?', ''));
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
        let message = error.error && error.error.message;
        if (message) {
            console.error(message);
        } else {
            console.error(error);
        }
        return;
    }
}

function getExactSticker (keyword) {
    return stickers.find(s => s.keyword === keyword);
}

function getRandomSticker (keyword) {
    keyword = keyword.replace(' ', '');
    const stickerList = stickers.filter(s => s.keyword.includes(keyword));
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

module.exports = {
    refresh: refresh,
    get: get,
    stickers: stickers,
    getExactSticker: getExactSticker,
    getRandomSticker: getRandomSticker
}