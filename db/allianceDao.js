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
    }
}

module.exports = allianceDao;