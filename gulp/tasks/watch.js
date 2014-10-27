var gulp = require('gulp');

gulp.task('watch', ['connect'], function(){
  gulp.watch(paths.js, ['buildJs']).on('change', function(){
    gulp.run('buildJs');
  });
  gulp.watch(paths.css, ['buildCss']).on('change', function(){
    gulp.run('buildCss');
  });
  gulp.watch(paths.img, ['buildImg']).on('change', function(){
    gulp.run('buildImg');
  });
});