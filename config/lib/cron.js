'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require('../config');
  //cron = require('node-cron');
/**
 * Create a cron
 */
exports.create = function (req, res) {
  // Globbing cron files
  config.files.server.crons.forEach(function (cronPath) {
    require(path.resolve(cronPath)).invokeTask();
  });
       /* var task = cron.schedule('1-59/2 * * * * *', function() {
              console.log('You will see this message 2 seconds'+JSON.stringify(config.files.server.crons));
              
            }, null, true, 'America/Los_Angeles');*/
};
