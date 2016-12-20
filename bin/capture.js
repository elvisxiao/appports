var page = require('webpage').create();
var system = require('system');

if (system.args.length !== 4) { 
	console.log(system.args);
	phantom.exit();
}

page.viewportSize = { 
	width:  system.args[2], 
	height:  system.args[3] 
};
page.open(system.args[1], function(status) {
	if (status === "success") {
		var path = '/phantomjs/' + new Date().getTime() + '.jpg';
		page.render('./public' + path);
		console.log('IMAGEDATA' + path);
	}
	phantom.exit();
});