'use strict';

/**
 * Module dependencies
 */
var plantVarietiesPolicy = require('../policies/plant-varieties.server.policy'),
  plantVarieties = require('../controllers/plant-varieties.server.controller');

module.exports = function(app) {
  // Plant varieties Routes
  app.route('/api/plant-varieties').all(plantVarietiesPolicy.isAllowed)
    .get(plantVarieties.list)
    .post(plantVarieties.create);

  app.route('/api/plant-varieties/group-by-crop/:doy').all(plantVarietiesPolicy.isAllowed)
    .get(plantVarieties.groupByCrop);

  app.route('/api/plant-varieties/get-crop/:cropId').all(plantVarietiesPolicy.isAllowed)
    .get(plantVarieties.getCrop);

  app.route('/api/plant-varieties/:plantVarietyId').all(plantVarietiesPolicy.isAllowed)
    .get(plantVarieties.read)
    .put(plantVarieties.update)
    .delete(plantVarieties.delete);

  // Bypassing the middleware
  app.route('/api/plant-varieties/with-crop/:varietyId').all(plantVarietiesPolicy.isAllowed)
    .get(plantVarieties.read)

  // Finish by binding the Plant variety middleware
  app.param('plantVarietyId', plantVarieties.plantVarietyByID);

    // Finish by binding the Plant variety middleware
  app.param('varietyId', plantVarieties.varietyWithCrop);

};
