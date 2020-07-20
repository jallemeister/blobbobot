const Discord = require("discord.js");
const config = require("./config/config.json");
const async = require("async");
const assert = require('assert');
const uuid = require('uuid/v4');

var blobbo_controller = require('./controllers/blobboController');
var automation_controller = require('./controllers/automationController');

const daoModule = require("./scripts/dao");
var dao = new daoModule();

const alliances = require("./models/alliances.js");
const members = require("./models/members.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var express = require('express');
app = express();
port = process.env.PORT || 3000;

app.listen(port);



const client = new Discord.Client();



client.on("ready", () => {
  console.log("I am ready!");
  client.setTimeout(automation_controller.excuteIntervall, 3000, client);
});

blobbo_controller.addCommand("chan", blobbo_controller.lechannel, "test");
blobbo_controller.addCommand("test", blobbo_controller.test, "test", true);
blobbo_controller.addCommand("", blobbo_controller.getAllianceByChannelv2, "Just !blobbos shows scores (scorekeepers)");
blobbo_controller.addCommand("final", blobbo_controller.finalgetAllianceByChannel, "Weekly reset show scores with medals and post to week-end-scores (scorekeepers)");
blobbo_controller.addCommand("help", blobbo_controller.help, ": Duh!");
blobbo_controller.addCommand("namecolor", blobbo_controller.editMemberNamecolor, "<color>: set text color on name");
blobbo_controller.addCommand("bgcolor", blobbo_controller.editMemberBgcolor, "<color>: set background color on name");
blobbo_controller.addCommand("addme", blobbo_controller.setPassword, "create password for site", true);
blobbo_controller.addCommand("membercount", blobbo_controller.getMemberCountByChannelId, "Get current membercount");
blobbo_controller.addCommand("stats", blobbo_controller.getStatsMemberByDiscordId, "<scorename|discordname|#channel> <minimum> Get stats from scores");
blobbo_controller.addCommand("close", blobbo_controller.close, "");
blobbo_controller.addCommand("open", blobbo_controller.open, "");
blobbo_controller.addCommand("clear", blobbo_controller.clear, "Deletes <number> of messages");
blobbo_controller.addCommand("members", blobbo_controller.getMembersInfo, "discordid and info of members (maintenance function)", true);
blobbo_controller.addCommand("memberinfo", blobbo_controller.listDiscordMembers, "discordid and info of members (maintenance function)", true);
blobbo_controller.addCommand("whereis", blobbo_controller.whereisbydiscordId, "where is member last seen");
blobbo_controller.addCommand("randommembers", blobbo_controller.randomMembers, "<nr of randoms>: return a set of random membernames");
blobbo_controller.addCommand("missing", blobbo_controller.getMissingDiscords, "List members with no discordId, option 'all' lists all", true);
blobbo_controller.addCommand("unknown", blobbo_controller.getUnknownDiscordMembers, "List discordmembers not in the bot", true);
blobbo_controller.addCommand("poll", blobbo_controller.polls, "create <descriptions> <answer>:<answer description>... <number of days poll is active>  : ex. !blobbos create \"Is this a poll\" yes:yupp no;\"no this is not a poll\" 3");
blobbo_controller.addCommand("v2", blobbo_controller.getAllianceByChannel, "");

//blobbo_controller.addCommandV2("test", blobbo_controller.test, {"test2": {action: "Wohoo"}}, "test", true);
//blobbo_controller.addCommandV2("chan", blobbo_controller.test, {}, "test", true);
//blobbo_controller.addCommandV2("showscores", blobbo_controller.getAllianceByChannel, "Just !blobbos shows scores (scorekeepers)");


client.on("guildMemberAdd", (member) => {
  console.log('USER ADDED SERVER ' + member.user.username);
});
/* client.on("guildMemberAdd", (member) => {
  console.log('USER ADDED SERVER ' + member.user.username);
  // Send the message to a designated channel on a server:
  var username = member.user.username;
  // Do nothing if the channel wasn't found on this server
  // Send the message, mentioning the member
  var daOser = await member.client.fetchUser('365901367853711391');
		
	daOser.send("User: " + username + ' Joined the server');
}); */

client.on("message", (message) => {
  if(message.author.bot) return;

  // Welcome message
  if (message.channel.id == '501018898674483230' ) {
    blobbo_controller.getMembersInfo("options", message);
    return;
  }
  
  if(message.content.indexOf(config.prefix) !== 0) return;  
  // Might be a command, check it
  if(message.content.indexOf(config.prefix + config.command) !== 0) return;
  
  const allArgs = message.content.slice(config.prefix.length).trim().split(/ +/g);
  //const allArgs = message.content.slice(config.prefix.length).trim().split(/\w+|"[^"]+"/g);
  let optionsStr = message.content.slice(config.prefix.length + config.command.length).trim();
  const command = allArgs.shift().toLowerCase();
  var args = allArgs.splice(0);
  var fnrgOrg = optionsStr.match(/\w+|"[^"]+"|\:/g);
  console.log("OPTIONSTR: " + optionsStr);
  var fnrg = [""];
  if (optionsStr.length > 0) {
    //fnrg = optionsStr.split(/ +/g).splice(0);
    fnrg = optionsStr.match(/\w+|"[^"]+"|\:/g);
    fnrg = fnrgOrg.splice(0);
    //let fnrg = [];
    //if (fnrgOrg && fnrgOrg.length > 0) {
    //  fnrg = fnrgOrg.splice(0);
    //}
    console.log("FNRG");
    fnrg.forEach(function(opti, fnrgindex) {
      console.log(opti);
      if (opti.startsWith('"')) {
        console.log("Subbing " + opti.substr(1, opti.length-2));
        fnrg[fnrgindex] = opti.substr(1, opti.length-2);
      }
    });
    console.log("FNRG2");
    fnrg.forEach(function(opti) {
      console.log(opti);    
    });
  }
  var myRegexp = /[^\s"]+|"([^"]*)"/gi;
  var myString = message.content.slice(config.prefix.length + config.command.length).trim();
  var myArray = [];

  do {
      //Each call to exec returns the next regex match as an array
      var match = myRegexp.exec(myString);
      if (match != null)
      {
          //Index 1 in the array is the captured group if it exists
          //Index 0 is the matched text, which we use if no captured group exists
          myArray.push(match[1] ? match[1] : match[0]);          
      }
  } while (match != null);
  
  console.log("OPT: " + myArray);
  if (command === "blobbos") {	  
    blobbo_controller.handleCommand(fnrg, message);
    //blobbo_controller.handleCommandV2(myArray, message);
  }
});

 
client.login(process.env.NEXT_INDEX);

	