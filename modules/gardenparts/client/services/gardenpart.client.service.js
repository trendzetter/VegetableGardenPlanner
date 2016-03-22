(function() {
  'use strict';

  angular
    .module('gardenparts.services')
    .factory('GardenpartService', GardenpartService);

  GardenpartService.$inject = ['$resource', '$stateParams'];

  function GardenpartService($resource, $stateParams) {
    return $resource('api/gardenpart/:bk/:selectedDate/:plant', {
      bk: '@bk',
      selectedDate: $stateParams.selectedDate
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
