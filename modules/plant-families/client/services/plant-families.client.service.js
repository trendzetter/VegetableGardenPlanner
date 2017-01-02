(function () {
  'use strict';

  angular
    .module('plantfamilies.services')
    .factory('PlantFamilyService', PlantFamilyService);

  PlantFamilyService.$inject = ['$resource'];

  function PlantFamilyService($resource) {
    return $resource('/api/plant-families/:plantFamilyId', {
      plantFamilyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
