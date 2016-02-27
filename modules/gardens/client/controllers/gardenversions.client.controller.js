'use strict';

angular.module('gardens').controller('GardenversionsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'GardensService', 'Gardenversions', 'GardenpartsService', 'Gardendata',
  function($scope, $state, $stateParams, $location, Authentication, Gardens, Gardenversions, Gardenpart, Gardendata) {
    $scope.authentication = Authentication;
    $scope.gardenparts = [];
    var newparts = [];
    var delparts = [];

    if (typeof $stateParams.selectedDate === 'undefined') {
      var today = new Date();
      $scope.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
      $stateParams.selectedDate = $scope.selectedDate;
    } else {
      $scope.selectedDate = $stateParams.selectedDate;
    }

    // During edit > resize
    $scope.updateCoordinates = function(top, left, height, width) {
      var cancel = false;
      if (top !== $scope.garden.elemtop) {
        //Controleren of alle parts erin passen
        angular.forEach($scope.gardenparts, function(gardenpart, key) {
          var newposition = gardenpart.elemtop - (top - $scope.garden.elemtop);
          if (newposition < 0) {
            cancel = true;
          }
        });
        //En wijzigingen doorvoeren aan gardenparts en garden
        if (!cancel) {
          angular.forEach($scope.gardenparts, function(gardenpart, key) {
            var newposition = gardenpart.elemtop - (top - $scope.garden.elemtop);
            gardenpart.elemtop = newposition;
          });
          $scope.garden.elemtop = top;
          $scope.minHeight = $scope.initialMinHeight + ($scope.initialTop - top);
          //Of een correctie doen aan de hoogte.
        } else {
          height = $scope.garden.elemheight;
        }

      }

      if (left !== $scope.garden.elemleft && !cancel) {
        //Controleren of alle parts erin passen
        angular.forEach($scope.gardenparts, function(gardenpart, key) {
          var newposition = gardenpart.elemleft - (left - $scope.garden.elemleft);
          if (newposition < 0) {
            cancel = true;
          }
        });
        //En wijzigingen doorvoeren aan gardenparts en garden
        if (!cancel) {
          angular.forEach($scope.gardenparts, function(gardenpart, key) {
            var newposition = gardenpart.elemleft - (left - $scope.garden.elemleft);
            gardenpart.elemleft = newposition;
          });
          $scope.garden.elemleft = left;
          $scope.minWidth = $scope.initialMinWidth + ($scope.initialLeft - left);
          //Of een correctie doen aan de breedte.
        } else {
          width = $scope.garden.elemwidth;
        }
      }

      $scope.garden.elemwidth = width;
      $scope.garden.elemheight = height;

      var opp = (height * width / 10000);
      $scope.tooltiptext = 'breedte: ' + height + ' cm<br />lengte: ' + width + ' cm' + '<br />oppervlakte: ' + opp + ' m²<br /> ± ' + Math.round(opp / 15) + ' personen';
      return cancel;
    };

    $scope.deletePart = function(part) {
      if (typeof part._id === 'undefined') {
        var index = newparts.indexOf(part);
        newparts.splice(index, 1);
      } else {
        console.log('delete part: ' + JSON.stringify(part));
        part.validTo = $stateParams.selectedDate;
        delparts.push(part);
      }
    };

    $scope.$on('addNewGardenpart', function(event, tool) {
      var newpart = {
        garden: $scope.garden.bk,
        validFrom: $stateParams.selectedDate,
        type: tool.name
      };
      newparts.push(newpart);
      $scope.gardenparts.push(newpart);
    });

    // Update position/dimentions existing Garden
    $scope.$on('updateGarden', function() {
      $scope.updateParts();
      var garden = $scope.garden;
      garden.validFrom = $scope.selectedDate;
      var leankeepers = [];
      var keepers = garden.keepers;
      for (var i = 0; i < keepers.length; i++) {
        console.log('garden.keepers[i]' + keepers[i]._id);
        leankeepers.push(keepers[i]._id);
      }
      garden.keepers = leankeepers;
      console.log('garden.keepers' + garden.keepers);
      if($state.$current.data && $state.$current.data.name==='gardens.create') $stateParams.selectedDate=$scope.selectedDate;
      garden.selectedDate  = $stateParams.selectedDate;
      garden.$update({
          selectedDate: $scope.selectedDate
        },function (garden) {
           console.log('success, got data: ', garden);
           $state.go('viewGarden', {
             bk: garden.bk,
             selectedDate: $scope.selectedDate
           });
         }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    });

    // Update existing Gardenparts
    $scope.updateParts = function() {
      var garden = $scope.garden;
      newparts._id = garden._id;
      var gardenparts = $scope.gardenparts;
      //convert position to absolute for all gardenparts
      for (var i = 0; i < gardenparts.length; i++) {
        gardenparts[i].elemtop = parseInt(gardenparts[i].elemtop) + parseInt(garden.elemtop);
        gardenparts[i].elemleft = parseInt(gardenparts[i].elemleft) + parseInt(garden.elemleft);
      }

      Gardenpart.createParts({
        bk: garden.bk,
        selectedDate: $stateParams.selectedDate
      }, newparts);

      //Update the modified parts
      //Filter new parts
      var filtered = gardenparts.filter(function(x) {
        return newparts.indexOf(x) < 0;
      });
      var modified = [];
      for (i = 0; i < filtered.length; i++) {
        if (filtered[i].modified) {
          delete filtered[i].modified;
          modified.push(filtered[i]);
        }
      }
      if (modified.length > 0)
        Gardenpart.updateParts({
          bk: garden.bk,
          selectedDate: $stateParams.selectedDate
        }, modified);

      Gardenpart.deleteParts({
        bk: garden.bk,
        selectedDate: $stateParams.selectedDate
      }, delparts);
      $state.go('viewGarden', {
        bk: garden.bk,
        selectedDate: $scope.selectedDate
      });
    };


    $scope.findOneVersion = function() {
      $scope.garden = Gardenversions.get({
        gardenId: $stateParams.gardenId,
        selectedDate: $stateParams.selectedDate
      });

      Gardendata.setGarden($scope.garden);

      $scope.garden.$promise.then(function(garden) {
        var gardenparts = garden.gardenparts;
        //convert position to relative for all gardenparts
        var gardentop = parseInt(garden.elemtop);
        var gardenleft = parseInt(garden.elemleft);
        for (var i = 0; i < gardenparts.length; i++) {
          gardenparts[i].elemtop = parseInt(gardenparts[i].elemtop) - gardentop;
          gardenparts[i].elemleft = parseInt(gardenparts[i].elemleft) - gardenleft;
        }
        $scope.gardenparts = gardenparts;
        $scope.$emit('gardenpartsLoaded');
      });
    };

    $scope.findVersions = function() {
      $scope.gardens = Gardenversions.query({
        selectedDate: null
      });
    };
  }
]);
