const request = require('request-promise-native');

const apiUrl = 'https://repulsion-stickers-api.herokuapp.com/api/stickers/'

module.exports.get = function (keyword) {
    return request
        .get(apiUrl + 'keyword/' + keyword)
        .then((response) => {
            const json = JSON.parse(response);
            return json.data;
        });
}

module.exports.search = function (query) {
    return request
        .get(apiUrl + 'search', { keyword: query })
        .then((response) => {
            const json = JSON.parse(response);
            return json.data;
        });
}

module.exports.update = function (id, sticker) {
    return request
        .put(apiUrl + id, sticker)
        .then((response) => {
            const json = JSON.parse(response);
            return json.data;
        })
        .catch((error) => {
            console.error(error);
        });
}

module.exports.add = function (sticker) {
    return request
        .post(apiUrl, JSON.stringify(sticker))
        .then((response) => {
            const json = JSON.parse(response);
            return json.data;
        })
}

module.exports.remove = function (id) {
    return request.delete(apiUrl + id);
}