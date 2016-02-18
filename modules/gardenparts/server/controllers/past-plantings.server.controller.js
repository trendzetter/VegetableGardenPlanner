'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Gardenpart = mongoose.model('Gardenpart'),
  Planting = mongoose.model('Planting'),
  _ = require('lodash');

var addPastPlantings = function(next, req) {
  console.log('Addplanings!' + req.gardenpart.garden);
  var rightCornerLeft = req.gardenpart.elemleft + req.gardenpart.elemwidth;
  var bottomCornerTop = req.gardenpart.elemtop + req.gardenpart.elemheight;
  var minSixYears = new Date(req.params.selectedDate);
  console.log('minSixYears.getFullYear' + minSixYears.getFullYear());
  minSixYears.setFullYear(minSixYears.getFullYear() - 6);
  console.log('minSixYears' + minSixYears);
  Planting.find({
    $and: [{
      garden: req.gardenpart.garden
    },
      //Is planting valid?
      {
        'validTo': {
          $lte: req.params.selectedDate
        }
      }, {
        validFrom: {
          $gte: minSixYears
        }
      }, {
        $or: [
          //Is rightTopCorner in gardenpart?
          {
            $and: [{
              'elemleft': {
                $gte: req.gardenpart.elemleft
              }
            }, {
              'elemleft': {
                $lt: rightCornerLeft
              }
            }, {
              'elemtop': {
                $gte: req.gardenpart.elemtop
              }
            }, {
              'elemtop': {
                $lt: bottomCornerTop
              }
            }]
          },
            //Is leftTopCorner in gardenpart?
          {
            $and: [{
              'rightCornerLeft': {
                $gte: req.gardenpart.elemleft
              }
            }, {
              'rightCornerLeft': {
                $lt: rightCornerLeft
              }
            }, {
              'elemtop': {
                $gte: req.gardenpart.elemtop
              }
            }, {
              'elemtop': {
                $lt: bottomCornerTop
              }
            }]
          },
          //Is leftBottomCorner in gardenpart?
          {
            $and: [{
              'elemleft': {
                $gte: req.gardenpart.elemleft
              }
            }, {
              'elemleft': {
                $lt: rightCornerLeft
              }
            }, {
              'bottomCornerTop': {
                $gte: req.gardenpart.elemtop
              }
            }, {
              'bottomCornerTop': {
                $lt: bottomCornerTop
              }
            }]
          },
          //Is rightBottomCorner in gardenpart?
          {
            $and: [{
              'rightCornerLeft': {
                $gte: req.gardenpart.elemleft
              }
            }, {
              'rightCornerLeft': {
                $lt: rightCornerLeft
              }
            }, {
              'bottomCornerTop': {
                $gte: req.gardenpart.elemtop
              }
            }, {
              'bottomCornerTop': {
                $lt: bottomCornerTop
              }
            }]
          }
        ]
      }
    ]
  },
  function(err, plantings) {
    if (err) return next(err);
    req.plantings = plantings;
    console.log('gardenpart plantings: ' + req.gardenpart.plantings);
    next();
  }).populate('plantVariety');
};

/**
 * Create a Past planting
 */
exports.create = function(req, res) {

};

/**
 * Show the current Past planting
 */
exports.read = function(req, res) {
  var plantings = req.plantings;
  res.jsonp(plantings);
};

/**
 * Update a Past planting
 */
exports.update = function(req, res) {

};

/**
 * Delete an Past planting
 */
exports.delete = function(req, res) {

};

/**
 * List of Past plantings
 */
exports.list = function(req, res) {

};

exports.gardenpartByBK = function(req, res, next, gardenpartbk) {
  Gardenpart.findOne({
    validFrom: {
      $lte: req.params.selectedDate
    },
    validTo: {
      $gt: req.params.selectedDate
    },
    bk: gardenpartbk
  }).populate('user', 'displayName').sort('-validFrom').lean().exec(function(err, gardenpart) {
    if (err) return next(err);
    if (!gardenpart) return next(new Error('Failed to load Gardenpart ' + gardenpartbk));
    req.gardenpart = gardenpart;
    addPastPlantings(next, req);
  });
};
