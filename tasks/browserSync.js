var browserSync = require('browser-sync');
var gulp = require('gulp');

gulp.task('browserSync', function() {
	return browserSync.init({
		server: {
			baseDir: './'
		}
	});
});