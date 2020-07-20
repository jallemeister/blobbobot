const mongoose = require("mongoose");

const automationsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	command: String,
	options: String,
	channel: String,
  user: String
});

module.exports = mongoose.model("automations", automationsSchema);