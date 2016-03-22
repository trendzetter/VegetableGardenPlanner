'use strict';

//Setting up route
angular.module('gardenparts').config(['$stateProvider',
  function($stateProvider) {
    // Gardenparts state routing
    $stateProvider.
    state('editGardenpart', {
      url: '/gardenparts/:bk/:selectedDate/:plant',
      templateUrl: 'modules/gardenparts/client/views/edit-gardenpart.client.view.html'
    });
  }
]);
