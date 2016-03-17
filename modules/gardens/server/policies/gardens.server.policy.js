'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Gardens Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/gardens',
      permissions: '*'
    }, {
      resources: '/api/gardens/:gardenId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/gardens',
      permissions: ['get', 'post']
    }, {
      resources: '/api/gardens/:gardenId',
      permissions: ['get']
    }, {
      resources: '/api/gardens/:bk/:selectedDate',
      permissions: ['get','put','delete']
    }, {
      resources: '/api/gardens/:bk/:selectedDate/:plant',
      permissions: ['get']
    }, {
      resources: '/api/gardens/plant/:selectedDate/:plant',
      permissions: ['get']
    }, {
      resources: '/api/gardenversions/:gardenId/:selectedDate',
      permissions: ['get','put']
    }, {
      resources: '/api/gardenparts/:bk/:selectedDate',
      permissions: ['put', 'post']
    }, {
      resources: '/api/gardenparts/delete/:bk/:selectedDate',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/gardens',
      permissions: ['get']
    }, {
      resources: '/api/gardens/:gardenId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Gardens Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an garden is being processed and the current user created it then allow any manipulation
  if (req.garden && req.user && req.garden.user && req.garden.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
