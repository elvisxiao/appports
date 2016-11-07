var express = require('express');
var router = express.Router();

router.get('/turntable', function(req, res, next) {
  	res.render('lucky/turntable');
});

router.get('/slotmachine', function(req, res, next) {
  	res.render('lucky/slotmachine');
});



module.exports = router;
