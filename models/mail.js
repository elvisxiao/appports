var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	email: { type: String, required: true, match: [/^.*@.*$/i, '邮箱格式错误.'] },
	name: { type: String, required: true, match: [/^\S{2,20}$/, '名称长度限制为2 - 20位.'] },
	content: { type: String, required: true },
	is_send: { type: Boolean, default: false },
	send_at: { type: Date },
	created_at: { type: Date, default: Date.now }
});

Schema.method({
});

module.exports = mongoose.model('Mail', Schema);