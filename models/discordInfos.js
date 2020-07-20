const mongoose = require("mongoose");

const discordinfosSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	discordname: String,
	discordId: String,
	member: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'members'
	},
  roles: String,
  updated: { type: Boolean, default: false}
});

module.exports = mongoose.model("discordinfos", discordinfosSchema);