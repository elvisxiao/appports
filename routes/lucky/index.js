var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Lucky = require('../../models/').Lucky;

router.get('/list', function(req, res, next) {
    res.render('lucky/list');
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    id = mongoose.Types.ObjectId(id);
    Lucky.findOne({_id: id}, function(err, doc) {
        if(err) {
            console.error('未找到Lucky, id：' + id + ', err:', err);
            return res.render('404');
        }
        if(doc.type === 1) {
            res.render('lucky/turnTable', {doc, doc});
        }
        else if(doc.type === 2) {
            res.render('lucky/slotMachine', {doc, doc});
        }
        else {
            res.render('404');
        }
    });
});

router.post('/list', function(req, res, next) {
    var userId = req.session.user._id;

    Lucky.find({ user: userId }, function(err, doc) {
        if(err) {
            console.error('访问出错，err:' + err.toString());
            return res.status(500).send('数据错误');
        }
        if(!doc) {
            doc = [];
        }
        
        res.send(doc);
    });
});

router.post('/', function(req, res, next) {
    var lucky = new Lucky({
        title: req.body.title,
        config: req.body.config,
        type: req.body.type,
        user: req.body.user,
    });
    var id = req.body._id;
    var userId = req.session.user._id;
    if(id) {
        id = mongoose.Types.ObjectId(id);
        Lucky.find({user: userId}, function(err, docs) {
            if(err || !docs) {
                console.error('未找到Lucky, id：' + id + ', err:', err);
                return res.status('500').send('数据错误');
            }
            var finds = docs.filter(function(one) {
                return one._id = id;
            });

            if(finds.length === 0) {
                console.error('该Lucky不属于此用户，危险，luckyId：' + id + ', 请求更新数据:', lucky);
                return res.status('500').send('数据错误');
            }
            console.log('update lucky: ' + id + 'set config to:', lucky.config);
            Lucky.update({_id: id}, {$set: {config: lucky.config }}, function(err, doc) {
                if(err) {
                    console.error('未找到Lucky, id：' + id + ', err:', err);
                    return res.status('500').send('更新失败，请重试');
                }
                res.status(200).send('');
            });
        });
    }
});

router.put('/', function(req, res, next) {
	var lucky = new Lucky({
		title: req.body.title,
		config: req.body.config,
        type: req.body.type,
		user: req.body.user
	});
	if(!lucky.user) {
		return res.status(500).send('数据错误');
	}

    console.info('保存抽奖信息,' + new Date().toISOString() + ':', lucky);

    Lucky.find({title: lucky.title}, function(err, docs) {
        if(err || !docs) {
            console.error('未找到Lucky, id：' + id + ', err:', err);
            return res.status('500').send('数据错误');
        }
        var finds = docs.filter(function(one) {
            return one._id = id;
        });

        if(finds.length !== 0) {
            console.error('该Lucky不属于此用户，危险，luckyId：' + id + ', 请求更新数据:', lucky);
            return res.status('500').send('已存在名为：' + lucky.title + '的抽奖配置');
        }

        lucky.save((err, doc) => {
            if(err) {
                console.error('保存失败：' + JSON.stringify(lucky) + ', err:', err);
                return res.status(500).send('数据错误，请稍后再试');
            }
            res.status(200).send('');
        });
    });
});


module.exports = router;
