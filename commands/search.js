const apiService = require('../services/api-service');
const RichEmbed = require('discord.js').RichEmbed;

module.exports = {
    name: 'search',
    args: true,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '[query]',
    execute: async function (message, args) {
        const query = args[0];

        try {
            message = await message.channel.send(`Connecting to API...`);

            let stickers = await apiService.search(query);
            const embed = new RichEmbed();
            
            if (!stickers || stickers.length === 0) {
                return message.edit(`No stickers with keyword ${query} found.`);
            }

            if (stickers && stickers.length > 10) {
                embed.setTitle(`Showing top 10 results matching ${query}`);
                stickers = stickers.slice(0, 10);
            }

            embed.setDescription(stickers.map(s => s.keyword).join('\n'));
            return message.edit({ embed: embed });
        } catch (error) {
            return message.edit(error.message || error.statusMessage);
        }
    }
};
