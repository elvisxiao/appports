
var watch = require('gulp-watch');
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');

gulp.task('default', [], function() {
	
	gulp.watch(['./public/css/styl/*.styl'], function(e) {
		try {
			gulp.src('./public/css/styl/*.styl')
		        .pipe(stylus())
		        .pipe(gulp.dest('./public/css/styl/css/'));
		}
	    catch(err) {
	    	console.error(err);
	    }
	});

	gulp.watch(['./public/css/styl/**/*.css'], function(e) {
		try {
			gulp.src('./public/css/styl/**/*.css')
		        .pipe(concat('main.css'))
		        .pipe(gulp.dest('./public/css/'));
		}
	    catch(err) {
	    	console.error(err);
	    }
	});
});