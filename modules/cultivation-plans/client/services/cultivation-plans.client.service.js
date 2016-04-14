(function () {
  'use strict';

  angular
    .module('cultivation-plans.services')
    .factory('CultivationPlansService', CultivationPlansService);

  CultivationPlansService.$inject = ['$resource'];

  function CultivationPlansService($resource) {
    return $resource('api/cultivation-plans/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
