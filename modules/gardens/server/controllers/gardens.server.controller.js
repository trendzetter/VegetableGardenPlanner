'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Garden = mongoose.model('Garden'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an garden
 */
exports.create = function (req, res) {
  var garden = new Garden(req.body);
  garden.user = req.user;

  garden.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(garden);
    }
  });
};

/**
 * Show the current garden
 */
exports.read = function (req, res) {
  res.json(req.garden);
};

/**
 * Update an garden
 */
exports.update = function (req, res) {
  var garden = req.garden;

  garden.title = req.body.title;
  garden.content = req.body.content;

  garden.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(garden);
    }
  });
};

/**
 * Delete an garden
 */
exports.delete = function (req, res) {
  var garden = req.garden;

  garden.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(garden);
    }
  });
};

/**
 * List of Gardens
 */
exports.list = function (req, res) {
  Garden.find().sort('-created').populate('user', 'displayName').exec(function (err, gardens) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(gardens);
    }
  });
};

/**
 * Garden middleware
 */
exports.gardenByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Garden is invalid'
    });
  }

  Garden.findById(id).populate('user', 'displayName').exec(function (err, garden) {
    if (err) {
      return next(err);
    } else if (!garden) {
      return res.status(404).send({
        message: 'No garden with that identifier has been found'
      });
    }
    req.garden = garden;
    next();
  });
};
