'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  PlantVariety = mongoose.model('PlantVariety'),
  Crop = mongoose.model('Crop'),
  _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Plant variety already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

exports.groupByCrop = function(req, res) {
  var doy = req.params.doy;
  PlantVariety.find({
    DOYendSow: {
      $gte: doy
    },
    DOYstartSow: {
      $lte: doy
    }
  }).populate('crop', 'name').exec(function(err, plantVarieties) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(plantVarieties);
    }

  });
};
/**
 * Create a Plant variety
 */
exports.create = function(req, res) {
  var plantVariety = new PlantVariety(req.body);
  plantVariety.user = req.user;

  plantVariety.save(function(err, plantVariety) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      Crop.update({
        '_id': plantVariety.crop
      }, {
        $push: {
          'plantvarieties': plantVariety._id
        }
      }, function(err) {
        if (err) {
          console.log(err);
        }
      });
      res.jsonp(plantVariety);
    }
  });
};

/**
 * Show the current Plant variety
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var plantVariety = req.plantVariety ? req.plantVariety.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  plantVariety.isCurrentUserOwner = !!(req.user && plantVariety.user && plantVariety.user._id.toString() === req.user._id.toString());

  res.jsonp(plantVariety);
};

/**
 * Update a Plant variety
 */
exports.update = function(req, res) {
  var plantVariety = req.plantVariety;

  plantVariety = _.extend(plantVariety, req.body);

  plantVariety.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(plantVariety);
    }
  });
};

/**
 * Delete an Plant variety
 */
exports.delete = function(req, res) {
  var plantVariety = req.plantVariety;

  plantVariety.remove(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(plantVariety);
    }
  });
};

/**
 * List of Plant varieties
 */
exports.list = function(req, res) {
  PlantVariety.find().sort('name').populate('user', 'displayName').populate('crop', 'name').exec(function(err, plantVarieties) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(plantVarieties);
    }
  });
};

/**
 * List of Plant varieties
 */
exports.getCrop = function(req, res) {
  PlantVariety.find({ crop: req.params.cropId }).sort('name').exec(function(err, plantVarieties) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(plantVarieties);
    }
  });
};

/**
 * Plant variety middleware
 */
exports.plantVarietyByID = function(req, res, next, id) {
  PlantVariety.findById(id).populate('user', 'displayName').exec(function(err, plantVariety) {
    if (err) return next(err);
    if (!plantVariety) return next(new Error('Failed to load Plant variety ' + id));
    req.plantVariety = plantVariety;
    next();
  });
};
