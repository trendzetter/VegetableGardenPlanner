'use strict';

angular.module('gardens').controller('GardenpartController', ['$scope', '$stateParams', '$location', 'Authentication', 'GardenpartService',
  function($scope, $stateParams, $location, Authentication, Gardenpart) {
    $scope.menuOptions = [];
    /* For new plantings */
    if (typeof $scope.gardenpart._id === 'undefined') {
      $scope.menuOptions.push(['Rotate', function() {
        $scope.rotate();
      }]);
      $scope.menuOptions.push(null); // Dividier
    }

    $scope.menuOptions.push(['Remove', function() {
      var part = $scope.gardenparts.splice($scope.$index, 1);
      $scope.deletePart(part[0]);
    }]);

    $scope.update = function(top, left, width, height) {
      $scope.tooltiptext = '<br />breedte: ' + height + ' cm<br />lengte: ' + width + ' cm' + '<br />oppervlakte: ' + (height * width / 10000) + ' m²';
      var gardenpart = $scope.gardenpart;
      gardenpart.elemtop = top;
      gardenpart.elemleft = left;
      gardenpart.elemwidth = width;
      gardenpart.elemheight = height;
      //  console.log('gardenpart controller update top: ' + gardenpart.elemtop + ' ' +  gardenpart.elemleft + ' ' + gardenpart.elemwidth + ' ' + gardenpart.elemheight);
    };
  }
]);
