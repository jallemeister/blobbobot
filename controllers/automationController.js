const async = require("async");

const automationDaoModule = require("../db/automationDao");
var automationDao = new automationDaoModule();

exports.excuteIntervall = async (client) => {

  var commands = await automationDao.findIntervalActions();

  commands.forEach(async function(command, key, map) {
    if (command.command === 'sayHi') {
      let user = await client.users.fetch(command.user);
		  console.log('================ ======INTERVALL ' + command.command + ' to ' + user.username);

		user.send("This is just a message");
    }
  });

}