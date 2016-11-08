var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  	res.render('ui/index');
});

// css相关 ---------------------------------------
var cssRoutes = ['normalize', 'base', 'animation', 'icon'];

// js相关 ---------------------------------------
var jsRoutes = ['ajax', 'algorithm', 'date', 'localStorage', 'security', 'dojo', 'number', 'csv', 'location'];

//组件相关 ---
var componentRoutes = ['buSelect', 'dialog', 'dropdown', 'fileView', 'imageCrop', 'select', 'table', 'slide', 'autoComplete', 'form', 'tree', 'treeSelect', 'other', 'uploader'];

cssRoutes.concat(jsRoutes).concat(componentRoutes).map(function(one) {
	router.get('/' + one, function(req, res, next) {
		res.render('ui/' + one);
	});
});

module.exports = router;
