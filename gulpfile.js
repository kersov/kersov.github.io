'use strict';
var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var compass = require('gulp-compass');
var pack = require('./package');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var svg2png = require('gulp-svg2png');

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
  return watch(pack.config.bake.inputFiles, { ignoreInitial: true }, function () {
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
    .pipe(cleanCSS(pack.config.cleanCSS))
    .pipe(gulp.dest(pack.paths.sass.output));
});

gulp.task('sass-watch', function () {
  return watch(pack.paths.sass.input, { ignoreInitial: true }, function () {
    runSequence('sass', 'bake');
  });
});
/******************************************************************************/

/* JS *************************************************************************/
gulp.task('uglify-js', function (cb) {
  return gulp
    .src(pack.config.js.inputFiles)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(pack.paths.js.output));

});

gulp.task('js-watch', function () {
  return watch(pack.config.js.inputFiles, { ignoreInitial: true }, function () {
    runSequence('uglify-js', 'bake');
  });
});
/******************************************************************************/

/* IMAGES *********************************************************************/
gulp.task('icons2png', function () {
    return gulp.src(pack.config.icons.inputFiles)
      .pipe(svg2png(pack.config.icons.options))
      .pipe(gulp.dest(pack.paths.icons.output));
});
/******************************************************************************/

/* GENERAL ********************************************************************/

gulp.task('watch', ['sass-watch', 'bake-watch', 'js-watch']);

gulp.task('build', function () {
  runSequence('sass', 'uglify-js', 'bake');
});

gulp.task('default', function () {
  runSequence('build', 'watch');
});
/******************************************************************************/
