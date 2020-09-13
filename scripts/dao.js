const Connector = require("../db/connection");
const mongoose = require("mongoose").set('debug', false);
mongoose.Promise = global.Promise;


const alliances = require("../models/alliances.js");
const members = require("../models/members.js");
const scores = require("../models/scores.js");
const memberTotals = require("../models/memberTotals.js");
const admins = require("../models/admins.js");
const discordinfos = require("../models/discordInfos.js");
const polls = require("../models/polls.js");
const pollOptions = require("../models/pollOptions.js");
const pollAnswers = require("../models/pollAnswers.js");



function dao() {

	this.findAllAlliances = function(result) {			
		alliances.find({isAdmin: false}).exec(result);
		
	}
	
	this.findAllAlliancesRet = function() {			
		return alliances.find({isAdmin: false}).exec();
		
	}
	
	this.findAlliance = function(result, id) {
		alliances.find({ _id: id }).exec(result);
	}
	
	this.findAllianceRet = function(id) {
		return alliances.find({ _id: id });
	}
	
	this.findAllianceByChannel = function(result, channelId) {
		alliances.find({ channelId: channelId }).exec(result);
	}
	
	this.findAllianceByChannelRet = function( channelId){
		return alliances.find({ channelId: channelId });
	}
	
	this.createAllianceByChan = function (allianceName, channelId, isAdmin, isPublic) {
    var alliance_instance = new alliances({
      _id: new mongoose.Types.ObjectId(),
      name: allianceName,
      channelId: channelId,
      isAdmin: isAdmin,
      isPublic: isPublic,
      minimum: 100,
      minimumClose: 100,
      greatScore: 100,
      awesomeScore: 100
    });
    // Save the new model instance, passing a callback
    alliance_instance.save(function (err) {
      if (err)
        return console.log(err);
      // saved!
    });
  }
	
	this.editAlliance = function(allianceId, allianceName, channelId, minimum, minimumClose) {
		alliances.findByIdAndUpdate(allianceId, { $set: { 
			_id: allianceId,
			name: allianceName,
			channelId: channelId,
			minimum: minimum,			
			minimumClose: minimumClose}}).exec();
	
  }
  
  this.editAllianceName = function (allianceId, allianceName) {
    alliances.findByIdAndUpdate(allianceId, {
    $set: {
      name: allianceName
    }
    }).exec();
  }
	
	// DiscordInfo
	/* this.clearInfo = function() {
		discordinfos.deleteMany({},function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
  } */
  
  this.clearInfo = async() => {
    discordinfos.updateMany({},{ $set: { updated: false}},function (err) {
      if (err) return console.log(err);
      // saved!
    });
  }
	
	this.createDiscordInfo = function(discordname, discordId, roles) {
		var discordinfo_instance = new discordinfos({ 
			_id: new mongoose.Types.ObjectId(),
			discordname: discordname,
			discordId: discordId,
      roles: roles,
      updated: true
		});

		
		// Save the new model instance, passing a callback
		discordinfo_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
	}

	this.createDiscordInfoMemberId = function(discordname, discordId, memberId, roles) {
		var discordinfo_instance = new discordinfos({ 
			_id: new mongoose.Types.ObjectId(),
			discordname: discordname,
			discordId: discordId,
			member: memberId,
      roles: roles,
      updated: true
		});

		
		// Save the new model instance, passing a callback
		discordinfo_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
  }

  this.updateDiscordInfoMemberId = function(oldId, discordname, discordId, memberId, roles) {
    discordinfos.findByIdAndUpdate(oldId, { $set: { 
			_id: oldId,
			discordname: discordname,			
      discordId: discordId,	
      member: memberId,
      roles: roles,
			updated: true
  	}}).exec();
  }

  this.updateDiscordInfoWithId = function(oldId, discordname, discordId, roles) {
    discordinfos.findByIdAndUpdate(oldId, { $set: { 
			_id: oldId,
			discordname: discordname,			
      discordId: discordId,	
      roles: roles,
			updated: true
  	}}).exec();
  }

  this.getDiscordMemberInfosByDiscordId = async (discordId) => {
    return await discordinfos.find({discordId: discordId}).exec();
  }
  
  this.getDiscordMemberInfos = async () => {
    return await discordinfos.find().exec();
  }

	this.getMembersMissingDiscordRet = function () {
		return members.find({ discordId: '', altOf: null }).populate('alliance').sort({ alliance: 1 }).exec();
	};

	this.getMembersMissingDiscordByAllianceIdRet = function (allianceId) {
		return members.find({ discordId: '', altOf: null, alliance: allianceId }).exec();
	};

	this.getMemberActiveMissingDiscordRet = function () {
		return members.find({ discordId: '', altOf: null, alliance: {$nin: ['5bec8bd45332bb0004d3a697', '5bf48f2b66498f0004eff5c9', '5c0bf5af426a840004021a62']} }).populate('alliance').sort({ alliance: 1 }).exec();
	};

	this.getMembersMissingDiscordAllianceIdRet = function (allianceId) {
		return members.find({ discordId: '', altOf: null, alliance: allianceId }).populate('alliance').exec();
	};

	this.getUnknownDiscordRet = function () {
		return discordinfos.find({ member: {$eq: null} }).exec();
	};


	
	// Members
	this.findAllMembers = function(result) {			
		members.find().populate('alliance').exec(result);
		
	}

	this.findAllMembersRet = function() {			
		return members.find().populate('alliance').populate('altOf').exec();
		
	}

	this.findAllActiveMembersRet = function() {			
		return members.find({
			// Admin, None, Test
			alliance: {$nin: ['5bec8bd45332bb0004d3a697', '5bf48f2b66498f0004eff5c9', '5c0bf5af426a840004021a62']}
		}).populate('alliance').exec();
		
	}
	this.findMember = function(result, id) {
		members.find({ _id: id }).exec(result);
	}
	
	this.findMemberRet = function(id) {
		
		return members.find({ _id: id }).exec();
	}
	
	this.findMemberByNameRet = function(name) {
		
		return members.find({ name: name }).exec();
	}
	
	this.findMemberByDiscordIdRet = function(discordId) {
		
		return members.find({ discordId: discordId }).exec();
	}
	
	this.findMembersByAllianceRet = function(allianceId) {
		
		return members.find({ alliance: allianceId }).exec();
	}
		
	this.createMember = function(name, discordId, allianceId) {
		console.log("New member " + allianceId);
		var member_instance = new members({ 
			_id: new mongoose.Types.ObjectId(),
			name: name,
			alliance: allianceId,
			discordId: discordId
		});

		// Save the new model instance, passing a callback
		member_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
  }
  
  this.createMemberFromDiscord = function(name, discordId) {
		console.log("New member from discord " + discordId);
		var member_instance = new members({ 
			_id: new mongoose.Types.ObjectId(),
			name: name,
      discordId: discordId,
      status: 'new'
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
			alliance: allianceId,
			discordId: discordId,			
			pwd: pwd,
			namecolor: namecolor,
			bgcolor: bgcolor,}}).exec();
	}
	
	this.editMemberNamecolor = function(id, namecolor) {		
		members.findByIdAndUpdate(id, { $set: { 			
			namecolor: namecolor
			}}).exec();
	}
	
	this.editMemberBgcolor = function(id, bgcolor) {		
		members.findByIdAndUpdate(id, { $set: { 			
			bgcolor: bgcolor
			}}).exec();
  }
  
  this.editMemberstatus = function(id, status) {		
		members.findByIdAndUpdate(id, { $set: { 			
			status: status
			}}).exec();
	}
	
	this.deleteMember = function(id) {
		console.log("Delete id: " + id);
		members.findByIdAndRemove(id).exec();
			
		
	}

	
	
	//admin
	
	this.getAdminRet = function() {
		return admins.find().exec();
	}
	
	this.closeAdmin = async function() {
		let adminos = await admins.find().exec();
		admins.findByIdAndUpdate(adminos[0]._id, { $set: { 			
			isOpen: false
			}}).exec();
	}
	
	this.openAdmin = async function() {	
		let adminos = await admins.find().exec();	
		admins.findByIdAndUpdate(adminos[0]._id, { $set: { 			
			isOpen: true
			}}).exec();
	}
	
	//Scores
	this.findMembersByAllianceRet = function(allianceId) {
		return members.find({alliance: allianceId}).exec();
	}
	
	this.findMembersByAlliance = function(result, allianceId) {
		members.find({alliance: allianceId}).exec(result);
	}
	
	this.createScore = function(memberId, allianceId, scoreDate, score, total, scoreType) {
		var score_instance = new scores({ 
			_id: new mongoose.Types.ObjectId(),
			member: memberId,
			alliance: allianceId,
			scoreDate: scoreDate,
			score: score,
			total: total,
			scoreType: scoreType
		});

		// Save the new model instance, passing a callback
		score_instance.save(function (err) {
		  if (err) return console.log(err);
		  // saved!
		});
	}
	
	this.updateScore = function(id, score, total) {
		var query = { _id: id};
		scores.update(query, { score: score, total: total}).exec();

	}
	
	this.getScoresRet = function(memberId, resetStart) {
		return scores.find({
			member: memberId, 
			scoreDate: {
				$gte: resetStart
			}
			});
	}
	
	this.getScoresWeekRet = function(memberId, resetStart) {
		var stopDate = new Date(resetStart);
		stopDate.setHours(stopDate.getHours() -9);
		stopDate.setDate(stopDate.getDate() + 7);
		return scores.find({
			member: memberId, 
			scoreDate: {
				$gte: resetStart,
				$lt: stopDate
			}
			}).sort({scoreDate: 1});
	}
	
	this.getScoresDayRet = function(memberId, resetStart) {
		var stopDate = new Date(resetStart);
		stopDate.setDate(stopDate.getDate() + 1);
		console.log("memberID " + memberId + " as ObjectId " + mongoose.Types.ObjectId(memberId));
		return scores.find({
			member: mongoose.Types.ObjectId(memberId), 
			scoreDate: {
				$gte: resetStart,
				$lt: stopDate
			}
			}).sort({scoreDate: 1});
	}
	
	this.getScoresByAllianceIdAndDateRet = function(allianceId, scoreDate, dayAfter) {
		
		return scores.find({
			alliance: allianceId, 
			scoreDate: {
				$gte: scoreDate,
				$lt: dayAfter
			}
		}).populate('member');
	}
	
	this.getScoresByMemberId = function(memberId) {
		
		return scores.find({
			member: memberId
		}).populate('alliance');
	}

	this.getScoresByMemberIdDateSorted = function(memberId) {
		
		return scores.find({
			member: memberId
		}).populate('alliance').sort({scoreDate: -1});
	}

	this.getMemberTotalsDateRet = function(memberId, startDate) {
		return memberTotals.find({
			member: memberId,
			scoreDate: { $gte: startDate }
		}).sort({total: 1});
	}

	this.getMemberTotalsRet = function(memberId) {
		return memberTotals.find({
			member: memberId
		}).sort({total: 1});
	}
	
	this.getStatsTotalsMemberIdRet = function(memberId) {
		return memberTotals.aggregate([
			{				
				$match: {
					member : memberId
			}},
			{$group : {
					_id: "$memberId",
				   totalTotals: { $sum: "$total" },
				   avgTotal: { $avg: "$total" },
				   minTotal: { $min: "$total"},
				   maxTotal: { $max: "$total"},
				   count: { $sum: 1 }
				}
			}
		]);
	}
	
	this.getAllPvPScoresMemberIdRet = function(memberId) {
		return scores.find({
			member : mongoose.Types.ObjectId(memberId), 
			scoreType: "pvp"
		}).populate('member');
	}

	this.getAllPveScoresMemberIdRet = function(memberId) {
		return scores.find({
			member : mongoose.Types.ObjectId(memberId), 
			scoreType: "pve"
		}).populate('member');
	}

	this.getAllPvPScoresMemberIdDateRet = function(memberId, startDate) {
		return scores.find({
			member : mongoose.Types.ObjectId(memberId), 
			scoreType: "pvp",
			scoreDate: { $gte: startDate }
		}).populate('member').sort({score: 1});
	}

	this.getAllPveScoresMemberIdDateRet = function(memberId, startDate) {
		return scores.find({
			member : mongoose.Types.ObjectId(memberId), 
			scoreType: "pve",
			scoreDate: { $gte: startDate }
		}).populate('member').sort({score: 1});
	}

	this.getStatsPvPMemberIdRet = function(memberId) {
		
		return scores.aggregate([
			{				
				$match: {
					member : mongoose.Types.ObjectId(memberId), 
					scoreType: "pvp"
			}},
			{$group : {
					_id: "$memberId",
				   totalPvp: { $sum: "$score" },
				   avgPvp: { $avg: "$score" },
				   minPvp: { $min: "$score"},
				   maxPvp: { $max: "$score"},
				   count: { $sum: 1 }
				}
			}
		]);
	}
	this.getStatsPveMemberIdRet = function(memberId) {
		return scores.aggregate([
			{				
				$match: {
					member : mongoose.Types.ObjectId(memberId), 
					scoreType: "pve"
			}},
			{$group : {
					_id: "$memberId",
				   totalPve: { $sum: "$score" },
				   avgPve: { $avg: "$score" },
				   minPve: { $min: "$score"},
				   maxPve: { $max: "$score"},
				   count: { $sum: 1 }
				}
			}
		]);
	}
	
	this.getAllianceWeekTotals = function(memberId, resetStart) {
		var stopDate = new Date(resetStart);
		stopDate.setHours(stopDate.getHours() -9);
		stopDate.setDate(stopDate.getDate() + 7);
		return scores.aggregate([
			{				
				$match: {
					member : mongoose.Types.ObjectId(memberId), 
					scoreDate: {
						$gte: resetStart,
						$lt: stopDate
					}
			}},
			{$group : {
					 _id: "$member",					
				   total: { $sum: "$score" },
				}
			}
		]);
  }
  
  this.createPoll = async (channelId, description, startDate, endDate, pollOptions) => {
    console.log("Will create " + description + " " + endDate.getDate());
    var poll_instance = new polls({ 
      _id: new mongoose.Types.ObjectId(),
      channelId: channelId,
      description: description,
      startDate: startDate,
      endDate: endDate
     });

     var lePoll;
      // Save the new model instance, passing a callback
      await poll_instance.save().then(function(resi){
        lePoll = resi;
      });
      return lePoll;
  }

  this.createPollOption = function(pollId, option, description) {
    var pollOption_instance = new pollOptions({ 
      _id: new mongoose.Types.ObjectId(),
      pollId: pollId,
      option: option,
      description: description
     });

     console.log("Will save " + pollOption_instance);
  
      // Save the new model instance, passing a callback
      pollOption_instance.save(function (err) {
        if (err) return console.log(err);
        // saved!
      });
  }

  this.createPollAnswer = function(pollId, memberId, option) {
    var pollAnswer_instance = new pollAnswers({ 
      _id: new mongoose.Types.ObjectId(),
      pollId: pollId,
      memberId: memberId,
      option: option
     });

     console.log("Will save " + pollAnswer_instance);
  
      // Save the new model instance, passing a callback
      pollAnswer_instance.save(function (err) {
        if (err) return console.log(err);
        // saved!
      });
  }

  this.updatePollAnswer = function(id, option) {
    var query = { _id: id};
		pollAnswers.updateOne(query, { option: option}).exec();    
  }

  this.activePolls = async (channelId) => {
    var lePollsRes;
    await polls.find({
      channelId: channelId
    }).exec().then(function(lePolls) {
      console.log(lePolls);
      lePollsRes = lePolls;
    });
    return lePollsRes;
  }

  this.activePollOptions = async (pollId) => {
    var lePollsRes;
    await pollOptions.find({
      pollId: pollId
    }).exec().then(function(lePolls) {
      console.log(lePolls);
      lePollsRes = lePolls;
    });
    return lePollsRes;
  }
  
  this.findPollAnswer = async (memberId, pollId) => {
    var lePollsRes;
    await pollAnswers.find({
      pollId: pollId,
      memberId: memberId
    }).exec().then(function(lePolls) {
      console.log(lePolls);
      lePollsRes = lePolls;
    });
    return lePollsRes;
  }

  this.countPollAnswer = async (pollId, answer) => {
    var lePollsRes;
    await pollAnswers.countDocuments({
      pollId: pollId,
      option: answer
    }).exec().then(function(lePolls) {
      console.log(lePolls);
      lePollsRes = lePolls;
    });
    return lePollsRes;
  }


  this.getMemberTotalsFromDate = async (memberId, resetStart) => {

    var aggRes;
    await memberTotals.find({    
      $and: [
        { memberId: memberId },
         { scoreDate: {$gte: resetStart}}
      ]
      }).sort({scoreDate: 1}).then(function(leAggs) {
        aggRes = leAggs;
      });
    return aggRes;
  };

  this.getMemberTotalsAvgFromDate = async (memberId, resetStart) => {

    var aggRes;
      await memberTotals.aggregate([
				{
					$match: {            
						$and: [
              { memberId: memberId },
               { scoreDate: {$gte: resetStart}}
            ]
            }
				},  
				{
				 $group: {
					_id: "$memberId",
					totalAvg: { $avg: "$total" }
				  }
				}
		  ]).then(function(aggr) {
        console.log("OOOOH " + aggr);
        aggRes = aggr;
      });
      return aggRes;
  };


}



module.exports = dao;
