'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Garden = mongoose.model('Garden'),
  Gardenpart = mongoose.model('Gardenpart'),
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
        message = 'Garden already exists';
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

var errorHandler = function(err) {
  err = getErrorMessage(err);
  console.log('err in errorhandler gardenparts' + err);
  return err;
};
/**
 * Create gardenparts
 */
exports.create = function(req, res) {
  var parts = req.body;
  var resparts = [];
  for (var index = 0; index < parts.length; ++index) {
    console.log('creating a gardenpart!');
    var gardenpart = new Gardenpart(parts[index]);
    gardenpart.bk = mongoose.Types.ObjectId();
    gardenpart.validTo = new Date(100000000 * 86400000);
    console.log(gardenpart);
    gardenpart.save();
    resparts.push(gardenpart);
  }
  return res.jsonp(resparts);
};

/**
 * Show the current Gardenpart
 */
exports.read = function(req, res) {

};

/**
 * Update a Gardenpart
 */
exports.update = function(req, res) {
  var parts = req.body;
  var updateOld = function(err, part) {
    part.validTo = req.params.selectedDate;
    part.save();
  };
  // loop door de parts van garden en bewaar
  for (var index = 0; index < parts.length; ++index) {
    var part = parts[index];
    console.log('update part: ' + req.params.selectedDate + part._id);

    var newpart = new Gardenpart(part);
    console.log('update controller gardenparts oldpart: ' + JSON.stringify(newpart));
    newpart.validFrom = req.params.selectedDate;
    newpart._id = mongoose.Types.ObjectId();
    newpart.save();

    Gardenpart.findById(part._id, updateOld);
  }
  res.jsonp(parts);
};

/**
 * Delete an Gardenpart
 */
exports.delete = function(req, res) {
  var parts = req.body;
  var updateOld = function(err, part) {
    part.validTo = req.params.selectedDate;
    part.save();
  };
  // loop door de parts van garden en bewaar
  for (var index = 0; index < parts.length; ++index) {
    var part = parts[index];
    console.log('delete part: ' + req.params.selectedDate + part._id);

    Gardenpart.findById(part._id, updateOld);
  }
  res.jsonp(parts);
};

/**
 * List of Gardenparts
 */
exports.list = function(req, res) {

};

exports.gardenByBK = function(req, res, next, bk) {
  Garden.findOne({
    validFrom: {
      $lte: req.params.selectedDate
    },
    bk: bk
  }).populate('user', 'displayName').sort('-validFrom').exec(function(err, garden) {
    if (err) return next(err);
    if (!garden) return next(new Error('Failed to load Garden ' + bk));
    req.garden = garden;
    next();
  });
};
/**
 * Garden authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.garden.user.id !== req.user.id && req.garden.user._id.toString() !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};
