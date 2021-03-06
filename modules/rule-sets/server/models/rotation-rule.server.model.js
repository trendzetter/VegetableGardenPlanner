'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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

mongoose.model('RotationRule', RotationRuleSchema);
