'use strict';

var Polls = require("../models/polls.js");
var Users = require("../models/users.js");

function PollManager() {
    
    this.getPolls = function(req, res){
        console.log("get polls!");
        Polls.find({})
            .exec(function(err, polls){
                if (err) throw err;
                res.json({
                    polls: polls
                });
            });
    };
    
    this.getUserPolls = function(req, res){
        Polls.find({
            "author.id": req.params.id
        })
            .exec(function(err, polls){
                if (err) throw err;
                Users.findOne({
                    "github.id": req.params.id
                })
                    .exec(function(err, user){
                        if (err) throw err;
                        res.json({
                            polls: polls,
                            user: user
                        }); 
                    });
            });
    };
    
    this.getPoll = function(req, res){
        Polls.findOne({
            "_id": req.params.id
        })
            .exec(function(err, poll){
                if (err) throw err;
                res.json(poll);
            });
    };
    
    this.createPoll = function(req, res){
        var poll = new Polls({
            author: req.user.github,
            title: req.body.title,
            date: new Date().toString(),
            choices: req.body.choices.replace('\r', '').split('\n').map(function(choice){
                return {
                    choice: choice,
                    votes: []
                };
            })
        });
        console.log(poll.choices);
        
        poll.save(function(err, result){
            if (err) throw err;
            //console.log("hi");
            res.redirect('/poll/' + poll._id);
        });
        //console.log("doneish");
    };
    
    this.deletePoll = function(req, res){
        Polls.findOne({
            _id: req.params.id
        })
            .exec(function(err, poll){
                if (err) throw err;
                
                if (req.user.github.id === poll.author.github.id){
                    poll.remove();
                    res.redirect('/');
                }
            });
    };
    
    this.setVote = function(req, res){
        console.log('-----------');
        var chosen = req.body.choice.replace('\n', '');console.log(chosen);
        var voter = String(req.user ? req.user.github.id : req.headers['x-forwarded-for']
            || req.connection.remoteAddress 
            || req.socket.remoteAddress 
            || req.connection.socket.remoteAddress 
            || req.ip);
        
        Polls.findOne({'_id': req.params.id})
            .exec(function(err, poll){
                if (err) throw err;
                //console.log("poll found: \n");
                for (var i in poll.choices){
                    for (var j in poll.choices[i].votes){
                        if (poll.choices[i].votes[j] == voter){
                            poll.choices[i].votes.splice(j, 1);
                            console.log(poll.choices[i].votes);
                        }
                    }
                }
                if (chosen === 'other' && req.user){
                    if (poll.choices.every(function(choice){
                        return choice !== req.body.otherText;
                    })){
                        poll.choices.push({
                            choice: req.body.otherText,
                            votes: [voter]
                        });
                    }
                } else {
                    poll.choices.filter(function(choice){
                        return choice.choice === chosen;
                    })[0].votes.push(voter);
                }
                poll.markModified('choices');
                poll.save(function(err, result){
                    if (err) throw err;
                    res.redirect(req.url);
                });
            });
        
    };
    
}

module.exports = PollManager;