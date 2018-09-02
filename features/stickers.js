const fs = require('fs');
const imgur = require('imgur');
const RichEmbed = require('discord.js').RichEmbed;

const stickerService = require('../services/sticker_service.js');

imgur.setCredentials(process.env.IMGUR_ID, process.env.IMGUR_PASSWORD, process.env.IMGUR_CLIENTID);

const albumId = 'V7qYbqX';
const assetPath = './assets/';
let stickers = [];
let availableStickerKey;

module.exports = {
    refresh : refreshStickers,
    get : getSticker,
    parse : parseAssets
}

async function refreshStickers() {
    stickers = await stickerService.getAll();
    availableStickerKey = stickers.map(s => s.keyword);
}

async function getSticker(message, keyword) {
    if (keyword.length < 3) return;

    let stickerKey =  availableStickerKey.find(stickerKey => stickerKey == keyword);
    if (!stickerKey) return;

    let sticker = await stickerService.get(stickerKey);
    const embed = new RichEmbed().setImage(sticker.url);
    return message.channel.send({ embed: embed });
}

async function parseAssets(message) {
    const files = fs.readdirSync(assetPath);
    if (files.length > 0) {
        let i = 0;
        for (i; i < files.length; ++i) {
            try {
                let filePath = assetPath + files[i];
                let stickerName = files[i].split('.')[0];
                let imgJson = await imgur.uploadFile(filePath, albumId);

                await stickerService.add(stickerName, imgJson.data.link);
                fs.unlinkSync(filePath);
            } catch (error) {
                return message.channel.send(error.message.message);
            }
        }
        
        return message.channel.send(`Parsed ${files.length} files.`);
    } else {
        return message.channel.send('No files found.');
    }
}

refreshStickers();