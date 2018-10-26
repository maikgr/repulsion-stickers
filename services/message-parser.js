module.exports.parse = function (message, args) {
  return {
    keyword: args[0].replace(process.env.DEFAULT_PREFIX, '').replace('?', ''),
    author: {
      id: message.author.id,
      username: message.author.username
    },
    url: args[1] || message.attachments.first().url
  }
}