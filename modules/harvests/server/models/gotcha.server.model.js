'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Gotcha Schema
 */
var GotchaSchema = new Schema({
  appVersion: {
    type: String,
    default: GLOBAL.version
  },
  text: {
    type: String
  },
  starred: {
    type: Number,
    default: 1
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
    ref: 'Crop'
  },
  plantvariety: {
    type: Schema.ObjectId,
    ref: 'PlantVariety'
  }
});

mongoose.model('Gotcha', GotchaSchema);
