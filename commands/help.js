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
        embed.setFooter('Sticker Bot version 1.14.3')
            .setDescription('To use a sticker, simply type ;stickerkeyword;\nTo see the complete list of available stickers, please visit https://varuzu.azurewebsites.net/')
            .addField('@me add `[keyword]` `[url or attachment]`', 'Add a new sticker.')
            .addField('@me search `[query]`', 'Search for stickers keyword that matches the query.')
            .addField('@me update-keyword `[keyword]` `[new keyword]`', 'Update a sticker\'s keyword.')
            .addField('@me update-url `[keyword]` `[url]`', 'Update a sticker\'s image using an url.')
            .addField('@me update-image `[keyword]` `[attachment]`', 'Update a sticker\'s image using an image attachment.')
            .addField('@me help', 'Shows this message.');

        message.channel.send({embed: embed});
    }
};