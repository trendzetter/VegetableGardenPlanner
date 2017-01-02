'use strict';

/* *
 * Module dependencies.
 */
var mongoose = require('mongoose'),
//  Garden = mongoose.model('Garden'),
  Planting = mongoose.model('Planting'),
  Task = mongoose.model('Task'),
  user,
  _ = require('lodash');

/* *
 * Get the error message from error object
 */
/* var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Planting already exists';
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
  console.log('err in errorhandler plantings' + err);
  return err;
};*/

/* *
 * Create Plantings
 */
/* exports.create = function(req, res) {
  var plantings = req.body;
//  var resplantings = [];
  for (var index = 0; index < plantings.length; ++index) {
    var planting = new Planting(plantings[index]);
    planting.rightCornerLeft = planting.elemleft + planting.elemwidth;
    planting.bottomCornerTop = planting.elemtop + planting.elemheight;
    planting.bk = mongoose.Types.ObjectId();
    planting.save();
//    resplantings.push(planting);
  }
  return res.jsonp('');
};*/

/* *
 * Update Plantings
 * Saves the changes from within the gardenpart view
 */
exports.update = function(req, res) {
  user = req.user;
  var plantings = req.body.newplantings;
  for (var index = 0; index < plantings.length; ++index) {
    var planting = new Planting(plantings[index]);
    planting.rightCornerLeft = planting.elemleft + planting.elemwidth;
    planting.bottomCornerTop = planting.elemtop + planting.elemheight;
    planting.bk = new mongoose.Types.ObjectId();
    if (typeof planting.cultivationPlan != 'undefined') {
      createTask(planting);
    }
    planting.save();
  }

  var plantingids = req.body.cancelplantings;
  Planting.remove({
    _id: {
      '$in': plantingids
    }
  }, function() {
    res.jsonp();
  });

  var changedPlans = req.body.changedPlans;
  console.log("changedPlans" + JSON.stringify(changedPlans));
  for (var plantingid in changedPlans) {
    Planting.findOneAndUpdate({ _id: plantingid }, { $set: { cultivationPlan: changedPlans[plantingid], cultivationPlanStep: 0 } }, { new: true }, populateAndCreateTask);
  }
};

function populateAndCreateTask(err, planting) {
  if (err) {
          console.log('Something wrong when updating data!' + err);
        }

  console.log('plantingcultivationplan update: ' + JSON.stringify(planting) + '\n user:' + JSON.stringify(user));

  Planting.populate(planting, {
          path: 'cultivationPlan',
          select: 'steps'
        }, function(err, planting) {
            console.log('plantingcultivationplan update: ' + JSON.stringify(planting));
            createTask(planting);
          });
}

function createTask(planting) {
  var task = new Task();
  task.user = user;
  task.garden = planting.garden;
  task.planting = planting._id;
  task.cultivationPlan = planting.cultivationPlan;
  task.validFrom = planting.validFrom;
  task.save();
}
/* *
 * Show the current Planting
 */
/* exports.read = function(req, res) {

};*/

/* *
 * Update Plantings
 */
/* exports.update = function(req, res) {
  var plantings = req.body;
  var updateOld = function(err, planting) {
    planting.validTo = req.params.selectedDate;
    planting.save();
  };
  // loop door de plantings van gardenpart en bewaar
  for (var index = 0; index < plantings.length; ++index) {
    var planting = plantings[index];

    var newplanting = new Planting(planting);
    newplanting.validFrom = req.params.selectedDate;
    newplanting._id = mongoose.Types.ObjectId();
    newplanting.save();
    Planting.findById(planting._id, updateOld);
  }
  res.jsonp(plantings);
};*/

/* *
 * Delete an Planting
 */
/* exports.delete = function(req, res) {
  var plantingids = req.body;
  Planting.remove({
    _id: {
      '$in': plantingids
    }
  }, function() {
    res.jsonp();
  });
};*/

/* *
 * List of Plantings
 */
/* exports.list = function(req, res) {

};

exports.gardenByBK = function(req, res, next, gardenbk) {
  Garden.findOne({
    validFrom: {
      $lte: req.params.selectedDate
    },
    bk: gardenbk
  }).populate('user', 'displayName').sort('-validFrom').exec(function(err, garden) {
    if (err) return next(err);
    if (!garden) return next(new Error('Failed to load Garden ' + gardenbk));
    req.garden = garden;
    next();
  });
};*/

/* *
 * Garden authorization middleware
 */
/* exports.hasAuthorization = function(req, res, next) {
  if (req.garden.user.id !== req.user.id && req.garden.user._id.toString() !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};*/
