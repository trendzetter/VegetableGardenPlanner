'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Gardenpart Schema
 */
var GardenpartSchema = new Schema({
  appVersion: {
    type: String,
    default: GLOBAL.version
  },
  bk: {
    type: String,
    required: 'BK is missing for gardenpart'
  },
  type: {
    type: String
  },
  elemwidth: {
    type: Number,
    default: '0'
  },
  elemheight: {
    type: Number,
    default: '0'
  },
  elemtop: {
    type: Number,
    default: '0'
  },
  elemleft: {
    type: Number,
    default: '0'
  },
  created: {
    type: Date,
    default: Date.now
  },
  garden: {
    type: Schema.ObjectId,
    ref: 'Garden'
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date
  }
});

mongoose.model('Gardenpart', GardenpartSchema);
