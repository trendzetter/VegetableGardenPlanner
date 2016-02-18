'use strict';

angular.module('gardenparts').factory('Plantings', ['$resource',
  function($resource) {
    return $resource('api/plantings/:bk/:selectedDate', {
      selectedDate: '@selectedDate',
      bk: '@bk' //gardenId: '@_id',
    }, {
      createPlantings: {
        method: 'PUT',
        isArray: true
      },
      cancelPlantings: {
        method: 'POST',
        isArray: true
      }
    });
  }
]);
