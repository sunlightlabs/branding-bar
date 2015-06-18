var gulp = require('gulp'),
	paths = require('../config').paths,
	version = require('../../package.json').version,
  s3 = require('gulp-s3'),
  fs = require('fs'),
	aws = JSON.parse(fs.readFileSync('./aws.json'));

gulp.task('publish', function () {
  var s3Version = parseFloat(version).toString();
  gulp.src(paths.dist.img, { read: false })
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/img/',
      delay: 1000
    }));
  gulp.src(paths.dist.css, { read: false })
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/css/',
      delay: 1000
    }));
  gulp.src(paths.dist.cssgz, { read: false })
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/css/',
      delay: 1000,
      headers: {
        "Content-Disposition": "inline",
        "Content-Encoding": "gzip",
        "Content-Type": "text/css"
      }
    }));
  gulp.src(paths.dist.js, { read: false })
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/js/',
      delay: 1000
    }));
  gulp.src(paths.dist.jsgz, { read: false })
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/js/',
      delay: 1000,
      headers: {
        "Content-Disposition": "inline",
        "Content-Encoding": "gzip",
        "Content-Type": "text/javascript"
      }
    }));
});
