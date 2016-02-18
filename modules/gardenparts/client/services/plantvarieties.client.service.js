'use strict';

angular.module('gardenparts').factory('Plantvarieties', ['$resource',
  function($resource) {
    return $resource('api/plant-varieties/group-by-crop/:doy', {
      doy: '@doy'
    }, {
      get: {
        isArray: true
      }
    });
  }
]);
