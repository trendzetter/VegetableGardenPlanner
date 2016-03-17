'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Garden = mongoose.model('Garden'),
  Gardenparts = mongoose.model('Gardenpart'),
  Plantings = mongoose.model('Planting'),
  PlantVarieties = mongoose.model('PlantVariety'),
  ObjectId = mongoose.Types.ObjectId,
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

var addParts = function(next, req) {
  var rightCornerLeft = req.garden.elemleft + req.garden.elemwidth;
  var bottomCornerTop = req.garden.elemtop + req.garden.elemheight;
  var plantBackUntil;
  console.log('req.params.plant:' + req.params.plant);
  if(req.params.plant !== undefined){
    var dateArray = req.params.selectedDate.split('-');
    plantBackUntil = dateArray[0]-6 + '-' + dateArray[1] + '-' + dateArray[2];
  }else{
    plantBackUntil = req.params.selectedDate;
  }
    console.log('plantBackUntil:' + plantBackUntil+req.params.plant);
  Gardenparts.find({
    $and: [{
      validFrom: {
        $lte: req.params.selectedDate
      }
    }, {
      garden: req.garden.bk
    }, {
      $or: [{
        'validTo': {
          $gt: req.params.selectedDate
        }
      }, {
        'validTo': null
      }]
    }, {
      $or: [
        //mogelijkheid 3
        {
          $and: [{
            'elemleft': {
              $gte: req.garden.elemleft
            }
          }, {
            'elemleft': {
              $lt: rightCornerLeft
            }
          }, {
            'elemtop': {
              $gte: req.garden.elemtop
            }
          }, {
            'elemtop': {
              $lt: bottomCornerTop
            }
          }]
        },
        //TODO top- and bottomcorner
        {
          $and: [{
            'elemleft': {
              $gte: req.garden.elemleft
            }
          }, {
            'elemleft': {
              $lt: rightCornerLeft
            }
          }, {
            'elemtop': {
              $gte: req.garden.elemtop
            }
          }, {
            'elemtop': {
              $lt: bottomCornerTop
            }
          }]
        }
      ]
    }]
  }).exec(function(err, parts) {
    if (err) return next(err);

    req.garden.gardenparts = parts;

    Plantings.find({
      $and: [{
        validFrom: {
          $lte: req.params.selectedDate
        }
      }, {
        garden: req.garden.bk
      }, {
        $or: [{
          'validTo': {
            $gt: plantBackUntil
          }
        }, {
          'validTo': null
        }]
      }, {
        $or: [
          //mogelijkheid 3
          {
            $and: [{
              'elemleft': {
                $gte: req.garden.elemleft
              }
            }, {
              'elemleft': {
                $lt: rightCornerLeft
              }
            }, {
              'elemtop': {
                $gte: req.garden.elemtop
              }
            }, {
              'elemtop': {
                $lt: bottomCornerTop
              }
            }]
          },
          //TODO top- and bottomcorner
          {
            $and: [{
              'elemleft': {
                $gte: req.garden.elemleft
              }
            }, {
              'elemleft': {
                $lt: rightCornerLeft
              }
            }, {
              'elemtop': {
                $gte: req.garden.elemtop
              }
            }, {
              'elemtop': {
                $lt: bottomCornerTop
              }
            }]
          }
        ]
      }]
    }).populate('plantVariety').exec(function(err, plantings) {
      if (err) return next(err);

      if(req.params.plant !== undefined){
        //put the past plantings in a seperate array for rotationadvice
        req.garden.pastplantings = [];
        var selectedDate = new Date(req.params.selectedDate);
        var index = 0;
        while(index<plantings.length){
          if(plantings[index].validTo < selectedDate){
            var plantingArray = plantings.splice(index,1);
            req.garden.pastplantings.push(plantingArray[0]);
          }else{
            index++;
          }
        }
        req.garden.plantings = plantings;

        //Add the selected plantVariety for rotationadvice
        PlantVarieties.findOne({'_id':req.params.plant}).exec(function(err, plantVariety) {
          req.garden.plantVariety = plantVariety;
          next();
        });
        console.log(req.garden.pastplantings);

      }else{
        req.garden.plantings = plantings;
        next();
      }
    });
  });
};

/**
 * Create a Garden
 */
exports.create = function(req, res) {
  var garden = new Garden(req.body);
  garden.bk = mongoose.Types.ObjectId();
  garden.user = req.user;
  garden.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  });
};

/**
 * Show the current Garden
 */
exports.read = function(req, res) {
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  req.garden.isAllowedEdit = req.user && req.garden.user && req.garden.user._id.toString() === req.user._id.toString() ? true : false;
  res.jsonp(req.garden);
};

/**
 * Update a Garden
 */
