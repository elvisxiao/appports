var express = require('express');
var router = express.Router();
var Resume  = require('../models/').Resume;
var Record  = require('../models/').Record;
var mongoose = require('mongoose');
var User  = require('../models/').User;

router.get('/users', function(req, res, next) {
    res.render('admin/users');
})

router.get('/resumes', function(req, res, next) {
    res.render('admin/resumes');
})

router.get('/view/:id/:isReume?', function(req, res, next) {
    var recordId = req.params.id;
    if(req.params.isReume) {
        Resume.findOne({_id: recordId}, function(err, resume) {
            if(err) {
                return next(err);
            }
            User.findOne({cardId: resume.cardId}, function(err, user) {
                if(err) {
                    return next(err);
                }
                res.render('admin/view', {user: user, resume: resume });
            })
        })
    }
    else {
        Record.findOne({_id: recordId}).populate({path: 'user', select: {_id:1, cardId:1, created_at:1}}).populate('resume').exec( (err, doc)=> {
            if(err) {
                console.error('admin中访问简历出错，err:', err);
                res.render('admin/view', { user: {}, resume: {} });
            }
            if(!doc) {
                doc = {};
            }
            res.render('admin/view', {user: doc.user, resume: doc.resume });
        });
    }
})

router.post('/users', function(req, res, next) {
    var queryParams = req.body;
    var sort = {sort: {}, skip: 0};
    if(queryParams.orderBy) {
        sort.sort[queryParams.orderBy] = queryParams.desc == "asc"? 1 : -1;
    }
    var pageNo = 1;
    var pageSize = 25;
    if(queryParams.pageNo) {
        pageNo = parseInt(queryParams.pageNo) - 1;
        pageSize = parseInt(queryParams.pageSize);
    }
    delete queryParams.pageNo;
    delete queryParams.pageSize;
    delete queryParams.orderBy;
    delete queryParams.desc;
    if(queryParams.cardId) {
        queryParams.cardId = new RegExp(queryParams.cardId.trim(), 'gi');
    }
    else {
        delete queryParams.cardId;
    }

    var jobTitle = '';
    if(queryParams.jobTitle) {
        jobTitle = queryParams.jobTitle.trim().toUpperCase();
    }
    delete queryParams.jobTitle;
    console.log('user query:', queryParams);
    console.log('sort:', sort);
    User.find(queryParams, {_id: 1, cardId: 1, created_at: 1}, sort, (err, docs)=> {
        if(err) {
            res.status(err).send('数据库查询错误');
        }
        else {
            var cardIds = [];
            var userIds = [];
            docs.map(function(one) {
                cardIds.push(one.cardId);
                userIds.push(one._id);
            });

            Resume.find({ cardId: {$in: cardIds} }, {cardId: 1, _id: 1, name: 1, tel: 1, id: 1}, function(err, resumes) {
                if(err) {
                    console.error('查询用户时，简历查询出错')
                    res.status(500).send('查询简历出错');
                    return;
                }

                var resumeMap = {};
                resumes.map(function(one) {
                    resumeMap[one.cardId] = one;
                    one.cardId = one.cardId.slice(0, 4) + '****' + one.cardId.slice(-4);
                });

                Record.find({ user: {$in: userIds} }, {jobTitle: 1, _id: 1, created_at: 1, user: 1}, function(err, records) {
                    if(err) {
                        res.status(500).send('查询用户时，投递记录查询出错');
                        return;
                    }
                    // console.log('records:', records);
                    var recordMap = {};
                    records.map(function(one) {
                        if(recordMap[one.user]) {
                            recordMap[one.user].push(one);
                        }
                        else {
                            recordMap[one.user] = [one];
                        }
                    });

                    var users = docs.map(function(one) {
                        return {
                            id: one._id,
                            // cardId: one.cardId.slice(0, 4) + '****' + one.cardId.slice(-4),
                            cardId: one.cardId,
                            created_at: one.created_at,
                            resume: resumeMap[one.cardId] || {},
                            records: recordMap[one._id] || []
                        };
                    });
                    console.log('没查询jobTitle之前用户数：', users.length);
                    if(jobTitle) {
                        users = users.filter(function(one) {
                            if(jobTitle.indexOf('未投递') !== -1) {
                                return one.records.length === 0;
                            }
                            return one.records.filter(function(record) {
                                return record.jobTitle.toUpperCase().indexOf(jobTitle) !== -1;
                            }).length > 0;
                        });
                    }
                    var count = users.length;
                    console.log('查询jobTitle之后用户数：', count);
                    var skip = pageNo * pageSize;
                    users = users.slice(skip, skip + pageSize);

                    res.send({ allsize: count, items: users });
                });

                
            });   
        }
    })
});


