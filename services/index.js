var schedule = require("node-schedule");
console.log('Task monitor starting...');
//定时扫描邮件表并发送邮件---
;(function() {
	var mailService = require('./mail');
	// 每小时的1分30秒触发 ：'30 1 * * * *'
	schedule.scheduleJob('30 1 * * * *', function() {
		// console.log('邮件任务启动');
		mailService();
	});
})();

//定时清除截图工具的图片---
;(function() {
	var captureClear = require('./captureClear');
	// 每天的凌晨1点1分30秒触发
	schedule.scheduleJob('30 1 1 * * *', function() {
		captureClear();
	});
})();

//每天抓取News并存储在服务器上---
;(function() {
	var spiders = require('./spiders');
	// 每天的凌晨1点1分30秒触发
	schedule.scheduleJob('30 1 1 * * *', function() {
		spiders();
	});
})();

console.log('Task monitor started');