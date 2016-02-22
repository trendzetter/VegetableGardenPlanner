'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * getByName
 */
exports.getByName = function(req, res) {
  User.findOne({
    username: req.params.name
  },
    /* Fields to include */
    {
      _id: 1,
      username: 1
    }).exec(function(err, user) {
      if (err) {
        return res.send(400, {
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (!user) {
          res.send(400, {
            message: 'Failed to find user ' + req.params.name
          });
        } else {
          res.jsonp(user);
        }
      }
    });
};
