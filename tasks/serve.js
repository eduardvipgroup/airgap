'use strict';
const bs = require('browser-sync').create();

module.exports = function() {
  bs.init({
    browser: [],
    server: 'public',
  });
  bs.watch('public/**/*.*').on('change', bs.reload);
};
