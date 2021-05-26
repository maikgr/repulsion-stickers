const apiService = require('../services/api-service');
const sanitizer = require('../services/keyword-sanitizer');

module.exports = {
  name: 'rename',
  args: true,
  ownerOnly: false,
  cooldown: 3,
  sortIndex: 0,
  usage: '[oldkeyword] [newkeyword]',
  execute: async function (message, args) {
    const oldKey = sanitizer(args[0]);
    const newKey = sanitizer(args[1]);

    const sentMessage = await message.channel.send(`Renaming stickers...`);
    try {
      const sticker = await apiService.rename(oldKey, newKey);
      return sentMessage.edit(`Updated ${oldKey} to ${sticker.keyword}.`);
    } catch (error) {
      return sentMessage.edit(error.message || error.error.message);
    }
  }
};