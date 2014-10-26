var gulp = require('gulp'),
    fs = require('fs'),
    version = require('../../package.json').version;

gulp.task('updateBowerVersion', function () {
  var bowerPackage = require('../../bower.json');
  bowerPackage.version = version;
  fs.writeSync(fs.openSync('../../bower.json', 'w+'), JSON.stringify(bowerPackage, null, '  '));
});
