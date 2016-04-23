'use strict';

/**
 * Module dependencies
 */
var gardensPolicy = require('../policies/gardens.server.policy'),
  gardens = require('../controllers/gardens.server.controller'),
  gardenparts = require('../controllers/gardenparts.server.controller');

module.exports = function(app) {

  // Gardens Routes
  app.route('/api/gardens').all(gardensPolicy.isAllowed)
    .get(gardens.list);

  app.route('/api/gardens').all(gardensPolicy.isAllowed)
    .post(gardens.create);

  app.route('/api/gardens/plant/:selectedDate/:plant').all(gardensPolicy.isAllowed)
      .get(gardens.list);

  app.route('/api/gardens/:selectedDate').all(gardensPolicy.isAllowed)
    .post(gardens.create);

  app.route('/api/gardens/:bk/:selectedDate').all(gardensPolicy.isAllowed)
    .get(gardens.read)
    .put(gardens.update)
    .delete(gardens.delete);

  app.route('/api/gardens/:bk/:selectedDate/:plant').all(gardensPolicy.isAllowed)
    .get(gardens.read);

  // Gardenversions Routes
  app.route('/api/gardenversions').all(gardensPolicy.isAllowed)
    .get(gardens.listversions);

  app.route('/api/gardenversions/:selectedDate').all(gardensPolicy.isAllowed)
    .post(gardens.create);

  app.route('/api/gardenversions/:gardenId/:selectedDate').all(gardensPolicy.isAllowed)
    .get(gardens.read)
    .put(gardens.update);

  app.route('/api/gardenversions/:gardenId').all(gardensPolicy.isAllowed)
    .put(gardens.update)
    .delete(gardens.delete);

  app.route('/api/gardenparts/:bk/:selectedDate').all(gardensPolicy.isAllowed)
    .put(gardenparts.create)
    .post(gardenparts.update);

  app.route('/api/gardenparts/delete/:bk/:selectedDate').all(gardensPolicy.isAllowed)
    .post(gardenparts.delete);

  // Finish by binding the Garden middleware
  app.param('gardenId', gardens.gardenByID);
  app.param('bk', gardens.gardenByBK);
};
