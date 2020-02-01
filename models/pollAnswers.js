const mongoose = require("mongoose");

const pollAnswersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	pollId: String,
  option: String,
  member: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'members'
	}
});

module.exports = mongoose.model("pollAnswers", pollAnswersSchema);