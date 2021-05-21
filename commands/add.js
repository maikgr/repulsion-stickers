const apiService = require('../services/api-service');
const urlValidator = require('../services/url-validator-service');

module.exports = {
  name: 'add',
  args: true,
  ownerOnly: false,
  cooldown: 3,
  sortIndex: 0,
  usage: '[keyword]',
  optional: '[url or attachment]',
  execute: async function (message, args) {
    const keyword = args[0];
    const url = args[1];
    if (!urlValidator.validate(url)) {
      return message.reply(`\`${url}\` isn't a valid HTTP url.`);
    }

    if (apiService.hasKeyword(keyword)) {
      return message.reply(`\`${keyword}\` already exists.`);

    }

    const sentMessage = await message.channel.send(`Uploading sticker...`);

    try {

      const sticker = {
        keyword,
        url,
        upload: {
          id: message.author.id,
          date: new Date(),
          username: message.author.username
        }
      };

      const result = await apiService.add(sticker);
      return sentMessage.edit(`Added a new sticker with keyword ${result.keyword}`);
    } catch (error) {
      console.error(error)
      return sentMessage.edit(`Cannot proceed, something went wrong.`);
    }
  }
};