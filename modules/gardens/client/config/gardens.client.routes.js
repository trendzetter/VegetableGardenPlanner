'use strict';

//Setting up route
angular.module('gardens').config(['$stateProvider',
  function($stateProvider) {
    // Gardens state routing
    $stateProvider.
    state('listGardens', {
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
    }).
    state('createGarden', {
      url: '/gardens/create',
      templateUrl: 'modules/gardens/client/views/create-garden.client.view.html'
    }).
    state('viewGarden', {
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
]);
