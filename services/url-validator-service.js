const supportedExt = ['jpg', 'png', 'gif']

module.exports.validate = function (url) {
  const ext = url.slice(-3).toLowerCase();
  if (!supportedExt.includes(ext)) {
    return false;
  }

  return true;
}