var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('connect', connect.server({
  root: ['example'],
  port: 4000
}));
