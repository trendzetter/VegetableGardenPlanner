'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CropgroupSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill Cropgroup name',
    trim: true
  },
  crops: [{
    type: Schema.ObjectId,
    ref: 'Crop'
  }]
});
mongoose.model('Cropgroup', CropgroupSchema);
/**
 * Rotation rule Schema
 */
var RotationRuleSchema = new Schema({
  ruletype: {
    type: String,
    enum: ['SuccessiveCrop', 'YearsBetweenCultivation']
  },
  cropgroup: {
    type: Schema.ObjectId,
    ref: 'Cropgroup'
  },
  yearsBetween: {
    // =1 or more when the ruletype is YearsbetweenCultivation
    // or 1 when the ruletype is succesive crop and it
    // isn't a good successor and 0 when it is a good successor
    type: 'Number'
  },
  previousCropgroup: {
    type: Schema.ObjectId,
    ref: 'Cropgroup'
  }
});

/**
 * Rule set Schema
 */
var RuleSetSchema = new Schema({
  appVersion: {
    type: String,
    default: GLOBAL.version
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Rule set name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  cropgroups: {
    type: [CropgroupSchema]
  },
  rotationrules: {
    type: [RotationRuleSchema]
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('RuleSet', RuleSetSchema);
