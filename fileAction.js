/*jslint node: true */

'use strict';

var
  AWS   = require('aws-sdk'),
  fs    = require('fs'),
  s3 = new AWS.S3(),
  util  = require('util'),
  uuid  = require('node-uuid');

var fileAction = {};


fileAction.uploadToS3 = function uploadToS3 (bucket, prefix, path, cb) {
  var
    params = {};

  params.Bucket = bucket;
  params.Key    = prefix + '/' + path.substring(path.lastIndexOf('/') + 1);
  params.Body   = '';

  this.__readFile(path, function(err, file_buf) {
    if (err) {
      return cb(err, file_buf);
    }
    params.Body = file_buf.toString();
    params.ContentType = 'application/json';

    util.log(util.format(
      '#SUCCESS[fileAction][uploadToS3]: Attempt to save file to s3 with params %j',
      params));

    s3.putObject(params, function(e, r) {
      if (e) {
        util.log(
          util.format(
            '#ERROR[fileAction][uploadToS3]: unable to upload file with params %j. Error %s',
            params, e));
        return cb(e, r);
      }

      util.log(util.format(
        '#SUCCESS[fileAction][uploadToS3]: File uploaded to s3 with params %j', params));
      cb(e, r);
    });
  });
};


fileAction.getFromS3 = function getFromS3(bucket, key, cb) {
  console.log("==================", bucket)
  s3.getObject({Bucket: bucket, Key: key}, function(err, data) {
    if (err) {
      util.log(util.format(
        "#ERROR[fileAction][getFromS3] getting object %s from bucket %s",
        key, bucket));
      return cb(err, data);
    }
    util.log('CONTENT TYPE:', data.ContentType);
    cb(err, data);
  });
};


fileAction.__writeFile = function __writeFile(path, content, cb) {
  fs.writeFile(path, JSON.stringify(content), function(err, data) {
    if (err) {
      util.log(util.format(
        '#ERROR[fileAction][__writeFile]: unable to write file to %s. Error %j',
        path, err));
      return cb(err, data);
    }

    util.log(util.format('#SUCCESS[fileAction][__writeFile]: location %s', path));
    cb(err, path);
  });
};


fileAction.__readFile = function __readFile(path, cb) {

  fs.readFile(path, 'utf8', function(err, file_buf) {
    if (err) {
      util.log(util.format(
        '#ERROR[fileAction][__readFile]: unable to read file from %s. Error %j',
        path, err));
      return cb(err, file_buf);
    }
    util.log(util.format('#SUCCESS[fileAction][__readFile]: location %s', path));
    cb(err, file_buf);
  });
};


fileAction.saveLocal = function saveLocal(dir, content, cb) {
  var
    name,
    fullpath;

  name = uuid.v1() + '.json';

  if (dir.substring(dir.length -1 ) !== '/') {
    dir = dir + '/';
  }

  fullpath = dir + name;

  util.log(util.format('#SUCCESS[fileAction][saveLocal]: Attempt to save content at %s', fullpath));
  this.__writeFile(fullpath, content, cb);
};


module.exports = fileAction;

/***********************TEST CODE**********************/
if (require.main === module) {
  (function(){

    // fileClass.saveLocal('/tmp/', '{name:somesh}', console.log);

    // fileAction.uploadToS3('bandlabsinbox', 'comments', '/tmp/8a6211e0-a3e5-11e6-a470-1f9041e9faf2.json', console.log);
// 
  })();
}