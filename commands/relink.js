const apiService = require('../services/api-service');
const sanitizer = require('../services/keyword-sanitizer');
const urlValidator = require('../services/url-validator-service');

module.exports = {
  name: 'relink',
  args: true,
  ownerOnly: false,
  cooldown: 3,
  sortIndex: 0,
  usage: '[keyword] [newurl]',
  execute: async function (message, args) {
    const keyword = sanitizer(args[0]);
    let url = urlValidator(args[1]);

    const sentMessage = await message.channel.send(`Relinking image...`);
    
    try {
      const newSticker = await apiService.relink(keyword, url);
      return sentMessage.edit(`Updated ${keyword} url to \`${newSticker.url}\``);
    } catch (error) {
      return sentMessage.edit(error.message || error.error.message);
    }
  }
};
