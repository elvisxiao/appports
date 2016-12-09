var express = require('express');
var router = express.Router();

var Mail  = require('../models/').Mail;

//存储反馈信息---
router.post('/mail', function(req, res, next) {
    var email = req.body.email;
    var name = req.body.name;
    var content = req.body.content;
    
    console.info('反馈：邮箱:' + email + ', name:' + name + ', date:' + new Date().toISOString());
   
    var mail = new Mail({ email: email, name: name, content: content });
    mail.save((err, doc) => {
        if(err) {
            console.error('存储反馈失败：' + JSON.stringify(mail) + ', err:', err);
            return res.status(500).send('数据错误' + err.toString());
        }
        res.status(200).send('');
    });
});

module.exports = router;
