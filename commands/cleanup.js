const apiService = require('../services/api-service');

module.exports = {
    name: 'cleanup',
    args: false,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    execute: async function (message, args) {
        let stickers = await apiService.getAll();
        stickers = stickers.filter(s => !s.useCount || s.useCount === 0);

        if (stickers && stickers.length > 0) {
            message = await message.channel.send(`Found ${stickers.length} unused stickers.`);
            for (let i = 0; i < stickers.length; ++i) {
                await apiService.remove(stickers[0].id);
                message.edit(`Cleaning up ${ i + 1 } of ${ stickers.length } stickers...`);
            }
            message.edit(`Cleaned up ${stickers.length} unused stickers.`);
        } else {
            message.channel.send('There is nothing to clean up.');
        }
    }
};