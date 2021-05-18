const apiService = require('../services/api-service.js');

const execute = (message) => {
  // Parse sticker keyword, case to handle:
  // ;keyword
  // ;keyword;
  // ;keyword?
  let stickerKeyword = message.split(" ")[0]
    .trim()
    .toLowerCase();
  
  if (!stickerKeyword || stickerKeyword === "" || stickerKeyword.length < 2) return;

  try {
    let sticker;
    if (stickerKeyword.endsWith("?")) {
      sticker = apiService.getRandom(stickerKeyword.substring(0, stickerKeyword.length - 1));
    }
    else {
      sticker = apiService.get(stickerKeyword);
    }

    // Fire and forget these async calls
    if (sticker) {
      apiService.increaseUseCount(sticker);
      apiService.refreshCache();
    }

    return sticker;
  } catch (error) {
    console.error(error);
    throw new Error("Error executing sticker keyword!");
  };
}

module.exports = execute