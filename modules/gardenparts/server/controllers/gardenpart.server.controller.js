'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Gardenpart = mongoose.model('Gardenpart'),
  Garden = mongoose.model('Garden'),
  Planting = mongoose.model('Planting'),
  PlantVariety = mongoose.model('PlantVariety'),
  RuleSet = mongoose.model('RuleSet'),
  CultivationPlan = mongoose.model('CultivationPlan'),
  _ = require('lodash');

var addPlantings = function(next, req) {
  console.log('Addplanings!' + req.gardenpart.garden);
  var dateArray = req.params.selectedDate.split('-');
  var plantBackUntil = (dateArray[0] - 6) + '-' + dateArray[1] + '-' + dateArray[2];
  var plantUntil = (dateArray[0] + 1) + '-' + dateArray[1] + '-' + dateArray[2];
  var rightCornerLeft = req.gardenpart.elemleft + req.gardenpart.elemwidth;
  var bottomCornerTop = req.gardenpart.elemtop + req.gardenpart.elemheight;
  Planting.find({
    $and: [{
      garden: req.gardenpart.garden
    },
      // Is planting valid?
      {
        $or: [{
          'validTo': {
            $gt: plantBackUntil
          }
        }, {
          'validTo': null
        }]
      }, {
        validFrom: {
          $lte: plantUntil
        }
      }, {
        $or: [
          // Is rightTopCorner in gardenpart?
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
          // Is leftTopCorner in gardenpart?
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
            // Is leftBottomCorner in gardenpart?
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
            // Is rightBottomCorner in gardenpart?
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
    req.gardenpart.pastplantings = [];
    req.gardenpart.futureplantings = [];
    var selectedDate = new Date(req.params.selectedDate);
    var index = 0;
    var retrievePlans = {};
    while (index < plantings.length) {
      var planting = plantings[index];
      if (planting.validTo <= selectedDate) {
            var plantingArray = plantings.splice(index, 1);
            req.gardenpart.pastplantings.push(plantingArray[0]);
          } else {
            //When planning new plantings we assume the existing which have passed maxGrowthDuration are now pastplantings
            if (planting.plantVariety.maxGrowthDuration && req.params.plant !== undefined) {
              var maxdate = new Date(planting.validFrom);
              maxdate.setDate(new Date(maxdate.getDate() + planting.plantVariety.maxGrowthDuration));
              console.log('maxdate =' + JSON.stringify(maxdate) + JSON.stringify(selectedDate));
              if (maxdate < selectedDate) {
                console.log('pushing to pastplantings');
                var plantingArray = plantings.splice(index, 1);
                req.gardenpart.pastplantings.push(plantingArray[0]);
              } else {
                //it's not a pastplanting
                if(typeof planting.cultivationPlanStep !== 'undefined'){
                  retrievePlans[planting.cultivationPlan] = true;
                }
                index++;
              }
            } else {
                //it's not a pastplanting              
                if(typeof planting.cultivationPlanStep !== 'undefined'){
                  retrievePlans[planting.cultivationPlan] = true;
                }
              index++;
            }

          }
    }
    //REtrieve the cultivationPlans and assign the images
    var planids = Object.keys(retrievePlans);
    CultivationPlan.find({ _id: { $in: planids } }, 'steps').exec(function(err, plans) {
      for(var i = 0; i < plantings.length; i++){
        var planting = plantings[i];
        if( typeof planting.cultivationPlanStep !== 'undefined' ){
          var count = 0;
          while(JSON.stringify(plans[count]._id) !== JSON.stringify(planting.cultivationPlan)){
            count++;
          }
          if(planting.orientation === 'vertical'){
            planting.icon = plans[count].steps[planting.cultivationPlanStep].iconVertical;
          }else{
            planting.icon = plans[count].steps[planting.cultivationPlanStep].icon;
          }
          console.log('planting '+planting);
        }
      }

      req.gardenpart.plantings = plantings;
      Garden.findOne({
        validFrom: {
          $lte: req.params.selectedDate
        },
        bk: req.gardenpart.garden
      }).exec(function(err, garden) {
        req.gardenpart.garden = garden;

        RuleSet.findOne({ '_id': garden.ruleset }).exec(function(err, ruleset) {
          req.gardenpart.ruleset = ruleset;
          
          if (req.params.plant !== undefined) {
            PlantVariety.findOne({ '_id': req.params.plant }).populate('crop', '_id name').exec(function(err, variety) {
              if (err) return next(err);
              if (!variety) return next(new Error('Failed to load plant plantVariety ' + req.params.plant));
              req.gardenpart.plant = variety;
              next();
            });
          } else {
            next();
          }
        });
      });
    
    });

    
  }).populate({
    path: 'plantVariety',
    model: 'PlantVariety'
/*	populate: {
    path:  'crop',
    model: 'Crop'
  }*/
  });
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
  var populate = [{ path: 'user', select: 'displayName' }];
  Gardenpart.findOne({
    validFrom: {
      $lte: req.params.selectedDate
    },
    validTo: {
      $gt: req.params.selectedDate
    },
    bk: gardenpartbk
  }).populate(populate).sort('-validFrom').lean().exec(function(err, gardenpart) {
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
