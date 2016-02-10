'use strict';

/**
 * Module dependencies.
 */
var gm = require('gm'),
    _ = require('lodash');

/**
 * Create a Image

exports.create = function(req, res) {

};*/

/**
 * Show the current Image
 */
exports.read = function(req, res, next) {
  console.log('generating the image!');
    gm('modules/gardenparts/server/img/'+req.params.orientation+'.jpg')
        .resize(req.params.width,req.params.height, '!')
        .stream(function streamOut (err, stdout, stderr) {
            if (err) return next(err);
            stdout.pipe(res); //pipe to response
            stdout.on('error', next);
        });
};

/**
 * Update a Image

exports.update = function(req, res) {

}; */

/**
 * Delete an Image

exports.delete = function(req, res) {

}; */

/**
 * List of Images

exports.list = function(req, res) {

}; */
