'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Planting Schema
 */

var PlantingSchema = new Schema({
  appVersion: {
    type: String,
    default: GLOBAL.version
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  plantVariety: {
    type: Schema.ObjectId,
    ref: 'PlantVariety',
    required: 'Please select a plant variety'
  },
  cultivationPlan: {
    type: Schema.ObjectId,
    ref: 'cultivationPlan'
  },
  harvest: {
    type: Schema.ObjectId,
    ref: 'Harvest'
  },
  cmInRow: {
    type: Number
  },
  cmBetweenRow: {
    type: Number
  },
  elemwidth: {
    type: Number
  },
  elemheight: {
    type: Number
  },
  elemtop: {
    type: Number
  },
  elemleft: {
    type: Number
  },
  orientation: {
    type: String
  },
  garden: {
    type: Schema.ObjectId,
    ref: 'Garden'
  },
  validFrom: {
    type: Date
  },
  validTo: {
    type: Date
  },
  bottomCornerTop: {
    type: Number
  },
  rightCornerLeft: {
    type: Number
  }
});

mongoose.model('Planting', PlantingSchema);
