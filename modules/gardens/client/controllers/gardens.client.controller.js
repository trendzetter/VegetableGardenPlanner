'use strict';

// Gardens controller
angular.module('gardens').controller('GardensController', ['$scope', '$stateParams', '$location', 'Authentication', 'GardensService', 'GardenpartService', 'Gardendata', '$rootScope',
  function($scope, $stateParams, $location, Authentication, Gardens, Gardenpart, Gardendata, $rootScope) {

    $scope.authentication = Authentication;
    $scope.gardenparts = [];

    $scope.tooltiptext = 'testtooltip';
    $scope.factor = 1;

    if (typeof $stateParams.selectedDate === 'undefined') {
      var today = new Date();
      $scope.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
      $stateParams.selectedDate = $scope.selectedDate;
    } else {
      $scope.selectedDate = $stateParams.selectedDate;
    }

    $scope.newGarden = function() {
      $scope.garden = {};
      Gardendata.setGarden($scope.garden);
    };

    // During create > resize
    $scope.updateCoordinates = function(top, left, height, width) {
      $scope.garden.elemtop = top;
      $scope.garden.elemleft = left;
      $scope.garden.elemwidth = width;
      $scope.garden.elemheight = height;
      var opp = Math.round(height * width / 10000);
      $scope.tooltiptext = 'breedte: ' + height + ' cm lengte: ' + width + ' cm ' + 'oppervlakte: ' + opp + ' m² ± ' + Math.round(height * width / 150000) + ' personen';
    };

    $scope.setDate = function(date) {
      $stateParams.selectedDate = date;
      $scope.selectedDate = date;
    };

    // Create new Garden
    $scope.$on('createGarden', function() {
      var user = $scope.authentication.user;
      var garden = new Gardens({
        name: $scope.garden.name,
        elemwidth: $scope.garden.elemwidth,
        elemheight: $scope.garden.elemheight,
        elemtop: $scope.garden.elemtop,
        elemleft: $scope.garden.elemleft,
        validFrom: new Date(0)
      });

      // Redirect after save
      garden.$save(function(response) {
        $location.path('gardens/' + response._id + '/layout/' + $stateParams.selectedDate);
      }, function(errorResponse) {
        Gardendata.setError(errorResponse.data.message);
        $rootScope.$broadcast('error');
      });
    });

    // Remove existing Garden
    $scope.remove = function(garden) {
      if (garden) {
        garden.$remove();

        for (var i in $scope.gardens) {
          if ($scope.gardens[i] === garden) {
            $scope.gardens.splice(i, 1);
          }
        }
      } else {
        $scope.garden.$remove(function() {
          $location.path('gardens');
        });
      }
    };

    // Find existing Garden
    $scope.findOne = function() {
      var bk;
      if (typeof $stateParams.bk === 'undefined') {
        bk = $scope.garden.bk;
      } else {
        bk = $stateParams.bk;
      }
      $scope.garden = Gardens.get({
        bk: bk,
        selectedDate: $stateParams.selectedDate
      });
      Gardendata.setGarden($scope.garden);

      $scope.garden.$promise.then(function(garden) {
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
          var toRemove = [];
          for (var j = 0; j < plantings.length; j++) {
            var planting = plantings[j];
            console.log('next: ');
            console.log('partbottomTop: ' + partbottomTop + ' > planting.elemtop ' + planting.elemtop + ' > part.elemtop ' + part.elemtop);
            console.log('partrightLeft: ' + partrightLeft + ' > planting.elemleft ' + planting.elemleft + ' > part.elemleft > ' + part.elemleft);

            if (partbottomTop > planting.elemtop && planting.elemtop >= part.elemtop && partrightLeft > planting.elemleft && planting.elemleft >= part.elemleft) {
              //convert position to relative for all plantings
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
        $scope.gardenparts = garden.gardenparts;
        $scope.$emit('gardenpartsLoaded');
      });
    };
  }
]);
