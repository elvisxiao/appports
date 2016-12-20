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

//将网页转为图片的工具
router.get('/downloadImage', function(req, res, next) {
    var url = req.query.url;
    var width = req.query.width || 1280;
    var height = req.query.height || 1080;
    if(!url) {
        return res.send(500, 'Url is required');
    }
    console.log('download service: url:' + url + ', width:' + width + ', height:' + height);
    
    var exec = require('child_process').exec; 
    var cmdStr = 'bin/phantomjs bin/capture.js ' + url + ' ' + width + ' ' + height;
    exec(cmdStr, function(err, stdout, stderr) {
        if(err) { 
            console.log('执行命令错误:', err, stderr);
            return res.send(500, '服务器错误:' + err.toString());
        }
        else {
            var index = stdout.indexOf('IMAGEDATA');
            if(index === -1) {
                return res.send(500, '获取图片失败')
            }
            var imageData = stdout.slice(stdout.indexOf('IMAGEDATA') + 9);
            res.send(imageData);
        }
    });
})

module.exports = router;
