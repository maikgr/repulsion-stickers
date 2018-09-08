const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const db = mongoose.connection;

module.exports = {
    add: addSticker,
    get: getSticker,
    getAll: getAllStickers,
    updateImage: updateStickerImage,
    updateKeyword: updateStickerKeyword,
    remove: removeSticker
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'Db service connection error: '));
db.on('connected', () => console.log('Connected to db service.'));
db.on('disconnected', () => console.log('Disconnected from db service.'));

process.on('SIGINT', () => {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

const stickerSchema = new Schema({
    keyword: String,
    url: String,
    upload : {
        id: String,
        username: String,
        date: Date
    }
});

const Sticker = mongoose.model('stickers', stickerSchema);

function addSticker(keyword, url, uploaderId, uploaderUsername) {
    let currentDate = moment().format();
    let newSticker = new Sticker({
        keyword: keyword,
        url: url,
        upload: {
            id: uploaderId,
            username: uploaderUsername,
            date: currentDate
        }
    });

    newSticker.save((err) => {
        if (err) throw err;
    })
}

function getSticker(keyword) {
    return Sticker.findOne({ keyword: keyword }).exec();
}

function getAllStickers() {
    return Sticker.find().exec();
}

function updateStickerKeyword(oldKeyword, newKeyword) {
    return Sticker.findOneAndUpdate({ keyword: oldKeyword }, { keyword: newKeyword }).exec();
}

function updateStickerImage(keyword, url) {
    return Sticker.findOneAndUpdate({ keyword: keyword }, { url: url }).exec();
}

function removeSticker(keyword) {
    return Sticker.findOneAndRemove({ keyword: keyword }).exec();
}