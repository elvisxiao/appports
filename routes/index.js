var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index');
});

router.get('/logout', function(req, res, next) {
	req.session.destroy();
  	res.redirect('/');
});

router.get('/about', function(req, res, next) {
  	res.render('about');
});

router.get('/contact', function(req, res, next) {
  	res.render('contact');
});

router.get('/lucky/turntable', function(req, res, next) {
  	res.render('lucky/turntable');
});

router.get('/lucky/slotmachine', function(req, res, next) {
  	res.render('lucky/slotmachine');
});

router.get('/spider', function(req, res, next) {
	require('../services/spiders')();
	res.send('ok');
})


router.get('/dingding', function(req, res, next) {
	res.render('/dingding');
})


module.exports = router;
