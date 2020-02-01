const mongoose = require("mongoose");

const pollOptionsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	pollId: String,
  option: String,
  description: String
});

module.exports = mongoose.model("pollOptions", pollOptionsSchema);