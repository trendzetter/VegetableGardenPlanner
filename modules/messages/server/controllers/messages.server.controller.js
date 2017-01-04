'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an message
 */
exports.create = function (req, res) {
  var message = new Message(req.body);
  message.user = req.user;

  message.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(message);
    }
  });
};

/**
 * Show the current message
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var message = req.message ? req.message.toJSON() : {};

  // Add a custom field to the Message, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Message model.
  message.isCurrentUserOwner = !!(req.user && message.user && message.user._id.toString() === req.user._id.toString());

  res.json(message);
};

/**
 * Update an message
 */
exports.update = function (req, res) {
  var message = req.message;

  message.title = req.body.title;
  message.content = req.body.content;

  message.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(message);
    }
  });
};

/**
 * Delete an message
 */
exports.delete = function (req, res) {
  var message = req.message;

  message.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(message);
    }
  });
};

/**
 * List of Messages
 */
exports.list = function (req, res) {
  Message.find({ user: req.user }).sort('-created').populate('user', 'displayName').exec(function (err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(messages);
    }
  });
};

/**
 * Message middleware
 */
exports.messageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Message is invalid'
    });
  }

  Message.findById(id).populate('user', 'displayName').exec(function (err, message) {
    if (err) {
      return next(err);
    } else if (!message) {
      return res.status(404).send({
        message: 'No message with that identifier has been found'
      });
    }
    req.message = message;
    next();
  });
};
