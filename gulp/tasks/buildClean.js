var gulp = require('gulp'),
    clean = require('gulp-clean');

gulp.task('buildClean', function () {
  return gulp.src('dist')
    .pipe(clean());
});
