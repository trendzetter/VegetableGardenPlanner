'use strict';

angular.module('gardens').controller('FormController', ['$scope', 'Gardendata', 'Authentication', '$rootScope',
  function($scope, Gardendata, Authentication, $rootScope) {
    $scope.create = function() {
      $rootScope.$broadcast('createGarden');
    };

    $scope.updateGarden = function() {
      Gardendata.setGarden($scope.vm.garden);
    };

    $scope.$on('error', function() {
      $scope.error = Gardendata.getError();
    });
    $scope.authentication = Authentication;
    $scope.vm.garden = Gardendata.getGarden();

    $scope.setDate = function(date) {
      $scope.vm.garden.selectedDate = date;
    };

    if ($scope.vm.garden && $scope.vm.garden.selectedDate === 'undefined') {
      var today = new Date();
      $scope.vm.garden.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
      console.log('selected date! '+$scope.garden.selectedDate);
    }

  }
]);
