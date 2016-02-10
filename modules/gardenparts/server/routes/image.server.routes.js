'use strict';

var imagePolicy = require('../policies/image.server.policy'),
    image = require('../controllers/image.server.controller');


module.exports = function(app) {
    app.route('/api/image/:width/:height/:orientation').all(imagePolicy.isAllowed)
        .get(image.read);
};
