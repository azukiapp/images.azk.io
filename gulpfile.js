// Folders usage:
// dev:   /src
// build: /build
// prod:  /dist

var dotenv              = require('dotenv');
var del                 = require('del');
var gulp                = require('gulp');
var argv                = require('yargs').argv;
var awspublish          = require('gulp-awspublish');
var parallelize         = require('concurrent-transform');
var concat              = require('gulp-concat');
var uglify              = require('gulp-uglify');
var jshint              = require('gulp-jshint');
var jsreporter          = require('jshint-stylish');
var react               = require('gulp-react');
var runSequence         = require('run-sequence');
var htmlreplace         = require('gulp-html-replace');
var debug = require('gulp-debug');

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

gulp.task('copy-html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest( 'build' ))
});


gulp.task('htmlreplace', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlreplace({
        'css': 'assets/css/app.min.css',
        'js': [ 'assets/js/vendor.min.js',
                'assets/js/app.components.min.js']
    }))
    .pipe(gulp.dest('build'));
});


/**
 * Images
 */

gulp.task('images', function() {
return gulp.src('src/assets/images/**/*')
    .pipe(gulp.dest( 'build/assets/images' ))
});


/**
 *  React Compiler
 */

var react_files = [
  'src/assets/js/app.jsx',
  'src/assets/js/app.home.jsx',
  'src/assets/js/app.projects.jsx',
  'src/assets/js/app.router.jsx'
];

gulp.task('react-compile', function () {
    return gulp.src('src/assets/js/**/*.jsx')
        .pipe(debug())
        .pipe(react( {harmony: true} ))
        .pipe(gulp.dest( 'build/assets/js' ));
});

gulp.task('react-build', function () {
    return gulp.src(react_files)
        .pipe(debug())
        .pipe(react( {harmony: true} ))
        .pipe(concat('app.components.min.js'))
        .pipe(gulp.dest( 'build/assets/js' ));
});


/**
 *  Styles/Fonts
 */

var  css_files = [
                  'src/assets/css/bootstrap.css',
                  'src/assets/css/app.css',
                  'src/assets/css/prism-okaidia.css',
                  'src/assets/css/responsive.css'
                ];
gulp.task('styles', function() {
  // concat
  return gulp.src(css_files)
      .pipe(debug())
      .pipe(gulp.dest( 'build/assets/css' ));
});

gulp.task('styles-build', function() {
    return gulp.src(css_files)
      .pipe(debug())
      .pipe(concat('app.min.css'))
      .pipe(gulp.dest( 'build/assets/css' ));
});

gulp.task('copy-fonts', function () {
  return gulp.src(['src/assets/fonts/**/*', 'src/assets/ico/**/*'])
        .pipe(gulp.dest( 'build/assets/fonts' ));
});


/**
 * Vendor (JS)
 */

var vendor_files = [
  'bower_modules/bootstrap/dist/js/bootstrap.js',
  'bower_modules/lodash/lodash.js',
  'bower_modules/marked/lib/marked.js',
  'bower_modules/react/react.js',
  'bower_modules/react-router/build/global/ReactRouter.js',
  'src/assets/js/vendor/prism.js',
  'src/assets/js/prism_azkfile.js'
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

gulp.task('vendor-concat-uglify', function () {
  return gulp.src(vendor_files)
      .pipe(debug())
      .pipe(uglify())
      .pipe(concat('vendor.min.js'))
      .pipe(gulp.dest( 'build/assets/js' ));
});


/**
 *  Default / Watch / Build
 */

gulp.task('default', function(callback) {
  runSequence('clean-build-folder',
              'copy-html',
              'copy-assets',
              'copy-vendor',
              'react-compile',
              callback);
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/*.html',            ['copy-html']);
  gulp.watch('src/assets/images/**/*',['images']);
  gulp.watch('src/assets/js/**/*.jsx',['react-compile']);
  gulp.watch('src/assets/css/**/*',   ['styles']);
});


/**
 * Build + Versioning
 */

gulp.task('build', function(callback) {
  runSequence('clean-build-folder',
              'copy-html',
              'images',
              'copy-fonts',
              'styles-build',
              'react-build',
              'vendor-concat-uglify',
              'htmlreplace',
              callback);
});


var configs = {
  deploy: {
    build_path: "build/",
    mixpanel_expand: false,
  }
};

// Deploying zipped files
gulp.task('deploy', ['build'], function() {
  var bucket = process.env[
    "AWS_BUCKET_" + (argv.production ? "PROD" : "STAGE")
  ];

  // create a new publisher
  var publisher = awspublish.create({
    key:    process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_KEY,
    bucket: bucket,
    region: 'sa-east-1',
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public',
    'Content-Encoding': 'gzip',
    // ...
  };

  return gulp.src("build/**/*")
    .pipe(debug())
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
