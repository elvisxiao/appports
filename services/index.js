var schedule = require("node-schedule");
console.log('开始定时任务...');
//定时扫描邮件表并发送邮件---
;(function() {
	var mailService = require('./mail');
	var rule = new schedule.RecurrenceRule();
	rule.minute = 0;
	schedule.scheduleJob(rule, function() {
		// console.log('邮件任务启动');
		mailService();
	});
})();

//定时清除截图工具的图片---
;(function() {
	var captureClear = require('./captureClear');
	var rule = new schedule.RecurrenceRule();
	rule.hour = 0;
	rule.minute = 0;
	schedule.scheduleJob(rule, function() {
		captureClear();
	});
})();

//每天抓取News并存储在服务器上---
;(function() {
	var spiders = require('./spiders');
	var rule = new schedule.RecurrenceRule();
	rule.hour = 0;
	rule.minute = 0;
	rule.second = 0;
	schedule.scheduleJob(rule, function() {
		spiders();
	});
})();

console.log('定时任务服务开启');