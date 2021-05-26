const database = require('./database');

stickersCache = [];
stickersMap = {};

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

const getRandom = (keyword) => {
  const matches = stickersCache.filter(s => s.keyword.includes(keyword));
  const index = Math.floor(Math.random() * matches.length);
  return matches[index];
}

const increaseUseCount = async (sticker) => await database.increaseUseCount(sticker);

const hasKeyword = (keyword) => stickersCache.includes(s => s.keyword === keyword);

const add = async (sticker) => {
  const newSticker = await database.add(sticker.keyword, sticker.url, sticker.upload.id, sticker.upload.username);
  if (newSticker) {
    await refreshCache();
    return newSticker;
  }
  throw new Error("Failed to create sticker " + sticker.keyword + ".");
}

const search = (query) => {
  if(!query || query === "") return;
   
  return stickersCache.filter(s => s.keyword.includes(query));
}

const rename = async (keyword, newKeyword) => {
  const sticker = await get(keyword);
  if (!sticker) throw new Error("Cannot find sticker with keyword: " + keyword);

  const newSticker = await database.rename(sticker.id, newKeyword);
  await refreshCache();
  return newSticker;
}

const relink = async (keyword, newUrl) => {
  const sticker = await get(keyword);
  if (!sticker) throw new Error("Cannot find sticker with keyword: " + keyword);

  const newSticker = await database.relink(sticker.id, newUrl);
  await refreshCache();
  return newSticker;
}

module.exports = {
  get,
  getRandom,
  increaseUseCount,
  refreshCache,
  hasKeyword,
  add,
  search,
  rename,
  relink
}

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