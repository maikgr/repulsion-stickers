const sanitize = (keyword) => {
  return keyword.replace(/\?+$/, "");
}

module.exports = sanitize