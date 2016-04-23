'use strict';

// Rule sets service used to communicate Rule sets REST endpoints
angular.module('rule-sets.services').factory('RuleSetsService', ['$resource',
    function($resource) {
      return $resource('api/rule-sets/:ruleSetId', {
        ruleSetId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
]);
