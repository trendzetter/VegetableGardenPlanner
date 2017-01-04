'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  task: {
    type: Schema.ObjectId,
    ref: 'Task'
  },
  read: {
    type: Boolean
  },
  sendEmail: {
    type: Boolean
  }
});

mongoose.model('Message', MessageSchema);
