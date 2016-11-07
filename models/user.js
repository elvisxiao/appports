var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	cardId: { type: String, unique: true, required: true , match: [/^\d{6}(18|19|20)?\d{6}\d{3}(\d|X)?$/i, '身份证号码格式错误.'] },
	password: { type: String, required: true, match: [/^\S{8,30}$/, '密码长度限制为8 - 30位.'] },
	isVerify: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now }
});

Schema.method({
});

module.exports = mongoose.model('User', Schema);