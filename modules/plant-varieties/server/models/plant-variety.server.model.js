'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Plant variety Schema
 */
var PlantVarietySchema = new Schema({
  appVersion: {
    type: String,
    default: GLOBAL.version
  },
  name: {
    type: String,
    required: 'Please fill Plant variety name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  crop: {
    type: Schema.ObjectId,
    ref: 'Crop',
    required: 'Please select a crop'
  },
  DOYstartSow: {
    type: Number
  },
  DOYendSow: {
    type: Number
  },
  minGrowthDuration: {
    type: Number
  },
  maxGrowthDuration: {
    type: Number
  },
  cmInRow: {
    type: Number
  },
  cmBetweenRow: {
    type: Number
  },
  image: {
    type: String,
    required: 'Please select an image'
  }
});

mongoose.model('PlantVariety', PlantVarietySchema);
