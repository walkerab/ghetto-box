var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('stylus', function() {
	gulp.src('./src/styl/ghetto-box.styl')
		.pipe(stylus({errors: true}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default',['stylus']);