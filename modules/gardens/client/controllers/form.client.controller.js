'use strict';

angular.module('gardens').controller('FormController', ['$scope', 'Gardendata', 'Authentication', '$rootScope',
  function($scope, Gardendata, Authentication, $rootScope) {
    $scope.create = function() {
      $rootScope.$broadcast('createGarden');
    };

    $scope.updateGarden = function() {
      Gardendata.setGarden($scope.garden);
    };

    $scope.$on('error', function() {
      $scope.error = Gardendata.getError();
    });
    $scope.authentication = Authentication;
    $scope.garden = Gardendata.getGarden();

    $scope.setDate = function(date) {
      $scope.garden.selectedDate = date;
    };

    if ($scope.garden.selectedDate === 'undefined') {
      var today = new Date();
      $scope.garden.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
      console.log('selected date! '+$scope.garden.selectedDate);
    }

  }
]);
