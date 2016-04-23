'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Harvest = mongoose.model('Harvest'),
  Issue = mongoose.model('Issue'),
  Gotcha = mongoose.model('Gotcha'),
  Planting = mongoose.model('Planting'),
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
        message = 'Harvest already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    message = JSON.stringify(err);
    /*	for (var errName in err.errors) {
    		if (err.errors[errName].message) message = err.errors[errName].message;
    	}*/
  }

  return message;
};

/**
 * Create a Harvest
 */
exports.create = function(req, res) {
  Planting.update({
    '_id': req.body.planting
  }, {
    'validTo': req.body.date
  }, function(err, model) {
    if (err) // handleerr
      console.log(err);

  });
  var issues = req.body.issues;
  var gotchas = req.body.gotchas;
  var harvest = new Harvest();
  var i;
  // harvest.issues = [];
  for (i = 0; i < issues.length; i++) {
    if (typeof issues[i].text !== 'undefined') {
      var issue = new Issue(issues[i]);
      issue.save();
      harvest.issues.push(issue._id);
    }
  }
  for (i = 0; i < gotchas.length; i++) {
    if (typeof gotchas[i].text !== 'undefined') {
      var gotcha = new Gotcha(gotchas[i]);
      gotcha.save();
      harvest.gotchas.push(gotcha._id);
    }
  }
  harvest.garden = req.body.garden;
  harvest.planting = req.body.planting;
  harvest.date = req.body.date;
  harvest.unit = req.body.unit;
  harvest.user = req.user;
  harvest.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(harvest);
    }
  });
};

/**
 * Show the current Harvest
 */
exports.read = function(req, res) {
  res.jsonp(req.harvest);
};

/**
 * Update a Harvest
 */
exports.update = function(req, res) {
  var harvest = req.harvest;

  harvest = _.extend(harvest, req.body);

  harvest.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(harvest);
    }
  });
};

/**
 * Delete an Harvest
 */
exports.delete = function(req, res) {
  var harvest = req.harvest;

  harvest.remove(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(harvest);
    }
  });
};

/**
 * List of Harvests
 */
exports.list = function(req, res) {
  Harvest.find().sort('-created').populate('user', 'displayName').exec(function(err, harvests) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(harvests);
    }
  });
};

/**
 * Harvest middleware
 */
exports.harvestByID = function(req, res, next, id) {
  Harvest.findById(id).populate('user', 'displayName').exec(function(err, harvest) {
    if (err) return next(err);
    if (!harvest) return next(new Error('Failed to load Harvest ' + id));
    req.harvest = harvest;
    next();
  });
};

/**
 * Harvest authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.harvest.user.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};
