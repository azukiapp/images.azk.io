var debug               = require('gulp-debug');
var gulp                = require('gulp');
var path                = require('path');

// Load envs from .env files
var dotenv = require('dotenv');
dotenv.load();

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
  gulp.watch('src/**/*.html',             ['html']); // OK
  gulp.watch('src/assets/css/**/*.scss',  ['css']);  // OK (mudar css p/ scss)
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
