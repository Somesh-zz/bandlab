/*jslint node: true */

'use strict';

var
  request = require('request'),
  util    = require('util');


var
  JSONENDPOINT = 'https://jsonplaceholder.typicode.com',
  url          = JSONENDPOINT + '/comments/';



var comments = {};

comments.getById = function getById (id, callback) {
  var options = {}, error;

  options.url = url + id;
  options.method = 'GET';
  options.json   = true;
  options.timeout = 5000; //ms
  request(options, function(err, resp, body) {
    if (err || (resp && resp.statusCode != 200) || !body) {
      util.log(util.format('#ERROR[comments][getById]: %s \n', err));
      error = new Error(err && err.message || 'Unable to fetch comments for id ' + id);
      error.status = (resp && resp.statusCode) || 400;
    }
    util.log(util.format('#SUCCESS[comments][getById]: id %s \n', id));
    callback(error, body);
  });
};



module.exports = comments;


/***********************TEST CODE**********************/
if (require.main === module) {
  (function() {

    comments.getById(1, console.log);

  })();
}