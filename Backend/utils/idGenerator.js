const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class CustomObjectId extends ObjectId {
	static generate(prefix, length = 8) {
		const timestamp = Math.floor(Date.now() / 1000).toString(36); // unix timestamp in base36
		const randomPart = Math.random()
			.toString(36)
			.substring(2, 2 + length - prefix.length - timestamp.length);
		return (prefix + timestamp + randomPart).toUpperCase();
	}
}
module.exports = { CustomObjectId };
