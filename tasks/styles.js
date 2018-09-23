'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;
const fs = require('fs');
const resolver = require('stylus').resolver;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function (options) {
  let hasSprite = false;
  let manifest = false;
  const resolve = resolver();
  try {
    fs.accessSync(process.cwd() + '/tmp/styles/sprite.styl', fs.F_OK);
    hasSprite = true;
  } catch(e) {
    // empty
  }
  try {
    if (!isDev) {
      manifest = require(process.cwd() + '/manifest/styles-assets.json');
    }
  } catch(e) {
    // empty
  }

  function url(urlLiteral) {
    urlLiteral = resolve.call(this, urlLiteral);
    if (manifest) {
      for (let asset in manifest) {
        if ( urlLiteral.val === `url("${asset}")` ) {
          urlLiteral.string = urlLiteral.val = `url("${manifest[asset]}")`;
        }
      }
    }
    return urlLiteral;
  }
  url.options = resolve.options;
  url.raw = true;

  return combine(
    gulp.src(options.src),
    $.if(isDev,
      $.sourcemaps.init()
    ),
    $.if(hasSprite,
      $.stylus({
        import: process.cwd() + '/tmp/styles/sprite',
        define: {url: url},
        'include css': true
      }),
      $.stylus({
        define: {url: url},
        'include css': true
      })
    ),
    $.autoprefixer({
      browsers: ['> 1% in RU', 'last 2 versions', 'Firefox ESR', 'ie > 10'],
      cascade: false,
      remove: false
    }),
    $.rename({basename: 'app'}),
    $.if(isDev,
      $.sourcemaps.write(),
      combine(
        $.cleanCss({roundingPrecision: -1}),
        $.rev()
      )
    ),
    gulp.dest('public/styles'),
    $.if(!isDev,
      combine(
        $.rev.manifest('styles.json'),
        gulp.dest('manifest')
      )
    )
  ).on('error', $.notify.onError());
};
