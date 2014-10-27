var gulp = require('gulp');

gulp.task('tag', function(){
  git.tag('v' + version, 'Release v' + version);
});