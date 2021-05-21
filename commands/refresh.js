const stickers = require('../features/stickers');

module.exports = {
    name: 'refresh',
    args: false,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    optional: ''
}

module.exports.execute = async function (message, args) {
    await stickers.refresh();
    message.channel.send('Done.')
}
