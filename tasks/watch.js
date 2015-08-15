var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var gulp = require('gulp');

gulp.task('watch', function() {
	$.watch('styles/scss/*.scss', function(cb) {
		gulp.start('sass');
	});

	$.watch('*.html', function(cb) {
		browserSync.reload();
	});

	$.watch('js/*.js', function(cb) {
		browserSync.reload();
	});
});