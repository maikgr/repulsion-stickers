const request = require('request-promise-native');
const apiService = require('../services/api-service');
const stickers = require('../features/stickers');

module.exports = {
    name: 'buffer',
    args: true,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '[keyword]',
    optional: '[url or attachment]'
}

module.exports.execute = async function (message, args) {
    const sticker = stickers.getExactSticker(args[0]);
    if (!sticker) return;

    request.get({ url: sticker.url, encoding: null }, (err, res, body) => {
        sticker.buffer = JSON.stringify(body);
        apiService.update(sticker.id, sticker)
            .then(() => {
                console.log('done!');
            })
            .catch((error) => {
                console.error(error);
            });
    });
}

console.log(`Loaded command buffer`);
