'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return combine(
    gulp.src(options.src),
    $.pug({pretty: '  '}),
    $.if(!isDev,
      $.revReplace({manifest: gulp.src(options.manifests, {allowEmpty: true})})
    ),
    gulp.dest('public')
  ).on('error', $.notify.onError());
};
