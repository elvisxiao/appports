var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var News = require('../../models/').News;

router.get('/list', function(req, res, next) {
    res.render('news/list');
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    id = mongoose.Types.ObjectId(id);

    console.log('new params id:', id);
    News.findOne({_id: id}, function(err, doc) {
        if(err) {
            console.error('未找到News, id：' + id + ', err:', err);
            return res.render('404');
        }
        res.render('news/detail', {doc, doc});
    });
});

router.post('/list', function(req, res, next) {
    var queryParams = req.body;
    var pageNo = 1;
    var pageSize = 10;
    if(queryParams.pageNo) {
        pageNo = parseInt(queryParams.pageNo || 1) - 1;
        pageSize = parseInt(queryParams.pageSize) || 10;
    }
    var skip = (pageNo - 1) * pageSize;

    News.find({}, {content: 0}).skip(skip).exec( (err, docs)=> {
        if(err) {
            console.error('访问出错，err:' + err.toString());
            return res.status(500).send('数据错误');
        }
        if(!docs) {
            docs = [];
        }
        res.send(docs);
    })
});

module.exports = router;
