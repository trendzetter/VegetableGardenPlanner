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
      url: '/gardens/list/:plant/:selectedDate',
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
     .state('createGarden', {
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
      templateUrl: 'modules/gardens/client/views/view-garden.client.view.html',
      controller: 'GardensNgController',
      controllerAs: 'vm',
      resolve: {
        gardenResolve: getGarden
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle : 'View garden'
      }
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
      url: '/gardens/:bk/edit/:selectedDate',
      templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
      controller: 'GardensNgController',
      controllerAs: 'vm',
      resolve: {
        gardenResolve: getGarden
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle : 'Edit garden'
      }
    }).
    state('designGarden', {
      url: '/gardens/:gardenId/layout/:selectedDate',
      templateUrl: 'modules/gardens/client/views/layout-garden.client.view.html'
    });
  }

  getGarden.$inject = ['$stateParams', 'GardensService'];

  function getGarden($stateParams, GardensService) {
    var garden = GardensService.get({
      bk: $stateParams.bk,
      selectedDate: $stateParams.selectedDate//,
    //  plant: $stateParams.plant
  });
    garden.$promise.then(function(garden) {
      var gardenparts = garden.gardenparts;
      //convert position to relative for all gardenparts
      var gardentop = parseInt(garden.elemtop);
      var gardenleft = parseInt(garden.elemleft);
      for (var i = 0; i < gardenparts.length; i++) {
        gardenparts[i].elemtop = parseInt(gardenparts[i].elemtop) - gardentop;
        gardenparts[i].elemleft = parseInt(gardenparts[i].elemleft) - gardenleft;
      }
      garden.gardenparts = gardenparts;
      var plantings = garden.plantings;
      //convert position to relative for all plantings
      var gardentop = parseInt(garden.elemtop);
      var gardenleft = parseInt(garden.elemleft);
      for (var i = 0; i < plantings.length; i++) {
        plantings[i].elemtop = parseInt(plantings[i].elemtop) - gardentop;
        plantings[i].elemleft = parseInt(plantings[i].elemleft) - gardenleft;
      }
      garden.plantings = plantings;
      return garden;
    });
    return garden.$promise;
  }

  newGarden.$inject = ['GardensService'];

  function newGarden(GardensService) {
    return new GardensService();
  }
})();
