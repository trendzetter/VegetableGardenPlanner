'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	RuleSet = mongoose.model('RuleSet'),
    RotationRule = mongoose.model('RotationRule'),
		Cropgroup = mongoose.model('Cropgroup'),
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
				message = 'Rule set already exists';
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

/**
 * Create a Rule set
 */
exports.create = function(req, res) {
	var ruleSet = new RuleSet(req.body);
	ruleSet.user = req.user;
	var cropgroups = ruleSet.cropgroups;
	var rules = req.body.rotationrules;
	for(var i = 0;i<cropgroups.length;i++){
		var refs = [];
		var cropgroup = cropgroups[i];
		for(var j=0;j<cropgroup.crops.length;j++){
			var ref = mongoose.Types.ObjectId(cropgroup.crops[j]);
			refs.push(ref);
		}
		cropgroup.crops = refs;
		cropgroup.save();
		for(var k=0;k<rules.length;k++){
			var rule = rules[k];
			if(rule.cropgroup.name === cropgroup.name){
				rule.cropgroup = mongoose.Types.ObjectId(cropgroup._id);
			}
			if(rule.previousCropgroup.name === cropgroup.name){
				rule.previousCropgroup = mongoose.Types.ObjectId(cropgroup._id);
			}
		}
	}
	ruleSet.rotationrules = rules;
	console.log('ruleset:' +ruleSet);
	console.log('body: '+req.body.cropgroup);
	ruleSet.save(function(err) {
		if (err) {
							console.log(err);
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            res.jsonp(ruleSet);
		}
	});
};

/**
 * Show the current Rule set
 */
exports.read = function(req, res) {
        res.jsonp(req.ruleSet);
};

/**
 * Update a Rule set
 */
exports.update = function(req, res) {
	var ruleSet = req.ruleSet ;

	ruleSet = _.extend(ruleSet , req.body);

	ruleSet.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ruleSet);
		}
	});
};

/**
 * Delete an Rule set
 */
exports.delete = function(req, res) {
	var ruleSet = req.ruleSet ;

	ruleSet.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ruleSet);
		}
	});
};

/**
 * List of Rule sets
 */
exports.list = function(req, res) { RuleSet.find().sort('-created').populate('user', 'displayName').exec(function(err, ruleSets) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ruleSets);
		}
	});
};

/**
 * Rule set middleware
 */
exports.ruleSetByID = function(req, res, next, id) { RuleSet.findById(id).populate('user', 'displayName').populate('rotationrules').exec(function(err, ruleSet) {
		Cropgroup.populate(ruleSet,{
						path:'cropgroups.crops',
						model: 'Crop',
						select: 'name'
				},function(err,ruleSet){
			if (err) return next(err);
			if (! ruleSet) return next(new Error('Failed to load Rule set ' + id));
			req.ruleSet = ruleSet ;
			next();
		});
	});
};

/**
 * Rule set authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ruleSet.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
