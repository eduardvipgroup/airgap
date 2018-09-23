'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  return gulp.src(options.src)
    .pipe($.svgSprite({
      mode: {
        css: {
          bust: !isDev,
          dest: '.',
          dimensions: true,
          layout: 'vertical',
          prefix: '$svg-',
          sprite: 'sprite.svg',
          render: {
            styl: {
              dest: 'sprite.styl'
            }
          }
        }
      }
    }))
    .pipe($.if('*.styl',
      gulp.dest('tmp/styles'),
      gulp.dest('public/styles')
    ));
};
