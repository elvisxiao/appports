var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var User = require('./user');

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	user: {type: ObjectId, ref: 'User', required: true },
	resume: {type: ObjectId, ref: 'Resume', required: true},
	jobTitle: { type: String, required: true, maxlength: 200 },
	created_at: { type: Date, default: Date.now }
});

Schema.method({
});

module.exports = mongoose.model('Record', Schema);