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

router.get('/turntable', function(req, res, next) {
  	res.render('turntable');
});

router.get('/slotmachine', function(req, res, next) {
  	res.render('slotmachine');
});

router.get('/welfare', function(req, res, next) {
  	res.render('welfare');
});

router.get('/life', function(req, res, next) {
  	res.render('life', { title: 'Express' });
});


router.get('/lucky/turntable', function(req, res, next) {
  	res.render('lucky/turntable');
});

router.get('/lucky/slotmachine', function(req, res, next) {
  	res.render('lucky/slotmachine');
});


module.exports = router;
