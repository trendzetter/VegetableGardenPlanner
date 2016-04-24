'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CultivationPlan = mongoose.model('CultivationPlan'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an cultivationPlan
 */
exports.create = function (req, res) {
  var cultivationPlan = new CultivationPlan(req.body);
  cultivationPlan.user = req.user;
  cultivationPlan.variety = new mongoose.Types.ObjectId(req.body.variety);

  cultivationPlan.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cultivationPlan);
    }
  });
};

/**
 * Show the current cultivationPlan
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cultivationPlan = req.cultivationPlan ? req.cultivationPlan.toJSON() : {};

  // Add a custom field to the CultivationPlan, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the CultivationPlan model.
  cultivationPlan.isCurrentUserOwner = !!(req.user && cultivationPlan.user && cultivationPlan.user._id.toString() === req.user._id.toString());

  res.json(cultivationPlan);
};

/**
 * Update an cultivationPlan
 */
exports.update = function (req, res) {
  var cultivationPlan = req.cultivationPlan;

  cultivationPlan.title = req.body.title;
  cultivationPlan.description = req.body.description;
  cultivationPlan.steps = req.body.steps;

  cultivationPlan.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cultivationPlan);
    }
  });
};

/**
 * Delete an cultivationPlan
 */
exports.delete = function (req, res) {
  var cultivationPlan = req.cultivationPlan;

  cultivationPlan.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cultivationPlan);
    }
  });
};

/**
 * List of CultivationPlans
 */
exports.list = function (req, res) {
  CultivationPlan.find().sort('-created').populate('user', 'displayName').exec(function (err, cultivationPlans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cultivationPlans);
    }
  });
};

/**
 * CultivationPlan middleware
 */
exports.cultivationPlanByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CultivationPlan is invalid'
    });
  }
  var populateQuery = [{ path: 'user', select: 'displayName' }, { path: 'crop', select: 'name' }, { path: 'variety', select: 'name cmInRow cmBetweenRow' }];
  CultivationPlan.findById(id).populate(populateQuery).exec(function (err, cultivationPlan) {
    if (err) {
      return next(err);
    } else if (!cultivationPlan) {
      return res.status(404).send({
        message: 'No cultivationPlan with that identifier has been found'
      });
    }
    req.cultivationPlan = cultivationPlan;
    next();
  });
};