exports.update = function(req, res) {
  //Deze garden komt uit de database via de 'middleware'
  var garden = req.garden;
  var keepers = req.body.keepers;
    console.log('garden.keepers'+JSON.stringify(keepers));
  var oldvalid = req.garden.validFrom;
  var storevalid = oldvalid.getFullYear() + '-' + ('0' + (oldvalid.getMonth() + 1)).substr(-2) + '-' + ('0' + oldvalid.getDate()).substr(-2);
  garden.keepers = [];
  for (var i = 0; i < keepers.length; i++) {
    garden.keepers.push(mongoose.Types.ObjectId(keepers[i]));
  }
  //Set the access for all versions of the garden
  Garden.update({
    bk: garden.bk
  }, {
    '$set': {
      'keepers': garden.keepers,
      'ruleset': new ObjectId(req.body.ruleset)
    }
  }, {multi: true}, function(){
    console.log('keepers, ruleset success');
  },function(){
    console.log('keepers,ruleset failed');
  });

  //Hier worden de gegevens van de webservice toegevoegd
  garden = _.extend(garden, req.body);
  var newvalid = req.garden.validFrom;

  if (storevalid !== newvalid) {

    //  create a new version
    var validFrom = garden.validFrom;
    garden.user = req.garden.user._id; //Overschrijven van de user met de userid
    garden = new Garden(req.garden);
    garden.validFrom = validFrom;
    garden.created = new Date();
    garden._id = mongoose.Types.ObjectId();

    // We need to  update the validTo of the gardenversion with an earlier date (if existing) and the
    // validfrom of a gardenversion with a later date
    //Update a previous version
    Garden.findOne({
      validFrom: {
        $lt: req.params.selectedDate
      },
      bk: garden.bk
    }).sort({
      validFrom: -1
    }).exec(function(err, prevgarden) { // ,
      if (err) {
        console.log('err in garden.Server.controller: ' + err);
      }
      if (prevgarden !== null) {
        console.log('prevgarden' + prevgarden);
        prevgarden.validTo = garden.validFrom;
        prevgarden.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    Garden.findOne({
      validFrom: {
        $gt: req.params.selectedDate
      },
      bk: garden.bk
    }).sort({
      validFrom: 1
    }).exec(function(err, nextgarden) { // ,
      if (err) {
        console.log('err in garden.Server.controller: ' + err);
      }
      if (nextgarden !== null) {
        console.log('nextgarden' + nextgarden);
        garden.validTo = nextgarden.validFrom;
        garden.save();
      }
    });

    garden.save(function(err) {
      if (err) {
        console.log(err);
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(garden);
      }
    });
  } else {
    Garden.findOneAndUpdate({
      '_id': garden._id
    }, {
      '$set': {
        'elemtop': garden.elemtop,
        'elemleft': garden.elemleft,
        'elemwidth': garden.elemwidth,
        'elemheight': garden.elemheight
      }
    },
    function(err, garden) {
      if (err) {
        console.log(err);
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(garden);
      }
    });
  }
};

/**
 * Delete an Garden
 */
exports.delete = function(req, res) {
  var garden = req.garden;

  Plantings.remove({
    garden: req.garden.bk
  }, function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      Gardenparts.remove({
        garden: req.garden.bk
      }, function(err) {
        if (err) {
          return res.send(400, {
            message: getErrorMessage(err)
          });
        } else {
          Garden.remove({
            bk: req.garden.bk
          }, function(err) {
            if (err) {
              return res.send(400, {
                message: getErrorMessage(err)
              });
            } else {
              res.jsonp(garden);
            }
          });
        }
      });
    }
  });
};

/**
 * List of Gardens
 */
exports.list = function(req, res) {
  Garden.aggregate(
    // NEAT: match in array using new ObjectId !
    {
      $match: {
        $or: [{
          user: req.user._id
        }, {
          keepers: new ObjectId(req.user._id)
        }]
      }
    }, {
      $project: {
        bk: 1,
        created: 1,
        user: 1,
        name: 1,
        _id: 0
      }
    }, {
      $sort: {
        created: -1
      }
    }, {
      $group: {
        _id: '$bk',
        bk: {
          $first: '$bk'
        },
        name: {
          $first: '$name'
        },
        user: {
          $first: '$user'
        },
        created: {
          $min: '$created'
        }
      }
    },
    function(err, gardens) {
      Garden.populate(gardens, {
        path: 'user',
        select: 'displayName'
      }, function(err, result) {
        if (err) {
          return res.send(400, {
            message: err
          });
        } else {
          res.jsonp(result);
        }
      });
    }
  );
};

/**
 * List of Gardenversions
 */
exports.listversions = function(req, res) {
  Garden.find({
    user: req.user._id
  }).sort('-created').populate('user', 'displayName').exec(function(err, gardens) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(gardens);
    }
  });
};

/**
 * Garden middleware
 */
exports.gardenByID = function(req, res, next, id) {
  Garden.findById(id).populate('user', 'displayName username').populate('keepers', 'username').lean().exec(function(err, garden) {
    if (err) return next(err);
    if (!garden) return next(new Error('Failed to load Garden ' + id));
    req.garden = garden;
    addParts(next, req);
  });
};

exports.gardenByBK = function(req, res, next, bk) {
  Garden.findOne({
    validFrom: {
      $lte: req.params.selectedDate
    },
    bk: bk
  }).populate('user', 'displayName').sort('-validFrom').populate('keepers', 'username').lean().exec(function(err, garden) {
    if (err) return next(err);
    if (!garden) return next(new Error('Failed to load Garden ' + bk));
    req.garden = garden;
    addParts(next, req);
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
