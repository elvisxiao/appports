var filePrefix = ['.js', '.css', '.'];

var fs = require('fs');

(function(path) {
	var callee = arguments.callee;
	fs.readdir(path, function(err, files) {
		for(var i in files) {
			var file = files[i];
			var index = file.lastIndexOf('.');
			var prefix = file.slice(index);
			if(!file || file.indexOf('.') === 0) {
				continue;
			}
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath);
			if(stat.isDirectory()) {
				callee.call(this, newPath);
			}
			else if(filePrefix.indexOf(prefix) !== -1){
				console.log(newPath + ': ' + stat.mtime);
			}
		}
	});
})(__dirname);