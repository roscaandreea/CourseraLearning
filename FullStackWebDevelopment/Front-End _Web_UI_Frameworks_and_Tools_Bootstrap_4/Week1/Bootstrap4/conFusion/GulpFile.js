'use strict';
var gulp = require('gulp'),
	sass =  require('gulp-sass'),
	browserSync = require ('browser-sync'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	cleanCss = require('gulp-clean-css'),
	flatmap = require('gulp-flatmap'),
	htmlmin = require('gulp-htmlmin');

gulp.task('sass',function(){
	return gulp.src('./css/*.scss')
	.pipe(sass().on('error',sass.logError))
	.pipe(gulp.dest('./css'));
});

gulp.task('sass:watch',function(){
	gulp.watch('./css/*.scss',gulp.series('sass'));
});

gulp.task('browser-sync',function(){
	var files = [
		'./*.html',
		'./css/*.css',
		'./js/*.js',
		'./img/*.{png,jpg,gig}'
	];
	browserSync.init(files,{
		server: {
			baseDir: './'
		}
	});
});

gulp.task('default',
	gulp.series(gulp.parallel('sass:watch','browser-sync'),function(done){
		done();
}));

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

//Copy Fonts awesome
gulp.task('copyfonts', function() {
   return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

// Minifying Images
gulp.task('imagemin', function() {
  return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin',function(){
	return gulp.src('./*.html')
	.pipe(flatmap(function(stream,file){
		return stream
		.pipe(usemin({
			css: [rev()],
			html: [function(){
				return htmlmin({colapseWhitespace: true })}],
			js: [uglify(),rev()],
			inlinejs: [uglify()],
			inlinecss : [cleanCss(),'concat']
		}))
	}))
	.pipe(gulp.dest('dist/'));
});

gulp.task('build',
	gulp.series(gulp.parallel('clean','copyfonts','imagemin','usemin'),function(done){
		done();
}));


