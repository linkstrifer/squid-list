var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var gulp = require('gulp');

gulp.task('sass', function() {
	return gulp.src('styles/scss/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('styles/css'))
		.pipe(browserSync.stream());
});
