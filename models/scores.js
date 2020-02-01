const mongoose = require("mongoose");

const scoresSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	member: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'members'
	},
	alliance: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'alliances'
	},
	scoreDate: Date,
	score: Number,
	scoreType: String,
	total: Number
});

module.exports = mongoose.model("scores", scoresSchema);