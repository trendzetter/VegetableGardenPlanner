(function () {
  'use strict';

  angular
    .module('gardens.services')
    .factory('GardensService', GardensService);

  GardensService.$inject = ['$resource'];

  function GardensService($resource) {
    return $resource('api/gardens/:gardenId', {
      gardenId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
