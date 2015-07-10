'use strict';

/*
 * Defines project management/build tasks using gulp
 */

var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var nodemon   = require('gulp-nodemon');
var prettify  = require('gulp-jsbeautifier');

var minimist = require('minimist');
var knownOptions = {
  string: 'file'
};
var options = minimist(process.argv.slice(2), knownOptions);

// task to lint JS files
gulp.task('lint', function() {
  return gulp.src(['./app/**/*.js', './config/**/*.js', './*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// task to run the server using nodemon
gulp.task('start', function() {
  return nodemon({
    script: 'serve.js',
    ext: 'js html',
    env: { 'ENV': 'development' }
  });
});

// task to format JS files
// sample usage: gulp format --file ./app/router.js
gulp.task('format', function() {
  return gulp.src(options.file)
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest(__dirname);
});
