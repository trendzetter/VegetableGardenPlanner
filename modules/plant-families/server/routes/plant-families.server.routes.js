'use strict';

/**
 * Module dependencies
 */
var plantFamiliesPolicy = require('../policies/plant-families.server.policy'),
  plantfamilies = require('../controllers/plant-families.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/plant-families').all(plantFamiliesPolicy.isAllowed)
    .get(plantfamilies.list)
    .post(plantfamilies.create);

  // Single plantfamily routes
  app.route('/api/plant-families/:plantFamilyId').all(plantFamiliesPolicy.isAllowed)
    .get(plantfamilies.read)
    .put(plantfamilies.update)
    .delete(plantfamilies.delete);

  // Finish by binding the plantfamily middleware
  app.param('plantFamilyId', plantfamilies.plantFamilyByID);
};
