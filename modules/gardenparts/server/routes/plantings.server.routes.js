'use strict';

module.exports = function(app) {

  var plantingsPolicy = require('../policies/plantings.server.policy'),
    plantings = require('../controllers/plantings.server.controller');

  app.route('/api/plantings/:bk/:selectedDate').all(plantingsPolicy.isAllowed)
    //bk >> the gardenbk
    .put(plantings.create)
    .post(plantings.delete);
};
