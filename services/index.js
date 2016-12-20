var schedule = require("node-schedule");
console.log('开始定时任务...');
//定时扫描邮件表并发送邮件---
;(function() {
	var mailService = require('./mail');
	var rule = new schedule.RecurrenceRule();
	rule.minute = 0;
	schedule.scheduleJob(rule, function() {
		mailService();
	});
})

//定时清除截图工具的图片---
;(function() {
	var captureClear = require('./captureClear');
	var rule = new schedule.RecurrenceRule();
	rule.hour = 0;
	rule.minute = 0;
	schedule.scheduleJob(rule, function() {
		captureClear();
	});
})


console.log('定时任务服务开启');