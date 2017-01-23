'use strict';

var Polls = require("../models/polls.js");

function PollManager() {
    
    this.getPolls = function(req, res){
        console.log("get polls!");
        Polls.find({}, {"_id": false})
            .exec(function(err, polls){
                if (err) throw err;
                console.log(polls, polls.length);
                res.json({
                    polls: polls
                });
            });
    };
    
    this.getUserPolls = function(req, res){
        Polls.find({
            author: req.params.user
        }, {"_id": false})
            .exec(function(err, polls){
                if (err) throw err;
                res.json(polls); 
            });
    };
    
    this.createPoll = function(req, res){
        var poll = new Polls({
            author: req.user.github.id,
            title: req.body.title,
            date: new Date().toString(),
            votes: [],
            choices: req.body.choices.split('\n')
        });
        poll.save(function(err, result){
            if (err) throw err;
            console.log("hi");
            res.redirect('/poll/' + poll._id);
        });
        console.log("doneish");
    };
    
    this.deletePoll = function(req, res){
        
    };
    
    this.setVote = function(req, res){
        var voter = req.user? req.user.github.id: req.headers['x-forwarded-for']
            || req.connection.remoteAddress 
            || req.socket.remoteAddress 
            || req.connection.socket.remoteAddress 
            || req.ip;
        Polls.findOne({'_id': req.params.id})
            .exec(function(err, poll){
                if (err) throw err;
                for (var i in poll.votes){
                    if (poll.votes[i].voter === voter){
                        poll.votes = poll.votes.splice(i, 1);
                        break;
                    }
                }
                poll.votes.push({
                    voter: voter,
                    vote: req.body.choice
                });
                if (poll.choices.indexOf(req.body.choice) === -1 && req.user){
                    poll.choices.push(req.body.choice);
                }
                poll.save.then(function(err, result){
                    if (err) throw err;
                    res.redirect(req.url);
                });
            });
        
    };
    
    this.viewPoll = function(req, res){
        
    };
    
}

module.exports = PollManager;