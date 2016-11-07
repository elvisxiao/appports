var express = require('express');
var router = express.Router();

var User  = require('../models/').User;
const config  = require('../config');
var adminCardId = config.admins || [];

//登陆---
router.post('/login', function(req, res, next) {
    var cardId = req.body.cardId;
    var password = req.body.password;
    if(req.session.user) {
        return res.status(200).send('已登录');
    }
    console.info('登陆：cardId:' + cardId + ', ip:' + req.ip + ', date:' + new Date().toISOString());
    User.findOne({ cardId: cardId }, function(err, doc) {
        if(err) {
            console.error('登陆失败，err:', err);
            return res.status(500).send('数据错误');
        }
        if(!doc) {
            console.warn('登陆失败，身份证：' + cardId + ' 未注册');
            return res.status(500).send('该身份证尚未注册');
        }
        if(doc.password !== password) {
            console.warn('登陆失败，身份证：' + cardId + ' 密码不正确');
            return res.status(500).send('密码不正确');
        }

        doc = {
            cardId: doc.cardId,
            _id: doc._id,
        }
        console.info('登陆成功，身份证：' + cardId);
        if(adminCardId.indexOf(cardId) !== -1) {
            console.info('管理员账号登陆成功');
            doc.admin = true;
        }
        req.session.user = doc;
        res.redirect('/');
    });
});

router.post('/', function(req, res, next) {
    var cardId = req.body.cardId;
    var password = req.body.password;
    console.info('注册：cardId:' + cardId + ', ip:' + req.ip + ', date:' + new Date().toISOString());
    User.findOne({ cardId: cardId }, function(err, doc) {
        if(err) {
            console.error('查询用户失败，err:', err);
            return res.status(500).send('数据库错误，请稍后再试');
        }
        if(doc) {
            console.warn('注册失败，身份证:' + cardId + ' 已存在');
            return res.status(500).send('该身份证已经存在，请直接登录，如不是您的账号，请联系海翼招聘人员处理');
        }
        var user = new User({ cardId: cardId, password: password });
        user.save((err, doc) => {
            if(err) {
                console.error('注册失败：' + JSON.stringify(user) + ', err:', err);
                return res.status(500).send('数据错误，请检查身份证是否输入正确');
            }
            doc = {
                cardId: doc.cardId,
                _id: doc._id,
            }
            console.info('注册成功, cardId:' + cardId);
            if(adminCardId.indexOf(cardId) !== -1) {
                doc.admin = true;
            }
            req.session.user = doc;
            res.redirect('/');
        });
    });

    
});

module.exports = router;
