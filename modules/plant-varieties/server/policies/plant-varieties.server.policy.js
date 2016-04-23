'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke PlantVarieties Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['user'],
    allows: [{
      resources: '/api/plant-varieties',
      permissions: ['get', 'post']
    }, {
      resources: '/api/plant-varieties/group-by-crop/:doy',
      permissions: ['get']
    }, {
      resources: '/api/plant-varieties/get-crop/:cropId',
      permissions: ['get']
    }, {
      resources: '/api/plant-varieties/:plantVarietyId',
      permissions: ['get', 'put', 'delete']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/plant-varieties',
      permissions: ['get']
    }, {
      resources: '/api/plant-varieties/:plantVarietyId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If plantVariety Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an plantvariety is being processed and the current user created it then allow any manipulation
  if (req.plantVariety && req.user && req.plantVariety.user && req.plantVariety.user.id === req.user.id) {
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
