const database = require('./database');

module.exports.getAll = async () => {
    const stickers = await database.getAll();
    return stickers.map(s => parseSticker(s))
        .sort((stickerA, stickerB) => {
            if (stickerA.keyword < stickerB.keyword) {
                return -1;
            } else if (stickerA.keyword > stickerB.keyword) {
                return 1;
            }
            return 0;
        });
}

module.exports.get = async (keyword) => {
    try {
        const sticker = await database.getByKeyword(req.params.keyword);
        if (sticker) {
            return parseSticker(sticker);
        }
        else throw
    }
    catch {
        throw new Error("No sticker with keyword " + keyword + " found.");
    }
}

module.exports.search = async (query) => {
    const minCharacterLength = 2;
    if(!query || query.length < minCharacterLength) {
      throw new Error(`Please provide a search query with a minimum of ${minCharacterLength} characters.`);
    }

    try {
        const stickers = await database.search(query);
        if (stickers && stickers.length) {
            return stickers.map(s => parseSticker(s));
        }
        else throw
    }
    catch {
        throw new Error("No sticker with keyword '" + query + "' found.");
    }
}

module.exports.update = async (id, sticker) => {
    try {
        const updatedSticker = await database.update(id, sticker);
        if (updatedSticker) {
            return parseSticker(updatedSticker);
        }
        else throw
    }
    catch {
        throw new Error("No sticker with keyword " + sticker.keyword + " found.");
    }
}

module.exports.add = async (sticker) => {
    const existing = await database.getByKeyword(sticker.keyword);
    if (existing) {
        throw new Error(`Keyword ${req.body.keyword} is already taken.`);
    }

    const newSticker = await database.add(sticker.keyword, sticker.url, sticker.upload.id, sticker.upload.username);
    if (newSticker) {
        return parseSticker(newSticker);
    }
    throw new Error("Failed to create sticker " + sticker.keyword + ".");
}

module.exports.remove = async (id) => {
    const sticker = await database.getById(id);
    if (!sticker) { 
        await database.remove(id);
        return true;
    }
}

function parseSticker (sticker) {
    return {
        id: sticker._id,
        keyword: sticker.keyword,
        url: sticker.url,
        buffer: sticker.buffer,
        useCount: sticker.useCount,
        upload: sticker.upload
    };
}