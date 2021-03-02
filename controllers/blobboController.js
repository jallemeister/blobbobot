const async = require("async");
const puppeteer = require('puppeteer');

const daoModule = require("../scripts/dao");
const fs = require("fs");
var dao = new daoModule();

const alliances = require("../models/alliances.js");
const members = require("../models/members.js");
const scores = require("../models/scores.js");
const admins = require("../models/admins.js");
const discordInfos = require("../models/discordInfos.js");

const monthStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ADMIN_ROLE = '315933782303571970';

var previousBackUrl = "/";
var backUrl ="/";

var helpIt = "";
var helpItAdmin = "";

const PORT = process.env.PORT || 5000;

var commands = [];
var commandsV2 = [];

async function asyncForMembers(array, callback) {
	for (var index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	  }
}

async function asyncForindex(nrIterations, callback) {
	for (var i = 0; i < nrIterations; i++) {
		await callback(i);
	  }
}

function getResetDay(day) {	
	var resetWeekDay = day - 2;
	if (day < 2) {
		resetWeekDay = day + 5;
	}
	
	return resetWeekDay;
}

function getResetDate(nowDate) {
	//var resetWeekDay = getResetDay(nowDate.getDay());	
	nowDate.setDate(nowDate.getDate() - getResetDay(nowDate.getDay()));
	console.log("getResetDate RESET DATE: " + nowDate.getDate());
	return nowDate;
}

async function bild(allianceId) {
	 console.log("Imagaboga");
	  const browser = await puppeteer.launch({ 
		  args: ['--no-sandbox', '--disable-setuid-sandbox'] 
	  }); 

	  const page = await browser.newPage();
	  const imgname = allianceId + '.png';
	  await page.goto('https://blooming-cove-27916.herokuapp.com/alliances/' + allianceId + '/showscorebot/0');
	  
	  await page.setViewport({width: 980, height: 713});
	  await page.screenshot({path: imgname});

	  await browser.close();
 }

 async function bildv2(allianceId) {
  console.log("Imagabogav2");
   const browser = await puppeteer.launch({ 
     args: ['--no-sandbox', '--disable-setuid-sandbox'] 
   }); 

   const page = await browser.newPage();
   const imgname = allianceId + '.png';
   await page.goto('https://cryptic-earth-19665.herokuapp.com/#/alliances/' + allianceId + '/showscorenolink/0');
   await page
    .waitForSelector('#id_totaltotal')
    .then(() => console.log('PAGE IS LOADED'));

   //await new Promise(r => setTimeout(r, 3000));

   await page.setViewport({width: 1010, height: 850});
   await page.screenshot({path: imgname});

   await browser.close();
}
 
exports.clear = async (options, message) => {
	console.log("Options " + options.length);
	if (options.length > 0) {
		let nrDel = options[0];
		let fetched = await message.channel.fetchMessages({limit: nrDel});
		console.log("nr fetched " + fetched.length);
		message.channel.bulkDelete(fetched)
			.catch(error => message.channel.send('Error: ' + error));
	}
}
exports.close = async (options, message) => {	
	if (message.channel.id == '746571375468216410' ) {
	await dao.closeAdmin();
	message.channel.send("SHUTTING DOWN!!! OH SHIT!!!");
	} else {
		message.channel.send("Close what? your mouth?");
	}
}

exports.open = async (options, message) => {	
	if (message.channel.id == '746571375468216410' ) {
		await dao.openAdmin();
		message.channel.send("Ok We are back in business");
	} else {
		message.channel.send("You telling me your zipper is open?");
	}
}

 async function showmembercolor(memberId) {
	 console.log("Show membercolor");
			  const browser = await puppeteer.launch({ 
                  args: ['--no-sandbox', '--disable-setuid-sandbox'] 
              }); 

			  const page = await browser.newPage();
			  const imgname = memberId + '.png';
			  await page.goto('https://blooming-cove-27916.herokuapp.com/members/' + memberId + '/showcolor');
			  
			  await page.setViewport({width: 210, height: 40});
			  await page.screenshot({path: imgname});

			  await browser.close();
 }
 
 async function medals(allianceId, message) {
	
	var resetDate = new Date();
	resetDate.setDate(resetDate.getDate() - 1);
	console.log("tot day " + resetDate.getDate());
	resetDate.setHours(0,0,0);
	var startDate = getResetDate(resetDate);
	startDate.setHours(-9,0,0);
	var members = await dao.findMembersByAllianceRet(allianceId);
	let count = 0;
	let top1;
	let top2;
	let top3;
	let top1score = 0;
	let top2score = 0;
	let top3score = 0;
	await asyncForMembers(members, async(member, index) => {
		let memberTotals = await dao.getAllianceWeekTotals(member["_id"], startDate);
		count++;
		console.log(count + member.name + " " + member.discordId);
		console.log(memberTotals[0]);

		if (memberTotals[0].total > top1score) {
			top3score = top2score;
			top3 = top2;
			top2score = top1score;
			top2 = top1;
			top1score = memberTotals[0].total;
			top1 = member;
		} else if (memberTotals[0].total > top2score) {
			top3score = top2score;
			top3 = top2;
			top2score = memberTotals[0].total;
			top2 = member;
		} else if (memberTotals[0].total > top3score) {
			top3score = memberTotals[0].total;
			top3 = member;
		} 
	})
	
	let medal1 = ":first_place: ";
	if (top1.discordId && top1.discordId != null) {
		medal1 = medal1 + "<@" + top1.discordId + ">";
	} else if (top1.altOf && top1.altOf != null) {
		medal1 = medal1 + top1.name + "(<@" + top1.discordId + ">)";
	} else {
		medal1 = medal1 + top1.name;
	}
	let medal2 = ":second_place: ";
	if (top2.discordId && top2.discordId != null) {
		medal2 = medal2 + "<@" + top2.discordId + ">";
	} else if (top2.altOf && top2.altOf != null) {
		medal2 = medal2 + top2.name + "(<@" + top2.discordId + ">)";
	} else {
		medal2 = medal2 + top2.name;
	}
	let medal3 = ":third_place: ";
	if (top3.discordId && top3.discordId != null) {
		medal3 = medal3 + "<@" + top3.discordId + ">";
	} else if (top3.altOf && top3.altOf != null) {
		medal3 = medal3 + top3.name + "(<@" + top3.discordId + ">)";
	} else {
		medal3 = medal3 + top3.name;
	}
	let medal_msg = medal1 + "\n" + medal2 + "\n" + medal3;
	message.channel.send(medal_msg);
}
 
async function addMember(message) {
	let names = message.author.username.split(' ');
	
	let alliance = await dao.findAllianceByChannelRet( message.channel.id);
	dao.createMember(names[0], message.author.id, alliance[0]._id);
}

exports.addCommand = function(commandStr, action, helpStr, isAdmin = false, userAdmin = false) {
	commands[commandStr] = {action: action, isAdmin: isAdmin, userAdmin, userAdmin};
	if (isAdmin || userAdmin) {
		helpItAdmin = helpItAdmin + commandStr + " " + helpStr + "\n";
	} else {
		helpIt = helpIt + commandStr + " " + helpStr + "\n";
	}
}

