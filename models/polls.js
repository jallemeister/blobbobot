const mongoose = require("mongoose");

const pollsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	channelId: String,
  description: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model("polls", pollsSchema);