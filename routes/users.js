var express = require('express');
var router = express.Router();

var User  = require('../models/').User;

//登陆---
router.post('/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if(req.session.user) {
        return res.status(200).send('已登录');
    }
    console.info('登陆：email:' + email + ', ip:' + req.ip + ', date:' + new Date().toISOString());
    User.findOne({ email: email }, function(err, doc) {
        if(err) {
            console.error('登陆失败，err:', err);
            return res.status(500).send('数据错误');
        }
        if(!doc) {
            console.warn('登陆失败，该邮箱：' + email + ' 尚未注册');
            return res.status(500).send('该邮箱尚未注册');
        }
        if(doc.password !== password) {
            console.warn('登陆失败，邮箱：' + email + ' 密码不正确');
            return res.status(500).send('密码不正确');
        }

        doc = {
            email: doc.email,
            _id: doc._id,
        }
        console.info('登陆成功，邮箱：' + email);
        
        req.session.user = doc;
        res.redirect('/');
    });
});

router.post('/', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    console.info('注册：邮箱:' + email + ', ip:' + req.ip + ', date:' + new Date().toISOString());
    User.findOne({ email: email }, function(err, doc) {
        if(err) {
            console.error('查询用户失败，err:', err);
            return res.status(500).send('数据库错误，请稍后再试');
        }
        if(doc) {
            console.warn('注册失败，邮箱:' + email + ' 已存在');
            return res.status(500).send('该邮箱已经存在，请直接登录，如不是您的账号，请联系发邮件到ivesxiao@msn.com申诉');
        }
        var user = new User({ email: email, password: password });
        user.save((err, doc) => {
            if(err) {
                console.error('注册失败：' + JSON.stringify(user) + ', err:', err);
                return res.status(500).send('数据错误，请检查邮箱是否输入正确');
            }
            doc = {
                email: doc.email,
                _id: doc._id,
            }
            console.info('注册成功, 邮箱:' + email);
            
            req.session.user = doc;
            res.redirect('/');
        });
    });

    
});

module.exports = router;
