/*jslint node: true */

'use strict';

module.exports = function(config) {
  Object.keys(config).forEach(function(key) {
    console.log(key, config[key]);
    process.env[key] = config[key];
  });
}