exports.addCommandV2 = function(commandStr, action, optArray, helpStr, isAdmin = false, userAdmin = false) {

	commandsV2[commandStr] = {action: action, optArray: optArray, isAdmin: isAdmin, userAdmin, userAdmin};
	//if (isAdmin || userAdmin) {
	//	helpItAdmin = helpItAdmin + commandStr + " " + helpStr + "\n";
	//} else {
	//	helpIt = helpIt + commandStr + " " + helpStr + "\n";
	//}
}

exports.getRoles = function(options, message) {
	let roles = "";
	
	message.author.roles.forEach(function(value, key, map) {
		console.log(key + " : " + value.name);
		roles = roles + value.name + "\n";
	});
	
	message.channel.send(roles);
}
 
exports.handleCommandV2 = async (options, message) => {
	console.log("V2");
	if (!options || options.length == 0 || options[0].indexOf("<#") === 0) {
		// scores
		options.unshift("showscores");
	}
	console.log(options[0]);
	let commando = commandsV2[options[0].toLowerCase()];
	console.log(commando);
	let optCommand = commando.optArray[options[1]];
	if (optCommand) {
		console.log("DaOpt: " + optCommand.action);
	} else {
		console.log("NOPE NO COMMANDOPTS ====================================================")
	}

	console.log("IN HANDLE V2" + options + " " + message.channel.id);
	
	let adminos = await dao.getAdminRet();

	
	let comm = options[0];
	if (adminos[0].isOpen || options[0].toLowerCase() === "open") {
		commandsV2[comm.toLowerCase()].action(options, message);
	} else {
		message.channel.send("Sorry I am currently closed for maintenance.");
	}	

}

exports.handleCommand = async (options, message) => {
	console.log("IN HANDLE " + options + " " + message.channel.id);
	
	let adminos = await dao.getAdminRet();
	if (adminos[0].isOpen || options[0].toLowerCase() === "open") {
		
		if (commands[options[0].toLowerCase()]) {
			// Check if admin
			let commando = commands[options[0].toLowerCase()];
			let adminOk = true;
			let userIsAdmin = false;
			if (commando.isAdmin || commando.userAdmin) {
				let user = await dao.findMemberByDiscordIdRet( message.author.id);
				if (user && user.length > 0 && user[0].isAdmin) {
					userIsAdmin = true;
					adminOk = true;
				}
			}
			if (commando.isAdmin && !userIsAdmin) {
				adminOk = false;
				let alliance = await dao.findAllianceByChannelRet( message.channel.id);
				if (alliance && alliance.length > 0 && alliance[0].isAdmin) {
					adminOk = true;
				} else {
					adminOk = message.member.roles.has(ADMIN_ROLE);
				}
			}
			if (commando.userAdmin && !userIsAdmin) {
				adminOk = false;
			}
			
			console.log("YAYO " + options);
			let comm = options[0];
			let opts = options.splice(0, 1);
			if (adminOk) {
				commands[comm.toLowerCase()].action(options, message);
			} else {
				message.channel.send("Not sure what you want.");
			}
		} else if (options[0].indexOf("<#") === 0) {
			console.log("a reference ");
			await this.getAllianceByChannel(options, message);
			//await getAllianceByRefChannel(options[0].slice(2,options[0].length-1), message);		
		} else {
			message.channel.send("If you say so.");
		}
	} else {
		message.channel.send("Sorry I am currently closed for maintenance.");
	}
}

exports.test = async (options, message) => {
  //this.getMembersInfo(options, message);
  var channel = message.guild.channels.get('759078485909831711');
  channel.send('Yupp');
  /* var nowDate = new Date();
  let startDate = getResetDate(nowDate);
  startDate.setDate(startDate.getDate() - 1);
  console.log("LE STARTDATE " + startDate);
  console.log(startDate.getDate());

  let numWeeks = options[0] + 1;

  console.log("Da OPTIONS");
  console.log(options[0]);
  console.log(options[1]);

  let firstDate = new Date(startDate);
  firstDate.setDate(firstDate.getDate() - (7*numWeeks));
  console.log("THE AWESOME DATE " + firstDate);

  let refChannel;
  let alliance;
  
    console.log("a reference ");
    refChannel = options[1];
    console.log("Reference = " + refChannel);
    alliance = await dao.findAllianceByChannelRet(refChannel);
    console.log("DA ALLIANCE: " + alliance);
  

  if (alliance) {
    let memberRet = await dao.findMembersByAllianceRet(alliance[0]._id);
    let msg = "";
    let firstHalf = true;
    await asyncForMembers(memberRet, async(member, index) => {
      let memTotals = await dao.getMemberTotalsFromDate(member._id, firstDate);
      console.log("MEMTOTALS " + memTotals);
      msg = msg + "\n" + member.name;
      let memTot = 0;
      await asyncForMembers(memTotals, async(daTotal, index) => {
        msg = msg + "," + daTotal.total;
        memTot = memTot + parseInt(daTotal.total);
      });                      
      let avgTotal = memTot/numWeeks;
      msg = msg + "," + avgTotal;
      if (firstHalf && index > 14) {
        message.channel.send(msg);
        msg = "";
        firstHalf = false;
      }
    });
    message.channel.send(msg);
  } else {
    message.channel.send("pls add what alliance");
  }

    
   */
}

exports.polls = async (options, message) => {
  var activePolls = await dao.activePolls(message.channel.id);
  console.log(options);
  console.log(options.length);
  console.log(activePolls);
  if (options.length > 0) {
    // create
    console.log("OPTION IS " + options[0]);
    if (options[0] === 'create') {
      // vreate
      let datas = options.slice(1);
      let descript = datas[0];
      let leOpts = datas.slice(1);
      let startDate = new Date();
      let endDate = new Date();
      console.log("TIME " + leOpts[leOpts.length - 1] + endDate);
      endDate.setDate(endDate.getDate() + leOpts[leOpts.length - 1]);
      let newPoll = await dao.createPoll(message.channel.id, descript, startDate, endDate, "");
      let createStr = descript + "\n";
      let exampleOption = "";
      for (var i=0; i < leOpts.length-2; i++){
        if (leOpts[i+1] === ':') {
          exampleOption = leOpts[i];
          console.log(leOpts[i] + " = " + leOpts[i+2]);
          dao.createPollOption(newPoll._id, leOpts[i], leOpts[i+2]);
          createStr = createStr + "\n  " + leOpts[i] + ": " + leOpts[i+2];
          i++;        
        }
      }

      createStr = createStr + "\nAnswer with !blobbos poll <option> ( ex. !blobbos poll " + exampleOption + "\n";

      createStr = createStr + "\nPoll ends at:" + "\n" + newPoll.endDate;
      
      message.channel.send(createStr);   
      return; 
    } else if (options[0] === 'result') {
      let possibleAnswers = await dao.activePollOptions(activePolls[0]._id);
      var resultMsg = '';
      await asyncForMembers(possibleAnswers, async(answ, index) => {
        console.log('Finding ' + answ.option + ' IN ' + activePolls[0]._id);
        let nrAnsw = await dao.countPollAnswer(activePolls[0]._id, answ.option);
        console.log('NRANSW' + nrAnsw);
        resultMsg = resultMsg + answ.option + ": " + nrAnsw + "\n";
      }); 
      message.channel.send(resultMsg);  
    } else {

      // answer
      console.log("Handle pollanswer " + options[0]);
      if (activePolls && activePolls.length > 0) {
        console.log("Poll: " + activePolls[0]);

        memberRes = await dao.findMemberByDiscordIdRet(message.author.id);

        let currentAnswer = await dao.findPollAnswer(memberRes[0]._id, activePolls[0]._id);
        console.log("Found " + currentAnswer[0]);
        let answer = options[0];

        if (currentAnswer && currentAnswer.length > 0) {
          console.log("Update current");
          dao.updatePollAnswer(currentAnswer[0]._id, answer);
        } else {
          console.log("create answ: " + answer + " " +memberRes[0]._id );
          dao.createPollAnswer(activePolls[0]._id, memberRes[0]._id, answer);
        }
      }
    }
  } else {
    // Inform
    let possibleAnswers = await dao.activePollOptions(activePolls[0]._id);
    let createStr = activePolls[0].description + "\n";
    let exampleOption;
    for (var i = 0; i < possibleAnswers.length; i++) {
      createStr = createStr + "\n  " + possibleAnswers[i].option + ": " + possibleAnswers[i].description;
      exampleOption = possibleAnswers[i].option;
    }
    createStr = createStr + "\nAnswer with !blobbos poll <option> ( ex. !blobbos poll " + exampleOption + "\n";
    createStr = createStr + "\nPoll ends at:" + "\n" + activePolls[0].endDate;
    message.channel.send(createStr);
  }
  
}

