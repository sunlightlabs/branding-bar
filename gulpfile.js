var gulp = require('gulp'),
    clean = require('gulp-clean'),
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

gulp.task('update-bower-version', function(){
  var bowerpkg = require('./bower.json');
  bowerpkg.version = version;
  fs.writeSync(fs.openSync('./bower.json', 'w+'), JSON.stringify(bowerpkg, null, '  '));
});

gulp.task('clean', function(){
  return gulp.src('dist')
    .pipe(clean());
});

gulp.task('js', function(){
  return gulp.src(paths.js)
    .pipe(srcreplace(/\{\{ ?version ?\}\}/g, version))
      .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
    .pipe(gzip())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function(){
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

gulp.task('img', function(){
  return gulp.src(paths.img)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('tag', function(){
  git.tag('v' + version, 'Release v' + version);
});

gulp.task('publish', function(){
  gulp.src(paths.dist.img, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + version + '/img/',
      delay: 1000,
    }));
  gulp.src(paths.dist.css, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + version + '/css/',
      delay: 1000,
    }));
  gulp.src(paths.dist.cssgz, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + version + '/css/',
      delay: 1000,
      headers: {
        "Content-Disposition": "inline",
        "Content-Encoding": "gzip",
        "Content-Type": "text/css"
      }
    }));
  gulp.src(paths.dist.js, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + version + '/js/',
      delay: 1000,
    }));
  gulp.src(paths.dist.jsgz, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'brandingbar/' + version + '/js/',
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
  gulp.watch(paths.js, ['js']).on('change', function(){
    gulp.run('js');
  });
  gulp.watch(paths.css, ['css']).on('change', function(){
    gulp.run('css');
  });
  gulp.watch(paths.img, ['img']).on('change', function(){
    gulp.run('img');
  });
});

gulp.task('setup', ['update-bower-version', 'clean']);
gulp.task('build', ['js', 'css', 'img']);
gulp.task('default', ['setup'], function(){
  gulp.run('build');
});
