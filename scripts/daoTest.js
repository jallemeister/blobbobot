const mongoose = require("mongoose").set('debug', true);
mongoose.Promise = global.Promise;


const alliances = require("../models/alliances.js");
const members = require("../models/members.js");
const scores = require("../models/scores.js");

if (mongoose.connection.readyState == 0 ) {
	mongoose.connect('mongodb+srv://losblobbos:losblobbos10@cluster0-j0bpo.mongodb.net/blobbobot?retryWrites=true');
} else {
	console.log("Already connected " + mongoose.connection.readyState);

}

mongoose.connection.on('open', function (ref) {
        console.log('Connected to mongo server.');
		mongoose.connection.db.listCollections().toArray(function(err, names) {
			console.log(names); // [{ name: 'dbname.myCollection' }]
			
		});

    });

function dao() {

	this.findAllAlliances = function(result) {			
		alliances.find().exec(result);
		
	}
	
	this.findAllAlliancesRet = function() {			
		return alliances.find().exec();
		
	}
	
	this.findAlliance = function(result, id) {
		alliances.find({ _id: id }).exec(result);
	}
	
	this.findAllianceByChannel = function(result, channelId) {
		alliances.find({ channelId: channelId }).exec(result);
	}
	
	this.createAlliance = function(name) {
		var alliance_instance = new alliances({ 
		_id: new mongoose.Types.ObjectId(),
		name: name });

		// Save the new model instance, passing a callback
		alliance_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
	}
	
	// Members
	this.findAllMembers = function(result) {			
		members.find().exec(result);
		
	}
	this.findMember = function(result, id) {
		members.find({ _id: id }).exec(result);
	}
	
	this.findMemberRet = function(id) {
		
		return members.find({ _id: id }).exec();
	}
	
	this.findMembersByAllianceRet = function(allianceId) {
		
		return members.find({ allianceId: allianceId }).exec();
	}
		
	this.createMember = function(name, discordId, allianceId, pwd, namecolor, bgcolor) {
		console.log("New member " + allianceId);
		var member_instance = new members({ 
			_id: new mongoose.Types.ObjectId(),
			name: name,
			allianceId: allianceId,
			discordId: discordId,				
			pwd: pwd,
			namecolor: namecolor,
			bgcolor: bgcolor
		});

		// Save the new model instance, passing a callback
		member_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
	}
	
	this.editMember = function(id, name, allianceId, discordId, pwd, namecolor, bgcolor) {
		console.log("Update id: " + id);
		members.findByIdAndUpdate(id, { $set: { 
			_id: id,
			name: name,
			allianceId: allianceId,
			discordId: discordId,			
			pwd: pwd,
			namecolor: namecolor,
			bgcolor: bgcolor,}}).exec();
			
		
	}
	
	this.deleteMember = function(id) {
		console.log("Delete id: " + id);
		members.findByIdAndRemove(id).exec();
			
		
	}
	
	//Scores
	this.findMembersByAllianceRet = function(allianceId) {
		return members.find({allianceId: allianceId}).exec();
	}
	
	this.findMembersByAlliance = function(result, allianceId) {
		members.find({allianceId: allianceId}).exec(result);
	}
	
	this.createScore = function(memberId, scoreDate, score) {
		var score_instance = new scores({ 
			_id: new mongoose.Types.ObjectId(),
			memberId: memberId,
			scoreDate: scoreDate,
			score: score
		});

		// Save the new model instance, passing a callback
		score_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
	}
	
	this.getScoresRet = function(memberId, resetStart) {
		return scores.find({
			memberId: memberId, 
			scoreDate: {
				$gte: resetStart
			}
			});
	}
}

module.exports = dao;
