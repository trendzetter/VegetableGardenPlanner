'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Notification = mongoose.model('Notification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an notification
 */
exports.create = function (req, res) {
  var notification = new Notification(req.body);
  notification.user = req.user;

  notification.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notification);
    }
  });
};

/**
 * Show the current notification
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var notification = req.notification ? req.notification.toJSON() : {};

  // Add a custom field to the Notification, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Notification model.
  notification.isCurrentUserOwner = !!(req.user && notification.user && notification.user._id.toString() === req.user._id.toString());

  res.json(notification);
};

/**
 * Update an notification
 */
exports.update = function (req, res) {
  var notification = req.notification;

  notification.title = req.body.title;
  notification.content = req.body.content;

  notification.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notification);
    }
  });
};

/**
 * Delete an notification
 */
exports.delete = function (req, res) {
  var notification = req.notification;

  notification.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notification);
    }
  });
};

/**
 * List of Notifications
 */
exports.list = function (req, res) {
  Notification.find({user: req.user}).sort('-created').populate('user', 'displayName').exec(function (err, notifications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notifications);
    }
  });
};

/**
 * Notification middleware
 */
exports.notificationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Notification is invalid'
    });
  }

  Notification.findById(id).populate('user', 'displayName').exec(function (err, notification) {
    if (err) {
      return next(err);
    } else if (!notification) {
      return res.status(404).send({
        message: 'No notification with that identifier has been found'
      });
    }
    req.notification = notification;
    next();
  });
};
