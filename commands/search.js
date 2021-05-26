const apiService = require('../services/api-service');
const MessageEmbed = require('discord.js').MessageEmbed;
const sanitizer = require('../services/keyword-sanitizer');

module.exports = {
  name: "search",
  args: true,
  ownerOnly: false,
  cooldown: 3,
  sortIndex: 0,
  usage: "[query]",
  execute: async function (message, args) {
    const query = sanitizer(args[0]);
    const sentMessage = await message.channel.send("Searching...");

    let stickers;
    try {
      stickers = await apiService.search(query);
    } catch (error) {
      return sentMessage.edit(error.message || error.statusMessage);
    }
    
    if (!stickers || stickers.length === 0) {
      return sentMessage.edit(`No stickers with keyword ${query} found.`);
    }

    const embed = new MessageEmbed();
    
    // Display results in rows and columns
    const MAX_ROWS = 10;
    const MAX_COLUMNS = 3;
    
    const availableColumns = Math.min(Math.ceil(stickers.length/MAX_ROWS), MAX_COLUMNS);
    const resultCount = stickers.length;
    let displayCount = 0;
    for (let i = 0; i < availableColumns; ++i) {
      const startIndex = MAX_ROWS * i;
      const endIndex = Math.min(startIndex + MAX_ROWS, stickers.length);
      const displayStickers = stickers.slice(startIndex, endIndex);
      displayCount += displayStickers.length;
      embed.addField(`Result ${i + 1}`, displayStickers.map(s => s.keyword).join("\n"), true);
    }

    return sentMessage.edit(`Showing ${displayCount} of ${resultCount} results matching \`${query}\``, { embed });
  }
};
