'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return gulp.src(options.src, {since: gulp.lastRun('styles:assets')})
    .pipe($.imagemin())
    .pipe($.if(!isDev, $.rev()))
    .pipe(gulp.dest('public/styles'))
    .pipe($.if(!isDev,
      combine(
        $.rev.manifest('styles-assets.json'),
        gulp.dest('manifest')
      )
    ));
};
