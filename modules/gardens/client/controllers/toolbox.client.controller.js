'use strict';

angular.module('gardens').controller('ToolboxController', ['$scope', '$rootScope', 'GardensService',
  function($scope, $rootScope, Gardens) {

    $scope.addNewGardenpart = function(tool) {
      $rootScope.$broadcast('addNewGardenpart', tool);

    };

    var garden = $scope.garden;
    $scope.toolboxInit = function() {
      // Some initialization


    };
  }
]);
