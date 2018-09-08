const fs = require('fs');
const imgur = require('imgur');
const stickerService = require('../services/sticker_service.js');

module.exports = {
    name: 'parse',
    args: false,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    execute(message, args) {
        return parseAssets(message);
    }
};

const albumId = 'V7qYbqX';
const assetPath = './assets/';
imgur.setCredentials(process.env.IMGUR_ID, process.env.IMGUR_PASSWORD, process.env.IMGUR_CLIENTID);

async function parseAssets(message) {
    const files = fs.readdirSync(assetPath);
    if (files.length > 0) {
        let i = 0;
        for (i; i < files.length; ++i) {
            try {
                let filePath = assetPath + files[i];
                let stickerName = files[i].split('.')[0];
                let imgJson = await imgur.uploadFile(filePath, albumId);

                await stickerService.add(stickerName, imgJson.data.link, process.env.OWNER_ID, 'VarZ');
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