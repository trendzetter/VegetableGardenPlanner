(function () {
  'use strict';

  angular
  .module('gardens.services')
  .factory('GardenpartsService', GardenpartsService);

  GardenpartsService.$inject = ['$resource', '$stateParams'];

  function GardenpartsService($resource, $stateParams) {
    return $resource('/api/gardenparts/:bk/:selectedDate', {
      bk: '@bk',
      selectedDate: $stateParams.selectedDate
    }, {
      createParts: {
        method: 'PUT',
        isArray: true
      },
      updateParts: {
        method: 'POST',
        isArray: true
      },
      deleteParts: {
        method: 'POST',
        url: 'api/gardenparts/delete/:bk/:selectedDate',
        isArray: true
      }
    });
  }
}());
