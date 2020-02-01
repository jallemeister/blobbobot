var express = require('express')
const async = require("async");
const uuid = require('uuid/v4');
var alliance_controller = require('../controllers/allianceController');
var member_controller = require('../controllers/memberController');
var score_controller = require('../controllers/scoreController');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const daoModule = require("./dao");
var router = express.Router()

var dao = new daoModule();

const mongoose = require("mongoose");//.set('debug', true);
mongoose.Promise = global.Promise;


//const alliances = require("../models/alliances.js");

var previousBackUrl = "/";
var backUrl ="";

// middleware that is specific to this router
router.use(function backRouting (req, res, next) {
  const uniqueId = uuid();
  backUrl = previousBackUrl;
  previousBackUrl=req.header('referer') || '/';
  next()
});

function isAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		console.log("You be auth mate");
		console.log(req.user.banana);
		next();
	} else {
		console.log("You no authenticated, go away");
		return res.redirect("/login")
	}
}

router.get('/', isAuthenticated, alliance_controller.list);
router.get('/login', alliance_controller.login_get);
router.post('/login', alliance_controller.login_post);

router.get('/about', isAuthenticated, alliance_controller.about);

router.get('/alliances/:allianceId/edit', isAuthenticated, alliance_controller.edit_get);
router.post('/alliances/:allianceId/edit', isAuthenticated, alliance_controller.edit_post);

router.get('/alliances/new', isAuthenticated, alliance_controller.new_get);

router.post('/alliances/new', isAuthenticated, alliance_controller.new_post);
router.get('/alliances/:allianceId/showscore/:dateIndex', isAuthenticated, score_controller.show);
router.get('/alliances/:allianceId/showscorebot/:dateIndex', score_controller.show);

// Members
router.get('/members', isAuthenticated, member_controller.list);
router.get('/members/:memberId/edit', isAuthenticated, member_controller.edit_get);
router.get('/members/:memberId/remove', isAuthenticated, member_controller.remove);
router.post('/members/:memberId/edit', isAuthenticated, member_controller.edit_post);
router.get('/members/new', isAuthenticated, member_controller.new_get);

router.post('/members/new', isAuthenticated, member_controller.new_post);


//Scores
router.get('/scores/:memberId/editmemberdate', isAuthenticated, score_controller.edit_member_date_get);
router.post('/scores/:memberId/editmemberdate', isAuthenticated, score_controller.edit_member_date_post);
router.post('/scores/:memberId/editmemberweek', isAuthenticated, score_controller.edit_member_score_week_post);
router.get('/scores/:allianceId/total', isAuthenticated, score_controller.new_totals_get);
router.post('/scores/:allianceId/total', isAuthenticated, score_controller.new_totals_post);
router.get('/scores/:allianceId/new', isAuthenticated, score_controller.new_get);
router.post('/scores/:allianceId/new', isAuthenticated, score_controller.new_post);

router.get('/scores/:allianceId/editdate', isAuthenticated, score_controller.edit_date_get);
router.post('/scores/:allianceId/editdate', isAuthenticated, score_controller.edit_date_post);
router.get('/scores/:allianceId/editweek/:dateIndex', isAuthenticated, score_controller.edit_week_get);
router.get('/scores/:allianceId/edit', isAuthenticated, score_controller.edit_get);
router.post('/scores/:allianceId/edit', isAuthenticated, score_controller.edit_post);

router.get('/back', function(req, res){
  // do your thang
  console.log('backUrl(back): ' + backUrl);
  res.redirect(backUrl);
});

module.exports = router
