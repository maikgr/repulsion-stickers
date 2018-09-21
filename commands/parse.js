const fs = require('fs');
const assetPath = './assets/';

module.exports = {
    name: 'parse',
    args: false,
    ownerOnly: true,
    cooldown: 3,
    sortIndex: 0,
    usage: '',
    execute(message, args) {
        return;
        //return parseAssets(message);
    }
};

// async function parseAssets(message) {
//     const files = fs.readdirSync(assetPath);
//     if (files.length > 0) {
//         let i = 0;
//         for (i; i < files.length; ++i) {
//             try {
//                 let filePath = assetPath + files[i];
//                 let stickerName = files[i].split('.')[0];
//                 let link = await imageService.upload(filePath);

//                 await stickerService.add(stickerName, link, process.env.OWNER_ID, 'VarZ');
//                 fs.unlinkSync(filePath);
//             } catch (error) {
//                 return message.channel.send(error.message.message);
//             }
//         }
        
//         return message.channel.send(`Parsed ${files.length} files.`);
//     } else {
//         return message.channel.send('No files found.');
//     }
// }