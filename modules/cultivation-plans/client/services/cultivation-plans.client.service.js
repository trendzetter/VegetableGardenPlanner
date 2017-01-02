(function () {
  'use strict';

  angular
    .module('cultivation-plans.services')
    .factory('CultivationPlansService', CultivationPlansService);

  CultivationPlansService.$inject = ['$resource'];

  function CultivationPlansService($resource) {
    return $resource('/api/cultivation-plans/:cultivationPlanId', {
      cultivationPlanId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getByVariety:{
        method: 'GET',
        url: '/api/cultivation-plans/plantvariety/:varietyId',
        isArray: 'true'
      }
    });
  }
}());
