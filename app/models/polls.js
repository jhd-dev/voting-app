'use strict';

var mongoose = require("mongoose");

var Poll = new mongoose.Schema({
    author: String,
    title: String,
    date: String,
    votes: [{
        voter: String,
        vote: String
    }],
    choices: [String]
});

module.exports = mongoose.model('Poll', Poll);