exports.getMemberTotalsFromDate = async (options, message) => {
  var nowDate = new Date();
  let startDate = getResetDate(nowDate);
  startDate.setDate(startDate.getDate() - 1);
  console.log("LE STARTDATE " + startDate);
  console.log(startDate.getDate());
  let currStartDate = new Date(startDate);

  let numWeeks = options[0];

  let firstDate = new Date(startDate);
  firstDate.setDate(firstDate.getDate - (7*numWeeks));

  let refChannel;
  let alliance;
  if (options[1].indexOf("<#") === 0) {
    console.log("a reference ");
    refChannel = options[0].slice(2,options[0].length-1);
    console.log("Reference = " + refChannel);
    alliance = await dao.findAllianceByChannelRet(refChannel);
    console.log("DA ALLIANCE: " + alliance);
  }

  if (alliance) {
    let memberRet = await dao.findMembersByAllianceRet(alliance[0]._id);
    let msg = "";
    await asyncForMembers(memberRet, async(member, index) => {
      let memTotals = dao.getMemberTotalsFromDate(member._id, firstDate);
      msg = msg + "\n" + member.name;
      await asyncForMembers(memTotals, async(daTotal, index) => {
        msg = msg + "," + daTotal.total;
      });
    });
    message.channel.send(msg);
  } else {
    message.channel.send("pls add what alliance");
  }

}

