'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PlantFamily = mongoose.model('PlantFamily'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an plantfamily
 */
exports.create = function (req, res) {
  var plantfamily = new PlantFamily(req.body);
  plantfamily.user = req.user;

  plantfamily.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plantfamily);
    }
  });
};

/**
 * Show the current plantfamily
 */
exports.read = function (req, res) {
  res.json(req.plantfamily);
};

/**
 * Update an plantfamily
 */
exports.update = function (req, res) {
  var plantfamily = req.plantfamily;

  plantfamily.title = req.body.title;
  plantfamily.content = req.body.content;

  plantfamily.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plantfamily);
    }
  });
};

/**
 * Delete an plantfamily
 */
exports.delete = function (req, res) {
  var plantfamily = req.plantfamily;

  plantfamily.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plantfamily);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  PlantFamily.find().sort('-created').populate('user', 'displayName').exec(function (err, plantfamilies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plantfamilies);
    }
  });
};

/**
 * Article middleware
 */
exports.plantFamilyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  PlantFamily.findById(id).populate('user', 'displayName').exec(function (err, plantfamily) {
    if (err) {
      return next(err);
    } else if (!plantfamily) {
      return res.status(404).send({
        message: 'No plantfamily with that identifier has been found'
      });
    }
    req.plantfamily = plantfamily;
    next();
  });
};
