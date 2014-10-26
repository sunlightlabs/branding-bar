var gulp = require('gulp'),
    paths = require('../config').paths,
    version = require('../../package.json').version,
    srcreplace = require('gulp-replace'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip');

gulp.task('buildJs', function(){
  return gulp.src(paths.js)
    .pipe(srcreplace(/\{\{ ?version ?\}\}/, version))
      .pipe(gulp.dest('../../dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
      .pipe(gulp.dest('../../dist/js'))
    .pipe(gzip())
      .pipe(gulp.dest('../../dist/js'));
});