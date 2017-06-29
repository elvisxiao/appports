var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	creator: String,
	link: String,
	title: String,
	brief: String,
	tags: { type: Array },
	content: String,
	created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', Schema);