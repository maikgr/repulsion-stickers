const stickerService = require('../services/sticker_service.js');

module.exports = {
    name: 'update-keyword',
    args: true,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '[oldkeyword] [newkeyword]',
    execute(message, args) {
        return updateKeyword(message, args);
    }
};

async function updateKeyword(message, args) {
    const oldKey = args[0];
    const newKey = args[1];
    const stickerKeys = (await stickerService.getAll()).map(s => s.keyword);

    if(!stickerKeys.includes(oldKey)) {
        return message.reply(`Cannot find sticker with keyword ${oldKey}.`);
    }

    if(stickerKeys.includes(newKey)) {
        return message.reply(`Sorry, the keyword ${newKey} is already taken.`);
    }

    await stickerService.updateKeyword(oldKey, newKey);
    return message.reply(`Updated ${oldKey} to ${newKey}.`)
}