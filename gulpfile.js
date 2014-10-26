var requireDir = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });

var gulp = require('gulp'),
    help = require('gulp-task-listing'),
    srcreplace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    imagemin = require('gulp-imagemin'),
    git = require('gulp-git'),
    s3 = require('gulp-s3'),
    fs = require('fs'),
    connect = require('gulp-connect'),
    version = require('./package.json').version,
    aws = JSON.parse(fs.readFileSync('./aws.json')),
    paths = {
      js: 'src/js/*.js',
      css: 'src/css/*.scss',
      img: 'src/img/**/*',
      dist: {
        all: 'dist/**/*',
        css: 'dist/css/**/*.css',
        cssgz: 'dist/css/**/*.gz',
        js: 'dist/js/**/*.js',
        jsgz: 'dist/js/**/*.gz',
        img: 'dist/img/**/*'
      }
    };

gulp.task('build-css', function(){
  return gulp.src(paths.css)
    .pipe(sass())
    .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
      .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sass({outputStyle: 'compressed'}))
      .pipe(gulp.dest('dist/css'))
    .pipe(gzip())
      .pipe(gulp.dest('dist/css'));
});

gulp.task('build-img', function(){
  return gulp.src(paths.img)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('tag', function(){
  git.tag('v' + version, 'Release v' + version);
});

gulp.task('publish', function(){
  var s3Version = parseFloat(version).toString();
  gulp.src(paths.dist.img, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/img/',
      delay: 1000,
    }));
  gulp.src(paths.dist.css, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/css/',
      delay: 1000,
    }));
  gulp.src(paths.dist.cssgz, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/css/',
      delay: 1000,
      headers: {
        "Content-Disposition": "inline",
        "Content-Encoding": "gzip",
        "Content-Type": "text/css"
      }
    }));
  gulp.src(paths.dist.js, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + s3Version + '/js/',
      delay: 1000,
    }));
  gulp.src(paths.dist.jsgz, {read: false})
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

gulp.task('connect', connect.server({
  root: ['example'],
  port: 4000
}));

gulp.task('watch', ['connect'], function(){
  gulp.watch(paths.js, ['buildJs']).on('change', function(){
    gulp.run('buildJs');
  });
  gulp.watch(paths.css, ['build-css']).on('change', function(){
    gulp.run('build-css');
  });
  gulp.watch(paths.img, ['build-img']).on('change', function(){
    gulp.run('build-img');
  });
});

gulp.task('help', help);
gulp.task('setup', ['updateBowerVersion', 'buildClean']);
gulp.task('build', ['buildJs', 'build-css', 'build-img']);
gulp.task('default', ['setup'], function(){
  gulp.run('build');
});
