const Connector = require("../db/connection");
const mongoose = require("mongoose").set('debug', false);

const alliances = require("../models/alliances.js");

class allianceDao {
	constructor() {
		this.findAllAlliances = function(result) {			
            alliances.find({isAdmin: false}).exec(result);
            
        };
        
        this.findAllAlliancesRet = function() {			
            return alliances.find({isAdmin: false}).exec();
            
        };
        
        this.findAlliance = function(result, id) {
            alliances.find({ _id: id }).exec(result);
        };
        
        this.findAllianceRet = function(id) {
            return alliances.find({ _id: id });
        };
        
        this.findAllianceByChannel = function(result, channelId) {
            alliances.find({ channelId: channelId }).exec(result);
        };
        
        this.findAllianceByChannelRet = function( channelId){
            return alliances.find({ channelId: channelId });
        };

        this.createAlliance = function (allianceName, channelId) {
          var alliance_instance = new alliances({
            _id: new mongoose.Types.ObjectId(),
            name: allianceName,
            channelId: channelId
          });
          // Save the new model instance, passing a callback
          alliance_instance.save(function (err) {
            if (err)
              return console.log(err);
            // saved!
          });
        };

        this.editAllianceName = function (allianceId, allianceName) {
          alliances.findByIdAndUpdate(allianceId, {
          $set: {
            name: allianceName
          }
          }).exec();
        };
    }
}

module.exports = allianceDao;