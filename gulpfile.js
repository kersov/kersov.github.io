'use strict'
var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var compass = require('gulp-compass');
var pack = require('./package');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');

/* BAKE ***********************************************************************/
gulp.task('bake', function() {
  gulp.src([pack.config.bake.inputFiles])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(pack.paths.base));
});

gulp.task('bake-watch', function () {
  return watch(pack.paths.sass.input, { ignoreInitial: false }, function () {
    gulp.start('bake');
  });
});
/******************************************************************************/

/* SASS ***********************************************************************/
gulp.task('compass', function () {
  return gulp
    .src(pack.config.sass.inputFiles)
    .pipe(compass({
      sass: pack.paths.sass.input,
      css: pack.paths.sass.temp,
      logging  : false,
      comments : false,
      style    : 'expanded'
    }))
});

gulp.task('sass', ['compass'], function () {
  return gulp
    .src(pack.config.sass.tempFiles)
    .pipe(autoprefixer())
    .pipe(gulp.dest(pack.paths.sass.output));
});

gulp.task('sass-watch', function () {
  return watch(pack.paths.sass.input, { ignoreInitial: false }, function () {
    runSequence('sass', 'bake');
  });
});
/******************************************************************************/

gulp.task('watch', ['sass-watch', 'bake-watch']);

gulp.task('build', function () {
  runSequence('sass', 'bake');
});

gulp.task('default', ['watch']);
