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
            let stickers = await apiService.search(query);
            const embed = new RichEmbed();
            
            if (!stickers || stickers.length === 0) {
                return message.reply(` no stickers keyword matching ${query}.`);
            }

            if (stickers && stickers.length > 10) {
                embed.setTitle(`Showing top 10 results matching ${query}`);
                stickers = stickers.slice(0, 9);
            }

            embed.setDescription(stickers.map(s => s.keyword).join('\n'));
            return message.reply({ embed: embed });
        } catch (error) {
            return message.reply(error.error.message || error.statusMessage);
        }
    }
};
console.log(`Loaded command search`);
