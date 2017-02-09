'use strict'

var fileinclude = require('gulp-file-include'),
    gulp = require('gulp');

gulp.task('bake', function() {
  gulp.src(['./views/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});
