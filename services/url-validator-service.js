const supportedExt = ['jpg', 'png', 'gif', 'jpeg']

module.exports.validate = function (url) {
  const ext = url.split('.').pop().toLowerCase();
  if (!supportedExt.includes(ext)) {
    return false;
  }

  return true;
}

module.exports.extensions = supportedExt;