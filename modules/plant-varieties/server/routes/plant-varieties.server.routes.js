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

  app.route('/api/plant-varieties/:plantVarietyId').all(plantVarietiesPolicy.isAllowed)
    .get(plantVarieties.read)
    .put(plantVarieties.update)
    .delete(plantVarieties.delete);

  // Finish by binding the Plant variety middleware
  app.param('plantVarietyId', plantVarieties.plantVarietyByID);

};
