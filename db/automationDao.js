const async = require("async");
const mongoose = require("mongoose").set('debug', false);
mongoose.Promise = global.Promise;

const automations = require("../models/automations.js");

function automationDao() {
    this.findIntervalActions = async () => {
      return await automations.find({}).exec();
    }

}

module.exports = automationDao;