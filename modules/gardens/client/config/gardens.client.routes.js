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
        roles: ['user', 'admin'],
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
      templateUrl: 'modules/gardens/client/views/view-garden.client.view.html',
      controller: 'PlantGardenController',
      controllerAs: 'vm',
      resolve: {
        gardenResolve: getGarden
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle : 'Plant garden'
      }
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
      selectedDate: $stateParams.selectedDate,
      plant: $stateParams.plant
  });
    garden.$promise.then(function(garden) {
      var gardenparts = garden.gardenparts;
      var plantings = garden.plantings;

      //convert position to relative for all gardenparts and add the plantings
      var gardentop = parseInt(garden.elemtop);
      var gardenleft = parseInt(garden.elemleft);

      for (var i = 0; i < gardenparts.length; i++) {
        var part = gardenparts[i];
        var partbottomTop = parseInt(part.elemtop) + parseInt(part.elemheight);
        var partrightLeft = parseInt(part.elemleft) + parseInt(part.elemwidth);

        part.plantings = [];
        part.pastplantings = [];
        var toRemove = [];
        for (var j = 0; j < plantings.length; j++) {
          var planting = plantings[j];
          console.log('next: ');
          console.log('partbottomTop: ' + partbottomTop + ' > planting.elemtop ' + planting.elemtop + ' > part.elemtop ' + part.elemtop);
          console.log('partrightLeft: ' + partrightLeft + ' > planting.elemleft ' + planting.elemleft + ' > part.elemleft > ' + part.elemleft);

          if (partbottomTop > planting.elemtop && planting.elemtop >= part.elemtop && partrightLeft > planting.elemleft && planting.elemleft >= part.elemleft) {
            //convert position to relative for all plantings and add to gardenparts
            planting.elemtop = parseInt(planting.elemtop) - parseInt(part.elemtop);
            planting.elemleft = parseInt(planting.elemleft) - parseInt(part.elemleft);
            part.plantings.push(planting);
            console.log('planting pushed!');
            toRemove.push(j);
          }

        }
        while (toRemove.length > 0) {
          plantings.splice(toRemove.pop(), 1);
        }
        //convert position to relative for all gardenparts
        part.elemtop = parseInt(part.elemtop) - gardentop;
        part.elemleft = parseInt(part.elemleft) - gardenleft;
      }
      return garden;
    });
    return garden.$promise;
  }

  newGarden.$inject = ['GardensService'];

  function newGarden(GardensService) {
    return new GardensService();
  }
})();
