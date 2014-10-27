var gulp = require('gulp'),
    version = require('../../package.json').version,
    git = require('gulp-git');

gulp.task('tag', function () {
  git.tag('v' + version, 'Release v' + version);
});
