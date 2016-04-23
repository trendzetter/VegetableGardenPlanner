(function () {
  'use strict';

  angular
    .module('plantfamilies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('plantfamilies', {
        abstract: true,
        url: '/plantfamilies',
        template: '<ui-view/>'
      })
      .state('plantfamilies.list', {
        url: '',
        templateUrl: 'modules/plant-families/client/views/list-plant-families.client.view.html',
        controller: 'PlantFamiliesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Plant families list'
        }
      })
      .state('plantfamilies.create', {
        url: '/create',
        templateUrl: 'modules/plant-families/client/views/form-plant-family.client.view.html',
        controller: 'PlantFamiliesController',
        controllerAs: 'vm',
        resolve: {
          plantFamilyResolve: newPlantFamily
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Add plant family'
        }
      })
      .state('plantfamilies.edit', {
        url: '/:plantFamilyId/edit',
        templateUrl: 'modules/plant-families/client/views/form-plant-family.client.view.html',
        controller: 'PlantFamiliesController',
        controllerAs: 'vm',
        resolve: {
          plantFamilyResolve: getPlantFamily
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit plant family {{ plantFamilyResolve.name }}'
        }
      })
      .state('plantfamilies.view', {
        url: '/:plantFamilyId',
        templateUrl: 'modules/plant-families/client/views/view-plant-family.client.view.html',
        controller: 'PlantFamiliesController',
        controllerAs: 'vm',
        resolve: {
          plantFamilyResolve: getPlantFamily
        },
        data: {
          pageTitle: 'Plant family {{ plantFamilyResolve.name }}'
        }
      });
  }

  getPlantFamily.$inject = ['$stateParams', 'PlantFamilyService'];

  function getPlantFamily($stateParams, PlantFamilyService) {
    return PlantFamilyService.get({
      plantFamilyId: $stateParams.plantFamilyId
    }).$promise;
  }

  newPlantFamily.$inject = ['PlantFamilyService'];

  function newPlantFamily(PlantFamilyService) {
    return new PlantFamilyService();
  }
}());
