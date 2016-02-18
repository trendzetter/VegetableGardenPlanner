(function () {
  'use strict';

  angular
    .module('plant-varieties.services')
    .factory('PlantVarietiesService', PlantVarietiesService);

  PlantVarietiesService.$inject = ['$resource'];

  function PlantVarietiesService($resource) {
    return $resource('api/plant-varieties/:plantVarietyId', { plantVarietyId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
  }
})();
