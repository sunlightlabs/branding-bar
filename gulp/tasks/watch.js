var gulp = require('gulp'),
    paths = require('../config').paths;

gulp.task('watch', ['connect'], function () {
  gulp.watch(paths.donation, ['buildJs']).on('change', function () {
    gulp.run('buildDonation');
  });
  gulp.watch(paths.js, ['buildJs']).on('change', function () {
    gulp.run('buildJs');
    gulp.run('buildDonationJs');
  });
  gulp.watch(paths.css, ['buildCss']).on('change', function () {
    gulp.run('buildCss');
  });
  gulp.watch(paths.img, ['buildImg']).on('change', function () {
    gulp.run('buildImg');
  });
});
