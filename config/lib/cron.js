'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require('../config');
/**
 * Create a cron
 */
exports.create = function (req, res) {
  // Globbing cron files
  config.files.server.crons.forEach(function (cronPath) {
    require(path.resolve(cronPath)).invokeTask();
  });
};
