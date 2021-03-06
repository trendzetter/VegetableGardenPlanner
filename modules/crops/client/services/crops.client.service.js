(function () {
  'use strict';

  angular
    .module('crops.services')
    .factory('CropsService', CropsService);

  CropsService.$inject = ['$resource'];

  function CropsService($resource) {
    return $resource('/api/crops/:cropId', {
      cropId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getFamily: {
      method: 'GET',
      url: '/api/crops/get-family/:familyId',
      isArray: true
      }
    });
  }
}());
