'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Crop = mongoose.model('Crop'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.getFamily = function(req, res) {
  Crop.find({ plantfamily: req.params.familyId }).sort('name').exec(function(err, crops) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(crops);
    }
  });
};

/**
 * Create an crop
 */
exports.create = function (req, res) {
  var crop = new Crop(req.body);
  crop.user = req.user;

  crop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crop);
    }
  });
};

/**
 * Show the current crop
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var crop = req.crop ? req.crop.toJSON() : {};

  // Add a custom field to the crop, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the crop model.
  crop.isCurrentUserOwner = !!(req.user && crop.user && crop.user._id.toString() === req.user._id.toString());
  res.json(crop);
};

/**
 * Update an crop
 */
exports.update = function (req, res) {
  var crop = req.crop;

  crop.name = req.body.name;
  crop.plantfamily = new mongoose.Types.ObjectId(req.body.plantfamily._id);

  crop.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crop);
    }
  });
};

/**
 * Delete an crop
 */
exports.delete = function (req, res) {
  var crop = req.crop;

  crop.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crop);
    }
  });
};

/**
 * List of Crops
 */
exports.list = function (req, res) {
  Crop.find().sort('-created').populate('user', 'displayName').populate('plantfamily', 'name').exec(function (err, crops) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crops);
    }
  });
};

/**
 * Crop middleware
 */
exports.cropByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Crop is invalid'
    });
  }

  Crop.findById(id).populate('user', 'displayName').populate('plantfamily', 'name').exec(function (err, crop) {
    if (err) {
      return next(err);
    } else if (!crop) {
      return res.status(404).send({
        message: 'No crop with that identifier has been found'
      });
    }
    req.crop = crop;
    next();
  });
};
