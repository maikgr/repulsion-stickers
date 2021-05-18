const database = require('./database');

let stickersCache = [];
let stickersMap = {};

const refreshCache = async () => {
  stickersCache = await database.getAll();
  stickersMap = stickersCache.reduce((map, sticker) => {
    return {
      ...map,
      [sticker.keyword]: sticker
    }
  }, {});
}

const get = (keyword) => stickersMap[keyword];

const getRandom = (keyword) => stickersCache.filter(s => s.keyword.includes(keyword));

const updateCount = (id) => console.log("update count", id);

module.exports = {
  get,
  getRandom,
  updateCount,
  refreshCache
}

// module.exports.search = async (query) => {
//     const minCharacterLength = 2;
//     if(!query || query.length < minCharacterLength) {
//       throw new Error(`Please provide a search query with a minimum of ${minCharacterLength} characters.`);
//     }

//     try {
//         const stickers = await database.search(query);
//         if (stickers && stickers.length) {
//             return stickers.map(s => parseSticker(s));
//         }
//         throw new Error();
//     }
//     catch {
//         throw new Error("No sticker with keyword '" + query + "' found.");
//     }
// }

// module.exports.update = async (id, sticker) => {
//     try {
//         const updatedSticker = await database.update(id, sticker);
//         if (updatedSticker) {
//             return parseSticker(updatedSticker);
//         }
//         throw new Error();
//     }
//     catch {
//         throw new Error("No sticker with keyword " + sticker.keyword + " found.");
//     }
// }

// module.exports.add = async (sticker) => {
//     const existing = await database.getByKeyword(sticker.keyword);
//     if (existing) {
//         throw new Error(`Keyword ${req.body.keyword} is already taken.`);
//     }

//     const newSticker = await database.add(sticker.keyword, sticker.url, sticker.upload.id, sticker.upload.username);
//     if (newSticker) {
//         return parseSticker(newSticker);
//     }
//     throw new Error("Failed to create sticker " + sticker.keyword + ".");
// }

// module.exports.remove = async (id) => {
//     const sticker = await database.getById(id);
//     if (!sticker) { 
//         await database.remove(id);
//         return true;
//     }
// }

// function parseSticker (sticker) {
//   return {
//     id: sticker._id,
//     keyword: sticker.keyword,
//     url: sticker.url,
//     buffer: sticker.buffer,
//     useCount: sticker.useCount,
//     upload: sticker.upload
//   };
// }