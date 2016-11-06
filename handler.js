/*jslint node: true */

'use strict';

var
  comments      = require('./comments'),
  fileAction    = require('./fileAction'),
  util          = require('util');


const config = require('./config.json');

require('./env')(config);


module.exports.getComment = (event, context, callback) => {

  // console.log('event::::::::::', process.env);
  comments.getById(event.path.id, function(err, response) {
    if (err) {
      return callback(err, response);
    }

    fileAction.saveLocal('/tmp', response, function(e, path) {
      if (e) {
        return callback(e, path);
      }
      fileAction.uploadToS3(process.env.bucket, process.env.prefix, path, function(er, res) {
        if (er) {
          return callback(er, res);
        }
        util.log(util.format('#SUCCESS[handler][getComment]: fetch and upload to s3 complete for %s', response));
        callback(er, response);
      });
    });
  });
};


/***********************TEST CODE**********************/
// if (require.main === module) {
//   (function(){

//     // fileClass.saveLocal('/tmp/', '{name:somesh}', console.log);
//     var event = {params: {path: {id: 1}}}, context = {}

//     getComment(event, context, console.log)

//   })();
// }