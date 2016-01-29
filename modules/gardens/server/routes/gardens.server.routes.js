'use strict';

/**
 * Module dependencies
 */
var gardensPolicy = require('../policies/gardens.server.policy'),
  gardens = require('../controllers/gardens.server.controller');

module.exports = function (app) {
  // Gardens collection routes
  app.route('/api/gardens').all(gardensPolicy.isAllowed)
    .get(gardens.list)
    .post(gardens.create);

  // Single garden routes
  app.route('/api/gardens/:gardenId').all(gardensPolicy.isAllowed)
    .get(gardens.read)
    .put(gardens.update)
    .delete(gardens.delete);

  // Finish by binding the garden middleware
  app.param('gardenId', gardens.gardenByID);
};
