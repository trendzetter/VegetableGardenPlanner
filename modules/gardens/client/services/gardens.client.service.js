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
      plant: '@plant'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
