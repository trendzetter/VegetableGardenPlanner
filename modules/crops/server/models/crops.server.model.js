'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Crop Schema
 */
var CropSchema = new Schema({
  appVersion: {
    type: String,
    default: GLOBAL.version
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Plant family name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  plantfamily: {
    type: Schema.ObjectId,
    ref: 'PlantFamily',
    required: 'Please select a plant family'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Crop', CropSchema);
