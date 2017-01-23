'use strict';

var handlebars = require("handlebars");
var bodyParser = require("body-parser");

var path = process.cwd();
//var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollManager = require(path + '/app/controllers/pollManager.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollManager = new PollManager();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	
	app.route('/new')
		.get(isLoggedIn, function(req, res){
			res.sendFile(path + '/public/new.html');
		});
	
	app.route('/submit')
		/*.get(function(req, res){
			res.redirect('/new');
		})//*/
		.post(isLoggedIn, bodyParser.json(), bodyParser.urlencoded({ extended: true }), pollManager.createPoll);
	
	app.route('/poll/:id')
		.get(function(req, res){
			res.sendFile(path + '/public/poll.html');
		});
	
	app.route('/api/user/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	
	app.route('/api/polls')
		.get(pollManager.getPolls);
	
	//app.route('/api/polls/:user')
	//	.get(pollManager.getUserPolls);
	
};
