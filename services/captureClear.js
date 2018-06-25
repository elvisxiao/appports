var fs = require('fs');
var baseDir = path.join(__dirname, 'public', 'phantomjs');

module.exports = function() {
	var self = this;
	console.log('Clear phantomjs folder:' + new Date().toISOString());
	
	var files = fs.readdirSync(baseDir);
	files.forEach(function(file){
        var stats = fs.statSync(baseDir + '/' + file);
        if(!stats.isDirectory()) {
            fs.unlinkSync(baseDir + '/' + file);
        }
    })
}