'use strict';

/**
 * Module dependencies
 */
var cron = require('node-cron'),
  config = require('../../../../config/config'),
  path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  User = mongoose.model('User'),
  Notification = mongoose.model('Notification');
/**
 * Create a cron
 */
exports.invokeTask = function (req, res) {
        var task = cron.schedule('1-59/2 * * * * *', function() {
              console.log('You will see this message 2 secs from notificationscron');
              
            }, null, true, 'America/Los_Angeles');
};