exports.help = async (options, message) => {
	let alliance = await dao.findAllianceByChannelRet(message.channel.id);	
	let helpMsg = helpIt;
	if (alliance && alliance.lenght > 0 && alliance[0].isAdmin) {	
		helpMsg = helpItAdmin + helpMsg;		
	}
	if (options.length > 0) {
		console.log("HELPOPTION==========" + options[0]);
		var fileData = await fs.readFileSync(options[0] + '.hlp');
		console.log("DATA=========" + fileData);
		message.author.send(":" + fileData);
	} else {
		message.author.send(helpMsg);
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.setPassword = async (options, message) => {
	let alliance = await dao.findAllianceByChannelRet(message.channel.id);	
	let memberRes = [];
	if (options.length > 0) {
		if (options[0].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(3,options[0].length-1));
		} else if (options[0].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(2,options[0].length-1));
		} else {
			memberRes = await dao.findMemberByNameRet(options[0]);
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	
	if (memberRes.length > 0) {
		if (!memberRes[0].username || memberRes[0].username.lenght == 0) {
				memberRes[0].filterName();
		}
		let random = getRandomInt(10, 100);
		let pwd = memberRes[0].username + random;
		memberRes[0].setPassword(pwd, true);
		memberRes[0].save();
		let client = message.channel.client;
		let user = await client.fetchUser(memberRes[0].discordId);
		user.send("Your username: " + memberRes[0].username + "\nYour password: " + pwd + "\n\nhttps://cryptic-earth-19665.herokuapp.com");
		let adminUser = await client.fetchUser('365901367853711391');
    adminUser.send("User added to page " + memberRes[0].username);
    adminUser = await client.fetchUser('555482097490329610');
		adminUser.send("User added to page " + memberRes[0].username);
	} else {
		let names = message.author.username.split(' ');
		let client = message.channel.client;
		let adminUser = await client.fetchUser('365901367853711391');
    adminUser.send("User: " + names[0] + ' Id ' + message.author.id + ' tried adding');
    adminUser = await client.fetchUser('555482097490329610');
		adminUser.send("User added to page " + memberRes[0].username);
		await addMember(message);
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
		memberRes[0].filterName();
		let random = getRandomInt(10, 50);
		let pwd = memberRes[0].username + random;
		memberRes[0].setPassword(pwd, true);
		memberRes[0].save();
		message.author.send("Your username: " + memberRes[0].username + "\nYour password: " + pwd + "\n\nhttps://cryptic-earth-19665.herokuapp.com");
	}
	
}

exports.editMemberNamecolor = async (options, message) => {
	var memberRes;
		
	if (options.length > 1) {
		if (options[1].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[1].slice(3,options[1].length-1));
		} else if (options[1].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[1].slice(2,options[1].length-1));
		} else {
			memberRes = await dao.findMemberByNameRet(options[1]);
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	if (memberRes.length > 0) {
		let color = '';
		if (options[0] != 'none') {
			color = options[0];
		}
		//message.channel.send("I see you " + memberRes[0].name + " color: " + color);
		dao.editMemberNamecolor(memberRes[0]._id, color);
		await showmembercolor(memberRes[0]._id);
		let pngName = memberRes[0]._id + '.png';
		
		let client = message.channel.client;
		let user = await client.fetchUser(memberRes[0].discordId);
		user.send({files: [pngName]});
	} else {
		message.channel.send("I am sorry I have no idea who you are. Are you sure you exists?");	
		let client = message.channel.client;
		let user = await client.fetchUser('365901367853711391');
		console.log('================ OOOOOOOOOOOOOOO ' + message.author.username);
		let names = message.author.username.split(' ');
		user.send("User: " + names[0] + ' Id ' + message.author.id + ' tried ' + message);
	}
}	

exports.editMemberBgcolor = async (options, message) => {
	if (options.length > 1) {
		if (options[1].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[1].slice(3,options[1].length-1));
		} else if (options[1].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[1].slice(2,options[1].length-1));
		} else {
			memberRes = await dao.findMemberByNameRet(options[1]);
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	
	if (memberRes.length > 0) {
		let color = '';
		if (options[0] != 'none') {
			color = options[0];
		}
		
		dao.editMemberBgcolor(memberRes[0]._id, color);
		await showmembercolor(memberRes[0]._id);
		let pngName = memberRes[0]._id + '.png';
		
		let client = message.channel.client;
		let user = await client.fetchUser(memberRes[0].discordId);
		user.send({files: [pngName]});
	} else {
		message.channel.send("I am sorry I have no idea who you are. Are you sure you exists?");	
		let client = message.channel.client;
		let user = await client.fetchUser('365901367853711391');
		console.log('================ OOOOOOOOOOOOOOO ' + message.author.username);
		let names = message.author.username.split(' ');
		user.send("User: " + names[0] + ' Id ' + message.author.id + ' tried ' + message);		
	}
}

exports.getMembersInfo = async (options, message) => {
	let guild = message.guild;
	console.log(guild.id);
	//guild.roles.forEach(function(value, key) {
	//	console.log("RROOOLE " + key + " : " + value.name);
	//});
	let blabla = await dao.clearInfo();
  await guild.members.fetch().then(g =>{
    
    g.forEach(async value => {
		console.log(key + " : " + value.user.username + " " + value.id + " obj " + value.roles);
    //console.log("A USEER");
		//console.log(value.user);
		let existing = await dao.findMemberByDiscordIdRet(value.id);
		let rols = '';
		let isBot = false;
		value.roles.forEach(function(value, key){
			if (value.name != '@everyone' ) {
				rols += value.name + ", ";
			}
			if (value.name == 'Bot') {
				isBot = true;
			}
		});
		if (!isBot) {
      let oldDisc = await dao.getDiscordMemberInfosByDiscordId(value.id);
			if (!existing || existing.length == 0) {
        if (!oldDisc || oldDisc.length == 0) {
          dao.createDiscordInfo(value.user.username, value.id, rols);
        } else {
          dao.updateDiscordInfoWithId(oldDisc[0]._id, value.user.username, value.id, existing[0]._id, rols);
        }
      } else {
        if (!oldDisc || oldDisc.length == 0) {
          dao.createDiscordInfoMemberId(value.user.username, value.id, existing[0]._id, rols);
        } else {
          console.log('Update existing ' + oldDisc[0].discordname);
          dao.updateDiscordInfoMemberId(oldDisc[0]._id, value.user.username, value.id, existing[0]._id, rols);
        }
			}
		}
  });
	});
  console.log('INFO SAVED');
  // let allmembers = await dao.findAllMembersRet();
  // console.log('INFO SAVED2');
  // let newdiscords = await dao.getDiscordMemberInfos();
  // console.log('INFO SAVED3');
  // console.log('allmembers count: ' + allmembers.length + ' discords:' +newdiscords.length);
  // let client = message.channel.client;
  // await asyncForMembers(allmembers, async(member, index) => {
  //   if (member.discordId || member.altOf) {
  //     let daDisc = '';
  //     if (member.discordId) {
  //       daDisc = member.discordId;
  //     } else {
  //       daDisc = member.altOf.discordId;
  //     }
  //     if (!newdiscords.some(e => e.discordId === daDisc)) {
        
  //       let user = await client.fetchUser('365901367853711391');
        
  //       user.send("Member: " + member.name + ' deleted');
  //       dao.editMemberstatus(member._id, 'deleted');
  //     }
  //   }
  // })
}

exports.listDiscordMembers = async (options, message) => {
  let members = await dao.getDiscordMemberInfos();
  let msg = '';
  await asyncForMembers(members, async(member, index) => {
    msg += member.name + ": " + member.roles + '\n';
  })
  message.channel.send(msg);
}

exports.getMissingDiscords = async (options, message) => {
	if (options.lenght > 0) {
		if (options[0] == 'all') {
			let allMissing = await dao.getMemberActiveMissingDiscordRet();
			message.channel.send("Members not on discord");
			let currentAlliance = 0;
			let msg = '';
			await asyncForMembers(allMissing, async(missing, index) => {
				if (currentAlliance != missing.alliance._id) {
					// new alliance
					if (msg.length > 0) {
						message.channel.send(msg);
					}
					msg = missing.alliance.name + "\n";
					currentAlliance = missing.alliance._id;
				}
				msg += missing.name + '\n';
			})
		}
	} else {
		let allianceId = await dao.findAllianceByChannelRet(message.channel.id);
		let allMissing = await dao.getMembersMissingDiscordByAllianceIdRet(allianceId);
			message.channel.send("Members not on discord");
			
			let msg = '';
			await asyncForMembers(allMissing, async(missing, index) => {
				msg += missing.name + '\n';
			})
			message.channel.send(msg);
	}
	
}

exports.getUnknownDiscordMembers = async (options, message) => {
	let allUnknown = await dao.getUnknownDiscordRet();
	let msg = '';
	await asyncForMembers(allUnknown, async(unknown, index) => {
		console.log(unknown);
		msg += "<@" + unknown.discordId + ">" + " : " + unknown.roles + '\n';		
	})
	message.channel.send(msg);
}

exports.finalgetAllianceByChannel = async (options, message) => {
	
	memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	if (memberRes.length > 0 && memberRes[0].hash && memberRes[0].hash.length > 0) {
		var final = 1;
		let refChannel = '';
		if (options.length > 0) {
			if (options[0].indexOf("<#") === 0) {
				console.log("a reference ");
				refChannel = options[0].slice(2,options[0].length-1);
				console.log("Reference = " + refChannel);
			}						
		}

		var alliance = {};
		if (refChannel.length > 0) {
			alliance = await dao.findAllianceByChannelRet( refChannel);
		} else {
			alliance = await dao.findAllianceByChannelRet( message.channel.id);
		}
		//var alliance = await dao.findAllianceByChannelRet( message.channel.id);
		if (alliance && alliance.length > 0) {
			let title = "Getting scores for " + alliance[0].name;
			message.channel.send(title);
			await bildv2(alliance[0]._id);
			
			console.log("BILD DONE");
			let pngName = alliance[0]._id + '.png';
			
			await message.channel.send({files: [pngName]});
			let today = new Date();
			let todayDay = today.getDay();
			console.log("final " + final); 
			if (final == 1) {				
				await medals(alliance[0]._id, message);

        console.log("Getting channel");
        var channel = message.guild.channels.get('759078485909831711');
				//var channel = await message.guild.channels.find(channel => channel.name === "week-end-scores");
				console.log("chan name: " + channel.name);
				channel.send(alliance[0].name);
				channel.send({files: [pngName]});
			}
		}
	} else {
		message.channel.send("Sorry no changes to the scoresheet has been detected.");
		let client = message.channel.client;
		let user = await client.fetchUser('365901367853711391');
		console.log('================ ======WIERD  ' + message.author.username);
		let names = message.author.username.split(' ');
		user.send("User: " + names[0] + ' Id ' + message.author.id + ' tried ' + message);
	}
	return alliance;
}

exports.lechannel = async (options, message) => {
  console.log(message.channel.id);
  let client = message.channel.client;
  let dauser = await client.fetchUser('365901367853711391');
  dauser.send('Channel: ' + message.channel.name + ' (' + message.channel.id + ')');
  if (options.length > 0) {
    if (options[0] == "init") {
      let allianceResult = await dao.findAllianceByChannelRet(message.channel.id);
      if (allianceResult.length > 0) {
        dao.editAllianceName(allianceResult[0]._id, message.channel.name);
        message.channel.send("Alliance updated");
      } else {
        dao.createAllianceByChan(message.channel.name, message.channel.id, false, true);
        message.channel.send("Alliance " + message.channel.name + " created. Pls add minimums from the web");
      }
    }  
  } else {
    message.channel.send("You dont know what channel you in? Sad!");
  }
  
}
 
exports.getAllianceByChannel = async (options, message) => {
	
	memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	if (memberRes.length > 0 && memberRes[0].hash && memberRes[0].hash.length > 0) {
		var final = 0;
		let refChannel = '';
		if (options.length > 0) {
			if (options[0] == "final") {
				// Final scores of the week
				console.log("its final");
				final = 1;
				if (options.length > 1) {
					refChannel = options[1].slice(2,options[0].length-1);
				}
			} else if (options[0].indexOf("<#") === 0) {
				console.log("a reference ");
				refChannel = options[0].slice(2,options[0].length-1);
				console.log("Reference = " + refChannel);
			}						
		}

		var alliance = {};
		if (refChannel.length > 0) {
			alliance = await dao.findAllianceByChannelRet( refChannel);
		} else {
			alliance = await dao.findAllianceByChannelRet( message.channel.id);
		}

		//let chan = await message.guild.channels.get('485898100292976647');
		

				                                             
		//var alliance = await dao.findAllianceByChannelRet( message.channel.id);
		if (alliance && alliance.length > 0) {
			let title = "Getting scores for " + alliance[0].name;
			message.channel.send(title);
			await bild(alliance[0]._id);
			
			console.log("BILD DONE");
			let pngName = alliance[0]._id + '.png';
			
			await message.channel.send({files: [pngName]});
			let today = new Date();
			let todayDay = today.getDay();
			console.log("final " + final); 
			if (final == 1) {				
				await medals(alliance[0]._id, message);
				
			}
		}
	} else {
		message.channel.send("Sorry no changes to the scoresheet has been detected.");
		let client = message.channel.client;
		let user = await client.fetchUser('365901367853711391');
		console.log('================ ======WIERD  ' + message.author.username);
		let names = message.author.username.split(' ');
		user.send("User: " + names[0] + ' Id ' + message.author.id + ' tried ' + message);
	}
	return alliance;
}

exports.getAllianceByChannelv2 = async (options, message) => {
	
	memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	if (memberRes.length > 0 && memberRes[0].hash && memberRes[0].hash.length > 0) {
		var final = 0;
		let refChannel = '';
		if (options.length > 0) {
			if (options[0] == "final") {
				// Final scores of the week
				console.log("its final");
				final = 1;
				if (options.length > 1) {
					refChannel = options[1].slice(2,options[0].length-1);
				}
			} else if (options[0].indexOf("<#") === 0) {
				console.log("a reference ");
				refChannel = options[0].slice(2,options[0].length-1);
				console.log("Reference = " + refChannel);
			}						
		}

		var alliance = {};
		if (refChannel.length > 0) {
			alliance = await dao.findAllianceByChannelRet( refChannel);
		} else {
			alliance = await dao.findAllianceByChannelRet( message.channel.id);
		}

		//let chan = await message.guild.channels.get('485898100292976647');
		

				                                             
		//var alliance = await dao.findAllianceByChannelRet( message.channel.id);
		if (alliance && alliance.length > 0) {
			let title = "Getting scores for " + alliance[0].name;
			message.channel.send(title);
			await bildv2(alliance[0]._id);
			
			console.log("BILD DONE");
			let pngName = alliance[0]._id + '.png';
			
			await message.channel.send({files: [pngName]});
			let today = new Date();
			let todayDay = today.getDay();
			console.log("final " + final); 
			if (final == 1) {				
				await medals(alliance[0]._id, message);
				
			}
		}
	} else {
		message.channel.send("Sorry no changes to the scoresheet has been detected.");
		let client = message.channel.client;
		let user = await client.fetchUser('365901367853711391');
		console.log('================ ======WIERD  ' + message.author.username);
		let names = message.author.username.split(' ');
		user.send("User: " + names[0] + ' Id ' + message.author.id + ' tried ' + message);
	}
	return alliance;
}

async function getAllianceByRefChannel(refChannel, message) {
	
	var alliance = await dao.findAllianceByChannelRet( refChannel);
	let title = "Getting scores for " + alliance[0].name;
	message.channel.send(title);
	await bild(alliance[0]._id);
	console.log("BILD DONE");
	let pngName = alliance[0]._id + '.png';
	message.channel.delete(5);
	await message.channel.send({files: [pngName]});
	let today = new Date();
	let todayDay = today.getDay();
	console.log("DAGEN " + todayDay);
	if (todayDay == 3) {
		message.channel.send(":first_place: <@365901367853711391>");
	}
	return alliance;
}

exports.editMember = async (message) => {
	var memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	message.channel.send("I see you " + memberRes[0].name);
}	
	  
exports.getAllianceByChanellId = async (chanellId) => {

	var alliance = await dao.findAllianceByChannelRet( chanellId);
	console.log("FOUND WHAT " + alliance[0]);
	console.log("FOUND PREC " + alliance[0]._id);
	await bild(alliance[0]._id);
	console.log("BILD DONE");
	return alliance;
}

exports.getMemberCountByChannelId = async (options, message) => {
	if (options.length > 0 && options[0].indexOf("<#") === 0) {
		console.log("a reference ");
		let alliance = await dao.findAllianceByChannelRet(options[0].slice(2,options[0].length-1), message);	
		let memberRet = await dao.findMembersByAllianceRet(alliance[0]._id);
		message.delete(500);
		message.channel.send("<#" + alliance[0].channelId + "> " + memberRet.length + "/30");		
	} else {
		let alliance = await dao.findAllianceByChannelRet( message.channel.id);
		let memberRet = await dao.findMembersByAllianceRet(alliance[0]._id);
		message.channel.send("<#" + alliance[0].channelId + "> " + memberRet.length + "/30");
		return memberRet.length;
	}
}

exports.sorry = async (message) => {
	
	message.channel.send("It's ok, noone is perfect");
}	

exports.randomMembers = async (options, message) => {
	let members = await dao.findAllActiveMembersRet();
	console.log('found ' + members.length + ' members');
	let nrResults = 1;
	if (options.length > 0) {		
		nrResults = parseInt(options[0]);
		console.log('getting nr of randoms ' + nrResults);
	}
	let results = '';
	await asyncForindex(nrResults, async(i) => {
		let maxNr = members.length;
		let memberIndex = Math.floor(Math.random() * parseInt(members.length));
		console.log('max ' + maxNr);
		console.log('Random index ' + memberIndex);
		results += '\n' + members[memberIndex].name;
		members.splice(memberIndex, 1);		
	})


	message.channel.send(results);
}

exports.whereisbydiscordId = async (options, message) => {
	if (options.length > 0) {
		console.log("STAT option: " + options[0]);
		if (options[0].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(3,options[0].length-1));
		} else if (options[0].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(2,options[0].length-1));
		} else {
			console.log('DiscordId? ' + options[0]);
      memberRes = await dao.findMemberByDiscordIdRet(options[0]);
      if (memberRes.length <= 0) {
        console.log('looking for ' + options[0]);
        memberRes = await dao.findMemberByNameRet(options[0]);
      }
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	
	if (memberRes.length > 0) {
		let scores = await dao.getScoresByMemberIdDateSorted(memberRes[0]._id.toString());
		let msg = '';
		let lastAlli = 0;
		await asyncForMembers(scores, async(score, index) =>{		
			if (score.alliance._id != lastAlli) {
				console.log("pushing " + score.alliance.name + " " + score.scoreDate);
				msg = msg + "\n" + score.alliance.name + " " + score.scoreDate.toLocaleDateString("en-US");

				lastAlli = score.alliance._id;

			}
		});	
    let resultMsg = memberRes[0].name + " last seen:\n" + msg;
    resultMsg = resultMsg + "\n\nFirst seen: \n" + scores[scores.length-1].alliance.name + " " + scores[scores.length-1].scoreDate.toLocaleDateString("en-US");
		message.channel.send(resultMsg);	
	
	}
}	

exports.getStatsMemberByDiscordId = async (options, message) => {
	let memberRes = [];
	var memberRet = [];
	var minOpt = 0;
	if (options.length > 0) {
		console.log("STAT option: " + options[0]);
		if (options[options.length -1] == "raw") {
			options.pop();
			this.getStatsMemberByDiscordIdRaw(options, message);
			console.log("raw stats done");
			return;
    }
        
		if (options[0].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(3,options[0].length-1));
		} else if (options[0].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(2,options[0].length-1));
		} else {
      console.log('DiscordId? ' + options[0]);
      memberRes = await dao.findMemberByDiscordIdRet(options[0]);
      if (memberRes.length <= 0) {
        console.log('looking for ' + options[0]);
        memberRes = await dao.findMemberByNameRet(options[0]);
      }
		}
		if (options.length > 1) {
			minOpt = parseInt(options[1]);
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	
	if (memberRes.length > 0) {
		console.log("FOUND MEMBER: " + memberRes); 
		let startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 3);
		console.log("STAT StartDate " + startDate);
		let resultMsg = "Found stats (ignoring 10% precentile min-max):\n"
		let totalstats = await dao.getMemberTotalsDateRet(memberRes[0]._id.toString(), startDate);
		let nrTotals = totalstats.length;
		let nrTotalLowIndex = Math.ceil(nrTotals*0.1);
		let nrTotalHighIndex = nrTotals - 1 - Math.floor(nrTotals*0.1);
		let avgTotal = 0;
		let statTotal = 0
		let minTotal = 0;
		let maxTotal = 0;
		let quantTotalNr = nrTotals - Math.floor(nrTotals*0.1) - nrTotalLowIndex;
		console.log("QUANT " + quantTotalNr);
		await asyncForMembers(totalstats, async(totalstat, index) =>{
			console.log("totalindex: " + index + ", nrTotalHIghIndex: "+ nrTotalHighIndex + ", nrTotals: " + nrTotals);
			if (index < nrTotalLowIndex) {
				//ignore
			} else if (index > nrTotalHighIndex) {
				//ignore
			} else if (index == nrTotalLowIndex) {
				minTotal = totalstat.total;
				statTotal += totalstat.total;
			} else if (index == nrTotalHighIndex) {
				maxTotal = totalstat.total;
				statTotal += totalstat.total;
			} else {
				statTotal += totalstat.total;
			}
			
		});	
		avgTotal = statTotal/quantTotalNr;
		console.log("AVG " + statTotal + " quant " + quantTotalNr + " is " + avgTotal);
		resultMsg = resultMsg + "Totals \n"
		resultMsg = resultMsg + "avg: " + Math.floor(avgTotal) + " min: " + minTotal + " max: " + maxTotal + "\n";
		console.log("TOTALRES " + resultMsg);
		let statsPvp = await dao.getAllPvPScoresMemberIdDateRet(memberRes[0]._id, startDate);
		let totalPvp = 0;
		let avgPvp = 0;
		let minPvp = 0;
		let maxPvp = 0;
		let nrPvp = statsPvp.length;
		let nrPvpLowIndex = Math.ceil(nrPvp*0.1);
		let nrPvpHighIndex = nrPvp - Math.floor(nrPvp*0.1);
		let quantPvpNr = nrPvp - 1 - Math.floor(nrPvp*0.1) - nrPvpLowIndex;
		await asyncForMembers(statsPvp, async(statPvp, index) =>{
			console.log("pvppart: index= " + index + ", score: " + statPvp.score + ", totalPvp: " + totalPvp + ", nrPvp: " + nrPvp + ", nrPvpHighIndex: " + nrPvpHighIndex + ", nrPvpLowIndex: " + nrPvpLowIndex);
			if (index < nrPvpLowIndex) {
				//ignore
			} else if (index > nrPvpHighIndex) {
				//ignore
			} else if (index == nrPvpLowIndex) {
				minPvp = statPvp.score;
				totalPvp += statPvp.score;
			} else if (index == nrPvpHighIndex) {
				console.log("MAX: " + statPvp.score);
				maxPvp = statPvp.score;
				totalPvp += statPvp.score;
			} else {
				totalPvp += statPvp.score;
			}
			
		});	
		avgPvp = totalPvp/quantPvpNr;
		console.log("STAT PVP");
		console.log("quantPvpNr: " + quantPvpNr + ", totalPvp: " + totalPvp + ", avgPvp: " + avgPvp);
		resultMsg = resultMsg + "PVP (" + nrPvp + " pvp days)\n";
		resultMsg = resultMsg + "avg: " + Math.floor(avgPvp) + " min: " + minPvp + " max: " + maxPvp + "\n";
		let statsPve = await dao.getAllPveScoresMemberIdDateRet(memberRes[0]._id, startDate);
		let totalPve = 0;
		let avgPve = 0;
		let minPve = 0;
		let maxPve = 0;
		let nrPve = statsPve.length;
		let nrPveLowIndex = Math.ceil(nrPve*0.1);
		let nrPveHighIndex = nrPve - Math.floor(nrPve*0.1);
		let quantPveNr = nrPve - 1 - Math.floor(nrPve*0.1) - nrPveLowIndex;
		await asyncForMembers(statsPve, async(statPve, index) =>{
			console.log("pvepart: index= " + index + ", score: " + statPve.score + ", totalPve: " + totalPve + ", nrPve: " + nrPve + ", nrPveHighIndex: " + nrPveHighIndex + ", nrPveLowIndex: " + nrPvpLowIndex);
			if (index < nrPveLowIndex) {
				//ignore
			} else if (index > nrPveHighIndex) {
				//ignore
			} else if (index == nrPveLowIndex) {
				minPve = statPve.score;
				totalPve += statPve.score;
			} else if (index == nrPveHighIndex) {
				maxPve = statPve.score;
				totalPve += statPve.score;
			} else {
				totalPve += statPve.score;
			}
			
		});	
		avgPve = totalPve/quantPveNr;
		console.log("STAT PVE");
		resultMsg = resultMsg + "PVE (" + nrPve + " pve days)\n";
		resultMsg = resultMsg + "avg: " + Math.floor(avgPve) + " min: " + minPve + " max: " + maxPve + "\n";
		console.log("DARESULT " + resultMsg);
		message.channel.send(resultMsg);
	} else if (memberRet.length > 0) {
		console.log("Found " + memberRet.length + " members");
		var resultMsg = "Totals avg (Last 3 months, ignoring 10% precentile min-max):\n";		
		let statList = [];
		await asyncForMembers(memberRet, async(member, index) =>{
			let startDate = new Date();
			startDate.setMonth(startDate.getMonth() - 3);
			console.log("STAT StartDate " + startDate);
			
			let totalstats = await dao.getMemberTotalsDateRet(member._id.toString(), startDate);
			let nrTotals = totalstats.length;
			let nrTotalLowIndex = Math.ceil(nrTotals*0.1);
			let nrTotalHighIndex = nrTotals - 1 - Math.floor(nrTotals*0.1);
			let avgTotal = 0;
			let statTotal = 0
			let minTotal = 0;
			let maxTotal = 0;
			let quantTotalNr = nrTotals - Math.floor(nrTotals*0.1) - nrTotalLowIndex;
			console.log("QUANT " + quantTotalNr);
			await asyncForMembers(totalstats, async(totalstat, index) =>{
				console.log(member.name + "totalindex: " + index + ", nrTotalHIghIndex: "+ nrTotalHighIndex + ", nrTotals: " + nrTotals);
				if (index < nrTotalLowIndex) {
					//ignore
				} else if (index > nrTotalHighIndex) {
					//ignore
				} else if (index == nrTotalLowIndex) {
					minTotal = totalstat.total;
					statTotal += totalstat.total;
				} else if (index == nrTotalHighIndex) {
					maxTotal = totalstat.total;
					statTotal += totalstat.total;
				} else {
					statTotal += totalstat.total;
				}
				
			});	
			avgTotal = statTotal/quantTotalNr;
			console.log("AVG " + statTotal + " quant " + quantTotalNr + " is " + avgTotal);	
			let totalObj = {};
			totalObj.avgTotal = Math.floor(avgTotal);
			totalObj.min = minTotal;
			totalObj.max = maxTotal;
			totalObj.name = member.name;
			if (totalObj.avgTotal > minOpt) {
				statList.push(totalObj);	
			}
			//resultMsg = resultMsg + member.name + ": " + Math.floor(avgTotal) + " min: " + minTotal + " max: " + maxTotal + "\n";
			console.log("TOTALRES " + resultMsg);
			
		});	
		statList.sort(function(a, b) {
			return a.avgTotal - b.avgTotal;
		});
		resultMsg = resultMsg + statList.length + " members\n";
		await asyncForMembers(statList, async(dastat, index) =>{
			resultMsg = resultMsg + dastat.name + ": " + dastat.avgTotal + " min: " + dastat.min + " max: " + dastat.max + "\n";
		});
		message.channel.send(resultMsg);
	}
}

exports.getStatsMemberByDiscordIdRaw = async (options, message) => {
	let memberRes = [];
	var memberRet = [];
	var minOpt = 0;
	if (options.length > 0) {
		console.log("STAT option: " + options[0]);
		if (options[0].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(3,options[0].length-1));
		} else if (options[0].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(2,options[0].length-1));
		} else if (options.length > 0 && options[0].indexOf("<#") === 0) {
			console.log("a reference stat");
			let alliance = await dao.findAllianceByChannelRet(options[0].slice(2,options[0].length-1), message);	
			memberRet = await dao.findMembersByAllianceRet(alliance[0]._id);
			console.log("Found " + memberRet.length + " members");
		} else {
			console.log('looking for ' + options[0]);
			memberRes = await dao.findMemberByNameRet(options[0]);
		}
		if (options.length > 1) {
			minOpt = parseInt(options[1]);
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	
	if (memberRes.length > 0) {
		console.log("FOUND MEMBER: " + memberRes);
		let startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 3);
		console.log("STAT StartDate " + startDate);
		let resultMsg = "Found stats (including all (90 days)):\n"
		let totalstats = await dao.getMemberTotalsDateRet(memberRes[0]._id.toString(), startDate);
		let nrTotals = totalstats.length;
		let nrTotalLowIndex = 0;
		let nrTotalHighIndex = nrTotals - 1;
		let avgTotal = 0;
		let statTotal = 0
		let minTotal = 0;
		let maxTotal = 0;
		let quantTotalNr = nrTotals;
		console.log("QUANT " + quantTotalNr);
		await asyncForMembers(totalstats, async(totalstat, index) =>{
			console.log("totalindex: " + index + ", nrTotalHIghIndex: "+ nrTotalHighIndex + ", nrTotals: " + nrTotals);
			if (index < nrTotalLowIndex) {
				//ignore
			} else if (index > nrTotalHighIndex) {
				//ignore
			} else if (index == nrTotalLowIndex) {
				minTotal = totalstat.total;
				statTotal += totalstat.total;
			} else if (index == nrTotalHighIndex) {
				maxTotal = totalstat.total;
				statTotal += totalstat.total;
			} else {
				statTotal += totalstat.total;
			}
			
		});	
		avgTotal = statTotal/quantTotalNr;
		console.log("AVG " + statTotal + " quant " + quantTotalNr + " is " + avgTotal);
		resultMsg = resultMsg + "Totals \n"
		resultMsg = resultMsg + "avg: " + Math.floor(avgTotal) + " min: " + minTotal + " max: " + maxTotal + "\n";
		console.log("TOTALRES " + resultMsg);
		let statsPvp = await dao.getAllPvPScoresMemberIdDateRet(memberRes[0]._id, startDate);
		let totalPvp = 0;
		let avgPvp = 0;
		let minPvp = 0;
		let maxPvp = 0;
		let nrPvp = statsPvp.length;
		let nrPvpLowIndex = 0;
		let nrPvpHighIndex = nrPvp - 1;
		let quantPvpNr = nrPvp;
		await asyncForMembers(statsPvp, async(statPvp, index) =>{
			console.log("pvppart: index= " + index + ", score: " + statPvp.score + ", totalPvp: " + totalPvp + ", nrPvp: " + nrPvp + ", nrPvpHighIndex: " + nrPvpHighIndex + ", nrPvpLowIndex: " + nrPvpLowIndex);
			if (index < nrPvpLowIndex) {
				//ignore
			} else if (index > nrPvpHighIndex) {
				//ignore
			} else if (index == nrPvpLowIndex) {
				minPvp = statPvp.score;
				totalPvp += statPvp.score;
			} else if (index == nrPvpHighIndex) {
				console.log("MAX: " + statPvp.score);
				maxPvp = statPvp.score;
				totalPvp += statPvp.score;
			} else {
				totalPvp += statPvp.score;
			}
			
		});	
		avgPvp = totalPvp/quantPvpNr;
		console.log("STAT PVP");
		console.log("quantPvpNr: " + quantPvpNr + ", totalPvp: " + totalPvp + ", avgPvp: " + avgPvp);
		resultMsg = resultMsg + "PVP (" + nrPvp + " pvp days)\n";
		resultMsg = resultMsg + "avg: " + Math.floor(avgPvp) + " min: " + minPvp + " max: " + maxPvp + "\n";
		let statsPve = await dao.getAllPveScoresMemberIdDateRet(memberRes[0]._id, startDate);
		let totalPve = 0;
		let avgPve = 0;
		let minPve = 0;
		let maxPve = 0;
		let nrPve = statsPve.length;
		let nrPveLowIndex = 0;
		let nrPveHighIndex = nrPve - 1;
		let quantPveNr = nrPve;
		await asyncForMembers(statsPve, async(statPve, index) =>{
			console.log("pvepart: index= " + index + ", score: " + statPve.score + ", totalPve: " + totalPve + ", nrPve: " + nrPve + ", nrPveHighIndex: " + nrPveHighIndex + ", nrPveLowIndex: " + nrPvpLowIndex);
			if (index < nrPveLowIndex) {
				//ignore
			} else if (index > nrPveHighIndex) {
				//ignore
			} else if (index == nrPveLowIndex) {
				minPve = statPve.score;
				totalPve += statPve.score;
			} else if (index == nrPveHighIndex) {
				maxPve = statPve.score;
				totalPve += statPve.score;
			} else {
				totalPve += statPve.score;
			}
			
		});	
		avgPve = totalPve/quantPveNr;
		console.log("STAT PVE");
		resultMsg = resultMsg + "PVE (" + nrPve + " pve days)\n";
		resultMsg = resultMsg + "avg: " + Math.floor(avgPve) + " min: " + minPve + " max: " + maxPve + "\n";
		console.log("DARESULT " + resultMsg);
		message.channel.send(resultMsg);
	} else if (memberRet.length > 0) {
		console.log("Found " + memberRet.length + " members");
		var resultMsg = "Totals avg (Last 3 months, ignoring 10% precentile min-max):\n";		
		let statList = [];
		await asyncForMembers(memberRet, async(member, index) =>{
			let startDate = new Date();
			startDate.setMonth(startDate.getMonth() - 3);
			console.log("STAT StartDate " + startDate);
			
			let totalstats = await dao.getMemberTotalsDateRet(member._id.toString(), startDate);
			let nrTotals = totalstats.length;
			let nrTotalLowIndex = 0;
			let nrTotalHighIndex = nrTotals - 1;
			let avgTotal = 0;
			let statTotal = 0
			let minTotal = 0;
			let maxTotal = 0;
			let quantTotalNr = nrTotals;
			console.log("QUANT " + quantTotalNr);
			await asyncForMembers(totalstats, async(totalstat, index) =>{
				console.log(member.name + "totalindex: " + index + ", nrTotalHIghIndex: "+ nrTotalHighIndex + ", nrTotals: " + nrTotals);
				if (index < nrTotalLowIndex) {
					//ignore
				} else if (index > nrTotalHighIndex) {
					//ignore
				} else if (index == nrTotalLowIndex) {
					minTotal = totalstat.total;
					statTotal += totalstat.total;
				} else if (index == nrTotalHighIndex) {
					maxTotal = totalstat.total;
					statTotal += totalstat.total;
				} else {
					statTotal += totalstat.total;
				}
				
			});	
			avgTotal = statTotal/quantTotalNr;
			console.log("AVG " + statTotal + " quant " + quantTotalNr + " is " + avgTotal);	
			let totalObj = {};
			totalObj.avgTotal = Math.floor(avgTotal);
			totalObj.min = minTotal;
			totalObj.max = maxTotal;
			totalObj.name = member.name;
			if (totalObj.avgTotal > minOpt) {
				statList.push(totalObj);	
			}
			//resultMsg = resultMsg + member.name + ": " + Math.floor(avgTotal) + " min: " + minTotal + " max: " + maxTotal + "\n";
			console.log("TOTALRES " + resultMsg);
			
		});	
		statList.sort(function(a, b) {
			return a.avgTotal - b.avgTotal;
		});
		resultMsg = resultMsg + statList.length + " members\n";
		await asyncForMembers(statList, async(dastat, index) =>{
			resultMsg = resultMsg + dastat.name + ": " + dastat.avgTotal + " min: " + dastat.min + " max: " + dastat.max + "\n";
		});
		message.channel.send(resultMsg);
	}
}

