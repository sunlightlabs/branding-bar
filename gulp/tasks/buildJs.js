var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    paths = require('../config').paths,
    streamify = require('gulp-streamify'),
    srcreplace = require('gulp-replace'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip'),
    version = require('../../package.json').version;

gulp.task('buildJs', function () {
  return browserify('./src/js/brandingbar.js').bundle()
    .pipe(source('brandingbar.js'))
    .pipe(streamify(srcreplace(/\{\{ ?version ?\}\}/, version)))
      .pipe(gulp.dest('./dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(streamify(uglify()))
      .pipe(gulp.dest('./dist/js'))
    .pipe(streamify(gzip()))
      .pipe(gulp.dest('./dist/js'));
});
