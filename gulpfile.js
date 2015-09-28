var debug               = require('gulp-debug');
var gulp                = require('gulp');
var path                = require('path');

// Load envs from .env files
var dotenv = require('dotenv');
dotenv.load({ silent: true });

// Globals configurations
var config = {
  bootstrapPath: path.join(
    __dirname, 'node_modules', 'bootstrap-sass', 'assets'
  ),
  publicPath: './build/assets',
};

var connect = require('gulp-connect');
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    port: process.env.PORT || 3000,
    // livereload: true,
    livereload: {
      port: 35729
    },
    host: '0.0.0.0'
  });
});

/**
 * Clean folder
 */
gulp.task('clean-build-folder', function (cb) {
  var del = require('del');
  return del([
    'build/*',
  ], cb);
});

/**
 *  HTML
 */
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
  .pipe(debug({title: 'html:'}))
  .pipe(gulp.dest('build/'))
  .pipe(connect.reload());
});

/**
 *  CSS
 */
gulp.task('css', function() {
  var sass       = require('gulp-sass');
  var sourcemaps = require('gulp-sourcemaps');

  return gulp.src('src/assets/css/app.scss')
  .pipe(debug({title: 'css:'}))
  .pipe(sourcemaps.init())
  .pipe(sass({
    style: 'compressed',
    includePaths: [config.bootstrapPath + '/stylesheets'],
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.publicPath + '/css'))
  .pipe(connect.reload());
});

/**
 *  FONTS
 */
gulp.task('fonts', function() {
  return gulp.src([
    config.bootstrapPath + '/fonts/**/*',
    'src/assets/fonts/**/*'
  ])
  .pipe(debug({title: 'fonts:'}))
  .pipe(gulp.dest(config.publicPath + '/fonts'));
});

/**
 *  FONTS
 */
gulp.task('images:copy', function() {
  return gulp.src('src/assets/images/**/*')
  .pipe(debug({title: 'images:'}))
  .pipe(gulp.dest('build/assets/images'))
  .pipe(connect.reload());
});

/**
 *  WEBPACK
 */
gulp.task("webpack", function(callback) {
  var webpack = require('webpack-stream');
  return gulp.src('.')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('./build/assets/js'))
    .pipe(connect.reload());
});


/**
 *  APP TASKS
 */
gulp.task('default', ['connect', 'watch']);

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.html',             ['html']);
  gulp.watch('src/assets/css/**/*.scss',  ['css']);
  gulp.watch('src/assets/images/**/*',    ['images:copy']);
  gulp.watch('src/assets/js/**/*.js',     ['webpack']);
});

gulp.task('build', function (callback) {
  var runSequence = require('run-sequence');
  var sequence    = [
    'webpack',
    'css',
    'fonts',
    'images:copy',
    'html',
  ];

  runSequence('clean-build-folder', sequence, callback);
});


/**
 * Build + Versioning
 */

// Deploying zipped files
gulp.task('deploy', ['build'], function() {

  // Select bucket
  var yargs  = require('yargs');
  var bucket = process.env[
    "AWS_BUCKET_" + (yargs.argv.production ? "PROD" : "STAGE")
  ];

  // create a new publisher
  var awspublish = require('gulp-awspublish');
  var publisher  = awspublish.create({
    params: {
      Bucket: bucket,
    },
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'sa-east-1',
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public',
    'Content-Encoding': 'gzip',
    // ...
  };

  var gulpif  = require('gulp-if');
  var replace = require('gulp-replace');
  var parallelize = require('concurrent-transform');

  // Replaces for production from .env
  var src = gulp.src("build/**/*");
  if (yargs.argv.production) {
    // Replacing analytics ua-code
    src = src.pipe(
      gulpif(/.*\.js/, replace(/<UA-CODE>/, process.env.UA_CODE))
    );
  }

  return src
    .pipe(debug())
     // gzip, Set Content-Encoding headers and add .gz extension
    .pipe(awspublish.gzip(function(){}))
    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(parallelize(publisher.publish(headers), 10))
    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())
    // print upload updates to console
    .pipe(awspublish.reporter());
});
