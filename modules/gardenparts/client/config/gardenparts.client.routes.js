(function () {
  'use strict';

  angular
    .module('gardenparts.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Gardenparts state routing
    $stateProvider.
    state('editGardenpart', {
      url: '/gardenparts/:bk/:selectedDate/:plant',
      templateUrl: 'modules/gardenparts/client/views/edit-gardenpart.client.view.html',
      controller: 'GardenpartsController',
      controllerAs: 'vm',
      resolve: {
        gardenpartResolve: getGardenpart
      },
      data: {
        roles: ['user', 'admin'],
        pageTitle : 'Edit gardenpart'
      }
    });
  }

  getGardenpart.$inject = ['GardenpartService','$stateParams','GardensService','RuleSetsService','PastPlantings'];

  function getGardenpart(GardenpartService,$stateParams,Gardens,RuleSets,PastPlantings) {
    var gardenpart = GardenpartService.get({
      bk: $stateParams.bk,
      selectedDate: $stateParams.selectedDate,
      plant: $stateParams.plant
    });

    // promise then gardenpart.gardenbk
    gardenpart.$promise.then(function(gardenpart) {
        var plantings = gardenpart.plantings;
        var gardenparttop = parseInt(gardenpart.elemtop);
        var gardenpartleft = parseInt(gardenpart.elemleft);
        var i;
        for (i = 0; i < plantings.length; i++) {
          plantings[i].elemtop = parseInt(plantings[i].elemtop) - gardenparttop;
          plantings[i].elemleft = parseInt(plantings[i].elemleft) - gardenpartleft;
        }
        plantings = gardenpart.futureplantings;
        for (i = 0; i < plantings.length; i++) {
          plantings[i].elemtop = parseInt(plantings[i].elemtop) - gardenparttop;
          plantings[i].elemleft = parseInt(plantings[i].elemleft) - gardenpartleft;
          plantings[i].future = true;
        }
    });

    return gardenpart.$promise;
  }
})();
