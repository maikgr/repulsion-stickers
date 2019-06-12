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
        embed.setFooter('Sticker Bot version ' + process.env.VERSION)
            .setDescription('To use a sticker, simply type `;keyword;`, or `;keyword?;` to use a random sticker')
            .addField('@me add `[keyword]` `[url or attachment]`', 'Add a new sticker.')
            .addField('@me search `[query]`', 'Search for stickers keyword that matches the query.')
            .addField('@me rename `[keyword]` `[new keyword]`', 'Update a sticker\'s keyword.')
            .addField('@me relink `[keyword]` `[url]`', 'Update a sticker\'s image using an url.')
            .addField('@me reimage `[keyword]` `[attachment]`', 'Update a sticker\'s image using an image attachment.')
            .addField('@me migrate `[keyword]` (Owner)', 'Migrate imgur image to discord.')
            .addField('@me migrate-all (Owner)', 'Migrate all imgur images to discord.')
            .addField('@me cleanup (Owner)', 'Remove unused stickers.')
            .addField('@me help', 'Shows this message.');

        message.channel.send({embed: embed});
    }
};
console.log(`Loaded command help`);
