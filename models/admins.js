const mongoose = require("mongoose");

const adminsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	isOpen: { type: Boolean, default: false}
});

module.exports = mongoose.model("admins", adminsSchema);