const RichEmbed = require('discord.js').RichEmbed;

module.exports = {
    name: 'help',
    args: false,
    ownerOnly: false,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    execute: async function (message, args) {
        const embed = new RichEmbed();
        embed.setFooter('Sticker Bot version 1.11')
            .setDescription('To use a sticker, simply type ;stickerkeyword;\nTo see the complete list of available stickers, please visit https://varuzu.azurewebsites.net/')
            .addField('@Stickers#9966 add `[keyword]` `[url or attachment]`', 'Add a new sticker.')
            .addField('@Stickers#9966 search `[query]`', 'Search for stickers keyword that matches the query.')
            .addField('@Stickers#9966 update-keyword `[keyword]` `[new keyword]`', 'Update a sticker\'s keyword')
            .addField('@Stickers#9966 update-url `[keyword]` `[url]`', 'Update a sticker\'s image url')
            .addField('@Stickers#9966 help', 'Shows this message');

        message.channel.send({embed: embed});
    }
};