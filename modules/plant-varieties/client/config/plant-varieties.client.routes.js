(function () {
  'use strict';

  angular
    .module('plant-varieties.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('plant-varieties', {
        abstract: true,
        url: '/plant-varieties',
        template: '<ui-view/>'
      })
      .state('plant-varieties.list', {
        url: '',
        templateUrl: 'modules/plant-varieties/client/views/list-plant-varieties.client.view.html',
        controller: 'PlantVarietiesListController',
        controllerAs: 'vm'
      })
      .state('plant-varieties.create', {
        url: '/create',
        templateUrl: 'modules/plant-varieties/client/views/form-plant-variety.client.view.html',
        controller: 'PlantVarietiesController',
        controllerAs: 'vm',
        resolve: {
          plantVarietyResolve: newPlantVariety
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('plant-varieties.edit', {
        url: '/:plantVarietyId/edit',
        templateUrl: 'modules/plant-varieties/client/views/form-plant-variety.client.view.html',
        controller: 'PlantVarietiesController',
        controllerAs: 'vm',
        resolve: {
          plantVarietyResolve: getPlantVariety
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('plant-varieties.view', {
        url: '/:plantVarietyId',
        templateUrl: 'modules/plant-varieties/client/views/view-plant-variety.client.view.html',
        controller: 'PlantVarietiesController',
        controllerAs: 'vm',
        resolve: {
          plantVarietyResolve: getPlantVariety
        }
      });
  }

  getPlantVariety.$inject = ['$stateParams', 'PlantVarietiesService'];

  function getPlantVariety($stateParams, PlantVarietiesService) {
    return PlantVarietiesService.get({
      plantVarietyId: $stateParams.plantVarietyId
    }).$promise;
  }

  newPlantVariety.$inject = ['PlantVarietiesService'];

  function newPlantVariety(PlantVarietiesService) {
    return new PlantVarietiesService();
  }
})();