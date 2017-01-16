'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Friend = mongoose.model('Friend'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an friend
 */
exports.create = function (req, res) {
  var friend = new Friend(req.body);
  friend.user = req.user;

  friend.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(friend);
    }
  });
};

/**
 * Show the current friend
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var friend = req.friend ? req.friend.toJSON() : {};

  // Add a custom field to the Friend, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Friend model.
  friend.isCurrentUserOwner = !!(req.user && friend.user && friend.user._id.toString() === req.user._id.toString());

  res.json(friend);
};

/**
 * Update an friend
 */
exports.update = function (req, res) {
  var friend = req.friend;

  friend.title = req.body.title;
  friend.content = req.body.content;

  friend.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(friend);
    }
  });
};

/**
 * Delete an friend
 */
exports.delete = function (req, res) {
  var friend = req.friend;

  friend.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(friend);
    }
  });
};

/**
 * List of Friends
 */
exports.list = function (req, res) {
  Friend.find().sort('-created').populate('user', 'displayName').exec(function (err, friends) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(friends);
    }
  });
};

/**
 * Friend middleware
 */
exports.friendByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Friend is invalid'
    });
  }

  Friend.findById(id).populate('user', 'displayName').exec(function (err, friend) {
    if (err) {
      return next(err);
    } else if (!friend) {
      return res.status(404).send({
        message: 'No friend with that identifier has been found'
      });
    }
    req.friend = friend;
    next();
  });
};
