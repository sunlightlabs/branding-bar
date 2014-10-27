var gulp = require('gulp'),
    paths = require('../config').paths,
    version = require('../../package.json').version,
    imagemin = require('gulp-imagemin');

gulp.task('buildImg', function () {
  return gulp.src(paths.img)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('./dist/img'));
});
