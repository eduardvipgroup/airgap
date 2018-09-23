'use strict';
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {
  return combine(
    gulp.src(options.src),
    gulpWebpack(
      require(path.resolve(__dirname, '../webpack.config.js')),
      webpack
    ),
    $.if(!isDev,
      combine(
        $.rev()
      )
    ),
    gulp.dest('public/scripts'),
    $.if(!isDev,
      combine(
        $.rev.manifest('scripts.json'),
        gulp.dest('manifest')
      )
    )
  ).on('error', $.notify.onError());
};
