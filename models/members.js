const mongoose = require("mongoose");
const crypto = require('crypto');

const membersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
    username: String,	
	alliance: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'alliances'
	},
	altOf: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'members'
	},
	discordId: String,
	canEdit: { type: Boolean, default: false},
	isAdmin: { type: Boolean, default: false},
	nyan: String,
	hash: String, 
    salt: String, 
	ocrName: String,
	namecolor: String,
	bgcolor: String,
	notes: String
});

membersSchema.methods.filterName = function() {
  var regex = /[A-Za-z0-9]+/g
  this.username = this.name.match(regex).filter(function(m,i,self) {
    return i == self.indexOf(m)
  }).join('')
}

membersSchema.methods.setPassword = function(password, canEdit) { 
	this.salt = crypto.randomBytes(16).toString('hex'); 
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	this.nyan = password;
	this.canEdit = canEdit;
}; 

membersSchema.methods.validatePassword = function(password) { 
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex'); 
	return this.hash === hash; 
}; 



module.exports = mongoose.model("members", membersSchema);