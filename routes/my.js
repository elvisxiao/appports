var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var Resume  = require('../models/').Resume;
var Record  = require('../models/').Record;
var mongoose = require('mongoose');
const config  = require('../config');

var limited = config.limitedRecords || 2;

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.user.admin === true) {
        return res.redirect('/admin/resumes');
    }
    var cardId = req.session.user.cardId;
    Resume.findOne({ cardId: cardId }, function(err, doc) {
        if(err) {
            console.error('访问简历出错，err:', err);
            res.render('my', { user: req.session.user, resume: {} });
        }
        if(!doc) {
            doc = {};
        }

        var nowYear = new Date().getFullYear();
        birthYear = cardId.length === 15? ('19' + cardId.slice(6, 8)) : cardId.slice(6, 10);
        birthYear = parseInt(birthYear);

        if(!doc.age) {
            doc.age = nowYear - birthYear;
        }
        if(!doc.birthDay) {
            var birthDay = cardId.length === 15? ('19' + cardId.slice(6, 12)) : cardId.slice(6, 14);
            doc.birthDay = birthDay.slice(0, 4) + '-' + birthDay.slice(4, 6) + '-' + birthDay.slice(6);
        }
        res.render('my', {user: req.session.user, resume: doc });
    });
});

router.get('/record', function(req, res, next) {
    var userId = req.session.user._id;
    userId = mongoose.Types.ObjectId(userId);
    Record.find({ user: userId }, function(err, docs) {
        if(err) {
            console.error('访问申请记录出错，err:', err);
            res.render('record', { docs: [] });
        }
        if(!docs) {
            res.redirect('/');
        }
        res.render('record', { docs: docs });
    });
});

//更新或者添加简历信息 ----
router.post('/resume', function(req, res, next) {
    var cardId = req.session.user.cardId;

    var form = null;
    
    form = new multiparty.Form({ uploadDir: './public/upload/resume/', maxFilesSize: 10 * 1024 * 1024 });

    Resume.findOne({ cardId: cardId }, function(err, doc) {
        if(err) {
            console.error('访问出错，err:' + err.toString());
            return res.status(500).send('数据错误');
        }
        if(!doc) {
            doc = {};
        }
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2);
            if(err) {
                console.error('处理简历表单错误，parse error: ', err);
                return res.status(500).send('文件上传错误，请检查文件大小是否超出10M，否则请压缩后再试');
            }
            else {
                var model = JSON.parse(fields.model);
                var extend = require('util')._extend;
                if(!model.img.match(/^data:image\/\w+;base64,/)) {
                    delete model.img;
                }
                model = extend(doc, model);

                //处理头像文件 ---
                if(model.img && model.img.match(/^data:image\/\w+;base64,/)) {
                    var base64Data = model.img.replace(/^data:image\/\w+;base64,/, "");
                    var dataBuffer = new Buffer(base64Data, 'base64');
                    fs.writeFileSync("./public/upload/portrait/" + cardId + ".jpg", dataBuffer);
                    model.img = '/upload/portrait/' + cardId + '.jpg';
                }
                
                //处理简历附件-----
                if(files.resumeFile && files.resumeFile.length) {
                    console.info('附件附件:', files.resumeFile[0]);
                    var oldPath = files.resumeFile[0].path;
                    var index = oldPath.lastIndexOf('.');
                    var prix = '';
                    if(index > 0) {
                        prix = oldPath.slice(oldPath.lastIndexOf('.'))
                    }
                    var realPath = './public/upload/resume/' + cardId + prix;
                    fs.renameSync(oldPath, realPath);

                    model.resumeFile = realPath.replace('public', '');
                }

                var instance = new Resume(model);
                instance.save( (err, doc) => {
                    if(err) {
                        console.error('更新简历失败:', doc, err);
                        return res.status(500).send('数据错误');
                    }
                    console.info('更新简历成功', doc);
                    res.send('ok');
                });
            }
        });
    });
});

router.get('/isResumeOk', function(req, res, next) {
    var cardId = req.session.user.cardId;
    var userId = req.session.user._id;
    userId = mongoose.Types.ObjectId(userId);

    Resume.findOne({ cardId: cardId }, function(err, doc) {
        if(err) {
            console.error('访问简历表出错，err:', err);
            return res.status(500).send('服务器错误');
        }
        if(!doc || !doc.name || !doc.email || !doc.tel || !doc.session) {
            return res.status(500).send('尚未填写简历');
        }

        Record.find({user: userId}, function(err, docs) {
            if(err) {
                console.error('访问申请记录表出错，err:' + err.toString());
                return res.status(500).send('服务器错误');
            }
            
            res.status(200).send({ resumeId: doc._id, list: docs.map(one=>one.jobTitle) });
        });
    });
});

router.post('/apply', function(req, res, next) {
    var jobTitle = req.body.job;
    var resumeId = req.body.resumeId;
    var userId = req.session.user._id;
    userId = mongoose.Types.ObjectId(userId);
    resumeId = mongoose.Types.ObjectId(resumeId);
    console.log('申请岗位：' + jobTitle + 'cardId:' + userId + ' cardId:' + req.session.user.cardId + ' resumeId:' + resumeId);
    if(!jobTitle) {
        console.error('异常请求，申请岗位失败，无岗位名称：ip: ' + req.ip + ', user:', req.session.user);
        return res.status(500).send('Error params');
    }
    
    Record.find({user: userId}, function(err, docs) {
        if(err) {
            console.error('申请岗位失败，查询岗位时：', err);
            return res.status(500).send('服务器错误，请稍后再试');
        }
        if(docs.length >= limited) {
            console.warn('投递简历失败，已经超出最大投递限制：' + limited);
            return res.status(500).send('每个人最多只能申请两个职位');
        }
        var isTheSame = docs.some(function(doc) {
            return doc.jobTitle === jobTitle;
        });
        if(isTheSame) {
            console.warn('投递简历失败，重复投递相同岗位：' + jobTitle);
            return res.status(500).send('你已经申请过该岗位，请不要重复申请');
        }
        var instance = new Record({ user: userId, jobTitle: jobTitle, resume: resumeId });
        instance.save(function(err, doc) {
            if(err) {
                console.error('申请岗位失败，保存数据时：', err);
                return res.status(500).send('服务器错误，请稍后再试');
            }
            res.status(200).send('ok');
        });
    });
});


module.exports = router;
