'use strict';

/**
 * Module dependencies
 */
var cropsPolicy = require('../policies/crops.server.policy'),
  crops = require('../controllers/crops.server.controller');

module.exports = function (app) {
  // Crops collection routes
  app.route('/api/crops').all(cropsPolicy.isAllowed)
    .get(crops.list)
    .post(crops.create);

  // Single crop routes
  app.route('/api/crops/:cropId').all(cropsPolicy.isAllowed)
    .get(crops.read)
    .put(crops.update)
    .delete(crops.delete);

  // Finish by binding the crop middleware
  app.param('cropId', crops.cropByID);
};
