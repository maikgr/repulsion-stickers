const request = require('request-promise-native');

const apiUrl = 'http://localhost:8081/api/stickers/'

module.exports.getAll = function () {
    const options = {
        method: 'GET',
        uri: apiUrl + 'all',
        json: true
    }

    return request(options)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

module.exports.get = function (keyword) {
    return request
        .get(apiUrl + 'keyword/' + keyword)
        .then((response) => {
            const json = JSON.parse(response);
            return json.data;
        })
        .catch((error) => {
            throw error;
        });
}

module.exports.search = function (query) {
    const options = {
        method: 'GET',
        uri: apiUrl + 'search',
        qs: {
            keyword: query
        },
        json: true
    };

    return request(options)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
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
            throw error;
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
        })
        .catch((error) => {
            throw error;
        });
}

module.exports.remove = function (id) {
    return request.delete(apiUrl + id);
}