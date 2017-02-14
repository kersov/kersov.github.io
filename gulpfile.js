'use strict'
var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var compass = require('gulp-compass');
var sassdoc = require('sassdoc');
var config = require('./package');
var watch = require('gulp-watch');

/* BAKE ***********************************************************************/
gulp.task('bake', function() {
  gulp.src([config.settings.bake.inputFiles])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.paths.base));
});

gulp.task('bake-watch', function () {
  return watch(config.paths.sass.input, { ignoreInitial: false }, function () {
    gulp.start('bake');
  });
});
/******************************************************************************/

/* SASSDOC ********************************************************************/
gulp.task('sassdoc', function () {
  return gulp
    .src(config.paths.sass.input)
    .pipe(sassdoc(config.settings.sassdoc))
    .resume();
});
/******************************************************************************/

/* SASS ***********************************************************************/
gulp.task('compass', function () {
  return gulp
    .src(config.settings.sass.inputFiles)
    .pipe(compass({
      sass: config.paths.sass.input,
      css: config.paths.sass.temp,
      logging  : false,
      comments : false,
      style    : 'expanded'
    }))
});

gulp.task('sass', ['compass'], function () {
  return gulp
    .src(config.settings.sass.tempFiles)
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.paths.sass.output));
});

gulp.task('sass-watch', function () {
  return watch(config.paths.sass.input, { ignoreInitial: false }, function () {
    gulp.start('sass');
  });
});
/******************************************************************************/

gulp.task('watch', ['sass-watch', 'bake-watch']);

gulp.task('build', ['sass', 'bake']);

gulp.task('default', ['watch']);
