(function () {
  'use strict';

  angular
    .module('gardens.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('gardens', {
        abstract: true,
        url: '/gardens',
        template: '<ui-view/>'
      })
      .state('gardens.list', {
        url: '',
        templateUrl: 'modules/gardens/client/views/list-gardens.client.view.html',
        controller: 'GardensListController',
        controllerAs: 'vm'
      })
      .state('gardens.create', {
        url: '/create',
        templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gardens.edit', {
        url: '/:gardenId/edit',
        templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: getGarden
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gardens.view', {
        url: '/:gardenId',
        templateUrl: 'modules/gardens/client/views/view-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: getGarden
        }
      });
  }

  getGarden.$inject = ['$stateParams', 'GardensService'];

  function getGarden($stateParams, GardensService) {
    return GardensService.get({
      gardenId: $stateParams.gardenId
    }).$promise;
  }

  newGarden.$inject = ['GardensService'];

  function newGarden(GardensService) {
    return new GardensService();
  }
})();
