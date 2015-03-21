// Folders usage:
// dev:   /src
// build: /build
// prod:  /dist

var dotenv              = require('dotenv');
var del                 = require('del');
var gulp                = require('gulp');
var awspublish          = require('gulp-awspublish');
var concat              = require('gulp-concat-sourcemap');
var uglify              = require('gulp-uglify');
var jshint              = require('gulp-jshint');
var jsreporter          = require('jshint-stylish');
var react               = require('gulp-react');
var runSequence         = require('run-sequence');


// JSHINT
var scripts = ['src/assets/js/**/*.js', '!src/assets/js/vendor/**/*'];
gulp.task('js-hint', function () {
      return gulp.src(scripts)
          // eslint(esconfig),
          // eslint.formatEach(esreporter),
          .pipe(jshint())
          .pipe(jshint.reporter(jsreporter))
          .pipe(jshint.reporter('fail'));
  });


// Load envs from .env files
dotenv.load();

/**
 * Clean folder
 */

gulp.task('clean-build-folder', function (cb) {
  return del([
    'build/*',
  ], cb);
});

/**
 *  HTML
 */

gulp.task('html', function() {
return gulp.src('src/**/*.html')
  .pipe(gulp.dest( 'build' ))
});


/**
 * Images
 * TODO: improve with compresser
 */

gulp.task('images', function() {
return gulp.src('src/assets/images/**/*')
    .pipe(gulp.dest( 'build/assets/images' ))
});



/**
 *  React Compiler
 */

gulp.task('react-compile', function () {
    return gulp.src('src/assets/js/**/*.jsx')
        .pipe(react( {harmony: true} ))
        //.pipe(concat('app.components.js', concat_options))
        .pipe(gulp.dest( 'build/assets/js' ));
});


/**
 *  Styles
 */

gulp.task('styles', function() {
  // concat
  return gulp.src('src/assets/css/**')
      .pipe(gulp.dest( 'build/assets/css' ));
});


/**
 * Vendor
 */

var vendor_files = [
  'bower_modules/modernizr/modernizr.js',
  'bower_modules/react/react.js',
  'bower_modules/react-router/build/global/ReactRouter.js',
  'bower_modules/commonjs/common.js',
  'bower_modules/lodash/lodash.js',
  'bower_modules/bootstrap/dist/js/bootstrap.js',
  'bower_modules/marked/lib/marked.js'
];

gulp.task('copy-vendor', function () {
  return gulp.src(vendor_files)
      .pipe(gulp.dest( 'build/assets/js/vendor' ));
});

var assets_files = ['src/assets/**/*',
                    '!src/assets/js/**/*.jsx'] // avoid react files

gulp.task('copy-assets', function () {
  return gulp.src(assets_files)
        .pipe(gulp.dest( 'build/assets' ));
});



var concat_options = {};
gulp.task('vendor-concat-uglify', function () {
    return gulp.src(['src/assets/js/vendor/**/*.js'])
        .pipe(uglify())
        .pipe(concat('vendor.js', concat_options))
        .pipe(gulp.dest( 'build/assets/js' ));
});



/**
 *  Server + Watchers + Livereload
 */

gulp.task('server', function(callback) {
  runSequence('clean-build-folder',
              'html',
              'copy-assets',
              'copy-vendor',
              'react-compile',
              //'js-hint',
              callback);
});

gulp.task('watch', ['server'], function() {
  gulp.watch('src/*.html',            ['html']); // ✔
  gulp.watch('src/assets/images/**/*',['images']); // ✔
  gulp.watch('src/assets/js/**/*.jsx',['react-compile']); // ❍
  gulp.watch('src/assets/css/**/*',   ['styles']); // ✔
});

gulp.task('default', ['watch']);


/**
 * Build + Versioning
 */


var configs = {
  deploy: {
    bucket: process.env.AWS_BUCKET,
    mixpanel_expand: false,
  }
};


// Deploying zipped files
gulp.task('deploy', function() {
  // create a new publisher
  var publisher = awspublish.create({
    key:    process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_KEY,
    bucket: configs.deploy.bucket,
    region: 'sa-east-1',
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public',
    'Content-Encoding': 'gzip',
    // ...
  };

  var src = './content/_book/**/*.*';

  return gulp.src(src)
    // Only newer files
    // .pipe(newer(src))

     // gzip, Set Content-Encoding headers and add .gz extension
    .pipe(awspublish.gzip())

    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(parallelize(publisher.publish(headers), 10))

    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())

    // print upload updates to console
    .pipe(awspublish.reporter());
});
