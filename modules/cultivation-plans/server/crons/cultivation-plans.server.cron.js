'use strict';

/**
 * Module dependencies
 */
var cron = require('node-cron');
/**
 * Create a cron
 */
exports.invokeTask = function (req, res) {
        var task = cron.schedule('1-59/2 * * * * *', function() {
              console.log('You will see this message 2 secs from cultivationplanscron');
              
            }, null, true, 'America/Los_Angeles');
};