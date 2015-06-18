var gulp = require('gulp'),
    paths = require('../config').paths,
    version = require('../../package.json').version;

gulp.task('buildDonation', function () {
  return gulp.src(paths.donation)
    .pipe(gulp.dest('./dist/donation'));
});
