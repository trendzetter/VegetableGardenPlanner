'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
  
var CultivationStepSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill Cropgroup name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  icon: {
    type: String,
    required: 'Please select an icon'
  },
  duration: {
    type: Number,
    required: 'Please indicated the duration'
  },
  inplace: {
    type: Boolean
  }
});
mongoose.model('CultivationStep', CultivationStepSchema);


/**
 * CultivationPlan Schema
 */
var CultivationPlanSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  crop: {
    type: Schema.ObjectId,
    ref: 'Crop'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  steps: {
    type: [CultivationStepSchema],
    required: 'You need at least 1 step'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('CultivationPlan', CultivationPlanSchema);
