var gulp = require('gulp'),
    paths = require('../config').paths,
    version = require('../../package.json').version,
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip');

gulp.task('buildCss', function () {
  return gulp.src(paths.css)
    .pipe(sass())
    .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
      .pipe(gulp.dest('./dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sass({outputStyle: 'compressed'}))
      .pipe(gulp.dest('./dist/css'))
    .pipe(gzip())
      .pipe(gulp.dest('./dist/css'));
});
