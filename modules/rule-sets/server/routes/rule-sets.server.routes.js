'use strict';

/**
 * Module dependencies
 */
var ruleSetsPolicy = require('../policies/rule-sets.server.policy'),
  rulesets = require('../controllers/rule-sets.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/rule-sets').all(ruleSetsPolicy.isAllowed)
    .get(rulesets.list)
    .post(rulesets.create);

  // Single ruleset routes
  app.route('/api/rule-sets/:ruleSetId').all(ruleSetsPolicy.isAllowed)
    .get(rulesets.read)
    .put(rulesets.update)
    .delete(rulesets.delete);

  // Finish by binding the ruleset middleware
  app.param('ruleSetId', rulesets.ruleSetByID);
};
