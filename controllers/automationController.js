const async = require("async");

const automationDaoModule = require("../db/automationDao");
var automationDao = new automationDaoModule();

exports.excuteIntervall = async (client) => {

  var comands = await automationDao.findIntervalActions();

  commands.forEach(async function(command, key, map) {
    if (command.command === 'sayHi') {
      let user = await client.fetchUser(command.user);
		  console.log('================ ======INTERVALL ' + command.command);

		user.send("This is just a message");
    }
  });

}