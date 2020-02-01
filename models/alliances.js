const mongoose = require("mongoose");

const alliancesSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	channelId: String,
	minimum: Number,
	minimumClose: Number,
	leader: String,
	scorekeeper: String,
	isAdmin: { type: Boolean, default: false}
});

module.exports = mongoose.model("alliances", alliancesSchema);