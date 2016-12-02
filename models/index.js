var mongoose = require('mongoose');
const config  = require('../config');
if(!config || !config.db || !config.db.host || !config.db.port) {
	console.error('配置文件错误，未找到数据库位置');
	throw new Error('配置文件错误，未找到数据库位置');
}
var connectionString = 'mongodb://' + config.db.user + ':' + config.db.pwd + '@' + config.db.host + ':' + config.db.port + '/' + config.db.db;
console.log('mongo connectionString:' + connectionString);
var db = mongoose.createConnection(connectionString);

exports.User = db.model('User', require('./user'));
exports.Lucky = db.model('Lucky', require('./lucky'));