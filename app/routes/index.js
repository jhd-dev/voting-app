'use strict';

var bodyParser = require("body-parser");

var path = process.cwd();
var PollManager = require(path + '/app/controllers/pollManager.server.js');

module.exports = function (app, passport) {
	
	function isLoggedIn (target){
		var redirect = '/login' + (target ? "?target=" : "");
		return (function(req, res, next) {
			if (req.isAuthenticated()) {
				return next();
			} else {
				res.redirect(redirect);
			}
		});
	}

	var pollManager = new PollManager();

	app.route('/')
		.get(function (req, res) {
			//res.sendFile(path + '/public/index.html');
			res.render('index', {
				title: "Voting App",
				scripts: [
					"common/ajax-functions.js",
					//"controllers/clickController.client.js",
					"controllers/userController.client.js"
				],
				user: req.user || {}
			});
		});

	app.route('/login')
		.get(function (req, res) {
			//res.sendFile(path + '/public/login.html');
			res.render('login', {
				title: "Login :: Voting App"
			});
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn(), function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
	
	app.route('/new')
		.get(isLoggedIn(), function(req, res){
			res.sendFile(path + '/public/new.html');
		});
	
	app.route('/submit')
		.get(function(req, res){
			res.redirect('/new');
		})
		.post(isLoggedIn(), bodyParser.json(), bodyParser.urlencoded({ extended: true }), pollManager.createPoll);
	
	app.route('/poll/:id')
		.get(function(req, res){
			res.render('poll', {
				title: "Voting App",
				scripts: [
					"/common/ajax-functions.js",
					"https://unpkg.com/vue/dist/vue.js",
					"https://www.gstatic.com/charts/loader.js",
					"/controllers/pollViewer.client.js"
				]
			});
		})
		.post(bodyParser.json(), bodyParser.urlencoded({ extended: true }), pollManager.setVote);
	
	app.route('/api/poll/:id')
		.get(pollManager.getPoll);
	
	app.route('/api/user/:id')
		.get(isLoggedIn(), function (req, res) {
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
