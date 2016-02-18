'use strict';

angular.module('gardenparts.services').factory('PastPlantings', ['$resource', '$stateParams',
  function($resource, $stateParams) {
    return $resource('api/past-plantings/:bk/:selectedDate', {
      bk: '@bk',
      selectedDate: $stateParams.selectedDate
    }, {
      get: {
        isArray: true
      }
    });
  }
]);
