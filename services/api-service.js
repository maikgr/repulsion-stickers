const request = require('request-promise-native');

const apiUrl = 'https://varuzuapi.azurewebsites.net/api/stickers/'

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
    const options = {
        method: 'PUT',
        uri: apiUrl + id,
        body: sticker,
        json: true
    };

    return request(options)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
        });
}

module.exports.add = function (sticker) {
    const options = {
        method: 'POST',
        uri: apiUrl,
        body: sticker,
        json: true
    };

    return request(options)
        .then((response) => {
            return response.data;
        });
}

module.exports.remove = function (id) {
    return request.delete(apiUrl + id);
}