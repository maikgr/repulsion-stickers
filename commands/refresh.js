const apiService = require('../services/api-service');

module.exports = {
	name: "refresh",
	args: false,
	ownerOnly: false,
	cooldown: 3,
	sortIndex: 0,
	usage: "",
	optional: ""
}

module.exports.execute = async function (message, args) {
	await apiService.refreshCache();
	return message.channel.send("Done.")
}