router.post('/resumes', function(req, res, next) {
    var queryParams = req.body;
    var orderBy = null;
    var desc = null;
    var pageNo = 1;
    var pageSize = 25;
    if(queryParams.orderBy) {
        orderBy = queryParams.orderBy;
        desc = queryParams.desc == "asc"? true : false;
    }
    if(queryParams.pageNo) {
        pageNo = parseInt(queryParams.pageNo || 1) - 1;
        pageSize = parseInt(queryParams.pageSize) || 25;
    }
    delete queryParams.orderBy;
    delete queryParams.desc;
    delete queryParams.pageNo;
    delete queryParams.pageSize;

    for(var key in queryParams) {
        if(!queryParams[key]) {
            delete queryParams[key];
        }
    }

    var userPopulateOpt = {
        path: 'user',
        select: {_id:1, cardId:1, created_at:1}
    }
    var cardId = null;
    var session = null;
    var name = null;
    if(queryParams.cardId) {
        cardId = queryParams.cardId.trim().toUpperCase();
    }
    if(queryParams.name) {
        name = queryParams.name.trim().toUpperCase();
    }
    if(queryParams.session) {
        session = queryParams.session.trim().toUpperCase();
    }
    delete queryParams.cardId;
    delete queryParams.session;
    delete queryParams.name;
    if(queryParams.createdAtFrom || queryParams.createdAtTo) {
        queryParams.created_at = {
            "$gte": new Date(queryParams.createdAtFrom || '1990-01-01'),
            "$lt": new Date(queryParams.createdAtTo || '2200-01-01')
        }
        delete queryParams.createdAtFrom;
        delete queryParams.createdAtTo;
    }
    console.info('查询投递记录，record queryParams:', queryParams);

    Record.find(queryParams).populate(userPopulateOpt).populate('resume').exec( (err, docs)=> {
        if(err) {
            res.status(err).send('数据库查询错误');
        }
        else {
            if(cardId || session || name) {
                docs = docs.filter(function(one) {
                    if(!one.resume || !one.user) {
                        return false;
                    }

                    return (!session || one.resume.session.toUpperCase().indexOf(session) !== -1) &&
                        (!cardId || one.user.cardId.toUpperCase().indexOf(cardId) !== -1) && 
                        (!name || one.resume.name.toUpperCase().indexOf(name) !== -1);
                });
            }
            var count = docs.length;
            if(orderBy) {
                docs.sort(function(a, b) {
                    var valA = a[orderBy];
                    var valB = b[orderBy];
                    
                    var arr = orderBy.split('.');
                    if(arr.length > 1) {
                        a[arr[0]] && (valA = a[arr[0]][arr[1]]);
                        b[arr[0]] && (valB = b[arr[0]][arr[1]]);
                    }
                    !valA && (valA = '');
                    !valB && (valB = '');
                    return desc? valA.toString().localeCompare(valB) : valB.toString().localeCompare(valA);
                });
            }
            var skip = pageNo * pageSize;
            docs = docs.slice(skip, skip + pageSize);
            // docs = docs.map(function(one) {
            //     var cardId = one.resume.cardId.slice(0, 4) + '****' + one.resume.cardId.slice(-4);
            //     one.resume.cardId = one.user.cardId = cardId;
            //     return one;
            // });
            res.send({ allsize: count, items: docs });
        }
    })
});

module.exports = router;
