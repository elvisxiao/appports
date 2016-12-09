// create reusable transporter object using the default SMTP transport
var config = require('../config');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(config.smtp);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'APPPORTS <xiaoqiong272@qq.com>', // sender address
    to: 'xiaoqiong272@qq.com', // list of receivers
    subject: 'Appports support from ', // Subject line
    text: 'Test for nothing', // plaintext body
    html: '<p>Hello world ?<a href="mailto:ivesxiao@gmail.com">ivesxiao@gmail.com</a></p>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(err, info){
    if(err) {
    	console.error('邮件发送服务，发送邮件失败：', err);
    }
    console.log('邮件发送成功');
});