exports.getStatsMemberByDiscordIdFull = async (options, message) => {
	if (options.length > 0) {
		console.log("STAT option: " + options[0]);
		if (options[0].indexOf("<@!") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(3,options[0].length-1));
		} else if (options[0].indexOf("<@") === 0) {
			memberRes = await dao.findMemberByDiscordIdRet(options[0].slice(2,options[0].length-1));
		} else {
			memberRes = await dao.findMemberByNameRet(options[0]);
		}
	} else {
		memberRes = await dao.findMemberByDiscordIdRet(message.author.id);
	}
	console.log("FOUND MEMBER: " + memberRes);
	if (memberRes.length > 0) {
		
		console.log("LOOK " + memberRes[0]._id);
		let resultMsg = "Found stats:\n"
		let totalstats = await dao.getMemberTotalsRet(memberRes[0]._id.toString());
		let stats = await dao.getStatsTotalsMemberIdRet(memberRes[0]._id.toString());
		console.log("STAT ");
		console.log(stats);
		console.log("avg: " + Math.floor(stats[0].avgTotal) + " min: " + stats[0].minTotal + " max: " + stats[0].maxTotal + " totoalTotals: " + stats[0].totalTotals + " count: " + stats[0].count);
		resultMsg = resultMsg + "Totals \n"
		resultMsg = resultMsg + "avg: " + Math.floor(stats[0].avgTotal) + " min: " + stats[0].minTotal + " max: " + stats[0].maxTotal + "\n";
		let statsPvp = await dao.getStatsPvPMemberIdRet(memberRes[0]._id);
		console.log("STAT PVP");
		console.log(statsPvp);
		console.log("avg: " + Math.floor(statsPvp[0].avgPvp) + " min: " + statsPvp[0].minPvp + " max: " + statsPvp[0].maxPvp + " totoalTotals: " + statsPvp[0].totalPvp + " count: " + statsPvp[0].count);
		resultMsg = resultMsg + "PVP (" + statsPvp[0].count + " pvp days)\n";
		resultMsg = resultMsg + "avg: " + Math.floor(statsPvp[0].avgPvp) + " min: " + statsPvp[0].minPvp + " max: " + statsPvp[0].maxPvp + "\n";
		let statsPve = await dao.getStatsPveMemberIdRet(memberRes[0]._id);
		console.log("STAT PVE");
		console.log(statsPve);
		console.log("avg: " + Math.floor(statsPve[0].avgPve) + " min: " + statsPve[0].minPve + " max: " + statsPve[0].maxPve + " totoalTotals: " + statsPve[0].totalPve + " count: " + statsPve[0].count);
		resultMsg = resultMsg + "PVE (" + statsPve[0].count + " pve days)\n";
		resultMsg = resultMsg + "avg: " + Math.floor(statsPve[0].avgPve) + " min: " + statsPve[0].minPve + " max: " + statsPve[0].maxPve + "\n";
		message.channel.send(resultMsg);
	}
}

exports.poll = async (options, message) => {
	//message.channel.send("I am ok! how are you?");
	let client = message.channel.client;
	
	let user = await client.fetchUser('365901367853711391');
    // fetch user via given user id
	console.log(user);
	let alliance = await dao.findAllianceByChannelRet(message.channel.id);
	//if (message.channel.id == '493156185357156368' ) {
	console.log("LOGGING ALLIANCE ==============================================================================");
	console.log(alliance);
  console.log("ALLIANC ISADMIN: " + alliance[0].isAdmin);
  options.forEach(function(opti) {
    console.log(opti);
  });
//	if (alliance[0].isAdmin) {
    if (alliance.name) {
      message.channel.send("Alliance " + alliance.name);
    } else {
      message.channel.send("Test what?");
    }
    
//	}
    //    user.send('Test message'); 

}


async function asyncGetAlliance(chanellId, alliance, callback) {
	await callback(chanellId, alliance);
	
}


