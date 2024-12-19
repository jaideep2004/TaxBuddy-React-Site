// const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;

// class CustomObjectId extends ObjectId {
// 	static generate(prefix, length = 8) {
// 		const timestamp = Math.floor(Date.now() / 1000).toString(36); // unix timestamp in base36
// 		const randomPart = Math.random()
// 			.toString(36)
// 			.substring(2, 2 + length - prefix.length - timestamp.length);
// 		return (prefix + timestamp + randomPart).toUpperCase();
// 	}
// }
// module.exports = { CustomObjectId };


const mongoose = require("mongoose");

// Sequence Schema and Model
const sequenceSchema = new mongoose.Schema({
  prefix: { type: String, required: true, unique: true },
  seq: { type: Number, required: true, default: 0 },
});

const Sequence = mongoose.model("Sequence", sequenceSchema);

// CustomObjectId Class
class CustomObjectId {
  static async generate(prefix) {
    if (!prefix) throw new Error("Prefix is required for ID generation.");

    // Increment the sequence for the prefix
    const sequence = await Sequence.findOneAndUpdate(
      { prefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Format the sequence number (e.g., 001, 002)
    const seqString = String(sequence.seq).padStart(3, "0");

    // Return the formatted ID
    return `${prefix}${seqString}`;
  }
}

module.exports = { CustomObjectId };
