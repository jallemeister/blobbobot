const async = require("async");

const automations = require("../models/automations.js");
class automationDao {
	constructor() {
    this.findIntervalActions() = async () => {
      return await automations.find({}).exec();
    }
  }
}

module.exports = automationDao;