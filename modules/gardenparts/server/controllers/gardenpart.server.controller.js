'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Gardenpart = mongoose.model('Gardenpart'),
  Planting = mongoose.model('Planting'),
  PlantVariety = mongoose.model('PlantVariety'),
  _ = require('lodash');

var addPlantings = function(next, req) {
  console.log('Addplanings!' + req.gardenpart.garden);
  var rightCornerLeft = req.gardenpart.elemleft + req.gardenpart.elemwidth;
  var bottomCornerTop = req.gardenpart.elemtop + req.gardenpart.elemheight;
  Planting.find({
    $and: [{
      garden: req.gardenpart.garden
    },
      //Is planting valid?
      {
        $or: [{
          'validTo': {
            $gt: req.params.selectedDate
          }
        }, {
          'validTo': null
        }]
      }, {
        validFrom: {
          $lte: req.params.selectedDate
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
                $gt: req.gardenpart.elemleft
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
                $gt: req.gardenpart.elemleft
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
    req.gardenpart.plantings = plantings;
    console.log('gardenpart plantings: ' + req.gardenpart.plantings);

    if(req.params.plant !== undefined){
      PlantVariety.findOne({'_id':req.params.plant}).populate('crop','_id name').exec(function(err, variety) {
        if (err) return next(err);
        if (!variety) return next(new Error('Failed to load plant plantVariety ' + req.params.plant));
        req.gardenpart.plant = variety;
        next();
      });
    }else{
      next();
    }

  }).populate('plantVariety');
};

/**
 * Create a Gardenpart
 */
exports.create = function(req, res) {

};

/**
 * Show the current Gardenpart
 */
exports.read = function(req, res) {
  var gardenpart = req.gardenpart;
  res.jsonp(gardenpart);
};

/**
 * Update a Gardenpart
 */
exports.update = function(req, res) {

};

/**
 * Delete an Gardenpart
 */
exports.delete = function(req, res) {

};

/**
 * List of Gardenparts
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
    addPlantings(next, req);
  });
};

/**
 * Garden authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.gardenpart.user.id !== req.user.id && req.gardenpart.user._id.toString() !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};
