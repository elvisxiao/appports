var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

const Schema = new mongoose.Schema({
	id: { type: ObjectId },
	cardId: { type: String, unique: true, required: true , match: [/^\d{6}(18|19|20)?\d{6}\d{3}(\d|X)?$/i, '身份证号码格式错误.'] },
	name: { type: String, required: true, maxlength: 50 },
	email: { type: String, required: true, maxlength: 50 },
	tel: { type: String, required: true, maxlength: 20 },
	sex: { type: String, required: true, maxlength: 5 },
	session: { type: String, required: true, maxlength: 20 },
	img: String,
	nativePlace: { type: String, maxlength: 50 },
	national: { type: String, maxlength: 50 },
	height: { type: String, maxlength: 50 },
	weight: { type: String, maxlength: 50 },
	birthDay: { type: String, required: true, maxlength: 20 },
	age: {type: String, maxlength: 20 },
	address: { type: String, maxlength: 500 },
	intentionCity: { type: String, maxlength: 20 },
	education: { type: String, maxlength: 50 },
	emergencyContactName: { type: String, required: true, maxlength: 50},
	emergencyContactRelation: { type: String, required: true, maxlength: 50 },
	emergencyContactTel: { type: String, required: true, maxlength: 50 },
	lauguage: { type: String, maxlength: 5000 },
	hobby: { type: String, maxlength: 5000 },
	selfEvaluation: { type: String, required: true, maxlength: 10000 },
	resumeFile: String,

	educationBackground: [{
		from: { type: String, maxlength: 20},
		to: { type: String, maxlength: 20 },
		education: { type: String, maxlength: 100 },
		school: { type: String, maxlength: 100 },
		major: { type: String, maxlength: 100 },
		rank: { type: String, maxlength: 1000 }
	}],

	practiveInSchool: [{
		from: { type: String, maxlength: 20 },
		to: { type: String, maxlength: 20 },
		descrption: { type: String, maxlength: 20000 }	
	}],
	
	intership: [{
		from: { type: String, maxlength: 20 },
		to: { type: String, maxlength: 20 },
		company: { type: String, maxlength: 100 },
		job: {type: String, maxlength: 200 },
		descrption: { type: String, maxlength: 20000 }
	}],

	performanceInSchool: {
		honour: { type: String, required: true, maxlength: 20000 },
		research: { type: String, maxlength: 20000 }
	},

	family: [{
		name: { type: String, maxlength: 50 },
		appellation: { type: String, maxlength: 50 },
		company: { type: String, maxlength: 200 },
		tel: { type: String, maxlength: 50 }
	}],
	updateAt: { type: Date, default: Date.now }
});

Schema.method({
});

module.exports = mongoose.model('Resume', Schema);