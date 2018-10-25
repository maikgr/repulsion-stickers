const imgur = require('imgur');

imgur.setClientId(process.env.IMGUR_ID);
imgur.setAPIUrl('https://api.imgur.com/3/');
imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD, process.env.IMGUR_ID);

const albumId = 'V7qYbqX';

module.exports.upload = async function(url) {
  try {
    let response = await imgur.uploadUrl(url, albumId);
    if (response.success) {
      return {
        link: response.data.link,
        hash: response.data.deletehash
      }
    }
    return {
      link: url
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports.remove = async function (hash) {
  try {
    if (hash) {
      await imgur.deleteImage(hash);
    }
  } catch (error) {
    console.error(error);
  }
}