'use strict';

module.exports = function(app) {
  var harvestsPolicy = require('../policies/harvests.server.policy'),
    harvests = require('../controllers/harvests.server.controller');

  // Harvests Routes
  app.route('/api/harvests').all(harvestsPolicy.isAllowed)
    .get(harvests.list)
    .post(harvests.create);

  app.route('/api/harvests/:harvestId').all(harvestsPolicy.isAllowed)
    .get(harvests.read)
    .put(harvests.update)
    .delete(harvests.delete);

  // Finish by binding the Harvest middleware
  app.param('harvestId', harvests.harvestByID);
};
