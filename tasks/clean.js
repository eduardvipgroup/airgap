'use strict';
const del = require('del');

module.exports = function (options) {
  return del(options.src);
};
