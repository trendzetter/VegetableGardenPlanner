'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  garden: {
    type: Schema.ObjectId,
    ref: 'Garden'
  },
  planting: {
    type: Schema.ObjectId,
    ref: 'Planting'
  },
  status: {
    type: String,
    enum: ['NEW','PENDING','FINISHED','UNKNOWN'],
    default: 'NEW'
  },
  cultivationPlan: {
    type: Schema.ObjectId,
    ref: 'CultivationPlan'
  },
  step: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date
  },
  assignedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  assignmentMessage: {
    type: String
  }
});

mongoose.model('Task', TaskSchema);
