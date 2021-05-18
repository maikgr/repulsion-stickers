const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.on('error', console.error.bind(console, 'Db service connection error: '));
db.on('connected', () => console.log('Connected to db service.'));
db.on('disconnected', () => console.log('Disconnected from db service.'));

// Deprecation update https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);

const stickerSchema = new Schema({
  keyword: String,
  url: String,
  useCount: Number,
  upload: {
    id: String,
    username: String,
    date: Date
  }
});

const Sticker = mongoose.model('stickers', stickerSchema);

module.exports.getAll = async function () {
  return await Sticker.find().lean().exec();
}

module.exports.increaseUseCount = async function (sticker) {
  return await Sticker.findByIdAndUpdate(sticker._id, { useCount: ++sticker.useCount }, { new: true }).lean().exec();
}

module.exports.getByKeyword = function (keyword) {
  return Sticker.findOne({ keyword: { '$regex': '^' + keyword + '$', '$options': 'i' } }).exec();
}

module.exports.getById = function (id) {
  return Sticker.findById(id).exec();
}

module.exports.search = function (query) {
  return Sticker.find({ keyword: { '$regex': query, '$options' : 'i'} }).exec();
}

module.exports.add = function (keyword, url, uploaderId, uploaderUsername) {
    let newSticker = new Sticker({
        keyword: keyword,
        url: url,
        useCount: 0,
        upload: {
            id: uploaderId,
            username: uploaderUsername,
            date: moment().format()
        }
    });

    return newSticker.save();
}

module.exports.update = function (id, sticker) {
    return Sticker.findByIdAndUpdate(id, {
        keyword: sticker.keyword,
        url: sticker.url,
        useCount: sticker.useCount,
        buffer: sticker.buffer,
        upload: sticker.upload
    }, {
        new: true
    }).exec();
}

module.exports.remove = function (id) {
    return Sticker.findByIdAndRemove(id).exec();
}
