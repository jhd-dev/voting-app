'use strict';

var Polls = require("../models/polls.js");

function PollManager() {
    
    this.getPolls = function(req, res){
        console.log("get polls!");
        Polls.find({}, {"_id": false})
            .exec(function(err, polls){
                if (err) throw err;
                //console.log(polls, polls.length);
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
            author: req.user.github.id,
            title: req.body.title,
            date: new Date().toString(),
            choices: req.body.choices.split('\n').map(function(choice){
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
        
    };
    
    this.setVote = function(req, res){
        var chosen = req.body.choice.replace('\n', '');
        var voter = req.user ? req.user.github.id : req.headers['x-forwarded-for']
            || req.connection.remoteAddress 
            || req.socket.remoteAddress 
            || req.connection.socket.remoteAddress 
            || req.ip;
        
        Polls.findOne({'_id': req.params.id})
            .exec(function(err, poll){
                if (err) throw err;
                //console.log("poll found: \n");
                poll.choices.forEach(function(choice, i){
                    for (var j in choice.votes){
                        console.log(choice.votes[j], voter)
                        if (choice.votes[j] == voter){
                            choice.votes = choice.votes.splice(j, 1);
                            return;
                        }
                    }
                });
                //console.log(chosen);
                //console.log(poll.choices);
                if (poll.choices.every(function(choice){
                    return choice.choice !== chosen;
                }) && req.user){
                    poll.choices.push({
                        choice: chosen,
                        votes: [voter]
                    });
                }else{
                    poll.choices.filter(function(choice){
                        console.log(choice.choice, chosen);
                        return choice.choice === chosen;
                    })[0].votes.push(voter);
                }
                poll.save(function(err, result){
                    if (err) throw err;
                    res.redirect(req.url);
                });
            });
        
    };
    
    this.viewPoll = function(req, res){
        
    };
    
}

module.exports = PollManager;