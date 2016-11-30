var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	email: { type: String, unique: true, required: true , match: [/^.*@.*$/i, '邮箱格式错误.'] },
	password: { type: String, required: true, match: [/^\S{8,30}$/, '密码长度限制为8 - 30位.'] },
	isVerify: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now }
});

Schema.method({
});

module.exports = mongoose.model('User', Schema);