'use strict';

module.exports = function(app) {

var gardenpartPolicy = require('../policies/gardenpart.server.policy'),
    gardenpart = require('../controllers/gardenpart.server.controller');

    app.route('/api/gardenpart/:gardenpartbk/:selectedDate').all(gardenpartPolicy.isAllowed)
        .get(gardenpart.read)
        .put(gardenpart.update)
        .delete(gardenpart.delete);

    app.param('gardenpartbk', gardenpart.gardenpartByBK);
};
