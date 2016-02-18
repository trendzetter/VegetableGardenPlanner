'use strict';

module.exports = function(app) {

  var pastplantingsPolicy = require('../policies/past-plantings.server.policy'),
    pastplantings = require('../controllers/past-plantings.server.controller');

  app.route('/api/past-plantings/:gardenpart/:selectedDate').all(pastplantingsPolicy.isAllowed)
    .get(pastplantings.read);

  app.param('gardenpart', pastplantings.gardenpartByBK);
};
