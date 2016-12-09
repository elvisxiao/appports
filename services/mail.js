var nodemailer = require('nodemailer');
var Mail = require('../models').Mail;
var transporter = nodemailer.createTransport('smtps://xiaoqiong272@qq.com:cpwdpbhjypmibbjd@smtp.qq.com');

module.exports = function() {
	var self = this;

	self.sendMail = function(mail, cb) {
		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: '<xiaoqiong272@qq.com>', // sender address
		    to: 'xiaoqiong272@qq.com', // list of receivers
		    subject: 'Appports support - ' + mail.name, // Subject line
		    // text: mail.content, // plaintext body
		    html: '<p>From: ' + mail.name + ': <a href="mailto:' + mail.email + '">' + mail.email + '</a></p><div>' + mail.content + '</div>' // html body
		};
		console.log('开始发送邮件：', mailOptions);
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(err, info){
		    if(err) {
		    	console.error('邮件发送服务，发送邮件失败：', mail, err);
		    	return cb(false);
		    }
		    console.log('邮件发送成功');
		    
		    //回写到数据库中，只尝试写两次数据---
		    Mail.update({ _id: mail._id }, {$set: {is_send: true, send_at: new Date()}}, function(err, doc) {
		    	if(err) {
		    		console.error('邮件已发送，第一次回写数据失败，尝试第二次，id:' + mail._id);
		    		Mail.update({ _id: mail._id }, {$set: {is_send: true, send_at: new Date()}}, function(err, doc) {
		    			if(err) {
		    				console.error('邮件已发送，回写数据失败，id:' + mail._id);
		    				return cb(false);
		    			}
		    			else {
		    				cb(true);
		    			}
		    		})
		    	}
		    	else {
		    		cb(true);
		    	}
		    });
		});
	}

	console.log('邮件任务启动:' + new Date().toString());
	Mail.find({ is_send: false }, function(err, docs) {
		if(err) {
			console.error('查询邮件失败：', err);
			return;
		}
		console.log('查询到未发送邮件数量：' + docs.length);

		var i = 0;
		var len = docs.length;

		var sendOne = function() {
			if(i >= len) {
				return;
			}

			self.sendMail(docs[i], function() {
				i ++;
				sendOne();
			})
		}
		sendOne();
	});
}