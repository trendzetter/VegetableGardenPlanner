'use strict';

/**
 * Module dependencies
 */
var cultivationPlansPolicy = require('../policies/cultivation-plans.server.policy'),
  cultivationPlans = require('../controllers/cultivation-plans.server.controller');

module.exports = function (app) {
  // cultivationPlan collection routes
  app.route('/api/cultivation-plans').all(cultivationPlansPolicy.isAllowed)
    .get(cultivationPlans.list)
    .post(cultivationPlans.create);

  app.route('/api/cultivation-plans/plantvariety/:plantvarietyId').all(cultivationPlansPolicy.isAllowed)
    .get(cultivationPlans.getByVariety);

  // Single cultivationPlan routes
  app.route('/api/cultivation-plans/:cultivationPlanId').all(cultivationPlansPolicy.isAllowed)
    .get(cultivationPlans.read)
    .put(cultivationPlans.update)
    .delete(cultivationPlans.delete);

  // Finish by binding the cultivationPlan middleware
  app.param('cultivationPlanId', cultivationPlans.cultivationPlanByID);
};
