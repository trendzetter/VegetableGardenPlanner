(function () {
  'use strict';

  angular
    .module('gardens.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Gardens state routing
    $stateProvider
    .state('listGardens', {
      url: '/gardens/list/:plant/:gardendate',
      templateUrl: 'modules/gardens/client/views/list-gardens.client.view.html',
      controller: 'GardensListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Gardens list'
      }
    }).
    state('listGardenversions', {
      url: '/gardenversions',
      templateUrl: 'modules/gardens/client/views/list-garden-versions.client.view.html'
    })
  /* .state('createGardens', {
      url: '/gardens/create',
      templateUrl: 'modules/gardens/client/views/create-garden.client.view.html'
    })*/
     .state('createGardens', {
      url: '/gardens/create',
      templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
      controller: 'GardensNgController',
      controllerAs: 'vm',
      resolve: {
        gardenResolve: newGarden
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle : 'Create garden'
      }
    })
    .state('viewGarden', {
      url: '/gardens/:bk/:selectedDate',
      templateUrl: 'modules/gardens/client/views/view-garden.client.view.html'
    }).
    state('plantGarden', {
      url: '/gardens/plant/:bk/:selectedDate/:plant',
      templateUrl: 'modules/gardens/client/views/view-garden.client.view.html'
    }).
    state('viewGardenversion', {
      url: '/gardenversion/:gardenId/:selectedDate',
      templateUrl: 'modules/gardens/client/views/view-gardenversion.client.view.html'
    }).
    state('editGarden', {
      url: '/gardens/:gardenId/edit/:selectedDate',
      templateUrl: 'modules/gardens/client/views/edit-garden.client.view.html'
    }).
    state('designGarden', {
      url: '/gardens/:gardenId/layout/:selectedDate',
      templateUrl: 'modules/gardens/client/views/layout-garden.client.view.html'
    });
  }

  newGarden.$inject = ['GardensService'];

  function newGarden(GardensService) {
    return new GardensService();
  }
})();
