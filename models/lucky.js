var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var User = require('./user');

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	user: {type: ObjectId, ref: 'User', required: true },
	type: {type: Number, required: true, min: 0, max: 10 },
	title: {type: String, required: true, maxlength: 200 },
	config: { type: String, required: true },
	update_at: { type: Date, default: Date.now }
});

Schema.method({
});

module.exports = mongoose.model('Lucky', Schema);