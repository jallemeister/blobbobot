const mongoose = require("mongoose");

const pollAnswersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	pollId: String,
  option: String,
  memberId: String
});

module.exports = mongoose.model("pollAnswers", pollAnswersSchema);