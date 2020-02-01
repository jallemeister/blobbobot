const mongoose = require("mongoose");

const memberTotalsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	member: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'members'
	},
	scoreDate: Date,
	total: Number
});

module.exports = mongoose.model("memberTotals", memberTotalsSchema);