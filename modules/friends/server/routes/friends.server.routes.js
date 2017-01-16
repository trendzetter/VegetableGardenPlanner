'use strict';

/**
 * Module dependencies
 */
var friendsPolicy = require('../policies/friends.server.policy'),
  friends = require('../controllers/friends.server.controller');

module.exports = function (app) {
  // Friends collection routes
  app.route('/api/friends').all(friendsPolicy.isAllowed)
    .get(friends.list)
    .post(friends.create);

  // Single friend routes
  app.route('/api/friends/:friendId').all(friendsPolicy.isAllowed)
    .get(friends.read)
    .put(friends.update)
    .delete(friends.delete);

  // Finish by binding the friend middleware
  app.param('friendId', friends.friendByID);
};
