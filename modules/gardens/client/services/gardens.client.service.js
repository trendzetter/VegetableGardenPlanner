(function() {
  'use strict';

  angular
    .module('gardens.services')
    .factory('GardensService', GardensService);

  GardensService.$inject = ['$resource', '$stateParams'];

  function GardensService($resource, $stateParams) {
    return $resource('api/gardens/:bk/:selectedDate/:plant', {
      bk: '@bk',
      selectedDate: $stateParams.selectedDate,
      plant: $stateParams.plant
    }, {
      update: {
        method: 'PUT'
      },
      getPlantGardens: {
        url: '/api/gardens/plant/:selectedDate/:plant',
        method: 'GET',
        isArray: true
      }
    });
  }
})();
